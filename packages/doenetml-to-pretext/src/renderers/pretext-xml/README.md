# Pretext Components

These components are for rendering to PreTeXt XML (not for a webpage, but
for recompilation with the PreTeXt compiler).

## Adding a new renderer

A script is provided to scaffold a new renderer stub. From the
`doenetml-to-pretext` package root, run:

```
npm run create-renderer-stub -- <tagName> <RendererName> [children|nochildren]
```

This creates a `.tsx` stub file in this directory, updates `index.ts` to
export it, and registers the tag in `renderers.ts`. If the passthrough mode
is omitted the script will prompt interactively.

After running the script, fill in the stub's return value with the correct
PreTeXt output and replace the `props: unknown` type with the real prop type
from `@doenet/doenetml-worker`.