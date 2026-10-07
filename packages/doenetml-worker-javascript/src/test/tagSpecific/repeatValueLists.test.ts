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
<p name="pd"><repeatForSequence name="rd" from="1" to="3" indexName="i"><number>$l[$i]</number></repeatForSequence></p>
`,
            names: ["p", "pn", "pd"],
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
<group name="g"><repeatForSequence name="r2" from="1" to="3" valueName="v"><math name="n">$v^2</math></repeatForSequence></group>
<p name="p3">$g.r2[2].n</p>
`,
            names: ["p", "p1", "p2", "p3"],
        });
        expect(texts).toEqual({
            p: "1², 2², 3²",
            p1: "2²",
            p2: "3²",
            p3: "2²",
        });
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

    it("an entry the template cannot write takes no write, so what reads it writes elsewhere", async () => {
        const texts = await compare({
            doenetML: `
<math name="c">5</math>
<p name="p"><repeatForSequence name="r" from="1" to="3" valueName="v"><math>$v</math></repeatForSequence></p>
<p><math name="o">$r[2] + $c</math></p>
<mathInput name="mi" bindValueTo="$o" />
<p name="pc">$c</p>
`,
            names: ["p", "pc"],
            afterLoad: async (core, resolvePathToNodeIdx) => {
                await updateMathInputValue({
                    latex: "20",
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
            },
        });
        expect(texts).toEqual({ p: "1, 2, 3", pc: "18" });
    });

    it("codes side by side are a product, which takes no write when two can be written", async () => {
        const texts = await compare({
            doenetML: `
<numberList name="l">1 2 3</numberList>
<math name="k">2</math>
<math name="c">5</math>
<p name="p"><repeatForSequence name="r" from="1" to="3" indexName="i"><math>$l[$i]$k</math></repeatForSequence></p>
<p><math name="o">$r[2] + $c</math></p>
<mathInput name="mi" bindValueTo="$o" />
<p name="pc">$c</p>
`,
            names: ["p", "pc"],
            afterLoad: async (core, resolvePathToNodeIdx) => {
                await updateMathInputValue({
                    latex: "20",
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
            },
        });
        expect(texts.pc).toBe("16");
    });

    it("a reference to the whole list reports its entries writable as the list does", async () => {
        // `$q.r` is a copy of the whole list, holding no template; it reads
        // whether the entries take a write from the list. A literal entry
        // takes one, so `$o` writes it, and the copy's entry takes one too.
        await compare({
            doenetML: `
<math name="c">5</math>
<p name="p"><repeatForSequence name="r" from="1" to="3" valueName="v"><math>x</math></repeatForSequence></p>
<p name="q" extend="$p" />
<p><math name="o">$q.r[2] + $c</math></p>
<mathInput name="mi" bindValueTo="$o" />
<mathInput name="mi2" bindValueTo="$q.r[3]" />
<p name="pc">$c</p>
`,
            names: ["p", "q", "pc"],
            afterLoad: async (core, resolvePathToNodeIdx) => {
                await updateMathInputValue({
                    latex: "20",
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
                await updateMathInputValue({
                    latex: "30",
                    componentIdx: await resolvePathToNodeIdx("mi2"),
                    core,
                });
            },
        });
    });

    it("an unrelated reference through a path to another component of the template's name leaves it a list", async () => {
        await compare({
            doenetML: `
<group name="g"><math name="m">y</math></group>
<p name="q">$g.m</p>
<p name="p"><repeatForSequence name="r" from="1" to="2" valueName="v"><math name="m">$v</math></repeatForSequence></p>
<p name="p2">$r[2].m</p>
`,
            names: ["p", "q", "p2"],
        });
    });

    it("values plotted from a repeat, or read in a graph, leave it a list", async () => {
        await compare({
            doenetML: `
<section name="sec"><title>Squares</title>
<p name="p"><repeatForSequence name="r" from="1" to="3" valueName="v"><number>$v^2</number></repeatForSequence></p>
</section>
<graph name="g">
  <point name="P">($r[2], 1)</point>
  <label>$sec.title</label>
</graph>
<p name="pP">$P</p>
`,
            names: ["p", "pP"],
        });
    });

    it("a math under fixLocation takes a write, as each iteration's math does", async () => {
        // `fixLocation` keeps a math where it is drawn, not at its value
        const texts = await compare({
            doenetML: `
<numberList name="l">1 2 3</numberList>
<group fixLocation>
  <p name="p"><repeatForSequence name="r" from="1" to="3" indexName="i"><math>$l[$i]</math></repeatForSequence></p>
  <p name="p2"><repeatForSequence name="r2" from="1" to="3"><math>x</math></repeatForSequence></p>
  <p name="p3"><repeatForSequence name="r3" from="1" to="3"><number>7</number></repeatForSequence></p>
</group>
<mathInput name="mi" bindValueTo="$r[1]" />
<mathInput name="mi2" bindValueTo="$r2[1]" />
<mathInput name="mi3" bindValueTo="$r3[1]" />
<p name="pl">$l</p>
`,
            names: ["p", "p2", "p3", "pl"],
            afterLoad: async (core, resolvePathToNodeIdx) => {
                for (const name of ["mi", "mi2", "mi3"]) {
                    await updateMathInputValue({
                        latex: "9",
                        componentIdx: await resolvePathToNodeIdx(name),
                        core,
                    });
                }
            },
        });
        expect(texts).toMatchObject({
            p: "9, 2, 3",
            p2: "9, x, x",
            pl: "9, 2, 3",
        });
    });

    it("what decides a write may read the list's own values", async () => {
        await compare({
            doenetML: `
<numberList name="l" fixed="$r3[1]=1">1 2 3</numberList>
<math name="c" fixed="$r2[1]=6">5</math>
<p name="p" fixLocation="$r[1]=1"><repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence></p>
<p name="p2"><repeatForSequence name="r2" from="1" to="2" valueName="v"><math>$v + $c</math></repeatForSequence></p>
<p name="p3"><repeatForSequence name="r3" from="1" to="3" indexName="i"><number>$l[$i]</number></repeatForSequence></p>
`,
            names: ["p", "p2", "p3"],
        });
    });

    it("a template that reads no value repeats over letters or any list", async () => {
        const texts = await compare({
            doenetML: `
<textList name="tl">a b c</textList>
<p name="p"><repeatForSequence name="r" type="letters" length="3"><number>7</number></repeatForSequence></p>
<p name="p2"><repeat name="r2" for="$tl" indexName="i"><number>$i^2</number></repeat></p>
`,
            names: ["p", "p2"],
        });
        expect(texts).toEqual({ p: "7, 7, 7", p2: "1, 4, 9" });
    });

    it("a list read with modifyIndirectly false takes no write, so the other value does", async () => {
        const texts = await compare({
            doenetML: `
<numberList name="l" modifyIndirectly="false">1 2 3</numberList>
<number name="c">5</number>
<p name="p"><repeatForSequence name="r" from="1" to="3" indexName="i"><number>$l[$i] + $c</number></repeatForSequence></p>
<mathInput name="mi" bindValueTo="$r[2]" />
<p name="pl">$l</p>
<p name="pc">$c</p>
`,
            names: ["p", "pl", "pc"],
            afterLoad: async (core, resolvePathToNodeIdx) => {
                await updateMathInputValue({
                    latex: "20",
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
            },
        });
        expect(texts).toEqual({ p: "19, 20, 21", pl: "1, 2, 3", pc: "18" });
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

    it("a value written to the text of the template is that entry's text", async () => {
        const texts = await compare({
            doenetML: `
<mathInput name="from" prefill="1" />
<p name="p"><repeatForSequence name="r" from="$from" to="3" valueName="v"><math>($v, 0)</math></repeatForSequence></p>
<mathInput name="mi" bindValueTo="$r[2]" />
`,
            names: ["p"],
            afterLoad: async (core, resolvePathToNodeIdx) => {
                await updateMathInputValue({
                    latex: "(2,5)",
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
                await updateMathInputValue({
                    latex: "0",
                    componentIdx: await resolvePathToNodeIdx("from"),
                    core,
                });
            },
        });
        expect(texts.p).toBe("(0, 0), (1, 5), (2, 0), (3, 0)");
    });

    it("a nested math takes a value by changing its text", async () => {
        const doenetML = `
<mathInput name="n" prefill="3" />
<p name="p"><repeatForSequence name="r" from="2" to="$n" valueName="v"><math>$v <math>x</math></math></repeatForSequence></p>
<mathInput name="mi1" bindValueTo="$r[1]" />
<mathInput name="mi2" bindValueTo="$r[2]" />
`;
        const texts = await compare({
            doenetML,
            names: ["p"],
            afterLoad: async (core, resolvePathToNodeIdx) => {
                await updateMathInputValue({
                    latex: "2y",
                    componentIdx: await resolvePathToNodeIdx("mi1"),
                    core,
                });
                await updateMathInputValue({
                    latex: "3z",
                    componentIdx: await resolvePathToNodeIdx("mi2"),
                    core,
                });
            },
        });
        expect(texts.p).toBe("2 y, 3 z");
    });

    it("an empty template takes a value written to an entry", async () => {
        const texts = await compare({
            doenetML: `
<p name="p"><repeatForSequence name="r" from="1" to="3"><math></math></repeatForSequence></p>
<mathInput name="mi" bindValueTo="$r[2]" />
<p name="pn"><repeatForSequence name="rn" from="1" to="3"><number></number></repeatForSequence></p>
<mathInput name="mi2" bindValueTo="$rn[2]" />
<p name="p2"><repeatForSequence name="r2" from="1" to="3" valueName="v"><math>$v + <math></math></math></repeatForSequence></p>
<mathInput name="mi3" bindValueTo="$r2[3]" />
`,
            names: ["p", "pn", "p2"],
            afterLoad: async (core, resolvePathToNodeIdx) => {
                for (const [name, latex] of [
                    ["mi", "q"],
                    ["mi2", "4"],
                    ["mi3", "3+z"],
                ]) {
                    await updateMathInputValue({
                        latex,
                        componentIdx: await resolvePathToNodeIdx(name),
                        core,
                    });
                }
            },
        });
        expect(texts).toEqual({
            p: "＿, q, ＿",
            pn: "NaN, 4, NaN",
            p2: "1 + ＿, 2 + ＿, 3 + z",
        });
    });

    it("text written to an entry is kept while the repeat is shorter", async () => {
        const texts = await compare({
            doenetML: `
<mathInput name="n" prefill="3" />
<p name="p"><repeatForSequence name="r" from="1" to="$n" valueName="v"><math>($v, 0)</math></repeatForSequence></p>
<mathInput name="mi" bindValueTo="$r[3]" />
<p name="p2"><repeatForSequence name="r2" from="1" to="$n"><number>7</number></repeatForSequence></p>
<mathInput name="mi2" bindValueTo="$r2[3]" />
`,
            names: ["p", "p2"],
            afterLoad: async (core, resolvePathToNodeIdx) => {
                await updateMathInputValue({
                    latex: "(3,8)",
                    componentIdx: await resolvePathToNodeIdx("mi"),
                    core,
                });
                await updateMathInputValue({
                    latex: "4",
                    componentIdx: await resolvePathToNodeIdx("mi2"),
                    core,
                });
                const n = await resolvePathToNodeIdx("n");
                await updateMathInputValue({
                    latex: "1",
                    componentIdx: n,
                    core,
                });
                await updateMathInputValue({
                    latex: "4",
                    componentIdx: n,
                    core,
                });
            },
        });
        expect(texts).toEqual({
            p: "(1, 0), (2, 0), (3, 8), (4, 0)",
            p2: "7, 7, 4, 7",
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
            // copied into a graph, through a group around it, or referenced
            // there
            `<group name="g"><repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence></group><graph><group extend="$g" /></graph>`,
            `<group name="g"><repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence></group><group extend="$g" name="g2" /><graph>$g2</graph>`,
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence><graph>$r</graph>`,
            `<group name="g"><repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence></group><graph extend="$g" />`,
            // a copy of what holds it, named through a path
            `<p name="p"><repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence></p><p name="q" extend="$p" /><graph>$q.r</graph>`,
            `<section name="sec"><p name="p"><repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence></p></section><section name="s2" extend="$sec"><graph>$s2.p</graph></section>`,
            `<repeatForSequence name="outer" from="1" to="2"><group name="gg"><repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence></group></repeatForSequence><graph>$outer[1].gg</graph>`,
            // a whole child of what holds it, named by an index
            `<repeatForSequence name="outer" from="1" to="2"><group name="gg"><repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence></group></repeatForSequence><graph>$outer[1]</graph>`,
            `<group name="gg"><group><repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence></group></group><group name="q" extend="$gg" /><graph>$q[1]</graph>`,
            // ...including through a container of the repeat's own name
            `<group name="r2"><group name="r"><repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence></group></group><group name="q" extend="$r2" /><graph>$q.r[1]</graph>`,
            // copied
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence><math copy="$r[1]" />`,
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence><repeatForSequence copy="$r" />`,
            // named by a trigger
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence><updateValue triggerWhenObjectsClicked="$r[1]" target="$x" newValue="2" /><number name="x">1</number>`,
            // a nested component named
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><math><math name="inner">$v</math>+1</math></repeatForSequence>`,
            // the template's name reached through an outer repeat
            `<repeatForSequence name="a" from="1" to="2"><p><repeatForSequence name="r" from="1" to="2" valueName="v"><math name="m">$v</math></repeatForSequence></p></repeatForSequence><p>$a[2].r[1].m</p>`,
            // the template's name read after an index into the iteration,
            // which names nothing there
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><math name="m">$v</math></repeatForSequence><p>$r[1][1].m</p>`,
            // the value read past its first part
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math></repeatForSequence><p>$r[1].v</p>`,
            // an index computed
            `<numberList name="l">1 2 3</numberList><repeatForSequence name="r" from="1" to="2" indexName="i"><math>$l[$i+1]</math></repeatForSequence>`,
            // a nested boolean attribute other than true or false, which a
            // <boolean> evaluates
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><math><math expand="1">($v x+1)^2</math></math></repeatForSequence>`,
            // a text or boolean read alone by a <number>, which reads it its
            // own way
            `<text name="t">5</text><repeatForSequence name="r" from="1" to="2" valueName="v"><number>$t</number></repeatForSequence>`,
            `<boolean name="b">true</boolean><repeatForSequence name="r" from="1" to="2" valueName="v"><number>$b</number></repeatForSequence>`,
            // a math operator other than <abs>, <round> or <evaluate>
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><math><floor>$v</floor></math></repeatForSequence>`,
            // what a <round> rounds to written as other than an integer,
            // which a <number> evaluates
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><round numDecimals="1+1">$v/3</round></repeatForSequence>`,
            `<number name="n">2</number><repeatForSequence name="r" from="1" to="2" valueName="v"><round numDecimals="$n">$v/3</round></repeatForSequence>`,
            // forceSymbolic other than true or false
            `<function name="f" variables="t">t^2</function><repeatForSequence name="r" from="1" to="2" valueName="v"><evaluate function="$f" input="$v" forceSymbolic="1" /></repeatForSequence>`,
            // a function that reads the index, is not one reference to a
            // function, or is a value other than a function
            `<function name="f" variables="t">t^2</function><function name="g" variables="t">t^3</function><group name="fs">$f $g</group><repeatForSequence name="r" from="1" to="2" indexName="i"><math>$$fs[$i](2)</math></repeatForSequence>`,
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><evaluate function="$v x" input="2" /></repeatForSequence>`,
            `<math name="m">t^2</math><repeatForSequence name="r" from="1" to="2" valueName="v"><evaluate function="$m" input="$v" /></repeatForSequence>`,
            // inputs written as text, which a <mathList> splits
            `<function name="f" variables="t">t^2</function><repeatForSequence name="r" from="1" to="2" valueName="v"><evaluate function="$f" input="2" /></repeatForSequence>`,
            // another attribute of <evaluate>
            `<function name="f" variables="t">t^2</function><repeatForSequence name="r" from="1" to="2" valueName="v"><evaluate function="$f" input="$v" unordered /></repeatForSequence>`,
            // a named <evaluate> nested in the template
            `<function name="f" variables="t">t^2</function><repeatForSequence name="r" from="1" to="2" valueName="v"><math><evaluate name="e" function="$f" input="$v" />+1</math></repeatForSequence>`,
            // more than one component
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v</math><math>$v</math></repeatForSequence>`,
            // a repeat over something that is not one list
            `<repeat name="r" for="1 2" valueName="v"><math>$v</math></repeat>`,
            // a sampler
            `<repeatForSequence name="r" from="1" to="2" valueName="v"><math>$v + <selectFromSequence from="1" to="5"/></math></repeatForSequence>`,
        ]) {
            const { core } = await createTestCore({ doenetML });
            expect(
                Object.values(core.core!._components).some(
                    (component: any) =>
                        component?.componentType === "_repeatValueList",
                ),
                doenetML,
            ).toBe(false);
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

    it("text written to an entry past the end is kept through a reload", async () => {
        const doenetML = `
<mathInput name="n" prefill="3" />
<p name="p"><repeatForSequence name="r" from="1" to="$n" valueName="v"><math>($v, 0)</math></repeatForSequence></p>
<mathInput name="mi" bindValueTo="$r[3]" />
<p name="p2"><repeatForSequence name="r2" from="1" to="$n"><number>7</number></repeatForSequence></p>
<mathInput name="mi2" bindValueTo="$r2[3]" />
`;
        const results: Record<string, string>[] = [];
        for (const asList of [true, false]) {
            const { core, resolvePathToNodeIdx, scoreState } = await load(
                doenetML,
                asList,
            );
            await updateMathInputValue({
                latex: "(3,8)",
                componentIdx: await resolvePathToNodeIdx("mi"),
                core,
            });
            await updateMathInputValue({
                latex: "4",
                componentIdx: await resolvePathToNodeIdx("mi2"),
                core,
            });
            await updateMathInputValue({
                latex: "2",
                componentIdx: await resolvePathToNodeIdx("n"),
                core,
            });
            await core.core!.saveImmediately();

            // reloaded with two entries, then grown to four
            setRepeatListsEnabled(asList);
            const reloaded = await createTestCore({
                doenetML,
                initialState: scoreState.state,
            });
            setRepeatListsEnabled(true);
            await updateMathInputValue({
                latex: "4",
                componentIdx: await reloaded.resolvePathToNodeIdx("n"),
                core: reloaded.core,
            });
            results.push(
                await textsOf(reloaded.core, reloaded.resolvePathToNodeIdx, [
                    "p",
                    "p2",
                ]),
            );
        }
        expect(results[0]).toEqual(results[1]);
        expect(results[0]).toEqual({
            p: "(1, 0), (2, 0), (3, 8), (4, 0)",
            p2: "7, 7, 4, 7",
        });
    });
    describe("math operators", () => {
        it("a Riemann sum's terms, of functions evaluated at the index", async () => {
            const texts = await compare({
                doenetML: `
<function name="p" variables="t" symbolic="false"><math simplify="numbersPreserveOrder">4 - 2 t^2</math></function>
<math name="deltat" simplify="numbers">(2 - -1)/4</math>
<function name="ldeltat" variables="l">-1 + $deltat l</function>
<number name="side">1</number>
<mathList name="terms">
  <repeatForSequence name="r" length="4" indexName="i"><math simplify="numbers">$$p($$ldeltat($i-1+$side))*$deltat</math></repeatForSequence>
</mathList>
<p name="pterms">$terms</p>
<p name="p2">$r[2]</p>
<p name="psum"><sum>$terms</sum></p>
<p name="pt"><repeatForSequence name="rt" length="4" indexName="i"><math simplify='full'>$$ldeltat($i-1+$side)</math></repeatForSequence></p>
<p name="pe"><repeatForSequence name="re" length="4" indexName="i"><evaluate forceSymbolic function="$ldeltat" input="$i-1+$side" simplify="numbers" /></repeatForSequence></p>
`,
                names: ["pterms", "p2", "psum", "pt", "pe"],
                afterLoad: async (core, resolvePathToNodeIdx) => {
                    for (const name of ["rt", "re"]) {
                        expect(
                            await typeOf(core, resolvePathToNodeIdx, name),
                        ).toBe(
                            core.core!._components[
                                await resolvePathToNodeIdx("r")
                            ].componentType,
                        );
                    }
                },
            });
            expect(texts).toEqual({
                pterms: "2.91, 2.63, 0.656, -3",
                p2: "2.63",
                psum: "3.19",
                pt: "-1/4, 1/2, 5/4, 2",
                pe: "-1/4, 1/2, 5/4, 2",
            });
        });

        it("the absolute value of each entry of a list, and its maximum", async () => {
            const texts = await compare({
                doenetML: `
<mathList name="terms">2.91 -2.63 0.656 -3 x-1</mathList>
<p name="p"><max name="mx"><repeat name="r" for="$terms" valueName="v"><abs>$v</abs></repeat></max></p>
<p name="p2">$r</p>
`,
                names: ["p", "p2"],
            });
            expect(texts).toEqual({
                p: "max(2.91, 2.63, 0.656, 3, |x - 1|)",
                p2: "2.91, 2.63, 0.656, 3, |x - 1|",
            });
        });

        it("a round shows the digits it rounds to, unless it says otherwise", async () => {
            const texts = await compare({
                doenetML: `
<numberList name="l">1 2 -3</numberList>
<p name="p"><repeat name="r" for="$l" valueName="v"><round numDecimals="10">$v/7</round></repeat></p>
<p name="p2"><repeat name="r2" for="$l" valueName="v"><round numDecimals="10" displayDigits="3">$v/7</round></repeat></p>
<p name="p3"><repeat name="r3" for="$l" valueName="v"><round numDigits="4" displayDecimals="2">$v/7</round></repeat></p>
<p name="p4"><repeat name="r4" for="$l" valueName="v"><round>$v/2</round></repeat></p>
<p name="p5"><repeat name="r5" for="$l" valueName="v"><math><round numDecimals="1">$v/7</round> x</math></repeat></p>
`,
                names: ["p", "p2", "p3", "p4", "p5"],
            });
            expect(texts).toEqual({
                p: "0.1428571429, 0.2857142857, -0.4285714286",
                p2: "0.143, 0.286, -0.429",
                p3: "0.14, 0.29, -0.43",
                p4: "1, 1, -2",
                p5: "0.1 x, 0.3 x, -0.4 x",
            });
        });

        it("a function evaluated symbolically or numerically, as the function and the evaluate say", async () => {
            const texts = await compare({
                doenetML: `
<function name="fs" variables="t">t^2 + a</function>
<function name="fn" variables="t" symbolic="false">t^2 + 1</function>
<function name="g" variables="s t">s t</function>
<mathList name="l">1 -2 3</mathList>
<p name="p1"><repeat name="r" for="$l" valueName="v"><math>$$fs($v)</math></repeat></p>
<p name="p2"><repeat name="r2" for="$l" valueName="v"><evaluate function="$fs" input="$v" forceNumeric /></repeat></p>
<p name="p3"><repeat name="r3" for="$l" valueName="v"><evaluate function="$fn" input="$v" /></repeat></p>
<p name="p4"><repeat name="r4" for="$l" valueName="v"><evaluate function="$fn" input="$v*x^2" forceSymbolic /></repeat></p>
<p name="p5"><repeat name="r5" for="$l" valueName="v"><math simplify>$$g($v, 2) + $$g(1, $v)</math></repeat></p>
<p name="p6"><repeat name="r6" for="$l" valueName="v"><math>$$g($v)</math></repeat></p>
`,
                names: ["p1", "p2", "p3", "p4", "p5", "p6"],
            });
            expect(texts).toEqual({
                p1: "a + 1, a + 4, a + 9",
                p2: "NaN, NaN, NaN",
                p3: "2, 5, 10",
                p4: "x⁴ + 1, 4 x⁴ + 1, 9 x⁴ + 1",
                p5: "3, -6, 9",
                p6: "＿, ＿, ＿",
            });
        });

        it("a function changed after load changes every entry", async () => {
            const texts = await compare({
                doenetML: `
<mathInput name="mi" prefill="t^2" />
<function name="f" variables="t">$mi</function>
<mathList name="l">1 2 3</mathList>
<p name="p"><repeat name="r" for="$l" valueName="v"><math>$$f($v) + <abs>$v - 2</abs></math></repeat></p>
`,
                names: ["p"],
                afterLoad: async (core, resolvePathToNodeIdx) => {
                    await updateMathInputValue({
                        latex: "3t",
                        componentIdx: await resolvePathToNodeIdx("mi"),
                        core,
                    });
                },
            });
            expect(texts.p).toBe("3 + 1, 6 + 0, 9 + 1");
        });

        it("a write goes through the operator's inverse, and an evaluate takes none", async () => {
            const texts = await compare({
                doenetML: `
<mathList name="l">1 -2 3</mathList>
<function name="f" variables="t">t^2</function>
<math name="c">5</math>
<p name="p"><repeat name="r" for="$l" valueName="v"><abs>$v</abs></repeat></p>
<mathInput name="mi" bindValueTo="$r[2]" />
<mathInput name="mi2" bindValueTo="$r[3]" />
<p name="pr"><repeat name="rr" for="$l" valueName="v"><round>$v</round></repeat></p>
<mathInput name="mi3" bindValueTo="$rr[1]" />
<p name="pe"><repeat name="re" for="$l" valueName="v"><math>$$f($v) + $c</math></repeat></p>
<mathInput name="mi4" bindValueTo="$re[1]" />
<p name="pl">$l</p>
<p name="pc">$c</p>
`,
                names: ["p", "pr", "pe", "pl", "pc"],
                afterLoad: async (core, resolvePathToNodeIdx) => {
                    for (const [name, latex] of [
                        ["mi", "7"],
                        ["mi2", "-4"],
                        ["mi3", "2.4"],
                        ["mi4", "20"],
                    ]) {
                        await updateMathInputValue({
                            latex,
                            componentIdx: await resolvePathToNodeIdx(name),
                            core,
                        });
                    }
                },
            });
            expect(texts).toEqual({
                p: "2.4, 7, 0",
                pr: "2, 7, 0",
                pe: "5.76 + 14.24, 49 + 14.24, 0 + 14.24",
                pl: "2.4, 7, 0",
                pc: "14.24",
            });
        });

        it("a template of text alone takes a value by changing its text", async () => {
            await compare({
                doenetML: `
<p name="p"><repeatForSequence name="r" from="1" to="3"><abs>-2</abs></repeatForSequence></p>
<mathInput name="mi" bindValueTo="$r[2]" />
<p name="p2"><repeatForSequence name="r2" from="1" to="3"><round numDecimals="1">1.23</round></repeatForSequence></p>
<mathInput name="mi2" bindValueTo="$r2[3]" />
`,
                names: ["p", "p2"],
                afterLoad: async (core, resolvePathToNodeIdx) => {
                    await updateMathInputValue({
                        latex: "-5",
                        componentIdx: await resolvePathToNodeIdx("mi"),
                        core,
                    });
                    await updateMathInputValue({
                        latex: "4.56",
                        componentIdx: await resolvePathToNodeIdx("mi2"),
                        core,
                    });
                },
            });
        });
    });
});
