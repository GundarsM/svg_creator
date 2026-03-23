# Image-to-Vector Converter — Design Spec
**Date:** 2026-03-23
**Output file:** `converter.html` (single self-contained HTML file, same pattern as `editor.js`)
**Approach:** Hybrid — two tracing engines, shared export layer

---

## Deployment Context

Embedded on the HillSpring Crafts website the same way as `editor.js` — a single self-contained HTML file, no server required. All processing runs entirely in the browser.

Same stack as `editor.js`: Bootstrap 5, Font Awesome 6, Google Fonts, inline CSS and JS.

---

## Architecture

Three CDN libraries:

- **ImageTracer.js** (jsDelivr CDN) — pure-JS color image tracing for Photo/Color mode
- **potrace-wasm** (jsDelivr CDN) — Potrace compiled to WebAssembly for Logo/Line Art mode
- **SVG → EPS / SVG → DXF converters** — written inline; no extra CDN dependency

A hidden `<canvas>` element acts as the image processing scratch pad. All tracing engines read from `ImageData` extracted from this canvas.

---

## UI Layout (top to bottom)

1. **Mode selector** — full-width toggle: `Photo / Color` | `Logo / Line Art`. Switching mode resets the control panel but preserves the loaded image.

2. **Upload zone** — drag-and-drop area + file picker button. Accepts JPG and PNG only. Shows original image thumbnail below it once loaded.

3. **Control panel** — full-width, mode-dependent:
   - *Photo / Color mode:* Color count (2–32), blur radius, stroke width, line smoothing
   - *Logo / Line Art mode:* B&W threshold, noise removal (turdsize), corner sharpness (alphamax), curve optimization toggle

4. **Convert button** — prominent full-width action button. Conversion runs on click (not auto) to avoid slow re-renders on large images.

5. **SVG result preview** — full-width display of the vectorized SVG output.

6. **Download bar** — three side-by-side buttons: **Download SVG**, **Download EPS**, **Download DXF**. Disabled until a successful conversion exists.

---

## Data Flow

1. User uploads JPG or PNG → drawn to hidden `<canvas>` → `ImageData` extracted.
2. If image exceeds 4 megapixels, it is automatically downscaled before drawing; a notice is shown.
3. User adjusts controls → clicks **Convert**.
4. Active mode determines the engine:
   - **Photo / Color:** `ImageTracer.js` traces the `ImageData` directly → SVG string
   - **Logo / Line Art:** canvas converts image to grayscale → `potrace-wasm` traces it → SVG string
5. SVG string is injected into the result preview panel.
6. Download buttons become enabled.

### Download formats

| Format | Method |
|--------|--------|
| SVG | Blob download of the SVG string as-is |
| EPS | SVG `<path>` `d` attributes parsed; coordinates converted to PostScript path commands; wrapped in standard EPS header/footer |
| DXF | SVG `<path>` `d` attributes parsed; Bézier curves approximated as polylines; written as DXF `LWPOLYLINE` entities (R2010 format, compatible with laser cutters and vinyl cutters) |

Downloaded filenames derive from the source image: `logo.jpg` → `logo.svg`, `logo.eps`, `logo.dxf`.

**Known limitation:** EPS and DXF conversion is path-based. Very complex photos produce large files. This is inherent to the format conversion, not a defect.

---

## Error Handling

| Condition | Behaviour |
|-----------|-----------|
| Image > 4MP | Auto-downscale before tracing; inline notice shown |
| Potrace WASM fails to load | Logo/Line Art mode shows error; Convert button disabled |
| No image loaded | Convert and Download buttons disabled |
| Unsupported file type | Inline error on upload zone |
| Tracing produces no paths | Message: "No paths found — try adjusting the threshold or color count" |

---

## Out of Scope

- Server-side processing
- Batch conversion (multiple files at once)
- Editing the vector result before download
- Formats beyond SVG, EPS, DXF
