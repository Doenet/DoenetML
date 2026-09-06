---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Stop a repeat's `valueName` from capturing a same-named reference inside an index of the items it repeats over.

Repeating over iterations that index something by the iteration value, as in

```xml
<mathList name="popSizes">1163 1164 292 290</mathList>

<repeatForSequence from="1" to="4" valueName="i" name="countByPop">
  <round>$popSizes[$i]</round>
</repeatForSequence>

<repeat for="$countByPop" valueName="i">$i</repeat>
```

took the whole document down with "Something went wrong as path index is not an integer". A repeat names each item it creates after its `valueName`, so the `<round>` copies here are named `i`; the `$i` inside `$popSizes[$i]` that each copy carried then found the copy it sits inside rather than the iteration value it was written to mean. Indexing by the component the index belongs to is circular, so the index came out an error rather than an integer, which is a state the reference machinery treats as impossible.

A reference copied inside a path index now shadows the one it was copied from, the way a copied child does, and a reference that resolves onto a component containing it now prefers a candidate origin that resolves elsewhere. Together those keep the copied `$i` pointing at the iteration value it named in the original.

A reference that means its own container and has nowhere else to resolve from, such as the `$P` in `P`'s own label, still resolves the way it did.

An index written inside an attribute rather than inside the content — the `$i` of `<updateValue target="$m[$i]" />` — is not covered. Copying content that holds one still loses the index, as it did before.
