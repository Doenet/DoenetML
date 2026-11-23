---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
"@doenet/doenetml-headless": patch
---

An `<answer>`'s type comes from its input (D55), so `type` is needed only when nothing else decides it.

- **The input written inside the answer decides its type.** `<answer><textInput/>hello there</answer>` now reads "hello there" as a text, and `<answer><booleanInput/>true</answer>` reads `true` as a boolean, so entering the correct response earns credit. Before, plain text in an award was a math unless `type` was written, whatever the input, and these earned no credit, silently.
- **With no input inside, the awards' typed content decides it, references included.** `<answer>$t</answer>`, with `t` a `<text>`, adds a `<textInput>` (it added a `<mathInput>`), and in `<answer><award><text>hello</text></award><award credit="0.5">hi</award></answer>` the second award's "hi" is a text too. Plain text is a math only when nothing decides the type.
- **`type` is read without case or spaces around it, as its keywords are:** `type="Text"` and `type="text "` are text answers. Before, it was warned of as an invalid type and the answer read its content as a math. A `type` that names no type is still warned of, and an input written inside still decides.
- **A `type` that disagrees with the input written inside is an error at load,** a new `doenet-e0092`, at the attribute. The input's type is used. A `type` that agrees is allowed, and `type="videoWatched"` is unchanged.
- **New warnings at load** for an award's content that can never earn credit:
  - content of another type than the input it is compared with (`<textInput/>` beside `<math>2</math>`), `doenet-w0205`. Only an award's one component is warned of: content of more than one child is wrapped in the answer's type (`<award><text>x</text>y</award>` is a math in a math answer);
  - an award with content and no `<when>` in an answer with more than one input, which is compared with none of them, `doenet-w0206`;
  - an award with content and no `<when>` in an answer whose input is written outside it with `forAnswer`, which is compared with an input the answer adds, `doenet-w0207`.

  An award whose content is one `<when>` (also a `<when>` written directly in the answer, which its sugar wraps in an award, or one inside a composite such as a `<group>`) compares in the `<when>`, so it is not warned of. A reference to a `<when>` (`$w`) is its value, a boolean compared with the input: `<answer>$w</answer>` adds a `<booleanInput>`.
