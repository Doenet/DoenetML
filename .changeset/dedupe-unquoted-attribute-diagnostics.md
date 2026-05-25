---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

`<section name=foo>` and similar unquoted attribute values now produce a single diagnostic both in the viewer and in the editor hover, instead of up to four overlapping ones (an "invalid attribute" from the worker, two duplicate "missing value" parser errors, and a "name=''" normalization error). The unified message names the corrected form (`name="foo"`). Authors who write an unquoted value on an unknown attribute (e.g. `<a foo=bar />`) see only the unquoted-value warning until the quoting is fixed; the follow-up "unknown attribute" warning surfaces on the next edit.
