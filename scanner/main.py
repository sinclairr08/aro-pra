"""
Source
------
Based on https://github.com/sehnauoi/blue-archive-jp-assets-downloader
"""

from pathlib import Path

import requests
from pymongo import MongoClient

from apk_extractor import ApkExtractor
from config import CONFIG
from download import BundleDownloader
from extractor import Extractor
from saver import Saver


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
    public_img_path = Path("frontend/public/imgs/students")

    target_bundle_names = ["01_common-01_character"]

    target_dirs = [
        "Assets/_MX/AddressableAsset/UIs/01_Common/01_Character",
    ]

    apk_extractor = ApkExtractor(
        cache_dir=apk_path
    )

    catalog_url = apk_extractor.get_catalog_url()
    patch_url = f"{catalog_url}/Android_PatchPack/BundlePackingInfo.json"

    bundle_downloader = BundleDownloader(
        url=patch_url,
        dst_dir=bundle_path,
        target_bundle_names=target_bundle_names,
        use_update=True
    )
    bundle_downloader.download()

    extractor = Extractor(src_dir=bundle_path, dst_dir=extracted_path, target_dirs=target_dirs)
    extractor.extract()

    student_collection = MongoClient(CONFIG.mongodb_uri).get_default_database()["students"]
    saver = Saver(
        src_dir=extracted_path,
        dst_dir=public_img_path,
        collection=student_collection
    )
    saver.save()


if __name__ == "__main__":
    main()
