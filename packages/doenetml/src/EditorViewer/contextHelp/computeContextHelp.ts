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
        /** Optional: some array slots have no `createComponentOfType`. */
        type?: string;
        isArray: boolean;
        description?: string;
    }[];
    /** Map from child component name → key in `aliasedElements` providing help. */
    childContextHelp?: Record<string, string>;
};

type SchemaAttribute = SchemaElementForHelp["attributes"][number];
type SchemaProperty = SchemaElementForHelp["properties"][number];

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
            // Aliased entries are looked up via parent `childContextHelp`;
            // placing them in the same map lets the lookup helper reuse one
            // path. Real elements MUST win on collision: an aliased payload
            // only carries the help-relevant fields (name, summary, docsSlug,
            // attributes, properties) — letting one clobber a full schema
            // entry would silently drop `children`, `top`,
            // `acceptsStringChildren`, and `takesIndex`. Today the names are
            // disjoint by construction (alias targets are excludeFromSchema),
            // but this guard preserves the invariant if that ever changes.
            if (map[name]) continue;
            map[name] = aliasedElements[name];
        }
    }
    return map;
}

/**
 * Case-insensitive lookup of a schema element by author-typed name. Schema
 * keys are canonical case, so the exact-match path is the fast common case;
 * the linear scan only runs when the author typed a non-canonical case.
 */
function findSchemaElement(
    schemaMap: SchemaMap,
    name: string,
): SchemaElementForHelp | undefined {
    if (Object.prototype.hasOwnProperty.call(schemaMap, name)) {
        return schemaMap[name];
    }
    const lower = name.toLowerCase();
    for (const key in schemaMap) {
        if (key.toLowerCase() === lower) return schemaMap[key];
    }
    return undefined;
}

function findSchemaAttribute(
    el: SchemaElementForHelp,
    name: string,
): SchemaAttribute | undefined {
    const lower = name.toLowerCase();
    return el.attributes.find((a) => a.name.toLowerCase() === lower);
}

function findSchemaProperty(
    el: SchemaElementForHelp,
    name: string,
): SchemaProperty | undefined {
    const lower = name.toLowerCase();
    return el.properties.find((p) => p.name.toLowerCase() === lower);
}

export function computeContextHelp(
    completer: AutoCompleter,
    offset: number,
    schemaMap: SchemaMap,
): HelpContent {
    const { node, cursorPosition } =
        completer.sourceObj.elementAtOffsetWithContext(offset);

    if (node) {
        const ownEntry = findSchemaElement(schemaMap, node.name);
        const effectiveEntry = resolveEffectiveSchemaElement(
            completer,
            schemaMap,
            node,
            ownEntry,
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
        return helpForPropertyReference(completer, schemaMap, offset, ctx);
    }

    return NONE;
}

/**
 * Resolve which schema entry to use for help lookup, accounting for parent
 * `childContextHelp` aliases (e.g. `<row>` inside `<matrix>` resolves to the
 * `matrixRow` entry). Returns the own entry when no alias applies.
 */
function resolveEffectiveSchemaElement(
    completer: AutoCompleter,
    schemaMap: SchemaMap,
    node: ElementNode,
    ownEntry: SchemaElementForHelp | undefined,
): SchemaElementForHelp | undefined {
    if (!ownEntry) return undefined;

    const parent = completer.sourceObj.getParent(node);
    if (!parent || !("name" in parent)) return ownEntry;

    const parentEntry = findSchemaElement(schemaMap, parent.name);
    if (!parentEntry) return ownEntry;

    const aliasName = parentEntry.childContextHelp?.[ownEntry.name];
    if (aliasName === undefined) return ownEntry;

    return findSchemaElement(schemaMap, aliasName) ?? ownEntry;
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
    ownEntry: SchemaElementForHelp | undefined,
    effectiveEntry: SchemaElementForHelp | undefined,
): HelpContent {
    if (!ownEntry || !effectiveEntry?.summary) return NONE;

    return {
        kind: "element",
        elementName: ownEntry.name,
        summary: effectiveEntry.summary,
        docsSlug: effectiveEntry.docsSlug,
    };
}

function helpForAttribute(
    ownEntry: SchemaElementForHelp | undefined,
    effectiveEntry: SchemaElementForHelp | undefined,
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

    const elementEntry = findSchemaElement(schemaMap, containerNode.name);
    if (!elementEntry) return NONE;

    const prop = findSchemaProperty(elementEntry, propertyName);
    if (!prop?.description) return NONE;

    const result: HelpContent = {
        kind: "property",
        elementName: elementEntry.name,
        propertyName: prop.name,
        description: prop.description,
        isArray: prop.isArray,
    };
    if (prop.type !== undefined) result.type = prop.type;
    return result;
}
