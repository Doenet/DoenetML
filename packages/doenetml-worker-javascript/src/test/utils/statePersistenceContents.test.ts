import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "./test-core";
import { movePoint } from "./actions";

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
