import { describe, expect, it, vi } from "vitest";
import { createTranslator } from "@doenet/i18n";
import { createTestCore } from "../utils/test-core";
import {
    anionName,
    elementName,
    elementWordsCoverage,
    englishAnionName,
} from "../../utils/chemistryWords";
import { atomDatabase } from "@doenet/static-assets/atom-database";

vi.mock("hyperformula");

/**
 * i18n Phase 4 (#1573): the names the chemistry components generate — the 118
 * element names, the name an ion derives from its element's, and the message
 * shown where a symbol names nothing.
 *
 * Two things are checked throughout, and the second matters as much as the
 * first: that the document's language reaches these definitions at all, and
 * that English comes out character-for-character as it did before, so that
 * every other assertion in this repo stays true of a document that declares no
 * language.
 *
 * The other half of the line is checked here too (#1577): the values an author
 * compares against — an element's periodic group, its phase at STP and its
 * metal category — stay as the atom database spells them no matter what
 * language the document declares.
 */
describe("chemistry words follow the document locale @group4", () => {
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
            result[name] =
                stateVariables[await resolvePathToNodeIdx(name)].stateValues[
                    variable
                ];
        }
        return result;
    }

    describe("element names", () => {
        const doenetML = `
        <atom name="h" symbol="H" />
        <atom name="fe" symbol="Fe" />
        <atom name="au" symbol="Au" />
        <atom name="w" symbol="W" />
        `;
        const names = ["h", "fe", "au", "w"];

        it("renders English by default", async () => {
            expect(await values(doenetML, names, "name")).toEqual({
                h: "Hydrogen",
                fe: "Iron",
                au: "Gold",
                w: "Tungsten",
            });
        });

        it("renders the document's names when it declares a language", async () => {
            expect(await values(doenetML, names, "name", "es")).toEqual({
                h: "Hidrógeno",
                fe: "Hierro",
                au: "Oro",
                w: "Wolframio",
            });
        });

        it("leaves the symbol alone, in every language", async () => {
            // A symbol is international, and is what an author's `<award>`
            // compares against. It is not a word.
            expect(await values(doenetML, names, "symbol", "es")).toEqual({
                h: "H",
                fe: "Fe",
                au: "Au",
                w: "W",
            });
        });

        it("names every element in the database, with the name it had", async () => {
            // Two failures at once. An element with no word would silently
            // keep its English name in every language; and a wrong English
            // word anywhere in the vocabulary would silently change what a
            // document that declares no language renders. Only a handful of
            // these are spelled out above, so the rest are pinned here against
            // the database column and the derivation the anion names replaced.
            const covered = new Set(elementWordsCoverage());
            const rows = atomDatabase as Record<string, string>[];
            expect(rows.length).eq(118);
            const unquoted = (value: string) => value.replace(/^"|"$/g, "");
            expect(
                rows
                    .map((row) => unquoted(row.Symbol))
                    .filter((symbol) => !covered.has(symbol)),
            ).toEqual([]);

            const t = createTranslator([], {});
            const wrongInEnglish = rows
                .map((row) => {
                    const symbol = unquoted(row.Symbol);
                    const name = unquoted(row.Name);
                    return {
                        symbol,
                        got: [
                            elementName(t, symbol, "no fallback"),
                            anionName(t, symbol, englishAnionName(name)),
                        ],
                        // What each printed before the words moved: the
                        // database's own name, and the English "-ine" → "-ide"
                        // derivation over it.
                        expected: [name, englishAnionName(name)],
                    };
                })
                .filter(({ got, expected }) =>
                    got.some((word, ind) => word !== expected[ind]),
                );
            expect(wrongInEnglish).toEqual([]);
        });
    });

    // #1577. These three read as words, and were the ones held back when the
    // element names moved. They are what an author's `<award>` compares
    // against — `$atom.groupName = Noble Gas` — so a name that changed with
    // the document's language would break that award at the moment the
    // document declared one. The line is drawn at what is compared, and these
    // tests are what says where it is: the same value in every language, and
    // the same value from an `<ion>` as from an `<atom>`.
    describe("the values an award compares against", () => {
        const doenetML = `
        <atom name="na" symbol="Na" />
        <atom name="cl" symbol="Cl" />
        <atom name="he" symbol="He" />
        <atom name="h" symbol="H" />
        `;
        const names = ["na", "cl", "he", "h"];

        const groups = {
            na: "Alkali Metal",
            cl: "Halogen",
            he: "Noble Gas",
            // Hydrogen belongs to no named group.
            h: "",
        };

        it("names a periodic group the same in every language", async () => {
            expect(await values(doenetML, names, "groupName")).toEqual(groups);
            expect(await values(doenetML, names, "groupName", "es")).toEqual(
                groups,
            );
        });

        it("gives an ion the same group as an atom, in every language", async () => {
            // `<ion>` carries its own copy of this definition, so it can drift
            // from `<atom>`'s on its own.
            const both = `
            <atom name="a" symbol="Fe" />
            <ion name="i" symbol="Fe" charge="2" />
            `;
            for (const locale of [undefined, "es"]) {
                expect(
                    await values(both, ["a", "i"], "groupName", locale),
                ).toEqual({
                    a: "Transition Metal",
                    i: "Transition Metal",
                });
            }
        });

        it("reports a phase at STP the same in every language", async () => {
            const phases = { na: "Solid", cl: "Gas", he: "Gas", h: "Gas" };
            expect(await values(doenetML, names, "phaseAtSTP")).toEqual(phases);
            expect(await values(doenetML, names, "phaseAtSTP", "es")).toEqual(
                phases,
            );
        });

        it("reports a metal category the same in every language", async () => {
            const both = `
            <atom name="na" symbol="Na" />
            <atom name="cl" symbol="Cl" />
            <ion name="i" symbol="Na" charge="1" />
            `;
            const categories = { na: "Metal", cl: "Non Metal", i: "Metal" };
            expect(
                await values(both, ["na", "cl", "i"], "metalCategory"),
            ).toEqual(categories);
            expect(
                await values(both, ["na", "cl", "i"], "metalCategory", "es"),
            ).toEqual(categories);
        });
    });

    describe("ion names", () => {
        const doenetML = `
        <ion name="chloride" symbol="Cl" charge="-1" />
        <ion name="oxide" symbol="O" charge="-2" />
        <ion name="sodium" symbol="Na" charge="1" />
        <ion name="ironII" symbol="Fe" charge="2" />
        <ion name="ironIII" symbol="Fe" charge="3" />
        `;
        const names = ["chloride", "oxide", "sodium", "ironII", "ironIII"];

        it("renders English by default", async () => {
            expect(await values(doenetML, names, "name")).toEqual({
                // Derived in English by stripping "ine" and adding "ide"…
                chloride: "Chloride",
                // …or from the table, for the words that rule does not fit.
                oxide: "Oxide",
                sodium: "Sodium",
                ironII: "Iron (II)",
                ironIII: "Iron (III)",
            });
        });

        it("renders the document's names when it declares a language", async () => {
            // Spanish does not derive these the way English does, which is the
            // whole reason the derived name is data rather than a rule.
            expect(await values(doenetML, names, "name", "es")).toEqual({
                chloride: "Cloruro",
                oxide: "Óxido",
                sodium: "Sodio",
                ironII: "Hierro (II)",
                ironIII: "Hierro (III)",
            });
        });

        it("calls an anion with no derived name by its element's name", async () => {
            // What the English rule also does for everything it does not
            // match.
            const doc = `<ion name="i" symbol="Fe" charge="-2" />`;
            expect((await values(doc, ["i"], "name")).i).eq("Iron");
            expect((await values(doc, ["i"], "name", "es")).i).eq("Hierro");
        });
    });

    describe("an invalid symbol", () => {
        const doenetML = `
        <atom name="a" symbol="Xx" />
        <ion name="i" symbol="Xx" charge="1" />
        <ionicCompound name="c"><atom symbol="Xx" /><atom symbol="Yy" /></ionicCompound>
        `;

        it("renders English by default", async () => {
            expect(await values(doenetML, ["a", "i"], "text")).toEqual({
                a: "[Invalid Chemical Symbol]",
                i: "[Invalid Chemical Symbol]",
            });
            expect((await values(doenetML, ["c"], "text")).c).eq(
                "[Invalid Ionic Compound]",
            );
        });

        it("renders the document's words when it declares a language", async () => {
            expect(await values(doenetML, ["a", "i"], "text", "es")).toEqual({
                a: "[Símbolo químico no válido]",
                i: "[Símbolo químico no válido]",
            });
            expect((await values(doenetML, ["c"], "text", "es")).c).eq(
                "[Compuesto iónico no válido]",
            );
        });

        it("keeps the brackets outside the LaTeX text command", async () => {
            // The message is the words alone; the code puts them inside
            // `\text{}` and the brackets outside it, so the mathematics is
            // structured the same in every language.
            expect(await values(doenetML, ["a", "i"], "latex", "es")).toEqual({
                a: "[\\text{Símbolo químico no válido}]",
                i: "[\\text{Símbolo químico no válido}]",
            });
        });
    });

    it("takes the language from a `<document lang>` on the root", async () => {
        // Everything above declares the language through the host. `lang` on
        // the document is the author's own route to it, and it is answered by
        // an ancestor lookup that excludes the component it runs on — an
        // `<atom>` is never that document, so the lookup reaches it.
        const doenetML = `<document lang="es">
          <atom name="fe" symbol="Fe" />
          <ion name="cl" symbol="Cl" charge="-1" />
          <atom name="bad" symbol="Xx" />
        </document>`;
        expect(await values(doenetML, ["fe", "cl"], "name")).toEqual({
            fe: "Hierro",
            cl: "Cloruro",
        });
        expect((await values(doenetML, ["bad"], "text")).bad).eq(
            "[Símbolo químico no válido]",
        );
        // And the author's own route to a language does not reach the values
        // either, which is the half of #1577 a host-declared locale cannot
        // check on its own.
        expect((await values(doenetML, ["fe"], "groupName")).fe).eq(
            "Transition Metal",
        );
    });
});
