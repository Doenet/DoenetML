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

type ComponentRenameRule = {
    to: string;
    warningMessage: string;
    attributeRenames?: Record<string, AttributeRenameRule>;
};

type DeprecationRegistry = {
    attributeRenames: Record<string, Record<string, AttributeRenameRule>>;
    componentRenames: Record<string, ComponentRenameRule>;
};

const DEPRECATION_REGISTRY: DeprecationRegistry = {
    attributeRenames: {
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
    componentRenames: {},
};

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
    const renameRule = DEPRECATION_REGISTRY.componentRenames[node.name];
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
    const renameRules = DEPRECATION_REGISTRY.attributeRenames[node.name];
    if (!renameRules) {
        return;
    }

    applyRenames(node, renameRules, warnings);
}

function applyRenames(
    node: DastElement,
    renameRules: Record<string, AttributeRenameRule>,
    warnings: DeprecationDiagnostic[],
) {
    // `new` attribute names take precedence over deprecated names when both are
    // present; in that conflict case, deprecated attributes are dropped.
    for (const [oldName, renameRule] of Object.entries(renameRules)) {
        const oldAttribute = node.attributes[oldName];
        if (!oldAttribute) {
            continue;
        }

        const position = oldAttribute.position ?? node.position;
        const source_doc = oldAttribute.source_doc ?? node.source_doc;

        delete node.attributes[oldName];

        if (node.attributes[renameRule.to]) {
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
