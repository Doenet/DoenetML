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

/**
 * Render Doenet viewer constrained to an iframe. A URL pointing to a version of DoenetML
 * standalone must be provided (along with a URL to the corresponding CSS file).
 *
 * Parameters being passed to the underlying DoenetML component are passed via the `DoenetViewerProps` prop.
 * However, only serializable parameters may be passed. E.g., callbacks **cannot** be passed to the underlying
 * DoenetML component. Instead you must use the message passing interface of `DoenetViewer` to communicate
 * with the underlying DoenetML component.
 */
export function DoenetViewer({
    doenetML,
    standaloneUrl: specifiedStandaloneUrl,
    cssUrl: specifiedCssUrl,
    doenetmlVersion: specifiedDoenetmlVersion,
    autodetectVersion = true,
    ...doenetViewerProps
}: DoenetViewerIframeProps) {
    const [id, _] = React.useState(() => Math.random().toString(36).slice(2));
    const ref = React.useRef<HTMLIFrameElement>(null);
    const [height, setHeight] = React.useState("500px");
    const [inErrorState, setInErrorState] = React.useState<string | null>(null);
    const [ignoreDetectedVersion, setIgnoreDetectedVersion] =
        React.useState(false);
    const resolvedTheme = useResolvedTheme(
        doenetViewerProps.darkMode ?? "system",
    );

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

    React.useEffect(() => {
        const listener = (event: MessageEvent<IframeMessage>) => {
            if (event.origin !== window.location.origin) {
                return;
            }

            // forward response from SPLICE getState or requestSolutionView to iframe
            if (
                event.data.subject === "SPLICE.getState.response" ||
                event.data.subject === "SPLICE.requestSolutionView.response" ||
                event.data.subject == "SPLICE.submitAllAnswers"
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
                    const viewerIframe: Comlink.Remote<{
                        renderViewerWithFunctionProps: (
                            ...args: (string | Function)[]
                        ) => void;
                    }> = Comlink.wrap(
                        Comlink.windowEndpoint(ref.current.contentWindow!),
                    );

                    // Note that Comlink is unable to send proxied functions as an values of an object,
                    // but must be direct arguments of the function.
                    // To indicate the functions names, the arguments are a series of string key names
                    // followed by the proxied function with that name.
                    const proxiedFunctions: (string | Function)[] = [];
                    for (const [key, prop] of Object.entries(
                        doenetViewerProps,
                    )) {
                        if (typeof prop === "function") {
                            proxiedFunctions.push(key);
                            proxiedFunctions.push(Comlink.proxy(prop));
                        }
                    }
                    viewerIframe?.renderViewerWithFunctionProps(
                        ...proxiedFunctions,
                    );
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
                srcDoc={createHtmlForDoenetViewer(
                    id,
                    doenetML,
                    doenetViewerProps,
                    standaloneUrl,
                    cssUrl,
                )}
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

// ComLink RPC calls return Promises, but the imperative handle methods are
// `void` (matching the in-process handle so consumers can use one type for
// both). Attach an explicit catch handler so we don't leave the Promise
// unhandled — surface errors via console rather than swallowing them.
function logComlinkError(method: string) {
    return (err: unknown) => {
        console.warn(`iframe DoenetEditor: ${method} failed`, err);
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

    React.useImperativeHandle(
        forwardedRef,
        () => ({
            openDiagnosticsTab(tabId: DiagnosticsTabId) {
                const action = (remote: EditorIframeRemote) => {
                    remote
                        .openDiagnosticsTab(tabId)
                        .catch(logComlinkError("openDiagnosticsTab"));
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
                        .catch(logComlinkError("closeDiagnosticsPanel"));
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
                        .catch(logComlinkError("updateRenderedView"));
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
                            logComlinkError("renderEditorWithFunctionProps"),
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
                .catch(logComlinkError("updateEditorProps"));
        };
        if (editorIframeRef.current) {
            action(editorIframeRef.current);
        } else {
            pendingActions.current.push(action);
        }
    }, [propsSnapshotStr, srcDoc]);

    // Keep the iframe body's empty margin area aligned with live dark-mode
    // changes without reloading the editor document (which would discard
    // in-progress edits). Fresh srcDoc content already includes the correct
    // initial body background.
    React.useEffect(() => {
        const body = ref.current?.contentDocument?.body;
        if (body) {
            setIframeBodyBackground(body, doenetEditorProps.darkMode);
        }
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
                .catch(logComlinkError("updateEditorFunctionProps"));
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
