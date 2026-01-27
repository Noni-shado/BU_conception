from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./bu.db"
    JWT_SECRET: str = "SUPER_SECRET_CHANGE_ME"
    JWT_ALG: str = "HS256"

settings = Settings()