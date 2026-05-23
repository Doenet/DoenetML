import {
    AutoCompleter,
    type AliasedElementSchema,
    type CompletionContext,
    type ElementSchema,
    type SchemaAttribute,
    type SchemaProperty,
} from "../auto-completer";
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

/**
 * Compute the context-help payload for a cursor offset.
 *
 * `precomputedCtx`, when provided, is the completion context for `offset`
 * that the caller has already computed (e.g. the LSP's
 * `prepareForRefContext`, which computes ctx to decide whether to wait for
 * the rust boot).  Passing it avoids a redundant
 * `getCompletionContext` call in the ref-context branches.  Must be valid
 * for the same `offset` and the current document state — pass `undefined`
 * if either may have changed since the ctx was computed.
 */
export async function computeContextHelp(
    completer: AutoCompleter,
    offset: number,
    precomputedCtx?: CompletionContext,
): Promise<HelpContent> {
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

    const ctx = precomputedCtx ?? completer.getCompletionContext(offset);
    if (ctx.cursorPos === "refName") {
        return helpForRefName(completer, offset, ctx);
    }
    if (ctx.cursorPos === "refMember") {
        return await helpForRefMember(completer, offset, ctx);
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

async function helpForRefMember(
    completer: AutoCompleter,
    offset: number,
    ctx: {
        typedPrefix: string;
        replaceFromOffset: number;
        pathParts: string[];
        pathPartHasIndex: boolean[];
        rawPathParts: string[];
    },
): Promise<HelpContent> {
    const memberName = fullIdentifierAtOffset(
        completer.source,
        ctx.replaceFromOffset,
        offset,
        isParenthesizedSegment(completer.source, ctx.replaceFromOffset),
    );
    if (!memberName) return NONE;
    return await helpForRefMemberByName(completer, offset, ctx, memberName);
}

/**
 * Body of ref-member help, parameterized on the member name. The cursor-driven
 * path derives the name from the source text via `fullIdentifierAtOffset`;
 * the completion-driven path passes the autocomplete row's label directly so
 * the help mirrors exactly what would be inserted.
 */
async function helpForRefMemberByName(
    completer: AutoCompleter,
    offset: number,
    ctx: {
        pathParts: string[];
        pathPartHasIndex: boolean[];
        rawPathParts: string[];
    },
    memberName: string,
): Promise<HelpContent> {
    // The Rust resolver (when available) is the source of truth for member
    // resolution. Awaiting this fixes issue #1086: the previous JS-only path
    // both silently dropped the Promise and bypassed the resolver entirely,
    // so chains like `$rep[1].point1.x` never resolved and unindexed access
    // through a `takesIndex` composite (e.g. `$rep.myMath`) incorrectly
    // surfaced help via a separate JS fallback that walked descendants.
    // With the help logic now hosted in the LSP, the resolver IS attached;
    // we respect its verdict in full — including "this path can't be
    // walked", which now correctly yields NONE rather than misleading help.
    const resolved = await completer.resolveRefMemberContainerAtOffset(
        offset,
        ctx.pathParts,
        ctx.pathPartHasIndex,
    );

    const containerNode = resolved.node;
    if (!containerNode) {
        // No-adapter / unresolved path. For deep chains, surface the
        // placeholder so a user staring at `$a.b.c` knows *something* about
        // the cursor position; for shorter chains, just blank the panel.
        if (ctx.pathParts.length > 2) {
            return { kind: "unsupportedRefChain" };
        }
        return NONE;
    }

    // Match runtime ref-resolution precedence: a named descendant of the
    // container shadows a same-named property. Try the descendant first;
    // only fall back to property lookup when no descendant matches.
    //
    // Gate the descendant lookup on the resolver's `visibleDescendantNames`
    // allow-list — for a `takesIndex` composite addressed without an index
    // the resolver returns the composite node but with descendants
    // suppressed (`visibleDescendantNames: []`), since member access must
    // pick an instance via `$rep[N].member`. Without this check the raw
    // tree-walk in `resolveRefMemberDescendantHelp` would still find
    // `myMath` inside the repeat body and surface misleading help —
    // issue #1086 verification checklist item 1.
    const descendantInfo = resolved.visibleDescendantNames.includes(memberName)
        ? completer.resolveRefMemberDescendantHelp(containerNode, memberName)
        : null;
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

    // The container has no named child matching `memberName`. Before
    // falling through to property lookup, check whether the container is a
    // `<repeat>`/`<repeatForSequence>` that introduces `memberName` as a
    // `valueName`/`indexName` binding — the resolver augments
    // `visibleDescendantNames` with these for indexed access (`$r[1].v`)
    // even though they're not in the `name=` attribute tree.  Without this
    // the panel goes blank for `$r[1].v` even though the autocomplete
    // dropdown offered `v` as a completion.
    const derivedOnContainer = completer.resolveDerivedRepeatNameOnElement(
        containerNode,
        memberName,
    );
    if (derivedOnContainer) {
        const ownerEntry = completer.findSchemaElement(containerNode.name);
        const displayPath = [
            ...ctx.rawPathParts.slice(0, -1).map(formatPathSegment),
            formatPathSegment(memberName),
        ].join(".");
        return {
            kind: "refName",
            refName: memberName,
            displayPath,
            targetElementName: containerNode.name,
            summary: ownerEntry?.summary ?? null,
            line: derivedOnContainer.line,
            docsSlug: ownerEntry?.docsSlug ?? null,
            derivedFrom: {
                role: derivedOnContainer.role,
                ownerElementName: containerNode.name,
                ownerLine: derivedOnContainer.line,
            },
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
 * attribute up the parent chain. Repeat-introduced names
 * (`valueName`/`indexName`) miss that walk, so we fall through to
 * `resolveDerivedRepeatNameForHelp` — also AST-only — and annotate the
 * payload with `derivedFrom`. The companion `$r[N].v` case is handled in
 * `helpForRefMemberByName` via `resolveDerivedRepeatNameOnElement`.
 * Multi-part chains *through* repeat-introduced names without an index
 * (e.g. `$v.x`) still depend on the Rust resolver and remain a known gap.
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
    if (resolved) {
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

    // Fall through to the repeat-binding walk. Aligns the help panel with
    // the autocomplete dropdown, which already injects `valueName`/`indexName`
    // via `AutoCompleter.getAdditionalRefNames`.
    const derived = completer.resolveDerivedRepeatNameForHelp(offset, refName);
    if (!derived) return NONE;
    const ownerEntry = completer.findSchemaElement(derived.owner.name);
    return {
        kind: "refName",
        refName,
        displayPath: formatPathSegment(refName),
        // `targetElementName` is the binding's introducer — the only static,
        // always-correct answer (the iteration value's type is dynamic).
        targetElementName: derived.owner.name,
        summary: ownerEntry?.summary ?? null,
        line: derived.line,
        docsSlug: ownerEntry?.docsSlug ?? null,
        derivedFrom: {
            role: derived.role,
            ownerElementName: derived.owner.name,
            ownerLine: derived.line,
        },
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
 *
 * `precomputedCtx` — see `computeContextHelp` for the contract.
 */
export async function computeContextHelpForCompletion(
    completer: AutoCompleter,
    offset: number,
    completion: ContextHelpCompletion,
    precomputedCtx?: CompletionContext,
): Promise<HelpContent> {
    const rawLabel = completion.label;
    if (!rawLabel) return NONE;
    const type = completion.type;

    if (type === "snippet") {
        return helpForSnippet(completer, rawLabel);
    }

    // Computed lazily so the snippet branch above (and any future
    // context-independent kinds) don't pay for a `getCompletionContext`
    // call they don't need.  Only one of the kind-branches below executes
    // per call, so a single helper is enough — no memoization needed.
    const getCtx = (): CompletionContext =>
        precomputedCtx ?? completer.getCompletionContext(offset);

    if (type === "reference") {
        // Strip a leading `$` defensively, then a trailing `[]` — the LSP
        // layer emits an extra `name[]` row for `takesIndex` referents
        // (repeat, select, …) that resolves to the same target as the bare
        // `name` row.  (`[]` is only emitted for bare-ref completions, not
        // member-ref ones, so this stripping is harmless in either branch.)
        let refName = rawLabel.startsWith("$") ? rawLabel.slice(1) : rawLabel;
        if (refName.endsWith("[]")) {
            refName = refName.slice(0, -2);
        }
        // Descendant reference names emitted in a `$container.member`
        // context (see `createReferenceCompletionItems` at the
        // `cursorPos === "refMember"` branch in `get-completion-items.ts`)
        // must resolve via the container, not via a document-wide bare-ref
        // lookup.  This matters in two cases:
        //   - `$r[1].v` where `v` is a `valueName` of the enclosing repeat:
        //     `resolveRefNameForHelp` looks for a `name="v"` element from
        //     the cursor's position (outside the repeat) and finds none,
        //     blanking the help while the dropdown shows `v` as a valid row.
        //   - Ambiguous descendant names: `$sec.bi` when another `bi` lives
        //     elsewhere in the document — the bare-ref path would surface
        //     the wrong one (or NONE, since `getNamedDescendant` requires
        //     uniqueness); the member path correctly resolves through `sec`.
        const ctx = getCtx();
        if (ctx.cursorPos === "refMember") {
            return await helpForRefMemberByName(
                completer,
                offset,
                ctx,
                refName,
            );
        }
        return helpForRefNameByName(completer, offset, refName);
    }

    if (type === "property") {
        // Element schema items, ref-member properties, and close-tag rows
        // all share `kind: Property` in the LSP layer.
        const ctx = getCtx();
        if (ctx.cursorPos === "refMember") {
            return await helpForRefMemberByName(
                completer,
                offset,
                ctx,
                rawLabel,
            );
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
