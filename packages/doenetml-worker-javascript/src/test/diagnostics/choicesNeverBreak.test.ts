import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

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
    const selected =
        stateVariables[await resolvePathToNodeIdx(selection)].stateValues[
            variable
        ];
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
        scoreState,
        selected,
        texts,
        errors: diagnostics.errors.map((d) => d.code),
        infos: diagnostics.infos.map((d) => d.code),
        generatedVariantInfo,
    };
}

/**
 * Choices the requested variant gives that don't fit, as from a variant saved
 * before the document changed, are ignored with an info (`doenet-i0057`), and
 * the tag chooses as though it had been given none, as `<shuffle>` does
 * (#2389 item 1). The document loads.
 */
describe("A requested variant whose choices don't fit @group4", async () => {
    const cases: {
        tag: string;
        before: string;
        after: string;
        variable: "selectedIndices" | "selectedValues";
        check: (selected: any[]) => void;
    }[] = [
        {
            tag: "<select>, numToSelect changed",
            before: `<select name="s" numToSelect="2">a b c d e</select><select name="t">f g</select>`,
            after: `<select name="s" numToSelect="4">a b c d e</select><select name="t">f g</select>`,
            variable: "selectedIndices",
            check: (selected) => {
                expect(selected.length).eq(4);
                expect(new Set(selected).size).eq(4);
            },
        },
        {
            tag: "<selectFromSequence>, numToSelect changed",
            before: `<selectFromSequence name="s" to="100" numToSelect="2"/><select name="t">f g</select>`,
            after: `<selectFromSequence name="s" to="100" numToSelect="4"/><select name="t">f g</select>`,
            variable: "selectedValues",
            check: (selected) => {
                expect(selected.length).eq(4);
            },
        },
        {
            tag: "<selectFromSequence>, a chosen value now excluded",
            before: `<selectFromSequence name="s" to="2"/><select name="t">f g</select>`,
            after: `<selectFromSequence name="s" to="4" exclude="1 2"/><select name="t">f g</select>`,
            variable: "selectedValues",
            check: (selected) => {
                expect(selected.length).eq(1);
                expect([3, 4]).toContain(selected[0]);
            },
        },
        {
            tag: "<selectPrimeNumbers>, numToSelect changed",
            before: `<selectPrimeNumbers name="s" numToSelect="2"/><select name="t">f g</select>`,
            after: `<selectPrimeNumbers name="s" numToSelect="4"/><select name="t">f g</select>`,
            variable: "selectedValues",
            check: (selected) => {
                expect(selected.length).eq(4);
            },
        },
        {
            tag: "<selectPrimeNumbers>, a chosen value no longer in range",
            before: `<selectPrimeNumbers name="s" from="50" to="100"/><select name="t">f g</select>`,
            after: `<selectPrimeNumbers name="s" from="2" to="20"/><select name="t">f g</select>`,
            variable: "selectedValues",
            check: (selected) => {
                expect(selected.length).eq(1);
                expect(selected[0]).lte(20);
            },
        },
        {
            tag: "<selectRandomNumbers>, numToSelect changed",
            before: `<selectRandomNumbers name="s" numToSelect="2"/><select name="t">f g</select>`,
            after: `<selectRandomNumbers name="s" numToSelect="4"/><select name="t">f g</select>`,
            variable: "selectedValues",
            check: (selected) => {
                expect(selected.length).eq(4);
            },
        },
    ];

    for (const { tag, before, after, variable, check } of cases) {
        it(tag, async () => {
            for (const requestedVariantIndex of [1, 2, 3]) {
                const { generatedVariantInfo } = await load({
                    doenetML: before,
                    requestedVariantIndex,
                    variable,
                });

                const first = await load({
                    doenetML: after,
                    requestedVariant: generatedVariantInfo,
                    variable,
                });
                expect(first.errors).eqls([]);
                expect(first.infos).toContain("doenet-i0057");
                check(first.selected);

                // fixed for the variant
                const again = await load({
                    doenetML: after,
                    requestedVariant: generatedVariantInfo,
                    variable,
                });
                expect(again.selected).eqls(first.selected);

                // kept, and said again, through a reload
                await first.core.saveImmediately();
                const reloaded = await load({
                    doenetML: after,
                    requestedVariant: generatedVariantInfo,
                    initialState: first.scoreState.state,
                    variable,
                });
                expect(reloaded.errors).eqls([]);
                expect(reloaded.infos).toContain("doenet-i0057");
                expect(reloaded.selected).eqls(first.selected);
            }
        });
    }

    it("a select ignoring its indices doesn't give the options it picks the subvariants of others", async () => {
        const before = `<select name="s"><option><selectFromSequence name="a" to="10"/></option><option>b</option></select>`;
        const after = `<select name="s" numToSelect="2"><option><selectFromSequence name="a" to="10" numToSelect="2"/></option><option>b</option></select>`;
        for (const requestedVariantIndex of [1, 2, 3, 4]) {
            const { generatedVariantInfo } = await load({
                doenetML: before,
                requestedVariantIndex,
                variable: "selectedIndices",
            });
            const { errors, selected } = await load({
                doenetML: after,
                requestedVariant: generatedVariantInfo,
                variable: "selectedIndices",
            });
            expect(errors).eqls([]);
            expect([...selected].sort()).eqls([1, 2]);
        }
    });

    it("choices that fit are taken, with no info", async () => {
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
            expect(specified.infos).not.toContain("doenet-i0057");
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
    ];

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
 * of it. Neither breaks the document, and neither reports that choices were
 * ignored (`doenet-i0057`): none were given.
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
            expect(reloaded.infos).not.toContain("doenet-i0057");
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
            expect(infos).not.toContain("doenet-i0057");
            if (type === "infos") {
                expect(errors).eqls([]);
            }
        });
    }
});
