from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.models import BriefRequest
from app.services.github import profile, repos, events, search_repos
from app.services.news import top_news
from app.services.ai import daily_brief

app = FastAPI(title=settings.app_name, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": settings.app_name}

@app.get("/api/dashboard/{username}")
async def dashboard(username: str):
    user = await profile(username)
    user_repos = await repos(username)
    user_events = await events(username)

    languages = {}
    for repo in user_repos:
        lang = repo.get("language")
        if lang:
            languages[lang] = languages.get(lang, 0) + 1

    commits = sum(1 for e in user_events if e.get("type") == "PushEvent")

    return {
        "profile": user,
        "repos": user_repos[:6],
        "events": user_events[:10],
        "stats": {
            "commits": commits,
            "repositories": user.get("public_repos", len(user_repos)),
            "followers": user.get("followers", 0),
            "languages": sorted(languages, key=languages.get, reverse=True)[:5],
        },
    }

@app.get("/api/news")
async def news(limit: int = Query(6, ge=1, le=10)):
    return await top_news(limit)

@app.get("/api/trending")
async def trending(language: str | None = None):
    return await search_repos(language)

@app.post("/api/ai/brief")
async def ai_brief(payload: BriefRequest):
    return await daily_brief(
        payload.username, payload.solved, payload.commits,
        payload.top_languages, payload.goals
    )
