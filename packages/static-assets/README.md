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