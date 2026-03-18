# SVG Editor Round 2 Fixes — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply 7 UI and behaviour fixes to `editor.js`: rectangle birch fill, 20p/50p coin visibility, label alignment, new action buttons, font label cleanup, country outline colour, and countries row layout.

**Architecture:** All changes in one file (`editor.js`, ~3300 lines). No build system. Manual browser verification only. No automated tests exist.

**Tech Stack:** Fabric.js 5.3.0, Bootstrap 5.3, Font Awesome 6.4.0, vanilla JS

**Spec:** `docs/superpowers/specs/2026-03-18-svg-editor-fixes-2-design.md`

---

## Chunk 1: Simple Value Fixes (Items 1, 5, 6)

### Task 1: Rectangle spawns with birch plywood fill (Item 1)

**Files:**
- Modify: `editor.js` — `addShape()` function, `case 'rectangle':` block (~lines 1108–1126)

- [ ] **Step 1: Change rectangle fill and add materialType**

Find `case 'rectangle':` at line 1108. The `fabric.Rect` constructor currently has `fill: '#3498db'` at line 1114.

Make two changes inside `case 'rectangle':`:

Change line 1114 from:
```js
fill: '#3498db',
```
to:
```js
fill: woodPatterns['birch'],
```

After `shape.realCornerRadius = 3;` (line 1125) and before `break;`, insert:
```js
shape.materialType = 'birch';
```

The birch pattern guard (`if (!woodPatterns['birch'])`) already exists at lines 1099–1105, before the `switch`. The post-switch guard at lines 1218–1220 (`if (!shape.materialType) { shape.materialType = 'color'; }`) already prevents overwriting. No further changes needed.

- [ ] **Step 2: Verify by reading back**

Read lines 1108–1130 and confirm:
- `fill: woodPatterns['birch'],` at the Rect constructor
- `shape.materialType = 'birch';` present after `shape.realCornerRadius = 3;`
- `break;` still present

- [ ] **Step 3: Commit**

```bash
git add editor.js
git commit -m "fix: rectangle now spawns with birch plywood fill"
```

---

### Task 2: Font selector — remove "(was X)" labels (Item 5)

**Files:**
- Modify: `editor.js` — `<select id="fontFamily">` (~lines 523–534)

- [ ] **Step 1: Strip parenthetical annotations from all 11 option texts**

Find `<select id="fontFamily" class="form-select">` (~line 523). Replace the entire contents (all `<option>` elements) with:

```html
<option value="Roboto">Roboto</option>
<option value="Lora">Lora</option>
<option value="Inconsolata">Inconsolata</option>
<option value="Open Sans">Open Sans</option>
<option value="Nunito">Nunito</option>
<option value="Josefin Sans">Josefin Sans</option>
<option value="Anton">Anton</option>
<option value="Patrick Hand">Patrick Hand</option>
<option value="EB Garamond">EB Garamond</option>
<option value="PT Sans">PT Sans</option>
<option value="Cormorant Garamond">Cormorant Garamond</option>
```

The `value` attributes are unchanged. Do not modify anything outside this select element.

- [ ] **Step 2: Verify by reading back**

Read the font select element and confirm: 11 options, no "(was X)" text in any of them, all `value` attributes intact.

- [ ] **Step 3: Commit**

```bash
git add editor.js
git commit -m "fix: remove '(was X)' annotations from font selector options"
```

---

### Task 3: Country outline colour and stroke width (Item 6)

**Files:**
- Modify: `editor.js` — `addCountryOutline()` function (~lines 1261–1291)

- [ ] **Step 1: Change stroke to blue, strokeWidth to 0.5**

Find `function addCountryOutline(country)` at line 1261. Inside the `shape.set({...})` call:

Change line 1273 from:
```js
stroke: '#5c3316',
```
to:
```js
stroke: '#0000FF',
```

Change line 1274 from:
```js
strokeWidth: 3,
```
to:
```js
strokeWidth: 0.5,
```

`fill: 'transparent'` is unchanged.

- [ ] **Step 2: Verify by reading back**

Read lines 1269–1280 and confirm `stroke: '#0000FF'` and `strokeWidth: 0.5`.

- [ ] **Step 3: Commit**

```bash
git add editor.js
git commit -m "fix: country outline spawns with blue stroke (#0000FF) and 0.5 stroke width"
```

---

## Chunk 2: 20p/50p Coin Visibility Fix (Item 2)

### Task 4: Fix 20p and 50p coin fill rule at all three code sites

**Files:**
- Modify: `editor.js` — three `fabric.Path` constructor calls for 20p/50p shapes

The 20p and 50p coin shapes are created as `fabric.Path` objects in three places. All three need `fillRule: 'nonzero'` added, and any sites where `stroke` is `'#ffffff'` must be changed to `'#5c3316'`.

**Site 1:** `addTemplate()` uk-coins layout branch (~line 1482) — `stroke: '#ffffff'` (wrong, needs fixing)
**Site 2:** `addSingleCoin()` function (~line 1570) — stroke already `'#5c3316'` (correct)
**Site 3:** `addTemplate()` uk-coins ring template (~line 1894) — stroke already `'#5c3316'` (correct)

- [ ] **Step 1: Fix Site 1 (~line 1482)**

Find the `fabric.Path` constructor at line 1482 that reads:
```js
shape = new fabric.Path(scaledPath, {
    fill: '#ffffff', // White canvas background color
    stroke: '#ffffff',
    strokeWidth: 0.1,
    strokeUniform: true,
    left: 0,
    top: 0
});
```

Replace it with:
```js
shape = new fabric.Path(scaledPath, {
    fill: '#ffffff',
    fillRule: 'nonzero',
    stroke: '#5c3316',
    strokeWidth: 0.1,
    strokeUniform: true,
    left: 0,
    top: 0
});
```

Note: this constructor does NOT have `originX`/`originY` — do not add them; positioning is corrected by the subsequent `.set({ left: ..., top: ... })` call that re-centres the path using `getBoundingRect()`.

- [ ] **Step 2: Fix Site 2 (~line 1570)**

Find the `fabric.Path` constructor at line 1570 that reads:
```js
shape = new fabric.Path(scaledPath, {
    fill: coinColor,
    stroke: '#5c3316',
    strokeWidth: 0.1,
    strokeUniform: true,
    left: 0,
    top: 0
});
```

Add `fillRule: 'nonzero'` after `fill: coinColor,`:
```js
shape = new fabric.Path(scaledPath, {
    fill: coinColor,
    fillRule: 'nonzero',
    stroke: '#5c3316',
    strokeWidth: 0.1,
    strokeUniform: true,
    left: 0,
    top: 0
});
```

Do not change `fill: coinColor` — leave the variable reference intact.

- [ ] **Step 3: Fix Site 3 (~line 1894)**

Find the `fabric.Path` constructor at line 1894 that reads:
```js
coinShape = new fabric.Path(scaledPath, {
    fill: '#ffffff',
    stroke: '#5c3316',
    strokeWidth: 0.1,
    strokeUniform: true,
    left: 0,
    top: 0,
    originX: 'center',
    originY: 'center'
});
```

Add `fillRule: 'nonzero'` after `fill: '#ffffff',`:
```js
coinShape = new fabric.Path(scaledPath, {
    fill: '#ffffff',
    fillRule: 'nonzero',
    stroke: '#5c3316',
    strokeWidth: 0.1,
    strokeUniform: true,
    left: 0,
    top: 0,
    originX: 'center',
    originY: 'center'
});
```

- [ ] **Step 4: Verify all three sites**

Search the file for all `fabric.Path(scaledPath` occurrences and confirm each has `fillRule: 'nonzero'`. Confirm Site 1 no longer has `stroke: '#ffffff'`.

- [ ] **Step 5: Commit**

```bash
git add editor.js
git commit -m "fix: 20p and 50p coin shapes now fill correctly with nonzero fill rule"
```

---

## Chunk 3: Label Alignment (Item 3)

### Task 5: Fix property panel label alignment

**Files:**
- Modify: `editor.js` — properties panel HTML (~lines 459–520)

Two fixes:
- **Cause A:** Labels in flex rows wrap to 2 lines on narrow panels. Fix: `white-space: nowrap; font-size: 0.85em;` on each label.
- **Cause B:** "Plastic Color" (select) and "Line Color" (div with 2 inputs) have different heights. Fix: `align-items: flex-start` on their wrapping flex row.

- [ ] **Step 1: Fix Cause A — Horizontal/Vertical Position labels (lines 461, 465)**

Find lines 461 and 465:
```html
<label>Horizontal Position:</label>
...
<label>Vertical Position:</label>
```

Change both to:
```html
<label style="white-space: nowrap; font-size: 0.85em;">Horizontal Position:</label>
...
<label style="white-space: nowrap; font-size: 0.85em;">Vertical Position:</label>
```

- [ ] **Step 2: Fix Cause A — Corner Radius / Rotation labels (lines 481, 485)**

Find lines 481 and 485:
```html
<label>Corner Radius:</label>
...
<label>Rotation (°):</label>
```

Change both to:
```html
<label style="white-space: nowrap; font-size: 0.85em;">Corner Radius:</label>
...
<label style="white-space: nowrap; font-size: 0.85em;">Rotation (°):</label>
```

- [ ] **Step 3: Fix Cause B — Plastic Color / Line Color flex container (line 498)**

Find line 498:
```html
<div class="control-group" style="display: flex; gap: 8px;">
```
(This is the specific flex row wrapping the `fillColorGroup` and `strokeColorGroup` divs — identified by the fact that its first child has `id="fillColorGroup"`.)

Change to:
```html
<div class="control-group" style="display: flex; gap: 8px; align-items: flex-start;">
```

- [ ] **Step 4: Verify by reading back**

Read lines 459–520 and confirm:
- Both position labels have the `white-space: nowrap; font-size: 0.85em;` style
- Both Corner Radius / Rotation labels have the same style
- The Plastic Color / Line Color flex row has `align-items: flex-start`

- [ ] **Step 5: Commit**

```bash
git add editor.js
git commit -m "fix: property panel label alignment — prevent wrapping, align flex columns to top"
```

---

## Chunk 4: Action Buttons (Item 4)

### Task 6: Duplicate button green + Mirror H/V + Rotate 90° buttons

**Files:**
- Modify: `editor.js` — Duplicate button HTML (~line 541), JS functions after `duplicateSelected()` (~line 2661)

- [ ] **Step 1: Make Duplicate button green**

Find line 541:
```html
<button class="btn w-100 mt-3" onclick="duplicateSelected()">
```

Change to:
```html
<button class="btn btn-success w-100 mt-3" onclick="duplicateSelected()">
```

- [ ] **Step 2: Add Mirror H/V and Rotate 90° buttons after Duplicate**

After the closing `</button>` of the Duplicate button (line 543) and before the Delete button (line 544), insert:

```html
<div style="display: flex; gap: 4px; margin-top: 4px;">
    <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" onclick="mirrorHorizontal()">
        <i class="fas fa-arrows-alt-h"></i> Mirror H
    </button>
    <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" onclick="mirrorVertical()">
        <i class="fas fa-arrows-alt-v"></i> Mirror V
    </button>
    <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" onclick="rotate90()">
        <i class="fas fa-redo"></i> 90°
    </button>
</div>
```

- [ ] **Step 3: Add mirrorHorizontal(), mirrorVertical(), rotate90() functions**

Find `function duplicateSelected()` at line 2661. Immediately before it (the preceding function closes with `}` at line 2658; line 2659 is a blank line), insert:

```js
// Mirror selected object(s) horizontally (flip on vertical axis)
function mirrorHorizontal() {
    const obj = canvas.getActiveObject();
    if (!obj) return;
    obj.set('scaleX', obj.scaleX * -1);
    obj.setCoords();
    canvas.requestRenderAll();
    saveState();
}

// Mirror selected object(s) vertically (flip on horizontal axis)
function mirrorVertical() {
    const obj = canvas.getActiveObject();
    if (!obj) return;
    obj.set('scaleY', obj.scaleY * -1);
    obj.setCoords();
    canvas.requestRenderAll();
    saveState();
}

// Rotate selected object(s) 90 degrees clockwise
function rotate90() {
    const obj = canvas.getActiveObject();
    if (!obj) return;
    obj.rotate((obj.angle + 90) % 360);
    obj.setCoords();
    canvas.requestRenderAll();
    saveState();
}
```

These functions work on both single objects and `activeSelection` (Fabric.js applies transformations to the selection as a unit).

- [ ] **Step 4: Verify HTML changes**

Read lines 541–547 and confirm:
- Duplicate button has `btn-success` class
- The 3-button flex row is present between Duplicate and Delete buttons

- [ ] **Step 5: Verify JS functions**

Read the 3 new functions and confirm `mirrorHorizontal`, `mirrorVertical`, and `rotate90` are all present with correct logic.

- [ ] **Step 6: Commit**

```bash
git add editor.js
git commit -m "feat: duplicate button green, add mirror horizontal/vertical and rotate 90deg buttons"
```

---

## Chunk 5: Countries UI (Item 7)

### Task 7: Countries section — 3-element row layout

**Files:**
- Modify: `editor.js` — Countries HTML section (~lines 353–400)

- [ ] **Step 1: Replace all 6 country rows with 3-element layout**

Find the Countries section starting at line 353. Replace the entire block of 6 rows (lines 353–400) with:

```html
<div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
    <span style="flex: 1; font-size: 0.9em;">USA</span>
    <button class="btn btn-sm btn-outline-success" onclick="addCountry('usa')">
        <i class="fas fa-map"></i> Solid
    </button>
    <button class="btn btn-sm btn-outline-success" onclick="addCountryOutline('usa')">
        <i class="far fa-map"></i> Outline
    </button>
</div>
<div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
    <span style="flex: 1; font-size: 0.9em;">UK</span>
    <button class="btn btn-sm btn-outline-success" onclick="addCountry('uk')">
        <i class="fas fa-map"></i> Solid
    </button>
    <button class="btn btn-sm btn-outline-success" onclick="addCountryOutline('uk')">
        <i class="far fa-map"></i> Outline
    </button>
</div>
<div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
    <span style="flex: 1; font-size: 0.9em;">Australia</span>
    <button class="btn btn-sm btn-outline-success" onclick="addCountry('australia')">
        <i class="fas fa-map"></i> Solid
    </button>
    <button class="btn btn-sm btn-outline-success" onclick="addCountryOutline('australia')">
        <i class="far fa-map"></i> Outline
    </button>
</div>
<div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
    <span style="flex: 1; font-size: 0.9em;">Canada</span>
    <button class="btn btn-sm btn-outline-success" onclick="addCountry('canada')">
        <i class="fas fa-map"></i> Solid
    </button>
    <button class="btn btn-sm btn-outline-success" onclick="addCountryOutline('canada')">
        <i class="far fa-map"></i> Outline
    </button>
</div>
<div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
    <span style="flex: 1; font-size: 0.9em;">Germany</span>
    <button class="btn btn-sm btn-outline-success" onclick="addCountry('germany')">
        <i class="fas fa-map"></i> Solid
    </button>
    <button class="btn btn-sm btn-outline-success" onclick="addCountryOutline('germany')">
        <i class="far fa-map"></i> Outline
    </button>
</div>
<div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
    <span style="flex: 1; font-size: 0.9em;">Italy</span>
    <button class="btn btn-sm btn-outline-success" onclick="addCountry('italy')">
        <i class="fas fa-map"></i> Solid
    </button>
    <button class="btn btn-sm btn-outline-success" onclick="addCountryOutline('italy')">
        <i class="far fa-map"></i> Outline
    </button>
</div>
```

Note: `style="flex: 1;"` has been removed from buttons — they are now natural-width. The `<span>` takes `flex: 1` instead.

- [ ] **Step 2: Verify by reading back**

Read the countries section and confirm:
- 6 rows present
- Each row has a `<span>` with the country name and `flex: 1`
- Each row has two buttons: one calling `addCountry(...)`, one calling `addCountryOutline(...)`
- Button labels are "Solid" and "Outline" (not the country name)
- All 6 countries covered: USA, UK, Australia, Canada, Germany, Italy

- [ ] **Step 3: Commit**

```bash
git add editor.js
git commit -m "feat: countries section now shows name label with Solid/Outline buttons per country"
```

---

## Chunk 6: Final verification

### Task 8: End-to-end browser verification

No code changes. Open `editor.js` in a browser and verify all 7 fixes:

- [ ] **Rectangle:** Add a filled rectangle — spawns with birch wood texture. Properties panel shows "Birch Plywood" material.
- [ ] **20p/50p coins:** Add UK coins template — 20p and 50p shapes render with white fill and brown outline, matching the circular coin slots. Also click "20p" and "50p" sidebar buttons — same appearance.
- [ ] **Label alignment:** Open properties panel (select any object) — "Horizontal Position:" and "Vertical Position:" labels stay on one line each, inputs are aligned. "Plastic Color:" and "Line Color:" columns align at the top.
- [ ] **Duplicate button:** Confirm green colour. Select an object and click "Duplicate Selected" — works as before.
- [ ] **Mirror H:** Select an object, click Mirror H — flips horizontally.
- [ ] **Mirror V:** Select an object, click Mirror V — flips vertically.
- [ ] **Rotate 90°:** Select an object, click 90° — rotates 90° clockwise.
- [ ] **Font selector:** Open font dropdown — no "(was X)" annotations, 11 clean font names.
- [ ] **Country outline:** Click any country Outline button — spawns with blue (`#0000FF`) thin outline and transparent fill.
- [ ] **Countries layout:** Countries section shows name label + Solid + Outline buttons in each row.

- [ ] **Commit if any final tweaks were needed**

```bash
git add editor.js
git commit -m "chore: end-to-end verified - all 7 round 2 fixes complete"
```
