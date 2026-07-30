---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Load message catalogs for languages that are not inlined into the bundle.

Only English and Spanish are carried inside the JavaScript. Every other language now arrives on demand: `@doenet/doenetml` code-splits each catalog into its own chunk, and `@doenet/standalone` — which is one file by construction, so it cannot code-split — serves them from a `locales/` directory beside the bundle. The viewer does the loading itself, so `documentLocale="de"` and `<document lang="de">` work with nothing configured, and a host's own `localeResources` still take precedence over anything shipped.

Adding a language is now a directory under `packages/i18n/locales/` and nothing else. At roughly 16 KB gzipped per translation, inlining every language would have put the cost of all of them on everyone who uses one, or none.

`@doenet/standalone` therefore ships a new `locales/` directory, which should be served alongside `doenet-standalone.js`. Nothing breaks if it is not: those fetches fail quietly and the language falls back to English, which is what it does today.
