import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { fillSlots, slot } from "./slots";

/**
 * The four properties the marker shape exists for — a fragment can repeat, a
 * translation can reorder the fragments or drop one, and a marker cannot be
 * found by accident inside the surrounding prose. Each is a claim `slots.tsx`
 * makes in prose and nothing else checks: the Cypress specs that use it assert
 * on what the `en` and `es` catalogs happen to say today, which is one
 * well-behaved translation of each message (#1580).
 */
describe("fillSlots", () => {
    /** What a caller would render, as HTML, so the markup is visible. */
    function render(text: string, nodes: readonly React.ReactNode[]) {
        return renderToStaticMarkup(<>{fillSlots(text, nodes)}</>);
    }

    it("puts each node where its marker sits", () => {
        expect(
            render(`Inside ${slot(0)} — try ${slot(1)}.`, [
                <code>{"<p>"}</code>,
                <em>these</em>,
            ]),
        ).eq("Inside <code>&lt;p&gt;</code> — try <em>these</em>.");
    });

    it("follows a translation that reorders the fragments", () => {
        expect(render(`${slot(1)} before ${slot(0)}`, ["A", "B"])).eq(
            "B before A",
        );
    });

    it("repeats a fragment a translation names twice", () => {
        expect(render(`${slot(0)} and ${slot(0)}`, [<code>x</code>])).eq(
            "<code>x</code> and <code>x</code>",
        );
    });

    it("renders without a fragment a translation dropped", () => {
        // The sentence survives; only the fragment is missing. This is the
        // failure mode the marker shape is chosen to make survivable.
        expect(render("Nothing goes here.", [<code>x</code>])).eq(
            "Nothing goes here.",
        );
    });

    it("renders nothing in place of a marker with no node behind it", () => {
        expect(render(`before ${slot(3)} after`, [<code>x</code>])).eq(
            "before  after",
        );
    });

    it("leaves prose that looks like a fragment alone", () => {
        // A bare `$m` in the surrounding words is not a marker, which is the
        // reason the marker is a delimited index rather than the fragment's
        // own text.
        expect(render(`$m is $m: ${slot(0)}`, [<code>$m</code>])).eq(
            "$m is $m: <code>$m</code>",
        );
    });
});
