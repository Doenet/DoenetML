import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

/**
 * The open/close control of a collapsible section, an aside, a hint and a
 * solution is a native button carrying its state in `aria-expanded`. As in
 * `tabular.test.tsx`, only `SVs` matter to the markup, so the renderer's hook
 * is replaced by one that hands them over.
 */
const current: { id: string; SVs: Record<string, any> } = { id: "", SVs: {} };

vi.mock("../../useDoenetRenderer", () => ({
    default: () => ({
        id: current.id,
        SVs: current.SVs,
        actions: {},
        callAction: () => {},
        children: [],
    }),
}));

import Section from "../section";
import Hint from "../hint";
import Solution from "../solution";

function render(
    Component: React.ComponentType<any>,
    id: string,
    SVs: Record<string, any>,
) {
    current.id = id;
    current.SVs = SVs;
    return renderToStaticMarkup(<Component {...({} as any)} />);
}

/** The opening tag of the first `<button>` in `html`. */
function buttonTag(html: string) {
    const m = html.match(/<button[^>]*>/);
    expect(m, "a <button> is rendered").not.toBeNull();
    return m![0];
}

function sectionSVs(open: boolean, extra: Record<string, any> = {}) {
    return {
        hidden: false,
        rendered: true,
        isListItem: false,
        boxed: true,
        collapsible: true,
        open,
        title: "Later part",
        level: 1,
        containerTag: "section",
        justSubmitted: false,
        ...extra,
    };
}

describe("collapsible section toggle", () => {
    it("is a button inside the heading, collapsed, with no aria-controls", () => {
        const html = render(Section, "s", sectionSVs(false));
        const tag = buttonTag(html);
        expect(tag).toContain('type="button"');
        expect(tag).toContain('aria-expanded="false"');
        expect(tag).not.toContain("aria-controls");
        // The heading keeps its level and holds the button.
        expect(html).toMatch(/<h2 id="s_title"[^>]*><button/);
        // The heading box is no tab stop of its own.
        expect(html).not.toContain("tabindex");
        // The closed content is not rendered.
        expect(html).not.toContain('id="s_content"');
        // The words stay visible but out of the accessible name.
        expect(html).toMatch(/<span aria-hidden="true">\(click to open\)/);
    });

    it("when open, is expanded and controls the rendered content", () => {
        const html = render(Section, "s", sectionSVs(true));
        const tag = buttonTag(html);
        expect(tag).toContain('aria-expanded="true"');
        expect(tag).toContain('aria-controls="s_content"');
        expect(html).toContain('<div id="s_content"');
        expect(html).toMatch(/<span aria-hidden="true">\(click to close\)/);
    });

    it("an aside keeps its <aside> container", () => {
        const html = render(
            Section,
            "a",
            sectionSVs(false, { containerTag: "aside" }),
        );
        expect(html).toMatch(/^<aside id="a"/);
        expect(buttonTag(html)).toContain('aria-expanded="false"');
    });

    it("an untitled list item keeps the words in the button's name", () => {
        const html = render(
            Section,
            "li",
            sectionSVs(false, {
                isListItem: true,
                title: "",
                sectionNumber: "1",
            }),
        );
        expect(buttonTag(html)).toContain('aria-expanded="false"');
        expect(html).not.toContain('aria-hidden="true">(click to open)');
        expect(html).toContain("(click to open)");
    });

    it("a section that is not collapsible has no button", () => {
        expect(
            render(Section, "b", sectionSVs(true, { collapsible: false })),
        ).not.toContain("<button");
        expect(
            render(
                Section,
                "p",
                sectionSVs(true, { collapsible: false, boxed: false }),
            ),
        ).not.toContain("<button");
    });
});

describe("hint toggle", () => {
    const SVs = (open: boolean) => ({
        showHints: true,
        open,
        title: "Try a smaller case",
    });

    it("is a collapsed button keeping its class and data-test", () => {
        const html = render(Hint, "h", SVs(false));
        const tag = buttonTag(html);
        expect(tag).toContain('type="button"');
        expect(tag).toContain('class="hint-title"');
        expect(tag).toContain('data-test="hint-heading"');
        expect(tag).toContain('aria-expanded="false"');
        expect(tag).not.toContain("aria-controls");
        expect(html).not.toContain("tabindex");
        expect(html).toMatch(/<span aria-hidden="true">\(click to open\)/);
    });

    it("when open, controls its content", () => {
        const html = render(Hint, "h", SVs(true));
        const tag = buttonTag(html);
        expect(tag).toContain('aria-expanded="true"');
        expect(tag).toContain('aria-controls="h_content"');
        expect(html).toContain('<span id="h_content"');
    });
});

describe("solution toggle", () => {
    const SVs = (open: boolean, canBeClosed = true) => ({
        hidden: false,
        open,
        canBeClosed,
        rendered: true,
        sectionName: "Solution",
        message: "",
    });

    it("is a collapsed button keeping its id", () => {
        const html = render(Solution, "sol", SVs(false));
        const tag = buttonTag(html);
        expect(tag).toContain('type="button"');
        expect(tag).toContain('id="sol_button"');
        expect(tag).toContain('aria-expanded="false"');
        expect(tag).not.toContain("aria-controls");
        expect(tag).not.toContain("aria-disabled");
        expect(html).not.toContain("tabindex");
    });

    it("when open, controls its content", () => {
        const tag = buttonTag(render(Solution, "sol", SVs(true)));
        expect(tag).toContain('aria-expanded="true"');
        expect(tag).toContain('aria-controls="sol_content"');
        expect(tag).not.toContain("aria-disabled");
    });

    it("when open and it cannot be closed, is marked disabled", () => {
        const tag = buttonTag(render(Solution, "sol", SVs(true, false)));
        expect(tag).toContain('aria-expanded="true"');
        expect(tag).toContain('aria-disabled="true"');
    });
});
