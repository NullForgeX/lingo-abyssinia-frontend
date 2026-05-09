## Admin Credentials

- Email: `admin@lingoabyssinia.com` (any email containing `admin` works)
- Password: any value with at least 8 characters

# Lingo Abyssinia Foundation

Lingo Abyssinia Foundation is a frontend language-learning app focused on
Ethiopian languages. It includes a public landing experience, mock
authentication, onboarding, guided lessons, learner progress tracking, profile
management, and demo community and leaderboard screens.

## What It Does

- Supports Amharic, Afan Oromoo, and Tigrinya learning paths
- Guides new users through signup, login, and onboarding
- Lets learners complete lesson exercises with progress and score feedback
- Tracks onboarding state, auth state, theme, UI language, and completed
  lessons in browser `localStorage`
- Includes community and leaderboard views as frontend demo experiences

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Radix UI / shadcn-style components
- Framer Motion
- React Hook Form + Zod
- Vitest

## App Structure

- `src/pages` contains the route-level screens
- `src/components` contains shared UI and exercise components
- `src/contexts` contains auth, theme, and i18n state providers
- `src/data/courseContent.ts` contains the hardcoded lesson/course data
- `src/hooks/useLessonProgress.ts` stores completed lesson progress locally
- `src/api/mockAuth.ts` simulates login and signup without a real backend

## Routes

- `/` landing page
- `/login` login form
- `/signup` signup form
- `/onboarding` protected onboarding flow
- `/dashboard` protected learner dashboard
- `/community` protected community screen
- `/leaderboard` protected leaderboard screen
- `/profile` protected profile screen
- `/lesson/:lessonId` protected lesson player
- `/lesson/:lessonId/result` protected lesson result screen

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install

```bash
npm install
```

### Run The App

```bash
npm run dev
```

The Vite dev server is configured in `vite.config.ts` and runs on port `8080`.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

### Test

```bash
npm run test
```

## Current Architecture Notes

- This project is currently frontend-only
- Authentication is mocked and not connected to a backend
- Course content is hardcoded in the repository
- Progress is stored locally in the browser, not synced to a server
- Community and leaderboard data are demo/static UI flows at this stage

## Next Likely Steps

- Replace mock auth with a real backend
- Persist user progress remotely
- Expand lesson content and assessments
- Add meaningful automated tests
- Connect community and leaderboard screens to real data
