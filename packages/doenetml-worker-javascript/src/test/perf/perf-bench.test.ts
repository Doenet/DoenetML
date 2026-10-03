import { describe, expect, it } from "vitest";
import fs from "node:fs";
import {
    censusMarkdownTable,
    censusOfCore,
    formatCounts,
    type Census,
    type CensusTableRow,
} from "./census";
import { measureLoad, type CallTimings } from "./load-timing";
import { benchFixtures, MICRO_DOCUMENTS, type Fixture } from "./fixtures";
import { formatProfile, profileAsync, type ProfileSummary } from "./profile";
import { measureDrag, type DragMeasurement } from "./drag-timing";

// Load-time bench of the performance harness (Doenet/DoenetML#2126). For each
// fixture it loads the document once and records the census, the wall-clock
// load time, the core's per-phase timings and the resolver's call timings; for
// the drag fixture (the 50-point dot plot from `drag-bench.test.ts`) it then
// drags the point it names and records the median cost of one `movePoint`.
//
//   PERFBENCH_RESULT=/tmp/perf-bench.json \
//       npm run test -w @doenet/doenetml-worker-javascript -- --run src/test/perf/perf-bench.test.ts
//
// Options:
//   PERFBENCH_SUMMARY=<path>   also write a markdown summary (CI points this
//                              at $GITHUB_STEP_SUMMARY)
//   PERFBENCH_ONLY=<regex>     only the fixtures whose name matches
//   PERFBENCH_PROFILE=1        CPU-profile each load and include the self-time
//                              tables (slower; node only)
//
// It only runs when PERFBENCH_RESULT is set. The file carries no `@groupN`
// tag, so it would otherwise land in the `test:group4` catch-all and spend
// minutes measuring something no assertion depends on. Times are reported,
// never asserted. The run fails only when a fixture fails to load, loads as
// `_error` components, or the instrumentation comes back blank (a phase
// missing, no resolver calls counted, no drag measured on the drag fixture, or
// a drag whose point did not move); the
// census snapshot in `census.test.ts` is the gate.

const RESULT_PATH = process.env.PERFBENCH_RESULT;
const SUMMARY_PATH = process.env.PERFBENCH_SUMMARY;
const ONLY = process.env.PERFBENCH_ONLY
    ? new RegExp(process.env.PERFBENCH_ONLY)
    : null;
const PROFILE = Boolean(process.env.PERFBENCH_PROFILE);

/** The slowest examples take tens of seconds in node; CI is slower still. */
const BENCH_TIMEOUT_MS = 30 * 60 * 1000;

type FixtureResult = {
    name: string;
    kind: Fixture["kind"];
    /** Whether the fixture asked for a drag measurement. */
    wantsDrag: boolean;
    loadMs?: number;
    drag?: DragMeasurement;
    phases?: Record<string, number>;
    resolver?: CallTimings;
    census?: Census;
    profile?: ProfileSummary;
    error?: string;
};

const PHASES = [
    "createIsolatedComponents",
    "expandAllComposites.pass1",
    "expandAllComposites.pass2",
    "drainStateVariablesToEvaluate",
    "errorsAndReplacementChanges",
    "initializeRenderedComponentInstruction",
    "callUpdateRenderers",
    "drainCompositesToUpdateReplacements",
    "processStateVariableTriggers",
    "total",
];

const RESOLVER_COLUMNS = [
    "add_nodes_to_resolver",
    "resolve_path",
    "update_root_names",
    "replace_index_resolutions_in_resolver",
];

const fmt = new Intl.NumberFormat("en-US");
const ms = (x: number | undefined) =>
    x === undefined ? "" : fmt.format(Math.round(x));

async function measureFixture(fixture: Fixture): Promise<FixtureResult> {
    const base = {
        name: fixture.name,
        kind: fixture.kind,
        wantsDrag: Boolean(fixture.drag),
    };
    try {
        const run = () => measureLoad(fixture.doenetML);
        let measurement;
        let profile: ProfileSummary | undefined;
        if (PROFILE) {
            const profiled = await profileAsync(run);
            measurement = profiled.result;
            profile = profiled.profile;
        } else {
            measurement = await run();
        }
        const census = censusOfCore(measurement.core.core);
        let drag: DragMeasurement | undefined;
        if (fixture.drag) {
            drag = await measureDrag(measurement.core, fixture.drag.target);
        }
        return {
            ...base,
            loadMs: measurement.loadMs,
            phases: measurement.phases,
            resolver: measurement.resolver,
            census,
            drag,
            profile,
        };
    } catch (e) {
        return { ...base, error: e instanceof Error ? e.message : String(e) };
    }
}

/**
 * What is missing from a fixture's instrumentation, as human-readable gaps.
 * Structural checks only, no durations: a table of blanks must not pass.
 */
function instrumentationGaps(r: FixtureResult): string[] {
    if (r.error) {
        return [];
    }
    const gaps: string[] = [];
    for (const phase of PHASES) {
        if (!Number.isFinite(r.phases?.[phase])) {
            gaps.push(`phase ${phase} not recorded`);
        }
    }
    if (!r.resolver || Object.keys(r.resolver).length === 0) {
        gaps.push("no resolver calls recorded");
    } else if (
        r.kind === "bench" &&
        !(r.resolver.add_nodes_to_resolver?.calls! > 0)
    ) {
        gaps.push("no add_nodes_to_resolver calls recorded");
    }
    const errors = r.census?.byType._error ?? 0;
    if (errors > 0) {
        gaps.push(`loaded with ${errors} _error component(s)`);
    }
    if (r.wantsDrag && !Number.isFinite(r.drag?.medianMs)) {
        gaps.push("no drag measured");
    } else if (r.wantsDrag && !r.drag?.moved) {
        gaps.push(
            "the dragged point did not move (fixed, or the move was refused)",
        );
    }
    return gaps;
}

function phaseTable(results: FixtureResult[]): string {
    const lines = [
        `| fixture | ${PHASES.join(" | ")} |`,
        `|---|${PHASES.map(() => "---:").join("|")}|`,
    ];
    for (const r of results) {
        if (!r.phases) {
            continue;
        }
        lines.push(
            `| ${r.name} | ${PHASES.map((p) => ms(r.phases![p])).join(" | ")} |`,
        );
    }
    return lines.join("\n");
}

function resolverTable(results: FixtureResult[]): string {
    const lines = [
        `| fixture | ${RESOLVER_COLUMNS.map((c) => `${c} calls | ${c} ms | ${c} max ms`).join(" | ")} |`,
        `|---|${RESOLVER_COLUMNS.map(() => "---:|---:|---:").join("|")}|`,
    ];
    for (const r of results) {
        if (!r.resolver) {
            continue;
        }
        const cells = RESOLVER_COLUMNS.map((c) => {
            const e = r.resolver![c];
            return e
                ? `${fmt.format(e.calls)} | ${ms(e.totalMs)} | ${e.maxMs.toFixed(1)}`
                : " | | ";
        });
        lines.push(`| ${r.name} | ${cells.join(" | ")} |`);
    }
    return lines.join("\n");
}

function breakdowns(results: FixtureResult[]): string {
    const out: string[] = [];
    for (const r of results) {
        if (!r.census || r.kind !== "bench") {
            continue;
        }
        const c = r.census;
        out.push(
            `<details><summary>${r.name}: where the components, state variables and dependencies are</summary>\n`,
            `- components by type: ${formatCounts(c.byType, 12)}`,
            `- shadows by type: ${formatCounts(c.shadowsByType, 8)}`,
            `- attribute components by type: ${formatCounts(c.attributeComponentsByType, 8)}`,
            `- dependencies by kind: ${formatCounts(c.dependenciesByKind, 10)}`,
            `- dependencies by component type: ${formatCounts(c.dependenciesByComponentType, 10)}`,
            `- state variables by component type: ${formatCounts(c.stateVariablesByComponentType, 10)}`,
            `- dependency setups: ${fmt.format(c.numDependencySetups)}; materialized state variables: ${fmt.format(c.numMaterializedStateVariables)}`,
        );
        if (r.profile) {
            out.push(
                "",
                "```",
                formatProfile(r.profile, { files: 15, functions: 30 }),
                "```",
            );
        }
        out.push("\n</details>\n");
    }
    return out.join("\n");
}

function summaryMarkdown(results: FixtureResult[]): string {
    const rows: CensusTableRow[] = results.map((r) => ({
        name: r.name,
        census: r.census as Census,
        loadMs: r.loadMs,
        dragMs: r.drag?.medianMs,
        error: r.error,
    }));
    return [
        "## Performance harness",
        "",
        `Node ${process.version}, ${new Date().toISOString()}. Load is wall-clock milliseconds of \`createTestCore\` in node; drag is the median wall-clock milliseconds of one awaited transient \`movePoint\` over 25 moves of the fixture's named point (the deferred renderer remainder excluded). Compare ratios across runs on the same machine, not absolutes.`,
        "",
        censusMarkdownTable(rows),
        "",
        "### Load phases (ms)",
        "",
        phaseTable(results.filter((r) => r.kind === "bench")),
        "",
        "### Resolver calls across the WASM boundary",
        "",
        resolverTable(results.filter((r) => r.kind === "bench")),
        "",
        breakdowns(results),
    ].join("\n");
}

describe.runIf(Boolean(RESULT_PATH))("performance bench", () => {
    it(
        "measures the census and load time of each fixture",
        async () => {
            const fixtures = [...MICRO_DOCUMENTS, ...benchFixtures()].filter(
                (f) => !ONLY || ONLY.test(f.name),
            );
            const results: FixtureResult[] = [];
            for (const fixture of fixtures) {
                results.push(await measureFixture(fixture));
            }

            fs.writeFileSync(RESULT_PATH!, JSON.stringify(results, null, 2));
            const markdown = summaryMarkdown(results);
            if (SUMMARY_PATH) {
                fs.appendFileSync(SUMMARY_PATH, markdown + "\n");
            }
            // Not `console.log`: `test-core.ts` wraps it in `util.inspect`,
            // which prints a multi-line string as quoted, `\n`-escaped
            // fragments, and vitest's default reporter hides test console
            // output anyway. Written straight to stdout it reads as markdown.
            process.stdout.write(markdown + "\n");

            // Deliberately weak: this is an instrument, and its output is the
            // JSON and markdown it writes. The assertions exist only so that a
            // run which measured nothing, or whose instrumentation went blank,
            // cannot pass quietly. No duration is asserted.
            expect(results.length).toBeGreaterThan(0);
            const failed = results.filter((r) => r.error);
            expect(
                failed.map((r) => `${r.name}: ${r.error}`),
                "every fixture should load",
            ).toEqual([]);
            const gaps = results.flatMap((r) =>
                instrumentationGaps(r).map((gap) => `${r.name}: ${gap}`),
            );
            expect(gaps, "the instrumentation should be populated").toEqual([]);
        },
        BENCH_TIMEOUT_MS,
    );
});
