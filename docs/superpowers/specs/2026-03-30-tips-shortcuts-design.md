# Tips & Shortcuts Panels — Design Spec
**Date:** 2026-03-30
**Files affected:** `bg-remover.html`, `converter.html`

## Goal

Add an always-visible "Tips & Shortcuts" section below the main tool area in both files, matching the pattern established in `editor.js`. Helps new users understand the workflow and available controls.

---

## Layout & Structure

Each file gets one panel. A local `tips-panel` CSS class is added to each file's `<style>` block (the class does not exist in either file currently):

```css
.tips-panel {
  background: #dbdbdb;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  color: #333;
  margin-bottom: 20px;
}
.tips-panel h3 { margin-top: 0; }
.tips-panel kbd {
  background: #eee;
  border: 1px solid #bbb;
  border-radius: 3px;
  padding: 1px 5px;
  font-size: 0.85em;
}
```

The panel HTML wrapper:
```html
<div style="max-width: 900px; margin: 0 auto; padding: 20px;">
  <div class="tips-panel">
    <h3>Tips &amp; Shortcuts</h3>
    <div style="display: flex; gap: 40px; flex-wrap: wrap;">
      <!-- left: how to use -->
      <!-- right: shortcuts tables -->
    </div>
  </div>
</div>
```

---

## bg-remover.html Content

### Pre-condition: file has duplicate content
`bg-remover.html` currently contains two HTML documents concatenated. Line 822 reads: `for (let i = 0; i < w * h; i++) data[i * 4 + 3] = src[i];<!DOCTYPE html>` — the old document's last JS statement and the new document's opening tag share the same line with no newline between them. The old document (everything before `<!DOCTYPE html>` on line 822) is an outdated copy.

**Before inserting the panel, the implementer must:**
1. Delete lines 1–821 entirely
2. On the remaining first line (was line 822), delete everything up to and including `src[i];` — leaving the line starting cleanly with `<!DOCTYPE html>`

After cleanup, the file starts with `<!DOCTYPE html>` and has one `</div><!-- /bg-remover-wrapper -->` followed by one `<script>` block.

### Placement
Insert immediately after `</div><!-- /bg-remover-wrapper -->` (the single wrapper closing tag after cleanup), before the `<script>` block.

### How to use (left column)
```html
<div>
  <h5 style="font-size: 0.95em;">How to use</h5>
  <ol style="font-size: 0.85em; padding-left: 1.2em; margin: 0;">
    <li>Drag &amp; drop an image onto the upload area, or click it to browse</li>
    <li><strong>Smart Removal</strong> (default): draw a rectangle around the subject, then click <strong>Remove Background</strong></li>
    <li><strong>Color Match:</strong> click directly on the color to remove — processing starts automatically</li>
    <li>Adjust sliders to fine-tune; in Smart mode click <strong>Remove Background</strong> to re-run</li>
    <li>Use <strong>Erase</strong> / <strong>Restore</strong> brushes to clean up edges</li>
    <li>Click <strong>Download PNG</strong> or <strong>Copy to Clipboard</strong></li>
  </ol>
</div>
```

### Keyboard Shortcuts (right column, first table)
| Key | Action |
|-----|--------|
| `Ctrl+Z` | Undo brush stroke |
| `Ctrl+Y` or `Ctrl+Shift+Z` | Redo brush stroke |

### Mouse Controls (right column, second table)
| Control | Action |
|---------|--------|
| Drag on image | Draw selection rectangle (Smart mode) |
| Click on image | Pick removal color (Color Match mode) |
| Scroll wheel | Zoom result image |
| Drag (no brush active) or Ctrl+drag | Pan result image |

---

## converter.html Content

### Placement
Insert immediately after `</div><!-- /converter-wrapper -->` (line 282), before the `<script>` tags.

### How to use (left column)
```html
<div>
  <h5 style="font-size: 0.95em;">How to use</h5>
  <ol style="font-size: 0.85em; padding-left: 1.2em; margin: 0;">
    <li>Drag &amp; drop an image or click the upload area to browse</li>
    <li>Choose <strong>Photo / Color</strong> (full color SVG) or <strong>Black &amp; White</strong> (silhouette)</li>
    <li>Adjust quality sliders to control detail, smoothness, and color count</li>
    <li>Click <strong>Convert</strong></li>
    <li>Download as <strong>SVG</strong>, <strong>EPS</strong>, or <strong>DXF</strong></li>
  </ol>
</div>
```

### Mouse Controls (right column — no keyboard shortcuts)
| Control | Action |
|---------|--------|
| Drag &amp; drop | Upload image directly |
| Drag on SVG preview | Pan the result |
| Zoom slider / + − / Reset | Zoom the result in/out |

---

## Out of scope
- No changes to existing tool functionality or JS
- No responsive breakpoint changes (`flex-wrap` handles narrow screens)
