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

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

type Direction = "none" | "previous" | "next" | "both" | "symmetric";

async function changeVectorControlDirection({
    core,
    componentIdx,
    throughPointInd,
    direction,
}: {
    core: PublicDoenetMLCore;
    componentIdx: number;
    throughPointInd: number;
    direction: Direction;
}) {
    await core.requestAction({
        componentIdx,
        actionName: "changeVectorControlDirection",
        args: { throughPointInd, direction },
    });
}

async function setupScene(curveChildren: string) {
    let { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML:
            `
<graph name="g">
    <curve name="c" through="(1, 2) (3, 4) (-5, 6) (2, 1)">
    ` +
            curveChildren +
            `
    </curve>
</graph>

<graph name="g2">
    <curve extend="$g.c" name="c" />
</graph>

<graph extend="$g2" name="g3" />
  `,
    });

    return { core, resolvePathToNodeIdx };
}

async function runBezierTests({
    core,
    resolvePathToNodeIdx,
    initialDirections = ["none", "none", "none", "none"],
    initialControlVectors,
    haveControls = true,
}: {
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
    initialDirections?: Direction[];
    initialControlVectors?: (number[] | null)[][];
    haveControls?: boolean;
}) {
    let curveNames = ["g.c", "g2.c", "g3.c"];
    let throughPoints = [
        [1, 2],
        [3, 4],
        [-5, 6],
        [2, 1],
    ];
    let directions = [...initialDirections];
    let controlVectors = initialControlVectors;
    if (controlVectors) {
        controlVectors = [...controlVectors];
    }

    await checkAllCurves({
        core,
        resolvePathToNodeIdx,
        throughPoints,
        directions,
        controlVectors,
        curveNames,
    });

    await moveAllThroughPoints({
        curveNames,
        core,
        resolvePathToNodeIdx,
        throughPoints,
        offset: 1,
        directions,
        controlVectors,
    });

    await moveAllControlVectors({
        directions,
        curveNames,
        core,
        resolvePathToNodeIdx,
        throughPoints,
        controlVectors,
        offset: 2,
    });

    // we can't active or change any controls so no more to do
    if (!haveControls) {
        return;
    }

    if (!controlVectors) {
        controlVectors = [];
    }

    await switchAllControlVectors({
        directions,
        curveNames,
        core,
        resolvePathToNodeIdx,
        throughPoints,
        controlVectors,
        offset: 3,
    });
}

/**
 * Move each through point to new value (depending on offset).
 */
async function moveAllThroughPoints({
    curveNames,
    core,
    resolvePathToNodeIdx,
    throughPoints,
    offset = 0,
    directions,
    controlVectors,
}: {
    curveNames: string[];
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
    throughPoints: number[][];
    offset?: number;
    directions: Direction[];
    controlVectors: (number[] | null)[][] | undefined;
}) {
    for (let [ind, pt] of throughPoints.entries()) {
        // pick a curve name
        let name = curveNames[Math.abs(ind + offset) % curveNames.length];

        let newPt = [offset * ind + 1 + 0, 3 - 2 * ind * offset + 0];
        throughPoints[ind] = newPt;
        await moveThroughPoint({
            componentIdx: await resolvePathToNodeIdx(name),
            throughPointInd: ind,
            throughPoint: newPt,
            core,
        });
    }

    await checkAllCurves({
        core,
        resolvePathToNodeIdx,
        curveNames,
        throughPoints,
        directions,
        controlVectors,
    });
}

/**
 * Move each control vector that is specified to new value (depending on offset).
 * Or, if its direction is `none`, show that it cannot be moved
 */
async function moveAllControlVectors({
    directions,
    curveNames,
    core,
    resolvePathToNodeIdx,
    throughPoints,
    controlVectors,
    offset = 0,
}: {
    directions: Direction[];
    curveNames: string[];
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
    throughPoints: number[][];
    controlVectors: (number[] | null)[][] | undefined;
    offset?: number;
}) {
    for (let [ind, dir] of directions.entries()) {
        // pick a curve name
        let name = curveNames[Math.abs(ind + offset) % curveNames.length];

        if (dir === "none") {
            // if we have any control directions that are none, check to make sure
            // that we cannot move those control vectors
            // try unsuccessfully to move to some large value
            await moveControlVector({
                componentIdx: await resolvePathToNodeIdx(name),
                controlVectorInds: [ind, 0],
                controlVector: [99 + ind, ind - 98],
                core,
            });
        } else if (controlVectors) {
            let newVec = [offset - ind + 0, 2 * ind - offset + 0];

            // we are tracking control vectors and we have one we can move
            if (dir === "previous") {
                controlVectors[ind] = [newVec, null];
                await moveControlVector({
                    componentIdx: await resolvePathToNodeIdx(name),
                    controlVectorInds: [ind, 0],
                    controlVector: newVec,
                    core,
                });
            } else if (dir === "next") {
                controlVectors[ind] = [null, newVec];
                await moveControlVector({
                    componentIdx: await resolvePathToNodeIdx(name),
                    controlVectorInds: [ind, 1],
                    controlVector: newVec,
                    core,
                });
            } else if (dir === "symmetric") {
                // pick one side to move, the other will be reflected
                let side = Math.abs(offset % 2);
                controlVectors[ind] =
                    side == 1
                        ? [newVec.map((v) => -v + 0), newVec]
                        : [newVec, newVec.map((v) => -v + 0)];

                await moveControlVector({
                    componentIdx: await resolvePathToNodeIdx(name),
                    controlVectorInds: [ind, side],
                    controlVector: newVec,
                    core,
                });
            } else if (dir === "both") {
                // pick one side to move, the other will be unchanged
                let newVec2 = [
                    3 * offset + 2 * ind + 0,
                    -3 * ind - 2 * offset + 0,
                ];

                controlVectors[ind] = [newVec, newVec2];
                for (let side = 0; side < 2; side++) {
                    await moveControlVector({
                        componentIdx: await resolvePathToNodeIdx(name),
                        controlVectorInds: [ind, side],
                        controlVector: [newVec, newVec2][side],
                        core,
                    });
                }
            }
        }
    }

    // check that all moves were made as indicated (or didn't happen if not indicated)
    await checkAllCurves({
        core,
        resolvePathToNodeIdx,
        curveNames,
        throughPoints,
        directions,
        controlVectors,
    });
}

/**
 * For each control vector, change its direction.
 * Then move all control vectors and check their resulting values
 *
 */
async function switchAllControlVectors({
    directions,
    curveNames,
    core,
    resolvePathToNodeIdx,
    throughPoints,
    controlVectors,
    offset = 0,
}: {
    directions: Direction[];
    curveNames: string[];
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
    throughPoints: number[][];
    controlVectors: (number[] | null)[][];
    offset?: number;
}) {
    for (let [ind, dir] of directions.entries()) {
        // pick a curve name
        let name = curveNames[Math.abs(ind + offset) % curveNames.length];
        let newDirection: Direction;

        if (dir === "none") {
            newDirection = ["previous", "next", "symmetric", "both"][
                Math.abs((offset + ind) % 4)
            ] as Direction;
        } else if (dir === "previous") {
            newDirection = ["next", "symmetric", "both"][
                Math.abs((offset + ind) % 3)
            ] as Direction;
        } else if (dir === "next") {
            newDirection = ["symmetric", "both", "previous"][
                Math.abs((offset + ind) % 3)
            ] as Direction;
        } else if (dir === "symmetric") {
            newDirection = ["both", "previous", "next"][
                Math.abs((offset + ind) % 3)
            ] as Direction;
        } else {
            newDirection = ["previous", "next", "symmetric"][
                Math.abs((offset + ind) % 3)
            ] as Direction;
        }
        directions[ind] = newDirection;
        await changeVectorControlDirection({
            core,
            componentIdx: await resolvePathToNodeIdx(name),
            throughPointInd: ind,
            direction: newDirection,
        });
    }

    // Move all control vectors (so we know what their values are)
    // and then test them
    await moveAllControlVectors({
        core,
        resolvePathToNodeIdx,
        curveNames,
        directions,
        throughPoints,
        controlVectors,
        offset,
    });
}

async function checkAllCurves({
    core,
    resolvePathToNodeIdx,
    throughPoints,
    directions,
    controlVectors,
    curveNames,
}: {
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
    throughPoints?: number[][];
    directions?: Direction[];
    controlVectors?: (number[] | null)[][];
    curveNames: string[];
}) {
    for (let curveName of curveNames) {
        await checkCurve({
            core,
            resolvePathToNodeIdx,
            curveName,
            throughPoints,
            directions,
            controlVectors,
        });
    }
}

async function checkCurve({
    core,
    resolvePathToNodeIdx,
    curveName,
    throughPoints,
    directions,
    controlVectors,
}: {
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
    curveName: string;
    throughPoints?: number[][];
    directions?: Direction[];
    controlVectors?: (number[] | null)[][];
}) {
    const stateVariables = await core.returnAllStateVariables(false, true);
    const curve = stateVariables[await resolvePathToNodeIdx(curveName)];
    if (throughPoints) {
        expect(
            curve.stateValues.throughPoints.map((v) =>
                v.map((x) => x.tree + 0),
            ),
        ).eqls(throughPoints);
    }

    if (directions) {
        expect(curve.stateValues.vectorControlDirections).eqls(directions);
    }

    if (controlVectors && throughPoints) {
        for (let [ind, vecs] of controlVectors.entries()) {
            if (vecs) {
                let pt = throughPoints[ind];
                if (vecs[0]) {
                    expect(
                        curve.stateValues.controlVectors[ind][0].map(
                            (v) => v.tree + 0,
                        ),
                    ).eqls(vecs[0]);
                    if (pt) {
                        expect(
                            curve.stateValues.controlPoints[ind][0].map(
                                (v) => v.tree + 0,
                            ),
                        ).eqls([pt[0] + vecs[0][0], pt[1] + vecs[0][1]]);
                    }
                }
                if (vecs[1]) {
                    expect(
                        curve.stateValues.controlVectors[ind][1].map(
                            (v) => v.tree + 0,
                        ),
                    ).eqls(vecs[1]);
                    if (pt) {
                        expect(
                            curve.stateValues.controlPoints[ind][1].map(
                                (v) => v.tree + 0,
                            ),
                        ).eqls([pt[0] + vecs[1][0], pt[1] + vecs[1][1]]);
                    }
                }
            }
        }
    }
}

describe("Curve Tag Bezier Tests", async () => {
    it("no controls specified", async () => {
        let { core, resolvePathToNodeIdx } = await setupScene("");

        await runBezierTests({
            core,
            resolvePathToNodeIdx,
            haveControls: false,
        });
    });

    it("empty control", async () => {
        let { core, resolvePathToNodeIdx } =
            await setupScene("<bezierControls/>");

        await runBezierTests({ core, resolvePathToNodeIdx });
    });

    it("sugared controls", async () => {
        let { core, resolvePathToNodeIdx } = await setupScene(
            "<bezierControls>(3,1) (-1,5) (5,3) (0,0)</bezierControls>",
        );

        let initialDirections: Direction[] = [
            "symmetric",
            "symmetric",
            "symmetric",
            "symmetric",
        ];

        let initialControlVectors = [
            [
                [3, 1],
                [-3, -1],
            ],
            [
                [-1, 5],
                [1, -5],
            ],
            [
                [5, 3],
                [-5, -3],
            ],
            [
                [0, 0],
                [0, 0],
            ],
        ];

        await runBezierTests({
            core,
            resolvePathToNodeIdx,
            initialDirections,
            initialControlVectors,
        });
    });

    it("symmetric controls", async () => {
        let { core, resolvePathToNodeIdx } = await setupScene(
            `
    <bezierControls>
        <controlVectors><vector>(3,1)</vector></controlVectors>
        <controlVectors>(-1,5)</controlVectors>
        <controlVectors><vector>(5,3)</vector></controlVectors>
        <controlVectors>(0,0)</controlVectors>
    </bezierControls>
            `,
        );

        let initialDirections: Direction[] = [
            "symmetric",
            "symmetric",
            "symmetric",
            "symmetric",
        ];

        let initialControlVectors = [
            [
                [3, 1],
                [-3, -1],
            ],
            [
                [-1, 5],
                [1, -5],
            ],
            [
                [5, 3],
                [-5, -3],
            ],
            [
                [0, 0],
                [0, 0],
            ],
        ];

        await runBezierTests({
            core,
            resolvePathToNodeIdx,
            initialDirections,
            initialControlVectors,
        });
    });

    it("symmetric controls, specified by pointNumber", async () => {
        let { core, resolvePathToNodeIdx } = await setupScene(
            `
    <bezierControls>
        <controlVectors><vector>(3,1)</vector></controlVectors>
        <controlVectors pointNumber="3"><vector>(5,3)</vector></controlVectors>
        <controlVectors>(0,0)</controlVectors>
        <controlVectors pointNumber="2">(-1,5)</controlVectors>
    </bezierControls>
            `,
        );

        let initialDirections: Direction[] = [
            "symmetric",
            "symmetric",
            "symmetric",
            "symmetric",
        ];

        let initialControlVectors = [
            [
                [3, 1],
                [-3, -1],
            ],
            [
                [-1, 5],
                [1, -5],
            ],
            [
                [5, 3],
                [-5, -3],
            ],
            [
                [0, 0],
                [0, 0],
            ],
        ];

        await runBezierTests({
            core,
            resolvePathToNodeIdx,
            initialDirections,
            initialControlVectors,
        });
    });

    it("symmetric controls, specified by pointNumber, skipping one", async () => {
        let { core, resolvePathToNodeIdx } = await setupScene(
            `
    <bezierControls>
        <controlVectors><vector>(3,1)</vector></controlVectors>
        <controlVectors pointNumber="3"><vector>(5,3)</vector></controlVectors>
        <controlVectors>(0,0)</controlVectors>
    </bezierControls>
            `,
        );

        let initialDirections: Direction[] = [
            "symmetric",
            "none",
            "symmetric",
            "symmetric",
        ];

        let initialControlVectors = [
            [
                [3, 1],
                [-3, -1],
            ],
            [null, null],
            [
                [5, 3],
                [-5, -3],
            ],
            [
                [0, 0],
                [0, 0],
            ],
        ];

        await runBezierTests({
            core,
            resolvePathToNodeIdx,
            initialDirections,
            initialControlVectors,
        });
    });

    it("asymmetric controls", async () => {
        let { core, resolvePathToNodeIdx } = await setupScene(`
    <bezierControls>
          <controlVectors><vector>(3,1)</vector></controlVectors>
          <controlVectors direction="both">(-1,5) (4,2)</controlVectors>
          <controlVectors direction="both"><vector>(5,3)</vector><vector>(7,-1)</vector></controlVectors>
          <controlVectors>(0,0)</controlVectors>
    </bezierControls>
    `);

        let initialDirections: Direction[] = [
            "symmetric",
            "both",
            "both",
            "symmetric",
        ];

        let initialControlVectors = [
            [
                [3, 1],
                [-3, -1],
            ],
            [
                [-1, 5],
                [4, 2],
            ],
            [
                [5, 3],
                [7, -1],
            ],
            [
                [0, 0],
                [0, 0],
            ],
        ];

        await runBezierTests({
            core,
            resolvePathToNodeIdx,
            initialDirections,
            initialControlVectors,
        });
    });

    it("asymmetric controls, specified by pointNumber", async () => {
        let { core, resolvePathToNodeIdx } = await setupScene(`
    <bezierControls>
          <controlVectors pointNumber="4">(0,0)</controlVectors>
          <controlVectors pointNumber="3" direction="both"><vector>(5,3)</vector><vector>(7,-1)</vector></controlVectors>
          <controlVectors pointNumber="1"><vector>(3,1)</vector></controlVectors>
          <controlVectors direction="both">(-1,5) (4,2)</controlVectors>
    </bezierControls>
    `);

        let initialDirections: Direction[] = [
            "symmetric",
            "both",
            "both",
            "symmetric",
        ];

        let initialControlVectors = [
            [
                [3, 1],
                [-3, -1],
            ],
            [
                [-1, 5],
                [4, 2],
            ],
            [
                [5, 3],
                [7, -1],
            ],
            [
                [0, 0],
                [0, 0],
            ],
        ];

        await runBezierTests({
            core,
            resolvePathToNodeIdx,
            initialDirections,
            initialControlVectors,
        });
    });

    it("asymmetric controls, previous and next", async () => {
        let { core, resolvePathToNodeIdx } = await setupScene(`
    <bezierControls>
        <controlVectors><vector>(3,1)</vector></controlVectors>
        <controlVectors direction="previous">(-1,5)</controlVectors>
        <controlVectors direction="next"><vector>(5,3)</vector></controlVectors>
        <controlVectors>(0,0)</controlVectors>
    </bezierControls>
    `);

        let initialDirections: Direction[] = [
            "symmetric",
            "previous",
            "next",
            "symmetric",
        ];

        let initialControlVectors = [
            [
                [3, 1],
                [-3, -1],
            ],
            [[-1, 5], null],
            [null, [5, 3]],
            [
                [0, 0],
                [0, 0],
            ],
        ];

        await runBezierTests({
            core,
            resolvePathToNodeIdx,
            initialDirections,
            initialControlVectors,
        });
    });

    it("check use default bug is fixed", async () => {
        const doenetML = `
        <controlVectors name="cvs">(-1,5)</controlVectors>
        <controlVectors extend="$cvs" name="cv1a" />
    
        <p><textInput name="dira" bindValueTo="$(cvs.direction)" /></p>
    
        <p><textInput name="dirb" bindValueTo="$(cv1a.direction)" /></p>
        `;

        let { core, resolvePathToNodeIdx } = await createTestCore({ doenetML });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("dira")].stateValues
                .value,
        ).eq("symmetric");
        expect(
            stateVariables[await resolvePathToNodeIdx("dirb")].stateValues
                .value,
        ).eq("symmetric");
        expect(
            stateVariables[await resolvePathToNodeIdx("cvs")].stateValues
                .direction,
        ).eq("symmetric");
        expect(
            core.core!.components![await resolvePathToNodeIdx("cvs")].state
                .direction.usedDefault,
        ).be.true;
        expect(
            stateVariables[await resolvePathToNodeIdx("cv1a")].stateValues
                .direction,
        ).eq("symmetric");
        expect(
            core.core!.components![await resolvePathToNodeIdx("cv1a")].state
                .direction.usedDefault,
        ).be.true;

        await updateTextInputValue({
            text: "both",
            componentIdx: await resolvePathToNodeIdx("dira"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("dira")].stateValues
                .value,
        ).eq("both");
        expect(
            stateVariables[await resolvePathToNodeIdx("dirb")].stateValues
                .value,
        ).eq("both");
        expect(
            stateVariables[await resolvePathToNodeIdx("cvs")].stateValues
                .direction,
        ).eq("both");
        expect(
            core.core!.components![await resolvePathToNodeIdx("cvs")].state
                .direction.usedDefault,
        ).not.be.true;
        expect(
            stateVariables[await resolvePathToNodeIdx("cv1a")].stateValues
                .direction,
        ).eq("both");
        expect(
            core.core!.components![await resolvePathToNodeIdx("cv1a")].state
                .direction.usedDefault,
        ).not.be.true;

        ({ core, resolvePathToNodeIdx } = await createTestCore({ doenetML }));

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("dira")].stateValues
                .value,
        ).eq("symmetric");
        expect(
            stateVariables[await resolvePathToNodeIdx("dirb")].stateValues
                .value,
        ).eq("symmetric");
        expect(
            stateVariables[await resolvePathToNodeIdx("cvs")].stateValues
                .direction,
        ).eq("symmetric");
        expect(
            core.core!.components![await resolvePathToNodeIdx("cvs")].state
                .direction.usedDefault,
        ).be.true;
        expect(
            stateVariables[await resolvePathToNodeIdx("cv1a")].stateValues
                .direction,
        ).eq("symmetric");
        expect(
            core.core!.components![await resolvePathToNodeIdx("cv1a")].state
                .direction.usedDefault,
        ).be.true;

        await updateTextInputValue({
            text: "none",
            componentIdx: await resolvePathToNodeIdx("dirb"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("dira")].stateValues
                .value,
        ).eq("none");
        expect(
            stateVariables[await resolvePathToNodeIdx("dirb")].stateValues
                .value,
        ).eq("none");
        expect(
            stateVariables[await resolvePathToNodeIdx("cvs")].stateValues
                .direction,
        ).eq("none");
        expect(
            core.core!.components![await resolvePathToNodeIdx("cvs")].state
                .direction.usedDefault,
        ).not.be.true;
        expect(
            stateVariables[await resolvePathToNodeIdx("cv1a")].stateValues
                .direction,
        ).eq("none");
        expect(
            core.core!.components![await resolvePathToNodeIdx("cv1a")].state
                .direction.usedDefault,
        ).not.be.true;
    });

    it("constrain through points to grid", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph name="g">
    <point name="P1" x="1" y="2">
        <constrainToGrid />
    </point>
    <point name="P2" x="3" y="4">
        <constrainToGrid />
    </point>
    <point name="P3" x="-5" y="6">
        <constrainToGrid />
    </point>
    <point name="P4" x="2" y="1">
        <constrainToGrid />
    </point>
      
    <curve name="c" through="$P1 $P2 $P3 $P4">
      <bezierControls>
        (7,8) (3,1) 
        <controlVectors direction="both">(4,1) (0,0)</controlVectors>
        (-1,-2)
      </bezierControls>
    </curve>
    </graph>

    <graph name="g2">
      <curve extend="$g.c" name="c" />
    </graph>

    <graph extend="$g2" name="g3" />

    `,
        });

        let curveNames = ["g.c", "g2.c", "g3.c"];
        let throughPoints = [
            [1, 2],
            [3, 4],
            [-5, 6],
            [2, 1],
        ];
        let directions: Direction[] = [
            "symmetric",
            "symmetric",
            "both",
            "symmetric",
        ];
        let controlVectors = [
            [
                [7, 8],
                [-7, -8],
            ],
            [
                [3, 1],
                [-3, -1],
            ],
            [
                [4, 1],
                [0, 0],
            ],
            [
                [-1, -2],
                [1, 2],
            ],
        ];

        await checkAllCurves({
            core,
            resolvePathToNodeIdx,
            throughPoints,
            directions,
            controlVectors,
            curveNames,
        });

        // move through point on curve 1
        await moveThroughPoint({
            componentIdx: await resolvePathToNodeIdx("g.c"),
            throughPointInd: 1,
            throughPoint: [1.1, 8.7],
            core,
        });

        throughPoints[1] = [1, 9];
        await checkAllCurves({
            core,
            resolvePathToNodeIdx,
            throughPoints,
            directions,
            controlVectors,
            curveNames,
        });

        await moveAllControlVectors({
            directions,
            curveNames,
            throughPoints,
            controlVectors,
            offset: 2,
            core,
            resolvePathToNodeIdx,
        });

        // move original point determining through point
        await movePoint({
            componentIdx: await resolvePathToNodeIdx("P3"),
            x: -3.2,
            y: 4.9,
            core,
        });
        throughPoints[2] = [-3, 5];
        await checkAllCurves({
            core,
            resolvePathToNodeIdx,
            throughPoints,
            directions,
            controlVectors,
            curveNames,
        });

        // move through point on curve 2
        await moveThroughPoint({
            componentIdx: await resolvePathToNodeIdx("g2.c"),
            throughPointInd: 0,
            throughPoint: [-7.4, 1.6],
            core,
        });
        throughPoints[0] = [-7, 2];
        await checkAllCurves({
            core,
            resolvePathToNodeIdx,
            throughPoints,
            directions,
            controlVectors,
            curveNames,
        });

        // move through point on curve 3
        await moveThroughPoint({
            componentIdx: await resolvePathToNodeIdx("g3.c"),
            throughPointInd: 3,
            throughPoint: [-4.6, -9.3],
            core,
        });
        throughPoints[3] = [-5, -9];
        await checkAllCurves({
            core,
            resolvePathToNodeIdx,
            throughPoints,
            directions,
            controlVectors,
            curveNames,
        });
    });

    async function test_copied_flipped(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
    ) {
        function throughPointTransform(v: number[], i: number) {
            return i % 2 === 0 ? v : [v[1], v[0]];
        }

        function controlVectorTransform(v: number[][], i: number) {
            if (i === 0) {
                return v;
            }
            if (i === 1 || i === 3) {
                return v.map((u) => [u[1], u[0]]);
            } else {
                return [v[0], [v[1][1], v[1][0]]];
            }
        }

        let directions: Direction[] = [
            "symmetric",
            "symmetric",
            "both",
            "symmetric",
        ];

        let throughPoints1 = [
            [-9, 6],
            [-3, 7],
            [4, 0],
            [8, 5],
        ];
        let controlVectors1 = [
            [
                [3, 1],
                [-3, -1],
            ],
            [
                [5, -6],
                [-5, 6],
            ],
            [
                [3, 2],
                [-1, 5],
            ],
            [
                [1, 4],
                [-1, -4],
            ],
        ];

        let throughPoints2 = throughPoints1.map(throughPointTransform);
        let controlVectors2 = controlVectors1.map(controlVectorTransform);

        let curveNames1 = ["c1", "c1a"];
        let curveNames2 = ["c2", "c2a"];

        await checkAllCurves({
            core,
            resolvePathToNodeIdx,
            throughPoints: throughPoints1,
            directions,
            controlVectors: controlVectors1,
            curveNames: curveNames1,
        });
        await checkAllCurves({
            core,
            resolvePathToNodeIdx,
            throughPoints: throughPoints2,
            directions,
            controlVectors: controlVectors2,
            curveNames: curveNames2,
        });

        for (let ind = 0; ind < 2; ind++) {
            // move through points on first pair of curves
            await moveAllThroughPoints({
                curveNames: curveNames1,
                throughPoints: throughPoints1,
                directions,
                controlVectors: controlVectors1,
                core,
                resolvePathToNodeIdx,
                offset: -4 + ind * 4,
            });

            // check that second pair changed
            throughPoints2 = throughPoints1.map(throughPointTransform);
            await checkAllCurves({
                core,
                resolvePathToNodeIdx,
                throughPoints: throughPoints2,
                directions,
                controlVectors: controlVectors2,
                curveNames: curveNames2,
            });

            // move through points on second pair of curves
            await moveAllThroughPoints({
                curveNames: curveNames2,
                throughPoints: throughPoints2,
                directions,
                controlVectors: controlVectors2,
                core,
                resolvePathToNodeIdx,
                offset: -3 + ind * 4,
            });

            // check that first pair changed
            throughPoints1 = throughPoints2.map(throughPointTransform);
            await checkAllCurves({
                core,
                resolvePathToNodeIdx,
                throughPoints: throughPoints1,
                directions,
                controlVectors: controlVectors1,
                curveNames: curveNames1,
            });

            // move control vectors on second pair of curves
            await moveAllControlVectors({
                curveNames: curveNames2,
                throughPoints: throughPoints2,
                directions,
                controlVectors: controlVectors2,
                core,
                resolvePathToNodeIdx,
                offset: -2 + ind * 4,
            });

            // check that first pair changed
            controlVectors1 = controlVectors2.map(controlVectorTransform);
            await checkAllCurves({
                core,
                resolvePathToNodeIdx,
                throughPoints: throughPoints1,
                directions,
                controlVectors: controlVectors1,
                curveNames: curveNames1,
            });

            // move control vectors on first pair of curves
            await moveAllControlVectors({
                curveNames: curveNames1,
                throughPoints: throughPoints1,
                directions,
                controlVectors: controlVectors1,
                core,
                resolvePathToNodeIdx,
                offset: -1 + ind * 4,
            });

            // check that second pair changed
            controlVectors2 = controlVectors1.map(controlVectorTransform);
            await checkAllCurves({
                core,
                resolvePathToNodeIdx,
                throughPoints: throughPoints2,
                directions,
                controlVectors: controlVectors2,
                curveNames: curveNames2,
            });
        }
    }

    it("new curve from copied control vectors, some flipped", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c1" through="(-9,6) (-3,7) (4,0) (8,5)">
      <bezierControls>
        <controlVectors>(3,1)</controlVectors>
        <controlVectors>(5,-6)</controlVectors>
        <controlVectors direction="both">(3,2) (-1,5)</controlVectors>
        <controlVectors>(1,4)</controlVectors>
      </bezierControls>
    </curve>
    </graph>
    <graph>
    <curve name="c2" through="$c1.throughPoints[1] ($c1.throughPoints[2][2], $c1.throughPoints[2][1]) $c1.throughPoints[3] ($c1.throughPoints[4][2], $c1.throughPoints[4][1])">
      <bezierControls>
        <controlVectors>
          $c1.controlVectors[1][1]
        </controlVectors>
        <controlVectors>
          <vector>
            ($c1.controlVectors[2][1].y,
           $c1.controlVectors[2][1].x)
          </vector>
        </controlVectors>
        <controlVectors direction="both">
          $c1.controlVectors[3][1]
          <vector>
            ($c1.controlVectors[3][2].y,
           $c1.controlVectors[3][2].x)
          </vector>
        </controlVectors>
        <controlVectors>
          <vector>
            ($c1.controlVectors[4][1].y,
           $c1.controlVectors[4][1].x)
          </vector>
        </controlVectors>
      </bezierControls>
    </curve>
    </graph>

    <graph>
      <curve extend="$c1" name="c1a" />
    </graph>
    <graph>
      <curve extend="$c2" name="c2a" />
    </graph>

    `,
        });

        await test_copied_flipped(core, resolvePathToNodeIdx);
    });

    it("new curve from copied control points, some flipped", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <graph>
    <curve name="c1" through="(-9,6) (-3,7) (4,0) (8,5)">
    <bezierControls>
      <controlVectors>(3,1)</controlVectors>
      <controlVectors>(5,-6)</controlVectors>
      <controlVectors direction="both">(3,2) (-1,5)</controlVectors>
      <controlVectors>(1,4)</controlVectors>
    </bezierControls>
    </curve>
    </graph>

    <graph>
    <curve name="c2" through="$c1.throughPoints[1] ($c1.throughPoints[2][2], $c1.throughPoints[2][1]) $c1.throughPoints[3] ($c1.throughPoints[4][2], $c1.throughPoints[4][1])">
      <bezierControls>
        <controlVectors>
          <vector>
            ($c1.controlPoints[1][1][1]
             -<point extend="$c1.throughPoints[1][1]" fixed />,
             $c1.controlPoints[1][1][2]
             -<point extend="$c1.throughPoints[1][2]" fixed />)
          </vector>
        </controlVectors>
        <controlVectors>
          <vector>
            ($c1.controlPoints[2][1][2]
             -<point extend="$c1.throughPoints[2][2]" fixed />,
             $c1.controlPoints[2][1][1]
             -<point extend="$c1.throughPoints[2][1]" fixed />)
          </vector>
        </controlVectors>
        <controlVectors direction="both">
          <vector>
            ($c1.controlPoints[3][1][1]
             -<point extend="$c1.throughPoints[3][1]" fixed />,
             $c1.controlPoints[3][1][2]
             -<point extend="$c1.throughPoints[3][2]" fixed />)
          </vector>
          <vector>
            ($c1.controlPoints[3][2][2]
             -<point extend="$c1.throughPoints[3][2]" fixed />,
             $c1.controlPoints[3][2][1]
             -<point extend="$c1.throughPoints[3][1]" fixed />)
          </vector>
        </controlVectors>
        <controlVectors>
          <vector>
            ($c1.controlPoints[4][1][2]
             -<point extend="$c1.throughPoints[4][2]" fixed />,
             $c1.controlPoints[4][1][1]
             -<point extend="$c1.throughPoints[4][1]" fixed />)
          </vector>
        </controlVectors>
      </bezierControls>
    </curve>
    </graph>

    <graph>
      <curve extend="$c1" name="c1a" />
    </graph>
    <graph>
      <curve extend="$c2" name="c2a" />
    </graph>

    `,
        });

        await test_copied_flipped(core, resolvePathToNodeIdx);
    });

    async function test_first_fourth_points_dependent(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        haveFifth = false,
    ) {
        let curveNames = ["g.c", "g2.c", "g3.c"];

        let throughPoints = [
            [1, 2],
            [3, 4],
            [-5, 6],
            [1, 2],
        ];
        let directions: Direction[] = ["none", "none", "none", "none"];

        if (haveFifth) {
            throughPoints.push([2, 2]);
            directions.push("none");
        }

        await checkAllCurves({
            core,
            resolvePathToNodeIdx,
            throughPoints,
            directions,
            curveNames,
        });

        // move first three points on curves
        for (let ind = 0; ind < 3; ind++) {
            // pick a curve name
            let name = curveNames[Math.abs(ind) % curveNames.length];

            let newPt = [ind + 4 + 0, 3 - 2 * ind + 0];
            throughPoints[ind] = newPt;
            await moveThroughPoint({
                componentIdx: await resolvePathToNodeIdx(name),
                throughPointInd: ind,
                throughPoint: newPt,
                core,
            });
        }

        throughPoints[3] = throughPoints[0];
        if (haveFifth) {
            throughPoints[4][0] = throughPoints[0][0] + 1;
        }

        await checkAllCurves({
            core,
            resolvePathToNodeIdx,
            curveNames,
            throughPoints,
            directions,
        });

        // move fourth point on each curve in succession
        for (let ind = 0; ind < 3; ind++) {
            // pick a curve name
            let name = curveNames[Math.abs(ind) % curveNames.length];

            let newPt = [2 * ind + 1 + 0, 3 - 4 * ind + 0];
            throughPoints[3] = newPt;
            await moveThroughPoint({
                componentIdx: await resolvePathToNodeIdx(name),
                throughPointInd: 3,
                throughPoint: newPt,
                core,
            });
            throughPoints[0] = throughPoints[3];
            if (haveFifth) {
                throughPoints[4][0] = throughPoints[0][0] + 1;
            }
            await checkAllCurves({
                core,
                resolvePathToNodeIdx,
                curveNames,
                throughPoints,
                directions,
            });
        }

        if (haveFifth) {
            // move fifth point on each curve in succession
            for (let ind = 0; ind < 3; ind++) {
                // pick a curve name
                let name = curveNames[Math.abs(ind) % curveNames.length];

                let newPt = [-2 * ind + 2 + 0, 4 + 2 * ind + 0];
                throughPoints[4] = newPt;
                await moveThroughPoint({
                    componentIdx: await resolvePathToNodeIdx(name),
                    throughPointInd: 4,
                    throughPoint: newPt,
                    core,
                });
                throughPoints[0][0] = throughPoints[3][0] =
                    throughPoints[4][0] - 1;
                await checkAllCurves({
                    core,
                    resolvePathToNodeIdx,
                    curveNames,
                    throughPoints,
                    directions,
                });
            }
        }

        // activate and move all control vectors
        let controlVectors: (number[] | null)[][] = [];
        await switchAllControlVectors({
            directions,
            curveNames,
            core,
            resolvePathToNodeIdx,
            throughPoints,
            controlVectors,
            offset: -1,
        });

        // move control vectors again
        await moveAllControlVectors({
            directions,
            curveNames,
            core,
            resolvePathToNodeIdx,
            throughPoints,
            controlVectors,
            offset: -2,
        });
    }

    // TODO: restore this functionality. See issue #479.
    it.skip("fourth point depends on internal copy of first point", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g">
  <setup><point extend="$c.throughPoints[1]" name="TP1" /></setup>
  <curve name="c" through="(1,2) (3,4) (-5,6) $TP1">
  <bezierControls />
  </curve>
  </graph>

  <graph name="g2">
    <curve extend="$g.c" name="c" />
  </graph>

  <graph extend="$g2" name="g3" />

  `,
        });

        await test_first_fourth_points_dependent(core, resolvePathToNodeIdx);
    });

    // TODO: restore this functionality
    it.skip("first point depends on internal copy of fourth point", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g">
  <setup><point name="P4" extend="$c.throughPoints[4]" /></setup>
  <curve name="c" through="$P4 (3,4) (-5,6) (1,2) ">
  <bezierControls />
  </curve>
  </graph>

  <graph name="g2">
    <curve extend="$g.c" name="c" />
  </graph>

  <graph extend="$g2" name="g3" />

  `,
        });

        await test_first_fourth_points_dependent(core, resolvePathToNodeIdx);
    });

    // TODO: restore this functionality
    it.skip("first point depends fourth, formula for fifth", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g">
  <setup><point name="P4" extend="$c.throughPoints[4]" /></setup>
  <curve name="c" through="$P4 (3,4) (-5,6) (1,2) ($c.throughPoints[1][1]+1, 2)">
  <bezierControls />
  </curve>
  </graph>

  <graph name="g2">
    <curve extend="$g.c" name="c" />
  </graph>

  <graph extend="$g2" name="g3" />

  `,
        });

        await test_first_fourth_points_dependent(
            core,
            resolvePathToNodeIdx,
            true,
        );
    });

    async function test_1_4_7_10_points_dependent(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        shift = false,
    ) {
        let curveNames = ["g.c", "g2.c", "g3.c"];

        let throughPoints = [
            [NaN, NaN],
            [1, 2],
            [3, 4],
            [NaN, NaN],
            [5, 7],
            [-5, 7],
            [NaN, NaN],
            [3, 1],
            [5, 0],
            [-5, -1],
        ];

        function recalcThroughPoints() {
            let s = 0;
            if (shift) {
                s = 1;
            }
            throughPoints[6] = throughPoints[9].map((x) => x + s);
            throughPoints[3] = throughPoints[6].map((x) => x + s);
            throughPoints[0] = throughPoints[3].map((x) => x + s);
        }

        recalcThroughPoints();

        let directions: Direction[] = Array(10).fill("none");

        await checkAllCurves({
            core,
            resolvePathToNodeIdx,
            throughPoints,
            directions,
            curveNames,
        });

        // move the independent points on the curves
        let name_ind = 0;
        for (let ind = 1; ind < 10; ind++) {
            if (ind == 3 || ind == 6) {
                continue;
            }

            // pick a curve name
            let name = curveNames[Math.abs(name_ind) % curveNames.length];
            name_ind++;

            let newPt = [ind + 4 + 0, 3 - 2 * ind + 0];
            throughPoints[ind] = newPt;
            await moveThroughPoint({
                componentIdx: await resolvePathToNodeIdx(name),
                throughPointInd: ind,
                throughPoint: newPt,
                core,
            });
        }

        recalcThroughPoints();

        await checkAllCurves({
            core,
            resolvePathToNodeIdx,
            curveNames,
            throughPoints,
            directions,
        });

        // move first point on each curve in succession
        for (let ind = 0; ind < 3; ind++) {
            // pick a curve name
            let name = curveNames[Math.abs(ind) % curveNames.length];

            let newPt = [2 * ind + 1 + 0, 3 - 4 * ind + 0];
            throughPoints[9] = newPt;
            recalcThroughPoints();
            await moveThroughPoint({
                componentIdx: await resolvePathToNodeIdx(name),
                throughPointInd: 0,
                throughPoint: throughPoints[0],
                core,
            });
            await checkAllCurves({
                core,
                resolvePathToNodeIdx,
                curveNames,
                throughPoints,
                directions,
            });
        }

        // move fourth point on each curve in succession
        for (let ind = 0; ind < 3; ind++) {
            // pick a curve name
            let name = curveNames[Math.abs(ind) % curveNames.length];

            let newPt = [-2 * ind + 2 + 0, 4 - 2 * ind + 0];
            throughPoints[9] = newPt;
            recalcThroughPoints();
            await moveThroughPoint({
                componentIdx: await resolvePathToNodeIdx(name),
                throughPointInd: 3,
                throughPoint: throughPoints[3],
                core,
            });
            await checkAllCurves({
                core,
                resolvePathToNodeIdx,
                curveNames,
                throughPoints,
                directions,
            });
        }

        // move fourth point on each curve in succession
        for (let ind = 0; ind < 3; ind++) {
            // pick a curve name
            let name = curveNames[Math.abs(ind) % curveNames.length];

            let newPt = [5 * ind + 1 + 0, 11 - 6 * ind + 0];
            throughPoints[9] = newPt;
            recalcThroughPoints();
            await moveThroughPoint({
                componentIdx: await resolvePathToNodeIdx(name),
                throughPointInd: 6,
                throughPoint: throughPoints[6],
                core,
            });
            await checkAllCurves({
                core,
                resolvePathToNodeIdx,
                curveNames,
                throughPoints,
                directions,
            });
        }
    }

    // TODO: restore this functionality
    it.skip("first, fourth, seventh point depends on fourth, seventh, tenth", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g">
  <setup>
    <point name="P4" extend="$c.throughPoints[4]" />
    <point name="P7" extend="$c.throughPoints[7]" />
    <point name="P10" extend="$c.throughPoints[10]" />
  </setup>
  <curve name="c" through="$P4 (1,2) (3,4) $P7 (5,7) (-5,7) $P10 (3,1) (5,0) (-5,-1)" />
  </graph>

  <graph name="g2">
    <curve extend="$g.c" name="c" />
  </graph>

  <graph extend="$g2" name="g3" />
  `,
        });

        await test_1_4_7_10_points_dependent(core, resolvePathToNodeIdx);
    });

    it("first, fourth, seventh point depends on shifted fourth, seventh, tenth", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g">
  <curve name="c" through="($c.throughPoints[4][1]+1, $c.throughPoints[4][2]+1)  (1,2) (3,4) ($c.throughPoints[7][1]+1, $c.throughPoints[7][2]+1) (5,7) (-5,7) ($c.throughPoints[10][1]+1, $c.throughPoints[10][2]+1) (3,1) (5,0) (-5,-1)" />
  </graph>

  <graph name="g2">
    <curve extend="$g.c" name="c" />
  </graph>

  <graph extend="$g2" name="g3" />
  `,
        });

        await test_1_4_7_10_points_dependent(core, resolvePathToNodeIdx, true);
    });

    async function test_first_third_vector_dependent(
        core: PublicDoenetMLCore,
        resolvePathToNodeIdx: ResolvePathToNodeIdx,
        thirdUnspecified = false,
    ) {
        function swapVectors(cvecs: number[][]) {
            return [cvecs[1], cvecs[0]];
        }

        let curveNames = ["g.c", "g2.c", "g3.c"];

        let throughPoints = [
            [1, 2],
            [3, 4],
            [-5, 6],
        ];
        let controlVectors = [
            [
                [-1, 4],
                [1, -4],
            ],
            [
                [2, 0],
                [-2, 0],
            ],
            [
                [1, -4],
                [-1, 4],
            ],
        ];

        let directions: Direction[] = ["symmetric", "symmetric", "symmetric"];

        if (thirdUnspecified) {
            directions[2] = "none";
            let stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            let cv3 =
                stateVariables[await resolvePathToNodeIdx("g.c")].stateValues
                    .controlVectors[2][0];

            controlVectors[2][0][0] = cv3[0].tree + 0;
            controlVectors[2][0][1] = cv3[1].tree + 0;
            controlVectors[2][1][0] = -controlVectors[2][0][0] + 0;
            controlVectors[2][1][1] = -controlVectors[2][0][1] + 0;
            controlVectors[0] = swapVectors(controlVectors[2]);
        }

        await checkAllCurves({
            core,
            resolvePathToNodeIdx,
            throughPoints,
            directions,
            controlVectors,
            curveNames,
        });

        if (thirdUnspecified) {
            // can't move the first control vector of any curve
            for (let ind = 0; ind < 3; ind++) {
                // pick a curve name
                let name = curveNames[Math.abs(ind) % curveNames.length];

                await moveControlVector({
                    componentIdx: await resolvePathToNodeIdx(name),
                    controlVectorInds: [0, ind % 2],
                    controlVector: [ind + 4 + 0, 3 - 2 * ind + 0],
                    core,
                });

                // no change
                await checkAllCurves({
                    core,
                    resolvePathToNodeIdx,
                    throughPoints,
                    directions,
                    controlVectors,
                    curveNames,
                });
            }

            // turn on third control vector on curve 1
            directions[2] = "symmetric";
            await changeVectorControlDirection({
                core,
                componentIdx: await resolvePathToNodeIdx(curveNames[0]),
                throughPointInd: 2,
                direction: directions[2],
            });
        }

        // move first and second control vectors of each curve
        for (let ind = 0; ind < 3; ind++) {
            // pick a curve name
            let name = curveNames[Math.abs(ind) % curveNames.length];
            for (let vecInd = 0; vecInd < 2; vecInd++) {
                let newVec = [
                    2 * ind * (vecInd + 1) + 1 + 0,
                    3 - 4 * ind * (vecInd + 2) + 0,
                ];
                let side = (ind + vecInd) % 2;

                await moveControlVector({
                    componentIdx: await resolvePathToNodeIdx(name),
                    controlVectorInds: [vecInd, side],
                    controlVector: newVec,
                    core,
                });

                let newVecFlipped = newVec.map((v) => -v + 0);
                if (side === 0) {
                    controlVectors[vecInd] = [newVec, newVecFlipped];
                } else {
                    controlVectors[vecInd] = [newVecFlipped, newVec];
                }
            }

            controlVectors[2] = swapVectors(controlVectors[0]);

            await checkAllCurves({
                core,
                resolvePathToNodeIdx,
                throughPoints,
                directions,
                controlVectors,
                curveNames,
            });
        }

        // move last control vector of each curve
        for (let ind = 0; ind < 3; ind++) {
            // pick a curve name
            let name = curveNames[Math.abs(ind) % curveNames.length];
            let newVec = [5 * ind + 1 + 0, 11 - 6 * ind + 0];
            let side = ind % 2;

            await moveControlVector({
                componentIdx: await resolvePathToNodeIdx(name),
                controlVectorInds: [2, side],
                controlVector: newVec,
                core,
            });

            let newVecFlipped = newVec.map((v) => -v + 0);
            if (side === 0) {
                controlVectors[2] = [newVec, newVecFlipped];
            } else {
                controlVectors[2] = [newVecFlipped, newVec];
            }

            controlVectors[0] = swapVectors(controlVectors[2]);

            await checkAllCurves({
                core,
                resolvePathToNodeIdx,
                throughPoints,
                directions,
                controlVectors,
                curveNames,
            });
        }
    }

    it("third control vector depends on internal copy of first control vector", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g">
  <curve name="c" through="(1,2) (3,4) (-5,6)">
  <bezierControls>
    <controlVectors>(-1,4)</controlVectors>
    <controlVectors>(2,0)</controlVectors>
    <controlVectors>$c.controlVectors[1][2]</controlVectors>
  </bezierControls>
  </curve>
  </graph>

  <graph name="g2">
    <curve extend="$g.c" name="c" />
  </graph>

  <graph extend="$g2" name="g3" />
  `,
        });

        await test_first_third_vector_dependent(core, resolvePathToNodeIdx);
    });

    it("first control vector depends on internal copy of unspecified third control vector", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g">
  <curve name="c" through="(1,2) (3,4) (-5,6)">
  <bezierControls>
    <controlVectors>$c.controlVectors[3][2]</controlVectors>
    <controlVectors>(2,0)</controlVectors>
  </bezierControls>
  </curve>
  </graph>

  <graph name="g2">
    <curve extend="$g.c" name="c" />
  </graph>

  <graph extend="$g2" name="g3" />
`,
        });

        await test_first_third_vector_dependent(
            core,
            resolvePathToNodeIdx,
            true,
        );
    });

    it("internal copies among controls", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g">
  <curve name="c" through="(1,2) (3,4) (-5,6) (3,5)">
  <bezierControls>
    <controlVectors><vector>
      ($c.controlVectors[1][2][2],5)
    </vector></controlVectors>
    <controlVectors direction="both">
      <vector>(3,4)</vector>
      <vector>
        (-$c.controlVectors[2][1][2],
        $c.controlVectors[2][1][1])
      </vector>
    </controlVectors>
    <controlVectors><vector>
      ($c.controlVectors[4][1][2], 4)
    </vector></controlVectors>
    <controlVectors><vector>
      ($c.controlVectors[3][1][2], -2)
    </vector></controlVectors>
  </bezierControls>
  </curve>
  </graph>

  <graph name="g2">
    <curve extend="$g.c" name="c" />
  </graph>

  <graph extend="$g2" name="g3" />

  `,
        });

        let curveNames = ["g.c", "g2.c", "g3.c"];

        let throughPoints = [
            [1, 2],
            [3, 4],
            [-5, 6],
            [3, 5],
        ];

        let controlVectors = [
            [
                [NaN, 5],
                [NaN, NaN],
            ],
            [
                [3, 4],
                [NaN, NaN],
            ],
            [
                [NaN, 4],
                [NaN, NaN],
            ],
            [
                [NaN, -2],
                [NaN, NaN],
            ],
        ];

        function recalcControlVectors() {
            controlVectors[0][1][1] = -controlVectors[0][0][1] + 0;
            controlVectors[0][0][0] = controlVectors[0][1][1];
            controlVectors[0][1][0] = -controlVectors[0][0][0] + 0;

            controlVectors[1][1][0] = -controlVectors[1][0][1] + 0;
            controlVectors[1][1][1] = controlVectors[1][0][0];

            controlVectors[2][0][0] = controlVectors[3][0][1];
            controlVectors[2][1][0] = -controlVectors[2][0][0] + 0;
            controlVectors[2][1][1] = -controlVectors[2][0][1] + 0;

            controlVectors[3][0][0] = controlVectors[2][0][1];
            controlVectors[3][1][0] = -controlVectors[3][0][0] + 0;
            controlVectors[3][1][1] = -controlVectors[3][0][1] + 0;
        }

        recalcControlVectors();

        let directions: Direction[] = [
            "symmetric",
            "both",
            "symmetric",
            "symmetric",
        ];

        await checkAllCurves({
            core,
            resolvePathToNodeIdx,
            throughPoints,
            directions,
            controlVectors,
            curveNames,
        });

        await moveAllThroughPoints({
            curveNames,
            resolvePathToNodeIdx,
            throughPoints,
            directions,
            controlVectors,
            core,
            offset: 1,
        });

        // move first control vector of each curve
        for (let ind = 0; ind < 3; ind++) {
            // pick a curve name
            let name = curveNames[Math.abs(ind) % curveNames.length];
            let newVec = [ind + 4 + 0, 3 - 2 * ind + 0];
            let side = ind % 2;

            await moveControlVector({
                componentIdx: await resolvePathToNodeIdx(name),
                controlVectorInds: [0, side],
                controlVector: newVec,
                core,
            });

            if (side === 1) {
                // need to flip if side===1
                controlVectors[0][0][1] = -newVec[1] + 0;
            } else {
                controlVectors[0][0][1] = newVec[1];
            }

            recalcControlVectors();

            await checkAllCurves({
                core,
                resolvePathToNodeIdx,
                throughPoints,
                directions,
                controlVectors,
                curveNames,
            });
        }

        // move second control vector of each curve
        for (let ind = 0; ind < 3; ind++) {
            // pick a curve name
            let name = curveNames[Math.abs(ind) % curveNames.length];
            let newVec = [2 * ind + 1 + 0, 3 - 4 * ind + 0];
            let side = (ind + 1) % 2;

            await moveControlVector({
                componentIdx: await resolvePathToNodeIdx(name),
                controlVectorInds: [1, side],
                controlVector: newVec,
                core,
            });

            if (side === 1) {
                // need to flip and swap if side===1
                controlVectors[1][0] = [newVec[1], -newVec[0] + 0];
            } else {
                controlVectors[1][0] = newVec;
            }

            recalcControlVectors();

            await checkAllCurves({
                core,
                resolvePathToNodeIdx,
                throughPoints,
                directions,
                controlVectors,
                curveNames,
            });
        }

        // move third control vector of each curve
        for (let ind = 0; ind < 3; ind++) {
            // pick a curve name
            let name = curveNames[Math.abs(ind) % curveNames.length];
            let newVec = [-2 * ind + 2 + 0, 4 + 2 * ind + 0];
            let side = ind % 2;

            await moveControlVector({
                componentIdx: await resolvePathToNodeIdx(name),
                controlVectorInds: [2, side],
                controlVector: newVec,
                core,
            });

            if (side === 1) {
                // need to flip if side===1
                controlVectors[2][0][1] = -newVec[1] + 0;
                controlVectors[3][0][1] = -newVec[0] + 0;
            } else {
                controlVectors[2][0][1] = newVec[1];
                controlVectors[3][0][1] = newVec[0];
            }

            recalcControlVectors();

            await checkAllCurves({
                core,
                resolvePathToNodeIdx,
                throughPoints,
                directions,
                controlVectors,
                curveNames,
            });
        }

        // move fourth control vector of each curve
        for (let ind = 0; ind < 3; ind++) {
            // pick a curve name
            let name = curveNames[Math.abs(ind) % curveNames.length];
            let newVec = [3 * ind + 4 + 0, 6 - 4 * ind + 0];
            let side = (ind + 1) % 2;

            await moveControlVector({
                componentIdx: await resolvePathToNodeIdx(name),
                controlVectorInds: [3, side],
                controlVector: newVec,
                core,
            });

            if (side === 1) {
                // need to flip if side===1
                controlVectors[3][0][1] = -newVec[1] + 0;
                controlVectors[2][0][1] = -newVec[0] + 0;
            } else {
                controlVectors[3][0][1] = newVec[1];
                controlVectors[2][0][1] = newVec[0];
            }

            recalcControlVectors();

            await checkAllCurves({
                core,
                resolvePathToNodeIdx,
                throughPoints,
                directions,
                controlVectors,
                curveNames,
            });
        }
    });

    it("copy props with propIndex, dot and array notation", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>n: <mathInput name="n" prefill="2" /></p>

  <graph name="g">
    <curve name="c" through="(1,2) (3,4) (-2,6) (-4,7) (2,9) (6,5)" >
      <bezierControls>
        (-1,0) (0,-1) (1,0) (0,-1) (-1,0) (-1,0)
      </bezierControls>
    </curve>
  </graph>
  
  <p name="pt">$c.throughPoints[$n]</p>
  <p name="px">$c.xCriticalPoints[$n]</p>
  <p name="py">$c.yCriticalPoints[$n]</p>
  <p name="pc">$c.curvatureChangePoints[$n]</p>

  <p name="p1t">$c.throughPoint1[$n]</p>
  <p name="p1x">$c.xCriticalPoint1[$n]</p>
  <p name="p1y">$c.yCriticalPoint1[$n]</p>
  <p name="p1c">$c.curvatureChangePoint1[$n]</p>

  <p name="p1ta">$c.throughPoints[1][$n]</p>
  <p name="p1xa">$c.xCriticalPoints[1][$n]</p>
  <p name="p1ya">$c.yCriticalPoints[1][$n]</p>
  <p name="p1ca">$c.curvatureChangePoints[1][$n]</p>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("pt")].stateValues.text,
        ).eq("( 3, 4 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("px")].stateValues.text,
        ).eq("( -4, 7 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("py")].stateValues.text,
        ).eq("( -2, 6 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("pc")].stateValues.text,
        ).eq("( 4, 7 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1t")].stateValues.text,
        ).eq("2");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1x")].stateValues.text,
        ).eq("4");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1y")].stateValues.text,
        ).eq("2");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1c")].stateValues.text,
        ).eq("6");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1ta")].stateValues.text,
        ).eq("2");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1xa")].stateValues.text,
        ).eq("4");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1ya")].stateValues.text,
        ).eq("2");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1ca")].stateValues.text,
        ).eq("6");

        // set propIndex to 1
        await updateMathInputValue({
            latex: "1",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pt")].stateValues.text,
        ).eq("( 1, 2 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("px")].stateValues.text,
        ).eq("( 3, 4 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("py")].stateValues.text,
        ).eq("( 1, 2 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("pc")].stateValues.text,
        ).eq("( -2, 6 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1t")].stateValues.text,
        ).eq("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1x")].stateValues.text,
        ).eq("3");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1y")].stateValues.text,
        ).eq("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1c")].stateValues.text,
        ).eq("-2");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1ta")].stateValues.text,
        ).eq("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1xa")].stateValues.text,
        ).eq("3");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1ya")].stateValues.text,
        ).eq("1");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1ca")].stateValues.text,
        ).eq("-2");

        // erase propIndex
        await updateMathInputValue({
            latex: "",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pt")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("px")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("py")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("pc")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1t")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1x")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1y")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1c")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1ta")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1xa")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1ya")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1ca")].stateValues.text,
        ).eq("");

        // set propIndex to 4
        await updateMathInputValue({
            latex: "4",
            componentIdx: await resolvePathToNodeIdx("n"),
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pt")].stateValues.text,
        ).eq("( -4, 7 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("px")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("py")].stateValues.text,
        ).eq("( 6, 5 )");
        expect(
            stateVariables[await resolvePathToNodeIdx("pc")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1t")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1x")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1y")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1c")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1ta")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1xa")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1ya")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("p1ca")].stateValues.text,
        ).eq("");
    });

    it("copy props with propIndex, control vectors and points, dot and array notation", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <p>m: <mathInput name="m" /></p>
  <p>n: <mathInput name="n" /></p>

  <graph name="g">
    <curve name="c" through="(1,5) (-3,-6) (1,0) (-6,3) (2,-4)">
      <bezierControls>
        <controlVectors>(3,-3)</controlVectors>
        <controlVectors direction="both">(-2,4) (1,6)</controlVectors>
        <controlVectors direction="next">(5,3)</controlVectors>
        <controlVectors direction="previous">(1,-1)</controlVectors>
        <controlVectors>(3,3)</controlVectors>
      </bezierControls>
    </curve>
  </graph>
  
  <p name="pV"><vectorList extend="$c.controlVectors[$m][$n]" displayDecimals="1" /></p>
  <p name="pP"><pointList extend="$c.controlPoints[$m][$n]" displayDecimals="1" /></p>
  <p name="pVb"><vectorList extend="$c.controlVectors[$m]" displayDecimals="1" /></p>
  <p name="pPb"><pointList extend="$c.controlPoints[$m]" displayDecimals="1" /></p>

  `,
        });

        let desiredControlVectors = [
            [
                [3, -3],
                [-3, 3],
            ],
            [
                [-2, 4],
                [1, 6],
            ],
            [
                [-1.1, -1.6],
                [5, 3],
            ],
            [
                [1, -1],
                [2.1, -1.9],
            ],
            [
                [3, 3],
                [-3, -3],
            ],
        ];

        let throughPoints = [
            [1, 5],
            [-3, -6],
            [1, 0],
            [-6, 3],
            [2, -4],
        ];

        let desiredControlPoints = desiredControlVectors.map((x, i) =>
            x.map((v) =>
                v.map(
                    (a, j) => Math.round((a + throughPoints[i][j]) * 10) / 10,
                ),
            ),
        );

        let stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("pV")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("pP")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("pVb")].stateValues.text,
        ).eq("");
        expect(
            stateVariables[await resolvePathToNodeIdx("pPb")].stateValues.text,
        ).eq("");

        for (let m = 1; m <= 5; m++) {
            await updateMathInputValue({
                latex: `${m}`,
                componentIdx: await resolvePathToNodeIdx("m"),
                core,
            });
            stateVariables = await core.returnAllStateVariables(false, true);

            expect(
                stateVariables[await resolvePathToNodeIdx("pVb")].stateValues
                    .text,
            ).eq(
                desiredControlVectors[m - 1]
                    .map((v) => `( ${v.join(", ")} )`)
                    .join(", "),
            );
            expect(
                stateVariables[await resolvePathToNodeIdx("pPb")].stateValues
                    .text,
            ).eq(
                desiredControlPoints[m - 1]
                    .map((v) => `( ${v.join(", ")} )`)
                    .join(", "),
            );

            for (let n = 1; n <= 2; n++) {
                await updateMathInputValue({
                    latex: `${n}`,
                    componentIdx: await resolvePathToNodeIdx("n"),
                    core,
                });
                stateVariables = await core.returnAllStateVariables(
                    false,
                    true,
                );

                expect(
                    stateVariables[await resolvePathToNodeIdx("pV")].stateValues
                        .text,
                ).eq(`( ${desiredControlVectors[m - 1][n - 1].join(", ")} )`);
                expect(
                    stateVariables[await resolvePathToNodeIdx("pP")].stateValues
                        .text,
                ).eq(`( ${desiredControlPoints[m - 1][n - 1].join(", ")} )`);
            }
        }
    });

    it("copy control vectors", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph name="g">
    <curve name="c" through="(1,2) (3,4) (-2,6)" >
      <bezierControls>
        (-1,0)
        <controlVectors direction="both">(0,-1) (-1, 0)</controlVectors>
        (1,0)
      </bezierControls>
    </curve>
  </graph>
  
  <p name="pcv">$c.controlVectors</p>

  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pcv")].stateValues.text,
        ).eq("( -1, 0 ), ( 1, 0 ), ( 0, -1 ), ( -1, 0 ), ( 1, 0 ), ( -1, 0 )");

        await moveControlVector({
            componentIdx: await resolvePathToNodeIdx("c"),
            controlVectorInds: [0, 1],
            controlVector: [2, 1],
            core,
        });
        await moveControlVector({
            componentIdx: await resolvePathToNodeIdx("c"),
            controlVectorInds: [1, 0],
            controlVector: [3, -5],
            core,
        });
        await moveControlVector({
            componentIdx: await resolvePathToNodeIdx("c"),
            controlVectorInds: [1, 1],
            controlVector: [2, -4],
            core,
        });
        await moveControlVector({
            componentIdx: await resolvePathToNodeIdx("c"),
            controlVectorInds: [2, 0],
            controlVector: [-2, -6],
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[await resolvePathToNodeIdx("pcv")].stateValues.text,
        ).eq(
            "( -2, -1 ), ( 2, 1 ), ( 3, -5 ), ( 2, -4 ), ( -2, -6 ), ( 2, 6 )",
        );
    });

    it("sugared bezierControls from vector operations", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="m">(-3,2)</math>
    <setup><math name="mFixed" extend="$m" fixed /></setup>
    <graph>
      <point name="P">(2,1)</point>
      <curve name="c" through="(1,2) (3,4) (-2,6) (-3,-5)">
        <bezierControls>2(2,-3)+(3,4) 3$P $P+2$mFixed $m</bezierControls>
      </curve>
    </graph>
    `,
        });

        async function check_items(cvs: number[][][]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("c")
                ].stateValues.controlVectors.map((x) =>
                    x.map((y) => y.map((z) => z.tree + 0)),
                ),
            ).eqls(cvs);
        }

        let controlVectors = [
            [
                [7, -2],
                [-7, 2],
            ],
            [
                [6, 3],
                [-6, -3],
            ],
            [
                [-4, 5],
                [4, -5],
            ],
            [
                [-3, 2],
                [3, -2],
            ],
        ];

        await check_items(controlVectors);

        await moveControlVector({
            componentIdx: await resolvePathToNodeIdx("c"),
            controlVectorInds: [0, 0],
            controlVector: [3, 5],
            core,
        });

        controlVectors[0] = [
            [3, 5],
            [-3, -5],
        ];

        await check_items(controlVectors);

        await moveControlVector({
            componentIdx: await resolvePathToNodeIdx("c"),
            controlVectorInds: [1, 0],
            controlVector: [-9, -6],
            core,
        });

        controlVectors[1] = [
            [-9, -6],
            [9, 6],
        ];
        controlVectors[2] = [
            [-9, 2],
            [9, -2],
        ];

        await check_items(controlVectors);

        await moveControlVector({
            componentIdx: await resolvePathToNodeIdx("c"),
            controlVectorInds: [2, 0],
            controlVector: [-3, 1],
            core,
        });

        controlVectors[1] = [
            [9, -9],
            [-9, 9],
        ];
        controlVectors[2] = [
            [-3, 1],
            [3, -1],
        ];

        await check_items(controlVectors);

        await moveControlVector({
            componentIdx: await resolvePathToNodeIdx("c"),
            controlVectorInds: [3, 0],
            controlVector: [-4, 3],
            core,
        });

        controlVectors[2] = [
            [-5, 3],
            [5, -3],
        ];
        controlVectors[3] = [
            [-4, 3],
            [4, -3],
        ];

        await check_items(controlVectors);
    });

    it("asymmetric controls sugared from vector operations", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <math name="m">(-3,2)</math>
    <setup><math name="mFixed" extend="$m" fixed /></setup>
    <graph>
      <point name="P">(2,1)</point>
      <curve through="(1,2) (3,4) (-5,6) (2,1)" name="c">
        <bezierControls>
          <controlVectors>(3,1)</controlVectors>
          <controlVectors direction="both">2(2,-3)+(3,4) 3$P</controlVectors>
          <controlVectors direction="both"> $P+2$mFixed $m</controlVectors>
          <controlVectors>(0,0)</controlVectors>
        </bezierControls>
      </curve>
    </graph>

    `,
        });

        async function check_items(cvs: number[][][]) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            expect(
                stateVariables[
                    await resolvePathToNodeIdx("c")
                ].stateValues.controlVectors.map((x) =>
                    x.map((y) => y.map((z) => z.tree + 0)),
                ),
            ).eqls(cvs);
        }

        let controlVectors = [
            [
                [3, 1],
                [-3, -1],
            ],
            [
                [7, -2],
                [6, 3],
            ],
            [
                [-4, 5],
                [-3, 2],
            ],
            [
                [0, 0],
                [0, 0],
            ],
        ];

        await check_items(controlVectors);

        await moveControlVector({
            componentIdx: await resolvePathToNodeIdx("c"),
            controlVectorInds: [1, 0],
            controlVector: [3, 5],
            core,
        });
        controlVectors[1] = [
            [3, 5],
            [6, 3],
        ];
        await check_items(controlVectors);

        await moveControlVector({
            componentIdx: await resolvePathToNodeIdx("c"),
            controlVectorInds: [1, 1],
            controlVector: [-9, -6],
            core,
        });
        controlVectors[1] = [
            [3, 5],
            [-9, -6],
        ];
        controlVectors[2] = [
            [-9, 2],
            [-3, 2],
        ];
        await check_items(controlVectors);

        await moveControlVector({
            componentIdx: await resolvePathToNodeIdx("c"),
            controlVectorInds: [2, 0],
            controlVector: [-3, 1],
            core,
        });
        controlVectors[1] = [
            [3, 5],
            [9, -9],
        ];
        controlVectors[2] = [
            [-3, 1],
            [-3, 2],
        ];
        await check_items(controlVectors);

        await moveControlVector({
            componentIdx: await resolvePathToNodeIdx("c"),
            controlVectorInds: [2, 1],
            controlVector: [-4, 3],
            core,
        });
        controlVectors[2] = [
            [-5, 3],
            [-4, 3],
        ];
        await check_items(controlVectors);
    });

    it("handle bad through", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
    <text name="t1">a</text>
    <graph>
      <curve through="A" />
    </graph>
    `,
        });

        // page loads
        const stateVariables = await core.returnAllStateVariables(false, true);

        expect(
            stateVariables[await resolvePathToNodeIdx("t1")].stateValues.value,
        ).eq("a");
    });
});
