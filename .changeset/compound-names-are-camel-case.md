---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Compound attribute and property names are camelCase (D60). The names some components declared in all lowercase are renamed, so they follow the convention of `xMin` and `numItems`:

- `<regularPolygon>`: `circumradius` and `inradius` are `circumRadius` and `inRadius`;
- `<line>`, `<bestFitLine>`, `<equilibriumLine>`: the properties `xintercept`, `yintercept`, `coeffvar1` and `coeffvar2` are `xIntercept`, `yIntercept`, `coeffVar1` and `coeffVar2`;
- `<odeSystem>`: the properties `righthandside`, `righthandsides` and `righthandside1`, `righthandside2`, … are `rightHandSide`, `rightHandSides` and `rightHandSide1`, `rightHandSide2`, …;
- `<pegboard>`, `<attractToGrid>`, `<constrainToGrid>`, `<slopeField>`, `<vectorField>`: `xoffset` and `yoffset` are `xOffset` and `yOffset`; `<attractToGrid>`, `<constrainToGrid>`: `zoffset` is `zOffset`; and `<attractToGrid>`'s `xthreshold`, `ythreshold` and `zthreshold` are `xThreshold`, `yThreshold` and `zThreshold`;
- `<tabular>`, `<row>`, `<col>`, `<cell>`: `halign` is `hAlign`; `<tabular>`, `<row>`, `<sideBySide>`, `<sbsGroup>`: `valign` is `vAlign`; `<sideBySide>`, `<sbsGroup>`: `valigns` is `vAligns`, with entries `vAlign1`, `vAlign2`, …;
- `<function>` and the function operators: `xscale` and `yscale` are `xScale` and `yScale`, as they already were on a `<graph>`.

Before names became case-sensitive (D51), the camelCase spellings already worked, and the documentation taught several of them (`$line1.yIntercept`, `hAlign`, `circumRadius`); the documentation uses them again.

- **An attribute** written the old way (`<cell halign="center">`) differs from the new name only in case, so for this release it is still applied, with a warning (`doenet-w0197`) that it will be an error in a later release.
- **A property** written the old way (`$line1.yintercept`) names nothing, shown as a blank, with `doenet-w0104` suggesting the new spelling (`$line1.yIntercept`). So does an array entry written the old way, with the index form suggested (`$sbs.valign2` → `$sbs.vAligns[2]`).

A new compound name is camelCase.
