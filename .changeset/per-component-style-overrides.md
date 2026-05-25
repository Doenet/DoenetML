---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Allow per-component overrides for non-color style attributes on graphical components (e.g. `<point markerStyle="square" markerSize="10">`, `<line lineWidth="1" lineStyle="dashed">`, `<polygon fillOpacity="0.5">`).

The overridable set is split into three groups; each graphical component opts into the groups its renderer actually uses via `static styleOverrideCategories`:

- **marker** (`markerStyle`, `markerSize`, `markerFilled`) — `<point>`, `<endpoint>`, `<equilibriumPoint>`.
- **line** (`lineStyle`, `lineWidth`) — `<line>`, `<lineSegment>`, `<ray>`, `<vector>`, `<polyline>`, `<parabola>`, `<bestFitLine>`, `<equilibriumLine>`, `<cobwebPolyline>`.
- **line + fill** (line group + `fillOpacity`) — `<polygon>`, `<triangle>`, `<rectangle>`, `<regularPolygon>`, `<curve>`, `<circle>`, `<equilibriumCurve>`.

So `<point lineWidth="3">` and `<line markerStyle="square">` are now schema errors, in line with what the renderer actually consumes.

`markerFilled` (boolean, default `true`) toggles whether the marker renders as a filled glyph or an open outline. It's a no-op when `markerStyle` is `cross` or `plus`. Components whose semantic state already determines fill — `<endpoint>` (via `open`), `<equilibriumPoint>` (via `stable`) — suppress `markerFilled` so a styleDefinition value can't contradict authored intent. Similarly, `<equilibriumLine>` and `<equilibriumCurve>` suppress `lineStyle` because `stable` already determines solid-vs-dashed rendering.

`*Word` descriptors (`markerStyleWord`, `lineStyleWord`, `lineWidthWord`) intentionally aren't part of the per-component override surface: they're derived from the underlying value (e.g. `markerStyle="circle"` → `markerStyleWord="point"`), and authors needing custom descriptor vocabulary can author it once inside `<styleDefinition>` instead.

Color attributes are intentionally excluded: `markerColor`, `lineColor`, `fillColor`, `textColor`, `backgroundColor`, `highContrastColor` (and their `*Word` / `*DarkMode` variants) remain authorable only via `<styleDefinition>`, so the per-styleNumber WCAG contrast diagnostics stay authoritative.

`lineOpacity` and `markerOpacity` are also excluded for the same reason: the contrast diagnostic feeds them in as an `opacityMultiplier` on the foreground alpha, so they participate in the effective-color check just like colors do. Only `fillOpacity` is contrast-irrelevant and overridable per-component.

Behavior:
- The component-level override wins over any inherited `<styleDefinition>` value for that key.
- Sibling components without the attribute still inherit normally from the styleDefinition.
- `*Word` descriptors are re-derived from the override value using the same rules as `<styleDefinition>` (e.g. `lineWidth=1` → `lineWidthWord="thin"`, `markerStyle="circle"` → `markerStyleWord="point"`, `markerStyle="triangleUp"` → `markerStyleWord="triangle"`).
- Re-derivation replaces any inherited custom `*Word` — including when the new value falls outside a named range. For example, an inherited `lineWidthWord="hairline"` paired with a component-level `lineWidth="2"` re-derives to `lineWidthWord=""` (2 is neither "thin" nor "thick"). The trade-off is intentional: shipping a stale custom descriptor alongside a different underlying value would be misleading. If you need a custom descriptor vocabulary across multiple components, author `lineWidth`/`lineWidthWord` together inside a `<styleDefinition>` instead of overriding at the component.
- The override values flow through `selectedStyle`; they aren't exposed as separate top-level state variables, so existing renderer code (`SVs.selectedStyle.markerStyle`, etc.) consumes them without change.

`markerStyle` and `lineStyle` are declared as keyword/enum attributes in the schema so editors offer autocomplete and surface invalid values:
- `markerStyle`: `circle`, `square`, `triangle`, `triangleUp`, `triangleDown`, `triangleLeft`, `triangleRight`, `diamond`, `cross`, `plus` (case-insensitive).
- `lineStyle`: `solid`, `dashed`, `dotted` (case-insensitive).

The enum metadata is forwarded by both the new `GraphicalComponent` override path and the existing `<styleDefinition>` attribute path, so both routes get the same schema-level validation and autocomplete.
