---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Fix a graph controls regression affecting consecutive regularPolygon center moves. Dependency change flags are now handled so inverse-definition reads can avoid consuming changes during argument construction while still clearing stale flags afterward, preventing stale dependency state from interfering with follow-up center moves and restore-state flows.
