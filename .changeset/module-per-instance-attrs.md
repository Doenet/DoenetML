---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: stop warning on author-declared attributes of `<module copy="$x" .../>` (or `extend=`) when `$x` resolves to a `<module>` whose `<moduleAttributes>` declares them, surface those declared names in the attribute-name autocomplete dropdown alongside `<module>`'s canonical attributes, and show the same description in the context-help panel when the cursor sits on one.

The runtime accepts arbitrary author-defined attributes on a `<module>` instance — the names that count as valid are whatever the referenced module's `<moduleAttributes>` declares — but the editor previously had no way to know that and flagged author-declared names like `center`, `color`, `radius` as unknown. Now, for each `<module copy=…>` / `<module extend=…>` site, the editor resolves the reference through the same Rust resolver the runtime uses, walks the target's `<moduleAttributes>` for direct children with a primitive `name` attribute, and treats those names (case-insensitively) as valid attributes on the instance.

Strictly per-instance: when the reference doesn't resolve, points at a non-`<module>`, or targets a `<module>` with no `<moduleAttributes>`, the canonical `<module>` schema decides as before and unknown-attribute warnings remain correct. Only bare-name references (`copy="$x"`) are augmented — complex chains (`$obj.sub`, `$arr[0]`) are conservatively skipped so the editor never silently augments a site whose runtime resolution it can't follow exactly. Names reserved by the `<module>` class itself (`name`, `hide`, `copy`, `extend`, …) are filtered to match the runtime's silent rejection of those declarations.

Resolution is precomputed once per source revision and batched across all `<module copy=…>` sites, so back-to-back validation + completion calls between edits issue at most one resolver round-trip per site.
