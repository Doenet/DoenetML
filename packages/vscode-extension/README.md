# Doenet VSCode Extension

Visual Studio Code extension for developing DoenetML.

## Functionality

This extension provides a language server (LSP) and a preview window for DoenetML. It is configured
as a web extension, so it should run in both locally-installed copies of VSCode and on web copies.

## Structure

```
.
├── src/
│   ├── extension/       // The code for the vscode extension. This sets up the extension, etc..
│   ├── language-server/ // The Doenet language server (runs in a WebWorker)
│   └── preview-window/  // Preview window that shows rendered DoenetML as you edit.
└── extension/           // Where the packaged extension goes
    ├── assets/          // Icon assets
    ├── build/           // Where built assets end up
    └── config/          // Language/syntax highlighting files
```

## Running the extension

-   From the root doenetml repository, make sure you've already run `npm install` and `npm run build` (to make sure all dependencies are built in the correct order)
-   From this directory, run `npm run build`
-   Go to the debug panel in vscode and select `Debug VS Code Extension`. Press the play/launch button. After launching this action, a new vscode window should be opened with the extension loaded.

Loading a file ending in `.doenet` should activate the language-server features. You can quickly test this by typing some invalid doenet (e.g., `<graph xxx />`) and seeing if a warning is highlighted.

You can open the command-palette (Ctrl + Shift + P) and run the `Doenet Preview` action to see a preview of your current doenetml source.

### Development

If you change the extension source code, rebuild that part of the extension via `npm run build:language-server`,
`npm run build:extension`, or `npm run build:preview-window`. Then either restart the vscode debug process or press the "refresh"
button for the currently running process.

#### Packaging the extension

Extension packaging and publishing is automated as part of the production release workflow — though not on this branch, where the extension is neither built nor published by a release (see [Publishing the extension](#publishing-the-extension)). To manually package for testing:

-   Make sure `npm run build` has been run to build all sources
-   Run `npm run package` from the `packages/vscode-extension` directory
-   You will have a new `doenet-vscode-extension-???.vsix` file that you can test locally

#### Publishing the extension

> **On the 0.7 maintenance branch, none of this runs and none of it should be run by hand.**
> `publish.yml` here builds and publishes the four npm packages only; the Marketplace and
> Open VSX steps are not on this branch. On both registries the stable channel is a single
> ascending stream shared with `main` — the `0.7.10<run_number>` pre-releases run beside it
> on their own numbers, which is why a stable upload can sit below them. So releasing an
> 0.7.x extension from here would either be rejected as a downgrade, once `main` has shipped
> an 0.8.x one, or — worse, before that — be accepted and put a maintenance-line build in
> front of every stable user as the newest extension there is. The two manifests still version with
> the fixed group because `validate-tag-versions.mjs` requires it; they are simply never
> published from here. The `publish`, `publish:prerelease`, `publish:openvsx` and
> `publish:openvsx:prerelease` scripts below still work if you run them with a token, which
> is precisely why they should not be. The rest of this section describes `main`.

The production release workflow automatically publishes to the VS Code Marketplace after npm packages are published, then publishes the same extension to the [Open VSX registry](https://open-vsx.org), where VS Code-compatible editors such as VSCodium find it. Open VSX publishing needs an `OVSX_PAT` repository secret; without it that step warns and the rest of the release proceeds. To publish it by hand, run `npm run publish:openvsx -w packages/vscode-extension` with `OVSX_PAT` set to an [open-vsx.org](https://open-vsx.org) access token for the `doenet` namespace.

If the extension publish step fails (e.g., token expiration, transient network issues):

1. The npm packages will still be published, but the workflow will fail.
2. Once the issue is resolved (e.g., PAT refreshed, network restored), manually republish:
   ```bash
   npm run publish -w packages/vscode-extension
   ```
3. Ensure `VSCE_PAT` environment variable is set to your Azure DevOps Personal Access Token.

For permanent PAT rotation:

1. Extension owner generates a new token via [dev.azure.com](https://dev.azure.com)
2. Org admin updates the `VSCE_PAT` GitHub Actions secret
3. Next production release will use the new token

#### Updating the screencast

The screencast in the extension README.md is located in `assets/extension-demo.gif`. To create a new `gif` from a video file, you can use the command

```
ffmpeg -i extension-demo.webm -filter_complex "[0:v] fps=7 [new];[new] split [a][b];[a] palettegen [p];[b][p] paletteuse" output_trimmed_enhanced.gif
```

followed (optinally) by

```
gifsicle -O3 output_trimmed_enhanced.gif -o output_gifsicle.gif
```

If you are satisfied with the result, rename it to `extension-demo.gif`.
