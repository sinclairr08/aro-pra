import shutil
from pathlib import Path

import pymongo.collection


class Saver:
    INVALID_NAMES = ["operator", "npc"]

    def __init__(self, src_dir: Path, dst_dir: Path, collection: pymongo.collection.Collection):
        self.src_dir = src_dir
        self.dst_dir = dst_dir
        self.collection = collection

        if not self.dst_dir.exists():
            self.dst_dir.mkdir(exist_ok=True, parents=True)

    def save(self):
        for file in self.src_dir.rglob("*.png"):
            if self.is_invalid_file(file):
                continue

            self.save_file(file)

    @staticmethod
    def get_code(name):
        return name.split("Portrait_")[1].split(".png")[0]

    def save_file(self, file: Path):
        name = file.name
        code = self.get_code(name)
        result = self.collection.update_one(filter={"code": code}, update={"$setOnInsert": {"code": code}}, upsert=True)

        if result.modified_count > 0:
            print(f"{code} is inserted to db")

        src = file
        dst = self.dst_dir / f"{code}.png"

        if dst.exists():
            return

        shutil.copy(src, dst)
        print(f"{src} is moved to {dst}")

    def is_invalid_file(self, file: Path) -> bool:
        filename = str(file).lower()

        return any(invalid_name in filename for invalid_name in self.INVALID_NAMES)
