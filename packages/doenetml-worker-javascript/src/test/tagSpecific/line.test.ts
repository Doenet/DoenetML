import { describe, expect, it, vi } from "vitest";
import { createTestCore } from "../utils/test-core";
import {
    moveLine,
    movePoint,
    updateBooleanInputValue,
    updateMathInputValue,
    updateSelectedIndices,
    updateTextInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";
import me from "math-expressions";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function setupScene({
    lineProperties = "",
    lineChildren = "",
    additionalComponents = "",
}: {
    lineProperties?: string;
    lineChildren?: string;
    additionalComponents?: string;
}) {
    let core = await createTestCore({
        doenetML:
            `
  <graph>
    <line name="l" ` +
            lineProperties +
            `>
    ` +
            lineChildren +
            `
    </line>
    $l.points{assignNames="P1 P2"}
  </graph>

   ` +
            additionalComponents +
            `
  <graph name="g2" newNamespace>
    $(../l{name="l"})
    $l.points{assignNames="P1 P2"}
  </graph>
  
  $g2{name="g3"}
  `,
    });

    return core;
}

async function runPointBasedTests({
    core,
    points,
    definingPointNames = [],
    label,
    basedOnSlope = false,
    basedOnParallel = false,
    parallelPointNames = [],
    basedOnPerpendicular = false,
    perpendicularPointNames = [],
    copiedBasedOnEquation = false,
}: {
    core: PublicDoenetMLCore;
    points: number[][];
    definingPointNames?: string[];
    label?: string;
    basedOnSlope?: boolean;
    basedOnParallel?: boolean;
    parallelPointNames?: string[];
    basedOnPerpendicular?: boolean;
    perpendicularPointNames?: string[];
    copiedBasedOnEquation?: boolean;
}) {
    let names = [
        ["/l", "/P1", "/P2"],
        ["/g2/l", "/g2/P1", "/g2/P2"],
        ["/g3/l", "/g3/P1", "/g3/P2"],
    ];

    await checkAllLineValues({
        names,
        points,
        definingPointNames,
        copiedBasedOnEquation,
        label,
        core,
    });

    let point1Names = names.map((v) => v[1]);
    if (definingPointNames.length > 0) {
        point1Names.push(definingPointNames[0]);
    }

    let point2Names = names.map((v) => v[2]);
    if (definingPointNames.length > 1) {
        point2Names.push(definingPointNames[1]);
    }

    for (let ind = 0; ind < 7; ind++) {
        // move point 1
        let P1Name = point1Names[ind % point1Names.length];
        let dx = 4 * ind - 3 - points[0][0];
        let dy = 10 - 3 * ind - points[0][1];
        points[0][0] += dx;
        points[0][1] += dy;
        if (basedOnSlope || basedOnParallel || basedOnPerpendicular) {
            // if based on slope/parallel/perpendicular, line will translate when change point 1
            points[1][0] += dx;
            points[1][1] += dy;
        }
        await movePoint({
            name: P1Name,
            x: points[0][0],
            y: points[0][1],
            core,
        });
        await checkAllLineValues({
            names,
            points,
            definingPointNames,
            copiedBasedOnEquation,
            core,
        });

        // move point2
        let P2Name = point2Names[ind % point2Names.length];
        if (ind === 0) {
            // slope is Infinity
            points[1] = [points[0][0], points[0][1] + 5];
        } else if (ind === 1) {
            // slope is -Infinity
            points[1] = [points[0][0], points[0][1] - 6];
        } else if (ind === 2) {
            // points on top of each other
            points[1] = [...points[0]];
        } else {
            points[1] = [-5 * ind - 2, 3 + 4 * ind];
        }
        await movePoint({
            name: P2Name,
            x: points[1][0],
            y: points[1][1],
            core,
        });
        await checkAllLineValues({
            names,
            points,
            definingPointNames,
            copiedBasedOnEquation,
            core,
        });

        if (basedOnSlope) {
            // change slope directly
            let slope = ind - 3;
            let slopeLatex = `${slope}`;
            if (ind === 4) {
                slope = Infinity;
                slopeLatex = "\\infty";
            } else if (ind === 5) {
                slope = -Infinity;
                slopeLatex = "-\\infty";
            }

            await updateMathInputValue({
                latex: slopeLatex,
                name: "/slope",
                core,
            });

            let dx = points[1][0] - points[0][0];
            let dy = points[1][1] - points[0][1];
            let d = Math.sqrt(dx * dx + dy * dy);
            let theta = Math.atan(slope);
            if (dx < 0) {
                theta += Math.PI;
            }
            points[1][0] = points[0][0] + d * Math.cos(theta);
            points[1][1] = points[0][1] + d * Math.sin(theta);

            if (slope === -Infinity || slope === Infinity) {
                points[1][0] = points[0][0];
            } else if (slope === 0) {
                points[1][1] = points[0][1];
            }

            await checkAllLineValues({
                names,
                points,
                definingPointNames,
                copiedBasedOnEquation,
                core,
            });
        } else if (basedOnParallel) {
            // change parallelTo directly
            let parallelTo = [
                [-4, 2],
                [3, 1],
                [-8, -17],
                [-5, 0],
                [0, 6],
                [0, -9],
                [7, -3],
            ][ind];

            let parallelToP1 = parallelTo;
            if (parallelPointNames.length === 2) {
                parallelToP1 = [3 * ind - 5, 10 - ind ** 2];
                let parallelToP2 = [
                    parallelToP1[0] + parallelTo[0],
                    parallelToP1[1] + parallelTo[1],
                ];
                await movePoint({
                    name: parallelPointNames[1],
                    x: parallelToP2[0],
                    y: parallelToP2[1],
                    core,
                });
            }

            await movePoint({
                name: parallelPointNames[0],
                x: parallelToP1[0],
                y: parallelToP1[1],
                core,
            });

            let dPar = Math.sqrt(parallelTo[0] ** 2 + parallelTo[1] ** 2);

            let dx = points[1][0] - points[0][0];
            let dy = points[1][1] - points[0][1];
            let d = Math.sqrt(dx * dx + dy * dy);

            points[1][0] = points[0][0] + (d * parallelTo[0]) / dPar;
            points[1][1] = points[0][1] + (d * parallelTo[1]) / dPar;

            await checkAllLineValues({
                names,
                points,
                definingPointNames,
                copiedBasedOnEquation,
                core,
            });
        } else if (basedOnPerpendicular) {
            // change perpendicularTo directly
            let perpendicularTo = [
                [-4, 2],
                [3, 1],
                [-8, -17],
                [0, -5],
                [6, 0],
                [-9, 0],
                [7, -3],
            ][ind];

            let perpendicularToP1 = perpendicularTo;
            if (perpendicularPointNames.length === 2) {
                perpendicularToP1 = [3 * ind - 5, 10 - ind ** 2];
                let perpendicularToP2 = [
                    perpendicularToP1[0] + perpendicularTo[0],
                    perpendicularToP1[1] + perpendicularTo[1],
                ];
                await movePoint({
                    name: perpendicularPointNames[1],
                    x: perpendicularToP2[0],
                    y: perpendicularToP2[1],
                    core,
                });
            }

            await movePoint({
                name: perpendicularPointNames[0],
                x: perpendicularToP1[0],
                y: perpendicularToP1[1],
                core,
            });

            let dPerp = Math.sqrt(
                perpendicularTo[0] ** 2 + perpendicularTo[1] ** 2,
            );

            let dx = points[1][0] - points[0][0];
            let dy = points[1][1] - points[0][1];
            let d = Math.sqrt(dx * dx + dy * dy);

            points[1][0] = points[0][0] + (d * perpendicularTo[1]) / dPerp;
            points[1][1] = points[0][1] - (d * perpendicularTo[0]) / dPerp;

            await checkAllLineValues({
                names,
                points,
                definingPointNames,
                copiedBasedOnEquation,
                core,
            });
        }
    }

    // move line
    for (let [ind, nameObj] of names.entries()) {
        if (copiedBasedOnEquation && ind > 0) {
            break;
        }

        let lName = nameObj[0];

        let dx = ind ** 2 - points[0][0];
        let dy = 16 - Math.sqrt(ind) - points[0][1];
        points[0][0] += dx;
        points[0][1] += dy;
        let point2Instructions = [Math.log(ind + 1) - 1, 2 ** ind - 3];
        if (basedOnSlope || basedOnParallel || basedOnPerpendicular) {
            // if based on slope, it will translate line, ignoring point 2 coords
            points[1][0] += dx;
            points[1][1] += dy;
        } else {
            points[1] = point2Instructions;
        }
        await moveLine({
            name: lName,
            point1coords: points[0],
            point2coords: point2Instructions,
            core,
        });

        await checkAllLineValues({
            names,
            points,
            definingPointNames,
            copiedBasedOnEquation,
            core,
        });
    }
}

async function checkAllLineValues({
    names,
    points,
    definingPointNames = [],
    copiedBasedOnEquation = false,
    label,
    core,
}: {
    names: string[][];
    points: number[][];
    definingPointNames?: string[];
    copiedBasedOnEquation?: boolean;
    label?: string;
    core: PublicDoenetMLCore;
}) {
    let slope = (points[1][1] - points[0][1]) / (points[1][0] - points[0][0]);
    let xintercept = points[0][0] - points[0][1] / slope;
    let yintercept = points[0][1] - slope * points[0][0];

    for (let [ind, nameObj] of names.entries()) {
        await checkLineValues({
            name: nameObj[0],
            P1Name: nameObj[1],
            P2Name: nameObj[2],
            points,
            slope,
            xintercept,
            yintercept,
            basedOnEquation: copiedBasedOnEquation && ind > 0,
            label,
            core,
        });
    }

    const stateVariables = await core.returnAllStateVariables(false, true);
    for (let [ind, pointName] of definingPointNames.entries()) {
        expect(
            stateVariables[pointName].stateValues.xs.map((v) => v.tree),
        ).eqls(points[ind]);
    }
}

async function checkLineValues({
    name,
    P1Name,
    P2Name,
    points,
    label,
    slope,
    xintercept,
    yintercept,
    basedOnEquation,
    core,
}: {
    name: string;
    P1Name: string;
    P2Name: string;
    points: number[][];
    slope: number;
    xintercept: number;
    yintercept: number;
    basedOnEquation: boolean;
    label?: string;
    core: PublicDoenetMLCore;
}) {
    const stateVariables = await core.returnAllStateVariables(false, true);

    let linePoints = stateVariables[name].stateValues.points;
    let P1xs = stateVariables[P1Name].stateValues.xs;
    let P2xs = stateVariables[P2Name].stateValues.xs;
    let lineSlope = stateVariables[name].stateValues.slope;
    let lineXintercept = stateVariables[name].stateValues.xintercept;
    let lineYintercept = stateVariables[name].stateValues.yintercept;

    for (let i = 0; i < 2; i++) {
        if (!basedOnEquation) {
            for (let j = 0; j < 2; j++) {
                expect(linePoints[i][j].evaluate_to_constant()).closeTo(
                    points[i][j],
                    1e-12,
                );
            }
        }
        expect(P1xs[i].evaluate_to_constant()).closeTo(points[0][i], 1e-12);
        expect(P2xs[i].evaluate_to_constant()).closeTo(points[1][i], 1e-12);
    }
    if (Number.isFinite(slope)) {
        expect(lineSlope.evaluate_to_constant()).closeTo(slope, 1e-12);
    } else {
        expect(lineSlope.evaluate_to_constant()).eqls(slope);
    }
    if (Number.isFinite(xintercept)) {
        expect(lineXintercept.evaluate_to_constant()).closeTo(
            xintercept,
            1e-12,
        );
    } else {
        // Note: x-intercept for horizontal lines can be Infinity or -Infinity
        // when it should really be NaN
        expect(Math.abs(lineXintercept.evaluate_to_constant())).eqls(
            Math.abs(xintercept),
        );
    }
    if (Number.isFinite(yintercept)) {
        expect(lineYintercept.evaluate_to_constant()).closeTo(
            yintercept,
            1e-12,
        );
    } else {
        // Note: y-intercept for vertical lines can be Infinity or -Infinity
        // when it should really be NaN
        expect(Math.abs(lineYintercept.evaluate_to_constant())).eqls(
            Math.abs(yintercept),
        );
    }

    if (label) {
        expect(stateVariables[name].stateValues.label).eq(label);
    }
}

async function runEquationBasedTests({
    core,
    coeff0,
    coeffvar1,
    coeffvar2,
    label,
    cantMove = false,
    variables = ["x", "y"],
    equationInput,
}: {
    core: PublicDoenetMLCore;
    coeff0: number;
    coeffvar1: number;
    coeffvar2: number;
    label?: string;
    cantMove?: boolean;
    variables?: string[];
    equationInput?: string;
}) {
    let names = ["/l", "/g2/l", "/g3/l"];

    await checkAllLineEquations({
        names,
        coeff0,
        coeffvar1,
        coeffvar2,
        variables,
        label,
        core,
    });

    let stateVariables = await core.returnAllStateVariables(false, true);
    let point1 = [...stateVariables[names[0]].stateValues.points[0]];
    let point2 = [...stateVariables[names[0]].stateValues.points[1]];

    // move line
    for (let [ind, name] of names.entries()) {
        let moveX = 3 * ind - 2;
        let moveY = 5 - 2 * ind ** 2;

        point1 = [
            point1[0].add(moveX).simplify(),
            point1[1].add(moveY).simplify(),
        ];

        point2 = [
            point2[0].add(moveX).simplify(),
            point2[1].add(moveY).simplify(),
        ];

        await moveLine({
            name,
            point1coords: point1.map((v) => v.tree),
            point2coords: point2.map((v) => v.tree),
            core,
        });

        if (!cantMove) {
            coeff0 -= coeffvar1 * moveX + coeffvar2 * moveY;
        }

        await checkAllLineEquations({
            names,
            coeff0,
            coeffvar1,
            coeffvar2,
            variables,
            core,
        });
    }

    if (equationInput) {
        // change equation via math input
        coeff0 = 5;
        coeffvar1 = -7;
        coeffvar2 = 10;
        await updateMathInputValue({
            latex: `${coeffvar1}${variables[0]} + ${coeffvar2}${variables[1]} + ${coeff0} = 0`,
            name: equationInput,
            core,
        });

        await checkAllLineEquations({
            names,
            coeff0,
            coeffvar1,
            coeffvar2,
            variables,
            core,
        });
    }
}

async function checkAllLineEquations({
    names,
    coeff0,
    coeffvar1,
    coeffvar2,
    variables,
    label,
    core,
}: {
    names: string[];
    coeff0: number;
    coeffvar1: number;
    coeffvar2: number;
    variables: string[];
    label?: string;
    core: PublicDoenetMLCore;
}) {
    const equation = me.fromAst([
        "=",
        [
            "+",
            ["*", coeffvar1, variables[0]],
            ["*", coeffvar2, variables[1]],
            coeff0,
        ],
        0,
    ]);
    const slope = -coeffvar1 / coeffvar2;
    const xintercept = -coeff0 / coeffvar1;
    const yintercept = -coeff0 / coeffvar2;

    for (let name of names) {
        await checkLineEquations({
            name,
            coeff0,
            coeffvar1,
            coeffvar2,
            equation,
            slope,
            xintercept,
            yintercept,
            variables,
            label,
            core,
        });
    }
}

async function checkLineEquations({
    name,
    coeff0,
    coeffvar1,
    coeffvar2,
    equation,
    slope,
    xintercept,
    yintercept,
    variables,
    label,
    core,
}: {
    name: string;
    coeff0: number;
    coeffvar1: number;
    coeffvar2: number;
    equation: any;
    slope: number;
    xintercept: number;
    yintercept: number;
    variables: string[];
    label?: string;
    core: PublicDoenetMLCore;
}) {
    const stateVariables = await core.returnAllStateVariables(false, true);
    const line = stateVariables[name].stateValues;

    expect(line.coeff0.evaluate_to_constant()).closeTo(coeff0, 1e-12);
    expect(line.coeffvar1.evaluate_to_constant()).closeTo(coeffvar1, 1e-12);
    expect(line.coeffvar2.evaluate_to_constant()).closeTo(coeffvar2, 1e-12);
    expect(line.equation.equals(equation)).to.be.true;
    expect(line.slope.evaluate_to_constant()).closeTo(slope, 1e-12);
    expect(line.xintercept.evaluate_to_constant()).closeTo(xintercept, 1e-12);
    expect(line.yintercept.evaluate_to_constant()).closeTo(yintercept, 1e-12);
    expect(line.variables.map((v) => v.tree)).eqls(variables);

    if (label) {
        expect(line.label).eq(label);
    }
}

describe("Line tag tests", async () => {
    it("line with no arguments", async () => {
        let core = await setupScene({});

        let points = [
            [1, 0],
            [0, 0],
        ];

        await runPointBasedTests({ core, points });
    });

    it("line with empty through", async () => {
        let core = await setupScene({ lineProperties: `through=""` });

        let points = [
            [1, 0],
            [0, 0],
        ];

        await runPointBasedTests({ core, points });
    });

    it("through string points, label child", async () => {
        let core = await setupScene({
            lineProperties: `through="(1,2) (4,7)"`,
            lineChildren: `<label>l</label>`,
        });

        let points = [
            [1, 2],
            [4, 7],
        ];

        await runPointBasedTests({ core, points, label: "l" });
    });

    it("through points from strings and maths, labelIsName", async () => {
        let core = await setupScene({
            lineProperties: `through="($m1,$m2) (4,7)" labelIsName`,
            additionalComponents: `<math name="m1">1</math><math name="m2">2</math>`,
        });

        let points = [
            [1, 2],
            [4, 7],
        ];

        await runPointBasedTests({ core, points, label: "l" });
    });

    it("through maths for points, label child", async () => {
        let core = await setupScene({
            lineProperties: `through="$m1 $m2"`,
            lineChildren: `<label>m</label>`,
            additionalComponents: `<math name="m1">(1,2)</math><math name="m2">(4,7)</math>`,
        });

        let points = [
            [1, 2],
            [4, 7],
        ];

        await runPointBasedTests({ core, points, label: "m" });
    });

    it("through two points", async () => {
        let core = await setupScene({
            lineProperties: `through="$dp1 $dp2"`,
            additionalComponents: `<point name="dp1">(1,2)</point><point name="dp2">(4,7)</point>`,
        });

        let points = [
            [1, 2],
            [4, 7],
        ];
        let definingPointNames = ["/dp1", "/dp2"];

        await runPointBasedTests({ core, points, definingPointNames });
    });

    it("through one point", async () => {
        let core = await setupScene({
            lineProperties: `through="$dp1"`,
            additionalComponents: `<point name="dp1">(1,2)</point>`,
        });

        let points = [
            [1, 2],
            [0, 0],
        ];

        let definingPointNames = ["/dp1"];

        await runPointBasedTests({ core, points, definingPointNames });
    });

    it("through one point - the origin", async () => {
        let core = await setupScene({
            lineProperties: `through="$dp1"`,
            additionalComponents: `<point name="dp1">(0,0)</point>`,
        });

        let points = [
            [0, 0],
            [0, 0],
        ];
        let definingPointNames = ["/dp1"];

        await runPointBasedTests({ core, points, definingPointNames });
    });

    it("through one point and given slope", async () => {
        let core = await setupScene({
            lineProperties: `through="$dp1" slope="$slope"`,
            additionalComponents: `
    <point name="dp1">(1,2)</point>
    <mathInput name="slope" prefill="1" />`,
        });

        let points = [
            [1, 2],
            [1 + 1 / Math.sqrt(2), 2 + 1 / Math.sqrt(2)],
        ];

        let definingPointNames = ["/dp1"];

        await runPointBasedTests({
            core,
            points,
            definingPointNames,
            basedOnSlope: true,
        });
    });

    it("with just slope", async () => {
        let core = await setupScene({
            lineProperties: `slope="$slope"`,
            additionalComponents: `
    <mathInput name="slope" prefill="1" />`,
        });

        let points = [
            [0, 0],
            [1 / Math.sqrt(2), 1 / Math.sqrt(2)],
        ];

        await runPointBasedTests({
            core,
            points,
            basedOnSlope: true,
        });
    });

    it("through point and parallel to expression", async () => {
        let core = await setupScene({
            lineProperties: `through="$dp1" parallelTo="$parallelTo"`,
            additionalComponents: `
    <point name="dp1">(1,2)</point>
    <point name="pPar1">(1,1)</point>
    <math name="parallelTo">($pPar1.x, $pPar1.y)</math>`,
        });

        let points = [
            [1, 2],
            [1 + 1 / Math.sqrt(2), 2 + 1 / Math.sqrt(2)],
        ];

        let definingPointNames = ["/dp1"];
        let parallelPointNames = ["/pPar1"];
        await runPointBasedTests({
            core,
            points,
            definingPointNames,
            basedOnParallel: true,
            parallelPointNames,
        });
    });

    it("through point and parallel to another line", async () => {
        let core = await setupScene({
            lineProperties: `through="$dp1" parallelTo="$parallelTo"`,
            additionalComponents: `
    <point name="dp1">(1,2)</point>
    <point name="pPar1">(3,4)</point>
    <point name="pPar2">(4,5)</point>
    <line name="parallelTo" through="$pPar1 $pPar2" />`,
        });

        let points = [
            [1, 2],
            [1 + 1 / Math.sqrt(2), 2 + 1 / Math.sqrt(2)],
        ];

        let definingPointNames = ["/dp1"];
        let parallelPointNames = ["/pPar1", "/pPar2"];
        await runPointBasedTests({
            core,
            points,
            definingPointNames,
            basedOnParallel: true,
            parallelPointNames,
        });
    });

    it("through point and parallel to line segment", async () => {
        let core = await setupScene({
            lineProperties: `through="$dp1" parallelTo="$parallelTo"`,
            additionalComponents: `
    <point name="dp1">(1,2)</point>
    <point name="pPar1">(3,4)</point>
    <point name="pPar2">(4,5)</point>
    <lineSegment name="parallelTo" endpoints="$pPar1 $pPar2" />`,
        });

        let points = [
            [1, 2],
            [1 + 1 / Math.sqrt(2), 2 + 1 / Math.sqrt(2)],
        ];

        let definingPointNames = ["/dp1"];
        let parallelPointNames = ["/pPar1", "/pPar2"];
        await runPointBasedTests({
            core,
            points,
            definingPointNames,
            basedOnParallel: true,
            parallelPointNames,
        });
    });

    it("through point and parallel to vector", async () => {
        let core = await setupScene({
            lineProperties: `through="$dp1" parallelTo="$parallelTo"`,
            additionalComponents: `
    <point name="dp1">(1,2)</point>
    <point name="pPar1">(3,4)</point>
    <point name="pPar2">(4,5)</point>
    <vector name="parallelTo" tail="$pPar1" head="$pPar2" />`,
        });

        let points = [
            [1, 2],
            [1 + 1 / Math.sqrt(2), 2 + 1 / Math.sqrt(2)],
        ];

        let definingPointNames = ["/dp1"];
        let parallelPointNames = ["/pPar1", "/pPar2"];
        await runPointBasedTests({
            core,
            points,
            definingPointNames,
            basedOnParallel: true,
            parallelPointNames,
        });
    });

    it("through point and parallel to ray", async () => {
        let core = await setupScene({
            lineProperties: `through="$dp1" parallelTo="$parallelTo"`,
            additionalComponents: `
    <point name="dp1">(1,2)</point>
    <point name="pPar1">(3,4)</point>
    <point name="pPar2">(4,5)</point>
    <ray name="parallelTo" endpoint="$pPar1" through="$pPar2" />`,
        });

        let points = [
            [1, 2],
            [1 + 1 / Math.sqrt(2), 2 + 1 / Math.sqrt(2)],
        ];

        let definingPointNames = ["/dp1"];
        let parallelPointNames = ["/pPar1", "/pPar2"];
        await runPointBasedTests({
            core,
            points,
            definingPointNames,
            basedOnParallel: true,
            parallelPointNames,
        });
    });

    it("just parallel to expression", async () => {
        let core = await setupScene({
            lineProperties: `parallelTo="$parallelTo"`,
            additionalComponents: `
    <point name="pPar1">(1,1)</point>
    <math name="parallelTo">($pPar1.x, $pPar1.y)</math>`,
        });

        let points = [
            [0, 0],
            [1 / Math.sqrt(2), 1 / Math.sqrt(2)],
        ];

        let parallelPointNames = ["/pPar1"];

        await runPointBasedTests({
            core,
            points,
            basedOnParallel: true,
            parallelPointNames,
        });
    });

    it("through point and perpendicular to expression", async () => {
        let core = await setupScene({
            lineProperties: `through="$dp1" perpendicularTo="$perpendicularTo"`,
            additionalComponents: `
    <point name="dp1">(1,2)</point>
    <point name="pPerp1">(-1,1)</point>
    <math name="perpendicularTo">($pPerp1.x, $pPerp1.y)</math>`,
        });

        let points = [
            [1, 2],
            [1 + 1 / Math.sqrt(2), 2 + 1 / Math.sqrt(2)],
        ];

        let definingPointNames = ["/dp1"];
        let perpendicularPointNames = ["/pPerp1"];

        await runPointBasedTests({
            core,
            points,
            definingPointNames,
            basedOnPerpendicular: true,
            perpendicularPointNames,
        });
    });

    it("through point and perpendicular to another line", async () => {
        let core = await setupScene({
            lineProperties: `through="$dp1" perpendicularTo="$perpendicularTo"`,
            additionalComponents: `
    <point name="dp1">(1,2)</point>
    <point name="pPerp1">(3,4)</point>
    <point name="pPerp2">(2,5)</point>
    <line name="perpendicularTo" through="$pPerp1 $pPerp2" />`,
        });

        let points = [
            [1, 2],
            [1 + 1 / Math.sqrt(2), 2 + 1 / Math.sqrt(2)],
        ];

        let definingPointNames = ["/dp1"];
        let perpendicularPointNames = ["/pPerp1", "/pPerp2"];

        await runPointBasedTests({
            core,
            points,
            definingPointNames,
            basedOnPerpendicular: true,
            perpendicularPointNames,
        });
    });

    it("through point and perpendicular to line segment", async () => {
        let core = await setupScene({
            lineProperties: `through="$dp1" perpendicularTo="$perpendicularTo"`,
            additionalComponents: `
    <point name="dp1">(1,2)</point>
    <point name="pPerp1">(3,4)</point>
    <point name="pPerp2">(2,5)</point>
    <lineSegment name="perpendicularTo" endpoints="$pPerp1 $pPerp2" />`,
        });

        let points = [
            [1, 2],
            [1 + 1 / Math.sqrt(2), 2 + 1 / Math.sqrt(2)],
        ];

        let definingPointNames = ["/dp1"];
        let perpendicularPointNames = ["/pPerp1", "/pPerp2"];

        await runPointBasedTests({
            core,
            points,
            definingPointNames,
            basedOnPerpendicular: true,
            perpendicularPointNames,
        });
    });

    it("through point and perpendicular to vector", async () => {
        let core = await setupScene({
            lineProperties: `through="$dp1" perpendicularTo="$perpendicularTo"`,
            additionalComponents: `
    <point name="dp1">(1,2)</point>
    <point name="pPerp1">(3,4)</point>
    <point name="pPerp2">(2,5)</point>
    <vector name="perpendicularTo" tail="$pPerp1" head="$pPerp2" />`,
        });

        let points = [
            [1, 2],
            [1 + 1 / Math.sqrt(2), 2 + 1 / Math.sqrt(2)],
        ];

        let definingPointNames = ["/dp1"];
        let perpendicularPointNames = ["/pPerp1", "/pPerp2"];

        await runPointBasedTests({
            core,
            points,
            definingPointNames,
            basedOnPerpendicular: true,
            perpendicularPointNames,
        });
    });

    it("through point and perpendicular to ray", async () => {
        let core = await setupScene({
            lineProperties: `through="$dp1" perpendicularTo="$perpendicularTo"`,
            additionalComponents: `
    <point name="dp1">(1,2)</point>
    <point name="pPerp1">(3,4)</point>
    <point name="pPerp2">(2,5)</point>
    <ray name="perpendicularTo" endpoint="$pPerp1" through="$pPerp2" />`,
        });

        let points = [
            [1, 2],
            [1 + 1 / Math.sqrt(2), 2 + 1 / Math.sqrt(2)],
        ];

        let definingPointNames = ["/dp1"];
        let perpendicularPointNames = ["/pPerp1", "/pPerp2"];

        await runPointBasedTests({
            core,
            points,
            definingPointNames,
            basedOnPerpendicular: true,
            perpendicularPointNames,
        });
    });

    it("just perpendicular to expression", async () => {
        let core = await setupScene({
            lineProperties: `perpendicularTo="$perpendicularTo"`,
            additionalComponents: `
    <point name="pPerp1">(-1,1)</point>
    <math name="perpendicularTo">($pPerp1.x, $pPerp1.y)</math>`,
        });

        let points = [
            [0, 0],
            [1 / Math.sqrt(2), 1 / Math.sqrt(2)],
        ];

        let perpendicularPointNames = ["/pPerp1"];

        await runPointBasedTests({
            core,
            points,
            basedOnPerpendicular: true,
            perpendicularPointNames,
        });
    });

    it("new line from copied points of line", async () => {
        let core = await createTestCore({
            doenetML: `
      <graph>
        <point name="dp1">(1,2)</point>
        <point name="dp2">(4,7)</point>
        <line name="l" through="$dp1 $dp2" />
        $l.points{assignNames="P1 P2"}
      </graph>
      <graph name="g2" newNamespace>
        <line name="l" through="$(../l.points)" />
        $l.points{assignNames="P1 P2"}
      </graph>
      
      $g2{name="g3"}
      `,
        });

        let points = [
            [1, 2],
            [4, 7],
        ];
        let definingPointNames = ["/dp1", "/dp2"];

        await runPointBasedTests({ core, points, definingPointNames });
    });

    it("line from sugared equation, single string", async () => {
        let core = await setupScene({
            lineChildren: `5x-2y=3`,
        });

        await runEquationBasedTests({
            core,
            coeff0: -3,
            coeffvar1: 5,
            coeffvar2: -2,
        });
    });

    it("line from sugared equation, single string, label as math", async () => {
        let core = await setupScene({
            lineChildren: `
            5x-2y=3
            <label>slope = $l.slope</label>
            `,
        });

        let label = "slope = \\(\\frac{5}{2}\\)";
        await runEquationBasedTests({
            core,
            coeff0: -3,
            coeffvar1: 5,
            coeffvar2: -2,
            label,
        });
    });

    it("line from sugared equation, strings and macros", async () => {
        let core = await setupScene({
            lineChildren: `$a x + $b y=$c`,
            additionalComponents: `
  <math name="a">5</math>
  <number name="b">-2</number>
  <number name="c">3</number>
            `,
        });

        await runEquationBasedTests({
            core,
            coeff0: -3,
            coeffvar1: 5,
            coeffvar2: -2,
            cantMove: true,
        });
    });

    it("line from sugared equation, strings and macros, label as math", async () => {
        let core = await setupScene({
            lineChildren: `
            <label>slope = $l.slope</label>
            $a x + $b y=$c
            `,
            additionalComponents: `
  <math name="a">5</math>
  <number name="b">-2</number>
  <number name="c">3</number>
            `,
        });

        let label = "slope = \\(\\frac{5}{2}\\)";
        await runEquationBasedTests({
            core,
            coeff0: -3,
            coeffvar1: 5,
            coeffvar2: -2,
            label,
            cantMove: true,
        });
    });

    it("line from sugared equation, strings, numbers and maths", async () => {
        let core = await setupScene({
            lineChildren: `<math>5</math> x + <number>-2</number>y=<number>3</number>`,
        });

        await runEquationBasedTests({
            core,
            coeff0: -3,
            coeffvar1: 5,
            coeffvar2: -2,
            cantMove: true,
        });
    });

    it("line from unsugared equation, single string", async () => {
        let core = await setupScene({
            lineProperties: `equation="5x-2y=3"`,
        });

        await runEquationBasedTests({
            core,
            coeff0: -3,
            coeffvar1: 5,
            coeffvar2: -2,
        });
    });

    it("line from unsugared equation, single string, label as math", async () => {
        let core = await setupScene({
            lineProperties: `equation="5x-2y=3"`,
            lineChildren: `<label>slope = $l.slope</label>`,
        });

        let label = "slope = \\(\\frac{5}{2}\\)";
        await runEquationBasedTests({
            core,
            coeff0: -3,
            coeffvar1: 5,
            coeffvar2: -2,
            label,
        });
    });

    it("line from unsugared equation, dynamic equation", async () => {
        let core = await setupScene({
            lineProperties: `equation="$equation"`,
            additionalComponents: `<mathInput name="equation">5x-2y=3</mathInput>`,
        });

        await runEquationBasedTests({
            core,
            coeff0: -3,
            coeffvar1: 5,
            coeffvar2: -2,
            equationInput: "/equation",
        });
    });

    it("line from equation, strings and macros", async () => {
        let core = await setupScene({
            lineProperties: `equation="$m - $n y = 3"`,
            additionalComponents: `
            <math name="m">5x</math>
            <number name="n">2</number>`,
        });

        await runEquationBasedTests({
            core,
            coeff0: -3,
            coeffvar1: 5,
            coeffvar2: -2,
            cantMove: true,
        });
    });

    it("line from equation with different variables, dynamic equation", async () => {
        let core = await setupScene({
            lineProperties: `variables="u v"`,
            lineChildren: `$equation`,
            additionalComponents: `<mathInput name="equation">5u-2v=3</mathInput>`,
        });

        await runEquationBasedTests({
            core,
            coeff0: -3,
            coeffvar1: 5,
            coeffvar2: -2,
            variables: ["u", "v"],
            equationInput: "/equation",
        });
    });

    it("new line from copy of equation", async () => {
        let core = await createTestCore({
            doenetML: `
      <graph>
        <point name="dp1">(1,2)</point>
        <point name="dp2">(4,7)</point>
        <line name="l" through="$dp1 $dp2" />
        $l.points{assignNames="P1 P2"}
      </graph>
      <graph name="g2" newNamespace>
        <line name="l" equation="$(../l.equation)" />
        $(../l.points{assignNames="P1 P2"})
      </graph>
      
      $g2{name="g3"}
      `,
        });

        let points = [
            [1, 2],
            [4, 7],
        ];
        let definingPointNames = ["/dp1", "/dp2"];

        await runPointBasedTests({
            core,
            points,
            definingPointNames,
            copiedBasedOnEquation: true,
        });
    });

    it("new line from copy of equation coefficients", async () => {
        let core = await createTestCore({
            doenetML: `
      <graph>
        <point name="dp1">(1,2)</point>
        <point name="dp2">(4,7)</point>
        <line name="l" through="$dp1 $dp2" />
        $l.points{assignNames="P1 P2"}
      </graph>
      <graph name="g2" newNamespace>
        <line variables="u v" name="l" equation="$(../l.coeffvar1)u +$(../l.coeffvar2)v + $(../l.coeff0) = 0" />
        $(../l.points{assignNames="P1 P2"})
      </graph>
      
      $g2{name="g3"}
      `,
        });

        let points = [
            [1, 2],
            [4, 7],
        ];
        let definingPointNames = ["/dp1", "/dp2"];

        await runPointBasedTests({
            core,
            points,
            definingPointNames,
            copiedBasedOnEquation: true,
        });
    });

    it("lines with bad throughs", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <line name="l1" through="A" />
    <line name="l2" through="(x,y) (a,b)" />
    <line name="l3" through="(c,d) (a,b)" />
    <line name="l4" through="(c,d) (a,b)" variables="a c" />
  </graph>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/l1"].stateValues.equation.tree).eq("\uff3f");
        expect(stateVariables["/l1"].stateValues.coeff0.tree).eq("\uff3f");
        expect(stateVariables["/l1"].stateValues.coeffvar1.tree).eq("\uff3f");
        expect(stateVariables["/l1"].stateValues.coeffvar2.tree).eq("\uff3f");

        expect(stateVariables["/l2"].stateValues.equation.tree).eq("\uff3f");
        expect(stateVariables["/l2"].stateValues.coeff0.tree).eq("\uff3f");
        expect(stateVariables["/l2"].stateValues.coeffvar1.tree).eq("\uff3f");
        expect(stateVariables["/l2"].stateValues.coeffvar2.tree).eq("\uff3f");

        expect(stateVariables["/l3"].stateValues.equation.tree).not.eq(
            "\uff3f",
        );

        expect(stateVariables["/l4"].stateValues.equation.tree).eq("\uff3f");
        expect(stateVariables["/l4"].stateValues.coeff0.tree).eq("\uff3f");
        expect(stateVariables["/l4"].stateValues.coeffvar1.tree).eq("\uff3f");
        expect(stateVariables["/l4"].stateValues.coeffvar2.tree).eq("\uff3f");

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.warnings[0].message).contain(
            "Line must be through points of at least two dimensions",
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].position.lineBegin).eq(3);
        expect(errorWarnings.warnings[0].position.charBegin).eq(5);
        expect(errorWarnings.warnings[0].position.lineEnd).eq(3);
        expect(errorWarnings.warnings[0].position.charEnd).eq(34);

        expect(errorWarnings.warnings[1].message).contain(
            "Line is through points that depend on variables: x, y",
        );
        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].position.lineBegin).eq(4);
        expect(errorWarnings.warnings[1].position.charBegin).eq(5);
        expect(errorWarnings.warnings[1].position.lineEnd).eq(4);
        expect(errorWarnings.warnings[1].position.charEnd).eq(44);

        expect(errorWarnings.warnings[2].message).contain(
            "Line is through points that depend on variables: a, c",
        );
        expect(errorWarnings.warnings[2].level).eq(1);
        expect(errorWarnings.warnings[2].position.lineBegin).eq(6);
        expect(errorWarnings.warnings[2].position.charBegin).eq(5);
        expect(errorWarnings.warnings[2].position.lineEnd).eq(6);
        expect(errorWarnings.warnings[2].position.charEnd).eq(60);
    });

    it("lines with bad equations", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <line name="l1">/2</line>
    <line name="l2">$invalid</line>
    <line name="l3" equation="" />
    <line name="l4" equation="/2" />
    <line name="l5" equation="$invalid" />
    <line name="l6">y=x^2</line>
    <line name="l7">1=2</line>
  </graph>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/l1"].stateValues.equation.tree).eqls([
            "/",
            "＿",
            2,
        ]);
        expect(stateVariables["/l1"].stateValues.coeff0.tree).eq("\uff3f");
        expect(stateVariables["/l1"].stateValues.coeffvar1.tree).eq("\uff3f");
        expect(stateVariables["/l1"].stateValues.coeffvar2.tree).eq("\uff3f");

        expect(stateVariables["/l2"].stateValues.equation.tree).eq("\uff3f");
        expect(stateVariables["/l2"].stateValues.coeff0.tree).eq("\uff3f");
        expect(stateVariables["/l2"].stateValues.coeffvar1.tree).eq("\uff3f");
        expect(stateVariables["/l2"].stateValues.coeffvar2.tree).eq("\uff3f");

        expect(stateVariables["/l3"].stateValues.equation.tree).eq("\uff3f");
        expect(stateVariables["/l3"].stateValues.coeff0.tree).eq("\uff3f");
        expect(stateVariables["/l3"].stateValues.coeffvar1.tree).eq("\uff3f");
        expect(stateVariables["/l3"].stateValues.coeffvar2.tree).eq("\uff3f");

        expect(stateVariables["/l4"].stateValues.equation.tree).eqls([
            "/",
            "＿",
            2,
        ]);
        expect(stateVariables["/l4"].stateValues.coeff0.tree).eq("\uff3f");
        expect(stateVariables["/l4"].stateValues.coeffvar1.tree).eq("\uff3f");
        expect(stateVariables["/l4"].stateValues.coeffvar2.tree).eq("\uff3f");

        expect(stateVariables["/l5"].stateValues.equation.tree).eq("\uff3f");
        expect(stateVariables["/l5"].stateValues.coeff0.tree).eq("\uff3f");
        expect(stateVariables["/l5"].stateValues.coeffvar1.tree).eq("\uff3f");
        expect(stateVariables["/l5"].stateValues.coeffvar2.tree).eq("\uff3f");

        expect(
            stateVariables["/l6"].stateValues.equation.equals(
                me.fromText("y=x^2"),
            ),
        ).eq(true);
        expect(stateVariables["/l6"].stateValues.coeff0.tree).eqls([
            "^",
            "x",
            2,
        ]);
        expect(stateVariables["/l6"].stateValues.coeffvar1.tree).eq(0);
        expect(stateVariables["/l6"].stateValues.coeffvar2.tree).eq(-1);

        expect(
            stateVariables["/l7"].stateValues.equation.equals(
                me.fromText("1=2"),
            ),
        ).eq(true);
        expect(stateVariables["/l7"].stateValues.coeff0.tree).eq(1);
        expect(stateVariables["/l7"].stateValues.coeffvar1.tree).eq(0);
        expect(stateVariables["/l7"].stateValues.coeffvar2.tree).eq(0);

        let errorWarnings = core.core!.errorWarnings;

        expect(errorWarnings.errors.length).eq(0);
        expect(errorWarnings.warnings.length).eq(2);

        expect(errorWarnings.warnings[0].message).contain(
            "Invalid format for equation of line in variables x and y",
        );
        expect(errorWarnings.warnings[0].level).eq(1);
        expect(errorWarnings.warnings[0].position.lineBegin).eq(8);
        expect(errorWarnings.warnings[0].position.charBegin).eq(5);
        expect(errorWarnings.warnings[0].position.lineEnd).eq(8);
        expect(errorWarnings.warnings[0].position.charEnd).eq(32);

        expect(errorWarnings.warnings[1].message).contain(
            "Invalid format for equation of line in variables x and y",
        );
        expect(errorWarnings.warnings[1].level).eq(1);
        expect(errorWarnings.warnings[1].position.lineBegin).eq(9);
        expect(errorWarnings.warnings[1].position.charBegin).eq(5);
        expect(errorWarnings.warnings[1].position.lineEnd).eq(9);
        expect(errorWarnings.warnings[1].position.charEnd).eq(30);
    });

    it("line from points with strange constraints", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>

  <point name="P1">
  ($P2.y,
  $a)
  </point>
  <point name="P2">(5,3)</point>
  <line name="l" through="$P1 $P2" />
  </graph>
  <math name="a" hide simplify>$P2.x+1</math>
  `,
        });

        let point2x = 5;
        let point2y = 3;
        let a = point2x + 1;
        let point1x = point2y;
        let point1y = a;
        let slope = (point1y - point2y) / (point1x - point2x);
        let yintercept = point2y - slope * point2x;

        // points and line match constraints
        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/P2"].stateValues.xs[0].tree).closeTo(
            point2x,
            1e-12,
        );
        expect(stateVariables["/P2"].stateValues.xs[1].tree).closeTo(
            point2y,
            1e-12,
        );

        expect(stateVariables["/a"].stateValues.value.tree).closeTo(a, 1e-12);

        expect(stateVariables["/P1"].stateValues.xs[0].tree).closeTo(
            point1x,
            1e-12,
        );
        expect(stateVariables["/P1"].stateValues.xs[1].tree).closeTo(
            point1y,
            1e-12,
        );

        expect(
            stateVariables["/l"].stateValues.slope.evaluate_to_constant(),
        ).closeTo(slope, 1e-12);

        expect(
            stateVariables["/l"].stateValues.yintercept.evaluate_to_constant(),
        ).closeTo(yintercept, 1e-12);

        // move point 1
        point1x = -5;
        point1y = -3;

        a = point1y;
        point2y = point1x;
        point2x = a - 1;

        slope = (point1y - point2y) / (point1x - point2x);
        yintercept = point2y - slope * point2x;

        await movePoint({ name: "/P1", x: point1x, y: point1y, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(stateVariables["/P2"].stateValues.xs[0].tree).closeTo(
            point2x,
            1e-12,
        );
        expect(stateVariables["/P2"].stateValues.xs[1].tree).closeTo(
            point2y,
            1e-12,
        );

        expect(stateVariables["/a"].stateValues.value.tree).closeTo(a, 1e-12);

        expect(stateVariables["/P1"].stateValues.xs[0].tree).closeTo(
            point1x,
            1e-12,
        );
        expect(stateVariables["/P1"].stateValues.xs[1].tree).closeTo(
            point1y,
            1e-12,
        );

        expect(
            stateVariables["/l"].stateValues.slope.evaluate_to_constant(),
        ).closeTo(slope, 1e-12);

        expect(
            stateVariables["/l"].stateValues.yintercept.evaluate_to_constant(),
        ).closeTo(yintercept, 1e-12);

        // move line
        stateVariables = await core.returnAllStateVariables(false, true);

        let point1 = stateVariables["/l"].stateValues.points[0];
        let point2 = stateVariables["/l"].stateValues.points[1];

        let moveX = -5;
        let moveY = 12;

        point1[0] = point1[0].add(moveX).simplify();
        point1[1] = point1[1].add(moveY).simplify();
        point2[0] = point2[0].add(moveX).simplify();
        point2[1] = point2[1].add(moveY).simplify();

        await moveLine({
            name: "/l",
            point1coords: point1.map((v) => v.tree),
            point2coords: point2.map((v) => v.tree),
            core,
        });

        // Note: one of two possible scenarios should be true
        // and it's not clear if either are preferred, given the strange constraints
        // Whether point1 or point2 wins depends on details of update algorithm
        // If point1 takes precedence, comment the first group of lines
        // and uncomment out the second group of lines

        point2x += moveX;
        point2y += moveY;
        a = point2x + 1;
        point1x = point2y;
        point1y = a;

        // point1x += moveX;
        // point1y += moveY;
        // a = point1y;
        // point2y = point1x;
        // point2x = a - 1;

        slope = (point1y - point2y) / (point1x - point2x);
        yintercept = point2y - slope * point2x;

        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/P2"].stateValues.xs[0].tree).closeTo(
            point2x,
            1e-12,
        );
        expect(stateVariables["/P2"].stateValues.xs[1].tree).closeTo(
            point2y,
            1e-12,
        );

        expect(stateVariables["/a"].stateValues.value.tree).closeTo(a, 1e-12);

        expect(stateVariables["/P1"].stateValues.xs[0].tree).closeTo(
            point1x,
            1e-12,
        );
        expect(stateVariables["/P1"].stateValues.xs[1].tree).closeTo(
            point1y,
            1e-12,
        );

        expect(
            stateVariables["/l"].stateValues.slope.evaluate_to_constant(),
        ).closeTo(slope, 1e-12);

        expect(
            stateVariables["/l"].stateValues.yintercept.evaluate_to_constant(),
        ).closeTo(yintercept, 1e-12);
    });

    it("copy public state variables of line", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <line name="l" through="(5,-4) (1,4)" />
  </graph>

  <p name="p1">Variables are $l.var1{assignNames="var1"} and $l.var2{assignNames="var2"}.</p>
  <p name="p2"><m>x</m>-intercept is $l.xintercept{assignNames="xintercept"}.</p>
  <p name="p3"><m>y</m>-intercept is $l.yintercept{assignNames="yintercept"}.</p>
  <p name="p4">Slope is $l.slope{assignNames="slope"}.</p>
  <p name="p5">Equation is $l.equation{assignNames="equation"}.</p>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/p1"].stateValues.text).eq(
            "Variables are x and y.",
        );
        expect(stateVariables["/p2"].stateValues.text).eq("x-intercept is 3.");
        expect(stateVariables["/p3"].stateValues.text).eq("y-intercept is 6.");
        expect(stateVariables["/p4"].stateValues.text).eq("Slope is -2.");

        // eventually hope we get a better form of the equation
        expect(stateVariables["/p5"].stateValues.text).eq(
            "Equation is 0 = -8 x - 4 y + 24.",
        );

        expect(
            stateVariables["/l"].stateValues.equation.equals(
                me.fromText("y = -2x+6"),
            ),
        ).to.be.true;
        expect(stateVariables["/l"].stateValues.var1.tree).eq("x");
        expect(stateVariables["/l"].stateValues.var2.tree).eq("y");
        expect(stateVariables["/l"].stateValues.slope.tree).eq(-2);
        expect(stateVariables["/l"].stateValues.xintercept.tree).eq(3);
        expect(stateVariables["/l"].stateValues.yintercept.tree).eq(6);
        expect(stateVariables["/var1"].stateValues.value.tree).eq("x");
        expect(stateVariables["/var2"].stateValues.value.tree).eq("y");
        expect(stateVariables["/xintercept"].stateValues.value.tree).eq(3);
        expect(stateVariables["/yintercept"].stateValues.value.tree).eq(6);
        expect(stateVariables["/slope"].stateValues.value.tree).eq(-2);
        expect(
            stateVariables["/equation"].stateValues.value.equals(
                me.fromText("y = -2x+6"),
            ),
        ).to.be.true;
    });

    it("extracting point coordinates of symmetric line", async () => {
        let core = await createTestCore({
            doenetML: `
  <math name="threeFixed" fixed>3</math>

  <graph>
    <point hide name="A">(1,2)</point>
    <line name="l" through="$A ($(A.y),$(A.x)) "/>
    <point name="x1" x="$l.points[1][1]" y="$threeFixed" />
    <point name="x2">
      ($l.point2.x, <math fixed>4</math>)
    </point>
    <point name="y1" y="$l.point1[2]" x="$threeFixed" />
    <point name="y2">
      (<math fixed>4</math>, $l.points[2].y)
    </point>
  </graph>
  
  `,
        });

        async function check_items(x: number, y: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables["/l"].stateValues.points[0].map((v) => v.tree),
            ).eqls([x, y]);
            expect(
                stateVariables["/l"].stateValues.points[1].map((v) => v.tree),
            ).eqls([y, x]);
            expect(stateVariables["/x1"].stateValues.xs[0].tree).eq(x);
            expect(stateVariables["/x2"].stateValues.xs[0].tree).eq(y);
            expect(stateVariables["/y1"].stateValues.xs[1].tree).eq(y);
            expect(stateVariables["/y2"].stateValues.xs[1].tree).eq(x);
        }

        let x = 1;
        let y = 2;
        await check_items(x, y);

        // move x point 1
        x = 3;
        await movePoint({ name: "/x1", x, core });
        await check_items(x, y);

        // move x point 2
        y = 4;
        await movePoint({ name: "/x2", x: y, core });
        await check_items(x, y);

        // move y point 1
        y = -6;
        await movePoint({ name: "/y1", y, core });
        await check_items(x, y);

        // move y point 2
        x = -8;
        await movePoint({ name: "/y2", y: x, core });
        await check_items(x, y);
    });

    it("three lines with mutual references", async () => {
        let core = await createTestCore({
            doenetML: `
<graph>
    <line name="l1" through="$(l2.point2{ createComponentOfType='point'}) (1,0)" />
    <line name="l2" through="$(l3.point2{ createComponentOfType='point'}) (3,2)" />
    <line name="l3" through="$(l1.point2{ createComponentOfType='point'}) (-1,4)" />
    $l1.point1{assignNames="p11"}
    $l1.point2{assignNames="p12"}
    $l2.point1{assignNames="p21"}
    $l2.point2{assignNames="p22"}
    $l3.point1{assignNames="p31"}
    $l3.point2{assignNames="p32"}
</graph>
  `,
        });

        async function check_items({
            x1,
            x2,
            x3,
            y1,
            y2,
            y3,
        }: {
            x1: number;
            x2: number;
            x3: number;
            y1: number;
            y2: number;
            y3: number;
        }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables["/l1"].stateValues.points[0].map((v) => v.tree),
            ).eqls([x2, y2]);
            expect(
                stateVariables["/l1"].stateValues.points[1].map((v) => v.tree),
            ).eqls([x1, y1]);
            expect(
                stateVariables["/l2"].stateValues.points[0].map((v) => v.tree),
            ).eqls([x3, y3]);
            expect(
                stateVariables["/l2"].stateValues.points[1].map((v) => v.tree),
            ).eqls([x2, y2]);
            expect(
                stateVariables["/l3"].stateValues.points[0].map((v) => v.tree),
            ).eqls([x1, y1]);
            expect(
                stateVariables["/l3"].stateValues.points[1].map((v) => v.tree),
            ).eqls([x3, y3]);
        }

        let x1 = 1,
            y1 = 0;
        let x2 = 3,
            y2 = 2;
        let x3 = -1,
            y3 = 4;
        await check_items({ x1, x2, x3, y1, y2, y3 });

        // move point 1 of line 1
        x2 = 7;
        y2 = -3;
        await movePoint({ name: "/p11", x: x2, y: y2, core });
        await check_items({ x1, x2, x3, y1, y2, y3 });

        // move point 2 of line 1
        x1 = -1;
        y1 = -4;
        await movePoint({ name: "/p12", x: x1, y: y1, core });
        await check_items({ x1, x2, x3, y1, y2, y3 });

        // move point 1 of line 2
        x3 = 9;
        y3 = -8;
        await movePoint({ name: "/p21", x: x3, y: y3, core });
        await check_items({ x1, x2, x3, y1, y2, y3 });

        // move point 2 of line 2
        x2 = 3;
        y2 = 2;
        await movePoint({ name: "/p22", x: x2, y: y2, core });
        await check_items({ x1, x2, x3, y1, y2, y3 });

        // move point 1 of line 3
        x1 = -5;
        y1 = 8;
        await movePoint({ name: "/p31", x: x1, y: y1, core });
        await check_items({ x1, x2, x3, y1, y2, y3 });

        // move point 2 of line 3
        x3 = 0;
        y3 = -5;
        await movePoint({ name: "/p32", x: x3, y: y3, core });
        await check_items({ x1, x2, x3, y1, y2, y3 });
    });

    it("line through one point, copy and overwrite the point", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <line through="(-5,9)" name="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}
  </graph>

  <graph newNamespace name="g2">
    $(../g1/l{name="l" through="(4,-2)"})
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g3">
    $(../g2/l{name="l"})
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g4">
    $(../g3/l{name="l"})
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  $g2{name="g5"}
  `,
        });

        async function checkLines({
            x11,
            y11,
            x12,
            y12,
            x2,
            y2,
        }: {
            x11: number;
            y11: number;
            x12: number;
            y12: number;
            x2: number;
            y2: number;
        }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.points[0][0].evaluate_to_constant(),
            ).closeTo(x11, 1e-12);
            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.points[0][1].evaluate_to_constant(),
            ).closeTo(y11, 1e-12);
            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.points[1][0].evaluate_to_constant(),
            ).closeTo(x2, 1e-12);
            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.points[1][1].evaluate_to_constant(),
            ).closeTo(y2, 1e-12);
            expect(stateVariables["/g1/A"].stateValues.xs[0].tree).closeTo(
                x11,
                1e-12,
            );
            expect(stateVariables["/g1/A"].stateValues.xs[1].tree).closeTo(
                y11,
                1e-12,
            );
            expect(stateVariables["/g1/B"].stateValues.xs[0].tree).closeTo(
                x2,
                1e-12,
            );
            expect(stateVariables["/g1/B"].stateValues.xs[1].tree).closeTo(
                y2,
                1e-12,
            );

            for (let g of ["/g2", "/g3", "/g4", "/g5"]) {
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.points[0][0].evaluate_to_constant(),
                ).closeTo(x12, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.points[0][1].evaluate_to_constant(),
                ).closeTo(y12, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.points[1][0].evaluate_to_constant(),
                ).closeTo(x2, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.points[1][1].evaluate_to_constant(),
                ).closeTo(y2, 1e-12);
                expect(stateVariables[`${g}/A`].stateValues.xs[0].tree).closeTo(
                    x12,
                    1e-12,
                );
                expect(stateVariables[`${g}/A`].stateValues.xs[1].tree).closeTo(
                    y12,
                    1e-12,
                );
                expect(stateVariables[`${g}/B`].stateValues.xs[0].tree).closeTo(
                    x2,
                    1e-12,
                );
                expect(stateVariables[`${g}/B`].stateValues.xs[1].tree).closeTo(
                    y2,
                    1e-12,
                );
            }
        }

        let x11 = -5,
            y11 = 9;
        let x12 = 4,
            y12 = -2;
        let x2 = 0,
            y2 = 0;
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g1/A
        x11 = 7;
        y11 = -3;
        await movePoint({ name: "/g1/A", x: x11, y: y11, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g1/B
        x2 = -1;
        y2 = -4;
        await movePoint({ name: "/g1/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g1/l
        x11 = 5;
        y11 = 3;
        x2 = -7;
        y2 = -8;
        await moveLine({
            name: "/g1/l",
            point1coords: [x11, y11],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g2/A
        x12 = -1;
        y12 = 0;
        await movePoint({ name: "/g2/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g2/B
        x2 = 6;
        y2 = -6;
        await movePoint({ name: "/g2/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g2/l
        x12 = 10;
        y12 = 9;
        x2 = 8;
        y2 = 7;
        await moveLine({
            name: "/g2/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g3/A
        x12 = -3;
        y12 = 7;
        await movePoint({ name: "/g3/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g3/B
        x2 = -8;
        y2 = -4;
        await movePoint({ name: "/g3/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g3/l
        x12 = 0;
        y12 = -1;
        x2 = 2;
        y2 = -3;
        await moveLine({
            name: "/g3/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g4/A
        x12 = 9;
        y12 = 8;
        await movePoint({ name: "/g4/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g4/B
        x2 = 6;
        y2 = -9;
        await movePoint({ name: "/g4/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g4/l
        x12 = -3;
        y12 = 4;
        x2 = -5;
        y2 = 6;
        await moveLine({
            name: "/g4/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g5/A
        x12 = 1;
        y12 = -3;
        await movePoint({ name: "/g5/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g5/B
        x2 = 0;
        y2 = 7;
        await movePoint({ name: "/g5/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g5/l
        x12 = 4;
        y12 = 5;
        x2 = -6;
        y2 = -7;
        await moveLine({
            name: "/g5/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    it("line through one point, copy and overwrite the point, swap line", async () => {
        let core = await createTestCore({
            doenetML: `
  <booleanInput name="b" />
  <graph name="g1" newNamespace>
    <conditionalContent assignNames="(l)">
      <case condition="$(../b)" >
        <line through="(1,2)" />
      </case>
      <else>
        <line through="(-5,9)" />
      </else>
    </conditionalContent>
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}
  </graph>

  <graph newNamespace name="g2">
    $(../g1/l{name="l" through="(4,-2)"})
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g3">
    $(../g2/l{name="l"})
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g4">
    $(../g3/l{name="l"})
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  $g2{name="g5"}

  `,
        });

        async function checkLines({
            x11,
            y11,
            x12,
            y12,
            x2,
            y2,
        }: {
            x11: number;
            y11: number;
            x12: number;
            y12: number;
            x2: number;
            y2: number;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.points[0][0].evaluate_to_constant(),
            ).closeTo(x11, 1e-12);
            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.points[0][1].evaluate_to_constant(),
            ).closeTo(y11, 1e-12);
            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.points[1][0].evaluate_to_constant(),
            ).closeTo(x2, 1e-12);
            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.points[1][1].evaluate_to_constant(),
            ).closeTo(y2, 1e-12);
            expect(stateVariables["/g1/A"].stateValues.xs[0].tree).closeTo(
                x11,
                1e-12,
            );
            expect(stateVariables["/g1/A"].stateValues.xs[1].tree).closeTo(
                y11,
                1e-12,
            );
            expect(stateVariables["/g1/B"].stateValues.xs[0].tree).closeTo(
                x2,
                1e-12,
            );
            expect(stateVariables["/g1/B"].stateValues.xs[1].tree).closeTo(
                y2,
                1e-12,
            );

            for (let g of ["/g2", "/g3", "/g4", "/g5"]) {
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.points[0][0].evaluate_to_constant(),
                ).closeTo(x12, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.points[0][1].evaluate_to_constant(),
                ).closeTo(y12, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.points[1][0].evaluate_to_constant(),
                ).closeTo(x2, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.points[1][1].evaluate_to_constant(),
                ).closeTo(y2, 1e-12);
                expect(stateVariables[`${g}/A`].stateValues.xs[0].tree).closeTo(
                    x12,
                    1e-12,
                );
                expect(stateVariables[`${g}/A`].stateValues.xs[1].tree).closeTo(
                    y12,
                    1e-12,
                );
                expect(stateVariables[`${g}/B`].stateValues.xs[0].tree).closeTo(
                    x2,
                    1e-12,
                );
                expect(stateVariables[`${g}/B`].stateValues.xs[1].tree).closeTo(
                    y2,
                    1e-12,
                );
            }
        }

        let x11 = -5,
            y11 = 9;
        let x12 = 4,
            y12 = -2;
        let x2 = 0,
            y2 = 0;
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g1/A
        x11 = 7;
        y11 = -3;
        await movePoint({ name: "/g1/A", x: x11, y: y11, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g1/B
        x2 = -1;
        y2 = -4;
        await movePoint({ name: "/g1/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g1/l
        x11 = 5;
        y11 = 3;
        x2 = -7;
        y2 = -8;
        await moveLine({
            name: "/g1/l",
            point1coords: [x11, y11],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g2/A
        x12 = -1;
        y12 = 0;
        await movePoint({ name: "/g2/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g2/B
        x2 = 6;
        y2 = -6;
        await movePoint({ name: "/g2/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g2/l
        x12 = 10;
        y12 = 9;
        x2 = 8;
        y2 = 7;
        await moveLine({
            name: "/g2/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g3/A
        x12 = -3;
        y12 = 7;
        await movePoint({ name: "/g3/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g3/B
        x2 = -8;
        y2 = -4;
        await movePoint({ name: "/g3/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g3/l
        x12 = 0;
        y12 = -1;
        x2 = 2;
        y2 = -3;
        await moveLine({
            name: "/g3/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g4/A
        x12 = 9;
        y12 = 8;
        await movePoint({ name: "/g4/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g4/B
        x2 = 6;
        y2 = -9;
        await movePoint({ name: "/g4/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g4/l
        x12 = -3;
        y12 = 4;
        x2 = -5;
        y2 = 6;
        await moveLine({
            name: "/g4/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g5/A
        x12 = 1;
        y12 = -3;
        await movePoint({ name: "/g5/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g5/B
        x2 = 0;
        y2 = 7;
        await movePoint({ name: "/g5/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g5/l
        x12 = 4;
        y12 = 5;
        x2 = -6;
        y2 = -7;
        await moveLine({
            name: "/g5/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        await updateBooleanInputValue({ boolean: true, name: "/b", core });
        x11 = 1;
        y11 = 2;
        x12 = 4;
        y12 = -2;
        x2 = 0;
        y2 = 0;
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g1/A
        x11 = 7;
        y11 = -3;
        await movePoint({ name: "/g1/A", x: x11, y: y11, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g1/B
        x2 = -1;
        y2 = -4;
        await movePoint({ name: "/g1/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g1/l
        x11 = 5;
        y11 = 3;
        x2 = -7;
        y2 = -8;
        await moveLine({
            name: "/g1/l",
            point1coords: [x11, y11],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g2/A
        x12 = -1;
        y12 = 0;
        await movePoint({ name: "/g2/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g2/B
        x2 = 6;
        y2 = -6;
        await movePoint({ name: "/g2/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g2/l
        x12 = 10;
        y12 = 9;
        x2 = 8;
        y2 = 7;
        await moveLine({
            name: "/g2/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g3/A
        x12 = -3;
        y12 = 7;
        await movePoint({ name: "/g3/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g3/B
        x2 = -8;
        y2 = -4;
        await movePoint({ name: "/g3/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g3/l
        x12 = 0;
        y12 = -1;
        x2 = 2;
        y2 = -3;
        await moveLine({
            name: "/g3/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g4/A
        x12 = 9;
        y12 = 8;
        await movePoint({ name: "/g4/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g4/B
        x2 = 6;
        y2 = -9;
        await movePoint({ name: "/g4/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g4/l
        x12 = -3;
        y12 = 4;
        x2 = -5;
        y2 = 6;
        await moveLine({
            name: "/g4/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g5/A
        x12 = 1;
        y12 = -3;
        await movePoint({ name: "/g5/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move point g5/B
        x2 = 0;
        y2 = 7;
        await movePoint({ name: "/g5/B", x: x2, y: y2, core });
        await checkLines({ x11, y11, x12, y12, x2, y2 });

        // move line g5/l
        x12 = 4;
        y12 = 5;
        x2 = -6;
        y2 = -7;
        await moveLine({
            name: "/g5/l",
            point1coords: [x12, y12],
            point2coords: [x2, y2],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x2, y2 });
    });

    it("line through fixed point", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph name="g1" newNamespace>
    <point name="p" hide fixed>(-5,9)</point>
    <line name="l" through="$p" />
    $l.point1{assignNames="P1"}
    $l.point2{assignNames="P2"}
  </graph>

  <graph name="g2" newNamespace>
    $(../g1/l{name="l"})
    $l.point1{assignNames="P1"}
    $l.point2{assignNames="P2"}  
  </graph>

  $g2{name="g3"}

  `,
        });

        let points = [
            [-5, 9],
            [0, 0],
        ];

        let names = [
            ["/g1/l", "/g1/P1", "/g1/P2"],
            ["/g2/l", "/g2/P1", "/g2/P2"],
            ["/g3/l", "/g3/P1", "/g3/P2"],
        ];

        await checkAllLineValues({ names, points, core });

        // can't move point 1
        await movePoint({ name: "/g1/P1", x: 7, y: -3, core });
        await checkAllLineValues({ names, points, core });

        // move point P2
        points[1] = [-1, -4];
        await movePoint({
            name: "/g1/P2",
            x: points[1][0],
            y: points[1][1],
            core,
        });
        await checkAllLineValues({ names, points, core });

        // try to move line
        await moveLine({
            name: "/g1/l",
            point1coords: [points[0][0] + 5, points[0][1] + 9],
            point2coords: [points[1][0] + 5, points[1][1] + 9],
            core,
        });
        await checkAllLineValues({ names, points, core });

        // can't move point g2/P1
        await movePoint({ name: "/g2/P1", x: -1, y: 0, core });
        await checkAllLineValues({ names, points, core });

        // move point g2/P2
        points[1] = [6, -6];
        await movePoint({
            name: "/g2/P2",
            x: points[1][0],
            y: points[1][1],
            core,
        });

        // move line 2
        await moveLine({
            name: "/g2/l",
            point1coords: [points[0][0] - 3, points[0][1] + 7],
            point2coords: [points[1][0] - 3, points[1][1] + 7],
            core,
        });
        await checkAllLineValues({ names, points, core });

        // can't move point g3/P1
        await movePoint({ name: "/g3/P1", x: -3, y: 7, core });
        await checkAllLineValues({ names, points, core });

        // move point B3
        points[1] = [-8, -4];
        await movePoint({
            name: "/g3/P2",
            x: points[1][0],
            y: points[1][1],
            core,
        });
        await checkAllLineValues({ names, points, core });

        // move line 3
        await moveLine({
            name: "/g3/l",
            point1coords: [points[0][0] - 8, points[0][1] - 2],
            point2coords: [points[1][0] - 8, points[1][1] - 2],
            core,
        });
        await checkAllLineValues({ names, points, core });
    });

    it("line through dynamic number of moveable points", async () => {
        let core = await createTestCore({
            doenetML: `
  <map hide name="map1">
    <template>
      <point>
        ($x + <math>0</math>,
        2$x + <math>0</math>)
      </point>
    </template>
    <sources alias="x">
      <sequence length="$mi" />
    </sources>
  </map>
  <graph name="g1" newNamespace>
    <line through="$(../map1)" name="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}
  </graph>

  <graph name="g2" newNamespace>
    $(../g1/l{name="l"})
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  $g2{name="g3"}

  <mathInput name="mi" prefill="0"/>
  `,
        });

        let points = [
            [1, 0],
            [0, 0],
        ];

        let names = [
            ["/g1/l", "/g1/A", "/g1/B"],
            ["/g2/l", "/g2/A", "/g2/B"],
            ["/g3/l", "/g3/A", "/g3/B"],
        ];

        await checkAllLineValues({ names, points, core });

        async function moveAll(offset: number) {
            for (let [ind, nameObj] of names.entries()) {
                // move point 1
                points[0] = [4 * ind - 3 + offset, 10 - 3 * ind - offset];
                await movePoint({
                    name: nameObj[1],
                    x: points[0][0],
                    y: points[0][1],
                    core,
                });
                await checkAllLineValues({ names, points, core });

                // move point 2
                points[1] = [
                    -5 * ind - 2 - 2 * offset,
                    3 + 4 * ind + 2 * offset,
                ];
                await movePoint({
                    name: nameObj[2],
                    x: points[1][0],
                    y: points[1][1],
                    core,
                });
                await checkAllLineValues({ names, points, core });

                // move line
                points[0] = [
                    (ind - offset) ** 2,
                    16 - Math.sqrt(ind + Math.abs(offset)),
                ];
                points[1] = [
                    Math.log(ind + Math.abs(offset) + 1) - 1,
                    2 ** (ind - offset) - 3,
                ];
                await moveLine({
                    name: nameObj[0],
                    point1coords: points[0],
                    point2coords: points[1],
                    core,
                });

                await checkAllLineValues({ names, points, core });
            }
        }

        await moveAll(0);

        // since have no points, all values were stored by essential variables
        let pointsEssential = JSON.parse(JSON.stringify(points));

        // add first through point
        await updateMathInputValue({ latex: "1", name: "/mi", core });
        // first point starts with value from map
        points[0] = [1, 2];
        await checkAllLineValues({ names, points, core });

        await moveAll(1);

        // since have only one point, second point values were stored by essential variables
        pointsEssential[1] = [...points[1]];

        // add second through point
        await updateMathInputValue({ latex: "2", name: "/mi", core });
        // second point starts with value from map
        points[1] = [2, 4];
        await checkAllLineValues({ names, points, core });

        await moveAll(2);

        // remove second through point
        await updateMathInputValue({ latex: "1", name: "/mi", core });
        // point two values revert to essential
        points[1] = [...pointsEssential[1]];
        await checkAllLineValues({ names, points, core });

        await moveAll(3);

        // remove first through point
        await updateMathInputValue({ latex: "0", name: "/mi", core });
        // point one values revert to essential
        points[0] = [...pointsEssential[0]];
        await checkAllLineValues({ names, points, core });

        await moveAll(4);
    });

    it("line through dynamic number of fixed points", async () => {
        let core = await createTestCore({
            doenetML: `
  <map hide name="map1">
    <template>
      <point>
        ($x, 2$x)
      </point>
    </template>
    <sources alias="x">
      <sequence length="$mi" />
    </sources>
  </map>
  <graph name="g1" newNamespace>
    <line through="$(../map1)" name="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}
  </graph>

  <graph name="g2" newNamespace>
    $(../g1/l{name="l"})
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  $g2{name="g3"}

  <mathInput prefill="0" name="mi" />

  `,
        });

        let points = [
            [1, 0],
            [0, 0],
        ];

        let names = [
            ["/g1/l", "/g1/A", "/g1/B"],
            ["/g2/l", "/g2/A", "/g2/B"],
            ["/g3/l", "/g3/A", "/g3/B"],
        ];

        await checkAllLineValues({ names, points, core });

        async function moveAll(offset: number, fixedInd: number) {
            for (let [ind, nameObj] of names.entries()) {
                // move point 1
                let newPoint1 = [4 * ind - 3 + offset, 10 - 3 * ind - offset];
                await movePoint({
                    name: nameObj[1],
                    x: newPoint1[0],
                    y: newPoint1[1],
                    core,
                });
                // point 1 actually moves only if it isn't fixed
                if (fixedInd < 1) {
                    points[0] = newPoint1;
                }
                await checkAllLineValues({ names, points, core });

                // move point 2
                let newPoint2 = [
                    -5 * ind - 2 - 2 * offset,
                    3 + 4 * ind + 2 * offset,
                ];
                await movePoint({
                    name: nameObj[2],
                    x: newPoint2[0],
                    y: newPoint2[1],
                    core,
                });
                // point 2 actually moves only if it isn't fixed
                if (fixedInd < 2) {
                    points[1] = newPoint2;
                }
                await checkAllLineValues({ names, points, core });

                // move line
                newPoint1 = [
                    (ind - offset) ** 2,
                    16 - Math.sqrt(ind + Math.abs(offset)),
                ];
                newPoint2 = [
                    Math.log(ind + Math.abs(offset) + 1) - 1,
                    2 ** (ind - offset) - 3,
                ];
                await moveLine({
                    name: nameObj[0],
                    point1coords: newPoint1,
                    point2coords: newPoint2,
                    core,
                });

                if (fixedInd < 1) {
                    // if neither point 1 or 2 are fixed,
                    // then they move as prescribed
                    points[0] = newPoint1;
                    points[1] = newPoint2;
                } else if (fixedInd < 2) {
                    // if point 1 is fixed but not point 2,
                    // then point 2 moves by the difference between the amount it
                    // was moved and the amount point 1 moved
                    // (i.e., it wouldn't have moved if it had been a rigid motion)
                    points[1][0] = newPoint2[0] - (newPoint1[0] - points[0][0]);
                    points[1][1] = newPoint2[1] - (newPoint1[1] - points[0][1]);
                }

                await checkAllLineValues({ names, points, core });
            }
        }

        await moveAll(0, 0);

        // since have no points, all values were stored by essential variables
        let pointsEssential = JSON.parse(JSON.stringify(points));

        // add first through point
        await updateMathInputValue({ latex: "1", name: "/mi", core });
        // first point starts with value from map
        points[0] = [1, 2];
        await checkAllLineValues({ names, points, core });

        await moveAll(1, 1);

        // since have only one point, second point values were stored by essential variables
        pointsEssential[1] = [...points[1]];

        // add second through point
        await updateMathInputValue({ latex: "2", name: "/mi", core });
        // second point starts with value from map
        points[1] = [2, 4];
        await checkAllLineValues({ names, points, core });

        await moveAll(2, 2);

        // remove second through point
        await updateMathInputValue({ latex: "1", name: "/mi", core });
        // point two values revert to essential
        points[1] = [...pointsEssential[1]];
        await checkAllLineValues({ names, points, core });

        await moveAll(3, 1);

        // remove first through point
        await updateMathInputValue({ latex: "0", name: "/mi", core });
        // point one values revert to essential
        points[0] = [...pointsEssential[0]];
        await checkAllLineValues({ names, points, core });

        await moveAll(4, 0);
    });

    async function test_line_point_referencing_own(core: PublicDoenetMLCore) {
        async function check_items({
            x1,
            y1,
            x2,
            y2,
        }: {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables["/l"].stateValues.points[0].map((v) => v.tree),
            ).eqls([x1, y1]);
            expect(
                stateVariables["/l"].stateValues.points[1].map((v) => v.tree),
            ).eqls([x2, y2]);
            expect(
                stateVariables["/la"].stateValues.points[0].map((v) => v.tree),
            ).eqls([x1, y1]);
            expect(
                stateVariables["/la"].stateValues.points[1].map((v) => v.tree),
            ).eqls([x2, y2]);
            expect(stateVariables["/p1"].stateValues.coords.tree).eqls([
                "vector",
                x1,
                y1,
            ]);
            expect(stateVariables["/p2"].stateValues.coords.tree).eqls([
                "vector",
                x2,
                y2,
            ]);
            expect(stateVariables["/p1a"].stateValues.coords.tree).eqls([
                "vector",
                x1,
                y1,
            ]);
            expect(stateVariables["/p2a"].stateValues.coords.tree).eqls([
                "vector",
                x2,
                y2,
            ]);
        }

        let x1 = 3,
            y1 = 3;
        let x2 = 4,
            y2 = 5;

        await check_items({ x1, y1, x2, y2 });

        // move point 1
        x1 = y1 = 7;
        let y1try = 13;
        await movePoint({ name: "/p1", x: x1, y: y1try, core });
        await check_items({ x1, y1, x2, y2 });

        // move point 2
        x2 = -3;
        y2 = 9;
        await movePoint({ name: "/p2", x: x2, y: y2, core });
        await check_items({ x1, y1, x2, y2 });

        // move point 1a
        x1 = y1 = -1;
        y1try = -21;
        await movePoint({ name: "/p1a", x: x1, y: y1try, core });
        await check_items({ x1, y1, x2, y2 });

        // move point 2a
        x2 = -5;
        y2 = 6;
        await movePoint({ name: "/p2a", x: x2, y: y2, core });
        await check_items({ x1, y1, x2, y2 });

        // move line
        let dx = 4,
            dy = -3;

        y1try = y1 + dy;
        x1 = y1 = x1 + dx;
        x2 = x2 + dx;
        let y2try = y2 + dy;
        y2 = y2try + y1 - y1try;

        await moveLine({
            name: "/l",
            point1coords: [x1, y1try],
            point2coords: [x2, y2try],
            core,
        });
        await check_items({ x1, y1, x2, y2 });

        // move line a
        dx = -6;
        dy = -9;

        y1try = y1 + dy;
        x1 = y1 = x1 + dx;
        x2 = x2 + dx;
        y2try = y2 + dy;
        y2 = y2try + y1 - y1try;

        await moveLine({
            name: "/la",
            point1coords: [x1, y1try],
            point2coords: [x2, y2try],
            core,
        });
        await check_items({ x1, y1, x2, y2 });
    }

    it("line through point referencing own component", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <line name="l" through="(3, $l.points[1][1]) (4,5)" />
    $l.point1{assignNames="p1"}
    $l.point2{assignNames="p2"}
  </graph>

  <graph>
    $l{name="la"}
    $l.point1{assignNames="p1a"}
    $l.point2{assignNames="p2a"}
  </graph>

  `,
        });

        // A torture test, because when $l.point1.x  is expanded,
        // it causes a state variable to become unresolved right in the middle
        // of the algorithm processing the consequences of it becoming resolved

        await test_line_point_referencing_own(core);
    });

    it("line through point referencing own component via reference", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <line name="l" through="(3, $la.points[1][1]) (4,5)" />
    $l.point1{assignNames="p1"}
    $l.point2{assignNames="p2"}
  </graph>

  <graph>
    $l{name="la"}
    $l.point1{assignNames="p1a"}
    $l.point2{assignNames="p2a"}
  </graph>

  `,
        });

        await test_line_point_referencing_own(core);
    });

    async function test_line_self_references_points(core: PublicDoenetMLCore) {
        async function check_items({
            x1,
            y1,
            x2,
            y2,
        }: {
            x1: number;
            y1: number;
            x2: number;
            y2: number;
        }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables["/l"].stateValues.points[0].map((v) => v.tree),
            ).eqls([x1, y1]);
            expect(
                stateVariables["/l"].stateValues.points[1].map((v) => v.tree),
            ).eqls([x2, y2]);
            expect(
                stateVariables["/la"].stateValues.points[0].map((v) => v.tree),
            ).eqls([x1, y1]);
            expect(
                stateVariables["/la"].stateValues.points[1].map((v) => v.tree),
            ).eqls([x2, y2]);
            expect(stateVariables["/p1"].stateValues.coords.tree).eqls([
                "vector",
                x1,
                y1,
            ]);
            expect(stateVariables["/p2"].stateValues.coords.tree).eqls([
                "vector",
                x2,
                y2,
            ]);
            expect(stateVariables["/p1a"].stateValues.coords.tree).eqls([
                "vector",
                x1,
                y1,
            ]);
            expect(stateVariables["/p2a"].stateValues.coords.tree).eqls([
                "vector",
                x2,
                y2,
            ]);
        }

        let y2 = 1;
        let x1 = 2 * y2 + 1;
        let x2 = x1 + 1;
        let y1 = 2 * x2 + 1;

        await check_items({ x1, y1, x2, y2 });

        // move point 1
        x1 = 7;
        let y1try = 13;
        y2 = (x1 - 1) / 2;
        x2 = x1 + 1;
        y1 = 2 * x2 + 1;
        await movePoint({ name: "/p1", x: x1, y: y1try, core });
        await check_items({ x1, y1, x2, y2 });

        // move point 2
        x2 = -4;
        let y2try = 9;
        x1 = x2 - 1;
        y2 = (x1 - 1) / 2;
        y1 = 2 * x2 + 1;
        await movePoint({ name: "/p2", x: x2, y: y2try, core });
        await check_items({ x1, y1, x2, y2 });

        // move point 1a
        x1 = -1;
        y1try = -21;
        y2 = (x1 - 1) / 2;
        x2 = x1 + 1;
        y1 = 2 * x2 + 1;
        await movePoint({ name: "/p1a", x: x1, y: y1try, core });
        await check_items({ x1, y1, x2, y2 });

        // move point 2a
        x2 = -8;
        y2try = 9;
        x1 = x2 - 1;
        y2 = (x1 - 1) / 2;
        y1 = 2 * x2 + 1;
        await movePoint({ name: "/p2a", x: x2, y: y2try, core });
        await check_items({ x1, y1, x2, y2 });

        // move line
        let dx = 4,
            dy = -3;
        y1try = y1 + dy;
        let x2try = x2 + dx;
        y2try = y2 + dy;
        x1 = x1 + dx;
        y2 = (x1 - 1) / 2;
        x2 = x1 + 1;
        y1 = 2 * x2 + 1;
        await moveLine({
            name: "/l",
            point1coords: [x1, y1try],
            point2coords: [x2try, y2try],
            core,
        });
        await check_items({ x1, y1, x2, y2 });

        // move line a
        dx = -6;
        dy = -9;
        y1try = y1 + dy;
        x2try = x2 + dx;
        y2try = y2 + dy;
        x1 = x1 + dx;
        y2 = (x1 - 1) / 2;
        x2 = x1 + 1;
        y1 = 2 * x2 + 1;
        await moveLine({
            name: "/la",
            point1coords: [x1, y1try],
            point2coords: [x2try, y2try],
            core,
        });
        await check_items({ x1, y1, x2, y2 });
    }

    it("line with self references to points", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <line name="l" through="(2$l.points[2][2]+1, 2$l.points[2][1]+1) ($l.points[1][1]+1, 1)"/>
    $l.point1{assignNames="p1"}
    $l.point2{assignNames="p2"}
  </graph>

  <graph>
    $l{name="la"}
    $l.point1{assignNames="p1a"}
    $l.point2{assignNames="p2a"}
  </graph>


  `,
        });

        // Another torture test with state variables becoming unresolved
        // while being processed

        await test_line_self_references_points(core);
    });

    it("line with self references to points via reference", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
    <line name="l" through="(2$la.points[2][2]+1, 2$la.points[2][1]+1) ($la.points[1][1]+1, 1)"/>
    $l.point1{assignNames="p1"}
    $l.point2{assignNames="p2"}
  </graph>

  <graph>
    $l{name="la"}
    $l.point1{assignNames="p1a"}
    $l.point2{assignNames="p2a"}
  </graph>


  `,
        });

        await test_line_self_references_points(core);
    });

    async function test_copy_and_overwrite_slope(
        core: PublicDoenetMLCore,
        initialX1: number,
        initialY1: number,
    ) {
        async function checkLines({
            x1,
            y1,
            x21,
            y21,
            x22,
            y22,
            slope1,
            slope2,
        }: {
            x1: number;
            y1: number;
            x21: number;
            y21: number;
            x22: number;
            y22: number;
            slope1: number;
            slope2: number;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.points[0][0].evaluate_to_constant(),
            ).closeTo(x1, 1e-12);
            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.points[0][1].evaluate_to_constant(),
            ).closeTo(y1, 1e-12);
            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.points[1][0].evaluate_to_constant(),
            ).closeTo(x21, 1e-12);
            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.points[1][1].evaluate_to_constant(),
            ).closeTo(y21, 1e-12);
            if (Number.isFinite(slope1)) {
                expect(
                    stateVariables[
                        "/g1/l"
                    ].stateValues.slope.evaluate_to_constant(),
                ).closeTo(slope1, 1e-12);
            } else {
                expect(
                    stateVariables[
                        "/g1/l"
                    ].stateValues.slope.evaluate_to_constant(),
                ).eq(slope1);
            }
            expect(stateVariables["/g1/A"].stateValues.xs[0].tree).closeTo(
                x1,
                1e-12,
            );
            expect(stateVariables["/g1/A"].stateValues.xs[1].tree).closeTo(
                y1,
                1e-12,
            );
            expect(stateVariables["/g1/B"].stateValues.xs[0].tree).closeTo(
                x21,
                1e-12,
            );
            expect(stateVariables["/g1/B"].stateValues.xs[1].tree).closeTo(
                y21,
                1e-12,
            );

            for (let g of ["/g2", "/g3", "/g4", "/g5"]) {
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.points[0][0].evaluate_to_constant(),
                ).closeTo(x1, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.points[0][1].evaluate_to_constant(),
                ).closeTo(y1, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.points[1][0].evaluate_to_constant(),
                ).closeTo(x22, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.points[1][1].evaluate_to_constant(),
                ).closeTo(y22, 1e-12);
                if (Number.isFinite(slope2)) {
                    expect(
                        stateVariables[
                            `${g}/l`
                        ].stateValues.slope.evaluate_to_constant(),
                    ).closeTo(slope2, 1e-12);
                } else {
                    expect(
                        stateVariables[
                            `${g}/l`
                        ].stateValues.slope.evaluate_to_constant(),
                    ).eq(slope2);
                }

                expect(stateVariables[`${g}/A`].stateValues.xs[0].tree).closeTo(
                    x1,
                    1e-12,
                );
                expect(stateVariables[`${g}/A`].stateValues.xs[1].tree).closeTo(
                    y1,
                    1e-12,
                );
                expect(stateVariables[`${g}/B`].stateValues.xs[0].tree).closeTo(
                    x22,
                    1e-12,
                );
                expect(stateVariables[`${g}/B`].stateValues.xs[1].tree).closeTo(
                    y22,
                    1e-12,
                );
            }
        }

        let x1 = initialX1;
        let y1 = initialY1;
        let d = 1;

        let slope1 = 1;
        let theta1 = Math.atan(slope1);
        let x21 = x1 + d * Math.cos(theta1);
        let y21 = y1 + d * Math.sin(theta1);

        let slope2 = 2;
        let theta2 = Math.atan(slope2);
        let x22 = x1 + d * Math.cos(theta2);
        let y22 = y1 + d * Math.sin(theta2);

        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move point A
        let dx = -1 - x1,
            dy = 5 - y1;
        x1 += dx;
        y1 += dy;
        x21 += dx;
        y21 += dy;
        x22 += dx;
        y22 += dy;
        await movePoint({ name: "/g1/A", x: x1, y: y1, core });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move point B
        x21 = -1;
        y21 = -4;
        slope1 = -Infinity;
        d = y1 - y21; // since -infinite slope
        x22 = x1 + d * Math.cos(theta2);
        y22 = y1 + d * Math.sin(theta2);
        await movePoint({ name: "/g1/B", x: x21, y: y21, core });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move line 1, ignores point2 coords
        dx = -1;
        dy = 3;
        x1 += dx;
        y1 += dy;
        x21 += dx;
        y21 += dy;
        x22 += dx;
        y22 += dy;
        await moveLine({
            name: "/g1/l",
            point1coords: [x1, y1],
            point2coords: [31, 22],
            core,
        });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // change slope 1
        slope1 = 0.5;
        d = y1 - y21; // since infinite slope
        theta1 = Math.atan(slope1);
        x21 = x1 + d * Math.cos(theta1);
        y21 = y1 + d * Math.sin(theta1);
        await updateMathInputValue({
            latex: `${slope1}`,
            name: "/slope1",
            core,
        });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move point A2
        dx = -6;
        dy = -9;
        x1 += dx;
        y1 += dy;
        x21 += dx;
        y21 += dy;
        x22 += dx;
        y22 += dy;
        await movePoint({ name: "/g2/A", x: x1, y: y1, core });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move point B2
        x22 = 6;
        y22 = -6;
        slope2 = (y22 - y1) / (x22 - x1);
        theta2 = Math.atan(slope2);
        d = (x22 - x1) / Math.cos(theta2);
        x21 = x1 + d * Math.cos(theta1);
        y21 = y1 + d * Math.sin(theta1);
        await movePoint({ name: "/g2/B", x: x22, y: y22, core });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move line 2, ignores point2 coords
        dx = 3;
        dy = 6;
        x1 += dx;
        y1 += dy;
        x21 += dx;
        y21 += dy;
        x22 += dx;
        y22 += dy;
        await moveLine({
            name: "/g2/l",
            point1coords: [x1, y1],
            point2coords: [-73, 58],
            core,
        });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move point A3
        dx = 4;
        dy = -11;
        x1 += dx;
        y1 += dy;
        x21 += dx;
        y21 += dy;
        x22 += dx;
        y22 += dy;
        await movePoint({ name: "/g3/A", x: x1, y: y1, core });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move point B3
        x22 = 6;
        y22 = -3;
        slope2 = (y22 - y1) / (x22 - x1);
        theta2 = Math.atan(slope2);
        d = (x22 - x1) / Math.cos(theta2);
        x21 = x1 + d * Math.cos(theta1);
        y21 = y1 + d * Math.sin(theta1);
        await movePoint({ name: "/g3/B", x: x22, y: y22, core });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // change slope 2
        slope2 = -3;
        dx = x22 - x1;
        dy = y22 - y1;
        d = Math.sqrt(dx * dx + dy * dy);
        theta2 = Math.atan(slope2);
        x22 = x1 + d * Math.cos(theta2);
        y22 = y1 + d * Math.sin(theta2);
        await updateMathInputValue({
            latex: `${slope2}`,
            name: "/slope2",
            core,
        });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move line 3, ignores point2 coords
        dx = -8;
        dy = 14;
        x1 += dx;
        y1 += dy;
        x21 += dx;
        y21 += dy;
        x22 += dx;
        y22 += dy;
        await moveLine({
            name: "/g3/l",
            point1coords: [x1, y1],
            point2coords: [18, 91],
            core,
        });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move point A4
        dx = 5;
        dy = -8;
        x1 += dx;
        y1 += dy;
        x21 += dx;
        y21 += dy;
        x22 += dx;
        y22 += dy;
        await movePoint({ name: "/g4/A", x: x1, y: y1, core });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move point B4
        x22 = -4;
        y22 = 4;
        slope2 = (y22 - y1) / (x22 - x1);
        theta2 = Math.atan(slope2);
        d = y22 - y1; // since slope2 is infinity
        x21 = x1 + d * Math.cos(theta1);
        y21 = y1 + d * Math.sin(theta1);
        await movePoint({ name: "/g4/B", x: x22, y: y22, core });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move line 4, ignores point2 coords
        dx = -1;
        dy = 2;
        x1 += dx;
        y1 += dy;
        x21 += dx;
        y21 += dy;
        x22 += dx;
        y22 += dy;
        await moveLine({
            name: "/g4/l",
            point1coords: [x1, y1],
            point2coords: [18, 91],
            core,
        });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move point A5
        dx = 6;
        dy = -6;
        x1 += dx;
        y1 += dy;
        x21 += dx;
        y21 += dy;
        x22 += dx;
        y22 += dy;
        await movePoint({ name: "/g5/A", x: x1, y: y1, core });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move point B5
        x22 = -8;
        y22 = -7;
        slope2 = (y22 - y1) / (x22 - x1);
        theta2 = Math.atan(slope2);
        d = (x22 - x1) / Math.cos(theta2);
        x21 = x1 + d * Math.cos(theta1);
        y21 = y1 + d * Math.sin(theta1);
        await movePoint({ name: "/g5/B", x: x22, y: y22, core });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move line 5, ignores point2 coords
        dx = 6;
        dy = 3;
        x1 += dx;
        y1 += dy;
        x21 += dx;
        y21 += dy;
        x22 += dx;
        y22 += dy;
        await moveLine({
            name: "/g5/l",
            point1coords: [x1, y1],
            point2coords: [18, 91],
            core,
        });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    }

    it("line through one point and given slope, copy and overwrite slope", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>slope1: <mathInput name="slope1" prefill="1" /></p>
  <p>slope2: <mathInput name="slope2" prefill="2" /></p>
  
  <graph name="g1" newNamespace>
    <line through="(-5,9)" slope="$(../slope1)" name="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}
  </graph>

  <graph name="g2" newNamespace>
    $(../g1/l{slope="$(../slope2)" name="l"})
    $(../g2/l.point1{assignNames="A"})
    $(../g2/l.point2{assignNames="B"})
  </graph>

  <graph newNamespace name="g3">
    $(../g2/l{name="l"})
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g4">
    $(../g3/l{name="l"})
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  $g2{name="g5"}

  `,
        });

        await test_copy_and_overwrite_slope(core, -5, 9);
    });

    it("line with just given slope, copy and overwrite slope", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>slope1: <mathInput name="slope1" prefill="1" /></p>
  <p>slope2: <mathInput name="slope2" prefill="2" /></p>
  
  <graph name="g1" newNamespace>
    <line slope="$(../slope1)" name="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}
  </graph>

  <graph name="g2" newNamespace>
    $(../g1/l{slope="$(../slope2)" name="l"})
    $(../g2/l.point1{assignNames="A"})
    $(../g2/l.point2{assignNames="B"})
  </graph>

  <graph newNamespace name="g3">
    $(../g2/l{name="l"})
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g4">
    $(../g3/l{name="l"})
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  $g2{name="g5"}

  `,
        });

        await test_copy_and_overwrite_slope(core, 0, 0);
    });

    async function test_copy_and_add_slope({
        core,
        initialX1,
        initialY1,
        initialX2,
        initialY2,
        flipFirstPoints = false,
    }: {
        core: PublicDoenetMLCore;
        initialX1: number;
        initialY1: number;
        initialX2: number;
        initialY2: number;
        flipFirstPoints?: boolean;
    }) {
        // Note: we have to flip the points of the first line
        // in g1 in the case where first line has no parameters.
        // This requirement is an unfortunate consequence of making the conventions
        // natural for adding a single point, making the second point (0,0).
        // Using that convention, we choose the first point to be (1,0)
        // and the second point to be (0,0) when there are no parameters.
        // However, if we add a slope and no points, we want the first
        // point to be (0,0) and the second point be determined by the slope.
        // For this reason, the second point for the line with no parameters
        // ends up being mirrored b the first point of the line adding a slope!

        let g1P1 = flipFirstPoints ? "/g1/B" : "/g1/A";
        let g1P2 = flipFirstPoints ? "/g1/A" : "/g1/B";

        async function checkLines({
            x1,
            y1,
            x21,
            y21,
            x22,
            y22,
            slope1,
            slope2,
        }: {
            x1: number;
            y1: number;
            x21: number;
            y21: number;
            x22: number;
            y22: number;
            slope1: number;
            slope2: number;
        }) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            let i1 = flipFirstPoints ? 1 : 0;
            let i2 = flipFirstPoints ? 0 : 1;
            expect(
                stateVariables["/g1/l"].stateValues.points[
                    i1
                ][0].evaluate_to_constant(),
            ).closeTo(x1, 1e-12);
            expect(
                stateVariables["/g1/l"].stateValues.points[
                    i1
                ][1].evaluate_to_constant(),
            ).closeTo(y1, 1e-12);
            expect(
                stateVariables["/g1/l"].stateValues.points[
                    i2
                ][0].evaluate_to_constant(),
            ).closeTo(x21, 1e-12);
            expect(
                stateVariables["/g1/l"].stateValues.points[
                    i2
                ][1].evaluate_to_constant(),
            ).closeTo(y21, 1e-12);
            if (Number.isFinite(slope1)) {
                expect(
                    stateVariables[
                        "/g1/l"
                    ].stateValues.slope.evaluate_to_constant(),
                ).closeTo(slope1, 1e-12);
            } else {
                expect(
                    stateVariables[
                        "/g1/l"
                    ].stateValues.slope.evaluate_to_constant(),
                ).eq(slope1);
            }

            expect(stateVariables[g1P1].stateValues.xs[0].tree).closeTo(
                x1,
                1e-12,
            );
            expect(stateVariables[g1P1].stateValues.xs[1].tree).closeTo(
                y1,
                1e-12,
            );
            expect(stateVariables[g1P2].stateValues.xs[0].tree).closeTo(
                x21,
                1e-12,
            );
            expect(stateVariables[g1P2].stateValues.xs[1].tree).closeTo(
                y21,
                1e-12,
            );

            for (let g of ["/g2", "/g3", "/g4", "/g5"]) {
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.points[0][0].evaluate_to_constant(),
                ).closeTo(x1, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.points[0][1].evaluate_to_constant(),
                ).closeTo(y1, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.points[1][0].evaluate_to_constant(),
                ).closeTo(x22, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.points[1][1].evaluate_to_constant(),
                ).closeTo(y22, 1e-12);
                if (Number.isFinite(slope2)) {
                    expect(
                        stateVariables[
                            `${g}/l`
                        ].stateValues.slope.evaluate_to_constant(),
                    ).closeTo(slope2, 1e-12);
                } else {
                    expect(
                        stateVariables[
                            `${g}/l`
                        ].stateValues.slope.evaluate_to_constant(),
                    ).eq(slope2);
                }

                expect(stateVariables[`${g}/A`].stateValues.xs[0].tree).closeTo(
                    x1,
                    1e-12,
                );
                expect(stateVariables[`${g}/A`].stateValues.xs[1].tree).closeTo(
                    y1,
                    1e-12,
                );
                expect(stateVariables[`${g}/B`].stateValues.xs[0].tree).closeTo(
                    x22,
                    1e-12,
                );
                expect(stateVariables[`${g}/B`].stateValues.xs[1].tree).closeTo(
                    y22,
                    1e-12,
                );
            }
        }

        let x1 = initialX1,
            y1 = initialY1;
        let x21 = initialX2,
            y21 = initialY2;
        let slope1 = (y21 - y1) / (x21 - x1);
        let slope2 = 1;
        let d = 1;
        let theta2 = Math.atan(slope2);
        let x22 = x1 + d * Math.cos(theta2);
        let y22 = y1 + d * Math.sin(theta2);

        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move point A
        let dx = -1 - x1;
        let dy = 5 - y1;
        x1 += dx;
        y1 += dy;
        slope1 = (y21 - y1) / (x21 - x1);
        x22 += dx;
        y22 += dy;

        await movePoint({ name: g1P1, x: x1, y: y1, core });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move point B
        x21 = -1;
        y21 = -4;
        slope1 = flipFirstPoints ? Infinity : -Infinity;
        await movePoint({ name: g1P2, x: x21, y: y21, core });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move line 1
        dx = -1;
        dy = 3;
        x1 += dx;
        y1 += dy;
        x21 = 3;
        y21 = -4;
        x22 += dx;
        y22 += dy;
        slope1 = (y21 - y1) / (x21 - x1);
        await moveLine({
            name: "/g1/l",
            point1coords: flipFirstPoints ? [x21, y21] : [x1, y1],
            point2coords: flipFirstPoints ? [x1, y1] : [x21, y21],
            core,
        });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move point A2
        dx = -6;
        dy = -9;
        x1 += dx;
        y1 += dy;
        slope1 = (y21 - y1) / (x21 - x1);
        x22 += dx;
        y22 += dy;
        await movePoint({ name: "/g2/A", x: x1, y: y1, core });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move point B2
        x22 = 6;
        y22 = -6;
        slope2 = (y22 - y1) / (x22 - x1);
        theta2 = Math.atan(slope2);
        await movePoint({ name: "/g2/B", x: x22, y: y22, core });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move line 2, ignores point2 coords
        dx = 3;
        dy = 6;
        x1 += dx;
        y1 += dy;
        x22 += dx;
        y22 += dy;
        slope1 = (y21 - y1) / (x21 - x1);
        await moveLine({
            name: "/g2/l",
            point1coords: [x1, y1],
            point2coords: [-73, 58],
            core,
        });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move point A3
        dx = 4;
        dy = -11;
        x1 += dx;
        y1 += dy;
        x22 += dx;
        y22 += dy;
        slope1 = (y21 - y1) / (x21 - x1);
        await movePoint({ name: "/g3/A", x: x1, y: y1, core });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move point B3
        x22 = 6;
        y22 = -3;
        slope2 = (y22 - y1) / (x22 - x1);
        theta2 = Math.atan(slope2);
        await movePoint({ name: "/g3/B", x: x22, y: y22, core });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // change slope
        slope2 = -3;
        dx = x22 - x1;
        dy = y22 - y1;
        d = Math.sqrt(dx * dx + dy * dy);
        theta2 = Math.atan(slope2);
        x22 = x1 + d * Math.cos(theta2);
        y22 = y1 + d * Math.sin(theta2);
        await updateMathInputValue({
            latex: `${slope2}`,
            name: "/slope",
            core,
        });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move line 3, ignores point2 coords
        dx = -8;
        dy = 14;
        x1 += dx;
        y1 += dy;
        x22 += dx;
        y22 += dy;
        slope1 = (y21 - y1) / (x21 - x1);
        await moveLine({
            name: "/g3/l",
            point1coords: [x1, y1],
            point2coords: [18, 91],
            core,
        });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move point A4
        dx = 5;
        dy = -8;
        x1 += dx;
        y1 += dy;
        x22 += dx;
        y22 += dy;
        slope1 = (y21 - y1) / (x21 - x1);
        await movePoint({ name: "/g4/A", x: x1, y: y1, core });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move point B4
        x22 = -4;
        y22 = 4;
        slope2 = (y22 - y1) / (x22 - x1);
        theta2 = Math.atan(slope2);
        await movePoint({ name: "/g4/B", x: x22, y: y22, core });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move line 4, ignores point2 coords
        dx = -1;
        dy = 2;
        x1 += dx;
        y1 += dy;
        x22 += dx;
        y22 += dy;
        slope1 = (y21 - y1) / (x21 - x1);
        await moveLine({
            name: "/g4/l",
            point1coords: [x1, y1],
            point2coords: [18, 91],
            core,
        });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move point A5
        dx = 6;
        dy = -6;
        x1 += dx;
        y1 += dy;
        x22 += dx;
        y22 += dy;
        slope1 = (y21 - y1) / (x21 - x1);
        await movePoint({ name: "/g5/A", x: x1, y: y1, core });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move point B5
        x22 = -8;
        y22 = -7;
        slope2 = (y22 - y1) / (x22 - x1);
        theta2 = Math.atan(slope2);
        await movePoint({ name: "/g5/B", x: x22, y: y22, core });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });

        // move line 5, ignores point2 coords
        dx = 6;
        dy = 3;
        x1 += dx;
        y1 += dy;
        x22 += dx;
        y22 += dy;
        slope1 = (y21 - y1) / (x21 - x1);
        await moveLine({
            name: "/g5/l",
            point1coords: [x1, y1],
            point2coords: [18, 91],
            core,
        });
        await checkLines({ x1, y1, x21, y21, x22, y22, slope1, slope2 });
    }

    it("line through one point, copy and add slope", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>slope: <mathInput name="slope" prefill="1" /></p>
  
  <graph name="g1" newNamespace>
    <line through="(-5,9)" name="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}
  </graph>

  <graph name="g2" newNamespace>
    $(../g1/l{slope="$(../slope)" name="l"})
    $(../g2/l.point1{assignNames="A"})
    $(../g2/l.point2{assignNames="B"})
  </graph>

  <graph newNamespace name="g3">
    $(../g2/l{name="l"})
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g4">
    $(../g3/l{name="l"})
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  $g2{name="g5"}

  `,
        });

        await test_copy_and_add_slope({
            core,
            initialX1: -5,
            initialY1: 9,
            initialX2: 0,
            initialY2: 0,
        });
    });

    it("line with no parameters, copy and add slope", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>slope: <mathInput name="slope" prefill="1" /></p>
  
  <graph name="g1" newNamespace>
    <line name="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}
  </graph>

  <graph name="g2" newNamespace>
    $(../g1/l{slope="$(../slope)" name="l"})
    $(../g2/l.point1{assignNames="A"})
    $(../g2/l.point2{assignNames="B"})
  </graph>

  <graph newNamespace name="g3">
    $(../g2/l{name="l"})
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g4">
    $(../g3/l{name="l"})
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  $g2{name="g5"}
  
  `,
        });

        await test_copy_and_add_slope({
            core,
            initialX1: 0,
            initialY1: 0,
            initialX2: 1,
            initialY2: 0,
            flipFirstPoints: true,
        });
    });

    it("line with just given slope, copy and add through point", async () => {
        let core = await createTestCore({
            doenetML: `
  <p>slope: <mathInput name="slope" prefill="1" /></p>
  
  <graph name="g1" newNamespace>
    <line slope="$(../slope)" name="l" />
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}
  </graph>

  <graph name="g2" newNamespace>
    $(../g1/l{through="(-5,9)" name="l"})
    $(../g2/l.point1{assignNames="A"})
    $(../g2/l.point2{assignNames="B"})
  </graph>

  <graph newNamespace name="g3">
    $(../g2/l{name="l"})
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  <graph newNamespace name="g4">
    $(../g3/l{name="l"})
    $l.point1{assignNames="A"}
    $l.point2{assignNames="B"}  
  </graph>

  $g2{name="g5"}


  
  `,
        });

        async function checkLines({
            x11,
            y11,
            x12,
            y12,
            x21,
            y21,
            x22,
            y22,
            slope,
        }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.points[0][0].evaluate_to_constant(),
            ).closeTo(x11, 1e-12);
            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.points[0][1].evaluate_to_constant(),
            ).closeTo(y11, 1e-12);
            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.points[1][0].evaluate_to_constant(),
            ).closeTo(x21, 1e-12);
            expect(
                stateVariables[
                    "/g1/l"
                ].stateValues.points[1][1].evaluate_to_constant(),
            ).closeTo(y21, 1e-12);
            if (Number.isFinite(slope)) {
                expect(
                    stateVariables[
                        "/g1/l"
                    ].stateValues.slope.evaluate_to_constant(),
                ).closeTo(slope, 1e-12);
            } else {
                expect(
                    stateVariables[
                        "/g1/l"
                    ].stateValues.slope.evaluate_to_constant(),
                ).eq(slope);
            }

            expect(stateVariables["/g1/A"].stateValues.xs[0].tree).closeTo(
                x11,
                1e-12,
            );
            expect(stateVariables["/g1/A"].stateValues.xs[1].tree).closeTo(
                y11,
                1e-12,
            );
            expect(stateVariables["/g1/B"].stateValues.xs[0].tree).closeTo(
                x21,
                1e-12,
            );
            expect(stateVariables["/g1/B"].stateValues.xs[1].tree).closeTo(
                y21,
                1e-12,
            );

            for (let g of ["/g2", "/g3", "/g4", "/g5"]) {
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.points[0][0].evaluate_to_constant(),
                ).closeTo(x12, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.points[0][1].evaluate_to_constant(),
                ).closeTo(y12, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.points[1][0].evaluate_to_constant(),
                ).closeTo(x22, 1e-12);
                expect(
                    stateVariables[
                        `${g}/l`
                    ].stateValues.points[1][1].evaluate_to_constant(),
                ).closeTo(y22, 1e-12);
                if (Number.isFinite(slope)) {
                    expect(
                        stateVariables[
                            `${g}/l`
                        ].stateValues.slope.evaluate_to_constant(),
                    ).closeTo(slope, 1e-12);
                } else {
                    expect(
                        stateVariables[
                            `${g}/l`
                        ].stateValues.slope.evaluate_to_constant(),
                    ).eq(slope);
                }

                expect(stateVariables[`${g}/A`].stateValues.xs[0].tree).closeTo(
                    x12,
                    1e-12,
                );
                expect(stateVariables[`${g}/A`].stateValues.xs[1].tree).closeTo(
                    y12,
                    1e-12,
                );
                expect(stateVariables[`${g}/B`].stateValues.xs[0].tree).closeTo(
                    x22,
                    1e-12,
                );
                expect(stateVariables[`${g}/B`].stateValues.xs[1].tree).closeTo(
                    y22,
                    1e-12,
                );
            }
        }

        let x11 = 0,
            y11 = 0;
        let x12 = -5,
            y12 = 9;
        let slope = 1;
        let d = 1;
        let theta = Math.atan(slope);
        let x21 = x11 + d * Math.cos(theta);
        let y21 = y11 + d * Math.sin(theta);
        let x22 = x12 + d * Math.cos(theta);
        let y22 = y12 + d * Math.sin(theta);
        await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });

        // move point A
        let dx = 4,
            dy = -4;
        x11 += dx;
        y11 += dy;
        x21 += dx;
        y21 += dy;
        await movePoint({ name: "/g1/A", x: x11, y: y11, core });
        await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });

        // move point B
        dx = -d * Math.cos(theta);
        dy = 4;
        x21 += dx;
        y21 += dy;
        x22 += dx;
        y22 += dy;
        slope = (y21 - y11) / (x21 - x11);
        await movePoint({ name: "/g1/B", x: x21, y: y21, core });
        await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });

        // move line 1, ignore point2 coords
        dx = -1;
        dy = 3;
        x11 += dx;
        y11 += dy;
        x21 += dx;
        y21 += dy;
        await moveLine({
            name: "/g1/l",
            point1coords: [x11, y11],
            point2coords: [93, -92],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });

        // move point A2
        dx = -6;
        dy = -9;
        x12 += dx;
        y12 += dy;
        x22 += dx;
        y22 += dy;
        await movePoint({ name: "/g2/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });

        // move point B2
        x22 = 6;
        y22 = -6;
        slope = (y22 - y12) / (x22 - x12);
        theta = Math.atan(slope);
        x21 = x11 + x22 - x12;
        y21 = y11 + y22 - y12;
        await movePoint({ name: "/g2/B", x: x22, y: y22, core });
        await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });

        // move line 2, ignores point2 coords
        dx = 3;
        dy = 6;
        x12 += dx;
        y12 += dy;
        x22 += dx;
        y22 += dy;
        await moveLine({
            name: "/g2/l",
            point1coords: [x12, y12],
            point2coords: [-73, 58],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });

        // move point A3
        dx = 4;
        dy = -11;
        x12 += dx;
        y12 += dy;
        x22 += dx;
        y22 += dy;
        await movePoint({ name: "/g3/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });

        // move point B3
        x22 = 6;
        y22 = -3;
        slope = (y22 - y12) / (x22 - x12);

        theta = Math.atan(slope);
        x21 = x11 + x22 - x12;
        y21 = y11 + y22 - y12;
        await movePoint({ name: "/g3/B", x: x22, y: y22, core });
        await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });

        // change slope
        slope = -3;
        dx = x22 - x12;
        dy = y22 - y12;
        d = Math.sqrt(dx * dx + dy * dy);
        theta = Math.atan(slope);
        x22 = x12 + d * Math.cos(theta);
        y22 = y12 + d * Math.sin(theta);
        x21 = x11 + d * Math.cos(theta);
        y21 = y11 + d * Math.sin(theta);
        await updateMathInputValue({ latex: "-3", name: "/slope", core });
        await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });

        // move line 3, ignores point2 coords
        dx = -8;
        dy = 14;
        x12 += dx;
        y12 += dy;
        x22 += dx;
        y22 += dy;
        await moveLine({
            name: "/g3/l",
            point1coords: [x12, y12],
            point2coords: [18, 91],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });

        // move point A4
        dx = 5;
        dy = -8;
        x12 += dx;
        y12 += dy;
        x22 += dx;
        y22 += dy;
        await movePoint({ name: "/g4/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });

        // move point B4
        x22 = -4;
        y22 = 4;
        slope = (y22 - y12) / (x22 - x12);
        theta = Math.atan(slope);
        x21 = x11 + x22 - x12;
        y21 = y11 + y22 - y12;
        await movePoint({ name: "/g4/B", x: x22, y: y22, core });
        await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });

        // move line 4, ignores point2 coords
        dx = -1;
        dy = 2;
        x12 += dx;
        y12 += dy;
        x22 += dx;
        y22 += dy;
        await moveLine({
            name: "/g4/l",
            point1coords: [x12, y12],
            point2coords: [18, 91],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });

        // move point A5
        dx = 6;
        dy = -6;
        x12 += dx;
        y12 += dy;
        x22 += dx;
        y22 += dy;
        await movePoint({ name: "/g5/A", x: x12, y: y12, core });
        await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });

        // move point B5
        x22 = -8;
        y22 = -7;
        slope = (y22 - y12) / (x22 - x12);
        theta = Math.atan(slope);
        x21 = x11 + x22 - x12;
        y21 = y11 + y22 - y12;
        await movePoint({ name: "/g5/B", x: x22, y: y22, core });
        await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });

        // move line 5, ignores point2 coords
        dx = 6;
        dy = 3;
        x12 += dx;
        y12 += dy;
        x22 += dx;
        y22 += dy;
        await moveLine({
            name: "/g5/l",
            point1coords: [x12, y12],
            point2coords: [18, 91],
            core,
        });
        await checkLines({ x11, y11, x12, y12, x21, y21, x22, y22, slope });
    });

    // Note: other point constrained to line tests are with the point tests
    it("point constrained to line, different scales from graph", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph xMin="-110" xMax="110" yMin="-0.11" yMax="0.11">
    <line through="(0,0) (1,0.05)" name="l" />
    <point x="100" y="0" name="P">
      <constraints>
        <constrainTo relativeToGraphScales>$l</constrainTo>
      </constraints>
    </point>
  </graph>
  `,
        });

        // point on line, close to origin

        let stateVariables = await core.returnAllStateVariables(false, true);
        let x = stateVariables["/P"].stateValues.xs[0].tree;
        let y = stateVariables["/P"].stateValues.xs[1].tree;

        expect(y).greaterThan(0);
        expect(y).lessThan(0.01);

        expect(x).closeTo(20 * y, 1e-10);

        // move point
        await movePoint({ name: "/P", x: -100, y: 0.05, core });

        stateVariables = await core.returnAllStateVariables(false, true);
        x = stateVariables["/P"].stateValues.xs[0].tree;
        y = stateVariables["/P"].stateValues.xs[1].tree;
        expect(y).lessThan(0.05);
        expect(y).greaterThan(0.04);
        expect(x).closeTo(20 * y, 1e-10);
    });

    it("copy propIndex of points, array notation", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph>
      <line name="l" through="(2,-3) (3,4)" />
    </graph>
 
    <p><mathInput name="n" /></p>

    <p><copy source="l.points[$n]" assignNames="P1 P2" /></p>
    <p><copy source="l.point2[$n]" assignNames="x" /></p>
    <p><copy source="l.points[2][$n]" assignNames="xa" /></p>

    `,
        });

        let t1x = 2,
            t1y = -3;
        let t2x = 3,
            t2y = 4;

        async function check_items(n: number) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            if (n === 1) {
                expect(
                    stateVariables["/P1"].stateValues.xs.map((v) => v.tree),
                ).eqls([t1x, t1y]);
                expect(stateVariables["/x"].stateValues.value.tree).eq(t2x);
                expect(stateVariables["/xa"].stateValues.value.tree).eq(t2x);
            } else if (n === 2) {
                expect(
                    stateVariables["/P1"].stateValues.xs.map((v) => v.tree),
                ).eqls([t2x, t2y]);
                expect(stateVariables["/x"].stateValues.value.tree).eq(t2y);
                expect(stateVariables["/xa"].stateValues.value.tree).eq(t2y);
            } else {
                expect(stateVariables["/P1"]).eq(undefined);
                expect(stateVariables["/x"]).eq(undefined);
                expect(stateVariables["/xa"]).eq(undefined);
            }
            expect(stateVariables["/P2"]).eq(undefined);
        }

        await check_items(NaN);

        await updateMathInputValue({ latex: "1", name: "/n", core });
        await check_items(1);

        await updateMathInputValue({ latex: "2", name: "/n", core });
        await check_items(2);

        await updateMathInputValue({ latex: "3", name: "/n", core });
        await check_items(3);
    });

    it("display digits and decimals, overwrite in copies", async () => {
        let core = await createTestCore({
            doenetML: `
    <line name="l" equation="0=528.2340235234x + 2.235980242343224y+0.0486234234" />
    <line name="ldg4" displayDigits="4" copySource="l" />
    <line name="ldc3" displayDecimals="3" copySource="l" />
    <line name="ldc3dg4" displayDigits="4" displayDecimals="3" copySource="ldc3" />
    <line name="ldg4dc3" displayDecimals="3" displayDigits="4" copySource="ldg4" />
    <line name="ldg5" displayDigits="5" copySource="ldg4dc3" />
    <line name="ldc4" displayDecimals="4" copySource="ldc3dg4" />
    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/l"].stateValues.text).eq(
            "0 = 528.23 x + 2.24 y + 0.0486",
        );
        expect(stateVariables["/ldg4"].stateValues.text).eq(
            "0 = 528.2 x + 2.236 y + 0.04862",
        );
        expect(stateVariables["/ldc3"].stateValues.text).eq(
            "0 = 528.234 x + 2.236 y + 0.049",
        );
        expect(stateVariables["/ldc3dg4"].stateValues.text).eq(
            "0 = 528.234 x + 2.236 y + 0.04862",
        );
        expect(stateVariables["/ldg4dc3"].stateValues.text).eq(
            "0 = 528.234 x + 2.236 y + 0.04862",
        );
        expect(stateVariables["/ldg5"].stateValues.text).eq(
            "0 = 528.23 x + 2.236 y + 0.048623",
        );
        expect(stateVariables["/ldc4"].stateValues.text).eq(
            "0 = 528.234 x + 2.236 y + 0.0486",
        );
    });

    it("label positioning", async () => {
        let core = await createTestCore({
            doenetML: `
    <graph name="g">
      <line through="(1,2) (3,4)" labelPosition="$labelPos" name="l">
        <label>$label</label>
      </line>
    </graph>

    <p>label: <textInput name="label" prefill="line" /></p>
    <p>position:
    <choiceInput inline preselectChoice="1" name="labelPos">
      <choice>upperRight</choice>
      <choice>upperLeft</choice>
      <choice>lowerRight</choice>
      <choice>lowerLeft</choice>
    </choiceInput>
    </p>
    `,
        });

        async function check_items(label: string, position: string) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/l"].stateValues.label).eq(label);
            expect(stateVariables["/l"].stateValues.labelPosition).eq(
                position.toLowerCase(),
            );
            expect(stateVariables["/labelPos"].stateValues.selectedValues).eqls(
                [position],
            );
        }

        await check_items("line", "upperRight");

        await updateTextInputValue({ text: "l", name: "/label", core });
        await check_items("l", "upperRight");

        await updateSelectedIndices({
            name: "/labelPos",
            selectedIndices: [2],
            core,
        });
        await check_items("l", "upperLeft");

        await updateSelectedIndices({
            name: "/labelPos",
            selectedIndices: [3],
            core,
        });
        await check_items("l", "lowerRight");

        await updateSelectedIndices({
            name: "/labelPos",
            selectedIndices: [4],
            core,
        });
        await check_items("l", "lowerLeft");
    });

    it("color line text via style", async () => {
        let core = await createTestCore({
            doenetML: `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="2" textColor="green" />
        <styleDefinition styleNumber="3" textColor="red" backgroundColor="blue" />
      </styleDefinitions>
    </setup>

    <p>Style number: <mathInput prefill="1" name="sn" /></p>

    <p><line name="no_style">y=x</line> is <text name="tsd_no_style">$no_style.textStyleDescription</text>, i.e., the text color is <text name="tc_no_style">$no_style.textColor</text> and the background color is <text name="bc_no_style">$no_style.backgroundColor</text>.</p>
    <p><line name="fixed_style" styleNumber="2">y=2x</line> is <text name="tsd_fixed_style">$fixed_style.textStyleDescription</text>, i.e., the text color is <text name="tc_fixed_style">$fixed_style.textColor</text> and the background color is <text name="bc_fixed_style">$fixed_style.backgroundColor</text>.</p>
    <p><line name="variable_style" styleNumber="$sn">y=3x</line> is <text name="tsd_variable_style">$variable_style.textStyleDescription</text>, i.e., the text color is <text name="tc_variable_style">$variable_style.textColor</text> and the background color is <text name="bc_variable_style">$variable_style.backgroundColor</text>.</p>

    <graph>
      $no_style{anchor="(1,2)"}
      $fixed_style{anchor="(3,4)"}
      $variable_style
    </graph>

    `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/tsd_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/tc_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/bc_no_style"].stateValues.text).eq("none");

        expect(stateVariables["/tsd_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/tc_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/bc_fixed_style"].stateValues.text).eq("none");

        expect(stateVariables["/tsd_variable_style"].stateValues.text).eq(
            "black",
        );
        expect(stateVariables["/tc_variable_style"].stateValues.text).eq(
            "black",
        );
        expect(stateVariables["/bc_variable_style"].stateValues.text).eq(
            "none",
        );

        await updateMathInputValue({ latex: "2", name: "/sn", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/tsd_variable_style"].stateValues.text).eq(
            "green",
        );
        expect(stateVariables["/tc_variable_style"].stateValues.text).eq(
            "green",
        );
        expect(stateVariables["/bc_variable_style"].stateValues.text).eq(
            "none",
        );

        expect(stateVariables["/tsd_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/tc_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/bc_no_style"].stateValues.text).eq("none");

        expect(stateVariables["/tsd_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/tc_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/bc_fixed_style"].stateValues.text).eq("none");

        await updateMathInputValue({ latex: "3", name: "/sn", core });
        stateVariables = await core.returnAllStateVariables(false, true);

        expect(stateVariables["/tsd_variable_style"].stateValues.text).eq(
            "red with a blue background",
        );
        expect(stateVariables["/tc_variable_style"].stateValues.text).eq("red");
        expect(stateVariables["/bc_variable_style"].stateValues.text).eq(
            "blue",
        );

        expect(stateVariables["/tsd_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/tc_no_style"].stateValues.text).eq("black");
        expect(stateVariables["/bc_no_style"].stateValues.text).eq("none");

        expect(stateVariables["/tsd_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/tc_fixed_style"].stateValues.text).eq("green");
        expect(stateVariables["/bc_fixed_style"].stateValues.text).eq("none");
    });

    it("line through two points, one constrained to grid", async () => {
        let core = await createTestCore({
            doenetML: `
  <graph>
  <point name="P" labelIsName>(3,5)
    <constraints><constrainToGrid dx="2" dy="3" /></constraints>
    </point>
  <point name="Q" labelIsName>(-4,-1)</point>
  <line name="l" through="$P $Q" />
  </graph>
    `,
        });

        async function check_items(
            x1: number,
            y1: number,
            x2: number,
            y2: number,
        ) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(stateVariables["/P"].stateValues.xs[0].tree).eq(x1);
            expect(stateVariables["/P"].stateValues.xs[1].tree).eq(y1);
            expect(stateVariables["/Q"].stateValues.xs[0].tree).eq(x2);
            expect(stateVariables["/Q"].stateValues.xs[1].tree).eq(y2);
        }
        let x1 = 4,
            y1 = 6;
        let x2 = -4,
            y2 = -1;

        await check_items(x1, y1, x2, y2);

        // move line down 4 and right 0.5 actually moves it down 3 and right none
        let dx = 0.5,
            dy = -4;

        let x1Desired = x1 + dx;
        let y1Desired = y1 + dy;
        let x2Desired = x2 + dx;
        let y2Desired = y2 + dy;

        dx = 0;
        dy = -3;
        x1 += dx;
        y1 += dy;
        x2 += dx;
        y2 += dy;

        await moveLine({
            name: "/l",
            point1coords: [x1Desired, y1Desired],
            point2coords: [x2Desired, y2Desired],
            core,
        });

        await check_items(x1, y1, x2, y2);
    });

    it("3D line parallel to another 3D line", async () => {
        let core = await createTestCore({
            doenetML: `
    <point name="A1">(3,5,6)</point>
    <point name="B1">(4,4,7)</point>
    <line name="l1" through="$A1 $B1" />
    <line name="l2" parallelTo="$l1" />
    $l2.points{assignNames="A2 B2"}
    `,
        });

        async function check_items({
            A1x,
            A1y,
            A1z,
            B1x,
            B1y,
            B1z,
            A2x,
            A2y,
            A2z,
            B2x,
            B2y,
            B2z,
        }: {
            A1x: number;
            A1y: number;
            A1z: number;
            B1x: number;
            B1y: number;
            B1z: number;
            A2x: number;
            A2y: number;
            A2z: number;
            B2x: number;
            B2y: number;
            B2z: number;
        }) {
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables["/l1"].stateValues.points[0].map((v) => v.tree),
            ).eqls([A1x, A1y, A1z]);
            expect(stateVariables["/l1"].stateValues.points[1][0].tree).closeTo(
                B1x,
                1e-12,
            );
            expect(stateVariables["/l1"].stateValues.points[1][1].tree).closeTo(
                B1y,
                1e-12,
            );
            expect(stateVariables["/l1"].stateValues.points[1][2].tree).closeTo(
                B1z,
                1e-12,
            );
            expect(
                stateVariables["/l2"].stateValues.points[0].map((v) => v.tree),
            ).eqls([A2x, A2y, A2z]);
            expect(stateVariables["/l2"].stateValues.points[1][0].tree).closeTo(
                B2x,
                1e-12,
            );
            expect(stateVariables["/l2"].stateValues.points[1][1].tree).closeTo(
                B2y,
                1e-12,
            );
            expect(stateVariables["/l2"].stateValues.points[1][2].tree).closeTo(
                B2z,
                1e-12,
            );
        }

        let A1x = 3;
        let A1y = 5;
        let A1z = 6;
        let B1x = 4;
        let B1y = 4;
        let B1z = 7;

        let A2x = 0;
        let A2y = 0;
        let A2z = 0;
        let B2x = 1 / Math.sqrt(3);
        let B2y = -1 / Math.sqrt(3);
        let B2z = 1 / Math.sqrt(3);

        await check_items({
            A1x,
            A1y,
            A1z,
            B1x,
            B1y,
            B1z,
            A2x,
            A2y,
            A2z,
            B2x,
            B2y,
            B2z,
        });

        // move A2
        let dx = 0.5,
            dy = -4,
            dz = 3;

        A2x += dx;
        A2y += dy;
        A2z += dz;
        B2x += dx;
        B2y += dy;
        B2z += dz;

        await movePoint({ name: "/A2", x: A2x, y: A2y, z: A2z, core });

        await check_items({
            A1x,
            A1y,
            A1z,
            B1x,
            B1y,
            B1z,
            A2x,
            A2y,
            A2z,
            B2x,
            B2y,
            B2z,
        });

        // move B2 rotates both lines

        // rotate in yz
        let theta = 0.4;

        let d2x = B2x - A2x;
        let d2y = B2y - A2y;
        let d2z = B2z - A2z;

        let c = Math.cos(theta);
        let s = Math.sin(theta);

        [d2y, d2z] = [c * d2y - s * d2z, s * d2y + c * d2z];

        // also stretch B2

        let stretch = 2;
        d2x *= stretch;
        d2y *= stretch;
        d2z *= stretch;

        B2x = A2x + d2x;
        B2y = A2y + d2y;
        B2z = A2z + d2z;

        // Rotate B1 around A1 by same angle,
        // keeping distance the same
        let d1x = B1x - A1x;
        let d1y = B1y - A1y;
        let d1z = B1z - A1z;

        [d1y, d1z] = [c * d1y - s * d1z, s * d1y + c * d1z];

        B1x = A1x + d1x;
        B1y = A1y + d1y;
        B1z = A1z + d1z;

        await movePoint({ name: "/B2", x: B2x, y: B2y, z: B2z, core });

        await check_items({
            A1x,
            A1y,
            A1z,
            B1x,
            B1y,
            B1z,
            A2x,
            A2y,
            A2z,
            B2x,
            B2y,
            B2z,
        });

        // move B1 rotates both lines

        // rotate in xz

        theta = 0.7;

        d1x = B1x - A1x;
        d1y = B1y - A1y;
        d1z = B1z - A1z;

        c = Math.cos(theta);
        s = Math.sin(theta);

        [d1x, d1z] = [c * d1x - s * d1z, s * d1x + c * d1z];

        // also stretch B1

        stretch = 3;
        d1x *= stretch;
        d1y *= stretch;
        d1z *= stretch;

        B1x = A1x + d1x;
        B1y = A1y + d1y;
        B1z = A1z + d1z;

        // Rotate B2 around A2 by same angle,
        // keeping distance the same
        d2x = B2x - A2x;
        d2y = B2y - A2y;
        d2z = B2z - A2z;

        [d2x, d2z] = [c * d2x - s * d2z, s * d2x + c * d2z];

        B2x = A2x + d2x;
        B2y = A2y + d2y;
        B2z = A2z + d2z;

        await movePoint({ name: "/B1", x: B1x, y: B1y, z: B1z, core });

        await check_items({
            A1x,
            A1y,
            A1z,
            B1x,
            B1y,
            B1z,
            A2x,
            A2y,
            A2z,
            B2x,
            B2y,
            B2z,
        });
    });

    it("style description changes with theme", async () => {
        const doenetML = `
    <setup>
      <styleDefinitions>
        <styleDefinition styleNumber="1" lineColor="brown" lineColorDarkMode="yellow" />
        <styleDefinition styleNumber="2" lineColor="#540907" lineColorWord="dark red" lineColorDarkMode="#f0c6c5" lineColorWordDarkMode="light red" />
      </styleDefinitions>
    </setup>
    <graph>
      <line name="A" styleNumber="1" labelIsName through="(0,0) (1,2)" />
      <line name="B" styleNumber="2" labelIsName through="(2,2) (3,4)" />
      <line name="C" styleNumber="5" labelIsName through="(4,4) (5,6)" />
    </graph>
    <p name="ADescription">Line A is $A.styleDescription.</p>
    <p name="BDescription">B is a $B.styleDescriptionWithNoun.</p>
    <p name="CDescription">C is a $C.styleDescriptionWithNoun.</p>
    `;

        async function test_items(theme: "dark" | "light") {
            const core = await createTestCore({ doenetML, theme });

            const AColor = theme === "dark" ? "yellow" : "brown";
            const BShade = theme === "dark" ? "light" : "dark";
            const CColor = theme === "dark" ? "white" : "black";

            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );

            expect(stateVariables["/ADescription"].stateValues.text).eq(
                `Line A is thick ${AColor}.`,
            );
            expect(stateVariables["/BDescription"].stateValues.text).eq(
                `B is a ${BShade} red line.`,
            );
            expect(stateVariables["/CDescription"].stateValues.text).eq(
                `C is a thin ${CColor} line.`,
            );
        }

        await test_items("light");
        await test_items("dark");
    });
});
