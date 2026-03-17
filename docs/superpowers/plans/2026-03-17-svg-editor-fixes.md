# SVG Editor Fixes & Enhancements Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 7 bugs and enhancements in `editor.js` — including a spatial material colour cascade, true vector text export via opentype.js, and several UI/default-value fixes.

**Architecture:** All changes are in one file (`editor.js`, ~3260 lines). No build system. The file is a self-contained HTML page loaded directly in a browser. Testing is manual browser verification. New dependency: opentype.js (CDN) for font-binary-to-SVG-path conversion.

**Tech Stack:** Fabric.js 5.3.0, Bootstrap 5.3, Font Awesome 6, vanilla JS, opentype.js v1.3.4+ (new)

**Spec:** `docs/superpowers/specs/2026-03-17-svg-editor-fixes-design.md`

---

## Chunk 1: Setup + Simple Fixes (Items 1, 5, 6)

### Task 1: Git initialisation

**Files:**
- No source changes

- [ ] **Step 1: Initialise git repo**

```bash
cd "c:/Users/GundarsM/Documents/svg_editor"
git init
git add editor.js docs/
git commit -m "chore: initial commit before fixes"
```

---

### Task 2: Audit editor.js for errors and warnings (Item 1)

**Files:**
- Modify: `editor.js` (fixes derived from audit)

Read `editor.js` systematically and flag each issue before fixing anything.

- [ ] **Step 1: Check for uncaught promise rejections**

Search for all `async function` and `.then(` calls. Verify every `async` function is wrapped in `try/catch` or called with `.catch()`. In particular check `exportSVG()`, `showQuoteForm()`, `convertTextToPaths()`.

Expected findings: `showQuoteForm()` calls `convertTextToPaths()` inside a `try/catch` — confirm it covers all async paths.

- [ ] **Step 2: Check for undefined variable references**

Search for variables used before declaration. Verify `woodPatterns`, `canvas`, `baseX`, `baseY` are all in scope at the points they are used inside `addTemplate()`.

- [ ] **Step 3: Check for missing null checks before DOM access**

Search for `document.getElementById(...)` calls. Verify each one is guarded or is guaranteed to exist in the DOM at call time. Flag any that could be `null` at runtime.

- [ ] **Step 4: Check shapeType consistency**

Verify every Fabric.js object that gets a `shapeType` assignment uses a consistent value that matches what the property-panel code (`updatePropertiesPanel`, `materialPreset.onchange`, `fillColor.onchange`) expects. Specifically:
- `fabric.Circle` → `shapeType = 'circle'`
- `fabric.Ellipse` → `shapeType = 'ellipse'`
- `fabric.Rect` → `shapeType = 'rectangle'` or `'rectangle-outline'`
- `fabric.Path` (country) → `shapeType = 'country'`
- `fabric.Text` / `fabric.IText` → `shapeType = 'text'`
- `fabric.Group` (coin) → `shapeType = 'currency'`

- [ ] **Step 5: Fix all findings**

For each finding from steps 1–4, apply the minimal fix. Keep changes isolated. Do not refactor unrelated code.

- [ ] **Step 6: Browser verify — open editor.js in browser, open console, confirm zero errors on load and on basic interactions (add shape, change material, export)**

- [ ] **Step 7: Commit**

```bash
git add editor.js
git commit -m "fix: resolve audit findings - null checks, async error handling, shapeType consistency"
```

---

### Task 3: Filled circle and ellipse spawn with birch plywood (Item 5)

**Files:**
- Modify: `editor.js` — `addShape()` function (~line 989)

- [ ] **Step 1: Browser verify current broken state**

Open `editor.js` in browser. Click "Circle" filled shape button. Observe: circle appears with white fill — visually empty on white canvas. This is the bug.

- [ ] **Step 2: Add birch pattern guard before the switch in `addShape()`**

Find `function addShape(type) {` (~line 989). After `const centerY = canvas.height / 2;` and before `switch(type) {`, insert:

```js
if (!woodPatterns['birch']) {
    const patternCanvas = createWoodPattern('birch');
    woodPatterns['birch'] = new fabric.Pattern({
        source: patternCanvas,
        repeat: 'repeat'
    });
}
```

- [ ] **Step 3: Replace the entire `case 'circle':` block**

Find the `case 'circle':` block. Replace it entirely with:

```js
case 'circle':
    shape = new fabric.Circle({
        left: centerX,
        top: centerY,
        radius: 40 * scale,
        fill: woodPatterns['birch'],
        stroke: '#5c3316',
        strokeWidth: 0.1,
        strokeUniform: true,
        originX: 'center',
        originY: 'center'
    });
    shape.realRadius = 40;
    shape.materialType = 'birch';
    break;
```

- [ ] **Step 4: Replace the entire `case 'ellipse':` block**

Find the `case 'ellipse':` block. Replace it entirely with:

```js
case 'ellipse':
    shape = new fabric.Ellipse({
        left: centerX,
        top: centerY,
        rx: 60 * scale,
        ry: 40 * scale,
        fill: woodPatterns['birch'],
        stroke: '#5c3316',
        strokeWidth: 0.1,
        strokeUniform: true,
        originX: 'center',
        originY: 'center'
    });
    shape.realRx = 60;
    shape.realRy = 40;
    shape.materialType = 'birch';
    break;
```

- [ ] **Step 5: Change the post-switch materialType assignment (~line 1102) to a guard**

Find `shape.materialType = 'color'; // Set default material type` immediately after the switch block. Change to:
```js
if (!shape.materialType) {
    shape.materialType = 'color'; // Default for shapes that didn't set it in their case
}
```
Execution order: the `case` block runs first (setting `materialType = 'birch'`), then this guard runs. Because `'birch'` is truthy, `!shape.materialType` is `false` — the guard will not overwrite it. Rectangle does not set `materialType` in its case, so the guard correctly assigns `'color'` to it.

- [ ] **Step 6: Browser verify**

Reload. Click "Circle" filled → circle appears with birch wood texture. Click "Ellipse" filled → same. Click "Rectangle" filled → still spawns with blue fill (unchanged). Open properties panel for circle: "Fill Material" dropdown shows "Birch Plywood".

- [ ] **Step 7: Commit**

```bash
git add editor.js
git commit -m "fix: filled circle and ellipse now spawn with birch plywood fill by default"
```

---

### Task 4: Country shapes spawn with brown fill (Item 6)

**Files:**
- Modify: `editor.js` — `addCountry()` function (~line 1110)

- [ ] **Step 1: Browser verify current broken state**

Open editor. Click any country button (e.g. "Germany"). Observe: country shape appears with blue fill (`#3498db`). This is wrong — should be brown `#5c3316`.

- [ ] **Step 2: Change the fill in `addCountry()`**

Find `addCountry()` (~line 1110). Inside the `shape.set({...})` call (the `fill:` property is at **line 1121**), change:
```js
fill: '#3498db',
```
to:
```js
fill: '#5c3316',
```

- [ ] **Step 3: Browser verify**

Reload. Click "Germany". Country outline appears filled with brown (`#5c3316`). Confirm it matches the brown used in the coin holder templates.

- [ ] **Step 4: Commit**

```bash
git add editor.js
git commit -m "fix: country shapes now spawn with brown fill matching template colour"
```

---

## Chunk 2: Countries UI + UK Coins Grouping (Items 4, 7)

### Task 5: Countries section — rename and add outline buttons (Item 7)

**Files:**
- Modify: `editor.js` — HTML section ~line 344, add `addCountryOutline()` function near `addCountry()` (~line 1140)

- [ ] **Step 1: Check Font Awesome regular icon pack**

Search `editor.js` for the Font Awesome CDN `<link>` tag. Verify it includes `all.min.css` or both `solid` and `regular` packs. If only solid is loaded (e.g. `font-awesome/6.4.0/css/solid.min.css`), change it to `all.min.css`:
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

- [ ] **Step 2: Rename section heading**

Find `<h3 class="mt-4">Country Outlines</h3>` (~line 344). Change to:
```html
<h3 class="mt-4">Countries</h3>
```

- [ ] **Step 3: Replace the 3 two-country rows with 6 single-country rows (filled + outline each)**

The current layout has 3 rows (`<div style="display: flex; gap: 8px; margin-bottom: 8px;">`) each containing 2 country buttons. Replace the entire block from the opening of the first row to the closing of the third row (lines 345–368) with 6 rows — one per country, each with a filled button and an outline button:

```html
<div style="display: flex; gap: 8px; margin-bottom: 8px;">
    <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountry('usa')">
        <i class="fas fa-map"></i> USA
    </button>
    <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountryOutline('usa')">
        <i class="far fa-map"></i> Outline
    </button>
</div>
<div style="display: flex; gap: 8px; margin-bottom: 8px;">
    <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountry('uk')">
        <i class="fas fa-map"></i> UK
    </button>
    <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountryOutline('uk')">
        <i class="far fa-map"></i> Outline
    </button>
</div>
<div style="display: flex; gap: 8px; margin-bottom: 8px;">
    <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountry('australia')">
        <i class="fas fa-map"></i> Australia
    </button>
    <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountryOutline('australia')">
        <i class="far fa-map"></i> Outline
    </button>
</div>
<div style="display: flex; gap: 8px; margin-bottom: 8px;">
    <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountry('canada')">
        <i class="fas fa-map"></i> Canada
    </button>
    <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountryOutline('canada')">
        <i class="far fa-map"></i> Outline
    </button>
</div>
<div style="display: flex; gap: 8px; margin-bottom: 8px;">
    <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountry('germany')">
        <i class="fas fa-map"></i> Germany
    </button>
    <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountryOutline('germany')">
        <i class="far fa-map"></i> Outline
    </button>
</div>
<div style="display: flex; gap: 8px; margin-bottom: 8px;">
    <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountry('italy')">
        <i class="fas fa-map"></i> Italy
    </button>
    <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountryOutline('italy')">
        <i class="far fa-map"></i> Outline
    </button>
</div>
```

- [ ] **Step 4: Add `addCountryOutline()` function**

Immediately after the closing `}` of `addCountry()` (~line 1140), insert:

```js
// Add country outline (transparent fill, brown stroke)
function addCountryOutline(country) {
    const pathData = countryPaths[country];
    const scale = canvas.scale;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    fabric.loadSVGFromString(`<svg><path d="${pathData}" /></svg>`, function(objects, options) {
        const shape = fabric.util.groupSVGElements(objects, options);
        shape.set({
            left: centerX,
            top: centerY,
            fill: 'transparent',
            stroke: '#5c3316',
            strokeWidth: 3,
            scaleX: scale,
            scaleY: scale,
            strokeUniform: true,
            originX: 'center',
            originY: 'center'
        });
        shape.shapeType = 'country';
        shape.countryName = country;
        shape.materialType = 'color';
        shape.realWidth = shape.width;
        shape.realHeight = shape.height;
        shape.setCoords();
        canvas.add(shape);
        canvas.setActiveObject(shape);
        canvas.requestRenderAll();
    });
}
```

- [ ] **Step 5: Browser verify**

Reload. Confirm:
- Section heading reads "Countries"
- Each country has two buttons side by side
- Clicking "Germany" filled button → brown filled shape
- Clicking "Germany" Outline button → transparent fill, brown stroke outline shape
- Both shapes are selectable and show in properties panel

- [ ] **Step 6: Commit**

```bash
git add editor.js
git commit -m "feat: rename Countries section, add outline variant button per country"
```

---

### Task 6: UK coins template — group outer and inner circles (Item 4)

**Files:**
- Modify: `editor.js` — `uk-coins` branch of `addTemplate()` (~line 1622), `applyFill()` (~line 827)

- [ ] **Step 1: Browser verify current broken state**

Open editor. Add "Circular" template. Click on the decorative inner ring (smaller circle near the edge). Observe it selects independently. Change its material in the properties panel. Observe only the inner ring changes — the outer plywood circle does not update. This is the bug.

- [ ] **Step 2: Update `applyFill()` to handle transparent-fill inner objects**

Find `function applyFill(object, fillType)` (~line 827). Locate the `forEachObject` callback at ~line 834. The current callback body is:

```js
object.forEachObject(function(innerObj) {
    if (innerObj.type !== 'text' && innerObj.type !== 'i-text') {
        if (fillType === 'color') {
            const fillColor = document.getElementById('fillColor').value;
            innerObj.set('fill', fillColor);
            innerObj.materialType = 'color';
        } else {
            if (!woodPatterns[fillType]) {
                const patternCanvas = createWoodPattern(fillType);
                woodPatterns[fillType] = new fabric.Pattern({
                    source: patternCanvas,
                    repeat: 'repeat'
                });
            }
            innerObj.set('fill', woodPatterns[fillType]);
            innerObj.materialType = fillType;
        }
    }
    // Don't modify text in groups (coins)
});
```

Replace this entire `forEachObject` call with:

```js
object.forEachObject(function(innerObj) {
    if (innerObj.type !== 'text' && innerObj.type !== 'i-text') {
        if (innerObj.fill === 'transparent') {
            // Decorative border ring — preserve transparent fill, update stroke only
            innerObj.set('stroke', fillType === 'color' ? '#ffffff' : '#5c3316');
        } else if (fillType === 'color') {
            const fillColor = document.getElementById('fillColor').value;
            innerObj.set('fill', fillColor);
            innerObj.materialType = 'color';
        } else {
            if (!woodPatterns[fillType]) {
                const patternCanvas = createWoodPattern(fillType);
                woodPatterns[fillType] = new fabric.Pattern({
                    source: patternCanvas,
                    repeat: 'repeat'
                });
            }
            innerObj.set('fill', woodPatterns[fillType]);
            innerObj.materialType = fillType;
        }
    }
    // Don't modify text in groups (coins)
});
```

The new `fill === 'transparent'` guard prevents the innerCircle from losing its transparent fill when material changes. It updates only the stroke colour to match the material (white for plastic, brown for wood).

- [ ] **Step 3: Group outerCircle and innerCircle in the uk-coins template**

Find the `uk-coins` branch of `addTemplate()` (~line 1622). After the `innerCircle` object is fully created and its properties are assigned (~line 1664), and before `elements.push(innerCircle)`, replace the two individual `elements.push()` calls with a group:

Remove:
```js
elements.push(outerCircle);
// ... innerCircle creation ...
elements.push(innerCircle);
```

Replace with (after both circles are created):
```js
// Set properties on individual circles before grouping
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
circleGroup.realRadius = 133 / 2;
elements.push(circleGroup);
```

Note: `fabric.Group` recomputes internal offsets at construction time — do not set `left`/`top` on the individual circles after the group is created.

- [ ] **Step 4: Browser verify**

Reload. Add "Circular" template. Attempt to click the inner ring — it is no longer independently selectable (the whole coin holder group selects). Select the coin holder group, change material from Birch Plywood to Plastic (e.g. black). Verify:
- Outer circle changes to black plastic fill
- Inner circle stroke changes from brown to white
- Changing back to Birch Plywood restores wood fill and brown stroke

- [ ] **Step 5: Commit**

```bash
git add editor.js
git commit -m "fix: group outer/inner circles in UK coins template so material change updates both"
```

---

## Chunk 3: Material Colour Cascade (Item 2)

### Task 7: Implement spatial material colour cascade

**Files:**
- Modify: `editor.js` — add `cascadeColorToContained()` function, update `fillColor.onchange` (~line 2254) and `materialPreset.onchange` (~line 2329)

- [ ] **Step 1: Browser verify current broken state**

Open editor. Add "Circular" UK coins template. Select the outer circle (the birch wood background). Change material to "Plastic" with a dark colour (e.g. black `#000000`). Observe: outer circle becomes black but the UK country outline shape, text labels, etc. stay brown/their original colour. This is the bug — contained objects should turn white.

- [ ] **Step 2: Add `cascadeColorToContained()` function**

Find `function applyFill(object, fillType)` (~line 827). Immediately before it, insert the new function:

```js
// Cascade colour changes to objects spatially contained within the changed object.
// Non-circle/non-ellipse contained objects change fill to match the material's logical colour:
//   wood → brown #5c3316
//   plastic (non-white) → white #ffffff (visible against dark backgrounds)
//   white plastic → light grey #d3d3d3 (avoids invisible white-on-white)
function cascadeColorToContained(changedObject, fillType, plasticColor) {
    const bounds = changedObject.getBoundingRect();

    canvas.getObjects().forEach(function(obj) {
        if (obj === changedObject) return;

        // Check if this object's centre point is inside changedObject's bounding rect
        const center = obj.getCenterPoint();
        const inside = center.x >= bounds.left &&
                       center.x <= bounds.left + bounds.width &&
                       center.y >= bounds.top &&
                       center.y <= bounds.top + bounds.height;
        if (!inside) return;

        // Determine the cascade colour
        let cascadeColor;
        if (fillType === 'birch' || fillType === 'oak' || fillType === 'walnut') {
            cascadeColor = '#5c3316';
        } else {
            // plastic
            const isWhite = plasticColor === '#ffffff' || plasticColor === '#FFFFFF';
            cascadeColor = isWhite ? '#d3d3d3' : '#ffffff';
        }

        // Apply to this object if it is not a circle or ellipse
        function applyIfNotCircleOrEllipse(o) {
            const isCircle = o.shapeType === 'circle' || o.shapeType === 'ellipse' ||
                             o.type === 'circle' || o.type === 'ellipse';
            if (!isCircle) {
                o.set('fill', cascadeColor);
            }
        }

        if (obj.type === 'group') {
            // Also cascade into group members
            obj.forEachObject(function(innerObj) {
                applyIfNotCircleOrEllipse(innerObj);
            });
        } else {
            applyIfNotCircleOrEllipse(obj);
        }
    });

    canvas.requestRenderAll();
}
```

- [ ] **Step 3: Wire cascade into `fillColor.onchange` handler**

Find `document.getElementById('fillColor').onchange = function()` (~line 2254). At the end of this handler, just before the closing `};`, find the existing `canvas.requestRenderAll()` and `saveState()` calls. Insert `cascadeColorToContained` immediately before them:

```js
// Cascade colour to contained objects
const currentPlasticColor = document.getElementById('fillColor').value;
cascadeColorToContained(obj, 'color', currentPlasticColor);
// then the existing canvas.requestRenderAll() and saveState() follow unchanged
```

- [ ] **Step 4: Wire cascade into `materialPreset.onchange` handler**

Find `document.getElementById('materialPreset').onchange = function()` (~line 2329). Inside this handler, `applyFill(obj, fillType)` is called near the top. After the `applyFill()` call but before the handler's final `canvas.requestRenderAll()` and `saveState()`, insert:

```js
// Cascade colour to contained objects
const currentPlasticColor = document.getElementById('fillColor').value;
cascadeColorToContained(obj, fillType, currentPlasticColor);
```

- [ ] **Step 5: Browser verify — plastic cascade**

Reload. Add "Circular" UK coins template. Select outer circle. Change material to Plastic, colour black. Verify:
- UK country outline shape → fill changes to white
- "United Kingdom" text label → fill changes to white
- Coin slot circles → fill stays unchanged (they are circles, not affected)

- [ ] **Step 6: Browser verify — wood cascade**

With the same template, change material back to "Birch Plywood". Verify:
- UK country outline shape → fill changes back to brown `#5c3316`
- "United Kingdom" text → fill changes back to brown
- Coin slot circles → unchanged

- [ ] **Step 7: Browser verify — white plastic cascade**

Change material to Plastic, colour white (`#ffffff`). Verify:
- UK country outline → fill becomes light grey `#d3d3d3`
- Text → fill becomes light grey
- Circles → unchanged

- [ ] **Step 8: Commit**

```bash
git add editor.js
git commit -m "feat: spatial material colour cascade updates contained non-circle objects on material change"
```

---

## Chunk 4: Text Export via opentype.js (Item 3)

### Task 8: Add opentype.js and replace font list

**Files:**
- Modify: `editor.js` — `<head>` section, `#fontFamily` select (~line 491)

- [ ] **Step 1: Add opentype.js CDN and Google Fonts link in `<head>`**

Find the existing CDN `<link>` and `<script>` tags in `<head>`. Add after the existing stylesheets:

```html
<!-- Google Fonts replacement for system fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Cormorant+Garamond:wght@400;700&family=EB+Garamond:wght@400;700&family=Inconsolata:wght@400;700&family=Josefin+Sans:wght@400;700&family=Lora:wght@400;700&family=Nunito:wght@400;700&family=Open+Sans:wght@400;700&family=Patrick+Hand&family=PT+Sans:wght@400;700&family=Roboto:wght@400;700;900&display=swap" rel="stylesheet">
```

Add before the closing `</head>`:
```html
<!-- opentype.js for text-to-path export -->
<script src="https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/dist/opentype.min.js"></script>
```

- [ ] **Step 2: Replace the font selector options (~line 491)**

Find `<select id="fontFamily" class="form-select">` and replace all `<option>` elements inside it with:

```html
<option value="Roboto">Roboto (was Arial)</option>
<option value="Lora">Lora (was Times New Roman)</option>
<option value="Inconsolata">Inconsolata (was Courier New)</option>
<option value="Open Sans">Open Sans (was Verdana)</option>
<option value="Nunito">Nunito (was Calibri)</option>
<option value="Josefin Sans">Josefin Sans (was Century Gothic)</option>
<option value="Anton">Anton (was Impact)</option>
<option value="Patrick Hand">Patrick Hand (was Comic Sans)</option>
<option value="EB Garamond">EB Garamond (was Garamond)</option>
<option value="PT Sans">PT Sans (was Lucida Sans)</option>
<option value="Cormorant Garamond">Cormorant Garamond (was IvyMode)</option>
```

- [ ] **Step 3: Update hardcoded fontFamily references in template code**

Search for all `fontFamily:` assignments in `editor.js`. Update:
- `fontFamily: 'Arial'` → `fontFamily: 'Roboto'`
- `fontFamily: 'Century Gothic'` → `fontFamily: 'Josefin Sans'`

- [ ] **Step 4: Browser verify fonts load**

Reload. Add a text object. Open font selector — all 11 Google Fonts appear in the dropdown. Select each one and verify the text on canvas renders in that font. Confirm no console errors about missing fonts.

- [ ] **Step 5: Commit**

```bash
git add editor.js
git commit -m "feat: replace system fonts with Google Fonts equivalents, add opentype.js CDN"
```

---

### Task 9: Add font binary URL map and cache

**Files:**
- Modify: `editor.js` — add constants near top of `<script>` block

- [ ] **Step 1: Add FONT_URLS constant and fontBinaryCache**

Find the top of the main `<script>` block (after `<script>` opening tag, before the first `let` or `const` declaration). Insert:

```js
// Font binary URLs for opentype.js text-to-path conversion at export time.
// Source: @fontsource packages on jsDelivr (WOFF format, natively supported by opentype.js).
const FONT_URLS = {
    'Roboto':               'https://cdn.jsdelivr.net/npm/@fontsource/roboto@5.0.8/files/roboto-latin-400-normal.woff',
    'Lora':                 'https://cdn.jsdelivr.net/npm/@fontsource/lora@5.0.8/files/lora-latin-400-normal.woff',
    'Inconsolata':          'https://cdn.jsdelivr.net/npm/@fontsource/inconsolata@5.0.8/files/inconsolata-latin-400-normal.woff',
    'Open Sans':            'https://cdn.jsdelivr.net/npm/@fontsource/open-sans@5.0.12/files/open-sans-latin-400-normal.woff',
    'Nunito':               'https://cdn.jsdelivr.net/npm/@fontsource/nunito@5.0.8/files/nunito-latin-400-normal.woff',
    'Josefin Sans':         'https://cdn.jsdelivr.net/npm/@fontsource/josefin-sans@5.0.8/files/josefin-sans-latin-400-normal.woff',
    'Anton':                'https://cdn.jsdelivr.net/npm/@fontsource/anton@5.0.8/files/anton-latin-400-normal.woff',
    'Patrick Hand':         'https://cdn.jsdelivr.net/npm/@fontsource/patrick-hand@5.0.8/files/patrick-hand-latin-400-normal.woff',
    'EB Garamond':          'https://cdn.jsdelivr.net/npm/@fontsource/eb-garamond@5.0.8/files/eb-garamond-latin-400-normal.woff',
    'PT Sans':              'https://cdn.jsdelivr.net/npm/@fontsource/pt-sans@5.0.8/files/pt-sans-latin-400-normal.woff',
    'Cormorant Garamond':   'https://cdn.jsdelivr.net/npm/@fontsource/cormorant-garamond@5.0.8/files/cormorant-garamond-latin-400-normal.woff'
};

// Cache of loaded opentype.Font objects — avoids re-fetching per export session
const fontBinaryCache = {};

// Fallback font key used when an unknown fontFamily is encountered
const FONT_FALLBACK = 'Open Sans';
```

- [ ] **Step 2: Verify jsDelivr URLs resolve**

In a browser console, test one URL to confirm format is correct:
```js
fetch('https://cdn.jsdelivr.net/npm/@fontsource/roboto@5.0.8/files/roboto-latin-400-normal.woff')
    .then(r => console.log(r.status, r.headers.get('content-type')));
```
Expected: `200 application/font-woff` or similar.

If a URL returns 404, visit `https://cdn.jsdelivr.net/npm/@fontsource/roboto/` to browse available files and find the correct version and `.woff` filename.

**Important — WOFF vs WOFF2:** `@fontsource` packages distribute both `.woff` and `.woff2` files. opentype.js v1.3.4 supports WOFF natively but NOT WOFF2. Always use `.woff` URLs. If a particular font only has `.woff2` on jsDelivr, find an alternative WOFF source (e.g. Google Fonts legacy API, another CDN, or add the `wawoff2` WOFF2 decompressor: `https://unpkg.com/wawoff2@2.0.1/build/decompress_binding.js` and call `Module.decompress()` before passing the buffer to opentype.js).

Repeat verification for all 11 fonts before proceeding.

- [ ] **Step 3: Commit**

```bash
git add editor.js
git commit -m "feat: add FONT_URLS map and fontBinaryCache for opentype.js text-to-path export"
```

---

### Task 10: Implement `convertTextToPathObjects()` and update export

**Files:**
- Modify: `editor.js` — replace `convertTextToPaths()` (~line 2888), update `exportSVG()` (~line 2935), update `showQuoteForm()` (~line 3038)

- [ ] **Step 1: Browser verify current broken state**

Open editor. Add a text object "Hello". Click "Download Design". Open the downloaded SVG in a text editor. Observe: the SVG contains an `<image>` tag with a base64 PNG data URI instead of a `<text>` or `<path>` element. This is the bug.

- [ ] **Step 2: Add the helper function `loadFont()`**

Immediately before `async function convertTextToPaths()` (~line 2888), insert:

```js
// Load an opentype.Font object, using cache to avoid repeat fetches.
async function loadFont(fontFamily) {
    const key = FONT_URLS[fontFamily] ? fontFamily : FONT_FALLBACK;
    if (fontBinaryCache[key]) return fontBinaryCache[key];
    if (!FONT_URLS[key]) {
        console.warn('No font URL for', fontFamily, '— using fallback');
        return loadFont(FONT_FALLBACK);
    }
    const font = await opentype.load(FONT_URLS[key]);
    fontBinaryCache[key] = font;
    return font;
}
```

- [ ] **Step 3: Add `convertTextToPathObjects()` function**

Immediately after `loadFont()`, insert:

```js
// Convert all text objects on the canvas to fabric.Path vector objects.
// Returns array of { original, converted } — converted is null for non-text objects.
async function convertTextToPathObjects() {
    const objects = canvas.getObjects();
    const result = [];

    for (let i = 0; i < objects.length; i++) {
        const obj = objects[i];

        if (obj.type === 'i-text' || obj.type === 'text') {
            const font = await loadFont(obj.fontFamily || 'Roboto');
            const scale = canvas.scale;
            const fontSize = (obj.realFontSize || (obj.fontSize / scale));
            const lines = (obj.text || '').split('\n');

            // Full line height: ascender + descender magnitude + lineGap
            const lineHeightPx = (font.ascender - font.descender + (font.lineGap || 0))
                                  / font.unitsPerEm * fontSize * scale;

            const pathObjects = [];
            lines.forEach(function(line, lineIndex) {
                const pathData = font.getPath(line, 0, 0, fontSize * scale).toPathData(2);
                if (!pathData) return;

                // Use relative coordinates (0, offset) — the group carries the absolute position.
                // Do NOT set left/top to obj.left/obj.top here; that would double-offset when
                // fabric.Group recomputes child positions relative to the group's own centre.
                const fabricPath = new fabric.Path(pathData, {
                    left: 0,
                    top: lineIndex * lineHeightPx,
                    fill: obj.fill || '#000000',
                    stroke: obj.stroke || null,
                    strokeWidth: obj.strokeWidth || 0,
                    opacity: 1,
                    originX: 'center',
                    originY: 'top',
                    scaleX: 1,
                    scaleY: 1
                });
                pathObjects.push(fabricPath);
            });

            // Wrap all lines in a group (or use the single path directly)
            // The group carries the absolute canvas position from the original text object.
            if (pathObjects.length === 1) {
                pathObjects[0].set({
                    left: obj.left,
                    top: obj.top,
                    angle: obj.angle,
                    opacity: obj.opacity,
                    originX: obj.originX,
                    originY: obj.originY
                });
                result.push({ original: obj, converted: pathObjects[0] });
            } else if (pathObjects.length > 1) {
                const group = new fabric.Group(pathObjects, {
                    left: obj.left,
                    top: obj.top,
                    originX: obj.originX,
                    originY: obj.originY,
                    angle: obj.angle,
                    opacity: obj.opacity
                });
                result.push({ original: obj, converted: group });
            }
        } else {
            result.push({ original: obj, converted: null });
        }
    }

    return result;
}
```

- [ ] **Step 4: Delete the old `convertTextToPaths()` function**

Delete the entire `async function convertTextToPaths() { ... }` block (~lines 2888–2932).

- [ ] **Step 5: Update `exportSVG()` to call `convertTextToPathObjects()`**

Find `const convertedObjects = await convertTextToPaths();` inside `exportSVG()` (~line 2950). Change to:
```js
const convertedObjects = await convertTextToPathObjects();
```

- [ ] **Step 6: Update `showQuoteForm()` to call `convertTextToPathObjects()`**

Find `const convertedObjects = await convertTextToPaths();` inside `showQuoteForm()` (~line 3048). Change to:
```js
const convertedObjects = await convertTextToPathObjects();
```

- [ ] **Step 7: Browser verify — SVG contains path elements not images**

Reload. Add a text object "Test 123". Click "Download Design". In the downloaded SVG file, verify:
- No `<image>` tags present for text
- `<path d="M...">` elements are present for the text content
- Open SVG in a viewer (browser, or Inkscape if available) and confirm text renders as filled vector shapes

- [ ] **Step 8: Browser verify — CorelDraw-style check**

Open the exported SVG in a text editor. Confirm:
- No `font-family` references remain for text that was on canvas
- All text is represented as `<path>` elements with `fill` attributes

- [ ] **Step 9: Commit**

```bash
git add editor.js
git commit -m "feat: text objects now export as vector SVG paths via opentype.js, no font dependency"
```

---

## Chunk 5: Final integration verification

### Task 11: End-to-end verification

- [ ] **Step 1: Full workflow test**

Open editor in browser. Perform this sequence:
1. Add "Circular" UK coins template
2. Select outer coin holder circle — change material to black plastic → verify all contained text/shapes turn white, coin circles unchanged
3. Change material back to Birch Plywood → verify brown colour restored
4. Change material to white plastic → verify light grey on contained objects
5. Add a filled circle → verify birch wood fill
6. Add a filled ellipse → verify birch wood fill
7. Add a text object, type "Hello World", change font to Josefin Sans
8. Add Germany country (filled) → brown fill
9. Add Germany country (outline) → transparent fill, brown stroke
10. Add a text object, type two lines separated by Enter (e.g. "Line One\nLine Two"), export → open SVG and confirm two `<path>` elements are present and vertically separated correctly (not overlapping, not double-offset)
11. Click "Download Design" → open SVG in text editor → confirm no `<image>` tags for text, `<path>` elements present
12. Open SVG in browser → confirm text renders correctly as vector, single and multi-line both positioned correctly

- [ ] **Step 2: Verify undo/redo still works**

Perform several actions, use Ctrl+Z to undo and verify state rolls back correctly.

- [ ] **Step 3: Final commit**

```bash
git add editor.js
git commit -m "chore: end-to-end verified - all 7 fixes complete"
```
