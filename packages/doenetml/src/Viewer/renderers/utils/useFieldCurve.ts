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
import type { FieldData, FieldSampling } from "./fieldGeometry";
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
    dx: number;
    dy: number;
    xoffset: number;
    yoffset: number;
    markLength: number;
    maxMarks: number;
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
 * The definition always describes a function of two inputs, whatever arity the
 * author wrote: the `function` attribute names both variables on the
 * `<function>` it creates (see `returnFieldFunctionAttribute` in the worker's
 * `utils/field.js`). That is what lets the two inputs be passed positionally
 * here — a *one*-input function built by `createFunctionFromDefinition` has
 * signature `(x, overrideDomain)`, so a second argument would silently override
 * the domain rather than supply `y`.
 */
export function useFieldFunction(
    fDefinition: any,
): (x: number, y: number) => number {
    return useMemo(
        () => createFunctionFromDefinition(fDefinition),
        [fDefinition],
    );
}

export function useFieldCurve({
    SVs,
    buildData,
}: {
    /** The state variables that style the curve and say whether to draw it. */
    SVs: FieldSVs;
    /**
     * Produce the coordinate arrays for the currently visible region. Only the
     * function and any component-specific options are the caller's to supply;
     * everything about the lattice comes from the state variables above.
     */
    buildData: (sampling: FieldSampling) => FieldData;
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
    // current build function — and the current state variables — through refs
    // rather than closing over the ones from first render.
    const buildDataRef = useRef(buildData);
    buildDataRef.current = buildData;
    const SVsRef = useRef(SVs);
    SVsRef.current = SVs;

    /** The lattice and viewport to sample, as of right now. */
    function currentSampling(b: JXGBoard): FieldSampling {
        const svs = SVsRef.current;
        const [xMin, yMax, xMax, yMin] = b.getBoundingBox();
        return {
            bounds: { xMin, xMax, yMin, yMax },
            grid: {
                dx: svs.dx,
                dy: svs.dy,
                xoffset: svs.xoffset,
                yoffset: svs.yoffset,
            },
            scale: { unitX: b.unitX, unitY: b.unitY },
            markLength: svs.markLength,
            maxMarks: svs.maxMarks,
        };
    }

    function refreshData() {
        const b = board;
        const curve = curveJXG.current;
        if (!b || !curve) {
            return;
        }
        if (SVsRef.current.hidden) {
            // Sampling the whole lattice is the expensive part, and a hidden
            // field would otherwise pay it on every pan and zoom. The render
            // that unhides the curve calls this again, so nothing is lost.
            return;
        }
        const { dataX, dataY } = buildDataRef.current(currentSampling(b));
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
