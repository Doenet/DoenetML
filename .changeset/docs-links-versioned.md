---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: the documentation links in context help and diagnostics now go to this line's docs, `https://docs.doenet.org/0.8/…`, instead of the root of docs.doenet.org.

The docs site now serves each line of DoenetML at a path of its own (`/0.7/`, `/0.8/`), and its root redirects to the current release, so a link to the root would land on another line's docs once that line changes. A host that sets the `docsURL` prop is unaffected.
