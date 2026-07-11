---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

`@doenet/standalone`: load the core worker from a co-located file instead of embedding it, cutting per-embed memory.

The standalone bundle previously embedded the entire ~15 MB core worker as an inline string, so every embedded viewer realm on a page held its own copy. It now ships the worker as a separate `doenetml-worker/` directory alongside `doenet-standalone.js` and loads it from there — using a tiny same-origin `importScripts` bootstrap when the bundle is served cross-origin (e.g. from a CDN, the way PreTeXt and doenet.org load it), so the realm no longer holds the ~15 MB copy. Measured ~70 MB less per embedded instance (a 20-instance textbook page saves well over 1 GB).

The worker files must be served alongside the bundle. This is automatic when loading from npm/CDN (e.g. jsdelivr serves the whole package) or from a normal `dist/` deploy; a host that serves only `doenet-standalone.js` in isolation must now also serve the `doenetml-worker/` directory next to it. A new `@doenet/doenetml/doenetml-external-worker.js` entry point drives this; the existing `@doenet/doenetml/doenetml-inline-worker.js` entry remains available for fully self-contained embeds.
