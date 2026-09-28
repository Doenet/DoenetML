---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

A `<shuffle>` no longer loses a copy of an award's feedback, such as `<feedback extend="$award.feedback" />`, when that feedback appears or disappears. A `<sort>` no longer loses a child such as `<math extend="$ans.submittedResponse1" />` on the first submission. A `copy` of an award's feedback that has nothing to show is now hidden rather than an empty box.
