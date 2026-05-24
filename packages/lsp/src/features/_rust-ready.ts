import type { CompletionContext } from "@doenet/lsp-tools";
import type { DocumentInfoEntry } from "../globals";

/**
 * Longest a feature handler will block on the rust-core boot.  A healthy
 * boot settles well under this; a genuinely broken worker only settles
 * `rustReady` after the spawn timeout, far past what an interactive
 * request (completion, help) should ever hang on.  Past the cap, callers
 * fall through and answer with whatever they can derive without the
 * resolver — typically an empty list or `{ kind: "none" }`.
 */
export const RUST_BOOT_WAIT_MS = 5_000;

/**
 * True when `ctx` describes a cursor position whose resolution depends
 * on the Rust resolver (a bare `$name` ref or a `$name.member` chain).
 * Pulled out so help and completions share a single definition — if a
 * new ref-shaped cursor position is added, both features pick it up
 * from one edit.
 */
export function isRefCompletionContext(ctx: CompletionContext): boolean {
    return ctx.cursorPos === "refName" || ctx.cursorPos === "refMember";
}

/**
 * If the rust-core sub-worker is still booting for this document, wait
 * up to {@link RUST_BOOT_WAIT_MS} for it to settle (via `rustReady`),
 * whichever comes first.  No-op when the boot has already settled or
 * was never started.
 *
 * Used by feature handlers (completions, context-help) that land at a
 * ref-resolution position during the cold-start window — waiting briefly
 * lets them answer with real resolver-backed results instead of an empty
 * fallback.  Callers should recompute any state derived from the
 * document after this resolves: the document may have changed while we
 * awaited.
 */
export async function awaitRustBootIfInitializing(
    info: DocumentInfoEntry,
): Promise<void> {
    if (info.rustState !== "initializing" || !info.rustReady) {
        return;
    }
    let waitTimer: ReturnType<typeof setTimeout> | undefined;
    await Promise.race([
        info.rustReady,
        new Promise<void>((resolve) => {
            waitTimer = setTimeout(resolve, RUST_BOOT_WAIT_MS);
        }),
    ]);
    clearTimeout(waitTimer);
}
