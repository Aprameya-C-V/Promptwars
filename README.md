# Hesychia

Hesychia is a production-oriented PromptWars project for students preparing for high-stakes exams. It combines:

- open-ended journaling,
- structured AI mood analysis,
- contextual companion chat,
- adaptive coping exercises,
- local-first trend tracking,
- Gemini Live voice sessions through ephemeral tokens.

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

- Frontend owns interaction, local state, and rendering.
- Backend owns Gemini access, safety, schemas, and prompt orchestration.
- Voice sessions use Gemini Live ephemeral tokens minted by the backend.

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
npm run dev:backend
npm run dev:frontend
```

Validate:

```bash
npm run build
npm test
```

## Production notes

- Keep the Gemini API key server-side only.
- Live voice auth must use ephemeral tokens only.
- Journal and companion safety checks run before normal AI response generation.
- The frontend is designed to deploy as a separate Vercel project from the backend.
