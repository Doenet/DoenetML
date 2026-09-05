import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    describeCompositeRanges,
    renderedText,
} from "../utils/rendered-commas";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * The replacements of a composite that asks to be shown as a list are separated
 * by commas automatically, and that happens four times over from the same core
 * data:
 *
 * - the renderers insert `", "` between React children
 *   (`addCommasForCompositeRanges`, `doenetml/src/Viewer/renderers/utils/composites.tsx`);
 * - the `text` state variable joins the children's text with `", "`
 *   (`textFromChildren`, `doenetml-worker-javascript/src/utils/text.ts`);
 * - the string a `<math>` parses gets its commas
 *   (`createInputStringFromChildren`, `doenetml-worker-javascript/src/utils/parseMath.ts`);
 * - the FlatDast the prototype renderers read gets `<asList>` wrappers
 *   (`applyCompositeListWrapping`, `doenetml-worker/src/compositeListWrapping.ts`).
 *
 * All four read one array the core builds in
 * `CompositeExpander.replaceCompositeChildren` — for each composite that
 * contributed children, the index range those children occupy, whether the
 * composite has `asList` set, and whether each replacement is eligible to be a
 * list item — and group it with `groupCompositeRanges` (`@doenet/utils`). What
 * each does with a group is its own, so every case below checks the `text`
 * value and the text the renderers would show against the same expectation.
 *
 * `renderedText` runs the shipped renderer code over the shipped renderer state
 * and stands in only for the individual child renderers; see
 * `../utils/rendered-commas.tsx`.
 */

/**
 * Build a document from `<p>` bodies keyed by name, then check the text the
 * `text` state variable reports and the text the renderers would show against
 * the same expectation.
 */
async function checkParagraphs(
    paragraphs: Record<string, { body: string; expected: string }>,
    preamble = "",
) {
    const doenetML =
        preamble +
        Object.entries(paragraphs)
            .map(([name, { body }]) => `<p name="${name}">${body}</p>`)
            .join("\n");

    const { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });
    const stateVariables = await core.returnAllStateVariables(false, true);

    for (const [name, { expected }] of Object.entries(paragraphs)) {
        const idx = await resolvePathToNodeIdx(name);
        expect(
            stateVariables[idx].stateValues.text,
            `text of <p name="${name}">`,
        ).eq(expected);
        expect(
            renderedText(core, stateVariables, idx),
            `rendered text of <p name="${name}">`,
        ).eq(expected);
    }
}

describe("Automatic commas between composite replacements @group3", () => {
    it("separates the replacements of a list component", async () => {
        await checkParagraphs({
            plain: {
                body: `<numberList>1 2 3 4</numberList>`,
                expected: "1, 2, 3, 4",
            },
            oneItem: { body: `<numberList>1</numberList>`, expected: "1" },
            withText: {
                body: `Values: <numberList>1 2</numberList>.`,
                expected: "Values: 1, 2.",
            },
        });
    });

    it("honors asList on the composite", async () => {
        await checkParagraphs({
            off: {
                body: `<numberList asList="false">1 2 3</numberList>`,
                expected: "123",
            },
            on: {
                body: `<group asList><number>1</number><number>2</number></group>`,
                expected: "1, 2",
            },
            groupDefaultsToNoList: {
                body: `<group><number>1</number><number>2</number></group>`,
                expected: "12",
            },
        });
    });

    it("lets the innermost composite decide", async () => {
        // Composites are meant to be transparent to authors: whichever
        // composite most closely wraps the replacements settles whether they
        // are a list, whatever the outer one says.
        await checkParagraphs({
            listInsideNonList: {
                body: `<group><numberList>1 2 3</numberList></group>`,
                expected: "1, 2, 3",
            },
            listInsideExplicitNonList: {
                body: `<group asList="false"><numberList>1 2 3</numberList></group>`,
                expected: "1, 2, 3",
            },
            nonListInsideList: {
                body: `<group asList><numberList asList="false">1 2 3</numberList></group>`,
                expected: "123",
            },
        });
    });

    it("counts an inner composite as a single item of the outer list", async () => {
        await checkParagraphs({
            nested: {
                body: `<group asList><group><number>1</number><number>2</number></group><number>3</number></group>`,
                expected: "12, 3",
            },
            twoInnerLists: {
                body: `<group asList><group asList><number>1</number><number>2</number></group><group asList><number>3</number><number>4</number></group></group>`,
                expected: "1, 2, 3, 4",
            },
            innerListsNoOuterList: {
                body: `<group><numberList>1 2</numberList><numberList>3 4</numberList></group>`,
                expected: "1, 23, 4",
            },
        });
    });

    it("separates the items of a repeat, and the list inside each item", async () => {
        await checkParagraphs({
            repeat: {
                body: `<repeatForSequence from="1" to="2" valueName="v"><numberList>$v 9</numberList></repeatForSequence>`,
                expected: "1, 9, 2, 9",
            },
            repeatNoList: {
                body: `<repeatForSequence asList="false" from="1" to="3" valueName="v"><number>$v</number></repeatForSequence>`,
                expected: "123",
            },
        });
    });

    it("records one range per composite that contributed children", async () => {
        // The array every consumer reads. An outer composite comes first and
        // the ranges after it, with indices inside its own, are its
        // replacements' — here, the repeat separates its two items, and the
        // list inside each item separates its own numbers.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<p name="p"><repeatForSequence name="r" from="1" to="2" valueName="v"><numberList name="nl">$v 9</numberList></repeatForSequence></p>`,
        });
        await core.returnAllStateVariables(false, true);
        expect(
            describeCompositeRanges(core, await resolvePathToNodeIdx("p")),
        ).eq(
            [
                "r [0-3] asList=true",
                "  r:1 [0-1] asList=false",
                "    r:1.nl [0-1] asList=true",
                "  r:2 [2-3] asList=false",
                "    r:2.nl [2-3] asList=true",
            ].join("\n"),
        );
    });

    it("holds back the commas when a replacement cannot be a list item", async () => {
        // `<me>` sets `canBeInList = false`; one such replacement settles it
        // for the whole composite. Only the `text` pathway is checked here: a
        // `<me>` renders through MathJax, which the renderer stand-in cannot
        // show.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `<p name="p"><group asList><number>1</number><number>2</number><me>x</me></group></p>`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("p")].stateValues.text,
        ).eq("12x");
    });

    it("holds back the commas wherever the composite sits", async () => {
        // The eligibility flags are kept in step with each expansion by index
        // within the composite's own range; getting that index wrong made the
        // answer depend on whether the composite happened to start at the
        // parent's first child.
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
<p name="atStart"><group asList><numberList>1 2</numberList><me>x</me></group></p>
<p name="shifted">lead <group asList><numberList>1 2</numberList><me>x</me></group></p>
`,
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("atStart")].stateValues
                .text,
        ).eq("1, 2x");
        expect(
            stateVariables[await resolvePathToNodeIdx("shifted")].stateValues
                .text,
        ).eq("lead 1, 2x");
    });

    it("skips a composite that produced no replacements", async () => {
        await checkParagraphs({
            emptyInMiddle: {
                body: `<group asList><number>1</number><sequence length="0" /><number>2</number></group>`,
                expected: "1, 2",
            },
            emptyAtStart: {
                body: `<group asList><sequence length="0" /><number>1</number><number>2</number></group>`,
                expected: "1, 2",
            },
            emptyAtEnd: {
                body: `<group asList><number>1</number><number>2</number><sequence length="0" /></group>`,
                expected: "1, 2",
            },
        });
    });

    it("leaves a hidden replacement out of the list", async () => {
        await checkParagraphs({
            hiddenItem: {
                body: `<group asList><number hide>1</number><number>2</number><number>3</number></group>`,
                expected: "2, 3",
            },
            hiddenList: {
                body: `<numberList hide>1 2 3</numberList>after`,
                expected: "after",
            },
        });
    });

    it("keeps the whitespace around replacements out of the list", async () => {
        // The newlines an author writes around a composite are separators, not
        // items, and no space is left in front of a comma.
        await checkParagraphs({
            onOwnLines: {
                body: `\n<numberList>1 2 3</numberList>\n`,
                expected: "\n1, 2, 3\n",
            },
        });
    });

    it("takes an item's trailing whitespace off in front of a comma", async () => {
        await checkParagraphs({
            blankInsideItem: {
                body: `<group asList><group><number>1</number> </group><group><number>2</number> </group></group>`,
                expected: "1, 2 ",
            },
            blankBetweenItems: {
                body: `<repeatForSequence from="1" to="3" valueName="v" asList><number>$v</number> </repeatForSequence>`,
                expected: "1, 2, 3",
            },
        });
    });

    it("puts the comma where the whitespace between two items was", async () => {
        // Issue #499: the spaces an author puts between the items of a list
        // group are where the commas go. An empty composite among them is
        // nothing at all, and one that has items is a single item of the
        // list, with commas of its own.
        await checkParagraphs(
            {
                spaced: {
                    body: `<group asList><number>1</number> <number>2</number> <number>3</number></group>`,
                    expected: "1, 2, 3",
                },
                withEmpty: {
                    body: `<group asList><number>1</number> <number>2</number> $s <number>3</number></group>`,
                    expected: "1, 2, 3",
                },
                withTwoEmpty: {
                    body: `<group asList><number>1</number> <number>2</number> $s $s2 <number>3</number></group>`,
                    expected: "1, 2, 3",
                },
                withItems: {
                    body: `<group asList><number>1</number> <number>2</number> $s3 <number>3</number></group>`,
                    expected: "1, 2, 7, 8, 3",
                },
                onOwnLines: {
                    body: `\n<group asList>\n<number>1</number> <number>2</number> $s <number>3</number>\n</group>\n`,
                    expected: "\n\n1, 2, 3\n\n",
                },
            },
            `<setup><sequence name="s" length="0" /><sequence name="s2" length="0" /><sequence name="s3" from="7" to="8" /></setup>\n`,
        );
    });

    it("keeps the commas through a reference to the list", async () => {
        await checkParagraphs(
            {
                reference: { body: `$nl`, expected: "1, 2, 3" },
                extended: {
                    body: `<numberList extend="$nl" />`,
                    expected: "1, 2, 3",
                },
                referenceTwice: {
                    body: `$nl $nl`,
                    expected: "1, 2, 3 1, 2, 3",
                },
            },
            `<setup><numberList name="nl">1 2 3</numberList></setup>\n`,
        );
    });

    it("keeps the commas through a reference into a repeat", async () => {
        await checkParagraphs(
            {
                whole: { body: `$r`, expected: "1, 2, 3, 4, 1, 2, 3, 4" },
                item: { body: `$r[1]`, expected: "1, 2, 3, 4" },
            },
            `<setup>
                <numberList name="nl">1 2 3 4</numberList>
                <repeatForSequence name="r" from="1" to="2">$nl</repeatForSequence>
            </setup>\n`,
        );
    });

    it("keeps the commas through a reference into a nested repeat", async () => {
        // Issue #596.
        await checkParagraphs(
            {
                item: {
                    body: `This should have commas: $a[1]`,
                    expected: "This should have commas: 6, 8",
                },
            },
            `<setup>
                <repeatForSequence from="1" to="2" name="a" valueName="x">
                    <repeatForSequence from="5" to="7" step="2" name="b" valueName="y">
                        <number>$x+$y</number>
                    </repeatForSequence>
                </repeatForSequence>
            </setup>\n`,
        );
    });

    it("keeps the commas of a list operator, directly and through a reference", async () => {
        // The list operators (`<cumulativeSum>`, `<differences>`, and so on)
        // are composites with `asList` of their own, so a reference to one
        // copies the operator and keeps its list.
        await checkParagraphs(
            {
                direct: {
                    body: `<cumulativeSum>1 2 3</cumulativeSum>`,
                    expected: "1, 3, 6",
                },
                off: {
                    body: `<cumulativeSum asList="false">1 2 3</cumulativeSum>`,
                    expected: "136",
                },
                reference: { body: `$cs`, expected: "3, 4, 6" },
                item: { body: `$cs[2]`, expected: "4" },
                extended: {
                    body: `<numberList extend="$cs" />`,
                    expected: "3, 4, 6",
                },
                inGroup: {
                    body: `<group asList><differences>1 4 9</differences> <text>x</text></group>`,
                    expected: "3, 5, x",
                },
            },
            `<setup>
                <numberList name="nl">3 1 2</numberList>
                <cumulativeSum name="cs">$nl</cumulativeSum>
            </setup>\n`,
        );
    });

    it("keeps the commas through a reference to a group", async () => {
        await checkParagraphs(
            {
                group: { body: `$g`, expected: "1, 2, 3" },
                extended: {
                    body: `<group extend="$g" />`,
                    expected: "1, 2, 3",
                },
            },
            `<setup><group name="g"><numberList>1 2 3</numberList></group></setup>\n`,
        );
    });
});

describe("Automatic commas inside a <math> @group3", () => {
    // `createInputStringFromChildren` (`utils/parseMath.ts`) joins the children
    // into the string that gets parsed into a math expression. It wraps a list
    // in parentheses when what sits next to it is not a delimiter, and to find
    // that out it walks outward past whitespace-only strings — a walk that used
    // to never move its index, so a component child (or a blank string) on
    // either side hung the core.
    it("wraps the list when a neighbor is not a delimiter", async () => {
        const cases: Record<string, string> = {
            alone: `<numberList>1 2</numberList>`,
            inParens: `( <numberList>1 2</numberList> )`,
            stringLeft: `3 <numberList>1 2</numberList>`,
            componentLeft: `<number>3</number> <numberList>1 2</numberList>`,
            componentRight: `<numberList>1 2</numberList> <number>3</number>`,
            bothSides: `3 + <numberList>1 2</numberList> + 4`,
        };
        const { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: Object.entries(cases)
                .map(
                    ([name, body]) =>
                        `<p><math name="${name}">${body}</math></p>`,
                )
                .join("\n"),
        });
        const stateVariables = await core.returnAllStateVariables(false, true);
        const latex = async (name: string) =>
            stateVariables[await resolvePathToNodeIdx(name)].stateValues.latex;

        expect(await latex("alone")).eq("1, 2");
        expect(await latex("inParens")).eq("\\left( 1, 2 \\right)");
        expect(await latex("stringLeft")).eq("3 \\left( 1, 2 \\right)");
        expect(await latex("componentLeft")).eq("3 \\left( 1, 2 \\right)");
        expect(await latex("componentRight")).eq(
            "\\left( 1, 2 \\right) \\cdot 3",
        );
        expect(await latex("bothSides")).eq("3 + \\left( 1, 2 \\right) + 4");
    });
});

/**
 * Cases that are wrong today. Each is written as the behavior we want and
 * marked `it.fails`, so it turns red the moment the underlying defect is fixed
 * and the case can be moved into the suite above.
 */
describe("Automatic commas: known defects @group3", () => {
    // Issue #1811. A blank string between two replacements belongs to the
    // list, and both pathways take it off in front of a comma. Whitespace
    // inside a child component's own text is another matter: `text` reads that
    // component's text and can trim it, while the renderers only hand React the
    // child and never see, let alone reach into, what it draws. Closing this
    // means either giving up the trim on the `text` side, which reads worse, or
    // telling the child renderer it leads a comma.
    it.fails("trims an item's trailing space in both pathways", async () => {
        await checkParagraphs({
            trailing: {
                body: `<group asList><text>a </text><text>b</text></group>`,
                expected: "a, b",
            },
        });
    });
});
