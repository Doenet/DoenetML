---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Fix a graph controls regression that affected consecutive regularPolygon center moves. Dependency change flags are now preserved during inverse-definition argument construction and then consumed afterward to prevent stale flags from affecting follow-up center moves and restore-state flows.
