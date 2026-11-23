---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/doenetml-headless": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

More points, vectors and numbers that hold a reference that names nothing are missing (`＿`), as their content is (D40, D49, VAL-5).

- **A `<point>` or `<vector>` holding a reference to a list entry past the end or blank, or to a missing point**, such as `<point>$ml[3]</point>` of a two-entry `<mathList name="ml">`, `<point>$mb[2]</point>` of `<mathList name="mb">1 $nothing</mathList>`, or `<point>$Q</point>` of `<point name="Q">$nothing</point>`, is missing: shown as `＿`, not drawn in a graph, and never equal to anything. Before, it was drawn as a point with blank coordinates. So is a point holding such a reference beside other content, such as the `through` point of `<ray through="(1,2) $nothing"/>`, which makes the ray missing. A blank in one coordinate still takes part in it: `<point>($nothing, 2)</point>` and `<point coords="($nothing, 2)"/>` are `(＿, 2)`.
- **A point is missing only when a coordinate it uses is missing.** Its value takes each coordinate from `x`, `y` or `z` first, then from `coords`, then from its content, so `<point x="3" y="4">$nothing</point>` is the point `(3, 4)`; before, it was missing. `<point x="3">$nothing</point>` is still missing, since its `y` comes from the content.
- **A written `coords` or `displacement` now comes before the content, whatever form the content takes.** `<point coords="(3,4)">$Q</point>` and `<vector displacement="(3,4)">$Q</vector>` are `(3, 4)`, as `<point coords="(3,4)">(5,6)</point>` already was; before, the content `$Q` was used. So is `<vector displacement="(3,4)"><point>(5,6)</point></vector>`, which was `(5, 6)`.
- **Content the attributes override entirely gives the new warning `doenet-w0202`** at load, where it was ignored silently: `<point x="3" y="4">(5,6)</point>`, `<point coords="(3,4)">(5,6)</point>` and `<vector displacement="(3,4)">(5,6)</vector>`. There is no warning where the content gives a coordinate that is used (`<point x="3" y="4">(5,6,7)</point>` is `(3, 4, 7)`), or where how many coordinates it gives isn't known at load (`<point x="3" y="4">$Q</point>`).
- **A `<vector>` whose `head` or `tail` names nothing is missing** while it uses it: `<vector tail="$pl[$i]" head="(5,5)"/>` past the end of `pl` shows `＿` and isn't drawn, where it was drawn, and `<vector head="$pl[$i]"/>` showed `＿ - 0`. A `head` that the `tail` and `displacement` override is not used, and doesn't make it missing.
- **A shape whose center is a property of a missing shape is missing**: `<circle center="$c.center"/>` of `<circle name="c">$nothing</circle>`.
- **A missing `<ray>` or `<vector>` no longer reports `doenet-w0006` or `doenet-w0008`** (dimensions that don't match), since a missing point has no dimensions.
- **In a `<repeat>` or `<repeatForSequence>`, a `<number>` computed from a reference that names nothing is missing**, as outside one: `<number>$i + $nothing</number>` shows `＿`, where it showed `NaN`, and `<math>$i + $nothing</math>` shows `1 + ＿`. So is a `<point>`, `<vector>` or shape holding `$nothing` (`<point>$nothing</point>`, `<circle center="$nothing"/>`), which was drawn with blank coordinates in a repeat. **A function evaluated numerically at an entry past the end of a list is `＿`**, where it was `NaN`, whether or not the repeat holds its iterations as a list: `<evaluate function="$f" input="$l[$i]" forceNumeric/>`, or `$$f($l[$i])` of `f` with `symbolic="false"`.

Closes #2596.
