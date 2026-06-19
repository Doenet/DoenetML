// @ts-ignore — ?raw loads the pre-built IIFE as a string so we can create
// a blob: URL Worker.  This avoids the double-base64 encoding that Vite's
// ?worker inline produces (data: URL of the entire IIFE), which increased
// downstream bundles and broke WASM loading inside the worker.
import lspSource from "@doenet/lsp/language-server.js?raw";

function createLspWorkerBlobUrl() {
    return URL.createObjectURL(
        new Blob([lspSource], { type: "application/javascript" }),
    );
}
import { initWorker } from "./utils/init-message-connection";
import {
    Diagnostic,
    Position,
    CompletionContext,
} from "vscode-languageserver-protocol/browser";
import {
    DOENET_LSP_METHODS,
    type ContextHelpCompletion,
    type HelpContent,
} from "@doenet/lsp-tools";

// Re-export the help-payload types so editor code that already depends on
// `@doenet/codemirror` for the LSP integration can pick up the types from
// the same place as `class LSP` (without growing a separate `@doenet/lsp-tools`
// import for the help feature).
export type { ContextHelpCompletion, HelpContent };

/**
 * Inert default payload returned to callers when the LSP can't be reached
 * (e.g. init hasn't completed and `workerConn` is unavailable).  Matches the
 * shape the server returns for the same fallback cases.
 */
const HELP_NONE: HelpContent = { kind: "none" };

/**
 * Create a promise with its resolver.
 */
function withResolver<T>() {
    let resolve: (value: T) => void;
    const promise = new Promise<T>((res) => {
        resolve = res;
    });
    return { resolve: resolve!, promise };
}

export class LSP {
    // Diagnostics subscribers are scoped by document URI.
    // They are automatically removed when closeDocument(uri) is called.
    private readonly diagnosticsSubscribersByUri = new Map<
        string,
        Set<(params: { uri: string; diagnostics: Diagnostic[] }) => void>
    >();

    worker?: Worker;
    lspConn?: Awaited<ReturnType<typeof initWorker>>["lspConn"];
    workerConn?: Awaited<ReturnType<typeof initWorker>>["workerConn"];
    versionCounter: Record<string, number> = {};
    diagnosticsHandlerRegistered = false;
    initPromise = withResolver<void>();
    initStatus: "uninitialized" | "initializing" | "initialized" =
        "uninitialized";
    completionTriggers: string[] = [];
    /**
     * URL of the inlined core webworker JS bundle.  Captured before the
     * server initializes; the value sent in the LSP `initialize` request
     * tells the server how to spawn the rust core sub-worker.
     * Once init runs, later assignments are ignored (see `setDoenetWorkerUrl`).
     */
    doenetWorkerUrl?: string;

    /**
     * Set the doenet worker URL used during LSP initialization.  Only takes
     * effect before `init()` runs — once the LSP is initialized the URL is
     * locked in for the rest of the session.  If a later `<CodeMirror>`
     * instance passes a *different* URL, it is ignored and a warning is
     * emitted so the conflict is visible to developers.
     */
    setDoenetWorkerUrl(doenetWorkerUrl: string | undefined) {
        if (this.initStatus !== "uninitialized") {
            if (doenetWorkerUrl && doenetWorkerUrl !== this.doenetWorkerUrl) {
                console.warn(
                    "DoenetML LSP: doenetWorkerUrl is a process-wide singleton; " +
                        "the URL passed by a later <CodeMirror> instance is being ignored. " +
                        `Using "${this.doenetWorkerUrl}", ignoring "${doenetWorkerUrl}".`,
                );
            }
            return;
        }
        if (doenetWorkerUrl) {
            this.doenetWorkerUrl = doenetWorkerUrl;
        }
    }

    ensureDiagnosticsHandlerRegistered() {
        if (!this.lspConn || this.diagnosticsHandlerRegistered) {
            return;
        }
        this.lspConn.onDiagnostics((params) => {
            const uriSubscribers = this.diagnosticsSubscribersByUri.get(
                params.uri,
            );
            if (!uriSubscribers) {
                return;
            }
            for (const subscriber of uriSubscribers) {
                subscriber(params);
            }
        });
        this.diagnosticsHandlerRegistered = true;
    }

    async init() {
        if (this.lspConn) {
            return;
        }
        if (this.initStatus === "uninitialized") {
            this.initStatus = "initializing";
            let workerBlobUrl: string | null = null;
            try {
                workerBlobUrl = createLspWorkerBlobUrl();
                this.worker = new Worker(workerBlobUrl);
            } finally {
                if (workerBlobUrl) {
                    const urlToRevoke = workerBlobUrl;
                    // Revoke after construction to avoid accumulating blob URLs
                    // across long sessions and hot-reload cycles.
                    queueMicrotask(() => URL.revokeObjectURL(urlToRevoke));
                }
            }
            const { lspConn, workerConn } = await initWorker(
                this.worker!,
                this.doenetWorkerUrl,
            );
            this.lspConn = lspConn;
            this.workerConn = workerConn;
            this.completionTriggers = this.lspConn.completionTriggers;
            this.ensureDiagnosticsHandlerRegistered();
            this.initPromise.resolve();
            this.initStatus = "initialized";
        }
        if (this.initStatus === "initializing") {
            await this.initPromise.promise;
        }
    }

    /**
     * Subscribe to diagnostics for a specific document URI.
     *
     * Returns an unsubscribe function for immediate/manual cleanup.
     * Subscriptions are also automatically pruned when closeDocument(uri) is called.
     */
    onDiagnostics(
        uri: string,
        callback: (params: { uri: string; diagnostics: Diagnostic[] }) => void,
    ) {
        const existing = this.diagnosticsSubscribersByUri.get(uri);
        if (existing) {
            existing.add(callback);
        } else {
            this.diagnosticsSubscribersByUri.set(uri, new Set([callback]));
        }

        this.init()
            .then(() => {
                this.ensureDiagnosticsHandlerRegistered();
            })
            .catch((error) => {
                console.error(
                    "Failed to initialize diagnostics handler",
                    error,
                );
            });

        return () => {
            const subscribers = this.diagnosticsSubscribersByUri.get(uri);
            if (!subscribers) {
                return;
            }
            subscribers.delete(callback);
            if (subscribers.size === 0) {
                this.diagnosticsSubscribersByUri.delete(uri);
            }
        };
    }

    async initDocument(uri: string, text: string) {
        if (!this.lspConn) {
            await this.init();
            await this.initDocument(uri, text);
            return;
        }
        this.versionCounter[uri] = 1;
        await this.lspConn.textDocumentOpened({
            textDocument: {
                uri,
                languageId: "doenet",
                version: 1,
                text,
            },
        });
    }

    async closeDocument(uri: string) {
        if (!this.lspConn) {
            await this.init();
            await this.closeDocument(uri);
            return;
        }
        await this.lspConn.textDocumentClosed({
            textDocument: {
                uri,
            },
        });

        // Remove per-document state and URI-scoped diagnostics subscriptions.
        delete this.versionCounter[uri];
        this.diagnosticsSubscribersByUri.delete(uri);
    }

    async updateDocument(uri: string, text: string) {
        if (!this.lspConn || !this.versionCounter[uri]) {
            await this.initDocument(uri, text);
            return;
        }
        this.versionCounter[uri] += 1;
        await this.lspConn.textDocumentChanged({
            textDocument: {
                uri,
                version: this.versionCounter[uri],
            },
            contentChanges: [
                {
                    text,
                },
            ],
        });
    }

    async getCompletionItems(
        uri: string,
        position: Position,
        // `explicit` is a non-standard extension to the LSP completion
        // context: the plugin sets it when the user pressed Ctrl+Space (vs.
        // the popup opening from typing). It rides along the JSON-RPC params
        // and is read back on the server in `completions.ts`.
        context: CompletionContext & { explicit?: boolean },
    ) {
        await this.initPromise.promise;
        if (!this.lspConn) {
            console.warn("Cannot get completion items without lspConn");
            return [];
        }
        return await this.lspConn.getCompletion({
            textDocument: { uri },
            position,
            context,
        });
    }

    /**
     * This is a special function just for the Doenet LSP.
     * It allows the client to send additional diagnostics that are not generated by the LSP itself.
     * For example, messages generated by an external instance of Core may be sent here and then delivered
     * by the LSP back to the client.
     */
    async sendAdditionalDiagnostics(
        uri: string,
        additionalDiagnostics: Diagnostic[],
    ): Promise<void> {
        await this.initPromise.promise;
        if (!this.workerConn) {
            console.warn(
                "Cannot send additional diagnostics without workerConn",
            );
            return;
        }
        await this.workerConn.sendRequest(
            DOENET_LSP_METHODS.setAdditionalDiagnostics,
            {
                uri,
                additionalDiagnostics,
            },
        );
    }

    /**
     * Ask the LSP server for the context-sensitive help payload at the given
     * cursor `offset`.  Implements the editor side of issue #1086 / Option 4:
     * help derivation runs in the LSP worker (which already holds a Rust
     * resolver adapter), so multi-segment refs like `$rep[1].point1.x`
     * resolve correctly here even though the editor itself has no resolver.
     *
     * Returns `{ kind: "none" }` if the LSP hasn't been wired up yet — the
     * editor renders an empty help panel rather than throwing.
     */
    async requestContextHelp(
        uri: string,
        offset: number,
    ): Promise<HelpContent> {
        await this.initPromise.promise;
        if (!this.workerConn) {
            console.warn("Cannot request context help without workerConn");
            return HELP_NONE;
        }
        return await this.workerConn.sendRequest(
            DOENET_LSP_METHODS.contextHelp,
            {
                uri,
                offset,
            },
        );
    }

    /**
     * Ask the LSP server for the context-sensitive help payload for the
     * currently-highlighted autocomplete row.  Used while the popup is open:
     * the help panel mirrors the highlighted entry so arrow-key navigation
     * surfaces its docs immediately.
     */
    async requestContextHelpForCompletion(
        uri: string,
        offset: number,
        completion: ContextHelpCompletion,
    ): Promise<HelpContent> {
        await this.initPromise.promise;
        if (!this.workerConn) {
            console.warn(
                "Cannot request context help for completion without workerConn",
            );
            return HELP_NONE;
        }
        return await this.workerConn.sendRequest(
            DOENET_LSP_METHODS.contextHelpForCompletion,
            { uri, offset, completion },
        );
    }
}
