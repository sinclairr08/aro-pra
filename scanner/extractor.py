from pathlib import Path

import UnityPy


class Extractor:
    def __init__(self, src_dir: str, dst_dir: str):
        self.src_dir = Path(src_dir)
        self.dst_dir = Path(dst_dir)

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

        for path, obj in env.container.items():
            asset_path = Path(*path.split("/"))
            obj_type_name = obj.type.name

            if obj_type_name in ["Texture2D", "Sprite"]:
                data = obj.read()

                dst_file = self.dst_dir / asset_path.with_suffix(".png")
                dst_file.parent.mkdir(parents=True, exist_ok=True)

                data.image.save(dst_file)

            elif obj_type_name == "TextAsset":
                data = obj.read()

                dst_file = self.dst_dir / asset_path
                dst_file.parent.mkdir(parents=True, exist_ok=True)

                with open(dst_file, "wb") as f:
                    f.write(bytes(data.script))

            else:
                print(f"{obj_type_name=} does not supported")


if __name__ == "__main__":
    extractor = Extractor(src_dir="./bundles", dst_dir="./extracted")
    extractor.extract()
