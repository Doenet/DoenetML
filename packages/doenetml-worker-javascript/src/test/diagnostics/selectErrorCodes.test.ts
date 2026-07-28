import { describe, expect, it, vi } from "vitest";
import { formatEnglishDiagnostic } from "@doenet/i18n";
import { createTestCore } from "../utils/test-core";
import { NO_SELECT_ERROR, selectError } from "../../utils/selectErrors";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * #1581: the `<select>` family's error boxes.
 *
 * These three components are the only ones that build an `_error` out of a
 * state variable rather than out of a caught value, and that state variable
 * held a finished English sentence with no code behind it — so they were the
 * last uncoded `_error` path in the worker, and the one place a Spanish reader
 * still got an English box.
 *
 * Two things are checked, and the second matters as much as the first: that
 * the code reaches the component the reader sees, and that the English each
 * code renders is *character for character* the sentence it replaced. That
 * second half is what keeps every existing `select` assertion true, and it is
 * the half a code alone cannot promise — a message rewritten while it moved
 * would change what an untranslated document says with nothing to catch it.
 *
 * One thing did move, deliberately: a count of four figures or more is grouped
 * now, because it is a Fluent argument rather than a concatenated string. That
 * has its own test below so it cannot happen again unnoticed.
 */
describe("the select family's error boxes carry their codes @group4", () => {
    /**
     * Every message this migrated, against the literal it replaced.
     *
     * Spelled out here rather than derived, because deriving it from the
     * catalog would compare the catalog against itself.
     */
    const ENGLISH: [Parameters<typeof selectError>[0], string][] = [
        [
            {
                code: "doenet-e0032",
                args: {
                    variantName: "apple",
                    numOptions: 2,
                    numToSelect: 1,
                },
            },
            "Invalid variant name for select.  Variant name apple appears in 2 options but number to select is 1.",
        ],
        [
            { code: "doenet-e0033", args: { variantName: "dos" } },
            "Some variants are specified for select but no options are specified for possible variant name: dos.",
        ],
        [
            { code: "doenet-e0034", args: { variantName: "donut" } },
            "Variant name donut that is specified for select is not a possible variant name.",
        ],
        [
            { code: "doenet-e0035", args: { numToSelect: 3, numOptions: 2 } },
            "Cannot select 3 components from only 2.",
        ],
        [
            { code: "doenet-e0036", args: { numToSelect: 3, length: 1 } },
            "Cannot select 3 values from a sequence of length 1.",
        ],
        [
            { code: "doenet-e0037" },
            "Number of indices specified for select must match number to select",
        ],
        [
            { code: "doenet-e0038" },
            "All indices specified for select must be integers",
        ],
        [
            { code: "doenet-e0039" },
            "Specified index of selectfromsequence that was excluded",
        ],
        [
            { code: "doenet-e0040" },
            "Specified indices of selectfromsequence that was an excluded combination",
        ],
        [
            { code: "doenet-e0041" },
            "Cannot select coprime combinations as not selecting positive integers.",
        ],
        [
            { code: "doenet-e0042" },
            `Cannot select coprime numbers. All possible values share a common factor. (Specified values of "from" or "to" must be coprime with "step".)`,
        ],
        [
            { code: "doenet-e0043" },
            "Cannot select coprime combinations from a single number that is not 1.",
        ],
        [
            { code: "doenet-e0044" },
            "Excluded over 70% of combinations in selectFromSequence",
        ],
        [
            { code: "doenet-e0045" },
            "Could not select coprime numbers. All possible values share a common factor.",
        ],
        [
            {
                code: "doenet-e0046",
                args: { numToSelect: 3, numPossibleValues: 2 },
            },
            "Cannot select 3 unique values from sequence of length 2",
        ],
        [
            { code: "doenet-e0047", args: { numToSelect: 5, numValues: 3 } },
            "Cannot select 5 values from a list of primes of length 3",
        ],
        [
            { code: "doenet-e0048" },
            "Number of values specified for select must match number to select",
        ],
        [
            { code: "doenet-e0049" },
            "All values specified for select prime number must be in the list of primes",
        ],
        [
            { code: "doenet-e0050" },
            "Specified values of selectPrimeNumbers was an excluded combination",
        ],
        [
            { code: "doenet-e0051" },
            "Excluded over 70% of combinations in selectPrimeNumbers",
        ],
        [
            { code: "doenet-e0052" },
            "By extremely unlikely fluke, couldn't select combination of random values",
        ],
        [
            { code: "doenet-e0053" },
            "By extremely unlikely fluke, couldn't select random value",
        ],
    ];

    it("renders each code to the English sentence it replaced", () => {
        const rendered = ENGLISH.map(([diagnostic]) =>
            formatEnglishDiagnostic(diagnostic.code, diagnostic.args),
        );
        expect(rendered).eqls(ENGLISH.map(([, english]) => english));
    });

    it("groups a count of four figures, which the concatenation did not", () => {
        // The one way the English moved. A count is passed as a number, not as
        // text, so a language that agrees a noun with it can select on it —
        // and Fluent formats it, so English groups it. The sentence this
        // replaced concatenated the count and wrote "1500". Pinned rather than
        // left to be discovered, because `numToSelect` is author-supplied and
        // unbounded.
        expect(
            formatEnglishDiagnostic("doenet-e0035", {
                numToSelect: 1500,
                numOptions: 1,
            }),
        ).eq("Cannot select 1,500 components from only 1.");
    });

    it("writes that English onto the state variable beside the code", () => {
        // `errorMessage` is what the box falls back to and what the existing
        // suites assert on, so it has to be the catalog's English rather than
        // a second copy of it kept by hand.
        for (const [diagnostic, english] of ENGLISH) {
            expect(selectError(diagnostic)).eqls({
                errorMessage: english,
                errorDiagnostic: diagnostic,
            });
        }
    });

    it("has nothing to carry when nothing went wrong", () => {
        expect(NO_SELECT_ERROR).eqls({
            errorMessage: "",
            errorDiagnostic: null,
        });
    });

    async function errorComponent(doenetML: string) {
        const { core } = await createTestCore({ doenetML });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const errors = Object.values(stateVariables).filter(
            (component: any) => component.componentType === "_error",
        ) as any[];
        expect(errors.length).eq(1);
        return errors[0].stateValues;
    }

    it("reaches the box a `<select>` becomes", async () => {
        expect(
            await errorComponent(
                `<select name="s" numToSelect="3"><option><p>a</p></option><option><p>b</p></option></select>`,
            ),
        ).toMatchObject({
            code: "doenet-e0035",
            args: { numToSelect: 3, numOptions: 2 },
            message: "Cannot select 3 components from only 2.",
        });
    });

    it("reaches the box a `<selectFromSequence>` becomes", async () => {
        expect(
            await errorComponent(
                `<selectFromSequence name="s" numToSelect="3" from="1" to="1" />`,
            ),
        ).toMatchObject({
            code: "doenet-e0036",
            args: { numToSelect: 3, length: 1 },
            message: "Cannot select 3 values from a sequence of length 1.",
        });
    });

    it("reaches the box a `<selectPrimeNumbers>` becomes", async () => {
        expect(
            await errorComponent(
                `<selectPrimeNumbers name="s" numToSelect="5" minValue="2" maxValue="5" />`,
            ),
        ).toMatchObject({
            code: "doenet-e0047",
            args: { numToSelect: 5, numValues: 3 },
            message: "Cannot select 5 values from a list of primes of length 3",
        });
    });

    it("keeps the coprime pair as two situations rather than one", async () => {
        // The two coprime failures differ only in their opening verb, which
        // made them look like one message worded twice. They are not: the
        // first is decided from the sequence's own arithmetic before anything
        // is drawn, the second is what is left after two hundred draws found
        // nothing. Separate codes, so a host filtering on one does not catch
        // the other.
        expect(
            await errorComponent(
                `<selectFromSequence name="s" numToSelect="2" from="2" step="4" coprime />`,
            ),
        ).toMatchObject({ code: "doenet-e0042" });

        expect(
            await errorComponent(
                `<selectFromSequence name="s" numToSelect="2" from="2" to="4" exclude="3" coprime />`,
            ),
        ).toMatchObject({ code: "doenet-e0045" });
    });
});
