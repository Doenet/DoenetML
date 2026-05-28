---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Editor: surface the declared child's component type and default value when describing author-declared attributes on a `<module copy="$x" />` (or `extend=`) site. The attribute-name autocomplete dropdown and the context-help panel now show e.g. "Author-declared module attribute (`<point>`)" instead of the generic placeholder, so authors can see at a glance whether the declared attribute on the target module is a point, number, text, … rather than having to chase down the definition. The help panel's "Default:" row also picks up the declaring element's inner content (e.g. `(3,4)` from `<point name="P">(3,4)</point>`), so authors can see what value the instance would take if they omitted the attribute.
