import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { submitAnswer, updateMathInputValue } from "../utils/actions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Document tag tests @group4", async () => {
    it("get 1 for document credit with nothing", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <number extend="$_document1.creditAchieved" name="docCa" />

  `,
        });

        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(1);
    });

    it("document credit when have problem with nothing", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <number extend="$_document1.creditAchieved" name="docCa" />
  <p><answer name="ans">x</answer></p>
  <problem>
    <title>Problem with nothing</title>
  </problem>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(0.5);

        let mathInputIdx =
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .inputChildren[0].componentIdx;

        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(1);
    });

    it("get document credit even when have composites as a siblings", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <number extend="$_document1.creditAchieved" name="docCa" />
  <setup>
    <math name="m1">x</math>
  </setup>
  <group>
    <math name="m2">$m1</math>
  </group>
  <p><answer name="ans"><award>$m2</award></answer></p>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(0);

        let mathInputIdx =
            stateVariables[await resolvePathToNodeIdx("ans")].stateValues
                .inputChildren[0].componentIdx;

        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInputIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("ans"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(1);
    });

    it(`component credit achieved, don't skip weight 0`, async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <number extend="$_document1.creditAchieved" name="docCa" />
  <p>x: <answer name="x">x</answer></p>
  <p>a: <answer name="a" weight="0">a</answer></p>
  <problem>
    <p>y: <answer name="y">y</answer></p>
  </problem>
  <problem weight="0">
    <p>b: <answer name="b">b</answer></p>
  </problem>
  <problem>
    <p>z: <answer name="z">z</answer></p>
  </problem>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(0);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")].stateValues
                .componentCreditAchieved,
        ).eqls([0, 0, 0, 0, 0]);

        let mathInputXIdx =
            stateVariables[await resolvePathToNodeIdx("x")].stateValues
                .inputChildren[0].componentIdx;
        let mathInputYIdx =
            stateVariables[await resolvePathToNodeIdx("y")].stateValues
                .inputChildren[0].componentIdx;
        let mathInputZIdx =
            stateVariables[await resolvePathToNodeIdx("z")].stateValues
                .inputChildren[0].componentIdx;
        let mathInputAIdx =
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .inputChildren[0].componentIdx;
        let mathInputBIdx =
            stateVariables[await resolvePathToNodeIdx("b")].stateValues
                .inputChildren[0].componentIdx;

        await updateMathInputValue({
            latex: "x",
            componentIdx: mathInputXIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("x"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("x")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(1 / 3);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")].stateValues
                .componentCreditAchieved,
        ).eqls([1, 0, 0, 0, 0]);

        await updateMathInputValue({
            latex: "a",
            componentIdx: mathInputAIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("a"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("a")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(1 / 3);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")].stateValues
                .componentCreditAchieved,
        ).eqls([1, 1, 0, 0, 0]);

        await updateMathInputValue({
            latex: "y",
            componentIdx: mathInputYIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("y"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("y")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(2 / 3);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")].stateValues
                .componentCreditAchieved,
        ).eqls([1, 1, 1, 0, 0]);

        await updateMathInputValue({
            latex: "b",
            componentIdx: mathInputBIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("b"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("b")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(2 / 3);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")].stateValues
                .componentCreditAchieved,
        ).eqls([1, 1, 1, 1, 0]);

        await updateMathInputValue({
            latex: "z",
            componentIdx: mathInputZIdx,
            core,
        });
        await submitAnswer({
            componentIdx: await resolvePathToNodeIdx("z"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("z")].stateValues
                .creditAchieved,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("docCa")].stateValues
                .value,
        ).eq(1);
        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")].stateValues
                .componentCreditAchieved,
        ).eqls([1, 1, 1, 1, 1]);
    });

    it("explicit document tag, ignore outer blank strings", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `

  <document>a</document>



  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(Object.keys(stateVariables).length).eq(1);

        expect(
            stateVariables[await resolvePathToNodeIdx("_document1")]
                .activeChildren,
        ).eqls(["a"]);
    });

    // Regression for #1147 (half 2): the implicit `<document>` previously
    // declared a `description` child group and a `description` state
    // variable that read `text` from any `<description>` child. Because
    // `<description>` (which extends `BlockComponent`) has no `text` state
    // variable, any document that contained a `<description>` as a direct
    // child crashed during dependency setup with
    // "Unknown state variable text of <idx>". Standalone `<description>`
    // tripped this most visibly. The legacy `document.description` state
    // variable was never consumed; both the state variable and the
    // `description` child group have been removed, so a `<description>`
    // anywhere in a document now resolves cleanly.
    it("standalone <description> does not crash", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<description>hello world</description>`,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        // The document resolves; `<description>` ends up as a generic
        // active child of the implicit document rather than being lifted
        // through a `description` child group.
        const documentIdx = await resolvePathToNodeIdx("_document1");
        expect(stateVariables[documentIdx].componentType).eq("document");
    });

    // i18n Phase 0 (#1515): `<document lang>` declares the content's language.
    // Precedence is authored `lang` > the locale the hosting page supplied via
    // `setLocaleData` > "en" — the author knows what language they wrote in,
    // the host only knows what it would prefer to receive.
    describe("document lang / locale", () => {
        async function localeOf(
            doenetML: string,
            documentLocale?: string,
            path = "_document1",
        ): Promise<string> {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                documentLocale,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            return stateVariables[await resolvePathToNodeIdx(path)].stateValues
                .locale;
        }

        it("defaults to en", async () => {
            expect(await localeOf(`<p>hello</p>`)).eq("en");
        });

        it("uses the host locale when the document declares none", async () => {
            expect(await localeOf(`<p>hola</p>`, "es-MX")).eq("es-MX");
        });

        it("lets an authored lang override the host locale", async () => {
            expect(
                await localeOf(
                    `<document lang="fr"><p>bonjour</p></document>`,
                    "es-MX",
                ),
            ).eq("fr");
        });

        it("normalizes a hand-typed tag to canonical casing", async () => {
            // Authors type `lang` by hand; `es-mx` has to negotiate against
            // the `es-MX` catalog the same as the canonical form.
            expect(
                await localeOf(`<document lang="ES-mx"><p>hola</p></document>`),
            ).eq("es-MX");
        });

        it("matches the attribute name case-insensitively", async () => {
            // The viewer reads `lang` straight off the DAST to label the
            // rendered wrapper, and the DAST preserves the author's casing
            // while the core lowercases before matching. Both sides therefore
            // have to accept `Lang`, or the wrapper's `lang` attribute and
            // `document.locale` would disagree — see the matching test in
            // `@doenet/doenetml`'s `documentLang.test.ts`.
            expect(
                await localeOf(
                    `<document Lang="fr"><p>bonjour</p></document>`,
                    "es-MX",
                ),
            ).eq("fr");
        });

        it("ignores a blank lang and falls back", async () => {
            expect(
                await localeOf(`<document lang=" "><p>hi</p></document>`, "de"),
            ).eq("de");
        });

        it("lets a nested document inherit from its ancestor", async () => {
            // An inner document that declares nothing follows the language it
            // is embedded in rather than jumping back to the host's locale.
            const doenetML = `<document lang="fr"><document name="inner"><p>bonjour</p></document></document>`;
            expect(await localeOf(doenetML, "es-MX", "inner")).eq("fr");
        });

        it("treats a blank lang on a nested document as absent", async () => {
            const doenetML = `<document lang="fr"><document name="inner" lang=" "><p>bonjour</p></document></document>`;
            expect(await localeOf(doenetML, "es-MX", "inner")).eq("fr");
        });

        it("lets a nested document declare its own lang", async () => {
            const doenetML = `<document lang="fr"><document name="inner" lang="de"><p>guten Tag</p></document></document>`;
            expect(await localeOf(doenetML, "es-MX", "inner")).eq("de");
        });
    });
});
