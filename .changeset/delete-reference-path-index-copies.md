---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Fix a "Found a duplicate componentIdx" crash when content containing a dynamic index reference (such as `$p[$i]`) is repeatedly removed and recreated.

A reference with a dynamic index creates a hidden copy to resolve the index (for example, the copy that evaluates `$i` in `$p[$i]`). That copy lives in the referencing component's internal reference resolution rather than among its children or attributes, so deleting the component left the copy behind. When the surrounding composite — for instance a `<conditionalContent>` case or the branch of a `<triggerSet>` — later recreated its replacement and reused the same reserved component indices, the leaked copy's index collided and the activity errored. Deletion now also removes the copies created for reference-path indices, so such content can be recreated cleanly.
