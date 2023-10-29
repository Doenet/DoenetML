# Static Assets for DoenetML

Some static assets are dynamically generated from source (e.g., the schema). This package
hosts those static assets and allows them to be rebuilt. JSON files are re-exported as JavaScript
files to allow for tree shaking.

This package re-exports JSON blobs to allow for proper tree-shaking. It also pre-compresses the JSON if
it results in a savings of at least 5%.
