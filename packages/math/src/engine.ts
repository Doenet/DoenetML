/**
 * The engine this build resolves to: the Rust/WASM one.
 *
 * `vite.config.ts` aliases this module to `./engine-js` when the build runs
 * with `DOENET_MATH_ENGINE=js`; otherwise the file you are reading is what
 * ships. Resolving at build time rather than at runtime is deliberate:
 *
 *   - `me.fromAst` and `.tree` are called from dependency-graph hot loops, so a
 *     runtime indirection (a Proxy, or a branch per access) would tax every
 *     call to serve a switch that flips once per build.
 *   - Only the selected engine lands in the bundle, so a JS-engine build does
 *     not carry a multi-megabyte inlined WASM payload it never executes.
 *
 * A differential harness that needs *both* engines at once should import
 * `@doenet/math/engine-js` and `@doenet/math/engine-rust` directly rather than
 * going through this module.
 */
export * from "./engine-rust";
export { default } from "./engine-rust";
