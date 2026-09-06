---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Keep an index inside an attribute such as `target` pointing where it did when the content holding it is copied.

Copying content whose attribute references something by index, as in

```xml
<numberList name="m">11 22 33 44</numberList>

<repeatForSequence from="2" to="3" valueName="i" name="items">
  <updateValue target="$m[$i]" newValue="99" type="number" />
</repeatForSequence>

<repeat for="$items" valueName="v">$v</repeat>
```

lost the index in the copy: the two buttons written by the `repeatForSequence` set `m[2]` and `m[3]` as intended, but the copies the `<repeat>` made rendered as buttons with no target and did nothing when pressed, warning "No referent found for reference: `$m[$i]`". Where the `<repeat>` also named its items `i`, evaluating such a copy raised "Something went wrong as path index is not an integer" instead.

An index inside a reference in content already followed its copy; one inside a reference in an attribute now does too, so each copied button changes the entry of `m` the button it was copied from changes. That holds however the content was copied — by a `<repeat>`, by a `<collect>`, by a `<shuffle>`, or by an `extend` of an enclosing section — and for the other attributes that take references, such as an `<award>`'s `referencesAreResponses`.
