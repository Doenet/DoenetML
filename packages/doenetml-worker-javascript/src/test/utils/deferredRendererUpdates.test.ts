import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "./test-core";

/**
 * Dragging a point invalidates far more than the point. On a document whose
 * points are stacked by their rank among all the points, moving one restates
 * every other point and everything reading them — on the 50-point dot plot
 * that motivated this, ~133 rendered components per drag step, all of which
 * the viewer then reconciles and typesets.
 *
 * So a drag step sends what the reader is watching straight away — its own
 * targets and everything rendered on a visible graph — and holds the rest until
 * the interaction goes quiet; the commit that ends the drag sends everything on
 * screen. Whatever is offscreen, after a drag or any other update, goes out
 * from the idle lane once core has nothing else to do. These tests pin those
 * splits, and pin that nothing is dropped on the way.
 *
 * Typing must NOT take the drag split, so the inputs that commit on blur or
 * enter deliberately do not mark a keystroke `transient` — see
 * `typingDoenetML` below. A keystroke does hold back what is offscreen.
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
 * The inputs that commit on blur or enter (`MathInput.updateRawValue`,
 * `inputUpdateImmediateValue` in `utils/input.js`,
 * `mathComponentInputUpdateRawValue` in `utils/mathComponentInput.js`) used to
 * mark every keystroke `transient`, for an unrelated and by now historical
 * reason — it once kept a keystroke out of the saved state.
 *
 * They must not take the renderer split, so they no longer set `transient` at
 * all. A keystroke's downstream carries feedback about what was typed: an
 * `<answer>`'s check-work button has to drop "Incorrect" on the first
 * character of a correction, and an echo of `immediateValue` would otherwise
 * freeze for the length of a typing burst.
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
 * Dragging in one graph moves a point in a second, the way a side-by-side
 * pair of graphs is often built, and an echo off both graphs.
 */
const twoGraphsDoenetML = `
<graph name="gA">
  <point name="A">(1,2)</point>
</graph>
<graph name="gB">
  <point name="B">($A.x, -$A.y)</point>
</graph>
<p>Echo: <number name="echo">$A.x</number></p>
`;

/**
 * The dragged point sits in a graph nested inside another, and a point in the
 * outer graph follows it.
 */
const nestedGraphDoenetML = `
<graph name="outer">
  <point name="R">($A.x, 5)</point>
  <graph name="inner">
    <point name="A">(1,2)</point>
  </graph>
</graph>
<p>Echo: <number name="echo">$A.x</number></p>
`;

/**
 * As `structuralDoenetML` below, but the components the drag adds or removes
 * are on the graph, so they belong in the priority batch.
 */
const structuralOnGraphDoenetML = `
<graph name="g">
  <point name="P">(5,0)</point>
  <repeat for="$seq" name="rep" valueName="v">
    <point name="Q">($v, 1)</point>
  </repeat>
</graph>
<setup><sequence name="seq" from="1" to="$P.x" /></setup>
<p>Count: <number name="count">$P.x</number></p>
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
 * A text input with an echo beside it and two more in a section further
 * down, which the tests report as scrolled away.
 */
const offscreenDoenetML = `
<section name="top">
  <textInput name="ti" />
  <p name="pNear">Near echo: <text name="nearEcho">$ti.immediateValue</text></p>
</section>
<section name="bottom">
  <p name="pFar1">Far echo: <text name="farEcho1">$ti.immediateValue</text></p>
  <p name="pFar2">Far echo: <text name="farEcho2">$ti.immediateValue</text></p>
</section>
`;

/**
 * As `structuralDoenetML`, but the components a move adds or removes are in a
 * section the tests report as scrolled away.
 */
const structuralOffscreenDoenetML = `
<graph name="g">
  <point name="P">(5,0)</point>
</graph>
<setup><sequence name="seq" from="1" to="$P.x" /></setup>
<section name="list">
  <repeat for="$seq" name="rep" valueName="v">
    <p name="item">Item <number name="n">$v</number></p>
  </repeat>
</section>
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

/** Report `componentIdx` entering or leaving the viewport, as its renderer does. */
async function setVisible(
    core: any,
    componentIdx: number,
    isVisible: boolean,
    isNear?: boolean,
) {
    await core.requestAction({
        componentIdx,
        actionName: "recordVisibilityChange",
        args: isNear === undefined ? { isVisible } : { isVisible, isNear },
    });
}

/** Type `text` into the text input `ti`, as one keystroke's update. */
async function typeText(core: any, inputIdx: number, text: string) {
    await core.requestAction({
        componentIdx: inputIdx,
        actionName: "updateImmediateValue",
        args: { text },
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

describe("an interaction sends what the reader is watching ahead of the rest @group4", () => {
    it("a transient move sends its graph at once, and defers what is off it", async () => {
        vi.useFakeTimers();
        try {
            const { core, innerCore, resolvePathToNodeIdx, batches } =
                await setup();
            const pointIdx = await resolvePathToNodeIdx("Ps[1].P");
            const otherPointIndices = [
                await resolvePathToNodeIdx("Ps[2].P"),
                await resolvePathToNodeIdx("Ps[3].P"),
            ];
            const meanIdx = await resolvePathToNodeIdx("mean");
            const onGraph = new Set(
                renderedDescendants(
                    innerCore,
                    innerCore._components[pointIdx].parentIdx,
                ),
            );

            await movePointTo({
                core,
                componentIdx: pointIdx,
                x: 10,
                transient: true,
            });

            // The dragged point and the points its move restacks, which are
            // on the same graph, go out together — the graph was never
            // reported visible, but it is the one being dragged in.
            expect(batches).toHaveLength(1);
            expect(batches[0].deferred).toBe(false);
            expect(batches[0].componentIndices).toContain(pointIdx);
            for (const idx of otherPointIndices) {
                expect(batches[0].componentIndices).toContain(idx);
            }
            expect(batches[0].componentIndices).not.toContain(meanIdx);

            // The rest is still pending, and arrives once the drag goes quiet.
            await vi.advanceTimersByTimeAsync(500);

            expect(batches).toHaveLength(2);
            expect(batches[1].deferred).toBe(true);
            expect(batches[1].componentIndices).toContain(meanIdx);
            for (const idx of batches[1].componentIndices) {
                expect(onGraph.has(idx), `${idx} is on the graph`).toBe(false);
            }
        } finally {
            vi.useRealTimers();
        }
    });

    it("successive drag steps coalesce into one deferred batch", async () => {
        vi.useFakeTimers();
        try {
            const { core, resolvePathToNodeIdx, batches } = await setup();
            const pointIdx = await resolvePathToNodeIdx("Ps[1].P");
            const meanIdx = await resolvePathToNodeIdx("mean");

            for (const x of [10, 11, 12, 13]) {
                await movePointTo({
                    core,
                    componentIdx: pointIdx,
                    x,
                    transient: true,
                });
            }

            // One batch of the graph per step, nothing off it yet.
            expect(batches).toHaveLength(4);
            for (const batch of batches) {
                expect(batch.deferred).toBe(false);
                expect(batch.componentIndices).toContain(pointIdx);
                expect(batch.componentIndices).not.toContain(meanIdx);
            }

            await vi.advanceTimersByTimeAsync(500);

            // A single deferred batch for all four steps, not one per step.
            expect(batches).toHaveLength(5);
            expect(batches[4].deferred).toBe(true);
        } finally {
            vi.useRealTimers();
        }
    });

    it.each([
        ["reported visible", [true], "step"],
        ["never reported", [], "settle"],
        ["scrolled back out of view", [true, false], "idle"],
    ])(
        "a second graph that is %s follows the drag accordingly",
        async (_label, visibility, bLane) => {
            vi.useFakeTimers();
            try {
                const { core, resolvePathToNodeIdx, batches } =
                    await setup(twoGraphsDoenetML);
                const aIdx = await resolvePathToNodeIdx("A");
                const bIdx = await resolvePathToNodeIdx("B");
                const gBIdx = await resolvePathToNodeIdx("gB");
                const echoIdx = await resolvePathToNodeIdx("echo");

                for (const isVisible of visibility) {
                    await setVisible(core, gBIdx, isVisible);
                }
                batches.length = 0;

                await movePointTo({
                    core,
                    componentIdx: aIdx,
                    x: 5,
                    transient: true,
                });

                expect(batches).toHaveLength(1);
                expect(batches[0].componentIndices).toContain(aIdx);
                expect(batches[0].componentIndices.includes(bIdx)).toBe(
                    bLane === "step",
                );
                expect(batches[0].componentIndices).not.toContain(echoIdx);

                await vi.advanceTimersByTimeAsync(500);

                // A graph that has never reported takes the state of the
                // document around it, which is on screen, so it follows once
                // the drag settles. One reported out of view waits for the
                // idle lane.
                expect(batches).toHaveLength(bLane === "idle" ? 3 : 2);
                expect(batches[1].componentIndices).toContain(echoIdx);
                expect(batches[1].componentIndices.includes(bIdx)).toBe(
                    bLane === "settle",
                );
                if (bLane === "idle") {
                    expect(batches[2].deferred).toBe(true);
                    expect(batches[2].componentIndices).toContain(bIdx);
                }
            } finally {
                vi.useRealTimers();
            }
        },
    );

    it("a visible document or paragraph does not pull its contents into the drag step", async () => {
        // The viewer reports the document itself, and other blocks, as they
        // scroll into view. Only a visible graph widens the drag step.
        vi.useFakeTimers();
        try {
            const { core, innerCore, resolvePathToNodeIdx, batches } =
                await setup(twoGraphsDoenetML);
            const aIdx = await resolvePathToNodeIdx("A");
            const echoIdx = await resolvePathToNodeIdx("echo");
            const echoParagraphIdx = innerCore._components[echoIdx].parentIdx;

            await setVisible(core, innerCore.documentIdx, true);
            await setVisible(core, echoParagraphIdx, true);
            batches.length = 0;

            await movePointTo({
                core,
                componentIdx: aIdx,
                x: 5,
                transient: true,
            });

            expect(batches).toHaveLength(1);
            expect(batches[0].componentIndices).toContain(aIdx);
            expect(batches[0].componentIndices).not.toContain(echoIdx);

            await vi.advanceTimersByTimeAsync(500);
            expect(batches).toHaveLength(2);
            expect(batches[1].componentIndices).toContain(echoIdx);
        } finally {
            vi.useRealTimers();
        }
    });

    it("a drag in a graph nested inside another sends the outer graph at once", async () => {
        vi.useFakeTimers();
        try {
            const { core, resolvePathToNodeIdx, batches } =
                await setup(nestedGraphDoenetML);
            const aIdx = await resolvePathToNodeIdx("A");
            const rIdx = await resolvePathToNodeIdx("R");
            const echoIdx = await resolvePathToNodeIdx("echo");

            await movePointTo({
                core,
                componentIdx: aIdx,
                x: 5,
                transient: true,
            });

            expect(batches).toHaveLength(1);
            expect(batches[0].componentIndices).toContain(aIdx);
            expect(batches[0].componentIndices).toContain(rIdx);
            expect(batches[0].componentIndices).not.toContain(echoIdx);
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
            // reconciles changed rendered children off the graph. Pin that the
            // tree it leaves behind is the same one the undeferred path
            // produces.
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

    it.each([
        ["removes", 2],
        ["adds", 8],
    ])(
        "a drag that %s rendered components on the graph lands with the drag step",
        async (_label, x) => {
            // The priority batch reconciles changed rendered children under
            // the graph, so the graph is complete, and shows the moved values,
            // before the deferred batch carries the off-graph `count`.
            vi.useFakeTimers();
            let priorityTree: number[];
            try {
                const { core, innerCore, resolvePathToNodeIdx, batches } =
                    await setup(structuralOnGraphDoenetML);
                const pointIdx = await resolvePathToNodeIdx("P");
                const graphIdx = await resolvePathToNodeIdx("g");
                const countIdx = await resolvePathToNodeIdx("count");

                await movePointTo({
                    core,
                    componentIdx: pointIdx,
                    x,
                    transient: true,
                });

                expect(batches).toHaveLength(1);
                expect(batches[0].componentIndices).not.toContain(countIdx);
                priorityTree = renderedDescendants(innerCore, graphIdx);

                const stateValues = await core.returnAllStateVariables(
                    false,
                    true,
                );
                const rendererState = innerCore.rendererInstructionBuilder
                    .rendererState as Record<number, any>;
                for (const idx of priorityTree) {
                    const cached = rendererState[idx]?.stateValues;
                    const actual = stateValues[idx]?.stateValues;
                    if (!cached || !actual || !("numericalXs" in cached)) {
                        continue;
                    }
                    expect(
                        cached.numericalXs,
                        `renderer state for component ${idx} is stale`,
                    ).toEqual(actual.numericalXs);
                }

                await vi.advanceTimersByTimeAsync(500);
                expect(batches).toHaveLength(2);
                expect(batches[1].componentIndices).toContain(countIdx);
                expect(renderedDescendants(innerCore, graphIdx)).toEqual(
                    priorityTree,
                );
            } finally {
                vi.useRealTimers();
            }

            const { core, innerCore, resolvePathToNodeIdx } = await setup(
                structuralOnGraphDoenetML,
            );
            const pointIdx = await resolvePathToNodeIdx("P");
            const graphIdx = await resolvePathToNodeIdx("g");
            await movePointTo({
                core,
                componentIdx: pointIdx,
                x,
                transient: false,
            });

            expect(priorityTree).toEqual(
                renderedDescendants(innerCore, graphIdx),
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

describe("updates hold back what is offscreen until core is idle @group4", () => {
    async function setupOffscreen() {
        const result = await setup(offscreenDoenetML);
        const idx = async (name: string) =>
            await result.resolvePathToNodeIdx(name);
        return {
            ...result,
            tiIdx: await idx("ti"),
            topIdx: await idx("top"),
            bottomIdx: await idx("bottom"),
            pFar1Idx: await idx("pFar1"),
            pFar2Idx: await idx("pFar2"),
            nearEchoIdx: await idx("nearEcho"),
            farEcho1Idx: await idx("farEcho1"),
            farEcho2Idx: await idx("farEcho2"),
        };
    }

    it("a keystroke sends what is on screen at once and the rest when idle", async () => {
        vi.useFakeTimers();
        try {
            const c = await setupOffscreen();
            await setVisible(c.core, c.topIdx, true);
            await setVisible(c.core, c.bottomIdx, false);
            c.batches.length = 0;

            await typeText(c.core, c.tiIdx, "hello");

            expect(c.batches).toHaveLength(1);
            expect(c.batches[0].deferred).toBe(false);
            expect(c.batches[0].componentIndices).toContain(c.tiIdx);
            expect(c.batches[0].componentIndices).toContain(c.nearEchoIdx);
            expect(c.batches[0].componentIndices).not.toContain(c.farEcho1Idx);
            expect(c.batches[0].componentIndices).not.toContain(c.farEcho2Idx);

            await vi.advanceTimersByTimeAsync(100);

            const later = c.batches.slice(1);
            expect(later.length).toBeGreaterThan(0);
            expect(later.every((batch) => batch.deferred)).toBe(true);
            const sentLater = later.flatMap((batch) => batch.componentIndices);
            expect(sentLater).toContain(c.farEcho1Idx);
            expect(sentLater).toContain(c.farEcho2Idx);
            expect(
                c.innerCore.updateInfo.componentsToUpdateRenderers.size,
            ).toBe(0);

            const rendererState = c.innerCore.rendererInstructionBuilder
                .rendererState as Record<number, any>;
            expect(rendererState[c.farEcho1Idx].stateValues.text).toBe("hello");
        } finally {
            vi.useRealTimers();
        }
    });

    it("an offscreen paragraph inside a visible section waits too", async () => {
        vi.useFakeTimers();
        try {
            const c = await setupOffscreen();
            await setVisible(c.core, c.bottomIdx, true);
            await setVisible(c.core, c.pFar2Idx, false);
            c.batches.length = 0;

            await typeText(c.core, c.tiIdx, "hello");

            expect(c.batches[0].componentIndices).toContain(c.farEcho1Idx);
            expect(c.batches[0].componentIndices).not.toContain(c.farEcho2Idx);

            await vi.advanceTimersByTimeAsync(100);
            expect(
                c.batches.slice(1).flatMap((batch) => batch.componentIndices),
            ).toContain(c.farEcho2Idx);
        } finally {
            vi.useRealTimers();
        }
    });

    it("a block near the viewport counts as on screen", async () => {
        vi.useFakeTimers();
        try {
            const c = await setupOffscreen();
            await setVisible(c.core, c.bottomIdx, false);
            await setVisible(c.core, c.pFar1Idx, false, true);
            c.batches.length = 0;

            await typeText(c.core, c.tiIdx, "hello");

            expect(c.batches[0].componentIndices).toContain(c.farEcho1Idx);
            expect(c.batches[0].componentIndices).not.toContain(c.farEcho2Idx);
        } finally {
            vi.useRealTimers();
        }
    });

    it("what scrolls into view goes out before the rest of the idle lane", async () => {
        vi.useFakeTimers();
        try {
            const c = await setupOffscreen();
            await setVisible(c.core, c.bottomIdx, false);
            c.batches.length = 0;

            await typeText(c.core, c.tiIdx, "hello");
            expect(c.batches).toHaveLength(1);

            // One component per chunk, so the order they go out in shows.
            c.innerCore.rendererInstructionBuilder._idleRendererChunkSize = 1;
            await setVisible(c.core, c.pFar2Idx, true);
            await vi.advanceTimersByTimeAsync(200);

            const order = c.batches
                .slice(1)
                .flatMap((batch) => batch.componentIndices);
            expect(order).toContain(c.farEcho1Idx);
            expect(order.indexOf(c.farEcho2Idx)).toBeLessThan(
                order.indexOf(c.farEcho1Idx),
            );
        } finally {
            vi.useRealTimers();
        }
    });

    it("the idle lane waits while core is busy", async () => {
        vi.useFakeTimers();
        try {
            const c = await setupOffscreen();
            await setVisible(c.core, c.bottomIdx, false);
            c.batches.length = 0;

            await typeText(c.core, c.tiIdx, "hello");
            expect(c.batches).toHaveLength(1);

            c.innerCore.processQueue.processing = true;
            await vi.advanceTimersByTimeAsync(100);
            expect(c.batches).toHaveLength(1);

            c.innerCore.processQueue.processing = false;
            await vi.advanceTimersByTimeAsync(100);
            expect(c.batches.length).toBeGreaterThan(1);
            expect(
                c.innerCore.updateInfo.componentsToUpdateRenderers.size,
            ).toBe(0);
        } finally {
            vi.useRealTimers();
        }
    });

    it("a drag holds the idle lane until it settles", async () => {
        vi.useFakeTimers();
        try {
            const c = await setupOffscreen();
            await setVisible(c.core, c.bottomIdx, false);
            c.batches.length = 0;

            await typeText(c.core, c.tiIdx, "hello");
            c.innerCore.rendererInstructionBuilder.scheduleDeferredRendererUpdate();

            await vi.advanceTimersByTimeAsync(100);
            expect(c.batches).toHaveLength(1);

            await vi.advanceTimersByTimeAsync(500);
            expect(
                c.batches.slice(1).flatMap((batch) => batch.componentIndices),
            ).toContain(c.farEcho1Idx);
        } finally {
            vi.useRealTimers();
        }
    });

    it("flushing pending renderers sends everything held back", async () => {
        // What a save that includes renderer state does first.
        vi.useFakeTimers();
        try {
            const c = await setupOffscreen();
            await setVisible(c.core, c.bottomIdx, false);
            c.batches.length = 0;

            await typeText(c.core, c.tiIdx, "hello");
            await c.innerCore.flushPendingRenderers();

            expect(c.batches).toHaveLength(2);
            expect(c.batches[1].componentIndices).toContain(c.farEcho1Idx);
            expect(c.batches[1].componentIndices).toContain(c.farEcho2Idx);
            expect(
                c.innerCore.updateInfo.componentsToUpdateRenderers.size,
            ).toBe(0);
            expect(
                c.innerCore.rendererInstructionBuilder._idleRendererTimeout,
            ).toBe(null);
        } finally {
            vi.useRealTimers();
        }
    });

    it("a core terminated with the idle lane pending sends nothing more", async () => {
        vi.useFakeTimers();
        try {
            const c = await setupOffscreen();
            await setVisible(c.core, c.bottomIdx, false);
            c.batches.length = 0;

            await typeText(c.core, c.tiIdx, "hello");
            expect(
                c.innerCore.rendererInstructionBuilder._idleRendererTimeout,
            ).not.toBe(null);
            const sentBeforeTerminate = c.batches.length;

            await (c.core as any).terminate();
            await vi.advanceTimersByTimeAsync(2000);
            expect(c.batches).toHaveLength(sentBeforeTerminate);
        } finally {
            vi.useRealTimers();
        }
    });

    it.each([
        ["removes", 2],
        ["adds", 8],
    ])(
        "a move that %s offscreen rendered components leaves the same tree as an undeferred move",
        async (_label, x) => {
            vi.useFakeTimers();
            let idleTree: number[];
            try {
                const { core, innerCore, resolvePathToNodeIdx, batches } =
                    await setup(structuralOffscreenDoenetML);
                const pointIdx = await resolvePathToNodeIdx("P");
                const graphIdx = await resolvePathToNodeIdx("g");
                const listIdx = await resolvePathToNodeIdx("list");
                await setVisible(core, graphIdx, true);
                await setVisible(core, listIdx, false);
                batches.length = 0;

                await movePointTo({
                    core,
                    componentIdx: pointIdx,
                    x,
                    transient: false,
                });

                expect(batches[0].componentIndices).toContain(pointIdx);
                expect(batches[0].componentIndices).not.toContain(listIdx);

                await vi.advanceTimersByTimeAsync(500);

                idleTree = renderedDescendants(
                    innerCore,
                    innerCore.documentIdx,
                );
                expect(
                    innerCore.updateInfo.componentsToUpdateRenderers.size,
                ).toBe(0);
                expect(
                    innerCore.rendererInstructionBuilder
                        .componentsWithChangedChildrenToRender.size,
                ).toBe(0);
            } finally {
                vi.useRealTimers();
            }

            const { core, innerCore, resolvePathToNodeIdx } = await setup(
                structuralOffscreenDoenetML,
            );
            const pointIdx = await resolvePathToNodeIdx("P");
            await movePointTo({
                core,
                componentIdx: pointIdx,
                x,
                transient: false,
            });

            expect(idleTree).toEqual(
                renderedDescendants(innerCore, innerCore.documentIdx),
            );
        },
    );
});
