# Cross-Iframe Coordination

When loading multiple DoenetML documents in separate iframes, the parent window can coordinate initialization to prevent performance issues caused by simultaneous rendering.

## Quick Start

### Parent Page (with iframes)

```html
<!doctype html>
<html>
<head>
    <script src="doenet-standalone.js"></script>
</head>
<body>
    <h1>DoenetML Documents</h1>

    <script>
        // Initialize parent coordinator to serialize iframe initialization
        initializeDoenetParentCoordinator({
            strategy: "viewport-first",
            timeoutMs: 30000
        });
    </script>

    <iframe src="doc1.html"></iframe>
    <iframe src="doc2.html"></iframe>
    <iframe src="doc3.html"></iframe>
</body>
</html>
```

### Child Page (each iframe)

```html
<!doctype html>
<html>
<head>
    <script src="doenet-standalone.js"></script>
</head>
<body>
    <div class="doenetml-viewer" data-doenet-enable-parent-coordination="true">
        <script type="text/doenetml">
            <p>My DoenetML content</p>
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

## Strategies

### dom-order (default)

Initializes iframes in DOM order (1st iframe first, then 2nd, then 3rd, etc.).

```javascript
initializeDoenetParentCoordinator({
    strategy: "dom-order"
});
```

### viewport-first

Prioritizes visible iframes, initializing those in viewport first (sorted by DOM order), then initializes remaining iframes in DOM order.

```javascript
initializeDoenetParentCoordinator({
    strategy: "viewport-first"
});
```

Perfect for pages where users may scroll to see content - visible content initializes first for a responsive feel.

**Note**: Visibility is detected using an IntersectionObserver with a 600px rootMargin, meaning iframes are considered "visible" when they're within 600px of the viewport edges.

## Script Placement

The coordinator should be initialized before or immediately after creating iframes.
This ensures the parent is listening for `DOENET_REGISTER` messages when child frames load.

## How It Works

1. **Child Registration**: When a child iframe with `data-doenet-enable-parent-coordination="true"` loads, it registers with the parent. Visibility changes are reported separately.

2. **Initial Wait**: The parent waits 100ms to collect registrations from all iframes. This ensures:
   - All DOM positions are captured
   - Selection logic can make informed decisions

3. **Selective Permission**: The parent grants initialization permission to one iframe at a time based on strategy:
   - **dom-order**: Next iframe in DOM order
   - **viewport-first**: Visible iframe (by DOM order), or if none visible, next in DOM order

4. **Serialized Rendering**: Each iframe waits for permission before rendering. Only one iframe renders at a time.

5. **Continued Selection**: When an iframe completes, the parent selects and grants permission to the next iframe.

## Configuration Options

```javascript
initializeDoenetParentCoordinator({
    // Initialization strategy (default: "dom-order")
    strategy: "dom-order" | "viewport-first",
    
    // Maximum time to wait for iframe to complete initialization (default: 30000ms)
    // If exceeded, automatically proceeds to next iframe
    timeoutMs: 30000
});
```

## Edge Cases

- **Unresponsive Iframe**: If an iframe fails to complete initialization, the parent waits up to `timeoutMs` before proceeding to the next iframe.
- **Rapid Registration**: All registrations during the initial 100ms are captured and processed fairly.
- **Late Registrations**: Iframes that register after the initial 100ms window will be queued and processed after currently-active iframe completes.
- **Visibility Changes**: When using viewport-first, visibility changes after registration are tracked and can cause re-prioritization of queued iframes.

## Backward Compatibility

- Pages without a coordinator work as before (immediate initialization)
- The `enableParentCoordination` flag is optional and defaults to false
- Pages with coordinator work whether or not child pages enable the flag; unflagged pages just initialize immediately

## Console Logging

No debug logs are emitted by default.
