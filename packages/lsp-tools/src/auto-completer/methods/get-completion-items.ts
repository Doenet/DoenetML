import { DoenetSourceObject, RowCol } from "../../doenet-source-object";
import type { CompletionContext } from "./get-completion-context";
import type { CompletionItem, Range } from "vscode-languageserver/browser";
import { CompletionItemKind } from "vscode-languageserver/browser";
import type {
    CompletionSnippetCompletionItemData,
    CompletionSnippetCursor,
} from "@doenet/static-assets/completion-snippet-protocol";
import { toXml } from "@doenet/parser";
import type { DastElement } from "@doenet/parser";
import { AutoCompleter } from "../index";
import { generateAnnotationSkeletonSnippet } from "./generate-annotation-skeleton";

// Keep these aligned with parser grammar in `packages/parser/src/macros/macros.peggy`:
// - SimpleIdent = [a-zA-Z_][a-zA-Z0-9_]*
const SIMPLE_IDENTIFIER_REGEX = /^[A-Za-z_][A-Za-z0-9_]*$/;

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

function getElementAttributeValue(
    element: DastElement,
    attributeName: string,
): string | undefined {
    const attr = element.attributes[attributeName];
    if (!attr) {
        return undefined;
    }

    const value = toXml(attr.children).trim();
    return value.length > 0 ? value : undefined;
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
    const schemaItems = allowedElementNames
        .filter((name) =>
            prefixLower ? name.toLowerCase().startsWith(prefixLower) : true,
        )
        .map((name) => ({
            label: name,
            kind: CompletionItemKind.Property,
        }));

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
 * Build reference-name completion items that replace only the actively typed
 * portion of a `$ref` or `$ref.member` segment.
 */
function createReferenceCompletionItems(
    autoCompleter: AutoCompleter,
    labels: string[],
    startOffset: number,
    endOffset: number,
    detail: string,
    toNewText: (label: string) => string = (label) => label,
): CompletionItem[] {
    return labels.map((label) => ({
        label,
        kind: CompletionItemKind.Reference,
        detail,
        textEdit: {
            range: createTextEditRange(
                autoCompleter.sourceObj,
                startOffset,
                endOffset,
            ),
            newText: toNewText(label),
        },
    }));
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
 * - For `takesIndex` composites without a bracket index: descendants are hidden,
 *   only properties are shown.
 * - For `takesIndex` composites with a bracket index: descendants are shown
 *   (replacement child names), properties are hidden (unknown type).
 * - For regular elements: both descendants and properties are shown.
 *
 * Note: Invalid access (non-takesIndex element with an index) is handled upstream
 * in the resolver and returns null node before reaching this function.
 */
function determineVisibleNames(
    takesIndex: boolean,
    resolvedPartHasIndex: boolean,
    visibleDescendantNames: string[],
    schema: { properties?: { name: string }[] } | undefined,
): { descendantNames: Set<string>; propertyNames: string[] } {
    // For a takesIndex composite:
    //   - Without an index ($rep.): descendants are inaccessible via bare dot
    //     access, so hide them and show only schema properties.
    //   - With an index ($rep[1]. or $sec.rep[1].): the cursor is after a
    //     replacement child of unknown component type, so show descendant
    //     names but hide schema properties (they describe the composite, not
    //     the replacement).
    const descendantNames =
        takesIndex && !resolvedPartHasIndex
            ? new Set<string>()
            : new Set(visibleDescendantNames);

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
): CompletionItem[] {
    return labels.map((label) => ({
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
export function getCompletionItems(
    this: AutoCompleter,
    offset: number | RowCol,
    cachedContext?: CompletionContext,
): CompletionItem[] {
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
        const filteredNames = uniqueNames.filter(
            (name) =>
                (!prefix || name.toLowerCase().startsWith(prefix)) &&
                this.isNameAddressable(offset, name),
        );

        const baseItems = createReferenceCompletionItems(
            this,
            filteredNames,
            completionContext.replaceFromOffset,
            offset,
            "Reference name",
            toRefNameInsertText,
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
            const referent = this.sourceObj.getReferentAtOffset(offset, name);
            if (!referent) continue;
            const normalized = this.normalizeElementName(referent.name);
            const schema = this.schemaElementsByName[normalized];
            if (!schema?.takesIndex) continue;
            const insertText = isParenthesizedContext
                ? `${name}[]`
                : `${toRefSegmentInsertText(name)}[]`;
            baseItems.push({
                label: `${name}[]`,
                kind: CompletionItemKind.Reference,
                detail: "Indexed reference",
                textEdit: {
                    range: replaceRange,
                    newText: insertText,
                },
                data: {
                    snippetCursor: {
                        caretOffset: insertText.length - 1,
                    },
                } satisfies CompletionSnippetCompletionItemData,
            });
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

        const resolved = this.resolveRefMemberContainerAtOffset(
            offset,
            completionContext.pathParts,
            completionContext.pathPartHasIndex,
        );
        const resolvedNode = resolved.node;

        if (!resolvedNode) {
            return [];
        }

        const componentType = this.normalizeElementName(resolvedNode.name);
        const schema = this.schemaElementsByName[componentType];
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

        // When the resolved element does NOT take an index but the user
        // wrote one (e.g. $sec[1].), the access is invalid — return nothing.
        if (!takesIndex && resolvedPartHasIndex) {
            return [];
        }

        const { descendantNames, propertyNames } = determineVisibleNames(
            takesIndex,
            resolvedPartHasIndex,
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

    if (cursorPosition === "openTag" || cursorPosition === "attributeName") {
        const elmName = this.normalizeElementName(element.name);
        const allowedAttributes =
            this.schemaElementsByName[elmName]?.attributes || [];
        return allowedAttributes.map((attr) => ({
            label: attr.name,
            kind: CompletionItemKind.Enum,
        }));
    }

    if (
        cursorPosition === "attributeValue" ||
        (cursorPosition === "unknown" && prevNonWhitespaceChar === "=")
    ) {
        const elmName = this.normalizeElementName(element.name);
        const allowedAttributes =
            this.schemaElementsByName[elmName]?.attributes || [];
        const attribute = this._getAttributeContainsOffset(element, offset);
        const allowedAttribute = allowedAttributes.find(
            (a) => a.name === attribute?.name,
        );
        // Prefer explicit autocomplete values when provided; fall back to
        // full validation values otherwise.
        const allowedAttrValues =
            allowedAttribute?.autocompleteValues ?? allowedAttribute?.values;
        if (!allowedAttrValues) {
            return [{ label: '""', kind: CompletionItemKind.Value }];
        }
        // If we are right after the =, we should include quotes in the completion,
        // otherwise, assume the user has already supplied the quote marks.
        const includeQuotes = prevNonWhitespaceChar === "=";
        const quote = includeQuotes ? '"' : "";
        return allowedAttrValues.map((value) => ({
            label: `${quote}${value}${quote}`,
            kind: CompletionItemKind.Value,
        }));
    }
    return [];
}
