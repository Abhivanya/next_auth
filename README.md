# Next.js Auth Starter — Detailed Reference

This README documents the codebase to help you understand structure, auth flows, important files, and where to change behavior later. It is written to be a single-source, navigable guide to the code in this workspace.

---

## Quick summary

- Framework: Next.js (App Router)
- Language: TypeScript + React
- Main features: Email/password authentication, JWT access & refresh tokens, server actions for signup/login/logout, MongoDB via Mongoose.
- Primary directories:
  - app/ — application code (pages, API routes, utilities, models)
  - public/ — static assets
  - .next/ — build/dev output
  - configuration files: [package.json](package.json), [tsconfig.json](tsconfig.json), [next.config.ts](next.config.ts)

---

## Development & scripts

- Start dev server
  npm run dev

- Build
  npm run build

- Start (production)
  npm run start

Scripts and dependencies are defined in [package.json](package.json).

---

## Environment variables

Important env variables used by the app:

- MONGO_URI — MongoDB connection string
- JWT_SECRET — secret for signing access tokens
- JWT_REFRESH_TOKEN_SECRET — secret for signing refresh tokens
- JWT_TOKEN_EXPIRE — access token expiry (default `1h`)
- JWT_REFRESH_TOKEN_EXPIRES_IN — refresh token expiry (default `10d`)
- NEXT_PUBLIC_BASE_URL — base URL used by client/server actions

Keep envs in a secure `.env.local` (not committed).

---

## Project layout (files you’ll change most)

- app/lib/connectDB.ts — connection helper to MongoDB via Mongoose ([`connectDB`](app/lib/connectDB.ts))
- app/models/User.model.ts — Mongoose user model and `IUser` interface ([`User`](app/models/User.model.ts))
- app/util/password.util.ts — password hashing & comparison ([`hashPassword`](app/util/password.util.ts), [`comparePassword`](app/util/password.util.ts))
- app/util/token.util.ts — JWT helpers ([`generateToken`](app/util/token.util.ts), [`validateToken`](app/util/token.util.ts), [`generateRefreshToken`](app/util/token.util.ts), [`verifyRefreshToken`](app/util/token.util.ts))
- app/util/cookies.util.ts — cookie helpers for refresh token ([`setRefreshTokenCookie`](app/util/cookies.util.ts), [`removeRefreshTokenCookie`](app/util/cookies.util.ts))
- app/util/response.util.ts — consistent JSON responses via NextResponse ([`sendResponse`](app/util/response.util.ts))
- app/api/auth/\* — auth API routes: signup, login, logout ([app/api/auth/signup/route.ts](app/api/auth/signup/route.ts), [app/api/auth/login/route.ts](app/api/auth/login/route.ts), [app/api/auth/logout/route.ts](app/api/auth/logout/route.ts))
- app/api/refresh/route.ts — refresh access token using refresh cookie ([app/api/refresh/route.ts](app/api/refresh/route.ts))
- app/api/user/profile/route.ts — secure profile route (expects Authorization header) ([app/api/user/profile/route.ts](app/api/user/profile/route.ts))
- app/middleware.ts — protects /dashboard/\* paths (redirects to /login if no token cookie) ([app/middleware.ts](app/middleware.ts))
- app/(UI)/\* — client UI pages and server actions (signup/login forms, dashboard) ([app/(UI)/page.tsx](<app/(UI)/page.tsx>), [app/(UI)/login/page.tsx](<app/(UI)/login/page.tsx>), [app/(UI)/signup/page.tsx](<app/(UI)/signup/page.tsx>), [app/(UI)/dashboard/page.tsx](<app/(UI)/dashboard/page.tsx>), server actions in [app/(UI)/\_actions](<app/(UI)/_actions>))

---

## Data model

User schema fields (see [app/models/User.model.ts](app/models/User.model.ts)):

- username: string, required
- email: string, required, indexed, lower-cased
- password: string, required (select: false so default queries don't return it)
- refreshToken: string (select: false)
- timestamps enabled

Note: password field has a typo in schema key `requrired` — change it to `required` when updating validations.

---

## Database connection (connectDB)

Location: [app/lib/connectDB.ts](app/lib/connectDB.ts)

Behavior:

- Caches Mongoose connection across serverless invocations using a global cache object to avoid reconnects.
- Throws if MONGO_URI is not provided.
- Returns Mongoose connection instance.

When modifying DB logic, maintain the global cache pattern to avoid connection floods in serverless/edge environments.

Symbol: [`connectDB`](app/lib/connectDB.ts)

---

## Authentication flow (high-level)

Signup:

1. Client submits form handled by server action [app/(UI)/\_actions/signupAction.ts](<app/(UI)/_actions/signupAction.ts>) which POSTs to [app/api/auth/signup/route.ts](app/api/auth/signup/route.ts).
2. API route:
   - Validates inputs.
   - Checks for existing user via [`User`](app/models/User.model.ts).
   - Hashes password using [`hashPassword`](app/util/password.util.ts).
   - Saves user.
   - Generates access token via [`generateToken`](app/util/token.util.ts) and refresh token via [`generateRefreshToken`](app/util/token.util.ts).
   - Stores refresh token in DB (user.refreshToken).
   - Sets refresh token cookie via [`setRefreshTokenCookie`](app/util/cookies.util.ts).
   - Returns user (without password/refreshToken) and access token in JSON via [`sendResponse`](app/util/response.util.ts).

Login:

1. Client server action [app/(UI)/\_actions/loginAction.ts](<app/(UI)/_actions/loginAction.ts>) POSTs to [app/api/auth/login/route.ts](app/api/auth/login/route.ts).
2. API route:
   - Finds user and selects `+password +refreshToken`.
   - Verifies password using [`comparePassword`](app/util/password.util.ts).
   - Generates new tokens, updates DB refreshToken, sets refresh cookie.
   - Returns access token and user object via [`sendResponse`](app/util/response.util.ts).

Refresh:

- [app/api/refresh/route.ts](app/api/refresh/route.ts) reads refresh cookie via Next.js headers, verifies it with [`verifyRefreshToken`](app/util/token.util.ts), compares with DB value, and issues a new access token.

Logout:

- [app/api/auth/logout/route.ts](app/api/auth/logout/route.ts) clears DB refreshToken and unsets the refresh cookie using [`removeRefreshTokenCookie`](app/util/cookies.util.ts).

Profile:

- [app/api/user/profile/route.ts](app/api/user/profile/route.ts) expects an Authorization header "Bearer <token>", validates with [`validateToken`](app/util/token.util.ts) and returns user profile.

Access token usage:

- Access tokens are short-lived and returned in JSON responses. In this app, protected client routes use a cookie named `token` (set by server actions after successful signup/login). The middleware at [app/middleware.ts](app/middleware.ts) checks for this cookie to guard `/dashboard/:path*`.

Cookie handling:

- Refresh token stored as HTTP-only, secure cookie set by server-side utilities in [app/util/cookies.util.ts](app/util/cookies.util.ts).
- The cookie helper uses Next.js `cookies()` from `next/headers`.

---

## Key utilities (what each does)

- [`hashPassword`](app/util/password.util.ts) — bcryptjs salt + hash
- [`comparePassword`](app/util/password.util.ts) — bcryptjs comparison
- [`generateToken`](app/util/token.util.ts) — sign JWT access token (payload: { sub: userId })
- [`validateToken`](app/util/token.util.ts) — verify access token
- [`generateRefreshToken`](app/util/token.util.ts) — sign refresh JWT
- [`verifyRefreshToken`](app/util/token.util.ts) — verify refresh token
- [`setRefreshTokenCookie`](app/util/cookies.util.ts) — set refresh cookie with sensible flags
- [`removeRefreshTokenCookie`](app/util/cookies.util.ts) — expire refresh cookie
- [`sendResponse`](app/util/response.util.ts) — uniform NextResponse.json wrapper for API responses

---

## Client-side/server-action behavior

- Signup/login forms use Next.js server actions in [app/(UI)/\_actions](<app/(UI)/_actions>) to POST to API routes. Server actions run on the server and can set cookies via `cookies()` helper.
- After signup/login the server action sets a `token` cookie (not http-only) so the middleware can read it for client-side redirects. The refresh token cookie is httpOnly and secure to avoid client JS access.

Files:

- [app/(UI)/\_actions/signupAction.ts](<app/(UI)/_actions/signupAction.ts>)
- [app/(UI)/\_actions/loginAction.ts](<app/(UI)/_actions/loginAction.ts>)
- [app/(UI)/\_actions/logoutAction.ts](<app/(UI)/_actions/logoutAction.ts>)

---

## Middleware and route protection

- [app/middleware.ts](app/middleware.ts) runs on requests matching `/dashboard/:path*`.
- It expects a `token` cookie and redirects to `/login` if missing.
- This is a simple client-cookie-based guard; you may want to validate the token server-side (e.g., verify JWT) for stricter protection.

---

## Common places to change behavior

- Token expiry/secrets: [app/util/token.util.ts](app/util/token.util.ts)
- Cookie flags: [app/util/cookies.util.ts](app/util/cookies.util.ts)
- Password policy: [app/util/password.util.ts] & [app/models/User.model.ts](app/models/User.model.ts)
- DB connection options: [app/lib/connectDB.ts](app/lib/connectDB.ts)
- API responses: [app/util/response.util.ts](app/util/response.util.ts)

---

## Debugging tips

- Check server console logs (API routes print errors).
- Use the Network tab to inspect cookies and Authorization headers.
- If Mongo fails to connect, confirm MONGO_URI and that Mongo is reachable.
- If JWT verify fails, confirm JWT_SECRET/JWT_REFRESH_TOKEN_SECRET values and check token expirations.

---

## Security notes & improvements

- Access token is returned to client and also set in a non-httpOnly cookie named `token`. For higher security, consider:
  - Storing only the refresh token as httpOnly cookie and storing access token in memory (not a cookie).
  - Using sameSite=Lax/Strict and secure flags in production.
  - Rotating refresh tokens and tracking issuance IDs in DB.
  - Rate limiting auth endpoints.

---

## Where to start when coming back

1. Ensure envs are set: MONGO*URI, JWT*\* secrets.
2. Start dev server: npm run dev
3. Inspect signup/login flow:
   - Client action: [app/(UI)/\_actions/signupAction.ts](<app/(UI)/_actions/signupAction.ts>)
   - API: [app/api/auth/signup/route.ts](app/api/auth/signup/route.ts)
   - DB: [app/models/User.model.ts](app/models/User.model.ts)
   - Tokens: [app/util/token.util.ts](app/util/token.util.ts)

Happy hacking — this project centers around auth flows; most future changes will be in the utilities and API routes listed above.
