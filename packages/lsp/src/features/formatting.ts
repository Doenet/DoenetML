import { Connection } from "vscode-languageserver/browser";
import { prettyPrint } from "@doenet/parser";
import { DocumentInfo, getDocumentSettings } from "../globals";
import { doenetToMarkdown } from "@doenet/lsp-tools";

export function addDocumentFormattingSupport(
    connection: Connection,
    documentInfo: DocumentInfo,
) {
    // LSP Formatting call
    connection.onDocumentFormatting(async (params) => {
        const settings = await getDocumentSettings(
            connection,
            params.textDocument.uri,
        );
        const info = documentInfo.get(params.textDocument.uri);
        if (!info) {
            return [];
        }
        const sourceObj = info.autoCompleter.sourceObj;
        const rootPos = sourceObj.dast.position!;
        const printed = await prettyPrint(sourceObj.source, {
            tabWidth: params.options.tabSize,
            useTabs: !params.options.insertSpaces,
            doenetSyntax: settings.formatMode === "xml" ? false : true,
        });
        return [
            {
                newText: printed,
                range: {
                    start: sourceObj.offsetToLSPPosition(0),
                    end: sourceObj.offsetToLSPPosition(rootPos.end.offset!),
                },
            },
        ];
    });

    // Special formatting requests
    connection.onRequest("doenet.formatAsXML", async (docUri: string) => {
        const info = documentInfo.get(docUri);
        if (!info) {
            connection.console.log(`Could not find document ${docUri}`);
            return [];
        }
        const sourceObj = info.autoCompleter.sourceObj;
        const rootPos = sourceObj.dast.position!;
        const printed = await prettyPrint(sourceObj.source, {
            doenetSyntax: false,
        });
        return [
            {
                newText: printed,
                range: {
                    start: sourceObj.offsetToLSPPosition(0),
                    end: sourceObj.offsetToLSPPosition(rootPos.end.offset!),
                },
            },
        ];
    });
    connection.onRequest("doenet.formatAsDoenetML", async (docUri: string) => {
        const info = documentInfo.get(docUri);
        if (!info) {
            connection.console.log(`Could not find document ${docUri}`);
            return [];
        }
        const sourceObj = info.autoCompleter.sourceObj;
        const rootPos = sourceObj.dast.position!;
        const printed = await prettyPrint(sourceObj.source, {
            doenetSyntax: true,
        });
        return [
            {
                newText: printed,
                range: {
                    start: sourceObj.offsetToLSPPosition(0),
                    end: sourceObj.offsetToLSPPosition(rootPos.end.offset!),
                },
            },
        ];
    });
    connection.onRequest("doenet.formatAsMarkdown", async (docUri: string) => {
        const info = documentInfo.get(docUri);
        if (!info) {
            connection.console.log(`Could not find document ${docUri}`);
            return [];
        }
        const sourceObj = info.autoCompleter.sourceObj;
        const rootPos = sourceObj.dast.position!;
        const printed = doenetToMarkdown(sourceObj);
        return [
            {
                newText: printed,
                range: {
                    start: sourceObj.offsetToLSPPosition(0),
                    end: sourceObj.offsetToLSPPosition(rootPos.end.offset!),
                },
            },
        ];
    });
}
