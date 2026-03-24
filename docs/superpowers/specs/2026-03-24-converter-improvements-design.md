# Converter Improvements — Design Spec
**Date:** 2026-03-24
**File:** `converter.html` (in-place modifications only)

---

## Overview

Three improvements to `converter.html`:

1. **Logo/Line Art quality** — replace `potrace-wasm@1.0.4` (no options API) with `wasm-potrace@0.4.1` (exposes `turdsize`, `alphamax`, `opticurve`) and add a pre-binarization step to make the threshold slider functional.
2. **Mode-switch overlay bug** — color-mode tracing is synchronous; the loading overlay never paints before it is hidden. Fix by yielding to the browser via `requestAnimationFrame` before the synchronous call.
3. **Download spinner** — EPS and DXF conversion is synchronous and can take several seconds on complex images, leaving the page appearing frozen. Add per-button spinner feedback identical in style to the Convert button.

---

## 1. Logo/Line Art Quality

### Library swap

Remove the `<script>` tag for `potrace-wasm@1.0.4` and replace with a dynamic ESM import of `wasm-potrace@0.4.1`:

```
https://cdn.jsdelivr.net/npm/wasm-potrace@0.4.1/dist/index.mjs
```

`wasm-potrace@0.4.1` is an Emscripten WASM build (self-contained, WASM embedded as base64, ~80 KB). It exposes:

```js
import { potrace, init } from '...';
await init();                          // async, call once on page load

const svg = await potrace(
  { data: Uint8ClampedArray, width: number, height: number },
  { turdsize, alphamax, opticurve, opttolerance }
);
```

`data` is a flat RGBA `Uint8ClampedArray` (4 bytes per pixel). `width` and `height` are pixel dimensions. Options:

| Option | Type | Default | Maps to UI control |
|--------|------|---------|-------------------|
| `turdsize` | number | 2 | Noise removal slider |
| `alphamax` | number | 1 | Corner sharpness slider |
| `opticurve` | 0 \| 1 | 1 | Curve optimisation toggle |
| `opttolerance` | number | 0.2 | (not exposed in UI — keep at default) |

### Threshold pre-processing

`wasm-potrace` (like all WASM potrace builds) performs its own internal binarisation and does not accept a `threshold` parameter. To make the threshold slider functional, apply a binary threshold pass to the canvas `ImageData` before handing pixels to potrace:

```
for each pixel i:
  gray = 0.299 × R + 0.587 × G + 0.114 × B
  if alpha < 128: pixel → white (255, 255, 255, 255)
  else if gray < threshold: pixel → black (0, 0, 0, 255)
  else: pixel → white (255, 255, 255, 255)
```

The result is a binarised `Uint8ClampedArray` that potrace receives. Because the image is already fully binarised, potrace's internal threshold step is a no-op and the slider's effect is exact.

### Changes to `traceWithPotrace`

- Remove `makeGrayscaleCanvas()` call (no longer needed; binarisation replaces it).
- Read `threshold`, `turdsize`, `alphamax`, `opticurve` from UI controls.
- Run the binary threshold loop on `processingCtx.getImageData(...)`.
- Call `potrace({ data: binaryData, width: canvasWidth, height: canvasHeight }, options)`.
- Return the SVG string.

### Changes to `initPotrace`

- Dynamically import `wasm-potrace` via `import()` from the pinned jsDelivr URL.
- Call `await init()` from the imported module.
- Store the `potrace` function in a module-level variable for use by `traceWithPotrace`.
- Set `potraceReady = true` on success.
- On failure: set `potraceReady = false`, call `document.getElementById('lineart-engine-error').classList.remove('d-none')` (existing error element), then `updateConvertButtonState()` to permanently disable the Convert button.

### Removal

- Remove the `<script src="potrace-wasm@1.0.4">` tag.
- Remove `makeGrayscaleCanvas()` function — only called from `traceWithPotrace`, which is being rewritten.
- Remove `rgbaToGray()` function — currently dead code (marked "reserved for future use"), remains dead after this change.

---

## 2. Mode-Switch Overlay Bug

### Root cause

`traceWithImageTracer()` is synchronous. The sequence in the click handler is:

1. `setConvertLoading(true)` — adds `.active` to overlay
2. `traceWithImageTracer()` — runs synchronously, blocking the main thread
3. `setConvertLoading(false)` — removes `.active`

Steps 1–3 execute in a single JS task with no opportunity for a repaint, so the overlay is never visually painted.

### Fix

After `setConvertLoading(true)`, yield to the browser using `requestAnimationFrame` before calling the synchronous tracer:

```js
setConvertLoading(true);
if (currentMode === 'color') {
  await new Promise(r => requestAnimationFrame(r));
  svgStr = traceWithImageTracer();
} else {
  svgStr = await traceWithPotrace(); // already async, no yield needed
}
```

`requestAnimationFrame` fires just before the next paint, guaranteeing the overlay is rendered before the blocking work begins.

---

## 3. Download Spinner

### Behaviour

- SVG download: instant (no conversion), no spinner needed.
- EPS download: show spinner on the EPS button → yield via `requestAnimationFrame` → run `svgToEps()` → hide spinner → open download window.
- DXF download: same pattern for the DXF button.

### Button states

| State | Appearance |
|-------|-----------|
| Normal | Icon + label text, enabled |
| Loading | Spinner replaces icon, label text unchanged, button disabled |
| Done | Returns to normal; download window opens |

### HTML changes

Each download button gains a spinner span and an icon span wrapping the Font Awesome icon. The existing `class`, `flex-fill`, and other attributes must be preserved — only the inner content changes:

```html
<button class="btn btn-outline-light flex-fill" id="btn-dl-eps" disabled>
  <span id="btn-dl-eps-spinner" class="spinner-border spinner-border-sm d-none" role="status"></span>
  <span id="btn-dl-eps-icon"><i class="fa fa-download me-1"></i></span>
  Download EPS
</button>

<button class="btn btn-outline-light flex-fill" id="btn-dl-dxf" disabled>
  <span id="btn-dl-dxf-spinner" class="spinner-border spinner-border-sm d-none" role="status"></span>
  <span id="btn-dl-dxf-icon"><i class="fa fa-download me-1"></i></span>
  Download DXF
</button>
```

SVG button is unchanged (no conversion work, instant download).

### JS helper

```js
async function runDownload(btnId, spinnerId, iconId, buildFn, filename, mime) {
  const btn = document.getElementById(btnId);
  const spinner = document.getElementById(spinnerId);
  const icon = document.getElementById(iconId);
  btn.disabled = true;
  spinner.classList.remove('d-none');
  icon.classList.add('d-none');
  await new Promise(r => requestAnimationFrame(r));
  try {
    const content = buildFn();
    triggerDownload(content, filename, mime);
  } finally {
    btn.disabled = false;
    spinner.classList.add('d-none');
    icon.classList.remove('d-none');
  }
}
```

The `finally` block unconditionally re-enables the button via `btn.disabled = false`. This is safe because the guard `if (!lastSvgResult) return` at the top of each listener prevents `runDownload` from being entered when there is no result — the only state in which `setDownloadButtonsEnabled(false)` would have disabled the button.

Called from `initDownloadButtons`:

```js
document.getElementById('btn-dl-eps').addEventListener('click', () => {
  if (!lastSvgResult) return;
  runDownload('btn-dl-eps', 'btn-dl-eps-spinner', 'btn-dl-eps-icon',
    () => svgToEps(lastSvgResult), lastStemName + '.eps', 'application/postscript');
});

document.getElementById('btn-dl-dxf').addEventListener('click', () => {
  if (!lastSvgResult) return;
  runDownload('btn-dl-dxf', 'btn-dl-dxf-spinner', 'btn-dl-dxf-icon',
    () => svgToDxf(lastSvgResult), lastStemName + '.dxf', 'application/dxf');
});
```

---

## Error Handling

| Condition | Behaviour |
|-----------|-----------|
| `wasm-potrace` fails to load | Logo/Line Art Convert button permanently disabled; inline error shown (same as current) |
| `wasm-potrace` still initialising | Convert button shows "Loading engine…" and is disabled (same as current) |
| EPS/DXF conversion throws | Spinner hidden, button re-enabled, `alert()` with error message |

---

## Out of Scope

- Colour-mode quality improvements (ImageTracer.js is unchanged)
- Adding new UI controls or formats
- Any change to SVG → EPS or SVG → DXF conversion logic
- Batch conversion or server-side processing
