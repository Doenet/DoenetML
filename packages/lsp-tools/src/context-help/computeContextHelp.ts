import type { DastElement } from "@doenet/parser";
import { buildEffectiveMathInputFunctionNames } from "@doenet/utils";
import {
    AutoCompleter,
    type AliasedElementSchema,
    type CompletionContext,
    type ElementSchema,
    type SchemaAttribute,
    type SchemaProperty,
} from "../auto-completer";
import {
    findAttributeKey,
    getElementAttributeValue,
} from "../auto-completer/dast-attribute-utils";
import {
    chaseIndexAliases,
    deepestArrayEntryType,
} from "../auto-completer/index-aliases";
import {
    mergeDeclaredIntoSchemaAttributes,
    type DeclaredModuleAttribute,
} from "../auto-completer/module-attributes";
import {
    detectStylePrefixesFromAttributes,
    isStyleAttributeName,
    relevantStyleKeysForPrefixes,
    resolveActiveStyleAttributeValue,
    resolveActiveStyleBreakdown,
    type ActiveStyleBreakdown,
} from "../style-context/resolve-active-style";
import { rankedChildSuggestions } from "../child-suggestions";
import { COMPLETION_TYPES } from "../completion-types";
import type {
    FunctionNamesBreakdownPayload,
    HelpContent,
    SuggestionItem,
} from "./types";

/**
 * Schema entry shape used by the help layer. Both real elements and aliased
 * help-only entries satisfy it — aliased entries lack the structural fields
 * (`children`, `top`, etc.) but carry the same help-relevant ones.
 */
type SchemaEntryForHelp = ElementSchema | AliasedElementSchema;

const NONE: HelpContent = { kind: "none" };

/** Max suggestions surfaced in the help panel — keeps it scannable. */
const MAX_SUGGESTIONS = 6;

/**
 * Build "what can go here?" help for a cursor in an element body or at the
 * top level. `node` is the containing element (body cursor) or null (top
 * level — handled as if the parent were `<document>`, since the document's
 * child set is exactly the top-level allowed elements). Always returns a
 * `suggestions` payload — even an empty `suggested` list is useful, since
 * the panel then nudges the author toward Ctrl+Space.
 *
 * The actual ordering and snippet inclusion live in `rankedChildSuggestions`,
 * which the autocomplete dropdown consumes via `sortText` — keeping the two
 * surfaces in lockstep is the whole point.
 */
function suggestionsHelp(
    completer: AutoCompleter,
    node: DastElement | null,
): HelpContent {
    const context: { elementName: string } | { topLevel: true } = node
        ? { elementName: node.name }
        : { topLevel: true };
    const parentElementName = node ? node.name : "document";
    const grandparentName = node
        ? completer.sourceObj.getParentElementName(node)
        : undefined;
    const ranked = rankedChildSuggestions(
        completer,
        parentElementName,
        grandparentName,
    );

    // The panel only surfaces element suggestions — snippets stay in the
    // autocomplete dropdown (where they cluster with their element) but are
    // dropped from the 6-chip panel so a single element with many snippets
    // (e.g. `<answer>`) can't crowd out a diverse spread of components.
    // Filter BEFORE slicing so we get the top-6 *elements*, not the top-6
    // ranker items minus whatever snippets happened to fall there.
    const suggested: SuggestionItem[] = ranked
        .filter((item) => item.kind === "element")
        .slice(0, MAX_SUGGESTIONS)
        .map((item) => {
            // Prefer the schema's canonical casing (e.g. `mathInput`) so
            // the chip renders the tag the author would actually type.
            const entry = completer.findSchemaElement(item.name);
            return {
                name: entry?.name ?? item.name,
                summary: entry?.summary ?? null,
                docsSlug: entry?.docsSlug ?? null,
            };
        });

    // `totalAllowed` is the count of allowed element types (what
    // Ctrl+Space's "components" wording refers to), independent of how many
    // snippets the ranker surfaced for this container.
    const totalAllowed = completer._getAllowedChildren(
        parentElementName,
        grandparentName,
    ).length;
    const acceptsStringChildren = completer._getAcceptsStringChildren(
        parentElementName,
        grandparentName,
    );

    return {
        kind: "suggestions",
        context,
        suggested,
        totalAllowed,
        acceptsStringChildren,
    };
}

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
 * For a `<module copy="$x" .../>` site, return a shallow-cloned schema
 * entry whose `attributes` list includes synthesized entries for each
 * per-instance declared name not already in the canonical list.  When the
 * allowlist is absent / empty, returns the input unchanged so the hot
 * path stays a no-op for every other element.
 *
 * Mirrors the merge `get-completion-items.ts` does for the autocomplete
 * dropdown — keeping the two layers consuming the same synthesized
 * entries means the dropdown's component-type-tagged description and
 * the help panel's description can't drift apart (#1154, #1189).
 */
function augmentWithPerInstanceAttributes(
    effective: SchemaEntryForHelp | undefined,
    perInstanceAllowlist:
        | ReadonlyMap<string, DeclaredModuleAttribute>
        | undefined,
): SchemaEntryForHelp | undefined {
    if (
        !effective ||
        !perInstanceAllowlist ||
        perInstanceAllowlist.size === 0
    ) {
        return effective;
    }
    return {
        ...effective,
        attributes: mergeDeclaredIntoSchemaAttributes(
            effective.attributes,
            perInstanceAllowlist,
        ),
    };
}

/**
 * Resolve which schema entry to use for help lookup at `node`, accounting
 * for parent `childContextHelp` aliases (e.g. `<row>` inside `<matrix>`
 * resolves to the `matrixRow` entry). Returns `[ownEntry, effectiveEntry]`
 * where the own entry preserves the authored tag name for the header and
 * the effective entry supplies the alias-redirected description. Both are
 * `undefined` only when the element's tag name isn't in the schema at all.
 *
 * `effectiveEntry` is guaranteed defined whenever `ownEntry` is, since
 * `resolveEffectiveSchemaElement` returns `ownEntry` as its passthrough.
 * Callers that want to branch on whether an alias actually fired can
 * compare `effectiveEntry.name` to `ownEntry.name`.
 */
function resolveEntriesForNode(
    completer: AutoCompleter,
    node: DastElement,
): [ElementSchema | undefined, SchemaEntryForHelp | undefined] {
    const ownEntry = completer.findSchemaElement(node.name);
    const effective = completer.resolveEffectiveSchemaElement(
        ownEntry,
        completer.sourceObj.getParentElementName(node),
    );
    return [ownEntry, effective];
}

/**
 * Variant of `resolveEntriesForNode` for callers that have already resolved a
 * DAST `containerNode` (e.g. from the ref resolver) and need both entries as
 * non-nullable so they can read `.properties` / `.attributes` without a
 * separate nullish check. Returns `null` when the container's tag name isn't
 * in the schema at all.
 */
function resolveEntriesForContainer(
    completer: AutoCompleter,
    containerNode: DastElement,
): { ownEntry: ElementSchema; effectiveEntry: SchemaEntryForHelp } | null {
    const [ownEntry, effectiveEntry] = resolveEntriesForNode(
        completer,
        containerNode,
    );
    // `effectiveEntry` is guaranteed defined whenever `ownEntry` is — see
    // `resolveEntriesForNode`'s docstring.
    if (!ownEntry || !effectiveEntry) return null;
    return { ownEntry, effectiveEntry };
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
    // Ensure the per-instance `<module>` attribute allowlist is fresh
    // before the attribute branch consults it.  Coalesces with the
    // matching call in `getCompletionItems` / `getSchemaViolations` via
    // `_sourceRevision`, so a help request after autocomplete or
    // validation costs no extra resolver round-trips (#1154).
    await completer._refreshModuleInstanceAttributes();

    const { node, cursorPosition } =
        completer.sourceObj.elementAtOffsetWithContext(offset);

    const ctx = precomputedCtx ?? completer.getCompletionContext(offset);

    // A cursor sitting on a `$ref` is on a reference even when that ref lives
    // inside an attribute value (e.g. `<math extend="$m">`). Reference help
    // takes precedence over the enclosing attribute, so the panel explains the
    // reference and its referent rather than the `extend`/`copy` attribute it
    // sits in. Tag-name and attribute-name positions never report a ref
    // context, so they still fall through to the element/attribute branches.
    if (ctx.cursorPos === "refName" || ctx.cursorPos === "refMember") {
        return await helpForReferenceUnit(completer, offset, ctx);
    }

    if (node) {
        const [ownEntry, effectiveEntry] = resolveEntriesForNode(
            completer,
            node,
        );

        if (
            cursorPosition === "openTagName" ||
            cursorPosition === "closeTagName"
        ) {
            return helpForElement(ownEntry, effectiveEntry, {
                completer,
                node,
            });
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
                // For `<module copy="$x" .../>` (or `extend=`) sites, merge
                // per-instance author-declared attribute names into the
                // effective entry's attribute list so `helpForAttribute`
                // finds them by the same lookup it uses for canonical
                // entries.  The synthesized SchemaAttribute carries the
                // shared "Author-declared module attribute (`<type>`)"
                // description (built by `describeDeclaredModuleAttribute`),
                // so the help panel renders the same text the autocomplete
                // dropdown shows for that site (#1154, #1189).  No
                // augmentation applies for non-`<module>` nodes or sites
                // whose reference doesn't resolve to a `<module>` with
                // declared attributes — the canonical effective entry
                // decides as before.
                const helpEntry = augmentWithPerInstanceAttributes(
                    effectiveEntry,
                    completer._moduleInstanceAttributeAllowlist.get(node),
                );
                const attrHelp = helpForAttribute(
                    ownEntry,
                    helpEntry,
                    attr.name,
                    { completer, node },
                );
                if (attrHelp.kind !== "none") return attrHelp;
                // The cursor is inside an attribute the element doesn't know
                // (e.g. typo / unknown attribute like `<math bad`). Fall back
                // to element help so the panel keeps something useful on
                // screen rather than going blank.
                return helpForElement(ownEntry, effectiveEntry, {
                    completer,
                    node,
                });
            }
            if (cursorPosition === "openTag") {
                // Cursor is inside the open tag but not inside any attribute
                // (e.g. `<math |` between attrs). Show element-level help so
                // the panel doesn't blank out.
                return helpForElement(ownEntry, effectiveEntry, {
                    completer,
                    node,
                });
            }
            // `unknown` with no matching attribute can mean many things
            // (e.g. cursor sitting on body text); fall through to the rest
            // of the dispatch rather than guessing.
        }
    }

    // Cursor isn't on a tag, attribute, or reference — it's in an element
    // body or top-level whitespace. Suggest what can go here so the panel
    // always says something useful rather than going blank.
    if (ctx.cursorPos === "body") {
        return suggestionsHelp(completer, node);
    }

    return NONE;
}

/**
 * Characters that can appear in a *bare* `$name`/`$a.b[1].c` macro path:
 * `SimpleIdent` characters (`[A-Za-z0-9_]`), the `.` path separator, and
 * `[`/`]` bracket indices. Hyphens are deliberately excluded — the macro
 * grammar only allows them inside the parenthesized `$(foo-bar)` form
 * (`Ident` in `packages/parser/src/macros/macros.peggy`), not in bare
 * `$name` chains, so `$m-1` should be `$m` followed by literal `-1` rather
 * than one chain ending at `1`. The fallback scan that uses this regex
 * only fires when there is no parsed macro node at the cursor (typically
 * attribute-value macros); the parsed-macro path keys off the node's
 * recorded `end.offset`, which already covers parenthesized form
 * correctly.
 */
const MACRO_PATH_CHAR_REGEX = /[A-Za-z0-9_.[\]]/;

/**
 * End offset of the `$...` macro covering `offset`, or undefined when there's
 * no macro at the cursor. Prefers the parsed macro node's end (which handles
 * `$(...)` parens), and falls back to scanning forward over macro-path
 * characters — the parsed macro node isn't reliably found for macros inside
 * attribute values (e.g. `extend="$m.sub"`), so without this scan the
 * whole-chain unification would break there and a cursor on an early segment
 * would misclassify just that segment.
 */
function macroEndOffset(
    completer: AutoCompleter,
    offset: number,
): number | undefined {
    const source = completer.source;
    const prevChar = source.charAt(offset - 1);
    let macro =
        completer.sourceObj.nodeAtOffset(offset, {
            type: "macro",
            side: "left",
        }) ??
        completer.sourceObj.nodeAtOffset(offset, {
            type: "macro",
            side: "right",
        });
    if (!macro && (prevChar === "." || prevChar === "[")) {
        macro = completer.sourceObj.nodeAtOffset(offset - 1, {
            type: "macro",
            side: "left",
        });
    }
    if (macro?.position?.end?.offset !== undefined) {
        return macro.position.end.offset;
    }
    // No parsed macro node (e.g. an attribute-value macro). Scan forward over
    // macro-path characters to find where the chain ends.
    let end = offset;
    while (
        end < source.length &&
        MACRO_PATH_CHAR_REGEX.test(source.charAt(end))
    ) {
        end++;
    }
    return end > offset ? end : undefined;
}

/**
 * Cursor-driven reference help that treats the whole `$a.b.c` macro as a
 * single unit. The cursor's segment-local context decides only *that* we're
 * in a reference; the actual help is computed from the full chain (resolved
 * from the macro's end offset), so placing the cursor on `a`, `b`, or `c`
 * yields identical help. `cursorCtx` is the segment-local context the
 * dispatcher already computed, used as the fallback when there's no macro
 * node to anchor the whole-chain recomputation.
 */
async function helpForReferenceUnit(
    completer: AutoCompleter,
    offset: number,
    cursorCtx: CompletionContext,
): Promise<HelpContent> {
    let ctx: CompletionContext = cursorCtx;
    let helpOffset = offset;
    const end = macroEndOffset(completer, offset);
    if (end !== undefined && end !== offset) {
        const wholeCtx = completer.getCompletionContext(end);
        if (
            wholeCtx.cursorPos === "refName" ||
            wholeCtx.cursorPos === "refMember"
        ) {
            ctx = wholeCtx;
            helpOffset = end;
        }
    }
    if (ctx.cursorPos === "refMember") {
        return await helpForRefMember(completer, helpOffset, ctx);
    }
    if (ctx.cursorPos === "refName") {
        return await helpForRefName(completer, helpOffset, ctx);
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
/** Global match for individual `[...]` groups so we can count them per segment. */
const BRACKET_INDEX_ALL_REGEX = /\[[^\]]*\]/g;

/**
 * Count the bracket-index groups on a raw path segment — `foo` → 0,
 * `foo[1]` → 1, `controlVectors[0][2]` → 2. Used by the `indexAliases`
 * chase to consume the right number of dimensions per segment (a
 * boolean "has any index" loses the count and under-consumes dims on
 * 3D arrays like `Curve.controlVectors`).
 */
function countBracketIndices(rawSegment: string | undefined): number {
    if (!rawSegment) return 0;
    return rawSegment.match(BRACKET_INDEX_ALL_REGEX)?.length ?? 0;
}

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

/**
 * Compute the `styleBreakdown` field for element help, or undefined when the
 * element isn't a `<styleDefinition>` (the only element kind that surfaces
 * a breakdown, issue #1204).  Unlike the attribute-branch breakdown there's
 * no prefix filter — a `<styleDefinition>`'s purpose is to author the full
 * styleNumber, so the panel mirrors every populated key.  Returns undefined
 * if the resolver yields an empty entry list, so the panel can skip the row
 * rather than render an empty section.
 */
function computeStyleBreakdownForElement(
    ownEntry: ElementSchema,
    ctx: ActiveDefaultContext | undefined,
): ActiveStyleBreakdown | undefined {
    if (!ctx) return undefined;
    if (ownEntry.name !== "styleDefinition") return undefined;
    const breakdown = resolveActiveStyleBreakdown(
        ctx.completer.sourceObj,
        ctx.node,
    );
    if (breakdown.entries.length === 0) return undefined;
    return breakdown;
}

function helpForElement(
    ownEntry: ElementSchema | undefined,
    effectiveEntry: SchemaEntryForHelp | undefined,
    ctx?: ActiveDefaultContext,
): HelpContent {
    if (!ownEntry || !effectiveEntry?.summary) return NONE;

    const styleBreakdown = computeStyleBreakdownForElement(ownEntry, ctx);

    return {
        kind: "element",
        elementName: ownEntry.name,
        summary: effectiveEntry.summary,
        docsSlug: effectiveEntry.docsSlug ?? null,
        ...(styleBreakdown ? { styleBreakdown } : {}),
    };
}

/**
 * Optional context for active-default resolution. The cursor's DAST element
 * and the completer (carrier of the source object) let `helpForAttribute`
 * compute the styleDefinition-resolved value at the cursor's scope and
 * surface it as `activeDefault` when the attribute is a style attribute
 * (issue #1198).
 *
 * Optional because the autocomplete-row paths (`type === "enum"` etc.)
 * always know both — the cursor branch through `computeContextHelp` only
 * has the node when the cursor sits inside an attribute, which is
 * exactly when it should be set.
 */
type ActiveDefaultContext = {
    completer: AutoCompleter;
    node: DastElement;
};

/**
 * Compute the `activeDefault` field for a style attribute, or undefined when
 * the attribute isn't a style attribute, the resolver returns nothing, or
 * the resolved value matches the schema's static `defaultValue` (in which
 * case the existing "Default:" row already conveys it — surfacing both
 * rows with the same value adds noise without information).
 *
 * Inside a `<styleDefinition>` we exclude the styleDefinition itself from
 * the merge so the displayed value reflects what *other* sources (siblings,
 * ancestors, the built-in preset) supply for that styleNumber. This is the
 * "what would this resolve to if I didn't set it here" hint the secondary
 * scope of issue #1198 calls for.
 */
function computeActiveDefaultForAttribute(
    schemaAttr: SchemaAttribute,
    ctx: ActiveDefaultContext | undefined,
):
    | {
          value: string | number | boolean;
          styleNumber: number;
          colorWord?: string;
      }
    | undefined {
    if (!ctx) return undefined;
    if (!isStyleAttributeName(schemaAttr.name)) return undefined;
    // Inside a `<styleDefinition>`, exclude just the queried attribute on
    // this node so the hint answers "what if I removed this attribute"
    // rather than "what if I removed this entire styleDefinition". The
    // resolver still runs runtime per-block derivation on the remaining
    // attributes, so authoring e.g. `markerColor="#123456"` and querying
    // `markerColorWord` surfaces the derived word rather than the
    // inherited preset's stale one.
    const insideStyleDefinition = ctx.node.name === "styleDefinition";
    const resolved = resolveActiveStyleAttributeValue(
        ctx.completer.sourceObj,
        ctx.node,
        schemaAttr.name,
        insideStyleDefinition
            ? {
                  excludeAttribute: {
                      node: ctx.node,
                      attributeName: schemaAttr.name,
                  },
              }
            : undefined,
    );
    if (!resolved) return undefined;
    // Suppress redundant rows when the active value matches the schema's
    // static default. The schema's `defaultValue` is `unknown` and may be a
    // wrapped/encoded shape (e.g. `isMathDefaultValue`); strict equality with
    // a wrapped default would always be false and the suppression would
    // silently stop working. Guard the comparison to the primitive shapes
    // the resolver actually produces — anything else falls through and the
    // row is shown. If a style attribute is ever declared with a wrapped
    // default (no such case exists today), extend this branch with a
    // shape-aware comparison so the row is suppressed when semantically
    // equal.
    const defaultValue = schemaAttr.defaultValue;
    if (
        (typeof defaultValue === "string" ||
            typeof defaultValue === "number" ||
            typeof defaultValue === "boolean") &&
        resolved.value === defaultValue
    ) {
        return undefined;
    }
    // Forward the resolver's optional `colorWord` (set only for non-word
    // color attributes with a value distinct from its derived word). Built
    // as a fresh object so an absent `colorWord` doesn't leak `undefined`
    // into the payload and trip strict-equality assertions in tests.
    const out: {
        value: string | number | boolean;
        styleNumber: number;
        colorWord?: string;
    } = {
        value: resolved.value,
        styleNumber: resolved.styleNumber,
    };
    if (resolved.colorWord !== undefined) out.colorWord = resolved.colorWord;
    return out;
}

/**
 * Compute the `styleBreakdown` field for the attribute help payload, or
 * undefined when the cursor's site isn't a breakdown trigger (issue #1204):
 *   - cursor on the `styleNumber` attribute of any element (graphical or
 *     `<styleDefinition>`), or
 *   - cursor on any attribute inside a `<styleDefinition>`.
 *
 * For graphical components, `includeKeys` is built from the element's own
 * schema attributes — only the style key prefixes the component declares get
 * surfaced (marker* for `<point>`, line* + fill* for `<polygon>`), so the
 * breakdown matches what the runtime actually reads for that componentType.
 * For `<styleDefinition>` and any element whose schema lists every style
 * attribute (no narrower filter to apply), the breakdown surfaces every
 * populated key for the active styleNumber.
 *
 * Inside a `<styleDefinition>` we deliberately do NOT pass
 * `excludeAttribute` for the breakdown — the panel's role here is "show me
 * what this styleDefinition currently produces", so the author's own
 * contributions must remain in the merge.  The single-attribute
 * `activeDefault` row (computed separately) is the place where the cursor's
 * attribute IS excluded — the two rows answer different questions and
 * shouldn't share an exclusion rule.
 */
function computeStyleBreakdownForAttribute(
    elementName: string,
    effectiveEntry: SchemaEntryForHelp,
    schemaAttr: SchemaAttribute,
    ctx: ActiveDefaultContext | undefined,
): ActiveStyleBreakdown | undefined {
    if (!ctx) return undefined;
    const insideStyleDefinition = elementName === "styleDefinition";
    const cursorOnStyleNumber = schemaAttr.name === "styleNumber";
    if (!insideStyleDefinition && !cursorOnStyleNumber) return undefined;
    // For an element whose schema enumerates every style attribute (i.e.
    // `<styleDefinition>`), we don't apply a per-prefix filter — that
    // element's purpose is to author the full styleNumber, so the help
    // panel should mirror it in full.  For every other element with a
    // styleNumber attribute, narrow to the prefixes the component actually
    // declares; an empty prefix set (component has no style override
    // attributes at all, e.g. a plain `<text>`) gives an empty breakdown
    // and we skip the row.
    const includeKeys = insideStyleDefinition
        ? undefined
        : relevantStyleKeysForPrefixes(
              detectStylePrefixesFromAttributes(
                  effectiveEntry.attributes.map((a) => a.name),
              ),
          );
    if (includeKeys && includeKeys.length === 0) return undefined;
    const breakdown = resolveActiveStyleBreakdown(
        ctx.completer.sourceObj,
        ctx.node,
        includeKeys ? { includeKeys } : undefined,
    );
    if (breakdown.entries.length === 0) return undefined;
    // The resolver already emits entries in the shape the help payload
    // promises (`{key, value, colorWord?}` with `colorWord` only present
    // when defined), so we can hand them through verbatim — no repacking.
    return breakdown;
}

/**
 * Names of the `<mathInput>` attributes whose help payload carries a
 * resolved function-names breakdown (issue #1205). Lowercased so the
 * attribute-name comparison stays case-insensitive — the schema lookup
 * elsewhere in this file is already case-folded.
 */
const MATH_INPUT_FUNCTION_NAME_ATTRS: ReadonlySet<string> = new Set([
    "additionalfunctionnames",
    "removedfunctionnames",
    "resetfunctionnames",
]);

/**
 * Read a `textList`-shaped attribute on a DAST element by splitting its
 * source text on whitespace, mirroring how the runtime parses these
 * attributes (`TextListFromString`). Returns an empty array if the
 * attribute is absent or its text content is blank.
 *
 * Duplicate entries are dropped (first occurrence wins). The shared
 * resolver `buildEffectiveMathInputFunctionNames` already dedupes its
 * inputs, but the help payload also surfaces these lists directly to
 * the panel as React chip lists keyed by name — two identical names
 * would otherwise produce duplicate React keys. Deduping at the read
 * site keeps the contract documented on `FunctionNamesBreakdownPayload`
 * (dedupe applied) consistent with what callers actually receive.
 */
function readTextListAttribute(
    element: DastElement,
    attributeName: string,
): string[] {
    const value = getElementAttributeValue(element, attributeName);
    if (value === undefined) return [];
    const seen = new Set<string>();
    const out: string[] = [];
    for (const entry of value.split(/\s+/)) {
        if (entry.length === 0 || seen.has(entry)) continue;
        seen.add(entry);
        out.push(entry);
    }
    return out;
}

/**
 * Build the `functionNamesBreakdown` payload for a `<mathInput>` cursor
 * sitting on one of the three function-name attributes — all the
 * authored lists are read off the same element, then merged via the
 * shared helper so the LSP and the renderer can't drift apart on the
 * resolution rule.
 *
 * Returns undefined when the cursor isn't on one of the trigger
 * attributes or when the AST context is missing — every other attribute
 * help payload leaves this field absent.
 *
 * `resetFunctionNames` is detected by *presence* (via `findAttributeKey`),
 * not just non-empty text, so `resetFunctionNames=""` correctly resolves
 * to an empty effective list — matching the runtime's `defaultValue:
 * null` semantics where attribute-absent and authored-empty are distinct.
 */
function computeFunctionNamesBreakdownForAttribute(
    elementName: string,
    schemaAttr: SchemaAttribute,
    ctx: ActiveDefaultContext | undefined,
): FunctionNamesBreakdownPayload | undefined {
    if (!ctx) return undefined;
    if (elementName !== "mathInput") return undefined;
    if (!MATH_INPUT_FUNCTION_NAME_ATTRS.has(schemaAttr.name.toLowerCase())) {
        return undefined;
    }
    const added = readTextListAttribute(ctx.node, "additionalFunctionNames");
    const removed = readTextListAttribute(ctx.node, "removedFunctionNames");
    const resetAuthored =
        findAttributeKey(ctx.node, "resetFunctionNames") !== undefined;
    const reset = resetAuthored
        ? readTextListAttribute(ctx.node, "resetFunctionNames")
        : null;
    // The helper also returns per-attribute lists of tokens it had
    // to drop for failing MathQuill's `autoOperatorNames` validator
    // (`droppedFromAdditional` / `droppedFromReset`). The worker
    // emits diagnostics for those; the help panel surfaces the
    // unfiltered `added`/`removed`/`reset` lists below, so the author
    // already sees what they wrote — no need to re-route the dropped
    // lists through the payload.
    const { names } = buildEffectiveMathInputFunctionNames({
        additional: added,
        removed,
        reset,
    });
    return {
        names,
        added,
        removed,
        ...(reset !== null ? { reset } : {}),
    };
}

function helpForAttribute(
    ownEntry: ElementSchema | undefined,
    effectiveEntry: SchemaEntryForHelp | undefined,
    rawAttributeName: string,
    activeDefaultCtx?: ActiveDefaultContext,
): HelpContent {
    if (!ownEntry || !effectiveEntry) return NONE;

    const schemaAttr = findSchemaAttribute(effectiveEntry, rawAttributeName);
    if (!schemaAttr?.description) return NONE;

    const activeDefault = computeActiveDefaultForAttribute(
        schemaAttr,
        activeDefaultCtx,
    );

    const styleBreakdown = computeStyleBreakdownForAttribute(
        ownEntry.name,
        effectiveEntry,
        schemaAttr,
        activeDefaultCtx,
    );

    const functionNamesBreakdown = computeFunctionNamesBreakdownForAttribute(
        ownEntry.name,
        schemaAttr,
        activeDefaultCtx,
    );

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
        ...(activeDefault ? { activeDefault } : {}),
        ...(styleBreakdown ? { styleBreakdown } : {}),
        ...(functionNamesBreakdown ? { functionNamesBreakdown } : {}),
    };
}

/**
 * Try to build an `arrayEntry` help payload from a partially-resolved
 * container plus the resolver's unresolved trailing segments.
 *
 * Inputs:
 *   - `containerNode`: the deepest node the rust resolver did resolve
 *     (e.g. `<vector name="v">`). Null when nothing resolved.
 *   - `unresolvedPathParts`: trailing segment names the resolver couldn't
 *     walk (e.g. `["head"]` for `$v.head.x`). The first entry, when
 *     present, is the candidate array-prop name to chase.
 *   - `ctx`: the caller's `{pathParts, pathPartHasIndex, rawPathParts}`,
 *     used to align bracket-index flags with the unresolved segments and
 *     to build the panel's display path.
 *   - `memberName`: the cursor segment (e.g. `"x"`), already extracted by
 *     `helpForRefMemberByName`.
 *
 * Returns null when no chase applies — the caller then falls back to the
 * unsupported-chain placeholder or NONE.
 */
function tryArrayEntryHelp(
    completer: AutoCompleter,
    containerNode: DastElement | null,
    unresolvedPathParts: string[],
    ctx: {
        pathParts: string[];
        pathPartHasIndex: boolean[];
        rawPathParts: string[];
    },
    memberName: string,
): HelpContent | null {
    if (!containerNode || unresolvedPathParts.length === 0) return null;

    const arrayName = unresolvedPathParts[0];
    // Use the alias-aware property lookup (a `<row>` inside `<matrix>` reads
    // its property docs from `matrixRow`) so the array prop and its docs are
    // found the same way the regular property branch below finds them.
    const entries = resolveEntriesForContainer(completer, containerNode);
    if (!entries) return null;
    const { ownEntry, effectiveEntry } = entries;

    const arrayProp = effectiveEntry.properties?.find(
        (p) => p.name.toLowerCase() === arrayName.toLowerCase(),
    );
    if (!arrayProp) return null;

    // Locate the array-prop segment in the caller's path. `pathParts` is
    //   [...resolvedSegments, ...unresolvedPathParts, memberName]
    // so the array-prop segment lives at
    //   pathParts.length - 1 - unresolvedPathParts.length
    // (the last entry is always `memberName`). `rawPathParts` is
    // position-aligned with `pathParts` and preserves bracket indices
    // verbatim, so we count brackets per raw segment to consume the
    // correct number of dims (a single boolean would under-consume on
    // 3D arrays where one segment carries `[i][j]`).
    const arrayPropPathIndex =
        ctx.pathParts.length - 1 - unresolvedPathParts.length;
    if (arrayPropPathIndex < 0) return null;

    // Build the segment list the chase walks. First entry is the array
    // prop itself; subsequent entries are the remaining unresolved parts
    // plus the cursor segment, each carrying its bracket-index count
    // pulled from `rawPathParts`.
    const segments: Array<{ name: string; numIndices: number }> = [
        {
            name: arrayName,
            numIndices: countBracketIndices(
                ctx.rawPathParts[arrayPropPathIndex],
            ),
        },
    ];
    for (let i = 1; i < unresolvedPathParts.length; i++) {
        segments.push({
            name: unresolvedPathParts[i],
            numIndices: countBracketIndices(
                ctx.rawPathParts[arrayPropPathIndex + i],
            ),
        });
    }
    segments.push({
        name: memberName,
        numIndices: countBracketIndices(
            ctx.rawPathParts[ctx.pathParts.length - 1],
        ),
    });

    const chased = chaseIndexAliases(arrayProp, segments);
    if (!chased) return null;

    // Pre-render the title's access tail from `rawPathParts` so the
    // author's literal bracket-index values survive (e.g. `points[1].x`
    // rather than `points[…].x`, and `arr[0][2].z` rather than collapsing
    // both indices). `rawPathParts` is position-aligned with `pathParts`,
    // so slicing from `arrayPropPathIndex` picks the array-prop segment
    // through the cursor's `memberName`. Hyphenated names are paren-wrapped
    // by `formatPathSegment` so the rendering matches what the author
    // would actually have to type.
    const displayTail = ctx.rawPathParts
        .slice(arrayPropPathIndex)
        .map(formatPathSegment)
        .join(".");

    return {
        kind: "arrayEntry",
        elementName: ownEntry.name,
        arrayName: arrayProp.name,
        aliasPath: chased.aliasPath,
        displayTail,
        // `description` is required on the schema-generator side (the
        // generator throws if any public state var is missing one), but the
        // local lsp-tools `SchemaProperty` type marks it optional — fall
        // back to "" so the panel still renders the title/coordinates row
        // even if a bespoke test schema omits it.
        description: arrayProp.description ?? "",
        leafType: deepestArrayEntryType(arrayProp),
        docsSlug: effectiveEntry.docsSlug ?? null,
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
 * Build the `displayPath` for a member-help payload by joining the raw path
 * prefix (with authored bracket indices preserved) and replacing the final
 * segment with the resolved `memberName`. Every segment is passed through
 * `formatPathSegment` so hyphenated names get re-wrapped in parens
 * (`getCompletionContext` strips parens during normalization).
 */
function buildMemberDisplayPath(
    rawPathParts: readonly string[],
    memberName: string,
): string {
    return [
        ...rawPathParts.slice(0, -1).map(formatPathSegment),
        formatPathSegment(memberName),
    ].join(".");
}

/**
 * When a member chain fails to resolve, ask the resolver to classify the
 * WHOLE chain and, for an authoritative `notFound` / `multiple` verdict,
 * build an `unresolvedRef` payload reported against the full reference (e.g.
 * `s2.m`). Returns null for `found` / `indeterminate` so the caller keeps its
 * existing fallback (blank panel, or the "multi-part not supported"
 * placeholder) rather than over-claiming when the resolver can't decide.
 */
async function unresolvedRefForChain(
    completer: AutoCompleter,
    offset: number,
    ctx: { pathParts: string[]; rawPathParts: string[] },
): Promise<HelpContent | null> {
    const reason = await completer.classifyReference(offset, ctx.pathParts);
    if (reason !== "notFound" && reason !== "multiple") return null;
    return {
        kind: "unresolvedRef",
        displayPath: ctx.rawPathParts.map(formatPathSegment).join("."),
        reason,
    };
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
        // Before declaring the chain unresolved, see whether it's a
        // coordinate-style access through an array property's `indexAliases`
        // table (e.g. `$vector.head.x`, `$line.points[1].x`). The resolver
        // exposes the deepest node it DID resolve as `partiallyResolvedNode`
        // and the trailing unresolved segments as `unresolvedPathParts`.
        // The first unresolved segment, plus the cursor's `memberName`, plus
        // any indices authored on the way, give us the chain to walk against
        // the schema's alias table. Issue #1180.
        const arrayEntry = tryArrayEntryHelp(
            completer,
            resolved.partiallyResolvedNode ?? null,
            resolved.unresolvedPathParts,
            ctx,
            memberName,
        );
        if (arrayEntry) return arrayEntry;

        // The chain doesn't resolve to a container. Ask the resolver to
        // classify the WHOLE chain so we can say "no referent" / "multiple
        // referents" for e.g. `$m.sub` (where `$m` itself fails) rather than
        // blanking — reported against the full reference, not one segment.
        const unresolved = await unresolvedRefForChain(completer, offset, ctx);
        if (unresolved) return unresolved;

        // No-adapter / inconclusive path. For deep chains, surface the
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
        return {
            kind: "refName",
            refName: memberName,
            displayPath: buildMemberDisplayPath(ctx.rawPathParts, memberName),
            targetElementName: descendantInfo.referent.name,
            line: descendantInfo.line,
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
        return {
            kind: "refName",
            refName: memberName,
            displayPath: buildMemberDisplayPath(ctx.rawPathParts, memberName),
            targetElementName: containerNode.name,
            line: derivedOnContainer.line,
            derivedFrom: {
                role: derivedOnContainer.role,
                ownerElementName: containerNode.name,
                ownerLine: derivedOnContainer.line,
            },
        };
    }

    // Use the alias-aware lookup (a `<row>` inside `<matrix>` reads its
    // property docs from `matrixRow`) so the panel and the `$ref.member`
    // dropdown agree on what each property means in context. Property names
    // and descriptions on alias-only properties (e.g. `maxNumber`) would
    // otherwise be invisible to the help panel.
    const entries = resolveEntriesForContainer(completer, containerNode);
    if (!entries) return NONE;
    const { ownEntry, effectiveEntry } = entries;

    const prop = findSchemaProperty(effectiveEntry, memberName);
    if (!prop?.description) {
        // The container resolved but the member matches no descendant or
        // property. Classify the whole chain so an authoritatively bad member
        // (e.g. `$s2.m` where `m` is ambiguous) reports "multiple referents"
        // for the full reference rather than blanking the panel.
        const unresolved = await unresolvedRefForChain(completer, offset, ctx);
        if (unresolved) return unresolved;
        return NONE;
    }

    // The help describes the *reference* `$container.member`, so carry the
    // full authored chain for the panel sentence and the container's source
    // line for the location, regardless of which segment the cursor is on.
    const result: HelpContent = {
        kind: "property",
        elementName: ownEntry.name,
        propertyName: prop.name,
        description: prop.description,
        displayPath: buildMemberDisplayPath(ctx.rawPathParts, memberName),
        isArray: prop.isArray ?? false,
    };
    if (prop.type !== undefined) result.type = prop.type;
    const line = elementStartLine(completer, containerNode);
    if (line !== undefined) result.line = line;
    return result;
}

/**
 * 1-indexed source line of an element's opening tag, recomputed from its
 * byte offset against the live source (mirrors `_buildRefHelpInfo`, which
 * avoids trusting synthetic `position.start.line` values stamped by sugar
 * transformations). Undefined when the node has no usable position.
 */
function elementStartLine(
    completer: AutoCompleter,
    node: DastElement,
): number | undefined {
    const startOffset = node.position?.start.offset;
    if (startOffset == null || startOffset >= completer.source.length) {
        return undefined;
    }
    return completer.sourceObj.offsetToRowCol(startOffset).line;
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
async function helpForRefName(
    completer: AutoCompleter,
    offset: number,
    ctx: {
        typedPrefix: string;
        replaceFromOffset: number;
    },
): Promise<HelpContent> {
    const refName = fullIdentifierAtOffset(
        completer.source,
        ctx.replaceFromOffset,
        offset,
        isParenthesizedSegment(completer.source, ctx.replaceFromOffset),
    );
    if (!refName) return NONE;
    return await helpForRefNameByName(completer, offset, refName);
}

/**
 * Body of refName help, parameterized on the name. The completion-driven path
 * passes the autocomplete row's label directly (with any leading `$` stripped).
 */
async function helpForRefNameByName(
    completer: AutoCompleter,
    offset: number,
    refName: string,
): Promise<HelpContent> {
    const resolved = completer.resolveRefNameForHelp(offset, refName);
    if (resolved) {
        const { referent, line } = resolved;
        return {
            kind: "refName",
            refName,
            displayPath: formatPathSegment(refName),
            targetElementName: referent.name,
            line,
        };
    }

    // Fall through to the repeat-binding walk. Aligns the help panel with
    // the autocomplete dropdown, which already injects `valueName`/`indexName`
    // via `AutoCompleter.getAdditionalRefNames`.
    const derived = completer.resolveDerivedRepeatNameForHelp(offset, refName);
    if (derived) {
        return {
            kind: "refName",
            refName,
            displayPath: formatPathSegment(refName),
            // `targetElementName` is the binding's introducer — the only static,
            // always-correct answer (the iteration value's type is dynamic).
            targetElementName: derived.owner.name,
            line: derived.line,
            derivedFrom: {
                role: derived.role,
                ownerElementName: derived.owner.name,
                ownerLine: derived.line,
            },
        };
    }

    // Neither the AST walk nor the repeat-binding walk found a referent. Ask
    // the Rust resolver — the runtime's own algorithm — to classify why, so
    // the panel can say "no referent" / "multiple referents" only when that's
    // authoritatively true. When the resolver isn't available or is
    // inconclusive we get `indeterminate` and the panel hedges instead of
    // misattributing an incomplete-view miss to the author's reference. A
    // `found` verdict means the reference IS valid but the AST-only help
    // builder couldn't enrich it (a known gap) — fall back to the neutral
    // placeholder rather than flagging a valid reference.
    const reason = await completer.classifyReference(offset, [refName]);
    if (reason === "found") return NONE;
    return {
        kind: "unresolvedRef",
        displayPath: formatPathSegment(refName),
        reason,
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
 * `completion.type`, which the CodeMirror LSP plugin assigns in
 * `deriveCompletionType` (`extensions/lsp/plugin.ts`). Most types map 1:1 to a
 * kind of help; the element family — `"component"`, `"refproperty"`, and
 * `"closetag"` (all `kind: Property` in the LSP layer, split apart for the
 * dropdown icons) — shares one branch and is disambiguated there by the
 * cursor's completion context and the label's `/` prefix. The pre-split
 * `"property"` string is still accepted as a fallback. Keep this dispatch in
 * sync with `deriveCompletionType`.
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

    if (type === COMPLETION_TYPES.snippet) {
        return helpForSnippet(completer, rawLabel);
    }

    // The attribute-row branches (`enum` for attribute names, `value` for
    // attribute values) consult the per-instance `<module>` attribute
    // allowlist via `augmentWithPerInstanceAttributes` so the help panel
    // shows the same author-declared attribute description the dropdown
    // surfaced.  Refresh once up front — coalesced against the matching
    // calls in `getCompletionItems` and `computeContextHelp` via
    // `_sourceRevision`, so this is a no-op when those ran for the same
    // edit (the dropdown that produced `completion` always ran
    // `getCompletionItems` first).
    await completer._refreshModuleInstanceAttributes();

    // Computed lazily so the snippet branch above (and any future
    // context-independent kinds) don't pay for a `getCompletionContext`
    // call they don't need.  Only one of the kind-branches below executes
    // per call, so a single helper is enough — no memoization needed.
    const getCtx = (): CompletionContext =>
        precomputedCtx ?? completer.getCompletionContext(offset);

    if (type === COMPLETION_TYPES.reference) {
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
        return await helpForRefNameByName(completer, offset, refName);
    }

    if (
        type === COMPLETION_TYPES.component ||
        type === COMPLETION_TYPES.referenceProperty ||
        type === COMPLETION_TYPES.closeTag ||
        type === "property"
    ) {
        // Element schema items, ref-member properties, and close-tag rows all
        // share `kind: Property` in the LSP layer; the CodeMirror plugin's
        // `deriveCompletionType` then splits that single kind into the
        // distinct `type` strings above (so each gets its own dropdown icon).
        // They're handled together here and disambiguated below by cursor
        // context and the label's `/` prefix — exactly as when they shared the
        // legacy `"property"` type (still accepted as a fallback).
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
            return helpForElement(ownEntry, effectiveEntry, {
                completer,
                node,
            });
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

    if (type === COMPLETION_TYPES.attributeName) {
        // Attribute-name completion. Look up the surrounding element from the
        // cursor and ask for help for the highlighted attribute.  Mirrors the
        // cursor-driven attribute branch in `computeContextHelp`: a
        // `<module copy="$x" .../>` site's effective schema gets the
        // per-instance author-declared attributes folded in so the dropdown
        // documentation and the help panel share the same description
        // (#1154, #1189).
        const { node } = completer.sourceObj.elementAtOffsetWithContext(offset);
        if (!node) return NONE;
        const [ownEntry, effectiveEntry] = resolveEntriesForNode(
            completer,
            node,
        );
        const helpEntry = augmentWithPerInstanceAttributes(
            effectiveEntry,
            completer._moduleInstanceAttributeAllowlist.get(node),
        );
        const attrHelp = helpForAttribute(ownEntry, helpEntry, rawLabel, {
            completer,
            node,
        });
        // If the highlighted attribute name isn't in the schema, fall back to
        // element help so the panel stays anchored to the element rather than
        // blanking out.
        if (attrHelp.kind !== "none") return attrHelp;
        return helpForElement(ownEntry, effectiveEntry, { completer, node });
    }

    if (type === COMPLETION_TYPES.attributeValue) {
        // Attribute-value completion — there's no per-value help, so fall
        // back to the attribute's description. Use `attributeAtOffset` to
        // find which attribute the value belongs to.  Apply the same
        // per-instance attribute augmentation as the `enum` branch so a
        // value-row cursor inside an author-declared attribute (e.g.
        // `<module copy="$m" center="(|" />`) still surfaces the declared
        // attribute's description rather than blanking out (#1154, #1189).
        const { node } = completer.sourceObj.elementAtOffsetWithContext(offset);
        if (!node) return NONE;
        const [ownEntry, effectiveEntry] = resolveEntriesForNode(
            completer,
            node,
        );
        const helpEntry = augmentWithPerInstanceAttributes(
            effectiveEntry,
            completer._moduleInstanceAttributeAllowlist.get(node),
        );
        const attr = completer.sourceObj.attributeAtOffset(offset);
        if (attr) {
            const attrHelp = helpForAttribute(ownEntry, helpEntry, attr.name, {
                completer,
                node,
            });
            if (attrHelp.kind !== "none") return attrHelp;
        }
        // No matching attribute (or the matched attribute isn't in the
        // schema — e.g. `<math bad=foo` where the value popup is driven by
        // the bogus `bad` attribute). Fall back to element help.
        return helpForElement(ownEntry, effectiveEntry, { completer, node });
    }

    return NONE;
}
