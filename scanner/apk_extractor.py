"""
Source
------
Based on following project
  - https://github.com/Sunset-Edu-Tech-Group/BA-AD/tree/main/baad/utils
"""

import shutil
from pathlib import Path
from zipfile import ZipFile

import cloudscraper
import requests

APK_URL = "https://d.apkpure.com/b/XAPK/com.YostarJP.BlueArchive?version=latest"


def delete_directory(directory: Path) -> bool:
    if directory.exists():
        shutil.rmtree(directory)
        return True
    return False


def check_extracted_files(data_dir: Path) -> bool:
    required_path = data_dir / "data" / "assets" / "bin" / "Data"
    return required_path.exists() and any(required_path.iterdir())


def get_zip_file_infos(zip_file: Path) -> list:
    with ZipFile(zip_file, "r") as zip:
        return [file_info for file_info in zip.infolist() if not file_info.is_dir()]


def extract_files_from_zip(
    zip_file: Path, extract_path: Path, file_infos: list = None, filter_path: str = None
) -> None:
    with ZipFile(zip_file, "r") as zip:
        if file_infos is None:
            if filter_path:
                file_infos = [
                    file
                    for file in zip.infolist()
                    if not file.is_dir() and file.filename.startswith(filter_path)
                ]
            else:
                file_infos = [file for file in zip.infolist() if not file.is_dir()]

        for file_info in file_infos:
            target_path = extract_path / Path(file_info.filename)
            target_path.parent.mkdir(parents=True, exist_ok=True)

            zip.extract(file_info, extract_path)


class Apk:
    def __init__(
        self, cache_dir: Path, apk_url: str | None = None, apk_path: str | None = None
    ) -> None:
        self.apk_url = apk_url or APK_URL

        self.root = Path(__file__).parent.parent
        self.cache_dir = cache_dir
        self.apk_path = apk_path or self.cache_dir / "BlueArchive.xapk"

        self.scraper = cloudscraper.create_scraper()

    def apk_exists(self) -> bool:
        return Path(self.apk_path).exists()

    def is_outdated(self) -> bool:
        if not self.apk_exists():
            return True

        remote_size = self._fetch_size()
        if remote_size is None:
            return True

        local_size = Path(self.apk_path).stat().st_size
        return local_size < remote_size

    def _fetch_size(self) -> int | None:
        try:
            response = self.scraper.get(self.apk_url, stream=True)
            return int(response.headers.get("content-length", 0))
        except (
            ConnectionError,
            TimeoutError,
            requests.exceptions.RequestException,
        ) as e:
            print(e)
            return None

    def _get_response(self) -> requests.Response | SystemExit:
        try:
            return self.scraper.get(self.apk_url, stream=True)
        except (
            ConnectionError,
            TimeoutError,
            requests.exceptions.RequestException,
        ) as e:
            print(e)
            raise SystemExit(1) from e

    def _download_file(self, response: requests.Response) -> None:
        apk_path = Path(self.apk_path)

        with open(apk_path, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)

    def _force_download(self) -> None:
        response = self._get_response()
        if isinstance(response, requests.Response):
            self._delete_outdated_files()
            self._download_file(response)

    def _delete_outdated_files(self) -> None:
        xapk_path = Path(self.apk_path)
        apk_folder = xapk_path.parent / "apk"
        data_folder = xapk_path.parent / "data"

        for folder in [apk_folder, data_folder]:
            delete_directory(folder)

    def _parse_zipfile(
        self, apk_path: Path, extract_path: Path, filter_path: str = None
    ) -> None:
        file_infos = get_zip_file_infos(apk_path)
        self._extract_files(apk_path, file_infos, extract_path, filter_path)

    def _extract_files(
        self,
        zip_path: Path,
        file_infos: list,
        extract_path: Path,
        filter_path: str = None,
    ) -> None:
        extract_files_from_zip(zip_path, extract_path, file_infos, filter_path)

    def download_apk(self, update: bool = False) -> None:
        if update or not self.apk_exists():
            self._force_download()
            self.extract_apk()
            return

        if self.is_outdated():
            self._force_download()
            return

        if not check_extracted_files(self.cache_dir):
            self.extract_apk()

    def extract_apk(self) -> None:
        if check_extracted_files(self.cache_dir):
            return

        xapk_path = Path(self.apk_path)
        apk_path = self.cache_dir / "apk"
        data_path = self.cache_dir / "data"
        unity_apk = apk_path / "UnityDataAssetPack.apk"

        self._parse_zipfile(xapk_path, apk_path)

        self._parse_zipfile(unity_apk, data_path, "assets/bin/Data")
