// Fluent catalogs are imported as raw strings so the English bundle is
// inlined into every build variant (viewer, worker, standalone, iframe, LSP).
// The worker in particular cannot reliably fetch a relative URL, so lazy
// loading is not an option for the fallback locale.
declare module "*.ftl?raw" {
    const source: string;
    export default source;
}
