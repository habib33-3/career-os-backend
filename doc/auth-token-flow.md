# Authentication System — Full Stack Documentation (Backend + Frontend)

This document combines your **NestJS backend auth architecture** with the **frontend integration contract** into a single end-to-end reference.

---

# 1. System Overview (End-to-End)

This authentication system is built on:

- **JWT Access Token (short-lived)** → API authorization
- **JWT Refresh Token (long-lived)** → session renewal
- **HTTP-only cookies** → secure token transport
- **Redis (AppCache)** → refresh token session storage
- **Argon2 hashing** → refresh token protection
- **Passport JWT strategies** → request authentication
- **Axios (frontend)** → API communication with cookies

---

# 2. Token Strategy

## 2.1 Access Token

Used for:

- API authorization
- identifying user per request

Payload:

```json
{
    "sub": "user-id",
    "email": "user@email.com",
    "role": "USER",
    "type": "access"
}
```

Properties:

- short-lived
- stateless
- verified on every request
- stored in HTTP-only cookie

---

## 2.2 Refresh Token

Used for:

- generating new access tokens
- maintaining session continuity

Payload:

```json
{
    "sub": "user-id",
    "type": "refresh"
}
```

Properties:

- long-lived
- rotated on every refresh
- stored hashed in Redis
- stored in HTTP-only cookie

---

# 3. Backend Auth Flow

# 3.1 Register Flow

### Step 1: Check user

```ts
await prisma.user.findUnique({ where: { email } });
```

### Step 2: Hash password

```ts
const hashedPassword = await hashPassword(password);
```

### Step 3: Create user

```ts
await prisma.user.create({ data: { email, name, password: hashedPassword } });
```

### Step 4: Generate tokens

```ts
accessToken;
refreshToken;
```

### Step 5: Hash refresh token

```ts
argon2.hash(refreshToken);
```

### Step 6: Store in Redis

```
refresh:<userId> → hashedRefreshToken
```

### Step 7: Return tokens + set cookies

---

# 3.2 Login Flow

Same as register except:

- user is validated
- password verified

Then:

- generate tokens
- rotate refresh token
- overwrite Redis session

---

# 3.3 Protected Route Flow (Access Token)

Used in:

```
GET /auth/me
```

### Flow

1. Extract token from cookie
2. Verify JWT signature
3. Validate `type === access`
4. Fetch user from DB
5. Validate role match
6. Attach user to `req.user`

Output:

```ts
req.user = { sub, email, role };
```

---

# 3.4 Refresh Flow (Token Rotation)

Endpoint:

```
POST /auth/refresh
```

### Step 1: Extract refresh token from cookie

### Step 2: Verify JWT signature

### Step 3: Validate type

```ts
payload.type === "refresh";
```

### Step 4: Fetch stored hash from Redis

```
refresh:<userId>
```

### Step 5: Verify token

```ts
argon2.verify(storedHash, refreshToken);
```

### Step 6: Generate new tokens

- new access token
- new refresh token

### Step 7: Rotate Redis session

Old refresh token becomes invalid.

---

# 4. Security Model

## 4.1 Protections

- HTTP-only cookies → XSS protection
- SameSite policy → CSRF mitigation
- Argon2 hashed refresh tokens → DB compromise safety
- Token rotation → replay attack prevention
- Role validation → privilege integrity

---

## 4.2 Session Model

Current design:

```
refresh:<userId> → single session
```

Implication:

- one login per user device
- new login invalidates old session

---

# 5. Backend API Contract

| Endpoint            | Purpose         | Auth          |
| ------------------- | --------------- | ------------- |
| POST /auth/register | create account  | public        |
| POST /auth/login    | login + cookies | public        |
| GET /auth/me        | get user info   | access token  |
| POST /auth/refresh  | rotate session  | refresh token |

---

# 6. Frontend Integration (Critical Contract)

# 6.1 Core Rule

Frontend NEVER handles tokens manually.

Everything is handled via:

- HTTP-only cookies
- `withCredentials: true`

---

# 6.2 Axios Setup

```ts
import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true,
});
```

---

# 6.3 Authentication Calls

## Login

```ts
await api.post("/auth/login", { email, password });
```

Cookies are automatically set.

---

## Register

```ts
await api.post("/auth/register", { name, email, password });
```

---

## Get Current User

```ts
const { data } = await api.get("/auth/me");
```

This is your frontend auth source of truth.

---

# 6.4 App Initialization Flow

```ts
async function initAuth() {
    try {
        const { data } = await api.get("/auth/me");
        setUser(data);
    } catch {
        setUser(null);
    }
}
```

Meaning:

- valid cookie → logged in
- invalid cookie → logged out

---

# 6.5 Auto Refresh (Interceptor)

```ts
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            await api.post("/auth/refresh");

            return api(original);
        }

        return Promise.reject(error);
    }
);
```

Behavior:

- detects expired access token
- refreshes session
- retries request automatically

---

# 6.6 Logout Flow (Recommended Add)

Frontend:

```ts
await api.post("/auth/logout");
setUser(null);
```

Backend should:

- delete Redis session
- clear cookies

---

# 6.7 Protected Routes

```tsx
function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return "Loading...";
    if (!user) return <Navigate to="/login" />;

    return children;
}
```

---

# 7. Full System Lifecycle

```
REGISTER / LOGIN
        ↓
Generate Access + Refresh Tokens
        ↓
Store hashed refresh token in Redis
        ↓
Set HTTP-only cookies
        ↓
Frontend calls /me → user session established
        ↓
API requests use access token automatically
        ↓
Access token expires
        ↓
Frontend calls /refresh (auto interceptor)
        ↓
New tokens issued + rotated
        ↓
Session continues seamlessly
```

---

# 8. Key Design Strengths

### 1. Stateless API auth

Access token never hits DB

### 2. Stateful session control

Refresh token stored in Redis

### 3. Rotation-based security

Every refresh invalidates old token

### 4. Cookie-based transport

No frontend token exposure

### 5. Backend-controlled identity

Frontend cannot spoof auth state

---

# 9. Weak Points / Engineering Gaps (Important)

Let’s pressure-test this:

## 1. Single-session limitation

Current design:

```
refresh:<userId>
```

Problem:

- logs out all devices on new login

Improvement:

- add sessionId:

```
refresh:<userId>:<deviceId>
```

---

## 2. Missing logout endpoint

Without it:

- sessions cannot be explicitly invalidated

---

## 3. No CSRF protection layer

Because cookies are used with `sameSite: none/lax`

---

## 4. No refresh reuse detection

If old refresh token is reused → no global breach detection

---

# 10. Recommended Production Upgrade Path

### Level 1 (Current)

- JWT + Redis + cookie auth

### Level 2 (Recommended)

- multi-session support
- logout endpoint
- CSRF tokens

### Level 3 (Enterprise)

- device tracking
- refresh token reuse detection
- anomaly detection (IP / UA changes)
- OAuth integration (Google, GitHub)

---
