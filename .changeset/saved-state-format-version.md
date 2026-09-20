---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Saved reader state now says which format it is in, and state a viewer cannot read is discarded with a notice rather than misapplied.

The payload a host stores carried no version. Hosts are told to keep it opaque and hand it back unread, so state written by an older version of Doenet arrived looking exactly like current state — and 0.8 changed how that state is keyed, which meant a reader's values would have been applied to components they no longer denote. Silently, and with no way to tell the two apart.

`data_format_version` now travels *inside* the payload, alongside `cid`, where it survives that round trip; a field beside it would not. On load, a payload whose version this viewer does not recognise is discarded and the document starts fresh, with a notice beside it saying the work was saved by an earlier version. Credit already recorded is unaffected, since score is reported separately from the state.

The same field already guarded locally cached state in IndexedDB and is unchanged there. It is bumped to `0.8.0`, which also clears that cache.

For hosts: nothing to change. The payload stays opaque and is still stored and returned as-is.
