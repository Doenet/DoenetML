import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { censusOfCore } from "../perf/census";
import {
    submitAnswer,
    updateMathInputValue,
    updateValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

// What a repeat iteration's `valueName` and `indexName` read as, wherever the
// template uses them, and as the repeat changes. Part of Doenet/DoenetML#2128
// (the iteration scaffold): these hold whether an iteration names its value
// and index with components of their own or reads them from the repeat.
describe("Repeat iteration values and indices @group3", async () => {
    async function textOf(
        core: any,
        resolvePathToNodeIdx: (path: string) => Promise<number>,
        path: string,
    ) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        return stateVariables[await resolvePathToNodeIdx(path)].stateValues
            .text;
    }

    it("value and index in each kind of position", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <numberList name="l">10 20 30</numberList>
    <repeatForSequence from="5" to="7" valueName="v" indexName="i" name="r">
      <number name="n">$v^2</number>
      <math name="m">$v x + $i</math>
      <text name="t">$v and $i</text>
      <number name="e">$l[$i]</number>
      <number name="e2">$l[$i-1+1]</number>
      <number name="dd" displayDigits="$i">pi</number>
      <p name="p">$v, $i</p>
      <boolean name="b">$i = $v - 4</boolean>
    </repeatForSequence>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        for (let k = 1; k <= 3; k++) {
            const v = k + 4;
            const sv = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(`r[${k}].${name}`)]
                    .stateValues;
            expect((await sv("n")).value).eq(v ** 2);
            expect((await sv("m")).text).eq(`${v} x + ${k}`);
            expect((await sv("t")).value).eq(`${v} and ${k}`);
            expect((await sv("e")).value).eq(10 * k);
            expect((await sv("e2")).value).eq(10 * k);
            expect((await sv("dd")).text).eq(
                Number(Math.PI.toPrecision(k)).toString(),
            );
            expect((await sv("p")).text).eq(`${v}, ${k}`);
            expect((await sv("b")).value).eq(true);
        }
    });

    it("math and letters values", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <repeatForSequence type="math" from="x" step="y" length="2" valueName="v" name="rm">
      <math name="m">2$v</math>
      <p name="p">$v</p>
    </repeatForSequence>
    <repeatForSequence type="letters" from="c" to="d" valueName="v" indexName="i" name="rl">
      <text name="t">$v$i</text>
      <p name="p">$v</p>
    </repeatForSequence>
    `,
        });
        expect(await textOf(core, resolvePathToNodeIdx, "rm[1].m")).eq("2 x");
        expect(await textOf(core, resolvePathToNodeIdx, "rm[2].m")).eq(
            "2 (x + y)",
        );
        expect(await textOf(core, resolvePathToNodeIdx, "rm[2].p")).eq("x + y");
        expect(await textOf(core, resolvePathToNodeIdx, "rl[1].t")).eq("c1");
        expect(await textOf(core, resolvePathToNodeIdx, "rl[2].t")).eq("d2");
        expect(await textOf(core, resolvePathToNodeIdx, "rl[2].p")).eq("d");
    });

    it("values follow from and step, and survive the length shrinking and growing", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="fromIn" prefill="1" />
    <mathInput name="stepIn" prefill="1" />
    <mathInput name="lengthIn" prefill="3" />
    <p name="p"><repeatForSequence from="$fromIn" step="$stepIn" length="$lengthIn" valueName="v" indexName="i" name="r">
      <math simplify>$i:$v^2</math>
    </repeatForSequence></p>
    `,
        });
        const text = () => textOf(core, resolvePathToNodeIdx, "p");
        expect(await text()).eq("1 : 1, 2 : 4, 3 : 9");

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("fromIn"),
            core,
        });
        expect(await text()).eq("1 : 4, 2 : 9, 3 : 16");

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("stepIn"),
            core,
        });
        expect(await text()).eq("1 : 4, 2 : 25, 3 : 64");

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("lengthIn"),
            core,
        });
        expect(await text()).eq("1 : 4");

        await updateMathInputValue({
            latex: "0",
            componentIdx: await resolvePathToNodeIdx("fromIn"),
            core,
        });
        expect(await text()).eq("1 : 0");

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("lengthIn"),
            core,
        });
        expect(await text()).eq("1 : 0, 2 : 9, 3 : 36, 4 : 81");
    });

    it("index of a repeat over a list, and over a list that changes", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="mi" prefill="3" />
    <sequence name="l" type="letters" length="$mi" hide />
    <p name="p"><repeat for="$l" valueName="v" indexName="i" name="r">
      <text>$i$v</text>
    </repeat></p>
    <p name="p2"><repeat for="1 2 3" indexName="j" name="r2">
      <number>10$j</number>
    </repeat></p>
    `,
        });
        const text = () => textOf(core, resolvePathToNodeIdx, "p");
        expect(await text()).eq("1a, 2b, 3c");
        expect(await textOf(core, resolvePathToNodeIdx, "p2")).eq("10, 20, 30");

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        expect(await text()).eq("1a");

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });
        expect(await text()).eq("1a, 2b, 3c, 4d");
    });

    it("value and index named from outside the repeat", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <repeatForSequence from="5" to="7" valueName="v" indexName="i" name="r">
      <number>$v+$i</number>
    </repeatForSequence>
    <number name="v2">$r[2].v</number>
    <number name="i3">$r[3].i</number>
    <number name="v2e" extend="$r[2].v" />
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const value = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues.value;
        expect(await value("v2")).eq(6);
        expect(await value("i3")).eq(3);
        expect(await value("v2e")).eq(6);
    });

    it("value and index named through a component that extends an iteration", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="k" prefill="2" />
    <repeatForSequence from="5" to="7" valueName="v" indexName="i" name="r">
      <number>$v+$i</number>
    </repeatForSequence>
    <group extend="$r[3]" name="g" />
    <setup><group extend="$r[$k]" name="h" /></setup>
    <repeat for="a b c" valueName="w" indexName="j" name="s">
      <text>$w$j</text>
    </repeat>
    <group extend="$s[2]" name="gs" />
    <p name="p">$g.v $g.i, $h.v $h.i, $gs.w $gs.j</p>
    `,
        });
        const text = () => textOf(core, resolvePathToNodeIdx, "p");
        expect(await text()).eq("7 3, 6 2, b 2");

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("k"),
            core,
        });
        expect(await text()).eq("7 3, 5 1, b 2");
    });

    it("an extend of the value or index in the template", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <repeatForSequence from="5" to="6" valueName="v" indexName="i" name="r">
      <number name="ve" extend="$v" />
      <integer name="ie" extend="$i" />
      <number name="n">$v$i</number>
    </repeatForSequence>
    `,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const sv = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)];
        expect((await sv("r[2].ve")).stateValues.value).eq(6);
        expect((await sv("r[2].ie")).stateValues.value).eq(2);
        expect((await sv("r[2].ie")).componentType).eq("integer");
        expect((await sv("r[2].n")).stateValues.value).eq(12);
    });

    it("extend and copy of a repeat", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <mathInput name="toIn" prefill="3" />
    <p name="p"><repeatForSequence from="1" to="$toIn" valueName="v" indexName="i" name="r">
      <math simplify>$i$v</math>
    </repeatForSequence></p>
    <p name="pe"><repeatForSequence extend="$r" name="re" /></p>
    <p name="pc"><repeatForSequence copy="$r" name="rc" /></p>
    <p name="pg">$r</p>
    `,
        });
        const text = (name: string) => textOf(core, resolvePathToNodeIdx, name);
        for (const name of ["p", "pe", "pc", "pg"]) {
            expect(await text(name)).eq("1, 4, 9");
        }

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("toIn"),
            core,
        });
        expect(await text("p")).eq("1, 4, 9, 16");
        expect(await text("pe")).eq("1, 4, 9, 16");
        // the copy keeps the reference to the input in its `to`
        expect(await text("pc")).eq("1, 4, 9, 16");
        expect(await text("pg")).eq("1, 4, 9, 16");
    });

    it("a repeat over another repeat's iterations reads their values", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <repeatForSequence from="2" to="3" valueName="v" indexName="i" name="items">
      <math>$v+$i</math>
    </repeatForSequence>
    <p name="p"><repeat for="$items" valueName="w" indexName="j">$j: $w</repeat></p>
    `,
        });
        expect(await textOf(core, resolvePathToNodeIdx, "p")).eq(
            "1: 2 + 1, 2: 3 + 2",
        );
    });

    it("nested repeats read their own values and indices", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p"><repeatForSequence from="1" to="2" valueName="a" indexName="i">
      <repeatForSequence from="$a" to="$a+1" valueName="b" indexName="j">
        <number>100$i+10$j+$b</number>
      </repeatForSequence>
    </repeatForSequence></p>
    `,
        });
        expect(await textOf(core, resolvePathToNodeIdx, "p")).eq(
            "111, 122, 212, 223",
        );
    });

    it("the value and index cannot be written through a reference", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <repeatForSequence from="5" to="6" valueName="v" indexName="i" name="r">
      <mathInput name="mv" bindValueTo="$v" />
      <mathInput name="mi" bindValueTo="$i" />
      <updateValue name="uv" target="$v" newValue="100" type="number" />
    </repeatForSequence>
    `,
        });
        await updateMathInputValue({
            latex: "9",
            componentIdx: await resolvePathToNodeIdx("r[1].mv"),
            core,
        });
        await updateMathInputValue({
            latex: "9",
            componentIdx: await resolvePathToNodeIdx("r[1].mi"),
            core,
        });
        await updateValue({
            componentIdx: await resolvePathToNodeIdx("r[2].uv"),
            core,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const value = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues.value
                .tree;
        expect(await value("r[1].mv")).eq(5);
        expect(await value("r[1].mi")).eq(1);
        expect(await value("r[2].mv")).eq(6);
    });

    it("answers in iterations, kept through a shrink and regrow of the repeat", async () => {
        const doenetML = `
    <mathInput name="lengthIn" prefill="2" />
    <repeatForSequence from="3" length="$lengthIn" valueName="v" indexName="i" name="r">
      <answer name="ans"><mathInput name="mi" /><award>$v + $i</award></answer>
    </repeatForSequence>
    `;
        let { core, resolvePathToNodeIdx, scoreState } = await createTestCore({
            doenetML,
        });
        for (let k = 1; k <= 2; k++) {
            await updateMathInputValue({
                latex: `${k + 2 + k}`,
                componentIdx: await resolvePathToNodeIdx(`r[${k}].mi`),
                core,
            });
            await submitAnswer({
                componentIdx: await resolvePathToNodeIdx(`r[${k}].ans`),
                core,
            });
        }
        const check = async () => {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (let k = 1; k <= 2; k++) {
                const ans =
                    stateVariables[await resolvePathToNodeIdx(`r[${k}].ans`)]
                        .stateValues;
                expect(ans.creditAchieved).eq(1);
                expect(ans.justSubmitted).eq(true);
            }
        };
        await check();
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("lengthIn"),
            core,
        });
        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("lengthIn"),
            core,
        });

        await check();

        // reload with the saved state
        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            initialState: scoreState.state,
        }));
        await check();
    });
});

// What a repeat makes for its `valueName` and `indexName`: one list for the
// whole repeat when every reference to the name reads it as an entry,
// nothing when nothing reads it, and a component in each iteration (with a
// `<setup>` holding it) otherwise. Unlike the tests above, these pin the
// iteration scaffold itself and do not hold on a build without it.
describe("Repeat iteration values and indices, what is made @group3", async () => {
    async function made(doenetML: string) {
        const { core } = await createTestCore({ doenetML });
        const { byType } = censusOfCore(core);
        return {
            values: byType._repeatValues ?? 0,
            indices: byType._repeatIndices ?? 0,
            // each iteration's components for the names, if any
            setups: byType.setup ?? 0,
        };
    }

    it("lists for the values of every type and for the index", async () => {
        for (const [type, from, child] of [
            ["number", "1", "number"],
            ["math", "x", "math"],
            ["letters", "c", "text"],
        ]) {
            expect(
                await made(`
    <repeatForSequence type="${type}" from="${from}" length="3" valueName="v" indexName="i">
      <${child}>$v</${child}><p>$i</p>
    </repeatForSequence>
    `),
                type,
            ).eqls({ values: 1, indices: 1, setups: 0 });
        }
    });

    it("a repeat's index is a list, its value a component of each iteration", async () => {
        expect(
            await made(`
    <repeat for="a b c" valueName="w" indexName="j">
      <text>$w$j</text>
    </repeat>
    `),
        ).eqls({ values: 0, indices: 1, setups: 3 });
    });

    it("a name nothing reads makes nothing", async () => {
        expect(
            await made(`
    <mathInput name="n" prefill="3" />
    <repeatForSequence from="1" to="$n" valueName="v" indexName="i">
      <number>$v</number>
    </repeatForSequence>
    `),
        ).eqls({ values: 1, indices: 0, setups: 0 });
    });

    it("a name used another way keeps a component in each iteration", async () => {
        // the value is read only as an entry; the index is not
        const cases = [
            `<integer extend="$i" />`,
            `<updateValue target="$i" newValue="5" />`,
        ];
        for (const usage of cases) {
            expect(
                await made(`
    <repeatForSequence from="1" to="3" valueName="v" indexName="i">
      <number>$v</number>${usage}
    </repeatForSequence>
    `),
                usage,
            ).eqls({ values: 1, indices: 0, setups: 3 });
        }
        for (const outside of [
            `<number>$r[2].i</number>`,
            `<group extend="$r[2]" name="g" /><number>$g.i</number>`,
        ]) {
            const counts = await made(`
    <repeatForSequence from="1" to="3" valueName="v" indexName="i" name="r">
      <number>$v</number><number>$i</number>
    </repeatForSequence>
    ${outside}
    `);
            expect(counts.values, outside).eq(1);
            expect(counts.indices, outside).eq(0);
            expect(counts.setups, outside).toBeGreaterThanOrEqual(3);
        }
    });
});
