# DoenetML IFrame Renderer

This workspace contains a DoenetML viewer and editor that render inside of an iframe.
This allows DoenetML to be used without affecting the surrounding page.
It also allows multiple versions of DoenetML to be used at the same time.

## Development

Source code in `src/iframe-viewer-index.ts` and `src/iframe-editor-index.ts`
is pre-compiled and included directly in the generated iframe.
Source code in `src/index.tsx` is compiled into the `DoenetViewer` and `DoenetEditor` components.
