# HillSpring Crafts – Custom Product Design Tool

A browser-based canvas editor for designing custom commemorative products. Customers build their design visually and either download it as an SVG or submit it as a quote request.

## What it does

The tool lets users compose a design from coins, country outlines, shapes, text, and uploaded images on a resizable canvas. The finished design can be exported as a vector SVG file or sent directly to HillSpring Crafts as a quote request.

## Features

**Templates**
- Rectangle Coin Display
- Circular Coin Display
- Pressed Penny Collection

**Coins** (accurate real-world diameters in mm)
- Euro coins: 0.01 € – 2 €
- US Dollar coins: 1 ¢ – $1
- UK Pound coins: 1p – 2£ (20p and 50p rendered in their correct heptagonal shape)

**Country Outlines**
- USA, UK, Australia, Canada, Germany, Italy
- Available as filled solid or stroke outline

**Shapes**
- Filled and outline versions of Rectangle, Circle, Ellipse

**Text & Images**
- Add and double-click-edit text
- Upload PNG/JPG images
- Import existing SVG design files

**Canvas Controls**
- Undo / Redo
- Zoom in/out (buttons or Ctrl + scroll wheel)
- Rotate, resize, reorder, duplicate, delete objects
- Object property panel (fill, stroke, opacity, font, size, rotation)

**Export**
- Download as SVG — text is converted to vector paths so the file is font-independent
- Request a Quote — submits the design and customer details by email

## Squarespace Setup

Paste the full contents of `editor.js` into the **Page Header Code Injection** field of your Squarespace page:

1. In Squarespace, open the page where you want the tool to appear.
2. Click **Page Settings → Advanced → Page Header Code Injection**.
3. Paste the entire contents of `editor.js` into the text box.
4. Save and publish.

The tool is self-contained — all styles, scripts, and HTML are in a single file. No additional files or dependencies need to be uploaded.

## Tech Stack

### JavaScript Libraries (loaded from CDN)

| Library | Version | Source | Purpose |
|---|---|---|---|
| [Fabric.js](http://fabricjs.com/) | 5.3.0 | cdnjs | Canvas rendering, object selection, manipulation |
| [Bootstrap](https://getbootstrap.com/) | 5.3.0 | jsDelivr | UI components — buttons, modals, layout |
| [Font Awesome](https://fontawesome.com/) | 6.4.0 | cdnjs | Icons |
| [opentype.js](https://opentype.js/) | 1.3.4 | jsDelivr | Converts text to vector paths on SVG export |

### Fonts

Loaded from **Google Fonts** (display in UI) and **jsDelivr / Fontsource** (WOFF files fetched at export time so text is embedded as paths in the SVG):

Anton, Cormorant Garamond, EB Garamond, Inconsolata, Josefin Sans, Lora, Nunito, Open Sans, Patrick Hand, PT Sans, Roboto

### Quote Request / Email

Quote submissions are handled by **[FormSubmit.co](https://formsubmit.co/)** — a free, no-backend email service. When a user clicks *Request a Quote*, the form data (including an optional SVG attachment) is posted via `fetch()` to:

```
https://formsubmit.co/hillspringcrafts@gmail.com
```

FormSubmit forwards the submission as an email to that address. No server, no API key, and no account login required — it activates automatically on first submission.

### Hosting

The tool is a single self-contained HTML file (`editor.js`) injected into a **Squarespace** page via the Page Header Code Injection field. All dependencies are loaded from external CDNs at runtime — nothing needs to be hosted separately.
