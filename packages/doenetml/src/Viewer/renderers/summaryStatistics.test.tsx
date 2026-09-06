import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

/**
 * The renderer reads its state variables through `useDoenetRenderer`, which
 * reaches into the viewer's redux store. Only `SVs` and `id` matter to the
 * markup, so the hook is replaced by one that hands back what a test asks for.
 */
const currentSVs: { value: Record<string, any> } = { value: {} };

vi.mock("../useDoenetRenderer", () => ({
    default: () => ({
        id: "table-under-test",
        SVs: currentSVs.value,
        actions: {},
        callAction: () => {},
    }),
}));

import SummaryStatistics from "./summaryStatistics";

/**
 * The markup the renderer emits for one set of statistics.
 *
 * The claims this file checks are claims about that markup — the rule under
 * the headings and the color it carries, the cell padding, the caption being
 * the table's `<caption>`, the `scope` on each heading, and the columns being
 * the keys of `summaryStatistics` in the order the component supplies them.
 * Each was previously stated in prose with nothing checking it.
 */
function render(SVs: Record<string, any>) {
    currentSVs.value = { hidden: false, ...SVs };
    return renderToStaticMarkup(<SummaryStatistics {...({} as any)} />);
}

describe("the summaryStatistics table", () => {
    it("draws one column per statistic, in the order it is given them", () => {
        const html = render({
            summaryStatistics: { mean: "5", median: "4", count: 4 },
        });

        expect(
            [...html.matchAll(/<th[^>]*>([^<]*)<\/th>/g)].map((m) => m[1]),
        ).eqls(["mean", "median", "count"]);
        expect(
            [...html.matchAll(/<td[^>]*>([^<]*)<\/td>/g)].map((m) => m[1]),
        ).eqls(["5", "4", "4"]);
    });

    it("leaves the cell of a statistic with no value empty", () => {
        // Every statistic but `count` is `null` when nothing usable was given,
        // and the table shows a blank cell rather than the word "null".
        const html = render({
            summaryStatistics: { mean: null, count: 0 },
        });

        expect(
            [...html.matchAll(/<td[^>]*>([^<]*)<\/td>/g)].map((m) => m[1]),
        ).eqls(["", "0"]);
    });

    it("rules the headings off from the values in the theme's text color", () => {
        // `border-color` is not inherited, so a color on the `<table>` would
        // never reach these cells: the rule carries its own color, and the
        // headings are where it is declared.
        const html = render({ summaryStatistics: { mean: "5", count: 1 } });

        const headings = [...html.matchAll(/<th[^>]*style="([^"]*)"/g)].map(
            (m) => m[1],
        );
        expect(headings.length).eq(2);
        for (const style of headings) {
            expect(style).contain("border-bottom-style:solid");
            expect(style).contain("border-bottom-color:var(--canvasText)");
        }
        // The rule is the only line the table draws: nothing else declares a
        // border, so there are no stray edges for it to be mistaken for.
        for (const style of [...html.matchAll(/<td[^>]*style="([^"]*)"/g)].map(
            (m) => m[1],
        )) {
            expect(style).not.contain("border");
        }
        expect(html.match(/<table[^>]*style="([^"]*)"/)?.[1]).not.contain(
            "border-color",
        );
    });

    it("spaces its cells the way a tabular spaces its own", () => {
        // `<cell>` gives a `<tabular>`'s cells `3px 10px`; a statistics table
        // sits among those in a document and is spaced like them.
        const html = render({ summaryStatistics: { mean: "5", count: 1 } });

        const cells = [...html.matchAll(/<t[hd][^>]*style="([^"]*)"/g)].map(
            (m) => m[1],
        );
        expect(cells.length).eq(4);
        for (const style of cells) {
            expect(style).contain("padding:3px 10px");
        }
    });

    it("names the table with a caption rather than a paragraph above it", () => {
        // The `<caption>` is the table's accessible name. A `<p>` before the
        // table would look the same and name nothing.
        const html = render({ summaryStatistics: { mean: "5" } });

        expect(html).contain("<caption");
        expect(html).not.contain("<p");
        expect(html).contain("Summary statistics");
        // Centered is the default for a caption, which would leave it hanging
        // over columns it does not belong to.
        expect(html.match(/<caption style="([^"]*)"/)?.[1]).contain(
            "text-align:start",
        );
    });

    it("labels each heading as the heading of its column", () => {
        const html = render({ summaryStatistics: { mean: "5", count: 1 } });

        expect([...html.matchAll(/<th[^>]*scope="col"/g)].length).eq(2);
    });

    it("collapses the table's borders so the rule runs unbroken", () => {
        const html = render({ summaryStatistics: { mean: "5", count: 1 } });

        expect(html.match(/<table[^>]*style="([^"]*)"/)?.[1]).contain(
            "border-collapse:collapse",
        );
        // No width or height: the table is sized by its contents, and the
        // component declares neither for an author to set.
        expect(html.match(/<table[^>]*style="([^"]*)"/)?.[1]).not.contain(
            "width",
        );
        expect(html.match(/<table[^>]*style="([^"]*)"/)?.[1]).not.contain(
            "height",
        );
    });

    it("renders nothing when hidden", () => {
        expect(render({ hidden: true, summaryStatistics: { mean: "5" } })).eq(
            "",
        );
    });
});
