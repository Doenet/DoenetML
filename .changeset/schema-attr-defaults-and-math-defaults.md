---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Surface state-variable defaults to attributes in the schema, and render math-expression defaults through MathJax.

- Attributes whose resting value lives on a state variable rather than the attribute declaration (e.g. `padZeros`, `displayDigits`, `displayDecimals`, `displaySmallAsZero`, `avoidScientificNotation`) now carry their effective `defaultValue` in the schema, so the reference documentation and the editor's context-sensitive help panel show it. `BaseComponent.returnStateVariableInfo` surfaces each state def's `hasEssential` + `defaultValue` pair, and `get-schema.ts` falls back to that when an attribute does not declare its own default.
- Math-expression defaults (e.g. the `<math>` `assumptions` attribute, which defaults to `me.fromAst("＿")`) are encoded as a `{ type: "math", latex }` sentinel instead of the opaque `{ objectType: "math-expression", tree }` JSON dump. The docs reference pages and the editor's context-help panel both render the sentinel through MathJax, so the LaTeX appears typeset rather than as a serialized object.
