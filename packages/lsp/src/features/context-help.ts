import { Connection } from "vscode-languageserver/browser";
import {
    computeContextHelp,
    computeContextHelpForCompletion,
    type CompletionContext,
    type ContextHelpCompletion,
    type HelpContent,
} from "@doenet/lsp-tools";
import { DocumentInfo } from "../globals";

/**
 * Empty help payload — used for missing-document and error fallback paths
 * so the client always gets a well-formed response.
 */
const NONE: HelpContent = { kind: "none" };

/**
 * Cap on how long a context-help RPC will block waiting for the rust-core
 * boot.  Mirrors `RUST_BOOT_WAIT_MS` in `completions.ts`: under healthy
 * boot the wait settles in ~hundreds of ms; a broken worker only settles
 * `rustReady` after the spawn timeout, far past what a help request
 * should ever hang on.
 */
const RUST_BOOT_WAIT_MS = 5_000;

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
 *   `RUST_BOOT_WAIT_MS` for it to settle, then compute (the
 *   `computeContextHelp` function itself falls back to JS-only behaviour
 *   when no adapter is ready, so we still answer with something useful).
 * - any thrown error → log and return `{ kind: "none" }` so a buggy edge
 *   case can't surface as a scary JSON-RPC error on the client side.
 */
export function addContextHelpSupport(
    connection: Connection,
    documentInfo: DocumentInfo,
) {
    connection.onRequest(
        "doenet/contextHelp",
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
                    `doenet/contextHelp failed: ${String(err)}`,
                );
                return NONE;
            }
        },
    );

    connection.onRequest(
        "doenet/contextHelpForCompletion",
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
                    `doenet/contextHelpForCompletion failed: ${String(err)}`,
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
 * context against the post-wait document state.  Mirrors the dance in
 * `completions.ts` so help and completions agree on when resolver-backed
 * answers are available.  For non-ref positions and for already-ready /
 * unavailable cases this returns the initial context immediately.
 *
 * The returned context is then threaded into `computeContextHelp` /
 * `computeContextHelpForCompletion` so the help layer doesn't redo the
 * same schema walk.
 */
async function prepareForRefContext(
    info: NonNullable<ReturnType<DocumentInfo["get"]>>,
    offset: number,
): Promise<CompletionContext> {
    let ctx = info.autoCompleter.getCompletionContext(offset);
    const isRefContext =
        ctx.cursorPos === "refName" || ctx.cursorPos === "refMember";
    if (isRefContext && info.rustState === "initializing" && info.rustReady) {
        let waitTimer: ReturnType<typeof setTimeout> | undefined;
        await Promise.race([
            info.rustReady,
            new Promise<void>((resolve) => {
                waitTimer = setTimeout(resolve, RUST_BOOT_WAIT_MS);
            }),
        ]);
        clearTimeout(waitTimer);
        // Document may have changed while we awaited — recompute so the
        // help layer sees the same state the wait settled against.  Matches
        // `completions.ts`'s post-wait recompute.
        ctx = info.autoCompleter.getCompletionContext(offset);
    }
    return ctx;
}
