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

    if ("caretOffset" in value) {
        return isNonNegativeInteger(value.caretOffset);
    }

    if ("selectionStartOffset" in value && "selectionEndOffset" in value) {
        return (
            isNonNegativeInteger(value.selectionStartOffset) &&
            isNonNegativeInteger(value.selectionEndOffset)
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
