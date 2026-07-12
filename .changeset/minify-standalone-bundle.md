---
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Minify the published `@doenet/standalone` bundle.

Vite's built-in `minify` was not actually being applied to this library build, so the shipped `doenet-standalone.js` was un-minified (~33 MB). An explicit esbuild minification pass now runs on the emitted bundle (with source maps preserved and chained back to original sources), cutting it to ~28 MB and reducing the JavaScript each embedded viewer realm parses. No behavior change.
