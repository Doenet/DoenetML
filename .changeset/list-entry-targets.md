---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

A reference to one entry of a list, such as `$pl[2]` of a `<pointList>` or `$ml[2]` of a `<mathList>`, works as a target: in `triggerWhenObjectsClicked`, `triggerWhenObjectsFocused` and `triggerWith`, in a legend's `<label forObject>`, as a PreFigure `<annotation ref>`, as the `to` of a `<ref>` and as the `target` of a `<callAction>`. An index that changes, as in `$pl[$i]`, follows its value. A reference to the whole list, such as `triggerWhenObjectsClicked="$pl"`, fires on a click of any of its entries, including one from an authored `<point>`; an action that names both the list and one of its entries fires once per click.
