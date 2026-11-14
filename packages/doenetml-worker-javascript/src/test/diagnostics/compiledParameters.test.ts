import { afterEach, describe, expect, it, vi } from "vitest";
import seedrandom from "seedrandom";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateMathInputValue } from "../utils/actions";
import { setBoundsObserver } from "../../utils/dast/choiceFeasibilityAtLoad";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/** The state of the named components, after loading `doenetML`. */
async function load(
    doenetML: string,
    {
        requestedVariantIndex = 1,
        requestedVariant,
        initialState,
    }: {
        requestedVariantIndex?: number;
        requestedVariant?: any;
        initialState?: any;
    } = {},
) {
    const result = await createTestCore({
        doenetML,
        requestedVariantIndex,
        requestedVariant,
        initialState,
    });
    const stateVariables = await result.core.returnAllStateVariables(
        false,
        true,
    );
    const sv = async (name: string) =>
        stateVariables[await result.resolvePathToNodeIdx(name)]?.stateValues;
    const generatedVariantInfo = JSON.parse(
        JSON.stringify(
            stateVariables[await result.resolvePathToNodeIdx("_document1")]
                .stateValues.generatedVariantInfo,
        ),
    );
    return {
        ...result,
        sv,
        codes: getDiagnosticsByType(result.core).errors.map((d) => d.code),
        generatedVariantInfo,
    };
}

/**
 * A selection whose parameters read the variant or an iteration holds each
 * compiled (`utils/selectionParameters.ts`), and computes it, when the
 * document runs, with the function the load-time check proved it with: the
 * two can't read a parameter differently.
 */
describe("A selection computes a compiled parameter as the check does @group4", () => {
    const variants = [1, 2, 3, 4, 5, 6];

    it("arithmetic of another selection's value, in an attribute and through a <number>", async () => {
        for (const requestedVariantIndex of variants) {
            const { sv, codes } = await load(
                `<selectFromSequence name="a" from="3" to="6"/>
<number name="m">$a + 1</number>
<selectFromSequence name="s" to="$a+2" numToSelect="$m" exclude="$a 11"/>
<selectFromSequence name="t" to="12" numToSelect="$a/2"/>`,
                { requestedVariantIndex },
            );
            expect(codes).eqls([]);
            const a = (await sv("a")).selectedValues[0];
            const s = await sv("s");
            expect(s.specifiedTo).eq(a + 2);
            expect(s.specifiedNumToSelect).eq(a + 1);
            expect(s.specifiedExclude).eqls([a, 11]);
            expect(s.selectedValues).toHaveLength(a + 1);
            expect(s.selectedValues).not.toContain(a);
            // an integer parameter rounds as the template's `round` does
            expect((await sv("t")).specifiedNumToSelect).eq(Math.round(a / 2));
        }
    });

    it("a prime's range, a <select>'s count, and a boolean read from a selection", async () => {
        for (const requestedVariantIndex of variants) {
            const { sv, codes } = await load(
                `<selectFromSequence name="a" from="2" to="3"/>
<select name="b"><option><boolean>true</boolean></option><option><boolean>false</boolean></option></select>
<selectPrimeNumbers name="p" to="$a*10" numToSelect="$a"/>
<select name="s" numToSelect="$a" withReplacement="$b">u v w</select>`,
                { requestedVariantIndex },
            );
            expect(codes).eqls([]);
            const a = (await sv("a")).selectedValues[0];
            const p = await sv("p");
            expect(p.to).eq(a * 10);
            expect(p.selectedValues).toHaveLength(a);
            const s = await sv("s");
            expect(s.specifiedNumToSelect).eq(a);
            expect(typeof s.withReplacement).eq("boolean");
        }
    });

    it("a letters sequence reads the letter a selection holds", async () => {
        for (const requestedVariantIndex of variants) {
            const { sv, codes } = await load(
                `<selectFromSequence name="a" type="letters" from="c" to="e"/>
<selectFromSequence name="s" type="letters" from="a" to="$a" numToSelect="3"/>`,
                { requestedVariantIndex },
            );
            expect(codes).eqls([]);
            const a = (await sv("a")).selectedValues[0];
            const s = await sv("s");
            expect(s.specifiedTo).eq(a);
            expect(s.selectedValues).toHaveLength(3);
        }
    });

    it("a text read as a number is the text parsed as math", async () => {
        for (const requestedVariantIndex of variants) {
            const { sv, codes } = await load(
                `<select name="a" type="text">2 2+1</select>
<selectFromSequence name="s" to="5" numToSelect="$a" exclude="$a"/>
<setup><module name="m"><moduleAttributes><text name="k">2</text></moduleAttributes><selectFromSequence name="t" to="$k+$a" numToSelect="$k"/></module></setup>
<module name="m1" copy="$m"/><module name="m2" copy="$m" k="3"/>`,
                { requestedVariantIndex },
            );
            expect(codes).eqls([]);
            const a = (await sv("s")).specifiedNumToSelect;
            expect([2, 3]).toContain(a);
            const s = await sv("s");
            expect(s.specifiedExclude).eqls([a]);
            expect(s.selectedValues).toHaveLength(a);
            expect(s.selectedValues).not.toContain(a);
            for (const [name, k] of [
                ["m1.t", 2],
                ["m2.t", 3],
            ] as const) {
                const t = await sv(name);
                expect(t.specifiedTo).eq(k + a);
                expect(t.selectedValues).toHaveLength(k);
            }
        }
    });

    it("a math sequence excludes a value read from a selection", async () => {
        for (const requestedVariantIndex of variants) {
            const { sv, codes } = await load(
                `<selectFromSequence name="a" from="1" to="3"/>
<selectFromSequence name="s" type="math" from="1" to="4" exclude="$a" numToSelect="3"/>`,
                { requestedVariantIndex },
            );
            expect(codes).eqls([]);
            const a = (await sv("a")).selectedValues[0];
            const s = await sv("s");
            expect(s.selectedValues.map((v: any) => v.tree).sort()).eqls(
                [1, 2, 3, 4].filter((v) => v !== a),
            );
        }
    });

    it("in each iteration of a repeat, and in each copy of a module", async () => {
        const { sv, codes } = await load(
            `<repeatForSequence name="r" to="3" indexName="i"><selectFromSequence name="s" to="$i+2" numToSelect="$i"/></repeatForSequence>
<setup><module name="m"><moduleAttributes><integer name="k">2</integer></moduleAttributes><select name="s" numToSelect="$k">a b c</select></module></setup>
<module name="m1" copy="$m"/><module name="m2" copy="$m" k="3"/>`,
        );
        expect(codes).eqls([]);
        for (const i of [1, 2, 3]) {
            const s = await sv(`r[${i}].s`);
            expect(s.specifiedTo).eq(i + 2);
            expect(s.selectedValues).toHaveLength(i);
        }
        expect((await sv("m1.s")).specifiedNumToSelect).eq(2);
        expect((await sv("m2.s")).specifiedNumToSelect).eq(3);
    });

    it("a copy chooses again from the same parameters, and an extend shows the same selection", async () => {
        for (const requestedVariantIndex of variants) {
            const { sv, codes } = await load(
                `<selectFromSequence name="a" from="3" to="6"/>
<selectFromSequence name="s" to="$a+2" numToSelect="2"/>
<selectFromSequence name="c" copy="$s"/>
<selectFromSequence name="e" extend="$s"/>`,
                { requestedVariantIndex },
            );
            expect(codes).eqls([]);
            const a = (await sv("a")).selectedValues[0];
            const s = await sv("s");
            const c = await sv("c");
            expect(c.specifiedTo).eq(a + 2);
            expect(c.selectedValues).toHaveLength(2);
            expect((await sv("e")).selectedValues).eqls(s.selectedValues);
        }
    });

    it("keeps its selection and its parameters through a reload of its state", async () => {
        const doenetML = `<mathInput name="mi"/>
<selectFromSequence name="a" from="3" to="6"/>
<selectFromSequence name="s" to="$a+2" numToSelect="$a-1"/>`;
        const first = await load(doenetML, { requestedVariantIndex: 3 });
        expect(first.codes).eqls([]);
        await updateMathInputValue({
            latex: "x",
            componentIdx: await first.resolvePathToNodeIdx("mi"),
            core: first.core,
        });
        await first.core.saveImmediately();
        const saved = first.scoreState.state;
        expect(saved).toBeTruthy();
        const before = await first.sv("s");
        const reloaded = await load(doenetML, {
            requestedVariant: first.generatedVariantInfo,
            initialState: saved,
        });
        expect(reloaded.codes).eqls([]);
        const after = await reloaded.sv("s");
        expect(after.selectedValues).eqls(before.selectedValues);
        expect(after.specifiedTo).eq(before.specifiedTo);
        expect(after.specifiedNumToSelect).eq(before.specifiedNumToSelect);
    });
});

/**
 * When the bounds show a selection can always select (with an index with no
 * end, or too many combinations to go through), every combination of values
 * its parameters can take agrees: each parameter is within the bounds found
 * for it, and the exact test, the selection's own
 * (`utils/selectionFailure.ts`), finds nothing that keeps it from selecting.
 */
describe("A pass by bounds is never contradicted by the exact check @group4", () => {
    afterEach(() => setBoundsObserver(undefined));

    /** Random documents whose selections the bounds decide. */
    function documents(random: () => number) {
        const pick = <T>(xs: T[]) => xs[Math.floor(random() * xs.length)];
        const int = (lo: number, hi: number) =>
            lo + Math.floor(random() * (hi - lo + 1));
        const terms = [
            "$i",
            "$a",
            "$i + $a",
            "2$i",
            "$i/2",
            "floor($i/2)",
            "ceil($i/3)",
            "round($a/2)",
            "min($i, $a)",
            "max($i, 3)",
            "abs($a - $i)",
            "$i*$a",
            "-$i",
        ];
        const docs: string[] = [];
        for (let n = 0; n < 40; n++) {
            const from = pick(["1", "$i", `$i - ${int(0, 3)}`, "-$a"]);
            const to = `${pick(terms)} + ${int(0, 30)}`;
            const numToSelect = pick([
                "1",
                String(int(1, 3)),
                "min($i, 2)",
                "floor($a/3)",
                "1",
            ]);
            const extra = pick([
                "",
                ` exclude="${int(1, 5)}"`,
                ` exclude="$a"`,
                ` withReplacement`,
                ` step="${pick(["1", "2", "3"])}"`,
            ]);
            docs.push(`<mathInput name="n" prefill="2"/>
<selectFromSequence name="a" from="${int(1, 3)}" to="${int(4, 9)}"/>
<repeatForSequence to="$n" indexName="i"><selectFromSequence from="${from}" to="${to}" numToSelect="${numToSelect}"${extra}/></repeatForSequence>`);
            docs.push(`<mathInput name="n" prefill="2"/>
<selectFromSequence name="a" from="${int(1, 3)}" to="${int(4, 9)}"/>
<repeatForSequence to="$n" indexName="i"><selectPrimeNumbers from="${pick(["2", "$i", "$a"])}" to="${to}" numToSelect="${numToSelect}"/></repeatForSequence>`);
        }
        return docs;
    }

    it("on random documents", async () => {
        const random = seedrandom("bounds");
        let passes = 0;
        let samples = 0;
        for (const doenetML of documents(random)) {
            const observed: Parameters<
                Parameters<typeof setBoundsObserver>[0] & {}
            >[0][] = [];
            setBoundsObserver((pass) => observed.push(pass));
            await createTestCore({ doenetML });
            setBoundsObserver(undefined);
            for (const pass of observed) {
                passes++;
                for (let k = 0; k < 200; k++) {
                    const found = pass.sample(random);
                    if (!found) {
                        continue;
                    }
                    samples++;
                    for (const { value, lo, hi } of found.values) {
                        if (!Number.isNaN(value)) {
                            expect(value, doenetML).toBeGreaterThanOrEqual(
                                lo - 1e-9,
                            );
                            expect(value, doenetML).toBeLessThanOrEqual(
                                hi + 1e-9,
                            );
                        }
                    }
                    expect(found.problem, doenetML).toBeNull();
                }
            }
        }
        // the bounds decided a good share of them
        expect(passes).toBeGreaterThan(10);
        expect(samples).toBeGreaterThan(1000);
    });
});
