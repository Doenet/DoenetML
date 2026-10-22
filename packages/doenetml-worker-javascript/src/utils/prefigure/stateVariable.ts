import { createPrefigureXML } from "./graph";
import { sortDescendantsByOrder } from "./common";
import type { Descendant, GraphDependencyValues } from "./types";
import { codedDiagnostic } from "../diagnostics";
import {
    GRAPH_TEXT_COMMON_VARIABLES,
    GRAPH_TEXT_CONTENT_VARIABLES,
    graphTextMarkup,
    graphTextType,
} from "./components/text";

interface DescendantDependency {
    dependencyType: "descendant";
    componentTypes: string[];
    variableNames: string[];
    variablesOptional?: boolean;
    presentListsAsEntries?: boolean;
}

/** The types a list component holds entries of that are drawn in a graph. */
const LIST_ENTRY_TYPES = new Set(["point", "vector"]);

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
    {
        key: "regionBetweenCurvesDescendants",
        componentType: "regionBetweenCurves",
        variableNames: [
            "boundaryValues",
            "flipFunctions",
            "haveFunctions",
            "fDefinitions",
            "selectedStyle",
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

    // Each entry of a list of points or vectors (`<pointList>`) is drawn,
    // as a point or vector is.
    if (LIST_ENTRY_TYPES.has(componentType)) {
        dependency.presentListsAsEntries = true;
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
        grid: {
            dependencyType: "stateVariable",
            variableName: "grid",
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
        document: {
            dependencyType: "ancestor",
            componentType: "document",
            variableNames: ["theme"],
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
 * Lists the text-like children this graph draws (`<text>`, `<math>`,
 * `<label>`, ...), with those of any nested graph, which draws into this one.
 *
 * Only identities are gathered here. The graph's `graphical` child group also
 * holds points, lines, and the rest, and a child dependency cannot pick out
 * component types, so asking it for `text` or `latex` would compute those for
 * every child. `prefigureXML` instead asks each listed text for its values.
 *
 * Children are used rather than descendants because a descendant search would
 * also find text that is part of another component and not drawn on its own,
 * such as a point's `<label>` or a `<shortDescription>`.
 *
 * A `<textList>`, `<numberList>`, or `<mathList>` child is listed once for each
 * entry, by the list's `componentIdx` and the entry's `listEntryIndex`.
 */
function returnGraphTextChildrenStateVariableDefinition() {
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
                graphicalChildren: {
                    dependencyType: "child",
                    childGroups: ["graphical"],
                },
                graphChildren: {
                    dependencyType: "child",
                    childGroups: ["graphs"],
                    variableNames: ["graphTextChildren"],
                },
            };
        },
        definition({
            dependencyValues,
            componentInfoObjects,
        }: {
            dependencyValues: GraphDependencyValues;
            componentInfoObjects: Parameters<typeof graphTextType>[1];
        }) {
            const ownTextChildren = (
                (dependencyValues.graphicalChildren as
                    Descendant[] | undefined) ?? []
            ).flatMap(
                ({ componentType, componentIdx, position, listEntryIndex }) => {
                    const textType = graphTextType(
                        componentType,
                        componentInfoObjects,
                    );
                    if (textType === null || !Number.isFinite(componentIdx)) {
                        return [];
                    }
                    return [
                        {
                            componentType,
                            textType,
                            componentIdx,
                            position,
                            ...(listEntryIndex === undefined
                                ? {}
                                : { listEntryIndex }),
                        },
                    ];
                },
            );

            const nestedTextChildren = (
                (dependencyValues.graphChildren as Descendant[] | undefined) ??
                []
            ).flatMap(
                (graph) =>
                    (graph.stateValues?.graphTextChildren as
                        Descendant[] | undefined) ?? [],
            );

            return {
                setValue: {
                    graphTextChildren: [
                        ...ownTextChildren,
                        ...nestedTextChildren,
                    ],
                },
            };
        },
    };
}

function graphTextVariableNames(textType: string | undefined): string[] {
    return [
        ...(GRAPH_TEXT_CONTENT_VARIABLES[textType ?? ""] ?? []),
        ...GRAPH_TEXT_COMMON_VARIABLES,
    ];
}

/**
 * The values of each listed graph text, as `textChild<i>` dependencies, so a
 * text is asked only for the variables its type draws.
 *
 * A list entry has no component of its own to ask. Its values come instead
 * from one `listTextEntries` descendant dependency that presents each list as
 * its entries, mapping each variable to the list's own, as the renderer of an
 * entry is given them; `collectGraphTexts` keeps the entries of the lists
 * listed here.
 */
function graphTextValueDependencies(
    graphTextChildren: unknown,
): Record<string, unknown> {
    const dependencies: Record<string, unknown> = {};
    if (!Array.isArray(graphTextChildren)) {
        return dependencies;
    }
    const listEntryTypes = new Set<string>();
    const listVariableNames = new Set<string>();
    for (const [index, child] of (
        graphTextChildren as Descendant[]
    ).entries()) {
        if (child.listEntryIndex !== undefined) {
            listEntryTypes.add(child.componentType);
            for (const name of graphTextVariableNames(child.textType)) {
                listVariableNames.add(name);
            }
            continue;
        }
        dependencies[`textChild${index}`] = {
            dependencyType: "multipleStateVariables",
            componentIdx: child.componentIdx,
            variableNames: graphTextVariableNames(child.textType),
            variablesOptional: true,
        };
    }
    if (listEntryTypes.size > 0) {
        dependencies.listTextEntries = {
            dependencyType: "descendant",
            componentTypes: [...listEntryTypes],
            variableNames: [...listVariableNames],
            variablesOptional: true,
            presentListsAsEntries: true,
        };
    }
    return dependencies;
}

/**
 * The graph texts to draw, each with its values, leaving out any that would
 * show nothing.
 */
function collectGraphTexts(
    dependencyValues: GraphDependencyValues,
): Descendant[] {
    const graphTextChildren =
        (dependencyValues.graphTextChildren as Descendant[] | undefined) ?? [];

    const listEntries = new Map<string, Descendant>();
    for (const entry of (dependencyValues.listTextEntries as
        Descendant[] | undefined) ?? []) {
        if (entry.listIdx !== undefined && entry.listEntryIndex !== undefined) {
            listEntries.set(`${entry.listIdx}:${entry.listEntryIndex}`, entry);
        }
    }

    return graphTextChildren.flatMap((child, index) => {
        let text: Descendant;
        if (child.listEntryIndex === undefined) {
            const stateValues =
                (
                    dependencyValues[`textChild${index}`] as
                        Descendant | undefined
                )?.stateValues ?? {};
            text = { ...child, stateValues };
        } else {
            // An entry is drawn as the record the descendant dependency gives
            // it, whose `componentIdx` is the one its renderer is given, so
            // each entry has a handle and a place in the order of its own.
            const entry = listEntries.get(
                `${child.componentIdx}:${child.listEntryIndex}`,
            );
            if (entry === undefined) {
                return [];
            }
            text = {
                ...entry,
                textType: child.textType,
                position: child.position,
                stateValues: entry.stateValues ?? {},
            };
        }
        if (
            graphTextMarkup(text.textType ?? "", text.stateValues ?? {}) ===
            null
        ) {
            return [];
        }
        return [text];
    });
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
            Descendant[] | undefined) ?? []) {
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
        description:
            "The Prefigure-formatted XML rendered for this graph, or null if not using the Prefigure renderer.",
        public: true,
        forRenderer: true,
        stateVariablesDeterminingDependencies: [
            "effectiveRenderer",
            "graphTextChildren",
        ],
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
                graphTextChildren: {
                    dependencyType: "stateVariable",
                    variableName: "graphTextChildren",
                },
                ...graphTextValueDependencies(stateValues.graphTextChildren),
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
                    diagnostics.push(
                        codedDiagnostic({
                            type: "info",
                            code: "doenet-i0019",
                        }),
                    );
                }
                return {
                    setValue: { prefigureXML: null },
                    sendDiagnostics: diagnostics,
                };
            }

            if (dependencyValues.haveGraphParent) {
                return { setValue: { prefigureXML: null } };
            }

            const descendants = [
                ...collectConfiguredDescendants(dependencyValues),
                ...collectGraphTexts(dependencyValues),
            ];
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
                darkMode:
                    dependencyValues.document?.stateValues?.theme === "dark",
            });

            if (
                dependencyValues.annotationsChildren &&
                dependencyValues.annotationsChildren.length > 1
            ) {
                const secondToLastAnnotationsChild =
                    dependencyValues.annotationsChildren[
                        dependencyValues.annotationsChildren.length - 2
                    ];

                diagnostics.push(
                    codedDiagnostic({
                        type: "info",
                        code: "doenet-i0020",
                        position: secondToLastAnnotationsChild?.position,
                    }),
                );
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
        description:
            "Whether the graph contains any author-provided `<annotations>` child.",
        public: true,
        forRenderer: true,
        shadowingInstructions: {
            createComponentOfType: "boolean",
        },
        returnDependencies: () => ({
            annotationsChildren: {
                dependencyType: "child",
                childGroups: ["annotations"],
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: GraphDependencyValues;
        }) {
            // True when the author included at least one <annotations> child,
            // even if that child is explicitly empty. False only when no
            // authored <annotations> child exists.
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
        graphTextChildren: returnGraphTextChildrenStateVariableDefinition(),
        functionToCurveComponentIdx:
            returnGraphFunctionCurveAliasMapStateVariableDefinition(),
        hasAuthorAnnotations:
            returnGraphHasAuthorAnnotationsStateVariableDefinition(),
        prefigureXML: returnGraphPrefigureXMLStateVariableDefinition(),
    };
}
