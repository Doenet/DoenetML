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
        const doenetML = `<number name="n">4</number><p name="p">A <select name="s" numToSelect="$n">u v w</select> B</p>`;
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
        const doenetML = `<number name="n">4</number><p name="p">A <select name="s" numToSelect="$n">u v w</select> B</p><p name="q">C $s D</p>`;
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
        const doenetML = `<mathInput name="mi"/><number name="n">4</number><p name="p">A <select name="s" numToSelect="$n">u v w</select> B</p>`;
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
            fromValue: `<number name="a">0</number><selectFromSequence name="s" from="$a" to="5" numToSelect="2" coprime/>`,
        },
        {
            code: "doenet-e0043",
            written: `<selectFromSequence name="s" from="2" to="2" numToSelect="2" withReplacement coprime/>`,
            fromValue: `<number name="a">2</number><selectFromSequence name="s" from="2" to="$a" numToSelect="2" withReplacement coprime/>`,
        },
        {
            code: "doenet-e0044",
            written: `<selectFromSequence name="s" to="3" numToSelect="2" excludeCombinations="(1 2) (2 1) (1 3) (3 1) (2 3)"/>`,
            fromValue: `<number name="a">3</number><selectFromSequence name="s" to="$a" numToSelect="2" excludeCombinations="(1 2) (2 1) (1 3) (3 1) (2 3)"/>`,
        },
        {
            code: "doenet-e0045",
            written: `<selectFromSequence name="s" from="2" to="4" exclude="3" numToSelect="2" coprime/>`,
            fromValue: `<number name="a">3</number><selectFromSequence name="s" from="2" to="4" exclude="$a" numToSelect="2" coprime/>`,
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
            doenetML: `<boolean name="b">true</boolean><selectFromSequence name="s" from="2" to="4" step="2" numToSelect="2" coprime="$b"/>`,
            variable: "selectedValues",
            code: "doenet-e0042",
            type: "infos",
        },
        {
            tag: "<selectFromSequence>, exclude from a value",
            doenetML: `<number name="a">3</number><selectFromSequence name="s" to="4" exclude="$a 4" numToSelect="3"/>`,
            variable: "selectedValues",
            code: "doenet-e0046",
            type: "infos",
        },
        {
            tag: "<selectPrimeNumbers>, combinations excluded from a range from a value",
            doenetML: `<number name="a">5</number><selectPrimeNumbers name="s" to="$a" numToSelect="2" excludeCombinations="(2 3) (3 2) (2 5) (5 2) (3 5)"/>`,
            variable: "selectedValues",
            code: "doenet-e0051",
            type: "infos",
        },
        {
            tag: "<select>, numToSelect from a value",
            doenetML: `<number name="n">3</number><select name="s" numToSelect="$n">a b</select>`,
            variable: "selectedIndices",
            code: "doenet-e0035",
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
        // is 2, so `a` has an option in some variants only
        const doenetML = `<variantControl numVariants="2" variantNames="a b"/>
<setup><group name="g"><option selectForVariants="a">x</option><option>y</option></group></setup>
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

    it("coprime draws that find nothing are an info, not an error, when coprime values exist", async () => {
        // 1 and the even numbers to 2002: a coprime pair must include 1,
        // which 200 draws miss in some variants and find in others
        const exclude = [...Array(1000).keys()].map((i) => 2 * i + 3).join(" ");
        const doenetML = `<selectFromSequence name="s" from="1" to="2002" exclude="${exclude}" numToSelect="2" coprime/>`;
        let found = 0;
        let missed = 0;
        for (const requestedVariantIndex of [1, 2, 3, 4, 5, 6, 7, 8]) {
            const { errors, infos, selected } = await load({
                doenetML,
                requestedVariantIndex,
            });
            expect(errors).eqls([]);
            if (selected === null) {
                missed++;
                expect(infos).toContain("doenet-i0057");
            } else {
                found++;
                expect(selected).toContain(1);
            }
        }
        expect(found).gt(0);
        expect(missed).gt(0);
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
    for (const [tag, doenetML, variable] of [
        [
            "<select>",
            `<mathInput name="mi" prefill="1"/><select name="s" numToSelect="$mi">a b c d</select>`,
            "selectedIndices",
        ],
        [
            "<selectFromSequence>",
            `<mathInput name="mi" prefill="1"/><selectFromSequence name="s" to="10" numToSelect="$mi"/>`,
            "selectedValues",
        ],
        [
            "<selectPrimeNumbers>",
            `<mathInput name="mi" prefill="1"/><selectPrimeNumbers name="s" to="50" numToSelect="$mi"/>`,
            "selectedValues",
        ],
        [
            "<selectRandomNumbers>",
            `<mathInput name="mi" prefill="1"/><selectRandomNumbers name="s" numToSelect="$mi"/>`,
            "selectedValues",
        ],
    ]) {
        it(`${tag}: a numToSelect changed after the selection is ignored`, async () => {
            const { core, resolvePathToNodeIdx, scoreState } =
                await createTestCore({
                    doenetML,
                    requestedVariantIndex: 2,
                });
            const sIdx = await resolvePathToNodeIdx("s");
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const before = stateVariables[sIdx].stateValues[variable];
            expect(before.length).eq(1);
            expect(stateVariables[sIdx].stateValues.numToSelect).eq(1);

            await updateMathInputValue({
                latex: "2",
                componentIdx: await resolvePathToNodeIdx("mi"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[sIdx].stateValues.numToSelect).eq(1);
            expect(stateVariables[sIdx].stateValues[variable]).eqls(before);
            expect(getDiagnosticsByType(core).errors).eqls([]);

            // and through a reload, with the input at 2
            await core.saveImmediately();
            const reloaded = await load({
                doenetML,
                requestedVariantIndex: 2,
                initialState: scoreState.state,
                variable: variable as "selectedIndices" | "selectedValues",
            });
            expect(reloaded.selected).eqls(before);
            // as is the numToSelect it was made with
            expect(reloaded.numToSelect).eq(1);
            expect(reloaded.errors).eqls([]);
        });
    }

    it("<selectFromSequence>: a range changed after the selection is ignored", async () => {
        const doenetML = `<mathInput name="mi" prefill="10"/><selectFromSequence name="s" to="$mi"/>`;
        for (const requestedVariantIndex of [1, 2, 3, 4]) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex,
            });
            const sIdx = await resolvePathToNodeIdx("s");
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const before = stateVariables[sIdx].stateValues.selectedValues;
            await updateMathInputValue({
                latex: "3",
                componentIdx: await resolvePathToNodeIdx("mi"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[sIdx].stateValues.length).eq(10);
            expect(stateVariables[sIdx].stateValues.selectedValues).eqls(
                before,
            );
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
