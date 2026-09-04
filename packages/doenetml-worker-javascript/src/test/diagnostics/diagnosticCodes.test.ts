import { describe, expect, it, vi } from "vitest";
import {
    DIAGNOSTIC_CODES,
    createDiagnosticFormatter,
    createTranslator,
} from "@doenet/i18n";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { callAction } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * i18n Phase 3 (#1518): diagnostics carry a stable code and the values that
 * fill their message in, alongside the English.
 *
 * Unlike the style descriptions of Phase 2, these are *not* translated in the
 * worker. A diagnostic is addressed to whoever is looking at the screen, so it
 * follows `uiLocale`, which the core has no business knowing — the worker's
 * job is to emit the code and the arguments, and the English that renders when
 * nothing better is available. What is checked here is the worker's half: that
 * the code and arguments survive to the record, and that the English is
 * byte-for-byte what the concatenated version produced.
 */
describe("coded diagnostics reach the record @group4", () => {
    it("attaches a code to a message with no arguments", async () => {
        const { core } = await createTestCore({
            doenetML: `
<graph>
  <ray name="r" through="(1,2)" endpoint="(0,0)" direction="(1,1)" />
</graph>
`,
        });

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0005");
        expect(warnings[0].message).eq(
            "Ray is prescribed by through, endpoint, and direction.  Ignoring specified through.",
        );
        expect(warnings[0].args).eq(undefined);
    });

    it("carries the list a message names, not the sentence it built", async () => {
        const { core } = await createTestCore({
            doenetML: `
<graph>
  <lineSegment name="l" endpoints="(1,2) (4,5)" slope="1" length="3" />
</graph>
`,
        });

        const { infos } = getDiagnosticsByType(core);
        expect(infos.length).eq(1);
        expect(infos[0].code).eq("doenet-i0001");
        expect(infos[0].args).eqls({ attributes: ["slope", "length"] });
        // The English is still what the hand-written phrase builder produced,
        // verb agreement and all — assertions elsewhere depend on it.
        expect(infos[0].message).eq(
            "slope and length are ignored when two endpoints are specified",
        );
    });

    // The plural selector's singular branch, through a real component rather
    // than a hand-built record — one attribute ignored, so the catalog has to
    // say "is" where the two-attribute case says "are".
    it("agrees the verb with a one-attribute list", async () => {
        const { core } = await createTestCore({
            doenetML: `
<graph>
  <lineSegment name="l" endpoints="(1,2)" midpoint="(4,6)" slope="1" />
</graph>
`,
        });

        const { infos } = getDiagnosticsByType(core);
        expect(infos.length).eq(1);
        expect(infos[0].code).eq("doenet-i0003");
        expect(infos[0].args).eqls({ attributes: ["slope"] });
        expect(infos[0].message).eq(
            "slope is ignored when an endpoint and a midpoint are both specified",
        );
    });

    it("attaches a code to the midpointOffset notice", async () => {
        const { core } = await createTestCore({
            doenetML: `
<graph>
  <lineSegment name="l" endpoints="(1,2) (4,5)" midpointOffset="0.3" />
</graph>
`,
        });

        const { infos } = getDiagnosticsByType(core);
        expect(infos.length).eq(1);
        expect(infos[0].code).eq("doenet-i0002");
        expect(infos[0].message).eq(
            "midpointOffset has no effect without a midpoint",
        );
    });

    it("carries interpolated values as data", async () => {
        const { core } = await createTestCore({
            doenetML: `<line name="l" equation="x^2 + y = 1" />`,
        });

        const { warnings } = getDiagnosticsByType(core);
        const invalidFormat = warnings.filter(
            (warning) => warning.code === "doenet-w0004",
        );
        expect(invalidFormat.length).toBeGreaterThan(0);
        expect(invalidFormat[0].args).eqls({ variable1: "x", variable2: "y" });
        expect(invalidFormat[0].message).eq(
            "Invalid format for equation of line in variables x and y.",
        );
    });

    // The point of carrying code and arguments rather than a finished string:
    // the main thread can render the message again in a language the worker
    // never saw. This is that step, run against the record the worker emitted.
    it("lets the main thread re-render the record in another language", async () => {
        const { core } = await createTestCore({
            doenetML: `
<graph>
  <lineSegment name="l" endpoints="(1,2) (4,5)" slope="1" length="3" />
</graph>
`,
        });

        const { infos } = getDiagnosticsByType(core);
        const formatEs = createDiagnosticFormatter(
            createTranslator(["es"], {
                es: "line-segment-attributes-ignored-with-endpoints = { $attributesCount ->\n        [one] { $attributes } se ignora\n       *[other] { $attributes } se ignoran\n    }",
            }),
            "es",
        );
        expect(formatEs(infos[0])).eq("slope y length se ignoran");
    });

    it("leaves a diagnostic that has not migrated untouched", () => {
        // Stated as a property of the record rather than by naming a component
        // that still holds a literal. The original version of this test used
        // `<sort>` as its example of an unmigrated diagnostic, and stopped
        // meaning anything the moment `<sort>` was migrated — every batch of
        // #1518 would break it again, and the fix would each time be to pick
        // another component that is merely next in line.
        const legacy = {
            type: "warning" as const,
            message: "Something the catalog has never heard of.",
        };

        const format = createDiagnosticFormatter(
            createTranslator(["es"], { es: "" }),
            "es",
        );
        expect(format(legacy)).eq(legacy.message);
    });

    it("gives every warning either a registered code or an English message", async () => {
        const { core } = await createTestCore({
            doenetML: `
<graph>
  <point name="p" />
</graph>
<sort name="s">a b c</sort>
`,
        });

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).toBeGreaterThan(0);
        for (const warning of warnings) {
            if (warning.code === undefined) {
                expect(warning.message.length).toBeGreaterThan(0);
            } else {
                expect(Object.keys(DIAGNOSTIC_CODES)).toContain(warning.code);
            }
        }
    });

    it("emits only codes the registry defines", async () => {
        const { core } = await createTestCore({
            doenetML: `
<graph>
  <ray name="r" through="(1,2)" endpoint="(0,0)" direction="(1,1)" />
  <lineSegment name="l" midpointOffset="1" />
</graph>
`,
        });

        const { warnings, infos } = getDiagnosticsByType(core);
        for (const diagnostic of [...warnings, ...infos]) {
            if (diagnostic.code !== undefined) {
                expect(
                    Object.keys(DIAGNOSTIC_CODES),
                    diagnostic.code,
                ).toContain(diagnostic.code);
            }
        }
    });

    // The two warnings that survived the core's invariant diagnostics becoming
    // developer logs (#1518). What separates them from the eighteen that did
    // not is that an author wrote something these can name: an index in a
    // reference, an `actionName` on a `target`. Everything the core knows and
    // the author doesn't — the state variable, the component index — went to
    // the console instead, so what is checked here is that the argument that
    // reaches the record is the source text and nothing else.
    it("names the reference an index cannot be applied to", async () => {
        const doenetML = `<point name="p" /><text extend="$p.styleDescription[1]" />`;
        const { core } = await createTestCore({ doenetML });

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0100");
        expect(warnings[0].args).eqls({
            reference: "$p.styleDescription[1]",
        });
        expect(warnings[0].message).eq(
            "Cannot reference index `$p.styleDescription[1]`",
        );
        // Marked on the `<text>` that wrote the index, not on the `<point>`
        // the reference resolved to. Attributing it to the referent would
        // put every reference to `$p` on `$p` itself.
        const { start, end } = warnings[0].position!;
        expect(doenetML.substring(start.offset, end.offset)).eq(
            `<text extend="$p.styleDescription[1]" />`,
        );
    });

    // The same warning from the other site in `arrayEntryNamesFromPropIndex`.
    // Above, `styleDescription` is not an array at all; here `vertexX1_1` is
    // an entry of one, and it is `arrayVarNameFromPropIndex` that can make no
    // name out of the index. One code covers both because the author's
    // mistake is the same one — the difference is a fact about the core, and
    // only the console line carries it (`… of 1`, with no trailing clause).
    it("names the reference when the array can make no name for the index", async () => {
        const { core } = await createTestCore({
            doenetML: `<polyline name="pg" vertices="(1,2) (3,4)" /><math extend="$pg.vertexX1_1[1]" />`,
        });

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0100");
        expect(warnings[0].args).eqls({ reference: "$pg.vertexX1_1[1]" });
        expect(warnings[0].message).eq(
            "Cannot reference index `$pg.vertexX1_1[1]`",
        );
    });

    it("names the target a missing action was asked of", async () => {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<point name="p" />
<callAction name="ca" target="$p" actionName="notAnAction" />`,
        });
        // The warning is raised when the action is invoked, not when the
        // document is built: until then nothing has asked the point for an
        // action it doesn't have.
        await callAction({
            componentIdx: await resolvePathToNodeIdx("ca"),
            core,
        });

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0102");
        expect(warnings[0].args).eqls({
            action: "notAnAction",
            reference: "$p",
        });
        expect(warnings[0].message).eq(
            "Cannot call notAnAction on component `$p`",
        );
    });

    // The diagnostics that are built for a caller rather than at the site that
    // knows the situation: a composite reporting a cycle, `ChildMatcher`
    // recording a mismatch for `Core` to raise a pass later, and reference
    // resolution failing only once the group's replacements are known. Each
    // crosses a boundary between where the arguments are gathered and where
    // the record is made, which is where a code is easiest to drop.
    it("codes a circular dependency a composite reports", async () => {
        const { core } = await createTestCore({
            doenetML: `
<point name="a">(2,3)
  <label><answer>$a</answer></label>
</point>
`,
        });

        const { errors } = getDiagnosticsByType(core);
        expect(errors.length).eq(1);
        expect(errors[0].code).eq("doenet-e0005");
        // `none` is the variant for a composite that never named a type, so
        // the clause the concatenated version appended is simply absent.
        expect(errors[0].args).eqls({ componentType: "none" });
        expect(errors[0].message).eq("Circular dependency detected.");
    });

    it("codes children that did not match, across the pass that raises them", async () => {
        const { core } = await createTestCore({
            doenetML: `<point><graph /></point>`,
        });

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0107");
        expect(warnings[0].args).eqls({
            componentType: "coords",
            children: "`<graph>`",
        });
        expect(warnings[0].message).eq(
            "Invalid children for `<coords>`: Found invalid children: `<graph>`",
        );
    });

    it("codes a reference resolved too late for the first pass", async () => {
        // Extending with an index defers resolution until core knows the
        // group's replacements, so this warning is the worker's own rather
        // than the one the Rust resolver raises for a plainly absent name.
        const { core } = await createTestCore({
            doenetML: `
<group name="g"></group>
<text extend="$g[1]" />
`,
        });

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0104");
        expect(warnings[0].args).eqls({ reference: "$g[1]" });
        expect(warnings[0].message).eq(
            "No referent found for reference: `$g[1]`",
        );
    });

    // The other branch of the same warning site — the one `RefResolutionDependency`
    // reaches once no candidate origin resolves the reference. Both codes have to sit
    // next to `code:` as literals for `lint:i18n` to see them raised, which is why
    // that site spreads a ternary of objects rather than choosing the value —
    // and a workaround that only one branch exercises is a workaround nobody
    // would notice breaking.
    it("codes the other resolution failure the same warning site reports", async () => {
        const { core } = await createTestCore({
            doenetML: `
<repeat name="r" for="1 2" valueName="v">
  <p><text name="z">$v</text><text name="z">$v</text></p>
</repeat>
<text extend="$r[1].z" />
`,
        });

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0105");
        expect(warnings[0].args).eqls({ reference: "$r[1].z" });
        expect(warnings[0].message).eq(
            "Multiple referents found for reference: `$r[1].z`",
        );
    });

    // Built in `validateAttributeValue` and pushed onto a list its caller
    // raises, so this too is gathered somewhere other than where the record is
    // made. The value the author wrote is echoed back as a string: the
    // attribute's own text, not a quantity to be formatted.
    it("codes an attribute value that fell back to its default", async () => {
        const { core } = await createTestCore({
            doenetML: `<math name="m" format="new1">x</math>`,
        });

        const { infos } = getDiagnosticsByType(core);
        expect(infos.length).eq(1);
        expect(infos[0].code).eq("doenet-i0048");
        expect(infos[0].args).eqls({
            value: "new1",
            attribute: "format",
            default: "text",
        });
        expect(infos[0].message).eq(
            "Invalid value `new1` for attribute `format`, using value `text`",
        );
    });

    // The two tests below are the only ones here whose diagnostic is not
    // raised in this package at all. `@doenet/parser` names it, writes the
    // English itself (it cannot render from the catalogs — see
    // `packages/parser/src/coded-dast-error.ts`), and hangs both on a DAST
    // error node; the code and arguments then travel through the Rust
    // flattening as `FlatError.code`/`.args` and are picked back up in
    // `convertNormalizedDast`. Nothing in the core reads either, which is
    // exactly why the trip needs a test at each end: Rust has one for the
    // flattening, and these are the far side of it (#1549).

    it("keeps a parser warning's code across the flattening", async () => {
        // A deprecation notice: a DAST error node with `errorType: "warning"`,
        // which becomes a diagnostic record directly rather than an `_error`
        // component.
        const { core } = await createTestCore({
            doenetML: `<selectFromSequence from="1" to="3" sortResults="true" />`,
        });

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0108");
        // `component` is `"selectFromSequence"` rather than absent because the
        // catalog selects on it; a rename that names no component passes
        // `"none"`, the select's other branch.
        expect(warnings[0].args).eqls({
            component: "selectFromSequence",
            from: "sortResults",
            to: "sort",
        });
        expect(warnings[0].message).eq(
            "[deprecation] Attribute `sortResults` on `<selectFromSequence>` is deprecated; use `sort` instead.",
        );
    });

    it("keeps a parser error's code across the flattening", async () => {
        // The longer path: a DAST error node becomes an `_error` component,
        // and `ComponentBuilder` raises the diagnostic from its `state` — so
        // this also checks that `errorComponentState` carried the code onto
        // the component rather than dropping it there.
        const { core } = await createTestCore({ doenetML: `<p>hello` });

        const { errors } = getDiagnosticsByType(core);
        expect(errors.length).eq(1);
        expect(errors[0].code).eq("doenet-e0008");
        expect(errors[0].args).eqls({ tag: "<p>", tagName: "p" });
        expect(errors[0].message).eq(
            "Invalid DoenetML: The tag `<p>` has no closing tag. Expected a self-closing tag or a `</p>` tag.",
        );
    });
});
