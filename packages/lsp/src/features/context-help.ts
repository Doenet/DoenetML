import { Connection } from "vscode-languageserver/browser";
import {
    computeContextHelp,
    computeContextHelpForCompletion,
    DOENET_LSP_METHODS,
    type CompletionContext,
    type ContextHelpCompletion,
    type HelpContent,
} from "@doenet/lsp-tools";
import type { DocumentInfo, DocumentInfoEntry } from "../globals";
import {
    awaitRustBootIfInitializing,
    isRefCompletionContext,
} from "./_rust-ready";

/**
 * Empty help payload — used for missing-document and error fallback paths
 * so the client always gets a well-formed response.
 */
const NONE: HelpContent = { kind: "none" };

/**
 * Register custom LSP requests that compute the editor's context-sensitive
 * help payload server-side (issue #1086 / Option 4).  The editor sends
 * `{ uri, offset }` (optionally with the currently-highlighted autocomplete
 * row) and the server returns a fully-rendered `HelpContent` payload.  All
 * the schema-walking + multi-part ref resolution runs through
 * `info.autoCompleter`, which already has the Rust resolver adapter
 * attached by `validate.ts`.
 *
 * Both handlers degrade gracefully:
 * - missing document → `{ kind: "none" }`
 * - rust boot in flight on a ref-resolution position → wait up to
 *   `RUST_BOOT_WAIT_MS` for it to settle, then compute (see
 *   `_rust-ready.ts` for the shared policy).  Element/attribute/snippet
 *   help still works without the resolver, but ref-resolution positions
 *   (`refName` / `refMember`) require it: the resolver is now the sole
 *   source of truth for member resolution, so when no adapter is
 *   attached `helpForRefMemberByName` returns `NONE` (path length ≤ 2)
 *   or `unsupportedRefChain` (path length > 2) — never a misleading
 *   JS-fallback answer.
 * - any thrown error → log and return `{ kind: "none" }` so a buggy edge
 *   case can't surface as a scary JSON-RPC error on the client side.
 */
export function addContextHelpSupport(
    connection: Connection,
    documentInfo: DocumentInfo,
) {
    connection.onRequest(
        DOENET_LSP_METHODS.contextHelp,
        async (params: {
            uri: string;
            offset: number;
        }): Promise<HelpContent> => {
            const info = documentInfo.get(params.uri);
            if (!info) return NONE;
            try {
                const ctx = await prepareForRefContext(info, params.offset);
                return await computeContextHelp(
                    info.autoCompleter,
                    params.offset,
                    ctx,
                );
            } catch (err) {
                connection.console.warn(
                    `${DOENET_LSP_METHODS.contextHelp} failed: ${String(err)}`,
                );
                return NONE;
            }
        },
    );

    connection.onRequest(
        DOENET_LSP_METHODS.contextHelpForCompletion,
        async (params: {
            uri: string;
            offset: number;
            completion: ContextHelpCompletion;
        }): Promise<HelpContent> => {
            const info = documentInfo.get(params.uri);
            if (!info) return NONE;
            try {
                const ctx = await prepareForRefContext(info, params.offset);
                return await computeContextHelpForCompletion(
                    info.autoCompleter,
                    params.offset,
                    params.completion,
                    ctx,
                );
            } catch (err) {
                connection.console.warn(
                    `${DOENET_LSP_METHODS.contextHelpForCompletion} failed: ${String(err)}`,
                );
                return NONE;
            }
        },
    );
}

/**
 * Compute the completion context at `offset` and, if the cursor is at a
 * ref-resolution position with the rust resolver mid-boot, await its
 * readiness (bounded by `RUST_BOOT_WAIT_MS`) before recomputing the
 * context against the post-wait document state.  Shares the wait policy
 * with `completions.ts` via `_rust-ready.ts` so help and completions
 * agree on when resolver-backed answers are available.  For non-ref
 * positions and for already-ready / unavailable cases this returns the
 * initial context immediately.
 *
 * The returned context is then threaded into `computeContextHelp` /
 * `computeContextHelpForCompletion` so the help layer doesn't redo the
 * same schema walk.
 */
async function prepareForRefContext(
    info: DocumentInfoEntry,
    offset: number,
): Promise<CompletionContext> {
    let ctx = info.autoCompleter.getCompletionContext(offset);
    if (isRefCompletionContext(ctx)) {
        await awaitRustBootIfInitializing(info);
        // Document may have changed while we awaited — recompute so the
        // help layer sees the same state the wait settled against.
        ctx = info.autoCompleter.getCompletionContext(offset);
    }
    return ctx;
}
