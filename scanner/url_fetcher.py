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


def fetch_data(url: str, cache_name: str) -> dict:
    with CachedSession(cache_name=cache_name, use_temp=True) as session:
        try:
            return session.get(url).json()

        except (ConnectionError, TimeoutError) as e:
            print("Connection failed")
            raise SystemExit(1) from e


class UrlFetcher:
    def __init__(self, cache_dir: Path, collection: pymongo.collection.Collection):
        if not cache_dir.exists():
            cache_dir.mkdir(parents=True, exist_ok=True)

        self.cache_dir = cache_dir
        self.apk = Apk(cache_dir=cache_dir)
        self.collection = collection

        today = get_today()

        self.download_and_extract_apk()
        self.server_url = self.decrypt_game_config(self.find_game_config())

        if self.server_url is None:
            raise ValueError("server url does not exist")

        server_data = fetch_data(url=self.server_url, cache_name='serverapi')
        self.catalog_url = server_data['ConnectionGroups'][0]['OverrideConnectionGroups'][-1][
            'AddressablesCatalogUrlRoot']

        if self.catalog_url is None:
            raise ValueError("catalog url does not exist")

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

    @property
    def patch_url(self):
        return f"{self.catalog_url}/Android_PatchPack/BundlePackingInfo.json"
