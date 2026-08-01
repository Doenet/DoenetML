import { describe, expect, it } from "vitest";

import {
    PSEUDO_LOCALE,
    PSEUDO_RTL_BRACKETS,
    PSEUDO_RTL_LOCALE,
    pseudoLocalize,
} from "../src/pseudo";
import { stripBidiIsolates } from "../src/direction";
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

describe("the right-to-left pseudo-locale", () => {
    it("renders the same text as the left-to-right one", () => {
        // The whole design: `en-XB` is a direction fixture, not a second
        // vocabulary. A difference between an `en-XA` run and an `en-XB` run
        // has to be a difference in layout, so the text must not vary.
        const ltr = pseudoLocalize(SOURCE);
        const rtl = pseudoLocalize(SOURCE, { brackets: PSEUDO_RTL_BRACKETS });
        expect(stripBidiIsolates(rtl)).toBe(ltr);
    });

    it("adds only invisible marks, inside the brackets", () => {
        const t = createTranslator([PSEUDO_RTL_LOCALE], {
            [PSEUDO_RTL_LOCALE]: pseudoLocalize(SOURCE, {
                brackets: PSEUDO_RTL_BRACKETS,
            }),
        });
        const greeting = t("greeting");
        // Still bracketed and still readable — the marks sit outside the `»`,
        // so a truncation check reads exactly as it does under `en-XA`.
        expect(greeting).toContain("»");
        expect(greeting).toContain("Ĥéļļó");
        expect(stripBidiIsolates(greeting).startsWith("»")).toBe(true);
        expect(stripBidiIsolates(greeting).endsWith("«")).toBe(true);
    });

    it("is still a catalog with the same keys", () => {
        const pseudo = pseudoLocalize(SOURCE, {
            brackets: PSEUDO_RTL_BRACKETS,
        });
        expect(catalogParseErrors(pseudo)).toEqual([]);
        expect(extractKeys(pseudo)).toEqual(extractKeys(SOURCE));
    });
});
