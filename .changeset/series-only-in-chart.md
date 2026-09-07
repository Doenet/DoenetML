---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: report a `<series>` written outside a `<chart>`, and stop reporting a narrowed child merely for being wrapped in a composite.

A `<series>` means nothing outside a `<chart>`, but the schema had it inheriting from `_base` and so accepted it at the root of a document, in a `<section>`, and in every other container that takes arbitrary content — where it would be built, drawn by nothing, and never mentioned. It is now narrowed to the one element whose child groups name it, so the editor says "Element `<series>` is not allowed inside of `<section>`" where the mistake was made, and tag completion stops offering it where it cannot go.

That narrowing is the mechanism `<shortDescription>` already used, and it had a matching gap: a component narrowed this way no longer reaches the `_base` that a content-transparent composite's child groups are written in terms of, so `<chart><repeat><series>…</series></repeat></chart>` was reported as a series in the wrong place — as `<chart><group><shortDescription>…</shortDescription></group></chart>` already was. A composite that expands to copies of whatever an author puts inside it is accepted wherever its container accepts children, and by the same argument it now accepts whatever its container would have. Building one series per group of the data is exactly what a `<repeat>` is for.

Part of #437.
