import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    movePoint,
    submitAnswer,
    updateBooleanInputValue,
    updateMathInputValue,
    updateSelectedIndices,
    updateTextInputValue,
} from "../utils/actions";
import { censusOfCore } from "../perf/census";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Value references (Doenet/DoenetML#2128): a bare `$n` that stands where only
 * a value is read becomes a `_ref` component shadowing one state variable of
 * its referent, in place of a full component of the referent's type carrying
 * shadow attribute components.
 *
 * These tests pin what a reference shows, where a write through it lands,
 * and what it creates. The census reads the JavaScript core's internals, so
 * the suite does not run on the Rust core.
 */
describe.skipIf(process.env.DOENET_TEST_CORE === "rust")(
    "Value references @group2",
    () => {
        /** The live `_ref` components, in index order. */
        function valueRefs(core: any) {
            return (Object.values(core.core._components) as any[])
                .filter((c) => c?.state && c.componentType === "_ref")
                .sort((a, b) => a.componentIdx - b.componentIdx);
        }

        it("a reference inside a leaf type is one small component", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="n">5</number>
    <number name="m">$n+1</number>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const nIdx = await resolvePathToNodeIdx("n");
            const mIdx = await resolvePathToNodeIdx("m");
            expect(stateVariables[mIdx].stateValues.value).eq(6);

            // the reference, its referent, the sugar `<math>` around `$n+1`,
            // and nothing else: no `_copy` resolves the reference for it
            const census = censusOfCore(core);
            expect(census.byType).eqls({
                document: 1,
                number: 2,
                math: 1,
                _ref: 1,
            });
            expect(census.attributeComponents).eq(0);
            expect(census.copies).eq(0);

            // it stands in for a `math` inside the `<math>`, reading `n.math`
            const [ref] = valueRefs(core);
            expect(ref.shadows).eq(undefined);
            const referentInfo = await ref.stateValues.referentInfo;
            expect(referentInfo.componentIdx).eq(nIdx);
            expect(referentInfo.variableName).eq("math");
            expect(referentInfo.referencedVariable).eq("value");
            expect(ref.presentedComponentType).eq("math");
        });

        it("follows the referent, and a write through it lands on the referent", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="mi">5</mathInput>
    <number name="n">$mi</number>
    <math name="m" simplify>$n+1</math>
    <mathInput name="bound" bindValueTo="$n" />
    `,
            });
            const nIdx = await resolvePathToNodeIdx("n");
            const mIdx = await resolvePathToNodeIdx("m");
            const miIdx = await resolvePathToNodeIdx("mi");

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables[nIdx].stateValues.value).eq(5);
            expect(stateVariables[mIdx].stateValues.value.tree).eq(6);

            await updateMathInputValue({
                latex: "7",
                componentIdx: miIdx,
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[nIdx].stateValues.value).eq(7);
            expect(stateVariables[mIdx].stateValues.value.tree).eq(8);

            // typed into the bound input, the value travels through the
            // reference in `bindValueTo`, then through the one in `n`, to `mi`
            await updateMathInputValue({
                latex: "10",
                componentIdx: await resolvePathToNodeIdx("bound"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[miIdx].stateValues.value.tree).eq(10);
            expect(stateVariables[nIdx].stateValues.value).eq(10);
            expect(stateVariables[mIdx].stateValues.value.tree).eq(11);

            expect(valueRefs(core)).toHaveLength(3);
        });

        it("display settings follow a direct reference, not an operand, and yield to the parent's own", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="n" displayDigits="5">5.123456</number>
    <number name="m1">$n</number>
    <number name="m2">$n+1</number>
    <math name="m3">$n</math>
    <math name="m4">$n+1</math>
    <number name="m5">2$n</number>
    <number name="m6" displayDigits="2">$n</number>
    <number name="m7" displayDecimals="1">$n</number>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const text = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .text;
            expect(await text("n")).eq("5.1235");
            expect(await text("m1")).eq("5.1235");
            expect(await text("m2")).eq("6.12");
            expect(await text("m3")).eq("5.1235");
            expect(await text("m4")).eq("5.12 + 1");
            expect(await text("m5")).eq("10.25");
            expect(await text("m6")).eq("5.1");
            expect(await text("m7")).eq("5.1");
        });

        it("stands in as the type its parent accepts", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="n">5</number>
    <math name="q">q</math>
    <text name="t">$n</text>
    <boolean name="b">$n > 3</boolean>
    <math name="m">$n</math>
    <number name="k">$q</number>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const value = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .value;
            expect(await value("t")).eq("5");
            expect(await value("b")).eq(true);
            expect((await value("m")).tree).eq(5);
            expect(await value("k")).eqls(NaN);

            const refs = [];
            for (const ref of valueRefs(core)) {
                refs.push([
                    ref.presentedComponentType,
                    (await ref.stateValues.referentInfo).variableName,
                ]);
            }
            expect(refs).eqls([
                ["text", "text"],
                ["number", "value"],
                ["math", "math"],
                ["math", "value"],
            ]);
        });

        it("a reference to an input is written through and shows the input's settings", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="mi">5</mathInput>
    <math name="m">$mi+1</math>
    <mathInput name="mi2" bindValueTo="$m" />
    <mathInput name="mi3" displayDigits="2">3.14159</mathInput>
    <math name="m3">$mi3</math>
    <text name="t">hello</text>
    <textInput name="ti" bindValueTo="$t" />
    `,
            });
            const miIdx = await resolvePathToNodeIdx("mi");
            const tIdx = await resolvePathToNodeIdx("t");

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("m3")].stateValues
                    .text,
            ).eq("3.1");

            await updateMathInputValue({
                latex: "10",
                componentIdx: await resolvePathToNodeIdx("mi2"),
                core,
            });
            await updateTextInputValue({
                text: "bye",
                componentIdx: await resolvePathToNodeIdx("ti"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[miIdx].stateValues.value.tree).eq(9);
            expect(stateVariables[tIdx].stateValues.value).eq("bye");
        });

        it("has no fixed of its own: a fixed referent refuses the write, a fixed parent does not fix the referent", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="a">1</number>
    <number name="b" fixed>2</number>
    <mathInput name="mi" bindValueTo="$a+$b" />
    <math name="fm" fixed>$a</math>
    <mathInput name="mi2" bindValueTo="$a" />
    `,
            });
            const aIdx = await resolvePathToNodeIdx("a");
            const bIdx = await resolvePathToNodeIdx("b");

            for (const ref of valueRefs(core)) {
                expect(await ref.stateValues.fixed).eq(undefined);
            }

            await updateMathInputValue({
                latex: "10",
                componentIdx: await resolvePathToNodeIdx("mi"),
                core,
            });
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables[aIdx].stateValues.value).eq(8);
            expect(stateVariables[bIdx].stateValues.value).eq(2);

            await updateMathInputValue({
                latex: "5",
                componentIdx: await resolvePathToNodeIdx("mi2"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[aIdx].stateValues.value).eq(5);
            expect(
                stateVariables[await resolvePathToNodeIdx("fm")].stateValues
                    .value.tree,
            ).eq(5);
        });

        it("a hidden referent does not hide the reference", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="n" hide>5</number>
    <math name="m" simplify>$n+1</math>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const m = stateVariables[await resolvePathToNodeIdx("m")];
            expect(m.stateValues.value.tree).eq(6);
            expect(m.stateValues.hidden).eq(false);
            const [ref] = valueRefs(core);
            expect(await ref.stateValues.hidden).eq(false);
        });

        it("an index into a list resolves itself and re-resolves as the index changes", async () => {
            // A `<numberList>` makes a `<number>` of each entry, so `$l[$i]`
            // reads a number whatever the index, and is a reference of its
            // own. The `$i` between its brackets reads a `<mathInput>`, a
            // math, and stays a copy.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="l">1 2 3 4</numberList>
    <mathInput name="i">2</mathInput>
    <number name="x">$l[$i]</number>
    `,
            });
            const xIdx = await resolvePathToNodeIdx("x");
            const iIdx = await resolvePathToNodeIdx("i");

            const xValue = async () =>
                (await core.returnAllStateVariables(false, true))[xIdx]
                    .stateValues.value;
            const refInX = () =>
                valueRefs(core).find((ref) => ref.parentIdx === xIdx);

            const ref = refInX();
            expect(ref.refResolution).toBeDefined();
            expect(ref.doenetAttributes.fixedReferent).toBeUndefined();
            expect(await xValue()).eq(2);
            expect(censusOfCore(core).copies).eq(1);

            for (const [latex, expected] of [
                ["3", 3],
                ["7", NaN],
                ["1", 1],
            ] as const) {
                await updateMathInputValue({ latex, componentIdx: iIdx, core });
                expect(await xValue()).eqls(expected);
                expect(refInX()).toBe(ref);
                expect(censusOfCore(core).copies).eq(1);
            }

            // past the last entry: the warning the copy gave, once, and no
            // info about a property
            const diagnostics = getDiagnosticsByType(core);
            const noReferent = diagnostics.warnings.filter(
                (w) => w.code === "doenet-w0104",
            );
            expect(noReferent).toHaveLength(1);
            expect(noReferent[0].message).eq(
                "No referent found for reference: `$l[$i]`",
            );
            expect(
                diagnostics.infos.filter((i) => i.code === "doenet-i0018"),
            ).toHaveLength(0);
        });

        it("an index between brackets that reads a number is a reference, rounded as an integer is", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="l">10 20 30 40</numberList>
    <number name="i">2.6</number>
    <mathInput name="mi" bindValueTo="$i" />
    <number name="x">$l[$i]</number>
    <math name="y">$l[$i-1]</math>
    `,
            });
            const miIdx = await resolvePathToNodeIdx("mi");
            const xIdx = await resolvePathToNodeIdx("x");
            const values = async () => {
                const sv = await core.returnAllStateVariables(false, true);
                return [
                    sv[xIdx].stateValues.value,
                    sv[await resolvePathToNodeIdx("y")].stateValues.value.tree,
                ];
            };

            // `$i` between the brackets of `$l[$i]`, and inside the
            // `<integer>` that `$i-1` is wrapped in, are references too
            expect(censusOfCore(core).copies).eq(0);
            const outer = valueRefs(core).find((ref) => ref.parentIdx === xIdx);
            const index = valueRefs(core).find(
                (ref) => ref.parentIdx === outer.componentIdx,
            );
            expect(index.presentedComponentType).eq("integer");
            expect((await index.stateValues.referentInfo).componentIdx).eq(
                await resolvePathToNodeIdx("i"),
            );

            expect(await values()).eqls([30, 20]);
            for (const [latex, expected] of [
                ["1.5", [20, 10]],
                ["-1", [NaN, "\uff3f"]],
                ["4.4", [40, 30]],
            ] as const) {
                await updateMathInputValue({
                    latex,
                    componentIdx: miIdx,
                    core,
                });
                expect(await values()).eqls(expected);
            }
        });

        it("repeat iterations index lists with no copy", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="l">10 20 30</numberList>
    <mathList name="ml">a b c</mathList>
    <numberList name="perm">3 1 2</numberList>
    <repeatForSequence from="1" to="3" indexName="i" name="r">
      <math name="m">$l[$i] + $ml[$i]</math>
      <number name="p">$l[$perm[$i]]</number>
    </repeatForSequence>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const letters = ["a", "b", "c"];
            const permuted = [30, 10, 20];
            for (let i = 1; i <= 3; i++) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`r[${i}].m`)]
                        .stateValues.value.tree,
                ).eqls(["+", 10 * i, letters[i - 1]]);
                expect(
                    stateVariables[await resolvePathToNodeIdx(`r[${i}].p`)]
                        .stateValues.value,
                ).eq(permuted[i - 1]);
            }
            const census = censusOfCore(core);
            expect(census.copies).eq(0);
            // the repeat's own index, one per iteration, and no integer made
            // from an index between brackets
            expect(census.byType.integer).eq(3);
        });

        it("an index into each list whose class fixes the type of its entries", async () => {
            // Every class that declares `replacementComponentType`, apart
            // from those whose type starts with `_`, which no author writes
            // (the three operator bases and `_variableNameList`), with a
            // document whose replacements are checked against it: a class
            // that declares a type its replacements do not have would hand
            // a reference's parent a value of the wrong kind.
            const lists: Record<string, string> = {
                numberList: `<numberList name="c">1 2 3</numberList>`,
                mathList: `<mathList name="c">x y z</mathList>`,
                matrixRow: `<matrixRow name="c">x y z</matrixRow>`,
                matrixColumn: `<matrixColumn name="c">x y z</matrixColumn>`,
                tupleList: `<tupleList name="c">(1,2) (3,4)</tupleList>`,
                textList: `<textList name="c">a b c</textList>`,
                booleanList: `<booleanList name="c">true false</booleanList>`,
                sampleRandomNumbers: `<sampleRandomNumbers name="c" numSamples="3" />`,
                selectRandomNumbers: `<selectRandomNumbers name="c" numToSelect="3" />`,
                sortIndices: `<sortIndices name="c">30 10 20</sortIndices>`,
                tally: `<tally name="c">1 2 2 3</tally>`,
                binCounts: `<binCounts name="c" bins="0 1 2">0 1/2 1 3/2</binCounts>`,
                indexOf: `<indexOf name="c" target="5 6 7">6 7</indexOf>`,
                searchSorted: `<searchSorted name="c" target="1 3 5">2 4</searchSorted>`,
                cumulativeSum: `<cumulativeSum name="c">1 2 3</cumulativeSum>`,
                cumulativeProduct: `<cumulativeProduct name="c">1 2 3</cumulativeProduct>`,
                cumulativeMin: `<cumulativeMin name="c">3 1 2</cumulativeMin>`,
                cumulativeMax: `<cumulativeMax name="c">1 3 2</cumulativeMax>`,
                differences: `<differences name="c">1 4 9</differences>`,
            };

            let declared: string[] | undefined;
            for (const [listType, listDoenetML] of Object.entries(lists)) {
                const { core: firstCore } = await createTestCore({
                    doenetML: listDoenetML,
                });
                const allComponentClasses =
                    firstCore.core!.componentInfoObjects.allComponentClasses;
                const entryType =
                    allComponentClasses[listType].replacementComponentType;
                declared ??= Object.entries(allComponentClasses)
                    .filter(
                        ([type, componentClass]: [string, any]) =>
                            componentClass.replacementComponentType !==
                                undefined && !type.startsWith("_"),
                    )
                    .map(([type]) => type)
                    .sort();

                // held by a component of the entries' own type
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `${listDoenetML}
    <${entryType} name="x">$c[2]</${entryType}>
    `,
                });
                const list =
                    core.core!._components[await resolvePathToNodeIdx("c")];
                const entries = list.replacements.filter(
                    (r: any) => typeof r === "object",
                );
                expect(
                    entries.map((r: any) => r.componentType),
                    listType,
                ).eqls(entries.map(() => entryType));

                const xIdx = await resolvePathToNodeIdx("x");
                const ref = valueRefs(core).find(
                    (ref) => ref.parentIdx === xIdx,
                );
                expect(ref?.refResolution, listType).toBeDefined();
                expect(
                    (await ref.stateValues.referentInfo).componentIdx,
                    listType,
                ).eq(entries[1].componentIdx);
                expect(await ref.stateValues.value, listType).eqls(
                    await entries[1].stateValues.value,
                );
                expect(censusOfCore(core).copies, listType).eq(0);
            }
            expect(declared).eqls(Object.keys(lists).sort());
        });

        it("a write through an index into a list lands on the entry, and one past its end is refused", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="l">1 2 3</numberList>
    <mathInput name="mi" bindValueTo="$l[2]" />
    <number name="x">$l[2]</number>
    <numberList name="lf" fixed>1 2 3</numberList>
    <mathInput name="mif" bindValueTo="$lf[2]" />
    <mathInput name="mip" bindValueTo="$l[5]" />
    `,
            });
            for (const name of ["mi", "mif", "mip"]) {
                await updateMathInputValue({
                    latex: "7",
                    componentIdx: await resolvePathToNodeIdx(name),
                    core,
                });
            }
            const sv = await core.returnAllStateVariables(false, true);
            // past the end there is no entry to take the value, so the input
            // goes on showing nothing, as one bound to `$P.xs[$i]` past a
            // point's last coordinate does
            expect(
                sv[await resolvePathToNodeIdx("mip")].stateValues.value.tree,
            ).eq("\uff3f");
            expect(
                sv[await resolvePathToNodeIdx("l")].stateValues.numbers,
            ).eqls([1, 7, 3]);
            expect(sv[await resolvePathToNodeIdx("x")].stateValues.value).eq(7);
            expect(
                sv[await resolvePathToNodeIdx("lf")].stateValues.numbers,
            ).eqls([1, 2, 3]);
            expect(
                sv[await resolvePathToNodeIdx("mif")].stateValues.value.tree,
            ).eq(2);
            expect(censusOfCore(core).copies).eq(0);
        });

        it("a copy of a component holding an index past the end of a list shows what the original shows", async () => {
            // `copy` remakes the reference inside the copy, which finds no
            // entry there either and holds the empty value
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="l">1 2 3</numberList>
    <p name="p"><math name="x">$l[5]+1</math></p>
    <p name="q" copy="$p" />
    `,
            });
            const sv = await core.returnAllStateVariables(false, true);
            for (const name of ["x", "q.x"]) {
                expect(
                    sv[await resolvePathToNodeIdx(name)].stateValues.value.tree,
                    name,
                ).eqls(["+", "\uff3f", 1]);
            }
        });

        it("an index into a list follows the list as it shrinks and grows", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="n">3</mathInput>
    <numberList name="l"><sequence length="$n" from="10" /></numberList>
    <number name="x">$l[3]</number>
    `,
            });
            const nIdx = await resolvePathToNodeIdx("n");
            const xIdx = await resolvePathToNodeIdx("x");
            const xValue = async () =>
                (await core.returnAllStateVariables(false, true))[xIdx]
                    .stateValues.value;
            const ref = valueRefs(core).find((ref) => ref.parentIdx === xIdx);

            expect(await xValue()).eq(12);
            for (const [latex, expected] of [
                ["2", NaN],
                ["4", 12],
                ["0", NaN],
                ["3", 12],
            ] as const) {
                await updateMathInputValue({ latex, componentIdx: nIdx, core });
                expect(await xValue()).eqls(expected);
                expect(
                    valueRefs(core).find((ref) => ref.parentIdx === xIdx),
                ).toBe(ref);
            }
        });

        it("an index that reads the component holding the reference is a circular dependency", async () => {
            // `i`'s value is the entry its own value picks out: the document
            // stops with the cycle, as `<number name="n">$n</number>` does
            await expect(
                createTestCore({
                    doenetML: `<numberList name="l">1 2 3</numberList><number name="i">$l[$i]</number>`,
                }),
            ).rejects.toThrow(
                "Circular dependency involving these components: <number> (line 1).",
            );
            // the same where the reference into the list keeps its copy: the
            // `$i` between its brackets is still read directly
            await expect(
                createTestCore({
                    doenetML: `<sequence name="s" from="1" to="3" /><number name="i">$s[$i]</number>`,
                }),
            ).rejects.toThrow(
                "Circular dependency involving these components: <number> (line 1), <_copy> (line 1).",
            );
        });

        it("a reference is remade when the referenced variable changes type", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <boolean name="b">false</boolean>
    <booleanInput name="bi" bindValueTo="$b" />
    <choiceInput name="ci">
      <choice><math>1</math></choice>
      <choice><math>2</math></choice>
      <conditionalContent condition="$b"><choice>hello</choice></conditionalContent>
    </choiceInput>
    <number name="x">$ci.selectedValue</number>
    <boolean name="y">$ci.selectedValue = 1</boolean>
    <text name="w">$ci.selectedValue</text>
    `,
            });
            const ciIdx = await resolvePathToNodeIdx("ci");
            const biIdx = await resolvePathToNodeIdx("bi");
            const xIdx = await resolvePathToNodeIdx("x");
            const yIdx = await resolvePathToNodeIdx("y");
            const wIdx = await resolvePathToNodeIdx("w");

            /**
             * What the holders show, and what the references to `ci`
             * present as.
             */
            async function state() {
                const sv = await core.returnAllStateVariables(false, true);
                return {
                    x: sv[xIdx].stateValues.value,
                    y: sv[yIdx].stateValues.value,
                    w: sv[wIdx].stateValues.value,
                    presented: valueRefs(core)
                        .filter(
                            (ref) =>
                                ref.doenetAttributes.fixedReferent
                                    ?.variableName === "selectedValue1",
                        )
                        .map((ref) => ref.presentedComponentType),
                };
            }

            await updateSelectedIndices({
                componentIdx: ciIdx,
                selectedIndices: [1],
                core,
            });
            // every choice is a math, so `selectedValue` is one: the
            // `<number>` and the `<boolean>` take a math directly, the
            // `<text>` would need an adapter and keeps a full copy
            expect(await state()).eqls({
                x: 1,
                y: true,
                w: "1",
                presented: ["math", "math"],
            });

            // a text choice appears and `selectedValue` becomes a text: the
            // references in the `<number>` and the `<boolean>` are remade as
            // texts, though old and new are both `_ref`s, and the `<text>`
            // now takes a reference directly
            await updateBooleanInputValue({
                boolean: true,
                componentIdx: biIdx,
                core,
            });
            expect(await state()).eqls({
                x: 1,
                y: true,
                w: "1",
                presented: ["text", "text", "text"],
            });

            await updateSelectedIndices({
                componentIdx: ciIdx,
                selectedIndices: [3],
                core,
            });
            expect(await state()).eqls({
                x: NaN,
                y: false,
                w: "hello",
                presented: ["text", "text", "text"],
            });

            await updateSelectedIndices({
                componentIdx: ciIdx,
                selectedIndices: [2],
                core,
            });
            await updateBooleanInputValue({
                boolean: false,
                componentIdx: biIdx,
                core,
            });
            expect(await state()).eqls({
                x: 2,
                y: false,
                w: "2",
                presented: ["math", "math"],
            });
        });

        it("a reference to an entry with no value holds what its type holds", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <boolean name="b">true</boolean>
    <booleanInput name="bi" bindValueTo="$b" />
    <choiceInput name="ci">
      <choice><math>1</math></choice>
      <conditionalContent condition="$b"><choice><math>2</math></choice></conditionalContent>
    </choiceInput>
    <choiceInput name="ct">
      <choice>one</choice>
      <conditionalContent condition="$b"><choice>two</choice></conditionalContent>
    </choiceInput>
    <number name="x">$ci.selectedValue</number>
    <math name="z">$ci.selectedValue + 1</math>
    <boolean name="y">$ci.selectedValue = 2</boolean>
    <text name="w">$ct.selectedValue</text>
    `,
            });
            const ciIdx = await resolvePathToNodeIdx("ci");
            const ctIdx = await resolvePathToNodeIdx("ct");
            const biIdx = await resolvePathToNodeIdx("bi");
            const xIdx = await resolvePathToNodeIdx("x");
            const zIdx = await resolvePathToNodeIdx("z");
            const yIdx = await resolvePathToNodeIdx("y");
            const wIdx = await resolvePathToNodeIdx("w");

            async function state() {
                const sv = await core.returnAllStateVariables(false, true);
                return {
                    x: sv[xIdx].stateValues.value,
                    z: sv[zIdx].stateValues.value.tree,
                    y: sv[yIdx].stateValues.value,
                    w: sv[wIdx].stateValues.value,
                };
            }

            await updateSelectedIndices({
                componentIdx: ciIdx,
                selectedIndices: [2],
                core,
            });
            await updateSelectedIndices({
                componentIdx: ctIdx,
                selectedIndices: [2],
                core,
            });
            expect(await state()).eqls({
                x: 2,
                z: ["+", 2, 1],
                y: true,
                w: "two",
            });
            expect(
                valueRefs(core)
                    .filter(
                        (ref) =>
                            ref.doenetAttributes.fixedReferent?.variableName ===
                            "selectedValue1",
                    )
                    .map((ref) => ref.presentedComponentType),
            ).eqls(["math", "math", "math", "text"]);

            // the selected choices are gone, and the selection stays: the
            // referenced entry has no value, and each reference holds what
            // a component of its type holds in that case, as the full copy did
            await updateBooleanInputValue({
                boolean: false,
                componentIdx: biIdx,
                core,
            });
            expect(await state()).eqls({
                x: NaN,
                z: ["+", "＿", 1],
                y: false,
                w: "",
            });

            await updateSelectedIndices({
                componentIdx: ciIdx,
                selectedIndices: [1],
                core,
            });
            await updateSelectedIndices({
                componentIdx: ctIdx,
                selectedIndices: [1],
                core,
            });
            expect(await state()).eqls({
                x: 1,
                z: ["+", 1, 1],
                y: false,
                w: "one",
            });
        });

        it("a reference as the content of an attribute", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="mi">4</mathInput>
    <number name="n">$mi</number>
    <math name="m" displayDigits="$n">3.123456x</math>
    `,
            });
            const mIdx = await resolvePathToNodeIdx("m");
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables[mIdx].stateValues.text).eq("3.123 x");

            await updateMathInputValue({
                latex: "2",
                componentIdx: await resolvePathToNodeIdx("mi"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[mIdx].stateValues.text).eq("3.1 x");

            // one for `$mi` inside `n`, one for `$n` inside the attribute
            expect(valueRefs(core)).toHaveLength(2);
            expect(censusOfCore(core).byType.boolean).toBeUndefined();
        });

        it("extending or copying a component that holds a reference", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="n">5</number>
    <math name="m" simplify>$n+1</math>
    <math extend="$m" name="m2" />
    <math copy="$m" name="m3" />
    <mathInput name="mi" bindValueTo="$n" />
    `,
            });
            const value = async (name: string) =>
                (await core.returnAllStateVariables(false, true))[
                    await resolvePathToNodeIdx(name)
                ].stateValues.value.tree;

            expect(await value("m")).eq(6);
            expect(await value("m2")).eq(6);
            expect(await value("m3")).eq(6);

            await updateMathInputValue({
                latex: "7",
                componentIdx: await resolvePathToNodeIdx("mi"),
                core,
            });
            expect(await value("m")).eq(8);
            expect(await value("m2")).eq(8);
            // the unlinked copy of `m` copied its definition, `$n+1`, whose
            // reference to `n` is outside what was copied and stays linked
            expect(await value("m3")).eq(8);
        });

        it("repeat iterations", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <repeatForSequence from="1" to="4" valueName="i" name="r">
      <number name="sq">$i^2</number>
    </repeatForSequence>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (let i = 1; i <= 4; i++) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`r[${i}].sq`)]
                        .stateValues.value,
                ).eq(i ** 2);
            }
            expect(valueRefs(core)).toHaveLength(4);
            const census = censusOfCore(core);
            expect(census.byType.boolean).toBeUndefined();
            expect(census.byType.integer).toBeUndefined();
        });

        it("in a function, and to a coordinate of a point with its display settings", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="a">2</number>
    <function name="f">$a x^2</function>
    <evaluate function="$f" input="3" name="e" />
    <graph>
      <point name="P">(1,2)</point>
      <point name="Q" displayDigits="2">(1.23456,2)</point>
    </graph>
    <number name="px">$P.x</number>
    <math name="qx">$Q.x</math>
    `,
            });
            const pxIdx = await resolvePathToNodeIdx("px");
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("e")].stateValues
                    .value.tree,
            ).eq(18);
            expect(stateVariables[pxIdx].stateValues.value).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx("qx")].stateValues
                    .text,
            ).eq("1.2");

            await movePoint({
                componentIdx: await resolvePathToNodeIdx("P"),
                x: 4,
                y: 5,
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[pxIdx].stateValues.value).eq(4);
        });

        it("operators that ask whether a child is a number", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="a">2</number>
    <number name="b">3</number>
    <math name="x">x</math>
    <sum name="s">$a $b</sum>
    <sum name="s2">$a $x</sum>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const s = stateVariables[await resolvePathToNodeIdx("s")];
            const s2 = stateVariables[await resolvePathToNodeIdx("s2")];
            expect(s.stateValues.value.tree).eq(5);
            expect(s.stateValues.isNumber).eq(true);
            expect(s2.stateValues.value.tree).eqls(["+", 2, "x"]);
            expect(s2.stateValues.isNumber).eq(false);
        });

        it("a text reference to a boolean is written through its text", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <boolean name="b">true</boolean>
    <text name="bt">$b</text>
    <textInput name="ti" bindValueTo="$b" />
    `,
            });
            const bIdx = await resolvePathToNodeIdx("b");
            const btIdx = await resolvePathToNodeIdx("bt");
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables[btIdx].stateValues.value).eq("true");

            await updateTextInputValue({
                text: "false",
                componentIdx: await resolvePathToNodeIdx("ti"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[bIdx].stateValues.value).eq(false);
            expect(stateVariables[btIdx].stateValues.value).eq("false");
        });

        it("a collect gathers the referent where it stands, not the reference", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <section name="s">
      <number name="n">5</number>
      <math name="q">$n+1</math>
      <text name="t">$n</text>
      <boolean name="b">$n > 3</boolean>
    </section>
    <collect componentType="number" from="$s" name="cn" />
    <collect componentType="math" from="$s" name="cm" />
    <p name="pn">$cn</p>
    <p name="pm">$cm</p>
    `,
            });
            // the three references are `_ref`s, which a collect of numbers
            // does not gather; the full copies of `n` they replace inside
            // `q`, `t` and `b` were gathered, listing `n` four times. (The
            // collect's copy of `q`, and the paragraph's copy of that, carry
            // whole shadows of the reference in `q`.)
            expect(valueRefs(core).filter((ref) => !ref.shadows)).toHaveLength(
                3,
            );
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("pn")].stateValues
                    .text,
            ).eq("5");
            expect(
                stateVariables[await resolvePathToNodeIdx("pm")].stateValues
                    .text,
            ).eq("5 + 1");
        });

        it("a reference given a type by extend keeps the component it asks for", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <graph><point name="P">(1,2)</point></graph>
    <math name="m" simplify><number extend="$P.x" name="px" />+1</math>
    <p name="p">$px and $px.value</p>
    `,
            });
            // `extend` sets `createComponentOfType`, so even under a parent
            // that only reads values the reference is not a `_ref`: the
            // `number` it asks for exists, carries the name, and can itself
            // be referenced
            expect(valueRefs(core)).toHaveLength(0);
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const px = stateVariables[await resolvePathToNodeIdx("px")];
            expect(px.componentType).eq("number");
            expect(px.stateValues.value).eq(1);
            expect(
                stateVariables[await resolvePathToNodeIdx("m")].stateValues
                    .value.tree,
            ).eq(2);
            expect(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .text,
            ).eq("1 and 1");
        });

        it("what the referent says of its value applies only to a reference to that value", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <math name="m" unordered>(1,2)</math>
    <math name="m2">$m.value</math>
    <math name="e">$m.x</math>
    <matrix name="M"><row>1 2</row></matrix>
    <sum name="s">$M.matrixEntry1_1</sum>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            // `$m.value` is `m`'s own value, so it is unordered as `m` is
            expect((await sv("m2")).unordered).eq(true);
            // a component of an unordered tuple is a plain scalar
            expect((await sv("e")).unordered).eq(false);
            expect((await sv("e")).value.tree).eq(1);
            // a matrix is not a number, but its entry is
            expect((await sv("s")).isNumericOperator).eq(true);
            expect((await sv("s")).value.tree).eq(1);
            const primary = [];
            for (const ref of valueRefs(core)) {
                primary.push(
                    (await ref.stateValues.referentInfo).referencedPrimaryValue,
                );
            }
            expect(primary).eqls([true, false, false]);
        });

        it("a position that renders, or a list, still gets a full copy", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="n">5</number>
    <p name="p">$n</p>
    <mathList name="ml">$n</mathList>
    `,
            });
            expect(valueRefs(core)).toHaveLength(0);
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .text,
            ).eq("5");
            expect(
                stateVariables[await resolvePathToNodeIdx("ml")].stateValues
                    .maths[0].tree,
            ).eq(5);
        });

        it("a referent that may not be modified indirectly is left alone, and the write goes to the other operand", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="a" modifyIndirectly="false">2</mathInput>
    <mathInput name="b">3</mathInput>
    <mathInput name="s" bindValueTo="$a+$b" />
    <math name="p">2$a</math>
    <mathInput name="sp" bindValueTo="$p" />
    `,
            });
            const aIdx = await resolvePathToNodeIdx("a");
            const bIdx = await resolvePathToNodeIdx("b");

            // the reference to `a` answers `canBeModified` from `a`'s
            // `modifyIndirectly`, so the sum's inverse writes `b`
            await updateMathInputValue({
                latex: "10",
                componentIdx: await resolvePathToNodeIdx("s"),
                core,
            });
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables[aIdx].stateValues.value.tree).eq(2);
            expect(stateVariables[bIdx].stateValues.value.tree).eq(8);

            // with no other operand to take it, the write is refused
            await updateMathInputValue({
                latex: "10",
                componentIdx: await resolvePathToNodeIdx("sp"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[aIdx].stateValues.value.tree).eq(2);
            expect(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .value.tree,
            ).eqls(["*", 2, 2]);
        });

        it("an extended holder's reference follows the chain to the referent's settings and takes a write", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="n" displayDigits="5">5.123456</number>
    <number name="m">$n</number>
    <number extend="$m" name="m2" />
    <mathInput name="mi" bindValueTo="$m2" />
    `,
            });
            const nIdx = await resolvePathToNodeIdx("n");
            const m2Idx = await resolvePathToNodeIdx("m2");

            // the reference in `m2` is a whole shadow of the one in `m`, so
            // its referent, and with it its display settings, is `n`, at the
            // end of the chain
            const mIdx = await resolvePathToNodeIdx("m");
            const inM = valueRefs(core).find((ref) => ref.parentIdx === mIdx);
            const inM2 = valueRefs(core).find((ref) => ref.parentIdx === m2Idx);
            expect(inM.shadows).eq(undefined);
            expect((await inM.stateValues.referentInfo).componentIdx).eq(nIdx);
            expect(inM2.shadows.componentIdx).eq(inM.componentIdx);
            expect(inM2.shadows.propVariable).eq(undefined);
            expect((await inM2.stateValues.referentInfo).componentIdx).eq(nIdx);

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables[m2Idx].stateValues.text).eq("5.1235");

            await updateMathInputValue({
                latex: "7.654321",
                componentIdx: await resolvePathToNodeIdx("mi"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[nIdx].stateValues.value).eq(7.654321);
            expect(stateVariables[m2Idx].stateValues.text).eq("7.6543");
        });

        it("several references from one copy inside a math form a list", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <graph><point name="P">(1,2)</point></graph>
    <math name="m">$P.xs</math>
    <math name="m2">($P.xs)</math>
    <math name="m3">f($P.xs)</math>
    `,
            });
            // each coordinate is a reference; between them the copy puts the
            // commas a list of inline components gets, so the math reads a
            // list, not a product
            expect(valueRefs(core)).toHaveLength(6);
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const value = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .value.tree;
            expect(await value("m")).eqls(["list", 1, 2]);
            expect(await value("m2")).eqls(["tuple", 1, 2]);
            expect(await value("m3")).eqls(["apply", "f", ["tuple", 1, 2]]);
        });

        it("unordered follows the referent into a comparison and into the holder", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <math name="u" unordered>(1,2)</math>
    <boolean name="b1">$u = (2,1)</boolean>
    <boolean name="b2">(1,2) = (2,1)</boolean>
    <math name="m">$u</math>
    <boolean name="b3">$m = (2,1)</boolean>
    <math name="m3">$m</math>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            expect((await sv("b1")).value).eq(true);
            expect((await sv("b2")).value).eq(false);
            expect((await sv("m")).unordered).eq(true);
            // `m` is unordered because of what it holds, not by an attribute
            // of its own, and a reference to it is unordered all the same
            expect((await sv("b3")).value).eq(true);
            expect((await sv("m3")).unordered).eq(true);
        });

        it("a referent that cannot be changed leaves a write to the other operand", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="r" fixed>1</mathInput>
    <math name="w">2</math>
    <mathInput name="mi" bindValueTo="$r + $w" />
    <math name="a" fixed>1</math>
    <math name="r2">$a</math>
    <math name="w2">2</math>
    <mathInput name="mi2" bindValueTo="$r2 + $w2" />
    `,
            });
            const value = async (name: string) =>
                (await core.returnAllStateVariables(false, true))[
                    await resolvePathToNodeIdx(name)
                ].stateValues.value.tree;

            // a fixed input
            await updateMathInputValue({
                latex: "10",
                componentIdx: await resolvePathToNodeIdx("mi"),
                core,
            });
            expect(await value("r")).eq(1);
            expect(await value("w")).eq(9);

            // `r2` is not fixed, but all it holds is a fixed component
            await updateMathInputValue({
                latex: "10",
                componentIdx: await resolvePathToNodeIdx("mi2"),
                core,
            });
            expect(await value("r2")).eq(1);
            expect(await value("w2")).eq(9);
        });

        it("a reference made from the document resolves itself, with no copy", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <number name="n">5</number>
    <math name="m">$n+1</math>
    <math name="d" displayDigits="$n">3.14159265</math>
    <graph><point name="P">(3,4)</point></graph>
    <number name="px">$P.x</number>
    <boolean name="b">$n > 3</boolean>
    <mathInput name="mi">x</mathInput>
    <mathInput name="mi2" bindValueTo="$mi.immediateValue" />
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            expect((await sv("m")).value.tree).eqls(["+", 5, 1]);
            expect((await sv("d")).text).eq("3.1416");
            expect((await sv("px")).value).eq(3);
            expect((await sv("b")).value).eq(true);
            expect((await sv("mi2")).value.tree).eq("x");

            // five references, each carrying the reference it resolves, no
            // `_copy` to resolve it for it and nothing it shadows
            const census = censusOfCore(core);
            expect(census.copies).eq(0);
            expect(census.shadows).eq(0);
            const refs = valueRefs(core);
            expect(refs).toHaveLength(5);
            const infos = [];
            for (const ref of refs) {
                expect(ref.refResolution).toBeDefined();
                expect(ref.doenetAttributes.fixedReferent).toBeUndefined();
                infos.push(await ref.stateValues.referentInfo);
            }
            const pIdx = await resolvePathToNodeIdx("P");
            const miIdx = await resolvePathToNodeIdx("mi");
            expect(
                infos.find((info) => info.componentIdx === pIdx).variableName,
            ).eq("x1");
            expect(
                infos.find((info) => info.componentIdx === miIdx).variableName,
            ).eq("immediateValue");
        });

        it("a reference made from the document re-resolves as its index changes", async () => {
            // `$P.xs[$i]` reads one coordinate of a point, so the document
            // fixes its type and it is a reference of its own, with the `$i`
            // between its brackets (which stays a copy). As `i` changes, the
            // same reference resolves to another entry; past the last
            // coordinate it reads nothing.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="i">1</mathInput>
    <graph><point name="P">(3,4)</point></graph>
    <number name="a">$P.xs[$i]</number>
    `,
            });
            const iIdx = await resolvePathToNodeIdx("i");
            const aIdx = await resolvePathToNodeIdx("a");
            const aValue = async () =>
                (await core.returnAllStateVariables(false, true))[aIdx]
                    .stateValues.value;
            const refInA = () =>
                valueRefs(core).find((ref) => ref.parentIdx === aIdx);

            const ref = refInA();
            expect(ref.refResolution).toBeDefined();
            expect(ref.doenetAttributes.fixedReferent).toBeUndefined();
            expect((await ref.stateValues.referentInfo).variableName).eq("x1");
            expect(await aValue()).eq(3);
            expect(censusOfCore(core).copies).eq(1);

            for (const [latex, variableName, expected] of [
                ["2", "x2", 4],
                ["3", "x3", NaN],
                ["1", "x1", 3],
            ] as const) {
                await updateMathInputValue({ latex, componentIdx: iIdx, core });
                expect(await aValue()).eqls(expected);
                expect(refInA()).toBe(ref);
                expect((await ref.stateValues.referentInfo).variableName).eq(
                    variableName,
                );
            }
        });

        it("a reference made from the document says when its index is not a number", async () => {
            // An index that is not a number names no property. A reference
            // that resolves itself says so as a copy does, at the reference
            // and with the path the author wrote, whether the index is
            // written (`x`) or is a component's value (`$i` once `i` is not
            // a number, also when that happens after load), and says it
            // once.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="i">1</mathInput>
    <graph><point name="P">(3,4)</point></graph>
    <math name="a">$P.xs[x]</math>
    <math name="b">$P.xs[$i]</math>
    `,
            });
            const iIdx = await resolvePathToNodeIdx("i");
            const aIdx = await resolvePathToNodeIdx("a");
            const bIdx = await resolvePathToNodeIdx("b");
            const values = async () => {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                return [aIdx, bIdx].map(
                    (idx) => stateVariables[idx].stateValues.value.tree,
                );
            };
            const notFound = () =>
                getDiagnosticsByType(core)
                    .infos.filter((info) => info.code === "doenet-i0018")
                    .map((info) => [info.message, info.position?.start.line]);
            const notFoundX = [
                "Could not find prop xs[x] on a component of type point",
                4,
            ];
            const notFoundI = [
                "Could not find prop xs[$i] on a component of type point",
                5,
            ];

            // both are references of their own; the copy is the `$i`
            expect(valueRefs(core).length).eq(2);
            expect(censusOfCore(core).copies).eq(1);
            expect(await values()).eqls(["\uff3f", 3]);
            expect(notFound()).eqls([notFoundX]);

            // the report arrives when the index stops being a number, and
            // a second such index says nothing more
            for (const [latex, expected] of [
                ["x", "\uff3f"],
                ["2", 4],
                ["y", "\uff3f"],
            ] as const) {
                await updateMathInputValue({ latex, componentIdx: iIdx, core });
                expect(await values()).eqls(["\uff3f", expected]);
                expect(notFound()).eqls([notFoundX, notFoundI]);
            }
        });

        it("a reference to the component an extend makes waits for it", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <graph><point name="P">(3,4)</point></graph>
    <number extend="$P.x" name="px" />
    <math name="m" simplify>$px+1</math>
    `,
            });
            const mIdx = await resolvePathToNodeIdx("m");
            const pxIdx = await resolvePathToNodeIdx("px");
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables[mIdx].stateValues.value.tree).eq(4);

            const [ref] = valueRefs(core).filter(
                (ref) => ref.parentIdx === mIdx,
            );
            expect(ref.refResolution).toBeDefined();
            expect(await ref.stateValues.extendIdx).eq(pxIdx);

            await movePoint({
                componentIdx: await resolvePathToNodeIdx("P"),
                x: 7,
                y: 4,
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[mIdx].stateValues.value.tree).eq(8);
        });

        it("a referent that is remade is read again by the same reference", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="k">3</mathInput>
    <sequence name="s" to="$k" />
    <number extend="$s[2]" name="n2" />
    <math name="m">$n2+1</math>
    `,
            });
            const mIdx = await resolvePathToNodeIdx("m");
            const kIdx = await resolvePathToNodeIdx("k");
            const mValue = async () =>
                (await core.returnAllStateVariables(false, true))[mIdx]
                    .stateValues.value.tree;
            const refInM = () =>
                valueRefs(core).find((ref) => ref.parentIdx === mIdx);

            expect(await mValue()).eqls(["+", 2, 1]);
            const ref = refInM();
            expect(ref.refResolution).toBeDefined();
            expect((await ref.stateValues.referentInfo).componentIdx).eq(
                await resolvePathToNodeIdx("n2"),
            );

            // the sequence shrinks below the second item: `n2` is made with
            // nothing to extend and holds `NaN`, and the reference follows it
            await updateMathInputValue({
                latex: "1",
                componentIdx: kIdx,
                core,
            });
            expect(await mValue()).eqls(["+", NaN, 1]);
            expect(refInM()).toBe(ref);

            await updateMathInputValue({
                latex: "5",
                componentIdx: kIdx,
                core,
            });
            expect(await mValue()).eqls(["+", 2, 1]);
            expect(refInM()).toBe(ref);
        });

        it("an unlinked copy of a holder re-resolves its reference inside the copy", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <section name="s">
      <mathInput name="mi">3</mathInput>
      <math name="m" simplify>$mi+1</math>
    </section>
    <section copy="$s" name="s2" />
    `,
            });
            const value = async (name: string) =>
                (await core.returnAllStateVariables(false, true))[
                    await resolvePathToNodeIdx(name)
                ].stateValues.value.tree;
            expect(await value("s.m")).eq(4);
            expect(await value("s2.m")).eq(4);

            await updateMathInputValue({
                latex: "5",
                componentIdx: await resolvePathToNodeIdx("s2.mi"),
                core,
            });
            expect(await value("s2.m")).eq(6);
            expect(await value("s.m")).eq(4);

            await updateMathInputValue({
                latex: "10",
                componentIdx: await resolvePathToNodeIdx("s.mi"),
                core,
            });
            expect(await value("s.m")).eq(11);
            expect(await value("s2.m")).eq(6);
        });

        it("a reference whose type the document does not fix keeps its copy", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <numberList name="l">1 2 3</numberList>
    <repeat for="$l" valueName="v" name="r">
      <number name="p">$v+1</number>
    </repeat>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (let i = 1; i <= 3; i++) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`r[${i}].p`)]
                        .stateValues.value,
                ).eq(i + 1);
            }
            // the item a `<repeat>` iterates over is whatever its list holds,
            // so each `$v` is resolved by a copy, which fixes its target
            const refs = valueRefs(core);
            expect(refs).toHaveLength(3);
            for (const ref of refs) {
                expect(ref.refResolution).toBeUndefined();
                expect(ref.doenetAttributes.fixedReferent).toBeDefined();
            }
            expect(censusOfCore(core).copies).toBeGreaterThanOrEqual(3);
        });

        it("a repeatForSequence type the attribute does not allow makes numbers, and the references read them", async () => {
            // `type="text"` is not a sequence type: the attribute falls back
            // to `number`, so each `$v` must be planned as a number, not as
            // the text the document names. `LETTERS` is allowed once
            // lower-cased, and makes texts.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <repeatForSequence name="r" from="1" to="2" type="text" valueName="v" indexName="i">
      <text name="t">$v</text>
      <math name="m">$v+$i</math>
    </repeatForSequence>
    <repeatForSequence name="s" from="a" to="b" type="LETTERS" valueName="w">
      <text name="t">$w!</text>
    </repeatForSequence>
    `,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            expect((await sv("r[1].t")).value).eq("1");
            expect((await sv("r[2].t")).value).eq("2");
            expect((await sv("r[1].m")).value.tree).eqls(["+", 1, 1]);
            expect((await sv("r[2].m")).value.tree).eqls(["+", 2, 2]);
            expect((await sv("s[1].t")).value).eq("a!");
            expect((await sv("s[2].t")).value).eq("b!");

            // every reference resolves itself and reads what the repeat made
            const refs = valueRefs(core);
            expect(refs).toHaveLength(8);
            for (const ref of refs) {
                expect(ref.refResolution).toBeDefined();
                expect(await ref.stateValues.referentInfo).not.toBeNull();
            }
            expect(censusOfCore(core).copies).eq(0);
        });

        it("a when reports the input a reference reads, for the answer's per-input coloring", async () => {
            // `When.referencedStateVars`, which `colorInputsSeparately`
            // colors by, asks each descendant what it shadows; a value
            // reference shadows nothing and answers with its referent and
            // the variable it reads. The inputs sit inside the answer, so
            // the answer finds its responses there and does not mark the
            // references as potential responses: they stay value references.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <answer name="ans" numAwardsCredited="2" colorInputsSeparately>
      <mathInput name="mi1" /><mathInput name="mi2" />
      <award credit="0.5"><when name="w1"><math>$mi1</math>=x</when></award>
      <award credit="0.5"><when name="w2">$mi2.immediateValue=y</when></award>
    </answer>
    `,
            });
            const ansIdx = await resolvePathToNodeIdx("ans");
            const mi1Idx = await resolvePathToNodeIdx("mi1");
            const mi2Idx = await resolvePathToNodeIdx("mi2");
            const w1Idx = await resolvePathToNodeIdx("w1");
            const w2Idx = await resolvePathToNodeIdx("w2");

            expect(censusOfCore(core).copies).eq(0);
            const refs = valueRefs(core);
            expect(refs).toHaveLength(2);
            for (const ref of refs) {
                expect(ref.refResolution).toBeDefined();
            }

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables[w1Idx].stateValues.referencedStateVars).eqls([
                { componentIdx: mi1Idx, propVariable: "value" },
            ]);
            expect(stateVariables[w2Idx].stateValues.referencedStateVars).eqls([
                { componentIdx: mi2Idx, propVariable: "immediateValue" },
            ]);

            // the inputs are credited apart: `mi1` wrong earns it nothing,
            // while `mi2` keeps its award's share
            await updateMathInputValue({
                latex: "z",
                componentIdx: mi1Idx,
                core,
            });
            await updateMathInputValue({
                latex: "y",
                componentIdx: mi2Idx,
                core,
            });
            await submitAnswer({ componentIdx: ansIdx, core });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(stateVariables[ansIdx].stateValues.creditAchieved).eq(0.5);
            expect(stateVariables[mi1Idx].stateValues.creditAchieved).eq(0);
            expect(stateVariables[mi2Idx].stateValues.creditAchieved).eq(0.5);
        });

        it("a parent reading a reference's adapter source follows a referent that is remade", async () => {
            // `grid="$a $b"` holds two references presenting as texts for
            // numbers. The graph reads each one's adapter source, which for a
            // reference is its referent. `b` extends the second item of a
            // sequence: with one item it is made with nothing to extend, and
            // it is deleted and remade as the sequence grows past it. The
            // graph's reading has to come back with it, also in a copy of
            // the graph, whose references are whole shadows of these.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
    <mathInput name="k">1</mathInput>
    <sequence name="s" from="1" to="$k" />
    <number extend="$s[1]" name="a" />
    <number extend="$s[2]" name="b" />
    <graph name="g" grid="$a $b" />
    <graph extend="$g" name="g2" />
    `,
            });
            const kIdx = await resolvePathToNodeIdx("k");
            const gIdx = await resolvePathToNodeIdx("g");
            const g2Idx = await resolvePathToNodeIdx("g2");
            const grids = async () => {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                return [
                    stateVariables[gIdx].stateValues.grid,
                    stateVariables[g2Idx].stateValues.grid,
                ];
            };

            expect(await grids()).eqls(["none", "none"]);

            for (const [latex, expected] of [
                ["2", [1, 2]],
                ["1", "none"],
                ["3", [1, 2]],
            ] as const) {
                await updateMathInputValue({ latex, componentIdx: kIdx, core });
                expect(await grids()).eqls([expected, expected]);
            }
        });

        describe("references with nothing to read", () => {
            // An index past the end of a list, or a `<choiceInput>`'s
            // `selectedIndex` before a choice, leaves a reference nothing to
            // read. It shows the empty value of its type (`NaN`, `""`,
            // `false`, `＿`). As with the copy it replaced at document
            // level, a comparison takes it as a blank math, so that no two
            // missing values are equal, and a math or boolean operator
            // leaves it out of its operands.

            /** The `value` of each named component. */
            async function values(
                core: any,
                resolvePathToNodeIdx: (name: string) => Promise<number>,
                names: string[],
            ) {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                const result: Record<string, any> = {};
                for (const name of names) {
                    const value =
                        stateVariables[await resolvePathToNodeIdx(name)]
                            .stateValues.value;
                    result[name] =
                        value?.tree !== undefined ? value.tree : value;
                }
                return result;
            }

            it("is a blank math in a comparison, equal to nothing", async () => {
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `
    <choiceInput name="c1"><choice>a</choice><choice>b</choice></choiceInput>
    <choiceInput name="c2"><choice>a</choice><choice>b</choice></choiceInput>
    <numberList name="l">1 2 2</numberList>
    <textList name="tl">a b b</textList>
    <booleanList name="bl">true false false</booleanList>
    <mathInput name="k">5</mathInput>
    <number name="i">$k</number>
    <mathInput name="blank" />
    <textInput name="ti" />
    <booleanInput name="bi" />
    <number name="nan">0/0</number>

    <boolean name="numEq">$l[$i] = $l[$i+1]</boolean>
    <boolean name="numNe">$l[$i] != $l[$i+1]</boolean>
    <boolean name="numNaN">$l[$i] = $nan</boolean>
    <boolean name="numBlank" matchBlanks>$l[$i] = $blank</boolean>
    <boolean name="textEq">$tl[$i] = $tl[$i+1]</boolean>
    <boolean name="textNe">$tl[$i] != $tl[$i+1]</boolean>
    <boolean name="textNeText">$tl[$i] != <text>a</text></boolean>
    <boolean name="textEmpty">$tl[$i] = <text/></boolean>
    <boolean name="textInput">$tl[$i] = $ti</boolean>
    <boolean name="boolEq">$bl[$i] = $bl[$i+1]</boolean>
    <boolean name="boolNotEq">not ($bl[$i] = $bl[$i+1])</boolean>
    <boolean name="boolFalse">$bl[$i] = false</boolean>
    <boolean name="boolInput">$bl[$i] = $bi</boolean>
    <boolean name="choiceEq">$c1.selectedIndex = $c2.selectedIndex</boolean>
    <boolean name="choiceNe">$c1.selectedIndex != $c2.selectedIndex</boolean>

    <number name="num">$l[$i]</number>
    <text name="txt">$tl[$i]</text>
    <boolean name="bool">$bl[$i]</boolean>
    `,
                });
                const comparisons = [
                    "numEq",
                    "numNe",
                    "numNaN",
                    "numBlank",
                    "textEq",
                    "textNe",
                    "textNeText",
                    "textEmpty",
                    "textInput",
                    "boolEq",
                    "boolNotEq",
                    "boolFalse",
                    "boolInput",
                    "choiceEq",
                    "choiceNe",
                ];
                expect(censusOfCore(core).copies).eq(0);

                // `=` is false for every missing value, and `!=` true between
                // two of them, except that `matchBlanks` matches a blank to a
                // blank input. A blank math and a text are not comparable, so
                // `!=` with a text is false too.
                expect(
                    await values(core, resolvePathToNodeIdx, [
                        ...comparisons,
                        "num",
                        "txt",
                        "bool",
                    ]),
                ).eqls({
                    numEq: false,
                    numNe: true,
                    numNaN: false,
                    numBlank: true,
                    textEq: false,
                    textNe: true,
                    textNeText: false,
                    textEmpty: false,
                    textInput: false,
                    boolEq: false,
                    boolNotEq: true,
                    boolFalse: false,
                    boolInput: false,
                    choiceEq: false,
                    choiceNe: true,
                    // what the references show is the empty value of each type
                    num: NaN,
                    txt: "",
                    bool: false,
                });

                // with the entries there, they compare by their values
                await updateMathInputValue({
                    latex: "2",
                    componentIdx: await resolvePathToNodeIdx("k"),
                    core,
                });
                for (const name of ["c1", "c2"]) {
                    await updateSelectedIndices({
                        selectedIndices: [2],
                        componentIdx: await resolvePathToNodeIdx(name),
                        core,
                    });
                }
                expect(
                    await values(core, resolvePathToNodeIdx, comparisons),
                ).eqls({
                    numEq: true,
                    numNe: false,
                    numNaN: false,
                    numBlank: false,
                    textEq: true,
                    textNe: false,
                    textNeText: true,
                    textEmpty: false,
                    textInput: false,
                    boolEq: true,
                    boolNotEq: false,
                    boolFalse: true,
                    boolInput: true,
                    choiceEq: true,
                    choiceNe: false,
                });

                // and are blanks again once the index is past the end
                await updateMathInputValue({
                    latex: "4",
                    componentIdx: await resolvePathToNodeIdx("k"),
                    core,
                });
                expect(
                    await values(core, resolvePathToNodeIdx, [
                        "numEq",
                        "textEq",
                        "boolEq",
                        "boolFalse",
                    ]),
                ).eqls({
                    numEq: false,
                    textEq: false,
                    boolEq: false,
                    boolFalse: false,
                });
            });

            it("an answer gives no credit for two missing values, or one and a blank input", async () => {
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `
    <choiceInput name="c1"><choice>a</choice><choice>b</choice></choiceInput>
    <choiceInput name="c2"><choice>a</choice><choice>b</choice></choiceInput>
    <numberList name="l">1 2 3</numberList>
    <textList name="tl">a b</textList>
    <booleanList name="bl">true false</booleanList>
    <mathInput name="i">5</mathInput>
    <answer name="a1"><mathInput />
      <award><when>$c1.selectedIndex = $c2.selectedIndex</when></award>
    </answer>
    <answer name="a2"><mathInput />
      <award><when>$l[$i] = $l[$i+1]</when></award>
    </answer>
    <answer name="a3"><textInput name="ti" />
      <award><when>$tl[$i] = $ti</when></award>
    </answer>
    <answer name="a4"><booleanInput name="bi" />
      <award><when>$bl[$i] = $bi</when></award>
    </answer>
    <answer name="s1"><mathInput /><award>$l[$i]</award></answer>
    <answer name="s2"><textInput /><award>$tl[$i]</award></answer>
    <answer name="s3"><booleanInput /><award>$bl[$i]</award></answer>
    <answer name="s4" type="text"><award>$tl[$i]</award></answer>
    `,
                });
                const names = ["a1", "a2", "a3", "a4", "s1", "s2", "s3", "s4"];
                /** Submit every answer, and return the credit of each. */
                async function credits() {
                    for (const name of names) {
                        await submitAnswer({
                            componentIdx: await resolvePathToNodeIdx(name),
                            core,
                        });
                    }
                    const stateVariables = await core.returnAllStateVariables(
                        false,
                        true,
                    );
                    const result: Record<string, number> = {};
                    for (const name of names) {
                        result[name] =
                            stateVariables[
                                await resolvePathToNodeIdx(name)
                            ].stateValues.creditAchieved;
                    }
                    return result;
                }

                expect(await credits()).eqls({
                    a1: 0,
                    a2: 0,
                    a3: 0,
                    a4: 0,
                    s1: 0,
                    s2: 0,
                    s3: 0,
                    s4: 0,
                });

                // a choice made in both is credited, as an entry that is there
                for (const name of ["c1", "c2"]) {
                    await updateSelectedIndices({
                        selectedIndices: [1],
                        componentIdx: await resolvePathToNodeIdx(name),
                        core,
                    });
                }
                await updateTextInputValue({
                    text: "b",
                    componentIdx: await resolvePathToNodeIdx("ti"),
                    core,
                });
                await updateMathInputValue({
                    latex: "2",
                    componentIdx: await resolvePathToNodeIdx("i"),
                    core,
                });
                const after = await credits();
                expect([after.a1, after.a3]).eqls([1, 1]);
            });

            it("a math operator leaves it out of its operands", async () => {
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `
    <numberList name="l">1 2 3</numberList>
    <mathList name="ml">x y z</mathList>
    <textList name="tl">a b c</textList>
    <mathInput name="i">5</mathInput>
    <sum name="sum">$l[$i] 5</sum>
    <product name="product">$l[$i] 5</product>
    <min name="min">$l[$i] 5</min>
    <max name="max">$l[$i] 5</max>
    <mean name="mean">$l[$i] 5</mean>
    <median name="median">$l[$i] 5 7</median>
    <variance name="variance">$l[$i] 4 6</variance>
    <count name="count">$l[$i] 5</count>
    <gcd name="gcd">$l[$i] 6 4</gcd>
    <mod name="mod">$l[$i] 3</mod>
    <sum name="sumMath">$ml[$i] 5</sum>
    <mean name="meanMath">$ml[$i] 1 2</mean>
    <sum name="sumText">$tl[$i] 5</sum>
    <mean name="meanNone">$l[$i] $l[$i+1]</mean>
    <boolean name="unorderedSum"><sum><math unordered>(1,2)</math> $ml[$i]</sum> = (2,1)</boolean>
    `,
                });
                const names = [
                    "sum",
                    "product",
                    "min",
                    "max",
                    "mean",
                    "median",
                    "variance",
                    "count",
                    "gcd",
                    "mod",
                    "sumMath",
                    "meanMath",
                    "sumText",
                    "meanNone",
                    "unorderedSum",
                ];
                expect(await values(core, resolvePathToNodeIdx, names)).eqls({
                    sum: 5,
                    product: 5,
                    min: 5,
                    max: 5,
                    mean: 5,
                    median: 6,
                    variance: 2,
                    count: 1,
                    gcd: 2,
                    // `<mod>` takes exactly two operands
                    mod: NaN,
                    sumMath: 5,
                    // a missing math does not make the operator symbolic,
                    // which would give `(1+2)/2`
                    meanMath: 1.5,
                    sumText: 5,
                    // with no operand left, an operator is blank, as one with
                    // no children is
                    meanNone: "＿",
                    // the sum of the one operand left is unordered, as it is
                    unorderedSum: true,
                });

                // once the entry is there, it is an operand again
                await updateMathInputValue({
                    latex: "2",
                    componentIdx: await resolvePathToNodeIdx("i"),
                    core,
                });
                expect(await values(core, resolvePathToNodeIdx, names)).eqls({
                    sum: 7,
                    product: 10,
                    min: 2,
                    max: 5,
                    mean: 3.5,
                    median: 5,
                    variance: 4,
                    count: 2,
                    gcd: 2,
                    mod: 2,
                    sumMath: ["+", "y", 5],
                    meanMath: ["/", ["+", "y", 1, 2], 3],
                    sumText: ["+", "b", 5],
                    meanNone: 2.5,
                    unorderedSum: false,
                });
            });

            it("a math operator takes the display settings of its one operand that is there", async () => {
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `
    <numberList name="l">1 2 3</numberList>
    <mathInput name="i">5</mathInput>
    <number name="n" displayDigits="6">3.14159265</number>
    <sum name="sum">$l[$i] $n</sum>
    `,
                });
                const sumIdx = await resolvePathToNodeIdx("sum");
                async function shown() {
                    const stateVariables = await core.returnAllStateVariables(
                        false,
                        true,
                    );
                    const { displayDigits, text } =
                        stateVariables[sumIdx].stateValues;
                    return { displayDigits, text };
                }
                // `n` is the only operand, and gives the sum its settings
                expect(await shown()).eqls({
                    displayDigits: 6,
                    text: "3.14159",
                });

                // with two operands, the sum has its own
                await updateMathInputValue({
                    latex: "2",
                    componentIdx: await resolvePathToNodeIdx("i"),
                    core,
                });
                expect(await shown()).eqls({ displayDigits: 3, text: "5.14" });
            });

            it("a write through a math operator goes to the operand that is there", async () => {
                // `<min>` writes to its one operand that can be changed; a
                // missing reference is not an operand, so `n` is the one
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `
    <numberList name="l">1 2 3</numberList>
    <mathInput name="i">5</mathInput>
    <number name="n">4</number>
    <min name="min">$l[$i] $n</min>
    <mathInput name="mi" bindValueTo="$min" />
    `,
                });
                const minIdx = await resolvePathToNodeIdx("min");
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                expect(stateVariables[minIdx].stateValues.canBeModified).eq(
                    true,
                );

                await updateMathInputValue({
                    latex: "2",
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
                expect(
                    await values(core, resolvePathToNodeIdx, ["n", "min"]),
                ).eqls({ n: 2, min: 2 });
            });

            it("a boolean operator leaves it out of its operands", async () => {
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `
    <booleanList name="bl">true false</booleanList>
    <mathInput name="k">5</mathInput>
    <number name="i">$k</number>
    <boolean name="t">true</boolean>
    <and name="and">$bl[$i] true</and>
    <and name="andOnly">$bl[$i]</and>
    <and name="andNone">$bl[$i] $bl[$i+1]</and>
    <iff name="iff">$bl[$i] true</iff>
    <implies name="implies">$bl[$i] $t</implies>
    `,
                });
                // `<or>` and `<xor>` count only the true operands, so an
                // operand left out and one read as `false` agree there
                const names = ["and", "andOnly", "andNone", "iff", "implies"];
                expect(censusOfCore(core).copies).eq(0);
                expect(await values(core, resolvePathToNodeIdx, names)).eqls({
                    and: true,
                    // with no operand left, as with no children
                    andOnly: true,
                    andNone: true,
                    iff: true,
                    // `<implies>` with one operand is its negation
                    implies: false,
                });

                // once the entry is there, it is an operand again
                await updateMathInputValue({
                    latex: "2",
                    componentIdx: await resolvePathToNodeIdx("k"),
                    core,
                });
                expect(await values(core, resolvePathToNodeIdx, names)).eqls({
                    and: false,
                    andOnly: false,
                    andNone: false,
                    iff: false,
                    implies: true,
                });
            });

            it("behaves the same in a repeat and a group as at document level", async () => {
                const block = (prefix: string, i: string, j: string) => `
      <boolean name="${prefix}eq">$l[${i}] = $l[${j}]</boolean>
      <boolean name="${prefix}ne">$l[${i}] != $l[${j}]</boolean>
      <boolean name="${prefix}text">$tl[${i}] = $ti</boolean>
      <boolean name="${prefix}textNe">$tl[${i}] != $ti</boolean>
      <sum name="${prefix}sum">$l[${i}] 5</sum>
      <and name="${prefix}and">$bl[${i}] true</and>`;
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `
    <numberList name="l">5 6</numberList>
    <textList name="tl">a b</textList>
    <booleanList name="bl">false false</booleanList>
    <textInput name="ti" />
    ${block("d", "3", "4")}
    <repeatForSequence name="r" from="3" to="3" valueName="v">${block("", "$v", "$v+1")}</repeatForSequence>
    <group name="g">${block("g", "3", "4")}</group>
    `,
                });
                // A blank math and a text are not comparable, so `textNe` is
                // false. Inside a composite the copy made nothing, which
                // made it true there and false at document level.
                const expected = [false, true, false, false, 5, true];
                for (const name of [
                    (n: string) => "d" + n,
                    (n: string) => "r[1]." + n,
                    (n: string) => "g" + n,
                ]) {
                    const result = await values(
                        core,
                        resolvePathToNodeIdx,
                        ["eq", "ne", "text", "textNe", "sum", "and"].map(name),
                    );
                    expect(Object.values(result)).eqls(expected);
                }
            });

            it("a reference to a variable that holds no value is not missing", async () => {
                // A variable that is there but holds no value is not missing:
                // the copy made a component for it, holding the empty value of
                // its type, and the reference compares and adds as that
                // component did. Two such references: one a copy makes at run
                // time to a `<choiceInput>`'s `selectedValue`, once the
                // selected choice is withheld, and one to an attribute with no
                // default.
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `
    <boolean name="b">true</boolean>
    <booleanInput name="bi" bindValueTo="$b" />
    <choiceInput name="ct1">
      <choice>one</choice>
      <conditionalContent condition="$b"><choice>two</choice></conditionalContent>
    </choiceInput>
    <choiceInput name="ct2">
      <choice>one</choice>
      <conditionalContent condition="$b"><choice>two</choice></conditionalContent>
    </choiceInput>
    <choiceInput name="ci">
      <choice><math>1</math></choice>
      <conditionalContent condition="$b"><choice><math>2</math></choice></conditionalContent>
    </choiceInput>
    <textInput name="ti" />
    <answer><mathInput /><award name="aw1">1</award><award name="aw2">2</award></answer>
    <graph name="g"><point>(1,2)</point></graph>
    <collect name="col" componentType="point" from="$g" />

    <boolean name="choiceEq">$ct1.selectedValue = $ct2.selectedValue</boolean>
    <boolean name="choiceBlank">$ct1.selectedValue = $ti</boolean>
    <sum name="choiceSum">$ci.selectedValue 5</sum>
    <count name="choiceCount">$ci.selectedValue 5</count>
    <boolean name="nullEq">$aw1.feedbackText = $aw2.feedbackText</boolean>
    <boolean name="nullBlank">$aw1.feedbackText = $ti</boolean>
    <sum name="nullSum">$col.maxNumber 5</sum>
    `,
                });
                const names = [
                    "choiceEq",
                    "choiceBlank",
                    "choiceSum",
                    "choiceCount",
                    "nullEq",
                    "nullBlank",
                    "nullSum",
                ];
                for (const name of ["ct1", "ct2", "ci"]) {
                    await updateSelectedIndices({
                        selectedIndices: [2],
                        componentIdx: await resolvePathToNodeIdx(name),
                        core,
                    });
                }
                // the five references to `selectedValue` are made by copies
                expect(
                    valueRefs(core).filter(
                        (ref) =>
                            ref.doenetAttributes.fixedReferent?.variableName ===
                            "selectedValue1",
                    ),
                ).toHaveLength(5);
                await updateBooleanInputValue({
                    boolean: false,
                    componentIdx: await resolvePathToNodeIdx("bi"),
                    core,
                });
                expect(await values(core, resolvePathToNodeIdx, names)).eqls({
                    choiceEq: true,
                    choiceBlank: true,
                    choiceSum: ["+", "＿", 5],
                    choiceCount: 2,
                    nullEq: true,
                    nullBlank: true,
                    nullSum: NaN,
                });
            });

            it("is missing when its entry is withheld", async () => {
                // When `numSamples` drops, `<sampleRandomNumbers>` withholds
                // the samples it no longer has rather than removing them, so
                // `$s[2]` still finds one. It is missing all the same, as the
                // copy made nothing for a withheld entry.
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `
    <mathInput name="n">3</mathInput>
    <sampleRandomNumbers name="s" numSamples="$n" type="discreteUniform" from="5" to="5" />
    <boolean name="eq">$s[2] = $s[3]</boolean>
    <boolean name="ne">$s[2] != $s[3]</boolean>
    <sum name="sum">$s[2] 5</sum>
    <count name="count">$s[2] 5</count>
    <number name="num">$s[2]</number>
    `,
                });
                const names = ["eq", "ne", "sum", "count", "num"];
                const present = {
                    eq: true,
                    ne: false,
                    sum: 10,
                    count: 2,
                    num: 5,
                };
                expect(censusOfCore(core).copies).eq(0);
                expect(await values(core, resolvePathToNodeIdx, names)).eqls(
                    present,
                );

                await updateMathInputValue({
                    latex: "1",
                    componentIdx: await resolvePathToNodeIdx("n"),
                    core,
                });
                expect(await values(core, resolvePathToNodeIdx, names)).eqls({
                    eq: false,
                    ne: true,
                    sum: 5,
                    count: 1,
                    num: NaN,
                });

                await updateMathInputValue({
                    latex: "3",
                    componentIdx: await resolvePathToNodeIdx("n"),
                    core,
                });
                expect(await values(core, resolvePathToNodeIdx, names)).eqls(
                    present,
                );
            });
        });

        describe("references an answer counts as responses", () => {
            /** The submitted responses of `ansIdx` and their types. */
            async function submitted(core: any, ansIdx: number) {
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                const { submittedResponses, submittedResponsesComponentType } =
                    stateVariables[ansIdx].stateValues;
                return {
                    responses: submittedResponses.map((r: any) =>
                        r?.tree !== undefined ? r.tree : r,
                    ),
                    types: submittedResponsesComponentType,
                    credit: stateVariables[ansIdx].stateValues.creditAchieved,
                    numResponses:
                        stateVariables[ansIdx].stateValues.numResponses,
                };
            }

            it("a reference in an award of an answer with no input of its own is a potential response and one small component", async () => {
                // The answer has no input, so it marks every reference in its
                // awards as a potential response and records what they read.
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `
    <mathInput name="mi" /> <textInput name="ti" /> <booleanInput name="bi" />
    <answer name="ans">
      <award><when>$mi = x and $ti = hello and $bi</when></award>
    </answer>
    `,
                });
                const ansIdx = await resolvePathToNodeIdx("ans");

                const refs = valueRefs(core);
                expect(refs).toHaveLength(3);
                expect(censusOfCore(core).copies).eq(0);

                // Counting its responses, the answer asks each reference for
                // its marks, which the reference makes on demand.
                expect((await submitted(core, ansIdx)).numResponses).eq(3);
                for (const ref of refs) {
                    expect(await ref.stateValues.isPotentialResponse).eq(true);
                    expect(await ref.stateValues.isResponse).eq(false);
                }

                await updateMathInputValue({
                    latex: "x",
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
                await updateTextInputValue({
                    text: "hello",
                    componentIdx: await resolvePathToNodeIdx("ti"),
                    core,
                });
                await updateBooleanInputValue({
                    boolean: true,
                    componentIdx: await resolvePathToNodeIdx("bi"),
                    core,
                });
                await submitAnswer({ componentIdx: ansIdx, core });
                expect(await submitted(core, ansIdx)).eqls({
                    responses: ["x", "hello", true],
                    types: ["math", "text", "boolean"],
                    credit: 1,
                    numResponses: 3,
                });

                await updateTextInputValue({
                    text: "bye",
                    componentIdx: await resolvePathToNodeIdx("ti"),
                    core,
                });
                await submitAnswer({ componentIdx: ansIdx, core });
                expect(await submitted(core, ansIdx)).eqls({
                    responses: ["x", "bye", true],
                    types: ["math", "text", "boolean"],
                    credit: 0,
                    numResponses: 3,
                });
            });

            it("potential responses inside a math, into a list, and of a number", async () => {
                // A number read inside a `<math>` is recorded as the number
                // it is, not as the math its parent reads it as.
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `
    <mathInput name="mi" />
    <number name="n">3</number>
    <numberList name="l">1 2 3</numberList>
    <answer name="ans">
      <award><when><math>$mi+1</math> = 3 and $l[2] = 2 and $n = 3 and <math>$n+1</math> = 4</when></award>
    </answer>
    `,
                });
                const ansIdx = await resolvePathToNodeIdx("ans");

                await updateMathInputValue({
                    latex: "2",
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
                await submitAnswer({ componentIdx: ansIdx, core });
                expect(await submitted(core, ansIdx)).eqls({
                    responses: [2, 2, 3, 3],
                    types: ["math", "number", "number", "number"],
                    credit: 1,
                    numResponses: 4,
                });

                // The number inside the `<math>` keeps its copy, which makes
                // the number the answer records. So does the entry of the
                // list, which may be missing; its copy makes a value
                // reference to the entry it finds.
                const refs = valueRefs(core);
                expect(refs).toHaveLength(3);
                for (const ref of refs) {
                    expect(await ref.stateValues.isPotentialResponse).eq(true);
                }
                expect(
                    refs.filter((ref) => ref.doenetAttributes.fixedReferent),
                ).toHaveLength(1);
                expect(censusOfCore(core).copies).eq(2);
            });

            it("a missing entry is recorded and compared as an empty response", async () => {
                // Before a choice is made, and while the index is blank or
                // past the end of the list, a reference reads an entry that
                // is not there. It is recorded as an empty math, and no two
                // of them are equal. Once an entry is there, it is recorded
                // and compared by its value.
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `
    <choiceInput name="c1"><choice>a</choice><choice>b</choice></choiceInput>
    <choiceInput name="c2"><choice>a</choice><choice>b</choice></choiceInput>
    <mathInput name="i" />
    <numberList name="l">1 2 2</numberList>
    <answer name="ans1">
      <award><when>$c1.selectedIndex = $c2.selectedIndex</when></award>
    </answer>
    <answer name="ans2">
      <award><when>$l[$i] = $l[$i+1]</when></award>
    </answer>
    `,
                });
                const ans1Idx = await resolvePathToNodeIdx("ans1");
                const ans2Idx = await resolvePathToNodeIdx("ans2");

                await submitAnswer({ componentIdx: ans1Idx, core });
                await submitAnswer({ componentIdx: ans2Idx, core });
                const empty = {
                    responses: ["＿", "＿"],
                    types: ["math", "math"],
                    credit: 0,
                    numResponses: 2,
                };
                expect(await submitted(core, ans1Idx)).eqls(empty);
                expect(await submitted(core, ans2Idx)).eqls(empty);

                await updateSelectedIndices({
                    selectedIndices: [2],
                    componentIdx: await resolvePathToNodeIdx("c1"),
                    core,
                });
                await updateSelectedIndices({
                    selectedIndices: [2],
                    componentIdx: await resolvePathToNodeIdx("c2"),
                    core,
                });
                await submitAnswer({ componentIdx: ans1Idx, core });
                expect(await submitted(core, ans1Idx)).eqls({
                    responses: [2, 2],
                    types: ["number", "number"],
                    credit: 1,
                    numResponses: 2,
                });

                // `$l[$i]` and `$l[$i+1]` follow the index: different
                // entries, equal entries, and the last entry with one past
                // the end
                const iIdx = await resolvePathToNodeIdx("i");
                for (const [i, responses, types, credit] of [
                    ["1", [1, 2], ["number", "number"], 0],
                    ["2", [2, 2], ["number", "number"], 1],
                    ["3", [2, "＿"], ["number", "math"], 0],
                ] as const) {
                    await updateMathInputValue({
                        latex: i,
                        componentIdx: iIdx,
                        core,
                    });
                    await submitAnswer({ componentIdx: ans2Idx, core });
                    expect(await submitted(core, ans2Idx)).eqls({
                        responses,
                        types,
                        credit,
                        numResponses: 2,
                    });
                }
            });

            it("a reference an award names in referencesAreResponses is a response", async () => {
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `
    <mathInput name="mi1" /> <mathInput name="mi2" />
    <answer name="ans">
      <award referencesAreResponses="$mi1"><when>$mi1 = x and $mi2 = y</when></award>
    </answer>
    `,
                });
                const ansIdx = await resolvePathToNodeIdx("ans");

                const refs = valueRefs(core);
                expect(refs).toHaveLength(2);
                // the one copy is the reference the attribute itself holds
                expect(censusOfCore(core).copies).eq(1);

                await updateMathInputValue({
                    latex: "x",
                    componentIdx: await resolvePathToNodeIdx("mi1"),
                    core,
                });
                await updateMathInputValue({
                    latex: "y",
                    componentIdx: await resolvePathToNodeIdx("mi2"),
                    core,
                });
                await submitAnswer({ componentIdx: ansIdx, core });
                expect(await submitted(core, ansIdx)).eqls({
                    responses: ["x"],
                    types: ["math"],
                    credit: 1,
                    numResponses: 1,
                });
                expect(
                    await Promise.all(
                        refs.map((ref) => ref.stateValues.isResponse),
                    ),
                ).eqls([true, false]);
            });

            it("a potential response a copy resolves is a value reference that keeps the mark", async () => {
                // The item a `<repeat>` iterates over is whatever its list
                // holds, so each `$v` is resolved by a copy at run time.
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `
    <numberList name="l">1 2</numberList>
    <repeat for="$l" valueName="v" name="r">
      <answer name="ans"><award><when>$v = 1</when></award></answer>
    </repeat>
    `,
                });
                const ans1Idx = await resolvePathToNodeIdx("r[1].ans");
                const ans2Idx = await resolvePathToNodeIdx("r[2].ans");

                const refs = valueRefs(core);
                expect(refs).toHaveLength(2);
                for (const ref of refs) {
                    expect(ref.doenetAttributes.fixedReferent).toBeDefined();
                }

                await submitAnswer({ componentIdx: ans1Idx, core });
                await submitAnswer({ componentIdx: ans2Idx, core });
                expect(await submitted(core, ans1Idx)).eqls({
                    responses: [1],
                    types: ["number"],
                    credit: 1,
                    numResponses: 1,
                });
                expect(await submitted(core, ans2Idx)).eqls({
                    responses: [2],
                    types: ["number"],
                    credit: 0,
                    numResponses: 1,
                });
                for (const ref of refs) {
                    expect(await ref.stateValues.isPotentialResponse).eq(true);
                }
            });
        });
    },
);
