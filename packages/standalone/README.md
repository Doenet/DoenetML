# Standalone DoenetML Renderer

This workspace contains a standalone DoenetML renderer that can coordinate serialized initialization across multiple iframes to prevent performance issues.

## Quick Start

### Single Page

```html
<!doctype html>
<html>
<head>
    <script src="doenet-standalone.js"></script>
</head>
<body>
    <div class="doenetml-viewer">
        <script type="text/doenetml">
            <p>Hello DoenetML!</p>
            <graph>
                <point>(2,3)</point>
            </graph>
        </script>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.doenetml-viewer').forEach((container) => {
                renderDoenetViewerToContainer(container);
            });
        });
    </script>
</body>
</html>
```

### Multiple Documents in Separate Iframes

**Parent page:**
```html
<script src="doenet-standalone.js"></script>
<script>
    initializeDoenetParentCoordinator({
        strategy: "viewport-first",
        timeoutMs: 30000
    });
</script>
<iframe src="doc1.html"></iframe>
<iframe src="doc2.html"></iframe>
```

**Each iframe (doc1.html, doc2.html, etc.):**
```html
<script src="doenet-standalone.js"></script>
<div class="doenetml-viewer" data-doenet-enable-parent-coordination="true">
    <script type="text/doenetml">
        <p>DoenetML content</p>
    </script>
</div>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.doenetml-viewer').forEach((container) => {
            renderDoenetViewerToContainer(container);
        });
    });
</script>
```

## API Reference

### `renderDoenetViewerToContainer(container, doenetMLSource?, options?)`

Renders a DoenetML viewer to a specific container element.

**Parameters:**
- `container`: DOM element to render into
- `doenetMLSource`: (optional) DoenetML source code. If omitted, reads from `<script type="text/doenetml">` child
- `options`: (optional) Configuration object:
  - `enableParentCoordination`: Enable serialized initialization with parent coordinator (default: `false`)
  - Other DoenetViewer options (flags, callbacks, etc.)

### `initializeDoenetParentCoordinator(options?)`

Coordinates initialization across multiple child iframes. Call this from the parent page that contains DoenetML iframes. Ensures only one iframe initializes at a time.

**Parameters:**
- `options`: (optional) Configuration object:
  - `strategy`: `"dom-order"` (default) or `"viewport-first"`
  - `timeoutMs`: Maximum wait time for iframe initialization (default: `30000`)

### `renderDoenetEditorToContainer(container, doenetMLSource?, config?)`

Renders a DoenetML editor to a container element.

**Parameters:**
- `container`: DOM element to render into
- `doenetMLSource`: (optional) DoenetML source code. If omitted, reads from `<script type="text/doenetml">` child
- `config`: (optional) Configuration object for DoenetEditor

## Configuration

Use data attributes on viewer containers to enable parent coordination:

```html
<div class="doenetml-viewer" 
     data-doenet-enable-parent-coordination="true">
    <script type="text/doenetml">...</script>
</div>
```

See [COORDINATION.md](./COORDINATION.md) for detailed documentation on cross-iframe coordination.

### Coordination Strategies

These are configured on the parent coordinator via `initializeDoenetParentCoordinator()`:

- **`dom-order`** (default): Initialize iframes in DOM order
- **`viewport-first`**: Prioritize visible iframes, then initialize remaining in DOM order

## Development

Run

```bash
npm run dev
```

to start a `vite` dev server that serves the test viewer and navigate to the indicated URL.
