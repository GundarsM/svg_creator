# Image-to-Vector Converter Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `converter.html` — a self-contained browser page that converts JPG/PNG images to SVG, EPS, and DXF using a hybrid tracing engine (ImageTracer.js for colour, Potrace WASM for line art).

**Architecture:** Single HTML file, no build system, all logic inline. Mirrors the structure of `editor.js`. Two tracing engines share a common canvas pipeline; a shared export layer converts the resulting SVG to EPS and DXF. The file is loaded directly in a browser and embedded on Squarespace via code injection.

**Tech Stack:** Bootstrap 5.3.0 (CSS layer), Font Awesome 6.4.0, ImageTracer.js v1.2.6, potrace-wasm (version verified in Task 1), vanilla JS, HTML5 Canvas API.

**Spec:** `docs/superpowers/specs/2026-03-23-image-to-vector-converter-design.md`

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `converter.html` | **Create** | Entire converter tool — head (CDN imports), scoped CSS, HTML layout, inline JS |

All JS is organized into named sections inside a single `<script>` block:
- `// === STATE ===`
- `// === CANVAS / IMAGE LOADING ===`
- `// === IMAGETRACER ENGINE ===`
- `// === POTRACE ENGINE ===`
- `// === SVG → EPS ===`
- `// === SVG → DXF ===`
- `// === DOWNLOAD ===`
- `// === UI BINDINGS ===`
- `// === INIT ===`

---

## Chunk 1: Research, Scaffold, and Image Loading

### Task 1: Research and pin potrace-wasm version

**Files:**
- No file changes yet

The spec requires the implementation to verify the exact potrace-wasm version and API before using `@latest`.

- [ ] **Step 1: Look up potrace-wasm on npm**

Open: `https://www.npmjs.com/package/potrace-wasm`

Record:
- Latest stable version number
- Whether it exposes `createPotrace()` or a different factory name
- What the trace function signature is (does it accept a `Uint8Array` of grayscale pixels?)
- What the CDN URL looks like on jsDelivr

- [ ] **Step 2: Check jsDelivr for the dist file**

Open: `https://cdn.jsdelivr.net/npm/potrace-wasm@{version}/`

Find the correct dist path (e.g. `/dist/potrace-wasm.js` or `/dist/index.js`).

- [ ] **Step 3: Record findings in a comment at the top of converter.html (done in Task 2)**

Note the pinned version, factory function name, and trace API shape. This comment will be placed just before the `<script src="...potrace-wasm...">` tag.

---

### Task 2: Create converter.html scaffold

**Files:**
- Create: `converter.html`

- [ ] **Step 1: Create the file with head section**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Image to Vector Converter - HillSpring Crafts</title>

  <!-- Bootstrap inside CSS layer so Squarespace styles always win -->
  <style>@import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css") layer(bootstrap);</style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <!-- ImageTracer.js v1.2.6 — pure-JS colour image tracing -->
  <script src="https://cdn.jsdelivr.net/npm/imagetracer@1.2.6/imagetracer_v1.2.6.js"></script>

  <!-- potrace-wasm — PINNED VERSION (verified in Task 1) -->
  <!-- Factory: createPotrace() | Trace: Potrace.trace(grayUint8Array, {width, height, ...opts}) -->
  <script src="https://cdn.jsdelivr.net/npm/potrace-wasm@REPLACE_VERSION/dist/potrace-wasm.js"></script>

  <style>
    /* Prevent Bootstrap from affecting Squarespace sections outside this tool */
    body > *:not(#converter-wrapper) .container,
    body > *:not(#converter-wrapper) .container-fluid,
    body > *:not(#converter-wrapper) .row,
    body > section .container,
    body > section .container-fluid,
    body > div:not(#converter-wrapper) > .container,
    body > div:not(#converter-wrapper) > .container-fluid {
      max-width: none !important;
      width: 100% !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }

    :root {
      --lunar-green: #344734;
      --light-bg: #f8f9fa;
      --border-color: #dee2e6;
    }

    #converter-wrapper {
      font-family: 'Athelas', Georgia, serif;
      background-color: var(--lunar-green);
      color: white;
      padding: 1.5rem;
      min-height: 100vh;
      margin: 0;
      clear: both;
      overflow: visible;
    }

    #converter-wrapper h1,
    #converter-wrapper h2,
    #converter-wrapper h3 {
      font-family: 'IvyMode', 'Times New Roman', serif;
    }

    /* Mode toggle */
    #converter-wrapper .mode-btn {
      border: 2px solid rgba(255,255,255,0.4);
      color: white;
      background: transparent;
      padding: 0.6rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.15s;
    }
    #converter-wrapper .mode-btn.active {
      background: rgba(255,255,255,0.2);
      border-color: white;
    }

    /* Upload zone */
    #drop-zone {
      border: 2px dashed rgba(255,255,255,0.4);
      border-radius: 8px;
      padding: 3rem 1rem;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s;
    }
    #drop-zone.drag-over {
      border-color: white;
      background: rgba(255,255,255,0.05);
    }
    #drop-zone.has-image {
      padding: 1rem;
      border-style: solid;
    }
    #preview-img {
      max-width: 100%;
      max-height: 300px;
      display: none;
      margin: 0.5rem auto 0;
      border-radius: 4px;
    }

    /* Control panel */
    #converter-wrapper .control-label {
      font-size: 0.85rem;
      color: rgba(255,255,255,0.75);
      margin-bottom: 0.2rem;
    }
    #converter-wrapper .form-range {
      accent-color: white;
    }
    #converter-wrapper .value-badge {
      font-size: 0.8rem;
      color: rgba(255,255,255,0.6);
      min-width: 2.5rem;
      display: inline-block;
    }

    /* SVG preview */
    #svg-preview-container {
      background: white;
      border-radius: 8px;
      min-height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: auto;
    }
    #svg-preview-container svg {
      max-width: 100%;
      max-height: 500px;
    }
    #svg-preview-placeholder {
      color: #aaa;
      font-style: italic;
    }

    /* Notice banner */
    #notice-banner {
      display: none;
      font-size: 0.85rem;
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
      padding: 0.4rem 0.8rem;
    }
  </style>
</head>
```

- [ ] **Step 2: Add body / HTML layout**

```html
<body>
<div id="converter-wrapper">
  <div class="container-fluid px-0">

    <!-- Page title -->
    <h2 class="mb-3 text-white">Image to Vector Converter</h2>

    <!-- ZONE 1: Mode selector -->
    <div class="mb-3 d-flex gap-2">
      <button class="mode-btn active" data-mode="color" id="btn-mode-color">
        <i class="fa fa-palette me-1"></i> Photo / Color
      </button>
      <button class="mode-btn" data-mode="lineart" id="btn-mode-lineart">
        <i class="fa fa-pen-nib me-1"></i> Logo / Line Art
      </button>
    </div>

    <!-- ZONE 2: Upload zone -->
    <div id="drop-zone" class="mb-3" tabindex="0" role="button" aria-label="Upload image">
      <div id="drop-prompt">
        <i class="fa fa-cloud-upload-alt fa-2x mb-2 d-block"></i>
        <div>Drag &amp; drop a JPG or PNG here, or <span class="text-decoration-underline">click to browse</span></div>
      </div>
      <img id="preview-img" alt="Uploaded image preview">
      <input type="file" id="file-input" accept=".jpg,.jpeg,.png" class="d-none">
    </div>
    <div id="notice-banner" class="mb-2">
      <i class="fa fa-info-circle me-1"></i>
      <span id="notice-text"></span>
    </div>

    <!-- ZONE 3: Control panel -->
    <div id="control-panel" class="mb-3">

      <!-- Photo/Color controls -->
      <div id="controls-color">
        <div class="row g-3">
          <div class="col-6 col-md-3">
            <div class="control-label">Color Count <span class="value-badge" id="val-colors">8</span></div>
            <input type="range" class="form-range" id="ctrl-colors" min="2" max="32" value="8">
          </div>
          <div class="col-6 col-md-3">
            <div class="control-label">Blur Radius <span class="value-badge" id="val-blur">0</span></div>
            <input type="range" class="form-range" id="ctrl-blur" min="0" max="5" value="0" step="1">
          </div>
          <div class="col-6 col-md-3">
            <div class="control-label">Stroke Width <span class="value-badge" id="val-stroke">1</span>px</div>
            <input type="range" class="form-range" id="ctrl-stroke" min="0" max="5" value="1" step="0.5">
          </div>
          <div class="col-6 col-md-3">
            <div class="control-label">Smoothing <span class="value-badge" id="val-smooth">0.5</span></div>
            <input type="range" class="form-range" id="ctrl-smooth" min="0" max="1" value="0.5" step="0.1">
          </div>
        </div>
      </div>

      <!-- Logo/Line Art controls -->
      <div id="controls-lineart" class="d-none">
        <div id="lineart-engine-error" class="d-none text-warning mb-2">
          <i class="fa fa-exclamation-triangle me-1"></i>
          Line Art engine failed to load. This mode is unavailable.
        </div>
        <div class="row g-3">
          <div class="col-6 col-md-3">
            <div class="control-label">B&amp;W Threshold <span class="value-badge" id="val-threshold">128</span></div>
            <input type="range" class="form-range" id="ctrl-threshold" min="0" max="255" value="128" step="1">
          </div>
          <div class="col-6 col-md-3">
            <div class="control-label">Noise Removal <span class="value-badge" id="val-turdsize">2</span></div>
            <input type="range" class="form-range" id="ctrl-turdsize" min="0" max="50" value="2" step="1">
          </div>
          <div class="col-6 col-md-3">
            <div class="control-label">Corner Sharpness <span class="value-badge" id="val-alphamax">1.0</span></div>
            <input type="range" class="form-range" id="ctrl-alphamax" min="0" max="1.34" value="1" step="0.01">
          </div>
          <div class="col-6 col-md-3">
            <div class="control-label">Curve Optimization</div>
            <div class="form-check form-switch mt-1">
              <input class="form-check-input" type="checkbox" id="ctrl-opticurve" checked>
              <label class="form-check-label" for="ctrl-opticurve">Enabled</label>
            </div>
          </div>
        </div>
      </div>

    </div><!-- /control-panel -->

    <!-- ZONE 4: Convert button -->
    <div class="mb-3">
      <button class="btn btn-light w-100 py-2 fw-semibold" id="btn-convert" disabled>
        <span id="btn-convert-text"><i class="fa fa-wand-magic-sparkles me-1"></i> Convert</span>
        <span id="btn-convert-spinner" class="d-none">
          <span class="spinner-border spinner-border-sm me-1" role="status"></span> Converting…
        </span>
      </button>
    </div>

    <!-- ZONE 5: SVG result preview -->
    <div id="svg-preview-container" class="mb-3">
      <span id="svg-preview-placeholder">SVG result will appear here after conversion</span>
    </div>

    <!-- ZONE 6: Download bar -->
    <div class="d-flex gap-2 flex-wrap mb-3">
      <button class="btn btn-outline-light flex-fill" id="btn-dl-svg" disabled>
        <i class="fa fa-download me-1"></i> Download SVG
      </button>
      <button class="btn btn-outline-light flex-fill" id="btn-dl-eps" disabled>
        <i class="fa fa-download me-1"></i> Download EPS
      </button>
      <button class="btn btn-outline-light flex-fill" id="btn-dl-dxf" disabled>
        <i class="fa fa-download me-1"></i> Download DXF
      </button>
    </div>

    <!-- Hidden canvas for image processing -->
    <canvas id="processing-canvas" class="d-none"></canvas>

  </div><!-- /container-fluid -->
</div><!-- /converter-wrapper -->
```

- [ ] **Step 3: Open converter.html in a browser**

Verify:
- Page renders without JS errors in the console
- Mode toggle buttons visible
- Drop zone visible
- Control panel (color controls) visible
- Convert button visible but disabled
- Three download buttons visible but disabled

- [ ] **Step 4: Commit scaffold**

```bash
cd "c:/Users/GundarsM/Documents/svg_editor"
git add converter.html
git commit -m "feat: add converter.html scaffold with UI layout"
```

---

### Task 3: Image loading, canvas, and downscale

**Files:**
- Modify: `converter.html` — add `// === STATE ===` and `// === CANVAS / IMAGE LOADING ===` JS sections, close `</body></html>`

- [ ] **Step 1: Add STATE and CANVAS sections to the script block**

Add a `<script>` block before `</body>` containing:

```js
// === STATE ===
let currentMode = 'color';       // 'color' | 'lineart'
let currentImageFile = null;     // File object from upload
let processingCanvas = null;     // HTMLCanvasElement (hidden)
let processingCtx = null;        // CanvasRenderingContext2D
let canvasWidth = 0;             // canvas dims after optional downscale
let canvasHeight = 0;
let lastSvgResult = null;        // SVG string from last successful convert
let lastStemName = 'converted';  // filename stem for downloads
const MAX_PIXELS = 4_000_000;

// Forward declarations — set by their respective engine init functions
let potraceReady    = false;     // set to true by initPotrace() in Task 6
let potraceInstance = null;      // set by initPotrace() in Task 6

// === CANVAS / IMAGE LOADING ===

function initCanvas() {
  processingCanvas = document.getElementById('processing-canvas');
  processingCtx = processingCanvas.getContext('2d');
}

/**
 * Draw an ImageBitmap onto the hidden canvas, downscaling if > MAX_PIXELS.
 * Sets canvasWidth / canvasHeight. Returns true on success.
 */
async function loadImageToCanvas(file) {
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch (e) {
    showNotice('Could not decode image. Make sure it is a valid JPG or PNG.');
    return false;
  }

  let w = bitmap.width;
  let h = bitmap.height;
  let downscaled = false;

  if (w * h > MAX_PIXELS) {
    const scale = Math.sqrt(MAX_PIXELS / (w * h));
    w = Math.floor(w * scale);
    h = Math.floor(h * scale);
    downscaled = true;
  }

  processingCanvas.width  = w;
  processingCanvas.height = h;
  processingCtx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  canvasWidth  = w;
  canvasHeight = h;

  if (downscaled) {
    showNotice(`Image was larger than 4 megapixels and has been scaled down to ${w}×${h} for tracing.`);
  } else {
    hideNotice();
  }
  return true;
}

/**
 * Derive filename stem: everything before the last dot, or full name if no dot.
 */
function deriveStem(filename) {
  const lastDot = filename.lastIndexOf('.');
  return lastDot > 0 ? filename.slice(0, lastDot) : filename;
}

function showNotice(text) {
  document.getElementById('notice-text').textContent = text;
  document.getElementById('notice-banner').style.display = 'block';
}
function hideNotice() {
  document.getElementById('notice-banner').style.display = 'none';
}

// File validation
function isAcceptedType(file) {
  return file && (file.type === 'image/jpeg' || file.type === 'image/png');
}

// Show error on drop zone
function showUploadError(msg) {
  const zone = document.getElementById('drop-zone');
  zone.classList.add('border-danger');
  zone.querySelector('#drop-prompt').innerHTML =
    `<i class="fa fa-exclamation-circle text-danger fa-2x mb-2 d-block"></i><div class="text-danger">${msg}</div>`;
  setTimeout(() => {
    zone.classList.remove('border-danger');
    resetDropPrompt();
  }, 3000);
}

function resetDropPrompt() {
  document.getElementById('drop-prompt').innerHTML =
    `<i class="fa fa-cloud-upload-alt fa-2x mb-2 d-block"></i>
     <div>Drag &amp; drop a JPG or PNG here, or <span class="text-decoration-underline">click to browse</span></div>`;
}

async function handleFile(file) {
  if (!isAcceptedType(file)) {
    showUploadError('Only JPG and PNG files are supported.');
    return;
  }
  currentImageFile = file;
  lastStemName = deriveStem(file.name);

  // Show thumbnail
  const preview = document.getElementById('preview-img');
  preview.src = URL.createObjectURL(file);
  preview.style.display = 'block';
  document.getElementById('drop-zone').classList.add('has-image');
  document.getElementById('drop-prompt').style.display = 'none';

  const ok = await loadImageToCanvas(file);
  if (ok) {
    // Enable convert button
    updateConvertButtonState();
    // Reset any previous result
    clearSvgResult();
  }
}

function clearSvgResult() {
  lastSvgResult = null;
  document.getElementById('svg-preview-container').innerHTML =
    '<span id="svg-preview-placeholder">SVG result will appear here after conversion</span>';
  setDownloadButtonsEnabled(false);
}
```

- [ ] **Step 2: Add drop zone and file input event wiring (inside `// === UI BINDINGS ===` section — will be expanded later)**

```js
// === UI BINDINGS ===

function initUploadZone() {
  const zone   = document.getElementById('drop-zone');
  const input  = document.getElementById('file-input');

  zone.addEventListener('click', () => input.click());
  zone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') input.click(); });

  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  input.addEventListener('change', () => {
    if (input.files[0]) handleFile(input.files[0]);
    input.value = ''; // reset so same file can be re-selected
  });
}

function setDownloadButtonsEnabled(enabled) {
  ['btn-dl-svg', 'btn-dl-eps', 'btn-dl-dxf'].forEach(id => {
    document.getElementById(id).disabled = !enabled;
  });
}
```

- [ ] **Step 3: Add `// === INIT ===` section and close the document**

```js
// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initUploadZone();
  // (other init calls added in later tasks)
});
```

Then close the script and document:
```html
</script>
</body>
</html>
```

- [ ] **Step 4: Browser-verify image loading**

Open `converter.html`. Test:
- Drag a JPG onto the drop zone → thumbnail appears, no errors in console
- Drag a PNG → same
- Drag a `.txt` file → error message shown in drop zone, disappears after 3 s
- Click the drop zone → file picker opens
- Upload a very large image (e.g. 5000×4000 px) → notice banner appears with downscale message

- [ ] **Step 5: Commit**

```bash
git add converter.html
git commit -m "feat: image upload, canvas loading, and downscale"
```

---

## Chunk 2: Tracing Engines and Convert Button

### Task 4: Mode selector wiring + control panel switching

**Files:**
- Modify: `converter.html` — extend `// === UI BINDINGS ===` and `updateConvertButtonState`

- [ ] **Step 1: Add mode switching logic**

Inside `// === UI BINDINGS ===`, add:

```js
function initModeSelector() {
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentMode = btn.dataset.mode;
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.getElementById('controls-color').classList.toggle('d-none', currentMode !== 'color');
      document.getElementById('controls-lineart').classList.toggle('d-none', currentMode !== 'lineart');

      updateConvertButtonState();
      clearSvgResult();
    });
  });
}
```

- [ ] **Step 2: Add slider live-value wiring**

```js
function initSliders() {
  const pairs = [
    ['ctrl-colors',    'val-colors'],
    ['ctrl-blur',      'val-blur'],
    ['ctrl-stroke',    'val-stroke'],
    ['ctrl-smooth',    'val-smooth'],
    ['ctrl-threshold', 'val-threshold'],
    ['ctrl-turdsize',  'val-turdsize'],
    ['ctrl-alphamax',  'val-alphamax'],
  ];
  pairs.forEach(([ctrlId, valId]) => {
    const ctrl = document.getElementById(ctrlId);
    const val  = document.getElementById(valId);
    if (ctrl && val) {
      ctrl.addEventListener('input', () => { val.textContent = ctrl.value; });
    }
  });
}
```

- [ ] **Step 3: Add `updateConvertButtonState`**

```js
function updateConvertButtonState() {
  const hasImage = currentImageFile !== null;
  const engineReady = currentMode === 'color' || potraceReady;
  const btn = document.getElementById('btn-convert');
  btn.disabled = !(hasImage && engineReady);
}
```

(`potraceReady` is defined in Task 6.)

- [ ] **Step 4: Wire init calls**

In `DOMContentLoaded`:
```js
initModeSelector();
initSliders();
```

- [ ] **Step 5: Browser-verify**

Open `converter.html`:
- Click "Logo / Line Art" → line art controls appear, color controls hide
- Click "Photo / Color" → switches back
- Move any slider → badge value updates in real time

- [ ] **Step 6: Commit**

```bash
git add converter.html
git commit -m "feat: mode selector and control panel sliders"
```

---

### Task 5: ImageTracer.js integration (Photo / Color mode)

**Files:**
- Modify: `converter.html` — add `// === IMAGETRACER ENGINE ===` section

- [ ] **Step 1: Add the engine function**

```js
// === IMAGETRACER ENGINE ===

/**
 * Trace using ImageTracer.js (Photo/Color mode).
 * Returns an SVG string.
 */
function traceWithImageTracer() {
  const colors = parseInt(document.getElementById('ctrl-colors').value, 10);
  const blur   = parseInt(document.getElementById('ctrl-blur').value, 10);
  const stroke = parseFloat(document.getElementById('ctrl-stroke').value);
  const smooth = parseFloat(document.getElementById('ctrl-smooth').value);

  const options = {
    numberofcolors: colors,
    blurradius:     blur,
    strokewidth:    stroke,
    roundcoords:    smooth,
    viewbox:        true,
    desc:           false,
  };

  const imageData = processingCtx.getImageData(0, 0, canvasWidth, canvasHeight);
  // ImageTracer.imagedataToSVG returns an SVG string synchronously
  const svgStr = ImageTracer.imagedataToSVG(imageData, options);
  return svgStr;
}
```

- [ ] **Step 2: Browser-verify ImageTracer.js is accessible**

Open `converter.html`, open browser console, type:
```
typeof ImageTracer
```
Expected: `"object"` (the library is loaded from CDN).

If `"undefined"`: check the jsDelivr CDN URL and verify `imagetracer_v1.2.6.js` is a valid path for that version.

---

### Task 6: Potrace WASM integration (Logo / Line Art mode)

**Files:**
- Modify: `converter.html` — add `// === POTRACE ENGINE ===` section

- [ ] **Step 1: Add Potrace state and init function**

```js
// === POTRACE ENGINE ===
// Note: potraceReady and potraceInstance are declared in // === STATE === above

async function initPotrace() {
  try {
    // Factory name verified in Task 1 — update if different
    potraceInstance = await createPotrace();
    potraceReady = true;
  } catch (e) {
    console.error('potrace-wasm failed to initialise:', e);
    potraceReady = false;
    document.getElementById('lineart-engine-error').classList.remove('d-none');
  }
  updateConvertButtonState();
}
```

- [ ] **Step 2: Add grayscale conversion helper**

```js
/**
 * Convert RGBA ImageData to a single-channel Uint8Array of grayscale values.
 * Transparent pixels (alpha < 128) are treated as white (255).
 * Uses luminance-weighted formula: 0.299R + 0.587G + 0.114B
 */
function rgbaToGray(imageData) {
  const { data, width, height } = imageData;
  const gray = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    const a = data[i * 4 + 3];
    gray[i] = a < 128 ? 255 : Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }
  return gray;
}
```

- [ ] **Step 3: Add the trace function**

```js
/**
 * Trace using potrace-wasm (Logo/Line Art mode).
 * Returns an SVG string, or throws on failure.
 */
function traceWithPotrace() {
  if (!potraceReady || !potraceInstance) {
    throw new Error('Potrace engine not ready');
  }

  const threshold  = parseInt(document.getElementById('ctrl-threshold').value, 10);
  const turdsize   = parseInt(document.getElementById('ctrl-turdsize').value, 10);
  const alphamax   = parseFloat(document.getElementById('ctrl-alphamax').value);
  const opticurve  = document.getElementById('ctrl-opticurve').checked;

  const imageData = processingCtx.getImageData(0, 0, canvasWidth, canvasHeight);
  const gray = rgbaToGray(imageData);

  // API shape verified in Task 1 — adjust parameter names if needed
  const svgStr = potraceInstance.trace(gray, {
    width:      canvasWidth,
    height:     canvasHeight,
    threshold:  threshold,
    turdsize:   turdsize,
    alphamax:   alphamax,
    opticurve:  opticurve ? 1 : 0,
  });

  return svgStr;
}
```

- [ ] **Step 4: Call initPotrace from INIT**

In `DOMContentLoaded`:
```js
initPotrace(); // async; sets potraceReady and updates button state when done
```

- [ ] **Step 5: Browser-verify Potrace loads**

Open `converter.html`, open browser console after page load.
- If no errors: `potraceReady` should be `true` (type in console to verify)
- If CDN error (404): re-check the URL from Task 1 and fix the `<script src>` tag
- Logo/Line Art mode Convert button should be enabled once engine loads (if an image is already loaded)

---

### Task 7: Convert button wiring and SVG preview

**Files:**
- Modify: `converter.html` — add `// === UI BINDINGS ===` convert button handler

- [ ] **Step 1: Add convert button handler**

```js
function initConvertButton() {
  document.getElementById('btn-convert').addEventListener('click', async () => {
    setConvertLoading(true);

    try {
      let svgStr;
      if (currentMode === 'color') {
        svgStr = traceWithImageTracer();
      } else {
        svgStr = traceWithPotrace();
      }

      if (!svgStr || !svgStr.includes('<path')) {
        throw new Error('no-paths');
      }

      lastSvgResult = svgStr;
      displaySvgResult(svgStr);
      setDownloadButtonsEnabled(true);

    } catch (e) {
      if (e.message === 'no-paths') {
        showSvgError('No paths found — try adjusting the threshold or color count.');
      } else {
        showSvgError('Conversion failed: ' + e.message);
        console.error(e);
      }
      setDownloadButtonsEnabled(false);
    } finally {
      setConvertLoading(false);
    }
  });
}

function setConvertLoading(loading) {
  const btn     = document.getElementById('btn-convert');
  const txtSpan = document.getElementById('btn-convert-text');
  const spinSpan = document.getElementById('btn-convert-spinner');
  btn.disabled   = loading;
  txtSpan.classList.toggle('d-none', loading);
  spinSpan.classList.toggle('d-none', !loading);
}

function displaySvgResult(svgStr) {
  const container = document.getElementById('svg-preview-container');
  container.innerHTML = svgStr;
  // Make sure the inline SVG is responsive
  const svgEl = container.querySelector('svg');
  if (svgEl) {
    svgEl.style.maxWidth  = '100%';
    svgEl.style.maxHeight = '500px';
  }
}

function showSvgError(msg) {
  document.getElementById('svg-preview-container').innerHTML =
    `<span class="text-danger"><i class="fa fa-exclamation-triangle me-1"></i>${msg}</span>`;
}
```

- [ ] **Step 2: Wire initConvertButton in DOMContentLoaded**

In the `DOMContentLoaded` listener, add:
```js
initConvertButton();
```
The full listener should now read:
```js
document.addEventListener('DOMContentLoaded', () => {
  initCanvas();
  initUploadZone();
  initModeSelector();
  initSliders();
  initConvertButton();
  initPotrace(); // async; updates button state when done
});
```

- [ ] **Step 3: Browser end-to-end test — Photo/Color mode**

Open `converter.html`:
1. Upload a colourful PNG or JPG
2. Adjust color count to 6
3. Click Convert
4. Expect: spinner → SVG result appears in preview pane (coloured vector shapes)
5. No console errors

- [ ] **Step 4: Browser end-to-end test — Logo/Line Art mode**

1. Switch to Logo / Line Art mode
2. Upload a simple logo or clip art
3. Click Convert (wait for engine if still loading)
4. Expect: black-and-white vector result appears

- [ ] **Step 5: Browser test — empty result**

1. Upload a solid white PNG
2. Switch to Line Art, set threshold to 0 (nothing passes threshold)
3. Click Convert
4. Expect: "No paths found" message in preview area

- [ ] **Step 6: Commit**

```bash
git add converter.html
git commit -m "feat: convert button wires both tracing engines with SVG preview"
```

---

## Chunk 3: Export (SVG, EPS, DXF)

### Task 8: SVG download

**Files:**
- Modify: `converter.html` — add `// === DOWNLOAD ===` section

- [ ] **Step 1: Add download utility and SVG download**

```js
// === DOWNLOAD ===

function triggerDownload(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.getElementById('btn-dl-svg').addEventListener('click', () => {
  if (!lastSvgResult) return;
  triggerDownload(lastSvgResult, lastStemName + '.svg', 'image/svg+xml');
});
```

- [ ] **Step 2: Browser-verify SVG download**

1. Upload an image and click Convert
2. Click "Download SVG"
3. Expect: `{filename}.svg` downloads, opens correctly in browser or Inkscape

---

### Task 9: SVG → EPS converter and download

**Files:**
- Modify: `converter.html` — add `// === SVG → EPS ===` section

The EPS converter parses SVG `<path>` elements and converts them to PostScript path commands.

- [ ] **Step 1: Add SVG path parser utility**

```js
// === SVG → EPS ===

/**
 * Parse a raw SVG `d` attribute string into an array of command objects.
 * Each object: { cmd: string, args: number[] }
 * Handles both absolute (uppercase) and relative (lowercase) commands.
 */
function parseSvgPathD(d) {
  const commands = [];
  // Tokenise: split on command letters, keeping the letter
  const tokens = d.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g) || [];
  for (const token of tokens) {
    const cmd  = token[0];
    const rest = token.slice(1).trim();
    // Parse numbers (handles negative, decimal, scientific notation)
    const args = rest.length
      ? rest.split(/[\s,]+|(?=-)/).filter(s => s !== '').map(Number)
      : [];
    commands.push({ cmd, args });
  }
  return commands;
}
```

- [ ] **Step 2: Add arc-to-Bézier helper**

Based on the W3C SVG arc implementation notes (appendix F.6):

```js
/**
 * Convert an SVG arc segment to one or more cubic Bézier segments.
 * Returns array of [c1x, c1y, c2x, c2y, ex, ey] for each cubic.
 * Inputs: current point (x1,y1), arc params (rx,ry,angle,largeArc,sweep), endpoint (x2,y2).
 */
function arcToCubics(x1, y1, rx, ry, xRotDeg, largeArc, sweep, x2, y2) {
  if (rx === 0 || ry === 0) return [[x1, y1, x2, y2, x2, y2]]; // degenerate → line

  const phi = xRotDeg * Math.PI / 180;
  const cosPhi = Math.cos(phi), sinPhi = Math.sin(phi);

  // Step 1: Compute (x1', y1')
  const dx2 = (x1 - x2) / 2, dy2 = (y1 - y2) / 2;
  const x1p =  cosPhi * dx2 + sinPhi * dy2;
  const y1p = -sinPhi * dx2 + cosPhi * dy2;

  // Step 2: Compute (cx', cy')
  let rxSq = rx * rx, rySq = ry * ry;
  let x1pSq = x1p * x1p, y1pSq = y1p * y1p;

  // Ensure radii are large enough (F.6.6)
  const lambda = Math.sqrt(x1pSq / rxSq + y1pSq / rySq);
  if (lambda > 1) { rx *= lambda; ry *= lambda; rxSq = rx*rx; rySq = ry*ry; }

  const num = Math.max(0, rxSq * rySq - rxSq * y1pSq - rySq * x1pSq);
  const den = rxSq * y1pSq + rySq * x1pSq;
  const sq  = (largeArc !== sweep ? 1 : -1) * Math.sqrt(num / den);
  const cxp =  sq * rx * y1p / ry;
  const cyp = -sq * ry * x1p / rx;

  // Step 3: Compute (cx, cy)
  const cx = cosPhi * cxp - sinPhi * cyp + (x1 + x2) / 2;
  const cy = sinPhi * cxp + cosPhi * cyp + (y1 + y2) / 2;

  // Step 4: Compute angles
  const ux = (x1p - cxp) / rx, uy = (y1p - cyp) / ry;
  const vx = (-x1p - cxp) / rx, vy = (-y1p - cyp) / ry;
  let theta1 = Math.atan2(uy, ux);
  let dTheta  = Math.atan2(vy, vx) - theta1;
  if (!sweep && dTheta > 0) dTheta -= 2 * Math.PI;
  if ( sweep && dTheta < 0) dTheta += 2 * Math.PI;

  // Split into ≤90° segments
  const n = Math.ceil(Math.abs(dTheta) / (Math.PI / 2));
  const dt = dTheta / n;
  const alpha = Math.sin(dt) * (Math.sqrt(4 + 3 * Math.tan(dt / 2) ** 2) - 1) / 3;

  const cubics = [];
  let t = theta1;
  let px = x1, py = y1;
  for (let i = 0; i < n; i++) {
    const cosT = Math.cos(t), sinT = Math.sin(t);
    const cosT2 = Math.cos(t + dt), sinT2 = Math.sin(t + dt);

    const dx1 = -sinT,  dy1 = cosT;
    const dx2b = -sinT2, dy2b = cosT2;

    const ex = cx + rx * (cosPhi * cosT2 - sinPhi * sinT2);
    const ey = cy + ry * (sinPhi * cosT2 + cosPhi * sinT2);

    cubics.push([
      px + alpha * (cosPhi * dx1 * rx - sinPhi * dy1 * ry),
      py + alpha * (sinPhi * dx1 * rx + cosPhi * dy1 * ry),
      ex - alpha * (cosPhi * dx2b * rx - sinPhi * dy2b * ry),
      ey - alpha * (sinPhi * dx2b * rx + cosPhi * dy2b * ry),
      ex, ey
    ]);
    t += dt;
    px = ex; py = ey;
  }
  return cubics;
}
```

- [ ] **Step 3: Add SVG-to-EPS converter**

```js
/**
 * Convert an SVG string to an EPS string.
 * Parses all <path> elements, converts their `d` attributes to PostScript.
 * fill/stroke colours from SVG attributes are preserved as greyscale.
 */
function svgToEps(svgStr) {
  const parser = new DOMParser();
  const doc    = parser.parseFromString(svgStr, 'image/svg+xml');

  // Parse width/height from viewBox or attributes
  const svgEl  = doc.querySelector('svg');
  const vb     = svgEl.getAttribute('viewBox');
  let bbW = canvasWidth, bbH = canvasHeight;
  if (vb) {
    const parts = vb.trim().split(/[\s,]+/);
    bbW = parseFloat(parts[2]) || bbW;
    bbH = parseFloat(parts[3]) || bbH;
  }

  const lines = [
    '%!PS-Adobe-3.0 EPSF-3.0',
    `%%BoundingBox: 0 0 ${Math.ceil(bbW)} ${Math.ceil(bbH)}`,
    '%%EndComments',
    '%%BeginProlog',
    '%%EndProlog',
    '%%Page: 1 1',
    'gsave',
    `${bbH} 0 translate 1 -1 scale`,  // flip Y axis (SVG Y-down → EPS Y-up)
  ];

  const paths = doc.querySelectorAll('path');
  paths.forEach(pathEl => {
    const d       = pathEl.getAttribute('d') || '';
    const fill    = pathEl.getAttribute('fill');
    const stroke  = pathEl.getAttribute('stroke');
    const sw      = parseFloat(pathEl.getAttribute('stroke-width') || '0');

    lines.push('newpath');
    pathDtoPS(d, lines);
    // Note: 'closepath' is emitted inside pathDtoPS for each Z command.
    // Do NOT add an unconditional closepath here — open paths would be corrupted.

    if (fill && fill !== 'none') {
      const [r, g, b] = parseColor(fill);
      lines.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} setrgbcolor`);
      if (stroke && stroke !== 'none') {
        lines.push('gsave fill grestore');
      } else {
        lines.push('fill');
      }
    }
    if (stroke && stroke !== 'none') {
      const [r, g, b] = parseColor(stroke);
      lines.push(`${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} setrgbcolor`);
      lines.push(`${sw || 1} setlinewidth`);
      lines.push('stroke');
    }
  });

  lines.push('grestore', '%%EOF');
  return lines.join('\n');
}

/** Convert SVG path d attribute to PostScript path commands, appended to lines[]. */
function pathDtoPS(d, lines) {
  const cmds = parseSvgPathD(d);
  let cx = 0, cy = 0;  // current point
  let lastCmd = '';
  let lastC1x = 0, lastC1y = 0; // for S/s reflection

  cmds.forEach(({ cmd, args }) => {
    const abs = cmd === cmd.toUpperCase();
    const resolve = (x, y) => abs ? [x, y] : [cx + x, cy + y];
    const resolveX = x => abs ? x : cx + x;
    const resolveY = y => abs ? y : cy + y;

    switch (cmd.toLowerCase()) {
      case 'm': {
        const [x, y] = resolve(args[0], args[1]);
        lines.push(`${x.toFixed(3)} ${y.toFixed(3)} moveto`);
        cx = x; cy = y;
        // Subsequent pairs are implicit lineto
        for (let i = 2; i < args.length; i += 2) {
          const [lx, ly] = abs ? [args[i], args[i+1]] : [cx + args[i], cy + args[i+1]];
          lines.push(`${lx.toFixed(3)} ${ly.toFixed(3)} lineto`);
          cx = lx; cy = ly;
        }
        break;
      }
      case 'l': {
        for (let i = 0; i < args.length; i += 2) {
          const [x, y] = resolve(args[i], args[i+1]);
          lines.push(`${x.toFixed(3)} ${y.toFixed(3)} lineto`);
          cx = x; cy = y;
        }
        break;
      }
      case 'h': {
        args.forEach(val => {
          cx = resolveX(val);
          lines.push(`${cx.toFixed(3)} ${cy.toFixed(3)} lineto`);
        });
        break;
      }
      case 'v': {
        args.forEach(val => {
          cy = resolveY(val);
          lines.push(`${cx.toFixed(3)} ${cy.toFixed(3)} lineto`);
        });
        break;
      }
      case 'c': {
        for (let i = 0; i < args.length; i += 6) {
          const [c1x, c1y] = resolve(args[i],   args[i+1]);
          const [c2x, c2y] = resolve(args[i+2], args[i+3]);
          const [ex,  ey ] = resolve(args[i+4], args[i+5]);
          lines.push(`${c1x.toFixed(3)} ${c1y.toFixed(3)} ${c2x.toFixed(3)} ${c2y.toFixed(3)} ${ex.toFixed(3)} ${ey.toFixed(3)} curveto`);
          lastC1x = c2x; lastC1y = c2y;
          cx = ex; cy = ey;
        }
        break;
      }
      case 's': {
        // Smooth cubic: reflect previous control point
        for (let i = 0; i < args.length; i += 4) {
          const c1x = 2 * cx - lastC1x;
          const c1y = 2 * cy - lastC1y;
          const [c2x, c2y] = resolve(args[i],   args[i+1]);
          const [ex,  ey ] = resolve(args[i+2], args[i+3]);
          lines.push(`${c1x.toFixed(3)} ${c1y.toFixed(3)} ${c2x.toFixed(3)} ${c2y.toFixed(3)} ${ex.toFixed(3)} ${ey.toFixed(3)} curveto`);
          lastC1x = c2x; lastC1y = c2y;
          cx = ex; cy = ey;
        }
        break;
      }
      case 'q': {
        // Quadratic → cubic approximation: CP = current + 2/3*(Q-current)
        for (let i = 0; i < args.length; i += 4) {
          const [qx, qy] = resolve(args[i],   args[i+1]);
          const [ex, ey] = resolve(args[i+2], args[i+3]);
          const c1x = cx + 2/3 * (qx - cx);
          const c1y = cy + 2/3 * (qy - cy);
          const c2x = ex + 2/3 * (qx - ex);
          const c2y = ey + 2/3 * (qy - ey);
          lines.push(`${c1x.toFixed(3)} ${c1y.toFixed(3)} ${c2x.toFixed(3)} ${c2y.toFixed(3)} ${ex.toFixed(3)} ${ey.toFixed(3)} curveto`);
          lastC1x = c2x; lastC1y = c2y;
          cx = ex; cy = ey;
        }
        break;
      }
      case 't': {
        // Smooth quadratic
        for (let i = 0; i < args.length; i += 2) {
          const qx = 2 * cx - lastC1x;
          const qy = 2 * cy - lastC1y;
          const [ex, ey] = resolve(args[i], args[i+1]);
          const c1x = cx + 2/3 * (qx - cx);
          const c1y = cy + 2/3 * (qy - cy);
          const c2x = ex + 2/3 * (qx - ex);
          const c2y = ey + 2/3 * (qy - ey);
          lines.push(`${c1x.toFixed(3)} ${c1y.toFixed(3)} ${c2x.toFixed(3)} ${c2y.toFixed(3)} ${ex.toFixed(3)} ${ey.toFixed(3)} curveto`);
          lastC1x = c2x; lastC1y = c2y;
          cx = ex; cy = ey;
        }
        break;
      }
      case 'a': {
        for (let i = 0; i < args.length; i += 7) {
          const [rx, ry, xRot, la, sw, ex, ey] = [
            Math.abs(args[i]),   Math.abs(args[i+1]),
            args[i+2], args[i+3], args[i+4],
            ...resolve(args[i+5], args[i+6])
          ];
          const cubics = arcToCubics(cx, cy, rx, ry, xRot, la, sw, ex, ey);
          cubics.forEach(([c1x, c1y, c2x, c2y, endX, endY]) => {
            lines.push(`${c1x.toFixed(3)} ${c1y.toFixed(3)} ${c2x.toFixed(3)} ${c2y.toFixed(3)} ${endX.toFixed(3)} ${endY.toFixed(3)} curveto`);
            lastC1x = c2x; lastC1y = c2y;
          });
          cx = ex; cy = ey;
        }
        break;
      }
      case 'z': {
        lines.push('closepath');
        break;
      }
    }
    lastCmd = cmd;
  });
}

/** Parse a CSS/SVG colour value to [r,g,b] in 0..1 range. Falls back to [0,0,0]. */
function parseColor(colorStr) {
  if (!colorStr || colorStr === 'none') return [0, 0, 0];
  // Use a temporary canvas to parse any CSS colour string
  const tmp = document.createElement('canvas');
  tmp.width = tmp.height = 1;
  const ctx = tmp.getContext('2d');
  ctx.fillStyle = colorStr;
  ctx.fillRect(0, 0, 1, 1);
  const d = ctx.getImageData(0, 0, 1, 1).data;
  return [d[0] / 255, d[1] / 255, d[2] / 255];
}
```

- [ ] **Step 4: Wire EPS download button**

```js
document.getElementById('btn-dl-eps').addEventListener('click', () => {
  if (!lastSvgResult) return;
  const eps = svgToEps(lastSvgResult);
  triggerDownload(eps, lastStemName + '.eps', 'application/postscript');
});
```

- [ ] **Step 5: Browser-verify EPS output**

1. Convert any image
2. Click "Download EPS"
3. Open the `.eps` file in a text editor — verify it starts with `%!PS-Adobe-3.0 EPSF-3.0` and contains `%%BoundingBox`
4. If possible, open in Inkscape or Illustrator — shapes should be visible and correctly positioned

---

### Task 10: SVG → DXF converter and download

**Files:**
- Modify: `converter.html` — add `// === SVG → DXF ===` section

- [ ] **Step 1: Add Bézier flattening helper**

```js
// === SVG → DXF ===

const DXF_FLATNESS = 0.5; // px tolerance for curve subdivision

/** Recursively subdivide a cubic Bézier until flatness < DXF_FLATNESS. Returns array of [x,y] points. */
function flattenCubic(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y, pts) {
  // Flatness check: max distance of control points from the chord
  const ux = 3*p1x - 2*p0x - p3x;
  const uy = 3*p1y - 2*p0y - p3y;
  const vx = 3*p2x - 2*p3x - p0x;
  const vy = 3*p2y - 2*p3y - p0y;
  const flatness = Math.max(ux*ux + uy*uy, vx*vx + vy*vy);
  if (flatness <= 16 * DXF_FLATNESS * DXF_FLATNESS) {
    pts.push([p3x, p3y]);
    return;
  }
  // de Casteljau midpoint split
  const m01x = (p0x+p1x)/2, m01y = (p0y+p1y)/2;
  const m12x = (p1x+p2x)/2, m12y = (p1y+p2y)/2;
  const m23x = (p2x+p3x)/2, m23y = (p2y+p3y)/2;
  const m012x = (m01x+m12x)/2, m012y = (m01y+m12y)/2;
  const m123x = (m12x+m23x)/2, m123y = (m12y+m23y)/2;
  const mx    = (m012x+m123x)/2, my = (m012y+m123y)/2;
  flattenCubic(p0x, p0y, m01x, m01y, m012x, m012y, mx, my, pts);
  flattenCubic(mx, my, m123x, m123y, m23x, m23y, p3x, p3y, pts);
}

/** Flatten a quadratic Bézier by converting to cubic first. */
function flattenQuadratic(p0x, p0y, cpx, cpy, p3x, p3y, pts) {
  const c1x = p0x + 2/3*(cpx-p0x), c1y = p0y + 2/3*(cpy-p0y);
  const c2x = p3x + 2/3*(cpx-p3x), c2y = p3y + 2/3*(cpy-p3y);
  flattenCubic(p0x, p0y, c1x, c1y, c2x, c2y, p3x, p3y, pts);
}
```

- [ ] **Step 2: Add SVG path-to-polylines converter**

```js
/**
 * Convert an SVG `d` string to an array of polylines (array of [x,y] pairs).
 * Each M command starts a new polyline; Z closes the current one.
 * Y axis is flipped: dxfY = svgHeight - svgY
 */
function pathDtoPolylines(d, svgHeight) {
  const polylines = [];
  let currentPoly = [];
  let cx = 0, cy = 0;
  let lastC2x = 0, lastC2y = 0; // for S/s
  let lastQx  = 0, lastQy  = 0; // for T/t
  let subpathStartX = 0, subpathStartY = 0;

  const flip = y => svgHeight - y;
  const addPt = (x, y) => currentPoly.push([x, flip(y)]);

  const cmds = parseSvgPathD(d);
  cmds.forEach(({ cmd, args }) => {
    const abs = cmd === cmd.toUpperCase();
    const rx = (x) => abs ? x : cx + x;
    const ry = (y) => abs ? y : cy + y;

    switch (cmd.toLowerCase()) {
      case 'm': {
        if (currentPoly.length > 1) polylines.push(currentPoly);
        currentPoly = [];
        const x = rx(args[0]), y = ry(args[1]);
        cx = x; cy = y;
        subpathStartX = cx; subpathStartY = cy;
        addPt(cx, cy);
        for (let i = 2; i < args.length; i += 2) {
          cx = abs ? args[i]   : cx + args[i];
          cy = abs ? args[i+1] : cy + args[i+1];
          addPt(cx, cy);
        }
        break;
      }
      case 'l': {
        for (let i = 0; i < args.length; i += 2) {
          cx = rx(args[i]); cy = ry(args[i+1]);
          addPt(cx, cy);
        }
        break;
      }
      case 'h': {
        args.forEach(v => { cx = abs ? v : cx + v; addPt(cx, cy); });
        break;
      }
      case 'v': {
        args.forEach(v => { cy = abs ? v : cy + v; addPt(cx, cy); });
        break;
      }
      case 'c': {
        for (let i = 0; i < args.length; i += 6) {
          const c1x = rx(args[i]),   c1y = ry(args[i+1]);
          const c2x = rx(args[i+2]), c2y = ry(args[i+3]);
          const ex  = rx(args[i+4]), ey  = ry(args[i+5]);
          const pts = [];
          flattenCubic(cx, cy, c1x, c1y, c2x, c2y, ex, ey, pts);
          pts.forEach(([x, y]) => addPt(x, y));
          lastC2x = c2x; lastC2y = c2y;
          cx = ex; cy = ey;
        }
        break;
      }
      case 's': {
        for (let i = 0; i < args.length; i += 4) {
          const c1x = 2*cx - lastC2x, c1y = 2*cy - lastC2y;
          const c2x = rx(args[i]),    c2y = ry(args[i+1]);
          const ex  = rx(args[i+2]),  ey  = ry(args[i+3]);
          const pts = [];
          flattenCubic(cx, cy, c1x, c1y, c2x, c2y, ex, ey, pts);
          pts.forEach(([x, y]) => addPt(x, y));
          lastC2x = c2x; lastC2y = c2y;
          cx = ex; cy = ey;
        }
        break;
      }
      case 'q': {
        for (let i = 0; i < args.length; i += 4) {
          const qx = rx(args[i]),   qy = ry(args[i+1]);
          const ex = rx(args[i+2]), ey = ry(args[i+3]);
          const pts = [];
          flattenQuadratic(cx, cy, qx, qy, ex, ey, pts);
          pts.forEach(([x, y]) => addPt(x, y));
          lastQx = qx; lastQy = qy;
          cx = ex; cy = ey;
        }
        break;
      }
      case 't': {
        for (let i = 0; i < args.length; i += 2) {
          const qx = 2*cx - lastQx, qy = 2*cy - lastQy;
          const ex = rx(args[i]),   ey = ry(args[i+1]);
          const pts = [];
          flattenQuadratic(cx, cy, qx, qy, ex, ey, pts);
          pts.forEach(([x, y]) => addPt(x, y));
          lastQx = qx; lastQy = qy;
          cx = ex; cy = ey;
        }
        break;
      }
      case 'a': {
        for (let i = 0; i < args.length; i += 7) {
          const [rx2, ry2, xRot, la, sw] = [
            Math.abs(args[i]), Math.abs(args[i+1]),
            args[i+2], args[i+3], args[i+4]
          ];
          const ex = abs ? args[i+5] : cx + args[i+5];
          const ey = abs ? args[i+6] : cy + args[i+6];
          const cubics = arcToCubics(cx, cy, rx2, ry2, xRot, la, sw, ex, ey);
          cubics.forEach(([c1x, c1y, c2x, c2y, endX, endY]) => {
            const pts = [];
            flattenCubic(cx, cy, c1x, c1y, c2x, c2y, endX, endY, pts);
            pts.forEach(([x, y]) => addPt(x, y));
            cx = endX; cy = endY;
          });
        }
        break;
      }
      case 'z': {
        addPt(subpathStartX, subpathStartY); // close
        polylines.push(currentPoly);
        currentPoly = [];
        cx = subpathStartX; cy = subpathStartY;
        break;
      }
    }
  });

  if (currentPoly.length > 1) polylines.push(currentPoly);
  return polylines;
}
```

- [ ] **Step 3: Add SVG-to-DXF converter**

```js
/**
 * Convert an SVG string to a DXF R2010 string.
 * Each polyline becomes one LWPOLYLINE entity.
 * Coordinate system: 1 SVG user unit = 1 mm, Y flipped.
 */
function svgToDxf(svgStr) {
  const parser = new DOMParser();
  const doc    = parser.parseFromString(svgStr, 'image/svg+xml');
  const svgEl  = doc.querySelector('svg');
  const vb     = svgEl.getAttribute('viewBox');
  let svgH = canvasHeight;
  if (vb) {
    const parts = vb.trim().split(/[\s,]+/);
    svgH = parseFloat(parts[3]) || svgH;
  }

  const lines = [
    '0', 'SECTION', '2', 'HEADER',
    '9', '$ACADVER', '1', 'AC1024',
    '0', 'ENDSEC',
    '0', 'SECTION', '2', 'ENTITIES',
  ];

  const paths = doc.querySelectorAll('path');
  paths.forEach(pathEl => {
    const d = pathEl.getAttribute('d') || '';
    const polylines = pathDtoPolylines(d, svgH);
    polylines.forEach(pts => {
      if (pts.length < 2) return;
      const closed = (pts[0][0] === pts[pts.length-1][0] && pts[0][1] === pts[pts.length-1][1]);
      const drawPts = closed ? pts.slice(0, -1) : pts;
      lines.push(
        '0', 'LWPOLYLINE',
        '8', '0',           // layer 0
        '90', `${drawPts.length}`,
        '70', closed ? '1' : '0',
      );
      drawPts.forEach(([x, y]) => {
        lines.push('10', x.toFixed(4), '20', y.toFixed(4));
      });
    });
  });

  lines.push('0', 'ENDSEC', '0', 'EOF');
  return lines.join('\n');
}
```

- [ ] **Step 4: Wire DXF download button**

```js
document.getElementById('btn-dl-dxf').addEventListener('click', () => {
  if (!lastSvgResult) return;
  const dxf = svgToDxf(lastSvgResult);
  triggerDownload(dxf, lastStemName + '.dxf', 'application/dxf');
});
```

- [ ] **Step 5: Browser-verify DXF output**

1. Convert any image
2. Click "Download DXF"
3. Open the `.dxf` file in a text editor — verify it starts with `0\nSECTION\n2\nHEADER` and contains `LWPOLYLINE` entities
4. If possible, open in a DXF viewer (LibreCAD, Inkscape, or online viewer) — shapes should be visible

- [ ] **Step 6: Commit all export functionality**

```bash
git add converter.html
git commit -m "feat: SVG, EPS, and DXF export with download buttons"
```

---

### Task 11: Final polish, error edge cases, and production commit

**Files:**
- Modify: `converter.html` — review and final fixes

- [ ] **Step 1: Test all error states**

Test each error condition from the spec:

| Test | Steps | Expected |
|------|-------|----------|
| Unsupported file type | Drag a `.gif` onto drop zone | Error message in drop zone, disappears after 3s |
| No image loaded | Page-load state | Convert button disabled, download buttons disabled |
| WASM loading | On slow connection, check Logo/Line Art | "Loading engine…" shown until ready |
| WASM failure | Temporarily break the CDN URL, reload | Engine error message in line art panel |
| No paths found | Upload solid white PNG, threshold=0, convert | "No paths found — try adjusting…" in preview |
| Large image | Upload >4MP image | Notice banner with downscale dimensions |

- [ ] **Step 2: Verify mode switching preserves image**

1. Upload an image
2. Switch to Logo/Line Art mode
3. Verify the thumbnail is still visible and canvas data is intact (Convert still works)

- [ ] **Step 3: Verify filename derivation edge cases**

In browser console:
```js
// Test helper (deriveStem must be accessible globally or test via real upload)
console.assert(deriveStem('logo.jpg')     === 'logo',     'simple');
console.assert(deriveStem('my.logo.jpg')  === 'my.logo',  'multi-dot');
console.assert(deriveStem('noextension')  === 'noextension', 'no-ext');
```

- [ ] **Step 4: Pin potrace-wasm version**

In `converter.html`, find `potrace-wasm@REPLACE_VERSION` and replace with the actual stable version:
1. Open `https://www.npmjs.com/package/potrace-wasm` and note the latest stable version
2. Verify the dist file exists at `https://cdn.jsdelivr.net/npm/potrace-wasm@{version}/dist/potrace-wasm.js`
3. Replace the placeholder in the `<script src>` tag with the exact version number

- [ ] **Step 5: Final browser smoke test**

Open `converter.html` and walk through:
1. Upload a JPG → thumbnail shown
2. Photo/Color mode → Convert → SVG preview appears
3. Download SVG → opens correctly
4. Download EPS → valid EPS header
5. Download DXF → valid DXF structure
6. Switch to Logo/Line Art → Convert → B&W SVG preview
7. Download all three formats

No console errors throughout.

- [ ] **Step 6: Final commit**

```bash
git add converter.html
git commit -m "feat: complete image-to-vector converter (SVG/EPS/DXF)"
```
