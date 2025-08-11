"""
Source
------
Based on https://github.com/sehnauoi/blue-archive-jp-assets-downloader
"""

from pathlib import Path

import requests

from config import CONFIG
from download import BundleDownloader
from extractor import Extractor


def get_asset_base_url() -> str:
    response = requests.get(CONFIG.request_url)
    data = response.json()

    connection_group = data["ConnectionGroups"][0]
    override_group = connection_group['OverrideConnectionGroups'][-1]
    return override_group['AddressablesCatalogUrlRoot']


def main():
    asset_base_url = get_asset_base_url()

    bundle_path = Path(CONFIG.version) / "bundles"
    extracted_path = Path(CONFIG.version) / "extracted"

    target_dirs = [
        "Assets/_MX/AddressableAsset/UIs/01_Common/01_Character",
        "Assets/_MX/AddressableAsset/UIs/01_Common/20_Operator"
    ]

    bundle_downloader = BundleDownloader(asset_base_url=asset_base_url, dst_dir=bundle_path)
    bundle_downloader.download()

    extractor = Extractor(src_dir=bundle_path, dst_dir=extracted_path, target_dirs=target_dirs)
    extractor.extract()

    # media_downloader = MediaDownloader(asset_base_url=asset_base_url, dst_dir="./medias")
    # media_downloader.download()


if __name__ == "__main__":
    main()
