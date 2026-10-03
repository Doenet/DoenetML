# Slow-document fixtures

The three author-reported slow documents of [#2101](https://github.com/Doenet/DoenetML/issues/2101), taken from the frozen copies in the Slow Examples folder on doenet.org (CC dual license). They are measured by `../perf-bench.test.ts`; see `../README.md`.

| file | report | on `main` at 00a3551fc |
|---|---|---|
| `measures-of-spread.doenet` | over 10 s to load; the author split it into separate documents | 24,093 components, 14,596 shadows |
| `hardware-assignment-2.doenet` | had to be split into two assignments | 20,952 components, 14,400 shadows |
| `unit-circle-labeling.doenet` | "still seems slow to load"; heavy tab memory | 6,168 components, 4,604 shadows |

Keep them as they were reported. A faster rewrite of a document belongs in the issue, not here: the point of a fixture is that the engine gets faster on the document the author wrote.
