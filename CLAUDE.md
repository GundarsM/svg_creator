# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Four self-contained browser tools for [HillSpring Crafts](https://hillspringcrafts.com), deployed via **Squarespace Page Header Code Injection**. Each file is a complete HTML document (with embedded CSS and JS) that Squarespace injects into a page. No build step, no package manager, no server.

- **editor.js** — Canvas-based product design tool (the primary tool; ~3800 lines)
- **builder.js** — Guided coin-holder builder: an **engine copied from editor.js (now with intentional builder-only modifications — see maintenance note)** plus an additive scripted "Coach" overlay (`#coach-bubble`) that walks a customer through 7 steps (occasion → holder → material → coins → arrange → personalize → review) while the full editor stays editable. No AI/backend. Auto-saves to `localStorage`.
- **converter.html** — Image to vector SVG converter
- **bg-remover.html** — AI background remover with brush touch-up
- **apps-script/quote-backup/Code.gs** — Google Apps Script web app that receives quote requests when FormSubmit fails. Not injected anywhere; it is pasted into the shop's Google account by hand (see `docs/quote-backup-setup.md`). Keep the repo copy in sync with what is deployed.

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
- **Quote submissions** (editor.js and builder.js) go to FormSubmit.co (`hillspringcrafts@gmail.com`) via `fetch()` first. If that fails for any reason (network/CORS error, HTTP error, 15 s timeout) the same request is resent to the Google Apps Script backup, which e-mails it from the shop Gmail with `[backup]` in the subject. The delivery code is the `QUOTE DELIVERY` block directly above `setupQuoteFormHandler()` and must stay byte-identical in both files; the backup URL goes in `QUOTE_DELIVERY.backupUrl` (placeholder `PASTE_APPS_SCRIPT_URL_HERE` = backup disabled). The backup call must remain a CORS "simple request" (`text/plain` body, no custom headers) because Apps Script answers with a redirect and cannot handle a preflight
- **Supersampled canvas rendering** (editor.js and builder.js): `applySupersampling()` sets `fabric.devicePixelRatio` to up to 2× the device ratio (capped at 3 and by backing-store area) right before the canvas is created and before every resize, so the browser downsamples the canvas and shape edges stay smooth even on GPUs that rasterise canvas paths with little or no anti-aliasing. Fabric treats it exactly like a HiDPI screen; the SVG export, the preview JPG and the Coach's silhouette masks pass `enableRetinaScaling: false` and are unaffected. Keep the block identical in both files
- **Web font loading** (editor.js and builder.js): the Google Fonts stylesheet only declares the families; a font file is downloaded the first time something draws with it, and Fabric caches character widths per family at the moment it measures. Text measured before its file arrives is drawn in a fallback font and keeps a wrong bounding box (reproduced 2026-11-17: no family, not even Roboto, is loaded at page start). The `WEB FONT LOADING` block directly above `initCanvas()` fixes this in one place: it wraps `fabric.Text.prototype.initDimensions` so every measurement requests the font file covering that text (`document.fonts.load(spec, text)` — accented letters live in a separate per-script file), and when a file lands it clears that family's width cache, re-measures every text object using it (also inside groups) and redraws; it also preloads the whole font-picker list plus the `FONT_URLS_BOLD` families in the background. Do not add per-call-site font waits or cache clears — anything that sets `fontFamily` / `text` on a Fabric text object is already covered. Adding a font means adding it to the Google Fonts `<link>`, the `#fontFamily` picker and `FONT_URLS`. Keep the block identical in both files
- **Image filters** (builder.js only — the Coach's engraved look): `fabric.filterBackend` is set to `fabric.Canvas2dFilterBackend` next to the `Coach.ENGRAVE_*` constants. Fabric's default WebGL filter backend works on one fixed 2048 × 2048 px tile and silently drops the rest, so an uploaded image with a side over 2048 px kept only its top-left corner when previewed, and the clipped bitmap also went into the export (reproduced 2026-11-17). The 2D backend gives pixel-identical colours with no size limit; it is slower on very large images (about 0.4 s for 2600 × 3400 px). Do not switch back to WebGL or raise `fabric.textureSize` instead. It must stay a global setting because Fabric re-applies filters by itself on project resume and undo / redo
- **Rectangle corners** (editor.js and builder.js): Fabric keeps a rectangle's `rx` / `ry` in the rectangle's own unscaled coordinates and every resize (handles, Width / Height fields, the Coach's holder size) only changes `scaleX` / `scaleY`, so corners used to stretch into ellipses (reproduced 2026-11-19: the Coach's default 200 × 100 mm holder had 6 × 5 mm corners instead of 3 mm). The `RECTANGLE CORNERS` block directly above `WEB FONT LOADING` wraps `fabric.Rect.prototype._render` and `_toSVG` so corners are always drawn and exported circular; stored `rx` / `ry` are never rewritten. For rectangles the tool makes (`shapeType` `rectangle`, `rectangle-outline`, `holderOutline`) and any rectangle whose Corner R was typed (`fixedCorner`), `rx` is the drawn radius in canvas px, whatever the scale of the rectangle or of a group / multi-selection around it. Other rectangles (imported artwork) keep a radius that grows with the artwork. `toObject` is wrapped so `fixedCorner` travels with every clone and save, also where the property list omits `shapeType`. Never compute `rect.rx * rect.scaleX`: use `rectCornerRadius(rect)` for the drawn radius and `rectSetRadius(rect)` for the value shown in Corner R. Do not replace this with rewriting width / height / scale after a resize. In the export, `bakeRectScaleForExport()` folds the scale into width / height so the file carries a plain `<rect>` with one radius and no stretched matrix. Keep the block identical in both files
- **SVG export** (editor.js and builder.js) uses opentype.js to convert text to vector paths so exported SVGs are font-independent. `convertTextToPathObjects()` also walks into groups (on a clone), so coin labels and user-grouped text come out as paths too; bold text uses the `FONT_URLS_BOLD` cut when one is listed for its family. `textToPathObject()` lays the outlines out with Fabric's own text-box rules (line box = fontSize × lineHeight × 1.13, baseline 22.2 % up the line box, line width without the trailing charSpacing) so they land exactly where the canvas paints the text — do not anchor them by the glyph bounding box. Both the download and the quote attachment go through `buildExportCanvas()`, which also makes the file CorelDRAW-safe (checked 2026-11-12): CorelDRAW imports Fabric's default `<g transform><image x="-w/2" …>` as a dot in the wrong place and `<pattern>` fills as white, so every image is baked to an axis-aligned bitmap (filters, crop, clip path, rotation, opacity applied; native resolution, longest side ≤ 4096 px) and written as a plain `<image x y width height>` (or, inside a group, an `<image>` carrying its own `transform`), and every pattern fill becomes the material's flat colour (`EXPORT_MATERIAL_COLORS`, keyed by `materialType`). PNG transparency is fine in CorelDRAW; do not flatten onto white. Keep the `loadFont` … `buildExportCanvas` block identical in both files

## Docs

Implementation plans and design specs live in `docs/superpowers/`:
- `docs/superpowers/plans/` — step-by-step implementation plans (created by superpowers:writing-plans)
- `docs/superpowers/specs/` — design specifications (created by superpowers:brainstorming)

Operational guides:
- `docs/quote-backup-setup.md` — how to deploy the Apps Script quote backup and wire its URL into both tools
