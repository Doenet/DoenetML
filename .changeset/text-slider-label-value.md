---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Show the whole text value of a text `<slider>`. A slider of `<text>` items, such as one choosing among `apple`, `banana` and `grape`, showed its value beside the label split into comma-separated letters (`choose a fruit = *,a,p,p,l,e`) and now shows `choose a fruit = apple`. A text slider without a label, which shows only its value, showed `*apple` and now shows `apple`.

Closes #2256.
