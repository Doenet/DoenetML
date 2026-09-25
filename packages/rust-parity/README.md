# @doenet/rust-parity

A dashboard of how far the Rust DoenetML core (`packages/doenetml-worker-rust`)
is from parity with the JavaScript core it is replacing.

```
npm run parity -w @doenet/rust-parity
```

writes `out/parity-dashboard.html`, a self-contained page showing:

- which components, attributes and properties of the JavaScript core the Rust
  core implements, ranked by how often the tests use them;
- how the JavaScript worker's test suite does when run on the Rust core, with
  each failure classified by what it ran into first (a missing state variable,
  action, core API, test option, or a wrong value).

The data behind the page is in `out/parity-report.json`.

The test run takes 5 to 20 minutes, depending on the machine and its load.
Wireit caches it, so `npm run parity` reruns the tests only when the worker's
sources, its tests or the Rust core have changed. To rebuild the page from the
last test run without rerunning anything, use `npm run parity:report`.

## Inputs

- **JavaScript core:** `@doenet/static-assets`' generated schema
  (`src/generated/doenet-schema.json`). Regenerate it with
  `npm run build:schema -w packages/static-assets` after changing components.
- **Rust core:** `cargo run -p doenetml-core --example component_inventory`,
  which lists every Rust component's attributes, props and actions.
- **Tests:** the worker's Vitest suite run with `DOENET_TEST_CORE=rust`, which
  makes `createTestCore` run documents on the Rust core alone (see
  `packages/doenetml-worker-javascript/src/test/utils/test-core-rust.ts`). To run
  some tests that way yourself:

  ```
  npm run test:rust-core -w @doenet/doenetml-worker-javascript -- --run src/test/tagSpecific/math.test.ts
  ```

The dashboard's "How this is measured" section explains how each number is
computed and what it does not capture.
