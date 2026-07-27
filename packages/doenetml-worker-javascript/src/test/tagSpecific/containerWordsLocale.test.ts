import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

vi.mock("hyperformula");

/**
 * i18n Phase 4 (#1572): the words a `<table>`, a `<figure>`, and a
 * `<paginatorControls>` name themselves with.
 *
 * Two things are checked throughout, and the second matters as much as the
 * first: that the document's language reaches these definitions at all, and
 * that English comes out character-for-character as it did before, so that
 * every other assertion in this repo stays true of a document that declares no
 * language.
 */
describe("container words follow the document locale @group4", () => {
    async function values(
        doenetML: string,
        names: string[],
        variable: string,
        documentLocale?: string,
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

    describe("<table>", () => {
        const doenetML = `
        <table name="first"><tabular><row><cell>1</cell></row></tabular></table>
        <table name="second"><tabular><row><cell>2</cell></row></tabular></table>
        <table name="unnumbered" number="false"><tabular><row><cell>3</cell></row></tabular></table>
        `;
        const names = ["first", "second", "unnumbered"];

        it("renders English by default", async () => {
            expect(await values(doenetML, names, "tableName")).toEqual({
                first: "Table 1",
                second: "Table 2",
                unnumbered: "Table",
            });
        });

        it("renders the document's words when it declares a language", async () => {
            expect(await values(doenetML, names, "tableName", "es")).toEqual({
                first: "Tabla 1",
                second: "Tabla 2",
                unnumbered: "Tabla",
            });
        });

        it("leaves the enumeration alone, which is the number and not the name", async () => {
            // `$table.tableEnumeration` is what a cross-reference points at.
            // The name around it moved; the identifier did not.
            expect(
                await values(doenetML, ["second"], "tableEnumeration", "es"),
            ).toEqual({ second: "2" });
        });
    });

    describe("<figure>", () => {
        const doenetML = `
        <figure name="first"><image source="doenet:a" /></figure>
        <figure name="second"><image source="doenet:b" /></figure>
        <figure name="unnumbered" number="false"><image source="doenet:c" /></figure>
        `;
        const names = ["first", "second", "unnumbered"];

        it("renders English by default", async () => {
            expect(await values(doenetML, names, "figureName")).toEqual({
                first: "Figure 1",
                second: "Figure 2",
                unnumbered: "Figure",
            });
        });

        it("renders the document's words when it declares a language", async () => {
            expect(await values(doenetML, names, "figureName", "es")).toEqual({
                first: "Figura 1",
                second: "Figura 2",
                unnumbered: "Figura",
            });
        });
    });

    describe("<paginatorControls>", () => {
        const doenetML = `
        <paginatorControls name="pc" paginator="$pgn" />
        <paginator name="pgn">
          <section name="s1"><p>one</p></section>
          <section name="s2"><p>two</p></section>
          <section name="s3"><p>three</p></section>
        </paginator>
        `;
        const names = ["pc"];

        async function labels(documentLocale?: string) {
            const { core, resolvePathToNodeIdx } = await createTestCore({
                doenetML,
                documentLocale,
            });
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const { stateValues } =
                stateVariables[await resolvePathToNodeIdx("pc")];
            return {
                previousLabel: stateValues.previousLabel,
                nextLabel: stateValues.nextLabel,
                pageLabel: stateValues.pageLabel,
                pageStatus: stateValues.pageStatus,
            };
        }

        it("renders English by default", async () => {
            expect(await labels()).toEqual({
                previousLabel: "Previous",
                nextLabel: "Next",
                pageLabel: "Page",
                pageStatus: "Page 1 of 3",
            });
        });

        it("renders the document's words when it declares a language", async () => {
            expect(await labels("es")).toEqual({
                previousLabel: "Anterior",
                nextLabel: "Siguiente",
                pageLabel: "Página",
                pageStatus: "Página 1 de 3",
            });
        });

        it("passes authored labels through verbatim, in every language", async () => {
            // The author chose these words for their document. Translating
            // them would be Doenet overwriting content it did not write.
            const authored = `
            <paginatorControls name="pc" paginator="$pgn"
                previousLabel="Atrás" nextLabel="Adelante" pageLabel="Hoja" />
            <paginator name="pgn">
              <section name="s1"><p>one</p></section>
              <section name="s2"><p>two</p></section>
            </paginator>
            `;
            for (const locale of [undefined, "es"]) {
                expect(
                    await values(authored, names, "previousLabel", locale),
                ).toEqual({ pc: "Atrás" });
                expect(
                    await values(authored, names, "nextLabel", locale),
                ).toEqual({ pc: "Adelante" });
            }
        });

        it("passes an authored label through even when it is the English default", async () => {
            // `usedDefault` is what separates "unspecified" from "specified,
            // and happens to match the default" — a plain value comparison
            // would translate this one, against the author's explicit choice.
            const authored = `
            <paginatorControls name="pc" paginator="$pgn" nextLabel="Next" />
            <paginator name="pgn"><section name="s1"><p>one</p></section></paginator>
            `;
            expect(await values(authored, names, "nextLabel", "es")).toEqual({
                pc: "Next",
            });
        });

        it("keeps the whole page status in one language, around the author's own word", async () => {
            // The status is composed in the worker precisely so this holds: an
            // authored `pageLabel` sits inside a sentence in the document's
            // language rather than one in the reader's.
            const authored = `
            <paginatorControls name="pc" paginator="$pgn" pageLabel="Hoja" />
            <paginator name="pgn">
              <section name="s1"><p>one</p></section>
              <section name="s2"><p>two</p></section>
            </paginator>
            `;
            expect(await values(authored, names, "pageStatus", "es")).toEqual({
                pc: "Hoja 1 de 2",
            });
        });

        it("keeps the pre-localization value out of an author's reach", async () => {
            // The attribute writes to `nextLabelPreLocalize` so the derived
            // definition can tell an unspecified attribute from a specified
            // one. That is plumbing: `$pc.nextLabel` is the label, and the raw
            // value behind it is not a property an author can reference.
            const doc = `
            <paginatorControls name="pc" paginator="$pgn" nextLabel="Onward" />
            <paginator name="pgn"><section name="s1"><p>one</p></section></paginator>
            <text name="raw" extend="$pc.nextLabelPreLocalize" />
            `;
            expect(await values(doc, ["raw"], "value")).toEqual({ raw: "" });
        });
    });
});
