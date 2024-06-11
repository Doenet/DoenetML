// Based off of Microsoft's lsp-spample: https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-sample
// MIT licensed.

import {
    workspace,
    ExtensionContext,
    commands,
    TextDocumentChangeEvent,
} from "vscode";
import * as vscode from "vscode";

import {
    LanguageClient,
    LanguageClientOptions,
    TextEdit,
} from "vscode-languageclient/browser";
import { DoenetPreviewPanel } from "./preview-panel/doenet-preview-panel";
import { lspRangeToVscodeRange } from "./utils/lsp-range-to-vscode-range";

let client: LanguageClient;

export function activate(context: ExtensionContext) {
    setupLanguageServer(context);
    setupPreviewWindow(context);
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}

/**
 * Setup the language server.
 */
async function setupLanguageServer(context: ExtensionContext) {
    // Options to control the language client
    const clientOptions: LanguageClientOptions = {
        // Register the server for plain text documents
        documentSelector: [{ language: "doenet" }],
    };

    // Create a worker. The worker main file implements the language server.
    const serverMain = vscode.Uri.joinPath(
        context.extensionUri,
        "build/language-server/index.js",
    );
    const worker = new Worker(serverMain.toString(true));

    // Create the language client and start the client.
    client = new LanguageClient(
        "DoenetLanguageServer",
        "Doenet Language Server",
        clientOptions,
        worker,
    );

    // Start the client. This will also launch the server
    client.start();

    const formatAsDoenet = commands.registerCommand(
        "doenet.formatAsDoenetML",
        async () => {
            const activeTextEditor = vscode.window.activeTextEditor;
            if (!activeTextEditor) {
                return;
            }
            const currentDocument = vscode.window.activeTextEditor?.document;
            const edits: TextEdit[] = await client.sendRequest(
                "doenet.formatAsDoenetML",
                String(currentDocument.uri),
            );
            activeTextEditor.edit((editBuilder) => {
                for (const edit of edits) {
                    editBuilder.replace(
                        lspRangeToVscodeRange(edit.range),
                        edit.newText,
                    );
                }
            });
        },
    );
    const formatAsXML = commands.registerCommand(
        "doenet.formatAsXML",
        async () => {
            const activeTextEditor = vscode.window.activeTextEditor;
            if (!activeTextEditor) {
                return;
            }
            const currentDocument = vscode.window.activeTextEditor?.document;
            const edits: TextEdit[] = await client.sendRequest(
                "doenet.formatAsXML",
                String(currentDocument.uri),
            );
            activeTextEditor.edit((editBuilder) => {
                for (const edit of edits) {
                    editBuilder.replace(
                        lspRangeToVscodeRange(edit.range),
                        edit.newText,
                    );
                }
            });
        },
    );

    const formatAsMarkdown = commands.registerCommand(
        "doenet.formatAsMarkdown",
        async () => {
            const activeTextEditor = vscode.window.activeTextEditor;
            if (!activeTextEditor) {
                return;
            }
            const currentDocument = vscode.window.activeTextEditor?.document;
            const edits: TextEdit[] = await client.sendRequest(
                "doenet.formatAsMarkdown",
                String(currentDocument.uri),
            );
            activeTextEditor.edit((editBuilder) => {
                for (const edit of edits) {
                    editBuilder.replace(
                        lspRangeToVscodeRange(edit.range),
                        edit.newText,
                    );
                }
            });
        },
    );

    context.subscriptions.push(formatAsDoenet, formatAsXML, formatAsMarkdown);
}

/**
 * Allow a user to open a Doenet preview window.
 */
function setupPreviewWindow(context: ExtensionContext) {
    // Register the preview window
    const showPreviewWindow = commands.registerCommand(
        "doenet.showPreview",
        () => {
            const currentDocument = vscode.window.activeTextEditor?.document;
            if (currentDocument?.languageId === "doenet") {
                DoenetPreviewPanel.currentSource = currentDocument.getText();
            }

            DoenetPreviewPanel.render(context.extensionUri);
            DoenetPreviewPanel.triggerRefresh();
        },
    );
    context.subscriptions.push(showPreviewWindow);

    // Every time a Doenet document changes, update the source in the preview window
    workspace.onDidChangeTextDocument((e: TextDocumentChangeEvent) => {
        if (
            e.document.languageId !== "doenet" ||
            e.document.fileName !==
                vscode.window.activeTextEditor?.document?.fileName
        ) {
            return;
        }
        DoenetPreviewPanel.setSource(e.document.getText());
    });

    workspace.onDidSaveTextDocument((document) => {
        if (
            document.languageId !== "doenet" ||
            document.fileName !==
                vscode.window.activeTextEditor?.document?.fileName
        ) {
            return;
        }
        DoenetPreviewPanel.setSource(document.getText());
        DoenetPreviewPanel.triggerRefresh();
    });

    vscode.window.onDidChangeActiveTextEditor((e) => {
        if (e.document.languageId !== "doenet") {
            return;
        }
        DoenetPreviewPanel.setSource(e.document.getText());
        DoenetPreviewPanel.triggerRefresh();
    });
}
