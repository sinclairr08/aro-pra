"""
Source
------
Based on https://github.com/sehnauoi/blue-archive-jp-assets-downloader
"""
import logging
import os
from abc import ABC, abstractmethod
from pathlib import Path

import requests


def is_file_exist_and_valid(local_path: str, size: int) -> bool:
    return os.path.exists(local_path) and os.path.getsize(local_path) == size


class BaseDownloader(ABC):
    def __init__(self, asset_base_url: str, dst_dir: Path):
        self.asset_base_url = asset_base_url
        self.dst_dir = dst_dir
        self.session = requests.Session()
        self.logger = logging.getLogger(__name__)

        self.dst_dir.mkdir(parents=True, exist_ok=True)

    @abstractmethod
    def download(self):
        pass

    def download_file(self, url: str, local_path: str, size: int):
        data = self.session.get(url).content

        if len(data) != size:
            self.logger.warning(f"No file matched {len(data)=}, {size=}, skip saving")
            return

        with open(local_path, "wb") as f:
            f.write(data)

        self.logger.info(f"Downloaded {local_path} successfully")


class BundleDownloader(BaseDownloader):
    def __init__(self, asset_base_url: str, dst_dir: Path):
        super().__init__(asset_base_url=asset_base_url, dst_dir=dst_dir)

        self.bundle_base_url = f"{self.asset_base_url}/Android"
        self.bundle_info_url = f"{self.asset_base_url}/Android/bundleDownloadInfo.json"
        self.target_bundle_names = ["01_common-20_operator", "01_common-01_character"]

    def download(self):
        response = requests.get(self.bundle_info_url)
        bundle_infos = response.json()["BundleFiles"]

        for bundle_info in bundle_infos:
            self.download_bundle(bundle_info)

    def is_target_bundle_name(self, bundle_name: str) -> bool:
        return any(t in bundle_name for t in self.target_bundle_names)

    def download_bundle(self, bundle_info):
        bundle_name = bundle_info["Name"]
        if not self.is_target_bundle_name(bundle_name):
            return

        bundle_url = f"{self.bundle_base_url}/{bundle_name}"

        local_path = self.dst_dir / bundle_name

        if is_file_exist_and_valid(local_path=local_path, size=bundle_info["Size"]):
            self.logger.info(f"Already exist, skip {bundle_name=}")
            return

        self.download_file(url=bundle_url, local_path=local_path, size=bundle_info["Size"])


class MediaDownloader(BaseDownloader):
    def __init__(self, asset_base_url: str, dst_dir: Path):
        super().__init__(asset_base_url=asset_base_url, dst_dir=dst_dir)

        self.media_base_url = f"{self.asset_base_url}/MediaResources"
        self.media_info_url = f"{self.asset_base_url}/MediaResources/MediaCatalog.json"

    def download(self):
        response = requests.get(self.media_info_url)
        media_infos = response.json()["Table"]

        for media_info in media_infos.values():
            self.download_media(media_info)

    def download_media(self, media_info):
        media_name = media_info["fileName"]
        media_path = media_info["path"]
        media_size = media_info["bytes"]

        media_url = f"{self.media_base_url}/{media_path}"
        local_path = self.dst_dir / media_path

        os.makedirs(os.path.dirname(local_path), exist_ok=True)

        if is_file_exist_and_valid(local_path=local_path, size=media_size):
            self.logger.info(f"Already exist, skip {media_name=}")
            return

        self.download_file(url=media_url, local_path=local_path, size=media_size)
