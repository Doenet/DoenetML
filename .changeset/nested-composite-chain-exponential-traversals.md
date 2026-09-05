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
<repeatForSequence from="1" to="16" valueName="i" name="cumSums">
  <number><conditionalContent>
    <case condition="$i=1">$values[1]</case>
    <else>$cumSums[$i-1] + $values[$i]</else>
  </conditionalContent></number>
</repeatForSequence>
```

hung the document rather than loading it. At 8 iterations it took 4 seconds, at 10 it took 3 minutes, and each further iteration multiplied that by about four, so the 16 iterations above would have needed several days.

The cost was not in evaluating the recurrence. Components form a directed acyclic graph rather than a tree: a composite's replacements are spliced in as children of the composite's parent while the composite goes on pointing at them as replacements, so the same component is reachable along several paths. Each iteration of the repeat above adds a `<conditionalContent>` → `<group>` → copy chain, which makes the previous iteration reachable four ways, and two traversals walked every path separately:

- `allPotentialRendererTypes`, which collects the renderers a document may need to load, recursed into children and into replacements.
- `ancestorsIncludingComposites`, used when propagating dependency blockers, walked up both the parent chain and the chain of the composite a replacement came from — chains that converge on the same ancestors.

Both now visit each component once per traversal, which is enough because both accumulate a set. The renderer types collected are unchanged. The example above loads in 3 seconds, and cost grows with the number of components instead of exponentially.

Documents that nest composites only a few deep — the overwhelming majority — were never affected and are unchanged.
