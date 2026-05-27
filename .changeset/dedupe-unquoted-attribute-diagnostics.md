---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`<section name=foo>` and similar unquoted attribute values now produce a single error both in the viewer and in the editor, instead of up to four overlapping diagnostics (an "invalid attribute" from the worker, two duplicate "missing value" parser errors, and a "name=''" normalization error). The unified message names the corrected form (`name="foo"`) and is classified as an error so the viewer renders the orange error block — matching the existing severity for the related shapes `<section name>` and `<section name="4" />`. Authors who write an unquoted value on an unknown attribute (e.g. `<a foo=bar />`) see only the unquoted-value error until the quoting is fixed; the follow-up "unknown attribute" warning surfaces on the next edit.

Also fixes a pre-existing parser duplication: errors that lived inside the first attribute of an open tag (e.g. the "missing value" warning for `<x name= />`) were emitted twice. They now appear once.

And fixes a pre-existing LSP severity bug: DoenetML diagnostics with a soft severity (`warning`, `info`) were rendered as red error squiggles in the editor regardless. Deprecation warnings now render with the appropriate yellow/blue squiggle color.

And fixes a pre-existing duplication in the editor hover: parser-emitted DAST errors were surfaced once by the LSP and again by the worker's runtime diagnostics once the viewer ran, so the hover tooltip showed the same message twice even though only one squiggle was drawn. The duplicate copy is now collapsed before reaching the editor.
