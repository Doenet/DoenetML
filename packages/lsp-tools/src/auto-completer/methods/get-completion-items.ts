import { DoenetSourceObject, RowCol } from "../../doenet-source-object";
import {
    ATTR_VALUE_CHAR,
    scanBareValueRun,
} from "../../doenet-source-object/methods/attribute-helpers";
import type { CompletionContext } from "./get-completion-context";
import type {
    CompletionItem,
    MarkupContent,
    Range,
} from "vscode-languageserver/browser";
import { CompletionItemKind, MarkupKind } from "vscode-languageserver/browser";
import type {
    CompletionSnippetCompletionItemData,
    CompletionSnippetCursor,
} from "@doenet/static-assets/completion-snippet-protocol";
import type { DastElement } from "@doenet/parser";
import { AutoCompleter } from "../index";
import { walkIndexAliases } from "../index-aliases";
import { hasImplicitSingleIndex } from "../select-family";
import { getElementAttributeValue } from "../dast-attribute-utils";
import { generateAnnotationSkeletonSnippet } from "./generate-annotation-skeleton";

// LSP's CompletionItem has no `displayLabel` field, but @codemirror/autocomplete
// supports one for "show this, filter on label". Our in-process LSP transport
// preserves unknown fields, so we attach it as an optional extension and the
// CodeMirror plugin forwards it through.
type DoenetCompletionItem = CompletionItem & { displayLabel?: string };

// Keep these aligned with parser grammar in `packages/parser/src/macros/macros.peggy`:
// - SimpleIdent = [a-zA-Z_][a-zA-Z0-9_]*
const SIMPLE_IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;

/**
 * Wrap schema description text as markdown so LSP clients render inline code
 * (e.g. `` `<answer>` ``) as code rather than literal backticks. Schema text
 * already uses markdown conventions; we just need to advertise it.
 */
function asMarkdown(text: string): MarkupContent {
    return { kind: MarkupKind.Markdown, value: text };
}

/** Global match for individual `[...]` groups; used to count brackets per raw segment. */
const BRACKET_INDEX_ALL_REGEX = /\[[^\]]*\]/g;

/**
 * Count the bracket-index groups on a raw path segment — `foo` → 0,
 * `foo[1]` → 1, `controlVectors[0][2]` → 2. Mirrors
 * `computeContextHelp.countBracketIndices` so the autocomplete chase
 * consumes the same number of dimensions the help chase does.
 */
function countBracketIndices(rawSegment: string | undefined): number {
    if (!rawSegment) return 0;
    return rawSegment.match(BRACKET_INDEX_ALL_REGEX)?.length ?? 0;
}

/**
 * Get the name of the parent of `node`, or `undefined` when the parent is the
 * document root (no `name` field).
 */
function getParentName(
    autoCompleter: AutoCompleter,
    node: DastElement,
): string | undefined {
    const parent = autoCompleter.sourceObj.getParent(node);
    return parent && "name" in parent ? parent.name : undefined;
}

/**
 * Create an LSP Range from source offset positions.
 * Converts character offset positions in the source string to an LSP Range
 * with 0-based line and character positions suitable for textEdit operations.
 *
 * Note: DoenetSourceObject uses 1-based line/column positions, while LSP uses
 * 0-based line/character positions. This function handles the conversion.
 *
 * @param sourceObj - The DoenetSourceObject to query position information
 * @param startOffset - The starting character offset in the source string
 * @param endOffset - The ending character offset in the source string
 * @returns An LSP Range with 0-based line and character positions
 */
function createTextEditRange(
    sourceObj: DoenetSourceObject,
    startOffset: number,
    endOffset: number,
): Range {
    const start = sourceObj.offsetToRowCol(startOffset);
    const end = sourceObj.offsetToRowCol(endOffset);
    return {
        start: {
            line: start.line - 1,
            character: start.column - 1,
        },
        end: {
            line: end.line - 1,
            character: end.column - 1,
        },
    };
}

/**
 * Format a multiline snippet by adding indentation to subsequent lines.
 * The indentation matches the column position where the snippet starts,
 * ensuring proper alignment of multiline snippet content.
 *
 * @param sourceObj - The DoenetSourceObject to query position information
 * @param startOffset - The offset where the snippet will be inserted
 * @param snippet - The snippet text to format
 * @returns The formatted snippet plus the indentation width used
 */
function formatSnippetWithIndent(
    sourceObj: DoenetSourceObject,
    startOffset: number,
    snippet: string,
): { formattedSnippet: string; indentSize: number } {
    if (!snippet.includes("\n")) {
        return { formattedSnippet: snippet, indentSize: 0 };
    }

    const startPos = sourceObj.offsetToRowCol(startOffset);
    const indentSize = Math.max(0, startPos.column - 1);
    if (indentSize === 0) {
        return { formattedSnippet: snippet, indentSize: 0 };
    }

    const indent = " ".repeat(indentSize);
    const lines = snippet.split("\n");
    for (let i = 1; i < lines.length; i += 1) {
        lines[i] = indent + lines[i];
    }
    return {
        formattedSnippet: lines.join("\n"),
        indentSize,
    };
}

/**
 * Shift an offset to account for indentation inserted after each newline.
 */
function adjustOffsetForIndent(
    snippet: string,
    offset: number,
    indentSize: number,
) {
    if (indentSize <= 0 || !snippet.includes("\n")) {
        return offset;
    }

    let adjustedOffset = offset;
    for (let i = 0; i < snippet.length; i += 1) {
        if (snippet[i] === "\n") {
            const nextLineStart = i + 1;
            if (offset >= nextLineStart) {
                adjustedOffset += indentSize;
            }
        }
    }

    return adjustedOffset;
}

/**
 * Shift snippet cursor offsets to account for inserted indentation.
 */
function adjustCursorForIndent(
    snippet: string,
    cursor: CompletionSnippetCursor,
    indentSize: number,
): CompletionSnippetCursor {
    if ("caretOffset" in cursor) {
        return {
            caretOffset: adjustOffsetForIndent(
                snippet,
                cursor.caretOffset,
                indentSize,
            ),
        };
    }

    return {
        selectionStartOffset: adjustOffsetForIndent(
            snippet,
            cursor.selectionStartOffset,
            indentSize,
        ),
        selectionEndOffset: adjustOffsetForIndent(
            snippet,
            cursor.selectionEndOffset,
            indentSize,
        ),
    };
}

/**
 * Create snippet completion items from an array of processed snippets.
 * Each snippet is converted to a CompletionItem with a textEdit that replaces
 * from startOffset to endOffset with the (properly indented) snippet text.
 *
 * @param sourceObj - The DoenetSourceObject for position calculations
 * @param snippets - Array of processed snippets to convert to completion items
 * @param startOffset - The starting offset for the textEdit range (typically the '<' position)
 * @param endOffset - The ending offset for the textEdit range (typically the cursor position)
 * @returns Array of CompletionItems representing the snippets
 */
function createSnippetCompletionItems(
    sourceObj: DoenetSourceObject,
    snippets: Array<{
        key: string;
        snippet: string;
        description: string;
        cursor?: CompletionSnippetCursor;
    }>,
    startOffset: number,
    endOffset: number,
): CompletionItem[] {
    return snippets.map((snippet) => {
        const { formattedSnippet, indentSize } = formatSnippetWithIndent(
            sourceObj,
            startOffset,
            snippet.snippet,
        );
        const adjustedCursor = snippet.cursor
            ? adjustCursorForIndent(snippet.snippet, snippet.cursor, indentSize)
            : undefined;
        const completionData: CompletionSnippetCompletionItemData | undefined =
            adjustedCursor
                ? {
                      snippetCursor: adjustedCursor,
                  }
                : undefined;

        return {
            label: snippet.key,
            kind: CompletionItemKind.Snippet,
            documentation: snippet.description,
            textEdit: {
                range: createTextEditRange(sourceObj, startOffset, endOffset),
                newText: formattedSnippet,
            },
            filterText: snippet.key,
            ...(completionData
                ? {
                      data: completionData,
                  }
                : {}),
        };
    });
}

function isPrefigureGraphElement(
    autoCompleter: AutoCompleter,
    element: DastElement,
): boolean {
    return (
        autoCompleter.normalizeElementName(element.name) === "graph" &&
        getElementAttributeValue(element, "renderer")?.toLowerCase() ===
            "prefigure"
    );
}

function isPrefigureGraph(
    autoCompleter: AutoCompleter,
    contextElement: DastElement | null,
): contextElement is DastElement {
    return (
        contextElement !== null &&
        isPrefigureGraphElement(autoCompleter, contextElement)
    );
}

function createDynamicSnippetCompletionItems(
    autoCompleter: AutoCompleter,
    allowedElementNames: string[],
    contextElement: DastElement | null,
    startOffset: number,
    endOffset: number,
    typedPrefix = "",
): CompletionItem[] {
    if (!allowedElementNames.includes("annotations")) {
        return [];
    }

    if (!isPrefigureGraph(autoCompleter, contextElement)) {
        return [];
    }

    const dynamicSnippet = generateAnnotationSkeletonSnippet(contextElement);
    if (!dynamicSnippet) {
        return [];
    }

    if (
        typedPrefix &&
        !dynamicSnippet.key.toLowerCase().startsWith(typedPrefix.toLowerCase())
    ) {
        return [];
    }

    return createSnippetCompletionItems(
        autoCompleter.sourceObj,
        [dynamicSnippet],
        startOffset,
        endOffset,
    );
}

/**
 * Create schema element and snippet completion items for a set of allowed elements.
 */
function createElementAndSnippetCompletionItems(
    autoCompleter: AutoCompleter,
    allowedElementNames: string[],
    startOffset: number,
    endOffset: number,
    typedPrefix = "",
    contextElement: DastElement | null = null,
): CompletionItem[] {
    const prefixLower = typedPrefix.toLowerCase();
    const parentName = contextElement?.name;
    const schemaItems: CompletionItem[] = allowedElementNames
        .filter((name) =>
            prefixLower ? name.toLowerCase().startsWith(prefixLower) : true,
        )
        .map((name) => {
            const item: CompletionItem = {
                label: name,
                kind: CompletionItemKind.Property,
            };
            const ownEntry = autoCompleter.schemaElementsByName[name];
            const effectiveEntry = autoCompleter.resolveEffectiveSchemaElement(
                ownEntry,
                parentName,
            );
            if (effectiveEntry?.summary) {
                item.documentation = asMarkdown(effectiveEntry.summary);
            }
            return item;
        });

    const snippets = autoCompleter._getSnippetsForElements(
        new Set(allowedElementNames),
        typedPrefix,
    );
    const snippetItems = createSnippetCompletionItems(
        autoCompleter.sourceObj,
        snippets,
        startOffset,
        endOffset,
    );

    const dynamicSnippetItems = createDynamicSnippetCompletionItems(
        autoCompleter,
        allowedElementNames,
        contextElement,
        startOffset,
        endOffset,
        typedPrefix,
    );

    return [...schemaItems, ...snippetItems, ...dynamicSnippetItems];
}

/**
 * Per-label override for ref completion `detail` / `documentation`. `detail`
 * is required: when a per-label override exists at all, the producer always
 * has a referent-specific detail string to surface (e.g.
 * `"(<math>, line 83)"`). `documentation` is optional — only present when
 * the referent's schema entry carries a summary.
 */
type RefCompletionLabelInfo = {
    detail: string;
    documentation?: string;
};

/**
 * Build reference-name completion items that replace only the actively typed
 * portion of a `$ref` or `$ref.member` segment.
 *
 * `labelInfo`, when provided, supplies per-label `detail`/`documentation` —
 * for example, replacing the generic "Reference name" with
 * `"(<math>, line 83)"` for bare `$name` items.
 */
function createReferenceCompletionItems(
    autoCompleter: AutoCompleter,
    labels: string[],
    startOffset: number,
    endOffset: number,
    detail: string,
    toNewText: (label: string) => string = (label) => label,
    labelInfo?: Map<string, RefCompletionLabelInfo>,
): CompletionItem[] {
    return labels.map((label) => {
        const info = labelInfo?.get(label);
        const item: CompletionItem = {
            label,
            kind: CompletionItemKind.Reference,
            detail: info?.detail ?? detail,
            textEdit: {
                range: createTextEditRange(
                    autoCompleter.sourceObj,
                    startOffset,
                    endOffset,
                ),
                newText: toNewText(label),
            },
        };
        if (info?.documentation) {
            item.documentation = asMarkdown(info.documentation);
        }
        return item;
    });
}

/**
 * Segment insertion policy for ref completion after `$` and `.`:
 * - Simple identifiers insert as-is.
 * - Hyphenated or otherwise non-simple identifiers insert parenthesized.
 */
function toRefSegmentInsertText(label: string) {
    return SIMPLE_IDENTIFIER_REGEX.test(label) ? label : `(${label})`;
}

/**
 * Determine which descendant and property names should be visible for a resolved
 * element, respecting takesIndex and per-segment index semantics.
 *
 * - For `takesIndex` composites without a bracket index AND without the
 *   implicit-single-index shorthand: descendants are hidden, only properties
 *   are shown.
 * - For `takesIndex` composites with an authored bracket index: descendants
 *   are shown (replacement child names), properties are hidden (unknown type).
 * - For `takesIndex` composites whose count attribute carries the implicit
 *   shorthand (`numToSelect="1"`, or absent — issue #1181): descendants AND
 *   properties are both shown.  The shorthand only commits to descendant
 *   resolution; the author can still type `$s.numToSelect` to read a state
 *   variable on the composite itself.
 * - For regular elements: both descendants and properties are shown.
 *
 * Note: Invalid access (non-takesIndex element with an index) is handled upstream
 * in the resolver and returns null node before reaching this function.
 */
function determineVisibleNames(
    takesIndex: boolean,
    resolvedPartHasIndex: boolean,
    implicitSingleIndex: boolean,
    visibleDescendantNames: string[],
    schema: { properties?: { name: string }[] } | undefined,
): { descendantNames: Set<string>; propertyNames: string[] } {
    // Descendants gate: hidden only when takesIndex AND neither an authored
    // bracket nor the implicit-single-index shorthand applies.
    const descendantNames =
        takesIndex && !resolvedPartHasIndex && !implicitSingleIndex
            ? new Set<string>()
            : new Set(visibleDescendantNames);

    // Properties gate: hidden only when an authored bracket explicitly
    // dereferences a replacement (the schema would describe the composite,
    // not the replacement).  The implicit shorthand does NOT hide them.
    const propertyNames =
        takesIndex && resolvedPartHasIndex
            ? []
            : schema?.properties?.map((property) => property.name) || [];

    return { descendantNames, propertyNames };
}

/**
 * Build schema-property completions for the currently resolved ref target.
 * These are shown only after descendant-name candidates so concrete named
 * children win label collisions.
 */
function createPropertyCompletionItems(
    autoCompleter: AutoCompleter,
    labels: string[],
    startOffset: number,
    endOffset: number,
    componentType: string,
    toNewText: (label: string) => string = (label) => label,
    propertyDescriptions?: Map<string, string>,
): CompletionItem[] {
    return labels.map((label) => {
        const item: CompletionItem = {
            label,
            kind: CompletionItemKind.Property,
            detail: `Property on ${componentType}`,
            textEdit: {
                range: createTextEditRange(
                    autoCompleter.sourceObj,
                    startOffset,
                    endOffset,
                ),
                newText: toNewText(label),
            },
        };
        const description = propertyDescriptions?.get(label);
        if (description) {
            item.documentation = asMarkdown(description);
        }
        return item;
    });
}

/**
 * Build alias-name completions for a `$container.arrayProp[…].` chain that
 * the resolver couldn't walk but the schema's `indexAliases` table covers.
 * Returns `null` (not `[]`) when this branch doesn't apply, so the caller
 * can fall through to its existing "no completions" path; returns `[]`
 * when the chain matches an array prop but every dimension is already
 * consumed (e.g. `$vector.head.x.`), so we stop offering anything rather
 * than fall through to descendant/property lookup that doesn't apply
 * here. Issue #1180.
 */
function indexAliasCompletionItems(
    autoCompleter: AutoCompleter,
    containerNode: DastElement | null,
    unresolvedPathParts: string[],
    completionContext: CompletionContext & {
        cursorPos: "refMember";
        pathParts: string[];
        pathPartHasIndex: boolean[];
        rawPathParts: string[];
        typedPrefix: string;
        replaceFromOffset: number;
    },
    offset: number,
    toRefMemberInsertText: (name: string) => string,
): CompletionItem[] | null {
    if (!containerNode || unresolvedPathParts.length === 0) return null;

    const componentType = autoCompleter.normalizeElementName(
        containerNode.name,
    );
    const schema = autoCompleter.schemaElementsByName[componentType];
    if (!schema) return null;

    // Mirror the alias-aware property lookup used elsewhere — a child
    // addressed via its alias-redirected parent (e.g. `<row>` inside
    // `<matrix>`) should still see the right schema.
    const helpSchema = autoCompleter.resolveEffectiveSchemaElement(
        schema,
        getParentName(autoCompleter, containerNode),
    );
    const arrayName = unresolvedPathParts[0];
    const arrayProp = helpSchema?.properties?.find(
        (p) => p.name.toLowerCase() === arrayName.toLowerCase(),
    );
    if (!arrayProp) return null;

    // Locate the array-prop segment in the caller's path. `pathParts` is
    //   [...resolvedSegments, ...unresolvedPathParts, typedPrefix]
    // so the array-prop segment lives at
    //   pathParts.length - 1 - unresolvedPathParts.length
    // (the last entry is the in-progress typed prefix at the cursor —
    // empty right after a `.`, or a partial alias name like `x` mid-type).
    // We count bracket groups on the raw segment so multi-index segments
    // like `controlVectors[0][2]` consume the right number of dims
    // (a single boolean would under-consume on 3D arrays).
    const arrayPropPathIndex =
        completionContext.pathParts.length - 1 - unresolvedPathParts.length;
    if (arrayPropPathIndex < 0) return null;

    const segments: Array<{ name: string; numIndices: number }> = [
        {
            name: arrayName,
            numIndices: countBracketIndices(
                completionContext.rawPathParts[arrayPropPathIndex],
            ),
        },
    ];
    for (let i = 1; i < unresolvedPathParts.length; i++) {
        segments.push({
            name: unresolvedPathParts[i],
            numIndices: countBracketIndices(
                completionContext.rawPathParts[arrayPropPathIndex + i],
            ),
        });
    }

    const walked = walkIndexAliases(arrayProp, segments);
    // `null` here means the chain so far is invalid (e.g. an unindexed
    // segment whose name isn't a known alias). Returning `[]` rather than
    // falling through suppresses noisy guesses — the resolver already
    // declared the path unresolvable, and the alias chase is the only
    // remaining well-defined source of completions in this branch.
    if (!walked) return [];
    if (walked.dim >= walked.numDims) {
        // Every dimension already consumed — nothing further to offer.
        return [];
    }

    const aliasesForDim =
        arrayProp.indexAliases?.[walked.dim] ?? ([] as readonly string[]);
    if (aliasesForDim.length === 0) return [];

    const prefix = completionContext.typedPrefix.toLowerCase();
    const filtered = aliasesForDim.filter((name) =>
        prefix ? name.toLowerCase().startsWith(prefix) : true,
    );
    if (filtered.length === 0) return [];

    const detail = `Alias for ${arrayProp.name} (dim ${walked.dim + 1} of ${walked.numDims})`;
    return filtered.map((label) => ({
        label,
        kind: CompletionItemKind.Reference,
        detail,
        textEdit: {
            range: createTextEditRange(
                autoCompleter.sourceObj,
                completionContext.replaceFromOffset,
                offset,
            ),
            newText: toRefMemberInsertText(label),
        },
    }));
}

/**
 * Get a list of completion items at the given offset in the source document.
 *
 * This function analyzes the cursor context to determine what type of completions
 * are appropriate and returns a combination of:
 * - Ref-name completions after `$` in text content or attribute values, including
 *   `$name[]` snippet completions for takesIndex elements
 * - Ref-member completions after `.` on a resolved ref chain, filtered by addressability
 *   and visibility rules (ChildrenInvisibleToTheirGrandparents, sugar hiding, etc.)
 * - Additional injected ref names (e.g., repeat valueName/indexName) from
 *   rustResolverAdapter.getDerivedRepeatNames()
 * - Schema-based element completions (allowed elements based on parent/context)
 * - Snippet completions (templates associated with allowed elements)
 * - Attribute name completions (when inside an opening tag)
 * - Attribute value completions for enumerated schema values
 * - Closing tag completions (when appropriate)
 *
 * The completion behavior varies depending on the cursor position context:
 * - Body or attribute-value ref context after `$` or `.`: in-scope ref names filtered
 *   through isNameAddressable(), descendant names from visibleDescendantNames,
 *   and schema properties on resolved referents
 * - Root level after `<`: top-level elements and their snippets
 * - Inside element body after `<`: allowed children and their snippets
 * - While typing element name (`openTagName`): filtered schema elements and snippets
 * - Inside opening tag (`openTag`): attribute names
 * - Inside an attribute value without ref syntax: schema value suggestions
 * - After `</`: closing tag suggestion
 *
 * Snippet completions include textEdit ranges that replace from the `<` character
 * to the cursor position, with multiline snippets properly indented based on the
 * insertion column.
 *
 * @param offset - Either a numeric offset into the source string, or a RowCol position
 * @param cachedContext - Optional pre-computed CompletionContext to avoid redundant parsing
 * @returns Array of LSP CompletionItem objects suitable for the current context
 */
export async function getCompletionItems(
    this: AutoCompleter,
    offset: number | RowCol,
    cachedContext?: CompletionContext,
): Promise<DoenetCompletionItem[]> {
    if (typeof offset !== "number") {
        offset = this.sourceObj.rowColToOffset(offset);
    }

    const prevChar = this.sourceObj.source.charAt(offset - 1);
    const prevPrevChar = this.sourceObj.source.charAt(offset - 2);
    let prevNonWhitespaceCharOffset = offset - 1;
    while (
        this.sourceObj.source
            .charAt(prevNonWhitespaceCharOffset)
            .match(/(\s|\n)/)
    ) {
        prevNonWhitespaceCharOffset--;
    }
    const prevNonWhitespaceChar = this.sourceObj.source.charAt(
        prevNonWhitespaceCharOffset,
    );

    let containingNode = this.sourceObj.nodeAtOffset(offset);
    let containingElement = this.sourceObj.elementAtOffsetWithContext(offset);
    const element = containingElement.node;
    let cursorPosition = containingElement.cursorPosition;

    const completionContext =
        cachedContext ?? this.getCompletionContext(offset);
    const allowRefCompletion =
        cursorPosition === "body" ||
        cursorPosition === "attributeValue" ||
        (!element && containingNode && containingNode.type === "text");

    if (allowRefCompletion && completionContext.cursorPos === "refName") {
        // Offer only top-level addressable names after `$namePrefix`.
        const prefix = completionContext.typedPrefix.toLowerCase();
        const source = this.sourceObj.source;
        const isParenthesizedContext =
            source.charAt(completionContext.replaceFromOffset - 1) === "(" &&
            source.charAt(completionContext.replaceFromOffset - 2) === "$";

        // `$name` form only supports SimpleIdent. When a suggestion needs
        // richer Ident syntax (e.g. hyphen), insert parentheses so `$f`
        // can become `$(foo-bar)`.
        const toRefNameInsertText = (name: string) => {
            if (isParenthesizedContext) {
                return name;
            }
            return toRefSegmentInsertText(name);
        };

        const addressableNames = this.sourceObj
            .getAddressableNamesAtOffset(offset)
            .filter((parts) => parts.length === 1)
            .map((parts) => parts[0]);
        // Inject additional names (e.g. repeat valueName/indexName) that
        // don't exist in the raw DAST but are valid at runtime.
        const additionalNames = this.getAdditionalRefNames(offset);
        const uniqueNames = [
            ...new Set([...addressableNames, ...additionalNames]),
        ];
        const isAddressableFlags = await Promise.all(
            uniqueNames.map((name) => this.isNameAddressable(offset, name)),
        );
        const filteredNames = uniqueNames.filter(
            (name, i) =>
                (!prefix || name.toLowerCase().startsWith(prefix)) &&
                isAddressableFlags[i],
        );

        // Resolve each candidate's referent once and reuse the resulting
        // info for both the base `$name` item and the `$name[]` snippet.
        // The base item's `detail` is `(<type>, line N)` — parens and
        // the comma frame the type/line as parenthetical metadata,
        // visually separate from the completion label. `documentation`
        // carries the component-type summary (alias-aware: a `<row>`
        // inside `<matrix>` gets the `matrixRow` summary).
        type ReferentInfo = {
            takesIndex: boolean;
            labelInfo: RefCompletionLabelInfo;
        };
        const referentInfoByName = new Map<string, ReferentInfo>();
        for (const name of filteredNames) {
            const resolved = this.resolveRefNameForHelp(offset, name);
            if (!resolved) continue;
            const { referent, line, ownEntry, effectiveEntry } = resolved;
            const detail =
                line !== undefined
                    ? `(<${referent.name}>, line ${line})`
                    : `(<${referent.name}>)`;
            const labelInfo: RefCompletionLabelInfo = { detail };
            if (effectiveEntry?.summary) {
                labelInfo.documentation = effectiveEntry.summary;
            }
            referentInfoByName.set(name, {
                takesIndex: ownEntry?.takesIndex ?? false,
                labelInfo,
            });
        }

        const baseItems = createReferenceCompletionItems(
            this,
            filteredNames,
            completionContext.replaceFromOffset,
            offset,
            "Reference name",
            toRefNameInsertText,
            new Map(
                Array.from(referentInfoByName, ([name, info]) => [
                    name,
                    info.labelInfo,
                ]),
            ),
        );

        // For names that refer to takesIndex elements (repeat, select, …),
        // offer an additional "$name[]" snippet with cursor between the
        // brackets so the user can type the index directly.
        const replaceRange = createTextEditRange(
            this.sourceObj,
            completionContext.replaceFromOffset,
            offset,
        );
        for (const name of filteredNames) {
            const info = referentInfoByName.get(name);
            if (!info?.takesIndex) continue;
            const insertText = isParenthesizedContext
                ? `${name}[]`
                : `${toRefSegmentInsertText(name)}[]`;
            const item: CompletionItem = {
                label: `${name}[]`,
                kind: CompletionItemKind.Reference,
                detail: info.labelInfo.detail,
                textEdit: {
                    range: replaceRange,
                    newText: insertText,
                },
                data: {
                    snippetCursor: {
                        caretOffset: insertText.length - 1,
                    },
                } satisfies CompletionSnippetCompletionItemData,
            };
            if (info.labelInfo.documentation) {
                item.documentation = asMarkdown(info.labelInfo.documentation);
            }
            baseItems.push(item);
        }

        return baseItems;
    }

    if (allowRefCompletion && completionContext.cursorPos === "refMember") {
        // Resolve the ref chain up to the container of the member currently
        // being typed, then merge named descendants with schema properties.
        const source = this.sourceObj.source;
        const isParenthesizedMemberContext =
            source.charAt(completionContext.replaceFromOffset - 1) === "(" &&
            source.charAt(completionContext.replaceFromOffset - 2) === ".";
        const toRefMemberInsertText = (name: string) =>
            isParenthesizedMemberContext ? name : toRefSegmentInsertText(name);

        const resolved = await this.resolveRefMemberContainerAtOffset(
            offset,
            completionContext.pathParts,
            completionContext.pathPartHasIndex,
        );
        const resolvedNode = resolved.node;

        if (!resolvedNode) {
            // Before giving up, see whether the chain is a coordinate-style
            // walk through an array property's `indexAliases` table — e.g.
            // the user typed `$vector.head.` and we should offer `x/y/z`
            // even though the resolver couldn't walk through `head`. The
            // helper mirrors the help-side chase: the first unresolved
            // segment names an array prop on the partially-resolved
            // container, and bracket indices / alias names on the way
            // each consume one dimension. Issue #1180.
            const aliasItems = indexAliasCompletionItems(
                this,
                resolved.partiallyResolvedNode ?? null,
                resolved.unresolvedPathParts,
                completionContext,
                offset,
                toRefMemberInsertText,
            );
            if (aliasItems) return aliasItems;
            return [];
        }

        const componentType = this.normalizeElementName(resolvedNode.name);
        const schema = this.schemaElementsByName[componentType];
        // Alias-aware schema for help/description (e.g. `<row>` inside
        // `<matrix>` → `matrixRow`). Behavioural fields like `takesIndex` and
        // `properties` membership still come from the canonical `schema`,
        // since aliased entries don't carry those.
        const helpSchema = this.resolveEffectiveSchemaElement(
            schema,
            getParentName(this, resolvedNode),
        );
        const takesIndex = schema?.takesIndex ?? false;
        // Read the index flag for the resolved segment — always the
        // second-to-last entry in pathParts (the last entry is always the
        // empty typed-prefix).  Examples:
        //   $rep[1].   → pathParts=["rep",""]          → index 0 (direct ref)
        //   $sec.rep[1]. → pathParts=["sec","rep",""]  → index 1 (indirect)
        //   $rep[1].myMath. → pathParts=["rep","myMath",""] → index 1 (resolved is myMath, not rep)
        const resolvedPartHasIndex =
            completionContext.pathPartHasIndex?.[
                completionContext.pathParts.length - 2
            ] ?? false;
        // Strict-rule shorthand from issue #1181: a select-family container
        // whose count attribute is absent or literal "1" lets `$s.t` resolve
        // descendants like `$s[1].t`.  We surface the predicate to
        // `determineVisibleNames` rather than collapsing it into
        // `resolvedPartHasIndex` so the shorthand offers descendants AND keeps
        // the composite's own properties (e.g. `$s.numToSelect`) accessible.
        const implicitSingleIndex = hasImplicitSingleIndex(resolvedNode);

        // When the resolved element does NOT take an index but the user
        // wrote one (e.g. $sec[1].), the access is invalid — return nothing.
        if (!takesIndex && resolvedPartHasIndex) {
            return [];
        }

        const { descendantNames, propertyNames } = determineVisibleNames(
            takesIndex,
            resolvedPartHasIndex,
            implicitSingleIndex,
            resolved.visibleDescendantNames,
            schema,
        );

        const prefix = completionContext.typedPrefix.toLowerCase();
        const filteredDescendantNames = [...descendantNames].filter((name) =>
            prefix ? name.toLowerCase().startsWith(prefix) : true,
        );
        const filteredPropertyNames = propertyNames.filter(
            (name) =>
                (!prefix || name.toLowerCase().startsWith(prefix)) &&
                !descendantNames.has(name),
        );

        const propertyDescriptions = new Map<string, string>();
        for (const prop of helpSchema?.properties ?? []) {
            if (prop.description) {
                propertyDescriptions.set(prop.name, prop.description);
            }
        }

        return [
            ...createReferenceCompletionItems(
                this,
                filteredDescendantNames,
                completionContext.replaceFromOffset,
                offset,
                "Descendant reference name",
                toRefMemberInsertText,
            ),
            ...createPropertyCompletionItems(
                this,
                filteredPropertyNames,
                completionContext.replaceFromOffset,
                offset,
                resolvedNode.name,
                toRefMemberInsertText,
                propertyDescriptions,
            ),
        ];
    }

    if (!containingNode && cursorPosition === "unknown" && prevChar === "<") {
        return createElementAndSnippetCompletionItems(
            this,
            this.schemaTopAllowedElements,
            offset - 1,
            offset,
        );
    }

    if (!element && containingNode && containingNode.type === "text") {
        // We're in the root of the document and not inside any special XML tags (like `<? foo ?>` or `<!DOCTYPE xml>`)
        // Find out what items we can complete.

        // If the previous char is a `<`, we suggest all top-level elements.
        if (prevChar === "<") {
            return createElementAndSnippetCompletionItems(
                this,
                this.schemaTopAllowedElements,
                offset - 1,
                offset,
            );
        }

        return [];
    }

    if (!element) {
        return [];
    }

    if (cursorPosition === "closeTagName") {
        // We're in the close tag name. Suggest the close tag name.
        return [
            {
                label: `/${element.name}>`,
                kind: CompletionItemKind.Property,
            },
        ];
    }

    const { tagComplete, closed } = this.sourceObj.isCompleteElement(element);

    if (
        cursorPosition === "body" &&
        containingElement.node &&
        prevChar === "<"
    ) {
        const allowedChildrenNames = this._getAllowedChildren(
            containingElement.node.name,
        );
        const completionItems = createElementAndSnippetCompletionItems(
            this,
            allowedChildrenNames,
            offset - 1,
            offset,
            "",
            containingElement.node,
        );

        if (closed) {
            // We're in the body of an element. Suggest all allowed children.
            return completionItems;
        }
        // We are the child of a non-closed tag. Suggest the close tag or allowed children
        return [
            {
                label: `/${element.name}>`,
                kind: CompletionItemKind.Property,
            },
            ...completionItems,
        ];
    }

    // Suggest closing tag after "</"
    if (
        prevPrevChar === "<" &&
        prevChar === "/" &&
        containingElement.node &&
        !closed &&
        (cursorPosition === "body" ||
            (cursorPosition === "unknown" &&
                this.sourceObj.source.charAt(offset).match(/(\s|\n)/)))
    ) {
        return [
            {
                label: `/${element.name}>`,
                kind: CompletionItemKind.Property,
            },
        ];
    }

    if (cursorPosition === "openTagName") {
        // We're in the open tag name. Suggest everything that starts with the current text.
        const currentText = element.name.toLowerCase();
        const parent = this.sourceObj.getParent(element);

        let allowedElements: string[];
        if (!parent || parent.type === "root") {
            allowedElements = this.schemaTopAllowedElements;
        } else {
            allowedElements = this._getAllowedChildren(parent.name);
        }

        // For openTagName context, we need to replace from the opening '<' to the cursor.
        // Prefer element.position.start for accuracy; fallback estimates based on typed text.
        const tagStartOffset =
            element.position?.start.offset ??
            Math.max(0, offset - currentText.length - 1);

        return createElementAndSnippetCompletionItems(
            this,
            allowedElements,
            tagStartOffset,
            offset,
            currentText,
            parent?.type === "element" ? parent : null,
        );
    }

    // Detect "typing a bare value after =" (no opening quote), e.g.
    // `<math simplify=ful`. Walk back over identifier chars and see if the
    // char immediately before that run is `=` (with optional whitespace).
    // We compute this before the openTag/attributeName branch because lezer
    // often parses `=ful` as a new attribute name, which would otherwise
    // route the request to attribute-name completions.
    const source = this.sourceObj.source;
    const { valueStartOffset: typedValueStart, equalsOffset } =
        scanBareValueRun(source, offset);
    const isBareValueAfterEquals =
        equalsOffset != null && typedValueStart < offset;
    // Retained for downstream code that uses the `=` offset (e.g. for
    // `createTextEditRange(equalsScan + 1, ...)`). When `=` isn't present,
    // `isBareValueAfterEquals` is false and `equalsScan` is never read.
    const equalsScan = equalsOffset ?? -1;
    const typedValuePrefix = source.slice(typedValueStart, offset);

    // The `!isBareValueAfterEquals && prevNonWhitespaceChar !== "="` guards
    // cede those cases to the attribute-value branch below — otherwise an
    // unquoted `name=ful` would route here as an attribute-name completion.
    // The `prevNonWhitespaceChar !== "="` clause additionally covers the
    // "cursor sits immediately after `=` with no bare value typed yet" case
    // (`isBareValueAfterEquals` is false there since the prefix is empty);
    // we want that case in the attribute-value branch too so `=` alone pops
    // the value menu.
    if (
        (cursorPosition === "openTag" || cursorPosition === "attributeName") &&
        !isBareValueAfterEquals &&
        prevNonWhitespaceChar !== "="
    ) {
        const elmName = this.normalizeElementName(element.name);
        const ownEntry = this.schemaElementsByName[elmName];
        const helpEntry = this.resolveEffectiveSchemaElement(
            ownEntry,
            getParentName(this, element),
        );
        // Build a description lookup from the alias-aware help entry so
        // attributes on `<row>` inside `<matrix>` show `matrixRow`'s docs.
        const descriptionByAttrName = new Map<string, string>();
        for (const attr of helpEntry?.attributes ?? []) {
            if (attr.description) {
                descriptionByAttrName.set(attr.name, attr.description);
            }
        }
        const allowedAttributes = ownEntry?.attributes || [];
        return allowedAttributes.map((attr) => {
            const item: CompletionItem = {
                label: attr.name,
                kind: CompletionItemKind.Enum,
            };
            const description =
                descriptionByAttrName.get(attr.name) ?? attr.description;
            if (description) {
                item.documentation = asMarkdown(description);
            }
            return item;
        });
    }

    // Only fire the attribute-value branch when we are clearly inside an
    // open tag (or already in an attribute value). Crucially we exclude
    // cursorPosition === "body" so a literal `=` in body text doesn't get
    // misread as an attribute-value anchor.
    const isInOpenTagContext =
        cursorPosition === "openTag" ||
        cursorPosition === "attributeName" ||
        cursorPosition === "attributeValue" ||
        cursorPosition === "unknown";
    if (
        cursorPosition === "attributeValue" ||
        (isInOpenTagContext &&
            (prevNonWhitespaceChar === "=" || isBareValueAfterEquals))
    ) {
        const elmName = this.normalizeElementName(element.name);
        const allowedAttributes =
            this.schemaElementsByName[elmName]?.attributes || [];
        const attribute = this._getAttributeContainsOffset(element, offset);
        let allowedAttribute = allowedAttributes.find(
            (a) => a.name === attribute?.name,
        );
        // Fallback: when the user is typing a bare value after `=` the parser
        // may not include the typed chars in any attribute's position range,
        // so resolve the attribute name by walking back to the `=` and reading
        // the identifier that precedes it.
        if (!allowedAttribute && isBareValueAfterEquals) {
            let nameEnd = equalsScan;
            while (nameEnd > 0 && /\s/.test(source.charAt(nameEnd - 1))) {
                nameEnd--;
            }
            let nameStart = nameEnd;
            while (
                nameStart > 0 &&
                ATTR_VALUE_CHAR.test(source.charAt(nameStart - 1))
            ) {
                nameStart--;
            }
            const attrName = source.slice(nameStart, nameEnd);
            if (attrName) {
                allowedAttribute = allowedAttributes.find(
                    (a) => a.name === attrName,
                );
            }
        }
        // Prefer the `autocompleteValues` shape (per-value descriptions) so
        // completions carry tooltips. Fall back to the plain validation
        // `values` list for any attribute that exposes `values` without
        // `autocompleteValues` — today the schema generator only emits this
        // shape for boolean primitives, but the consumer stays agnostic.
        const optionsWithDescriptions = allowedAttribute?.autocompleteValues;
        const plainValues = allowedAttribute?.values;
        if (!optionsWithDescriptions && !plainValues) {
            // Free-text attribute: no enum to suggest. We still offer a single
            // "wrap in quotes" hint *iff* the author has typed a bare value
            // after `=` (e.g. `name=foo`). The hint's displayLabel previews
            // the corrected form `"foo"`, and accepting the suggestion
            // replaces the bare run with the quoted version. We deliberately
            // skip the hint when:
            //   * the cursor is right at `=` with no typed value yet
            //     (`isBareValueAfterEquals` is false), and
            //   * the cursor is already inside `"..."`
            //     (`cursorPosition === "attributeValue"`),
            // so an expert who reflexively types `"` after `=` never sees a
            // flicker, and a bare `=` doesn't pop a useless menu.
            if (
                cursorPosition !== "attributeValue" &&
                isBareValueAfterEquals &&
                typedValuePrefix.length > 0
            ) {
                const range = createTextEditRange(
                    this.sourceObj,
                    equalsScan + 1,
                    offset,
                );
                return [
                    {
                        label: typedValuePrefix,
                        displayLabel: `"${typedValuePrefix}"`,
                        kind: CompletionItemKind.Value,
                        filterText: typedValuePrefix,
                        textEdit: {
                            range,
                            newText: `"${typedValuePrefix}"`,
                        },
                        // Marker telling the CodeMirror plugin to treat this
                        // option as a live preview: it must set `filter: false`
                        // on the result, anchor `from` at `bareValueStartOffset`,
                        // and refresh the option's text from the live document
                        // on every keystroke. Without this, the cached
                        // `label`/`displayLabel` go stale (CodeMirror filters
                        // the option out the moment the typed prefix exceeds
                        // the cached label length) and the plugin's default
                        // `prefixMatch` anchors `from` past the first typed
                        // character (because the apply text starts with `"`,
                        // which the user has not actually typed).
                        data: {
                            livePreviewQuoteWrap: {
                                bareValueStartOffset: typedValueStart,
                            },
                        } satisfies CompletionSnippetCompletionItemData,
                    },
                ];
            }
            return [];
        }
        // Quotes get added via `textEdit.newText` when the cursor is anchored
        // to an `=` rather than already inside `"..."`. The display label and
        // filter text always use the bare value. The replacement range starts
        // right after `=` (rather than at the typed-value start) so any
        // whitespace between `=` and the bare value is swallowed by the
        // edit — `simplify=   ful` becomes `simplify="full"`, not
        // `simplify=   "full"`.
        const needsQuotes =
            cursorPosition !== "attributeValue" &&
            (prevNonWhitespaceChar === "=" || isBareValueAfterEquals);
        const quotedRange = needsQuotes
            ? createTextEditRange(this.sourceObj, equalsScan + 1, offset)
            : undefined;
        const filterPrefix = typedValuePrefix.toLowerCase();
        const matchesPrefix = (value: string) =>
            !needsQuotes ||
            !filterPrefix ||
            value.toLowerCase().startsWith(filterPrefix);
        // When we add quotes via textEdit, advertise the quoted form in
        // `displayLabel` so the dropdown reads `"full"` instead of `full`.
        // The bare `label` is still used by CodeMirror's fuzzy matcher, so
        // typing `fu` still ranks `full` correctly. Inside `"..."` we omit
        // `displayLabel` so the dropdown matches what actually gets inserted.
        if (optionsWithDescriptions) {
            return optionsWithDescriptions
                .filter(({ value }) => matchesPrefix(value))
                .map(({ value, description }) => ({
                    label: value,
                    kind: CompletionItemKind.Value,
                    filterText: value,
                    documentation: asMarkdown(description),
                    ...(quotedRange
                        ? {
                              displayLabel: `"${value}"`,
                              textEdit: {
                                  range: quotedRange,
                                  newText: `"${value}"`,
                              },
                          }
                        : {}),
                }));
        }
        return (plainValues ?? [])
            .filter((value) => matchesPrefix(value))
            .map((value) => ({
                label: value,
                kind: CompletionItemKind.Value,
                filterText: value,
                ...(quotedRange
                    ? {
                          displayLabel: `"${value}"`,
                          textEdit: {
                              range: quotedRange,
                              newText: `"${value}"`,
                          },
                      }
                    : {}),
            }));
    }
    return [];
}
