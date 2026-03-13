import { createPrefigureXML } from "./graph";
import { sortDescendantsByOrder } from "./common";

// PreFigure conversion architecture and extension guide:
// see src/utils/prefigure/README.md

// Ordered from broader base types to narrower types where relevant.
// If a component matches multiple configs via inheritance, the later match
// wins after componentIdx dedupe in collectConfiguredDescendants().
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
            "open",
        ],
        variablesOptional: true,
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
            "labelPosition",
        ],
    },
    {
        key: "vectorDescendants",
        componentType: "vector",
        variableNames: [
            "numericalEndpoints",
            "selectedStyle",
            "label",
            "labelHasLatex",
            "labelPosition",
        ],
    },
    {
        key: "angleDescendants",
        componentType: "angle",
        variableNames: [
            "numericalPoints",
            "numericalRadius",
            "selectedStyle",
            "label",
            "labelHasLatex",
            "swapPointOrder",
        ],
    },
    {
        key: "circleDescendants",
        componentType: "circle",
        variableNames: [
            "numericalCenter",
            "numericalRadius",
            "selectedStyle",
            "filled",
        ],
    },
    {
        key: "polylineDescendants",
        componentType: "polyline",
        variableNames: ["numericalVertices", "selectedStyle"],
    },
    {
        key: "polygonDescendants",
        componentType: "polygon",
        variableNames: ["numericalVertices", "selectedStyle", "filled"],
    },
];

/**
 * Builds one descendant dependency from a compact config entry.
 *
 * `variablesOptional` is used when requesting subtype-only variables through
 * a base type (for example requesting `open` through `point` descendants).
 */
function descendantDependency({
    componentType,
    variableNames,
    variablesOptional,
}) {
    const dependency = {
        dependencyType: "descendant",
        componentTypes: [componentType],
        variableNames,
    };

    if (variablesOptional) {
        dependency.variablesOptional = true;
    }

    return dependency;
}

function prefigureBaseDependencies() {
    return {
        effectiveRenderer: {
            dependencyType: "stateVariable",
            variableName: "effectiveRenderer",
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

/**
 * Flattens configured descendant lists and deduplicates by componentIdx.
 *
 * Doenet descendant queries include inherited matches, so the same concrete
 * component can appear under multiple configs (for example polygon + polyline).
 * Keeping the last seen match lets later configs override earlier generic ones.
 */
function collectConfiguredDescendants(dependencyValues) {
    const byComponentIdx = new Map();

    for (const config of GRAPHICAL_DESCENDANT_CONFIGS) {
        for (const descendant of dependencyValues[config.key] ?? []) {
            byComponentIdx.set(descendant.componentIdx, descendant);
        }
    }

    return [...byComponentIdx.values()];
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
                dependencyValues.effectiveRenderer !== "prefigure" ||
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
