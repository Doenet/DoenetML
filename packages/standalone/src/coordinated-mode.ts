/**
 * Child-side support for the parent-page coordinator (`dist/coordinator.js`).
 *
 * The coordinator lives on a PARENT page that embeds DoenetML activities as
 * real same-origin iframes (the PreTeXt `…-if.html` model). It gates,
 * parks, and restores those iframes purely by controlling their `src` — and
 * marks each activity URL with a fragment token before (re)loading it.
 * Detecting that token here, inside the standalone bundle the child page
 * loads, lets otherwise-unmodified child pages participate fully: adding the
 * coordinator script to the parent page is the only host change.
 *
 * When the token is present the viewer entry:
 *  - defaults `flags.messageParent`/`allowSaveState`/`allowLoadState` to
 *    true, so state reports and the boot-time `SPLICE.getState` request
 *    reach the coordinator (which acts as the state warehouse across
 *    park/restore cycles);
 *  - posts `bootComplete` to the parent once the document initializes (the
 *    coordinator's boot-slot release signal);
 *  - with the `sc` variant, routes core creation to the coordinator's
 *    shared core-worker pool (#1466) instead of booting a dedicated ~100 MB
 *    worker per iframe.
 */

export type CoordinatedMode = {
    /** The coordinator owns a shared core-worker pool; route cores to it. */
    sharedCores: boolean;
};

// The fragment token the coordinator appends to activity URLs. `v1` is the
// protocol version; the `sc` suffix advertises the shared-core pool. The
// token is only ever written by a coordinator running on the parent page in
// this same page load, so a capability it advertises is guaranteed present.
const MARKER = /(?:^#|&)doenetCoordinated=v1(sc)?(?:&|$)/;

export function detectCoordinatedMode(): CoordinatedMode | null {
    // Guard against the marked URL being opened directly as a top-level
    // page (a shared link, say): without a coordinator on a parent page,
    // coordinated behavior must stay off. Detect "framed" via
    // `frameElement` rather than comparing `window.parent` to `window` —
    // test proxies that defeat frame-busting (e.g. Cypress's
    // modifyObstructiveCode) rewrite parent/top/self comparisons in served
    // JS, which would silently disable coordination in exactly the
    // environments that test it.
    let framed: boolean;
    try {
        framed = window.frameElement !== null;
    } catch {
        // A cross-origin parent throws — definitely framed (though such a
        // parent could not have run our coordinator; the token check below
        // still governs).
        framed = true;
    }
    if (!framed) {
        return null;
    }
    const match = MARKER.exec(window.location.hash);
    if (!match) {
        return null;
    }
    return { sharedCores: Boolean(match[1]) };
}

/**
 * Post a lifecycle message to the coordinator. Coordinated children are
 * same-origin with their parent (the coordinator only marks same-origin
 * activity iframes), so target the parent's origin explicitly.
 */
export function postToCoordinator(
    data: Record<string, unknown>,
    transfer?: Transferable[],
) {
    window.parent.postMessage(
        { origin: "doenetCoordinatedChild", data },
        window.location.origin,
        transfer ?? [],
    );
}

/**
 * Route this realm's core creation to the coordinator's shared core-worker
 * pool: install `doenetGlobalConfig.createExternalCoreWorkerPort` so the
 * viewer obtains each core over a locally-minted `MessageChannel` whose far
 * port the coordinator forwards to a shared host worker. Messages the
 * viewer sends on its port buffer until the core is exposed, so core
 * creation stays synchronous here. (Same design as the doenetml-iframe
 * wrapper's port provider — one protocol, two transports.)
 *
 * Must run after the standalone bundle's doenetml module has evaluated
 * (which creates `window.doenetGlobalConfig`) and before anything renders a
 * viewer; the entry module's top level satisfies both.
 */
export function installCoordinatorSharedCorePortProvider() {
    let coreCounter = 0;
    const childId = Math.random().toString(36).slice(2);
    (window as any).doenetGlobalConfig.createExternalCoreWorkerPort = () => {
        const coreId = `coordinated-${childId}-${++coreCounter}`;
        const channel = new MessageChannel();
        window.parent.postMessage(
            {
                origin: "doenetCoordinatedChild",
                data: {
                    type: "createSharedCore",
                    coreId,
                    // The coordinator resolves the (version-matched) worker
                    // co-served next to this bundle.
                    standaloneUrl: import.meta.url,
                },
            },
            window.location.origin,
            [channel.port2],
        );
        return {
            port: channel.port1,
            destroy: (suspectWedge?: boolean) => {
                postToCoordinator({
                    type: "destroySharedCore",
                    coreId,
                    suspectWedge: Boolean(suspectWedge),
                });
            },
        };
    };
}
