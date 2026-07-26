import { Plugin } from "unified";
import { DastElement, DastError, DastRoot } from "../types";
import { codedDastError } from "../coded-dast-error";
import { visit } from "../pretty-printer/normalize/utils/visit";
import { isDastElement } from "../types-util";

/**
 * A rule names the attributes it is about rather than carrying a finished
 * sentence.
 *
 * The registry used to hold twenty-one hand-written strings that differed only
 * in two identifiers, which no translation could reach and which had to be
 * kept in step by hand. Now each rule carries the pieces, one code covers each
 * shape of message, and the English is assembled in one place beside the code
 * that names it (#1518).
 */
type AttributeRenameRule = {
    /** The deprecated attribute, in the casing the message should show. */
    from: string;
    /** The attribute that replaces it. */
    to: string;
    /**
     * The component the message names, when naming one is right.
     *
     * Left out for a rename that applies to every component accepting the
     * attribute: the message would otherwise single out whichever component
     * the author happened to use, as if the rule were narrower than it is.
     */
    component?: string;
};

type AttributeRemovalRule = {
    /** The dropped attribute, in the casing the message should show. */
    attribute: string;
    /** The component it is dropped from. */
    component: string;
};

type DeprecationRegistry = {
    attributeRenames: Record<string, Record<string, AttributeRenameRule>>;
    attributeRemovals: Record<string, Record<string, AttributeRemovalRule>>;
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
    // No `component`: the rename applies to every scored section, so naming
    // the one the author used would misrepresent the rule.
    const rule: AttributeRenameRule = { from: oldName, to: newName };
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
            { attribute: attributeName, component: componentName },
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
                from: "documentWideCheckWork",
                to: "sectionWideCheckWork",
                component: "document",
            },
        },
        selectFromSequence: {
            sortResults: {
                from: "sortResults",
                to: "sort",
                component: "selectFromSequence",
            },
        },
        selectPrimeNumbers: {
            minValue: {
                from: "minValue",
                to: "from",
                component: "selectPrimeNumbers",
            },
            maxValue: {
                from: "maxValue",
                to: "to",
                component: "selectPrimeNumbers",
            },
            sortResults: {
                from: "sortResults",
                to: "sort",
                component: "selectPrimeNumbers",
            },
        },
        samplePrimeNumbers: {
            minValue: {
                from: "minValue",
                to: "from",
                component: "samplePrimeNumbers",
            },
            maxValue: {
                from: "maxValue",
                to: "to",
                component: "samplePrimeNumbers",
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
 * Component renames used to live here too, alongside attribute renames and
 * removals. The registry never had one — the branch was dead from the day it
 * was written — and giving deprecations codes left it as the only rule shape
 * with no message of its own to name (#1518). Whoever needs to rename a
 * component should add it back with the code and the catalog entry that go
 * with it, rather than inherit a path that has never run.
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
        const warnings: DastError[] = [];

        visit(tree, (node) => {
            if (!isDastElement(node)) {
                return;
            }

            const nodeWarnings: DastError[] = [];

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
                documentElement.children.push(...warnings);
            }
        }
    };
};

function applyAttributeRenames(node: DastElement, warnings: DastError[]) {
    // Apply attribute rename rules scoped to this component type.
    const renameRules = DEPRECATION_INDEX.attributeRenames[node.name];
    if (!renameRules) {
        return;
    }

    applyRenames(node, renameRules, warnings);
}

function applyAttributeRemovals(node: DastElement, warnings: DastError[]) {
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
            deprecationWarning({
                code: "doenet-w0110",
                message: `[deprecation] Attribute \`${removalRule.attribute}\` on \`<${removalRule.component}>\` is deprecated and ignored.`,
                args: {
                    attribute: removalRule.attribute,
                    component: removalRule.component,
                },
                position,
                source_doc,
            }),
        );
    }
}

function applyRenames(
    node: DastElement,
    renameRules: Record<string, AttributeRenameRule>,
    warnings: DastError[],
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
                renamedAttributeConflictWarning(
                    renameRule,
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
                renamedAttributeWarning(renameRule, position, source_doc),
            );
        }
    }
}

/**
 * The ` on `<component>`` clause, or nothing.
 *
 * Mirrors the `$component` select in the catalog's `deprecated-attribute-*`
 * messages, which is where a translation gets to place the clause — or drop
 * it, or put the component first — rather than receiving it pre-assembled.
 */
function onComponent(component?: string): string {
    return component === undefined ? "" : ` on \`<${component}>\``;
}

/**
 * The arguments both rename messages take.
 *
 * `component` is `none` rather than absent when the rule names no component:
 * that is the catalog's variant key for "this rename is not about one
 * component", not a component called `none`.
 */
function renameArgs(rule: AttributeRenameRule) {
    return {
        from: rule.from,
        to: rule.to,
        component: rule.component ?? "none",
    };
}

function renamedAttributeWarning(
    rule: AttributeRenameRule,
    position?: DastElement["position"],
    source_doc?: number,
): DastError {
    return deprecationWarning({
        code: "doenet-w0108",
        message: `[deprecation] Attribute \`${rule.from}\`${onComponent(rule.component)} is deprecated; use \`${rule.to}\` instead.`,
        args: renameArgs(rule),
        position,
        source_doc,
    });
}

function renamedAttributeConflictWarning(
    rule: AttributeRenameRule,
    position?: DastElement["position"],
    source_doc?: number,
): DastError {
    return deprecationWarning({
        code: "doenet-w0109",
        message: `[deprecation] Attribute \`${rule.from}\`${onComponent(rule.component)} is deprecated and ignored because \`${rule.to}\` is also specified.`,
        args: renameArgs(rule),
        position,
        source_doc,
    });
}

/**
 * Materialize a deprecation as a DAST `error` node with `error_type: "warning"`.
 *
 * The Rust flattening bridge preserves `error_type`, the code and the
 * arguments, and the JS normalized DAST conversion maps warning/info error
 * nodes into diagnostics without rendering `_error` components.
 */
function deprecationWarning(
    diagnostic: Omit<Parameters<typeof codedDastError>[0], "error_type">,
): DastError {
    return codedDastError({ ...diagnostic, error_type: "warning" });
}
