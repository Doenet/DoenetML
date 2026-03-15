# @doenet/prefigure

Standalone PreFigure compiler package for browser and CDN usage.

Run the PreFigure Python compiler in the browser via Pyodide + Web Worker.
This package can be loaded from NPM or from a CDN (jsDelivr) and provides a
full-featured PreFigure XML → SVG compiler without server dependencies.

## Attribution

This package includes code adapted from the PreFigure project and its browser
playground runtime:

- Upstream repository: https://github.com/davidaustinm/prefigure
- Project website: https://prefigure.org

The upstream-derived worker/runtime pieces remain available under the GNU
Affero General Public License, version 3 or later. This package is distributed
under the same AGPL-3.0-or-later license and preserves attribution to the
upstream PreFigure work. See `NOTICE.md` for package-specific provenance.

## Installation

```bash
npm install @doenet/prefigure
```

Or load from CDN:

```html
<script type="module">
  import * as prefigure from 'https://cdn.jsdelivr.net/npm/@doenet/prefigure@latest';
  await prefigure.initPrefigure();
  const result = await prefigure.compilePrefigure(diagramXml, { mode: 'svg' });
</script>
```

## Global API

When loaded in a browser, this package registers:

- `window.initPrefigure(indexURL?)`
- `window.prefigure(source, { mode, indexURL })`

Both methods return promises.

## Example

```html
<script type="module" src="./prefigure.js"></script>
<script type="module">
	await window.initPrefigure();
	const result = await window.prefigure(`<diagram dimensions="(100,100)"></diagram>`);
	console.log(result.svg, result.annotationsXml);
</script>
```

## Smoke Test

Run a local smoke harness that compiles a tiny diagram and checks for
non-empty SVG + annotations output:

```bash
npm run smoke -w @doenet/prefigure
```

Then open `http://127.0.0.1:4175/`.

The page shows `PASS` when `compilePrefigure(...)` returns both:

- SVG containing an `<svg>` element
- annotations XML containing `<annotations>` or `<annotation>`

## Automated Tests

Run package tests:

```bash
npm run test -w @doenet/prefigure
```

Current coverage includes API-level behavior tests for:

- default index URL resolution
- `initPrefigure()` idempotency and conflicting-URL guard
- `compilePrefigure()` delegation/result mapping
- dedicated-worker API wiring and compile delegation behavior

The browser smoke harness remains useful as a manual runtime check for real
Pyodide+WASM execution.

## Wheel Requirement

Builds currently vendor wheels from `pyodide_packages/`. Before publishing,
ensure a matching `prefig-<version>-py3-none-any.whl` is present there.
At runtime, `initPrefigure()` defaults to loading from `./assets/`.

## Repository Hygiene

These directories/files in `packages/prefigure` are generated and safe to
delete locally:

- `dist/`
- `pyodide_packages/`
- `.wireit/`
- `src/worker/liblouis/generated/build-no-tables-utf32.js`
- `src/worker/liblouis/generated/*.cti`
- `src/worker/liblouis/generated/*.ctb`
- `src/worker/liblouis/generated/*.uti`
- `src/worker/liblouis/generated/*.dis`

They are re-created by build/setup scripts and are already ignored by the
repository `.gitignore`.

## Maintenance Procedures

### First-time setup

```bash
npm run setup -w @doenet/prefigure
```

This downloads:

- runtime Pyodide wheels and the pinned `prefig` wheel into `pyodide_packages/`
- liblouis JS/tables into `src/worker/liblouis/generated/`

### Normal build + publish checks

```bash
npm run build -w @doenet/prefigure
npm run verify-wheel-sync -w @doenet/prefigure
```

`verify-wheel-sync` ensures `src/worker/compiler-metadata.ts` and
`pyodide_packages/` reference the same `prefig` wheel.

### Upgrade `prefig` wheel version

1. Update `PREFIG_WHEEL_FILENAME` in `src/worker/compiler-metadata.ts`.
2. Run `npm run setup -w @doenet/prefigure`.
3. Run `npm run verify-wheel-sync -w @doenet/prefigure`.
4. Build and smoke test:

```bash
npm run build -w @doenet/prefigure
npm run smoke -w @doenet/prefigure
```

### Upgrade Pyodide runtime packages

1. Bump `pyodide` in `packages/prefigure/package.json`.
2. Run `npm install` at repo root.
3. Run `npm run setup -w @doenet/prefigure` (reads the new `pyodide-lock.json`).
4. Run build + smoke test.

### Upgrade liblouis assets

1. Update `LIBLOUIS_REF` and hashes in `scripts/fetch-liblouis.js`.
2. Run `npm run setup -w @doenet/prefigure`.
3. Run build + smoke test.
