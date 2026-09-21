import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "./test-core";

/**
 * Dragging a point invalidates far more than the point. On a document whose
 * points are stacked by their rank among all the points, moving one restates
 * every other point and everything reading them — on the 50-point dot plot
 * that motivated this, ~133 rendered components per drag step, all of which
 * the viewer then reconciles and typesets.
 *
 * So a transient update (a drag in progress) sends its own targets straight
 * away and holds the rest until the interaction goes quiet; the commit that
 * ends the drag sends everything. These tests pin that split, and pin that
 * nothing is dropped on the way.
 */

/** Three points whose y stacks them by rank, so moving one moves the others. */
const doenetML = `
<graph>
  <repeatForSequence from="1" to="3" indexName="i" name="Ps">
    <point name="P">($xs[$i], <number fixed>$sortedPos[$i]</number>)</point>
  </repeatForSequence>
</graph>
<setup>
  <numberList name="xs">3 1 2</numberList>
  <numberList name="values">$Ps.x</numberList>
  <sequence name="indices" from="1" to="3" />
  <sortIndices name="perm">$values</sortIndices>
  <indexOf name="sortedPos" target="$indices">$perm</indexOf>
</setup>
<p>Mean: <mean name="mean">$values</mean></p>
`;

/**
 * Build the core and capture every batch core sends the renderer.
 *
 * `createTestCore` passes a no-op as the renderer callback, so the capture
 * replaces it afterwards; batches from the initial render are therefore not
 * included, which is what we want.
 */
async function setup() {
    const { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });
    const innerCore = (core as any).core;

    const batches: {
        componentIndices: number[];
        deferred: boolean;
        actionId?: string;
    }[] = [];

    innerCore.updateRenderersCallback = (args: any) => {
        for (const instruction of args.updateInstructions ?? []) {
            if (instruction.instructionType !== "updateRendererStates") {
                continue;
            }
            batches.push({
                componentIndices: instruction.rendererStatesToUpdate.map(
                    (entry: any) => entry.componentIdx,
                ),
                deferred: Boolean(args.deferred),
                actionId: args.actionId,
            });
        }
    };

    return { core, innerCore, resolvePathToNodeIdx, batches };
}

async function movePointTo({
    core,
    componentIdx,
    x,
    transient,
}: {
    core: any;
    componentIdx: number;
    x: number;
    transient: boolean;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "movePoint",
        args: transient
            ? { x, y: 0, transient: true, skippable: true }
            : { x, y: 0 },
    });
}

describe("a drag sends the dragged component first @group4", () => {
    it("a transient move sends only its own target, and defers the rest", async () => {
        vi.useFakeTimers();
        try {
            const { core, resolvePathToNodeIdx, batches } = await setup();
            const pointIdx = await resolvePathToNodeIdx("Ps[1].P");

            await movePointTo({
                core,
                componentIdx: pointIdx,
                x: 10,
                transient: true,
            });

            expect(batches).toHaveLength(1);
            expect(batches[0].componentIndices).toEqual([pointIdx]);
            expect(batches[0].deferred).toBe(false);

            // The rest is still pending, and arrives once the drag goes quiet.
            await vi.advanceTimersByTimeAsync(500);

            expect(batches).toHaveLength(2);
            expect(batches[1].deferred).toBe(true);

            // Everything the move restated beyond the point itself. The point
            // may appear here too: the deferred batch is the one that
            // reconciles changed rendered children, which the priority batch
            // deliberately skips.
            const others = batches[1].componentIndices.filter(
                (idx) => idx !== pointIdx,
            );
            expect(others.length).toBeGreaterThan(0);
        } finally {
            vi.useRealTimers();
        }
    });

    it("successive drag steps coalesce into one deferred batch", async () => {
        vi.useFakeTimers();
        try {
            const { core, resolvePathToNodeIdx, batches } = await setup();
            const pointIdx = await resolvePathToNodeIdx("Ps[1].P");

            for (const x of [10, 11, 12, 13]) {
                await movePointTo({
                    core,
                    componentIdx: pointIdx,
                    x,
                    transient: true,
                });
            }

            // One small batch per step, nothing else yet.
            expect(batches).toHaveLength(4);
            for (const batch of batches) {
                expect(batch.componentIndices).toEqual([pointIdx]);
            }

            await vi.advanceTimersByTimeAsync(500);

            // A single deferred batch for all four steps, not one per step.
            expect(batches).toHaveLength(5);
            expect(batches[4].deferred).toBe(true);
        } finally {
            vi.useRealTimers();
        }
    });

    it("a non-transient move sends everything at once", async () => {
        const { core, resolvePathToNodeIdx, batches } = await setup();
        const pointIdx = await resolvePathToNodeIdx("Ps[1].P");

        await movePointTo({
            core,
            componentIdx: pointIdx,
            x: 10,
            transient: false,
        });

        expect(batches).toHaveLength(1);
        expect(batches[0].deferred).toBe(false);
        expect(batches[0].componentIndices).toContain(pointIdx);
        expect(batches[0].componentIndices.length).toBeGreaterThan(1);
    });

    it("the commit ending a drag flushes what the drag deferred", async () => {
        const { core, innerCore, resolvePathToNodeIdx, batches } =
            await setup();
        const pointIdx = await resolvePathToNodeIdx("Ps[1].P");

        await movePointTo({
            core,
            componentIdx: pointIdx,
            x: 10,
            transient: true,
        });
        await movePointTo({
            core,
            componentIdx: pointIdx,
            x: 11,
            transient: false,
        });

        // Nothing is left waiting on a timer, and nothing is left unsent.
        expect(
            innerCore.rendererInstructionBuilder._deferredRendererTimeout,
        ).toBe(null);
        expect(innerCore.updateInfo.componentsToUpdateRenderers.size).toBe(0);

        const everythingSent = new Set(
            batches.flatMap((batch) => batch.componentIndices),
        );
        expect(everythingSent.has(pointIdx)).toBe(true);
        expect(everythingSent.size).toBeGreaterThan(1);
    });

    it("a deferred drag still leaves the renderer state correct", async () => {
        vi.useFakeTimers();
        try {
            const { core, innerCore, resolvePathToNodeIdx } = await setup();
            const pointIdx = await resolvePathToNodeIdx("Ps[1].P");

            // Point 1 starts at x=3, the largest, so it is ranked last. Move it
            // below the others and its rank — and so its rendered y — changes.
            await movePointTo({
                core,
                componentIdx: pointIdx,
                x: 0,
                transient: true,
            });
            await vi.advanceTimersByTimeAsync(500);

            const stateValues = await core.returnAllStateVariables(false, true);
            const rendererState = innerCore.rendererInstructionBuilder
                .rendererState as Record<number, any>;

            for (const idx of Object.keys(rendererState)) {
                const cached = rendererState[Number(idx)]?.stateValues;
                const actual = stateValues[Number(idx)]?.stateValues;
                if (!cached || !actual || !("numericalXs" in cached)) {
                    continue;
                }
                expect(
                    cached.numericalXs,
                    `renderer state for component ${idx} is stale`,
                ).toEqual(actual.numericalXs);
            }
        } finally {
            vi.useRealTimers();
        }
    });
});
