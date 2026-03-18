# SVG Editor — Round 2 Fixes Design Spec
**Date:** 2026-03-18
**File:** `editor.js`
**Approach:** Direct fixes, minimal architectural changes

---

## Item 1 — Rectangle Spawns with Birch Plywood Fill

In `addShape()`, `case 'rectangle':` currently sets `fill: '#3498db'` (blue).

**Change:**
- Add birch pattern guard before the `switch` block (identical guard already used for circle/ellipse).
- Inside `case 'rectangle':` set `fill: woodPatterns['birch']` and `shape.materialType = 'birch'` before `break`.
- The existing post-switch guard (`if (!shape.materialType) { shape.materialType = 'color'; }`) already prevents overwriting — no change needed there.

---

## Item 2 — 20p and 50p Coin Slots: Match Circular Slots

In `addTemplate()`, `uk-coins` branch, the 20p and 50p coin shapes are created as `fabric.Path` objects from SVG path data. Their fill is `#ffffff` (same as circular coin slots) but they render invisibly white-on-white due to a path fill-rule issue (heptagonal SVG paths with ambiguous winding direction do not reliably fill with Fabric.js defaults).

**Change:** Add `fillRule: 'nonzero'` explicitly to the 20p and 50p `fabric.Path` constructor options. Keep `fill: '#ffffff'` and `stroke: '#5c3316'`. Result: white fill with brown outline, matching the circular coin slots.

---

## Item 3 — Label Alignment Fixes

Two distinct causes:

**Cause A — "Horizontal Position:" wraps to 2 lines**

The label is longer than half the panel width and wraps, misaligning the input field below it relative to "Vertical Position:".

Fix: Add `white-space: nowrap; font-size: 0.85em;` to both labels in that row. This prevents wrapping and scales the text slightly smaller to fit. No label text changes.

Apply the same fix to any other label pair in the properties panel where wrapping is a risk (e.g. "Corner Radius:" / "Rotation (°):").

**Cause B — "Plastic Color" / "Line Color" column height mismatch**

The left column contains a `<select>` element; the right column contains a `<div class="color-picker-group">` with two `<input>` elements side by side. The two columns have different internal heights, causing visual imbalance.

Fix: Add `align-items: flex-start` to the wrapping flex row (`<div class="control-group" style="display: flex; gap: 8px;">`). This anchors both columns to their label tops, making the row visually consistent regardless of content height differences.

---

## Item 4 — Action Buttons: Duplicate Green + Mirror + Rotate

**Current layout:**
```
[Duplicate Selected]   ← full-width, no colour class
[Delete Selected]      ← full-width, btn-danger
```

**New layout:**
```
[Duplicate Selected]              ← full-width, btn-success (green)
[↔ Mirror H | ↕ Mirror V | ↻ 90°] ← three equal-width buttons, one row
[Delete Selected]                 ← unchanged
```

**Button HTML (row 2):**
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

**New JS functions** (add near `duplicateSelected()`):

`mirrorHorizontal()`:
- Get active object. If `activeSelection`, flip the whole selection as a unit: `obj.set('scaleX', obj.scaleX * -1)`.
- Call `obj.setCoords()` and `canvas.requestRenderAll()`, then `saveState()`.

`mirrorVertical()`:
- Same but `scaleY`: `obj.set('scaleY', obj.scaleY * -1)`.

`rotate90()`:
- `obj.rotate((obj.angle + 90) % 360)`.
- Call `obj.setCoords()` and `canvas.requestRenderAll()`, then `saveState()`.

All three functions: guard with `if (!canvas.getActiveObject()) return;`.

---

## Item 5 — Font Selector: Remove "(was X)" Labels

In the `<select id="fontFamily">` element, strip the parenthetical annotation from all 11 option display texts:

| Before | After |
|---|---|
| `Roboto (was Arial)` | `Roboto` |
| `Lora (was Times New Roman)` | `Lora` |
| `Inconsolata (was Courier New)` | `Inconsolata` |
| `Open Sans (was Verdana)` | `Open Sans` |
| `Nunito (was Calibri)` | `Nunito` |
| `Josefin Sans (was Century Gothic)` | `Josefin Sans` |
| `Anton (was Impact)` | `Anton` |
| `Patrick Hand (was Comic Sans)` | `Patrick Hand` |
| `EB Garamond (was Garamond)` | `EB Garamond` |
| `PT Sans (was Lucida Sans)` | `PT Sans` |
| `Cormorant Garamond (was IvyMode)` | `Cormorant Garamond` |

Option `value` attributes are unchanged — font application logic is unaffected.

---

## Item 6 — Country Outline: Blue Colour, 0.5 Stroke Width

In `addCountryOutline()`, change:
- `stroke: '#5c3316'` → `stroke: '#0000FF'`
- `strokeWidth: 3` → `strokeWidth: 0.5`

`fill: 'transparent'` is unchanged.

---

## Item 7 — Countries Section: 3-Element Row Layout

Each country row changes from 2 equal buttons to a 3-element flex row:
- **Text label** (country name, `flex: 1`, left-aligned)
- **Solid button** (calls `addCountry(name)`)
- **Outline button** (calls `addCountryOutline(name)`)

**Row template:**
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
```

Apply to all 6 countries: USA, UK, Australia, Canada, Germany, Italy.

Note: the Solid button label changes from the country name (e.g. "USA") to "Solid" — the country name is now the text label on the left. The Outline button label is unchanged.

---

## Out of Scope
- Changes to any template other than the UK coins 20p/50p fix
- Changes to the Germany Euro or Precious Memories templates
- Any refactoring of unrelated code
