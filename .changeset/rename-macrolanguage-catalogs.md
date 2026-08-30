---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Three message catalogs are now identified by the code of the language they are
actually written in rather than by the macrolanguage code above it: Northern
Kurdish is `kmr` (was `ku`), Komi-Zyrian is `kpv` (was `kv`) and Meadow Mari is
`mhr` (was `chm`). Each of the three shares its macrolanguage with a language
that has a separate catalog here — Central Kurdish, Komi-Permyak and Hill Mari
— so the old names claimed to cover readers they could not serve.

A host that supplies its own catalog for one of these languages through
`localeResources` keeps being served its own copy, whether it keys it on the
old code or the new one. Locale negotiation now treats an alias as an extra
fallback rather than a replacement, so a host catalog keyed on the old code is
still preferred over the bundled one — which also fixes the same latent problem
for `no`, `tw` and `man`.

Documents keep working unchanged. `<document lang="ku">`, `lang="kv"` and
`lang="chm"` still reach these catalogs, as do the new codes, and a browser
sending either form is served the same way it was before. `<document lang>`
autocomplete now offers the new codes, still under the English names CLDR gives
the macrolanguage — "Kurdish", "Komi", "Mari" — because ICU canonicalizes each
new code back onto it.

One deployment does need a change: a host that serves its own copy of the
catalog directory alongside the bundle and has hand-placed a translation in
`ku/`, `kv/` or `chm/` must move it to `kmr/`, `kpv/` or `mhr/`. The viewer now
fetches the new directory names, and a locale whose files 404 falls back to
English rather than failing the render. A copy the build takes from the package
picks up the new names on its own.
