import UnityPy
import requests

print(UnityPy.__version__)
print(requests.__version__)

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
