import shutil
from pathlib import Path


class Saver:
    INVALID_NAMES = ["operator", "npc"]

    def __init__(self, src_dir: str, dst_dir: str):
        self.src_dir = Path(src_dir)
        self.dst_dir = Path(dst_dir)

        if not self.dst_dir.exists():
            raise Exception(f"{self.dst_dir} does not exist")

    def save(self):
        for file in self.src_dir.rglob("*.png"):
            if self.is_invalid_file(file):
                continue

            self.save_file(file)

    def save_file(self, file: Path):
        shutil.move(str(file), str(self.dst_dir / file.name))

    def is_invalid_file(self, file: Path) -> bool:
        filename = str(file).lower()

        return any(invalid_name in filename for invalid_name in self.INVALID_NAMES)


if __name__ == "__main__":
    saver = Saver(src_dir="local/extracted", dst_dir="../frontend/public/imgs")
    saver.save()
