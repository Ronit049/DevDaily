import httpx
from app.config import settings

BASE = "https://api.github.com"

DEMO_PROFILE = {
    "login": "Ronit049",
    "name": "Ronit Raj",
    "avatar_url": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    "bio": "Computer Science student and developer",
    "followers": 100,
    "following": 80,
    "public_repos": 20,
}

DEMO_REPOS = [
    {"name": "DevDaily", "description": "Daily developer command center", "stargazers_count": 12, "language": "TypeScript", "html_url": "#"},
    {"name": "Resume-Analyzer", "description": "AI-powered resume analysis", "stargazers_count": 8, "language": "Python", "html_url": "#"},
    {"name": "Guided-AI-Chatbot", "description": "AI chatbot with guided conversations", "stargazers_count": 7, "language": "Python", "html_url": "#"},
]

def headers():
    h = {"Accept": "application/vnd.github+json"}
    if settings.github_token:
        h["Authorization"] = f"Bearer {settings.github_token}"
    return h

async def get_json(client, path, params=None):
    r = await client.get(BASE + path, headers=headers(), params=params, timeout=12)
    r.raise_for_status()
    return r.json()

async def profile(username):
    try:
        async with httpx.AsyncClient() as client:
            return await get_json(client, f"/users/{username}")
    except Exception:
        return {**DEMO_PROFILE, "login": username}

async def repos(username):
    try:
        async with httpx.AsyncClient() as client:
            return await get_json(client, f"/users/{username}/repos",
                                  {"sort": "updated", "per_page": 8, "type": "owner"})
    except Exception:
        return DEMO_REPOS

async def events(username):
    try:
        async with httpx.AsyncClient() as client:
            return await get_json(client, f"/users/{username}/events/public", {"per_page": 30})
    except Exception:
        return [
            {"type": "PushEvent", "repo": {"name": f"{username}/DevDaily"}},
            {"type": "PushEvent", "repo": {"name": f"{username}/Resume-Analyzer"}},
            {"type": "PullRequestEvent", "repo": {"name": f"{username}/Guided-AI-Chatbot"}},
        ]

async def search_repos(language=None):
    try:
        q = "stars:>1000"
        if language:
            q += f" language:{language}"
        async with httpx.AsyncClient() as client:
            data = await get_json(client, "/search/repositories",
                                  {"q": q, "sort": "stars", "order": "desc", "per_page": 8})
            return data.get("items", [])
    except Exception:
        return [
            {"full_name": "fastapi/fastapi", "description": "FastAPI framework",
             "stargazers_count": 80000, "language": "Python",
             "html_url": "https://github.com/fastapi/fastapi"},
            {"full_name": "vercel/next.js", "description": "React framework",
             "stargazers_count": 130000, "language": "JavaScript",
             "html_url": "https://github.com/vercel/next.js"},
            {"full_name": "langchain-ai/langchain", "description": "Build applications with LLMs",
             "stargazers_count": 100000, "language": "Python",
             "html_url": "https://github.com/langchain-ai/langchain"},
        ]
