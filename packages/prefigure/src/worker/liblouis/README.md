The node package for liblouis does not work in a modern browser.
This module uses browser-compatible assets from
https://github.com/liblouis/js-build.

Generated assets are written to `src/worker/liblouis/generated/` by
`scripts/fetch-liblouis.js` during setup/build.

In particular, `generated/build-no-tables-utf32.js` comes from upstream,
with one line appended at the end:

```
export { liblouisBuild as capi };
```
This makes it importable into Javascript modules.

`easy-api.ts` is reimplemented from `easy-api.js` with Doenet-specific changes.
At runtime, it copies generated table files into Emscripten's in-memory FS
under `/liblouis/tables` and passes absolute table paths to liblouis.

Braille translation tables are fetched from:
https://github.com/liblouis/js-build/tree/master/tables
