import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import * as ComponentTypes from "../../ComponentTypes";
import { sectionWordsCoverage } from "../../utils/sectionWords";

vi.mock("hyperformula");

/**
 * i18n Phase 4 (#1572): the word a sectional block calls itself, the heading
 * it builds around that word, and the two blocks whose default heading is a
 * word of its own — `<hint>` and `<solution>`.
 *
 * Two things are checked throughout, and the second matters as much as the
 * first: that the document's language reaches these definitions at all, and
 * that English comes out character-for-character as it did before, so that
 * every other assertion in this repo stays true of a document that declares no
 * language.
 */
describe("section words follow the document locale @group4", () => {
    async function stateValuesOf(
        doenetML: string,
        names: string[],
        documentLocale?: string,
    ): Promise<Record<string, any>> {
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML,
            documentLocale,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const result: Record<string, any> = {};
        for (const name of names) {
            result[name] =
                stateVariables[await resolvePathToNodeIdx(name)].stateValues;
        }
        return result;
    }

    async function values(
        doenetML: string,
        names: string[],
        variable: string,
        documentLocale?: string,
    ): Promise<Record<string, any>> {
        const all = await stateValuesOf(doenetML, names, documentLocale);
        return Object.fromEntries(
            Object.entries(all).map(([name, sv]) => [name, sv[variable]]),
        );
    }

    describe("the word a block calls itself", () => {
        const doenetML = `
        <section name="s"><p>a</p></section>
        <subsection name="sub"><p>b</p></subsection>
        <example name="ex"><p>c</p></example>
        <problem name="pr"><p>d</p></problem>
        <part name="pa"><p>e</p></part>
        <proof name="pf"><p>f</p></proof>
        `;
        const names = ["s", "sub", "ex", "pr", "pa", "pf"];

        it("renders English by default", async () => {
            expect(await values(doenetML, names, "sectionName")).toEqual({
                s: "Section",
                // A subsection is called a section, at every depth.
                sub: "Section",
                ex: "Example",
                pr: "Problem",
                pa: "Part",
                pf: "Proof",
            });
        });

        it("renders the document's words when it declares a language", async () => {
            expect(await values(doenetML, names, "sectionName", "es")).toEqual({
                s: "Sección",
                sub: "Sección",
                ex: "Ejemplo",
                pr: "Problema",
                pa: "Parte",
                pf: "Demostración",
            });
        });

        it("passes an author's `renameTo` through verbatim, in every language", async () => {
            // The author named this block themselves. Translating their word
            // would be Doenet overwriting content it did not write.
            // `<section>` and its siblings drop `renameTo`; the plain
            // sectioning components keep it.
            const renamed = `<problems name="s" renameTo="Lección"><p>a</p></problems>`;
            for (const locale of [undefined, "es"]) {
                expect(
                    (await values(renamed, ["s"], "sectionName", locale)).s,
                ).eq("Lección");
            }
        });

        it("names every authorable sectional block", async () => {
            // A new sectional component that nobody adds to the vocabulary
            // would silently keep its JavaScript class name, in every
            // language, and nothing else would notice.
            const all = ComponentTypes.allComponentClasses() as Record<
                string,
                any
            >;
            const namesItself: string[] = [];
            for (const [componentType, componentClass] of Object.entries(all)) {
                if (
                    componentType.startsWith("_") ||
                    componentClass.excludeFromSchema
                ) {
                    continue;
                }
                if (
                    componentClass.returnStateVariableDefinitions?.()
                        ?.sectionName !== undefined
                ) {
                    namesItself.push(componentType);
                }
            }

            // The scan is the load-bearing half, so check it found something
            // before trusting that it found nothing missing.
            expect(namesItself).toContain("section");
            expect(namesItself).toContain("solution");
            expect(namesItself).toContain("givenAnswer");

            const covered = new Set(sectionWordsCoverage());
            expect(namesItself.filter((type) => !covered.has(type))).toEqual(
                [],
            );
        });
    });

    describe("the heading a section builds", () => {
        it("renders English by default", async () => {
            const doenetML = `
            <section name="plain"><p>a</p></section>
            <section name="titled"><title>Limits</title><p>b</p></section>
            <section name="numbered" includeAutoNumber includeAutoName="false">
              <title>Limits</title><p>c</p>
            </section>
            <section name="named" includeAutoName includeAutoNumber="false">
              <title>Limits</title><p>d</p>
            </section>
            <section name="both" includeAutoName includeAutoNumber>
              <title>Limits</title><p>e</p>
            </section>
            <section name="bare" noAutoTitle><p>f</p></section>
            `;
            const names = [
                "plain",
                "titled",
                "numbered",
                "named",
                "both",
                "bare",
            ];
            expect(await values(doenetML, names, "titlePrefix")).toEqual({
                plain: "Section 1",
                // An authored title suppresses both auto pieces unless they
                // were asked for explicitly.
                titled: "",
                // A bare number separates its title with a period, not a colon.
                numbered: "3. ",
                named: "Section: ",
                both: "Section 5: ",
                bare: "",
            });
        });

        it("renders the document's heading when it declares a language", async () => {
            const doenetML = `
            <section name="plain"><p>a</p></section>
            <section name="both" includeAutoName includeAutoNumber>
              <title>Límites</title><p>b</p>
            </section>
            <section name="numbered" includeAutoNumber includeAutoName="false">
              <title>Límites</title><p>c</p>
            </section>
            `;
            const names = ["plain", "both", "numbered"];
            expect(await values(doenetML, names, "titlePrefix", "es")).toEqual({
                plain: "Sección 1",
                both: "Sección 2: ",
                numbered: "3. ",
            });
        });

        it("gives a nested <document> its own language, and its sections with it", async () => {
            // The ancestor lookup finds the *nearest* document, so a section
            // inside the inner one is named in the inner one's language while
            // one outside keeps the outer's.
            const nested = `<document>
              <section name="outer"><p>a</p></section>
              <document name="inner" lang="es">
                <section name="innerSection"><p>b</p></section>
              </document>
            </document>`;
            const svs = await stateValuesOf(nested, ["outer", "innerSection"]);
            expect(svs.outer.sectionName).eq("Section");
            expect(svs.innerSection.sectionName).eq("Sección");
        });

        it("keeps the section number out of the catalog's hands", async () => {
            // `sectionNumber` is built from counters and is an identifier, not
            // a quantity — a deep enumeration must not be reformatted.
            const deep = `
            <section name="a"><subsection name="b" includeParentNumber>
              <p>x</p>
            </subsection></section>
            `;
            expect((await values(deep, ["b"], "sectionNumber", "es")).b).eq(
                "1.1",
            );
        });
    });

    describe("<solution> and <givenAnswer>", () => {
        const doenetML = `
        <problem><solution name="sol"><p>a</p></solution>
        <givenAnswer name="ga"><p>b</p></givenAnswer></problem>
        `;
        const names = ["sol", "ga"];

        it("renders English by default", async () => {
            expect(await values(doenetML, names, "sectionName")).toEqual({
                sol: "Solution",
                ga: "Answer",
            });
        });

        it("renders the document's words when it declares a language", async () => {
            expect(await values(doenetML, names, "sectionName", "es")).toEqual({
                sol: "Solución",
                ga: "Respuesta",
            });
        });
    });

    describe("<hint>", () => {
        it("renders English by default", async () => {
            expect(
                (await values(`<hint name="h"><p>a</p></hint>`, ["h"], "title"))
                    .h,
            ).eq("Hint");
        });

        it("renders the document's word when it declares a language", async () => {
            expect(
                (
                    await values(
                        `<hint name="h"><p>a</p></hint>`,
                        ["h"],
                        "title",
                        "es",
                    )
                ).h,
            ).eq("Pista");
        });

        it("passes an authored title through verbatim, in every language", async () => {
            const authored = `<hint name="h"><title>Try this</title><p>a</p></hint>`;
            for (const locale of [undefined, "es"]) {
                expect((await values(authored, ["h"], "title", locale)).h).eq(
                    "Try this",
                );
            }
        });
    });
});
