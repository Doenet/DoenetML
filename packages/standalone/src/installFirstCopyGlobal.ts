/**
 * First-copy-wins installer for the window globals this bundle's eager chunk
 * exposes: the render entry points (`renderDoenetViewerToContainer`,
 * `renderDoenetEditorToContainer`) and the palette-discovery functions
 * (`getDoenetStylePalettes`, `getDoenetStylePalette`).
 *
 * Two copies of this bundle can share one page — the script tag included
 * twice, possibly at different releases. The first copy to evaluate wins the
 * whole surface: its `global-config.ts` (in `@doenet/doenetml`) writes the
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
 * `facadeRenderQueue.ts`) — is required, not merely allowed: the facade's
 * flush hands the stub's queued calls to whatever the global holds once the
 * eager chunk evaluates, so the stub must yield to the real function.
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
    return true;
}
