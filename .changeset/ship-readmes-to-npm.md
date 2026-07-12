---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Include the README in the published `@doenet/doenetml` and `@doenet/standalone` packages.

These packages publish their `dist/` directory, and the README was not copied into it, so npm displayed no documentation at all. The build now ships the README (as `@doenet/doenetml-iframe` already did) — including the new host message protocol (SPLICE) documentation.
