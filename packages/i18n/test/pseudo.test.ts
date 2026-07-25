import { describe, expect, it } from "vitest";

import { PSEUDO_LOCALE, pseudoLocalize } from "../src/pseudo";
import { createTranslator } from "../src/translator";
import { catalogParseErrors, extractKeys } from "../scripts/catalogUtils";

const SOURCE = `# A comment that must survive untouched
-brand = Doenet
greeting = Hello there
count-items = You have { $count } items
welcome = Welcome to { -brand }
plural =
    { $count ->
        [one] one apple
       *[other] many apples
    }
color =
    .blue = blue
    .red = red
`;

describe("pseudoLocalize", () => {
    it("round-trips: the output is still a catalog with the same keys", () => {
        const pseudo = pseudoLocalize(SOURCE);
        expect(catalogParseErrors(pseudo)).toEqual([]);
        expect(extractKeys(pseudo)).toEqual(extractKeys(SOURCE));
    });

    it("leaves term ids alone so term references still resolve", () => {
        // `-brand` is syntax, not text: accenting the id would break the
        // definition and orphan every `{ -brand }` that references it.
        const t = createTranslator([PSEUDO_LOCALE], {
            [PSEUDO_LOCALE]: pseudoLocalize(SOURCE),
        });
        expect(t("welcome")).toContain("Ðóéñéţ");
    });

    it("accents the text so unextracted strings stand out", () => {
        const t = createTranslator([PSEUDO_LOCALE], {
            [PSEUDO_LOCALE]: pseudoLocalize(SOURCE),
        });
        const greeting = t("greeting");
        expect(greeting).not.toBe("Hello there");
        expect(greeting).toContain("Ĥéļļó");
    });

    it("leaves placeables intact so arguments still substitute", () => {
        const t = createTranslator([PSEUDO_LOCALE], {
            [PSEUDO_LOCALE]: pseudoLocalize(SOURCE),
        });
        expect(t("count-items", { count: 3 })).toContain("3");
    });

    it("keeps select expressions working", () => {
        const t = createTranslator([PSEUDO_LOCALE], {
            [PSEUDO_LOCALE]: pseudoLocalize(SOURCE),
        });
        expect(t("plural", { count: 1 })).toContain("óñé");
        expect(t("plural", { count: 5 })).toContain("ɱáñý");
    });

    it("expands values to expose layouts that only fit English", () => {
        const t = createTranslator([PSEUDO_LOCALE], {
            [PSEUDO_LOCALE]: pseudoLocalize(SOURCE),
        });
        expect(t("greeting").length).toBeGreaterThan("Hello there".length);
    });

    it("brackets values so truncation is visible", () => {
        const t = createTranslator([PSEUDO_LOCALE], {
            [PSEUDO_LOCALE]: pseudoLocalize(SOURCE),
        });
        expect(t("greeting").startsWith("»")).toBe(true);
        expect(t("greeting").endsWith("«")).toBe(true);
    });

    it("does not touch comments or identifiers", () => {
        const pseudo = pseudoLocalize(SOURCE);
        expect(pseudo).toContain("# A comment that must survive untouched");
        expect(pseudo).toContain("greeting =");
        expect(pseudo).toContain("count-items =");
    });

    it("honors custom expansion and bracket options", () => {
        const pseudo = pseudoLocalize("greeting = Hi", {
            expansion: 0,
            brackets: ["[", "]"],
        });
        expect(pseudo.trim()).toBe("greeting = [Ĥí]");
    });
});
