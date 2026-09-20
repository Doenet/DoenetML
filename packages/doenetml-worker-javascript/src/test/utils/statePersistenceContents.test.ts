import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "./test-core";
import {
    movePoint,
    updateMathInputValue,
    updateTextInputValue,
} from "./actions";

// What a reader's saved state costs should track what the reader did, not how
// big the document is. It did not: every essential value an ordinary
// definition computed was recorded too, and the reader's first interaction
// anywhere flushed that whole document-wide bag into the saved state. So
// working one exercise on a page persisted state for every other exercise --
// values copied verbatim from the document, `null`s, and `＿` placeholders,
// none of it the reader's and none of it anything a fresh load would not
// recompute (Doenet/DoenetML#1940).
//
// That matters beyond tidiness: a SCORM 1.2 package may store only 4096
// characters of `cmi.suspend_data`.

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/** One exercise's worth of the shape #1940 measured: a draggable point
 *  constrained to a function, whose position is the only thing a reader owns. */
function exercises(count: number) {
    return Array.from(
        { length: count },
        (_, i) => `
<graph>
  <function name="f${i}">-0.25*x^3+1.5*x+1</function>
  <point name="P${i}"><constrainTo>$f${i}</constrainTo></point>
</graph>`,
    ).join("\n");
}

async function dragFirstPointAndSave(copies: number) {
    const { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
        doenetML: exercises(copies),
    });

    await movePoint({
        componentIdx: await resolvePathToNodeIdx("P0"),
        x: 1.7,
        y: 0.4,
        core,
    });
    await core.saveImmediately();

    const saved = JSON.parse(scoreState.state as string);
    return {
        saved,
        entries: Object.keys(saved).filter((key) => !key.startsWith("__"))
            .length,
        bytes: (scoreState.state as string).length,
    };
}

describe("saved state is the reader's work @group4", () => {
    it("does not grow with exercises the reader never touched", async () => {
        const one = await dragFirstPointAndSave(1);
        const five = await dragFirstPointAndSave(5);

        expect(
            one.entries,
            "dragging the point saved nothing, so this proves nothing",
        ).greaterThan(0);

        // The whole claim, in one line: four untouched copies cost nothing.
        // Before, each contributed its own entries -- the function's AST over
        // again, and `null`s -- and the five-copy document cost five times the
        // one-copy document.
        expect(five.entries).eq(one.entries);
        expect(five.bytes).eq(one.bytes);
    });

    it("saves nothing at all until the reader acts", async () => {
        const { core, scoreState } = await createTestCore({
            doenetML: exercises(5),
        });
        await core.saveImmediately();

        expect(Object.keys(JSON.parse(scoreState.state as string))).eqls([]);
    });

    it("keeps a reader's work through a reload", async () => {
        // The counterweight to the two above: it is easy to make saved state
        // small by saving too little. A dragged point lands on the curve rather
        // than under the pointer, and has to come back there.
        const doenetML = exercises(5);
        const first = await createTestCore({ doenetML });
        await movePoint({
            componentIdx: await first.resolvePathToNodeIdx("P0"),
            x: 1.7,
            y: 0.4,
            core: first.core,
        });

        async function positionOf(core: any, idx: number) {
            return (await core.returnAllStateVariables(false, true))[
                idx
            ].stateValues.xs.map((x: any) => x.evaluate_to_constant());
        }

        const moved = await positionOf(
            first.core,
            await first.resolvePathToNodeIdx("P0"),
        );
        expect(moved[0]).closeTo(1.7, 1e-12);
        expect(moved[1]).closeTo(2.32175, 1e-12);

        await first.core.saveImmediately();
        const second = await createTestCore({
            doenetML,
            initialState: first.scoreState.state as string,
        });

        expect(
            await positionOf(
                second.core,
                await second.resolvePathToNodeIdx("P0"),
            ),
        ).eqls(moved);
    });
});

describe("what a rebuild cannot recompute is still saved @group4", () => {
    // The filter above drops what a definition computed, on the premise that a
    // fresh load of the same document under the same variant recomputes it.
    // `<sampleRandomNumbers>` breaks that premise: `variantDeterminesSeed` is
    // false by default, so it draws from a date-seeded generator and its values
    // exist nowhere but in the saved state. Dropping them changes the numbers
    // under a reader who reloads — the question they were answering becomes a
    // different question.
    const DOC = `
<textInput name="ti" />
<sampleRandomNumbers name="sampled" numSamples="3" from="0" to="1" />
<selectRandomNumbers name="selected" numToSelect="3" from="0" to="1" />`;

    async function drawsOf(core: any, resolve: any, name: string) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        return stateVariables[await resolve(name)].stateValues.sampledValues;
    }

    it("a date-seeded sampler draws the same numbers after a reload", async () => {
        const first = await createTestCore({ doenetML: DOC });
        const drawn = await drawsOf(
            first.core,
            first.resolvePathToNodeIdx,
            "sampled",
        );
        expect(drawn.length).eq(3);

        // The reader touches something else entirely: the sampler's values are
        // not theirs, which is exactly why the filter would drop them.
        await updateTextInputValue({
            text: "worked",
            componentIdx: await first.resolvePathToNodeIdx("ti"),
            core: first.core,
        });
        await first.core.saveImmediately();

        const second = await createTestCore({
            doenetML: DOC,
            initialState: first.scoreState.state as string,
        });
        expect(
            await drawsOf(second.core, second.resolvePathToNodeIdx, "selected"),
            "the variant-seeded selection did not reproduce, so the sampler comparison below proves nothing",
        ).eqls(
            await drawsOf(first.core, first.resolvePathToNodeIdx, "selected"),
        );
        expect(
            await drawsOf(second.core, second.resolvePathToNodeIdx, "sampled"),
        ).eqls(drawn);
    });

    it("but a selection the variant determines still costs nothing", async () => {
        // The counterweight: `<selectRandomNumbers>` draws from the variant's
        // own generator, so a rebuild reproduces it and there is nothing to
        // persist. Without this, "save what a rebuild cannot reproduce" would
        // be free to decay back into saving everything.
        const { core, resolvePathToNodeIdx, scoreState } = await createTestCore(
            { doenetML: DOC },
        );
        await updateTextInputValue({
            text: "worked",
            componentIdx: await resolvePathToNodeIdx("ti"),
            core,
        });
        await core.saveImmediately();

        const keys = Object.keys(JSON.parse(scoreState.state as string));
        expect(keys.sort()).eqls(["/~sampled", "/~ti"]);
    });
});

describe("the reader's work is not only what they typed @group4", () => {
    // The filter above is stated as "drop what is known to be only a
    // definition's", so what it keeps is everything a reader's own action
    // wrote. That set is wider than the inputs and the dragged point the tests
    // above cover: revealing a solution, opening a hint, turning a page, moving
    // a slider, panning a graph and writing in a code editor are all work a
    // reader would expect back, and nothing else in the suite checks that any
    // of them survives a reload.
    //
    // None of these is currently classified as a definition's work, so none of
    // them discriminates between the filter's two sets today. What each one
    // catches is the change that would make one of them so — a component whose
    // state starts being set in a definition, which is exactly how this loss
    // would arrive: silently, on a reader who reloads (Doenet/DoenetML#1940).
    const CASES: {
        name: string;
        doenetML: string;
        /** The action the reader takes, and what it should leave behind. */
        act: (t: any) => Promise<void>;
        check: (stateValues: Record<string, any>, idx: number) => void;
        /** The component whose restored state the check reads. */
        target: string;
    }[] = [
        {
            name: "a revealed solution stays revealed",
            doenetML: `<problem><answer name="a">x</answer><solution name="sol"><p>because</p></solution></problem>`,
            target: "sol",
            act: async (t) => {
                await t.core.requestAction({
                    componentIdx: await t.resolvePathToNodeIdx("sol"),
                    actionName: "revealSolution",
                    args: {},
                });
            },
            check: (stateValues) => expect(stateValues.open).eq(true),
        },
        {
            name: "an opened hint stays open",
            doenetML: `<hint name="h"><title>Hint</title><p>try this</p></hint>`,
            target: "h",
            act: async (t) => {
                await t.core.requestAction({
                    componentIdx: await t.resolvePathToNodeIdx("h"),
                    actionName: "revealHint",
                    args: {},
                });
            },
            check: (stateValues) => expect(stateValues.open).eq(true),
        },
        {
            name: "the page a paginator was left on",
            doenetML: `<paginator name="pg"><section name="s1"><p>one</p></section><section name="s2"><p>two</p></section></paginator>`,
            target: "pg",
            act: async (t) => {
                await t.core.requestAction({
                    componentIdx: await t.resolvePathToNodeIdx("pg"),
                    actionName: "setPage",
                    args: { number: 2 },
                });
            },
            check: (stateValues) => expect(stateValues.currentPage).eq(2),
        },
        {
            name: "where a slider was left",
            doenetML: `<slider name="s" from="0" to="10" />`,
            target: "s",
            act: async (t) => {
                await t.core.requestAction({
                    componentIdx: await t.resolvePathToNodeIdx("s"),
                    actionName: "changeValue",
                    args: { value: 4 },
                });
            },
            check: (stateValues) => expect(stateValues.value).eq(4),
        },
        {
            name: "a graph the reader panned",
            doenetML: `<graph name="g"><point name="P">(1,2)</point></graph>`,
            target: "g",
            act: async (t) => {
                await t.core.requestAction({
                    componentIdx: await t.resolvePathToNodeIdx("g"),
                    actionName: "changeAxisLimits",
                    args: { xMin: -3, xMax: 7, yMin: -4, yMax: 6 },
                });
            },
            check: (stateValues) => {
                expect(stateValues.xMin).eq(-3);
                expect(stateValues.yMax).eq(6);
            },
        },
        {
            name: "what a reader wrote in a code editor",
            doenetML: `<codeEditor name="ce" />`,
            target: "ce",
            act: async (t) => {
                const componentIdx = await t.resolvePathToNodeIdx("ce");
                await t.core.requestAction({
                    componentIdx,
                    actionName: "updateImmediateValue",
                    args: { text: "written by the reader" },
                });
                await t.core.requestAction({
                    componentIdx,
                    actionName: "updateValue",
                    args: {},
                });
            },
            check: (stateValues) =>
                expect(stateValues.value).eq("written by the reader"),
        },
    ];

    for (const { name, doenetML, act, check, target } of CASES) {
        it(name, async () => {
            const first = await createTestCore({ doenetML });
            await act(first);
            await first.core.saveImmediately();

            const saved = first.scoreState.state as string;
            expect(
                Object.keys(JSON.parse(saved)),
                "the reader's action saved nothing, so the reload below proves nothing",
            ).not.eqls([]);

            const second = await createTestCore({
                doenetML,
                initialState: saved,
            });
            const idx = await second.resolvePathToNodeIdx(target);
            const stateVariables = await second.core.returnAllStateVariables(
                false,
                true,
            );
            check(stateVariables[idx].stateValues, idx);
        });
    }
});

describe("an update that deletes a component it wrote to is still saved whole @group4", () => {
    // Merging an update's changes read each written component's `stateId` off
    // the component. A composite that recreates its replacements deletes them
    // during the very update that wrote to them -- `<sort>` does it whenever
    // it rebuilds rather than moving the replacements it has, which is what
    // the document below does -- so by the time the merge ran the component
    // was gone and the read threw. `performAction` catches, so nothing
    // surfaced: the throw simply took the rest of `performUpdate` with it,
    // including the writes not yet merged and the save the call would have
    // scheduled.
    //
    // Typing into a position of a `<sort>` is the reader-visible form. The
    // typing reorders the list, the reorder corrects the input to whatever now
    // sits in the position it is bound to, and that correction is on the far
    // side of the throw -- so the input's saved state stayed at what the reader
    // typed and a reload showed them a value they were no longer looking at.
    const DOC = `
    <sort name="s">5 3 1</sort>
    <p name="pList">$s</p>
    <mathInput name="mi" bindValueTo="$s[1]" />
  `;

    async function inputAndList({ core, resolvePathToNodeIdx }: any) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        const input = stateVariables[await resolvePathToNodeIdx("mi")];
        return {
            shown: input.stateValues.rawRendererValue,
            value: input.stateValues.value.toString(),
            list: stateVariables[
                await resolvePathToNodeIdx("pList")
            ].activeChildren.map((child: any) =>
                stateVariables[child.componentIdx].stateValues.value.toString(),
            ),
        };
    }

    it("reloads a `<sort>` showing what the reader was looking at", async () => {
        const first = await createTestCore({ doenetML: DOC });
        await updateMathInputValue({
            latex: "7",
            componentIdx: await first.resolvePathToNodeIdx("mi"),
            core: first.core,
        });

        const live = await inputAndList(first);
        // Typing 7 into the smallest of 5, 3, 1 leaves 3 the smallest, so the
        // box the reader is looking at ends up showing 3, not the 7 they typed.
        expect(live).eqls({ shown: "3", value: "3", list: ["3", "5", "7"] });

        await first.core.saveImmediately();
        const second = await createTestCore({
            doenetML: DOC,
            initialState: first.scoreState.state as string,
        });

        expect(await inputAndList(second)).eqls(live);
    });
});
