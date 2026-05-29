---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Propagate `styleNumber` from a composite (e.g. `<group>`) to the components it creates.

Setting `styleNumber` on a `<group>` previously had no effect on the members inside it — they rendered with the default style — because `styleNumber` only inherited from the rendered parent, and a group's members are reparented out of the group into its container. Members now fall back to the `styleNumber` of the composite that created them, so `<group styleNumber="4">…</group>` styles its contents the same way `<graph styleNumber="4">` already did. An explicit `styleNumber` on a member still wins, and a containing element's `styleNumber` (e.g. the `<graph>` the group sits in) takes precedence over the group's.
