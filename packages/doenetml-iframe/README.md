# DoenetML IFrame Renderer

This workspace contains a DoenetML renderer that renders inside of an iframe. This allows DoenetML
to be used without affecting the surrounding page. It also allows multiple versions of DoenetML to
be used at the same time.

## Development

Source code in `src/iframe-index.ts` is pre-compiled and included directly in the generated iframe.
Source code in `src/index.tsx` is compiled into the `DoenetMLIframe` component.
