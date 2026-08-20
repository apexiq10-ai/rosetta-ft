# BUILD.md — ROSETTA / Narrative Architecture

You are building a single-page scrolling artifact in an already-scaffolded Next.js 15 App Router project. This file is your complete spec. Do not ask the user clarifying questions about content — all copy already exists in `src/content/content.ts` and must be imported, never rewritten or duplicated.

Read `src/content/content.ts` in full before writing any component. It is the single source of truth for every string on screen.

---

## 0. Ground rules

- Never hardcode copy in JSX. Every string rendered comes from `src/content/content.ts`.
- Never invent new copy, facts, or sources. If a screen needs something not in `content.ts`, stop and flag it — do not fabricate.
- No em dashes anywhere in code comments or generated copy (there should be none generated, but if you touch any string, respect this).
- Run `npm run build` before every commit. Do not commit if it fails. Fix the error, rebuild, then commit.
- Commit at the end of each phase, not continuously. Four phases, four commits minimum.
- This is a mobile-first artifact. Build and verify at 390px width first, then confirm desktop (1440px) doesn't break.

---

## 0.5 Design philosophy — read this before writing any component

There is no server, no database, and no API call in this build. "Robust back end" does not mean literal backend infrastructure here — it means the **content architecture** must be robust enough that a real backend (an LLM-driven Brief Engine, a CMS, a live data feed) could be bolted on later without touching a single component file. This is the actual test of that robustness: if someone swapped every array in `content.ts` for a `fetch()` call returning the same shape, no component should need to change. Build toward that constraint even though nothing in this phase actually calls an API.

Practically, this means:
- Components receive data as props or import directly from `content.ts`. Never inline a conditional that depends on knowing where the data came from.
- Every screen component should work correctly if handed a different but same-shaped object from `content.ts`. Do not write a component that only works for the specific pillar named "rails" — write a component that works for any object matching the `Pillar` type.
- The `Cascade` component in particular must be driven entirely by array lookups against `pillarId` and `audienceId`, never by a hardcoded switch statement enumerating all 20 combinations by name.

On the front end: the person using this is scrolling on a phone in an interview setting, glancing at it for ninety seconds. Every screen must be legible and make its point with zero explanation. If a screen needs a caption to explain what it's showing, the screen has failed. One idea per screen, generous whitespace, nothing competing for attention. When in doubt, delete an element rather than add one.

### State management
Use local component state only — no external state library, this app doesn't need one. `Cascade.tsx` owns two pieces of state: `selectedPillarId` and `selectedAudienceId`, both typed against the union types already defined in `content.ts` (`Pillar["id"]` and `Audience["id"]`). Default both to the first item in their respective arrays on mount, don't hardcode the literal string. `SourceDrawer` owns one piece of state: which source id (if any) is currently open, lifted to the nearest common ancestor if more than one screen needs to trigger it, otherwise kept local to that screen.

### Accessibility (non-negotiable, keep it lightweight)
- All interactive elements (source chips, cascade pill selectors, compliance footer toggle) must be real `<button>` elements, never a `<div onClick>`. This gets keyboard access and screen reader semantics for free.
- `SourceDrawer` should trap focus while open and return focus to the triggering chip on close. If implementing full focus trapping is more time than it's worth, at minimum ensure Escape closes it and it's reachable via Tab.
- Every pillar/audience selector button needs an `aria-pressed` or equivalent state so screen readers announce the current selection.
- Color is never the only signal — the "do not say" box in Cascade needs its mono label, not just a background tint, to communicate what it is.

## 1. Design tokens

Institutional, restrained, light canvas. This is going in front of a $1.6T asset manager, not a startup. Reject anything that reads as agency-dark or crypto-native.

Add to `tailwind.config.ts` under `theme.extend`:

```ts
colors: {
  canvas: "#FAFAF8",       // primary background, warm off-white, not pure white
  ink: "#0E1116",          // primary text, near-black
  slate: "#5B6270",        // secondary text
  hairline: "#E4E2DC",     // borders, dividers
  accent: "#1D4ED8",       // single accent, institutional blue, used sparingly
  accentMuted: "#EEF2FF",  // accent background tint for chips/tags
  paper: "#FFFFFF",        // card surfaces
},
fontFamily: {
  serif: ["'Instrument Serif'", "Georgia", "serif"],   // narrative statements only
  sans: ["'Outfit'", "system-ui", "sans-serif"],         // headings, UI
  body: ["'DM Sans'", "system-ui", "sans-serif"],        // body copy
  mono: ["'IBM Plex Mono'", "monospace"],                 // labels, citations, source chips
},
```

Load the four fonts via `next/font/google` in `src/app/layout.tsx` (Instrument Serif, Outfit, DM Sans, IBM Plex Mono are all on Google Fonts). Do not use `<link>` tags. Apply as CSS variables and reference in Tailwind config via `fontFamily`.

Spacing and type scale:
- Base unit: 8px. All spacing in multiples of 8.
- Screen padding: `px-6` mobile, `px-12` desktop, always `py-20` minimum top/bottom per screen section.
- Master narrative statement: `text-4xl md:text-6xl`, serif, `leading-tight`.
- Pillar statement: `text-3xl md:text-4xl`, sans, semibold.
- Body copy: `text-base md:text-lg`, body font, `leading-relaxed`, max width `65ch`.
- Source chips and labels: `text-xs`, mono, uppercase, tracking-wide.

No shadows except a single subtle `shadow-sm` on cards. No gradients. No rounded-full buttons — use `rounded-md` (6px) throughout, nothing softer.

---

## 2. File structure

```
src/
  content/
    content.ts              (already exists — do not modify)
  components/
    ComplianceFooter.tsx
    SourceChip.tsx
    SourceDrawer.tsx
    ScreenShell.tsx          (shared full-viewport section wrapper)
    screens/
      MasterNarrative.tsx
      Argument.tsx
      Pillars.tsx
      Collisions.tsx
      Cascade.tsx
      Close.tsx
  app/
    layout.tsx               (fonts, metadata, ComplianceFooter mount)
    page.tsx                 (renders all screens in sequence)
    globals.css
```

---

## 3. Component specs

### `ScreenShell.tsx`
Shared wrapper. Full viewport height minimum (`min-h-screen`), flex column, centered content, `scroll-snap-align: start`. Accepts `children` and optional `bg` prop (`canvas` default, `paper` for card-heavy screens). This is what makes scroll feel like distinct iPhone-style screens rather than a continuous blog page.

Add `scroll-snap-type: y proximity` (not `mandatory` — mandatory feels janky on trackpads) to the parent scroll container in `page.tsx`.

### `MasterNarrative.tsx`
Renders `masterNarrative` from content.ts. Full bleed, vertically centered, canvas background. Eyebrow in mono/uppercase/accent color above the statement. Statement in serif, large. Subhead below in body font, slate color, smaller. A single down-chevron or the `scrollCue` text at the bottom, subtle, animated on a slow loop (opacity pulse, not bounce — bounce reads as unserious here).

### `Argument.tsx`
Renders `argument`. Paper background for contrast against the narrative screen before it. Heading in sans, semibold, large. Three paragraphs in body font, generous line height, max-width constrained for readability (`max-w-2xl`). Source chips for `s5` and `s6` inline or as a small cluster below the text, not interrupting paragraph flow.

### `Pillars.tsx`
Renders `pillars` array (4 items). Mobile: one pillar per full-height screen, swipeable/scrollable in sequence, with a small `01 / 04` style index indicator (mono font) so the user always knows where they are — this is the single most important affordance for the iPhone feel. Desktop: 2x2 grid, all four visible at once, each as a card.

Each pillar card: shorthand as a small mono tag (accent background tint), statement in sans-serif large, body text below, proof point set apart visually (slightly indented or bordered-left), source chips at the bottom tied to `sourceIds`.

### `Collisions.tsx`
Renders `collisionsIntro` then `collisions` array (3 items). This is the highest-stakes screen — give it the most visual distinction. Consider a subtly different background tint (not a different hue, just slightly darker canvas) to signal "this section argues something."

Each collision: title as the headline, tension as a lead-in sentence, evidence as a short bulleted list (mono font, small, feels like exhibit material), cost as a single emphasized line (consider a left border in accent color, like a pull-quote), resolution clearly labeled and visually separated from the problem (different background tint within the card, e.g. `accentMuted`).

Mobile: one collision per screen with index indicator, same pattern as pillars. Desktop: stacked full-width cards, not side by side — these need reading room.

### `Cascade.tsx`
Renders `audiences` and `cascade` arrays. This is the interactive centerpiece and the one place complexity is allowed, but the *interaction* must still feel like one decision at a time, never a dense table.

Build as: a pillar selector (4 tabs/pills across the top, using `pillar.shorthand`) and an audience selector (5 tabs/pills below it, using `audience.label`). Selecting one of each reveals exactly one cascade cell below, replacing the previous one with a simple fade/slide transition. Default state on load: `rails` × `allocator`.

The revealed cell shows: audience `who` and `cares` as small context line at top, then `message` as the lead statement (sans, semibold, medium-large), `proof` below it with source chip, `channel` as a small label, and `doNotSay` set apart in a distinct treatment (e.g. `accentMuted` background box, mono label "DO NOT SAY" preceding it) — this field is the one that should visually stand out, it is the most distinctive content in the whole artifact.

Never render a full grid/table on any viewport. The one-cell-at-a-time constraint is a product decision, not a mobile-only fallback — keep it on desktop too, just with more breathing room.

If `discipline` × `treasurer` is selected, render its "not applicable, suppress" content plainly — do not hide or skip this combination, it needs to be reachable and visible as-is, since it's a deliberate part of the argument.

### `Close.tsx`
Renders `close`. Simple, quiet, centered. Heading, two paragraphs, then the CTA (`close.cta.label` and `.detail`) presented as plain text or a `mailto:` link — not styled as a button. This is a closing statement, not a form.

### `SourceChip.tsx`
Small inline element: a numeric mono badge (e.g. `[3]`) matched to a `sourceId`. On click/tap, opens `SourceDrawer` with that source's full citation. Accepts `sourceIds: string[]` and renders one chip per id, inline, small gap.

### `SourceDrawer.tsx`
A bottom sheet on mobile (slides up, `fixed bottom-0`, rounded top corners only) and a right-side drawer on desktop. Shows the source's `claim`, `publisher`, `date`, and `url` as a link (`target="_blank" rel="noopener"`). Dismissible via a close tap or tapping outside. Keep this simple — no animation library needed, a CSS transition on transform/opacity is sufficient.

### `ComplianceFooter.tsx`
Persistent, mounted once in `layout.tsx`, fixed to the bottom of the viewport, thin bar, small text (`text-xs`, mono, slate color), renders `compliance.short`. Tapping/clicking it expands to show `compliance.long` (accordion, not a modal — keep it lightweight and always accessible, never blocking content). Must remain visible and legible over every screen background defined above; use a subtle backdrop blur or solid canvas background on the bar itself so text underneath doesn't bleed through.

---

## 4. Phase gates

Work in this order. Do not skip ahead. Run `npm run build` and confirm it passes before each commit.

### Phase A — Tokens and shell (target: 20 min)
- Add design tokens to `tailwind.config.ts`
- Load fonts in `layout.tsx`
- Build `ScreenShell.tsx`, `ComplianceFooter.tsx`
- Build `SourceChip.tsx` and `SourceDrawer.tsx` with placeholder/dummy content to verify the interaction works
- `page.tsx` renders one empty `ScreenShell` to confirm scroll-snap and fonts are working
- **Gate:** `npm run build` passes. Visually confirm fonts loaded (not falling back to system font) and compliance footer is visible and expandable.
- Commit: `phase A: tokens, shell, compliance footer, source drawer`

### Phase B — Narrative and pillars (target: 25 min)
- Build `MasterNarrative.tsx`, `Argument.tsx`, `Pillars.tsx`
- Wire into `page.tsx` in order: MasterNarrative, Argument, Pillars
- **Gate:** `npm run build` passes. Scroll through on a 390px-width browser window and confirm each screen is legible, the pillar index indicator works, and source chips open the drawer with correct content.
- Commit: `phase B: master narrative, argument, pillars`

### Phase C — Collisions and cascade (target: 25 min)
- Build `Collisions.tsx`
- Build `Cascade.tsx` — this is the most complex component, budget the most time here
- Wire into `page.tsx`
- **Gate:** `npm run build` passes. Test all 20 pillar/audience combinations in the cascade selector, including confirming `discipline` × `treasurer` renders its suppress-state content correctly. Confirm collisions read clearly with resolution visually distinct from problem.
- Commit: `phase C: collisions, cascade`

### Phase D — Close and polish pass (target: 15 min)
- Build `Close.tsx`, wire into `page.tsx` as final screen
- Full scroll-through test at 390px and 1440px
- Confirm every source chip across every screen opens the drawer with correct, matching content
- Confirm compliance footer never obscures content and remains tappable on every screen
- Check for any remaining placeholder text, console errors, or broken imports
- **Gate:** `npm run build` passes clean, zero console errors on load
- Commit: `phase D: close screen, full polish pass`

---

## 5. After Phase D

Do not add a fifth "Brief Engine" screen or any LLM API call unless explicitly instructed in a follow-up. That is out of scope for this build and lives in a separate phase if pursued at all.

Push to `main` after Phase D's commit. Vercel will auto-deploy. Report the final commit hash when done.
