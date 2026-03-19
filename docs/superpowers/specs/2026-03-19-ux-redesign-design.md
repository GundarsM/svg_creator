# UX Redesign: Guided Layout for Non-Technical Customers

**Date:** 2026-03-19
**Approach:** Guided Redesign (B) — restructure the existing layout around the customer journey without changing the underlying functionality.

## Context

The Design Tool is a customer-facing web app embedded on the HillSpring Crafts website. Primary users are customers with zero design tool experience who want to create custom products (coin holders, plywood art, etc.) and request a quote. The tool must be PC-optimized but not broken on mobile.

The current layout presents a technical interface: canvas settings first, jargon-heavy labels, buried templates, and the primary business action (Request Quote) lost among other buttons. This spec restructures the UI to guide customers along the happy path: pick a template, customize, request a quote.

## 1. Left Sidebar — Reorder by Customer Priority

### 1.1 Section order (top to bottom)

1. **Start with a Template** (currently "Templates", currently 3rd section)
2. **Add Coins** (currently "Common Currencies", currently 4th section)
3. **Add Country Outlines** (currently "Countries", currently 5th section)
4. **Add Shapes** (currently "Basic Shapes", currently 2nd section)
5. **Add Text & Images** (currently "Add Content", currently 6th section)

Canvas Settings moves out of the sidebar entirely (see Section 3).

### 1.2 Label renames

| Current | New |
|---------|-----|
| Templates | Start with a Template |
| Basic Shapes | Add Shapes |
| Common Currencies | Add Coins |
| Countries | Add Country Outlines |
| Add Content | Add Text & Images |
| Canvas Settings | (removed from sidebar, see Section 3) |

### 1.3 Template button renames

| Current | New |
|---------|-----|
| Rectangle | Rectangle Coin Display |
| Circular | Circular Coin Display |
| Pressed Pennies | Pressed Penny Collection |

### 1.4 Shape row labels

Add small text labels before each row of shape buttons:
- Row 1: **Filled:** [Rectangle] [Circle] [Ellipse]
- Row 2: **Outline:** [Rectangle] [Circle] [Ellipse]

### 1.5 Currency button changes

- "Euro (All)" → **"Add All Euro Coins"**
- "US Dollar (All)" → **"Add All US Dollar Coins"**
- "UK Pound (All)" → **"Add All UK Pound Coins"**
- Individual coin buttons: keep circular shape, increase size from 40px to 44-46px, increase font from 10px to 11-12px for legibility
- **20p and 50p buttons**: change button shape from circle to approximate heptagonal shape using CSS `clip-path` to match the actual coin shape being added

### 1.6 Other renames

- "Import SVG" → **"Import Design File"**

## 2. Right Sidebar — Simplify Properties

### 2.1 Remove from right sidebar

Move to canvas toolbar (see Section 3):
- Undo / Redo
- Zoom In / Zoom Out / Reset View

### 2.2 Label renames

| Current | New |
|---------|-----|
| Horizontal Position | X |
| Vertical Position | Y |
| Width | Width (unchanged) |
| Height | Height (unchanged) |
| Fill Material | Material |
| Plastic Color | Color |
| Line Color | Outline |
| Corner Radius | Corner Roundness |
| Rotation (°) | Rotation |
| Duplicate Selected | Duplicate (Ctrl+D) |
| Delete Selected | Delete (Del) |

### 2.3 Transform buttons

Keep the existing Mirror H, Mirror V, and Rotate 90 buttons in their current position below the Duplicate button. No label changes needed — these are already concise.

### 2.4 Text properties

Keep the existing text properties panel (Font selector, Font Size, Text Content) that appears when a text object is selected. No label changes needed — these are already clear. The 11 Google Fonts loaded via CDN remain unchanged.

### 2.5 Font properties note

The Font selector dropdown contains 11 Google Fonts (Roboto, Lora, Inconsolata, Open Sans, Nunito, Josefin Sans, Anton, Patrick Hand, EB Garamond, PT Sans, Cormorant Garamond). These are loaded via Google Fonts CDN and used by opentype.js for text-to-path conversion on SVG export. This must be preserved during the restructuring.

### 2.6 Bottom actions renames

| Current | New |
|---------|-----|
| Clear All | Start Over |
| Download Design | Download as SVG |
| Request Quote | Request Quote (moved to sticky footer, see Section 5) |

### 2.7 "Start Over" behavior

No confirmation dialog. Clears the canvas immediately. However, the undo history must be preserved so that the user can undo the clear and recover their work. Currently `canvas.clear()` followed by `saveState()` leaves only one undo step (back to blank). Fix: save the pre-clear state to history before clearing, so undo after "Start Over" restores the previous design.

## 3. Canvas Area & Toolbar

### 3.1 Header

Remove or significantly shrink the header. Currently takes up ~100px of vertical space with "Design Tool" title and subtitle. If embedded in Squarespace, the site already provides context. Replace with a single compact line or remove entirely.

Remove the `margin-top: 80px` that accounts for Squarespace nav (handle this via the embedding context, not hardcoded).

### 3.2 Canvas info badge

Remove the info badge overlay from the canvas. Canvas size is accessible via the settings dropdown (see 3.3).

### 3.3 Canvas toolbar

Add a compact horizontal toolbar above the canvas containing:

```
[Undo] [Redo]  |  [Zoom In] [Zoom Out] [Reset View]  |  [Settings gear icon]
```

- **Undo/Redo**: icon buttons with tooltips
- **Zoom controls**: icon buttons with tooltips
- **Settings gear icon**: opens a dropdown/popover containing:
  - Canvas size preset dropdown (A4, A3, A2, A1, Custom)
  - Custom width/height inputs (when Custom is selected)
  - Unit toggle (mm / inch) — **segmented control style** (see Section 6.3)

**DOM placement:** The toolbar sits inside the center column, above the `canvas-container-wrapper` div. It is part of the non-scrolling canvas column so it remains visible at all times alongside the canvas.

### 3.4 Sticky canvas

**The canvas column stays fixed in the viewport** while the left and right sidebars scroll independently. This prevents the canvas from scrolling away when the user scrolls a sidebar to find tools.

Implementation: Replace the current Bootstrap grid row with a custom flex layout. The outer container uses `display: flex` with `height: 100vh` (or available height minus header/footer). The left and right sidebar columns get `overflow-y: auto` to scroll independently. The center canvas column does not scroll — it fills the available height and centers the canvas within it.

Note: The current `#design-tool-wrapper` has `overflow: hidden` which must be adjusted. The Bootstrap `col-lg-*` classes can be kept for width sizing but the scrolling behavior needs custom CSS. This is a non-trivial structural change to the HTML layout.

### 3.5 Auto-center on object add

When any object is added to the canvas (shape, coin, text, template, country), center the viewport on the newly added object. If the user has not manually panned/zoomed, this is a no-op since objects are added at center by default. If the user has panned/zoomed away, the viewport scrolls to show the new object without resetting zoom level. This prevents the situation where a new object appears off-screen without being disruptive to users who have deliberately zoomed into a specific area.

## 4. Canvas Onboarding Hint

When the canvas is empty (no objects), show a centered placeholder message on the canvas:

> "Choose a template to get started, or add shapes from the left panel"

Style: light gray text, centered vertically and horizontally on the white canvas. Disappears as soon as the first object is added. Reappears if all objects are removed (Start Over).

## 5. Request Quote — Sticky Footer & Form Improvements

### 5.1 Sticky footer bar

Pin the "Request Quote" button to the bottom of the viewport as a sticky footer bar. Always visible regardless of scroll position. Visually prominent — full width, brand green (`#344734`) background, white text, larger font than other buttons. This is the primary business action.

### 5.2 Form field changes

| Current | New | Notes |
|---------|-----|-------|
| Project Name | Design Name | Placeholder: "e.g. Anniversary coin holder" |
| First Name | First Name | (unchanged) |
| Last Name | Last Name | (unchanged) |
| Email | Email | (unchanged) |
| Additional Notes | Anything else we should know? | Placeholder: "e.g. Quantity needed, deadline, special requests..." |
| (none) | Preferred Material | New dropdown: Birch Plywood, Oak Wood, Walnut Wood, Acrylic/Plastic, Other, Not Sure. This is the overall project material preference — it may differ from per-object materials set on the canvas. Helps HillSpring understand the customer's intent even if the canvas material settings are incomplete or exploratory. |
| Design File upload | Upload your own design (optional) | Clarify text: "Already have a design file? Upload it here (SVG format). Otherwise, your design from the canvas will be included automatically." |

### 5.3 Design summary in modal

Show a brief summary in the quote modal:
- Canvas size (e.g. "390 x 390 mm")
- Number of objects on canvas
- Reassurance: "Your design will be included automatically"

## 6. Small UX Improvements

### 6.1 Tips & Shortcuts section

Add a section below the main tool area (below the sticky footer) with:

**"Tips & Shortcuts"**

- Keyboard shortcuts table:
  - `Delete` — Remove selected objects
  - `Ctrl + D` — Duplicate selected objects
  - `Ctrl + S` — Download design (shown in the download dialog)
- Mouse controls:
  - Scroll wheel — Zoom in/out
  - Right-click drag — Pan the canvas
  - Alt/Ctrl + drag — Pan the canvas
- Placeholder space for a future tutorial video embed

### 6.2 Keyboard shortcut hints on buttons

Add subtle hint text to the Duplicate and Delete buttons:
- "Duplicate (Ctrl+D)"
- "Delete (Del)"

### 6.3 mm/inch segmented control

Replace the current two separate buttons (`btn-primary` / `btn-outline-primary`) with a segmented control style toggle. CSS: connected buttons with shared border, active segment filled, inactive segment empty. Looks like a toggle, not two independent action buttons.

This control moves into the Settings dropdown (Section 3.3) — no longer in the sidebar.

### 6.4 20p/50p coin button shapes

Use CSS `clip-path` to create a rounded heptagon shape for the 20p and 50p individual coin buttons in the left sidebar. All other coin buttons remain circular. The clip-path should approximate the Reuleaux heptagon shape of the actual coins.

## Summary of Layout Changes

### Before (top to bottom, left sidebar):
1. Canvas Settings
2. Basic Shapes
3. Templates
4. Common Currencies
5. Countries
6. Add Content

### After (top to bottom, left sidebar):
1. Start with a Template
2. Add Coins
3. Add Country Outlines
4. Add Shapes
5. Add Text & Images

### Before (right sidebar):
1. History (Undo/Redo)
2. Zoom Controls
3. Object Properties (position, size, rotation, material, colors, text props)
4. Transform buttons (Duplicate, Mirror H/V, Rotate 90, Delete)
5. Actions (Clear All, Download, Request Quote)

### After (right sidebar):
1. Object Properties (simplified labels, same fields)
2. Transform buttons (Duplicate, Mirror H/V, Rotate 90, Delete — unchanged)
3. Actions (Start Over, Download as SVG)

### New elements:
- Canvas toolbar (Undo, Redo, Zoom, Settings gear)
- Sticky footer (Request Quote)
- Canvas onboarding hint
- Tips & Shortcuts section below the tool
- Settings dropdown (canvas size, units)

## 7. Responsive Behavior

The tool is PC-optimized. On screens below `lg` breakpoint (< 992px):
- The current Bootstrap grid stacks columns vertically (`col-md-4`, `col-md-8`, `col-md-12`)
- The sticky canvas behavior should degrade gracefully — canvas becomes a normal scrolling element on smaller screens
- The sticky footer (Request Quote) should remain sticky on all screen sizes
- The canvas toolbar stays above the canvas regardless of screen size
- Sidebar scrolling is only relevant on desktop; on mobile the full page scrolls naturally
