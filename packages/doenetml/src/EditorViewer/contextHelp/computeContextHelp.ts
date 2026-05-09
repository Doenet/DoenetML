import {
    AutoCompleter,
    type AliasedElementSchema,
    type ElementSchema,
    type SchemaAttribute,
    type SchemaProperty,
} from "@doenet/lsp-tools";
import { HelpContent } from "./types";

/**
 * Schema entry shape used by the help layer. Both real elements and aliased
 * help-only entries satisfy it — aliased entries lack the structural fields
 * (`children`, `top`, etc.) but carry the same help-relevant ones.
 */
type SchemaEntryForHelp = ElementSchema | AliasedElementSchema;

const NONE: HelpContent = { kind: "none" };

function findSchemaAttribute(
    el: SchemaEntryForHelp,
    name: string,
): SchemaAttribute | undefined {
    const lower = name.toLowerCase();
    return el.attributes.find((a) => a.name.toLowerCase() === lower);
}

function findSchemaProperty(
    el: SchemaEntryForHelp,
    name: string,
): SchemaProperty | undefined {
    const lower = name.toLowerCase();
    return el.properties?.find((p) => p.name.toLowerCase() === lower);
}

/**
 * Resolve which schema entry to use for help lookup at `node`, accounting
 * for parent `childContextHelp` aliases (e.g. `<row>` inside `<matrix>`
 * resolves to the `matrixRow` entry). Returns `[ownEntry, effectiveEntry]`
 * where the own entry preserves the authored tag name for the header and
 * the effective entry supplies the alias-redirected description.
 */
function resolveEntriesForNode(
    completer: AutoCompleter,
    node: NonNullable<
        ReturnType<
            AutoCompleter["sourceObj"]["elementAtOffsetWithContext"]
        >["node"]
    >,
): [ElementSchema | undefined, SchemaEntryForHelp | undefined] {
    const ownEntry = completer.findSchemaElement(node.name);
    const parent = completer.sourceObj.getParent(node);
    const parentName =
        parent && "name" in parent ? parent.name : undefined;
    const effective = completer.resolveEffectiveSchemaElement(
        ownEntry,
        parentName,
    );
    return [ownEntry, effective];
}

export function computeContextHelp(
    completer: AutoCompleter,
    offset: number,
): HelpContent {
    const { node, cursorPosition } =
        completer.sourceObj.elementAtOffsetWithContext(offset);

    if (node) {
        const [ownEntry, effectiveEntry] = resolveEntriesForNode(
            completer,
            node,
        );

        if (
            cursorPosition === "openTagName" ||
            cursorPosition === "closeTagName"
        ) {
            return helpForElement(ownEntry, effectiveEntry);
        }

        if (
            cursorPosition === "attributeName" ||
            cursorPosition === "attributeValue"
        ) {
            const attr = completer.sourceObj.attributeAtOffset(offset);
            if (!attr) return NONE;
            return helpForAttribute(ownEntry, effectiveEntry, attr.name);
        }
    }

    const ctx = completer.getCompletionContext(offset);
    if (ctx.cursorPos === "refMember") {
        return helpForPropertyReference(completer, offset, ctx);
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
    ownEntry: ElementSchema | undefined,
    effectiveEntry: SchemaEntryForHelp | undefined,
): HelpContent {
    if (!ownEntry || !effectiveEntry?.summary) return NONE;

    return {
        kind: "element",
        elementName: ownEntry.name,
        summary: effectiveEntry.summary,
        docsSlug: effectiveEntry.docsSlug ?? null,
    };
}

function helpForAttribute(
    ownEntry: ElementSchema | undefined,
    effectiveEntry: SchemaEntryForHelp | undefined,
    rawAttributeName: string,
): HelpContent {
    if (!ownEntry || !effectiveEntry) return NONE;

    const schemaAttr = findSchemaAttribute(effectiveEntry, rawAttributeName);
    if (!schemaAttr?.description) return NONE;

    return {
        kind: "attribute",
        elementName: ownEntry.name,
        attributeName: schemaAttr.name,
        description: schemaAttr.description,
        // Use `effectiveEntry` so the docs link follows alias redirection,
        // matching `helpForElement`. (E.g. `<row functionSymbols>` inside
        // `<matrix>` shows `matrixRow`'s description and links to its page.)
        docsSlug: effectiveEntry.docsSlug ?? null,
        // Prefer `autocompleteValues` so boolean aliases (e.g. "true"/"false"
        // injected alongside `validValues`) don't pollute the displayed list.
        allowedValues: schemaAttr.autocompleteValues ?? schemaAttr.values,
        defaultValue: schemaAttr.defaultValue,
    };
}

function helpForPropertyReference(
    completer: AutoCompleter,
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

    // Fallback to pure-JS resolution for simple `$name.property` when no
    // Rust resolver adapter is configured (browser-only setups). Restricted
    // to length-2 chains because the JS path resolves only `pathParts[0]`
    // and would otherwise look up the cursor identifier as a property of
    // the root referent, producing wrong help for `$a.b.c`. Multi-part
    // resolution is tracked in #1086.
    let containerNode = resolved.node;
    if (!containerNode) {
        if (ctx.pathParts.length === 2) {
            containerNode =
                completer.sourceObj.getReferentAtOffset(
                    offset,
                    ctx.pathParts[0],
                ) ?? null;
        } else if (ctx.pathParts.length > 2) {
            return { kind: "unsupportedRefChain" };
        }
    }
    if (!containerNode) return NONE;

    const elementEntry = completer.findSchemaElement(containerNode.name);
    if (!elementEntry) return NONE;

    const prop = findSchemaProperty(elementEntry, propertyName);
    if (!prop?.description) return NONE;

    const result: HelpContent = {
        kind: "property",
        elementName: elementEntry.name,
        propertyName: prop.name,
        description: prop.description,
        docsSlug: elementEntry.docsSlug ?? null,
        isArray: prop.isArray ?? false,
    };
    if (prop.type !== undefined) result.type = prop.type;
    return result;
}
