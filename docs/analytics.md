# Analytics & Feedback — CEO Guide

## What we use and why

**Analytics: [PostHog](https://posthog.com) (free tier)**

Chosen for:
- 1 million events/month free (more than enough for v0)
- Privacy-first config: IP is not collected, no PII, no persistent cookies
- Self-serve dashboard — no waiting on engineering to see data
- Supports the custom events we need now and later

**Feedback: GitHub Issues** (via the "Suggest a fix" button on every page)

---

## Reading the analytics dashboard

1. Go to [app.posthog.com](https://app.posthog.com) and sign in to the shared account.
2. Select the **Taekwondo Training** project from the top-left dropdown.

### Useful views

| Question | Where to look |
|---|---|
| How many people visited today/this week? | **Web analytics** tab → Sessions & Pageviews graph |
| Which pages are most visited? | **Web analytics** → Top pages |
| How many drills were practiced? | **Insights** → New insight → Trend → filter by event `drill_practiced` |
| Are users completing drills by belt? | **Insights** → Breakdown `drill_practiced` by property `belt` |
| Are returning users coming back? | **Web analytics** → Returning vs New users |

### Custom events we track

| Event | When it fires | Key properties |
|---|---|---|
| `belt_viewed` | User opens a belt's curriculum page | `belt` (e.g. `"white"`) |
| `drill_viewed` | User opens a drill detail | `drill`, `belt` |
| `drill_practiced` | User marks a drill as practiced | `drill`, `belt` |
| `$pageview` | Every page navigation | `$current_url` |

---

## Viewing feedback submissions

1. Go to [github.com/filwag/tkd-app/issues](https://github.com/filwag/tkd-app/issues)
2. Filter by label **`content-fix`** to see all student suggestions.
3. Each issue includes the page URL the student was on when they submitted, and a description of what they think is wrong.

---

## Setup (first-time, engineering)

1. Create a PostHog account at [posthog.com](https://posthog.com).
2. Create a new project called **Taekwondo Training**.
3. Copy the **Project API Key** (starts with `phc_`).
4. Add it to your deployment environment as `NEXT_PUBLIC_POSTHOG_KEY`.
5. Set `NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com` (or the EU host if you prefer).

See `.env.example` for the full list of required vars.
