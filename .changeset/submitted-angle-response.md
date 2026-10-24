---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

When an `<angle>` is an answer's response, `$ans.submittedResponse` now reads as the angle that was submitted. It used to read as π/2 whatever the angle was, so displaying it showed the wrong angle and comparing it, as in `<feedback condition="$ans.submittedResponse = pi/3">`, never matched.
