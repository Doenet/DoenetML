import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Error Tests @group2", async () => {
    it("Mismatched tags at base level, component without canDisplayChildErrors", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<math name="good">x+y</math>

<math name="bad">a+b</number>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("good")].stateValues.value
                .tree,
        ).eqls(["+", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("bad")].componentType,
        ).eq("_error");

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(2);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.infos.length).eq(0);

        expect(diagnosticsByType.errors[0].message).contain(
            "has no closing tag",
        );
        expect(diagnosticsByType.errors[0].position.start.line).eq(4);
        expect(diagnosticsByType.errors[0].position.start.column).eq(1);
        expect(diagnosticsByType.errors[0].position.end.line).eq(4);
        expect(diagnosticsByType.errors[0].position.end.column).eq(18);

        expect(diagnosticsByType.errors[1].message).contain(
            "Mismatched closing tag",
        );
        expect(diagnosticsByType.errors[1].position.start.line).eq(4);
        expect(diagnosticsByType.errors[1].position.start.column).eq(21);
        expect(diagnosticsByType.errors[1].position.end.line).eq(4);
        expect(diagnosticsByType.errors[1].position.end.column).eq(30);
    });

    it("Mismatched tags at base level, component with canDisplayChildErrors", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<p name="good">hi</p>

<p name="bad">bye</number>

    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("good")].stateValues.text,
        ).eq("hi");
        expect(
            stateVariables[
                await resolvePathToNodeIdx("bad")
            ].stateValues.text.trim(),
        ).eq("bye");

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(2);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.infos.length).eq(0);

        expect(diagnosticsByType.errors[0].message).contain(
            "has no closing tag",
        );
        expect(diagnosticsByType.errors[0].position.start.line).eq(4);
        expect(diagnosticsByType.errors[0].position.start.column).eq(1);
        expect(diagnosticsByType.errors[0].position.end.line).eq(4);
        expect(diagnosticsByType.errors[0].position.end.column).eq(15);

        expect(diagnosticsByType.errors[1].message).contain(
            "Mismatched closing tag",
        );
        expect(diagnosticsByType.errors[1].position.start.line).eq(4);
        expect(diagnosticsByType.errors[1].position.start.column).eq(18);
        expect(diagnosticsByType.errors[1].position.end.line).eq(4);
        expect(diagnosticsByType.errors[1].position.end.column).eq(27);
    });

    it("Mismatched tags in section, later tags outside survive", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
            stateVariables[await resolvePathToNodeIdx("good")].stateValues.value
                .tree,
        ).eqls(["+", "x", "y"]);
        expect(
            stateVariables[await resolvePathToNodeIdx("bad")].componentType,
        ).eq("_error");

        // confirm tag after section survives
        expect(
            stateVariables[await resolvePathToNodeIdx("m")].stateValues.value
                .tree,
        ).eq("x");

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(2);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.infos.length).eq(0);

        expect(diagnosticsByType.errors[0].message).contain(
            "has no closing tag",
        );
        expect(diagnosticsByType.errors[0].position.start.line).eq(4);
        expect(diagnosticsByType.errors[0].position.start.column).eq(3);
        expect(diagnosticsByType.errors[0].position.end.line).eq(4);
        expect(diagnosticsByType.errors[0].position.end.column).eq(20);

        expect(diagnosticsByType.errors[1].message).contain(
            "Mismatched closing tag",
        );
        expect(diagnosticsByType.errors[1].position.start.line).eq(4);
        expect(diagnosticsByType.errors[1].position.start.column).eq(23);
        expect(diagnosticsByType.errors[1].position.end.line).eq(4);
        expect(diagnosticsByType.errors[1].position.end.column).eq(32);
    });

    it("More parsing errors", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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

        expect(
            stateVariables[await resolvePathToNodeIdx("m1")].componentType,
        ).eq("_error");
        expect(
            stateVariables[await resolvePathToNodeIdx("sec")].stateValues.title,
        ).eq("Section 1");
        expect(
            stateVariables[await resolvePathToNodeIdx("_p3")].stateValues.text,
        ).eq("Hello there!");

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(7);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.infos.length).eq(0);

        const firstNoClosingTag = diagnosticsByType.errors.find((error) =>
            error.message.includes("no closing tag"),
        );
        expect(firstNoClosingTag?.position.start.line).eq(3);
        expect(firstNoClosingTag?.position.start.column).eq(3);
        expect(firstNoClosingTag?.position.end.line).eq(3);
        expect(firstNoClosingTag?.position.end.column).eq(19);

        const noOpeningTag = diagnosticsByType.errors.find((error) =>
            error.message.includes("no corresponding opening tag"),
        );
        expect(noOpeningTag?.position.start.line).eq(7);
        expect(noOpeningTag?.position.start.column).eq(1);
        expect(noOpeningTag?.position.end.line).eq(7);
        expect(noOpeningTag?.position.end.column).eq(7);

        const notClosedTag = diagnosticsByType.errors.find((error) =>
            error.message.includes("was not closed"),
        );
        expect(notClosedTag?.position.start.line).eq(9);
        expect(notClosedTag?.position.start.column).eq(1);
        expect(notClosedTag?.position.end.line).eq(9);
        expect(notClosedTag?.position.end.column).eq(3);

        const secondNoClosingTag = diagnosticsByType.errors.find(
            (error) =>
                error.message.includes("no closing tag") &&
                error.position?.start.line === 11,
        );
        expect(secondNoClosingTag?.position.start.column).eq(1);
        expect(secondNoClosingTag?.position.end.line).eq(11);
        expect(secondNoClosingTag?.position.end.column).eq(21);

        const invalidApple = diagnosticsByType.errors.find((error) =>
            error.message.includes("Invalid component type: `<apple>`"),
        );
        expect(invalidApple?.position.start.line).eq(17);
        expect(invalidApple?.position.start.column).eq(3);
        expect(invalidApple?.position.end.line).eq(17);
        expect(invalidApple?.position.end.column).eq(42);

        const invalidBanana = diagnosticsByType.errors.find((error) =>
            error.message.includes("Invalid component type: `<banana>`"),
        );
        expect(invalidBanana?.position.start.line).eq(18);
        expect(invalidBanana?.position.start.column).eq(3);
        expect(invalidBanana?.position.end.line).eq(18);
        expect(invalidBanana?.position.end.column).eq(31);

        const invalidAttributeH = diagnosticsByType.errors.find((error) =>
            error.message.includes(`Invalid attribute "h"`),
        );
        expect(invalidAttributeH?.position.start.line).eq(9);
        expect(invalidAttributeH?.position.start.column).eq(1);
        expect(invalidAttributeH?.position.end.line).eq(19);
        expect(invalidAttributeH?.position.end.column).eq(3);
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

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(7);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.infos.length).eq(0);

        expect(diagnosticsByType.errors[0].message).contain(
            "Invalid component type: `<abc>`",
        );
        expect(diagnosticsByType.errors[0].position.start.line).eq(2);
        expect(diagnosticsByType.errors[0].position.start.column).eq(1);
        expect(diagnosticsByType.errors[0].position.end.line).eq(2);
        expect(diagnosticsByType.errors[0].position.end.column).eq(8);

        expect(diagnosticsByType.errors[1].message).contain(
            "Invalid component type: `<bcd>`",
        );
        expect(diagnosticsByType.errors[1].position.start.line).eq(3);
        expect(diagnosticsByType.errors[1].position.start.column).eq(3);
        expect(diagnosticsByType.errors[1].position.end.line).eq(3);
        expect(diagnosticsByType.errors[1].position.end.column).eq(12);

        expect(diagnosticsByType.errors[2].message).contain(
            "Invalid component type: `<cde>`",
        );
        expect(diagnosticsByType.errors[2].position.start.line).eq(4);
        expect(diagnosticsByType.errors[2].position.start.column).eq(1);
        expect(diagnosticsByType.errors[2].position.end.line).eq(5);
        expect(diagnosticsByType.errors[2].position.end.column).eq(3);

        expect(diagnosticsByType.errors[3].message).contain(
            "Invalid component type: `<def>`",
        );
        expect(diagnosticsByType.errors[3].position.start.line).eq(6);
        expect(diagnosticsByType.errors[3].position.start.column).eq(5);
        expect(diagnosticsByType.errors[3].position.end.line).eq(8);
        expect(diagnosticsByType.errors[3].position.end.column).eq(3);

        expect(diagnosticsByType.errors[4].message).contain(
            "Invalid component type: `<efg>`",
        );
        expect(diagnosticsByType.errors[4].position.start.line).eq(9);
        expect(diagnosticsByType.errors[4].position.start.column).eq(1);
        expect(diagnosticsByType.errors[4].position.end.line).eq(10);
        expect(diagnosticsByType.errors[4].position.end.column).eq(4);

        expect(diagnosticsByType.errors[5].message).contain(
            "Invalid component type: `<fgh>`",
        );
        expect(diagnosticsByType.errors[5].position.start.line).eq(11);
        expect(diagnosticsByType.errors[5].position.start.column).eq(1);
        expect(diagnosticsByType.errors[5].position.end.line).eq(12);
        expect(diagnosticsByType.errors[5].position.end.column).eq(5);

        expect(diagnosticsByType.errors[6].message).contain(
            "Invalid component type: `<ghi>`",
        );
        expect(diagnosticsByType.errors[6].position.start.line).eq(13);
        expect(diagnosticsByType.errors[6].position.start.column).eq(1);
        expect(diagnosticsByType.errors[6].position.end.line).eq(14);
        expect(diagnosticsByType.errors[6].position.end.column).eq(7);
    });

    it("Naming errors", async () => {
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

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(3);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.infos.length).eq(0);

        expect(diagnosticsByType.errors[0].message).contain(
            "Invalid attribute name='_p'",
        );
        expect(diagnosticsByType.errors[0].position.start.line).eq(2);
        expect(diagnosticsByType.errors[0].position.start.column).eq(4);
        expect(diagnosticsByType.errors[0].position.end.line).eq(2);
        expect(diagnosticsByType.errors[0].position.end.column).eq(13);

        expect(diagnosticsByType.errors[1].message).contain(
            "Invalid attribute name='p@'",
        );
        expect(diagnosticsByType.errors[1].position.start.line).eq(3);
        expect(diagnosticsByType.errors[1].position.start.column).eq(8);
        expect(diagnosticsByType.errors[1].position.end.line).eq(3);
        expect(diagnosticsByType.errors[1].position.end.column).eq(17);

        expect(diagnosticsByType.errors[2].message).contain(
            "Invalid attribute name=''",
        );
        expect(diagnosticsByType.errors[2].position.start.line).eq(8);
        expect(diagnosticsByType.errors[2].position.start.column).eq(4);
        expect(diagnosticsByType.errors[2].position.end.line).eq(8);
        expect(diagnosticsByType.errors[2].position.end.column).eq(8);
    });

    it("Abstract component give invalid component type", async () => {
        let { core } = await createTestCore({
            doenetML: `
<_base />
<_inline>hello</_inline>
    `,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(2);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.infos.length).eq(0);

        expect(diagnosticsByType.errors[0].message).contain(
            'Invalid component name "_base"',
        );
        expect(diagnosticsByType.errors[0].position.start.line).eq(2);
        expect(diagnosticsByType.errors[0].position.start.column).eq(1);
        expect(diagnosticsByType.errors[0].position.end.line).eq(2);
        expect(diagnosticsByType.errors[0].position.end.column).eq(10);

        expect(diagnosticsByType.errors[1].message).contain(
            'Invalid component name "_inline"',
        );
        expect(diagnosticsByType.errors[1].position.start.line).eq(3);
        expect(diagnosticsByType.errors[1].position.start.column).eq(1);
        expect(diagnosticsByType.errors[1].position.end.line).eq(3);
        expect(diagnosticsByType.errors[1].position.end.column).eq(25);
    });

    it("Invalid attribute errors", async () => {
        let { core } = await createTestCore({
            doenetML: `
    <p>Good</p>
    <p bad="not good">Unhappy</p>
    <p>Good again</p>
    `,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(1);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.infos.length).eq(0);

        expect(diagnosticsByType.errors[0].message).contain(
            `Invalid attribute "bad" for a component of type \`<p>\``,
        );
        expect(diagnosticsByType.errors[0].position.start.line).eq(3);
        expect(diagnosticsByType.errors[0].position.start.column).eq(5);
        expect(diagnosticsByType.errors[0].position.end.line).eq(3);
        expect(diagnosticsByType.errors[0].position.end.column).eq(34);
    });

    // Each extend on a cycle is an error at the extend, found when the
    // document loads (D14, `utils/dast/referenceCycles.ts`). A chain that
    // ends in a name that names nothing is not a cycle: each extend on it is
    // missing.
    it("Circular dependency with copy source", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
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
        for (const name of ["e2", "e3", "e4", "e5"]) {
            expect(
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .value.tree,
                name,
            ).eq("＿");
        }

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.warnings.map((warning) => warning.code)).eqls([
            "doenet-w0104",
        ]);
        expect(diagnosticsByType.infos.length).eq(0);

        const cycleLines = [2, 4, 5, 7, 8, 9, 11, 12, 13, 14];
        expect(diagnosticsByType.errors.length).eq(cycleLines.length);
        diagnosticsByType.errors.forEach((error, ind) => {
            expect(error.code).eq("doenet-e0005");
            expect(error.message).eq(
                "Circular dependency detected involving `<math>` component.",
            );
            expect(error.position!.start.line).eq(cycleLines[ind]);
            expect(error.position!.start.column).eq(1);
            expect(error.position!.end.line).eq(cycleLines[ind]);
            expect(error.position!.end.column).eq(32);
        });
    });

    it("Circular dependency with macro children", async () => {
        const documents: [string, string[]][] = [
            [`<text name="t1">$t1</text>`, ["1:17"]],
            [
                `<text name="t1">$t2</text>
      <text name="t2">$t1</text>`,
                ["1:17", "2:23"],
            ],
            [
                `<text name="t1">$t2</text>
      <text name="t2">$t3</text>
      <text name="t3">$t1</text>`,
                ["1:17", "2:23", "3:23"],
            ],
        ];

        for (const [doenetML, starts] of documents) {
            const { core } = await createTestCore({ doenetML });
            const errors = getDiagnosticsByType(core).errors;
            expect(
                errors.map(
                    (error) =>
                        `${error.code} ${error.position!.start.line}:${error.position!.start.column}`,
                ),
            ).eqls(starts.map((start) => `doenet-e0005 ${start}`));
        }
    });

    it("Circular dependency with copy source children", async () => {
        const documents: [string, number[]][] = [
            [`<text name="t1"><text extend="$t1"/></text>`, [1]],
            [
                `<text name="t1"><text extend="$t2"/></text>
<text name="t2"><text extend="$t1"/></text>`,
                [1, 2],
            ],
            [
                `<text name="t1"><text extend="$t2"/></text>
<text name="t2"><text extend="$t3"/></text>
<text name="t3"><text extend="$t1"/></text>`,
                [1, 2, 3],
            ],
        ];

        for (const [doenetML, lines] of documents) {
            const { core } = await createTestCore({ doenetML });
            const errors = getDiagnosticsByType(core).errors;
            expect(
                errors.map(
                    (error) =>
                        `${error.code} ${error.position!.start.line}:${error.position!.start.column}-${error.position!.end.column}`,
                ),
            ).eqls(lines.map((line) => `doenet-e0005 ${line}:17-37`));
        }
    });

    it("Get line/char numbers with no linebreaks", async () => {
        let { core } = await createTestCore({
            doenetML: `<bad>`,
        });

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(2);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.infos.length).eq(0);

        const noClosingTagError = diagnosticsByType.errors.find((error) =>
            error.message.includes("has no closing tag"),
        );
        expect(noClosingTagError?.position.start.line).eq(1);
        expect(noClosingTagError?.position.start.column).eq(1);
        expect(noClosingTagError?.position.end.line).eq(1);
        expect(noClosingTagError?.position.end.column).eq(6);

        const invalidBadError = diagnosticsByType.errors.find((error) =>
            error.message.includes("Invalid component type: `<bad>`"),
        );
        expect(invalidBadError?.position.start.line).eq(1);
        expect(invalidBadError?.position.start.column).eq(1);
        expect(invalidBadError?.position.end.line).eq(1);
        expect(invalidBadError?.position.end.column).eq(6);
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

        let diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(1);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.infos.length).eq(0);

        expect(diagnosticsByType.errors[0].message).contain("no closing tag");
        expect(diagnosticsByType.errors[0].position.start.line).eq(3);
        expect(diagnosticsByType.errors[0].position.start.column).eq(3);
        expect(diagnosticsByType.errors[0].position.end.line).eq(3);
        expect(diagnosticsByType.errors[0].position.end.column).eq(6);
    });

    it("Unquoted attribute value emits exactly one error (#1197)", async () => {
        // `<section name=foo>` used to produce four overlapping
        // diagnostics — one from the worker's attribute expander
        // ("Invalid attribute `foo`"), two duplicate parser errors
        // ("Invalid attribute `name=` appears to be missing a value"),
        // and one from `enforce-valid-names` ("Invalid attribute
        // name=''").  `lezer-to-dast` now detects the pair, strips
        // both halves from `node.attributes`, and emits a single
        // unified error naming the corrected form.  `error_type` is
        // left undefined so the worker takes the `_error`-component
        // branch in `convertNormalizedDast`, surfacing the familiar
        // orange error block in the viewer; severity matches the
        // sibling shapes `<section name>` / `<section name="4" />`
        // that `enforce-valid-names` already flags as errors.
        let { core } = await createTestCore({
            doenetML: `<section name=foo></section>`,
        });

        await core.returnAllStateVariables(false, true);

        const diagnosticsByType = getDiagnosticsByType(core);

        expect(diagnosticsByType.errors.length).eq(1);
        expect(diagnosticsByType.warnings.length).eq(0);
        expect(diagnosticsByType.infos.length).eq(0);

        expect(diagnosticsByType.errors[0].message).eq(
            'Attribute values must be enclosed in quotes: `name="foo"`',
        );
    });

    it("builds a document holding a half-typed function call", async () => {
        // `$$g($$f(<math>3</math>)` threw out of the parser, so the document
        // never built and the reader got a blank page — and that is a document
        // an author passes through on the way to writing the one below, with
        // the editor parsing on every keystroke. The unclosed call declines and
        // its text is left alone, as every other unfinished shape here is.
        const { core } = await createTestCore({
            doenetML: `
<function name="f" variables="x">x^2</function>
<function name="g" variables="a b">a+b</function>
<p>$$g($$f(<math>3</math>)</p>
            `,
        });
        const diagnosticsByType = getDiagnosticsByType(core);
        expect(diagnosticsByType.errors).eqls([]);

        // ...and the document it was on the way to still evaluates both calls.
        const { core: finished, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<function name="f" variables="x">x^2</function>
<function name="g" variables="a b">a+b</function>
<p name="p">$$g($$f(<math>3</math>), 2)</p>
            `,
        });
        const stateVariables = await finished.returnAllStateVariables(
            false,
            true,
        );
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("11");
    });
});

/**
 * A reference to a component in error shows a blank, `＿`, and reports
 * nothing more: the error is reported once, where its cause is written
 * (DIAG-4, DIAG-5, VAL-5, #2449). That holds for a bare reference, an
 * `extend` and a `copy` of it, and for each kind of error shown in a
 * component's place.
 */
describe("A reference to a component in error @group2", async () => {
    async function shownAndReported(doenetML: string, names: string[]) {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const shown: Record<string, string> = {};
        for (const name of names) {
            shown[name] =
                stateVariables[
                    await resolvePathToNodeIdx(name)
                ].stateValues.text;
        }
        const { errors, warnings, infos } = getDiagnosticsByType(core);
        return { shown, errors, warnings, infos };
    }

    /** The source `doenetML` marks with `diagnostic`'s position. */
    function marked(doenetML: string, diagnostic: any) {
        return doenetML.substring(
            diagnostic.position.start.offset,
            diagnostic.position.end.offset,
        );
    }

    it("an invalid attribute: one error, and a blank at each reference", async () => {
        const doenetML = `<math name="m" blink="true">x</math>
<p name="p1">$m $m</p>
<math name="m2" extend="$m"/>
<math name="m3" copy="$m"/>
<p name="p2">$m2 $m3</p>`;
        const { shown, errors, warnings, infos } = await shownAndReported(
            doenetML,
            ["p1", "p2"],
        );
        expect(shown).eqls({ p1: "＿ ＿", p2: "＿ ＿" });
        expect(warnings).eqls([]);
        expect(infos).eqls([]);
        expect(errors.length).eq(1);
        expect(errors[0].code).eq("doenet-e0004");
        expect(marked(doenetML, errors[0])).eq(
            `<math name="m" blink="true">x</math>`,
        );
    });

    it("an extend that would change its content (D32): one error", async () => {
        const doenetML = `<repeat name="r" for="1 2" valueName="v"><p>$v</p></repeat>
<repeat name="r2" extend="$r" for="3 4"/>
<p name="p1">$r2 $r2</p>
<repeat name="r3" extend="$r2"/>
<p name="p2">$r3</p>`;
        const { shown, errors, warnings, infos } = await shownAndReported(
            doenetML,
            ["p1", "p2"],
        );
        expect(shown).eqls({ p1: "＿ ＿", p2: "＿" });
        expect(warnings).eqls([]);
        expect(infos).eqls([]);
        expect(errors.length).eq(1);
        expect(errors[0].code).eq("doenet-e0056");
        expect(marked(doenetML, errors[0])).eq(
            `<repeat name="r2" extend="$r" for="3 4"/>`,
        );
    });

    it("a type change that is an error (D26): one error", async () => {
        const doenetML = `<section name="sec"><p>hi</p></section>
<math name="m" extend="$sec"/>
<p name="p1">$m $m</p>
<math name="m2" extend="$m"/>
<math name="m3" copy="$m"/>
<p name="p2">$m2 $m3</p>`;
        const { shown, errors, warnings, infos } = await shownAndReported(
            doenetML,
            ["p1", "p2"],
        );
        expect(shown).eqls({ p1: "＿ ＿", p2: "＿ ＿" });
        expect(warnings).eqls([]);
        expect(infos).eqls([]);
        expect(errors.length).eq(1);
        expect(errors[0].code).eq("doenet-e0065");
        expect(marked(doenetML, errors[0])).eq(
            `<math name="m" extend="$sec"/>`,
        );
    });

    it("a copy of a component holding an error shows it, and reports nothing more", async () => {
        const doenetML = `<p name="p1">a <math blink="true">x</math></p>
<p name="p2" extend="$p1"/>
<p name="p3" copy="$p1"/>
$p1`;
        const { shown, errors, warnings, infos } = await shownAndReported(
            doenetML,
            ["p1", "p2", "p3"],
        );
        expect(shown).eqls({ p1: "a ", p2: "a ", p3: "a " });
        expect(warnings).eqls([]);
        expect(infos).eqls([]);
        expect(errors.length).eq(1);
        expect(errors[0].code).eq("doenet-e0004");
        expect(marked(doenetML, errors[0])).eq(`<math blink="true">x</math>`);
    });
});
