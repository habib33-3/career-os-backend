# 🎨 Career Tracking Platform — Design System (Canonical v1.1)

This is a **strict design-code contract**.
If a token is defined here, it MUST exist in `globals.css`.

If it is not in `globals.css`, it does NOT exist.

---

# 1. Core Philosophy

This system is optimized for:

- High-density SaaS dashboards
- Fast scanning and decision-making
- Predictable UI behavior at scale

### Non-negotiables

- No arbitrary colors in UI
- No component-level styling exceptions
- No duplicated semantic meanings
- Everything must be token-driven

---

# 2. Design Token Architecture

We use 3 strict layers:

## 2.1 Base Surfaces

Layout structure:

- background
- card
- popover
- muted

## 2.2 UI Intent (Actions)

Interaction meaning:

- primary
- secondary
- accent
- destructive

## 2.3 Data States

Business meaning:

- success
- warning
- error
- info

---

# 3. Color System (SOURCE OF TRUTH: CSS)

## 3.1 Base Surfaces

| Token      | Light           | Dark            | Usage           |
| ---------- | --------------- | --------------- | --------------- |
| background | oklch(0.99 0 0) | oklch(0.12 0 0) | app base        |
| card       | oklch(1 0 0)    | oklch(0.17 0 0) | content surface |
| popover    | same as card    | oklch(0.19 0 0) | floating UI     |
| muted      | oklch(0.96 0 0) | oklch(0.22 0 0) | subtle surfaces |

---

## 3.2 UI Intent Colors (Actions)

| Token       | Value   | Meaning                       |
| ----------- | ------- | ----------------------------- |
| primary     | #4F46E5 | main action                   |
| secondary   | #06B6D4 | supporting action             |
| accent      | #F59E0B | attention / warning highlight |
| destructive | #EF4444 | destructive action            |

> ⚠️ IMPORTANT: “accent” is intentionally aligned with warning behavior. No separate warning color exists.

---

## 3.3 Data State Colors

| Token   | Value   |
| ------- | ------- |
| success | #22C55E |
| warning | #F59E0B |
| error   | #EF4444 |
| info    | #3B82F6 |

---

## 3.4 Neutral System

Neutral system is **implicit**, not tokenized.

Rules:

- Background layering defines neutrality
- No separate gray scale tokens are used
- Contrast is achieved via surface elevation

---

## 3.5 Borders & Inputs

- border = subtle separation layer
- input = stronger interactive border

### Dark mode rule

> Borders must remain visible at minimum 12–18% opacity

---

# 4. Typography System

Font stack (must exist in CSS):

- Primary: Inter
- Mono: JetBrains Mono

---

## Type Scale

| Role  | Size    | Usage                        |
| ----- | ------- | ---------------------------- |
| H1    | 32px    | page title only              |
| H2    | 24px    | section headers              |
| H3    | 18px    | entity titles (job, company) |
| Body  | 14–16px | default text                 |
| Small | 12px    | metadata only                |

---

## Typography Rules

- Max 2 font weights:
  - 400 (normal)
  - 600 (emphasis)

- Headings are NOT decorative

- H3 = entity-level labeling only

- Small text is never interactive

---

# 5. Layout System

## Grid

- 12-column system

## Container Widths

- App max width: 1280px
- Content max width: 1024px

## Spacing Scale (STRICT)

4 / 8 / 12 / 16 / 24 / 32

---

## 5.1 Density System (MUST BE IMPLEMENTED IN UI)

```ts
compact → 8px spacing
default → 12px spacing
comfortable → 16px spacing
```

Usage:

- tables → compact
- dashboards → default
- onboarding → comfortable

---

# 6. Component System

---

## 6.1 Buttons

### Types

- primary → indigo fill
- secondary → cyan outline
- ghost → text only

### Rules

- height: 40px fixed
- radius: 8px
- no mixed variants in same context

### States

- default
- hover
- active
- disabled
- loading

---

## 6.2 Cards (Core UI Unit)

### Base

- background: card token
- border: subtle
- radius: 12px
- padding: 16–20px

### States

- default
- hover (elevation + border highlight)
- selected (primary accent border)

---

## 6.3 Tables (PRIMARY SYSTEM SURFACE)

Tables are NOT secondary UI.

Must support:

- sorting
- filtering
- inline actions
- status badges

Row states:

- default
- hover
- selected
- disabled

---

## 6.4 Status Badges

- pill style
- 12px text
- strict mapping to data state tokens

---

## 6.5 Forms

Rules:

- label always above input
- errors always inline below field
- required fields subtle
- inputs must use border/input tokens only

---

# 7. Dashboard Layout

```
Sidebar | Main Content | Insight Panel (optional)
```

---

## Sidebar Rules

- max 7 primary items
- active state always visible
- collapse preserves icons + tooltips
- max depth = 2 levels

---

## Main Content

- tables
- workflows
- charts

## Insight Panel

- stats
- reminders
- suggestions

---

# 8. Data Visualization Rules

Allowed:

- funnel (pipeline)
- line (activity)
- bar (comparison)

Forbidden:

- 3D charts
- decorative charts
- charts without a decision purpose

Rule:

> Every chart must answer ONE decision question

---

# 9. Interaction System

Every interaction follows:

## 1. Immediate feedback

- optimistic UI OR skeleton loading

## 2. Result state

- success toast OR inline update

## 3. Error state

- inline error (no modals except critical system failure)

---

# 10. Dark Mode Rules

Dark mode is a **separate elevation system**, not an inversion.

Rules:

- no pure black backgrounds
- preserve semantic colors unchanged
- maintain 3 visible surface layers
- ensure borders remain visible at all times

---

# 11. CSS CONTRACT (MANDATORY MATCH)

Your `globals.css` MUST define:

---

## Base Tokens

- --background
- --foreground
- --card
- --popover
- --muted

## UI Intent

- --primary
- --secondary
- --accent
- --destructive

## Data States

- --success
- --warning
- --error
- --info

## System

- --border
- --input
- --ring

## Sidebar

- --sidebar
- --sidebar-foreground
- --sidebar-primary
- --sidebar-accent
- --sidebar-border
- --sidebar-ring

## Typography (REQUIRED)

- --font-sans
- --font-mono

---

## 12. Implementation Rule (NON-NEGOTIABLE)

> If a token is not defined in CSS, it MUST NOT be used in UI.

### Strict rules

- no hex in components
- no Tailwind arbitrary colors
- no ad-hoc styling
- no semantic duplication (one meaning = one token)

---

# 🧠 Final System State

This version is now:

## ✔ Fully consistent

### ✔ No semantic conflicts

### ✔ CSS-contract aligned

### ✔ Scalable for production SaaS

### ✔ Safe for team collaboration

---
