import { describe, expect, it } from "vitest";
import { compilePrefigure, initPrefigure, version } from "../src/index";

// Small representative samples, extracted from upstream's own test corpus
// (`upstream/packages/tests/examples/extracted_from_docs/`), covering a
// couple of the PreFigure XML element categories DoenetML actually emits
// (see packages/doenetml-worker-javascript/src/utils/prefigure/components/*).

const POINTS_XML = `
<diagram dimensions="(300, 300)" margins="5">
  <coordinates bbox="(0, 0,5, 5)">
    <point p="(1,4)" size="20" style="box"
           fill="green" stroke="black" thickness="4"/>
    <point p="(2.5, 2.5)" size="15" style="diamond"
           fill="blue" stroke="none"/>
    <point p="(1,1)" style="cross" thickness="3"/>
    <point p="(4,4)" style="plus" thickness="3"/>
  </coordinates>
</diagram>
`;

const CIRCLE_XML = `
<diagram dimensions="(300,180)" margins="5">
  <coordinates bbox="(-5,0,5,6)">
    <grid/>
    <circle center="(-2,3)" radius="2" fill="blue" thickness="5"/>
    <ellipse center="(2,3)" axes="(1,2)" stroke="red"
             rotate="pi/6" degrees="no"/>
  </coordinates>
</diagram>
`;

const LINES_XML = `
<diagram dimensions="(300,300)" margins="5">
  <coordinates bbox="(0,0,5,5)">
    <line p1="(1,1)" p2="(4,4)" stroke="blue" thickness="2"/>
    <line slope="1" through="(2,1)" stroke="red" dash="4,2"/>
  </coordinates>
</diagram>
`;

const LABELED_POINT_XML = `
<diagram dimensions="(300,300)" margins="5">
  <coordinates bbox="(0,0,10,10)">
    <point p="(9,1)" alignment="ne">P</point>
  </coordinates>
</diagram>
`;

function expectWellFormedSvg(svg: string) {
    expect(svg).toBeTypeOf("string");
    expect(svg.length).toBeGreaterThan(0);
    expect(svg.trim().startsWith("<svg")).toBe(true);
    expect(svg.trim().endsWith("</svg>")).toBe(true);
}

describe("prefigure-rust compilePrefigure", () => {
    it("initializes the wasm module and reports a version", async () => {
        await initPrefigure();
        expect(version()).toBeTypeOf("string");
        expect(version().length).toBeGreaterThan(0);
    });

    it("compiles a simple points diagram to well-formed SVG", async () => {
        const result = await compilePrefigure(POINTS_XML);
        expectWellFormedSvg(result.svg);
        expect(result.annotationsXml).toBeTypeOf("string");
    });

    it("compiles a circle/ellipse diagram to well-formed SVG", async () => {
        const result = await compilePrefigure(CIRCLE_XML, { mode: "svg" });
        expectWellFormedSvg(result.svg);
    });

    it("compiles a lines diagram to well-formed SVG", async () => {
        const result = await compilePrefigure(LINES_XML);
        expectWellFormedSvg(result.svg);
    });

    // Without an explicit `color` attribute in the source XML, prefig-wasm's
    // <text> labels carry no `fill` — matching the Python `prefig` compiler's
    // behavior (both only set `fill` when a `color` attribute is given; see
    // upstream/packages/prefig/core/label.py and prefig-rust/.../label.rs).
    // SVG's actual default for unset `fill` is opaque black, not "inherit
    // the page's CSS color", so plain-text labels can be invisible on a dark
    // canvas — a pre-existing gap in DoenetML's own PreFigure XML generation
    // (see packages/doenetml-worker-javascript/.../prefigure/label.ts),
    // which never emits a `color` attribute for label text. Fix belongs
    // there, not here — this package should not diverge from upstream's
    // actual output. This test documents the passthrough behavior the fix
    // depends on: an explicit `color` is honored verbatim as `fill`.
    it("passes an explicit label `color` attribute through to the rendered <text> fill", async () => {
        const result = await compilePrefigure(LABELED_POINT_XML);
        expectWellFormedSvg(result.svg);
        const textTags = result.svg.match(/<text[^>]*>/g) ?? [];
        expect(textTags.length).toBeGreaterThan(0);
        for (const tag of textTags) {
            expect(tag).not.toMatch(/\bfill=/);
        }

        const coloredResult = await compilePrefigure(
            LABELED_POINT_XML.replace(
                '<point p="(9,1)" alignment="ne">',
                '<point p="(9,1)" alignment="ne" color="currentColor">',
            ),
        );
        expectWellFormedSvg(coloredResult.svg);
        const coloredTextTags = coloredResult.svg.match(/<text[^>]*>/g) ?? [];
        expect(coloredTextTags.length).toBeGreaterThan(0);
        for (const tag of coloredTextTags) {
            expect(tag).toMatch(/\bfill="currentColor"/);
        }
    });
});
