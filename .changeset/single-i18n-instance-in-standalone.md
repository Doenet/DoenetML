---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Fix `@doenet/standalone` rendering every language in English.

The bundle published as 0.7.22 never requested a message catalog. A document declaring `<document lang="ar">` was recognized in every visible way — it laid out right to left, negotiated its locale, labelled itself `lang="ar"` — and then read "Check Work", because the catalog that would have said otherwise sat unfetched beside the bundle.

The one file held two copies of `@doenet/i18n`: one built from source for `src/index.tsx`, which installs the loaders that fetch the served catalogs, and one already compiled into `@doenet/doenetml`, which is the copy the viewer resolves a language through. The loaders are module-level state and do not cross between instances, so the viewer's copy held none, judged every language unloadable, and fell back to English — which is exactly what it is supposed to do when a catalog cannot be reached, and therefore said nothing about it.

`@doenet/doenetml` now re-exports `setLocaleLoaders` and `fetchLocaleLoaders`, and `@doenet/standalone` reaches them through the same entry point its viewer comes from, which makes the setter and the reader one instance. A host installing its own catalogs should import them from `@doenet/doenetml` for the same reason.

Two guards, because neither half of this was visible: `npm run check:size -w packages/standalone` now fails the build unless the standalone bundle holds exactly one copy of `@doenet/i18n`, and a component spec renders a document in a language only a served catalog carries and asserts the request goes out.
