# Static Assets for DoenetML

Some static assets are dynamically generated from source (e.g., the schema). This package
hosts those static assets and allows them to be rebuilt. JSON files are re-exported as JavaScript
files to allow for tree shaking.

This package re-exports JSON blobs to allow for proper tree-shaking. It also pre-compresses the JSON if
it results in a savings of at least 5%.

To build the schema type: (e.g., after adding/modifying components, attributes, properties, etc.)
```
cd packages/static-assets
npm run build:schema
```
PLEASE commit these changes to the branch.

To build snippets and other assets:
```
cd packages/static-assets
npm run build:assets
```

## Why the generator scripts are wireit scripts

`build:schema`, `build:assets` and `check:docs-coverage` generate from the
worker's component definitions, which they import as **source**
(`doenetml-worker-javascript/src/utils/componentInfoObjects`). That source
resolves `@doenet/utils`, `@doenet/i18n` and `@doenet/parser` to their built
`dist/`, so running a generator against a stale sibling silently generates from
old code — a regenerated schema can come out *missing* entries a branch just
added, which reads as "the committed schema is stale" when the stale thing is
`@doenet/i18n/dist`.

All three are therefore wireit scripts that declare those builds as
dependencies, so they build what they read. They deliberately declare no
`files`/`output`, which is what makes wireit always re-run them: a schema
freshness check served from a cache would check nothing.
`test/generator-script-dependencies.test.ts` documents the trade-offs in full
and fails if the declarations drift from the worker's own.
