---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A reference to a whole point, line, angle, function or other component that has no value of its own, where only its value is read, such as `$P` in `<boolean>$P = (1,2)</boolean>` or `<math>2$P</math>`, now creates one small component that reads the point's coordinates (or the line's equation, the angle's radians, …), in place of a full copy of the point and the copies of everything it holds, such as a `<constrainTo>`'s targets. Documents that compare a point many times load faster and use less memory. Values, and values written back through such a reference, are unchanged. A `<collect>` from the component holding such a reference, such as `<collect componentType="point" from="$b"/>` for a `<boolean name="b">` holding `$P`, no longer finds a copy of the point in it. A reference that an `<answer>` with no input of its own records as a response, or one shown in a paragraph or placed in a graph, is a copy as before. `<answer>$P</answer>` inside `P`'s own label now compares the answer to `P`'s coordinates, where before it stopped the document with a circular dependency.
