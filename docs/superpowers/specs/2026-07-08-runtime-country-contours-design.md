# Runtime Country Contours — Design

**Date:** 2026-07-08
**Status:** Approved by user (design conversation), pending spec review
**Files affected:** `editor.js` (engine source of truth), `builder.js` (engine region re-synced from editor.js)

## Problem

Country outline shapes are stored as inline SVG path strings in the `countryPaths`
object inside the engine. This data is ~0.8 MB in editor.js (6 countries) and
~2.3 MB in builder.js (19 countries) — roughly 85% of builder.js. Because both
files are pasted into Squarespace Page Header Code Injection, every visitor
downloads and parses all of it on page load. Adding a new country means manually
tracing/exporting an SVG and pasting a huge path string into the code.

A second problem surfaced during design: the new countries were added directly to
builder.js's engine region, so the engine regions of the two files have diverged,
violating the CLAUDE.md rule that builder's engine region is a verbatim copy of
editor.js.

## Goals

1. Remove the multi-megabyte inline path data from both files.
2. Make adding a country trivial (no SVG tracing, no path pasting).
3. Keep every existing country key working — the Coach's button lists
   (`Coach.COUNTRY_OPTIONS`, `COUNTRY_OPTIONS_EXTRA`) reference keys
   `usa, uk, australia, canada, germany, italy, france, greece, japan, africa,
   brazil, egypt, india, southkorea, morocco, tunisia, mexico, europe, world`.
4. Restore the verbatim-copy relationship: implement in editor.js, re-paste the
   engine region into builder.js.

## Non-goals

- No change to the Coach's hand-maintained region beyond what the re-synced
  engine requires (its country buttons keep working as-is).
- No search UI inside Coach steps (possible follow-up).
- No preservation of the exact pixel geometry of the current hand-traced shapes.

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
    usa: { name: 'United States of America' },
    uk: { name: 'United Kingdom' },
    southkorea: { name: 'South Korea' },
    france: { name: 'France', mainlandOnly: true },
    /* ... remaining direct-name keys ... */
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
2. Resolve `key` → a GeoJSON feature: direct country via `COUNTRY_KEY_MAP` /
   dataset name match; composite via `topojson.merge` over the id list.
3. Project with `d3.geoAzimuthalEqualArea()` centered on the feature and
   `fitSize([120, 120], feature)` — equal-area projection avoids the extreme
   Mercator distortion of high-latitude countries (Canada), and a fixed fit box
   gives every country a consistent ~120 mm default size (path units are treated
   as millimetres by the engine; today's defaults vary arbitrarily per path).
4. Render to a path string with `d3.geoPath(projection).digits(2)` — 2-decimal
   coordinates keep each generated path to a few KB, which also keeps canvas
   JSON (localStorage autosave, quote submissions) small.

`addCountry(key)` and `addCountryOutline(key)` keep their names and signatures
but become async: they `await getCountryPathData(key)` and then run their
existing body (fabric SVG load, `shapeType = 'country'`, `countryName = key`,
fills/strokes) unchanged. The Coach captures the new shape via the canvas
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

- Engine "Add Country Outlines" panel: existing curated buttons stay unchanged.
  Below them, a type-ahead search — `<input list=...>` + `<datalist>` populated
  with all dataset country names (populated on first focus, triggering the
  dataset fetch). Choosing a name calls `addCountry`/`addCountryOutline` with
  that country.
- Coach button lists: unchanged.

### Error handling

- Fetch failure on an **add click** (offline, CDN down): show an alert ("Could
  not load country shapes — please check your connection and try again"), log
  to console, and **clear the cached promise** so the next click retries.
- Fetch failure on **datalist prefetch** (search-box focus): silent
  `console.warn` only — no alert for a UI warm-up; the alert path fires if the
  user then actually tries to add.
- Fetch failure inside the **UK template**: degrade to coins-only (see above),
  no alert.
- Unknown key (stale saved reference, typo): console warning, no shape added.

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

Implement everything in editor.js. Then re-paste editor.js into builder.js's
engine region (above/below the `ENGINE (verbatim copy of editor.js)` marker per
CLAUDE.md), leaving the Coach `<style>`/markup/`<script>` region untouched.
This restores the verbatim-copy invariant and gives editor.js users the full
country set too.

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
   recognizable, sensibly-sized shape (spot-check Canada for projection
   distortion, UK/Japan/Greece for multi-island rendering, France for
   mainland-only, europe/africa/world composites for completeness, and the
   africa **fill** for interior holes — Lesotho must render as a hole, which
   depends on ring winding + Fabric's fill rule).
3. Search box: find and add a country with no curated button (e.g. Portugal).
4. UK coin-holder template: UK outline appears at the expected size/position
   and the coin ring still renders (including with devtools offline — template
   degrades to coins-only).
5. Coach flow: step 2 country-as-holder (capture, aspect lock, send-to-back)
   and step 7 filled/outline personalization shapes.
6. Save → reload from localStorage with a country on canvas.
7. SVG export containing a country shape.
8. Simulate fetch failure (devtools offline) → alert shown on add click, retry
   works after reconnecting; search-box focus failure warns silently.
