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
import type { FieldBounds, FieldData, FieldScale } from "./fieldGeometry";
import type { GraphicalSVs } from "./graphicalSVs";
import { styleToDash } from "./styleToDash";
import { useJSXGraphCleanup } from "./useJSXGraphCleanup";

/**
 * Rehydrate one of the worker's function definitions into a numeric closure of
 * two inputs.
 *
 * Memoized because the field is rebuilt on every `boundingbox` event, and
 * `createFunctionFromDefinition` recompiles the formula each time it is called.
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
    enabled,
}: {
    /** The graphical state variables that style and place the curve. */
    SVs: GraphicalSVs;
    /** Produce the coordinate arrays for the currently visible region. */
    buildData: (bounds: FieldBounds, scale: FieldScale) => FieldData;
    /** False when the component has no usable function yet. */
    enabled: boolean;
}) {
    const board = useContext(BoardContext);
    const { darkMode } = useContext(DocContext) || {};
    const curveJXG = useRef<JXGCurve | null>(null);
    const boundListener = useRef<(() => void) | null>(null);

    const attributes: Record<string, any> = {
        visible: !SVs.hidden,
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
    // current build function through a ref rather than closing over the one
    // from first render.
    const buildDataRef = useRef(buildData);
    buildDataRef.current = buildData;

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
        if (!enabled) {
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
