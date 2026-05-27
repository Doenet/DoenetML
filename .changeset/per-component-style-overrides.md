---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Allow per-component overrides for non-color style attributes on graphical components — e.g. `<point markerStyle="square" markerSize="10">`, `<line lineWidth="1" lineStyle="dashed">`, `<polygon fillOpacity="0.5">`. Component-level overrides win over inherited `<styleDefinition>` values; siblings without the attribute still inherit normally.

Each component opts into the categories its renderer uses via `static styleOverrideCategories`:

- **marker** (`markerStyle`, `markerSize`, `markerFilled`) — `<point>`; `<endpoint>` and `<equilibriumPoint>` (both minus `markerFilled` — their `open` / `stable` already control fill).
- **line** (`lineStyle`, `lineWidth`) — `<line>`, `<lineSegment>`, `<ray>`, `<vector>`, `<polyline>`, `<parabola>`, `<bestFitLine>`, `<cobwebPolyline>`; `<equilibriumLine>` (minus `lineStyle` — `stable` determines solid vs. dashed).
- **line + fill** (line group + `fillOpacity`) — `<polygon>`, `<triangle>`, `<rectangle>`, `<regularPolygon>`, `<curve>`, `<circle>`; `<equilibriumCurve>` (minus `lineStyle`, same reason).

Cross-category use is a schema error: `<point lineWidth="3">` and `<line markerStyle="square">` are now rejected.

**New attribute `markerFilled`** (boolean, default `true`) toggles filled vs. open marker rendering on `<point>`; no-op for `markerStyle="cross"` / `"plus"`.

**Exclusions.** Color attributes (`*Color`, `*ColorDarkMode`, `*ColorWord`) and the contrast-feeding opacities (`lineOpacity`, `markerOpacity`) stay `<styleDefinition>`-only so the per-styleNumber WCAG contrast diagnostics remain authoritative. `fillOpacity` is contrast-irrelevant and overridable. `*Word` descriptors (`markerStyleWord`, `lineStyleWord`, `lineWidthWord`) are derived from the underlying value rather than independently overridable — overriding `lineWidth=2` re-derives `lineWidthWord=""` even when a `<styleDefinition>` shipped a custom `"hairline"`, since a stale descriptor next to a different value would mislead.

**Schema.** `markerStyle` and `lineStyle` are now keyword/enum attributes with autocomplete (case-insensitive): `markerStyle` ∈ {circle, square, triangle, triangleUp/Down/Left/Right, diamond, cross, plus}; `lineStyle` ∈ {solid, dashed, dotted}. Both the override path and the `<styleDefinition>` path forward the same enum metadata.
