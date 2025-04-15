import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
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
    async function test_nested_groups(core: PublicDoenetMLCore) {
        let animal = "fox";
        let plant = "tree";
        let animalSentence = "The animal is a " + animal + ".";
        let plantSentence = "The plant is a " + plant + ".";

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/animalp"].stateValues.text).eq(animalSentence);
        expect(stateVariables["/plantp"].stateValues.text).eq(plantSentence);
        expect(stateVariables["/animalp2"].stateValues.text).eq(animalSentence);
        expect(stateVariables["/plantp2"].stateValues.text).eq(plantSentence);
        expect(stateVariables["/plantp3"].stateValues.text).eq(plantSentence);
        expect(stateVariables["/plantp4"].stateValues.text).eq(plantSentence);
        expect(stateVariables["/animalp3"].stateValues.text).eq(animalSentence);
        expect(stateVariables["/plantp5"].stateValues.text).eq(plantSentence);
        expect(stateVariables["/plantp6"].stateValues.text).eq(plantSentence);
        expect(stateVariables["/animalp4"].stateValues.text).eq(animalSentence);
        expect(stateVariables["/plantp7"].stateValues.text).eq(plantSentence);
        expect(stateVariables["/animalp5"].stateValues.text).eq(animalSentence);
        expect(stateVariables["/plantp8"].stateValues.text).eq(plantSentence);
        expect(stateVariables["/plantp9"].stateValues.text).eq(plantSentence);
        expect(stateVariables["/plantp10"].stateValues.text).eq(plantSentence);
        expect(stateVariables["/animalp6"].stateValues.text).eq(animalSentence);
        expect(stateVariables["/plantp11"].stateValues.text).eq(plantSentence);
        expect(stateVariables["/plantp12"].stateValues.text).eq(plantSentence);

        await updateTextInputValue({ text: "beetle", name: "/animal", core });
        await updateTextInputValue({ text: "dandelion", name: "/plant", core });

        let animal2 = "beetle";
        let plant2 = "dandelion";
        let animalSentence2 = "The animal is a " + animal2 + ".";
        let plantSentence2 = "The plant is a " + plant2 + ".";

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/animalp"].stateValues.text).eq(animalSentence2);
        expect(stateVariables["/plantp"].stateValues.text).eq(plantSentence2);
        expect(stateVariables["/animalp2"].stateValues.text).eq(
            animalSentence2,
        );
        expect(stateVariables["/plantp2"].stateValues.text).eq(plantSentence2);
        expect(stateVariables["/plantp3"].stateValues.text).eq(plantSentence2);
        expect(stateVariables["/plantp4"].stateValues.text).eq(plantSentence2);
        expect(stateVariables["/animalp3"].stateValues.text).eq(
            animalSentence2,
        );
        expect(stateVariables["/plantp5"].stateValues.text).eq(plantSentence2);
        expect(stateVariables["/plantp6"].stateValues.text).eq(plantSentence2);
        expect(stateVariables["/animalp4"].stateValues.text).eq(
            animalSentence2,
        );
        expect(stateVariables["/plantp7"].stateValues.text).eq(plantSentence2);
        expect(stateVariables["/animalp5"].stateValues.text).eq(
            animalSentence2,
        );
        expect(stateVariables["/plantp8"].stateValues.text).eq(plantSentence2);
        expect(stateVariables["/plantp9"].stateValues.text).eq(plantSentence2);
        expect(stateVariables["/plantp10"].stateValues.text).eq(plantSentence2);
        expect(stateVariables["/animalp6"].stateValues.text).eq(
            animalSentence2,
        );
        expect(stateVariables["/plantp11"].stateValues.text).eq(plantSentence2);
        expect(stateVariables["/plantp12"].stateValues.text).eq(plantSentence2);
    }
    it("nested groups, copied", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Animal: <textInput name="animal" prefill="fox"/></p>
    <p>Plant: <textInput name="plant" prefill="tree"/></p>
    
    <group name="g1">
      <p name="animalp">The animal is a $animal.value.</p>
      <group name="g2">
        <p name="plantp">The plant is a $plant.value.</p>
        <p copySource="animalp" name="animalp2" />
        <group name="g3">
          <p copySource="plantp" name="plantp2" />
        </group>
        <group copySource="g3" assignNames="plantp3" />
      </group>
      <group copySource="g2" assignNames="plantp4 animalp3 (plantp5) (plantp6)" />
    </group>
    <group copySource="g1" assignNames="animalp4 (plantp7 animalp5 (plantp8) (plantp9)) (plantp10 animalp6 (plantp11) (plantp12))" />
    `,
        });

        await test_nested_groups(core);
    });

    it("nested groups, initially unresolved, reffed", async () => {
        let core = await createTestCore({
            doenetML: `

    $g1
    <group name="g1">
      <p name="animalp">The animal $animalphrase.</p>
      <group name="g2">
        <p name="plantp">The plant $plantphrase.</p>
        <p copySource="animalp" name="animalp2" />
        <group name="g3">
          <p copySource="plantp" name="plantp2" />
        </group>
        <group copySource="g3" assignNames="plantp3" />
      </group>
      <group copySource="g2" assignNames="plantp4 animalp3 (plantp5) (plantp6)" />
    </group>
    <group copySource="g1" assignNames="animalp4 (plantp7 animalp5 (plantp8) (plantp9)) (plantp10 animalp6 (plantp11) (plantp12))" />

    $verb1{name="verb"}
    $animalphrase1{name="animalphrase"}
    <text name="animalphrase1">$verb $animal1</text>
    <text name="animal1">$article $animal.value</text>
    $verb2{name="verb1"}
    <text name="verb2">is</text>
    <text name="article">$article1</text>
    $article2{name="article1"}
    <text name="article2">a</text>
    $plantphrase1{name="plantphrase"}
    <text name="plantphrase1">$verb $plant1</text>
    <text name="plant1">$article $plant.value</text>

    <p>Animal: <textInput name="animal" prefill="fox"/></p>
    <p>Plant: <textInput name="plant" prefill="tree"/></p>
    
    `,
        });

        await test_nested_groups(core);
    });

    it("group with a map that begins zero length, copied multiple times", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><group asList name="group1"><map>
    <template><math simplify>$x^2</math></template>
    <sources alias="x">
    <sequence from="$from" to="$to" length="$count" />
    </sources>
    </map></group></p>

    <mathInput name="from" prefill="1"/>
    <mathInput name="to" prefill="2"/>
    <mathInput name="count" prefill="0"/>
    
    <p name="p2"><group copySource="group1" name="group2" /></p>
    <p name="p3"><group copySource="group2" name="group3" /></p>

    <p name="p4" copySource="p1" />
    <p name="p5" copySource="p4" />
    <p name="p6" copySource="p5" />

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
                expect(stateVariables[`/p${i}`].stateValues.text).eq(
                    sequence_text,
                );
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
            name: "/count",
            core,
        });
        await check_items(count, from, to);

        // make sequence length 0 again
        count = 0;
        await updateMathInputValue({
            latex: count.toString(),
            name: "/count",
            core,
        });
        await check_items(count, from, to);

        // make sequence length 2
        count = 2;
        await updateMathInputValue({
            latex: count.toString(),
            name: "/count",
            core,
        });
        await check_items(count, from, to);

        // change limits
        from = 3;
        to = 5;
        await updateMathInputValue({
            latex: from.toString(),
            name: "/from",
            core,
        });
        await updateMathInputValue({ latex: to.toString(), name: "/to", core });
        await check_items(count, from, to);

        // make sequence length 0 once again
        count = 0;
        await updateMathInputValue({
            latex: count.toString(),
            name: "/count",
            core,
        });
        await check_items(count, from, to);

        // make sequence length 3
        count = 3;
        await updateMathInputValue({
            latex: count.toString(),
            name: "/count",
            core,
        });
        await check_items(count, from, to);
    });

    it("group with mutual references", async () => {
        let core = await createTestCore({
            doenetML: `
    <p name="p1"><asList name="al1">
    <group name="group1"><math simplify><math name="x">$var1</math> + $y</math></group>
    <group name="group2"><math simplify><math name="y">$var2</math> + $x</math></group>
    </asList></p>
    
    <mathInput prefill="x" name="var1"/>
    <mathInput prefill="y" name="var2"/>
    
    <p name="p2"><asList>$group1$group2</asList></p>
    <p name="p3">$al1</p>
    
    <p name="p4" copySource="p1" />
    <p name="p5" copySource="p2" />
    <p name="p6" copySource="p3" />
    
    <p name="p7" copySource="p4" />
    <p name="p8" copySource="p5" />
    <p name="p9" copySource="p6" />

    $var2.value{assignNames="var2b"}

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
                expect(stateVariables[`/p${i}`].stateValues.text).eq(text);
            }
        }

        let var1 = "x",
            var2 = "y";
        await check_items(var1, var2);

        // change variables
        var1 = "u";
        var2 = "v";
        await updateMathInputValue({ latex: var1, name: "/var1", core });
        await updateMathInputValue({ latex: var2, name: "/var2", core });
        await check_items(var1, var2);
    });

    it("fixed propagated when copy group", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <group name="g" newNamespace>
        <point name="A">(1,2)</point>
      </group>
    </graph>

    <graph>
      <group copySource="g" fixed name="g2" />
    </graph>

    <graph>
      <group copySource="g2" fixed="false" name="g3" />
    </graph>

    <graph>
      <group copySource="g2" fixed="false" link="false" name="g4" />
    </graph>

    `,
        });

        // Initial values
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.fixed).eq(false);
        expect(stateVariables["/g/A"].stateValues.fixed).eq(false);
        expect(stateVariables["/g/A"].stateValues.xs.map((x) => x.tree)).eqls([
            1, 2,
        ]);
        expect(stateVariables["/g2"].stateValues.fixed).eq(true);
        expect(stateVariables["/g2/A"].stateValues.fixed).eq(true);
        expect(stateVariables["/g2/A"].stateValues.xs.map((x) => x.tree)).eqls([
            1, 2,
        ]);
        expect(stateVariables["/g3"].stateValues.fixed).eq(false);
        expect(stateVariables["/g3/A"].stateValues.fixed).eq(false);
        expect(stateVariables["/g3/A"].stateValues.xs.map((x) => x.tree)).eqls([
            1, 2,
        ]);
        expect(stateVariables["/g4"].stateValues.fixed).eq(false);
        expect(stateVariables["/g4/A"].stateValues.fixed).eq(false);
        expect(stateVariables["/g4/A"].stateValues.xs.map((x) => x.tree)).eqls([
            1, 2,
        ]);

        // move first point
        await movePoint({ name: "/g/A", x: 3, y: 4, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g/A"].stateValues.xs.map((x) => x.tree)).eqls([
            3, 4,
        ]);
        expect(stateVariables["/g2/A"].stateValues.xs.map((x) => x.tree)).eqls([
            3, 4,
        ]);
        expect(stateVariables["/g3/A"].stateValues.xs.map((x) => x.tree)).eqls([
            3, 4,
        ]);
        expect(stateVariables["/g4/A"].stateValues.xs.map((x) => x.tree)).eqls([
            1, 2,
        ]);

        // can't move second point as fixed
        await movePoint({ name: "/g2/A", x: 5, y: 6, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g/A"].stateValues.xs.map((x) => x.tree)).eqls([
            3, 4,
        ]);
        expect(stateVariables["/g2/A"].stateValues.xs.map((x) => x.tree)).eqls([
            3, 4,
        ]);
        expect(stateVariables["/g3/A"].stateValues.xs.map((x) => x.tree)).eqls([
            3, 4,
        ]);
        expect(stateVariables["/g4/A"].stateValues.xs.map((x) => x.tree)).eqls([
            1, 2,
        ]);

        // TODO: this used to be immobile but not it is
        // Do we need to figure out how to make third point immobile again?
        // Comment is supposed to be: can't move third point as depends on fixed second point

        // for now, can move third point as depends on directly on xs of first point
        await movePoint({ name: "/g3/A", x: 7, y: 8, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g/A"].stateValues.xs.map((x) => x.tree)).eqls([
            7, 8,
        ]);
        expect(stateVariables["/g2/A"].stateValues.xs.map((x) => x.tree)).eqls([
            7, 8,
        ]);
        expect(stateVariables["/g3/A"].stateValues.xs.map((x) => x.tree)).eqls([
            7, 8,
        ]);
        expect(stateVariables["/g4/A"].stateValues.xs.map((x) => x.tree)).eqls([
            1, 2,
        ]);

        // can move fourth point
        await movePoint({ name: "/g4/A", x: 9, y: 0, core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g/A"].stateValues.xs.map((x) => x.tree)).eqls([
            7, 8,
        ]);
        expect(stateVariables["/g2/A"].stateValues.xs.map((x) => x.tree)).eqls([
            7, 8,
        ]);
        expect(stateVariables["/g3/A"].stateValues.xs.map((x) => x.tree)).eqls([
            7, 8,
        ]);
        expect(stateVariables["/g4/A"].stateValues.xs.map((x) => x.tree)).eqls([
            9, 0,
        ]);
    });

    it("disabled propagated when copy group", async () => {
        let core = await createTestCore({
            doenetML: `
      <group name="g" newNamespace>
        <textInput name="ti" prefill="hello" />
        $ti.value{assignNames="t"}
      </group>

      <group copySource="g" disabled name="g2" />

      <group copySource="g2" disabled="false" name="g3" />

      <group copySource="g2" disabled="false" link="false" name="g4" />

    `,
        });

        // Initial values
        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g"].stateValues.disabled).eq(false);
        expect(stateVariables["/g/ti"].stateValues.disabled).eq(false);
        expect(stateVariables["/g/ti"].stateValues.value).eq("hello");
        expect(stateVariables["/g2"].stateValues.disabled).eq(true);
        expect(stateVariables["/g2/ti"].stateValues.disabled).eq(true);
        expect(stateVariables["/g2/ti"].stateValues.value).eq("hello");
        expect(stateVariables["/g3"].stateValues.disabled).eq(false);
        expect(stateVariables["/g3/ti"].stateValues.disabled).eq(false);
        expect(stateVariables["/g3/ti"].stateValues.value).eq("hello");
        expect(stateVariables["/g4"].stateValues.disabled).eq(false);
        expect(stateVariables["/g4/ti"].stateValues.disabled).eq(false);
        expect(stateVariables["/g4/ti"].stateValues.value).eq("hello");

        // type in first textInput
        await updateTextInputValue({ text: "bye", name: "/g/ti", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g/ti"].stateValues.value).eq("bye");
        expect(stateVariables["/g2/ti"].stateValues.value).eq("bye");
        expect(stateVariables["/g3/ti"].stateValues.value).eq("bye");
        expect(stateVariables["/g4/ti"].stateValues.value).eq("hello");

        // attempting to type in second textInput doesn't work
        await updateTextInputValue({ text: "nope", name: "/g2/ti", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g/ti"].stateValues.value).eq("bye");
        expect(stateVariables["/g2/ti"].stateValues.value).eq("bye");
        expect(stateVariables["/g3/ti"].stateValues.value).eq("bye");
        expect(stateVariables["/g4/ti"].stateValues.value).eq("hello");

        // type in third textInput
        await updateTextInputValue({ text: "this", name: "/g3/ti", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g/ti"].stateValues.value).eq("this");
        expect(stateVariables["/g2/ti"].stateValues.value).eq("this");
        expect(stateVariables["/g3/ti"].stateValues.value).eq("this");
        expect(stateVariables["/g4/ti"].stateValues.value).eq("hello");

        // type in fourth textInput
        await updateTextInputValue({ text: "that", name: "/g4/ti", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g/ti"].stateValues.value).eq("this");
        expect(stateVariables["/g2/ti"].stateValues.value).eq("this");
        expect(stateVariables["/g3/ti"].stateValues.value).eq("this");
        expect(stateVariables["/g4/ti"].stateValues.value).eq("that");
    });

    it("change rendered", async () => {
        let core = await createTestCore({
            doenetML: `
      <p><booleanInput name="ren1"><label>rendered 1</label></booleanInput></p>
      <group name="g1" rendered="$ren1" newNamespace>
        <p name="p">Hello</p>
      </group>

      <p><booleanInput name="ren2" prefill="true"><label>rendered 2</label></booleanInput></p>
      <group name="g2" rendered="$ren2" newNamespace>
        <p name="p">Bye</p>
      </group>
      
      $g1{name="g1a"}
      $g2{name="g2a"}

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g1/p"]).eq(undefined);
        expect(stateVariables["/g1a/p"]).eq(undefined);
        expect(stateVariables["/g2/p"].stateValues.text).eq("Bye");
        expect(stateVariables["/g2a/p"].stateValues.text).eq("Bye");

        await updateBooleanInputValue({ boolean: true, name: "/ren1", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g1/p"].stateValues.text).eq("Hello");
        expect(stateVariables["/g1a/p"].stateValues.text).eq("Hello");
        expect(stateVariables["/g2/p"].stateValues.text).eq("Bye");
        expect(stateVariables["/g2a/p"].stateValues.text).eq("Bye");

        await updateBooleanInputValue({ boolean: false, name: "/ren2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g1/p"].stateValues.text).eq("Hello");
        expect(stateVariables["/g1a/p"].stateValues.text).eq("Hello");
        isUndefinedOrInactive(stateVariables["/g2/p"]);
        isUndefinedOrInactive(stateVariables["/g2a/p"]);

        await updateBooleanInputValue({ boolean: false, name: "/ren1", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        isUndefinedOrInactive(stateVariables["/g1/p"]);
        isUndefinedOrInactive(stateVariables["/g1a/p"]);
        isUndefinedOrInactive(stateVariables["/g2/p"]);
        isUndefinedOrInactive(stateVariables["/g2a/p"]);

        await updateBooleanInputValue({ boolean: true, name: "/ren2", core });
        stateVariables = await core.returnAllStateVariables(false, true);
        isUndefinedOrInactive(stateVariables["/g1/p"]);
        isUndefinedOrInactive(stateVariables["/g1a/p"]);
        expect(stateVariables["/g2/p"].stateValues.text).eq("Bye");
        expect(stateVariables["/g2a/p"].stateValues.text).eq("Bye");
    });
});
