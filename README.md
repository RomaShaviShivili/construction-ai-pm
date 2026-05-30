# BuildMind AI — Construction Project Manager

Full-stack SaaS dashboard for construction portfolio management with OpenAI-powered risk analysis, progress prediction, and an expert chat assistant.

## Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Recharts
- **Backend:** Node.js, Express, OpenAI API
- **Data:** JSON file store (sample projects included)

## Features

- Dashboard with project cards (name, budget, spent, progress %, deadline)
- AI risk analysis per project (delay/budget risk, issues, recommendations)
- Progress prediction (estimated completion, on-time likelihood)
- Portfolio stats and charts (budget vs spent, progress over time)
- Red / yellow / green risk indicators
- AI chat assistant with construction PM expertise

## Quick start

### 1. Install dependencies

```bash
cd construction-ai-pm
npm install
cd backend && npm install
cd ../frontend && npm install
```

Or from the root:

```bash
npm run install:all
```

### 2. Configure OpenAI (optional)

Copy `backend/.env.example` to `backend/.env` and set your key:

```
OPENAI_API_KEY=sk-...
PORT=3001
```

Without a key, the app runs in **demo mode** with deterministic mock AI responses.

### 3. Run development servers

From the project root:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health + OpenAI status |
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/:id` | Get one project |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/analyze-project` | AI risk analysis (`project_id` or `project` body) |
| POST | `/api/chat` | AI assistant (`message`, optional `history`) |

### Analyze example

```bash
curl -X POST http://localhost:3001/api/analyze-project \
  -H "Content-Type: application/json" \
  -d "{\"project_id\": \"1\"}"
```

Response shape:

```json
{
  "delay_risk": "72%",
  "budget_risk": "55%",
  "prediction": "likely delayed by 12 days",
  "estimated_completion": "2026-09-12",
  "on_time_likelihood": "35%",
  "issues": [],
  "recommendations": []
}
```

### Chat example

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"message\": \"Which project is most at risk?\"}"
```

## Project structure

```
construction-ai-pm/
├── backend/
│   ├── data/projects.json
│   ├── services/ai.js
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── App.jsx
│       └── api.js
└── package.json
```

## License

MIT
