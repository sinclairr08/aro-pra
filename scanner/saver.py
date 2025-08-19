from pathlib import Path

from pymongo import MongoClient


class Saver:
    INVALID_NAMES = ["operator", "npc"]

    def __init__(self, src_dir: str, dst_dir: str):
        self.src_dir = Path(src_dir)
        self.dst_dir = Path(dst_dir)
        self.collection = MongoClient("mongodb://localhost:27017")["test_db"]["students"]

        if not self.dst_dir.exists():
            raise Exception(f"{self.dst_dir} does not exist")

    def save(self):
        for file in self.src_dir.rglob("*.png"):
            if self.is_invalid_file(file):
                continue

            self.save_file(file)

    def save_file(self, file: Path):
        # shutil.copy(str(file), str(self.dst_dir / file.name))

        name = file.name
        code = name.split("Portrait_")[1].split(".png")[0]

        self.collection.update_one(filter={"code": code}, update={"$setOnInsert": {"code": code}}, upsert=True)

    def is_invalid_file(self, file: Path) -> bool:
        filename = str(file).lower()

        return any(invalid_name in filename for invalid_name in self.INVALID_NAMES)

    def results(self) -> list:
        return list(self.collection.find({}, {"code": 1, "_id": 0}))


if __name__ == "__main__":
    saver = Saver(src_dir="local/extracted", dst_dir="../frontend/public/imgs")
    saver.save()
    print(saver.results())
