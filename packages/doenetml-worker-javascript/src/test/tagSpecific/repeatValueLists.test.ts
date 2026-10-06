import { afterEach, describe, expect, it } from "vitest";
import { createTestCore } from "../utils/test-core";
import { setRepeatListsEnabled } from "../../utils/dast/repeatLists";
import { updateMathInputValue } from "../utils/actions";

/**
 * A repeat whose template is one `<math>` or `<number>` is a list
 * (`_repeatValueList`, Doenet/DoenetML#2163). Each document here is checked
 * against itself with the repeat left a composite (`setRepeatListsEnabled`):
 * what an author sees must be the same.
 */
describe("Repeats whose template is one value @group4", () => {
    afterEach(() => setRepeatListsEnabled(true));

    async function load(doenetML: string, asList: boolean) {
        setRepeatListsEnabled(asList);
        const result = await createTestCore({ doenetML });
        setRepeatListsEnabled(true);
        return result;
    }

    async function typeOf(
        core: any,
        resolvePathToNodeIdx: any,
        name: string,
    ): Promise<string> {
        return core.core!._components[await resolvePathToNodeIdx(name)]
            .componentType;
    }

    /** The `text` of each of `names`. */
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

    /**
     * Load `doenetML` with and without repeat lists; check that the repeat
     * `repeatName` is a list only with them (or never, for one that must
     * stay a composite), and that the `text` of each of `names` is the same.
     */
    async function compare({
        doenetML,
        names,
        repeatName = "r",
        becomesList = true,
        afterLoad,
    }: {
        doenetML: string;
        names: string[];
        repeatName?: string;
        becomesList?: boolean;
        afterLoad?: (
            core: any,
            resolvePathToNodeIdx: any,
        ) => Promise<void> | void;
    }) {
        const results: Record<string, string>[] = [];
        for (const asList of [true, false]) {
            const { core, resolvePathToNodeIdx } = await load(doenetML, asList);
            const type = await typeOf(core, resolvePathToNodeIdx, repeatName);
            expect(type === "_repeatValueList").toBe(asList && becomesList);
            if (afterLoad) {
                await afterLoad(core, resolvePathToNodeIdx);
            }
            results.push(await textsOf(core, resolvePathToNodeIdx, names));
        }
        expect(results[0]).toEqual(results[1]);
        return results[0];
    }

    it("a number of the index", async () => {
        const texts = await compare({
            doenetML: `
<p name="p"><repeatForSequence name="r" from="1" to="4" valueName="i"><number>$i^2</number></repeatForSequence></p>
<p name="p2">$r[2]</p>
<p name="p3"><sum>$r</sum></p>
`,
            names: ["p", "p2", "p3"],
        });
        expect(texts).toEqual({ p: "1, 4, 9, 16", p2: "4", p3: "30" });
    });
    it("a math of the value, an entry of a list at the index, and a value outside", async () => {
        const texts = await compare({
            doenetML: `
<numberList name="l">10 20 30</numberList>
<math name="c">y</math>
<p name="p"><repeatForSequence name="r" from="2" to="4" valueName="v" indexName="i"><math>$v x + $l[$i] + $c</math></repeatForSequence></p>
<p name="p2">$r[3]</p>
`,
            names: ["p", "p2"],
        });
        expect(texts).toEqual({
            p: "2 x + 10 + y, 3 x + 20 + y, 4 x + 30 + y",
            p2: "4 x + 30 + y",
        });
    });

    it("an index past the end of the list read", async () => {
        await compare({
            doenetML: `
<numberList name="l">10 20</numberList>
<p name="p"><repeatForSequence name="r" from="1" to="3" indexName="i"><math>$l[$i] + 1</math></repeatForSequence></p>
<p name="pn"><repeatForSequence name="rn" from="1" to="3" indexName="i"><number>$l[$i] + 1</number></repeatForSequence></p>
`,
            names: ["p", "pn"],
        });
    });

    it("a nested math, simplified", async () => {
        const texts = await compare({
            doenetML: `
<p name="p"><repeatForSequence name="r" from="1" to="4" valueName="kz"><math simplify><math simplify>$kz/12</math>pi</math></repeatForSequence></p>
`,
            names: ["p"],
        });
        expect(texts.p).toBe("π/12, π/6, π/4, π/3");
    });

    it("the value of a repeat over a list", async () => {
        const texts = await compare({
            doenetML: `
<mathList name="terms">2 4 6</mathList>
<number name="deltat">2</number>
<p name="p"><repeat name="r" for="$terms" valueName="v"><math simplify="numbers">$v/$deltat</math></repeat></p>
`,
            names: ["p"],
        });
        expect(texts).toEqual({ p: "1, 2, 3" });
    });

    it("a sum of a repeat over a list of numbers", async () => {
        const texts = await compare({
            doenetML: `
<numberList name="values2">0 0 10 10</numberList>
<number name="mean2">5</number>
<p name="p"><sum name="s"><repeat name="r" for="$values2" valueName="v"><number>($v-$mean2)^2</number></repeat></sum></p>
`,
            names: ["p"],
        });
        expect(texts.p).toBe("100");
    });

    it("a literal number, and display settings", async () => {
        await compare({
            doenetML: `
<p name="p"><repeatForSequence name="r" from="1" to="3"><number>7</number></repeatForSequence></p>
<p name="p2"><repeatForSequence name="r2" from="1" to="3" valueName="v"><number displayDigits="2">$v/3</number></repeatForSequence></p>
<p name="p3"><repeatForSequence name="r3" from="1" to="3" valueName="v"><math displayDecimals="1">$v/3 x</math></repeatForSequence></p>
`,
            names: ["p", "p2", "p3"],
        });
    });

    it("the template's name refers to the entry", async () => {
        const texts = await compare({
            doenetML: `
<p name="p"><repeatForSequence name="r" from="1" to="3" valueName="v"><math name="m">$v^2</math></repeatForSequence></p>
<p name="p1">$r[2].m</p>
<p name="p2">$r[3]</p>
`,
            names: ["p", "p1", "p2"],
        });
        expect(texts).toEqual({ p: "1², 2², 3²", p1: "2²", p2: "3²" });
    });

    it("a change in the number of iterations", async () => {
        await compare({
            doenetML: `
<mathInput name="n" prefill="2" />
<p name="p"><repeatForSequence name="r" from="1" to="$n" valueName="v"><math>$v x</math></repeatForSequence></p>
`,
            names: ["p"],
            afterLoad: async (core, resolvePathToNodeIdx) => {
                const n = await resolvePathToNodeIdx("n");
                await updateMathInputValue({
                    latex: "4",
                    componentIdx: n,
                    core,
                });
                await updateMathInputValue({
                    latex: "1",
                    componentIdx: n,
                    core,
                });
                await updateMathInputValue({
                    latex: "3",
                    componentIdx: n,
                    core,
                });
            },
        });
    });

    it("a write to an entry goes to the entry of the list it reads", async () => {
        const texts = await compare({
            doenetML: `
<numberList name="l">1 2 3</numberList>
<p name="p"><repeatForSequence name="r" from="1" to="3" indexName="i"><number>$l[$i]+10</number></repeatForSequence></p>
<mathInput name="mi" bindValueTo="$r[2]" />
<p name="pl">$l</p>
`,
            names: ["p", "pl"],
            afterLoad: async (core, resolvePathToNodeIdx) => {
                await updateMathInputValue({
                    latex: "17",
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
            },
        });
        expect(texts).toEqual({ p: "11, 17, 13", pl: "1, 7, 3" });
    });

    it("a write through a value outside the template changes every entry", async () => {
        const texts = await compare({
            doenetML: `
<math name="c">5</math>
<p name="p"><repeatForSequence name="r" from="1" to="3" valueName="v"><math>$c + $v</math></repeatForSequence></p>
<mathInput name="mi" bindValueTo="$r[2]" />
<p name="pc">$c</p>
`,
            names: ["p", "pc"],
            afterLoad: async (core, resolvePathToNodeIdx) => {
                await updateMathInputValue({
                    latex: "12",
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
            },
        });
        expect(texts.pc).toBe("10");
    });

    it("a write to the index is refused, and to a literal is kept", async () => {
        await compare({
            doenetML: `
<p name="p"><repeatForSequence name="r" from="1" to="3" valueName="v"><number>$v</number></repeatForSequence></p>
<mathInput name="mi" bindValueTo="$r[2]" />
<p name="p2"><repeatForSequence name="r2" from="1" to="3"><number>7</number></repeatForSequence></p>
<mathInput name="mi2" bindValueTo="$r2[2]" />
`,
            names: ["p", "p2"],
            afterLoad: async (core, resolvePathToNodeIdx) => {
                await updateMathInputValue({
                    latex: "12",
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
                await updateMathInputValue({
                    latex: "9",
                    componentIdx: await resolvePathToNodeIdx("mi2"),
                    core,
                });
            },
        });
    });

    it("random values after the repeat are unchanged", async () => {
        for (const requestedVariantIndex of [1, 2, 3]) {
            const results: string[] = [];
            for (const asList of [true, false]) {
                setRepeatListsEnabled(asList);
                const { core, resolvePathToNodeIdx } = await createTestCore({
                    doenetML: `
<selectFromSequence name="a" from="1" to="1000" />
<p name="p"><repeatForSequence name="r" from="1" to="3" valueName="v"><number>$v</number></repeatForSequence></p>
<selectFromSequence name="b" from="1" to="1000" />
<p name="pb">$a, $b</p>
`,
                    requestedVariantIndex,
                });
                setRepeatListsEnabled(true);
                expect(await typeOf(core, resolvePathToNodeIdx, "r")).toBe(
                    asList ? "_repeatValueList" : "repeatForSequence",
                );
                results.push(
                    (await textsOf(core, resolvePathToNodeIdx, ["pb"])).pb,
                );
            }
            expect(results[0]).toBe(results[1]);
        }
    });

    it("stays a composite where an entry cannot stand in for an iteration", async () => {
        for (const doenetML of [
            // in a graph
            `<graph><repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence></graph>`,
            // copied
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence><math copy="$r[1]" />`,
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence><repeatForSequence copy="$r" />`,
            // named by a trigger
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence><updateValue triggerWhenObjectsClicked="$r[1]" target="$x" newValue="2" /><number name="x">1</number>`,
            // a nested component named
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><math><math name="inner">$v</math>+1</math></repeatForSequence>`,
            // the value read past its first part
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence><p>$r[1].v</p>`,
            // an index computed
            `<numberList name="l">1 2 3</numberList><repeatForSequence name="r" from="1" to="2" indexName="i"><math>$l[$i+1]</math></repeatForSequence>`,
            // a math operator
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><math><abs>$v</abs></math></repeatForSequence>`,
            // more than one component
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math><math>$v</math></repeatForSequence>`,
            // a repeat over something that is not one list
            `<repeat name="r" for="1 2" valueName="v"><math>$v</math></repeat>`,
            // a sampler
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v + <selectFromSequence from="1" to="5"/></math></repeatForSequence>`,
        ]) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
            });
            expect(
                await typeOf(core, resolvePathToNodeIdx, "r"),
                doenetML,
            ).not.toBe("_repeatValueList");
        }
    });

    it("a written entry is kept through a reload", async () => {
        const doenetML = `
<numberList name="l">1 2 3</numberList>
<p name="p"><repeatForSequence name="r" from="1" to="3" indexName="i"><number>$l[$i]+10</number></repeatForSequence></p>
<mathInput name="mi" bindValueTo="$r[2]" />
<p name="p2"><repeatForSequence name="r2" from="1" to="3"><number>7</number></repeatForSequence></p>
<mathInput name="mi2" bindValueTo="$r2[2]" />
`;
        const { core, resolvePathToNodeIdx, scoreState } = await createTestCore(
            {
                doenetML,
            },
        );
        await updateMathInputValue({
            latex: "17",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        await updateMathInputValue({
            latex: "9",
            componentIdx: await resolvePathToNodeIdx("mi2"),
            core,
        });
        const written = await textsOf(core, resolvePathToNodeIdx, ["p", "p2"]);
        expect(written).toEqual({ p: "11, 17, 13", p2: "7, 9, 7" });
        await core.core!.saveImmediately();
        const reloaded = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        });
        expect(
            await textsOf(reloaded.core, reloaded.resolvePathToNodeIdx, [
                "p",
                "p2",
            ]),
        ).toEqual(written);
    });
});
