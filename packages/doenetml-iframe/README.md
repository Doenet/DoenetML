# DoenetML IFrame Renderer

This workspace contains a DoenetML viewer and editor that render inside of an iframe.
This allows DoenetML to be used without affecting the surrounding page.
It also allows multiple versions of DoenetML to be used at the same time.

## DoenetEditor

### Programmatic control of the diagnostics panel

The iframe `<DoenetEditor>` accepts the same `initialOpenTab` prop and
`DoenetEditorHandle` ref API as the in-process `<DoenetEditor>` from
`@doenet/doenetml`. Calls bridge into the iframe via ComLink. If the
ref handle is invoked before the iframe has finished loading, the call
is queued in the outer wrapper and replayed once the iframe is ready —
consumers do not need to coordinate timing.

```tsx
import { useRef } from "react";
import {
    DoenetEditor,
    type DoenetEditorHandle,
} from "@doenet/doenetml-iframe";

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
            <DoenetEditor ref={editorRef} doenetML="..." />
        </>
    );
}
```

Mount-time form (panel opens on the requested tab on first paint):

```tsx
<DoenetEditor doenetML="..." initialOpenTab="accessibility" />
```

Valid tab IDs: `"errors" | "warnings" | "info" | "accessibility" | "responses"`.
See the `@doenet/doenetml` README for usage patterns including the lazy-mount
"link in a different panel" scenario.

## Development

Source code in `src/iframe-viewer-index.ts` and `src/iframe-editor-index.ts`
is pre-compiled and included directly in the generated iframe.
Source code in `src/index.tsx` is compiled into the `DoenetViewer` and `DoenetEditor` components.
