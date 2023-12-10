// @ts-ignore
import LSPWorker from "@doenet/vscode-extension/language-server?worker";
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
    worker?: Worker;
    lspConn?: Awaited<ReturnType<typeof initWorker>>;
    versionCounter: Record<string, number> = {};
    initPromise = withResolver<void>();
    initStatus: "uninitialized" | "initializing" | "initialized" =
        "uninitialized";
    completionTriggers: string[] = [];

    async init() {
        if (this.lspConn) {
            return;
        }
        if (this.initStatus === "uninitialized") {
            this.initStatus = "initializing";
            this.worker = new LSPWorker();
            this.lspConn = await initWorker(this.worker!);
            this.completionTriggers = this.lspConn.completionTriggers;
            this.initPromise.resolve();
            this.initStatus = "initialized";
        }
        if (this.initStatus === "initializing") {
            await this.initPromise.promise;
        }
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

    async getDiagnostics(uri: string): Promise<Diagnostic[]> {
        await this.initPromise.promise;
        return new Promise((resolve) => {
            if (!this.lspConn) {
                console.warn("Cannot get diagnostics without lspConn");
                return [];
            }
            this.lspConn.onDiagnostics((params) => {
                if (params.uri === uri) {
                    resolve(params.diagnostics);
                }
            });
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
}
