/**
 * First-copy-wins installer for the window globals this bundle's eager chunk
 * exposes: the render entry points (`renderDoenetViewerToContainer`,
 * `renderDoenetEditorToContainer`) and the palette-discovery functions
 * (`getDoenetStylePalettes`, `getDoenetStylePalette`).
 *
 * Two copies of this bundle can share one page — the script tag included
 * twice, possibly at different releases. The first copy to evaluate (with the
 * code-split bundle, the first whose eager chunk settles) wins the whole
 * surface: its `global-config.ts` (in `@doenet/doenetml`) writes the
 * shared `doenetGlobalConfig.doenetWorkerUrl`, and a later copy's worker
 * resolution defers to that value (`hostProvidedWorkerUrl`). The window
 * globals have to follow the same rule, because they and the worker URL must
 * come from the *same* copy: a document is rendered by whichever functions
 * the globals hold, against whichever worker the shared URL names, and the
 * message protocol between the two is only guaranteed within one release.
 *
 * So this installs `value` only when the global is empty (or holds something
 * that is not a function at all), or still holds the facade prologue's
 * queueing stub. Replacing a pending stub — marked
 * `__doenetPendingRenderStub: true`, part of the bundle's public surface (see
 * `facadeRenderQueue.ts`) — is required, not merely allowed: the stub must
 * yield to the real function, and replacing it also drains the calls it
 * queued (the stub's `__doenetDrainQueuedRenderCalls` hook, invoked below
 * with `value`). That drain is what makes the convention hold with two
 * *concurrent* code-split copies, where one copy's prologue installed the
 * stubs and either copy's eager chunk can settle first: queued calls run
 * through whichever release's chunk settles first — the same release whose
 * functions now own the globals and whose worker URL won the shared-config
 * write, keeping the outcome version-consistent — and they run even when the
 * stub-owning copy's own chunk never settles. The stub owner's later flush
 * finds the queues already empty and replays nothing.
 *
 * @returns whether `value` was installed.
 */
export function installFirstCopyGlobal(
    target: Record<string, unknown>,
    name: string,
    value: (...args: never[]) => unknown,
): boolean {
    const current = target[name];
    if (
        typeof current === "function" &&
        (current as { __doenetPendingRenderStub?: unknown })
            .__doenetPendingRenderStub !== true
    ) {
        return false;
    }
    target[name] = value;
    // A pending stub has been queueing the calls hosts made since the
    // facade's `load` event: drain them through the newly installed function.
    // This runs after the assignment above, so a queued call that re-reads
    // the global during its replay sees the real function. The hook is
    // guarded by `typeof`: a stub from a release that predates it is
    // replaced without a drain, and its own facade's flush delivers its
    // queue.
    if (typeof current === "function") {
        const drain = (current as { __doenetDrainQueuedRenderCalls?: unknown })
            .__doenetDrainQueuedRenderCalls;
        if (typeof drain === "function") {
            drain(value);
        }
    }
    return true;
}
