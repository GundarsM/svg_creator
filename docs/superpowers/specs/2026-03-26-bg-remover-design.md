# Background Remover — Design Spec
**Date:** 2026-03-26
**File:** `bg-remover.html` (new file, self-contained)

---

## Overview

A browser-based background removal tool for HillSpring Crafts, deployed as a Squarespace code injection. The user uploads an image, chooses a removal mode, adjusts controls, and downloads or copies a transparent PNG.

Two modes:

- **Smart Removal** — OpenCV.js GrabCut algorithm. The user draws a rectangle around the subject; GrabCut iteratively separates foreground from background. Works on any subject.
- **Color Match** — Pure canvas global colour threshold based on a user-picked background colour. Best for images with a plain, uniform background.

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
  <button class="mode-btn active" data-mode="smart">
    <i class="fa fa-wand-magic-sparkles me-1"></i> Smart Removal
  </button>
  <button class="mode-btn" data-mode="color">
    <i class="fa fa-eye-dropper me-1"></i> Color Match
  </button>
</div>
```

Switching mode clears any current result and resets state. Mode persists in `currentMode` variable.

### Zone 2 — Upload Zone

Drag-and-drop area, identical pattern to `converter.html`:

- Accepts `.jpg`, `.jpeg`, `.png`. Validated by `file.type` against `['image/jpeg', 'image/png']`.
- On file load: decode image into an off-screen `processingCanvas` (used as the pixel data source throughout). Also draw the image into a visible `<canvas id="preview-canvas">` displayed in the upload zone — this is the interactive canvas where the user picks colours (Color Match) or draws a rectangle (Smart Removal).
- `stemName`: derived from `currentImageFile.name` by `name.lastIndexOf('.') > 0 ? name.substring(0, name.lastIndexOf('.')) : name`. Stored in state. Example: `photo.final.jpg` → `photo.final`; `photo` → `photo`.
- Replacing an image clears the result area and resets `pickedColor`, `grabRect`, and `lastResultBlob` to null.

### Zone 3 — Controls

Two `<div>` panels, one per mode, toggled with `d-none`. Visible at all times (controls are shown as soon as an image is loaded).

#### Smart Removal controls

| Control | Type | Range | Default | Effect |
|---------|------|-------|---------|--------|
| Iterations | Slider | 1–5 | 3 | Number of GrabCut refinement passes. More = better edges, slower. |

Process button is disabled until: image loaded AND rectangle drawn AND `cvReady === true`.

#### Color Match controls

| Control | Type | Range | Default | Effect |
|---------|------|-------|---------|--------|
| Tolerance | Slider | 0–100 | 30 | Colour distance threshold. Higher = removes more pixels. |
| Feathering | Slider | 0–10 px | 2 | Box blur radius applied to the alpha channel after removal. Softens hard edges. |
| Background colour swatch | Click-to-pick | — | None | User clicks on `preview-canvas` to sample the background colour. Swatch shows the sampled `{ r, g, b }`. Process button disabled until a colour is picked. |

Process button for Color Match is enabled as soon as image is loaded AND colour is picked. It does not depend on `cvReady`.

### Zone 4 — Process Button

```html
<button id="btn-process" disabled>
  <span id="btn-process-text"><i class="fa fa-scissors me-1"></i> Remove Background</span>
  <span id="btn-process-spinner" class="d-none">
    <span class="spinner-border spinner-border-sm me-1"></span> Removing…
  </span>
</button>
```

### Zone 5 — Result Area

Hidden (`d-none`) until either (a) OpenCV loading begins (Smart mode) or (b) first result is ready (Color Match). Contains:

- **Before panel** (`col-6`) — original image displayed with `object-fit: contain`, fixed max-height 400 px.
- **After panel** (`col-6`) — result PNG displayed on a CSS checkerboard background (transparency indicator), same max-height.
- **Action bar** — Download PNG button + Copy to Clipboard button.

On mobile (< `md` breakpoint) panels stack vertically.

### Zone 5b — OpenCV Loading Indicator

A `<div id="cv-loading">` inside Zone 5, visible only while OpenCV is loading (`cvReady === false` and mode is `smart`). Contains:

- A Bootstrap `spinner-border` (indeterminate circular spinner, large variant)
- Text: "Loading Smart Removal engine…"
- Subtext: "This takes a moment on first use."

When `cvReady` becomes `true`, `cv-loading` is hidden and the before/after panels are shown (if a result exists) or the upload prompt remains.

The result area (`Zone 5`) is made visible as soon as the user switches to Smart mode (even before processing), so the loading spinner is visible.

---

## State Variables

```js
let currentMode      = 'smart'; // 'smart' | 'color'
let currentImageFile = null;    // File object from upload
let stemName         = '';      // filename without extension, used for download
let pickedColor      = null;    // { r, g, b } — Color Match mode
let grabRect         = null;    // { x, y, w, h } in image-natural pixels — Smart Removal
let cvReady          = false;   // true once cv.onRuntimeInitialized has fired
let lastResultBlob   = null;    // Blob (PNG) from last successful removal
```

---

## Smart Removal — Implementation

### Library loading

OpenCV.js is loaded as a classic script tag (no ESM, no dynamic import — safe under Squarespace CSP):

```html
<script id="opencv-script" src="https://cdn.jsdelivr.net/npm/@techstark/opencv-js@4.8.0-release.1/dist/opencv.js"></script>
```

**Version pinned intentionally at `4.8.0-release.1`.** Do not bump without re-testing the initialization path — the TechStark build applies a custom patch to the Emscripten preamble that changes how `cv` is exposed (see below).

`@techstark/opencv-js` ships a UMD bundle. In a browser without AMD/CommonJS, the UMD factory assigns `window.cv`. However, the TechStark patch overrides the standard Emscripten preamble so that `window.Module.onRuntimeInitialized` is **never read** — the patched build creates a fresh local `Module` variable unconditionally, ignoring any pre-set global.

The correct initialization pattern is to listen for the script's `load` event and then poll until `window.cv.Mat` exists (confirming WASM compilation is complete). If `window.cv` is a `Promise`, resolve it first (some builds):

```js
function onCvReady() {
  cvReady = true;
  document.getElementById('cv-loading').classList.add('d-none');
  updateProcessButtonState();
}

function waitForCv() {
  if (window.cv && typeof window.cv.Mat === 'function') {
    onCvReady();
  } else if (window.cv && typeof window.cv.then === 'function') {
    window.cv.then(instance => { window.cv = instance; onCvReady(); });
  } else {
    setTimeout(waitForCv, 100);
  }
}

document.getElementById('opencv-script').addEventListener('load', waitForCv);
document.getElementById('opencv-script').addEventListener('error', () => {
  document.getElementById('cv-error').classList.remove('d-none');
  document.querySelector('[data-mode="smart"]').disabled = true;
});
```

OpenCV is loaded unconditionally on page load (not lazily), so it is ready by the time the user uploads an image and selects Smart mode. The `cv-loading` spinner is shown immediately on page load and hidden when `cvReady` becomes true.

### Rectangle drawing on preview-canvas

Mouse event listener (active only in Smart mode) on `preview-canvas`:

- `mousedown`: record `dragStart = { x, y }` in canvas display coordinates.
- `mousemove` (while button held): redraw the image on `preview-canvas`, then overlay a dashed white rectangle from `dragStart` to current position.
- `mouseup`: convert corner coordinates from canvas display space to image-natural pixel space (multiply by `image.naturalWidth / canvas.width`). Store `grabRect = { x, y, w, h }`. Call `updateProcessButtonState()`.

Mode switch resets `grabRect = null` and clears the overlay from `preview-canvas`.

### Canvas interaction — listener lifecycle

A single `initPreviewListeners()` function attaches all mouse and click listeners to `preview-canvas` once on `DOMContentLoaded`. Each listener checks `currentMode` at call time and dispatches accordingly:

```js
previewCanvas.addEventListener('mousedown', (e) => {
  if (currentMode === 'smart') handleRectStart(e);
});
previewCanvas.addEventListener('mousemove', (e) => {
  if (currentMode === 'smart') handleRectDraw(e);
});
previewCanvas.addEventListener('mouseup', (e) => {
  if (currentMode === 'smart') handleRectEnd(e);
});
previewCanvas.addEventListener('click', (e) => {
  if (currentMode === 'color') handleColorPick(e);
});
```

No listeners are added or removed on mode switch. This avoids stale-listener bugs.

### GrabCut algorithm

OpenCV GrabCut requires a 3-channel BGR source. `cv.imread` on a canvas produces 4-channel RGBA. Conversion is required before calling `grabCut`, and the original RGBA data is kept separately for alpha masking.

```js
function runGrabCut() {
  const iterations = parseInt(document.getElementById('ctrl-iterations').value, 10);

  // Read original RGBA from canvas
  const rgba = cv.imread(processingCanvas);

  // Convert to BGR (3-channel) for GrabCut
  const bgr = new cv.Mat();
  cv.cvtColor(rgba, bgr, cv.COLOR_RGBA2BGR);

  const mask     = new cv.Mat();
  const bgdModel = new cv.Mat();
  const fgdModel = new cv.Mat();
  const rect = new cv.Rect(grabRect.x, grabRect.y, grabRect.w, grabRect.h);

  try {
    cv.grabCut(bgr, mask, rect, bgdModel, fgdModel, iterations, cv.GC_INIT_WITH_RECT);

    // Apply mask: background pixels → alpha 0
    for (let i = 0; i < rgba.rows; i++) {
      for (let j = 0; j < rgba.cols; j++) {
        const m = mask.ucharAt(i, j);
        if (m === cv.GC_BGD || m === cv.GC_PR_BGD) {
          rgba.ucharPtr(i, j)[3] = 0;
        }
      }
    }

    // Write result to an offscreen canvas and export as PNG Blob.
    // cv.imshow is synchronous — it copies all pixel data from the Mat
    // into the canvas buffer before returning. toBlob reads from the
    // canvas buffer (not the Mat), so it is safe to delete the Mats
    // in the finally block even though toBlob is asynchronous.
    const resultCanvas = document.createElement('canvas');
    resultCanvas.width  = rgba.cols;
    resultCanvas.height = rgba.rows;
    cv.imshow(resultCanvas, rgba);
    resultCanvas.toBlob(blob => {
      lastResultBlob = blob;
      displayResult(blob);
    }, 'image/png');

  } finally {
    rgba.delete();
    bgr.delete();
    mask.delete();
    bgdModel.delete();
    fgdModel.delete();
  }
}
```

`rect` is a value type in OpenCV.js and does not require `.delete()`.

---

## Color Match — Implementation

### Colour picking

A `click` listener (dispatched from `initPreviewListeners`) on `preview-canvas` in Color Match mode:

- Get canvas-relative coordinates from the event.
- Scale to image-natural coordinates: `imgX = Math.floor(e.offsetX * (processingCanvas.width / previewCanvas.offsetWidth))`.
- Read pixel: `const px = processingCtx.getImageData(imgX, imgY, 1, 1).data`.
- Store `pickedColor = { r: px[0], g: px[1], b: px[2] }`.
- Update colour swatch background.
- Call `updateProcessButtonState()`.

### Global colour threshold algorithm

```
1. Get ImageData from processingCanvas (full image at natural dimensions)
2. For every pixel i (stride 4):
   a. dr = data[i*4]   - pickedColor.r
      dg = data[i*4+1] - pickedColor.g
      db = data[i*4+2] - pickedColor.b
      distance = sqrt(dr² + dg² + db²)    // range 0–441
   b. threshold_scaled = tolerance * 4.41  // map 0–100 → 0–441
   c. If distance ≤ threshold_scaled:
        data[i*4+3] = 0   // transparent
3. If feathering > 0:
   a. Extract alpha channel as Uint8ClampedArray (one byte per pixel)
   b. Apply separable box blur of radius = feathering:
        - Horizontal pass: sliding window average of width (2r+1)
        - Vertical pass: same on the horizontal result
   c. Write blurred alpha back into data[i*4+3] for each pixel
4. Create an offscreen canvas, putImageData
5. Export as PNG Blob via canvas.toBlob('image/png')
```

This is a **global colour threshold** — every pixel whose colour distance from `pickedColor` is within tolerance becomes transparent, regardless of spatial connectivity.

---

## Result Display & Actions

```js
function displayResult(blob) {
  lastResultBlob = blob;
  const url = URL.createObjectURL(blob);
  document.getElementById('after-img').src = url;
  document.getElementById('result-area').classList.remove('d-none');
  document.getElementById('before-img').src = URL.createObjectURL(currentImageFile);
}
```

Old object URLs are revoked when a new result replaces them.

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
  document.getElementById('copy-error').classList.add('d-none');
  try {
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': lastResultBlob })
    ]);
  } catch (e) {
    document.getElementById('copy-error').textContent = 'Copy failed: ' + e.message;
    document.getElementById('copy-error').classList.remove('d-none');
  }
}
```

If `typeof ClipboardItem === 'undefined'` on `DOMContentLoaded`, the Copy button is hidden.

---

## Error Handling

| Condition | Behaviour |
|-----------|-----------|
| OpenCV script fails to load (`onerror`) | Inline warning; Smart Removal mode button disabled; Color Match still works |
| GrabCut throws at runtime | Alert with error message; spinner hidden; button re-enabled; Mats freed in `finally` |
| Rectangle too small for GrabCut | Caught by try/catch; alert shown |
| Color Match — no colour picked | Process button disabled |
| Smart Removal — no rectangle drawn | Process button disabled |
| Smart Removal — `cvReady === false` | Process button disabled |
| Clipboard API / ClipboardItem unavailable | Copy button hidden on page load |
| Clipboard write rejected | Inline error shown below action bar |
| Non-image file dropped | Drop zone shows "Please upload a JPG or PNG file." |
| Image loaded while OpenCV still loading | Color Match works immediately; Smart mode waits for `cvReady` |

---

## CSS Isolation

All custom rules prefixed with `#bg-remover-wrapper`:

```css
#bg-remover-wrapper .mode-btn { … }
#bg-remover-wrapper .checkerboard { … }
```

Bootstrap utilities used directly (already scoped to the CSS layer).

---

## Out of Scope

- Server-side processing
- Batch removal (multiple images)
- Fine-tuning / brush-based mask editing after GrabCut
- Touch support on preview-canvas interactions
- Saving settings between sessions
- `.webp`, `.gif`, or other formats (canvas API supports them; can be added later)
- Image resolution warnings or size caps
