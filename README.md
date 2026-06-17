# Botany Sunshine

<img width="1552" height="905" alt="image" src="https://github.com/user-attachments/assets/5debeddd-6d96-4d71-b173-b0d8ffd53cf2" />
A 2D top-down hydroponic simulation game.

## 1. Running the Frontend (React)

Open a terminal and navigate to the `frontend` directory:

```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

This runs the app in development mode on http://localhost:3000.

---

## 2. Running the Backend (FastAPI)

Open another terminal and navigate to the `backend` directory:

```bash
cd backend
```

Set up a virtual environment (recommended):
```bash
python -m venv venv

# On Windows:
.\venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

Install the required Python packages:
```bash
pip install -r requirements.txt
```

Run the server:
```bash
uvicorn server:app --reload
```

The server runs on http://127.0.0.1:8000.
