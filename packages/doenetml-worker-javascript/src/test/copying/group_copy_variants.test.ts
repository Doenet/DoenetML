import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    submitAnswer,
    updateMathInputValue,
    updateSelectedIndices,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);

const variantIndices = [1, 2, 3, 4, 5];

async function selectedValues({
    doenetML,
    requestedVariantIndex,
    requestedVariant,
    names,
}: {
    doenetML: string;
    requestedVariantIndex?: number;
    requestedVariant?: Record<string, any>;
    names: string[];
}) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML,
        requestedVariantIndex,
        requestedVariant,
    });
    const stateVariables = await core.returnAllStateVariables(false, true);
    const values: number[] = [];
    for (const name of names) {
        values.push(
            stateVariables[await resolvePathToNodeIdx(name)].stateValues
                .selectedValues[0],
        );
    }
    return values;
}

describe("Unlinked group copies of random choices @group3", async () => {
    it("a group copy keeps random values nested inside a div and an inner group", async () => {
        const doenetML = `
<group name="g"><div><group><p><selectFromSequence name="n" from="1" to="1000"/></p></group></div></group>
<group copy="$g" name="g2"/>
`;
        for (const requestedVariantIndex of variantIndices) {
            const [n, n2] = await selectedValues({
                doenetML,
                requestedVariantIndex,
                names: ["g.n", "g2.n"],
            });
            expect(n2, `variant ${requestedVariantIndex}`).eq(n);
        }
    });

    it("a group copy keeps random values nested in groups inside divs", async () => {
        const doenetML = `
<group name="g"><div><group><div><group><selectFromSequence name="n" from="1" to="1000"/></group></div></group></div></group>
<group copy="$g" name="g2"/>
`;
        for (const requestedVariantIndex of variantIndices) {
            const [n, n2] = await selectedValues({
                doenetML,
                requestedVariantIndex,
                names: ["g.n", "g2.n"],
            });
            expect(n2, `variant ${requestedVariantIndex}`).eq(n);
        }
    });

    it("a group copy keeps other random values in a hidden group, a shuffle, and with unique variants", async () => {
        // the inner group's children are copied unexpanded, each with the
        // variant it was given, whatever kind of random choice it makes
        for (const [doenetML, name, stateVariable] of [
            [
                `<group name="g"><div><group hide><selectFromSequence name="n" from="1" to="1000"/></group></div></group>`,
                "n",
                "selectedValues",
            ],
            [
                `<group name="g"><div><group><shuffle name="s"><p>1</p><p>2</p><p>3</p><p>4</p><p>5</p></shuffle></group></div></group>`,
                "s",
                "componentOrder",
            ],
            [
                `<setup><variantControl uniqueVariants/></setup><group name="g"><div><group><select name="s">a b c d e f</select></group></div></group>`,
                "s",
                "selectedIndices",
            ],
        ]) {
            for (const requestedVariantIndex of variantIndices) {
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `${doenetML}<group copy="$g" name="g2"/>`,
                    requestedVariantIndex,
                });
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                const value = async (path: string) =>
                    stateVariables[await resolvePathToNodeIdx(path)]
                        .stateValues[stateVariable];
                expect(
                    await value(`g2.${name}`),
                    `${doenetML}, variant ${requestedVariantIndex}`,
                ).eqls(await value(`g.${name}`));
            }
        }
    });

    it("a random child added to a group copy gets its own value", async () => {
        const doenetML = `
<p name="a"><group name="g"><selectFromSequence name="x" from="1" to="1000"/> <selectFromSequence name="y" from="1" to="1000"/></group></p>
<p name="b"><group copy="$g" name="g2"> <selectFromSequence name="z" from="1" to="1000"/></group></p>
<p name="c"><group copy="$g2" name="g3"/></p>
`;
        const names = [
            "g.x",
            "g.y",
            "g2.x",
            "g2.y",
            "z",
            "g3.x",
            "g3.y",
            "g3.z",
        ];
        const addedValues: number[] = [];
        for (const requestedVariantIndex of variantIndices) {
            const [x, y, x2, y2, z, x3, y3, z3] = await selectedValues({
                doenetML,
                requestedVariantIndex,
                names,
            });
            const message = `variant ${requestedVariantIndex}`;

            // the copied children keep their source's values
            expect([x2, y2], message).eqls([x, y]);

            // the added child does not repeat a value of the source
            expect(z, message).not.eq(x);
            expect(z, message).not.eq(y);

            // a copy of the copy keeps the copy's values, the added one included
            expect([x3, y3, z3], message).eqls([x, y, z]);

            // the added child's value is the same for a given variant
            const [zAgain] = await selectedValues({
                doenetML,
                requestedVariantIndex,
                names: ["z"],
            });
            expect(zAgain, message).eq(z);

            addedValues.push(z);
        }

        // and differs between variants
        expect(new Set(addedValues).size).eq(variantIndices.length);
    });
    it("an unlinked conditionalContent copy keeps its source's random value", async () => {
        // The copy is given an empty case as a child, which must not give it
        // a seed of its own, as its case draws from its seed.
        const doenetML = `
<conditionalContent name="c" condition="true"><selectFromSequence name="n" from="1" to="1000"/></conditionalContent>
<conditionalContent copy="$c" name="c2"/>
`;
        for (const requestedVariantIndex of variantIndices) {
            const [n, n2] = await selectedValues({
                doenetML,
                requestedVariantIndex,
                names: ["c.n", "c2.n"],
            });
            expect(n2, `variant ${requestedVariantIndex}`).eq(n);
        }
    });

    it("a random child added to a group copy keeps its value through a reload", async () => {
        const doenetML = `
<p><group name="g"><selectFromSequence name="x" from="1" to="1000"/> <mathInput name="mi" prefill="1"/></group></p>
<p><group copy="$g" name="g2"> <selectFromSequence name="z" from="1" to="1000"/></group></p>
`;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
            requestedVariantIndex: 2,
        });
        async function values() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
            return {
                x: (await sv("g.x")).selectedValues[0],
                x2: (await sv("g2.x")).selectedValues[0],
                z: (await sv("z")).selectedValues[0],
                mi2: (await sv("g2.mi")).value.tree,
            };
        }
        const initial = await values();
        expect(initial.x2).eq(initial.x);
        expect(initial.z).not.eq(initial.x);

        // a change to the source makes the save hold the copy's snapshot
        await updateMathInputValue({
            latex: "5",
            componentIdx: await resolvePathToNodeIdx("g.mi"),
            core,
        });
        await updateMathInputValue({
            latex: "7",
            componentIdx: await resolvePathToNodeIdx("g2.mi"),
            core,
        });
        await core.saveImmediately();

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariantIndex: 2,
            initialState: scoreState.state,
        }));
        expect(await values()).eqls({ ...initial, mi2: 7 });
    });

    it("a group copy's components keep their indices through a reload", async () => {
        // The viewer finds a component by its index (`_id_<index>`), so a
        // copy must make its components with the same indices when the page
        // is loaded again, though references in its source (`$ci`) then have
        // a value they did not have on the first load.
        const doenetML = `
    <group name="g">
      <choiceInput shuffleOrder name="ci"><choice>a</choice><choice>b</choice><choice>c</choice></choiceInput>
      <p name="p1">Selected value: $ci</p>
      <p name="p2">Enter <selectFromSequence name="n" />. <answer name="ans">$n</answer></p>
    </group>
    <group extend="$g" name="g2" />
    <group copy="$g" name="g3" />
`;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        async function inputIndices() {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const indices: number[] = [];
            for (const name of ["g.ans", "g2.ans", "g3.ans"]) {
                indices.push(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .inputChildren[0].componentIdx,
                );
            }
            return { indices, stateVariables };
        }
        const initial = await inputIndices();

        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("ci"),
            selectedIndices: [2],
            core,
        });
        await updateMathInputValue({
            latex: "1",
            componentIdx: initial.indices[2],
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("g3.ans"),
            core,
        });
        const generatedVariantInfo = (
            await core.returnAllStateVariables(false, true)
        )[await resolvePathToNodeIdx("_document1")].stateValues
            .generatedVariantInfo;
        await core.saveImmediately();

        // loaded again as the viewer loads a saved page
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariant: JSON.parse(JSON.stringify(generatedVariantInfo)),
            initialState: scoreState.state,
        }));
        expect((await inputIndices()).indices).eqls(initial.indices);
    });
});

describe("Random choices in repeats @group3", async () => {
    it("a group copy keeps random values in groups in a repeat inside a div", async () => {
        const doenetML = `
<group name="g"><div><repeatForSequence name="r" from="1" to="2"><group><selectFromSequence name="n" from="1" to="1000"/></group></repeatForSequence></div></group>
<group copy="$g" name="g2"/>
`;
        for (const requestedVariantIndex of variantIndices) {
            const [n1, n2, m1, m2] = await selectedValues({
                doenetML,
                requestedVariantIndex,
                names: ["g.r[1].n", "g.r[2].n", "g2.r[1].n", "g2.r[2].n"],
            });
            expect([m1, m2], `variant ${requestedVariantIndex}`).eqls([n1, n2]);
        }
    });

    it("a group copy keeps random values in groups in nested repeats", async () => {
        const doenetML = `
<group name="g"><div><repeatForSequence name="r" from="1" to="2"><repeatForSequence name="q" from="1" to="2"><group><selectFromSequence name="n" from="1" to="1000"/></group></repeatForSequence></repeatForSequence></div></group>
<group copy="$g" name="g2"/>
`;
        const paths = [
            "r[1].q[1].n",
            "r[1].q[2].n",
            "r[2].q[1].n",
            "r[2].q[2].n",
        ];
        for (const requestedVariantIndex of variantIndices) {
            const values = await selectedValues({
                doenetML,
                requestedVariantIndex,
                names: [
                    ...paths.map((p) => `g.${p}`),
                    ...paths.map((p) => `g2.${p}`),
                ],
            });
            expect(values.slice(4), `variant ${requestedVariantIndex}`).eqls(
                values.slice(0, 4),
            );
        }
    });

    it("an unlinked copy of a repeat keeps random values in groups", async () => {
        for (const repeat of [
            `<repeatForSequence name="r" from="1" to="2"><group><selectFromSequence name="n" from="1" to="1000"/></group></repeatForSequence>
<repeatForSequence copy="$r" name="r2"/>`,
            `<repeat name="r" for="1 2"><group><selectFromSequence name="n" from="1" to="1000"/></group></repeat>
<repeat copy="$r" name="r2"/>`,
        ]) {
            for (const requestedVariantIndex of variantIndices) {
                const [n1, n2, m1, m2] = await selectedValues({
                    doenetML: repeat,
                    requestedVariantIndex,
                    names: ["r[1].n", "r[2].n", "r2[1].n", "r2[2].n"],
                });
                const message = `${repeat}, variant ${requestedVariantIndex}`;
                expect(n2, message).not.eq(n1);
                expect([m1, m2], message).eqls([n1, n2]);
            }
        }
    });

    it("an unlinked copy of a repeat for keeps random values in its template", async () => {
        // with no group in the template, the copy used to draw its values
        // from its seed differently than its source did
        const doenetML = `
<repeat name="r" for="a b c" valueName="v"><selectFromSequence name="n" from="1" to="1000"/></repeat>
<repeat copy="$r" name="r2"/>
`;
        for (const requestedVariantIndex of variantIndices) {
            const values = await selectedValues({
                doenetML,
                requestedVariantIndex,
                names: [
                    "r[1].n",
                    "r[2].n",
                    "r[3].n",
                    "r2[1].n",
                    "r2[2].n",
                    "r2[3].n",
                ],
            });
            expect(values.slice(3), `variant ${requestedVariantIndex}`).eqls(
                values.slice(0, 3),
            );
        }
    });

    it("random values in groups in a repeat are kept when the variant is requested again", async () => {
        // as a host does to load a saved page with the variant it generated
        const doenetML = `
<repeatForSequence name="r" from="1" to="2"><repeatForSequence name="q" from="1" to="2"><group><selectFromSequence name="n" from="1" to="1000"/></group></repeatForSequence></repeatForSequence>
`;
        const names = [
            "r[1].q[1].n",
            "r[1].q[2].n",
            "r[2].q[1].n",
            "r[2].q[2].n",
        ];
        for (const requestedVariantIndex of variantIndices) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                requestedVariantIndex,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const values = await selectedValues({
                doenetML,
                requestedVariantIndex,
                names,
            });
            const reloadedValues = await selectedValues({
                doenetML,
                requestedVariant:
                    stateVariables[await resolvePathToNodeIdx("_document1")]
                        .stateValues.generatedVariantInfo,
                names,
            });
            expect(reloadedValues, `variant ${requestedVariantIndex}`).eqls(
                values,
            );
        }
    });
});
