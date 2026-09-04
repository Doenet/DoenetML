---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Stop warning that a repeat's `valueName` has no referent when a reference lifts it out of the repeat.

Referencing one iteration of a repeat, as in

```xml
<repeatForSequence from="1" to="5" valueName="i" name="xiValues">
  <number>$i</number>
</repeatForSequence>
<m>x_3 = $xiValues[3]</m>
```

copies the iteration's `<number>` — and the `$i` inside it — to where the reference appears. The copy was then re-resolved from where it landed, and `i` lives inside the repeat, invisible from the `<m>`, so the document reported "No referent found for reference: `$i`" even though the reference had resolved and the value showed correctly. The warning went away if the reference or the `<number>` wrapper was removed, which is what made it look spurious.

Re-resolving from where a copy lands is what lets each iteration of a repeat bind `$i` to its own value, so that stays. A copy that lands somewhere the name is out of scope now falls back on resolving the reference where the component it shadows sits — which is where the reference came from and still points — and keeps falling back however many times the reference has been copied, so referencing the `<m>` above stays quiet too.

A reference that resolves nowhere still reports the same warning it always did, at the same place.

Closes #1424.
