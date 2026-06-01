# Lingo Abyssinia Foundation

Lingo Abyssinia Foundation is a React + Supabase language-learning app focused on Ethiopian languages. It includes public marketing pages, Supabase authentication, learner onboarding, guided lessons, profile management, persisted lesson progress, community threads/replies/reports, and admin tools for users, lessons, moderation, analytics, and audit logs.

## What It Does

- Supports Amharic, Afan Oromoo, and Tigrinya learning paths
- Registers and logs in users 
- Creates learner profiles 
- Supports admin users through the `profiles.role` field
- Persists onboarding preferences, profile updates, and lesson completion
- Stores community posts, replies, and moderation reports 
- Provides admin views for lessons, users, reports, analytics, and audit logs

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



## ElevenLabs Voice Setup

Voice playback is handled by a Supabase Edge Function so the ElevenLabs API key is not exposed in the browser.

1. Add `ELEVENLABS_API_KEY` and `ELEVENLABS_VOICE_ID` to `.env.local` for local reference.
2. Add the same secrets to Supabase Edge Functions:

```bash
supabase secrets set ELEVENLABS_API_KEY=your-elevenlabs-api-key
supabase secrets set ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

3. Deploy the function:

```bash
supabase functions deploy elevenlabs-tts
```

The frontend calls `supabase.functions.invoke("elevenlabs-tts")` from `src/api/voice.ts`.

## App Structure

- `src/lib/supabase.ts` creates the Supabase browser client
- `src/api/supabaseAuth.ts` handles auth, profile, onboarding, and password reset calls
- `src/api/community.ts` handles community posts, replies, and reports
- `src/data/adminStore.ts` handles admin lessons, users, audit logs, and reports
- `src/hooks/useLessonProgress.ts` stores completed lesson progress in Supabase
- `src/pages` contains the route-level screens
- `src/components` contains shared UI and exercise components
- `src/data/courseContent.ts` contains the hardcoded lesson exercise content

## Routes

- `/` landing page
- `/login` login form
- `/signup` signup form
- `/forgot-password` password reset request
- `/reset-password` password update page
- `/onboarding` protected onboarding flow
- `/dashboard` protected learner dashboard
- `/community` protected community screen
- `/leaderboard` protected leaderboard screen
- `/profile` protected profile screen
- `/admin` protected admin dashboard
- `/admin/lessons` protected admin lesson CRUD
- `/admin/users` protected admin role/user activity view
- `/admin/analytics` protected admin analytics view
- `/lesson/:lessonId` protected lesson player
- `/lesson/:lessonId/result` protected lesson result screen

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm
- Supabase project

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





