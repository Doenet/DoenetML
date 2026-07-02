# DoenetML

Semantic markup for building interactive web activities.
[Read more about Doenet](https://www.doenet.org)

```xml
<p>Drag the point to the 4th quadrant.</p>
<graph>
    <point xs='2 3'/>
</graph>
```

![](media/graph_example.png)

## Features

-   Internally manages a directed acyclic graph of dependencies to coordinate updates of self-referential worksheets

## DoenetEditor

### Programmatic control of the diagnostics panel

`<DoenetEditor>` exposes a ref handle (`DoenetEditorHandle`) so embedding apps
can open or close the diagnostics/responses panel and switch between its tabs
(`"errors" | "warnings" | "info" | "accessibility" | "responses"`). Each call
is independent, so re-clicking a link after the user has closed the panel
reopens it without consumer state management.

```tsx
import { useRef } from "react";
import { DoenetEditor, type DoenetEditorHandle } from "@doenet/doenetml";

function App() {
    const editorRef = useRef<DoenetEditorHandle>(null);
    return (
        <>
            <button
                onClick={() =>
                    editorRef.current?.openDiagnosticsTab("accessibility")
                }
            >
                Show accessibility violations
            </button>
            <button
                onClick={() => editorRef.current?.closeDiagnosticsPanel()}
            >
                Close panel
            </button>
            <DoenetEditor ref={editorRef} doenetML="..." />
        </>
    );
}
```

For the "open with the panel already on a tab on first paint" case, set
`initialOpenTab`. Reactive changes after mount are ignored — use the ref
handle for runtime control.

```tsx
<DoenetEditor doenetML="..." initialOpenTab="accessibility" />
```

If the editor may be lazy-mounted (e.g., the link is in a different panel of
your app from the editor embed), combine the two: pass `initialOpenTab` on
first mount, then use the ref handle on subsequent clicks.

```tsx
const [showEditor, setShowEditor] = useState(false);
const [pendingTab, setPendingTab] = useState<
    DiagnosticsTabId | undefined
>(undefined);
const editorRef = useRef<DoenetEditorHandle>(null);

function onLinkClick(tab: DiagnosticsTabId) {
    if (showEditor && editorRef.current) {
        editorRef.current.openDiagnosticsTab(tab);
    } else {
        setShowEditor(true);
        setPendingTab(tab);
    }
}

return (
    showEditor && (
        <DoenetEditor
            ref={editorRef}
            doenetML="..."
            initialOpenTab={pendingTab}
        />
    )
);
```

### Programmatically updating the rendered view

The same ref handle exposes `updateRenderedView()`, the programmatic
equivalent of clicking the editor's "Update" button. Use it to flush any
pending edits to the viewer so the next `diagnosticsSummaryCallback`
reflects the current editor buffer rather than stale state. If the source
hasn't changed and the document hasn't been interacted with, the call is a
no-op (matching the visually-disabled button). When `showViewer={false}`,
the call is ignored with a `console.warn`.

```tsx
function App() {
    const editorRef = useRef<DoenetEditorHandle>(null);
    return (
        <>
            <button onClick={() => editorRef.current?.updateRenderedView()}>
                Update viewer
            </button>
            <DoenetEditor
                ref={editorRef}
                doenetML="..."
                diagnosticsSummaryCallback={(summary, doenetML) => {
                    // `doenetML` here is the source the viewer rendered against,
                    // so you can correlate the summary with what the user typed
                    // before pressing your "Update" trigger.
                }}
            />
        </>
    );
}
```

## Quick Start

In the project folder:

`$ npm install`

`$ npm run dev`

Paste demo code into `packages/test-viewer/src/test/testCode.doenet`

Navigate to `localhost:5173`

## Development

### PreFigure Renderer Configuration

When using `renderer="prefigure"` on a graph, the viewer may load an external
diagcess script and call a prefigure build endpoint. Both URLs are configurable
via Vite environment variables:

- `VITE_PREFIGURE_BUILD_ENDPOINT`
- `VITE_PREFIGURE_DIAGCESS_SCRIPT_URL`
- `VITE_PREFIGURE_MODULE_URL`
- `VITE_PREFIGURE_INDEX_URL`

If not provided, defaults are used from
`src/Viewer/renderers/utils/prefigureConfig.ts`.

Note: the default module URL pins a published `@doenet/prefigure` package tag
for CDN usage. That value is intentionally managed independently from
`@doenet/prefigure` compiler wheel metadata (`PREFIG_VERSION` /
`PREFIG_WHEEL_FILENAME`), which only centralizes the runtime wheel version.

### CSP Notes for PreFigure Renderer

If your deployment enforces Content Security Policy, ensure the hosts for your
configured prefigure endpoints are allowed:

- `script-src` should allow `VITE_PREFIGURE_DIAGCESS_SCRIPT_URL` host
- `connect-src` should allow `VITE_PREFIGURE_BUILD_ENDPOINT` host

With defaults, this corresponds to:

- `script-src https://cdn.jsdelivr.net`
- `connect-src https://prefigure.doenet.org`

### Publishing

Run

```bash
npm run build
```

to make a publishable package in the `./dist` directory. As part of the build process a stripped
down version of `package.json` is copied into the `./dist` directory. **This** is the package that you should publish.
I.e., do a `cd ./dist` before publishing.
