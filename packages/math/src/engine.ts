/**
 * The engine: the Rust core compiled to WASM, reached through
 * `math-expressions-js-compat`.
 *
 * This module used to be a build-time switch between two engines. There is only
 * one now — the legacy JavaScript library was removed once it stopped carrying
 * any runtime code we ship. The indirection is kept because the 147 files that
 * import `math-expressions` name no engine, and because it remains the one
 * place to look to answer "what backs `me` in this build?".
 */
export * from "./engine-rust";
export { default } from "./engine-rust";
