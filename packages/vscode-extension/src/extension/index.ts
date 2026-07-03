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
let doenetWorkerBlobUrl: string | undefined;

export async function activate(context: ExtensionContext) {
    await setupLanguageServer(context);
    setupPreviewWindow(context);
}

export async function deactivate(): Promise<void> {
    if (client) {
        await client.stop();
    }
    revokeDoenetWorkerBlobUrl();
}

/**
 * Setup the language server.
 */
async function setupLanguageServer(context: ExtensionContext) {
    // Read the bundled doenetml-worker file and create a blob URL from it.
    // The language server (running as a web worker) needs to spawn its own
    // rust-backed core sub-worker for path resolution — that's how it
    // suppresses false-positive "unknown attribute" diagnostics on
    // `<module copy="$x" ans="57" />` (issue #1375).
    //
    // We pass the blob URL via `initializationOptions.doenetWorkerUrl`, which
    // the LSP's `onInitialize` handler already reads and stores in `config`.
    // Using a blob URL (rather than a vscode-file:// URL directly) ensures the
    // language server worker can call `new Worker(url)` in any context.
    revokeDoenetWorkerBlobUrl();
    try {
        doenetWorkerBlobUrl = await createDoenetWorkerBlobUrl(context);
    } catch (e) {
        console.warn(
            "[DoenetML] Could not load doenetml-worker for LSP rust resolver:",
            e,
        );
    }

    // Options to control the language client
    const clientOptions: LanguageClientOptions = {
        // Register the server for plain text documents
        documentSelector: [
            { scheme: "file", language: "doenet" },
            { scheme: "untitled", language: "doenet" },
        ],
        initializationOptions: doenetWorkerBlobUrl
            ? { doenetWorkerUrl: doenetWorkerBlobUrl }
            : undefined,
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
    await client.start();

    const formatAsDoenet = registerFormatCommand(
        "doenet.formatAsDoenetML",
        "doenet.formatAsDoenetML",
    );
    const formatAsXML = registerFormatCommand(
        "doenet.formatAsXML",
        "doenet.formatAsXML",
    );
    const formatAsMarkdown = registerFormatCommand(
        "doenet.formatAsMarkdown",
        "doenet.formatAsMarkdown",
    );

    context.subscriptions.push(formatAsDoenet, formatAsXML, formatAsMarkdown);
}

function registerFormatCommand(commandName: string, requestName: string) {
    return commands.registerCommand(commandName, async () => {
        const activeTextEditor = vscode.window.activeTextEditor;
        if (!activeTextEditor) {
            return;
        }
        const currentDocument = activeTextEditor.document;
        const edits: TextEdit[] = await client.sendRequest(
            requestName,
            String(currentDocument.uri),
        );
        await activeTextEditor.edit((editBuilder) => {
            for (const edit of edits) {
                editBuilder.replace(
                    lspRangeToVscodeRange(edit.range),
                    edit.newText,
                );
            }
        });
    });
}

async function createDoenetWorkerBlobUrl(context: ExtensionContext) {
    const workerUri = vscode.Uri.joinPath(
        context.extensionUri,
        "build/doenetml-worker/index.js",
    );
    const workerBytes = await vscode.workspace.fs.readFile(workerUri);
    // Decode the bytes as a UTF-8 string so the Blob is created from the
    // exact file content.  Using `workerBytes.buffer` directly is unsafe
    // because VS Code's readFile may return a Uint8Array that is a
    // sub-view of a larger ArrayBuffer (non-zero byteOffset), which would
    // include garbage bytes before the actual file content and corrupt the
    // JavaScript source.
    const workerSource = new TextDecoder().decode(workerBytes);
    return URL.createObjectURL(
        new Blob([workerSource], { type: "application/javascript" }),
    );
}

function revokeDoenetWorkerBlobUrl() {
    if (!doenetWorkerBlobUrl) {
        return;
    }
    URL.revokeObjectURL(doenetWorkerBlobUrl);
    doenetWorkerBlobUrl = undefined;
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
