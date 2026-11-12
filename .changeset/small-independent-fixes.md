---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Small fixes: a boolean list entry's `fixed`, a letters repeat that hung, a 3D vector drag, actions of hidden content, a label's markup, and responses of an extended award.

- **A reference to one entry of a `<booleanList>` is fixed as the entry's source is** (`<boolean extend="$bl[1]"/>` of a `<boolean fixed>`), as for every other list. So is an entry of a `<collect>`, `<sort>` or `<shuffle>` of booleans.
- **A `<repeatForSequence type="letters">` whose `from` stops being letters** (`from="$tIn"` with `1` typed) shows nothing, and shows its letters again when `from` is letters, where it brought the document down.
- **A `<vector>` in three dimensions whose head is dragged in a graph** keeps its third coordinate, where it became `NaN`. A symbolic coordinate (`pi`, `a`) stays as written.
- **An action withheld from the page**, such as an `<updateValue>` in a `<conditionalContent>` that is no longer true, no longer fires on `triggerWhenObjectsClicked`, `triggerWhenObjectsFocused` or `triggerWith`, and what it is triggered by is no longer shown as clickable. Both come back when the content is shown again.
- **A reference to a component's label** (`$ti.label`, `$P.label`, `$ans.label`, a button's or slider's) in a `<p>` keeps the markup of the `<label>` child it comes from (`<delete>`, `<em>`, math), and so does a reference to a `<label>` (`$l`), which is now a linked copy of it, as `<label extend="$l"/>` is. In a `<text>`, an input, or a `<graph>`, it is the label's text, as before.
- **An `<award extend="$aw">` or `<award copy="$aw">` with `referencesAreResponses`** records the references it names as responses, with their values and types, as the same award written out does, where it recorded none, all of the potential responses, or the ones named only after an update.
- **A warning, `doenet-w0189`, when a `<repeat>` or `<repeatForSequence>` has the same `valueName` and `indexName`**, which made `$i` find two referents.
- **A `<video>`'s `aspectRatio` with none given is the number 16/9**, so `$v.aspectRatio` shows `1.78`, where it stopped the document from loading.

Docs: the `<variantControl>` example names the variants to include (`a c e g i`), as `variantsToInclude` takes names, not indices.

Closes #2526, #2175, #2173, #2179, #2115, #2120 and #2151, and item 6 of #2521.
