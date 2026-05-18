# 🎨 Career Tracking Platform — Frontend Design System Specification

## 1. Design Philosophy (Non-Negotiable)

This is not a decorative UI. It’s a **high-density productivity system**.

So the design principles are:

- **Clarity > beauty**
- **Speed of interaction > visual complexity**
- **Information density > whitespace indulgence**
- **Predictability > creativity in UI behavior**

Think:

> Linear, Notion-like structure + Linear.app dashboard precision + minimal SaaS polish

---

## 2. Color System (Core Decision Layer)

We define a **semantic color system**, not random palette usage.

### 2.1 Primary Color (Brand + Action Anchor)

- **Primary:** `#4F46E5` (Indigo-600)

Usage:

- Primary buttons
- Active navigation state
- Key highlights (selected filters, active tabs)
- Links in dashboard context

Why:

- Strong SaaS identity
- Trust + productivity association
- Works well in dark and light themes

---

### 2.2 Secondary Color (Support Actions)

- **Secondary:** `#06B6D4` (Cyan-500)

Usage:

- Secondary buttons
- Info highlights
- Supporting charts (non-critical metrics)
- Tags (neutral importance)

Why:

- Visually distinct from primary
- Good for layered dashboards

---

### 2.3 Accent Color (Attention / Signals)

- **Accent (Warning/Highlight):** `#F59E0B` (Amber-500)

Usage:

- Pending applications
- “Needs attention” states
- Reminders / alerts
- Important UI nudges

Why:

- Human attention naturally reacts to warm tones
- Avoids conflict with primary system colors

---

### 2.4 Status Colors (Critical System Layer)

We treat status as **data states**, not decoration.

| State   | Color     | Meaning             |
| ------- | --------- | ------------------- |
| Success | `#22C55E` | Offer / Completed   |
| Warning | `#F59E0B` | Interview / Pending |
| Error   | `#EF4444` | Rejected / Failed   |
| Info    | `#3B82F6` | Applied / In review |

---

### 2.5 Neutral Scale (Core UI Backbone)

We use strict grayscale hierarchy:

- `50 → 950` Tailwind-style scale

Key usage rules:

- `50–100`: Backgrounds
- `200–300`: Borders
- `400–500`: Muted text
- `600–900`: Primary text hierarchy

Example:

- Primary text: `#111827`
- Secondary text: `#6B7280`

---

### 2.6 Background System

- **Light Mode Background:** `#F9FAFB`
- **Dark Mode Background:** `#0B1220`

Card surface layering:

- Level 0: App background
- Level 1: Cards
- Level 2: Floating panels / modals

---

## 3. Typography System

### Font Choice

- Primary: **Inter**
- Monospace (data/logs): **JetBrains Mono**

---

### Type Scale

| Level | Size    | Usage           |
| ----- | ------- | --------------- |
| H1    | 32px    | Page titles     |
| H2    | 24px    | Section headers |
| H3    | 18px    | Card titles     |
| Body  | 14–16px | Default text    |
| Small | 12px    | Metadata        |

---

### Rules

- Never use more than 2 font weights in UI:
  - 400 (normal)
  - 600 (emphasis)

---

## 4. Layout System

### Grid

- 12-column grid for dashboard views
- 8px spacing system (strict)

---

### Spacing Scale

- 4px (xs)
- 8px (sm)
- 12px (md)
- 16px (lg)
- 24px (xl)
- 32px (2xl)

---

### Container Widths

- Dashboard max width: `1280px`
- Content max width: `1024px`

---

## 5. Component Design System

### 5.1 Buttons

Types:

- Primary → Indigo fill
- Secondary → outline cyan
- Ghost → text only

Rules:

- Height fixed: 40px
- Radius: 8px
- No mixed styling variants inside a page

---

### 5.2 Cards (Core UI Element)

Used everywhere: jobs, companies, interviews.

Specs:

- Background: white / dark gray
- Border: subtle `200`
- Radius: 12px
- Padding: 16–20px

States:

- Default
- Hover (slight elevation + border highlight)
- Active (left accent bar in primary color)

---

### 5.3 Tables (Critical for job tracking)

Must support:

- Sorting
- Filtering
- Inline status badges
- Row hover actions

Rule:

> Tables are primary UI, not secondary.

---

### 5.4 Status Badges

Pill style:

- Rounded full
- Small font (12px)
- Color-coded by system states

---

### 5.5 Forms

- Label above input (never inline)
- Required fields marked subtly
- Error states always below input
- Auto-save indication (future)

---

## 6. Dashboard Layout System

### Structure

```
Sidebar | Main Content | Right Insight Panel (optional)
```

### Sidebar

- Job Applications
- Companies
- Interviews
- Analytics
- Settings

### Main Panel

- Tables / lists / charts

### Insight Panel

- Quick stats
- Upcoming interviews
- Suggested actions

---

## 7. Data Visualization Rules

### Chart Types

- Funnel → Application pipeline
- Line → Activity over time
- Bar → Company comparisons

Rules:

- No 3D charts
- No decorative charts
- Every chart must answer a question

---

## 8. Interaction Design Principles

- Every action must have immediate feedback
- No hidden actions
- No hover-only critical functionality
- Keyboard shortcuts for power users (future)

---

## 9. Dark Mode Strategy

Dark mode is **first-class**, not an afterthought.

- Reduce contrast, not invert colors blindly
- Avoid pure black backgrounds
- Maintain semantic colors unchanged

---

## 10. Design Token Summary (Core System)

If you build only one thing from this doc, build this:

```ts
colors: {
  primary: "#4F46E5",
  secondary: "#06B6D4",
  accent: "#F59E0B",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
}
```

---

## 11. Strategic Warning (Important)

Right now your biggest risk is:

> Overbuilding UI complexity before locking data model + user flow.

Fix order should be:

1. Data schema (PostgreSQL)
2. API design (NestJS modules)
3. Core UI system (this doc)
4. Only then screens

If you skip this, you'll rebuild UI 2–3 times.

---
