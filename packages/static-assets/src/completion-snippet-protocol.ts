export type CompletionSnippetCursor =
    | {
          caretOffset: number;
      }
    | {
          selectionStartOffset: number;
          selectionEndOffset: number;
      };

export type CompletionSnippetCompletionItemData = {
    snippetCursor?: CompletionSnippetCursor;
    // Marker for "wrap the typed bare attribute value in quotes" completions.
    // The CodeMirror plugin recognizes this, sets `filter: false` on the
    // result, and provides an `update` callback that regenerates the
    // completion's label/displayLabel from the live text on every keystroke
    // -- otherwise CodeMirror filters the cached option out as the typed
    // prefix grows beyond the cached label, closing the menu mid-type.
    livePreviewQuoteWrap?: {
        // 0-based document offset of the first bare-value character (e.g.
        // the `h` in `name=hello`, or the `h` after the spaces in
        // `name=   hello`). The CodeMirror plugin uses this to anchor the
        // result's `from`. Relying on the plugin's default `prefixMatch`
        // logic would put `from` at the cursor (one past the typed
        // prefix's first character) because every option's apply text
        // starts with a literal `"` the user has not actually typed,
        // making `matchBefore` return null.
        bareValueStartOffset: number;
    };
};

export function getLivePreviewQuoteWrap(
    data: unknown,
): { bareValueStartOffset: number } | undefined {
    if (!data || typeof data !== "object") {
        return undefined;
    }
    const marker = (data as CompletionSnippetCompletionItemData)
        .livePreviewQuoteWrap;
    if (
        !marker ||
        typeof marker !== "object" ||
        !isNonNegativeInteger(marker.bareValueStartOffset)
    ) {
        return undefined;
    }
    return { bareValueStartOffset: marker.bareValueStartOffset };
}

function isNonNegativeInteger(value: unknown): value is number {
    return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

export function isCompletionSnippetCursor(
    value: unknown,
): value is CompletionSnippetCursor {
    if (!value || typeof value !== "object") {
        return false;
    }

    const hasCaretOffset = "caretOffset" in value;
    const hasSelectionStartOffset = "selectionStartOffset" in value;
    const hasSelectionEndOffset = "selectionEndOffset" in value;

    if (hasCaretOffset) {
        return (
            !hasSelectionStartOffset &&
            !hasSelectionEndOffset &&
            isNonNegativeInteger(value.caretOffset)
        );
    }

    if (hasSelectionStartOffset && hasSelectionEndOffset) {
        return (
            !hasCaretOffset &&
            isNonNegativeInteger(value.selectionStartOffset) &&
            isNonNegativeInteger(value.selectionEndOffset) &&
            value.selectionStartOffset <= value.selectionEndOffset
        );
    }

    return false;
}

/**
 * Extract validated snippet cursor metadata from an LSP completion item `data` payload.
 */
export function getSnippetCursorFromCompletionItemData(
    data: unknown,
): CompletionSnippetCursor | undefined {
    if (!data || typeof data !== "object") {
        return undefined;
    }

    const snippetCursor = (data as CompletionSnippetCompletionItemData)
        .snippetCursor;

    if (!isCompletionSnippetCursor(snippetCursor)) {
        return undefined;
    }

    return snippetCursor;
}
