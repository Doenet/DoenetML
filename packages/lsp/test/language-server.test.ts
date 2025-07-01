import { describe, expect, it } from "vitest";
// Required to use a worker inside a test
import "@vitest/web-worker";
// @ts-ignore
import LSPWorker from "../src/index?worker";
import util from "util";
import { initWorker } from "./utils/init-message-connection";
import { Diagnostic } from "vscode-languageserver-protocol";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("Doenet Language Server", async () => {
    it("can initialize language server as a webworker", async () => {
        const worker: Worker = new LSPWorker();
        const lspConn = (await initWorker(worker)).lspConn;
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
    it("can get completions", async () => {
        const worker: Worker = new LSPWorker();
        const lspConn = (await initWorker(worker)).lspConn;
        await lspConn.textDocumentOpened({
            textDocument: {
                uri: "file:///test.doenet",
                languageId: "doenet",
                version: 1,
                text: "<gra  ",
            },
        });
        const diags = await lspConn.getCompletion({
            textDocument: {
                uri: "file:///test.doenet",
            },
            position: {
                line: 0,
                character: 3,
            },
        });
        expect(diags).toMatchInlineSnapshot(`
          [
            {
              "kind": 10,
              "label": "graph",
            },
          ]
        `);
    });
    it("can get completions after update", async () => {
        const worker: Worker = new LSPWorker();
        const lspConn = (await initWorker(worker)).lspConn;
        await lspConn.textDocumentOpened({
            textDocument: {
                uri: "file:///test.doenet",
                languageId: "doenet",
                version: 1,
                text: "",
            },
        });
        await lspConn.textDocumentChanged({
            textDocument: { uri: "file:///test.doenet", version: 2 },
            contentChanges: [
                {
                    text: "<gra  ",
                    range: {
                        start: { character: 0, line: 0 },
                        end: { line: Number.MAX_SAFE_INTEGER, character: 0 },
                    },
                },
            ],
        });
        const diags = await lspConn.getCompletion({
            textDocument: {
                uri: "file:///test.doenet",
            },
            position: {
                line: 0,
                character: 3,
            },
        });
        expect(diags).toMatchInlineSnapshot(`
          [
            {
              "kind": 10,
              "label": "graph",
            },
          ]
        `);
    });
    it("can supply external diagnostics", async () => {
        const worker: Worker = new LSPWorker();
        const { lspConn, workerConn } = await initWorker(worker);
        await lspConn.textDocumentOpened({
            textDocument: {
                uri: "file:///test2.doenet",
                languageId: "doenet",
                version: 1,
                text: "<document>\n\n</document>\n",
            },
        });

        let numLoops = 0;
        let diagsPromise = new Promise((resolve) => {
            lspConn.onDiagnostics((params) => {
                resolve(params);
            });
        });
        let diags: { uri: string; diagnostics: Diagnostic[] } | undefined =
            undefined;

        const diagnostic: Diagnostic = {
            message: "This is an external diagnostic",
            range: {
                start: { character: 1, line: 1 },
                end: { character: 2, line: 2 },
            },
            severity: 1,
        };
        workerConn.sendRequest("doenet/setAdditionalDiagnostics", {
            uri: "file:///test2.doenet",
            additionalDiagnostics: [diagnostic],
        });
        // Diagnostics may not be sent back immediately; we loop until we get them
        while (numLoops < 10 && (diags = (await diagsPromise) as any)) {
            numLoops++;
            if (diags.diagnostics.length > 0) {
                break;
            }
            diagsPromise = new Promise((resolve) => {
                lspConn.onDiagnostics((params) => {
                    resolve(params);
                });
            });
        }

        expect(diags).toMatchObject({
            diagnostics: [
                {
                    message: "This is an external diagnostic",
                    range: {
                        end: {
                            character: 2,
                            line: 2,
                        },
                        start: {
                            character: 1,
                            line: 1,
                        },
                    },
                    severity: 1,
                },
            ],
            uri: "file:///test2.doenet",
        });
    });
});
