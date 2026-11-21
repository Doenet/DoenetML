import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

vi.stubGlobal("postMessage", vi.fn());
vi.mock("hyperformula");

/**
 * Every random number the document draws is 0, so the random draws a select
 * makes first always land on the same value, and on the same combination.
 * That reaches what a select does when its random draws find nothing valid,
 * which for the selects here, with real random numbers, happens with a
 * chance below 10^(-30).
 */
vi.mock("seedrandom", () => {
    function alea() {
        return () => 0;
    }
    return { default: { alea } };
});

async function load(doenetML: string) {
    const { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });
    const stateVariables = await core.returnAllStateVariables(false, true);
    const s = stateVariables[await resolvePathToNodeIdx("s")];
    const diagnostics = getDiagnosticsByType(core);
    return {
        errors: diagnostics.errors.map((e) => e.code),
        infos: diagnostics.infos.map((e) => e.code),
        selectedValues: s.stateValues.selectedValues,
    };
}

/**
 * A choice never fails by chance (SEL-4, D39): when the random draws find
 * no valid selection, the select draws among the valid ones exactly. Before,
 * each of these failed (`doenet-e0052`, `doenet-e0053`, `doenet-i0057`).
 */
describe("A choice whose random draws find nothing still selects @group4", () => {
    it("<selectFromSequence>: a value drawn again 100 times, without replacement", async () => {
        // the second value draws the first one each time, so the whole
        // selection is drawn from the list of valid values
        const { errors, infos, selectedValues } = await load(
            `<selectFromSequence name="s" from="1" to="10" numToSelect="2" coprime/>`,
        );
        expect(errors).eqls([]);
        // only that the number of variants can't be counted
        expect(infos).eqls(["doenet-i0026"]);
        expect(selectedValues).eqls([2, 3]);
    });

    it("<selectFromSequence>: an excluded combination drawn 200 times", async () => {
        // every draw is (1, 1), so the select takes a combination from
        // all the valid ones
        for (const [doenetML, first] of [
            [
                `<selectFromSequence name="s" from="1" to="10" numToSelect="2" withReplacement excludeCombinations="(1 1)"/>`,
                [1, 2],
            ],
            [
                `<selectFromSequence name="s" type="letters" from="a" to="e" numToSelect="2" withReplacement excludeCombinations="(a a)"/>`,
                ["a", "b"],
            ],
        ] as const) {
            const { errors, infos, selectedValues } = await load(doenetML);
            expect(errors, doenetML).eqls([]);
            // only that unique variants aren't worked out with
            // `excludeCombinations`
            expect(infos, doenetML).eqls(["doenet-i0032"]);
            expect(selectedValues, doenetML).eqls(first);
        }
    });

    it("<selectFromSequence coprime>: a combination with a common factor drawn 200 times", async () => {
        // every draw is (2, 2), so the select draws among the coprime ones
        const { errors, infos, selectedValues } = await load(
            `<selectFromSequence name="s" from="2" to="10" numToSelect="2" withReplacement coprime/>`,
        );
        expect(errors).eqls([]);
        expect(infos).eqls(["doenet-i0026"]);
        expect(selectedValues).eqls([2, 3]);
    });

    it("<selectPrimeNumbers>: an excluded combination drawn 200 times", async () => {
        // every draw is (3, 5)
        const { errors, infos, selectedValues } = await load(
            `<selectPrimeNumbers name="s" from="2" to="20" numToSelect="2" excludeCombinations="(3 5)"/>`,
        );
        expect(errors).eqls([]);
        expect(infos).eqls(["doenet-i0032"]);
        expect(selectedValues).eqls([2, 3]);
    });
});
