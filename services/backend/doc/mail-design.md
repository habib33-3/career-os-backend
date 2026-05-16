# 🎨 Email Design System (Notification Templates)

## 1. Design Philosophy

This system is built for:

- Email readability (not web UI richness)
- High contrast, minimal cognitive load
- Mobile-first responsiveness
- Zero dependency on external CSS frameworks

Core rule:

> Templates never invent design. They only consume tokens.

---

# 2. Color System (Tokens Only)

## Primary Palette

```css id="c1p9lm"
--color-primary: #2563eb; /* actions, links, OTP border */
--color-primary-soft: #eff6ff; /* background highlight */
```

---

## Neutral Palette

```css id="c2p8qr"
--color-bg: #f4f7fb; /* page background */
--color-card: #ffffff; /* email container */
--color-border: #e5e7eb; /* separators */
```

---

## Text Palette

```css id="c3k7rt"
--color-text: #111827; /* headings */
--color-text-muted: #6b7280; /* secondary */
--color-text-body: #4b5563; /* normal content */
--color-text-inverse: #ffffff;
```

---

## Semantic Rules

- ❌ No hex values in templates
- ❌ No custom colors per template
- ❌ No “creative” colors per email

---

# 3. Typography System

## Font Family (Email-safe)

```css id="t1x8mk"
font-family: Arial, Helvetica, sans-serif;
```

---

## Type Scale

| Token      | Size        | Use           |
| ---------- | ----------- | ------------- |
| `.h1`      | 28px / 36px | main title    |
| `.h2`      | 22px / 30px | section title |
| `.body-md` | 16px / 24px | main text     |
| `.body-sm` | 14px / 22px | secondary     |
| `.caption` | 12px / 18px | footer/meta   |

---

## Rules

- One `.h1` per email max
- Body text = default communication layer
- Caption = never used for important info

---

# 4. Spacing System (8pt Grid)

Everything is based on multiples of 8.

## Spacing Tokens

```css id="s1m4lp"
--space-8: 8px;
--space-16: 16px;
--space-24: 24px;
--space-32: 32px;
```

---

## Utility Classes

| Class    | Value        |
| -------- | ------------ |
| `.mt-8`  | 8px          |
| `.mt-16` | 16px         |
| `.mt-24` | 24px         |
| `.mt-32` | 32px         |
| `.p-24`  | 24px padding |

---

## Rules

- ❌ No random spacing (13px, 22px etc.)
- ❌ No inline padding except exceptions
- ✅ Always use 8-based rhythm

---

# 5. Layout System

## Container

```css id="l1m9pp"
max-width: 620px;
margin: 0 auto;
```

---

## Card

- White background
- Soft border
- Rounded corners

```css id="l2m8kk"
border-radius: 12px;
border: 1px solid #e5e7eb;
background: #ffffff;
```

---

## Sections

| Section | Purpose          |
| ------- | ---------------- |
| Header  | branding + title |
| Content | main message     |
| Footer  | legal + support  |

---

# 6. Radius System

```css id="r1k8pp"
--radius-sm: 8px;
--radius-md: 10px;
--radius-lg: 12px;
```

Usage:

- Buttons → 10px
- Cards → 12px
- Chips / OTP box → 10–12px

---

# 7. Button System

## Primary Button

```css id="b1x8qq"
background: #2563eb;
color: #ffffff;
padding: 12px 20px;
border-radius: 10px;
font-weight: 700;
```

---

## Rules

- Only ONE primary CTA per email
- Must always contrast background
- Never use multiple button styles

---

# 8. OTP / Code Design Rule

OTP must always follow:

- Monospace font
- Letter spacing: 4–6px
- Soft background
- Dashed border

Example:

```css id="o1m9qq"
font-family: monospace;
letter-spacing: 6px;
background: #eff6ff;
border: 1px dashed #2563eb;
```

---

# 9. Divider System

```css id="d1k8ww"
height: 1px;
background: #e5e7eb;
margin: 24px 0;
```

---

## 10. Critical Constraints (Non-negotiable)

### ❌ Forbidden

- Random colors per template
- Inline styling explosion
- Layout duplication
- Pixel-incorrect spacing
- Unstructured typography

---

### ✅ Required

- Use only tokens above
- Use only predefined classes
- Keep layout untouched
- Keep templates content-only

---

# 11. Mental Model

Think of it like this:

> Layout = “Engine”
> Design System = “Chassis”
> Templates = “Content payload”

If templates touch layout/design → system breaks.

---

# Strategic Warning (important)

Right now your system is **70% structured, 30% ad-hoc styling risk**.

If you don’t enforce this strictly:

- emails will drift visually
- debugging layout issues becomes expensive
- brand consistency will collapse over time

---
