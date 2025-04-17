import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Shuffle tag tests", async () => {
    it("consistent order for n elements for given variant", async () => {
        const doenetML = `
  <p>m: <mathInput prefill="1" name="m" /></p>
  <p>n: <mathInput prefill="6" name="n" /></p>
  <p name="pList"><shuffle name="sh">
    <sequence from="$m" to="$n" />
  </shuffle></p>
  <p name="pList2">$sh</p>
  `;

        let core = await createTestCore({
            doenetML,
            requestedVariantIndex: 1,
        });

        let texts = {};
        let orders = {};

        let m = 1,
            n = 6;

        let stateVariables = await core.returnAllStateVariables(false, true);
        let componentOrder = stateVariables["/sh"].stateValues.componentOrder;

        expect([...componentOrder].sort((a, b) => a - b)).eqls(
            [...Array(n - m + 1).keys()].map((x) => x + m),
        );

        orders[`${m},${n}`] = componentOrder;

        let pText = componentOrder.map((x) => x + m - 1).join(", ");
        expect(stateVariables["/pList"].stateValues.text).eq(pText);
        expect(stateVariables["/pList2"].stateValues.text).eq(pText);

        texts[`${m},${n}`] = pText;

        // switch n to 8
        n = 8;
        await updateMathInputValue({
            latex: n.toString(),
            name: "/n",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        componentOrder = stateVariables["/sh"].stateValues.componentOrder;

        expect([...componentOrder].sort((a, b) => a - b)).eqls(
            [...Array(n - m + 1).keys()].map((x) => x + m),
        );

        orders[`${m},${n}`] = componentOrder;

        pText = componentOrder.map((x) => x + m - 1).join(", ");
        expect(stateVariables["/pList"].stateValues.text).eq(pText);
        expect(stateVariables["/pList2"].stateValues.text).eq(pText);

        texts[`${m},${n}`] = pText;

        // get another list of length 6 by setting m to 3
        m = 3;
        await updateMathInputValue({
            latex: m.toString(),
            name: "/m",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        componentOrder = stateVariables["/sh"].stateValues.componentOrder;

        expect(componentOrder).eqls(orders[`${1},${6}`]);

        orders[`${m},${n}`] = componentOrder;

        pText = componentOrder.map((x) => x + m - 1).join(", ");
        expect(stateVariables["/pList"].stateValues.text).eq(pText);
        expect(stateVariables["/pList2"].stateValues.text).eq(pText);

        texts[`${m},${n}`] = pText;

        // get another list of length 8 by setting n to 10
        n = 10;
        await updateMathInputValue({
            latex: n.toString(),
            name: "/n",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        componentOrder = stateVariables["/sh"].stateValues.componentOrder;

        expect(componentOrder).eqls(orders[`${1},${8}`]);

        orders[`${m},${n}`] = componentOrder;

        pText = componentOrder.map((x) => x + m - 1).join(", ");
        expect(stateVariables["/pList"].stateValues.text).eq(pText);
        expect(stateVariables["/pList2"].stateValues.text).eq(pText);

        texts[`${m},${n}`] = pText;

        // values change with another variant

        core = await createTestCore({
            doenetML,
            requestedVariantIndex: 2,
        });

        m = 1;
        n = 6;

        stateVariables = await core.returnAllStateVariables(false, true);
        componentOrder = stateVariables["/sh"].stateValues.componentOrder;

        expect(componentOrder).not.eqls(orders[`${m},${n}`]);

        expect([...componentOrder].sort((a, b) => a - b)).eqls(
            [...Array(n - m + 1).keys()].map((x) => x + m),
        );

        orders[`${m},${n}`] = componentOrder;

        pText = componentOrder.map((x) => x + m - 1).join(", ");
        expect(stateVariables["/pList"].stateValues.text).eq(pText);
        expect(stateVariables["/pList2"].stateValues.text).eq(pText);

        texts[`${m},${n}`] = pText;

        // switch n to 8
        n = 8;
        await updateMathInputValue({
            latex: n.toString(),
            name: "/n",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        componentOrder = stateVariables["/sh"].stateValues.componentOrder;

        expect(componentOrder).not.eqls(orders[`${m},${n}`]);

        expect([...componentOrder].sort((a, b) => a - b)).eqls(
            [...Array(n - m + 1).keys()].map((x) => x + m),
        );

        orders[`${m},${n}`] = componentOrder;

        pText = componentOrder.map((x) => x + m - 1).join(", ");
        expect(stateVariables["/pList"].stateValues.text).eq(pText);
        expect(stateVariables["/pList2"].stateValues.text).eq(pText);

        texts[`${m},${n}`] = pText;

        // get another list of length 6 by setting m to 3
        m = 3;
        await updateMathInputValue({
            latex: m.toString(),
            name: "/m",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        componentOrder = stateVariables["/sh"].stateValues.componentOrder;

        expect(componentOrder).eqls(orders[`${1},${6}`]);

        orders[`${m},${n}`] = componentOrder;

        pText = componentOrder.map((x) => x + m - 1).join(", ");
        expect(stateVariables["/pList"].stateValues.text).eq(pText);
        expect(stateVariables["/pList2"].stateValues.text).eq(pText);

        texts[`${m},${n}`] = pText;

        // get another list of length 8 by setting n to 100
        n = 10;
        await updateMathInputValue({
            latex: n.toString(),
            name: "/n",
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        componentOrder = stateVariables["/sh"].stateValues.componentOrder;

        expect(componentOrder).eqls(orders[`${1},${8}`]);

        orders[`${m},${n}`] = componentOrder;

        pText = componentOrder.map((x) => x + m - 1).join(", ");
        expect(stateVariables["/pList"].stateValues.text).eq(pText);
        expect(stateVariables["/pList2"].stateValues.text).eq(pText);

        texts[`${m},${n}`] = pText;
    });

    async function test_shuffle({
        core,
        options,
        must_be_reordered,
        replacements_all_of_type,
    }: {
        core;
        options: string[];
        must_be_reordered: string[][];
        replacements_all_of_type?: string;
    }) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        const componentOrder: number[] =
            stateVariables["/sh"].stateValues.componentOrder;

        expect([...componentOrder].sort((a, b) => a - b)).eqls(
            [...Array(options.length).keys()].map((x) => x + 1),
        );

        const orderedOptions = componentOrder.map((x) => options[x - 1]);

        for (let reorder_list of must_be_reordered) {
            let indices = reorder_list.map((item) =>
                orderedOptions.indexOf(item),
            );
            expect(indices.every((v) => v !== -1)).eq(true);
            expect(indices.slice(1)).not.eqls(
                [...Array(indices.length - 1).keys()].map(
                    (x) => x + indices[0] + 1,
                ),
            );
        }

        const pText = orderedOptions.join(", ");
        expect(stateVariables["/pList"].stateValues.text).eq(pText);

        if (replacements_all_of_type) {
            let replacementTypes = stateVariables["/pList"].activeChildren.map(
                (child) => stateVariables[child.componentIdx].componentType,
            );

            expect(replacementTypes).eqls(
                Array(options.length).fill(replacements_all_of_type),
            );
        }

        return orderedOptions;
    }

    it("shuffle with math and mathLists", async () => {
        let core = await createTestCore({
            doenetML: `
  <p name="pList"><shuffle name="sh">
    <math>x</math>
    <math>y</math>
    <math>z</math>
    <mathList>a b c d</mathList>
    <math>q</math>
    <mathList>1 2 3 4</mathList>
  </shuffle></p>
  `,
        });

        let options = [
            "x",
            "y",
            "z",
            "a",
            "b",
            "c",
            "d",
            "q",
            "1",
            "2",
            "3",
            "4",
        ];

        await test_shuffle({
            core,
            options,
            must_be_reordered: [
                ["a", "b", "c", "d"],
                ["1", "2", "3", "4"],
            ],
            replacements_all_of_type: "math",
        });
    });

    it("shuffle with number and numberLists", async () => {
        let core = await createTestCore({
            doenetML: `
  <p name="pList"><shuffle name="sh">
    <number>10</number>
    <number>11</number>
    <number>12</number>
    <numberList>101 102 103 104 105</numberList>
    <number>-5</number>
    <numberList>1 2 3 4</numberList>
    <number>-99</number>
    </shuffle></p>
  `,
        });

        let options = [
            "10",
            "11",
            "12",
            "101",
            "102",
            "103",
            "104",
            "105",
            "-5",
            "1",
            "2",
            "3",
            "4",
            "-99",
        ];

        await test_shuffle({
            core,
            options,
            must_be_reordered: [
                ["1", "2", "3", "4"],
                ["101", "102", "103", "104"],
            ],
            replacements_all_of_type: "number",
        });
    });

    it("shuffle with text and textLists", async () => {
        let core = await createTestCore({
            doenetML: `
  <p name="pList"><shuffle name="sh">
    <text>apple</text>
    <text>banana</text>
    <text>orange</text>
    <textList>hello there now then too</textList>
    <text>almost</text>
    <textList>1 2 3 4</textList>
    <text>above</text>
    </shuffle></p>
  `,
        });

        let options = [
            "apple",
            "banana",
            "orange",
            "hello",
            "there",
            "now",
            "then",
            "too",
            "almost",
            "1",
            "2",
            "3",
            "4",
            "above",
        ];

        await test_shuffle({
            core,
            options,
            must_be_reordered: [
                ["1", "2", "3", "4"],
                ["hello", "there", "now", "then", "too"],
            ],
            replacements_all_of_type: "text",
        });
    });

    it("shuffle sugar type math", async () => {
        let core = await createTestCore({
            doenetML: `
  <p name="pList"><shuffle name="sh" type="math">
    a b c x y z
  </shuffle></p>
  `,
        });

        let options = ["a", "b", "c", "x", "y", "z"];

        await test_shuffle({
            core,
            options,
            must_be_reordered: [["a", "b", "c", "x"]],
            replacements_all_of_type: "math",
        });
    });

    it("shuffle sugar type number", async () => {
        let core = await createTestCore({
            doenetML: `
  <p name="pList"><shuffle name="sh" type="number">
    101 542 817 527 51 234 801
  </shuffle></p>
  `,
        });

        let options = ["101", "542", "817", "527", "51", "234", "801"];

        await test_shuffle({
            core,
            options,
            must_be_reordered: [["817", "527", "51", "234"]],
            replacements_all_of_type: "number",
        });
    });

    it("shuffle sugar type text", async () => {
        let core = await createTestCore({
            doenetML: `
  <p name="pList"><shuffle name="sh" type="text">
    apple
    banana
    orange
    almost
    above
  </shuffle></p>
  `,
        });

        let options = ["apple", "banana", "orange", "almost", "above"];

        await test_shuffle({
            core,
            options,
            must_be_reordered: [["banana", "orange", "almost", "above"]],
            replacements_all_of_type: "text",
        });
    });

    it("asList", async () => {
        let core = await createTestCore({
            doenetML: `
  <p name="pList"><shuffle name="sh" type="math">
    a b c x y z
  </shuffle></p>
  <p name="pNoList"><shuffle copySource="sh" asList="false" /></p>
  `,
        });

        let options = ["a", "b", "c", "x", "y", "z"];

        let orderedOptions = await test_shuffle({
            core,
            options,
            must_be_reordered: [],
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/pList"].stateValues.text).eq(
            orderedOptions.join(", "),
        );
        expect(stateVariables["/pNoList"].stateValues.text).eq(
            orderedOptions.join(""),
        );
    });

    it("assignNames", async () => {
        let core = await createTestCore({
            doenetML: `
  <shuffle assignNames="x1 x2 x3 x4 x5 x6 x7 x8 x9 x10 x11 x12">
    <math>x</math>
    <math>y</math>
    <math>z</math>
    <mathList>a b c d</mathList>
    <math>q</math>
    <mathList>1 2 3 4</mathList>
  </shuffle>
  `,
        });

        let options = ["x", "y", "z", "a", "b", "c", "d", "q", 1, 2, 3, 4];

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            [...Array(12).keys()]
                .map((v) => stateVariables[`/x${v + 1}`].stateValues.value.tree)
                .sort(),
        ).eqls(options.sort());
    });
});
