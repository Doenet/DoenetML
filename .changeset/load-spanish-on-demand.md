---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Load Spanish on demand like every other translation, leaving English as the only language carried inside the JavaScript.

Spanish was inlined back when it was the only translation there was. With nine of them, a language earns its place in the bundle by being worth its weight to every consumer — including the ones who never read it — and no single language clears that bar. This takes about 116 KB off `@doenet/standalone` and one chunk off `@doenet/doenetml`, and it makes the rule uniform: English terminates every fallback chain, everything else arrives on demand.

Nothing needs configuring. `documentLocale="es"` and `<document lang="es">` work exactly as before — `@doenet/doenetml` code-splits the Spanish catalogs into their own chunks, and `@doenet/standalone` serves them from the `locales/` directory beside the bundle, the same way it already served the other eight.

What changes is when they arrive. A Spanish document now paints in English for as long as the catalog takes to load and then re-renders in Spanish, because a document's language is fixed for the lifetime of the core that renders it and is not known until the source has been parsed. That was already true of the other eight languages; Spanish now behaves the same. A host that wants Spanish on the first frame can still pass the catalogs in as `localeResources`, which take precedence over anything shipped and are in hand before the first render.
