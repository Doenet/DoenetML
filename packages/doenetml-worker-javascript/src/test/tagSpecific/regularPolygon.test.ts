import { describe, expect, it, vi } from "vitest";
import { createTestCore, ResolvePathToNodeIdx } from "../utils/test-core";
import {
    movePoint,
    movePolygon,
    updateBooleanInputValue,
    updateMathInputValue,
} from "../utils/actions";
import { PublicDoenetMLCore } from "../../CoreWorker";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

async function setupRegularPolygonScene({
    attributes,
}: {
    attributes: Record<string, string>;
}) {
    let attributesString = Object.keys(attributes)
        .map((attr) => `${attr} = "${attributes[attr]}"`)
        .join(" ");

    let { core, resolvePathToNodeIdx } = await createTestCore({
        doenetML:
            `
  <graph name="g1">
    <regularPolygon name="rp" ` +
            attributesString +
            `/>
  </graph>

  <graph name="g2">
    <point name="centerPoint" extend="$rp.center" />
    <pointList extend="$rp.vertices" name="vs" />
  </graph>


  <p>circumradius: <mathInput name="micr" bindValueTo="$rp.circumradius" /> <number extend="$rp.circumradius" name="cr" /></p>
  <p>radius: <mathInput name="mir" bindValueTo="$rp.radius" /> <number extend="$rp.radius" name="r" /></p>

  <p>inradius: <mathInput name="miir" bindValueTo="$rp.inradius" /> <number extend="$rp.inradius" name="ir" /></p>
  <p>apothem: <mathInput name="miap" bindValueTo="$rp.apothem" /> <number extend="$rp.apothem" name="ap" /></p>

  <p>side length: <mathInput name="misl" bindValueTo="$rp.sideLength" /> <number extend="$rp.sideLength" name="sl" /></p>
  <p>perimeter: <mathInput name="mip" bindValueTo="$rp.perimeter" /> <number extend="$rp.perimeter" name="p" /></p>


  <p>area: <mathInput name="miar" bindValueTo="$rp.area" /> <number extend="$rp.area" name="ar" /></p>

  <p>n vertices: <mathInput name="minv" bindValueTo="$rp.numVertices" /> <number extend="$rp.numVertices" name="nv" /></p>
  <p>n sides: <mathInput name="mins" bindValueTo="$rp.numSides" /> <number extend="$rp.numSides" name="ns" /></p>


  <graph name="g3">
    <regularPolygon name="rp2" extend="$rp" />
  </graph>
  
  <graph name="g4" extend="$g3" />
  `,
    });

    return { core, resolvePathToNodeIdx };
}

async function runRegularPolygonTests({
    core,
    resolvePathToNodeIdx,
    center,
    vertex1,
    numVertices,
    conservedWhenChangeNumVertices = "radius",
    abbreviated = false,
}: {
    core: PublicDoenetMLCore;
    resolvePathToNodeIdx: ResolvePathToNodeIdx;
    center: number[];
    vertex1: number[];
    numVertices: number;
    conservedWhenChangeNumVertices;
    abbreviated?: boolean;
}) {
    let polygonName = "rp";
    let centerPointName = "centerPoint";
    let allVertexNames = [
        "vs[1]",
        "vs[2]",
        "vs[3]",
        "vs[4]",
        "vs[5]",
        "vs[6]",
        "vs[7]",
        "vs[8]",
        "vs[9]",
        "vs[10]",
    ];
    let polygonCopyName = "rp2";
    let polygonCopy2Name = "g4.rp2";

    let inputs = {
        polygonNames: [polygonName, polygonCopyName, polygonCopy2Name],
        vertexNames: allVertexNames.slice(0, numVertices),
        centerPointName,
    };

    await checkPolygonValues(
        inputs,
        { numVertices, vertex1, center },
        core,
        resolvePathToNodeIdx,
    );

    // move vertices individually

    for (let i = 0; i < 3; i++) {
        let index = (i * Math.round(numVertices / 3)) % numVertices;

        let vertex = [index, index + 1];

        await movePolygon({
            componentIdx: await resolvePathToNodeIdx(polygonName),
            pointCoords: { [index]: vertex },
            core,
        });

        let angle = (-index * 2 * Math.PI) / numVertices;
        let c = Math.cos(angle);
        let s = Math.sin(angle);

        let directionWithRadius = [
            vertex[0] - center[0],
            vertex[1] - center[1],
        ];

        vertex1 = [
            directionWithRadius[0] * c - directionWithRadius[1] * s + center[0],
            directionWithRadius[0] * s + directionWithRadius[1] * c + center[1],
        ];

        await checkPolygonValues(
            inputs,
            { numVertices, vertex1, center },
            core,
            resolvePathToNodeIdx,
        );
    }

    if (!abbreviated) {
        // move polygon points together
        let stateVariables = await core.returnAllStateVariables(false, true);

        let dx = 3,
            dy = -2;

        let currentVertices = stateVariables[
            await resolvePathToNodeIdx(polygonName)
        ].stateValues.vertices.map((v) => v.map((x) => x.tree));
        let pointCoords = {};

        for (let i = 0; i < numVertices; i++) {
            pointCoords[i] = [
                currentVertices[i][0] + dx,
                currentVertices[i][1] + dy,
            ];
        }

        vertex1 = pointCoords[0];
        center = [center[0] + dx, center[1] + dy];

        await movePolygon({
            componentIdx: await resolvePathToNodeIdx(polygonName),
            pointCoords,
            core,
        });
        await checkPolygonValues(
            inputs,
            { numVertices, vertex1, center },
            core,
            resolvePathToNodeIdx,
        );

        // move center point
        vertex1 = [vertex1[0] - center[0], vertex1[1] - center[1]];
        center = [0, 0];

        await movePoint({
            componentIdx: await resolvePathToNodeIdx(centerPointName),
            x: center[0],
            y: center[1],
            core,
        });

        await checkPolygonValues(
            inputs,
            { numVertices, vertex1, center },
            core,
            resolvePathToNodeIdx,
        );

        // move copied vertices
        for (let i = 0; i < 3; i++) {
            let index = (i * Math.round(numVertices / 3) + 1) % numVertices;
            let vertex = [index / 2 + 3, -1.5 * index];

            await movePoint({
                componentIdx: await resolvePathToNodeIdx(allVertexNames[index]),
                x: vertex[0],
                y: vertex[1],
                core,
            });

            let angle = (-index * 2 * Math.PI) / numVertices;
            let c = Math.cos(angle);
            let s = Math.sin(angle);

            let directionWithRadius = [
                vertex[0] - center[0],
                vertex[1] - center[1],
            ];

            vertex1 = [
                directionWithRadius[0] * c -
                    directionWithRadius[1] * s +
                    center[0],
                directionWithRadius[0] * s +
                    directionWithRadius[1] * c +
                    center[1],
            ];

            await checkPolygonValues(
                inputs,
                {
                    numVertices,
                    vertex1,
                    center,
                },
                core,
                resolvePathToNodeIdx,
            );
        }

        // move polygonCopy vertices individually
        for (let i = 0; i < 3; i++) {
            let index = (i * Math.round(numVertices / 3) + 2) % numVertices;

            let vertex = [-index - 1, 2 * index];

            await movePolygon({
                componentIdx: await resolvePathToNodeIdx(polygonCopyName),
                pointCoords: { [index]: vertex },
                core,
            });

            let angle = (-index * 2 * Math.PI) / numVertices;
            let c = Math.cos(angle);
            let s = Math.sin(angle);

            let directionWithRadius = [
                vertex[0] - center[0],
                vertex[1] - center[1],
            ];

            vertex1 = [
                directionWithRadius[0] * c -
                    directionWithRadius[1] * s +
                    center[0],
                directionWithRadius[0] * s +
                    directionWithRadius[1] * c +
                    center[1],
            ];

            await checkPolygonValues(
                inputs,
                { numVertices, vertex1, center },
                core,
                resolvePathToNodeIdx,
            );
        }
    }

    // polygonCopy vertices together
    let stateVariables = await core.returnAllStateVariables(false, true);

    let dx = -2,
        dy = -4;

    let currentVertices = stateVariables[
        await resolvePathToNodeIdx(polygonCopyName)
    ].stateValues.vertices.map((v) => v.map((x) => x.tree));
    let pointCoords = {};

    for (let i = 0; i < numVertices; i++) {
        pointCoords[i] = [
            currentVertices[i][0] + dx,
            currentVertices[i][1] + dy,
        ];
    }

    vertex1 = pointCoords[0];
    center = [center[0] + dx, center[1] + dy];

    await movePolygon({
        componentIdx: await resolvePathToNodeIdx(polygonCopyName),
        pointCoords,
        core,
    });
    await checkPolygonValues(
        inputs,
        { numVertices, vertex1, center },
        core,
        resolvePathToNodeIdx,
    );

    if (!abbreviated) {
        // move polygonCopy2 vertices individually
        for (let i = 0; i < 3; i++) {
            let index = (i * Math.round(numVertices / 3) + 3) % numVertices;
            let vertex = [-2 * index - 1, index + 4];

            await movePolygon({
                componentIdx: await resolvePathToNodeIdx(polygonCopy2Name),
                pointCoords: { [index]: vertex },
                core,
            });

            let angle = (-index * 2 * Math.PI) / numVertices;
            let c = Math.cos(angle);
            let s = Math.sin(angle);

            let directionWithRadius = [
                vertex[0] - center[0],
                vertex[1] - center[1],
            ];

            vertex1 = [
                directionWithRadius[0] * c -
                    directionWithRadius[1] * s +
                    center[0],
                directionWithRadius[0] * s +
                    directionWithRadius[1] * c +
                    center[1],
            ];

            await checkPolygonValues(
                inputs,
                { numVertices, vertex1, center },
                core,
                resolvePathToNodeIdx,
            );
        }

        // polygonCopy2 vertices together
        let dx = 1,
            dy = -3;

        stateVariables = await core.returnAllStateVariables(false, true);
        let currentVertices = stateVariables[
            await resolvePathToNodeIdx(polygonCopyName)
        ].stateValues.vertices.map((v) => v.map((x) => x.tree));
        let pointCoords = {};

        for (let i = 0; i < numVertices; i++) {
            pointCoords[i] = [
                currentVertices[i][0] + dx,
                currentVertices[i][1] + dy,
            ];
        }

        vertex1 = pointCoords[0];
        center = [center[0] + dx, center[1] + dy];

        await movePolygon({
            componentIdx: await resolvePathToNodeIdx(polygonCopy2Name),
            pointCoords,
            core,
        });
        await checkPolygonValues(
            inputs,
            { numVertices, vertex1, center },
            core,
            resolvePathToNodeIdx,
        );
    }

    // Change circumradius
    stateVariables = await core.returnAllStateVariables(false, true);
    let oldCr =
        stateVariables[await resolvePathToNodeIdx(polygonName)].stateValues
            .circumradius;

    let circumradius = 1;

    await updateMathInputValue({
        latex: `${circumradius}`,
        componentIdx: await resolvePathToNodeIdx("micr"),
        core,
    });

    vertex1 = [
        ((vertex1[0] - center[0]) * circumradius) / oldCr + center[0],
        ((vertex1[1] - center[1]) * circumradius) / oldCr + center[1],
    ];

    await checkPolygonValues(
        inputs,
        { numVertices, vertex1, center },
        core,
        resolvePathToNodeIdx,
    );

    if (!abbreviated) {
        // Change radius

        stateVariables = await core.returnAllStateVariables(false, true);
        let oldR =
            stateVariables[await resolvePathToNodeIdx(polygonName)].stateValues
                .circumradius;

        let radius = 3;

        await updateMathInputValue({
            latex: `${radius}`,
            componentIdx: await resolvePathToNodeIdx("mir"),
            core,
        });

        vertex1 = [
            ((vertex1[0] - center[0]) * radius) / oldR + center[0],
            ((vertex1[1] - center[1]) * radius) / oldR + center[1],
        ];

        await checkPolygonValues(
            inputs,
            { numVertices, vertex1, center },
            core,
            resolvePathToNodeIdx,
        );

        // Change inradius
        stateVariables = await core.returnAllStateVariables(false, true);
        let oldIr =
            stateVariables[await resolvePathToNodeIdx(polygonName)].stateValues
                .inradius;

        let inradius = 5;

        await updateMathInputValue({
            latex: `${inradius}`,
            componentIdx: await resolvePathToNodeIdx("miir"),
            core,
        });

        vertex1 = [
            ((vertex1[0] - center[0]) * inradius) / oldIr + center[0],
            ((vertex1[1] - center[1]) * inradius) / oldIr + center[1],
        ];

        await checkPolygonValues(
            inputs,
            {
                numVertices,
                vertex1,
                center,
            },
            core,
            resolvePathToNodeIdx,
        );

        // Change apothem
        stateVariables = await core.returnAllStateVariables(false, true);
        let oldAp =
            stateVariables[await resolvePathToNodeIdx(polygonName)].stateValues
                .inradius;

        let apothem = 4;

        await updateMathInputValue({
            latex: `${apothem}`,
            componentIdx: await resolvePathToNodeIdx("miap"),
            core,
        });

        vertex1 = [
            ((vertex1[0] - center[0]) * apothem) / oldAp + center[0],
            ((vertex1[1] - center[1]) * apothem) / oldAp + center[1],
        ];

        await checkPolygonValues(
            inputs,
            { numVertices, vertex1, center },
            core,
            resolvePathToNodeIdx,
        );

        // Change sideLength
        stateVariables = await core.returnAllStateVariables(false, true);
        let oldSl =
            stateVariables[await resolvePathToNodeIdx(polygonName)].stateValues
                .sideLength;

        let sideLength = 2;

        await updateMathInputValue({
            latex: `${sideLength}`,
            componentIdx: await resolvePathToNodeIdx("misl"),
            core,
        });

        vertex1 = [
            ((vertex1[0] - center[0]) * sideLength) / oldSl + center[0],
            ((vertex1[1] - center[1]) * sideLength) / oldSl + center[1],
        ];

        await checkPolygonValues(
            inputs,
            { numVertices, vertex1, center },
            core,
            resolvePathToNodeIdx,
        );

        // Change perimeter
        stateVariables = await core.returnAllStateVariables(false, true);
        oldSl =
            stateVariables[await resolvePathToNodeIdx(polygonName)].stateValues
                .perimeter;

        let perimeter = 9;

        await updateMathInputValue({
            latex: `${perimeter}`,
            componentIdx: await resolvePathToNodeIdx("mip"),
            core,
        });

        vertex1 = [
            ((vertex1[0] - center[0]) * perimeter) / oldSl + center[0],
            ((vertex1[1] - center[1]) * perimeter) / oldSl + center[1],
        ];

        await checkPolygonValues(
            inputs,
            { numVertices, vertex1, center },
            core,
            resolvePathToNodeIdx,
        );

        // Change area
        stateVariables = await core.returnAllStateVariables(false, true);
        let oldAr =
            stateVariables[await resolvePathToNodeIdx(polygonName)].stateValues
                .area;

        let area = 13;

        await updateMathInputValue({
            latex: `${area}`,
            componentIdx: await resolvePathToNodeIdx("miar"),
            core,
        });

        vertex1 = [
            (vertex1[0] - center[0]) * Math.sqrt(area / oldAr) + center[0],
            (vertex1[1] - center[1]) * Math.sqrt(area / oldAr) + center[1],
        ];

        await checkPolygonValues(
            inputs,
            { numVertices, vertex1, center },
            core,
            resolvePathToNodeIdx,
        );
    }

    // Add two vertices
    let result = adjustVertex1CenterWhenChangeNumVertices(
        vertex1,
        center,
        numVertices,
        numVertices + 2,
        conservedWhenChangeNumVertices,
    );

    vertex1 = result.vertex1;
    center = result.center;

    numVertices += 2;

    await updateMathInputValue({
        latex: `${numVertices}`,
        componentIdx: await resolvePathToNodeIdx("minv"),
        core,
    });

    inputs.vertexNames = allVertexNames.slice(0, numVertices);

    await checkPolygonValues(
        inputs,
        { numVertices, vertex1, center },
        core,
        resolvePathToNodeIdx,
    );

    if (!abbreviated) {
        // Remove a side
        let result = adjustVertex1CenterWhenChangeNumVertices(
            vertex1,
            center,
            numVertices,
            numVertices - 1,
            conservedWhenChangeNumVertices,
        );

        vertex1 = result.vertex1;
        center = result.center;

        numVertices -= 1;

        await updateMathInputValue({
            latex: `${numVertices}`,
            componentIdx: await resolvePathToNodeIdx("mins"),
            core,
        });

        inputs.vertexNames = allVertexNames.slice(0, numVertices);

        await checkPolygonValues(
            inputs,
            {
                numVertices,
                vertex1,
                center,
            },
            core,
            resolvePathToNodeIdx,
        );
    }
}

function adjustVertex1CenterWhenChangeNumVertices(
    vertex1: number[],
    center: number[],
    numVerticesOld: number,
    numVerticesNew: number,
    conservedWhenChangeNumVertices:
        | "inradius"
        | "sideLength"
        | "perimeter"
        | "area"
        | "twoVertices",
) {
    let radiusRatio = 1;

    if (conservedWhenChangeNumVertices === "inradius") {
        radiusRatio =
            Math.cos(Math.PI / numVerticesOld) /
            Math.cos(Math.PI / numVerticesNew);
    } else if (conservedWhenChangeNumVertices === "sideLength") {
        radiusRatio =
            (2 * Math.sin(Math.PI / numVerticesOld)) /
            (2 * Math.sin(Math.PI / numVerticesNew));
    } else if (conservedWhenChangeNumVertices === "perimeter") {
        radiusRatio =
            (2 * numVerticesOld * Math.sin(Math.PI / numVerticesOld)) /
            (2 * numVerticesNew * Math.sin(Math.PI / numVerticesNew));
    } else if (conservedWhenChangeNumVertices === "area") {
        radiusRatio = Math.sqrt(
            ((numVerticesOld / 2) * Math.sin((2 * Math.PI) / numVerticesOld)) /
                ((numVerticesNew / 2) *
                    Math.sin((2 * Math.PI) / numVerticesNew)),
        );
    } else if (conservedWhenChangeNumVertices === "twoVertices") {
        // calculate vertex2
        let directionWithRadius = [
            vertex1[0] - center[0],
            vertex1[1] - center[1],
        ];

        let angleOld = (2 * Math.PI) / numVerticesOld;
        let c = Math.cos(angleOld);
        let s = Math.sin(angleOld);

        let vertex2 = [
            directionWithRadius[0] * c - directionWithRadius[1] * s + center[0],
            directionWithRadius[0] * s + directionWithRadius[1] * c + center[1],
        ];

        // calculate center based on this vertex 2 and new numVertices
        let sideVector = [vertex2[0] - vertex1[0], vertex2[1] - vertex1[1]];
        let midpoint = [
            (vertex1[0] + vertex2[0]) / 2,
            (vertex1[1] + vertex2[1]) / 2,
        ];
        let sideLength = Math.sqrt(sideVector[0] ** 2 + sideVector[1] ** 2);
        let inradius = sideLength / (2 * Math.tan(Math.PI / numVerticesNew));

        let inradiusDirection = [
            -sideVector[1] / sideLength,
            sideVector[0] / sideLength,
        ];

        center = [
            midpoint[0] + inradiusDirection[0] * inradius,
            midpoint[1] + inradiusDirection[1] * inradius,
        ];
    }

    vertex1 = [
        (vertex1[0] - center[0]) * radiusRatio + center[0],
        (vertex1[1] - center[1]) * radiusRatio + center[1],
    ];

    return { vertex1, center };
}

async function checkPolygonValues(
    {
        polygonNames,
        vertexNames,
        centerPointName,
    }: {
        polygonNames: string[];
        vertexNames?: string[];
        centerPointName?: string;
    },
    {
        numVertices,
        center,
        vertex1,
    }: { numVertices: number; center: number[]; vertex1: number[] },
    core: PublicDoenetMLCore,
    resolvePathToNodeIdx: ResolvePathToNodeIdx,
) {
    let vertexCoords = [vertex1];

    let directionWithRadius = [vertex1[0] - center[0], vertex1[1] - center[1]];

    let circumradius = Math.sqrt(
        directionWithRadius[0] ** 2 + directionWithRadius[1] ** 2,
    );
    let inradius = circumradius * Math.cos(Math.PI / numVertices);
    let sideLength = circumradius * (2 * Math.sin(Math.PI / numVertices));
    let perimeter =
        circumradius * (2 * numVertices * Math.sin(Math.PI / numVertices));
    let area =
        circumradius ** 2 *
        ((numVertices / 2) * Math.sin((2 * Math.PI) / numVertices));

    for (let i = 1; i < numVertices; i++) {
        let angle = (i * 2 * Math.PI) / numVertices;
        let c = Math.cos(angle);
        let s = Math.sin(angle);

        vertexCoords.push([
            directionWithRadius[0] * c - directionWithRadius[1] * s + center[0],
            directionWithRadius[0] * s + directionWithRadius[1] * c + center[1],
        ]);
    }

    const stateVariables = await core.returnAllStateVariables(false, true);

    for (let polygonName of polygonNames) {
        let polygon = stateVariables[await resolvePathToNodeIdx(polygonName)];
        for (let i = 0; i < numVertices; i++) {
            expect(polygon.stateValues.vertices[i][0].tree).closeTo(
                vertexCoords[i][0],
                1e-13 * Math.abs(vertexCoords[i][0]) + 1e-13,
            );
            expect(polygon.stateValues.vertices[i][1].tree).closeTo(
                vertexCoords[i][1],
                1e-13 * Math.abs(vertexCoords[i][1]) + 1e-13,
            );
        }
        expect(polygon.stateValues.center[0].tree).closeTo(
            center[0],
            1e-13 * Math.abs(center[0]) + 1e-13,
        );
        expect(polygon.stateValues.center[1].tree).closeTo(
            center[1],
            1e-13 * Math.abs(center[1]) + 1e-13,
        );

        expect(polygon.stateValues.numVertices).eq(numVertices);

        expect(polygon.stateValues.circumradius).closeTo(
            circumradius,
            1e-13 * circumradius,
        );
        expect(polygon.stateValues.inradius).closeTo(
            inradius,
            1e-13 * inradius,
        );
        expect(polygon.stateValues.sideLength).closeTo(
            sideLength,
            1e-13 * sideLength,
        );
        expect(polygon.stateValues.perimeter).closeTo(
            perimeter,
            1e-13 * perimeter,
        );
        expect(polygon.stateValues.area).closeTo(area, 1e-13 * area);
    }

    if (vertexNames) {
        for (let [i, vertexName] of vertexNames.entries()) {
            let vertex = stateVariables[await resolvePathToNodeIdx(vertexName)];
            expect(vertex.stateValues.xs[0].tree).closeTo(
                vertexCoords[i][0],
                1e-13 * Math.abs(vertexCoords[i][0]) + 1e-13,
            );
            expect(vertex.stateValues.xs[1].tree).closeTo(
                vertexCoords[i][1],
                1e-13 * Math.abs(vertexCoords[i][1]) + 1e-13,
            );
        }
    }

    if (centerPointName) {
        let centerPoint =
            stateVariables[await resolvePathToNodeIdx(centerPointName)];
        expect(centerPoint.stateValues.xs[0].tree).closeTo(
            center[0],
            1e-13 * Math.abs(center[0]) + 1e-13,
        );
        expect(centerPoint.stateValues.xs[1].tree).closeTo(
            center[1],
            1e-13 * Math.abs(center[1]) + 1e-13,
        );
    }
}

describe("Regular Polygon  tag tests", async () => {
    it("regular polygon with no parameters (gives triangle)", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {},
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 3,
            vertex1: [1, 0],
            center: [0, 0],
            conservedWhenChangeNumVertices: "circumradius",
        });
    });

    it("specify area for square", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numVertices: "4",
                area: "100",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 4,
            vertex1: [Math.sqrt(2) * 5, 0],
            center: [0, 0],
            conservedWhenChangeNumVertices: "area",
        });
    });

    it("specify sidelength, center for pentagon", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numSides: "5",
                sideLength: "2",
                center: "(4,2)",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 5,
            vertex1: [4 + 2 / (2 * Math.sin(Math.PI / 5)), 2],
            center: [4, 2],
            conservedWhenChangeNumVertices: "sideLength",
        });
    });

    it("specify inRadius, center for hexagon", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numVertices: "6",
                inRadius: "3",
                center: "(-2,5)",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 6,
            vertex1: [-2 + 3 / Math.cos(Math.PI / 6), 5],
            center: [-2, 5],
            conservedWhenChangeNumVertices: "inradius",
        });
    });

    it("specify apothem for heptagon", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numSides: "7",
                apothem: "4",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 7,
            vertex1: [0 + 4 / Math.cos(Math.PI / 7), 0],
            center: [0, 0],
            conservedWhenChangeNumVertices: "inradius",
            abbreviated: true,
        });
    });

    it("specify perimeter, center for octagon", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numVertices: "8",
                perimeter: "20",
                center: "(-4,7)",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 8,
            vertex1: [-4 + 20 / 8 / (2 * Math.sin(Math.PI / 8)), 7],
            center: [-4, 7],
            conservedWhenChangeNumVertices: "perimeter",
            abbreviated: true,
        });
    });

    it("specify circumradius, center for triangle", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numSides: "3",
                circumradius: "6",
                center: "(-5,8)",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 3,
            vertex1: [-5 + 6, 8],
            center: [-5, 8],
            conservedWhenChangeNumVertices: "circumradius",
        });
    });

    it("specify radius for square", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numVertices: "4",
                radius: "7",
                center: "(-6,-2)",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 4,
            vertex1: [-6 + 7, -2],
            center: [-6, -2],
            conservedWhenChangeNumVertices: "circumradius",
            abbreviated: true,
        });
    });

    it("specify center for pentagon", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numVertices: "5",
                center: "(-5,-3)",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 5,
            vertex1: [-5 + 1, -3],
            center: [-5, -3],
            conservedWhenChangeNumVertices: "circumradius",
        });
    });

    it("specify one vertex for square", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numVertices: "4",
                vertices: "(2,-5)",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 4,
            vertex1: [2, -5],
            center: [1, -5],
            conservedWhenChangeNumVertices: "circumradius",
        });
    });

    it("specify two vertices for pentagon", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numVertices: "5",
                vertices: "(2,-5) (5,1)",
            },
        });

        let numVertices = 5;

        let vertex1 = [2, -5];
        let vertex2 = [5, 1];

        let sideVector = [vertex2[0] - vertex1[0], vertex2[1] - vertex1[1]];
        let midpoint = [
            (vertex1[0] + vertex2[0]) / 2,
            (vertex1[1] + vertex2[1]) / 2,
        ];
        let sideLength = Math.sqrt(sideVector[0] ** 2 + sideVector[1] ** 2);
        let inradius = sideLength / (2 * Math.tan(Math.PI / numVertices));

        let inradiusDirection = [
            -sideVector[1] / sideLength,
            sideVector[0] / sideLength,
        ];

        let center = [
            midpoint[0] + inradiusDirection[0] * inradius,
            midpoint[1] + inradiusDirection[1] * inradius,
        ];

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices,
            vertex1,
            center,
            conservedWhenChangeNumVertices: "twoVertices",
        });
    });

    it("specify center and one vertex for triangle", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numVertices: "3",
                vertices: "(2,-5)",
                center: "(-1,-3)",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 3,
            vertex1: [2, -5],
            center: [-1, -3],
            conservedWhenChangeNumVertices: "circumradius",
        });
    });

    it("specify center and two vertices for triangle, ignore second vertex", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numVertices: "3",
                vertices: "(2,-5) (10,12)",
                center: "(-1,-3)",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 3,
            vertex1: [2, -5],
            center: [-1, -3],
            conservedWhenChangeNumVertices: "circumradius",
            abbreviated: true,
        });
    });

    it("specify center and vertex for triangle, ignore all size attributes", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numVertices: "3",
                vertices: "(2,-5)",
                center: "(-1,-3)",
                circumradius: "11",
                inradius: "3",
                sideLength: "5",
                perimeter: "10",
                area: "99",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 3,
            vertex1: [2, -5],
            center: [-1, -3],
            conservedWhenChangeNumVertices: "circumradius",
            abbreviated: true,
        });
    });

    it("specify center and circumradius for triangle, ignore all other size attributes", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numVertices: "3",
                center: "(-1,-3)",
                circumradius: "11",
                inradius: "3",
                sideLength: "5",
                perimeter: "10",
                area: "99",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 3,
            vertex1: [10, -3],
            center: [-1, -3],
            conservedWhenChangeNumVertices: "circumradius",
            abbreviated: true,
        });
    });

    it("specify vertex and circumradius for triangle, ignore all other size attributes", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numVertices: "3",
                vertices: "(2,-5)",
                circumradius: "11",
                inradius: "3",
                sideLength: "5",
                perimeter: "10",
                area: "99",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 3,
            vertex1: [2, -5],
            center: [-9, -5],
            conservedWhenChangeNumVertices: "circumradius",
            abbreviated: true,
        });
    });

    it("specify two vertices for triangle, ingnore all size attributes", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numVertices: "3",
                vertices: "(2,-5) (5,1)",
                circumradius: "11",
                inradius: "3",
                sideLength: "5",
                perimeter: "10",
                area: "99",
            },
        });

        let numVertices = 3;

        let vertex1 = [2, -5];
        let vertex2 = [5, 1];

        let sideVector = [vertex2[0] - vertex1[0], vertex2[1] - vertex1[1]];
        let midpoint = [
            (vertex1[0] + vertex2[0]) / 2,
            (vertex1[1] + vertex2[1]) / 2,
        ];
        let sideLength = Math.sqrt(sideVector[0] ** 2 + sideVector[1] ** 2);
        let inradius = sideLength / (2 * Math.tan(Math.PI / numVertices));

        let inradiusDirection = [
            -sideVector[1] / sideLength,
            sideVector[0] / sideLength,
        ];

        let center = [
            midpoint[0] + inradiusDirection[0] * inradius,
            midpoint[1] + inradiusDirection[1] * inradius,
        ];

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices,
            vertex1,
            center,
            conservedWhenChangeNumVertices: "twoVertices",
            abbreviated: true,
        });
    });

    it("specify circumradius for triangle, ignore all other size attributes", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numVertices: "3",
                circumradius: "11",
                inradius: "3",
                sideLength: "5",
                perimeter: "10",
                area: "99",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 3,
            vertex1: [11, 0],
            center: [0, 0],
            conservedWhenChangeNumVertices: "circumradius",
            abbreviated: true,
        });
    });

    it("specify radius for triangle, ignore all other size attributes", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numVertices: "3",
                radius: "11",
                inradius: "3",
                sideLength: "5",
                perimeter: "10",
                area: "99",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 3,
            vertex1: [11, 0],
            center: [0, 0],
            conservedWhenChangeNumVertices: "circumradius",
            abbreviated: true,
        });
    });

    it("specify inradius for triangle, ignore all other size attributes", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numVertices: "3",
                inradius: "3",
                sideLength: "5",
                perimeter: "10",
                area: "99",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 3,
            vertex1: [3 / Math.cos(Math.PI / 3), 0],
            center: [0, 0],
            conservedWhenChangeNumVertices: "inradius",
            abbreviated: true,
        });
    });

    it("specify center and apothem for triangle, ignore all other size attributes", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numVertices: "3",
                center: "(-1,-3)",
                apothem: "3",
                sideLength: "5",
                perimeter: "10",
                area: "99",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 3,
            vertex1: [-1 + 3 / Math.cos(Math.PI / 3), -3],
            center: [-1, -3],
            conservedWhenChangeNumVertices: "inradius",
            abbreviated: true,
        });
    });

    it("specify sideLength for triangle, ignore all other size attributes", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numVertices: "3",
                sideLength: "5",
                perimeter: "10",
                area: "99",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 3,
            vertex1: [5 / (2 * Math.sin(Math.PI / 3)), 0],
            center: [0, 0],
            conservedWhenChangeNumVertices: "sideLength",
            abbreviated: true,
        });
    });

    it("specify center and perimeter for triangle, ignore area", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numVertices: "3",
                center: "(-1,-3)",
                perimeter: "10",
                area: "99",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 3,
            vertex1: [-1 + 10 / (3 * 2 * Math.sin(Math.PI / 3)), -3],
            center: [-1, -3],
            conservedWhenChangeNumVertices: "perimeter",
            abbreviated: true,
        });
    });

    it("specify numVertices, ignore numSides", async () => {
        let { core, resolvePathToNodeIdx } = await setupRegularPolygonScene({
            attributes: {
                numVertices: "4",
                numSides: "6",
                center: "(4,1)",
            },
        });

        await runRegularPolygonTests({
            core,
            resolvePathToNodeIdx,
            numVertices: 4,
            vertex1: [5, 1],
            center: [4, 1],
            conservedWhenChangeNumVertices: "circumradius",
            abbreviated: true,
        });
    });

    it("draggable, vertices draggable", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <regularPolygon vertices="(1,3) (5,7)" name="p" draggable="$draggable" verticesDraggable="$verticesDraggable" />
  </graph>
  <p>draggable: <booleanInput name="draggable" /></p>
  <p>vertices draggable: <booleanInput name="verticesDraggable" /></p>
  `,
        });

        async function check_items(
            vertices: Record<string, number[]> | number[][],
            draggable: boolean,
            verticesDraggable: boolean,
        ) {
            const stateVariables = await core.returnAllStateVariables(
                false,
                true,
            );
            for (let ind in vertices) {
                for (let dim = 0; dim < 2; dim++) {
                    expect(
                        stateVariables[await resolvePathToNodeIdx("p")]
                            .stateValues.vertices[ind][dim].tree,
                    ).closeTo(vertices[ind][dim], 1e-13);
                }
            }
            expect(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .draggable,
            ).eq(draggable);
            expect(
                stateVariables[await resolvePathToNodeIdx("p")].stateValues
                    .verticesDraggable,
            ).eq(verticesDraggable);
        }

        let vertices: Record<string, number[]> | number[][] = {
            0: [1, 3],
            1: [5, 7],
        };
        let draggable = false;
        let verticesDraggable = false;

        await check_items(vertices, draggable, verticesDraggable);

        // cannot move single vertex
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: { 0: [4, 7] },
            core,
        });
        await check_items(vertices, draggable, verticesDraggable);

        // cannot move all vertices
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: [
                [4, 7],
                [8, 10],
                [1, 9],
            ],
            core,
        });
        await check_items(vertices, draggable, verticesDraggable);

        // only vertices draggable
        verticesDraggable = true;
        await updateBooleanInputValue({
            boolean: verticesDraggable,
            componentIdx: await resolvePathToNodeIdx("verticesDraggable"),
            core,
        });

        // can move single vertex
        vertices = { 0: [4, 7] };
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: vertices,
            core,
        });
        await check_items(vertices, draggable, verticesDraggable);

        // cannot move all vertices
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: [
                [3, 8],
                [8, 10],
                [1, 9],
            ],
            core,
        });
        await check_items(vertices, draggable, verticesDraggable);

        // vertices and polygon draggable
        draggable = true;
        await updateBooleanInputValue({
            boolean: draggable,
            componentIdx: await resolvePathToNodeIdx("draggable"),
            core,
        });

        // can move single vertex
        vertices = { 1: [-3, 2] };
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: vertices,
            core,
        });
        await check_items(vertices, draggable, verticesDraggable);

        // can move all vertices
        let stateVariables = await core.returnAllStateVariables(false, true);
        vertices = stateVariables[
            await resolvePathToNodeIdx("p")
        ].stateValues.vertices.map((v) => v.map((x) => x.tree)) as number[][];

        let dx = 4;
        let dy = -5;
        vertices = vertices.map((vertex) => [vertex[0] + dx, vertex[1] + dy]);

        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: vertices,
            core,
        });
        await check_items(vertices, draggable, verticesDraggable);

        // polygon but not vertices draggable
        verticesDraggable = false;
        await updateBooleanInputValue({
            boolean: verticesDraggable,
            componentIdx: await resolvePathToNodeIdx("verticesDraggable"),
            core,
        });

        // cannot move single vertex
        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: { 0: [9, 3] },
            core,
        });
        await check_items(vertices, draggable, verticesDraggable);

        // can move all vertices
        dx = -8;
        dy = 4;
        vertices = vertices.map((vertex) => [vertex[0] + dx, vertex[1] + dy]);

        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords: vertices,
            core,
        });
        await check_items(vertices, draggable, verticesDraggable);
    });

    it("two vertices, first vertex constrained to grid", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <point name="P">(1,3)
         <constrainToGrid dx="3" dy="2" />
    </point>
    <point name="Q">(6,5)</point>
    <regularPolygon numSides="5" vertices="$P $Q" name="p" />
  </graph>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[0].map(
                (v) => Math.round(v.tree * 1e13) / 1e13,
            ),
        ).eqls([0, 4]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[1].map(
                (v) => Math.round(v.tree * 1e13) / 1e13,
            ),
        ).eqls([6, 5]);

        // move pentagon
        let numericalVertices =
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .numericalVertices;

        let dx = -7;
        let dy = -5;

        let pointCoords = numericalVertices.map((v) => [v[0] + dx, v[1] + dy]);

        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[0].map(
                (v) => Math.round(v.tree * 1e13) / 1e13,
            ),
        ).eqls([-6, 0]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[1].map(
                (v) => Math.round(v.tree * 1e13) / 1e13,
            ),
        ).eqls([0, 1]);
    });

    it("two vertices, second vertex constrained to grid", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <point name="P">(1,3)
         <constrainToGrid dx="3" dy="2" />
    </point>
    <point name="Q">(6,5)</point>
    <regularPolygon numSides="5" vertices="$Q $P" name="p" />
  </graph>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[0].map(
                (v) => Math.round(v.tree * 1e13) / 1e13,
            ),
        ).eqls([6, 5]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[1].map(
                (v) => Math.round(v.tree * 1e13) / 1e13,
            ),
        ).eqls([0, 4]);

        // move pentagon
        let numericalVertices =
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .numericalVertices;

        let dx = -7;
        let dy = -5;

        let pointCoords = numericalVertices.map((v) => [v[0] + dx, v[1] + dy]);

        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[0].map(
                (v) => Math.round(v.tree * 1e13) / 1e13 + 0, // to convert -0 to 0
            ),
        ).eqls([0, 1]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[1].map(
                (v) => Math.round(v.tree * 1e13) / 1e13 + 0, // to convert -0 to 0
            ),
        ).eqls([-6, 0]);
    });

    it("center and vertex, vertex constrained to grid", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <point name="P">(1,3)
         <constrainToGrid dx="3" dy="2" />
    </point>
    <point name="Q">(6,5)</point>
    <regularPolygon numSides="5" vertices="$P" center="$Q" name="p" />
  </graph>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[0].map(
                (v) => Math.round(v.tree * 1e13) / 1e13,
            ),
        ).eqls([0, 4]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.center.map((v) => Math.round(v.tree * 1e13) / 1e13),
        ).eqls([6, 5]);

        // move pentagon

        let numericalVertices =
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .numericalVertices;

        let dx = -7;
        let dy = -5;

        let pointCoords = numericalVertices.map((v) => [v[0] + dx, v[1] + dy]);

        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[0].map(
                (v) => Math.round(v.tree * 1e13) / 1e13,
            ),
        ).eqls([-6, 0]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.center.map((v) => Math.round(v.tree * 1e13) / 1e13),
        ).eqls([0, 1]);
    });

    it("center and vertex, center constrained to grid", async () => {
        let { core, resolvePathToNodeIdx } = await createTestCore({
            doenetML: `
  <graph>
    <point name="P">(1,3)</point>
    <point name="Q">(6,5)
        <constrainToGrid dx="3" dy="2" />
    </point>
    <regularPolygon numSides="5" vertices="$P" center="$Q" name="p" />
  </graph>
  `,
        });

        let stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[0].map(
                (v) => Math.round(v.tree * 1e13) / 1e13,
            ),
        ).eqls([1, 3]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.center.map((v) => Math.round(v.tree * 1e13) / 1e13),
        ).eqls([6, 6]);

        // move pentagon

        let numericalVertices =
            stateVariables[await resolvePathToNodeIdx("p")].stateValues
                .numericalVertices;

        let dx = -7;
        let dy = -5 + 1e-10;

        let pointCoords = numericalVertices.map((v) => [v[0] + dx, v[1] + dy]);

        await movePolygon({
            componentIdx: await resolvePathToNodeIdx("p"),
            pointCoords,
            core,
        });

        stateVariables = await core.returnAllStateVariables(false, true);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.vertices[0].map(
                (v) => Math.round(v.tree * 1e13) / 1e13,
            ),
        ).eqls([-5, -1]);
        expect(
            stateVariables[
                await resolvePathToNodeIdx("p")
            ].stateValues.center.map((v) => Math.round(v.tree * 1e13) / 1e13),
        ).eqls([0, 2]);
    });
});
