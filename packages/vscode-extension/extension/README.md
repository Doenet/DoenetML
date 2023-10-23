# Doenet VSCode Extension

[![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/doenetml.doenet-vscode-extension?color=informational&logo=visualstudiocode&style=for-the-badge&label=VS%20Marketplace)](https://marketplace.visualstudio.com/items?itemName=doenetml.doenet-vscode-extension)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/doenetml.doenet-vscode-extension?logo=visualstudiocode&color=informational&style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=doenetml.doenet-vscode-extension)

A Visual Studio Code extension to make writing [Doenet](https://doenet.org) documents easier.

## Features

-   Syntax highlighting and auto-completion for `.doenet` files
-   Highlights invalid doenet attributes
-   Previewing of doenet documents. To access, open the command pallet (Ctrl+Shift+P) and select the `Preview Doenet` action.
-   Pretty-printing of Doenet source code.

![Screencast of Doenet VSCode Features](https://github.com/doenet/DoenetML/raw/main/packages/vscode-extension/assets/extension-demo.gif)

## Usage

### Identifying Doenet Documents

Open the a folder in VSCode. Open any of your source documents. If it has a `.doenet` file extension, it should be identified as a Doenet document, and you will see "Doenet" as the language in the bottom right corner of the window. You can associate other file extensions with the Doenet language using the "Files: Associations" setting (Ctrl+, brings up settings). Or you can select Doenet for a particular document using the "Change Language Mode" command.

Having a document identified as a Doenet document will give you:

-   Syntax highlighting
-   Schema validation

## Change log

You can track the ongoing development progress in the [Changelog](CHANGELOG.md).

## Contributions

Like this extension? [Star it on GitHub](https://github.com/doenet/DoenetML/stargazers)!

Do you have an idea or suggestion? [Open a feature request](https://github.com/doenet/DoenetML/issues).

Found something wrong? [File an issue](https://github.com/doenet/DoenetML/issues).
