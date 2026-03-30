# Tips & Shortcuts Panels — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add always-visible "Tips & Shortcuts" panels below the main tool area in `bg-remover.html` and `converter.html`.

**Architecture:** Pure HTML/CSS additions — no JS changes. Each file gets a `.tips-panel` CSS class added to its `<style>` block and a Tips & Shortcuts div inserted after its main wrapper closing tag. `bg-remover.html` also requires a pre-step to remove a duplicate old document that is concatenated into the file.

**Spec:** `docs/superpowers/specs/2026-03-30-tips-shortcuts-design.md`

**Tech Stack:** Vanilla HTML/CSS, Bootstrap 5.3.0 (already loaded), no build system.

---

## Chunk 1: bg-remover.html

### Task 1: Remove duplicate old document from bg-remover.html

The file currently contains two complete HTML documents concatenated. The old document ends and the new one starts mid-way through line 822:
`for (let i = 0; i < w * h; i++) data[i * 4 + 3] = src[i];<!DOCTYPE html>`

**Files:**
- Modify: `bg-remover.html`

- [ ] **Step 1: Confirm the split point**

Run:
```bash
sed -n '820,824p' "c:/Users/GundarsM/Documents/svg_editor/bg-remover.html"
```
Expected: line 822 contains `src[i];<!DOCTYPE html>` on the same line.

- [ ] **Step 2: Extract only the current (second) document**

Run this Python snippet to strip everything before the second `<!DOCTYPE html>`:
```bash
python3 -c "
import re
with open('c:/Users/GundarsM/Documents/svg_editor/bg-remover.html', 'r', encoding='utf-8') as f:
    content = f.read()
# Find the SECOND occurrence of '<!DOCTYPE html>'
first = content.find('<!DOCTYPE html>')
second = content.find('<!DOCTYPE html>', first + 1)
with open('c:/Users/GundarsM/Documents/svg_editor/bg-remover.html', 'w', encoding='utf-8') as f:
    f.write(content[second:])
print('Done. File now starts at second DOCTYPE.')
"
```

- [ ] **Step 3: Verify cleanup**

Run:
```bash
grep -c "<!DOCTYPE html>" "c:/Users/GundarsM/Documents/svg_editor/bg-remover.html"
grep -c "</html>" "c:/Users/GundarsM/Documents/svg_editor/bg-remover.html"
grep -c "</div><!-- /bg-remover-wrapper -->" "c:/Users/GundarsM/Documents/svg_editor/bg-remover.html"
```
Expected output: `1` for each — one DOCTYPE, one `</html>`, one wrapper close.

---

### Task 2: Add .tips-panel CSS to bg-remover.html

**Files:**
- Modify: `bg-remover.html` (inside the `<style>` block, before `</style>`)

The `<style>` block's closing tag `</style>` is preceded by various scoped rules. Add the new class before `</style>`.

- [ ] **Step 1: Read the file to confirm the closing style tag**

Use the Read tool to view the last few lines of the `<style>` block. Look for `</style>` around line 190 (after cleanup the file will have ~1398 lines total).

- [ ] **Step 2: Insert .tips-panel CSS before </style>**

Use the Edit tool. The anchor is the `#brush-cursor` block (last rule before `</style>`). Match this exact string:

```
      #brush-cursor {
        position: fixed;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 1px rgba(0,0,0,0.6);
        pointer-events: none;
        display: none;
        transform: translate(-50%, -50%);
        z-index: 9999;
      }
  </style>
```

Replace with (preserve the original rule, append new CSS before `</style>`):
```
      #brush-cursor {
        position: fixed;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 0 0 1px rgba(0,0,0,0.6);
        pointer-events: none;
        display: none;
        transform: translate(-50%, -50%);
        z-index: 9999;
      }

  /* Tips & Shortcuts panel */
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
  </style>
```

- [ ] **Step 3: Verify CSS was added**

Run:
```bash
grep -n "tips-panel" "c:/Users/GundarsM/Documents/svg_editor/bg-remover.html"
```
Expected: 3+ matches (`.tips-panel {`, `.tips-panel h3`, `.tips-panel kbd`).

---

### Task 3: Insert Tips & Shortcuts panel HTML into bg-remover.html

**Files:**
- Modify: `bg-remover.html` (after `</div><!-- /bg-remover-wrapper -->`)

- [ ] **Step 1: Locate the insertion point**

Run:
```bash
grep -n "bg-remover-wrapper\|^<script" "c:/Users/GundarsM/Documents/svg_editor/bg-remover.html" | head -10
```
Expected: one `</div><!-- /bg-remover-wrapper -->` line immediately followed by a `<script>` line.

- [ ] **Step 2: Insert the panel HTML**

Use the Edit tool to find:
```
</div><!-- /bg-remover-wrapper -->

<script>
```

Replace with:
```
</div><!-- /bg-remover-wrapper -->

<div style="max-width: 900px; margin: 0 auto; padding: 20px;">
  <div class="tips-panel">
    <h3>Tips &amp; Shortcuts</h3>
    <div style="display: flex; gap: 40px; flex-wrap: wrap;">

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

      <div>
        <h5 style="font-size: 0.95em;">Keyboard Shortcuts</h5>
        <table style="font-size: 0.85em;">
          <tr><td style="padding: 2px 12px 2px 0;"><kbd>Ctrl+Z</kbd></td><td>Undo brush stroke</td></tr>
          <tr><td style="padding: 2px 12px 2px 0;"><kbd>Ctrl+Y</kbd> or <kbd>Ctrl+Shift+Z</kbd></td><td>Redo brush stroke</td></tr>
        </table>

        <h5 style="font-size: 0.95em; margin-top: 16px;">Mouse Controls</h5>
        <table style="font-size: 0.85em;">
          <tr><td style="padding: 2px 12px 2px 0;">Drag on image</td><td>Draw selection rectangle (Smart mode)</td></tr>
          <tr><td style="padding: 2px 12px 2px 0;">Click on image</td><td>Pick removal color (Color Match mode)</td></tr>
          <tr><td style="padding: 2px 12px 2px 0;">Scroll wheel</td><td>Zoom result image</td></tr>
          <tr><td style="padding: 2px 12px 2px 0;">Drag (no brush active) or Ctrl+drag</td><td>Pan result image</td></tr>
        </table>
      </div>

    </div>
  </div>
</div>

<script>
```

- [ ] **Step 3: Verify structure**

Run:
```bash
grep -n "tips-panel\|Tips.*Shortcuts\|How to use\|Keyboard Shortcuts\|Mouse Controls" "c:/Users/GundarsM/Documents/svg_editor/bg-remover.html"
```
Expected: all five strings appear once each.

- [ ] **Step 4: Commit**

```bash
cd "c:/Users/GundarsM/Documents/svg_editor"
git add bg-remover.html
git commit -m "feat: add Tips & Shortcuts panel to bg-remover; remove duplicate old document"
```

---

## Chunk 2: converter.html

### Task 4: Add .tips-panel CSS to converter.html

**Files:**
- Modify: `converter.html` (inside the `<style>` block at line ~151)

- [ ] **Step 1: Locate the closing style tag**

Run:
```bash
grep -n "#notice-banner" "c:/Users/GundarsM/Documents/svg_editor/converter.html"
```
Expected: lines 144 and 181 (CSS rule at 144, HTML element at 181). The CSS rule at line 144 is the anchor for the next step.

- [ ] **Step 2: Insert .tips-panel CSS before </style>**

Use the Edit tool. The last rule before `</style>` is `#notice-banner` (lines 144–150). Match this exact string:

```
    #notice-banner {
      display: none;
      font-size: 0.85rem;
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
      padding: 0.4rem 0.8rem;
    }
  </style>
```

Replace with (preserve the original rule, append new CSS before `</style>`):
```
    #notice-banner {
      display: none;
      font-size: 0.85rem;
      background: rgba(255,255,255,0.1);
      border-radius: 4px;
      padding: 0.4rem 0.8rem;
    }

  /* Tips & Shortcuts panel */
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
  </style>
```

- [ ] **Step 3: Verify CSS was added**

Run:
```bash
grep -n "tips-panel" "c:/Users/GundarsM/Documents/svg_editor/converter.html"
```
Expected: 3+ matches.

---

### Task 5: Insert Tips & Shortcuts panel HTML into converter.html

**Files:**
- Modify: `converter.html` (after `</div><!-- /converter-wrapper -->` at line 282)

- [ ] **Step 1: Confirm insertion point**

Run:
```bash
grep -n "<!-- /converter-wrapper -->\|potrace-wasm@1.0.4/index" "c:/Users/GundarsM/Documents/svg_editor/converter.html"
```
Expected: two lines — `</div><!-- /converter-wrapper -->` at line 282 and the potrace-wasm script tag at line 284.

- [ ] **Step 2: Insert the panel HTML**

Use the Edit tool to find:
```
</div><!-- /converter-wrapper -->

<script src="https://cdn.jsdelivr.net/npm/potrace-wasm@1.0.4/index.js"></script>
```

Replace with:
```
</div><!-- /converter-wrapper -->

<div style="max-width: 900px; margin: 0 auto; padding: 20px;">
  <div class="tips-panel">
    <h3>Tips &amp; Shortcuts</h3>
    <div style="display: flex; gap: 40px; flex-wrap: wrap;">

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

      <div>
        <h5 style="font-size: 0.95em;">Mouse Controls</h5>
        <table style="font-size: 0.85em;">
          <tr><td style="padding: 2px 12px 2px 0;">Drag &amp; drop</td><td>Upload image directly</td></tr>
          <tr><td style="padding: 2px 12px 2px 0;">Drag on SVG preview</td><td>Pan the result</td></tr>
          <tr><td style="padding: 2px 12px 2px 0;">Zoom slider / + &minus; / Reset</td><td>Zoom the result in/out</td></tr>
        </table>
      </div>

    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/potrace-wasm@1.0.4/index.js"></script>
```

- [ ] **Step 3: Verify structure**

Run:
```bash
grep -n "tips-panel\|Tips.*Shortcuts\|How to use\|Mouse Controls" "c:/Users/GundarsM/Documents/svg_editor/converter.html"
```
Expected: all four strings appear once each.

- [ ] **Step 4: Commit**

```bash
cd "c:/Users/GundarsM/Documents/svg_editor"
git add converter.html
git commit -m "feat: add Tips & Shortcuts panel to converter"
```
