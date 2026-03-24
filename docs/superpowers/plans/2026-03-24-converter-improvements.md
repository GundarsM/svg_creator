# Converter Improvements Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve logo/line art tracing quality by swapping the potrace library; fix the loading overlay not showing in color mode; add spinners to EPS/DXF download buttons.

**Architecture:** All changes are in-place edits to `converter.html` — a single self-contained HTML file with no build system. Three independent tasks: (1) library swap + threshold binarisation, (2) one-line rAF yield fix, (3) HTML + JS download spinner.

**Tech Stack:** `wasm-potrace@0.4.1` (jsDelivr ESM), Bootstrap 5.3.0, Font Awesome 6.4.0, vanilla JS.

---

## Chunk 1: All Tasks

### Task 1: Replace potrace-wasm with wasm-potrace

This task swaps the logo/line art tracing engine from `potrace-wasm@1.0.4` (no options) to `wasm-potrace@0.4.1` (full options API), adds a pre-binarisation step so the threshold slider works, and removes two now-dead helper functions.

**Files:**
- Modify: `converter.html` — lines 23, 284–296 (STATE), 447–495 (engine functions), 504–518 (traceWithPotrace)

---

- [ ] **Step 1: Remove the potrace-wasm script tag**

  In `converter.html`, find and remove line 23 exactly:

  ```html
  <script src="https://cdn.jsdelivr.net/npm/potrace-wasm@1.0.4/index.js"></script>
  ```

  After removal, verify the line is gone and the surrounding HTML (lines 21–25) still looks clean.

- [ ] **Step 2: Add `potraceFn` state variable**

  In the `// === STATE ===` section (around line 295–296), add one line after `let potraceReady = false;`:

  Old:
  ```js
  let potraceReady    = false;     // set to true by initPotrace() in Task 6
  ```

  New:
  ```js
  let potraceReady    = false;     // set to true by initPotrace()
  let potraceFn       = null;      // assigned by initPotrace() on successful load
  ```

- [ ] **Step 3: Remove `rgbaToGray` and `makeGrayscaleCanvas` functions**

  Remove the entire `rgbaToGray` function (lines 467–478):
  ```js
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

  Remove the entire `makeGrayscaleCanvas` function (lines 484–495, accounting for any blank lines between them):
  ```js
  function makeGrayscaleCanvas() {
    const tmpCanvas = document.createElement('canvas');
    tmpCanvas.width  = canvasWidth;
    tmpCanvas.height = canvasHeight;
    const tmpCtx = tmpCanvas.getContext('2d');

    // Draw original image in grayscale using CSS filter
    tmpCtx.filter = 'grayscale(100%)';
    tmpCtx.drawImage(processingCanvas, 0, 0);
    tmpCtx.filter = 'none';
    return tmpCanvas;
  }
  ```

  Also remove any blank `// === POTRACE ENGINE ===` comment block separator that sits between them if it becomes orphaned.

- [ ] **Step 4: Rewrite `initPotrace`**

  Replace the entire `initPotrace` function body (lines 447–460):

  Old:
  ```js
  async function initPotrace() {
    try {
      if (typeof loadFromCanvas !== 'function') {
        throw new Error('loadFromCanvas not found');
      }
      // Mark engine as ready — loadFromCanvas is a plain global, no async init needed
      potraceReady = true;
    } catch (e) {
      console.error('potrace-wasm failed to initialise:', e);
      potraceReady = false;
      document.getElementById('lineart-engine-error').classList.remove('d-none');
    }
    updateConvertButtonState();
  }
  ```

  New:
  ```js
  async function initPotrace() {
    try {
      const mod = await import('https://cdn.jsdelivr.net/npm/wasm-potrace@0.4.1/dist/index.mjs');
      await mod.init();
      potraceFn    = mod.potrace;
      potraceReady = true;
    } catch (e) {
      console.error('wasm-potrace failed to initialise:', e);
      potraceReady = false;
      document.getElementById('lineart-engine-error').classList.remove('d-none');
    }
    updateConvertButtonState();
  }
  ```

- [ ] **Step 5: Rewrite `traceWithPotrace`**

  Replace the entire `traceWithPotrace` function (lines 504–518):

  Old:
  ```js
  async function traceWithPotrace() {
    if (!potraceReady) throw new Error('Potrace engine not ready');

    // Read control values (reserved for future API or pre-processing use)
    const threshold = parseInt(document.getElementById('ctrl-threshold').value, 10);
    const turdsize  = parseInt(document.getElementById('ctrl-turdsize').value, 10);
    const alphamax  = parseFloat(document.getElementById('ctrl-alphamax').value);
    const opticurve = document.getElementById('ctrl-opticurve').checked;

    const grayCanvas = makeGrayscaleCanvas();

    // loadFromCanvas(canvas) — v1.0.4 accepts no second options argument
    const svgStr = await loadFromCanvas(grayCanvas);
    return svgStr;
  }
  ```

  New:
  ```js
  async function traceWithPotrace() {
    if (!potraceReady) throw new Error('Potrace engine not ready');

    const threshold = parseInt(document.getElementById('ctrl-threshold').value, 10);
    const turdsize  = parseInt(document.getElementById('ctrl-turdsize').value, 10);
    const alphamax  = parseFloat(document.getElementById('ctrl-alphamax').value);
    const opticurve = document.getElementById('ctrl-opticurve').checked ? 1 : 0;

    // Pre-binarise: apply threshold to produce a binary RGBA Uint8ClampedArray.
    // wasm-potrace expects RGBA (4 bytes/pixel). Because the image is already fully
    // binarised here, potrace's internal threshold step is a no-op and the slider is exact.
    const imageData = processingCtx.getImageData(0, 0, canvasWidth, canvasHeight);
    const src    = imageData.data;
    const binary = new Uint8ClampedArray(src.length);
    for (let i = 0; i < src.length; i += 4) {
      const r = src[i], g = src[i + 1], b = src[i + 2], a = src[i + 3];
      const isWhite = a < 128 || (0.299 * r + 0.587 * g + 0.114 * b) >= threshold;
      const v = isWhite ? 255 : 0;
      binary[i] = v; binary[i + 1] = v; binary[i + 2] = v; binary[i + 3] = 255;
    }

    const svgStr = await potraceFn(
      { data: binary, width: canvasWidth, height: canvasHeight },
      { turdsize, alphamax, opticurve, opttolerance: 0.2 }
    );
    return svgStr;
  }
  ```

- [ ] **Step 6: Verify manually**

  Open `converter.html` in a browser. Switch to **Logo / Line Art** mode. The Convert button should show "Loading engine…" briefly while `wasm-potrace` initialises over the network, then become enabled.

  Load a logo image (PNG with a clear shape). Click Convert. Expected: clean vector output — fewer speckles than before, smoother curves. Move the Threshold slider and convert again — the output should visibly change (darker/lighter areas included). Move Noise removal and Corner sharpness sliders — output should change accordingly.

  If the browser console shows `Failed to fetch` or a CORS error for the jsDelivr import, this is a network/permissions issue, not a code bug.

- [ ] **Step 7: Commit**

  ```bash
  git add converter.html
  git commit -m "feat: replace potrace-wasm with wasm-potrace for full options support"
  ```

---

### Task 2: Fix loading overlay for color mode

In color mode, `traceWithImageTracer()` is synchronous. Without yielding to the browser between `setConvertLoading(true)` and the tracer call, the overlay is never painted before it is hidden again. Fix: add a `requestAnimationFrame` yield before the synchronous call only.

**Files:**
- Modify: `converter.html` — the click handler inside `initConvertButton` (around line 1154)

---

- [ ] **Step 1: Update the convert button click handler**

  Inside `initConvertButton`, find the click handler. Replace the current `try` block's first few lines:

  Old:
  ```js
    setConvertLoading(true);
    try {
      let svgStr;
      if (currentMode === 'color') {
        svgStr = traceWithImageTracer();
      } else {
        svgStr = await traceWithPotrace();
      }
  ```

  New:
  ```js
    setConvertLoading(true);
    try {
      let svgStr;
      if (currentMode === 'color') {
        await new Promise(r => requestAnimationFrame(r)); // yield so browser paints overlay
        svgStr = traceWithImageTracer();
      } else {
        svgStr = await traceWithPotrace(); // already async — overlay paints naturally
      }
  ```

- [ ] **Step 2: Verify manually**

  Open `converter.html`. Load any image. Switch to **Photo / Color** mode. Click Convert. The circular overlay spinner should appear over the preview area while tracing runs. Switch to **Logo / Line Art** mode and back to **Photo / Color** mode. Click Convert again — overlay must still appear (this was the bug: overlay stopped working after a mode switch).

- [ ] **Step 3: Commit**

  ```bash
  git add converter.html
  git commit -m "fix: yield via requestAnimationFrame before sync tracer so overlay paints"
  ```

---

### Task 3: Add spinners to EPS and DXF download buttons

EPS and DXF conversion is synchronous and can take several seconds on complex images. Add per-button spinner feedback so the page doesn't appear frozen.

**Files:**
- Modify: `converter.html` — download button HTML (lines 269–274) and `initDownloadButtons` function (lines 1052–1069)

---

- [ ] **Step 1: Update the EPS and DXF button HTML**

  Find the download bar in the HTML (lines 264–275). Replace the EPS and DXF buttons' inner content. SVG button is unchanged.

  Old:
  ```html
      <button class="btn btn-outline-light flex-fill" id="btn-dl-eps" disabled>
        <i class="fa fa-download me-1"></i> Download EPS
      </button>
      <button class="btn btn-outline-light flex-fill" id="btn-dl-dxf" disabled>
        <i class="fa fa-download me-1"></i> Download DXF
      </button>
  ```

  New:
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

- [ ] **Step 2: Add `runDownload` helper function**

  Add the following function immediately before `initDownloadButtons`.

  Note: the spec's JS snippet shows only `try/finally` with no `catch`, but the spec's Error Handling table requires `alert()` on throw. The `catch` block below is intentional — it satisfies the Error Handling table. Do not remove it.

  ```js
  async function runDownload(btnId, spinnerId, iconId, buildFn, filename, mime) {
    const btn     = document.getElementById(btnId);
    const spinner = document.getElementById(spinnerId);
    const icon    = document.getElementById(iconId);
    btn.disabled = true;
    spinner.classList.remove('d-none');
    icon.classList.add('d-none');
    await new Promise(r => requestAnimationFrame(r)); // yield so browser paints spinner
    try {
      const content = buildFn();
      triggerDownload(content, filename, mime);
    } catch (e) {
      // Spec Error Handling table: "EPS/DXF conversion throws → alert() with error message"
      alert('Download failed: ' + e.message);
      console.error(e);
    } finally {
      btn.disabled = false;
      spinner.classList.add('d-none');
      icon.classList.remove('d-none');
    }
  }
  ```

- [ ] **Step 3: Rewrite `initDownloadButtons`**

  Replace the entire `initDownloadButtons` function:

  Old:
  ```js
  function initDownloadButtons() {
    document.getElementById('btn-dl-svg').addEventListener('click', () => {
      if (!lastSvgResult) return;
      triggerDownload(lastSvgResult, lastStemName + '.svg', 'image/svg+xml');
    });

    document.getElementById('btn-dl-eps').addEventListener('click', () => {
      if (!lastSvgResult) return;
      const eps = svgToEps(lastSvgResult);
      triggerDownload(eps, lastStemName + '.eps', 'application/postscript');
    });

    document.getElementById('btn-dl-dxf').addEventListener('click', () => {
      if (!lastSvgResult) return;
      const dxf = svgToDxf(lastSvgResult);
      triggerDownload(dxf, lastStemName + '.dxf', 'application/dxf');
    });
  }
  ```

  New:
  ```js
  function initDownloadButtons() {
    document.getElementById('btn-dl-svg').addEventListener('click', () => {
      if (!lastSvgResult) return;
      triggerDownload(lastSvgResult, lastStemName + '.svg', 'image/svg+xml');
    });

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
  }
  ```

- [ ] **Step 4: Verify manually**

  Open `converter.html`. Load a complex color image. Click **Convert** (Photo/Color mode). Once complete, click **Download EPS**. Expected: the Download EPS button briefly shows a spinner and disables while the EPS is being generated, then the download window opens and the button returns to normal. Repeat for **Download DXF**. SVG download should be instant with no spinner (unchanged).

- [ ] **Step 5: Commit**

  ```bash
  git add converter.html
  git commit -m "feat: add spinner feedback to EPS and DXF download buttons"
  ```
