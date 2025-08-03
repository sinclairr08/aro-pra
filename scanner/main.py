"""
Source
------
Based on https://github.com/sehnauoi/blue-archive-jp-assets-downloader
"""

import requests

from config import CONFIG
from download import MediaDownloader, BundleDownloader


def get_asset_base_url():
    response = requests.get(CONFIG.request_url)
    data = response.json()

    connection_group = data["ConnectionGroups"][0]
    override_group = connection_group['OverrideConnectionGroups'][-1]
    addressable_root = override_group['AddressablesCatalogUrlRoot']

    return addressable_root


def main():
    asset_base_url = get_asset_base_url()
    BundleDownloader(asset_base_url=asset_base_url, dst_dir="./bundles")
    MediaDownloader(asset_base_url=asset_base_url, dst_dir="./medias")


if __name__ == "__main__":
    main()
