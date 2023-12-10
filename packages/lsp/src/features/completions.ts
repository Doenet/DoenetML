import { Connection, CompletionItem } from "vscode-languageserver/browser";
import { DocumentInfo } from "../globals";

export function addDocumentCompletionSupport(
    connection: Connection,
    documentInfo: DocumentInfo,
) {
    // This handler provides the initial list of the completion items.
    connection.onCompletion((params): CompletionItem[] => {
        const info = documentInfo.get(params.textDocument.uri);
        if (!info) {
            return [];
        }
        const completions = info.autoCompleter.getCompletionItems(
            params.position,
        );
        return completions;
    });

    // XXX Give more meaningful information when we have more advanced documentation
    connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
        // This handler resolves additional information for the item selected in
        // the completion list.
        //        if (item.data === 1) {
        //            item.detail = "TypeScript details";
        //            item.documentation = "TypeScript documentation";
        //        } else if (item.data === 2) {
        //            item.detail = "JavaScript details";
        //            item.documentation = "JavaScript documentation";
        //        }
        return item;
    });
}
