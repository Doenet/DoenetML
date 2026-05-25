---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`<section name=foo>` and similar unquoted attribute values now produce a single diagnostic both in the viewer and in the editor hover, instead of up to four overlapping ones (an "invalid attribute" from the worker, two duplicate "missing value" parser errors, and a "name=''" normalization error). The unified message names the corrected form (`name="foo"`). Authors who write an unquoted value on an unknown attribute (e.g. `<a foo=bar />`) see only the unquoted-value warning until the quoting is fixed; the follow-up "unknown attribute" warning surfaces on the next edit.

Also fixes a pre-existing parser duplication: errors that lived inside the first attribute of an open tag (e.g. the "missing value" warning for `<x name= />`) were emitted twice. They now appear once.

And fixes a pre-existing LSP severity bug: DoenetML diagnostics with a soft severity (`warning`, `info`) were rendered as red error squiggles in the editor regardless. Deprecation warnings and the new unquoted-attribute warning now render with the appropriate yellow/blue squiggle color.
