import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Load `doenetML` and return its errors, and the text of the `<p>` named
 * `p`, if there is one.
 */
async function load(doenetML: string, requestedVariantIndex = 1) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML,
        requestedVariantIndex,
    });
    const stateVariables = await core.returnAllStateVariables(false, true);
    const pIdx = await resolvePathToNodeIdx("p").catch(() => undefined);
    const p =
        typeof pIdx === "number"
            ? stateVariables[pIdx]?.stateValues.text
            : undefined;
    const diagnostics = getDiagnosticsByType(core);
    return {
        core,
        resolvePathToNodeIdx,
        stateVariables,
        p,
        errors: diagnostics.errors,
    };
}

/**
 * A random choice's parameters come from the DoenetML, the variant and the
 * choice's position, never from what a reader can change (D39, SEL-1): one
 * that reaches what a reader can change is an error at load, at the
 * parameter, in every variant.
 */
describe("A choice's parameter a reader can change is an error at load @group4", () => {
    const cases: {
        tag: string;
        doenetML: string;
        attribute: string;
        componentType: string;
        reference: string;
        changeableType: string;
        /** The text of the parameter as written, where the error is. */
        written: string;
    }[] = [
        {
            tag: "<select numToSelect> from an input",
            doenetML: `<mathInput name="n" prefill="2"/>
<p name="p">A <select name="s" numToSelect="$n">u v w</select> B</p>`,
            attribute: "numToSelect",
            componentType: "select",
            reference: "$n",
            changeableType: "mathInput",
            written: `numToSelect="$n"`,
        },
        {
            tag: "<selectFromSequence to> from an input's property",
            doenetML: `<mathInput name="n" prefill="5"/>
<p name="p">A <selectFromSequence name="s" to="$n.value"/> B</p>`,
            attribute: "to",
            componentType: "selectFromSequence",
            reference: "$n.value",
            changeableType: "mathInput",
            written: `to="$n.value"`,
        },
        {
            tag: "<selectFromSequence exclude> through a <number> reading an input",
            doenetML: `<mathInput name="n" prefill="2"/>
<number name="m">$n + 1</number>
<p name="p">A <selectFromSequence name="s" to="10" exclude="$m"/> B</p>`,
            attribute: "exclude",
            componentType: "selectFromSequence",
            reference: "$m",
            changeableType: "mathInput",
            written: `exclude="$m"`,
        },
        {
            tag: "<selectPrimeNumbers to> from a slider",
            doenetML: `<slider name="sl" from="10" to="20" step="1"/>
<p name="p">A <selectPrimeNumbers name="s" to="$sl"/> B</p>`,
            attribute: "to",
            componentType: "selectPrimeNumbers",
            reference: "$sl",
            changeableType: "slider",
            written: `to="$sl"`,
        },
        {
            tag: "<sampleRandomNumbers mean> from a number a dragged point writes to",
            doenetML: `<number name="a">3</number>
<graph><point>($a, 2)</point></graph>
<p name="p">A <sampleRandomNumbers name="s" type="gaussian" mean="$a"/> B</p>`,
            attribute: "mean",
            componentType: "sampleRandomNumbers",
            reference: "$a",
            changeableType: "number",
            written: `mean="$a"`,
        },
        {
            tag: "<selectRandomNumbers numToSelect> from a number an input is bound to",
            doenetML: `<number name="k">2</number>
<mathInput bindValueTo="$k"/>
<p name="p">A <selectRandomNumbers name="s" numToSelect="$k"/> B</p>`,
            attribute: "numToSelect",
            componentType: "selectRandomNumbers",
            reference: "$k",
            changeableType: "number",
            written: `numToSelect="$k"`,
        },
        {
            tag: "<samplePrimeNumbers numSamples> from an answer",
            doenetML: `<answer name="ans"><mathInput/><award>1</award></answer>
<p name="p">A <samplePrimeNumbers name="s" numSamples="$ans.creditAchieved"/> B</p>`,
            attribute: "numSamples",
            componentType: "samplePrimeNumbers",
            reference: "$ans.creditAchieved",
            changeableType: "answer",
            written: `numSamples="$ans.creditAchieved"`,
        },
        {
            tag: "an <option>'s selectWeight, an error of the <select>",
            doenetML: `<mathInput name="w" prefill="2"/>
<p name="p">A <select name="s"><option selectWeight="$w">u</option><option>v</option></select> B</p>`,
            attribute: "selectWeight",
            componentType: "select",
            reference: "$w",
            changeableType: "mathInput",
            written: `selectWeight="$w"`,
        },
        {
            tag: "a repeat's valueName, when the sequence's from is an input",
            doenetML: `<mathInput name="n" prefill="2"/>
<p name="p"><repeatForSequence from="$n" to="4" valueName="v"><selectFromSequence to="$v"/></repeatForSequence></p>`,
            attribute: "to",
            componentType: "selectFromSequence",
            reference: "$v",
            changeableType: "mathInput",
            written: `to="$v"`,
        },
        {
            tag: "a repeat's valueName, when the repeat is for an input's value",
            doenetML: `<mathInput name="n" prefill="2"/>
<p name="p"><repeat for="$n" valueName="v"><selectFromSequence to="$v"/></repeat></p>`,
            attribute: "to",
            componentType: "selectFromSequence",
            reference: "$v",
            changeableType: "mathInput",
            written: `to="$v"`,
        },
        {
            tag: "an index that reads an input, in a list reference",
            doenetML: `<mathInput name="i" prefill="1"/>
<numberList name="l">3 4 5</numberList>
<p name="p">A <selectFromSequence name="s" to="$l[$i]"/> B</p>`,
            attribute: "to",
            componentType: "selectFromSequence",
            reference: "$l[$i]",
            changeableType: "mathInput",
            written: `to="$l[$i]"`,
        },
    ];

    for (const c of cases) {
        it(c.tag, async () => {
            for (const requestedVariantIndex of [1, 2]) {
                const { errors } = await load(
                    c.doenetML,
                    requestedVariantIndex,
                );
                expect(errors.map((e) => e.code)).eqls(["doenet-e0070"]);
                const [error] = errors;
                expect(error.args).eqls({
                    attribute: c.attribute,
                    componentType: c.componentType,
                    reference: c.reference,
                    changeableType: c.changeableType,
                });
                // at the parameter, as written
                const start = error.position!.start.offset!;
                const end = error.position!.end.offset!;
                expect(c.doenetML.slice(start, end)).eq(c.written);
            }
        });
    }

    it("the message names the parameter, the reference and what can change", async () => {
        const { errors } = await load(
            `<mathInput name="n" prefill="2"/><select numToSelect="$n">u v w</select>`,
        );
        expect(errors[0].message).eq(
            "`numToSelect` of `<select>` reads `$n`, which reaches a `<mathInput>` that a reader can change. What a random choice chooses from must come from what the author wrote: literals, other random choices, content that can't change, and a repeat's `indexName`.",
        );
    });

    it("the choice chooses nothing, and a reference to it shows the error too, reported once", async () => {
        const { errors, stateVariables, resolvePathToNodeIdx } = await load(
            `<mathInput name="n" prefill="2"/><p name="p">A <select name="s" numToSelect="$n">u v w</select> B</p><p name="q">$s</p>`,
        );
        expect(errors.map((e) => e.code)).eqls(["doenet-e0070"]);
        const p = stateVariables[await resolvePathToNodeIdx("p")];
        expect(p.stateValues.text).not.toMatch(/[uvw]/);
    });

    it("a choice that extends or copies a choice in error is the same error, reported once", async () => {
        for (const tag of [
            "selectFromSequence",
            "selectPrimeNumbers",
            "sampleRandomNumbers",
        ]) {
            const { errors, p } = await load(`<mathInput name="n" prefill="20"/>
<p name="p">A <${tag} name="a" to="$n"/> <${tag} name="b" extend="$a"/> <${tag} name="c" copy="$b"/> B</p>`);
            expect(errors.map((e) => e.code)).eqls(["doenet-e0070"]);
            // none of them chooses anything
            expect(p).not.toMatch(/\d/);
        }
    });

    it("a choice in a case that isn't shown is reported at load", async () => {
        const { errors } = await load(`<mathInput name="n" prefill="2"/>
<booleanInput name="show"/>
<conditionalContent condition="$show">
  <select name="s" numToSelect="$n">u v w</select>
</conditionalContent>`);
        expect(errors.map((e) => e.code)).eqls(["doenet-e0070"]);
    });

    it("a choice in an option not picked is reported at load", async () => {
        for (const requestedVariantIndex of [1, 2, 3, 4]) {
            const { errors } = await load(
                `<mathInput name="n" prefill="2"/>
<select>
  <option>a</option>
  <option><selectFromSequence to="$n"/></option>
</select>`,
                requestedVariantIndex,
            );
            expect(errors.map((e) => e.code)).eqls(["doenet-e0070"]);
        }
    });

    it("an error once, with the other errors of the document, after the input changes", async () => {
        const { core, errors, resolvePathToNodeIdx } = await load(
            `<mathInput name="n" prefill="2"/><p name="p"><select name="s" numToSelect="$n">u v w</select></p>`,
        );
        expect(errors.map((e) => e.code)).eqls(["doenet-e0070"]);
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        expect(getDiagnosticsByType(core).errors.map((e) => e.code)).eqls([
            "doenet-e0070",
        ]);
    });
});

/**
 * What SEL-1 allows a parameter to read: literals, content that can't
 * change, other random choices, a repeat's `indexName` (whatever decides the
 * count), and its `valueName` when what it iterates over is allowed.
 */
describe("What a choice's parameter may read @group4", () => {
    const allowed: { tag: string; doenetML: string }[] = [
        {
            tag: "another random choice",
            doenetML: `<selectFromSequence name="a" from="3" to="5"/>
<selectFromSequence name="s" to="10" numToSelect="$a" exclude="$a"/>`,
        },
        {
            tag: "a <number> written as a literal",
            doenetML: `<number name="m">3</number>
<select name="s" numToSelect="$m">u v w</select>`,
        },
        {
            tag: "a <number> made of another choice",
            doenetML: `<selectFromSequence name="a" to="3"/>
<number name="m">$a + 2</number>
<selectFromSequence name="s" to="$m"/>`,
        },
        {
            tag: "a repeat's indexName, with the count from an input",
            doenetML: `<mathInput name="n" prefill="3"/>
<repeatForSequence to="$n" indexName="i"><selectFromSequence to="$i"/></repeatForSequence>`,
        },
        {
            tag: "a repeat's valueName, with the count from an input",
            doenetML: `<mathInput name="n" prefill="3"/>
<repeatForSequence from="2" to="$n" valueName="v"><selectFromSequence to="$v"/></repeatForSequence>`,
        },
        {
            tag: "a repeat's valueName, with whether the repeat is hidden from an input",
            doenetML: `<booleanInput name="b"/>
<repeat for="2 3" valueName="v" hide="$b"><selectFromSequence to="$v"/></repeat>
<repeatForSequence from="2" to="3" valueName="w" hide="$b"><selectFromSequence to="$w"/></repeatForSequence>`,
        },
        {
            tag: "a repeat's valueName, of a literal list",
            doenetML: `<repeat for="2 3 4" valueName="v"><selectFromSequence to="$v"/></repeat>`,
        },
        {
            tag: "a repeat's valueName, of another choice",
            doenetML: `<selectFromSequence name="a" from="2" to="9" numToSelect="2"/>
<repeat for="$a" valueName="v"><selectFromSequence to="$v"/></repeat>`,
        },
        {
            tag: "a number an input's prefill reads, which the input doesn't write to",
            doenetML: `<number name="k">3</number>
<mathInput prefill="$k"/>
<selectFromSequence name="s" to="$k"/>`,
        },
        {
            tag: "a point outside a graph, which a reader can't drag",
            doenetML: `<number name="a">3</number>
<point>($a, 2)</point>
<selectFromSequence name="s" to="$a"/>`,
        },
        {
            tag: "a number a fixed point in a graph reads",
            doenetML: `<number name="a">3</number>
<graph><point fixed>($a, 2)</point></graph>
<selectFromSequence name="s" to="$a"/>`,
        },
        {
            tag: "a label from an input, on a number",
            doenetML: `<textInput name="t"/>
<number name="m"><label>$t</label>3</number>
<selectFromSequence name="s" to="$m"/>`,
        },
        {
            tag: "a sort an input decides, which orders what was chosen",
            doenetML: `<booleanInput name="b"/>
<selectFromSequence name="s" to="10" numToSelect="3" sort="$b"/>`,
        },
        {
            tag: "an input inside an option, which is what is chosen",
            doenetML: `<select name="s"><option><mathInput/></option><option>x</option></select>`,
        },
    ];

    for (const { tag, doenetML } of allowed) {
        it(tag, async () => {
            const { errors } = await load(doenetML);
            expect(errors).eqls([]);
        });
    }
});

/**
 * A choice made later is the one its position gives (SEL-3): iteration
 * *k*'s choice depends only on the variant and *k*, not on when or in what
 * order the iterations were made, nor on a reload.
 */
describe("An iteration's choice is the one its position gives @group4", () => {
    const templates: { tag: string; doenetML: string }[] = [
        {
            tag: "<repeatForSequence>",
            doenetML: `<mathInput name="n" prefill="1"/>
<repeatForSequence name="r" to="$n" indexName="i">
  <selectFromSequence name="s" to="1000000" numToSelect="2"/>
</repeatForSequence>`,
        },
        {
            tag: "<repeatForSequence>, the choice reading the valueName",
            doenetML: `<mathInput name="n" prefill="1"/>
<repeatForSequence name="r" from="3" length="$n" valueName="v">
  <selectFromSequence name="s" to="$v" numToSelect="2"/>
</repeatForSequence>`,
        },
        {
            tag: "<repeatForSequence>, the choice in a <group>, reading the index",
            doenetML: `<mathInput name="n" prefill="1"/>
<repeatForSequence name="r" to="$n" indexName="i">
  <group><selectFromSequence name="t" to="1000000" from="$i"/><select name="s" numToSelect="3">a b c d e f g h</select></group>
</repeatForSequence>`,
        },
        {
            tag: "a sampler whose seed the variant decides",
            doenetML: `<mathInput name="n" prefill="1"/>
<repeatForSequence name="r" to="$n" valueName="v">
  <sampleRandomNumbers name="s" from="0" to="1" numSamples="2" variantDeterminesSeed/>
</repeatForSequence>`,
        },
    ];

    /**
     * The values chosen in iteration `k` of the repeat `r`: of its `s`, and
     * of its `t`, if it has one.
     */
    async function iterationValues(
        core: any,
        resolvePathToNodeIdx: any,
        k: number,
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        const values = [];
        for (const name of ["s", "t"]) {
            const idx = await resolvePathToNodeIdx(`r[${k}].${name}`).catch(
                () => undefined,
            );
            const stateValues = stateVariables[idx]?.stateValues;
            if (stateValues) {
                values.push(
                    stateValues.selectedValues ??
                        stateValues.sampledValues ??
                        stateValues.selectedIndices,
                );
            }
        }
        return values;
    }

    async function setCount(core: any, resolvePathToNodeIdx: any, n: number) {
        await updateMathInputValue({
            latex: String(n),
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
    }

    for (const { tag, doenetML } of templates) {
        it(tag, async () => {
            for (const requestedVariantIndex of [1, 2]) {
                // 1 → 5
                const direct = await createTestCore({
                    doenetML,
                    requestedVariantIndex,
                });
                await setCount(direct.core, direct.resolvePathToNodeIdx, 5);
                const valuesDirect: any[] = [];
                for (let k = 1; k <= 5; k++) {
                    valuesDirect.push(
                        await iterationValues(
                            direct.core,
                            direct.resolvePathToNodeIdx,
                            k,
                        ),
                    );
                }
                // the iterations differ from each other
                expect(
                    new Set(valuesDirect.map((v) => JSON.stringify(v))).size,
                ).eq(5);

                // 1 → 3 → 5
                const stepped = await createTestCore({
                    doenetML,
                    requestedVariantIndex,
                });
                await setCount(stepped.core, stepped.resolvePathToNodeIdx, 3);
                await setCount(stepped.core, stepped.resolvePathToNodeIdx, 5);
                for (let k = 1; k <= 5; k++) {
                    expect(
                        await iterationValues(
                            stepped.core,
                            stepped.resolvePathToNodeIdx,
                            k,
                        ),
                    ).eqls(valuesDirect[k - 1]);
                }

                // 1 → 5 → 2 → 5: shrinking and growing brings them back
                await setCount(stepped.core, stepped.resolvePathToNodeIdx, 2);
                await setCount(stepped.core, stepped.resolvePathToNodeIdx, 5);
                for (let k = 1; k <= 5; k++) {
                    expect(
                        await iterationValues(
                            stepped.core,
                            stepped.resolvePathToNodeIdx,
                            k,
                        ),
                    ).eqls(valuesDirect[k - 1]);
                }

                // 1 → 2, reloaded, then → 5
                const before = await createTestCore({
                    doenetML,
                    requestedVariantIndex,
                });
                await setCount(before.core, before.resolvePathToNodeIdx, 2);
                await before.core.saveImmediately();
                const stateVariables =
                    await before.core.returnAllStateVariables(false, true);
                const generatedVariantInfo = JSON.parse(
                    JSON.stringify(
                        stateVariables[
                            await before.resolvePathToNodeIdx("_document1")
                        ].stateValues.generatedVariantInfo,
                    ),
                );
                const reloaded = await createTestCore({
                    doenetML,
                    requestedVariant: generatedVariantInfo,
                    initialState: before.scoreState.state,
                });
                await setCount(reloaded.core, reloaded.resolvePathToNodeIdx, 5);
                for (let k = 1; k <= 5; k++) {
                    expect(
                        await iterationValues(
                            reloaded.core,
                            reloaded.resolvePathToNodeIdx,
                            k,
                        ),
                    ).eqls(valuesDirect[k - 1]);
                }
            }
        });
    }
});
