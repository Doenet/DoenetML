/**
 * Drag timing for the performance harness (Doenet/DoenetML#2126): the median
 * wall-clock cost of one `movePoint` on a loaded document, driven the way
 * `drag-bench.test.ts` drives it, without that bench's per-phase breakdown.
 */
import type { createTestCore } from "../utils/test-core";

type TestCore = Awaited<ReturnType<typeof createTestCore>>;

/**
 * Which point a fixture drags, and how. `target` is a path for
 * `resolvePathToNodeIdx` (see `resolveDragTarget`); with `pointChild`, it
 * names a component, and the point dragged is its `pointChild`th child point
 * (counting from 1), for a document whose points have no names. The drag
 * sweeps `axis` (default `x`) from `from` to `to` (default 0 to 100) in
 * `numDrags` moves (default 25), holding the other coordinate where it is.
 */
export type DragSpec = {
    target: string;
    pointChild?: number;
    axis?: "x" | "y";
    from?: number;
    to?: number;
    numDrags?: number;
};

export type DragMeasurement = {
    /** The path the drags were sent to, and the component it resolved to. */
    target: string;
    pointIdx: number;
    numDrags: number;
    /** The coordinate swept. */
    axis: "x" | "y";
    /**
     * Whether the swept coordinate differs after the sweep. A move
     * that is refused (a `fixed` point, or a write the core cannot invert) is
     * reported as a success and takes a few milliseconds, which is also what
     * a cheap move on the wrong point takes, so time alone cannot tell them
     * apart; this can.
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
 * The index `movePoint` is sent to for `target`, and how to read the
 * coordinates of what it moves. The target is a `<point>`, the
 * `pointChild`th child point of the component it names, or entry k of a
 * list of points: `Ps[k]`, or `Ps[k].P` when `Ps` is a repeat of a point
 * named `P` made a list of points (Doenet/DoenetML#2163), whose entry k is
 * the iteration's point. An entry has no component; its renderer's index
 * stands for it.
 */
export async function resolveDragTarget(
    testCore: TestCore,
    target: string,
    pointChild?: number,
) {
    const core: any = testCore.core.core;
    let pointIdx = await testCore.resolvePathToNodeIdx(target);
    if (pointChild !== undefined) {
        const points = (
            core._components[pointIdx]?.activeChildren ?? []
        ).filter((child: any) => child?.componentType === "point");
        pointIdx = points[pointChild - 1]?.componentIdx;
    }
    const point: any = core._components[pointIdx];
    if (point?.componentType === "point") {
        return {
            pointIdx,
            coordinates: async (): Promise<number[]> =>
                await point.stateValues.numericalXs,
        };
    }
    const entryMatch = /^(.*)\[(\d+)\](\.[^.[\]]+)?$/.exec(target);
    if (entryMatch) {
        const list: any =
            core._components[
                await testCore.resolvePathToNodeIdx(entryMatch[1])
            ];
        const entryIndex = Number(entryMatch[2]) - 1;
        if (
            list?.constructor.listEntryComponentType === "point" &&
            entryIndex >= 0 &&
            entryIndex < (await list.stateValues.numEntries)
        ) {
            return {
                pointIdx:
                    core.rendererInstructionBuilder.rendererIdxForListEntry(
                        list,
                        entryIndex,
                    ),
                coordinates: async (): Promise<number[]> =>
                    (await list.stateValues.entryNumericalXs)[entryIndex],
            };
        }
    }
    throw new Error(
        `Drag target ${target}${pointChild === undefined ? "" : ` point ${pointChild}`} resolved to ${point?.componentType ?? "nothing"}, not a point.`,
    );
}

/**
 * Resolve the point `spec` names, sweep it along `spec.axis` in `numDrags`
 * transient, skippable `movePoint` actions, which is what the renderer sends
 * on every pointermove, and report the median and maximum wall-clock time of
 * one awaited action. The awaited time covers the state update and the
 * renderer pull for visible graphs; the rest of the renderer update is
 * deferred to a timer by design, so the call waits `settleMs` afterwards
 * for it to run before the caller measures anything else.
 */
export async function measureDrag(
    testCore: TestCore,
    spec: DragSpec,
    { settleMs = 400 }: { settleMs?: number } = {},
): Promise<DragMeasurement> {
    const {
        target,
        pointChild,
        axis = "x",
        from = 0,
        to = 100,
        numDrags = 25,
    } = spec;
    const { pointIdx, coordinates } = await resolveDragTarget(
        testCore,
        target,
        pointChild,
    );
    const swept = axis === "x" ? 0 : 1;
    // a copy: the core updates a point's coordinate array in place
    const before = [...(await coordinates())];
    const samples: number[] = [];
    for (let i = 0; i < numDrags; i++) {
        const value = from + (i / Math.max(numDrags - 1, 1)) * (to - from);
        const [x, y] = axis === "x" ? [value, 0] : [before[0], value];
        const t0 = performance.now();
        await testCore.core.requestAction({
            componentIdx: pointIdx,
            actionName: "movePoint",
            args: { x, y, transient: true, skippable: true },
        });
        samples.push(performance.now() - t0);
    }
    await new Promise((resolve) => setTimeout(resolve, settleMs));
    const after = await coordinates();
    return {
        target:
            pointChild === undefined ? target : `${target} point ${pointChild}`,
        pointIdx,
        axis,
        numDrags,
        moved: after[swept] !== before[swept],
        medianMs: median(samples),
        maxMs: Math.max(...samples),
    };
}
