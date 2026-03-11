import { createPrefigureXML } from "./graph";
import { sortDescendantsByOrder } from "./common";

// PreFigure conversion architecture and extension guide:
// see src/utils/prefigure/README.md

const GRAPHICAL_DESCENDANT_CONFIGS = [
    {
        key: "pointDescendants",
        componentType: "point",
        variableNames: [
            "numericalXs",
            "selectedStyle",
            "label",
            "labelHasLatex",
            "labelPosition",
        ],
    },
    {
        key: "lineDescendants",
        componentType: "line",
        variableNames: [
            "numericalPoints",
            "selectedStyle",
            "label",
            "labelHasLatex",
            "labelPosition",
        ],
    },
    {
        key: "lineSegmentDescendants",
        componentType: "lineSegment",
        variableNames: [
            "numericalEndpoints",
            "selectedStyle",
            "label",
            "labelHasLatex",
            "labelPosition",
        ],
    },
    {
        key: "rayDescendants",
        componentType: "ray",
        variableNames: [
            "numericalEndpoint",
            "numericalThroughpoint",
            "selectedStyle",
            "label",
            "labelHasLatex",
        ],
    },
    {
        key: "vectorDescendants",
        componentType: "vector",
        variableNames: ["numericalEndpoints", "selectedStyle"],
    },
    {
        key: "circleDescendants",
        componentType: "circle",
        variableNames: ["numericalCenter", "numericalRadius", "selectedStyle"],
    },
    {
        key: "polylineDescendants",
        componentType: "polyline",
        variableNames: ["numericalVertices", "selectedStyle"],
    },
    {
        key: "polygonDescendants",
        componentType: "polygon",
        variableNames: ["numericalVertices", "selectedStyle"],
    },
];

function descendantDependency({ componentType, variableNames }) {
    return {
        dependencyType: "descendant",
        componentTypes: [componentType],
        variableNames,
    };
}

function prefigureBaseDependencies() {
    return {
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
        xLabel: {
            dependencyType: "stateVariable",
            variableName: "xLabel",
        },
        xLabelHasLatex: {
            dependencyType: "stateVariable",
            variableName: "xLabelHasLatex",
        },
        xLabelPosition: {
            dependencyType: "stateVariable",
            variableName: "xLabelPosition",
        },
        yLabel: {
            dependencyType: "stateVariable",
            variableName: "yLabel",
        },
        yLabelHasLatex: {
            dependencyType: "stateVariable",
            variableName: "yLabelHasLatex",
        },
        yLabelPosition: {
            dependencyType: "stateVariable",
            variableName: "yLabelPosition",
        },
    };
}

function prefigureDescendantDependencies() {
    return Object.fromEntries(
        GRAPHICAL_DESCENDANT_CONFIGS.map((config) => [
            config.key,
            descendantDependency(config),
        ]),
    );
}

function collectConfiguredDescendants(dependencyValues) {
    return GRAPHICAL_DESCENDANT_CONFIGS.flatMap(
        (config) => dependencyValues[config.key] ?? [],
    );
}

/**
 * Returns the `prefigureXML` state-variable definition used by `Graph`.
 *
 * This builder keeps dependency wiring and conversion orchestration outside
 * of `Graph.js`, while preserving conversion behavior in utility modules.
 */
export function returnGraphPrefigureXMLStateVariableDefinition() {
    return {
        public: true,
        forRenderer: true,
        shadowingInstructions: {
            createComponentOfType: "text",
        },
        returnDependencies: () => ({
            ...prefigureBaseDependencies(),
            ...prefigureDescendantDependencies(),
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

            const descendants = collectConfiguredDescendants(dependencyValues);
            descendants.sort(sortDescendantsByOrder);

            const handledDescendantIndices = new Set(
                descendants.map((x) => x.componentIdx),
            );

            const unsupported = (
                dependencyValues.allGraphicalDescendants ?? []
            ).filter((x) => !handledDescendantIndices.has(x.componentIdx));

            unsupported.sort(sortDescendantsByOrder);

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
}
