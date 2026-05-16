import { Connection, CompletionItem } from "vscode-languageserver/browser";
import { DocumentInfo } from "../globals";

export function addDocumentCompletionSupport(
    connection: Connection,
    documentInfo: DocumentInfo,
) {
    // This handler provides the initial list of the completion items.
    connection.onCompletion(async (params): Promise<CompletionItem[]> => {
        const info = documentInfo.get(params.textDocument.uri);
        if (!info) {
            return [];
        }

        let completionContext = info.autoCompleter.getCompletionContext(
            params.position,
        );
        let isRustDependentRefContext =
            completionContext.cursorPos === "refName" ||
            completionContext.cursorPos === "refMember";

        // A rust-dependent completion can land in the window between the
        // document opening and the rust-core sub-worker finishing its boot.
        // Returning `[]` then would close the editor's autocomplete session,
        // so wait for the boot to settle and answer with real results.
        if (
            isRustDependentRefContext &&
            info.rustState === "initializing" &&
            info.rustReady
        ) {
            await info.rustReady;
            // The document may have changed while waiting — recompute.
            completionContext = info.autoCompleter.getCompletionContext(
                params.position,
            );
            isRustDependentRefContext =
                completionContext.cursorPos === "refName" ||
                completionContext.cursorPos === "refMember";
        }

        if (
            isRustDependentRefContext &&
            (info.rustState !== "ready" || !info.rustAdapter)
        ) {
            return [];
        }

        const completions = await info.autoCompleter.getCompletionItems(
            params.position,
            completionContext,
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
