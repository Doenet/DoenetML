import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";
import { clearReplacementCountsFrom } from "../../components/abstract/Copy";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Doenet/DoenetML#2417: when a copy of several sources deletes the
 * replacements of a source and those after it, to remake them, it clears
 * its counts for those sources. It cleared the counts for the first sources
 * instead, indexing by position in a slice of the counts.
 */
describe("A copy of several sources @group1", async () => {
    it("clears the counts from the source it remakes on", () => {
        const workspace = {
            numReplacementsBySource: [1, 2, 3, 4],
            numNonStringReplacementsBySource: [1, 1, 2, 2],
        };
        clearReplacementCountsFrom(workspace, 2);
        expect(workspace).eqls({
            numReplacementsBySource: [1, 2, 0, 0],
            numNonStringReplacementsBySource: [1, 1, 0, 0],
        });
    });

    // `$g.coords` has three sources: the first point, the repeat and the
    // last point. When `n` changes, the copy remakes the repeat's
    // replacements and the last point's, clearing the counts from the middle
    // source on. The old indexing cleared the first two sources' counts
    // instead. What is rendered is the same either way, so this checks that
    // the replacements stay in order, not that the old code failed.
    it("keeps its replacements in order as a middle source grows and shrinks", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<mathInput name="n" prefill="1"/>
<group name="g"><point>(0,0)</point><repeatForSequence length="$n" valueName="v"><point>($v,1)</point></repeatForSequence><point>(9,9)</point></group>
<p name="coords">$g.coords</p>`,
        });
        const nIdx = await resolvePathToNodeIdx("n");
        const coordsIdx = await resolvePathToNodeIdx("coords");

        async function coords() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[coordsIdx].stateValues.text;
        }

        function expected(n: number) {
            const points = ["(0, 0)"];
            for (let v = 1; v <= n; v++) {
                points.push(`(${v}, 1)`);
            }
            points.push("(9, 9)");
            // The copy's replacements are separate maths, with nothing
            // between them in the paragraph.
            return points.join("");
        }

        expect(await coords()).eq(expected(1));

        for (const n of [3, 0, 2, 4, 1]) {
            await updateMathInputValue({
                latex: `${n}`,
                componentIdx: nIdx,
                core,
            });
            expect([n, await coords()]).eqls([n, expected(n)]);
        }
    });
});
