import type { ResolvedStyleDefinition } from "@doenet/utils";
import { LabelPosition } from "./graph";

/**
 * Truly universal state-variable shape — present on every JSXgraph-renderable
 * component, labelled or not, draggable or not. Layer, visibility and style.
 */
export interface UnlabeledGraphicalSVs {
    hidden: boolean;
    layer: number;
    selectedStyle: ResolvedStyleDefinition;
}

/**
 * The state variables a component that can carry a label adds, which the worker
 * defines for every graphical component bar the ones that set
 * `static includeLabels = false` — a field covers the whole viewport, so there
 * is nowhere for a label to sit and it has none of these.
 *
 * Split out so that such a renderer names the half it does receive
 * ({@link UnlabeledGraphicalSVs}) rather than subtracting the half it does not:
 * a subtraction has to be revisited every time a label state variable is added
 * here, and silently claims the new one until it is.
 */
export interface GraphicalLabelSVs {
    labelForGraph: string;
    labelHasLatex: boolean;
    labelPosition: LabelPosition;
    applyStyleToLabel: boolean;
    maskLabel: boolean;
}

/**
 * The shape of a graphical component that carries a label, which is nearly all
 * of them.
 */
export interface GraphicalSVs
    extends UnlabeledGraphicalSVs, GraphicalLabelSVs {}

/**
 * Control-related state variables present on draggable graphical components
 * (point, line, circle, vector, polygon, etc.) but not on non-draggable ones
 * (angle, region, label).
 *
 * When the controls refactor (`refactor-controls-logic.md`) lands these fields
 * may consolidate into a new shape; per-renderer SVs interfaces only extend
 * this base when the renderer participates in drag/click control logic.
 */
export interface DraggableGraphicalSVs extends GraphicalSVs {
    fixed: boolean;
    fixLocation: boolean;
    draggable: boolean;
}
