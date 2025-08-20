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
    url = CONFIG.url

    bundle_path = Path("local") / "bundles"
    extracted_path = Path("local") / "extracted"

    target_bundle_names = ["01_common-01_character"]

    target_dirs = [
        "Assets/_MX/AddressableAsset/UIs/01_Common/01_Character",
    ]

    bundle_downloader = BundleDownloader(
        url=url,
        dst_dir=bundle_path,
        target_bundle_names=target_bundle_names
    )
    bundle_downloader.download()

    extractor = Extractor(src_dir=bundle_path, dst_dir=extracted_path, target_dirs=target_dirs)
    extractor.extract()


if __name__ == "__main__":
    main()
