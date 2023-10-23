import { describe, expect, it } from "vitest";
// Required to use a worker inside a test
import "@vitest/web-worker";
import { createMessageConnection } from "@qualified/vscode-jsonrpc-ww";
import { createLspConnection } from "@qualified/lsp-connection";
// @ts-ignore
import LSPWorker from "../src/language-server?worker";
import util from "util";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("Doenet Language Server", async () => {
    it("can initialize language server as a webworker", async () => {
        const worker: Worker = new LSPWorker();
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
                            // activeParameterSupport: true,
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
        await lspConn.textDocumentOpened({
            textDocument: {
                uri: "file:///test.doenet",
                languageId: "doenet",
                version: 1,
                text: "<graph xxx />",
            },
        });
        const diags = await new Promise((resolve) => {
            lspConn.onDiagnostics((params) => {
                resolve(params);
            });
        });
        expect(diags).toMatchInlineSnapshot(`
          {
            "diagnostics": [
              {
                "message": "Element \`<graph>\` doesn't have an attribute called \`xxx\`.",
                "range": {
                  "end": {
                    "character": 10,
                    "line": 0,
                  },
                  "start": {
                    "character": 7,
                    "line": 0,
                  },
                },
                "severity": 2,
              },
            ],
            "uri": "file:///test.doenet",
          }
        `);
    });
});
