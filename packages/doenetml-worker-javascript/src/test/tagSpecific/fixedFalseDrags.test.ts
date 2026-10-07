import { afterEach, describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue, updateTextInputValue } from "../utils/actions";
import { setRepeatListsEnabled } from "../../utils/dast/repeatLists";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Dragging a point whose coordinates read a value that `fixed="false"` lets
 * change: a repeat's value and index, a sampler's selections and a
 * sequence's values (Doenet/DoenetML#2228). A drag changes the value, and
 * each coordinate computed from it follows, so a point at `($v, $$f($v))`
 * moves along the function's graph. Each document is loaded with and without
 * repeat lists (`setRepeatListsEnabled`), and the two must agree.
 */
describe("Dragging points at values that are not fixed @group3", async () => {
    afterEach(() => setRepeatListsEnabled(true));

    const f = `<function name="f" variables="t">t^2/2</function>`;

    /**
     * The repeat `repeat`, with `FIXED` where its `fixed` goes, made not
     * fixed in the two ways an author can: by its own `fixed="false"`, which
     * keeps it a composite, and by an ancestor's, with which it is a list.
     */
    function notFixed(repeat: string) {
        return [
            {
                repeat: repeat.replace("FIXED", ` fixed="false"`),
                becomesList: false,
            },
            {
                repeat: `<group fixed="false">${repeat.replace("FIXED", "")}</group>`,
                becomesList: true,
            },
        ];
    }

    /** The coordinates of the points drawn in the graph `g`, in order. */
    async function pointsDrawn(core: any, resolvePathToNodeIdx: any) {
        const rendererState =
            core.core.rendererInstructionBuilder.rendererState;
        const points: { componentIdx: number; coords: number[] }[] = [];
        function visit(instructions: any[]) {
            for (const child of instructions) {
                if (typeof child !== "object" || !child) {
                    continue;
                }
                const state = rendererState[child.componentIdx];
                if (child.componentType === "point") {
                    points.push({
                        componentIdx: child.componentIdx,
                        coords: state.stateValues.numericalXs,
                    });
                } else if (state?.childrenInstructions) {
                    visit(state.childrenInstructions);
                }
            }
        }
        visit(
            rendererState[await resolvePathToNodeIdx("g")].childrenInstructions,
        );
        return points;
    }

    async function drag(
        core: any,
        resolvePathToNodeIdx: any,
        index: number,
        x: number,
        y: number,
    ) {
        const points = await pointsDrawn(core, resolvePathToNodeIdx);
        await core.requestAction({
            componentIdx: points[index].componentIdx,
            actionName: "movePoint",
            args: { x, y },
        });
    }

    async function coordsDrawn(core: any, resolvePathToNodeIdx: any) {
        return (await pointsDrawn(core, resolvePathToNodeIdx)).map(
            (point) => point.coords,
        );
    }

    /**
     * Load `doenetML` with and without repeat lists, check that a repeat
     * named `r` is a list only with them when `becomesList`, run `act`, and
     * return what each load gave, which must be the same.
     */
    async function compare<T>({
        doenetML,
        becomesList,
        act,
    }: {
        doenetML: string;
        becomesList?: boolean;
        act: (core: any, resolvePathToNodeIdx: any) => Promise<T>;
    }): Promise<T> {
        const results: T[] = [];
        for (const asList of [true, false]) {
            setRepeatListsEnabled(asList);
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
            });
            setRepeatListsEnabled(true);
            if (becomesList !== undefined) {
                const type =
                    core.core!._components[await resolvePathToNodeIdx("r")]
                        .componentType;
                expect(type.startsWith("_repeat"), doenetML).toBe(
                    asList && becomesList,
                );
            }
            results.push(await act(core, resolvePathToNodeIdx));
        }
        expect(results[0], doenetML).toEqual(results[1]);
        return results[0];
    }

    /**
     * The points drawn in `g` before and after dragging the one at `index`
     * to (7, 8).
     */
    async function dragResult(doenetML: string, index = 1, becomesList = true) {
        return compare({
            doenetML,
            becomesList,
            act: async (core, resolvePathToNodeIdx) => {
                const before = await coordsDrawn(core, resolvePathToNodeIdx);
                await drag(core, resolvePathToNodeIdx, index, 7, 8);
                const after = await coordsDrawn(core, resolvePathToNodeIdx);
                return { before, after };
            },
        });
    }

    it("a repeatForSequence's value and index take a drag with fixed=false", async () => {
        const cases: {
            point: string;
            attrs: string;
            fixedFalse: boolean;
            before: number[][];
            after: number[][];
        }[] = [
            {
                point: "($v, 1)",
                attrs: `valueName="v"`,
                fixedFalse: true,
                before: [
                    [1, 1],
                    [2, 1],
                    [3, 1],
                ],
                after: [
                    [1, 1],
                    [7, 8],
                    [3, 1],
                ],
            },
            {
                point: "($v, $$f($v))",
                attrs: `valueName="v"`,
                fixedFalse: true,
                before: [
                    [1, 0.5],
                    [2, 2],
                    [3, 4.5],
                ],
                after: [
                    [1, 0.5],
                    [7, 24.5],
                    [3, 4.5],
                ],
            },
            {
                point: "($v, $v^2/2)",
                attrs: `valueName="v"`,
                fixedFalse: true,
                before: [
                    [1, 0.5],
                    [2, 2],
                    [3, 4.5],
                ],
                after: [
                    [1, 0.5],
                    [7, 24.5],
                    [3, 4.5],
                ],
            },
            {
                point: "($v+1, 1)",
                attrs: `valueName="v"`,
                fixedFalse: true,
                before: [
                    [2, 1],
                    [3, 1],
                    [4, 1],
                ],
                after: [
                    [2, 1],
                    [7, 8],
                    [4, 1],
                ],
            },
            {
                point: "($i, 1)",
                attrs: `indexName="i"`,
                fixedFalse: true,
                before: [
                    [1, 1],
                    [2, 1],
                    [3, 1],
                ],
                after: [
                    [1, 1],
                    [7, 8],
                    [3, 1],
                ],
            },
            {
                point: "($v, $i)",
                attrs: `valueName="v" indexName="i"`,
                fixedFalse: true,
                before: [
                    [1, 1],
                    [2, 2],
                    [3, 3],
                ],
                after: [
                    [1, 1],
                    [7, 8],
                    [3, 3],
                ],
            },
            // without fixed="false", the value and index keep theirs
            {
                point: "($v, 1)",
                attrs: `valueName="v"`,
                fixedFalse: false,
                before: [
                    [1, 1],
                    [2, 1],
                    [3, 1],
                ],
                after: [
                    [1, 1],
                    [2, 8],
                    [3, 1],
                ],
            },
            {
                point: "($i, 1)",
                attrs: `indexName="i"`,
                fixedFalse: false,
                before: [
                    [1, 1],
                    [2, 1],
                    [3, 1],
                ],
                after: [
                    [1, 1],
                    [2, 8],
                    [3, 1],
                ],
            },
            {
                point: "($v, $$f($v))",
                attrs: `valueName="v"`,
                fixedFalse: false,
                before: [
                    [1, 0.5],
                    [2, 2],
                    [3, 4.5],
                ],
                after: [
                    [1, 0.5],
                    [2, 2],
                    [3, 4.5],
                ],
            },
        ];
        for (const { point, attrs, fixedFalse, before, after } of cases) {
            const repeat = `<repeatForSequence name="r" from="1" to="3" ${attrs}FIXED><point>${point}</point></repeatForSequence>`;
            const variants = fixedFalse
                ? notFixed(repeat)
                : [{ repeat: repeat.replace("FIXED", ""), becomesList: true }];
            for (const variant of variants) {
                const doenetML = `${f}<graph name="g">${variant.repeat}</graph>`;
                expect(
                    await dragResult(doenetML, 1, variant.becomesList),
                    doenetML,
                ).toEqual({ before, after });
            }
        }
    });

    it("a repeat's index takes a drag with fixed=false, and its value takes one as its for does", async () => {
        const cases: {
            sequence: string;
            repeat: string;
            fixedFalse: boolean;
            after: number[];
        }[] = [
            {
                sequence: `<sequence name="q" from="1" to="3" />`,
                repeat: `<repeat name="r" for="$q" valueName="v" indexName="i"FIXED><point>($i, $v)</point></repeat>`,
                fixedFalse: true,
                after: [7, 2],
            },
            {
                sequence: `<sequence name="q" from="1" to="3" fixed="false" />`,
                repeat: `<repeat name="r" for="$q" valueName="v"FIXED><point>($v, 1)</point></repeat>`,
                fixedFalse: false,
                after: [7, 8],
            },
            {
                sequence: `<sequence name="q" from="1" to="3" />`,
                repeat: `<repeat name="r" for="$q" valueName="v"FIXED><point>($v, 1)</point></repeat>`,
                fixedFalse: true,
                after: [2, 8],
            },
        ];
        for (const { sequence, repeat, fixedFalse, after } of cases) {
            const variants = fixedFalse
                ? notFixed(repeat)
                : [{ repeat: repeat.replace("FIXED", ""), becomesList: true }];
            for (const variant of variants) {
                const doenetML = `${sequence}<graph name="g">${variant.repeat}</graph>`;
                const result = await dragResult(
                    doenetML,
                    1,
                    variant.becomesList,
                );
                expect(result.after[1], doenetML).toEqual(after);
            }
        }
    });

    it("a written value or index stays with its iteration as the repeat changes", async () => {
        const steps = async (rep: string, becomesList: boolean) =>
            compare({
                doenetML: `
    <mathInput name="a" prefill="1" /><mathInput name="b" prefill="3" />
    <graph name="g">${rep}</graph>`,
                becomesList,
                act: async (core, resolvePathToNodeIdx) => {
                    const log: number[][][] = [];
                    const setInput = async (name: string, latex: string) => {
                        await updateMathInputValue({
                            latex,
                            componentIdx: await resolvePathToNodeIdx(name),
                            core,
                        });
                        log.push(await coordsDrawn(core, resolvePathToNodeIdx));
                    };
                    await drag(core, resolvePathToNodeIdx, 1, 7, 8);
                    log.push(await coordsDrawn(core, resolvePathToNodeIdx));
                    await setInput("b", "1");
                    await setInput("b", "3");
                    await setInput("a", "2");
                    await setInput("a", "1");
                    return log;
                },
            });

        // A value written to the repeat's value stands while the values are
        // computed from the same `from`, as for a `<sequence>`, and while
        // the iteration is withheld.
        for (const { repeat, becomesList } of notFixed(
            `<repeatForSequence name="r" from="$a" to="$b" valueName="v"FIXED><point>($v, 1)</point></repeatForSequence>`,
        )) {
            expect(await steps(repeat, becomesList), repeat).toEqual([
                [
                    [1, 1],
                    [7, 8],
                    [3, 1],
                ],
                [[1, 1]],
                [
                    [1, 1],
                    [7, 8],
                    [3, 1],
                ],
                [
                    [2, 1],
                    [3, 8],
                ],
                [
                    [1, 1],
                    [7, 8],
                    [3, 1],
                ],
            ]);
        }

        // A value written to the index stays with the iteration, whatever its
        // value.
        for (const { repeat, becomesList } of notFixed(
            `<repeatForSequence name="r" from="$a" to="$b" indexName="i"FIXED><point>($i, 1)</point></repeatForSequence>`,
        )) {
            expect(await steps(repeat, becomesList), repeat).toEqual([
                [
                    [1, 1],
                    [7, 8],
                    [3, 1],
                ],
                [[1, 1]],
                [
                    [1, 1],
                    [7, 8],
                    [3, 1],
                ],
                [
                    [1, 1],
                    [7, 8],
                ],
                [
                    [1, 1],
                    [7, 8],
                    [3, 1],
                ],
            ]);
        }
    });

    it("a written value or index is saved and read back", async () => {
        // The two repeats made not fixed the same way, each time.
        const [own, ancestor] = [0, 1].map((ind) =>
            [
                `<repeatForSequence name="r" from="1" to="3" valueName="v"FIXED><point>($v, $$f($v))</point></repeatForSequence>`,
                `<repeatForSequence name="r2" from="1" to="3" indexName="i"FIXED><point>($i, 10)</point></repeatForSequence>`,
            ]
                .map((repeat) => notFixed(repeat)[ind].repeat)
                .join(""),
        );
        for (const [repeats, asList] of [
            [own, true],
            [own, false],
            [ancestor, true],
            [ancestor, false],
        ] as const) {
            const doenetML = `${f}<graph name="g">${repeats}</graph>`;
            setRepeatListsEnabled(asList);
            const { core, resolvePathToNodeIdx, scoreState } =
                await createTestCore({ doenetML });
            setRepeatListsEnabled(true);
            await drag(core, resolvePathToNodeIdx, 1, 4, 0);
            await drag(core, resolvePathToNodeIdx, 5, 6, 10);
            const expected = [
                [1, 0.5],
                [4, 8],
                [3, 4.5],
                [1, 10],
                [2, 10],
                [6, 10],
            ];
            expect(await coordsDrawn(core, resolvePathToNodeIdx)).toEqual(
                expected,
            );

            await core.core!.saveImmediately();
            setRepeatListsEnabled(asList);
            const reloaded = await createTestCore({
                doenetML,
                initialState: scoreState.state,
            });
            setRepeatListsEnabled(true);
            expect(
                await coordsDrawn(reloaded.core, reloaded.resolvePathToNodeIdx),
                `${doenetML} asList: ${asList}`,
            ).toEqual(expected);
        }
    });

    it("a math of a repeat's value takes a value written to it with fixed=false", async () => {
        for (const { repeat, becomesList } of notFixed(
            `<repeatForSequence name="r" from="1" to="3" valueName="v"FIXED><math>$v+1</math></repeatForSequence>`,
        )) {
            const result = await compare({
                doenetML: `
    <p name="p">${repeat}</p>
    <mathInput name="mi" bindValueTo="$r[2]" />`,
                becomesList,
                act: async (core, resolvePathToNodeIdx) => {
                    await updateMathInputValue({
                        latex: "8",
                        componentIdx: await resolvePathToNodeIdx("mi"),
                        core,
                    });
                    const stateVariables = await core.returnAllStateVariables(
                        false,
                        true,
                    );
                    return stateVariables[await resolvePathToNodeIdx("p")]
                        .stateValues.text;
                },
            });
            expect(result, repeat).eq("1 + 1, 7 + 1, 3 + 1");
        }
    });

    it("a written value is dropped when the repeat's step or exclude changes, and comes back with it", async () => {
        for (const { repeat, becomesList } of notFixed(
            `<repeatForSequence name="r" from="1" length="3" step="$s" exclude="$e" valueName="v" indexName="i"FIXED><point>($v, $i)</point></repeatForSequence>`,
        )) {
            const log = await compare({
                doenetML: `
    <mathInput name="e" prefill="10" /><mathInput name="s" prefill="1" />
    <graph name="g">${repeat}</graph>`,
                becomesList,
                act: async (core, resolvePathToNodeIdx) => {
                    const log: number[][][] = [];
                    await drag(core, resolvePathToNodeIdx, 1, 7, 8);
                    log.push(await coordsDrawn(core, resolvePathToNodeIdx));
                    for (const [name, latex] of [
                        ["e", "1"],
                        ["e", "10"],
                        ["s", "2"],
                        ["s", "1"],
                    ]) {
                        await updateMathInputValue({
                            latex,
                            componentIdx: await resolvePathToNodeIdx(name),
                            core,
                        });
                        log.push(await coordsDrawn(core, resolvePathToNodeIdx));
                    }
                    return log;
                },
            });
            const written = [
                [1, 1],
                [7, 8],
                [3, 3],
            ];
            expect(log, repeat).toEqual([
                written,
                [
                    [2, 1],
                    [3, 8],
                ],
                written,
                [
                    [1, 1],
                    [3, 8],
                    [5, 3],
                ],
                written,
            ]);
        }
    });

    it("a math or letters repeat's value takes a value written to it with fixed=false", async () => {
        const cases = [
            {
                repeat: `<repeatForSequence name="r" type="math" from="x" step="y" length="3" valueName="v"FIXED><math>$v</math></repeatForSequence>`,
                input: `<mathInput name="in" bindValueTo="$r[2]" />`,
                write: (core: any, componentIdx: number) =>
                    updateMathInputValue({ latex: "z", componentIdx, core }),
                expected: "x, z, x + 2 y",
            },
            {
                repeat: `<repeatForSequence name="r" type="letters" from="a" to="c" valueName="v"FIXED><text>$v</text></repeatForSequence>`,
                input: `<textInput name="in" bindValueTo="$r[2]" />`,
                write: (core: any, componentIdx: number) =>
                    updateTextInputValue({ text: "zz", componentIdx, core }),
                expected: "a, zz, c",
            },
        ];
        for (const { repeat: template, input, write, expected } of cases) {
            for (const { repeat } of notFixed(template)) {
                const doenetML = `<p name="p">${repeat}</p>${input}`;
                const text = await compare({
                    doenetML,
                    act: async (core, resolvePathToNodeIdx) => {
                        await write(core, await resolvePathToNodeIdx("in"));
                        const stateVariables =
                            await core.returnAllStateVariables(false, true);
                        return stateVariables[await resolvePathToNodeIdx("p")]
                            .stateValues.text;
                    },
                });
                expect(text, doenetML).eq(expected);
            }
        }
    });

    it("a template's own fixed does not reach the repeat's value", async () => {
        // A template with `fixed="false"` that reads the value keeps the
        // composite, whose iterations' values were fixed by the repeat
        expect(
            await dragResult(
                `<graph name="g"><repeatForSequence name="r" from="1" to="3" valueName="v"><point fixed="false">($v, 1)</point></repeatForSequence></graph>`,
                1,
                false,
            ),
        ).toEqual({
            before: [
                [1, 1],
                [2, 1],
                [3, 1],
            ],
            after: [
                [1, 1],
                [2, 8],
                [3, 1],
            ],
        });
        expect(
            await compare({
                doenetML: `
    <p name="p"><repeatForSequence name="r" from="1" to="3" valueName="v"><math fixed="false">$v+1</math></repeatForSequence></p>
    <mathInput name="mi" bindValueTo="$r[2]" />`,
                becomesList: false,
                act: async (core, resolvePathToNodeIdx) => {
                    await updateMathInputValue({
                        latex: "8",
                        componentIdx: await resolvePathToNodeIdx("mi"),
                        core,
                    });
                    const stateVariables = await core.returnAllStateVariables(
                        false,
                        true,
                    );
                    return stateVariables[await resolvePathToNodeIdx("p")]
                        .stateValues.text;
                },
            }),
        ).eq("1 + 1, 2 + 1, 3 + 1");

        // one with `fixed="true"` is a list, and takes no drag
        expect(
            await dragResult(
                `<graph name="g"><group fixed="false"><repeatForSequence name="r" from="1" to="3" valueName="v"><point fixed="true">($v, 1)</point></repeatForSequence></group></graph>`,
            ),
        ).toEqual({
            before: [
                [1, 1],
                [2, 1],
                [3, 1],
            ],
            after: [
                [1, 1],
                [2, 1],
                [3, 1],
            ],
        });
    });

    it("a sampler's or sequence's value takes a drag with fixed=false", async () => {
        const cases: { component: string; point: string }[] = [
            {
                component: `<selectRandomNumbers name="a" fixed="false" />`,
                point: "($a, 2)",
            },
            {
                component: `<selectRandomNumbers name="a" type="gaussian" fixed="false" />`,
                point: "($a, 2)",
            },
            {
                component: `<selectRandomNumbers name="a" from="0" to="10" numToSelect="2" fixed="false" />`,
                point: "($a)",
            },
            {
                component: `<sampleRandomNumbers name="a" from="0" to="10" fixed="false" />`,
                point: "($a, 2)",
            },
            {
                component: `<sampleRandomNumbers name="a" from="0" to="10" numSamples="2" fixed="false" />`,
                point: "($a)",
            },
            {
                component: `<selectPrimeNumbers name="a" maxValue="20" fixed="false" />`,
                point: "($a, 2)",
            },
            {
                component: `<samplePrimeNumbers name="a" maxValue="20" fixed="false" />`,
                point: "($a, 2)",
            },
            {
                component: `<selectFromSequence name="a" from="1" to="10" fixed="false" />`,
                point: "($a, 2)",
            },
            {
                component: `<selectFromSequence name="a" from="1" to="10" numToSelect="2" fixed="false" />`,
                point: "($a[1], $a[2])",
            },
            {
                component: `<selectFromSequence name="a" from="1" to="10" numToSelect="2" fixed="false" />`,
                point: "($a)",
            },
            {
                component: `<select name="a" fixed="false">1 2 3</select>`,
                point: "($a, 2)",
            },
            {
                component: `<select name="a" type="number" fixed="false">1 2 3</select>`,
                point: "($a, 2)",
            },
            {
                component: `<sequence name="a" from="1" to="3" fixed="false" />`,
                point: "($a[2], 2)",
            },
            {
                component: `<sequence name="a" from="1" to="2" fixed="false" />`,
                point: "($a)",
            },
        ];
        for (const { component, point } of cases) {
            const doenetML = `${component}<graph name="g"><point>${point}</point></graph>`;
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
            });
            await drag(core, resolvePathToNodeIdx, 0, 7, 8);
            expect(
                await coordsDrawn(core, resolvePathToNodeIdx),
                doenetML,
            ).toEqual([[7, 8]]);
        }

        // a sampler in each iteration of a repeat
        const doenetML = `<graph name="g"><repeatForSequence name="r" from="1" to="3" valueName="v"><selectRandomNumbers name="a" from="1" to="1" fixed="false" /><point>($a, $v)</point></repeatForSequence></graph>`;
        expect(await dragResult(doenetML, 1, false)).toEqual({
            before: [
                [1, 1],
                [1, 2],
                [1, 3],
            ],
            after: [
                [1, 1],
                [7, 2],
                [1, 3],
            ],
        });
    });
});
