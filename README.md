# Hesychia

Hesychia is an AI wellness companion for students preparing for high-stakes exams. It combines:

- open-ended journaling,
- structured AI mood analysis,
- contextual companion chat,
- adaptive coping exercises,
- local-first trend tracking,
- contextual Gemini text chat,
- low-latency Gemini Live voice with transcription and interruption handling,
- adaptive exercises with a usable timer.

The product name comes from the Greek idea of stillness and quietness of mind.

## Repo layout

```text
.
├── frontend/   Next.js App Router client
├── backend/    Express API and Gemini orchestration
├── package.json
└── README.md
```

## Architecture

- Frontend owns interaction, local-first history, responsive rendering, microphone capture, and audio playback.
- Backend owns Gemini access, safety screening, validation, CORS, secure error handling, and prompt orchestration.
- Voice sessions use single-use Gemini Live ephemeral tokens minted by the backend. The browser never receives the long-lived API key.
- Direct crisis language pauses normal chat or voice coaching and directs the student toward immediate human support.

## Gemini integration

- Text workflows use `gemini-3.1-flash-lite-preview`
- Live voice uses `gemini-3.1-flash-live-preview`
- Browser voice sessions are authenticated with backend-minted ephemeral tokens through `v1alpha`

## Routes

- `POST /api/analyze`
- `POST /api/companion/respond`
- `POST /api/exercise`
- `POST /api/live/session-token`
- `GET /health`

## Setup

Install workspace dependencies:

```bash
npm install
```

Create local env files:

- `backend/.env.local`
  - `GEMINI_API_KEY`
  - `ALLOWED_ORIGIN`
  - `PORT`
- `frontend/.env.local`
  - `NEXT_PUBLIC_API_BASE_URL`

Run locally:

```bash
npm run dev
```

The command above starts the frontend. For full AI functionality, run the backend in a second terminal:

```bash
npm run dev:backend
```

Validate:

```bash
npm run build
npm run lint
npm test
```

## Production notes

- Keep the Gemini API key server-side only.
- Live voice auth must use ephemeral tokens only.
- Journal and companion safety checks run before normal AI response generation.
- The frontend is designed to deploy as a separate Vercel project from the backend.
- Set frontend `NEXT_PUBLIC_API_BASE_URL` to the backend deployment URL.
- Set backend `ALLOWED_ORIGIN` to the exact frontend URL. Multiple origins may be comma-separated.
- CI runs type checks, 16+ behavior tests, and production builds on pushes and pull requests.
