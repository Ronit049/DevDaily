# DevDaily 🧑‍💻

A full-stack daily developer dashboard using React + TypeScript + Tailwind CSS + FastAPI.

## Features
- GitHub profile, repositories, followers and activity
- Hacker News developer news
- GitHub repository discovery
- AI daily brief with optional Groq API
- Daily goals saved in localStorage
- Responsive dark dashboard
- Demo fallbacks when APIs are unavailable

## Run backend

```bash
cd backend
python -m venv venv
# Windows PowerShell:
venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

## Run frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Open http://localhost:5173.

Keep private API keys in `backend/.env`, never in the React frontend.
