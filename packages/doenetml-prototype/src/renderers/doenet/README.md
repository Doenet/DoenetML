# Doenet Components

These components are for rendering interactive Doenet on a webpage.

## Adding a new renderer

A `create-renderer-stub` script is available, identical in usage to the one
in `doenetml-to-pretext` — see that package's
[renderer README](../../../packages/doenetml-to-pretext/src/renderers/pretext-xml/README.md)
for full instructions. Run it from the `doenetml-prototype` package root:

```
npm run create-renderer-stub -- <tagName> <RendererName> [children|nochildren]
```