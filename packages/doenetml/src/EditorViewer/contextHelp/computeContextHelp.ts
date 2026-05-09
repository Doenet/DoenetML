import { AutoCompleter } from "@doenet/lsp-tools";
import { HelpContent } from "./types";

/** Derived from the source object so we don't take a `@doenet/parser` dep
 * just for the `DastElement` type. */
type ElementNode = NonNullable<
    ReturnType<AutoCompleter["sourceObj"]["elementAtOffsetWithContext"]>["node"]
>;

export type SchemaElementForHelp = {
    name: string;
    summary?: string;
    docsSlug: string | null;
    attributes: {
        name: string;
        description?: string;
        values?: unknown[];
        autocompleteValues?: unknown[];
        defaultValue?: unknown;
    }[];
    properties: {
        name: string;
        type: string;
        isArray: boolean;
        description?: string;
    }[];
    /** Map from child component name → key in `aliasedElements` providing help. */
    childContextHelp?: Record<string, string>;
};

export type SchemaMap = Record<string, SchemaElementForHelp>;

const NONE: HelpContent = { kind: "none" };

export function buildSchemaElementsByName(
    elements: readonly SchemaElementForHelp[],
    aliasedElements?: Readonly<Record<string, SchemaElementForHelp>>,
): SchemaMap {
    const map: SchemaMap = {};
    for (const el of elements) {
        map[el.name] = el;
    }
    if (aliasedElements) {
        for (const name in aliasedElements) {
            // Aliased entries are looked up via parent `childContextHelp` only;
            // placing them in the same map lets the lookup helper reuse one
            // path. Real elements always take precedence.
            if (!map[name]) map[name] = aliasedElements[name];
        }
    }
    return map;
}

export function computeContextHelp(
    completer: AutoCompleter,
    offset: number,
    schemaMap: SchemaMap,
): HelpContent {
    const { node, cursorPosition } =
        completer.sourceObj.elementAtOffsetWithContext(offset);

    if (node) {
        const effectiveName = resolveEffectiveElementName(
            completer,
            schemaMap,
            node,
        );

        if (
            cursorPosition === "openTagName" ||
            cursorPosition === "closeTagName"
        ) {
            return helpForElement(
                completer,
                schemaMap,
                node.name,
                effectiveName,
            );
        }

        if (
            cursorPosition === "attributeName" ||
            cursorPosition === "attributeValue"
        ) {
            const attr = completer.sourceObj.attributeAtOffset(offset);
            if (!attr) return NONE;
            return helpForAttribute(
                completer,
                schemaMap,
                node.name,
                effectiveName,
                attr.name,
            );
        }
    }

    const ctx = completer.getCompletionContext(offset);
    if (ctx.cursorPos === "refMember") {
        return helpForPropertyReference(completer, schemaMap, offset, ctx);
    }

    return NONE;
}

/**
 * Resolve the schema name to use for help lookup, accounting for parent
 * `childContextHelp` aliases (e.g. `<row>` inside `<matrix>` resolves to
 * `matrixRow`). Returns the effective name even when no alias applies.
 */
function resolveEffectiveElementName(
    completer: AutoCompleter,
    schemaMap: SchemaMap,
    node: ElementNode,
): string {
    const normalized = completer.normalizeElementName(node.name);
    if (normalized === "UNKNOWN_NAME") return node.name;

    const parent = completer.sourceObj.getParent(node);
    if (!parent || !("name" in parent)) return normalized;

    const parentNormalized = completer.normalizeElementName(parent.name);
    if (parentNormalized === "UNKNOWN_NAME") return normalized;

    const alias = schemaMap[parentNormalized]?.childContextHelp?.[normalized];
    return alias ?? normalized;
}

const IDENTIFIER_CHAR_REGEX = /[A-Za-z0-9_]/;

/**
 * The completion context's `typedPrefix` only captures identifier chars BEFORE
 * the cursor. Walk forward from the cursor to also capture chars to the right
 * so that placing the cursor mid-word still resolves the full identifier.
 */
function fullIdentifierAtOffset(
    source: string,
    startOffset: number,
    cursorOffset: number,
): string {
    let endOffset = cursorOffset;
    while (
        endOffset < source.length &&
        IDENTIFIER_CHAR_REGEX.test(source.charAt(endOffset))
    ) {
        endOffset++;
    }
    return source.slice(startOffset, endOffset);
}

function helpForElement(
    completer: AutoCompleter,
    schemaMap: SchemaMap,
    rawName: string,
    effectiveName: string,
): HelpContent {
    const displayName = completer.normalizeElementName(rawName);
    if (displayName === "UNKNOWN_NAME") return NONE;

    const schemaEl = schemaMap[effectiveName];
    if (!schemaEl?.summary) return NONE;

    return {
        kind: "element",
        elementName: displayName,
        summary: schemaEl.summary,
        docsSlug: schemaEl.docsSlug,
    };
}

function helpForAttribute(
    completer: AutoCompleter,
    schemaMap: SchemaMap,
    rawElementName: string,
    effectiveElementName: string,
    rawAttributeName: string,
): HelpContent {
    const displayElementName = completer.normalizeElementName(rawElementName);
    if (displayElementName === "UNKNOWN_NAME") return NONE;

    const attributeName = completer.normalizeAttributeName(rawAttributeName);
    if (attributeName === "UNKNOWN_NAME") return NONE;

    const schemaAttr = schemaMap[effectiveElementName]?.attributes.find(
        (a) => a.name === attributeName,
    );
    if (!schemaAttr?.description) return NONE;

    return {
        kind: "attribute",
        elementName: displayElementName,
        attributeName,
        description: schemaAttr.description,
        // Prefer `autocompleteValues` so boolean aliases (e.g. "true"/"false"
        // injected alongside `validValues`) don't pollute the displayed list.
        allowedValues: schemaAttr.autocompleteValues ?? schemaAttr.values,
        defaultValue: schemaAttr.defaultValue,
    };
}

function helpForPropertyReference(
    completer: AutoCompleter,
    schemaMap: SchemaMap,
    offset: number,
    ctx: {
        typedPrefix: string;
        replaceFromOffset: number;
        pathParts: string[];
        pathPartHasIndex: boolean[];
    },
): HelpContent {
    const propertyName = fullIdentifierAtOffset(
        completer.source,
        ctx.replaceFromOffset,
        offset,
    );
    if (!propertyName) return NONE;

    const resolved = completer.resolveRefMemberContainerAtOffset(
        offset,
        ctx.pathParts,
        ctx.pathPartHasIndex,
    );

    // Fallback to pure-JS resolution for simple `$name.property` when
    // no Rust resolver adapter is configured (browser-only setups).
    const containerNode =
        resolved.node ??
        (ctx.pathParts.length >= 1
            ? completer.sourceObj.getReferentAtOffset(offset, ctx.pathParts[0])
            : null);
    if (!containerNode) return NONE;

    const elementName = completer.normalizeElementName(containerNode.name);
    if (elementName === "UNKNOWN_NAME") return NONE;

    const propertyNameLower = propertyName.toLowerCase();
    const prop = schemaMap[elementName]?.properties.find(
        (p) => p.name.toLowerCase() === propertyNameLower,
    );
    if (!prop?.description) return NONE;

    return {
        kind: "property",
        elementName,
        propertyName: prop.name,
        description: prop.description,
        type: prop.type,
        isArray: prop.isArray,
    };
}
