import httpx

HN = "https://hacker-news.firebaseio.com/v0"

DEMO = [
    {"id": 1, "title": "The latest ideas in AI engineering", "url": "https://news.ycombinator.com/", "score": 250, "by": "demo"},
    {"id": 2, "title": "Building faster developer tools", "url": "https://news.ycombinator.com/", "score": 180, "by": "demo"},
    {"id": 3, "title": "Modern web performance for developers", "url": "https://news.ycombinator.com/", "score": 140, "by": "demo"},
    {"id": 4, "title": "Open source projects worth exploring", "url": "https://news.ycombinator.com/", "score": 120, "by": "demo"},
]

async def top_news(limit=6):
    try:
        async with httpx.AsyncClient() as client:
            ids = (await client.get(f"{HN}/topstories.json", timeout=10)).json()[:limit]
            result = []
            for item_id in ids:
                item = (await client.get(f"{HN}/item/{item_id}.json", timeout=10)).json()
                if item and item.get("title"):
                    result.append(item)
            return result
    except Exception:
        return DEMO[:limit]
