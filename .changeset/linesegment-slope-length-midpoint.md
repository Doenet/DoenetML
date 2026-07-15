---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Graphing: add new ways to define a `<lineSegment>` via `slope`, `length`, `midpoint`, and `midpointOffset` attributes, plus a public `center` state variable.

A `<lineSegment>` can now be positioned without giving both endpoints explicitly:

- `midpoint` — a reference point on the segment, located at its midpoint by default.
- `slope` and `length` — the segment's x-y direction and its signed defining length (a negative `length` flips the endpoints). The public `length` state variable still reports the Euclidean distance between the endpoints.
- `midpointOffset` (clamped to `[-1, 1]`) — where the `midpoint` point sits along the segment: `-1` = first endpoint, `0` = midpoint, `1` = second endpoint.
- `center` — a new public state variable giving the segment's midpoint, with `center.x`/`center.y` access and a translation inverse.

These combine so a segment can be defined by an endpoint plus `midpoint`, an endpoint plus `slope`/`length`, `midpoint` plus `slope`/`length`, or `slope`/`length` alone. When one endpoint and `midpoint` are given, the second endpoint is placed so the given point sits at the `midpointOffset` position of the segment — by default the midpoint, so `endpoints="(1,2)" midpoint="(2,3)"` yields endpoints `(1,2)` and `(3,4)`. Dragging a graph handle keeps the opposite endpoint fixed while the midpoint tracks its position, and dragging a referenced endpoint translates the segment (for the slope/length cases). When none of the new attributes are given, behavior is unchanged. The generated schema recognizes the new attributes in editor diagnostics.

Closes #1376.
