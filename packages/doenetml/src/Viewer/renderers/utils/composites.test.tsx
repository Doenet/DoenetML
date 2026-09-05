import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { addCommasForCompositeRanges } from "./composites";

/**
 * `addCommasForCompositeRanges` is the renderer half of automatic list commas:
 * every container renderer (`p`, `section`, `cell`, `hint`, `alert`, `list`,
 * `pre`, `solution`, `feedback`, `containerInline`, `markupRenderer`) hands it
 * the children it is about to render together with the core's
 * `_compositeReplacementActiveRange`, and it inserts `", "` between the
 * replacements of a composite that asked to be shown as a list.
 *
 * The core builds that range array in `CompositeExpander.replaceCompositeChildren`;
 * `textFromChildren` (`doenetml-worker-javascript/src/utils/text.ts`) and
 * `applyCompositeListWrapping` (`doenetml-worker/src/compositeListWrapping.ts`)
 * consume the same array and must agree with what is checked here.
 *
 * Ranges are half-nested rather than a tree: a composite whose replacements are
 * themselves composites comes *first* in the array, and the ranges that follow
 * it, with indices inside its own, are its replacements' ranges.
 */

type Range = Parameters<
    typeof addCommasForCompositeRanges
>[0]["compositeReplacementActiveRange"][number];

/**
 * A stand-in for a rendered component child. What matters to the code under
 * test is that it is an element whose `props.children` is not an array — the
 * one shape `removeEndingBlankString` declines to look inside — which is what a
 * real `<DoenetRenderer>` child (its props carry `componentInstructions`, never
 * `children`) also is.
 */
function child(text: string, key: number) {
    return <span key={key}>{text}</span>;
}

/** What the browser would show for the children the function hands back. */
function shown(children: React.ReactNode[]) {
    return renderToStaticMarkup(<>{children}</>).replace(/<[^>]*>/g, "");
}

function addCommas(
    children: React.ReactNode[],
    compositeReplacementActiveRange: Range[],
    removedInd: number | null = null,
) {
    return addCommasForCompositeRanges({
        children,
        compositeReplacementActiveRange,
        startInd: 0,
        endInd: children.length - 1,
        removedInd,
    });
}

function range(over: Partial<Range> & Pick<Range, "firstInd" | "lastInd">) {
    return {
        compositeName: "c",
        asList: true,
        ...over,
    } as Range;
}

describe("addCommasForCompositeRanges", () => {
    it("separates the replacements of an asList composite", () => {
        const children = ["one ", child("2", 1), child("3", 2), child("4", 3)];
        const result = addCommas(children, [
            range({
                firstInd: 1,
                lastInd: 3,
                potentialListComponents: [true, true, true],
            }),
        ]);
        expect(shown(result)).eq("one 2, 3, 4");
    });

    it("leaves the replacements alone when asList is false", () => {
        const children = [child("2", 0), child("3", 1)];
        const result = addCommas(children, [
            range({
                firstInd: 0,
                lastInd: 1,
                asList: false,
                potentialListComponents: [true, true],
            }),
        ]);
        expect(shown(result)).eq("23");
    });

    it("adds no comma to a composite with a single replacement", () => {
        const children = [child("2", 0)];
        const result = addCommas(children, [
            range({ firstInd: 0, lastInd: 0, potentialListComponents: [true] }),
        ]);
        expect(shown(result)).eq("2");
    });

    it("gives every composite an anchor span carrying its name", () => {
        // Links to a composite's name scroll to this span, so it is added
        // whether or not the composite became a list.
        const children = [child("2", 0), child("3", 1)];
        const result = addCommas(children, [
            range({
                compositeName: "myList",
                firstInd: 0,
                lastInd: 1,
                asList: false,
                potentialListComponents: [true, true],
            }),
        ]);
        expect(renderToStaticMarkup(<>{result}</>)).eq(
            '<span id="myList"><span>2</span><span>3</span></span>',
        );
    });

    it("holds back the commas when a replacement cannot be a list item", () => {
        // `potentialListComponents` comes from the core: an inline component,
        // or one whose class sets `canBeInList`, may be an item; a `<me>` or a
        // block component may not, and one such replacement settles it for the
        // whole composite.
        const children = [child("2", 0), child("3", 1), child("x", 2)];
        const result = addCommas(children, [
            range({
                firstInd: 0,
                lastInd: 2,
                potentialListComponents: [true, true, false],
            }),
        ]);
        expect(shown(result)).eq("23x");
    });

    it("lets an inner composite make a list inside a non-list outer one", () => {
        // <group><numberList>1 2</numberList></group>: the group is not a list
        // but the numberList inside it still is.
        const children = [child("1", 0), child("2", 1)];
        const result = addCommas(children, [
            range({
                compositeName: "g",
                firstInd: 0,
                lastInd: 1,
                asList: false,
                potentialListComponents: [true, true],
            }),
            range({
                compositeName: "nl",
                firstInd: 0,
                lastInd: 1,
                potentialListComponents: [true, true],
            }),
        ]);
        expect(shown(result)).eq("1, 2");
    });

    it("lets an inner composite refuse to be a list inside a list outer one", () => {
        const children = [child("1", 0), child("2", 1)];
        const result = addCommas(children, [
            range({
                compositeName: "g",
                firstInd: 0,
                lastInd: 1,
                potentialListComponents: [true, true],
            }),
            range({
                compositeName: "nl",
                firstInd: 0,
                lastInd: 1,
                asList: false,
                potentialListComponents: [true, true],
            }),
        ]);
        expect(shown(result)).eq("12");
    });

    it("counts each inner composite as one item of the outer list", () => {
        // <group asList><group>1 2</group><number>3</number></group>:
        // the inner group is a single item, so there are two items, not three.
        const children = [child("1", 0), child("2", 1), child("3", 2)];
        const result = addCommas(children, [
            range({
                compositeName: "outer",
                firstInd: 0,
                lastInd: 2,
                potentialListComponents: [true, true, true],
            }),
            range({
                compositeName: "inner",
                firstInd: 0,
                lastInd: 1,
                asList: false,
                potentialListComponents: [true, true],
            }),
        ]);
        expect(shown(result)).eq("12, 3");
    });

    it("keeps the blank strings around replacements out of the list", () => {
        // Authored whitespace surrounding a composite's replacements is a
        // separator, not an item: no comma is placed next to one, and the comma
        // goes in front of the whitespace rather than after it, so nothing puts
        // a space before a comma. The doubled space that leaves between items
        // collapses to one in the browser.
        const children = ["\n  ", child("1", 1), " ", child("2", 3), "\n  "];
        const result = addCommas(children, [
            range({
                firstInd: 0,
                lastInd: 4,
                potentialListComponents: [true, true, true, true, true],
            }),
        ]);
        expect(shown(result)).eq("\n  1,  2\n  ");
    });

    it("skips a composite that produced no replacements", () => {
        // An empty composite is recorded as `lastInd === firstInd - 1`; the
        // items around it still form one list.
        const children = [child("1", 0), child("2", 1)];
        const result = addCommas(children, [
            range({
                compositeName: "outer",
                firstInd: 0,
                lastInd: 1,
                potentialListComponents: [true, true],
            }),
            range({
                compositeName: "empty",
                firstInd: 1,
                lastInd: 0,
                potentialListComponents: [],
            }),
        ]);
        expect(shown(result)).eq("1, 2");
    });

    it("drops absent children before deciding how many items there are", () => {
        // A child instruction is `null` when the child is not rendered; two
        // replacements one of which is absent are not a two-item list.
        const children = [child("1", 0), null];
        const result = addCommas(children, [
            range({
                firstInd: 0,
                lastInd: 1,
                potentialListComponents: [true, true],
            }),
        ]);
        expect(shown(result)).eq("1");
    });

    it("shifts the ranges past a child the renderer removed", () => {
        // `section.tsx` splices the `<title>` child out of `children` before
        // asking for commas, and tells this function which index it took.
        const children = [child("1", 1), child("2", 2), child("3", 3)];
        const result = addCommas(
            children,
            [
                range({
                    firstInd: 1,
                    lastInd: 3,
                    potentialListComponents: [true, true, true],
                }),
            ],
            0,
        );
        expect(shown(result)).eq("1, 2, 3");
    });

    it("drops a range whose end coincides with the removed child", () => {
        const children = [child("1", 0), child("3", 2)];
        const result = addCommas(
            children,
            [
                range({
                    firstInd: 0,
                    lastInd: 1,
                    potentialListComponents: [true, true],
                }),
            ],
            1,
        );
        expect(shown(result)).eq("13");
    });

    it("leaves children outside every range untouched", () => {
        const children = ["before ", child("1", 1), child("2", 2), " after"];
        const result = addCommas(children, [
            range({
                firstInd: 1,
                lastInd: 2,
                potentialListComponents: [true, true],
            }),
        ]);
        expect(shown(result)).eq("before 1, 2 after");
    });

    it("separates two composites of its own, each on its own", () => {
        const children = [
            child("1", 0),
            child("2", 1),
            " and ",
            child("3", 3),
            child("4", 4),
        ];
        const result = addCommas(children, [
            range({
                compositeName: "first",
                firstInd: 0,
                lastInd: 1,
                potentialListComponents: [true, true],
            }),
            range({
                compositeName: "second",
                firstInd: 3,
                lastInd: 4,
                potentialListComponents: [true, true],
            }),
        ]);
        expect(shown(result)).eq("1, 2 and 3, 4");
    });
});
