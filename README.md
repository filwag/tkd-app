# Taekwondo Training

A free, mobile-first web app for Taekwondo students of every belt level. Pick your belt, get a structured curriculum, and track your drills — no account required.

## Stack

- **Next.js 16** (App Router) — TypeScript, Tailwind CSS
- **Vercel** — zero-config deploy, preview URLs on every PR
- **GitHub Actions** — CI: typecheck + lint on every push

## Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint     # ESLint
npx tsc --noEmit # typecheck
```

## CI

GitHub Actions runs typecheck and lint on every push to any branch. Merging to `main` triggers an automatic production deploy on Vercel.

## Architecture notes

- Curriculum data lives in the repo (Markdown / YAML) until editing in-repo costs more than admin tooling.
- No accounts, no database, no PII collection in v0.
- One environment (production). Vercel preview URLs substitute for staging.
