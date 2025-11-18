import { returnRoundingAttributeComponentShadowing } from "../utils/rounding";
import Polyline from "./Polyline";

export default class Polygon extends Polyline {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            movePolygon: this.movePolygon.bind(this),
            reflectPolygon: this.reflectPolygon.bind(this),
            polygonClicked: this.polygonClicked.bind(this),
            polygonFocused: this.polygonFocused.bind(this),
        });
    }
    static componentType = "polygon";
    static representsClosedPath = true;

    get movePolygon() {
        return this.movePolyline;
    }

    get reflectPolygon() {
        return this.reflectPolyline;
    }

    get polygonClicked() {
        return this.polylineClicked;
    }

    get polygonFocused() {
        return this.polylineFocused;
    }

    static createAttributesObject() {
        let attributes = super.createAttributesObject();

        attributes.filled = {
            createComponentOfType: "boolean",
            createStateVariable: "filled",
            defaultValue: false,
            public: true,
            forRenderer: true,
        };

        return attributes;
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        stateVariableDefinitions.styleDescription = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                selectedStyle: {
                    dependencyType: "stateVariable",
                    variableName: "selectedStyle",
                },
                filled: {
                    dependencyType: "stateVariable",
                    variableName: "filled",
                },
                document: {
                    dependencyType: "ancestor",
                    componentType: "document",
                    variableNames: ["theme"],
                },
            }),
            definition: function ({ dependencyValues }) {
                let lineColorWord;
                if (dependencyValues.document?.stateValues.theme === "dark") {
                    lineColorWord =
                        dependencyValues.selectedStyle.lineColorWordDarkMode;
                } else {
                    lineColorWord =
                        dependencyValues.selectedStyle.lineColorWord;
                }

                let borderDescription =
                    dependencyValues.selectedStyle.lineWidthWord;
                if (dependencyValues.selectedStyle.lineStyleWord) {
                    if (borderDescription) {
                        borderDescription += " ";
                    }
                    borderDescription +=
                        dependencyValues.selectedStyle.lineStyleWord;
                }
                if (borderDescription) {
                    borderDescription += " ";
                }

                let styleDescription;
                if (!dependencyValues.filled) {
                    styleDescription = borderDescription + lineColorWord;
                } else {
                    let fillColorWord;
                    if (
                        dependencyValues.document?.stateValues.theme === "dark"
                    ) {
                        fillColorWord =
                            dependencyValues.selectedStyle
                                .fillColorWordDarkMode;
                    } else {
                        fillColorWord =
                            dependencyValues.selectedStyle.fillColorWord;
                    }

                    if (fillColorWord === lineColorWord) {
                        styleDescription = "filled " + fillColorWord;
                        if (borderDescription) {
                            styleDescription +=
                                " with " + borderDescription + "border";
                        }
                    } else {
                        styleDescription =
                            "filled " +
                            fillColorWord +
                            " with " +
                            borderDescription +
                            lineColorWord +
                            " border";
                    }
                }

                return { setValue: { styleDescription } };
            },
        };

        stateVariableDefinitions.styleDescriptionWithNoun = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                selectedStyle: {
                    dependencyType: "stateVariable",
                    variableName: "selectedStyle",
                },
                filled: {
                    dependencyType: "stateVariable",
                    variableName: "filled",
                },
                document: {
                    dependencyType: "ancestor",
                    componentType: "document",
                    variableNames: ["theme"],
                },
            }),
            definition: function ({ dependencyValues }) {
                let lineColorWord;
                if (dependencyValues.document?.stateValues.theme === "dark") {
                    lineColorWord =
                        dependencyValues.selectedStyle.lineColorWordDarkMode;
                } else {
                    lineColorWord =
                        dependencyValues.selectedStyle.lineColorWord;
                }

                let borderDescription =
                    dependencyValues.selectedStyle.lineWidthWord;
                if (dependencyValues.selectedStyle.lineStyleWord) {
                    if (borderDescription) {
                        borderDescription += " ";
                    }
                    borderDescription +=
                        dependencyValues.selectedStyle.lineStyleWord;
                }
                if (borderDescription) {
                    borderDescription += " ";
                }

                let styleDescriptionWithNoun;
                if (!dependencyValues.filled) {
                    styleDescriptionWithNoun =
                        borderDescription + lineColorWord + " polygon";
                } else {
                    let fillColorWord;
                    if (
                        dependencyValues.document?.stateValues.theme === "dark"
                    ) {
                        fillColorWord =
                            dependencyValues.selectedStyle
                                .fillColorWordDarkMode;
                    } else {
                        fillColorWord =
                            dependencyValues.selectedStyle.fillColorWord;
                    }

                    if (fillColorWord === lineColorWord) {
                        styleDescriptionWithNoun =
                            "filled " + fillColorWord + " polygon";
                        if (borderDescription) {
                            styleDescriptionWithNoun +=
                                " with a " + borderDescription + "border";
                        }
                    } else {
                        styleDescriptionWithNoun =
                            "filled " +
                            fillColorWord +
                            " polygon with a " +
                            borderDescription +
                            lineColorWord +
                            " border";
                    }
                }

                return { setValue: { styleDescriptionWithNoun } };
            },
        };

        stateVariableDefinitions.borderStyleDescription = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                selectedStyle: {
                    dependencyType: "stateVariable",
                    variableName: "selectedStyle",
                },
                document: {
                    dependencyType: "ancestor",
                    componentType: "document",
                    variableNames: ["theme"],
                },
            }),
            definition: function ({ dependencyValues }) {
                let lineColorWord;
                if (dependencyValues.document?.stateValues.theme === "dark") {
                    lineColorWord =
                        dependencyValues.selectedStyle.lineColorWordDarkMode;
                } else {
                    lineColorWord =
                        dependencyValues.selectedStyle.lineColorWord;
                }

                let borderStyleDescription =
                    dependencyValues.selectedStyle.lineWidthWord;
                if (dependencyValues.selectedStyle.lineStyleWord) {
                    if (borderStyleDescription) {
                        borderStyleDescription += " ";
                    }
                    borderStyleDescription +=
                        dependencyValues.selectedStyle.lineStyleWord;
                }

                if (borderStyleDescription) {
                    borderStyleDescription += " ";
                }

                borderStyleDescription += lineColorWord;

                return { setValue: { borderStyleDescription } };
            },
        };

        stateVariableDefinitions.fillStyleDescription = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                selectedStyle: {
                    dependencyType: "stateVariable",
                    variableName: "selectedStyle",
                },
                filled: {
                    dependencyType: "stateVariable",
                    variableName: "filled",
                },
                document: {
                    dependencyType: "ancestor",
                    componentType: "document",
                    variableNames: ["theme"],
                },
            }),
            definition: function ({ dependencyValues }) {
                let fillColorWord;
                if (dependencyValues.document?.stateValues.theme === "dark") {
                    fillColorWord =
                        dependencyValues.selectedStyle.fillColorWordDarkMode;
                } else {
                    fillColorWord =
                        dependencyValues.selectedStyle.fillColorWord;
                }

                let fillStyleDescription;
                if (!dependencyValues.filled) {
                    fillStyleDescription = "unfilled";
                } else {
                    fillStyleDescription = fillColorWord;
                }

                return { setValue: { fillStyleDescription } };
            },
        };

        stateVariableDefinitions.numSides = {
            isAlias: true,
            targetVariableName: "numVertices",
        };

        delete stateVariableDefinitions.length;

        stateVariableDefinitions.perimeter = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnRoundingAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                numericalVertices: {
                    dependencyType: "stateVariable",
                    variableName: "numericalVertices",
                },
            }),
            definition({ dependencyValues }) {
                let perimeter = 0;
                let verts = dependencyValues.numericalVertices;
                let nVerts = dependencyValues.numericalVertices.length;
                for (let i = 0; i < nVerts; i++) {
                    let dx = verts[(i + 1) % nVerts][0] - verts[i][0];
                    let dy = verts[(i + 1) % nVerts][1] - verts[i][1];
                    perimeter += Math.sqrt(dx * dx + dy * dy);
                }

                return { setValue: { perimeter } };
            },
        };

        stateVariableDefinitions.area = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnRoundingAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                numericalVertices: {
                    dependencyType: "stateVariable",
                    variableName: "numericalVertices",
                },
            }),
            definition({ dependencyValues }) {
                let area2 = 0;
                let verts = dependencyValues.numericalVertices;
                let nVerts = dependencyValues.numericalVertices.length;
                for (let i = 1; i <= nVerts; i++) {
                    area2 +=
                        verts[i % nVerts][1] *
                        (verts[(i + 1) % nVerts][0] - verts[i - 1][0]);
                }

                return { setValue: { area: Math.abs(area2 / 2) } };
            },
        };

        // overwrite nearestPoint so that it includes
        // segment between first and last vertex
        stateVariableDefinitions.nearestPoint = {
            returnDependencies: () => ({
                numDimensions: {
                    dependencyType: "stateVariable",
                    variableName: "numDimensions",
                },
                numericalVertices: {
                    dependencyType: "stateVariable",
                    variableName: "numericalVertices",
                },
                numVertices: {
                    dependencyType: "stateVariable",
                    variableName: "numVertices",
                },
            }),
            definition({ dependencyValues }) {
                let numDimensions = dependencyValues.numDimensions;
                let numVertices = dependencyValues.numVertices;
                let numericalVertices = dependencyValues.numericalVertices;

                let vals = [];
                let prPtx, prPty;
                let nxPtx = numericalVertices[numVertices - 1]?.[0];
                let nxPty = numericalVertices[numVertices - 1]?.[1];

                for (let i = 0; i < numVertices; i++) {
                    prPtx = nxPtx;
                    prPty = nxPty;

                    nxPtx = numericalVertices[i]?.[0];
                    nxPty = numericalVertices[i]?.[1];

                    // only implement for constants
                    if (
                        !(
                            Number.isFinite(prPtx) &&
                            Number.isFinite(prPty) &&
                            Number.isFinite(nxPtx) &&
                            Number.isFinite(nxPty)
                        )
                    ) {
                        vals.push(null);
                    } else {
                        let BA1sub = nxPtx - prPtx;
                        let BA2sub = nxPty - prPty;

                        if (BA1sub === 0 && BA2sub === 0) {
                            vals.push(null);
                        } else {
                            vals.push([BA1sub, BA2sub]);
                        }
                    }
                }

                return {
                    setValue: {
                        nearestPoint: function ({ variables, scales }) {
                            let xscale = scales[0];
                            let yscale = scales[1];

                            // only implemented in 2D for now
                            if (numDimensions !== 2 || numVertices === 0) {
                                return {};
                            }

                            let closestDistance2 = Infinity;
                            let closestResult = {};

                            let x1 = variables.x1?.evaluate_to_constant();
                            let x2 = variables.x2?.evaluate_to_constant();

                            let prevPtx, prevPty;
                            let nextPtx = numericalVertices[numVertices - 1][0];
                            let nextPty = numericalVertices[numVertices - 1][1];

                            for (let i = 0; i < numVertices; i++) {
                                prevPtx = nextPtx;
                                prevPty = nextPty;

                                nextPtx = numericalVertices[i][0];
                                nextPty = numericalVertices[i][1];

                                let val = vals[i];
                                if (val === null) {
                                    continue;
                                }

                                let BA1 = val[0] / xscale;
                                let BA2 = val[1] / yscale;
                                let denom = BA1 * BA1 + BA2 * BA2;

                                let t =
                                    (((x1 - prevPtx) / xscale) * BA1 +
                                        ((x2 - prevPty) / yscale) * BA2) /
                                    denom;

                                let result;

                                if (t <= 0) {
                                    result = { x1: prevPtx, x2: prevPty };
                                } else if (t >= 1) {
                                    result = { x1: nextPtx, x2: nextPty };
                                } else {
                                    result = {
                                        x1: prevPtx + t * BA1 * xscale,
                                        x2: prevPty + t * BA2 * yscale,
                                    };
                                }

                                let distance2 =
                                    Math.pow((x1 - result.x1) / xscale, 2) +
                                    Math.pow((x2 - result.x2) / yscale, 2);

                                if (distance2 < closestDistance2) {
                                    closestDistance2 = distance2;
                                    closestResult = result;
                                }
                            }

                            if (
                                variables.x3 !== undefined &&
                                Object.keys(closestResult).length > 0
                            ) {
                                closestResult.x3 = 0;
                            }

                            return closestResult;
                        },
                    },
                };
            },
        };

        stateVariableDefinitions.closed = {
            returnDependencies: () => ({}),
            definition: () => ({ setValue: { closed: true } }),
        };

        stateVariableDefinitions.containsPoint = {
            returnDependencies: () => ({
                numericalVertices: {
                    dependencyType: "stateVariable",
                    variableName: "numericalVertices",
                },
            }),
            definition({ dependencyValues }) {
                // Algorithm based on code from
                // https://web.archive.org/web/20130126163405/http://geomalgorithms.com/a03-_inclusion.html
                // which has this copyright:

                // Copyright 2000 softSurfer, 2012 Dan Sunday
                // This code may be freely used and modified for any purpose
                // providing that this copyright notice is included with it.
                // SoftSurfer makes no warranty for this code, and cannot be held
                // liable for any real or imagined damage resulting from its use.
                // Users of this code must verify correctness for their application.

                let vertices = dependencyValues.numericalVertices;
                let numVertices = vertices.length;
                let dim = vertices[0]?.length;

                if (dim !== 2) {
                    return { setValue: { containsPoint: () => false } };
                }

                let minx = Infinity,
                    maxx = -Infinity,
                    miny = Infinity,
                    maxy = -Infinity;
                for (let vertex of vertices) {
                    if (vertex[0] < minx) {
                        minx = vertex[0];
                    }
                    if (vertex[0] > maxx) {
                        maxx = vertex[0];
                    }
                    if (vertex[1] < miny) {
                        miny = vertex[1];
                    }
                    if (vertex[1] > maxy) {
                        maxy = vertex[1];
                    }
                }

                // isLeft(): tests if a point is Left|On|Right of an infinite line.
                //    Input:  three points P0, P1, and P2
                //    Return: >0 for P2 left of the line through P0 and P1
                //            =0 for P2  on the line
                //            <0 for P2  right of the line
                function isLeft(P0, P1, P2) {
                    return (
                        (P1[0] - P0[0]) * (P2[1] - P0[1]) -
                        (P2[0] - P0[0]) * (P1[1] - P0[1])
                    );
                }

                // winding number test for a point in a polygon
                // Return: true if winding number != 0, i.e., point is in polygon
                let containsPoint = function (P) {
                    // short circuit if not in bounding box
                    if (
                        !(
                            P[0] <= maxx &&
                            P[0] >= minx &&
                            P[1] <= maxy &&
                            P[1] >= miny
                        )
                    ) {
                        return false;
                    }

                    // winding number
                    let wn = 0;

                    // loop through all edges of the polygon
                    for (let i = 0; i < numVertices; i++) {
                        let iPlus1 = (i + 1) % numVertices;
                        // edge from vertices[i] to  vertices[i+1]
                        if (vertices[i][1] <= P[1]) {
                            // start y <= P[1]
                            if (vertices[iPlus1][1] > P[1]) {
                                // end y > P[1], so segment crossed from below to above P
                                if (
                                    isLeft(vertices[i], vertices[iPlus1], P) > 0
                                )
                                    // an upward crossing
                                    // P left of  edge
                                    wn++; // have a valid up intersect
                            }
                        } else {
                            // start y > P[1] (no test needed)
                            if (vertices[iPlus1][1] <= P[1]) {
                                // end y <= P[1], so segment crossed from above to below P
                                if (
                                    isLeft(vertices[i], vertices[iPlus1], P) < 0
                                )
                                    // a downward crossing
                                    // P right of edge
                                    wn--; // have a valid down intersect
                            }
                        }
                    }
                    return wn !== 0;
                };

                return { setValue: { containsPoint } };
            },
        };

        return stateVariableDefinitions;
    }
}
