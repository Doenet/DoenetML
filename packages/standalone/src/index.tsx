/*
 * This file is for running a dev test of the codemirror component.
 * It does not show up in the bundled package.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import {
    DoenetViewer,
    DoenetEditor,
} from "@doenet/doenetml/doenetml-external-worker.js";
import type {
    DiagnosticsTabId,
    DoenetEditorHandle,
} from "@doenet/doenetml/doenetml-external-worker.js";
import { getStylePalettes, getStylePalette } from "@doenet/utils";
import type { StylePaletteInfo } from "@doenet/utils";
// From the same entry point the viewer above comes from, not from
// `@doenet/i18n` directly: this bundle would otherwise hold two instances of
// that module — one built here from source, one compiled into
// `@doenet/doenetml` — and the loaders installed on the first are not the ones
// the second reads. See the re-export in `@doenet/doenetml`'s `index.ts`.
import {
    fetchLocaleLoaders,
    setLocaleLoaders,
    pinPackageVersion,
    setExternalCoreWorkerUrl,
} from "@doenet/doenetml/doenetml-external-worker.js";
import "@doenet/doenetml/style.css";
import "./pretext-compat.css";
import { ResizeWatcher } from "./resize-watcher";
import {
    detectCoordinatedMode,
    installCoordinatorSharedCorePortProvider,
    postToCoordinator,
} from "./coordinated-mode";

// Re-export React and friends in case a user really wants to use them
export { React, ReactDOM, DoenetViewer, DoenetEditor };

// Style-palette discovery, so a host can render a palette picker (with
// swatches) whose choices match the palettes THIS bundle supports.
export { getStylePalettes, getStylePalette };
export type { StylePaletteInfo };

export const version: string = STANDALONE_VERSION;

// Message catalogs beyond the bundled ones are served next to this file, not
// inside it: a single-file bundle inlines every dynamic import, so the
// code-splitting the library build relies on would put all of `locales/` in
// here. The build copies `locales/` into `dist/` and switches the code-split
// path off (`__DOENET_CODE_SPLIT_CATALOGS__`); this points the viewer at that
// copy, resolved against the bundle's own URL the same way the core worker is.
//
// A host that serves this bundle without `locales/` beside it loses nothing it
// has today: those fetches fail quietly and every locale falls back to English.
//
// The paths are held in constants rather than written inline because Vite reads
// a literal `new URL(..., import.meta.url)` as an asset reference and warns that
// the target does not exist at build time. It does not — the build copies it in
// afterwards — so the reference has to stay unanalyzed.
const CATALOGS_BESIDE_BUNDLE = "./locales/";
const CATALOGS_AT_ORIGIN = "/locales/";
const WORKER_BESIDE_BUNDLE = "./doenetml-worker/index.js";

/**
 * This file's own URL, with any floating CDN tag replaced by the exact version
 * it was built as.
 *
 * Everything served *beside* this bundle — the core worker, the catalogs below
 * — is fetched as its own URL at run time, so under `@doenet/standalone@latest`
 * each is independently cached (jsDelivr: seven days in the browser, twelve
 * hours at the edge) and can be left over from a different release than the
 * bundle asking for it. A bundle paired with the previous release's core worker
 * never finishes the handshake, and the viewer reports that it could not be
 * started; a purge cannot reach the browser copy, so it persists for days. See
 * `pinPackageVersion` for the whole story.
 *
 * Resolving siblings against the pinned URL instead removes the possibility:
 * an exact version is immutable on the CDN, so the worker and catalogs beside
 * it are necessarily this release's. A bundle that is not served from a CDN
 * path naming the package — self-hosted, or booted from a Blob URL as the
 * component tests do — is returned unchanged and behaves exactly as before.
 */
const pinnedBundleUrl = pinPackageVersion(
    import.meta.url,
    "@doenet/standalone",
    version,
);

/**
 * Where to fetch the message catalogs from, or `null` if nowhere can be worked
 * out.
 *
 * Beside the bundle is the right answer and the one the build arranges — an
 * embed loading this file from the CDN gets the `locales/` published beside it.
 * But `import.meta.url` is not always a base a URL can be resolved against:
 * `@doenet/doenetml-iframe`'s dev harness and Cypress component tests boot a
 * locally built copy of this bundle from a Blob URL, and `blob:` is opaque, so
 * `new URL` throws on it. Nothing is "beside" a blob, so that case tries the
 * page's own origin instead — where `getWorkerUrl` in `@doenet/doenetml` looks
 * for the core worker.
 *
 * Returning `null` is a normal outcome, not an error: every locale then falls
 * back to English, exactly as it does when the catalogs are simply not served.
 * What must not happen is a throw, which at module scope would leave the bundle
 * unevaluated and every viewer on the page blank.
 */
function localeCatalogsUrl(): string | null {
    for (const [path, base] of [
        [CATALOGS_BESIDE_BUNDLE, pinnedBundleUrl],
        [CATALOGS_AT_ORIGIN, globalThis.window?.location?.href],
    ] as const) {
        try {
            return new URL(path, base).href;
        } catch {
            // Opaque or absent base — try the next candidate.
        }
    }
    return null;
}

const localeCatalogsBase = localeCatalogsUrl();
if (localeCatalogsBase) {
    setLocaleLoaders(fetchLocaleLoaders(localeCatalogsBase));
}

// Re-point the core worker at the pinned copy, for the reason above. The
// externalized-worker entry has already resolved it against this file's *own*
// URL — its module body runs at import time, before anything here — so this
// runs after and replaces the tag-relative answer with the pinned one.
//
// Only when pinning actually changed the URL: where it did not (a self-hosted
// bundle, a Blob URL) the entry's own resolution, including its fallbacks for
// bases nothing can be resolved against, is already the right answer and this
// has nothing to add.
if (pinnedBundleUrl !== import.meta.url) {
    try {
        setExternalCoreWorkerUrl(
            new URL(WORKER_BESIDE_BUNDLE, pinnedBundleUrl).href,
        );
    } catch (e) {
        // Leave whatever the entry resolved in place: a worker under a floating
        // tag still works whenever the caches happen to agree, which is the
        // behavior every release before this one had.
        console.warn("Unable to pin the DoenetML core worker URL:", e);
    }
}

// Parent-page coordinator support (see coordinated-mode.ts): when this
// page's URL carries the coordinator's fragment token, viewers rendered
// here report their lifecycle to the parent and (with the `sc` variant)
// obtain their cores from the coordinator's shared worker pool.
const coordinatedMode = detectCoordinatedMode();
if (coordinatedMode?.sharedCores) {
    installCoordinatorSharedCorePortProvider();
}

// Cache React roots per container so repeat calls to
// renderDoenet{Viewer,Editor}ToContainer re-render in place instead of
// creating a fresh root each time (which would mount competing trees on the
// same DOM node and destroy editor/viewer state).
const viewerRootsByContainer = new WeakMap<Element, ReactDOM.Root>();
const editorRootsByContainer = new WeakMap<Element, ReactDOM.Root>();

// Cache the ResizeWatcher per container alongside its React root. Repeat renders
// reuse the same watcher so we don't leak a still-observing ResizeObserver from
// a prior render (each would keep posting heights). `watch()` re-points the
// observer at the current element, and `markReady()` is idempotent.
const viewerResizeWatchersByContainer = new WeakMap<Element, ResizeWatcher>();

type EditorHandleEntry = {
    mountedHandle: DoenetEditorHandle | null;
    pendingHandleActions: ((h: DoenetEditorHandle) => void)[];
    handle: {
        openDiagnosticsTab: (tabId: DiagnosticsTabId) => void;
        closeDiagnosticsPanel: () => void;
        updateRenderedView: () => void;
    };
};
const editorHandlesByContainer = new WeakMap<Element, EditorHandleEntry>();

/**
 * Render DoenetViewer to a container element. If `doenetMLSource` is not provided,
 * it is assumed that `container` has a `<script type="text/doenetml">` child which
 * stores the source.
 *
 * Repeat calls with the same `container` element re-render in place against a
 * cached React root rather than mounting a competing root. The cache lives in
 * a `WeakMap`, so it releases automatically once the container is GC'd, but it
 * is *not* keyed on `doenetMLSource` or `config` — passing different values
 * across calls is treated as an update of the same logical instance, not as a
 * remount. Callers that need a fresh root should detach and re-create the
 * container element.
 */
export function renderDoenetViewerToContainer(
    container: Element,
    doenetMLSource?: string,
    config?: object,
) {
    if (!(container instanceof Element)) {
        throw new Error("Container must be an DOM element");
    }
    if (!doenetMLSource) {
        const doenetMLScript = container.querySelector(
            'script[type="text/doenetml"]',
        );
        if (!doenetMLScript) {
            throw new Error(
                'If doenetMlSource is not provided, a <script type="text/doenetml"> child containing the DoenetML source code must be present',
            );
        }
        doenetMLSource = doenetMLScript.innerHTML;
    }
    // We read off all the flags from data attributes on the container element
    const attrs: Record<string, any> = {};
    for (const attr of container.attributes) {
        if (!attr.name.startsWith("data-doenet")) {
            continue;
        }
        const name = kebobCaseToCamelCase(
            attr.name.replace(/^data-doenet-/, ""),
        );
        const value = normalizeBooleanAttr(attr.value);
        attrs[name] = value;
    }
    // `mathjaxUrl` / `useExistingMathjax` / the locale settings are viewer
    // props, not flags — pull them out so they reach `DoenetViewer` directly
    // instead of `flags`.
    const {
        addVirtualKeyboard,
        sendResizeEvents,
        mathjaxUrl,
        useExistingMathjax,
        documentLocale,
        uiLocale,
        ...flags
    } = attrs;

    let resizeWatcher = viewerResizeWatchersByContainer.get(container);
    if (!resizeWatcher) {
        resizeWatcher = new ResizeWatcher();
        viewerResizeWatchersByContainer.set(container, resizeWatcher);
    }

    if (config && "flags" in config) {
        Object.assign(flags, config.flags);
        delete config.flags;
    }

    // Under a parent-page coordinator, default the flags its park/restore
    // machinery depends on: `messageParent` routes SPLICE messages to the
    // coordinator's window, `allowSaveState` emits the state reports it
    // warehouses, and `allowLoadState` makes a restored viewer request that
    // state back at boot. Explicit attributes/config still win.
    if (coordinatedMode) {
        const coordinatedFlagDefaults: Record<string, boolean> = {
            messageParent: true,
            allowSaveState: true,
            allowLoadState: true,
        };
        for (const [key, value] of Object.entries(coordinatedFlagDefaults)) {
            if (!(key in flags)) {
                flags[key] = value;
            }
        }
    }

    // Compose the resize-readiness signal with any caller-supplied
    // `initializedCallback` so we don't clobber it via the `{...config}` spread.
    const {
        initializedCallback: configInitializedCallback,
        ...restConfig
    }: { initializedCallback?: (arg: unknown) => void } = config ?? {};

    let root = viewerRootsByContainer.get(container);
    if (!root) {
        root = ReactDOM.createRoot(container);
        viewerRootsByContainer.set(container, root);
    }
    root.render(
        <DoenetViewer
            doenetML={doenetMLSource}
            addVirtualKeyboard={addVirtualKeyboard}
            flags={flags}
            mathjaxUrl={mathjaxUrl}
            useExistingMathjax={useExistingMathjax}
            documentLocale={documentLocale}
            uiLocale={uiLocale}
            onInit={(r) => {
                if (sendResizeEvents) {
                    resizeWatcher.watch(r);
                }
            }}
            initializedCallback={(arg: unknown) => {
                // Only start reporting heights to the host once the document has
                // actually rendered — otherwise a not-yet-booted (or failed)
                // container reports a near-zero height and collapses the host
                // iframe. See issue #1434.
                if (sendResizeEvents) {
                    resizeWatcher.markReady();
                }
                // The coordinator's boot-slot release signal.
                if (coordinatedMode) {
                    postToCoordinator({ type: "bootComplete" });
                }
                configInitializedCallback?.(arg);
            }}
            {...restConfig}
        />,
    );
}

/**
 * Render DoenetEditor to a container element. If `doenetMLSource` is not provided,
 * it is assumed that `container` has a `<script type="text/doenetml">` child which
 * stores the source.
 *
 * Repeat calls with the same `container` element re-render in place against a
 * cached React root, and return the *same* handle object across calls — the
 * handle's methods are stable for the lifetime of the container so callers can
 * cache it. The cache lives in a `WeakMap` keyed by container, so it releases
 * automatically once the container is GC'd. Two consumers rendering different
 * logical editor instances into the same container will therefore share state;
 * detach and re-create the container element if a fresh instance is needed.
 */
export function renderDoenetEditorToContainer(
    container: Element,
    doenetMLSource?: string,
    config?: object,
) {
    if (!(container instanceof Element)) {
        throw new Error("Container must be an DOM element");
    }
    if (!doenetMLSource) {
        const doenetMLScript = container.querySelector(
            'script[type="text/doenetml"]',
        );
        if (!doenetMLScript) {
            throw new Error(
                'If doenetMlSource is not provided, a <script type="text/doenetml"> child containing the DoenetML source code must be present',
            );
        }
        doenetMLSource = doenetMLScript.innerHTML;
    }

    // We read off data attributes on the container element
    const attrs: Record<string, any> = {};
    for (const attr of container.attributes) {
        if (!attr.name.startsWith("data-doenet")) {
            continue;
        }
        const name = kebobCaseToCamelCase(
            attr.name.replace(/^data-doenet-/, ""),
        );

        const value = normalizeBooleanAttr(attr.value);
        attrs[name] = value;
    }

    // DoenetEditor doesn't accept flags, so the only attributes used are
    // addVirtualKeyboard, the MathJax loading controls, and the locales.
    const {
        addVirtualKeyboard,
        mathjaxUrl,
        useExistingMathjax,
        documentLocale,
        uiLocale,
    } = attrs;

    // Hold pending control actions until the inner DoenetEditor commits
    // (callback ref fires). React commits asynchronously after `createRoot.render`,
    // so a synchronous caller cannot rely on the ref being populated immediately
    // — queue and replay on mount.
    let entry = editorHandlesByContainer.get(container);
    if (!entry) {
        const newEntry: EditorHandleEntry = {
            mountedHandle: null,
            pendingHandleActions: [],
            // Filled in below — the handle methods need to close over `newEntry`.
            handle: null as unknown as EditorHandleEntry["handle"],
        };
        newEntry.handle = {
            openDiagnosticsTab(tabId: DiagnosticsTabId) {
                if (newEntry.mountedHandle) {
                    newEntry.mountedHandle.openDiagnosticsTab(tabId);
                } else {
                    newEntry.pendingHandleActions.push((h) =>
                        h.openDiagnosticsTab(tabId),
                    );
                }
            },
            closeDiagnosticsPanel() {
                if (newEntry.mountedHandle) {
                    newEntry.mountedHandle.closeDiagnosticsPanel();
                } else {
                    newEntry.pendingHandleActions.push((h) =>
                        h.closeDiagnosticsPanel(),
                    );
                }
            },
            updateRenderedView() {
                if (newEntry.mountedHandle) {
                    newEntry.mountedHandle.updateRenderedView();
                } else {
                    newEntry.pendingHandleActions.push((h) =>
                        h.updateRenderedView(),
                    );
                }
            },
        };
        editorHandlesByContainer.set(container, newEntry);
        entry = newEntry;
    }
    const handleEntry = entry;
    function refCallback(h: DoenetEditorHandle | null) {
        handleEntry.mountedHandle = h;
        if (h) {
            const queued = handleEntry.pendingHandleActions.splice(0);
            for (const action of queued) {
                action(h);
            }
        } else {
            handleEntry.pendingHandleActions.length = 0;
        }
    }

    let root = editorRootsByContainer.get(container);
    if (!root) {
        root = ReactDOM.createRoot(container);
        editorRootsByContainer.set(container, root);
    }
    root.render(
        <DoenetEditor
            ref={refCallback}
            doenetML={doenetMLSource}
            addVirtualKeyboard={addVirtualKeyboard}
            mathjaxUrl={mathjaxUrl}
            useExistingMathjax={useExistingMathjax}
            documentLocale={documentLocale}
            uiLocale={uiLocale}
            {...config}
        />,
    );

    return handleEntry.handle;
}

function normalizeBooleanAttr(attr: string | undefined | null) {
    if (attr === "true") {
        return true;
    }
    if (attr === "false") {
        return false;
    }
    return attr;
}

function kebobCaseToCamelCase(str: string) {
    return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

// Expose renderDoenetViewerToContainer and renderDoenetEditorToContainer on the global object
// @ts-ignore
window.renderDoenetViewerToContainer = renderDoenetViewerToContainer;
// @ts-ignore
window.renderDoenetEditorToContainer = renderDoenetEditorToContainer;

// Expose style-palette discovery on the global object as well, so a page
// that loads this bundle from the CDN (rather than importing it) can list
// the palettes this DoenetML version ships and render swatches for them.
// The iframe wrapper feature-detects these globals to report the palettes
// of whichever bundle version it booted.
// @ts-ignore
window.getDoenetStylePalettes = getStylePalettes;
// @ts-ignore
window.getDoenetStylePalette = getStylePalette;
