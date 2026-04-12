import type { DiagnosticRecord, Position } from "@doenet/utils";

export type Point = [number, number];

export type GraphBounds = [number, number, number, number];

export type GraphDimensions = [number, number];

export interface Bounds {
    xMin: number;
    yMin: number;
    xMax: number;
    yMax: number;
}

export interface Dimensions {
    width: number;
    height: number;
}

export interface PushDiagnosticArgs {
    diagnostics: DiagnosticRecord[];
    message: string;
    position?: Position;
}

export type UsedHandles = Set<string>;

export interface SelectedStyle {
    lineColor?: string;
    lineColorWord?: string;
    lineWidth?: number;
    fillColor?: string;
    fillColorWord?: string;
    lineOpacity?: number;
    fillOpacity?: number;
    lineStyle?: string;
    markerStyle?: string;
    markerSize?: number;
    markerColor?: string;
    markerColorWord?: string;
    markerOpacity?: number;
    [key: string]: unknown;
}

export interface CurveFunctionDefinition {
    functionType?: unknown;
    formula?: unknown;
    variables?: unknown;
    [key: string]: unknown;
}

export interface PrefigureStateValues extends Record<string, unknown> {
    selectedStyle?: SelectedStyle;
    label?: string;
    labelHasLatex?: boolean;
    labelPosition?: string;
    hidden?: boolean;
    open?: boolean;
    filled?: boolean;
    swapPointOrder?: boolean;
    numericalXs?: unknown;
    numericalPoints?: unknown;
    numericalEndpoints?: unknown;
    numericalEndpoint?: unknown;
    numericalThroughpoint?: unknown;
    numericalCenter?: unknown;
    numericalRadius?: unknown;
    numericalVertices?: unknown;
    curveType?: unknown;
    fDefinitions?: unknown;
    parMin?: unknown;
    parMax?: unknown;
    flipFunction?: unknown;
    numericalThroughPoints?: unknown;
    periodic?: unknown;
    extrapolateBackward?: unknown;
    extrapolateForward?: unknown;
    graphBounds?: GraphBounds;
    graphDimensions?: GraphDimensions;
    lineLabelLocationOverride?: number;
    lineLabelAlignmentLocationOverride?: number;
    lineLabelAbsoluteEndpointOffset?: boolean;
}

export interface Descendant {
    componentType: string;
    componentName?: string;
    componentIdx?: number;
    position?: Position;
    stateValues?: Record<string, unknown>;
}

export interface AnnotationRefResolution {
    componentIdx?: number;
    unresolvedPath?: unknown;
    position?: Position;
}

// Produced by the JS worker-side Annotation component before being consumed by
// the TS prefigure conversion pipeline.
export interface AnnotationNode {
    componentIdx?: number;
    componentName?: string;
    text?: string;
    speech?: string;
    sonify?: boolean;
    circular?: boolean;
    hasRefAttribute?: boolean;
    refResolutions?: AnnotationRefResolution[];
    children?: AnnotationNode[];
}

export interface AnnotationContainerChild extends Descendant {
    stateValues?: {
        annotationSubtrees?: AnnotationNode[];
    };
}

export interface ConverterWarningContext {
    diagnostics: DiagnosticRecord[];
    warningPrefix: string;
    warningPosition?: Position;
}

export interface ConverterArgs extends ConverterWarningContext {
    sv: PrefigureStateValues;
    handle: string;
    styleAttrs: string[];
}

export type Converter = (args: ConverterArgs) => string | null;

export interface GraphDependencyValues extends Record<string, unknown> {
    xMin?: unknown;
    yMin?: unknown;
    xMax?: unknown;
    yMax?: unknown;
    width?: { size?: unknown } | null;
    aspectRatio?: unknown;
    displayXAxis?: unknown;
    displayYAxis?: unknown;
    xLabel?: unknown;
    xLabelHasLatex?: unknown;
    xLabelPosition?: unknown;
    yLabel?: unknown;
    yLabelHasLatex?: unknown;
    yLabelPosition?: unknown;
    effectiveRenderer?: unknown;
    haveGraphParent?: unknown;
    allGraphicalDescendants?: Descendant[];
    allDescendants?: Descendant[];
    annotationsChildren?: AnnotationContainerChild[];
    curveDescendants?: Descendant[];
    curveDescendantComponentIndices?: number[];
    functionToCurveComponentIdx?: Record<number, number>;
}
