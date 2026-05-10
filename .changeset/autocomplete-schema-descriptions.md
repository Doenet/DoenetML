---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Show schema descriptions in autocomplete. Component-type, attribute, and property completions now display the same component summaries and attribute/property descriptions used by the context-sensitive help panel. Bare `$name` ref completions show `(<type>, line N)` as detail (matching CodeMirror's gutter) and the referent's component summary as documentation, making it easy to disambiguate names that shadow each other. Alias-aware: a `<row>` inside `<matrix>` pulls its docs from the `matrixRow` aliased entry, mirroring the help panel.

Schema description text now renders inline markdown in both surfaces. Authors writing `componentDocs.summary` or attribute/property descriptions can use `` `code` `` (e.g. `` `<answer>` ``), `*em*`, and `**strong**`; these render as `<code>`/`<em>`/`<strong>` in the autocomplete info popup and the help panel. Anything else is emitted as literal text. Component summaries that previously contained bare `<tag>` references have been updated to use backtick-quoted form for proper rendering.
