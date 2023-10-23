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
└──  extension/  // Where the packaged extension goes
     └──  build/ // Where built assets end up
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
