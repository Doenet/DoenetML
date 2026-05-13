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
            cursorPosition === "attributeValue" ||
            cursorPosition === "openTag" ||
            cursorPosition === "unknown"
        ) {
            // `openTag` and `unknown` both come up at attribute boundary
            // cases — cursor right after `=`, right after an opening
            // quote, or on whitespace between attributes. Which one the
            // parser reports varies with incremental-parse state, so we
            // accept both rather than enumerating lezer-specific mappings.
            // `attributeAtOffset` uses position-containment within an
            // attribute's source range to decide whether the cursor is
            // actually inside an attribute, returning the right thing for
            // any of these cursor positions and `null` otherwise.
            const attr = completer.sourceObj.attributeAtOffset(offset);
            if (attr) {
                const attrHelp = helpForAttribute(
                    ownEntry,
                    effectiveEntry,
                    attr.name,
                );
                if (attrHelp.kind !== "none") return attrHelp;
                // The cursor is inside an attribute the element doesn't know
                // (e.g. typo / unknown attribute like `<math bad`). Fall back
                // to element help so the panel keeps something useful on
                // screen rather than going blank.
                return helpForElement(ownEntry, effectiveEntry);
            }
            if (cursorPosition === "openTag") {
                // Cursor is inside the open tag but not inside any attribute
                // (e.g. `<math |` between attrs). Show element-level help so
                // the panel doesn't blank out.
                return helpForElement(ownEntry, effectiveEntry);
            }
            // `unknown` with no matching attribute can mean many things
            // (e.g. cursor sitting on body text); fall through to the rest
            // of the dispatch rather than guessing.
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

const SIMPLE_IDENT_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;
const BRACKET_INDEX_SUFFIX_REGEX = /(\[[^\]]*\])*$/;

/**
 * Wrap a path segment's name in parens if it isn't a SimpleIdent (e.g.,
 * contains hyphens), mirroring the grammar that requires `$(foo-bar)` over
 * `$foo-bar`. Trailing bracket-index suffixes are kept outside the parens
 * (`rep[1]` stays as `rep[1]`, never `(rep[1])`). Used to format
 * `displayPath` for the help-panel sentence so it renders the same syntax
 * the author would type.
 */
function formatPathSegment(segment: string): string {
    const bracketSuffix = segment.match(BRACKET_INDEX_SUFFIX_REGEX)?.[0] ?? "";
    const baseName = segment.slice(0, segment.length - bracketSuffix.length);
    return SIMPLE_IDENT_REGEX.test(baseName)
        ? segment
        : `(${baseName})${bracketSuffix}`;
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
        // Only declared `validValues` flow into `autocompleteValues` (with
        // per-value descriptions); boolean primitives intentionally omit
        // this row since their attribute description already conveys
        // true/false. Boolean aliases injected via valueForTrue/valueForFalse
        // are kept out of `autocompleteValues` by the schema generator.
        allowedValues: schemaAttr.autocompleteValues,
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
        rawPathParts: string[];
    },
): HelpContent {
    const memberName = fullIdentifierAtOffset(
        completer.source,
        ctx.replaceFromOffset,
        offset,
        isParenthesizedSegment(completer.source, ctx.replaceFromOffset),
    );
    if (!memberName) return NONE;
    return helpForRefMemberByName(completer, offset, ctx, memberName);
}

/**
 * Body of ref-member help, parameterized on the member name. The cursor-driven
 * path derives the name from the source text via `fullIdentifierAtOffset`;
 * the completion-driven path passes the autocomplete row's label directly so
 * the help mirrors exactly what would be inserted.
 */
function helpForRefMemberByName(
    completer: AutoCompleter,
    offset: number,
    ctx: {
        pathParts: string[];
        pathPartHasIndex: boolean[];
        rawPathParts: string[];
    },
    memberName: string,
): HelpContent {
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
        // Use `rawPathParts` for the prefix so authored bracket indices are
        // preserved (`rep[1]` stays as `rep[1]`). Each segment — prefix and
        // cursor — goes through `formatPathSegment` so hyphenated names get
        // re-wrapped in parens (parens are stripped during normalization in
        // `getCompletionContext`).
        const displayPath = [
            ...ctx.rawPathParts.slice(0, -1).map(formatPathSegment),
            formatPathSegment(memberName),
        ].join(".");
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
    return helpForRefNameByName(completer, offset, refName);
}

/**
 * Body of refName help, parameterized on the name. The completion-driven path
 * passes the autocomplete row's label directly (with any leading `$` stripped).
 */
function helpForRefNameByName(
    completer: AutoCompleter,
    offset: number,
    refName: string,
): HelpContent {
    const resolved = completer.resolveRefNameForHelp(offset, refName);
    if (!resolved) return NONE;

    const { referent, line, effectiveEntry } = resolved;
    return {
        kind: "refName",
        refName,
        displayPath: formatPathSegment(refName),
        targetElementName: referent.name,
        summary: effectiveEntry?.summary ?? null,
        line,
        docsSlug: effectiveEntry?.docsSlug ?? null,
    };
}

/**
 * Build help content for a snippet autocomplete row. Looked up by the
 * completion `label`, which equals the snippet's key.
 */
function helpForSnippet(
    completer: AutoCompleter,
    snippetKey: string,
): HelpContent {
    const snippet = completer.findSnippet(snippetKey);
    if (!snippet) return NONE;
    return {
        kind: "snippet",
        snippetKey: snippet.key,
        elementName: snippet.element,
        description: snippet.description,
        snippetText: snippet.snippet,
    };
}

/**
 * Minimal shape we need from a CodeMirror `Completion` — just `label` and
 * `type`. Avoids a direct dep on `@codemirror/autocomplete` from this module
 * (the EditorViewer is responsible for sourcing the completion object).
 */
export type ContextHelpCompletion = {
    label: string;
    type?: string;
};

/**
 * Compute help for the currently-highlighted autocomplete row. Dispatched on
 * `completion.type` (set by the CodeMirror LSP plugin from `CompletionItemKind`,
 * lower-cased). The `"property"` kind is ambiguous (both element schema items
 * and ref-member properties use it) and is disambiguated by inspecting the
 * cursor's completion context.
 */
export function computeContextHelpForCompletion(
    completer: AutoCompleter,
    offset: number,
    completion: ContextHelpCompletion,
): HelpContent {
    const rawLabel = completion.label;
    if (!rawLabel) return NONE;
    const type = completion.type;

    if (type === "snippet") {
        return helpForSnippet(completer, rawLabel);
    }

    if (type === "reference") {
        // Strip a leading `$` defensively, then a trailing `[]` — the LSP
        // layer emits an extra `name[]` row for `takesIndex` referents
        // (repeat, select, …) that resolves to the same target as the bare
        // `name` row.
        let refName = rawLabel.startsWith("$") ? rawLabel.slice(1) : rawLabel;
        if (refName.endsWith("[]")) {
            refName = refName.slice(0, -2);
        }
        return helpForRefNameByName(completer, offset, refName);
    }

    if (type === "property") {
        // Element schema items, ref-member properties, and close-tag rows
        // all share `kind: Property` in the LSP layer.
        const ctx = completer.getCompletionContext(offset);
        if (ctx.cursorPos === "refMember") {
            return helpForRefMemberByName(completer, offset, ctx, rawLabel);
        }
        if (rawLabel.startsWith("/")) {
            // Close-tag completion (label like `/math>`): show help for the
            // element being closed, which is the surrounding element under
            // the cursor — matches what the cursor-driven `closeTagName`
            // path returns.
            const { node } =
                completer.sourceObj.elementAtOffsetWithContext(offset);
            if (!node) return NONE;
            const [ownEntry, effectiveEntry] = resolveEntriesForNode(
                completer,
                node,
            );
            return helpForElement(ownEntry, effectiveEntry);
        }
        // Element schema item.
        const ownEntry = completer.findSchemaElement(rawLabel);
        if (!ownEntry) return NONE;
        // No reliable parent context at the autocomplete row level (the user
        // hasn't yet inserted the element under any parent), so resolve the
        // effective entry against itself.
        const effectiveEntry =
            completer.resolveEffectiveSchemaElement(ownEntry, undefined) ??
            ownEntry;
        return helpForElement(ownEntry, effectiveEntry);
    }

    if (type === "enum") {
        // Attribute-name completion. Look up the surrounding element from the
        // cursor and ask for help for the highlighted attribute.
        const { node } = completer.sourceObj.elementAtOffsetWithContext(offset);
        if (!node) return NONE;
        const [ownEntry, effectiveEntry] = resolveEntriesForNode(
            completer,
            node,
        );
        const attrHelp = helpForAttribute(ownEntry, effectiveEntry, rawLabel);
        // If the highlighted attribute name isn't in the schema, fall back to
        // element help so the panel stays anchored to the element rather than
        // blanking out.
        if (attrHelp.kind !== "none") return attrHelp;
        return helpForElement(ownEntry, effectiveEntry);
    }

    if (type === "value") {
        // Attribute-value completion — there's no per-value help, so fall
        // back to the attribute's description. Use `attributeAtOffset` to
        // find which attribute the value belongs to.
        const { node } = completer.sourceObj.elementAtOffsetWithContext(offset);
        if (!node) return NONE;
        const [ownEntry, effectiveEntry] = resolveEntriesForNode(
            completer,
            node,
        );
        const attr = completer.sourceObj.attributeAtOffset(offset);
        if (attr) {
            const attrHelp = helpForAttribute(
                ownEntry,
                effectiveEntry,
                attr.name,
            );
            if (attrHelp.kind !== "none") return attrHelp;
        }
        // No matching attribute (or the matched attribute isn't in the
        // schema — e.g. `<math bad=foo` where the value popup is driven by
        // the bogus `bad` attribute). Fall back to element help.
        return helpForElement(ownEntry, effectiveEntry);
    }

    return NONE;
}
