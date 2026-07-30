import { describe, expect, it } from "vitest";
import { getPrefigureXML, getWarnings } from "./graph-prefigure.helpers";
import { prefigureGraph } from "./graph-prefigure.fixtures";

/**
 * Extracts the `<grid ... />` element from a generated diagram, or null when
 * the diagram has none.
 */
function gridElement(prefigureXML: string | null): string | null {
    return prefigureXML?.match(/<grid\b[^>]*\/>/)?.[0] ?? null;
}

describe("PreFigure grid @group4", () => {
    it("no grid attribute emits no grid element", async () => {
        const prefigureXML = await getPrefigureXML(prefigureGraph(""));

        expect(gridElement(prefigureXML)).eq(null);
    });

    it('grid="none" emits no grid element', async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph("", { attrs: 'grid="none"' }),
        );

        expect(gridElement(prefigureXML)).eq(null);
    });

    it("bare grid attribute uses PreFigure's own bbox-derived spacing", async () => {
        // `grid` with no value resolves to "medium", which becomes a bare
        // <grid />: with no spacings attribute PreFigure derives the spacing
        // from the bounding box, so the grid follows the axis limits.
        const prefigureXML = await getPrefigureXML(
            prefigureGraph("", { attrs: "grid" }),
        );

        expect(gridElement(prefigureXML)).eq("<grid />");
    });

    it('grid="medium" matches the bare grid attribute', async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph("", { attrs: 'grid="medium"' }),
        );

        expect(gridElement(prefigureXML)).eq("<grid />");
    });

    it("the grid is drawn behind the axes and the graph contents", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph('<point name="P">(1,2)</point>', {
                attrs: "grid",
            }),
        );

        expect(prefigureXML).eq(
            `<diagram dimensions="(425,425)"><coordinates bbox="(-10,-10,10,10)"><grid /><axes axes="all" /><point at="point_0" p="(1,2)" style="circle" size="5" fill="#1f5dff" stroke="#1f5dff" fill-opacity="0.7" stroke-opacity="0.7" thickness="4" /></coordinates><annotations></annotations></diagram>`,
        );
    });

    it('grid="dense" subdivides the spacing PreFigure would pick on its own', async () => {
        // PreFigure's automatic spacing on (-10,10) is 2.5; "dense" adds
        // JSXGraph's minor-tick lines, one every fifth of that.
        const prefigureXML = await getPrefigureXML(
            prefigureGraph("", { attrs: 'grid="dense"' }),
        );

        expect(gridElement(prefigureXML)).eq(
            `<grid spacings="((-10,0.5,10),(-10,0.5,10))" />`,
        );
    });

    it('grid="dense" follows the axis limits', async () => {
        // Automatic spacing on a range of 2 is 0.25, so dense lines land every
        // 0.05; on a range of 200 it is 25, so they land every 5.
        const prefigureXML = await getPrefigureXML(
            prefigureGraph("", {
                attrs: 'grid="dense" xMin="-1" xMax="1" yMin="-100" yMax="100"',
            }),
        );

        expect(gridElement(prefigureXML)).eq(
            `<grid spacings="((-1,0.05,1),(-100,5,100))" />`,
        );
    });

    it('grid="dense" breaks a spacing tie the way PreFigure does', async () => {
        // A range of 12.5 normalizes to 1.25, and PreFigure indexes its
        // spacing table by `round(2 * 1.25)`. Python rounds that tie down to
        // 2 (spacing 1), where rounding half up would give 3 (spacing 2.5), so
        // dense lines land every 0.2 rather than every 0.5.
        const prefigureXML = await getPrefigureXML(
            prefigureGraph("", {
                attrs: 'grid="dense" xMin="0" xMax="12.5"',
            }),
        );

        expect(gridElement(prefigureXML)).eq(
            `<grid spacings="((0,0.2,12.4),(-10,0.5,10))" />`,
        );
    });

    it("an empty axis range emits no grid element", async () => {
        // PreFigure's automatic spacing never terminates on a range of zero,
        // so a degenerate graph must not get a bare <grid /> to work from.
        const prefigureXML = await getPrefigureXML(
            prefigureGraph("", { attrs: 'grid xMin="3" xMax="3"' }),
        );

        expect(gridElement(prefigureXML)).eq(null);
    });

    it("an axis range too wide to subtract emits no grid element", async () => {
        // Both limits are finite, but their difference overflows to Infinity.
        // PreFigure's automatic spacing divides the width by ten until it drops
        // to ten, which never terminates on an infinite width, so this must not
        // reach the spacing computation in either renderer.
        const prefigureXML = await getPrefigureXML(
            prefigureGraph("", {
                attrs: 'grid="dense" xMin="-1e308" xMax="1e308"',
            }),
        );

        expect(gridElement(prefigureXML)).eq(null);
    });

    it("a bare grid on an unusable axis range emits no grid element", async () => {
        // The same guard has to cover "medium": a bare <grid /> would hand the
        // range to PreFigure's own copy of that loop.
        const prefigureXML = await getPrefigureXML(
            prefigureGraph("", { attrs: 'grid xMin="-1e308" xMax="1e308"' }),
        );

        expect(gridElement(prefigureXML)).eq(null);
    });

    it("two numbers set the x and y spacing explicitly", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph("", { attrs: 'grid="2 0.5"' }),
        );

        expect(gridElement(prefigureXML)).eq(
            `<grid spacings="((-10,2,10),(-10,0.5,10))" />`,
        );
    });

    it("explicit spacings run between multiples of the spacing, not the bounds", async () => {
        // The issue's example: pi/4 by 1/2 on a box whose corners are not
        // multiples of either spacing.
        const prefigureXML = await getPrefigureXML(
            prefigureGraph("", {
                attrs: 'grid="pi/4 .5" xMin="-0.5" xMax="2" yMin="-0.5" yMax="1.5"',
            }),
        );

        expect(gridElement(prefigureXML)).eq(
            `<grid spacings="((0,0.7853981633974483,1.5707963267949),(-0.5,0.5,1.5))" />`,
        );
    });

    it("an axis with no multiple of its spacing in range contributes no lines", async () => {
        // A spacing wider than the axis range: PreFigure needs a triple for
        // both axes, so the x axis gets the single position 7 — the first
        // multiple of the spacing at or above xMin, which lands above xMax —
        // and PreFigure skips positions outside the bbox.
        const prefigureXML = await getPrefigureXML(
            prefigureGraph("", {
                attrs: 'grid="7 1" xMin="1" xMax="6" yMin="-10" yMax="10"',
            }),
        );

        expect(gridElement(prefigureXML)).eq(
            `<grid spacings="((7,7,7),(-10,1,10))" />`,
        );
    });

    it("dark mode dims the grid stroke", async () => {
        const prefigureXML = await getPrefigureXML(
            prefigureGraph("", { attrs: 'grid="1 1"' }),
            "g",
            { theme: "dark" },
        );

        expect(gridElement(prefigureXML)).eq(
            `<grid spacings="((-10,1,10),(-10,1,10))" stroke="#666666" />`,
        );
    });

    it("a spacing whose grid positions overflow emits no grid element", async () => {
        // Rounding xMin up to the next multiple of a spacing this large
        // overflows to Infinity. PreFigure reads `spacings` as a Python
        // expression, where `Infinity` is not a literal, so the grid has to be
        // dropped rather than written out.
        const prefigureXML = await getPrefigureXML(
            prefigureGraph("", {
                attrs: 'grid="10^308 1" xMin="1.7e308" xMax="1.75e308"',
            }),
        );

        expect(gridElement(prefigureXML)).eq(null);
    });

    it("a spacing too fine for the axis limits drops the grid with a warning", async () => {
        const doenetML = prefigureGraph("", { attrs: 'grid="0.001 1"' });

        expect(gridElement(await getPrefigureXML(doenetML))).eq(null);

        const diagnosticsByType = await getWarnings(doenetML);
        expect(
            diagnosticsByType.warnings.some((warning) =>
                warning.message.includes("grid spacing is too fine"),
            ),
        ).eq(true);
    });
});
