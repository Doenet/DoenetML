import { describe, expect, it, vi } from "vitest";
import { createTestCore, returnAllStateVariables } from "../utils/test-core";
import {
    updateMathInputValue,
    updateTextInputValue,
    updateValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Warning Tests", async () => {
    it("Deprecated attributes", async () => {
        let core = await createTestCore({
            doenetML: `
<section suppressAutoName>
  <graph xLabel="a">
    <regularPolygon nSides="4" name="rp" />
    <regularPolygon copySource="rp" nSides="6" />
    $rp{nSides="8"}
  </graph>
  <answer maximumNumberOfAttempts="2">
    <choiceInput randomizeOrder>
      <choice>yes</choice>
      <choice>no</choice>
    </choiceInput>
  </answer>
</section>
    `,
        });

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(7);

        expect(errorWarnings.warnings[0].message).contain(
            "Attribute suppressAutoName is deprecated. It is ignored.",
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(14);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(10);
        expect(errorWarnings.warnings[0].level).eq(1);

        expect(errorWarnings.warnings[1].message).contain(
            "Attribute xLabel of component type graph is deprecated. It is ignored.",
        );
        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(3);
        expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(7);
        expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(10);

        expect(errorWarnings.warnings[2].message).contain(
            "Attribute nSides is deprecated. Use numSides instead.",
        );
        expect(errorWarnings.warnings[2].level).eq(1);
        expect(errorWarnings.warnings[2].doenetMLrange.lineBegin).eq(4);
        expect(errorWarnings.warnings[2].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[2].doenetMLrange.lineEnd).eq(4);
        expect(errorWarnings.warnings[2].doenetMLrange.charEnd).eq(43);

        expect(errorWarnings.warnings[3].message).contain(
            "Attribute nSides is deprecated. Use numSides instead.",
        );
        expect(errorWarnings.warnings[3].level).eq(1);
        expect(errorWarnings.warnings[3].doenetMLrange.lineBegin).eq(5);
        expect(errorWarnings.warnings[3].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[3].doenetMLrange.lineEnd).eq(5);
        expect(errorWarnings.warnings[3].doenetMLrange.charEnd).eq(49);

        expect(errorWarnings.warnings[6].message).contain(
            "Attribute nSides is deprecated. Use numSides instead.",
        );
        expect(errorWarnings.warnings[6].level).eq(1);
        expect(errorWarnings.warnings[6].doenetMLrange.lineBegin).eq(6);
        expect(errorWarnings.warnings[6].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[6].doenetMLrange.lineEnd).eq(6);
        expect(errorWarnings.warnings[6].doenetMLrange.charEnd).eq(19);

        expect(errorWarnings.warnings[4].message).contain(
            "Attribute maximumNumberOfAttempts of component type answer is deprecated. Use maxNumAttempts instead.",
        );
        expect(errorWarnings.warnings[4].level).eq(1);
        expect(errorWarnings.warnings[4].doenetMLrange.lineBegin).eq(8);
        expect(errorWarnings.warnings[4].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[4].doenetMLrange.lineEnd).eq(13);
        expect(errorWarnings.warnings[4].doenetMLrange.charEnd).eq(11);

        expect(errorWarnings.warnings[5].message).contain(
            "Attribute randomizeOrder is deprecated. Use shuffleOrder instead.",
        );
        expect(errorWarnings.warnings[5].level).eq(1);
        expect(errorWarnings.warnings[5].doenetMLrange.lineBegin).eq(9);
        expect(errorWarnings.warnings[5].doenetMLrange.charBegin).eq(5);
        expect(errorWarnings.warnings[5].doenetMLrange.lineEnd).eq(12);
        expect(errorWarnings.warnings[5].doenetMLrange.charEnd).eq(18);
    });

    it("Deprecated properties", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
  <regularPolygon numSides="4" name="rp" />
</graph>
<number copySource="rp.nSides" name="ns" />

    `,
        });

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            "Property nSides is deprecated. Use numSides instead.",
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(5);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(5);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(43);
    });

    it("From state variable definitions", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
  <line name="l1" through="(1,2) (3,4)" />
  <line name="l2" through="(1,2) (-3,4)" />
  <line name="l3" through="(-1,2) (-3,4)" />
  <angle betweenLines="$l1 $l2 $l3" name="alpha" />
</graph>
<math copySource="alpha" name="alpha2" />

    `,
        });

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(2);

        expect(errorWarnings.warnings[0].message).contain(
            "Cannot define an angle between 3 lines",
        );
        expect(errorWarnings.warnings[0].level).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(6);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(6);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(51);

        expect(errorWarnings.warnings[1].message).contain(
            "Cannot define an angle between 3 lines",
        );
        expect(errorWarnings.warnings[1].level).eq(2);
        expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(6);
        expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(6);
        expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(51);
    });

    it("From state variable inverse definitions", async () => {
        let core = await createTestCore({
            doenetML: `
  <circle through="(a,b) (c,d)" name="c" />

  <mathInput name="mi">$c.radius</mathInput>
    `,
        });

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            "Haven't implemented <circle> through 2 points in case where the points don't have numerical values",
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(43);

        // try to change radius
        await updateMathInputValue({ latex: "1", name: "/mi", core });

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(2);

        expect(errorWarnings.warnings[0].message).contain(
            "Haven't implemented <circle> through 2 points in case where the points don't have numerical values",
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(43);

        expect(errorWarnings.warnings[1].message).contain(
            "Cannot change radius of circle with non-numerical through points",
        );
        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(2);
        expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(43);
    });

    it("From validating attributes", async () => {
        let core = await createTestCore({
            doenetML: `
  <sequence type="bad" />

  <math name="m1">sin(x)</math>
  <math format="new1" name="m2">sin(x)</math>
  <math name="m3" copySource="m1" />
  <math name="m4" format="new2" copySource="m1" />
  <math name="m5" format="latex" copySource="m1" />
  <math name="m6" copySource="m2" />
  <math name="m7" format="new3" copySource="m2" />
  <math name="m8" format="latex" copySource="m2" />


  <textInput name="ti1">$m1.format</textInput>
  <textInput name="ti2">$m2.format</textInput>
  <textInput name="ti3">$m3.format</textInput>
  <textInput name="ti4">$m4.format</textInput>
  <textInput name="ti5">$m5.format</textInput>
  <textInput name="ti6">$m6.format</textInput>
  <textInput name="ti7">$m7.format</textInput>
  <textInput name="ti8">$m8.format</textInput>
    `,
        });

        let stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m1"].stateValues.text).eq("sin(x)");
        expect(stateVariables["/m2"].stateValues.text).eq("sin(x)");
        expect(stateVariables["/m3"].stateValues.text).eq("sin(x)");
        expect(stateVariables["/m4"].stateValues.text).eq("sin(x)");
        expect(stateVariables["/m5"].stateValues.text).eq("s i n x");
        expect(stateVariables["/m6"].stateValues.text).eq("sin(x)");
        expect(stateVariables["/m7"].stateValues.text).eq("sin(x)");
        expect(stateVariables["/m8"].stateValues.text).eq("s i n x");

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(5);

        expect(errorWarnings.warnings[0].message).contain(
            "Invalid value new1 for attribute format",
        );
        expect(errorWarnings.warnings[0].level).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(5);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(5);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(45);

        expect(errorWarnings.warnings[1].message).contain(
            "Invalid value bad for attribute type",
        );
        expect(errorWarnings.warnings[1].level).eq(2);
        expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(2);
        expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(25);

        expect(errorWarnings.warnings[2].message).contain(
            "Invalid value new2 for attribute format",
        );
        expect(errorWarnings.warnings[2].level).eq(2);
        expect(errorWarnings.warnings[2].doenetMLrange.lineBegin).eq(7);
        expect(errorWarnings.warnings[2].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[2].doenetMLrange.lineEnd).eq(7);
        expect(errorWarnings.warnings[2].doenetMLrange.charEnd).eq(50);

        expect(errorWarnings.warnings[3].message).contain(
            "Invalid value new1 for attribute format",
        );
        expect(errorWarnings.warnings[3].level).eq(2);
        expect(errorWarnings.warnings[3].doenetMLrange.lineBegin).eq(9);
        expect(errorWarnings.warnings[3].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[3].doenetMLrange.lineEnd).eq(9);
        expect(errorWarnings.warnings[3].doenetMLrange.charEnd).eq(36);

        expect(errorWarnings.warnings[4].message).contain(
            "Invalid value new3 for attribute format",
        );
        expect(errorWarnings.warnings[4].level).eq(2);
        expect(errorWarnings.warnings[4].doenetMLrange.lineBegin).eq(10);
        expect(errorWarnings.warnings[4].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[4].doenetMLrange.lineEnd).eq(10);
        expect(errorWarnings.warnings[4].doenetMLrange.charEnd).eq(50);

        // try to change format
        await updateTextInputValue({ text: "try1", name: "/ti1", core });
        await updateTextInputValue({ text: "try2", name: "/ti2", core });
        await updateTextInputValue({ text: "try3", name: "/ti3", core });
        await updateTextInputValue({ text: "try4", name: "/ti4", core });
        await updateTextInputValue({ text: "try5", name: "/ti5", core });
        await updateTextInputValue({ text: "try6", name: "/ti6", core });
        await updateTextInputValue({ text: "try7", name: "/ti7", core });
        await updateTextInputValue({ text: "try8", name: "/ti8", core });

        stateVariables = await returnAllStateVariables(core);
        expect(stateVariables["/m1"].stateValues.text).eq("sin(x)");
        expect(stateVariables["/m2"].stateValues.text).eq("sin(x)");
        expect(stateVariables["/m3"].stateValues.text).eq("sin(x)");
        expect(stateVariables["/m4"].stateValues.text).eq("sin(x)");
        expect(stateVariables["/m5"].stateValues.text).eq("sin(x)");
        expect(stateVariables["/m6"].stateValues.text).eq("sin(x)");
        expect(stateVariables["/m7"].stateValues.text).eq("sin(x)");
        expect(stateVariables["/m8"].stateValues.text).eq("sin(x)");

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(17);

        expect(errorWarnings.warnings[5].message).contain(
            "Invalid value try1 for attribute format",
        );
        expect(errorWarnings.warnings[5].doenetMLrange.lineBegin).eq(4);

        expect(errorWarnings.warnings[6].message).contain(
            "Invalid value new2 for attribute format",
        );
        expect(errorWarnings.warnings[6].doenetMLrange.lineBegin).eq(7);

        expect(errorWarnings.warnings[7].message).contain(
            "Invalid value try2 for attribute format",
        );
        expect(errorWarnings.warnings[7].doenetMLrange.lineBegin).eq(5);

        expect(errorWarnings.warnings[8].message).contain(
            "Invalid value try2 for attribute format",
        );
        expect(errorWarnings.warnings[8].doenetMLrange.lineBegin).eq(9);

        expect(errorWarnings.warnings[9].message).contain(
            "Invalid value try3 for attribute format",
        );
        expect(errorWarnings.warnings[9].doenetMLrange.lineBegin).eq(6);

        expect(errorWarnings.warnings[10].message).contain(
            "Invalid value new2 for attribute format",
        );
        expect(errorWarnings.warnings[10].doenetMLrange.lineBegin).eq(7);

        expect(errorWarnings.warnings[11].message).contain(
            "Invalid value try4 for attribute format",
        );
        expect(errorWarnings.warnings[11].doenetMLrange.lineBegin).eq(7);

        expect(errorWarnings.warnings[12].message).contain(
            "Invalid value try5 for attribute format",
        );
        expect(errorWarnings.warnings[12].doenetMLrange.lineBegin).eq(8);

        expect(errorWarnings.warnings[13].message).contain(
            "Invalid value try6 for attribute format",
        );
        expect(errorWarnings.warnings[13].doenetMLrange.lineBegin).eq(5);

        expect(errorWarnings.warnings[14].message).contain(
            "Invalid value try6 for attribute format",
        );
        expect(errorWarnings.warnings[14].doenetMLrange.lineBegin).eq(9);

        expect(errorWarnings.warnings[15].message).contain(
            "Invalid value try7 for attribute format",
        );
        expect(errorWarnings.warnings[15].doenetMLrange.lineBegin).eq(10);

        expect(errorWarnings.warnings[16].message).contain(
            "Invalid value try8 for attribute format",
        );
        expect(errorWarnings.warnings[16].doenetMLrange.lineBegin).eq(11);
    });

    it("From action", async () => {
        let core = await createTestCore({
            doenetML: `
  <number name="n">1</number>
  <updateValue target="n.bad" newValue="3" name="uv" />

    `,
        });

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(0);

        // try update value action
        await updateValue({ name: "/uv", core });

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            `Invalid target for <updateValue>: cannot find a state variable named "bad" on a <number>`,
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(3);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(3);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(55);
    });

    it("Invalid children", async () => {
        let core = await createTestCore({
            doenetML: `
  <p name="p1"><graph /></p>

  <p name="p2">Hello</p>

  <p name="p3" copySource="p2"><graph/><p/></p>

  <p name="p4" copySource="p1"><figure /></p>

    `,
        });

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(3);

        expect(errorWarnings.warnings[0].message).contain(
            `Invalid children for <p>`,
        );
        expect(errorWarnings.warnings[0].message).contain(
            `Found invalid children: <graph>`,
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(28);

        expect(errorWarnings.warnings[1].message).contain(
            `Invalid children for <p>`,
        );
        expect(errorWarnings.warnings[1].message).contain(
            `Found invalid children: <graph>, <p>`,
        );
        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].doenetMLrange.lineBegin).eq(6);
        expect(errorWarnings.warnings[1].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[1].doenetMLrange.lineEnd).eq(6);
        expect(errorWarnings.warnings[1].doenetMLrange.charEnd).eq(47);

        expect(errorWarnings.warnings[2].message).contain(
            `Invalid children for <p>`,
        );
        expect(errorWarnings.warnings[2].message).contain(
            `Found invalid children: <graph>, <figure>`,
        );
        expect(errorWarnings.warnings[2].level).eq(1);
        expect(errorWarnings.warnings[2].doenetMLrange.lineBegin).eq(8);
        expect(errorWarnings.warnings[2].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[2].doenetMLrange.lineEnd).eq(8);
        expect(errorWarnings.warnings[2].doenetMLrange.charEnd).eq(45);
    });

    it("Invalid string child", async () => {
        let core = await createTestCore({
            doenetML: `
  <selectFromSequence>string!</selectFromSequence>
    `,
        });

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            `Invalid children for <selectFromSequence>`,
        );
        expect(errorWarnings.warnings[0].message).contain(
            `Found invalid children: string`,
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].doenetMLrange.lineBegin).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charBegin).eq(3);
        expect(errorWarnings.warnings[0].doenetMLrange.lineEnd).eq(2);
        expect(errorWarnings.warnings[0].doenetMLrange.charEnd).eq(50);
    });

    it("No erroneous attribute warning in hidden component", async () => {
        let core = await createTestCore({
            doenetML: `
          <boolean name="hide">true</boolean>
    
          <section hide="$hide">
            <p hide='$hide'>double hide</p>
          </section>
        `,
        });

        let errorWarnings = core.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(0);
    });
});
