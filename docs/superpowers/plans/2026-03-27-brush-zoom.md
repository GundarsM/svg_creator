# Brush Tools & Zoom Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Erase/Restore brush tools and scroll-wheel zoom to the After panel of `bg-remover.html`.

**Architecture:** The `<img id="after-img">` is replaced by `<canvas id="after-canvas">` so brush strokes paint directly onto pixel data. Zoom is CSS `transform: scale()` on the canvas; brush coordinates are converted via `getBoundingClientRect()` so they stay accurate through any scale. Download and copy always export the current canvas state.

**Tech Stack:** Vanilla JS, HTML5 Canvas API (compositing ops), CSS transform, no build system.

**Spec:** `docs/superpowers/specs/2026-03-27-brush-zoom-design.md`

---

## Chunk 1: HTML, CSS, and structural wiring

### Task 1: HTML — replace after-img with canvas, add brush toolbar and cursor div

**Files:**
- Modify: `bg-remover.html` — HTML section (lines ~258–272)

---

- [ ] **Step 1: Replace the after panel `<img>` with a canvas wrapped in a positioned div**

  Find:
  ```html
          <div class="checkerboard">
            <img id="after-img" alt="Background removed">
          </div>
  ```

  Replace with:
  ```html
          <div id="after-canvas-wrap" class="checkerboard" style="position:relative;overflow:hidden;">
            <canvas id="after-canvas"></canvas>
            <span id="zoom-label"></span>
          </div>
  ```

- [ ] **Step 2: Insert the brush toolbar between the Before/After row and the Download/Copy buttons**

  Find:
  ```html
          <div class="d-flex gap-2 flex-wrap">
            <button class="btn btn-outline-light flex-fill" id="btn-download">
  ```

  Insert immediately before it:
  ```html
          <!-- Brush toolbar (hidden until first result) -->
          <div id="brush-toolbar" class="d-none d-flex align-items-center gap-2 flex-wrap mb-2 mt-1">
            <button class="mode-btn brush-btn" id="btn-brush-erase">
              <i class="fa fa-eraser me-1"></i> Erase
            </button>
            <button class="mode-btn brush-btn" id="btn-brush-restore">
              <i class="fa fa-paintbrush me-1"></i> Restore
            </button>
            <div class="d-flex align-items-center gap-2 flex-fill ms-2">
              <span class="control-label mb-0" style="white-space:nowrap">
                Size <span id="val-brush-size">30</span>px
              </span>
              <input type="range" class="form-range flex-fill"
                     id="ctrl-brush-size" min="5" max="150" value="30" step="1">
            </div>
          </div>

  ```

- [ ] **Step 3: Add the brush cursor div just before `</body>`**

  Find:
  ```html
  </body>
  ```

  Insert immediately before it:
  ```html
  <div id="brush-cursor"></div>
  ```

- [ ] **Step 4: Verify HTML structure**

  Open `bg-remover.html` in a browser. Before loading any image:
  - After panel shows checkerboard background with no image (canvas is 0×0).
  - Brush toolbar is not visible.
  - No JS errors in console.

- [ ] **Step 5: Commit**

  ```bash
  git add bg-remover.html
  git commit -m "feat: replace after-img with canvas, add brush toolbar and cursor div"
  ```

---

### Task 2: CSS — add canvas, brush cursor, zoom label, and brush button styles

**Files:**
- Modify: `bg-remover.html` — `<style>` block (after the existing `.checkerboard` rule)

---

- [ ] **Step 1: Add the new CSS rules after the `.checkerboard` rule**

  Find:
  ```css
      #bg-remover-wrapper .checkerboard {
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
  ```

  Insert immediately after it:
  ```css

      /* After canvas + brush/zoom UI */
      #bg-remover-wrapper #after-canvas {
        width: 100%;
        max-width: 100%;
        max-height: 400px;
        display: block;
        border-radius: 6px;
        transform-origin: center center;
      }
      #bg-remover-wrapper #after-canvas.brush-active { cursor: none; }
      #bg-remover-wrapper #zoom-label {
        position: absolute;
        bottom: 6px;
        right: 8px;
        font-size: 0.75rem;
        color: rgba(255,255,255,0.7);
        background: rgba(0,0,0,0.4);
        padding: 1px 5px;
        border-radius: 3px;
        pointer-events: none;
        display: none;
      }
      #bg-remover-wrapper .brush-btn.active {
        background: rgba(255,255,255,0.25);
        border-color: white;
      }
      #brush-cursor {
        position: fixed;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 1px rgba(0,0,0,0.6);
        pointer-events: none;
        display: none;
        transform: translate(-50%, -50%);
        z-index: 9999;
      }
  ```

- [ ] **Step 2: Verify CSS in browser**

  Open `bg-remover.html`. Run a removal so the result panels appear. Expected:
  - After panel canvas renders at column width (not full natural resolution).
  - Brush toolbar buttons look like the mode buttons (same pill style).
  - No visual regressions on other panels.

- [ ] **Step 3: Commit**

  ```bash
  git add bg-remover.html
  git commit -m "feat: add CSS for after-canvas, brush cursor, zoom label, brush buttons"
  ```

---

## Chunk 2: JS — state, displayResult, download, copy, initBrushTools

### Task 3: JS state variables + rewrite displayResult, downloadPng, copyToClipboard

**Files:**
- Modify: `bg-remover.html` — `<script>` block

---

- [ ] **Step 1: Add brush and zoom state variables to the STATE section**

  Find:
  ```js
  // Drag state for rect drawing (Smart mode)
  let rectDrawing = false;
  ```

  Insert immediately before it:
  ```js
  // Brush / zoom state
  let activeBrush = null;  // 'erase' | 'restore' | null
  let brushSize   = 30;    // diameter in canvas pixels at 1× zoom
  let isPainting  = false;
  let zoomLevel   = 1.0;   // 1.0–8.0; CSS scale applied to #after-canvas

  ```

- [ ] **Step 2: Rewrite `displayResult`**

  Find and replace the entire function:

  Old:
  ```js
  function displayResult(blob, sourceFile) {
    lastResultBlob = blob;

    // Revoke previous object URLs to free memory
    if (prevBeforeUrl) URL.revokeObjectURL(prevBeforeUrl);
    if (prevAfterUrl)  URL.revokeObjectURL(prevAfterUrl);

    prevBeforeUrl = URL.createObjectURL(sourceFile);
    prevAfterUrl  = URL.createObjectURL(blob);

    document.getElementById('before-img').src = prevBeforeUrl;
    document.getElementById('after-img').src  = prevAfterUrl;

    document.getElementById('result-area').classList.remove('d-none');
    document.getElementById('cv-loading').classList.add('d-none');
    document.getElementById('result-panels').classList.remove('d-none');
  }
  ```

  New:
  ```js
  function displayResult(blob, sourceFile) {
    lastResultBlob = blob;

    // Before image
    if (prevBeforeUrl) URL.revokeObjectURL(prevBeforeUrl);
    prevBeforeUrl = URL.createObjectURL(sourceFile);
    document.getElementById('before-img').src = prevBeforeUrl;

    // After: draw blob into canvas
    if (prevAfterUrl) { URL.revokeObjectURL(prevAfterUrl); prevAfterUrl = null; }
    const ac  = document.getElementById('after-canvas');
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      ac.width  = img.naturalWidth;
      ac.height = img.naturalHeight;
      ac.getContext('2d').drawImage(img, 0, 0);
    };
    img.src = url;

    // Reset brush and zoom state
    activeBrush = null; isPainting = false; zoomLevel = 1.0;
    ac.style.transform = '';
    document.getElementById('zoom-label').style.display = 'none';
    document.getElementById('btn-brush-erase').classList.remove('active');
    document.getElementById('btn-brush-restore').classList.remove('active');
    ac.classList.remove('brush-active');

    // Show brush toolbar and result panels
    document.getElementById('brush-toolbar').classList.remove('d-none');
    document.getElementById('result-area').classList.remove('d-none');
    document.getElementById('cv-loading').classList.add('d-none');
    document.getElementById('result-panels').classList.remove('d-none');
  }
  ```

- [ ] **Step 3: Rewrite `downloadPng`**

  Find and replace the entire function:

  Old:
  ```js
  function downloadPng() {
    if (!lastResultBlob) return;
    const url = URL.createObjectURL(lastResultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = stemName + '-no-bg.png';
    a.click();
    URL.revokeObjectURL(url);
  }
  ```

  New:
  ```js
  function downloadPng() {
    const ac = document.getElementById('after-canvas');
    if (!ac.width) return;
    ac.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = stemName + '-no-bg.png';
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }
  ```

- [ ] **Step 4: Rewrite `copyToClipboard`**

  Find and replace the entire function:

  Old:
  ```js
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
  ```

  New:
  ```js
  async function copyToClipboard() {
    const ac = document.getElementById('after-canvas');
    if (!ac.width) return;
    document.getElementById('copy-error').classList.add('d-none');
    ac.toBlob(async blob => {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      } catch (e) {
        document.getElementById('copy-error').textContent = 'Copy failed: ' + e.message;
        document.getElementById('copy-error').classList.remove('d-none');
      }
    }, 'image/png');
  }
  ```

- [ ] **Step 5: Verify in browser**

  Run a removal. Expected:
  - Before/After panels both show images.
  - Download PNG works (verify the downloaded file has a transparent background).
  - Copy to Clipboard works (paste into an image editor to verify).
  - Brush toolbar appears below the panels.
  - Run removal again — brush toolbar stays visible, after canvas refreshes.

- [ ] **Step 6: Commit**

  ```bash
  git add bg-remover.html
  git commit -m "feat: rewrite displayResult to use canvas; update download and copy to export from canvas"
  ```

---

### Task 4: initBrushTools — brush buttons, size slider, canvas mouse events, applyBrush, zoom

**Files:**
- Modify: `bg-remover.html` — `<script>` block

---

- [ ] **Step 1: Add `initBrushTools` before the `=== INIT ===` section**

  Find:
  ```js
  // === INIT ===
  document.addEventListener('DOMContentLoaded', () => {
  ```

  Insert immediately before it:
  ```js
  // === BRUSH TOOLS ===

  function applyBrush(ac, { x, y }) {
    const ctx = ac.getContext('2d');
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.clip();

    if (activeBrush === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'black';
      ctx.fill();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(processingCanvas, 0, 0, ac.width, ac.height);
    }

    ctx.restore();
  }

  function initBrushTools() {
    const ac     = document.getElementById('after-canvas');
    const wrap   = document.getElementById('after-canvas-wrap');
    const cursor = document.getElementById('brush-cursor');

    // Brush button toggles
    ['btn-brush-erase', 'btn-brush-restore'].forEach(id => {
      document.getElementById(id).addEventListener('click', () => {
        const mode = id === 'btn-brush-erase' ? 'erase' : 'restore';
        if (activeBrush === mode) {
          activeBrush = null;
          document.getElementById(id).classList.remove('active');
          ac.classList.remove('brush-active');
        } else {
          activeBrush = mode;
          document.getElementById('btn-brush-erase').classList.toggle('active', mode === 'erase');
          document.getElementById('btn-brush-restore').classList.toggle('active', mode === 'restore');
          ac.classList.add('brush-active');
        }
      });
    });

    // Size slider
    document.getElementById('ctrl-brush-size').addEventListener('input', () => {
      brushSize = parseInt(document.getElementById('ctrl-brush-size').value, 10);
      document.getElementById('val-brush-size').textContent = brushSize;
    });

    // Coordinate helper: screen → canvas pixels (accounts for CSS transform)
    function getCanvasCoords(e) {
      const rect = ac.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) * (ac.width  / rect.width),
        y: (e.clientY - rect.top)  * (ac.height / rect.height),
      };
    }

    // Cursor sizing helper
    function updateBrushCursor(e) {
      const rect = ac.getBoundingClientRect();
      const screenDiam = brushSize * (rect.width / ac.width) * 2;
      cursor.style.width  = screenDiam + 'px';
      cursor.style.height = screenDiam + 'px';
      cursor.style.left   = e.clientX + 'px';
      cursor.style.top    = e.clientY + 'px';
    }

    // Canvas mouse events
    ac.addEventListener('mousedown', (e) => {
      if (!activeBrush || !ac.width) return;
      isPainting = true;
      applyBrush(ac, getCanvasCoords(e));
    });
    ac.addEventListener('mousemove', (e) => {
      if (!activeBrush) return;
      updateBrushCursor(e);
      if (isPainting) applyBrush(ac, getCanvasCoords(e));
    });
    ac.addEventListener('mouseup', () => { isPainting = false; });
    ac.addEventListener('mouseleave', () => {
      isPainting = false;
      cursor.style.display = 'none';
    });
    ac.addEventListener('mouseenter', (e) => {
      if (activeBrush) { cursor.style.display = 'block'; updateBrushCursor(e); }
    });

    // Scroll-wheel zoom (attached to wrap so the whole checkerboard area responds)
    wrap.addEventListener('wheel', (e) => {
      if (!ac.width) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      zoomLevel = Math.min(8.0, Math.max(1.0, zoomLevel + delta));
      ac.style.transform = zoomLevel === 1.0 ? '' : `scale(${zoomLevel})`;
      const label = document.getElementById('zoom-label');
      if (zoomLevel === 1.0) {
        label.style.display = 'none';
      } else {
        label.style.display = 'block';
        label.textContent = zoomLevel.toFixed(1) + '\u00d7';
      }
    }, { passive: false });
  }

  ```

- [ ] **Step 2: Add `initBrushTools()` to the `DOMContentLoaded` block**

  Find:
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

  Replace with:
  ```js
  document.addEventListener('DOMContentLoaded', () => {
    initUploadZone();
    initModeSelector();
    initOpenCv();
    initPreviewListeners();
    initSliders();
    initProcessButton();
    initResultActions();
    initBrushTools();
  });
  ```

- [ ] **Step 3: Verify Erase brush**

  Load an image. Run removal. Click **Erase**. Paint over the after canvas.
  Expected:
  - Circular white cursor follows mouse; size matches slider value.
  - Painted area becomes transparent (checkerboard shows through).
  - Download PNG — erased areas are transparent in the file.

- [ ] **Step 4: Verify Restore brush**

  Click **Restore**. Paint over an erased area.
  Expected:
  - Original image pixels return within the brush circle.
  - Circular cursor is still shown and sized correctly.

- [ ] **Step 5: Verify brush toggle**

  Click the active brush button again.
  Expected:
  - Button deactivates (no highlight), cursor stops showing, normal cursor resumes.

- [ ] **Step 6: Verify scroll-wheel zoom**

  Scroll up over the after canvas.
  Expected:
  - Image scales up (up to 8×). Zoom label (e.g. `1.5×`) appears bottom-right.
  - Brush cursor scales with zoom (same visual circle size represents same canvas pixels).
  - Scroll back to 1× — zoom label disappears.
  - Page does not scroll while cursor is over the after panel.

- [ ] **Step 7: Verify re-process resets zoom and brush**

  While zoomed in with a brush active, click Remove Background again.
  Expected:
  - Zoom resets to 1× (label gone, canvas at normal size).
  - Brush buttons deactivate.
  - New result appears in canvas correctly.

- [ ] **Step 8: Commit**

  ```bash
  git add bg-remover.html
  git commit -m "feat: brush erase/restore and scroll-wheel zoom on after canvas"
  ```

- [ ] **Step 9: Push**

  ```bash
  git push
  ```
