import { LabelPosition } from "./graph";

/**
 * Resolved style values delivered to a renderer.
 *
 * Mirrors the keys produced by `returnSelectedStyleStateVariableDefinition` in
 * `@doenet/utils/style/style.ts`. All values are primitives (the wrapper
 * `{ style }` shape from the worker is unwrapped before reaching the renderer).
 */
export interface SelectedStyle {
    lineColor: string;
    lineColorWord: string;
    lineColorDarkMode: string;
    lineColorWordDarkMode: string;
    lineOpacity: number;
    lineWidth: number;
    lineWidthWord: string;
    lineStyle: string;
    lineStyleWord: string;
    markerColor: string;
    markerColorWord: string;
    markerColorDarkMode: string;
    markerColorWordDarkMode: string;
    markerOpacity: number;
    markerStyle: string;
    markerStyleWord: string;
    markerSize: number;
    fillColor: string;
    fillColorWord: string;
    fillColorDarkMode: string;
    fillColorWordDarkMode: string;
    fillOpacity: number;
    textColor?: string;
    textColorWord?: string;
    textColorDarkMode?: string;
    textColorWordDarkMode?: string;
    highContrastColor?: string;
    highContrastColorDarkMode?: string;
    backgroundColor?: string;
    backgroundColorDarkMode?: string;
}

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
    selectedStyle: SelectedStyle;
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
