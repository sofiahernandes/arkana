# Arkana — Design System

Arkana manages donation campaigns for the **Lideranças Empáticas** project at FECAP: teams, contributions, receipts, goals and reports.

Most of the product is **Operate** mode — participants and administrators are inside a task, and the interface should disappear into it. Two surfaces are not: the landing page is **Persuade** and the public reports page is **Read**. The design serves the task first and carries the brand in precise details, not in decoration.

The personality is unchanged from the original build: **forest green and rose on warm cream, generously rounded, soft-shadowed.** What changed is that it is now expressed once, in tokens, instead of re-invented per page.

---

## 1. Why this system exists

Before this pass, every page rebuilt its own frame. The audit found the cause, and it was not laziness:

| Root cause | Effect |
|---|---|
| `--primary-foreground`, `--secondary-foreground`, `--card-foreground`, `--accent-foreground`, `--destructive-foreground`, `--border`, `--input`, `--ring` were referenced in `@theme` but never defined in `:root` | Every stock shadcn control shipped broken. `text-primary-foreground` resolved to nothing, `border-border` was invisible, `focus-visible:ring-ring/50` produced **no focus ring anywhere**. Developers reasonably reached for `border-gray-200`, `#b4b4b4`, `#f4f3f1` instead. |
| `body { flex items-center justify-center }` | Centered every page, so each page fought back with its own `w-screen` / `min-h-dvh` / `overflow-x-clip` combination. |
| `@theme` used `--rounded-*` keys; Tailwind v4 reads `--radius-*` | `--radius: 1rem` never applied. All 76 `rounded-*` usages silently rendered at Tailwind defaults. |
| `@import` statements sat at the **bottom** of `globals.css` (invalid CSS — `@import` must precede all rules) | `fonts.css` and `new-contribution.css` **never loaded**. Changa One was never applied, and the desktop drawer's `.side-menu` styling never existed, so the "drawer" rendered inline in the page. |
| `--button-hover` declared twice with different values | Neither was reliable. |

**The rule that follows from this:** if a token is referenced, it is defined. A half-defined semantic layer is worse than none, because it silently pushes every author into hard-coding.

---

## 2. Color

All tokens live in `styles/globals.css` under `:root` and are exposed to Tailwind via `@theme inline`. **Never write a hex literal, `rgb()`, `rgba()`, or a `gray-*` / `white` / `black` utility in `app/` or `components/`.**

### Brand

| Token | Value | Use |
|---|---|---|
| `--primary` | `#254128` forest | The brand anchor. Primary actions, active nav, page titles. |
| `--primary-hover` | `#325836` | Hover on forest fills — lightens, because the fill is dark. |
| `--primary-foreground` | `#fffefb` | 11.1:1 on forest. |
| `--secondary` | `#cd6184` rose | Brand accent: large text, chart fills, borders, decoration. |
| `--secondary-strong` | `#b85070` | **AA-safe rose.** Fills under white text, and any rose text below 18px. |
| `--secondary-hover` | `#a74662` | Hover on rose fills. |
| `--terciary` | `#fad8db` blush | Soft fills, badges, supporting actions. |

> **The two-pink rule.** `--secondary` (#cd6184) reaches only **3.7:1** against white and cream. It passes for large text (≥3:1) and fails for body text and button labels. `--secondary-strong` (#b85070) reaches **4.75:1** on both. Brand rose stays the brand rose; anything load-bearing uses the strong variant. The original `bg-secondary hover:bg-secondary/80` submit buttons were this bug.

### Surfaces

Two neutral layers, per Operate convention — a task ground distinct from the content surface.

| Token | Value | Use |
|---|---|---|
| `--background` | `#fffefb` cream | Public, marketing and auth surfaces. |
| `--surface` | `#f5f3ee` | The authenticated app ground. Replaces the `bg-[#f4f3f1]/60` pasted into three pages. |
| `--card` | `#ffffff` | Cards, panels, popovers. |
| `--muted` | `#f0ede6` | Warm muted fill: table headers, inert chips, inset form blocks. |
| `--accent` | `#f6ecee` | Hover wash. Derived from rose — **not** a gray. |

### Text, lines, feedback

`--foreground` `#242424` · `--muted-foreground` `#57534c` (7.4:1 on muted, 8.6:1 on card)
`--border` `#e6e2da` dividers and card edges · `--input` `#c9c4ba` form-control edges, which need to be seen · `--ring` = `--primary`, so focus is always the brand and never a browser blue
`--destructive` `#c53030` (5.5:1 under white) · `--success` `#1f6b4a` · `--warning` `#a5641a`

Restrained is the floor. Accent color marks primary actions, current selection and state — never decoration.

---

## 3. Typography

**Geist Sans carries the entire product.** One family for headings, labels, buttons, body and data. A fixed rem scale, not fluid — users are at a consistent DPI and a clamped heading that shrinks inside a panel looks worse, not better. Tailwind's default scale is already the ~1.2 ratio Operate wants, so it is used unmodified.

**Changa One is the brand voice and is scoped to the hero and the two brand panels.** It is loaded properly via `next/font/google` as `--font-changa-one`, exposed as the `font-display` utility. It does not appear on task UI, labels, buttons or data — a display face in a table header is a costume.

`MinhaFonte`'s `@font-face` pointed at `/fonts/` while the file sat in `styles/public-fonts/`, unserved. Both the face and the dead directory are gone.

Semantic roles:

| Role | Treatment | Owner |
|---|---|---|
| Page title | `text-2xl font-semibold uppercase tracking-wide text-primary` | `PageHeader` — uppercase gets positive tracking, or it stops being readable |
| Page description | `text-sm text-muted-foreground`, `max-w-prose` | `PageHeader` |
| Card title | `font-semibold leading-none` | `CardTitle` |
| Section heading | `text-lg font-semibold text-primary` | inline |
| Field label | `text-sm font-medium` | `Field` / `Label` |
| Body | `text-sm` | inline |
| Hint / meta | `text-xs text-muted-foreground` | `Field` |

Prose measure stays 65–75ch (`max-w-prose`). Tables may run denser. Numeric columns get `tabular-nums`.

---

## 4. Radius, elevation, motion

**Radius** — `--radius: 0.75rem` is the base, and the scale is real rather than four values 2px apart:

`rounded-sm` 6px badges/segments · `rounded-md` 8px controls, inputs, buttons · `rounded-lg` 12px cards and panels · `rounded-xl` 16px modals and large panels · `rounded-2xl` 24px feature panels.

No `rounded-[Npx]`. The pill radii (`rounded-[40px]`, `rounded-[30px]`, `rounded-[10px]`) are gone.

**Elevation** — five shadow tokens, each with a real offset and a soft blur, tinted with the forest (`37 41 32`) rather than black. A neutral shadow over cream reads grey and dirty. Use `shadow-sm` and `shadow-md` for cards, `shadow-lg` for the floating bottom nav and overlays. No custom colored shadows — the `shadow-[0_6px_20px_rgba(247,201,212,0.5)]` halo on the delete button was decoration, not depth.

**Motion** — `--duration-fast` 120ms · `--duration-base` 180ms · `--duration-slow` 280ms, with `--ease-out` = `cubic-bezier(0.16, 1, 0.3, 1)`. Motion conveys state only: state change, feedback, loading, reveal. No page-load choreography — the product loads into a task and nobody wants to watch it arrive. `globals.css` ships a `prefers-reduced-motion` block, so per-component reduced-motion overrides are not needed.

---

## 5. Layout

One measure, one set of gutters, owned by `PageShell`: `max-w-[--content-max]` (80rem) with `px-4 sm:px-6 lg:px-8`.

`--nav-width` 15rem · `--bottom-nav-height` 4.25rem.

Responsive behavior is **structural**, not fluid typography: the sidebar becomes a bottom bar, columns collapse, tables scroll. The `lg` breakpoint (1024px) is the single nav switch point.

Spacing uses Tailwind's 4px scale. The audit found this was already consistent — `gap-2`, `gap-4`, `px-3`, `px-4`, `p-6` cover about half of all usage — so it is left alone. Arbitrary values (`w-18`, `gap-4.5`, `h-120`, `h-150`, `pb-26`, `text-[22px]`, `w-[300px]`) are not.

---

## 6. Components

### The frame

| Component | Responsibility |
|---|---|
| `layout/page-shell.tsx` | Ground color, navigation, content measure, gutters, bottom-nav clearance. `nav` prop opts a surface into authenticated navigation; `ground` picks cream or app surface; `bleed` opts out of the measure for the hero. |
| `layout/page-header.tsx` | The one page title treatment, with optional description and actions. |
| `layout/auth-shell.tsx` | The split brand/form panel shared by login and sign-up. |
| `layout/info-list.tsx` | `InfoList` / `InfoRow` for read-only labelled values. |
| `layout/state-panel.tsx` | `LoadingPanel` (skeletons) and `ErrorPanel`. |

**No page declares its own background, max-width or horizontal padding.** That divergence is what made each page feel like its own product.

### Navigation

`navigation/nav-config.ts` is the single source of truth: `getNavItems(role, id)` returns the links for `"user"` or `"admin"`, and both `side-nav.tsx` (persistent, `lg` and up) and `bottom-nav.tsx` (below `lg`) render from it. Adding a link is a one-line edit that appears in both.

One vocabulary for both roles: forest fill, lucide icons at `strokeWidth={1.75}`. The admin sage palette (`#A6B895`, `#70805A`, `#6B7E5D`) was off-brand and untokenized; it is gone, along with the nine PNG icon variants the participant nav shipped. Role changes the links, not the look.

The hamburger-and-drawer pattern is gone entirely. It was never functional — its CSS never loaded — and a persistent sidebar is both the standard Operate pattern and the shared frame the product was missing. This deleted `menuOpen` state from five pages.

### Controls

**`Button`** — variants `default` (forest) · `secondary` (`bg-secondary-strong`) · `soft` (blush) · `destructive` · `outline` · `ghost` · `link`. Sizes `sm` · `default` (h-10) · `lg` · `icon` · `icon-sm`. A `loading` prop renders a spinner, sets `aria-busy` and disables the control; every submit path uses it. The ad-hoc `prettyHeader` and `prettyButton` variants are gone.

**`Input`** — h-10 to sit level with `Button` in a row, `border-input`, `bg-card`, a real focus ring, `aria-invalid` styling.

**`forms/field.tsx`** — the labelled field for the whole product. Wires `htmlFor`, `aria-describedby`, `aria-invalid` and `role="alert"`. Pass `children` to label a Select or Textarea instead of the default Input. This replaces the `bg-[white] border border-[#b4b4b4] … focus:outline-none` block that was pasted into six files — a pattern that also **removed the focus ring without replacing it**, making every form keyboard-unusable.

Every interactive component ships default, hover, focus, active, disabled and loading. Not half of them.

### Feedback

`Toaster` is mounted once in `app/layout.tsx`. `window.alert()` is not a feedback mechanism and no longer appears in the product. Errors name the problem *and* the recovery, in Portuguese; raw error objects go to `console.error`, never to the user.

Loading uses **skeletons that hold the incoming layout**, not a spinner centered in empty space. Empty states teach the interface rather than reporting absence.

---

## 7. Data layer

`lib/normalize-contributions.ts` owns the contribution shape. The ~65-line normalizer had been copy-pasted verbatim into four components, which meant a backend change required four correct edits. `hooks/use-contributions.ts` wraps fetch + normalize behind `useContributions(scope)`, where scope is `"all"` or a participant RA.

The contributions table, columns, data-table, grid and records modal each exist once, parameterized by scope, visible columns and permissions — not forked by role.

Money-adjacent parsing and the receipt-upload path each keep one runnable assert-based check.

---

## 8. Working in this system

1. **Read the token before you write a value.** If the value you want is not a token, decide whether it should be one. Usually it should not — reach for the nearest existing token.
2. **Reach for the primitive before the div.** `Card`, `Button`, `Input`, `Field`, `PageShell`, `PageHeader`. The audit found 37 hand-rolled `<button>`s and 21 hand-rolled card-likes; that is how a system erodes.
3. **A page owns its content, never its frame.**
4. **Role is a parameter, not a fork.** Two components that differ only by an endpoint or one column are one component.
5. **Contrast is not negotiable.** Body text ≥4.5:1, large text ≥3:1. When rose is involved, check which rose you are using.
6. **Every state, every time.** A control without its disabled and loading states is unfinished. An `error` in state that nothing renders is a silent failure.

### Explicitly out

Hex literals outside `globals.css` · `gray-*` / `white` / `black` utilities · arbitrary Tailwind values for size, radius, shadow or type · `focus:outline-none` without a replacement · `window.alert` · display fonts in task UI · unicode glyphs standing in for icons (`☰`, `↓`) · hotlinked images from third-party CDNs · read-only values styled to look like inputs · a modal where an inline flow would do.
