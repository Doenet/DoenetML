# @doenet/doenetml-print

DoenetML print tooling and experiments.

## About

This package uses Pyodide to run the XSL version of pretext against the converted DoenetML. It is based on the library in https://github.com/siefkenj/pretext-book

## Building

The PreTeXt core files are vendored in [pretext_core/](pretext_core/), at the upstream commit
recorded in `pretext_core/CURRENT_COMMIT`, so a build does not download anything. To upgrade
them to the latest upstream commit, run:

```bash
./update_pretext_core.sh
```

This script downloads the latest PreTeXt repository archive (master, with fallback to main),
then updates [pretext_core/](pretext_core/). Commit everything it changes there.

Run package builds from the repository root:

```bash
npm run build --workspace=@doenet/doenetml-print
npm run build:dev --workspace=@doenet/doenetml-print
```
