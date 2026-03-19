# UX Redesign: Guided Layout for Non-Technical Customers

**Date:** 2026-03-19
**Approach:** Guided Redesign (B) — restructure the existing layout around the customer journey without changing the underlying functionality.

## Context

The Design Tool is a customer-facing web app embedded on the HillSpring Crafts website. Primary users are customers with zero design tool experience who want to create custom products (coin holders, plywood art, etc.) and request a quote. The tool must be PC-optimized but not broken on mobile.

The current layout presents a technical interface: canvas settings first, jargon-heavy labels, buried templates, and the primary business action (Request Quote) lost among other buttons. This spec restructures the UI to guide customers along the happy path: pick a template, customize, request a quote.

## 1. Left Sidebar — Reorder by Customer Priority

### 1.1 Section order (top to bottom)

1. **Start with a Template** (currently "Templates", currently 4th section)
2. **Add Coins** (currently "Common Currencies", currently 5th section)
3. **Add Country Outlines** (currently "Countries", currently 6th section)
4. **Add Shapes** (currently "Basic Shapes", currently 2nd section)
5. **Add Text & Images** (currently "Add Content", currently 7th section)

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
| Fill Material | Material |
| Plastic Color | Color |
| Line Color | Outline |
| Corner Radius | Corner Roundness |
| Rotation (°) | Rotation |
| Duplicate Selected | Duplicate |
| Delete Selected | Delete |

### 2.3 Bottom actions renames

| Current | New |
|---------|-----|
| Clear All | Start Over |
| Download Design | Download as SVG |
| Request Quote | Request Quote (moved to sticky footer, see Section 5) |

### 2.4 "Start Over" behavior

No confirmation dialog. Clears the canvas immediately.

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
  - Unit toggle (mm / inch) — **segmented control style** (see Section 6.4)

### 3.4 Sticky canvas

**The canvas column stays fixed in the viewport** while the left and right sidebars scroll independently. This prevents the canvas from scrolling away when the user scrolls a sidebar to find tools.

Implementation: CSS `position: sticky` on the canvas column, or a flex layout where sidebars have `overflow-y: auto` and the canvas column does not scroll.

### 3.5 Auto-center on object add

When any object is added to the canvas (shape, coin, text, template, country), reset the viewport to center on the canvas. This prevents the situation where a user is zoomed/panned to a different area and the new object appears off-screen.

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
| (none) | Preferred Material | New dropdown: Birch Plywood, Oak Wood, Walnut Wood, Acrylic/Plastic, Other, Not Sure |
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
3. Object Properties
4. Actions (Clear All, Download, Request Quote)

### After (right sidebar):
1. Object Properties (with simplified labels)
2. Actions (Start Over, Download as SVG)

### New elements:
- Canvas toolbar (Undo, Redo, Zoom, Settings gear)
- Sticky footer (Request Quote)
- Canvas onboarding hint
- Tips & Shortcuts section below the tool
- Settings dropdown (canvas size, units)
