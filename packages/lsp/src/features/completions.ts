import {
    CompletionItem,
    CompletionItemKind,
    CompletionList,
    Connection,
} from "vscode-languageserver/browser";
import { DocumentInfo } from "../globals";
import {
    awaitRustBootIfInitializing,
    isRefCompletionContext,
} from "./_rust-ready";

/**
 * Identify completion items whose `textEdit` range must stay aligned with the
 * user's typed prefix across repeated completion requests.
 */
function completionItemNeedsRefresh(item: CompletionItem): boolean {
    if (
        typeof item.label === "string" &&
        item.label.startsWith("/") &&
        item.label.endsWith(">") &&
        typeof item.filterText === "string" &&
        item.filterText.startsWith("</") &&
        item.textEdit != null
    ) {
        return true;
    }

    return (
        item.kind === CompletionItemKind.Snippet &&
        typeof item.filterText === "string" &&
        item.filterText.startsWith("<") &&
        item.textEdit != null
    );
}

function shouldKeepCompletionListIncomplete(
    completions: CompletionItem[],
): boolean {
    return completions.some(completionItemNeedsRefresh);
}

export function addDocumentCompletionSupport(
    connection: Connection,
    documentInfo: DocumentInfo,
) {
    // This handler provides the initial list of the completion items.
    connection.onCompletion(
        async (params): Promise<CompletionItem[] | CompletionList> => {
            const info = documentInfo.get(params.textDocument.uri);
            if (!info) {
                return [];
            }

            let completionContext = info.autoCompleter.getCompletionContext(
                params.position,
            );

            // A rust-dependent completion can land in the window between the
            // document opening and the rust-core sub-worker finishing its boot.
            // Returning `[]` then would close the editor's autocomplete session,
            // so wait for the boot to settle (bounded by `RUST_BOOT_WAIT_MS`,
            // see `_rust-ready.ts`) and answer with real results.
            if (isRefCompletionContext(completionContext)) {
                await awaitRustBootIfInitializing(info);
                // The document may have changed while waiting — recompute.
                completionContext = info.autoCompleter.getCompletionContext(
                    params.position,
                );
            }

            if (
                isRefCompletionContext(completionContext) &&
                (info.rustState !== "ready" || !info.rustAdapter)
            ) {
                return [];
            }

            // The client (CodeMirror plugin) sets `explicit` when the user
            // invoked completion via Ctrl+Space, as opposed to the popup opening
            // from typing. It rides on the completion context as a non-standard
            // field; read it defensively. Explicit invocation opens the element
            // menu even with no preceding `<` (e.g. between tags) — see
            // `getCompletionItems`.
            const explicit =
                (params.context as { explicit?: boolean } | undefined)
                    ?.explicit ?? false;

            const completions = await info.autoCompleter.getCompletionItems(
                params.position,
                completionContext,
                explicit,
            );
            // VS Code only asks the server for refreshed completion items while a
            // completion session is active if the prior list was marked
            // `isIncomplete`. Close-tag and `<`-prefixed snippet completions need
            // that refresh because their replacement ranges must expand as the
            // user keeps typing; otherwise accepting a stale item can leave the
            // typed suffix behind.
            if (shouldKeepCompletionListIncomplete(completions)) {
                return {
                    isIncomplete: true,
                    items: completions,
                };
            }
            return completions;
        },
    );

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
