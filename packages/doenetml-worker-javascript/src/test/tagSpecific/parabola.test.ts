import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    moveControlVector,
    movePoint,
    moveThroughPoint,
    updateMathInputValue,
    updateTextInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function setupScene(parabolaML: string) {
    let { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML:
            `
<graph>
` +
            parabolaML +
            `
    <point extend="$p1.vertex" name="v1" />
</graph>
<graph name="g2">
    <parabola extend="$p1" name="p2" />
    <point extend="$v1" name="v2" />
</graph>
<graph extend="$g2" name="g3" />

<math extend="$p2.equation" name="e2" />

<p>a = <mathInput name="a" bindValueTo="$(p1.a)"/></p>
<p>b = <mathInput name="b" bindValueTo="$(p1.b)"/></p>
<p>c = <mathInput name="c" bindValueTo="$(p1.c)"/></p>

<p>a2 = <mathInput name="a2" bindValueTo="$(p2.a)"/></p>
<p>b2 = <mathInput name="b2" bindValueTo="$(p2.b)"/></p>
<p>c2 = <mathInput name="c2" bindValueTo="$(p2.c)"/></p>

    `,
    });

    return { core, resolvePathToNodeIdx };
}

function calc_pars_from_points({
    points,
    have_vertex = false,
    old_pars,
}: {
    points: number[][];
    have_vertex?: boolean;
    old_pars?: { a: number; b: number; c: number };
}) {
    let a: number, b: number, c: number;

    // deduplicate points
    points = points.filter(
        (v, i) =>
            !points.slice(0, i).some((u) => u[0] === v[0] && u[1] === v[1]),
    );

    if (points.length === 0) {
        if (old_pars) {
            a = old_pars.a;
            b = old_pars.b;
            c = old_pars.c;
        } else {
            a = 1;
            b = 0;
            c = 0;
        }
    } else if (points.length === 1) {
        // one given point is the vertex
        // (doesn't matter if have_vertex is true)
        let x1 = points[0][0];
        let y1 = points[0][1];
        if (old_pars) {
            a = old_pars.a;
        } else {
            a = 1;
        }
        b = -2 * a * x1;
        c = a * x1 ** 2 + y1;
    } else if (points.length === 2) {
        let x1 = points[0][0];
        let x2 = points[1][0];
        let y1 = points[0][1];
        let y2 = points[1][1];

        if (have_vertex) {
            a = (y2 - y1) / (x2 - x1) ** 2;
            b = -2 * a * x1;
            c = a * x1 * x1 + y1;
        } else {
            if (old_pars) {
                a = old_pars.a;
            } else {
                a = 1;
            }

            b = (y1 - y2 - a * (x1 ** 2 - x2 ** 2)) / (x1 - x2);
            c = y1 - a * x1 ** 2 - b * x1;
        }
    } else {
        let x1 = points[0][0];
        let x2 = points[1][0];
        let x3 = points[2][0];
        let y1 = points[0][1];
        let y2 = points[1][1];
        let y3 = points[2][1];

        let x12 = x1 * x1;
        let x22 = x2 * x2;
        let x32 = x3 * x3;

        let u1 = x12 - x32;
        let u2 = x22 - x32;

        let v1 = x1 - x3;
        let v2 = x2 - x3;

        let z1 = y1 - y3;
        let z2 = y2 - y3;

        let det = u1 * v2 - u2 * v1;

        a = (z1 * v2 - z2 * v1) / det;
        b = (z2 * u1 - z1 * u2) / det;
        c = y1 - b * x1 - a * x12;
    }

    if (!(Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(c))) {
        a = NaN;
        b = NaN;
        c = NaN;
    }
    return [a, b, c];
}

function adjust_points_from_pars({
    a,
    b,
    c,
    points,
    have_vertex,
}: {
    a: number;
    b: number;
    c: number;
    points: number[][];
    have_vertex: boolean;
}) {
    if (points.length === 1) {
        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);
        points[0] = [vertex_x, vertex_y];
    } else if (have_vertex) {
        let vertex_x = -b / (2 * a);
        let vertex_y = c - b ** 2 / (4 * a);
        let dx = vertex_x - points[0][0];
        let p1x = points[1][0] + dx;
        points[0] = [vertex_x, vertex_y];
        points[1] = [p1x, a * p1x ** 2 + b * p1x + c];
    } else {
        for (let pt of points) {
            pt[1] = a * pt[0] ** 2 + b * pt[0] + c;
        }
    }
}

async function runTests({
    core,
    resolvePathToNodeIdx,
    points = [],
    vertex,
}: {
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
    points?: number[][];
    vertex?: number[];
}) {
    let names = [
        ["p1", "v1"],
        ["p2", "v2"],
        ["g3.p2", "g3.v2"],
    ];

    let have_vertex = vertex !== undefined;
    if (vertex !== undefined) {
        points = [vertex, ...points];
    }

    let [a, b, c] = calc_pars_from_points({ points, have_vertex });

    await checkAllParabolaValues({
        names,
        a,
        b,
        c,
        points,
        core,
        resolvePathToNodeIdx,
    });

    // Change a
    a = -2;
    await updateMathInputValue({
        latex: `${a}`,
        componentIdx: await resolvePathToNodeIdx("a"),
        core,
    });
    adjust_points_from_pars({ a, b, c, points, have_vertex });
    await checkAllParabolaValues({
        names,
        a,
        b,
        c,
        points,
        core,
        resolvePathToNodeIdx,
    });

    // change b
    b = 3;
    await updateMathInputValue({
        latex: `${b}`,
        componentIdx: await resolvePathToNodeIdx("b"),
        core,
    });
    adjust_points_from_pars({ a, b, c, points, have_vertex });
    await checkAllParabolaValues({
        names,
        a,
        b,
        c,
        points,
        core,
        resolvePathToNodeIdx,
    });

    // change c
    c = 9;
    await updateMathInputValue({
        latex: `${c}`,
        componentIdx: await resolvePathToNodeIdx("c"),
        core,
    });
    adjust_points_from_pars({ a, b, c, points, have_vertex });
    await checkAllParabolaValues({
        names,
        a,
        b,
        c,
        points,
        core,
        resolvePathToNodeIdx,
    });

    // Change a2
    a = 0.2;
    await updateMathInputValue({
        latex: `${a}`,
        componentIdx: await resolvePathToNodeIdx("a2"),
        core,
    });
    adjust_points_from_pars({ a, b, c, points, have_vertex });
    await checkAllParabolaValues({
        names,
        a,
        b,
        c,
        points,
        core,
        resolvePathToNodeIdx,
    });

    // change b2
    b = -1.7;
    await updateMathInputValue({
        latex: `${b}`,
        componentIdx: await resolvePathToNodeIdx("b2"),
        core,
    });
    adjust_points_from_pars({ a, b, c, points, have_vertex });
    await checkAllParabolaValues({
        names,
        a,
        b,
        c,
        points,
        core,
        resolvePathToNodeIdx,
    });

    // change c2
    c = -4.5;
    await updateMathInputValue({
        latex: `${c}`,
        componentIdx: await resolvePathToNodeIdx("c2"),
        core,
    });
    adjust_points_from_pars({ a, b, c, points, have_vertex });
    await checkAllParabolaValues({
        names,
        a,
        b,
        c,
        points,
        core,
        resolvePathToNodeIdx,
    });

    // move vertices
    let vertexValues = [
        [-2, 1],
        [5, -6],
        [-3, -2],
    ];
    for (let [ind, namePair] of names.entries()) {
        let vertexName = namePair[1];
        let values = vertexValues[ind];
        let vertex_x = values[0];
        let vertex_y = values[1];
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(vertexName),
            x: vertex_x,
            y: vertex_y,
            core,
        });

        let b = -2 * a * vertex_x;
        let c = vertex_y + a * vertex_x * vertex_x;
        adjust_points_from_pars({ a, b, c, points, have_vertex });

        await checkAllParabolaValues({
            names,
            a,
            b,
            c,
            points,
            core,
            resolvePathToNodeIdx,
        });
    }

    if (points.length === 0) {
        return;
    }

    // move points
    let last_specified_pars = { a, b, c };

    points = [
        [-4, 7],
        [0, -2],
        [-9, 2],
    ].slice(0, points.length);
    for (let [ind, pt] of points.entries()) {
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`P${ind + 1}`),
            x: pt[0],
            y: pt[1],
            core,
        });
    }
    [a, b, c] = calc_pars_from_points({
        points,
        have_vertex,
        old_pars: last_specified_pars,
    });
    await checkAllParabolaValues({
        names,
        a,
        b,
        c,
        points,
        core,
        resolvePathToNodeIdx,
    });

    if (points.length === 1) {
        return;
    }

    // move points on top of each other, become vertex
    points = points.map((_) => [3, -9]);

    for (let [ind, pt] of points.entries()) {
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`P${ind + 1}`),
            x: pt[0],
            y: pt[1],
            core,
        });
    }
    [a, b, c] = calc_pars_from_points({
        points,
        have_vertex,
        old_pars: last_specified_pars,
    });
    await checkAllParabolaValues({
        names,
        a,
        b,
        c,
        points,
        core,
        resolvePathToNodeIdx,
    });

    // move one point above others, parabola becomes undefined
    points[0][1] = -3;
    await movePoint({
        componentIdx: await resolvePathToNodeIdx(`P1`),
        y: points[0][1],
        core,
    });
    [a, b, c] = calc_pars_from_points({
        points,
        have_vertex,
        old_pars: last_specified_pars,
    });
    await checkAllParabolaValues({
        names,
        a,
        b,
        c,
        points,
        core,
        resolvePathToNodeIdx,
    });

    // move that point apart
    points[0][0] = 5;
    await movePoint({
        componentIdx: await resolvePathToNodeIdx(`P1`),
        x: points[0][0],
        core,
    });
    [a, b, c] = calc_pars_from_points({
        points,
        have_vertex,
        old_pars: last_specified_pars,
    });
    await checkAllParabolaValues({
        names,
        a,
        b,
        c,
        points,
        core,
        resolvePathToNodeIdx,
    });

    if (points.length === 2) {
        return;
    }

    // change point grouping (so point 2 is the one apart)
    points[0] = [3, -9];
    points[1] = [4, -9];
    for (let [ind, pt] of points.slice(0, 2).entries()) {
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`P${ind + 1}`),
            x: pt[0],
            y: pt[1],
            core,
        });
    }
    [a, b, c] = calc_pars_from_points({
        points,
        have_vertex,
        old_pars: last_specified_pars,
    });
    await checkAllParabolaValues({
        names,
        a,
        b,
        c,
        points,
        core,
        resolvePathToNodeIdx,
    });

    // change point grouping (so point 3 is the one apart)
    points[1] = [3, -9];
    points[2] = [5, 4];
    for (let [ind, pt] of points.entries()) {
        if (ind == 0) {
            continue;
        }
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`P${ind + 1}`),
            x: pt[0],
            y: pt[1],
            core,
        });
    }
    [a, b, c] = calc_pars_from_points({
        points,
        have_vertex,
        old_pars: last_specified_pars,
    });
    await checkAllParabolaValues({
        names,
        a,
        b,
        c,
        points,
        core,
        resolvePathToNodeIdx,
    });

    // move all points above each other, parabola undefined
    points = [
        [5, 1],
        [5, 2],
        [5, 3],
    ];
    for (let [ind, pt] of points.entries()) {
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`P${ind + 1}`),
            x: pt[0],
            y: pt[1],
            core,
        });
    }
    [a, b, c] = calc_pars_from_points({
        points,
        have_vertex,
        old_pars: last_specified_pars,
    });
    await checkAllParabolaValues({
        names,
        a,
        b,
        c,
        points,
        core,
        resolvePathToNodeIdx,
    });

    // move points apart
    points = [
        [-5, -9],
        [-4, 1],
        [0, 1],
    ];
    for (let [ind, pt] of points.entries()) {
        await movePoint({
            componentIdx: await resolvePathToNodeIdx(`P${ind + 1}`),
            x: pt[0],
            y: pt[1],
            core,
        });
    }
    [a, b, c] = calc_pars_from_points({
        points,
        have_vertex,
        old_pars: last_specified_pars,
    });
    await checkAllParabolaValues({
        names,
        a,
        b,
        c,
        points,
        core,
        resolvePathToNodeIdx,
    });
}

async function checkAllParabolaValues({
    names,
    a,
    b,
    c,
    points,
    core,
    resolvePathToNodeIdx,
}: {
    names: string[][];
    a: number;
    b: number;
    c: number;
    points: number[][];
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
}) {
    for (let namePair of names) {
        await checkParabolaValues({
            name: namePair[0],
            vertexName: namePair[1],
            a,
            b,
            c,
            core,
            resolvePathToNodeIdx,
        });
    }

    const stateVariables = await core.returnAllStateVariables(false, true);
    for (let [i, pt] of points.entries()) {
        expect(
            stateVariables[await resolvePathToNodeIdx(`P${i + 1}`)].stateValues
                .xs[0].tree,
        ).closeTo(pt[0], 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx(`P${i + 1}`)].stateValues
                .xs[1].tree,
        ).closeTo(pt[1], 1e-12);
    }
}

async function checkParabolaValues({
    name,
    vertexName,
    a,
    b,
    c,
    core,
    resolvePathToNodeIdx,
}: {
    name: string;
    vertexName: string;
    a: number;
    b: number;
    c: number;
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
}) {
    let vertex_x = -b / (2 * a);
    let vertex_y = c - b ** 2 / (4 * a);

    const cIdx = await resolvePathToNodeIdx(name);
    const vertexIdx = await resolvePathToNodeIdx(vertexName);

    const stateVariables = await core.returnAllStateVariables(false, true);

    if (Number.isFinite(a) && Number.isFinite(b) && Number.isFinite(c)) {
        expect(stateVariables[cIdx].stateValues.a).closeTo(a, 1e-12);
        expect(stateVariables[cIdx].stateValues.b).closeTo(b, 1e-12);
        expect(stateVariables[cIdx].stateValues.c).closeTo(c, 1e-12);

        let equationExpression = me.fromText(`y=${a}x^2+${b}x+${c}`);
        expect(
            stateVariables[cIdx].stateValues.equation.equals(
                equationExpression,
            ),
        ).eq(true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("e2")
            ].stateValues.value.equals(equationExpression),
        ).eq(true);
    } else {
        expect(stateVariables[cIdx].stateValues.a).eqls(NaN);
        expect(stateVariables[cIdx].stateValues.b).eqls(NaN);
        expect(stateVariables[cIdx].stateValues.c).eqls(NaN);
    }
    if (Number.isFinite(vertex_x)) {
        expect(
            stateVariables[cIdx].stateValues.vertex[0].evaluate_numbers().tree,
        ).closeTo(vertex_x, 1e-12);
        expect(
            stateVariables[vertexIdx].stateValues.xs[0].evaluate_numbers().tree,
        ).closeTo(vertex_x, 1e-12);
    } else {
        expect(
            stateVariables[cIdx].stateValues.vertex[0].evaluate_numbers().tree,
        ).eq("\uff3f");
        expect(
            stateVariables[vertexIdx].stateValues.xs[0].evaluate_numbers().tree,
        ).eq("\uff3f");
    }
    if (Number.isFinite(vertex_y)) {
        expect(
            stateVariables[cIdx].stateValues.vertex[1].evaluate_numbers().tree,
        ).closeTo(vertex_y, 1e-12);
        expect(
            stateVariables[vertexIdx].stateValues.xs[1].evaluate_numbers().tree,
        ).closeTo(vertex_y, 1e-12);
    } else {
        expect(
            stateVariables[cIdx].stateValues.vertex[1].evaluate_numbers().tree,
        ).eq("\uff3f");
        expect(
            stateVariables[vertexIdx].stateValues.xs[1].evaluate_numbers().tree,
        ).eq("\uff3f");
    }
}

describe("Parabola Tag Tests", async () => {
    it("parabola with no parameters gives y=x^2", async () => {
        let { core, resolvePathToNodeIdx } = await setupScene(
            `<parabola name="p1" />`,
        );

        await runTests({ core, resolvePathToNodeIdx });
    });

    it("parabola through no points gives y=x^2", async () => {
        let { core, resolvePathToNodeIdx } = await setupScene(
            `<parabola through="" name="p1" />`,
        );

        await runTests({ core, resolvePathToNodeIdx });
    });

    it("parabola through one point uses it as vertex", async () => {
        let { core, resolvePathToNodeIdx } = await setupScene(`
            <point name="P1">(1,2)</point>
            <parabola through="$P1" name="p1" />`);

        await runTests({ core, resolvePathToNodeIdx, points: [[1, 2]] });
    });

    it("parabola through two points", async () => {
        let { core, resolvePathToNodeIdx } = await setupScene(`
            <point name="P1">(1,2)</point>
            <point name="P2">(3,4)</point>
            <parabola through="$P1 $P2" name="p1" />`);

        await runTests({
            core,
            resolvePathToNodeIdx,
            points: [
                [1, 2],
                [3, 4],
            ],
        });
    });

    it("parabola through three points", async () => {
        let { core, resolvePathToNodeIdx } = await setupScene(`
            <point name="P1">(1,2)</point>
            <point name="P2">(3,4)</point>
            <point name="P3">(5,6)</point>
            <parabola through="$P1 $P2 $P3" name="p1" />`);

        await runTests({
            core,
            resolvePathToNodeIdx,
            points: [
                [1, 2],
                [3, 4],
                [5, 6],
            ],
        });
    });

    it("warning with parabola through four points", async () => {
        let { core } = await createTestCore({
            doenetML: `
    <graph description="A graph with warnings">
    <parabola through="(1,2) (3,4) (5,6) (7,8)" />
    </graph>

    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            `Haven't implemented parabola through more than 3 points`,
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].position.start.line).eq(3);
        expect(errorWarnings.warnings[0].position.start.column).eq(5);
        expect(errorWarnings.warnings[0].position.end.line).eq(3);
        expect(errorWarnings.warnings[0].position.end.column).eq(51);
    });

    it("parabola with prescribed vertex", async () => {
        let { core, resolvePathToNodeIdx } = await setupScene(`
            <point name="P1">(1,2)</point>
            <parabola vertex="$P1" name="p1" />`);

        await runTests({ core, resolvePathToNodeIdx, vertex: [1, 2] });
    });

    it("parabola with prescribed vertex and through point", async () => {
        let { core, resolvePathToNodeIdx } = await setupScene(`
            <point name="P1">(1,2)</point>
            <point name="P2">(3,4)</point>
            <parabola vertex="$P1" through="$P2" name="p1" />`);

        await runTests({
            core,
            resolvePathToNodeIdx,
            points: [[3, 4]],
            vertex: [1, 2],
        });
    });

    it("warning with parabola with vertex and two points", async () => {
        let { core } = await createTestCore({
            doenetML: `
    <graph description="A graph with warnings">
    <parabola vertex="(1,2)" through="(3,4) (5,6)" />
    </graph>

    `,
        });

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(1);

        expect(errorWarnings.warnings[0].message).contain(
            `Haven't implemented parabola with vertex through more than 1 point`,
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].position.start.line).eq(3);
        expect(errorWarnings.warnings[0].position.start.column).eq(5);
        expect(errorWarnings.warnings[0].position.end.line).eq(3);
        expect(errorWarnings.warnings[0].position.end.column).eq(54);
    });

    it("constrain to parabola", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <parabola through="(1,2)" name="p" />
    <point x="0" y="0" name="A">
        <constrainTo>$p</constrainTo>
    </point>
    </graph>
    <graph name="g2">
      <parabola extend="$p" name="p2" />
      <point extend="$A" name="A2" />
    </graph>
    <graph extend="$g2" name="g3" />
    `,
        });

        let f_p = (x) => (x - 1) ** 2 + 2;

        async function check_items(xMin: number, xMax: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const [x1, x2] = stateVariables[
                await resolvePathToNodeIdx("A")
            ].stateValues.xs.map((v) => v.tree);
            const [x12, x22] = stateVariables[
                await resolvePathToNodeIdx("A2")
            ].stateValues.xs.map((v) => v.tree);
            const [x13, x23] = stateVariables[
                await resolvePathToNodeIdx("g3.A2")
            ].stateValues.xs.map((v) => v.tree);
            expect(x1).greaterThan(xMin).lessThan(xMax);
            expect(x2).closeTo(f_p(x1), 1e-14);
            expect(x12).eq(x1);
            expect(x13).eq(x1);
            expect(x22).eq(x2);
            expect(x23).eq(x2);
        }

        await check_items(0, 1);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: 9,
            y: -2,
            core,
        });
        await check_items(0, 9);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A2"),
            x: -9,
            y: 4,
            core,
        });
        await check_items(-9, 0);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g3.A2"),
            x: 0.9,
            y: 9,
            core,
        });
        await check_items(-10, 0.9);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g3.A2"),
            x: 1.1,
            y: 9,
            core,
        });
        await check_items(1.11, 10);
    });

    it("constrain to parabola opening downward", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <parabola through="(1,-2) (2,-3) (0,-3)" name="p" />
    <point x="0" y="0" name="A">
        <constrainTo>$p</constrainTo>
    </point>
    </graph>
    <graph name="g2">
      <parabola extend="$p" name="p2" />
      <point extend="$A" name="A2" />
    </graph>
    <graph extend="$g2" name="g3" />
    `,
        });

        let f_p = (x) => -((x - 1) ** 2 + 2);

        async function check_items(xMin: number, xMax: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const [x1, x2] = stateVariables[
                await resolvePathToNodeIdx("A")
            ].stateValues.xs.map((v) => v.tree);
            const [x12, x22] = stateVariables[
                await resolvePathToNodeIdx("A2")
            ].stateValues.xs.map((v) => v.tree);
            const [x13, x23] = stateVariables[
                await resolvePathToNodeIdx("g3.A2")
            ].stateValues.xs.map((v) => v.tree);
            expect(x1).greaterThan(xMin).lessThan(xMax);
            expect(x2).closeTo(f_p(x1), 1e-14);
            expect(x12).eq(x1);
            expect(x13).eq(x1);
            expect(x22).eq(x2);
            expect(x23).eq(x2);
        }

        await check_items(0, 1);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: 9,
            y: 2,
            core,
        });
        await check_items(0, 9);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A2"),
            x: -9,
            y: -4,
            core,
        });
        await check_items(-9, 0);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g3.A2"),
            x: 0.9,
            y: -9,
            core,
        });
        await check_items(-10, 0.9);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g3.A2"),
            x: 1.1,
            y: -9,
            core,
        });
        await check_items(1.11, 10);
    });

    it("constrain to parabola that is a line", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <parabola through="(1,2) (3,3) (5, 4)" name="p" />
    <point x="0" y="0" name="A">
        <constrainTo>$p</constrainTo>
    </point>
    </graph>
    <graph name="g2">
      <parabola extend="$p" name="p2" />
      <point extend="$A" name="A2" />
    </graph>
    <graph extend="$g2" name="g3" />
    `,
        });

        let f_p = (x) => 0.5 * x + 1.5;

        async function check_items(x: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const [x1, x2] = stateVariables[
                await resolvePathToNodeIdx("A")
            ].stateValues.xs.map((v) => v.tree);
            const [x12, x22] = stateVariables[
                await resolvePathToNodeIdx("A2")
            ].stateValues.xs.map((v) => v.tree);
            const [x13, x23] = stateVariables[
                await resolvePathToNodeIdx("g3.A2")
            ].stateValues.xs.map((v) => v.tree);
            expect(x1).closeTo(x, 1e-14);
            expect(x2).closeTo(f_p(x1), 1e-14);
            expect(x12).eq(x1);
            expect(x13).eq(x1);
            expect(x22).eq(x2);
            expect(x23).eq(x2);
        }

        await check_items(1.5 / -2.5);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: 9,
            y: -2,
            core,
        });
        await check_items((1.5 - 2 * 9 + 2) / -2.5);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A2"),
            x: -9,
            y: 4,
            core,
        });
        await check_items((1.5 + 2 * 9 - 4) / -2.5);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g3.A2"),
            x: 0.9,
            y: 9,
            core,
        });
        await check_items((1.5 - 2 * 0.9 - 9) / -2.5);
    });

    it("constrain to parabola opening downward, different axis scales", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph ymin="-1000" ymax="1000">
    <parabola through="(1,-200) (2,-300) (0,-300)" name="p" />
    <point x="0" y="0" name="A">
        <constrainTo relativeToGraphScales>$p</constrainTo>
    </point>
    </graph>
    <graph name="g2" ymin="-1000" ymax="1000">
      <parabola extend="$p" name="p2" />
      <point extend="$A" name="A2" />
    </graph>
    <graph extend="$g2" name="g3" ymin="-1000" ymax="1000" />
    `,
        });

        let f_p = (x) => -100 * ((x - 1) ** 2 + 2);

        async function check_items(xMin: number, xMax: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            const [x1, x2] = stateVariables[
                await resolvePathToNodeIdx("A")
            ].stateValues.xs.map((v) => v.tree);
            const [x12, x22] = stateVariables[
                await resolvePathToNodeIdx("A2")
            ].stateValues.xs.map((v) => v.tree);
            const [x13, x23] = stateVariables[
                await resolvePathToNodeIdx("g3.A2")
            ].stateValues.xs.map((v) => v.tree);
            expect(x1).greaterThan(xMin).lessThan(xMax);
            expect(x2).closeTo(f_p(x1), 1e-12);
            expect(x12).eq(x1);
            expect(x13).eq(x1);
            expect(x22).eq(x2);
            expect(x23).eq(x2);
        }

        await check_items(0, 1);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: 9,
            y: 200,
            core,
        });
        await check_items(0, 9);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A2"),
            x: -9,
            y: -400,
            core,
        });
        await check_items(-9, 0);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g3.A2"),
            x: 0.9,
            y: -900,
            core,
        });
        await check_items(-10, 0.9);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("g3.A2"),
            x: 1.1,
            y: -900,
            core,
        });
        await check_items(1.11, 10);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A"),
            x: 9,
            y: 0,
            core,
        });
        await check_items(2, 10);

        await movePoint({
            componentIdx: await resolvePathToNodeIdx("A2"),
            x: -9,
            y: 100,
            core,
        });
        await check_items(-10, 0);
    });

    it("copy parabola and overwrite parameters", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g1">
    <parabola name="p0" />
    <parabola extend="$p0" vertex="(3,4)" name="p1" />
    <parabola extend="$p1" through="(5,-4)" name="p2" />
    <parabola extend="$p0" through="(-5,-2)" name="p3" />
    <parabola extend="$p3" vertex="(-6,6)" name="p4" />
    </graph>

    <graph extend="$g1" name="g2" />

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("g1.p0")].stateValues.a,
        ).closeTo(1, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g1.p0")].stateValues.b,
        ).closeTo(0, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g1.p0")].stateValues.c,
        ).closeTo(0, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.p0")].stateValues.a,
        ).closeTo(1, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.p0")].stateValues.b,
        ).closeTo(0, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.p0")].stateValues.c,
        ).closeTo(0, 1e-12);

        expect(
            stateVariables[await resolvePathToNodeIdx("g1.p1")].stateValues.a,
        ).closeTo(1, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g1.p1")].stateValues.b,
        ).closeTo(-6, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g1.p1")].stateValues.c,
        ).closeTo(13, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.p1")].stateValues.a,
        ).closeTo(1, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.p1")].stateValues.b,
        ).closeTo(-6, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.p1")].stateValues.c,
        ).closeTo(13, 1e-12);

        expect(
            stateVariables[await resolvePathToNodeIdx("g1.p2")].stateValues.a,
        ).closeTo(-2, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g1.p2")].stateValues.b,
        ).closeTo(12, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g1.p2")].stateValues.c,
        ).closeTo(-14, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.p2")].stateValues.a,
        ).closeTo(-2, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.p2")].stateValues.b,
        ).closeTo(12, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.p2")].stateValues.c,
        ).closeTo(-14, 1e-12);

        expect(
            stateVariables[await resolvePathToNodeIdx("g1.p3")].stateValues.a,
        ).closeTo(1, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g1.p3")].stateValues.b,
        ).closeTo(10, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g1.p3")].stateValues.c,
        ).closeTo(23, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.p3")].stateValues.a,
        ).closeTo(1, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.p3")].stateValues.b,
        ).closeTo(10, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.p3")].stateValues.c,
        ).closeTo(23, 1e-12);

        expect(
            stateVariables[await resolvePathToNodeIdx("g1.p4")].stateValues.a,
        ).closeTo(-8, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g1.p4")].stateValues.b,
        ).closeTo(-96, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g1.p4")].stateValues.c,
        ).closeTo(-282, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.p4")].stateValues.a,
        ).closeTo(-8, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.p4")].stateValues.b,
        ).closeTo(-96, 1e-12);
        expect(
            stateVariables[await resolvePathToNodeIdx("g2.p4")].stateValues.c,
        ).closeTo(-282, 1e-12);
    });

    it("copy propIndex of points, dot and array notation", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
      <parabola through="(2,-3) (3,4) (-3,4)" name="p" />
    </graph>
 
    <p><mathInput name="n" /></p>

    <p><pointList extend="$p.throughPoints[$n]" name="Ps" /></p>

    <p><mathList extend="$p.throughPoint2[$n]" name="x" /></p>

    <p><mathList extend="$p.throughPoints[2][$n]" name="xa" /></p>
    `,
        });

        let t1x = 2,
            t1y = -3;
        let t2x = 3,
            t2y = 4;
        let t3x = -3,
            t3y = 4;

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[await resolvePathToNodeIdx("Ps[1]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("Ps[2]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("Ps[3]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("x[1]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("xa[1]")]).eq(
            undefined,
        );

        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("Ps[1]")
            ].stateValues.xs.map((v) => v.tree),
        ).eqls([t1x, t1y]);
        expect(stateVariables[await resolvePathToNodeIdx("Ps[2]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("Ps[3]")]).eq(
            undefined,
        );
        expect(
            stateVariables[await resolvePathToNodeIdx("x[1]")].stateValues.value
                .tree,
        ).eq(t2x);
        expect(
            stateVariables[await resolvePathToNodeIdx("xa[1]")].stateValues
                .value.tree,
        ).eq(t2x);

        await updateMathInputValue({
            latex: "2",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("Ps[1]")
            ].stateValues.xs.map((v) => v.tree),
        ).eqls([t2x, t2y]);
        expect(stateVariables[await resolvePathToNodeIdx("Ps[2]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("Ps[3]")]).eq(
            undefined,
        );
        expect(
            stateVariables[await resolvePathToNodeIdx("x[1]")].stateValues.value
                .tree,
        ).eq(t2y);
        expect(
            stateVariables[await resolvePathToNodeIdx("xa[1]")].stateValues
                .value.tree,
        ).eq(t2y);

        await updateMathInputValue({
            latex: "3",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("Ps[1]")
            ].stateValues.xs.map((v) => v.tree),
        ).eqls([t3x, t3y]);
        expect(stateVariables[await resolvePathToNodeIdx("Ps[2]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("Ps[3]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("x[1]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("xa[1]")]).eq(
            undefined,
        );

        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });
        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables[await resolvePathToNodeIdx("Ps[1]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("Ps[2]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("Ps[3]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("x[1]")]).eq(
            undefined,
        );
        expect(stateVariables[await resolvePathToNodeIdx("xa[1]")]).eq(
            undefined,
        );
    });
});
