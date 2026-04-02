import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import {
    updateMathInputValue,
    updateTextInputValue,
    updateValue,
} from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Warning Tests @group4", async () => {
    // TODO: re-enable these test once deprecations are working again. See issue #484.
    it.skip("Deprecated attributes", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<section suppressAutoName>
  <graph xLabel="a">
    <regularPolygon nSides="4" name="rp" />
    <regularPolygon extend="$rp" nSides="6" />
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

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(7);
        expect(diagnosticsByType.infos.length).eq(0);

        expect(diagnosticsByType.warnings[0].message).contain(
            "Attribute suppressAutoName is deprecated. It is ignored.",
        );
        expect(diagnosticsByType.warnings[0].position.start.line).eq(2);
        expect(diagnosticsByType.warnings[0].position.start.column).eq(1);
        expect(diagnosticsByType.warnings[0].position.end.line).eq(14);
        expect(diagnosticsByType.warnings[0].position.end.column).eq(10);

        expect(diagnosticsByType.warnings[1].message).contain(
            "Attribute xLabel of component type graph is deprecated. It is ignored.",
        );
        expect(diagnosticsByType.warnings[1].position.start.line).eq(3);
        expect(diagnosticsByType.warnings[1].position.start.column).eq(3);
        expect(diagnosticsByType.warnings[1].position.end.line).eq(7);
        expect(diagnosticsByType.warnings[1].position.end.column).eq(10);

        expect(diagnosticsByType.warnings[2].message).contain(
            "Attribute nSides is deprecated. Use numSides instead.",
        );
        expect(diagnosticsByType.warnings[2].position.start.line).eq(4);
        expect(diagnosticsByType.warnings[2].position.start.column).eq(5);
        expect(diagnosticsByType.warnings[2].position.end.line).eq(4);
        expect(diagnosticsByType.warnings[2].position.end.column).eq(43);

        expect(diagnosticsByType.warnings[3].message).contain(
            "Attribute nSides is deprecated. Use numSides instead.",
        );
        expect(diagnosticsByType.warnings[3].position.start.line).eq(5);
        expect(diagnosticsByType.warnings[3].position.start.column).eq(5);
        expect(diagnosticsByType.warnings[3].position.end.line).eq(5);
        expect(diagnosticsByType.warnings[3].position.end.column).eq(49);

        expect(diagnosticsByType.warnings[6].message).contain(
            "Attribute nSides is deprecated. Use numSides instead.",
        );
        expect(diagnosticsByType.warnings[6].position.start.line).eq(6);
        expect(diagnosticsByType.warnings[6].position.start.column).eq(5);
        expect(diagnosticsByType.warnings[6].position.end.line).eq(6);
        expect(diagnosticsByType.warnings[6].position.end.column).eq(19);

        expect(diagnosticsByType.warnings[4].message).contain(
            "Attribute maximumNumberOfAttempts of component type answer is deprecated. Use maxNumAttempts instead.",
        );
        expect(diagnosticsByType.warnings[4].position.start.line).eq(8);
        expect(diagnosticsByType.warnings[4].position.start.column).eq(3);
        expect(diagnosticsByType.warnings[4].position.end.line).eq(13);
        expect(diagnosticsByType.warnings[4].position.end.column).eq(11);

        expect(diagnosticsByType.warnings[5].message).contain(
            "Attribute randomizeOrder is deprecated. Use shuffleOrder instead.",
        );
        expect(diagnosticsByType.warnings[5].position.start.line).eq(9);
        expect(diagnosticsByType.warnings[5].position.start.column).eq(5);
        expect(diagnosticsByType.warnings[5].position.end.line).eq(12);
        expect(diagnosticsByType.warnings[5].position.end.column).eq(18);
    });

    it.skip("Deprecated properties", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph>
  <regularPolygon numSides="4" name="rp" />
</graph>
<number extend="$rp.nSides" name="ns" />

    `,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(1);
        expect(diagnosticsByType.infos.length).eq(0);

        expect(diagnosticsByType.warnings[0].message).contain(
            "Property nSides is deprecated. Use numSides instead.",
        );
        expect(diagnosticsByType.warnings[0].position.start.line).eq(5);
        expect(diagnosticsByType.warnings[0].position.start.column).eq(1);
        expect(diagnosticsByType.warnings[0].position.end.line).eq(5);
        expect(diagnosticsByType.warnings[0].position.end.column).eq(43);
    });

    it("Deprecated selectPrimeNumbers attributes", async () => {
        const { core } = await createTestCore({
            doenetML: `
<selectPrimeNumbers minValue="10" maxValue="50" />
            `,
        });

        const diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(2);

        expect(
            diagnosticsByType.warnings.some((warning) =>
                warning.message.includes(
                    "Attribute `minValue` on `<selectPrimeNumbers>` is deprecated; use `from` instead.",
                ),
            ),
        ).eq(true);

        expect(
            diagnosticsByType.warnings.some((warning) =>
                warning.message.includes(
                    "Attribute `maxValue` on `<selectPrimeNumbers>` is deprecated; use `to` instead.",
                ),
            ),
        ).eq(true);
    });

    it("Deprecated samplePrimeNumbers attributes", async () => {
        const { core } = await createTestCore({
            doenetML: `
<samplePrimeNumbers minValue="10" maxValue="50" />
            `,
        });

        const diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(2);

        expect(
            diagnosticsByType.warnings.some((warning) =>
                warning.message.includes(
                    "Attribute `minValue` on `<samplePrimeNumbers>` is deprecated; use `from` instead.",
                ),
            ),
        ).eq(true);

        expect(
            diagnosticsByType.warnings.some((warning) =>
                warning.message.includes(
                    "Attribute `maxValue` on `<samplePrimeNumbers>` is deprecated; use `to` instead.",
                ),
            ),
        ).eq(true);
    });

    it("From state variable definitions", async () => {
        let { core } = await createTestCore({
            doenetML: `
<graph><shortDescription>A graph with warnings</shortDescription>
  <line name="l1" through="(1,2) (3,4)" />
  <line name="l2" through="(1,2) (-3,4)" />
  <line name="l3" through="(-1,2) (-3,4)" />
  <angle betweenLines="$l1 $l2 $l3" name="alpha" />
</graph>
<math extend="$alpha" name="alpha2" />

    `,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.infos.length).eq(1);

        expect(diagnosticsByType.infos[0].message).contain(
            "Cannot define an angle between 3 lines",
        );
        expect(diagnosticsByType.infos[0].type).eq("info");
        expect(diagnosticsByType.infos[0].position.start.line).eq(6);
        expect(diagnosticsByType.infos[0].position.start.column).eq(3);
        expect(diagnosticsByType.infos[0].position.end.line).eq(6);
        expect(diagnosticsByType.infos[0].position.end.column).eq(52);
    });

    it("From state variable inverse definitions", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <circle through="(a,b) (c,d)" name="c" />

  <mathInput name="mi"><shortDescription>change radius</shortDescription>$c.radius</mathInput>
    `,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(1);
        expect(diagnosticsByType.infos.length).eq(0);

        expect(diagnosticsByType.warnings[0].message).contain(
            "Haven't implemented `<circle>` through 2 points in case where the points don't have numerical values",
        );
        expect(diagnosticsByType.warnings[0].position.start.line).eq(2);
        expect(diagnosticsByType.warnings[0].position.start.column).eq(3);
        expect(diagnosticsByType.warnings[0].position.end.line).eq(2);
        expect(diagnosticsByType.warnings[0].position.end.column).eq(44);

        // try to change radius
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });

        diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(2);
        expect(diagnosticsByType.infos.length).eq(0);

        expect(diagnosticsByType.warnings[0].message).contain(
            "Haven't implemented `<circle>` through 2 points in case where the points don't have numerical values",
        );
        expect(diagnosticsByType.warnings[0].position.start.line).eq(2);
        expect(diagnosticsByType.warnings[0].position.start.column).eq(3);
        expect(diagnosticsByType.warnings[0].position.end.line).eq(2);
        expect(diagnosticsByType.warnings[0].position.end.column).eq(44);

        expect(diagnosticsByType.warnings[1].message).contain(
            "Cannot change radius of circle with non-numerical through points",
        );
        expect(diagnosticsByType.warnings[1].position.start.line).eq(2);
        expect(diagnosticsByType.warnings[1].position.start.column).eq(3);
        expect(diagnosticsByType.warnings[1].position.end.line).eq(2);
        expect(diagnosticsByType.warnings[1].position.end.column).eq(44);
    });

    it("From validating attributes", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <sequence type="bad" />

  <math name="m1">sin(x)</math>
  <math format="new1" name="m2">sin(x)</math>
  <math name="m3" extend="$m1" />
  <math name="m4" format="new2" extend="$m1" />
  <math name="m5" format="latex" extend="$m1" />
  <math name="m6" extend="$m2" />
  <math name="m7" format="new3" extend="$m2" />
  <math name="m8" format="latex" extend="$m2" />


  <textInput name="ti1"><shortDescription>change format</shortDescription>$m1.format</textInput>
  <textInput name="ti2"><shortDescription>change format</shortDescription>$m2.format</textInput>
  <textInput name="ti3"><shortDescription>change format</shortDescription>$m3.format</textInput>
  <textInput name="ti4"><shortDescription>change format</shortDescription>$m4.format</textInput>
  <textInput name="ti5"><shortDescription>change format</shortDescription>$m5.format</textInput>
  <textInput name="ti6"><shortDescription>change format</shortDescription>$m6.format</textInput>
  <textInput name="ti7"><shortDescription>change format</shortDescription>$m7.format</textInput>
  <textInput name="ti8"><shortDescription>change format</shortDescription>$m8.format</textInput>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.text,
        ).eq("sin(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.text,
        ).eq("sin(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.text,
        ).eq("sin(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.text,
        ).eq("sin(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m5")].stateValues.text,
        ).eq("s i n x");
        expect(
            stateVariables[await resolvePathToNodeIdx("m6")].stateValues.text,
        ).eq("sin(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m7")].stateValues.text,
        ).eq("sin(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m8")].stateValues.text,
        ).eq("s i n x");

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.infos.length).eq(5);

        expect(diagnosticsByType.infos[0].message).contain(
            "Invalid value `new1` for attribute `format`",
        );
        expect(diagnosticsByType.infos[0].type).eq("info");
        expect(diagnosticsByType.infos[0].position.start.line).eq(5);
        expect(diagnosticsByType.infos[0].position.start.column).eq(3);
        expect(diagnosticsByType.infos[0].position.end.line).eq(5);
        expect(diagnosticsByType.infos[0].position.end.column).eq(46);

        expect(diagnosticsByType.infos[1].message).contain(
            "Invalid value `bad` for attribute `type`",
        );
        expect(diagnosticsByType.infos[1].type).eq("info");
        expect(diagnosticsByType.infos[1].position.start.line).eq(2);
        expect(diagnosticsByType.infos[1].position.start.column).eq(3);
        expect(diagnosticsByType.infos[1].position.end.line).eq(2);
        expect(diagnosticsByType.infos[1].position.end.column).eq(26);

        expect(diagnosticsByType.infos[2].message).contain(
            "Invalid value `new2` for attribute `format`",
        );
        expect(diagnosticsByType.infos[2].type).eq("info");
        expect(diagnosticsByType.infos[2].position.start.line).eq(7);
        expect(diagnosticsByType.infos[2].position.start.column).eq(3);
        expect(diagnosticsByType.infos[2].position.end.line).eq(7);
        expect(diagnosticsByType.infos[2].position.end.column).eq(48);

        expect(diagnosticsByType.infos[3].message).contain(
            "Invalid value `new1` for attribute `format`",
        );
        expect(diagnosticsByType.infos[3].type).eq("info");
        expect(diagnosticsByType.infos[3].position.start.line).eq(9);
        expect(diagnosticsByType.infos[3].position.start.column).eq(3);
        expect(diagnosticsByType.infos[3].position.end.line).eq(9);
        expect(diagnosticsByType.infos[3].position.end.column).eq(34);

        expect(diagnosticsByType.infos[4].message).contain(
            "Invalid value `new3` for attribute `format`",
        );
        expect(diagnosticsByType.infos[4].type).eq("info");
        expect(diagnosticsByType.infos[4].position.start.line).eq(10);
        expect(diagnosticsByType.infos[4].position.start.column).eq(3);
        expect(diagnosticsByType.infos[4].position.end.line).eq(10);
        expect(diagnosticsByType.infos[4].position.end.column).eq(48);

        // try to change format
        await updateTextInputValue({
            text: "try1",
            componentIdx: await resolvePathToNodeIdx("ti1"),
            core,
        });
        await updateTextInputValue({
            text: "try2",
            componentIdx: await resolvePathToNodeIdx("ti2"),
            core,
        });
        await updateTextInputValue({
            text: "try3",
            componentIdx: await resolvePathToNodeIdx("ti3"),
            core,
        });
        await updateTextInputValue({
            text: "try4",
            componentIdx: await resolvePathToNodeIdx("ti4"),
            core,
        });
        await updateTextInputValue({
            text: "try5",
            componentIdx: await resolvePathToNodeIdx("ti5"),
            core,
        });
        await updateTextInputValue({
            text: "try6",
            componentIdx: await resolvePathToNodeIdx("ti6"),
            core,
        });
        await updateTextInputValue({
            text: "try7",
            componentIdx: await resolvePathToNodeIdx("ti7"),
            core,
        });
        await updateTextInputValue({
            text: "try8",
            componentIdx: await resolvePathToNodeIdx("ti8"),
            core,
        });

        diagnosticsByType = getDiagnosticsByType(core);

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].stateValues.text,
        ).eq("sin(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m2")].stateValues.text,
        ).eq("sin(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m3")].stateValues.text,
        ).eq("sin(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m4")].stateValues.text,
        ).eq("sin(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m5")].stateValues.text,
        ).eq("sin(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m6")].stateValues.text,
        ).eq("sin(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m7")].stateValues.text,
        ).eq("sin(x)");
        expect(
            stateVariables[await resolvePathToNodeIdx("m8")].stateValues.text,
        ).eq("sin(x)");

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.infos.length).eq(15);

        expect(diagnosticsByType.infos[5].message).contain(
            "Invalid value `try1` for attribute `format`",
        );
        expect(diagnosticsByType.infos[5].position.start.line).eq(4);

        expect(diagnosticsByType.infos[6].message).contain(
            "Invalid value `try2` for attribute `format`",
        );
        expect(diagnosticsByType.infos[6].position.start.line).eq(5);

        expect(diagnosticsByType.infos[7].message).contain(
            "Invalid value `try2` for attribute `format`",
        );
        expect(diagnosticsByType.infos[7].position.start.line).eq(9);

        expect(diagnosticsByType.infos[8].message).contain(
            "Invalid value `try3` for attribute `format`",
        );
        expect(diagnosticsByType.infos[8].position.start.line).eq(6);

        expect(diagnosticsByType.infos[9].message).contain(
            "Invalid value `try4` for attribute `format`",
        );
        expect(diagnosticsByType.infos[9].position.start.line).eq(7);

        expect(diagnosticsByType.infos[10].message).contain(
            "Invalid value `try5` for attribute `format`",
        );
        expect(diagnosticsByType.infos[10].position.start.line).eq(8);

        expect(diagnosticsByType.infos[11].message).contain(
            "Invalid value `try6` for attribute `format`",
        );
        expect(diagnosticsByType.infos[11].position.start.line).eq(5);

        expect(diagnosticsByType.infos[12].message).contain(
            "Invalid value `try6` for attribute `format`",
        );
        expect(diagnosticsByType.infos[12].position.start.line).eq(9);

        expect(diagnosticsByType.infos[13].message).contain(
            "Invalid value `try7` for attribute `format`",
        );
        expect(diagnosticsByType.infos[13].position.start.line).eq(10);

        expect(diagnosticsByType.infos[14].message).contain(
            "Invalid value `try8` for attribute `format`",
        );
        expect(diagnosticsByType.infos[14].position.start.line).eq(11);
    });

    it("From action", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <number name="n">1</number>
  <updateValue target="$n.bad" newValue="3" name="uv" />

    `,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(0);

        // try update value action
        await updateValue({
            componentIdx: await resolvePathToNodeIdx("uv"),
            core,
        });

        diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(1);
        expect(diagnosticsByType.infos.length).eq(0);

        expect(diagnosticsByType.warnings[0].message).contain(
            `Invalid target for \`<updateValue>\`: cannot find a state variable named "bad" on a \`<number>\``,
        );
        expect(diagnosticsByType.warnings[0].position.start.line).eq(3);
        expect(diagnosticsByType.warnings[0].position.start.column).eq(3);
        expect(diagnosticsByType.warnings[0].position.end.line).eq(3);
        expect(diagnosticsByType.warnings[0].position.end.column).eq(57);
    });

    it("Invalid children", async () => {
        let { core } = await createTestCore({
            doenetML: `
  <p name="p1"><graph><shortDescription>A graph</shortDescription></graph></p>

  <p name="p2">Hello</p>

  <p name="p3" extend="$p2"><graph><shortDescription>Another graph</shortDescription></graph><p/></p>

  <p name="p4" extend="$p1"><figure /></p>

    `,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(3);
        expect(diagnosticsByType.infos.length).eq(0);

        expect(diagnosticsByType.warnings[0].message).contain(
            `Invalid children for \`<p>\``,
        );
        expect(diagnosticsByType.warnings[0].message).contain(
            `Found invalid children: \`<graph>\``,
        );
        expect(diagnosticsByType.warnings[0].position.start.line).eq(2);
        expect(diagnosticsByType.warnings[0].position.start.column).eq(3);
        expect(diagnosticsByType.warnings[0].position.end.line).eq(2);
        expect(diagnosticsByType.warnings[0].position.end.column).eq(79);

        expect(diagnosticsByType.warnings[1].message).contain(
            `Invalid children for \`<p>\``,
        );
        expect(diagnosticsByType.warnings[1].message).contain(
            `Found invalid children: \`<graph>\`, \`<p>\``,
        );
        expect(diagnosticsByType.warnings[1].position.start.line).eq(6);
        expect(diagnosticsByType.warnings[1].position.start.column).eq(3);
        expect(diagnosticsByType.warnings[1].position.end.line).eq(6);
        expect(diagnosticsByType.warnings[1].position.end.column).eq(102);

        expect(diagnosticsByType.warnings[2].message).contain(
            `Invalid children for \`<p>\``,
        );
        expect(diagnosticsByType.warnings[2].message).contain(
            `Found invalid children: \`<graph>\`, \`<figure>\``,
        );
        expect(diagnosticsByType.warnings[2].position.start.line).eq(8);
        expect(diagnosticsByType.warnings[2].position.start.column).eq(3);
        expect(diagnosticsByType.warnings[2].position.end.line).eq(8);
        expect(diagnosticsByType.warnings[2].position.end.column).eq(43);
    });

    it("Invalid string child", async () => {
        let { core } = await createTestCore({
            doenetML: `
  <selectFromSequence>string!</selectFromSequence>
    `,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(1);
        expect(diagnosticsByType.infos.length).eq(0);

        expect(diagnosticsByType.warnings[0].message).contain(
            `Invalid children for \`<selectFromSequence>\``,
        );
        expect(diagnosticsByType.warnings[0].message).contain(
            `Found invalid children: string`,
        );
        expect(diagnosticsByType.warnings[0].position.start.line).eq(2);
        expect(diagnosticsByType.warnings[0].position.start.column).eq(3);
        expect(diagnosticsByType.warnings[0].position.end.line).eq(2);
        expect(diagnosticsByType.warnings[0].position.end.column).eq(51);
    });

    it("No erroneous attribute warning in hidden component", async () => {
        let { core } = await createTestCore({
            doenetML: `
          <boolean name="hide">true</boolean>
    
          <section hide="$hide">
            <p hide='$hide'>double hide</p>
          </section>
        `,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.infos.length).eq(0);
    });

    it("Warning if omit $ in a reference attribute", async () => {
        let { core } = await createTestCore({
            doenetML: `
    <p>
        Numbers that add to 3:
        <mathInput name="n1"><shortDescription>first number</shortDescription></mathInput>
        <mathInput name="n2"><shortDescription>second number</shortDescription></mathInput>
        <answer name="sum3">
            <award referencesAreResponses="n1 n2"> <when>$n1+$n2=3</when> </award>
        </answer>
    </p>
        `,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(1);
        expect(diagnosticsByType.infos.length).eq(0);

        expect(diagnosticsByType.warnings[0].message).contain(
            `Invalid value \`n1 n2\` for attribute \`referencesAreResponses\``,
        );

        expect(diagnosticsByType.warnings[0].message).contain(
            `begin with a \`$\``,
        );
        expect(diagnosticsByType.warnings[0].position.start.line).eq(7);
        expect(diagnosticsByType.warnings[0].position.start.column).eq(20);
        expect(diagnosticsByType.warnings[0].position.end.line).eq(7);
        expect(diagnosticsByType.warnings[0].position.end.column).eq(50);
    });

    it("Invalid collect source errors", async () => {
        let { core } = await createTestCore({
            doenetML: `


    <collect from />
    <collect from="$__s" />


    `,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(3);
        expect(diagnosticsByType.infos.length).eq(0);

        expect(diagnosticsByType.warnings[0].message).contain(
            "No referent found for reference: `$__s`",
        );
        expect(diagnosticsByType.warnings[0].position.start.line).eq(5);
        expect(diagnosticsByType.warnings[0].position.start.column).eq(20);
        expect(diagnosticsByType.warnings[0].position.end.line).eq(5);
        expect(diagnosticsByType.warnings[0].position.end.column).eq(24);

        expect(diagnosticsByType.warnings[1].message).contain(
            "No source found for collect",
        );
        expect(diagnosticsByType.warnings[1].position.start.line).eq(4);
        expect(diagnosticsByType.warnings[1].position.start.column).eq(5);
        expect(diagnosticsByType.warnings[1].position.end.line).eq(4);
        expect(diagnosticsByType.warnings[1].position.end.column).eq(21);

        expect(diagnosticsByType.warnings[2].message).contain(
            "No source found for collect",
        );
        expect(diagnosticsByType.warnings[2].position.start.line).eq(5);
        expect(diagnosticsByType.warnings[2].position.start.column).eq(5);
        expect(diagnosticsByType.warnings[2].position.end.line).eq(5);
        expect(diagnosticsByType.warnings[2].position.end.column).eq(28);
    });

    it("Evaluate function with invalid domain", async () => {
        let { core } = await createTestCore({
            doenetML: `
<function name="f" domain="[0,2}"> x^2 </function>
<p>$$f(-1)</p>
    `,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(2);
        expect(diagnosticsByType.infos.length).eq(0);

        expect(diagnosticsByType.warnings[0].message).contain(
            "Insufficient dimensions for domain for function.",
        );
        expect(diagnosticsByType.warnings[0].position.start.line).eq(2);
        expect(diagnosticsByType.warnings[0].position.start.column).eq(20);
        expect(diagnosticsByType.warnings[0].position.end.line).eq(2);
        expect(diagnosticsByType.warnings[0].position.end.column).eq(34);

        expect(diagnosticsByType.warnings[1].message).contain(
            "Invalid format for attribute domain of `<function>`",
        );
        expect(diagnosticsByType.warnings[1].position.start.line).eq(2);
        expect(diagnosticsByType.warnings[1].position.start.column).eq(20);
        expect(diagnosticsByType.warnings[1].position.end.line).eq(2);
        expect(diagnosticsByType.warnings[1].position.end.column).eq(34);
    });

    it("Correctly get reference text when extend with an index", async () => {
        // Note: since extending with an index, the reference cannot be resolved in the first pass before core is initialized.
        // Instead, the warning is generated after core can determine what replacements the group has.
        // This tests that the correct text is used for the reference in that case, where the text has to be rebuilt from the source and position info.
        let { core } = await createTestCore({
            doenetML: `
<group name="g"></group>
<text extend="$g[1]" />
    `,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(1);
        expect(diagnosticsByType.infos.length).eq(0);

        expect(diagnosticsByType.warnings[0].message).contain(
            "No referent found for reference: `$g[1]`",
        );
        expect(diagnosticsByType.warnings[0].position.start.line).eq(3);
        expect(diagnosticsByType.warnings[0].position.start.column).eq(1);
        expect(diagnosticsByType.warnings[0].position.end.line).eq(3);
        expect(diagnosticsByType.warnings[0].position.end.column).eq(24);
    });

    it("Warn if simplifyOnCompare or expandOnCompare are specified with symbolicEquality set to false", async () => {
        let { core } = await createTestCore({
            doenetML: `
    <answer simplifyOnCompare><label>Enter x:</label>x</answer>
    <answer expandOnCompare><label>Enter x:</label>x</answer>
    <answer expandOnCompare simplifyOnCompare><label>Enter x:</label>x</answer>

    <answer symbolicEquality simplifyOnCompare><label>Enter x:</label>x</answer>
    <answer symbolicEquality expandOnCompare><label>Enter x:</label>x</answer>
    <answer symbolicEquality expandOnCompare simplifyOnCompare><label>Enter x:</label>x</answer>

    <answer><award simplifyOnCompare>x</award><label>Enter x:</label></answer>
    <answer><award expandOnCompare>x</award><label>Enter x:</label></answer>
    <answer><award expandOnCompare simplifyOnCompare>x</award><label>Enter x:</label></answer>

    <answer><award symbolicEquality simplifyOnCompare>x</award><label>Enter x:</label></answer>
    <answer><award symbolicEquality expandOnCompare>x</award><label>Enter x:</label></answer>
    <answer><award symbolicEquality expandOnCompare simplifyOnCompare>x</award><label>Enter x:</label></answer>

    <answer simplifyOnCompare><label>Enter x or y:</label><award>x</award><award>y</award></answer>
    <answer expandOnCompare><label>Enter x or y:</label><award>x</award><award>y</award></answer>
    <answer expandOnCompare simplifyOnCompare><label>Enter x or y:</label><award>x</award><award>y</award></answer>

    <answer symbolicEquality simplifyOnCompare><label>Enter x or y:</label><award>x</award><award>y</award></answer>
    <answer symbolicEquality expandOnCompare><label>Enter x or y:</label><award>x</award><award>y</award></answer>
    <answer symbolicEquality expandOnCompare simplifyOnCompare><label>Enter x or y:</label><award>x</award><award>y</award></answer>

    <boolean simplifyOnCompare>true</boolean>
    <boolean expandOnCompare>true</boolean>
    <boolean expandOnCompare simplifyOnCompare>true</boolean>

    <boolean symbolicEquality simplifyOnCompare>true</boolean>
    <boolean symbolicEquality expandOnCompare>true</boolean>
    <boolean symbolicEquality expandOnCompare simplifyOnCompare>true</boolean>


    `,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(12);
        expect(diagnosticsByType.infos.length).eq(0);

        const expectedErrorByLine: Record<string, string> = {
            2: "The simplifyOnCompare attribute",
            3: "The expandOnCompare attribute",
            4: "The expandOnCompare and simplifyOnCompare attributes",
            10: "The simplifyOnCompare attribute",
            11: "The expandOnCompare attribute",
            12: "The expandOnCompare and simplifyOnCompare attributes",
            18: "The simplifyOnCompare attribute",
            19: "The expandOnCompare attribute",
            20: "The expandOnCompare and simplifyOnCompare attributes",
            26: "The simplifyOnCompare attribute",
            27: "The expandOnCompare attribute",
            28: "The expandOnCompare and simplifyOnCompare attributes",
        };

        for (const lineNum in expectedErrorByLine) {
            const expectedError = expectedErrorByLine[lineNum];
            const warning = diagnosticsByType.warnings.find(
                (warning) => warning.position.start.line === parseInt(lineNum),
            );
            expect(warning!.message).toContain(
                `${expectedError} will have no effect without symbolicEquality set`,
            );
        }
    });
});
