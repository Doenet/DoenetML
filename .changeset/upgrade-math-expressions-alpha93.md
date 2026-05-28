---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Upgrade `math-expressions` to `2.0.0-alpha93`.

This adds support for the plus-minus operator: `\pm` in the LaTeX parser and the `±` symbol in the text parser. For example, `<math format="latex">\pm \sqrt{x}</math>` now parses instead of rendering blank.
