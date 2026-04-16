---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Add center state-variable support for polylines, polygons and triangles in the worker layer.

- Polyline now exposes a public renderer-facing center location computed from the average of vertex coordinates, with symbolic math support for derived polygon and triangle components.
- Polyline now supports a semantic center-move action that polygon center movement delegates to through the shared base implementation.
- Triangle now supports moveTriangleCenter by delegating to the shared polygon/polyline center movement behavior.
- Add targeted worker tests covering polygon center computation, symbolic center behavior, center-driven translation, constrained center-driven translation, and triangle center movement.
