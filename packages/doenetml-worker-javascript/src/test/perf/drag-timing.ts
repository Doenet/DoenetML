/**
 * Drag timing for the performance harness (Doenet/DoenetML#2126): the median
 * wall-clock cost of one `movePoint` on a loaded document, driven the way
 * `drag-bench.test.ts` drives it, without that bench's per-phase breakdown.
 */
import type { createTestCore } from "../utils/test-core";

type TestCore = Awaited<ReturnType<typeof createTestCore>>;

export type DragMeasurement = {
    /** The path the drags were sent to, and the component it resolved to. */
    target: string;
    pointIdx: number;
    numDrags: number;
    /**
     * Whether the point's first coordinate differs after the sweep. A move
     * that is refused (a `fixed` point, or a write the core cannot invert)
     * returns in well under a millisecond; this tells that apart from a fast
     * drag.
     */
    moved: boolean;
    /** Median wall-clock milliseconds of one awaited `movePoint` action. */
    medianMs: number;
    maxMs: number;
};

function median(values: number[]): number {
    if (values.length === 0) {
        return NaN;
    }
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 1
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Resolve `target` by name, sweep it from x = 0 to x = 100 in `numDrags`
 * transient, skippable `movePoint` actions, which is what the renderer sends
 * on every pointermove, and report the median and maximum wall-clock time of
 * one awaited action. The awaited time covers the state update and the
 * renderer pull for visible graphs; the rest of the renderer update is
 * deferred to a timer by design, so the call waits `settleMs` afterwards
 * for it to run before the caller measures anything else.
 */
export async function measureDrag(
    testCore: TestCore,
    target: string,
    {
        numDrags = 25,
        settleMs = 400,
    }: { numDrags?: number; settleMs?: number } = {},
): Promise<DragMeasurement> {
    const pointIdx = await testCore.resolvePathToNodeIdx(target);
    const point: any = (testCore.core.core as any)._components[pointIdx];
    if (!point || point.componentType !== "point") {
        throw new Error(
            `Drag target ${target} resolved to ${point?.componentType ?? "nothing"}, not a point.`,
        );
    }
    const xBefore = (await point.stateValues.numericalXs)[0];
    const samples: number[] = [];
    for (let i = 0; i < numDrags; i++) {
        const x = (i / Math.max(numDrags - 1, 1)) * 100;
        const t0 = performance.now();
        await testCore.core.requestAction({
            componentIdx: pointIdx,
            actionName: "movePoint",
            args: { x, y: 0, transient: true, skippable: true },
        });
        samples.push(performance.now() - t0);
    }
    await new Promise((resolve) => setTimeout(resolve, settleMs));
    const xAfter = (await point.stateValues.numericalXs)[0];
    return {
        target,
        pointIdx,
        numDrags,
        moved: xAfter !== xBefore,
        medianMs: median(samples),
        maxMs: Math.max(...samples),
    };
}
