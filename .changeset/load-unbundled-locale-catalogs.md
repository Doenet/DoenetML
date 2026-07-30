---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Load message catalogs for languages that are not inlined into the bundle.

Only English and Spanish are carried inside the JavaScript. Every other language now arrives on demand: `@doenet/doenetml` code-splits each catalog into its own chunk, and `@doenet/standalone` — which is one file by construction, so it cannot code-split — serves them from `dist/locales/` beside the bundle. The viewer does the loading itself, so `documentLocale="de"` and `<document lang="de">` work with nothing configured, and a host's own `localeResources` still take precedence over anything shipped.

Adding a language is now a directory under `packages/i18n/locales/` and nothing else. At roughly 17 KB gzipped per translation, inlining every language would have put the cost of all of them on everyone who uses one, or none.

The catalogs are also no longer bundled into the core worker, which never reads them — it is handed the one catalog it needs by the main thread. The standalone bundle check fails the build if a served catalog turns up inside an emitted script or if a language is missing from `dist/locales/`, and `lint:i18n` fails if the set of inlined locales and the set the loader code-splits ever disagree.
