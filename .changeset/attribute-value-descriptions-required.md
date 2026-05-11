---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Backfill per-value descriptions on every remaining enumerated attribute value across the component library (Graph, Image, Point, Vector, Curve, Function, Math, MathInput, MathOperators, MatrixInput, Polygon, Polyline, Rectangle, RegularPolygon, Circle, ControlVectors, Legend, LineSegment, Sort, Split, Substitute, UpdateValue, SubsetOfReals, SubsetOfRealsInput, SelectFromSequence, SelectPrimeNumbers, SampleRandomNumbers, Tabular, CodeEditor, Pretzel, PretzelArranger, AnimateFromSequence, Angle, Boolean, Answer.type, UpdateValue.type, Substitute.type, the abstract `Input` label-position, plus the shared anchor / line-family label / sequence-type utilities). With full coverage in place, the `ValidValueEntry` type now requires `description`, and the bare-string form of `validValues` is no longer accepted. The `normalizeValidValues` helper and its consumers were removed, the validation/help/autocomplete pipelines drop their string-or-object branches, and the context-help panel no longer renders an "Allowed values" row for pure boolean primitives (autocomplete for `true`/`false` is unchanged). Schema regenerated.
