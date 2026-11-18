---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A `<sort>`, `<sortIndices>` or `<shuffle>` decides "one type" by what its items are to an author: a value, an object or content.

- **A value** (`<math>`, `<number>`, `<text>`, `<boolean>` and the tags built on them) is of its value's type, with integer, number and math one type. **An input stands for what it holds**: a `<sort>` of `<mathInput>`s sorts them by the maths typed in them, and a `<mathInput>` sorts with `<math>`s, where before an input had nothing to compare and the sort showed nothing. A `<slider>` or `<choiceInput>` is sorted by the value it has; its type is not yet decided at load.
- **An object** (`<point>`, `<line>`, `<circle>`, `<atom>`, `<answer>`, `<matrix>`, `<interval>`, …) is of its tag, with the tags built on it, so a `<triangle>` and a `<rectangle>` are one type. A `<line>` and a `<circle>`, or an `<atom>` and a `<p>`, in a `<shuffle>` are now `doenet-e0076`. A `<matrix>` or `<interval>`, though built on `<math>`, is an object: beside a `<math>` it is `doenet-e0076`.
- **Content** (`<p>`, `<span>`, sections, `<feedback>`, `<graph>`, `<image>`, `<m>`, `<label>`, …) is all one type, and so is a `<group>` (or an iteration, pick or case) of several components, so a `<shuffle>` of paragraphs and groups of paragraphs is valid.
- **A `<sort>` or `<sortIndices>` of objects other than points and vectors, or of content, needs `sortByProp`.** Without it (or with it written blank, `sortByProp=""`), it is an error at load (`doenet-e0080`) that says to add `sortByProp`. Before, `<sort><p>b</p><p>a</p></sort>` showed nothing, and a sort of `<interval>`s compared them as text.
- **An `<m>` beside a `<math>`, or a `<label>` beside a `<text>`,** is `doenet-e0076` with a message saying to wrap it: `<math><m>…</m></math>` reads the LaTeX as math, and `<text>$l</text>` reads a label as text.
- **LaTeX read as math that isn't math** (`<math><m>\text{hi}</m></math>`, or `<math>$mm</math>`) is a blank, as before, now with a warning (`doenet-w0196`), or an info when a value the reader can change gives the LaTeX.

Each component declares its kind (`static isValue`, `static isContent`; everything else is an object), and a test lists every author tag with its kind.
