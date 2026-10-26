---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

The `modifyIndirectly` attribute has been removed. It was already left out of the schema, so the editor never suggested it, but a component still honored it. A component that has it now ignores it and warns: `Attribute modifyIndirectly on <mathInput> is deprecated and ignored. To keep the components that use this value from changing it, add fixed to them. To keep users from changing an input, use disabled.` The `modifyIndirectly` property is gone too, so a reference such as `$P.modifyIndirectly` now behaves like a reference to any property a component does not have.

`modifyIndirectly="false"` refused the changes that reached a component through the components that use its value, such as dragging a point that reads a `<mathInput>`, while still letting a user type into the input. `fixed` on the components that use the value refuses the same changes. For example, replace

```xml
<mathInput name="x" modifyIndirectly="false" />
<point>($x, 1)</point>
```

with

```xml
<mathInput name="x" />
<point fixed>($x, 1)</point>
```

Typing into the input still moves the point, and dragging the point is still refused. When many components use the value, read it through one fixed component instead: `<math name="xFixed" fixed>$x</math>`. This is a breaking change: a document that still sets `modifyIndirectly="false"` now lets those changes through.

Closes #2336.
