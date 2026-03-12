# @doenet/prefigure

Standalone PreFigure compiler package for browser and CDN usage.

Run the PreFigure Python compiler in the browser via Pyodide + Web Worker.
This package can be loaded from NPM or from a CDN (jsDelivr) and provides a
full-featured PreFigure XML → SVG compiler without server dependencies.

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

## Wheel Requirement

Builds currently vendor wheels from `pyodide_packages/`. Before publishing,
ensure a matching `prefig-<version>-py3-none-any.whl` is present there.
At runtime, `initPrefigure()` defaults to loading from `./assets/`.
