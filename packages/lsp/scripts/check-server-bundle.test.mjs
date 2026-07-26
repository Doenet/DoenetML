import { describe, expect, it } from "vitest";
import {
    CATALOG_NEEDLES,
    catalogLeaksIn,
    checkBundle,
    readBudget,
} from "./check-server-bundle.mjs";

/** A bundle that carries nothing the checks object to. */
const CLEAN = `var e=function(t){return t+1};export{e as bump};`;

describe("catalog detection", () => {
    it("passes a bundle with no catalog in it", () => {
        expect(catalogLeaksIn(CLEAN)).toEqual([]);
    });

    it("catches catalog text with the formatter shaken away", () => {
        // The leak that actually happened: `@doenet/i18n` had not declared
        // itself side-effect-free, so a bundler kept the module-level
        // statements — and therefore the `?raw` FTL files — in a bundle whose
        // only reason to reach the package had already been eliminated. An
        // identifier-only check would have reported this bundle as clean.
        const leaked = `${CLEAN}var ftl="# Errors and warnings surfaced to the reader\\nx = { $n ->\\n *[other] many\\n}";`;
        const problems = catalogLeaksIn(leaked);
        expect(problems).toHaveLength(1);
        expect(problems[0]).toContain("FTL catalog source");
        expect(leaked).not.toContain("formatEnglishDiagnostic");
    });

    it("catches the Fluent runtime with no catalog text", () => {
        // The other direction: a bundle that pulls the library in for some
        // reason that has nothing to do with the catalogs.
        const problems = catalogLeaksIn(`${CLEAN}import{FluentBundle}from"x";`);
        expect(problems).toHaveLength(1);
        expect(problems[0]).toContain("the Fluent runtime");
    });

    it("reports one line per payload, not one per needle", () => {
        // Three runtime fingerprints, one problem — otherwise a single leak
        // reads like three unrelated failures.
        const problems = catalogLeaksIn(
            `FluentBundle FluentResource "@fluent/bundle"`,
        );
        expect(problems).toHaveLength(1);
        expect(problems[0]).toContain("FluentBundle");
        expect(problems[0]).toContain("FluentResource");
    });

    it("names every needle it matched, so the failure is actionable", () => {
        for (const { needle } of CATALOG_NEEDLES) {
            expect(catalogLeaksIn(needle)[0]).toContain(JSON.stringify(needle));
        }
    });
});

describe("the size budget", () => {
    it("passes a bundle at exactly its budget", () => {
        expect(
            checkBundle({ contents: CLEAN, size: 1000, maxBytes: 1000 }),
        ).toEqual([]);
    });

    it("fails a bundle one byte over", () => {
        const problems = checkBundle({
            contents: CLEAN,
            size: 1001,
            maxBytes: 1000,
        });
        expect(problems).toHaveLength(1);
        expect(problems[0]).toContain("over its");
    });

    it("reports a size problem and a leak together", () => {
        // Both checks run; the first failure must not mask the second, or
        // fixing one turns up the other only on the next CI run.
        expect(
            checkBundle({
                contents: `${CLEAN}FluentBundle`,
                size: 5000,
                maxBytes: 1000,
            }),
        ).toHaveLength(2);
    });
});

describe("reading the budget file", () => {
    it("accepts a numeric maxBytes", () => {
        expect(readBudget(`{"maxBytes": 1155000}`)).toEqual({
            maxBytes: 1155000,
            problems: [],
        });
    });

    it.each([
        ["not JSON at all", "{"],
        ["a missing maxBytes", `{"_comment": "oops"}`],
        ["a string maxBytes", `{"maxBytes": "1155000"}`],
        ["a NaN maxBytes", `{"maxBytes": null}`],
    ])("refuses %s rather than passing vacuously", (_case, text) => {
        // `size > undefined` is `false`, so a malformed budget would report
        // the bundle as within a `NaN` budget and pass. A check that has
        // silently stopped guarding is worse than no check, because the green
        // tick is what everyone reads.
        const { maxBytes, problems } = readBudget(text);
        expect(maxBytes).toBeUndefined();
        expect(problems).toHaveLength(1);
    });
});
