---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/v06-to-v07": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`<subsetOfRealsInput>` improvements:

- Propagate the input's `variable` through `extend`. Previously, `<subsetOfReals extend="$input" displayMode="inequalities" />` ignored the input's variable and rendered with the `<subsetOfReals>` default `x`. The `subsetValue` shadowing instructions now include the `variable` attribute, matching the pattern `<mathInput>` uses for its number-display attributes.
- Hide attributes that the renderer currently ignores from the generated schema (`xMin`, `xMax`, `width`, `height`, `dx`, `xlabel`) via `excludeFromSchema: true` so they no longer appear in autocomplete or auto-generated docs. The attributes remain on the class — this is a documentation/schema cleanup, not a behavior change for documents that already set them.
- Add the long-missing reference page at `packages/docs-nextra/pages/reference/subsetOfRealsInput.mdx`, with a regression test exercising the variable-shadowing fix and an updated alphabetical-index entry.
