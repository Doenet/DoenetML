---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add reference documentation for sectional and block-level components that were previously undocumented: `<activity>`, `<blockQuote>`, `<br>`, `<conclusion>`, `<definition>`, `<exercises>`, `<hr>`, `<introduction>`, `<objectives>`, `<paragraphs>`, `<part>`, `<problems>`, `<span>`, `<statement>`, `<subsection>`, `<subsubsection>`, `<task>`, and `<theorem>`. Each component has been removed from `undocumented-components-allowlist.txt`.

Correct misleading `componentDocs.summary` strings that overstated auto-numbering. Sections (`<section>`, `<subsection>`, `<subsubsection>`, `<paragraphs>`, `<part>`, `<task>`, `<definition>`, `<theorem>`) only render an auto-generated number when no explicit `<title>` is provided (`includeAutoNumber` defaults to `false` and `includeAutoNumberIfNoTitle` defaults to `true`), so summaries no longer assert that they are unconditionally numbered. The `<section>`, `<example>`, `<problem>`, and `<exercise>` reference pages have been reworded similarly. `<statement>`, `<introduction>`, and `<conclusion>` summaries now describe what they group rather than implying sectional auto-numbering.

Also re-label and link the entries for these components in the `Index by Component Type` and `Alphabetical Component Index` pages, including newly-added rows for `<blockQuote>`, `<br>`, `<hr>`, `<span>`, `<part>`, `<task>`, and `<subsubsection>`. The `<section>` entry in those tables no longer asserts that the rendered block is auto-numbered, and the previously placeholder descriptions of the form "container element included for PreTeXt compatibility" are replaced with a brief author-facing description per component.
