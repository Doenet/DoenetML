---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Recognize an index written inside a reference in two places that were quietly dropping it.

`referencesAreResponses` now records the input an index names when that index is itself a reference, or an expression written around one such as `$inputs[$i - 1]`:

```xml
<answer>
  <award referencesAreResponses="$inputs[$i]"><when>$inputs[$i] = 1</when></award>
</answer>
```

Written with a literal index — `$inputs[1]` — this recorded the response all along. Written with `$i`, the award graded correctly but stored nothing: `currentResponses` and `submittedResponses` came back empty, with no warning, so a question scored right and kept no answer. It is the form an author reaches for inside a `<repeat>`, where the index is the iteration value.

An index that cannot be applied is now reported when it is written in a `target`. `<updateValue target="$p.styleDescription[1]" />` names an index on a property that is not a list, and said nothing at all; the same reference in `extend` or in ordinary text has always warned `Cannot reference index $p.styleDescription[1]`. The warning arrives when the target is read — on the press for `<updateValue>`, at once for a running `<animateFromSequence>` — which is where that component's other target warnings already arrive.

Closes #1845. `<callAction target="$p.styleDescription[1]" />` remains silent and #1565 stays open for it: it rejects any property in a `target` before an index is ever applied, so it needs a message about the property rather than this one about the index.
