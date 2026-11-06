---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Diagnostics are reported once, where their cause is written, and none are dropped.

- **A reference to a component in error shows a blank, `＿`, and reports nothing more.** The error is reported once, at its cause. Before, each `$m`, `<math extend="$m"/>` or `copy="$m"` of an `m` in error reported the same error again at the reference and showed it again. This holds for any error shown in a component's place, such as an invalid attribute (`doenet-e0004`), an extend that would change its content (`doenet-e0056`), or a type change that is an error (`doenet-e0065`). A copy of a component that _holds_ an error, such as a `<p>`, still shows it, without reporting it again.
- **An attribute a component does not have, written on it with `copy`, `copyWithState` or `extend`, is the new warning `doenet-w0187`**, marked at the attribute, and the component is still shown. Before, it was silently ignored on most components (`<math extend="$m" blink="true"/>`, `<point extend="$P" link="false"/>`), and an error that showed nothing on a list (`<mathList extend="$ml" blink="true"/>`). Written on a component without `copy` or `extend`, it is still the error `doenet-e0004`.
- **A diagnostic quotes the whole function reference after an index**: `$$f[2](2)`, where it quoted `$$f[2]`. That covers an index on a `<function>` (`doenet-w0180`), an index past the children of a `<group>` (`doenet-w0104`), and the deprecated index of a child of a `<group>` (`doenet-w0179`), whose suggestion keeps the arguments too (`$$f.x(2)`).
- **A reference in the arguments of a function reference that names nothing is reported too**: `$$f($a)` with neither `f` nor `a` gives `doenet-w0104` for `$$f($a)` and for `$a`, where only the first was reported.

Closes #2449. Closes #2332. Closes #2434.
