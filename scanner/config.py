from pydantic_settings import BaseSettings


class ScannerConfig(BaseSettings):
    request_url: str
    model_config = {"env_file": ".env.scanner"}


CONFIG = ScannerConfig()
