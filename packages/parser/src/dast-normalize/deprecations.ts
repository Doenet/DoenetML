import { Plugin } from "unified";
import { DastElement, DastError, DastRoot } from "../types";
import { visit } from "../pretty-printer/normalize/utils/visit";
import { isDastElement } from "../types-util";

type DeprecationDiagnostic = {
    // Keep this local rather than importing @doenet/utils diagnostics types.
    // `@doenet/utils` depends on `@doenet/parser`, so importing back would
    // create a circular package dependency.
    type: "warning";
    message: string;
    position?: DastElement["position"];
    source_doc?: number;
};

type AttributeRenameRule = {
    to: string;
    warningMessage: string;
    conflictWarningMessage: string;
};

type AttributeRemovalRule = {
    warningMessage: string;
};

type ComponentRenameRule = {
    to: string;
    warningMessage: string;
    attributeRenames?: Record<string, AttributeRenameRule>;
};

type DeprecationRegistry = {
    attributeRenames: Record<string, Record<string, AttributeRenameRule>>;
    attributeRemovals: Record<string, Record<string, AttributeRemovalRule>>;
    componentRenames: Record<string, ComponentRenameRule>;
};

/**
 * Indexed view of the registry, built once at module load. The component-name
 * keys are kept verbatim (component names are case-sensitive), but the inner
 * attribute-name keys are lower-cased so the deprecation pass can match
 * attributes case-insensitively. Without this, `<description WeIgHt="2">`
 * would slip past the deprecation pass and hard-error once `weight` is no
 * longer a valid attribute on `<description>`.
 */
type DeprecationIndex = {
    attributeRenames: Record<string, Record<string, AttributeRenameRule>>;
    attributeRemovals: Record<string, Record<string, AttributeRemovalRule>>;
    componentRenames: Record<string, ComponentRenameRule>;
};

/**
 * All component types that accept scored-section attributes (returnScoredSectionAttributes).
 * Used to register attribute rename deprecations that apply across all of them.
 */
const SCORED_SECTION_COMPONENT_TYPES = [
    "document",
    "section",
    "subsection",
    "subsubsection",
    "paragraphs",
    "aside",
    "objectives",
    "problem",
    "exercise",
    "question",
    "activity",
    "example",
    "definition",
    "note",
    "theorem",
    "part",
    "task",
    "proof",
    "problems",
    "exercises",
    "standinForFutureLayoutTag",
    "externalContent",
    "cascade",
    "div",
    "span",
    "ol",
    "ul",
    "li",
    "p",
];

/**
 * Build rename rules for every scored-section component type for a single
 * attribute rename.
 */
function renamedScoredSectionAttribute(
    oldName: string,
    newName: string,
): Record<string, Record<string, AttributeRenameRule>> {
    const rule: AttributeRenameRule = {
        to: newName,
        warningMessage: `[deprecation] Attribute \`${oldName}\` is deprecated; use \`${newName}\` instead.`,
        conflictWarningMessage: `[deprecation] Attribute \`${oldName}\` is deprecated and ignored because \`${newName}\` is also specified.`,
    };
    return Object.fromEntries(
        SCORED_SECTION_COMPONENT_TYPES.map((comp) => [
            comp,
            { [oldName]: rule },
        ]),
    );
}

/**
 * Build "deprecated and ignored" removal rules for attributes that are no longer
 * valid on a component. Using such an attribute emits a warning, and the attribute
 * is dropped from the DAST so it does not become an "invalid attribute" error.
 */
function ignoredAttributes(
    componentName: string,
    attributeNames: string[],
): Record<string, AttributeRemovalRule> {
    return Object.fromEntries(
        attributeNames.map((attributeName) => [
            attributeName,
            {
                warningMessage: `[deprecation] Attribute \`${attributeName}\` on \`<${componentName}>\` is deprecated and ignored.`,
            },
        ]),
    );
}

const SCORED_SECTION_COLORING_RENAMES = renamedScoredSectionAttribute(
    "forceIndividualAnswerColoring",
    "colorAnswersSeparately",
);

const DEPRECATION_REGISTRY: DeprecationRegistry = {
    attributeRenames: {
        // Merge per-component rules, spreading scored-section rename rules
        // first so component-specific rules take precedence on conflict.
        ...SCORED_SECTION_COLORING_RENAMES,
        document: {
            // document already has a scored-section rename (spread above) plus
            // its own documentWideCheckWork rename.
            ...SCORED_SECTION_COLORING_RENAMES["document"],
            documentWideCheckWork: {
                to: "sectionWideCheckWork",
                warningMessage:
                    "[deprecation] Attribute `documentWideCheckWork` on `<document>` is deprecated; use `sectionWideCheckWork` instead.",
                conflictWarningMessage:
                    "[deprecation] Attribute `documentWideCheckWork` on `<document>` is deprecated and ignored because `sectionWideCheckWork` is also specified.",
            },
        },
        selectFromSequence: {
            sortResults: {
                to: "sort",
                warningMessage:
                    "[deprecation] Attribute `sortResults` on `<selectFromSequence>` is deprecated; use `sort` instead.",
                conflictWarningMessage:
                    "[deprecation] Attribute `sortResults` on `<selectFromSequence>` is deprecated and ignored because `sort` is also specified.",
            },
        },
        selectPrimeNumbers: {
            minValue: {
                to: "from",
                warningMessage:
                    "[deprecation] Attribute `minValue` on `<selectPrimeNumbers>` is deprecated; use `from` instead.",
                conflictWarningMessage:
                    "[deprecation] Attribute `minValue` on `<selectPrimeNumbers>` is deprecated and ignored because `from` is also specified.",
            },
            maxValue: {
                to: "to",
                warningMessage:
                    "[deprecation] Attribute `maxValue` on `<selectPrimeNumbers>` is deprecated; use `to` instead.",
                conflictWarningMessage:
                    "[deprecation] Attribute `maxValue` on `<selectPrimeNumbers>` is deprecated and ignored because `to` is also specified.",
            },
            sortResults: {
                to: "sort",
                warningMessage:
                    "[deprecation] Attribute `sortResults` on `<selectPrimeNumbers>` is deprecated; use `sort` instead.",
                conflictWarningMessage:
                    "[deprecation] Attribute `sortResults` on `<selectPrimeNumbers>` is deprecated and ignored because `sort` is also specified.",
            },
        },
        samplePrimeNumbers: {
            minValue: {
                to: "from",
                warningMessage:
                    "[deprecation] Attribute `minValue` on `<samplePrimeNumbers>` is deprecated; use `from` instead.",
                conflictWarningMessage:
                    "[deprecation] Attribute `minValue` on `<samplePrimeNumbers>` is deprecated and ignored because `from` is also specified.",
            },
            maxValue: {
                to: "to",
                warningMessage:
                    "[deprecation] Attribute `maxValue` on `<samplePrimeNumbers>` is deprecated; use `to` instead.",
                conflictWarningMessage:
                    "[deprecation] Attribute `maxValue` on `<samplePrimeNumbers>` is deprecated and ignored because `to` is also specified.",
            },
        },
    },
    attributeRemovals: {
        // `description` and `shortDescription` previously inherited these
        // attributes from `Div` / `Text`, which are inappropriate parents for
        // them. The attributes never had a meaningful effect on these
        // components; they are dropped with a warning.
        description: ignoredAttributes("description", [
            "aggregateScores",
            "weight",
            "sectionWideCheckWork",
            "showCorrectness",
            "colorCorrectness",
            "forceIndividualAnswerColoring",
            "colorAnswersSeparately",
            "submitLabel",
            "submitLabelNoCorrectness",
            "displayDigitsForCreditAchieved",
        ]),
        shortDescription: ignoredAttributes("shortDescription", [
            "draggable",
            "layer",
            "isLatex",
            "anchor",
            "positionFromAnchor",
        ]),
    },
    componentRenames: {},
};

function lowerKeys<T>(o: Record<string, T>): Record<string, T> {
    return Object.fromEntries(
        Object.entries(o).map(([k, v]) => [k.toLowerCase(), v]),
    );
}

function buildDeprecationIndex(
    registry: DeprecationRegistry,
): DeprecationIndex {
    // Component names are case-sensitive — keep top-level keys verbatim.
    // Attribute names are case-insensitive — lower-case the inner keys so
    // we can match against actual attribute keys on the node case-insensitively.
    return {
        attributeRenames: Object.fromEntries(
            Object.entries(registry.attributeRenames).map(([comp, rules]) => [
                comp,
                lowerKeys(rules),
            ]),
        ),
        attributeRemovals: Object.fromEntries(
            Object.entries(registry.attributeRemovals).map(([comp, rules]) => [
                comp,
                lowerKeys(rules),
            ]),
        ),
        componentRenames: Object.fromEntries(
            Object.entries(registry.componentRenames).map(([comp, rule]) => [
                comp,
                rule.attributeRenames
                    ? {
                          ...rule,
                          attributeRenames: lowerKeys(rule.attributeRenames),
                      }
                    : rule,
            ]),
        ),
    };
}

const DEPRECATION_INDEX: DeprecationIndex =
    buildDeprecationIndex(DEPRECATION_REGISTRY);

/** Find an attribute on `node` by case-insensitive name match. */
function findAttributeKey(
    node: DastElement,
    lowerName: string,
): string | undefined {
    return Object.keys(node.attributes).find(
        (k) => k.toLowerCase() === lowerName,
    );
}

/**
 * Apply deprecation migrations directly on DAST nodes.
 *
 * This plugin:
 * 1. Mutates deprecated syntax to canonical syntax (e.g., renamed attributes)
 * 2. Emits warning error nodes for all deprecation issues
 * 3. Automatically appends warnings to the document element for diagnostics
 *
 * Define new deprecations in DEPRECATION_REGISTRY. This plugin runs during
 * DAST normalization after all initial structure validation, allowing
 * deprecated syntax to be migrated while still alerting users.
 */
export const pluginApplyDeprecations: Plugin<[], DastRoot, DastRoot> = () => {
    return (tree) => {
        const warnings: DeprecationDiagnostic[] = [];

        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }

            const nodeWarnings: DeprecationDiagnostic[] = [];

            applyComponentRename(node, nodeWarnings);
            applyAttributeRenames(node, nodeWarnings);
            applyAttributeRemovals(node, nodeWarnings);
            warnings.push(...nodeWarnings);
        });

        if (warnings.length > 0) {
            const documentElement = tree.children.find(
                (child): child is DastElement =>
                    isDastElement(child) && child.name === "document",
            );

            if (documentElement) {
                documentElement.children.push(
                    ...warnings.map((warning) =>
                        createWarningNode(
                            warning.message,
                            warning.position,
                            warning.source_doc,
                        ),
                    ),
                );
            }
        }
    };
};

function applyComponentRename(
    node: DastElement,
    warnings: DeprecationDiagnostic[],
) {
    // Component renames happen before attribute renames so component-specific
    // attribute rules can be applied after the component name is canonicalized.
    const renameRule = DEPRECATION_INDEX.componentRenames[node.name];
    if (!renameRule) {
        return;
    }

    node.name = renameRule.to;
    warnings.push(
        createWarning(
            renameRule.warningMessage,
            node.position,
            node.source_doc,
        ),
    );

    if (!renameRule.attributeRenames) {
        return;
    }

    applyRenames(node, renameRule.attributeRenames, warnings);
}

function applyAttributeRenames(
    node: DastElement,
    warnings: DeprecationDiagnostic[],
) {
    // Apply attribute rename rules scoped to this component type.
    const renameRules = DEPRECATION_INDEX.attributeRenames[node.name];
    if (!renameRules) {
        return;
    }

    applyRenames(node, renameRules, warnings);
}

function applyAttributeRemovals(
    node: DastElement,
    warnings: DeprecationDiagnostic[],
) {
    // Drop attributes that are deprecated with no replacement, scoped to this
    // component type. The attribute is removed from the DAST and a warning emitted.
    const removalRules = DEPRECATION_INDEX.attributeRemovals[node.name];
    if (!removalRules) {
        return;
    }

    // Rule keys are lower-cased; match the actual attribute key on the node
    // case-insensitively so e.g. `WeIgHt` is still recognized.
    for (const [lowerName, removalRule] of Object.entries(removalRules)) {
        const actualKey = findAttributeKey(node, lowerName);
        if (!actualKey) {
            continue;
        }

        const attribute = node.attributes[actualKey];
        const position = attribute.position ?? node.position;
        const source_doc = attribute.source_doc ?? node.source_doc;

        delete node.attributes[actualKey];
        warnings.push(
            createWarning(removalRule.warningMessage, position, source_doc),
        );
    }
}

function applyRenames(
    node: DastElement,
    renameRules: Record<string, AttributeRenameRule>,
    warnings: DeprecationDiagnostic[],
) {
    // `new` attribute names take precedence over deprecated names when both are
    // present; in that conflict case, deprecated attributes are dropped. Rule
    // keys are lower-cased (see DEPRECATION_INDEX) and matched against the
    // actual attribute keys on the node case-insensitively.
    for (const [oldLowerName, renameRule] of Object.entries(renameRules)) {
        const oldActualKey = findAttributeKey(node, oldLowerName);
        if (!oldActualKey) {
            continue;
        }

        const oldAttribute = node.attributes[oldActualKey];
        const position = oldAttribute.position ?? node.position;
        const source_doc = oldAttribute.source_doc ?? node.source_doc;

        delete node.attributes[oldActualKey];

        const conflictKey = findAttributeKey(node, renameRule.to.toLowerCase());
        if (conflictKey) {
            warnings.push(
                createWarning(
                    renameRule.conflictWarningMessage,
                    position,
                    source_doc,
                ),
            );
        } else {
            node.attributes[renameRule.to] = {
                ...oldAttribute,
                name: renameRule.to,
            };
            warnings.push(
                createWarning(renameRule.warningMessage, position, source_doc),
            );
        }
    }
}

function createWarning(
    message: string,
    position: DastElement["position"],
    source_doc?: number,
): DeprecationDiagnostic {
    // Internal warning record used while collecting deprecation migrations.
    return {
        type: "warning",
        message,
        position,
        source_doc,
    };
}

/**
 * Materialize a warning as a DAST `error` node with `error_type: "warning"`.
 *
 * The Rust flattening bridge preserves `error_type`, and the JS normalized DAST
 * conversion maps warning/info error nodes into diagnostics without rendering
 * `_error` components.
 */
function createWarningNode(
    message: string,
    position?: DastElement["position"],
    source_doc?: number,
): DastError {
    return {
        type: "error",
        message,
        error_type: "warning",
        position,
        source_doc,
    };
}
