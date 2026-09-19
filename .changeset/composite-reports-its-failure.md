---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A component that builds other components reports its own failure rather than
taking the page with it.

- A `<repeat>` over a repeat whose body holds a `<setup>`, or more than one
  element, now builds the document. It blanked the page before, whatever the
  inner repeat was wrapped in. The inner repeat still produces nothing from
  each iteration, which is a separate question about what a reference to such
  an iteration means.
- Wherever a component that produces other components fails while the document
  is being built, an error now appears in its place and the rest of the
  document renders, as it already did for some such failures.
- The same failure while the document is being used — while a component is
  changing what it produces — is now reported too. It previously went to the
  browser console only, so the change silently did not happen and nothing on
  the page said why.
