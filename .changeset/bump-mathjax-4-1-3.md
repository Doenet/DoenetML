---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Update the bundled MathJax from 4.1.0 to 4.1.3.

Doenet now loads MathJax `4.1.3` (from 4.1.0) for the copy it injects when a
page provides none, and the VS Code preview's Content-Security-Policy allowlist
is bumped to match. The `4.1.x` line is bug-fix only: 4.1.3 notably fixes
infinite-loop crashes in the semantic-enrichment/speech code, a Safari rendering
bug for math in `overflow: auto` containers, and assorted TeX edge cases; 4.1.1
and 4.1.2 improved dark-mode contrast and accessibility. This also aligns the
version Doenet injects with what host pages that ship a floating `mathjax@4`
tag (e.g. PreTeXt books) now load, so typesetting is consistent whether Doenet
loads MathJax itself or reuses a host-provided engine.

Note: MathJax 4.1.2 corrected the LaTeX size macros (`\large`, `\tiny`, etc.) to
use standard LaTeX sizes.
