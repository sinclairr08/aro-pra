import shutil
from pathlib import Path

import pymongo.collection

from mapper import Mapper


class Saver:
    INVALID_NAMES = ["operator", "npc"]

    def __init__(self, src_dir: Path, dst_dir: Path, collection: pymongo.collection.Collection):
        self.src_dir = src_dir
        self.dst_dir = dst_dir
        self.collection = collection
        self.mapper = Mapper()
        self.data_update_cnt = 0
        self.data_move_cnt = 0
        self.data_valid_cnt = 0

        if not self.dst_dir.exists():
            self.dst_dir.mkdir(exist_ok=True, parents=True)

    def save(self):
        for file in self.src_dir.rglob("*.png"):
            if self.is_invalid_file(file):
                continue

            self.data_valid_cnt += 1
            self.save_file(file)

        print(f"{self.data_update_cnt}/{self.data_valid_cnt} files are updated")
        print(f"{self.data_move_cnt}/{self.data_valid_cnt} files are moved")

    @staticmethod
    def get_code(name):
        return name.split("Portrait_")[1].split(".png")[0]

    def save_file(self, file: Path):
        name = file.name
        old_code = self.get_code(name)

        code = self.mapper.convert_old_code(old_code)
        if code is None:
            return

        student_info = self.mapper.map(code)
        code = student_info["code"]

        result = self.collection.update_one(filter={"code": code}, update={"$set": student_info}, upsert=True)
        self.data_update_cnt += result.modified_count

        src = file
        dst = self.dst_dir / f"{code}.png"

        if dst.exists():
            return

        shutil.copy(src, dst)
        print(f"{src} is moved to f{dst}")
        self.data_move_cnt += 1

    def is_invalid_file(self, file: Path) -> bool:
        filename = str(file).lower()

        return any(invalid_name in filename for invalid_name in self.INVALID_NAMES)
