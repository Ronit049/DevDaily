from pydantic import BaseModel

class BriefRequest(BaseModel):
    username: str
    solved: int = 0
    commits: int = 0
    top_languages: list[str] = []
    goals: list[str] = []
