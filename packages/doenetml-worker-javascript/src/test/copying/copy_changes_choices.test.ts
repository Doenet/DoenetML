import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

const variantIndices = [1, 2, 3, 4, 5];

/**
 * The choices of the components named `x` and `y`, and the codes of the
 * errors the document reports.
 */
async function choices({
    doenetML,
    requestedVariantIndex,
    requestedVariant,
    initialState,
    variable,
}: {
    doenetML: string;
    requestedVariantIndex?: number;
    requestedVariant?: Record<string, any>;
    initialState?: string;
    variable: "selectedIndices" | "selectedValues";
}) {
    const { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
        doenetML,
        requestedVariantIndex,
        requestedVariant,
        initialState,
    });
    const stateVariables = await core.returnAllStateVariables(false, true);
    const x =
        stateVariables[await resolvePathToNodeIdx("x")].stateValues[variable];
    const y =
        stateVariables[await resolvePathToNodeIdx("y")].stateValues[variable];
    const errors = getDiagnosticsByType(core).errors.map((d) => d.code);
    const generatedVariantInfo = JSON.parse(
        JSON.stringify(
            stateVariables[await resolvePathToNodeIdx("_document1")].stateValues
                .generatedVariantInfo,
        ),
    );
    return { x, y, errors, core, scoreState, generatedVariantInfo };
}

/**
 * A copy keeps its source's random choices when it chooses from the same
 * options in the same number (CPY-8). A copy that changes what is chosen,
 * such as its `numToSelect`, makes its own choices, the same for a given
 * variant (#2389).
 */
describe("A copy that changes what is chosen @group3", async () => {
    const cases: {
        tag: string;
        source: string;
        copy: string;
        variable: "selectedIndices" | "selectedValues";
        check: (y: any[]) => void;
    }[] = [
        {
            tag: "select",
            source: `<select name="x" numToSelect="2">a b c d e</select>`,
            copy: `<select name="y" copy="$x" numToSelect="4"/>`,
            variable: "selectedIndices",
            check(y) {
                expect(y.length).eq(4);
                expect(new Set(y).size).eq(4);
                for (const i of y) {
                    expect(i >= 1 && i <= 5).eq(true);
                }
            },
        },
        {
            tag: "selectFromSequence",
            source: `<selectFromSequence name="x" from="1" to="100" numToSelect="2"/>`,
            copy: `<selectFromSequence name="y" copy="$x" numToSelect="4"/>`,
            variable: "selectedValues",
            check(y) {
                expect(y.length).eq(4);
                expect(new Set(y).size).eq(4);
                for (const v of y) {
                    expect(v >= 1 && v <= 100).eq(true);
                }
            },
        },
        {
            tag: "selectPrimeNumbers",
            source: `<selectPrimeNumbers name="x" to="100" numToSelect="2"/>`,
            copy: `<selectPrimeNumbers name="y" copy="$x" numToSelect="4"/>`,
            variable: "selectedValues",
            check(y) {
                expect(y.length).eq(4);
                expect(new Set(y).size).eq(4);
                for (const v of y) {
                    expect(v <= 100).eq(true);
                }
            },
        },
        {
            tag: "selectRandomNumbers",
            source: `<selectRandomNumbers name="x" numToSelect="2"/>`,
            copy: `<selectRandomNumbers name="y" copy="$x" numToSelect="4"/>`,
            variable: "selectedValues",
            check(y) {
                expect(y.length).eq(4);
                for (const v of y) {
                    expect(v >= 0 && v <= 1).eq(true);
                }
            },
        },
    ];

    for (const { tag, source, copy, variable, check } of cases) {
        it(`a <${tag}> copy with a different numToSelect makes its own choices, the same for a given variant`, async () => {
            const doenetML = `<p>${source}</p><p>${copy}</p>`;
            const copies: any[][] = [];
            for (const requestedVariantIndex of variantIndices) {
                const message = `variant ${requestedVariantIndex}`;
                const first = await choices({
                    doenetML,
                    requestedVariantIndex,
                    variable,
                });
                expect(first.errors, message).eqls([]);
                expect(first.x.length, message).eq(2);
                check(first.y);
                copies.push(first.y);

                // the same again for the same variant
                const again = await choices({
                    doenetML,
                    requestedVariantIndex,
                    variable,
                });
                expect(again.x, message).eqls(first.x);
                expect(again.y, message).eqls(first.y);

                // and when loaded with the variant the document generated
                const replayed = await choices({
                    doenetML,
                    requestedVariant: first.generatedVariantInfo,
                    variable,
                });
                expect(replayed.x, message).eqls(first.x);
                expect(replayed.y, message).eqls(first.y);
            }

            // its choices are its own, not its source's two and two more
            expect(new Set(copies.map((y) => JSON.stringify(y))).size).eq(
                variantIndices.length,
            );
        });
    }

    it("a copy that changes what is chosen keeps its choices through a reload", async () => {
        const doenetML = `
<p><select name="x" numToSelect="2">a b c d e</select></p>
<p><select name="y" copy="$x" numToSelect="4"/></p>`;
        const first = await choices({
            doenetML,
            requestedVariantIndex: 2,
            variable: "selectedIndices",
        });
        await first.core.saveImmediately();
        const reloaded = await choices({
            doenetML,
            requestedVariantIndex: 2,
            initialState: first.scoreState.state,
            variable: "selectedIndices",
        });
        expect(reloaded.x).eqls(first.x);
        expect(reloaded.y).eqls(first.y);
    });

    it("a <selectFromSequence> copy over a different range chooses from that range", async () => {
        const doenetML = `
<p><selectFromSequence name="x" from="1" to="100" numToSelect="2"/></p>
<p><selectFromSequence name="y" copy="$x" from="201" to="300"/></p>`;
        for (const requestedVariantIndex of variantIndices) {
            const { x, y, errors } = await choices({
                doenetML,
                requestedVariantIndex,
                variable: "selectedValues",
            });
            expect(errors).eqls([]);
            expect(x.length).eq(2);
            expect(y.length).eq(2);
            for (const v of y) {
                expect(v >= 201 && v <= 300).eq(true);
            }
        }
    });

    it("a <selectPrimeNumbers> copy over a smaller range chooses from that range", async () => {
        const doenetML = `
<p><selectPrimeNumbers name="x" from="50" to="100" numToSelect="2"/></p>
<p><selectPrimeNumbers name="y" copy="$x" to="10" from="1"/></p>`;
        for (const requestedVariantIndex of variantIndices) {
            const { y, errors } = await choices({
                doenetML,
                requestedVariantIndex,
                variable: "selectedValues",
            });
            expect(errors).eqls([]);
            expect(y.length).eq(2);
            for (const v of y) {
                expect([2, 3, 5, 7]).toContain(v);
            }
        }
    });

    it("a <select> copy with an option added chooses from all its options", async () => {
        const doenetML = `
<p><select name="x" numToSelect="2">a b</select></p>
<p><select name="y" copy="$x"><option><text>c</text></option></select></p>`;
        const seen = new Set<number>();
        for (const requestedVariantIndex of [1, 2, 3, 4, 5, 6, 7, 8]) {
            const { x, y, errors } = await choices({
                doenetML,
                requestedVariantIndex,
                variable: "selectedIndices",
            });
            expect(errors).eqls([]);
            expect([...x].sort()).eqls([1, 2]);
            expect(y.length).eq(2);
            for (const i of y) {
                seen.add(i);
            }
        }
        // the added option is chosen in some variant
        expect(seen.has(3)).eq(true);
    });

    it("a copy keeps its source's choices when it chooses from the same options in the same number", async () => {
        const doenetML = `
<p><select name="x" numToSelect="2">a b c d e</select></p>
<p><select name="y" copy="$x" numToSelect="2" hide="false"/></p>`;
        for (const requestedVariantIndex of variantIndices) {
            const { x, y, errors } = await choices({
                doenetML,
                requestedVariantIndex,
                variable: "selectedIndices",
            });
            expect(errors).eqls([]);
            expect(y).eqls(x);
        }

        const doenetML2 = `
<p><selectFromSequence name="x" from="1" to="100" numToSelect="2"/></p>
<p><selectFromSequence name="y" copy="$x" to=" 100 " displayDigits="5"/></p>`;
        for (const requestedVariantIndex of variantIndices) {
            const { x, y, errors } = await choices({
                doenetML: doenetML2,
                requestedVariantIndex,
                variable: "selectedValues",
            });
            expect(errors).eqls([]);
            expect(y).eqls(x);
        }

        // writing the default of an attribute its source left unwritten
        // changes nothing
        const doenetML3 = `
<p><select name="x">a b c d e</select></p>
<p><select name="y" copy="$x" numToSelect="1" withReplacement="false"/></p>`;
        const doenetML4 = `
<p><selectPrimeNumbers name="x" numToSelect="2"/></p>
<p><selectPrimeNumbers name="y" copy="$x" from="2" to="100"/></p>`;
        // nor does writing a value in another case or with spaces around
        // it, where the attribute ignores both
        const doenetML5 = `
<p><selectFromSequence name="x" type="letters" from="a" to="z" numToSelect="2"/></p>
<p><selectFromSequence name="y" copy="$x" type=" Letters "/></p>`;
        const doenetML6 = `
<p><selectRandomNumbers name="x" type="gaussian" numToSelect="2"/></p>
<p><selectRandomNumbers name="y" copy="$x" type="Gaussian"/></p>`;
        for (const [doenetML, variable] of [
            [doenetML3, "selectedIndices"],
            [doenetML4, "selectedValues"],
            [doenetML5, "selectedValues"],
            [doenetML6, "selectedValues"],
        ] as const) {
            for (const requestedVariantIndex of variantIndices) {
                const { x, y, errors } = await choices({
                    doenetML,
                    requestedVariantIndex,
                    variable,
                });
                expect(errors).eqls([]);
                expect(y).eqls(x);
            }
        }
    });

    it("an extend ignores the changed numToSelect and keeps its source's choices", async () => {
        const doenetML = `
<p><select name="x" numToSelect="2">a b c d e</select></p>
<p><select name="y" extend="$x" numToSelect="4"/></p>`;
        for (const requestedVariantIndex of variantIndices) {
            const { x, y, errors } = await choices({
                doenetML,
                requestedVariantIndex,
                variable: "selectedIndices",
            });
            expect(errors).eqls([]);
            expect(y).eqls(x);
        }
    });
});

/**
 * Choices given to a component that do not fit it, as from a variant saved
 * before its document changed, are reported rather than stopping the
 * document from loading.
 */
describe("Choices that do not fit are reported @group3", async () => {
    it("<select> reports doenet-e0037", async () => {
        const { generatedVariantInfo } = await choices({
            doenetML: `<select name="x" numToSelect="2">a b c d e</select><select name="y">f g</select>`,
            requestedVariantIndex: 1,
            variable: "selectedIndices",
        });
        const { x, errors } = await choices({
            doenetML: `<select name="x" numToSelect="4">a b c d e</select><select name="y">f g</select>`,
            requestedVariant: generatedVariantInfo,
            variable: "selectedIndices",
        });
        expect(x).eqls([]);
        expect(errors).toContain("doenet-e0037");
    });

    it("<selectRandomNumbers> reports doenet-e0048", async () => {
        const { generatedVariantInfo } = await choices({
            doenetML: `<selectRandomNumbers name="x" numToSelect="2"/><selectRandomNumbers name="y"/>`,
            requestedVariantIndex: 1,
            variable: "selectedValues",
        });
        const { x, errors } = await choices({
            doenetML: `<selectRandomNumbers name="x" numToSelect="4"/><selectRandomNumbers name="y"/>`,
            requestedVariant: generatedVariantInfo,
            variable: "selectedValues",
        });
        expect(x).eqls([]);
        expect(errors).toContain("doenet-e0048");
    });
});
