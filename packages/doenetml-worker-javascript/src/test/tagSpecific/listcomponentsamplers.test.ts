import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { movePoint, updateMathInputValue } from "../utils/actions";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * The random samplers and `<sequence>` as list components
 * (Doenet/DoenetML#2159): one component that holds its values, which a
 * parent reads, and the viewer draws, as one child per value, of the type
 * the values have.
 */
describe("Samplers and sequences as list components @group4", async () => {
    async function textsOf(
        core: any,
        resolvePathToNodeIdx: any,
        names: string[],
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        const texts: Record<string, string> = {};
        for (const name of names) {
            texts[name] =
                stateVariables[
                    await resolvePathToNodeIdx(name)
                ].stateValues.text;
        }
        return texts;
    }

    it("each kind of parent reads the values as children", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sequence name="n" from="2" to="5" />
    <sequence name="m" type="math" from="x" step="y" length="3" />
    <sequence name="l" type="letters" from="b" to="d" />
    <p name="pn">$n</p>
    <p name="pm">$m</p>
    <p name="pl">$l</p>
    <math name="mathN">$n</math>
    <math name="mathM">$m + 1</math>
    <text name="textL">$l</text>
    <p name="sumN"><sum>$n</sum></p>
    <p name="countL"><count>$l</count></p>
    <numberList name="nl">$n</numberList>
    <mathList name="ml">$m</mathList>
    <textList name="tl">$l</textList>
    <p name="index">$n[2] $m[3] $l[1]</p>
    <p name="indexBy">$l[$n[1]]</p>
    <point name="P">($n[1], $m[2])</point>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "pn",
                "pm",
                "pl",
                "mathN",
                "mathM",
                "textL",
                "sumN",
                "countL",
                "index",
                "indexBy",
            ]),
        ).eqls({
            pn: "2, 3, 4, 5",
            pm: "x, x + y, x + 2 y",
            pl: "b, c, d",
            mathN: "2, 3, 4, 5",
            mathM: "(x, x + y, x + 2 y) + 1",
            textL: "b, c, d",
            sumN: "14",
            countL: "3",
            index: "3 x + 2 y b",
            indexBy: "c",
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("nl")].stateValues
                .numbers,
        ).eqls([2, 3, 4, 5]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("ml")
            ].stateValues.maths.map((m: any) => m.tree),
        ).eqls(["x", ["+", "x", "y"], ["+", "x", ["*", 2, "y"]]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("tl")].stateValues.texts,
        ).eqls(["b", "c", "d"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues.xs.map(
                (m: any) => m.tree,
            ),
        ).eqls([2, ["+", "x", "y"]]);

        // a reference to the whole list is one component, not one per value
        for (const name of ["pn", "pm", "pl"]) {
            const children = stateVariables[
                await resolvePathToNodeIdx(name)
            ].activeChildren.filter((child: any) => typeof child === "object");
            expect(children.length, name).eq(1);
        }
    });

    it("a single selection reads as one value wherever it is used", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <selectFromSequence name="n" from="2" to="2" />
    <numberList name="l">10 20 30</numberList>
    <p name="p">$n</p>
    <math name="digits" displayDigits="$n">3.14159</math>
    <math name="expr">$n + 1</math>
    <number name="index">$l[$n]</number>
    <number name="value">$n</number>
    <p name="sum"><sum>$n $n</sum></p>
    `,
        });

        expect(
            await textsOf(core, resolvePathToNodeIdx, [
                "p",
                "digits",
                "expr",
                "index",
                "value",
                "sum",
            ]),
        ).eqls({
            p: "2",
            digits: "3.1",
            expr: "2 + 1",
            index: "20",
            value: "2",
            sum: "4",
        });
    });

    it("the values drawn for a given variant are those drawn before", async () => {
        // Drawn by the composites these components were, for each variant.
        const doenetML = `
<p name="a"><selectFromSequence from="1" to="100" numToSelect="5" /></p>
<p name="b"><selectFromSequence type="letters" from="a" to="z" numToSelect="3" /></p>
<p name="c"><selectFromSequence type="math" from="x" step="y" length="10" numToSelect="2" /></p>
<p name="d"><selectRandomNumbers numToSelect="3" type="discreteUniform" from="1" to="1000" /></p>
<p name="e"><sampleRandomNumbers numSamples="3" type="discreteUniform" from="1" to="1000" variantDeterminesSeed /></p>
<p name="f"><selectPrimeNumbers numToSelect="3" maxValue="1000" /></p>
<p name="g"><samplePrimeNumbers numSamples="3" maxValue="1000" variantDeterminesSeed /></p>
<p name="h"><sampleMultivariateRandomNumber type="hypergeometric" numInCategories="10 20 30" numDraws="12" variantDeterminesSeed /></p>
`;
        const expected: Record<number, Record<string, string>> = {
            "1": {
                a: "17, 32, 2, 28, 49",
                b: "c, g, s",
                c: "x + 9 y, x",
                d: "762, 528, 596",
                e: "863, 833, 223",
                f: "5, 67, 13",
                g: "571, 227, 163",
                h: "4, 4, 4",
            },
            "2": {
                a: "88, 71, 35, 28, 98",
                b: "b, x, r",
                c: "x + 5 y, x",
                d: "855, 426, 212",
                e: "332, 455, 693",
                f: "997, 521, 487",
                g: "179, 193, 719",
                h: "1, 5, 6",
            },
            "7": {
                a: "17, 12, 33, 31, 83",
                b: "l, s, p",
                c: "x + 6 y, x + 9 y",
                d: "176, 915, 856",
                e: "58, 903, 475",
                f: "241, 677, 503",
                g: "439, 101, 929",
                h: "3, 2, 7",
            },
        };
        for (const variant of [1, 2, 7]) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex: variant,
            });
            expect(
                await textsOf(core, resolvePathToNodeIdx, [..."abcdefgh"]),
                `variant ${variant}`,
            ).eqls(expected[variant]);
        }
    });

    it("a write to a sample that is not fixed is kept for that sample", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <sampleRandomNumbers name="ns" numSamples="3" type="discreteUniform" from="1" to="5" fixed="false" />
    <sampleRandomNumbers name="fixed" numSamples="3" type="discreteUniform" from="1" to="5" />
    <graph>
      <point name="P">($ns[2], 1)</point>
      <point name="Q">($fixed[2], 1)</point>
    </graph>
    <p name="pns">$ns</p>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        const before = [
            ...stateVariables[await resolvePathToNodeIdx("ns")].stateValues
                .numbers,
        ];
        const fixedBefore = [
            ...stateVariables[await resolvePathToNodeIdx("fixed")].stateValues
                .numbers,
        ];

        for (const name of ["P", "Q"]) {
            await movePoint({
                componentIdx: await resolvePathToNodeIdx(name),
                x: 4.3,
                y: 2,
                core,
            });
        }

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ns")].stateValues
                .numbers,
        ).eqls([before[0], 4.3, before[2]]);
        expect(
            stateVariables[await resolvePathToNodeIdx("pns")].stateValues.text,
        ).eq(`${before[0]}, 4.3, ${before[2]}`);
        expect(
            stateVariables[await resolvePathToNodeIdx("fixed")].stateValues
                .numbers,
        ).eqls(fixedBefore);
        expect(
            stateVariables[await resolvePathToNodeIdx("Q")].stateValues.xs[0]
                .tree,
        ).eq(fixedBefore[1]);
    });

    it("a value written to a sequence that is not fixed stays while only its length changes", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="n" prefill="2" />
    <mathInput name="from" prefill="1" />
    <p name="p"><sequence name="s" from="$from" length="$n" fixed="false" /></p>
    <mathInput name="mi" bindValueTo="$s[1]" />
    `,
        });

        async function check(text: string) {
            expect((await textsOf(core, resolvePathToNodeIdx, ["p"])).p).eq(
                text,
            );
        }

        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await check("7, 2");

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check("7, 2, 3");

        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("from"),
            core,
        });
        await check("5, 6, 7");
    });

    it("a value written to a selection is saved and read back", async () => {
        const doenetML = `
    <selectFromSequence name="s" from="1" to="10" numToSelect="2" fixed="false" />
    <p name="p">$s</p>
    <mathInput name="mi" bindValueTo="$s[2]" />
    `;
        const { core, resolvePathToNodeIdx, scoreState } = await createTestCore(
            {
                doenetML,
                requestedVariantIndex: 3,
            },
        );
        const first = (
            await textsOf(core, resolvePathToNodeIdx, ["p"])
        ).p.split(", ")[0];

        await updateMathInputValue({
            latex: "42",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        expect((await textsOf(core, resolvePathToNodeIdx, ["p"])).p).eq(
            `${first}, 42`,
        );

        await core.core!.saveImmediately();
        const reloaded = await createTestCore({
            doenetML,
            requestedVariantIndex: 3,
            initialState: scoreState.state,
        });
        expect(
            (await textsOf(reloaded.core, reloaded.resolvePathToNodeIdx, ["p"]))
                .p,
        ).eq(`${first}, 42`);
    });

    it("letters and primes are drawn by the renderers of their types", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="pl"><sequence name="l" type="letters" from="a" to="c" /></p>
    <p name="pp"><selectPrimeNumbers name="pr" numToSelect="2" minValue="2" maxValue="3" sort /></p>
    `,
        });

        const rendererState = (core as any).core.rendererInstructionBuilder
            .rendererState;
        async function drawn(name: string) {
            return rendererState[
                await resolvePathToNodeIdx(name)
            ].childrenInstructions
                .filter((child: any) => typeof child === "object" && child)
                .map((child: any) => [
                    child.componentType,
                    child.rendererType,
                    child.id,
                    rendererState[child.componentIdx].stateValues.text,
                ]);
        }

        expect(await drawn("pl")).eqls([
            ["text", "text", "l:1", "a"],
            ["text", "text", "l:2", "b"],
            ["text", "text", "l:3", "c"],
        ]);
        expect(await drawn("pp")).eqls([
            ["integer", "number", "pr:1", "2"],
            ["integer", "number", "pr:2", "3"],
        ]);
    });

    it("a selection that cannot be made shows its error after it", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<section name="sec"><p name="p"><selectFromSequence name="s" from="1" to="3" numToSelect="5" /></p></section>`,
        });

        const errors = getDiagnosticsByType(core).errors;
        expect(errors.length).eq(1);
        expect(errors[0].message).contain("Cannot select 5");

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("");
        expect(
            Object.values(stateVariables).filter(
                (c: any) => c.componentType === "_error",
            ).length,
        ).eq(1);
    });
});
