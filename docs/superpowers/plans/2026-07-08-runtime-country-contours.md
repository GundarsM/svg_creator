# Runtime Country Contours Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace ~2.3 MB of inline SVG country path data with runtime generation from the world-atlas TopoJSON dataset, applied surgically to both editor.js and builder.js.

**Architecture:** A lazily-fetched, promise-cached TopoJSON world file (jsDelivr CDN) is converted per-request into SVG path strings via d3-geo projection (`getCountryPathData`). `addCountry`/`addCountryOutline` keep their signatures but become async. The identical engine edits land in both files (NO re-paste — the engine regions have intentionally diverged; see spec). Search UIs: engine panel in editor.js, Coach step-2/step-7 panels in builder.js.

**Tech Stack:** d3-geo@3 (+ d3-array@3), topojson-client@3, world-atlas@2 dataset, Fabric.js 5.3.0 (existing).

**Spec:** `docs/superpowers/specs/2026-07-08-runtime-country-contours-design.md` — read it first; it is normative for behavior.

**Testing note:** This repo has NO automated tests (per CLAUDE.md); both `.js` files are complete HTML documents opened directly in a browser. Every task therefore ends with a scripted browser/console verification with expected output instead of a unit test. Open files via `file://` in Chrome (internet required — all deps are CDN).

**IMPORTANT — editor.js and builder.js are huge (1 MB / 2.7 MB) with some lines >500 KB.** Never read either file whole. Use Grep to locate anchors and read only small ranges. Line numbers below were verified on branch `feat/coin-holder-guided-builder` at commit `6a90492`; re-verify each anchor with Grep before editing (they shift as tasks land).

---

## Chunk 1: editor.js — libraries, engine module, call sites, search UI

### Task 1: Load d3/topojson libraries in editor.js

**Files:**
- Modify: `editor.js` (script tag block; opentype.js tag is at line ~433)

- [ ] **Step 1: Add the three script tags**

Find the anchor line with Grep (`pattern: opentype.min.js`, `path: editor.js`). Immediately AFTER the opentype.js script tag line:

```html
        <script src="https://cdn.jsdelivr.net/npm/opentype.js@1.3.4/dist/opentype.min.js"></script>
```

add these three lines (order matters — d3-geo's UMD build declares d3-array as an external dependency, so d3-array must load first):

```html
        <script src="https://cdn.jsdelivr.net/npm/d3-array@3/dist/d3-array.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/d3-geo@3/dist/d3-geo.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js"></script>
```

- [ ] **Step 2: Verify the libraries load standalone**

Open `editor.js` in Chrome (`file:///c:/Users/GundarsM/Documents/svg_editor/editor.js` — if the browser downloads instead of rendering, copy to `editor.test.html` in the scratchpad dir and open that; never commit the copy). In DevTools console run:

```js
[typeof d3?.geoAzimuthalEqualArea, typeof d3?.geoNaturalEarth1, typeof d3?.geoCentroid, typeof d3?.geoPath().digits, typeof topojson?.feature, typeof topojson?.merge]
```

Expected: `['function', 'function', 'function', 'function', 'function', 'function']` and no console errors. If `d3.geoPath().digits` is undefined, the resolved d3-geo version is < 3.1 — pin the tag to `d3-geo@3.1` and re-verify.

- [ ] **Step 3: Commit**

```powershell
git add editor.js; git commit -m "feat(editor): load d3-geo + topojson-client for runtime country contours"
```

---

### Task 2: Engine country module in editor.js (replaces `countryPaths`)

**Files:**
- Modify: `editor.js` — replace the `countryPaths` block (lines ~1288–1296: a comment line, `const countryPaths = {`, six enormous single-line entries `usa/italy/uk/australia/canada/germany`, and the closing `};`)

- [ ] **Step 1: Locate the block**

Grep `pattern: const countryPaths` in editor.js. The block starts one line above (comment `// Country outline SVG paths...`) and ends at the first `};` after the `germany:` line. The six data lines are 14 KB–506 KB each — delete by exact line range, do not attempt to match their content.

- [ ] **Step 2: Replace the whole block with the module below** (complete code — same indentation depth as the old block, 12 spaces):

```js
            // ── Country contours: generated at runtime from the world-atlas dataset ──
            // Replaces the old multi-megabyte inline `countryPaths` SVG data.
            // Path units are millimetres (the engine treats raw path units as mm).
            const WORLD_ATLAS_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json';
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
            // overseas territories (French Guiana, Svalbard, Azores, Canaries…).
            // Member strings are matched slug-insensitively against dataset names;
            // unresolved members produce a console.warn, not an error.
            const COMPOSITE_SHAPES = {
                world: { members: 'ALL', window: null },
                europe: {
                    window: [-25, 34, 45, 72],
                    members: ['Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium',
                        'Bosnia and Herz.', 'Bulgaria', 'Croatia', 'Czechia', 'Denmark',
                        'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary',
                        'Iceland', 'Ireland', 'Italy', 'Kosovo', 'Latvia', 'Liechtenstein',
                        'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco',
                        'Montenegro', 'Netherlands', 'North Macedonia', 'Norway', 'Poland',
                        'Portugal', 'Romania', 'San Marino', 'Serbia', 'Slovakia',
                        'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine',
                        'United Kingdom', 'Vatican']
                },
                africa: {
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

            let worldTopoPromise = null;
            function loadWorldTopo() {
                if (!worldTopoPromise) {
                    worldTopoPromise = fetch(WORLD_ATLAS_URL)
                        .then(r => {
                            if (!r.ok) throw new Error('world-atlas fetch failed: HTTP ' + r.status);
                            return r.json();
                        })
                        .catch(err => {
                            worldTopoPromise = null; // clear the cache so the next call retries
                            throw err;
                        });
                }
                return worldTopoPromise;
            }

            // Planar bbox area of a polygon's exterior ring — a robust proxy for
            // "largest polygon" that sidesteps spherical winding pitfalls.
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

            function filterByWindow(geometry, win) {
                if (!win || geometry.type !== 'MultiPolygon') return geometry;
                const [lonMin, latMin, lonMax, latMax] = win;
                const kept = geometry.coordinates.filter(poly => {
                    const [lon, lat] = d3.geoCentroid({ type: 'Polygon', coordinates: poly });
                    return lon >= lonMin && lon <= lonMax && lat >= latMin && lat <= latMax;
                });
                return { type: 'MultiPolygon', coordinates: kept };
            }

            // All dataset country names, sorted — feeds the search datalists.
            async function getCountryNames() {
                const world = await loadWorldTopo();
                return topojson.feature(world, world.objects.countries).features
                    .map(f => f.properties.name)
                    .sort((a, b) => a.localeCompare(b));
            }

            // key → SVG path string (or null for an unknown key). Accepts legacy
            // keys ('usa'), dataset names ('Portugal'), or slugs ('portugal').
            async function getCountryPathData(key) {
                const world = await loadWorldTopo();
                let feature, projection;
                const composite = COMPOSITE_SHAPES[key];
                if (composite) {
                    let geoms = world.objects.countries.geometries;
                    if (composite.members !== 'ALL') {
                        const memberSet = new Set(composite.members.map(countrySlug));
                        geoms = geoms.filter(g => memberSet.has(countrySlug(g.properties.name)));
                        const foundSet = new Set(geoms.map(g => countrySlug(g.properties.name)));
                        const missing = composite.members.filter(m => !foundSet.has(countrySlug(m)));
                        if (missing.length) console.warn('Composite "' + key + '": unresolved members', missing);
                    }
                    let merged = topojson.merge(world, geoms);
                    merged = filterByWindow(merged, composite.window);
                    feature = { type: 'Feature', properties: { name: key }, geometry: merged };
                    // An azimuthal projection centered on a whole-world feature is
                    // degenerate at the antipode — world uses NaturalEarth instead.
                    projection = key === 'world' ? d3.geoNaturalEarth1() : d3.geoAzimuthalEqualArea();
                } else {
                    const entry = COUNTRY_KEY_MAP[key];
                    const wanted = countrySlug(entry ? entry.name : key);
                    feature = topojson.feature(world, world.objects.countries).features
                        .find(f => countrySlug(f.properties.name) === wanted);
                    if (!feature) {
                        console.warn('Unknown country key: "' + key + '"');
                        return null;
                    }
                    if (entry && entry.mainlandOnly) {
                        feature = { type: 'Feature', properties: feature.properties,
                                    geometry: keepLargestPolygon(feature.geometry) };
                    }
                    projection = d3.geoAzimuthalEqualArea();
                }
                if (key !== 'world') {
                    // Center the azimuthal projection on the feature BEFORE fitSize
                    // (fitSize only adjusts scale/translate, not rotation).
                    const c = d3.geoCentroid(feature);
                    projection.rotate([-c[0], -c[1]]);
                }
                projection.fitSize([COUNTRY_FIT_MM, COUNTRY_FIT_MM], feature);
                return d3.geoPath(projection).digits(2)(feature);
            }
```

- [ ] **Step 3: Console-verify the module**

Reload editor.js in Chrome. The page must load with no console errors (nothing references `countryPaths` synchronously at load — `addCountry`, `addCountryOutline`, and the UK template read it only when invoked; they break NOW but are fixed in Tasks 3–4, so do not click country buttons yet). Run in console:

```js
const p = await getCountryPathData('usa');
[typeof p, p.startsWith('M'), p.length < 30000]
```

Expected: `['string', true, true]` (one network request to `countries-50m.json`; a second call must NOT re-fetch — check the Network tab). Then:

```js
(await getCountryNames()).length            // expected: > 170
(await getCountryPathData('portugal')) !== null   // expected: true (slug fallback)
(await getCountryPathData('Portugal')) !== null   // expected: true (name fallback)
(await getCountryPathData('europe')) !== null     // expected: true, plus NO 'unresolved members' warning
(await getCountryPathData('africa')) !== null     // expected: true, plus NO 'unresolved members' warning
(await getCountryPathData('world')) !== null      // expected: true (catches merge-over-ALL surprises early)
(await getCountryPathData('nonsense'))            // expected: null + console warning
```

If `europe`/`africa` warn about unresolved members, the dataset spells those names differently — run `(await getCountryNames()).join(' | ')`, find the actual spelling, and fix the member list (this is why the code warns instead of throwing).

- [ ] **Step 4: Commit**

```powershell
git add editor.js; git commit -m "feat(editor): generate country contours from world-atlas at runtime"
```

---

### Task 3: Make `addCountry` / `addCountryOutline` async in editor.js

**Files:**
- Modify: `editor.js` — `addCountry` (line ~1540) and `addCountryOutline` (line ~1573); Grep `pattern: function addCountry` to locate both.

- [ ] **Step 1: Replace both functions** (complete code; the fabric bodies are IDENTICAL to the current ones except `countryName` stores the slug):

```js
            // Add country outline (solid brown fill)
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
```

- [ ] **Step 2: Browser-verify the six curated buttons**

Reload; click all 6 "Solid" and 6 "Outline" buttons (USA, UK, Australia, Canada, Germany, Italy). Expected: each adds a recognizable, ~120 mm shape centered on canvas; USA is contiguous-48 only; Canada is NOT wildly stretched east–west; UK/Italy show islands. Select a shape and check the properties panel shows sensible mm dimensions. Console: `canvas.getActiveObject().countryName` → the slug (e.g. `'usa'`).

- [ ] **Step 3: Verify error path**

DevTools → Network → Offline; hard-reload is NOT needed — in console run `worldTopoPromise = null` (forces re-fetch), then click a country button. Expected: alert with the connection message. Go back Online, click again: shape appears (cache cleared → retried).

- [ ] **Step 4: Commit**

```powershell
git add editor.js; git commit -m "feat(editor): async addCountry/addCountryOutline via runtime path lookup"
```

---

### Task 4: Adapt the UK coin-holder template in editor.js

**Files:**
- Modify: `editor.js` line ~2143–2170 — Grep `pattern: ukPathData` to locate.

- [ ] **Step 1: Replace the read-and-branch block.** Current code:

```js
                    // UK outline (scaled down) - if pathData exists
                    const ukPathData = countryPaths['uk'];
                    if (ukPathData) {
                        fabric.loadSVGFromString(`<svg><path d="${ukPathData}" /></svg>`, function(objects, options) {
                            ...
                            addUKCoinsToTemplate();
                        });
                    } else {
                        // If no UK path, just add coins
                        addUKCoinsToTemplate();
                    }
```

New code — same inner `loadSVGFromString` callback body, with two changed constants (`scaleX`/`scaleY`: the old path was ~126 units tall so `scale * 0.5` ≈ 63 mm; the generated path fits a 120-unit box, so 63 mm needs `63/120 = 0.525`):

```js
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
                                left: baseX - 14 * scale, // Moved 14mm to the left
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
```

(Keep the surrounding code — `addUKCoinsToTemplate` definition below it — untouched, EXCEPT the block in Step 2. `scale`, `baseX`, `baseY`, `elements` are in-scope template locals.)

- [ ] **Step 2: Delete the second `ukPathData` reference further down the template.** At editor.js:2301–2304 (Grep `pattern: If UK path loading is not involved`):

```js
                    // If UK path loading is not involved, add elements immediately
                    if (!ukPathData) {
                        addElementsToCanvas();
                    }
```

Delete these four lines but KEEP the `return; // Exit early for UK template due to async loading` two lines below. In the new flow `ukPathData` exists only inside the `.then()` callback, so this synchronous read would throw `ReferenceError` on every UK-template invocation. Both the success and failure paths now reach `addElementsToCanvas()` via `addUKCoinsToTemplate()`, so the block is dead anyway (in the OLD code the `!ukPathData` branch even double-called it — a latent double-add bug this deletion removes).

- [ ] **Step 3: Browser-verify the template**

Reload; open the UK coin-holder template from the Templates section. Expected: UK outline ~63 mm tall, left of the circle centre, coin ring + texts render as before, added exactly once. Then Network→Offline, console `worldTopoPromise = null`, re-add template: coins-only version renders, console warning, NO alert.

- [ ] **Step 4: Commit**

```powershell
git add editor.js; git commit -m "feat(editor): UK template uses runtime country path, degrades to coins-only offline"
```

---

### Task 5: Country search UI in editor.js panel

**Files:**
- Modify: `editor.js` — HTML after the `country-buttons` div (closing `</div>` at line ~574, just before `<h3 class="mt-4">Add Shapes</h3>`); JS helpers next to `addCountry`.

- [ ] **Step 1: Add the search row HTML** between `</div>` (end of `.country-buttons`) and the `Add Shapes` heading:

```html
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
```

- [ ] **Step 2: Add the JS helpers** directly above `function addCountry(`:

```js
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
```

- [ ] **Step 3: Browser-verify**

Reload. Focus the search input → datalist offers country names (Network tab shows the dataset fetch if not already cached). Type "Port", pick "Portugal", click Solid → mainland Portugal appears (Azores/Madeira present — Portugal has no `mainlandOnly`; acceptable per spec default "full multipolygon", note visual result). `canvas.getActiveObject().countryName` → `'portugal'`. Empty input + Solid → no-op. Offline + `worldTopoPromise = null` + focus → console warning only, no alert; a later focus after going Online retries and populates.

- [ ] **Step 4: Commit**

```powershell
git add editor.js; git commit -m "feat(editor): type-ahead country search in the outlines panel"
```

---

### Task 6: editor.js full regression pass (chunk gate)

- [ ] **Step 1: Run the editor.js part of the spec's verification checklist**

1. All 6 curated keys, Solid + Outline.
2. Console-exercise keys without buttons: `for (const k of ['france','greece','japan','brazil','egypt','india','southkorea','morocco','tunisia','mexico','europe','africa','world']) await addCountry(k)` — every shape recognizable; **africa filled: Lesotho renders as a hole**; europe has no internal borders in Outline mode (`addCountryOutline('europe')`); world uses the NaturalEarth silhouette.
3. Save design (localStorage), reload page, restore — country shapes reappear identically.
4. SVG export with a country on canvas — export succeeds, file contains the path.
5. Undo/redo and copy/paste of a country shape keep `countryName` (propagated in the clone handlers at editor.js ~3042/3081 and in the `toJSON` extra-props list at ~3157 — behavior must be unchanged).

Fix anything broken before proceeding (small fixes in place; structural problems → stop and surface).

- [ ] **Step 2: Verify total size shrank**

```powershell
(Get-Item editor.js).Length
```

Expected: ~200 KB (was 1,002,990 bytes).

- [ ] **Step 3: Commit any fixes**

```powershell
git add editor.js; git commit -m "fix(editor): regression fixes from country-contours verification pass"
```

(Skip the commit if the working tree is clean.)

---

## Chunk 2: builder.js engine edits, Coach search fields, CLAUDE.md, final verification

### Task 7: Apply the identical engine edits to builder.js

**Files:**
- Modify: `builder.js` — script tags (opentype tag at line ~483), `countryPaths` block (lines ~1535–1556, NINETEEN huge entries — japan…mexico, europe, france, greece, world, plus the six editor ones), `addCountry`/`addCountryOutline` (lines ~1800/1833), UK template (`ukPathData` at line ~2404).

**These are the SAME edits as Tasks 1–4 — copy the final code blocks from editor.js itself (Grep the anchors in editor.js, read the new blocks, paste into builder.js) so the two files stay byte-identical in these regions. Do NOT re-type from this plan.** builder.js gets NO engine search-panel HTML/JS (its sidebar was replaced by Coach markup — Task 5 has no builder counterpart; `populateCountrySearch`/`addSearchedCountry` reference `countrySearchInput` only on user action, so do not copy them into builder.js).

- [ ] **Step 1: Add the three script tags** after builder.js's opentype.js tag (same three lines as Task 1).
- [ ] **Step 2: Replace builder.js's `countryPaths` block** (comment line + `const countryPaths = {` + 19 data lines + `};`) with the entire module from Task 2, copied from editor.js. The 19 data lines (11 KB–506 KB each) cannot be matched by the Edit tool — re-Grep `pattern: const countryPaths` to confirm the range (currently 1535–1556 including the comment line above), delete by line range, e.g.:

```bash
sed -i '1535,1556d' builder.js
```

then insert the module at that position (write it to a scratchpad file from editor.js's block and splice with `sed -i '1534r <scratchfile>'`, or equivalent).
- [ ] **Step 3: Replace `addCountry`/`addCountryOutline`** with the Task 3 versions, copied from editor.js.
- [ ] **Step 4: Replace the UK-template `ukPathData` block** with the Task 4 Step 1 version, copied from editor.js, AND delete builder's copy of the second `ukPathData` reference (Task 4 Step 2): Grep `pattern: If UK path loading is not involved` in builder.js (currently line ~2561) and delete that comment + the `if (!ukPathData) { addElementsToCanvas(); }` block, keeping the `return;` below it.
- [ ] **Step 5: Verify the copies are byte-identical**

For each of the four regions (script tags, module, add-functions, UK-template block): Grep the region's first and last line in both files to get its line range, extract both to the scratchpad, and diff. Example for the module (adjust ranges from Grep output):

```bash
sed -n '<a1>,<a2>p' editor.js  > "$SCRATCH/mod-editor.js"
sed -n '<b1>,<b2>p' builder.js > "$SCRATCH/mod-builder.js"
diff "$SCRATCH/mod-editor.js" "$SCRATCH/mod-builder.js"
```

Expected: no output (exit 0) for all four regions. Any diff line means the copy drifted — fix builder.js to match editor.js exactly.

- [ ] **Step 6: Browser-verify builder.js**

Open builder.js in Chrome. No console errors on load. Walk the Coach: step 2 → "Country / custom shape" → click several country buttons (including Japan, Africa, Mexico — the ones whose data was builder-only before): shape appears, becomes the holder (aspect-locked, behind coins), Coach advances normally. Step 7 → country panel → filled and outline modes both work; Europe and World buttons work. Console: `canvas.getActiveObject().countryName` matches the key. File size check: `(Get-Item builder.js).Length` expected ~450 KB (was 2,719,154).

- [ ] **Step 7: Commit**

```powershell
git add builder.js; git commit -m "feat(builder): runtime country contours — identical engine edits as editor.js"
```

---

### Task 8: Coach search fields (builder.js hand-maintained region)

**Files:**
- Modify: `builder.js` — Coach script: near `mkCountryBtn` (line ~4213), step-2 country panel (`countryPanel`, lines ~6602–6637), step-7 country panel (lines ~7453–7473), stale comment (lines ~4470–4475).

- [ ] **Step 1: Add a shared search-field factory** right after the `mkCountryBtn` definition (Grep `pattern: const mkCountryBtn`):

```js
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
                // NOTE: the Coach mount is #coach-bubble (builder.js:804) — there
                // is NO #coach-root element despite what old CLAUDE.md said. The
                // bubble persists across Coach.render(), so the datalist survives.
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
```

- [ ] **Step 2: Wire it into the step-2 country panel.** After the `countries.forEach(...)` loop that appends buttons to `countryPanel` (before the "Upload SVG" button block), insert — the pick handler is the button handler's logic with the slug as key (searched slugs match no `data-country` button, so the highlight loop naturally clears all curated highlights):

```js
                    countryPanel.appendChild(mkCountrySearch((name, key) => {
                        Coach.captureNextAdded('holder', o => o.shapeType !== 'currency', (obj) => {
                            Coach.state.holderObj = obj;
                            Coach.state.holderType = 'country';
                            if (obj) {
                                obj.coachHolderId = 'holder';
                                canvas.sendToBack(obj); // base shape sits on the bottom layer
                            }
                            applyStoredSize();
                            Coach.setHolderAspectLock(true); // country shapes lock aspect by default
                            markSelected(shapeGroup, 'country');
                            Coach.render();
                        });
                        if (typeof addCountryOutline === 'function') addCountryOutline(key);
                        else if (typeof addCountry === 'function') addCountry(key);
                        countryPanel.querySelectorAll('button[data-country]').forEach(b =>
                            b.classList.remove('active'));
                    }));
```

- [ ] **Step 3: Wire it into the step-7 country panel.** After `countryPanel.appendChild(countryGrid);` insert:

```js
                    countryPanel.appendChild(mkCountrySearch((name, key) => {
                        if (countryMode === 'filled') {
                            captureAndSize(null, true); // size + tint the fill to the material's engrave colour
                            if (typeof addCountry === 'function') addCountry(key);
                        } else {
                            captureAndSize(); // outline: size only, keep its outline colour
                            if (typeof addCountryOutline === 'function') addCountryOutline(key);
                        }
                    }));
```

- [ ] **Step 4: Fix the stale comment** at builder.js ~4470–4475. Replace the sentences "Each key must have a matching entry in the engine's `countryPaths` map. To add a country: add its path to countryPaths, then add one { key, label } line here." with:

```
           Keys resolve through the engine's COUNTRY_KEY_MAP / COMPOSITE_SHAPES
           (world-atlas dataset at runtime). To add a curated button: add one
           { key, label } line here — the key is the countrySlug() of the
           dataset name (no path data needed). Any other country is reachable
           via the panel's search field.
```

- [ ] **Step 5: Browser-verify Coach search**

Step 2 → open country panel → focus search → list populates. Pick "Portugal": shape is added as OUTLINE, becomes the holder (aspect lock on, sent to back), curated-button highlights clear, Coach UI shows country selected. Console pass/fail checks:

```js
canvas.getActiveObject().countryName === 'portugal'   // true
canvas.getActiveObject().shapeType === 'country'      // true (capture-filter invariant)
canvas.getObjects().indexOf(Coach.state.holderObj) === 0   // true — sent to back
```

Step 7 → search "Iceland" with Filled toggle: solid tinted shape; with Outline toggle: outline. Also re-verify one curated button per panel still works (no regression from the inserted nodes).

- [ ] **Step 6: Commit**

```powershell
git add builder.js; git commit -m "feat(builder): country search fields in Coach step-2/step-7 panels"
```

---

### Task 9: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` lines 10, 14, 31 (all three assert the verbatim relationship) AND lines 10, 14, 43 (all three reference a `#coach-root` element that does NOT exist in builder.js — the real Coach mount is `#coach-bubble` at builder.js:804; Grep `coach-root` in builder.js returns 0 matches).

- [ ] **Step 1: Line 10 bullet** — replace "a **verbatim copy of the editor.js engine**" with "an **engine copied from editor.js (now with intentional builder-only modifications — see maintenance note)**", and replace "(`#coach-root`)" with "(`#coach-bubble`)".

- [ ] **Step 2: Line 14 blockquote** — replace the whole maintenance note with:

```markdown
> **builder.js maintenance:** the region below the `<!-- ===== ENGINE (verbatim copy of editor.js) ===== -->` marker started as a copy of `editor.js` but has intentionally diverged (Coach-bubble markup replaces the engine sidebar, quote footer removed, instructions rewritten, Coach-aware guards, builder-only fixes). Do NOT re-paste editor.js over it — that breaks the builder. Engine changes must be applied surgically to BOTH files at the matching locations; full reconciliation is a separate future project. The appended `COACH` region (Coach `<style>` rules, the `#coach-bubble` markup, and the `Coach` `<script>`) remains hand-maintained. The Coach drives existing engine globals and reads the global Fabric `canvas`; it never modifies engine internals.
```

- [ ] **Step 3: Line 31 tech-stack bullet** — replace "(it embeds the editor engine verbatim)" with "(it embeds the editor engine — see maintenance note)". In the same Tech Stack section, add to the editor.js additional-libraries line: `d3-geo 3.x + d3-array 3.x + topojson-client 3.x (runtime country contours from the world-atlas dataset)` and mirror it on the builder.js line.

- [ ] **Step 4: Line 43 CSS-architecture paragraph** — replace "adds its Coach styles scoped under `#coach-root`" with "adds its Coach styles scoped under `#coach-bubble` and the other `#coach-*` containers".

- [ ] **Step 5: Commit**

```powershell
git add CLAUDE.md; git commit -m "docs: CLAUDE.md — engine regions diverged; surgical dual edits, new d3/topojson deps"
```

---

### Task 10: Final cross-file verification (spec checklist)

- [ ] **Step 1: Run the spec's full Verification section** (spec lines under "## Verification") against BOTH files in the browser. Every numbered item, including: 19 legacy keys filled+outline (via editor console + builder Coach), Portugal via all three search fields, UK template online AND offline, Coach step-2 holder capture invariants, localStorage save/reload, SVG export, offline alert/retry semantics, africa Lesotho hole, France mainland-only (Corsica will be absent — largest-polygon rule; flag to the user in the final report), Canada distortion check.

- [ ] **Step 2: Byte sizes and diff review**

```powershell
(Get-Item editor.js).Length; (Get-Item builder.js).Length; git diff main --stat
```

Expected: editor.js ~0.2 MB, builder.js ~0.45 MB.

- [ ] **Step 3: Commit anything outstanding, then report**

Use superpowers:verification-before-completion before claiming done. Report results (including any visual-quality judgment calls: Corsica, Azores, europe membership) to the user for sign-off — deployment to Squarespace is manual and user-owned.
