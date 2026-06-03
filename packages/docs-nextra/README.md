# DoenetML Docs

### Dev Instructions

Make sure that `packages/doenetml` and `packages/standalone` have been built. Their assets are needed.
Changes to the docs-nextra files require their own build. New .mdx documents (e.g, in the 'pages/references' folder) require inclusion  in the _meta.ts file to support indexing.  Note: the file name in the .ts file must literally match the filename in the same folder. New components need to be listed in the componentTypes.mdx file.

Then,
```
cd packages/docs-nextra 
npm run build
npm run dev
```

This will then allow the current version of the documentation to be reviewed in the browser.