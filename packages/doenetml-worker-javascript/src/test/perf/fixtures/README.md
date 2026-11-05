# Slow-document fixtures

The three author-reported slow documents of [#2101](https://github.com/Doenet/DoenetML/issues/2101), taken from the frozen copies in the Slow Examples folder on doenet.org (CC dual license). They are measured by `../perf-bench.test.ts`; see `../README.md`.

| file                           | report                                                         | on `main` at 00a3551fc            |
| ------------------------------ | -------------------------------------------------------------- | --------------------------------- |
| `measures-of-spread.doenet`    | over 10 s to load; the author split it into separate documents | 24,093 components, 14,596 shadows |
| `hardware-assignment-2.doenet` | had to be split into two assignments                           | 20,952 components, 14,400 shadows |
| `unit-circle-labeling.doenet`  | "still seems slow to load"; heavy tab memory                   | 6,168 components, 4,604 shadows   |

Keep them as they were reported. A faster rewrite of a document belongs in the issue, not here: the point of a fixture is that the engine gets faster on the document the author wrote.

## `discrete-sir.doenet`

A simulation of a discrete SIR infectious disease model, from [doenet.org](https://doenet.org/activityViewer/oixRTp66cu7bz5BzTgxdQZ) (CC dual license). `<functionIterates>` makes 200 iterates of a vector, and four `<repeat>`s over them make three polylines of points and a spreadsheet of rows. Dragging the point at (0, S0) changes the initial value, and with it every iterate, point and cell.

Its author wrote it in 0.6 with two components made for it, `<discreteSimulationResultPolyline>` and `<discreteSimulationResultList>`, because the same document written with maps was too slow to use. This is its 0.7 version, as the author published it: converted with `v06-to-v07`, with those two components replaced by the repeats. It shows the same polylines and table as the 0.6 components do, which in the same build take 239 components and load in under a second.

| file                  | report                                 | on `main` at e2421e851                                                             |
| --------------------- | -------------------------------------- | ---------------------------------------------------------------------------------- |
| `discrete-sir.doenet` | written with repeats, "amazingly slow" | 14,127 components, 3,829 shadows; about 14 s to load and over 1 s per drag in node |
