import { createLspConnection } from "@qualified/lsp-connection";
import { createMessageConnection } from "@qualified/vscode-jsonrpc-ww";

/**
 * Perform the LSP `initialize` handshake with a language server already
 * running inside `worker`, and return the connected client.  The server is
 * initialized with `rootUri` set to `file:///` and `workspaceFolders` `null`.
 *
 * `worker` is the *language-server* worker; the caller constructs it.
 *
 * `doenetWorkerUrl` is unrelated to that worker — it is the URL of the
 * separate *DoenetML core* worker bundle.  The language server cannot
 * discover that URL on its own, so it is handed over here inside the
 * `initialize` request's `initializationOptions` (the LSP-standard channel
 * for host-to-server configuration).  With it the server can spawn its own
 * core sub-worker for rust-backed path resolution; without it, rust-backed
 * completions are disabled.
 */
export async function initWorker(worker: Worker, doenetWorkerUrl?: string) {
    const workerConn = await createMessageConnection(worker);
    const lspConn = createLspConnection(workerConn);
    lspConn.listen();
    await lspConn.initialize({
        capabilities: {
            textDocument: {
                synchronization: {
                    dynamicRegistration: true,
                    willSave: true,
                    willSaveWaitUntil: true,
                    didSave: true,
                },
                completion: {
                    dynamicRegistration: true,
                    completionItem: {
                        snippetSupport: true,
                        insertReplaceSupport: true,
                        commitCharactersSupport: false,
                        documentationFormat: ["markdown", "plaintext"],
                        deprecatedSupport: true,
                        preselectSupport: true,
                        resolveSupport: {
                            properties: ["documentation", "detail"],
                        },
                    },
                    contextSupport: true,
                },
                hover: {
                    dynamicRegistration: true,
                    contentFormat: ["markdown", "plaintext"],
                },
                signatureHelp: {
                    dynamicRegistration: true,
                    signatureInformation: {
                        documentationFormat: ["markdown", "plaintext"],
                        parameterInformation: {
                            labelOffsetSupport: true,
                        },
                    },
                    contextSupport: true,
                },
                declaration: {
                    dynamicRegistration: true,
                    linkSupport: false,
                },
                definition: {
                    dynamicRegistration: true,
                    linkSupport: true,
                },
                typeDefinition: {
                    dynamicRegistration: true,
                    linkSupport: true,
                },
                implementation: {
                    dynamicRegistration: true,
                    linkSupport: true,
                },
                references: {
                    dynamicRegistration: true,
                },
                documentHighlight: {
                    dynamicRegistration: true,
                },
                documentSymbol: {
                    dynamicRegistration: true,
                    hierarchicalDocumentSymbolSupport: true,
                },
                publishDiagnostics: {
                    relatedInformation: true,
                    tagSupport: {
                        valueSet: [1, 2],
                    },
                },
                moniker: {},
            },
            workspace: {
                didChangeConfiguration: {
                    dynamicRegistration: true,
                },
                didChangeWatchedFiles: {
                    dynamicRegistration: false,
                },
            },
        },
        initializationOptions: doenetWorkerUrl ? { doenetWorkerUrl } : null,
        processId: null,
        rootUri: "file:///",
        workspaceFolders: null,
    });

    await lspConn.initialized();
    return { lspConn, workerConn };
}
