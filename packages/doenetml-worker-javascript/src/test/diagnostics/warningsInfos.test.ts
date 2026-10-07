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
    it("Deprecated selectPrimeNumbers attributes", async () => {
        const { core } = await createTestCore({
            doenetML: `
<selectPrimeNumbers minValue="10" maxValue="50" sortResults="true" />
            `,
        });

        const diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(3);

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

        expect(
            diagnosticsByType.warnings.some((warning) =>
                warning.message.includes(
                    "Attribute `sortResults` on `<selectPrimeNumbers>` is deprecated; use `sort` instead.",
                ),
            ),
        ).eq(true);
    });

    it("Deprecated odeSystem renderMode attribute", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<odeSystem name="ode" renderMode="display">
    <rightHandSide>-x</rightHandSide>
</odeSystem>
            `,
        });

        const diagnosticsByType = getDiagnosticsByType(core);

        // The deprecation pass drops the attribute before the component sees
        // it, so it is a warning rather than an "invalid attribute" error.
        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(1);
        expect(
            diagnosticsByType.warnings.some((warning) =>
                warning.message.includes(
                    "Attribute `renderMode` on `<odeSystem>` is deprecated and ignored.",
                ),
            ),
        ).eq(true);

        // The system still renders as an aligned environment.
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ode")].stateValues
                .renderMode,
        ).eq("align");
    });

    it("Deprecated selectFromSequence sortResults attribute", async () => {
        const { core } = await createTestCore({
            doenetML: `
<selectFromSequence from="1" to="10" sortResults="true" />
            `,
        });

        const diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(1);

        expect(
            diagnosticsByType.warnings.some((warning) =>
                warning.message.includes(
                    "Attribute `sortResults` on `<selectFromSequence>` is deprecated; use `sort` instead.",
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

    it("Deprecated description attribute names the component it was written on", async () => {
        // `descriptionAttributeSugar` covers ten component types and puts the
        // one the attribute was written on into the message, so exercise a
        // couple of them together. `<image>` is covered in `image.test.ts`,
        // which also checks that the rewritten child still supplies the alt
        // text.
        const { core } = await createTestCore({
            doenetML: `
<mathInput description="Enter a number" />
<graph description="A graph" />
            `,
        });

        const diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(2);

        expect(
            diagnosticsByType.warnings.map((warning) => warning.message),
        ).contains(
            "[deprecation] Attribute `description` on `<mathInput>` is deprecated; use a `<shortDescription>` child instead.",
        );
        expect(
            diagnosticsByType.warnings.map((warning) => warning.message),
        ).contains(
            "[deprecation] Attribute `description` on `<graph>` is deprecated; use a `<shortDescription>` child instead.",
        );
    });

    it("Deprecated physical labelPosition values are migrated to start/end", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<textInput name="ti" labelPosition="left"><label>Text</label></textInput>
<booleanInput name="bi" labelPosition="RIGHT"><label>Boolean</label></booleanInput>
            `,
        });

        const diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(2);

        const messages = diagnosticsByType.warnings.map(
            (warning) => warning.message,
        );
        expect(messages).contains(
            "[deprecation] Value `left` of attribute `labelPosition` on `<textInput>` is deprecated; use `start` instead.",
        );
        // Written in another casing: the migration matches the deprecated
        // value case-insensitively, so it is recognized however the author
        // capitalized it, and the message names it in canonical casing.
        expect(messages).contains(
            "[deprecation] Value `right` of attribute `labelPosition` on `<booleanInput>` is deprecated; use `end` instead.",
        );

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ti")].stateValues
                .labelPosition,
        ).eq("start");
        expect(
            stateVariables[await resolvePathToNodeIdx("bi")].stateValues
                .labelPosition,
        ).eq("end");
    });

    it("Deprecated resultsLocation values are migrated to start/end", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<codeEditor name="ce" resultsLocation="left" />
            `,
        });

        const diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(
            diagnosticsByType.warnings.map((warning) => warning.message),
        ).contains(
            "[deprecation] Value `left` of attribute `resultsLocation` on `<codeEditor>` is deprecated; use `start` instead.",
        );

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ce")].stateValues
                .resultsLocation,
        ).eq("start");
    });

    it("labelPosition on a graph component keeps its physical values", async () => {
        // A point's label sits in coordinate space, which does not mirror, so
        // `upperLeft` is not up for renaming and must not draw a deprecation.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<graph><point name="P" labelPosition="upperLeft">(1,2)<label>A</label></point></graph>
            `,
        });

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(0);

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("P")].stateValues
                .labelPosition,
        ).eq("upperleft");
    });

    it("Deprecated tabular border attributes are migrated to logical names", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<tabular name="t" top="minor" left="medium" halign="right">
  <row name="r" left="major">
    <cell name="c" right="minor" bottom="medium">hello</cell>
  </row>
</tabular>
            `,
        });

        const diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(6);

        const messages = diagnosticsByType.warnings.map(
            (warning) => warning.message,
        );
        expect(messages).contains(
            "[deprecation] Attribute `left` on `<row>` is deprecated; use `startBorder` instead.",
        );
        expect(messages).contains(
            "[deprecation] Attribute `right` on `<cell>` is deprecated; use `endBorder` instead.",
        );
        expect(messages).contains(
            "[deprecation] Attribute `bottom` on `<cell>` is deprecated; use `bottomBorder` instead.",
        );
        expect(messages).contains(
            "[deprecation] Attribute `top` on `<tabular>` is deprecated; use `topBorder` instead.",
        );
        expect(messages).contains(
            "[deprecation] Attribute `left` on `<tabular>` is deprecated; use `startBorder` instead.",
        );
        // On the same element as the `left` → `startBorder` rename: the
        // attribute rename and the value rename are applied in one visit, and
        // `left` as an attribute name and `left` as a `halign` value are
        // migrated independently of each other.
        expect(messages).contains(
            "[deprecation] Value `right` of attribute `halign` on `<tabular>` is deprecated; use `end` instead.",
        );

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues
                .topBorder,
        ).eq("minor");
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues
                .startBorder,
        ).eq("medium");
        expect(
            stateVariables[await resolvePathToNodeIdx("t")].stateValues.halign,
        ).eq("end");
        expect(
            stateVariables[await resolvePathToNodeIdx("r")].stateValues
                .startBorder,
        ).eq("major");
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .endBorder,
        ).eq("minor");
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues
                .bottomBorder,
        ).eq("medium");
    });

    it("Deprecated halign values are migrated to start/end", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<tabular halign="right">
  <row><cell name="c" halign="left">hello</cell></row>
</tabular>
            `,
        });

        const diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(2);

        const messages = diagnosticsByType.warnings.map(
            (warning) => warning.message,
        );
        expect(messages).contains(
            "[deprecation] Value `right` of attribute `halign` on `<tabular>` is deprecated; use `end` instead.",
        );
        expect(messages).contains(
            "[deprecation] Value `left` of attribute `halign` on `<cell>` is deprecated; use `start` instead.",
        );

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("c")].stateValues.halign,
        ).eq("start");
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

        // Infos surface in evaluation order, which under on-demand
        // dependency setup follows document order.
        expect(diagnosticsByType.infos[0].message).contain(
            "Invalid value `bad` for attribute `type`",
        );
        expect(diagnosticsByType.infos[0].type).eq("info");
        expect(diagnosticsByType.infos[0].position.start.line).eq(2);
        expect(diagnosticsByType.infos[0].position.start.column).eq(3);
        expect(diagnosticsByType.infos[0].position.end.line).eq(2);
        expect(diagnosticsByType.infos[0].position.end.column).eq(26);

        expect(diagnosticsByType.infos[1].message).contain(
            "Invalid value `new1` for attribute `format`",
        );
        expect(diagnosticsByType.infos[1].type).eq("info");
        expect(diagnosticsByType.infos[1].position.start.line).eq(5);
        expect(diagnosticsByType.infos[1].position.start.column).eq(3);
        expect(diagnosticsByType.infos[1].position.end.line).eq(5);
        expect(diagnosticsByType.infos[1].position.end.column).eq(46);

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

        // One write reaches both `m2` and the `m6` that extends it, and each
        // reports the value it was given. Which of the two is evaluated
        // first depends on the order the update touches them, so the pair
        // is checked without an order.
        const infosByLine = (indices: number[]) =>
            indices
                .map((i) => diagnosticsByType.infos[i].position.start.line)
                .sort((a, b) => a - b);
        for (const i of [6, 7]) {
            expect(diagnosticsByType.infos[i].message).contain(
                "Invalid value `try2` for attribute `format`",
            );
        }
        expect(infosByLine([6, 7])).eqls([5, 9]);

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

        for (const i of [11, 12]) {
            expect(diagnosticsByType.infos[i].message).contain(
                "Invalid value `try6` for attribute `format`",
            );
        }
        expect(infosByLine([11, 12])).eqls([5, 9]);

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
            "Invalid format for attribute domain of `<function>`",
        );
        expect(diagnosticsByType.warnings[0].position.start.line).eq(2);
        expect(diagnosticsByType.warnings[0].position.start.column).eq(20);
        expect(diagnosticsByType.warnings[0].position.end.line).eq(2);
        expect(diagnosticsByType.warnings[0].position.end.column).eq(34);

        // The list the domain makes reports the text it cannot read as it
        // reads it, before the function finds it has no interval.
        expect(diagnosticsByType.warnings[1].message).contain(
            "Insufficient dimensions for domain for function.",
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

    // The variant-time diagnostics below cover code paths that previously
    // emitted raw console.log/console.warn. They are now routed through
    // `preliminaryDiagnostics` (variant resolution) or `core.addDiagnostic`
    // (`setUpVariant`), so they surface to the user as info records instead
    // of polluting test output.
    it("`selectWeight` on an option produces an info: unique variants disabled", async () => {
        const { core } = await createTestCore({
            doenetML: `
<select name="s">
  <option selectWeight="1"><text>a</text></option>
  <option selectWeight="2"><text>b</text></option>
</select>
            `,
        });

        const diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(
            diagnosticsByType.infos.some((info) =>
                info.message.includes(
                    "Unique variants for select disabled if have an option with selectWeight or selectForVariants specified",
                ),
            ),
        ).eq(true);
    });

    it("non-integer `numToSelect` on selectFromSequence produces an info", async () => {
        const { core } = await createTestCore({
            doenetML: `
<selectFromSequence from="1" to="10" numToSelect="2.5" />
            `,
        });

        const diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        const info = diagnosticsByType.infos.find((info) =>
            info.message.includes(
                "cannot determine unique variants of selectFromSequence as numToSelect isn't a non-negative integer",
            ),
        );
        expect(info).toBeDefined();

        // `pushVariantInfo` builds every one of these on its callers' behalf,
        // so the code and arguments are the only evidence that the sentence
        // came from the catalog rather than from a literal at the call site —
        // and they are the half the main thread re-renders from. The tag is an
        // argument because it is an identifier that stays as written in every
        // language; the reason it gives is what the code names.
        expect(info?.code).eq("doenet-i0022");
        expect(info?.args?.component).eq("selectFromSequence");
    });

    it("non-integer requested variant index produces an info", async () => {
        const { core } = await createTestCore({
            doenetML: `<text>hi</text>`,
            requestedVariantIndex: 2.5,
        });

        const diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(
            diagnosticsByType.infos.some(
                (info) =>
                    info.message.includes("Variant index") &&
                    info.message.includes("must be an integer"),
            ),
        ).eq(true);
    });

    it("reports a warning about markup in index brackets once, however deeply nested", async () => {
        // A reference resolution carries the same index nodes on both its
        // `originalPath` and its `unresolvedPath`, and the load-time pipeline
        // expands both, so anything reported about markup between index
        // brackets used to arrive once per path — twice one level in, four
        // times two levels in.
        const documents = [
            `<p>$(x)[<number>1</number>]</p>`,
            `<numberList name="myList">100 300 200 50</numberList>
             <p>$myList[<p>$(x)[<number>1</number>]</p>]</p>`,
            `<numberList name="myList">100 300 200 50</numberList>
             <p>$myList[<p>$myList[<p>$(x)[<number>1</number>]</p>]</p>]</p>`,
        ];
        for (const doenetML of documents) {
            const { core } = await createTestCore({ doenetML });
            const diagnosticsByType = getDiagnosticsByType(core);
            expect(
                diagnosticsByType.warnings.filter(
                    (warning) => warning.code === "doenet-w0162",
                ).length,
                doenetML,
            ).eq(1);
            // Whatever else each document earns, no two of them are the same
            // message in the same place.
            const keys = diagnosticsByType.warnings.map((warning) =>
                JSON.stringify([
                    warning.message,
                    warning.position?.start?.offset,
                ]),
            );
            expect(new Set(keys).size, doenetML).eq(keys.length);
        }
    });

    it("says nothing about invalid children an author did not write", async () => {
        // An element in index brackets that normalization turns into an
        // `_error` used to draw a second warning beside the genuine one:
        // "Invalid children for `<_error>`: Found invalid children: `<_copy>`".
        // Neither component is anything the author wrote.
        const documents = [
            `<numberList name="myList">100 300 200 50</numberList>
             <p>$myList[<indexOf type="text" tolerance="1e-6" target="100">$myList</indexOf>]</p>`,
            `<numberList name="myList">100 300 200 50</numberList>
             <p>$myList[<number bogusAttr="1">$k</number>]</p>`,
            // Reported against `<setup>` rather than `<_error>`, from the alias
            // components `<repeat>` synthesizes, but the same cause.
            `<numberList name="myList">100 300 200 50</numberList>
             <p>$myList[<indexOf target="2"><repeat for="1 2" valueName="v"><number>$v</number></repeat></indexOf>]</p>`,
        ];
        for (const doenetML of documents) {
            const { core } = await createTestCore({ doenetML });
            const diagnosticsByType = getDiagnosticsByType(core);
            expect(
                diagnosticsByType.warnings.filter(
                    (warning) => warning.code === "doenet-w0107",
                ),
                doenetML,
            ).eqls([]);
        }

        // The first document's genuine error is still reported, and the same
        // markup written in ordinary content behaves the same way — which is
        // what made the extra message specific to an index in the first place.
        for (const doenetML of [
            `<numberList name="myList">100 300 200 50</numberList>
             <p>$myList[<indexOf type="text" tolerance="1e-6" target="100">$myList</indexOf>]</p>`,
            `<numberList name="myList">100 300 200 50</numberList>
             <p><indexOf type="text" tolerance="1e-6" target="100">$myList</indexOf></p>`,
        ]) {
            const { core } = await createTestCore({ doenetML });
            const diagnosticsByType = getDiagnosticsByType(core);
            expect(diagnosticsByType.errors.length, doenetML).eq(1);
            expect(diagnosticsByType.errors[0].message).contain(
                `Invalid attribute "tolerance"`,
            );
        }
    });

    it("warns about attributes and children an extend of a composite or list ignores", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<sequence name="s" from="1" to="3" />
<p name="p1"><sequence extend="$s" to="5" step="2" /></p>
<repeatForSequence from="1" to="2" valueName="v" name="r"><number>$v</number></repeatForSequence>
<p name="p2"><repeatForSequence extend="$r" to="4"><text>x</text></repeatForSequence></p>
<repeat for="a b" valueName="w" name="r2"><text>$w</text></repeat>
<p name="p3"><repeat extend="$r2" for="c d e"><text>y</text></repeat></p>
<select name="sel"><option><text>c</text></option></select>
<p name="p4"><select extend="$sel" numToSelect="1" /></p>
            `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const texts: string[] = [];
        for (const name of ["p1", "p2", "p3", "p4"]) {
            texts.push(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .text,
            );
        }
        expect(texts).eqls(["1, 2, 3", "1, 2", "a, b", "c"]);

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.errors.length).eq(0);
        expect(
            diagnosticsByType.warnings.map((warning) => warning.message),
        ).eqls([
            "The `to` attribute is ignored: a `<sequence>` with `extend` shows the same content as the component it extends.",
            "The `step` attribute is ignored: a `<sequence>` with `extend` shows the same content as the component it extends.",
            "The `to` attribute is ignored: a `<repeatForSequence>` with `extend` shows the same content as the component it extends.",
            "Children written inside a `<repeatForSequence>` with `extend` are ignored: it shows the same content as the component it extends.",
            "The `for` attribute is ignored: a `<repeat>` with `extend` shows the same content as the component it extends.",
            "Children written inside a `<repeat>` with `extend` are ignored: it shows the same content as the component it extends.",
            "The `numToSelect` attribute is ignored: a `<select>` with `extend` shows the same content as the component it extends.",
        ]);
        expect(diagnosticsByType.warnings.map((warning) => warning.code)).eqls([
            "doenet-w0168",
            "doenet-w0168",
            "doenet-w0168",
            "doenet-w0169",
            "doenet-w0168",
            "doenet-w0169",
            "doenet-w0168",
        ]);
        // Each points at the extend it is about.
        expect(
            diagnosticsByType.warnings.map(
                (warning) => warning.position?.start.line,
            ),
        ).eqls([3, 3, 5, 5, 7, 7, 9]);
    });

    it("says nothing about what an extend applies, or about a copy", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<sequence name="s" type="math" from="1.2345" to="3.2345" />
<p name="p1"><sequence extend="$s" asList="false" displayDigits="2" hide="false" fixed /></p>
<p name="p2"><sequence copy="$s" to="5.2345" /></p>
<repeatForSequence from="1" to="2" valueName="v" name="r"><number>$v</number></repeatForSequence>
<p name="p3"><repeatForSequence extend="$r" asList="false">  </repeatForSequence></p>
<group name="g"><text>a</text></group>
<p name="p4"><group extend="$g"><text>x</text></group></p>
<p name="p5"><number extend="$s[2]" displayDigits="3" /></p>
            `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const texts: string[] = [];
        for (const name of ["p1", "p2", "p3", "p4", "p5"]) {
            texts.push(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .text,
            );
        }
        expect(texts).eqls([
            "1.22.23.2",
            "1.23, 2.23, 3.23, 4.23, 5.23",
            "12",
            "ax",
            "2.23",
        ]);

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.errors.length).eq(0);
        expect(diagnosticsByType.warnings.length).eq(0);
    });

    it("warns about only the attributes an author wrote on an extend of a module", async () => {
        // A `<module>` accepts any attribute, so it is handed the `_copy`'s
        // own (`createComponentIdx`, `copyInChildren`, …) too.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<module name="m"><moduleAttributes><text name="a">hi</text></moduleAttributes><text>$a</text></module>
<p name="p1"><module extend="$m" /></p>
<p name="p2"><module extend="$m" a="bye" /></p>
<p name="p3"><module copy="$m" a="bye" /></p>
            `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const texts: string[] = [];
        for (const name of ["p1", "p2", "p3"]) {
            texts.push(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .text,
            );
        }
        expect(texts).eqls(["hi", "hi", "bye"]);

        const diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.errors.length).eq(0);
        expect(
            diagnosticsByType.warnings.map((warning) => warning.message),
        ).eqls([
            "The `a` attribute is ignored: a `<module>` with `extend` shows the same content as the component it extends.",
        ]);
        expect(
            diagnosticsByType.warnings.map(
                (warning) => warning.position?.start.line,
            ),
        ).eqls([4]);
    });

    it("warns once about an extend's ignored attribute, wherever it is and however it updates", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<mathInput name="n" prefill="3" />
<sequence name="s" from="1" to="$n" />
<sequence name="e" extend="$s" />
<p name="p1"><sequence extend="$e" to="5" /></p>
<repeatForSequence from="1" to="2" name="outer"><p><sequence extend="$s" to="6" /></p></repeatForSequence>
            `,
        });

        async function check_items(text: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("p1")].stateValues
                    .text,
            ).eq(text);

            const diagnosticsByType = getDiagnosticsByType(core);
            expect(
                diagnosticsByType.warnings.map((warning) => warning.message),
            ).eqls([
                "The `to` attribute is ignored: a `<sequence>` with `extend` shows the same content as the component it extends.",
                "The `to` attribute is ignored: a `<sequence>` with `extend` shows the same content as the component it extends.",
            ]);
        }

        await check_items("1, 2, 3");

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        await check_items("1, 2, 3, 4");
    });

    it("non-numeric requested variant index produces an info", async () => {
        const { core } = await createTestCore({
            doenetML: `<text>hi</text>`,
            requestedVariantIndex: NaN,
        });

        const diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(0);
        expect(
            diagnosticsByType.infos.some(
                (info) =>
                    info.message.includes("Variant index") &&
                    info.message.includes("must be a number"),
            ),
        ).eq(true);
    });
});
