# Image-to-Vector Converter — Design Spec
**Date:** 2026-03-23
**Output file:** `converter.html` (single self-contained HTML file, same pattern as `editor.js`)
**Approach:** Hybrid — two tracing engines, shared export layer

---

## Deployment Context

Embedded on the HillSpring Crafts website the same way as `editor.js` — a single self-contained HTML file, no server required. All processing runs entirely in the browser.

Same stack as `editor.js`: Bootstrap 5.3.0, Font Awesome 6.4.0, Google Fonts, inline CSS and JS. Bootstrap is loaded inside a CSS layer (`@import ... layer(bootstrap)`) so Squarespace's own styles always win — same technique as `editor.js`.

---

## Architecture

Three CDN libraries loaded via `<script>` tags with pinned versions:

- **ImageTracer.js v1.2.6** — `https://cdn.jsdelivr.net/npm/imagetracer@1.2.6/imagetracer_v1.2.6.js` — pure-JS color image tracing for Photo/Color mode
- **potrace-wasm** — npm package `potrace-wasm`. The implementation step must: (1) look up the current stable version on npmjs.com/package/potrace-wasm, (2) verify the factory function name and trace API match the usage described below, and (3) pin the exact version in the `<script>` tag (e.g. `https://cdn.jsdelivr.net/npm/potrace-wasm@{verified-version}/dist/potrace-wasm.js`). `@latest` must not appear in the shipped file. Acceptance criterion: the pinned version exposes an async initialiser and a synchronous or async trace function that accepts grayscale pixel data and returns an SVG string.
- **SVG → EPS / SVG → DXF converters** — written inline; no extra CDN dependency

A hidden `<canvas>` element acts as the image processing scratch pad. All tracing engines read from `ImageData` extracted from this canvas.

**Input restriction:** Images may only be loaded via the local file picker or drag-and-drop from the file system. Loading images by URL is not supported. This avoids canvas CORS taint (`getImageData()` throws a security error on cross-origin images), keeping the implementation simple and secure.

### Potrace WASM — initialisation and API

`potrace-wasm` exposes an async factory function. Initialisation strategy: **eager load on page load**.

Expected API usage (to be verified against the pinned version at implementation time):
```js
// Initialise once on page load
const Potrace = await createPotrace(); // or Module() depending on build

// Trace grayscale pixels
const svgString = Potrace.trace(grayPixels, { width, height, ...options });
```

Where `grayPixels` is a `Uint8Array` of single-channel grayscale values (one byte per pixel), and `width`/`height` are the canvas dimensions.

If the library API differs from the above, the implementation adapts accordingly. The Logo/Line Art mode Convert button shows "Loading engine…" (disabled) until initialisation completes. If initialisation fails, the button is permanently disabled with an inline error.

### Grayscale conversion for Logo/Line Art mode

Before passing to potrace-wasm, the RGBA `ImageData` is converted to a single-channel `Uint8Array` using the luminance-weighted formula:

```
gray = 0.299 × R + 0.587 × G + 0.114 × B
```

Pixels with alpha < 128 are treated as white (255). This preserves perceptual brightness and ensures transparent areas trace as background.

---

## UI Layout (top to bottom)

1. **Mode selector** — full-width toggle: `Photo / Color` | `Logo / Line Art`. Switching mode resets the control panel but preserves the loaded image.

2. **Upload zone** — drag-and-drop area + file picker button. Accepts JPG and PNG only (GIF, WebP, and other formats are out of scope — see below). Shows original image thumbnail below it once loaded.

3. **Control panel** — full-width, mode-dependent:
   - *Photo / Color mode:* Color count (2–32, default 8), blur radius (0–5, default 0), stroke width (0–5px, default 1), line smoothing / `roundcoords` (0–1, default 0.5 — maps to ImageTracer.js `roundcoords` option)
   - *Logo / Line Art mode:* B&W threshold (0–255, default 128), noise removal / turdsize (0–50, default 2), corner sharpness / alphamax (0–1.34, default 1), curve optimization toggle (on by default)

4. **Convert button** — prominent full-width action button. While conversion is running the button shows a spinner and is disabled; the rest of the UI remains interactive. Conversion runs on click (not auto) to avoid slow re-renders on large images.

5. **SVG result preview** — full-width display of the vectorized SVG output.

6. **Download bar** — three side-by-side buttons: **Download SVG**, **Download EPS**, **Download DXF**. Disabled until a successful conversion exists.

---

## Data Flow

1. User uploads JPG or PNG via file picker or drag-and-drop → drawn to hidden `<canvas>` → `ImageData` extracted.
2. **Downscale:** if `width × height > 4,000,000` (4MP), scale proportionally using:
   ```js
   const scale = Math.sqrt(4_000_000 / (width * height));
   const newWidth  = Math.floor(width  * scale);
   const newHeight = Math.floor(height * scale);
   ```
   The hidden canvas is resized to `newWidth × newHeight` and `drawImage()` redraws into it (browser bilinear interpolation). An inline notice is shown.
3. User adjusts controls → clicks **Convert**. Convert button enters loading/spinner state.
4. Active mode determines the engine:
   - **Photo / Color:** `ImageTracer.js` traces the `ImageData` directly → SVG string
   - **Logo / Line Art:** `ImageData` converted to grayscale `Uint8Array` (see formula above) → `potrace-wasm` traces it → SVG string
5. Convert button returns to normal state. SVG string is injected into the result preview panel.
6. Download buttons become enabled.

### Output SVG dimensions

The output SVG carries `width` and `height` attributes equal to the canvas pixel dimensions at the time of tracing (i.e. the potentially downscaled size, not the original image size). The `viewBox` is `0 0 {width} {height}`. All coordinates are in SVG user units (1 unit = 1 pixel at the canvas resolution).

### Download formats

| Format | Method |
|--------|--------|
| SVG | Blob download of the SVG string as-is |
| EPS | SVG `<path>` `d` attributes parsed; M/L/C/Q/Z commands converted to PostScript equivalents. Arc (`A`) commands are converted to 1–4 cubic Bézier segments using the standard W3C algorithm (see [SVG spec appendix F.6](https://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes)); smooth curve commands `S`/`s` and `T`/`t` are resolved to explicit `C` and `Q` before conversion. Approximation accuracy: ≤0.5px from the true arc. `%%BoundingBox` is `0 0 {canvasWidth} {canvasHeight}` (integer pixel values from the SVG `viewBox`). Wrapped in standard EPS-3.0 header/footer. |
| DXF | SVG `<path>` `d` attributes parsed; all curves (C/Q/A) approximated as polylines via recursive midpoint subdivision (flatness tolerance 0.5px); written as DXF `LWPOLYLINE` entities (R2010 format). Coordinate system: 1 SVG user unit = 1 mm. Y axis is flipped to match DXF convention using `dxfY = canvasHeight - svgY`. Origin is the top-left of the canvas. Compatible with laser cutters and vinyl cutters. |

**Filename derivation:** Stem = source filename up to (but not including) the last `.`. `my.logo.jpg` → stem `my.logo`. A file with no extension uses the full filename as the stem. Output: `{stem}.svg`, `{stem}.eps`, `{stem}.dxf`.

**Known limitation:** EPS and DXF conversion is path-based. Very complex photos produce large files. This is inherent to the format conversion, not a defect.

---

## Error Handling

| Condition | Behaviour |
|-----------|-----------|
| Image > 4MP | Auto-downscale to ≤4MP preserving aspect ratio; inline notice shown |
| Potrace WASM fails to initialise | Logo/Line Art Convert button permanently disabled; inline error shown |
| Potrace WASM still loading | Logo/Line Art Convert button shows "Loading engine…" and is disabled until ready |
| No image loaded | Convert and Download buttons disabled |
| Unsupported file type (not JPG/PNG) | Inline error on upload zone |
| Tracing produces no paths | Message: "No paths found — try adjusting the threshold or color count" |
| Conversion running | Convert button disabled + spinner; UI otherwise interactive |

---

## Out of Scope

- Server-side processing
- Batch conversion (multiple files at once)
- Editing the vector result before download
- Formats beyond SVG, EPS, DXF
- GIF and WebP input (animated GIFs require frame handling; WebP adds complexity; both are deliberate exclusions)
- Loading images by URL (excluded to avoid canvas CORS taint issues)
