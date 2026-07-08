# Runtime Country Contours — Design

**Date:** 2026-07-08
**Status:** Approved by user (design conversation), pending spec review
**Files affected:** `editor.js`, `builder.js` (identical edits applied surgically to its engine region — no re-paste), `CLAUDE.md`

## Problem

Country outline shapes are stored as inline SVG path strings in the `countryPaths`
object inside the engine. This data is ~0.8 MB in editor.js (6 countries) and
~2.3 MB in builder.js (19 countries) — roughly 85% of builder.js. Because both
files are pasted into Squarespace Page Header Code Injection, every visitor
downloads and parses all of it on page load. Adding a new country means manually
tracing/exporting an SVG and pasting a huge path string into the code.

A second problem surfaced during design: the engine regions of the two files
have diverged far beyond the CLAUDE.md "verbatim copy" rule — a diff shows ~48
substantive hunks. Builder's engine region intentionally replaces the engine
sidebar with the Coach bubble markup, removes the quote footer, rewrites the
instructions panel, adds Coach-aware guards, and contains the fit-to-screen fix
(commit 7aee27b) that was never ported to editor.js. A blind re-paste of
editor.js into builder would therefore break the shipping builder. Full
reconciliation is out of scope for this project (decided with the user); this
spec applies the country-system change surgically to both files and updates
CLAUDE.md so the stale invariant stops misleading future work.

## Goals

1. Remove the multi-megabyte inline path data from both files.
2. Make adding a country trivial (no SVG tracing, no path pasting).
3. Keep every existing country key working — the Coach's button lists
   (`Coach.COUNTRY_OPTIONS`, `COUNTRY_OPTIONS_EXTRA`) reference keys
   `usa, uk, australia, canada, germany, italy, france, greece, japan, africa,
   brazil, egypt, india, southkorea, morocco, tunisia, mexico, europe, world`.
4. Apply the change identically to both files' engine regions (surgical dual
   application — see Sync procedure), and update CLAUDE.md to document the
   actual editor/builder relationship.

## Non-goals

- No change to the Coach's hand-maintained region beyond the country search
  fields in the step-2/step-7 country panels and the stale comment update in
  the Sync procedure (the country buttons keep working as-is).
- No preservation of the exact pixel geometry of the current hand-traced shapes.
- No full reconciliation of the diverged engine regions — that is a separate
  future project; this change is applied surgically to both files.

## Design

### Data source

- **Dataset:** `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json`
  — standard TopoJSON of all ~250 countries at 1:50m detail, ~600 KB.
- **Fetched lazily**: only when the user first adds a country shape, then cached
  in a module-level variable (a single in-flight Promise so concurrent clicks
  share one fetch). jsDelivr serves long-lived cache headers, so repeat visitors
  hit the browser cache.

### Libraries

Added as ordinary `<script>` tags next to the existing CDN dependencies
(Fabric, opentype.js):

- `topojson-client@3` (UMD, ~10 KB) — TopoJSON → GeoJSON features, `merge` for composites.
- `d3-geo@3` (UMD; pin ≥ 3.1 for `geoPath().digits()`) plus `d3-array@3`,
  which the d3-geo UMD build declares as an external dependency and must be
  loaded first. The implementation plan carries an explicit step verifying the
  script-tag load order works standalone (no other d3 modules present).

### Engine API (replaces the `countryPaths` object)

```js
// Legacy key → dataset country name. Every key used by the Coach and the
// engine buttons appears here. New countries picked via search use their
// dataset name directly (slugified as the stored key).
// `mainlandOnly` keeps only the largest polygon of a multipolygon country —
// needed where the dataset bundles far-flung territories into one feature
// (France includes French Guiana, which would otherwise dominate fitSize).
// UK/Japan/Greece etc. keep their full multipolygon (islands are the point).
const COUNTRY_KEY_MAP = {
    usa: { name: 'United States of America', mainlandOnly: true }, // contiguous 48 — Alaska/Hawaii would shrink it in the fit box
    uk: { name: 'United Kingdom' },
    southkorea: { name: 'South Korea' },
    france: { name: 'France', mainlandOnly: true },
    /* ... remaining direct-name keys — the implementation plan decides
       mainlandOnly per key explicitly (default: full multipolygon) ... */
};

// Composite shapes are topojson.merge'd from member-country ids.
// Ids are the ISO 3166-1 numeric `id` fields on world-atlas features;
// membership follows the UN geoscheme continental grouping.
// Boundary decisions: europe EXCLUDES Russia and Turkey (no way to clip a
// single country polygon at the Urals/Bosporus — accepted limitation);
// africa includes Egypt and Morocco (also standalone keys). After merging,
// polygons whose centroid falls outside the continent's geographic window
// (europe: lon −25..45, lat 34..72) are dropped, which removes members'
// overseas territories (e.g. French Guiana) from the continent shape.
const COMPOSITE_SHAPES = {
    world:  'ALL',          // topojson.merge of every country geometry
    europe: [/* ids */], africa: [/* ids */],
};

async function getCountryPathData(key) { /* returns SVG path string */ }
```

Composites use `topojson.merge` (not a plain feature union) so shared internal
borders are dissolved — required for outline (stroke-only) rendering.

`getCountryPathData(key)`:

1. Await the (cached) world TopoJSON fetch.
2. Resolve `key` → a GeoJSON feature: composite via `topojson.merge` over the
   id list; otherwise via `COUNTRY_KEY_MAP`, falling back to a
   **slug-normalized dataset-name match** (lowercase, strip non-alphanumerics)
   — so `addCountry('Portugal')` and `addCountry('portugal')` both resolve.
   The slug is what gets stored as `countryName`.
3. Project with `d3.geoAzimuthalEqualArea()` centered on the feature and
   `fitSize([120, 120], feature)` — equal-area projection avoids the extreme
   Mercator distortion of high-latitude countries (Canada), and a fixed fit box
   gives every country a consistent ~120 mm default size (path units are treated
   as millimetres by the engine; today's defaults vary arbitrarily per path).
   **Exception:** the `world` composite uses `d3.geoNaturalEarth1()` — an
   azimuthal projection centered on a global feature is degenerate at the
   antipode.
4. Render to a path string with `d3.geoPath(projection).digits(2)` — 2-decimal
   coordinates keep each generated path to a few KB, which also keeps canvas
   JSON (localStorage autosave, quote submissions) small.

`addCountry(key)` and `addCountryOutline(key)` keep their names and signatures
but become async: they `await getCountryPathData(key)` and then run their
existing body (fabric SVG load, `shapeType = 'country'`, fills/strokes)
unchanged — except `countryName` stores the resolved slug, not the raw
argument, per resolution step 2. The Coach captures the new shape via the canvas
`object:added` event (`Coach.captureNextAdded`), which is indifferent to the
added asynchrony.

### Third call site: the UK coin-holder template

Besides `addCountry`/`addCountryOutline`, `countryPaths` is read directly by
the UK coin-holder template: `const ukPathData = countryPaths['uk'];` at
editor.js:2144 (builder.js:2404). The template builds an `elements` array and
already gates `addUKCoinsToTemplate()` behind the async
`fabric.loadSVGFromString` callback, so it adapts cleanly:

- Replace the direct read with `getCountryPathData('uk').then(ukPathData =>
  { /* existing loadSVGFromString flow */ }).catch(() => { console.warn(...);
  addUKCoinsToTemplate(); })` — on fetch failure the template degrades to its
  existing "no UK path → coins only" branch instead of alerting mid-template.
- The template's UK-shape constants (`scaleX: scale * 0.5`, `left: baseX −
  14 * scale`, `top: baseY − 4`) were tuned to the old path's coordinate
  space. They must be re-derived against the generated path's fitSize box to
  reproduce the current visual target: UK outline ~63 mm tall, centred ~14 mm
  left of the circle centre.

### UI

- The engine exposes `getCountryNames(): Promise<string[]>` (all dataset
  country names, sorted; triggers/awaits the dataset fetch) so both UIs below
  build the same type-ahead — an `<input list=...>` + `<datalist>` populated on
  first focus. Composites (europe/africa/world) are not dataset names and stay
  button-only.
- Engine "Add Country Outlines" panel (renders in editor.js only): existing
  curated buttons stay unchanged; the type-ahead search sits below them and
  calls `addCountry`/`addCountryOutline` with the chosen name.
- **Coach country panels (builder, hand-maintained region): the search field
  lives here** — one in the step-2 base-holder country panel and one in the
  step-7 personalise country panel, below the curated buttons. Choosing a name
  runs the exact logic of a country-button click with the slugified name as
  key: step 2 arms `Coach.captureNextAdded('holder', …)` then calls
  `addCountryOutline`; step 7 respects the filled/outline `countryMode` toggle
  and calls `captureAndSize` + `addCountry`/`addCountryOutline`. The curated
  button lists themselves are unchanged. (Step 2's active-highlight loop
  matches buttons by `dataset.country` — a searched slug matches none, so it
  naturally clears all curated-button highlights, which is the desired state;
  `markSelected` runs in the capture callback and works for search too.)

### Error handling

- Fetch failure on an **add click** (offline, CDN down): show an alert ("Could
  not load country shapes — please check your connection and try again"), log
  to console, and **clear the cached promise** so the next click retries.
- Fetch failure on **datalist prefetch** (search-box focus): silent
  `console.warn` only — no alert for a UI warm-up; the alert path fires if the
  user then actually tries to add. Because the failed promise is cleared from
  the cache, a later focus retries the prefetch.
- Fetch failure inside the **UK template**: degrade to coins-only (see above),
  no alert.
- Unknown key (stale saved reference, typo): console warning, no shape added.
- **Coach armed capture:** `Coach.captureNextAdded` stays armed for up to
  120 s after a country click; if the fetch fails, no shape is added and the
  capture could adopt the next unrelated `object:added` as the holder. The
  async fetch widens this previously tiny window, so this is a known,
  accepted edge (the 120 s self-cancel bounds it); if it proves annoying in
  practice, a follow-up Coach change can cancel the pending capture when the
  add promise rejects.

### Compatibility

- **Saved designs:** `canvas.toJSON` serializes actual path data, not lookup
  keys, so existing localStorage saves and re-loaded quote designs render
  exactly as before. New saves shrink dramatically.
- **SVG export:** unaffected — country shapes are already fabric paths by
  export time.
- **Visual change (accepted):** generated outlines come from different source
  geometry and a different projection than the hand-traced originals. Shapes
  remain recognizable and consistent in quality but are not pixel-identical.

### Sync procedure

**No re-paste.** The engine regions have diverged too far for a verbatim copy
to be safe (see Problem). Instead:

1. Implement and verify the change in editor.js.
2. Apply the **identical** edits to the corresponding locations in builder.js's
   engine region (delete `countryPaths`, add the same
   `COUNTRY_KEY_MAP`/`COMPOSITE_SHAPES`/`getCountryPathData`/`getCountryNames`,
   same `addCountry`/`addCountryOutline`/UK-template adaptations, same script
   tags — `getCountryNames` especially, since builder's Coach panels are its
   main consumer).
   Note: builder's engine region no longer renders the "Add Country Outlines"
   panel (the sidebar was replaced by Coach markup), so the engine-panel search
   UI renders in editor.js only; builder users get search via the Coach country
   panels instead (see UI). The Coach search fields are a hand-maintained-region
   change made directly in builder.js.
3. Update CLAUDE.md in **both** places that assert the verbatim relationship —
   the builder.js bullet in Project Overview ("verbatim copy of the editor.js
   engine") and the blockquote maintenance note ("must NOT be hand-edited …
   re-paste") — replacing them with the actual relationship (builder's engine
   region started as a copy of editor.js but carries intentional builder-only
   modifications; engine changes must be applied to both files; full
   reconciliation is a separate future project).
4. Update the stale Coach comment at builder.js:4472–4473 ("Each key must have
   a matching entry in the engine's `countryPaths` map…") to reference
   `COUNTRY_KEY_MAP`/`COMPOSITE_SHAPES`.

### Size impact (approximate)

| File | Before | After |
|---|---|---|
| editor.js | ~1.0 MB | ~0.2 MB |
| builder.js | ~2.7 MB | ~0.45 MB |

The ~600 KB dataset moves to a lazily-fetched, CDN-cached request that only
country-using sessions pay.

## Verification (manual — no automated tests in this repo)

1. Open editor.js and builder.js in a browser.
2. Add each of the 19 legacy keys as filled and as outline; confirm each is a
   recognizable, sensibly-sized shape. In editor.js only 6 keys have buttons
   and the composites are not dataset names reachable via search — exercise the
   remaining keys through builder's Coach buttons and/or console calls to
   `addCountry(key)` in editor.js (spot-check Canada for projection
   distortion, UK/Japan/Greece for multi-island rendering, France for
   mainland-only, europe/africa/world composites for completeness, and the
   africa **fill** for interior holes — Lesotho must render as a hole, which
   depends on ring winding + Fabric's fill rule).
3. Search fields: find and add a country with no curated button (e.g.
   Portugal) — in editor.js via the engine panel, and in builder via the Coach
   step-2 panel (must become the holder: captured, aspect-locked, sent to
   back — which requires the searched shape to carry `shapeType = 'country'`,
   the invariant the capture filter hangs on) and the step-7 panel
   (respecting the filled/outline toggle).
4. UK coin-holder template: UK outline appears at the expected size/position
   and the coin ring still renders (including with devtools offline — template
   degrades to coins-only).
5. Coach flow: step 2 country-as-holder (capture, aspect lock, send-to-back)
   and step 7 filled/outline personalization shapes.
6. Save → reload from localStorage with a country on canvas.
7. SVG export containing a country shape.
8. Simulate fetch failure (devtools offline) → alert shown on add click, retry
   works after reconnecting; search-box focus failure warns silently.
