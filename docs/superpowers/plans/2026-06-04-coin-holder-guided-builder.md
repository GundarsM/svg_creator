# Coin Holder Guided Builder Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `builder.js` — a new self-contained Squarespace-injectable page that guides a customer through designing a coin holder with a scripted, non-AI "assistant" overlay, while keeping the full editor canvas editable at every step.

**Architecture:** Approach A — `builder.js` contains a verbatim copy of the entire `editor.js` engine (never hand-edited) plus an additive "Coach" overlay (`#coach-root`) appended after it. The Coach drives existing engine globals, observes the global Fabric `canvas`, and highlights existing toolbar controls by ID. See spec: `docs/superpowers/specs/2026-06-04-coin-holder-guided-builder-design.md`.

**Tech Stack:** Plain HTML/CSS/JS in one file. Fabric.js 5.3.0, Bootstrap 5.3.0, Font Awesome 6.4.0, opentype.js (all via CDN, inherited from the engine copy). No build step, no backend.

**Testing note (project-specific):** This project has NO automated test framework — verification is by opening the file in a browser (per CLAUDE.md). Every task below therefore replaces the usual failing-test step with an explicit **browser verification** listing exact observations to confirm. Open `builder.js` by renaming a copy to `builder.html` locally (or use a `?` query trick) — see Task 0. Commit frequently.

---

## Engine integration reference (verified against editor.js)

These facts are confirmed in the current `editor.js` and the Coach depends on them. Do not assume beyond this list — re-grep if unsure.

- **Globals callable by the Coach:** `addCurrency(currency)` where currency ∈ `'euro'|'dollar'|'pound'`; `addSingleCoin(value, diameter)`; `addCountry(country)` / `addCountryOutline(country)` where country ∈ `'usa'|'uk'|'australia'|'canada'|'germany'|'italy'`; `addTemplate(templateType)`; `addShape(type)` where type ∈ `'rectangle'|'circle'|'ellipse'` (+ outline variants — confirm exact strings in `addShape`); `addText()`; `applyCustomSize()`; `setUnit('mm'|'inch')`; `applyFill(object, fillType)`; `cascadeColorToContained(changedObject, fillType, plasticColor)`; `exportSVG()`; `showQuoteForm()`; `saveState()`.
- **Global Fabric instance:** `canvas`. Has custom props `canvas.scale` (pixels per mm), `canvas.realWidth`, `canvas.realHeight`.
- **Custom object props:** `shapeType` (`'rectangle'|'circle'|'ellipse'|'rectangle-outline'|'circle-outline'|'ellipse-outline'|'country'|'currency'|'text'|'image'|'imported'`; note `'imported'` = an uploaded-SVG object), `coinValue` (e.g. `'2 €'`), `materialType` (`'color'|'birch'|'oak'|'walnut'`).
- **Authoritative serialization list (verified):** the engine's own `saveState()` (editor.js ~line 3156) serializes exactly: `['shapeType', 'countryName', 'realWidth', 'realHeight', 'realRadius', 'realRx', 'realRy', 'realFontSize', 'realCornerRadius', 'currencyType', 'coinValue', 'realDiameter']`. Note `materialType` is **not** in that list. The Coach's persistence must serialize this list **plus** `'materialType'` (so materials can be re-applied on resume). See Task 11.
- **Material application pattern (from the `#materialPreset` onchange handler):** select object → `applyFill(obj, fillType)` → if group, set inner text fill → `cascadeColorToContained(obj, fillType, document.getElementById('fillColor').value)` → `canvas.requestRenderAll()` → `saveState()`.
- **Sizing:** `applyCustomSize()` reads `#customWidthToolbar` and `#customHeightToolbar`, converts using `currentUnit`, then snapshots existing objects, calls `canvas.clear()`, and **re-adds and rescales** them — object instances/references survive the resize. Still set the holder size in step 2 BEFORE coins are added in step 4, so coins land at the correct relative scale.
- **Coin placement:** `addSingleCoin` / `addCurrency` place new coins at canvas center; coin pixel footprint is readable via `obj.getBoundingRect()`.
- **Toolbar element IDs available to highlight:** `#settingsDropdown`, `#customWidthToolbar`, `#customHeightToolbar`, `#materialPresetGroup`, `#materialPreset`, `#fillColor`, `#fileImport`, `#imageUpload`, `#downloadBtn`, plus the currency/country/shape/text button containers (confirm/assign container IDs in Task 1).

---

## File Structure

- **Create:** `builder.js` — the whole deliverable. Two regions:
  - `/* ===== ENGINE (verbatim copy of editor.js) ===== */` — copied, never edited.
  - `/* ===== COACH (new) ===== */` — `<style>` block (head), `<div id="coach-root">` markup, and one `<script>` defining the `Coach` object, all added without touching engine code.
- **Modify:** `README.md` and `CLAUDE.md` — add `builder.js` to the tool list (final task).
- No other files.

The Coach is internally organized (all within the single appended `<script>`) as logical units:
- `Coach.steps` — step registry (data).
- `Coach` core — navigation (`go`/`next`/`back`/`skip`), bubble render, highlight, collapse/drag, responsive.
- `Coach.arrange(pattern)` — the one net-new engine helper.
- `Coach.persist` — autosave / resume / start-over.

---

## Chunk 1: Scaffold — engine copy + Coach shell

### Task 0: Create builder.js as a verbatim engine copy + local preview harness

**Files:**
- Create: `builder.js`

- [ ] **Step 1: Copy the engine**

Copy the full contents of `editor.js` into a new file `builder.js`, byte-for-byte. Add a single comment line as the very first line: `<!-- builder.js — engine region is a verbatim copy of editor.js; do not hand-edit below the ENGINE marker -->` followed by a comment marker `<!-- ===== ENGINE (verbatim copy of editor.js) ===== -->` immediately before the original first line of editor.js content.

- [ ] **Step 2: Browser verification (baseline)**

Make a temporary copy named `builder.html` (Squarespace serves `.js` as a page; locally browsers need `.html`). Open `builder.html` in a browser.
Expected: the page renders identically to the current editor — toolbar, canvas, properties panel all work. No Coach yet. No console errors beyond any that editor.js already produces.

- [ ] **Step 3: Commit**

```bash
git add builder.js
git commit -m "feat(builder): scaffold builder.js as verbatim editor engine copy"
```

### Task 1: Confirm/assign toolbar container IDs for highlighting

**Files:**
- Modify: `builder.js` (ENGINE region — EXCEPTION: only additive `id`/no-op attributes, see note)

> Note: This is the ONLY task that touches the engine region, and only to add `id` attributes to existing toolbar group containers if they lack them (purely additive, no behavior change). If the containers already have usable IDs/anchors, skip the edits and just record the selectors. Record the final selector list at the top of the Coach script as `Coach.SELECTORS`.

- [ ] **Step 1: Identify the toolbar group containers**

In `builder.js`, locate the sidebar groups for: currency/coins buttons, country buttons, shape buttons, text/add-text control, image upload, SVG import, size/settings dropdown, material preset, download/quote. Note their existing IDs or nearest stable selector.

- [ ] **Step 2: Add missing IDs**

For any group lacking a stable selector, add an `id` attribute with a `coach-`-prefixed name (e.g. `id="coinsGroup"`, `id="countriesGroup"`, `id="shapesGroup"`, `id="textGroup"`). Additive only.

- [ ] **Step 3: Browser verification**

Reload `builder.html`. Expected: page still renders and behaves identically (adding IDs changes nothing visible).

- [ ] **Step 4: Commit**

```bash
git add builder.js
git commit -m "feat(builder): add stable IDs to toolbar groups for coach highlighting"
```

### Task 2: Coach CSS + root markup + collapsed launcher

**Files:**
- Modify: `builder.js` (COACH region only)

- [ ] **Step 1: Add the Coach style block**

In `<head>` (after the engine's styles), add a `<style>` block with all rules scoped under `#coach-root`. Include: the floating bubble (fixed, bottom-right, max-width ~320px, theme colors `--lunar-green: #344734`, panel bg `#dbdbdb`, rounded 10px, drop shadow), header/body/footer layout, step-dots, the `.coach-highlight` glow (animated outline e.g. `box-shadow: 0 0 0 3px rgba(52,71,52,.6); outline: 2px solid #344734;`), the collapsed launcher button, and a `@media (max-width: 768px)` block turning the bubble into a full-width bottom sheet (`left:0; right:0; bottom:0; border-radius:16px 16px 0 0;`) and hiding the drag handle.

- [ ] **Step 2: Add the Coach markup**

Before `</body>` add:
```html
<div id="coach-root">
  <button id="coach-launcher" type="button" hidden>💬 Need a hand?</button>
  <div id="coach-bubble">
    <div id="coach-header">
      <span id="coach-progress"></span>
      <span id="coach-title"></span>
      <button id="coach-collapse" type="button" aria-label="Collapse">–</button>
      <span id="coach-drag" aria-hidden="true">⠿</span>
    </div>
    <div id="coach-body"></div>
    <div id="coach-footer">
      <button id="coach-back" type="button">‹ Back</button>
      <button id="coach-skip" type="button">Skip</button>
      <button id="coach-next" type="button">Next ›</button>
      <div id="coach-dots"></div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: Browser verification**

Reload. Expected: an empty styled bubble appears bottom-right (text fields blank for now), does not overlap/block the toolbar, and on a narrow window (<768px) docks to the bottom as a sheet.

- [ ] **Step 4: Commit**

```bash
git add builder.js
git commit -m "feat(builder): add coach root markup and scoped styles"
```

### Task 3: Coach core — step registry, navigation, render, init

**Files:**
- Modify: `builder.js` (COACH region — the appended `<script>`)

- [ ] **Step 1: Create the Coach object and init guard**

Append a `<script>` after the engine script. Define `const Coach = { current: 0, state: {}, steps: [], SELECTORS: {...from Task 1...} }`. Add `Coach.init()` that waits for the engine (`canvas`) to exist (poll every 50ms up to ~3s) then renders step 0; call it on `window.addEventListener('load', ...)`. If `canvas` never appears, leave the bubble showing text-only guidance and log a console warning (graceful degradation).

- [ ] **Step 2: Implement navigation primitives**

Add `Coach.go(index)` (clamp to range, set `current`, call `Coach.render()`, scroll/clear highlights), `Coach.next()`, `Coach.back()`, `Coach.skip()` (= next). Wire footer buttons and a `Coach.renderDots()` whose dots call `Coach.go(i)` — enabling free jumping between steps.

- [ ] **Step 3: Implement render + highlight + collapse/drag**

`Coach.render()` populates `#coach-progress` (`Step N / {total}`), `#coach-title`, calls the current step's `renderAction(bodyEl)`, applies `step.highlight` via `Coach.highlight(ids)` (clears previous first), toggles Back/Skip visibility (`optional` → show Skip; index 0 → hide Back), and re-renders dots with a ✓ when `step.isComplete?.()` is true. Implement `Coach.highlight(ids)` (add `.coach-highlight` to each element by selector, store for clearing; on mobile `scrollIntoView`). Implement collapse (`#coach-collapse` hides bubble, shows `#coach-launcher`; launcher reverses) and desktop drag via `#coach-drag` (pointer events updating bubble `left/top`; disabled under 768px).

- [ ] **Step 4: Add placeholder steps**

Temporarily populate `Coach.steps` with 7 stub objects `{id, title, intro, renderAction(el){el.textContent = this.intro;}, highlight:[], optional:false}` using the real titles/ids from the spec, so navigation is testable.

- [ ] **Step 5: Browser verification**

Reload. Expected: bubble shows "Step 1 / 7 · Welcome & occasion" with intro text; Next/Back/Skip and the 7 dots navigate between stubs; Back hidden on step 1; Skip shown only on optional steps; collapse hides to launcher and restores; on desktop the bubble drags; on mobile it's a fixed bottom sheet. No console errors.

- [ ] **Step 6: Commit**

```bash
git add builder.js
git commit -m "feat(builder): add coach core navigation, render, highlight, collapse/drag"
```

---

## Chunk 2: Steps 1–3 (occasion, holder, material)

### Task 4: Step 1 — Welcome & occasion

**Files:**
- Modify: `builder.js` (COACH region)

- [ ] **Step 1: Implement `renderAction` for the `occasion` step**

Render occasion buttons (Gift / Travel memento / Collection display / Milestone) and a project-name text input. Clicking an occasion stores `Coach.state.occasion`; typing stores `Coach.state.projectName`. Mark step `optional:true`, `highlight:[]`. No canvas change.

- [ ] **Step 2: Browser verification**

Reload. Expected: selecting an occasion visibly marks it selected and persists when navigating away and back (value retained from `Coach.state`); Skip is available.

- [ ] **Step 3: Commit** — `feat(builder): implement occasion step`

### Task 5: Step 2 — Choose the holder (4 base shapes + size)

**Files:**
- Modify: `builder.js` (COACH region)

- [ ] **Step 1: Implement the base-shape picker**

In `renderAction`, render four choices: Rectangle, Circular, Country outline, Upload SVG; plus width/height inputs and an MM/INCH toggle, and an optional "Start from a ready layout" link.
- Size: write the values into `#customWidthToolbar`/`#customHeightToolbar`, call `setUnit(unit)` as needed, then `applyCustomSize()`. Do this BEFORE creating the holder shape (applyCustomSize rebuilds the canvas).
- Rectangle/Circular: call `addShape('rectangle')` / `addShape('circle')` (exact strings confirmed); store the created object reference as `Coach.state.holderObj` (it is the active object after creation) and `Coach.state.holderType`. Stamp it for deterministic resume: `Coach.state.holderObj.coachHolderId = 'holder'`.
- Country outline: show the 6-country picker; call `addCountry(country)` (filled) — store as holder.
- Upload SVG: a button that triggers `document.getElementById('fileImport').click()`; the engine's existing change-handler performs the import. After import, set the most-recently-added object as `Coach.state.holderObj` and stamp `Coach.state.holderObj.coachHolderId = 'holder'`.
- Country outline holder: after `addCountry(country)`, also stamp `Coach.state.holderObj.coachHolderId = 'holder'`.
- `highlight`: `[settings/size dropdown, shapesGroup, countriesGroup, fileImport]`.

- [ ] **Step 2: Browser verification**

Reload. For each of the four base shapes: choosing it adds the holder to the canvas at the chosen size; the holder remains selectable/editable via the normal properties panel. Switching unit converts inputs. Expected: holder object recorded (verify via `Coach.state.holderObj` in console).

- [ ] **Step 3: Commit** — `feat(builder): implement holder step with four base shapes and sizing`

### Task 6: Step 3 — Pick material

**Files:**
- Modify: `builder.js` (COACH region)

- [ ] **Step 1: Implement material picker**

Render wood finishes (Birch, Oak, Walnut) and plastic colours (with a colour input). On choice, resolve the holder: `obj = Coach.state.holderObj || canvas.getActiveObject()`. If wood: `applyFill(obj, fillType)`. If plastic: set `#fillColor` value, then `applyFill(obj, 'color')`. Then replicate the engine pattern: cascade with `cascadeColorToContained(obj, fillType, document.getElementById('fillColor').value)`, `canvas.requestRenderAll()`, `saveState()`. Guard: if no holder, show "Add a holder first (step 2)" nudge.
- `highlight`: `['#materialPresetGroup', '#materialPreset']`.

- [ ] **Step 2: Browser verification**

Reload, create a holder (step 2), go to step 3. Expected: picking Oak/Walnut/Birch fills the holder with the wood pattern; picking a plastic colour fills it solid; the `#materialPreset` control reflects the change; undo (engine) reverts it.

- [ ] **Step 3: Commit** — `feat(builder): implement material step`

---

## Chunk 3: Steps 4–6 (coins, arrange, personalize)

### Task 7: Step 4 — Add coins

**Files:**
- Modify: `builder.js` (COACH region)

- [ ] **Step 1: Implement currency + denomination + quantity UI**

Render currency tabs (€ → `'euro'`, $ → `'dollar'`, £ → `'pound'`). Selecting a currency shows its denominations with the correct diameters (copy the denomination/diameter tables from the engine's `addCurrency` — €, $, £ lists). Each denomination has a +/- quantity stepper; "Add" calls `addSingleCoin(value, diameter)` `quantity` times. Track running tallies in `Coach.state.coins`.
- `isComplete()`: returns true when `canvas.getObjects().some(o => o.shapeType === 'currency')`.
- `highlight`: `['#coinsGroup']`.

- [ ] **Step 2: Browser verification**

Reload, add a holder, go to step 4. Expected: choosing € and adding 3× "2 €" places three correctly-sized coins; tallies update; the dot for step 4 shows ✓ after the first coin; coins are individually editable on the canvas.

- [ ] **Step 3: Commit** — `feat(builder): implement coins step`

### Task 8: Step 5 — Arrange (the net-new `Coach.arrange` helper)

**Files:**
- Modify: `builder.js` (COACH region)

- [ ] **Step 1: Implement `Coach.arrange(pattern)`**

Signature: `Coach.arrange(pattern)` where pattern ∈ `'grid'|'circle'|'rows'`.
Algorithm:
1. Determine holders: **prefer `Coach.state.holderObj`** as the single holder when set. Otherwise fall back to any object whose `shapeType ∈ {rectangle, circle, ellipse, rectangle-outline, circle-outline, ellipse-outline, country, imported}` (i.e. anything that isn't a coin/text/image), treating each as a container.
2. For each holder, compute `bounds = holder.getBoundingRect()` (no argument — match the engine's own call form so containment math agrees with `cascadeColorToContained`); collect coins (`shapeType === 'currency'`) whose center point is inside `bounds` using the same center-in-bounds test as `cascadeColorToContained`.
3. Compute each coin's footprint from `coin.getBoundingRect()` (no argument, same form); `cell = max(footprint.width, footprint.height) + padding` (padding ~ 0.15·cell).
4. Lay out within `bounds`, centered:
   - `grid`: `cols = max(1, floor((bounds.width) / cell))`; place row-major, centering the whole block.
   - `rows`: single coins per row stacked (or as many rows as needed), left-aligned-then-centered.
   - `circle`: arrange on a ring of radius `min(bounds.width, bounds.height)/2 - cell/2`, equal angular spacing; if too many to fit one ring, fall back to `grid`.
   - Set each coin position with center origin: `coin.setPositionByOrigin(new fabric.Point(x, y), 'center', 'center'); coin.setCoords();`.
   - If a computed position would push a coin outside `bounds`, clamp inward (baseline) — note point-in-path containment for irregular shapes is a stretch goal.
5. `canvas.requestRenderAll(); saveState();`.
Guard: if no holder or no contained coins, show "Add a holder and some coins first" and return without changes.

- [ ] **Step 2: Implement `renderAction` for the `arrange` step**

Buttons: Grid / Circle / Rows (each calls `Coach.arrange(...)`), plus a "Leave as-is / drag freely" note. `highlight: []`.

- [ ] **Step 3: Browser verification**

Reload; build rectangle holder + 6 euro coins. Expected: Grid tidies them into a centered grid fully inside the rectangle; Rows stacks them; Circle rings them; none spill past the holder edge; undo reverts; with a circular holder coins stay within the circle's bounding box; with zero coins the nudge appears and nothing changes.

- [ ] **Step 4: Commit** — `feat(builder): implement arrange step with within-holder layout helper`

### Task 9: Step 6 — Personalize

**Files:**
- Modify: `builder.js` (COACH region)

- [ ] **Step 1: Implement personalize actions**

Buttons: Add engraving text (`addText()`, then focus the text content control / set initial text from an input), Add country outline (the 6-country picker → `addCountry` or `addCountryOutline`), Add a shape (`addShape`), Upload a logo/image (`document.getElementById('imageUpload').click()`). Mark `optional:true`.
- `highlight`: `['#textGroup', '#countriesGroup', '#shapesGroup', '#imageUpload']`.

- [ ] **Step 2: Browser verification**

Reload, go to step 6. Expected: each action adds the corresponding object; text is editable; image upload opens the file picker and places the image; Skip is available.

- [ ] **Step 3: Commit** — `feat(builder): implement personalize step`

---

## Chunk 4: Step 7, persistence, polish, docs

### Task 10: Step 7 — Review & request (with quote pre-fill)

**Files:**
- Modify: `builder.js` (COACH region)

- [ ] **Step 1: Implement the review summary**

`renderAction` builds a plain-language summary from `Coach.state` + live canvas: holder shape & size (`canvas.realWidth × canvas.realHeight` + unit), material (from holder `materialType`), coin tallies (count by `coinValue`), and personalization extras (counts of text/country/shape/image). Two buttons: **Download SVG** (`exportSVG()`) and **Request a Quote** (`showQuoteForm()`).

- [ ] **Step 2: Pre-fill the quote form**

`showQuoteForm()` is **async** (it awaits text-to-path conversion before the modal opens), so the prefill must run after it resolves: `await showQuoteForm();` then set fields (or hook the Bootstrap modal `shown.bs.modal` event). Set `#projectName` ← `Coach.state.projectName || <occasion-derived default, e.g. "<Occasion> coin holder">`. If you also surface the occasion, append it to the notes field `#userNotes`. Only set fields that exist; guard each with a null check.

- [ ] **Step 3: Browser verification**

Reload, build a full design, go to step 7. Expected: summary accurately lists shape/size/material/coins/extras; Download SVG produces a file; Request a Quote opens the modal with the project name pre-filled.

- [ ] **Step 4: Commit** — `feat(builder): implement review step with quote pre-fill`

### Task 11: Persistence — autosave, resume, start-over, material re-apply

**Files:**
- Modify: `builder.js` (COACH region)

- [ ] **Step 1: Set the serialization prop list**

Use the engine's own `saveState()` serialization list **plus `materialType`** (which the engine's list omits but the Coach needs for `reapplyMaterials()`). Record as:
```js
Coach.EXTRA_PROPS = ['shapeType', 'countryName', 'realWidth', 'realHeight', 'realRadius', 'realRx', 'realRy', 'realFontSize', 'realCornerRadius', 'currencyType', 'coinValue', 'realDiameter', 'materialType', 'coachHolderId'];
```
(`coachHolderId` is the Coach's own stamp on the holder object — see Task 11 Step 3 — so the holder can be re-resolved deterministically after a reload.)
Before finalizing, re-grep editor.js's `saveState` (~line 3156) to confirm the engine list is unchanged, and scan for any newer custom `obj.<prop> =` assignments on coins/holders; add any found. Omitting these props silently regresses faithful reload (coin diameters, country identity, real-world sizing).

- [ ] **Step 2: Implement autosave**

Add `Coach.persist.save()` (debounced ~500ms) writing `localStorage['hsc-builder-v1'] = JSON.stringify({ canvasJSON: canvas.toJSON(Coach.EXTRA_PROPS), step: Coach.current, state: Coach.state })`. Call it on `canvas` events `object:added`, `object:modified`, `object:removed`, and on every `Coach.go`. Wrap in try/catch; on failure (quota/private mode) set a flag and show a one-time "progress won't be saved on this device" note.

- [ ] **Step 3: Implement resume + material re-apply**

On `Coach.init`, if `localStorage['hsc-builder-v1']` exists, show a "Welcome back — resume where you left off?" prompt (Resume / Start fresh) in the bubble before rendering step 0. Resume: `canvas.loadFromJSON(saved.canvasJSON, () => { Coach.reapplyMaterials(); canvas.renderAll(); })`, restore `Coach.state`, then `Coach.go(saved.step)`. Implement `Coach.reapplyMaterials()` — iterate **every** object on the canvas (holders, coins, and any other object that carries `materialType`); for each with `materialType` ∉ `{undefined,'color'}` call `applyFill(obj, obj.materialType)` so its wood pattern regenerates (Fabric `Pattern` fills don't round-trip through `loadFromJSON`). Because each object re-applies its own persisted `materialType`, this restores inner/contained object fills too — no separate `cascadeColorToContained` pass is needed on resume.

Note: `Coach.state.holderObj` is a live object reference that is lost across a page reload. To re-resolve deterministically, stamp the holder with a custom id when created in step 2 (e.g. `holder.coachHolderId = 'holder'`, and add `'coachHolderId'` to `Coach.EXTRA_PROPS`). After `loadFromJSON`, find the object whose `coachHolderId === 'holder'`; fall back to the largest non-coin shape if absent.

- [ ] **Step 4: Implement Start over**

Add a "Start over" control (in the header or review step) → confirm → `localStorage.removeItem('hsc-builder-v1')`, clear the canvas, reset `Coach.state = {}`, `Coach.go(0)`. Use whatever reset the engine already exposes if one exists (re-grep for a "clear/new design" handler); otherwise after `canvas.clear()` restore `canvas.backgroundColor = '#ffffff'` and re-establish canvas dimensions/scale by **first writing default values into `#customWidthToolbar`/`#customHeightToolbar`** (e.g. 390 × 300 mm, the engine defaults) and then calling `applyCustomSize()`, so it does not re-read stale or empty toolbar values. This leaves the next build on a valid, correctly-scaled canvas rather than stale `realWidth`/`scale`.

- [ ] **Step 5: Browser verification**

Reload, build a design with a wood material + coins, refresh the page. Expected: "resume?" prompt appears; Resume restores the canvas including the wood pattern fill and the correct step; Start fresh / Start over clears everything; in a private window persistence silently no-ops with the note shown once.

- [ ] **Step 6: Commit** — `feat(builder): add localStorage persistence with resume, start-over, material re-apply`

### Task 12: Final polish — responsive, error guards, end-to-end pass

**Files:**
- Modify: `builder.js` (COACH region)

- [ ] **Step 1: Harden guards**

Verify every Coach→engine call is wrapped so a missing global degrades to text-only guidance (no thrown errors). Confirm mobile bottom-sheet does not cover the canvas controls (add bottom padding to the wrapper on small screens if needed).

- [ ] **Step 2: Full end-to-end browser verification (the manual test checklist)**

Walk all 7 steps for each base-shape type (rectangle, circle, country, uploaded SVG):
- arrange keeps coins within the holder (rect/circle/country/SVG);
- refresh → resume restores design + step + materials;
- Start over clears everything;
- mobile (<768px) coach renders as a usable bottom sheet;
- SVG export downloads a correct file (text → paths);
- quote form opens pre-filled;
- free editing (toolbar, properties panel, undo/redo) still works at every step.
Fix any failures before committing.

- [ ] **Step 3: Commit** — `fix(builder): responsive + error-guard polish after end-to-end pass`

### Task 13: Docs

**Files:**
- Modify: `README.md`, `CLAUDE.md`

- [ ] **Step 1: Document the new tool**

Add `builder.js` to the tool list in both files: a guided coin-holder builder (verbatim engine copy + additive Coach overlay), deployed like the others via Page Header Code Injection on its own page. Note that the engine region is a verbatim copy of `editor.js` and must be re-synced when `editor.js` changes.

- [ ] **Step 2: Commit** — `docs: add builder.js to README and CLAUDE.md`

---

## Notes for the implementer

- **Never edit the ENGINE region** except Task 1's additive IDs. All Coach logic lives in the appended region.
- **Order matters:** holder size (step 2) before coins (step 4), because `applyCustomSize()` clears and rebuilds the canvas.
- **Re-grep before assuming:** confirm exact `addShape` argument strings and any extra custom object props before relying on them.
- **Use @superpowers:verification-before-completion** before claiming any task done — run the browser check and confirm the stated observations.
- Reference the spec for rationale: `docs/superpowers/specs/2026-06-04-coin-holder-guided-builder-design.md`.
