# SVG Preview Zoom & Pan — Design Spec
**Date:** 2026-03-25
**File:** `converter.html` (in-place modifications only)

---

## Overview

Add zoom and pan to the SVG result preview in `converter.html`. The user can zoom via a slider and `[-]`/`[+]` buttons, and pan by click-dragging inside the preview area.

---

## Architecture

### DOM structure

The SVG element is wrapped in an inner `#svg-viewport` div inside the existing `#svg-preview-container`. `#svg-viewport` is a normal flex child (not absolutely positioned):

```html
<div id="svg-preview-container">
  <div id="convert-overlay">…</div>
  <!-- #svg-preview-placeholder lives here when no result -->
  <!-- #svg-viewport is created by displaySvgResult() and replaces the placeholder -->
  <div id="svg-viewport">
    <!-- SVG element injected here -->
  </div>
</div>
```

`clearSvgContent()` (the existing low-level helper) already removes all non-overlay children, including the placeholder span, before `displaySvgResult()` creates `#svg-viewport`. So `#svg-viewport` is always the only non-overlay child after `displaySvgResult()` runs. No extra guard is needed.

`transform: translate(Xpx, Ypx) scale(Z)` is applied to `#svg-viewport`. The SVG element itself has no `max-width`/`max-height` constraints — it renders at its natural pixel dimensions.

`#svg-preview-container` keeps its existing `min-height: 200px` (unchanged), `overflow` changes from `auto` to `hidden`.

### State

Three module-level variables (added alongside the existing `potraceReady`, `lastSvgResult` etc.):

```js
let zoomLevel = 1.0;   // 0.25–4.0; slider range 25–400
let panX      = 0;     // px translate offset
let panY      = 0;     // px translate offset
```

**Persistence across conversions:** zoom and pan are kept when a new SVG result replaces the old one (do not reset in `displaySvgResult`).

**Reset on image change:** in `clearSvgResult()` — the function called when a new image is loaded — add `zoomLevel = 1.0; panX = 0; panY = 0;` and hide `#zoom-controls`. `clearSvgResult()` is the correct hook (not `clearSvgContent()`): it also resets `lastSvgResult`, re-adds the placeholder, and disables download buttons.

---

## Zoom Controls

### HTML

A `#zoom-controls` bar is placed immediately after `#svg-preview-container` and before the download bar. Hidden by default (`d-none`), shown when an SVG result exists.

```html
<div id="zoom-controls" class="d-none d-flex align-items-center gap-2 mb-3">
  <button id="btn-zoom-out" class="btn btn-sm btn-outline-secondary">−</button>
  <input type="range" id="zoom-slider" min="25" max="400" step="5" value="100"
         class="form-range flex-fill">
  <button id="btn-zoom-in"  class="btn btn-sm btn-outline-secondary">+</button>
  <span id="zoom-label" class="text-muted small" style="min-width:3.5em;text-align:right">100%</span>
  <button id="btn-zoom-reset" class="btn btn-sm btn-outline-secondary">Reset</button>
</div>
```

### setZoom helper

All zoom changes go through a single `setZoom(level)` function to keep the slider, label, state, and transform in sync:

```js
function setZoom(level) {
  zoomLevel = Math.min(4.0, Math.max(0.25, level));
  const pct = Math.round(zoomLevel * 100);
  document.getElementById('zoom-slider').value = pct;
  document.getElementById('zoom-label').textContent = pct + '%';
  applyViewTransform();
}
```

### Control behaviour

| Control | Action |
|---------|--------|
| Slider `input` event | `setZoom(slider.value / 100)` |
| `[−]` button | `setZoom(zoomLevel - 0.05)` |
| `[+]` button | `setZoom(zoomLevel + 0.05)` |
| `[Reset]` button | `panX = 0; panY = 0; setZoom(1.0)` |

`[-]`/`[+]` call `setZoom()` directly — they do not dispatch synthetic events on the slider.

### Zoom centering

`#svg-viewport` is a flex child of `#svg-preview-container` (which uses `display:flex; align-items:center; justify-content:center`). `transform-origin: 50% 50%` is set on `#svg-viewport`. This means scale is applied from the viewport div's own center.

- When the SVG is **smaller** than the container: the flex layout centers `#svg-viewport`; scaling from its center keeps the image centered in the container. Zoom in/out feels centered.
- When the SVG is **larger** than the container: the flex child is still centered (overflow hidden), and scaling from the child's center provides consistent behavior. The user can then pan to see edges.

---

## Pan

### State

One additional drag-tracking variable (not persisted, local to the event handlers):

```js
let isDragging  = false;
let dragStartX  = 0;
let dragStartY  = 0;
let dragStartPanX = 0;
let dragStartPanY = 0;
```

### Event listeners (attached to `#svg-preview-container`)

- **`mousedown`:** `isDragging = true`; record `dragStartX/Y = e.clientX/Y`; record `dragStartPanX/Y = panX/Y`.
- **`mousemove`:** if `isDragging`, set `panX = dragStartPanX + (e.clientX - dragStartX)`, `panY = dragStartPanY + (e.clientY - dragStartY)`; call `applyViewTransform()`.
- **`mouseup`:** `isDragging = false`.
- **`mouseleave`** (on `#svg-preview-container`): `isDragging = false`. This stops the drag when the cursor leaves the container. Fast movement can exit the container, which is an acceptable trade-off given the simple use case. No `document`-level listeners are needed.

### Cursor

```js
// When SVG result is shown:
container.style.cursor = 'grab';

// On mousedown:
container.style.cursor = 'grabbing';

// On mouseup / mouseleave:
container.style.cursor = 'grab';

// When SVG result is cleared:
container.style.cursor = '';
```

No pan boundary clamping — the user can drag the SVG fully off-screen. `[Reset]` brings it back.

---

## Transform application

```js
function applyViewTransform() {
  const vp = document.getElementById('svg-viewport');
  if (!vp) return;
  vp.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
}
```

Called by `setZoom()` and by pan `mousemove`.

---

## Visibility lifecycle

| Event | Zoom controls | Cursor on container |
|-------|---------------|---------------------|
| `displaySvgResult()` called | Show (remove `d-none`) | `grab` |
| `clearSvgResult()` called | Hide (add `d-none`); reset `zoomLevel/panX/panY` | `''` (default) |

`clearSvgResult()` is the single place that resets zoom/pan state and hides controls. `displaySvgResult()` does not reset state.

---

## `displaySvgResult` changes

Replace the current implementation:

```js
function displaySvgResult(svgStr) {
  const container = clearSvgContent();           // removes placeholder, keeps overlay
  const tmp = document.createElement('div');
  tmp.innerHTML = svgStr;
  const svgEl = tmp.querySelector('svg');
  if (svgEl) {
    svgEl.style.maxWidth  = '';                  // remove constraints — natural size
    svgEl.style.maxHeight = '';
    const vp = document.createElement('div');
    vp.id = 'svg-viewport';
    vp.appendChild(svgEl);
    container.appendChild(vp);
    applyViewTransform();                        // apply current zoom/pan (persisted)
    document.getElementById('zoom-controls').classList.remove('d-none');
    container.style.cursor = 'grab';
  }
}
// Note: setDownloadButtonsEnabled(true) is called by the convert button handler
// immediately after displaySvgResult() — it is not called inside displaySvgResult itself.
// This is unchanged from the existing code.
```

---

## CSS changes

```css
#svg-preview-container {
  overflow: hidden;           /* was: auto */
  /* all other existing rules unchanged */
}

#svg-viewport {
  transform-origin: 50% 50%;
  display: inline-block;      /* sizes to SVG natural dimensions */
}

/* Remove the existing rule: */
/* #svg-preview-container svg { max-width: 100%; max-height: 500px; } */
```

The `#svg-preview-container svg` rule is removed entirely (the SVG's size is now controlled by its own `width`/`height` attributes, not CSS).

---

## initZoomControls function

All zoom/pan event listeners are wired in a new `initZoomControls()` function, called from `DOMContentLoaded` alongside the other `init*` functions:

```js
function initZoomControls() {
  const container = document.getElementById('svg-preview-container');
  const slider    = document.getElementById('zoom-slider');

  slider.addEventListener('input', () => setZoom(slider.value / 100));
  document.getElementById('btn-zoom-out').addEventListener('click', () => setZoom(zoomLevel - 0.05));
  document.getElementById('btn-zoom-in' ).addEventListener('click', () => setZoom(zoomLevel + 0.05));
  document.getElementById('btn-zoom-reset').addEventListener('click', () => {
    panX = 0; panY = 0; setZoom(1.0);
  });

  container.addEventListener('mousedown', (e) => {
    if (!document.getElementById('svg-viewport')) return;
    isDragging = true;
    dragStartX = e.clientX; dragStartY = e.clientY;
    dragStartPanX = panX;   dragStartPanY = panY;
    container.style.cursor = 'grabbing';
  });
  container.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    panX = dragStartPanX + (e.clientX - dragStartX);
    panY = dragStartPanY + (e.clientY - dragStartY);
    applyViewTransform();
  });
  container.addEventListener('mouseup',    () => { isDragging = false; if (document.getElementById('svg-viewport')) container.style.cursor = 'grab'; });
  container.addEventListener('mouseleave', () => { isDragging = false; if (document.getElementById('svg-viewport')) container.style.cursor = 'grab'; });
}
```

---

## Out of Scope

- Mouse-wheel zoom
- Touch / pinch-to-zoom
- Zoom centered on cursor position
- Pan boundary clamping
