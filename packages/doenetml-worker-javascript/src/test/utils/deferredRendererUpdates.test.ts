import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "./test-core";

/**
 * Dragging a point invalidates far more than the point. On a document whose
 * points are stacked by their rank among all the points, moving one restates
 * every other point and everything reading them — on the 50-point dot plot
 * that motivated this, ~133 rendered components per drag step, all of which
 * the viewer then reconciles and typesets.
 *
 * So a drag step sends its own targets straight away and holds the rest until
 * the interaction goes quiet; the commit that ends the drag sends everything.
 * These tests pin that split, and pin that nothing is dropped on the way.
 *
 * Typing is `transient` too, for an unrelated reason, and must NOT take the
 * split — see `typingDoenetML` below.
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
 * A drag is not the only `transient` caller: the inputs that commit on blur or
 * enter mark every keystroke transient (`MathInput.updateRawValue`,
 * `inputUpdateImmediateValue` in `utils/input.js`,
 * `mathComponentInputUpdateRawValue` in `utils/mathComponentInput.js`), for an
 * unrelated and by now historical reason — it once kept a keystroke out of the
 * saved state.
 *
 * Those must not take the renderer split, so they deliberately do not set
 * `transient` at all. A keystroke's downstream carries feedback about what was
 * typed: an `<answer>`'s check-work button has to drop "Incorrect" on the
 * first character of a correction, and an echo of `immediateValue` would
 * otherwise freeze for the length of a typing burst.
 * Deferring it also broke `prototype/textInput.cy.js`,
 * `prototype/sectionTitleUpdate.cy.js`, `variants/specifysinglevariant.cy.js`
 * and `tagSpecific/pretzel.cy.js` — on the prototype's flat action path the
 * deferred batch is not merely late, it is dropped, because that path buffers
 * only what arrives while the action is in flight.
 */
const typingDoenetML = `
<mathInput name="mi" />
<p>Math echo: <math name="mEcho">$mi.immediateValue</math></p>
<textInput name="ti" />
<p>Text echo: <text name="tEcho">$ti.immediateValue</text></p>
`;

/**
 * Moving `P` changes how many replacements the repeat has, so a drag step
 * adds or removes rendered components rather than only restating them.
 */
const structuralDoenetML = `
<graph>
  <point name="P">(5,0)</point>
</graph>
<setup><sequence name="seq" from="1" to="$P.x" /></setup>
<repeat for="$seq" name="rep" valueName="v">
  <p name="item">Item <number name="n">$v</number></p>
</repeat>
`;

/**
 * Build the core and capture every batch core sends the renderer.
 *
 * `createTestCore` passes a no-op as the renderer callback, so the capture
 * replaces it afterwards; batches from the initial render are therefore not
 * included, which is what we want.
 */
async function setup(source: string = doenetML) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML: source,
    });
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

/** Every component index currently rendered below `componentIdx`. */
function renderedDescendants(innerCore: any, componentIdx: number): number[] {
    const found: number[] = [];
    const walk = (idx: number) => {
        const entry = innerCore.rendererInstructionBuilder.componentsToRender[
            idx
        ] as { children: any[] } | undefined;
        for (const child of entry?.children ?? []) {
            if (child?.componentIdx != undefined) {
                found.push(child.componentIdx);
                walk(child.componentIdx);
            }
        }
    };
    walk(componentIdx);
    return found.sort((a, b) => a - b);
}

describe("an interaction sends its own target ahead of the rest @group4", () => {
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

    it.each([
        ["removes", 2],
        ["adds", 8],
    ])(
        "a drag that %s rendered components leaves the same tree as an undeferred move",
        async (_label, x) => {
            // The deferred batch, unlike the priority one, is the batch that
            // reconciles changed rendered children — and it goes out without
            // the second composite-replacement drain that
            // `updateAllChangedRenderers` runs. Pin that the tree it leaves
            // behind is the same one the undeferred path produces.
            vi.useFakeTimers();
            let deferredTree: number[];
            try {
                const { core, innerCore, resolvePathToNodeIdx } =
                    await setup(structuralDoenetML);
                const pointIdx = await resolvePathToNodeIdx("P");

                await movePointTo({
                    core,
                    componentIdx: pointIdx,
                    x,
                    transient: true,
                });
                await vi.advanceTimersByTimeAsync(500);

                deferredTree = renderedDescendants(
                    innerCore,
                    innerCore.documentIdx,
                );
                expect(
                    innerCore.updateInfo.componentsToUpdateRenderers.size,
                ).toBe(0);
            } finally {
                vi.useRealTimers();
            }

            const { core, innerCore, resolvePathToNodeIdx } =
                await setup(structuralDoenetML);
            const pointIdx = await resolvePathToNodeIdx("P");
            await movePointTo({
                core,
                componentIdx: pointIdx,
                x,
                transient: false,
            });

            expect(deferredTree).toEqual(
                renderedDescendants(innerCore, innerCore.documentIdx),
            );
        },
    );

    it("a core terminated mid-drag sends nothing more", async () => {
        vi.useFakeTimers();
        try {
            const { core, innerCore, resolvePathToNodeIdx, batches } =
                await setup();
            const pointIdx = await resolvePathToNodeIdx("Ps[1].P");

            await movePointTo({
                core,
                componentIdx: pointIdx,
                x: 10,
                transient: true,
            });
            const sentBeforeTerminate = batches.length;
            expect(
                innerCore.rendererInstructionBuilder._deferredRendererTimeout,
            ).not.toBe(null);

            await (core as any).terminate();

            // The viewer is going away, so the remainder is dropped rather
            // than pushed into it: terminating takes the timer down with it
            // instead of leaving it to fire into a torn-down page.
            expect(
                innerCore.rendererInstructionBuilder._deferredRendererTimeout,
            ).toBe(null);

            await vi.advanceTimersByTimeAsync(2000);
            expect(batches).toHaveLength(sentBeforeTerminate);
        } finally {
            vi.useRealTimers();
        }
    });

    it.each([
        [
            "mathInput",
            "mi",
            "updateRawValue",
            { rawRendererValue: "5" },
            "mEcho",
        ],
        ["textInput", "ti", "updateImmediateValue", { text: "hello" }, "tEcho"],
    ])(
        "a keystroke in a %s sends what reads it in the same batch",
        async (_label, inputName, actionName, args, echoName) => {
            // Typing does not set `transient`, so it keeps the undeferred
            // behavior: the echo goes out with the input, not 150 ms later,
            // and nothing is left pending.
            vi.useFakeTimers();
            try {
                const { core, innerCore, resolvePathToNodeIdx, batches } =
                    await setup(typingDoenetML);
                const inputIdx = await resolvePathToNodeIdx(inputName);
                const echoIdx = await resolvePathToNodeIdx(echoName);

                await (core as any).requestAction({
                    componentIdx: inputIdx,
                    actionName,
                    args,
                });

                expect(batches).toHaveLength(1);
                expect(batches[0].deferred).toBe(false);
                expect(batches[0].componentIndices).toContain(inputIdx);
                expect(batches[0].componentIndices).toContain(echoIdx);

                expect(
                    innerCore.rendererInstructionBuilder
                        ._deferredRendererTimeout,
                ).toBe(null);
                expect(
                    innerCore.updateInfo.componentsToUpdateRenderers.size,
                ).toBe(0);

                // Nothing arrives later either.
                await vi.advanceTimersByTimeAsync(500);
                expect(batches).toHaveLength(1);
            } finally {
                vi.useRealTimers();
            }
        },
    );
});
