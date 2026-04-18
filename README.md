# Candidate Dashboard

Frontend test assignment for reviewing and managing a mock list of candidates.

## Stack

- React 18
- TypeScript
- Vite
- React Router
- Zustand
- Tailwind CSS
- Vitest + React Testing Library
- ESLint

## Run

```bash
npm install
npm run dev
```

## Test

```bash
npm run test
```

## Lint

```bash
npm run lint
```

## Build

```bash
npm run build
```

## Notes

- Candidate data comes from local mock JSON files and is exposed through a small mock API layer.
- URL query params are the source of truth for list search, verdict filter, sorting, and pagination.
- Zustand is used only for candidate data flow and status updates; transient UI state stays in page components.
- Candidate workflow status updates use optimistic UI with rollback on failure.
