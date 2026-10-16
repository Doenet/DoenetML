import { describe, expect, it } from "vitest";
import {
    analyzeRepeatTemplate,
    evaluateRepeatTemplate,
    invertRepeatTemplate,
} from "../../utils/repeatTemplate";

/**
 * The template evaluator of a repeat made a list (`utils/repeatTemplate.js`),
 * called as `RepeatValueList` calls it, with values a document does not
 * easily reach.
 */
describe("repeat template evaluator", () => {
    const settings = { simplify: "none", expand: false };

    function numberTemplate(children: string[]) {
        return analyzeRepeatTemplate({
            componentType: "number",
            componentIdx: 0,
            attributes: {},
            children,
            doenetAttributes: {},
        });
    }

    for (const [label, children] of [
        ["a literal number", ["7"]],
        ["an empty number", []],
    ] as [string, string[]][]) {
        it(`${label} takes a complex number as its text, as a <number> does`, () => {
            const analysis = numberTemplate(children);
            const context = {
                analysis,
                settings,
                codeValue: () => undefined,
                codeCanBeModified: () => false,
            };
            // `plainComplex` holds a complex number as `{ re, im }`
            const inverse = invertRepeatTemplate({
                ...context,
                desiredValue: { re: 2, im: 3 },
            });
            expect(inverse.success).toBe(true);
            expect(inverse.texts[0].string).not.toContain("object");
            expect(
                evaluateRepeatTemplate({ ...context, texts: inverse.texts }),
            ).toEqual({ re: 2, im: 3 });
        });
    }
});
