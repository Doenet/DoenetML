import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Error Tests", async () => {
    it("Mismatched tags at base level, component without canDisplayChildErrors", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
<math name="good">x+y</math>

<math name="bad">a+b</number>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[resolveComponentName("good")].stateValues.value.tree,
        ).eqls(["+", "x", "y"]);
        expect(stateVariables[resolveComponentName("bad")].componentType).eq(
            "_error",
        );

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(2);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain("has no closing tag");
        expect(errorWarnings.errors[0].position.start.line).eq(4);
        expect(errorWarnings.errors[0].position.start.column).eq(1);
        expect(errorWarnings.errors[0].position.end.line).eq(4);
        expect(errorWarnings.errors[0].position.end.column).eq(18);

        expect(errorWarnings.errors[1].message).contain(
            "Mismatched closing tag",
        );
        expect(errorWarnings.errors[1].position.start.line).eq(4);
        expect(errorWarnings.errors[1].position.start.column).eq(21);
        expect(errorWarnings.errors[1].position.end.line).eq(4);
        expect(errorWarnings.errors[1].position.end.column).eq(30);
    });

    it("Mismatched tags at base level, component with canDisplayChildErrors", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
<p name="good">hi</p>

<p name="bad">bye</number>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[resolveComponentName("good")].stateValues.text,
        ).eq("hi");
        expect(
            stateVariables[resolveComponentName("bad")].stateValues.text.trim(),
        ).eq("bye");

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(2);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain("has no closing tag");
        expect(errorWarnings.errors[0].position.start.line).eq(4);
        expect(errorWarnings.errors[0].position.start.column).eq(1);
        expect(errorWarnings.errors[0].position.end.line).eq(4);
        expect(errorWarnings.errors[0].position.end.column).eq(15);

        expect(errorWarnings.errors[1].message).contain(
            "Mismatched closing tag",
        );
        expect(errorWarnings.errors[1].position.start.line).eq(4);
        expect(errorWarnings.errors[1].position.start.column).eq(18);
        expect(errorWarnings.errors[1].position.end.line).eq(4);
        expect(errorWarnings.errors[1].position.end.column).eq(27);
    });

    it("Mismatched tags in section, later tags outside survive", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
<section name="sec">
  <math name="good">x+y</math>
  <math name="bad">a+b</number>
</section>
<math name="m">x</math>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[resolveComponentName("good")].stateValues.value.tree,
        ).eqls(["+", "x", "y"]);
        expect(stateVariables[resolveComponentName("bad")].componentType).eq(
            "_error",
        );

        // confirm tag after section survives
        expect(
            stateVariables[resolveComponentName("m")].stateValues.value.tree,
        ).eq("x");

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(2);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain("has no closing tag");
        expect(errorWarnings.errors[0].position.start.line).eq(4);
        expect(errorWarnings.errors[0].position.start.column).eq(3);
        expect(errorWarnings.errors[0].position.end.line).eq(4);
        expect(errorWarnings.errors[0].position.end.column).eq(20);

        expect(errorWarnings.errors[1].message).contain(
            "Mismatched closing tag",
        );
        expect(errorWarnings.errors[1].position.start.line).eq(4);
        expect(errorWarnings.errors[1].position.start.column).eq(23);
        expect(errorWarnings.errors[1].position.end.line).eq(4);
        expect(errorWarnings.errors[1].position.end.column).eq(32);
    });

    it("More parsing errors", async () => {
        let { core, resolveComponentName } = await createTestCore({
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

        expect(stateVariables[resolveComponentName("m1")].componentType).eq(
            "_error",
        );
        expect(
            stateVariables[resolveComponentName("sec")].stateValues.title,
        ).eq("Section 1");
        expect(stateVariables[resolveComponentName("_p3")].stateValues.text).eq(
            "Hello there!",
        );

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(7);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(`no closing tag`);
        expect(errorWarnings.errors[0].position.start.line).eq(3);
        expect(errorWarnings.errors[0].position.start.column).eq(3);
        expect(errorWarnings.errors[0].position.end.line).eq(3);
        expect(errorWarnings.errors[0].position.end.column).eq(19);

        expect(errorWarnings.errors[1].message).contain(
            "no corresponding opening tag",
        );
        expect(errorWarnings.errors[1].position.start.line).eq(7);
        expect(errorWarnings.errors[1].position.start.column).eq(1);
        expect(errorWarnings.errors[1].position.end.line).eq(7);
        expect(errorWarnings.errors[1].position.end.column).eq(7);

        expect(errorWarnings.errors[2].message).contain("was not closed");
        expect(errorWarnings.errors[2].position.start.line).eq(9);
        expect(errorWarnings.errors[2].position.start.column).eq(1);
        expect(errorWarnings.errors[2].position.end.line).eq(9);
        expect(errorWarnings.errors[2].position.end.column).eq(3);

        expect(errorWarnings.errors[3].message).contain("no closing tag");
        expect(errorWarnings.errors[3].position.start.line).eq(11);
        expect(errorWarnings.errors[3].position.start.column).eq(1);
        expect(errorWarnings.errors[3].position.end.line).eq(11);
        expect(errorWarnings.errors[3].position.end.column).eq(21);

        expect(errorWarnings.errors[4].message).contain(
            "Invalid component type: <apple>",
        );
        expect(errorWarnings.errors[4].position.start.line).eq(17);
        expect(errorWarnings.errors[4].position.start.column).eq(3);
        expect(errorWarnings.errors[4].position.end.line).eq(17);
        expect(errorWarnings.errors[4].position.end.column).eq(42);

        expect(errorWarnings.errors[5].message).contain(
            "Invalid component type: <banana>",
        );
        expect(errorWarnings.errors[5].position.start.line).eq(18);
        expect(errorWarnings.errors[5].position.start.column).eq(3);
        expect(errorWarnings.errors[5].position.end.line).eq(18);
        expect(errorWarnings.errors[5].position.end.column).eq(31);

        expect(errorWarnings.errors[6].message).contain(
            `Invalid attribute "h"`,
        );
        expect(errorWarnings.errors[6].position.start.line).eq(9);
        expect(errorWarnings.errors[6].position.start.column).eq(1);
        expect(errorWarnings.errors[6].position.end.line).eq(19);
        expect(errorWarnings.errors[6].position.end.column).eq(3);
    });

    it("Parsing errors, correctly find end of self-closing tag", async () => {
        let { core } = await createTestCore({
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
        expect(errorWarnings.errors[0].position.start.line).eq(2);
        expect(errorWarnings.errors[0].position.start.column).eq(1);
        expect(errorWarnings.errors[0].position.end.line).eq(2);
        expect(errorWarnings.errors[0].position.end.column).eq(8);

        expect(errorWarnings.errors[1].message).contain(
            "Invalid component type: <bcd>",
        );
        expect(errorWarnings.errors[1].position.start.line).eq(3);
        expect(errorWarnings.errors[1].position.start.column).eq(3);
        expect(errorWarnings.errors[1].position.end.line).eq(3);
        expect(errorWarnings.errors[1].position.end.column).eq(12);

        expect(errorWarnings.errors[2].message).contain(
            "Invalid component type: <cde>",
        );
        expect(errorWarnings.errors[2].position.start.line).eq(4);
        expect(errorWarnings.errors[2].position.start.column).eq(1);
        expect(errorWarnings.errors[2].position.end.line).eq(5);
        expect(errorWarnings.errors[2].position.end.column).eq(3);

        expect(errorWarnings.errors[3].message).contain(
            "Invalid component type: <def>",
        );
        expect(errorWarnings.errors[3].position.start.line).eq(6);
        expect(errorWarnings.errors[3].position.start.column).eq(5);
        expect(errorWarnings.errors[3].position.end.line).eq(8);
        expect(errorWarnings.errors[3].position.end.column).eq(3);

        expect(errorWarnings.errors[4].message).contain(
            "Invalid component type: <efg>",
        );
        expect(errorWarnings.errors[4].position.start.line).eq(9);
        expect(errorWarnings.errors[4].position.start.column).eq(1);
        expect(errorWarnings.errors[4].position.end.line).eq(10);
        expect(errorWarnings.errors[4].position.end.column).eq(4);

        expect(errorWarnings.errors[5].message).contain(
            "Invalid component type: <fgh>",
        );
        expect(errorWarnings.errors[5].position.start.line).eq(11);
        expect(errorWarnings.errors[5].position.start.column).eq(1);
        expect(errorWarnings.errors[5].position.end.line).eq(12);
        expect(errorWarnings.errors[5].position.end.column).eq(5);

        expect(errorWarnings.errors[6].message).contain(
            "Invalid component type: <ghi>",
        );
        expect(errorWarnings.errors[6].position.start.line).eq(13);
        expect(errorWarnings.errors[6].position.start.column).eq(1);
        expect(errorWarnings.errors[6].position.end.line).eq(14);
        expect(errorWarnings.errors[6].position.end.column).eq(7);
    });

    // TODO: re-enable once we again handle invalid names. See issue #482.
    it.skip("Naming errors", async () => {
        let { core } = await createTestCore({
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

        expect(errorWarnings.errors.length).eq(3);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            "Invalid component name: _p",
        );
        expect(errorWarnings.errors[0].position.start.line).eq(2);
        expect(errorWarnings.errors[0].position.start.column).eq(1);
        expect(errorWarnings.errors[0].position.end.line).eq(2);
        expect(errorWarnings.errors[0].position.end.column).eq(15);

        expect(errorWarnings.errors[1].message).contain(
            "Invalid component name: p@",
        );
        expect(errorWarnings.errors[1].position.start.line).eq(3);
        expect(errorWarnings.errors[1].position.start.column).eq(5);
        expect(errorWarnings.errors[1].position.end.line).eq(3);
        expect(errorWarnings.errors[1].position.end.column).eq(19);

        expect(errorWarnings.errors[2].message).contain(
            "Cannot have a blank name",
        );
        expect(errorWarnings.errors[2].position.start.line).eq(8);
        expect(errorWarnings.errors[2].position.start.column).eq(1);
        expect(errorWarnings.errors[2].position.end.line).eq(8);
        expect(errorWarnings.errors[2].position.end.column).eq(22);
    });

    // TODO: re-enable once we again handle including abstract component types in DoenetML. See issue #485.
    it.skip("Abstract component give invalid component type", async () => {
        let { core } = await createTestCore({
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
        expect(errorWarnings.errors[0].position.start.line).eq(2);
        expect(errorWarnings.errors[0].position.start.column).eq(1);
        expect(errorWarnings.errors[0].position.end.line).eq(2);
        expect(errorWarnings.errors[0].position.end.column).eq(10);

        expect(errorWarnings.errors[1].message).contain(
            "Invalid component type: <_inline>",
        );
        expect(errorWarnings.errors[1].position.start.line).eq(3);
        expect(errorWarnings.errors[1].position.start.column).eq(1);
        expect(errorWarnings.errors[1].position.end.line).eq(3);
        expect(errorWarnings.errors[1].position.end.column).eq(25);
    });

    it("Invalid attribute errors", async () => {
        let { core } = await createTestCore({
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
        expect(errorWarnings.errors[0].position.start.line).eq(3);
        expect(errorWarnings.errors[0].position.start.column).eq(5);
        expect(errorWarnings.errors[0].position.end.line).eq(3);
        expect(errorWarnings.errors[0].position.end.column).eq(34);
    });

    // TODO: decide what to do about circular references
    // Not fixing it since suspect circular reference detection is a major source of slowdown
    it.skip("Circular dependency with copy source", async () => {
        let { core, resolveComponentName } = await createTestCore({
            doenetML: `
<math extend="$a1" name="a1" />

<math extend="$b1" name="b2" />
<math extend="$b2" name="b1" />

<math extend="$c1" name="c2" />
<math extend="$c2" name="c3" />
<math extend="$c3" name="c1" />

<math extend="$d1" name="d2" />
<math extend="$d2" name="d3" />
<math extend="$d3" name="d4" />
<math extend="$d4" name="d1" />

<math extend="$e1" name="e2" />
<math extend="$e2" name="e3" />
<math extend="$e3" name="e4" />
<math extend="$e4" name="e5" />

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[resolveComponentName("e2")].stateValues.value.tree,
        ).eq("＿");
        expect(
            stateVariables[resolveComponentName("e3")].stateValues.value.tree,
        ).eq("＿");
        expect(
            stateVariables[resolveComponentName("e4")].stateValues.value.tree,
        ).eq("＿");
        expect(
            stateVariables[resolveComponentName("e5")].stateValues.value.tree,
        ).eq("＿");

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(4);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain(
            "Circular dependency involving these components: <math> (line 2)",
        );
        expect(errorWarnings.errors[0].position.start.line).eq(2);
        expect(errorWarnings.errors[0].position.start.column).eq(1);
        expect(errorWarnings.errors[0].position.end.line).eq(2);
        expect(errorWarnings.errors[0].position.end.column).eq(34);

        // temporary messages until can better detect circular dependency with copysource
        expect(errorWarnings.errors[1].message).contain(
            "Circular dependency involving these components: <math> (line 4)",
        );
        expect(errorWarnings.errors[1].position.start.line).eq(4);
        expect(errorWarnings.errors[1].position.start.column).eq(1);
        expect(errorWarnings.errors[1].position.end.line).eq(4);
        expect(errorWarnings.errors[1].position.end.column).eq(34);

        expect(errorWarnings.errors[2].message).contain(
            "Circular dependency involving these components: <math> (line 7)",
        );
        expect(errorWarnings.errors[2].position.start.line).eq(7);
        expect(errorWarnings.errors[2].position.start.column).eq(1);
        expect(errorWarnings.errors[2].position.end.line).eq(7);
        expect(errorWarnings.errors[2].position.end.column).eq(34);

        expect(errorWarnings.errors[3].message).contain(
            "Circular dependency involving these components: <math> (line 11)",
        );
        expect(errorWarnings.errors[3].position.start.line).eq(11);
        expect(errorWarnings.errors[3].position.start.column).eq(1);
        expect(errorWarnings.errors[3].position.end.line).eq(11);
        expect(errorWarnings.errors[3].position.end.column).eq(34);
    });

    it.skip("Circular dependency with macro children", async () => {
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

    it.skip("Circular dependency with copy source children", async () => {
        let doenetML1 = `<text name="t1"><text extend="$t1"/></text>`;

        let doenetML2 = `<text name="t1"><text extend="$t2"/></text>
<text name="t2"><text extend="$t1"/></text>`;

        let doenetML3 = `<text name="t1"><text extend="$t2"/></text>
<text name="t2"><text extend="$t3"/></text>
<text name="t3"><text extend="$t1"/></text>`;

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

    it("Get line/char numbers with no linebreaks", async () => {
        let { core } = await createTestCore({
            doenetML: `<bad>`,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(2);
        expect(errorWarnings.warnings.length).eq(0);

        expect(errorWarnings.errors[0].message).contain("has no closing tag");
        expect(errorWarnings.errors[0].position.start.line).eq(1);
        expect(errorWarnings.errors[0].position.start.column).eq(1);
        expect(errorWarnings.errors[0].position.end.line).eq(1);
        expect(errorWarnings.errors[0].position.end.column).eq(6);

        expect(errorWarnings.errors[1].message).contain(
            "Invalid component type: <bad>",
        );
        expect(errorWarnings.errors[1].position.start.line).eq(1);
        expect(errorWarnings.errors[1].position.start.column).eq(1);
        expect(errorWarnings.errors[1].position.end.line).eq(1);
        expect(errorWarnings.errors[1].position.end.column).eq(6);
    });

    it("Copy section with an error", async () => {
        let { core } = await createTestCore({
            doenetML: `
<section name="sec">
  <p>
</section>

<section extend="$sec" name="sec2" />
`,
        });

        let errorWarnings = core.core!.errorWarnings;

        // TODO: do we care that this error appears twice? Ideally it should appear only once.
        expect(errorWarnings.errors.length).eq(2);
        expect(errorWarnings.warnings.length).eq(0);

        for (let i = 0; i < 2; i++) {
            expect(errorWarnings.errors[i].message).contain("no closing tag");
            expect(errorWarnings.errors[i].position.start.line).eq(3);
            expect(errorWarnings.errors[i].position.start.column).eq(3);
            expect(errorWarnings.errors[i].position.end.line).eq(3);
            expect(errorWarnings.errors[i].position.end.column).eq(6);
        }
    });
});
