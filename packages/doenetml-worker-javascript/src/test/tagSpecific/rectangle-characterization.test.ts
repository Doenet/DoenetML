import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import { updateMathInputValue } from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

/**
 * BACKWARD-COMPATIBILITY CHARACTERIZATION SUITE FOR <rectangle>.
 *
 * This suite pins the observable behavior of the rectangle across all of its
 * definition modes (corner+size, center+size, 1 vertex ± center/size,
 * 2 vertices), so that changes to the inverse of `vertices` — which has to
 * reconcile several ways of specifying the same geometry — cannot silently
 * alter one mode while fixing another.
 *
 * Three invariants are verified below in every mode:
 *   (I1) Changing width or height PRESERVES THE CENTER (symmetric expansion),
 *        regardless of how the rectangle was defined.
 *   (I2) Dragging the whole rectangle is a clean translation
 *        (center shifts by the drag vector; width/height unchanged).
 *   (I3) Dragging one corner keeps the DIAGONALLY OPPOSITE corner fixed.
 *
 * The expected values here were read off actual behavior. If one of them starts
 * failing, that is a signal to investigate the change in behavior, not to
 * rewrite the expectation to match.
 *
 * The blocks at the bottom cover rectangles whose size attribute is a
 * self-reference (`height="$R.width"`), which constrains them to stay square.
 */

type Snap = { v: number[][]; w: number; h: number; c: number[] };

function scene(rectAttrs: string) {
    return `
  <graph><rectangle name="R" ${rectAttrs} draggable verticesDraggable /></graph>
  <mathInput name="miw" bindValueTo="$R.width" />
  <mathInput name="mih" bindValueTo="$R.height" />`;
}

async function fresh(attrs: string) {
    const { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML: scene(attrs),
    });
    return { core, r: resolvePathToNodeIdx };
}

async function readVertices(core: PublicDoenetMLCore, idx: number) {
    const sv = await core.returnAllStateVariables(false, true);
    return sv[idx].stateValues.vertices.map((x: any[]) =>
        x.map((y: any) => y.evaluate_to_constant()),
    );
}

async function expectRect(
    core: PublicDoenetMLCore,
    r: (s: string) => Promise<number>,
    exp: Snap,
) {
    const sv = await core.returnAllStateVariables(false, true);
    const R = sv[await r("R")];
    expect(
        R.stateValues.vertices.map((x: any[]) =>
            x.map((y: any) => y.evaluate_to_constant()),
        ),
    ).eqls(exp.v);
    expect(R.stateValues.width).eq(exp.w);
    expect(R.stateValues.height).eq(exp.h);
    expect(R.stateValues.center.map((x: any) => x.evaluate_to_constant())).eqls(
        exp.c,
    );
}

async function dragBy(
    core: PublicDoenetMLCore,
    idx: number,
    pointCoords: Record<number, number[]>,
) {
    await core.requestAction({
        componentIdx: idx,
        actionName: "movePolygon",
        args: { pointCoords },
    });
}

type ModeSpec = {
    label: string;
    attrs: string;
    initial: Snap;
    afterWidth10: Snap; // set $R.width := 10   -> expect center preserved (I1)
    afterHeight12: Snap; // set $R.height := 12  -> expect center preserved (I1)
    afterDragWhole: Snap; // translate all 4 verts by (+5,+3) (I2)
    afterDragV2: Snap; // drag corner index 2 by (+5,+3); V0 must stay put (I3)
};

const MODES: ModeSpec[] = [
    {
        label: "corner-primary: default unit square",
        attrs: "",
        initial: {
            v: [
                [0, 0],
                [1, 0],
                [1, 1],
                [0, 1],
            ],
            w: 1,
            h: 1,
            c: [0.5, 0.5],
        },
        afterWidth10: {
            v: [
                [-4.5, 0],
                [5.5, 0],
                [5.5, 1],
                [-4.5, 1],
            ],
            w: 10,
            h: 1,
            c: [0.5, 0.5],
        },
        afterHeight12: {
            v: [
                [0, -5.5],
                [1, -5.5],
                [1, 6.5],
                [0, 6.5],
            ],
            w: 1,
            h: 12,
            c: [0.5, 0.5],
        },
        afterDragWhole: {
            v: [
                [5, 3],
                [6, 3],
                [6, 4],
                [5, 4],
            ],
            w: 1,
            h: 1,
            c: [5.5, 3.5],
        },
        afterDragV2: {
            v: [
                [0, 0],
                [6, 0],
                [6, 4],
                [0, 4],
            ],
            w: 6,
            h: 4,
            c: [3, 2],
        },
    },
    {
        label: "corner-primary: width=4 height=2",
        attrs: 'width="4" height="2"',
        initial: {
            v: [
                [0, 0],
                [4, 0],
                [4, 2],
                [0, 2],
            ],
            w: 4,
            h: 2,
            c: [2, 1],
        },
        afterWidth10: {
            v: [
                [-3, 0],
                [7, 0],
                [7, 2],
                [-3, 2],
            ],
            w: 10,
            h: 2,
            c: [2, 1],
        },
        afterHeight12: {
            v: [
                [0, -5],
                [4, -5],
                [4, 7],
                [0, 7],
            ],
            w: 4,
            h: 12,
            c: [2, 1],
        },
        afterDragWhole: {
            v: [
                [5, 3],
                [9, 3],
                [9, 5],
                [5, 5],
            ],
            w: 4,
            h: 2,
            c: [7, 4],
        },
        afterDragV2: {
            v: [
                [0, 0],
                [9, 0],
                [9, 5],
                [0, 5],
            ],
            w: 9,
            h: 5,
            c: [4.5, 2.5],
        },
    },
    {
        label: "center-primary: width=4 center=(1,3)",
        attrs: 'width="4" center="(1,3)"',
        initial: {
            v: [
                [-1, 2.5],
                [3, 2.5],
                [3, 3.5],
                [-1, 3.5],
            ],
            w: 4,
            h: 1,
            c: [1, 3],
        },
        afterWidth10: {
            v: [
                [-4, 2.5],
                [6, 2.5],
                [6, 3.5],
                [-4, 3.5],
            ],
            w: 10,
            h: 1,
            c: [1, 3],
        },
        afterHeight12: {
            v: [
                [-1, -3],
                [3, -3],
                [3, 9],
                [-1, 9],
            ],
            w: 4,
            h: 12,
            c: [1, 3],
        },
        afterDragWhole: {
            v: [
                [4, 5.5],
                [8, 5.5],
                [8, 6.5],
                [4, 6.5],
            ],
            w: 4,
            h: 1,
            c: [6, 6],
        },
        afterDragV2: {
            v: [
                [-1, 2.5],
                [8, 2.5],
                [8, 6.5],
                [-1, 6.5],
            ],
            w: 9,
            h: 4,
            c: [3.5, 4.5],
        },
    },
    {
        label: "center-primary: center=(1,3) only",
        attrs: 'center="(1,3)"',
        initial: {
            v: [
                [0.5, 2.5],
                [1.5, 2.5],
                [1.5, 3.5],
                [0.5, 3.5],
            ],
            w: 1,
            h: 1,
            c: [1, 3],
        },
        afterWidth10: {
            v: [
                [-4, 2.5],
                [6, 2.5],
                [6, 3.5],
                [-4, 3.5],
            ],
            w: 10,
            h: 1,
            c: [1, 3],
        },
        afterHeight12: {
            v: [
                [0.5, -3],
                [1.5, -3],
                [1.5, 9],
                [0.5, 9],
            ],
            w: 1,
            h: 12,
            c: [1, 3],
        },
        afterDragWhole: {
            v: [
                [5.5, 5.5],
                [6.5, 5.5],
                [6.5, 6.5],
                [5.5, 6.5],
            ],
            w: 1,
            h: 1,
            c: [6, 6],
        },
        afterDragV2: {
            v: [
                [0.5, 2.5],
                [6.5, 2.5],
                [6.5, 6.5],
                [0.5, 6.5],
            ],
            w: 6,
            h: 4,
            c: [3.5, 4.5],
        },
    },
    {
        label: "1 vertex (2,3)",
        attrs: 'vertices="(2,3)"',
        initial: {
            v: [
                [2, 3],
                [3, 3],
                [3, 4],
                [2, 4],
            ],
            w: 1,
            h: 1,
            c: [2.5, 3.5],
        },
        afterWidth10: {
            v: [
                [-2.5, 3],
                [7.5, 3],
                [7.5, 4],
                [-2.5, 4],
            ],
            w: 10,
            h: 1,
            c: [2.5, 3.5],
        },
        afterHeight12: {
            v: [
                [2, -2.5],
                [3, -2.5],
                [3, 9.5],
                [2, 9.5],
            ],
            w: 1,
            h: 12,
            c: [2.5, 3.5],
        },
        afterDragWhole: {
            v: [
                [7, 6],
                [8, 6],
                [8, 7],
                [7, 7],
            ],
            w: 1,
            h: 1,
            c: [7.5, 6.5],
        },
        afterDragV2: {
            v: [
                [2, 3],
                [8, 3],
                [8, 7],
                [2, 7],
            ],
            w: 6,
            h: 4,
            c: [5, 5],
        },
    },
    {
        label: "1 vertex (2,3) width=5 height=7",
        attrs: 'vertices="(2,3)" width="5" height="7"',
        initial: {
            v: [
                [2, 3],
                [7, 3],
                [7, 10],
                [2, 10],
            ],
            w: 5,
            h: 7,
            c: [4.5, 6.5],
        },
        afterWidth10: {
            v: [
                [-0.5, 3],
                [9.5, 3],
                [9.5, 10],
                [-0.5, 10],
            ],
            w: 10,
            h: 7,
            c: [4.5, 6.5],
        },
        afterHeight12: {
            v: [
                [2, 0.5],
                [7, 0.5],
                [7, 12.5],
                [2, 12.5],
            ],
            w: 5,
            h: 12,
            c: [4.5, 6.5],
        },
        afterDragWhole: {
            v: [
                [7, 6],
                [12, 6],
                [12, 13],
                [7, 13],
            ],
            w: 5,
            h: 7,
            c: [9.5, 9.5],
        },
        afterDragV2: {
            v: [
                [2, 3],
                [12, 3],
                [12, 13],
                [2, 13],
            ],
            w: 10,
            h: 10,
            c: [7, 8],
        },
    },
    {
        label: "1 vertex (2,3) center=(4,5)",
        attrs: 'vertices="(2,3)" center="(4,5)"',
        initial: {
            v: [
                [2, 3],
                [6, 3],
                [6, 7],
                [2, 7],
            ],
            w: 4,
            h: 4,
            c: [4, 5],
        },
        afterWidth10: {
            v: [
                [-1, 3],
                [9, 3],
                [9, 7],
                [-1, 7],
            ],
            w: 10,
            h: 4,
            c: [4, 5],
        },
        afterHeight12: {
            v: [
                [2, -1],
                [6, -1],
                [6, 11],
                [2, 11],
            ],
            w: 4,
            h: 12,
            c: [4, 5],
        },
        afterDragWhole: {
            v: [
                [7, 6],
                [11, 6],
                [11, 10],
                [7, 10],
            ],
            w: 4,
            h: 4,
            c: [9, 8],
        },
        afterDragV2: {
            v: [
                [2, 3],
                [11, 3],
                [11, 10],
                [2, 10],
            ],
            w: 9,
            h: 7,
            c: [6.5, 6.5],
        },
    },
    {
        label: "2 vertices (2,3)(6,9)",
        attrs: 'vertices="(2,3) (6,9)"',
        initial: {
            v: [
                [2, 3],
                [6, 3],
                [6, 9],
                [2, 9],
            ],
            w: 4,
            h: 6,
            c: [4, 6],
        },
        afterWidth10: {
            v: [
                [-1, 3],
                [9, 3],
                [9, 9],
                [-1, 9],
            ],
            w: 10,
            h: 6,
            c: [4, 6],
        },
        afterHeight12: {
            v: [
                [2, 0],
                [6, 0],
                [6, 12],
                [2, 12],
            ],
            w: 4,
            h: 12,
            c: [4, 6],
        },
        afterDragWhole: {
            v: [
                [7, 6],
                [11, 6],
                [11, 12],
                [7, 12],
            ],
            w: 4,
            h: 6,
            c: [9, 9],
        },
        afterDragV2: {
            v: [
                [2, 3],
                [11, 3],
                [11, 12],
                [2, 12],
            ],
            w: 9,
            h: 9,
            c: [6.5, 7.5],
        },
    },
];

describe("rectangle backward-compatibility characterization @group3", async () => {
    for (const mode of MODES) {
        describe(mode.label, () => {
            it("initial geometry", async () => {
                const { core, r } = await fresh(mode.attrs);
                await expectRect(core, r, mode.initial);
            });

            it("I1: changing width preserves the center", async () => {
                const { core, r } = await fresh(mode.attrs);
                await updateMathInputValue({
                    latex: "10",
                    componentIdx: await r("miw"),
                    core,
                });
                await expectRect(core, r, mode.afterWidth10);
                // center must equal the initial center
                expect(mode.afterWidth10.c).eqls(mode.initial.c);
            });

            it("I1: changing height preserves the center", async () => {
                const { core, r } = await fresh(mode.attrs);
                await updateMathInputValue({
                    latex: "12",
                    componentIdx: await r("mih"),
                    core,
                });
                await expectRect(core, r, mode.afterHeight12);
                expect(mode.afterHeight12.c).eqls(mode.initial.c);
            });

            it("I2: dragging whole rectangle translates cleanly", async () => {
                const { core, r } = await fresh(mode.attrs);
                const idx = await r("R");
                const V = await readVertices(core, idx);
                const shifted: Record<number, number[]> = {};
                for (let i = 0; i < 4; i++)
                    shifted[i] = [V[i][0] + 5, V[i][1] + 3];
                await dragBy(core, idx, shifted);
                await expectRect(core, r, mode.afterDragWhole);
                // width/height unchanged; center shifted by exactly (5,3)
                expect(mode.afterDragWhole.w).eq(mode.initial.w);
                expect(mode.afterDragWhole.h).eq(mode.initial.h);
                expect(mode.afterDragWhole.c).eqls([
                    mode.initial.c[0] + 5,
                    mode.initial.c[1] + 3,
                ]);
            });

            it("I3: dragging corner V2 keeps opposite corner V0 fixed", async () => {
                const { core, r } = await fresh(mode.attrs);
                const idx = await r("R");
                const V = await readVertices(core, idx);
                await dragBy(core, idx, { 2: [V[2][0] + 5, V[2][1] + 3] });
                await expectRect(core, r, mode.afterDragV2);
                // opposite corner (index 0) is unchanged from initial
                expect(mode.afterDragV2.v[0]).eqls(mode.initial.v[0]);
            });
        });
    }
});

/**
 * Self-referential sizes — a rectangle constrained to stay square by binding one
 * size to the other.
 *
 * Writing a size drives that size attribute's inverse; when the attribute is a
 * self-reference, that comes back around as a request on the *other* dimension,
 * whose inverse re-derives the vertices from the pre-update center. Left alone,
 * that write-back pins the rectangle. Three things keep it from doing so: the
 * inverse of `vertices` (1) does not request a size that did not change, so an
 * exact translation triggers no write-back at all, and (2) requests the position
 * for every dimension it touches, after the sizes, so the drag's position lands
 * last and wins over the stale one; and (3) `movePolygon`, which sets sizes
 * directly when a corner is dragged, likewise requests the vertices last.
 *
 * Rule (1) compares sizes exactly, so a translation by a non-representable delta
 * can still perturb the computed size and drive the write-back anyway; rule (2)
 * is what keeps the position correct when it does. The non-integer translation
 * test below pins that, since real pointer drags never land on integers.
 *
 * Both orientations are covered, but they are NOT symmetric before the fix, and
 * only `height="$R.width"` is actually broken there. The pre-fix inverse
 * interleaved its requests per dimension — x anchor, width, y anchor, height —
 * so `width="$R.height"`, whose write-back re-derives y, happened to be followed
 * by the y anchor and came out right, while `height="$R.width"`, whose
 * write-back re-derives x, landed last and pinned x. That accident is why the
 * bug is orientation-specific. The `width="$R.height"` block below therefore
 * mostly guards the orientation that already worked against the reordering,
 * rather than reproducing the bug.
 *
 * Corner drags are covered on both diagonals. The two are not equivalent: a
 * corner on the main diagonal (V0/V2) reaches the inverse of `vertices` without
 * any anchor request of its own, while `movePolygon` writes a size directly for
 * V0/V1/V3 but not for V2 — so each corner exercises a different path.
 *
 * A self-referential rectangle is over-constrained whenever the pointer lands off
 * the square's diagonal: "stay square", "follow the pointer" and "hold the
 * opposite corner" cannot all three hold. The drags in the tests immediately
 * below are all square-compatible, so all three do hold. The over-constrained
 * block at the end pins what gives when they cannot — see its comment.
 */
describe("rectangle self-reference height=$R.width @group3", async () => {
    it("translates freely (the center is not pinned)", async () => {
        const { core, resolvePathToNodeIdx: r } = await createTestCore({
            doenetML: `<graph><rectangle name="R" width="4" height="$R.width" draggable /></graph>`,
        });
        const idx = await r("R");
        // request translation by (5,3): [0,0]..[4,4] -> [5,3]..[9,7]
        await dragBy(core, idx, { 0: [5, 3], 1: [9, 3], 2: [9, 7], 3: [5, 7] });
        // the whole translation is honored; the rectangle stays 4x4
        await expectRect(core, r, {
            v: [
                [5, 3],
                [9, 3],
                [9, 7],
                [5, 7],
            ],
            w: 4,
            h: 4,
            c: [7, 5],
        });
    });

    it("translates freely by a non-integer delta", async () => {
        const { core, resolvePathToNodeIdx: r } = await createTestCore({
            doenetML: `<graph><rectangle name="R" width="4" height="$R.width" draggable /></graph>`,
        });
        const idx = await r("R");
        // A real pointer drag never lands on integers. 4.1-0.1 is not exactly 4
        // in floating point, so the size comparison sees a "change" and drives
        // the write-back anyway; the position must still land where dragged.
        await dragBy(core, idx, {
            0: [0.1, 0.1],
            1: [4.1, 0.1],
            2: [4.1, 4.1],
            3: [0.1, 4.1],
        });
        const V = await readVertices(core, idx);
        expect(V[0][0]).closeTo(0.1, 1e-12);
        expect(V[0][1]).closeTo(0.1, 1e-12);
        expect(V[2][0]).closeTo(4.1, 1e-12);
        expect(V[2][1]).closeTo(4.1, 1e-12);
        // still square, to within the rounding of the drag itself
        const sv = await core.returnAllStateVariables(false, true);
        const R = sv[idx];
        expect(R.stateValues.width).closeTo(4, 1e-12);
        expect(R.stateValues.height).closeTo(4, 1e-12);
    });

    it("dragging a corner resizes it as a square, holding the opposite corner", async () => {
        const { core, resolvePathToNodeIdx: r } = await createTestCore({
            doenetML: `<graph><rectangle name="R" width="4" height="$R.width" draggable verticesDraggable /></graph>`,
        });
        const idx = await r("R");
        // drag corner V3 (starts at (0,4)) to (-2,6) — on the square's diagonal
        // from the opposite corner V1, so this drag is not over-constrained
        await dragBy(core, idx, { 3: [-2, 6] });
        // V3 lands exactly where dragged, the opposite corner V1 stays at (4,0),
        // and height still tracks width, so it remains square (6x6).
        await expectRect(core, r, {
            v: [
                [-2, 0],
                [4, 0],
                [4, 6],
                [-2, 6],
            ],
            w: 6,
            h: 6,
            c: [1, 3],
        });
    });

    it("dragging corner V2 outward grows the square, holding V0", async () => {
        const { core, resolvePathToNodeIdx: r } = await createTestCore({
            doenetML: `<graph><rectangle name="R" width="4" height="$R.width" draggable verticesDraggable /></graph>`,
        });
        const idx = await r("R");
        // drag corner V2 (starts at (4,4)) to (6,6), along the main diagonal
        await dragBy(core, idx, { 2: [6, 6] });
        await expectRect(core, r, {
            v: [
                [0, 0],
                [6, 0],
                [6, 6],
                [0, 6],
            ],
            w: 6,
            h: 6,
            c: [3, 3],
        });
    });

    it("dragging corner V0 inward shrinks the square, holding V2", async () => {
        const { core, resolvePathToNodeIdx: r } = await createTestCore({
            doenetML: `<graph><rectangle name="R" width="4" height="$R.width" draggable verticesDraggable /></graph>`,
        });
        const idx = await r("R");
        // drag corner V0 (starts at (0,0)) to (2,2), along the main diagonal
        await dragBy(core, idx, { 0: [2, 2] });
        await expectRect(core, r, {
            v: [
                [2, 2],
                [4, 2],
                [4, 4],
                [2, 4],
            ],
            w: 2,
            h: 2,
            c: [3, 3],
        });
    });
});

/**
 * Over-constrained corner drags on a self-referential (square) rectangle.
 *
 * When the pointer lands off the square's diagonal, "stay square", "follow the
 * pointer" and "hold the opposite corner" cannot all hold. What gives is decided
 * by the anchor: the inverse of `vertices` requests the anchor last, so the
 * anchor always wins.
 *
 * These cases are anchored on an essential vertex, so the anchor is the
 * rectangle's v0 (min-x, min-y) corner:
 *
 *   - Dragging V0/V1/V3 moves the anchor itself, so the pointer is followed
 *     exactly and the OPPOSITE CORNER SLIDES.
 *   - Dragging V2 leaves the anchor at the opposite corner, so the OPPOSITE
 *     CORNER HOLDS and the pointer is not reached.
 *
 * The rectangle stays square either way. This asymmetry is a consequence of
 * which corner anchors the rectangle, not an independent choice: the anchor
 * request is exactly what stops the self-reference write-back from re-centering
 * the rectangle, so it cannot be dropped to make V2 follow the pointer. A
 * center-anchored rectangle resolves the same conflict about its center
 * instead — see the center block below.
 *
 * These values are pinned to make any future change to that trade-off visible.
 */
describe("rectangle self-reference, over-constrained corner drags @group3", async () => {
    const ml = `<graph><rectangle name="R" width="4" height="$R.width" draggable verticesDraggable /></graph>`;

    it("V3 dragged off the diagonal: pointer wins, opposite corner slides", async () => {
        const { core, resolvePathToNodeIdx: r } = await createTestCore({
            doenetML: ml,
        });
        const idx = await r("R");
        // V3 starts (0,4), opposite corner V1 is (4,0). Dragging V3 to (-2,7)
        // asks for a 6-wide, 7-tall rectangle — impossible while square.
        await dragBy(core, idx, { 3: [-2, 7] });
        await expectRect(core, r, {
            v: [
                [-2, 0],
                [5, 0],
                [5, 7],
                [-2, 7],
            ],
            w: 7,
            h: 7,
            c: [1.5, 3.5],
        });
        // V3 landed exactly on the pointer; V1 slid from (4,0) to (5,0).
    });

    it("V2 dragged off the diagonal: opposite corner wins, pointer slides", async () => {
        const { core, resolvePathToNodeIdx: r } = await createTestCore({
            doenetML: ml,
        });
        const idx = await r("R");
        // V2 starts (4,4), opposite corner V0 is (0,0) and is the anchor.
        // Dragging V2 to (6,7) asks for 6-wide, 7-tall — impossible while square.
        await dragBy(core, idx, { 2: [6, 7] });
        await expectRect(core, r, {
            v: [
                [0, 0],
                [7, 0],
                [7, 7],
                [0, 7],
            ],
            w: 7,
            h: 7,
            c: [3.5, 3.5],
        });
        // V0 held exactly; V2 landed at (7,7) rather than on the pointer (6,7).
    });

    it("V1 dragged off the diagonal: pointer wins, opposite corner slides", async () => {
        const { core, resolvePathToNodeIdx: r } = await createTestCore({
            doenetML: ml,
        });
        const idx = await r("R");
        // V1 starts (4,0), opposite corner V3 is (0,4).
        await dragBy(core, idx, { 1: [7, -2] });
        await expectRect(core, r, {
            v: [
                [-1, -2],
                [7, -2],
                [7, 6],
                [-1, 6],
            ],
            w: 8,
            h: 8,
            c: [3, 2],
        });
        // V1 landed exactly on the pointer; V3 slid from (0,4) to (-1,6).
    });
});

describe("rectangle self-reference with a specified vertex @group3", async () => {
    // `vertices="(2,3)" width="4" height="$R.width"` anchors the square on a
    // specified vertex rather than an essential one, which is a separate branch
    // of the inverse of `vertices` with the same self-reference exposure.
    const ml = `<graph><rectangle name="R" vertices="(2,3)" width="4" height="$R.width" draggable verticesDraggable /></graph>`;

    it("translates freely (the anchor vertex is not pinned)", async () => {
        const { core, resolvePathToNodeIdx: r } = await createTestCore({
            doenetML: ml,
        });
        const idx = await r("R");
        // request translation by (5,3): [2,3]..[6,7] -> [7,6]..[11,10]
        await dragBy(core, idx, {
            0: [7, 6],
            1: [11, 6],
            2: [11, 10],
            3: [7, 10],
        });
        await expectRect(core, r, {
            v: [
                [7, 6],
                [11, 6],
                [11, 10],
                [7, 10],
            ],
            w: 4,
            h: 4,
            c: [9, 8],
        });
    });

    it("dragging corner V2 outward grows the square, holding V0", async () => {
        const { core, resolvePathToNodeIdx: r } = await createTestCore({
            doenetML: ml,
        });
        const idx = await r("R");
        // drag corner V2 (starts at (6,7)) to (8,9), along the main diagonal
        await dragBy(core, idx, { 2: [8, 9] });
        await expectRect(core, r, {
            v: [
                [2, 3],
                [8, 3],
                [8, 9],
                [2, 9],
            ],
            w: 6,
            h: 6,
            c: [5, 6],
        });
    });
});

describe("rectangle self-reference anchored on a center @group3", async () => {
    // `center="(1,2)" width="4" height="$R.width"` anchors the square on a
    // center rather than on a vertex, which is the third branch of the inverse
    // of `vertices` that reconciles sizes with a position.
    //
    // The anchor here is the center, not v0, so the over-constrained tie-break
    // differs from the vertex-anchored blocks above: the center is what holds,
    // and both the pointer and the opposite corner give.
    const ml = `<graph><rectangle name="R" center="(1,2)" width="4" height="$R.width" draggable verticesDraggable /></graph>`;

    it("translates freely (the center is not pinned)", async () => {
        const { core, resolvePathToNodeIdx: r } = await createTestCore({
            doenetML: ml,
        });
        const idx = await r("R");
        // request translation by (5,3): [-1,0]..[3,4] -> [4,3]..[8,7]
        await dragBy(core, idx, { 0: [4, 3], 1: [8, 3], 2: [8, 7], 3: [4, 7] });
        await expectRect(core, r, {
            v: [
                [4, 3],
                [8, 3],
                [8, 7],
                [4, 7],
            ],
            w: 4,
            h: 4,
            c: [6, 5],
        });
    });

    it("dragging corner V2 outward grows the square, holding V0", async () => {
        const { core, resolvePathToNodeIdx: r } = await createTestCore({
            doenetML: ml,
        });
        const idx = await r("R");
        // drag corner V2 (starts at (3,4)) to (5,6), along the main diagonal
        await dragBy(core, idx, { 2: [5, 6] });
        await expectRect(core, r, {
            v: [
                [-1, 0],
                [5, 0],
                [5, 6],
                [-1, 6],
            ],
            w: 6,
            h: 6,
            c: [2, 3],
        });
    });

    it("V2 dragged off the diagonal: the center wins, both corners slide", async () => {
        const { core, resolvePathToNodeIdx: r } = await createTestCore({
            doenetML: ml,
        });
        const idx = await r("R");
        // V2 starts (3,4); dragging it to (5,7) asks for 6-wide, 7-tall —
        // impossible while square. The center request lands last and wins, so
        // the square is centered on the midpoint of the drag and grows about it:
        // neither the pointer nor the opposite corner V0 is held.
        await dragBy(core, idx, { 2: [5, 7] });
        await expectRect(core, r, {
            v: [
                [-1.5, 0],
                [5.5, 0],
                [5.5, 7],
                [-1.5, 7],
            ],
            w: 7,
            h: 7,
            c: [2, 3.5],
        });
    });
});

describe("rectangle self-reference width=$R.height @group3", async () => {
    // The mirror image of the height="$R.width" cases above. Here the write-back
    // lands on `height`, so it is the y-coordinates that would be pinned.
    it("translates freely (the center is not pinned)", async () => {
        const { core, resolvePathToNodeIdx: r } = await createTestCore({
            doenetML: `<graph><rectangle name="R" height="4" width="$R.height" draggable /></graph>`,
        });
        const idx = await r("R");
        // request translation by (5,3): [0,0]..[4,4] -> [5,3]..[9,7]
        await dragBy(core, idx, { 0: [5, 3], 1: [9, 3], 2: [9, 7], 3: [5, 7] });
        await expectRect(core, r, {
            v: [
                [5, 3],
                [9, 3],
                [9, 7],
                [5, 7],
            ],
            w: 4,
            h: 4,
            c: [7, 5],
        });
    });

    it("dragging a corner resizes it as a square, holding the opposite corner", async () => {
        const { core, resolvePathToNodeIdx: r } = await createTestCore({
            doenetML: `<graph><rectangle name="R" height="4" width="$R.height" draggable verticesDraggable /></graph>`,
        });
        const idx = await r("R");
        // drag corner V1 (starts at (4,0)) to (6,-2)
        await dragBy(core, idx, { 1: [6, -2] });
        // V1 lands exactly where dragged, the opposite corner V3 stays at (0,4),
        // and width still tracks height, so it remains square (6x6).
        await expectRect(core, r, {
            v: [
                [0, -2],
                [6, -2],
                [6, 4],
                [0, 4],
            ],
            w: 6,
            h: 6,
            c: [3, 1],
        });
    });

    it("dragging corner V2 outward grows the square, holding V0", async () => {
        const { core, resolvePathToNodeIdx: r } = await createTestCore({
            doenetML: `<graph><rectangle name="R" height="4" width="$R.height" draggable verticesDraggable /></graph>`,
        });
        const idx = await r("R");
        // drag corner V2 (starts at (4,4)) to (6,6), along the main diagonal
        await dragBy(core, idx, { 2: [6, 6] });
        await expectRect(core, r, {
            v: [
                [0, 0],
                [6, 0],
                [6, 6],
                [0, 6],
            ],
            w: 6,
            h: 6,
            c: [3, 3],
        });
    });
});
