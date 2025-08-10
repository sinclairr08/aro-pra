from pathlib import Path

import UnityPy
from UnityPy.files import ObjectReader


class Extractor:
    def __init__(self, src_dir: Path, dst_dir: Path, target_dirs: list[str]):
        self.src_dir = src_dir
        self.dst_dir = dst_dir
        self.target_dirs = [Path(target_dir) for target_dir in target_dirs]

        self.dst_dir.mkdir(parents=True, exist_ok=True)

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

    def is_target(self, asset_path: Path) -> bool:
        for target_dir in self.target_dirs:
            if asset_path.is_relative_to(target_dir):
                return True

        return False

    def extract_obj(self, obj: ObjectReader):
        obj_type_name = obj.type.name

        if obj_type_name != "Texture2D":
            return

        if not obj.container:
            return

        asset_path = Path(*obj.container.split("/"))

        if "small" in str(asset_path) or "Small" in str(asset_path):
            return

        if self.is_target(asset_path=asset_path):
            return

        dst_file = self.dst_dir / asset_path.with_suffix(".png").name

        if dst_file.exists():
            return

        data = obj.read()
        data.image.save(dst_file)

        print(f"{str(dst_file)} extracted")
