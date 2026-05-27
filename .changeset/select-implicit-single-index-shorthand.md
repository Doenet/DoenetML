---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: surface autocomplete and context-sensitive help for `$s.t` shorthand on the select family when the count attribute is absent or literal `"1"`.

Before this change the autocomplete dropdown and the help panel both treated `<select>` (and its siblings `selectFromSequence`, `selectRandomNumbers`, `selectPrimeNumbers`, `samplePrimeNumbers`, `sampleRandomNumbers`) as `takesIndex` composites whose descendants are only addressable via `$s[1].t`. The runtime already resolves `$s.t` like `$s[1].t` when the composite produces a single replacement (Select.js wraps each chosen option's serialized contents in a `<group>`, and group children propagate names to the parent's name_map), so authors with `numToSelect="1"` (the default) were correctly typing `$s.t` and getting no editor help despite the runtime accepting it.

The rule is a strict textual DAST check: the shorthand applies iff the count attribute is absent OR its source text, trimmed, equals exactly `"1"`. `numToSelect="$n"` (dynamic, even when `$n` evaluates to 1), `"01"`, `"1.0"`, `"One"`, and `"2"` deliberately do NOT qualify — authors who need shorthand with dynamic count write `$s[1].t` explicitly. Attribute names are matched case-insensitively to mirror the worker (so `<select NumToSelect="2">` is correctly rejected, not silently treated as "attribute absent" — the worker accepts mixed-case attributes via its lowercase-mapping pass). Element names are not case-insensitive at the worker (`<SELECT>` is rejected as an invalid component type), but the predicate lowercases them too as harmless LSP defensiveness. Both the autocomplete and the context-help layers read from the same resolver-adapter output for a given DAST node, so they cannot diverge on whether to surface the shorthand on a given source.

Behaviour:
- `$s.t` (with `numToSelect` absent or `"1"`, possibly whitespace-padded) now offers descendant completions and renders the same `refName` help payload as `$s[1].t`.
- `$s.numToSelect` (and other composite-own properties) still completes and shows property help — the shorthand commits to descendant resolution only. `$s[1].numToSelect` continues to surface nothing, since with an authored bracket the cursor is on the replacement (which has no `numToSelect` property), matching how the worker resolver behaves.
- `$s.t` with `numToSelect="2"` / `"$n"` / non-canonical literals continues to surface no descendants and no help, matching today's runtime: the author must write `$s[1].t`.

Each select-family member reads its real count attribute (`numToSelect` for the four `select*` tags, `numSamples` for the two `sample*` tags) — the shared `SELECT_FAMILY_COUNT_ATTRIBUTE` table is the single source so the predicate stays consistent across layers.

Closes #1181.
