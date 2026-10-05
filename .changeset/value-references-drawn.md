---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A reference shown in the text of a paragraph, label, table cell, section or the document, such as `$n` in `<p>The value is $n.</p>`, now creates one small component that the viewer draws, in place of a full copy of the referenced component and the shadow attribute components that came with it. Documents with many such references load faster and use less memory. What the reader sees is unchanged: the value is shown with the referenced component's display settings, and `$t` of a component with `hide`, style or typesetting settings is hidden, styled and typeset as it is (as before, `$t.value` is not). A reference with nothing to read shows nothing, and a click on a reference to a click target still counts as a click on it. A `<collect>` still finds such a reference, as a component of its type, with the referenced value and display settings. An index written as an element inside a math, such as `<math>$l[<indexOf target="3">$l</indexOf>]</math>`, no longer stops the document with a circular dependency.
