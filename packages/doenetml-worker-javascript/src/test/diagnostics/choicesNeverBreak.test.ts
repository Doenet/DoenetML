import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Load `doenetML` and return the named component's selection, the text of
 * the named `<p>`s, the codes of the errors and infos, and the variant the
 * document generated, JSON round-tripped as a host that saves it would pass
 * it back.
 */
async function load({
    doenetML,
    requestedVariantIndex,
    requestedVariant,
    initialState,
    selection = "s",
    variable = "selectedValues",
    paragraphs = [],
}: {
    doenetML: string;
    requestedVariantIndex?: number;
    requestedVariant?: Record<string, any>;
    initialState?: string;
    selection?: string;
    variable?: "selectedIndices" | "selectedValues";
    paragraphs?: string[];
}) {
    const { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
        doenetML,
        requestedVariantIndex,
        requestedVariant,
        initialState,
    });
    const stateVariables = await core.returnAllStateVariables(false, true);
    const selectionState =
        stateVariables[await resolvePathToNodeIdx(selection)].stateValues;
    const selected = selectionState[variable];
    const numToSelect = selectionState.numToSelect;
    const texts: Record<string, string> = {};
    for (const name of paragraphs) {
        texts[name] =
            stateVariables[await resolvePathToNodeIdx(name)].stateValues.text;
    }
    const diagnostics = getDiagnosticsByType(core);
    const generatedVariantInfo = JSON.parse(
        JSON.stringify(
            stateVariables[await resolvePathToNodeIdx("_document1")].stateValues
                .generatedVariantInfo,
        ),
    );
    return {
        core,
        resolvePathToNodeIdx,
        scoreState,
        selected,
        numToSelect,
        texts,
        errors: diagnostics.errors.map((d) => d.code),
        infos: diagnostics.infos.map((d) => d.code),
        generatedVariantInfo,
    };
}

/**
 * A select takes the choices a requested variant gives as given, even when
 * they are not what it would choose now, as from a variant saved before the
 * document changed: a select keeps the choices it was made with and never
 * chooses again (#2389 item 1). The document loads.
 */
describe("A requested variant's choices are taken as given @group4", async () => {
    const cases: {
        tag: string;
        before: string;
        after: string;
        variable: "selectedIndices" | "selectedValues";
    }[] = [
        {
            tag: "<select>, numToSelect changed",
            before: `<select name="s" numToSelect="2">a b c d e</select><select name="t">f g</select>`,
            after: `<select name="s" numToSelect="4">a b c d e</select><select name="t">f g</select>`,
            variable: "selectedIndices",
        },
        {
            tag: "<selectFromSequence>, numToSelect changed",
            before: `<selectFromSequence name="s" to="100" numToSelect="2"/><select name="t">f g</select>`,
            after: `<selectFromSequence name="s" to="100" numToSelect="4"/><select name="t">f g</select>`,
            variable: "selectedValues",
        },
        {
            tag: "<selectFromSequence>, a chosen value now excluded",
            before: `<selectFromSequence name="s" to="2"/><select name="t">f g</select>`,
            after: `<selectFromSequence name="s" to="4" exclude="1 2"/><select name="t">f g</select>`,
            variable: "selectedValues",
        },
        {
            tag: "<selectPrimeNumbers>, numToSelect changed",
            before: `<selectPrimeNumbers name="s" numToSelect="2"/><select name="t">f g</select>`,
            after: `<selectPrimeNumbers name="s" numToSelect="4"/><select name="t">f g</select>`,
            variable: "selectedValues",
        },
        {
            tag: "<selectPrimeNumbers>, a chosen value no longer in range",
            before: `<selectPrimeNumbers name="s" from="50" to="100"/><select name="t">f g</select>`,
            after: `<selectPrimeNumbers name="s" from="2" to="20"/><select name="t">f g</select>`,
            variable: "selectedValues",
        },
        {
            tag: "<selectRandomNumbers>, numToSelect changed",
            before: `<selectRandomNumbers name="s" numToSelect="2"/><select name="t">f g</select>`,
            after: `<selectRandomNumbers name="s" numToSelect="4"/><select name="t">f g</select>`,
            variable: "selectedValues",
        },
    ];

    for (const { tag, before, after, variable } of cases) {
        it(tag, async () => {
            for (const requestedVariantIndex of [1, 2, 3]) {
                const original = await load({
                    doenetML: before,
                    requestedVariantIndex,
                    variable,
                });

                const first = await load({
                    doenetML: after,
                    requestedVariant: original.generatedVariantInfo,
                    variable,
                });
                expect(first.errors).eqls([]);
                // the choices it was made with, not new ones
                expect(first.selected).eqls(original.selected);
                // and how many it selected, not the attribute as it is now
                expect(first.numToSelect).eq(original.numToSelect);

                // kept through a reload
                await first.core.saveImmediately();
                const reloaded = await load({
                    doenetML: after,
                    requestedVariant: original.generatedVariantInfo,
                    initialState: first.scoreState.state,
                    variable,
                });
                expect(reloaded.errors).eqls([]);
                expect(reloaded.selected).eqls(original.selected);
                expect(reloaded.numToSelect).eq(original.numToSelect);
            }
        });
    }

    it("a select taking its indices gives the options it picks their subvariants", async () => {
        const before = `<select name="s"><option><selectFromSequence name="a" to="10"/></option><option>b</option></select>`;
        const after = `<select name="s" numToSelect="2"><option><selectFromSequence name="a" to="10" numToSelect="2"/></option><option>b</option></select>`;
        for (const requestedVariantIndex of [1, 2, 3, 4]) {
            const original = await load({
                doenetML: before,
                requestedVariantIndex,
                variable: "selectedIndices",
            });
            const { errors, selected } = await load({
                doenetML: after,
                requestedVariant: original.generatedVariantInfo,
                variable: "selectedIndices",
            });
            expect(errors).eqls([]);
            expect(selected).eqls(original.selected);
        }
    });

    it("choices from the variant the document generated are the same choices", async () => {
        const doenetML = `<select name="s" numToSelect="2">a b c d e</select><selectFromSequence name="t" to="100" numToSelect="3"/>`;
        for (const requestedVariantIndex of [1, 2, 3]) {
            const first = await load({
                doenetML,
                requestedVariantIndex,
                variable: "selectedIndices",
            });
            const specified = await load({
                doenetML,
                requestedVariant: first.generatedVariantInfo,
                variable: "selectedIndices",
            });
            expect(specified.selected).eqls(first.selected);
        }
    });
});

/**
 * Whether a selection can be made, when a value decides it, is not an error
 * (D38, DIAG-7): the selection is missing, with an info, and the same errors
 * are reported in every variant (none). When the DoenetML alone decides it,
 * it is an error, in every variant.
 */
describe("A selection that a value decides can't be made @group4", async () => {
    const variantIndices = [1, 2, 3, 4, 5, 6, 7, 8];

    const valueCases: {
        tag: string;
        doenetML: string;
        code: string;
        variable: "selectedIndices" | "selectedValues";
        made: (selected: any) => boolean;
    }[] = [
        {
            tag: "<selectFromSequence>, a range from another random choice",
            doenetML: `<selectFromSequence name="a" from="1" to="5"/>
<p name="p"><selectFromSequence name="s" from="1" to="$a" numToSelect="3"/></p>`,
            code: "doenet-e0036",
            variable: "selectedValues",
            made: (selected) => selected?.length === 3,
        },
        {
            tag: "<selectPrimeNumbers>, a range from another random choice",
            doenetML: `<selectFromSequence name="a" from="2" to="12"/>
<p name="p"><selectPrimeNumbers name="s" to="$a" numToSelect="3"/></p>`,
            code: "doenet-e0047",
            variable: "selectedValues",
            made: (selected) => selected?.length === 3,
        },
        {
            tag: "<select>, numToSelect from another random choice",
            doenetML: `<selectFromSequence name="a" from="3" to="4"/>
<p name="p"><select name="s" numToSelect="$a">u v w</select></p>`,
            code: "doenet-e0035",
            variable: "selectedIndices",
            made: (selected) => selected?.length > 0,
        },
        {
            tag: "<select> with options for variants, numToSelect from another random choice",
            doenetML: `<variantControl numVariants="4" variantNames="a b c d"/>
<selectFromSequence name="a" from="1" to="2"/>
<p name="p"><select name="s" numToSelect="$a"><option selectForVariants="a b c d">u</option><option selectForVariants="a b c d">v</option></select></p>`,
            code: "doenet-e0032",
            variable: "selectedIndices",
            made: (selected) => selected?.length > 0,
        },
    ];

    for (const { tag, doenetML, code, variable, made } of valueCases) {
        it(tag, async () => {
            let madeIn = 0;
            let missingIn = 0;
            for (const requestedVariantIndex of variantIndices) {
                const { selected, errors, infos, texts } = await load({
                    doenetML,
                    requestedVariantIndex,
                    variable,
                    paragraphs: ["p"],
                });
                expect(errors).eqls([]);
                if (made(selected)) {
                    madeIn++;
                    expect(infos).not.toContain(code);
                } else {
                    missingIn++;
                    expect(infos).toContain(code);
                    // the rest renders, and the selection is missing
                    expect(["", "＿"]).toContain(texts.p);
                }
            }
            // both happen across these variants
            expect(madeIn).gt(0);
            expect(missingIn).gt(0);
        });
    }

    it("a <select> whose numToSelect a value decides is missing, a blank", async () => {
        const doenetML = `<selectFromSequence name="n" from="4" to="4"/><p name="p">A <select name="s" numToSelect="$n">u v w</select> B</p>`;
        const { errors, infos, texts } = await load({
            doenetML,
            variable: "selectedIndices",
            paragraphs: ["p"],
        });
        expect(errors).eqls([]);
        expect(infos).toContain("doenet-e0035");
        expect(texts.p).eq("A ＿ B");
    });

    it("a reference to a <select> that a value leaves missing is a blank too, and the info is reported once", async () => {
        const doenetML = `<selectFromSequence name="n" from="4" to="4"/><p name="p">A <select name="s" numToSelect="$n">u v w</select> B</p><p name="q">C $s D</p>`;
        const { errors, infos, texts } = await load({
            doenetML,
            variable: "selectedIndices",
            paragraphs: ["p", "q"],
        });
        expect(errors).eqls([]);
        expect(infos.filter((c) => c === "doenet-e0035").length).eq(1);
        expect(texts.p).eq("A ＿ B");
        expect(texts.q).eq("C ＿ D");
    });

    it("a <select> that a value leaves missing stays a blank through a reload of its state", async () => {
        const doenetML = `<mathInput name="mi"/><selectFromSequence name="n" from="4" to="4"/><p name="p">A <select name="s" numToSelect="$n">u v w</select> B</p>`;
        const first = await load({
            doenetML,
            variable: "selectedIndices",
            paragraphs: ["p"],
        });
        await updateMathInputValue({
            latex: "3",
            componentIdx: await first.resolvePathToNodeIdx("mi"),
            core: first.core,
        });
        await first.core.saveImmediately();
        expect(first.scoreState.state).toBeTruthy();
        const reloaded = await load({
            doenetML,
            requestedVariant: first.generatedVariantInfo,
            initialState: first.scoreState.state,
            variable: "selectedIndices",
            paragraphs: ["p"],
        });
        expect(reloaded.errors).eqls([]);
        expect(reloaded.infos).toContain("doenet-e0035");
        expect(reloaded.texts.p).eq("A ＿ B");
    });

    const literalCases: { tag: string; doenetML: string; code: string }[] = [
        {
            tag: "<select>",
            doenetML: `<select name="s" numToSelect="4">u v w</select>`,
            code: "doenet-e0035",
        },
        {
            tag: "<selectFromSequence>",
            doenetML: `<selectFromSequence name="s" to="2" numToSelect="3"/>`,
            code: "doenet-e0036",
        },
        {
            tag: "<selectPrimeNumbers>",
            doenetML: `<selectPrimeNumbers name="s" to="5" numToSelect="4"/>`,
            code: "doenet-e0047",
        },
        {
            tag: "<selectFromSequence coprime>",
            doenetML: `<selectFromSequence name="s" numToSelect="2" from="2" step="4" coprime/>`,
            code: "doenet-e0042",
        },
        {
            tag: "<select> with options for variants",
            doenetML: `<variantControl numVariants="2" variantNames="a b"/>
<select name="s"><option selectForVariants="a b">u</option><option selectForVariants="a b">v</option></select>`,
            code: "doenet-e0032",
        },
    ];

    // Each failure of a `<selectFromSequence>` found after its range is
    // counted: an info when a value decides it, an error when the DoenetML
    // does
    const sequenceCases: {
        code: string;
        written: string;
        fromValue: string;
    }[] = [
        {
            code: "doenet-e0041",
            written: `<selectFromSequence name="s" from="0" to="5" numToSelect="2" coprime/>`,
            fromValue: `<selectFromSequence name="a" from="0" to="0"/><selectFromSequence name="s" from="$a" to="5" numToSelect="2" coprime/>`,
        },
        {
            code: "doenet-e0043",
            written: `<selectFromSequence name="s" from="2" to="2" numToSelect="2" withReplacement coprime/>`,
            fromValue: `<selectFromSequence name="a" from="2" to="2"/><selectFromSequence name="s" from="2" to="$a" numToSelect="2" withReplacement coprime/>`,
        },
        {
            code: "doenet-e0044",
            written: `<selectFromSequence name="s" to="3" numToSelect="2" excludeCombinations="(1 2) (2 1) (1 3) (3 1) (2 3)"/>`,
            fromValue: `<selectFromSequence name="a" from="3" to="3"/><selectFromSequence name="s" to="$a" numToSelect="2" excludeCombinations="(1 2) (2 1) (1 3) (3 1) (2 3)"/>`,
        },
        {
            code: "doenet-e0045",
            written: `<selectFromSequence name="s" from="2" to="4" exclude="3" numToSelect="2" coprime/>`,
            fromValue: `<selectFromSequence name="a" from="3" to="3"/><selectFromSequence name="s" from="2" to="4" exclude="$a" numToSelect="2" coprime/>`,
        },
    ];

    for (const { code, written, fromValue } of sequenceCases) {
        it(`<selectFromSequence> ${code}: an info from a value, an error when written`, async () => {
            const valued = await load({ doenetML: fromValue });
            expect(valued.errors).eqls([]);
            expect(valued.infos).toContain(code);
            expect(valued.selected).eq(null);

            const literal = await load({ doenetML: written });
            expect(literal.errors).eqls([code]);
            expect(literal.infos).not.toContain(code);
        });
    }

    for (const { tag, doenetML, code } of literalCases) {
        it(`${tag} written so it can't select is an error in every variant`, async () => {
            for (const requestedVariantIndex of [1, 2, 3]) {
                const { errors, infos } = await load({
                    doenetML,
                    requestedVariantIndex,
                    variable: "selectedIndices",
                });
                expect(errors).eqls([code]);
                expect(infos).not.toContain(code);
            }
        });
    }
});

/**
 * A select that could not select records no choices in its variant: `null`
 * from a `<selectFromSequence>` or `<selectPrimeNumbers>`, `[]` from a
 * `<select>`. That variant is passed back to it on a reload and to a `copy`
 * of it. Neither breaks the document.
 */
describe("A selection that couldn't be made, given back @group4", async () => {
    const cases: {
        tag: string;
        doenetML: string;
        variable: "selectedIndices" | "selectedValues";
        code: string;
        type: "errors" | "infos";
    }[] = [
        {
            tag: "<selectFromSequence>, coprime from a value",
            doenetML: `<select name="b"><option><boolean>true</boolean></option></select><selectFromSequence name="s" from="2" to="4" step="2" numToSelect="2" coprime="$b"/>`,
            variable: "selectedValues",
            code: "doenet-e0042",
            type: "infos",
        },
        {
            tag: "<selectFromSequence>, exclude from a value",
            doenetML: `<selectFromSequence name="a" from="3" to="3"/><selectFromSequence name="s" to="4" exclude="$a 4" numToSelect="3"/>`,
            variable: "selectedValues",
            code: "doenet-e0046",
            type: "infos",
        },
        {
            tag: "<selectPrimeNumbers>, combinations excluded from a range from a value",
            doenetML: `<selectFromSequence name="a" from="5" to="5"/><selectPrimeNumbers name="s" to="$a" numToSelect="2" excludeCombinations="(2 3) (3 2) (2 5) (5 2) (3 5)"/>`,
            variable: "selectedValues",
            code: "doenet-e0051",
            type: "infos",
        },
        {
            tag: "<select>, numToSelect from a value",
            doenetML: `<selectFromSequence name="n" from="3" to="3"/><select name="s" numToSelect="$n">a b</select>`,
            variable: "selectedIndices",
            code: "doenet-e0035",
            type: "infos",
        },
        {
            tag: "<selectFromSequence>, coprime with every value sharing a factor, written",
            doenetML: `<selectFromSequence name="s" from="2" to="6" exclude="3 5" numToSelect="2" coprime/>`,
            variable: "selectedValues",
            code: "doenet-e0045",
            type: "errors",
        },
        {
            tag: "<selectFromSequence>, coprime with every value sharing a factor, from a value",
            doenetML: `<selectFromSequence name="a" from="3" to="3"/><selectFromSequence name="s" from="2" to="6" exclude="$a 5" numToSelect="2" coprime/>`,
            variable: "selectedValues",
            code: "doenet-e0045",
            type: "infos",
        },
        {
            tag: "<select>, written so it can't select",
            doenetML: `<select name="s" numToSelect="3">a b</select>`,
            variable: "selectedIndices",
            code: "doenet-e0035",
            type: "errors",
        },
    ];

    for (const { tag, doenetML, variable, code, type } of cases) {
        it(`${tag}, reloaded`, async () => {
            const first = await load({ doenetML, variable });
            expect(first[type]).toContain(code);
            const reloaded = await load({
                doenetML,
                requestedVariant: first.generatedVariantInfo,
                variable,
            });
            expect(reloaded.errors).eqls(first.errors);
            expect(reloaded.infos).eqls(first.infos);
            expect(reloaded.numToSelect).eq(first.numToSelect);
        });

        it(`${tag}, copied`, async () => {
            const tagName = doenetML.match(/<(select\w*) name="s"/)![1];
            const { errors, infos } = await load({
                doenetML: `${doenetML}<${tagName} copy="$s" name="c"/>`,
                selection: "c",
                variable,
            });
            const both = type === "errors" ? errors : infos;
            expect(both.filter((c) => c === code).length).eq(2);
            if (type === "infos") {
                expect(errors).eqls([]);
            }
        });
    }
});

/**
 * Errors decided by the DoenetML aren't hidden, or made to appear, by a value
 * or the variant (D38, DIAG-7).
 */
describe("Errors the DoenetML decides, beside ones a value decides @group4", async () => {
    it("a variant name with no option is an error in every variant, whatever numToSelect a value gives", async () => {
        // `n` is 1 or 2. With 2, the count for `a` doesn't match, an info;
        // that must not hide the error that `b` has no option.
        const doenetML = `<variantControl numVariants="2" variantNames="a b"/>
<selectFromSequence name="n" from="1" to="2"/>
<p name="p"><select name="s" numToSelect="$n"><option selectForVariants="a">u</option></select></p>`;
        const counts = new Set<number>();
        for (const requestedVariantIndex of [1, 2, 3, 4, 5, 6]) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            counts.add(
                stateVariables[await resolvePathToNodeIdx("n")].stateValues
                    .selectedValues[0],
            );
            const errors = getDiagnosticsByType(core).errors.map((d) => d.code);
            expect(errors).eqls(["doenet-e0033"]);
        }
        // both counts occur across these variants
        expect([...counts].sort()).eqls([1, 2]);
    });

    it("a variant name with no option among options a random index copies is an info, never an error", async () => {
        // The copied option is for `a` when k is 1, and for no name when k
        // is 2, so `a` has an option in some variants only. The options are
        // collected so that an index selects among them (an index after a
        // `<group>` names nothing, D27).
        const doenetML = `<variantControl numVariants="2" variantNames="a b"/>
<setup><group name="options"><option selectForVariants="a">x</option><option>y</option></group><collect name="g" componentType="option" from="$options"/></setup>
<selectFromSequence name="k" from="1" to="2"/>
<p name="p"><select name="s"><option copy="$g[$k]"/><option selectForVariants="b">z</option></select></p>`;
        let made = 0;
        let missing = 0;
        for (const requestedVariantIndex of [1, 2, 3, 4, 5, 6]) {
            const { errors, infos, texts } = await load({
                doenetML,
                requestedVariantIndex,
                variable: "selectedIndices",
                paragraphs: ["p"],
            });
            expect(errors).eqls([]);
            if (infos.includes("doenet-e0033")) {
                missing++;
                expect(texts.p).eq("＿");
            } else {
                made++;
            }
        }
        expect(made).gt(0);
        expect(missing).gt(0);
    });

    it("coprime values that random draws rarely find are found in every variant (SEL-4)", async () => {
        // 1 and the even numbers to 2002: a coprime pair must include 1,
        // which 200 random draws miss in some variants, so those variants
        // draw among the coprime pairs exactly
        const exclude = [...Array(1000).keys()].map((i) => 2 * i + 3).join(" ");
        const doenetML = `<selectFromSequence name="s" from="1" to="2002" exclude="${exclude}" numToSelect="2" coprime/>`;
        const pairs = new Set<string>();
        for (const requestedVariantIndex of [1, 2, 3, 4, 5, 6, 7, 8]) {
            const { errors, infos, selected } = await load({
                doenetML,
                requestedVariantIndex,
            });
            expect(errors).eqls([]);
            // only that the number of variants can't be counted
            // (`doenet-i0026`), which `coprime` always gives
            expect(infos).eqls(["doenet-i0026"]);
            expect(selected).toHaveLength(2);
            expect(selected).toContain(1);
            pairs.add(JSON.stringify(selected));
        }
        // a draw, not the same pair each time
        expect(pairs.size).gt(1);
    });

    it("coprime values rare among very many combinations are found quickly", async () => {
        // 1 and the even numbers to 2000, three at a time: about 10^9
        // combinations, of which only those holding 1 are coprime. Going
        // through them all would not finish; they are counted instead.
        const doenetML = `<sequence name="odds" from="3" to="1999" step="2" hide/>
<selectFromSequence name="s" from="1" to="2000" exclude="$odds" numToSelect="3" coprime/>`;
        for (const requestedVariantIndex of [1, 2, 3, 4]) {
            const { errors, selected } = await load({
                doenetML,
                requestedVariantIndex,
            });
            expect(errors).eqls([]);
            expect(selected).toHaveLength(3);
            expect(selected).toContain(1);
        }
    });

    it("values with no common factor, but no coprime pair, are an error in every variant", async () => {
        // 6, 10 and 15 have no common factor, but each two of them have one
        const doenetML = `<selectFromSequence name="s" numToSelect="2" from="6" to="15" exclude="7 8 9 11 12 13 14" coprime/>`;
        for (const requestedVariantIndex of [1, 2, 3]) {
            const { errors, selected } = await load({
                doenetML,
                requestedVariantIndex,
            });
            expect(errors).eqls(["doenet-e0045"]);
            expect(selected).eq(null);
        }
    });

    it("coprime values that all share a factor are an error in every variant", async () => {
        const doenetML = `<selectFromSequence name="s" numToSelect="2" from="2" to="4" exclude="3" coprime/>`;
        for (const requestedVariantIndex of [1, 2, 3]) {
            const { errors } = await load({ doenetML, requestedVariantIndex });
            expect(errors).eqls(["doenet-e0045"]);
        }
    });

    it("selectForVariants doesn't take a reference, so it can't make the count a value", async () => {
        const doenetML = `<variantControl numVariants="2" variantNames="a b"/>
<select name="v">a b</select>
<p name="p"><select name="s"><option selectForVariants="$v">u</option><option selectForVariants="b">w</option></select></p>`;
        const results = new Set<string>();
        for (const requestedVariantIndex of [1, 2, 3, 4]) {
            const { core } = await createTestCore({
                doenetML,
                requestedVariantIndex,
            });
            const d = getDiagnosticsByType(core);
            results.add(
                JSON.stringify([
                    d.errors.map((x) => x.code).sort(),
                    d.warnings.map((x) => x.code).sort(),
                ]),
            );
        }
        // the same diagnostics in every variant
        expect(results.size).eq(1);
    });
});

/**
 * What a selection is made from is fixed with it: a later change to
 * `numToSelect`, or to the range a selection draws from, is ignored, so a
 * select never chooses again, nor has to deal with a value that changed.
 */
describe("What a selection is made from is fixed with it @group4", async () => {
    // A numToSelect or a range can't change once the document loads: one
    // from an input is an error at load (D39, SEL-1). A value that changes
    // after a selection is made, a repeat's value in an iteration that was
    // removed and made again, is in `selectionParameters.test.ts`.
    it("a numToSelect or a range from an input is an error at load", async () => {
        for (const doenetML of [
            `<mathInput name="mi" prefill="1"/><select name="s" numToSelect="$mi">a b c d</select>`,
            `<mathInput name="mi" prefill="1"/><selectFromSequence name="s" to="10" numToSelect="$mi"/>`,
            `<mathInput name="mi" prefill="1"/><selectPrimeNumbers name="s" to="50" numToSelect="$mi"/>`,
            `<mathInput name="mi" prefill="1"/><selectRandomNumbers name="s" numToSelect="$mi"/>`,
            `<mathInput name="mi" prefill="10"/><selectFromSequence name="s" to="$mi"/>`,
        ]) {
            const { errors } = await load({ doenetML });
            expect(errors, doenetML).eqls(["doenet-e0070"]);
        }
    });

    it("<selectRandomNumbers>: values replayed as given, even NaN", async () => {
        const doenetML = `<selectRandomNumbers name="s" type="binomial" numTrials="-1"/>`;
        const first = await load({ doenetML, requestedVariantIndex: 1 });
        const replayed = await load({
            doenetML,
            requestedVariant: first.generatedVariantInfo,
        });
        expect(replayed.errors).eqls([]);
        // taken as given: the variant, JSON round-tripped, holds `null`
        expect(replayed.selected).eqls([null]);
    });
});

/**
 * A requested variant's choices are taken before anything a value decides
 * about a fresh selection: a select that is given choices doesn't draw, so a
 * count that changed, or a failure a value decides, doesn't touch them. An
 * empty list is a selection of nothing. A failure the DoenetML decides is
 * still an error, in every variant.
 */
describe("Requested choices come before a fresh selection @group4", async () => {
    const cases: {
        tag: string;
        before: string;
        after: string;
        variable: "selectedIndices" | "selectedValues";
    }[] = [
        {
            tag: "<select>, a count now 0",
            before: `<selectFromSequence name="n" from="2" to="2"/><select name="s" numToSelect="$n">a b c</select>`,
            after: `<selectFromSequence name="n" from="0" to="0"/><select name="s" numToSelect="$n">a b c</select>`,
            variable: "selectedIndices",
        },
        {
            tag: "<select>, nothing selected, a count now 1",
            before: `<selectFromSequence name="n" from="0" to="0"/><select name="s" numToSelect="$n">a b c</select>`,
            after: `<selectFromSequence name="n" from="1" to="1"/><select name="s" numToSelect="$n">a b c</select>`,
            variable: "selectedIndices",
        },
        {
            tag: "<selectFromSequence>, a count a value makes too many",
            before: `<selectFromSequence name="n" from="2" to="2"/><selectFromSequence name="s" to="3" numToSelect="$n"/>`,
            after: `<selectFromSequence name="n" from="4" to="4"/><selectFromSequence name="s" to="3" numToSelect="$n"/>`,
            variable: "selectedValues",
        },
        {
            tag: "<selectFromSequence>, nothing selected, a count now 1",
            before: `<selectFromSequence name="n" from="0" to="0"/><selectFromSequence name="s" to="3" numToSelect="$n"/>`,
            after: `<selectFromSequence name="n" from="1" to="1"/><selectFromSequence name="s" to="3" numToSelect="$n"/>`,
            variable: "selectedValues",
        },
        {
            tag: "<selectPrimeNumbers>, a count a value makes too many",
            before: `<selectFromSequence name="n" from="2" to="2"/><selectPrimeNumbers name="s" to="5" numToSelect="$n"/>`,
            after: `<selectFromSequence name="n" from="4" to="4"/><selectPrimeNumbers name="s" to="5" numToSelect="$n"/>`,
            variable: "selectedValues",
        },
        {
            tag: "<selectRandomNumbers>, a count now 0",
            before: `<selectFromSequence name="n" from="2" to="2"/><selectRandomNumbers name="s" numToSelect="$n"/>`,
            after: `<selectFromSequence name="n" from="0" to="0"/><selectRandomNumbers name="s" numToSelect="$n"/>`,
            variable: "selectedValues",
        },
        {
            tag: "<selectRandomNumbers>, nothing selected, a count now 1",
            before: `<selectFromSequence name="n" from="0" to="0"/><selectRandomNumbers name="s" numToSelect="$n"/>`,
            after: `<selectFromSequence name="n" from="1" to="1"/><selectRandomNumbers name="s" numToSelect="$n"/>`,
            variable: "selectedValues",
        },
    ];

    for (const { tag, before, after, variable } of cases) {
        it(tag, async () => {
            for (const requestedVariantIndex of [1, 2, 3]) {
                const original = await load({
                    doenetML: before,
                    requestedVariantIndex,
                    variable,
                });
                const replayed = await load({
                    doenetML: after,
                    requestedVariant: original.generatedVariantInfo,
                    variable,
                });
                expect(replayed.errors).eqls([]);
                expect(replayed.selected ?? []).eqls(original.selected ?? []);
                expect(replayed.numToSelect).eq(
                    (original.selected ?? []).length,
                );
            }
        });
    }

    it("a failure the DoenetML decides is still an error with choices given", async () => {
        const original = await load({
            doenetML: `<select name="s" numToSelect="2">a b c</select>`,
            variable: "selectedIndices",
        });
        const replayed = await load({
            doenetML: `<select name="s" numToSelect="4">a b c</select>`,
            requestedVariant: original.generatedVariantInfo,
            variable: "selectedIndices",
        });
        expect(replayed.errors).eqls(["doenet-e0035"]);
    });

    it("a coprime failure the DoenetML decides, found only from the values, is still an error with choices given", async () => {
        // every value left, 2, 4 and 6, shares the factor 2, which the
        // select finds before it would draw (`selectionWithRequested`)
        const original = await load({
            doenetML: `<selectFromSequence name="s" from="2" to="6" exclude="5" numToSelect="2" coprime/>`,
        });
        expect(original.errors).eqls([]);
        const replayed = await load({
            doenetML: `<selectFromSequence name="s" from="2" to="6" exclude="3 5" numToSelect="2" coprime/>`,
            requestedVariant: original.generatedVariantInfo,
        });
        expect(replayed.errors).eqls(["doenet-e0045"]);
        expect(replayed.selected).eq(null);
    });

    it("a selection whose weights come from an input is an error at load", async () => {
        // an option's weight can't come from an input (D39, SEL-1)
        const doenetML = `<mathInput name="w" prefill="1"/><select name="s"><option selectWeight="$w">a</option><option selectWeight="1-$w">b</option></select>`;
        const { errors } = await load({ doenetML });
        expect(errors).eqls(["doenet-e0070"]);
    });

    it("a copied option with no weight is taken when a variant gives it", async () => {
        // a variant that picked the copied option while it had a weight
        const weighted = (weight: string) =>
            `<setup><option name="o" selectWeight="${weight}">q</option></setup><select name="s"><option>a</option><option copy="$o"/></select>`;
        let variantPickingIt;
        for (
            let requestedVariantIndex = 1;
            requestedVariantIndex <= 10;
            requestedVariantIndex++
        ) {
            const original = await load({
                doenetML: weighted("1"),
                requestedVariantIndex,
                variable: "selectedIndices",
            });
            if (original.selected[0] === 2) {
                variantPickingIt = original.generatedVariantInfo;
                break;
            }
        }
        expect(variantPickingIt).toBeDefined();
        const { selected, errors } = await load({
            doenetML: weighted("0"),
            requestedVariant: variantPickingIt,
            variable: "selectedIndices",
        });
        expect(errors).eqls([]);
        expect(selected).eqls([2]);
    });
});

/**
 * A reference decides a selection as what it names does (D39 SEL-1, D38,
 * DIAG-7): a reference to a component that cannot change, such as a
 * `<number>` written as a literal, is decided by the DoenetML, so a
 * selection it makes impossible is an error when the document loads, in
 * every variant. One to an input, or to another random choice, can change,
 * so the select is missing, with an info.
 */
describe("A reference to what cannot change decides a selection @group4", async () => {
    const cases: {
        tag: string;
        select: (n: string) => string;
        variable: "selectedIndices" | "selectedValues";
        code: string;
    }[] = [
        {
            tag: "<select> numToSelect",
            select: (n) => `<select name="s" numToSelect="${n}">u v w</select>`,
            variable: "selectedIndices",
            code: "doenet-e0035",
        },
        {
            tag: "<selectFromSequence> numToSelect",
            select: (n) =>
                `<selectFromSequence name="s" to="2" numToSelect="${n}"/>`,
            variable: "selectedValues",
            code: "doenet-e0036",
        },
        {
            tag: "<selectPrimeNumbers> to",
            select: (n) =>
                `<selectPrimeNumbers name="s" to="${n}" numToSelect="5"/>`,
            variable: "selectedValues",
            code: "doenet-e0047",
        },
    ];

    for (const { tag, select, variable, code } of cases) {
        it(`${tag} from a reference to a literal is an error at load, in every variant`, async () => {
            for (const requestedVariantIndex of [1, 2, 3]) {
                const { errors, infos } = await load({
                    doenetML: `<number name="n">4</number>${select("$n")}`,
                    requestedVariantIndex,
                    variable,
                });
                expect(errors).eqls([code]);
                expect(infos).not.toContain(code);
            }
        });

        it(`${tag} through a chain of references to literals is an error`, async () => {
            const { errors } = await load({
                doenetML: `<number name="m">4</number><number name="n">$m</number>${select("$n")}`,
                variable,
            });
            expect(errors).eqls([code]);
        });

        it(`${tag} from an input is an error at load, a reader can change it (SEL-1)`, async () => {
            const { errors, infos } = await load({
                doenetML: `<mathInput name="n" prefill="4"/>${select("$n")}`,
                variable,
            });
            expect(errors).eqls(["doenet-e0070"]);
            expect(infos).not.toContain(code);
        });

        it(`${tag} from a literal an input is bound to is an error at load, a reader can change it (SEL-1)`, async () => {
            const { errors, infos } = await load({
                doenetML: `<number name="n">4</number><mathInput bindValueTo="$n"/>${select("$n")}`,
                variable,
            });
            expect(errors).eqls(["doenet-e0070"]);
            expect(infos).not.toContain(code);
        });

        it(`${tag} from a literal in an iteration of a repeat is an error`, async () => {
            const { errors } = await load({
                doenetML: `<repeat name="r" for="1" valueName="v"><number name="n">4</number></repeat>${select("$r[1].n")}`,
                variable,
            });
            expect(errors).eqls([code]);
        });

        it(`${tag} from a literal an input in an iteration of a repeat is bound to is an error at load, a reader can change it (SEL-1)`, async () => {
            const { errors, infos } = await load({
                doenetML: `<repeat name="r" for="1" valueName="v"><number name="n">4</number><mathInput bindValueTo="$n"/></repeat>${select("$r[1].n")}`,
                variable,
            });
            expect(errors).eqls(["doenet-e0070"]);
            expect(infos).not.toContain(code);
        });

        it(`${tag} from a literal a spreadsheet's cell references is an error at load, a reader can change it (SEL-1)`, async () => {
            const { errors, infos } = await load({
                doenetML: `<number name="n">4</number><spreadsheet><cell>$n</cell></spreadsheet>${select("$n")}`,
                variable,
            });
            expect(errors).eqls(["doenet-e0070"]);
            expect(infos).not.toContain(code);
        });

        it(`${tag} from a literal an input holds as its child is an error at load, a reader can change it (SEL-1)`, async () => {
            for (const input of [
                `<mathInput>$n</mathInput>`,
                `<mathInput><math>$n</math></mathInput>`,
            ]) {
                const { errors, infos } = await load({
                    doenetML: `<number name="n">4</number>${input}${select("$n")}`,
                    variable,
                });
                expect(errors).eqls(["doenet-e0070"]);
                expect(infos).not.toContain(code);
            }
        });

        it(`${tag} from a literal a fixed input holds as its child is an error`, async () => {
            const { errors } = await load({
                doenetML: `<number name="n">4</number><mathInput fixed>$n</mathInput>${select("$n")}`,
                variable,
            });
            expect(errors).eqls([code]);
        });

        it(`${tag} from a literal a fixed cell of a spreadsheet references is an error`, async () => {
            for (const spreadsheet of [
                `<spreadsheet><cell fixed>$n</cell></spreadsheet>`,
                `<spreadsheet><row fixed><cell>Count</cell><cell>$n</cell></row></spreadsheet>`,
            ]) {
                const { errors } = await load({
                    doenetML: `<number name="n">4</number>${spreadsheet}${select("$n")}`,
                    variable,
                });
                expect(errors).eqls([code]);
            }
        });

        it(`${tag} from a literal in a fixed point in a group in a graph is an error`, async () => {
            const { errors } = await load({
                doenetML: `<number name="n">4</number><graph><group><point fixed>($n,1)</point></group></graph>${select("$n")}`,
                variable,
            });
            expect(errors).eqls([code]);
        });

        it(`${tag} from a literal in a point in a group a reader drags is an error at load, a reader can change it (SEL-1)`, async () => {
            const { errors, infos } = await load({
                doenetML: `<number name="n">4</number><graph><group><point>($n,1)</point></group></graph>${select("$n")}`,
                variable,
            });
            expect(errors).eqls(["doenet-e0070"]);
            expect(infos).not.toContain(code);
        });

        it(`${tag} from another random choice is an info`, async () => {
            const { errors, infos } = await load({
                doenetML: `<selectFromSequence name="n" from="4" to="5"/>${select("$n")}`,
                variable,
            });
            expect(errors).eqls([]);
            expect(infos).toContain(code);
        });
    }
});
