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
};

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
