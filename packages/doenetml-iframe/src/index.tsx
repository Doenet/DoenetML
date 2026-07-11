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
    // last received.
    //
    // Change detection uses `JSON.stringify`, which assumes supported props
    // are JSON-safe (scalars, plain arrays/objects). `undefined` values are
    // dropped, `Date`/`Map`/`Set` are normalized to strings/empty objects,
    // and key reordering produces spurious diffs. If a new prop with an
    // exotic value type is added later, prefer a structural comparator over
    // expanding what this serializer handles.
    const propsForUpdate: Record<string, any> = { doenetML };
    for (const [key, val] of Object.entries(doenetViewerProps)) {
        if (typeof val !== "function") {
            propsForUpdate[key] = val;
        }
    }
    const propsSnapshotStr = JSON.stringify(propsForUpdate);

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
    const srcDoc = React.useMemo(
        () =>
            createHtmlForDoenetViewer(
                id,
                doenetMLRef.current,
                doenetViewerPropsRef.current,
                standaloneUrl,
                cssUrl,
                useSharedCoreWorker,
            ),
        [id, standaloneUrl, cssUrl, useSharedCoreWorker, legacyReloadKey],
    );

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
        const baselineProps: Record<string, any> = {
            doenetML: doenetMLRef.current,
        };
        for (const [key, val] of Object.entries(doenetViewerPropsRef.current)) {
            if (typeof val !== "function") {
                baselineProps[key] = val;
            }
        }
        lastSentPropsSnapshotRef.current = JSON.stringify(baselineProps);
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
                            proxiedFunctions.push(Comlink.proxy(prop));
                        }
                    }
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
        if (ref.current) {
            window.addEventListener("message", listener);
        }

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
    // function-prop effect above — see that comment block for the full
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
            proxiedFunctions.push(Comlink.proxy(val));
        }
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

    return (
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
    // believes." Drop function-typed entries (sent separately via
    // updateEditorFunctionProps) and drop `doenetML` (initial-only — see
    // initialIframePropsRef above).
    //
    // Change detection uses `JSON.stringify`, which assumes supported props
    // are JSON-safe (scalars, plain arrays/objects). `undefined` values are
    // dropped, `Date`/`Map`/`Set` are normalized to strings/empty objects,
    // and key reordering produces spurious diffs. If a new prop with an
    // exotic value type is added later, prefer a structural comparator over
    // expanding what this serializer handles.
    const propsForUpdate: Record<string, any> = { width };
    for (const [key, val] of Object.entries(doenetEditorProps)) {
        if (typeof val !== "function") {
            propsForUpdate[key] = val;
        }
    }
    const propsSnapshotStr = JSON.stringify(propsForUpdate);

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
        const baselineProps: Record<string, any> = {
            width: initialIframePropsRef.current!.width,
        };
        for (const [key, val] of Object.entries(
            initialIframePropsRef.current!.doenetEditorProps,
        )) {
            if (typeof val !== "function") {
                baselineProps[key] = val;
            }
        }
        lastSentPropsSnapshotRef.current = JSON.stringify(baselineProps);
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
