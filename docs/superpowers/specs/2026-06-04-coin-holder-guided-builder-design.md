# Coin Holder Guided Builder — Design

**Date:** 2026-06-04
**Status:** Approved (brainstorming)

## Overview

A new self-contained browser tool — `builder.js` — that leads a customer through designing a custom coin holder, guided step-by-step by a scripted (non-AI) "assistant." It is deployed via Squarespace Page Header Code Injection on its own page, exactly like the existing `editor.js`, `converter.html`, and `bg-remover.html`. The existing `editor.js` remains untouched as the advanced/free tool.

The defining principle: **the assistant guides, but never restricts.** At every step the full editor canvas and properties panel stay live and editable; the customer can ignore the assistant, jump between steps, and directly edit any part of the coin holder at any time.

## Goals

- Walk a first-time customer from a blank page to a complete, quote-ready coin holder design through a friendly, paced flow.
- Preserve the full power of the existing editor — nothing is taken away.
- Stay a single self-contained file with no build step, no package manager, and no backend (CDN dependencies only), matching the established deployment model.
- Auto-save progress so an accidental refresh or a return visit does not lose work.

## Non-Goals

- No AI / LLM / conversational assistant (no API key, no backend).
- No mobile-first redesign — desktop-first, mobile merely usable.
- No changes to `editor.js` behavior or to the other tools.
- No server-side persistence or user accounts.

## Decisions (from brainstorming)

| Topic | Decision |
|---|---|
| Assistant type | Scripted guide, no AI, browser-only |
| Placement | New self-contained `builder.js` on its own Squarespace page; `editor.js` untouched |
| Architecture | Approach A — verbatim copy of the editor engine + an additive "Coach" overlay |
| Flow | 7 steps: Occasion → Holder → Material → Coins → Arrange → Personalize → Review |
| Holder base shape | Rectangle · Circular · Country outline · Uploaded SVG |
| Coach UI style | Floating, collapsible, draggable bubble |
| Coach behavior | Both — primary action button in the bubble **and** highlight the matching toolbar control |
| Devices | Desktop-first; mobile usable (coach becomes a bottom sheet) |
| Persistence | Auto-save to `localStorage` + a "Start over" button |

## Architecture

### File structure (`builder.js`)

`builder.js` is an HTML document named `.js` (same Squarespace-injection convention as `editor.js`). It has two clearly delimited regions:

1. `/* ===== ENGINE (verbatim copy of editor.js) ===== */`
   The entire current `editor.js`, byte-for-byte unchanged. Its functions are global (they are already invoked from inline `onclick` handlers) and the Fabric.js `canvas` instance is global. This region is **never hand-edited**; when `editor.js` improves, it is re-pasted here.

2. `/* ===== COACH (new) ===== */`
   Appended after the engine. Contains its own `<div id="coach-root">` markup, CSS scoped under `#coach-root`, and a single `Coach` JavaScript object. It is the only hand-maintained region.

### Integration seam (the only coupling points)

The Coach interacts with the engine through three narrow, well-defined channels and nothing else:

- **Drive** — the Coach calls existing engine globals to mutate the design:
  `addCurrency`, `addSingleCoin`, `addCountry`, `addCountryOutline`, `addTemplate`, `addShape`, `addText`, `applyCustomSize`, `setUnit`, `applyFill`, `cascadeColorToContained`, `exportSVG`, `showQuoteForm`, `saveState`.
- **Observe** — the Coach reads the global `canvas` (`canvas.getObjects()`, active selection) and subscribes to the Fabric events the engine already wires (`object:added`, `object:modified`, `selection:created/updated/cleared`) to know what the customer has done and adapt its copy and completion checks.
- **Highlight** — the Coach toggles a `.coach-highlight` class (animated outline/glow, defined under `#coach-root` scope) on existing toolbar elements, addressed by their existing element IDs.

Because the engine region is byte-identical to `editor.js`, the Coach is a clean additive layer and the engine can be re-synced by re-pasting.

## The Coach engine

A single `Coach` object (plain JS, no framework).

### Step definitions

`Coach.steps` is an ordered array. Each step is a config object:

- `id` — one of `occasion | holder | material | coins | arrange | personalize | review`
- `title`, `intro` — assistant copy
- `renderAction()` — builds the in-bubble controls for that step (the "does-it-for-you" half)
- `highlight` — array of existing toolbar element IDs to spotlight (the "points-to-it" half)
- `isComplete()` — reads `canvas` state to show a ✓ and adapt copy; **never hard-blocks navigation**
- `optional` — `true` for skippable steps (occasion, personalize)

### Navigation model

Linear suggested path with **Back / Skip / Next**, plus a clickable **step-dots** row allowing the customer to jump to any step at will (honoring "edit any part at any point"). Steps never lock. `isComplete()` only adds a checkmark and adjusts encouragement copy (e.g. "You've added 4 coins — add more or move on").

### Bubble UI (`#coach-root`)

- **Header:** `Step N / 7 · <title>`, a collapse (–) button, and a drag handle (desktop only).
- **Body:** intro line, `renderAction()` controls, and a subtle "or use the toolbar →" hint.
- **Footer:** Back · Skip · Next, plus the step-dots.
- **Collapsed state:** shrinks to a small floating launcher ("Need a hand?") that re-expands on click.

### Coach state

`Coach.state` holds the customer's structured choices (occasion, project name, holderType, size + unit, material, coin tallies per currency/denomination, personalization notes). It is used to adapt copy, to build the Review summary, to pre-fill the quote form, and is part of what gets auto-saved.

## The seven steps

| # | Step | Bubble action (does-it-for-you) | Highlights | Engine calls |
|---|------|---------------------------------|-----------|--------------|
| 1 | **Welcome & occasion** *(optional)* | Occasion buttons (Gift / Travel / Collection / Milestone) + project-name field. Stores to `Coach.state`; pre-fills the later quote form. No canvas change. | — | none |
| 2 | **Choose the holder** | Base-shape picker: **Rectangle · Circular · Country outline · Upload SVG**, plus size + unit inputs. Optional "start from a ready layout" shortcut. | size/settings dropdown, shapes, countries, import buttons | `applyCustomSize`, `setUnit`, `addShape('rectangle'/'circle')`, `addCountry`/`addCountryOutline`, trigger `#fileImport`; shortcut → `addTemplate` |
| 3 | **Pick material** | Wood finishes + plastic colours; applies to the holder board and cascades to contained objects. | `#materialPresetGroup` / `#materialPreset` | `applyFill`, `cascadeColorToContained` |
| 4 | **Add coins** | Currency tabs (€/$/£) → denomination chips with +/- quantity steppers; drops coins at correct real-world diameters. ✓ when ≥1 coin. | coins / currency section | `addCurrency`, `addSingleCoin` |
| 5 | **Arrange** | "Tidy into…" **Grid · Circle · Rows**, or "leave as-is / drag freely." | canvas | **new** `Coach.arrange(pattern)` helper, then `saveState()` |
| 6 | **Personalize** *(optional)* | Add engraving text, a decorative country outline, shapes, or upload a logo/image. | text, countries, shapes, upload | `addText`, `addCountry`, `addShape`, `#imageUpload` |
| 7 | **Review & request** | Plain-language summary from `Coach.state` + live canvas (shape, size, material, coin tallies, extras). Buttons: **Download SVG** and **Request a Quote** (pre-filled from `Coach.state`). | `#downloadBtn`, footer quote button | `exportSVG`, `showQuoteForm` |

### `Coach.arrange(pattern)` — the one net-new engine helper

Arranges coins **inside the bounds of the holder shape they belong to** — not on an abstract grid:

1. Group coins by their containing holder using the same "contained-in" relationship the engine already computes in `cascadeColorToContained`.
2. For each holder, pack that holder's coins in the chosen pattern (grid / circle / rows) **within the holder's geometry**, spacing by real diameters so none spill past the edges, and centering the arrangement.
3. Rectangular and circular holders get exact containment. For country outlines and uploaded SVGs the baseline is the shape's bounding box; point-in-path refinement (so coins avoid empty corners) is a stretch goal.
4. Call `saveState()` so the arrangement is undoable.

## Persistence

- On every canvas change and step change, **debounce-save** to `localStorage` under a versioned key `hsc-builder-v1`:
  `{ canvasJSON: canvas.toJSON(extraProps), step, state }`.
- `extraProps` must include every custom Fabric property the engine sets on coins/holders (e.g. coin value, diameter, material type) so a reload is faithful. The exact list is enumerated during implementation by inspecting the engine's object-creation code.
- **On load:** if a saved design exists, the coach offers "Welcome back — resume where you left off?" (Resume / Start fresh). Resume → `canvas.loadFromJSON` + `Coach.go(step)`.
- **Start over** button clears the key and resets canvas + coach to step 1 (with a confirm).

## Responsive behavior

- **Desktop:** draggable floating bubble, default bottom-right.
- **≤768px:** bubble docks as a full-width **bottom sheet** with the same Back/Skip/Next; drag disabled; `highlight` scrolls the target control into view before glowing.

## Error handling & edge cases

- All Coach→engine calls are guarded. If an engine global is missing (engine failed to init), the Coach degrades to text-only guidance and logs to console — it never throws into the UI.
- `arrange` with zero coins, or coins not inside any holder → friendly "add a holder/coins first" nudge instead of running.
- `localStorage` unavailable or full (private mode) → silently fall back to session-only and show a one-time "progress won't be saved on this device" note.
- Invalid SVG upload → reuse the engine's existing import handling and messaging.

## Testing & verification

No automated tests (per project convention — verify by opening the file in a browser). The implementation plan will include a manual verification checklist:

- Walk all 7 steps end-to-end for each base-shape type (rectangle, circle, country, uploaded SVG).
- Verify `arrange` keeps coins within the holder for rect / circle / country / SVG.
- Refresh mid-build → resume restores design + step.
- Start over clears everything.
- Mobile (≤768px) → coach renders as a bottom sheet and remains usable.
- SVG export downloads a correct file (text → paths).
- Quote form opens pre-filled with occasion / project name.
- Free editing still works at every step (toolbar, properties panel, undo/redo).

## Deployment

Paste the full contents of `builder.js` into **Page Settings → Advanced → Page Header Code Injection** on a new Squarespace page. Self-contained; all dependencies load from CDN at runtime, identical to the existing tools.

## Open questions / stretch goals

- Point-in-path coin containment for irregular holders (country/SVG) in `arrange` — baseline is bounding box.
- Whether to surface the existing `addTemplate` ready-made layouts as a step-2 quick-start (included as optional).
