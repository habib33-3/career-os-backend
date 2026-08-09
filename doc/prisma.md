# Prisma Initialization Guide

This document explains how Prisma was initialized in this project, the key challenges encountered during setup, and the concrete decisions taken to overcome them. The goal is not just to describe _what_ was done, but _why_—so future changes remain intentional and maintainable.

---

## 1. Why Prisma

Prisma was chosen as the ORM for three first-principle reasons:

1. **Type safety as a default** – Database schema becomes a single source of truth, generating strict TypeScript types.
2. **Explicit data access layer** – Prevents leaky abstractions common in traditional ORMs.
3. **Long-term maintainability** – Schema-driven workflows scale better as the system grows.

This aligns with a service-based backend architecture where correctness and predictability matter more than quick wins.

---

## 2. Initialization Strategy

### 2.1 Prisma Client Location

Instead of using the default Prisma client output, the client is generated into a dedicated internal directory:

- `src/generated/prisma`

**Why this matters:**

- Avoids polluting `node_modules`
- Makes Prisma an explicit internal dependency
- Works better with modern bundlers and monorepos

This follows Prisma v7’s recommended direction toward explicit client generation paths.

---

## 3. NestJS Integration Model

### 3.1 PrismaService Design

Prisma is wrapped inside a `PrismaService` that:

- Extends `PrismaClient`
- Is marked as `@Injectable()`
- Is initialized once at application bootstrap

This ensures:

- A single database connection pool
- Consistent lifecycle management
- Clean dependency injection across services

---

## 4. Key Challenges and How They Were Solved

### Challenge 1: ESM vs CJS Module Conflicts

**Problem**

- Runtime errors like:
    - `Cannot find module '@prisma/client/runtime/client'`

- Occurred after build, not during TypeScript compilation

**Root Cause**

- Mixing `NodeNext` module resolution with older CommonJS assumptions
- Prisma client being generated in a path not aligned with Node’s ESM loader expectations

**Solution**

- Standardized on `module: nodenext` and `moduleResolution: nodenext`
- Ensured Prisma client generation happens inside `src/generated`
- Avoided deep runtime imports from Prisma internals

**Outcome**

- Clean runtime resolution
- No post-build crashes

---

### Challenge 2: Prisma v7 Middleware Removal

**Problem**

- Prisma v7 removed support for `$use` middleware
- Existing patterns for logging, tracing, and error handling broke

**Root Cause**

- Prisma intentionally moved away from implicit global interception

**Solution**

- Removed middleware usage entirely
- Shifted responsibility to:
    - Service-level abstraction
    - Explicit error mapping layer

**Strategic Benefit**

- More predictable control flow
- No hidden side effects at the ORM layer

---

### Challenge 3: Adapter Configuration Confusion

**Problem**

- Unclear integration between Prisma and `@prisma/adapter-pg`
- Conflicting examples across versions

**Root Cause**

- Prisma adapters are low-level and easy to misconfigure

**Solution**

- Explicitly instantiated the adapter
- Passed it directly into `PrismaClient`
- Avoided magic configuration or environment-driven behavior

**Outcome**

- Transparent database connection logic
- Easier debugging under load

---

### Challenge 4: Error Handling Explosion

**Problem**

- Multiple error sources:
    - Prisma errors
    - HTTP exceptions
    - Unknown runtime errors

- Risk of scattered `try/catch` blocks

**Solution**

- Introduced a single error-mapping entry point
- Each error type maps itself independently
- Final composition happens in one place

**Why this scales**

- New error domains can be added without refactoring existing logic
- Keeps Prisma concerns isolated from HTTP concerns

---

## 5. Design Trade-offs (Pressure-Tested)

### Trade-off 1: No Prisma Middleware

**Cost**

- More manual work for logging and tracing

**Gain**

- Full control
- Zero magic
- Easier reasoning during incidents

Verdict: **Correct trade-off for production systems**

---

### Trade-off 2: Explicit Client Generation Path

**Cost**

- Slightly more setup

**Gain**

- Cleaner builds
- Fewer runtime surprises
- Better compatibility with monorepos and bundlers

Verdict: **Future-proof choice**

---

## 6. Final Outcome

The Prisma initialization is now:

- Explicit
- Predictable
- Version-resilient
- Aligned with NestJS lifecycle

Most importantly, it is **understandable by a new engineer** without tribal knowledge.

---

## 7. Guiding Principle Going Forward

> Prisma should be a boring dependency.

If Prisma setup becomes invisible during feature development, the initialization has done its job correctly.
