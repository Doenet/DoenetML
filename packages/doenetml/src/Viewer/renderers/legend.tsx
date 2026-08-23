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
    JXGBoard,
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

interface LegendLabel {
    hasLatex: boolean;
    value: string;
}

interface LegendElement {
    label?: LegendLabel;
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

type SwatchType = LegendElement["swatchType"];

type Swatch = JXGPoint | JXGPolygon | JXGLine;

type Corner = [number, number];

/**
 * The corners of one of the legend's rectangles — its backing box, or a
 * rectangle swatch — clockwise from the top left.
 */
type Corners = [Corner, Corner, Corner, Corner];

/**
 * Where every legend object is created. Which coordinates a swatch or a label
 * takes depends on how wide the labels turn out to be, so no object is created
 * at its own coordinates: {@link Legend}'s `positionLegend` moves them all once
 * the labels have been measured, before the browser paints either placement.
 */
const ORIGIN: Corner = [0, 0];

/**
 * The JSXGraph objects drawing one legend element, held from one layout to the
 * next so that the next layout can update them instead of building them again.
 */
interface LegendEntry {
    swatch: Swatch;
    /** The kind of swatch `swatch` was built as. */
    swatchType: SwatchType;
    /** Null when the element has no label. */
    label: JXGText | null;
    /**
     * What `label` was last given. Kept here because JSXGraph rewrites the
     * text it is handed (`plaintext` is the processed form), so the object
     * cannot be asked whether its text is still current — and re-setting the
     * text of a MathJax label costs a typesetting pass, the very flash this
     * renderer is avoiding.
     */
    labelContent: LegendLabel | null;
}

/**
 * The placement of the legend that does not depend on how wide its labels
 * turn out to be. Everything here follows from the graph's limits and the
 * legend's position, so it can be computed before a single label is measured.
 */
interface Geometry {
    /** The graph's right edge, which a right-aligned legend is measured from. */
    xMax: number;
    /** Vertical distance between one legend row and the next. */
    legendDy: number;
    /** Length of a line or rectangle swatch. */
    legendLineLength: number;
    /** Horizontal gap between a swatch and its label. */
    legendDx: number;
    /** Left edge of the swatches before any right-alignment is applied. */
    baseLegendX: number;
    /** Vertical center of the first row. */
    legendY: number;
    /** Whether the legend is pushed against the graph's right edge. */
    atRight: boolean;
}

export default React.memo(function Legend(props: UseDoenetRendererProps) {
    let { id, SVs } = useDoenetRenderer<LegendSVs>(props);

    const board = useContext(BoardContext);

    const { darkMode } = useContext(DocContext) || {};

    // One entry per legend element, in the same order, so an entry and the
    // element it draws always share an index.
    const entries = useRef<LegendEntry[]>([]);
    const box = useRef<JXGPolygon | null>(null);

    const previousDependencies = useRef<Record<string, any> | null>(null);

    // Stamps each layout of the legend, so the pass that runs once MathJax
    // has started can tell whether the legend it was scheduled for is still
    // the one on the board. It closes over the geometry of its own layout but
    // reaches the objects through the refs above, which by then may hold a
    // legend laid out from different graph limits — or nothing at all, the
    // legend having been hidden or unmounted.
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

    /** The current {@link Geometry}, read off the graph limits and position. */
    function baseGeometry(): Geometry {
        const { xMin, xMax, yMin, yMax } = SVs.graphLimits;

        const legendDy = (yMax - yMin) * 0.06;
        const legendLineLength = (xMax - xMin) * 0.05;
        const legendDx = (xMax - xMin) * 0.02;
        const baseLegendX = xMin + (xMax - xMin) * 0.05;

        const legendY =
            SVs.position.slice(0, 5) === "upper"
                ? yMin + (yMax - yMin) * 0.95
                : yMin +
                  (yMax - yMin) * 0.05 +
                  legendDy * SVs.legendElements.length;

        return {
            xMax,
            legendDy,
            legendLineLength,
            legendDx,
            baseLegendX,
            legendY,
            atRight: SVs.position.slice(-5) === "right",
        };
    }

    /**
     * Bring the legend's objects in line with the current legend elements,
     * reusing every object that still suits the element it draws. Coordinates
     * are left to {@link positionLegend}, which needs the label widths this
     * does not have. Returns whether any label is typeset by MathJax, and so
     * will only reach its final width some time after this returns.
     */
    function syncEntries(): boolean {
        if (board === null) {
            return false;
        }

        let usedMathJax = false;

        for (const [ind, element] of SVs.legendElements.entries()) {
            const previous = entries.current[ind] ?? null;
            const entry = {
                swatch: syncSwatch(board, previous, element),
                swatchType: element.swatchType,
                ...syncLabel(board, previous, element),
            };
            usedMathJax ||= entry.labelContent?.hasLatex ?? false;
            entries.current[ind] = entry;
        }

        removeEntries(SVs.legendElements.length);

        return usedMathJax;
    }

    /**
     * The JSXGraph object drawing `element`'s swatch: the one `previous` holds
     * if it is of the right kind, restyled, and a newly created one otherwise.
     * A new swatch is placed at the origin, and given its coordinates by
     * {@link positionLegend} before anything is painted.
     */
    function syncSwatch(
        board: JXGBoard,
        previous: LegendEntry | null,
        element: LegendElement,
    ): Swatch {
        if (previous) {
            if (previous.swatchType === element.swatchType) {
                applySwatchStyle(previous.swatch, element);
                return previous.swatch;
            }
            board.removeObject(previous.swatch);
        }

        if (element.swatchType === "marker") {
            return board.create("point", ORIGIN, {
                ...markerAttributes(element),
                strokeColor: "none",
                fixed: true,
                highlight: false,
                withLabel: false,
                showInfoBox: false,
                layer: markerSwatchLayer,
            }) as JXGPoint;
        }

        if (element.swatchType === "rectangle") {
            return board.create("polygon", [ORIGIN, ORIGIN, ORIGIN, ORIGIN], {
                ...fillAttributes(element),
                fixed: true,
                highlight: false,
                layer: lineSwatchLayer,
                vertices: { visible: false },
                borders: {
                    ...strokeAttributes(element),
                    fixed: true,
                    highlight: false,
                    layer: lineSwatchLayer,
                },
            }) as JXGPolygon;
        }

        // The endpoints are distinct because a segment between coincident
        // points has no direction to be drawn along.
        return board.create("segment", [ORIGIN, [1, 0]], {
            ...strokeAttributes(element),
            fixed: true,
            highlight: false,
            layer: lineSwatchLayer,
        }) as JXGLine;
    }

    /**
     * The JSXGraph text drawing `element`'s label, if it has one: the one
     * `previous` holds if it can still show this label — given the new text if
     * that changed — and a newly created one otherwise. A new text is placed
     * at the origin, and given its coordinates by {@link positionLegend}
     * before anything is painted.
     */
    function syncLabel(
        board: JXGBoard,
        previous: LegendEntry | null,
        element: LegendElement,
    ): Pick<LegendEntry, "label" | "labelContent"> {
        const label = element.label;
        const hasLatex = label?.hasLatex ?? false;
        const shown = previous?.labelContent ?? null;
        let txt = previous?.label ?? null;

        // Whether a label is typeset by MathJax is fixed when its JSXGraph
        // text is created, so a label that gains or loses latex needs a new
        // one; a label whose text alone changed does not.
        if (txt && (!label || shown?.hasLatex !== hasLatex)) {
            board.removeObject(txt);
            txt = null;
        }

        if (!label) {
            return { label: null, labelContent: null };
        }

        if (txt) {
            if (shown?.value !== label.value) {
                txt.setText(label.value);
            }
            // The text color can change under a reused label — the theme is
            // toggled, or the legend's style number changes — and unlike the
            // layer below it is safe to re-set: it becomes a CSS color on the
            // node rather than moving the node anywhere.
            txt.setAttribute({
                strokeColor: labelTextColor,
                highlightStrokeColor: labelTextColor,
            });
            // The layer is deliberately not re-set here. JSXGraph renders
            // these labels as HTML overlaid on the board, and setting a layer
            // on an existing element moves its node into that SVG layer's
            // group — where an HTML div renders nothing at all. Nothing is
            // lost: the overlay sits above every SVG layer whatever layer the
            // label claims.
        } else {
            const textAttrs: Record<string, any> = {
                fixed: true,
                highlight: false,
                layer: labelLayer,
                strokeColor: labelTextColor,
                highlightStrokeColor: labelTextColor,
                // A label is an absolutely positioned div inside the board, so
                // left to itself it is only as wide as the room left between
                // where it sits and the board's right edge, and wraps to fit.
                // Its width is what the legend is laid out from, and it is
                // measured wherever the label happens to be standing at the
                // time, so a label that may wrap measures differently
                // depending on where it is measured. Kept on one line, its
                // width is its own.
                cssStyle: "white-space: nowrap",
            };

            if (hasLatex) {
                textAttrs.useMathJax = true;
                textAttrs.parse = false;
            }

            txt = board.create(
                "text",
                [...ORIGIN, label.value],
                textAttrs,
            ) as JXGText;
        }

        return { label: txt, labelContent: { value: label.value, hasLatex } };
    }

    /**
     * Give a swatch that is being kept the colors, widths and layer its
     * element now calls for. Only ever handed a swatch of `element`'s own
     * kind, so which attributes it takes is settled by `element.swatchType`.
     */
    function applySwatchStyle(swatch: Swatch, element: LegendElement) {
        if (element.swatchType === "marker") {
            swatch.setAttribute({
                ...markerAttributes(element),
                layer: markerSwatchLayer,
            });
        } else if (element.swatchType === "rectangle") {
            swatch.setAttribute({
                ...fillAttributes(element),
                layer: lineSwatchLayer,
            });
            for (const border of (swatch as JXGPolygon).borders) {
                border.setAttribute({
                    ...strokeAttributes(element),
                    layer: lineSwatchLayer,
                });
            }
        } else {
            swatch.setAttribute({
                ...strokeAttributes(element),
                layer: lineSwatchLayer,
            });
        }
    }

    /** Create, remove or restyle the backing box to match `boxed`. */
    function syncBox() {
        if (board === null) {
            return;
        }

        const wanted = SVs.boxed && SVs.legendElements.length > 0;

        if (!wanted) {
            if (box.current) {
                board.removeObject(box.current);
                box.current = null;
            }
            return;
        }

        const boxAttributes = {
            fillColor: boxFillColor,
            fillOpacity: 1,
            layer: boxLayer,
        };
        const borderAttributes = {
            strokeColor: boxBorderColor,
            strokeWidth: 1,
            strokeOpacity: 1,
            layer: boxLayer,
        };

        if (box.current) {
            box.current.setAttribute(boxAttributes);
            for (const border of box.current.borders) {
                border.setAttribute(borderAttributes);
            }
            return;
        }

        box.current = board.create(
            "polygon",
            [ORIGIN, ORIGIN, ORIGIN, ORIGIN],
            {
                ...boxAttributes,
                fixed: true,
                highlight: false,
                vertices: { visible: false },
                borders: {
                    ...borderAttributes,
                    fixed: true,
                    highlight: false,
                },
            },
        ) as JXGPolygon;
    }

    /**
     * Measure the labels and move every piece of the legend to where that
     * measurement puts it. Run once the objects exist and again once MathJax
     * has typeset any label it is responsible for.
     */
    function positionLegend(geometry: Geometry) {
        if (board === null) {
            return;
        }

        const {
            xMax,
            legendDx,
            legendDy,
            legendLineLength,
            legendY,
            baseLegendX,
            atRight,
        } = geometry;

        let maxTextWidth = 0;
        for (const { label } of entries.current) {
            if (label) {
                maxTextWidth = Math.max(
                    maxTextWidth,
                    label.rendNode.offsetWidth,
                );
            }
        }
        maxTextWidth /= board.unitX;

        const legendX = atRight
            ? Math.max(
                  baseLegendX,
                  xMax - legendLineLength - 3 * legendDx - maxTextWidth,
              )
            : baseLegendX;

        if (box.current) {
            movePolygon(
                box.current,
                boxCorners(
                    geometry,
                    legendX,
                    maxTextWidth,
                    entries.current.length,
                ),
            );
        }

        for (const [ind, entry] of entries.current.entries()) {
            const y = legendY - ind * legendDy;

            if (entry.swatchType === "marker") {
                movePoint(entry.swatch as JXGPoint, [
                    legendX + legendLineLength / 2,
                    y,
                ]);
            } else if (entry.swatchType === "rectangle") {
                movePolygon(
                    entry.swatch as JXGPolygon,
                    rectangleSwatchCorners(geometry, legendX, y),
                );
            } else {
                const line = entry.swatch as JXGLine;
                movePoint(line.point1, [legendX, y]);
                movePoint(line.point2, [legendX + legendLineLength, y]);
                line.needsUpdate = true;
                line.update();
            }

            if (entry.label) {
                movePoint(entry.label, [
                    legendX + legendLineLength + legendDx,
                    y,
                ]);
            }
        }
    }

    /**
     * Bring the whole legend up to date: the objects it is drawn from, their
     * styles, and where they sit. The one place a change to the legend is
     * acted on.
     */
    function layoutLegend() {
        if (board === null) {
            return;
        }

        const generation = ++layoutGeneration.current;
        const geometry = baseGeometry();

        const usedMathJax = syncEntries();
        syncBox();

        // A label is measured from the node the renderer drew it into, so
        // every label — one just created, and one reused that has just been
        // given new text — has to be rendered before it can be measured.
        board.updateRenderer();

        positionLegend(geometry);
        board.updateRenderer();

        // The right-aligned position and the width of the box are both
        // measured from the labels, so both are wrong if a latex label has
        // not been typeset by the time it is measured just above.
        //
        // Usually it has been: JSXGraph typesets with the synchronous
        // `MathJax.typeset`, inside the `updateRenderer` above rather than
        // after it, for a label it has just created and for one it has just
        // been given new text for alike. What this covers is the board being
        // drawn before MathJax has finished loading, when that call throws
        // and JSXGraph's own try/catch swallows it, leaving the label showing
        // raw latex. Waiting for the engine and then for its startup is what
        // suits that case; waiting on a per-label typesetting instead would
        // not, since the call that would have reported it is the one that
        // failed.
        //
        // `loadMathJax()` rather than `window.MathJax` directly, because that
        // global holds a plain config object until the engine's script has
        // run (see `isMathJaxEngine`) — reaching for `startup.promise` on it
        // would throw, and throw synchronously, out of a render, in precisely
        // the cold load this pass is here for.
        if (usedMathJax) {
            layOutAfterTypesetting()
                .then(() => {
                    if (layoutGeneration.current !== generation) {
                        return;
                    }
                    positionLegend(geometry);
                    board.updateRenderer();
                })
                .catch((e: unknown) => {
                    console.error(
                        "Failed to lay out the legend after typesetting",
                        e,
                    );
                });
        }
    }

    /**
     * Remove the JSXGraph objects of the entries held past `length`, and drop
     * those entries.
     */
    function removeEntries(length: number) {
        for (const entry of entries.current.slice(length)) {
            board?.removeObject(entry.swatch);
            if (entry.label) {
                board?.removeObject(entry.label);
            }
        }
        entries.current.length = length;
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

        removeEntries(0);
        if (box.current) {
            board?.removeObject(box.current);
            box.current = null;
        }
    }

    if (board) {
        // Whether the legend is drawn at all, and everything it is drawn
        // from. Laying it out again when none of this changed would re-render
        // the whole board for nothing.
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
            // drawn — box included — and it is drawn afresh when unhidden.
            if (SVs.hidden) {
                deleteLegend();
            } else {
                layoutLegend();
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

function markerAttributes(element: LegendElement): Record<string, any> {
    return {
        fillColor: element.markerColor,
        fillOpacity: element.lineOpacity,
        size: element.markerSize,
        face: normalizeStyle(element.markerStyle),
    };
}

function strokeAttributes(element: LegendElement): Record<string, any> {
    return {
        strokeColor: element.lineColor,
        strokeWidth: element.lineWidth,
        strokeOpacity: element.lineOpacity,
        dash: styleToDash(element.lineStyle),
    };
}

function fillAttributes(element: LegendElement): Record<string, any> {
    return {
        fillColor: element.filled ? element.fillColor : "none",
        fillOpacity: element.fillOpacity,
    };
}

/** Where a rectangle swatch goes on the row centered on `y`. */
function rectangleSwatchCorners(
    geometry: Geometry,
    legendX: number,
    y: number,
): Corners {
    const { legendDy, legendLineLength } = geometry;
    return [
        [legendX, y + legendDy / 4],
        [legendX + legendLineLength, y + legendDy / 4],
        [legendX + legendLineLength, y - legendDy / 4],
        [legendX, y - legendDy / 4],
    ];
}

/**
 * Where the backing box goes around `rowCount` rows of swatches whose labels
 * are at most `maxTextWidth` wide, with a margin of its own around them.
 */
function boxCorners(
    geometry: Geometry,
    legendX: number,
    maxTextWidth: number,
    rowCount: number,
): Corners {
    const { legendDx, legendDy, legendLineLength, legendY } = geometry;
    const padX = legendDx / 2;
    const padY = legendDy / 4;
    const left = legendX - padX;
    const right = legendX + legendLineLength + legendDx + maxTextWidth + padX;
    const top = legendY + legendDy / 2 + padY;
    const bottom = legendY - (rowCount - 1) * legendDy - legendDy / 2 - padY;
    return [
        [left, top],
        [right, top],
        [right, bottom],
        [left, bottom],
    ];
}

function normalizeStyle(style: string | undefined): string | undefined {
    if (style === "triangle") {
        return "triangleup";
    } else {
        return style;
    }
}

/**
 * Move anything that carries its own coordinates — a point, a polygon vertex,
 * a line endpoint, a text — and tell it that it is stale so the move reaches
 * the renderer.
 */
function movePoint(
    object: { coords: any; needsUpdate: boolean; update: () => void },
    coords: Corner,
) {
    object.coords.setCoordinates(JXG.COORDS_BY_USER, coords);
    object.needsUpdate = true;
    object.update();
}

/**
 * Move a polygon to new corners. JSXGraph draws a polygon's fill and each of
 * its borders from its vertices, so all three have to be told they are stale.
 */
function movePolygon(polygon: JXGPolygon, corners: Corners) {
    for (let i = 0; i < corners.length; i++) {
        movePoint(polygon.vertices[i], corners[i]);
        polygon.borders[i].needsUpdate = true;
        polygon.borders[i].update();
    }
    polygon.needsUpdate = true;
    polygon.update();
}
