# Demos
This workspace builds several of the dev websites for the doenetml packages and bundles them for distribution to a testing/debug website.

## Adding a demo package

The demo build list is derived from [package.json](package.json) under `wireit.build.dependencies`.

To include another package in the demos output:

1. Add that package as a dependency in [package.json](package.json) under `wireit.build.dependencies` (for example, `../my-package:build:dev`).
2. Ensure the target package has a `build:dev` wireit target that writes to `dist-dev`.
3. Ensure the target package's Vite config respects the `mode` flag so development-mode builds produce the expected demo output. Look in `packages/doenetml-to-pretext` for an example.

When [scripts/build-demos.ts](scripts/build-demos.ts) runs, it reads these dependencies, copies each package's `dist-dev` output, and adds it to the generated demo index page.

