# UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the Design Tool UI for non-technical customers — reorder sections, rename labels, add canvas toolbar, sticky footer, onboarding hint, and other UX improvements without changing any functionality.

**Architecture:** Single-file web app (`editor.js`) containing HTML, CSS, and JavaScript. All changes are to this one file. No build system, no test framework — verification is manual browser testing. Changes are purely presentational/structural.

**Tech Stack:** HTML/CSS/JS, Bootstrap 5.3, Fabric.js, Font Awesome icons

**Spec:** `docs/superpowers/specs/2026-03-19-ux-redesign-design.md`

---

## Chunk 1: Layout Structure & CSS Foundation

### Task 1: Add new CSS styles for sticky layout, toolbar, footer, segmented control, and coin buttons

**Files:**
- Modify: `editor.js` — CSS `<style>` block (lines 18-235)

This task adds all new CSS rules needed by subsequent tasks. Adding CSS first means the HTML changes in later tasks will render correctly immediately.

- [ ] **Step 1: Fix overflow and add CSS for sticky 3-column layout**

First, change line 49 in the existing CSS from `overflow: hidden;` to `overflow: visible;` — this is required for the sticky footer and flex layout to work.

Then, inside the `<style>` block (before the closing `</style>` at line 235), add:

```css
/* Sticky 3-column layout: sidebars scroll, canvas stays fixed */
#design-tool-wrapper .main-layout {
    display: flex;
    gap: 20px;
    height: calc(100vh - 60px); /* full height minus sticky footer */
    max-width: 1800px;
    margin: 0 auto;
    padding: 10px 20px;
}

#design-tool-wrapper .sidebar-left,
#design-tool-wrapper .sidebar-right {
    flex: 0 0 25%;
    max-width: 25%;
    overflow-y: auto;
    overflow-x: hidden;
}

#design-tool-wrapper .canvas-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* On screens below lg breakpoint, stack vertically and scroll normally */
@media (max-width: 991.98px) {
    #design-tool-wrapper .main-layout {
        flex-direction: column;
        height: auto;
        overflow: visible;
    }
    #design-tool-wrapper .sidebar-left,
    #design-tool-wrapper .sidebar-right {
        flex: none;
        max-width: 100%;
        overflow-y: visible;
    }
}
```

- [ ] **Step 2: Add CSS for canvas toolbar**

```css
/* Canvas toolbar */
#design-tool-wrapper .canvas-toolbar {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 10px;
    background: #dbdbdb;
    border-radius: 10px 10px 0 0;
    margin-bottom: 0;
}

#design-tool-wrapper .canvas-toolbar .toolbar-separator {
    width: 1px;
    height: 24px;
    background: #aaa;
    margin: 0 6px;
}

#design-tool-wrapper .canvas-toolbar .btn {
    padding: 4px 8px;
    font-size: 14px;
    line-height: 1;
}

/* Settings dropdown inside toolbar */
#design-tool-wrapper .settings-dropdown {
    position: relative;
    display: inline-block;
}

#design-tool-wrapper .settings-dropdown-content {
    display: none;
    position: absolute;
    right: 0;
    top: 100%;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    padding: 15px;
    min-width: 250px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    color: #333;
}

#design-tool-wrapper .settings-dropdown-content.show {
    display: block;
}
```

- [ ] **Step 3: Add CSS for segmented control (mm/inch)**

```css
/* Segmented control for unit toggle */
#design-tool-wrapper .segmented-control {
    display: inline-flex;
    border: 2px solid var(--lunar-green);
    border-radius: 6px;
    overflow: hidden;
    margin: 8px 0;
}

#design-tool-wrapper .segmented-control button {
    border: none;
    padding: 4px 16px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    background: white;
    color: var(--lunar-green);
    transition: background 0.2s, color 0.2s;
}

#design-tool-wrapper .segmented-control button.active {
    background: var(--lunar-green);
    color: white;
}

#design-tool-wrapper .segmented-control button:not(.active):hover {
    background: #e9ecef;
}
```

- [ ] **Step 4: Add CSS for sticky footer and onboarding hint**

```css
/* Sticky footer for Request Quote */
#design-tool-wrapper .sticky-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--lunar-green);
    padding: 10px 20px;
    text-align: center;
    z-index: 1001;
    box-shadow: 0 -2px 8px rgba(0,0,0,0.2);
}

#design-tool-wrapper .sticky-footer .btn {
    font-size: 18px;
    padding: 10px 40px;
    font-weight: bold;
}

/* Canvas onboarding hint */
#design-tool-wrapper .canvas-hint {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #bbb;
    font-size: 16px;
    text-align: center;
    pointer-events: none;
    z-index: 1;
}
```

- [ ] **Step 5: Add CSS for 20p/50p heptagonal coin buttons**

```css
/* Heptagonal coin buttons for 20p and 50p */
#design-tool-wrapper .coin-buttons .btn.coin-heptagon {
    border-radius: 0;
    clip-path: polygon(50% 0%, 89% 19%, 100% 58%, 78% 91%, 33% 100%, 6% 70%, 11% 28%);
    width: 46px;
    height: 46px;
}

/* Larger coin buttons for legibility */
#design-tool-wrapper .coin-buttons .btn {
    width: 46px;
    height: 46px;
    font-size: 11px;
}
```

- [ ] **Step 6: Add CSS for shape row labels**

```css
/* Shape row labels */
#design-tool-wrapper .shape-row-label {
    font-size: 0.8em;
    font-weight: bold;
    color: #666;
    margin-bottom: 2px;
}
```

- [ ] **Step 7: Verify in browser**

Open `editor.js` in browser. The page should look the same as before — no visual changes yet since the new CSS classes are not applied to any HTML. Confirm no CSS errors in the console.

- [ ] **Step 8: Commit**

```bash
git add editor.js
git commit -m "style: add CSS foundation for UX redesign — toolbar, sticky footer, segmented control, layout"
```

---

### Task 2: Restructure the HTML layout — header, 3-column flex, canvas toolbar, sticky footer

**Files:**
- Modify: `editor.js` — HTML structure (lines 240-628)

This is the core structural change. Replace the Bootstrap grid row with the new flex layout, shrink the header, add the canvas toolbar, move Undo/Redo/Zoom to the toolbar, add the sticky footer, and remove the info badge.

- [ ] **Step 1: Shrink the header**

Replace lines 243-246 (the `header-title` div):

```html
<div class="header-title" style="padding: 8px 0; margin-top: 0; margin-bottom: 0;">
    <h1 style="font-size: 1.4em; margin: 0;">Design Your Custom Product</h1>
</div>
```

- [ ] **Step 2: Replace the Bootstrap row with flex layout**

Remove the `<div class="container-fluid">` wrapper (line 242) — its `max-width` and padding are now handled by `.main-layout`. Replace its opening tag with just a comment or remove it entirely (and remove the matching closing `</div>` near line 627).

Replace line 248 (`<div class="row">`) with:

```html
<div class="main-layout">
```

Replace the left sidebar column opening tag at line 250 (`<div class="col-lg-3 col-md-4">`) with:

```html
<div class="sidebar-left">
```

Replace the center canvas column opening tag at line 424 (`<div class="col-lg-6 col-md-8">`) with:

```html
<div class="canvas-column">
```

Add the canvas toolbar HTML immediately after the canvas column opening tag (before `canvas-container-wrapper`):

```html
<!-- Canvas Toolbar -->
<div class="canvas-toolbar">
    <button class="btn btn-sm btn-outline-secondary" onclick="undo()" id="undoBtn" title="Undo">
        <i class="fas fa-undo"></i>
    </button>
    <button class="btn btn-sm btn-outline-secondary" onclick="redo()" id="redoBtn" title="Redo">
        <i class="fas fa-redo"></i>
    </button>
    <div class="toolbar-separator"></div>
    <button class="btn btn-sm btn-outline-secondary" onclick="zoomIn()" title="Zoom In">
        <i class="fas fa-search-plus"></i>
    </button>
    <button class="btn btn-sm btn-outline-secondary" onclick="zoomOut()" title="Zoom Out">
        <i class="fas fa-search-minus"></i>
    </button>
    <button class="btn btn-sm btn-outline-secondary" onclick="resetZoom()" title="Reset View">
        <i class="fas fa-compress-arrows-alt"></i>
    </button>
    <div class="toolbar-separator"></div>
    <div class="settings-dropdown">
        <button class="btn btn-sm btn-outline-secondary" onclick="toggleSettingsDropdown()" title="Board Size Settings">
            <i class="fas fa-cog"></i>
        </button>
        <div class="settings-dropdown-content" id="settingsDropdown">
            <label class="form-label" style="font-weight: bold;">Board Size</label>
            <select id="canvasSize" class="form-select mb-2">
                <option value="a4">A4 (210 x 297 mm)</option>
                <option value="a3">A3 (297 x 420 mm)</option>
                <option value="a2">A2 (420 x 594 mm)</option>
                <option value="a1">A1 (594 x 841 mm)</option>
                <option value="custom" selected>Custom Size</option>
            </select>
            <div id="customSizeInputs" style="display:block; margin-top:8px;">
                <label class="form-label" style="color: #333; font-size: 12px;" id="customSizeLabel">Enter dimensions in mm:</label>
                <input type="number" id="customWidth" placeholder="Width (mm)" class="form-control mb-2" min="0.1" step="0.01" value="390">
                <input type="number" id="customHeight" placeholder="Height (mm)" class="form-control mb-2" min="0.1" step="0.01" value="390">
            </div>
            <label class="form-label" style="font-weight: bold; margin-top: 8px;">Units</label>
            <div class="segmented-control">
                <button class="active" id="unitMM" onclick="setUnit('mm')">MM</button>
                <button id="unitInch" onclick="setUnit('inch')">INCH</button>
            </div>
        </div>
    </div>
</div>
```

- [ ] **Step 3: Remove the info badge from the canvas**

Remove line 427 (`<div class="info-badge" id="canvasInfo">A3 - 297 x 420 mm</div>`).

- [ ] **Step 4: Add the canvas onboarding hint**

Inside the `canvas-wrapper` div (after the `<canvas>` tag), add:

```html
<div class="canvas-hint" id="canvasHint">
    Choose a template to get started,<br>or add shapes from the left panel
</div>
```

- [ ] **Step 5: Replace right sidebar column tag**

Replace line 434 (`<div class="col-lg-3 col-md-12">`) with:

```html
<div class="sidebar-right">
```

- [ ] **Step 6: Remove History and Zoom sections from right sidebar**

Remove lines 436-457 (the entire "History" heading + Undo/Redo buttons + "Zoom Controls" heading + Zoom In/Out/Reset buttons). These are now in the canvas toolbar.

- [ ] **Step 7: Add sticky footer before the closing wrapper div**

Before the closing `</div>` of `#design-tool-wrapper` (around line 627), add:

```html
<!-- Sticky Footer: Request Quote -->
<div class="sticky-footer">
    <button class="btn btn-light" id="quoteBtn">
        <i class="fas fa-envelope"></i> Request Quote
    </button>
</div>
```

Note: Do NOT remove the old `quoteBtn` here — that happens in Task 4 Step 3 when we clean up the right sidebar.

- [ ] **Step 8: Add Tips & Shortcuts section**

After the closing `</div>` of `main-layout` but before the Quote Modal, add:

```html
<!-- Tips & Shortcuts -->
<!-- 80px top padding clears the 60px sticky footer + breathing room -->
<div style="max-width: 1800px; margin: 0 auto; padding: 80px 20px 20px;">
    <div class="tool-panel">
        <h3>Tips & Shortcuts</h3>
        <div style="display: flex; gap: 40px; flex-wrap: wrap;">
            <div>
                <h5 style="font-size: 0.95em;">Keyboard Shortcuts</h5>
                <table style="font-size: 0.85em;">
                    <tr><td style="padding: 2px 12px 2px 0;"><kbd>Delete</kbd></td><td>Remove selected objects</td></tr>
                    <tr><td style="padding: 2px 12px 2px 0;"><kbd>Ctrl + D</kbd></td><td>Duplicate selected objects</td></tr>
                    <tr><td style="padding: 2px 12px 2px 0;"><kbd>Ctrl + S</kbd></td><td>Download design</td></tr>
                </table>
            </div>
            <div>
                <h5 style="font-size: 0.95em;">Mouse Controls</h5>
                <table style="font-size: 0.85em;">
                    <tr><td style="padding: 2px 12px 2px 0;">Scroll wheel</td><td>Zoom in/out</td></tr>
                    <tr><td style="padding: 2px 12px 2px 0;">Right-click drag</td><td>Pan the canvas</td></tr>
                    <tr><td style="padding: 2px 12px 2px 0;">Alt/Ctrl + drag</td><td>Pan the canvas</td></tr>
                </table>
            </div>
        </div>
    </div>
</div>
```

- [ ] **Step 9: Verify in browser**

Open in browser. Confirm:
- Header is a single compact line
- Three-column layout renders with sidebars scrollable and canvas fixed
- Canvas toolbar appears above the canvas with Undo, Redo, Zoom buttons, and Settings gear
- No info badge on canvas
- Onboarding hint text visible on empty canvas
- Sticky green footer bar with "Request Quote" at bottom
- Tips & Shortcuts section visible below the main tool
- Old Undo/Redo/Zoom sections gone from right sidebar

- [ ] **Step 10: Commit**

```bash
git add editor.js
git commit -m "feat: restructure HTML layout — flex columns, canvas toolbar, sticky footer, onboarding hint"
```

---

## Chunk 2: Sidebar Content Reordering & Label Renames

### Task 3: Reorder left sidebar sections and rename all labels

**Files:**
- Modify: `editor.js` — Left sidebar HTML (lines 250-420 approximately)

- [ ] **Step 1: Reorder left sidebar sections**

Within the left sidebar's `tool-panel` div, rearrange the HTML sections into this order:

1. **Templates** section (currently lines ~298-309) — move to top
2. **Currencies** section (currently lines ~311-350) — move to 2nd
3. **Countries** section (currently lines ~352-406) — move to 3rd
4. **Shapes** section (currently lines ~274-296) — move to 4th
5. **Add Content** section (currently lines ~408-419) — move to 5th

Remove the entire **Canvas Settings** section (lines ~252-272) — this is now in the toolbar settings dropdown.

- [ ] **Step 2: Rename left sidebar section headings**

Update the `<h3>` headings:
- `<h3 class="mt-4">Templates</h3>` → `<h3>Start with a Template</h3>` (first section, no `mt-4`)
- `<h3 class="mt-4">Common Currencies</h3>` → `<h3 class="mt-4">Add Coins</h3>`
- `<h3 class="mt-4">Countries</h3>` → `<h3 class="mt-4">Add Country Outlines</h3>`
- `<h3 class="mt-4">Basic Shapes</h3>` → `<h3 class="mt-4">Add Shapes</h3>`
- `<h3 class="mt-4">Add Content</h3>` → `<h3 class="mt-4">Add Text & Images</h3>`

- [ ] **Step 3: Rename template buttons**

Update the three template button labels:
- `Rectangle` → `Rectangle Coin Display`
- `Circular` → `Circular Coin Display`
- `Pressed Pennies` → `Pressed Penny Collection`

- [ ] **Step 4: Rename currency "All" buttons**

- `Euro (All)` → `Add All Euro Coins`
- `US Dollar (All)` → `Add All US Dollar Coins`
- `UK Pound (All)` → `Add All UK Pound Coins`

- [ ] **Step 5: Add shape row labels and rename Import SVG**

Before each row of shape buttons, add a label:
```html
<div class="shape-row-label">Filled:</div>
```
and
```html
<div class="shape-row-label">Outline:</div>
```

Rename `Import SVG` → `Import Design File`

- [ ] **Step 6: Apply heptagonal CSS class to 20p and 50p buttons**

Add `coin-heptagon` class to the 20p and 50p buttons in the UK Pound section:
```html
<button class="btn btn-sm btn-outline-warning coin-heptagon" onclick="addSingleCoin('20p', 21.55)">20p</button>
```
```html
<button class="btn btn-sm btn-outline-warning coin-heptagon" onclick="addSingleCoin('50p', 27.45)">50p</button>
```

- [ ] **Step 7: Verify in browser**

Confirm:
- Left sidebar sections appear in correct new order: Templates, Coins, Countries, Shapes, Text & Images
- All headings use new names
- Template buttons show new names
- Currency "All" buttons show new names
- Shape rows have "Filled:" and "Outline:" labels
- Import button says "Import Design File"
- 20p and 50p buttons have heptagonal shape
- Canvas Settings no longer appears in the sidebar

- [ ] **Step 8: Commit**

```bash
git add editor.js
git commit -m "feat: reorder left sidebar sections by customer priority, rename all labels"
```

---

### Task 4: Rename right sidebar labels and update action buttons

**Files:**
- Modify: `editor.js` — Right sidebar HTML (lines ~434-576 approximately)

- [ ] **Step 1: Rename property labels**

Update these label texts in the Object Properties panel:
- `Horizontal Position:` → `X:`
- `Vertical Position:` → `Y:`
- `Corner Radius:` → `Corner Roundness:`
- `Rotation (°):` → `Rotation:`
- `Fill Material:` → `Material:`
- `Plastic Color:` → `Color:`
- `Line Color:` → `Outline:`

- [ ] **Step 2: Rename action buttons with shortcut hints**

- `Duplicate Selected` → `Duplicate (Ctrl+D)`
- `Delete Selected` → `Delete (Del)`
- `Clear All` → `Start Over`
- `Download Design` → `Download as SVG`

Remove the eraser icon from "Start Over" and use a refresh icon instead:
```html
<button class="btn btn-warning w-100 mb-2" onclick="clearCanvas()">
    <i class="fas fa-sync-alt"></i> Start Over
</button>
```

- [ ] **Step 3: Remove old Request Quote button from right sidebar**

Delete the "Request Quote" button (line ~573-574) from the Actions section — it's now in the sticky footer.

- [ ] **Step 4: Verify in browser**

Confirm all right sidebar labels show new names. "Start Over", "Download as SVG" buttons visible. No "Request Quote" button in sidebar (only in sticky footer).

- [ ] **Step 5: Commit**

```bash
git add editor.js
git commit -m "feat: rename right sidebar labels and action buttons for clarity"
```

---

## Chunk 3: Quote Form, JavaScript Updates & Behavior Changes

### Task 5: Update the quote form modal

**Files:**
- Modify: `editor.js` — Quote modal HTML (lines ~580-626)

- [ ] **Step 1: Update form field labels and placeholders**

- `Project Name *` → `Design Name *` with placeholder `e.g. Anniversary coin holder`
- `Additional Notes` → `Anything else we should know?` with placeholder `e.g. Quantity needed, deadline, special requests...`
- Update the "Design File" label and description text

- [ ] **Step 2: Add Preferred Material dropdown**

After the Email field and before the "Anything else" textarea, add:

```html
<div class="mb-3">
    <label class="form-label">Preferred Material</label>
    <select class="form-select" id="preferredMaterial" name="preferred_material">
        <option value="">-- Select --</option>
        <option value="birch">Birch Plywood</option>
        <option value="oak">Oak Wood</option>
        <option value="walnut">Walnut Wood</option>
        <option value="acrylic">Acrylic / Plastic</option>
        <option value="other">Other</option>
        <option value="not-sure">Not Sure</option>
    </select>
</div>
```

- [ ] **Step 3: Update design file upload section**

Replace the current file upload section with:

```html
<div class="mb-3">
    <label class="form-label">Upload your own design (optional)</label>
    <p class="text-muted small">Already have a design file? Upload it here (SVG format). Otherwise, your design from the canvas will be included automatically.</p>
    <input type="file" class="form-control" id="designFileInput" name="attachment" accept=".svg">
</div>
```

- [ ] **Step 4: Add design summary section**

Before the `formMessages` div, add:

```html
<div class="mb-3 p-3" style="background: #f0f8f0; border-radius: 8px;" id="designSummary">
    <p class="mb-1" style="font-weight: bold; font-size: 0.9em;"><i class="fas fa-check-circle" style="color: var(--lunar-green);"></i> Your design will be included automatically</p>
    <p class="mb-0 text-muted small" id="designSummaryDetails"></p>
</div>
```

- [ ] **Step 5: Verify in browser**

Open the Request Quote modal. Confirm:
- "Design Name" field with correct placeholder
- "Preferred Material" dropdown appears
- "Anything else we should know?" field with correct placeholder
- Upload section has clarified text
- Green summary box appears

- [ ] **Step 6: Commit**

```bash
git add editor.js
git commit -m "feat: update quote form — rename fields, add material dropdown, design summary"
```

---

### Task 6: Update JavaScript — settings dropdown, unit toggle, clearCanvas, onboarding hint, auto-center, form summary

**Files:**
- Modify: `editor.js` — JavaScript section (lines ~630 onwards)

- [ ] **Step 1: Add settings dropdown toggle function**

Add near the other UI functions:

```javascript
// Toggle settings dropdown
function toggleSettingsDropdown() {
    const dropdown = document.getElementById('settingsDropdown');
    dropdown.classList.toggle('show');
}

// Close settings dropdown when clicking outside
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('settingsDropdown');
    const settingsBtn = e.target.closest('.settings-dropdown');
    if (!settingsBtn && dropdown) {
        dropdown.classList.remove('show');
    }
});
```

- [ ] **Step 2: Update unit toggle to use segmented control**

Replace the existing `unitMM` and `unitInch` click event listeners with a single `setUnit` function:

```javascript
function setUnit(unit) {
    const customWidth = parseFloat(document.getElementById('customWidth').value);
    const customHeight = parseFloat(document.getElementById('customHeight').value);

    if (unit === 'mm' && currentUnit === 'inch' && customWidth && customHeight) {
        document.getElementById('customWidth').value = (customWidth / mmToInch).toFixed(2);
        document.getElementById('customHeight').value = (customHeight / mmToInch).toFixed(2);
    } else if (unit === 'inch' && currentUnit === 'mm' && customWidth && customHeight) {
        document.getElementById('customWidth').value = (customWidth * mmToInch).toFixed(2);
        document.getElementById('customHeight').value = (customHeight * mmToInch).toFixed(2);
    }

    currentUnit = unit;

    // Update segmented control visuals
    document.getElementById('unitMM').classList.toggle('active', unit === 'mm');
    document.getElementById('unitInch').classList.toggle('active', unit === 'inch');

    // Update labels
    if (unit === 'inch') {
        document.getElementById('customSizeLabel').textContent = 'Enter dimensions in inch:';
        document.getElementById('customWidth').placeholder = 'Width (inch)';
        document.getElementById('customHeight').placeholder = 'Height (inch)';
    } else {
        document.getElementById('customSizeLabel').textContent = 'Enter dimensions in mm:';
        document.getElementById('customWidth').placeholder = 'Width (mm)';
        document.getElementById('customHeight').placeholder = 'Height (mm)';
    }

    updateCanvasInfo();
    updatePropertiesPanel();
}
```

Remove the old `unitMM` and `unitInch` addEventListener blocks.

- [ ] **Step 3: Update clearCanvas — remove confirm, preserve undo**

Replace the `clearCanvas` function. Note: `canvas.clear()` triggers `object:removed` events for each object, and the existing `object:removed` handler calls `saveState()`. To avoid multiple spurious history entries during the clear, temporarily suppress state saving using the existing `isUndoing` flag pattern:

```javascript
function clearCanvas() {
    // Temporarily suppress auto-save during bulk removal
    isRedoing = true;
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
    canvas.requestRenderAll();
    isRedoing = false;
    saveState(); // Single clean state after clear
    updateCanvasHint();
}
```

This removes the `confirm()` dialog per spec. Undo works because the pre-clear state is already in the history array — `saveState()` was called on the last modification before "Start Over" was clicked. The new blank state is pushed as the next step, so pressing Undo reverts to the previous design.

- [ ] **Step 4: Add onboarding hint show/hide logic**

Add a function and hook it into canvas events:

```javascript
// Show/hide canvas onboarding hint
function updateCanvasHint() {
    const hint = document.getElementById('canvasHint');
    if (!hint) return;
    hint.style.display = canvas.getObjects().length === 0 ? 'block' : 'none';
}
```

In the `initCanvas` function, add after `saveState()`:

```javascript
updateCanvasHint();
```

In the `canvas.on('object:added')` callback, add `updateCanvasHint();`
In the `canvas.on('object:removed')` callback, add `updateCanvasHint();`

- [ ] **Step 5: Add auto-center on object add**

In the `canvas.on('object:added')` callback, add logic to pan viewport to show the new object:

```javascript
canvas.on('object:added', function(e) {
    saveState();
    updateCanvasHint();

    // Auto-center viewport on newly added object
    var obj = e.target;
    if (obj) {
        var objCenter = obj.getCenterPoint();
        var zoom = canvas.getZoom();
        var vpw = canvas.getWidth() / zoom;
        var vph = canvas.getHeight() / zoom;
        var vpt = canvas.viewportTransform;
        var currentCenterX = -vpt[4] / zoom + vpw / 2;
        var currentCenterY = -vpt[5] / zoom + vph / 2;

        // Only pan if object center is outside current viewport
        var margin = 50;
        var visibleLeft = -vpt[4] / zoom + margin;
        var visibleTop = -vpt[5] / zoom + margin;
        var visibleRight = visibleLeft + vpw - 2 * margin;
        var visibleBottom = visibleTop + vph - 2 * margin;

        if (objCenter.x < visibleLeft || objCenter.x > visibleRight ||
            objCenter.y < visibleTop || objCenter.y > visibleBottom) {
            var panX = -(objCenter.x * zoom - canvas.getWidth() / 2);
            var panY = -(objCenter.y * zoom - canvas.getHeight() / 2);
            canvas.viewportTransform[4] = panX;
            canvas.viewportTransform[5] = panY;
            canvas.requestRenderAll();
        }
    }
});
```

- [ ] **Step 6: Add design summary to quote modal**

In the `showQuoteForm` function, before showing the modal, add:

```javascript
// Update design summary
var summaryDetails = document.getElementById('designSummaryDetails');
if (summaryDetails) {
    var objCount = canvas.getObjects().length;
    var sizeText = canvas.realWidth + ' x ' + canvas.realHeight + ' mm';
    summaryDetails.textContent = 'Canvas: ' + sizeText + ' | Objects: ' + objCount;
}
```

- [ ] **Step 7: Add preferred_material to form submission**

In the form submit handler, add after the other `formData.append` calls:

```javascript
formData.append('preferred_material', document.getElementById('preferredMaterial').value);
```

- [ ] **Step 8: Simplify updateCanvasInfo**

Since the info badge element is removed from the DOM, `updateCanvasInfo` will harmlessly do nothing (it checks `if (canvasInfoEl)` before setting text). Leave the function body as-is — it's safe and may be useful if the badge is re-added later. No changes needed.

- [ ] **Step 9: Verify in browser**

Test each behavior:
- Settings gear opens/closes dropdown with canvas size and unit toggle
- Segmented control switches between mm/inch
- "Start Over" clears without confirm, then Undo restores the design
- Empty canvas shows onboarding hint, hint disappears when object added
- Add an object while panned/zoomed away — viewport pans to show it
- Request Quote modal shows design summary with canvas size and object count
- Form submission includes preferred material

- [ ] **Step 10: Commit**

```bash
git add editor.js
git commit -m "feat: add settings dropdown, segmented toggle, undo-safe clear, onboarding hint, auto-center"
```

---

### Task 7: Final cleanup and verification

**Files:**
- Modify: `editor.js` — various cleanup

- [ ] **Step 1: Remove stale CSS and HTML**

- Remove the old `.unit-toggle` CSS rule (no longer used — the segmented control replaces it)
- Remove the old `.info-badge` CSS rule (no longer used — badge element removed in Task 2)
- Remove the old `.header-title` `margin-top: 80px` from CSS (overridden by inline style in Task 2, but clean up the rule)
- Note: `overflow: hidden` → `overflow: visible` was already done in Task 1 Step 1
- Remove any orphaned `canvasSize` or `unitMM`/`unitInch` `<select>`/`<button>` elements from the old sidebar location if they were duplicated during Task 2

- [ ] **Step 2: Verify the `canvasSize` change event listener still works**

The `canvasSize` select element has moved from the sidebar to the settings dropdown. Confirm the existing `document.getElementById('canvasSize').addEventListener('change', ...)` still binds correctly since the element ID is unchanged.

- [ ] **Step 3: Verify the `customWidth`/`customHeight` change listeners still work**

Same as above — these elements moved to the settings dropdown but keep their IDs. Confirm the existing `addEventListener` calls still bind.

- [ ] **Step 4: Full end-to-end browser test**

Walk through the complete customer journey:
1. Page loads — see onboarding hint on empty canvas
2. Click "Rectangle Coin Display" template — objects appear, hint disappears
3. Select an object — right sidebar shows properties with new labels (X, Y, Material, Color, Outline, etc.)
4. Change Material dropdown — wood pattern applies
5. Click Undo in toolbar — reverts the change
6. Click Settings gear — dropdown shows canvas size and unit toggle
7. Switch to INCH — dimensions update
8. Click "Start Over" — canvas clears, hint reappears
9. Click Undo — design restores
10. Scroll left sidebar — canvas stays fixed
11. Click "Request Quote" in sticky footer — modal opens with design summary
12. Fill form — "Design Name", "Preferred Material" dropdown visible
13. Resize browser to tablet width — layout stacks vertically

- [ ] **Step 5: Commit**

```bash
git add editor.js
git commit -m "chore: clean up stale CSS/HTML, final UX redesign polish"
```
