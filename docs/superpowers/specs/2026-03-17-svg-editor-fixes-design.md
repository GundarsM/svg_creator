# SVG Editor Fixes & Enhancements — Design Spec
**Date:** 2026-03-17
**File:** `editor.js`
**Approach:** Approach A — direct fixes, minimal architectural changes

---

## Item 1 — Error & Warning Audit

Read through `editor.js` and flag:
- Uncaught promise rejections
- Undefined variable references
- Event listener leaks
- Missing `null` checks before DOM access
- Inconsistencies between `shapeType` assignments and actual Fabric.js object types

No code changes until audit findings are documented. Fixes derived from audit results.

---

## Item 2 — Spatial Material Color Cascade

**Trigger:** `materialPreset.onchange` and `fillColor.onchange` handlers (already exist).

**New function:** `cascadeColorToContained(changedObject, fillType, plasticColor)`

**Logic:**
1. Get bounding rect of `changedObject` via `getBoundingRect()`
2. Iterate all canvas objects except `changedObject` itself
3. For each object, check if `getCenterPoint()` falls inside the bounding rect (deliberate choice of centre-point check, not full bounding-rect overlap — keeps the check simple and reliable for well-bounded template layouts)
4. If contained AND `shapeType` is not `'circle'` or `'ellipse'` AND Fabric.js `type` is not `'circle'` or `'ellipse'`:
   - Wood (`birch` / `oak` / `walnut`) → set `fill` to `#5c3316`
   - Plastic, non-white (i.e. `plasticColor` is not `#ffffff` / `#FFFFFF`) → set `fill` to `#ffffff` (white — so labels/text are visible against dark/coloured backgrounds)
   - White plastic (`plasticColor` is `#ffffff` or `#FFFFFF`) → set `fill` to `#d3d3d3` (light grey — avoids invisible white-on-white text)
5. For `fabric.Group` objects that pass containment check, also iterate their `_objects` array and apply the same rule to each inner object (skipping circles/ellipses)
6. After all fills are updated, call `canvas.requestRenderAll()`

**Call sites — precise insertion points:**

`fillColor.onchange` (around line 2254): after all existing fill-assignment logic, read the plastic colour directly from the DOM at the call site and pass it in:
```js
const currentPlasticColor = document.getElementById('fillColor').value;
cascadeColorToContained(obj, 'color', currentPlasticColor);
// then the existing canvas.requestRenderAll() and saveState() follow
```

`materialPreset.onchange` (around line 2329): `applyFill()` is called at the start of this handler and internally calls `canvas.requestRenderAll()`. Insert `cascadeColorToContained(...)` **after the `applyFill()` call and before the final `canvas.requestRenderAll()` and `saveState()`** at the end of the handler. The extra `requestRenderAll()` inside `applyFill` is acceptable — a second call is a no-op if nothing has changed since the first. Pass the plastic colour as:
```js
const currentPlasticColor = document.getElementById('fillColor').value;
cascadeColorToContained(obj, fillType, currentPlasticColor);
// then the existing canvas.requestRenderAll() and saveState() follow
```

Both call sites pass `obj` (the currently selected canvas object), `fillType` (the new material value), and `currentPlasticColor` (read from `#fillColor` at call time). This ensures cascade changes are captured in the same `saveState()` snapshot.

---

## Item 3 — Text Export as Vector Paths (Option B)

### Dependencies
Add `opentype.js` **v1.3.4 or later** (which exposes `opentype.load()` returning a native Promise) via CDN in the `<head>`.

### Font List Replacement
Replace all system fonts in `#fontFamily` select with Google Fonts equivalents. Load all replacement fonts at page-load via a single `<link rel="stylesheet">` to Google Fonts.

| Current Font(s) | Replacement Font | Select `value` |
|---|---|---|
| Arial | Roboto | `Roboto` |
| Arial Black | Roboto | `Roboto` (weight 900 at export) |
| Times New Roman | Lora | `Lora` |
| Cambria | Lora | `Lora` |
| Courier New | Inconsolata | `Inconsolata` |
| Consolas | Inconsolata | `Inconsolata` |
| Verdana | Open Sans | `Open Sans` |
| Tahoma | Open Sans | `Open Sans` |
| Trebuchet MS | Nunito | `Nunito` |
| Segoe UI | Nunito | `Nunito` |
| Century Gothic | Josefin Sans | `Josefin Sans` |
| Impact | Anton | `Anton` |
| Comic Sans MS | Patrick Hand | `Patrick Hand` |
| Calibri | Nunito | `Nunito` |
| Book Antiqua | EB Garamond | `EB Garamond` |
| Garamond | EB Garamond | `EB Garamond` |
| Lucida Sans Unicode | PT Sans | `PT Sans` |
| IvyMode | Cormorant Garamond | `Cormorant Garamond` |

After deduplication, the final `<option>` list contains: Roboto, Lora, Inconsolata, Open Sans, Nunito, Josefin Sans, Anton, Patrick Hand, EB Garamond, PT Sans, Cormorant Garamond.

### Font Binary URL Map
Define a hardcoded `const FONT_URLS = { 'Roboto': '...', ... }` mapping each select value to a `.woff` binary URL sourced from `@fontsource` packages on jsDelivr CDN (which provides WOFF format natively supported by opentype.js v1.3+).

**Fallback for legacy font names:** If a text object has a `fontFamily` value not present in `FONT_URLS` (e.g. a design saved before the migration still has `fontFamily: 'Arial'`), fall back to `FONT_URLS['Open Sans']` (neutral sans-serif fallback) and log a console warning. Do not throw an error.

### Font Cache
`const fontBinaryCache = {}` — loaded `opentype.Font` objects are cached by font name to avoid re-fetching on repeated exports within the same session.

### Export Flow
Replace the `convertTextToPaths()` function entirely with `convertTextToPathObjects()`:

1. For each canvas object of type `i-text` or `text`:
   a. Load font binary via `await opentype.load(FONT_URLS[fontFamily])` (use `fontBinaryCache` — load once, reuse)
   b. Split text content on newlines
   c. For each line, call `font.getPath(line, 0, lineOffsetY, fontSize)` to get an `opentype.Path`
   d. Calculate `lineOffsetY` per line using full line height: `(font.ascender - font.descender + (font.lineGap || 0)) / font.unitsPerEm * fontSize`
   e. Convert each `opentype.Path` to an SVG `d` string via `.toPathData()`
   f. Create one `fabric.Path` per line with that `d` string; set `left`, `top`, `angle`, `scaleX`, `scaleY`, `fill`, `stroke`, `strokeWidth`, `opacity`, `originX`, `originY` to match the original text object
   g. Push each resulting `fabric.Path` to `convertedObjects` as `{ original: obj, converted: pathObj }`
2. For non-text canvas objects: push `{ original: obj, converted: null }` unchanged (identical to the current function's non-text handling)

**Known limitation (out of scope):** `textAlign`, `charSpacing`, and `lineHeight` overrides on `fabric.IText` objects are not transferred to the exported paths. These properties will be silently dropped. This is acceptable for the current use case (short labels) and can be addressed in a future iteration.

### Cleanup
Delete the old `convertTextToPaths()` function entirely. Search the entire file for all calls to `convertTextToPaths` — the exhaustive list is `exportSVG()` (line ~2950) and `showQuoteForm()` (line ~3048). Update both to call `convertTextToPathObjects()` instead.

---

## Item 4 — UK Coins Template: Group Outer & Inner Circles

In the `uk-coins` branch of `addTemplate()`, after creating `outerCircle` and `innerCircle` (and before pushing to `elements`), wrap them in a `fabric.Group`. Do **not** push `outerCircle` or `innerCircle` individually to `elements`.

```js
// Set materialType/shapeType on individual circles before grouping
// (the group's own properties take precedence for all selection handlers)
outerCircle.shapeType = 'circle';
outerCircle.materialType = 'birch';
innerCircle.shapeType = 'circle';
innerCircle.materialType = 'color';

const circleGroup = new fabric.Group([outerCircle, innerCircle], {
    left: baseX,
    top: baseY,
    originX: 'center',
    originY: 'center'
});
circleGroup.shapeType = 'circle';
circleGroup.materialType = 'birch';
circleGroup.realRadius = 133 / 2; // custom property for quote/dimension display
elements.push(circleGroup);
```

Note: `fabric.Group` recomputes individual object offsets relative to the group centre at construction time. Do not set `left`/`top` on `outerCircle` or `innerCircle` after grouping.

**Material change behaviour on the group:**
When `applyFill` or `materialPreset.onchange` runs on `circleGroup`, it already iterates `_objects` via `forEachObject()`. The `innerCircle` stroke colour update is handled **inside `applyFill()`**, within the existing `forEachObject` callback loop — after the existing `if/else` fill-application block for each inner object, add:
```js
// Inside forEachObject callback, after the fill block:
if (innerObj.fill === 'transparent') {
    innerObj.set('stroke', fillType === 'color' ? '#ffffff' : '#5c3316');
}
```
This runs per-object inside the loop, not after it. Do not change the `fill` of transparent-fill objects.

This prevents the user from accidentally selecting only the inner circle, since both circles are now a single selectable unit.

---

## Item 5 — Filled Circle & Ellipse Default Fill: Birch Plywood

In `addShape()`:

1. Before the `switch(type)` block, add the birch pattern guard:
   ```js
   if (!woodPatterns['birch']) {
       const patternCanvas = createWoodPattern('birch');
       woodPatterns['birch'] = new fabric.Pattern({ source: patternCanvas, repeat: 'repeat' });
   }
   ```
   (Identical guard already used in `addTemplate()`.)

2. In `case 'circle'`: change `fill: '#ffffff'` to `fill: woodPatterns['birch']`

3. In `case 'ellipse'`: change `fill: '#ffffff'` to `fill: woodPatterns['birch']`

4. **Line 1102** (`shape.materialType = 'color'` after the switch) must be changed to a conditional so it does not overwrite the `'birch'` assignments set inside the `case` blocks:
   ```js
   if (!shape.materialType) {
       shape.materialType = 'color';
   }
   ```
   Set `shape.materialType = 'birch'` explicitly inside `case 'circle'` and `case 'ellipse'` before each `break`. Execution order: the `case` block runs first (setting `materialType = 'birch'`), then the post-switch guard runs. Because `'birch'` is truthy, `!shape.materialType` evaluates to `false` and the guard does **not** overwrite it. The rectangle `case` does not set `materialType`, so `!shape.materialType` is `true` and the guard correctly sets it to `'color'`.

Rectangle (`case 'rectangle'`) is unchanged — it already spawns with a visible fill and gets `materialType = 'color'` from the guard.

**Note on `saveState()`:** `addShape()` does not currently call `saveState()`. This is pre-existing behaviour and is out of scope for this spec — do not add it as part of this item.

---

## Item 6 — Country Default Fill: Brown

In `addCountry()`, change:
```js
fill: '#3498db'
```
to:
```js
fill: '#5c3316'
```

One line change (line 1121).

---

## Item 7 — Countries Section: Rename + Filled/Outline Button Pairs

**Heading:** Change `<h3 class="mt-4">Country Outlines</h3>` to `<h3 class="mt-4">Countries</h3>`.

**Button layout per country:** Each country row changes from one button to two buttons in a `d-flex gap-2` row:
- **Filled button** — calls existing `addCountry(name)`, label: `<i class="fas fa-map"></i> [Country]`
- **Outline button** — calls new `addCountryOutline(name)`, label: `<i class="far fa-map"></i> Outline`

Note: confirm Font Awesome 5 is loaded with the regular (`far`) icon pack as well as solid (`fas`) — if only the solid pack is loaded, add the regular pack CDN link.

**New function `addCountryOutline(country)`:** Identical to `addCountry()` except:
- `fill: 'transparent'`
- `stroke: '#5c3316'`
- `strokeWidth: 3`
- `shapeType = 'country'`
- `countryName = country`
- `materialType = 'color'` (explicit assignment, same as `addCountry()`)

Apply to all 6 countries: USA, UK, Australia, Canada, Germany, Italy.

**Note on `saveState()`:** `addCountry()` does not currently call `saveState()`. `addCountryOutline()` mirrors this behaviour — do not add `saveState()` to either function as part of this spec.

---

## Out of Scope
- Changes to the Germany Euro or Precious Memories templates
- Changes to the currency coin spawning logic
- Any refactoring of unrelated code
