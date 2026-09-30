Set-Location "$PSScriptRoot\backend"
if (!(Test-Path "venv")) { python -m venv venv }
& ".\venv\Scripts\Activate.ps1"
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
