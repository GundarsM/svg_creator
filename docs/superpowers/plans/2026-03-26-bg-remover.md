# Background Remover Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `bg-remover.html` — a single self-contained background removal tool with Smart Removal (OpenCV GrabCut) and Color Match modes, deployable as Squarespace code injection.

**Architecture:** Single HTML file with inline CSS and JS, identical structural patterns to `converter.html`. OpenCV.js loaded as a classic `<script>` tag; two off-screen canvases (processing + visible preview) handle image data and user interaction separately.

**Tech Stack:** Bootstrap 5.3.0 (CSS layer), Font Awesome 6.4.0, `@techstark/opencv-js@4.8.0-release.1` (UMD classic script), vanilla JS, no build system.

**Spec:** `docs/superpowers/specs/2026-03-26-bg-remover-design.md`

---

## Chunk 1: HTML, CSS, State, Upload, Mode, OpenCV, Canvas Interactions

### Task 1: HTML shell + CSS

Create the complete static file with all zones, styles, and placeholder script tag. No JS yet.

**Files:**
- Create: `bg-remover.html`

---

- [ ] **Step 1: Create `bg-remover.html` with the following complete content**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Background Remover - HillSpring Crafts</title>

  <!-- Bootstrap inside CSS layer so Squarespace styles always win -->
  <style>@import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css") layer(bootstrap);</style>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <!-- OpenCV.js — version pinned at 4.8.0-release.1, do not bump without re-testing init path -->
  <script id="opencv-script" src="https://cdn.jsdelivr.net/npm/@techstark/opencv-js@4.8.0-release.1/dist/opencv.js"></script>

  <style>
    /* Prevent Bootstrap from affecting Squarespace sections outside this tool */
    body > *:not(#bg-remover-wrapper) .container,
    body > *:not(#bg-remover-wrapper) .container-fluid,
    body > *:not(#bg-remover-wrapper) .row,
    body > section .container,
    body > section .container-fluid,
    body > div:not(#bg-remover-wrapper) > .container,
    body > div:not(#bg-remover-wrapper) > .container-fluid {
      max-width: none !important;
      width: 100% !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      margin-left: auto !important;
      margin-right: auto !important;
    }

    :root { --lunar-green: #344734; }

    #bg-remover-wrapper {
      font-family: 'Athelas', Georgia, serif;
      background-color: var(--lunar-green);
      color: white;
      padding: 1.5rem;
      min-height: 100vh;
      margin: 0;
      clear: both;
      overflow: visible;
    }
    #bg-remover-wrapper h2 {
      font-family: 'IvyMode', 'Times New Roman', serif;
    }

    /* Mode toggle */
    #bg-remover-wrapper .mode-btn {
      border: 2px solid rgba(255,255,255,0.4);
      color: white;
      background: transparent;
      padding: 0.6rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.15s;
    }
    #bg-remover-wrapper .mode-btn.active {
      background: rgba(255,255,255,0.2);
      border-color: white;
    }
    #bg-remover-wrapper .mode-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* Upload / drop zone */
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
      padding: 0.5rem;
      border-style: solid;
    }
    #preview-canvas {
      display: none;
      max-width: 100%;
      max-height: 300px;
      border-radius: 4px;
    }
    #drop-zone.has-image #preview-canvas {
      display: block;
      margin: 0 auto;
    }

    /* Control labels */
    #bg-remover-wrapper .control-label {
      font-size: 0.85rem;
      color: rgba(255,255,255,0.75);
      margin-bottom: 0.2rem;
    }
    #bg-remover-wrapper .form-range { accent-color: white; }
    #bg-remover-wrapper .value-badge {
      font-size: 0.8rem;
      color: rgba(255,255,255,0.6);
      min-width: 2.5rem;
      display: inline-block;
    }

    /* Colour swatch */
    #color-swatch {
      width: 2rem;
      height: 2rem;
      border-radius: 4px;
      border: 2px solid rgba(255,255,255,0.4);
      background: transparent;
      display: inline-block;
      vertical-align: middle;
      flex-shrink: 0;
    }

    /* Result panels */
    #result-area .panel-label {
      font-size: 0.8rem;
      color: rgba(255,255,255,0.6);
      text-align: center;
      margin-bottom: 0.25rem;
    }
    #result-area img {
      width: 100%;
      max-height: 400px;
      object-fit: contain;
      border-radius: 6px;
      display: block;
    }
    .checkerboard {
      background-color: #ccc;
      background-image:
        linear-gradient(45deg, #fff 25%, transparent 25%),
        linear-gradient(-45deg, #fff 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #fff 75%),
        linear-gradient(-45deg, transparent 75%, #fff 75%);
      background-size: 16px 16px;
      background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
      border-radius: 6px;
    }
  </style>
</head>
<body>
<div id="bg-remover-wrapper">
  <div class="container-fluid px-0">

    <h2 class="mb-3 text-white">Background Remover</h2>

    <!-- ZONE 1: Mode selector -->
    <div class="mb-3 d-flex gap-2">
      <button class="mode-btn active" data-mode="smart" id="btn-mode-smart">
        <i class="fa fa-wand-magic-sparkles me-1"></i> Smart Removal
      </button>
      <button class="mode-btn" data-mode="color" id="btn-mode-color">
        <i class="fa fa-eye-dropper me-1"></i> Color Match
      </button>
    </div>

    <!-- ZONE 2: Upload zone -->
    <div id="drop-zone" class="mb-3" tabindex="0" role="button" aria-label="Upload image">
      <div id="drop-prompt">
        <i class="fa fa-cloud-upload-alt fa-2x mb-2 d-block"></i>
        <div>Drag &amp; drop a JPG or PNG here, or <span class="text-decoration-underline">click to browse</span></div>
      </div>
      <canvas id="preview-canvas"></canvas>
      <input type="file" id="file-input" accept=".jpg,.jpeg,.png" class="d-none">
    </div>
    <div id="drop-error" class="text-warning mb-2 d-none">
      <i class="fa fa-exclamation-triangle me-1"></i>
      <span id="drop-error-text">Please upload a JPG or PNG file.</span>
    </div>

    <!-- ZONE 3: Controls (hidden until image loaded) -->
    <div id="control-panel" class="mb-3 d-none">

      <!-- Smart Removal controls -->
      <div id="controls-smart">
        <div id="cv-error" class="d-none text-warning mb-2">
          <i class="fa fa-exclamation-triangle me-1"></i>
          Smart Removal engine failed to load. Use Color Match instead.
        </div>
        <div class="row g-3">
          <div class="col-6 col-md-4">
            <div class="control-label">Iterations <span class="value-badge" id="val-iterations">3</span></div>
            <input type="range" class="form-range" id="ctrl-iterations" min="1" max="5" value="3" step="1">
          </div>
        </div>
        <p class="text-muted small mt-2 mb-0">
          <i class="fa fa-info-circle me-1"></i>Draw a rectangle around the subject on the image above, then click Remove Background.
        </p>
      </div>

      <!-- Color Match controls -->
      <div id="controls-color" class="d-none">
        <div class="row g-3 align-items-end">
          <div class="col-6 col-md-4">
            <div class="control-label">Tolerance <span class="value-badge" id="val-tolerance">30</span></div>
            <input type="range" class="form-range" id="ctrl-tolerance" min="0" max="100" value="30" step="1">
          </div>
          <div class="col-6 col-md-4">
            <div class="control-label">Feathering <span class="value-badge" id="val-feathering">2</span>px</div>
            <input type="range" class="form-range" id="ctrl-feathering" min="0" max="10" value="2" step="1">
          </div>
          <div class="col-6 col-md-4">
            <div class="control-label">Background Color</div>
            <div class="d-flex align-items-center gap-2">
              <span id="color-swatch"></span>
              <span class="text-muted small" id="color-hint">Click image to pick</span>
            </div>
          </div>
        </div>
      </div>

    </div><!-- /control-panel -->

    <!-- ZONE 4: Process button -->
    <div class="mb-3">
      <button class="btn btn-light w-100 py-2 fw-semibold" id="btn-process" disabled>
        <span id="btn-process-text"><i class="fa fa-scissors me-1"></i> Remove Background</span>
        <span id="btn-process-spinner" class="d-none">
          <span class="spinner-border spinner-border-sm me-1" role="status"></span> Removing&hellip;
        </span>
      </button>
    </div>

    <!-- ZONE 5: Result area -->
    <div id="result-area" class="d-none mb-3">

      <!-- Zone 5b: CV loading indicator (shown while OpenCV loads) -->
      <div id="cv-loading" class="text-center py-4">
        <div class="spinner-border text-light" role="status" style="width:3rem;height:3rem;">
          <span class="visually-hidden">Loading…</span>
        </div>
        <div class="mt-2">Loading Smart Removal engine…</div>
        <div class="text-muted small">This takes a moment on first use.</div>
      </div>

      <!-- Before / After panels (hidden while CV loading, shown after first result) -->
      <div id="result-panels" class="d-none">
        <div class="row g-3 mb-3">
          <div class="col-12 col-md-6">
            <div class="panel-label">Before</div>
            <img id="before-img" alt="Original">
          </div>
          <div class="col-12 col-md-6">
            <div class="panel-label">After</div>
            <div class="checkerboard">
              <img id="after-img" alt="Background removed">
            </div>
          </div>
        </div>
        <div class="d-flex gap-2 flex-wrap">
          <button class="btn btn-outline-light flex-fill" id="btn-download">
            <i class="fa fa-download me-1"></i> Download PNG
          </button>
          <button class="btn btn-outline-light flex-fill" id="btn-copy">
            <i class="fa fa-copy me-1"></i> Copy to Clipboard
          </button>
        </div>
        <div id="copy-error" class="d-none text-warning small mt-1"></div>
      </div>

    </div><!-- /result-area -->

  </div><!-- /container-fluid -->
</div><!-- /bg-remover-wrapper -->

<script>
// JS added in subsequent tasks
</script>
</body>
</html>
```

- [ ] **Step 2: Verify HTML structure in browser**

  Open `bg-remover.html` in a browser (file:// or local server). Expected:
  - Dark green background, "Background Remover" heading.
  - Two mode buttons: "Smart Removal" (active) and "Color Match".
  - Upload zone with dashed border.
  - Disabled "Remove Background" button.
  - No JS errors in console (the OpenCV script tag will load; it may log to console but should not throw).

- [ ] **Step 3: Commit**

  ```bash
  git add bg-remover.html
  git commit -m "feat: bg-remover.html HTML shell and CSS"
  ```

---

### Task 2: State variables + utility functions

Add the STATE section and two utility functions to the `<script>` block.

**Files:**
- Modify: `bg-remover.html` — `<script>` block

---

- [ ] **Step 1: Replace the `// JS added in subsequent tasks` placeholder with the STATE section and utilities**

  Find:
  ```html
  <script>
  // JS added in subsequent tasks
  </script>
  ```

  Replace with:
  ```html
  <script>
  // === STATE ===
  let currentMode      = 'smart'; // 'smart' | 'color'
  let currentImageFile = null;    // File object from upload
  let stemName         = '';      // filename without extension, for download
  let pickedColor      = null;    // { r, g, b } — Color Match mode
  let grabRect         = null;    // { x, y, w, h } in canvas pixels — Smart Removal
  let cvReady          = false;   // true once OpenCV WASM is ready
  let lastResultBlob   = null;    // Blob (PNG) from last removal
  let prevBeforeUrl    = null;    // object URL for before-img (revoked on replacement)
  let prevAfterUrl     = null;    // object URL for after-img (revoked on replacement)

  // Drag state for rect drawing (Smart mode)
  let rectDrawing = false;
  let rectX0 = 0, rectY0 = 0; // drag start in canvas pixels
  let rectX1 = 0, rectY1 = 0; // drag end in canvas pixels

  // Off-screen canvas for pixel processing (natural image dimensions)
  const processingCanvas = document.createElement('canvas');
  const processingCtx    = processingCanvas.getContext('2d');

  // === UTILITIES ===

  function updateProcessButtonState() {
    const btn = document.getElementById('btn-process');
    if (currentMode === 'smart') {
      btn.disabled = !(currentImageFile && grabRect && cvReady);
    } else {
      btn.disabled = !(currentImageFile && pickedColor);
    }
  }

  function setProcessLoading(loading) {
    document.getElementById('btn-process-text').classList.toggle('d-none', loading);
    document.getElementById('btn-process-spinner').classList.toggle('d-none', !loading);
    if (loading) {
      document.getElementById('btn-process').disabled = true;
    } else {
      updateProcessButtonState(); // re-enable only if app state allows it
    }
  }

  function deriveStemName(filename) {
    const i = filename.lastIndexOf('.');
    return i > 0 ? filename.substring(0, i) : filename;
  }
  </script>
  ```

- [ ] **Step 2: Verify in browser console**

  Open `bg-remover.html`. In the console run:
  ```js
  deriveStemName('photo.final.jpg')  // → "photo.final"
  deriveStemName('photo')            // → "photo"
  updateProcessButtonState()         // → no error, btn stays disabled
  ```

- [ ] **Step 3: Commit**

  ```bash
  git add bg-remover.html
  git commit -m "feat: bg-remover state variables and utility functions"
  ```

---

### Task 3: Upload zone

Add `handleImageLoad` and `initUploadZone`. Images are drawn into both `processingCanvas` (off-screen, natural dimensions) and `preview-canvas` (visible, same dimensions — CSS constrains display size).

**Files:**
- Modify: `bg-remover.html` — `<script>` block (append after STATE section)

---

- [ ] **Step 1: Append `handleImageLoad` and `initUploadZone` to the script**

  Add immediately after the `deriveStemName` function:

  ```js
  // === UPLOAD ZONE ===

  function handleImageLoad(file) {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      document.getElementById('drop-error').classList.remove('d-none');
      return;
    }
    document.getElementById('drop-error').classList.add('d-none');

    currentImageFile = file;
    stemName = deriveStemName(file.name);
    pickedColor = null;
    grabRect    = null;
    rectDrawing = false;
    lastResultBlob = null;

    // Reset color swatch
    document.getElementById('color-swatch').style.background = 'transparent';
    document.getElementById('color-hint').textContent = 'Click image to pick';

    // Reset result area
    document.getElementById('result-panels').classList.add('d-none');
    if (prevBeforeUrl) { URL.revokeObjectURL(prevBeforeUrl); prevBeforeUrl = null; }
    if (prevAfterUrl)  { URL.revokeObjectURL(prevAfterUrl);  prevAfterUrl  = null; }

    const img = new Image();
    const decodeUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(decodeUrl); // free decode URL immediately after drawing

      // Draw into processing canvas (natural size)
      processingCanvas.width  = img.naturalWidth;
      processingCanvas.height = img.naturalHeight;
      processingCtx.drawImage(img, 0, 0);

      // Draw into visible preview-canvas (same pixel dimensions; CSS limits display size)
      const pc = document.getElementById('preview-canvas');
      pc.width  = img.naturalWidth;
      pc.height = img.naturalHeight;
      pc.getContext('2d').drawImage(img, 0, 0);

      // Show canvas, hide prompt
      document.getElementById('drop-zone').classList.add('has-image');
      document.getElementById('drop-prompt').style.display = 'none';

      // Show control panel
      document.getElementById('control-panel').classList.remove('d-none');

      // Show result-area if in smart mode (so cv-loading spinner is visible)
      if (currentMode === 'smart') {
        document.getElementById('result-area').classList.remove('d-none');
      }

      updateProcessButtonState();
    };
    img.src = decodeUrl;

  function initUploadZone() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') fileInput.click(); });

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) handleImageLoad(file);
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files[0]) handleImageLoad(fileInput.files[0]);
      fileInput.value = '';
    });
  }
  ```

- [ ] **Step 2: Verify in browser**

  Open `bg-remover.html`. Drag a JPG or PNG onto the drop zone. Expected:
  - Drop zone border becomes solid, image thumbnail appears in the drop zone.
  - Control panel appears.
  - Console: no errors.
  - Drag a non-image file → orange warning appears.

- [ ] **Step 3: Commit**

  ```bash
  git add bg-remover.html
  git commit -m "feat: bg-remover upload zone"
  ```

---

### Task 4: Mode selector

Add `initModeSelector`. Switching mode resets interaction state and toggles control panels.

**Files:**
- Modify: `bg-remover.html` — `<script>` block

---

- [ ] **Step 1: Append `initModeSelector` to the script**

  ```js
  // === MODE SELECTOR ===

  function initModeSelector() {
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        currentMode = btn.dataset.mode;

        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Toggle control panels
        document.getElementById('controls-smart').classList.toggle('d-none', currentMode !== 'smart');
        document.getElementById('controls-color').classList.toggle('d-none', currentMode !== 'color');

        // Reset interaction state
        grabRect    = null;
        pickedColor = null;
        rectDrawing = false;
        lastResultBlob = null;

        // Reset color swatch
        document.getElementById('color-swatch').style.background = 'transparent';
        document.getElementById('color-hint').textContent = 'Click image to pick';

        // Hide result panels; show result-area only in smart mode (for CV loading spinner)
        document.getElementById('result-panels').classList.add('d-none');
        if (prevBeforeUrl) { URL.revokeObjectURL(prevBeforeUrl); prevBeforeUrl = null; }
        if (prevAfterUrl)  { URL.revokeObjectURL(prevAfterUrl);  prevAfterUrl  = null; }

        if (currentMode === 'smart' && currentImageFile) {
          document.getElementById('result-area').classList.remove('d-none');
        } else if (currentMode === 'color') {
          document.getElementById('result-area').classList.add('d-none');
        }

        // Redraw preview canvas to clear any rect overlay (grabRect is already null above)
        if (currentImageFile) drawPreviewCanvas();

        updateProcessButtonState();
      });
    });
  }
  ```

- [ ] **Step 2: Verify in browser**

  Load an image. Click "Color Match" — Iterations control hides, tolerance/feathering/swatch appear. Click "Smart Removal" — switches back. Console: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add bg-remover.html
  git commit -m "feat: bg-remover mode selector"
  ```

---

### Task 5: OpenCV loading

Add `initOpenCv` — wires the `<script>` tag's `load`/`error` events, polls for `window.cv.Mat`, shows/hides the loading spinner.

**Files:**
- Modify: `bg-remover.html` — `<script>` block

---

- [ ] **Step 1: Append `initOpenCv` and helpers to the script**

  ```js
  // === OPENCV LOADING ===

  function onCvReady() {
    cvReady = true;
    document.getElementById('cv-loading').classList.add('d-none');
    updateProcessButtonState();
  }

  function waitForCv() {
    if (window.cv && typeof window.cv.Mat === 'function') {
      onCvReady();
    } else if (window.cv && typeof window.cv.then === 'function') {
      // Some builds return cv as a Promise
      window.cv.then(instance => { window.cv = instance; onCvReady(); });
    } else {
      setTimeout(waitForCv, 100);
    }
  }

  function initOpenCv() {
    const script = document.getElementById('opencv-script');
    script.addEventListener('load', waitForCv);
    script.addEventListener('error', () => {
      document.getElementById('cv-error').classList.remove('d-none');
      document.getElementById('btn-mode-smart').disabled = true;
      // Switch to color mode automatically
      document.getElementById('btn-mode-color').click();
    });
    // If the script already loaded before DOMContentLoaded fired (cached), poll immediately
    if (window.cv) waitForCv();
  }
  ```

- [ ] **Step 2: Verify in browser**

  Open `bg-remover.html`. In smart mode with an image loaded, the result-area is visible showing the spinner. After a few seconds (while OpenCV WASM compiles) the spinner disappears and the Remove Background button enables. Console: no errors.

  To test failure: temporarily break the script URL in the HTML → reload → "Smart Removal engine failed to load" warning appears, mode switches to Color Match.

- [ ] **Step 3: Commit**

  ```bash
  git add bg-remover.html
  git commit -m "feat: bg-remover OpenCV loading with polling init"
  ```

---

### Task 6: Preview canvas interactions

Add rectangle drawing (Smart mode) and colour picking (Color Match mode) via a single `initPreviewListeners` function. One set of listeners dispatches by `currentMode`.

**Files:**
- Modify: `bg-remover.html` — `<script>` block

---

- [ ] **Step 1: Append canvas interaction functions to the script**

  ```js
  // === PREVIEW CANVAS INTERACTIONS ===

  function drawPreviewCanvas() {
    const pc  = document.getElementById('preview-canvas');
    const ctx = pc.getContext('2d');
    ctx.drawImage(processingCanvas, 0, 0);

    // Scale for converting CSS pixels to canvas pixels
    const scaleX = pc.width / pc.offsetWidth;
    const scaleY = pc.height / pc.offsetHeight;
    const lw = Math.max(1, scaleX * 2); // 2 CSS px in canvas units

    if (rectDrawing) {
      ctx.save();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = lw;
      ctx.setLineDash([lw * 4, lw * 2]);
      ctx.strokeRect(rectX0, rectY0, rectX1 - rectX0, rectY1 - rectY0);
      ctx.restore();
    } else if (grabRect) {
      ctx.save();
      ctx.strokeStyle = 'rgba(255,200,50,0.9)';
      ctx.lineWidth = lw;
      ctx.setLineDash([lw * 4, lw * 2]);
      ctx.strokeRect(grabRect.x, grabRect.y, grabRect.w, grabRect.h);
      ctx.restore();
    }
  }

  function handleRectStart(e) {
    const pc = document.getElementById('preview-canvas');
    if (!pc.offsetWidth) return; // canvas not yet visible
    const scaleX = pc.width / pc.offsetWidth;
    const scaleY = pc.height / pc.offsetHeight;
    rectDrawing = true;
    grabRect = null;
    rectX0 = e.offsetX * scaleX;
    rectY0 = e.offsetY * scaleY;
    rectX1 = rectX0;
    rectY1 = rectY0;
  }

  function handleRectDraw(e) {
    if (!rectDrawing) return;
    const pc = document.getElementById('preview-canvas');
    if (!pc.offsetWidth) return;
    const scaleX = pc.width / pc.offsetWidth;
    const scaleY = pc.height / pc.offsetHeight;
    rectX1 = e.offsetX * scaleX;
    rectY1 = e.offsetY * scaleY;
    drawPreviewCanvas();
  }

  function handleRectEnd(e) {
    if (!rectDrawing) return;
    rectDrawing = false;
    const pc = document.getElementById('preview-canvas');
    if (!pc.offsetWidth) { grabRect = null; updateProcessButtonState(); return; }
    const scaleX = pc.width / pc.offsetWidth;
    const scaleY = pc.height / pc.offsetHeight;
    rectX1 = e.offsetX * scaleX;
    rectY1 = e.offsetY * scaleY;
    const x = Math.round(Math.min(rectX0, rectX1));
    const y = Math.round(Math.min(rectY0, rectY1));
    const w = Math.round(Math.abs(rectX1 - rectX0));
    const h = Math.round(Math.abs(rectY1 - rectY0));
    if (w > 4 && h > 4) {
      grabRect = { x, y, w, h };
    } else {
      grabRect = null; // too small, ignore
    }
    drawPreviewCanvas();
    updateProcessButtonState();
  }

  function handleColorPick(e) {
    const pc = document.getElementById('preview-canvas');
    const scaleX = processingCanvas.width / pc.offsetWidth;
    const scaleY = processingCanvas.height / pc.offsetHeight;
    const imgX = Math.floor(e.offsetX * scaleX);
    const imgY = Math.floor(e.offsetY * scaleY);
    const px = processingCtx.getImageData(
      Math.min(imgX, processingCanvas.width  - 1),
      Math.min(imgY, processingCanvas.height - 1),
      1, 1
    ).data;
    pickedColor = { r: px[0], g: px[1], b: px[2] };
    document.getElementById('color-swatch').style.background =
      `rgb(${px[0]},${px[1]},${px[2]})`;
    document.getElementById('color-hint').textContent =
      `rgb(${px[0]}, ${px[1]}, ${px[2]})`;
    updateProcessButtonState();
  }

  function initPreviewListeners() {
    const pc = document.getElementById('preview-canvas');
    pc.addEventListener('mousedown', (e) => { if (currentMode === 'smart') handleRectStart(e); });
    pc.addEventListener('mousemove', (e) => { if (currentMode === 'smart') handleRectDraw(e); });
    pc.addEventListener('mouseup',   (e) => { if (currentMode === 'smart') handleRectEnd(e); });
    pc.addEventListener('mouseleave',(e) => { if (currentMode === 'smart' && rectDrawing) handleRectEnd(e); });
    pc.addEventListener('click',     (e) => { if (currentMode === 'color') handleColorPick(e); });
  }
  ```

- [ ] **Step 2: Verify in browser**

  Load an image. In Smart mode: drag a rectangle → white dashed rect appears while dragging, yellow dashed rect persists after release. In Color Match mode: click on the image → swatch fills with the clicked colour and `rgb(r,g,b)` text appears next to it.

- [ ] **Step 3: Commit**

  ```bash
  git add bg-remover.html
  git commit -m "feat: bg-remover preview canvas rect drawing and color pick"
  ```

---

## Chunk 2: Controls, Processing, Result Display, Wiring

### Task 7: Controls wiring + DOMContentLoaded skeleton

Add `initSliders` to wire value badges, then add the `DOMContentLoaded` entry point calling all init functions so far.

**Files:**
- Modify: `bg-remover.html` — `<script>` block

---

- [ ] **Step 1: Append `initSliders` and the `DOMContentLoaded` stub**

  ```js
  // === CONTROLS ===

  function initSliders() {
    const pairs = [
      ['ctrl-iterations', 'val-iterations'],
      ['ctrl-tolerance',  'val-tolerance'],
      ['ctrl-feathering', 'val-feathering'],
    ];
    pairs.forEach(([ctrlId, valId]) => {
      const ctrl = document.getElementById(ctrlId);
      const val  = document.getElementById(valId);
      if (ctrl && val) {
        ctrl.addEventListener('input', () => { val.textContent = ctrl.value; });
      }
    });
  }

  // === INIT ===
  document.addEventListener('DOMContentLoaded', () => {
    initUploadZone();
    initModeSelector();
    initOpenCv();
    initPreviewListeners();
    initSliders();
    // initProcessButton() — added in Task 8
    // initResultActions() — added in Task 10
  });
  ```

- [ ] **Step 2: Verify in browser**

  Load an image in Smart mode. Drag the Iterations slider — the badge next to it updates. Switch to Color Match — drag Tolerance and Feathering sliders — badges update.

- [ ] **Step 3: Commit**

  ```bash
  git add bg-remover.html
  git commit -m "feat: bg-remover slider value badges"
  ```

---

### Task 8: GrabCut processing

Add `runGrabCut` and `initProcessButton`. The process button click handler dispatches to `runGrabCut` or `runColorMatch` (added in Task 9) based on `currentMode`.

**Files:**
- Modify: `bg-remover.html` — `<script>` block

---

- [ ] **Step 1: Append `runGrabCut` and `initProcessButton` to the script (before `DOMContentLoaded`)**

  ```js
  // === SMART REMOVAL ===

  function runGrabCut() {
    const iterations = parseInt(document.getElementById('ctrl-iterations').value, 10);

    // Read original RGBA from processing canvas
    const rgba = cv.imread(processingCanvas);

    // Convert to BGR (3-channel) — GrabCut requires CV_8UC3, not RGBA
    const bgr = new cv.Mat();
    cv.cvtColor(rgba, bgr, cv.COLOR_RGBA2BGR);

    const mask     = new cv.Mat();
    const bgdModel = new cv.Mat();
    const fgdModel = new cv.Mat();
    const rect = new cv.Rect(grabRect.x, grabRect.y, grabRect.w, grabRect.h);

    try {
      cv.grabCut(bgr, mask, rect, bgdModel, fgdModel, iterations, cv.GC_INIT_WITH_RECT);

      // Apply mask to the RGBA Mat: background pixels → alpha 0
      for (let row = 0; row < rgba.rows; row++) {
        for (let col = 0; col < rgba.cols; col++) {
          const m = mask.ucharAt(row, col);
          if (m === cv.GC_BGD || m === cv.GC_PR_BGD) {
            rgba.ucharPtr(row, col)[3] = 0;
          }
        }
      }

      // cv.imshow is synchronous — copies all pixels into canvas before returning.
      // toBlob reads from canvas buffer (independent of Mat memory), so it is safe
      // to delete Mats in finally even though toBlob is async.
      const resultCanvas = document.createElement('canvas');
      resultCanvas.width  = rgba.cols;
      resultCanvas.height = rgba.rows;
      cv.imshow(resultCanvas, rgba);
      resultCanvas.toBlob(blob => {
        setProcessLoading(false);
        displayResult(blob);
      }, 'image/png');

    } catch (err) {
      setProcessLoading(false);
      alert('Smart Removal failed: ' + err.message);
    } finally {
      rgba.delete();
      bgr.delete();
      mask.delete();
      bgdModel.delete();
      fgdModel.delete();
    }
  }

  // === PROCESS BUTTON ===

  function initProcessButton() {
    document.getElementById('btn-process').addEventListener('click', async () => {
      setProcessLoading(true);
      await new Promise(r => requestAnimationFrame(r)); // yield so browser paints spinner
      try {
        if (currentMode === 'smart') {
          runGrabCut(); // async via toBlob callback — setProcessLoading(false) called inside
        } else {
          runColorMatch(); // async via toBlob callback — setProcessLoading(false) called inside
        }
      } catch (err) {
        alert('Removal failed: ' + err.message);
        setProcessLoading(false);
        updateProcessButtonState();
      }
    });
  }
  ```

- [ ] **Step 2: Add `initProcessButton()` call to `DOMContentLoaded`**

  Find:
  ```js
    // initProcessButton() — added in Task 8
  ```
  Replace with:
  ```js
    initProcessButton();
  ```

- [ ] **Step 3: Verify in browser**

  Load an image in Smart mode. Wait for engine to load. Draw a rectangle around a subject. Click Remove Background. Expected: spinner appears on button, GrabCut runs (may take a few seconds), result panels appear with before/after images. Check console for no errors.

- [ ] **Step 4: Commit**

  ```bash
  git add bg-remover.html
  git commit -m "feat: bg-remover GrabCut Smart Removal"
  ```

---

### Task 9: Color Match processing

Add `boxBlurAlpha` and `runColorMatch`. Uses the global colour threshold algorithm from the spec.

**Files:**
- Modify: `bg-remover.html` — `<script>` block (append before `initProcessButton`)

---

- [ ] **Step 1: Append `boxBlurAlpha` and `runColorMatch` before `initProcessButton`**

  ```js
  // === COLOR MATCH ===

  /**
   * In-place separable box blur on the alpha channel.
   * data: Uint8ClampedArray (RGBA interleaved), w/h: image dimensions, r: blur radius.
   */
  function boxBlurAlpha(data, w, h, r) {
    if (r < 1) return;

    // Extract alpha channel
    const src = new Uint8ClampedArray(w * h);
    for (let i = 0; i < w * h; i++) src[i] = data[i * 4 + 3];
    const tmp = new Uint8ClampedArray(w * h);

    // Horizontal pass (src → tmp) using sliding window
    for (let y = 0; y < h; y++) {
      const base = y * w;
      let sum = 0;
      for (let x = -r; x < w; x++) {
        if (x + r < w) sum += src[base + x + r];
        if (x - r - 1 >= 0) sum -= src[base + x - r - 1];
        const lo = Math.max(0, x - r), hi = Math.min(w - 1, x + r);
        if (x >= 0) tmp[base + x] = Math.round(sum / (hi - lo + 1));
      }
    }

    // Vertical pass (tmp → src) using sliding window
    for (let x = 0; x < w; x++) {
      let sum = 0;
      for (let y = -r; y < h; y++) {
        if (y + r < h) sum += tmp[(y + r) * w + x];
        if (y - r - 1 >= 0) sum -= tmp[(y - r - 1) * w + x];
        const lo = Math.max(0, y - r), hi = Math.min(h - 1, y + r);
        if (y >= 0) src[y * w + x] = Math.round(sum / (hi - lo + 1));
      }
    }

    // Write back
    for (let i = 0; i < w * h; i++) data[i * 4 + 3] = src[i];
  }

  function runColorMatch() {
    const tolerance  = parseInt(document.getElementById('ctrl-tolerance').value, 10);
    const feathering = parseInt(document.getElementById('ctrl-feathering').value, 10);
    const threshold  = tolerance * 4.41; // map 0–100 → 0–441 (max RGB distance)

    const imageData = processingCtx.getImageData(
      0, 0, processingCanvas.width, processingCanvas.height
    );
    const data = imageData.data;
    const { r: pr, g: pg, b: pb } = pickedColor;

    for (let i = 0; i < data.length; i += 4) {
      const dr = data[i]   - pr;
      const dg = data[i+1] - pg;
      const db = data[i+2] - pb;
      if (Math.sqrt(dr*dr + dg*dg + db*db) <= threshold) {
        data[i+3] = 0; // transparent
      }
    }

    if (feathering > 0) {
      boxBlurAlpha(data, processingCanvas.width, processingCanvas.height, feathering);
    }

    const resultCanvas = document.createElement('canvas');
    resultCanvas.width  = processingCanvas.width;
    resultCanvas.height = processingCanvas.height;
    resultCanvas.getContext('2d').putImageData(imageData, 0, 0);
    resultCanvas.toBlob(blob => {
      setProcessLoading(false);
      displayResult(blob);
    }, 'image/png');
  }
  ```

- [ ] **Step 2: Verify in browser**

  Switch to Color Match mode. Load an image with a plain background. Click on the background to pick its colour. Adjust Tolerance if needed. Click Remove Background. Expected: background becomes transparent in the After panel. Try Feathering > 0 — edges should soften. Console: no errors.

- [ ] **Step 3: Commit**

  ```bash
  git add bg-remover.html
  git commit -m "feat: bg-remover Color Match with box blur feathering"
  ```

---

### Task 10: Result display, download, copy, final wiring

Add `displayResult`, `downloadPng`, `copyToClipboard`, `initResultActions`, complete the `DOMContentLoaded` block, and add Clipboard availability guard.

**Files:**
- Modify: `bg-remover.html` — `<script>` block

---

- [ ] **Step 1: Append result functions before `initSliders`**

  ```js
  // === RESULT DISPLAY & ACTIONS ===

  function displayResult(blob) {
    lastResultBlob = blob;

    // Revoke previous object URLs to free memory
    if (prevBeforeUrl) URL.revokeObjectURL(prevBeforeUrl);
    if (prevAfterUrl)  URL.revokeObjectURL(prevAfterUrl);

    prevBeforeUrl = URL.createObjectURL(currentImageFile);
    prevAfterUrl  = URL.createObjectURL(blob);

    document.getElementById('before-img').src = prevBeforeUrl;
    document.getElementById('after-img').src  = prevAfterUrl;

    document.getElementById('result-area').classList.remove('d-none');
    document.getElementById('cv-loading').classList.add('d-none');
    document.getElementById('result-panels').classList.remove('d-none');
  }

  function downloadPng() {
    if (!lastResultBlob) return;
    const url = URL.createObjectURL(lastResultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = stemName + '-no-bg.png';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyToClipboard() {
    if (!lastResultBlob) return;
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

  function initResultActions() {
    document.getElementById('btn-download').addEventListener('click', downloadPng);
    document.getElementById('btn-copy').addEventListener('click', copyToClipboard);

    // Hide copy button if Clipboard API is unavailable
    if (typeof ClipboardItem === 'undefined') {
      document.getElementById('btn-copy').style.display = 'none';
    }
  }
  ```

- [ ] **Step 2: Add `initResultActions()` to `DOMContentLoaded` and remove the placeholder comment**

  Find:
  ```js
    // initResultActions() — added in Task 10
  ```
  Replace with:
  ```js
    initResultActions();
  ```

  The final `DOMContentLoaded` block should read:
  ```js
  document.addEventListener('DOMContentLoaded', () => {
    initUploadZone();
    initModeSelector();
    initOpenCv();
    initPreviewListeners();
    initSliders();
    initProcessButton();
    initResultActions();
  });
  ```

- [ ] **Step 3: Verify full flow — Smart Removal**

  Open `bg-remover.html`. Load an image. Wait for engine (spinner disappears). Draw a rectangle. Click Remove Background. Expected:
  - Spinner on button while processing.
  - Before/After panels appear. After shows transparent background on checkerboard.
  - Download PNG → file downloads as `<filename>-no-bg.png`.
  - Copy to Clipboard → image is in clipboard (paste into an image editor to verify).

- [ ] **Step 4: Verify full flow — Color Match**

  Switch to Color Match. Load a product image with a white background. Click on the white area → swatch turns white. Click Remove Background. Expected: white pixels become transparent. Try Feathering = 3 → edges are softened.

- [ ] **Step 5: Verify mode switching**

  After a result: switch mode → result panels clear. Load a new image → previous result is gone. Confirm no JS errors throughout.

- [ ] **Step 6: Commit**

  ```bash
  git add bg-remover.html
  git commit -m "feat: bg-remover result display, download, copy to clipboard"
  ```

- [ ] **Step 7: Final commit and push**

  ```bash
  git push
  ```
