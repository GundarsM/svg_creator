# SVG Preview Zoom & Pan — Design Spec
**Date:** 2026-03-25
**File:** `converter.html` (in-place modifications only)

---

## Overview

Add zoom and pan to the SVG result preview in `converter.html`. The user can zoom via a slider and `[-]`/`[+]` buttons, and pan by click-dragging inside the preview area.

---

## Architecture

### DOM structure

The SVG element is wrapped in an inner `#svg-viewport` div inside the existing `#svg-preview-container`:

```html
<div id="svg-preview-container">
  <div id="convert-overlay">…</div>
  <div id="svg-viewport">
    <!-- SVG element injected here by displaySvgResult() -->
  </div>
</div>
```

`transform: translate(Xpx, Ypx) scale(Z)` is applied to `#svg-viewport` on every zoom or pan change. The SVG element itself has no `max-width`/`max-height` constraints — it renders at its natural pixel dimensions (its own `width`/`height` attributes).

`#svg-preview-container` is `overflow: hidden` with a fixed `min-height: 300px` (unchanged from current 500px cap, but expressed as min-height so very small SVGs don't collapse the container).

### State

Three module-level variables:

```js
let zoomLevel = 1.0;   // 0.25–4.0
let panX      = 0;     // px offset, applied via translate
let panY      = 0;     // px offset, applied via translate
```

**Persistence across conversions:** zoom and pan are kept when a new SVG result replaces the old one.

**Reset on image change:** when a new image is loaded (`loadImage()`), zoom/pan reset to `1.0 / 0 / 0`.

---

## Zoom Controls

### HTML

A `#zoom-controls` bar is placed between `#svg-preview-container` and the download bar. Hidden by default (`d-none`), shown when an SVG result exists (same lifecycle as download buttons).

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

### Behaviour

| Control | Effect |
|---------|--------|
| Slider drag | Sets `zoomLevel = value / 100`; updates label |
| `[−]` button | Decrements slider by 5 (min 25); fires same update |
| `[+]` button | Increments slider by 5 (max 400); fires same update |
| `[Reset]` | Sets zoom to 100%, pan to 0/0 |

Zoom is applied centered on the container's midpoint. The transform origin of `#svg-viewport` is set to `50% 50%` of the container (achieved by positioning the viewport absolutely centered, then applying scale from its own center: `transform-origin: 50% 50%`).

### Zoom label

Always shows the current integer percent: `"100%"`, `"75%"`, `"200%"`, etc.

---

## Pan

### Behaviour

Click-and-drag inside `#svg-preview-container` to pan.

- **Cursor:** `grab` when SVG is loaded and mouse is over the container; `grabbing` while dragging.
- **`mousedown`:** record `startMouseX`, `startMouseY`, `startPanX`, `startPanY`; set `isDragging = true`.
- **`mousemove`:** if `isDragging`, compute `panX = startPanX + (e.clientX - startMouseX)`, `panY = startPanY + (e.clientY - startMouseY)`; apply transform.
- **`mouseup` / `mouseleave`:** set `isDragging = false`.

No pan limits — the user can drag the SVG fully off-screen. The `[Reset]` button brings it back.

Touch support is out of scope.

---

## Transform application

A single helper applies both zoom and pan:

```js
function applyViewTransform() {
  const vp = document.getElementById('svg-viewport');
  if (!vp) return;
  vp.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomLevel})`;
}
```

Called on every zoom or pan update.

---

## Visibility lifecycle

`#zoom-controls` and `#svg-viewport` cursor are managed alongside the existing download button enable/disable logic:

| Event | Zoom controls | Cursor |
|-------|---------------|--------|
| SVG result displayed | Show (`d-none` removed) | `grab` |
| SVG result cleared | Hide (`d-none` added) | default |
| New image loaded | Hide; reset zoom+pan state | default |

---

## `displaySvgResult` changes

`displaySvgResult(svgStr)` currently appends the SVG directly to `#svg-preview-container`. It must instead:

1. Clear content (existing `clearSvgContent()`).
2. Create `#svg-viewport` div, append SVG inside it.
3. Remove `max-width`/`max-height` from the SVG element.
4. Append `#svg-viewport` to container.
5. Call `applyViewTransform()` (uses current zoom/pan state).
6. Show `#zoom-controls`.
7. Set container cursor to `grab`.

`clearSvgContent()` already preserves `#convert-overlay` — `#svg-viewport` is created fresh each time so no extra guard is needed.

---

## CSS changes

```css
#svg-preview-container {
  overflow: hidden;      /* was: auto */
  cursor: default;
}
#svg-viewport {
  transform-origin: 50% 50%;
  display: inline-block; /* sizes to SVG content */
}
```

The container needs `display: flex; align-items: center; justify-content: center` (already set) so `#svg-viewport` is centered before any pan offset.

---

## Out of Scope

- Mouse-wheel zoom
- Touch / pinch-to-zoom
- Zoom centered on cursor position (zoom is centered on container midpoint)
- Pan limits / boundary clamping
