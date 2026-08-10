import { cesc } from "@doenet/utils";

/**
 * Find the one JSXgraph curve in `graphName` that carries NaN pen-ups, i.e. the
 * single curve a `<slopeField>` or `<vectorField>` draws its whole lattice as.
 * Nothing else on a graph writes NaN into its coordinate arrays.
 */
function withFieldCurve(graphName, assertion) {
    cy.get(cesc(`#${graphName}`)).then(($graph) => {
        const graphElement = $graph[0];
        cy.window().should((win) => {
            const boardRegistry =
                win.JXG?.boards || win.JXG?.JSXGraph?.boards || {};
            const board = Object.values(boardRegistry).find(
                (b) => b?.containerObj === graphElement,
            );
            expect(board, `board for ${graphName}`).to.exist;

            const fieldCurves = Object.values(board.objects || {}).filter(
                (obj) =>
                    Array.isArray(obj?.dataX) && obj.dataX.some(Number.isNaN),
            );
            expect(fieldCurves.length, "field curves").eq(1);

            assertion(fieldCurves[0]);
        });
    });
}

/** Split NaN-separated coordinate arrays into `[[x0, y0], [x1, y1]]` segments. */
function segments(curve) {
    const found = [];
    for (let i = 0; i + 2 < curve.dataX.length; i += 3) {
        expect(Number.isNaN(curve.dataX[i + 2])).to.be.true;
        found.push([
            [curve.dataX[i], curve.dataY[i]],
            [curve.dataX[i + 1], curve.dataY[i + 1]],
        ]);
    }
    return found;
}

/**
 * The segment nearest `(x, y)`, located by `anchor`: slope marks straddle their
 * lattice point, so they are found by midpoint, while a vector field's arrow
 * starts at its lattice point and is found by its tail.
 */
function segmentNear(segs, x, y, anchor = "midpoint") {
    let best = null;
    let bestDist = Infinity;
    for (const seg of segs) {
        const [cx, cy] =
            anchor === "tail"
                ? seg[0]
                : [(seg[0][0] + seg[1][0]) / 2, (seg[0][1] + seg[1][1]) / 2];
        const dist = Math.hypot(cx - x, cy - y);
        if (dist < bestDist) {
            bestDist = dist;
            best = seg;
        }
    }
    expect(bestDist, `distance to nearest mark at (${x}, ${y})`).lessThan(0.1);
    return best;
}

describe("SlopeField and VectorField Tag Tests", { tags: ["@group2"] }, () => {
    beforeEach(() => {
        cy.clearIndexedDB();
        cy.visit("/");
    });

    it("slope field draws its whole lattice as one curve, at the authored slopes", () => {
        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph name="g" xmin="-3" xmax="3" ymin="-3" ymax="3">
        <slopeField>y - x</slopeField>
    </graph>
    `,
                },
                "*",
            );
        });

        withFieldCurve("g", (curve) => {
            expect(curve.dataX.length % 3, "three entries per mark").eq(0);
            const segs = segments(curve);
            expect(segs.length, "number of marks").greaterThan(20);

            // y' = y - x is 0 along y = x, so that mark must be horizontal.
            const flat = segmentNear(segs, 1, 1);
            expect(flat[1][1] - flat[0][1]).closeTo(0, 1e-9);
            expect(flat[1][0] - flat[0][0]).greaterThan(0);

            // At (0, 2) the slope is 2. The mark is sized in pixels but its
            // direction in user units is still (1, slope).
            const steep = segmentNear(segs, 0, 2);
            expect(
                (steep[1][1] - steep[0][1]) / (steep[1][0] - steep[0][0]),
            ).closeTo(2, 1e-9);
        });
    });

    it("vector field draws a shaft and two barbs per arrow", () => {
        cy.window().then((win) => {
            win.postMessage(
                {
                    doenetML: `
    <graph name="g" xmin="-3" xmax="3" ymin="-3" ymax="3">
        <vectorField normalize>(y, -x)</vectorField>
    </graph>
    `,
                },
                "*",
            );
        });

        withFieldCurve("g", (curve) => {
            expect(curve.dataX.length % 9, "shaft plus two barbs per arrow").eq(
                0,
            );
            const segs = segments(curve);
            expect(segs.length / 3, "number of arrows").greaterThan(20);

            // (y, -x) at (0, 2) is (2, 0): the shaft starts at the lattice
            // point and points along +x from there.
            const shaft = segmentNear(segs, 0, 2, "tail");
            expect(shaft[0][0], "tail x").closeTo(0, 1e-9);
            expect(shaft[0][1], "tail y").closeTo(2, 1e-9);
            expect(shaft[1][1] - shaft[0][1]).closeTo(0, 1e-9);
            expect(shaft[1][0] - shaft[0][0]).greaterThan(0);
        });
    });
});
