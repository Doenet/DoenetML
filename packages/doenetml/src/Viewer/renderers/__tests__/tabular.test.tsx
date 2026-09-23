import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

/**
 * As with `summaryStatistics.test.tsx`, the renderer reads its state variables
 * through `useDoenetRenderer`; only `SVs` matter to the markup.
 */
const currentSVs: { value: Record<string, any> } = { value: {} };

vi.mock("../../useDoenetRenderer", () => ({
    default: () => ({
        id: "tabular-under-test",
        SVs: currentSVs.value,
        actions: {},
        callAction: () => {},
        children: [],
    }),
}));

import Tabular from "../tabular";

function render(SVs: Record<string, any>) {
    currentSVs.value = { hidden: false, ...SVs };
    return renderToStaticMarkup(<Tabular {...({} as any)} />);
}

/** A relative `componentSize`, the shape the worker sends for `width="40%"`. */
function percent(size: number) {
    return { size, isAbsolute: false };
}

describe("the tabular <colgroup>", () => {
    it("is left out entirely when the tabular has no <col> children", () => {
        expect(render({ columnSpecs: [] })).not.toContain("<colgroup");
    });

    it("gives one <col> per column spec, with the widths it was handed", () => {
        const html = render({
            columnSpecs: [
                {
                    width: percent(25),
                    halign: null,
                    topBorder: null,
                    endBorder: null,
                },
                {
                    width: percent(15),
                    halign: null,
                    topBorder: null,
                    endBorder: null,
                },
                {
                    width: null,
                    halign: null,
                    topBorder: null,
                    endBorder: null,
                },
            ],
        });

        const cols = [...html.matchAll(/<col(?![a-z])[^>]*>/g)].map(
            (m) => m[0],
        );
        expect(cols.length).eq(3);
        expect(cols[0]).toContain("width:25%");
        expect(cols[1]).toContain("width:15%");
        // A column with no width of its own carries no width, and so divides
        // up whatever the sized columns leave.
        expect(cols[2]).not.toContain("width");
    });

    it("draws a column's topBorder but not its halign or endBorder", () => {
        // Those two reach the cells through the worker instead: neither
        // `text-align` nor a trailing rule on a cell's content is something a
        // `<colgroup>` can deliver.
        const html = render({
            columnSpecs: [
                {
                    width: null,
                    halign: "end",
                    topBorder: "major",
                    endBorder: "minor",
                },
            ],
        });

        const col = html.match(/<col(?![a-z])[^>]*>/)![0];
        expect(col).toContain("border-top-style:solid");
        expect(col).toContain("border-top-width:thick");
        expect(col).not.toContain("text-align");
        expect(col).not.toContain("border-right");
        expect(col).not.toContain("border-inline-end");
    });

    it("puts the colgroup before the tbody, as HTML requires", () => {
        const html = render({
            columnSpecs: [
                {
                    width: percent(50),
                    halign: null,
                    topBorder: null,
                    endBorder: null,
                },
            ],
        });

        expect(html.indexOf("<colgroup")).toBeLessThan(html.indexOf("<tbody"));
    });
});
