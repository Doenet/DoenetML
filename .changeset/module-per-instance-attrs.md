---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: stop warning on author-declared attributes of `<module copy="$x" />` (or `extend=`) when `$x` resolves to a `<module>` whose `<moduleAttributes>` declares them; surface those declared names in the attribute-name autocomplete dropdown alongside `<module>`'s canonical attributes; and show the same description in the context-help panel when the cursor sits on one.

For each `<module copy=…>` / `<module extend=…>` site, the editor resolves the reference through the same Rust resolver the runtime uses, so bare names (`$m`), multi-segment paths (`$s.m`), and deeper chains all work. Scope rules match the runtime exactly: an inner `<module copy="$m">` inside `<section name="s1">` resolves to that section's `m`, not to another section's same-named module, and ambiguous references (e.g. `$s2.m` when two sibling sections share the name `s2`) produce no augmentation — the unknown-attribute warning correctly fires.

When the reference doesn't resolve, points at a non-`<module>`, or targets a `<module>` with no `<moduleAttributes>`, the canonical `<module>` schema decides as before and unknown-attribute warnings remain correct. Bracket-bearing path segments (`copy="$s[0].m"`) are conservatively skipped, and names reserved by the `<module>` class itself (`name`, `hide`, `copy`, `extend`, …) are filtered to match the runtime's silent rejection of such declarations.

Resolution is precomputed once per source revision and batched across all sites, so back-to-back validation + completion + help calls between edits cost at most one resolver round-trip per `<module copy=…>` site total.
