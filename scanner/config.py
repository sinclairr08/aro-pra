import os

from pydantic import Field
from pydantic_settings import BaseSettings


class ScannerConfig(BaseSettings):
    mongodb_uri: str = Field(alias="SPRING_DATA_MONGODB_URI")

    model_config = {"env_file": f".env.{os.getenv('ENV', 'dev')}", "extra": "ignore"}


CONFIG = ScannerConfig()
