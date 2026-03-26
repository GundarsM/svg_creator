# Background Remover — Design Spec
**Date:** 2026-03-26
**File:** `bg-remover.html` (new file, self-contained)

---

## Overview

A browser-based background removal tool for HillSpring Crafts, deployed as a Squarespace code injection. The user uploads an image, chooses a removal mode, adjusts controls, and downloads or copies a transparent PNG.

Two modes:

- **AI Removal** — ML model runs entirely in the browser via `@imgly/background-removal`. Works on any subject.
- **Color Match** — Pure canvas flood-fill based on a user-picked background color. Works well on plain/uniform backgrounds.

---

## File Structure

Single self-contained HTML file `bg-remover.html`:

- Bootstrap 5.3.0 loaded in a CSS layer: `@import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css") layer(bootstrap);` — prevents bleeding into Squarespace styles.
- Font Awesome 6.4.0 via `<link>`.
- All CSS inline in `<style>`. All JS inline in `<script>`.
- Wrapped in `#bg-remover-wrapper` — all CSS rules scoped to this ID to avoid Squarespace conflicts.
- Brand colour: `--lunar-green: #344734`.
- No build system. No module bundler.

---

## Page Zones (top to bottom)

### Zone 1 — Mode Selector

Pill-button toggle, same style as `converter.html`:

```html
<div class="mode-selector">
  <button class="mode-btn active" data-mode="ai">
    <i class="fa fa-wand-magic-sparkles me-1"></i> AI Removal
  </button>
  <button class="mode-btn" data-mode="color">
    <i class="fa fa-eye-dropper me-1"></i> Color Match
  </button>
</div>
```

Switching mode clears any current result and resets state. Mode persists in `currentMode` variable.

### Zone 2 — Upload Zone

Drag-and-drop area, identical pattern to `converter.html`:

- Accepts `.jpg`, `.jpeg`, `.png`.
- On file load: draw image to an off-screen `processingCanvas`, show thumbnail in drop zone, enable controls and Process button.
- Replacing an image clears the result area.

### Zone 3 — Controls

Two `<div>` panels, one per mode, toggled with `d-none`. Only visible after an image is loaded.

#### AI Removal controls

| Control | Type | Default | Effect |
|---------|------|---------|--------|
| Model Quality | Toggle (Fast / Quality) | Fast | Selects `'small'` (~30 MB) or `'medium'` (~80 MB) model |

No other parameters — the model handles edge detection internally.

Model is loaded lazily on first click of Process (or on first switch to AI mode if a file is already loaded). Once loaded it is retained in memory for the session.

#### Color Match controls

| Control | Type | Range | Default | Effect |
|---------|------|-------|---------|--------|
| Tolerance | Slider | 0–100 | 30 | Colour distance threshold for flood-fill. Higher = removes more pixels. |
| Feathering | Slider | 0–10 px | 2 | Gaussian blur radius applied to the alpha channel after removal. Softens hard edges. |
| Background colour swatch | Click-to-pick | — | None | User clicks on the uploaded image preview to sample the background colour. Swatch shows sampled colour. Process button disabled until a colour is picked. |

### Zone 4 — Process Button

```html
<button id="btn-process" disabled>
  <span id="btn-process-text"><i class="fa fa-scissors me-1"></i> Remove Background</span>
  <span id="btn-process-spinner" class="d-none">
    <span class="spinner-border spinner-border-sm me-1"></span> Removing…
  </span>
</button>
```

Disabled until: image loaded AND (AI mode OR color picked in Color Match mode).

### Zone 5 — Result Area

Hidden until first result. Contains:

- **Before panel** — original image, fixed height, `object-fit: contain`.
- **After panel** — result PNG on a CSS checkerboard background (transparency indicator), same fixed height.
- **Action bar** — Download PNG button + Copy to Clipboard button.

```
[ Before ]  [ After ]
[ Download PNG ]  [ Copy to Clipboard ]
```

Panels are equal width (`col-6`) on desktop, stacked on mobile.

### Zone 5b — Model Download Progress

Shown inside the result area (replaces before/after panels) only during AI model download. Hidden at all other times.

A CSS arc progress indicator (SVG circle with `stroke-dashoffset` animation) showing:
- Circular arc that fills as download progresses
- Percentage text in the centre (e.g. `47%`)
- Label below: "Downloading AI model…"

`@imgly/background-removal` emits `progress(key, current, total)` callbacks during model fetch. The percentage is computed as `Math.round((current / total) * 100)`.

---

## State Variables

```js
let currentMode      = 'ai';     // 'ai' | 'color'
let currentImageFile = null;     // File object
let pickedColor      = null;     // { r, g, b } — Color Match mode
let modelLoaded      = false;    // true once @imgly model is in memory
let lastResultBlob   = null;     // Blob (PNG) from last removal
```

---

## AI Removal — Implementation

### Library loading

`@imgly/background-removal` UMD bundle loaded via `<script src>` from jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.4.5/dist/background-removal.js"></script>
```

Loaded as a classic script (not `type="module"`) to avoid Squarespace CSP restrictions on ESM/dynamic imports.

The library exposes `window.BackgroundRemoval.removeBackground(source, config)`.

### Removal flow

```js
async function runAiRemoval() {
  const config = {
    model: currentQuality,   // 'small' | 'medium'
    progress: (key, current, total) => {
      if (key === 'fetch') updateModelProgress(current, total);
    },
    output: { format: 'image/png' },
  };
  const blob = await BackgroundRemoval.removeBackground(currentImageFile, config);
  lastResultBlob = blob;
  displayResult(blob);
}
```

`modelLoaded` is set to `true` after the first successful call. On subsequent runs the progress callback fires briefly or not at all (model is cached by the browser).

If `window.BackgroundRemoval` is undefined (CSP blocked the script), show an inline error and disable AI mode. Color Match mode remains available.

### Model quality toggle

```html
<div class="btn-group" id="quality-toggle">
  <button class="btn btn-sm btn-outline-secondary active" data-quality="small">Fast</button>
  <button class="btn btn-sm btn-outline-secondary" data-quality="medium">Quality</button>
</div>
```

Switching quality after a model has already loaded resets `modelLoaded = false` so the new model downloads on next run.

---

## Color Match — Implementation

### Color picking

The uploaded image is drawn to a visible `<canvas>` in the upload zone. A `click` listener on the canvas reads the pixel under the cursor via `getImageData` and stores `{ r, g, b }` in `pickedColor`. A small colour swatch `<div>` is updated to show the picked colour.

### Flood-fill algorithm

```
1. Get ImageData from processingCanvas (full image)
2. For every pixel:
   a. Compute colour distance to pickedColor:
      distance = sqrt((r-pr)² + (g-pg)² + (b-pb)²)
   b. If distance ≤ tolerance * 4.41 (scaled to 0–441 range):
      set alpha = 0  (transparent)
3. If feathering > 0:
   a. Extract alpha channel as grayscale mask
   b. Apply box blur of radius = feathering to the mask
   c. Write blurred mask back as alpha channel
4. Put modified ImageData to an offscreen canvas
5. Export as PNG blob via canvas.toBlob('image/png')
```

This is a global colour match (not a flood-fill from a seed point) — every pixel in the image whose colour is close to `pickedColor` becomes transparent. This is simpler, more predictable, and works well for images where the background colour doesn't appear in the foreground.

---

## Result Actions

### Download PNG

```js
function downloadPng() {
  const url = URL.createObjectURL(lastResultBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = stemName + '-no-bg.png';
  a.click();
  URL.revokeObjectURL(url);
}
```

### Copy to Clipboard

```js
async function copyToClipboard() {
  await navigator.clipboard.write([
    new ClipboardItem({ 'image/png': lastResultBlob })
  ]);
}
```

If `ClipboardItem` is unavailable, the Copy button is hidden on `DOMContentLoaded`.

---

## Error Handling

| Condition | Behaviour |
|-----------|-----------|
| `@imgly` script blocked by CSP | Inline warning shown; AI mode button disabled; Color Match still works |
| AI removal throws | Alert with error message; spinner hidden; button re-enabled |
| Color Match — no colour picked | Process button disabled; placeholder text "Click image to pick background colour" |
| Clipboard API unavailable | Copy button hidden |
| Non-image file dropped | Drop zone shows error message |

---

## CSS Isolation

All rules prefixed with `#bg-remover-wrapper`:

```css
#bg-remover-wrapper .mode-btn { … }
#bg-remover-wrapper .checkerboard { … }
```

Bootstrap utilities used directly (they are already scoped to the layer). Custom component styles all scoped.

---

## Out of Scope

- Server-side processing
- Batch removal (multiple images)
- Fine-tuning / masking by brush
- Touch / mobile-specific interactions beyond responsive layout
- Saving settings between sessions
