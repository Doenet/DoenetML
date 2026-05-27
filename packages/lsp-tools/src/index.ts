export * from "./doenet-source-object";
export * from "./auto-completer";
export * from "./doenet-to-markdown";
export * from "./context-help";
export * from "./lsp-protocol";
export { dedupeLspDiagnostics } from "./dedupe-lsp-diagnostics";
// Curated re-exports rather than `export *`: only the resolver's high-value
// API needs to be on the package surface. Internal helpers
// (`canonicalStyleAttributeKey`, `isColorAttributeKey`, `isStyleAttributeName`)
// stay module-scoped so consumers can't accidentally grow new dependencies on
// them and constrain a future refactor.
export {
    resolveActiveStyle,
    resolveActiveStyleAttributeValue,
    resolveActiveStyleNumber,
} from "./style-context/resolve-active-style";
export type {
    ActiveStyleAttributeValue,
    ActiveStyleResolution,
    ExcludeAttribute,
} from "./style-context/resolve-active-style";
