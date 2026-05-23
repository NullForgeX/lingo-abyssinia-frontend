# Frontend ⇄ Backend Integration Plan

Incremental plan for replacing the mock data layer in `lingo-abyssinia-frontend` with the real `lingo-backend` HTTP API (`apps/api`, mounted at `/api/v1`). Each phase is independently shippable: the app stays runnable end-to-end after every step, and unfinished surfaces stay on mocks until their phase lands.

## 1. Current State

### Frontend (`lingo-abyssinia-frontend`)
- Vite + React 18 + TypeScript, React Router v6, TanStack Query already installed (`src/App.tsx`).
- Auth state lives in `src/contexts/AuthContext.tsx` and is hydrated from `localStorage` (`lingo_token`, `lingo_user`, `lingo_onboarded`).
- Mock auth in `src/api/mockAuth.ts` (`mockLogin`, `mockSignup`, `mockRequestPasswordReset`, `mockResetPassword`).
- Curriculum mocked in `src/data/courseContent.ts` (lexicons + unit/lesson/exercise blueprints).
- Admin mocked in `src/data/adminStore.ts` (lessons, users, audit, moderation reports — all persisted in `localStorage`).
- Lesson completion mocked in `src/hooks/useLessonProgress.ts` via `localStorage`.
- Dev server runs on port `8080` (`vite.config.ts`).
- No HTTP client, no API base URL, no request typings yet.

### Backend (`lingo-backend`, Express, `/api/v1`)
Routers mounted in `apps/api/src/routes/v1.routes.ts`:

| Mount | Router | Key paths |
| --- | --- | --- |
| `/auth` | `authRouter` | `register`, `login`, `refresh`, `logout`, `me`, `profile`, `password/change`, `password-reset/request`, `password-reset/confirm`, `sessions`, `sessions/others`, `sessions/:id` |
| `/learning` | `learningRouter` + `learnerProgressRouter` | learner: languages, units, lessons, exercises, attempts (`start/submit/abandon/result`), runtime, search; progress: `dashboard`, `progress`, `badges`, `certificates`, `leaderboard` |
| `/content` | `contentRouter` (staff: `content_manager`/`system_admin`) | full CRUD + publish/unpublish/archive for languages, units, lessons, exercises; reorder + performance |
| `/admin/users` | `adminUsersRouter` | staff user management |
| `/community` | `communityRouter` | threads, posts, moderation |
| `/notifications` | `notificationsRouter` | learner + staff notifications |
| `/platform` | `platformRouter` | bootstrap + platform meta |
| `/reports` | `staffReportsRouter` | staff progress report |

Cross-cutting:
- Cookie-based auth via `lingo_refresh_token`; `attachAuthContext` middleware reads access creds; `requireRole(...)` gates routes; CORS is **credentialed** (`credentials: true`) against `CORS_ORIGINS` (default `http://localhost:3000`).
- All success responses go through `sendSuccess` (envelope with `requestId`); errors through `errorHandler` middleware.
- Zod request/response contracts live in `@lingo/contracts`; OpenAPI spec generated at `apps/api/openapi/openapi.v1.json` (also served when `OPENAPI_ENABLED`).
- Default port `4000`.
- Roles: `learner | content_manager | system_admin` — note the frontend currently models `'learner' | 'admin'`; the integration must reconcile this.

## 2. Guiding Principles

1. **Incremental, never big-bang.** One surface at a time; the previous mock stays until its replacement is verified.
2. **Contract as source of truth.** Generate frontend types from `openapi.v1.json` (or import from `@lingo/contracts` if we publish it) rather than hand-typing DTOs.
3. **TanStack Query everywhere.** `QueryClient` is already wired. Each backend resource gets a `useXxx` hook so cache invalidation is centralized.
4. **One HTTP client.** A single `apiClient` (fetch wrapper) handles base URL, `credentials: 'include'`, JSON parsing, error normalization, and 401 → refresh → retry.
5. **Cookies, not tokens-in-localStorage.** The backend already issues `lingo_refresh_token` as an HttpOnly cookie. Migrate `AuthContext` off `localStorage.lingo_token` to a `whoami` (`GET /auth/me`) bootstrap call.
6. **Feature flag the cutover.** A small `useMockApi` flag (env var `VITE_USE_MOCK_API`) lets us toggle each domain to live while keeping mocks around for demos.
7. **Reconcile shapes at the edge.** Add thin adapters where backend DTOs differ from current frontend types (e.g. role, language id, lesson id formats), but converge frontend types onto backend ones over time.
8. **Test as we go.** Each phase ships with at least one MSW-backed integration test or a Playwright happy-path; do not regress unrelated surfaces.

## 3. Cross-Cutting Setup (Phase 0)

These land before any feature-specific work.

### 3.1 Backend touch-ups (lightweight)
- Add a `.env.local` example with `CORS_ORIGINS=http://localhost:8080` (the frontend's actual port) and document `cookieDomain`, `cookieSecure=false` for local dev.
- Confirm `OPENAPI_ENABLED=true` in local dev so we can pull `openapi.v1.json`.
- (Optional, nice-to-have) publish `@lingo/contracts` types via a `tsconfig` path or a generated `.d.ts` bundle the frontend can consume directly. If too invasive, defer to OpenAPI codegen.

### 3.2 Frontend foundation
- New env: `VITE_API_BASE_URL` (default `http://localhost:4000/api/v1`), `VITE_USE_MOCK_API` (default `true` until we flip surfaces).
- `src/api/client.ts`: a tiny `fetch` wrapper that:
  - prefixes `VITE_API_BASE_URL`,
  - sets `credentials: 'include'` and `Content-Type: application/json`,
  - unwraps the success envelope (`{ data, meta }`) and throws a typed `ApiError` (status, code, message, requestId) for non-2xx,
  - on `401` for any request other than `/auth/refresh` and `/auth/login`, attempts `POST /auth/refresh` once and retries the original request; on second failure clears auth context.
- `src/api/types.ts`: import or generate types from the OpenAPI spec (`openapi-typescript` recommended — adds `openapi-typescript` as a dev dep, output → `src/api/generated.ts`, regenerate via `npm run codegen`).
- `src/api/queryKeys.ts`: stable query-key factories per domain (`['auth','me']`, `['learning','languages']`, …).
- Wire `vite.config.ts` proxy (`/api → http://localhost:4000`) so the browser sees same-origin URLs in dev (helps with CORS and cookies).

### 3.3 Test infrastructure
- Add MSW (`msw`) for unit/integration tests against the spec; share handler factories with Storybook if used later.
- Add `playwright-fixture.ts` flows for the auth happy path (already scaffolded).

**Exit criteria (Phase 0):** `apiClient` can call `GET /api/v1/platform/bootstrap` (or any unauthenticated route) successfully from the running frontend, including via the dev proxy. No feature surfaces flipped yet.

## 4. Incremental Phases

Each phase: **Scope → Endpoints → Frontend changes → Cutover → Verification**.

### Phase 1 — Auth & session bootstrap
**Scope.** Replace `mockAuth.ts` with real `/auth` endpoints. Move session state from `localStorage` to cookies + `whoami`.

**Endpoints.**
- `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`
- `POST /auth/refresh` (called by `apiClient` on 401)
- `GET /auth/me` (bootstrap)
- `POST /auth/password-reset/request`, `POST /auth/password-reset/confirm`

**Frontend changes.**
- New `src/api/auth.ts` exporting `login`, `register`, `logout`, `requestPasswordReset`, `confirmPasswordReset`, `getMe`.
- New `useAuthQueries.ts` hook: `useMeQuery`, `useLoginMutation`, `useLogoutMutation`, etc.
- Rewrite `AuthContext`:
  - drop `lingo_token` / `lingo_user` from `localStorage`,
  - on mount, call `getMe()`; treat `401` as unauthenticated,
  - store `user` from the API response; expose `loading` from the query,
  - on `login` mutation success, invalidate `['auth','me']`.
- Map backend role `'content_manager' | 'system_admin'` → frontend `'admin'` in the adapter; keep `'learner'` as-is. (Or migrate frontend `User.role` to backend's three-role enum — recommended; touches `ProtectedRoute` and admin route gates.)
- Update `Login.tsx`, `Signup.tsx`, `ForgotPassword.tsx`, `ResetPassword.tsx` to call the new client.
- Onboarding flag (`lingo_onboarded`) stays on `localStorage` until `/auth/profile` exposes it (or move it to a `users.preferences` field as a follow-up).

**Cutover.** Behind `VITE_USE_MOCK_API`; flip to live for the auth surface once happy-path login/logout/refresh works.

**Verification.** Playwright: register → land on onboarding; login admin → land on `/admin`; logout clears cookies; expired access token silently refreshes; bad password shows API error message.

### Phase 2 — Learner curriculum (read-only)
**Scope.** Drive `Home.tsx`, `CourseRoadmap.tsx`, `LessonPlayer.tsx` (read side) from the backend instead of `courseContent.ts`.

**Endpoints.**
- `GET /learning/languages`, `GET /learning/languages/:id`
- `POST /learning/languages/:id/select`
- `GET /learning/languages/:id/units`, `GET /learning/units/:id/lessons`
- `GET /learning/lessons/:id`, `GET /learning/lessons/:id/exercises`, `GET /learning/lessons/:id/runtime`

**Frontend changes.**
- `src/api/learning.ts` + `useLearning*` hooks (`useLanguagesQuery`, `useUnitsQuery(languageId)`, `useLessonQuery(lessonId)`, etc.).
- Adapter that maps backend `Language` / `Unit` / `Lesson` / `Exercise` DTOs to existing component props; over time, refactor components to consume the backend shape directly and delete the adapter.
- `LanguageSelection.tsx` calls `POST /learning/languages/:id/select` and updates the user via the next `getMe` invalidation.
- Keep `courseContent.ts` around only for code that doesn't need the network (e.g., unit tests, Storybook).

**Cutover.** Flip the learner curriculum behind the flag once a beginner Amharic course is seeded in the backend.

**Verification.** Browse course roadmap end-to-end; loading and empty states render; switching languages updates the dashboard.

### Phase 3 — Learner attempts & dashboard
**Scope.** Replace `useLessonProgress` (`localStorage`) with real attempts, and back `Dashboard.tsx` with `/learning/dashboard`.

**Endpoints.**
- `POST /learning/lessons/:id/attempts` (start)
- `POST /learning/attempts/:attemptId/submit`
- `POST /learning/attempts/:attemptId/abandon`
- `GET /learning/attempts/:attemptId/result`
- `GET /learning/attempts` (history)
- `GET /learning/dashboard`, `GET /learning/progress`, `GET /learning/badges`, `GET /learning/certificates`, `GET /learning/leaderboard`

**Frontend changes.**
- `LessonPlayer.tsx`: on enter → `POST attempts`, on each exercise → buffer answers, on finish → `POST submit`; navigate to `LessonResult.tsx` with the result payload.
- Delete `useLessonProgress.ts`; derive "completed" from `GET /learning/progress`.
- `Dashboard.tsx`, `StreakHistory.tsx`, `BadgeHistory.tsx`, `SkillProgress.tsx`, `Leaderboard.tsx` each get their own query hook.
- Pessimistic UI for `submit` (we wait for the result); optimistic UI for `mark complete` if we keep an intermediate state.

**Verification.** Complete a lesson; XP / streak / dashboard tiles update on next render. Leaderboard reflects new attempts.

### Phase 4 — Community
**Scope.** Replace any moderation/community mocks with `/community/threads` and `/community/threads/:id/posts`.

**Endpoints.** `GET/POST /community/threads`, `GET /community/threads/:id`, `GET/POST /community/threads/:id/posts`, moderation `PATCH` endpoints (admin only).

**Frontend changes.**
- `Community.tsx` switches to `useThreadsQuery`, with thread detail + post composer.
- Admin moderation panel (added in Phase 5 below) gets `PATCH /community/...`.

**Verification.** Create a thread, reply, see it in the list; admin can flag/hide a post.

### Phase 5 — Admin surfaces
**Scope.** Replace `data/adminStore.ts` entirely.

**Endpoints.**
- `/content/*` for languages/units/lessons/exercises CRUD + publish/archive/reorder (`AdminLessons.tsx`)
- `/admin/users/*` (`AdminUsers.tsx`)
- `/reports/progress` + `/content/lessons/:id/performance` (`AdminAnalytics.tsx`, `AdminOverview.tsx`)
- `/community/...` moderation (extends Phase 4)

**Frontend changes.**
- One `useContent*` family of hooks; rich tables get server-driven pagination/sorting (query params already supported via `StaffCurriculumListQuerySchema`).
- Confirm-dialog flows for publish/archive (irreversible-ish actions).
- Audit log surface can read from `/reports/...` or a future audit endpoint; if missing, keep the local audit log scoped to mock until backend exposes it.

**Verification.** Editor can create a lesson, add exercises, reorder, publish, and see it appear in the learner course (Phase 2). Admin can suspend a user and the next login fails.

### Phase 6 — Notifications, profile preferences, polish
**Scope.** Final mock removals.

**Endpoints.**
- `/notifications` (list, mark-read)
- `PATCH /auth/profile` for `dailyGoal`, `selectedLanguage`, `name`
- `/auth/sessions*` for a "Logged-in devices" panel under Profile

**Frontend changes.**
- `Profile.tsx` writes preferences via `PATCH /auth/profile` instead of `AuthContext.setPreferences` writing to `localStorage`.
- Optional toast/badge system tied to `/notifications`.
- Delete the last `localStorage` keys (`lingo_user`, `lingo_token`, `lingo_admin_*`, `lingo_completed_lessons`).
- Remove `VITE_USE_MOCK_API` and the mock modules.

**Verification.** Full Playwright suite (learner + admin) passes against a live backend with no mocks reachable.

## 5. Suggested Sequencing & Dependencies

```
Phase 0 (setup) ──► Phase 1 (auth)
                         │
                         ├──► Phase 2 (curriculum read)
                         │           │
                         │           └──► Phase 3 (attempts/progress)
                         │
                         ├──► Phase 4 (community)         ──┐
                         │                                   ├──► Phase 6 (notifications/profile/cleanup)
                         └──► Phase 5 (admin)              ──┘
```

Phases 2/4/5 can be parallelized across people once Phase 1 lands.

## 6. Risks & Open Questions — and how they're resolved

All six risks from the original plan have been addressed in this commit. The
table records each risk, the chosen resolution, and the file(s) that now
encode it. Anything still open is called out at the end.

### 6.1 Role model mismatch — RESOLVED
Frontend had `'learner' | 'admin'`; backend has `'learner' | 'content_manager' | 'system_admin'`.

**Resolution.** Frontend was migrated to the backend enum:
- `src/types/index.ts` exports `userRoles`, `UserRole`, `staffRoles`, `StaffRole`, `isStaffRole`. `User.role: UserRole`.
- `src/components/ProtectedRoute.tsx` accepts the three real roles **and** the literal `'admin'` as a sugar alias that expands to both staff roles — so the existing `<ProtectedRoute allowRoles={["admin"]}>` declarations in `App.tsx` keep working unchanged. Redirect-on-deny uses `isStaffRole()`.
- `src/pages/Login.tsx` routes post-login traffic via `isStaffRole(result.user.role)`.
- `src/data/adminStore.ts` and `src/pages/AdminUsers.tsx` now type and render the three real roles; the admin-users role select offers all three; the seed user `admin@lingoabyssinia.com` is `system_admin`.
- `src/api/mockAuth.ts` emits the real enum: emails containing `system` or `sysadmin` → `system_admin`; emails containing `admin`, `editor`, or `content` → `content_manager`; otherwise `learner`. Phase 1 deletes this file entirely.

### 6.2 Mock IDs vs ObjectIds — RESOLVED
Mock IDs are slugs like `les-101`; backend uses 24-char hex ObjectIds.

**Resolution.**
- New `src/lib/objectId.ts` exports a branded `ObjectIdString` type plus `isObjectIdString` and `assertObjectId` helpers.
- An audit confirmed **no component slices or parses the `les-`/`u-`/`a-` prefix** — the slugs are only used as opaque keys and URL params, so swapping them for ObjectIds during each phase's cutover is a drop-in.
- Use `assertObjectId` at the boundary (URL params from React Router, props passed to query hooks) starting with Phase 2 so a bad ID fails loudly instead of silently 404-ing.

### 6.3 Onboarding flag — RESOLVED (no backend change needed)
Backend exposes `UserProfile.preferences.preferredLanguageId` (`@lingo/contracts/auth.ts`) but no dedicated `onboarded` field.

**Resolution.** Derive onboarding state from preferences:
- New `src/lib/onboarding.ts` exports `needsOnboarding({ role, preferredLanguageId })` — a learner needs onboarding iff `preferredLanguageId == null`. Staff users never need onboarding.
- The legacy `localStorage.lingo_onboarded` key is retained as a fallback (`legacyOnboarded()`) only until Phase 1 ships; `AuthContext` will switch to the derived check when it adopts `/auth/profile`.
- No backend addition required; the rule is documented inline in `src/lib/onboarding.ts`.

### 6.4 Cookie + CORS in dev — RESOLVED
Backend defaulted `CORS_ORIGINS` to `http://localhost:3000`; frontend dev server runs on `:8080`. Credentialed cookies (`lingo_access_token`, `lingo_refresh_token`) made cross-origin development fragile.

**Resolution — two layers, both in place:**
1. **Vite dev proxy.** `vite.config.ts` now proxies `/api/*` → `VITE_BACKEND_URL` (default `http://localhost:4000`). Frontend code calls `/api/v1/...` as same-origin, so cookies behave like first-party with `SameSite=Lax` and `Secure=false` (the backend's existing dev settings) without browser fuss.
2. **CORS allowlist.** `apps/api/.env.example` and `apps/api/.env` now include `http://localhost:8080` in `CORS_ORIGINS` for direct-call scenarios (Storybook, Playwright UI). Backend cookie config (`apps/api/src/lib/auth/cookies.ts`) is unchanged: `httpOnly: true`, `sameSite: 'lax'`, `secure` driven by `COOKIE_SECURE` (false in dev, must be true in prod — already enforced by `packages/config`).
3. **Frontend env scaffolding.** New `lingo-abyssinia-frontend/.env.example` documents `VITE_BACKEND_URL`, `VITE_API_BASE_URL=/api/v1`, and `VITE_USE_MOCK_API=true`.

### 6.5 Contracts drift — RESOLVED
No automation tied frontend types to `apps/api/openapi/openapi.v1.json`.

**Resolution.**
- `lingo-abyssinia-frontend/package.json` adds `openapi-typescript` (dev dep) plus two scripts: `npm run codegen` regenerates `src/api/generated.ts` from the backend's checked-in OpenAPI spec; `npm run codegen:check` is a diff-based check suitable for CI to fail when the spec changes without a regen.
- `src/api/generated.ts` is committed as a stub (empty `export {}`) so the file exists for the first import; the first real `npm run codegen` after dependency install populates it.
- Workflow: when a backend contract changes, regenerate the spec (`pnpm --filter @lingo/api run openapi:generate`), then run `npm run codegen` in the frontend. CI runs `codegen:check` and fails if drift exists.

### 6.6 Backend coverage audit — RESOLVED
Confirmed the surfaces the frontend needs are reachable. Findings:

| Frontend surface | Backend endpoint(s) | Status |
| --- | --- | --- |
| Auth (login, register, refresh, me, password reset, password change, profile, sessions) | `/api/v1/auth/*` | **Complete.** Cookie-based; matches frontend needs. |
| Learner curriculum (Home, CourseRoadmap, LessonPlayer) | `/api/v1/learning/languages`, `/units`, `/lessons`, `/lessons/:id/exercises`, `/lessons/:id/runtime`, `/search` | **Complete.** |
| Attempts (LessonPlayer, LessonResult) | `/api/v1/learning/lessons/:id/attempts`, `/attempts/:id/submit`, `/abandon`, `/result`, list | **Complete.** |
| Dashboard, streak, badges, skills, leaderboard | `/api/v1/learning/dashboard`, `/progress`, `/badges`, `/certificates`, `/leaderboard` | **Complete.** |
| Profile preferences (selectedLanguage, dailyGoal) | `PATCH /api/v1/auth/profile` (`preferredLanguageId`, `dailyLearningGoalMinutes`) | **Complete** — frontend adapter must map `selectedLanguage` ↔ `preferredLanguageId` and `dailyGoal` (minutes) ↔ `dailyLearningGoalMinutes`. |
| Community (threads, posts, moderation) | `/api/v1/community/*` | **Complete.** |
| Admin lessons (CRUD, publish, archive, reorder) | `/api/v1/content/*` | **Complete.** Staff role (`content_manager`, `system_admin`) required. |
| Admin users (list, suspend, reactivate, revoke sessions, create) | `/api/v1/admin/users/*` | **Complete.** `system_admin` only — UI must hide management for `content_manager`. |
| Admin analytics + lesson performance | `/api/v1/reports/progress`, `/api/v1/content/lessons/:id/performance`, `/exercises/:id/performance` | **Complete.** |
| Notifications | `GET /api/v1/notifications`, `/unread-count`, `POST /:id/read`, `/read-all` | **Complete.** Frontend has no notification UI yet — surface lands in Phase 6. |
| Audit log (visible in `AdminOverview`) | _no public route today_ | **Gap.** Mock-only for now (`data/adminStore.ts` keeps the local audit list). Phase 5 can either keep audit local or request a backend `/audit-logs` endpoint; documented as a follow-up rather than a blocker. |
| Onboarding flag | derived from `preferences.preferredLanguageId` | See R3. |

**Net.** One small gap (admin audit log endpoint); everything else is covered.

## 7. Definition of Done (per phase)

- Mocks for that surface are deleted (or guarded by `VITE_USE_MOCK_API` for one release).
- All affected pages render loading / empty / error states from real responses.
- TanStack Query keys are stable and invalidations are correct.
- At least one happy-path Playwright run is green against `lingo-backend` running locally.
- No `localStorage` writes for that surface remain.

## 8. Changes Landed With This Plan

Resolutions for the six risks are already on disk:

- **Frontend**
  - `src/types/index.ts` — role enum migrated to backend's three roles + helpers.
  - `src/components/ProtectedRoute.tsx` — accepts real roles and the `'admin'` alias.
  - `src/pages/Login.tsx` — redirect uses `isStaffRole`.
  - `src/api/mockAuth.ts` — emits backend roles.
  - `src/data/adminStore.ts`, `src/pages/AdminUsers.tsx` — three-role UI, seed user updated.
  - `src/lib/objectId.ts` — `ObjectIdString` brand + validator.
  - `src/lib/onboarding.ts` — onboarding derived from `preferredLanguageId`.
  - `src/api/generated.ts` — codegen stub.
  - `vite.config.ts` — `/api` dev proxy.
  - `.env.example` — frontend env scaffolding.
  - `package.json` — `openapi-typescript` dev dep + `codegen` / `codegen:check` scripts.
- **Backend**
  - `apps/api/.env.example`, `apps/api/.env` — `CORS_ORIGINS` includes `http://localhost:8080`.

After running `npm install` in `lingo-abyssinia-frontend`, run `npm run codegen` once to populate `src/api/generated.ts` from the checked-in `openapi.v1.json`.
