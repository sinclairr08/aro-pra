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

        for obj in env.objects:
            obj_type_name = obj.type.name

            if obj.container:
                asset_path = Path(*obj.container.split("/"))
            else:
                asset_path = Path(f"{obj_type_name}_{obj.path_id}")

            if obj_type_name in ["Texture2D", "Sprite"]:
                data = obj.read()

                dst_file = self.dst_dir / asset_path.with_suffix(".png")
                dst_file.parent.mkdir(parents=True, exist_ok=True)

                data.image.save(dst_file)

            elif obj_type_name == "TextAsset":
                data = obj.read()

                dst_file = self.dst_dir / asset_path
                dst_file.parent.mkdir(parents=True, exist_ok=True)

                script_data = data.m_Script

                if dst_file.suffix.lower() == ".bytes":
                    continue

                if not isinstance(script_data, str):
                    continue

                try:
                    content = script_data.encode("utf-8")
                    with open(dst_file, "wb") as f:
                        f.write(content)
                except Exception as e:
                    print(f"{asset_path} : {e}")


if __name__ == "__main__":
    extractor = Extractor(src_dir="./bundles", dst_dir="./extracted")
    extractor.extract()
