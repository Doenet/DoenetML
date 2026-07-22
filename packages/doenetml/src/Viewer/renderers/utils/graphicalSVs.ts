import type { ResolvedStyleDefinition } from "@doenet/utils";
import { LabelPosition } from "./graph";

/**
 * Truly universal state-variable shape — present on every JSXgraph-renderable
 * component, draggable or not. Includes layer/visibility/label/style.
 */
export interface GraphicalSVs {
    hidden: boolean;
    layer: number;
    labelForGraph: string;
    labelHasLatex: boolean;
    labelPosition: LabelPosition;
    applyStyleToLabel: boolean;
    maskLabel: boolean;
    selectedStyle: ResolvedStyleDefinition;
}

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
