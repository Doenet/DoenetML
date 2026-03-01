import _COMPLETION_SNIPPETS from "./generated/completion-snippets.json";
import type { CompletionSnippetCursor } from "./completion-snippet-protocol.js";

// This module owns snippet catalog data.
// Completion-item payload protocol types/guards live in `completion-snippet-protocol.ts`.

export type CompletionSnippet = {
    element: string;
    snippet: string;
    description: string;
    cursor?: CompletionSnippetCursor;
};

export const COMPLETION_SNIPPETS: Record<string, CompletionSnippet> =
    _COMPLETION_SNIPPETS;
