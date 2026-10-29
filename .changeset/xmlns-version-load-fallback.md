---
"@doenet/doenetml-iframe": patch
---

When the `xmlns` of a `<document>` names a DoenetML version that cannot be loaded (mistyped, or never published), the iframe `DoenetViewer` and `DoenetEditor` now fall back at once to the version the host would otherwise use, instead of showing a blank iframe for a minute first. The fallback editor now loads and marks the bad version as an error on the `xmlns` attribute, so an author can fix it; it used to stay blank. The viewer logs a console warning naming the version it used instead. Both messages give a fallback version number with its `v` prefix (`v0.7.27`, not `0.7.27`).

After such a fallback, a viewer whose `doenetML` changes to a document naming a different version now loads that version. It used to stay on the fallback version for every later document. This holds even when the fallback failed to load too: a viewer showing a load error now tries the version a new `doenetML` names, where it used to keep showing the error without requesting that version. Likewise, a viewer showing a load error now loads the new bundle when a change to the host's `standaloneUrl` or `doenetmlVersion` selects a different one; it used to keep showing the error.

A standalone bundle that fails to load for any other reason, such as a host-specified `standaloneUrl` that returns 404, now shows its error right away instead of after the same one-minute wait.

Closes #2383.
