import BlockComponent from "./abstract/BlockComponent";
import me from "math-expressions";
import {
    orderedPercentWidthMidpoints,
    orderedWidthMidpoints,
    widthsBySize,
    sizePossibilities,
} from "@doenet/utils";
import {
    returnRoundingAttributeComponentShadowing,
    returnRoundingAttributes,
    returnRoundingStateVariableDefinitions,
} from "../utils/rounding";
// PreFigure conversion architecture and extension guide:
// see src/utils/prefigure/README.md
import { returnGraphPrefigureStateVariableDefinitions } from "../utils/prefigure/stateVariable";

/**
 * Extracts display/rounding metadata shared by all graph control payloads.
 */
function extractControlDisplaySettings(stateValues) {
    return {
        label: typeof stateValues.label === "string" ? stateValues.label : "",
        labelHasLatex: Boolean(stateValues.labelHasLatex),
        displayDigits: stateValues.displayDigits,
        displayDecimals: stateValues.displayDecimals,
        displaySmallAsZero: stateValues.displaySmallAsZero,
        padZeros: stateValues.padZeros,
    };
}

/**
 * Returns true when vertices contain at least `minVertexCount` 2D finite points.
 */
function hasValid2DNumericalVertices(numericalVertices, minVertexCount) {
    return (
        Array.isArray(numericalVertices) &&
        numericalVertices.length >= minVertexCount &&
        numericalVertices.every(
            (vertex) =>
                Array.isArray(vertex) &&
                vertex.length >= 2 &&
                Number.isFinite(Number(vertex[0])) &&
                Number.isFinite(Number(vertex[1])),
        )
    );
}

/**
 * Computes the arithmetic center of 2D numerical vertices.
 * Returns null when the computed center is non-finite.
 */
function calculate2DVerticesCenter(numericalVertices) {
    const center = numericalVertices.reduce(
        (acc, vertex) => {
            acc[0] += Number(vertex[0]);
            acc[1] += Number(vertex[1]);
            return acc;
        },
        [0, 0],
    );

    center[0] /= numericalVertices.length;
    center[1] /= numericalVertices.length;

    if (!Number.isFinite(center[0]) || !Number.isFinite(center[1])) {
        return null;
    }

    return {
        x: center[0],
        y: center[1],
    };
}

/**
 * Resolves effective addControls mode for shapes with independent center and size draggability.
 *
 * Returns:
 * - `centerMode` when only center movement is allowed
 * - `sizeMode` when only size movement is allowed
 * - `compositeMode` when both are allowed
 * - `null` when neither is allowed
 */
function resolveCompositeControlsMode({
    requestedMode,
    draggable,
    verticesDraggable,
    centerMode,
    sizeMode,
    compositeMode,
}) {
    if (requestedMode === centerMode) {
        return draggable ? centerMode : null;
    }

    if (requestedMode === sizeMode) {
        return verticesDraggable ? sizeMode : null;
    }

    if (requestedMode !== compositeMode) {
        return requestedMode;
    }

    if (draggable && !verticesDraggable) {
        return centerMode;
    }
    if (verticesDraggable && !draggable) {
        return sizeMode;
    }
    if (!draggable && !verticesDraggable) {
        return null;
    }

    return compositeMode;
}

export default class Graph extends BlockComponent {
    constructor(args) {
        super(args);

        Object.assign(this.actions, {
            changeAxisLimits: this.changeAxisLimits.bind(this),
            addChildren: this.addChildren.bind(this),
            deleteChildren: this.deleteChildren.bind(this),
            recordVisibilityChange: this.recordVisibilityChange.bind(this),
        });
    }
    static componentType = "graph";
    static renderChildren = true;

    static createAttributesObject() {
        let attributes = super.createAttributesObject();
        attributes.xMin = {
            createComponentOfType: "number",
            createStateVariable: "xminPrelim",
            defaultValue: -10,
        };
        attributes.xMax = {
            createComponentOfType: "number",
            createStateVariable: "xmaxPrelim",
            defaultValue: 10,
        };
        attributes.yMin = {
            createComponentOfType: "number",
            createStateVariable: "yminPrelim",
            defaultValue: -10,
        };
        attributes.yMax = {
            createComponentOfType: "number",
            createStateVariable: "ymaxPrelim",
            defaultValue: 10,
        };
        attributes.width = {
            createComponentOfType: "componentSize",
        };
        attributes.size = {
            createComponentOfType: "text",
            createStateVariable: "specifiedSize",
            defaultValue: "medium",
            toLowerCase: true,
            validValues: sizePossibilities,
        };
        attributes.aspectRatio = {
            createComponentOfType: "number",
        };

        attributes.displayMode = {
            createComponentOfType: "text",
            createStateVariable: "displayMode",
            validValues: ["block", "inline"],
            defaultValue: "block",
            toLowerCase: true,
            forRenderer: true,
            public: true,
        };

        attributes.horizontalAlign = {
            createComponentOfType: "text",
            createStateVariable: "horizontalAlign",
            validValues: ["center", "left", "right"],
            defaultValue: "center",
            toLowerCase: true,
            forRenderer: true,
            public: true,
        };

        attributes.identicalAxisScales = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "identicalAxisScales",
            defaultValue: false,
            public: true,
        };
        attributes.displayXAxis = {
            createComponentOfType: "boolean",
            createStateVariable: "displayXAxis",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };
        attributes.displayYAxis = {
            createComponentOfType: "boolean",
            createStateVariable: "displayYAxis",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };
        attributes.addControls = {
            createComponentOfType: "text",
            createStateVariable: "addControls",
            defaultValue: "none",
            public: true,
            toLowerCase: true,
            validValues: ["all", "slidersOnly", "inputsOnly", "none"],
            valueForTrue: "all",
            valueForFalse: "none",
            forRenderer: true,
        };
        attributes.controlsPosition = {
            createComponentOfType: "text",
            createStateVariable: "controlsPosition",
            defaultValue: "left",
            public: true,
            forRenderer: true,
            toLowerCase: true,
            validValues: ["bottom", "left", "right", "top"],
        };
        attributes.displayXAxisTicks = {
            createComponentOfType: "boolean",
            createStateVariable: "displayXAxisTicks",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };
        attributes.displayYAxisTicks = {
            createComponentOfType: "boolean",
            createStateVariable: "displayYAxisTicks",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };
        attributes.displayXAxisTickLabels = {
            createComponentOfType: "boolean",
            createStateVariable: "displayXAxisTickLabelsPrelim",
            defaultValue: true,
        };
        attributes.displayYAxisTickLabels = {
            createComponentOfType: "boolean",
            createStateVariable: "displayYAxisTickLabelsPrelim",
            defaultValue: true,
        };
        attributes.xLabelPosition = {
            createComponentOfType: "text",
            createStateVariable: "xLabelPosition",
            defaultValue: "right",
            public: true,
            forRenderer: true,
            toLowerCase: true,
            validValues: ["right", "left"],
        };
        attributes.xTickScaleFactor = {
            createComponentOfType: "math",
            createStateVariable: "xTickScaleFactor",
            defaultValue: null,
            public: true,
            forRenderer: true,
        };
        attributes.yLabelPosition = {
            createComponentOfType: "text",
            createStateVariable: "yLabelPosition",
            defaultValue: "top",
            public: true,
            forRenderer: true,
            toLowerCase: true,
            validValues: ["top", "bottom"],
        };
        attributes.yLabelAlignment = {
            createComponentOfType: "text",
            createStateVariable: "yLabelAlignment",
            defaultValue: "left",
            public: true,
            forRenderer: true,
            toLowerCase: true,
            validValues: ["left", "right"],
        };
        attributes.yTickScaleFactor = {
            createComponentOfType: "math",
            createStateVariable: "yTickScaleFactor",
            defaultValue: null,
            public: true,
            forRenderer: true,
        };
        attributes.showNavigation = {
            createComponentOfType: "boolean",
            createStateVariable: "showNavigation",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };
        attributes.fixAxes = {
            createComponentOfType: "boolean",
            createStateVariable: "fixAxesPreliminary",
            defaultValue: false,
        };
        attributes.grid = {
            createComponentOfType: "text",
            valueForTrue: "medium",
        };

        Object.assign(attributes, returnRoundingAttributes());

        attributes.showBorder = {
            createComponentOfType: "boolean",
            createStateVariable: "showBorder",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };

        attributes.hideOffGraphIndicators = {
            createComponentOfType: "boolean",
            createStateVariable: "hideOffGraphIndicators",
            defaultValue: false,
            public: true,
        };

        attributes.decorative = {
            createPrimitiveOfType: "boolean",
            createStateVariable: "decorative",
            defaultValue: false,
            public: true,
            forRenderer: true,
        };

        attributes.renderer = {
            createPrimitiveOfType: "string",
            createStateVariable: "renderer",
            validValues: ["doenet", "prefigure"],
            defaultValue: "doenet",
            public: true,
            toLowerCase: true,
            forRenderer: true,
        };

        return attributes;
    }

    static returnChildGroups() {
        return [
            {
                group: "xLabels",
                componentTypes: ["xLabel"],
            },
            {
                group: "yLabels",
                componentTypes: ["yLabel"],
            },
            {
                group: "shortDescriptions",
                componentTypes: ["shortDescription"],
            },
            {
                group: "descriptions",
                componentTypes: ["description"],
            },
            {
                group: "graphical",
                componentTypes: [
                    "_graphical",
                    "image",
                    "text",
                    "math",
                    "m",
                    "md",
                    "label",
                    "number",
                    "updateValue",
                    "callAction",
                    "triggerSet",
                    "booleanInput",
                    "textInput",
                ],
            },
            {
                group: "graphs",
                componentTypes: ["graph"],
            },
            {
                group: "annotations",
                componentTypes: ["annotations"],
            },
        ];
    }

    static returnStateVariableDefinitions() {
        let stateVariableDefinitions = super.returnStateVariableDefinitions();

        Object.assign(
            stateVariableDefinitions,
            returnRoundingStateVariableDefinitions(),
        );

        stateVariableDefinitions.shortDescription = {
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                shortDescriptionChild: {
                    dependencyType: "child",
                    childGroups: ["shortDescriptions"],
                    variableNames: ["text"],
                },
                decorative: {
                    dependencyType: "stateVariable",
                    variableName: "decorative",
                },
            }),
            definition({ dependencyValues }) {
                let shortDescription = "";
                const diagnostics = [];
                if (dependencyValues.shortDescriptionChild.length > 0) {
                    const shortDescriptionChild =
                        dependencyValues.shortDescriptionChild[
                            dependencyValues.shortDescriptionChild.length - 1
                        ];

                    shortDescription =
                        shortDescriptionChild.stateValues.text.trim();
                }
                if (shortDescription === "" && !dependencyValues.decorative) {
                    diagnostics.push({
                        type: "accessibility",
                        level: 1,
                        message:
                            "For accessibility, `<graph>` must either have a short description or be specified as decorative.",
                    });
                }

                return {
                    setValue: { shortDescription },
                    sendDiagnostics: diagnostics,
                };
            },
        };

        stateVariableDefinitions.descriptionChildInd = {
            forRenderer: true,
            returnDependencies: () => ({
                allChildren: {
                    dependencyType: "child",
                    includeAllChildren: true,
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        descriptionChildInd:
                            dependencyValues.allChildren.findLastIndex(
                                (child) =>
                                    child.componentType === "description",
                            ),
                    },
                };
            },
        };

        stateVariableDefinitions.fixAxes = {
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                fixAxesPreliminary: {
                    dependencyType: "stateVariable",
                    variableName: "fixAxesPreliminary",
                },
                fixed: {
                    dependencyType: "stateVariable",
                    variableName: "fixed",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        fixAxes:
                            dependencyValues.fixAxesPreliminary ||
                            dependencyValues.fixed,
                    },
                };
            },
        };

        stateVariableDefinitions.xLabel = {
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "label",
                addStateVariablesShadowingStateVariables: {
                    hasLatex: {
                        stateVariableToShadow: "xLabelHasLatex",
                    },
                },
            },
            hasEssential: true,
            defaultValue: "",
            additionalStateVariablesDefined: [
                {
                    variableName: "xLabelHasLatex",
                    forRenderer: true,
                },
            ],
            returnDependencies: () => ({
                xLabelChild: {
                    dependencyType: "child",
                    childGroups: ["xLabels"],
                    variableNames: ["value", "hasLatex"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.xLabelChild.length > 0) {
                    let xLabelChild =
                        dependencyValues.xLabelChild[
                            dependencyValues.xLabelChild.length - 1
                        ];
                    return {
                        setValue: {
                            xLabel: xLabelChild.stateValues.value,
                            xLabelHasLatex: xLabelChild.stateValues.hasLatex,
                        },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: { xLabel: true },
                        setValue: { xLabelHasLatex: false },
                    };
                }
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (typeof desiredStateVariableValues.xLabel !== "string") {
                    return { success: false };
                }

                if (dependencyValues.xLabelChild.length > 0) {
                    let lastLabelInd = dependencyValues.xLabelChild.length - 1;
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "xLabelChild",
                                desiredValue: desiredStateVariableValues.xLabel,
                                childIndex: lastLabelInd,
                                variableIndex: 0,
                            },
                        ],
                    };
                } else {
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: "xLabel",
                                value: desiredStateVariableValues.xLabel,
                            },
                        ],
                    };
                }
            },
        };

        stateVariableDefinitions.yLabel = {
            forRenderer: true,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "label",
                addStateVariablesShadowingStateVariables: {
                    hasLatex: {
                        stateVariableToShadow: "yLabelHasLatex",
                    },
                },
            },
            hasEssential: true,
            defaultValue: "",
            additionalStateVariablesDefined: [
                {
                    variableName: "yLabelHasLatex",
                    forRenderer: true,
                },
            ],
            returnDependencies: () => ({
                yLabelChild: {
                    dependencyType: "child",
                    childGroups: ["yLabels"],
                    variableNames: ["value", "hasLatex"],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.yLabelChild.length > 0) {
                    let yLabelChild =
                        dependencyValues.yLabelChild[
                            dependencyValues.yLabelChild.length - 1
                        ];
                    return {
                        setValue: {
                            yLabel: yLabelChild.stateValues.value,
                            yLabelHasLatex: yLabelChild.stateValues.hasLatex,
                        },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: { yLabel: true },
                        setValue: { yLabelHasLatex: false },
                    };
                }
            },
            inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
            }) {
                if (typeof desiredStateVariableValues.yLabel !== "string") {
                    return { success: false };
                }

                if (dependencyValues.yLabelChild.length > 0) {
                    let lastLabelInd = dependencyValues.yLabelChild.length - 1;
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "yLabelChild",
                                desiredValue: desiredStateVariableValues.yLabel,
                                childIndex: lastLabelInd,
                                variableIndex: 0,
                            },
                        ],
                    };
                } else {
                    return {
                        success: true,
                        instructions: [
                            {
                                setEssentialValue: "yLabel",
                                value: desiredStateVariableValues.yLabel,
                            },
                        ],
                    };
                }
            },
        };

        stateVariableDefinitions.graphicalDescendants = {
            forRenderer: true,
            returnDependencies: () => ({
                graphicalDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["_graphical"],
                },
            }),
            definition: function ({ dependencyValues }) {
                return {
                    setValue: {
                        graphicalDescendants:
                            dependencyValues.graphicalDescendants,
                    },
                };
            },
        };

        stateVariableDefinitions.draggablePointsForControls = {
            forRenderer: true,
            returnDependencies: () => ({
                addControls: {
                    dependencyType: "stateVariable",
                    variableName: "addControls",
                },
                pointDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["point"],
                    variableNames: [
                        "numericalXs",
                        "draggable",
                        "fixed",
                        "fixLocation",
                        "addControls",
                        "label",
                        "labelHasLatex",
                        "displayDigits",
                        "displayDecimals",
                        "displaySmallAsZero",
                        "padZeros",
                    ],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.addControls === "none") {
                    return {
                        setValue: {
                            draggablePointsForControls: [],
                        },
                    };
                }

                const draggablePointsForControls = [];

                for (const [pointInd, pointDescendant] of (
                    dependencyValues.pointDescendants ?? []
                ).entries()) {
                    const stateValues = pointDescendant.stateValues ?? {};
                    const numericalXs = stateValues.numericalXs;
                    const pointNumber = pointInd + 1;

                    // Skip points with invalid or missing coordinates
                    if (!Array.isArray(numericalXs) || numericalXs.length < 2) {
                        continue;
                    }

                    const x = Number(numericalXs[0]);
                    const y = Number(numericalXs[1]);

                    // Skip points with non-finite coordinates (NaN, Infinity)
                    if (!Number.isFinite(x) || !Number.isFinite(y)) {
                        continue;
                    }

                    const draggable = stateValues.draggable !== false;
                    const fixed = stateValues.fixed === true;
                    const fixLocation = stateValues.fixLocation === true;
                    const addControls = stateValues.addControls;

                    // Skip points that cannot be interacted with via controls:
                    // - not draggable (fixed by default)
                    // - explicitly marked as fixed
                    // - constrained via fixLocation
                    // - author explicitly set addControls="none" on the point
                    if (
                        !draggable ||
                        fixed ||
                        fixLocation ||
                        addControls === "none"
                    ) {
                        continue;
                    }

                    const componentIdx = pointDescendant.componentIdx;
                    if (!Number.isFinite(componentIdx)) {
                        continue;
                    }

                    draggablePointsForControls.push({
                        componentIdx,
                        pointNumber,
                        x,
                        y,
                        addControls,
                        ...extractControlDisplaySettings(stateValues),
                    });
                }

                return {
                    setValue: {
                        draggablePointsForControls,
                    },
                };
            },
        };

        stateVariableDefinitions.draggableCirclesForControls = {
            forRenderer: true,
            returnDependencies: () => ({
                addControls: {
                    dependencyType: "stateVariable",
                    variableName: "addControls",
                },
                circleDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["circle"],
                    variableNames: [
                        "numericalCenter",
                        "numericalRadius",
                        "draggable",
                        "fixed",
                        "fixLocation",
                        "addControls",
                        "label",
                        "labelHasLatex",
                        "displayDigits",
                        "displayDecimals",
                        "displaySmallAsZero",
                        "padZeros",
                    ],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.addControls === "none") {
                    return {
                        setValue: {
                            draggableCirclesForControls: [],
                        },
                    };
                }

                const draggableCirclesForControls = [];

                for (const [circleInd, circleDescendant] of (
                    dependencyValues.circleDescendants ?? []
                ).entries()) {
                    const stateValues = circleDescendant.stateValues ?? {};
                    const circleNumber = circleInd + 1;
                    const componentIdx = circleDescendant.componentIdx;
                    const center = stateValues.numericalCenter;
                    const radius = Number(stateValues.numericalRadius);
                    const addControls = stateValues.addControls;

                    if (!Number.isFinite(componentIdx)) {
                        continue;
                    }

                    if (
                        !Array.isArray(center) ||
                        center.length < 2 ||
                        !Number.isFinite(center[0]) ||
                        !Number.isFinite(center[1]) ||
                        !Number.isFinite(radius) ||
                        radius < 0
                    ) {
                        continue;
                    }

                    const draggable = stateValues.draggable !== false;
                    const fixed = stateValues.fixed === true;
                    const fixLocation = stateValues.fixLocation === true;

                    if (
                        fixed ||
                        fixLocation ||
                        addControls === "none" ||
                        !draggable
                    ) {
                        continue;
                    }

                    draggableCirclesForControls.push({
                        componentIdx,
                        circleNumber,
                        center: {
                            x: Number(center[0]),
                            y: Number(center[1]),
                        },
                        radius,
                        addControls,
                        ...extractControlDisplaySettings(stateValues),
                    });
                }

                return {
                    setValue: {
                        draggableCirclesForControls,
                    },
                };
            },
        };

        stateVariableDefinitions.draggableRegularPolygonsForControls = {
            forRenderer: true,
            returnDependencies: () => ({
                addControls: {
                    dependencyType: "stateVariable",
                    variableName: "addControls",
                },
                regularPolygonDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["regularPolygon"],
                    variableNames: [
                        "numericalVertices",
                        "draggable",
                        "verticesDraggable",
                        "fixed",
                        "fixLocation",
                        "addControls",
                        "label",
                        "labelHasLatex",
                        "displayDigits",
                        "displayDecimals",
                        "displaySmallAsZero",
                        "padZeros",
                    ],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.addControls === "none") {
                    return {
                        setValue: {
                            draggableRegularPolygonsForControls: [],
                        },
                    };
                }

                const draggableRegularPolygonsForControls = [];

                for (const [regularPolygonInd, regularPolygonDescendant] of (
                    dependencyValues.regularPolygonDescendants ?? []
                ).entries()) {
                    const stateValues =
                        regularPolygonDescendant.stateValues ?? {};
                    const regularPolygonNumber = regularPolygonInd + 1;
                    const componentIdx = regularPolygonDescendant.componentIdx;
                    const numericalVertices = stateValues.numericalVertices;
                    const addControls = stateValues.addControls;

                    if (!Number.isFinite(componentIdx)) {
                        continue;
                    }

                    if (!hasValid2DNumericalVertices(numericalVertices, 3)) {
                        continue;
                    }

                    const fixed = stateValues.fixed === true;
                    const fixLocation = stateValues.fixLocation === true;
                    const draggable = stateValues.draggable !== false;
                    const verticesDraggable =
                        stateValues.verticesDraggable !== false;

                    if (fixed || fixLocation || addControls === "none") {
                        continue;
                    }

                    const effectiveAddControls = resolveCompositeControlsMode({
                        requestedMode: addControls,
                        draggable,
                        verticesDraggable,
                        centerMode: "center",
                        sizeMode: "radius",
                        compositeMode: "centerandradius",
                    });

                    if (effectiveAddControls === null) {
                        continue;
                    }

                    const center = calculate2DVerticesCenter(numericalVertices);
                    if (!center) {
                        continue;
                    }

                    const firstVertex = numericalVertices[0];
                    const radius = Math.sqrt(
                        (Number(firstVertex[0]) - center.x) ** 2 +
                            (Number(firstVertex[1]) - center.y) ** 2,
                    );

                    if (!Number.isFinite(radius) || radius < 0) {
                        continue;
                    }

                    draggableRegularPolygonsForControls.push({
                        componentIdx,
                        regularPolygonNumber,
                        center,
                        radius,
                        addControls: effectiveAddControls,
                        ...extractControlDisplaySettings(stateValues),
                    });
                }

                return {
                    setValue: {
                        draggableRegularPolygonsForControls,
                    },
                };
            },
        };

        stateVariableDefinitions.draggablePolygonsForControls = {
            forRenderer: true,
            returnDependencies: () => ({
                addControls: {
                    dependencyType: "stateVariable",
                    variableName: "addControls",
                },
                polygonDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["polygon"],
                    variableNames: [
                        "numericalVertices",
                        "draggable",
                        "fixed",
                        "fixLocation",
                        "addControls",
                        "label",
                        "labelHasLatex",
                        "displayDigits",
                        "displayDecimals",
                        "displaySmallAsZero",
                        "padZeros",
                    ],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.addControls === "none") {
                    return {
                        setValue: {
                            draggablePolygonsForControls: [],
                        },
                    };
                }

                const draggablePolygonsForControls = [];
                let polygonNumber = 0;

                for (const polygonDescendant of dependencyValues.polygonDescendants ??
                    []) {
                    // Descendants may include components that inherit from polygon
                    // (e.g. triangle/rectangle), but this payload is polygon-only.
                    if (polygonDescendant.componentType !== "polygon") {
                        continue;
                    }

                    const stateValues = polygonDescendant.stateValues ?? {};
                    polygonNumber += 1;
                    const componentIdx = polygonDescendant.componentIdx;
                    const numericalVertices = stateValues.numericalVertices;
                    const addControls = stateValues.addControls;

                    if (!Number.isFinite(componentIdx)) {
                        continue;
                    }

                    if (!hasValid2DNumericalVertices(numericalVertices, 3)) {
                        continue;
                    }

                    const fixed = stateValues.fixed === true;
                    const fixLocation = stateValues.fixLocation === true;
                    const draggable = stateValues.draggable !== false;

                    if (
                        fixed ||
                        fixLocation ||
                        addControls === "none" ||
                        !draggable
                    ) {
                        continue;
                    }

                    const center = calculate2DVerticesCenter(numericalVertices);
                    if (!center) {
                        continue;
                    }

                    draggablePolygonsForControls.push({
                        componentIdx,
                        polygonNumber,
                        center,
                        addControls,
                        ...extractControlDisplaySettings(stateValues),
                    });
                }

                return {
                    setValue: {
                        draggablePolygonsForControls,
                    },
                };
            },
        };

        stateVariableDefinitions.draggableTrianglesForControls = {
            forRenderer: true,
            returnDependencies: () => ({
                addControls: {
                    dependencyType: "stateVariable",
                    variableName: "addControls",
                },
                triangleDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["triangle"],
                    variableNames: [
                        "numericalVertices",
                        "draggable",
                        "fixed",
                        "fixLocation",
                        "addControls",
                        "label",
                        "labelHasLatex",
                        "displayDigits",
                        "displayDecimals",
                        "displaySmallAsZero",
                        "padZeros",
                    ],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.addControls === "none") {
                    return {
                        setValue: {
                            draggableTrianglesForControls: [],
                        },
                    };
                }

                const draggableTrianglesForControls = [];

                for (const [triangleInd, triangleDescendant] of (
                    dependencyValues.triangleDescendants ?? []
                ).entries()) {
                    const stateValues = triangleDescendant.stateValues ?? {};
                    const triangleNumber = triangleInd + 1;
                    const componentIdx = triangleDescendant.componentIdx;
                    const numericalVertices = stateValues.numericalVertices;
                    const addControls = stateValues.addControls;

                    if (!Number.isFinite(componentIdx)) {
                        continue;
                    }

                    if (!hasValid2DNumericalVertices(numericalVertices, 3)) {
                        continue;
                    }

                    const fixed = stateValues.fixed === true;
                    const fixLocation = stateValues.fixLocation === true;
                    const draggable = stateValues.draggable !== false;

                    if (
                        fixed ||
                        fixLocation ||
                        addControls === "none" ||
                        !draggable
                    ) {
                        continue;
                    }

                    const center = calculate2DVerticesCenter(numericalVertices);
                    if (!center) {
                        continue;
                    }

                    draggableTrianglesForControls.push({
                        componentIdx,
                        triangleNumber,
                        center,
                        addControls,
                        ...extractControlDisplaySettings(stateValues),
                    });
                }

                return {
                    setValue: {
                        draggableTrianglesForControls,
                    },
                };
            },
        };

        stateVariableDefinitions.draggableRectanglesForControls = {
            forRenderer: true,
            returnDependencies: () => ({
                addControls: {
                    dependencyType: "stateVariable",
                    variableName: "addControls",
                },
                rectangleDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["rectangle"],
                    variableNames: [
                        "numericalVertices",
                        "width",
                        "height",
                        "draggable",
                        "verticesDraggable",
                        "fixed",
                        "fixLocation",
                        "addControls",
                        "label",
                        "labelHasLatex",
                        "displayDigits",
                        "displayDecimals",
                        "displaySmallAsZero",
                        "padZeros",
                    ],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.addControls === "none") {
                    return {
                        setValue: {
                            draggableRectanglesForControls: [],
                        },
                    };
                }

                const draggableRectanglesForControls = [];

                for (const [rectangleInd, rectangleDescendant] of (
                    dependencyValues.rectangleDescendants ?? []
                ).entries()) {
                    const stateValues = rectangleDescendant.stateValues ?? {};
                    const rectangleNumber = rectangleInd + 1;
                    const componentIdx = rectangleDescendant.componentIdx;
                    const numericalVertices = stateValues.numericalVertices;
                    const width = Number(stateValues.width);
                    const height = Number(stateValues.height);
                    const addControls = stateValues.addControls;

                    if (!Number.isFinite(componentIdx)) {
                        continue;
                    }

                    if (!hasValid2DNumericalVertices(numericalVertices, 4)) {
                        continue;
                    }

                    if (
                        !Number.isFinite(width) ||
                        !Number.isFinite(height) ||
                        width < 0 ||
                        height < 0
                    ) {
                        continue;
                    }

                    const fixed = stateValues.fixed === true;
                    const fixLocation = stateValues.fixLocation === true;
                    const draggable = stateValues.draggable !== false;
                    const verticesDraggable =
                        stateValues.verticesDraggable !== false;

                    if (fixed || fixLocation || addControls === "none") {
                        continue;
                    }

                    const effectiveAddControls = resolveCompositeControlsMode({
                        requestedMode: addControls,
                        draggable,
                        verticesDraggable,
                        centerMode: "center",
                        sizeMode: "widthandheight",
                        compositeMode: "centerwidthandheight",
                    });

                    if (effectiveAddControls === null) {
                        continue;
                    }

                    const center = calculate2DVerticesCenter(numericalVertices);
                    if (!center) {
                        continue;
                    }

                    draggableRectanglesForControls.push({
                        componentIdx,
                        rectangleNumber,
                        center,
                        width,
                        height,
                        addControls: effectiveAddControls,
                        ...extractControlDisplaySettings(stateValues),
                    });
                }

                return {
                    setValue: {
                        draggableRectanglesForControls,
                    },
                };
            },
        };

        stateVariableDefinitions.draggableLineSegmentsForControls = {
            forRenderer: true,
            returnDependencies: () => ({
                addControls: {
                    dependencyType: "stateVariable",
                    variableName: "addControls",
                },
                lineSegmentDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["lineSegment"],
                    variableNames: [
                        "numericalEndpoints",
                        "endpointsDraggable",
                        "fixed",
                        "fixLocation",
                        "addControls",
                        "label",
                        "labelHasLatex",
                        "displayDigits",
                        "displayDecimals",
                        "displaySmallAsZero",
                        "padZeros",
                    ],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.addControls === "none") {
                    return {
                        setValue: {
                            draggableLineSegmentsForControls: [],
                        },
                    };
                }

                const draggableLineSegmentsForControls = [];

                for (const [lineSegmentInd, lineSegmentDescendant] of (
                    dependencyValues.lineSegmentDescendants ?? []
                ).entries()) {
                    const stateValues = lineSegmentDescendant.stateValues ?? {};
                    const lineSegmentNumber = lineSegmentInd + 1;
                    const componentIdx = lineSegmentDescendant.componentIdx;
                    const numericalEndpoints = stateValues.numericalEndpoints;
                    const addControls = stateValues.addControls;

                    if (!Number.isFinite(componentIdx)) {
                        continue;
                    }

                    if (
                        !Array.isArray(numericalEndpoints) ||
                        numericalEndpoints.length < 2 ||
                        !Array.isArray(numericalEndpoints[0]) ||
                        !Array.isArray(numericalEndpoints[1]) ||
                        numericalEndpoints[0].length < 2 ||
                        numericalEndpoints[1].length < 2
                    ) {
                        continue;
                    }

                    const endpoint1x = Number(numericalEndpoints[0][0]);
                    const endpoint1y = Number(numericalEndpoints[0][1]);
                    const endpoint2x = Number(numericalEndpoints[1][0]);
                    const endpoint2y = Number(numericalEndpoints[1][1]);

                    if (
                        !Number.isFinite(endpoint1x) ||
                        !Number.isFinite(endpoint1y) ||
                        !Number.isFinite(endpoint2x) ||
                        !Number.isFinite(endpoint2y)
                    ) {
                        continue;
                    }

                    const fixed = stateValues.fixed === true;
                    const fixLocation = stateValues.fixLocation === true;
                    const endpointsDraggable =
                        stateValues.endpointsDraggable !== false;

                    if (
                        fixed ||
                        fixLocation ||
                        addControls === "none" ||
                        !endpointsDraggable
                    ) {
                        continue;
                    }

                    draggableLineSegmentsForControls.push({
                        componentIdx,
                        lineSegmentNumber,
                        endpoint1: { x: endpoint1x, y: endpoint1y },
                        endpoint2: { x: endpoint2x, y: endpoint2y },
                        addControls,
                        ...extractControlDisplaySettings(stateValues),
                    });
                }

                return {
                    setValue: {
                        draggableLineSegmentsForControls,
                    },
                };
            },
        };

        stateVariableDefinitions.draggableVectorsForControls = {
            forRenderer: true,
            returnDependencies: () => ({
                addControls: {
                    dependencyType: "stateVariable",
                    variableName: "addControls",
                },
                vectorDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["vector"],
                    variableNames: [
                        "numericalEndpoints",
                        "headDraggable",
                        "tailDraggable",
                        "fixed",
                        "fixLocation",
                        "addControls",
                        "label",
                        "labelHasLatex",
                        "displayDigits",
                        "displayDecimals",
                        "displaySmallAsZero",
                        "padZeros",
                    ],
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.addControls === "none") {
                    return {
                        setValue: {
                            draggableVectorsForControls: [],
                        },
                    };
                }

                const draggableVectorsForControls = [];

                for (const [vectorInd, vectorDescendant] of (
                    dependencyValues.vectorDescendants ?? []
                ).entries()) {
                    const stateValues = vectorDescendant.stateValues ?? {};
                    const vectorNumber = vectorInd + 1;
                    const componentIdx = vectorDescendant.componentIdx;
                    const numericalEndpoints = stateValues.numericalEndpoints;
                    const addControls = stateValues.addControls;

                    if (!Number.isFinite(componentIdx)) {
                        continue;
                    }

                    if (
                        !Array.isArray(numericalEndpoints) ||
                        numericalEndpoints.length < 2 ||
                        !Array.isArray(numericalEndpoints[0]) ||
                        !Array.isArray(numericalEndpoints[1]) ||
                        numericalEndpoints[0].length < 2 ||
                        numericalEndpoints[1].length < 2
                    ) {
                        continue;
                    }

                    const tailX = Number(numericalEndpoints[0][0]);
                    const tailY = Number(numericalEndpoints[0][1]);
                    const headX = Number(numericalEndpoints[1][0]);
                    const headY = Number(numericalEndpoints[1][1]);

                    if (
                        !Number.isFinite(tailX) ||
                        !Number.isFinite(tailY) ||
                        !Number.isFinite(headX) ||
                        !Number.isFinite(headY)
                    ) {
                        continue;
                    }

                    const fixed = stateValues.fixed === true;
                    const fixLocation = stateValues.fixLocation === true;
                    const headDraggable = stateValues.headDraggable !== false;
                    const tailDraggable = stateValues.tailDraggable !== false;

                    if (fixed || fixLocation || addControls === "none") {
                        continue;
                    }

                    let effectiveAddControls = addControls;

                    if (effectiveAddControls === "displacement") {
                        if (!headDraggable) {
                            continue;
                        }
                    } else if (effectiveAddControls === "headandtail") {
                        if (headDraggable && !tailDraggable) {
                            effectiveAddControls = "headonly";
                        } else if (tailDraggable && !headDraggable) {
                            effectiveAddControls = "tailonly";
                        } else if (!headDraggable && !tailDraggable) {
                            continue;
                        }
                    } else if (effectiveAddControls === "headonly") {
                        if (!headDraggable) {
                            continue;
                        }
                    } else if (effectiveAddControls === "tailonly") {
                        if (!tailDraggable) {
                            continue;
                        }
                    }

                    draggableVectorsForControls.push({
                        componentIdx,
                        vectorNumber,
                        head: {
                            x: headX,
                            y: headY,
                        },
                        tail: {
                            x: tailX,
                            y: tailY,
                        },
                        displacement: {
                            x: headX - tailX,
                            y: headY - tailY,
                        },
                        addControls: effectiveAddControls,
                        ...extractControlDisplaySettings(stateValues),
                    });
                }

                return {
                    setValue: {
                        draggableVectorsForControls,
                    },
                };
            },
        };

        Object.assign(
            stateVariableDefinitions,
            returnGraphPrefigureStateVariableDefinitions(),
        );

        stateVariableDefinitions.childIndicesToRender = {
            returnDependencies: () => ({
                graphicalOrGraphChildren: {
                    dependencyType: "child",
                    childGroups: ["graphical", "graphs"],
                },
                allChildren: {
                    dependencyType: "child",
                    includeAllChildren: true,
                },
                descriptionChildInd: {
                    dependencyType: "stateVariable",
                    variableName: "descriptionChildInd",
                },
            }),
            definition({ dependencyValues }) {
                const childIndicesToRender = [];

                const graphicalChildNames =
                    dependencyValues.graphicalOrGraphChildren.map(
                        (x) => x.componentIdx,
                    );

                for (const [
                    ind,
                    child,
                ] of dependencyValues.allChildren.entries()) {
                    if (graphicalChildNames.includes(child.componentIdx)) {
                        childIndicesToRender.push(ind);
                    }
                }
                if (dependencyValues.descriptionChildInd !== -1) {
                    childIndicesToRender.push(
                        dependencyValues.descriptionChildInd,
                    );
                }

                return { setValue: { childIndicesToRender } };
            },
            markStale: () => ({ updateRenderedChildren: true }),
        };

        stateVariableDefinitions.numChildrenAdded = {
            defaultValue: 0,
            hasEssential: true,
            returnDependencies: () => ({}),
            definition: () => ({
                useEssentialOrDefaultValue: { numChildrenAdded: true },
            }),
            inverseDefinition({ desiredStateVariableValues }) {
                return {
                    success: true,
                    instructions: [
                        {
                            setEssentialValue: "numChildrenAdded",
                            value: desiredStateVariableValues.numChildrenAdded,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.size = {
            public: true,
            defaultValue: "medium",
            hasEssential: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                specifiedSize: {
                    dependencyType: "stateVariable",
                    variableName: "specifiedSize",
                },
                widthAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "width",
                    variableNames: ["componentSize"],
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                const defaultSize = "medium";

                if (!usedDefault.specifiedSize) {
                    return {
                        setValue: { size: dependencyValues.specifiedSize },
                    };
                } else if (dependencyValues.widthAttr) {
                    let componentSize =
                        dependencyValues.widthAttr.stateValues.componentSize;
                    if (componentSize === null) {
                        return {
                            setValue: { size: defaultSize },
                        };
                    }
                    let { isAbsolute, size: widthSize } = componentSize;
                    let size;

                    if (isAbsolute) {
                        for (let [
                            ind,
                            pixels,
                        ] of orderedWidthMidpoints.entries()) {
                            if (widthSize <= pixels) {
                                size = sizePossibilities[ind];
                                break;
                            }
                        }
                        if (!size) {
                            size = defaultSize;
                        }
                    } else {
                        for (let [
                            ind,
                            percent,
                        ] of orderedPercentWidthMidpoints.entries()) {
                            if (widthSize <= percent) {
                                size = sizePossibilities[ind];
                                break;
                            }
                        }
                        if (!size) {
                            size = defaultSize;
                        }
                    }
                    return {
                        setValue: { size },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: { size: true },
                    };
                }
            },
        };

        stateVariableDefinitions.width = {
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "componentSize",
            },
            returnDependencies: () => ({
                size: {
                    dependencyType: "stateVariable",
                    variableName: "size",
                },
            }),
            definition({ dependencyValues }) {
                let width = {
                    isAbsolute: true,
                    size: widthsBySize[dependencyValues.size],
                };

                return {
                    setValue: { width },
                };
            },
        };

        stateVariableDefinitions.aspectRatioFromAxisScales = {
            returnDependencies: () => ({
                aspectRatioAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "aspectRatio",
                    variableNames: ["value"],
                },
                identicalAxisScales: {
                    dependencyType: "stateVariable",
                    variableName: "identicalAxisScales",
                },
            }),
            definition({ dependencyValues }) {
                let aspectRatioFromAxisScales =
                    dependencyValues.identicalAxisScales &&
                    dependencyValues.aspectRatioAttr === null;
                // || !Number.isFinite(dependencyValues.aspectRatioAttr.stateValues.value)

                return {
                    setValue: { aspectRatioFromAxisScales },
                    checkForActualChange: { aspectRatioFromAxisScales: true },
                };
            },
        };

        stateVariableDefinitions.aspectRatio = {
            public: true,
            forRenderer: true,
            defaultValue: 1,
            hasEssential: true,
            shadowingInstructions: {
                createComponentOfType: "number",
            },
            stateVariablesDeterminingDependencies: [
                "aspectRatioFromAxisScales",
            ],
            returnDependencies({ stateValues }) {
                if (stateValues.aspectRatioFromAxisScales) {
                    return {
                        aspectRatioFromAxisScales: {
                            dependencyType: "stateVariable",
                            variableName: "aspectRatioFromAxisScales",
                        },
                        xscale: {
                            dependencyType: "stateVariable",
                            variableName: "xscale",
                        },
                        yscale: {
                            dependencyType: "stateVariable",
                            variableName: "yscale",
                        },
                    };
                } else {
                    return {
                        aspectRatioFromAxisScales: {
                            dependencyType: "stateVariable",
                            variableName: "aspectRatioFromAxisScales",
                        },
                        aspectRatioAttr: {
                            dependencyType: "attributeComponent",
                            attributeName: "aspectRatio",
                            variableNames: ["value"],
                        },
                        width: {
                            dependencyType: "stateVariable",
                            variableName: "width",
                        },
                    };
                }
            },
            definition({ dependencyValues }) {
                if (dependencyValues.aspectRatioFromAxisScales) {
                    let aspectRatio =
                        dependencyValues.xscale / dependencyValues.yscale;
                    return {
                        setValue: { aspectRatio },
                    };
                } else if (dependencyValues.aspectRatioAttr !== null) {
                    let aspectRatio =
                        dependencyValues.aspectRatioAttr.stateValues.value;
                    if (!Number.isFinite(aspectRatio)) {
                        aspectRatio = 1;
                    }
                    return {
                        setValue: { aspectRatio },
                    };
                } else {
                    return {
                        useEssentialOrDefaultValue: { aspectRatio: true },
                    };
                }
            },
        };

        stateVariableDefinitions.haveGraphParent = {
            forRenderer: true,
            returnDependencies: () => ({
                graphParent: {
                    dependencyType: "parentIdentity",
                    parentComponentType: "graph",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        haveGraphParent: dependencyValues.graphParent !== null,
                    },
                };
            },
        };

        stateVariableDefinitions.effectiveRenderer = {
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                renderer: {
                    dependencyType: "stateVariable",
                    variableName: "renderer",
                },
                graphParentRenderer: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "graph",
                    variableName: "effectiveRenderer",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        effectiveRenderer:
                            dependencyValues.graphParentRenderer ??
                            dependencyValues.renderer,
                    },
                };
            },
        };

        stateVariableDefinitions.displayXAxisTickLabels = {
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                displayXAxisTickLabelsPrelim: {
                    dependencyType: "stateVariable",
                    variableName: "displayXAxisTickLabelsPrelim",
                },
                displayXAxisTicks: {
                    dependencyType: "stateVariable",
                    variableName: "displayXAxisTicks",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                if (usedDefault.displayXAxisTickLabelsPrelim) {
                    return {
                        setValue: {
                            displayXAxisTickLabels:
                                dependencyValues.displayXAxisTicks,
                        },
                    };
                } else {
                    return {
                        setValue: {
                            displayXAxisTickLabels:
                                dependencyValues.displayXAxisTickLabelsPrelim,
                        },
                    };
                }
            },
        };

        stateVariableDefinitions.displayYAxisTickLabels = {
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "boolean",
            },
            returnDependencies: () => ({
                displayYAxisTickLabelsPrelim: {
                    dependencyType: "stateVariable",
                    variableName: "displayYAxisTickLabelsPrelim",
                },
                displayYAxisTicks: {
                    dependencyType: "stateVariable",
                    variableName: "displayYAxisTicks",
                },
            }),
            definition({ dependencyValues, usedDefault }) {
                if (usedDefault.displayYAxisTickLabelsPrelim) {
                    return {
                        setValue: {
                            displayYAxisTickLabels:
                                dependencyValues.displayYAxisTicks,
                        },
                    };
                } else {
                    return {
                        setValue: {
                            displayYAxisTickLabels:
                                dependencyValues.displayYAxisTickLabelsPrelim,
                        },
                    };
                }
            },
        };

        stateVariableDefinitions.xMin = {
            stateVariablesDeterminingDependencies: [
                "identicalAxisScales",
                "aspectRatioFromAxisScales",
            ],
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnRoundingAttributeComponentShadowing(),
            },
            forRenderer: true,
            returnDependencies({ stateValues }) {
                let dependencies = {
                    identicalAxisScales: {
                        dependencyType: "stateVariable",
                        variableName: "identicalAxisScales",
                    },
                    aspectRatioFromAxisScales: {
                        dependencyType: "stateVariable",
                        variableName: "aspectRatioFromAxisScales",
                    },
                    xminPrelim: {
                        dependencyType: "stateVariable",
                        variableName: "xminPrelim",
                    },
                    graphParentXmin: {
                        dependencyType: "parentStateVariable",
                        parentComponentType: "graph",
                        variableName: "xMin",
                    },
                };

                if (
                    stateValues.identicalAxisScales &&
                    !stateValues.aspectRatioFromAxisScales
                ) {
                    dependencies.xmaxPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "xmaxPrelim",
                    };
                    dependencies.yminPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "yminPrelim",
                    };
                    dependencies.ymaxPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "ymaxPrelim",
                    };
                    dependencies.aspectRatio = {
                        dependencyType: "stateVariable",
                        variableName: "aspectRatio",
                    };
                }
                return dependencies;
            },
            definition({ dependencyValues, usedDefault }) {
                if (dependencyValues.graphParentXmin !== null) {
                    return {
                        setValue: { xMin: dependencyValues.graphParentXmin },
                    };
                }
                if (
                    !dependencyValues.identicalAxisScales ||
                    dependencyValues.aspectRatioFromAxisScales
                ) {
                    return { setValue: { xMin: dependencyValues.xminPrelim } };
                }

                let xminSpecified = !usedDefault.xminPrelim;

                // always use xMin if specified
                if (xminSpecified) {
                    return { setValue: { xMin: dependencyValues.xminPrelim } };
                }

                let xmaxSpecified = !usedDefault.xmaxPrelim;
                let yminSpecified = !usedDefault.yminPrelim;
                let ymaxSpecified = !usedDefault.ymaxPrelim;

                let yscaleSpecified = yminSpecified && ymaxSpecified;

                if (yscaleSpecified) {
                    let aspectRatio = dependencyValues.aspectRatio;
                    let yscaleAdjusted =
                        (dependencyValues.ymaxPrelim -
                            dependencyValues.yminPrelim) *
                        aspectRatio;
                    if (xmaxSpecified) {
                        return {
                            setValue: {
                                xMin:
                                    dependencyValues.xmaxPrelim -
                                    yscaleAdjusted,
                            },
                        };
                    } else {
                        return { setValue: { xMin: -yscaleAdjusted / 2 } };
                    }
                } else {
                    if (xmaxSpecified) {
                        // use the default xscale of 20
                        return {
                            setValue: {
                                xMin: dependencyValues.xmaxPrelim - 20,
                            },
                        };
                    } else {
                        // use the default value of xMin
                        return { setValue: { xMin: -10 } };
                    }
                }
            },
            markStale: () => ({ updateDescendantRenderers: true }),
            async inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
                stateValues,
            }) {
                if (dependencyValues.graphParentXmin !== null) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "graphParentXmin",
                                desiredValue: desiredStateVariableValues.xMin,
                            },
                        ],
                    };
                }
                if (await stateValues.fixAxes) {
                    return { success: false };
                }
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "xminPrelim",
                            desiredValue: desiredStateVariableValues.xMin,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.xMax = {
            stateVariablesDeterminingDependencies: [
                "identicalAxisScales",
                "aspectRatioFromAxisScales",
            ],
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnRoundingAttributeComponentShadowing(),
            },
            forRenderer: true,
            returnDependencies({ stateValues }) {
                let dependencies = {
                    identicalAxisScales: {
                        dependencyType: "stateVariable",
                        variableName: "identicalAxisScales",
                    },
                    aspectRatioFromAxisScales: {
                        dependencyType: "stateVariable",
                        variableName: "aspectRatioFromAxisScales",
                    },
                    xmaxPrelim: {
                        dependencyType: "stateVariable",
                        variableName: "xmaxPrelim",
                    },
                    graphParentXmax: {
                        dependencyType: "parentStateVariable",
                        parentComponentType: "graph",
                        variableName: "xMax",
                    },
                };

                if (
                    stateValues.identicalAxisScales &&
                    !stateValues.aspectRatioFromAxisScales
                ) {
                    dependencies.xminPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "xminPrelim",
                    };
                    dependencies.yminPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "yminPrelim",
                    };
                    dependencies.ymaxPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "ymaxPrelim",
                    };
                    dependencies.aspectRatio = {
                        dependencyType: "stateVariable",
                        variableName: "aspectRatio",
                    };
                }
                return dependencies;
            },
            definition({ dependencyValues, usedDefault }) {
                if (dependencyValues.graphParentXmax !== null) {
                    return {
                        setValue: { xMax: dependencyValues.graphParentXmax },
                    };
                }
                if (
                    !dependencyValues.identicalAxisScales ||
                    dependencyValues.aspectRatioFromAxisScales
                ) {
                    return { setValue: { xMax: dependencyValues.xmaxPrelim } };
                }

                let xminSpecified = !usedDefault.xminPrelim;
                let xmaxSpecified = !usedDefault.xmaxPrelim;
                let yminSpecified = !usedDefault.yminPrelim;
                let ymaxSpecified = !usedDefault.ymaxPrelim;

                let yscaleSpecified = yminSpecified && ymaxSpecified;
                let xscaleSpecified = xminSpecified && xmaxSpecified;

                let xMin = dependencyValues.xminPrelim;

                if (yscaleSpecified) {
                    let aspectRatio = dependencyValues.aspectRatio;
                    let yscaleAdjusted =
                        (dependencyValues.ymaxPrelim -
                            dependencyValues.yminPrelim) *
                        aspectRatio;

                    if (xscaleSpecified) {
                        let xscale = dependencyValues.xmaxPrelim - xMin;
                        let maxScale = Math.max(xscale, yscaleAdjusted);

                        return { setValue: { xMax: xMin + maxScale } };
                    } else {
                        if (xminSpecified) {
                            return {
                                setValue: { xMax: xMin + yscaleAdjusted },
                            };
                        } else if (xmaxSpecified) {
                            return {
                                setValue: { xMax: dependencyValues.xmaxPrelim },
                            };
                        } else {
                            return { setValue: { xMax: yscaleAdjusted / 2 } };
                        }
                    }
                } else {
                    // no yscale specified
                    if (xmaxSpecified) {
                        return {
                            setValue: { xMax: dependencyValues.xmaxPrelim },
                        };
                    } else if (xminSpecified) {
                        // use the default xscale of 20
                        return { setValue: { xMax: xMin + 20 } };
                    } else {
                        // use the default xMax
                        return { setValue: { xMax: 10 } };
                    }
                }
            },
            markStale: () => ({ updateDescendantRenderers: true }),
            async inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
                stateValues,
            }) {
                if (dependencyValues.graphParentXmax !== null) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "graphParentXmax",
                                desiredValue: desiredStateVariableValues.xMax,
                            },
                        ],
                    };
                }
                if (await stateValues.fixAxes) {
                    return { success: false };
                }
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "xmaxPrelim",
                            desiredValue: desiredStateVariableValues.xMax,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.yMin = {
            stateVariablesDeterminingDependencies: [
                "identicalAxisScales",
                "aspectRatioFromAxisScales",
            ],
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnRoundingAttributeComponentShadowing(),
            },
            forRenderer: true,
            returnDependencies({ stateValues }) {
                let dependencies = {
                    identicalAxisScales: {
                        dependencyType: "stateVariable",
                        variableName: "identicalAxisScales",
                    },
                    aspectRatioFromAxisScales: {
                        dependencyType: "stateVariable",
                        variableName: "aspectRatioFromAxisScales",
                    },
                    yminPrelim: {
                        dependencyType: "stateVariable",
                        variableName: "yminPrelim",
                    },
                    graphParentYmin: {
                        dependencyType: "parentStateVariable",
                        parentComponentType: "graph",
                        variableName: "yMin",
                    },
                };

                if (
                    stateValues.identicalAxisScales &&
                    !stateValues.aspectRatioFromAxisScales
                ) {
                    dependencies.xmaxPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "xmaxPrelim",
                    };
                    dependencies.xminPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "xminPrelim",
                    };
                    dependencies.ymaxPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "ymaxPrelim",
                    };
                    dependencies.aspectRatio = {
                        dependencyType: "stateVariable",
                        variableName: "aspectRatio",
                    };
                }
                return dependencies;
            },
            definition({ dependencyValues, usedDefault }) {
                if (dependencyValues.graphParentYmin !== null) {
                    return {
                        setValue: { yMin: dependencyValues.graphParentYmin },
                    };
                }
                if (
                    !dependencyValues.identicalAxisScales ||
                    dependencyValues.aspectRatioFromAxisScales
                ) {
                    return { setValue: { yMin: dependencyValues.yminPrelim } };
                }

                let yminSpecified = !usedDefault.yminPrelim;

                // always use yMin if specified
                if (yminSpecified) {
                    return { setValue: { yMin: dependencyValues.yminPrelim } };
                }

                let ymaxSpecified = !usedDefault.ymaxPrelim;
                let xminSpecified = !usedDefault.xminPrelim;
                let xmaxSpecified = !usedDefault.xmaxPrelim;

                let xscaleSpecified = xminSpecified && xmaxSpecified;
                let aspectRatio = dependencyValues.aspectRatio;

                if (xscaleSpecified) {
                    let xscaleAdjusted =
                        (dependencyValues.xmaxPrelim -
                            dependencyValues.xminPrelim) /
                        aspectRatio;
                    if (ymaxSpecified) {
                        return {
                            setValue: {
                                yMin:
                                    dependencyValues.ymaxPrelim -
                                    xscaleAdjusted,
                            },
                        };
                    } else {
                        return { setValue: { yMin: -xscaleAdjusted / 2 } };
                    }
                } else {
                    if (ymaxSpecified) {
                        // use the default xscale of 20, adjusted for aspect ratio
                        return {
                            setValue: {
                                yMin:
                                    dependencyValues.ymaxPrelim -
                                    20 / aspectRatio,
                            },
                        };
                    } else {
                        // use the default value of yMin, adjusted for aspect ration
                        return { setValue: { yMin: -10 / aspectRatio } };
                    }
                }
            },
            markStale: () => ({ updateDescendantRenderers: true }),
            async inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
                stateValues,
            }) {
                if (dependencyValues.graphParentYmin !== null) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "graphParentYmin",
                                desiredValue: desiredStateVariableValues.yMin,
                            },
                        ],
                    };
                }
                if (await stateValues.fixAxes) {
                    return { success: false };
                }
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "yminPrelim",
                            desiredValue: desiredStateVariableValues.yMin,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.yMax = {
            stateVariablesDeterminingDependencies: [
                "identicalAxisScales",
                "aspectRatioFromAxisScales",
            ],
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnRoundingAttributeComponentShadowing(),
            },
            forRenderer: true,
            returnDependencies({ stateValues }) {
                let dependencies = {
                    identicalAxisScales: {
                        dependencyType: "stateVariable",
                        variableName: "identicalAxisScales",
                    },
                    aspectRatioFromAxisScales: {
                        dependencyType: "stateVariable",
                        variableName: "aspectRatioFromAxisScales",
                    },
                    ymaxPrelim: {
                        dependencyType: "stateVariable",
                        variableName: "ymaxPrelim",
                    },
                    graphParentYmax: {
                        dependencyType: "parentStateVariable",
                        parentComponentType: "graph",
                        variableName: "yMax",
                    },
                };

                if (
                    stateValues.identicalAxisScales &&
                    !stateValues.aspectRatioFromAxisScales
                ) {
                    dependencies.xminPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "xminPrelim",
                    };
                    dependencies.yminPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "yminPrelim",
                    };
                    dependencies.xmaxPrelim = {
                        dependencyType: "stateVariable",
                        variableName: "xmaxPrelim",
                    };
                    dependencies.aspectRatio = {
                        dependencyType: "stateVariable",
                        variableName: "aspectRatio",
                    };
                }
                return dependencies;
            },
            definition({ dependencyValues, usedDefault }) {
                if (dependencyValues.graphParentYmax !== null) {
                    return {
                        setValue: { yMax: dependencyValues.graphParentYmax },
                    };
                }
                if (
                    !dependencyValues.identicalAxisScales ||
                    dependencyValues.aspectRatioFromAxisScales
                ) {
                    return { setValue: { yMax: dependencyValues.ymaxPrelim } };
                }

                let xminSpecified = !usedDefault.xminPrelim;
                let xmaxSpecified = !usedDefault.xmaxPrelim;
                let yminSpecified = !usedDefault.yminPrelim;
                let ymaxSpecified = !usedDefault.ymaxPrelim;

                let yscaleSpecified = yminSpecified && ymaxSpecified;
                let xscaleSpecified = xminSpecified && xmaxSpecified;

                let yMin = dependencyValues.yminPrelim;

                let aspectRatio = dependencyValues.aspectRatio;

                if (xscaleSpecified) {
                    let xscaleAdjusted =
                        (dependencyValues.xmaxPrelim -
                            dependencyValues.xminPrelim) /
                        aspectRatio;

                    if (yscaleSpecified) {
                        let yscale = dependencyValues.ymaxPrelim - yMin;
                        let maxScale = Math.max(yscale, xscaleAdjusted);

                        return { setValue: { yMax: yMin + maxScale } };
                    } else {
                        if (yminSpecified) {
                            return {
                                setValue: { yMax: yMin + xscaleAdjusted },
                            };
                        } else if (ymaxSpecified) {
                            return {
                                setValue: { yMax: dependencyValues.ymaxPrelim },
                            };
                        } else {
                            return { setValue: { yMax: xscaleAdjusted / 2 } };
                        }
                    }
                } else {
                    // no xscale specified
                    if (ymaxSpecified) {
                        return {
                            setValue: { yMax: dependencyValues.ymaxPrelim },
                        };
                    } else if (yminSpecified) {
                        // use the default yscale of 20, adjusted for aspect ratio
                        return { setValue: { yMax: yMin + 20 / aspectRatio } };
                    } else {
                        // use the default yMax, adjusted for aspect ratio
                        return { setValue: { yMax: 10 / aspectRatio } };
                    }
                }
            },
            markStale: () => ({ updateDescendantRenderers: true }),
            async inverseDefinition({
                desiredStateVariableValues,
                dependencyValues,
                stateValues,
            }) {
                if (dependencyValues.graphParentYmax !== null) {
                    return {
                        success: true,
                        instructions: [
                            {
                                setDependency: "graphParentYmax",
                                desiredValue: desiredStateVariableValues.yMax,
                            },
                        ],
                    };
                }
                if (await stateValues.fixAxes) {
                    return { success: false };
                }
                return {
                    success: true,
                    instructions: [
                        {
                            setDependency: "ymaxPrelim",
                            desiredValue: desiredStateVariableValues.yMax,
                        },
                    ],
                };
            },
        };

        stateVariableDefinitions.boundingbox = {
            forRenderer: true,
            returnDependencies: () => ({
                xMin: {
                    dependencyType: "stateVariable",
                    variableName: "xMin",
                },
                xMax: {
                    dependencyType: "stateVariable",
                    variableName: "xMax",
                },
                yMin: {
                    dependencyType: "stateVariable",
                    variableName: "yMin",
                },
                yMax: {
                    dependencyType: "stateVariable",
                    variableName: "yMax",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        boundingbox: [
                            dependencyValues.xMin,
                            dependencyValues.yMax,
                            dependencyValues.xMax,
                            dependencyValues.yMin,
                        ],
                    },
                };
            },
        };

        stateVariableDefinitions.xscale = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnRoundingAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                xMin: {
                    dependencyType: "stateVariable",
                    variableName: "xMin",
                },
                xMax: {
                    dependencyType: "stateVariable",
                    variableName: "xMax",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        xscale: dependencyValues.xMax - dependencyValues.xMin,
                    },
                };
            },
        };

        stateVariableDefinitions.yscale = {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "number",
                addAttributeComponentsShadowingStateVariables:
                    returnRoundingAttributeComponentShadowing(),
            },
            returnDependencies: () => ({
                yMin: {
                    dependencyType: "stateVariable",
                    variableName: "yMin",
                },
                yMax: {
                    dependencyType: "stateVariable",
                    variableName: "yMax",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        yscale: dependencyValues.yMax - dependencyValues.yMin,
                    },
                };
            },
        };

        stateVariableDefinitions.gridAttrCompName = {
            returnDependencies: () => ({
                gridAttr: {
                    dependencyType: "attributeComponent",
                    attributeName: "grid",
                },
            }),
            definition({ dependencyValues }) {
                if (dependencyValues.gridAttr) {
                    return {
                        setValue: {
                            gridAttrCompName:
                                dependencyValues.gridAttr.componentIdx,
                        },
                    };
                } else {
                    return { setValue: { gridAttrCompName: null } };
                }
            },
        };

        stateVariableDefinitions.gridAttrCompChildren = {
            stateVariablesDeterminingDependencies: ["gridAttrCompName"],
            returnDependencies: ({ stateValues }) => {
                if (stateValues.gridAttrCompName) {
                    return {
                        gridAttrCompChildren: {
                            dependencyType: "child",
                            parentIdx: stateValues.gridAttrCompName,
                            childGroups: ["textLike"],
                            variableNames: ["value"],
                        },
                    };
                } else {
                    return {};
                }
            },
            definition({ dependencyValues }) {
                if (dependencyValues.gridAttrCompChildren) {
                    return {
                        setValue: {
                            gridAttrCompChildren:
                                dependencyValues.gridAttrCompChildren,
                        },
                    };
                } else {
                    return { setValue: { gridAttrCompChildren: null } };
                }
            },
        };

        stateVariableDefinitions.grid = {
            public: true,
            shadowingInstructions: {
                hasVariableComponentType: true,
                addAttributeComponentsShadowingStateVariables:
                    returnRoundingAttributeComponentShadowing(),
            },
            forRenderer: true,
            stateVariablesDeterminingDependencies: ["gridAttrCompChildren"],
            returnDependencies({ stateValues }) {
                if (stateValues.gridAttrCompChildren) {
                    let dependencies = {
                        gridAttrCompChildren: {
                            dependencyType: "stateVariable",
                            variableName: "gridAttrCompChildren",
                        },
                        gridAttr: {
                            dependencyType: "attributeComponent",
                            attributeName: "grid",
                            variableNames: ["value"],
                        },
                    };

                    for (let [
                        ind,
                        child,
                    ] of stateValues.gridAttrCompChildren.entries()) {
                        dependencies["childAdapter" + ind] = {
                            dependencyType: "adapterSourceStateVariable",
                            componentIdx: child.componentIdx,
                            variableName: "value",
                        };
                    }

                    return dependencies;
                } else {
                    return {};
                }
            },
            definition({ dependencyValues }) {
                if (!dependencyValues.gridAttrCompChildren) {
                    return {
                        setValue: { grid: "none" },
                        setCreateComponentOfType: { grid: "text" },
                    };
                }

                let grid = dependencyValues.gridAttr.stateValues.value
                    .toLowerCase()
                    .trim();
                if (grid === "true") {
                    grid = "medium";
                } else if (grid === "false") {
                    grid = "none";
                }
                if (["medium", "dense", "none"].includes(grid)) {
                    return {
                        setValue: { grid },
                        setCreateComponentOfType: { grid: "text" },
                    };
                }

                // group the children separated by spaces contained in string children

                let groupedChildren = [];
                let pieces = [];

                for (let child of dependencyValues.gridAttrCompChildren) {
                    if (typeof child !== "string") {
                        pieces.push(child);
                    } else {
                        let stringPieces = child.split(/\s+/);
                        let s0 = stringPieces[0];

                        if (s0 === "") {
                            // started with a space
                            if (pieces.length > 0) {
                                groupedChildren.push(pieces);
                                pieces = [];
                            }
                        } else {
                            pieces.push(s0);
                        }

                        for (let s of stringPieces.slice(1)) {
                            // if have more than one piece, must have had a space in between pieces
                            if (pieces.length > 0) {
                                groupedChildren.push(pieces);
                                pieces = [];
                            }
                            if (s !== "") {
                                pieces.push(s);
                            }
                        }
                    }
                }

                if (pieces.length > 0) {
                    groupedChildren.push(pieces);
                }

                if (groupedChildren.length < 2) {
                    // if don't have at least two pieces separated by spaces, it isn't valid
                    return {
                        setValue: { grid: "none" },
                        setCreateComponentOfType: { grid: "text" },
                    };
                }

                grid = [];

                for (let group of groupedChildren) {
                    // each of the two grouped children must represent a positive number
                    if (group.length === 1) {
                        let child = group[0];
                        if (typeof child === "string") {
                            let num = me.fromText(child).evaluate_to_constant();
                            if (num > 0) {
                                grid.push(num);
                            } else {
                                return {
                                    setValue: { grid: "none" },
                                    setCreateComponentOfType: { grid: "text" },
                                };
                            }
                        } else {
                            // have a single non-string child.  See if it was adapted from number/math
                            let childInd =
                                dependencyValues.gridAttrCompChildren.indexOf(
                                    child,
                                );

                            let num =
                                dependencyValues["childAdapter" + childInd];
                            if (num instanceof me.class) {
                                num = num.evaluate_to_constant();
                            }

                            if (num > 0) {
                                grid.push(num);
                            } else {
                                return {
                                    setValue: { grid: "none" },
                                    setCreateComponentOfType: { grid: "text" },
                                };
                            }
                        }
                    } else {
                        // have a group of multiple children
                        // multiply them together
                        let num = 1;
                        for (let piece of group) {
                            if (typeof piece === "string") {
                                num *= me
                                    .fromText(piece)
                                    .evaluate_to_constant();
                            } else {
                                let childInd =
                                    dependencyValues.gridAttrCompChildren.indexOf(
                                        piece,
                                    );

                                let factor =
                                    dependencyValues["childAdapter" + childInd];
                                if (factor instanceof me.class) {
                                    factor = factor.evaluate_to_constant();
                                }
                                num *= factor;
                            }
                        }

                        if (num > 0) {
                            grid.push(num);
                        } else {
                            return {
                                setValue: { grid: "none" },
                                setCreateComponentOfType: { grid: "text" },
                            };
                        }
                    }
                }

                return {
                    setValue: { grid },
                    setCreateComponentOfType: { grid: "numberList" },
                };
            },
        };

        return stateVariableDefinitions;
    }

    async changeAxisLimits({
        xMin,
        xMax,
        yMin,
        yMax,
        actionId,
        sourceInformation = {},
        skipRendererUpdate = false,
    }) {
        let updateInstructions = [];

        if (xMin !== undefined) {
            updateInstructions.push({
                updateType: "updateValue",
                componentIdx: this.componentIdx,
                stateVariable: "xMin",
                value: xMin,
            });
        }
        if (xMax !== undefined) {
            updateInstructions.push({
                updateType: "updateValue",
                componentIdx: this.componentIdx,
                stateVariable: "xMax",
                value: xMax,
            });
        }
        if (yMin !== undefined) {
            updateInstructions.push({
                updateType: "updateValue",
                componentIdx: this.componentIdx,
                stateVariable: "yMin",
                value: yMin,
            });
        }
        if (yMax !== undefined) {
            updateInstructions.push({
                updateType: "updateValue",
                componentIdx: this.componentIdx,
                stateVariable: "yMax",
                value: yMax,
            });
        }

        return await this.coreFunctions.performUpdate({
            updateInstructions,
            actionId,
            sourceInformation,
            skipRendererUpdate,
            event: {
                verb: "interacted",
                object: {
                    componentIdx: this.componentIdx,
                    componentType: this.componentType,
                },
                result: {
                    xMin,
                    xMax,
                    yMin,
                    yMax,
                },
            },
        });
    }

    async addChildren(args) {
        const dynamicChildren = this.definingChildren.findLast(
            (child) => child.componentType === "_dynamicChildren",
        );

        return await dynamicChildren.addChildren(args);
    }

    async deleteChildren(args) {
        const dynamicChildren = this.definingChildren.findLast(
            (child) => child.componentType === "_dynamicChildren",
        );

        return await dynamicChildren.deleteChildren(args);
    }

    recordVisibilityChange({ isVisible }) {
        this.coreFunctions.requestRecordEvent({
            verb: "visibilityChanged",
            object: {
                componentIdx: this.componentIdx,
                componentType: this.componentType,
            },
            result: { isVisible },
        });
    }
}
