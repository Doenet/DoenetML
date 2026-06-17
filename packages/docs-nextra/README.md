# DoenetML Docs

### Dev Instructions

Make sure that `packages/doenetml` and `packages/standalone` have been built. Their assets are needed.
Changes to the docs-nextra files require their own build. New .mdx documents (e.g, in the 'pages/references' folder) require inclusion  in the _meta.ts file to support indexing.  Note: the file name in the .ts file must literally match the filename in the same folder. New components need to be listed in the 'componentTypes.mdx' file.

Then, if you update 'componentTypes.mdx', then be sure to update the static assets so to generate the indexing needed:

```
cd packages/static-assets
npm run build:schema
```

Then rebuild the documentation and test it:

```
cd packages/docs-nextra 
npm run build
npm run dev
```

This will then allow the current version of the documentation to be reviewed in the browser.

Please commit all changes to the repository...