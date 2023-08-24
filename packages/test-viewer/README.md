# Test Viewer
This workspace contains a test-viewer that imports from `@doenet/doenetml`. The `packages/doenetml` workspace
must be built before this test-viewer can be built.

## Running

Run
```bash
npm run dev
```
to start a `vite` dev server that serves the test viewer and navigate to the indicated URL. By default
`index.html` is served. You can instead navigate to `index-inline-worker.html` to view the same page but
with the inlined version of the DoenetML web worker.