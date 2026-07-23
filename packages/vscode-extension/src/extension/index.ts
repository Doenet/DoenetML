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
    try {
        if (client) {
            await client.stop();
        }
    } finally {
        revokeDoenetWorkerBlobUrl();
    }
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

    // Wrap Worker construction, LanguageClient construction, and client.start()
    // together so that any throw at any point revokes the blob URL.
    try {
        const worker = new Worker(serverMain.toString(true));

        client = new LanguageClient(
            "DoenetLanguageServer",
            "Doenet Language Server",
            clientOptions,
            worker,
        );

        // Start the client. This will also launch the server.
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

        context.subscriptions.push(
            formatAsDoenet,
            formatAsXML,
            formatAsMarkdown,
        );
    } catch (e) {
        revokeDoenetWorkerBlobUrl();
        throw e;
    }
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
    // VS Code's readFile returns Uint8Array<ArrayBufferLike>, but Blob requires
    // Uint8Array<ArrayBuffer>. Copying into a fresh Uint8Array ensures a plain
    // ArrayBuffer-backed view and satisfies the type constraint.
    return URL.createObjectURL(
        new Blob([new Uint8Array(workerBytes)], {
            type: "application/javascript",
        }),
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

    // Editor -> preview: scroll the preview to whatever the cursor is on.
    // Debounced since selection-change fires on every arrow key / click.
    //
    // `suppressNextSelectionEcho` guards against feedback: `onRevealPosition`
    // below sets `editor.selection` to reflect a preview click, which itself
    // fires this same event. Excluding `kind === Command` looks like the
    // right filter for "this change was caused by us," but VS Code only
    // tags selection changes as `Command` when they result from executing a
    // registered command — a direct `editor.selection = ...` assignment
    // fires with `kind: undefined`, same as a real (non-keyboard/mouse)
    // change, so `Command` alone doesn't catch it. Set right before the
    // assignment and consumed here, once, regardless of `kind`.
    let suppressNextSelectionEcho = false;
    let cursorMoveTimer: ReturnType<typeof setTimeout> | undefined;
    vscode.window.onDidChangeTextEditorSelection((e) => {
        if (e.textEditor.document.languageId !== "doenet") {
            return;
        }
        if (suppressNextSelectionEcho) {
            suppressNextSelectionEcho = false;
            return;
        }
        const offset = e.textEditor.document.offsetAt(e.selections[0].active);
        clearTimeout(cursorMoveTimer);
        cursorMoveTimer = setTimeout(() => {
            DoenetPreviewPanel.sendCursorPosition(offset);
        }, 120);
    });

    // Preview -> editor: reveal the source range for a clicked element.
    DoenetPreviewPanel.onRevealPosition = (start, end) => {
        const editor = vscode.window.visibleTextEditors.find(
            (e) => e.document.languageId === "doenet",
        );
        if (!editor) {
            return;
        }
        const range = new vscode.Range(
            editor.document.positionAt(start),
            editor.document.positionAt(end),
        );
        editor.revealRange(
            range,
            vscode.TextEditorRevealType.InCenterIfOutsideViewport,
        );
        const selection = new vscode.Selection(range.start, range.start);
        if (editor.selection.isEqual(selection)) {
            // Cursor is already there (e.g. the same element was clicked
            // twice). Assigning an identical selection fires no
            // selection-change event, so setting the suppression flag would
            // leave it latched and swallow the next real cursor move.
            return;
        }
        suppressNextSelectionEcho = true;
        editor.selection = selection;
    };
}
