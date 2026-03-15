The Node package for liblouis does not work in a modern browser.
This module uses browser-compatible assets from
https://github.com/liblouis/js-build.

Generated assets are written to `src/worker/liblouis/generated/` by
`scripts/fetch-liblouis.ts` during setup/build.

In particular, `generated/build-no-tables-utf32.js` comes from upstream,
with one line appended at the end:

```
export { liblouisBuild as capi };
```
This makes it importable into JavaScript modules.

`easy-api.ts` is adapted from the PreFigure playground's
`src/worker/liblouis/easy-api.ts` with package-specific adaptations.
At runtime, it copies generated table files into Emscripten's in-memory FS
under `/liblouis/tables` and passes absolute table paths to liblouis.

Braille translation tables are fetched from:
https://github.com/liblouis/js-build/tree/master/tables
