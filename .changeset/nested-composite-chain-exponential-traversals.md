---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Stop two core traversals from taking exponential time when composites nest inside one another.

A repeat whose iterations refer to the previous iteration, as in

```xml
<numberList name="vals"><sequence from="1" to="16" /></numberList>

<repeatForSequence from="1" to="16" valueName="i" name="cumSums">
  <number><conditionalContent>
    <case condition="$i=1">$vals[1]</case>
    <else>$cumSums[$i-1] + $vals[$i]</else>
  </conditionalContent></number>
</repeatForSequence>
```

hung the document rather than loading it. At 8 iterations it took 4 seconds and at 10 it took 3 minutes, with each further iteration multiplying the cost by about four, so the 16 iterations above would have needed several days.

The cost was not in evaluating the recurrence. Components form a directed acyclic graph rather than a tree: a composite's replacements are spliced in as children of the composite's parent while the composite goes on pointing at them as replacements, so the same component is reachable along several paths. Each iteration of the repeat above adds a `<conditionalContent>` → `<group>` → copy chain, which makes the previous iteration reachable four ways, and two traversals walked every path separately:

- `allPotentialRendererTypes`, which collects the renderers a document may need to load, recursed into children and into replacements. It now walks each component once, which loses nothing because every path contributed to the same set of renderer types.
- `ancestorsIncludingComposites`, used when propagating dependency blockers, walked up both the parent chain and the chain of the composite a replacement came from — chains that converge on the same ancestors. It now remembers the ancestors it has already worked out for a component.

The renderer types collected are unchanged. The example above loads in a few seconds, and cost now grows with the number of components rather than exponentially.

Documents that nest composites only a few deep — the overwhelming majority — were never affected and are unchanged.
