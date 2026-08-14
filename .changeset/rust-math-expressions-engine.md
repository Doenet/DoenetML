---
"@doenet/doenetml": patch
"@doenet/standalone": patch
"@doenet/doenetml-iframe": patch
"@doenet/vscode-extension": patch
"doenet-vscode-extension": patch
---

Replace the JavaScript `math-expressions` library with the Rust core compiled to WASM.

Everything DoenetML does with mathematics — parsing what a student types, deciding whether an
answer is equivalent to the expected one, simplifying, differentiating, rendering a `<math>` — now
runs through the Rust engine reached by its `math-expressions-js-compat` drop-in, rather than
through the legacy JavaScript library. The API is unchanged, so authored documents need no edits,
but the engine is a different implementation and some results differ:

- **Text rendering of containers is no longer padded.** A point that read `( 0, 0 )` now reads
  `(0, 0)`; the same for intervals, vectors and matrices. LaTeX rendering is unchanged, so anything
  displayed as math looks exactly as before — only plain-text output moved.
- **Simplification is stronger.** Identities the old engine could not reach, such as
  `exp(ln x) → x`, `cos(pi/3) → 1/2` and `log_2(2^3) → 3`, now fold. Because equality testing
  evaluates exact constants, expressions the old engine called different can now compare equal,
  which can change whether a student's answer is marked correct.
- **Inverse trigonometric notation parses correctly.** `sin^(-1)(1)` is read as the inverse
  function; the old engine read it as `(1/sin)(1)`.

The engine's WASM is inlined into the bundle rather than fetched, so no extra network request is
made, but the bundle carries it: the engine is 2.40 MiB uncompressed and 783 kB gzipped, against
1.04 MiB and 286 kB for the JavaScript library it replaces. Building DoenetML from source now
requires a Rust toolchain with the `wasm32-unknown-unknown` target and a matching
`wasm-bindgen-cli`.
