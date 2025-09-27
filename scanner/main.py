"""
Source
------
Based on https://github.com/sehnauoi/blue-archive-jp-assets-downloader
"""

from pathlib import Path

import requests
from pymongo import MongoClient

from config import CONFIG
from download import BundleDownloader
from extractor import Extractor
from saver import Saver
from url_fetcher import UrlFetcher


def get_asset_base_url() -> str:
    response = requests.get(CONFIG.request_url)
    data = response.json()

    connection_group = data["ConnectionGroups"][0]
    override_group = connection_group['OverrideConnectionGroups'][-1]
    return override_group['AddressablesCatalogUrlRoot']


def main():
    apk_path = Path("local") / "apks"
    bundle_path = Path("local") / "bundles"
    extracted_path = Path("local") / "extracted"
    public_img_path = Path("pages/public/imgs/students")

    target_bundle_names = ["01_common-01_character"]

    target_dirs = [
        "Assets/_MX/AddressableAsset/UIs/01_Common/01_Character",
    ]

    db = MongoClient(CONFIG.mongodb_uri).get_default_database()
    collections = ["urls", "students"]

    for collection in collections:
        if collection not in db.list_collection_names():
            db.create_collection(collection)

    url_collection = db["urls"]
    url_fetcher = UrlFetcher(cache_dir=apk_path, collection=url_collection)

    patch_url = url_fetcher.patch_url
    bundle_downloader = BundleDownloader(
        url=patch_url,
        dst_dir=bundle_path,
        target_bundle_names=target_bundle_names,
        use_update=True
    )
    bundle_downloader.download()

    extractor = Extractor(src_dir=bundle_path, dst_dir=extracted_path, target_dirs=target_dirs)
    extractor.extract()

    student_collection = db["students"]
    saver = Saver(
        src_dir=extracted_path,
        dst_dir=public_img_path,
        collection=student_collection
    )
    saver.save()


if __name__ == "__main__":
    main()
