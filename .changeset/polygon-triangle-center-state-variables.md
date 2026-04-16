---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
---

Add center state-variable support for polygons and triangles in the worker layer.

- Polygon now exposes a public renderer-facing center location computed from the average of vertex coordinates, with symbolic math support.
- Polygon now supports a movePolygonCenter action that updates center semantically and propagates through inverse definitions.
- Triangle now supports moveTriangleCenter by delegating to polygon center movement behavior.
- Add targeted worker tests covering polygon center computation, symbolic center behavior, center-driven translation, and triangle center movement.
