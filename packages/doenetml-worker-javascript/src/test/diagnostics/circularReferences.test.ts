import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * Doenet/DoenetML#1665: an attribute written in terms of the values its own
 * component has yet to produce cannot be evaluated until the component is
 * expanded, and the component cannot be expanded until the attribute is
 * evaluated. Doenet recognized the cycle all along, but the error was raised
 * from a blocker registration nobody awaited, so it was dropped and resolution
 * went on around the cycle until the worker ran out of memory. Each case below
 * exhausted the heap before the fix.
 *
 * The shapes are gathered here rather than spread over the component suites
 * because none of them is about the component: they all fail at the same step
 * of reference resolution.
 */
describe("Circular reference tests @group2", async () => {
    const circularError = "Circular dependency involving these components";

    const selfReferentialAttributes: [string, string][] = [
        [
            "selectFromSequence exclude (the reported case)",
            `<selectFromSequence name="a" from="1" to="10" numToSelect="2" exclude="2$a[1]"/>`,
        ],
        [
            "selectFromSequence from",
            `<selectFromSequence name="a" from="$a[1]" to="10" numToSelect="2"/>`,
        ],
        [
            "selectFromSequence numToSelect",
            `<selectFromSequence name="a" from="1" to="10" numToSelect="$a[1]"/>`,
        ],
        ["sequence step", `<sequence name="a" from="1" to="10" step="$a[1]"/>`],
        ["sequence length", `<sequence name="a" from="1" length="$a[1]"/>`],
        [
            "select numToSelect",
            `<select name="a" numToSelect="$a[1]"><option><math>1</math></option><option><math>2</math></option></select>`,
        ],
        [
            "repeat for",
            `<repeat name="r" valueName="v" for="$r[1]"><number>$v</number></repeat>`,
        ],
        [
            "conditionalContent condition",
            `<conditionalContent name="c" condition="$c[1] > 0"><number>1</number></conditionalContent>`,
        ],
    ];

    for (const [description, doenetML] of selfReferentialAttributes) {
        it(`${description} is reported as circular`, async () => {
            await expect(createTestCore({ doenetML })).rejects.toThrow(
                circularError,
            );
        });
    }

    // Two components, each excluding a value the other has yet to produce:
    // the same cycle, drawn across a pair rather than closed on one component.
    it("mutually referential excludes are reported as circular", async () => {
        await expect(
            createTestCore({
                doenetML: `
    <selectFromSequence name="a" from="1" to="10" exclude="$b[1]"/>
    <selectFromSequence name="b" from="1" to="10" exclude="$a[1]"/>
    `,
            }),
        ).rejects.toThrow(circularError);
    });
});
