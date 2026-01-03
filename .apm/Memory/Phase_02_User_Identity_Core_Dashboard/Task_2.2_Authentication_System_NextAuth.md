# Task 2.2: Authentication System (NextAuth)

## Status: Completed

## Summary
Implemented the authentication system using NextAuth.js with a MongoDB adapter. Configured the system to support a Credentials provider for email/password login, set up protected routes using middleware, and created a kid-friendly login page.

## Key Changes
1.  **Dependencies**: Installed `@next-auth/mongodb-adapter` and `mongodb` in the frontend.
2.  **Configuration**:
    -   Created `frontend/lib/mongodb.ts` to handle the MongoDB client promise.
    -   Created `frontend/lib/auth.ts` to configure NextAuth with `MongoDBAdapter` and `CredentialsProvider`.
    -   Created `frontend/types/next-auth.d.ts` to extend the Session type to include the user ID.
    -   Added `frontend/.env` with `MONGO_URI`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL`.
3.  **API Route**: Created `frontend/app/api/auth/[...nextauth]/route.ts` to handle auth requests.
4.  **Middleware**: Implemented `frontend/middleware.ts` to protect `/dashboard` routes.
5.  **UI**: Created a kid-friendly "Sign In" page at `frontend/app/login/page.tsx` with proper error handling and redirect logic.

## Technical Details
-   **Database Strategy**: While `MongoDBAdapter` is configured, `CredentialsProvider` is currently using a mock password check. Real password verification will be connected to the backend API in a future task.
-   **Session Handling**: Using JWT strategy for sessions as it's the default and most flexible for `CredentialsProvider`.
-   **Route Protection**: Middleware ensures that any access to `/dashboard/*` requires an active session.

## Verification
-   Navigate to `/dashboard` -> Should redirect to `/login`.
-   Navigate to `/login` -> Should see the sign-in form.
-   Enter any email (existing in DB) and password -> Should redirect to `/dashboard` (Mock check allows any password if email exists, but currently since we query DB, user must exist).
    -   *Note*: Since we query the database in `authorize`, you need a user in the `users` collection for login to succeed. If no user exists, it returns null.