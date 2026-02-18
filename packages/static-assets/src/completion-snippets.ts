import _COMPLETION_SNIPPETS from "./generated/completion-snippets.json";

export type CompletionSnippet = {
    element: string;
    snippet: string;
    description: string;
};

export const COMPLETION_SNIPPETS: Record<string, CompletionSnippet> =
    _COMPLETION_SNIPPETS;
