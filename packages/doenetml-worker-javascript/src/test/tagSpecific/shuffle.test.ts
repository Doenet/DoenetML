import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { movePoint, updateMathInputValue } from "../utils/actions";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { PublicDoenetMLCore } from "../../CoreWorker";
import {
    childrenAsPresented,
    componentOrListEntry,
    typeAsPresented,
} from "../utils/list-entries";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Shuffle tag tests @group1", async () => {
    type VariantKey = `${number},${number}`;

    it("shuffle a referenced list with an explicit type", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <textList name="names">Ann Cal Bob</textList>
  <p name="pList"><shuffle name="sh" type="text">$names Zoe</shuffle></p>
  `,
        });

        // `type` converts the bare string; the reference is passed through
        // rather than wrapped, so there are four things to shuffle rather than
        // the fused value "Ann, Cal, Bob" plus "Zoe".
        const stateVariables = await core.returnAllStateVariables(false, true);
        const shuffled = stateVariables[await resolvePathToNodeIdx("pList")];

        const children = childrenAsPresented(
            core,
            stateVariables,
            shuffled.componentIdx,
        );
        expect(children.length).eq(4);
        expect(children.map((child) => child.stateValues.value).sort()).eqls([
            "Ann",
            "Bob",
            "Cal",
            "Zoe",
        ]);
    });

    it("consistent order for n elements for given variant", async () => {
        const doenetML = `
  <p>m: <mathInput prefill="1" name="m" /></p>
  <p>n: <mathInput prefill="6" name="n" /></p>
  <p name="pList"><shuffle name="sh">
    <sequence from="$m" to="$n" />
  </shuffle></p>
  <p name="pList2">$sh</p>
  `;

        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariantIndex: 1,
        });

        let texts: Record<VariantKey, string> = {};
        let orders: Record<VariantKey, number[]> = {};

        let m = 1,
            n = 6;

        let stateVariables = await core.returnAllStateVariables(false, true);
        let componentOrder: number[] =
            stateVariables[await resolvePathToNodeIdx("sh")].stateValues
                .componentOrder;

        expect([...componentOrder].sort((a, b) => a - b)).eqls(
            [...Array(n - m + 1).keys()].map((x) => x + m),
        );

        orders[`${m},${n}`] = componentOrder;

        let pText = componentOrder.map((x: number) => x + m - 1).join(", ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pList")].stateValues
                .text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("pList2")].stateValues
                .text,
        ).eq(pText);

        texts[`${m},${n}`] = pText;

        // switch n to 8
        n = 8;
        await updateMathInputValue({
            latex: n.toString(),
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        componentOrder =
            stateVariables[await resolvePathToNodeIdx("sh")].stateValues
                .componentOrder;

        expect([...componentOrder].sort((a, b) => a - b)).eqls(
            [...Array(n - m + 1).keys()].map((x) => x + m),
        );

        orders[`${m},${n}`] = componentOrder;

        pText = componentOrder.map((x: number) => x + m - 1).join(", ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pList")].stateValues
                .text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("pList2")].stateValues
                .text,
        ).eq(pText);

        texts[`${m},${n}`] = pText;

        // get another list of length 6 by setting m to 3
        m = 3;
        await updateMathInputValue({
            latex: m.toString(),
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        componentOrder =
            stateVariables[await resolvePathToNodeIdx("sh")].stateValues
                .componentOrder;

        expect(componentOrder).eqls(orders[`${1},${6}`]);

        orders[`${m},${n}`] = componentOrder;

        pText = componentOrder.map((x: number) => x + m - 1).join(", ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pList")].stateValues
                .text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("pList2")].stateValues
                .text,
        ).eq(pText);

        texts[`${m},${n}`] = pText;

        // get another list of length 8 by setting n to 10
        n = 10;
        await updateMathInputValue({
            latex: n.toString(),
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        componentOrder =
            stateVariables[await resolvePathToNodeIdx("sh")].stateValues
                .componentOrder;

        expect(componentOrder).eqls(orders[`${1},${8}`]);

        orders[`${m},${n}`] = componentOrder;

        pText = componentOrder.map((x: number) => x + m - 1).join(", ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pList")].stateValues
                .text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("pList2")].stateValues
                .text,
        ).eq(pText);

        texts[`${m},${n}`] = pText;

        // values change with another variant

        ({ core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            requestedVariantIndex: 2,
        }));

        m = 1;
        n = 6;

        stateVariables = await core.returnAllStateVariables(false, true);
        componentOrder =
            stateVariables[await resolvePathToNodeIdx("sh")].stateValues
                .componentOrder;

        expect(componentOrder).not.eqls(orders[`${m},${n}`]);

        expect([...componentOrder].sort((a, b) => a - b)).eqls(
            [...Array(n - m + 1).keys()].map((x) => x + m),
        );

        orders[`${m},${n}`] = componentOrder;

        pText = componentOrder.map((x: number) => x + m - 1).join(", ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pList")].stateValues
                .text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("pList2")].stateValues
                .text,
        ).eq(pText);

        texts[`${m},${n}`] = pText;

        // switch n to 8
        n = 8;
        await updateMathInputValue({
            latex: n.toString(),
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        componentOrder =
            stateVariables[await resolvePathToNodeIdx("sh")].stateValues
                .componentOrder;

        expect(componentOrder).not.eqls(orders[`${m},${n}`]);

        expect([...componentOrder].sort((a, b) => a - b)).eqls(
            [...Array(n - m + 1).keys()].map((x) => x + m),
        );

        orders[`${m},${n}`] = componentOrder;

        pText = componentOrder.map((x: number) => x + m - 1).join(", ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pList")].stateValues
                .text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("pList2")].stateValues
                .text,
        ).eq(pText);

        texts[`${m},${n}`] = pText;

        // get another list of length 6 by setting m to 3
        m = 3;
        await updateMathInputValue({
            latex: m.toString(),
            componentIdx: await resolvePathToNodeIdx("m"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        componentOrder =
            stateVariables[await resolvePathToNodeIdx("sh")].stateValues
                .componentOrder;

        expect(componentOrder).eqls(orders[`${1},${6}`]);

        orders[`${m},${n}`] = componentOrder;

        pText = componentOrder.map((x: number) => x + m - 1).join(", ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pList")].stateValues
                .text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("pList2")].stateValues
                .text,
        ).eq(pText);

        texts[`${m},${n}`] = pText;

        // get another list of length 8 by setting n to 100
        n = 10;
        await updateMathInputValue({
            latex: n.toString(),
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        componentOrder =
            stateVariables[await resolvePathToNodeIdx("sh")].stateValues
                .componentOrder;

        expect(componentOrder).eqls(orders[`${1},${8}`]);

        orders[`${m},${n}`] = componentOrder;

        pText = componentOrder.map((x: number) => x + m - 1).join(", ");
        expect(
            stateVariables[await resolvePathToNodeIdx("pList")].stateValues
                .text,
        ).eq(pText);
        expect(
            stateVariables[await resolvePathToNodeIdx("pList2")].stateValues
                .text,
        ).eq(pText);

        texts[`${m},${n}`] = pText;
    });

    it("shuffle points", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <point name="A">(0,1)</point>
    <point name="B">(-2,1)</point>
    <point name="C">(7,1)</point>
    <point name="D">(3,1)</point>
    <point name="E">(5,1)</point>

    <p name="pList"><shuffle name="sh">$A$B$C$D$E</shuffle></p>
  `,
            requestedVariantIndex: 1,
        });

        const pointNames = ["A", "B", "C", "D", "E"];
        const pointTexts: Record<string, string> = {
            A: "(0, 1)",
            B: "(-2, 1)",
            C: "(7, 1)",
            D: "(3, 1)",
            E: "(5, 1)",
        };

        let stateVariables = await core.returnAllStateVariables(false, true);
        const componentOrder: number[] =
            stateVariables[await resolvePathToNodeIdx("sh")].stateValues
                .componentOrder;
        const orderedPointNames = componentOrder.map(
            (x: number) => pointNames[x - 1],
        );

        async function expectCurrentPointOrder() {
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[await resolvePathToNodeIdx("pList")].stateValues
                    .text,
            ).eq(orderedPointNames.map((name) => pointTexts[name]).join(", "));
        }

        await expectCurrentPointOrder();

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: -8,
            y: 9,
            core,
        });
        pointTexts.A = "(-8, 9)";
        await expectCurrentPointOrder();

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("B"),
            x: 8,
            y: -3,
            core,
        });
        pointTexts.B = "(8, -3)";
        await expectCurrentPointOrder();

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("C"),
            x: 4,
            y: 5,
            core,
        });
        pointTexts.C = "(4, 5)";
        await expectCurrentPointOrder();

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("D"),
            x: -9,
            y: 0,
            core,
        });
        pointTexts.D = "(-9, 0)";
        await expectCurrentPointOrder();

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("E"),
            x: -2,
            y: -1,
            core,
        });
        pointTexts.E = "(-2, -1)";
        await expectCurrentPointOrder();
    });

    async function test_shuffle({
        core,
        resolvePathToNodeIdx,
        options,
        must_be_reordered,
        replacements_all_of_type,
    }: {
        core: PublicDoenetMLCore;
        resolvePathToNodeIdx: ResolvePathToNodeIdx;
        options: (string | undefined)[];
        must_be_reordered: string[][];
        replacements_all_of_type?: string;
    }) {
        const stateVariables = await core.returnAllStateVariables(false, true);
        const componentOrder: number[] =
            stateVariables[await resolvePathToNodeIdx("sh")].stateValues
                .componentOrder;

        expect([...componentOrder].sort((a, b) => a - b)).eqls(
            [...Array(options.length).keys()].map((x) => x + 1),
        );

        const orderedOptions = componentOrder
            .map((x) => options[x - 1])
            .filter((x) => x !== undefined);

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
        expect(
            stateVariables[await resolvePathToNodeIdx("pList")].stateValues
                .text,
        ).eq(pText);

        if (replacements_all_of_type) {
            // an entry copied from a list is drawn as a value reference of
            // its type, and an entry of a list as the type of its entries
            let replacementTypes = childrenAsPresented(
                core,
                stateVariables,
                await resolvePathToNodeIdx("pList"),
            ).map((child) =>
                child.listEntryIndex === undefined
                    ? typeAsPresented(core, stateVariables, child.componentIdx)
                    : child.componentType,
            );

            expect(replacementTypes).eqls(
                Array(orderedOptions.length).fill(replacements_all_of_type),
            );
        }

        return orderedOptions;
    }

    it("shuffle with math and mathLists", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
            resolvePathToNodeIdx,
            options,
            must_be_reordered: [
                ["a", "b", "c", "d"],
                ["1", "2", "3", "4"],
            ],
            replacements_all_of_type: "math",
        });
    });

    it("shuffle with number and numberLists", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
            resolvePathToNodeIdx,
            options,
            must_be_reordered: [
                ["1", "2", "3", "4"],
                ["101", "102", "103", "104"],
            ],
            replacements_all_of_type: "number",
        });
    });

    it("shuffle with text and textLists", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
            resolvePathToNodeIdx,
            options,
            must_be_reordered: [
                ["1", "2", "3", "4"],
                ["hello", "there", "now", "then", "too"],
            ],
            replacements_all_of_type: "text",
        });
    });

    it("shuffle sugar type math", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p name="pList"><shuffle name="sh" type="math">
    a b c x y z
  </shuffle></p>
  `,
        });

        let options = ["a", "b", "c", "x", "y", "z"];

        await test_shuffle({
            core,
            resolvePathToNodeIdx,
            options,
            must_be_reordered: [["a", "b", "c", "x"]],
            replacements_all_of_type: "math",
        });
    });

    it("shuffle sugar type number", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p name="pList"><shuffle name="sh" type="number">
    101 542 817 527 51 234 801
  </shuffle></p>
  `,
        });

        let options = ["101", "542", "817", "527", "51", "234", "801"];

        await test_shuffle({
            core,
            resolvePathToNodeIdx,
            options,
            must_be_reordered: [["817", "527", "51", "234"]],
            replacements_all_of_type: "number",
        });
    });

    it("shuffle sugar type text", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
            resolvePathToNodeIdx,
            options,
            must_be_reordered: [["banana", "orange", "almost", "above"]],
            replacements_all_of_type: "text",
        });
    });

    it("asList", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p name="pList"><shuffle name="sh" type="math">
    a b c x y z
  </shuffle></p>
  <p name="pNoList"><shuffle extend="$sh" asList="false" /></p>
  `,
        });

        let options = ["a", "b", "c", "x", "y", "z"];

        let orderedOptions = await test_shuffle({
            core,
            resolvePathToNodeIdx,
            options,
            must_be_reordered: [],
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pList")].stateValues
                .text,
        ).eq(orderedOptions.join(", "));
        expect(
            stateVariables[await resolvePathToNodeIdx("pNoList")].stateValues
                .text,
        ).eq(orderedOptions.join(""));
    });

    it("by name and index", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <shuffle name="xs">
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

        const result: any[] = [];

        for (let i = 0; i < 12; i++) {
            result.push(
                (
                    await componentOrListEntry(
                        core,
                        stateVariables,
                        resolvePathToNodeIdx,
                        `xs[${i + 1}]`,
                    )
                ).stateValues.value.tree,
            );
        }

        expect(result.sort()).eqls(options.sort());
    });

    it("string children with no type are read as what they look like", async () => {
        // These used to warn and shuffle nothing at all.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="pList"><shuffle name="sh">d a b</shuffle></p>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(getDiagnosticsByType(core).warnings.length).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("pList")].stateValues.text
                .split(", ")
                .sort(),
        ).eqls(["a", "b", "d"]);
    });

    it("sugar with invalid type reports it and reads the children anyway", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="pList"><shuffle name="sh" type="bad">d a b</shuffle></p>
  `,
        });

        const options = ["d", "a", "b"];

        await test_shuffle({
            core,
            resolvePathToNodeIdx,
            options,
            must_be_reordered: [],
            replacements_all_of_type: "text",
        });

        let diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.warnings.length).eq(1);
        expect(diagnosticsByType.warnings[0].message).contain(
            "Invalid type bad for shuffle component",
        );
        expect(diagnosticsByType.warnings[0].message).contain(
            "reading the values as though no type had been given",
        );
    });

    it("string children ignored when mixed with non-string children with warning", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="pList"><shuffle name="sh">
        <math>d</math> a <math>b</math>
    </shuffle></p>
  `,
        });

        const options = ["d", undefined, "b"];

        await test_shuffle({
            core,
            resolvePathToNodeIdx,
            options,
            must_be_reordered: [],
            replacements_all_of_type: "math",
        });

        let diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.warnings.length).gte(1);
        expect(
            diagnosticsByType.warnings.some((w) =>
                w.message.includes(
                    'String " a " is not a valid component to shuffle.',
                ),
            ),
        ).eq(true);
    });
    it("gives its replacements ids that a rebuild reproduces", async () => {
        // Saved reader state is keyed by `stateId`, and without one of its own
        // a `<shuffle>` replacement falls back to its `componentIdx` -- which a
        // fresh load assigns in shuffled order while a save was made in
        // creation order, so a reader's value can come back on the wrong
        // replacement (Doenet/DoenetML#1944).
        // Paragraphs, which it copies; values it would hold as a list.
        const doenetML = `<shuffle name="s"><p>a</p><p>b</p><p>c</p></shuffle>`;

        async function replacementStateIds() {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
            });
            const components = core.core!._components!;
            const composite = components[await resolvePathToNodeIdx("s")];
            return {
                prefix: `${composite.stateId}|`,
                stateIds: composite.replacements.map(
                    (replacement: any) =>
                        components[replacement.componentIdx].stateId,
                ),
            };
        }

        const { prefix, stateIds } = await replacementStateIds();
        expect(stateIds.length).eq(3);
        for (const stateId of stateIds) {
            // Minted by the composite, off its own document-derived id — not
            // the component index, which is reassigned on every build.
            expect(
                stateId,
                `a shuffle replacement fell back to its component index: ${stateId}`,
            ).satisfy(
                (id: string) =>
                    id.startsWith(prefix) &&
                    /^\d+$/.test(id.slice(prefix.length)),
            );
        }
        expect(new Set(stateIds).size, "two replacements share an id").eq(3);
        expect((await replacementStateIds()).stateIds).eqls(stateIds);
    });

    it("items keep their random values when loaded again with the generated variant and in a copy of a container", async () => {
        // The shuffle hands its items' variants back in the order the items
        // are written, so it must report them in that order, not in the
        // order they are shown (Doenet/DoenetML#2352).
        const shuffle = `<shuffle name="sh">
            <p name="a"><selectFromSequence name="x" from="1" to="1000"/></p>
            <p name="b"><selectFromSequence name="y" from="1" to="1000"/></p>
            <p name="c"><selectFromSequence name="w" from="1" to="1000"/></p>
        </shuffle>`;

        async function valuesAndOrder(
            core: PublicDoenetMLCore,
            resolvePathToNodeIdx: ResolvePathToNodeIdx,
            prefix = "",
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const values = [];
            for (const name of ["x", "y", "w"]) {
                values.push(
                    stateVariables[await resolvePathToNodeIdx(prefix + name)]
                        .stateValues.selectedValues,
                );
            }
            return {
                values,
                order: stateVariables[await resolvePathToNodeIdx(prefix + "sh")]
                    .stateValues.componentOrder,
                generatedVariantInfo: JSON.parse(
                    JSON.stringify(
                        stateVariables[await resolvePathToNodeIdx("_document1")]
                            .stateValues.generatedVariantInfo,
                    ),
                ),
            };
        }

        const orders = new Set<string>();
        for (let variantIndex = 1; variantIndex <= 5; variantIndex++) {
            const first = await createTestCore({
                doenetML: shuffle,
                requestedVariantIndex: variantIndex,
            });
            const firstResult = await valuesAndOrder(
                first.core,
                first.resolvePathToNodeIdx,
            );
            orders.add(JSON.stringify(firstResult.order));

            const again = await createTestCore({
                doenetML: shuffle,
                requestedVariant: firstResult.generatedVariantInfo,
            });
            const againResult = await valuesAndOrder(
                again.core,
                again.resolvePathToNodeIdx,
            );
            expect(againResult.order).eqls(firstResult.order);
            expect(againResult.values).eqls(firstResult.values);

            const copied = await createTestCore({
                doenetML: `<section name="s">${shuffle}</section><section copy="$s" name="s2"/>`,
                requestedVariantIndex: variantIndex,
            });
            const source = await valuesAndOrder(
                copied.core,
                copied.resolvePathToNodeIdx,
                "s.",
            );
            const copy = await valuesAndOrder(
                copied.core,
                copied.resolvePathToNodeIdx,
                "s2.",
            );
            expect(copy.order).eqls(source.order);
            expect(copy.values).eqls(source.values);
        }
        // Orders other than the order written are covered.
        expect(orders.size).greaterThan(1);
        expect([...orders].some((order) => order !== "[1,2,3]")).eq(true);
    });

    it("items keep their random values when loaded again, with a text child among the items", async () => {
        // The text is one of the items shuffled, with no random values, so
        // the items' values are still matched to the items written.
        const doenetML = `<shuffle name="sh">
            hello
            <p><selectFromSequence name="x" from="1" to="1000"/></p>
            <p><selectFromSequence name="y" from="1" to="1000"/></p>
            <p><selectFromSequence name="w" from="1" to="1000"/></p>
        </shuffle>`;

        async function values(
            core: PublicDoenetMLCore,
            resolvePathToNodeIdx: ResolvePathToNodeIdx,
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const result = [];
            for (const name of ["x", "y", "w"]) {
                result.push(
                    stateVariables[await resolvePathToNodeIdx(name)].stateValues
                        .selectedValues,
                );
            }
            return {
                values: result,
                order: stateVariables[await resolvePathToNodeIdx("sh")]
                    .stateValues.componentOrder,
                generatedVariantInfo: JSON.parse(
                    JSON.stringify(
                        stateVariables[await resolvePathToNodeIdx("_document1")]
                            .stateValues.generatedVariantInfo,
                    ),
                ),
            };
        }

        const orders = new Set<string>();
        for (let variantIndex = 1; variantIndex <= 5; variantIndex++) {
            const first = await createTestCore({
                doenetML,
                requestedVariantIndex: variantIndex,
            });
            const firstResult = await values(
                first.core,
                first.resolvePathToNodeIdx,
            );
            expect(firstResult.order.length).eq(4);
            orders.add(JSON.stringify(firstResult.order));

            const again = await createTestCore({
                doenetML,
                requestedVariant: firstResult.generatedVariantInfo,
            });
            const againResult = await values(
                again.core,
                again.resolvePathToNodeIdx,
            );
            expect(againResult.order).eqls(firstResult.order);
            expect(againResult.values).eqls(firstResult.values);
        }
        expect(orders.size).greaterThan(1);
    });

    it("an unlinked copy of a shuffle gives its items the values of the shuffle's items, also when loaded again", async () => {
        // The copy is given the shuffle's variant, whose subvariants are
        // handed to the copy's items in the order they are written
        // (Doenet/DoenetML#2352).
        const doenetML = `<shuffle name="sh">
            <p name="a"><selectFromSequence name="x" from="1" to="1000"/></p>
            <p name="b"><selectFromSequence name="y" from="1" to="1000"/></p>
            <p name="c"><selectFromSequence name="w" from="1" to="1000"/></p>
        </shuffle>
        <shuffle copy="$sh" name="sh2"/>`;

        async function valuesAndOrder(
            core: PublicDoenetMLCore,
            resolvePathToNodeIdx: ResolvePathToNodeIdx,
            prefix: string,
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const values = [];
            for (const name of ["x", "y", "w"]) {
                values.push(
                    stateVariables[await resolvePathToNodeIdx(prefix + name)]
                        .stateValues.selectedValues,
                );
            }
            return {
                values,
                order: stateVariables[
                    await resolvePathToNodeIdx(prefix.slice(0, -1) || "sh")
                ].stateValues.componentOrder,
                generatedVariantInfo: JSON.parse(
                    JSON.stringify(
                        stateVariables[await resolvePathToNodeIdx("_document1")]
                            .stateValues.generatedVariantInfo,
                    ),
                ),
            };
        }

        const orders = new Set<string>();
        for (let variantIndex = 1; variantIndex <= 4; variantIndex++) {
            const first = await createTestCore({
                doenetML,
                requestedVariantIndex: variantIndex,
            });
            const source = await valuesAndOrder(
                first.core,
                first.resolvePathToNodeIdx,
                "",
            );
            const copy = await valuesAndOrder(
                first.core,
                first.resolvePathToNodeIdx,
                "sh2.",
            );
            orders.add(JSON.stringify(source.order));
            expect(copy.order).eqls(source.order);
            expect(copy.values).eqls(source.values);

            const again = await createTestCore({
                doenetML,
                requestedVariant: source.generatedVariantInfo,
            });
            for (const prefix of ["", "sh2."]) {
                const againResult = await valuesAndOrder(
                    again.core,
                    again.resolvePathToNodeIdx,
                    prefix,
                );
                expect(againResult.order).eqls(source.order);
                expect(againResult.values).eqls(source.values);
            }
        }
        expect([...orders].some((order) => order !== "[1,2,3]")).eq(true);
    });

    it("items of many kinds keep their random values when loaded again and in a copy of a container", async () => {
        // The shuffle reports the variants of its children, in the order
        // they are written, which is the order it hands them back in, so
        // a child that makes several items or none, a reference, or a
        // random component written directly as an item gets its own values
        // back (Doenet/DoenetML#2352).
        const sfs = `<selectFromSequence from="1" to="1000"/>`;
        const cases: { shuffle: string; names: string[] }[] = [
            {
                // a child making two items
                shuffle: `<shuffle name="sh"><group><p name="a">${sfs}</p><p name="b">${sfs}</p></group><p name="c">${sfs}</p></shuffle>`,
                names: ["a", "b", "c"],
            },
            {
                // a repeat as an item, with another random item
                shuffle: `<shuffle name="sh"><repeatForSequence name="r" from="1" to="2"><p name="a">${sfs}</p></repeatForSequence><p name="c">${sfs}</p></shuffle>`,
                names: ["r[1].a", "r[2].a", "c"],
            },
            {
                // a child making no items
                shuffle: `<shuffle name="sh"><conditionalContent condition="false"><p>${sfs}</p></conditionalContent><p name="a">${sfs}</p><p name="c">${sfs}</p></shuffle>`,
                names: ["a", "c"],
            },
            {
                // a random component written directly as an item
                shuffle: `<shuffle name="sh"><p name="a">${sfs}</p><selectFromSequence name="z" from="1" to="1000"/><p name="c">${sfs}</p></shuffle>`,
                names: ["a", "z", "c"],
            },
            {
                // a reference to random content outside the shuffle
                shuffle: `<p name="q">${sfs}</p><shuffle name="sh"><p name="a">${sfs}</p>$q<p name="c">${sfs}</p></shuffle>`,
                names: ["q", "a", "c"],
            },
            {
                // a shuffle in an item, with other random items
                shuffle: `<shuffle name="sh"><p name="a">${sfs}</p><p><shuffle name="inner"><p name="i1">${sfs}</p><p name="i2">${sfs}</p><p name="i3">${sfs}</p></shuffle></p><p name="c">${sfs}</p></shuffle>`,
                names: ["a", "inner", "i1", "i2", "i3", "c"],
            },
        ];

        async function shown(
            core: PublicDoenetMLCore,
            resolvePathToNodeIdx: ResolvePathToNodeIdx,
            names: string[],
            prefix = "",
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const result: unknown[] = [];
            for (const name of ["sh", ...names]) {
                const { stateValues } =
                    stateVariables[await resolvePathToNodeIdx(prefix + name)];
                result.push(
                    stateValues.componentOrder ??
                        stateValues.selectedValues ??
                        stateValues.text,
                );
            }
            return {
                result,
                generatedVariantInfo: JSON.parse(
                    JSON.stringify(
                        stateVariables[await resolvePathToNodeIdx("_document1")]
                            .stateValues.generatedVariantInfo,
                    ),
                ),
            };
        }

        for (const { shuffle, names } of cases) {
            const orders = new Set<string>();
            for (let variantIndex = 1; variantIndex <= 3; variantIndex++) {
                const first = await createTestCore({
                    doenetML: shuffle,
                    requestedVariantIndex: variantIndex,
                });
                const firstResult = await shown(
                    first.core,
                    first.resolvePathToNodeIdx,
                    names,
                );
                orders.add(JSON.stringify(firstResult.result[0]));

                const again = await createTestCore({
                    doenetML: shuffle,
                    requestedVariant: firstResult.generatedVariantInfo,
                });
                expect(
                    (await shown(again.core, again.resolvePathToNodeIdx, names))
                        .result,
                    shuffle,
                ).eqls(firstResult.result);
            }
            expect(orders.size, shuffle).greaterThan(1);
        }

        // In a copy of a container, for a child making two items
        const { shuffle, names } = cases[0];
        for (let variantIndex = 1; variantIndex <= 3; variantIndex++) {
            const copied = await createTestCore({
                doenetML: `<section name="s">${shuffle}</section><section copy="$s" name="s2"/>`,
                requestedVariantIndex: variantIndex,
            });
            const source = await shown(
                copied.core,
                copied.resolvePathToNodeIdx,
                names,
                "s.",
            );
            const copy = await shown(
                copied.core,
                copied.resolvePathToNodeIdx,
                names,
                "s2.",
            );
            expect(copy.result).eqls(source.result);
        }
    });
});
