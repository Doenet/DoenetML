/**
 * Shared renderer lifecycle for `<slopeField>` and `<vectorField>`.
 *
 * Both draw their entire lattice as ONE JSXGraph curve whose coordinate arrays
 * carry NaN pen-ups between marks, so the SVG node count stays constant no
 * matter how many marks there are.
 *
 * The curve is regenerated from the live bounding box on every pan/zoom, which
 * is why the field follows the viewport instead of being pinned to a fixed
 * range. All of that happens on the main thread from a rehydrated function, so
 * it never round-trips to the worker.
 */
import { useContext, useMemo, useRef } from "react";
import { createFunctionFromDefinition } from "@doenet/utils";
import { BoardContext, LINE_LAYER_OFFSET } from "../graph";
import { DocContext } from "../../DocViewer";
import { JXGBoard, JXGCurve } from "../jsxgraph-distrib/types";
import type {
    FieldBounds,
    FieldData,
    FieldGrid,
    FieldScale,
} from "./fieldGeometry";
import type { GraphicalSVs } from "./graphicalSVs";
import { styleToDash } from "./styleToDash";
import { useJSXGraphCleanup } from "./useJSXGraphCleanup";

/**
 * The state variables every field component sends its renderer: the graphical
 * basics, the rehydratable function from
 * `returnFieldFunctionStateVariableDefinitions`, and the lattice attributes
 * from `returnFieldLatticeAttributes`. `<vectorField>` extends this with
 * `normalize`.
 */
export interface FieldSVs extends GraphicalSVs {
    haveFunction: boolean;
    fDefinitions: any[];
    numInputs: number;
    dx: number;
    dy: number;
    xoffset: number;
    yoffset: number;
    markLength: number;
    maxMarks: number;
}

/** The lattice to sample on, in the shape the geometry functions take. */
export function fieldGrid(SVs: FieldSVs): FieldGrid {
    return {
        dx: SVs.dx,
        dy: SVs.dy,
        xoffset: SVs.xoffset,
        yoffset: SVs.yoffset,
    };
}

/**
 * Rehydrate one of the worker's function definitions into a numeric closure of
 * two inputs.
 *
 * Memoized on the definition because `createFunctionFromDefinition` recompiles
 * the formula every time it is called, and this component re-renders on any
 * state-variable change — a style tweak elsewhere in the document must not cost
 * a recompile.
 *
 * A one-input function built by `createFunctionFromDefinition` has signature
 * `(x, overrideDomain)`, so it must be called with exactly one argument;
 * passing `y` as the second would silently override the domain instead.
 */
export function useFieldFunction(
    fDefinition: any,
    numInputs: number,
): (x: number, y: number) => number {
    return useMemo(() => {
        const raw = createFunctionFromDefinition(fDefinition);
        return numInputs === 2
            ? (x: number, y: number) => raw(x, y)
            : (x: number, _y: number) => raw(x);
    }, [fDefinition, numInputs]);
}

export function useFieldCurve({
    SVs,
    buildData,
}: {
    /** The state variables that style the curve and say whether to draw it. */
    SVs: FieldSVs;
    /** Produce the coordinate arrays for the currently visible region. */
    buildData: (bounds: FieldBounds, scale: FieldScale) => FieldData;
}) {
    const board = useContext(BoardContext);
    const { darkMode } = useContext(DocContext) || {};
    const curveJXG = useRef<JXGCurve | null>(null);
    const boundListener = useRef<(() => void) | null>(null);

    const attributes: Record<string, any> = {
        visible: !SVs.hidden,
        // A field covers the whole viewport, so there is no point on it that
        // reads as "where the label goes"; like `pegboard`, it accepts a
        // `<label>` child (both inherit the group from `GraphicalComponent`)
        // but draws no label on the graph.
        withLabel: false,
        fixed: true,
        layer: 10 * SVs.layer + LINE_LAYER_OFFSET,
        strokeColor:
            darkMode === "dark"
                ? SVs.selectedStyle.lineColorDarkMode
                : SVs.selectedStyle.lineColor,
        strokeOpacity: SVs.selectedStyle.lineOpacity,
        strokeWidth: SVs.selectedStyle.lineWidth,
        dash: styleToDash(SVs.selectedStyle.lineStyle),
        highlight: false,
    };

    // The `boundingbox` listener is registered once, so it must reach the
    // current build function — and the current visibility — through refs rather
    // than closing over the ones from first render.
    const buildDataRef = useRef(buildData);
    buildDataRef.current = buildData;
    const hiddenRef = useRef(SVs.hidden);
    hiddenRef.current = SVs.hidden;

    function currentBounds(b: JXGBoard): FieldBounds {
        const [xMin, yMax, xMax, yMin] = b.getBoundingBox();
        return { xMin, xMax, yMin, yMax };
    }

    function currentScale(b: JXGBoard): FieldScale {
        return { unitX: b.unitX, unitY: b.unitY };
    }

    function refreshData() {
        const b = board;
        const curve = curveJXG.current;
        if (!b || !curve) {
            return;
        }
        if (hiddenRef.current) {
            // Sampling the whole lattice is the expensive part, and a hidden
            // field would otherwise pay it on every pan and zoom. The render
            // that unhides the curve calls this again, so nothing is lost.
            return;
        }
        const { dataX, dataY } = buildDataRef.current(
            currentBounds(b),
            currentScale(b),
        );
        curve.dataX = dataX;
        curve.dataY = dataY;
        curve.needsUpdate = true;
        curve.fullUpdate();
        b.updateRenderer();
    }

    function createCurve() {
        if (!board) {
            return;
        }
        const curve = board.create("curve", [[], []], attributes) as JXGCurve;
        curveJXG.current = curve;
        refreshData();

        const listener = () => refreshData();
        boundListener.current = listener;
        board.on("boundingbox", listener);
    }

    function deleteCurve() {
        if (board && boundListener.current) {
            board.off("boundingbox", boundListener.current);
            boundListener.current = null;
        }
        if (curveJXG.current !== null) {
            board?.removeObject(curveJXG.current);
            curveJXG.current = null;
        }
    }

    useJSXGraphCleanup({ objectRef: curveJXG, destroy: deleteCurve });

    if (board) {
        if (!SVs.haveFunction) {
            // No usable function: make sure nothing lingers from a previous
            // render that did have one.
            if (curveJXG.current !== null) {
                deleteCurve();
            }
        } else if (curveJXG.current === null) {
            createCurve();
        } else {
            curveJXG.current.setAttribute(attributes);
            refreshData();
        }
    }
}
