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

    // `$r.coords` has a source for each point. When `n` changes, the
    // sources from the first new or removed point on are remade, after the
    // ones before it are kept.
    it("keeps its replacements in order as later sources come and go", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<mathInput name="n" prefill="2"/>
<repeatForSequence name="r" length="$n" valueName="v"><point>($v,1)</point><point>($v,2)</point></repeatForSequence>
<p name="coords">$r.coords</p>`,
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
            const points: string[] = [];
            for (let v = 1; v <= n; v++) {
                points.push(`(${v}, 1)`, `(${v}, 2)`);
            }
            return points.join(", ");
        }

        expect(await coords()).eq(expected(2));

        for (const n of [3, 0, 1, 4, 2]) {
            await updateMathInputValue({
                latex: `${n}`,
                componentIdx: nIdx,
                core,
            });
            expect([n, await coords()]).eqls([n, expected(n)]);
        }
    });
});
