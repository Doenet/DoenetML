import { Plugin } from "unified";
import { DastAttribute, DastElement, DastError, DastRoot } from "../types";
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

export type AttributeRenameRule = {
    to: string;
    warningMessage: string;
    conflictWarningMessage: string;
};

export type ComponentRenameRule = {
    to: string;
    warningMessage: string;
    attributeRenames?: Record<string, AttributeRenameRule>;
};

export type DeprecationRegistry = {
    attributeRenames: Record<string, Record<string, AttributeRenameRule>>;
    componentRenames: Record<string, ComponentRenameRule>;
};

export const DEPRECATION_REGISTRY: DeprecationRegistry = {
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
    },
    componentRenames: {},
};

/**
 * Apply deprecation migrations directly on DAST nodes.
 *
 * This plugin both:
 * 1. mutates deprecated syntax to canonical syntax (e.g. renamed attributes), and
 * 2. emits warning `error` nodes under `<document>` so diagnostics propagate through
 *    the existing Rust->JS warning pipeline.
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

        const newAttribute = node.attributes[renameRule.to];
        if (newAttribute) {
            delete node.attributes[oldName];
            warnings.push(
                createWarning(
                    renameRule.conflictWarningMessage,
                    oldAttribute.position ?? node.position,
                    oldAttribute.source_doc ?? node.source_doc,
                ),
            );
            continue;
        }

        delete node.attributes[oldName];
        node.attributes[renameRule.to] = renameAttributeName(
            oldAttribute,
            renameRule.to,
        );
        warnings.push(
            createWarning(
                renameRule.warningMessage,
                oldAttribute.position ?? node.position,
                oldAttribute.source_doc ?? node.source_doc,
            ),
        );
    }
}

function renameAttributeName(attribute: DastAttribute, newName: string) {
    // Preserve children/position/source_doc while only changing the attribute key.
    return {
        ...attribute,
        name: newName,
    };
}

function createWarning(
    message: string,
    position: DastElement["position"],
    source_doc?: number,
) {
    // Internal warning record used while collecting deprecation migrations.
    return {
        type: "warning" as const,
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
