# @doenet/doenetml-print

DoenetML print tooling and experiments.

## Building

Before building, refresh the bundled PreTeXt core files to the latest upstream commit:

```bash
./update_pretext_core.sh
```

This script downloads the latest PreTeXt repository archive (master, with fallback to main), 
then updates [pretext_core/schema](pretext_core/schema), [pretext_core/xsl](pretext_core/xsl), 
[pretext_core/COPYING](pretext_core/COPYING), and [pretext_core/CURRENT_COMMIT](pretext_core/CURRENT_COMMIT).

After updating PreTeXt core files, run package builds from the repository root:

```bash
npm run build --workspace=@doenet/doenetml-print
npm run build:dev --workspace=@doenet/doenetml-print
```
