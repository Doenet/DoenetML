import React, { useContext, useEffect, useRef } from "react";
import JXG from "jsxgraph";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import {
    BoardContext,
    BASE_LAYER_OFFSET,
    LINE_LAYER_OFFSET,
    POINT_LAYER_OFFSET,
    TEXT_LAYER_OFFSET,
} from "./graph";
import { deepCompare } from "@doenet/utils";
import {
    JXGElement,
    JXGLine,
    JXGPoint,
    JXGPolygon,
    JXGText,
} from "./jsxgraph-distrib/types";
import { styleToDash } from "./utils/styleToDash";
import { DocContext } from "../DocViewer";
import {
    resolveBackgroundColor,
    resolveCanvasColor,
    resolvePanelBorderColor,
} from "./utils/styleColors";
import { UnlabeledGraphicalSVs } from "./utils/graphicalSVs";

declare const MathJax: any;

interface LegendElement {
    label?: { hasLatex: boolean; value: string };
    swatchType: "marker" | "rectangle" | "line";
    markerColor?: string;
    markerStyle?: string;
    markerSize?: number;
    lineColor?: string;
    lineWidth?: number;
    lineStyle?: string;
    lineOpacity?: number;
    fillColor?: string;
    fillOpacity?: number;
    filled?: boolean;
}

interface GraphLimits {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
}

interface LegendSVs extends UnlabeledGraphicalSVs {
    graphLimits: GraphLimits;
    position: string;
    boxed: boolean;
    legendElements: LegendElement[];
}

type Swatch = JXGPoint | JXGPolygon | JXGLine | JXGElement;

type Corner = [number, number];

/** The four corners of the backing box, clockwise from the top left. */
type BoxCorners = [Corner, Corner, Corner, Corner];

export default React.memo(function Legend(props: UseDoenetRendererProps) {
    let { id, SVs } = useDoenetRenderer<LegendSVs>(props);

    const board = useContext(BoardContext);

    const { darkMode } = useContext(DocContext) || {};

    let swatches = useRef<Swatch[]>([]);
    let labels = useRef<JXGText[]>([]);
    let box = useRef<JXGPolygon | null>(null);

    let previousDependencies = useRef<Record<string, any> | null>(null);

    // The box paints the graph's own background unless the legend's style
    // definition names one, so all that distinguishes it from the graph behind
    // it is its border — which is what makes something passing behind the
    // legend disappear rather than tangle with it. That border is the neutral
    // panel color rather than the style definition's line color: the box is
    // chrome around the legend, not one more piece of graph content, and the
    // line color belongs to the swatches that stand for the graphed objects.
    const boxFillColor =
        resolveBackgroundColor(SVs.selectedStyle, darkMode) ||
        resolveCanvasColor(darkMode);
    const boxBorderColor = resolvePanelBorderColor(darkMode);

    // Each piece of the legend is offset from the DoenetML layer the same way
    // the rest of the graph's renderers offset theirs, so `<legend layer="3">`
    // sits above a `layer="2"` rectangle piece for piece. The box takes the
    // base offset so it stays behind the legend's own swatches and labels
    // while covering everything drawn below the legend's layer.
    const boxLayer = 10 * SVs.layer + BASE_LAYER_OFFSET;
    const lineSwatchLayer = 10 * SVs.layer + LINE_LAYER_OFFSET;
    const markerSwatchLayer = 10 * SVs.layer + POINT_LAYER_OFFSET;
    const labelLayer = 10 * SVs.layer + TEXT_LAYER_OFFSET;

    useEffect(() => {
        //On unmount
        return () => {
            deleteLegend();
        };
    }, []);

    function createLegend() {
        if (board === null) {
            return;
        }
        let { xMin, xMax, yMin, yMax } = SVs.graphLimits;

        let legendDy = (yMax - yMin) * 0.06;
        let legendLineLength = (xMax - xMin) * 0.05;
        let legendDx = (xMax - xMin) * 0.02;

        let legendX = xMin + (xMax - xMin) * 0.05;

        let legendY: number;

        if (SVs.position.slice(0, 5) === "upper") {
            legendY = yMin + (yMax - yMin) * 0.95;
        } else {
            legendY =
                yMin +
                (yMax - yMin) * 0.05 +
                legendDy * SVs.legendElements.length;
        }

        let atRight =
            SVs.position.slice(SVs.position.length - 5, SVs.position.length) ===
            "right";

        swatches.current = [];
        labels.current = [];

        let maxTextWidth = 0;

        let usedMathJax = false;

        for (let [ind, element] of SVs.legendElements.entries()) {
            if (element.label) {
                let y = legendY - ind * legendDy;

                let textAttrs: Record<string, any> = {
                    fixed: true,
                    highlight: false,
                    layer: labelLayer,
                };

                if (element.label.hasLatex) {
                    textAttrs.useMathJax = true;
                    textAttrs.parse = false;
                    usedMathJax = true;
                }

                let txt = board.create(
                    "text",
                    [
                        legendX + legendLineLength + legendDx,
                        y,
                        element.label.value,
                    ],
                    textAttrs,
                ) as JXGText;

                labels.current.push(txt);

                maxTextWidth = Math.max(maxTextWidth, txt.rendNode.offsetWidth);
            }
        }

        maxTextWidth /= board.unitX;

        if (atRight) {
            legendX = Math.max(
                legendX,
                xMax - legendLineLength - 3 * legendDx - maxTextWidth,
            );
        }

        /** Where the box goes for the geometry computed so far. */
        function currentBoxCorners(): BoxCorners {
            const padX = legendDx / 2;
            const padY = legendDy / 4;
            const left = legendX - padX;
            const right =
                legendX + legendLineLength + legendDx + maxTextWidth + padX;
            const top = legendY + legendDy / 2 + padY;
            const bottom =
                legendY -
                (SVs.legendElements.length - 1) * legendDy -
                legendDy / 2 -
                padY;
            return [
                [left, top],
                [right, top],
                [right, bottom],
                [left, bottom],
            ];
        }

        if (SVs.boxed && SVs.legendElements.length > 0) {
            box.current = board.create("polygon", currentBoxCorners(), {
                fillColor: boxFillColor,
                fillOpacity: 1,
                fixed: true,
                highlight: false,
                layer: boxLayer,
                vertices: { visible: false },
                borders: {
                    strokeColor: boxBorderColor,
                    strokeWidth: 1,
                    strokeOpacity: 1,
                    fixed: true,
                    highlight: false,
                    layer: boxLayer,
                },
            }) as JXGPolygon;
        }

        for (let [ind, element] of SVs.legendElements.entries()) {
            let y = legendY - ind * legendDy;
            if (element.swatchType === "marker") {
                let pointStyle: Record<string, any> = {
                    fillColor: element.markerColor,
                    fillOpacity: element.lineOpacity,
                    strokeColor: "none",
                    size: element.markerSize,
                    face: normalizeStyle(element.markerStyle),
                    fixed: true,
                    highlight: false,
                    withLabel: false,
                    showInfoBox: false,
                    layer: markerSwatchLayer,
                };
                let point = board.create(
                    "point",
                    [legendX + legendLineLength / 2, y],
                    pointStyle,
                ) as JXGPoint;
                swatches.current.push(point);
            } else if (element.swatchType === "rectangle") {
                let rectangleStyle: Record<string, any> = {
                    fillColor: element.filled ? element.fillColor : "none",
                    fillOpacity: element.fillOpacity,
                    fixed: true,
                    highlight: false,
                    layer: lineSwatchLayer,
                    vertices: { visible: false },
                    borders: {
                        strokeColor: element.lineColor,
                        strokeWidth: element.lineWidth,
                        strokeOpacity: element.lineOpacity,
                        dash: styleToDash(element.lineStyle),
                        fixed: true,
                        highlight: false,
                        layer: lineSwatchLayer,
                    },
                };

                let seg = board.create(
                    "polygon",
                    [
                        [legendX, y + legendDy / 4],
                        [legendX + legendLineLength, y + legendDy / 4],
                        [legendX + legendLineLength, y - legendDy / 4],
                        [legendX, y - legendDy / 4],
                    ],
                    rectangleStyle,
                ) as JXGPolygon;
                swatches.current.push(seg);
            } else {
                let lineStyle: Record<string, any> = {
                    strokeColor: element.lineColor,
                    strokeWidth: element.lineWidth,
                    strokeOpacity: element.lineOpacity,
                    dash: styleToDash(element.lineStyle),
                    fixed: true,
                    highlight: false,
                    layer: lineSwatchLayer,
                };
                let seg = board.create(
                    "segment",
                    [
                        [legendX, y],
                        [legendX + legendLineLength, y],
                    ],
                    lineStyle,
                ) as JXGLine;
                swatches.current.push(seg);
            }
            if (atRight && element.label) {
                labels.current[ind].coords.setCoordinates(JXG.COORDS_BY_USER, [
                    legendX + legendLineLength + legendDx,
                    y,
                ]);
            }
        }

        // A label's width is only known once MathJax has typeset it, and both
        // the right-aligned position and the width of the box are measured
        // from it, so both have to be recomputed after typesetting.
        if (usedMathJax && (atRight || box.current)) {
            MathJax.startup.promise
                .then(() => {
                    maxTextWidth = 0;
                    for (let txt of labels.current) {
                        maxTextWidth = Math.max(
                            maxTextWidth,
                            txt.rendNode.offsetWidth,
                        );
                    }

                    maxTextWidth /= board!.unitX;

                    if (atRight) {
                        legendX = Math.max(
                            legendX,
                            xMax -
                                legendLineLength -
                                3 * legendDx -
                                maxTextWidth,
                        );

                        for (let [ind, swatch] of swatches.current.entries()) {
                            let y = legendY - ind * legendDy;
                            if (swatch.elType === "point") {
                                (swatch as JXGPoint).coords.setCoordinates(
                                    JXG.COORDS_BY_USER,
                                    [legendX + legendLineLength / 2, y],
                                );
                                swatch.needsUpdate = true;
                                swatch.update();
                            } else if (swatch.elType === "polygon") {
                                movePolygon(swatch as JXGPolygon, [
                                    [legendX, y + legendDy / 4],
                                    [
                                        legendX + legendLineLength,
                                        y + legendDy / 4,
                                    ],
                                    [
                                        legendX + legendLineLength,
                                        y - legendDy / 4,
                                    ],
                                    [legendX, y - legendDy / 4],
                                ]);
                            } else {
                                const line = swatch as JXGLine;
                                line.point1.coords.setCoordinates(
                                    JXG.COORDS_BY_USER,
                                    [legendX, y],
                                );
                                line.point2.coords.setCoordinates(
                                    JXG.COORDS_BY_USER,
                                    [legendX + legendLineLength, y],
                                );
                                line.needsUpdate = true;
                                line.update();
                            }

                            if (labels.current[ind]) {
                                labels.current[ind].coords.setCoordinates(
                                    JXG.COORDS_BY_USER,
                                    [legendX + legendLineLength + legendDx, y],
                                );
                                labels.current[ind].needsUpdate = true;
                                labels.current[ind].update();
                            }
                        }
                    }

                    if (box.current) {
                        movePolygon(box.current, currentBoxCorners());
                    }

                    board!.updateRenderer();
                })
                .catch((e: unknown) => {
                    console.error(
                        "Failed to lay out legend after typesetting",
                        e,
                    );
                });
        }
    }

    function deleteLegend() {
        for (let swatch of swatches.current) {
            board?.removeObject(swatch);
        }
        for (let txt of labels.current) {
            board?.removeObject(txt);
        }
        if (box.current) {
            board?.removeObject(box.current);
            box.current = null;
        }
        swatches.current = [];
        labels.current = [];
    }

    if (board) {
        // Everything below is baked into the JSXGraph objects at creation, so
        // any change to it means tearing the legend down and drawing it again.
        const dependencies = {
            legendElements: [...SVs.legendElements],
            graphLimits: { ...SVs.graphLimits },
            position: SVs.position,
            layer: SVs.layer,
            boxed: SVs.boxed,
            boxFillColor,
            boxBorderColor,
        };

        if (!deepCompare(previousDependencies.current, dependencies)) {
            deleteLegend();
            createLegend();
        }

        previousDependencies.current = dependencies;

        return (
            <>
                <span id={id} />
            </>
        );
    }

    if (SVs.hidden) {
        return null;
    }

    // don't return anything if not in board
    return (
        <>
            <span id={id} />
        </>
    );
});

function normalizeStyle(style: string | undefined): string | undefined {
    if (style === "triangle") {
        return "triangleup";
    } else {
        return style;
    }
}

/**
 * Move a four-cornered polygon to new coordinates. JSXGraph draws a polygon's
 * fill and each of its borders from its vertices, so all three have to be told
 * they are stale for the move to reach the renderer.
 */
function movePolygon(polygon: JXGPolygon, corners: Corner[]) {
    for (let i = 0; i < corners.length; i++) {
        polygon.vertices[i].coords.setCoordinates(
            JXG.COORDS_BY_USER,
            corners[i],
        );
        polygon.vertices[i].needsUpdate = true;
        polygon.vertices[i].update();
        polygon.borders[i].needsUpdate = true;
        polygon.borders[i].update();
    }
    polygon.needsUpdate = true;
    polygon.update();
}
