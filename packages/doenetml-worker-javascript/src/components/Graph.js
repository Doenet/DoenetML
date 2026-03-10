import BlockComponent from "./abstract/BlockComponent";
import me from "math-expressions";
import {
    accessibilityWarningsResult,
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

const prefigureDashByLineStyle = {
    solid: null,
    dashed: "dashed",
    dotted: "dotted",
};

function escapeXml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
}

function asFiniteNumber(value) {
    return Number.isFinite(value) ? Number(value) : null;
}

function formatNumber(value) {
    const num = asFiniteNumber(value);
    return num === null ? null : `${num}`;
}

function formatPoint(point) {
    if (!Array.isArray(point) || point.length < 2) {
        return null;
    }

    const x = formatNumber(point[0]);
    const y = formatNumber(point[1]);

    if (x === null || y === null) {
        return null;
    }

    return `(${x},${y})`;
}

function sanitizeHandle(value) {
    return String(value)
        .toLowerCase()
        .replaceAll(/[^a-z0-9_-]+/g, "-")
        .replaceAll(/-+/g, "-")
        .replaceAll(/^-|-$/g, "");
}

function createStableHandle(descendant, index, usedHandles) {
    const stem = sanitizeHandle(
        `${descendant.componentType}-${descendant.componentName ?? index}`,
    );
    let handle = stem || `graphical-${index}`;
    let suffix = 1;
    while (usedHandles.has(handle)) {
        suffix += 1;
        handle = `${stem}-${suffix}`;
    }
    usedHandles.add(handle);
    return handle;
}

function warningMessageForDescendant(descendant) {
    if (descendant?.componentName) {
        return `<${descendant.componentType}> (${descendant.componentName})`;
    }
    return `<${descendant?.componentType ?? "unknown"}>`;
}

function styleAttributes({ selectedStyle, warnings, warningPrefix }) {
    const attrs = [];

    const stroke = selectedStyle?.lineColor ?? selectedStyle?.lineColorWord;
    if (stroke) {
        attrs.push(`stroke="${escapeXml(stroke)}"`);
    }

    const thickness = formatNumber(selectedStyle?.lineWidth);
    if (thickness !== null) {
        attrs.push(`thickness="${escapeXml(thickness)}"`);
    }

    const fill = selectedStyle?.fillColor ?? selectedStyle?.fillColorWord;
    if (fill) {
        attrs.push(`fill="${escapeXml(fill)}"`);
    }

    const lineOpacity = formatNumber(selectedStyle?.lineOpacity);
    if (lineOpacity !== null) {
        attrs.push(`stroke-opacity="${escapeXml(lineOpacity)}"`);
    }

    const fillOpacity = formatNumber(selectedStyle?.fillOpacity);
    if (fillOpacity !== null) {
        attrs.push(`fill-opacity="${escapeXml(fillOpacity)}"`);
    }

    const lineStyle = selectedStyle?.lineStyle;
    if (lineStyle) {
        const dash = prefigureDashByLineStyle[lineStyle];
        if (dash) {
            attrs.push(`dash="${escapeXml(dash)}"`);
        } else if (!(lineStyle in prefigureDashByLineStyle)) {
            warnings.push({
                type: "warning",
                level: 1,
                message: `${warningPrefix}: unknown line style '${lineStyle}' omitted from PreFigure output.`,
            });
        }
    }

    return attrs;
}

function convertGraphicalDescendantToPrefigure({
    descendant,
    index,
    usedHandles,
    warnings,
}) {
    const sv = descendant?.stateValues ?? {};
    const warningPrefix = warningMessageForDescendant(descendant);
    const handle = createStableHandle(descendant, index, usedHandles);
    const styleAttrs = styleAttributes({
        selectedStyle: sv.selectedStyle,
        warnings,
        warningPrefix,
    });

    let body = null;

    if (descendant.componentType === "point") {
        const p = formatPoint(sv.numericalXs);
        if (p !== null) {
            body = `<point id="${escapeXml(handle)}" p="${escapeXml(p)}" ${styleAttrs.join(" ")} />`;
        }
    } else if (descendant.componentType === "line") {
        const p1 = formatPoint(sv.numericalPoints?.[0]);
        const p2 = formatPoint(sv.numericalPoints?.[1]);
        if (p1 !== null && p2 !== null) {
            body = `<line id="${escapeXml(handle)}" endpoints="${escapeXml(`(${p1},${p2})`)}" infinite="yes" ${styleAttrs.join(" ")} />`;
        }
    } else if (descendant.componentType === "lineSegment") {
        const p1 = formatPoint(sv.numericalEndpoints?.[0]);
        const p2 = formatPoint(sv.numericalEndpoints?.[1]);
        if (p1 !== null && p2 !== null) {
            body = `<line id="${escapeXml(handle)}" endpoints="${escapeXml(`(${p1},${p2})`)}" infinite="no" ${styleAttrs.join(" ")} />`;
        }
    } else if (descendant.componentType === "ray") {
        const p1 = formatPoint(sv.numericalEndpoint);
        const p2 = formatPoint(sv.numericalThroughpoint);
        if (p1 !== null && p2 !== null) {
            body = `<line id="${escapeXml(handle)}" endpoints="${escapeXml(`(${p1},${p2})`)}" infinite="yes" ${styleAttrs.join(" ")} />`;
        }
    } else if (descendant.componentType === "vector") {
        const tail = sv.numericalEndpoints?.[0];
        const head = sv.numericalEndpoints?.[1];
        const tailText = formatPoint(tail);
        if (tailText !== null && Array.isArray(tail) && Array.isArray(head)) {
            const dx = formatNumber(head[0] - tail[0]);
            const dy = formatNumber(head[1] - tail[1]);
            if (dx !== null && dy !== null) {
                body = `<vector id="${escapeXml(handle)}" tail="${escapeXml(tailText)}" v="${escapeXml(`(${dx},${dy})`)}" ${styleAttrs.join(" ")} />`;
            }
        }
    } else if (descendant.componentType === "circle") {
        const center = formatPoint(sv.numericalCenter);
        const radius = formatNumber(sv.numericalRadius);
        if (center !== null && radius !== null) {
            body = `<circle id="${escapeXml(handle)}" center="${escapeXml(center)}" radius="${escapeXml(radius)}" ${styleAttrs.join(" ")} />`;
        }
    } else if (descendant.componentType === "polyline") {
        const points = (sv.numericalVertices ?? [])
            .map((pt) => formatPoint(pt))
            .filter((pt) => pt !== null);
        if (points.length >= 2) {
            body = `<polygon id="${escapeXml(handle)}" points="${escapeXml(`(${points.join(",")})`)}" closed="no" ${styleAttrs.join(" ")} />`;
        }
    } else if (descendant.componentType === "polygon") {
        const points = (sv.numericalVertices ?? [])
            .map((pt) => formatPoint(pt))
            .filter((pt) => pt !== null);
        if (points.length >= 3) {
            body = `<polygon id="${escapeXml(handle)}" points="${escapeXml(`(${points.join(",")})`)}" closed="yes" ${styleAttrs.join(" ")} />`;
        }
    } else {
        warnings.push({
            type: "warning",
            level: 1,
            message: `${warningPrefix}: unsupported in graph prefigure mode; descendant skipped.`,
        });
        return null;
    }

    if (!body) {
        warnings.push({
            type: "warning",
            level: 1,
            message: `${warningPrefix}: non-finite or incomplete geometry; descendant skipped.`,
        });
        return null;
    }

    return body;
}

function createPrefigureXML({ dependencyValues, descendants, unsupported }) {
    const warnings = [];
    const usedHandles = new Set();
    const elements = [];

    for (const descendant of unsupported ?? []) {
        warnings.push({
            type: "warning",
            level: 1,
            message: `${warningMessageForDescendant(descendant)}: unsupported in graph prefigure mode; descendant skipped.`,
        });
    }

    for (const [index, descendant] of (descendants ?? []).entries()) {
        const converted = convertGraphicalDescendantToPrefigure({
            descendant,
            index,
            usedHandles,
            warnings,
        });
        if (converted) {
            elements.push(converted);
        }
    }

    const xMin = formatNumber(dependencyValues.xMin);
    const yMin = formatNumber(dependencyValues.yMin);
    const xMax = formatNumber(dependencyValues.xMax);
    const yMax = formatNumber(dependencyValues.yMax);
    const width = asFiniteNumber(dependencyValues.width?.size);
    const aspectRatio = asFiniteNumber(dependencyValues.aspectRatio);

    if ([xMin, yMin, xMax, yMax].some((x) => x === null)) {
        warnings.push({
            type: "warning",
            level: 1,
            message:
                "<graph>: invalid axis bounds for prefigure conversion; using default bbox (-10,-10,10,10).",
        });
    }

    const bbox =
        [xMin, yMin, xMax, yMax].some((x) => x === null)
            ? "(-10,-10,10,10)"
            : `(${xMin},${yMin},${xMax},${yMax})`;

    let dimensionWidth = width;
    if (dimensionWidth === null || dimensionWidth <= 0) {
        warnings.push({
            type: "warning",
            level: 1,
            message:
                "<graph>: invalid width for prefigure conversion; using default diagram width 425.",
        });
        dimensionWidth = 425;
    }

    let diagramAspectRatio = aspectRatio;
    if (diagramAspectRatio === null || diagramAspectRatio <= 0) {
        warnings.push({
            type: "warning",
            level: 1,
            message:
                "<graph>: invalid aspectRatio for prefigure conversion; using default aspect ratio 1.",
        });
        diagramAspectRatio = 1;
    }

    const dimensionHeight = dimensionWidth / diagramAspectRatio;
    const widthText = formatNumber(dimensionWidth) ?? "425";
    const heightText = formatNumber(dimensionHeight) ?? "425";
    const dimensions = `(${widthText},${heightText})`;

    let axesElement = "";
    const showXAxis = Boolean(dependencyValues.displayXAxis);
    const showYAxis = Boolean(dependencyValues.displayYAxis);
    if (showXAxis && showYAxis) {
        axesElement = `<axes axes="all" />`;
    } else if (showXAxis) {
        axesElement = `<axes axes="horizontal" />`;
    } else if (showYAxis) {
        axesElement = `<axes axes="vertical" />`;
    }

    const xml = `<diagram dimensions="${escapeXml(dimensions)}"><coordinates bbox="${escapeXml(bbox)}">${axesElement}${elements.join("")}</coordinates></diagram>`;

    return { xml, warnings };
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
            forRenderer: true,
            public: true,
        };

        attributes.horizontalAlign = {
            createComponentOfType: "text",
            createStateVariable: "horizontalAlign",
            validValues: ["center", "left", "right"],
            defaultValue: "center",
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
        attributes.displayXAxisTickLabels = {
            createComponentOfType: "boolean",
            createStateVariable: "displayXAxisTickLabels",
            defaultValue: true,
            public: true,
            forRenderer: true,
        };
        attributes.displayYAxisTickLabels = {
            createComponentOfType: "boolean",
            createStateVariable: "displayYAxisTickLabels",
            defaultValue: true,
            public: true,
            forRenderer: true,
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

        attributes.mode = {
            createPrimitiveOfType: "string",
            createStateVariable: "mode",
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
                upgradeAccessibilityWarningsToErrors: {
                    dependencyType: "flag",
                    flagName: "upgradeAccessibilityWarningsToErrors",
                },
                decorative: {
                    dependencyType: "stateVariable",
                    variableName: "decorative",
                },
            }),
            definition({ dependencyValues }) {
                let shortDescription = "";
                const warnings = [];
                if (dependencyValues.shortDescriptionChild.length > 0) {
                    const shortDescriptionChild =
                        dependencyValues.shortDescriptionChild[
                            dependencyValues.shortDescriptionChild.length - 1
                        ];

                    shortDescription =
                        shortDescriptionChild.stateValues.text.trim();
                }
                if (shortDescription === "" && !dependencyValues.decorative) {
                    warnings.push({
                        level: 1,
                        message:
                            "For accessibility, <graph> must either have a short description or be specified as decorative.",
                    });
                }

                return accessibilityWarningsResult({
                    setValue: { shortDescription },
                    warnings,
                    upgradeWarningsToErrors:
                        dependencyValues.upgradeAccessibilityWarningsToErrors,
                });
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

        stateVariableDefinitions.prefigureXML = {
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                effectiveMode: {
                    dependencyType: "stateVariable",
                    variableName: "effectiveMode",
                },
                haveGraphParent: {
                    dependencyType: "stateVariable",
                    variableName: "haveGraphParent",
                },
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
                width: {
                    dependencyType: "stateVariable",
                    variableName: "width",
                },
                aspectRatio: {
                    dependencyType: "stateVariable",
                    variableName: "aspectRatio",
                },
                displayXAxis: {
                    dependencyType: "stateVariable",
                    variableName: "displayXAxis",
                },
                displayYAxis: {
                    dependencyType: "stateVariable",
                    variableName: "displayYAxis",
                },
                pointDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["point"],
                    variableNames: ["numericalXs", "selectedStyle"],
                },
                lineDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["line"],
                    variableNames: ["numericalPoints", "selectedStyle"],
                },
                lineSegmentDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["lineSegment"],
                    variableNames: ["numericalEndpoints", "selectedStyle"],
                },
                rayDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["ray"],
                    variableNames: [
                        "numericalEndpoint",
                        "numericalThroughpoint",
                        "selectedStyle",
                    ],
                },
                vectorDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["vector"],
                    variableNames: ["numericalEndpoints", "selectedStyle"],
                },
                circleDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["circle"],
                    variableNames: ["numericalCenter", "numericalRadius", "selectedStyle"],
                },
                polylineDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["polyline"],
                    variableNames: ["numericalVertices", "selectedStyle"],
                },
                polygonDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["polygon"],
                    variableNames: ["numericalVertices", "selectedStyle"],
                },
                allGraphicalDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["_graphical"],
                },
            }),
            definition({ dependencyValues }) {
                if (
                    dependencyValues.effectiveMode !== "prefigure" ||
                    dependencyValues.haveGraphParent
                ) {
                    return { setValue: { prefigureXML: null } };
                }

                const descendants = [
                    ...(dependencyValues.pointDescendants ?? []),
                    ...(dependencyValues.lineDescendants ?? []),
                    ...(dependencyValues.lineSegmentDescendants ?? []),
                    ...(dependencyValues.rayDescendants ?? []),
                    ...(dependencyValues.vectorDescendants ?? []),
                    ...(dependencyValues.circleDescendants ?? []),
                    ...(dependencyValues.polylineDescendants ?? []),
                    ...(dependencyValues.polygonDescendants ?? []),
                ];

                descendants.sort((a, b) => {
                    if (
                        Number.isFinite(a.componentIdx) &&
                        Number.isFinite(b.componentIdx)
                    ) {
                        return a.componentIdx - b.componentIdx;
                    }
                    return String(a.componentName ?? "").localeCompare(
                        String(b.componentName ?? ""),
                    );
                });

                const handledDescendantIndices = new Set(
                    descendants.map((x) => x.componentIdx),
                );

                const unsupported = (
                    dependencyValues.allGraphicalDescendants ?? []
                ).filter((x) => !handledDescendantIndices.has(x.componentIdx));

                unsupported.sort((a, b) => {
                    if (
                        Number.isFinite(a.componentIdx) &&
                        Number.isFinite(b.componentIdx)
                    ) {
                        return a.componentIdx - b.componentIdx;
                    }
                    return String(a.componentName ?? "").localeCompare(
                        String(b.componentName ?? ""),
                    );
                });

                const { xml, warnings } = createPrefigureXML({
                    dependencyValues,
                    descendants,
                    unsupported,
                });

                return {
                    setValue: { prefigureXML: xml },
                    sendWarnings: warnings,
                };
            },
        };

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

        stateVariableDefinitions.effectiveMode = {
            public: true,
            forRenderer: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                mode: {
                    dependencyType: "stateVariable",
                    variableName: "mode",
                },
                graphParentMode: {
                    dependencyType: "parentStateVariable",
                    parentComponentType: "graph",
                    variableName: "effectiveMode",
                },
            }),
            definition({ dependencyValues }) {
                return {
                    setValue: {
                        effectiveMode:
                            dependencyValues.graphParentMode ??
                            dependencyValues.mode,
                    },
                };
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
