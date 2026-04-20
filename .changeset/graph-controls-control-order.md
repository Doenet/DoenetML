---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Improve graph controls ordering across control types. Controls now follow descendant order by default (instead of rendering grouped by type), and graphical controls support a new `controlOrder` attribute to request an earlier or later position in the controls list. `controlOrder` values are 1-indexed, while `0` keeps the default ordering behavior.