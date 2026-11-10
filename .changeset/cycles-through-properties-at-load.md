---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

More reference cycles are reported when the document loads, as a circular-dependency error (`doenet-e0005`) at each reference on the cycle, while the rest of the document renders. They are found in every case of a `<conditionalContent>` and every option of a `<select>`, whether shown or not, so the same errors are there before and after a reader changes the case, and in every variant. Before, each of these stopped the document, when it loaded or when the case holding it was shown, or was reported only once it was reached:

- a property made from what is written in the tag: `<number name="n">$n.value</number>`, `<text name="t">$t.value</text>`, `<p name="q">$q.text</p>`;
- an input's starting value: `<mathInput name="mi" prefill="$mi.value"/>`, and its `bindValueTo`, a `<choiceInput>`'s `preselectChoice` and a `<slider>`'s `initialValue`;
- an attribute of a `<sequence>`, a `<selectFromSequence>`, a `<select>`, a `<repeat>`, a `<conditionalContent>` or a sampler that reads what it makes: `<sequence name="a" from="1" length="$a[1]"/>`, `<selectFromSequence name="a" from="1" to="10" exclude="$a[1]"/>`, a `<case>`'s `condition`, an `<option>`'s `selectWeight`;
- an index read by the component it picks from: `<number name="i">$l[$i]</number>`, and an index into a `<mathList>` or a `<numberList>` in it (`<mathList name="l">1 $l[1]</mathList>`);
- a name every case of a `<conditionalContent>` or every option of a one-pick `<select>` declares. In a `<select>`, the variant that picked the option on the cycle used to fail to load;
- a tag whose content is its children, such as a `<p>`, a `<section>`, a `<div>` or a `<li>`, holding a reference to itself (`<p name="q">a $q</p>`), now in a case not shown too;
- a tag written with `copy` or `copyWithState` of what it is in (`<group name="g"><math copy="$g"/></group>`), as the `extend` form already was.

A `<section>` whose `<title>` holds a reference to the section (`<title>T $S</title>`) now shows its default title ("Section 1"), as a title holding any error found at load does, where it used to show the title without the reference.

An index into a math written with `extend`, in it (`<math name="m2" extend="$m">$m2[1]</math>`), is now that error, where the document used to fail to load with an internal error.

A cycle through a property or attribute not listed here, through a function (`$$f($n)`), through an index into a `<repeat>` in its own template, or through a reference in a point's or an input's `<label>`, is still reported, or stops the document, when it is reached.

Closes #2473.
