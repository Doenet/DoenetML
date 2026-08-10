/**
 * Shared lifecycle for `<slopeField>` and `<vectorField>`.
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
import { useContext, useEffect, useRef } from "react";
import { BoardContext } from "../graph";
import { JXGBoard, JXGCurve } from "../jsxgraph-distrib/types";
import type { FieldBounds, FieldData, FieldScale } from "./fieldGeometry";

export function useFieldCurve({
    buildData,
    attributes,
    visible,
    enabled,
}: {
    /** Produce the coordinate arrays for the currently visible region. */
    buildData: (bounds: FieldBounds, scale: FieldScale) => FieldData;
    /** JSXGraph attributes for the single curve. */
    attributes: Record<string, any>;
    visible: boolean;
    /** False when the component has no usable function yet. */
    enabled: boolean;
}) {
    const board = useContext(BoardContext);
    const curveJXG = useRef<JXGCurve | null>(null);
    const boundListener = useRef<(() => void) | null>(null);

    // The `boundingbox` listener is registered once, so it must read the
    // current build function and attributes through refs rather than closing
    // over the values from first render.
    const buildDataRef = useRef(buildData);
    buildDataRef.current = buildData;
    const attributesRef = useRef(attributes);
    attributesRef.current = attributes;

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
        const curve = board.create(
            "curve",
            [[], []],
            attributesRef.current,
        ) as JXGCurve;
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

    useEffect(() => {
        // On unmount
        return () => {
            deleteCurve();
        };
    }, []);

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
            curveJXG.current.setAttribute(attributesRef.current);
            curveJXG.current.visProp.visible = visible;
            refreshData();
        }
    }

    return curveJXG;
}
