from pathlib import Path

import UnityPy
from UnityPy.files import ObjectReader


class Extractor:
    def __init__(self, src_dir: str, dst_dir: str, target_dir: str):
        self.src_dir = Path(src_dir)
        self.dst_dir = Path(dst_dir)
        self.target_dir = Path(target_dir)

        self.target_dir.mkdir(parents=True, exist_ok=True)

    def extract(self):
        for file_path in self.src_dir.rglob("*"):
            if not file_path.is_file():
                continue

            self.extract_file(file_path)

    def extract_file(self, file_path: Path):
        try:
            env = UnityPy.load(str(file_path))
        except Exception as e:
            print(f"Failed to load {file_path}, {e=}")
            return

        for obj in env.objects:
            self.extract_obj(obj)

    def extract_obj(self, obj: ObjectReader):
        obj_type_name = obj.type.name

        if obj_type_name != "Texture2D":
            return

        if not obj.container:
            return

        asset_path = Path(*obj.container.split("/"))

        if "small" in str(asset_path) or "Small" in str(asset_path):
            return

        if not asset_path.is_relative_to(self.target_dir):
            return

        dst_file = self.dst_dir / asset_path.with_suffix(".png").name

        if dst_file.exists():
            return

        data = obj.read()
        data.image.save(dst_file)

        print(f"{str(dst_file)} extracted")


if __name__ == "__main__":
    extractor = Extractor(src_dir="./bundles", dst_dir="./extracted",
                          target_dir="Assets/_MX/AddressableAsset/UIs/01_Common/01_Character")
    extractor.extract()
