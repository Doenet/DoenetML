import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Error Tests", async () => {
    it("Mismatched tags at base level", async () => {
        let core = await createTestCore({
            doenetML: `
<math name="good">x+y</math>

<math name="bad">a+b</number>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/good"].stateValues.value.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/bad"].stateValues.value.tree).eqls([
            "+",
            "a",
            "b",
        ]);

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            "Mismatched closing tag",
        );
        expect(errorWarnings.errors[0].position.lineBegin).eq(4);
        expect(errorWarnings.errors[0].position.charBegin).eq(21);
        expect(errorWarnings.errors[0].position.lineEnd).eq(4);
        expect(errorWarnings.errors[0].position.charEnd).eq(29);
    });

    it("Mismatched tags in section, later tags outside survive", async () => {
        let core = await createTestCore({
            doenetML: `
<section name="sec">
  <math name="good">x+y</math>
  <math name="bad">a+b</number>
</section>
<math name="m">x</math>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/good"].stateValues.value.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/bad"].stateValues.value.tree).eqls([
            "+",
            "a",
            "b",
        ]);

        // confirm tag after section survives
        expect(stateVariables["/m"].stateValues.value.tree).eq("x");

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            "Mismatched closing tag",
        );
        expect(errorWarnings.errors[0].position.lineBegin).eq(4);
        expect(errorWarnings.errors[0].position.charBegin).eq(23);
        expect(errorWarnings.errors[0].position.lineEnd).eq(4);
        expect(errorWarnings.errors[0].position.charEnd).eq(31);
    });

    it("More parsing errors", async () => {
        let core = await createTestCore({
            doenetML: `
<p>
  <math name="m1">y

    </p>
       
</hmm>

<p h="abc"

<section name="sec">

  <p>Hello there!</p>

  <circle radius="1" radius="2" />
  <rectangle hide hide name="rect" />
  <apple q="a" q="b" name="ap">hi</apple>
  <banana bad bad>bye</banana>
  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/m1"].stateValues.value.tree).eq("y");
        expect(stateVariables["/sec"].stateValues.title).eq("Section 1");
        expect(stateVariables["/_p3"].stateValues.text).eq("Hello there!");

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(8);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain("Missing closing tag");
        expect(errorWarnings.errors[0].position.lineBegin).eq(5);
        expect(errorWarnings.errors[0].position.charBegin).eq(4);
        expect(errorWarnings.errors[0].position.lineEnd).eq(5);
        expect(errorWarnings.errors[0].position.charEnd).eq(4);

        expect(errorWarnings.errors[1].message).contain("Found </");
        expect(errorWarnings.errors[1].position.lineBegin).eq(7);
        expect(errorWarnings.errors[1].position.charBegin).eq(1);
        expect(errorWarnings.errors[1].position.lineEnd).eq(7);
        expect(errorWarnings.errors[1].position.charEnd).eq(6);

        expect(errorWarnings.errors[2].message).contain(
            "Error in opening <p> tag",
        );
        expect(errorWarnings.errors[2].position.lineBegin).eq(9);
        expect(errorWarnings.errors[2].position.charBegin).eq(1);
        expect(errorWarnings.errors[2].position.lineEnd).eq(9);
        expect(errorWarnings.errors[2].position.charEnd).eq(10);

        expect(errorWarnings.errors[3].message).contain(
            "Duplicate attribute radius",
        );
        expect(errorWarnings.errors[3].position.lineBegin).eq(15);
        expect(errorWarnings.errors[3].position.charBegin).eq(22);
        expect(errorWarnings.errors[3].position.lineEnd).eq(15);
        expect(errorWarnings.errors[3].position.charEnd).eq(31);

        expect(errorWarnings.errors[4].message).contain(
            "Duplicate attribute hide",
        );
        expect(errorWarnings.errors[4].position.lineBegin).eq(16);
        expect(errorWarnings.errors[4].position.charBegin).eq(19);
        expect(errorWarnings.errors[4].position.lineEnd).eq(16);
        expect(errorWarnings.errors[4].position.charEnd).eq(22);

        expect(errorWarnings.errors[5].message).contain(
            "Duplicate attribute q",
        );
        expect(errorWarnings.errors[5].position.lineBegin).eq(17);
        expect(errorWarnings.errors[5].position.charBegin).eq(16);
        expect(errorWarnings.errors[5].position.lineEnd).eq(17);
        expect(errorWarnings.errors[5].position.charEnd).eq(20);

        expect(errorWarnings.errors[6].message).contain(
            "Duplicate attribute bad",
        );
        expect(errorWarnings.errors[6].position.lineBegin).eq(18);
        expect(errorWarnings.errors[6].position.charBegin).eq(15);
        expect(errorWarnings.errors[6].position.lineEnd).eq(18);
        expect(errorWarnings.errors[6].position.charEnd).eq(17);

        expect(errorWarnings.errors[7].message).contain("Missing closing tag");
        expect(errorWarnings.errors[7].position.lineBegin).eq(19);
        expect(errorWarnings.errors[7].position.charBegin).eq(2);
        expect(errorWarnings.errors[7].position.lineEnd).eq(19);
        expect(errorWarnings.errors[7].position.charEnd).eq(2);
    });

    it("Parsing errors, correctly find end of self-closing tag", async () => {
        let core = await createTestCore({
            doenetML: `
<abc />
  <bcd   />
<cde  
/>
    <def 
   
/>
<efg
 />
<fgh
a />
<ghi
 a  />

  `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(7);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            "Invalid component type: <abc>",
        );
        expect(errorWarnings.errors[0].position.lineBegin).eq(2);
        expect(errorWarnings.errors[0].position.charBegin).eq(1);
        expect(errorWarnings.errors[0].position.lineEnd).eq(2);
        expect(errorWarnings.errors[0].position.charEnd).eq(7);

        expect(errorWarnings.errors[1].message).contain(
            "Invalid component type: <bcd>",
        );
        expect(errorWarnings.errors[1].position.lineBegin).eq(3);
        expect(errorWarnings.errors[1].position.charBegin).eq(3);
        expect(errorWarnings.errors[1].position.lineEnd).eq(3);
        expect(errorWarnings.errors[1].position.charEnd).eq(11);

        expect(errorWarnings.errors[2].message).contain(
            "Invalid component type: <cde>",
        );
        expect(errorWarnings.errors[2].position.lineBegin).eq(4);
        expect(errorWarnings.errors[2].position.charBegin).eq(1);
        expect(errorWarnings.errors[2].position.lineEnd).eq(5);
        expect(errorWarnings.errors[2].position.charEnd).eq(2);

        expect(errorWarnings.errors[3].message).contain(
            "Invalid component type: <def>",
        );
        expect(errorWarnings.errors[3].position.lineBegin).eq(6);
        expect(errorWarnings.errors[3].position.charBegin).eq(5);
        expect(errorWarnings.errors[3].position.lineEnd).eq(8);
        expect(errorWarnings.errors[3].position.charEnd).eq(2);

        expect(errorWarnings.errors[4].message).contain(
            "Invalid component type: <efg>",
        );
        expect(errorWarnings.errors[4].position.lineBegin).eq(9);
        expect(errorWarnings.errors[4].position.charBegin).eq(1);
        expect(errorWarnings.errors[4].position.lineEnd).eq(10);
        expect(errorWarnings.errors[4].position.charEnd).eq(3);

        expect(errorWarnings.errors[5].message).contain(
            "Invalid component type: <fgh>",
        );
        expect(errorWarnings.errors[5].position.lineBegin).eq(11);
        expect(errorWarnings.errors[5].position.charBegin).eq(1);
        expect(errorWarnings.errors[5].position.lineEnd).eq(12);
        expect(errorWarnings.errors[5].position.charEnd).eq(4);

        expect(errorWarnings.errors[6].message).contain(
            "Invalid component type: <ghi>",
        );
        expect(errorWarnings.errors[6].position.lineBegin).eq(13);
        expect(errorWarnings.errors[6].position.charBegin).eq(1);
        expect(errorWarnings.errors[6].position.lineEnd).eq(14);
        expect(errorWarnings.errors[6].position.charEnd).eq(6);
    });

    it("Naming errors", async () => {
        let core = await createTestCore({
            doenetML: `
<p name="_p" />
    <p name="p@" />
<p name="p">Hello</p>
<p name="p">
  Bye
</p >
<p name>blank name</p>
<p>afterwards</p>
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(4);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            "Invalid component name: _p",
        );
        expect(errorWarnings.errors[0].position.lineBegin).eq(2);
        expect(errorWarnings.errors[0].position.charBegin).eq(1);
        expect(errorWarnings.errors[0].position.lineEnd).eq(2);
        expect(errorWarnings.errors[0].position.charEnd).eq(15);

        expect(errorWarnings.errors[1].message).contain(
            "Invalid component name: p@",
        );
        expect(errorWarnings.errors[1].position.lineBegin).eq(3);
        expect(errorWarnings.errors[1].position.charBegin).eq(5);
        expect(errorWarnings.errors[1].position.lineEnd).eq(3);
        expect(errorWarnings.errors[1].position.charEnd).eq(19);

        expect(errorWarnings.errors[2].message).contain(
            "Duplicate component name: p",
        );
        expect(errorWarnings.errors[2].position.lineBegin).eq(5);
        expect(errorWarnings.errors[2].position.charBegin).eq(1);
        expect(errorWarnings.errors[2].position.lineEnd).eq(7);
        expect(errorWarnings.errors[2].position.charEnd).eq(5);
        expect(errorWarnings.errors[1].position.charEnd).eq(19);

        expect(errorWarnings.errors[3].message).contain(
            "Cannot have a blank name",
        );
        expect(errorWarnings.errors[3].position.lineBegin).eq(8);
        expect(errorWarnings.errors[3].position.charBegin).eq(1);
        expect(errorWarnings.errors[3].position.lineEnd).eq(8);
        expect(errorWarnings.errors[3].position.charEnd).eq(22);
    });

    it("Abstract component give invalid component type", async () => {
        let core = await createTestCore({
            doenetML: `
<_base />
<_inline>hello</_inline>
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(2);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            "Invalid component type: <_base>",
        );
        expect(errorWarnings.errors[0].position.lineBegin).eq(2);
        expect(errorWarnings.errors[0].position.charBegin).eq(1);
        expect(errorWarnings.errors[0].position.lineEnd).eq(2);
        expect(errorWarnings.errors[0].position.charEnd).eq(6);

        expect(errorWarnings.errors[1].message).contain(
            "Invalid component type: <_inline>",
        );
        expect(errorWarnings.errors[1].position.lineBegin).eq(3);
        expect(errorWarnings.errors[1].position.charBegin).eq(1);
        expect(errorWarnings.errors[1].position.lineEnd).eq(3);
        expect(errorWarnings.errors[1].position.charEnd).eq(8);
    });

    it("Prevent auto-named child and attribute clashes on duplicate name", async () => {
        let core = await createTestCore({
            doenetML: `
    <function name="f" numinputs="2">x+y</function>
    <function name="f" numinputs="2">z</function>
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            "Duplicate component name: f",
        );
        expect(errorWarnings.errors[0].position.lineBegin).eq(3);
        expect(errorWarnings.errors[0].position.charBegin).eq(5);
        expect(errorWarnings.errors[0].position.lineEnd).eq(3);
        expect(errorWarnings.errors[0].position.charEnd).eq(49);
    });

    it("assignNames errors", async () => {
        let core = await createTestCore({
            doenetML: `
<group assignNames="(_a _b)" /><group assignNames="a/ b%" name="g2" />
<group assignNames="a) b" name="g3" />   <group assignNames="a b (c a)" />

<group assignNames="a b" assignnames="c d" name="g5" />
<group assignNames="e f">
  <text>cat</text><text>dog</text>
</group>
<p assignNames="h" />
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(6);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            "Invalid assignNames: (_a _b)",
        );
        expect(errorWarnings.errors[0].position.lineBegin).eq(2);
        expect(errorWarnings.errors[0].position.charBegin).eq(1);
        expect(errorWarnings.errors[0].position.lineEnd).eq(2);
        expect(errorWarnings.errors[0].position.charEnd).eq(31);

        expect(errorWarnings.errors[1].message).contain(
            "Invalid assignNames: a/ b%",
        );
        expect(errorWarnings.errors[1].position.lineBegin).eq(2);
        expect(errorWarnings.errors[1].position.charBegin).eq(32);
        expect(errorWarnings.errors[1].position.lineEnd).eq(2);
        expect(errorWarnings.errors[1].position.charEnd).eq(70);

        expect(errorWarnings.errors[2].message).contain(
            "Invalid format for assignNames: a) b",
        );
        expect(errorWarnings.errors[2].position.lineBegin).eq(3);
        expect(errorWarnings.errors[2].position.charBegin).eq(1);
        expect(errorWarnings.errors[2].position.lineEnd).eq(3);
        expect(errorWarnings.errors[2].position.charEnd).eq(38);

        expect(errorWarnings.errors[3].message).contain(
            "A name is duplicated in assignNames: a b (c a)",
        );
        expect(errorWarnings.errors[3].position.lineBegin).eq(3);
        expect(errorWarnings.errors[3].position.charBegin).eq(42);
        expect(errorWarnings.errors[3].position.lineEnd).eq(3);
        expect(errorWarnings.errors[3].position.charEnd).eq(74);

        expect(errorWarnings.errors[4].message).contain(
            "Cannot define assignNames twice for a component",
        );
        expect(errorWarnings.errors[4].position.lineBegin).eq(5);
        expect(errorWarnings.errors[4].position.charBegin).eq(1);
        expect(errorWarnings.errors[4].position.lineEnd).eq(5);
        expect(errorWarnings.errors[4].position.charEnd).eq(55);

        expect(errorWarnings.errors[5].message).contain(
            "Cannot assign names for component type p",
        );
        expect(errorWarnings.errors[5].position.lineBegin).eq(9);
        expect(errorWarnings.errors[5].position.charBegin).eq(1);
        expect(errorWarnings.errors[5].position.lineEnd).eq(9);
        expect(errorWarnings.errors[5].position.charEnd).eq(21);
    });

    it("Invalid attribute errors", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>Good</p>
    <p bad="not good">Unhappy</p>
    <p>Good again</p>
    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            `Invalid attribute "bad" for a component of type <p>`,
        );
        expect(errorWarnings.errors[0].position.lineBegin).eq(3);
        expect(errorWarnings.errors[0].position.charBegin).eq(5);
        expect(errorWarnings.errors[0].position.lineEnd).eq(3);
        expect(errorWarnings.errors[0].position.charEnd).eq(33);
    });

    it("Invalid source errors", async () => {
        let core = await createTestCore({
            doenetML: `


    <collect source />
    <collect source="__s" />


    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(2);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            "Must specify value for source",
        );
        expect(errorWarnings.errors[0].position.lineBegin).eq(4);
        expect(errorWarnings.errors[0].position.charBegin).eq(5);
        expect(errorWarnings.errors[0].position.lineEnd).eq(4);
        expect(errorWarnings.errors[0].position.charEnd).eq(22);

        // TODO: what should this error actually say?
        expect(errorWarnings.errors[1].message).contain(
            "Invalid reference target: __s",
        );
        expect(errorWarnings.errors[1].position.lineBegin).eq(5);
        expect(errorWarnings.errors[1].position.charBegin).eq(5);
        expect(errorWarnings.errors[1].position.lineEnd).eq(5);
        expect(errorWarnings.errors[1].position.charEnd).eq(28);
    });

    it("Circular dependency with copy source", async () => {
        let core = await createTestCore({
            doenetML: `
<math copySource="a1" name="a1" />

<math copySource="b1" name="b2" />
<math copySource="b2" name="b1" />

<math copySource="c1" name="c2" />
<math copySource="c2" name="c3" />
<math copySource="c3" name="c1" />

<math copySource="d1" name="d2" />
<math copySource="d2" name="d3" />
<math copySource="d3" name="d4" />
<math copySource="d4" name="d1" />

<math copySource="e1" name="e2" />
<math copySource="e2" name="e3" />
<math copySource="e3" name="e4" />
<math copySource="e4" name="e5" />

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/e2"].stateValues.value.tree).eq("＿");
        expect(stateVariables["/e3"].stateValues.value.tree).eq("＿");
        expect(stateVariables["/e4"].stateValues.value.tree).eq("＿");
        expect(stateVariables["/e5"].stateValues.value.tree).eq("＿");

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(4);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            "Circular dependency involving these components: <math> (line 2)",
        );
        expect(errorWarnings.errors[0].position.lineBegin).eq(2);
        expect(errorWarnings.errors[0].position.charBegin).eq(1);
        expect(errorWarnings.errors[0].position.lineEnd).eq(2);
        expect(errorWarnings.errors[0].position.charEnd).eq(34);

        // temporary messages until can better detect circular dependency with copysource
        expect(errorWarnings.errors[1].message).contain(
            "Circular dependency involving these components: <math> (line 4)",
        );
        expect(errorWarnings.errors[1].position.lineBegin).eq(4);
        expect(errorWarnings.errors[1].position.charBegin).eq(1);
        expect(errorWarnings.errors[1].position.lineEnd).eq(4);
        expect(errorWarnings.errors[1].position.charEnd).eq(34);

        expect(errorWarnings.errors[2].message).contain(
            "Circular dependency involving these components: <math> (line 7)",
        );
        expect(errorWarnings.errors[2].position.lineBegin).eq(7);
        expect(errorWarnings.errors[2].position.charBegin).eq(1);
        expect(errorWarnings.errors[2].position.lineEnd).eq(7);
        expect(errorWarnings.errors[2].position.charEnd).eq(34);

        expect(errorWarnings.errors[3].message).contain(
            "Circular dependency involving these components: <math> (line 11)",
        );
        expect(errorWarnings.errors[3].position.lineBegin).eq(11);
        expect(errorWarnings.errors[3].position.charBegin).eq(1);
        expect(errorWarnings.errors[3].position.lineEnd).eq(11);
        expect(errorWarnings.errors[3].position.charEnd).eq(34);
    });

    it("Circular dependency with macro children", async () => {
        let doenetML1 = `<text name="t1">$t1</text>`;

        let doenetML2 = `<text name="t1">$t2</text>
      <text name="t2">$t1</text>`;

        let doenetML3 = `<text name="t1">$t2</text>
      <text name="t2">$t3</text>
      <text name="t3">$t1</text>`;

        await expect(createTestCore({ doenetML: doenetML1 })).rejects.toThrow(
            "Circular dependency involving these components: <text> (line 1).",
        );

        await expect(createTestCore({ doenetML: doenetML2 })).rejects.toThrow(
            "Circular dependency involving these components: <text> (line 1), <text> (line 2).",
        );

        await expect(createTestCore({ doenetML: doenetML3 })).rejects.toThrow(
            "Circular dependency involving these components: <text> (line 1), <text> (line 2), <text> (line 3).",
        );
    });

    it("Circular dependency with copy source children", async () => {
        let doenetML1 = `<text name="t1"><text copySource="t1"/></text>`;

        let doenetML2 = `<text name="t1"><text copySource="t2"/></text>
<text name="t2"><text copySource="t1"/></text>`;

        let doenetML3 = `<text name="t1"><text copySource="t2"/></text>
<text name="t2"><text copySource="t3"/></text>
<text name="t3"><text copySource="t1"/></text>`;

        await expect(createTestCore({ doenetML: doenetML1 })).rejects.toThrow(
            "Circular dependency involving these components: <text> (line 1).",
        );

        await expect(createTestCore({ doenetML: doenetML2 })).rejects.toThrow(
            "Circular dependency involving these components: <text> (line 1), <text> (line 2).",
        );

        await expect(createTestCore({ doenetML: doenetML3 })).rejects.toThrow(
            "Circular dependency involving these components: <text> (line 1), <text> (line 2), <text> (line 3).",
        );
    });

    it("Errors in macros", async () => {
        let core = await createTestCore({
            doenetML: `
<!-- make sure get right character numbers after comment -->
$A{assignNames="a" assignnames="b"}
<p>
  <!-- make sure get right character numbers after comment -->
  $B{a="b" a="c"}
    $$f{b b}(x)
      $C{d="b"
  d}
</p>
     $D{a="$b{c c}"}
   $$g{prop="a"}(x)
 $E{a="$b{c='$d{e e}'}"}


    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(7);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            "Duplicate attribute a",
        );
        expect(errorWarnings.errors[0].message).contain(
            `Found: $B{a="b" a="c"}`,
        );
        expect(errorWarnings.errors[0].position.lineBegin).eq(6);
        expect(errorWarnings.errors[0].position.charBegin).eq(3);
        expect(errorWarnings.errors[0].position.lineEnd).eq(6);
        expect(errorWarnings.errors[0].position.charEnd).eq(17);

        expect(errorWarnings.errors[1].message).contain(
            "Duplicate attribute b",
        );
        expect(errorWarnings.errors[1].message).contain("Found: $$f{b b}");
        expect(errorWarnings.errors[1].position.lineBegin).eq(7);
        expect(errorWarnings.errors[1].position.charBegin).eq(5);
        expect(errorWarnings.errors[1].position.lineEnd).eq(7);
        expect(errorWarnings.errors[1].position.charEnd).eq(12);

        expect(errorWarnings.errors[2].message).contain(
            "Duplicate attribute d",
        );
        expect(errorWarnings.errors[2].message).contain(
            `Found: $C{d="b"\n  d}`,
        );
        expect(errorWarnings.errors[2].position.lineBegin).eq(8);
        expect(errorWarnings.errors[2].position.charBegin).eq(7);
        expect(errorWarnings.errors[2].position.lineEnd).eq(9);
        expect(errorWarnings.errors[2].position.charEnd).eq(4);

        expect(errorWarnings.errors[3].message).contain(
            "cannot repeat assignNames",
        );
        expect(errorWarnings.errors[3].message).contain(
            `Found: $A{assignNames="a" assignnames="b"}`,
        );
        expect(errorWarnings.errors[3].position.lineBegin).eq(3);
        expect(errorWarnings.errors[3].position.charBegin).eq(1);
        expect(errorWarnings.errors[3].position.lineEnd).eq(3);
        expect(errorWarnings.errors[3].position.charEnd).eq(35);

        expect(errorWarnings.errors[4].message).contain(
            "Duplicate attribute c",
        );
        expect(errorWarnings.errors[4].message).contain(
            `Found: $D{a="$b{c c}"}`,
        );
        expect(errorWarnings.errors[4].position.lineBegin).eq(11);
        expect(errorWarnings.errors[4].position.charBegin).eq(6);
        expect(errorWarnings.errors[4].position.lineEnd).eq(11);
        expect(errorWarnings.errors[4].position.charEnd).eq(20);

        expect(errorWarnings.errors[5].message).contain(
            "macro cannot directly add attributes prop, propIndex, or componentIndex",
        );
        expect(errorWarnings.errors[5].message).contain(`Found: $$g{prop="a"}`);
        expect(errorWarnings.errors[5].position.lineBegin).eq(12);
        expect(errorWarnings.errors[5].position.charBegin).eq(4);
        expect(errorWarnings.errors[5].position.lineEnd).eq(12);
        expect(errorWarnings.errors[5].position.charEnd).eq(16);

        expect(errorWarnings.errors[6].message).contain(
            "Duplicate attribute e",
        );
        expect(errorWarnings.errors[6].message).contain(
            `Found: $E{a="$b{c='$d{e e}'}"}`,
        );
        expect(errorWarnings.errors[6].position.lineBegin).eq(13);
        expect(errorWarnings.errors[6].position.charBegin).eq(2);
        expect(errorWarnings.errors[6].position.lineEnd).eq(13);
        expect(errorWarnings.errors[6].position.charEnd).eq(24);
    });

    it("Get line/char numbers with no linebreaks", async () => {
        let core = await createTestCore({ doenetML: `<bad>` });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(2);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain("Missing closing tag");
        expect(errorWarnings.errors[0].position.lineBegin).eq(1);
        expect(errorWarnings.errors[0].position.charBegin).eq(5);
        expect(errorWarnings.errors[0].position.lineEnd).eq(1);
        expect(errorWarnings.errors[0].position.charEnd).eq(5);

        expect(errorWarnings.errors[1].message).contain(
            "Invalid component type: <bad>",
        );
        expect(errorWarnings.errors[1].position.lineBegin).eq(1);
        expect(errorWarnings.errors[1].position.charBegin).eq(1);
        expect(errorWarnings.errors[1].position.lineEnd).eq(1);
        expect(errorWarnings.errors[1].position.charEnd).eq(5);
    });

    it("Copy section with an error", async () => {
        let core = await createTestCore({
            doenetML: `
<section name="sec">
  <p>
</section>

<section copySource="sec" name="sec2" />
`,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain("Missing closing tag");
        expect(errorWarnings.errors[0].position.lineBegin).eq(3);
        expect(errorWarnings.errors[0].position.charBegin).eq(6);
        expect(errorWarnings.errors[0].position.lineEnd).eq(3);
        expect(errorWarnings.errors[0].position.charEnd).eq(6);
    });

    it("Error when copying a composite", async () => {
        let core = await createTestCore({
            doenetML: `
        <group name='g'>
          <function name="f" numinputs="2">x+y</function>
        </group>
        
        <group copySource="g" newNamespace name="g2" >
          <function name="f" numinputs="2">z</function>
        </group>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/f"].stateValues.formula.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/g2/f"].stateValues.formula.tree).eqls([
            "+",
            "x",
            "y",
        ]);

        const errorWarnings = core.core!.getErrorWarnings().errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            "Duplicate component name: f",
        );
        expect(errorWarnings.errors[0].position.lineBegin).eq(7);
        expect(errorWarnings.errors[0].position.charBegin).eq(11);
        expect(errorWarnings.errors[0].position.lineEnd).eq(7);
        expect(errorWarnings.errors[0].position.charEnd).eq(55);
    });

    it("Error when copying a composite, copy again", async () => {
        let core = await createTestCore({
            doenetML: `
    <p>
      <group name="g" newNamespace>
        <group name='g'>
          <function name="f" numinputs="2">x+y</function>
        </group>
        
        <group copySource="g" newNamespace name="g2" >
          <function name="f" numinputs="2">z</function>
        </group>
      </group>
    </p>
    <p>
      <group copySource="g" name="g2" />
    </p>
`,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/g/f"].stateValues.formula.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/g/g2/f"].stateValues.formula.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/g2/f"].stateValues.formula.tree).eqls([
            "+",
            "x",
            "y",
        ]);
        expect(stateVariables["/g2/g2/f"].stateValues.formula.tree).eqls([
            "+",
            "x",
            "y",
        ]);

        const errorWarnings = core.core!.getErrorWarnings().errorWarnings;

        expect(errorWarnings.errors.length).eq(1);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            "Duplicate component name: f",
        );
        expect(errorWarnings.errors[0].position.lineBegin).eq(9);
        expect(errorWarnings.errors[0].position.charBegin).eq(11);
        expect(errorWarnings.errors[0].position.lineEnd).eq(9);
        expect(errorWarnings.errors[0].position.charEnd).eq(55);
    });
});
