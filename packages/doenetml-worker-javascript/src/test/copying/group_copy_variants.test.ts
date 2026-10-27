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

    it("an unlinked copy keeps the random values in the option a nested select chose", async () => {
        const option = `<option><p><selectFromSequence from="1" to="1000"/></p></option>`;
        const select = `<select>${option}${option}</select>`;
        const nestedOption = `<option><p>${select}</p></option>`;
        const nestedSelect = `<select>${nestedOption}${nestedOption}</select>`;
        for (const doenetML of [
            `<group name="g"><div>${select}</div></group><group copy="$g"/>`,
            `<group name="g"><div><div>${select}</div></div></group><group copy="$g"/>`,
            `<group name="g"><div><repeatForSequence from="1" to="1">${select}</repeatForSequence></div></group><group copy="$g"/>`,
            // a select in the chosen option of another one
            `<group name="g"><div>${nestedSelect}</div></group><group copy="$g"/>`,
            `<group name="g">${nestedSelect}</group><group copy="$g"/>`,
            nestedSelect.replace("<select>", `<select name="s">`) +
                `<select copy="$s" link="false"/>`,
        ]) {
            for (const requestedVariantIndex of variantIndices) {
                const { core } = await createTestCore({
                    doenetML,
                    requestedVariantIndex,
                });
                const stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );
                // the selectFromSequence in the chosen option of the source,
                // and the one in the copy's
                const values = Object.values(stateVariables)
                    .filter(
                        (component) =>
                            component.componentType === "selectFromSequence",
                    )
                    .map((component) => component.stateValues.selectedValues);
                const message = `${doenetML}, variant ${requestedVariantIndex}`;
                expect(values, message).toHaveLength(2);
                expect(values[1], message).eqls(values[0]);
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

    it("a random child added to an unlinked copy of a repeat gets its own value", async () => {
        // The added child used to draw from the seed of the source's
        // iteration, getting the value that a random component directly in
        // the source's template draws first from that seed. With no group
        // around the source's random component, that is the value copied
        // into the iteration. With a group, it is the value the source
        // would have without the group.
        const sfs = `<selectFromSequence name="n" from="1" to="1000"/>`;
        const added = `<selectFromSequence name="m" from="1" to="1000"/>`;
        for (const [source, copy] of [
            [
                (template: string) =>
                    `<repeat name="r" for="1 2">${template}</repeat>`,
                `<repeat copy="$r" name="r2">${added}</repeat>`,
            ],
            [
                (template: string) =>
                    `<repeatForSequence name="r" from="1" to="2">${template}</repeatForSequence>`,
                `<repeatForSequence copy="$r" name="r2">${added}</repeatForSequence>`,
            ],
        ] as const) {
            const names = [
                "r[1].n",
                "r[2].n",
                "r2[1].n",
                "r2[2].n",
                "r2[1].m",
                "r2[2].m",
            ];
            const plainDoenetML = `<p>${source(sfs)}\n${copy}</p>`;
            for (const doenetML of [
                plainDoenetML,
                `<p>${source(`<group>${sfs}</group>`)}\n${copy}</p>`,
            ]) {
                const addedValues: number[] = [];
                for (const requestedVariantIndex of variantIndices) {
                    const { core, resolvePathToNodeIdx } = await createTestCore(
                        {
                            doenetML,
                            requestedVariantIndex,
                        },
                    );
                    const stateVariables = await core.returnAllStateVariables(
                        false,
                        true,
                    );
                    const values = await selectedValues({
                        doenetML,
                        requestedVariantIndex,
                        names,
                    });
                    const [n1, n2, c1, c2, m1, m2] = values;
                    // the values drawn first from the source iterations' seeds
                    const firstDraws = await selectedValues({
                        doenetML: plainDoenetML,
                        requestedVariantIndex,
                        names: ["r[1].n", "r[2].n"],
                    });
                    const message = `${doenetML}, variant ${requestedVariantIndex}`;

                    // the copied children keep their source's values
                    expect([c1, c2], message).eqls([n1, n2]);

                    // the added children repeat no value of the source and
                    // don't draw first from the source iterations' seeds
                    for (const m of [m1, m2]) {
                        expect([n1, n2], message).not.contain(m);
                        expect(firstDraws, message).not.contain(m);
                    }
                    expect(m1, message).not.eq(m2);

                    // the added children's values are the same for a given
                    // variant, and when the page is loaded with the variant
                    // it generated
                    expect(
                        await selectedValues({
                            doenetML,
                            requestedVariantIndex,
                            names,
                        }),
                        message,
                    ).eqls(values);
                    expect(
                        await selectedValues({
                            doenetML,
                            requestedVariant: JSON.parse(
                                JSON.stringify(
                                    stateVariables[
                                        await resolvePathToNodeIdx("_document1")
                                    ].stateValues.generatedVariantInfo,
                                ),
                            ),
                            names,
                        }),
                        message,
                    ).eqls(values);

                    addedValues.push(m1);
                }

                // and differ between variants
                expect(new Set(addedValues).size, doenetML).eq(
                    variantIndices.length,
                );
            }
        }
    });

    it("an unlinked copy of a repeat keeps the random values in a nested repeat", async () => {
        // The group of the nested repeat's `for` attribute used to be given
        // its source's seed, so it drew nothing from the nested repeat's
        // seed, and each iteration of the nested repeat drew the value the
        // one before it drew in the source.
        const sfs = `<selectFromSequence name="n" from="1" to="1000"/>`;
        const names = [1, 2].flatMap((a) =>
            [1, 2].map((b) => `[${a}].i[${b}].n`),
        );
        for (const doenetML of [
            `<repeat name="r" for="1 2"><repeat name="i" for="a b">${sfs}</repeat></repeat>
<repeat copy="$r" name="r2"/>`,
            `<repeat name="r" for="1 2"><repeat name="i" for="a b"><group>${sfs}</group></repeat></repeat>
<repeat copy="$r" name="r2"/>`,
            `<repeat name="r" for="1 2"><group><repeat name="i" for="a b">${sfs}</repeat></group></repeat>
<repeat copy="$r" name="r2"/>`,
            `<repeatForSequence name="r" from="1" to="2"><repeatForSequence name="i" from="1" to="2">${sfs}</repeatForSequence></repeatForSequence>
<repeatForSequence copy="$r" name="r2"/>`,
        ]) {
            const sourceValues: number[] = [];
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
                    names: [
                        ...names.map((name) => `r${name}`),
                        ...names.map((name) => `r2${name}`),
                    ],
                });
                const message = `${doenetML}, variant ${requestedVariantIndex}`;

                // the copy keeps the source's values, in order
                expect(values.slice(4), message).eqls(values.slice(0, 4));

                // and keeps them when the page is loaded with the variant it
                // generated
                expect(
                    await selectedValues({
                        doenetML,
                        requestedVariant: JSON.parse(
                            JSON.stringify(
                                stateVariables[
                                    await resolvePathToNodeIdx("_document1")
                                ].stateValues.generatedVariantInfo,
                            ),
                        ),
                        names: [
                            ...names.map((name) => `r${name}`),
                            ...names.map((name) => `r2${name}`),
                        ],
                    }),
                    message,
                ).eqls(values);

                sourceValues.push(values[0]);
            }

            // the values differ between variants
            expect(new Set(sourceValues).size, doenetML).eq(
                variantIndices.length,
            );
        }
    });

    it("an unlinked copy keeps the random values in a nested repeat in other arrangements", async () => {
        // in a group copy, three deep, with a `for` that refers to a random
        // value, and in a repeatForSequence
        const sfs = `<selectFromSequence name="n" from="1" to="1000"/>`;
        const paths = ["[1].i[1].n", "[1].i[2].n", "[2].i[1].n", "[2].i[2].n"];
        for (const [doenetML, source, copy, names] of [
            [
                `<group name="g"><repeat name="r" for="1 2"><repeat name="i" for="a b">${sfs}</repeat></repeat></group>
<group copy="$g" name="g2"/>`,
                "g.r",
                "g2.r",
                paths,
            ],
            [
                `<repeat name="r" for="1 2"><repeat name="i" for="a b"><repeat name="k" for="x y">${sfs}</repeat></repeat></repeat>
<repeat copy="$r" name="r2"/>`,
                "r",
                "r2",
                [
                    "[1].i[1].k[1].n",
                    "[1].i[2].k[2].n",
                    "[2].i[1].k[2].n",
                    "[2].i[2].k[1].n",
                ],
            ],
            [
                `<repeat name="r" for="1 2"><selectFromSequence name="m" from="1" to="9" numToSelect="2"/><repeat name="i" for="$m">${sfs}</repeat></repeat>
<repeat copy="$r" name="r2"/>`,
                "r",
                "r2",
                ["[1].m", "[2].m", ...paths],
            ],
            [
                `<repeatForSequence name="r" from="1" to="2"><repeat name="i" for="a b">${sfs}</repeat></repeatForSequence>
<repeatForSequence copy="$r" name="r2"/>`,
                "r",
                "r2",
                paths,
            ],
        ] as [string, string, string, string[]][]) {
            for (const requestedVariantIndex of variantIndices) {
                const values = await selectedValues({
                    doenetML,
                    requestedVariantIndex,
                    names: [
                        ...names.map((name) => `${source}${name}`),
                        ...names.map((name) => `${copy}${name}`),
                    ],
                });
                expect(
                    values.slice(names.length),
                    `${doenetML}, variant ${requestedVariantIndex}`,
                ).eqls(values.slice(0, names.length));
            }
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
