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
    </head>
    <body>
        <div id="design-tool-wrapper">
            <div class="header-title" style="padding: 8px 0; margin-bottom: 0;">
                <h1 style="font-size: 1.4em; margin: 0; color: white;">Design Your Custom Coin Holder</h1>
            </div>

            <div class="main-layout">
                <!-- Left Sidebar - Tools -->
                <div class="sidebar-left">
                    <div class="tool-panel">
                        <h3>Start with a Template</h3>
                        <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                            <button class="btn btn-sm btn-outline-info" style="flex: 1;" onclick="addTemplate('germany-euro')">
                                <i class="fas fa-layer-group"></i> Rectangle Coin Display
                            </button>
                            <button class="btn btn-sm btn-outline-info" style="flex: 1;" onclick="addTemplate('uk-coins')">
                                <i class="fas fa-layer-group"></i> Circular Coin Display
                            </button>
                            <button class="btn btn-sm btn-outline-info" style="flex: 1;" onclick="addTemplate('memories')">
                                <i class="fas fa-layer-group"></i> Pressed Penny Collection
                            </button>
                        </div>

                        <h3 class="mt-4">Add Coins</h3>
                        <button class="btn btn-outline-warning shape-btn" onclick="addCurrency('euro')">
                            <i class="fas fa-coins"></i> Add All Euro Coins
                        </button>
                        <div class="coin-buttons">
                            <button class="btn btn-sm btn-outline-warning" onclick="addSingleCoin('0.01 €', 16.4)">0.01 €</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="addSingleCoin('0.02 €', 18.9)">0.02 €</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="addSingleCoin('0.05 €', 21.4)">0.05 €</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="addSingleCoin('0.10 €', 19.9)">0.10 €</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="addSingleCoin('0.20 €', 22.4)">0.20 €</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="addSingleCoin('0.50 €', 24.4)">0.50 €</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="addSingleCoin('1 €', 23.4)">1 €</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="addSingleCoin('2 €', 25.75)">2 €</button>
                        </div>

                        <button class="btn btn-outline-warning shape-btn mt-3" onclick="addCurrency('dollar')">
                            <i class="fas fa-coins"></i> Add All US Dollar Coins
                        </button>
                        <div class="coin-buttons">
                            <button class="btn btn-sm btn-outline-warning" onclick="addSingleCoin('1 ¢', 19.25)">1 ¢</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="addSingleCoin('5 ¢', 21.36)">5 ¢</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="addSingleCoin('10 ¢', 18.06)">10 ¢</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="addSingleCoin('25 ¢', 24.41)">25 ¢</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="addSingleCoin('50 ¢', 30.76)">50 ¢</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="addSingleCoin('$ 1', 26.65)">$ 1</button>
                        </div>

                        <button class="btn btn-outline-warning shape-btn mt-3" onclick="addCurrency('pound')">
                            <i class="fas fa-coins"></i> Add All UK Pound Coins
                        </button>
                        <svg style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">
                            <defs>
                                <clipPath id="clip20p" clipPathUnits="objectBoundingBox" transform="scale(0.047453,0.047610) translate(-0.17932,-0.31917)">
                                    <path d="M17.81 18.42 c0.01 -0.01 0.12 -0.08 0.12 -0.09 l0.05 -0.06 c0.03 -0.04 0.03 -0.04 0.07 -0.09 0.52 -0.64 2.00 -2.40 2.35 -3.15 0.19 -0.41 0.54 -1.12 0.67 -1.51 0.52 -1.58 -0.18 -5.09 -0.75 -6.58 -0.84 -2.25 -1.00 -2.48 -2.35 -3.71 -0.59 -0.42 -0.94 -0.66 -1.58 -1.01 l-2.31 -1.06 c-2.74 -1.06 -4.13 -1.17 -6.76 -0.03 -1.26 0.55 -2.16 1.07 -3.23 1.73 -2.32 1.44 -2.97 3.41 -3.77 6.60 -0.30 3.59 -0.33 4.76 2.11 7.74 1.45 1.77 2.90 3.66 5.24 3.93 2.44 0.29 2.83 0.20 5.00 0.07 1.84 -0.11 2.56 -0.22 3.84 -1.46 0.26 -0.25 0.46 -0.43 0.67 -0.65 0.24 -0.25 0.45 -0.42 0.63 -0.69"/>
                                </clipPath>
                                <clipPath id="clip50p" clipPathUnits="objectBoundingBox" transform="scale(0.037179,0.037190) translate(-0.26668,-0.27966)">
                                    <path d="M23.90 4.81 l-3.12 -1.89 c-1.27 -0.77 -5.67 -2.92 -7.31 -2.61 -3.35 0.63 -7.38 2.75 -10.11 4.93 -0.84 0.67 -1.10 2.56 -1.64 3.47 l-0.94 3.24 c-0.10 0.62 -0.20 1.13 -0.27 1.78 -0.32 2.98 -0.51 3.16 0.66 5.15 1.23 2.08 2.87 4.15 4.58 5.89 1.52 1.30 1.90 1.88 4.04 2.12 1.37 0.16 2.48 0.26 3.57 0.28 l0.85 0.00 c1.04 -0.02 2.12 -0.12 3.45 -0.33 1.91 -0.30 1.72 -0.24 2.92 -1.27 2.65 -2.27 4.05 -4.02 5.80 -6.98 1.13 -1.90 0.80 -2.35 0.48 -5.27 -0.38 -2.29 -1.31 -6.73 -2.96 -8.51 z"/>
                                </clipPath>
                                <filter id="coin-outline" x="-10%" y="-10%" width="120%" height="120%">
                                    <feMorphology in="SourceAlpha" operator="dilate" radius="1" result="expanded"/>
                                    <feFlood flood-color="#ffc107" flood-opacity="1" result="color"/>
                                    <feComposite in="color" in2="expanded" operator="in" result="border"/>
                                    <feMerge>
                                        <feMergeNode in="border"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                        </svg>
                        <div class="coin-buttons">
                            <button class="btn btn-sm btn-outline-warning" onclick="addSingleCoin('1p', 20.47)">1p</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="addSingleCoin('2p', 26.06)">2p</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="addSingleCoin('5p', 18.15)">5p</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="addSingleCoin('10p', 24.65)">10p</button>
                            <span class="coin-btn-wrap"><button class="btn btn-sm btn-outline-warning coin-20p" onclick="addSingleCoin('20p', 21.55)">20p</button></span>
                            <span class="coin-btn-wrap"><button class="btn btn-sm btn-outline-warning coin-50p" onclick="addSingleCoin('50p', 27.45)">50p</button></span>
                            <button class="btn btn-sm btn-outline-warning" onclick="addSingleCoin('1£', 23.18)">1£</button>
                            <button class="btn btn-sm btn-outline-warning" onclick="addSingleCoin('2£', 28.55)">2£</button>
                        </div>

                        <h3 class="mt-4">Add Country Outlines</h3>
                        <div class="country-buttons">
                        <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
                            <span style="flex: 1; font-size: 0.9em;">USA</span>
                            <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountry('usa')">
                                <i class="fas fa-map"></i> Solid
                            </button>
                            <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountryOutline('usa')">
                                <i class="far fa-map"></i> Outline
                            </button>
                        </div>
                        <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
                            <span style="flex: 1; font-size: 0.9em;">UK</span>
                            <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountry('uk')">
                                <i class="fas fa-map"></i> Solid
                            </button>
                            <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountryOutline('uk')">
                                <i class="far fa-map"></i> Outline
                            </button>
                        </div>
                        <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
                            <span style="flex: 1; font-size: 0.9em;">Australia</span>
                            <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountry('australia')">
                                <i class="fas fa-map"></i> Solid
                            </button>
                            <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountryOutline('australia')">
                                <i class="far fa-map"></i> Outline
                            </button>
                        </div>
                        <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
                            <span style="flex: 1; font-size: 0.9em;">Canada</span>
                            <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountry('canada')">
                                <i class="fas fa-map"></i> Solid
                            </button>
                            <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountryOutline('canada')">
                                <i class="far fa-map"></i> Outline
                            </button>
                        </div>
                        <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
                            <span style="flex: 1; font-size: 0.9em;">Germany</span>
                            <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountry('germany')">
                                <i class="fas fa-map"></i> Solid
                            </button>
                            <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountryOutline('germany')">
                                <i class="far fa-map"></i> Outline
                            </button>
                        </div>
                        <div style="display: flex; gap: 8px; margin-bottom: 8px; align-items: center;">
                            <span style="flex: 1; font-size: 0.9em;">Italy</span>
                            <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountry('italy')">
                                <i class="fas fa-map"></i> Solid
                            </button>
                            <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addCountryOutline('italy')">
                                <i class="far fa-map"></i> Outline
                            </button>
                        </div>
                        </div>
                        <div style="display: flex; gap: 8px; margin: 8px 0; align-items: center;">
                            <input id="countrySearchInput" list="countrySearchList" class="form-control form-control-sm" style="flex: 2;" placeholder="Search any country…" onfocus="populateCountrySearch()">
                            <datalist id="countrySearchList"></datalist>
                            <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addSearchedCountry(false)">
                                <i class="fas fa-map"></i> Solid
                            </button>
                            <button class="btn btn-sm btn-outline-success" style="flex: 1;" onclick="addSearchedCountry(true)">
                                <i class="far fa-map"></i> Outline
                            </button>
                        </div>

                        <h3 class="mt-4">Add Shapes</h3>
                        <div class="shape-row-label">Filled:</div>
                        <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                            <button class="btn btn-sm btn-outline-primary" style="flex: 1;" onclick="addShape('rectangle')">
                                <i class="fas fa-square"></i> Rectangle
                            </button>
                            <button class="btn btn-sm btn-outline-primary" style="flex: 1;" onclick="addShape('circle')">
                                <i class="fas fa-circle"></i> Circle
                            </button>
                            <button class="btn btn-sm btn-outline-primary" style="flex: 1;" onclick="addShape('ellipse')">
                                <i class="fas fa-circle"></i> Ellipse
                            </button>
                        </div>
                        <div class="shape-row-label">Outline:</div>
                        <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                            <button class="btn btn-sm btn-outline-primary" style="flex: 1;" onclick="addShape('rectangle-outline')">
                                <i class="far fa-square"></i> Rectangle
                            </button>
                            <button class="btn btn-sm btn-outline-primary" style="flex: 1;" onclick="addShape('circle-outline')">
                                <i class="far fa-circle"></i> Circle
                            </button>
                            <button class="btn btn-sm btn-outline-primary" style="flex: 1;" onclick="addShape('ellipse-outline')">
                                <i class="far fa-circle"></i> Ellipse
                            </button>
                        </div>

                        <h3 class="mt-4">Add Text & Images</h3>
                        <button class="btn btn-outline-info shape-btn" onclick="addText()">
                            <i class="fas fa-font"></i> Add Text
                        </button>
                        <button class="btn btn-outline-info shape-btn" onclick="document.getElementById('imageUpload').click()">
                            <i class="fas fa-image"></i> Add Image
                        </button>
                        <input type="file" id="imageUpload" accept="image/png,image/jpg,image/jpeg" style="display:none;">
                        <button class="btn btn-outline-info shape-btn" onclick="document.getElementById('fileImport').click()">
                            <i class="fas fa-file-import"></i> Import Design File
                        </button>
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
                                <select id="canvasSizeToolbar" class="form-select mb-2">
                                    <option value="a4">A4 (210 x 297 mm)</option>
                                    <option value="a3">A3 (297 x 420 mm)</option>
                                    <option value="a2">A2 (420 x 594 mm)</option>
                                    <option value="a1">A1 (594 x 841 mm)</option>
                                    <option value="custom" selected>Custom Size</option>
                                </select>
                                <div id="customSizeInputsToolbar" style="display:block; margin-top:8px;">
                                    <label class="form-label" style="color: #333; font-size: 12px;" id="customSizeLabelToolbar">Enter dimensions in mm:</label>
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
                                Choose a template to get started,<br>or add shapes from the left panel
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Right Sidebar - Properties -->
                <div class="sidebar-right">
                    <div class="tool-panel">
                        <h3>Object Properties</h3>
                        <div id="propertiesPanel">
                            <p class="text-muted">Select an object to edit its properties</p>
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
                                <div style="display: flex; gap: 6px; margin-bottom: 4px;">
                                <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" onclick="alignToCircle()" title="Align to outer circle — snap each outer edge onto the common circle, keeping angles"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="2.5" r="2"/><circle cx="12.8" cy="5.3" r="2"/><circle cx="12.8" cy="10.8" r="2"/></svg></button>
                                <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" onclick="distributeOnCircle()" title="Space evenly on outer circle — equal angles, outer edges on the circle"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="2.5" r="2"/><circle cx="12.8" cy="10.8" r="2"/><circle cx="3.2" cy="10.8" r="2"/></svg></button>
                                <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" onclick="distributeOnCircleGaps()" title="Equal gaps on outer circle — even edge-to-edge spacing between slots of mixed sizes"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="8" cy="8" r="5.5" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="2.5" r="2.4"/><circle cx="12.9" cy="10.4" r="1.4"/><circle cx="3.1" cy="10.4" r="1.4"/></svg></button>
                                <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" id="distributeArcBtn" onclick="distributeOnArc()" title="Distribute on arc — first and last slot stay put, the rest spaced with equal gaps between them on the circular path"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M 3 12.5 A 5.5 5.5 0 1 1 13 12.5" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="3" cy="12.5" r="2"/><circle cx="13" cy="12.5" r="2"/><circle cx="8" cy="2.5" r="1.5"/></svg></button>
                                </div>
                            </div>
                        </div>
                        <div class="property-panel" id="groupSection" style="display:none;">
                            <div class="control-group">
                                <label style="white-space: nowrap; font-size: 0.85em; font-family: 'IvyMode', 'Times New Roman', serif;">Group:</label>
                                <div style="display: flex; gap: 6px; margin-bottom: 4px;">
                                <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" id="groupBtn" onclick="groupSelected()" title="Group the selected objects — they move and scale as one (Ctrl+G)"><i class="fas fa-object-group"></i> Group</button>
                                <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" id="ungroupBtn" onclick="ungroupSelected()" title="Split the selected group back into separate objects (Ctrl+Shift+G)"><i class="fas fa-object-ungroup"></i> Ungroup</button>
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
                            <div class="control-group" id="cornerRadiusRotationGroup" style="display: flex; gap: 8px;">
                                <div style="flex: 1;" id="cornerRadiusGroup">
                                    <label style="white-space: nowrap; font-size: 0.85em;">Corner Roundness:</label>
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
                                    <label>Color:</label>
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
                                    <label>Outline:</label>
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
                                <label class="mt-2">Text Content:</label>
                                <input type="text" id="textContent">
                            </div>
                            <button class="btn btn-success w-100 mt-3" onclick="duplicateSelected()">
                                <i class="fas fa-copy"></i> Duplicate (Ctrl+D)
                            </button>
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
                            <!-- Image crop — visible only while an image (or its crop frame) is selected -->
                            <div id="cropSection" style="display:none; margin-top: 4px;">
                                <div id="cropStartRow" style="display: flex; gap: 4px;">
                                    <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" onclick="startCrop()" title="Crop the image — position the frame, then Apply">
                                        <i class="fas fa-crop-alt"></i> Crop image
                                    </button>
                                    <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" id="cropResetBtn" onclick="resetCrop()" title="Restore the full uncropped image">
                                        <i class="fas fa-expand"></i> Reset
                                    </button>
                                </div>
                                <div id="cropActiveRow" style="display: none; gap: 4px;">
                                    <button class="btn btn-sm btn-success" style="flex: 1;" onclick="applyCrop()">
                                        <i class="fas fa-check"></i> Apply crop
                                    </button>
                                    <button class="btn btn-sm btn-outline-secondary" style="flex: 1;" onclick="cancelCrop()">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                            <button class="btn btn-danger w-100 mt-2" onclick="deleteSelected()">
                                <i class="fas fa-trash"></i> Delete (Del)
                            </button>
                        </div>
                        
                        <h3 class="mt-4">Actions</h3>
                        <button class="btn btn-warning w-100 mb-2" onclick="clearCanvas()">
                            <i class="fas fa-sync-alt"></i> Start Over
                        </button>
                        <button class="btn btn-success w-100 mb-2" id="downloadBtn">
                            <i class="fas fa-download"></i> Download as SVG
                        </button>
                    </div>
                </div>
            </div>

            <!-- Tips & Shortcuts -->
            <!-- 80px top padding clears the 60px sticky footer + breathing room -->
            <div style="max-width: 1800px; margin: 0 auto; padding: 80px 20px 20px;">
                <div class="tool-panel">
                    <h3>Tips & Shortcuts</h3>
                    <div style="display: flex; gap: 40px; flex-wrap: wrap;">
                        <div>
                            <h5 style="font-size: 0.95em;">How to use</h5>
                            <ol style="font-size: 0.85em; padding-left: 1.2em; margin: 0;">
                                <li>Choose a template or add shapes from the left panel</li>
                                <li>Click an object to select it — drag to move, use handles to resize or rotate</li>
                                <li>Adjust fill, stroke, and material in the right panel</li>
                                <li>Use <strong>Undo</strong> / <strong>Redo</strong> buttons (or keyboard shortcuts) to step through changes</li>
                                <li>Click <strong>Request a Quote</strong> when your design is ready</li>
                            </ol>
                        </div>
                        <div>
                            <h5 style="font-size: 0.95em;">Keyboard Shortcuts</h5>
                            <table style="font-size: 0.85em;">
                                <tr><td style="padding: 2px 12px 2px 0;"><kbd>Delete</kbd> or <kbd>Backspace</kbd></td><td>Remove selected objects</td></tr>
                                <tr><td style="padding: 2px 12px 2px 0;"><kbd>Ctrl + D</kbd></td><td>Duplicate selected objects</td></tr>
                                <tr><td style="padding: 2px 12px 2px 0;"><kbd>Ctrl + G</kbd></td><td>Group selected objects</td></tr>
                                <tr><td style="padding: 2px 12px 2px 0;"><kbd>Ctrl + Shift + G</kbd></td><td>Ungroup the selected group</td></tr>
                                <tr><td style="padding: 2px 12px 2px 0;"><kbd>C</kbd></td><td>Align horizontal centres (multiple objects selected)</td></tr>
                                <tr><td style="padding: 2px 12px 2px 0;"><kbd>E</kbd></td><td>Align vertical centres (multiple objects selected)</td></tr>
                                <tr><td style="padding: 2px 12px 2px 0;"><kbd>Ctrl + Z</kbd></td><td>Undo</td></tr>
                                <tr><td style="padding: 2px 12px 2px 0;"><kbd>Ctrl + Y</kbd></td><td>Redo</td></tr>
                            </table>

                            <h5 style="font-size: 0.95em; margin-top: 16px;">Mouse Controls</h5>
                            <table style="font-size: 0.85em;">
                                <tr><td style="padding: 2px 12px 2px 0;">Ctrl + Scroll wheel</td><td>Zoom in/out</td></tr>
                                <tr><td style="padding: 2px 12px 2px 0;">Alt/Ctrl + drag</td><td>Pan the canvas</td></tr>
                            </table>
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
            <!-- Sticky Footer: Request Quote -->
            <div class="sticky-footer">
                <button class="btn btn-light" id="quoteBtnFooter" onclick="showQuoteForm()">
                    <i class="fas fa-envelope"></i> Request Quote
                </button>
            </div>
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
                    // Coins keep their fixed look — a white slot with a black value
                    // label — so never recolour a coin or its text via the board
                    // material cascade (covers round coins AND special path coins
                    // like the UK 20p/50p, plus their grouped labels).
                    if (obj.shapeType === 'currency') return;

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
                        if (isCircle) return;
                        if (o.fill === 'transparent') {
                            // Decorative border outline (e.g. the offset inner rect):
                            // keep the fill transparent and only recolour the stroke,
                            // mirroring applyFill's grouped-outline handling so a
                            // standalone outline behaves like a grouped one.
                            o.set('stroke', fillType === 'color' ? '#ffffff' : '#5c3316');
                        } else {
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
            // cursor (inline SVG, counter-clockwise arrow).
            (function setRotationCursor() {
                if (typeof fabric === 'undefined' || !fabric.Object ||
                    !fabric.Object.prototype.controls || !fabric.Object.prototype.controls.mtr) return;
                const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">'
                    + '<path d="M12 4a8 8 0 1 0 7.7 5.9" fill="none" stroke="black" stroke-width="2" stroke-linecap="round"/>'
                    + '<path d="M12 0.5 17 4 12 7.5z" fill="black"/>'
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
                    canvas.on(ev, updateGroupPanel);
                    canvas.on(ev, updateCropButtons);
                });
                // Leaving the crop frame (selecting something else, clicking
                // empty canvas, or deleting the frame) aborts crop mode.
                ['selection:updated', 'selection:cleared'].forEach(function(ev) {
                    canvas.on(ev, function() {
                        if (cropState && canvas.getActiveObject() !== cropState.rect) endCrop();
                    });
                });
                canvas.on('object:removed', function(e) {
                    if (cropState && e.target === cropState.rect) {
                        cropState = null;
                        updateCropButtons();
                    }
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
            
            // Country search: datalist is filled on first focus (triggers the
            // dataset fetch); a prefetch failure only warns — the alert path
            // belongs to actual add clicks.
            let countrySearchPopulated = false;
            function populateCountrySearch() {
                if (countrySearchPopulated) return;
                getCountryNames().then(names => {
                    const dl = document.getElementById('countrySearchList');
                    dl.innerHTML = '';
                    names.forEach(n => {
                        const o = document.createElement('option');
                        o.value = n;
                        dl.appendChild(o);
                    });
                    countrySearchPopulated = true;
                }).catch(err => console.warn('Country list prefetch failed', err));
            }
            function addSearchedCountry(outline) {
                const input = document.getElementById('countrySearchInput');
                const name = input.value.trim();
                if (!name) return;
                if (outline) { addCountryOutline(name); } else { addCountry(name); }
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
                        // Part of the template, not a user addition — the step-8
                        // review counts these as penny slots, not generic shapes.
                        ellipse.isTemplateSlot = true;
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
            /* Toolbar zoom anchors on the coin holder's centre, so zooming in
               dives into the design and zooming out backs away from it —
               setZoom alone anchors at the screen origin and walked the design
               off toward a corner. Holder = the Coach-tracked holder when
               available, else the largest non-coin/non-fixture/non-text object
               (template boards included); with no holder at all, the view
               centre. If the holder's centre is off-screen the zoom recentres
               it, so zooming always converges on the design. */
            function zoomAboutHolder(zoom) {
                let holder = (typeof Coach !== 'undefined' && Coach.state) ? Coach.state.holderObj : null;
                if (!holder || canvas.getObjects().indexOf(holder) === -1) {
                    let bestA = -1;
                    holder = null;
                    canvas.getObjects().forEach(function(o) {
                        if (o.shapeType === 'currency' || o.shapeType === 'fixture' ||
                            o.type === 'text' || o.type === 'i-text') return;
                        const a = o.getScaledWidth() * o.getScaledHeight();
                        if (a > bestA) { bestA = a; holder = o; }
                    });
                }
                const vw = canvas.getWidth(), vh = canvas.getHeight();
                if (!holder) {
                    canvas.zoomToPoint(new fabric.Point(vw / 2, vh / 2), zoom);
                    canvas.requestRenderAll();
                    return;
                }
                const hr = holder.getBoundingRect(false, true); // screen coords
                const hx = hr.left + hr.width / 2, hy = hr.top + hr.height / 2;
                if (hx >= 0 && hx <= vw && hy >= 0 && hy <= vh) {
                    // Holder centre visible: keep it pinned while zooming.
                    canvas.zoomToPoint(new fabric.Point(hx, hy), zoom);
                } else {
                    // Holder centre off-screen: zoom AND recentre on it.
                    const ar = holder.getBoundingRect(true, true); // scene coords
                    const cx = ar.left + ar.width / 2, cy = ar.top + ar.height / 2;
                    canvas.setViewportTransform([zoom, 0, 0, zoom, vw / 2 - cx * zoom, vh / 2 - cy * zoom]);
                }
                canvas.requestRenderAll();
            }

            function zoomIn() {
                let zoom = canvas.getZoom();
                zoom *= 1.2;
                if (zoom > 5) zoom = 5;
                zoomAboutHolder(zoom);
            }

            function zoomOut() {
                let zoom = canvas.getZoom();
                zoom /= 1.2;
                if (zoom < 0.2) zoom = 0.2;
                zoomAboutHolder(zoom);
            }
            
            function resetZoom() {
                canvas.setZoom(1);
                canvas.viewportTransform = [1, 0, 0, 1, 0, 0];
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
                
                // Material preset - hide for multiple selections
                if (obj.type === 'activeSelection') {
                    document.getElementById('materialPresetGroup').style.display = 'none';
                    // Show fill color controls for multiple selections (always solid color)
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
                    
                    // Set dropdown to closest match or default to white
                    const fillColorDropdown = document.getElementById('fillColor');
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
                        // Default to white if color not in list
                        fillColorDropdown.value = '#FFFFFF';
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
                    // Rotate about the bounding-box centre. set('angle') alone
                    // spins around the transform origin — top-left for a
                    // multi-selection — which orbited the whole selection
                    // around its corner instead of turning in place.
                    const center = obj.getCenterPoint();
                    obj.set('angle', parseFloat(this.value));
                    obj.setPositionByOrigin(center, 'center', 'center');
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
                const distA = document.getElementById('distributeArcBtn');
                if (distH) distH.disabled = n < 3; // nothing between first and last
                if (distV) distV.disabled = n < 3;
                if (distA) distA.disabled = n < 3;
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

            /* ── Circle alignment ───────────────────────────────────────────
               Fit a ring to the selected objects: centre from a least-squares
               (Kåsa) circle fit through the object centres (centroid fallback
               when the fit is degenerate, e.g. collinear centres), radius set
               so the ring wraps the objects' OUTER edges — the mean of
               (centre distance + outer radius) over the selection. */
            function fitOuterRing(items) {
                const pts = items.map(i => ({ x: i.r.left + i.r.width / 2, y: i.r.top + i.r.height / 2 }));
                const n = pts.length;
                let cx = 0, cy = 0;
                pts.forEach(p => { cx += p.x / n; cy += p.y / n; });
                if (n >= 3) {
                    // Kåsa fit on centroid-shifted coords (numerically stable).
                    let Suu = 0, Svv = 0, Suv = 0, Suz = 0, Svz = 0;
                    pts.forEach(p => {
                        const u = p.x - cx, v = p.y - cy, z = u * u + v * v;
                        Suu += u * u; Svv += v * v; Suv += u * v;
                        Suz += u * z; Svz += v * z;
                    });
                    const det = Suu * Svv - Suv * Suv;
                    if (Math.abs(det) > 1e-6) {
                        cx += (Suz * Svv - Svz * Suv) / (2 * det);
                        cy += (Svz * Suu - Suz * Suv) / (2 * det);
                    }
                }
                let R = 0;
                items.forEach((it, k) => {
                    R += Math.hypot(pts[k].x - cx, pts[k].y - cy) + Math.max(it.r.width, it.r.height) / 2;
                });
                R /= n;
                // Refine with Gauss-Newton on the OUTER-EDGE residual
                // (‖p−c‖ + r − R): the centre fit above is biased when the coin
                // radii differ. Zero residual after an align also makes a repeat
                // click a true no-op instead of drifting a couple of px.
                const rad = items.map(it => Math.max(it.r.width, it.r.height) / 2);
                const det3 = m => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
                                - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
                                + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
                for (let iter = 0; iter < 12; iter++) {
                    let Sxx = 0, Sxy = 0, Sx = 0, Syy = 0, Sy = 0, Sn = 0;
                    let Bx = 0, By = 0, Br = 0, maxE = 0;
                    for (let k = 0; k < n; k++) {
                        const ddx = pts[k].x - cx, ddy = pts[k].y - cy;
                        const d = Math.hypot(ddx, ddy);
                        if (d < 1e-6) continue;
                        const ux = ddx / d, uy = ddy / d;
                        const e = d + rad[k] - R;
                        maxE = Math.max(maxE, Math.abs(e));
                        Sxx += ux * ux; Sxy += ux * uy; Sx += ux;
                        Syy += uy * uy; Sy += uy; Sn += 1;
                        Bx += ux * e; By += uy * e; Br += e;
                    }
                    const M = [[Sxx, Sxy, Sx], [Sxy, Syy, Sy], [Sx, Sy, Sn]];
                    const D = det3(M);
                    if (maxE < 1e-3 || Math.abs(D) < 1e-9) break;
                    const b = [Bx, By, Br];
                    const solve = col => det3(M.map((row, i) => row.map((v, j) => j === col ? b[i] : v))) / D;
                    cx += solve(0); cy += solve(1); R += solve(2);
                }
                return { cx: cx, cy: cy, R: R, pts: pts };
            }

            // Snap each selected object radially so its OUTER edge sits on the
            // fitted ring; every object keeps its current angle from the centre.
            function alignToCircle() {
                const sel = canvas.getActiveObject();
                if (!sel || sel.type !== 'activeSelection') return;
                const items = sel.getObjects().map(o => ({ o, r: o.getBoundingRect(true, true) }));
                if (items.length < 2) return;
                const ring = fitOuterRing(items);
                items.forEach((it, k) => {
                    const p = ring.pts[k];
                    const ang = Math.atan2(p.y - ring.cy, p.x - ring.cx); // centre-coincident → pushed right
                    const d = Math.max(ring.R - Math.max(it.r.width, it.r.height) / 2, 0);
                    const dx = ring.cx + Math.cos(ang) * d - p.x;
                    const dy = ring.cy + Math.sin(ang) * d - p.y;
                    if (dx || dy) {
                        it.o.set({ left: it.o.left + dx, top: it.o.top + dy });
                        it.o.setCoords();
                    }
                });
                refreshSelectionFrame();
                canvas.requestRenderAll();
                saveState();
            }

            // Like alignToCircle, but the angles are redistributed into equal
            // steps around the ring. The current angular ORDER is kept and the
            // first object (smallest angle) anchors the pattern, so a second
            // click changes nothing.
            function distributeOnCircle() {
                const sel = canvas.getActiveObject();
                if (!sel || sel.type !== 'activeSelection') return;
                const items = sel.getObjects().map(o => ({ o, r: o.getBoundingRect(true, true) }));
                if (items.length < 2) return;
                const ring = fitOuterRing(items);
                const order = items.map((it, k) => ({
                    it: it,
                    p: ring.pts[k],
                    ang: Math.atan2(ring.pts[k].y - ring.cy, ring.pts[k].x - ring.cx)
                })).sort((a, b) => a.ang - b.ang);
                const step = 2 * Math.PI / order.length;
                order.forEach((w, idx) => {
                    const ang = order[0].ang + idx * step;
                    const d = Math.max(ring.R - Math.max(w.it.r.width, w.it.r.height) / 2, 0);
                    const dx = ring.cx + Math.cos(ang) * d - w.p.x;
                    const dy = ring.cy + Math.sin(ang) * d - w.p.y;
                    if (dx || dy) {
                        w.it.o.set({ left: w.it.o.left + dx, top: w.it.o.top + dy });
                        w.it.o.setCoords();
                    }
                });
                refreshSelectionFrame();
                canvas.requestRenderAll();
                saveState();
            }

            // Like distributeOnCircle, but instead of equal ANGLE steps the
            // slots get equal edge-to-edge GAPS along the ring — with mixed
            // diameters that is what reads as "evenly spaced" to the eye.
            // For a common gap g each adjacent pair's angle step follows from
            // the law of cosines (chord between centres = r_i + r_j + g); the
            // step sum is monotone in g, so bisect g until the steps close the
            // full 360°. Order and anchor rules match distributeOnCircle, so a
            // second click changes nothing.
            function distributeOnCircleGaps() {
                const sel = canvas.getActiveObject();
                if (!sel || sel.type !== 'activeSelection') return;
                const items = sel.getObjects().map(o => ({ o, r: o.getBoundingRect(true, true) }));
                if (items.length < 2) return;
                const ring = fitOuterRing(items);
                const order = items.map((it, k) => ({
                    it: it,
                    p: ring.pts[k],
                    rad: Math.max(it.r.width, it.r.height) / 2,
                    ang: Math.atan2(ring.pts[k].y - ring.cy, ring.pts[k].x - ring.cx)
                })).sort((a, b) => a.ang - b.ang);
                const n = order.length;
                const dist = order.map(w => Math.max(ring.R - w.rad, 1e-6)); // centre distances
                const stepsFor = (g) => {
                    const steps = [];
                    for (let k = 0; k < n; k++) {
                        const a = dist[k], b = dist[(k + 1) % n];
                        const chord = order[k].rad + order[(k + 1) % n].rad + g;
                        let c = (a * a + b * b - chord * chord) / (2 * a * b);
                        c = Math.max(-1, Math.min(1, c));
                        steps.push(Math.acos(c));
                    }
                    return steps;
                };
                const total = (g) => stepsFor(g).reduce((s, v) => s + v, 0);
                // Bisect the gap; negative = crowded ring, slots overlap as a best fit.
                let lo = -2 * Math.min.apply(null, order.map(w => w.rad));
                let hi = 4 * ring.R;
                for (let i = 0; i < 60; i++) {
                    const mid = (lo + hi) / 2;
                    if (total(mid) < 2 * Math.PI) lo = mid; else hi = mid;
                }
                const steps = stepsFor((lo + hi) / 2);
                let ang = order[0].ang; // first (smallest-angle) slot anchors the pattern
                order.forEach((w, idx) => {
                    if (idx > 0) ang += steps[idx - 1];
                    const d = Math.max(ring.R - w.rad, 0);
                    const dx = ring.cx + Math.cos(ang) * d - w.p.x;
                    const dy = ring.cy + Math.sin(ang) * d - w.p.y;
                    if (dx || dy) {
                        w.it.o.set({ left: w.it.o.left + dx, top: w.it.o.top + dy });
                        w.it.o.setCoords();
                    }
                });
                refreshSelectionFrame();
                canvas.requestRenderAll();
                saveState();
            }

            /* ── Group / Ungroup ──────────────────────────────────────────
               Coins (shapeType 'currency') are protected: they are groups
               internally (slot + value label) and must never be split. */
            function canUngroup(obj) {
                return !!obj && obj.type === 'group' && obj.shapeType !== 'currency';
            }

            function updateGroupPanel() {
                const el = document.getElementById('groupSection');
                if (!el || !canvas) return;
                const a = canvas.getActiveObject();
                const n = (a && a.type === 'activeSelection') ? a.getObjects().length : 0;
                const ungroupable = canUngroup(a);
                el.style.display = (n >= 2 || ungroupable) ? 'block' : 'none';
                const gBtn = document.getElementById('groupBtn');
                const uBtn = document.getElementById('ungroupBtn');
                if (gBtn) gBtn.disabled = n < 2;
                if (uBtn) uBtn.disabled = !ungroupable;
            }

            function groupSelected() {
                const sel = canvas.getActiveObject();
                if (!sel || sel.type !== 'activeSelection') return;
                const group = sel.toGroup();
                if (!group.shapeType) group.shapeType = 'group';
                group.setCoords();
                // toGroup re-adds objects, which queues the off-view auto-fit —
                // a structural regroup must never move the view. Drop the queue
                // before the deferred check runs.
                if (canvas._autoFitQueue) canvas._autoFitQueue = [];
                canvas.requestRenderAll();
                updatePropertiesPanel();
                updateAlignPanel();
                updateGroupPanel();
                saveState();
            }

            function ungroupSelected() {
                const obj = canvas.getActiveObject();
                if (!canUngroup(obj)) return;
                const sel = obj.toActiveSelection();
                if (sel) sel.setCoords();
                // toActiveSelection re-adds every member, which queues the
                // off-view auto-fit — ungrouping must never move the view.
                if (canvas._autoFitQueue) canvas._autoFitQueue = [];
                canvas.requestRenderAll();
                updatePropertiesPanel();
                updateAlignPanel();
                updateGroupPanel();
                saveState();
            }

            // Circular analogue of the linear distribute: the FIRST and LAST
            // slot keep their angles (snapped radially onto the ring like the
            // other circle tools), and the slots between them are spaced with
            // EQUAL EDGE-TO-EDGE GAPS along the arc. On a closed circle
            // "first" and "last" are found from the largest angular gap
            // between adjacent slots — the selection occupies the arc that is
            // its complement.
            function distributeOnArc() {
                const sel = canvas.getActiveObject();
                if (!sel || sel.type !== 'activeSelection') return;
                const items = sel.getObjects().map(o => ({ o, r: o.getBoundingRect(true, true) }));
                if (items.length < 3) return; // nothing between first and last
                const ring = fitOuterRing(items);
                const order = items.map((it, k) => ({
                    it: it,
                    p: ring.pts[k],
                    rad: Math.max(it.r.width, it.r.height) / 2,
                    ang: Math.atan2(ring.pts[k].y - ring.cy, ring.pts[k].x - ring.cx)
                })).sort((a, b) => a.ang - b.ang);
                const n = order.length;
                // Largest gap between angular neighbours (incl. the wrap-around)
                let gapIdx = n - 1;
                let gapMax = order[0].ang + 2 * Math.PI - order[n - 1].ang;
                for (let i = 0; i < n - 1; i++) {
                    const g = order[i + 1].ang - order[i].ang;
                    if (g > gapMax) { gapMax = g; gapIdx = i; }
                }
                // The slot just AFTER the gap is "first"; walk the arc from there.
                const seq = order.slice(gapIdx + 1).concat(order.slice(0, gapIdx + 1));
                let span = seq[n - 1].ang - seq[0].ang;
                if (span <= 0) span += 2 * Math.PI; // arc crosses the ±180° seam
                // Equal edge-to-edge gaps: for a common gap g the angular step
                // between an adjacent pair follows from the law of cosines
                // (chord between centres = r_i + r_j + g) and the step sum is
                // monotone in g — bisect g until the n−1 steps fill the arc
                // span exactly, so the last slot lands back on its own angle.
                const dist = seq.map(w => Math.max(ring.R - w.rad, 1e-6));
                const stepsFor = (g) => {
                    const steps = [];
                    for (let i = 0; i < n - 1; i++) {
                        const a = dist[i], b = dist[i + 1];
                        const chord = seq[i].rad + seq[i + 1].rad + g;
                        let c = (a * a + b * b - chord * chord) / (2 * a * b);
                        c = Math.max(-1, Math.min(1, c));
                        steps.push(Math.acos(c));
                    }
                    return steps;
                };
                const total = (g) => stepsFor(g).reduce((s, v) => s + v, 0);
                let lo = -2 * Math.min.apply(null, seq.map(w => w.rad));
                let hi = 4 * ring.R;
                for (let i = 0; i < 60; i++) {
                    const mid = (lo + hi) / 2;
                    if (total(mid) < span) lo = mid; else hi = mid;
                }
                const steps = stepsFor((lo + hi) / 2);
                let ang = seq[0].ang;
                seq.forEach((w, idx) => {
                    if (idx > 0) ang += steps[idx - 1];
                    const d = Math.max(ring.R - w.rad, 0);
                    const dx = ring.cx + Math.cos(ang) * d - w.p.x;
                    const dy = ring.cy + Math.sin(ang) * d - w.p.y;
                    if (dx || dy) {
                        w.it.o.set({ left: w.it.o.left + dx, top: w.it.o.top + dy });
                        w.it.o.setCoords();
                    }
                });
                refreshSelectionFrame();
                canvas.requestRenderAll();
                saveState();
            }

            /* ── Image crop ───────────────────────────────────────────────
               Crop mode drops a dashed frame over the selected image; the
               user positions it with fabric's NORMAL selection handles (no
               custom drag machinery), then Apply computes the framed region
               in the image's own local space and applies it via fabric's
               native cropX/cropY. Fully non-destructive: no re-encoding, the
               engrave filters keep working, cropX/cropY serialize with
               project saves, and Reset restores the full bitmap any time. */
            let cropState = null; // { img, rect } while crop mode is active

            function updateCropButtons() {
                const section = document.getElementById('cropSection');
                if (!section || !canvas) return;
                const obj = canvas.getActiveObject();
                const isImg = !!obj && obj.type === 'image';
                const cropping = !!cropState;
                section.style.display = (isImg || cropping) ? 'block' : 'none';
                document.getElementById('cropStartRow').style.display  = cropping ? 'none' : 'flex';
                document.getElementById('cropActiveRow').style.display = cropping ? 'flex' : 'none';
                const resetBtn = document.getElementById('cropResetBtn');
                if (resetBtn) {
                    let cropped = false;
                    if (isImg && obj._element) {
                        const el = obj._element;
                        cropped = (obj.cropX || 0) !== 0 || (obj.cropY || 0) !== 0 ||
                                  obj.width  !== (el.naturalWidth  || el.width) ||
                                  obj.height !== (el.naturalHeight || el.height);
                    }
                    resetBtn.disabled = !cropped;
                }
            }

            function startCrop() {
                const img = canvas.getActiveObject();
                if (!img || img.type !== 'image' || cropState) return;
                const br = img.getBoundingRect(true, true);
                const rect = new fabric.Rect({
                    left: br.left + br.width / 2,
                    top:  br.top + br.height / 2,
                    width: br.width, height: br.height,
                    originX: 'center', originY: 'center',
                    fill: 'rgba(52,71,52,0.15)',
                    stroke: '#344734', strokeWidth: 1,
                    strokeUniform: true, strokeDashArray: [6, 4],
                    lockRotation: true,
                    excludeFromExport: true // never serialized or exported
                });
                rect.shapeType = 'cropTool';
                rect.setControlsVisibility({ mtr: false }); // no rotate handle
                // The frame inherits the image's Keep-proportions state: locked →
                // proportional corner-only resize, unlocked → free resize with
                // side handles. Set BEFORE selecting so the builder's aspect
                // sync reads it; the right-panel toggle then works on the frame
                // itself mid-crop. (No-op in the plain editor — no Coach.)
                if (typeof Coach !== 'undefined' && Coach._effectiveLock) {
                    rect.coachAspectLocked = Coach._effectiveLock(img);
                }
                canvas.add(rect);
                // Structural helper object — must not trigger the off-view auto-fit
                if (canvas._autoFitQueue) canvas._autoFitQueue = [];
                canvas.setActiveObject(rect);
                if (typeof Coach !== 'undefined' && Coach.applyAspectToObject) {
                    Coach.applyAspectToObject(rect);
                    canvas.uniformScaling = Coach._effectiveLock(rect);
                }
                cropState = { img: img, rect: rect };
                canvas.requestRenderAll();
                updateCropButtons();
            }

            // Remove the frame and leave crop mode. Keeps whatever the user
            // selected meanwhile (the selection-change guard calls this).
            function endCrop() {
                if (!cropState) return;
                const rect = cropState.rect;
                cropState = null;
                if (canvas.getActiveObject() === rect) canvas.discardActiveObject();
                canvas.remove(rect);
                canvas.requestRenderAll();
                updateCropButtons();
            }

            function cancelCrop() {
                if (!cropState) return;
                const img = cropState.img;
                endCrop();
                canvas.setActiveObject(img);
                canvas.requestRenderAll();
            }

            function applyCrop() {
                if (!cropState) return;
                const img = cropState.img, rect = cropState.rect;
                // Frame corners → the image's LOCAL space (handles a rotated or
                // flipped image; the crop is the local bounding box of the frame,
                // clamped to the current visible extent).
                const inv = fabric.util.invertTransform(img.calcTransformMatrix());
                // Corners from the frame's geometry, NOT getCoords() — coords
                // include the 1px stroke padding, which inflated the crop by
                // half a pixel per side. Rotation is locked, so this is exact.
                const rc = rect.getCenterPoint();
                const hw = rect.width * rect.scaleX / 2, hh = rect.height * rect.scaleY / 2;
                const pts = [
                    new fabric.Point(rc.x - hw, rc.y - hh), new fabric.Point(rc.x + hw, rc.y - hh),
                    new fabric.Point(rc.x + hw, rc.y + hh), new fabric.Point(rc.x - hw, rc.y + hh)
                ].map(p => fabric.util.transformPoint(p, inv));
                const w = img.width, h = img.height;
                const lx0 = Math.max(-w / 2, Math.min(...pts.map(p => p.x)));
                const ly0 = Math.max(-h / 2, Math.min(...pts.map(p => p.y)));
                const lx1 = Math.min(w / 2, Math.max(...pts.map(p => p.x)));
                const ly1 = Math.min(h / 2, Math.max(...pts.map(p => p.y)));
                const m = img.calcTransformMatrix(); // BEFORE endCrop deselects
                endCrop();
                if (lx1 - lx0 < 2 || ly1 - ly0 < 2) { canvas.setActiveObject(img); return; }
                const centre = fabric.util.transformPoint(
                    new fabric.Point((lx0 + lx1) / 2, (ly0 + ly1) / 2), m);
                img.set({
                    cropX: (img.cropX || 0) + lx0 + w / 2,
                    cropY: (img.cropY || 0) + ly0 + h / 2,
                    width:  lx1 - lx0,
                    height: ly1 - ly0
                });
                img.setPositionByOrigin(centre, 'center', 'center');
                img.setCoords();
                canvas.setActiveObject(img);
                canvas.requestRenderAll();
                updatePropertiesPanel();
                updateCropButtons();
                saveState();
            }

            function resetCrop() {
                const img = canvas.getActiveObject();
                if (!img || img.type !== 'image' || !img._element) return;
                const el = img._element;
                const natW = el.naturalWidth || el.width, natH = el.naturalHeight || el.height;
                if (!natW || !natH) return;
                const centre = img.getCenterPoint();
                img.set({ cropX: 0, cropY: 0, width: natW, height: natH });
                img.setPositionByOrigin(centre, 'center', 'center');
                img.setCoords();
                canvas.requestRenderAll();
                updatePropertiesPanel();
                updateCropButtons();
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
                    document.getElementById('customSizeLabelToolbar').textContent = 'Enter dimensions in inch:';
                    document.getElementById('customWidthToolbar').placeholder = 'Width (inch)';
                    document.getElementById('customHeightToolbar').placeholder = 'Height (inch)';
                } else {
                    document.getElementById('customSizeLabelToolbar').textContent = 'Enter dimensions in mm:';
                    document.getElementById('customWidthToolbar').placeholder = 'Width (mm)';
                    document.getElementById('customHeightToolbar').placeholder = 'Height (mm)';
                }

                updateCanvasInfo();
                updatePropertiesPanel();
            }
            
            // History functions
            function saveState() {
                if (isUndoing || isRedoing) return;
                
                const json = JSON.stringify(canvas.toJSON(['shapeType', 'countryName', 'realWidth', 'realHeight', 'realRadius', 'realRx', 'realRy', 'realFontSize', 'realCornerRadius', 'currencyType', 'coinValue', 'realDiameter', 'bendSourceText', 'bendAmount', 'bendFontFamily', 'isTemplateSlot']));
                
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

                    // Group / Ungroup: Ctrl+G / Ctrl+Shift+G
                    if ((e.ctrlKey || e.metaKey) && (e.key === 'g' || e.key === 'G')) {
                        if (isTyping) return;
                        e.preventDefault();
                        if (e.shiftKey) ungroupSelected();
                        else groupSelected();
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
                });
                
                // Setup quote form handler
                setupQuoteFormHandler();
            });
        </script>
    </body>
    </html>