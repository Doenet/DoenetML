import { createLspConnection } from "@qualified/lsp-connection";
import { createMessageConnection } from "@qualified/vscode-jsonrpc-ww";

/**
 * Initialize a WebWorker that runs a language server. The worker is initialized with
 * `rootUri` set to `file:///` and `workspaceFolders` set to `null`.
 */
export async function initWorker(worker: Worker) {
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
        initializationOptions: null,
        processId: null,
        rootUri: "file:///",
        workspaceFolders: null,
    });

    await lspConn.initialized();
    return { lspConn, workerConn };
}
