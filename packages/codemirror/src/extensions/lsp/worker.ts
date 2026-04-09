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
            const { lspConn, workerConn } = await initWorker(this.worker!);
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
        context: CompletionContext,
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
            console.warn("Cannot send additional diagnostics without lspConn");
            return;
        }
        await this.workerConn.sendRequest("doenet/setAdditionalDiagnostics", {
            uri,
            additionalDiagnostics,
        });
    }
}
