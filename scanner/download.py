"""
Source
------
Based on https://github.com/sehnauoi/blue-archive-jp-assets-downloader
"""
import logging
import os

import requests


def is_file_exist_and_valid(local_path: str, size: int) -> bool:
    return os.path.exists(local_path) and os.path.getsize(local_path) == size


class BundleDownloader:
    def __init__(self, asset_base_url: str, dst_dir: str):
        self.asset_base_url = asset_base_url
        self.bundle_base_url = f"{self.asset_base_url}/Android"
        self.bundle_info_url = f"{self.asset_base_url}/Android/bundleDownloadInfo.json"
        self.dst_dir = dst_dir
        self.session = requests.Session()
        self.logger = logging.getLogger(__name__)

        os.makedirs(self.dst_dir, exist_ok=True)

    def download(self):
        response = requests.get(self.bundle_info_url)
        bundle_infos = response.json()["BundleFiles"]

        for bundle_info in bundle_infos:
            self.download_bundle(bundle_info)

    def download_bundle(self, bundle_info):
        print(bundle_info)  # For test

        bundle_name = bundle_info["name"]
        bundle_url = f"{self.bundle_base_url}/{bundle_name}"

        local_path = os.path.join(self.dst_dir, bundle_name)

        if is_file_exist_and_valid(local_path=local_path, size=bundle_info["Size"]):
            self.logger.info(f"Already exist, skip {bundle_name=}")
            return

        self.download_file(url=bundle_url, local_path=local_path, size=bundle_info["Size"])

    def download_file(self, url: str, local_path: str, size: int):
        data = self.session.get(url).content

        if len(data) != size:
            self.logger.warning(f"No file matched {len(data)=}, {size=}, skip saving")
            return

        with open(local_path, "wb") as f:
            f.write(data)

        self.logger.info(f"Downloaded {local_path} successfully")
