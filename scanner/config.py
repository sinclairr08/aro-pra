from pydantic_settings import BaseSettings, SettingsConfigDict


class ScannerConfig(BaseSettings):
    url: str
    model_config = SettingsConfigDict(
        env_file="scanner.yaml",
        env_file_encoding="utf-8"
    )


CONFIG = ScannerConfig()
