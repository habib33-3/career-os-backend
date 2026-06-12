# Auth Flow Audit Findings

## Summary

The project uses a cookie-based JWT authentication flow with Access Token + Refresh Token.

- `login` and `register` return user info and set `access_token` and `refresh_token` as HTTP-only cookies.
- `privateApi` / `publicApi` both use `axios` with `withCredentials: true`, so cookies are sent with requests.
- The backend uses Passport JWT strategies for both access and refresh tokens.
- Refresh tokens are hashed and stored in Redis, then rotated on each refresh.

Overall, the architecture is consistent and appropriate for a simple token-based session flow.

## What is working well

- `AuthService.register()` and `AuthService.login()` create both tokens and store the refresh token hash in Redis.
- `AuthController.login()` and `AuthController.register()` use `@Res({ passthrough: true })`, so cookies can be set and JSON responses still work.
- `AuthController.refresh()` uses a `RefreshTokenAuthGuard` and `RefreshTokenStrategy` to validate the refresh JWT from cookies.
- Refresh logic rotates the refresh token by hashing and storing a new token after each successful refresh.
- Frontend `axios` clients are configured with `withCredentials: true`, matching the backend cookie-based design.
- The access strategy validates token type and checks the user role against the database.
- `publicApi` is used for refresh and logout so the interceptor does not recurse.

## Notable issues / recommendations

1. `AuthController.refresh()` uses `@Res()` without `passthrough: true`.
    - In NestJS, using `@Res()` without passthrough can disable automatic response handling and may mean the returned JSON body is ignored.
    - The token cookies are likely still set, so refresh may still work for retrying requests, but the endpoint should use `@Res({ passthrough: true })` for consistency.

2. Logout does not invalidate the refresh token on the server.
    - `AuthController.logout()` clears cookies from the browser, but the cached refresh token hash remains in Redis until expiry.
    - This is acceptable for a simpler implementation, but note that the refresh token remains valid server-side until its TTL expires.

3. Frontend does not explicitly re-validate the stored user on page load.
    - `useAuthStore` persists the user in local storage, and `AuthProvider` only handles auth failure.
    - If the cookie session has expired, the UI may still show a logged-in user until a protected request fails.
    - This is not a security bug, but it is a UX edge case that can be improved by fetching `GET /auth/me` on app load or on route transition.

4. `RefreshTokenStrategy` considers `Authorization` header first.
    - If an Authorization header with another token is ever present on `/auth/refresh`, the strategy could decode the wrong token first.
    - This is unlikely in the current setup because the refresh request uses `publicApi`, but the order of extraction is worth noting.

## Recommended small improvements

- Change `AuthController.refresh()` to use `@Res({ passthrough: true })`.
- Optionally clear the refresh token cache on logout if immediate revocation is desired.
- Add a backend invalidation step for logout if you want stronger session revocation.
- Consider a lightweight initial auth check on frontend startup to reconcile persisted UI state with actual cookie session state.

## Conclusion

The authentication flow is broadly correct for the current project design. The main issues are minor implementation details rather than fundamental protocol problems.

- Good: cookie-based access + refresh tokens, token rotation, hashed refresh storage, CORS/credentials alignment.
- Watch: NestJS response handling on refresh, logout token invalidation, and frontend session reconciliation.
