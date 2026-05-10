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
    const parentName = parent && "name" in parent ? parent.name : undefined;
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
    if (ctx.cursorPos === "refName") {
        return helpForRefName(completer, offset, ctx);
    }
    if (ctx.cursorPos === "refMember") {
        return helpForRefMember(completer, offset, ctx);
    }

    return NONE;
}

// Mirrors the parser grammar (see `get-completion-context.ts`):
//   SimpleIdent = [A-Za-z_][A-Za-z0-9_]*  — bare `$name`
//   Ident       = [A-Za-z0-9_-]+          — parenthesized `$(foo-bar)`
const SIMPLE_IDENT_CHAR_REGEX = /[A-Za-z0-9_]/;
const MACRO_IDENT_CHAR_REGEX = /[A-Za-z0-9_-]/;

/**
 * The completion context's `typedPrefix` only captures identifier chars BEFORE
 * the cursor. Walk forward from the cursor to also capture chars to the right
 * so that placing the cursor mid-word still resolves the full identifier.
 *
 * Pass `parenthesized: true` when the segment is inside `$(...)` so hyphens
 * are preserved (`$(foo-bar)`). The left bound (`startOffset`) already
 * reflects the right char class because `getCompletionContext` walked back
 * with the macro regex for parenthesized contexts.
 */
function fullIdentifierAtOffset(
    source: string,
    startOffset: number,
    cursorOffset: number,
    parenthesized: boolean = false,
): string {
    const charRegex = parenthesized
        ? MACRO_IDENT_CHAR_REGEX
        : SIMPLE_IDENT_CHAR_REGEX;
    let endOffset = cursorOffset;
    while (
        endOffset < source.length &&
        charRegex.test(source.charAt(endOffset))
    ) {
        endOffset++;
    }
    return source.slice(startOffset, endOffset);
}

/**
 * Detect whether the segment under the cursor sits inside a `$(...)` macro,
 * by checking whether the char immediately before `replaceFromOffset` is `(`.
 * This is the same signal `getCompletionContext` uses to choose the macro
 * char class for `replaceFromOffset` and `typedPrefix`.
 */
function isParenthesizedSegment(
    source: string,
    replaceFromOffset: number,
): boolean {
    return source.charAt(replaceFromOffset - 1) === "(";
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

function helpForRefMember(
    completer: AutoCompleter,
    offset: number,
    ctx: {
        typedPrefix: string;
        replaceFromOffset: number;
        pathParts: string[];
        pathPartHasIndex: boolean[];
    },
): HelpContent {
    const memberName = fullIdentifierAtOffset(
        completer.source,
        ctx.replaceFromOffset,
        offset,
        isParenthesizedSegment(completer.source, ctx.replaceFromOffset),
    );
    if (!memberName) return NONE;

    const resolved = completer.resolveRefMemberContainerAtOffset(
        offset,
        ctx.pathParts,
        ctx.pathPartHasIndex,
    );

    // Fallback to pure-JS resolution for simple `$name.member` when no Rust
    // resolver adapter is configured (browser-only setups). Restricted to
    // length-2 chains because the JS path resolves only `pathParts[0]` and
    // would otherwise look up the cursor identifier on the root referent,
    // producing wrong help for `$a.b.c`. Multi-part resolution is tracked in
    // #1086.
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

    // Match runtime ref-resolution precedence: a named descendant of the
    // container shadows a same-named property. Try the descendant first;
    // only fall back to property lookup when no descendant matches.
    const descendantInfo = completer.resolveRefMemberDescendantHelp(
        containerNode,
        memberName,
    );
    if (descendantInfo) {
        const displayPath = [...ctx.pathParts.slice(0, -1), memberName].join(
            ".",
        );
        return {
            kind: "refName",
            refName: memberName,
            displayPath,
            targetElementName: descendantInfo.referent.name,
            summary: descendantInfo.effectiveEntry?.summary ?? null,
            line: descendantInfo.line,
            docsSlug: descendantInfo.effectiveEntry?.docsSlug ?? null,
        };
    }

    const ownEntry = completer.findSchemaElement(containerNode.name);
    if (!ownEntry) return NONE;

    // Mirror the alias-aware path used by `helpForElement`/`helpForAttribute`
    // and by `$ref.member` autocomplete: a `<row>` inside `<matrix>` looks up
    // its property docs on the `matrixRow` entry, so the panel and the
    // dropdown agree on what each property means in context. Property names
    // and descriptions on alias-only properties (e.g. `maxNumber`) are
    // otherwise invisible to the help panel.
    const parent = completer.sourceObj.getParent(containerNode);
    const parentName = parent && "name" in parent ? parent.name : undefined;
    const effectiveEntry =
        completer.resolveEffectiveSchemaElement(ownEntry, parentName) ??
        ownEntry;

    const prop = findSchemaProperty(effectiveEntry, memberName);
    if (!prop?.description) return NONE;

    const result: HelpContent = {
        kind: "property",
        elementName: ownEntry.name,
        propertyName: prop.name,
        description: prop.description,
        docsSlug: effectiveEntry.docsSlug ?? null,
        isArray: prop.isArray ?? false,
    };
    if (prop.type !== undefined) result.type = prop.type;
    return result;
}

/**
 * Help for a bare `$name` cursor. Uses the AST-only parent-chain walk in
 * `AutoCompleter.resolveRefNameForHelp`, which finds elements via a `name=`
 * attribute up the parent chain. It does NOT see repeat-introduced names
 * (`valueName`/`indexName`) — those need the Rust resolver, which is not
 * wired into the editor's context-help instance. Cursor on a `name` segment
 * inside a deeper chain like `$container.name.descendant` would likewise
 * need resolver-backed multi-part walking. Both gaps are tracked in #1086.
 */
function helpForRefName(
    completer: AutoCompleter,
    offset: number,
    ctx: {
        typedPrefix: string;
        replaceFromOffset: number;
    },
): HelpContent {
    const refName = fullIdentifierAtOffset(
        completer.source,
        ctx.replaceFromOffset,
        offset,
        isParenthesizedSegment(completer.source, ctx.replaceFromOffset),
    );
    if (!refName) return NONE;

    const resolved = completer.resolveRefNameForHelp(offset, refName);
    if (!resolved) return NONE;

    const { referent, line, effectiveEntry } = resolved;
    return {
        kind: "refName",
        refName,
        displayPath: refName,
        targetElementName: referent.name,
        summary: effectiveEntry?.summary ?? null,
        line,
        docsSlug: effectiveEntry?.docsSlug ?? null,
    };
}
