---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: stop warning about `<group>`, `<repeat>` and friends inside `<math>`, `<numberList>` and other containers that take one specific component type.

These composites expand to copies of whatever the author puts inside them, so the schema cannot predict what they become and must accept them wherever their content would be accepted. `<math>1 + <group>2 3</group></math>` and `<numberList><sort>3 1 2</sort></numberList>` both work, but the editor flagged them as invalid. This affects `<group>`, `<repeat>`, `<repeatForSequence>`, `<select>`, `<module>`, `<collect>`, `<shuffle>` and `<sort>`, plus `<setup>`, which produces no replacements at all and so is now allowed anywhere.

In the other direction, `<split>` and `<intersection>` do have predictable replacement types — `text` and `point` respectively — so they are now checked against those. That widens where they are accepted (a `<point>` is welcome in more places than "any graphical component" was) while correctly rejecting `<split>` inside graphical-only containers such as `<constrainTo>`. `<sortIndices>` keeps its own `number` replacement type rather than following `<sort>`, so it is still rejected where a number doesn't belong.
