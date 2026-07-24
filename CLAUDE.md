# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Four self-contained browser tools for [HillSpring Crafts](https://hillspringcrafts.com), deployed via **Squarespace Page Header Code Injection**. Each file is a complete HTML document (with embedded CSS and JS) that Squarespace injects into a page. No build step, no package manager, no server.

- **editor.js** — Canvas-based product design tool (the primary tool; ~3800 lines)
- **builder.js** — Guided coin-holder builder: an **engine copied from editor.js (now with intentional builder-only modifications — see maintenance note)** plus an additive scripted "Coach" overlay (`#coach-bubble`) that walks a customer through 7 steps (occasion → holder → material → coins → arrange → personalize → review) while the full editor stays editable. No AI/backend. Auto-saves to `localStorage`.
- **converter.html** — Image to vector SVG converter
- **bg-remover.html** — AI background remover with brush touch-up

> **builder.js maintenance:** the region below the `<!-- ===== ENGINE (verbatim copy of editor.js) ===== -->` marker started as a copy of `editor.js` but has intentionally diverged (Coach-bubble markup replaces the engine sidebar, quote footer removed, instructions rewritten, Coach-aware guards, builder-only fixes). Do NOT re-paste editor.js over it — that breaks the builder. Engine changes must be applied surgically to BOTH files at the matching locations; full reconciliation is a separate future project. The appended `COACH` region (Coach `<style>` rules, the `#coach-bubble` markup, and the `Coach` `<script>`) remains hand-maintained. The Coach drives existing engine globals and reads the global Fabric `canvas`; it never modifies engine internals.

## Deployment

Paste the full file contents into **Page Settings → Advanced → Page Header Code Injection** in Squarespace. The files are self-contained — all dependencies load from CDN at runtime.

## Tech Stack

All three files share the same foundation:

| Library | Version | Purpose |
|---|---|---|
| Bootstrap | 5.3.0 | UI layout and components |
| Font Awesome | 6.4.0 | Icons |

Additional per file:
- **editor.js**: Fabric.js 5.3.0 (canvas), opentype.js 1.3.4 (text→vector paths on export), Google Fonts (Anton, Cormorant Garamond, EB Garamond, Inconsolata, Josefin Sans, Lora, Nunito, Open Sans, Patrick Hand, PT Sans, Roboto), d3-geo 3.1.1 + d3-array 3.2.4 + topojson-client 3.1.0 (runtime country contours from the world-atlas dataset, fetched lazily from jsDelivr)
- **builder.js**: same as editor.js (it embeds the editor engine — see maintenance note); the Coach overlay additionally loads clipper-lib 6.4.2 (global `ClipperLib`, from jsDelivr) for the vector inward-offset used by the step-7 holder outline — with a raster distance-field fallback if it fails to load.
- **converter.html**: ImageTracer.js 1.2.6 (raster→vector tracing)
- **bg-remover.html**: OpenCV.js 4.8.0 (background detection)

## CSS Architecture

**Critical pattern — Bootstrap isolation**: All three files load Bootstrap inside a `@layer` to prevent it from overriding Squarespace's host page styles:

```html
<link rel="stylesheet" href="...bootstrap..." data-precedence="bootstrap">
```

Each file scopes its CSS under a wrapper ID (`#design-tool-wrapper`, `#converter-wrapper`, `#bg-remover-wrapper`) to avoid leaking styles into the Squarespace host page. `builder.js` reuses `#design-tool-wrapper` (from the engine copy) and adds its Coach styles scoped under `#coach-bubble` and the other `#coach-*` containers (with one intentionally top-level `.coach-highlight` rule that glows engine toolbar elements during a step).

**Theme**: All three share `--lunar-green: #344734` as the primary dark background color. Fonts use `'IvyMode', 'Times New Roman', serif` for headings and `'Athelas', Georgia, serif` for body text (converter and bg-remover) or serif variants within the tool wrappers.

**Tips & Shortcuts panels**: Each file has a `.tips-panel` CSS class (or `.tool-panel` in editor.js) with identical styling: `background: #dbdbdb`, `border-radius: 10px`, `color: #333`. The panel in bg-remover is *inside* `#bg-remover-wrapper`; the panels in converter and editor are *outside* their wrappers. This matters for CSS cascade — `color: white` from the wrapper affects elements inside it.

## Key Implementation Notes

- **No automated tests** — verify changes by opening the HTML file directly in a browser
- **editor.js is named `.js`** but is actually a complete HTML document — this is intentional for the Squarespace injection workflow
- **kbd elements** require `display: inline-block` in bg-remover and converter because Squarespace hides `kbd` by default. They also need explicit `background` and `color` overrides since Bootstrap's kbd styling (`#212529` bg, white text) may not apply correctly inside Squarespace
- **Quote submissions** in editor.js go to FormSubmit.co (`hillspringcrafts@gmail.com`) via `fetch()` — no backend needed
- **SVG export** in editor.js uses opentype.js to convert text to vector paths so exported SVGs are font-independent

## Docs

Implementation plans and design specs live in `docs/superpowers/`:
- `docs/superpowers/plans/` — step-by-step implementation plans (created by superpowers:writing-plans)
- `docs/superpowers/specs/` — design specifications (created by superpowers:brainstorming)
