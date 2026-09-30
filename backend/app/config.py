from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "DevDaily API"
    frontend_origin: str = "http://localhost:5173"
    github_token: str = ""
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
