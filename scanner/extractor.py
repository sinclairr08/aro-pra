from pathlib import Path
from typing import Optional

import UnityPy
from UnityPy.files import ObjectReader


def parse_asset_path(obj: ObjectReader) -> Optional[Path]:
    if not obj.container:
        return None

    return Path(*obj.container.split("/"))


class Extractor:
    DEFAULT_TARGET_TYPE = "Texture2D"
    DEFAULT_SAVE_SUFFIX = ".png"
    EXCLUDE_PATTERN = "small"

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

    def should_extract(self, obj: ObjectReader, asset_path: Path) -> bool:
        if obj.type.name != self.DEFAULT_TARGET_TYPE:
            return False

        if self.EXCLUDE_PATTERN in str(asset_path).lower():
            return False

        if not self.is_target(asset_path=asset_path):
            return False

        return True

    def is_target(self, asset_path: Path) -> bool:
        return any(asset_path.is_relative_to(d) for d in self.target_dirs)

    def get_output_path(self, asset_path: Path) -> Path:
        return self.dst_dir / asset_path.with_suffix(self.DEFAULT_SAVE_SUFFIX).name

    def extract_obj(self, obj: ObjectReader):
        asset_path = parse_asset_path(obj)
        if not asset_path:
            return

        if not self.should_extract(obj=obj, asset_path=asset_path):
            return

        dst_file = self.get_output_path(asset_path)

        if dst_file.exists():
            return

        data = obj.read()
        data.image.save(dst_file)

        print(f"{str(dst_file)} extracted")
