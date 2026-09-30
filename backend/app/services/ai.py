import httpx
from app.config import settings

async def daily_brief(username, solved, commits, languages, goals):
    if not settings.groq_api_key:
        return {
            "title": "Your developer brief",
            "summary": f"Keep your momentum today, {username}. You have {commits} tracked GitHub push events.",
            "recommendations": [
                "Solve 2–3 focused DSA problems.",
                f"Spend 30 minutes improving a {languages[0] if languages else 'current'} project.",
                "Make one meaningful GitHub contribution.",
            ],
        }

    prompt = f"""You are a concise developer productivity coach.
User: {username}
Solved problems: {solved}
Recent commits: {commits}
Languages: {", ".join(languages) or "unknown"}
Goals: {", ".join(goals) or "none"}
Give one short summary and exactly three practical recommendations.
Do not invent metrics."""

    try:
        async with httpx.AsyncClient() as client:
            r = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {settings.groq_api_key}"},
                json={
                    "model": settings.groq_model,
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.3,
                },
                timeout=25,
            )
            r.raise_for_status()
            text = r.json()["choices"][0]["message"]["content"]
            lines = [x.strip("- •") for x in text.splitlines() if x.strip()]
            return {
                "title": "AI daily brief",
                "summary": lines[0] if lines else "Keep building consistently today.",
                "recommendations": lines[1:4],
            }
    except Exception:
        return {
            "title": "Your developer brief",
            "summary": "AI is temporarily unavailable; here is an offline brief.",
            "recommendations": [
                "Solve a small set of DSA problems.",
                "Improve one project feature.",
                "Read one technical article.",
            ],
        }
