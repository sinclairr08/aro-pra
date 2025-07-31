"""
Source
------
Based on https://github.com/sehnauoi/blue-archive-jp-assets-downloader
"""

import os
from typing import Tuple

import UnityPy
import requests

print(UnityPy.__version__)

session = requests.Session()

BA_JP_BUNDLES_DIR = './ba_jp_bundles'
BA_JP_MEDIA_DIR = './ba_jp_media'

os.makedirs(BA_JP_BUNDLES_DIR, exist_ok=True)
os.makedirs(BA_JP_MEDIA_DIR, exist_ok=True)

current_version = 'r52_uulekwyjhzir122lpbrw'
BA_JP_VERSION_METADATA = f"https://yostar-serverinfo.bluearchiveyostar.com/{current_version}.json"

current_version_assets_base_url = (
    requests.get(BA_JP_VERSION_METADATA).json()
    ["ConnectionGroups"][0]
    ['OverrideConnectionGroups'][-1]
    ['AddressablesCatalogUrlRoot']
)

BA_JP_ANDROID_BUNDLE_DOWNLOAD_INFO = f"{current_version_assets_base_url}/Android/bundleDownloadInfo.json"

bundles_to_download = requests.get(BA_JP_ANDROID_BUNDLE_DOWNLOAD_INFO).json()['BundleFiles']


def download_ba_jp_bundle(bundle_base_url: str, bundles: list, output_dir: str) -> Tuple[int, int, int]:
    '''
    returns:
        bundle count given,
        downloaded,
        skipped
    '''
    downloaded_count = 0
    skipped_count = 0
    for bundle in bundles:
        bundle_name = bundle['Name']
        url = f'{bundle_base_url}{bundle_name}'
        bundle_local_path = os.path.join(output_dir, bundle_name)
        if not (os.path.exists(bundle_local_path) and os.path.getsize(bundle_local_path) == bundle["Size"]):
            print(f'Downloading {bundle_name} from {url}')
            data = session.get(url).content
            with open(bundle_local_path, "wb") as f:
                f.write(data)
            if len(data) != bundle["Size"]:
                print(f'Size mismatch for {bundle_name}: {len(data)}, should be {bundle["Size"]}')
            print(f'{bundle_name} written to {bundle_local_path}')
            downloaded_count += 1
        else:
            print(f'Skipping {bundle_name} as it already exists')
            skipped_count += 1
    return len(bundles), downloaded_count, skipped_count


def download_ba_jp_media(media_base_url: str, media_list: dict, output_dir: str) -> Tuple[int, int, int]:
    '''
    returns:
        media count given,
        downloaded,
        skipped
    '''
    downloaded_count = 0
    skipped_count = 0
    for media_key in media_list:
        media = media_list[media_key]
        media_name = media['fileName']
        media_path = media['path']
        media_local_path = os.path.join(output_dir, media_path)
        url = f'{media_base_url}{media_path}'
        if not (os.path.exists(media_local_path) and os.path.getsize(media_local_path) == media["bytes"]):
            print(f'Downloading {media_name} from {url}')
            try:
                os.remove(media_local_path)
            except:
                pass
            os.makedirs(media_local_path, exist_ok=True)
            os.rmdir(media_local_path)
            data = session.get(url).content
            with open(media_local_path, "wb") as f:
                f.write(data)
            print(f'{media_name} written to {media_local_path}')
            downloaded_count += 1
        else:
            print(f'Skipping {media_name} as it already exists')
            skipped_count += 1
    return len(media_list), downloaded_count, skipped_count


BA_JP_ANDROID_BUNDLE = f"{current_version_assets_base_url}/Android/"

total_bundle_count, downloaded_bundle_count, skipped_bundle_count = download_ba_jp_bundle(
    BA_JP_ANDROID_BUNDLE, bundles_to_download, BA_JP_BUNDLES_DIR)

BA_JP_MEDIA_CATALOG = f"{current_version_assets_base_url}/MediaResources/MediaCatalog.json"
BA_JP_MEDIA_BASEURL = f"{current_version_assets_base_url}/MediaResources/"

media_to_download = requests.get(BA_JP_MEDIA_CATALOG).json()['Table']
total_media_count, downloaded_media_count, skipped_media_count = download_ba_jp_media(
    BA_JP_MEDIA_BASEURL, media_to_download, BA_JP_MEDIA_DIR)

print(f"Bundle: {total_bundle_count} total, {downloaded_bundle_count} downloaded, {skipped_bundle_count} skipped")
print(f"Media: {total_media_count} total, {downloaded_media_count} downloaded, {skipped_media_count} skipped")
