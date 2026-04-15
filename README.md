# Notes App — DevOps Mini Project

A simple CRUD Notes application built with **Node.js + Express**, demonstrating a complete **CI/CD DevOps pipeline**.

---

## Problem Statement

Students and professionals need a simple way to create, manage, and delete personal notes from a web interface. This project solves that with a lightweight REST API-backed web app.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js + Express |
| Testing | Jest + Supertest |
| Build Tool | npm |
| CI/CD | GitHub Actions |
| Containerisation | Docker + Docker Compose |
| Deployment | Render / Railway (staging) |

---

## Project Structure

```
notes-app/
├── src/
│   ├── app.js              # Express app setup
│   ├── server.js           # Entry point
│   ├── routes/notes.js     # API routes
│   ├── controllers/        # Request handlers
│   └── models/Note.js      # In-memory data model
├── tests/
│   └── notes.test.js       # Jest test suite (13 tests)
├── public/
│   └── index.html          # Frontend UI
├── .github/workflows/
│   └── ci-cd.yml           # GitHub Actions pipeline
├── Dockerfile
├── docker-compose.yml
└── package.json
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/notes | Get all notes |
| GET | /api/notes/:id | Get note by ID |
| POST | /api/notes | Create new note |
| PUT | /api/notes/:id | Update a note |
| DELETE | /api/notes/:id | Delete a note |

---

## Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/notes-app.git
cd notes-app
npm install
```

### 2. Run Locally
```bash
npm start
# Visit http://localhost:3000
```

### 3. Run Tests
```bash
npm test
```

### 4. Run with Docker
```bash
docker build -t notes-app .
docker run -p 3000:3000 notes-app

# Or with Docker Compose
docker-compose up
```

---

## CI/CD Pipeline

```
Push to GitHub → GitHub Actions triggers
  ├── Job 1: Install → npm test → coverage report
  ├── Job 2: Docker build & push (on main branch)
  └── Job 3: Deploy to Render staging (on main branch)
```

### GitHub Actions Secrets Required
- `DOCKER_USERNAME` — Docker Hub username
- `DOCKER_PASSWORD` — Docker Hub access token
- `RENDER_DEPLOY_HOOK` — Render.com deploy webhook URL

---

## Branching Strategy

- `main` — production-ready code
- `develop` — integration branch
- `feature/*` — individual feature branches

## Git Commit Convention

```
feat: add new note creation endpoint
fix: handle missing title validation
test: add PUT endpoint test cases
docs: update README with Docker steps
ci: add coverage upload step
```

---

## License

MIT
