<!-- builder.js — engine region started as a copy of editor.js but has intentionally diverged; engine changes must be applied surgically to BOTH files (see the maintenance note in CLAUDE.md — do NOT re-paste editor.js over it) -->
<!-- ===== ENGINE (verbatim copy of editor.js) ===== -->
<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Design Tool - HillSpring Crafts</title>
        
        <!-- External Libraries -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js"></script>
        <!-- Bootstrap loaded inside a CSS layer so Squarespace's own (unlayered) styles always win -->
        <style>@import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css") layer(bootstrap);</style>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

        <!-- Google Fonts replacement for system fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Cormorant+Garamond:wght@400;700&family=EB+Garamond:wght@400;700&family=Inconsolata:wght@400;700&family=Josefin+Sans:wght@400;700&family=Lora:wght@400;700&family=Nunito:wght@400;700&family=Open+Sans:wght@400;700&family=Patrick+Hand&family=PT+Sans:wght@400;700&family=Roboto:wght@400;700;900&display=swap" rel="stylesheet">

        <style>
            /* Prevent Bootstrap from affecting Squarespace sections */
            body > *:not(#design-tool-wrapper) .container,
            body > *:not(#design-tool-wrapper) .container-fluid,
            body > *:not(#design-tool-wrapper) .row,
            body > section .container,
            body > section .container-fluid,
            body > div:not(#design-tool-wrapper) > .container,
            body > div:not(#design-tool-wrapper) > .container-fluid {
                max-width: none !important;
                width: 100% !important;
                padding-left: 0 !important;
                padding-right: 0 !important;
                margin-left: auto !important;
                margin-right: auto !important;
            }

            :root {
                --lunar-green: #344734;
                --light-bg: #f8f9fa;
                --border-color: #dee2e6;
            }

            /* Custom scrollbars for sidebars */
            #design-tool-wrapper .sidebar-left::-webkit-scrollbar,
            #design-tool-wrapper .sidebar-right::-webkit-scrollbar {
                width: 4px;
            }
            #design-tool-wrapper .sidebar-left::-webkit-scrollbar-track,
            #design-tool-wrapper .sidebar-right::-webkit-scrollbar-track {
                background: transparent;
            }
            #design-tool-wrapper .sidebar-left::-webkit-scrollbar-thumb,
            #design-tool-wrapper .sidebar-right::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.25);
                border-radius: 2px;
            }
            #design-tool-wrapper .sidebar-left::-webkit-scrollbar-thumb:hover,
            #design-tool-wrapper .sidebar-right::-webkit-scrollbar-thumb:hover {
                background: rgba(255,255,255,0.45);
            }
            
            #design-tool-wrapper {
                font-family: 'Athelas', Georgia, serif;
                background-color: var(--lunar-green);
                color: white;
                padding: 0;
                min-height: 100vh;
                margin: 0;
                clear: both;
                overflow: visible;
            }

            #design-tool-wrapper h1, 
            #design-tool-wrapper h2,
            #design-tool-wrapper h3,
            #design-tool-wrapper h4,
            #design-tool-wrapper h5,
            #design-tool-wrapper h6 {
                font-family: 'IvyMode', 'Times New Roman', serif;
                color: #333;
            }
            
            #design-tool-wrapper .container-fluid {
                max-width: 1800px;
                padding: 20px;
            }
            
            #design-tool-wrapper .tool-panel {
                background: #dbdbdb;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                color: #333;
                margin-bottom: 20px;
            }
            
            #design-tool-wrapper .canvas-container-wrapper {
                background: #dbdbdb;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: auto;
                min-height: 600px;
            }
            
            #design-tool-wrapper .canvas-wrapper {
                position: relative;
                background: #f5f5f5;
                border: 2px solid #333;
            }
            
            #design-tool-wrapper #designCanvas {
                border: 1px solid #999;
                background: white;
            }
            
            #design-tool-wrapper .btn-tool {
                margin: 5px;
                min-width: 120px;
            }
            
            #design-tool-wrapper .btn:not(.btn-primary):not(.btn-success):not(.btn-danger):not(.btn-warning):not(.btn-secondary):not(.btn-info) {
                background: white;
            }
            
            #design-tool-wrapper .btn:not(.btn-primary):not(.btn-success):not(.btn-danger):not(.btn-warning):not(.btn-secondary):not(.btn-info):hover {
                background: #f0f0f0;
            }
            
            /* Override outline button hover text colors to be dark */
            #design-tool-wrapper .btn-outline-primary:hover,
            #design-tool-wrapper .btn-outline-success:hover,
            #design-tool-wrapper .btn-outline-info:hover,
            #design-tool-wrapper .btn-outline-warning:hover {
                color: #333 !important;
            }
            
            #design-tool-wrapper .control-group {
                margin-bottom: 4px;
                padding: 5px;
                background: white;
                border-radius: 8px;
            }
            
            #design-tool-wrapper .control-group label {
                font-weight: bold;
                display: block;
                margin-bottom: 5px;
                color: #333;
            }
            
            #design-tool-wrapper .shape-btn, 
            #design-tool-wrapper .country-btn {
                width: 100%;
                margin-bottom: 8px;
            }
            
            #design-tool-wrapper .coin-buttons {
                display: flex;
                gap: 3px;
                margin-bottom: 8px;
                justify-content: space-between;
            }
            
            #design-tool-wrapper .coin-buttons .btn {
                width: 40px;
                height: 40px;
                padding: 0;
                font-size: 10px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                flex-shrink: 0;
            }
            
            #design-tool-wrapper .quote-form {
                background: white;
                border-radius: 10px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                color: #333;
                margin-top: 30px;
            }
            
            #design-tool-wrapper .property-panel {
                background: white;
                padding: 15px;
                border-radius: 8px;
                margin-top: 10px;
                color: #333;
            }

            /* ── Compact the right Properties sidebar to match the left Coach
                 panel's density so it fits the viewport height (still scrolls as
                 a fallback). Overrides Bootstrap's input/select/button sizing. ── */
            #design-tool-wrapper .sidebar-right .tool-panel { padding: 10px 12px; margin-bottom: 10px; }
            #design-tool-wrapper .sidebar-right h3 { font-size: 0.95em; margin: 6px 0 4px; }
            #design-tool-wrapper .sidebar-right h3.mt-4 { margin-top: 6px !important; }
            #design-tool-wrapper .sidebar-right #propertiesPanel p { margin: 0; font-size: 0.8em; }
            #design-tool-wrapper .sidebar-right .property-panel { padding: 6px; margin-top: 6px; }
            #design-tool-wrapper .sidebar-right .control-group { margin-bottom: 3px; padding: 3px 5px; }
            #design-tool-wrapper .sidebar-right .control-group label,
            #design-tool-wrapper .sidebar-right label { margin-bottom: 0; font-size: 0.78em; font-weight: 600; }
            #design-tool-wrapper .sidebar-right input,
            #design-tool-wrapper .sidebar-right .form-control {
                font-size: 12px !important;
                padding: 2px 6px !important;
                margin-top: 1px !important;
                line-height: 1.2 !important;
                min-height: 0 !important;
                height: auto !important;
            }
            #design-tool-wrapper .sidebar-right select,
            #design-tool-wrapper .sidebar-right .form-select {
                font-size: 12px !important;
                padding: 2px 22px 2px 6px !important;   /* keep room for the arrow */
                margin-top: 1px !important;
                line-height: 1.2 !important;
                min-height: 0 !important;
                height: auto !important;
            }
            #design-tool-wrapper .sidebar-right input[type="color"] {
                width: 38px !important;
                height: 26px !important;
                padding: 1px !important;
            }
            #design-tool-wrapper .sidebar-right .color-picker-group { gap: 6px; }
            #design-tool-wrapper .sidebar-right .btn {
                font-size: 12px !important;
                padding: 3px 8px !important;
                line-height: 1.2 !important;
            }
            #design-tool-wrapper .sidebar-right .property-panel .mt-2,
            #design-tool-wrapper .sidebar-right .property-panel .mt-3 { margin-top: 4px !important; }
            #design-tool-wrapper .sidebar-right .mb-2 { margin-bottom: 4px !important; }
            #design-tool-wrapper .sidebar-right .mb-1 { margin-bottom: 2px !important; }

            #design-tool-wrapper input[type="number"],
            #design-tool-wrapper input[type="text"],
            #design-tool-wrapper input[type="email"],
            #design-tool-wrapper select {
                width: 100%;
                padding: 8px;
                border: 1px solid var(--border-color);
                border-radius: 4px;
                margin-top: 5px;
                color: #333;
            }
            
            #design-tool-wrapper .form-label {
                font-weight: bold;
                color: #333;
                font-size: 14px;
                margin-bottom: 5px;
                display: block;
            }
            
            #design-tool-wrapper .modal-body {
                color: #333;
            }
            
            #design-tool-wrapper .color-picker-group {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            #design-tool-wrapper .color-picker-group input[type="color"] {
                width: 60px;
                height: 40px;
                border: none;
                cursor: pointer;
            }
            
            #design-tool-wrapper .header-title {
                text-align: center;
                padding: 8px 0;
                margin-top: 8rem;
                margin-bottom: 0;
            }
            
            /* Sticky 3-column layout: sidebars scroll with page, canvas stays fixed */
            #design-tool-wrapper .main-layout {
                display: flex;
                align-items: flex-start;
                gap: 20px;
                max-width: 1800px;
                margin: 0 auto;
                padding: 10px 20px;
            }

            #design-tool-wrapper .sidebar-left,
            #design-tool-wrapper .sidebar-right {
                flex: 0 0 25%;
                max-width: 25%;
                overflow-x: hidden;
                /* FIX J: scroll internally so sidebars don't push the page taller than the viewport */
                max-height: calc(100vh - 80px);
                overflow-y: auto;
            }

            #design-tool-wrapper .canvas-column {
                flex: 1;
                display: flex;
                flex-direction: column;
                position: sticky;
                top: 10px;
            }

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

            /* Canvas toolbar */
            #design-tool-wrapper .canvas-toolbar {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 6px 10px;
                background: #dbdbdb;
                border-radius: 10px 10px 0 0;
                margin-bottom: 0;
                color: #333;
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

            /* Coin-shaped buttons for 20p and 50p using actual SVG path geometry */
            #design-tool-wrapper .coin-buttons .coin-btn-wrap {
                display: inline-block;
                filter: url(#coin-outline);
            }
            #design-tool-wrapper .coin-buttons .btn.coin-20p,
            #design-tool-wrapper .coin-buttons .btn.coin-50p {
                border-radius: 0;
                width: 46px;
                height: 46px;
                border: none !important;
            }
            #design-tool-wrapper .coin-buttons .btn.coin-20p {
                clip-path: url(#clip20p);
            }
            #design-tool-wrapper .coin-buttons .btn.coin-50p {
                clip-path: url(#clip50p);
            }

            /* Larger coin buttons for legibility */
            #design-tool-wrapper .coin-buttons .btn {
                width: 46px;
                height: 46px;
                font-size: 11px;
            }

            /* Compact buttons in the country outlines section */
            #design-tool-wrapper .country-buttons .btn {
                padding-top: 2px;
                padding-bottom: 2px;
            }

            /* Shape row labels */
            #design-tool-wrapper .shape-row-label {
                font-size: 0.8em;
                font-weight: bold;
                color: #666;
                margin-bottom: 2px;
            }
        </style>

        <!-- opentype.js for text-to-path export -->
        <script src="https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/dist/opentype.min.js"></script>
        <!-- d3-geo + topojson-client for runtime country contour generation -->
        <script src="https://cdn.jsdelivr.net/npm/d3-array@3.2.4/dist/d3-array.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/d3-geo@3.1.1/dist/d3-geo.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/dist/topojson-client.min.js"></script>

        <!-- ═══════════════════════════════════════════════════════
             COACH REGION — styles only; JS added in Task 3
             ═══════════════════════════════════════════════════════ -->
        <style>
            /* ── Glow applied to engine toolbar elements during a step ── */
            .coach-highlight {
                outline: 2px solid #344734 !important;
                box-shadow: 0 0 0 4px rgba(52, 71, 52, .35) !important;
                border-radius: 6px;
                transition: box-shadow .2s;
            }

            /* The Coach fills the left sidebar (all rules scoped under #coach-bubble). */
            #coach-bubble {
                position: static;
                width: 100%;
                max-width: none;
                background: #dbdbdb;
                color: #333;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, .1);
                font-size: 14px;
                overflow: hidden;
            }

            /* Step stepper — a compact horizontal row of numbered chips. */
            #coach-steps {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                align-items: center;
                gap: 5px;
                padding: 6px 12px 2px;
            }
            .coach-step-chip {
                flex: 0 0 auto;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                border: 1px solid transparent;
                background: #e3e3e3;
                color: #444;
                font-family: 'Athelas', Georgia, serif;
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
                transition: background .15s, color .15s, border-color .15s;
            }
            .coach-step-chip:hover { border-color: #344734; }
            /* Visited but not yet marked done */
            .coach-step-chip.is-used { background: #cfe3cf; color: #344734; }
            /* Done — Next was pressed on this step */
            .coach-step-chip.is-done { background: #4a7c4a; color: #fff; }
            /* The step currently open */
            .coach-step-chip.is-current { background: #344734; color: #fff; border-color: #344734; }

            /* "Start over" ↺ control, sitting at the far right of the step row. */
            .coach-startover {
                margin-left: auto;
                background: none;
                border: none;
                cursor: pointer;
                font-size: 1.2rem;
                font-weight: bold;
                line-height: 1;
                padding: 0 2px;
                color: #dc3545;
                opacity: 0.8;
                transition: opacity .15s;
            }
            .coach-startover:hover { opacity: 1; }

            /* Single changing label naming the current step. */
            #coach-header {
                display: flex;
                flex-direction: row;
                align-items: baseline;
                gap: 8px;
                padding: 0 12px 4px;
                background: transparent;
            }

            #coach-progress {
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: .06em;
                color: #4a7c4a;
                flex-shrink: 0;
            }

            #coach-title {
                font-weight: bold;
                color: #333;
                flex: 1;
                font-size: 16px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            #coach-body {
                padding: 8px 12px;
                min-height: 60px;
                line-height: 1.35;
                font-size: 14px;
                color: #333;
            }

            #coach-footer {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;   /* centre Back/Next within the panel */
                gap: 8px;
                padding: 6px 12px;
                border-top: 1px solid rgba(52, 71, 52, .12);
                border-bottom: 1px solid rgba(52, 71, 52, .12);
            }

            /* ── FIX I: Button colours & font consistency inside coach bubble ── */

            /* Font — inherit everywhere inside bubble */
            #coach-bubble,
            #coach-bubble * {
                font-family: 'Athelas', Georgia, serif;
            }

            /* …but Font Awesome icons must keep their own font, otherwise the
               blanket rule above forces them to serif and they show as tofu
               squares. Weights are left to FA's own .fas/.far rules. */
            #coach-bubble .fa, #coach-bubble .fas, #coach-bubble .fa-solid,
            #coach-bubble .far, #coach-bubble .fa-regular {
                font-family: "Font Awesome 6 Free" !important;
            }
            #coach-bubble .fab, #coach-bubble .fa-brands {
                font-family: "Font Awesome 6 Brands" !important;
            }

            /* Default filled green for ALL buttons inside coach bubble */
            #coach-bubble .btn {
                background: #344734 !important;
                color: #fff !important;
                border: 1px solid #344734 !important;
                font-family: inherit !important;
                font-size: 13px;
            }
            #coach-bubble .btn:hover {
                background: #2a3a2a !important;
                border-color: #2a3a2a !important;
            }

            /* btn-secondary and btn-outline-secondary in coach — keep dark-muted style */
            #coach-bubble .btn-secondary,
            #coach-bubble .btn-outline-secondary {
                background: #6c757d !important;
                color: #fff !important;
                border-color: #6c757d !important;
            }
            #coach-bubble .btn-secondary:hover,
            #coach-bubble .btn-outline-secondary:hover {
                background: #5a6268 !important;
                border-color: #5a6268 !important;
            }

            /* Accent button variants — JS adds the class (replaces the old inline
               !important styles). The :hover selector keeps the accent colour on
               hover, matching the old inline behaviour of no hover change. */
            #coach-bubble .coach-btn-yellow, #coach-bubble .coach-btn-yellow:hover { background: #ffc107 !important; color: #333 !important; border-color: #e0a800 !important; }
            #coach-bubble .coach-btn-red, #coach-bubble .coach-btn-red:hover { background: #dc3545 !important; color: #fff !important; border-color: #b02a37 !important; }
            #coach-bubble .coach-btn-country, #coach-bubble .coach-btn-country:hover { background: #5e7a8c !important; color: #fff !important; border-color: #4d6675 !important; }
            #coach-bubble .coach-btn-upload, #coach-bubble .coach-btn-upload:hover { background: #6f5b8e !important; color: #fff !important; border-color: #5b4a75 !important; }

            /* Active / selected state — after the accents so a selected accent
               button still shows the light-green chosen look */
            #coach-bubble .btn.active, #coach-bubble .btn.active:hover {
                background: #cfe3cf !important;
                color: #344734 !important;
                border-color: #cfe3cf !important;
            }

            /* Download (btn-success) and Quote (btn-primary) — theme green variants */
            #coach-bubble .btn-success {
                background: #198754 !important;
                color: #fff !important;
                border-color: #198754 !important;
            }
            #coach-bubble .btn-success:hover {
                background: #157347 !important;
                border-color: #157347 !important;
            }
            #coach-bubble .btn-primary {
                background: #344734 !important;
                color: #fff !important;
                border-color: #344734 !important;
            }
            #coach-bubble .btn-primary:hover {
                background: #2a3a2a !important;
                border-color: #2a3a2a !important;
            }

            /* Back / Next footer nav buttons — equal, compact, yellow accent */
            #coach-back,
            #coach-next {
                background: #ffc107 !important;
                color: #333 !important;
                font-weight: bold !important;
                box-sizing: border-box !important;
                border: 1px solid #e0a800 !important;
                border-radius: 6px;
                padding: 4px 18px !important;
                line-height: 1.3 !important;
                font-size: 13px;
                cursor: pointer;
                vertical-align: middle;
                white-space: nowrap !important;   /* keep the ‹ / › on one line */
                flex: 0 0 auto;                    /* don't let flexbox shrink & wrap them */
            }
            #coach-back:hover,
            #coach-next:hover {
                background: #e0a800 !important;
                border-color: #c69500 !important;
                color: #333 !important;
            }

            /* Action-button rows fill the bubble width; buttons share it equally
               (1 button → full width, 2 → halves, 3 → thirds, etc.).
               .coach-btns gives the same uniform buttons to togglable panels whose
               display is controlled inline (so we must NOT force display here). */
            #coach-body .coach-row {
                display: flex !important;
                flex-wrap: wrap;
                gap: 6px;
                width: 100%;
            }
            #coach-body .coach-row > .btn,
            #coach-body .coach-btns > .btn {
                /* Equal-width cells, but a minimum of ~a quarter so at most four
                   buttons sit on one row before wrapping. */
                flex: 1 1 calc(25% - 6px);
                min-width: calc(25% - 6px);
                max-width: 100%;
                white-space: normal;      /* wrap between words rather than widen the button */
                overflow-wrap: normal;    /* but never split a single word */
                word-break: keep-all;
                text-align: center;
                padding-left: 6px;        /* tighter margins so labels fit */
                padding-right: 6px;
            }
            /* At most two buttons per row (used by the Arrange step) */
            #coach-body .coach-row-2 > .btn {
                flex: 1 1 calc(50% - 3px);
                min-width: calc(50% - 3px);
            }
            /* Currency tabs (step 5): fixed quarter-width so a lone tab on the
               last row (e.g. Pressed Penny) doesn't stretch to fill it. */
            #coach-body .coach-row > .btn.coach-tab {
                flex: 0 0 calc(25% - 6px);
                min-width: calc(25% - 6px);
                max-width: calc(25% - 6px);
            }

            /* ── Compact the in-sidebar Coach so each step fits the viewport
                 height without scrolling (reduce button/input heights, margins
                 and gaps; the sidebar still scrolls as a fallback). ── */
            #coach-body p { margin-bottom: 6px; }
            /* Step explainer — italic lead text, no box (chosen style). */
            #coach-body p.coach-intro {
                font-style: italic;
                color: #333;
                margin-bottom: 10px !important;
                font-size: 13px;
                line-height: 1.45;
            }
            #coach-body .btn {
                padding-top: 3px !important;
                padding-bottom: 3px !important;
                line-height: 1.2 !important;
            }
            #coach-body .form-control,
            #coach-body .form-select,
            #coach-body input,
            #coach-body select {
                font-size: 12px !important;
                padding: 2px 6px !important;
                margin-top: 1px !important;
                line-height: 1.2 !important;
                min-height: 0 !important;
                height: auto !important;
            }
            #coach-body .form-select { padding-right: 22px !important; } /* room for the arrow */
            #coach-body .form-label { margin-bottom: 1px; }
            #coach-body .small { font-size: 11px; }
            /* Tighten Bootstrap spacing utilities used inside the steps */
            #coach-body .mb-3 { margin-bottom: 6px !important; }
            #coach-body .mb-2 { margin-bottom: 4px !important; }
            #coach-body .mb-1 { margin-bottom: 2px !important; }
            #coach-body .mt-1 { margin-top: 2px !important; }
            #coach-body .mt-2,
            #coach-body .mt-3,
            #coach-body .mt-4 { margin-top: 4px !important; }
            #coach-body .gap-2 { gap: 4px !important; }
            #coach-body .d-flex.flex-column.gap-2 { gap: 3px !important; }
        </style>
        <!-- ═══════════════════════════════════════════════════════
             END COACH STYLES
             ═══════════════════════════════════════════════════════ -->
    </head>
    <body>
        <div id="design-tool-wrapper">
            <div class="header-title" style="padding: 8px 0; margin-bottom: 0;">
                <h1 style="font-size: 1.4em; margin: 0; color: white;">Design Your Custom Coin Holder</h1>
            </div>

            <div class="main-layout">
                <!-- Left Sidebar - Coach (guided builder) -->
                <div class="sidebar-left">
                    <div id="coach-bubble">
                        <div id="coach-steps"></div>
                        <div id="coach-header">
                            <span id="coach-progress"></span>
                            <span id="coach-title"></span>
                        </div>
                        <div id="coach-footer">
                            <button id="coach-back" type="button">‹ Back</button>
                            <button id="coach-next" type="button">Next ›</button>
                        </div>
                        <div id="coach-body"></div>
                        <!-- Hidden file inputs: the engine attaches change-listeners by id and the Coach triggers them via .click(), so they must stay in the DOM. -->
                        <input type="file" id="imageUpload" accept="image/png,image/jpg,image/jpeg" style="display:none;">
                        <input type="file" id="fileImport" accept=".svg" style="display:none;">
                    </div>
                </div>

                <!-- Center - Canvas -->
                <div class="canvas-column">
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
                        <button class="btn btn-sm btn-outline-secondary" onclick="resetZoom()" title="Fit to screen">
                            <i class="fas fa-compress-arrows-alt"></i>
                        </button>
                        <div class="toolbar-separator"></div>
                        <div class="settings-dropdown">
                            <button class="btn btn-sm btn-outline-secondary" id="coachSettingsBtn" onclick="toggleSettingsDropdown()" title="Canvas size settings">
                                <i class="fas fa-cog"></i>
                            </button>
                            <div class="settings-dropdown-content" id="settingsDropdown">
                                <label class="form-label" style="font-weight: bold;">Canvas size</label>
                                <select id="canvasSizeToolbar" class="form-select mb-2">
                                    <option value="a4">A4 (210 x 297 mm)</option>
                                    <option value="a3">A3 (297 x 420 mm)</option>
                                    <option value="a2">A2 (420 x 594 mm)</option>
                                    <option value="a1">A1 (594 x 841 mm)</option>
                                    <option value="custom" selected>Custom size</option>
                                </select>
                                <div id="customSizeInputsToolbar" style="display:block; margin-top:8px;">
                                    <label class="form-label" style="color: #333; font-size: 12px;" id="customSizeLabelToolbar">Enter size in mm:</label>
                                    <input type="number" id="customWidthToolbar" placeholder="Width (mm)" class="form-control mb-2" min="0.1" step="0.01" value="390">
                                    <input type="number" id="customHeightToolbar" placeholder="Height (mm)" class="form-control mb-2" min="0.1" step="0.01" value="300">
                                </div>
                                <label class="form-label" style="font-weight: bold; margin-top: 8px;">Units</label>
                                <div class="segmented-control">
                                    <button class="active" id="unitMMToolbar" onclick="setUnit('mm')">MM</button>
                                    <button id="unitInchToolbar" onclick="setUnit('inch')">INCH</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="canvas-container-wrapper" style="border-radius: 0 0 10px 10px;">
                        <div class="canvas-wrapper" id="canvasWrapper">
                            <canvas id="designCanvas"></canvas>
                            <div class="canvas-hint" id="canvasHint">
                                Follow the steps on the left to build your coin holder
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Right Sidebar - Properties -->
                <div class="sidebar-right">
                    <div class="tool-panel">
                        <h3>Selected item</h3>
                        <div id="propertiesPanel">
                            <p class="text-muted">Click an item on the canvas to edit it</p>
                        </div>

                        <div class="property-panel" id="alignSection" style="display:none;">
                            <!-- Same structure as the X/Y rows: a white control-group card
                                 with a bold label and the button rows as its content. -->
                            <div class="control-group">
                                <label style="white-space: nowrap; font-size: 0.85em; font-family: 'IvyMode', 'Times New Roman', serif;">Alignment:</label>
                                <div style="display: flex; gap: 6px; margin-bottom: 4px;">
                                <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" onclick="alignSelected('left')" title="Align left edges"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="1" y="0.5" width="2" height="15"/><rect x="3" y="2.5" width="9" height="4"/><rect x="3" y="9.5" width="6" height="4"/></svg></button>
                                <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" onclick="alignSelected('centerh')" title="Align horizontal centres"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="7" y="0.5" width="2" height="15"/><rect x="3" y="2.5" width="10" height="4"/><rect x="5" y="9.5" width="6" height="4"/></svg></button>
                                <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" onclick="alignSelected('right')" title="Align right edges"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="13" y="0.5" width="2" height="15"/><rect x="4" y="2.5" width="9" height="4"/><rect x="7" y="9.5" width="6" height="4"/></svg></button>
                                </div>
                                <div style="display: flex; gap: 6px; margin-bottom: 4px;">
                                <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" onclick="alignSelected('top')" title="Align top edges"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="0.5" y="1" width="15" height="2"/><rect x="2.5" y="3" width="4" height="9"/><rect x="9.5" y="3" width="4" height="6"/></svg></button>
                                <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" onclick="alignSelected('middle')" title="Align vertical centres"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="0.5" y="7" width="15" height="2"/><rect x="2.5" y="3" width="4" height="10"/><rect x="9.5" y="5" width="4" height="6"/></svg></button>
                                <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" onclick="alignSelected('bottom')" title="Align bottom edges"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="0.5" y="13" width="15" height="2"/><rect x="2.5" y="4" width="4" height="9"/><rect x="9.5" y="7" width="4" height="6"/></svg></button>
                                </div>
                                <div style="display: flex; gap: 6px; margin-bottom: 4px;">
                                <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" id="distributeHBtn" onclick="distributeSelected('h')" title="Distribute horizontally — equal centre spacing between first and last"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="1" y="0.5" width="2" height="15"/><rect x="13" y="0.5" width="2" height="15"/><rect x="6" y="3" width="4" height="10"/></svg></button>
                                <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" id="distributeVBtn" onclick="distributeSelected('v')" title="Distribute vertically — equal centre spacing between first and last"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="0.5" y="1" width="15" height="2"/><rect x="0.5" y="13" width="15" height="2"/><rect x="3" y="6" width="10" height="4"/></svg></button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="property-panel" id="objectProperties" style="display:none;">
                            <div class="control-group" style="display: flex; gap: 8px;">
                                <div style="flex: 1;">
                                    <label style="white-space: nowrap; font-size: 0.85em;">X:</label>
                                    <input type="number" id="posX" step="0.1">
                                </div>
                                <div style="flex: 1;">
                                    <label style="white-space: nowrap; font-size: 0.85em;">Y:</label>
                                    <input type="number" id="posY" step="0.1">
                                </div>
                            </div>
                            <div class="control-group" style="display: flex; gap: 8px;">
                                <div style="flex: 1;">
                                    <label>Width:</label>
                                    <input type="number" id="objWidth" step="0.1">
                                </div>
                                <div style="flex: 1;">
                                    <label>Height:</label>
                                    <input type="number" id="objHeight" step="0.1">
                                </div>
                            </div>
                            <!-- Holder aspect-ratio lock — mirrors the Coach step-2 toggle and the object's drag behaviour. -->
                            <button type="button" id="coach-aspect-right" class="btn btn-sm w-100 mb-1"
                                    style="background:#ffc107;color:#333;border:1px solid #e0a800;font-weight:bold;"
                                    onclick="Coach.toggleSelectedAspectLock()">🔓 Resize freely</button>
                            <div class="control-group" id="cornerRadiusRotationGroup" style="display: flex; gap: 8px;">
                                <div style="flex: 1;" id="cornerRadiusGroup">
                                    <label style="white-space: nowrap; font-size: 0.85em;">Corner rounding:</label>
                                    <input type="number" id="cornerRadius" step="0.1" min="0">
                                </div>
                                <div style="flex: 1;">
                                    <label style="white-space: nowrap; font-size: 0.85em;">Rotation:</label>
                                    <input type="number" id="objRotation" step="1">
                                </div>
                            </div>
                            <div class="control-group" id="materialPresetGroup">
                                <label>Material:</label>
                                <select id="materialPreset" class="form-select">
                                    <option value="color">Plastic</option>
                                    <option value="birch">Birch Plywood</option>
                                    <option value="oak">Oak Wood</option>
                                    <option value="walnut">Walnut Wood</option>
                                </select>
                            </div>
                            <div class="control-group" style="display: flex; gap: 8px; align-items: flex-start;">
                                <div style="flex: 1;" id="fillColorGroup">
                                    <label>Colour:</label>
                                    <select id="fillColor" class="form-select" style="font-family: monospace;">
                                        <option value="#000000" style="background: #000000; color: white;">⬛ Black</option>
                                        <option value="#FFFFFF" style="background: #FFFFFF; color: black; border: 1px solid #ccc;">⬜ White</option>
                                        <option value="#F5F5DC" style="background: #F5F5DC; color: black;">🟨 Mat White</option>
                                        <option value="transparent" style="background: repeating-linear-gradient(45deg, #ccc, #ccc 5px, white 5px, white 10px);">⬜ No Fill</option>
                                        <option value="#FF0000" style="background: #FF0000; color: white;">🟥 Red</option>
                                        <option value="#FFFF00" style="background: #FFFF00; color: black;">🟨 Yellow</option>
                                        <option value="#0000FF" style="background: #0000FF; color: white;">🟦 Blue</option>
                                        <option value="#87CEEB" style="background: #87CEEB; color: black;">🟦 Light Blue</option>
                                        <option value="#00FF00" style="background: #00FF00; color: black;">🟩 Green</option>
                                    </select>
                                </div>
                                <div style="flex: 1;" id="strokeColorGroup">
                                    <label>Border:</label>
                                    <div class="color-picker-group">
                                        <input type="color" id="strokeColor">
                                        <input type="number" id="strokeWidth" min="0" max="20" step="0.1" placeholder="Width">
                                    </div>
                                </div>
                            </div>
                            <div class="control-group" id="textPropsGroup" style="display:none;">
                                <label>Font:</label>
                                <select id="fontFamily" class="form-select">
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
                                </select>
                                <label class="mt-2">Font Size:</label>
                                <input type="number" id="fontSize" min="8" max="200">
                                <label class="mt-2">Text:</label>
                                <input type="text" id="textContent">
                            </div>
                            <button class="btn btn-success w-100 mt-3" onclick="duplicateSelected()">
                                <i class="fas fa-copy"></i> Make a copy
                            </button>
                            <div style="display: flex; gap: 4px; margin-top: 4px;">
                                <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" onclick="mirrorHorizontal()">
                                    <i class="fas fa-arrows-alt-h"></i> Flip H
                                </button>
                                <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" onclick="mirrorVertical()">
                                    <i class="fas fa-arrows-alt-v"></i> Flip V
                                </button>
                                <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" onclick="rotate90()">
                                    <i class="fas fa-redo"></i> 90°
                                </button>
                            </div>
                            <button class="btn btn-danger w-100 mt-2" onclick="deleteSelected()">
                                <i class="fas fa-trash"></i> Delete (Del)
                            </button>
                        </div>
                        
                        <h3 class="mt-4">Finish up</h3>
                        <!-- All actions stay disabled until the canvas has objects (Coach.updateActionButtons). -->
                        <button class="btn btn-primary w-100 mb-2" id="coachQuoteBtn" onclick="Coach.requestQuote()" disabled>
                            <i class="fas fa-paper-plane"></i> Request a quote
                        </button>
                        <button class="btn btn-success w-100 mb-2" id="downloadBtn" disabled>
                            <i class="fas fa-download"></i> Download your design
                        </button>
                        <button class="btn btn-secondary w-100 mb-2" id="saveProjectBtn" onclick="Coach.persist.exportToFile()" disabled>
                            <i class="fas fa-floppy-disk"></i> Save project to a file
                        </button>
                        <p class="text-muted small mb-2">Saves an editable copy you can re-open later with “Load a saved project”.</p>
                        <button class="btn btn-warning w-100 mb-2" id="clearBtn" onclick="Coach.startOver()" disabled>
                            <i class="fas fa-sync-alt"></i> Start over
                        </button>
                    </div>
                </div>
            </div>

            <!-- Tips & Shortcuts -->
            <div style="max-width: 1800px; margin: 0 auto; padding: 20px;">
                <div class="tool-panel">
                    <h3>Tips & Shortcuts</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 40px;">
                        <!-- Column 1 — guided-builder manual -->
                        <div>
                            <h5 style="font-size: 0.95em;">How to use</h5>
                            <p style="font-size: 0.85em; margin: 0 0 8px;">
                                This is a guided builder. The panel on the left walks you through eight steps —
                                tap the numbered circles at the top to jump between them anytime. Your progress
                                saves automatically on this device, so you can leave and come back later.
                            </p>

                            <h6 style="font-size: 0.88em; font-weight: bold; margin: 10px 0 2px;">The eight steps</h6>
                            <ol style="font-size: 0.85em; padding-left: 1.2em; margin: 0;">
                                <li><strong>Welcome</strong> — name your design and pick the occasion (optional). Returning? Use <strong>Load a saved project</strong> here.</li>
                                <li><strong>Choose a shape</strong> — a rectangle, circle, a country outline, or upload your own SVG. Set the size in millimetres.</li>
                                <li><strong>Choose a material</strong> — a wood finish (birch, oak, walnut) or a solid plastic colour.</li>
                                <li><strong>Add fixtures</strong> — optional mounting holes. Add them automatically or one at a time, drag them into place, and pick their colour.</li>
                                <li><strong>Add your coins</strong> — pick a currency tab and add coins (or use “Add all selected” for the whole set), or enter a custom size.</li>
                                <li><strong>Arrange the coins</strong> — try a layout (Grid, Circle, Rows, Fit to shape), move them all above the holder, or drag each coin yourself.</li>
                                <li><strong>Personalise it</strong> — add a name or message, a country shape, or upload a logo, then preview the engraved look.</li>
                                <li><strong>Review &amp; order</strong> — check the summary, then download the design, save the project, or request a quote.</li>
                            </ol>

                            <h6 style="font-size: 0.88em; font-weight: bold; margin: 12px 0 2px;">Working on the canvas</h6>
                            <ul style="font-size: 0.85em; padding-left: 1.2em; margin: 0;">
                                <li>Click an item to select it — drag to move, use the corner handles to resize.</li>
                                <li>Edit colour, border, font and size in the <strong>Selected item</strong> panel on the right.</li>
                                <li><strong>Keep proportions / Resize freely</strong> sets whether a shape holds its aspect ratio while resizing.</li>
                                <li>The toolbar above the canvas has zoom, <strong>Fit to screen</strong>, and holder size / unit settings.</li>
                            </ul>

                            <h6 style="font-size: 0.88em; font-weight: bold; margin: 12px 0 2px;">Saving &amp; ordering</h6>
                            <ul style="font-size: 0.85em; padding-left: 1.2em; margin: 0;">
                                <li><strong>Save project to a file</strong> downloads an editable copy — reopen it later with <strong>Load a saved project</strong> on step 1.</li>
                                <li><strong>Download your design</strong> exports a print-ready SVG.</li>
                                <li><strong>Request a quote</strong> e-mails your design to us, with the editable project file attached.</li>
                            </ul>
                        </div>

                        <!-- Column 2 — shortcuts, mouse, good to know -->
                        <div>
                            <h5 style="font-size: 0.95em;">Keyboard Shortcuts</h5>
                            <table style="font-size: 0.85em;">
                                <tr><td style="padding: 2px 12px 2px 0;"><kbd>Delete</kbd> or <kbd>Backspace</kbd></td><td>Remove selected items</td></tr>
                                <tr><td style="padding: 2px 12px 2px 0;"><kbd>Ctrl + D</kbd></td><td>Duplicate selected items</td></tr>
                                <tr><td style="padding: 2px 12px 2px 0;"><kbd>C</kbd></td><td>Align horizontal centres (multiple items selected)</td></tr>
                                <tr><td style="padding: 2px 12px 2px 0;"><kbd>E</kbd></td><td>Align vertical centres (multiple items selected)</td></tr>
                                <tr><td style="padding: 2px 12px 2px 0;"><kbd>Ctrl + Z</kbd></td><td>Undo</td></tr>
                                <tr><td style="padding: 2px 12px 2px 0;"><kbd>Ctrl + Y</kbd> or <kbd>Ctrl + Shift + Z</kbd></td><td>Redo</td></tr>
                            </table>

                            <h5 style="font-size: 0.95em; margin-top: 16px;">Mouse Controls</h5>
                            <table style="font-size: 0.85em;">
                                <tr><td style="padding: 2px 12px 2px 0;"><kbd>Drag</kbd></td><td>Move the selected item</td></tr>
                                <tr><td style="padding: 2px 12px 2px 0;"><kbd>Corner handles</kbd></td><td>Resize the selected item</td></tr>
                                <tr><td style="padding: 2px 12px 2px 0;"><kbd>Ctrl + Scroll wheel</kbd></td><td>Zoom in / out</td></tr>
                                <tr><td style="padding: 2px 12px 2px 0;"><kbd>Alt / Ctrl + drag</kbd></td><td>Pan the canvas</td></tr>
                            </table>

                            <h5 style="font-size: 0.95em; margin-top: 16px;">Good to know</h5>
                            <ul style="font-size: 0.85em; padding-left: 1.2em; margin: 0;">
                                <li>Coins use real-world sizes, so slots match the actual coins.</li>
                                <li>Text becomes outlines on export, so your design looks identical on any computer.</li>
                                <li>Lost something off-screen? Press <strong>Fit to screen</strong> in the toolbar.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quote Form Modal -->
            <div class="modal fade" id="quoteModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header" style="background: var(--lunar-green); color: white;">
                            <h5 class="modal-title">Request a Quote</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="quoteForm" method="POST" enctype="multipart/form-data">
                                <div class="mb-3">
                                    <label class="form-label">Design Name *</label>
                                    <input type="text" class="form-control" id="projectName" name="project_name" required placeholder="e.g. Anniversary coin holder">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">First Name *</label>
                                    <input type="text" class="form-control" id="firstName" name="first_name" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Last Name *</label>
                                    <input type="text" class="form-control" id="lastName" name="last_name" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Email *</label>
                                    <input type="email" class="form-control" id="userEmail" name="email" required>
                                </div>
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
                                <div class="mb-3">
                                    <label class="form-label">Anything else we should know?</label>
                                    <textarea class="form-control" id="userNotes" name="notes" rows="4" placeholder="e.g. Quantity needed, deadline, special requests..."></textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Upload your own design (optional)</label>
                                    <p class="text-muted small">Already have a design file? Upload it here (SVG format). Otherwise, your design from the canvas will be included automatically.</p>
                                    <input type="file" class="form-control" id="designFileInput" name="attachment" accept=".svg">
                                </div>
                                <div class="mb-3 p-3" style="background: #f0f8f0; border-radius: 8px;" id="designSummary">
                                    <p class="mb-1" style="font-weight: bold; font-size: 0.9em;"><i class="fas fa-check-circle" style="color: var(--lunar-green);"></i> Your design will be included automatically</p>
                                    <p class="mb-0 text-muted small" id="designSummaryDetails"></p>
                                </div>
                                <div id="formMessages"></div>
                                <div class="alert alert-info" id="infoMessage">
                                    <i class="fas fa-info-circle"></i> After submitting, you'll receive a confirmation and we'll get back to you within 24 hours.
                                </div>
                                <button type="submit" class="btn btn-primary w-100" id="submitBtn">
                                    <i class="fas fa-paper-plane"></i> Submit Quote Request
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Sticky "Request Quote" footer removed — use the Coach's Review step (Request a Quote / Download SVG). -->
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        <script>
            // Font binary URLs for opentype.js text-to-path conversion at export time.
            // Source: @fontsource packages on jsDelivr (WOFF format, natively supported by opentype.js).
            const FONT_URLS = {
                'Roboto':               'https://cdn.jsdelivr.net/npm/@fontsource/roboto@5.0.8/files/roboto-latin-400-normal.woff',
                'Lora':                 'https://cdn.jsdelivr.net/npm/@fontsource/lora@5.0.8/files/lora-latin-400-normal.woff',
                'Inconsolata':          'https://cdn.jsdelivr.net/npm/@fontsource/inconsolata@5.0.8/files/inconsolata-latin-400-normal.woff',
                'Open Sans':            'https://cdn.jsdelivr.net/npm/@fontsource/open-sans@5.0.12/files/open-sans-latin-400-normal.woff',
                'Nunito':               'https://cdn.jsdelivr.net/npm/@fontsource/nunito@5.0.8/files/nunito-latin-400-normal.woff',
                'Josefin Sans':         'https://cdn.jsdelivr.net/npm/@fontsource/josefin-sans@5.0.8/files/josefin-sans-latin-400-normal.woff',
                'Anton':                'https://cdn.jsdelivr.net/npm/@fontsource/anton@5.0.8/files/anton-latin-400-normal.woff',
                'Patrick Hand':         'https://cdn.jsdelivr.net/npm/@fontsource/patrick-hand@5.0.8/files/patrick-hand-latin-400-normal.woff',
                'EB Garamond':          'https://cdn.jsdelivr.net/npm/@fontsource/eb-garamond@5.0.8/files/eb-garamond-latin-400-normal.woff',
                'PT Sans':              'https://cdn.jsdelivr.net/npm/@fontsource/pt-sans@5.0.8/files/pt-sans-latin-400-normal.woff',
                'Cormorant Garamond':   'https://cdn.jsdelivr.net/npm/@fontsource/cormorant-garamond@5.0.8/files/cormorant-garamond-latin-400-normal.woff'
            };

            // Cache of loaded opentype.Font objects — avoids re-fetching per export session
            const fontBinaryCache = {};

            // Fallback font key used when an unknown fontFamily is encountered
            const FONT_FALLBACK = 'Open Sans';

            // Global variables
            let canvas;
            let currentUnit = 'mm'; // 'mm' or 'inch'
            let mmToInch = 0.0393701;
            let canvasSizes = {
                a4: { width: 210, height: 297 },
                a3: { width: 297, height: 420 },
                a2: { width: 420, height: 594 },
                a1: { width: 594, height: 841 },
                custom: { width: 390, height: 300 }
            };
            let currentCanvasSize = 'custom';
            
            // History management
            let history = [];
            let historyStep = 0;
            let isRedoing = false;
            let isUndoing = false;
            
            // Wood grain patterns (stored globally once created)
            let woodPatterns = {};
            
            // Function to create tileable wood grain patterns
            function createWoodPattern(type) {
                const patternCanvas = document.createElement('canvas');
                const size = 1024; // Very large size to minimize visible repetition
                patternCanvas.width = size;
                patternCanvas.height = size;
                const ctx = patternCanvas.getContext('2d');
                
                // Base colors for different wood types
                const woodColors = {
                    birch: { base: '#f5e6d3', grain: ['#e8d4bb', '#d4b896', '#c9a97a', '#e0cdb0'] },
                    oak: { base: '#c19a6b', grain: ['#b08554', '#9d7043', '#8b5a2b', '#a87d50'] },
                    walnut: { base: '#5c4033', grain: ['#4a332a', '#3d2b24', '#2f211b', '#523929'] }
                };
                
                const colors = woodColors[type];
                
                // Fill base color
                ctx.fillStyle = colors.base;
                ctx.fillRect(0, 0, size, size);
                
                // Seeded random for reproducibility
                let seed = type.charCodeAt(0) * 12345;
                function seededRandom() {
                    seed = (seed * 9301 + 49297) % 233280;
                    return seed / 233280;
                }
                
                // Create seamless Perlin-like noise texture
                ctx.globalAlpha = 0.06;
                for (let i = 0; i < size * 4; i++) {
                    const x = seededRandom() * size;
                    const y = seededRandom() * size;
                    const radius = seededRandom() * 2 + 0.5;
                    const grainColor = colors.grain[Math.floor(seededRandom() * colors.grain.length)];
                    ctx.fillStyle = grainColor;
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                // Draw wood grain using random disconnected strokes - no periodic patterns
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                
                // Draw many short, slightly wavy grain segments randomly placed
                const grainSegments = 800; // Many small segments instead of continuous lines
                
                for (let i = 0; i < grainSegments; i++) {
                    const grainColor = colors.grain[Math.floor(seededRandom() * colors.grain.length)];
                    ctx.strokeStyle = grainColor;
                    ctx.lineWidth = seededRandom() * 1.5 + 0.5;
                    ctx.globalAlpha = 0.15 + seededRandom() * 0.15; // Varying opacity
                    
                    // Random starting position
                    const startX = seededRandom() * size;
                    const startY = seededRandom() * size;
                    
                    // Short segment length
                    const segmentLength = 40 + seededRandom() * 80;
                    
                    // Slight horizontal drift for wood grain effect
                    const driftAmount = (seededRandom() - 0.5) * 8;
                    
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    
                    // Draw a gently curving vertical segment
                    const steps = Math.floor(segmentLength / 8);
                    for (let step = 1; step <= steps; step++) {
                        const progress = step / steps;
                        const y = startY + segmentLength * progress;
                        
                        // Very gentle curve using smooth interpolation
                        const xOffset = driftAmount * Math.sin(progress * Math.PI);
                        const x = startX + xOffset;
                        
                        ctx.lineTo(x, y);
                    }
                    ctx.stroke();
                }
                
                // Add broader, more subtle background grain flows
                ctx.globalAlpha = 0.08;
                for (let i = 0; i < 200; i++) {
                    const grainColor = colors.grain[Math.floor(seededRandom() * colors.grain.length)];
                    ctx.strokeStyle = grainColor;
                    ctx.lineWidth = seededRandom() * 2.5 + 1;
                    
                    const startX = seededRandom() * size;
                    const startY = seededRandom() * size;
                    const length = 80 + seededRandom() * 120;
                    const drift = (seededRandom() - 0.5) * 15;
                    
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    
                    const steps = Math.floor(length / 12);
                    for (let step = 1; step <= steps; step++) {
                        const progress = step / steps;
                        const y = startY + length * progress;
                        const xOffset = drift * Math.sin(progress * Math.PI);
                        ctx.lineTo(startX + xOffset, y);
                    }
                    ctx.stroke();
                }
                
                // Add subtle organic blotches for variation (with edge wrapping)
                ctx.globalAlpha = 0.08;
                for (let i = 0; i < 12; i++) {
                    const centerX = seededRandom() * size;
                    const centerY = seededRandom() * size;
                    const radiusBase = seededRandom() * 35 + 25;
                    
                    // Draw main blotch
                    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radiusBase);
                    const grainColor = colors.grain[Math.floor(seededRandom() * colors.grain.length)];
                    gradient.addColorStop(0, grainColor);
                    gradient.addColorStop(0.7, grainColor);
                    gradient.addColorStop(1, 'transparent');
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radiusBase, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Wrap edges - if near border, draw mirrored copy on opposite side
                    if (centerX < radiusBase * 1.5) {
                        const gradient2 = ctx.createRadialGradient(centerX + size, centerY, 0, centerX + size, centerY, radiusBase);
                        gradient2.addColorStop(0, grainColor);
                        gradient2.addColorStop(0.7, grainColor);
                        gradient2.addColorStop(1, 'transparent');
                        ctx.fillStyle = gradient2;
                        ctx.beginPath();
                        ctx.arc(centerX + size, centerY, radiusBase, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    if (centerX > size - radiusBase * 1.5) {
                        const gradient2 = ctx.createRadialGradient(centerX - size, centerY, 0, centerX - size, centerY, radiusBase);
                        gradient2.addColorStop(0, grainColor);
                        gradient2.addColorStop(0.7, grainColor);
                        gradient2.addColorStop(1, 'transparent');
                        ctx.fillStyle = gradient2;
                        ctx.beginPath();
                        ctx.arc(centerX - size, centerY, radiusBase, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    if (centerY < radiusBase * 1.5) {
                        const gradient2 = ctx.createRadialGradient(centerX, centerY + size, 0, centerX, centerY + size, radiusBase);
                        gradient2.addColorStop(0, grainColor);
                        gradient2.addColorStop(0.7, grainColor);
                        gradient2.addColorStop(1, 'transparent');
                        ctx.fillStyle = gradient2;
                        ctx.beginPath();
                        ctx.arc(centerX, centerY + size, radiusBase, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    if (centerY > size - radiusBase * 1.5) {
                        const gradient2 = ctx.createRadialGradient(centerX, centerY - size, 0, centerX, centerY - size, radiusBase);
                        gradient2.addColorStop(0, grainColor);
                        gradient2.addColorStop(0.7, grainColor);
                        gradient2.addColorStop(1, 'transparent');
                        ctx.fillStyle = gradient2;
                        ctx.beginPath();
                        ctx.arc(centerX, centerY - size, radiusBase, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
                
                // Add fine grain texture for detail - randomly distributed
                ctx.globalAlpha = 0.13;
                for (let i = 0; i < 70; i++) {
                    const grainColor = colors.grain[Math.floor(seededRandom() * colors.grain.length)];
                    ctx.strokeStyle = grainColor;
                    ctx.lineWidth = 0.4 + seededRandom() * 0.7;
                    
                    const startX = seededRandom() * size;
                    const startY = seededRandom() * size;
                    const length = 25 + seededRandom() * 45;
                    const angle = (seededRandom() * 0.25 - 0.125); // Nearly vertical with variation
                    const waviness = seededRandom() * 0.8;
                    
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    
                    // Draw wavy short lines
                    for (let j = 0; j <= length && startY + j < size; j += 2.5) {
                        const x = startX + Math.sin(angle) * j + Math.sin(j * 0.12) * waviness;
                        const y = startY + j;
                        
                        if (x > 0 && x < size) {
                            ctx.lineTo(x, y);
                        }
                    }
                    ctx.stroke();
                }
                
                // Add very subtle texture noise - fully random to avoid patterns
                ctx.globalAlpha = 0.06;
                for (let i = 0; i < size * 2.5; i++) {
                    const x = seededRandom() * size;
                    const y = seededRandom() * size;
                    const radius = seededRandom() * 1.8 + 0.4;
                    const grainColor = colors.grain[Math.floor(seededRandom() * colors.grain.length)];
                    ctx.fillStyle = grainColor;
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                ctx.globalAlpha = 1.0;
                
                return patternCanvas;
            }
            
            // Cascade colour changes to objects spatially contained within the changed object.
            // Non-circle/non-ellipse contained objects change fill to match the material's logical colour:
            //   wood → brown #5c3316
            //   plastic (non-white) → white #ffffff (visible against dark backgrounds)
            //   white plastic → light grey #d3d3d3 (avoids invisible white-on-white)
            function cascadeColorToContained(changedObject, fillType, plasticColor) {
                const bounds = changedObject.getBoundingRect();

                canvas.getObjects().forEach(function(obj) {
                    if (obj === changedObject) return;

                    // Check if this object's centre point is inside changedObject's bounding rect
                    const center = obj.getCenterPoint();
                    const inside = center.x >= bounds.left &&
                                   center.x <= bounds.left + bounds.width &&
                                   center.y >= bounds.top &&
                                   center.y <= bounds.top + bounds.height;
                    if (!inside) return;

                    // Determine the cascade colour
                    let cascadeColor;
                    if (fillType === 'birch' || fillType === 'oak' || fillType === 'walnut') {
                        cascadeColor = '#5c3316';
                    } else {
                        // plastic
                        const isWhite = plasticColor === '#ffffff' || plasticColor === '#FFFFFF';
                        cascadeColor = isWhite ? '#d3d3d3' : '#ffffff';
                    }

                    // Apply to this object if it is not a circle or ellipse
                    function applyIfNotCircleOrEllipse(o) {
                        const isCircle = o.shapeType === 'circle' || o.shapeType === 'ellipse' ||
                                         o.type === 'circle' || o.type === 'ellipse';
                        if (!isCircle) {
                            o.set('fill', cascadeColor);
                        }
                    }

                    if (obj.type === 'group') {
                        // Also cascade into group members
                        obj.forEachObject(function(innerObj) {
                            applyIfNotCircleOrEllipse(innerObj);
                        });
                    } else {
                        applyIfNotCircleOrEllipse(obj);
                    }
                });

                canvas.requestRenderAll();
            }

            // Function to apply fill (color or wood pattern) to an object
            function applyFill(object, fillType) {
                // Determine text color based on material type
                const textColor = fillType === 'color' ? '#ffffff' : '#5c3316';
                
                // Handle groups (like coin groups)
                if (object.type === 'group') {
                    // Only update shapes within coin groups, NOT the text
                    object.forEachObject(function(innerObj) {
                        if (innerObj.type !== 'text' && innerObj.type !== 'i-text') {
                            if (innerObj.fill === 'transparent') {
                                // Decorative border ring — preserve transparent fill, update stroke only
                                innerObj.set('stroke', fillType === 'color' ? '#ffffff' : '#5c3316');
                            } else if (fillType === 'color') {
                                const fillColor = document.getElementById('fillColor').value;
                                innerObj.set('fill', fillColor);
                                innerObj.materialType = 'color';
                            } else {
                                if (!woodPatterns[fillType]) {
                                    const patternCanvas = createWoodPattern(fillType);
                                    woodPatterns[fillType] = new fabric.Pattern({
                                        source: patternCanvas,
                                        repeat: 'repeat'
                                    });
                                }
                                innerObj.set('fill', woodPatterns[fillType]);
                                innerObj.materialType = fillType;
                            }
                        }
                        // Don't modify text in groups (coins)
                    });
                    object.materialType = fillType;
                } else {
                    // Handle standalone shapes (rectangles, circles, etc.)
                    if (fillType === 'color') {
                        // Apply solid color
                        const fillColor = document.getElementById('fillColor').value;
                        object.set('fill', fillColor);
                        object.materialType = 'color';
                    } else {
                        // Apply wood pattern (birch, oak, or walnut)
                        if (!woodPatterns[fillType]) {
                            // Generate pattern if not already cached
                            const patternCanvas = createWoodPattern(fillType);
                            woodPatterns[fillType] = new fabric.Pattern({
                                source: patternCanvas,
                                repeat: 'repeat'
                            });
                        }
                        object.set('fill', woodPatterns[fillType]);
                        object.materialType = fillType;
                    }
                    
                    // Update standalone text inside this shape
                    if (object.type === 'rect' || object.type === 'circle' || object.type === 'ellipse' || object.type === 'path') {
                        const shapeBounds = object.getBoundingRect();
                        
                        canvas.getObjects().forEach(function(canvasObj) {
                            // Only update standalone text objects (not in groups)
                            if ((canvasObj.type === 'text' || canvasObj.type === 'i-text') && !canvasObj.group) {
                                const textBounds = canvasObj.getBoundingRect();
                                
                                // Check if text is inside the shape bounds
                                if (textBounds.left >= shapeBounds.left &&
                                    textBounds.top >= shapeBounds.top &&
                                    textBounds.left + textBounds.width <= shapeBounds.left + shapeBounds.width &&
                                    textBounds.top + textBounds.height <= shapeBounds.top + shapeBounds.height) {
                                    canvasObj.set('fill', textColor);
                                }
                            }
                        });
                    }
                }
                canvas.requestRenderAll();
            }
            
            // ── Country contours: generated at runtime from the world-atlas dataset ──
            // Replaces the old multi-megabyte inline `countryPaths` SVG data.
            // Path units are millimetres (the engine treats raw path units as mm).
            const WORLD_ATLAS_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';
            // High-detail (1:10m, ~3.3 MB) edition of the same dataset — fetched only
            // when a small country needs it; 1:50m geometry is too coarse once a
            // Latvia-sized (or smaller) shape is blown up to the 120 mm fit box.
            const WORLD_ATLAS_URL_HI = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json';
            // US state outlines (~112 KB, already 1:10m detail) from the same
            // TopoJSON family. States appear in search as "Texas (US state)" —
            // the suffix disambiguates the four state names that are also
            // countries (Georgia, Guam, Puerto Rico, American Samoa).
            const US_STATES_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json';
            const HI_RES_MAX_DEG = 8; // bbox span (degrees) below which the 10m data is used
            const COUNTRY_FIT_MM = 120; // every generated shape fits a 120×120 mm box

            // Legacy key → dataset country name. mainlandOnly keeps only the largest
            // polygon: France bundles French Guiana into one feature, and the USA fit
            // box would otherwise shrink the contiguous states to fit Alaska/Hawaii.
            const COUNTRY_KEY_MAP = {
                usa:        { name: 'United States of America', mainlandOnly: true },
                uk:         { name: 'United Kingdom' },
                australia:  { name: 'Australia' },
                canada:     { name: 'Canada' },
                germany:    { name: 'Germany' },
                italy:      { name: 'Italy' },
                france:     { name: 'France', mainlandOnly: true },
                greece:     { name: 'Greece' },
                japan:      { name: 'Japan' },
                brazil:     { name: 'Brazil' },
                egypt:      { name: 'Egypt' },
                india:      { name: 'India' },
                southkorea: { name: 'South Korea' },
                morocco:    { name: 'Morocco' },
                tunisia:    { name: 'Tunisia' },
                mexico:     { name: 'Mexico' }
            };

            // Composite shapes merged from member countries. topojson.merge dissolves
            // shared borders so outline mode shows no internal boundaries. europe
            // excludes Russia and Turkey (a country polygon can't be clipped at the
            // Urals/Bosporus). `window` = [lonMin, latMin, lonMax, latMax]: merged
            // polygons whose centroid falls outside are dropped, which removes member
            // overseas territories (French Guiana, Svalbard, Azores, Canaries…) — and
            // conversely lets a member contribute ONLY its territories in the window
            // (France's Guiana/Caribbean islands in the Americas shapes).
            // `label` is the search-datalist entry; a composite label supersedes a
            // same-slug dataset country (ukraine below replaces dataset Ukraine).
            // Member strings are matched slug-insensitively against dataset names;
            // unresolved members produce a console.warn, not an error.
            const COMPOSITE_SHAPES = {
                world: { label: 'World', members: 'ALL', window: null },
                // The dataset follows de-facto control and puts Crimea inside the
                // Russia feature. `memberWindows` pre-filters Russia's polygons at
                // topology level to just the Crimea one BEFORE merging (a wholesale
                // merge would dissolve the shared land border and fuse Ukraine into
                // Russia's mainland polygon); the merge then dissolves only the
                // Perekop border — Ukraine renders whole, Crimea attached.
                ukraine: {
                    label: 'Ukraine',
                    window: [21, 43, 41, 53.5],
                    members: ['Ukraine', 'Russia'],
                    memberWindows: { russia: [32, 44, 37, 46.5] }
                },
                southamerica: {
                    label: 'South America',
                    window: [-95, -60, -25, 15],
                    // France contributes French Guiana (mainland France's centroid
                    // is outside the window).
                    members: ['Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia',
                        'Ecuador', 'Falkland Is.', 'Guyana', 'Paraguay', 'Peru',
                        'Suriname', 'Uruguay', 'Venezuela', 'France']
                },
                northamerica: {
                    label: 'North America',
                    window: [-179, 5, -12, 84],
                    // Continent sense: Central America + Caribbean + Greenland.
                    // France/Netherlands contribute only their Caribbean islands.
                    // Hawaii rides along inside the USA feature — accepted.
                    members: ['Canada', 'United States of America', 'Mexico', 'Greenland',
                        'Guatemala', 'Belize', 'Honduras', 'El Salvador', 'Nicaragua',
                        'Costa Rica', 'Panama', 'Cuba', 'Haiti', 'Dominican Rep.',
                        'Jamaica', 'Bahamas', 'Trinidad and Tobago', 'Puerto Rico',
                        'Bermuda', 'Antigua and Barb.', 'Barbados', 'Dominica', 'Grenada',
                        'Saint Lucia', 'St. Vin. and Gren.', 'St. Kitts and Nevis',
                        'Cayman Is.', 'Turks and Caicos Is.', 'Curaçao', 'Aruba',
                        'St-Martin', 'Sint Maarten', 'St. Pierre and Miquelon', 'Anguilla',
                        'Montserrat', 'British Virgin Is.', 'U.S. Virgin Is.',
                        'France', 'Netherlands']
                },
                americas: {
                    label: 'Americas',
                    window: [-179, -60, -12, 84],
                    members: ['Canada', 'United States of America', 'Mexico', 'Greenland',
                        'Guatemala', 'Belize', 'Honduras', 'El Salvador', 'Nicaragua',
                        'Costa Rica', 'Panama', 'Cuba', 'Haiti', 'Dominican Rep.',
                        'Jamaica', 'Bahamas', 'Trinidad and Tobago', 'Puerto Rico',
                        'Bermuda', 'Antigua and Barb.', 'Barbados', 'Dominica', 'Grenada',
                        'Saint Lucia', 'St. Vin. and Gren.', 'St. Kitts and Nevis',
                        'Cayman Is.', 'Turks and Caicos Is.', 'Curaçao', 'Aruba',
                        'St-Martin', 'Sint Maarten', 'St. Pierre and Miquelon', 'Anguilla',
                        'Montserrat', 'British Virgin Is.', 'U.S. Virgin Is.', 'Netherlands',
                        'Argentina', 'Bolivia', 'Brazil', 'Chile', 'Colombia', 'Ecuador',
                        'Falkland Is.', 'Guyana', 'Paraguay', 'Peru', 'Suriname',
                        'Uruguay', 'Venezuela', 'France']
                },
                europe: {
                    label: 'Europe',
                    window: [-25, 34, 45, 72],
                    members: ['Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium',
                        'Bosnia and Herz.', 'Bulgaria', 'Croatia', 'Czechia', 'Denmark',
                        'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary',
                        'Iceland', 'Ireland', 'Italy', 'Kosovo', 'Latvia', 'Liechtenstein',
                        'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco',
                        'Montenegro', 'Netherlands', 'Macedonia', 'Norway', 'Poland',
                        'Portugal', 'Romania', 'San Marino', 'Serbia', 'Slovakia',
                        'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine',
                        'United Kingdom', 'Vatican']
                },
                africa: {
                    label: 'Africa',
                    window: [-20, -36, 55, 38],
                    // Deliberately NOT members: Lesotho — topojson.merge would
                    // dissolve its border arcs into South Africa's and destroy the
                    // Lesotho hole in the filled shape (excluded ⇒ the hole renders);
                    // Mauritius & Seychelles — east of the lon window, would be
                    // silently centroid-filtered anyway.
                    members: ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso',
                        'Burundi', 'Cabo Verde', 'Cameroon', 'Central African Rep.',
                        'Chad', 'Comoros', 'Congo', 'Côte d\'Ivoire', 'Dem. Rep. Congo',
                        'Djibouti', 'Egypt', 'Eq. Guinea', 'Eritrea', 'eSwatini',
                        'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau',
                        'Kenya', 'Liberia', 'Libya', 'Madagascar', 'Malawi',
                        'Mali', 'Mauritania', 'Morocco', 'Mozambique',
                        'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'São Tomé and Principe',
                        'Senegal', 'Sierra Leone', 'Somalia', 'Somaliland',
                        'South Africa', 'S. Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia',
                        'Uganda', 'W. Sahara', 'Zambia', 'Zimbabwe']
                }
            };

            // Lowercase, strip everything non-alphanumeric: 'South Korea' → 'southkorea'.
            // Both legacy keys and search-picked dataset names normalize to the same slug.
            function countrySlug(s) {
                return String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
            }

            // Two promise caches: [0] = 1:50m default, [1] = 1:10m high-detail.
            const worldTopoPromises = [null, null];
            function loadWorldTopo(hiRes) {
                const slot = hiRes ? 1 : 0;
                if (!worldTopoPromises[slot]) {
                    worldTopoPromises[slot] = fetch(hiRes ? WORLD_ATLAS_URL_HI : WORLD_ATLAS_URL)
                        .then(r => {
                            if (!r.ok) throw new Error('world-atlas fetch failed: HTTP ' + r.status);
                            return r.json();
                        })
                        .catch(err => {
                            worldTopoPromises[slot] = null; // clear the cache so the next call retries
                            throw err;
                        });
                }
                return worldTopoPromises[slot];
            }

            let usStatesPromise = null;
            function loadUsStates() {
                if (!usStatesPromise) {
                    usStatesPromise = fetch(US_STATES_URL)
                        .then(r => {
                            if (!r.ok) throw new Error('us-atlas fetch failed: HTTP ' + r.status);
                            return r.json();
                        })
                        .catch(err => {
                            usStatesPromise = null; // clear the cache so the next call retries
                            throw err;
                        });
                }
                return usStatesPromise;
            }

            // Planar bbox area of a polygon's exterior ring — a robust proxy for
            // "largest polygon" that sidesteps spherical winding pitfalls.
            // Assumes no single ring crosses the ±180° antimeridian (true for the
            // pinned world-atlas dataset — a wrapped ring would inflate its bbox).
            function polygonBboxArea(polygonCoords) {
                const ring = polygonCoords[0];
                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                for (const [x, y] of ring) {
                    if (x < minX) minX = x; if (x > maxX) maxX = x;
                    if (y < minY) minY = y; if (y > maxY) maxY = y;
                }
                return (maxX - minX) * (maxY - minY);
            }

            function keepLargestPolygon(geometry) {
                if (geometry.type !== 'MultiPolygon') return geometry;
                let best = geometry.coordinates[0];
                for (const poly of geometry.coordinates) {
                    if (polygonBboxArea(poly) > polygonBboxArea(best)) best = poly;
                }
                return { type: 'Polygon', coordinates: best };
            }

            // Note: keeps/drops WHOLE polygons by centroid (not area overlap) —
            // size composite windows accordingly.
            function filterByWindow(geometry, win) {
                if (!win || geometry.type !== 'MultiPolygon') return geometry;
                const [lonMin, latMin, lonMax, latMax] = win;
                const kept = geometry.coordinates.filter(poly => {
                    const [lon, lat] = d3.geoCentroid({ type: 'Polygon', coordinates: poly });
                    return lon >= lonMin && lon <= lonMax && lat >= latMin && lat <= latMax;
                });
                return { type: 'MultiPolygon', coordinates: kept };
            }

            // All dataset names, sorted — feeds the search datalists. Countries
            // use their plain names; composites contribute their labels (and
            // replace a same-slug dataset country — Ukraine resolves to the
            // Crimea-attached composite); US states carry a "(US state)" suffix.
            // A failed states fetch degrades to countries-only (warn, no error).
            async function getCountryNames() {
                const world = await loadWorldTopo();
                const compositeLabels = Object.keys(COMPOSITE_SHAPES)
                    .map(k => COMPOSITE_SHAPES[k].label || k);
                const names = topojson.feature(world, world.objects.countries).features
                    .map(f => f.properties.name)
                    .filter(n => !COMPOSITE_SHAPES[countrySlug(n)]);
                const states = await loadUsStates()
                    .then(us => topojson.feature(us, us.objects.states).features
                        .map(f => f.properties.name + ' (US state)'))
                    .catch(err => {
                        console.warn('US states dataset unavailable', err);
                        return [];
                    });
                return compositeLabels.concat(names, states).sort((a, b) => a.localeCompare(b));
            }

            // key → SVG path string (or null for an unknown key). Accepts legacy
            // keys ('usa'), dataset names ('Portugal'), or slugs ('portugal').
            async function getCountryPathData(key) {
                const world = await loadWorldTopo();
                let feature, projection;
                const slugKey = countrySlug(key); // 'World' and 'world' both hit the composite
                const composite = COMPOSITE_SHAPES[slugKey];
                if (composite) {
                    let geoms = world.objects.countries.geometries;
                    if (composite.members !== 'ALL') {
                        const memberSet = new Set(composite.members.map(countrySlug));
                        geoms = geoms.filter(g => memberSet.has(countrySlug(g.properties.name)));
                        const foundSet = new Set(geoms.map(g => countrySlug(g.properties.name)));
                        const missing = composite.members.filter(m => !foundSet.has(countrySlug(m)));
                        if (missing.length) console.warn('Composite "' + key + '": unresolved members', missing);
                        // memberWindows: keep only a member's polygons whose centroid
                        // falls inside its window, filtered at TOPOLOGY level BEFORE the
                        // merge. Needed when a member shares a land border with the
                        // shape (ukraine + Russia's Crimea polygon): merging the whole
                        // member first would dissolve the shared border and fuse the
                        // shape into the member's mainland.
                        if (composite.memberWindows) {
                            geoms = geoms.map(g => {
                                const win = composite.memberWindows[countrySlug(g.properties.name)];
                                if (!win || g.type !== 'MultiPolygon') return g;
                                const arcsKept = g.arcs.filter(polyArcs => {
                                    const c = d3.geoCentroid(topojson.feature(world, { type: 'Polygon', arcs: polyArcs }));
                                    return c[0] >= win[0] && c[0] <= win[2] && c[1] >= win[1] && c[1] <= win[3];
                                });
                                return { type: 'MultiPolygon', arcs: arcsKept, properties: g.properties };
                            });
                        }
                    }
                    let merged = topojson.merge(world, geoms);
                    merged = filterByWindow(merged, composite.window);
                    feature = { type: 'Feature', properties: { name: key }, geometry: merged };
                    // An azimuthal projection centered on a whole-world feature is
                    // degenerate at the antipode — world uses NaturalEarth instead.
                    projection = slugKey === 'world' ? d3.geoNaturalEarth1() : d3.geoAzimuthalEqualArea();
                } else {
                    const entry = COUNTRY_KEY_MAP[key];
                    const wanted = countrySlug(entry ? entry.name : key);
                    feature = topojson.feature(world, world.objects.countries).features
                        .find(f => countrySlug(f.properties.name) === wanted);
                    let fromStates = false;
                    if (!feature) {
                        // US states: the datalist's "Texas (US state)" form slugs to
                        // 'texasusstate'; bare state names ('texas') work too, but
                        // countries win name collisions (Georgia, Guam, …) — the
                        // suffixed form is the way to reach those four states.
                        try {
                            const us = await loadUsStates();
                            feature = topojson.feature(us, us.objects.states).features
                                .find(f => {
                                    const s = countrySlug(f.properties.name);
                                    return wanted === s + 'usstate' || wanted === s;
                                });
                            if (feature) fromStates = true;
                        } catch (err) {
                            console.warn('US states dataset unavailable', err);
                        }
                    }
                    if (!feature) {
                        console.warn('Unknown country key: "' + key + '"');
                        return null;
                    }
                    // Small countries look blocky when 1:50m geometry is blown up to
                    // the fit box — swap in the 1:10m feature for them. geoBounds
                    // handles antimeridian wrap (lon span may come back negative).
                    // States are already 1:10m — no upgrade needed (or possible).
                    const b = d3.geoBounds(feature);
                    const lonSpan = (b[1][0] - b[0][0] + 360) % 360;
                    const latSpan = b[1][1] - b[0][1];
                    if (!fromStates && Math.max(lonSpan, latSpan) < HI_RES_MAX_DEG) {
                        try {
                            const worldHi = await loadWorldTopo(true);
                            const hiFeature = topojson.feature(worldHi, worldHi.objects.countries).features
                                .find(f => countrySlug(f.properties.name) === wanted);
                            if (hiFeature) feature = hiFeature;
                        } catch (err) {
                            // 50m geometry is a usable fallback — don't fail the add.
                            console.warn('High-detail dataset unavailable, using 50m geometry', err);
                        }
                    }
                    if (entry && entry.mainlandOnly) {
                        feature = { type: 'Feature', properties: feature.properties,
                                    geometry: keepLargestPolygon(feature.geometry) };
                    }
                    projection = d3.geoAzimuthalEqualArea();
                }
                if (slugKey !== 'world') {
                    // Center the azimuthal projection on the feature BEFORE fitSize
                    // (fitSize only adjusts scale/translate, not rotation).
                    const c = d3.geoCentroid(feature);
                    projection.rotate([-c[0], -c[1]]);
                }
                projection.fitSize([COUNTRY_FIT_MM, COUNTRY_FIT_MM], feature);
                return d3.geoPath(projection).digits(2)(feature);
            }
            
            // Rotation handle cursor: fabric's default is a bare crosshair,
            // which reads as "add". Replace it with a circular-arrow rotation
            // cursor (inline SVG, white halo for visibility on any background).
            (function setRotationCursor() {
                if (typeof fabric === 'undefined' || !fabric.Object ||
                    !fabric.Object.prototype.controls || !fabric.Object.prototype.controls.mtr) return;
                const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">'
                    + '<path d="M12 4a8 8 0 1 1-7.7 5.9" fill="none" stroke="white" stroke-width="5" stroke-linecap="round"/>'
                    + '<path d="M12 4a8 8 0 1 1-7.7 5.9" fill="none" stroke="black" stroke-width="2" stroke-linecap="round"/>'
                    + '<path d="M12 0.5 17 4 12 7.5z" fill="black" stroke="white" stroke-width="1.2"/>'
                    + '</svg>';
                fabric.Object.prototype.controls.mtr.cursorStyle =
                    'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '") 11 11, crosshair';
            })();

            // Initialize canvas
            function initCanvas() {
                const size = canvasSizes[currentCanvasSize];
                
                // Calculate scale to maintain consistent visual size
                // Base on A3 height (420mm) at 840 pixels
                const targetPixelHeight = 840;
                const scale = targetPixelHeight / 420; // A3 height as reference
                
                // Calculate actual pixel dimensions for this canvas size
                const pixelWidth = size.width * scale;
                const pixelHeight = size.height * scale;
                
                canvas = new fabric.Canvas('designCanvas', {
                    width: pixelWidth,
                    height: pixelHeight,
                    backgroundColor: '#ffffff'
                });
                
                // Store real dimensions
                canvas.realWidth = size.width;
                canvas.realHeight = size.height;
                canvas.scale = scale;
                
                // Enable object selection and manipulation
                canvas.selection = true;
                
                // Set centered rotation for multiple selections without changing origin
                canvas.on('selection:created', function(e) {
                    const activeObject = canvas.getActiveObject();
                    if (activeObject && activeObject.type === 'activeSelection') {
                        activeObject.centeredRotation = true;
                    }
                    updatePropertiesPanel();
                });
                canvas.on('selection:updated', function(e) {
                    const activeObject = canvas.getActiveObject();
                    if (activeObject && activeObject.type === 'activeSelection') {
                        activeObject.centeredRotation = true;
                    }
                    updatePropertiesPanel();
                });
                canvas.on('selection:cleared', clearPropertiesPanel);
                // Alignment section: shown only while 2+ objects are selected.
                ['selection:created', 'selection:updated', 'selection:cleared'].forEach(function(ev) {
                    canvas.on(ev, updateAlignPanel);
                });
                canvas.on('object:modified', function(e) {
                    updatePropertiesPanel();
                    saveState();
                });
                
                // Save state when objects are added or removed
                canvas.on('object:added', function(e) {
                    saveState();
                    updateCanvasHint();

                    // Auto-center viewport on newly added object
                    var obj = e.target;
                    if (obj) {
                        var objCenter = obj.getCenterPoint();
                        var zoom = canvas.getZoom();
                        var vpt = canvas.viewportTransform;
                        var margin = 50;
                        var visibleLeft = -vpt[4] / zoom + margin;
                        var visibleTop = -vpt[5] / zoom + margin;
                        var visibleRight = visibleLeft + (canvas.getWidth() / zoom) - 2 * margin;
                        var visibleBottom = visibleTop + (canvas.getHeight() / zoom) - 2 * margin;

                        if (objCenter.x < visibleLeft || objCenter.x > visibleRight ||
                            objCenter.y < visibleTop || objCenter.y > visibleBottom) {
                            canvas.viewportTransform[4] = -(objCenter.x * zoom - canvas.getWidth() / 2);
                            canvas.viewportTransform[5] = -(objCenter.y * zoom - canvas.getHeight() / 2);
                            canvas.requestRenderAll();
                        }
                    }
                });
                canvas.on('object:removed', function(e) {
                    saveState();
                    updateCanvasHint();
                });
                
                updateCanvasInfo();

                // Save initial empty state
                saveState();
                updateCanvasHint();
            }
            
            // Update canvas info badge
            function updateCanvasInfo() {
                const size = canvasSizes[currentCanvasSize];
                let width = size.width;
                let height = size.height;
                let unit = 'mm';
                
                if (currentUnit === 'inch') {
                    width = (width * mmToInch).toFixed(2);
                    height = (height * mmToInch).toFixed(2);
                    unit = 'inch';
                }
                
                const canvasInfoEl = document.getElementById('canvasInfo');
                if (canvasInfoEl) {
                    canvasInfoEl.textContent =
                        `${currentCanvasSize.toUpperCase()} - ${width} x ${height} ${unit}`;
                }
            }
            
            // Add basic shapes
            function addShape(type) {
                let shape;
                const scale = canvas.scale;
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;

                if (!woodPatterns['birch']) {
                    const patternCanvas = createWoodPattern('birch');
                    woodPatterns['birch'] = new fabric.Pattern({
                        source: patternCanvas,
                        repeat: 'repeat'
                    });
                }

                switch(type) {
                    case 'rectangle':
                        shape = new fabric.Rect({
                            left: centerX,
                            top: centerY,
                            width: 100 * scale,
                            height: 60 * scale,
                            fill: woodPatterns['birch'],
                            stroke: '#5c3316',
                            strokeWidth: 0.1,
                            strokeUniform: true,
                            rx: 3 * scale,
                            ry: 3 * scale,
                            originX: 'center',
                            originY: 'center'
                        });
                        shape.realWidth = 100;
                        shape.realHeight = 60;
                        shape.realCornerRadius = 3;
                        shape.materialType = 'birch';
                        break;
                        
                    case 'circle':
                        shape = new fabric.Circle({
                            left: centerX,
                            top: centerY,
                            radius: 40 * scale,
                            fill: woodPatterns['birch'],
                            stroke: '#5c3316',
                            strokeWidth: 0.1,
                            strokeUniform: true,
                            originX: 'center',
                            originY: 'center'
                        });
                        shape.realRadius = 40;
                        shape.materialType = 'birch';
                        break;
                        
                    case 'ellipse':
                        shape = new fabric.Ellipse({
                            left: centerX,
                            top: centerY,
                            rx: 60 * scale,
                            ry: 40 * scale,
                            fill: woodPatterns['birch'],
                            stroke: '#5c3316',
                            strokeWidth: 0.1,
                            strokeUniform: true,
                            originX: 'center',
                            originY: 'center'
                        });
                        shape.realRx = 60;
                        shape.realRy = 40;
                        shape.materialType = 'birch';
                        break;
                        
                    case 'rectangle-outline':
                        shape = new fabric.Rect({
                            left: centerX,
                            top: centerY,
                            width: 100 * scale,
                            height: 60 * scale,
                            fill: 'transparent',
                            stroke: '#5c3316',
                            strokeWidth: 3,
                            strokeUniform: true,
                            rx: 3 * scale,
                            ry: 3 * scale,
                            originX: 'center',
                            originY: 'center'
                        });
                        shape.realWidth = 100;
                        shape.realHeight = 60;
                        shape.realCornerRadius = 3;
                        break;
                        
                    case 'circle-outline':
                        shape = new fabric.Circle({
                            left: centerX,
                            top: centerY,
                            radius: 40 * scale,
                            fill: 'transparent',
                            stroke: '#5c3316',
                            strokeWidth: 3,
                            strokeUniform: true,
                            originX: 'center',
                            originY: 'center'
                        });
                        shape.realRadius = 40;
                        break;
                        
                    case 'ellipse-outline':
                        shape = new fabric.Ellipse({
                            left: centerX,
                            top: centerY,
                            rx: 60 * scale,
                            ry: 40 * scale,
                            fill: 'transparent',
                            stroke: '#5c3316',
                            strokeWidth: 3,
                            strokeUniform: true,
                            originX: 'center',
                            originY: 'center'
                        });
                        shape.realRx = 60;
                        shape.realRy = 40;
                        break;
                }
                
                shape.shapeType = type;
                // Default: 'color'. Cases that set their own materialType (e.g. circle/ellipse → 'birch')
                // must do so before this line, since this guard does not overwrite existing values.
                if (!shape.materialType) {
                    shape.materialType = 'color';
                }
                shape.setCoords(); // Ensure coordinates are set
                canvas.add(shape);
                canvas.setActiveObject(shape);
                canvas.requestRenderAll();
            }
            
            // Add country shape (solid brown fill)
            function addCountry(country) {
                return getCountryPathData(country).then(pathData => {
                    if (!pathData) return;
                    const scale = canvas.scale;
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    fabric.loadSVGFromString(`<svg><path d="${pathData}" /></svg>`, function(objects, options) {
                        const shape = fabric.util.groupSVGElements(objects, options);
                        shape.set({
                            left: centerX,
                            top: centerY,
                            fill: '#5c3316',
                            stroke: '#5c3316',
                            strokeWidth: 0.1,
                            scaleX: scale,
                            scaleY: scale,
                            strokeUniform: true,
                            originX: 'center',
                            originY: 'center'
                        });
                        shape.shapeType = 'country';
                        shape.countryName = countrySlug(country);
                        shape.materialType = 'color'; // Set default material type
                        shape.realWidth = shape.width;
                        shape.realHeight = shape.height;
                        shape.setCoords();
                        canvas.add(shape);
                        canvas.setActiveObject(shape);
                        canvas.requestRenderAll();
                    });
                }).catch(err => {
                    console.error('addCountry failed', err);
                    alert('Could not load country shapes — please check your connection and try again.');
                });
            }

            // Add country outline (transparent fill, blue stroke)
            function addCountryOutline(country) {
                return getCountryPathData(country).then(pathData => {
                    if (!pathData) return;
                    const scale = canvas.scale;
                    const centerX = canvas.width / 2;
                    const centerY = canvas.height / 2;
                    fabric.loadSVGFromString(`<svg><path d="${pathData}" /></svg>`, function(objects, options) {
                        const shape = fabric.util.groupSVGElements(objects, options);
                        shape.set({
                            left: centerX,
                            top: centerY,
                            fill: 'transparent',
                            stroke: '#0000FF',
                            strokeWidth: 0.5,
                            scaleX: scale,
                            scaleY: scale,
                            strokeUniform: true,
                            originX: 'center',
                            originY: 'center'
                        });
                        shape.shapeType = 'country';
                        shape.countryName = countrySlug(country);
                        shape.materialType = 'color';
                        shape.realWidth = shape.width;
                        shape.realHeight = shape.height;
                        shape.setCoords();
                        canvas.add(shape);
                        canvas.setActiveObject(shape);
                        canvas.requestRenderAll();
                    });
                }).catch(err => {
                    console.error('addCountryOutline failed', err);
                    alert('Could not load country shapes — please check your connection and try again.');
                });
            }
            // Add currency coins
            function addCurrency(currency) {
                const scale = canvas.scale;
                
                if (currency === 'euro') {
                    // Euro coin specifications: [value, diameter in mm]
                    const coins = [
                        { value: '0.01 €', diameter: 16.4 },
                        { value: '0.02 €', diameter: 18.9 },
                        { value: '0.05 €', diameter: 21.4 },
                        { value: '0.10 €', diameter: 19.9 },
                        { value: '0.20 €', diameter: 22.4 },
                        { value: '0.50 €', diameter: 24.4 },
                        { value: '1 €', diameter: 23.4 },
                        { value: '2 €', diameter: 25.75 }
                    ];
                    
                    // Starting position and spacing - center of canvas
                    let spacingX = 35; // mm between coin centers horizontally
                    let spacingY = 35; // mm between coin centers vertically
                    let coinsPerRow = 4;
                    // Calculate grid size: 4 coins = 3 gaps = 105mm width, 2 rows = 1 gap = 35mm height
                    let startX = canvas.width / 2 - (spacingX * (coinsPerRow - 1) / 2) * scale;
                    let startY = canvas.height / 2 - (spacingY * 0.5) * scale;
                    
                    coins.forEach((coin, index) => {
                        const row = Math.floor(index / coinsPerRow);
                        const col = index % coinsPerRow;
                        
                        // Calculate position (startX and startY are already in pixels)
                        const x = startX + col * spacingX * scale;
                        const y = startY + row * spacingY * scale;
                        const radius = (coin.diameter / 2) * scale;
                        
                        // Create circle
                        const circle = new fabric.Circle({
                            radius: radius,
                            fill: '#ffffff', // White canvas background color
                            stroke: '#5c3316',
                            strokeWidth: 0.1,
                            strokeUniform: true,
                            originX: 'center',
                            originY: 'center'
                        });
                        
                        // Create text label
                        const text = new fabric.Text(coin.value, {
                            fontSize: 5 * scale,
                            fill: '#000000',
                            fontFamily: 'Roboto',
                            fontWeight: 'bold',
                            originX: 'center',
                            originY: 'center'
                        });
                        
                        // Group circle and text together
                        const group = new fabric.Group([circle, text], {
                            left: x,
                            top: y,
                            originX: 'center',
                            originY: 'center'
                        });
                        
                        group.shapeType = 'currency';
                        group.currencyType = currency;
                        group.coinValue = coin.value;
                        group.realDiameter = coin.diameter;
                        group.setCoords();
                        
                        canvas.add(group);
                    });
                    
                    canvas.requestRenderAll();
                } else if (currency === 'dollar') {
                    // US Dollar coin specifications: [value, diameter in mm]
                    const coins = [
                        { value: '1 ¢', diameter: 19.25 },
                        { value: '5 ¢', diameter: 21.36 },
                        { value: '10 ¢', diameter: 18.06 },
                        { value: '25 ¢', diameter: 24.41 },
                        { value: '50 ¢', diameter: 30.76 },
                        { value: '$ 1', diameter: 26.65 }
                    ];
                    
                    // Starting position and spacing - center of canvas
                    let spacingX = 35; // mm between coin centers horizontally
                    let spacingY = 35; // mm between coin centers vertically
                    let coinsPerRow = 3;
                    // Calculate grid size: 3 coins = 2 gaps = 70mm width, 2 rows = 1 gap = 35mm height
                    let startX = canvas.width / 2 - (spacingX * (coinsPerRow - 1) / 2) * scale;
                    let startY = canvas.height / 2 - (spacingY * 0.5) * scale;
                    
                    coins.forEach((coin, index) => {
                        const row = Math.floor(index / coinsPerRow);
                        const col = index % coinsPerRow;
                        
                        // Calculate position (startX and startY are already in pixels)
                        const x = startX + col * spacingX * scale;
                        const y = startY + row * spacingY * scale;
                        const radius = (coin.diameter / 2) * scale;
                        
                        // Create circle
                        const circle = new fabric.Circle({
                            radius: radius,
                            fill: '#ffffff', // White canvas background color
                            stroke: '#5c3316',
                            strokeWidth: 0.1,
                            strokeUniform: true,
                            originX: 'center',
                            originY: 'center'
                        });
                        
                        // Create text label
                        const text = new fabric.Text(coin.value, {
                            fontSize: 5 * scale,
                            fill: '#000000',
                            fontFamily: 'Roboto',
                            fontWeight: 'bold',
                            originX: 'center',
                            originY: 'center'
                        });
                        
                        // Group circle and text together
                        const group = new fabric.Group([circle, text], {
                            left: x,
                            top: y,
                            originX: 'center',
                            originY: 'center'
                        });
                        
                        group.shapeType = 'currency';
                        group.currencyType = currency;
                        group.coinValue = coin.value;
                        group.realDiameter = coin.diameter;
                        group.setCoords();
                        
                        canvas.add(group);
                    });
                    
                    canvas.requestRenderAll();
                } else if (currency === 'pound') {
                    // UK Pound coin specifications: [value, diameter in mm, isCircular]
                    const coins = [
                        { value: '1p', diameter: 20.47, isCircular: true },
                        { value: '2p', diameter: 26.06, isCircular: true },
                        { value: '5p', diameter: 18.15, isCircular: true },
                        { value: '10p', diameter: 24.65, isCircular: true },
                        { value: '20p', diameter: 21.55, isCircular: false, svgPath: 'M17.81 18.42 c0.01 -0.01 0.12 -0.08 0.12 -0.09 l0.05 -0.06 c0.03 -0.04 0.03 -0.04 0.07 -0.09 0.52 -0.64 2.00 -2.40 2.35 -3.15 0.19 -0.41 0.54 -1.12 0.67 -1.51 0.52 -1.58 -0.18 -5.09 -0.75 -6.58 -0.84 -2.25 -1.00 -2.48 -2.35 -3.71 -0.59 -0.42 -0.94 -0.66 -1.58 -1.01 l-2.31 -1.06 c-2.74 -1.06 -4.13 -1.17 -6.76 -0.03 -1.26 0.55 -2.16 1.07 -3.23 1.73 -2.32 1.44 -2.97 3.41 -3.77 6.60 -0.30 3.59 -0.33 4.76 2.11 7.74 1.45 1.77 2.90 3.66 5.24 3.93 2.44 0.29 2.83 0.20 5.00 0.07 1.84 -0.11 2.56 -0.22 3.84 -1.46 0.26 -0.25 0.46 -0.43 0.67 -0.65 0.24 -0.25 0.45 -0.42 0.63 -0.69' }, // Placeholder heptagon
                        { value: '50p', diameter: 27.45, isCircular: false, svgPath: 'M23.90 4.81 l-3.12 -1.89 c-1.27 -0.77 -5.67 -2.92 -7.31 -2.61 -3.35 0.63 -7.38 2.75 -10.11 4.93 -0.84 0.67 -1.10 2.56 -1.64 3.47 l-0.94 3.24 c-0.10 0.62 -0.20 1.13 -0.27 1.78 -0.32 2.98 -0.51 3.16 0.66 5.15 1.23 2.08 2.87 4.15 4.58 5.89 1.52 1.30 1.90 1.88 4.04 2.12 1.37 0.16 2.48 0.26 3.57 0.28 l0.85 0.00 c1.04 -0.02 2.12 -0.12 3.45 -0.33 1.91 -0.30 1.72 -0.24 2.92 -1.27 2.65 -2.27 4.05 -4.02 5.80 -6.98 1.13 -1.90 0.80 -2.35 0.48 -5.27 -0.38 -2.29 -1.31 -6.73 -2.96 -8.51 z' }, // Placeholder heptagon
                        { value: '1£', diameter: 23.18, isCircular: true },
                        { value: '2£', diameter: 28.55, isCircular: true }
                    ];
                    
                    // Starting position and spacing - center of canvas
                    let spacingX = 35; // mm between coin centers horizontally
                    let spacingY = 35; // mm between coin centers vertically
                    let coinsPerRow = 4;
                    // Calculate grid size: 4 coins = 3 gaps = 105mm width, 2 rows = 1 gap = 35mm height
                    let startX = canvas.width / 2 - (spacingX * (coinsPerRow - 1) / 2) * scale;
                    let startY = canvas.height / 2 - (spacingY * 0.5) * scale;
                    
                    coins.forEach((coin, index) => {
                        const row = Math.floor(index / coinsPerRow);
                        const col = index % coinsPerRow;
                        
                        // Calculate position (startX and startY are already in pixels)
                        const x = startX + col * spacingX * scale;
                        const y = startY + row * spacingY * scale;
                        
                        let shape;
                        
                        if (coin.isCircular) {
                            const radius = (coin.diameter / 2) * scale;
                            // Create circle
                            shape = new fabric.Circle({
                                radius: radius,
                                fill: '#ffffff', // White canvas background color
                                stroke: '#5c3316',
                                strokeWidth: 0.1,
                                strokeUniform: true,
                                originX: 'center',
                                originY: 'center'
                            });
                        } else {
                            // Create shape from SVG path (for 20p and 50p)
                            const scaledPath = coin.svgPath.replace(/[-\d.]+/g, (match) => {
                                return parseFloat(match) * scale;
                            });
                            shape = new fabric.Path(scaledPath, {
                                fill: '#ffffff',
                                fillRule: 'nonzero',
                                stroke: '#5c3316',
                                strokeWidth: 0.1,
                                strokeUniform: true,
                                left: 0,
                                top: 0
                            });
                            
                            // Center the path at (0,0) for proper alignment with text
                            const pathBounds = shape.getBoundingRect();
                            shape.set({
                                left: -pathBounds.width / 2 - pathBounds.left,
                                top: -pathBounds.height / 2 - pathBounds.top
                            });
                        }
                        
                        // Create text label
                        const text = new fabric.Text(coin.value, {
                            fontSize: 5 * scale,
                            fill: '#000000',
                            fontFamily: 'Roboto',
                            fontWeight: 'bold',
                            originX: 'center',
                            originY: 'center'
                        });
                        
                        // Group shape and text together
                        const group = new fabric.Group([shape, text], {
                            left: x,
                            top: y,
                            originX: 'center',
                            originY: 'center'
                        });
                        
                        group.shapeType = 'currency';
                        group.currencyType = currency;
                        group.coinValue = coin.value;
                        group.realDiameter = coin.diameter;
                        group.setCoords();
                        
                        canvas.add(group);
                    });
                    
                    canvas.requestRenderAll();
                }
            }
            
            // Add single coin
        function addSingleCoin(value, diameter) {
            const scale = canvas.scale;
            
            // Default position - center of canvas
            const x = canvas.width / 2;
            const y = canvas.height / 2;
                const radius = (diameter / 2) * scale;
                
                // Determine currency type and color based on value
                const isDollar = value.includes('¢') || value.includes('$');
                const isPound = value.includes('p') || value.includes('£');
                const isEuro = value.includes('€');
                
                let coinColor, currencyType;
                if (isDollar) {
                    coinColor = '#ffffff'; // White canvas background color
                    currencyType = 'dollar';
                } else if (isPound) {
                    coinColor = '#ffffff'; // White canvas background color
                    currencyType = 'pound';
                } else {
                    coinColor = '#ffffff'; // White canvas background color
                    currencyType = 'euro';
                }
                
                // Check if this is a special non-circular coin (20p or 50p)
                const isSpecialCoin = value === '20p' || value === '50p';
                let shape;
                
                if (isSpecialCoin) {
                    // Create shape from SVG path (for 20p and 50p)
                    const svgPath = value === '20p' 
                        ? 'M17.81 18.42 c0.01 -0.01 0.12 -0.08 0.12 -0.09 l0.05 -0.06 c0.03 -0.04 0.03 -0.04 0.07 -0.09 0.52 -0.64 2.00 -2.40 2.35 -3.15 0.19 -0.41 0.54 -1.12 0.67 -1.51 0.52 -1.58 -0.18 -5.09 -0.75 -6.58 -0.84 -2.25 -1.00 -2.48 -2.35 -3.71 -0.59 -0.42 -0.94 -0.66 -1.58 -1.01 l-2.31 -1.06 c-2.74 -1.06 -4.13 -1.17 -6.76 -0.03 -1.26 0.55 -2.16 1.07 -3.23 1.73 -2.32 1.44 -2.97 3.41 -3.77 6.60 -0.30 3.59 -0.33 4.76 2.11 7.74 1.45 1.77 2.90 3.66 5.24 3.93 2.44 0.29 2.83 0.20 5.00 0.07 1.84 -0.11 2.56 -0.22 3.84 -1.46 0.26 -0.25 0.46 -0.43 0.67 -0.65 0.24 -0.25 0.45 -0.42 0.63 -0.69'  // Placeholder heptagon for 20p
                        : 'M23.90 4.81 l-3.12 -1.89 c-1.27 -0.77 -5.67 -2.92 -7.31 -2.61 -3.35 0.63 -7.38 2.75 -10.11 4.93 -0.84 0.67 -1.10 2.56 -1.64 3.47 l-0.94 3.24 c-0.10 0.62 -0.20 1.13 -0.27 1.78 -0.32 2.98 -0.51 3.16 0.66 5.15 1.23 2.08 2.87 4.15 4.58 5.89 1.52 1.30 1.90 1.88 4.04 2.12 1.37 0.16 2.48 0.26 3.57 0.28 l0.85 0.00 c1.04 -0.02 2.12 -0.12 3.45 -0.33 1.91 -0.30 1.72 -0.24 2.92 -1.27 2.65 -2.27 4.05 -4.02 5.80 -6.98 1.13 -1.90 0.80 -2.35 0.48 -5.27 -0.38 -2.29 -1.31 -6.73 -2.96 -8.51 z';        // 50p coin path
                    
                    const scaledPath = svgPath.replace(/[-\d.]+/g, (match) => {
                        return parseFloat(match) * scale;
                    });
                    
                    shape = new fabric.Path(scaledPath, {
                        fill: coinColor,
                        fillRule: 'nonzero',
                        stroke: '#5c3316',
                        strokeWidth: 0.1,
                        strokeUniform: true,
                        left: 0,
                        top: 0
                    });
                    
                    // Center the path at (0,0) for proper alignment with text
                    const pathBounds = shape.getBoundingRect();
                    shape.set({
                        left: -pathBounds.width / 2 - pathBounds.left,
                        top: -pathBounds.height / 2 - pathBounds.top
                    });
                } else {
                    // Create circle for regular coins
                    shape = new fabric.Circle({
                        radius: radius,
                        fill: coinColor,
                        stroke: '#5c3316',
                        strokeWidth: 0.1,
                        strokeUniform: true,
                        originX: 'center',
                        originY: 'center'
                    });
                }
                
                // Create text label
                const text = new fabric.Text(value, {
                    fontSize: 5 * scale,
                    fill: '#000000',
                    fontFamily: 'Roboto',
                    fontWeight: 'bold',
                    originX: 'center',
                    originY: 'center'
                });
                
                // Group shape and text together
                const group = new fabric.Group([shape, text], {
                    left: x,
                    top: y,
                    originX: 'center',
                    originY: 'center'
                });
                
                group.shapeType = 'currency';
                group.materialType = 'color'; // Set default material type
                group.currencyType = currencyType;
                group.coinValue = value;
                group.realDiameter = diameter;
                group.setCoords();
                
                canvas.add(group);
                canvas.setActiveObject(group);
                canvas.requestRenderAll();
            }
            
        // Add template
        function addTemplate(templateType) {
            const scale = canvas.scale;
            const elements = [];
            const baseX = canvas.width / 2; // Center position for template
            const baseY = canvas.height / 2;
                
            if (templateType === 'germany-euro') {
                // Template 1: Germany Euro Coins
                // 136x74mm rectangle with 5mm corners
                // Generate birch wood pattern if not cached
                if (!woodPatterns['birch']) {
                    const patternCanvas = createWoodPattern('birch');
                    woodPatterns['birch'] = new fabric.Pattern({
                        source: patternCanvas,
                        repeat: 'repeat'
                    });
                }
                
                const outerRect = new fabric.Rect({
                    left: baseX,
                    top: baseY,
                    width: 136 * scale,
                    height: 74 * scale,
                    fill: woodPatterns['birch'],
                    stroke: '#5c3316',
                    strokeWidth: 0.1,
                    strokeUniform: true,
                    rx: 5 * scale,
                    ry: 5 * scale,
                    originX: 'center',
                    originY: 'center'
                });
                outerRect.shapeType = 'rectangle';
                outerRect.materialType = 'birch'; // Set to birch plywood
                outerRect.realWidth = 136;
                outerRect.realHeight = 74;
                outerRect.realCornerRadius = 5;
                elements.push(outerRect);
                
                // Inner rectangle (2mm offset from all sides, 3mm line, no fill)
                // Centered at same point as outer rectangle, dimensions adjusted for 2mm gap
                const innerRect = new fabric.Rect({
                    left: baseX,
                    top: baseY,
                    width: 132 * scale,  // 136 - (2 * 2) = 132
                    height: 70 * scale,   // 74 - (2 * 2) = 70
                    fill: 'transparent',
                    stroke: '#5c3316',
                    strokeWidth: 2,
                    strokeUniform: true,
                    rx: 4 * scale,
                    ry: 4 * scale,
                    originX: 'center',
                    originY: 'center'
                });
                innerRect.shapeType = 'rectangle';
                innerRect.materialType = 'color'; // Set default material type
                innerRect.realWidth = 132;
                innerRect.realHeight = 70;
                innerRect.realCornerRadius = 4;
                elements.push(innerRect);
                    
                    // Euro coins (8 coins in 2 rows of 4)
                    const euroCoins = [
                        { value: '2.00 €', diameter: 25.75 },
                        { value: '1.00 €', diameter: 23.25 },
                        { value: '0.50 €', diameter: 24.25 },
                        { value: '0.20 €', diameter: 22.25 },
                        { value: '0.10 €', diameter: 19.75 },
                        { value: '0.05 €', diameter: 21.25 },
                        { value: '0.02 €', diameter: 18.75 },
                        { value: '0.01 €', diameter: 16.4 }
                    ];
                    
                const coinSpacingX = 30 * scale;
                const coinSpacingY = 27 * scale; // Increased spacing to move second row 5mm lower
                const startX = baseX - (coinSpacingX * 1.5); // Center 4 coins horizontally
                const startY = baseY - 17 * scale; // Position from top (37mm to center - 20mm from top = -17mm)
                    
                    euroCoins.forEach((coin, index) => {
                        const row = Math.floor(index / 4);
                        const col = index % 4;
                        const radius = (coin.diameter / 2) * scale;
                        
                        const coinCircle = new fabric.Circle({
                            radius: radius,
                            fill: '#ffffff',
                            stroke: '#5c3316',
                            strokeWidth: 0.1,
                            strokeUniform: true,
                            left: startX + (col * coinSpacingX),
                            top: startY + (row * coinSpacingY),
                            originX: 'center',
                            originY: 'center'
                        });
                        coinCircle.shapeType = 'circle';
                        coinCircle.materialType = 'color'; // Set default material type
                        coinCircle.realRadius = coin.diameter / 2;
                        
                        const coinText = new fabric.Text(coin.value, {
                            fontSize: 5 * scale,
                            fill: '#000000', // Black text for coins
                            fontFamily: 'Roboto',
                            fontWeight: 'bold',
                            left: startX + (col * coinSpacingX),
                            top: startY + (row * coinSpacingY),
                            originX: 'center',
                            originY: 'center'
                        });
                        coinText.shapeType = 'text';
                        coinText.materialType = 'color'; // Set default material type
                        coinText.realFontSize = 5;
                        
                        // Group each coin with its text
                        const coinGroup = new fabric.Group([coinCircle, coinText], {
                            left: startX + (col * coinSpacingX),
                            top: startY + (row * coinSpacingY),
                            originX: 'center',
                            originY: 'center'
                        });
                        coinGroup.shapeType = 'currency';
                        coinGroup.materialType = 'color'; // Set default material type
                        coinGroup.currencyType = 'euro';
                        coinGroup.coinValue = coin.value;
                        coinGroup.realDiameter = coin.diameter;
                        
                        elements.push(coinGroup);
                    });
                    
                // Text "Germany" at bottom center
                const countryText = new fabric.Text('Germany', {
                    fontSize: 5 * scale,
                    fill: '#5c3316',
                    fontFamily: 'Josefin Sans',
                    fontWeight: 'bold',
                    left: baseX,
                    top: baseY + 28 * scale, // Moved 2mm higher
                    originX: 'center',
                    originY: 'center'
                });
                countryText.shapeType = 'text';
                countryText.materialType = 'color'; // Set default material type
                countryText.realFontSize = 5;
                elements.push(countryText);
                    
                } else if (templateType === 'uk-coins') {
                    // Template 2: United Kingdom
                    // Outer circle (133mm diameter)
                    // Generate birch wood pattern if not cached
                    if (!woodPatterns['birch']) {
                        const patternCanvas = createWoodPattern('birch');
                        woodPatterns['birch'] = new fabric.Pattern({
                            source: patternCanvas,
                            repeat: 'repeat'
                        });
                    }
                    
                    const outerCircle = new fabric.Circle({
                        radius: (133 / 2) * scale,
                        fill: woodPatterns['birch'],
                        stroke: '#5c3316',
                        strokeWidth: 0.1,
                        strokeUniform: true,
                        left: baseX,
                        top: baseY,
                        originX: 'center',
                        originY: 'center'
                    });
                    // Inner circle outline (2mm offset, 2mm thickness, no fill)
                    const innerCircle = new fabric.Circle({
                        radius: ((133 / 2) - 2) * scale,
                        fill: 'transparent',
                        stroke: '#5c3316',
                        strokeWidth: 2,
                        strokeUniform: true,
                        left: baseX,
                        top: baseY,
                        originX: 'center',
                        originY: 'center'
                    });

                    // Set properties on individual circles before grouping
                    outerCircle.shapeType = 'circle';
                    outerCircle.materialType = 'birch';
                    innerCircle.shapeType = 'circle';
                    innerCircle.materialType = 'color';

                    // Both circles share the same centre (baseX, baseY) so Fabric computes child offsets as
                    // (0,0) relative to the group centre — visually correct. If either circle's position ever
                    // differs from baseX/baseY, the group layout will need to be revised.
                    const circleGroup = new fabric.Group([outerCircle, innerCircle], {
                        left: baseX,
                        top: baseY,
                        originX: 'center',
                        originY: 'center'
                    });
                    circleGroup.shapeType = 'circle';
                    circleGroup.materialType = 'birch';
                    circleGroup.realRadius = 133 / 2;
                    elements.push(circleGroup);
                    
                    // UK outline (scaled down) — generated at runtime; on fetch
                    // failure the template degrades to its coins-only branch.
                    getCountryPathData('uk').then(ukPathData => {
                        if (!ukPathData) { addUKCoinsToTemplate(); return; }
                        fabric.loadSVGFromString(`<svg><path d="${ukPathData}" /></svg>`, function(objects, options) {
                            const ukShape = fabric.util.groupSVGElements(objects, options);
                            ukShape.set({
                                fill: '#5c3316',
                                stroke: '#5c3316',
                                strokeWidth: 0.1,
                                scaleX: scale * 0.525, // 63mm target / 120-unit fit box
                                scaleY: scale * 0.525,
                                left: baseX - 3 * scale, // UK map centred at X ≈ 192 mm on the default canvas
                                top: baseY - 4,
                                originX: 'center',
                                originY: 'center'
                            });
                            ukShape.shapeType = 'country';
                            ukShape.materialType = 'color'; // Set default material type
                            ukShape.countryName = 'uk';
                            elements.push(ukShape);

                            // Add UK coins arranged in circular fashion
                            addUKCoinsToTemplate();
                        });
                    }).catch(err => {
                        console.warn('UK outline unavailable — template degrades to coins-only', err);
                        addUKCoinsToTemplate();
                    });
                    
                    function addUKCoinsToTemplate() {
                        const ukCoins = [
                            { value: '1p', diameter: 20.47 },
                            { value: '2p', diameter: 26.06 },
                            { value: '5p', diameter: 18.15 },
                            { value: '10p', diameter: 24.65 },
                            { value: '20p', diameter: 21.55 },
                            { value: '50p', diameter: 27.45 },
                            { value: '1£', diameter: 23.18 },
                            { value: '2£', diameter: 28.55 }
                        ];
                        
                        const coinRadius = 45 * scale; // Radius of coin circle placement
                        const angleStep = (2 * Math.PI) / ukCoins.length;
                        const rotationOffset = (20 * Math.PI) / 180; // 20 degrees in radians
                        
                        ukCoins.forEach((coin, index) => {
                            const angle = (index * angleStep) - (Math.PI / 2) + rotationOffset; // Start at top, rotated by 20 degrees
                            const x = baseX + Math.cos(angle) * coinRadius;
                            const y = baseY + Math.sin(angle) * coinRadius;
                            const radius = (coin.diameter / 2) * scale;
                            
                            // Check for special coins (20p, 50p)
                            const isSpecialCoin = coin.value === '20p' || coin.value === '50p';
                            let coinShape;
                            
                            if (isSpecialCoin) {
                                const svgPath = coin.value === '20p' 
                                    ? 'M17.81 18.42 c0.01 -0.01 0.12 -0.08 0.12 -0.09 l0.05 -0.06 c0.03 -0.04 0.03 -0.04 0.07 -0.09 0.52 -0.64 2.00 -2.40 2.35 -3.15 0.19 -0.41 0.54 -1.12 0.67 -1.51 0.52 -1.58 -0.18 -5.09 -0.75 -6.58 -0.84 -2.25 -1.00 -2.48 -2.35 -3.71 -0.59 -0.42 -0.94 -0.66 -1.58 -1.01 l-2.31 -1.06 c-2.74 -1.06 -4.13 -1.17 -6.76 -0.03 -1.26 0.55 -2.16 1.07 -3.23 1.73 -2.32 1.44 -2.97 3.41 -3.77 6.60 -0.30 3.59 -0.33 4.76 2.11 7.74 1.45 1.77 2.90 3.66 5.24 3.93 2.44 0.29 2.83 0.20 5.00 0.07 1.84 -0.11 2.56 -0.22 3.84 -1.46 0.26 -0.25 0.46 -0.43 0.67 -0.65 0.24 -0.25 0.45 -0.42 0.63 -0.69'
                                    : 'M23.90 4.81 l-3.12 -1.89 c-1.27 -0.77 -5.67 -2.92 -7.31 -2.61 -3.35 0.63 -7.38 2.75 -10.11 4.93 -0.84 0.67 -1.10 2.56 -1.64 3.47 l-0.94 3.24 c-0.10 0.62 -0.20 1.13 -0.27 1.78 -0.32 2.98 -0.51 3.16 0.66 5.15 1.23 2.08 2.87 4.15 4.58 5.89 1.52 1.30 1.90 1.88 4.04 2.12 1.37 0.16 2.48 0.26 3.57 0.28 l0.85 0.00 c1.04 -0.02 2.12 -0.12 3.45 -0.33 1.91 -0.30 1.72 -0.24 2.92 -1.27 2.65 -2.27 4.05 -4.02 5.80 -6.98 1.13 -1.90 0.80 -2.35 0.48 -5.27 -0.38 -2.29 -1.31 -6.73 -2.96 -8.51 z';
                                
                                const scaledPath = svgPath.replace(/[-\d.]+/g, (match) => {
                                    return parseFloat(match) * scale * 0.8;
                                });
                                
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
                            } else {
                                coinShape = new fabric.Circle({
                                    radius: radius,
                                    fill: '#ffffff',
                                    stroke: '#5c3316',
                                    strokeWidth: 0.1,
                                    strokeUniform: true,
                                    left: 0,
                                    top: 0,
                                    originX: 'center',
                                    originY: 'center'
                                });
                                coinShape.shapeType = 'circle';
                                coinShape.materialType = 'color'; // Set default material type
                                coinShape.realRadius = coin.diameter / 2;
                            }
                            
                            const coinText = new fabric.Text(coin.value, {
                                fontSize: 5 * scale,
                                fill: '#000000', // Black text for coins
                                fontFamily: 'Roboto',
                                fontWeight: 'bold',
                                left: 0,
                                top: 0,
                                originX: 'center',
                                originY: 'center'
                            });
                            coinText.shapeType = 'text';
                            coinText.materialType = 'color'; // Set default material type
                            coinText.realFontSize = 5;
                            
                            // Group each coin with its text
                            const coinGroup = new fabric.Group([coinShape, coinText], {
                                left: x,
                                top: y,
                                originX: 'center',
                                originY: 'center'
                            });
                            coinGroup.shapeType = 'currency';
                            coinGroup.materialType = 'color'; // Set default material type
                            coinGroup.currencyType = 'pound';
                            coinGroup.coinValue = coin.value;
                            coinGroup.realDiameter = coin.diameter;
                            
                            elements.push(coinGroup);
                        });
                        
                        // Text "United Kingdom" at top center inside the circle
                        const countryText = new fabric.Text('United Kingdom', {
                            fontSize: 3.5 * scale,
                            fill: '#5c3316',
                            fontFamily: 'Josefin Sans',
                            fontWeight: 'bold',
                            left: baseX,
                            top: baseY - 58 * scale, // 8mm higher than before
                            originX: 'center',
                            originY: 'center'
                        });
                        countryText.shapeType = 'text';
                        countryText.materialType = 'color'; // Set default material type
                        countryText.realFontSize = 4;
                        elements.push(countryText);
                        
                        // Add all elements to canvas and select them
                        addElementsToCanvas();
                    }
                    
                    function addElementsToCanvas() {
                        // Add all elements to canvas
                        elements.forEach(element => {
                            element.setCoords();
                            canvas.add(element);
                        });
                        
                        // Create multi-selection with all added elements
                        const selection = new fabric.ActiveSelection(elements, {
                            canvas: canvas
                        });
                        canvas.setActiveObject(selection);
                        canvas.requestRenderAll();
                        saveState();
                    }
                    
                    
                    return; // Exit early for UK template due to async loading
                } else if (templateType === 'memories') {
                // Template 3: Precious Memories
                // Rectangle 156x185mm (longer edge vertical, increased to fit 4 rows)
                const rectHeight = 180;
                // Generate birch wood pattern if not cached
                if (!woodPatterns['birch']) {
                    const patternCanvas = createWoodPattern('birch');
                    woodPatterns['birch'] = new fabric.Pattern({
                        source: patternCanvas,
                        repeat: 'repeat'
                    });
                }
                
                const outerRect = new fabric.Rect({
                    left: baseX,
                    top: baseY,
                    width: 156 * scale,
                    height: rectHeight * scale,
                    fill: woodPatterns['birch'],
                    stroke: '#5c3316',
                    strokeWidth: 0.1,
                    strokeUniform: true,
                    rx: 5 * scale,
                    ry: 5 * scale,
                    originX: 'center',
                    originY: 'center'
                });
                outerRect.shapeType = 'rectangle';
                outerRect.materialType = 'birch'; // Set to birch plywood
                outerRect.realWidth = 156;
                outerRect.realHeight = rectHeight;
                outerRect.realCornerRadius = 5;
                elements.push(outerRect);
                
                // Ellipses: 23x38mm (rx=11.5, ry=19)
                const ellipseWidth = 23;
                const ellipseHeight = 38;
                const margin = 5; // 5mm margin from edges
                const cols = 5; // Number of columns
                const rows = 4; // Number of rows (changed to 4)
                
                // Calculate equal spacing for horizontal distribution
                const availableWidth = 156 - (2 * margin); // 146mm
                const totalEllipseWidth = cols * ellipseWidth; // 115mm
                const totalGapSpace = availableWidth - totalEllipseWidth; // 31mm
                const spacingX = totalGapSpace / (cols - 1); // Equal spacing between ellipses
                
                // Calculate equal spacing for vertical distribution
                const textSpace = 15; // Space reserved for text at bottom
                const availableHeight = rectHeight - (2 * margin) - textSpace; // 155mm
                const totalEllipseHeight = rows * ellipseHeight; // 152mm
                const totalGapSpaceY = availableHeight - totalEllipseHeight; // 3mm
                const spacingY = totalGapSpaceY / (rows - 1) + 3; // Equal spacing between rows + 3mm extra
                
                // Starting position with 5mm margins
                const startX = baseX - (156 / 2) * scale + margin * scale + (ellipseWidth / 2) * scale;
                const startY = baseY - (rectHeight / 2) * scale + margin * scale + (ellipseHeight / 2) * scale;
                
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const ellipse = new fabric.Ellipse({
                            left: startX + col * (ellipseWidth + spacingX) * scale,
                            top: startY + row * (ellipseHeight + spacingY) * scale,
                            rx: (ellipseWidth / 2) * scale,
                            ry: (ellipseHeight / 2) * scale,
                            fill: '#ffffff',
                            stroke: '#5c3316',
                            strokeWidth: 0.1,
                            strokeUniform: true,
                            originX: 'center',
                            originY: 'center'
                        });
                        ellipse.shapeType = 'ellipse';
                        ellipse.materialType = 'color'; // Set default material type
                        ellipse.realRx = ellipseWidth / 2;
                        ellipse.realRy = ellipseHeight / 2;
                        elements.push(ellipse);
                    }
                }
                
                // Text "Precious memories" at bottom center (5mm height, close to bottom)
                const memoryText = new fabric.Text('Precious memories', {
                    fontSize: 5 * scale,
                    fill: '#5c3316',
                    fontFamily: 'Josefin Sans',
                    fontWeight: 'bold',
                    left: baseX,
                    top: baseY + (rectHeight / 2 - 6) * scale, // 6mm from bottom
                    originX: 'center',
                    originY: 'center'
                });
                memoryText.shapeType = 'text';
                memoryText.materialType = 'color'; // Set default material type
                memoryText.realFontSize = 5;
                elements.push(memoryText);
            }
                
                // Add all elements to canvas for Germany template
                elements.forEach(element => {
                    element.setCoords();
                    canvas.add(element);
                });
                
                // Create multi-selection with all added elements
                const selection = new fabric.ActiveSelection(elements, {
                    canvas: canvas
                });
                canvas.setActiveObject(selection);
                canvas.requestRenderAll();
                saveState();
            }
            
            // Add text
            function addText() {
                const scale = canvas.scale;
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const text = new fabric.IText('Double-click to edit', {
                    left: centerX,
                    top: centerY,
                    fontSize: 24 * scale,
                    fill: '#000000',
                    fontFamily: 'Roboto',
                    originX: 'center',
                    originY: 'center'
                });
                text.shapeType = 'text';
                text.materialType = 'color'; // Set default material type
                text.realFontSize = 24;
                text.setCoords();
                canvas.add(text);
                canvas.setActiveObject(text);
                canvas.requestRenderAll();
            }
            
            // Add image
            document.getElementById('imageUpload').addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        fabric.Image.fromURL(event.target.result, function(img) {
                            const scale = canvas.scale;
                            img.set({
                                left: 100,
                                top: 100,
                                scaleX: scale * 0.5,
                                scaleY: scale * 0.5
                            });
                            img.shapeType = 'image';
                            img.setCoords();
                            canvas.add(img);
                            canvas.setActiveObject(img);
                            canvas.requestRenderAll();
                        });
                    };
                    reader.readAsDataURL(file);
                }
                e.target.value = ''; // Reset input
            });
            
            // Import SVG file
            document.getElementById('fileImport').addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const fileName = file.name.toLowerCase();
                    const scale = canvas.scale;
                    
                    if (fileName.endsWith('.svg')) {
                        // Handle SVG import
                        const reader = new FileReader();
                        reader.onload = function(event) {
                            const svgString = event.target.result;
                            fabric.loadSVGFromString(svgString, function(objects, options) {
                                if (objects && objects.length > 0) {
                                    const importedObjects = [];
                                    
                                    // Add each object separately (not grouped)
                                    objects.forEach((obj, index) => {
                                        // Position and scale each object
                                        obj.set({
                                            left: 100 + (index * 10 * scale), // Slight offset for visibility
                                            top: 100,
                                            scaleX: scale,
                                            scaleY: scale
                                        });
                                        
                                        obj.shapeType = 'imported';
                                        obj.setCoords();
                                        canvas.add(obj);
                                        importedObjects.push(obj);
                                    });
                                    
                                    // Select all imported objects
                                    if (importedObjects.length === 1) {
                                        canvas.setActiveObject(importedObjects[0]);
                                    } else {
                                        const selection = new fabric.ActiveSelection(importedObjects, {
                                            canvas: canvas
                                        });
                                        canvas.setActiveObject(selection);
                                    }
                                    
                                    canvas.requestRenderAll();
                                    saveState();
                                } else {
                                    alert('Error: Could not load SVG file. The file may be empty or invalid.');
                                }
                            });
                        };
                        reader.readAsText(file);
                    } else {
                        alert('Unsupported file format. Please select an SVG file.');
                    }
                }
                e.target.value = ''; // Reset input
            });
            
            // Zoom functions
            function zoomIn() {
                let zoom = canvas.getZoom();
                zoom *= 1.2;
                if (zoom > 5) zoom = 5;
                canvas.setZoom(zoom);
                canvas.requestRenderAll();
            }
            
            function zoomOut() {
                let zoom = canvas.getZoom();
                zoom /= 1.2;
                if (zoom < 0.2) zoom = 0.2;
                canvas.setZoom(zoom);
                canvas.requestRenderAll();
            }
            
            function resetZoom() {
                if (!canvas) return;

                const vw = canvas.getWidth();
                const vh = canvas.getHeight();
                const objects = canvas.getObjects().filter(function(o) { return o && o.visible !== false; });

                // Nothing on the canvas → plain 1:1 view at the origin.
                if (!objects.length) {
                    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
                    canvas.requestRenderAll();
                    return;
                }

                // Bounding box of everything, in scene coords (ignore current viewport).
                let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
                objects.forEach(function(o) {
                    const r = o.getBoundingRect(true, true);
                    if (r.left < minX) minX = r.left;
                    if (r.top  < minY) minY = r.top;
                    if (r.left + r.width  > maxX) maxX = r.left + r.width;
                    if (r.top  + r.height > maxY) maxY = r.top + r.height;
                });
                const bw = maxX - minX;
                const bh = maxY - minY;
                if (!(bw > 0) || !(bh > 0)) {
                    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
                    canvas.requestRenderAll();
                    return;
                }

                // Zoom so the whole design fits with a small margin; never zoom past 1:1.
                const margin = 0.92;
                const zoom = Math.min(vw / bw, vh / bh, 1 / margin) * margin;

                // Centre the bounding box in the view.
                const tx = (vw - bw * zoom) / 2 - minX * zoom;
                const ty = (vh - bh * zoom) / 2 - minY * zoom;
                canvas.setViewportTransform([zoom, 0, 0, zoom, tx, ty]);
                canvas.requestRenderAll();
            }
            
            // Update properties panel
            function updatePropertiesPanel() {
                const obj = canvas.getActiveObject();
                if (!obj) return;
                
                document.getElementById('objectProperties').style.display = 'block';
                
                const scale = canvas.scale;
                let unit = currentUnit;
                let conversionFactor = currentUnit === 'inch' ? mmToInch : 1;
                
                // Position
                document.getElementById('posX').value = ((obj.left / scale) * conversionFactor).toFixed(2);
                document.getElementById('posY').value = ((obj.top / scale) * conversionFactor).toFixed(2);
                
                // Dimensions
                if (obj.type === 'circle') {
                    document.getElementById('objWidth').value = ((obj.radius * 2 * obj.scaleX / scale) * conversionFactor).toFixed(2);
                    document.getElementById('objHeight').value = ((obj.radius * 2 * obj.scaleY / scale) * conversionFactor).toFixed(2);
                } else if (obj.type === 'ellipse') {
                    document.getElementById('objWidth').value = ((obj.rx * 2 * obj.scaleX / scale) * conversionFactor).toFixed(2);
                    document.getElementById('objHeight').value = ((obj.ry * 2 * obj.scaleY / scale) * conversionFactor).toFixed(2);
                } else if (obj.type === 'i-text' || obj.type === 'text') {
                    document.getElementById('objWidth').value = ((obj.width * obj.scaleX / scale) * conversionFactor).toFixed(2);
                    document.getElementById('objHeight').value = ((obj.height * obj.scaleY / scale) * conversionFactor).toFixed(2);
                } else {
                    document.getElementById('objWidth').value = ((obj.width * obj.scaleX / scale) * conversionFactor).toFixed(2);
                    document.getElementById('objHeight').value = ((obj.height * obj.scaleY / scale) * conversionFactor).toFixed(2);
                }
                
                // Rotation
                document.getElementById('objRotation').value = Math.round(obj.angle);
                
                // Stroke color - for groups, get stroke from first non-text object
                let strokeColor = obj.stroke || '#000000';
                let strokeWidth = obj.strokeWidth || 0.5;
                
                if (obj.type === 'group') {
                    // Find the first non-text object in the group
                    let found = false;
                    obj.forEachObject(function(innerObj) {
                        if (!found && innerObj.type !== 'text' && innerObj.type !== 'i-text') {
                            strokeColor = innerObj.stroke || '#000000';
                            strokeWidth = innerObj.strokeWidth || 0.5;
                            found = true;
                        }
                    });
                }
                
                document.getElementById('strokeColor').value = strokeColor;
                document.getElementById('strokeWidth').value = strokeWidth;
                
                // Material preset only applies to the coin holder's outer shape —
                // hide it for everything else (coins, text, country outlines, images,
                // fixtures, multi-selections). In the plain editor (no Coach) every
                // object is treated as a holder so the dropdown shows as before.
                const isHolderShape = (typeof Coach === 'undefined')
                    || obj.coachHolderId === 'holder'
                    || (Coach.state && Coach.state.holderObj === obj);
                if (obj.type === 'activeSelection' || !isHolderShape) {
                    document.getElementById('materialPresetGroup').style.display = 'none';
                    // No material picker → still allow a solid fill colour.
                    document.getElementById('fillColorGroup').style.display = 'block';
                } else {
                    document.getElementById('materialPresetGroup').style.display = 'block';
                    const materialType = obj.materialType || 'color';
                    document.getElementById('materialPreset').value = materialType;
                    
                    // Show/hide fill color controls based on material type
                    if (materialType === 'color') {
                        document.getElementById('fillColorGroup').style.display = 'block';
                    } else {
                        document.getElementById('fillColorGroup').style.display = 'none';
                    }
                }
                
                // Fill color - only set if fillColorGroup is visible (not wood material)
                if (document.getElementById('fillColorGroup').style.display !== 'none') {
                    let fillValue = obj.fill || '#ffffff';
                    
                    // For groups, get fill from first non-text object
                    if (obj.type === 'group') {
                        let found = false;
                        obj.forEachObject(function(innerObj) {
                            if (!found && innerObj.type !== 'text' && innerObj.type !== 'i-text') {
                                fillValue = innerObj.fill || '#ffffff';
                                found = true;
                            }
                        });
                    }

                    // Images carry their engrave look in filters, not in `fill` (which
                    // stays black), so show the engrave colour (brown/grey) when engraved
                    // — matching how text behaves.
                    if (obj.type === 'image' && typeof Coach !== 'undefined' &&
                        Coach.isEngraved && Coach.isEngraved(obj)) {
                        fillValue = Coach.engraveColor();
                    }

                    // Set dropdown to closest match, or show the actual colour.
                    const fillColorDropdown = document.getElementById('fillColor');
                    // Drop any previously-injected custom-colour option; re-added below if needed.
                    const prevCustom = fillColorDropdown.querySelector('option[data-custom="1"]');
                    if (prevCustom) prevCustom.remove();

                    let foundMatch = false;
                    // Only process if fill is a string (not a Pattern object)
                    if (typeof fillValue === 'string') {
                        for (let i = 0; i < fillColorDropdown.options.length; i++) {
                            if (fillColorDropdown.options[i].value.toLowerCase() === fillValue.toLowerCase()) {
                                fillColorDropdown.value = fillColorDropdown.options[i].value;
                                foundMatch = true;
                                break;
                            }
                        }
                    }
                    if (!foundMatch) {
                        if (typeof fillValue === 'string' && fillValue !== 'transparent') {
                            // Not a preset (e.g. the brown/grey engrave colour on text) —
                            // show the ACTUAL colour via a reusable option rather than
                            // misleadingly defaulting to white.
                            const custom = document.createElement('option');
                            custom.setAttribute('data-custom', '1');
                            custom.value = fillValue;
                            // Friendly names for the engrave colours; hex otherwise.
                            const CUSTOM_NAMES = { '#5c3316': 'Brown', '#bfbfbf': 'Grey' };
                            custom.textContent = '⬛ ' + (CUSTOM_NAMES[fillValue.toLowerCase()] || fillValue);
                            custom.style.background = fillValue;
                            fillColorDropdown.appendChild(custom);
                            fillColorDropdown.value = fillValue;
                        } else {
                            fillColorDropdown.value = '#FFFFFF';
                        }
                    }
                }
                
                // Corner radius for rectangles
                if (obj.type === 'rect') {
                    document.getElementById('cornerRadiusGroup').style.display = 'block';
                    const currentRadius = obj.rx || 0;
                    document.getElementById('cornerRadius').value = ((currentRadius / scale) * conversionFactor).toFixed(2);
                } else {
                    document.getElementById('cornerRadiusGroup').style.display = 'none';
                }
                
                // Text properties
                if (obj.type === 'i-text' || obj.type === 'text') {
                    document.getElementById('textPropsGroup').style.display = 'block';
                    document.getElementById('fontFamily').value = obj.fontFamily || 'Roboto';
                    document.getElementById('fontSize').value = Math.round(obj.fontSize / scale);
                    document.getElementById('textContent').value = obj.text;
                } else {
                    document.getElementById('textPropsGroup').style.display = 'none';
                }
                
                // Add change listeners
                addPropertyListeners();
            }
            
            function clearPropertiesPanel() {
                document.getElementById('objectProperties').style.display = 'none';
            }
            
            // Add property change listeners
            function addPropertyListeners() {
                const obj = canvas.getActiveObject();
                if (!obj) return;
                
                const scale = canvas.scale;
                let conversionFactor = currentUnit === 'inch' ? (1 / mmToInch) : 1;
                
                document.getElementById('posX').onchange = function() {
                    obj.set('left', parseFloat(this.value) * scale * conversionFactor);
                    obj.setCoords();
                    canvas.requestRenderAll();
                };
                
                document.getElementById('posY').onchange = function() {
                    obj.set('top', parseFloat(this.value) * scale * conversionFactor);
                    obj.setCoords();
                    canvas.requestRenderAll();
                };
                
                document.getElementById('objWidth').onchange = function() {
                    const newWidth = parseFloat(this.value) * scale * conversionFactor;
                    if (obj.type === 'circle') {
                        obj.set('scaleX', newWidth / (obj.radius * 2));
                    } else if (obj.type === 'ellipse') {
                        obj.set('scaleX', newWidth / (obj.rx * 2));
                    } else {
                        obj.set('scaleX', newWidth / obj.width);
                    }
                    obj.setCoords();
                    canvas.requestRenderAll();
                };
                
                document.getElementById('objHeight').onchange = function() {
                    const newHeight = parseFloat(this.value) * scale * conversionFactor;
                    if (obj.type === 'circle') {
                        obj.set('scaleY', newHeight / (obj.radius * 2));
                    } else if (obj.type === 'ellipse') {
                        obj.set('scaleY', newHeight / (obj.ry * 2));
                    } else {
                        obj.set('scaleY', newHeight / obj.height);
                    }
                    obj.setCoords();
                    canvas.requestRenderAll();
                };
                
                document.getElementById('objRotation').onchange = function() {
                    obj.set('angle', parseFloat(this.value));
                    obj.setCoords();
                    canvas.requestRenderAll();
                };
                
                document.getElementById('fillColor').onchange = function() {
                    const fillValue = this.value;
                    const textColor = '#ffffff'; // White for plastic colors
                    
                    // Handle multiple selections
                    if (obj.type === 'activeSelection') {
                        obj.forEachObject(function(o) {
                            if (o.type === 'group') {
                                // Apply to shapes within the group (don't change coin text)
                                o.forEachObject(function(innerObj) {
                                    if (innerObj.type !== 'text' && innerObj.type !== 'i-text') {
                                        innerObj.set('fill', fillValue);
                                        innerObj.materialType = 'color';
                                    }
                                });
                            } else {
                                o.set('fill', fillValue);
                                o.materialType = 'color';
                                
                                // Update standalone text inside this shape
                                if (o.type === 'rect' || o.type === 'circle' || o.type === 'ellipse' || o.type === 'path') {
                                    const shapeBounds = o.getBoundingRect();
                                    canvas.getObjects().forEach(function(canvasObj) {
                                        // Only update standalone text objects (not in groups)
                                        if ((canvasObj.type === 'text' || canvasObj.type === 'i-text') && !canvasObj.group) {
                                            const textBounds = canvasObj.getBoundingRect();
                                            // Check if text is inside the shape bounds
                                            if (textBounds.left >= shapeBounds.left &&
                                                textBounds.top >= shapeBounds.top &&
                                                textBounds.left + textBounds.width <= shapeBounds.left + shapeBounds.width &&
                                                textBounds.top + textBounds.height <= shapeBounds.top + shapeBounds.height) {
                                                canvasObj.set('fill', textColor);
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    } else if (obj.type === 'group') {
                        // Apply to shapes within the group (don't change coin text)
                        obj.forEachObject(function(innerObj) {
                            if (innerObj.type !== 'text' && innerObj.type !== 'i-text') {
                                innerObj.set('fill', fillValue);
                                innerObj.materialType = 'color';
                            }
                        });
                        obj.materialType = 'color';
                        document.getElementById('materialPreset').value = 'color';
                    } else {
                        obj.set('fill', fillValue);
                        obj.materialType = 'color';
                        document.getElementById('materialPreset').value = 'color';
                        
                        // Update standalone text inside this shape
                        if (obj.type === 'rect' || obj.type === 'circle' || obj.type === 'ellipse' || obj.type === 'path') {
                            const shapeBounds = obj.getBoundingRect();
                            canvas.getObjects().forEach(function(canvasObj) {
                                // Only update standalone text objects (not in groups)
                                if ((canvasObj.type === 'text' || canvasObj.type === 'i-text') && !canvasObj.group) {
                                    const textBounds = canvasObj.getBoundingRect();
                                    // Check if text is inside the shape bounds
                                    if (textBounds.left >= shapeBounds.left &&
                                        textBounds.top >= shapeBounds.top &&
                                        textBounds.left + textBounds.width <= shapeBounds.left + shapeBounds.width &&
                                        textBounds.top + textBounds.height <= shapeBounds.top + shapeBounds.height) {
                                        canvasObj.set('fill', textColor);
                                    }
                                }
                            });
                        }
                    }
                    // Cascade colour to contained objects (per selected item for multi-select)
                    const currentPlasticColor = document.getElementById('fillColor').value;
                    if (obj.type === 'activeSelection') {
                        obj.forEachObject(function(selectedObj) {
                            cascadeColorToContained(selectedObj, 'color', currentPlasticColor);
                        });
                    } else {
                        cascadeColorToContained(obj, 'color', currentPlasticColor);
                    }
                    canvas.requestRenderAll();
                    saveState();
                };

                document.getElementById('materialPreset').onchange = function() {
                    const fillType = this.value;
                    applyFill(obj, fillType);
                    
                    // Update text color in groups based on material type
                    if (obj.type === 'group') {
                        const textColor = fillType === 'color' ? '#ffffff' : '#5c3316';
                        obj.forEachObject(function(innerObj) {
                            if (innerObj.type === 'text' || innerObj.type === 'i-text') {
                                innerObj.set('fill', textColor);
                            }
                        });
                    }
                    
                    // Show/hide fill color controls based on material type
                    if (fillType === 'color') {
                        document.getElementById('fillColorGroup').style.display = 'block';
                    } else {
                        document.getElementById('fillColorGroup').style.display = 'none';
                    }

                    // Cascade colour to contained objects (per selected item for multi-select)
                    const currentPlasticColor = document.getElementById('fillColor').value;
                    if (obj.type === 'activeSelection') {
                        obj.forEachObject(function(selectedObj) {
                            cascadeColorToContained(selectedObj, fillType, currentPlasticColor);
                        });
                    } else {
                        cascadeColorToContained(obj, fillType, currentPlasticColor);
                    }
                    canvas.requestRenderAll();
                    saveState();
                };

                document.getElementById('strokeColor').oninput = function() {
                    const strokeValue = this.value;
                    
                    // Handle multiple selections
                    if (obj.type === 'activeSelection') {
                        obj.forEachObject(function(o) {
                            if (o.type === 'group') {
                                // Apply to shapes within the group
                                o.forEachObject(function(innerObj) {
                                    if (innerObj.type !== 'text' && innerObj.type !== 'i-text') {
                                        innerObj.set('stroke', strokeValue);
                                    }
                                });
                            } else {
                                o.set('stroke', strokeValue);
                            }
                        });
                    } else if (obj.type === 'group') {
                        // Apply to shapes within the group, not text
                        obj.forEachObject(function(innerObj) {
                            if (innerObj.type !== 'text' && innerObj.type !== 'i-text') {
                                innerObj.set('stroke', strokeValue);
                            }
                        });
                    } else {
                        obj.set('stroke', strokeValue);
                    }
                    canvas.requestRenderAll();
                };
                
                // Save state when color picking is done
                document.getElementById('strokeColor').onchange = function() {
                    saveState();
                };
                
                document.getElementById('strokeWidth').onchange = function() {
                    const widthValue = parseFloat(this.value);
                    
                    // Handle multiple selections
                    if (obj.type === 'activeSelection') {
                        obj.forEachObject(function(o) {
                            if (o.type === 'group') {
                                // Apply to shapes within the group
                                o.forEachObject(function(innerObj) {
                                    if (innerObj.type !== 'text' && innerObj.type !== 'i-text') {
                                        innerObj.set({
                                            'strokeWidth': widthValue,
                                            'strokeUniform': true
                                        });
                                    }
                                });
                            } else {
                                o.set({
                                    'strokeWidth': widthValue,
                                    'strokeUniform': true
                                });
                            }
                        });
                    } else if (obj.type === 'group') {
                        // Apply to shapes within the group, not text
                        obj.forEachObject(function(innerObj) {
                            if (innerObj.type !== 'text' && innerObj.type !== 'i-text') {
                                innerObj.set({
                                    'strokeWidth': widthValue,
                                    'strokeUniform': true
                                });
                            }
                        });
                    } else {
                        obj.set({
                            'strokeWidth': widthValue,
                            'strokeUniform': true
                        });
                    }
                    canvas.requestRenderAll();
                    saveState();
                };
                
                // Corner radius for rectangles
                if (obj.type === 'rect') {
                    document.getElementById('cornerRadius').onchange = function() {
                        const newRadius = parseFloat(this.value) * scale * conversionFactor;
                        obj.set({
                            'rx': newRadius,
                            'ry': newRadius
                        });
                        obj.setCoords();
                        canvas.requestRenderAll();
                    };
                }
                
                if (obj.type === 'i-text' || obj.type === 'text') {
                    document.getElementById('fontFamily').onchange = function() {
                        obj.set('fontFamily', this.value);
                        obj.setCoords();
                        canvas.requestRenderAll();
                    };
                    
                    document.getElementById('fontSize').onchange = function() {
                        obj.set('fontSize', parseFloat(this.value) * scale);
                        obj.realFontSize = parseFloat(this.value);
                        obj.setCoords();
                        canvas.requestRenderAll();
                    };
                    
                    document.getElementById('textContent').onchange = function() {
                        obj.set('text', this.value);
                        obj.setCoords();
                        canvas.requestRenderAll();
                    };
                }
            }
            
            // Delete selected object(s)
            // ── Align & distribute (multi-selection only) ────────────────
            // Operates on the children of the active selection via absolute
            // bounding rects. Child left/top deltas equal canvas-space deltas
            // only while the selection frame is untransformed — true for a
            // fresh drag-selection, which is when this panel is visible.
            function updateAlignPanel() {
                const el = document.getElementById('alignSection');
                if (!el || !canvas) return;
                const a = canvas.getActiveObject();
                const n = (a && a.type === 'activeSelection') ? a.getObjects().length : 0;
                el.style.display = n >= 2 ? 'block' : 'none';
                const distH = document.getElementById('distributeHBtn');
                const distV = document.getElementById('distributeVBtn');
                if (distH) distH.disabled = n < 3; // nothing between first and last
                if (distV) distV.disabled = n < 3;
            }

            // Rebuild the selection frame after programmatically moving its
            // children — fabric never recomputes activeSelection bounds, so the
            // old box would hang around the pre-alignment area.
            function refreshSelectionFrame() {
                const sel = canvas.getActiveObject();
                if (!sel || sel.type !== 'activeSelection') return;
                const objs = sel.getObjects();
                canvas.discardActiveObject();
                const ns = new fabric.ActiveSelection(objs, { canvas: canvas });
                canvas.setActiveObject(ns);
            }

            function alignSelected(mode) {
                const sel = canvas.getActiveObject();
                if (!sel || sel.type !== 'activeSelection') return;
                const items = sel.getObjects().map(o => ({ o, r: o.getBoundingRect(true, true) }));
                if (items.length < 2) return;
                const minL = Math.min(...items.map(i => i.r.left));
                const maxR = Math.max(...items.map(i => i.r.left + i.r.width));
                const minT = Math.min(...items.map(i => i.r.top));
                const maxB = Math.max(...items.map(i => i.r.top + i.r.height));
                items.forEach(({ o, r }) => {
                    let dx = 0, dy = 0;
                    if (mode === 'left')    dx = minL - r.left;
                    if (mode === 'centerh') dx = (minL + maxR) / 2 - (r.left + r.width / 2);
                    if (mode === 'right')   dx = maxR - (r.left + r.width);
                    if (mode === 'top')     dy = minT - r.top;
                    if (mode === 'middle')  dy = (minT + maxB) / 2 - (r.top + r.height / 2);
                    if (mode === 'bottom')  dy = maxB - (r.top + r.height);
                    if (dx || dy) {
                        o.set({ left: o.left + dx, top: o.top + dy });
                        o.setCoords();
                    }
                });
                refreshSelectionFrame();
                canvas.requestRenderAll();
                saveState();
            }

            function distributeSelected(axis) {
                const sel = canvas.getActiveObject();
                if (!sel || sel.type !== 'activeSelection') return;
                const items = sel.getObjects().map(o => ({ o, r: o.getBoundingRect(true, true) }));
                if (items.length < 3) return;
                const centre = axis === 'h'
                    ? (i) => i.r.left + i.r.width / 2
                    : (i) => i.r.top + i.r.height / 2;
                items.sort((a, b) => centre(a) - centre(b));
                // First and last stay put; the rest get equal centre spacing.
                const first = centre(items[0]);
                const stepGap = (centre(items[items.length - 1]) - first) / (items.length - 1);
                items.forEach((it, idx) => {
                    const d = first + stepGap * idx - centre(it);
                    if (!d) return;
                    if (axis === 'h') it.o.set('left', it.o.left + d);
                    else it.o.set('top', it.o.top + d);
                    it.o.setCoords();
                });
                refreshSelectionFrame();
                canvas.requestRenderAll();
                saveState();
            }

            function deleteSelected() {
                const activeObjects = canvas.getActiveObjects();
                if (activeObjects.length > 0) {
                    activeObjects.forEach(obj => {
                        canvas.remove(obj);
                    });
                    canvas.discardActiveObject();
                    canvas.requestRenderAll();
                    clearPropertiesPanel();
                    saveState(); // Save state after deletion
                }
            }

            // Mirror selected object(s) horizontally (true screen-space mirror
            // about the vertical axis through the object's centre). Negating
            // scaleX alone flips along the object's LOCAL axis — for a rotated
            // object the rotation must mirror too (θ → −θ), and the centre is
            // pinned so non-centre-origin objects (images) don't shift.
            function mirrorHorizontal() {
                const obj = canvas.getActiveObject();
                if (!obj) return;
                const center = obj.getCenterPoint();
                obj.set({
                    scaleX: obj.scaleX * -1,
                    angle: (360 - obj.angle) % 360
                });
                obj.setPositionByOrigin(center, 'center', 'center');
                obj.setCoords();
                canvas.requestRenderAll();
                saveState();
            }

            // Mirror selected object(s) vertically (true screen-space mirror
            // about the horizontal axis through the object's centre).
            function mirrorVertical() {
                const obj = canvas.getActiveObject();
                if (!obj) return;
                const center = obj.getCenterPoint();
                obj.set({
                    scaleY: obj.scaleY * -1,
                    angle: (360 - obj.angle) % 360
                });
                obj.setPositionByOrigin(center, 'center', 'center');
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
                document.getElementById('objRotation').value = Math.round(obj.angle);
                saveState();
            }

            // Duplicate selected object(s)
            function duplicateSelected() {
                const activeObject = canvas.getActiveObject();
                if (!activeObject) return;
                
                const scale = canvas.scale;
                const offsetX = 10 * scale; // Shift 10mm to the right
                const duplicates = [];
                
                // Check if it's a single object or multiple selection
                if (activeObject.type === 'activeSelection') {
                    // Multiple objects selected
                    const objects = activeObject.getObjects();
                    
                    objects.forEach(obj => {
                        // Get the absolute position of the object on canvas
                        const absLeft = obj.left + activeObject.left;
                        const absTop = obj.top + activeObject.top;
                        
                        // Clone the object
                        obj.clone(function(cloned) {
                            // Set absolute position plus offset
                            cloned.set({
                                left: absLeft + offsetX,
                                top: absTop
                            });
                            
                            // Preserve custom properties
                            if (obj.shapeType) cloned.shapeType = obj.shapeType;
                            if (obj.realWidth) cloned.realWidth = obj.realWidth;
                            if (obj.realHeight) cloned.realHeight = obj.realHeight;
                            if (obj.realRadius) cloned.realRadius = obj.realRadius;
                            if (obj.realRadiusX) cloned.realRadiusX = obj.realRadiusX;
                            if (obj.realRadiusY) cloned.realRadiusY = obj.realRadiusY;
                            if (obj.realFontSize) cloned.realFontSize = obj.realFontSize;
                            if (obj.countryName) cloned.countryName = obj.countryName;
                            if (obj.currencyType) cloned.currencyType = obj.currencyType;
                            if (obj.coinValue) cloned.coinValue = obj.coinValue;
                            if (obj.realDiameter) cloned.realDiameter = obj.realDiameter;
                            if (obj.bendSourceText) cloned.bendSourceText = obj.bendSourceText;
                            if (obj.bendAmount) cloned.bendAmount = obj.bendAmount;
                            if (obj.bendFontFamily) cloned.bendFontFamily = obj.bendFontFamily;
                            
                            cloned.setCoords();
                            canvas.add(cloned);
                            duplicates.push(cloned);
                            
                            // If all objects are cloned, select them
                            if (duplicates.length === objects.length) {
                                canvas.discardActiveObject();
                                const selection = new fabric.ActiveSelection(duplicates, {
                                    canvas: canvas
                                });
                                canvas.setActiveObject(selection);
                                canvas.requestRenderAll();
                                updatePropertiesPanel();
                                saveState(); // Save state after duplication
                            }
                        });
                    });
                } else {
                    // Single object selected
                    activeObject.clone(function(cloned) {
                        // Shift the cloned object to the right
                        cloned.set({
                            left: cloned.left + offsetX,
                            top: cloned.top
                        });
                        
                        // Preserve custom properties
                        if (activeObject.shapeType) cloned.shapeType = activeObject.shapeType;
                        if (activeObject.realWidth) cloned.realWidth = activeObject.realWidth;
                        if (activeObject.realHeight) cloned.realHeight = activeObject.realHeight;
                        if (activeObject.realRadius) cloned.realRadius = activeObject.realRadius;
                        if (activeObject.realRadiusX) cloned.realRadiusX = activeObject.realRadiusX;
                        if (activeObject.realRadiusY) cloned.realRadiusY = activeObject.realRadiusY;
                        if (activeObject.realFontSize) cloned.realFontSize = activeObject.realFontSize;
                        if (activeObject.countryName) cloned.countryName = activeObject.countryName;
                        if (activeObject.currencyType) cloned.currencyType = activeObject.currencyType;
                        if (activeObject.coinValue) cloned.coinValue = activeObject.coinValue;
                        if (activeObject.realDiameter) cloned.realDiameter = activeObject.realDiameter;
                        if (activeObject.bendSourceText) cloned.bendSourceText = activeObject.bendSourceText;
                        if (activeObject.bendAmount) cloned.bendAmount = activeObject.bendAmount;
                        if (activeObject.bendFontFamily) cloned.bendFontFamily = activeObject.bendFontFamily;
                        
                        cloned.setCoords();
                        canvas.add(cloned);
                        canvas.setActiveObject(cloned);
                        canvas.requestRenderAll();
                        updatePropertiesPanel();
                        saveState(); // Save state after duplication
                    });
                }
            }
            
            // Clear canvas
            function clearCanvas() {
                // Temporarily suppress auto-save during bulk removal
                isRedoing = true;
                canvas.clear();
                canvas.backgroundColor = '#ffffff';
                canvas.requestRenderAll();
                isRedoing = false;
                saveState();
                updateCanvasHint();
            }

            // Toggle settings dropdown
            function toggleSettingsDropdown() {
                const dropdown = document.getElementById('settingsDropdown');
                dropdown.classList.toggle('show');
            }

            // Show/hide canvas onboarding hint
            function updateCanvasHint() {
                const hint = document.getElementById('canvasHint');
                if (!hint) return;
                hint.style.display = canvas.getObjects().length === 0 ? 'block' : 'none';
            }

            // Set unit (mm or inch) - segmented control handler
            function setUnit(unit) {
                const customWidth = parseFloat(document.getElementById('customWidthToolbar').value);
                const customHeight = parseFloat(document.getElementById('customHeightToolbar').value);

                if (unit === 'mm' && currentUnit === 'inch' && customWidth && customHeight) {
                    document.getElementById('customWidthToolbar').value = (customWidth / mmToInch).toFixed(2);
                    document.getElementById('customHeightToolbar').value = (customHeight / mmToInch).toFixed(2);
                } else if (unit === 'inch' && currentUnit === 'mm' && customWidth && customHeight) {
                    document.getElementById('customWidthToolbar').value = (customWidth * mmToInch).toFixed(2);
                    document.getElementById('customHeightToolbar').value = (customHeight * mmToInch).toFixed(2);
                }

                currentUnit = unit;

                document.getElementById('unitMMToolbar').classList.toggle('active', unit === 'mm');
                document.getElementById('unitInchToolbar').classList.toggle('active', unit === 'inch');

                if (unit === 'inch') {
                    document.getElementById('customSizeLabelToolbar').textContent = 'Enter size in inches:';
                    document.getElementById('customWidthToolbar').placeholder = 'Width (inch)';
                    document.getElementById('customHeightToolbar').placeholder = 'Height (inch)';
                } else {
                    document.getElementById('customSizeLabelToolbar').textContent = 'Enter size in mm:';
                    document.getElementById('customWidthToolbar').placeholder = 'Width (mm)';
                    document.getElementById('customHeightToolbar').placeholder = 'Height (mm)';
                }

                updateCanvasInfo();
                updatePropertiesPanel();
            }
            
            // History functions
            function saveState() {
                if (isUndoing || isRedoing) return;
                
                const json = JSON.stringify(canvas.toJSON(['shapeType', 'countryName', 'realWidth', 'realHeight', 'realRadius', 'realRx', 'realRy', 'realFontSize', 'realCornerRadius', 'currencyType', 'coinValue', 'realDiameter', 'bendSourceText', 'bendAmount', 'bendFontFamily']));
                
                // Remove any states after current step (when user does new action after undo)
                history = history.slice(0, historyStep + 1);
                
                // Add new state
                history.push(json);
                historyStep++;
                
                // Limit history to 50 steps to prevent memory issues
                if (history.length > 50) {
                    history.shift();
                    historyStep--;
                }
                
                updateHistoryButtons();
            }
            
            function undo() {
                if (historyStep > 0) {
                    isUndoing = true;
                    historyStep--;
                    
                    const state = history[historyStep];
                    canvas.clear();
                    canvas.loadFromJSON(state, function() {
                        canvas.requestRenderAll();
                        isUndoing = false;
                        updateHistoryButtons();
                    });
                }
            }
            
            function redo() {
                if (historyStep < history.length - 1) {
                    isRedoing = true;
                    historyStep++;
                    
                    const state = history[historyStep];
                    canvas.clear();
                    canvas.loadFromJSON(state, function() {
                        canvas.requestRenderAll();
                        isRedoing = false;
                        updateHistoryButtons();
                    });
                }
            }
            
            function updateHistoryButtons() {
                const undoBtn = document.getElementById('undoBtn');
                const redoBtn = document.getElementById('redoBtn');
                
                if (undoBtn) {
                    undoBtn.disabled = historyStep <= 0;
                }
                if (redoBtn) {
                    redoBtn.disabled = historyStep >= history.length - 1;
                }
            }
            
            // Unit toggle and canvas size change are handled by toolbar controls
            // (setUnit() function and canvasSizeToolbar event listener)
            
            // Update custom size inputs to show current canvas dimensions
            function updateCustomSizeInputs() {
                const size = canvasSizes[currentCanvasSize];
                let width = size.width;
                let height = size.height;

                // Convert to current unit
                if (currentUnit === 'inch') {
                    width = (width * mmToInch).toFixed(2);
                    height = (height * mmToInch).toFixed(2);
                } else {
                    width = width.toFixed(2);
                    height = height.toFixed(2);
                }

                document.getElementById('customWidthToolbar').value = width;
                document.getElementById('customHeightToolbar').value = height;
            }
            
            // Apply custom canvas size
            function applyCustomSize() {
                let customWidth = parseFloat(document.getElementById('customWidthToolbar').value);
                let customHeight = parseFloat(document.getElementById('customHeightToolbar').value);
                
                if (!customWidth || !customHeight || customWidth <= 0 || customHeight <= 0) {
                    alert('Please enter valid width and height values');
                    return;
                }
                
                // Convert to mm if currently in inch mode
                if (currentUnit === 'inch') {
                    customWidth = customWidth / mmToInch;
                    customHeight = customHeight / mmToInch;
                }
                
                // Store custom size (always in mm internally)
                canvasSizes.custom = { width: customWidth, height: customHeight };
                
                // Get new canvas size
                const size = { width: customWidth, height: customHeight };
                const targetPixelHeight = 840;
                const newScale = targetPixelHeight / 420;
                const newPixelWidth = size.width * newScale;
                const newPixelHeight = size.height * newScale;
                
                // Store old scale and objects
                const oldScale = canvas.scale;
                const objects = canvas.getObjects().slice();
                
                // Calculate scale ratio
                const scaleRatio = newScale / oldScale;
                
                // Clear the canvas
                canvas.clear();
                
                // Resize the canvas
                canvas.setWidth(newPixelWidth);
                canvas.setHeight(newPixelHeight);
                canvas.backgroundColor = '#ffffff';
                
                // Update stored dimensions
                canvas.realWidth = size.width;
                canvas.realHeight = size.height;
                canvas.scale = newScale;
                
                // Re-add objects with adjusted scale
                objects.forEach(obj => {
                    obj.set({
                        left: obj.left * scaleRatio,
                        top: obj.top * scaleRatio,
                        scaleX: obj.scaleX * scaleRatio,
                        scaleY: obj.scaleY * scaleRatio
                    });
                    
                    if (obj.type === 'circle') {
                        obj.radius = obj.radius * scaleRatio;
                    } else if (obj.type === 'ellipse') {
                        obj.rx = obj.rx * scaleRatio;
                        obj.ry = obj.ry * scaleRatio;
                    } else if (obj.type === 'rect') {
                        obj.width = obj.width * scaleRatio;
                        obj.height = obj.height * scaleRatio;
                        if (obj.rx) obj.rx = obj.rx * scaleRatio;
                        if (obj.ry) obj.ry = obj.ry * scaleRatio;
                    } else if (obj.type === 'i-text' || obj.type === 'text') {
                        obj.fontSize = obj.fontSize * scaleRatio;
                    } else if (obj.type === 'group') {
                        obj.getObjects().forEach(child => {
                            if (child.type === 'circle') {
                                child.radius = child.radius * scaleRatio;
                            } else if (child.type === 'text') {
                                child.fontSize = child.fontSize * scaleRatio;
                            }
                        });
                    }
                    
                    obj.setCoords();
                    canvas.add(obj);
                });
                
                canvas.requestRenderAll();
                updateCanvasInfo();
            }
            
            // Custom size input listeners are on toolbar elements (customWidthToolbar, customHeightToolbar)
            
            // Load an opentype.Font object, using cache to avoid repeat fetches.
            async function loadFont(fontFamily) {
                const key = FONT_URLS[fontFamily] ? fontFamily : FONT_FALLBACK;
                if (fontBinaryCache[key]) return fontBinaryCache[key];
                if (!FONT_URLS[key]) {
                    throw new Error('Font not found and fallback missing: ' + key);
                }
                if (key !== fontFamily) {
                    console.warn('No font URL for "' + fontFamily + '" - using fallback "' + key + '"');
                }
                const font = await opentype.load(FONT_URLS[key]);
                fontBinaryCache[key] = font;
                return font;
            }

            // Convert all text objects on the canvas to fabric.Path vector objects.
            // Returns array of { original, converted } - converted is null for non-text objects.
            async function convertTextToPathObjects() {
                const objects = canvas.getObjects();
                const result = [];

                for (let i = 0; i < objects.length; i++) {
                    const obj = objects[i];

                    if (obj.type === 'i-text' || obj.type === 'text') {
                        const font = await loadFont(obj.fontFamily || 'Roboto');
                        const scale = canvas.scale;
                        const fontSize = (obj.realFontSize || (obj.fontSize / scale));
                        const lines = (obj.text || '').split('\n');

                        // Full line height: ascender + descender magnitude + lineGap
                        const lineHeightPx = (font.ascender - font.descender + (font.lineGap || 0))
                                              / font.unitsPerEm * fontSize * scale;

                        const pathObjects = [];
                        const ascenderPx = font.ascender / font.unitsPerEm * fontSize * scale;
                        lines.forEach(function(line, lineIndex) {
                            const baselineY = ascenderPx + lineIndex * lineHeightPx;
                            const pathData = font.getPath(line, 0, baselineY, fontSize * scale).toPathData(2);
                            if (!pathData) return;

                            // Use relative coordinates (0, offset) - the group carries the absolute position.
                            // Do NOT set left/top to obj.left/obj.top here; that would double-offset when
                            // fabric.Group recomputes child positions relative to the group's own centre.
                            const fabricPath = new fabric.Path(pathData, {
                                left: 0,
                                top: lineIndex * lineHeightPx,
                                fill: obj.fill || '#000000',
                                stroke: obj.stroke || null,
                                strokeWidth: obj.strokeWidth || 0,
                                opacity: 1,
                                originX: 'center',
                                originY: 'top',
                                scaleX: 1,
                                scaleY: 1
                            });
                            pathObjects.push(fabricPath);
                        });

                        // Wrap all lines in a group (or use the single path directly)
                        // The group carries the absolute canvas position from the original text object.
                        if (pathObjects.length === 1) {
                            pathObjects[0].set({
                                left: obj.left,
                                top: obj.top,
                                angle: obj.angle,
                                opacity: obj.opacity,
                                originX: obj.originX,
                                originY: obj.originY,
                                scaleX: obj.scaleX,
                                scaleY: obj.scaleY
                            });
                            result.push({ original: obj, converted: pathObjects[0] });
                        } else if (pathObjects.length > 1) {
                            const group = new fabric.Group(pathObjects, {
                                left: obj.left,
                                top: obj.top,
                                originX: obj.originX,
                                originY: obj.originY,
                                angle: obj.angle,
                                opacity: obj.opacity,
                                scaleX: obj.scaleX,
                                scaleY: obj.scaleY
                            });
                            result.push({ original: obj, converted: group });
                        }
                    } else {
                        result.push({ original: obj, converted: null });
                    }
                }

                return result;
            }
            
            // Export SVG with text converted to paths
            async function exportSVG() {
                try {
                    // Check if canvas exists
                    if (!canvas) {
                        alert('Canvas not ready. Please wait a moment and try again.');
                        return;
                    }
                    
                    // Create a temporary canvas for export with converted text
                    const tempCanvas = new fabric.StaticCanvas(null, {
                        width: canvas.width,
                        height: canvas.height
                    });
                    
                    // Convert text objects to vector paths for font-independent SVG export
                    const convertedObjects = await convertTextToPathObjects();

                    // Add all objects to temp canvas
                    for (let item of convertedObjects) {
                        if (item.converted) {
                            // Add converted vector path instead of text
                            tempCanvas.add(item.converted);
                        } else {
                            // Clone and add non-text objects
                            const cloned = await new Promise((resolve) => {
                                item.original.clone(function(clone) {
                                    resolve(clone);
                                });
                            });
                            tempCanvas.add(cloned);
                        }
                    }

                    const svgData = tempCanvas.toSVG({
                        width: canvas.realWidth + 'mm',
                        height: canvas.realHeight + 'mm',
                        viewBox: {
                            x: 0,
                            y: 0,
                            width: canvas.width,
                            height: canvas.height
                        }
                    });

                    const fileName = 'design_' + Date.now() + '.svg';
                    
                    // Open SVG in new window with download interface
                    const newWindow = window.open('', '_blank');
                    
                    if (newWindow) {
                        // Build HTML content as string
                        const htmlContent = '<!DOCTYPE html><html><head><title>' + fileName + '</title>' +
                            '<style>' +
                            'body { margin: 0; padding: 20px; font-family: Arial, sans-serif; background: #f5f5f5; }' +
                            '.instructions { background: #344734; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: center; }' +
                            '.instructions h2 { margin-top: 0; }' +
                            '.instructions button { background: white; color: #344734; border: none; padding: 12px 24px; font-size: 16px; border-radius: 5px; cursor: pointer; margin: 10px; font-weight: bold; }' +
                            '.instructions button:hover { background: #e0e0e0; }' +
                            '.svg-container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }' +
                            'svg { max-width: 100%; height: auto; display: block; margin: 0 auto; border: 1px solid #ddd; }' +
                            '</style></head><body>' +
                            '<div class="instructions">' +
                            '<h2>📥 Your Design is Ready!</h2>' +
                            '<p><strong>To download this file:</strong></p>' +
                            '<button id="dlBtn">💾 Click Here to Download</button>' +
                            '<p style="margin-top: 15px; font-size: 14px;">Or press <strong>Ctrl+S</strong> (Windows) / <strong>Cmd+S</strong> (Mac)</p>' +
                            '<p style="font-size: 12px; margin-top: 10px;">Filename: ' + fileName + '</p>' +
                            '</div>' +
                            '<div class="svg-container">' + svgData + '</div>' +
                            '</body></html>';
                        
                        newWindow.document.write(htmlContent);
                        newWindow.document.close();
                        
                        // Add download function to new window after it's loaded
                        newWindow.addEventListener('load', function() {
                            const btn = newWindow.document.getElementById('dlBtn');
                            if (btn) {
                                btn.onclick = function() {
                                    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                                    const url = URL.createObjectURL(blob);
                                    const link = newWindow.document.createElement('a');
                                    link.href = url;
                                    link.download = fileName;
                                    newWindow.document.body.appendChild(link);
                                    link.click();
                                    newWindow.document.body.removeChild(link);
                                    URL.revokeObjectURL(url);
                                };
                            }
                        });
                    } else {
                        alert('Please allow popups for this site to download files.\n\nOr use the "Request Quote" button to email your design.');
                    }
                    
                } catch (error) {
                    console.error('Error generating SVG:', error);
                    alert('Error: ' + error.message);
                }
            }
            
            // Show quote form
            async function showQuoteForm() {
                // First generate and prepare SVG file with text converted
                try {
                    // Create a temporary canvas for export with converted text
                    const tempCanvas = new fabric.StaticCanvas(null, {
                        width: canvas.width,
                        height: canvas.height
                    });
                    
                    // Convert text objects to vector paths for font-independent SVG export
                    const convertedObjects = await convertTextToPathObjects();

                    // Add all objects to temp canvas
                    for (let item of convertedObjects) {
                        if (item.converted) {
                            tempCanvas.add(item.converted);
                        } else {
                            const cloned = await new Promise((resolve) => {
                                item.original.clone(function(clone) {
                                    resolve(clone);
                                });
                            });
                            tempCanvas.add(cloned);
                        }
                    }

                    const svgData = tempCanvas.toSVG({
                        width: canvas.realWidth + 'mm',
                        height: canvas.realHeight + 'mm',
                        viewBox: {
                            x: 0,
                            y: 0,
                            width: canvas.width,
                            height: canvas.height
                        }
                    });

                    const blob = new Blob([svgData], { type: 'image/svg+xml' });
                    const file = new File([blob], 'design_' + Date.now() + '.svg', { type: 'image/svg+xml' });

                    // Create a DataTransfer to set the file input
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(file);
                    const designFileInputEl = document.getElementById('designFileInput');
                    if (designFileInputEl) {
                        designFileInputEl.files = dataTransfer.files;
                    }
                    
                } catch (error) {
                    console.error('Error preparing design file:', error);
                }
                
                // Update design summary
                var summaryDetails = document.getElementById('designSummaryDetails');
                if (summaryDetails) {
                    var objCount = canvas.getObjects().length;
                    var sizeText = canvas.realWidth + ' x ' + canvas.realHeight + ' mm';
                    summaryDetails.textContent = 'Canvas: ' + sizeText + ' | Objects: ' + objCount;
                }

                // Show modal
                const quoteModalEl = document.getElementById('quoteModal');
                if (quoteModalEl) {
                    const modal = new bootstrap.Modal(quoteModalEl);
                    modal.show();
                }
            }
            
            // Handle quote form submission
            function setupQuoteFormHandler() {
                const form = document.getElementById('quoteForm');
                if (form) {
                    form.addEventListener('submit', async function(e) {
                        e.preventDefault();

                        const submitBtn = document.getElementById('submitBtn');
                        const formMessages = document.getElementById('formMessages');
                        const infoMessage = document.getElementById('infoMessage');

                        // Guard against missing elements
                        if (!submitBtn || !formMessages) {
                            console.error('Required form elements not found');
                            return;
                        }

                        // Disable submit button
                        submitBtn.disabled = true;
                        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

                        // Hide info message
                        if (infoMessage) infoMessage.style.display = 'none';

                        try {
                            // Create FormData
                            const formData = new FormData();
                            formData.append('_subject', 'New Design Quote Request - HillSpring Crafts');
                            formData.append('_captcha', 'false');
                            formData.append('_template', 'table');
                            formData.append('project_name', document.getElementById('projectName').value);
                            formData.append('first_name', document.getElementById('firstName').value);
                            formData.append('last_name', document.getElementById('lastName').value);
                            formData.append('email', document.getElementById('userEmail').value);
                            formData.append('notes', document.getElementById('userNotes').value);
                            formData.append('preferred_material', document.getElementById('preferredMaterial').value);

                            // Add file if present
                            const fileInput = document.getElementById('designFileInput');
                            if (fileInput && fileInput.files.length > 0) {
                                formData.append('attachment', fileInput.files[0]);
                            }

                            // Attach the editable project file so the design can be
                            // re-opened and tweaked later (builder only; harmless in
                            // the plain editor where Coach is undefined). Use a DISTINCT
                            // field name — FormSubmit keeps only one file per field, so
                            // appending it under 'attachment' too would overwrite the SVG.
                            try {
                                if (typeof Coach !== 'undefined' && Coach.persist && Coach.persist.buildProjectFile) {
                                    const projectFile = Coach.persist.buildProjectFile();
                                    if (projectFile) formData.append('project_file', projectFile);
                                }
                            } catch (projErr) {
                                console.warn('Could not attach project file:', projErr);
                            }

                            // Submit to FormSubmit
                            const response = await fetch('https://formsubmit.co/hillspringcrafts@gmail.com', {
                                method: 'POST',
                                body: formData,
                                headers: {
                                    'Accept': 'application/json'
                                }
                            });

                            if (response.ok) {
                                // Success
                                formMessages.innerHTML = '<div class="alert alert-success"><i class="fas fa-check-circle"></i> Quote request sent successfully! We\'ll get back to you within 24 hours.</div>';
                                form.reset();

                                // Close modal after 3 seconds
                                setTimeout(function() {
                                    const modal = bootstrap.Modal.getInstance(document.getElementById('quoteModal'));
                                    if (modal) modal.hide();
                                    formMessages.innerHTML = '';
                                    if (infoMessage) infoMessage.style.display = 'block';
                                }, 3000);
                            } else {
                                throw new Error('Submission failed');
                            }

                        } catch (error) {
                            console.error('Form submission error:', error);
                            formMessages.innerHTML = '<div class="alert alert-danger"><i class="fas fa-exclamation-circle"></i> There was an error sending your request. Please try again or email us directly at hillspringcrafts@gmail.com</div>';
                        } finally {
                            // Re-enable submit button
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Quote Request';
                        }
                    });
                }
            }
            
            // Initialize on page load
            // Close settings dropdown when clicking outside
            document.addEventListener('click', function(e) {
                var dropdown = document.getElementById('settingsDropdown');
                var settingsBtn = e.target.closest('.settings-dropdown');
                if (!settingsBtn && dropdown) {
                    dropdown.classList.remove('show');
                }
            });

            // Wire up toolbar canvas size controls
            document.getElementById('canvasSizeToolbar').addEventListener('change', function() {
                var val = this.value;
                currentCanvasSize = val;
                if (val === 'custom') {
                    document.getElementById('customSizeInputsToolbar').style.display = 'block';
                } else {
                    document.getElementById('customSizeInputsToolbar').style.display = 'none';
                    // Trigger the canvas resize
                    var size = canvasSizes[val];
                    var targetPixelHeight = 840;
                    var newScale = targetPixelHeight / 420;
                    var newPixelWidth = size.width * newScale;
                    var newPixelHeight = size.height * newScale;
                    var oldScale = canvas.scale;
                    var objects = canvas.getObjects().slice();
                    var scaleRatio = newScale / oldScale;
                    isRedoing = true;
                    canvas.clear();
                    canvas.setWidth(newPixelWidth);
                    canvas.setHeight(newPixelHeight);
                    canvas.backgroundColor = '#ffffff';
                    canvas.realWidth = size.width;
                    canvas.realHeight = size.height;
                    canvas.scale = newScale;
                    objects.forEach(function(obj) {
                        obj.set({ left: obj.left * scaleRatio, top: obj.top * scaleRatio, scaleX: obj.scaleX * scaleRatio, scaleY: obj.scaleY * scaleRatio });
                        obj.setCoords();
                        canvas.add(obj);
                    });
                    isRedoing = false;
                    canvas.requestRenderAll();
                    updateCanvasInfo();
                    saveState();
                }
            });

            document.getElementById('customWidthToolbar').addEventListener('change', function() {
                currentCanvasSize = 'custom';
                document.getElementById('canvasSizeToolbar').value = 'custom';
                applyCustomSize();
            });
            document.getElementById('customHeightToolbar').addEventListener('change', function() {
                currentCanvasSize = 'custom';
                document.getElementById('canvasSizeToolbar').value = 'custom';
                applyCustomSize();
            });

            window.addEventListener('load', function() {
                initCanvas();
                
                // Setup mouse wheel zoom functionality
                canvas.on('mouse:wheel', function(opt) {
                    if (!opt.e.ctrlKey) return;
                    const delta = opt.e.deltaY;
                    let zoom = canvas.getZoom();
                    zoom *= 0.999 ** delta;
                    if (zoom > 20) zoom = 20;
                    if (zoom < 0.1) zoom = 0.1;

                    // Zoom to mouse position
                    canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
                    opt.e.preventDefault();
                    opt.e.stopPropagation();
                });
                
                // Setup pan functionality (drag canvas with right click or Alt/Ctrl+drag)
                canvas.on('mouse:down', function(opt) {
                    const evt = opt.e;
                    // Check if right-clicking (button === 2) or Alt/Ctrl key with any button
                    if (evt.button === 2 || evt.altKey === true || evt.ctrlKey === true) {
                        this.isDragging = true;
                        this.selection = false;
                        this.lastPosX = evt.clientX;
                        this.lastPosY = evt.clientY;
                        this.defaultCursor = 'grab';
                        this.hoverCursor = 'grab';
                        evt.preventDefault();
                        evt.stopPropagation();
                    }
                });
                
                // Prevent context menu on right-click
                canvas.wrapperEl.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    return false;
                });
                
                canvas.on('mouse:move', function(opt) {
                    if (this.isDragging) {
                        const e = opt.e;
                        const vpt = this.viewportTransform;
                        vpt[4] += e.clientX - this.lastPosX;
                        vpt[5] += e.clientY - this.lastPosY;
                        this.requestRenderAll();
                        this.lastPosX = e.clientX;
                        this.lastPosY = e.clientY;
                        this.defaultCursor = 'grabbing';
                        this.hoverCursor = 'grabbing';
                        e.preventDefault();
                        e.stopPropagation();
                    }
                });
                
                canvas.on('mouse:up', function(opt) {
                    if (this.isDragging) {
                        this.setViewportTransform(this.viewportTransform);
                        this.isDragging = false;
                        this.selection = true;
                        this.defaultCursor = 'default';
                        this.hoverCursor = 'move';
                    }
                });
                
                // Setup download button
                const downloadBtn = document.getElementById('downloadBtn');
                if (downloadBtn) {
                    downloadBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        exportSVG().catch(function(err) { console.error('Unhandled exportSVG error:', err); });
                    });
                }

                // Setup quote button
                const quoteBtnEl = document.getElementById('quoteBtn');
                if (quoteBtnEl) {
                    quoteBtnEl.addEventListener('click', function() {
                        showQuoteForm().catch(function(err) { console.error('showQuoteForm error:', err); });
                    });
                }

                // Setup keyboard shortcuts
                document.addEventListener('keydown', function(e) {
                    // Prevent actions if user is typing in an input field
                    const activeElement = document.activeElement;
                    const isTyping = activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA');
                    
                    // Delete: Delete or Backspace key
                    if (e.key === 'Delete' || e.key === 'Backspace') {
                        if (isTyping) return; // Allow normal backspace/delete behavior in input fields
                        e.preventDefault();
                        deleteSelected();
                    }
                    
                    // Duplicate: Ctrl+D
                    if (e.ctrlKey && e.key === 'd') {
                        if (isTyping) return; // Allow normal behavior in input fields
                        e.preventDefault();
                        duplicateSelected();
                    }

                    // Align shortcuts, multi-selection only (plain keys, so the
                    // isTyping guard matters — fabric text editing uses a hidden
                    // textarea, which the guard already covers):
                    // C = align horizontal centres, E = align vertical centres.
                    if (!e.ctrlKey && !e.metaKey && !e.altKey && (e.key === 'e' || e.key === 'E' || e.key === 'c' || e.key === 'C')) {
                        if (isTyping) return;
                        const active = canvas.getActiveObject();
                        if (active && active.type === 'activeSelection') {
                            e.preventDefault();
                            alignSelected((e.key === 'c' || e.key === 'C') ? 'centerh' : 'middle');
                        }
                    }

                    const mod = e.ctrlKey || e.metaKey; // Ctrl (Win/Linux) or Cmd (Mac)
                    const k = e.key.toLowerCase();

                    // Undo: Ctrl/Cmd + Z (without Shift)
                    if (mod && !e.shiftKey && k === 'z') {
                        if (isTyping) return;
                        e.preventDefault();
                        undo();
                    }

                    // Redo: Ctrl/Cmd + Y, or Ctrl/Cmd + Shift + Z
                    if (mod && (k === 'y' || (e.shiftKey && k === 'z'))) {
                        if (isTyping) return;
                        e.preventDefault();
                        redo();
                    }
                });
                
                // Setup quote form handler
                setupQuoteFormHandler();
            });
        </script>

        <!-- The Coach now lives in the left sidebar (#coach-bubble), not a floating bubble. -->

        <!-- ═══════════════════════════════════════════════════════
             COACH CORE (Task 3)
             ═══════════════════════════════════════════════════════ -->
        <script>
        /* ─────────────────────────────────────────────────────────
           Coach — guided builder core
           ───────────────────────────────────────────────────────── */

        /* Shared helpers. The engine's globals may be missing (script failed,
           text-only mode), so cv() resolves the live Fabric canvas or null and
           engineSave() snapshots engine undo state only when it exists. */
        const cv = () => (typeof canvas !== 'undefined' && canvas) ? canvas : null;
        const engineSave = () => { if (typeof saveState === 'function') saveState(); };
        const mkEl = (tag, props = {}) => Object.assign(document.createElement(tag), props);
        // Slate-accented country button, shared by the step-2 base-shape picker
        // and the step-7 personalise panel.
        const mkCountryBtn = (key, label) => {
            const b = mkEl('button', { type: 'button', className: 'btn btn-sm btn-outline-light coach-btn-country', textContent: label });
            b.dataset.country = key;
            return b;
        };

        /* Type-ahead country search shared by the step-2 and step-7 country
           panels. Backed by the engine's getCountryNames(); the datalist is a
           single lazily-created element reused by both inputs. onPick receives
           (name, slugKey) — slugKey is what the engine add-functions expect. */
        const mkCountrySearch = (onPick) => {
            const LIST_ID = 'coachCountrySearchList';
            const wrap = mkEl('div', { className: 'mt-1 w-100' });
            const input = mkEl('input', { className: 'form-control form-control-sm', placeholder: 'Search any country…' });
            input.setAttribute('list', LIST_ID);
            if (!document.getElementById(LIST_ID)) {
                const dl = mkEl('datalist');
                dl.id = LIST_ID;
                // The Coach mount is #coach-bubble — it persists across
                // Coach.render(), so the shared datalist survives re-renders.
                document.getElementById('coach-bubble').appendChild(dl);
            }
            let populated = false;
            input.addEventListener('focus', () => {
                if (populated || typeof getCountryNames !== 'function') return;
                getCountryNames().then(names => {
                    const dl = document.getElementById(LIST_ID);
                    dl.innerHTML = '';
                    names.forEach(n => {
                        const o = mkEl('option');
                        o.value = n;
                        dl.appendChild(o);
                    });
                    populated = true;
                }).catch(err => console.warn('Country list prefetch failed', err));
            });
            input.addEventListener('change', () => {
                const name = input.value.trim();
                if (!name) return;
                input.value = '';
                onPick(name, typeof countrySlug === 'function' ? countrySlug(name) : name.toLowerCase());
            });
            wrap.appendChild(input);
            return wrap;
        };

        const Coach = {
            current: 0,
            state: {},
            steps: [],          // populated below, after SELECTORS is defined
            visited: new Set(),   // step indices the customer has landed on
            completed: new Set(), // step indices marked done (Next pressed while on them)
            _highlighted: [],     // elements currently carrying .coach-highlight

            SELECTORS: {
                templates:      '#coachTemplatesHeading',
                coins:          '#coachCoinsHeading',
                countries:      '#coachCountriesHeading',
                shapes:         '#coachShapesHeading',
                text:           '#coachTextHeading',
                settings:       '#coachSettingsBtn',
                sizeW:          '#customWidthToolbar',
                sizeH:          '#customHeightToolbar',
                material:       '#materialPresetGroup',
                materialSelect: '#materialPreset',
                fillColor:      '#fillColor',
                imageUpload:    '#imageUpload',
                fileImport:     '#fileImport',
                download:       '#downloadBtn'
            },

            /* ── 1. Init ──────────────────────────────────────────── */
            init() {
                let tries = 0;
                const MAX_TRIES = 60;          // 60 × 50 ms = 3 s
                const INTERVAL  = 50;

                const poll = setInterval(() => {
                    tries++;
                    if (cv()) {
                        clearInterval(poll);
                        // Register autosave on canvas events
                        ['object:added', 'object:modified', 'object:removed'].forEach(ev => {
                            canvas.on(ev, () => Coach.persist.save());
                        });
                        // Imported SVG vectors → thin 0.07 outline (hairline cut line).
                        // (A country chosen as the BASE shape is sent to the back where it's
                        //  captured in step 2 — NOT here — so step-7/template countries stay put.)
                        canvas.on('object:added', (e) => {
                            const o = e.target;
                            if (!o) return;
                            if (o.shapeType === 'imported') {
                                Coach.normalizeImportedStroke(o);
                                canvas.requestRenderAll();
                            }
                            // New objects default to locked aspect → set their controls.
                            Coach.applyAspectToObject(o);
                        });
                        // Enable/disable the right-panel Actions as the canvas fills/empties.
                        ['object:added', 'object:removed'].forEach(function(ev) {
                            canvas.on(ev, function() { Coach.updateActionButtons(); });
                        });
                        // Per-object aspect lock: keep uniformScaling + the right-panel
                        // button in sync with whatever object is selected.
                        ['selection:created', 'selection:updated', 'selection:cleared'].forEach(function(ev) {
                            canvas.on(ev, function() { Coach.onAspectSelect(); });
                        });
                        // Double-click on bent text edits it like normal text:
                        // straighten → edit inline → re-bend with the new content.
                        canvas.on('mouse:dblclick', function(opt) {
                            const t = opt && opt.target;
                            if (t && t.shapeType === 'bentText') Coach.editBentText(t);
                        });
                        // Text measured before the web fonts land (typically a
                        // project resumed at page load) caches fallback-font
                        // character widths — bounding boxes come out shorter than
                        // the glyphs. Once fonts are ready, drop the cache and
                        // re-measure whatever text is already on the canvas.
                        if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
                            document.fonts.ready.then(function() {
                                if (!cv() || !fabric.util || typeof fabric.util.clearFabricFontCache !== 'function') return;
                                fabric.util.clearFabricFontCache();
                                canvas.getObjects().forEach(function(o) {
                                    if (o.type === 'i-text' || o.type === 'text') {
                                        o.initDimensions();
                                        o.setCoords();
                                    }
                                });
                                canvas.requestRenderAll();
                            });
                        }
                        // (The "Start over" ↺ control lives on the step-chip row; see renderTabs.)
                        // Make the engine's main "Start Over" button confirm AND reset the Coach.
                        // (Coach.startOver sets _suppressClearReset, having already confirmed itself.)
                        if (typeof clearCanvas === 'function' && !clearCanvas._coachWrapped) {
                            const origClear = clearCanvas;
                            window.clearCanvas = function() {
                                if (!Coach._suppressClearReset &&
                                    !window.confirm('Start over? This clears your current design.')) {
                                    return;
                                }
                                origClear.apply(this, arguments);
                                if (!Coach._suppressClearReset) Coach.resetSelf();
                            };
                            window.clearCanvas._coachWrapped = true;
                        }
                        Coach.updateActionButtons();
                        Coach.persist.boot();
                    } else if (tries >= MAX_TRIES) {
                        clearInterval(poll);
                        console.warn('[Coach] engine canvas not found; running in text-only mode');
                        Coach.go(0);
                    }
                }, INTERVAL);
            },

            /* ── 2. Navigation primitives ─────────────────────────── */
            go(index) {
                const clamped = Math.max(0, Math.min(index, Coach.steps.length - 1));
                Coach.current = clamped;
                Coach.visited.add(clamped);
                Coach.clearHighlights();
                Coach.render();
                if (Coach.persist) Coach.persist.save();
            },

            next() {
                // Last step has no Next/Finish — nothing to advance to.
                if (Coach.current === Coach.steps.length - 1) return;
                // Mark the step we're leaving as done, then advance.
                Coach.completed.add(Coach.current);
                Coach.go(Coach.current + 1);
            },
            back() { Coach.go(Coach.current - 1); },

            /* ── 3. Render ────────────────────────────────────────── */
            render() {
                const step      = Coach.steps[Coach.current];
                if (!step) return;

                const isFirst   = Coach.current === 0;
                const isLast    = Coach.current === Coach.steps.length - 1;

                // Progress text
                const progressEl = document.getElementById('coach-progress');
                if (progressEl) {
                    progressEl.textContent = `Step ${Coach.current + 1} / ${Coach.steps.length}`;
                }

                // Title
                const titleEl = document.getElementById('coach-title');
                if (titleEl) {
                    titleEl.textContent = step.title;
                }

                // Body
                const bodyEl = document.getElementById('coach-body');
                if (bodyEl) {
                    bodyEl.innerHTML = '';
                    if (typeof step.renderAction === 'function') {
                        step.renderAction(bodyEl);
                    }
                    // Style the step explainer (first paragraph) as an outlined callout.
                    const introEl = bodyEl.querySelector('p');
                    if (introEl) introEl.classList.add('coach-intro');
                }

                // Highlights
                Coach.highlight(step.highlight || []);

                // Footer — back button
                const backBtn = document.getElementById('coach-back');
                if (backBtn) {
                    backBtn.style.visibility = isFirst ? 'hidden' : 'visible';
                }

                // Footer — next button label
                // Last step (Review) is the end — no Next/Finish button at all.
                const nextBtn = document.getElementById('coach-next');
                if (nextBtn) {
                    nextBtn.style.display = isLast ? 'none' : '';
                    nextBtn.textContent = 'Next ›';
                }

                // Step tabs (left-sidebar stepper)
                Coach.renderTabs();
            },

            /* ── A step is "done" only once the customer has pressed Next while
                 on it (tracked in Coach.completed). ── */
            isStepDone(i) {
                return Coach.completed.has(i);
            },

            /* ── 4. Step stepper ──────────────────────────────────────
               A compact horizontal row of numbered chips. Each is clickable to
               jump straight to that step and is colour-coded:
                 • current   → dark green
                 • done       → green (Next was pressed on it)
                 • used       → light green (visited, Next not yet pressed)
                 • untouched  → grey
               The current step's name shows in the single label (#coach-title). */
            renderTabs() {
                const stepsEl = document.getElementById('coach-steps');
                if (!stepsEl) return;
                stepsEl.innerHTML = '';

                Coach.steps.forEach((step, i) => {
                    const chip = mkEl('button', { type: 'button', className: 'coach-step-chip' });

                    const isCurrent = i === Coach.current;
                    const isVisited = Coach.visited.has(i);
                    const isDone    = Coach.isStepDone(i);

                    if (isCurrent)      chip.classList.add('is-current');
                    else if (isDone)    chip.classList.add('is-done');
                    else if (isVisited) chip.classList.add('is-used');

                    // A done (non-current) chip shows a tick; otherwise the number.
                    chip.textContent = (isDone && !isCurrent) ? '✓' : (i + 1);
                    chip.title = (i + 1) + '. ' + step.title + (step.optional ? ' (optional)' : '');
                    chip.addEventListener('click', () => Coach.go(i));
                    stepsEl.appendChild(chip);
                });

                // Trailing "Start over" ↺ control on the same row as the step chips
                // (pushed to the far right via margin-left:auto in .coach-startover).
                const reset = mkEl('button', {
                    type: 'button', id: 'coach-startover', className: 'coach-startover',
                    title: 'Start over', textContent: '↺'
                });
                reset.addEventListener('click', () => Coach.startOver());
                stepsEl.appendChild(reset);
            },

            /* ── 5. Highlight ─────────────────────────────────────── */
            highlight(selectorList) {
                Coach.clearHighlights();

                if (!Array.isArray(selectorList) || selectorList.length === 0) return;

                const isMobile = window.matchMedia('(max-width: 768px)').matches;
                let firstEl    = null;

                selectorList.forEach(sel => {
                    if (!sel) return;
                    const el = document.querySelector(sel);
                    if (!el) return;
                    el.classList.add('coach-highlight');
                    Coach._highlighted.push(el);
                    if (!firstEl) firstEl = el;
                });

                if (isMobile && firstEl) {
                    firstEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            },

            clearHighlights() {
                // Use the remembered list first; fall back to a live query for safety
                if (Coach._highlighted.length > 0) {
                    Coach._highlighted.forEach(el => el.classList.remove('coach-highlight'));
                    Coach._highlighted = [];
                } else {
                    document.querySelectorAll('.coach-highlight')
                        .forEach(el => el.classList.remove('coach-highlight'));
                }
            },

        };

        /* ── Coach.EXTRA_PROPS ───────────────────────────────────────── */
        Coach.EXTRA_PROPS = [
            'shapeType', 'countryName', 'realWidth', 'realHeight', 'realRadius',
            'realRx', 'realRy', 'realFontSize', 'realCornerRadius',
            'currencyType', 'coinValue', 'realDiameter', 'materialType', 'coachHolderId',
            '_coachEngrave', '_coachOrigFill', 'coachAspectLocked', '_coachClipped',
            'bendSourceText', 'bendAmount', 'bendFontFamily'
        ];

        /* ── Coach.COUNTRY_OPTIONS ─────────────────────────────────────
           Country-shape buttons for step 2 (base holder). Keys resolve through
           the engine's COUNTRY_KEY_MAP / COMPOSITE_SHAPES (world-atlas dataset
           at runtime). To add a curated button: add one { key, label } line
           here — the key is the countrySlug() of the dataset name (no path
           data needed). Any other country is reachable via the panel's search
           field.
           Step 7 (personalise) additionally offers the larger continent/world
           shapes listed in COUNTRY_OPTIONS_EXTRA — see COUNTRY_OPTIONS_STEP7. */
        Coach.COUNTRY_OPTIONS = [
            { key: 'usa',       label: 'USA' },
            { key: 'uk',        label: 'UK' },
            { key: 'australia', label: 'Australia' },
            { key: 'canada',    label: 'Canada' },
            { key: 'germany',   label: 'Germany' },
            { key: 'italy',     label: 'Italy' },
            { key: 'france',    label: 'France' },
            { key: 'japan',     label: 'Japan' }
        ];

        /* Shapes offered ONLY in step 7 (personalise), not as a base holder. */
        Coach.COUNTRY_OPTIONS_EXTRA = [
            { key: 'world',        label: 'World map' },
            { key: 'europe',       label: 'Europe' },
            { key: 'southamerica', label: 'South America' },
            { key: 'northamerica', label: 'North America' },
            { key: 'americas',     label: 'Americas' }
        ];

        /* The full step-7 list: the base countries plus the step-7-only extras. */
        Coach.COUNTRY_OPTIONS_STEP7 = Coach.COUNTRY_OPTIONS.concat(Coach.COUNTRY_OPTIONS_EXTRA);

        /* ── Coach.persist ───────────────────────────────────────────── */
        Coach.persist = {
            KEY:      'hsc-builder-v1',
            disabled: false,
            _t:       null,
            _noted:   false,

            /* Serialise Coach.state without the live Fabric holderObj */
            _serializableState() {
                const s = Coach.state || {};
                return {
                    occasion:     s.occasion,
                    projectName:  s.projectName,
                    holderType:   s.holderType,
                    material:     s.material,
                    coins:        s.coins,
                    coinCurrency: s.coinCurrency
                };
            },

            /* Build the full, self-describing project payload (canvas + Coach
               state + step). Same shape used for localStorage auto-save, the
               downloadable project file, and the e-mailed project attachment. */
            buildPayload() {
                return {
                    app:        'hsc-coin-holder',
                    version:    1,
                    savedAt:    new Date().toISOString(),
                    canvasJSON: canvas.toJSON(Coach.EXTRA_PROPS),
                    step:       Coach.current,
                    state:      Coach.persist._serializableState()
                };
            },

            /* Debounced save (~500 ms) */
            save() {
                if (Coach.persist._t) clearTimeout(Coach.persist._t);
                Coach.persist._t = setTimeout(function() {
                    Coach.persist._t = null;
                    if (Coach.persist.disabled) return;
                    if (!cv()) return;
                    try {
                        localStorage.setItem(Coach.persist.KEY, JSON.stringify(Coach.persist.buildPayload()));
                    } catch (e) {
                        Coach.persist.disabled = true;
                        Coach.persist.note();
                    }
                }, 500);
            },

            /* Filesystem-safe slug from the project name (or a sensible default) */
            _fileBase() {
                const raw = (Coach.state && Coach.state.projectName) ? Coach.state.projectName : 'coin-holder';
                const slug = raw.toString().trim()
                    .replace(/[^a-z0-9\-_ ]/gi, '')
                    .replace(/\s+/g, '-')
                    .toLowerCase();
                return slug || 'coin-holder';
            },

            /* Blob of the current project JSON — null if the canvas is empty or
               missing, or the payload can't be serialised. */
            _projectBlob() {
                if (!cv() || !canvas.getObjects().length) return null;
                try {
                    return new Blob([JSON.stringify(Coach.persist.buildPayload())], { type: 'application/json' });
                } catch (e) { return null; }
            },

            /* Download the current design as an editable .hsc.json project file */
            exportToFile() {
                if (!cv() || !canvas.getObjects().length) return;
                const blob = Coach.persist._projectBlob();
                if (!blob) {
                    alert("Sorry — your project couldn't be prepared for download. Please try again.");
                    return;
                }
                const url = URL.createObjectURL(blob);
                const a   = mkEl('a', { href: url, download: Coach.persist._fileBase() + '.hsc.json' });
                document.body.appendChild(a);
                a.click();
                setTimeout(function() { URL.revokeObjectURL(url); a.remove(); }, 0);
            },

            /* Build a File of the current project, for attaching to the e-mail
               quote. Returns null if there's nothing to save. */
            buildProjectFile() {
                const blob = Coach.persist._projectBlob();
                return blob && new File([blob], Coach.persist._fileBase() + '-' + Date.now() + '.hsc.json',
                    { type: 'application/json' });
            },

            /* Read a chosen project file and restore it onto the canvas */
            importFromFile(file) {
                if (!file) return;
                const reader = new FileReader();
                reader.onload = function(ev) {
                    let parsed;
                    try { parsed = JSON.parse(ev.target.result); }
                    catch (e) { alert("That file isn't a valid project file."); return; }
                    if (!parsed || !parsed.canvasJSON || !Array.isArray(parsed.canvasJSON.objects)) {
                        alert("That doesn't look like a coin-holder project file. Please choose a .hsc.json file you saved from this tool.");
                        return;
                    }
                    // Guard against silently wiping out work already on the canvas.
                    if (cv() && canvas.getObjects().length &&
                        !confirm('Load this project? Your current design will be replaced.')) {
                        return;
                    }
                    Coach.persist.resume(parsed);
                    // Make the freshly loaded project the current working state.
                    Coach.persist.save();
                };
                reader.onerror = function() { alert("Sorry — that file couldn't be read."); };
                reader.readAsText(file);
            },

            /* One-time notice when storage is unavailable */
            note() {
                if (Coach.persist._noted) return;
                Coach.persist._noted = true;
                const bodyEl = document.getElementById('coach-body');
                if (bodyEl) {
                    bodyEl.appendChild(mkEl('p', {
                        style: 'font-size:0.75rem;color:#888;margin-top:8px;',
                        textContent: "Heads up — your progress won't be saved on this device (private mode or storage full)."
                    }));
                } else {
                    console.info("[Coach] Progress won't be saved on this device (private mode or storage full).");
                }
            },

            /* Load saved payload (or null) */
            load() {
                try {
                    const raw = localStorage.getItem(Coach.persist.KEY);
                    return raw ? JSON.parse(raw) : null;
                } catch (e) {
                    return null;
                }
            },

            /* Remove saved state */
            clear() {
                try { localStorage.removeItem(Coach.persist.KEY); } catch (e) {}
            },

            /* Called from init when canvas is confirmed */
            boot() {
                const saved = Coach.persist.load();
                if (saved && saved.canvasJSON && Array.isArray(saved.canvasJSON.objects) && saved.canvasJSON.objects.length) {
                    Coach.persist.promptResume(saved);
                } else {
                    Coach.go(0);
                }
            },

            /* Render a resume prompt into the coach bubble */
            promptResume(saved) {
                const titleEl = document.getElementById('coach-title');
                const bodyEl  = document.getElementById('coach-body');
                if (titleEl) titleEl.textContent = 'Welcome back';
                if (!bodyEl) { Coach.go(0); return; }

                bodyEl.innerHTML = '';

                const msg = mkEl('p', {
                    style: 'margin-bottom:10px;font-size:0.9rem;',
                    textContent: 'You have an unfinished design. Would you like to pick up where you left off?'
                });
                bodyEl.appendChild(msg);

                // coach-row gives its .btn children equal width (flex:1 1 0),
                // matching every other button row in the helper.
                const btnRow = mkEl('div', { className: 'coach-row coach-row-2' });

                const resumeBtn = mkEl('button', { type: 'button', className: 'btn btn-primary btn-sm', textContent: 'Resume' });
                resumeBtn.addEventListener('click', function() {
                    Coach.persist.resume(saved);
                });

                const freshBtn = mkEl('button', { type: 'button', className: 'btn btn-sm coach-btn-yellow', textContent: 'Start fresh' });
                freshBtn.addEventListener('click', function() {
                    Coach.persist.clear();
                    Coach.go(0);
                });

                btnRow.appendChild(resumeBtn);
                btnRow.appendChild(freshBtn);
                bodyEl.appendChild(btnRow);
            },

            /* Restore canvas + state from a saved payload */
            resume(saved) {
                canvas.loadFromJSON(saved.canvasJSON, function() {
                    Coach.reapplyMaterials();
                    Coach.reapplyFixtureLocks();
                    Coach.reapplyImportedStrokes();
                    Coach.reapplyCountryToBack();
                    Coach.state = Object.assign({}, Coach.state, saved.state || {});
                    Coach.resolveHolder();
                    Coach.refreshEngraveColors();
                    Coach.reapplyAspectLock();
                    canvas.renderAll();
                    // Frame the restored design — resumed projects often load
                    // partially off-screen otherwise.
                    if (typeof resetZoom === 'function') resetZoom();
                    const savedStep = typeof saved.step === 'number' ? saved.step : 0;
                    // Mark every step up to where they left off as visited, and the
                    // ones they advanced past (Next pressed) as done.
                    for (let i = 0; i <= savedStep; i++) Coach.visited.add(i);
                    for (let i = 0; i < savedStep; i++) Coach.completed.add(i);
                    Coach.go(savedStep);
                });
            }
        };

        /* ── Coach.reapplyMaterials ──────────────────────────────────── */
        Coach.reapplyMaterials = function() {
            if (!cv()) return;
            // Non-imported first (these may cascade flat colours onto contained objects)...
            canvas.getObjects().forEach(function(obj) {
                if (obj.materialType && obj.materialType !== 'color' &&
                    obj.shapeType !== 'imported' && typeof applyFill === 'function') {
                    applyFill(obj, obj.materialType);
                }
            });
            // ...then imported wood LAST so the texture isn't stomped by a cascade.
            canvas.getObjects().forEach(function(obj) {
                if (obj.materialType && obj.materialType !== 'color' && obj.shapeType === 'imported') {
                    Coach.applyWoodToImported(obj, obj.materialType);
                }
            });
            canvas.requestRenderAll();
        };

        /* ── Coach.applyWoodToImported ───────────────────────────────────
           Imported SVG vectors are groups with transparent fills, so the engine's
           applyFill only recolours their stroke for wood finishes — leaving them a
           flat colour with no texture (integrated outlines get the wood pattern
           because applyFill fills standalone shapes directly). This forces the wood
           pattern onto imported vectors (and every child of grouped imports) so they
           match integrated outlines. No-op for the 'color' finish. */
        Coach.applyWoodToImported = function(obj, fillType) {
            if (!obj || !fillType || fillType === 'color') return;
            // Resolve a wood Pattern without depending on the engine's `woodPatterns`
            // binding being reachable from this script — fall back to a Coach-local cache.
            let pat = null;
            try { if (typeof woodPatterns !== 'undefined' && woodPatterns) pat = woodPatterns[fillType]; } catch (e) {}
            if (!pat) {
                Coach._woodCache = Coach._woodCache || {};
                if (!Coach._woodCache[fillType] && typeof createWoodPattern === 'function') {
                    Coach._woodCache[fillType] = new fabric.Pattern({
                        source: createWoodPattern(fillType),
                        repeat: 'repeat'
                    });
                    try { if (typeof woodPatterns !== 'undefined' && woodPatterns) woodPatterns[fillType] = Coach._woodCache[fillType]; } catch (e) {}
                }
                pat = Coach._woodCache[fillType];
            }
            if (!pat) return;
            const fillOne = function(o) {
                if (o.type === 'text' || o.type === 'i-text') return;
                o.set('fill', pat);
                o.dirty = true;          // invalidate the object cache so the texture repaints
                o.materialType = fillType;
            };
            if (obj.type === 'group' && typeof obj.forEachObject === 'function') {
                obj.forEachObject(fillOne);
            } else {
                fillOne(obj);
            }
            obj.dirty = true;
            obj.materialType = fillType;
            obj.setCoords();
            if (cv()) canvas.requestRenderAll();
        };

        /* ── Coach.reapplyFixtureLocks ───────────────────────────────────
           Fabric doesn't serialise the lock/control flags, so restore them on
           loaded fixture holes after a resume. */
        Coach.reapplyFixtureLocks = function() {
            if (!cv()) return;
            canvas.getObjects().forEach(function(obj) {
                if (obj.shapeType === 'fixture') {
                    obj.set({
                        hasControls: false,
                        lockScalingX: true,
                        lockScalingY: true,
                        lockUniScaling: true,
                        lockRotation: true
                    });
                    obj.setCoords();
                }
            });
            canvas.requestRenderAll();
        };

        /* ── Coach.normalizeImportedStroke ───────────────────────────────
           Imported SVG vectors get a thin 0.07 (uniform) outline — the hairline
           cut line laser cutters expect. Applies to the object and, for grouped
           imports, every child path. A stroke colour is added only when the path
           has none, so a 0.07 line is actually visible. */
        Coach.normalizeImportedStroke = function(obj) {
            if (!obj) return;
            const apply = function(o) {
                const noStroke = !o.stroke || o.stroke === 'transparent' || o.stroke === 'none';
                o.set({
                    strokeWidth: 0.07,
                    strokeUniform: true,
                    stroke: noStroke ? '#000000' : o.stroke
                });
            };
            if (obj.type === 'group' && typeof obj.forEachObject === 'function') {
                obj.forEachObject(apply);
                obj.set({ strokeWidth: 0.07, strokeUniform: true });
            } else {
                apply(obj);
            }
            obj.setCoords();
        };

        /* ── Coach.reapplyImportedStrokes ────────────────────────────────
           Re-thin every imported vector after a resume (loadFromJSON keeps the
           saved stroke width, which we want overridden back to 0.07). */
        Coach.reapplyImportedStrokes = function() {
            if (!cv()) return;
            canvas.getObjects().forEach(function(obj) {
                if (obj.shapeType === 'imported') Coach.normalizeImportedStroke(obj);
            });
            canvas.requestRenderAll();
        };

        /* ── Coach.reapplyCountryToBack ──────────────────────────────────
           Keep the BASE-shape country on the bottom layer after a resume. Only
           the holder country (coachHolderId 'holder') is sent back — countries
           added as step-7 personalization or by a template stay where they are. */
        Coach.reapplyCountryToBack = function() {
            if (!cv()) return;
            canvas.getObjects()
                .filter(function(o) { return o.shapeType === 'country' && o.coachHolderId === 'holder'; })
                .forEach(function(o) { canvas.sendToBack(o); });
            canvas.requestRenderAll();
        };

        /* ── Coach.countOutlines ─────────────────────────────────────────
           How many separate outlines live inside ONE loaded object: the number
           of child objects in a group, or the number of subpaths (M/m commands)
           in a compound fabric.Path. 1 (or 0) means nothing to reduce. */
        Coach.countOutlines = function(obj) {
            if (!obj) return 0;
            if (obj.type === 'group' && typeof obj.getObjects === 'function') {
                return obj.getObjects().length;
            }
            if (obj.type === 'path' && Array.isArray(obj.path)) {
                let n = 0;
                obj.path.forEach(function(cmd) {
                    const c = cmd && cmd[0];
                    if (c === 'M' || c === 'm') n++;
                });
                return n;
            }
            return 1;
        };

        /* ── Coach._splitSubpaths ────────────────────────────────────────
           Split a fabric.Path command array into one array per subpath (each
           subpath starts at an M/m command). */
        Coach._splitSubpaths = function(pathArr) {
            const subs = [];
            let cur = null;
            pathArr.forEach(function(cmd) {
                const c = cmd && cmd[0];
                if (c === 'M' || c === 'm') {
                    if (cur && cur.length) subs.push(cur);
                    cur = [cmd];
                } else {
                    if (!cur) cur = [];
                    cur.push(cmd);
                }
            });
            if (cur && cur.length) subs.push(cur);
            return subs;
        };

        /* ── Coach.reduceToLargestOutline ────────────────────────────────
           Keep only the largest outline inside a single loaded object, dropping
           the smaller ones. Handles a compound fabric.Path (rebuilds it from the
           biggest subpath, preserving on-canvas position/scale/style) and a group
           (removes all but the biggest child). Returns true if it reduced. */
        Coach.reduceToLargestOutline = function(obj) {
            if (!obj || !cv()) return false;

            // Group: keep the largest child.
            if (obj.type === 'group' && typeof obj.getObjects === 'function') {
                const kids = obj.getObjects().slice();
                if (kids.length <= 1) return false;
                let best = kids[0], bestA = -1;
                kids.forEach(function(c) {
                    const a = (c.width || 0) * (c.height || 0);
                    if (a > bestA) { bestA = a; best = c; }
                });
                kids.forEach(function(c) {
                    if (c !== best) {
                        if (typeof obj.removeWithUpdate === 'function') obj.removeWithUpdate(c);
                        else obj.remove(c);
                    }
                });
                obj.setCoords();
                canvas.requestRenderAll();
                engineSave();
                return true;
            }

            // Compound path: keep the largest subpath.
            if (obj.type === 'path' && Array.isArray(obj.path)) {
                const subs = Coach._splitSubpaths(obj.path);
                if (subs.length <= 1) return false;
                const toStr = function(cmds) { return cmds.map(function(c) { return c.join(' '); }).join(' '); };

                let bestStr = null, bestArea = -1;
                subs.forEach(function(sub) {
                    const t = new fabric.Path(toStr(sub));
                    const a = (t.width || 0) * (t.height || 0);
                    if (a > bestArea) { bestArea = a; bestStr = toStr(sub); }
                });
                if (!bestStr) return false;

                const tmp = new fabric.Path(bestStr);
                // Shift so the kept subpath stays exactly where it is on canvas
                // (left/top are world coords of the origin, so add a world-space delta).
                const sx = obj.scaleX || 1, sy = obj.scaleY || 1;
                const lx = (tmp.pathOffset.x - obj.pathOffset.x) * sx;
                const ly = (tmp.pathOffset.y - obj.pathOffset.y) * sy;
                const rad = (typeof fabric.util !== 'undefined' && fabric.util.degreesToRadians)
                    ? fabric.util.degreesToRadians(obj.angle || 0)
                    : ((obj.angle || 0) * Math.PI / 180);
                const cos = Math.cos(rad), sin = Math.sin(rad);

                const newPath = new fabric.Path(bestStr, {
                    left:          obj.left + (lx * cos - ly * sin),
                    top:           obj.top  + (lx * sin + ly * cos),
                    originX:       obj.originX,
                    originY:       obj.originY,
                    scaleX:        sx,
                    scaleY:        sy,
                    angle:         obj.angle,
                    fill:          obj.fill,
                    stroke:        obj.stroke,
                    strokeWidth:   obj.strokeWidth,
                    strokeUniform: obj.strokeUniform,
                    fillRule:      obj.fillRule,
                    paintFirst:    obj.paintFirst,
                    opacity:       obj.opacity
                });
                ['shapeType', 'coachHolderId', 'materialType', 'realWidth', 'realHeight'].forEach(function(k) {
                    if (obj[k] !== undefined) newPath[k] = obj[k];
                });

                const wasActive = canvas.getActiveObject() === obj;
                const wasHolder = Coach.state.holderObj === obj;
                canvas.remove(obj);
                canvas.add(newPath);
                if (wasHolder) Coach.state.holderObj = newPath;
                if (wasActive) canvas.setActiveObject(newPath);
                newPath.setCoords();
                canvas.requestRenderAll();
                engineSave();
                return true;
            }

            return false;
        };

        /* ── Coach.importedSiblings ──────────────────────────────────────
           Other 'imported' objects on the canvas besides `h`. A multi-element
           SVG import creates these: the engine adds each SVG element as its
           own object, and the step-2 holder capture keeps only the first. */
        Coach.importedSiblings = function(h) {
            if (!h || h.shapeType !== 'imported' || !cv()) return [];
            return canvas.getObjects().filter(o => o !== h && o.shapeType === 'imported');
        };

        /* ── Coach.reduceHolderOutlines ──────────────────────────────────
           "Clean up outline" on the holder — two layers of cleanup:
           1. Multi-element SVG import → keep the largest imported object as
              the holder and remove its siblings.
           2. Compound path / group → keep only the largest outline inside
              the kept object (reduceToLargestOutline). */
        Coach.reduceHolderOutlines = function() {
            let h = Coach.state.holderObj;
            if (!h || !cv()) return false;
            const sibs = Coach.importedSiblings(h);
            if (sibs.length) {
                const area = o => o.getScaledWidth() * o.getScaledHeight();
                const best = sibs.concat(h).reduce((a, b) => (area(b) > area(a) ? b : a));
                sibs.concat(h).forEach(o => { if (o !== best) canvas.remove(o); });
                if (best !== h) {
                    best.coachHolderId = 'holder';
                    Coach.state.holderObj = best;
                    h = best;
                }
                canvas.setActiveObject(h);
                canvas.requestRenderAll();
                engineSave();
            }
            return Coach.reduceToLargestOutline(h) || sibs.length > 0;
        };

        /* ── Coach engraving colour ──────────────────────────────────────
           Recolour an image or text object to the engraving colour, which
           depends on the holder material: BROWN (#5c3316) on wood, LIGHT GREY
           on plastic. Images are desaturated to greyscale then tinted (so the
           monochrome lightness still tracks the original); text just gets its
           fill set. Tagged with _coachEngrave so the look survives a resume and
           the toggle/label stays in sync. */
        Coach.ENGRAVE_BROWN = '#5c3316';
        Coach.ENGRAVE_GREY  = '#bfbfbf';
        Coach.ENGRAVE_ALPHA = 0.6;  // how strongly the engrave hue replaces the grey
        Coach.ENGRAVE_WHITE_DIST = 0.15; // white-cutout tolerance (0–1): white & near-white go transparent

        // Brown when engraving on wood, light grey when engraving on plastic.
        Coach.engraveColor = function() {
            const mat = (Coach.state.holderObj && Coach.state.holderObj.materialType) || Coach.state.material;
            return (mat && mat !== 'color') ? Coach.ENGRAVE_BROWN : Coach.ENGRAVE_GREY;
        };

        Coach._isEngraveFilter = function(f) {
            if (!f) return false;
            if (f._coachEngrave) return true;
            if (f.type === 'Grayscale') return true;
            if (f.type === 'BlendColor' && f.color) {
                const c = String(f.color).toLowerCase();
                if (c === Coach.ENGRAVE_BROWN || c === Coach.ENGRAVE_GREY) return true;
            }
            return false;
        };

        Coach.isEngraved = function(obj) {
            if (!obj) return false;
            if (obj.type === 'image') {
                return Array.isArray(obj.filters) && obj.filters.some(Coach._isEngraveFilter);
            }
            if (obj.type === 'text' || obj.type === 'i-text') return !!obj._coachEngrave;
            // Shapes / groups (e.g. a filled country outline) carry the flag too.
            return !!obj._coachEngrave;
        };

        Coach.applyEngrave = function(obj, on) {
            if (!obj) return;
            const color = Coach.engraveColor();
            if (obj.type === 'image') {
                if (typeof fabric === 'undefined' || !fabric.Image || !fabric.Image.filters ||
                    !fabric.Image.filters.BlendColor || !fabric.Image.filters.Grayscale) return;
                obj.filters = (obj.filters || []).filter(function(f) { return !Coach._isEngraveFilter(f); });
                if (on) {
                    // White (and near-white) areas wouldn't be engraved, so cut them
                    // out to transparent first, then greyscale + tint what remains.
                    if (fabric.Image.filters.RemoveColor) {
                        const cut = new fabric.Image.filters.RemoveColor({
                            color: '#ffffff',
                            distance: Coach.ENGRAVE_WHITE_DIST
                        });
                        cut._coachEngrave = true;
                        obj.filters.push(cut);
                    }
                    const gray = new fabric.Image.filters.Grayscale();
                    gray._coachEngrave = true;
                    const tint = new fabric.Image.filters.BlendColor({ color: color, mode: 'tint', alpha: Coach.ENGRAVE_ALPHA });
                    tint._coachEngrave = true;
                    obj.filters.push(gray, tint);
                    obj._coachEngrave = true;
                } else {
                    obj._coachEngrave = false;
                }
                obj.applyFilters();
            } else if (obj.type === 'text' || obj.type === 'i-text') {
                if (on) {
                    if (obj._coachOrigFill === undefined) obj._coachOrigFill = obj.fill;
                    obj.set('fill', color);
                    obj._coachEngrave = true;
                } else {
                    obj.set('fill', (obj._coachOrigFill !== undefined ? obj._coachOrigFill : '#000000'));
                    obj._coachEngrave = false;
                }
            } else {
                // Shapes / groups (e.g. a filled country outline) — recolour the
                // fill so it tracks the holder material (brown on wood, grey on
                // plastic). Groups recolour every non-text child path.
                const recolor = function(o) {
                    if (!o || o.type === 'text' || o.type === 'i-text') return;
                    if (o._coachOrigFill === undefined) o._coachOrigFill = o.fill;
                    o.set('fill', on ? color : (o._coachOrigFill !== undefined ? o._coachOrigFill : o.fill));
                };
                if (obj.type === 'group' && typeof obj.forEachObject === 'function') {
                    recolor(obj);
                    obj.forEachObject(recolor);
                } else {
                    recolor(obj);
                }
                obj._coachEngrave = !!on;
            }
            obj.dirty = true;
            if (cv()) canvas.requestRenderAll();
            engineSave();
            // If the engraved object is selected, refresh the right panel so the
            // "Colour" control reflects its new (engrave) fill straight away.
            if (typeof updatePropertiesPanel === 'function' &&
                cv() && canvas.getActiveObject() === obj) {
                updatePropertiesPanel();
            }
        };

        // After a material change (brown↔grey) re-tint everything already engraved.
        Coach.refreshEngraveColors = function() {
            if (!cv()) return;
            canvas.getObjects().forEach(function(o) {
                if (Coach.isEngraved(o)) Coach.applyEngrave(o, true);
            });
        };

        /* ── Coach.bendText ──────────────────────────────
           Bend single-line text into an arc, baked to a vector path with
           opentype (the same engine the SVG export uses, so the canvas and
           the exported file match exactly). amount −100…100 maps to an arc
           of up to ±180°; the radius follows from text length and angle;
           amount 0 restores an editable text object. The path carries
           bendSourceText / bendFontFamily / bendAmount / realFontSize so the
           bend stays adjustable after duplicate, save and resume. Engrave
           state carries over (a bent path recolours via applyEngrave's
           shape branch). Returns the replacement object, or null. */
        Coach.BEND_MAX_RAD = Math.PI; // |amount| = 100 → a 180° arc
        Coach.bendText = async function(obj, amount) {
            if (!obj || !cv() || typeof loadFont !== 'function' || typeof fabric === 'undefined') return null;
            const isText = obj.type === 'text' || obj.type === 'i-text';
            const isBent = obj.shapeType === 'bentText';
            if (!isText && !isBent) return null;
            const srcText = isText ? (obj.text || '') : (obj.bendSourceText || '');
            if (!srcText.trim() || srcText.indexOf('\n') !== -1) return null; // single-line only
            amount = Math.max(-100, Math.min(100, Math.round(amount || 0)));
            if (amount === (isBent ? (obj.bendAmount || 0) : 0)) return obj; // no change
            const fontFamily = isText ? (obj.fontFamily || 'Roboto') : (obj.bendFontFamily || 'Roboto');
            const realFontSize = obj.realFontSize || 24;
            const scale = canvas.scale || 1;
            const centre = obj.getCenterPoint();
            const keep = {
                angle: obj.angle || 0,
                fill: obj.fill,
                materialType: obj.materialType || 'color',
                engraved: obj._coachEngrave,
                origFill: obj._coachOrigFill
            };

            let next;
            if (amount === 0) {
                // Straighten: back to an ordinary editable text object.
                // Fabric caches character widths per font family; if the family
                // was ever measured before the web font finished loading (e.g.
                // during a project resume), the cached widths are the fallback
                // font's — the bounding box comes out shorter than the glyphs
                // and the editing cursor lands in the wrong place. Load the
                // font, drop the stale cache, THEN measure.
                if (typeof document !== 'undefined' && document.fonts && document.fonts.load) {
                    try { await document.fonts.load('16px "' + fontFamily + '"'); } catch (e) { /* best effort */ }
                }
                if (fabric.util && typeof fabric.util.clearFabricFontCache === 'function') {
                    fabric.util.clearFabricFontCache(fontFamily);
                }
                next = new fabric.IText(srcText, {
                    fontSize: realFontSize * scale,
                    fill: keep.fill,
                    fontFamily: fontFamily,
                    originX: 'center',
                    originY: 'center'
                });
                next.shapeType = 'text';
            } else {
                const font = await loadFont(fontFamily);
                const sizePx = realFontSize * scale;
                const theta = (amount / 100) * Coach.BEND_MAX_RAD; // signed arc angle
                const chars = srcText.split('');
                const adv = chars.map(function(ch) { return font.getAdvanceWidth(ch, sizePx); });
                const total = adv.reduce(function(a, b) { return a + b; }, 0);
                if (!total) return null;
                const R = total / Math.abs(theta); // radius from text length + angle
                const s = theta > 0 ? 1 : -1;      // +: arch up (∩), −: curve down (∪)
                // Each character's baseline midpoint sits on the arc, rotated to
                // the local tangent; glyph outlines are transformed point-by-point
                // into one combined path (canvas y grows downward).
                const parts = [];
                let run = 0;
                for (let i = 0; i < chars.length; i++) {
                    const half = adv[i] / 2;
                    const mid = run + half;
                    run += adv[i];
                    if (!chars[i].trim()) continue; // spaces contribute advance only
                    const phi = (mid / total - 0.5) * Math.abs(theta);
                    const rot = s * phi;
                    const cosr = Math.cos(rot), sinr = Math.sin(rot);
                    const px = R * Math.sin(phi);
                    const py = s * R * (1 - Math.cos(phi));
                    font.getPath(chars[i], 0, 0, sizePx).commands.forEach(function(c) {
                        const t = { type: c.type };
                        ['', '1', '2'].forEach(function(suf) {
                            const xk = 'x' + suf, yk = 'y' + suf;
                            if (c[xk] === undefined) return;
                            const dx = c[xk] - half, dy = c[yk];
                            t[xk] = px + dx * cosr - dy * sinr;
                            t[yk] = py + dx * sinr + dy * cosr;
                        });
                        parts.push(t);
                    });
                }
                const d = parts.map(function(c) {
                    const f = function(n) { return n.toFixed(2); };
                    switch (c.type) {
                        case 'M': return 'M' + f(c.x) + ' ' + f(c.y);
                        case 'L': return 'L' + f(c.x) + ' ' + f(c.y);
                        case 'C': return 'C' + f(c.x1) + ' ' + f(c.y1) + ' ' + f(c.x2) + ' ' + f(c.y2) + ' ' + f(c.x) + ' ' + f(c.y);
                        case 'Q': return 'Q' + f(c.x1) + ' ' + f(c.y1) + ' ' + f(c.x) + ' ' + f(c.y);
                        default: return 'Z';
                    }
                }).join(' ');
                if (!d) return null;
                next = new fabric.Path(d, {
                    fill: keep.fill,
                    originX: 'center',
                    originY: 'center'
                });
                next.shapeType = 'bentText';
                next.bendSourceText = srcText;
                next.bendFontFamily = fontFamily;
                next.bendAmount = amount;
            }
            next.set({ left: centre.x, top: centre.y, angle: keep.angle });
            next.realFontSize = realFontSize;
            next.materialType = keep.materialType;
            if (keep.engraved !== undefined) next._coachEngrave = keep.engraved;
            if (keep.origFill !== undefined) next._coachOrigFill = keep.origFill;
            next.setCoords();
            canvas.remove(obj);
            canvas.add(next);
            canvas.setActiveObject(next);
            if (typeof Coach.raiseCoinsToFront === 'function') Coach.raiseCoinsToFront();
            canvas.requestRenderAll();
            engineSave();
            return next;
        };

        /* ── Coach.editBentText ──────────────────────────
           Double-clicking bent text edits it like normal text: straighten it
           to an editable object (remembering the bend), enter inline editing,
           and re-bake with the new content once editing ends. Emptied text
           stays straight (bendText refuses an empty bake). */
        Coach.editBentText = function(obj) {
            if (!obj || obj.shapeType !== 'bentText' || !cv()) return;
            const rebendTo = obj.bendAmount || 0;
            Coach.bendText(obj, 0).then(function(text) {
                if (!text || typeof text.enterEditing !== 'function') return;
                canvas.setActiveObject(text);
                text.enterEditing();
                text.selectAll();
                canvas.requestRenderAll();
                const onExit = function() {
                    text.off('editing:exited', onExit);
                    Coach.bendText(text, rebendTo);
                };
                text.on('editing:exited', onExit);
            }).catch(function(err) {
                console.warn('editBentText failed', err);
            });
        };


        /* ── Aspect-ratio lock (per object) ────────────────────────────────
           Each object remembers its own lock state in obj.coachAspectLocked
           (default = locked). When locked, the object's middle (side) resize
           handles are hidden so dragging is corner-only, and the canvas's
           uniformScaling is set to match the active object so corner drags stay
           proportional. The right-panel button reflects whichever object is
           selected; the step-2 left button reflects the holder.

           Not every object gets the option:
             • coins (shapeType 'currency') — a coin is a coin, always uniform,
               no toggle. EXCEPTION: pressed pennies (currencyType 'pressed') are
               elliptical, so they keep the toggle.
             • fixtures — size is locked entirely, so no toggle and no controls
               change here.
             • multi-selections — no single state, so no toggle. */
        Coach.aspectEligible = function(obj) {
            if (!obj) return false;
            if (obj.type === 'activeSelection') return false;
            if (obj.shapeType === 'fixture') return false;
            if (obj.shapeType === 'currency') return obj.currencyType === 'pressed';
            return true;
        };

        // Default is locked: only an explicit false counts as unlocked.
        Coach.isAspectLocked = function(obj) {
            return !obj || obj.coachAspectLocked !== false;
        };

        // The proportionality a given object should actually enforce: eligible
        // objects follow their own flag; coins (non-pressed) are always uniform;
        // anything else (e.g. fixtures) is left alone.
        Coach._effectiveLock = function(obj) {
            if (!obj) return true;
            if (Coach.aspectEligible(obj)) return Coach.isAspectLocked(obj);
            if (obj.shapeType === 'currency') return true; // a coin is a coin
            return true;
        };

        // Apply an object's lock to its resize handles (hide the side handles
        // when locked → corner-only). Fixtures are skipped (already non-resizable).
        Coach.applyAspectToObject = function(obj) {
            if (!obj || obj.type === 'activeSelection') return;
            if (obj.shapeType === 'fixture') return;
            if (typeof obj.setControlsVisibility !== 'function') return;
            const locked = Coach._effectiveLock(obj);
            obj.setControlsVisibility({ mt: !locked, mb: !locked, ml: !locked, mr: !locked });
            obj.setCoords();
        };

        Coach.setObjectAspectLock = function(obj, locked) {
            if (!obj) return;
            obj.coachAspectLocked = !!locked;
            Coach.applyAspectToObject(obj);
            if (cv()) {
                // Corner-drag proportionality follows the active object's lock.
                if (canvas.getActiveObject() === obj) canvas.uniformScaling = !!locked;
                canvas.requestRenderAll();
            }
            Coach._syncAspectButtons();
            engineSave();
        };

        // Toggle the lock on the currently-selected object (right-panel button).
        Coach.toggleSelectedAspectLock = function() {
            if (!cv()) return;
            const obj = canvas.getActiveObject();
            if (!obj || !Coach.aspectEligible(obj)) return;
            Coach.setObjectAspectLock(obj, !Coach.isAspectLocked(obj));
        };

        // Toggle the lock on the holder (step-2 left button).
        Coach.toggleHolderAspectLock = function() {
            if (!Coach.state.holderObj && typeof Coach.resolveHolder === 'function') Coach.resolveHolder();
            const h = Coach.state.holderObj;
            if (!h) return;
            Coach.setObjectAspectLock(h, !Coach.isAspectLocked(h));
            if (typeof Coach.render === 'function') Coach.render(); // refresh holder step (shows/hides height input)
        };

        // Back-compat wrapper used by holder-creation code paths.
        Coach.setHolderAspectLock = function(locked) {
            if (!Coach.state.holderObj && typeof Coach.resolveHolder === 'function') Coach.resolveHolder();
            if (Coach.state.holderObj) Coach.setObjectAspectLock(Coach.state.holderObj, locked);
        };

        // Sync selection → uniformScaling + controls + buttons. Called on every
        // selection change so the right-panel button matches the chosen object.
        Coach.onAspectSelect = function() {
            if (!cv()) return;
            const obj = canvas.getActiveObject();
            if (obj && obj.type !== 'activeSelection') {
                canvas.uniformScaling = Coach._effectiveLock(obj);
                Coach.applyAspectToObject(obj);
            } else {
                canvas.uniformScaling = true; // safe default for none / multi-select
            }
            Coach._syncAspectButtons();
        };

        // Re-apply every object's controls (after a resume).
        Coach.reapplyAspectLock = function() {
            if (!cv()) return;
            canvas.getObjects().forEach(function(o) { Coach.applyAspectToObject(o); });
            canvas.uniformScaling = true;
            Coach._syncAspectButtons();
        };

        Coach._syncAspectButtons = function() {
            // Right-panel button reflects the active object (hidden when the object
            // isn't eligible — coins/fixtures/multi-select).
            const right = document.getElementById('coach-aspect-right');
            if (right) {
                const obj = cv() ? canvas.getActiveObject() : null;
                if (obj && Coach.aspectEligible(obj)) {
                    const locked = Coach.isAspectLocked(obj);
                    right.style.display = '';
                    right.textContent = locked ? '🔒 Keep proportions' : '🔓 Resize freely';
                    right.setAttribute('aria-pressed', locked ? 'true' : 'false');
                } else {
                    right.style.display = 'none';
                }
            }
            // Step-2 left button reflects the holder object.
            const left = document.getElementById('coach-aspect-left');
            if (left) {
                const locked = Coach.isAspectLocked(Coach.state.holderObj);
                left.textContent = locked ? '🔒 Keep proportions' : '🔓 Resize freely';
                left.setAttribute('aria-pressed', locked ? 'true' : 'false');
            }
        };

        /* ── Coach.updateActionButtons ────────────────────────────────
           The right-panel "Start Over" and "Download as SVG" actions are only
           meaningful once the canvas has something on it — disable them while it's
           empty. Called on add/remove and after boot/resume. */
        Coach.updateActionButtons = function() {
            if (!cv()) return;
            const has = canvas.getObjects().length > 0;
            ['clearBtn', 'downloadBtn', 'saveProjectBtn', 'coachQuoteBtn'].forEach(function(id) {
                const b = document.getElementById(id);
                if (b) b.disabled = !has;
            });
        };

        /* ── Coach.fitIfNeeded ────────────────────────────────────────
           Run "Fit to screen" only when something has drifted outside the
           visible canvas (e.g. coins pushed above the holder). Uses each
           object's screen-space bounding rect so the test respects the
           current zoom/pan. */
        Coach.fitIfNeeded = function() {
            if (!cv() || typeof resetZoom !== 'function') return;
            const objs = canvas.getObjects();
            if (!objs.length) return;
            const vw = canvas.getWidth();
            const vh = canvas.getHeight();
            for (let i = 0; i < objs.length; i++) {
                const r = objs[i].getBoundingRect(); // screen coords (includes viewport transform)
                if (r.left < 0 || r.top < 0 || r.left + r.width > vw || r.top + r.height > vh) {
                    resetZoom();
                    return;
                }
            }
        };

        /* ── Coach.requestQuote ───────────────────────────────────────
           Open the quote form and pre-fill it from the Coach state. Shared by
           the right-panel "Request a quote" button and the Review step. */
        Coach.requestQuote = async function() {
            if (typeof showQuoteForm !== 'function') return;
            await showQuoteForm();
            const pn = document.getElementById('projectName');
            if (pn && !pn.value) {
                pn.value = Coach.state.projectName
                    || ((Coach.state.occasion ? Coach.state.occasion + ' ' : '') + 'coin holder');
            }
            const notes = document.getElementById('userNotes');
            if (notes && Coach.state.occasion && notes.value.indexOf(Coach.state.occasion) === -1) {
                notes.value = (notes.value ? notes.value + '\n' : '') + 'Occasion: ' + Coach.state.occasion;
            }
            const matSel = document.getElementById('preferredMaterial');
            const chosenMat = (Coach.state.holderObj && Coach.state.holderObj.materialType) || Coach.state.material;
            if (matSel && chosenMat) {
                // 'color' is plastic → the form's Acrylic / Plastic option ("acrylic")
                matSel.value = (chosenMat === 'color') ? 'acrylic' : chosenMat;
            }
        };

        /* ── Coach.resolveHolder ─────────────────────────────────────── */
        Coach.resolveHolder = function() {
            if (!cv()) return;
            const objs = canvas.getObjects();

            // Primary: look for the stamped coachHolderId
            let holder = objs.find(function(o) { return o.coachHolderId === 'holder'; }) || null;

            // Fallback: largest non-coin object by scaled area
            if (!holder) {
                let maxArea = -1;
                objs.forEach(function(o) {
                    if (o.shapeType === 'currency') return;
                    const area = o.getScaledWidth() * o.getScaledHeight();
                    if (area > maxArea) { maxArea = area; holder = o; }
                });
            }

            Coach.state.holderObj = holder || null;
        };

        /* ── Coach.sizeToHolder ──────────────────────────────────────────
           Scale a freshly-added decorative object (country outline / image)
           to match the holder's size, preserving aspect ratio (contain), and
           centre it on the holder. */
        Coach.sizeToHolder = function(obj, mode) {
            if (!obj || !cv()) return;
            // Make sure we have a current holder reference (and that it isn't the
            // object we're sizing — e.g. a freshly-added full-size image).
            if (!Coach.state.holderObj
                || canvas.getObjects().indexOf(Coach.state.holderObj) === -1
                || Coach.state.holderObj === obj) {
                Coach.resolveHolder();
            }
            let holder = Coach.state.holderObj;
            // resolveHolder may have picked the just-added object — find the largest other.
            if (holder === obj) {
                let maxArea = -1, alt = null;
                canvas.getObjects().forEach(function(o) {
                    if (o === obj || o.shapeType === 'currency') return;
                    const a = o.getScaledWidth() * o.getScaledHeight();
                    if (a > maxArea) { maxArea = a; alt = o; }
                });
                holder = alt;
            }
            if (!holder || holder === obj) return;
            const hw = holder.getScaledWidth();
            const hh = holder.getScaledHeight();
            const ow = obj.getScaledWidth();
            const oh = obj.getScaledHeight();
            if (!hw || !hh || !ow || !oh) return;
            // 'height' → match the holder's height (aspect preserved); default → contain in both.
            const factor = (mode === 'height') ? (hh / oh) : Math.min(hw / ow, hh / oh);
            obj.scaleX *= factor;
            obj.scaleY *= factor;
            const c = holder.getCenterPoint();
            obj.setPositionByOrigin(new fabric.Point(c.x, c.y), 'center', 'center');
            obj.setCoords();
            canvas.requestRenderAll();
            engineSave();
        };

        /* ── Coach.raiseCoinsToFront ─────────────────────────────────────
           Coins (currency slots) must always sit on top so nothing added
           later — a country shape, an uploaded logo — can cover a slot. Push
           every currency object to the front, preserving their order amongst
           themselves. Cheap to call after any decorative object is added. */
        Coach.raiseCoinsToFront = function() {
            if (!cv()) return;
            canvas.getObjects()
                .filter(function(o) { return o.shapeType === 'currency'; })
                .forEach(function(o) { canvas.bringToFront(o); });
            canvas.requestRenderAll();
        };

        /* ── One-shot object capture ─────────────────────────────────────
           Grab the next object added to the canvas, skipping objects the
           filter rejects (those leave the capture armed). Re-registering a
           slot replaces its previous pending capture, and a 120 s timeout
           disarms it if the picker/creation was cancelled. Slots in use:
           'holder' and 'import' (step 2), 'size' (step 7). */
        Coach.captureNextAdded = function(slot, filter, onCapture) {
            if (!cv()) return;
            Coach.cancelCapture(slot);
            const handler = (e) => {
                const obj = e.target;
                if (obj && filter && !filter(obj)) return; // not ours — stay armed
                Coach.cancelCapture(slot);
                onCapture(obj);
            };
            Coach._captures = Coach._captures || {};
            Coach._captures[slot] = { handler, timeout: setTimeout(() => Coach.cancelCapture(slot), 120000) };
            canvas.on('object:added', handler);
        };
        Coach.cancelCapture = function(slot) {
            const c = Coach._captures && Coach._captures[slot];
            if (!c) return;
            clearTimeout(c.timeout);
            if (cv()) canvas.off('object:added', c.handler);
            Coach._captures[slot] = null;
        };
        Coach.cancelAllCaptures = function() {
            Object.keys(Coach._captures || {}).forEach(s => Coach.cancelCapture(s));
        };

        /* ── Coach.resetSelf ─────────────────────────────────────────────
           Reset ONLY the Coach (state, step, visited, bubble, saved progress).
           Does NOT touch the canvas — callers clear that first. Shared by the
           Coach's own "Start over" and the engine's main "Start Over" button. */
        Coach.resetSelf = function() {
            Coach.persist.clear();
            Coach.cancelAllCaptures(); // pending one-shot captures / timeouts

            Coach.state = {};
            Coach.current = 0;
            Coach.visited = new Set();
            Coach.completed = new Set();
            Coach.go(0);
        };

        /* ── Coach.startOver ─────────────────────────────────────────── */
        Coach.startOver = function() {
            if (!window.confirm('Start over? This clears your current design.')) return;
            // Suppress the wrapped clearCanvas's auto-reset so we reset exactly once.
            Coach._suppressClearReset = true;
            try {
                if (typeof clearCanvas === 'function') {
                    clearCanvas();
                } else if (cv()) {
                    canvas.clear();
                    canvas.backgroundColor = '#ffffff';
                    canvas.requestRenderAll();
                }
            } finally {
                Coach._suppressClearReset = false;
            }
            Coach.resetSelf();
        };

        /* ── Coach._holderDistanceField ───────────────────────────────
           Rasterise the holder silhouette and run a distance transform so we
           can ask "how far inside the real outline is this point?" (canvas px,
           0 = outside). Used to clamp the geometric layouts (grid/rows/circle)
           inside irregular shapes, whose bounding box is much larger than the
           silhouette. Returns null if the mask can't be read. */
        Coach._holderDistanceField = function(holder) {
            if (!cv() || !holder) return null;
            let maskCanvas = null;
            const saved = [];
            const solidify = (o) => {
                saved.push([o, o.fill, o.opacity, o.stroke, o.strokeWidth]);
                o.set({ fill: '#000', opacity: 1, stroke: '#000', strokeWidth: 0 });
            };
            try {
                if (holder.type === 'group') holder.forEachObject(solidify);
                else solidify(holder);
                if (typeof holder.toCanvasElement === 'function') {
                    maskCanvas = holder.toCanvasElement({ enableRetinaScaling: false });
                }
            } catch (e) { maskCanvas = null; }
            saved.forEach(([o, f, op, s, sw]) => o.set({ fill: f, opacity: op, stroke: s, strokeWidth: sw }));
            if (!maskCanvas) return null;

            const br = holder.getBoundingRect(true);
            const W = maskCanvas.width, H = maskCanvas.height;
            const ctx = maskCanvas.getContext('2d');
            let md = null;
            try { md = ctx.getImageData(0, 0, W, H).data; } catch (e) { md = null; }
            if (!md || br.width <= 0 || br.height <= 0 || W <= 1 || H <= 1) return null;

            const pxPerCanvas = W / br.width;
            const SQRT2 = Math.SQRT2, INF = 1e9, N = W * H;
            const dist = new Float32Array(N);
            let sx = 0, sy = 0, c = 0;
            for (let i = 0; i < N; i++) {
                const inside = md[i * 4 + 3] > 40;
                dist[i] = inside ? INF : 0;
                if (inside) { sx += i % W; sy += (i / W) | 0; c++; }
            }
            if (!c) return null;
            for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
                const i = y * W + x; if (dist[i] === 0) continue;
                let m = dist[i];
                if (x > 0)             m = Math.min(m, dist[i - 1] + 1);
                if (y > 0)             m = Math.min(m, dist[i - W] + 1);
                if (x > 0 && y > 0)    m = Math.min(m, dist[i - W - 1] + SQRT2);
                if (x < W - 1 && y > 0) m = Math.min(m, dist[i - W + 1] + SQRT2);
                dist[i] = m;
            }
            for (let y = H - 1; y >= 0; y--) for (let x = W - 1; x >= 0; x--) {
                const i = y * W + x; if (dist[i] === 0) continue;
                let m = dist[i];
                if (x < W - 1)             m = Math.min(m, dist[i + 1] + 1);
                if (y < H - 1)             m = Math.min(m, dist[i + W] + 1);
                if (x < W - 1 && y < H - 1) m = Math.min(m, dist[i + W + 1] + SQRT2);
                if (x > 0 && y < H - 1)     m = Math.min(m, dist[i + W - 1] + SQRT2);
                dist[i] = m;
            }
            return {
                bounds: br,                // holder's absolute bbox in canvas coords
                pxPerCanvas: pxPerCanvas,  // mask px per canvas px (sampling resolution)
                centroid: { x: br.left + (sx / c) / pxPerCanvas, y: br.top + (sy / c) / pxPerCanvas },
                distAt(px, py) {
                    const mx = Math.round((px - br.left) * pxPerCanvas);
                    const my = Math.round((py - br.top) * pxPerCanvas);
                    if (mx < 0 || my < 0 || mx >= W || my >= H) return 0;
                    const idx = my * W + mx;
                    const d = dist[idx];
                    // A still-INF pixel was never reached by the transform because
                    // the holder fills its entire bounding box here (e.g. a plain
                    // rectangle has no transparent border to seed distances from).
                    // If that pixel is itself opaque it's genuinely interior, so
                    // report it as inside rather than mistaking it for outside.
                    if (d >= INF) return md[idx * 4 + 3] > 40 ? (W / pxPerCanvas) : 0;
                    return d / pxPerCanvas;
                }
            };
        };

        /* ── Coach.currentHolder ─────────────────────────────────────────
           Resolve the live holder object, re-resolving if the tracked one is
           gone. Returns null if there's no holder. */
        Coach.currentHolder = function() {
            let holder = Coach.state.holderObj;
            if (!holder || (cv() && canvas.getObjects().indexOf(holder) === -1)) {
                if (typeof Coach.resolveHolder === 'function') Coach.resolveHolder();
                holder = Coach.state.holderObj;
            }
            return holder || null;
        };

        /* ── Coach.holderClipCandidate ───────────────────────────────────
           Is this object one we can trim to the holder? Anything the customer
           adds ON TOP of the base shape — country outlines, uploaded images,
           imported vectors, extra shapes — but NOT the holder itself, coins,
           fixtures, engraving text, or a multi-selection. */
        Coach.holderClipCandidate = function(obj) {
            if (!obj) return false;
            if (obj.type === 'activeSelection') return false;
            if (obj.shapeType === 'currency' || obj.shapeType === 'fixture') return false;
            if (obj.type === 'i-text' || obj.type === 'text') return false;
            if (obj.coachHolderId === 'holder') return false;
            if (Coach.state.holderObj === obj) return false;
            return true;
        };

        /* ── Coach.hasExcessOutside ──────────────────────────────────────
           Does any meaningful part of `obj` fall OUTSIDE the holder's real
           silhouette? Rasterises the object and tests its opaque pixels against
           the holder distance field (>0 = inside). A tiny hairline grazing the
           edge doesn't count — we require >1% of the object's ink to be outside.
           Pass a precomputed `field` to avoid rebuilding it per object. Returns
           false once the object has already been trimmed (`_coachClipped`). */
        Coach.hasExcessOutside = function(obj, field) {
            if (!obj || !cv()) return false;
            if (obj._coachClipped) return false;
            if (!Coach.holderClipCandidate(obj)) return false;
            const holder = Coach.currentHolder();
            if (!holder || holder === obj) return false;

            if (field === undefined) field = Coach._holderDistanceField(holder);
            const hbr = holder.getBoundingRect(true);

            let objCanvas = null;
            try {
                if (typeof obj.toCanvasElement === 'function') {
                    objCanvas = obj.toCanvasElement({ enableRetinaScaling: false });
                }
            } catch (e) { objCanvas = null; }
            const obr = obj.getBoundingRect(true);
            if (!objCanvas || obr.width <= 0 || obr.height <= 0) return false;

            const W = objCanvas.width, H = objCanvas.height;
            const octx = objCanvas.getContext('2d');
            let od = null;
            try { od = octx.getImageData(0, 0, W, H).data; } catch (e) { od = null; }
            if (!od) return false;

            const pxPerCanvas = W / obr.width;                 // object-mask px per canvas px
            const stride = Math.max(1, Math.round(pxPerCanvas * 1.5)); // sample ~1.5 canvas px
            let opaque = 0, outside = 0;
            for (let my = 0; my < H; my += stride) {
                for (let mx = 0; mx < W; mx += stride) {
                    if (od[(my * W + mx) * 4 + 3] <= 40) continue; // transparent
                    opaque++;
                    const px = obr.left + mx / pxPerCanvas;
                    const py = obr.top + my / pxPerCanvas;
                    let inside;
                    if (field) {
                        inside = field.distAt(px, py) > 0;
                    } else {
                        // No silhouette available → fall back to the holder bounding box.
                        inside = px >= hbr.left && px <= hbr.left + hbr.width &&
                                 py >= hbr.top && py <= hbr.top + hbr.height;
                    }
                    if (!inside) outside++;
                }
            }
            if (opaque === 0) return false;
            return outside > 4 && (outside / opaque) > 0.01;
        };

        /* ── Coach.removeExcess ──────────────────────────────────────────
           Trim `obj` to the holder's silhouette by giving it a clipPath that is
           a solid copy of the holder, positioned absolutely (canvas coords) so
           it clips to exactly where the holder sits. Works for outline holders
           too (we solidify the clip so its transparent interior still clips).
           Reversible via Undo. */
        Coach.removeExcess = function(obj) {
            if (!obj || !cv()) return;
            const holder = Coach.currentHolder();
            if (!holder || holder === obj) return;
            holder.clone(function(clip) {
                clip.set({ absolutePositioned: true });
                // Solidify so a transparent-fill (outline) holder still clips its
                // whole interior, not just the stroke.
                const solid = function(o) { o.set({ fill: '#000', opacity: 1, stroke: null, strokeWidth: 0 }); };
                if (clip.type === 'group' && typeof clip.forEachObject === 'function') {
                    clip.forEachObject(solid);
                    solid(clip);
                } else {
                    solid(clip);
                }
                obj.clipPath = clip;
                obj._coachClipped = true;
                obj.dirty = true;
                if (typeof obj.setCoords === 'function') obj.setCoords();
                canvas.requestRenderAll();
                engineSave();
            }, Coach.EXTRA_PROPS);
        };

        /* ── Coach.arrange ────────────────────────────────────────────
           Arranges coins that lie inside the holder's bounding box into
           one of three patterns.  Containment test is axis-aligned bbox
           (good enough for rectangles, circles, ellipses).  Irregular
           shapes (ellipse / country / imported SVG) additionally clamp the
           geometric layouts inside the real silhouette via a distance field. */
        Coach.arrange = function(pattern) {
            // Guard: canvas must exist
            if (!cv()) return false;

            // Holder types recognised by the Coach
            const HOLDER_TYPES = new Set([
                'rectangle', 'circle', 'ellipse',
                'rectangle-outline', 'circle-outline', 'ellipse-outline',
                'country', 'imported'
            ]);

            // Resolve holder object
            let holder = Coach.state.holderObj;
            if (!holder || canvas.getObjects().indexOf(holder) === -1) {
                holder = canvas.getObjects().find(o => HOLDER_TYPES.has(o.shapeType)) || null;
            }
            if (!holder) return false;

            // ALL coin objects regardless of current position — fixes re-arrange after adding coins
            const targets = canvas.getObjects().filter(o => o.shapeType === 'currency');
            if (targets.length === 0) return false;

            // Holder absolute bounding box
            const hc   = holder.getCenterPoint();
            const hw   = holder.getScaledWidth();
            const hh   = holder.getScaledHeight();
            const left = hc.x - hw / 2;
            const top  = hc.y - hh / 2;

            // Cell size based on the largest coin footprint + padding
            let maxFoot = 0;
            targets.forEach(c => { maxFoot = Math.max(maxFoot, c.getScaledWidth(), c.getScaledHeight()); });
            const pad  = maxFoot * 0.15;
            const cell = maxFoot + pad;

            // Keep coins clear of the holder wall: their centres stay at least the
            // largest coin's radius + 4 mm in from the edge (matches the rectangle grid).
            const edgeInset = maxFoot / 2 + 4 * (canvas.scale || 1);
            const usableW   = Math.max(cell, hw - 2 * edgeInset);
            const usableH   = Math.max(cell, hh - 2 * edgeInset);

            // Inside capacity of the holder (within the inset usable area)
            const colsIn = Math.max(1, Math.floor(usableW / cell));
            const rowsIn = Math.max(1, Math.floor(usableH / cell));

            // Helper: place `count` surplus coins on an expanding rectangular perimeter
            // around the holder so they are visible and non-overlapping.
            // Overflow-to-perimeter replaces the old edge-clamping that caused stacking.
            function perimeterPositions(count, rl0, rt0, rw0, rh0, cellSz, centre) {
                const out = [];
                let ring = 1, produced = 0;
                while (produced < count) {
                    const rl = rl0 - ring * cellSz;
                    const rt = rt0 - ring * cellSz;
                    const rw = rw0 + 2 * ring * cellSz;
                    const rh = rh0 + 2 * ring * cellSz;
                    const perim = 2 * (rw + rh);
                    const slots = Math.max(4, Math.floor(perim / cellSz));
                    for (let s = 0; s < slots && produced < count; s++) {
                        const d = (s / slots) * perim;
                        let x, y;
                        if (d < rw)                  { x = rl + d;             y = rt; }
                        else if (d < rw + rh)        { x = rl + rw;            y = rt + (d - rw); }
                        else if (d < 2 * rw + rh)    { x = rl + rw - (d - rw - rh); y = rt + rh; }
                        else                         { x = rl;                 y = rt + rh - (d - 2 * rw - rh); }
                        out.push({ x, y });
                        produced++;
                    }
                    ring++;
                    if (ring > 50) break; // safety
                }
                return out;
            }

            // Fixture holes already on the canvas — coins must keep their edge >= 5 mm
            // from a fixture's centre (mirrors the keep-out used when fixtures are placed).
            const fixtures = canvas.getObjects()
                .filter(o => o.shapeType === 'fixture')
                .map(f => { const c = f.getCenterPoint(); return { x: c.x, y: c.y }; });
            const fixtureClearPx = 5 * (canvas.scale || 1);
            function clearOfFixtures(x, y, rc) {
                for (let i = 0; i < fixtures.length; i++) {
                    if (Math.hypot(fixtures[i].x - x, fixtures[i].y - y) < rc + fixtureClearPx) return false;
                }
                return true;
            }

            // For irregular holders (ellipse / country / imported SVG) the bounding-box
            // grid/rows/circle would drop coins on or over the real edge. We keep the
            // geometric LOOK by generating the pattern's slots across the holder and
            // keeping only those that fall INSIDE the real silhouette (distance field) —
            // NOT by relocating stray coins afterwards, which collapses the pattern onto
            // the outline and makes every layout look like "Fit to shape".
            const IRREGULAR = pattern !== 'shape' && !(
                holder.shapeType === 'rectangle'  || holder.shapeType === 'rectangle-outline' ||
                holder.shapeType === 'circle'     || holder.shapeType === 'circle-outline');
            const field = IRREGULAR ? Coach._holderDistanceField(holder) : null;
            const edgeMarginPx = 4 * (canvas.scale || 1);   // coin edge >= 4 mm inside the outline
            const maxR = maxFoot / 2;
            const insideOK = (x, y, rc) => !field ? true : field.distAt(x, y) >= rc + edgeMarginPx;

            // Build position array — length === targets.length, inside first, perimeter for surplus
            let positions = [];

            if (pattern === 'shape') {
                // Each press rotates which coin is placed first → a fresh pattern every click.
                Coach._fitRot = (Coach._fitRot || 0) + 1;
                // Follow the holder's OUTLINE: inset the silhouette by ~one coin radius and
                // place coins along that contour, then step inward by ~2r for each successive
                // ring (concentric, outline-following). The shared distance field
                // (Coach._holderDistanceField) knows every interior point's distance to the
                // edge, so a "ring" is the set of points at a target inset distance. Coins
                // are placed ordered around the centroid (so they trace the contour) and
                // rejected if they'd overlap.
                const sfield = Coach._holderDistanceField(holder);
                if (sfield) {
                    const br = sfield.bounds;

                    // Per-coin radius (canvas px) — each coin hugs the outline by ITS OWN
                    // radius so the gap to the edge is the same for big and small coins.
                    const coinR = targets.map(c => Math.max(c.getScaledWidth(), c.getScaledHeight()) / 2);
                    const minCoinR = Math.min.apply(null, coinR);
                    const offset = maxFoot * 0.06 + 4 * (canvas.scale || 1);  // edge gap (+4mm further in)
                    const minGapPx = 3 * (canvas.scale || 1);                 // never closer than 3 mm edge-to-edge
                    const gap    = Math.max(maxFoot * 0.06, minGapPx);        // min gap between neighbouring coins
                    const minNeed = minCoinR + offset; // smallest usable inset (smallest coin)

                    // Centroid in canvas coords (for angular ordering)
                    const cxC = sfield.centroid.x;
                    const cyC = sfield.centroid.y;

                    // Candidate sampling step (finer than the smallest coin so rings populate well)
                    const sampleStep = Math.max(2, minCoinR * 0.35);
                    const shell      = Math.max(minCoinR * 0.5, 1); // depth bucket for ordering

                    // Candidates: every inside point that could host at least the smallest coin.
                    // d = distance from the edge (canvas px). Sort outer-first, then by angle so
                    // a coin sweeps around the contour.
                    const candidates = [];
                    for (let py = br.top; py <= br.top + br.height; py += sampleStep) {
                        for (let px = br.left; px <= br.left + br.width; px += sampleStep) {
                            const dCanvas = sfield.distAt(px, py);
                            if (dCanvas < minNeed) continue;
                            candidates.push({
                                x: px, y: py, d: dCanvas, used: false,
                                bucket: Math.floor(dCanvas / shell),
                                ang: Math.atan2(py - cyC, px - cxC)
                            });
                        }
                    }
                    candidates.sort((a, b) => (a.bucket - b.bucket) || (a.ang - b.ang));

                    // Placement order: largest coins first, rotated each press.
                    let order = targets.map((_, i) => i).sort((a, b) => coinR[b] - coinR[a]);
                    if (order.length > 1) {
                        const rot = (Coach._fitRot - 1) % order.length; // 0 on the first press
                        if (rot > 0) order = order.slice(rot).concat(order.slice(0, rot));
                    }
                    const positionsByIndex = new Array(targets.length).fill(null);
                    const placedCoins = [];
                    const isRect = (holder.shapeType === 'rectangle' || holder.shapeType === 'rectangle-outline');

                    if (isRect) {
                        // Rectangle: a centred interior grid, inset from every edge so
                        // coins never touch the sides/corners. Slots are spaced by the
                        // coin footprint + gap (>= 3 mm), fixture-clashing slots skipped.
                        const maxR    = Math.max.apply(null, coinR);
                        const insetPx = maxR + 4 * (canvas.scale || 1); // coin edge >= 4 mm off the wall
                        const cellSz  = maxFoot + gap;
                        const innerW  = Math.max(cellSz, hw - 2 * insetPx);
                        const innerH  = Math.max(cellSz, hh - 2 * insetPx);
                        const maxCols = Math.max(1, Math.floor(innerW / cellSz) + 1);
                        const maxRows = Math.max(1, Math.floor(innerH / cellSz) + 1);
                        const n = targets.length;
                        // Aspect-balanced grid that fills the width, capped to what fits.
                        let cols = Math.max(1, Math.min(maxCols, Math.round(Math.sqrt(n * (innerW / innerH)))));
                        let rows = Math.min(maxRows, Math.ceil(n / cols));
                        const blockW = (cols - 1) * cellSz;
                        const blockH = (rows - 1) * cellSz;
                        const startX = hc.x - blockW / 2;
                        const startY = hc.y - blockH / 2;
                        const slots = [];
                        for (let r = 0; r < rows; r++) {
                            for (let c = 0; c < cols; c++) {
                                slots.push({ x: startX + c * cellSz, y: startY + r * cellSz });
                            }
                        }
                        const usedSlot = new Array(slots.length).fill(false);
                        const overflow = [];
                        for (let oi = 0; oi < order.length; oi++) {
                            const idx = order[oi];
                            const rc = coinR[idx];
                            let chosen = -1;
                            for (let s = 0; s < slots.length; s++) {
                                if (usedSlot[s]) continue;
                                if (!clearOfFixtures(slots[s].x, slots[s].y, rc)) continue;
                                chosen = s; break;
                            }
                            if (chosen >= 0) { usedSlot[chosen] = true; positionsByIndex[idx] = slots[chosen]; }
                            else overflow.push(idx);
                        }
                        if (overflow.length) {
                            const per = perimeterPositions(overflow.length, left, top, hw, hh, cell, hc);
                            overflow.forEach((idx, k) => { positionsByIndex[idx] = per[k] || { x: hc.x, y: hc.y }; });
                        }
                    } else {
                        // Circle / irregular: outline-following fill — outermost ring first,
                        // swept by angle, each coin hugging the outline by `offset`.
                        for (let oi = 0; oi < order.length; oi++) {
                            const idx = order[oi];
                            const rc = coinR[idx];
                            const need = rc + offset;          // coin edge sits ~offset from the outline
                            let chosen = -1;
                            for (let k = 0; k < candidates.length; k++) {
                                const cand = candidates[k];
                                if (cand.used || cand.d < need) continue;
                                if (!clearOfFixtures(cand.x, cand.y, rc)) continue; // keep 5 mm off fixtures
                                let ok = true;
                                for (let p = 0; p < placedCoins.length; p++) {
                                    const pc = placedCoins[p];
                                    const dx = pc.x - cand.x, dy = pc.y - cand.y;
                                    const md = pc.r + rc + gap; // size-aware spacing
                                    if (dx * dx + dy * dy < md * md) { ok = false; break; }
                                }
                                if (ok) { chosen = k; break; }
                            }
                            if (chosen >= 0) {
                                const c = candidates[chosen];
                                c.used = true;
                                placedCoins.push({ x: c.x, y: c.y, r: rc });
                                positionsByIndex[idx] = { x: c.x, y: c.y };
                            }
                        }

                        // Coins the greedy couldn't seat → emptiest interior spot with >= 3 mm
                        // clearance; if none, to the outer perimeter (never overlapping inside).
                        const missing = [];
                        for (let i = 0; i < positionsByIndex.length; i++) {
                            if (!positionsByIndex[i]) missing.push(i);
                        }
                        const overflow = [];
                        missing.forEach((idx) => {
                            const rc = coinR[idx];
                            let best = null, bestScore = -Infinity;
                            for (let k = 0; k < candidates.length; k++) {
                                const cand = candidates[k];
                                if (cand.d < rc + offset) continue;
                                if (!clearOfFixtures(cand.x, cand.y, rc)) continue;
                                let minSlack = Infinity;
                                for (let p = 0; p < placedCoins.length; p++) {
                                    const pc = placedCoins[p];
                                    const slack = Math.hypot(pc.x - cand.x, pc.y - cand.y) - (pc.r + rc);
                                    if (slack < minSlack) minSlack = slack;
                                }
                                if (minSlack > bestScore) { bestScore = minSlack; best = cand; }
                            }
                            if (best && bestScore >= minGapPx) {
                                placedCoins.push({ x: best.x, y: best.y, r: rc });
                                positionsByIndex[idx] = { x: best.x, y: best.y };
                            } else {
                                overflow.push(idx);
                            }
                        });
                        if (overflow.length) {
                            const per = perimeterPositions(overflow.length, left, top, hw, hh, cell, hc);
                            overflow.forEach((idx, k) => { positionsByIndex[idx] = per[k] || { x: hc.x, y: hc.y }; });
                        }
                    }

                    positions = positionsByIndex;
                }

                // Any coins that didn't fit inside the silhouette → outer perimeter (still visible, no overlap)
                if (positions.length < targets.length) {
                    positions = positions.concat(
                        perimeterPositions(targets.length - positions.length, left, top, hw, hh, cell, hc)
                    );
                }
            } else if (pattern === 'outside') {
                // Move ALL coins OUTSIDE the holder, stacked in tidy rows just above it.
                // The block is centred on the holder's width; the first (bottom) row sits a
                // gap above the holder's top edge and rows stack upward in row order.
                const gap     = Math.max(maxFoot * 0.06, 3 * (canvas.scale || 1));
                const cols    = Math.max(1, Math.floor(hw / cell));
                const blockW  = (cols - 1) * cell;
                const startX  = hc.x - blockW / 2;
                const firstY  = top - gap - maxR; // bottom row, just above the holder
                for (let i = 0; i < targets.length; i++) {
                    const col = i % cols;
                    const row = Math.floor(i / cols);
                    positions.push({ x: startX + col * cell, y: firstY - row * cell });
                }
            } else if (IRREGULAR && field) {
                // Irregular holder: generate the pattern's slots over the holder, then keep
                // only those inside the silhouette AND clear of fixtures, preserving order.
                // Coins fill the valid slots; any surplus spills to the outer perimeter. This
                // keeps the named look — aligned lattice (grid), centred horizontal rows (rows),
                // concentric rings (circle) — rather than hugging the contour like Fit to shape.
                const slots = [];
                if (pattern === 'circle') {
                    // Genuine concentric rings sized to the LARGEST circle that fits inside
                    // the shape, centred on the shape's most-interior point (the pixel with
                    // the greatest distance-to-edge). Because every ring lies within that
                    // inscribed circle, the rings are COMPLETE (so it actually looks circular)
                    // and every coin is structurally inside the outline — no edge overlap,
                    // regardless of distance-field granularity. (The old code generated
                    // full-extent rings then filtered out the ones over the edge, leaving a
                    // scattered, random-looking subset.)
                    let cx = field.centroid.x, cy = field.centroid.y, R0 = field.distAt(cx, cy);
                    const scan = Math.max(4, cell * 0.5);
                    for (let y = top; y <= top + hh; y += scan) {
                        for (let x = left; x <= left + hw; x += scan) {
                            const d = field.distAt(x, y);
                            if (d > R0) { R0 = d; cx = x; cy = y; }
                        }
                    }
                    // Outermost ring keeps the largest coin fully inside the inscribed circle.
                    const Router = R0 - maxR - edgeMarginPx;
                    for (let R = Router; R >= cell / 2; R -= cell) {
                        const ringCap = Math.max(1, Math.floor(Math.PI / Math.asin(Math.min(1, cell / (2 * R)))));
                        for (let i = 0; i < ringCap; i++) {
                            const theta = -Math.PI / 2 + i * (2 * Math.PI / ringCap);
                            slots.push({ x: cx + R * Math.cos(theta), y: cy + R * Math.sin(theta) });
                        }
                    }
                    slots.push({ x: cx, y: cy }); // centre last
                } else if (pattern === 'rows') {
                    // Horizontal rows spaced by `cell`; each row centred across the inside
                    // x-extent at that height, so rows follow the shape's width (clearly rows).
                    const scanStep = Math.max(2, cell * 0.12);
                    for (let y = top + cell / 2; y <= top + hh; y += cell) {
                        let xmin = null, xmax = null;
                        for (let x = left; x <= left + hw; x += scanStep) {
                            if (insideOK(x, y, maxR)) { if (xmin === null) xmin = x; xmax = x; }
                        }
                        if (xmin === null) continue;
                        const span  = xmax - xmin;
                        const count = Math.max(1, Math.floor(span / cell) + 1);
                        const sx    = (xmin + xmax) / 2 - (count - 1) * cell / 2;
                        for (let c = 0; c < count; c++) slots.push({ x: sx + c * cell, y });
                    }
                } else {
                    // 'grid' — a fixed square lattice anchored on the holder centre (aligned
                    // rows AND columns), keeping only intersections inside the silhouette.
                    const colsTot = Math.max(1, Math.ceil(hw / cell) + 1);
                    const rowsTot = Math.max(1, Math.ceil(hh / cell) + 1);
                    const gx = hc.x - (colsTot - 1) * cell / 2;
                    const gy = hc.y - (rowsTot - 1) * cell / 2;
                    for (let r = 0; r < rowsTot; r++) {
                        for (let c = 0; c < colsTot; c++) {
                            slots.push({ x: gx + c * cell, y: gy + r * cell });
                        }
                    }
                }

                const valid = slots.filter(s => insideOK(s.x, s.y, maxR) && clearOfFixtures(s.x, s.y, maxR));
                const nIn = Math.min(targets.length, valid.length);
                for (let i = 0; i < nIn; i++) positions.push(valid[i]);
                if (targets.length > nIn) {
                    positions = positions.concat(
                        perimeterPositions(targets.length - nIn, left, top, hw, hh, cell, hc)
                    );
                }
            } else if (pattern === 'circle') {
                // Concentric rings that stay INSIDE the holder. The outermost ring sits at
                // the inset edge (radius - coinR - 4mm); successive rings step inward by `cell`.
                // Coins that don't fit inside spill to the outer perimeter (clearly outside),
                // never crowding the holder wall.
                const Rmax = Math.min(hw, hh) / 2 - edgeInset;
                let placed = 0, ring = 0;
                if (Rmax <= 0) {
                    // Holder too small for any inside ring — everything goes to the perimeter
                    positions = perimeterPositions(targets.length, left, top, hw, hh, cell, hc);
                } else {
                    while (placed < targets.length) {
                        const R = Rmax - ring * cell;
                        if (R < cell / 2) {
                            // Centre slot for one coin, then spill the rest outside
                            if (placed < targets.length) {
                                positions.push({ x: hc.x, y: hc.y });
                                placed++;
                            }
                            if (placed < targets.length) {
                                positions = positions.concat(
                                    perimeterPositions(targets.length - placed, left, top, hw, hh, cell, hc)
                                );
                                placed = targets.length;
                            }
                            break;
                        }
                        const ringCap = Math.max(1, Math.floor(Math.PI / Math.asin(Math.min(1, cell / (2 * R)))));
                        const n = Math.min(ringCap, targets.length - placed);
                        for (let i = 0; i < n; i++) {
                            const theta = -Math.PI / 2 + i * (2 * Math.PI / n);
                            positions.push({ x: hc.x + R * Math.cos(theta), y: hc.y + R * Math.sin(theta) });
                        }
                        placed += n;
                        ring++;
                        if (ring > 50) break; // safety
                    }
                }
            } else {
                // 'grid' or 'rows'
                // For 'grid' prefer a squarish column count but never exceed colsIn;
                // for 'rows' use colsIn (wide rows, fills width).
                let cols;
                if (pattern === 'rows') {
                    cols = colsIn;
                } else {
                    cols = Math.min(colsIn, Math.max(1, Math.round(Math.sqrt(targets.length))));
                }
                const capIn = cols * rowsIn;
                const nIn   = Math.min(targets.length, capIn);

                // Inside block centred on holder
                const rowsUsed = Math.ceil(nIn / cols) || 1;
                const bw = cols * cell;
                const bh = rowsUsed * cell;
                const startX = hc.x - bw / 2 + cell / 2;
                const startY = hc.y - bh / 2 + cell / 2;
                for (let i = 0; i < nIn; i++) {
                    positions.push({ x: startX + (i % cols) * cell, y: startY + Math.floor(i / cols) * cell });
                }

                // Surplus coins on outer perimeter — visible, non-overlapping
                if (targets.length > nIn) {
                    positions = positions.concat(
                        perimeterPositions(targets.length - nIn, left, top, hw, hh, cell, hc)
                    );
                }
            }

            // Final repair pass for the geometric layouts (grid / rows / circle).
            // The 'shape' pass already follows the outline; irregular holders already
            // filtered their slots inside the silhouette above. So this only nudges a
            // coin whose slot overlaps a fixture to the nearest clear spot — it runs only
            // when fixtures exist and never relocates coins onto the outline (which would
            // make grid/rows/circle look like Fit to shape). insideOK keeps any nudge
            // inside the silhouette for irregular holders; it's a no-op for regular ones.
            // Skipped for 'outside' — those coins are deliberately outside the silhouette,
            // so insideOK would wrongly drag them back in.
            if (fixtures.length && pattern !== 'outside') {
                const minCoinGap = Math.max(maxFoot * 0.06, 3 * (canvas.scale || 1));
                const placedNow = [];
                const clearOfPlaced = (x, y, rc) => {
                    for (let p = 0; p < placedNow.length; p++) {
                        const pc = placedNow[p];
                        if (Math.hypot(pc.x - x, pc.y - y) < pc.r + rc + minCoinGap) return false;
                    }
                    return true;
                };
                const ok = (x, y, rc) => clearOfFixtures(x, y, rc) && clearOfPlaced(x, y, rc) && insideOK(x, y, rc);
                const search = (p, rc) => {
                    const stepR = Math.max(rc * 0.4, 4);
                    for (let ring = 1; ring <= 120; ring++) {
                        const R = ring * stepR;
                        const n = Math.max(8, Math.floor((2 * Math.PI * R) / stepR));
                        for (let a = 0; a < n; a++) {
                            const ang = (a / n) * 2 * Math.PI;
                            const nx = p.x + R * Math.cos(ang);
                            const ny = p.y + R * Math.sin(ang);
                            if (ok(nx, ny, rc)) return { x: nx, y: ny };
                        }
                    }
                    return null;
                };
                for (let i = 0; i < targets.length; i++) {
                    const rc = Math.max(targets[i].getScaledWidth(), targets[i].getScaledHeight()) / 2;
                    let p = positions[i] || { x: hc.x, y: hc.y };
                    if (!ok(p.x, p.y, rc)) p = search(p, rc) || p;
                    positions[i] = p;
                    placedNow.push({ x: p.x, y: p.y, r: rc });
                }
            }

            // Apply positions
            targets.forEach((c, i) => {
                const p = positions[i] || { x: hc.x, y: hc.y };
                c.setPositionByOrigin(new fabric.Point(p.x, p.y), 'center', 'center');
                c.setCoords();
            });

            canvas.requestRenderAll();
            engineSave();
            return true;
        };

        /* ── Fixture finish colour ───────────────────────────────────
           Black → dark grey, Silver → light grey. Default derives from the
           material: any wood → black, plastic (or none) → silver. */
        Coach.FIXTURE_COLORS = {
            silver:     '#c8c8c8',
            black:      '#3a3a3a',
            gold:       '#926C15',
            goldBright: '#FFD700',
            red:        '#BC4F5E'
        };
        Coach.fixtureColorKey = function() {
            if (Coach.state.fixtureColor) return Coach.state.fixtureColor; // explicit choice wins
            const mat = (Coach.state.holderObj && Coach.state.holderObj.materialType) || Coach.state.material;
            return (mat && mat !== 'color') ? 'black' : 'silver';
        };
        Coach.fixtureFill = function() {
            return Coach.FIXTURE_COLORS[Coach.fixtureColorKey()] || Coach.FIXTURE_COLORS.silver;
        };
        Coach.applyFixtureColor = function(which) {
            if (which && Coach.FIXTURE_COLORS[which]) Coach.state.fixtureColor = which;
            const fill = Coach.fixtureFill();
            if (cv()) {
                canvas.getObjects().filter(o => o.shapeType === 'fixture').forEach(o => o.set('fill', fill));
                canvas.requestRenderAll();
                engineSave();
            }
        };

        /* ── Coach.makeFixtureCircle ──────────────────────────────────
           An 8.0 mm fixture hole: locked size/rotation and no transform handles
           (so it can't be accidentally resized) but still freely movable. */
        Coach.makeFixtureCircle = function(x, y, scale) {
            const fx = new fabric.Circle({
                radius: 4.0 * scale,
                left: x, top: y,
                originX: 'center', originY: 'center',
                fill: Coach.fixtureFill(),
                stroke: '#5c3316',
                strokeWidth: 0.5,
                strokeUniform: true,
                hasControls: false,   // hide the resize/rotate box
                lockScalingX: true,
                lockScalingY: true,
                lockUniScaling: true,
                lockRotation: true
            });
            fx.shapeType = 'fixture';
            fx.realDiameter = 8.0;
            fx.setCoords();
            return fx;
        };

        /* ── Coach.addFixtures ────────────────────────────────────────
           Place 8.0 mm mounting-hole circles on a perimeter offset 12 mm inward
           from the holder outline. A hole's keep-out
           (hole radius + 5 mm) must not clash with any coin slot.
           • Rectangle → 2 on the top edge + 2 on the bottom edge (none on sides)
           • Circle    → 6 equally spaced
           • Irregular → as many as fit, ~100 mm apart along the offset contour
           Returns the number of fixtures placed, or false if there's no holder. */
        Coach.addFixtures = function() {
            if (!cv()) return false;

            let holder = Coach.state.holderObj;
            if (!holder || canvas.getObjects().indexOf(holder) === -1) {
                if (typeof Coach.resolveHolder === 'function') Coach.resolveHolder();
                holder = Coach.state.holderObj;
            }
            if (!holder) return false;

            // Deselect first — a selected holder draws its controls/overlay on top,
            // so freshly-added fixtures wouldn't appear until the object is deselected.
            canvas.discardActiveObject();
            canvas.requestRenderAll();

            const scale = canvas.scale || 1;

            // Remove any fixtures from a previous run so re-clicking re-computes cleanly.
            canvas.getObjects().filter(o => o.shapeType === 'fixture').forEach(o => canvas.remove(o));

            const coins = canvas.getObjects().filter(o => o.shapeType === 'currency');

            const HOLE_R   = 2.1;                 // mm — drawn hole radius (4.2 mm dia)
            const OFFSET   = 12;                  // mm — inset of the fixture perimeter
            const KEEPOUT  = 5.0;                 // mm — clearance radius measured from the hole centre
            const holeRpx  = HOLE_R * scale;
            const keepoutPx = KEEPOUT * scale;

            const placed = [];                    // {x,y} in canvas px

            function clearOfCoins(x, y) {
                for (let i = 0; i < coins.length; i++) {
                    const c = coins[i];
                    const cc = c.getCenterPoint();
                    const cr = Math.max(c.getScaledWidth(), c.getScaledHeight()) / 2;
                    const dx = cc.x - x, dy = cc.y - y;
                    if (Math.hypot(dx, dy) < keepoutPx + cr) return false;
                }
                return true;
            }
            function tryPlace(x, y) {
                for (let i = 0; i < placed.length; i++) {
                    if (Math.hypot(placed[i].x - x, placed[i].y - y) < 2 * keepoutPx) return false;
                }
                if (!clearOfCoins(x, y)) return false;
                placed.push({ x: x, y: y });
                return true;
            }

            const type = holder.shapeType || '';
            const hc = holder.getCenterPoint();
            const hw = holder.getScaledWidth();
            const hh = holder.getScaledHeight();

            if (type === 'rectangle' || type === 'rectangle-outline') {
                const left = hc.x - hw / 2;
                const top  = hc.y - hh / 2;
                const yTop = top + OFFSET * scale;
                const yBot = top + hh - OFFSET * scale;
                const xs = [left + hw * (1 / 6), left + hw * (5 / 6)]; // 1/6 in from each side edge
                [yTop, yBot].forEach(yy => xs.forEach(xx => tryPlace(xx, yy)));
            } else if (type === 'circle' || type === 'circle-outline') {
                const R = Math.min(hw, hh) / 2 - OFFSET * scale;
                if (R > 0) {
                    // start at top, rotated 30° clockwise, then every 60°
                    for (let i = 0; i < 6; i++) {
                        const a = -Math.PI / 2 + Math.PI / 6 + i * (Math.PI / 3);
                        tryPlace(hc.x + R * Math.cos(a), hc.y + R * Math.sin(a));
                    }
                }
            } else {
                // Irregular (country / imported / ellipse): distance field over the
                // holder silhouette, collect the 12 mm-inset contour, walk it placing
                // a hole every ~100 mm.
                const field = Coach._holderDistanceField(holder);
                if (field) {
                    const br = field.bounds;
                    // Sample on the same grid the mask was rasterised at (~1 canvas px),
                    // with the same tolerance the mask-space walk used.
                    const stepC  = Math.max(1, Math.round(field.pxPerCanvas)) / field.pxPerCanvas;
                    const bandC  = Math.max(1.5, 1.2 * field.pxPerCanvas) / field.pxPerCanvas;
                    const target = OFFSET * scale;   // inset distance, canvas px

                    const band = [];
                    for (let py = br.top; py < br.top + br.height; py += stepC) {
                        for (let px = br.left; px < br.left + br.width; px += stepC) {
                            const d = field.distAt(px, py);
                            if (d && Math.abs(d - target) <= bandC) {
                                band.push({ x: px, y: py, ang: Math.atan2(py - field.centroid.y, px - field.centroid.x) });
                            }
                        }
                    }
                    band.sort((a, b) => a.ang - b.ang);

                    // Collapse the 2-D band to one point per small angle bin → a clean
                    // ordered loop. The raw band zig-zags radially, which hugely
                    // over-counts the perimeter and spawned far too many fixtures.
                    const BINS = 360;
                    const loop = [];
                    let lastBin = -1;
                    for (let i = 0; i < band.length; i++) {
                        const b = Math.floor((band[i].ang + Math.PI) / (2 * Math.PI) * BINS);
                        if (b !== lastBin) { loop.push(band[i]); lastBin = b; }
                    }

                    if (loop.length) {
                        // Cumulative arc length around the (closed) contour loop.
                        const cum = [0];
                        for (let i = 1; i < loop.length; i++) {
                            cum[i] = cum[i - 1] + Math.hypot(loop[i].x - loop[i - 1].x, loop[i].y - loop[i - 1].y);
                        }
                        const closeSeg = Math.hypot(
                            loop[0].x - loop[loop.length - 1].x,
                            loop[0].y - loop[loop.length - 1].y);
                        const total = cum[cum.length - 1] + closeSeg;

                        // Greedy walk: place a hole as soon as we've travelled >= spacing
                        // since the last one AND the spot is clear of coins and not within
                        // ~spacing of an existing fixture. This keeps a consistent ~100 mm
                        // gap, skips coin-blocked spots (waiting for the next clear point),
                        // and fills every place a fixture actually fits.
                        const walk = (spacingPx) => {
                            placed.length = 0;
                            const minFixGap = spacingPx * 0.8;
                            let lastArc = -Infinity;
                            for (let i = 0; i < loop.length; i++) {
                                if (cum[i] - lastArc < spacingPx) continue;
                                const pt = loop[i];
                                if (!clearOfCoins(pt.x, pt.y)) continue;
                                let tooNear = false;
                                for (let p = 0; p < placed.length; p++) {
                                    if (Math.hypot(placed[p].x - pt.x, placed[p].y - pt.y) < minFixGap) { tooNear = true; break; }
                                }
                                if (tooNear) continue;
                                placed.push({ x: pt.x, y: pt.y });
                                lastArc = cum[i];
                            }
                        };

                        const spacing100 = 100 * scale;
                        walk(spacing100);
                        // At least 5 where the perimeter allows (small shapes pack closer).
                        if (placed.length < 5 && total > 0) {
                            const tighter = Math.min(spacing100, total / 5);
                            if (tighter < spacing100) walk(tighter);
                        }
                    }
                }
            }

            // Materialise the placed positions as fixture-hole circles.
            placed.forEach(p => {
                canvas.add(Coach.makeFixtureCircle(p.x, p.y, scale));
            });

            canvas.requestRenderAll();
            engineSave();
            return placed.length;
        };

        /* ── Populate steps (after Coach.SELECTORS is defined) ────── */
        Coach.steps = [
            {
                id: 'occasion',
                title: 'Welcome',
                intro: "Let’s build your coin holder step by step. First — what’s it for?",
                optional: true,
                highlight: [],
                renderAction(el) {
                    el.innerHTML = '';

                    el.appendChild(mkEl('p', { className: 'mb-3', textContent: this.intro }));

                    // Occasion buttons (selected look comes from the .btn.active CSS)
                    const occasions = ['Gift', 'Travel memento', 'Collection display', 'Milestone'];
                    const btnGroup = mkEl('div', { className: 'coach-row coach-row-2 mb-3' });

                    const makeBtn = (label) => {
                        const btn = mkEl('button', {
                            type: 'button',
                            className: 'btn btn-sm btn-outline-light' + (Coach.state.occasion === label ? ' active' : ''),
                            textContent: label
                        });
                        btn.addEventListener('click', () => {
                            Coach.state.occasion = label;
                            btnGroup.querySelectorAll('button').forEach(b =>
                                b.classList.toggle('active', b.textContent === label));
                            // Update placeholder on project name input
                            const nameInput = el.querySelector('#coach-project-name');
                            if (nameInput && !nameInput.value) {
                                nameInput.placeholder = label + ' coin holder';
                            }
                        });
                        return btn;
                    };

                    occasions.forEach(label => btnGroup.appendChild(makeBtn(label)));
                    el.appendChild(btnGroup);

                    // Project name input
                    el.appendChild(mkEl('label', {
                        htmlFor: 'coach-project-name', className: 'form-label small mb-1',
                        textContent: 'Coin holders name (optional)'
                    }));

                    const nameInput = mkEl('input', {
                        type: 'text', id: 'coach-project-name', className: 'form-control form-control-sm',
                        value: Coach.state.projectName || '',
                        placeholder: Coach.state.occasion
                            ? Coach.state.occasion + ' coin holder'
                            : 'e.g. Birthday coin holder'
                    });
                    nameInput.addEventListener('input', () => {
                        Coach.state.projectName = nameInput.value;
                    });
                    el.appendChild(nameInput);

                    // ── Resume from a previously saved project file ──────────
                    const loadWrap = mkEl('div', { className: 'mt-4 pt-3', style: 'border-top:1px solid rgba(255,255,255,0.2)' });

                    loadWrap.appendChild(mkEl('p', {
                        className: 'small mb-2', style: 'opacity:0.85',
                        textContent: 'Already started one? Open a project file you saved earlier.'
                    }));

                    const loadInput = mkEl('input', { type: 'file', accept: '.json,.hsc', style: 'display:none' });
                    loadInput.addEventListener('change', (e) => {
                        const file = e.target.files && e.target.files[0];
                        if (file) Coach.persist.importFromFile(file);
                        loadInput.value = '';   // allow re-picking the same file
                    });

                    const loadBtn = mkEl('button', {
                        type: 'button', className: 'btn btn-sm btn-outline-light w-100',
                        innerHTML: '<i class="fas fa-file-import"></i> Load a saved project'
                    });
                    loadBtn.addEventListener('click', () => loadInput.click());

                    loadWrap.appendChild(loadBtn);
                    loadWrap.appendChild(loadInput);
                    el.appendChild(loadWrap);
                }
            },
            {
                id: 'holder',
                title: 'Choose a shape',
                intro: 'Start with the shape of your holder. You can set the size now or change it anytime.',
                optional: false,
                highlight: [
                    Coach.SELECTORS.settings,
                    Coach.SELECTORS.shapes,
                    Coach.SELECTORS.countries,
                    Coach.SELECTORS.fileImport
                ],
                renderAction(el) {
                    el.innerHTML = '';

                    // Suggested default holder size (prefilled, and auto-applied when a shape is picked)
                    if (Coach.state.holderW == null) Coach.state.holderW = 200;
                    if (Coach.state.holderH == null) Coach.state.holderH = 100;

                    // ── helpers (selected look comes from the .btn.active CSS) ──
                    const makeBtn = (label, icon, active) => mkEl('button', {
                        type: 'button',
                        className: 'btn btn-sm btn-outline-light' + (active ? ' active' : ''),
                        innerHTML: icon ? `<i class="${icon}"></i> ${label}` : label
                    });

                    const markSelected = (group, chosen) => {
                        group.querySelectorAll('button[data-shape]').forEach(b =>
                            b.classList.toggle('active', b.dataset.shape === chosen));
                    };

                    const captureHolder = (type) => {
                        if (cv()) {
                            const obj = canvas.getActiveObject();
                            Coach.state.holderObj = obj;
                            Coach.state.holderType = type;
                            if (obj) {
                                obj.coachHolderId = 'holder';
                                // Engine gives filled rect/circle a default birch material;
                                // strip it so no base shape has a material yet (chosen in step 3).
                                if (obj.materialType && obj.materialType !== 'color') {
                                    obj.set('fill', '#ffffff');
                                    obj.materialType = 'color';
                                    canvas.requestRenderAll();
                                }
                            }
                            applyStoredSize();
                            // New objects default to locked aspect ratio (the customer
                            // can unlock per object from the toggle).
                            Coach.setObjectAspectLock(obj, true);
                        }
                    };

                    // ── FIX G: resize the holder object itself (in mm) ────
                    const resizeHolder = (wMm, hMm, lockAspect) => {
                        const obj = Coach.state.holderObj;
                        if (!obj || !cv()) return;
                        const scale = canvas.scale || 1;
                        const curW = obj.getScaledWidth();
                        const curH = obj.getScaledHeight();
                        if (!curW || !curH) return;
                        const ratioX = (wMm * scale) / curW;
                        // When not aspect-locked, only resize height if a valid value was given —
                        // otherwise keep the current height (ratio 1) so width-only resizes don't collapse it.
                        const ratioY = lockAspect
                            ? ratioX
                            : ((hMm && hMm > 0) ? (hMm * scale) / curH : 1);
                        obj.scaleX *= ratioX;
                        obj.scaleY *= ratioY;
                        if (obj.shapeType === 'rectangle') {
                            obj.realWidth  = wMm;
                            obj.realHeight = lockAspect ? (wMm * curH / curW) : hMm;
                        }
                        obj.setCoords();
                        canvas.requestRenderAll();
                        engineSave();
                    };

                    // Apply any size the customer entered *before* picking a shape.
                    const applyStoredSize = () => {
                        const w = Coach.state.holderW;
                        const h = Coach.state.holderH;
                        if (!w || w <= 0) return;
                        const lock = (Coach.state.holderType === 'country' || Coach.state.holderType === 'imported');
                        resizeHolder(w, lock ? null : h, lock);
                    };

                    // Countries arrive at a predictable size: the larger dimension is
                    // normalised to 130 mm — the raw generated size can leave small
                    // countries (San Marino…) lost on the canvas. The width box still
                    // lets the customer resize afterwards.
                    const COUNTRY_HOLDER_MM = 130;
                    const sizeCountryHolder = () => {
                        const obj = Coach.state.holderObj;
                        if (!obj || !cv()) return;
                        const scale = canvas.scale || 1;
                        const wMm = obj.getScaledWidth() / scale;
                        const hMm = obj.getScaledHeight() / scale;
                        if (!wMm || !hMm) return;
                        resizeHolder(COUNTRY_HOLDER_MM * wMm / Math.max(wMm, hMm), null, true);
                    };

                    // ── 1. Intro ───────────────────────────────────────────
                    const intro = mkEl('p', { className: 'mb-3', textContent: this.intro });
                    el.appendChild(intro);

                    // Show "Clean up outline" when the loaded shape needs reducing:
                    // either the holder packs several outlines into one object
                    // (compound path / group), or a multi-element SVG import left
                    // sibling objects on the canvas (the engine adds each SVG element
                    // as its own object; only the first was captured as the holder).
                    (function maybeReduce() {
                        const h = Coach.state.holderObj;
                        if (!h) return;
                        if (Coach.countOutlines(h) <= 1 && !Coach.importedSiblings(h).length) return;
                        const row = mkEl('div', { className: 'coach-row mb-2' });
                        const btn = mkEl('button', {
                            type: 'button',
                            className: 'btn btn-sm coach-btn-yellow',
                            textContent: 'Clean up outline',
                            title: 'Keep only the largest outline in the loaded shape, removing the smaller ones'
                        });
                        btn.addEventListener('click', function() {
                            Coach.reduceHolderOutlines();
                            Coach.render();
                        });
                        row.appendChild(btn);
                        el.appendChild(row);
                        el.appendChild(mkEl('p', {
                            className: 'small text-muted mb-3',
                            textContent: 'Your file has a few shapes in it — this keeps the biggest one and removes the rest.'
                        }));
                    }());

                    // ── 2. Base-shape picker (FIX H) ──────────────────────
                    const shapeLabel = mkEl('p', { className: 'small fw-semibold mb-2', textContent: 'Choose a shape for your coin holder' });
                    el.appendChild(shapeLabel);

                    const shapeGroup = mkEl('div', { className: 'coach-row mb-2' });

                    // Row 1 btns: Rectangle / Circular base shapes
                    [['rectangle', 'Rectangle', 'fas fa-square'], ['circle', 'Circular', 'fas fa-circle']].forEach(([shape, label, icon]) => {
                        const b = makeBtn(label, icon, Coach.state.holderType === shape);
                        b.dataset.shape = shape;
                        b.addEventListener('click', () => {
                            if (typeof addShape === 'function') {
                                addShape(shape);
                                captureHolder(shape);
                            }
                            markSelected(shapeGroup, shape);
                            countryPanel.style.display = 'none';
                            Coach.render();
                        });
                        shapeGroup.appendChild(b);
                    });

                    // Row 1 btn: Country / custom shape (toggle)
                    const countryToggleBtn = makeBtn('Custom shape', 'fas fa-draw-polygon',
                        Coach.state.holderType === 'country' || Coach.state.holderType === 'imported');
                    countryToggleBtn.dataset.shape = 'country';
                    countryToggleBtn.addEventListener('click', () => {
                        const visible = countryPanel.style.display !== 'none';
                        countryPanel.style.display = visible ? 'none' : 'flex';
                        countryToggleBtn.classList.toggle('active', !visible);
                        if (!visible) markSelected(shapeGroup, 'country');
                    });
                    shapeGroup.appendChild(countryToggleBtn);

                    el.appendChild(shapeGroup);

                    // ── Country / custom panel (hidden by default) ─────────
                    // Contains 6 country buttons + Upload SVG as the final button.
                    // NOTE: do NOT use the Bootstrap "d-flex" class here — it is
                    // "display:flex !important" and would override our inline
                    // display:none, leaving the panel permanently visible.
                    // We set flex layout via inline styles so we control display.
                    const countryPanel = mkEl('div', { className: 'coach-btns mb-3 ps-1' });
                    countryPanel.style.flexWrap = 'wrap';
                    countryPanel.style.gap = '6px';
                    // Hidden until the "Country / custom shape" button is pressed
                    countryPanel.style.display = 'none';

                    const countries = Coach.COUNTRY_OPTIONS;

                    countries.forEach(({ key, label }) => {
                        // Country shapes get their own accent so they read as a distinct
                        // group from the Rectangle/Circular base shapes.
                        const cb = mkCountryBtn(key, label);
                        cb.addEventListener('click', () => {
                            // Capture the country shape as the holder (stray coins ignored).
                            Coach.captureNextAdded('holder', o => o.shapeType !== 'currency', (obj) => {
                                Coach.state.holderObj = obj;
                                Coach.state.holderType = 'country';
                                if (obj) {
                                    obj.coachHolderId = 'holder';
                                    canvas.sendToBack(obj); // base shape sits on the bottom layer
                                }
                                sizeCountryHolder();
                                Coach.setHolderAspectLock(true); // country shapes lock aspect by default
                                markSelected(shapeGroup, 'country');
                                Coach.render();
                            });
                            // Holder = country OUTLINE (transparent fill) so coins show through
                            if (typeof addCountryOutline === 'function') addCountryOutline(key);
                            else if (typeof addCountry === 'function') addCountry(key);
                            // Highlight the chosen country button (the .btn.active CSS
                            // rule outranks the .coach-btn-country accent).
                            countryPanel.querySelectorAll('button[data-country]').forEach(b =>
                                b.classList.toggle('active', b.dataset.country === key));
                        });
                        countryPanel.appendChild(cb);
                    });

                    countryPanel.appendChild(mkCountrySearch((name, key) => {
                        Coach.captureNextAdded('holder', o => o.shapeType !== 'currency', (obj) => {
                            Coach.state.holderObj = obj;
                            Coach.state.holderType = 'country';
                            if (obj) {
                                obj.coachHolderId = 'holder';
                                canvas.sendToBack(obj); // base shape sits on the bottom layer
                            }
                            sizeCountryHolder();
                            Coach.setHolderAspectLock(true); // country shapes lock aspect by default
                            markSelected(shapeGroup, 'country');
                            Coach.render();
                        });
                        if (typeof addCountryOutline === 'function') addCountryOutline(key);
                        else if (typeof addCountry === 'function') addCountry(key);
                        // A searched slug matches no curated button, so this clears
                        // all curated-button highlights — the desired state.
                        countryPanel.querySelectorAll('button[data-country]').forEach(b =>
                            b.classList.remove('active'));
                    }));

                    // Upload SVG — last button in the country/custom panel
                    const svgBtn = makeBtn('Upload your own shape', 'fas fa-shapes', Coach.state.holderType === 'imported');
                    svgBtn.dataset.shape = 'imported';
                    // Distinct accent (purple) so "Upload your own shape" reads apart
                    // from both the base shapes and the slate-blue country buttons.
                    svgBtn.classList.add('coach-btn-upload');
                    svgBtn.addEventListener('click', () => {
                        // Capture the imported shape as the holder (coins are ignored — a
                        // stray coin after a cancelled picker must not become the holder).
                        Coach.captureNextAdded('import', o => o.shapeType !== 'currency', (obj) => {
                            Coach.state.holderObj = obj;
                            Coach.state.holderType = 'imported';
                            if (obj) obj.coachHolderId = 'holder';
                            applyStoredSize();
                            Coach.setHolderAspectLock(true); // imported shapes lock aspect by default
                            markSelected(shapeGroup, 'country'); // keep country toggle highlighted
                            // Defer the re-render one tick: a multi-element SVG adds its
                            // remaining objects synchronously right after this first one,
                            // and the "Clean up outline" offer must see the whole batch.
                            setTimeout(() => Coach.render(), 0);
                        });
                        document.getElementById('fileImport')?.click();
                    });
                    countryPanel.appendChild(svgBtn);

                    el.appendChild(countryPanel);

                    // ── 3. Size controls (FIX G) ───────────────────────────
                    // Size can be set before OR after picking a shape. Values are
                    // stored on Coach.state so they apply automatically when a
                    // holder is created, and re-apply live once one exists.
                    const hasHolder  = !!Coach.state.holderObj;
                    const holderType = Coach.state.holderType;
                    const lockAspect = Coach.isAspectLocked(Coach.state.holderObj);
                    const scaleNow   = (cv() && canvas.scale) ? canvas.scale : 1;

                    const sizeSection = mkEl('div', { className: 'mb-3' });
                    sizeSection.appendChild(mkEl('label', { className: 'form-label small fw-semibold mb-1', textContent: 'Coin holder size (mm)' }));

                    const sizeRow = mkEl('div', { className: 'd-flex gap-2 align-items-end' });

                    // Width input (always shown)
                    const wWrap = mkEl('div');
                    wWrap.appendChild(mkEl('label', { htmlFor: 'coach-holder-w', className: 'form-label small mb-0', textContent: 'Width' }));
                    const wInput = mkEl('input', {
                        type: 'number', id: 'coach-holder-w', className: 'form-control form-control-sm',
                        min: '1', step: '0.1', style: 'width:70px'
                    });
                    // Seed: stored value first, else current holder width
                    if (Coach.state.holderW) {
                        wInput.value = Coach.state.holderW;
                    } else if (hasHolder) {
                        wInput.value = parseFloat((Coach.state.holderObj.getScaledWidth() / scaleNow).toFixed(2));
                    }
                    wInput.addEventListener('input', () => {
                        const v = parseFloat(wInput.value);
                        Coach.state.holderW = (!isNaN(v) && v > 0) ? v : null;
                    });
                    wWrap.appendChild(wInput);
                    sizeRow.appendChild(wWrap);

                    // Height input — hidden once a country/imported holder is chosen (aspect-locked)
                    let hInput = null;
                    if (!lockAspect) {
                        const hWrap = mkEl('div');
                        hWrap.appendChild(mkEl('label', { htmlFor: 'coach-holder-h', className: 'form-label small mb-0', textContent: 'Height' }));
                        hInput = mkEl('input', {
                            type: 'number', id: 'coach-holder-h', className: 'form-control form-control-sm',
                            min: '1', step: '0.1', style: 'width:70px'
                        });
                        if (Coach.state.holderH) {
                            hInput.value = Coach.state.holderH;
                        } else if (hasHolder) {
                            hInput.value = parseFloat((Coach.state.holderObj.getScaledHeight() / scaleNow).toFixed(2));
                        }
                        hInput.addEventListener('input', () => {
                            const v = parseFloat(hInput.value);
                            Coach.state.holderH = (!isNaN(v) && v > 0) ? v : null;
                        });
                        hWrap.appendChild(hInput);
                        sizeRow.appendChild(hWrap);
                    }

                    // Apply size button
                    const applyBtn = mkEl('button', { type: 'button', className: 'btn btn-sm btn-outline-light', textContent: 'Apply size' });
                    applyBtn.addEventListener('click', () => {
                        const w = parseFloat(wInput.value);
                        const h = hInput ? parseFloat(hInput.value) : null;
                        if (isNaN(w) || w <= 0) return;
                        Coach.state.holderW = w;
                        Coach.state.holderH = (hInput && !isNaN(h) && h > 0) ? h : Coach.state.holderH;
                        if (Coach.state.holderObj) {
                            resizeHolder(w, lockAspect ? null : h, lockAspect);
                        }
                        // else: stored — will apply automatically once a shape is picked
                    });
                    sizeRow.appendChild(applyBtn);

                    sizeSection.appendChild(sizeRow);

                    // Aspect-ratio lock toggle (mirrors the right-panel button and the
                    // object's drag behaviour). Only meaningful once a holder exists.
                    if (hasHolder) {
                        const lockRow = mkEl('div', { className: 'coach-row mt-1' });
                        const lockBtn = mkEl('button', {
                            type: 'button',
                            id: 'coach-aspect-left',
                            className: 'btn btn-sm',
                            textContent: lockAspect ? '🔒 Keep proportions' : '🔓 Resize freely'
                        });
                        lockBtn.addEventListener('click', () => Coach.toggleHolderAspectLock());
                        lockRow.appendChild(lockBtn);
                        sizeSection.appendChild(lockRow);
                    }

                    if (!hasHolder) {
                        sizeSection.appendChild(mkEl('p', {
                            className: 'small text-muted mb-0 mt-1',
                            textContent: "You can set a size now or later — it'll apply as soon as you pick a shape."
                        }));
                    }

                    // Render size BEFORE the base-shape picker (issue: size can come first)
                    el.insertBefore(sizeSection, shapeLabel);

                    // ── 4. Ready layouts (subtle) ─────────────────────────
                    const tmplLabel = mkEl('p', { className: 'small text-muted mt-3 mb-1', textContent: 'Or start from a ready-made template:' });
                    el.appendChild(tmplLabel);

                    const tmplRow = mkEl('div', { className: 'coach-row' });

                    const templates = [
                        { key: 'germany-euro', label: 'Rectangle Coin Display' },
                        { key: 'uk-coins',     label: 'Circular Coin Display' },
                        { key: 'memories',     label: 'Pressed Penny' }
                    ];

                    templates.forEach(({ key, label }) => {
                        const tb = mkEl('button', { type: 'button', className: 'btn btn-sm btn-outline-light', textContent: label });
                        tb.addEventListener('click', () => {
                            if (typeof addTemplate === 'function') addTemplate(key);
                        });
                        tmplRow.appendChild(tb);
                    });

                    el.appendChild(tmplRow);
                },
            },
            {
                id: 'material',
                title: 'Choose a material',
                intro: 'What should your holder be made of? Pick a wood finish or a solid plastic colour.',
                optional: false,
                highlight: [Coach.SELECTORS.material],
                renderAction(el) {
                    el.innerHTML = '';

                    el.appendChild(mkEl('p', { className: 'mb-3', textContent: this.intro }));

                    // ── Resolve the holder object ─────────────────────────
                    const obj = (function resolveTarget(){
                        if (!cv()) return null;
                        // prefer the tracked holder if it's still on the canvas
                        if (Coach.state.holderObj && canvas.getObjects().indexOf(Coach.state.holderObj) !== -1) return Coach.state.holderObj;
                        // else the largest non-coin object (the board, incl. template boards)
                        const nonCoins = canvas.getObjects().filter(o => o.shapeType !== 'currency' && o.type !== 'i-text' && o.type !== 'text');
                        if (nonCoins.length) {
                            return nonCoins.reduce((a,b) => (a.getScaledWidth()*a.getScaledHeight() >= b.getScaledWidth()*b.getScaledHeight()) ? a : b);
                        }
                        return canvas.getActiveObject();
                    })();
                    // Track the resolved object so later steps and persistence use the template board
                    if (obj) Coach.state.holderObj = obj;

                    if (!obj) {
                        el.appendChild(mkEl('p', { className: 'text-warning mb-3', textContent: 'Add a holder first — go back to step 2.' }));
                        const backBtn = mkEl('button', {
                            type: 'button', className: 'btn btn-sm btn-outline-light',
                            textContent: '← Back to Choose Holder'
                        });
                        backBtn.addEventListener('click', () => Coach.go(1));
                        el.appendChild(backBtn);
                        return;
                    }

                    // ── Shared apply function ─────────────────────────────
                    const applyMaterial = (fillType) => {
                        if (typeof applyFill === 'function') applyFill(obj, fillType);
                        if (typeof cascadeColorToContained === 'function') {
                            const plastic = document.getElementById('fillColor')
                                ? document.getElementById('fillColor').value
                                : '#ffffff';
                            cascadeColorToContained(obj, fillType, plastic);
                        }
                        // Imported vectors have transparent fills, so applyFill skips the
                        // wood texture for them — force it on EVERY imported object (the
                        // engine adds each SVG path as its own object) so they match
                        // integrated outlines. MUST run AFTER cascadeColorToContained, which
                        // would otherwise recolour the other imported paths flat brown and
                        // stomp the texture we just applied.
                        if (fillType !== 'color' && cv()) {
                            canvas.getObjects()
                                .filter(o => o.shapeType === 'imported')
                                .forEach(o => Coach.applyWoodToImported(o, fillType));
                        }
                        // Guarantee plastic colour is applied regardless of engine input state
                        if (fillType === 'color') {
                            const chosen = document.getElementById('fillColor')
                                ? document.getElementById('fillColor').value
                                : null;
                            if (chosen && obj) {
                                if (obj.type === 'group') {
                                    obj.forEachObject(o => {
                                        if (o.type !== 'text' && o.type !== 'i-text' && o.fill !== 'transparent') {
                                            o.set('fill', chosen);
                                        }
                                    });
                                } else {
                                    obj.set('fill', chosen);
                                }
                                obj.materialType = 'color';
                            }
                        }
                        // Keep engine's properties panel consistent
                        const sel = document.getElementById('materialPreset');
                        if (sel) sel.value = fillType;
                        if (cv()) canvas.requestRenderAll();
                        engineSave();
                        Coach.state.material = fillType;
                        // Recolour any existing fixtures to match the new material
                        // (no-arg re-derives the default; an explicit finish still wins).
                        if (typeof Coach.applyFixtureColor === 'function') Coach.applyFixtureColor();
                        // Flip engraved images/text between brown (wood) and grey (plastic).
                        if (typeof Coach.refreshEngraveColors === 'function') Coach.refreshEngraveColors();
                        // Re-render to reflect the new selection state
                        Coach.render();
                    };

                    const currentMaterial = Coach.state.material || null;

                    // ── Wood finishes (selected look = .btn.active CSS) ───
                    el.appendChild(mkEl('p', { className: 'small fw-semibold mb-2', textContent: 'Wood finishes' }));

                    const woodRow = mkEl('div', { className: 'coach-row mb-3' });
                    el.appendChild(woodRow);

                    [['Birch', 'birch'], ['Oak', 'oak'], ['Walnut', 'walnut']].forEach(([label, value]) => {
                        const btn = mkEl('button', {
                            type: 'button',
                            className: 'btn btn-sm btn-outline-light' + (currentMaterial === value ? ' active' : ''),
                            textContent: label
                        });
                        btn.addEventListener('click', () => applyMaterial(value));
                        woodRow.appendChild(btn);
                    });

                    // ── Plastic colour ────────────────────────────────────
                    el.appendChild(mkEl('p', { className: 'small fw-semibold mb-2', textContent: 'Plastic colour' }));

                    const plasticRow = mkEl('div', { className: 'd-flex align-items-center flex-wrap gap-2 mb-2' });
                    el.appendChild(plasticRow);

                    // Use the SAME predefined palette as the main editor's #fillColor dropdown.
                    // Setting #fillColor to one of its real option values is what makes applyFill work —
                    // an arbitrary hex from a free picker isn't a valid <option> and silently blanks the fill.
                    const PRESET_COLORS = [
                        { value: '#000000',     label: 'Black' },
                        { value: '#FFFFFF',     label: 'White' },
                        { value: '#F5F5DC',     label: 'Mat White' },
                        { value: 'transparent', label: 'No Fill' },
                        { value: '#FF0000',     label: 'Red' },
                        { value: '#FFFF00',     label: 'Yellow' },
                        { value: '#0000FF',     label: 'Blue' },
                        { value: '#87CEEB',     label: 'Light Blue' },
                        { value: '#00FF00',     label: 'Green' }
                    ];

                    // Determine the holder's current fill so we can highlight the matching swatch.
                    let currentFill = null;
                    if (obj.type === 'group') {
                        obj.forEachObject(o => {
                            if (currentFill === null && o.type !== 'text' && o.type !== 'i-text' && typeof o.fill === 'string') {
                                currentFill = o.fill;
                            }
                        });
                    } else if (typeof obj.fill === 'string') {
                        currentFill = obj.fill;
                    }

                    PRESET_COLORS.forEach(({ value, label }) => {
                        // Plain <button> WITHOUT the .btn class — the coach CSS forces
                        // ".btn { background:#344734 !important }", which would mask the swatch colour.
                        const sw = mkEl('button', {
                            type: 'button', title: label,
                            style: 'width:30px;height:30px;border-radius:6px;border:2px solid #888;cursor:pointer;padding:0;'
                        });
                        if (value === 'transparent') {
                            sw.style.background = 'repeating-linear-gradient(45deg,#ccc,#ccc 4px,#fff 4px,#fff 8px)';
                        } else {
                            sw.style.background = value;
                        }
                        const isSel = currentMaterial === 'color' && currentFill &&
                                      currentFill.toLowerCase() === value.toLowerCase();
                        if (isSel) {
                            sw.style.borderColor = '#344734';
                            sw.style.boxShadow = '0 0 0 3px #cfe3cf';
                        }
                        sw.addEventListener('click', () => {
                            const fillColorInput = document.getElementById('fillColor');
                            if (fillColorInput) fillColorInput.value = value; // valid <option> value
                            applyMaterial('color');
                        });
                        plasticRow.appendChild(sw);
                    });
                },
            },
            {
                id: 'coins',
                title: 'Add your coins',
                intro: "Pick a currency and add the coins you'd like to display. You can also add a custom one.",
                optional: false,
                highlight: [Coach.SELECTORS.coins],
                isComplete() {
                    return !!cv() && canvas.getObjects().some(o => o.shapeType === 'currency');
                },
                renderAction(el) {
                    el.innerHTML = '';

                    /* ── Intro text ────────────────────────────────────── */
                    const introP = mkEl('p', { className: 'mb-3', textContent: this.intro });
                    el.appendChild(introP);

                    /* ── Denomination data ─────────────────────────────────
                       Circular coins are compact [value, diameter-mm] tuples —
                       the label equals the value unless a third element
                       overrides it. Non-euro/pound/dollar diameters = official
                       mint spec + 0.15 mm production clearance. Elliptic coins
                       (pressed pennies) stay full objects with x/y sizes. */
                    const CURRENCIES = {
                        euro: { label: '€ Euro', coins: [
                            ['2 €', 25.75], ['1 €', 23.4], ['0.50 €', 24.4], ['0.20 €', 22.4],
                            ['0.10 €', 19.9], ['0.05 €', 21.4], ['0.02 €', 18.9], ['0.01 €', 16.4]
                        ]},
                        dollar: { label: '$ Dollar', coins: [
                            ['50 ¢', 30.76], ['25 ¢', 24.41], ['10 ¢', 18.06],
                            ['5 ¢', 21.36], ['1 ¢', 19.25], ['$ 1', 26.65]
                        ]},
                        pound: { label: '£ Pound', coins: [
                            ['2£', 28.55], ['1£', 23.18], ['50p', 27.45], ['20p', 21.55],
                            ['10p', 24.65], ['5p', 18.15], ['2p', 26.06], ['1p', 20.47]
                        ]},
                        australian: { label: 'A$ Australian', coins: [
                            ['A$2', 20.65], ['A$1', 25.15], ['50c', 31.80], ['20c', 28.80],
                            ['10c', 23.75], ['5c', 19.56], ['2c', 21.74], ['1c', 17.80]
                        ]},
                        canada: { label: 'C$ Canada', coins: [
                            ['C$2', 28.15], ['C$1', 26.65], ['50¢', 27.28],
                            ['25¢', 24.03], ['10¢', 18.18], ['5¢', 21.35]
                        ]},
                        yen: { label: '¥ Yen', coins: [
                            ['¥500', 26.65], ['¥100', 22.75], ['¥50', 21.15],
                            ['¥10', 23.65], ['¥5', 22.15], ['¥1', 20.15]
                        ]},
                        swiss: { label: 'CHF Swiss', coins: [
                            ['5 Fr', 31.60], ['2 Fr', 27.55], ['1 Fr', 23.35], ['½ Fr', 18.35],
                            ['20 rp', 21.20], ['10 rp', 19.30], ['5 rp', 17.30]
                        ]},
                        bullion: { label: 'Exonumia', coins: [
                            ['Silver Eagle', 40.75], ['Britannia', 38.75], ['Maple Leaf', 38.15],
                            ['National token', 34.15, 'National Tokens'], ['Krugerrand', 32.92]
                        ]},
                        pressed: { label: 'Pressed Pennies', elliptic: true, coins: [
                            { label: 'Vertical', value: 'Penny 23×38', x: 23, y: 38 },
                            { label: 'Horizontal', value: 'Penny 38×23', x: 38, y: 23 }
                        ]}
                    };

                    /* ── Local state ───────────────────────────────────── */
                    Coach.state.coins = Coach.state.coins || {};
                    const activeCurrency = Coach.state.coinCurrency || 'euro';

                    /* ── Currency tab buttons ──────────────────────────── */
                    const tabRow = mkEl('div', { className: 'coach-row mb-3' });
                    Object.entries(CURRENCIES).forEach(([key, cur]) => {
                        const tab = mkEl('button', {
                            type: 'button',
                            className: 'btn btn-sm coach-tab' + (key === activeCurrency ? ' active' : ''),
                            textContent: cur.label
                        });
                        tab.addEventListener('click', () => {
                            Coach.state.coinCurrency = key;
                            Coach.render();
                        });
                        tabRow.appendChild(tab);
                    });
                    el.appendChild(tabRow);

                    /* ── Elliptical coin slot (pressed pennies) ──────────────
                       Pressed pennies are oval, so the engine's circular
                       addSingleCoin can't make them. Build a fabric.Ellipse coin
                       that mirrors a normal coin group (white fill, brown hairline
                       stroke, centred label) and is tagged shapeType 'currency' so
                       it counts, arranges, persists and recolours like any coin. */
                    function addEllipseCoin(value, xMm, yMm) {
                        if (!cv() || typeof fabric === 'undefined') return;
                        const scale = canvas.scale || 1;
                        const ellipse = new fabric.Ellipse({
                            rx: (xMm / 2) * scale,
                            ry: (yMm / 2) * scale,
                            fill: '#ffffff',
                            stroke: '#5c3316',
                            strokeWidth: 0.1,
                            strokeUniform: true,
                            originX: 'center',
                            originY: 'center'
                        });
                        const text = new fabric.Text('1¢', {
                            fontSize: 5 * scale,
                            fill: '#000000',
                            fontFamily: 'Roboto',
                            fontWeight: 'bold',
                            originX: 'center',
                            originY: 'center'
                        });
                        const group = new fabric.Group([ellipse, text], {
                            left: canvas.width / 2,
                            top: canvas.height / 2,
                            originX: 'center',
                            originY: 'center'
                        });
                        group.shapeType = 'currency';
                        group.materialType = 'color';
                        group.currencyType = 'pressed';
                        group.coinValue = value;
                        group.realRx = xMm / 2;
                        group.realRy = yMm / 2;
                        group.setCoords();
                        canvas.add(group);
                        canvas.setActiveObject(group);
                        canvas.requestRenderAll();
                        engineSave();
                    }

                    /* ── Denomination rows ─────────────────────────────── */
                    const currency = CURRENCIES[activeCurrency];
                    // Expand the compact [value, diameter, label?] tuples.
                    const coinList = currency.coins.map(c => Array.isArray(c)
                        ? { label: c[2] || c[0], value: c[0], diameter: c[1] }
                        : c);
                    const denom = mkEl('div', { className: 'd-flex flex-column gap-2 mb-3' });

                    // Add q coins of one denomination (ellipse for pressed pennies,
                    // circle otherwise), record the tally, then tidy into rows.
                    // skipTidy lets "Add all" tally/arrange once at the end instead.
                    const addCoins = (coin, q, skipTidy) => {
                        if (!q || q < 1) return;
                        if (currency.elliptic) {
                            for (let i = 0; i < q; i++) addEllipseCoin(coin.value, coin.x, coin.y);
                        } else {
                            if (typeof addSingleCoin !== 'function') return;
                            for (let i = 0; i < q; i++) addSingleCoin(coin.value, coin.diameter);
                        }
                        Coach.state.coins[coin.value] = (Coach.state.coins[coin.value] || 0) + q;
                        if (!skipTidy) { updateTally(); autoArrangeRows(); }
                    };

                    // rowControls keeps references so "Add all" can iterate them
                    const rowControls = [];

                    coinList.forEach(coin => {
                        const qty = { value: 1 };
                        const row = mkEl('div', { className: 'd-flex align-items-center justify-content-center gap-2' });

                        // Label
                        const lbl = mkEl('span', { className: 'small', textContent: coin.label });
                        lbl.style.minWidth = '52px';
                        row.appendChild(lbl);

                        // Stepper: minus button
                        const minusBtn = mkEl('button', {
                            type: 'button',
                            className: 'btn btn-sm px-2 py-0',
                            textContent: '−'
                        });

                        // Quantity input — typeable for larger amounts (kept in sync with qty)
                        const qtyInput = mkEl('input', {
                            type: 'number', min: '0', step: '1', value: '1',
                            className: 'form-control form-control-sm text-center px-1'
                        });
                        qtyInput.style.width = '50px';
                        const setQty = (v) => {
                            if (isNaN(v) || v < 0) v = 0;
                            qty.value = v;
                            qtyInput.value = v;
                        };
                        qtyInput.addEventListener('input', () => {
                            const v = parseInt(qtyInput.value, 10);
                            qty.value = (isNaN(v) || v < 0) ? 0 : v;
                        });

                        // Plus button
                        const plusBtn = mkEl('button', {
                            type: 'button',
                            className: 'btn btn-sm px-2 py-0',
                            textContent: '+'
                        });

                        minusBtn.addEventListener('click', () => {
                            const v = parseInt(qtyInput.value, 10) || 0;
                            setQty(v > 0 ? v - 1 : 0);
                        });
                        plusBtn.addEventListener('click', () => {
                            const v = parseInt(qtyInput.value, 10) || 0;
                            setQty(v + 1);
                        });

                        row.appendChild(minusBtn);
                        row.appendChild(qtyInput);
                        row.appendChild(plusBtn);

                        // Add button
                        const addBtn = mkEl('button', {
                            type: 'button',
                            className: 'btn btn-sm',
                            textContent: 'Add'
                        });
                        addBtn.addEventListener('click', () => addCoins(coin, parseInt(qty.value, 10)));

                        row.appendChild(addBtn);
                        denom.appendChild(row);

                        // Register for "Add all"
                        rowControls.push({ coin: coin, qtyInput: qty });
                    });
                    el.appendChild(denom);

                    /* ── Custom slot ───────────────────────────────────────
                       Circular currencies: label + diameter (mm).
                       Pressed Penny: label + X and Y dimensions (mm) → ellipse. */
                    const customWrap = mkEl('div', { className: 'mt-1 mb-2' });
                    customWrap.appendChild(mkEl('div', { className: 'small fw-semibold mb-1 text-center', textContent: currency.elliptic ? 'Custom slot' : 'Custom coin' }));
                    const customRow = mkEl('div', { className: 'd-flex align-items-end justify-content-center gap-2' });

                    const labelWrap = mkEl('div');
                    labelWrap.appendChild(mkEl('label', { className: 'form-label small mb-0', textContent: 'Label' }));
                    const customLabel = mkEl('input', { type: 'text', className: 'form-control form-control-sm', placeholder: currency.elliptic ? 'e.g. Penny' : 'e.g. 2€' });
                    customLabel.style.width = currency.elliptic ? '72px' : '90px';
                    labelWrap.appendChild(customLabel);
                    customRow.appendChild(labelWrap);

                    const numInput = (labelText, width) => {
                        const wrap = mkEl('div');
                        wrap.appendChild(mkEl('label', { className: 'form-label small mb-0', textContent: labelText }));
                        const inp = mkEl('input', {
                            type: 'number', min: '1', step: '0.1',
                            className: 'form-control form-control-sm', placeholder: 'mm',
                            style: 'width:' + width
                        });
                        wrap.appendChild(inp);
                        customRow.appendChild(wrap);
                        return inp;
                    };

                    let addCustom;
                    if (currency.elliptic) {
                        const customX = numInput('Width mm', '56px');
                        const customY = numInput('Height mm', '56px');
                        addCustom = () => {
                            const x = parseFloat(customX.value);
                            const y = parseFloat(customY.value);
                            if (!x || x <= 0 || !y || y <= 0) return;
                            addCoins({ value: customLabel.value.trim() || ('Penny ' + x + '×' + y), x: x, y: y }, 1);
                        };
                    } else {
                        const customDia = numInput('Size (mm)', '64px');
                        addCustom = () => {
                            const d = parseFloat(customDia.value);
                            if (!d || d <= 0) return;
                            addCoins({ value: customLabel.value.trim() || 'Coin', diameter: d }, 1);
                        };
                    }
                    const customAdd = mkEl('button', { type: 'button', className: 'btn btn-sm', textContent: 'Add' });
                    customAdd.addEventListener('click', addCustom);
                    customRow.appendChild(customAdd);
                    customWrap.appendChild(customRow);
                    el.appendChild(customWrap);

                    /* ── Auto-arrange helper: tidy coins into rows inside the holder ── */
                    function autoArrangeRows() {
                        if (!cv()) return;
                        const coinCount = canvas.getObjects().filter(o => o.shapeType === 'currency').length;
                        if (coinCount > 1 && typeof Coach.arrange === 'function') {
                            Coach.arrange('rows');
                        }
                    }

                    /* ── Add all (non-zero) button — yellow + centered ─────── */
                    const addAllBtn = mkEl('button', {
                        type: 'button',
                        className: 'btn btn-sm coach-btn-yellow',
                        textContent: 'Add all selected above'
                    });
                    addAllBtn.addEventListener('click', () => {
                        rowControls.forEach(({ coin, qtyInput }) =>
                            addCoins(coin, parseInt(qtyInput.value, 10), true));
                        updateTally();
                        autoArrangeRows();
                    });
                    /* ── Delete all coins ─────────────────────────────────── */
                    const delAllBtn = mkEl('button', {
                        type: 'button',
                        className: 'btn btn-sm coach-btn-red',
                        textContent: 'Delete all coins'
                    });
                    delAllBtn.addEventListener('click', () => {
                        if (!cv()) return;
                        canvas.getObjects()
                            .filter(o => o.shapeType === 'currency')
                            .forEach(o => canvas.remove(o));
                        canvas.discardActiveObject();
                        canvas.requestRenderAll();
                        Coach.state.coins = {};
                        updateTally();
                        engineSave();
                    });

                    const addAllWrap = mkEl('div', { className: 'coach-row coach-row-2 mb-3' });
                    addAllWrap.appendChild(addAllBtn);
                    addAllWrap.appendChild(delAllBtn);
                    el.appendChild(addAllWrap);

                    /* ── Running tally ─────────────────────────────────── */
                    const tallyDiv = mkEl('div', { className: 'small text-muted text-center' });
                    el.appendChild(tallyDiv);

                    function updateTally() {
                        const entries = Object.entries(Coach.state.coins).filter(([, n]) => n > 0);
                        if (entries.length === 0) {
                            tallyDiv.textContent = '';
                        } else {
                            tallyDiv.textContent = 'Added: ' + entries.map(([v, n]) => n + '× ' + v).join(', ');
                        }
                    }
                    updateTally();
                }
            },
            {
                id: 'arrange',
                title: 'Arrange the coins',
                intro: 'Line your coins up neatly — pick a layout below, or just drag them around yourself.',
                optional: false,
                highlight: [],
                renderAction(el) {
                    el.innerHTML = '';

                    el.appendChild(mkEl('p', { className: 'mb-3', textContent: this.intro }));

                    // Nudge element (hidden until a button returns false)
                    const nudge = mkEl('p', {
                        className: 'small text-warning mb-2',
                        textContent: 'Add a holder and some coins first.',
                        style: 'display:none'
                    });
                    el.appendChild(nudge);

                    // Layout buttons — max two per row
                    const btnRow = mkEl('div', { className: 'coach-row coach-row-2 mb-3' });

                    const makeArrangeBtn = (label, iconClass, patternKey) => {
                        const btn = mkEl('button', {
                            type: 'button',
                            className: 'btn btn-sm btn-outline-light',
                            innerHTML: `<i class="${iconClass} me-1"></i>${label}`
                        });
                        btn.addEventListener('click', () => {
                            nudge.style.display = Coach.arrange(patternKey) ? 'none' : '';
                        });
                        return btn;
                    };

                    btnRow.appendChild(makeArrangeBtn('Grid',         'fas fa-th',            'grid'));
                    btnRow.appendChild(makeArrangeBtn('Circle',       'fas fa-circle-notch',  'circle'));
                    btnRow.appendChild(makeArrangeBtn('Rows',         'fas fa-bars',          'rows'));
                    btnRow.appendChild(makeArrangeBtn('Fit to shape', 'fas fa-draw-polygon',  'shape'));

                    // Yellow accent button — moves all coins into tidy rows above the holder.
                    const outsideBtn = makeArrangeBtn('Move coins above the holder', 'fas fa-arrow-up', 'outside');
                    outsideBtn.classList.add('coach-btn-yellow');
                    // Moving coins above the holder can push them out of view — fit then.
                    outsideBtn.addEventListener('click', () => Coach.fitIfNeeded());
                    btnRow.appendChild(outsideBtn);
                    el.appendChild(btnRow);

                    // Hint for the shape-conforming layout
                    el.appendChild(mkEl('p', {
                        className: 'small text-muted mb-2',
                        textContent: "Arrange your coins to follow the holder's shape, then drag any coin to fine-tune."
                    }));
                }
            },
            {
                id: 'personalize',
                title: 'Personalise it',
                intro: 'Make it yours — add a name or message, a country shape, or your own logo.',
                optional: true,
                highlight: [
                    Coach.SELECTORS.text,
                    Coach.SELECTORS.countries,
                    Coach.SELECTORS.imageUpload
                ],
                renderAction(el) {
                    el.innerHTML = '';

                    el.appendChild(mkEl('p', { className: 'mb-1', textContent: this.intro }));
                    el.appendChild(mkEl('p', { className: 'text-muted small mb-3', textContent: 'All optional — add what you like, or move on.' }));

                    /* ── Helper: section label ───────────────────────── */
                    const sectionLabel = (text) => mkEl('div', { className: 'fw-semibold small mb-1 mt-2', textContent: text });

                    /* Capture the next non-coin object added and size it to the holder. */
                    function captureAndSize(mode, engraveFill) {
                        if (!cv()) return;
                        // Snapshot the viewport so we can undo the engine's "auto-centre on add",
                        // which otherwise pans to a JPG/PNG dropped at a fixed corner and shoves the
                        // rest of the design out of the visible frame. Nothing should jump.
                        const savedVP = canvas.viewportTransform ? canvas.viewportTransform.slice() : null;
                        // Only size country outlines / images — never coins or text.
                        Coach.captureNextAdded('size',
                            o => o.shapeType !== 'currency' && o.type !== 'i-text' && o.type !== 'text',
                            (obj) => {
                                Coach.sizeToHolder(obj, mode);
                                // Filled country outlines and uploaded images take the engraving
                                // colour of the holder material (brown on wood, grey on plastic)
                                // and stay in sync on changes.
                                if (engraveFill && typeof Coach.applyEngrave === 'function') {
                                    Coach.applyEngrave(obj, true);
                                    // The preview button must reflect the auto-applied state
                                    // ('Show original colour'), same as auto-engraved text does.
                                    syncTintLabel();
                                }
                                // Keep the coin slots on top — the shape we just added must
                                // never cover a coin.
                                if (typeof Coach.raiseCoinsToFront === 'function') Coach.raiseCoinsToFront();
                                if (savedVP) { canvas.setViewportTransform(savedVP); canvas.requestRenderAll(); }
                            });
                    }

                    /* ── 1. Engraving text ───────────────────────────── */
                    el.appendChild(sectionLabel('Add a name or message'));

                    const textRow = mkEl('div', { className: 'd-flex gap-2 mb-2' });
                    const textInput = mkEl('input', { type: 'text', className: 'form-control form-control-sm', placeholder: 'Your text…' });
                    const addTextBtn = mkEl('button', { className: 'btn btn-sm btn-outline-light text-nowrap', textContent: 'Add text' });
                    addTextBtn.addEventListener('click', () => {
                        if (typeof addText === 'function') {
                            addText();
                            const value = textInput.value.trim();
                            if (value) {
                                const obj = canvas && canvas.getActiveObject
                                    ? canvas.getActiveObject()
                                    : null;
                                if (obj && (obj.type === 'i-text' || obj.type === 'text')) {
                                    obj.set('text', value);
                                    obj.setCoords();
                                    // Engraving text takes the holder material's engrave colour
                                    // (brown on wood, grey on plastic) and stays in sync on changes.
                                    if (typeof Coach.applyEngrave === 'function') Coach.applyEngrave(obj, true);
                                    if (canvas.requestRenderAll) canvas.requestRenderAll();
                                    engineSave();
                                }
                            }
                            // Coins stay on top of any newly-added text too.
                            if (typeof Coach.raiseCoinsToFront === 'function') Coach.raiseCoinsToFront();
                        }
                        // The new text is already shown in the engrave colour, so the
                        // preview button should offer to show its original colour.
                        syncTintLabel();
                    });

                    textRow.appendChild(textInput);
                    textRow.appendChild(addTextBtn);
                    el.appendChild(textRow);

                    /* ── Bend the text (slider → arc, baked to a vector path) ──
                       Acts on the selected text / bent text, or the most recent
                       one. 0 = straight (editable text); ± bends up/down. The
                       opentype bake is async, so slider input is debounced and
                       serialised — the newest value always wins. */
                    // NOTE: no Bootstrap "d-flex" here — its display:flex !important
                    // would override the inline display:none used to hide the row
                    // while no text is selected. Flex comes via inline style instead.
                    const bendRow = mkEl('div', { className: 'gap-2 align-items-center mb-1' });
                    bendRow.style.display = 'none'; // shown only while a text is selected
                    bendRow.style.gap = '8px';
                    bendRow.style.alignItems = 'center';
                    const bendPick = function() {
                        if (!cv()) return null;
                        const a = canvas.getActiveObject();
                        if (a && (a.type === 'text' || a.type === 'i-text' || a.shapeType === 'bentText')) return a;
                        const cands = canvas.getObjects().filter(function(o) {
                            return o.type === 'text' || o.type === 'i-text' || o.shapeType === 'bentText';
                        });
                        return cands.length ? cands[cands.length - 1] : null;
                    };
                    const bendLabel = mkEl('span', { className: 'small text-nowrap' });
                    const bendSlider = mkEl('input', { className: 'form-range' });
                    bendSlider.type = 'range';
                    bendSlider.min = '-100';
                    bendSlider.max = '100';
                    bendSlider.step = '1';
                    const syncBendLabel = function() { bendLabel.textContent = 'Bend: ' + bendSlider.value; };
                    const bendNudge = mkEl('p', { className: 'small text-warning mb-1' });
                    bendNudge.style.display = 'none';
                    let bendTimer = null, bendBusy = false, bendAgain = null;
                    // The slider must track whatever text is (or becomes) the bend
                    // target — selection changes AND project loads/resumes that swap
                    // the canvas content under an already-rendered panel.
                    const syncBendUI = function() {
                        if (bendTimer || bendBusy) return; // don't fight a drag/bake in flight
                        // Only visible while a text / bent text is actually selected.
                        const a = cv() ? canvas.getActiveObject() : null;
                        const isTextish = !!(a && (a.type === 'text' || a.type === 'i-text' || a.shapeType === 'bentText'));
                        bendRow.style.display = isTextish ? 'flex' : 'none';
                        if (!isTextish) {
                            bendNudge.style.display = 'none';
                            return;
                        }
                        bendSlider.value = String(a.bendAmount || 0);
                        syncBendLabel();
                    };
                    syncBendUI();
                    // Handlers self-detach once this panel is replaced by a re-render
                    // (same isConnected pattern as the trim watcher).
                    const bendSyncEvents = ['selection:created', 'selection:updated', 'selection:cleared', 'object:added', 'object:removed'];
                    const onBendSync = function() {
                        if (!bendRow.isConnected) {
                            bendSyncEvents.forEach(function(ev) { canvas.off(ev, onBendSync); });
                            return;
                        }
                        syncBendUI();
                    };
                    if (cv()) bendSyncEvents.forEach(function(ev) { canvas.on(ev, onBendSync); });
                    const applyBend = function(v) {
                        const t = bendPick();
                        if (!t) {
                            bendNudge.textContent = 'Add or select a text first, then bend it.';
                            bendNudge.style.display = '';
                            return;
                        }
                        if ((t.type === 'text' || t.type === 'i-text') && (t.text || '').indexOf('\n') !== -1) {
                            bendNudge.textContent = 'Bending works on single-line text.';
                            bendNudge.style.display = '';
                            return;
                        }
                        bendNudge.style.display = 'none';
                        if (bendBusy) { bendAgain = v; return; }
                        bendBusy = true;
                        Coach.bendText(t, v).then(function() {
                            bendBusy = false;
                            if (bendAgain !== null) {
                                const nv = bendAgain;
                                bendAgain = null;
                                applyBend(nv);
                            }
                        }).catch(function(err) {
                            bendBusy = false;
                            console.warn('bendText failed', err);
                        });
                    };
                    bendSlider.addEventListener('input', function() {
                        syncBendLabel();
                        if (bendTimer) clearTimeout(bendTimer);
                        bendTimer = setTimeout(function() {
                            bendTimer = null; // clear BEFORE the bake so syncBendUI isn't gated forever
                            applyBend(parseInt(bendSlider.value, 10) || 0);
                        }, 180);
                    });
                    bendRow.appendChild(bendLabel);
                    bendRow.appendChild(bendSlider);
                    el.appendChild(bendRow);
                    el.appendChild(bendNudge);

                    /* ── 2. Country outline ──────────────────────────── */
                    el.appendChild(sectionLabel('Add a country shape'));

                    const countryToggleBtn = mkEl('button', { className: 'btn btn-sm btn-outline-light mb-2', textContent: 'Choose country…' });

                    const countryPanel = mkEl('div', { className: 'mb-2', style: 'display:none' });

                    /* Filled / Outline mode toggle */
                    const modeRow = mkEl('div', { className: 'd-flex gap-2 mb-2 align-items-center' });
                    const modeLabel = mkEl('span', { className: 'small text-muted', textContent: 'Style:' });

                    let countryMode = 'filled';   // default: filled

                    // Both green buttons; the selected one gets the light-green ".active" look.
                    const filledBtn = mkEl('button', { className: 'btn btn-sm', innerHTML: '<i class="fas fa-square"></i> Filled' });
                    const outlineBtn = mkEl('button', { className: 'btn btn-sm', innerHTML: '<i class="far fa-square"></i> Outline' });

                    function updateModeButtons() {
                        filledBtn.classList.toggle('active', countryMode === 'filled');
                        outlineBtn.classList.toggle('active', countryMode === 'outline');
                    }
                    updateModeButtons();

                    filledBtn.addEventListener('click', () => { countryMode = 'filled'; updateModeButtons(); });
                    outlineBtn.addEventListener('click', () => { countryMode = 'outline'; updateModeButtons(); });

                    modeRow.appendChild(modeLabel);
                    modeRow.appendChild(filledBtn);
                    modeRow.appendChild(outlineBtn);
                    countryPanel.appendChild(modeRow);

                    countryPanel.appendChild(mkEl('p', {
                        className: 'small text-muted mb-2',
                        textContent: 'Filled = a solid shape · Outline = just the border.'
                    }));

                    /* Country buttons (step 7 adds Europe + World over the base list) */
                    const countries = Coach.COUNTRY_OPTIONS_STEP7;

                    const countryGrid = mkEl('div', { className: 'd-flex flex-wrap gap-1 coach-btns' });

                    countries.forEach(({ key, label }) => {
                        // Same slate-blue accent as the step-2 country buttons.
                        const btn = mkCountryBtn(key, label);
                        btn.addEventListener('click', () => {
                            if (countryMode === 'filled') {
                                captureAndSize(null, true); // size + tint the fill to the material's engrave colour
                                if (typeof addCountry === 'function') addCountry(key);
                            } else {
                                captureAndSize(); // outline: size only, keep its outline colour
                                if (typeof addCountryOutline === 'function') addCountryOutline(key);
                            }
                        });
                        countryGrid.appendChild(btn);
                    });

                    countryPanel.appendChild(countryGrid);

                    countryPanel.appendChild(mkCountrySearch((name, key) => {
                        if (countryMode === 'filled') {
                            captureAndSize(null, true); // size + tint the fill to the material's engrave colour
                            if (typeof addCountry === 'function') addCountry(key);
                        } else {
                            captureAndSize(); // outline: size only, keep its outline colour
                            if (typeof addCountryOutline === 'function') addCountryOutline(key);
                        }
                    }));

                    countryToggleBtn.addEventListener('click', () => {
                        const hidden = countryPanel.style.display === 'none';
                        countryPanel.style.display = hidden ? '' : 'none';
                        countryToggleBtn.textContent = hidden ? 'Hide countries' : 'Choose country…';
                    });

                    const countryToggleRow = mkEl('div', { className: 'coach-row mb-2' });
                    countryToggleRow.appendChild(countryToggleBtn);
                    el.appendChild(countryToggleRow);
                    el.appendChild(countryPanel);

                    /* ── 3. Upload a logo / image ────────────────────── */
                    el.appendChild(sectionLabel('Add a logo or image'));

                    const uploadBtn = mkEl('button', { className: 'btn btn-sm btn-outline-light mb-1', textContent: 'Upload image…' });
                    uploadBtn.addEventListener('click', () => {
                        // Load at the holder's height (aspect preserved) and show the
                        // engraved look right away — the preview button offers the
                        // original colours instead.
                        captureAndSize('height', true);
                        document.getElementById('imageUpload')?.click();
                    });

                    const uploadRow = mkEl('div', { className: 'coach-row' });
                    uploadRow.appendChild(uploadBtn);
                    el.appendChild(uploadRow);

                    // Recolour an image OR text object to the engraving colour and
                    // back. The colour follows the material: brown on wood, light grey
                    // on plastic. Acts on the selected image/text, or the most recent
                    // image if nothing suitable is selected.
                    el.appendChild(sectionLabel('See how it looks engraved'));
                    const tintNudge = mkEl('p', { className: 'small text-warning mb-1' });
                    tintNudge.style.display = 'none';
                    const tintRow = mkEl('div', { className: 'coach-row mt-1' });
                    const tintBtn = mkEl('button', {
                        type: 'button',
                        className: 'btn btn-sm coach-btn-yellow',
                        textContent: 'Preview engraved look'
                    });
                    const pickEngraveTarget = function() {
                        if (!cv()) return null;
                        const active = canvas.getActiveObject();
                        if (active && (active.type === 'image' || active.type === 'text' || active.type === 'i-text' || active.shapeType === 'bentText')) return active;
                        const imgs = canvas.getObjects().filter(function(o) { return o.type === 'image'; });
                        return imgs.length ? imgs[imgs.length - 1] : null;
                    };
                    // Reflect the current target's state in the button label.
                    const syncTintLabel = function() {
                        const t = pickEngraveTarget();
                        tintBtn.textContent = (t && Coach.isEngraved(t)) ? 'Show original colour' : 'Preview engraved look';
                    };
                    tintBtn.addEventListener('click', function() {
                        const t = pickEngraveTarget();
                        if (!t) {
                            tintNudge.textContent = 'Click an image or text on the canvas first, then preview it.';
                            tintNudge.style.display = '';
                            return;
                        }
                        tintNudge.style.display = 'none';
                        Coach.applyEngrave(t, !Coach.isEngraved(t));
                        syncTintLabel();
                    });
                    tintRow.appendChild(tintBtn);
                    el.appendChild(tintRow);
                    el.appendChild(tintNudge);

                    /* ── Trim an overflowing outline to the holder ─────────
                       When a country outline / image / shape extends past the
                       base shape, offer to cut the part that sticks out. The
                       button only shows while that state is observed. */
                    el.appendChild(sectionLabel('Trim to the holder'));
                    const trimNudge = mkEl('p', { className: 'small text-muted mb-1' });
                    trimNudge.textContent = 'If a shape spills over the edge of your holder, this cuts off the part that sticks out.';
                    el.appendChild(trimNudge);
                    const trimRow = mkEl('div', { className: 'coach-row mt-1' });
                    const trimBtn = mkEl('button', {
                        type: 'button',
                        className: 'btn btn-sm coach-btn-yellow',
                        textContent: 'Remove excess'
                    });
                    trimRow.appendChild(trimBtn);
                    el.appendChild(trimRow);
                    // NOTE: `.coach-row` is `display:flex !important`, so a plain
                    // inline `display` can't hide it — we must set/clear with the
                    // `important` priority on both the show and hide paths.
                    const showTrimRow = function(show) {
                        if (show) trimRow.style.setProperty('display', 'flex', 'important');
                        else trimRow.style.setProperty('display', 'none', 'important');
                    };
                    showTrimRow(false);   // shown only when excess is detected

                    // Find the object to trim: the selected candidate if it
                    // overflows, else the topmost overflowing candidate. Builds
                    // the holder silhouette once and reuses it across candidates.
                    const pickExcessTarget = function() {
                        if (!cv()) return null;
                        const holder = Coach.currentHolder();
                        if (!holder) return null;
                        const field = Coach._holderDistanceField(holder);
                        const active = canvas.getActiveObject();
                        if (active && Coach.hasExcessOutside(active, field)) return active;
                        const objs = canvas.getObjects();
                        for (let i = objs.length - 1; i >= 0; i--) {
                            if (Coach.hasExcessOutside(objs[i], field)) return objs[i];
                        }
                        return null;
                    };

                    const updateTrimBtn = function() {
                        // Only work while this step is open and the button is live.
                        const step = Coach.steps[Coach.current];
                        if (!step || step.id !== 'personalize' || !trimRow.isConnected) return;
                        showTrimRow(!!pickExcessTarget());
                    };

                    trimBtn.addEventListener('click', function() {
                        const target = pickExcessTarget();
                        if (!target) { updateTrimBtn(); return; }
                        if (canvas.getActiveObject() !== target) canvas.setActiveObject(target);
                        Coach.removeExcess(target);
                        updateTrimBtn();   // hides now that it's trimmed
                    });

                    // Keep the label correct as the customer selects different objects.
                    // Drop the previous step-render's listeners first so they don't stack.
                    if (cv()) {
                        const SEL_EVENTS = ['selection:created', 'selection:updated', 'selection:cleared'];
                        if (Coach._tintSyncHandler) {
                            SEL_EVENTS.forEach(function(ev) { canvas.off(ev, Coach._tintSyncHandler); });
                        }
                        Coach._tintSyncHandler = syncTintLabel;
                        SEL_EVENTS.forEach(function(ev) { canvas.on(ev, Coach._tintSyncHandler); });

                        // Show/hide "Remove excess" as selection or geometry changes.
                        const TRIM_EVENTS = ['selection:created', 'selection:updated', 'selection:cleared', 'object:modified'];
                        if (Coach._trimHandler) {
                            TRIM_EVENTS.forEach(function(ev) { canvas.off(ev, Coach._trimHandler); });
                        }
                        Coach._trimHandler = updateTrimBtn;
                        TRIM_EVENTS.forEach(function(ev) { canvas.on(ev, Coach._trimHandler); });
                    }
                    syncTintLabel();
                    updateTrimBtn();
                    // Safety net: make sure coins are on top when this step opens,
                    // in case a resumed design has a shape sitting above a slot.
                    if (typeof Coach.raiseCoinsToFront === 'function') Coach.raiseCoinsToFront();
                },
            },
            {
                id: 'fixtures',
                title: 'Add fixtures',
                intro: 'We need to fix all coin holder layers together? Add fixtures, then drag them wherever you like. Finally, choose their finish colour',
                optional: true,
                highlight: [],
                renderAction(el) {
                    el.innerHTML = '';

                    const intro = mkEl('p', { className: 'mb-2', textContent: this.intro });
                    el.appendChild(intro);

                    const nudge = mkEl('p', { className: 'small text-warning mb-2' });
                    nudge.style.display = 'none';
                    el.appendChild(nudge);

                    const row = mkEl('div', { className: 'coach-row coach-row-2 mb-2' });

                    const addBtn = mkEl('button', { type: 'button', className: 'btn btn-sm btn-outline-light', textContent: 'Add fixtures' });
                    addBtn.addEventListener('click', () => {
                        const n = Coach.addFixtures();
                        if (n === false || n == null) {
                            nudge.textContent = 'Add a holder first (step 2).';
                            nudge.style.display = '';
                        } else if (n === 0) {
                            nudge.textContent = 'No room for holes without overlapping the coins — move some coins inward and try again.';
                            nudge.style.display = '';
                        } else {
                            nudge.style.display = 'none';
                        }
                    });

                    // Add one free-floating hole to position by hand.
                    const singleBtn = mkEl('button', { type: 'button', className: 'btn btn-sm btn-outline-light', textContent: 'Add one fixture' });
                    singleBtn.addEventListener('click', () => {
                        if (!cv()) return;
                        const scale = canvas.scale || 1;
                        const fx = Coach.makeFixtureCircle(canvas.width / 2, canvas.height / 2, scale);
                        canvas.add(fx);
                        canvas.setActiveObject(fx); // selected → ready to drag into place
                        canvas.requestRenderAll();
                        engineSave();
                        nudge.style.display = 'none';
                    });

                    const clearBtn = mkEl('button', { type: 'button', className: 'btn btn-sm btn-outline-light', textContent: 'Remove all fixtures' });
                    clearBtn.addEventListener('click', () => {
                        if (!cv()) return;
                        canvas.getObjects().filter(o => o.shapeType === 'fixture').forEach(o => canvas.remove(o));
                        canvas.requestRenderAll();
                        engineSave();
                        nudge.style.display = 'none';
                    });

                    row.appendChild(addBtn);
                    row.appendChild(singleBtn);
                    row.appendChild(clearBtn);
                    el.appendChild(row);

                    // Fixture finish: pick a colour swatch (same style as the plastic
                    // colour swatches in step 3).
                    el.appendChild(mkEl('p', { className: 'small fw-semibold mb-1', textContent: 'Fixture colour' }));
                    const colorRow = mkEl('div', { className: 'd-flex align-items-center flex-wrap gap-2 mb-1' });
                    const current = Coach.fixtureColorKey();
                    const FIXTURE_SWATCHES = [
                        ['silver',     'Silver'],
                        ['black',      'Black'],
                        ['gold',       'Gold'],
                        ['goldBright', 'Bright gold'],
                        ['red',        'Red']
                    ];
                    FIXTURE_SWATCHES.forEach(([key, label]) => {
                        // Plain <button> WITHOUT the .btn class — the coach forces
                        // ".btn{background:#344734!important}", which would mask the swatch.
                        const sw = mkEl('button', { type: 'button', title: label });
                        sw.dataset.fixtureColor = key;
                        sw.style.cssText = 'width:30px;height:30px;border-radius:6px;border:2px solid #888;cursor:pointer;padding:0;';
                        sw.style.background = Coach.FIXTURE_COLORS[key];
                        if (current === key) {
                            sw.style.borderColor = '#344734';
                            sw.style.boxShadow = '0 0 0 3px #cfe3cf';
                        }
                        sw.addEventListener('click', () => {
                            Coach.applyFixtureColor(key);
                            colorRow.querySelectorAll('button[data-fixture-color]').forEach(btn => {
                                const sel = btn.dataset.fixtureColor === key;
                                btn.style.borderColor = sel ? '#344734' : '#888';
                                btn.style.boxShadow = sel ? '0 0 0 3px #cfe3cf' : 'none';
                            });
                        });
                        colorRow.appendChild(sw);
                    });
                    el.appendChild(colorRow);
                },
            },
            {
                id: 'review',
                title: 'Review & order',
                intro: 'Take a look at your design, then download it or ask us for a quote.',
                optional: false,
                highlight: [Coach.SELECTORS.download],
                renderAction(el) {
                    el.innerHTML = '';

                    el.appendChild(mkEl('p', { className: 'mb-3', textContent: this.intro }));

                    /* ── Helper: safe size string ──────────────────────────
                       Reports the actual HOLDER size (the largest shape on the
                       canvas), not the document/canvas sheet size. Converts the
                       holder's current scaled pixel size to mm via canvas.scale,
                       the same conversion the step-2 size inputs use. ── */
                    function sizeString() {
                        if (!cv()) return '—';
                        const scale = canvas.scale ? canvas.scale : 1;

                        // Prefer the resolved holder; fall back to the largest non-coin shape.
                        let holder = Coach.state.holderObj;
                        if ((!holder || canvas.getObjects().indexOf(holder) === -1) && typeof Coach.resolveHolder === 'function') {
                            Coach.resolveHolder();
                            holder = Coach.state.holderObj;
                        }
                        if (!holder || canvas.getObjects().indexOf(holder) === -1) {
                            let best = null, bestArea = -1;
                            canvas.getObjects().forEach(function(o) {
                                if (!o || o.shapeType === 'currency' || !o.getScaledWidth) return; // skip coins
                                const a = o.getScaledWidth() * o.getScaledHeight();
                                if (a > bestArea) { bestArea = a; best = o; }
                            });
                            holder = best;
                        }
                        if (!holder || !holder.getScaledWidth) return '—';

                        const w = holder.getScaledWidth() / scale;
                        const h = holder.getScaledHeight() / scale;
                        if (typeof currentUnit !== 'undefined' && currentUnit === 'inch' && typeof mmToInch !== 'undefined') {
                            return (w * mmToInch).toFixed(2) + ' × ' + (h * mmToInch).toFixed(2) + ' in';
                        }
                        return Math.round(w) + ' × ' + Math.round(h) + ' mm';
                    }

                    /* ── Helper: material label ────────────────────────── */
                    function materialLabel() {
                        const raw = (Coach.state.holderObj && Coach.state.holderObj.materialType)
                            || Coach.state.material
                            || '—';
                        if (raw === 'color') return 'Plastic';
                        if (raw === '—') return '—';
                        return raw.charAt(0).toUpperCase() + raw.slice(1);
                    }

                    /* ── Summary ────────────────────────────────────────── */
                    const summaryDiv = mkEl('div', { className: 'mb-3 p-2 rounded', style: 'background:#f5f5f5; font-size:0.85rem;' });
                    const ul = mkEl('ul', { className: 'mb-0 ps-3' });
                    const addItem = (label, value) =>
                        ul.appendChild(mkEl('li', { innerHTML: '<strong>' + label + ':</strong> ' + value }));

                    /* Holder type & size */
                    addItem('Holder', (Coach.state.holderType || '—') + ', ' + sizeString());

                    /* Material */
                    addItem('Material', materialLabel());

                    /* Coins */
                    const coinItems = [];
                    if (cv()) {
                        const coinTally = {};
                        canvas.getObjects().forEach(function(o) {
                            if (o.shapeType === 'currency') {
                                const key = o.coinValue || 'unknown';
                                coinTally[key] = (coinTally[key] || 0) + 1;
                            }
                        });
                        const keys = Object.keys(coinTally);
                        if (keys.length > 0) {
                            const totalCoins = keys.reduce(function(sum, k) { return sum + coinTally[k]; }, 0);
                            const parts = keys.map(function(k) { return coinTally[k] + ' × ' + k; });
                            coinItems.push(parts.join(', ') + ' (' + totalCoins + ' total)');
                        }
                    }
                    addItem('Coins', coinItems.length ? coinItems[0] : 'No coins yet');

                    /* Extras */
                    if (cv()) {
                        const allObjs = canvas.getObjects();
                        const textCount = allObjs.filter(function(o) { return o.shapeType === 'text'; }).length;
                        const countryCount = allObjs.filter(function(o) { return o.shapeType === 'country'; }).length;
                        const shapeCount = allObjs.filter(function(o) {
                            return ['rectangle', 'circle', 'ellipse',
                                    'rectangle-outline', 'circle-outline', 'ellipse-outline'].indexOf(o.shapeType) !== -1;
                        }).length;
                        let imageCount = allObjs.filter(function(o) {
                            return o.shapeType === 'image' || o.shapeType === 'imported';
                        }).length;
                        if (Coach.state.holderType === 'imported') imageCount = Math.max(0, imageCount - 1);
                        const fixtureCount = allObjs.filter(function(o) { return o.shapeType === 'fixture'; }).length;

                        const extras = [];
                        if (textCount > 0) extras.push(textCount + ' text label' + (textCount > 1 ? 's' : ''));
                        if (countryCount > 0) extras.push(countryCount + ' country outline' + (countryCount > 1 ? 's' : ''));
                        if (shapeCount > 0) extras.push(shapeCount + ' shape' + (shapeCount > 1 ? 's' : ''));
                        if (imageCount > 0) extras.push(imageCount + ' image' + (imageCount > 1 ? 's' : ''));
                        if (fixtureCount > 0) extras.push(fixtureCount + ' fixture' + (fixtureCount > 1 ? 's' : ''));
                        if (extras.length > 0) addItem('Extras', extras.join(', '));
                    }

                    summaryDiv.appendChild(ul);
                    el.appendChild(summaryDiv);

                    /* ── Buttons — identical set/order/look to the right-panel
                       "Finish up" actions. The coach forces
                       ".btn{background:#344734!important}", so each colour is set
                       with !important to match the right-panel Bootstrap colours. */
                    const btnRow = mkEl('div', { className: 'd-flex flex-column gap-2' });

                    const mkActionBtn = function(label, iconClass, bg, fg, border, onClick) {
                        const b = mkEl('button', {
                            type: 'button', className: 'btn btn-sm',
                            innerHTML: '<i class="' + iconClass + '"></i> ' + label
                        });
                        b.style.setProperty('background', bg, 'important');
                        b.style.setProperty('color', fg, 'important');
                        b.style.setProperty('border-color', border, 'important');
                        b.addEventListener('click', onClick);
                        return b;
                    };

                    btnRow.appendChild(mkActionBtn('Request a quote', 'fas fa-paper-plane',
                        '#0d6efd', '#fff', '#0d6efd', function() { Coach.requestQuote(); }));

                    btnRow.appendChild(mkActionBtn('Download your design', 'fas fa-download',
                        '#198754', '#fff', '#198754', function() {
                            if (typeof exportSVG === 'function') Promise.resolve(exportSVG()).catch(function() {});
                        }));

                    btnRow.appendChild(mkActionBtn('Save project to a file', 'fas fa-floppy-disk',
                        '#6c757d', '#fff', '#6c757d', function() { Coach.persist.exportToFile(); }));

                    btnRow.appendChild(mkEl('p', {
                        className: 'small mb-0', style: 'opacity:0.8',
                        textContent: 'Saves an editable copy you can re-open later with “Load a saved project”.'
                    }));

                    btnRow.appendChild(mkActionBtn('Start over', 'fas fa-sync-alt',
                        '#ffc107', '#333', '#e0a800', function() { Coach.startOver(); }));

                    el.appendChild(btnRow);
                }
            }
        ];

        /* ── Reorder: Fixtures comes before Coins ─────────────────────
           Fixture holes are added first so coin placement (Fit to shape)
           can keep coins clear of them. New order:
           Occasion → Holder → Material → Fixtures → Coins → Arrange → Personalize → Review */
        (function reorderFixtures() {
            const fi = Coach.steps.findIndex(s => s.id === 'fixtures');
            if (fi === -1) return;
            const [fx] = Coach.steps.splice(fi, 1);
            const ci = Coach.steps.findIndex(s => s.id === 'coins');
            if (ci === -1) { Coach.steps.push(fx); return; }
            Coach.steps.splice(ci, 0, fx);
        }());

        /* ── Wire navigation buttons ──────────────────────────────── */
        (function wireButtons() {
            const backBtn = document.getElementById('coach-back');
            const nextBtn = document.getElementById('coach-next');
            if (backBtn) backBtn.addEventListener('click', () => Coach.back());
            if (nextBtn) nextBtn.addEventListener('click', () => Coach.next());
        }());

        /* ── Boot ─────────────────────────────────────────────────── */
        window.addEventListener('load', () => Coach.init());
        </script>
        <!-- ═══════════════════════════════════════════════════════
             END COACH CORE
             ═══════════════════════════════════════════════════════ -->
    </body>
    </html>