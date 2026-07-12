import React from "react";

import * as Comlink from "comlink";

import { MdError } from "react-icons/md";
import {
    findAllNewlines,
    getLineCharRange,
    getSystemTheme,
    subscribeToSystemTheme,
} from "@doenet/utils";
import type {
    DiagnosticRecord,
    ErrorRecord,
    WarningRecord,
    ThemeSetting,
    ResolvedTheme,
} from "@doenet/utils";
import {
    DoenetViewerProps,
    DoenetEditorProps,
    createHtmlForDoenetViewer,
    createHtmlForDoenetEditor,
    setIframeBodyBackground,
} from "./utils";
import {
    handleCreateSharedCore,
    handleDestroySharedCore,
    destroySharedCoresForViewer,
} from "./shared-core-pool";
import {
    registerWindowedViewer,
    setViewerVisibility,
    notifyViewerState,
    requestBootSlot,
    cancelBootRequest,
    releaseBootSlot,
    DEFAULT_MAX_LIVE_VIEWERS,
    DEFAULT_VISIBLE_MARGIN,
    DEFAULT_FLUSH_TIMEOUT_MS,
    DEFAULT_PARK_DELAY_MS,
    DEFAULT_MAX_CONCURRENT_BOOTS,
    BOOT_SLOT_WATCHDOG_MS,
    type MountPolicy,
} from "./viewer-lifecycle-manager";

export type { MountPolicy };
// Page-wide windowed-mounting diagnostics (how many viewers are live vs
// parked) — useful for host dashboards, tests, and benchmarks.
export { getViewerLifecycleStats } from "./viewer-lifecycle-manager";

export const version: string = IFRAME_VERSION;
const latestDoenetmlVersion: string = version;

export { mathjaxConfig } from "@doenet/utils";
export {
    mediaLicenses,
    getMediaLicenseInfo,
    getMediaLicenseDisplay,
    creativeCommonsVersions,
    defaultCreativeCommonsVersion,
} from "@doenet/utils";
export type { DiagnosticRecord, ErrorRecord, WarningRecord };
export type {
    MediaLicenseInfo,
    MediaLicenseKind,
    MediaLicenseDisplay,
    CreativeCommonsVersion,
} from "@doenet/utils";
import type { DiagnosticsTabId, DoenetEditorHandle } from "@doenet/doenetml";
export type { DiagnosticsTabId, DoenetEditorHandle };
import { detectVersionFromDoenetML } from "@doenet/parser";

import { ExternalVirtualKeyboard } from "@doenet/virtual-keyboard";
import "@doenet/virtual-keyboard/style.css";

function subscribeToPinnedTheme() {
    return () => {};
}

function useResolvedTheme(setting: ThemeSetting): ResolvedTheme {
    const subscribe =
        setting === "system" ? subscribeToSystemTheme : subscribeToPinnedTheme;
    const systemTheme = React.useSyncExternalStore(
        subscribe,
        getSystemTheme,
        () => "light" as ResolvedTheme,
    );

    return setting === "system" ? systemTheme : setting;
}

/**
 * A message that is sent from an iframe to the parent window.
 */
type IframeMessage = {
    origin: string;
    data: Record<string, unknown>;
    subject?: string;
    height?: number;
    /** Correlation id on SPLICE requests/responses. */
    message_id?: string;
};

export type DoenetViewerIframeProps = DoenetViewerProps & {
    doenetML: string;
    /**
     * The URL of a standalone DoenetML bundle. This may be from the CDN.
     * If autodetectVersion is `true` and a version is detected, this URL is ignored.
     */
    standaloneUrl?: string;
    /**
     * The URL of a CSS file that styles the standalone DoenetML bundle.
     * If autodetectVersion is `true` and a version is detected, this URL is ignored.
     */
    cssUrl?: string;
    /**
     * The version of standalone DoenetML bundle if urls are not provided.
     * If autodetectVersion is `true` and a version is detected, this setting is ignored.
     */
    doenetmlVersion?: string;
    /**
     * If `true`, look for a xmlns attribute in an outer `<document>` tag
     * and use that for the doenetmlVersion,
     * overwriting any doenetmlVersion or urls provided
     */
    autodetectVersion?: boolean;
    /**
     * Opt-in (#1466): multiplex this viewer's core onto a shared core worker
     * owned by this (parent) page, instead of the iframe booting its own
     * ~100 MB dedicated worker. Viewers on the same page with the same
     * standalone version share workers (up to a pool cap per worker), which
     * is the dominant memory saving on pages embedding many documents.
     * Trade-off: a worker-level hang or crash affects every document on that
     * worker (per-core teardown stays individual; suspect workers are
     * quarantined so retries boot fresh ones). Default off.
     */
    useSharedCoreWorker?: boolean;
    /**
     * Opt-in windowed mounting (#1441, stream B): keep at most
     * `maxLiveViewers` viewers live on the page. Windowed viewers start as
     * fixed-height placeholders and only create their iframe when they come
     * near the viewport AND a boot slot is free (`maxConcurrentBoots` caps
     * simultaneous realm boots page-wide — an off-screen viewer never boots
     * at all). Off-screen viewers beyond the budget are *parked* — their
     * state is flushed (`SPLICE.flushState`) and their iframe is replaced
     * by the placeholder again — and restored when scrolled back near the
     * viewport. Parking requires a persistence path: it only activates for
     * viewers with `flags.allowSaveState` (the wrapper snapshots the
     * flushed `reportScoreAndState` and seeds `initialState` on restore) or
     * `flags.allowLocalState` (IndexedDB restores on reboot); otherwise the
     * viewer boots on visibility but then always stays live. The policy is
     * read at mount; changing it afterwards is not supported. Default off
     * (no prop = today's behavior).
     */
    mountPolicy?: MountPolicy;
};

export type DoenetEditorIframeProps = DoenetEditorProps & {
    doenetML: string;
    /**
     * The URL of a standalone DoenetML bundle. This may be from the CDN.
     * If autodetectVersion is `true` and a version is detected, this URL is ignored.
     */
    standaloneUrl?: string;
    /**
     * The URL of a CSS file that styles the standalone DoenetML bundle.
     * If autodetectVersion is `true` and a version is detected, this URL is ignored.
     */
    cssUrl?: string;
    /**
     * The version of standalone DoenetML bundle if urls are not provided.
     * If autodetectVersion is `true` and a version is detected, this setting is ignored.
     */
    doenetmlVersion?: string;
    /**
     * If `true`, look for a xmlns attribute in an outer `<document>` tag
     * and use that for the doenetmlVersion,
     * overwriting any doenetmlVersion or urls provided
     */
    autodetectVersion?: boolean;
    /**
     * The width of the iframe (and the width of the editor-viewer widget)
     */
    width?: string;
    /**
     * The height of the iframe (and the height of the editor-viewer widget)
     */
    height?: string;
};

type ViewerIframeRemote = Comlink.Remote<{
    renderViewerWithFunctionProps: (...args: (string | Function)[]) => void;
    updateViewerProps: (props: Record<string, any>) => void;
    updateViewerFunctionProps: (...args: (string | Function)[]) => void;
}>;

// In-place prop updates require a standalone bundle whose
// `renderDoenetViewerToContainer` re-renders against a cached React root
// (v0.7.18+, PR #1131). Calling it repeatedly against an older bundle mounts
// competing React roots on the same container.
const LIVE_UPDATE_MIN_VERSION = [0, 7, 18];

/**
 * Whether the standalone bundle selected by `version` supports live
 * (in-place) prop updates. Missing version parts are npm ranges that
 * jsdelivr resolves to the newest matching release (e.g. "0.7" serves the
 * latest 0.7.x, which is ≥ 0.7.18), so they compare as the range's upper
 * bound. Unparseable versions are assumed modern.
 */
function versionSupportsLiveUpdates(version: string): boolean {
    const match = version
        .replace(/^v/, "")
        .match(/^(\d+)(?:\.(\d+))?(?:\.(\d+))?/);
    if (!match) {
        return true;
    }
    const parts = [match[1], match[2], match[3]].map((p) =>
        p === undefined ? Infinity : parseInt(p, 10),
    );
    for (let i = 0; i < 3; i++) {
        if (parts[i] > LIVE_UPDATE_MIN_VERSION[i]) {
            return true;
        }
        if (parts[i] < LIVE_UPDATE_MIN_VERSION[i]) {
            return false;
        }
    }
    return true;
}

/**
 * Render Doenet viewer constrained to an iframe. A URL pointing to a version of DoenetML
 * standalone must be provided (along with a URL to the corresponding CSS file).
 *
 * Parameters for the underlying `DoenetViewer` component are passed via props.
 * Serializable prop changes after mount are pushed into the iframe as
 * messages and applied in place with the same semantics as the in-process
 * `<DoenetViewer>`: e.g. flipping `render` starts the document without a
 * reload, and changing `doenetML` (or `activityId`/`docId`/`attemptNumber`/
 * `requestedVariantIndex`) re-initializes the document's core inside the
 * same iframe realm — the multi-MB standalone bundle is not re-parsed. Only
 * a change of the bundle itself (`standaloneUrl`/`cssUrl`/`doenetmlVersion`,
 * a version change detected in `doenetML`, or `useSharedCoreWorker`) reloads
 * the iframe. To force a full remount instead, change the component's `key`.
 *
 * Function props are forwarded across the iframe boundary via Comlink
 * proxies and follow the latest identity passed. (Bundles older than
 * v0.7.18 cannot re-render in place; for those the wrapper falls back to
 * reloading the iframe on any prop change, its historical behavior.)
 */
export function DoenetViewer({
    doenetML,
    standaloneUrl: specifiedStandaloneUrl,
    cssUrl: specifiedCssUrl,
    doenetmlVersion: specifiedDoenetmlVersion,
    autodetectVersion = true,
    useSharedCoreWorker = false,
    mountPolicy,
    ...doenetViewerProps
}: DoenetViewerIframeProps) {
    const [id, _] = React.useState(() => Math.random().toString(36).slice(2));
    const ref = React.useRef<HTMLIFrameElement>(null);
    const viewerIframeRef = React.useRef<ViewerIframeRemote | null>(null);
    const pendingActions = React.useRef<
        ((remote: ViewerIframeRemote) => void)[]
    >([]);
    // Snapshot of the serializable props last pushed to the iframe via
    // Comlink. Re-anchored when `srcDoc` rebuilds (see the layout effect
    // below) so the live-update effect replays any drift against the
    // freshly-loaded iframe.
    const lastSentPropsSnapshotRef = React.useRef<string | null>(null);
    // Snapshot of the function-typed props registered with the iframe via
    // Comlink.proxy. Used to detect when the parent passes a new callback
    // identity so the iframe can be re-pointed at the fresh closure.
    const lastSentFunctionPropsRef = React.useRef<Record<
        string,
        Function
    > | null>(null);
    // Latest doenetML/props so the (deps-empty) message listener, the srcDoc
    // memo, and re-entrant effects read current values rather than a stale
    // closure's.
    const doenetViewerPropsRef = React.useRef(doenetViewerProps);
    doenetViewerPropsRef.current = doenetViewerProps;
    const doenetMLRef = React.useRef(doenetML);
    doenetMLRef.current = doenetML;

    // ---- Windowed mounting (mountPolicy) state ----
    // The policy is read at mount and treated as immutable afterwards.
    // Windowed viewers START parked: the iframe is only created once the
    // viewer is near the viewport AND a boot slot is free (#1439) — an
    // off-screen viewer never boots at all.
    const windowed = mountPolicy?.mode === "windowed";
    const [parked, setParked] = React.useState(windowed);
    // Bumped on unpark so the srcDoc memo rebuilds (baking the restored
    // state) even though none of its other inputs changed.
    const [parkGeneration, setParkGeneration] = React.useState(0);
    const parkedRef = React.useRef(windowed);
    const parkingRef = React.useRef(false);
    const visibleRef = React.useRef(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const parkFlushCounterRef = React.useRef(0);
    const parkFlushIdRef = React.useRef<string | null>(null);
    const parkFlushCleanupRef = React.useRef<(() => void) | null>(null);
    // Latest SPLICE.reportScoreAndState from OUR iframe (matched by
    // event.source) — the state snapshot a park uses to seed `initialState`
    // on restore.
    const lastCapturedReportRef = React.useRef<any>(null);
    // State baked into the next unpark's srcdoc. `undefined` = no snapshot:
    // restore falls back to the host's own `initialState`/IndexedDB/getState.
    const parkedSnapshotRef = React.useRef<Record<string, any> | undefined>(
        undefined,
    );
    // Whether any park flush ever acknowledged holding state — used to
    // answer host flushes while parked.
    const everHadStateRef = React.useRef(false);
    // Pin the variant for the component's lifetime when windowed: an
    // undefined `requestedVariantIndex` makes the inner viewer pick a random
    // variant per boot, and an unpark must not reroll the document.
    // (Mirrors the in-process viewer's random-variant range.)
    const pinnedVariantIndexRef = React.useRef<number | null>(null);
    if (windowed && pinnedVariantIndexRef.current === null) {
        pinnedVariantIndexRef.current =
            doenetViewerProps.requestedVariantIndex ??
            Math.floor(Math.random() * 1000000) + 1;
    }
    // Watchdog freeing a held boot slot if the realm never reports
    // initialized (the boot itself continues; only the slot is reclaimed).
    const bootWatchdogRef = React.useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );
    /** Cancel the boot-slot watchdog timer if one is pending. */
    function clearBootWatchdog() {
        if (bootWatchdogRef.current !== null) {
            clearTimeout(bootWatchdogRef.current);
            bootWatchdogRef.current = null;
        }
    }
    /**
     * Give up this viewer's boot slot and stop the watchdog guarding it —
     * used whenever the boot concludes (initialized, errored, or parked).
     */
    function relinquishBootSlot() {
        clearBootWatchdog();
        releaseBootSlot(id);
    }
    // Stable composed initializedCallback: releases this viewer's boot slot,
    // then forwards to the host's latest callback. Registered with the
    // iframe instead of the host's own callback when windowed (the iframe
    // side sees one stable identity; the host's identity is still what the
    // function-prop change detection compares).
    const composedInitializedCallbackRef = React.useRef<
        ((arg: unknown) => void) | null
    >(null);
    if (composedInitializedCallbackRef.current === null) {
        composedInitializedCallbackRef.current = (arg: unknown) => {
            relinquishBootSlot();
            (doenetViewerPropsRef.current as any).initializedCallback?.(arg);
        };
    }
    /** Proxy the composed callback for windowed viewers, the raw one otherwise. */
    function functionPropToProxy(key: string, prop: Function): Function {
        if (windowed && key === "initializedCallback") {
            return composedInitializedCallbackRef.current!;
        }
        return prop;
    }
    /**
     * Append the composed `initializedCallback` proxy to a Comlink
     * function-prop argument list when windowed and the host supplied no
     * `initializedCallback` of its own, so the boot-slot release still
     * reaches the iframe. `hostFunctions` is the set of function props the
     * host actually passed (keyed by name).
     */
    function appendComposedInitializedCallback(
        proxiedFunctions: (string | Function)[],
        hostFunctions: Record<string, Function>,
    ) {
        if (windowed && !("initializedCallback" in hostFunctions)) {
            proxiedFunctions.push("initializedCallback");
            proxiedFunctions.push(
                Comlink.proxy(composedInitializedCallbackRef.current!),
            );
        }
    }

    const [height, setHeight] = React.useState("500px");
    const [inErrorState, setInErrorState] = React.useState<string | null>(null);
    const [ignoreDetectedVersion, setIgnoreDetectedVersion] =
        React.useState(false);
    const resolvedTheme = useResolvedTheme(
        doenetViewerProps.darkMode ?? "system",
    );

    function syncIframeBodyBackground() {
        const body = ref.current?.contentDocument?.body;
        if (body) {
            setIframeBodyBackground(
                body,
                doenetViewerPropsRef.current.darkMode,
            );
        }
    }

    let standaloneUrl: string, cssUrl: string;
    let foundAutoVersion = false;
    let detectedVersion;

    if (autodetectVersion && !ignoreDetectedVersion) {
        let result = detectVersionFromDoenetML(doenetML);
        if (result?.version !== undefined) {
            foundAutoVersion = true;
            detectedVersion = "v" + result.version;
        }
    }

    const addVirtualKeyboard = doenetViewerProps.addVirtualKeyboard !== false;

    let selectedDoenetmlVersion =
        detectedVersion ?? specifiedDoenetmlVersion ?? latestDoenetmlVersion;

    if (specifiedStandaloneUrl && !foundAutoVersion) {
        standaloneUrl = specifiedStandaloneUrl;
    } else {
        standaloneUrl = `https://cdn.jsdelivr.net/npm/@doenet/standalone@${selectedDoenetmlVersion}/doenet-standalone.js`;
    }
    if (specifiedCssUrl && !foundAutoVersion) {
        cssUrl = specifiedCssUrl;
    } else {
        cssUrl = `https://cdn.jsdelivr.net/npm/@doenet/standalone@${selectedDoenetmlVersion}/style.css`;
    }

    // Whether the bundle in the iframe can apply prop changes in place. A
    // host-specified standaloneUrl carries no version information; assume it
    // is a current bundle (hosts shipping a custom URL control both sides).
    const usingCustomStandaloneUrl = Boolean(
        specifiedStandaloneUrl && !foundAutoVersion,
    );
    const liveUpdatesSupported =
        usingCustomStandaloneUrl ||
        versionSupportsLiveUpdates(selectedDoenetmlVersion);

    // Latest standaloneUrl for the (deps-empty) message listener below — it
    // can change after mount via the autodetect-version fallback, and the
    // shared-core pool keys its workers by the URL the iframe actually loads.
    const standaloneUrlRef = React.useRef(standaloneUrl);
    standaloneUrlRef.current = standaloneUrl;

    // Serializable snapshot of the live-updatable inputs (doenetML + all
    // non-function props), used for change detection against what the iframe
    // last received. See `serializePropsSnapshot` for the JSON-safety caveats.
    const propsSnapshotStr = serializePropsSnapshot(
        { doenetML },
        doenetViewerProps,
    );

    // Legacy bundles (< 0.7.18) can't re-render in place, so fall back to
    // the historical behavior: bake current props into the srcdoc and reload
    // the iframe on any change.
    const legacyReloadKey = liveUpdatesSupported ? "" : propsSnapshotStr;

    // Only recompute `srcDoc` when something that genuinely requires a
    // reload changes: a new standalone bundle (autodetect-version fallback,
    // or a version change detected in edited doenetML) or the
    // shared-core-worker mode (baked as a const into the srcdoc). Other prop
    // changes flow live through `updateViewerProps` below. The memo reads
    // current values via refs: a rebuild bakes the *latest* doenetML/props,
    // and the layout effect below re-anchors the sent-snapshot baseline to
    // those same values.
    const srcDoc = React.useMemo(() => {
        let bakedProps = doenetViewerPropsRef.current;
        if (windowed) {
            // Windowed overrides: pin the variant so an unpark cannot reroll
            // the document, and seed a parked snapshot (captured from the
            // park flush) as `initialState` — which requires
            // `allowLoadState` to be honored.
            bakedProps = { ...bakedProps };
            if (bakedProps.requestedVariantIndex === undefined) {
                bakedProps.requestedVariantIndex =
                    pinnedVariantIndexRef.current!;
            }
            if (parkedSnapshotRef.current !== undefined) {
                bakedProps.initialState = parkedSnapshotRef.current;
                bakedProps.flags = {
                    ...(bakedProps.flags ?? {}),
                    allowLoadState: true,
                };
            }
        }
        return createHtmlForDoenetViewer(
            id,
            doenetMLRef.current,
            bakedProps,
            standaloneUrl,
            cssUrl,
            useSharedCoreWorker,
        );
    }, [
        id,
        standaloneUrl,
        cssUrl,
        useSharedCoreWorker,
        legacyReloadKey,
        parkGeneration,
    ]);

    // Shared-core cleanup on unmount (#1466): an unmounted iframe realm never
    // runs its own core teardown, so release any cores this viewer created on
    // the parent-owned pool. Unconditional (not gated on the current
    // `useSharedCoreWorker` value): `destroySharedCoresForViewer` is a no-op
    // when the viewer has no cores, and gating could miss cores created
    // before a prop change.
    React.useEffect(() => {
        return () => {
            destroySharedCoresForViewer(id);
        };
    }, []);

    // When `srcDoc` changes (bundle swap via the autodetect-version fallback
    // or a detected version change), React updates the iframe attribute and
    // the browser reloads the iframe document. The previous Comlink remote
    // becomes bound to a torn-down `contentWindow` until the new iframe sends
    // `iframeReady`. Clear the remote synchronously at commit so updates
    // dispatched between commit and the next `iframeReady` queue and replay
    // against the new remote instead of dispatching into a dead one. The old
    // realm also never ran its own teardown, so release any shared cores it
    // created (#1466) before the new realm re-creates cores under the same
    // viewer id. Finally, re-anchor the live-update snapshot refs to the
    // values the memo above just baked into the new srcdoc, so the
    // live-update effect can detect (and replay) any later drift. In the
    // steady state `srcDoc` is stable, so this effect runs once at mount.
    React.useLayoutEffect(() => {
        viewerIframeRef.current = null;
        destroySharedCoresForViewer(id);
        lastSentPropsSnapshotRef.current = serializePropsSnapshot(
            { doenetML: doenetMLRef.current },
            doenetViewerPropsRef.current,
        );
        // Function props re-register when the new iframe emits iframeReady
        // (the listener calls renderViewerWithFunctionProps with the latest
        // identities and re-populates this ref), so just clear it here.
        lastSentFunctionPropsRef.current = null;
    }, [srcDoc]);

    React.useEffect(() => {
        const listener = (event: MessageEvent<IframeMessage>) => {
            if (event.origin !== window.location.origin) {
                return;
            }

            // A parked viewer has no realm to forward a host flush into, but
            // the flush that parked it already pushed every pending save out
            // — answer on its behalf so a host's pre-navigation flush
            // round-trip doesn't hang on parked viewers (#1468 contract).
            if (
                windowed &&
                parkedRef.current &&
                event.data.subject === "SPLICE.flushState"
            ) {
                const currentProps = doenetViewerPropsRef.current;
                window.postMessage({
                    subject: "SPLICE.flushState.response",
                    activity_id: currentProps.activityId ?? "a",
                    doc_id: currentProps.docId ?? "1",
                    message_id: event.data.message_id,
                    success: true,
                    hadState: everHadStateRef.current,
                });
                return;
            }

            // forward host requests/responses (SPLICE getState response,
            // requestSolutionView response, submitAllAnswers, flushState) to
            // the iframe; the viewer's replies reach the host directly (the
            // viewer posts to window.parent, which is the host page).
            if (
                event.data.subject === "SPLICE.getState.response" ||
                event.data.subject === "SPLICE.requestSolutionView.response" ||
                event.data.subject == "SPLICE.submitAllAnswers" ||
                event.data.subject === "SPLICE.flushState"
            ) {
                ref.current?.contentWindow?.postMessage(event.data);
                return;
            }

            if (event.source !== ref.current?.contentWindow) {
                return;
            }

            if (event.data.subject === "lti.frameResize") {
                if (event.data.height !== undefined) {
                    setHeight(event.data.height + "px");
                }
            }

            // Windowed mounting: track the latest state report from OUR
            // iframe (the park-snapshot source; reports reach this window
            // because the in-iframe viewer posts to window.parent), and
            // complete an in-flight park when its flush acknowledgement
            // arrives. Reports are delivered before the acknowledgement
            // (same-realm postMessage ordering), so the snapshot is current
            // when the park completes.
            if (windowed) {
                if (event.data.subject === "SPLICE.reportScoreAndState") {
                    lastCapturedReportRef.current = event.data;
                    return;
                }
                if (
                    event.data.subject === "SPLICE.flushState.response" &&
                    event.data.message_id === parkFlushIdRef.current
                ) {
                    completeParkFlush(event.data);
                    return;
                }
            }

            if (event.data?.origin !== id) {
                return;
            }

            const data = event.data.data;

            // Shared core-worker protocol (#1466): the iframe's viewer mints
            // a MessageChannel, keeps one port, and sends the other here to
            // be forwarded to a parent-owned shared host worker.
            if (data.type === "createSharedCore" && event.ports[0]) {
                handleCreateSharedCore({
                    viewerId: id,
                    coreId: String(data.coreId),
                    standaloneUrl: standaloneUrlRef.current,
                    port: event.ports[0],
                });
                return;
            }
            if (data.type === "destroySharedCore") {
                handleDestroySharedCore({
                    coreId: String(data.coreId),
                    suspectWedge: Boolean(data.suspectWedge),
                });
                return;
            }

            // If receive a scrollTo event from the iframe,
            // that means that a scroll-only link (i.e. with target of the form "#anchor")
            // was clicked on.
            // Scroll the window to desired location given the position of the iframe.
            // Note: if the iframe is in a scrollable container other than window,
            // then one should pass in a `requestScrollTo` prop to the parent DoenetViewer,
            // which will be called instead of these `scrollTo` events being sent.
            if (
                ref.current &&
                data.type === "scrollTo" &&
                typeof data.offset === "number"
            ) {
                const iframeTop =
                    ref.current.getBoundingClientRect().top + window.scrollY;
                const targetAbsoluteTop = iframeTop + data.offset;
                window.scrollTo({
                    top: targetAbsoluteTop - 20,
                    behavior: "smooth",
                });
            }

            if (data.error) {
                // A failed boot must not hold its boot slot.
                if (windowed) {
                    relinquishBootSlot();
                }
                //@ts-ignore
                return setInErrorState(data.error);
            } else if (data.iframeReady) {
                // if `iframeReady`, then Comlink.expose has been called in the iframe
                // and we can call `renderViewerWithFunctionProps`

                if (ref.current) {
                    const viewerIframe: ViewerIframeRemote = Comlink.wrap(
                        Comlink.windowEndpoint(ref.current.contentWindow!),
                    );

                    // Note that Comlink is unable to send proxied functions as an values of an object,
                    // but must be direct arguments of the function.
                    // To indicate the functions names, the arguments are a series of string key names
                    // followed by the proxied function with that name.
                    // Read from the ref so that if the parent passed a new
                    // callback identity between mount and iframeReady, the
                    // freshest closure is what gets registered.
                    const latestProps = doenetViewerPropsRef.current;
                    const proxiedFunctions: (string | Function)[] = [];
                    const registeredFunctions: Record<string, Function> = {};
                    for (const [key, prop] of Object.entries(latestProps)) {
                        if (typeof prop === "function") {
                            registeredFunctions[key] = prop;
                            proxiedFunctions.push(key);
                            proxiedFunctions.push(
                                Comlink.proxy(functionPropToProxy(key, prop)),
                            );
                        }
                    }
                    // Windowed viewers always register the composed
                    // initializedCallback (it releases the boot slot), even
                    // when the host passed none.
                    appendComposedInitializedCallback(
                        proxiedFunctions,
                        registeredFunctions,
                    );
                    viewerIframe
                        .renderViewerWithFunctionProps(...proxiedFunctions)
                        .catch(
                            logComlinkError(
                                "DoenetViewer",
                                "renderViewerWithFunctionProps",
                            ),
                        );
                    // Record what we registered so the function-prop change
                    // effect below can detect later identity changes.
                    lastSentFunctionPropsRef.current = registeredFunctions;

                    // Make the remote available to the live-update effects
                    // and replay any updates queued before the iframe was
                    // ready.
                    viewerIframeRef.current = viewerIframe;
                    const queued = pendingActions.current.splice(0);
                    for (const action of queued) {
                        action(viewerIframe);
                    }
                    syncIframeBodyBackground();
                }
            }
        };
        // Attach unconditionally: a windowed viewer renders NO iframe at
        // first commit (it starts as a parked placeholder), but this
        // listener must already be in place when the lazily-created iframe
        // signals iframeReady later.
        window.addEventListener("message", listener);

        return () => {
            window.removeEventListener("message", listener);
        };
    }, []);

    // Push serializable prop changes (including `doenetML`) into the iframe
    // without reloading it. Compares against the ref re-anchored by the
    // layoutEffect above (initial mount: baseline equal to current → no push;
    // later renders: ref reflects last-sent state). `srcDoc` is in the dep
    // list so a rebuild fires this effect even when no prop changed,
    // replaying any drift. The inner DocViewer applies its in-process
    // semantics to the update — e.g. a `doenetML` change re-initializes the
    // core in the same realm. Skipped for legacy (< 0.7.18) bundles, which
    // reload via `legacyReloadKey` instead.
    React.useEffect(() => {
        if (!liveUpdatesSupported) {
            return;
        }
        if (lastSentPropsSnapshotRef.current === propsSnapshotStr) {
            return;
        }
        lastSentPropsSnapshotRef.current = propsSnapshotStr;
        const snapshot = JSON.parse(propsSnapshotStr);
        const action = (remote: ViewerIframeRemote) => {
            remote
                .updateViewerProps(snapshot)
                .catch(logComlinkError("DoenetViewer", "updateViewerProps"));
        };
        if (viewerIframeRef.current) {
            action(viewerIframeRef.current);
        } else {
            pendingActions.current.push(action);
        }
    }, [propsSnapshotStr, srcDoc, liveUpdatesSupported]);

    // Keep the iframe body's empty margin area aligned with live dark-mode
    // changes without reloading the document. iframeReady also re-syncs the
    // body after any srcDoc rebuild so mount-time darkMode doesn't leak back
    // in.
    React.useEffect(() => {
        syncIframeBodyBackground();
    }, [doenetViewerProps.darkMode]);

    // Push function-prop identity changes into the iframe, matching the
    // in-process `<DoenetViewer>` (where parents routinely pass a fresh
    // closure each render). Same strategy and caveats as the editor's
    // function-prop effect below — see that comment block for the full
    // rationale (full-set resend, dispatchers on the iframe side, Comlink
    // port lifetime).
    //
    // No deps array on purpose: change detection is by-hand identity
    // comparison against `lastSentFunctionPropsRef`, not React's shallow
    // dep diff. The effect fires every render and short-circuits when the
    // function set is unchanged.
    React.useEffect(() => {
        if (!liveUpdatesSupported) {
            return;
        }
        const prev = lastSentFunctionPropsRef.current;
        if (prev === null) {
            return;
        }
        const current: Record<string, Function> = {};
        for (const [key, val] of Object.entries(doenetViewerPropsRef.current)) {
            if (typeof val === "function") {
                current[key] = val;
            }
        }
        const prevKeys = Object.keys(prev);
        const currKeys = Object.keys(current);
        let changed = prevKeys.length !== currKeys.length;
        if (!changed) {
            for (const k of currKeys) {
                if (prev[k] !== current[k]) {
                    changed = true;
                    break;
                }
            }
        }
        if (!changed) {
            return;
        }
        lastSentFunctionPropsRef.current = current;
        const proxiedFunctions: (string | Function)[] = [];
        for (const [key, val] of Object.entries(current)) {
            proxiedFunctions.push(key);
            proxiedFunctions.push(Comlink.proxy(functionPropToProxy(key, val)));
        }
        appendComposedInitializedCallback(proxiedFunctions, current);
        const action = (remote: ViewerIframeRemote) => {
            remote
                .updateViewerFunctionProps(...proxiedFunctions)
                .catch(
                    logComlinkError(
                        "DoenetViewer",
                        "updateViewerFunctionProps",
                    ),
                );
        };
        if (viewerIframeRef.current) {
            action(viewerIframeRef.current);
        } else {
            pendingActions.current.push(action);
        }
    });

    // ---- Windowed mounting: park / unpark mechanics ----
    // (Policy — when to park — lives in viewer-lifecycle-manager.ts; these
    // functions are the mechanics the manager drives via `requestPark`.)
    // All of them read refs rather than render-scope values so the
    // mount-time closures registered with the manager and the (deps-empty)
    // message listener stay correct across renders.

    /** Whether parking can lose no work: some persistence path must exist. */
    function hasPersistencePath() {
        const flags: any = doenetViewerPropsRef.current.flags;
        return Boolean(flags?.allowSaveState || flags?.allowLocalState);
    }

    /**
     * Whether this viewer may be parked *right now*. Requires a persistence
     * path (else parking loses work) AND a live iframe realm to flush: an
     * errored or already-torn-down viewer has no `contentWindow`, so parking
     * it is a no-op — and leaving it eligible would spin the manager, which
     * re-asks (via `scheduleEvaluate(0)`) after every failed `beginPark`.
     */
    function canPark() {
        return hasPersistencePath() && Boolean(ref.current?.contentWindow);
    }

    /**
     * Begin parking (called by the lifecycle manager): flush the viewer's
     * state, then swap the iframe for a placeholder once acknowledged.
     * Re-posts the flush every 500 ms (the viewer's listener registers on
     * mount and flushing is idempotent) and parks anyway on timeout — by
     * then a persistence path is guaranteed by `canPark`, and a realm that
     * cannot acknowledge (still booting, or wedged) holds no recoverable
     * work that staying live would preserve.
     */
    function beginPark() {
        if (parkedRef.current || parkingRef.current) {
            return;
        }
        if (!ref.current?.contentWindow) {
            // No iframe to park (e.g. error state); correct the manager's
            // optimistic "parking" mark.
            notifyViewerState(id, "live");
            return;
        }
        parkingRef.current = true;
        const flushId = `__doenetParkFlush-${id}-${++parkFlushCounterRef.current}`;
        parkFlushIdRef.current = flushId;
        const post = () => {
            ref.current?.contentWindow?.postMessage({
                subject: "SPLICE.flushState",
                message_id: flushId,
            });
        };
        const retryTimer = setInterval(post, 500);
        const timeoutTimer = setTimeout(() => {
            onParkFlushTimeout();
        }, mountPolicy?.flushTimeoutMs ?? DEFAULT_FLUSH_TIMEOUT_MS);
        parkFlushCleanupRef.current = () => {
            clearInterval(retryTimer);
            clearTimeout(timeoutTimer);
            parkFlushCleanupRef.current = null;
        };
        post();
    }

    /**
     * Tear down the in-flight park flush (its retry/timeout timers) when it
     * resolves — whether by acknowledgement or timeout. Returns whether the
     * park should proceed: `false` if no flush was in flight, or the viewer
     * scrolled back into view while the flush was in flight (nothing has been
     * torn down, so it just stays live).
     */
    function endParkFlush(): boolean {
        if (!parkingRef.current) {
            return false;
        }
        parkFlushCleanupRef.current?.();
        parkFlushIdRef.current = null;
        parkingRef.current = false;
        if (visibleRef.current) {
            notifyViewerState(id, "live");
            return false;
        }
        return true;
    }

    /** The park flush acknowledged — finish parking (or abort if visible). */
    function completeParkFlush(ack: any) {
        if (!endParkFlush()) {
            return;
        }
        if (ack.hadState) {
            everHadStateRef.current = true;
            if (lastCapturedReportRef.current?.state) {
                parkedSnapshotRef.current = lastCapturedReportRef.current.state;
            }
        }
        // else: keep any previous snapshot. `hadState: false` with a prior
        // snapshot means the core never booted this generation, so the prior
        // snapshot is still the latest truth; with no snapshot at all the
        // unpark falls back to the host's initialState/IndexedDB/getState.
        finishPark();
    }

    /** No acknowledgement within flushTimeoutMs — park anyway (see above). */
    function onParkFlushTimeout() {
        if (!endParkFlush()) {
            return;
        }
        finishPark();
    }

    function finishPark() {
        // The dead realm's remote must not receive further updates; clear it
        // so prop changes while parked queue and replay against the restored
        // realm's iframeReady.
        viewerIframeRef.current = null;
        destroySharedCoresForViewer(id);
        // A parked viewer no longer boots; free its slot for the queue.
        relinquishBootSlot();
        parkedRef.current = true;
        setParked(true);
        notifyViewerState(id, "parked");
    }

    /**
     * Restore a parked viewer (on scrolling back into view) once a boot
     * slot is free (#1439): at most `maxConcurrentBoots` windowed viewers
     * evaluate the multi-MB bundle at once, visible-first. The request is
     * deduplicated by the manager and withdrawn if the viewer scrolls away
     * before a slot frees up.
     */
    function unpark() {
        if (!parkedRef.current) {
            return;
        }
        requestBootSlot(id, () => {
            // Granted — possibly synchronously, possibly much later. Only
            // boot if this viewer still wants to be live.
            if (!parkedRef.current || !visibleRef.current) {
                releaseBootSlot(id);
                return;
            }
            parkedRef.current = false;
            setParked(false);
            // Rebuild the srcdoc so the restored realm boots seeded with the
            // parked snapshot (see the srcDoc memo).
            setParkGeneration((generation) => generation + 1);
            notifyViewerState(id, "live");
            clearBootWatchdog();
            bootWatchdogRef.current = setTimeout(() => {
                bootWatchdogRef.current = null;
                releaseBootSlot(id);
            }, BOOT_SLOT_WATCHDOG_MS);
        });
    }

    // Observe visibility of the wrapper div (which stays mounted across
    // park/unpark). Entering the margin unparks; the manager decides parking.
    React.useEffect(() => {
        if (!windowed || !containerRef.current) {
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    visibleRef.current = entry.isIntersecting;
                    setViewerVisibility(id, entry.isIntersecting);
                    if (entry.isIntersecting && parkedRef.current) {
                        unpark();
                    } else if (!entry.isIntersecting) {
                        // No longer worth booting; withdraw a queued boot
                        // request (a granted/booting viewer is left alone —
                        // the park policy handles it).
                        cancelBootRequest(id);
                    }
                }
            },
            {
                rootMargin:
                    mountPolicy?.visibleMargin ?? DEFAULT_VISIBLE_MARGIN,
            },
        );
        observer.observe(containerRef.current);
        return () => {
            observer.disconnect();
        };
    }, [windowed]);

    // Register with the page-wide lifecycle manager.
    React.useEffect(() => {
        if (!windowed) {
            return;
        }
        if (!hasPersistencePath()) {
            console.warn(
                "DoenetViewer mountPolicy: windowed mounting is enabled but neither flags.allowSaveState nor flags.allowLocalState is set, so parking would lose student work. This viewer will always stay live.",
            );
        }
        const unregister = registerWindowedViewer({
            id,
            maxLiveViewers:
                mountPolicy?.maxLiveViewers ?? DEFAULT_MAX_LIVE_VIEWERS,
            maxConcurrentBoots:
                mountPolicy?.maxConcurrentBoots ?? DEFAULT_MAX_CONCURRENT_BOOTS,
            parkDelayMs: mountPolicy?.parkDelayMs ?? DEFAULT_PARK_DELAY_MS,
            canPark,
            requestPark: beginPark,
        });
        // Windowed viewers start parked (no iframe until visible + a boot
        // slot); tell the manager so the budget starts correct.
        if (parkedRef.current) {
            notifyViewerState(id, "parked");
        }
        return () => {
            parkFlushCleanupRef.current?.();
            clearBootWatchdog();
            unregister();
        };
    }, [windowed]);

    if (inErrorState) {
        if (foundAutoVersion) {
            setIgnoreDetectedVersion(true);
            setInErrorState("");
            return null;
        }

        let errorIcon = (
            <MdError
                fontSize="24pt"
                color="#C1292E"
                style={{ verticalAlign: "middle" }}
            />
        );
        return (
            <div
                style={{
                    fontSize: "1.3em",
                    marginLeft: "20px",
                    marginTop: "20px",
                    backgroundColor:
                        resolvedTheme === "dark"
                            ? "#7f1d1d"
                            : "hsl(0, 54%, 82%)",
                    color: resolvedTheme === "dark" ? "white" : "black",
                    borderWidth: 3,
                    borderStyle: "solid",
                    borderColor: "#c1292e",
                    padding: "0.5em",
                }}
            >
                {errorIcon} {inErrorState}
            </div>
        );
    }

    const viewerContent = parked ? (
        // Fixed-height placeholder holding a parked viewer's place in the
        // layout (the last height the iframe reported survives in state, so
        // parking does not shift the page).
        <div
            data-doenet-parked-viewer="true"
            style={{
                width: "100%",
                boxSizing: "border-box",
                height,
                minHeight: 50,
            }}
        />
    ) : (
        <React.Fragment>
            {addVirtualKeyboard ? (
                <ExternalVirtualKeyboard ownerRef={ref} theme={resolvedTheme} />
            ) : null}
            <iframe
                title="Doenet document"
                ref={ref}
                srcDoc={srcDoc}
                style={{
                    width: "100%",
                    boxSizing: "border-box",
                    overflow: "hidden",
                    border: "none",
                    minHeight: 50,
                }}
                height={height}
            />
        </React.Fragment>
    );

    if (!windowed) {
        // Without a mountPolicy the rendered DOM is exactly the historical
        // shape (no wrapper element).
        return viewerContent;
    }

    // The wrapper div is the IntersectionObserver target; it stays mounted
    // across park/unpark so visibility keeps being observed.
    return (
        <div ref={containerRef} style={{ width: "100%" }}>
            {viewerContent}
        </div>
    );
}

/**
 * Render Doenet Editor constrained to an iframe. A URL pointing to a version of DoenetML
 * standalone must be provided (along with a URL to the corresponding CSS file).
 *
 * Parameters being passed to the underlying DoenetML component are passed via the `DoenetEditorProps` prop.
 * However, only serializable parameters may be passed. E.g., callbacks **cannot** be passed to the underlying
 * DoenetML component. Instead you must use the message passing interface of `DoenetEditor` to communicate
 * with the underlying DoenetML component.
 */
type EditorIframeRemote = Comlink.Remote<{
    renderEditorWithFunctionProps: (...args: (string | Function)[]) => void;
    updateEditorProps: (props: Record<string, any>) => void;
    updateEditorFunctionProps: (...args: (string | Function)[]) => void;
    openDiagnosticsTab: (tabId: DiagnosticsTabId) => void;
    closeDiagnosticsPanel: () => void;
    updateRenderedView: () => void;
}>;

// Serialize the live-updatable props into the JSON string used both for
// change detection (against what the iframe last received) and as the
// payload pushed through `updateViewerProps`/`updateEditorProps`. The `seed`
// entries (the viewer's source `doenetML`, or the editor's `width`) come
// first, then every non-function entry of `props`; function props travel
// separately as Comlink proxies.
//
// Change detection uses `JSON.stringify`, which assumes supported props are
// JSON-safe (scalars, plain arrays/objects). `undefined` values are dropped,
// `Date`/`Map`/`Set` are normalized to strings/empty objects, and key
// reordering produces spurious diffs. If a new prop with an exotic value type
// is added later, prefer a structural comparator over expanding what this
// serializer handles.
function serializePropsSnapshot(
    seed: Record<string, any>,
    props: Record<string, any>,
): string {
    const snapshot: Record<string, any> = { ...seed };
    for (const [key, val] of Object.entries(props)) {
        if (typeof val !== "function") {
            snapshot[key] = val;
        }
    }
    return JSON.stringify(snapshot);
}

// ComLink RPC calls return Promises, but the wrapper APIs built on them are
// `void` (matching the in-process components so consumers can use one type
// for both). Attach an explicit catch handler so we don't leave the Promise
// unhandled — surface errors via console rather than swallowing them.
function logComlinkError(component: string, method: string) {
    return (err: unknown) => {
        console.warn(`iframe ${component}: ${method} failed`, err);
    };
}

export const DoenetEditor = React.forwardRef<
    DoenetEditorHandle,
    DoenetEditorIframeProps
>(function DoenetEditor(
    {
        doenetML,
        standaloneUrl: specifiedStandaloneUrl,
        cssUrl: specifiedCssUrl,
        doenetmlVersion: specifiedDoenetmlVersion,
        width = "100%",
        height = "500px",
        autodetectVersion = true,
        ...doenetEditorProps
    },
    forwardedRef,
) {
    const [id, _] = React.useState(() => Math.random().toString(36).slice(2));
    const ref = React.useRef<HTMLIFrameElement>(null);
    const editorIframeRef = React.useRef<EditorIframeRemote | null>(null);
    const pendingActions = React.useRef<
        ((remote: EditorIframeRemote) => void)[]
    >([]);
    // Snapshot of the props last pushed to the iframe via Comlink. Cleared
    // when `srcDoc` rebuilds (autodetect-version fallback) so the live-update
    // effect re-sends current values against the freshly-loaded iframe, which
    // is otherwise stuck with the mount-time snapshot baked into `srcDoc`.
    const lastSentPropsSnapshotRef = React.useRef<string | null>(null);
    // Snapshot of the function-typed props registered with the iframe via
    // Comlink.proxy. Used to detect when the parent passes a new callback
    // identity so the iframe can be re-pointed at the fresh closure.
    const lastSentFunctionPropsRef = React.useRef<Record<
        string,
        Function
    > | null>(null);
    // Latest doenetEditorProps so the (deps-empty) iframeReady listener and
    // re-entrant effects can read current values rather than the closure's.
    const doenetEditorPropsRef = React.useRef(doenetEditorProps);
    doenetEditorPropsRef.current = doenetEditorProps;
    const [inErrorState, setInErrorState] = React.useState<string | null>(null);
    const [ignoreDetectedVersion, setIgnoreDetectedVersion] =
        React.useState(false);
    const [initialDiagnostics, setInitialDiagnostics] = React.useState<
        DiagnosticRecord[]
    >([]);
    const resolvedTheme = useResolvedTheme(
        doenetEditorProps.darkMode ?? "system",
    );

    function syncIframeBodyBackground() {
        const body = ref.current?.contentDocument?.body;
        if (body) {
            setIframeBodyBackground(
                body,
                doenetEditorPropsRef.current.darkMode,
            );
        }
    }

    React.useImperativeHandle(
        forwardedRef,
        () => ({
            openDiagnosticsTab(tabId: DiagnosticsTabId) {
                const action = (remote: EditorIframeRemote) => {
                    remote
                        .openDiagnosticsTab(tabId)
                        .catch(
                            logComlinkError(
                                "DoenetEditor",
                                "openDiagnosticsTab",
                            ),
                        );
                };
                if (editorIframeRef.current) {
                    action(editorIframeRef.current);
                } else {
                    pendingActions.current.push(action);
                }
            },
            closeDiagnosticsPanel() {
                const action = (remote: EditorIframeRemote) => {
                    remote
                        .closeDiagnosticsPanel()
                        .catch(
                            logComlinkError(
                                "DoenetEditor",
                                "closeDiagnosticsPanel",
                            ),
                        );
                };
                if (editorIframeRef.current) {
                    action(editorIframeRef.current);
                } else {
                    pendingActions.current.push(action);
                }
            },
            updateRenderedView() {
                const action = (remote: EditorIframeRemote) => {
                    remote
                        .updateRenderedView()
                        .catch(
                            logComlinkError(
                                "DoenetEditor",
                                "updateRenderedView",
                            ),
                        );
                };
                if (editorIframeRef.current) {
                    action(editorIframeRef.current);
                } else {
                    pendingActions.current.push(action);
                }
            },
        }),
        [],
    );

    // Capture the initial doenetML, width, and props bag once per mount.
    // Subsequent changes to these are not baked into a fresh srcDoc — instead
    // serializable prop changes are pushed through Comlink (see effect below).
    // `doenetML` here is effectively the *initial* DoenetML: changes to the
    // prop after mount are ignored on purpose so the user's in-progress edits
    // aren't blown away. Consumers wanting to seed a new document should
    // remount via a parent `key=`.
    const initialIframePropsRef = React.useRef<{
        doenetML: string;
        width: string;
        doenetEditorProps: typeof doenetEditorProps;
    } | null>(null);
    if (initialIframePropsRef.current === null) {
        initialIframePropsRef.current = {
            doenetML,
            width,
            doenetEditorProps,
        };
    }

    let standaloneUrl: string, cssUrl: string;
    let foundAutoVersion = false;
    let detectedVersion, detectedDoenetMLrange;

    if (autodetectVersion && !ignoreDetectedVersion) {
        let result = detectVersionFromDoenetML(doenetML);
        if (result?.version !== undefined) {
            foundAutoVersion = true;
            detectedVersion = "v" + result.version;
            detectedDoenetMLrange = result.position;
        }
    }

    const addVirtualKeyboard = doenetEditorProps.addVirtualKeyboard !== false;

    let selectedDoenetmlVersion =
        detectedVersion ?? specifiedDoenetmlVersion ?? latestDoenetmlVersion;

    if (specifiedStandaloneUrl && !foundAutoVersion) {
        standaloneUrl = specifiedStandaloneUrl;
    } else {
        standaloneUrl = `https://cdn.jsdelivr.net/npm/@doenet/standalone@${selectedDoenetmlVersion}/doenet-standalone.js`;
    }
    if (specifiedCssUrl && !foundAutoVersion) {
        cssUrl = specifiedCssUrl;
    } else {
        cssUrl = `https://cdn.jsdelivr.net/npm/@doenet/standalone@${selectedDoenetmlVersion}/style.css`;
    }

    React.useEffect(() => {
        const listener = (event: MessageEvent<IframeMessage>) => {
            if (
                event.origin !== window.location.origin ||
                event.data?.origin !== id
            ) {
                return;
            }

            const data = event.data.data;

            if (data.error) {
                //@ts-ignore
                return setInErrorState(data.error);
            } else if (data.iframeReady) {
                // if `iframeReady`, then Comlink.expose has been called in the iframe
                // and we can call `renderEditorWithFunctionProps`

                if (ref.current) {
                    const editorIframe: EditorIframeRemote = Comlink.wrap(
                        Comlink.windowEndpoint(ref.current.contentWindow!),
                    );

                    // Note that Comlink is unable to send proxied functions as an values of an object,
                    // but must be direct arguments of the function.
                    // To indicate the functions names, the arguments are a series of string key names
                    // followed by the proxied function with that name.
                    // Read from the ref so that if the parent passed a new
                    // callback identity between mount and iframeReady, the
                    // freshest closure is what gets registered.
                    const latestProps = doenetEditorPropsRef.current;
                    const proxiedFunctions: (string | Function)[] = [];
                    const registeredFunctions: Record<string, Function> = {};
                    for (const [key, prop] of Object.entries(latestProps)) {
                        if (typeof prop === "function") {
                            registeredFunctions[key] = prop;
                            proxiedFunctions.push(key);
                            proxiedFunctions.push(Comlink.proxy(prop));
                        }
                    }
                    editorIframe
                        ?.renderEditorWithFunctionProps(...proxiedFunctions)
                        .catch(
                            logComlinkError(
                                "DoenetEditor",
                                "renderEditorWithFunctionProps",
                            ),
                        );
                    // Record what we registered so the function-prop change
                    // effect below can detect later identity changes.
                    lastSentFunctionPropsRef.current = registeredFunctions;

                    // Make the remote available to the imperative handle and
                    // replay any actions queued before the iframe was ready.
                    editorIframeRef.current = editorIframe;
                    const queued = pendingActions.current.splice(0);
                    for (const action of queued) {
                        action(editorIframe);
                    }
                    syncIframeBodyBackground();
                }
            }
        };
        if (ref.current) {
            window.addEventListener("message", listener);
        }

        return () => {
            window.removeEventListener("message", listener);
        };
    }, []);

    // Only recompute `srcDoc` when something that genuinely requires a reload
    // changes: a new standalone bundle (e.g. autodetect-version fallback) or
    // freshly-accumulated initial diagnostics from that fallback path. Other
    // prop changes flow live through `updateEditorProps` below.
    const srcDoc = React.useMemo(() => {
        const baseProps = {
            ...initialIframePropsRef.current!.doenetEditorProps,
        };
        if (baseProps.initialDiagnostics) {
            baseProps.initialDiagnostics = [
                ...baseProps.initialDiagnostics,
                ...initialDiagnostics,
            ];
        } else {
            baseProps.initialDiagnostics = initialDiagnostics;
        }
        return createHtmlForDoenetEditor(
            id,
            initialIframePropsRef.current!.doenetML,
            initialIframePropsRef.current!.width,
            baseProps,
            standaloneUrl,
            cssUrl,
        );
    }, [id, standaloneUrl, cssUrl, initialDiagnostics]);

    // Build the serializable prop snapshot used both for change detection
    // (vs. last sent) and as the baseline of "what the iframe currently
    // believes." Function-typed entries are sent separately (via
    // updateEditorFunctionProps) and `doenetML` is excluded entirely
    // (initial-only — see initialIframePropsRef above). See
    // `serializePropsSnapshot` for the JSON-safety caveats.
    const propsSnapshotStr = serializePropsSnapshot(
        { width },
        doenetEditorProps,
    );

    // When `srcDoc` changes (autodetect-version fallback path), React updates
    // the iframe attribute and the browser reloads the iframe document. The
    // previous Comlink remote becomes bound to a torn-down `contentWindow`
    // until the new iframe sends `iframeReady`. Clear the remote synchronously
    // at commit so any imperative-handle calls between commit and the next
    // paint queue and replay against the new remote instead of dispatching
    // into a dead one. Also re-anchor the live-update snapshot refs to the
    // mount-time baseline that's about to be baked into the new srcDoc, so
    // the live-update effect can detect (and replay) any prop drift since
    // mount against the freshly-booted iframe. In the steady state `srcDoc`
    // is stable, so this effect is a no-op after the first commit.
    React.useLayoutEffect(() => {
        editorIframeRef.current = null;
        lastSentPropsSnapshotRef.current = serializePropsSnapshot(
            { width: initialIframePropsRef.current!.width },
            initialIframePropsRef.current!.doenetEditorProps,
        );
        // Function props re-register when the new iframe emits iframeReady
        // (the listener calls renderEditorWithFunctionProps with the latest
        // identities and re-populates this ref), so just clear it here.
        lastSentFunctionPropsRef.current = null;
    }, [srcDoc]);

    // Push serializable prop changes into the iframe without reloading.
    // Compares against the ref populated by the layoutEffect above (initial
    // mount: baseline equal to current → no push; later renders: ref reflects
    // last-sent state). `srcDoc` is in the dep list so a rebuild fires this
    // effect even when no prop changed, replaying any drift.
    React.useEffect(() => {
        if (lastSentPropsSnapshotRef.current === propsSnapshotStr) {
            return;
        }
        lastSentPropsSnapshotRef.current = propsSnapshotStr;
        const snapshot = JSON.parse(propsSnapshotStr);
        const action = (remote: EditorIframeRemote) => {
            remote
                .updateEditorProps(snapshot)
                .catch(logComlinkError("DoenetEditor", "updateEditorProps"));
        };
        if (editorIframeRef.current) {
            action(editorIframeRef.current);
        } else {
            pendingActions.current.push(action);
        }
    }, [propsSnapshotStr, srcDoc]);

    // Keep the iframe body's empty margin area aligned with live dark-mode
    // changes without reloading the editor document (which would discard
    // in-progress edits). iframeReady also re-syncs the body after any
    // srcDoc rebuild so mount-time darkMode doesn't leak back in.
    React.useEffect(() => {
        syncIframeBodyBackground();
    }, [doenetEditorProps.darkMode]);

    // Push function-prop identity changes into the iframe. We have no live
    // use case for this yet, but supporting it keeps callback semantics
    // matching the in-process `<DoenetEditor>` (where parents routinely pass
    // a fresh closure each render).
    //
    // Strategy: on each render, compare the current set of function-typed
    // props to the last set we registered. If keys or references differ,
    // re-proxy and resend *all* function props via `updateEditorFunctionProps`
    // — sending only the changed entries would be more efficient but adds
    // bookkeeping the iframe also has to mirror (e.g. handling removed
    // keys). Each `Comlink.proxy(fn)` allocates a MessagePort that isn't
    // explicitly released; relying on this for high-frequency callback
    // identity churn would leak ports over time.
    //
    // The initial set is registered at iframeReady (above) and recorded in
    // `lastSentFunctionPropsRef`; this effect only fires once that ref is
    // populated, so the first render is a no-op here.
    //
    // No deps array on purpose: change detection is by-hand identity
    // comparison against `lastSentFunctionPropsRef`, not React's shallow
    // dep diff. The effect fires every render and short-circuits when the
    // function set is unchanged.
    React.useEffect(() => {
        const prev = lastSentFunctionPropsRef.current;
        if (prev === null) {
            return;
        }
        const current: Record<string, Function> = {};
        for (const [key, val] of Object.entries(doenetEditorPropsRef.current)) {
            if (typeof val === "function") {
                current[key] = val;
            }
        }
        const prevKeys = Object.keys(prev);
        const currKeys = Object.keys(current);
        let changed = prevKeys.length !== currKeys.length;
        if (!changed) {
            for (const k of currKeys) {
                if (prev[k] !== current[k]) {
                    changed = true;
                    break;
                }
            }
        }
        if (!changed) {
            return;
        }
        lastSentFunctionPropsRef.current = current;
        const proxiedFunctions: (string | Function)[] = [];
        for (const [key, val] of Object.entries(current)) {
            proxiedFunctions.push(key);
            proxiedFunctions.push(Comlink.proxy(val));
        }
        const action = (remote: EditorIframeRemote) => {
            remote
                .updateEditorFunctionProps(...proxiedFunctions)
                .catch(
                    logComlinkError(
                        "DoenetEditor",
                        "updateEditorFunctionProps",
                    ),
                );
        };
        if (editorIframeRef.current) {
            action(editorIframeRef.current);
        } else {
            pendingActions.current.push(action);
        }
    });

    if (inErrorState) {
        if (foundAutoVersion) {
            setIgnoreDetectedVersion(true);
            setInErrorState("");
            let message = `DoenetML version ${detectedVersion} not found.`;
            if (!specifiedStandaloneUrl) {
                message += ` Falling back to version ${specifiedDoenetmlVersion ?? latestDoenetmlVersion}`;
            }

            // add line number to the doenetML range of the error
            let allNewlines = findAllNewlines(doenetML);
            Object.assign(
                detectedDoenetMLrange!,
                getLineCharRange(detectedDoenetMLrange!, allNewlines),
            );

            setInitialDiagnostics([
                { position: detectedDoenetMLrange!, message, type: "error" },
            ]);
            return null;
        }

        let errorIcon = (
            <MdError
                fontSize="24pt"
                color="#C1292E"
                style={{ verticalAlign: "middle", marginRight: "5px" }}
            />
        );
        return (
            <div
                style={{
                    fontSize: "1.3em",
                    marginLeft: "20px",
                    marginTop: "20px",
                    backgroundColor:
                        resolvedTheme === "dark"
                            ? "#7f1d1d"
                            : "hsl(0, 54%, 82%)",
                    color: resolvedTheme === "dark" ? "white" : "black",
                    borderWidth: 3,
                    borderStyle: "solid",
                    borderColor: "#c1292e",
                    padding: "0.5em",
                }}
            >
                {errorIcon} {inErrorState}
            </div>
        );
    }

    return (
        <React.Fragment>
            {addVirtualKeyboard ? (
                <ExternalVirtualKeyboard ownerRef={ref} theme={resolvedTheme} />
            ) : null}
            <iframe
                title="Doenet Editor"
                ref={ref}
                srcDoc={srcDoc}
                style={{
                    width,
                    boxSizing: "content-box",
                    overflow: "hidden",
                    border: "none",
                    height,
                }}
            />
        </React.Fragment>
    );
});
