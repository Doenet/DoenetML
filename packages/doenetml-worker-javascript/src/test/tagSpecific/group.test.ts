import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import { cleanLatex } from "../utils/math";
import {
    moveMath,
    movePoint,
    moveVector,
    updateBooleanInputValue,
    updateMathInputValue,
    updateMatrixInputValue,
    updateSelectedIndices,
    updateTextInputValue,
    updateValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

function isUndefinedOrInactive(comp) {
    expect(
        comp === undefined || comp.stateValues.isInactiveCompositeReplacement,
    ).eq(true);
}

describe("Group tag tests", async () => {
    async function test_nested_groups(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        let animal = "fox";
        let plant = "tree";
        let animalSentence = "The animal is a " + animal + ".";
        let plantSentence = "The plant is a " + plant + ".";

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("animalp")].stateValues
                .text,
        ).eq(animalSentence);
        expect(
            stateVariables[await resolvePathToNodeIdx("plantp")].stateValues
                .text,
        ).eq(plantSentence);
        expect(
            stateVariables[await resolvePathToNodeIdx("animalp2")].stateValues
                .text,
        ).eq(animalSentence);
        expect(
            stateVariables[await resolvePathToNodeIdx("plantp2")].stateValues
                .text,
        ).eq(plantSentence);
        expect(
            stateVariables[await resolvePathToNodeIdx("g4.plantp2")].stateValues
                .text,
        ).eq(plantSentence);
        expect(
            stateVariables[await resolvePathToNodeIdx("g5.plantp")].stateValues
                .text,
        ).eq(plantSentence);
        expect(
            stateVariables[await resolvePathToNodeIdx("g5.animalp2")]
                .stateValues.text,
        ).eq(animalSentence);
        expect(
            stateVariables[await resolvePathToNodeIdx("g5.plantp2")].stateValues
                .text,
        ).eq(plantSentence);
        expect(
            stateVariables[await resolvePathToNodeIdx("g5.g4.plantp2")]
                .stateValues.text,
        ).eq(plantSentence);
        expect(
            stateVariables[await resolvePathToNodeIdx("g6.animalp")].stateValues
                .text,
        ).eq(animalSentence);
        expect(
            stateVariables[await resolvePathToNodeIdx("g6.plantp")].stateValues
                .text,
        ).eq(plantSentence);
        expect(
            stateVariables[await resolvePathToNodeIdx("g6.animalp2")]
                .stateValues.text,
        ).eq(animalSentence);
        expect(
            stateVariables[await resolvePathToNodeIdx("g6.plantp2")].stateValues
                .text,
        ).eq(plantSentence);
        expect(
            stateVariables[await resolvePathToNodeIdx("g6.g4.plantp2")]
                .stateValues.text,
        ).eq(plantSentence);
        expect(
            stateVariables[await resolvePathToNodeIdx("g6.g5.plantp")]
                .stateValues.text,
        ).eq(plantSentence);
        expect(
            stateVariables[await resolvePathToNodeIdx("g6.g5.animalp2")]
                .stateValues.text,
        ).eq(animalSentence);
        expect(
            stateVariables[await resolvePathToNodeIdx("g6.g5.plantp2")]
                .stateValues.text,
        ).eq(plantSentence);
        expect(
            stateVariables[await resolvePathToNodeIdx("g6.g5.g4.plantp2")]
                .stateValues.text,
        ).eq(plantSentence);

        await updateTextInputValue({
            text: "beetle",
            componentIdx: await resolvePathToNodeIdx("animal"),
            core,
        });
        await updateTextInputValue({
            text: "dandelion",
            componentIdx: await resolvePathToNodeIdx("plant"),
            core,
        });

        let animal2 = "beetle";
        let plant2 = "dandelion";
        let animalSentence2 = "The animal is a " + animal2 + ".";
        let plantSentence2 = "The plant is a " + plant2 + ".";

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("animalp")].stateValues
                .text,
        ).eq(animalSentence2);
        expect(
            stateVariables[await resolvePathToNodeIdx("plantp")].stateValues
                .text,
        ).eq(plantSentence2);
        expect(
            stateVariables[await resolvePathToNodeIdx("animalp2")].stateValues
                .text,
        ).eq(animalSentence2);
        expect(
            stateVariables[await resolvePathToNodeIdx("plantp2")].stateValues
                .text,
        ).eq(plantSentence2);
        expect(
            stateVariables[await resolvePathToNodeIdx("g4.plantp2")].stateValues
                .text,
        ).eq(plantSentence2);
        expect(
            stateVariables[await resolvePathToNodeIdx("g5.plantp")].stateValues
                .text,
        ).eq(plantSentence2);
        expect(
            stateVariables[await resolvePathToNodeIdx("g5.animalp2")]
                .stateValues.text,
        ).eq(animalSentence2);
        expect(
            stateVariables[await resolvePathToNodeIdx("g5.plantp2")].stateValues
                .text,
        ).eq(plantSentence2);
        expect(
            stateVariables[await resolvePathToNodeIdx("g5.g4.plantp2")]
                .stateValues.text,
        ).eq(plantSentence2);
        expect(
            stateVariables[await resolvePathToNodeIdx("g6.animalp")].stateValues
                .text,
        ).eq(animalSentence2);
        expect(
            stateVariables[await resolvePathToNodeIdx("g6.plantp")].stateValues
                .text,
        ).eq(plantSentence2);
        expect(
            stateVariables[await resolvePathToNodeIdx("g6.animalp2")]
                .stateValues.text,
        ).eq(animalSentence2);
        expect(
            stateVariables[await resolvePathToNodeIdx("g6.plantp2")].stateValues
                .text,
        ).eq(plantSentence2);
        expect(
            stateVariables[await resolvePathToNodeIdx("g6.g4.plantp2")]
                .stateValues.text,
        ).eq(plantSentence2);
        expect(
            stateVariables[await resolvePathToNodeIdx("g6.g5.plantp")]
                .stateValues.text,
        ).eq(plantSentence2);
        expect(
            stateVariables[await resolvePathToNodeIdx("g6.g5.animalp2")]
                .stateValues.text,
        ).eq(animalSentence2);
        expect(
            stateVariables[await resolvePathToNodeIdx("g6.g5.plantp2")]
                .stateValues.text,
        ).eq(plantSentence2);
        expect(
            stateVariables[await resolvePathToNodeIdx("g6.g5.g4.plantp2")]
                .stateValues.text,
        ).eq(plantSentence2);
    }
    it("nested groups, extended", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p>Animal: <textInput name="animal" prefill="fox"/></p>
    <p>Plant: <textInput name="plant" prefill="tree"/></p>
    
    <group name="g1">
      <p name="animalp">The animal is a $animal.value.</p>
      <group name="g2">
        <p name="plantp">The plant is a $plant.value.</p>
        <p extend="$animalp" name="animalp2" />
        <group name="g3">
          <p extend="$plantp" name="plantp2" />
        </group>
        <group extend="$g3" name="g4"  />
      </group>
      <group extend="$g2" name="g5" />
    </group>
    <group extend="$g1" name="g6"/>
    `,
        });

        await test_nested_groups(core, resolvePathToNodeIdx);
    });

    it("nested groups, initially unresolved, reffed", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `

    $g1
    <group name="g1">
      <p name="animalp">The animal $animalphrase.</p>
      <group name="g2">
        <p name="plantp">The plant $plantphrase.</p>
        <p extend="$animalp" name="animalp2" />
        <group name="g3">
          <p extend="$plantp" name="plantp2" />
        </group>
        <group extend="$g3" name="g4" />
      </group>
      <group extend="$g2" name="g5" />
    </group>
    <group extend="$g1" name="g6" />

    <text extend="$verb1" name="verb" />
    <text extend="$animalphrase1" name="animalphrase" />
    <text name="animalphrase1">$verb $animal1</text>
    <text name="animal1">$article $animal.value</text>
    <text extend="$verb2" name="verb1" />
    <text name="verb2">is</text>
    <text name="article">$article1</text>
    <text extend="$article2" name="article1" />
    <text name="article2">a</text>
    <text extend="$plantphrase1" name="plantphrase" />
    <text name="plantphrase1">$verb $plant1</text>
    <text name="plant1">$article $plant.value</text>

    <p>Animal: <textInput name="animal" prefill="fox"/></p>
    <p>Plant: <textInput name="plant" prefill="tree"/></p>
    
    `,
        });

        await test_nested_groups(core, resolvePathToNodeIdx);
    });

    it("group with a map that begins zero length, copied multiple times", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <setup><sequence from="$from" to="$to" length="$count" name="s" /></setup>
    <p name="p1"><group asList name="group1"><repeat for="$s" valueName="x">
        <math simplify>$x^2</math>
    </repeat></group></p>

    <mathInput name="from" prefill="1"/>
    <mathInput name="to" prefill="2"/>
    <mathInput name="count" prefill="0"/>
    
    <p name="p2"><group extend="$group1" name="group2" /></p>
    <p name="p3"><group extend="$group2" name="group3" /></p>

    <p name="p4" extend="$p1" />
    <p name="p5" extend="$p4" />
    <p name="p6" extend="$p5" />

    `,
        });

        async function check_items(count: number, from: number, to: number) {
            const dx = count > 1 ? (to - from) / (count - 1) : 0;
            const sequence_text = [...Array(count).keys()]
                .map((i) => (from + i * dx) ** 2)
                .join(", ");

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (let i = 1; i <= 6; i++) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`p${i}`)]
                        .stateValues.text,
                ).eq(sequence_text);
            }
        }

        let count = 0,
            from = 1,
            to = 2;

        // At beginning, nothing shown
        await check_items(count, from, to);

        // make sequence length 1
        count = 1;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("count"),
            core,
        });
        await check_items(count, from, to);

        // make sequence length 0 again
        count = 0;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("count"),
            core,
        });
        await check_items(count, from, to);

        // make sequence length 2
        count = 2;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("count"),
            core,
        });
        await check_items(count, from, to);

        // change limits
        from = 3;
        to = 5;
        await updateMathInputValue({
            latex: from.toString(),
            componentIdx: await resolvePathToNodeIdx("from"),
            core,
        });
        await updateMathInputValue({
            latex: to.toString(),
            componentIdx: await resolvePathToNodeIdx("to"),
            core,
        });
        await check_items(count, from, to);

        // make sequence length 0 once again
        count = 0;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("count"),
            core,
        });
        await check_items(count, from, to);

        // make sequence length 3
        count = 3;
        await updateMathInputValue({
            latex: count.toString(),
            componentIdx: await resolvePathToNodeIdx("count"),
            core,
        });
        await check_items(count, from, to);
    });

    it("group with mutual references", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <p name="p1"><asList name="al1">
    <group name="group1"><math simplify><math name="x">$var1</math> + $y</math></group>
    <group name="group2"><math simplify><math name="y">$var2</math> + $x</math></group>
    </asList></p>
    
    <mathInput prefill="x" name="var1"/>
    <mathInput prefill="y" name="var2"/>
    
    <p name="p2"><asList>$group1$group2</asList></p>
    <p name="p3">$al1</p>
    
    <p name="p4" extend="$p1" />
    <p name="p5" extend="$p2" />
    <p name="p6" extend="$p3" />
    
    <p name="p7" extend="$p4" />
    <p name="p8" extend="$p5" />
    <p name="p9" extend="$p6" />

    <math extend="$var2.value" name="var2b" />

    `,
        });

        async function check_items(var1: string, var2: string) {
            let text = `${var1} + ${var2}`;
            text = `${text}, ${text}`;
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (let i = 1; i <= 9; i++) {
                expect(
                    stateVariables[await resolvePathToNodeIdx(`p${i}`)]
                        .stateValues.text,
                ).eq(text);
            }
        }

        let var1 = "x",
            var2 = "y";
        await check_items(var1, var2);

        // change variables
        var1 = "u";
        var2 = "v";
        await updateMathInputValue({
            latex: var1,
            componentIdx: await resolvePathToNodeIdx("var1"),
            core,
        });
        await updateMathInputValue({
            latex: var2,
            componentIdx: await resolvePathToNodeIdx("var2"),
            core,
        });
        await check_items(var1, var2);
    });

    it("fixed propagated when copy group", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <group name="g">
        <point name="A">(1,2)</point>
      </group>
    </graph>

    <graph>
      <group extend="$g" fixed name="g2" />
    </graph>

    <graph>
      <group extend="$g2" fixed="false" name="g3" />
    </graph>

    <graph>
      <group copy="$g2" fixed="false" name="g4" />
    </graph>

    `,
        });

        // Initial values
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues.fixed,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("g.A")].stateValues.fixed,
        ).eq(false);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g.A")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues.fixed,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.A")].stateValues
                .fixed,
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g2.A")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g3")].stateValues.fixed,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("g3.A")].stateValues
                .fixed,
        ).eq(false);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g3.A")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);
        expect(
            stateVariables[await resolvePathToNodeIdx("g4")].stateValues.fixed,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("g4.A")].stateValues
                .fixed,
        ).eq(false);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g4.A")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);

        // move first point
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g.A"),
            x: 3,
            y: 4,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g.A")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([3, 4]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g2.A")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([3, 4]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g3.A")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([3, 4]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g4.A")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);

        // can't move second point as fixed
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g2.A"),
            x: 5,
            y: 6,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g.A")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([3, 4]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g2.A")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([3, 4]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g3.A")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([3, 4]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g4.A")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);

        // TODO: this used to be immobile but not it is
        // Do we need to figure out how to make third point immobile again?
        // Comment is supposed to be: can't move third point as depends on fixed second point

        // for now, can move third point as depends on directly on xs of first point
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g3.A"),
            x: 7,
            y: 8,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g.A")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([7, 8]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g2.A")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([7, 8]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g3.A")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([7, 8]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g4.A")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([1, 2]);

        // can move fourth point
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g4.A"),
            x: 9,
            y: 0,
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g.A")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([7, 8]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g2.A")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([7, 8]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g3.A")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([7, 8]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("g4.A")
            ].stateValues.xs.map((x) => x.tree),
        ).eqls([9, 0]);
    });

    it("disabled propagated when copy group", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <group name="g">
        <textInput name="ti" prefill="hello" />
        <text extend="$ti.value" name="t" />
      </group>

      <group extend="$g" disabled name="g2" />

      <group extend="$g2" disabled="false" name="g3" />

      <group copy="$g2" disabled="false" name="g4" />

    `,
        });

        // Initial values
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("g")].stateValues
                .disabled,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("g.ti")].stateValues
                .disabled,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("g.ti")].stateValues
                .value,
        ).eq("hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("g2")].stateValues
                .disabled,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.ti")].stateValues
                .disabled,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.ti")].stateValues
                .value,
        ).eq("hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("g3")].stateValues
                .disabled,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("g3.ti")].stateValues
                .disabled,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("g3.ti")].stateValues
                .value,
        ).eq("hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("g4")].stateValues
                .disabled,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("g4.ti")].stateValues
                .disabled,
        ).eq(false);
        expect(
            stateVariables[await resolvePathToNodeIdx("g4.ti")].stateValues
                .value,
        ).eq("hello");

        // type in first textInput
        await updateTextInputValue({
            text: "bye",
            componentIdx: await resolvePathToNodeIdx("g.ti"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("g.ti")].stateValues
                .value,
        ).eq("bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.ti")].stateValues
                .value,
        ).eq("bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("g3.ti")].stateValues
                .value,
        ).eq("bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("g4.ti")].stateValues
                .value,
        ).eq("hello");

        // attempting to type in second textInput doesn't work
        await updateTextInputValue({
            text: "nope",
            componentIdx: await resolvePathToNodeIdx("g2.ti"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("g.ti")].stateValues
                .value,
        ).eq("bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.ti")].stateValues
                .value,
        ).eq("bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("g3.ti")].stateValues
                .value,
        ).eq("bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("g4.ti")].stateValues
                .value,
        ).eq("hello");

        // type in third textInput
        await updateTextInputValue({
            text: "this",
            componentIdx: await resolvePathToNodeIdx("g3.ti"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("g.ti")].stateValues
                .value,
        ).eq("this");
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.ti")].stateValues
                .value,
        ).eq("this");
        expect(
            stateVariables[await resolvePathToNodeIdx("g3.ti")].stateValues
                .value,
        ).eq("this");
        expect(
            stateVariables[await resolvePathToNodeIdx("g4.ti")].stateValues
                .value,
        ).eq("hello");

        // type in fourth textInput
        await updateTextInputValue({
            text: "that",
            componentIdx: await resolvePathToNodeIdx("g4.ti"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("g.ti")].stateValues
                .value,
        ).eq("this");
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.ti")].stateValues
                .value,
        ).eq("this");
        expect(
            stateVariables[await resolvePathToNodeIdx("g3.ti")].stateValues
                .value,
        ).eq("this");
        expect(
            stateVariables[await resolvePathToNodeIdx("g4.ti")].stateValues
                .value,
        ).eq("that");
    });

    it("change rendered", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
      <p><booleanInput name="ren1"><label>rendered 1</label></booleanInput></p>
      <group name="g1" rendered="$ren1">
        <p name="p">Hello</p>
      </group>

      <p><booleanInput name="ren2" prefill="true"><label>rendered 2</label></booleanInput></p>
      <group name="g2" rendered="$ren2">
        <p name="p">Bye</p>
      </group>
      
      <group extend="$g1" name="g1a" />
      <group extend="$g2" name="g2a" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables[await resolvePathToNodeIdx("g1.p")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("g1a.p")]).eq(
            undefined,
        );
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.p")].stateValues.text,
        ).eq("Bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("g2a.p")].stateValues
                .text,
        ).eq("Bye");

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("ren1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("g1.p")].stateValues.text,
        ).eq("Hello");

        expect(
            stateVariables[await resolvePathToNodeIdx("g1a.p")].stateValues
                .text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.p")].stateValues.text,
        ).eq("Bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("g2a.p")].stateValues
                .text,
        ).eq("Bye");

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("ren2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("g1.p")].stateValues.text,
        ).eq("Hello");
        expect(
            stateVariables[await resolvePathToNodeIdx("g1a.p")].stateValues
                .text,
        ).eq("Hello");
        isUndefinedOrInactive(
            stateVariables[await resolvePathToNodeIdx("g2.p")],
        );
        isUndefinedOrInactive(
            stateVariables[await resolvePathToNodeIdx("g2a.p")],
        );

        await updateBooleanInputValue({
            boolean: false,
            componentIdx: await resolvePathToNodeIdx("ren1"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        isUndefinedOrInactive(
            stateVariables[await resolvePathToNodeIdx("g1.p")],
        );
        isUndefinedOrInactive(
            stateVariables[await resolvePathToNodeIdx("g1a.p")],
        );
        isUndefinedOrInactive(
            stateVariables[await resolvePathToNodeIdx("g2.p")],
        );
        isUndefinedOrInactive(
            stateVariables[await resolvePathToNodeIdx("g2a.p")],
        );

        await updateBooleanInputValue({
            boolean: true,
            componentIdx: await resolvePathToNodeIdx("ren2"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        isUndefinedOrInactive(
            stateVariables[await resolvePathToNodeIdx("g1.p")],
        );
        isUndefinedOrInactive(
            stateVariables[await resolvePathToNodeIdx("g1a.p")],
        );
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.p")].stateValues.text,
        ).eq("Bye");
        expect(
            stateVariables[await resolvePathToNodeIdx("g2a.p")].stateValues
                .text,
        ).eq("Bye");
    });
});
