import datetime
import json
from base64 import b64encode
from pathlib import Path
from zoneinfo import ZoneInfo

import pymongo
from bacy import convert_string, new_encrypt_string, create_key
from requests_cache import CachedSession

from apk_extractor import Apk

MAGIC_PATTERN = [0x47, 0x61, 0x6D, 0x65, 0x4D, 0x61, 0x69, 0x6E, 0x43, 0x6F, 0x6E, 0x66, 0x69, 0x67, 0x00, 0x00, 0x92,
                 0x03, 0x00, 0x00]


def get_today():
    return datetime.datetime.now(ZoneInfo("Asia/Seoul")).strftime("%Y%m%d")


def get_yesterday():
    return (datetime.datetime.now(ZoneInfo("Asia/Seoul")) - datetime.timedelta(days=1)).strftime("%Y%m%d")


class UrlFetcher:
    def __init__(self, cache_dir: Path, collection: pymongo.collection.Collection):
        if not cache_dir.exists():
            cache_dir.mkdir(parents=True, exist_ok=True)

        self.cache_dir = cache_dir
        self.apk = Apk(cache_dir=cache_dir)
        self.collection = collection

        self.server_url = None
        self.catalog_url = None

        self.is_updated = self._get_is_updated()

    def download_and_extract_apk(self):
        if not self.apk.apk_exists():
            print("APK doesn't exist. Downloading...")
            self.apk.download_apk()
        elif self.apk.is_outdated():
            print("APK is outdated. Updating...")
            self.apk.download_apk()
        else:
            print("APK is up to date")
            self.apk.extract_apk()

    def find_game_config(self) -> None | bytes:
        pattern = bytes(MAGIC_PATTERN)
        game_path = self.cache_dir / 'data' / 'assets' / 'bin' / 'Data'

        for config_file in game_path.rglob('*'):
            if config_file.is_file():
                content = config_file.read_bytes()

                if pattern in content:
                    start_index = content.index(pattern)
                    data = content[start_index + len(pattern):]
                    return data[:-2]
        return None

    def decrypt_game_config(self, data) -> str:
        encoded_data = b64encode(data).decode()

        game_config = create_key(b'GameMainConfig')
        server_data = create_key(b'ServerInfoDataUrl')

        decrypted_data = convert_string(encoded_data, game_config)
        loaded_data = json.loads(decrypted_data)

        decrypted_key = new_encrypt_string('ServerInfoDataUrl', server_data)
        decrypted_value = loaded_data[decrypted_key]
        return convert_string(decrypted_value, server_data)

    def _get_is_updated(self) -> bool:
        today = get_today()

        has_both_url = all(
            self.collection.find_one({"kind": k, "date": today}) is not None
            for k in ["server", "catalog"]
        )

        if has_both_url:
            return False

        self.init_url()
        url_datas = [
            {"kind": "server", "date": today, "url": self.server_url},
            {"kind": "catalog", "date": today, "url": self.catalog_url},
        ]
        for url_data in url_datas:
            self.collection.update_one(
                {"kind": url_data["kind"], "date": url_data["date"]},
                {"$set": url_data},
                upsert=True
            )

        yesterday = get_yesterday()
        doc = self.collection.find_one({"kind": "catalog", "date": yesterday}, {"url": 1})
        yesterday_catalog_url = doc["url"] if doc else None

        if yesterday_catalog_url is None:
            return True

        return self.catalog_url != yesterday_catalog_url

    def fetch_data(self, url: str, cache_name: str) -> dict:
        with CachedSession(cache_name=cache_name, use_temp=True) as session:
            try:
                return session.get(url).json()

            except (ConnectionError, TimeoutError) as e:
                print("Connection failed")
                raise SystemExit(1) from e

    def init_url(self):
        self.download_and_extract_apk()
        self.server_url = self.decrypt_game_config(self.find_game_config())

        server_data = self.fetch_data(self.server_url, 'serverapi')
        self.catalog_url = server_data['ConnectionGroups'][0]['OverrideConnectionGroups'][-1][
            'AddressablesCatalogUrlRoot']

        if self.server_url is None or self.catalog_url is None:
            raise ValueError("server or catalog url is None")

    @property
    def patch_url(self):
        return f"{self.catalog_url}/Android_PatchPack/BundlePackingInfo.json"
