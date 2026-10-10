# Cells prototype

A DoenetML core organized around a flat list of `f64` cells instead of
components: components and props name cells, and the dependency graph is a
list of operators with inverses.

- `ARCHITECTURE.md`: start here. The pipeline, the main types, what
  happens on load, on a drag and on a rebuild, and where to change things.
- `CONTEXT.md`: the vocabulary.
- `docs/adr/`: recorded design decisions.
- `docs/history/`: the brief and plan of each round of the prototype.
- `RESULTS.md`, `results/NOTES.md`: measurements and verdicts.

## Layout

- `crates/cells-core`: the core (see `ARCHITECTURE.md`).
- `crates/cells-sym`, `crates/cells-sym-mer`: the symbolic math engines
  (A, and R, its oracle).
- `crates/cells-wasm`: the browser binding.
- `crates/cells-docgen`: synthetic DoenetML for fixtures and benchmarks.
- `crates/cells-bench`: benches, the `stats` binary, and measurement examples.
- `web/`: the Vite + React renderer (graphs drawn by JSXGraph with Doenet's
  look, or by plain SVG) and the Playwright end-to-end measurement.
- `scripts/`: the DAST parser wrapper (`parse-dast.mjs`) and binary encoder
  (`cdast-encode.mjs`), fixture generation (`gen-fixtures.sh`), the
  refactoring checks (`golden-diff.sh`, `perf-diff.sh`), and
  `render-results.py`, which regenerates `RESULTS.md`.

Tags the core understands: `document`, `graph`, `point`, `number`,
`numberInput`, `booleanInput`, `slider` (numeric mode), `math`, `evaluate`,
`repeatForSequence`, `collect`, `line`, `lineSegment`, `circle`, `polygon`
(and `triangle`), `pointList`, `p`, `setup`, `stickyGroup`, `mathInput`,
`function`, `derivative`, `answer`, `conditionalContent` (`case`, `else`),
`select` (`option`), `group` (and `label`), literal `text`, the sections
(`section`, `subsection`, `subsubsection`, `problem`, `exercise`, `example`),
and the prototype-only `op`.

## Running

```sh
cargo test                      # needs `node` on PATH and a built DoenetML parser
echo '<point name="p" x="1"/>' | node scripts/parse-dast.mjs

scripts/gen-fixtures.sh         # ~1 minute; writes fixtures/*.{doenet,json,cdast}
cargo bench -p cells-bench      # ~2.5 hours for the full sweep over 93 fixtures (startup, tick, rebuild)
cargo run --release -p cells-bench --bin stats > results/raw/stats.jsonl
CELLS_BUILD_PROFILE=1 cargo run --release -p cells-bench --example rebuild_loop -- repeat-10000 3   # per-phase build timings

cd web && pnpm install && pnpm wasm && pnpm dev     # interactive renderer at :5173
cd web && pnpm e2e                                  # headless drag measurement
scripts/render-results.py                           # regenerate RESULTS.md
scripts/golden-diff.sh [rev]    # behavior dump of every golden document vs a base commit (default HEAD)
scripts/perf-diff.sh [rev]      # quick perf check: regress on 10 fixtures, base commit vs working tree (~2 min)
```

Restrict a run with `CELLS_FIXTURES=chain-1000,points-100 cargo bench ...` or
`CELLS_E2E_FIXTURES=... CELLS_E2E_EVALS=full CELLS_E2E_BACKENDS=main CELLS_E2E_FORMATS=cdast,json pnpm e2e`.
Graphs are drawn by JSXGraph by default; `?renderer=svg|jsxgraph|jsxgraph-canvas`
picks one in the viewer, `CELLS_E2E_RENDERERS=svg,jsxgraph,...` in the e2e run
(default `svg`), and `jsxupdate=element` / `CELLS_E2E_JSXUPDATE=element`
switches JSXGraph boards to Doenet's own update pattern. Side-by-side
screenshots against the current viewer: `cd web && pnpm build && pnpm preview`,
then `node baseline/screenshots.mjs` (writes `results/screenshots/`).
The current-core baseline is `cd web && node baseline/measure.mjs`; the slider
differential test against the current core is `cd web && node baseline/slider-diff.mjs`
(after `cargo build --release -p cells-bench --example scenario_run`).

## License

Copyright (C) 2026 Charles Nykamp. Licensed under the GNU Affero General Public
License, version 3 or (at your option) any later version. See [LICENSE](LICENSE).
