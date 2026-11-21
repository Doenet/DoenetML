---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A circular dependency found while a document loads no longer stops the document (D57, DIAG-5). The checks made when a document loads find most cycles from the DoenetML, but some shapes they don't predict stopped the whole document with "Circular dependency involving these components".

- **The document now loads with the cycle as an error.** When a circular dependency stops the document as it loads, one component the author wrote on the cycle is blamed: a reference to the number of a section on the cycle (`$s.sectionNumber`, `$s.title`) if there is one, also one written in an attribute (`hide="$s.sectionNumber=1"`), else the first reference or composite in the order written, else the first component written. The document is built again with it as a circular-dependency error (`doenet-e0005`) where it is written, and the rest renders. When the component blamed is no reference, a reference written in it to a component on the cycle is the error instead, preferring one written inside another component on the cycle, so `<point name="P">($P.x+1, 2)</point>` is an error at `$P.x`, also in a `<repeatForSequence>` that shows `$P.y` before it. A reference in an attribute that is the error leaves the component it is written in unshown, as a cycle the load-time checks find in an attribute does. A reload gives the same error.
- **Shapes this covers** include, before a section `s`: a path whose value reads its number (`$r[1].x` of a `<point>($s.sectionNumber,1)</point>`, `$cc.q.x`, `$sel[1].q.x`), `$cc.hidden` with `hide="$s.sectionNumber=1"`, `$r.numIterations` of a repeat holding a `<conditionalContent>` that reads the number, `$g` of a `<group>` holding a section and such a `<conditionalContent>`, `$cc.q` reached through an inner `<conditionalContent>` that reads the number (in each of these, the error is at the reference to the number), and a `<collect>` of sections that ran away; and anywhere: a composite in a section that reads the section's own `$s.title`, `$cc.q.title` of a section in a branch, a `<collect>` inside the `<group>` it collects from, and properties and coordinates that read themselves (`<number name="n">$n.hide</number>`, `<line name="l" through="(0,0) ($l.slope+1,3)"/>`).
- **Still stops the document:** a document with two such cycles (the document is built again once), and a cycle that appears only after an interaction.
