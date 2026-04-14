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

// Curve descendants are pulled into a dedicated shared state variable so the
// descendant traversal happens once and its results are reused by both
// prefigureXML and curveDescendantComponentIndices.
const CURVE_DESCENDANT_CONFIG = {
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
};

// Ordered from broader base types to narrower types where relevant.
// If a component matches multiple configs via inheritance, the later match
// wins after componentIdx dedupe in collectConfiguredDescendants().
// curveDescendants is intentionally excluded here; it is fetched once via
// the curveDescendants state variable and threaded in as a stateVariable dep.
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

/**
 * Returns the graph-level state-variable dependencies shared by prefigureXML.
 *
 * These dependencies describe graph framing and axis metadata (bounds,
 * dimensions, labels, renderer context) and are intentionally separated from
 * descendant dependencies so conversion inputs are easier to reason about.
 */
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

/**
 * Materializes configured descendant dependency entries keyed by config key.
 *
 * This function is the single place where GRAPHICAL_DESCENDANT_CONFIGS become
 * graph dependencies, which keeps descendant wiring declarative and centralized.
 * curveDescendants is excluded here and referenced via a stateVariable dep so
 * the traversal happens only once per graph.
 */
function prefigureDescendantDependencies(): Record<string, unknown> {
    return Object.fromEntries(
        GRAPHICAL_DESCENDANT_CONFIGS.map((config) => [
            config.key,
            descendantDependency(config),
        ]),
    );
}

/**
 * Single traversal for curve descendants, shared by curveDescendantComponentIndices
 * and prefigureXML via a stateVariable dependency.
 */
function returnGraphCurveDescendantsStateVariableDefinition() {
    return {
        stateVariablesDeterminingDependencies: ["effectiveRenderer"],
        returnDependencies: ({
            stateValues,
        }: {
            stateValues: GraphDependencyValues;
        }) => {
            if (stateValues.effectiveRenderer !== "prefigure") {
                return {};
            }
            return {
                curveDescendants: descendantDependency(CURVE_DESCENDANT_CONFIG),
            };
        },
        definition({
            dependencyValues,
        }: {
            dependencyValues: GraphDependencyValues;
        }) {
            return {
                setValue: {
                    curveDescendants: dependencyValues.curveDescendants ?? [],
                },
            };
        },
    };
}

/**
 * Computes a stable ordered list of curve component indices for this graph.
 *
 * Relationship to other helpers:
 * - this list is consumed by functionToCurveComponentIdx to create one adapterSource
 *   dependency per curve descendant.
 * - prefigureXML depends on functionToCurveComponentIdx (not directly on this list).
 *
 * Curve data is sourced from the shared curveDescendants state variable to
 * avoid a second descendant traversal.
 */
function returnGraphCurveDescendantComponentIndicesStateVariableDefinition() {
    return {
        returnDependencies: () => ({
            curveDescendants: {
                dependencyType: "stateVariable",
                variableName: "curveDescendants",
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: GraphDependencyValues;
        }) {
            const curveDescendantComponentIndices = (
                dependencyValues.curveDescendants ?? []
            )
                .map((x) => x.componentIdx)
                .filter((x): x is number => Number.isFinite(x));

            return { setValue: { curveDescendantComponentIndices } };
        },
    };
}

/**
 * Inverts curve adapter-source links into a function->curve alias map.
 *
 * Functions render via adapted curves in prefigure conversion. This map bridges
 * annotation refs authored against function components to the concrete rendered
 * curve handles, without changing curve conversion behavior.
 */
function returnGraphFunctionCurveAliasMapStateVariableDefinition() {
    return {
        stateVariablesDeterminingDependencies: [
            "curveDescendantComponentIndices",
        ],
        returnDependencies: ({
            stateValues,
        }: {
            stateValues: GraphDependencyValues;
        }) => {
            const dependencies: Record<string, unknown> = {
                curveDescendantComponentIndices: {
                    dependencyType: "stateVariable",
                    variableName: "curveDescendantComponentIndices",
                },
            };

            const curveDescendantComponentIndices =
                stateValues.curveDescendantComponentIndices;

            if (Array.isArray(curveDescendantComponentIndices)) {
                for (const [
                    index,
                    curveComponentIdx,
                ] of curveDescendantComponentIndices.entries()) {
                    dependencies[`curveAdapterSource${index}`] = {
                        dependencyType: "adapterSource",
                        componentIdx: curveComponentIdx,
                    };
                }
            }

            return dependencies;
        },
        definition({
            dependencyValues,
        }: {
            dependencyValues: GraphDependencyValues;
        }) {
            const functionToCurveComponentIdx: Record<number, number> = {};

            const curveDescendantComponentIndices =
                dependencyValues.curveDescendantComponentIndices;

            if (Array.isArray(curveDescendantComponentIndices)) {
                for (const [
                    index,
                    curveComponentIdx,
                ] of curveDescendantComponentIndices.entries()) {
                    const adapterSource = dependencyValues[
                        `curveAdapterSource${index}`
                    ] as Descendant | undefined;

                    if (
                        Number.isFinite(adapterSource?.componentIdx) &&
                        adapterSource?.componentType === "function"
                    ) {
                        functionToCurveComponentIdx[
                            adapterSource.componentIdx as number
                        ] = curveComponentIdx;
                    }
                }
            }

            return { setValue: { functionToCurveComponentIdx } };
        },
    };
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

    // CURVE_DESCENDANT_CONFIG is listed first so later configs can override
    // if a curve componentIdx also matches a narrower graphical type.
    for (const config of [
        CURVE_DESCENDANT_CONFIG,
        ...GRAPHICAL_DESCENDANT_CONFIGS,
    ]) {
        for (const descendant of (dependencyValues[config.key] as
            | Descendant[]
            | undefined) ?? []) {
            if (!Number.isFinite(descendant.componentIdx)) {
                continue;
            }
            byComponentIdx.set(descendant.componentIdx as number, descendant);
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
function returnGraphPrefigureXMLStateVariableDefinition() {
    return {
        public: true,
        forRenderer: true,
        stateVariablesDeterminingDependencies: ["effectiveRenderer"],
        shadowingInstructions: {
            createComponentOfType: "text",
        },
        returnDependencies: ({
            stateValues,
        }: {
            stateValues: GraphDependencyValues;
        }) => {
            const annotationsChildren = {
                annotationsChildren: {
                    dependencyType: "child",
                    childGroups: ["annotations"],
                    variableNames: ["annotationSubtrees"],
                },
            };

            if (stateValues.effectiveRenderer !== "prefigure") {
                return annotationsChildren;
            }

            return {
                ...prefigureBaseDependencies(),
                ...prefigureDescendantDependencies(),
                curveDescendants: {
                    dependencyType: "stateVariable",
                    variableName: "curveDescendants",
                },
                functionToCurveComponentIdx: {
                    dependencyType: "stateVariable",
                    variableName: "functionToCurveComponentIdx",
                },
                ...annotationsChildren,
                allGraphicalDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["_graphical"],
                },
                allDescendants: {
                    dependencyType: "descendant",
                    componentTypes: ["_base"],
                },
            };
        },
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
                functionToCurveComponentIdx:
                    dependencyValues.functionToCurveComponentIdx ?? {},
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

function returnGraphHasAuthorAnnotationsStateVariableDefinition() {
    return {
        public: true,
        forRenderer: true,
        shadowingInstructions: {
            createComponentOfType: "boolean",
        },
        returnDependencies: () => ({
            annotationsChildren: {
                dependencyType: "child",
                childGroups: ["annotations"],
                variableNames: ["annotationSubtrees"],
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: GraphDependencyValues;
        }) {
            return {
                setValue: {
                    hasAuthorAnnotations:
                        (dependencyValues.annotationsChildren?.length ?? 0) > 0,
                },
            };
        },
    };
}

/**
 * Returns all Graph state-variable definitions needed for prefigure conversion.
 *
 * This is the canonical mapping between state-variable names and their
 * definitions; extend here when adding new prefigure-related state variables.
 */
export function returnGraphPrefigureStateVariableDefinitions() {
    return {
        curveDescendants: returnGraphCurveDescendantsStateVariableDefinition(),
        curveDescendantComponentIndices:
            returnGraphCurveDescendantComponentIndicesStateVariableDefinition(),
        functionToCurveComponentIdx:
            returnGraphFunctionCurveAliasMapStateVariableDefinition(),
        hasAuthorAnnotations:
            returnGraphHasAuthorAnnotationsStateVariableDefinition(),
        prefigureXML: returnGraphPrefigureXMLStateVariableDefinition(),
    };
}
