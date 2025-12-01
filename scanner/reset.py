import shutil
from pathlib import Path


def delete_directory(directory: Path):
    print(f"Deleting {directory=}")
    if directory.exists() and directory.is_dir():
        shutil.rmtree(directory)


def reset():
    target_directories = [
        Path("local") / "apks",
        Path("local") / "bundles",
        Path("local") / "extracted",
    ]

    print("Reset Start")

    for target_directory in target_directories:
        delete_directory(target_directory)

    print("Reset End")


if __name__ == "__main__":
    reset()
