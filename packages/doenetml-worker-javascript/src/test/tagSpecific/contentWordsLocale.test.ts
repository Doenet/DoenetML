import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { getDiagnosticsByType } from "../utils/diagnostics";
import { updateBooleanInputValue } from "../utils/actions";

vi.mock("hyperformula");

/**
 * i18n Phase 4 (#1519): the remaining words the core computes into the
 * document — boolean words, default submit labels, grouped integers, and the
 * conjunction inside a piecewise function's condition.
 *
 * Two things are being checked throughout, and the second matters as much as
 * the first: that the document's language reaches these definitions at all,
 * and that English comes out character-for-character as it did before, so that
 * every other assertion in this repo stays true of a document that declares no
 * language.
 */
describe("content words follow the document locale @group4", () => {
    async function values(
        doenetML: string,
        names: string[],
        documentLocale?: string,
        variable = "value",
    ): Promise<Record<string, any>> {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            documentLocale,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const result: Record<string, any> = {};
        for (const name of names) {
            const idx = await resolvePathToNodeIdx(name);
            result[name] = stateVariables[idx].stateValues[variable];
        }
        return result;
    }

    describe("boolean words", () => {
        const doenetML = `
        <boolean name="t">true</boolean>
        <boolean name="f">false</boolean>
        <booleanInput name="bi" prefill="true" />
        <text name="tt" extend="$t.text" />
        <text name="ft" extend="$f.text" />
        <text name="bit" extend="$bi.text" />
        `;
        const names = ["tt", "ft", "bit"];

        it("renders English by default", async () => {
            expect(await values(doenetML, names)).toEqual({
                tt: "true",
                ft: "false",
                bit: "true",
            });
        });

        it("renders the document's words when it declares a language", async () => {
            expect(await values(doenetML, names, "es")).toEqual({
                tt: "verdadero",
                ft: "falso",
                bit: "verdadero",
            });
        });

        it("keeps `true`/`false` as the value, which is syntax rather than prose", async () => {
            // The whole split: the word moved, the value did not. An `<award>`
            // comparing against `true`, and saved state holding it, are
            // unaffected by the document's language.
            const spelled = await values(
                `<boolean name="t">true</boolean>
                 <boolean name="f">false</boolean>`,
                ["t", "f"],
                "es",
            );
            expect(spelled).toEqual({ t: true, f: false });
        });

        it("reads either spelling back through `text`", async () => {
            // `$b.text` is writable, and what comes back depends on where it
            // came from: a reader hands back the word they saw, an author's own
            // DoenetML hands back the syntax. Both have to land.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
                <boolean name="b">false</boolean>
                <text name="w" extend="$b.text" />
                <updateValue name="toSpanish" target="$b.text" newValue="verdadero" type="text" />
                <updateValue name="toEnglish" target="$b.text" newValue="false" type="text" />
                `,
                documentLocale: "es",
            });

            await core.requestAction({
                actionName: "updateValue",
                componentIdx: await resolvePathToNodeIdx("toSpanish"),
                args: {},
            });
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .value,
            ).eq(true);

            await core.requestAction({
                actionName: "updateValue",
                componentIdx: await resolvePathToNodeIdx("toEnglish"),
                args: {},
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .value,
            ).eq(false);
        });

        it("still rejects a word with whitespace around it", async () => {
            // The comparison this replaced lower-cased and nothing else, so
            // `" true "` named no boolean and the write was refused. Accepting
            // more spellings must not quietly accept sloppier ones too.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
                <boolean name="b">false</boolean>
                <updateValue name="pad" target="$b.text" newValue=" true " type="text" />
                `,
            });
            await core.requestAction({
                actionName: "updateValue",
                componentIdx: await resolvePathToNodeIdx("pad"),
                args: {},
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("b")].stateValues
                    .value,
            ).eq(false);
        });

        it("follows a `<booleanInput>` as the reader toggles it", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `
                <booleanInput name="bi" />
                <text name="w" extend="$bi.text" />
                `,
                documentLocale: "es",
            });

            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("w")].stateValues
                    .value,
            ).eq("falso");

            await updateBooleanInputValue({
                boolean: true,
                componentIdx: await resolvePathToNodeIdx("bi"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);
            expect(
                stateVariables[await resolvePathToNodeIdx("w")].stateValues
                    .value,
            ).eq("verdadero");
        });
    });

    describe("default submit labels", () => {
        const doenetML = `
        <answer name="a">42</answer>
        <text name="withCorrectness" extend="$a.submitLabel" />
        <text name="withoutCorrectness" extend="$a.submitLabelNoCorrectness" />
        `;
        const names = ["withCorrectness", "withoutCorrectness"];

        it("renders English by default", async () => {
            expect(await values(doenetML, names)).toEqual({
                withCorrectness: "Check Work",
                withoutCorrectness: "Submit Response",
            });
        });

        it("renders the document's words when it declares a language", async () => {
            expect(await values(doenetML, names, "es")).toEqual({
                withCorrectness: "Revisar",
                withoutCorrectness: "Enviar respuesta",
            });
        });

        it("passes an authored label through verbatim, in every language", async () => {
            // The author chose these words for their document. Translating
            // them would be Doenet overwriting content it did not write.
            const authored = `
            <answer name="a" submitLabel="¿Listo?" submitLabelNoCorrectness="Entregar">42</answer>
            <text name="withCorrectness" extend="$a.submitLabel" />
            <text name="withoutCorrectness" extend="$a.submitLabelNoCorrectness" />
            `;
            const expected = {
                withCorrectness: "¿Listo?",
                withoutCorrectness: "Entregar",
            };
            expect(await values(authored, names)).toEqual(expected);
            expect(await values(authored, names, "es")).toEqual(expected);
        });

        it("passes an authored label through even when it is the English default", async () => {
            // `usedDefault` is what separates "unspecified" from "specified,
            // and happens to match the default" — a plain value comparison
            // would translate this one, against the author's explicit choice.
            const authored = `
            <answer name="a" submitLabel="Check Work">42</answer>
            <text name="withCorrectness" extend="$a.submitLabel" />
            `;
            expect(
                (await values(authored, ["withCorrectness"], "es"))
                    .withCorrectness,
            ).eq("Check Work");
        });

        it("keeps the pre-localization value out of an author's reach", async () => {
            // The attribute writes to `submitLabelPreLocalize` so the derived
            // definition can tell an unspecified attribute from a specified
            // one. That is plumbing: `$a.submitLabel` is the label, and the
            // raw value behind it is not a property an author can reference.
            const doc = `
            <answer name="a">42</answer>
            <text name="raw" extend="$a.submitLabelPreLocalize" />
            `;
            expect((await values(doc, ["raw"])).raw).eq("");
        });

        it("labels a section-wide button too", async () => {
            const section = `
            <section name="s" sectionWideCheckWork>
              <answer name="a">42</answer>
            </section>
            <text name="withCorrectness" extend="$s.submitLabel" />
            `;
            expect(
                (await values(section, ["withCorrectness"])).withCorrectness,
            ).eq("Check Work");
            expect(
                (await values(section, ["withCorrectness"], "es"))
                    .withCorrectness,
            ).eq("Revisar");
        });

        it("reads the root document's own `lang` for its own button", async () => {
            // An ancestor dependency skips the component it runs on, so
            // without `<document>` re-taking these the root would label its own
            // button against the host's locale rather than the one it declares.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<document lang="es" sectionWideCheckWork>
                  <answer name="a">42</answer>
                </document>`,
                documentLocale: "en",
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const documentIdx = await resolvePathToNodeIdx("_document1");
            expect(stateVariables[documentIdx].stateValues.submitLabel).eq(
                "Revisar",
            );
        });

        it("gives a nested <document> its own language, and its contents with it", async () => {
            // The ancestor lookup finds the *nearest* document, so an answer
            // inside the inner one labels against the inner one's language
            // while one outside keeps the outer's — and the inner document's
            // own button, which the lookup cannot see itself with, follows the
            // `lang` it declares rather than the one it is nested in.
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<document>
                  <answer name="outerAnswer">42</answer>
                  <section>
                    <document name="inner" lang="es" sectionWideCheckWork>
                      <answer name="innerAnswer">42</answer>
                    </document>
                  </section>
                </document>`,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const labelOf = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .submitLabel;
            expect(await labelOf("outerAnswer")).eq("Check Work");
            expect(await labelOf("inner")).eq("Revisar");
            expect(await labelOf("innerAnswer")).eq("Revisar");
        });
    });

    describe("<intComma>", () => {
        const doenetML = `
        <intComma name="whole">25236501</intComma>
        <intComma name="fraction">25236501.35</intComma>
        <intComma name="trailing">1000.50</intComma>
        <intComma name="small">999</intComma>
        <intComma name="padded">007</intComma>
        <intComma name="prose">not a number</intComma>
        `;
        const names = [
            "whole",
            "fraction",
            "trailing",
            "small",
            "padded",
            "prose",
        ];

        it("renders English by default", async () => {
            expect(await values(doenetML, names)).toEqual({
                whole: "25,236,501",
                fraction: "25,236,501.35",
                // Not "1,000.5": the component groups, it does not round.
                trailing: "1,000.50",
                small: "999",
                // Not "7": it does not drop digits either.
                padded: "007",
                prose: "not a number",
            });
        });

        it("groups by the document's own conventions", async () => {
            expect(await values(doenetML, names, "es")).toEqual({
                whole: "25.236.501",
                fraction: "25.236.501,35",
                trailing: "1.000,50",
                small: "999",
                padded: "007",
                prose: "not a number",
            });
        });

        it("groups in twos where the locale does", async () => {
            expect(
                (
                    await values(
                        `<intComma name="n">1234567</intComma>`,
                        ["n"],
                        "hi-IN",
                    )
                ).n,
            ).eq("12,34,567");
        });

        it("counts in Latin digits under a locale that does not", async () => {
            // #1615. Bangla groups in twos like Hindi and, unlike Hindi, CLDR
            // counts it in its own digits — which this value is not written in,
            // because `value` is a public state variable an author can compare,
            // extend and interpolate, and the mathematics beside it is Latin
            // whatever the document's language.
            expect(await values(doenetML, names, "bn")).toEqual({
                whole: "2,52,36,501",
                fraction: "2,52,36,501.35",
                trailing: "1,000.50",
                small: "999",
                padded: "007",
                prose: "not a number",
            });
        });
    });

    describe("<pluralize>", () => {
        it("pluralizes in English", async () => {
            expect(
                (await values(`<pluralize name="p">cat</pluralize>`, ["p"])).p,
            ).eq("cats");
        });

        it("leaves the text alone elsewhere, and says so", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<pluralize name="p">gato</pluralize>`,
                documentLocale: "es",
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .value,
            ).eq("gato");

            const warnings = getDiagnosticsByType(core).warnings;
            expect(
                warnings.some((warning) => warning.code === "doenet-w0111"),
            ).eq(true);
            expect(
                warnings.some((warning) =>
                    warning.message.includes(
                        "can only pluralize English, so its text is left unchanged in a document written in es",
                    ),
                ),
            ).eq(true);
        });

        it("uses an authored `pluralForm` in any language", async () => {
            // The remedy the warning recommends has to work, or recommending
            // it is worse than saying nothing: an author who supplied their
            // own language's plural asked for something that needs no English
            // model, and `basedOnNumber` picks between the two by arithmetic.
            const doenetML = `
            <pluralize name="many" pluralForm="lápices">lápiz</pluralize>
            <pluralize name="three" pluralForm="lápices" basedOnNumber="3">lápiz</pluralize>
            <pluralize name="one" pluralForm="lápices" basedOnNumber="1">lápiz</pluralize>
            `;
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                documentLocale: "es",
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const valueOf = async (name: string) =>
                stateVariables[await resolvePathToNodeIdx(name)].stateValues
                    .value;
            expect(await valueOf("many")).eq("lápices");
            expect(await valueOf("three")).eq("lápices");
            expect(await valueOf("one")).eq("lápiz");

            // Nothing was left undone, so nothing is warned about.
            expect(
                getDiagnosticsByType(core).warnings.some(
                    (warning) => warning.code === "doenet-w0111",
                ),
            ).eq(false);
        });

        it("counts every dialect of English as English", async () => {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML: `<pluralize name="p">cat</pluralize>`,
                documentLocale: "en-GB",
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .value,
            ).eq("cats");
            expect(
                getDiagnosticsByType(core).warnings.some(
                    (warning) => warning.code === "doenet-w0111",
                ),
            ).eq(false);
        });
    });

    describe("<piecewiseFunction> conditions", () => {
        const doenetML = `
        <piecewiseFunction name="pf">
          <function domain="(3,4)">1/x-1</function>
          <function domain="(4,5)">1/x-1</function>
        </piecewiseFunction>
        <text name="l" extend="$pf.latex" />
        `;

        it("renders English by default", async () => {
            const latex = (await values(doenetML, ["l"])).l;
            expect(latex).toContain("\\text{ or }");
            expect(latex).not.toContain("\\text{ o }");
        });

        it("joins the intervals in the document's language", async () => {
            const latex = (await values(doenetML, ["l"], "es")).l;
            expect(latex).toContain("\\text{ o }");
            expect(latex).not.toContain("\\text{ or }");
        });

        // "if" and "otherwise" sit in the same rendered expression as the "or",
        // so a document that translated one and not the others would come out
        // written half in each language.
        const withOtherwise = `
        <piecewiseFunction name="pf">
          <function domain="(0,Infinity)">x^2</function>
          <function>-x^2</function>
        </piecewiseFunction>
        <text name="l" extend="$pf.latex" />
        `;

        it("writes `if` and `otherwise` in English by default", async () => {
            const latex = (await values(withOtherwise, ["l"])).l;
            expect(latex).toContain("\\text{if }");
            expect(latex).toContain("\\text{otherwise}");
        });

        it("writes `if` and `otherwise` in the document's language", async () => {
            const latex = (await values(withOtherwise, ["l"], "es")).l;
            expect(latex).toContain("\\text{si }");
            expect(latex).toContain("\\text{en otro caso}");
            expect(latex).not.toContain("\\text{if }");
            expect(latex).not.toContain("\\text{otherwise}");
        });
    });
});
