/**
 * Unit tests for the `hasImplicitSingleIndex` strict-rule predicate that
 * gates the `$s.t` shorthand on the select family. Issue #1181.
 *
 * The predicate is a pure textual check on the DAST attribute, so a small
 * batch of source strings is enough to pin every branch — the
 * cross-layer integration tests live alongside the autocomplete and
 * context-help suites.
 */
import { describe, expect, it } from "vitest";
import type { DastElement } from "@doenet/parser";
import { DoenetSourceObject } from "../src/doenet-source-object";
import {
    SELECT_FAMILY_COUNT_ATTRIBUTE,
    hasImplicitSingleIndex,
} from "../src/auto-completer/select-family";

/** Parse `source` and return the first top-level element with `name`. */
function elementNamed(source: string, name: string): DastElement {
    const sourceObj = new DoenetSourceObject(source);
    const top = sourceObj.dast.children.find(
        (c): c is DastElement => c.type === "element" && c.name === name,
    );
    if (!top) throw new Error(`No <${name}> in source: ${source}`);
    return top;
}

describe("hasImplicitSingleIndex (strict rule, issue #1181)", () => {
    describe("attribute absent or trimmed === '1' → true", () => {
        it("accepts <select> with no numToSelect", () => {
            expect(
                hasImplicitSingleIndex(
                    elementNamed(`<select name="s" />`, "select"),
                ),
            ).toBe(true);
        });

        it('accepts numToSelect="1"', () => {
            expect(
                hasImplicitSingleIndex(
                    elementNamed(
                        `<select name="s" numToSelect="1" />`,
                        "select",
                    ),
                ),
            ).toBe(true);
        });

        it('accepts numToSelect=" 1 " (whitespace trimmed)', () => {
            expect(
                hasImplicitSingleIndex(
                    elementNamed(
                        `<select name="s" numToSelect=" 1 " />`,
                        "select",
                    ),
                ),
            ).toBe(true);
        });

        it('accepts numToSelect="\\t1\\n" (any leading/trailing whitespace)', () => {
            expect(
                hasImplicitSingleIndex(
                    elementNamed(
                        `<select name="s" numToSelect="\t1\n" />`,
                        "select",
                    ),
                ),
            ).toBe(true);
        });
    });

    describe("anything else → false", () => {
        it.each([
            ["2", `<select name="s" numToSelect="2" />`],
            ["$n (dynamic)", `<select name="s" numToSelect="$n" />`],
            ["1.0", `<select name="s" numToSelect="1.0" />`],
            ["01", `<select name="s" numToSelect="01" />`],
            ["One", `<select name="s" numToSelect="One" />`],
            ["1 2 (multi-token)", `<select name="s" numToSelect="1 2" />`],
        ])("rejects numToSelect=%s", (_label, source) => {
            expect(hasImplicitSingleIndex(elementNamed(source, "select"))).toBe(
                false,
            );
        });
    });

    describe("non-select-family elements → false (always)", () => {
        it.each([
            ["repeat", `<repeat name="r" for="1 2 3" />`],
            [
                "repeatForSequence",
                `<repeatForSequence name="r" from="1" to="3" />`,
            ],
            ["conditionalContent", `<conditionalContent name="cc" />`],
            ["math", `<math name="m">x</math>`],
        ])("rejects <%s> even with no count attribute", (name, source) => {
            expect(hasImplicitSingleIndex(elementNamed(source, name))).toBe(
                false,
            );
        });
    });

    describe("each select-family member reads its own count attribute", () => {
        it("selectFromSequence uses numToSelect", () => {
            expect(SELECT_FAMILY_COUNT_ATTRIBUTE.selectFromSequence).toBe(
                "numToSelect",
            );
            expect(
                hasImplicitSingleIndex(
                    elementNamed(
                        `<selectFromSequence name="s" from="1" to="5" />`,
                        "selectFromSequence",
                    ),
                ),
            ).toBe(true);
            expect(
                hasImplicitSingleIndex(
                    elementNamed(
                        `<selectFromSequence name="s" from="1" to="5" numToSelect="2" />`,
                        "selectFromSequence",
                    ),
                ),
            ).toBe(false);
        });

        it("selectRandomNumbers uses numToSelect", () => {
            expect(SELECT_FAMILY_COUNT_ATTRIBUTE.selectRandomNumbers).toBe(
                "numToSelect",
            );
            expect(
                hasImplicitSingleIndex(
                    elementNamed(
                        `<selectRandomNumbers name="s" />`,
                        "selectRandomNumbers",
                    ),
                ),
            ).toBe(true);
            expect(
                hasImplicitSingleIndex(
                    elementNamed(
                        `<selectRandomNumbers name="s" numToSelect="3" />`,
                        "selectRandomNumbers",
                    ),
                ),
            ).toBe(false);
        });

        it("selectPrimeNumbers uses numToSelect", () => {
            expect(SELECT_FAMILY_COUNT_ATTRIBUTE.selectPrimeNumbers).toBe(
                "numToSelect",
            );
            expect(
                hasImplicitSingleIndex(
                    elementNamed(
                        `<selectPrimeNumbers name="s" />`,
                        "selectPrimeNumbers",
                    ),
                ),
            ).toBe(true);
        });

        it("samplePrimeNumbers uses numSamples", () => {
            // The issue text said `numToSample`; the actual attribute is
            // `numSamples`. The lookup table uses the real attribute name.
            expect(SELECT_FAMILY_COUNT_ATTRIBUTE.samplePrimeNumbers).toBe(
                "numSamples",
            );
            expect(
                hasImplicitSingleIndex(
                    elementNamed(
                        `<samplePrimeNumbers name="s" />`,
                        "samplePrimeNumbers",
                    ),
                ),
            ).toBe(true);
            expect(
                hasImplicitSingleIndex(
                    elementNamed(
                        `<samplePrimeNumbers name="s" numSamples="1" />`,
                        "samplePrimeNumbers",
                    ),
                ),
            ).toBe(true);
            expect(
                hasImplicitSingleIndex(
                    elementNamed(
                        `<samplePrimeNumbers name="s" numSamples="4" />`,
                        "samplePrimeNumbers",
                    ),
                ),
            ).toBe(false);
        });

        it("sampleRandomNumbers uses numSamples", () => {
            expect(SELECT_FAMILY_COUNT_ATTRIBUTE.sampleRandomNumbers).toBe(
                "numSamples",
            );
            expect(
                hasImplicitSingleIndex(
                    elementNamed(
                        `<sampleRandomNumbers name="s" />`,
                        "sampleRandomNumbers",
                    ),
                ),
            ).toBe(true);
            expect(
                hasImplicitSingleIndex(
                    elementNamed(
                        `<sampleRandomNumbers name="s" numSamples="2" />`,
                        "sampleRandomNumbers",
                    ),
                ),
            ).toBe(false);
        });
    });
});
