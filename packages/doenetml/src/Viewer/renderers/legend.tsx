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
import { deepCompare, loadMathJax } from "@doenet/utils";
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
    resolveTextColor,
} from "./utils/styleColors";
import { UnlabeledGraphicalSVs } from "./utils/graphicalSVs";

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

    // Stamps each drawing of the legend, so the layout pass that runs once
    // MathJax has started can tell whether the legend it was scheduled for is
    // still the one on the board. It closes over the geometry of its own
    // drawing but reaches the objects through the refs above, which by then
    // may hold a legend drawn from different graph limits — or nothing at
    // all, the legend having been hidden or unmounted.
    const layoutGeneration = useRef(0);

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

    // JSXGraph paints a text with a fixed color of its own — black, unless
    // told otherwise — rather than letting it inherit one from the page, so a
    // legend label has to be given the theme's text color or it stays black
    // against a dark canvas and a dark box alike. Taking it from the legend's
    // own style definition also means an author who paints the box a color of
    // their own can name the text color that reads against it.
    const labelTextColor = resolveTextColor(SVs.selectedStyle, darkMode);

    // Each piece of the legend is offset from the DoenetML layer the same way
    // the rest of the graph's renderers offset theirs, so `<legend layer="3">`
    // sits above a `layer="2"` rectangle piece for piece. The box takes the
    // base offset so it stays behind the legend's own swatches and labels
    // while covering everything drawn below the legend's layer.
    //
    // The label's layer buys less than the others'. JSXGraph renders these
    // labels as HTML overlaid on the board and turns the layer into the
    // node's `z-index`, which orders a label against the board's other HTML
    // but not against its SVG: the overlay is positioned and the board's
    // `<svg>` is not, so a label paints above the graph's contents at any
    // layer an author would ask for. It is passed for the ordering it does
    // buy, and because a label rendered as SVG would honor it in full.
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

        const generation = ++layoutGeneration.current;

        let { xMin, xMax, yMin, yMax } = SVs.graphLimits;

        let legendDy = (yMax - yMin) * 0.06;
        let legendLineLength = (xMax - xMin) * 0.05;
        let legendDx = (xMax - xMin) * 0.02;

        // Where the legend sits before any right-alignment. Both this pass
        // and the one after typesetting bound the alignment below by it, so
        // that the second computes the same function of the measured width as
        // the first rather than only ever ratcheting the legend rightwards.
        const baseLegendX = xMin + (xMax - xMin) * 0.05;

        let legendX = baseLegendX;

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
                    strokeColor: labelTextColor,
                    highlightStrokeColor: labelTextColor,
                    // A label is an absolutely positioned div inside the
                    // board, so left to itself it is only as wide as the room
                    // beside it and wraps to fit. The legend gives each entry
                    // one row, and the box is drawn around those rows, so a
                    // label that wraps is taller than the row it was given: it
                    // overlaps the entry below and overflows the box. Kept on
                    // one line it runs past the graph's edge instead, which is
                    // the lesser of the two (see #1750).
                    cssStyle: "white-space: nowrap",
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
                baseLegendX,
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

        // The right-aligned position and the width of the box are both
        // measured from the labels, so both are wrong if a latex label has
        // not been typeset by the time it is measured above.
        //
        // Usually it has been: JSXGraph typesets with the synchronous
        // `MathJax.typeset`, inside the `board.create` calls above rather
        // than after them. What this covers is the board being drawn before
        // MathJax has finished loading, when that call throws and JSXGraph's
        // own try/catch swallows it, leaving the label showing raw latex.
        // Waiting for the engine and then for its startup is what suits that
        // case; waiting on a per-label typesetting instead would not, since
        // the call that would have reported it is the one that failed.
        //
        // `loadMathJax()` rather than `window.MathJax` directly, because
        // that global holds a plain config object until the engine's script
        // has run (see `isMathJaxEngine`) — reaching for `startup.promise`
        // on it would throw, and throw synchronously, out of a render, in
        // precisely the cold load this pass is here for.
        if (usedMathJax && (atRight || box.current)) {
            layOutAfterTypesetting()
                .then(() => {
                    if (layoutGeneration.current !== generation) {
                        return;
                    }

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
                            baseLegendX,
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

    /**
     * Resolves once MathJax has loaded and finished its initial typesetting.
     * `startup` is optional on the engine type, and awaiting `undefined` is
     * harmless: an engine without one has no initial typesetting to wait for.
     */
    async function layOutAfterTypesetting() {
        const mathJax = await loadMathJax();
        await mathJax.startup?.promise;
    }

    function deleteLegend() {
        // Retires any layout pass still pending for the legend being removed,
        // which matters most when its replacement has no latex of its own and
        // so schedules no pass to correct what a stale one did.
        layoutGeneration.current++;

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
        // Whether the legend is drawn at all, and everything that is baked
        // into its JSXGraph objects at creation. Any change here means tearing
        // the legend down and, unless it is now hidden, drawing it again.
        const dependencies = {
            hidden: SVs.hidden,
            legendElements: [...SVs.legendElements],
            graphLimits: { ...SVs.graphLimits },
            position: SVs.position,
            layer: SVs.layer,
            boxed: SVs.boxed,
            boxFillColor,
            boxBorderColor,
            labelTextColor,
        };

        if (!deepCompare(previousDependencies.current, dependencies)) {
            // A hidden legend puts nothing on the board, so none of it is
            // drawn — box included — and it reappears intact when unhidden.
            deleteLegend();
            if (!SVs.hidden) {
                createLegend();
            }
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
