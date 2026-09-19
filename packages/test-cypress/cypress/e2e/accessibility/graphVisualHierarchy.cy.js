/**
 * Regression coverage for graph visual hierarchy styling.
 *
 * Grid lines must remain distinguishable from the canvas without competing
 * with axes and labels. Read rendered colors rather than JSXGraph's `var(...)`
 * SVG attributes so this covers CSS variable resolution in both themes.
 */

function parseRgb(color) {
    if (Array.isArray(color)) {
        return color;
    }

    const hex = color.match(/^#([\da-f]{3}|[\da-f]{6})$/i)?.[1];
    if (hex) {
        const expanded =
            hex.length === 3
                ? [...hex].map((component) => component.repeat(2)).join("")
                : hex;
        return [0, 2, 4].map((index) =>
            Number.parseInt(expanded.slice(index, index + 2), 16),
        );
    }

    const components = color.match(/[\d.]+/g)?.map(Number);
    expect(components, `CSS color ${color}`).to.have.length.at.least(3);
    return components.slice(0, 3);
}

function tryParseRgb(color) {
    return /^(#|rgb)/i.test(color) ? parseRgb(color) : null;
}

function relativeLuminance(color) {
    return parseRgb(color)
        .map((component) => component / 255)
        .map((component) =>
            component <= 0.04045
                ? component / 12.92
                : ((component + 0.055) / 1.055) ** 2.4,
        )
        .reduce(
            (luminance, component, index) =>
                luminance + component * [0.2126, 0.7152, 0.0722][index],
            0,
        );
}

function contrastRatio(foreground, background) {
    const [lighter, darker] = [
        relativeLuminance(foreground),
        relativeLuminance(background),
    ].sort((a, b) => b - a);
    return (lighter + 0.05) / (darker + 0.05);
}

function colorsMatch(first, second) {
    const firstRgb = tryParseRgb(first);
    const secondRgb = tryParseRgb(second);
    return Boolean(
        firstRgb &&
        secondRgb &&
        firstRgb.every((component, index) => component === secondRgb[index]),
    );
}

function composite(foreground, background, opacity) {
    return parseRgb(foreground).map(
        (component, index) =>
            component * opacity + parseRgb(background)[index] * (1 - opacity),
    );
}

describe("Graph visual hierarchy", { tags: ["@group5"] }, () => {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    function postGraphs(darkMode) {
        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: `
<graph name="medium" grid="medium">
    <xLabel>x</xLabel>
    <yLabel>y</yLabel>
    <point>(1,2)</point>
</graph>
<graph name="dense" grid="dense">
    <xLabel>x</xLabel>
    <yLabel>y</yLabel>
    <point>(1,2)</point>
</graph>
<graph name="defined" grid="1 1">
    <xLabel>x</xLabel>
    <yLabel>y</yLabel>
    <point>(1,2)</point>
</graph>
`,
                    darkMode,
                },
                "*",
            );
        });
    }

    function expectRenderedHierarchy(graphName) {
        cy.get(`#${graphName}`).should(($graph) => {
            const board = $graph[0];
            const style = getComputedStyle(board);
            const canvasColor = style.backgroundColor;
            const gridColor = style.getPropertyValue("--graphGrid").trim();
            const axesColor = style.getPropertyValue("--graphAxes").trim();

            expect(gridColor, "graph grid color").to.not.be.empty;
            expect(axesColor, "graph axes color").to.not.be.empty;

            // JSXGraph may serialize CSS variables in SVG attributes as a
            // literal `var(...)` or a resolved color, so select by the color
            // the browser actually renders.
            const grid = [...board.querySelectorAll("path")].find((element) =>
                colorsMatch(getComputedStyle(element).stroke, gridColor),
            );
            const axis = [...board.querySelectorAll("line")].find((element) =>
                colorsMatch(getComputedStyle(element).stroke, axesColor),
            );
            const label = [...board.querySelectorAll(".JXGtext")].find(
                (element) =>
                    element.textContent === "x" || element.textContent === "y",
            );

            expect(grid, "grid element").to.exist;
            expect(axis, "axis element").to.exist;
            expect(label, "axis label").to.exist;

            expect(colorsMatch(getComputedStyle(grid).stroke, gridColor)).to.be
                .true;
            expect(colorsMatch(getComputedStyle(axis).stroke, axesColor)).to.be
                .true;
            expect(colorsMatch(getComputedStyle(label).color, axesColor)).to.be
                .true;

            // Grid contrast targets WCAG's 3:1 non-text threshold. Axes and
            // their labels target 4.5:1, with a little tolerance for color
            // rounding in browsers' computed RGB values.
            expect(
                contrastRatio(
                    composite(
                        getComputedStyle(grid).stroke,
                        canvasColor,
                        Number(grid.getAttribute("stroke-opacity") ?? 1),
                    ),
                    canvasColor,
                ),
            ).to.be.closeTo(3.1, 0.1);
            expect(contrastRatio(axesColor, canvasColor)).to.be.greaterThan(
                4.5,
            );
        });
    }

    for (const darkMode of ["light", "dark"]) {
        it(`uses rendered colors with the required contrast in ${darkMode} mode`, () => {
            postGraphs(darkMode);

            for (const graphName of ["medium", "dense", "defined"]) {
                expectRenderedHierarchy(graphName);
            }
        });
    }
});
