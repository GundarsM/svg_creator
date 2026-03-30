# Tips & Shortcuts Panels — Design Spec
**Date:** 2026-03-30
**Files affected:** `bg-remover.html`, `converter.html`

## Goal

Add an always-visible "Tips & Shortcuts" section below the main tool area in both files, matching the pattern established in `editor.js`. Helps new users understand the workflow and available controls without hunting for documentation.

---

## Layout & Structure

Each file gets one panel below its main wrapper div, using the existing `tool-panel` CSS class. The panel contains:

- `<h3>Tips & Shortcuts</h3>`
- A flex row with `gap: 40px; flex-wrap: wrap`
- **Left column:** numbered "How to use" steps (`<ol>`)
- **Right column:** Keyboard Shortcuts table + Mouse Controls table (same style as `editor.js`)

The outer wrapper matches `editor.js` exactly:
```html
<div style="max-width: 1800px; margin: 0 auto; padding: 20px 20px 20px;">
  <div class="tool-panel">
    <h3>Tips &amp; Shortcuts</h3>
    <div style="display: flex; gap: 40px; flex-wrap: wrap;">
      <!-- left: how to use -->
      <!-- right: shortcuts tables -->
    </div>
  </div>
</div>
```

No new CSS classes needed — reuses `tool-panel` and `kbd` styling already present.

---

## bg-remover.html Content

### How to use (left column)
```html
<div>
  <h5 style="font-size: 0.95em;">How to use</h5>
  <ol style="font-size: 0.85em; padding-left: 1.2em; margin: 0;">
    <li>Drag &amp; drop an image or click <strong>Open Image</strong></li>
    <li><strong>Smart Removal:</strong> draw a rectangle around the subject — processing starts on mouse release</li>
    <li><strong>Color Match:</strong> click directly on the color to remove — processing starts automatically</li>
    <li>Adjust sliders to fine-tune the result</li>
    <li>Use <strong>Erase</strong> / <strong>Restore</strong> brushes to clean up edges</li>
    <li>Click <strong>Download PNG</strong> or <strong>Copy to Clipboard</strong></li>
  </ol>
</div>
```

### Keyboard Shortcuts (right column, first table)
| Key | Action |
|-----|--------|
| `Ctrl+Z` | Undo brush stroke |
| `Ctrl+Y` | Redo brush stroke |

### Mouse Controls (right column, second table)
| Control | Action |
|---------|--------|
| Drag on image | Draw selection rectangle (Smart mode) |
| Click on image | Pick removal color (Color Match mode) |
| Scroll wheel | Zoom result image |
| Ctrl + drag | Pan result image when zoomed |

---

## converter.html Content

### How to use (left column)
```html
<div>
  <h5 style="font-size: 0.95em;">How to use</h5>
  <ol style="font-size: 0.85em; padding-left: 1.2em; margin: 0;">
    <li>Drag &amp; drop an image or click the upload area</li>
    <li>Choose <strong>Color</strong> mode (full color SVG) or <strong>B&amp;W</strong> mode (black &amp; white silhouette)</li>
    <li>Adjust quality sliders to control detail, smoothness, and color count</li>
    <li>Click <strong>Convert to SVG</strong></li>
    <li>Click <strong>Preview SVG</strong> to inspect, or <strong>Download SVG</strong> to save</li>
  </ol>
</div>
```

### Mouse Controls (right column — no keyboard shortcuts)
| Control | Action |
|---------|--------|
| Drag &amp; drop | Upload image directly |

---

## Placement

**bg-remover.html:** Insert the panel immediately after the closing `</div><!-- /container-fluid -->` line (end of `#bg-remover-wrapper`), before `</body>`.

**converter.html:** Insert the panel after the closing tag of the main tool wrapper div, before `</body>`.

---

## Out of scope
- No changes to existing CSS or JS
- No changes to the tool functionality
- No responsive breakpoint changes (flex-wrap handles narrow screens already)
