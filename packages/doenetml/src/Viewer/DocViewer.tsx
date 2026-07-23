import React, {
    createContext,
    ErrorInfo,
    ReactElement,
    ReactNode,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { nanoid } from "nanoid";
import {
    serializedComponentsReplacer,
    serializedComponentsReviver,
    data_format_version,
    cidFromText,
} from "@doenet/utils";
import type { DiagnosticRecord } from "@doenet/utils";
import * as Comlink from "comlink";

import { MdError } from "react-icons/md";
import { get as idb_get } from "idb-keyval";
import { createCoreWorker, initializeCoreWorker } from "../utils/docUtils";
import type { CoreWorker } from "@doenet/doenetml-worker";
import { DoenetMLFlags } from "../doenetml";
import { Remote } from "comlink";
import {
    actionIdentifier,
    mainThunks,
    UniqueActionIdentifier,
    useAppDispatch,
} from "../state";
import { renderersLoadComponent } from "./renderersLoadComponent";
import { doenetGlobalConfig } from "../global-config";
import {
    withTimeout,
    disposeCoreWorker,
    DEFAULT_CORE_BOOT_MAX_ATTEMPTS,
    DEFAULT_CORE_HANDSHAKE_WATCHDOG_MS,
    CORE_BOOT_RETRY_DELAY_MS,
    CORE_START_FAILED_MESSAGE,
} from "./coreWorkerBoot";
import type { ResolvedTheme } from "../utils/theme";

// Re-export for back-compat: `renderersLoadComponent` was previously defined
// here, and external consumers may deep-import it from
// `@doenet/doenetml/Viewer/DocViewer` via the package's `./*` exports map.
export { renderersLoadComponent } from "./renderersLoadComponent";

export type SourcePosition = {
    start: { line: number; column: number; offset: number };
    end: { line: number; column: number; offset: number };
};

/** Whether `inner`'s source range lies entirely within `outer`'s. */
function containsRange(outer: SourcePosition, inner: SourcePosition): boolean {
    return (
        inner.start.offset >= outer.start.offset &&
        inner.end.offset <= outer.end.offset
    );
}

export const DocContext = createContext<{
    doenetViewerUrl?: string;
    doenetImagesUrl?: string;
    darkMode?: ResolvedTheme;
    showAnswerResponseButton?: boolean;
    answerResponseCounts?: Record<string, number>;
    /**
     * Called by in-graph renderers when a JSXGraph element handled a
     * pointer-up: with the element's DOM id (and its board's DOM id, for
     * copy attribution) for a genuine click — navigate to its source — or
     * `null` for a drag release (no navigation). Either way the viewer's
     * own delegated click listener skips the native click that follows,
     * so the graph-level fallback doesn't fire on top.
     */
    reportGraphElementUp?: (domId: string | null, graphDomId?: string) => void;
}>({});

export function DocViewer({
    doenetML,
    userId,
    activityId = "a",
    docId = "1",
    render = true,
    hidden = false,
    attemptNumber = 1,
    forceDisable = false,
    forceShowCorrectness = false,
    forceShowSolution = false,
    forceUnsuppressCheckWork = false,
    generatedVariantCallback,
    flags,
    requestedVariantIndex,
    initialState,
    setDiagnosticsCallback,
    reportScoreAndStateCallback: specifiedReportScoreAndStateCallback,
    documentStructureCallback,
    initializedCallback,
    setIsInErrorState,
    prefixForIds = "",
    doenetViewerUrl,
    doenetImagesUrl,
    darkMode,
    showAnswerResponseButton = false,
    answerResponseCounts = {},
    initializeCounters: prescribedInitializeCounters = {},
    fetchExternalDoenetML,
    requestScrollTo,
    onSourcePositionClick,
    scrollToSourceOffset,
}: {
    doenetML: string;
    userId?: string;
    activityId?: string;
    docId?: string;
    render?: boolean;
    hidden?: boolean;
    attemptNumber?: number;
    forceDisable?: boolean;
    forceShowCorrectness?: boolean;
    forceShowSolution?: boolean;
    forceUnsuppressCheckWork?: boolean;
    generatedVariantCallback?: Function;
    flags: DoenetMLFlags;
    requestedVariantIndex: number;
    initialState?: Record<string, any> | null;
    setDiagnosticsCallback?: (
        diagnostics: DiagnosticRecord[],
        source: string,
    ) => void;
    reportScoreAndStateCallback?: (data: {
        score: number;
        state: unknown;
        activityId: string;
        docId: string;
    }) => void;
    documentStructureCallback?: Function;
    initializedCallback?: Function;
    setIsInErrorState?: Function;
    prefixForIds?: string;
    doenetViewerUrl?: string;
    doenetImagesUrl?: string;
    darkMode?: ResolvedTheme;
    showAnswerResponseButton?: boolean;
    answerResponseCounts?: Record<string, number>;
    initializeCounters?: Record<string, number>;
    fetchExternalDoenetML?: (arg: string) => Promise<string>;
    requestScrollTo?: (offset: number) => void;
    onSourcePositionClick?: (position: SourcePosition) => void;
    scrollToSourceOffset?: number | null;
}) {
    // Sometimes components eagerly update before waiting for core to determine their exact state
    // This map from event ids to event values helps keep track of the updates that need to be ignored
    // so we don't clobber the component's state.
    const updatesToIgnoreRef = useRef<Map<UniqueActionIdentifier, string>>(
        new Map(),
    );
    const dispatch = useAppDispatch();

    // Maps a rendered element's DOM id (prefixForIds + renderer id) to its
    // source position, so a click anywhere in the preview can be traced
    // back to a location in the original DoenetML. Populated as renderer
    // instructions stream in from the core; not stored in Redux since it
    // doesn't need to trigger re-renders.
    const positionByDomId = useRef<Map<string, SourcePosition>>(new Map());
    const viewerContainerRef = useRef<HTMLDivElement>(null);
    const lastScrolledSourceOffset = useRef<number | null>(null);

    // Whenever the host asks for a specific source offset (e.g. the
    // editor's cursor moved), scroll a matching rendered element into
    // view. The rule: find the innermost mapped element containing the
    // offset (the "container" — implicitly the whole document when none
    // does), then prefer the nearest mapped element inside the container
    // that starts after the offset, then the nearest one ending before
    // it, then the container itself. Offsets with no mapped element of
    // their own (whitespace between siblings, or inside a composite like
    // <group> that produces no renderer instruction) thus resolve to a
    // nearby sibling — the same way whether the container is a component
    // like <section> or the document itself — rather than centering a
    // possibly-huge container.
    //
    // Placed here, before this component's several early `return null`
    // paths further down, so it's called unconditionally on every render
    // (skipping it on some renders but not others would violate the Rules
    // of Hooks).
    useEffect(() => {
        if (scrollToSourceOffset == null) {
            return;
        }
        if (lastScrolledSourceOffset.current === scrollToSourceOffset) {
            return;
        }
        lastScrolledSourceOffset.current = scrollToSourceOffset;

        // Resolve a candidate id to its element, scoped to this viewer.
        // Within a document's lifetime `positionByDomId` is only ever added
        // to (it's cleared only when the document itself resets), so it can
        // hold stale entries — ids from renderer instructions whose
        // components are no longer rendered (e.g. hidden or removed by an
        // update) — and a candidate only counts if its element is actually
        // present. Checked lazily, only when a candidate would become the
        // new best, so most entries never incur a DOM lookup.
        function renderedElement(id: string): Element | null {
            return (
                viewerContainerRef.current?.querySelector(
                    `#${CSS.escape(id)}`,
                ) ?? null
            );
        }

        // Pass 1: the container — the element with the smallest source
        // range containing the offset, or implicitly the whole document
        // when none does.
        let containerEl: Element | null = null;
        let containerStart = -Infinity;
        let containerEnd = Infinity;
        let containerSize = Infinity;
        for (const [id, position] of positionByDomId.current) {
            const { offset: start } = position.start;
            const { offset: end } = position.end;
            if (
                start <= scrollToSourceOffset &&
                scrollToSourceOffset <= end &&
                end - start < containerSize
            ) {
                const el = renderedElement(id);
                if (el) {
                    containerEl = el;
                    containerStart = start;
                    containerEnd = end;
                    containerSize = end - start;
                }
            }
        }

        // Pass 2: gap candidates — elements within the container's range
        // (none of them can contain the offset, or pass 1 would have made
        // them the container). Prefer the nearest one starting after the
        // offset: unmapped source between siblings renders between them,
        // so the following sibling is the right neighborhood.
        let followingEl: Element | null = null;
        let followingStart = Infinity;
        let precedingEl: Element | null = null;
        let precedingEnd = -Infinity;
        for (const [id, position] of positionByDomId.current) {
            const { offset: start } = position.start;
            const { offset: end } = position.end;
            if (start < containerStart || end > containerEnd) {
                continue;
            }
            if (start > scrollToSourceOffset && start < followingStart) {
                const el = renderedElement(id);
                if (el) {
                    followingEl = el;
                    followingStart = start;
                }
            } else if (end < scrollToSourceOffset && end > precedingEnd) {
                const el = renderedElement(id);
                if (el) {
                    precedingEl = el;
                    precedingEnd = end;
                }
            }
        }

        const target = followingEl ?? precedingEl ?? containerEl;
        if (!target) {
            return;
        }

        // Graphical components (e.g. a vector inside a graph) render only
        // an empty anchor span — the visible drawing lives on the shared
        // canvas — so centering the anchor itself can leave the graph cut
        // off. Walk up to the nearest ancestor with real extent.
        let el: Element = target;
        while (
            el !== viewerContainerRef.current &&
            el.parentElement &&
            el.getBoundingClientRect().height === 0
        ) {
            el = el.parentElement;
        }

        // Find the viewport of the nearest scrollable ancestor (falling
        // back to the window) so we can tell how far centering would move
        // the element.
        let viewportTop = 0;
        let viewportHeight = window.innerHeight;
        for (let a = el.parentElement; a; a = a.parentElement) {
            const style = window.getComputedStyle(a);
            if (
                /(auto|scroll|overlay)/.test(style.overflowY) &&
                a.scrollHeight > a.clientHeight
            ) {
                viewportTop = a.getBoundingClientRect().top;
                viewportHeight = a.clientHeight;
                break;
            }
        }

        // Skip the scroll when centering would move the element less than
        // ~5% of the viewport height: tiny corrective nudges (e.g.
        // re-centering the enclosing <p> after one of its children) are
        // more distracting than useful.
        const rect = el.getBoundingClientRect();
        const currentCenter = rect.top + rect.height / 2;
        const targetCenter = viewportTop + viewportHeight / 2;
        if (Math.abs(currentCenter - targetCenter) < 0.05 * viewportHeight) {
            return;
        }

        el.scrollIntoView({ block: "center" });
    }, [scrollToSourceOffset]);

    // Set when an in-graph JSXGraph element already handled the current
    // pointer interaction (element-level navigation, or a drag release):
    // the native click that follows the pointer-up must not also trigger
    // the graph-level fallback navigation. Cleared at the start of every
    // pointer interaction so a report whose click never arrives (e.g. the
    // pointer was released outside the board) can't suppress a later,
    // unrelated click.
    const skipNextClickNavigation = useRef(false);

    const onSourcePositionClickRef = useRef(onSourcePositionClick);
    onSourcePositionClickRef.current = onSourcePositionClick;

    // Stable identity so JSXGraph event handlers — registered once per
    // element creation with whatever closure the renderer had at the time —
    // never hold a stale version.
    const reportGraphElementUp = useCallback(
        (domId: string | null, graphDomId?: string) => {
            if (domId == null) {
                // Drag release: suppress the native click without navigating.
                skipNextClickNavigation.current = true;
                return;
            }
            let position = positionByDomId.current.get(domId);
            if (!position) {
                // No recorded source position (e.g. a component created at
                // runtime by an `addChildren` action): leave the native click
                // alone so it falls back to the enclosing graph.
                return;
            }
            // A component whose source range lies outside its rendering
            // graph's range wasn't authored there — it was brought in by
            // whatever authored the graph (a copy like `$g` or
            // `<graph extend="$g">`). Navigate to that, not to the copied
            // component's original definition. Directly authored children
            // (including inside `<graph extend>`) and `<repeat>` templates
            // are contained in their graph's range and unaffected.
            const graphPosition = graphDomId
                ? positionByDomId.current.get(graphDomId)
                : undefined;
            if (graphPosition && !containsRange(graphPosition, position)) {
                position = graphPosition;
            }
            skipNextClickNavigation.current = true;
            onSourcePositionClickRef.current?.(position);
        },
        [],
    );

    // Delegated click-to-navigate listener, attached natively in the
    // CAPTURE phase: JSXGraph's own click handler on a graph's board div
    // calls `stopPropagation()` unconditionally, so a bubble-phase
    // listener (like React's `onClick`) never hears clicks on a graph.
    // Capture runs top-down before the board can stop the event, and we
    // neither stop nor prevent anything ourselves, so JSXGraph's behavior
    // is unaffected. Re-attached every render (no dependency array) so it
    // is in place whenever the container div exists and always sees the
    // current `onSourcePositionClick`.
    useEffect(() => {
        const container = viewerContainerRef.current;
        if (!container) {
            return;
        }
        function handleViewerPointerDown() {
            skipNextClickNavigation.current = false;
        }
        container.addEventListener("click", handleViewerClick, true);
        container.addEventListener(
            "pointerdown",
            handleViewerPointerDown,
            true,
        );
        return () => {
            container.removeEventListener("click", handleViewerClick, true);
            container.removeEventListener(
                "pointerdown",
                handleViewerPointerDown,
                true,
            );
        };
    });

    const [errMsg, setErrMsg] = useState<string | null>(null);

    const cid = useRef<string | null>(null);
    const lastDoenetML = useRef<string | null>(null);
    const lastActivityId = useRef<string | null>(null);
    const lastDocId = useRef<string | null>(null);
    const lastAttemptNumber = useRef<number | null>(null);
    const lastRequestedVariantIndex = useRef<number | null>(null);

    const [stage, setStage] = useState<
        | "initial"
        | "readyToCreateCore"
        | "coreCreated"
        | "wait"
        | "waitingOnCore"
    >("initial");

    const [documentRenderer, setDocumentRenderer] =
        useState<ReactElement | null>(null);

    const initialCoreData = useRef<{
        coreState: Record<string, any>;
        requestedVariant: Record<string, any>;
    } | null>(null);

    const initializeCounters = useRef<Record<string, number>>(
        prescribedInitializeCounters,
    );
    useEffect(() => {
        initializeCounters.current = prescribedInitializeCounters;
    }, [prescribedInitializeCounters]);

    const rendererClasses = useRef<Record<string, any>>({});
    const coreInfo = useRef<Record<string, any> | null>(null);
    const loadedInitialRendererState = useRef(false);
    const coreCreated = useRef(false);
    const coreCreationInProgress = useRef(false);
    const coreId = useRef<string>("");
    const diagnostics = useRef<DiagnosticRecord[]>([]);
    const [hasInitialError, setHasInitialError] = useState(false);

    type DeferredCoreAction = {
        actionName: string;
        componentIdx: number | undefined;
        args: Record<string, any>;
    };

    // Actions queued while a new core is still booting. Always clear this
    // queue after handing its contents off so entries from an earlier core
    // lifetime cannot leak into a later reinitialization.
    const actionsBeforeCoreCreated = useRef<DeferredCoreAction[]>([]);

    const preventMoreAnimations = useRef(false);
    const animationInfo = useRef<
        Record<string, { animationFrameID?: number; timeoutId?: number }>
    >({});

    const onActionCallbacks = useRef(
        new Map<string, (value: boolean) => void>(),
    );
    const lastSkippableAction = useRef<{
        action: { actionName: string; componentIdx?: number };
        args: Record<string, any>;
        baseVariableValue?: any;
        componentIdx?: number;
        rendererType?: string;
        promiseResolve?: (value: any) => void;
    } | null>(null);

    const messageIdFromGetState = useRef<string | null>(null);

    // Promises representing outstanding requests to view the solution.
    // Keyed by the messageId of the SPLICE message requesting the solution view.
    const requestSolutionViewPromises = useRef<
        Record<
            string,
            {
                resolve: (value: { allowView: boolean }) => void;
                reject: (value: unknown) => void;
            }
        >
    >({});

    const errorInitializingRenderers = useRef(false);
    const errorInsideRenderers = useRef(false);

    const [ignoreRendererError, setIgnoreRendererError] = useState(false);

    const coreWorker = useRef<Remote<CoreWorker> | null>(null);
    // Kill switch for the same core `coreWorker` wraps, kept so a wedged
    // core can be force-released even when its Comlink `terminate()` would
    // itself hang on the stuck queue (Doenet/DoenetApps#2957). Natively
    // terminates a dedicated worker; on a shared host worker (#1466) it
    // destroys just this core. Set and cleared in lockstep with `coreWorker`
    // (always via `attachNewCoreWorker`/`teardownCurrentCoreWorker`).
    const coreWorkerKill = useRef<((suspectWedge?: boolean) => void) | null>(
        null,
    );

    // Spin up a fresh core worker and store its Comlink remote and kill
    // switch in lockstep. Returns the remote for the caller to drive.
    function attachNewCoreWorker(): Remote<CoreWorker> {
        const { remote, kill } = createCoreWorker();
        coreWorker.current = remote;
        coreWorkerKill.current = kill;
        return remote;
    }

    // Tear down whatever core the refs currently point at and clear them
    // (keeping the two refs in lockstep). Refs are cleared up front so a
    // core that's being terminated is never reachable mid-teardown; the
    // returned promise settles once `disposeCoreWorker` has finished, for
    // callers that need to await the teardown before swapping in a replacement.
    function teardownCurrentCoreWorker({ graceful }: { graceful: boolean }) {
        const remote = coreWorker.current;
        const kill = coreWorkerKill.current;
        coreWorker.current = null;
        coreWorkerKill.current = null;
        return disposeCoreWorker(remote, kill, { graceful });
    }

    function clearDeferredCoreActions() {
        actionsBeforeCoreCreated.current = [];
    }

    function takeDeferredCoreActions() {
        const pendingActions = actionsBeforeCoreCreated.current;
        clearDeferredCoreActions();
        return pendingActions;
    }

    const contextForRenderers = {
        doenetViewerUrl,
        doenetImagesUrl,
        darkMode,
        showAnswerResponseButton,
        answerResponseCounts,
        reportGraphElementUp,
    };

    useEffect(() => {
        return () => {
            // Best-effort graceful terminate, but always guarantee a native
            // kill so a wedged worker (whose Comlink terminate would hang) is
            // still released on unmount (Doenet/DoenetApps#2957).
            // `disposeCoreWorker` already swallows its own errors; the
            // `.catch` is here so this fire-and-forget call can't surface an
            // unhandled rejection if that ever changes (AGENTS.md: no
            // fire-and-forget promises).
            teardownCurrentCoreWorker({ graceful: true }).catch((e) => {
                console.warn("DocViewer: core worker teardown failed", e);
            });
            coreCreated.current = false;
        };
    }, []);

    useEffect(() => {
        const listener = async function (e: MessageEvent) {
            if (
                e.origin !== window.location.origin &&
                e.origin !== window.parent.location.origin
            ) {
                return;
            }
            if (typeof e.data !== "object") {
                return;
            }
            if (e.data.subject === "SPLICE.getState.response") {
                if (messageIdFromGetState.current === e.data.message_id) {
                    if (e.data.state && e.data.state.cid === cid.current) {
                        // Reset error messages, core.
                        // Then process loaded state and initialize

                        if (errMsg !== null) {
                            setErrMsg(null);
                            setIsInErrorState?.(false);
                        }

                        coreId.current = nanoid();
                        initialCoreData.current = null;
                        coreInfo.current = null;
                        setDocumentRenderer(null);
                        coreCreated.current = false;
                        coreCreationInProgress.current = false;
                        loadedInitialRendererState.current = false;

                        processLoadedDocState(e.data.state);

                        if (render) {
                            startCoreSafely();
                        } else {
                            setStage("readyToCreateCore");
                        }
                    }
                } else if (e.data.error) {
                    const error = e.data.error;
                    setIsInErrorState?.(true);
                    if (
                        typeof error === "object" &&
                        "code" in error &&
                        "message" in error
                    ) {
                        console.log(
                            `error ${error.code} getting state: ${error.message}`,
                        );
                        setErrMsg(error.message);
                    } else {
                        setErrMsg("Invalid response to getState");
                    }
                }
            } else if (
                e.data.subject === "SPLICE.requestSolutionView.response"
            ) {
                let promiseInfo =
                    requestSolutionViewPromises.current[e.data.messageId];
                if (!promiseInfo) {
                    return;
                }

                promiseInfo.resolve({ allowView: e.data.allowView === true });
            } else if (e.data.subject === "SPLICE.submitAllAnswers") {
                if (coreInfo.current) {
                    const actionResult = await callAction({
                        action: {
                            actionName: "submitAllAnswers",
                            componentIdx:
                                coreInfo.current.documentToRender.componentIdx,
                        },
                        args: {},
                    });

                    const message = {
                        subject: "SPLICE.submitAllAnswers.response",
                        success: actionResult,
                    };

                    if (flags.messageParent && window.parent) {
                        window.parent.postMessage(message);
                    } else {
                        window.postMessage(message);
                    }
                }
            } else if (e.data.subject === "SPLICE.flushState") {
                // Flush-state-on-demand (Doenet/DoenetML#1440): settle in-flight
                // updates and push any pending state through the normal
                // `SPLICE.reportScoreAndState` pipeline, then send this
                // stateless acknowledgement. A persistence host (e.g. Runestone)
                // saves the resulting `reportScoreAndState` exactly as it does a
                // routine autosave — it need not know a flush occurred. This
                // response is the completion signal a lifecycle coordinator
                // (e.g. a PreTeXt page unmounting an off-screen viewer) waits
                // for: once it arrives, tearing the viewer down loses nothing.
                //
                // `hadState: false` means the viewer held no state beyond what
                // it was initialized with (e.g. its core was never created), so
                // unmounting is equally safe.
                const message: Record<string, unknown> = {
                    subject: "SPLICE.flushState.response",
                    activity_id: activityId,
                    doc_id: docId,
                    message_id: e.data.message_id,
                    success: true,
                    hadState: false,
                };
                if (coreCreated.current && coreWorker.current) {
                    try {
                        message.hadState =
                            await coreWorker.current.flushState();
                    } catch (err) {
                        console.warn("DocViewer: flushState failed", err);
                        message.success = false;
                    }
                }

                if (flags.messageParent && window.parent) {
                    window.parent.postMessage(message);
                } else {
                    window.postMessage(message);
                }
            }
        };

        window.addEventListener("message", listener);

        return () => {
            window.removeEventListener("message", listener);
        };
    }, []);

    useEffect(() => {
        if (!coreWorker.current) {
            return;
        }
        if (docId !== null) {
            const postfixForWindowFunctions =
                prefixForIds
                    .replaceAll("::", "")
                    .replaceAll(":", "_")
                    .replaceAll(".", "_")
                    .replaceAll("-", "_") || "1";

            (window as any)[
                "returnAllStateVariables" + postfixForWindowFunctions
            ] = async function () {
                const allStateVariables =
                    await coreWorker.current?.returnAllStateVariables(true);
                console.log(allStateVariables);
                return allStateVariables;
            };

            (window as any)["returnDiagnostics" + postfixForWindowFunctions] =
                function () {
                    return diagnostics.current;
                };

            (window as any)["callAction" + postfixForWindowFunctions] =
                async function ({
                    actionName,
                    componentIdx,
                    args,
                }: {
                    actionName: string;
                    componentIdx: number;
                    args: Record<string, any>;
                }) {
                    return await callAction({
                        action: { actionName, componentIdx },
                        args,
                    });
                };

            (window as any)["resolvePath" + postfixForWindowFunctions] =
                async function (name: string, origin = 0) {
                    if (coreWorker.current) {
                        return await coreWorker.current.resolvePathJavascript(
                            name,
                            origin,
                        );
                    } else {
                        console.error("No core worker present");
                        return -1;
                    }
                };
        }
    }, [docId, coreWorker.current, prefixForIds]);

    useEffect(() => {
        return () => {
            preventMoreAnimations.current = true;
            for (let id in animationInfo.current) {
                cancelAnimationFrame(id);
            }
            animationInfo.current = {};
        };
    }, []);

    useEffect(() => {
        if (!coreWorker.current) {
            return;
        }

        // Based on the "visibilityChange" event from the browser,
        // start or stop the tracking of the visibility of DoenetML components
        function documentVisibilityListener() {
            coreWorker.current?.handleVisibilityChange(
                document.visibilityState === "visible",
            );
        }

        document.addEventListener(
            "visibilitychange",
            documentVisibilityListener,
        );

        return () => {
            document.removeEventListener(
                "visibilitychange",
                documentVisibilityListener,
            );
        };
    }, [coreWorker.current]);

    useEffect(() => {
        callAction({
            action: { actionName: "setTheme" },
            args: { theme: darkMode, doNotIgnore: true },
        });
    }, [darkMode]);

    async function reinitializeCoreAndTerminateAnimations() {
        if (coreWorker.current !== null) {
            preventMoreAnimations.current = true;
            // Bounded graceful terminate + guaranteed native kill, so swapping
            // in a fresh worker can't hang on a wedged predecessor
            // (Doenet/DoenetApps#2957).
            await teardownCurrentCoreWorker({ graceful: true });
            clearDeferredCoreActions();
            for (let id in animationInfo.current) {
                cancelAnimationFrame(id);
            }
            animationInfo.current = {};
        }

        const remote = attachNewCoreWorker();

        coreCreated.current = false;
        coreCreationInProgress.current = false;

        await initializeCoreWorker({
            coreWorker: remote,
            doenetML,
            flags,
            activityId,
            docId,
            requestedVariantIndex,
            attemptNumber,
            documentStructureCallback,
            fetchExternalDoenetML,
        });

        return remote;
    }

    function callAction({
        action,
        args,
        baseVariableValue,
        componentIdx,
        rendererType,
        promiseResolve,
    }: {
        action: { actionName: string; componentIdx?: number };
        args: Record<string, any>;
        baseVariableValue?: any;
        componentIdx?: number;
        rendererType?: string;
        promiseResolve?: (value: any) => void;
    }) {
        // Note: the reason we check both the renderer class and .type
        // is that if the renderer was memoized, then the renderer class itself is on .type,
        // Otherwise, the renderer class is the value of the rendererClasses entry.
        let ignoreActionsWithoutCore =
            rendererClasses.current[rendererType ?? ""]
                ?.ignoreActionsWithoutCore ||
            rendererClasses.current[rendererType ?? ""]?.type
                ?.ignoreActionsWithoutCore;
        if (
            !coreCreated.current &&
            (ignoreActionsWithoutCore?.(action.actionName) ||
                !coreCreationInProgress.current) &&
            !args?.doNotIgnore
        ) {
            // The action is being skipped because core has not been created
            // and either the action must be ignored without core or core isn't actually
            // in the process of being created (relevant case is that core has been terminated).
            // Also, don't ignore if the doNotIgnore argument has been set
            // (used for actions called directly from DocViewer for initialization)

            if (promiseResolve) {
                // if were given promiseResolve, then action was called from resolveAction
                // where the return value is being ignored.
                // Resolve promise as false as action will be skipped
                promiseResolve(false);
                return;
            } else {
                // Action was called normally where it is expecting a promise to be returned.
                // A promise resolved as false indicates action was skipped.
                return Promise.resolve(false);
            }
        }

        if (lastSkippableAction.current) {
            // we are for sure skipping the lastSkippableAction,
            // so resolve its promise as false
            lastSkippableAction.current.promiseResolve?.(false);
            lastSkippableAction.current = null;
        }

        if (args?.skippable) {
            if (onActionCallbacks.current.size > 0) {
                // Since another action is currently in progress,
                // we will (at least initially) skip this skippable action.
                // If the currently running action is resolved while this action
                // is still the last skipped action, then this action might be executed.

                // If promiseResolve is undefined, then it's the original call of this action.
                // Create a promise that will be returned.
                // It will be resolved with false when this action is definitely skipped,
                // or it will be resolved with true if this action ends up being executed.
                let newPromise;
                if (!promiseResolve) {
                    newPromise = new Promise((resolve, reject) => {
                        promiseResolve = resolve;
                    });
                }

                lastSkippableAction.current = {
                    action,
                    args,
                    baseVariableValue,
                    componentIdx,
                    rendererType,
                    promiseResolve,
                };

                if (newPromise) {
                    return newPromise;
                } else {
                    // if we don't have a newPromise, that means that we were given a promiseResolve
                    // as an argument to callAction,
                    // which happens when we are being called from within resolveAction
                    // and the return value is ignored
                    return;
                }
            }
        }

        // If we made it here, then we're definitely going to call the action
        // (though if core isn't created yet, we might queue it to be called once core is created)

        let actionId = nanoid();
        args = { ...args };
        args.actionId = actionId;

        if (baseVariableValue !== undefined && componentIdx != null) {
            // Update the bookkeeping variables for the optimistic UI that will tell the renderer
            // whether or not to ignore the information core sends when it finishes the action
            updatesToIgnoreRef.current.set(
                actionIdentifier(actionId, componentIdx),
                baseVariableValue,
            );
        }

        let actionArgs = {
            actionName: action.actionName,
            componentIdx: action.componentIdx,
            args,
        };

        executeAction(actionArgs).catch((e) => {
            console.warn("DocViewer: executeAction failed", e);
        });

        if (promiseResolve) {
            // If we were sent promiseResolve as an argument,
            // then the promise for this action has already been returned to the original caller
            // and we are just being called inside resolveAction
            // (where the return is being ignored).
            // Simply set it up so that promiseResolve will be called when the action is resolved
            onActionCallbacks.current.set(actionId, promiseResolve);
            return;
        } else {
            return new Promise((resolve, reject) => {
                onActionCallbacks.current.set(actionId, resolve);
            });
        }
    }

    async function executeAction(actionArgs: DeferredCoreAction) {
        if (!coreCreated.current) {
            // If core has not yet been created,
            // queue the action to be sent once core is created
            actionsBeforeCoreCreated.current.push(actionArgs);
            return;
        }

        // Note: it is possible that core has been terminated, so we need the question mark.
        // If the dispatch rejects or the worker is absent (optional chaining returns
        // undefined), settle the pending callAction promise as false so it does not hang
        // and so lastSkippableAction can be released.
        let actionResult;
        try {
            actionResult =
                await coreWorker.current?.dispatchActionJavascript(actionArgs);
        } catch (e) {
            console.warn("DocViewer: dispatchActionJavascript failed", e);
            resolveAction({
                actionId: actionArgs.args?.actionId,
                success: false,
            });
            return;
        }

        if (actionResult) {
            resolveAction(actionResult);
        } else {
            // coreWorker.current was null/undefined — optional chaining returned
            // undefined, which is not a throw. Settle the callback as false so the
            // callAction promise does not hang.
            resolveAction({
                actionId: actionArgs.args?.actionId,
                success: false,
            });
        }
    }

    function forceRendererState({
        rendererState,
        forceDisable,
        forceShowCorrectness,
        forceShowSolution,
        forceUnsuppressCheckWork,
    }: {
        rendererState: Record<string, Record<string, any>>;
        forceDisable: boolean;
        forceShowCorrectness: boolean;
        forceShowSolution: boolean;
        forceUnsuppressCheckWork: boolean;
    }) {
        for (let componentIdx in rendererState) {
            let stateValues = rendererState[componentIdx].stateValues;
            if (forceDisable && stateValues.disabled === false) {
                stateValues.disabled = true;
            }
            if (forceShowCorrectness && stateValues.showCorrectness === false) {
                stateValues.showCorrectness = true;
            }
            if (
                forceUnsuppressCheckWork &&
                stateValues.suppressCheckWork === true
            ) {
                stateValues.suppressCheckWork = false;
            }
            if (
                forceShowSolution &&
                rendererState[componentIdx].childrenInstructions?.length > 0
            ) {
                // look for a child that has a componentType solution
                for (let childInst of rendererState[componentIdx]
                    .childrenInstructions) {
                    if (childInst?.componentType === "solution") {
                        let solComponentIdx = childInst.componentIdx;
                        if (rendererState[solComponentIdx].stateValues.hidden) {
                            rendererState[solComponentIdx].stateValues.hidden =
                                false;
                        }
                    }
                }
            }
        }
    }

    /**
     * Record the DOM id -> source position of every renderer instruction in
     * `childrenInstructions` (each entry carries its own `id`, `componentIdx`,
     * and, if the component has a direct source origin, `position`). Called
     * wherever a batch of renderer instructions arrives from the core, so
     * `positionByDomId` stays in sync with whatever's actually rendered.
     *
     * Entries can also be plain strings or nulls (text children), and a
     * position's `offset` fields are optional in the underlying DAST types
     * (unist `Point.offset?`), while everything reading this map — the
     * scroll-target search and both click handlers — does arithmetic on
     * them. Validating numeric start/end offsets here, at the single entry
     * point, is what makes the map's `SourcePosition` value type honest.
     */
    function recordPositions(childrenInstructions: unknown): void {
        if (!Array.isArray(childrenInstructions)) {
            return;
        }
        for (const entry of childrenInstructions) {
            const instruction = entry as {
                id?: unknown;
                position?: {
                    start?: { offset?: unknown };
                    end?: { offset?: unknown };
                };
            } | null;
            if (
                instruction &&
                typeof instruction === "object" &&
                typeof instruction.id === "string" &&
                typeof instruction.position?.start?.offset === "number" &&
                typeof instruction.position?.end?.offset === "number"
            ) {
                positionByDomId.current.set(
                    prefixForIds + instruction.id,
                    instruction.position as SourcePosition,
                );
            }
        }
    }

    function initializeRenderers(args: Record<string, any>) {
        if (args.rendererState) {
            if (
                forceDisable ||
                forceShowCorrectness ||
                forceShowSolution ||
                forceUnsuppressCheckWork
            ) {
                forceRendererState({
                    rendererState: args.rendererState,
                    forceDisable,
                    forceShowCorrectness,
                    forceShowSolution,
                    forceUnsuppressCheckWork,
                });
            }
            for (let componentIdx in args.rendererState) {
                recordPositions(
                    args.rendererState[componentIdx].childrenInstructions,
                );
                dispatch(
                    mainThunks.updateRendererSVs({
                        coreId: coreId.current,
                        componentIdx: componentIdx as any,
                        stateValues:
                            args.rendererState[componentIdx].stateValues,
                        childrenInstructions:
                            args.rendererState[componentIdx]
                                .childrenInstructions,
                        updatesToIgnoreRef: updatesToIgnoreRef,
                        prefixForIds,
                    }),
                );
            }
        }

        coreInfo.current = args.coreInfo;

        if (!coreInfo.current) {
            return;
        }

        generatedVariantCallback?.({
            variantInfo: JSON.parse(
                coreInfo.current.generatedVariantString,
                serializedComponentsReviver,
            ),
            allPossibleVariants: coreInfo.current.allPossibleVariants,
            activityId,
            docId,
        });

        const rendererLoaders: Array<() => Promise<any>> = [];
        const rendererClassNames: string[] = [];
        for (const rendererClassName of coreInfo.current
            .rendererTypesInDocument) {
            rendererClassNames.push(rendererClassName);
            // Capture as a factory so `renderersLoadComponent` can drive the
            // retry-on-transient-failure path (see issue #1190): a bare
            // `import(...)` promise created here would already be settling
            // before the loader attaches its handler, which under Cypress
            // turned the rare dev-server hiccup into an unhandled rejection
            // that failed the spec.
            rendererLoaders.push(
                () => import(`./renderers/${rendererClassName}.tsx`),
            );
        }

        const documentComponentInstructions = coreInfo.current.documentToRender;

        renderersLoadComponent(rendererLoaders, rendererClassNames)
            .then(
                ({ rendererClasses: newRendererClasses, failedRenderers }) => {
                    if (failedRenderers.length > 0) {
                        // Some renderer chunks ultimately failed to load even
                        // after retries; their placeholders are in
                        // newRendererClasses, but flag this so we re-initialize
                        // on the next core reconcile rather than skip it.
                        errorInitializingRenderers.current = true;
                    }
                    rendererClasses.current = newRendererClasses;
                    const documentRendererClass =
                        newRendererClasses[
                            documentComponentInstructions.rendererType
                        ];

                    setDocumentRenderer(
                        React.createElement(documentRendererClass, {
                            key:
                                coreId.current +
                                documentComponentInstructions.componentIdx,
                            componentInstructions:
                                documentComponentInstructions,
                            rendererClasses: newRendererClasses,
                            flags,
                            coreId: coreId.current,
                            docId,
                            activityId,
                            callAction,
                            doenetViewerUrl,
                            fetchExternalDoenetML,
                            requestScrollTo,
                        }),
                    );

                    // renderersInitializedCallback?.();
                },
            )
            .catch((e) => {
                errorInitializingRenderers.current = true;
            });
    }

    function updateRenderers({
        updateInstructions,
        actionId,
        diagnostics: newDiagnostics,
        init = false,
    }: {
        updateInstructions: Record<string, any>[];
        actionId?: string;
        diagnostics?: DiagnosticRecord[];
        init?: boolean;
    }) {
        if (newDiagnostics) {
            diagnostics.current = newDiagnostics;
            setDiagnosticsCallback?.(diagnostics.current, doenetML);
            if (
                init &&
                newDiagnostics.some((diagnostic) => diagnostic.type === "error")
            ) {
                setHasInitialError(true);
            }
        }

        if (
            init &&
            loadedInitialRendererState.current &&
            !errorInitializingRenderers.current &&
            !errorInsideRenderers.current &&
            !hidden
        ) {
            // we don't update renderer state values if loaded the state before starting core
            // and no errors were encountered
            // as we already had the renderer information before core was created.
            // Exception if doc is hidden,
            // then we still update the renderers.
            // This exception is important because, in this case,
            // the renderers have not yet been rendered, so any errors would not yet have revealed
            // (and for the same reason, there cannot have been any user actions queued)
            return;
        }

        for (let instruction of updateInstructions) {
            if (instruction.instructionType === "updateRendererStates") {
                for (let {
                    componentIdx,
                    stateValues,
                    rendererType,
                    childrenInstructions,
                } of instruction.rendererStatesToUpdate) {
                    recordPositions(childrenInstructions);
                    dispatch(
                        mainThunks.updateRendererSVs({
                            coreId: coreId.current,
                            componentIdx,
                            stateValues,
                            childrenInstructions,
                            sourceOfUpdate: instruction.sourceOfUpdate,
                            // Note: the reason we check both the renderer class and .type
                            // is that if the renderer was memoized, then the renderer class itself is on .type,
                            // Otherwise, the renderer class is the value of the rendererClasses entry.
                            baseStateVariable:
                                rendererClasses.current[rendererType]
                                    ?.baseStateVariable ||
                                rendererClasses.current[rendererType]?.type
                                    ?.baseStateVariable,
                            actionId,
                            prefixForIds,
                            updatesToIgnoreRef,
                        }),
                    );
                }
            }
        }

        resolveAction({ actionId });
    }

    function resolveAction({
        actionId,
        success = true,
    }: {
        actionId?: string;
        success?: boolean;
    }) {
        if (!actionId) {
            return;
        }
        const callback = onActionCallbacks.current.get(actionId);
        if (callback) {
            callback(success);
            onActionCallbacks.current.delete(actionId);
        }

        if (
            lastSkippableAction.current &&
            onActionCallbacks.current.size === 0
        ) {
            let actionToCall = lastSkippableAction.current;
            lastSkippableAction.current = null;
            callAction(actionToCall);
        }
    }

    function reportScoreAndStateCallback({
        score,
        state,
    }: {
        score: number;
        state: unknown;
    }) {
        if (specifiedReportScoreAndStateCallback) {
            specifiedReportScoreAndStateCallback({
                score,
                state,
                activityId,
                docId,
            });
        } else {
            let messageId = nanoid();
            const message = {
                score,
                state,
                subject: "SPLICE.reportScoreAndState",
                activity_id: activityId,
                doc_id: docId,
                message_id: messageId,
            };

            if (flags.messageParent && window.parent) {
                window.parent.postMessage(message);
            } else {
                window.postMessage(message);
            }
        }
    }

    async function loadStateAndInitialize() {
        const coreIdWhenCalled = coreId.current;
        let loadedState = false;

        cid.current = await cidFromText(doenetML);

        if (flags.allowLocalState) {
            let localInfo;

            try {
                localInfo = await idb_get(
                    `${activityId}|${docId}|${attemptNumber}|${cid.current}`,
                );
                if (localInfo.data_format_version !== data_format_version) {
                    // the data saved does not match the current version, so we ignore it
                    localInfo = undefined;
                }
            } catch (e) {
                // ignore error
            }

            if (localInfo) {
                const coreState = JSON.parse(
                    localInfo.coreState,
                    serializedComponentsReviver,
                );
                const rendererState =
                    localInfo.rendererState &&
                    JSON.parse(
                        localInfo.rendererState,
                        serializedComponentsReviver,
                    );
                const coreInfo = JSON.parse(
                    localInfo.coreInfo,
                    serializedComponentsReviver,
                );

                // Record whether or not we loaded the renderer state before starting core
                loadedInitialRendererState.current = Boolean(rendererState);

                initializeRenderers({
                    rendererState,
                    coreInfo,
                });

                initialCoreData.current = {
                    coreState,
                    requestedVariant: JSON.parse(
                        coreInfo.generatedVariantString,
                        serializedComponentsReviver,
                    ),
                };

                loadedState = true;
            }
        }

        if (!loadedState) {
            if (flags.allowLoadState) {
                try {
                    // Note: initialState === null means don't attempt to load in any state
                    if (initialState) {
                        processLoadedDocState(initialState);
                    } else if (initialState === undefined) {
                        requestStateViaSplice({
                            cid: cid.current,
                            activityId,
                            docId,
                            attemptNumber,
                            userId,
                        });
                    }
                } catch (e: any) {
                    setIsInErrorState?.(true);

                    let message = "";
                    if ("message" in e) {
                        message = e.message;
                    }
                    setErrMsg(`Error loading doc state: ${message}`);
                    return;
                }
            }
        }

        //Guard against the possibility that parameters changed while waiting
        if (coreIdWhenCalled === coreId.current) {
            if (render) {
                startCoreSafely();
            } else {
                setStage("readyToCreateCore");
            }
        }
    }

    function requestStateViaSplice({
        cid,
        activityId,
        docId,
        attemptNumber,
        userId,
    }: {
        cid: string;
        activityId: string;
        docId: string;
        attemptNumber: number;
        userId?: string;
    }) {
        let messageId = nanoid();

        messageIdFromGetState.current = messageId;

        const message = {
            subject: "SPLICE.getState",
            message_id: messageId,
            cid,
            domain_id: "Doenet",
            activity_id: activityId,
            doc_id: docId,
            attempt_number: attemptNumber,
            user_id: userId,
        };

        if (flags.messageParent && window.parent) {
            window.parent.postMessage(message);
        } else {
            window.postMessage(message);
        }
    }

    function processLoadedDocState(data: Record<string, any>) {
        let coreInfo = JSON.parse(data.coreInfo, serializedComponentsReviver);

        let rendererState =
            data.rendererState &&
            JSON.parse(data.rendererState, serializedComponentsReviver);

        // Record whether or not we loaded the renderer state before starting core
        loadedInitialRendererState.current = Boolean(rendererState);

        initializeRenderers({
            rendererState,
            coreInfo,
        });

        initialCoreData.current = {
            coreState: JSON.parse(data.coreState, serializedComponentsReviver),
            requestedVariant: JSON.parse(
                coreInfo.generatedVariantString,
                serializedComponentsReviver,
            ),
        };
        initializeCounters.current = data.initializeCounters;
    }

    // Put the viewer into a visible "core failed to start" error state rather
    // than leaving it blank at stage "wait" forever (Doenet/DoenetApps#2957).
    // Shared by every core-start failure path.
    function failCoreStart() {
        coreCreationInProgress.current = false;
        setIsInErrorState?.(true);
        setErrMsg(CORE_START_FAILED_MESSAGE);
        setHasInitialError(true);
    }

    // The core-worker *handshake*: (re)create the worker and run the cheap,
    // roughly size-independent init round-trips (set source/flags, initialize
    // the JS core). This is the phase a Doenet/DoenetApps#2957 stall lives in,
    // so `startCore` wraps it in a watchdog. The expensive `generateDast` step
    // happens AFTER this returns and is deliberately NOT watchdogged.
    async function handshakeCore(attempt: number): Promise<Remote<CoreWorker>> {
        let thisCoreWorker = coreWorker.current;

        if (attempt > 0 || coreCreated.current || !thisCoreWorker) {
            // (Re)create a fresh worker when there's no reusable one to init:
            //  - !thisCoreWorker — no worker created yet (the common first
            //    load: with render=true the initial-pass `!render` branch that
            //    would otherwise pre-create one never ran);
            //  - coreCreated.current — a core already exists (e.g. the document
            //    changed and we're rebuilding it);
            //  - attempt > 0 — a retry, whose predecessor worker may be wedged.
            // reinitializeCoreAndTerminateAnimations tears down any existing
            // worker and boots + initializes a new one.
            thisCoreWorker = await reinitializeCoreAndTerminateAnimations();
        } else {
            // attempt 0, a worker already exists, and its core isn't created —
            // reuse that worker (skipping a fresh boot + WASM init) and just
            // (re)initialize it with the current DoenetML. Two ways to be here:
            // the initial-pass `!render` branch pre-created a worker to report
            // document structure, or a document/parameter change reset
            // `coreCreated` while keeping the existing worker.
            await initializeCoreWorker({
                coreWorker: thisCoreWorker,
                doenetML,
                flags,
                activityId,
                docId,
                requestedVariantIndex,
                attemptNumber,
                documentStructureCallback,
                fetchExternalDoenetML,
            });
        }

        // [Doenet/DoenetApps#2957] Test seam — simulate a handshake-phase
        // stall/failure (worker created, but a boot round-trip never settles).
        // Inert in production.
        if (doenetGlobalConfig.__doenetTestCoreInitHook) {
            await doenetGlobalConfig.__doenetTestCoreInitHook(
                "handshake",
                attempt,
            );
        }

        return thisCoreWorker;
    }

    async function startCore() {
        setHasInitialError(false);

        const maxAttempts = Math.max(
            1,
            doenetGlobalConfig.coreBootMaxAttempts ??
                DEFAULT_CORE_BOOT_MAX_ATTEMPTS,
        );
        const handshakeWatchdogMs =
            doenetGlobalConfig.coreHandshakeWatchdogMs ??
            DEFAULT_CORE_HANDSHAKE_WATCHDOG_MS;

        // --- Phase 1: handshake — watchdogged and retried ---
        // Only this cheap, size-independent phase is time-boxed. A stall here
        // means a hung/wedged worker (Doenet/DoenetApps#2957), not slow work.
        let thisCoreWorker: Remote<CoreWorker> | null = null;
        let handshakeSucceeded = false;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            try {
                thisCoreWorker = await withTimeout(
                    () => handshakeCore(attempt),
                    handshakeWatchdogMs,
                    `core worker handshake (attempt ${attempt + 1}/${maxAttempts})`,
                );
                handshakeSucceeded = true;
                break;
            } catch (err) {
                console.warn(
                    `DocViewer: core worker handshake attempt ${attempt + 1} ` +
                        `of ${maxAttempts} failed` +
                        (attempt + 1 < maxAttempts
                            ? "; retrying with a fresh worker."
                            : "; giving up."),
                    err,
                );
                // The worker may be wedged (a hung round-trip leaves its
                // serialization queue — and its own terminate() — stuck), so
                // force-kill it natively and drop the refs; the next attempt
                // starts from a brand-new Worker.
                await teardownCurrentCoreWorker({ graceful: false });
                coreCreated.current = false;
                coreCreationInProgress.current = false;
                if (attempt + 1 < maxAttempts) {
                    await new Promise((resolve) =>
                        setTimeout(resolve, CORE_BOOT_RETRY_DELAY_MS),
                    );
                }
            }
        }

        if (!handshakeSucceeded || thisCoreWorker === null) {
            // Every handshake attempt failed.
            failCoreStart();
            return;
        }

        // --- Phase 2: generate the DAST — NOT watchdogged ---
        // The worker proved it is alive by completing the handshake, so a long
        // generateDast is real, in-progress work, not a hang. Watchdogging
        // here is what made complex documents unloadable (they time out before
        // core finishes), so we let it run to completion however long it takes.
        onActionCallbacks.current.clear();
        coreCreationInProgress.current = true;

        let dastResult: Awaited<
            ReturnType<Remote<CoreWorker>["generateJavascriptDast"]>
        >;
        try {
            // [Doenet/DoenetApps#2957] Test seam — simulate a slow-but-alive
            // evaluation. Runs in the un-watchdogged phase, so a delay here
            // must NOT abort the load. Inert in production.
            if (doenetGlobalConfig.__doenetTestCoreInitHook) {
                await doenetGlobalConfig.__doenetTestCoreInitHook(
                    "generate",
                    0,
                );
            }

            dastResult = await thisCoreWorker.generateJavascriptDast(
                {
                    coreId: coreId.current,
                    userId,
                    cid: cid.current,
                    theme: darkMode,
                    requestedVariant: initialCoreData.current?.requestedVariant,
                    stateVariableChanges: initialCoreData.current?.coreState
                        ? JSON.stringify(
                              initialCoreData.current.coreState,
                              serializedComponentsReplacer,
                          )
                        : undefined,
                    initializeCounters: initializeCounters.current,
                },
                Comlink.proxy(updateRenderers),
                Comlink.proxy(reportScoreAndStateCallback),
                Comlink.proxy(requestAnimationFrame),
                Comlink.proxy(cancelAnimationFrame),
                Comlink.proxy(copyToClipboard),
                Comlink.proxy(sendEvent),
                Comlink.proxy(requestSolutionView),
            );
        } catch (err) {
            // generateDast normally reports core problems via
            // `{ success: false }` (handled below); a *rejection* here is an
            // unexpected failure (e.g. the worker died mid-evaluation). Surface
            // it rather than stalling.
            console.warn("DocViewer: generateJavascriptDast failed", err);
            failCoreStart();
            return;
        }

        if (dastResult.success) {
            if (
                coreInfo.current &&
                JSON.stringify(coreInfo.current) ===
                    JSON.stringify(dastResult.coreInfo) &&
                !errorInitializingRenderers.current &&
                !errorInsideRenderers.current
            ) {
                // we already initialized renderers before core was created and no errors were encountered
                // so don't initialize them again when core sends the initializeRenderers message
            } else {
                initializeRenderers({ coreInfo: dastResult.coreInfo });
                if (errorInsideRenderers.current) {
                    setIgnoreRendererError(true);
                    setIsInErrorState?.(false);
                }
            }

            if (dastResult.diagnostics) {
                diagnostics.current = dastResult.diagnostics;
                if (
                    diagnostics.current.some(
                        (diagnostic) => diagnostic.type === "error",
                    )
                ) {
                    setHasInitialError(true);
                }
                setDiagnosticsCallback?.(diagnostics.current, doenetML);
            }
        } else {
            setIsInErrorState?.(true);
            setErrMsg(dastResult.errMsg);
            setHasInitialError(true);
        }

        coreCreated.current = true;
        coreCreationInProgress.current = false;
        preventMoreAnimations.current = false;
        // Snapshot and clear the queue before dispatching so that stale
        // actions from a previous core lifetime (e.g. an initial setTheme
        // queued before the first core was created) cannot survive into a
        // future core reinitialization and override the correctly-initialized
        // theme or other state.
        const pendingActions = takeDeferredCoreActions();
        for (let actionArgs of pendingActions) {
            executeAction(actionArgs).catch((e) => {
                console.warn("DocViewer: deferred executeAction failed", e);
            });
        }
        setStage("coreCreated");
        initializedCallback?.({ activityId, docId });
    }

    // `startCore` is always launched fire-and-forget (never awaited — e.g. from
    // render-phase code and event listeners), so wrap it: it already surfaces
    // boot failures itself, but an *unexpected* throw must still become a
    // visible error rather than an unhandled rejection
    // (Doenet/DoenetApps#2957, and AGENTS.md "no fire-and-forget promises").
    function startCoreSafely() {
        startCore().catch((e) => {
            console.warn("DocViewer: startCore failed unexpectedly", e);
            failCoreStart();
        });
    }

    function requestAnimationFrame({
        action,
        actionArgs,
        delay,
        animationId,
    }: {
        action: { actionName: string; componentIdx?: number };
        actionArgs: Record<string, any>;
        delay?: number;
        animationId: string;
    }) {
        if (!preventMoreAnimations.current) {
            // create new animationId

            if (delay) {
                // set a time out to call actual request animation frame after a delay
                let timeoutId = window.setTimeout(
                    () =>
                        _requestAnimationFrame({
                            action,
                            actionArgs,
                            animationId,
                        }),
                    delay,
                );
                animationInfo.current[animationId] = { timeoutId };
            } else {
                // call actual request animation frame right away
                animationInfo.current[animationId] = {};
                _requestAnimationFrame({ action, actionArgs, animationId });
            }
        }
    }

    function _requestAnimationFrame({
        action,
        actionArgs,
        animationId,
    }: {
        action: { actionName: string; componentIdx?: number };
        actionArgs: Record<string, any>;
        animationId: string;
    }) {
        let animationFrameID = window.requestAnimationFrame(() =>
            callAction({
                action,
                args: actionArgs,
            }),
        );

        let animationInfoObj = animationInfo.current[animationId];
        delete animationInfoObj.timeoutId;
        animationInfoObj.animationFrameID = animationFrameID;
    }

    async function cancelAnimationFrame(animationId: string) {
        let animationInfoObj = animationInfo.current[animationId];
        let timeoutId = animationInfoObj?.timeoutId;
        if (timeoutId !== undefined) {
            window.clearTimeout(timeoutId);
        }
        let animationFrameID = animationInfoObj?.animationFrameID;
        if (animationFrameID !== undefined) {
            window.cancelAnimationFrame(animationFrameID);
        }
        delete animationInfo.current[animationId];
    }

    function sendEvent(data: any) {
        const message = {
            data,
            subject: "SPLICE.sendEvent",
            message_id: nanoid(),
            name: data.verb,
        };

        if (flags.messageParent && window.parent) {
            window.parent.postMessage(message);
        } else {
            window.postMessage(message);
        }
    }

    /**
     * Request permission to view the solution of `componentIdx`
     * using SPLICE messaging.
     *
     * Sends a "SPLICE.requestSolutionView". The returned promise will
     * resolve when a matching "SPLICE.requestSolutionView.response"
     * is received.
     *
     * Return a promise that will resolve to an object with key:
     * allowView: whether or not the solution can be viewed
     */
    function requestSolutionView(componentIdx: number) {
        let messageId = nanoid();
        let requestSolutionPromiseResolve: (value: {
                allowView: boolean;
            }) => void,
            requestSolutionPromiseReject: (value: unknown) => void;

        const requestSolutionViewPromise = new Promise<{ allowView: boolean }>(
            (resolve, reject) => {
                requestSolutionPromiseResolve = resolve;
                requestSolutionPromiseReject = reject;

                const message = {
                    subject: "SPLICE.requestSolutionView",
                    message_id: messageId,
                    activity_id: activityId,
                    doc_id: docId,
                    attempt_number: attemptNumber,
                    user_id: userId,
                    component_idx: componentIdx,
                };

                console.log(message);

                if (flags.messageParent && window.parent) {
                    window.parent.postMessage(message);
                } else {
                    window.postMessage(message);
                }
            },
        );

        requestSolutionViewPromises.current[messageId] = {
            resolve: requestSolutionPromiseResolve!,
            reject: requestSolutionPromiseReject!,
        };

        return requestSolutionViewPromise;
    }

    async function copyToClipboard({
        text,
        actionId,
    }: {
        text: string;
        actionId?: string;
    }) {
        if (typeof text === "string") {
            await navigator.clipboard.writeText(text);
        }

        resolveAction({ actionId });
    }

    function errorHandler() {
        errorInsideRenderers.current = true;

        if (ignoreRendererError) {
            setIgnoreRendererError(false);
        }
    }

    // first, if last parameters don't match props
    // set state to props and record that that need a new core

    let changedState = false;

    const initialPass = lastDoenetML.current === null;

    // if we are just starting and the document isn't being rendered,
    // then just initialize the core worker so that can return document structure
    // but core itself won't actually start
    if (initialPass && !render) {
        const remote = attachNewCoreWorker();
        // Fire-and-forget: this only primes the worker so it can report the
        // document structure; core itself isn't started until `render` flips
        // true. Surface failures rather than swallowing the promise.
        initializeCoreWorker({
            coreWorker: remote,
            doenetML,
            flags,
            activityId,
            docId,
            requestedVariantIndex,
            attemptNumber,
            documentStructureCallback,
            fetchExternalDoenetML,
        }).catch((e) => {
            console.warn(
                "DocViewer: core worker initialization (no-render path) failed",
                e,
            );
        });
        return null;
    }

    if (lastDoenetML.current !== doenetML) {
        lastDoenetML.current = doenetML;
        changedState = true;
    }

    if (lastDocId.current !== docId) {
        lastDocId.current = docId;
        changedState = true;
    }

    if (lastActivityId.current !== activityId) {
        lastActivityId.current = activityId;
        changedState = true;
    }

    if (lastAttemptNumber.current !== attemptNumber) {
        lastAttemptNumber.current = attemptNumber;
        changedState = true;
    }

    if (lastRequestedVariantIndex.current !== requestedVariantIndex) {
        lastRequestedVariantIndex.current = requestedVariantIndex;
        changedState = true;
    }

    if (changedState) {
        // Reset error messages, core.
        // Then load state and initialize

        if (errMsg !== null) {
            setErrMsg(null);
            setIsInErrorState?.(false);
        }

        coreId.current = nanoid();
        initialCoreData.current = null;
        coreInfo.current = null;
        setDocumentRenderer(null);
        coreCreated.current = false;
        coreCreationInProgress.current = false;
        loadedInitialRendererState.current = false;
        // Source positions recorded for the old document are meaningless
        // offsets into the new one; drop them rather than letting them
        // accumulate across recompiles (`recordPositions` repopulates the
        // map as the new core's renderer instructions stream in).
        positionByDomId.current.clear();

        setStage("wait");

        loadStateAndInitialize().catch((e) => {
            console.warn("DocViewer: loadStateAndInitialize failed", e);
            failCoreStart();
        });

        return null;
    }

    if (errMsg !== null) {
        return (
            <div
                style={{
                    backgroundColor: "var(--lightRed)",
                    color: "var(--canvasText)",
                    borderWidth: 3,
                    borderStyle: "solid",
                    borderColor: "var(--mainRed)",
                    fontSize: "1.3em",
                    marginLeft: "20px",
                    marginTop: "20px",
                    padding: "0.5em",
                }}
            >
                <MdError color="red" fontSize={"24pt"} /> {errMsg}
            </div>
        );
    }

    if (stage === "wait") {
        return null;
    }

    if (stage === "readyToCreateCore" && render) {
        startCoreSafely();
        // XXX: this state never occurs
    } else if (stage === "waitingOnCore" && !render && !coreCreated.current) {
        // we've moved off this doc, but core is still being created
        // so reinitialize core
        reinitializeCoreAndTerminateAnimations();

        setStage("readyToCreateCore");
    }

    if (hidden || !render) {
        return null;
    }

    let noCoreWarning = null;
    let viewerStyle = {
        maxWidth: "850px",
        paddingLeft: "20px",
        paddingRight: "20px",
        backgroundColor: "var(--canvas)",
        containerType: "inline-size",
    };
    if (!coreCreated.current) {
        if (!documentRenderer) {
            noCoreWarning = (
                <div
                    style={{
                        backgroundColor: "var(--canvas)",
                        color: "var(--canvasText)",
                    }}
                >
                    <p>Initializing....</p>
                </div>
            );
        }
    }

    function handleViewerClick(event: MouseEvent) {
        if (skipNextClickNavigation.current) {
            skipNextClickNavigation.current = false;
            return;
        }
        if (!onSourcePositionClick) {
            return;
        }
        // Innermost mapped element wins, with one correction: walking on
        // up the ancestor chain, a mapped ancestor whose source range does
        // NOT contain the chosen range means the chosen element wasn't
        // authored where it renders — it was brought in by whatever
        // authored that ancestor (a copy like `$section1`) — so navigate
        // to the ancestor's range instead.
        let chosen: SourcePosition | undefined;
        let el: Element | null = event.target as Element;
        const container = viewerContainerRef.current;
        while (el && el !== container) {
            const position = mappedPositionForDomId(el.id);
            if (position) {
                if (!chosen || !containsRange(position, chosen)) {
                    chosen = position;
                }
            }
            el = el.parentElement;
        }
        if (chosen) {
            onSourcePositionClick(chosen);
        }
    }

    // Look up a DOM id in the position map, also recognizing the
    // `${id}-container` wrapper convention (e.g. GraphFrame, choiceInput)
    // so clicks in a component's margins resolve to the component.
    function mappedPositionForDomId(domId: string) {
        if (!domId) {
            return undefined;
        }
        const direct = positionByDomId.current.get(domId);
        if (direct || !domId.endsWith("-container")) {
            return direct;
        }
        return positionByDomId.current.get(
            domId.slice(0, -"-container".length),
        );
    }

    let errorOverview = null;
    if (documentRenderer && hasInitialError) {
        let errorStyle = {
            backgroundColor: "var(--lightRed)",
            color: "var(--canvasText)",
            textAlign: "center" as const,
            borderWidth: 3,
            borderStyle: "solid",
            borderColor: "var(--mainRed)",
        };
        errorOverview = (
            <div style={errorStyle}>
                <b>This document contains errors!</b>
            </div>
        );
    }

    //Spacing around the whole doenetML document
    return (
        <ErrorBoundary
            setIsInErrorState={setIsInErrorState}
            errorHandler={errorHandler}
            ignoreError={ignoreRendererError}
            coreCreated={coreCreated.current}
        >
            {noCoreWarning}
            <div
                style={viewerStyle}
                className="doenet-viewer"
                ref={viewerContainerRef}
            >
                {errorOverview}
                <DocContext.Provider value={contextForRenderers}>
                    {documentRenderer}
                </DocContext.Provider>
            </div>
        </ErrorBoundary>
    );
}

type ErrorProps = {
    setIsInErrorState: Function | undefined;
    errorHandler: Function | undefined;
    ignoreError: boolean;
    coreCreated: boolean;
    children?: ReactNode;
};

type ErrorState = { hasError: boolean };

class ErrorBoundary extends React.Component<ErrorProps, ErrorState> {
    constructor(props: ErrorProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): ErrorState {
        return { hasError: true };
    }
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.props.setIsInErrorState?.(true);
        this.props.errorHandler?.();
    }
    render() {
        if (this.state.hasError && !this.props.ignoreError) {
            if (!this.props.coreCreated) {
                return null;
            } else {
                return (
                    <div
                        style={{
                            backgroundColor: "var(--lightRed)",
                            color: "var(--canvasText)",
                            padding: "1em",
                            textAlign: "center",
                            borderWidth: 3,
                            borderStyle: "solid",
                            borderColor: "var(--mainRed)",
                        }}
                    >
                        <b>Error</b>: Something went wrong.
                    </div>
                );
            }
        }
        return this.props.children;
    }
}
