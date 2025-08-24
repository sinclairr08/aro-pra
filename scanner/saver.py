import shutil
from pathlib import Path

import pymongo.collection
from pymongo import MongoClient

from config import CONFIG
from mapper import Mapper


class Saver:
    INVALID_NAMES = ["operator", "npc"]

    def __init__(self, src_dir: Path, dst_dir: Path, collection: pymongo.collection.Collection):
        self.src_dir = src_dir
        self.dst_dir = dst_dir
        self.collection = collection
        self.mapper = Mapper()

        if not self.dst_dir.exists():
            raise Exception(f"{self.dst_dir} does not exist")

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

        student_info = self.mapper.map(code)
        if student_info is None:
            return

        code = student_info["code"]

        result = self.collection.update_one(filter={"code": code}, update={"$setOnInsert": student_info}, upsert=True)

        if result.upserted_id:
            src = str(file)
            dst = str(self.dst_dir / f"{code}.png")
            shutil.copy(src, dst)
            print(f"{src} is moved to f{dst}")

    def is_invalid_file(self, file: Path) -> bool:
        filename = str(file).lower()

        return any(invalid_name in filename for invalid_name in self.INVALID_NAMES)

    def results(self) -> list:
        return list(self.collection.find({}, {"code": 1, "en_name": 1, "_id": 0}))


if __name__ == "__main__":
    student_collection = MongoClient(CONFIG.mongodb_uri).get_default_database()["students"]
    saver = Saver(
        src_dir=Path("local/extracted"),
        dst_dir=Path("../frontend/public/imgs"),
        collection=student_collection
    )
    saver.save()
    print(saver.results())
