import React, { useContext, useRef } from "react";
import JXG from "jsxgraph";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { BoardContext, LINE_LAYER_OFFSET, VERTEX_LAYER_OFFSET } from "./graph";
import { createFunctionFromDefinition } from "@doenet/utils";
import { JXGCurve, JXGLine, JXGPoint } from "./jsxgraph-distrib/types";
import { GraphicalSVs } from "./utils/graphicalSVs";
import { styleToDash } from "./utils/styleToDash";
import {
    attachLabelHoverHighlight,
    computeLabelMaskCssStyle,
} from "./utils/labelMaskStyle";
import { syncLabelMaskCssStyle } from "./utils/jsxgraph";

interface CobwebPolylineSVs extends GraphicalSVs {
    numPoints: number;
    numericalVertices: [number, number][];
    fDefinition: any;
    variable: any;
    draggable: boolean;
    fixed: boolean;
}

export default React.memo(function CobwebPolyline(
    props: UseDoenetRendererProps,
) {
    let { componentIdx, id, SVs, actions, sourceOfUpdate, callAction } =
        useDoenetRenderer<CobwebPolylineSVs>(props);

    // @ts-ignore
    CobwebPolyline.ignoreActionsWithoutCore = () => true;

    const board = useContext(BoardContext);

    let curveJXG = useRef<JXGCurve | null>(null);
    let diagonalJXG = useRef<JXGLine | null>(null);
    let polylineJXG = useRef<JXGCurve | null>(null);
    let pointsJXG = useRef<JXGPoint[] | null>(null);

    let pointCoords = useRef<any>(null);
    let draggedPoint = useRef<number | null>(null);
    let previousNPoints = useRef<number | null>(null);
    let jsxPointAttributes = useRef<Record<string, any> | null>(null);

    let lastPositionsFromCore = useRef<[number, number][] | null>(null);
    lastPositionsFromCore.current = SVs.numericalVertices;

    React.useEffect(() => {
        return () => {
            if (polylineJXG.current) {
                deleteCobwebPolylineJXG();
            }
        };
    }, []);

    function createCobwebPolylineJXG() {
        if (board === null) {
            return null;
        }

        let functionAttributes = {
            visible: !SVs.hidden,
            withLabel: false,
            fixed: true,
            layer: 10 * SVs.layer + LINE_LAYER_OFFSET,
            strokeColor: "green",
            highlightStrokeColor: "green",
            strokeWidth: 3,
            dash: styleToDash("solid"),
        };

        let f = createFunctionFromDefinition(SVs.fDefinition);

        curveJXG.current = board.create(
            "functiongraph",
            [f],
            functionAttributes,
        );

        let diagonalAttributes = {
            visible: !SVs.hidden,
            withLabel: false,
            fixed: true,
            layer: 10 * SVs.layer + LINE_LAYER_OFFSET,
            strokeColor: "gray",
            highlightStrokeColor: "gray",
            strokeWidth: 2,
            dash: styleToDash("solid"),
        };
        diagonalJXG.current = board.create(
            "line",
            [
                [0, 0],
                [1, 1],
            ],
            diagonalAttributes,
        );

        let jsxPolylineAttributes: Record<string, any> = {
            name: SVs.labelForGraph,
            visible: !SVs.hidden,
            withLabel: SVs.labelForGraph !== "",
            fixed: true,
            layer: 10 * SVs.layer + LINE_LAYER_OFFSET,
            strokeColor: SVs.selectedStyle.lineColor,
            highlightStrokeColor: SVs.selectedStyle.lineColor,
            strokeWidth: SVs.selectedStyle.lineWidth,
            highlightStrokeWidth: SVs.selectedStyle.lineWidth,
            dash: styleToDash(SVs.selectedStyle.lineStyle),
        };

        jsxPolylineAttributes.label = {
            highlight: false,
            ...computeLabelMaskCssStyle({
                layer: SVs.layer,
                masked: SVs.maskLabel,
            }),
            highlightStrokeOpacity: 1,
        };
        if (SVs.labelHasLatex) {
            jsxPolylineAttributes.label.useMathJax = true;
        }

        jsxPointAttributes.current = {
            fixed: !SVs.draggable || SVs.fixed,
            visible: !SVs.hidden && SVs.draggable,
            withLabel: true,
            name: "A",
            layer: 10 * SVs.layer + VERTEX_LAYER_OFFSET,
            fillColor: SVs.selectedStyle.markerColor,
            strokeColor: SVs.selectedStyle.markerColor,
            size: SVs.selectedStyle.markerSize,
            face: normalizeStyle(SVs.selectedStyle.markerStyle),
            label: {
                highlight: false,
                ...computeLabelMaskCssStyle({
                    layer: SVs.layer,
                    masked: SVs.maskLabel,
                }),
                highlightStrokeOpacity: 1,
            },
        };

        if (SVs.draggable) {
            jsxPointAttributes.current.highlightFillColor = "#EEEEEE";
            jsxPointAttributes.current.highlightStrokeColor = "#C3D9FF";
            jsxPointAttributes.current.showInfoBox = true;
        } else {
            jsxPointAttributes.current.highlightFillColor =
                SVs.selectedStyle.markerColor;
            jsxPointAttributes.current.highlightStrokeColor =
                SVs.selectedStyle.markerColor;
            jsxPointAttributes.current.showInfoBox = false;
        }

        pointsJXG.current = [];
        let varName = SVs.variable.toString();

        for (let i = 0; i < SVs.numPoints; i++) {
            let pointAttributes = Object.assign({}, jsxPointAttributes.current);
            if (i === 0) {
                pointAttributes.name = `(${varName}_0,0)`;
            } else if (i % 2 === 1) {
                pointAttributes.name = `(${varName}_{${
                    (i - 1) / 2
                }}, ${varName}_{${(i + 1) / 2}})`;
            } else {
                pointAttributes.name = `(${varName}_{${i / 2}}, ${varName}_{${
                    i / 2
                }})`;
            }
            if (i !== SVs.numPoints - 1) {
                pointAttributes.visible = false;
            }
            pointsJXG.current.push(
                board.create(
                    "point",
                    [...SVs.numericalVertices[i]],
                    pointAttributes,
                ),
            );
        }

        let x: number[] = [];
        let y: number[] = [];
        SVs.numericalVertices.forEach((z) => {
            x.push(z[0]);
            y.push(z[1]);
        });

        let newPolylineJXG: JXGCurve = board.create(
            "curve",
            [x, y],
            jsxPolylineAttributes,
        );

        attachLabelHoverHighlight({
            hoverTargetJXG: newPolylineJXG,
            getLabelJXG: () => polylineJXG.current?.label,
            ...computeLabelMaskCssStyle({
                layer: SVs.layer,
                masked: SVs.maskLabel,
            }),
            board,
        });

        for (let i = 0; i < SVs.numPoints; i++) {
            pointsJXG.current[i].on("drag", (e) => dragHandler(i, e));
            pointsJXG.current[i].on("up", () => upHandler(i));
            pointsJXG.current[i].on("keyfocusout", () => keyFocusOutHandler(i));
            pointsJXG.current[i].on("keydown", (e) => keyDownHandler(i, e));
            pointsJXG.current[i].on("down", () => {
                draggedPoint.current = null;
            });
            attachLabelHoverHighlight({
                hoverTargetJXG: pointsJXG.current[i],
                getLabelJXG: () => pointsJXG.current?.[i]?.label,
                ...computeLabelMaskCssStyle({
                    layer: SVs.layer,
                    masked: SVs.maskLabel,
                }),
                board,
            });
        }

        previousNPoints.current = SVs.numPoints;

        return newPolylineJXG;
    }

    function deleteCobwebPolylineJXG() {
        if (polylineJXG.current) {
            board?.removeObject(polylineJXG.current);
            polylineJXG.current = null;
        }
        if (curveJXG.current) {
            board?.removeObject(curveJXG.current);
            curveJXG.current = null;
        }
        if (diagonalJXG.current) {
            board?.removeObject(diagonalJXG.current);
            diagonalJXG.current = null;
        }

        if (pointsJXG.current) {
            for (let i = 0; i < SVs.numPoints; i++) {
                if (pointsJXG.current[i]) {
                    pointsJXG.current[i].off("drag");
                    pointsJXG.current[i].off("up");
                    pointsJXG.current[i].off("keyfocusout");
                    pointsJXG.current[i].off("keydown");
                    pointsJXG.current[i].off("down");
                    board?.removeObject(pointsJXG.current[i]);
                    delete pointsJXG.current[i];
                }
            }
        }
    }

    function dragHandler(i: number, e: { x: number; y: number; type: string }) {
        if (!pointsJXG.current || !board) {
            return;
        }

        draggedPoint.current = i;

        pointCoords.current = {};
        pointCoords.current[i] = [
            pointsJXG.current[i].X(),
            pointsJXG.current[i].Y(),
        ];
        callAction({
            action: actions.movePolyline,
            args: {
                pointCoords: pointCoords.current,
                transient: true,
                skippable: true,
                sourceDetails: { vertex: i },
            },
        });

        pointsJXG.current[i].coords.setCoordinates(JXG.COORDS_BY_USER, [
            ...lastPositionsFromCore.current![i],
        ]);
        board.updateInfobox(pointsJXG.current[i]);
    }

    function upHandler(i: number) {
        if (draggedPoint.current !== i) {
            return;
        }

        callAction({
            action: actions.movePolyline,
            args: {
                pointCoords: pointCoords.current,
                sourceDetails: { vertex: i },
            },
        });
    }

    function keyFocusOutHandler(i: number) {
        if (draggedPoint.current !== i) {
            draggedPoint.current = null;
            return;
        }
        draggedPoint.current = null;

        callAction({
            action: actions.movePolyline,
            args: {
                pointCoords: pointCoords.current,
                sourceInformation: { vertex: i },
            },
        });
    }

    function keyDownHandler(i: number, e: { key: string }) {
        if (e.key === "Enter") {
            if (draggedPoint.current === i) {
                callAction({
                    action: actions.movePolyline,
                    args: {
                        pointCoords: pointCoords.current,
                        sourceInformation: { vertex: i },
                    },
                });
            }
            draggedPoint.current = null;
        }
    }

    if (board) {
        if (!polylineJXG.current) {
            polylineJXG.current = createCobwebPolylineJXG();
        } else if (pointsJXG.current && curveJXG.current) {
            let f = createFunctionFromDefinition(SVs.fDefinition);

            (curveJXG.current as any).Y = f;
            curveJXG.current.needsUpdate = true;
            (curveJXG.current as any).updateCurve();

            let varName = SVs.variable.toString();

            // add or delete points as required and change data array size
            if (
                previousNPoints.current !== null &&
                SVs.numPoints > previousNPoints.current
            ) {
                for (let i = previousNPoints.current; i < SVs.numPoints; i++) {
                    let pointAttributes = Object.assign(
                        {},
                        jsxPointAttributes.current,
                    );
                    if (i === 0) {
                        pointAttributes.name = `(${varName}_0,0)`;
                    } else if (i % 2 === 1) {
                        pointAttributes.name = `(${varName}_{${
                            (i - 1) / 2
                        }}, ${varName}_{${(i + 1) / 2}})`;
                    } else {
                        pointAttributes.name = `(${varName}_{${
                            i / 2
                        }}, ${varName}_{${i / 2}})`;
                    }
                    if (i !== SVs.numPoints - 1) {
                        pointAttributes.visible = false;
                    }
                    pointsJXG.current.push(
                        board.create(
                            "point",
                            [...SVs.numericalVertices[i]],
                            pointAttributes,
                        ),
                    );

                    pointsJXG.current[i].on("drag", (e) => dragHandler(i, e));
                    pointsJXG.current[i].on("up", () => upHandler(i));
                    pointsJXG.current[i].on("keyfocusout", () =>
                        keyFocusOutHandler(i),
                    );
                    pointsJXG.current[i].on("keydown", (e) =>
                        keyDownHandler(i, e),
                    );
                    pointsJXG.current[i].on("down", () => {
                        draggedPoint.current = null;
                    });
                }
            } else if (
                previousNPoints.current !== null &&
                SVs.numPoints < previousNPoints.current
            ) {
                for (let i = SVs.numPoints; i < previousNPoints.current; i++) {
                    let pt = pointsJXG.current.pop();
                    if (pt) {
                        pt.off("drag");
                        pt.off("up");
                        pt.off("keyfocusout");
                        pt.off("keydown");
                        pt.off("down");
                        board?.removeObject(pt);
                        board.update();
                    }
                }
                polylineJXG.current.dataX.length = SVs.numPoints;
            }

            previousNPoints.current = SVs.numPoints;

            let shiftX = polylineJXG.current.transformMat![1][0];
            let shiftY = polylineJXG.current.transformMat![2][0];

            for (let i = 0; i < SVs.numPoints; i++) {
                pointsJXG.current[i].coords.setCoordinates(JXG.COORDS_BY_USER, [
                    ...SVs.numericalVertices[i],
                ]);
                polylineJXG.current.dataX[i] =
                    SVs.numericalVertices[i][0] - shiftX;
                polylineJXG.current.dataY[i] =
                    SVs.numericalVertices[i][1] - shiftY;
            }

            let visible = !SVs.hidden;

            polylineJXG.current.visProp["visible"] = visible;
            polylineJXG.current.visPropCalc["visible"] = visible;

            for (let i = 0; i < SVs.numPoints - 1; i++) {
                pointsJXG.current[i].visProp["visible"] = false;
                pointsJXG.current[i].visPropCalc["visible"] = false;
            }
            if (SVs.numPoints > 0) {
                if (SVs.draggable) {
                    pointsJXG.current[SVs.numPoints - 1].visProp["visible"] =
                        visible;
                    pointsJXG.current[SVs.numPoints - 1].visPropCalc[
                        "visible"
                    ] = visible;
                }
            }

            if (
                sourceOfUpdate.sourceInformation &&
                componentIdx in sourceOfUpdate.sourceInformation
            ) {
                let sourceInfo = sourceOfUpdate.sourceInformation[componentIdx];
                let vertexUpdated =
                    typeof sourceInfo === "object" && sourceInfo
                        ? (sourceInfo as any).vertex
                        : undefined;

                if (Number.isFinite(vertexUpdated)) {
                    board.updateInfobox(pointsJXG.current[vertexUpdated]);
                }
            }

            polylineJXG.current.needsUpdate = true;
            polylineJXG.current.update();
            polylineJXG.current.updateVisibility?.();
            for (let i = 0; i < SVs.numPoints; i++) {
                pointsJXG.current[i].needsUpdate = true;
                pointsJXG.current[i].update();
            }
            if (polylineJXG.current.hasLabel && polylineJXG.current.label) {
                syncLabelMaskCssStyle(polylineJXG.current.label, SVs.layer, {
                    maskLabel: SVs.maskLabel,
                });
            }

            if (SVs.numPoints > 0) {
                const lastPoint = pointsJXG.current[SVs.numPoints - 1];
                lastPoint.setAttribute({
                    withlabel: true,
                });
                if (lastPoint.label) {
                    syncLabelMaskCssStyle(lastPoint.label, SVs.layer, {
                        maskLabel: SVs.maskLabel,
                    });
                    lastPoint.label.needsUpdate = true;
                    lastPoint.label.update();
                }
            }

            board.updateRenderer();
        }
    }

    if (SVs.hidden) {
        return null;
    }

    // don't think we want to return anything if not in board
    return (
        <>
            <span id={id} />
        </>
    );
});

function normalizeStyle(style: string) {
    if (style === "triangle") {
        return "triangleup";
    }
    return style;
}
