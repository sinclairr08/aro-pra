"""
Source
------
Based on following projects
  - https://github.com/sehnauoi/blue-archive-jp-assets-downloader
  - https://github.com/fiseleo/BlueArchiveDownloaderJP
  - https://github.com/Sunset-Edu-Tech-Group/BA-AD
  - https://github.com/K0lb3s-Datamines/Blue-Archive---Asset-Downloader
"""
import logging
import os
import zipfile
from abc import ABC, abstractmethod
from pathlib import Path

import requests


def is_file_exist_and_valid(local_path: str, size: int) -> bool:
    return os.path.exists(local_path) and os.path.getsize(local_path) == size


class BaseDownloader(ABC):
    def __init__(self, url: str, dst_dir: Path):
        self.url = url
        self.dst_dir = dst_dir
        self.session = requests.Session()
        self.logger = logging.getLogger(__name__)

        self.dst_dir.mkdir(parents=True, exist_ok=True)

    @abstractmethod
    def download(self):
        pass

    def download_file(self, download_url: str, local_path: str, size: int):
        data = self.session.get(download_url).content

        if len(data) != size:
            self.logger.warning(f"No file matched {len(data)=}, {size=}, skip saving")
            return

        with open(local_path, "wb") as f:
            f.write(data)

        self.logger.info(f"Downloaded {local_path} successfully")


class BundleDownloader(BaseDownloader):
    def __init__(self, url: str, dst_dir: Path, target_bundle_names: list[str], use_update: bool = True):
        super().__init__(url=url, dst_dir=dst_dir)
        self.use_update = use_update
        self.target_bundle_names = target_bundle_names

    def is_target_bundle_name(self, bundle_name: str) -> bool:
        return any(t in bundle_name for t in self.target_bundle_names)

    def is_target_pack(self, pack) -> bool:
        bundle_files = pack["BundleFiles"]

        for bundle_file in bundle_files:
            bundle_name = bundle_file["Name"]

            if self.is_target_bundle_name(bundle_name):
                return True

        return False

    def download_pack(self, pack):
        pack_name = pack["PackName"]
        pack_size = pack["PackSize"]
        pack_url = self.url.rsplit("/", 1)[0] + f"/{pack_name}"

        local_path = self.dst_dir / pack_name

        if is_file_exist_and_valid(local_path=local_path, size=pack_size):
            self.logger.info(f"Already exist, skip {pack_name}")
            return

        self.logger.info(f"Downloading {pack_name}")
        self.download_file(download_url=pack_url, local_path=local_path, size=pack_size)

    def download(self):
        if any(self.dst_dir.rglob("*.bundle")):
            return

        data = requests.get(self.url).json()
        if self.use_update:
            packs = data["UpdatePacks"]
        else:
            packs = data["FullPatchPacks"]

        for pack in packs:
            if self.is_target_pack(pack):
                self.download_pack(pack)

        for zip_path in self.dst_dir.rglob("*.zip"):
            with zipfile.ZipFile(zip_path, "r") as zip_ref:
                zip_ref.extractall(self.dst_dir)
            os.remove(zip_path)

        for bundle_path in self.dst_dir.rglob("*.bundle"):
            bundle_name = bundle_path.name
            if not self.is_target_bundle_name(bundle_name):
                os.remove(bundle_path)

            self.logger.info(f"{bundle_name} found")

# FIXME
# class MediaDownloader(BaseDownloader):
#     def __init__(self, asset_base_url: str, dst_dir: Path):
#         super().__init__(asset_base_url=asset_base_url, dst_dir=dst_dir)
#
#         self.media_base_url = f"{self.asset_base_url}/MediaResources"
#         self.media_info_url = f"{self.asset_base_url}/MediaResources/MediaCatalog.json"
#
#     def download(self):
#         response = requests.get(self.media_info_url)
#         media_infos = response.json()["Table"]
#
#         for media_info in media_infos.values():
#             self.download_media(media_info)
#
#     def download_media(self, media_info):
#         media_name = media_info["fileName"]
#         media_path = media_info["path"]
#         media_size = media_info["bytes"]
#
#         media_url = f"{self.media_base_url}/{media_path}"
#         local_path = self.dst_dir / media_path
#
#         os.makedirs(os.path.dirname(local_path), exist_ok=True)
#
#         if is_file_exist_and_valid(local_path=local_path, size=media_size):
#             self.logger.info(f"Already exist, skip {media_name=}")
#             return
#
#         self.download_file(url=media_url, local_path=local_path, size=media_size)
