import { describe, expect, it } from "vitest";
import { createTestCore } from "./utils/test-core";
import fs from "node:fs";

// Per-phase drag benchmark for the drag-responsiveness workstream
// (https://github.com/Doenet/DoenetML/issues/1978). Drives a stream of
// `movePoint` actions across a 50-point dot plot and reports where the time in
// each `performUpdate` actually goes. Run with:
//   DRAGBENCH_RESULT=/tmp/dragbench.json \
//       npx vitest run src/test/drag-bench.test.ts
//
// It only runs when that variable is set. This file carries no `@groupN` tag,
// so it would otherwise land in the `test:group4` catch-all
// (`-t '^(?!.*@(?:group1|group2|group3))'`) and spend minutes measuring
// something no assertion depends on.
//
// The point of the split is to separate the cost we can defer (the renderer
// pull, `updateAllChangedRenderers`, which evaluates every `forRenderer`
// variable on every queued component) from the cost we cannot (the
// invalidation and composite-replacement churn inside
// `executeUpdateStateVariables`). Only the former is addressable by
// prioritizing the dragged component's renderer update.

const NUM_POINTS = 50;

/**
 * The dot-plot document from `packages/doenetml/dev/testCode.doenet`, with the
 * `<tabular>` made unconditional so the two variants differ only in whether the
 * table exists at all. The original hides it behind a `<booleanInput>`, which
 * is the toggle the reported lag is attributed to.
 */
function buildDoc({ withTabular }: { withTabular: boolean }) {
    const tabular = `
<tabular width="200px">
  <row header><cell>Income</cell><cell>Frequency</cell></row>
  <repeat for="$tally" indexName="i" valueName="count">
    <row><cell>$tally.categories[$i]</cell><cell>$count</cell></row>
  </repeat>
</tabular>`;

    return `
<setup>
  <sampleRandomNumbers name="ns" type="gaussian" mean="20"
      standardDeviation="10" numSamples="${NUM_POINTS}" fixed="false" />
</setup>

<graph displayYAxis="false" fixAxes aspectRatio="4" xMin="-2" xMax="102"
    yMin="-3" size="full" showBorder="false">
  <lineSegment name="axis" hide endpoints="(0,0) (100,0)" />
  <repeatForSequence from="1" to="${NUM_POINTS}" indexName="i" name="Ps">
    <point name="P" labelPosition="top">
      ($ns[$i], <number fixed>0.5 ($sortedPos[$i] - $first[$i])</number>)
      <constrainToGraph />
      <constrainToGrid dx="2" dy="0.5" />
    </point>
  </repeatForSequence>
</graph>

<setup>
  <numberList name="values">$Ps.x</numberList>
  <sequence name="indices" from="1" to="${NUM_POINTS}" />
  <sortIndices name="perm">$values</sortIndices>
  <indexOf name="sortedPos" target="$indices">$perm</indexOf>
  <searchSorted name="first" allowUnsorted target="$values">$values</searchSorted>
  <tally name="tally">$values</tally>
</setup>

<p>Mean: <mean name="mean">$values</mean></p>
<p>Median: <median name="median">$values</median></p>
${withTabular ? tabular : ""}
`;
}

const DRAGBENCH_ENABLED = Boolean(process.env.DRAGBENCH_RESULT);

/** Building the core for this document takes minutes, not seconds. */
const BENCH_TIMEOUT_MS = 600000;

type Phase =
    | "performUpdate"
    | "executeUpdateStateVariables"
    | "processStateVariableTriggers"
    | "updateAllChangedRenderers";

const PHASES: Phase[] = [
    "performUpdate",
    "executeUpdateStateVariables",
    "processStateVariableTriggers",
    "updateAllChangedRenderers",
];

describe.runIf(DRAGBENCH_ENABLED)("drag benchmark", () => {
    it(
        "reports per-phase drag cost with and without the tabular",
        async () => {
            const withTabular = await measure({ withTabular: true });
            const withoutTabular = await measure({ withTabular: false });

            const result = { withTabular, withoutTabular };
            console.log(JSON.stringify(result, null, 2));

            const resultPath = process.env.DRAGBENCH_RESULT;
            if (resultPath) {
                fs.writeFileSync(resultPath, JSON.stringify(result, null, 2));
            }

            // Deliberately weak: this is an instrument, and its output is the
            // JSON it writes. The assertion exists only so a document that
            // silently stopped updating cannot report as very fast.
            expect(withTabular.numDrags).toBeGreaterThan(0);
            expect(withoutTabular.numDrags).toBeGreaterThan(0);
        },
        BENCH_TIMEOUT_MS,
    );
});

/**
 * Build the document, drag one point across the plot, and report the median
 * per-drag cost of each phase.
 *
 * Phases are timed by wrapping the methods `UpdateExecutor.performUpdate`
 * calls on the Core facade (`this.core.executeUpdateStateVariables` and
 * friends), plus `updateExecutor.performUpdate` itself for the total. Wrapping
 * the facade rather than the manager classes is what makes the inner timings
 * line up with the outer one, since that is how `performUpdate` reaches them.
 *
 * `other` is the remainder of `performUpdate`: `requestComponentChanges`, the
 * essential-value and persistence merges, and the unconditional
 * `componentCreditAchieved` await at the end.
 */
async function measure({ withTabular }: { withTabular: boolean }) {
    const doenetML = buildDoc({ withTabular });
    const { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });

    const innerCore = (core as any).core;
    const pointIdx = await resolvePathToNodeIdx("Ps[1].P");

    const samples: Record<Phase, number[]> = {
        performUpdate: [],
        executeUpdateStateVariables: [],
        processStateVariableTriggers: [],
        updateAllChangedRenderers: [],
    };

    // Depth guards: `performUpdate` can re-enter (an action's update triggering
    // another), and only the outermost call is a "drag".
    let depth = 0;

    // How many components each drag pushes through the renderer pull, and how
    // many `forRenderer` variables that works out to. This is the quantity
    // prioritizing the dragged component can actually remove.
    const batchSizes: number[] = [];
    const origUpdateRendererInstructions =
        innerCore.rendererInstructionBuilder.updateRendererInstructions.bind(
            innerCore.rendererInstructionBuilder,
        );
    innerCore.rendererInstructionBuilder.updateRendererInstructions = async (
        args: any,
    ) => {
        const names = args?.componentNamesToUpdate ?? [];
        const rendered = names.filter(
            (idx: number) =>
                idx in innerCore.rendererInstructionBuilder.componentsToRender,
        );
        batchSizes.push(rendered.length);
        return await origUpdateRendererInstructions(args);
    };

    const originals: Record<string, any> = {};

    function instrument(target: any, name: string, phase: Phase) {
        originals[phase] = target[name].bind(target);
        target[name] = async (...args: any[]) => {
            if (depth > 1) {
                return await originals[phase](...args);
            }
            const t0 = performance.now();
            try {
                return await originals[phase](...args);
            } finally {
                samples[phase].push(performance.now() - t0);
            }
        };
    }

    instrument(
        innerCore,
        "executeUpdateStateVariables",
        "executeUpdateStateVariables",
    );
    instrument(
        innerCore,
        "processStateVariableTriggers",
        "processStateVariableTriggers",
    );
    instrument(
        innerCore,
        "updateAllChangedRenderers",
        "updateAllChangedRenderers",
    );

    const origPerformUpdate = innerCore.updateExecutor.performUpdate.bind(
        innerCore.updateExecutor,
    );
    innerCore.updateExecutor.performUpdate = async (...args: any[]) => {
        depth++;
        const outermost = depth === 1;
        const t0 = performance.now();
        try {
            return await origPerformUpdate(...args);
        } finally {
            if (outermost) {
                samples.performUpdate.push(performance.now() - t0);
            }
            depth--;
        }
    };

    // Sweep the point left to right, as a drag does. Each step is a transient
    // move, which is what the renderer sends on every pointermove.
    const NUM_DRAGS = 25;
    for (let i = 0; i < NUM_DRAGS; i++) {
        const x = (i / (NUM_DRAGS - 1)) * 100;
        await core.requestAction({
            componentIdx: pointIdx,
            actionName: "movePoint",
            args: { x, y: 0, transient: true, skippable: true },
        });
    }

    // The deferred remainder arrives on a timer; wait past it so the batch
    // counts below include it.
    await new Promise((resolve) => setTimeout(resolve, 400));

    const summary: Record<string, number> = {};
    for (const phase of PHASES) {
        summary[phase] = median(samples[phase]);
    }
    summary.other =
        summary.performUpdate -
        summary.executeUpdateStateVariables -
        summary.processStateVariableTriggers -
        summary.updateAllChangedRenderers;

    return {
        withTabular,
        numDrags: samples.performUpdate.length,
        numBatches: batchSizes.length,
        medianRenderedComponentsPerBatch: median(batchSizes),
        maxRenderedComponentsPerBatch: Math.max(0, ...batchSizes),
        totalRenderedComponentsPulled: batchSizes.reduce((a, b) => a + b, 0),
        numComponentsRendered: Object.keys(
            innerCore.rendererInstructionBuilder.componentsToRender,
        ).length,
        medianMs: Object.fromEntries(
            Object.entries(summary).map(([k, v]) => [k, Number(v.toFixed(1))]),
        ),
    };
}

function median(values: number[]) {
    if (values.length === 0) {
        return 0;
    }
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
}
