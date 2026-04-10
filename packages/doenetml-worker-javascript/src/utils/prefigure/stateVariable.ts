import { createPrefigureXML } from "./graph";
import { sortDescendantsByOrder } from "./common";
import type { Descendant, GraphDependencyValues } from "./types";

interface DescendantDependency {
    dependencyType: "descendant";
    componentTypes: string[];
    variableNames: string[];
    variablesOptional?: boolean;
}

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
            "hidden",
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
            "hidden",
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
            "hidden",
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
            "hidden",
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
            "hidden",
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
            "hidden",
        ],
    },
    {
        key: "curveDescendants",
        componentType: "curve",
        variableNames: [
            "curveType",
            "fDefinitions",
            "parMin",
            "parMax",
            "flipFunction",
            "numericalThroughPoints",
            "periodic",
            "extrapolateBackward",
            "extrapolateForward",
            "selectedStyle",
            "label",
            "labelHasLatex",
            "hidden",
        ],
        variablesOptional: true,
    },
    {
        key: "circleDescendants",
        componentType: "circle",
        variableNames: [
            "numericalCenter",
            "numericalRadius",
            "selectedStyle",
            "filled",
            "hidden",
        ],
    },
    {
        key: "polylineDescendants",
        componentType: "polyline",
        variableNames: ["numericalVertices", "selectedStyle", "hidden"],
    },
    {
        key: "polygonDescendants",
        componentType: "polygon",
        variableNames: [
            "numericalVertices",
            "selectedStyle",
            "filled",
            "hidden",
        ],
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
}: {
    componentType: string;
    variableNames: string[];
    variablesOptional?: boolean;
}): DescendantDependency {
    const dependency: DescendantDependency = {
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

function prefigureDescendantDependencies(): Record<string, unknown> {
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
function collectConfiguredDescendants(
    dependencyValues: GraphDependencyValues,
): Descendant[] {
    const byComponentIdx = new Map<number, Descendant>();

    for (const config of GRAPHICAL_DESCENDANT_CONFIGS) {
        for (const descendant of (dependencyValues[config.key] as
            | Descendant[]
            | undefined) ?? []) {
            if (!Number.isFinite(descendant.componentIdx)) {
                continue;
            }
            byComponentIdx.set(descendant.componentIdx as number, descendant);
        }
    }

    return [...byComponentIdx.values()].filter((descendant) => {
        if (descendant.componentType !== "vector") {
            return true;
        }

        const componentName = descendant.componentName?.toLowerCase() ?? "";

        // Bezier control vectors are implementation details of curve editing
        // and should not be rendered as standalone vectors in PreFigure.
        return (
            !componentName.includes("beziercontrols") &&
            !componentName.includes("controlvectors")
        );
    });
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
            annotationsChildren: {
                dependencyType: "child",
                childGroups: ["annotations"],
                variableNames: ["annotationSubtrees"],
            },
            allGraphicalDescendants: {
                dependencyType: "descendant",
                componentTypes: ["_graphical"],
            },
            allDescendants: {
                dependencyType: "descendant",
                componentTypes: ["_base"],
            },
        }),
        definition({
            dependencyValues,
            componentIdx,
        }: {
            dependencyValues: GraphDependencyValues;
            componentIdx: number;
        }) {
            // If not rendering with PreFigure and have annotations, emit an
            // info diagnostic that annotations won't be rendered.
            if (dependencyValues.effectiveRenderer !== "prefigure") {
                const diagnostics = [];
                if (
                    dependencyValues.annotationsChildren &&
                    dependencyValues.annotationsChildren.length > 0
                ) {
                    diagnostics.push({
                        type: "info",
                        message:
                            "`<graph>`: annotations will not be rendered when not using the PreFigure renderer.",
                    });
                }
                return {
                    setValue: { prefigureXML: null },
                    sendDiagnostics: diagnostics,
                };
            }

            if (dependencyValues.haveGraphParent) {
                return { setValue: { prefigureXML: null } };
            }

            const descendants = collectConfiguredDescendants(dependencyValues);
            descendants.sort(sortDescendantsByOrder);

            const handledDescendantIndices = new Set(
                descendants
                    .map((x) => x.componentIdx)
                    .filter((x): x is number => Number.isFinite(x)),
            );

            const unsupported = (
                dependencyValues.allGraphicalDescendants ?? []
            ).filter(
                (x) =>
                    Number.isFinite(x.componentIdx) &&
                    !handledDescendantIndices.has(x.componentIdx as number),
            );

            unsupported.sort(sortDescendantsByOrder);

            const selectedAnnotationsChild =
                dependencyValues.annotationsChildren?.[
                    dependencyValues.annotationsChildren.length - 1
                ];

            const annotations =
                selectedAnnotationsChild?.stateValues?.annotationSubtrees ??
                null;

            const { xml, diagnostics } = createPrefigureXML({
                dependencyValues,
                descendants,
                unsupported,
                annotations,
                graphComponentIdx: componentIdx,
            });

            if (
                dependencyValues.annotationsChildren &&
                dependencyValues.annotationsChildren.length > 1
            ) {
                const secondToLastAnnotationsChild =
                    dependencyValues.annotationsChildren[
                        dependencyValues.annotationsChildren.length - 2
                    ];

                diagnostics.push({
                    type: "info",
                    message:
                        "Multiple `<annotations>` children found in `<graph>`; all but the last one are ignored.",
                    position: secondToLastAnnotationsChild?.position,
                });
            }

            return {
                setValue: { prefigureXML: xml },
                sendDiagnostics: diagnostics,
            };
        },
    };
}
