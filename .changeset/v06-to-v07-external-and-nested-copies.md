---
"@doenet/v06-to-v07": patch
---

Convert more v0.6 documents:
- A `<copy>` of a component that itself holds a `<copy>`, or of a named `<copy>`, converts instead of being left as a `<copy>`.
- A `<copy>` inside the component it copies, such as `$p.x{displayDecimals="2"}` in `p`'s own label, converts.
- A copied prop is spelled as v0.7 spells it: v0.6 matched `prop="numericalsolution"` to `numericalSolution`.
- A `<copy>` of a component inside an unselected `<option>` or a `<case>` whose condition is false converts, when only one component has that name.
- A `<copy>` of a prop with no single type, such as an `<answer>`'s `submittedResponse`, becomes a bare reference like `$a.submittedResponse` when it has no other attributes.
- A `<collect>` of a prop with no fixed type, such as a `<choiceInput>`'s `selectedValue` or `values`, takes its type from the list it is written in. Before, `selectedValue` became a `<mathList>` and `values` stopped the conversion.
- A `<ref>` with both `uri` and `target` keeps its link to the other document. The `target` is dropped with a diagnostic.
- `doenet:activityId=<id>` and `doenet:doenetId=<id>` in a `<ref>` or `<copy uri>` become `doenet:<id>`, the only form v0.7 reads. A `cid` is dropped. A `pageId` or a legacy id is left with a diagnostic.
- A new `fetchExternalDoenetML` option loads the documents a `<copy uri>` names. The converted element then takes the type of that document's root element, and references into the loaded content convert.
- A GeoGebra `<embed>` is commented out, with a TODO to rebuild it as a DoenetML widget.
