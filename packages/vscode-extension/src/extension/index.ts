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
    CompletionContext,
    CompletionParams,
    CompletionRequest,
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
        // Every Doenet document, whatever filesystem it came from. Naming
        // schemes here would limit the server to `file:` and `untitled:`,
        // which leaves it silent in exactly the places a web extension is
        // meant to work: vscode.dev and github.dev serve their files as
        // `vscode-vfs:`, and a virtual workspace can use any scheme at all.
        documentSelector: [{ language: "doenet" }],
        initializationOptions: doenetWorkerBlobUrl
            ? { doenetWorkerUrl: doenetWorkerBlobUrl }
            : undefined,
        middleware: {
            provideCompletionItem: provideCompletionItemWithExplicitFlag,
        },
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

        const triggerSuggest = registerTriggerSuggestCommand();

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
            triggerSuggest,
            formatAsDoenet,
            formatAsXML,
            formatAsMarkdown,
        );
    } catch (e) {
        revokeDoenetWorkerBlobUrl();
        throw e;
    }
}

// The language server opens its element menu on an explicit completion
// invocation even where no `<` has been typed — the same Ctrl+Space that
// offers `<point>`, `<graph>`, … in the web editor. LSP has no field for "the
// user asked for this": VS Code reports `Invoked` both for Ctrl+Space and for
// the quick suggestions that fire on a typed letter, so a server keying off
// `triggerKind` alone would dump the element menu into the middle of a
// sentence. `doenet.triggerSuggest` records the keystroke and
// `provideCompletionItemWithExplicitFlag` marks the request it produces,
// which is what the web editor's CodeMirror client sends as
// `context.explicit`.
let pendingExplicitCompletion: { uri: string; version: number } | undefined;
let inExplicitCompletionSession = false;

/**
 * Completion params carrying the `explicit` flag `@doenet/lsp` reads. It is an
 * extension to the protocol's own `CompletionContext`, so it has to be spelled
 * out here for the request to type-check.
 */
type ExplicitCompletionParams = CompletionParams & {
    context: CompletionContext & { explicit: true };
};

/**
 * Take over Ctrl+Space for Doenet documents so the completion request it
 * produces can be marked explicit, then hand off to the built-in command that
 * actually opens the widget.
 */
function registerTriggerSuggestCommand() {
    return commands.registerCommand("doenet.triggerSuggest", async () => {
        const document = vscode.window.activeTextEditor?.document;
        if (document?.languageId === "doenet") {
            pendingExplicitCompletion = {
                uri: String(document.uri),
                version: document.version,
            };
        }
        await commands.executeCommand("editor.action.triggerSuggest");
    });
}

/**
 * True when this completion request is the one `doenet.triggerSuggest` just
 * asked for. Consumes the pending flag, so a request VS Code raises on its own
 * is never mistaken for one the user asked for.
 */
function isExplicitCompletion(
    document: vscode.TextDocument,
    context: vscode.CompletionContext,
): boolean {
    // A list marked `isIncomplete` makes VS Code re-ask as the user keeps
    // typing. Those follow-ups belong to the session Ctrl+Space opened, so
    // they inherit its explicitness — otherwise the element menu would empty
    // out on the first keystroke after it appeared.
    if (
        context.triggerKind ===
        vscode.CompletionTriggerKind.TriggerForIncompleteCompletions
    ) {
        return inExplicitCompletionSession;
    }
    // Any other request begins a new session. Matching the document version
    // as well as the URI expires a flag whose keystroke never produced a
    // request: by the time quick suggestions fire again the user has typed,
    // and the version has moved on.
    const pending = pendingExplicitCompletion;
    pendingExplicitCompletion = undefined;
    inExplicitCompletionSession =
        pending !== undefined &&
        pending.uri === String(document.uri) &&
        pending.version === document.version;
    return inExplicitCompletionSession;
}

/**
 * Completion middleware that adds `explicit: true` to the request context for
 * a Ctrl+Space invocation.
 *
 * The request has to be issued by hand rather than through `next`:
 * `asCompletionParams` rebuilds the context from `triggerKind` and
 * `triggerCharacter` alone, so an extra field set on the way in is dropped
 * before the request goes out.
 */
async function provideCompletionItemWithExplicitFlag(
    document: vscode.TextDocument,
    position: vscode.Position,
    context: vscode.CompletionContext,
    token: vscode.CancellationToken,
    next: (
        document: vscode.TextDocument,
        position: vscode.Position,
        context: vscode.CompletionContext,
        token: vscode.CancellationToken,
    ) => vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList>,
) {
    if (!isExplicitCompletion(document, context)) {
        return next(document, position, context, token);
    }
    const params = client.code2ProtocolConverter.asCompletionParams(
        document,
        position,
        context,
    );
    const explicitParams: ExplicitCompletionParams = {
        ...params,
        context: { ...params.context, explicit: true },
    };
    const result = await client.sendRequest(
        CompletionRequest.type,
        explicitParams,
        token,
    );
    if (token.isCancellationRequested) {
        return null;
    }
    return client.protocol2CodeConverter.asCompletionResult(
        result,
        undefined,
        token,
    );
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
        // No editor is active whenever the last one closes, or focus lands
        // somewhere that isn't a text editor at all.
        if (e?.document.languageId !== "doenet") {
            return;
        }
        DoenetPreviewPanel.setSource(e.document.getText());
        DoenetPreviewPanel.triggerRefresh();
    });

    // Editor -> preview: scroll the preview to the cursor, on request.
    //
    // The web editor spells this gesture Cmd/Ctrl+click, but the VS Code API
    // exposes no modifier information for text-editor clicks (and Cmd+click is
    // reserved for Go to Definition), so there is nothing to hang a modified
    // click on here. A command with a default keybinding is the closest
    // equivalent VS Code offers, and it has the advantage of being rebindable
    // through the standard Keyboard Shortcuts UI. The same chord works in the
    // web editor, so the two agree on at least one way to ask.
    //
    // That chord (`ctrl+alt+p`, `cmd+alt+p` on macOS — see the `keybindings`
    // contribution) is unclaimed by VS Code's defaults on Windows and Linux.
    // On macOS it shadows the find widget's `togglePreserveCase`, whose
    // `when` is the broader `editorFocus`; ours is narrowed to
    // `editorTextFocus && editorLangId == doenet`, so the built-in still
    // fires from the find/replace inputs, and anyone who wants it back in
    // the text area of a Doenet file can rebind either one.
    const revealCursorInPreview = commands.registerCommand(
        "doenet.revealCursorInPreview",
        () => {
            const editor = vscode.window.activeTextEditor;
            if (editor?.document.languageId !== "doenet") {
                return;
            }
            DoenetPreviewPanel.sendCursorPosition(
                editor.document.offsetAt(editor.selection.active),
            );
        },
    );
    context.subscriptions.push(revealCursorInPreview);

    // Continuous version of the above: scroll the preview to whatever the
    // cursor is on, on every cursor move.
    //
    // On by default, unlike the web editor, which scrolls its preview only
    // when asked. The difference is deliberate: scroll-sync is what a VS Code
    // preview conventionally does — the built-in Markdown preview ships it on
    // via `markdown.preview.scrollPreviewWithEditor` — and the web editor's
    // Cmd/Ctrl+click gesture has no counterpart here to replace it with. Turn
    // it off to get the web editor's behavior, where only the command moves
    // the preview.
    //
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
        // Consumed before the setting is consulted, so an echo can't stay
        // latched while the setting is off and then swallow the first real
        // cursor move after someone turns it on.
        if (suppressNextSelectionEcho) {
            suppressNextSelectionEcho = false;
            // Drop a send still queued from a cursor move just before the
            // preview click: it carries a stale offset that would scroll the
            // preview back off the element the click just revealed.
            clearTimeout(cursorMoveTimer);
            return;
        }
        // Read per event rather than cached: a settings change then takes
        // effect immediately, with no reload and nothing to unsubscribe. The
        // fallback matches the manifest's default, so the two can't disagree.
        if (
            !workspace
                .getConfiguration("doenet")
                .get<boolean>("preview.scrollPreviewWithEditor", true)
        ) {
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
