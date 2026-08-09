# Current Auth Flow Check

## Flow summary

1. `AuthProvider` is mounted inside `services/frontend/src/app/(protected)/layout.tsx`.
2. `AuthProvider` calls `useAuthBootstrap()` from `services/frontend/src/hooks/useAuthBootstrap.ts`.
3. `useAuthBootstrap` uses TanStack Query (`useQuery`) to request `GET /auth/me` from `privateApi`.
4. `privateApi` is configured with `withCredentials: true`, so browser cookies are sent.
5. If `/auth/me` succeeds, the user is written into `useAuthStore`; otherwise, the store is cleared.
6. `useAuthStore` also tracks `hydrated`, and `useAuthBootstrap` sets it true after success or error.
7. Protected API requests use `privateApi`; if a request returns 401, `axios-auth-refresh` calls `POST /auth/refresh`.
8. Backend `AuthController.refresh` uses `RefreshTokenAuthGuard` to validate the refresh JWT from cookies.
9. If valid, `AuthService.refreshToken()` verifies the hashed refresh token in Redis, rotates it, and returns a new access token and refresh token.
10. The backend sets both `access_token` and `refresh_token` cookies again after refresh.

## Current backend/auth implementation

- `login` and `register` both set HTTP-only cookies for `access_token` and `refresh_token`.
- The refresh token is hashed with Argon2 and stored in Redis under `refresh:${user.id}`.
- Refresh token rotation occurs on every refresh request.
- `logout` invalidates the refresh token in Redis and clears cookies.
- `AccessTokenStrategy` validates the access token and user role before allowing protected requests.

## Validation

The current flow is coherent and functions as intended for this application design:

- Browser cookies are used consistently for auth tokens.
- Frontend bootstraps the logged-in user state via `/auth/me`.
- Private API requests automatically refresh on 401 responses.
- Backend refresh logic properly validates and rotates refresh tokens.

## Notes

- `AuthProvider` sets `setAuthFailureHandler` on every render; this is not a functional error, but it could be moved into a stable hook if desired.
- No major flow issues were found in the current auth startup and refresh implementation.

## Conclusion

The current auth flow appears correct and complete for the project.
The frontend now uses TanStack Query for the initial auth bootstrap, which matches your requested change.
