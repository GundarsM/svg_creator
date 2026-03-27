# Brush Tools & Zoom — Design Spec
**Date:** 2026-03-27
**File:** `bg-remover.html` (in-place modifications only)

---

## Overview

Add brush-based mask editing and scroll-wheel zoom to the After panel of `bg-remover.html`. After a background removal result is shown, the user can zoom into the canvas and paint with an Erase or Restore brush to clean up the edges.

---

## File Structure

Single file `bg-remover.html`. All changes are in-place:
- HTML: replace `<img id="after-img">` with `<canvas id="after-canvas">` inside a new wrapper div; add brush toolbar; add `#brush-cursor` div.
- CSS: add styles for `#after-canvas-wrap`, `#after-canvas`, `#brush-cursor`, `.brush-btn.active`, `#zoom-label`.
- JS: add state variables; rewrite `displayResult`; rewrite `downloadPng`/`copyToClipboard` to use canvas; add `initBrushTools`.

---

## HTML Changes

### After panel

Replace:
```html
<div class="checkerboard">
  <img id="after-img" alt="Background removed">
</div>
```

With:
```html
<div id="after-canvas-wrap" class="checkerboard" style="position:relative;overflow:hidden;">
  <canvas id="after-canvas"></canvas>
  <span id="zoom-label"></span>
</div>
```

`#zoom-label` is absolutely positioned bottom-right of the wrap; shows current zoom as e.g. `1.0×`. Hidden when zoom is 1×.

### Brush toolbar

Inserted between the Before/After row and the Download/Copy buttons:

```html
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

`#brush-toolbar` is hidden (`d-none`) until the first result is displayed, then shown permanently for the session.

### Brush cursor

```html
<div id="brush-cursor"></div>
```

Appended just before `</body>`. Fixed-position, never in the document flow.

---

## CSS Changes (all scoped to `#bg-remover-wrapper` except `#brush-cursor`)

```css
#bg-remover-wrapper #after-canvas-wrap {
  position: relative;
  overflow: hidden;
}

#bg-remover-wrapper #after-canvas {
  width: 100%;
  max-width: 100%;
  max-height: 400px;
  display: block;
  border-radius: 6px;
  transform-origin: center center;
}

#bg-remover-wrapper #after-canvas.brush-active {
  cursor: none;
}

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

The existing `#bg-remover-wrapper #result-area img` rule is kept unchanged (it governs `#before-img`).

---

## State Variables

Added alongside existing state:

```js
let activeBrush = null;  // 'erase' | 'restore' | null
let brushSize   = 30;    // diameter in canvas pixels at 1× zoom
let isPainting  = false;
let zoomLevel   = 1.0;   // 1.0–8.0; CSS scale applied to #after-canvas
```

---

## `displayResult` Rewrite

`displayResult(blob, sourceFile)` is updated to:

1. Revoke `prevBeforeUrl`; create new one for `before-img`. (Same as before.)
2. Decode the blob into `#after-canvas`:
   ```js
   const url = URL.createObjectURL(blob);
   const img = new Image();
   img.onload = () => {
     URL.revokeObjectURL(url);
     ac.width  = img.naturalWidth;
     ac.height = img.naturalHeight;
     ac.getContext('2d').drawImage(img, 0, 0);
   };
   img.src = url;
   ```
3. Reset brush and zoom state:
   ```js
   activeBrush = null; isPainting = false; zoomLevel = 1.0;
   ac.style.transform = '';
   document.getElementById('zoom-label').style.display = 'none';
   document.getElementById('btn-brush-erase').classList.remove('active');
   document.getElementById('btn-brush-restore').classList.remove('active');
   ac.classList.remove('brush-active');
   ```
4. Show `#brush-toolbar` (remove `d-none`). Show result area / panels as before.

`prevAfterUrl` is no longer created or stored (the canvas holds the pixel data directly). The `prevAfterUrl` variable remains in state but is always `null` after this change; existing revocation guards (`if (prevAfterUrl)`) are harmless.

---

## Download & Copy

Both functions read from the canvas instead of `lastResultBlob`:

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

`lastResultBlob` is kept in state but no longer updated after brush strokes. Download and copy always export the current canvas state.

---

## `initBrushTools` Function

Called from `DOMContentLoaded`. Wires all brush and zoom interactions.

```js
function initBrushTools() {
  const ac     = document.getElementById('after-canvas');
  const wrap   = document.getElementById('after-canvas-wrap');
  const cursor = document.getElementById('brush-cursor');
  // … all handlers below close over ac, wrap, cursor …
}
```

### Brush button toggle

```js
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
```

### Size slider

```js
document.getElementById('ctrl-brush-size').addEventListener('input', () => {
  brushSize = parseInt(document.getElementById('ctrl-brush-size').value, 10);
  document.getElementById('val-brush-size').textContent = brushSize;
});
```

The cursor circle is resized live by the mousemove handler (see below).

### Canvas mouse events

Coordinate conversion via `getBoundingClientRect()` is used throughout — reliable regardless of CSS transform:

```js
function getCanvasCoords(e) {
  const rect = ac.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * (ac.width  / rect.width),
    y: (e.clientY - rect.top)  * (ac.height / rect.height),
  };
}
```

```js
ac.addEventListener('mousedown', (e) => {
  if (!activeBrush || !ac.width) return;
  isPainting = true;
  applyBrush(getCanvasCoords(e));
});
ac.addEventListener('mousemove', (e) => {
  if (!activeBrush) return;
  updateBrushCursor(e);
  if (isPainting) applyBrush(getCanvasCoords(e));
});
ac.addEventListener('mouseup',    () => { isPainting = false; });
ac.addEventListener('mouseleave', () => {
  isPainting = false;
  cursor.style.display = 'none';
});
ac.addEventListener('mouseenter', (e) => {
  if (activeBrush) { cursor.style.display = 'block'; updateBrushCursor(e); }
});
```

### Brush cursor positioning

The cursor div must be sized in screen pixels to match the brush footprint on the zoomed canvas:

```js
function updateBrushCursor(e) {
  const rect = ac.getBoundingClientRect();
  const screenRadius = brushSize * (rect.width / ac.width);
  cursor.style.width  = screenRadius * 2 + 'px';
  cursor.style.height = screenRadius * 2 + 'px';
  cursor.style.left   = e.clientX + 'px';
  cursor.style.top    = e.clientY + 'px';
}
```

### `applyBrush({ x, y })`

`x` and `y` are canvas pixel coordinates (post-conversion). `brushSize` is the radius in canvas pixels.

```js
function applyBrush({ x, y }) {
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
```

### Scroll-wheel zoom

Attached to `#after-canvas-wrap` (the container), not the canvas, so the full visible area is responsive:

```js
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
    label.textContent = zoomLevel.toFixed(1) + '×';
  }
}, { passive: false });
```

`passive: false` is required to allow `e.preventDefault()` inside a wheel listener.

---

## `initBrushTools` call site

Added to `DOMContentLoaded` after `initResultActions()`:

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

---

## Out of Scope

- Pan / drag to scroll when zoomed in
- Touch / pinch-to-zoom
- Undo / redo
- Brush opacity or hardness controls
- Zoom reset button (scroll back to 1× to reset)
