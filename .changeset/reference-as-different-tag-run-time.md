---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

An `extend` or `copy` written as a different tag than what it references is now also checked when what it references is made as the document runs: what a `<conditionalContent>`, `<select>`, `<repeat>` or `<collect>` holds, an iteration, a pick or a case (`$r[1]`, `$s[1]`, `$cc[1]`), a list made by a `<sequence>` or `<selectFromSequence>`, a group holding any of these, and the value of a math in a group, such as `<point extend="$g"/>` of `<group><math>$mi</math></group>`. Such content still counts as the one component it holds, as before, but a `<conditionalContent>`, `<select>` or `<repeat>`, or a group holding one, whose one component is of a related type rather than the tag written still shows a default component of that tag, as before (`(0, 0)` for `<point extend="$cc"/>` while the active case holds the math `(1, 2)`); `$cc[1]`, `$s[1]` or `$r[1]` shows it. When it holds several components, none, or one of an unrelated type, or when the math's value is not a tuple (for a point, vector or coords) or true, false, a relation or a number (for a boolean), it is an info rather than an error, and nothing is shown while it lasts. An `extend` is decided again whenever that content changes, and is shown again once it matches: `<text extend="$cc"/>` shows nothing while the active case holds a point, and the text again once it holds one. A `copy` stays as it was made. These used to be made the written tag regardless, often showing `＿`, `(0, 0)`, `false` or nothing, with no message.

The messages name what was written: "an iteration of a `<repeat>`", "what a `<select>` picked" and "what a `<conditionalContent>` shows", and they suggest `$x[1]` only where it selects one component. Content holding a list, or a list a document makes for itself (a `<repeatForSequence>` inside a `<repeat>`), is still not checked.

Closes #2435 and #2423.
