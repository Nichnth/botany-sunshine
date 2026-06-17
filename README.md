# Botany Sunshine

A 2D top-down hydroponic simulation game and FSM documentation app. It has a React frontend and a FastAPI backend.

## Prerequisites

- Node.js (v18 or higher recommended)
- Python (v3.10 or higher recommended)

---

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

### Database Note
By default, the backend tries to connect to MongoDB on `mongodb://localhost:27017`. If MongoDB is not running, the application automatically falls back to an in-memory mock database, so the server will still start up and function properly without any database installation.

If you want to use a real MongoDB database:
1. Make sure MongoDB is running.
2. Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=botany_sunshine
   ```
