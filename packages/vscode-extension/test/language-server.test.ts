import { describe, expect, it } from "vitest";
// Required to use a worker inside a test
import "@vitest/web-worker";
// @ts-ignore
import LSPWorker from "../src/language-server?worker";
import util from "util";
import { initWorker } from "./utils/init-message-connection";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("Doenet Language Server", async () => {
    it("can initialize language server as a webworker", async () => {
        const worker: Worker = new LSPWorker();
        const lspConn = await initWorker(worker);
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
