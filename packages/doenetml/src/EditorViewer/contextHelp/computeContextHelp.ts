import { AutoCompleter } from "@doenet/lsp-tools";
import { HelpContent } from "./types";

export type SchemaElementForHelp = {
    name: string;
    summary?: string;
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
};

export type SchemaMap = Record<string, SchemaElementForHelp>;

const NONE: HelpContent = { kind: "none" };

export function buildSchemaElementsByName(
    elements: readonly SchemaElementForHelp[],
): SchemaMap {
    const map: SchemaMap = {};
    for (const el of elements) {
        map[el.name] = el;
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
        if (
            cursorPosition === "openTagName" ||
            cursorPosition === "closeTagName"
        ) {
            return helpForElement(completer, schemaMap, node.name);
        }

        if (
            cursorPosition === "attributeName" ||
            cursorPosition === "attributeValue"
        ) {
            const attr = completer.sourceObj.attributeAtOffset(offset);
            if (!attr) return NONE;
            return helpForAttribute(completer, schemaMap, node.name, attr.name);
        }
    }

    const ctx = completer.getCompletionContext(offset);
    if (ctx.cursorPos === "refMember") {
        return helpForPropertyReference(completer, schemaMap, offset, ctx);
    }

    return NONE;
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
): HelpContent {
    const elementName = completer.normalizeElementName(rawName);
    if (elementName === "UNKNOWN_NAME") return NONE;

    const summary = schemaMap[elementName]?.summary;
    if (!summary) return NONE;

    return { kind: "element", elementName, summary };
}

function helpForAttribute(
    completer: AutoCompleter,
    schemaMap: SchemaMap,
    rawElementName: string,
    rawAttributeName: string,
): HelpContent {
    const elementName = completer.normalizeElementName(rawElementName);
    if (elementName === "UNKNOWN_NAME") return NONE;

    const attributeName = completer.normalizeAttributeName(rawAttributeName);
    if (attributeName === "UNKNOWN_NAME") return NONE;

    const schemaAttr = schemaMap[elementName]?.attributes.find(
        (a) => a.name === attributeName,
    );
    if (!schemaAttr?.description) return NONE;

    return {
        kind: "attribute",
        elementName,
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
