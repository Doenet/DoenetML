---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Add reference documentation for graphical and constraint components that were previously undocumented: `<attractToConstraint>`, `<constrainToInterior>`, `<pegboard>`, `<regionHalfPlane>`, and `<stickyGroup>`. Each component has been removed from `undocumented-components-allowlist.txt` and the existing unlinked entries in the `Alphabetical Component Index` and `Index by Component Type` tables have been linkified, with new rows added for `<attractToConstraint>`, `<constrainToInterior>`, `<regionHalfPlane>`, and `<stickyGroup>`.

The `<attractToConstraint>` page leads with a callout positioning it for constraints that have no dedicated "attract" form (especially `<constrainToInterior>`) or for combining several constraint types under one threshold via `<constraintUnion>` — the simpler `<attractTo>` and `<attractToGrid>` are recommended when wrapping a single `<constrainTo>` or `<constrainToGrid>`. Its examples wrap `<constrainToInterior>` and a mixed `<constraintUnion>` so they cannot be re-expressed with `<attractTo>` siblings.

The `<pegboard>` page notes that the pegboard itself only renders dots — making other objects snap to those positions requires pairing it with an `<attractToGrid>` or `<constrainToGrid>` constraint using the same `dx`/`dy`/`xoffset`/`yoffset`.

Correct misleading attribute descriptions on `<regionHalfPlane>`. The `horizontal` attribute description previously said the half-plane is bounded by a horizontal line, and `boundaryValue` referenced `y = boundaryValue`, but the implementation constrains the x-coordinate when `horizontal` is true (the bounding line is vertical and the half-plane extends horizontally). The descriptions have been rewritten to match the actual behavior.
