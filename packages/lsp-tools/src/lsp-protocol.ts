/**
 * Method names for the custom LSP requests Doenet layers on top of the
 * standard JSON-RPC surface.  Both the editor-side client (`@doenet/codemirror`)
 * and the server-side feature modules (`@doenet/lsp/src/features/...`)
 * import these from a single place so a typo on one side surfaces as a
 * build error instead of a silent "request never reached the server".
 *
 * Method names live under the `doenet/` namespace to avoid colliding with
 * any standard LSP method.
 */
export const DOENET_LSP_METHODS = {
    /**
     * Push externally-generated diagnostics into the LSP so the server
     * can re-emit them alongside its own.  Used to surface viewer-side
     * runtime errors (e.g. from a separately-running Core) in the editor's
     * diagnostics panel.
     */
    setAdditionalDiagnostics: "doenet/setAdditionalDiagnostics",
    /**
     * Compute the context-sensitive help payload for a cursor offset.
     * Server runs the schema walk + (when available) the Rust resolver,
     * so multi-part refs like `$rep[1].point1.x` resolve correctly even
     * though the editor itself has no resolver.
     */
    contextHelp: "doenet/contextHelp",
    /**
     * Compute the context-sensitive help payload for the highlighted
     * autocomplete row.  Used while the popup is open so the help panel
     * mirrors arrow-key navigation through completions.
     */
    contextHelpForCompletion: "doenet/contextHelpForCompletion",
} as const;
