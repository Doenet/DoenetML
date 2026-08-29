import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    updateMathInputValue,
    updateSelectedIndices,
    updateTextInputValue,
} from "../utils/actions";
import { MATH_BLANK_LATEX } from "@doenet/utils";
import { getDiagnosticsByType } from "../utils/diagnostics";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * An input written inside `<m>` is drawn where it is written, inside the
 * typeset expression. Core cannot measure the control — it has no DOM — so it
 * emits `latexTemplate`, the LaTeX with a marker per embedded input, and the
 * renderer substitutes a box of the size it measured.
 *
 * These tests pin the core half of that: which children are embedded, what the
 * template says, and — the property the whole design rests on — that typing
 * does not change the template.
 */
describe("Inputs embedded in displayed math @group1", async () => {
    it("an unfilled input leaves a blank in latex and text", async () => {
        // Not cosmetic. With nothing in the input's place the expression is not
        // merely gappy, it is wrong: "x =  + 3" reads as x = +3, the operator
        // demoted to a sign. This is also what an export writes out.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m">x = <textInput name="ti" /> + 3</m>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const m = stateVariables[await resolvePathToNodeIdx("m")].stateValues;

        expect(m.latex).eq("x = \\underline{\\hspace{2em}} + 3");
        // U+FF3F is what math-expressions already shows for a missing
        // subexpression, so `text` and `math` agree on how a blank reads.
        expect(m.text).eq("x = \uFF3F + 3");
        // The structure is preserved rather than collapsing to a bare
        // placeholder: the `+` is still an operator with two operands.
        expect(m.math.tree).eqls(["=", "x", ["+", "\uFF3F", 3]]);
    });

    it("a filled-in input contributes its value, not a blank", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m">x = <textInput name="ti" /> + 3</m>
    `,
        });

        await updateTextInputValue({
            text: "y^2",
            componentIdx: await resolvePathToNodeIdx("ti"),
            core,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const m = stateVariables[await resolvePathToNodeIdx("m")].stateValues;

        expect(m.latex).eq("x = y^2 + 3");
        expect(m.latex).not.contain("underline");
    });

    it("an aligned display blanks only the rows that need it", async () => {
        // `\amp` rather than a bare `&`: `Md.text` strips the macro but not
        // the character, so a literal `&` makes the row unparseable and `text`
        // falls back to raw LaTeX. Pre-existing and orthogonal to blanks —
        // tracked in #1761; this can use either spelling once that is fixed.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <md name="md">
      <mrow>q \\amp = \\sin(x)</mrow>
      <mrow>w \\amp = <textInput name="ti" /></mrow>
    </md>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const md = stateVariables[await resolvePathToNodeIdx("md")].stateValues;

        // Only the row with the unfilled input gets a blank.
        expect(md.latex).eq(
            "\\notag q \\amp = \\sin(x)\\\\\\notag w \\amp = \\underline{\\hspace{2em}}",
        );
        expect(md.text).contain("\uFF3F");
        expect(md.text).contain("sin(x)");
    });

    it("public latex is unchanged by embedding", async () => {
        // The renderer stopped typesetting the input's value, but `$m.latex`
        // still reports it: it is what `$m.text`, the adapters, and export
        // read, and it is the sensible static rendering of the expression.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m">x = <textInput name="ti" prefill="abc" /></m>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const m = stateVariables[await resolvePathToNodeIdx("m")].stateValues;

        expect(m.latex).eq("x = abc");
    });

    it("an embedded input becomes a marker in the template", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m">x = <textInput name="ti" prefill="abc" /></m>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const m = stateVariables[await resolvePathToNodeIdx("m")].stateValues;
        const tiIdx = await resolvePathToNodeIdx("ti");

        expect(m.embeddedInputComponentIndices).eqls([tiIdx]);
        expect(m.latexTemplate).eq(`x = \\doenetInputSlot{${tiIdx}}`);
        // The string child is typeset, so only the input is rendered.
        expect(m.childIndicesToRender).eqls([1]);
    });

    it("typing changes latex but not the template", async () => {
        // This is what keeps MathJax from re-typesetting the expression under
        // the reader's cursor on every keystroke.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m">x = <textInput name="ti" /></m>
    `,
        });

        const before = (await core.returnAllStateVariables(false, true))[
            await resolvePathToNodeIdx("m")
        ].stateValues;

        await updateTextInputValue({
            text: "y^2",
            componentIdx: await resolvePathToNodeIdx("ti"),
            core,
        });

        const after = (await core.returnAllStateVariables(false, true))[
            await resolvePathToNodeIdx("m")
        ].stateValues;

        expect(after.latex).not.eq(before.latex);
        expect(after.latex).eq("x = y^2");
        expect(after.latexTemplate).eq(before.latexTemplate);
    });

    it("math with no inputs is untouched", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m">x + 1</m>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const m = stateVariables[await resolvePathToNodeIdx("m")].stateValues;

        expect(m.embeddedInputComponentIndices).eqls([]);
        expect(m.childIndicesToRender).eqls([]);
        expect(m.latexTemplate).eq(m.latex);
    });

    it("a choice input contributes its selection, or a blank", async () => {
        // A choice input has no `latex` or `text` of its own, so its selected
        // choices are what stand in for it — preselected or chosen later.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="unchosen">x = <choiceInput inline name="ci1">
      <choice>1</choice><choice>2</choice>
    </choiceInput></m>
    <m name="chosen">y = <choiceInput inline name="ci2" preselectChoice="2">
      <choice>1</choice><choice>2</choice>
    </choiceInput></m>
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        const unchosenIdx = await resolvePathToNodeIdx("unchosen");
        const chosenIdx = await resolvePathToNodeIdx("chosen");

        expect(stateVariables[unchosenIdx].stateValues.latex).eq(
            `x = ${MATH_BLANK_LATEX}`,
        );
        expect(stateVariables[chosenIdx].stateValues.latex).eq("y = 2");
        expect(stateVariables[chosenIdx].stateValues.text).eq("y = 2");

        await updateSelectedIndices({
            componentIdx: await resolvePathToNodeIdx("ci1"),
            selectedIndices: [1],
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[unchosenIdx].stateValues.latex).eq("x = 1");
    });

    it("only an inline choice input is embedded", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="inline">x = <choiceInput inline name="ciInline">
      <choice>1</choice><choice>2</choice>
    </choiceInput></m>
    <m name="block">x = <choiceInput name="ciBlock">
      <choice>1</choice><choice>2</choice>
    </choiceInput></m>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("inline")].stateValues
                .embeddedInputComponentIndices,
        ).eqls([await resolvePathToNodeIdx("ciInline")]);
        expect(
            stateVariables[await resolvePathToNodeIdx("block")].stateValues
                .embeddedInputComponentIndices,
        ).eqls([]);
    });

    it("an input shaped wrongly for an expression warns and is flattened", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m">x = <textInput name="ti" expanded prefill="abc" /></m>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const m = stateVariables[await resolvePathToNodeIdx("m")].stateValues;

        expect(m.embeddedInputComponentIndices).eqls([]);
        // Falls back to what it did before inputs could be embedded at all.
        expect(m.latexTemplate).eq(m.latex);
        expect(m.latex).eq("x = abc");

        const { errors, warnings } = getDiagnosticsByType(core);
        expect(errors.length).eq(0);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0125");
        expect(warnings[0].message).contain("multi-line box");
    });

    it("a relative width warns, whether a percentage or em", async () => {
        // Core keeps only `{ size, isAbsolute }` for a width, so `em` and `%`
        // are the same case to it, and the message must say so.
        let { core } = await createTestCore({
            doenetML: `
    <m name="m">x = <textInput name="ti" width="10em" /></m>
    `,
        });

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0125");
        expect(warnings[0].message).contain("percentage or `em`");
    });

    it("a block choice input warns for its own reason", async () => {
        let { core } = await createTestCore({
            doenetML: `
    <m name="m">x = <choiceInput name="ci">
      <choice>1</choice><choice>2</choice>
    </choiceInput></m>
    `,
        });

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0125");
        expect(warnings[0].message).contain("block of buttons");
    });

    it("math on a graph embeds nothing and says why", async () => {
        // On a graph the expression is drawn as one picture, so the input is
        // flattened into it as it always was, and the author is told.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph><m name="m">x = <textInput name="ti" prefill="abc" /></m></graph>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const m = stateVariables[await resolvePathToNodeIdx("m")].stateValues;

        expect(m.embeddedInputComponentIndices).eqls([]);
        expect(m.latex).eq("x = abc");
        expect(m.latexTemplate).eq(m.latex);

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0125");
        expect(warnings[0].message).contain("graph");
    });

    it("a hidden input is not embedded", async () => {
        // The renderer is never handed a hidden child, so there would be no
        // control to size the marker; the input is flattened as before.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m">x = <textInput name="ti" prefill="abc" hide /> + 3</m>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const m = stateVariables[await resolvePathToNodeIdx("m")].stateValues;

        expect(m.embeddedInputComponentIndices).eqls([]);
        expect(m.latexTemplate).eq(m.latex);
        expect(m.latex).eq("x = abc + 3");

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(0);
    });

    it("a math input is embedded", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m">x = <mathInput name="mi" /></m>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const m = stateVariables[await resolvePathToNodeIdx("m")].stateValues;
        const miIdx = await resolvePathToNodeIdx("mi");

        expect(m.embeddedInputComponentIndices).eqls([miIdx]);
        expect(m.latexTemplate).eq(`x = \\doenetInputSlot{${miIdx}}`);
        expect(m.latex).eq(`x = ${MATH_BLANK_LATEX}`);
    });

    it("a math input contributes latex, not text notation", async () => {
        // A math input has no `latex` of its own until this feature gives it
        // one, and its `text` is plain-text notation — `sqrt(2)`, which is not
        // the expression the reader entered once it is typeset as LaTeX.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m">x = <mathInput name="mi" /></m>
    `,
        });

        await updateMathInputValue({
            latex: "\\sqrt{2}",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const m = stateVariables[await resolvePathToNodeIdx("m")].stateValues;
        const mi = stateVariables[await resolvePathToNodeIdx("mi")].stateValues;

        expect(mi.latex).eq("\\sqrt{2}");
        expect(mi.text).eq("sqrt(2)");
        expect(m.latex).eq("x = \\sqrt{2}");
        expect(m.math.tree).eqls(["=", "x", ["apply", "sqrt", 2]]);
    });

    it("typing in a math input changes latex but not the template", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m">x = <mathInput name="mi" /></m>
    `,
        });

        const before = (await core.returnAllStateVariables(false, true))[
            await resolvePathToNodeIdx("m")
        ].stateValues;

        await updateMathInputValue({
            latex: "y^2",
            componentIdx: await resolvePathToNodeIdx("mi"),
            core,
        });

        const after = (await core.returnAllStateVariables(false, true))[
            await resolvePathToNodeIdx("m")
        ].stateValues;

        expect(after.latex).eq("x = y^{2}");
        expect(after.latexTemplate).eq(before.latexTemplate);
    });

    it("a math input on a graph is flattened and says why", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph><m name="m">x = <mathInput name="mi" prefillLatex="y^2" /></m></graph>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const m = stateVariables[await resolvePathToNodeIdx("m")].stateValues;

        expect(m.embeddedInputComponentIndices).eqls([]);
        expect(m.latex).eq("x = y^{2}");

        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.length).eq(1);
        expect(warnings[0].code).eq("doenet-w0125");
        expect(warnings[0].message).contain("mathInput");
    });

    it("the expression names a math input too", async () => {
        // A math input already describes its own contents through MathQuill, so
        // what the expression adds is where those contents sit in it.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m">x = <mathInput name="mi" /> + 3</m>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const mi = stateVariables[await resolvePathToNodeIdx("mi")].stateValues;

        expect(mi.shortDescription).eq("x = blank + 3");

        const { accessibility } = getDiagnosticsByType(core);
        expect(
            accessibility.filter((d) => d.code === "doenet-a0003").length,
        ).eq(0);
    });

    it("the expression names the input it holds", async () => {
        // A control inside an equation has nowhere to put a visible label, so
        // the equation becomes its description — and the unlabeled-input
        // accessibility warning is satisfied rather than tripped.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m">x = <textInput name="ti" /> + 3</m>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const ti = stateVariables[await resolvePathToNodeIdx("ti")].stateValues;

        expect(ti.shortDescription).eq("x = blank + 3");

        const { accessibility } = getDiagnosticsByType(core);
        expect(
            accessibility.filter((d) => d.code === "doenet-a0003").length,
        ).eq(0);
    });

    it("a row of an aligned display names the input it holds", async () => {
        // The name comes from the row, not the whole display: an `<mrow>` is a
        // kind of `<m>`, so it is the nearest math ancestor the input sees.
        // The alignment marker is layout, not mathematics, and is not spoken,
        // whichever way it is written.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <md name="md">
      <mrow>q \\amp = \\sin(x)</mrow>
      <mrow>w \\amp = <textInput name="tiMacro" /></mrow>
      <mrow>z &amp;= <textInput name="tiAmpersand" /></mrow>
    </md>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("tiMacro")].stateValues
                .shortDescription,
        ).eq("w = blank");
        expect(
            stateVariables[await resolvePathToNodeIdx("tiAmpersand")]
                .stateValues.shortDescription,
        ).eq("z = blank");
    });

    it("the expression is spoken as text, not as LaTeX", async () => {
        // The name is the expression read through the math parser, so a
        // control sequence is spoken as what it means, and the blank is put
        // back in its place afterwards.
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m">\\frac{<textInput name="ti" />}{2} = \\sin(x)</m>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const ti = stateVariables[await resolvePathToNodeIdx("ti")].stateValues;

        expect(ti.shortDescription).eq("blank/2 = sin(x)");
    });

    it("an author's own description still wins", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m">x = <textInput name="ti">
      <shortDescription>the derivative</shortDescription>
    </textInput> + 3</m>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("ti")].stateValues
                .shortDescription,
        ).eq("the derivative");
    });

    it("several blanks in one expression are numbered", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <m name="m"><textInput name="a" /> + <textInput name="b" /> = 5</m>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        // Each input hears its own gap numbered and the others as plain blanks,
        // so a reader can tell which one they have landed on.
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .shortDescription,
        ).eq("blank 1 of 2 + blank = 5");
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues
                .shortDescription,
        ).eq("blank + blank 2 of 2 = 5");
    });

    it("an aligned display composes its rows' templates", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <md name="md">
      <mrow>q &amp;= \\sin(x)</mrow>
      <mrow>w &amp;= <textInput name="ti" /></mrow>
    </md>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const md = stateVariables[await resolvePathToNodeIdx("md")].stateValues;
        const tiIdx = await resolvePathToNodeIdx("ti");

        // Same `\\` join and `\notag ` prefixes as `latex`, so the rows align
        // identically however the display is typeset.
        expect(md.latexTemplate).eq(
            `\\notag q & = \\sin(x)\\\\\\notag w & = \\doenetInputSlot{${tiIdx}}`,
        );
        expect(md.typesetsOwnChildren).eq(false);
        // The display's own list, so its renderer knows which markers are its
        // slots without trusting the template's text.
        expect(md.embeddedInputComponentIndices).eqls([tiIdx]);
    });

    it("an external label names the input, so the expression does not", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <label for="$ti">Your favorite number</label>
    <m name="m">x = <textInput name="ti" /> + 3</m>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        const ti = stateVariables[await resolvePathToNodeIdx("ti")].stateValues;

        expect(ti.shortDescription).eq("");
        const { warnings } = getDiagnosticsByType(core);
        expect(warnings.filter((w) => w.code === "doenet-a0003")).eqls([]);
    });

    it("a row typesets itself only outside an aligned display", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <md name="md"><mrow name="inMd">x</mrow></md>
    <p><mrow name="alone">y</mrow></p>
    `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("inMd")].stateValues
                .typesetByParent,
        ).eq(true);
        expect(
            stateVariables[await resolvePathToNodeIdx("alone")].stateValues
                .typesetByParent,
        ).eq(false);
    });
});
