---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Allow per-component overrides for non-color style attributes on graphical components (e.g. `<point markerStyle="square" markerSize="10">`, `<line lineWidth="1" lineStyle="dashed">`, `<polygon fillOpacity="0.5">`).

The overridable set is `lineOpacity`, `lineWidth`, `lineWidthWord`, `lineStyle`, `lineStyleWord`, `markerOpacity`, `markerStyle`, `markerStyleWord`, `markerSize`, and `fillOpacity` — declared on `GraphicalComponent`, so every component that extends it (Point, Line, LineSegment, Ray, Vector, Polyline, Polygon, Circle, Curve, Triangle, Rectangle, Parabola, Ellipse, etc.) accepts them.

Color attributes are intentionally excluded: `markerColor`, `lineColor`, `fillColor`, `textColor`, `backgroundColor`, `highContrastColor` (and their `*Word` / `*DarkMode` variants) remain authorable only via `<styleDefinition>`, so the per-styleNumber WCAG contrast diagnostics stay authoritative.

Behavior:
- The component-level override wins over any inherited `<styleDefinition>` value for that key.
- Sibling components without the attribute still inherit normally from the styleDefinition.
- Missing `*Word` descriptors are re-derived from the override value using the same rules as `<styleDefinition>` (e.g. `lineWidth=1` → `lineWidthWord="thin"`, `markerStyle="circle"` → `markerStyleWord="point"`, `markerStyle="triangleUp"` → `markerStyleWord="triangle"`).
- Explicitly authored `*Word` overrides (e.g. `<point markerStyleWord="custom">`) are preserved.
- The override values flow through `selectedStyle`; they aren't exposed as separate top-level state variables, so existing renderer code (`SVs.selectedStyle.markerStyle`, etc.) consumes them without change.
