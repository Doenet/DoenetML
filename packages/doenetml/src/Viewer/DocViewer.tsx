import React, {
    createContext,
    ErrorInfo,
    ReactElement,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
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
import type { DiagnosticRecord, ReaderStyleOverrides } from "@doenet/utils";
import * as Comlink from "comlink";

import { MdError } from "react-icons/md";
import { UiButton } from "@doenet/ui-components";
import { get as idb_get } from "idb-keyval";
import { createCoreWorker, initializeCoreWorker } from "../utils/docUtils";
import {
    directionOf,
    reachableCatalogLocales,
    resolveDocumentLocale,
    resolveUiLocale,
    type Translator,
} from "@doenet/i18n";
import { declaredLangsInSource } from "@doenet/parser";
import { hasNavigationModifier } from "../utils/sourceNavigation";
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
    concurrentHandshakesSnapshot,
    type HandshakeCensusSeat,
    joinHandshakeCensus,
    refreshHandshakeCensusCount,
    reportedCores,
} from "../utils/handshakeCensus";
import {
    withTimeout,
    disposeCoreWorker,
    DEFAULT_CORE_BOOT_MAX_ATTEMPTS,
    handshakeWatchdogMsFor,
    isHandshakeTimeout,
    timeoutLooksLikeContention,
    retryDelayMs,
    CORE_START_FAILED_MESSAGE,
    CORE_START_FAILED_BUSY_MESSAGE,
    CORE_START_FAILED_RETRY_MESSAGE,
    CORE_START_FAILED_BUSY_RETRY_MESSAGE,
    CORE_START_RETRY_MESSAGE,
    SAVED_STATE_UNAVAILABLE_MESSAGE,
} from "./coreWorkerBoot";
import type { ResolvedTheme } from "../utils/theme";
import {
    chromeLangDir,
    ContentI18nProvider,
    DocumentDirectionProvider,
    I18nProvider,
    useChromeTranslator,
    useLocaleCatalogs,
} from "../utils/i18n";
import {
    localizeDiagnostics,
    useDiagnosticFormatter,
} from "../utils/diagnostics";

// Re-export for back-compat: `renderersLoadComponent` was previously defined
// here, and external consumers may deep-import it from
// `@doenet/doenetml/Viewer/DocViewer` via the package's `./*` exports map.
export { renderersLoadComponent } from "./renderersLoadComponent";

export type SourcePosition = {
    start: { line: number; column: number; offset: number };
    end: { line: number; column: number; offset: number };
};

/**
 * One score/state report on its way to whoever persists it, carrying the
 * identity of the document it describes. The ids travel *with* the report
 * rather than being read at delivery time, because a report can be buffered
 * (see `pendingStateReport`) and handed over later, by which point the props
 * may name a successor document — and state saved under the wrong
 * `activityId`/`docId` is worse than state not saved at all.
 */
export type StateReport = {
    score: number;
    state: unknown;
    activityId: string;
    docId: string;
};

/** Whether `inner`'s source range lies entirely within `outer`'s. */
function containsRange(outer: SourcePosition, inner: SourcePosition): boolean {
    return (
        inner.start.offset >= outer.start.offset &&
        inner.end.offset <= outer.end.offset
    );
}

/**
 * Error codes that mean "the page around this viewer does not speak SPLICE",
 * not "your saved work could not be loaded" (Doenet/DoenetML#1795).
 *
 * This is an LTI platform's postMessage vocabulary for a message it will not
 * act on, and an embedded viewer meets it without anyone arranging for it to.
 * Canvas listens for `message` on every page it serves, and answers any
 * subject outside its own allow-list with `{ subject: "<subject>.response",
 * message_id, error: { code: "unsupported_subject" } }` — quoting the id it
 * was sent, so the reply is addressed to this viewer's open request, and
 * carrying no `message`, since Canvas omits that field when it has no text
 * for it. Embed a Doenet activity in a Canvas page and every
 * `SPLICE.getState` comes back as one of these. Reported at
 * community.doenet.org/t/305.
 *
 * `unsupported_subject` is the only one of these that a `SPLICE` subject
 * draws out of Canvas itself: the other three answer a subject Canvas does
 * recognize but refuses (wrong target origin, a malformed payload, a tool
 * without the scope), which `SPLICE` never is. They are listed alongside it
 * for a platform that shares the vocabulary and checks in a different order,
 * and because a host with a real load failure to report has no reason to
 * reach for a platform's words for refusing one.
 *
 * Read as a host failure, that reply told a reader their saved work was
 * unavailable — on an embed that has no host, no saved work, and nothing
 * wrong with it. So these are logged and dropped: they say a request went
 * unanswered, which is the same thing as no answer, and the request stays
 * open for a host that does speak SPLICE.
 *
 * Matched by code alone, and only against this documented set. The code is
 * the whole test in both directions: one of these is dropped even carrying a
 * `message`, so a platform that starts sending text is still recognized; and
 * any other code reaches the reader on the strength of its `message`, so a
 * genuine SPLICE host — free to report a load failure under any code it
 * likes — keeps its say.
 */
const NON_SPLICE_PLATFORM_ERROR_CODES = new Set([
    "unsupported_subject",
    "unauthorized",
    "wrong_origin",
    "bad_request",
]);

export const DocContext = createContext<{
    doenetViewerUrl?: string;
    doenetImagesUrl?: string;
    darkMode?: ResolvedTheme;
    /**
     * The content's language, after `<document lang>` has had its say, or
     * `"en"` when nobody declared one. Renderers that emit prose alongside
     * core-computed content should follow this.
     */
    documentLocale?: string;
    /**
     * The language of the chrome — buttons, panel headers, diagnostics.
     * Defaults to `documentLocale`, so a fully Spanish activity is fully
     * Spanish without the host configuring anything.
     */
    uiLocale?: string;
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

/**
 * The live region a failed state load is reported in, beside a document that
 * is on screen and working (#1741).
 *
 * Mounts empty and takes its text on a later commit, never the one it
 * appears in: a live region a screen reader first meets with text already in
 * it is unreliably announced, and this notice's whole purpose is reaching a
 * reader who is working somewhere else in the document.
 *
 * The deferral lives here rather than in a region hoisted above `DocViewer`'s
 * early returns because the region does not exist until the document does —
 * a viewer still booting returns before ever rendering its container — so a
 * host that answers `SPLICE.getState` with an error before the first render
 * would otherwise put region and text on the page in the same commit. That
 * host is ordinary: the coordinator's in-page warehouse answers from memory.
 * Deferring the text holds the guarantee whenever the region mounts, rather
 * than only when it happens to predate the answer.
 *
 * Built like `errorOverview` in `DocViewer`, but bordered in `--mainYellow`
 * rather than the red that pane and overview share: red is what the viewer
 * says a document is broken in, and this one is not. The theme sheet gives
 * the token a dark amber on the light canvas and a light one on the dark, so
 * the border keeps its contrast either way. `role="status"` rather than
 * `role="alert"`: nothing here interrupts what the reader is doing. It
 * shares the screen with `initializingPane`'s own `role="status"` while a
 * core is being created — that pane is rendered beside the container as
 * `noCoreWarning`, not only returned in place of it — which costs nothing:
 * an empty region has nothing to announce, and each region announces only
 * its own text.
 */
function StateLoadNoticeRegion({
    message,
    leadIn,
    uiLocale,
    documentDirection,
}: {
    message: string | null;
    leadIn: string;
    uiLocale: string;
    documentDirection: "ltr" | "rtl";
}) {
    // Whether this region has been through a commit of its own yet. A
    // passive effect, so the empty region is painted before the text is
    // handed to it.
    const [regionOnPage, setRegionOnPage] = useState(false);
    useEffect(() => {
        setRegionOnPage(true);
    }, []);

    return (
        <div role="status">
            {regionOnPage && message !== null ? (
                <div
                    style={{
                        backgroundColor: "var(--canvas)",
                        color: "var(--canvasText)",
                        borderWidth: 2,
                        borderStyle: "solid",
                        borderColor: "var(--mainYellow)",
                        padding: "0.25em 0.5em",
                    }}
                    // Addressed to whoever is looking at the screen, so it is
                    // in `uiLocale` — except for the host's own words, which
                    // arrive in whatever language the host wrote them.
                    // Re-declared only where the two directions disagree, for
                    // the reason `errorOverview` gives.
                    {...chromeLangDir(uiLocale, documentDirection)}
                >
                    <b>{leadIn}</b> {message}
                </div>
            ) : null}
        </div>
    );
}

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
    coreStartFailedCallback,
    setIsInErrorState,
    prefixForIds = "",
    doenetViewerUrl,
    doenetImagesUrl,
    darkMode,
    documentLocale,
    uiLocale,
    localeResources,
    resolvedUiLocaleCallback,
    styleOverrides,
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
    reportScoreAndStateCallback?: (data: StateReport) => void;
    documentStructureCallback?: Function;
    initializedCallback?: Function;
    /**
     * The failure counterpart of `initializedCallback` (#1709): called once
     * when the core cannot be started and the viewer enters its visible error
     * state — its handshake retries exhausted, or the boot derailed some other
     * way (a rejected `generateDast`, a failed state load).
     *
     * Hosts that cap boot concurrency release a boot slot on
     * `initializedCallback`; without this signal a failed boot holds its slot
     * until their watchdog expires (30–90 s), starving the queue precisely
     * when a page is already struggling. Called at most once per core-start
     * attempt, and never for a document that merely reports errors — those
     * booted fine.
     */
    coreStartFailedCallback?: Function;
    setIsInErrorState?: Function;
    prefixForIds?: string;
    doenetViewerUrl?: string;
    doenetImagesUrl?: string;
    darkMode?: ResolvedTheme;
    /**
     * BCP-47 tag for the content's language, e.g. `"es-MX"`. An authored
     * `<document lang>` overrides it. Changing it rebuilds the core: every
     * string the core computes depends on it.
     */
    documentLocale?: string | null;
    /** BCP-47 tag for the chrome's language. Defaults to `documentLocale`. */
    uiLocale?: string | null;
    /**
     * FTL catalogs keyed by locale, for a host with translations of its own.
     * Optional: this viewer loads a catalog for every language it resolves and
     * merges what it loads *under* this map, so a catalog supplied here wins.
     *
     * A catalog for one of the *content's* languages arriving rebuilds the
     * core, since the catalogs are handed to it at creation. One for the
     * reader's chrome does not — the core never reads it, and rebuilding would
     * discard whatever the reader had typed. Withdrawing a catalog rebuilds
     * nothing either: the core goes on rendering what it was built with until
     * something else rebuilds it.
     */
    localeResources?: Record<string, string> | null;
    /**
     * Report the language this viewer renders its chrome and its diagnostics
     * in, whenever it changes.
     *
     * Only here is an authored `<document lang>` known, and it is what
     * `uiLocale` falls back to — so a host that wraps this viewer cannot
     * resolve the same tag from its own props. The editor needs it: it renders
     * the same diagnostics again in its hover tooltips, and the two must not
     * come out in different languages.
     */
    resolvedUiLocaleCallback?: (uiLocale: string) => void;
    styleOverrides?: ReaderStyleOverrides | null;
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

    // Whenever the host asks for a specific source offset (a Cmd/Ctrl+click
    // in the editor, or — in the VS Code preview — a cursor move), scroll a
    // matching rendered element into view. The rule: find the innermost
    // mapped element containing the offset (the "container" — implicitly
    // the whole document when none does), then prefer the nearest mapped
    // element inside the container that starts after the offset, then the
    // nearest one ending before it, then the container itself. Offsets with
    // no mapped element of their own (whitespace between siblings, or
    // inside a composite like <group> that produces no renderer
    // instruction) thus resolve to a nearby sibling — the same way whether
    // the container is a component like <section> or the document itself —
    // rather than centering a possibly-huge container.
    //
    // Runs only when the requested offset changes, so a host repeating the
    // same request must pass `null` in between (see the
    // `scrollToSourceOffset` prop docs).
    //
    // Placed here, before this component's several early `return null`
    // paths further down, so it's called unconditionally on every render
    // (skipping it on some renders but not others would violate the Rules
    // of Hooks).
    useEffect(() => {
        if (scrollToSourceOffset == null) {
            return;
        }

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

    // What the failure pane is showing.
    //
    // The pane replaces the document, so only a failure that means there is
    // no document may write here: a core that never started, saved state that
    // could not be processed (which stops the core from being started at
    // all), or a document the core could not build. What the host says about
    // state it *cannot produce* is a different fact — the document boots
    // without the reader's saved work — and goes to `stateLoadNotice` below
    // instead. Splitting the two is what took the last-writer-wins away from
    // a pane two unlike failures used to share (#1741); see
    // `showFailureMessage` for the rule the pane follows now.
    const [errMsg, setErrMsg] = useState<string | null>(null);
    // The host's own words for why it could not produce this document's saved
    // state, shown as a notice beside the document rather than in place of it
    // (#1741). Retired only by a rebuild or by an answer that does carry
    // usable state: a document that started without the reader's saved work
    // goes on being a document that started without it, and a successful boot
    // does not make that untrue the way it makes "no core" untrue.
    const [stateLoadNotice, setStateLoadNotice] = useState<string | null>(null);

    const cid = useRef<string | null>(null);
    const lastDoenetML = useRef<string | null>(null);
    const lastActivityId = useRef<string | null>(null);
    const lastDocId = useRef<string | null>(null);
    const lastAttemptNumber = useRef<number | null>(null);
    const lastRequestedVariantIndex = useRef<number | null>(null);
    const lastDocumentLocale = useRef<string | null>(null);
    // The content catalogs the core has been built with. Empty is the starting
    // state, not "not yet seen", so a host that never supplies any never
    // triggers a rebuild.
    const contentCatalogsBuilt = useRef<Set<string>>(new Set());
    // What the worker primed by the `initialPass && !render` branch was last
    // initialized with, so a re-render while `render` is still false does not
    // repeat an initialization that would report the same thing again. Held as
    // the values themselves rather than a joined key: `doenetML` is the whole
    // source, and this is compared on every render in that window.
    const lastNoRenderInit = useRef<unknown[] | null>(null);

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
    // The `coreId` whose core-start attempt has already been reported to
    // `coreStartFailedCallback` (#1709). `coreId` is re-rolled for every
    // rebuild of the document, so keying on it gives the callback exactly the
    // granularity it promises ("once per core-start attempt") and needs no
    // separate reset. See `reportCoreStartFailed`.
    const coreStartFailureReportedFor = useRef<string | null>(null);
    // Set by the unmount cleanup below. `startCore` waits several times over
    // — on the saved-state load, on each handshake, between retries (#1711) —
    // and the teardown that runs on unmount cannot cancel those waits, so
    // their other side checks this (`bootAbandoned`) rather than going on
    // booting a worker for a viewer that is gone.
    const viewerUnmounted = useRef(false);
    // The `coreId` whose boot ladder is running, or null between ladders. One
    // of `startCoreSafely`'s three callers is render-phase code that re-runs
    // on every re-render until the ladder moves `stage` off
    // `"readyToCreateCore"` — so a re-render during a boot launches a second
    // ladder for the same document. `bootAbandoned` cannot see that one: the
    // `coreId`s match, so neither twin stands aside, and both go through
    // `reinitializeCoreAndTerminateAnimations`, which owns the single
    // `coreWorker` ref — each disposing the other's worker. The window is
    // wide enough to catch an ordinary re-render: a boot spans a saved-state
    // load, a worker handshake, a backoff between attempts (#1711), and the
    // document evaluation that follows. A *rebuild* re-rolls `coreId`, so the
    // successor ladder it launches is never the one blocked here — that
    // supersession is `bootAbandoned`'s job, not this latch's.
    const bootLadderCoreId = useRef<string | null>(null);
    const coreId = useRef<string>("");
    const diagnostics = useRef<DiagnosticRecord[]>([]);
    // The same records as they arrived from the core, before their messages
    // were rendered in `uiLocale`. Kept so a locale change can re-render them:
    // localizing is not reversible, and the code and arguments a record still
    // carries describe the message, not the English already substituted in.
    const rawDiagnostics = useRef<DiagnosticRecord[]>([]);
    const [hasInitialError, setHasInitialError] = useState(false);

    // A core start the reader asked to try again (#1712).
    //
    //  - "offered" — a failure is on screen and still has a retry to give.
    //    Raised by `failCoreStart` for a first failure, and retired by
    //    `showFailureMessage` for any later message; see there for why the
    //    offer must not outlive the message it was raised with.
    //  - "running" — a retry is booting. A viewer at stage `"wait"` renders
    //    nothing, so without this a click would blank the pane for as long as
    //    the boot takes, which reads as the error getting worse. Set by the
    //    rebuild rather than by the click — see the rebuild below.
    const [coreStartRetry, setCoreStartRetry] = useState<
        "none" | "offered" | "running"
    >("none");
    // Bumped by the retry button, and compared below like any other rebuild
    // input. Nothing about the document changes on a retry, so the counter is
    // the whole trigger: it routes the retry through the same rebuild
    // sequence a changed `doenetML` takes — re-roll `coreId`, drop the old
    // renderer, re-load saved state, run a fresh boot ladder — rather than
    // adding a second way to start a core. Held in state (not a ref) because
    // the click has to re-render for the comparison to run;
    // `lastRetryGeneration` is its render-phase mirror, compared the way
    // `lastDoenetML` is compared against `doenetML`.
    const [retryGeneration, setRetryGeneration] = useState(0);
    const lastRetryGeneration = useRef(0);
    // Whether the reader has already spent their retry on the document now on
    // screen. A ref because `failCoreStart` runs from async boot code whose
    // closure predates the click.
    //
    // Every rebuild the reader did not ask for clears it (see the rebuild
    // below) — with one deliberate exception, which is why the rebuild the
    // `SPLICE.getState` listener runs clears `errMsg` without touching this.
    // That rebuild adopts an answer to the request THIS document has open,
    // and after a retry the open request is the one the retry itself posted —
    // the reader's own state load landing late, not a document handed to the
    // viewer from outside. Restoring the retry there would hand a fresh
    // button to every failure on any host that answers with saved state,
    // which is most of them, and the bound would stop bounding anything.
    const retrySpent = useRef(false);

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

    // The content's language — the `documentLocale` prop, overridden by an
    // authored `<document lang>`, English when neither says anything. What the
    // core translates into, and what the wrapper's `lang` reports. Seeded from
    // the prop so the wrapper is labeled correctly from the first paint, then
    // corrected once the source is parsed.
    const [effectiveDocumentLocale, setEffectiveDocumentLocale] = useState(() =>
        resolveDocumentLocale(undefined, documentLocale),
    );
    // The chrome's language: whatever the host configured, otherwise the
    // content's.
    const effectiveUiLocale = resolveUiLocale(
        uiLocale,
        effectiveDocumentLocale,
    );
    // The direction the *content* is written in, which is what the wrapper
    // lays out. The chrome inside it may run the other way and says so for
    // itself — see `useChromeLangDir`.
    const documentDirection = directionOf(effectiveDocumentLocale);
    // Every language the source declares, read straight out of the DoenetML.
    // `effectiveDocumentLocale` only ever names the outermost document's, and
    // it arrives from the worker after the core has been built; a *nested*
    // `<document lang>` renders its own subtree and would otherwise never have
    // a catalog asked for at all. Scanning the source is what gets both in
    // flight before the core exists, rather than after it has already computed
    // the subtree's prose in the wrong language.
    const declaredLocales = useMemo(
        () => declaredLangsInSource(doenetML),
        [doenetML],
    );
    // The languages the *core* renders in: what it computes depends on these
    // catalogs and no others, which makes them both the set to have loaded and
    // the set to gate a rebuild on.
    //
    // `effectiveDocumentLocale` starts as the prop's language and is corrected
    // to the authored `<document lang>` once the core has reported back, so it
    // lags a changed `documentLocale` by a round trip. The prop is listed
    // beside it so the new language starts loading at once rather than after
    // that trip. `effectiveDocumentLocale` earns its place the other way round:
    // it is the one thing that can name a language the source does not, since
    // content pulled in by an external reference joins the tree after this scan
    // has run.
    const contentLocales = useMemo(
        () => [
            resolveDocumentLocale(undefined, documentLocale),
            effectiveDocumentLocale,
            ...declaredLocales,
        ],
        [documentLocale, effectiveDocumentLocale, declaredLocales],
    );
    // Catalogs for every language in play, which is knowable only here: an
    // authored `<document lang>` is not in the props, so this is where a
    // code-split catalog for it gets loaded. Everything below reads
    // `availableCatalogs` rather than the prop — including the core, which is
    // handed them as `LocaleData.resources`.
    //
    // A content catalog that lands after the core has been created is an
    // arrival the gate below rebuilds on, the same as a changed
    // `documentLocale`. Loading always starts in an effect, so that race is
    // there for a language named in the props too — it is just usually won,
    // since `doenetml.tsx` asks for those catalogs in the same commit that
    // mounts this component while the core is still waiting on a worker.
    const availableCatalogs = useLocaleCatalogs(
        [effectiveUiLocale, ...contentLocales],
        localeResources,
    );
    // Which of the catalogs on hand the *content's* languages can reach.
    // Everything that decides whether the core has to be built again compares
    // these rather than the whole map — the rebuild gate at the bottom of this
    // component, and the initialization of the worker primed before `render`
    // turns true.
    //
    // Scoped to the content's languages because those are the only catalogs the
    // core reads. The chrome's live in the same map, and counting them would
    // rebuild the core whenever a reader switched `uiLocale` — discarding
    // whatever they had typed for a catalog the core never opens.
    //
    // Read off the loaded map rather than the prop, so a catalog that finished
    // loading after the core was created counts as having arrived.
    const contentCatalogsOnHand = useMemo(
        () => reachableCatalogLocales(contentLocales, availableCatalogs),
        [contentLocales, availableCatalogs],
    );
    // Bound to `translate` rather than a more descriptive name on purpose:
    // `lint:i18n` only recognizes call sites through a translator named `t` or
    // `translate`, so a key reached from here would otherwise read as an
    // orphan.
    const translate = useChromeTranslator(effectiveUiLocale, availableCatalogs);
    // The same catalogs negotiated against the *content's* language, for a
    // control the core already writes part of — see `useContentT`. Built from
    // `effectiveDocumentLocale`, which core initialization resolved by the same
    // rule the worker applies to reach `document.locale`, so the words this
    // renders and the words the worker computed cannot disagree.
    const translateContent = useChromeTranslator(
        effectiveDocumentLocale,
        availableCatalogs,
    );
    const formatDiagnostic = useDiagnosticFormatter(
        translate,
        effectiveUiLocale,
    );
    // Read through a ref rather than captured: `updateRenderers` is handed to
    // the core once, as a Comlink proxy, so the closure the worker calls is
    // whichever one existed when the core was created. `uiLocale` can change
    // after that without rebuilding the core, and a diagnostic arriving later
    // has to be rendered in the language in effect now.
    const formatDiagnosticRef = useRef(formatDiagnostic);
    formatDiagnosticRef.current = formatDiagnostic;

    useEffect(() => {
        resolvedUiLocaleCallback?.(effectiveUiLocale);
    }, [effectiveUiLocale, resolvedUiLocaleCallback]);

    /**
     * Store a batch of diagnostics, rendered in the chrome's language, and
     * hand them on.
     *
     * The single place diagnostics enter the viewer, so everything downstream
     * — the editor's panel, the LSP squiggles, a host's callback — sees one
     * consistent set of already-localized records.
     */
    function publishDiagnostics(newDiagnostics: DiagnosticRecord[]) {
        rawDiagnostics.current = newDiagnostics;
        diagnostics.current = localizeDiagnostics(
            newDiagnostics,
            formatDiagnosticRef.current,
        );
        setDiagnosticsCallback?.(diagnostics.current, doenetML);
    }

    // Re-render the diagnostics already on screen when the chrome's language
    // changes. `uiLocale` is main-thread only and deliberately doesn't rebuild
    // the core, so nothing else would resend them and the panel would keep
    // showing a batch in the previous language.
    useEffect(() => {
        if (rawDiagnostics.current.length > 0) {
            publishDiagnostics(rawDiagnostics.current);
        }
    }, [formatDiagnostic]);

    // The most recent state payload the core's 60-second database throttle is
    // holding back, mirrored here by `StatePersistence` as a report marked
    // `pending` (#1726). A page can go away without the viewer unmounting —
    // the tab is closed, a new URL is typed, an external link is followed, a
    // backgrounded mobile tab is discarded — and a React effect cleanup runs
    // for none of those. Keeping the payload in this realm is what lets
    // `flushPendingStateReport` hand it to the host without a round-trip into
    // the worker, which `pagehide` has no budget for. It is also what the
    // unmount cleanup delivers, the core's own teardown report being
    // suppressed by then — see that cleanup below.
    const pendingStateReport = useRef<StateReport | null>(null);

    // Report whatever the throttle is holding back, right now. Safe to call
    // repeatedly and safe to interleave with the core's own reports: the
    // buffer is taken before it is reported, so a given payload goes out at
    // most once from here, and the worst a race with a real report can produce
    // is a second copy of state the host already has. Must stay synchronous
    // throughout — see `deliverStateReport`.
    function flushPendingStateReport() {
        const pending = pendingStateReport.current;
        if (!pending) {
            return;
        }
        pendingStateReport.current = null;
        try {
            deliverStateReport(pending, { synchronous: true });
        } catch (err) {
            // Delivery runs host code — `reportScoreAndStateCallback` is a
            // plain synchronous call — and one of the callers is the unmount
            // cleanup, where a throw would skip the core-worker teardown that
            // follows and leak the worker. The buffer has already been taken
            // and there is nothing left to retry, so report the failure and
            // let the caller carry on.
            console.warn(
                "DocViewer: could not deliver the pending state report",
                err,
            );
        }
    }

    // Latest identity of the flush, for the mount-once listeners below to call
    // through — it closes over props (the host's own report callback among
    // them) whose identity can change between renders.
    const flushPendingStateReportRef = useRef(flushPendingStateReport);
    useEffect(() => {
        flushPendingStateReportRef.current = flushPendingStateReport;
    });

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
    function teardownCurrentCoreWorker({
        graceful,
        suspectWedge,
    }: {
        graceful: boolean;
        /**
         * Passed through to `disposeCoreWorker`, which otherwise infers the
         * suspicion from `graceful`. A handshake teardown states it outright
         * when the timeout that prompted it is better explained by page-wide
         * CPU contention than by a wedged worker (#1711).
         */
        suspectWedge?: boolean;
    }) {
        const remote = coreWorker.current;
        const kill = coreWorkerKill.current;
        coreWorker.current = null;
        coreWorkerKill.current = null;
        // Drop the throttled payload along with the core that produced it
        // (#1726). A rebuild replaces the document the payload belongs to, so
        // reporting it after the successor has reported would put stale state,
        // under a stale `cid`, over the host's newer record. The other caller
        // is the unmount cleanup below, which delivers the payload first —
        // there being no successor to overwrite.
        pendingStateReport.current = null;
        return disposeCoreWorker(remote, kill, { graceful, suspectWedge });
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
        documentLocale: effectiveDocumentLocale,
        uiLocale: effectiveUiLocale,
        showAnswerResponseButton,
        answerResponseCounts,
        reportGraphElementUp,
    };

    useEffect(() => {
        // Reset on (re)mount as well as set on unmount: under StrictMode the
        // same instance is mounted, torn down, and mounted again, and a
        // one-way flag would leave the second life marked as unmounted.
        viewerUnmounted.current = false;
        return () => {
            viewerUnmounted.current = true;
            // Hand the host whatever the throttle was holding back before the
            // teardown below drops it (#1726). The core's own teardown flush
            // does not cover this: `Core.terminate()` does report, but that
            // report arrives through `speakingFor`, which suppresses every
            // delivery once `viewerUnmounted` is set — so on an in-app
            // navigation the last minute of work reached nobody. The buffered
            // payload is up to one save-debounce older than what the core
            // would have built, and it is what actually gets out.
            flushPendingStateReportRef.current();
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
                // The request this viewer is waiting on, or null when it is
                // waiting on none: either none was ever made (a viewer handed
                // `initialState`, or one not allowed to load state at all) or
                // an answer has already been adopted below.
                const openRequestId = messageIdFromGetState.current;
                // A reply quoting the open request's id is this viewer's,
                // whatever it carries. A reply quoting a DIFFERENT id is not:
                // that id belongs to another request — one some rebuild has
                // replaced, or a second viewer's in the same window.
                const quotesOpenRequest =
                    openRequestId !== null &&
                    e.data.message_id === openRequestId;
                // An error may quote no id at all, and `message_id: null`
                // spells that absence out. It is the shape the protocol
                // originally specified, so hosts written against it send
                // exactly that and it has to keep working; the docs now
                // accept either and ask for the id where a host can send it
                // (see `SPLICE.getState` in `packages/standalone/README.md`).
                // An unaddressed reply addresses whatever request is open,
                // which is what this viewer's is.
                //
                // Only an error is read that way. Host replies are broadcast
                // to every viewer in the window, and `cid` cannot tell them
                // apart — it hashes the DoenetML text alone, so a second
                // attempt at the same document, or the same document opened
                // twice on a page, carries the identical `cid` under a
                // different `activity_id`/`doc_id`/`attempt_number`. An
                // unaddressed answer carrying STATE would be restored by all
                // of them, putting one reader's saved work into another's
                // document. An unaddressed error costs a notice beside the
                // document that the next usable answer clears.
                const isUnaddressedError =
                    openRequestId !== null &&
                    (e.data.message_id === undefined ||
                        e.data.message_id === null) &&
                    Boolean(e.data.error);
                if (quotesOpenRequest || isUnaddressedError) {
                    if (
                        quotesOpenRequest &&
                        e.data.state &&
                        e.data.state.cid === cid.current
                    ) {
                        // One request, one answer. A page can hold several
                        // listeners willing to answer: under the standalone
                        // coordinator the in-page warehouse answers a restored
                        // activity, while a persistence host (Runestone, a
                        // SCORM package) answers the same request out of
                        // durable storage. Processing every answer rebuilt the
                        // document from whichever landed LAST — and the
                        // durable one, a round trip to storage, lands second
                        // while possibly carrying older work than the reader
                        // has just done. Consuming the request here makes the
                        // first usable answer the one that counts.
                        //
                        // Only a usable answer consumes it: one carrying no
                        // state (a host with nothing saved for this activity)
                        // or state for a different `cid` must not shut out a
                        // better one still to come.
                        //
                        // A rebuild that then fails below keeps the request
                        // consumed on purpose: the failure is reported to the
                        // host (`reportCoreStartFailed`), so a later answer
                        // must not quietly start a core after that.
                        messageIdFromGetState.current = null;

                        // Reset error messages, core.
                        // Then process loaded state and initialize

                        // Clear unconditionally rather than when `errMsg` is
                        // set: this listener is installed once, with an empty
                        // dependency array, so the `errMsg` it closes over is
                        // forever the initial `null` and a guard reading it
                        // could never fire. That mattered once a page could
                        // hold more than one answerer — an error leaves the
                        // request open, so a listener reporting one before
                        // another returned usable state left the restored
                        // document behind a pane it could not clear.
                        // Both setters are idempotent.
                        setErrMsg(null);
                        setIsInErrorState?.(false);
                        // An answerer that does have the saved work retires
                        // an earlier answerer's report that it could not be
                        // had: the document about to be rebuilt is being
                        // restored, so nothing was lost after all.
                        setStateLoadNotice(null);

                        coreId.current = nanoid();
                        initialCoreData.current = null;
                        coreInfo.current = null;
                        setDocumentRenderer(null);
                        coreCreated.current = false;
                        coreCreationInProgress.current = false;
                        loadedInitialRendererState.current = false;

                        try {
                            processLoadedDocState(e.data.state);
                        } catch (err: any) {
                            // Malformed host-persisted state. Everything from
                            // the `coreId` re-roll above to here is
                            // synchronous, so this handler still owns the
                            // attempt it is failing. The core will never be
                            // started, so a host holding a boot slot for this
                            // document has to hear about it (#1709). Report
                            // just the failure signal, keeping the specific
                            // message below on screen: `failCoreStart` would
                            // raise the generic one over it, and offer a retry
                            // that would put the same state to the same
                            // parser.
                            let message = "";
                            if ("message" in err) {
                                message = err.message;
                            }
                            showFailureMessage(
                                `Error loading doc state: ${message}`,
                            );
                            reportCoreStartFailed();
                            return;
                        }

                        if (render) {
                            startCoreSafely();
                        } else {
                            setStage("readyToCreateCore");
                        }
                    } else if (e.data.error) {
                        // A host that cannot produce this document's saved
                        // state, saying why — or a page that is not a host at
                        // all, of which more below. When it is a host, its
                        // message is a notice beside the document, never in
                        // place of it (#1741): the boot does not wait for
                        // this answer and the request is left open (see
                        // above), so an error can land at any point in a
                        // perfectly healthy document's life — including
                        // minutes in, on a reader who is working in it. What
                        // it reports is that the document started without the
                        // reader's saved work, which is worth saying and is
                        // not a reason to take the document away.
                        //
                        // Reached only after the state test above, so a reply
                        // carrying both is read as state: a host that produced
                        // usable state has answered, whatever else it also
                        // reported.
                        //
                        // Only a string `message` is shown. It is stored and
                        // later rendered as a React child, so anything else
                        // throws there: beside the document that throw would
                        // reach the error boundary and replace exactly the
                        // document this branch exists to keep, and beneath
                        // the failure pane, which is returned above that
                        // boundary, nothing would catch it at all. Outside
                        // the platform set the `code` only labels the console
                        // line, and is not required — a reply carrying only
                        // text still has text to show.
                        //
                        // No shape test guards the two reads: this branch is
                        // gated on `error` being truthy, which is all it
                        // takes for reading a field off it to be safe. An
                        // `error` that is a bare string or number has
                        // neither field and falls to the unreadable case
                        // below, exactly as an object missing them does.
                        const error = e.data.error;
                        const code = error.code;
                        const message =
                            typeof error.message === "string"
                                ? error.message
                                : undefined;

                        if (
                            typeof code === "string" &&
                            NON_SPLICE_PLATFORM_ERROR_CODES.has(code)
                        ) {
                            // Not a host: a platform saying it will not act
                            // on what was asked of it. Nothing to tell the
                            // reader — see
                            // `NON_SPLICE_PLATFORM_ERROR_CODES`. The whole
                            // error goes to the console, so a host that
                            // reached for one of these codes for a real load
                            // failure can see its own message being dropped.
                            console.log(
                                `ignoring "${code}" answer to SPLICE.getState from a page that does not speak SPLICE`,
                                error,
                            );
                        } else if (message !== undefined) {
                            console.log(
                                code === undefined
                                    ? `error getting state: ${message}`
                                    : `error ${code} getting state: ${message}`,
                            );
                            setStateLoadNotice(message);
                        } else {
                            // An error the viewer cannot put on screen. The
                            // host is told what is wrong with it, and the
                            // reader is told nothing: the only text available
                            // to show would be the viewer's own, and
                            // "Invalid response to getState" — which is what
                            // used to appear here — describes the host's bug
                            // to someone who cannot act on it, over a
                            // document that is working. A host with a load
                            // failure worth reporting reports it as the
                            // documented `{ code, message }`.
                            console.warn(
                                "Ignoring an unreadable error in a SPLICE.getState response; a reportable failure needs a string `message`:",
                                error,
                            );
                        }
                    }
                    // A reply with neither usable state nor an error is a host
                    // saying it has nothing saved for this document: nothing
                    // to show, and the request left open for an answerer that
                    // does have something.
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

    // Hand the host whatever the core's database throttle is holding back
    // before this document can be discarded (#1726).
    //
    // `pagehide` covers a real teardown — tab closed, URL typed, external link
    // followed. `visibilitychange` → hidden covers what that misses: a
    // backgrounded tab can be discarded without firing anything else. The two
    // overlap on an ordinary unload, which costs nothing — the buffer is taken
    // by whichever fires first, so the second finds it empty.
    //
    // Neither event tears anything down, so a bfcache `pagehide`
    // (`persisted: true`) needs no special case — the core stays alive, the
    // page can come back, and the reader's work simply reached the host early.
    //
    // Deliberately separate from the visibility-measuring listener below,
    // which is keyed to the core's lifetime: flushing has to be armed from
    // mount, before (and after) there is a core to talk to.
    useEffect(() => {
        function flush() {
            flushPendingStateReportRef.current();
        }
        function visibilityFlushListener() {
            if (document.visibilityState === "hidden") {
                flush();
            }
        }

        window.addEventListener("pagehide", flush);
        document.addEventListener("visibilitychange", visibilityFlushListener);

        return () => {
            window.removeEventListener("pagehide", flush);
            document.removeEventListener(
                "visibilitychange",
                visibilityFlushListener,
            );
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

    // Push reader style overrides into the core when the host changes them
    // after initialization (the initial value rides in with
    // `generateJavascriptDast`). Serialized comparison so a host passing a
    // fresh-but-equal object each render doesn't trigger spurious updates.
    const lastSentStyleOverrides = useRef<string | undefined>(undefined);
    useEffect(() => {
        const serialized = JSON.stringify(styleOverrides ?? null);
        if (lastSentStyleOverrides.current === undefined) {
            // First run: the initial value was already delivered at core
            // initialization; just record it.
            lastSentStyleOverrides.current = serialized;
            return;
        }
        if (serialized === lastSentStyleOverrides.current) {
            return;
        }
        lastSentStyleOverrides.current = serialized;
        callAction({
            action: { actionName: "setStyleOverrides" },
            args: {
                styleOverrides: styleOverrides ?? null,
                doNotIgnore: true,
            },
        });
    }, [styleOverrides]);

    /**
     * Initialize a core worker for this document, recording the content
     * language it resolved to.
     *
     * That language depends on the DoenetML (an authored `<document lang>`
     * overrides the prop), so it isn't known until the source has been parsed
     * — which `initializeCoreWorker` does anyway.
     */
    async function initializeCoreWorkerForDoc(
        worker: Remote<CoreWorker>,
        ownerCoreId = coreId.current,
    ) {
        // `ownerCoreId` is the document this initialization speaks for. A
        // rebuild re-rolls `coreId` while these round trips are in flight and
        // starts its own initialization, so a completion arriving afterwards
        // must not announce the superseded document's structure or locale —
        // the successor announces its own. Callers launched before the
        // re-roll (a boot ladder) pass the id they captured; the default
        // serves call sites that hold ownership when they call.
        const result = await initializeCoreWorker({
            coreWorker: worker,
            doenetML,
            flags,
            activityId,
            docId,
            requestedVariantIndex,
            attemptNumber,
            documentStructureCallback: documentStructureCallback
                ? (structure: unknown) => {
                      if (stillSpeaksForDocument(ownerCoreId)) {
                          documentStructureCallback(structure);
                      }
                  }
                : undefined,
            fetchExternalDoenetML,
            documentLocale,
            localeResources: availableCatalogs,
        });
        if (stillSpeaksForDocument(ownerCoreId)) {
            setEffectiveDocumentLocale(result.resolvedDocumentLocale);
        }
        return result;
    }

    async function reinitializeCoreAndTerminateAnimations(
        ownerCoreId = coreId.current,
    ) {
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

        await initializeCoreWorkerForDoc(remote, ownerCoreId);

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

    function initializeRenderers(
        args: Record<string, any>,
        ownerCoreId = coreId.current,
    ) {
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
                    // The chunk imports above are the longest wait in here; a
                    // rebuild can land while they resolve, and this
                    // continuation would then commit the superseded
                    // document's renderer tree keyed by `coreId.current` —
                    // by now the successor's id — over the document that
                    // replaced it.
                    if (!stillSpeaksForDocument(ownerCoreId)) {
                        return;
                    }
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
            publishDiagnostics(newDiagnostics);
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
        pending = false,
    }: {
        score: number;
        state: unknown;
        /**
         * Set by the core's `StatePersistence` (#1726): this is a mirror of
         * the payload the core's 60-second database throttle is holding back,
         * not a report the host should save yet. Buffer it here in the main
         * realm so `flushPendingStateReport` can hand it over synchronously
         * when the page hides — by then there is no budget for the Comlink
         * round-trip that would otherwise be needed to fetch it.
         */
        pending?: boolean;
    }) {
        // The ids come from this closure, which the core was handed at
        // initialization, so they are the ids of the document that produced
        // the report — not whatever the props name by the time it goes out.
        const report: StateReport = { score, state, activityId, docId };

        if (pending) {
            pendingStateReport.current = report;
            return;
        }

        // A real report carries the same or newer state than anything the
        // core was holding back, so it supersedes the buffer — but only once
        // it has actually reached the host, and on the message channel
        // `deliverStateReport` merely queues a task. Hold the report in the
        // buffer until that task has had its turn: a hide landing in between
        // then still hands the work over synchronously, rather than finding
        // an empty buffer while the queued report dies with the document.
        pendingStateReport.current = report;
        deliverStateReport(report);
        retireDeliveredStateReport(report);
    }

    /**
     * Drop `report` from the buffer once the task `deliverStateReport` queued
     * has had its turn, leaving anything newer alone.
     *
     * A timer is a heuristic, not a guarantee: posted messages and timer
     * callbacks are separate task sources, so nothing promises the report is
     * delivered first. It is the safe direction to be wrong in — clearing
     * early is exactly what this viewer did before, and clearing late costs at
     * most one duplicate report of state the host already has. What it buys is
     * that the ordinary case, where the report is delivered on the very next
     * turn, no longer has a window in which the buffer is empty and the
     * report is still in flight.
     */
    function retireDeliveredStateReport(report: StateReport) {
        setTimeout(() => {
            if (pendingStateReport.current === report) {
                pendingStateReport.current = null;
            }
        }, 0);
    }

    /**
     * Hand a state report to whoever is listening for one: the host's
     * `reportScoreAndStateCallback` when it passed one, otherwise the
     * `SPLICE.reportScoreAndState` message channel (to the parent window when
     * `flags.messageParent` is set, else to this one).
     *
     * `synchronous` is for the page-hide flush (#1726), and only affects the
     * message channel — a host callback is a plain call and always was.
     * `postMessage` merely queues a task, and a document being unloaded is
     * torn down without its task queue ever being drained, so a report posted
     * from `pagehide` is silently dropped — precisely the loss this exists to
     * prevent. Dispatching the same `message` event by hand runs the host's
     * listeners inline instead. The host sees the message a `postMessage`
     * would have delivered: same `data`, same `origin`, same `source` — the
     * last of which has to hold, since the standalone coordinator identifies
     * the reporting viewer by `event.source`. What differs is the timing,
     * `isTrusted` (nothing on this channel reads it), and that `data` is
     * passed by reference rather than structured-cloned (hosts consume it
     * where they receive it).
     *
     * Synchronous delivery only buys time if what receives it is synchronous
     * too. Two known places where it is not, both documented as gaps on
     * Doenet/DoenetML#1726: a host whose `message` listener persists by
     * deferring (a `fetch`, a `setTimeout`) rather than by `sendBeacon` or
     * synchronous storage, and a viewer running inside `@doenet/doenetml-iframe`
     * whose host passed `reportScoreAndStateCallback` — that callback is a
     * Comlink proxy across the iframe boundary, so calling it only posts.
     */
    function deliverStateReport(
        report: StateReport,
        { synchronous = false }: { synchronous?: boolean } = {},
    ) {
        if (specifiedReportScoreAndStateCallback) {
            specifiedReportScoreAndStateCallback(report);
            return;
        }

        const target =
            flags.messageParent && window.parent ? window.parent : window;
        const message = {
            score: report.score,
            state: report.state,
            subject: "SPLICE.reportScoreAndState",
            activity_id: report.activityId,
            doc_id: report.docId,
            message_id: nanoid(),
        };

        if (synchronous) {
            try {
                target.dispatchEvent(
                    new MessageEvent("message", {
                        data: message,
                        origin: window.origin,
                        source: window,
                    }),
                );
                return;
            } catch (err) {
                // A cross-origin parent is the expected way to land here: such
                // a window exposes `postMessage` and little else. That embed
                // was never served by this channel anyway — the post below has
                // no `targetOrigin`, which defaults to same-origin — so the
                // fallback preserves existing behavior rather than rescuing
                // it. Warn so the silence is at least visible.
                console.warn(
                    "DocViewer: could not deliver the state report synchronously; falling back to postMessage",
                    err,
                );
            }
        }

        target.postMessage(message);
    }

    /**
     * Prepare the document's starting state — its content hash, and whatever
     * saved renderer/core state can be recovered for it — then hand off to the
     * boot ladder (or park at `"readyToCreateCore"` for a viewer that is not
     * rendering yet).
     *
     * `coreIdWhenCalled` is the `coreId` this load was launched for, taken as
     * a parameter the way `startCore` takes it so the launch site and the load
     * judge staleness against one value rather than each reading the ref.
     * Everything written below a wait is written only while that id is still
     * the document's — see `stillSpeaksForDocument`.
     */
    async function loadStateAndInitialize(coreIdWhenCalled: string) {
        let loadedState = false;

        // [#1714] Test seam — hold the load open (or fail it) across a
        // rebuild, which is what makes the load's staleness guards — the ones
        // below, and the safety net at its launch site — reachable
        // deterministically. Inert in production.
        if (doenetGlobalConfig.__doenetTestCoreInitHook) {
            await doenetGlobalConfig.__doenetTestCoreInitHook("stateLoad", 0);
        }

        const documentCid = await cidFromText(doenetML);
        if (!stillSpeaksForDocument(coreIdWhenCalled)) {
            // Superseded (or unmounted) while hashing. Nothing below is this
            // load's to write any more: `cid` and `initialCoreData` are what
            // the successor's own core is started from, and its load has
            // already reset them.
            return;
        }
        cid.current = documentCid;

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

            if (!stillSpeaksForDocument(coreIdWhenCalled)) {
                // Same rule after the IndexedDB read, which is the longest
                // wait here: handing the successor's core the state saved for
                // the document it replaced would start it from the wrong
                // renderer state entirely.
                return;
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

                initializeRenderers(
                    {
                        rendererState,
                        coreInfo,
                    },
                    coreIdWhenCalled,
                );

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
                    if (!stillSpeaksForDocument(coreIdWhenCalled)) {
                        // This load belongs to a document that has since been
                        // rebuilt, or to a viewer that has gone away, so the
                        // failure is not its to report — the same rule the
                        // boot ladder follows.
                        return;
                    }
                    let message = "";
                    if ("message" in e) {
                        message = e.message;
                    }
                    showFailureMessage(`Error loading doc state: ${message}`);
                    // The core will never be started, so a host holding a boot
                    // slot for this document has to hear about it (#1709).
                    // Report just the failure signal, keeping the specific
                    // message above on screen: `failCoreStart` would raise the
                    // generic one over it, and offer a retry that would put
                    // the same state to the same parser.
                    reportCoreStartFailed();
                    return;
                }
            }
        }

        //Guard against the possibility that parameters changed while waiting
        if (stillSpeaksForDocument(coreIdWhenCalled)) {
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

    /**
     * Put `message` on the viewer's failure pane, in place of whatever the
     * document was showing. The single way a failure that leaves no document
     * reaches the reader, so that the pane's two pieces cannot drift apart:
     * `offerRetry` says whether this message comes with the **Try again**
     * button (#1712), and every message that does not clears an offer a
     * previous one made.
     *
     * The rule the pane follows, which is what #1741 asked for, is a rule
     * about *what may write here* rather than about which writer wins. The
     * pane is reserved for the failures that leave no document at all — no
     * core started, saved state that could not be processed, a document the
     * core could not build — and every one of those ends this document's
     * boot: each returns without starting a core (or, for a failed
     * evaluation, is the ladder's own last word), and the pane's early return
     * in the render below stops another ladder from launching behind it. So
     * there is one pane message per `coreId`, and a rebuild — which re-rolls
     * `coreId` — clears it before the next one can be raised.
     *
     * The failure that used to fight this pane for the reader's attention is
     * no longer on it. A host reporting that it cannot produce the saved
     * state can land anywhere in a document's life, because the boot does not
     * wait for that answer and the request stays open; it now writes
     * `stateLoadNotice`, which renders *beneath* whatever the pane is saying
     * rather than in place of it. Both facts reach the reader, in either
     * arrival order, and **Try again** stays with the core-start failure it
     * addresses.
     *
     * A writer added to this pane later has to keep the reservation above —
     * in particular, a failure state rendered in place of the early return
     * would let a second ladder launch behind the pane, and with it a second
     * message.
     */
    function showFailureMessage(
        message: string,
        { offerRetry = false }: { offerRetry?: boolean } = {},
    ) {
        setIsInErrorState?.(true);
        setErrMsg(message);
        setCoreStartRetry(offerRetry ? "offered" : "none");
    }

    /**
     * Take down a failure pane raised while this document was still starting,
     * now that it has started.
     *
     * The pane covers the document rather than sitting beside it, so a message
     * that outlives what it described hides a working document — and a
     * `SPLICE.getState` answer keeps its own schedule: the boot posts the
     * request and does not wait for it (see `requestStateViaSplice`), so a
     * host reporting that it cannot produce the saved state can land anywhere
     * in a perfectly healthy boot, including inside a retry the reader asked
     * for. What that message described — a document with no core — stopped
     * being true here; what the core has to say about itself (its diagnostics,
     * its error banner) speaks for the document from now on.
     *
     * Only what a boot can supersede is cleared. `stateLoadNotice` is not:
     * a host that could not produce the reader's saved work still could not,
     * and the document now on screen is the one that started without it.
     */
    function clearFailureMessage() {
        setIsInErrorState?.(false);
        setErrMsg(null);
        setCoreStartRetry("none");
    }

    // Put the viewer into a visible "core failed to start" error state rather
    // than leaving it blank at stage "wait" forever (Doenet/DoenetApps#2957).
    // Shared by every core-start failure path.
    function failCoreStart({
        contended = false,
    }: { contended?: boolean } = {}) {
        coreCreationInProgress.current = false;
        // The first failure offers the reader a button, beside a message with
        // no reload advice in it; a failure that has already been retried is
        // terminal and gets the message that advises the reload — which is
        // also what keeps that message, and its translations, in use (#1712).
        //
        // The four messages are spelled out as four literal `translate` calls
        // because a computed key is invisible to `lint:i18n`, which reads
        // string literals only (see `collectCallSites` in `@doenet/i18n`).
        const offerRetry = !retrySpent.current;
        let message: string;
        if (offerRetry) {
            message = contended
                ? translate(
                      "core-start-failed-busy-retry",
                      undefined,
                      CORE_START_FAILED_BUSY_RETRY_MESSAGE,
                  )
                : translate(
                      "core-start-failed-retry",
                      undefined,
                      CORE_START_FAILED_RETRY_MESSAGE,
                  );
        } else {
            message = contended
                ? translate(
                      "core-start-failed-busy",
                      undefined,
                      CORE_START_FAILED_BUSY_MESSAGE,
                  )
                : translate(
                      "core-start-failed",
                      undefined,
                      CORE_START_FAILED_MESSAGE,
                  );
        }
        showFailureMessage(message, { offerRetry });
        setHasInitialError(true);
        reportCoreStartFailed();
    }

    /**
     * Start this document over at the reader's request (#1712), without
     * reloading the page. Bumping the counter is the whole of it: the render
     * below reads the bump as a rebuild input and runs the rebuild from
     * there.
     *
     * Stacking is not possible by construction: the button lives in the
     * failure pane, and the rebuild this schedules clears `errMsg` in the
     * very next render, so a second click has nothing to land on. Two clicks
     * inside one React batch collapse into a single rebuild, since it is the
     * *change* in `retryGeneration` that triggers one.
     *
     * Nothing here asks a boot-scheduling host for a slot: the gates that
     * exist (`coordinator.ts`, `viewer-lifecycle-manager`) live in the parent
     * realm, gate mounting rather than re-booting, and accept no such request
     * from a child. What bounds a retry instead is the contention-scaled
     * handshake watchdog (#1711), which counts its handshake in the page-wide
     * census like any other.
     */
    function retryCoreStart() {
        setRetryGeneration((generation) => generation + 1);
    }

    /**
     * What a document shows while it has nothing to render yet. Used both
     * where a booting core has produced no renderer and while a
     * reader-initiated retry is running (#1712).
     */
    function initializingPane() {
        return (
            <div
                // Announced, because this pane can be an *answer*: the retry
                // button removes itself when clicked (#1712), taking the
                // reader's focus with it, so a reader who cannot see the pane
                // that replaced it would otherwise be told nothing at all
                // about what their click did. Polite rather than assertive —
                // it reports progress, and the outcome that follows is what
                // interrupts (see the failure pane's `role="alert"`).
                role="status"
                style={{
                    backgroundColor: "var(--canvas)",
                    color: "var(--canvasText)",
                }}
            >
                <p>
                    {translate(
                        "viewer-initializing",
                        undefined,
                        "Initializing...",
                    )}
                </p>
            </div>
        );
    }

    /**
     * Tell a boot-scheduling host that this document's core-start attempt is
     * over and failed (#1709), so it can free the slot it is holding rather
     * than wait out its own watchdog.
     *
     * At most once per attempt: several paths can conclude the same one —
     * `startCore` reports the failure and returns, and `startCoreSafely`
     * reports again if that same call also throws — and a host that released
     * a slot per notification would over-release. A rebuild re-rolls `coreId`,
     * which is what makes the next attempt reportable again.
     */
    function reportCoreStartFailed() {
        if (coreStartFailureReportedFor.current === coreId.current) {
            return;
        }
        coreStartFailureReportedFor.current = coreId.current;
        coreStartFailedCallback?.({ activityId, docId });
    }

    // The core-worker *handshake*: (re)create the worker and run the cheap,
    // roughly size-independent init round-trips (set source/flags, initialize
    // the JS core). This is the phase a Doenet/DoenetApps#2957 stall lives in,
    // so `startCore` wraps it in a watchdog. The expensive `generateDast` step
    // happens AFTER this returns and is deliberately NOT watchdogged.
    async function handshakeCore(
        attempt: number,
        ownerCoreId: string,
    ): Promise<Remote<CoreWorker>> {
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
            thisCoreWorker =
                await reinitializeCoreAndTerminateAnimations(ownerCoreId);
        } else {
            // attempt 0, a worker already exists, and its core isn't created —
            // reuse that worker (skipping a fresh boot + WASM init) and just
            // (re)initialize it with the current DoenetML. Two ways to be here:
            // the initial-pass `!render` branch pre-created a worker to report
            // document structure, or a document/parameter change reset
            // `coreCreated` while keeping the existing worker.
            await initializeCoreWorkerForDoc(thisCoreWorker, ownerCoreId);
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

    /**
     * Does the work launched for `launchedFor` — a boot ladder, or the state
     * load that precedes one — still speak for this document?
     *
     * `coreId` is re-rolled whenever the document is rebuilt, and each rebuild
     * launches its own load and ladder, so a `coreId` that has moved on means
     * the outcome is the successor's; an unmounted viewer means it is nobody's.
     * Either way the older work must not act. Two ladders in flight tear down
     * each other's worker (both go through
     * `reinitializeCoreAndTerminateAnimations`, which owns the single
     * `coreWorker` ref) and fail a document that is booting fine; a stale
     * conclusion of either kind puts its message over what the successor has
     * on screen, and spends the successor's single `reportCoreStartFailed`,
     * which latches on the CURRENT `coreId`.
     *
     * The waits on both paths make that window wide: a load awaits a cid and
     * then IndexedDB, and a boot awaits a handshake per attempt, backs off
     * between attempts (#1711), and then evaluates. (The `SPLICE.getState`
     * round trip a load may start is not one of them: the load never awaits
     * it. It posts the request and hands straight off to the boot, and the
     * response is picked up later by the message listener above, matched
     * against the message id and `cid` current *then* — so it acts for
     * whatever document the viewer is showing by then, re-rolling `coreId`
     * and launching a ladder of its own, which is what stands the running one
     * aside.)
     *
     * Consulted everywhere a losing operation could speak for the document:
     * the staleness checks inside `loadStateAndInitialize` and at its launch
     * site, the `bootAbandoned` checks inside `startCore`, and the
     * unexpected-throw handler in `startCoreSafely`.
     */
    function stillSpeaksForDocument(launchedFor: string) {
        return !viewerUnmounted.current && coreId.current === launchedFor;
    }

    async function startCore(coreIdWhenCalled: string) {
        setHasInitialError(false);

        /** Has this ladder been superseded, or the viewer torn down? */
        function bootAbandoned() {
            return !stillSpeaksForDocument(coreIdWhenCalled);
        }
        /**
         * Wind up a ladder that no longer owns the document, disposing
         * whatever it created — which is nothing when a NEWER ladder took
         * over: that ladder's `reinitializeCoreAndTerminateAnimations` has
         * already disposed this one's worker and put its own on the shared
         * `coreWorker` ref, so tearing that down here would fail the document
         * that is booting fine. After an unmount there is no successor and the
         * unmount teardown has already run, so this is the only thing left
         * that can release a worker this ladder created afterwards.
         *
         * Every `bootAbandoned()` exit below goes through here, so the rule
         * holds wherever the ladder happens to notice it has been abandoned.
         */
        async function standDown() {
            if (viewerUnmounted.current) {
                await teardownCurrentCoreWorker({ graceful: true });
            }
        }

        const maxAttempts = Math.max(
            1,
            doenetGlobalConfig.coreBootMaxAttempts ??
                DEFAULT_CORE_BOOT_MAX_ATTEMPTS,
        );
        // An explicit host override is a statement about that deployment —
        // notably one using `fetchExternalDoenetML`, whose network expansion
        // runs inside the handshake — so it wins outright over the
        // contention-scaled budget below (#1711).
        const handshakeWatchdogOverride =
            doenetGlobalConfig.coreHandshakeWatchdogMs;
        // Absent the hint, assume a single core: a browser that will not say
        // how many it has is not evidence of a fast machine.
        const cores = reportedCores() || 1;
        /**
         * The watchdog budget for a given contention reading. One place, so
         * that the override's precedence holds identically for the reading an
         * attempt opens with and for the one its census seat brings back —
         * and monotonic in that reading (both `handshakeWatchdogMsFor` and a
         * fixed override are), so re-deriving a budget from a count that has
         * since risen can only ever give a wider one.
         */
        function budgetMsFor(concurrentHandshakes: number): number {
            return (
                handshakeWatchdogOverride ??
                handshakeWatchdogMsFor({
                    concurrentHandshakes,
                    hardwareConcurrency: cores,
                })
            );
        }

        // --- Phase 1: handshake — watchdogged and retried ---
        // Only this cheap, size-independent phase is time-boxed. A stall here
        // means a hung/wedged worker (Doenet/DoenetApps#2957), not slow work.
        let thisCoreWorker: Remote<CoreWorker> | null = null;
        let handshakeSucceeded = false;
        // Whether the attempt that gave up did so on a page contended enough
        // that the failure is better explained by pressure than by a broken
        // document (#1711) — which is what `failCoreStart` below turns into
        // the busy-page wording.
        let lastFailureWasContended = false;

        // From here a census seat is held, so every exit — the abandonment
        // returns below included — runs through the `finally` that frees it.
        let censusHandle: Promise<HandshakeCensusSeat> | null = null;
        try {
            // Join the page-wide handshake count for as long as this ladder is
            // handshaking, so sibling realms sizing their own watchdogs can
            // see it (#1711). Released by the `finally` below — at the end of
            // the handshake phase, not of the ladder, since what the count
            // measures is handshakes in flight and the evaluation that follows
            // is not one. Purely observational — shared mode, so it never
            // blocks.
            // NOT awaited: joining is bookkeeping, and an await here is a
            // suspension point in the middle of a boot. See
            // `concurrentHandshakesSnapshot` for what that cost. The count
            // the seat carries is consumed by the first attempt below (#1718).
            // The seat deliberately spans the whole ladder, retry backoff
            // included: a ladder in backoff is pressure about to return, so
            // siblings sizing watchdogs against it err long — the safe
            // direction — and a seat taken and released per attempt would put
            // extra lock operations next to every handshake for a count that
            // is already, by documented contract, one refresh behind.
            censusHandle = joinHandshakeCensus();
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                if (bootAbandoned()) {
                    // Re-checked before each attempt, because a retry waits
                    // too: creating a worker for a viewer that is gone leaks
                    // it, and racing a newer ladder breaks the document that
                    // one is booting.
                    await standDown();
                    return;
                }
                // Refresh again each attempt: a page of activities drains as
                // they finish, so a retry is judged against the pressure it
                // actually faces rather than the pressure at entry. The
                // reading taken next is the one the PREVIOUS refresh produced
                // — the backoff between attempts is what it lands in.
                refreshHandshakeCensusCount();
                // The contention this attempt is judged against — its budget
                // and, if it fails, its wording. Mutable, because attempt 0's
                // own census seat can raise it while the attempt is running
                // (below); since `budgetMsFor` is monotonic in it, re-deriving
                // a budget from it gives whichever one is in force by then.
                let concurrentHandshakes = concurrentHandshakesSnapshot();
                const openingWatchdogMs = budgetMsFor(concurrentHandshakes);
                // A realm's first attempt reads a cache no boot has refreshed
                // yet, so it sizes — and attributes — itself as the only boot
                // on the page; a fresh PreTeXt iframe, the very case #1711
                // exists for, is exactly that boot (#1718). The seat this
                // ladder is already taking counted the page from inside its
                // grant, so that is where the first attempt's reading comes
                // from instead.
                //
                // Never awaited, and consumed wherever it lands: the count
                // arrives a lock grant and a query after the handshake
                // started — far inside even the base budget — so it widens a
                // deadline already running, and `startCore` gains neither a
                // suspension point nor a lock operation of its own. Both of
                // those constraints are real and separate:
                // `concurrentHandshakesSnapshot` records what an await here
                // cost, and `joinHandshakeCensus` why a query must not sit
                // immediately ahead of a lock request (#1713).
                //
                // Attempt 0 only. A later attempt is answered by the refresh
                // above from the attempt before it, which describes the page
                // the retry actually faces, whereas the seat's reading is
                // only ever the pressure at the ladder's entry.
                //
                // It can only ever grant more time: `withTimeout` ignores a
                // later budget below the one in force, so a seat that saw a
                // quieter page than the cache leaves the deadline alone. And
                // where a host override fixes the budget, `budgetMsFor`
                // returns it unchanged — the seat then moves only the count
                // the failure wording reads.
                const seatWidenedWatchdogMs =
                    attempt === 0
                        ? censusHandle.then(async (seat) => {
                              concurrentHandshakes = Math.max(
                                  concurrentHandshakes,
                                  await seat.count,
                              );
                              return budgetMsFor(concurrentHandshakes);
                          })
                        : null;
                try {
                    thisCoreWorker = await withTimeout(
                        () => handshakeCore(attempt, coreIdWhenCalled),
                        openingWatchdogMs,
                        `core worker handshake (attempt ${attempt + 1}/${maxAttempts})`,
                        seatWidenedWatchdogMs,
                    );
                    handshakeSucceeded = true;
                    break;
                } catch (err) {
                    if (bootAbandoned()) {
                        // Superseded or unmounted while this attempt was in
                        // flight — often *because* of it: a rebuild disposes
                        // the worker through
                        // `reinitializeCoreAndTerminateAnimations`, which is
                        // what made the attempt fail. So neither the failure
                        // nor the worker ref is this ladder's any more: it
                        // must not report an error over a document that is
                        // booting fine, and must not tear down the successor's
                        // worker.
                        console.warn(
                            "DocViewer: abandoning a superseded core worker handshake",
                            err,
                        );
                        await standDown();
                        return;
                    }
                    // Only a watchdog expiry can be blamed on the page; see
                    // `isHandshakeTimeout` for why an outright rejection must
                    // not be.
                    const contended =
                        isHandshakeTimeout(err) &&
                        timeoutLooksLikeContention({
                            concurrentHandshakes,
                            hardwareConcurrency: cores,
                        });
                    // Remembered for the failure wording (#1712): if the last
                    // attempt timed out under pressure, say so rather than
                    // presenting an unexplained error.
                    lastFailureWasContended = contended;
                    // The budget is logged as context, not as elapsed time:
                    // only a watchdog expiry takes the whole budget, while an
                    // outright rejection (a worker script that 404s) fails as
                    // fast as the error arrives. The `err` printed alongside
                    // says which of the two happened. Re-derived rather than
                    // read from `openingWatchdogMs`, so a seat that widened
                    // this attempt is reported as having done so.
                    console.warn(
                        `DocViewer: core worker handshake attempt ${attempt + 1} ` +
                            `of ${maxAttempts} failed (watchdog ${budgetMsFor(concurrentHandshakes)}ms; ` +
                            `${concurrentHandshakes} handshake(s) in flight on ${cores} core(s))` +
                            (attempt + 1 < maxAttempts
                                ? "; retrying with a fresh worker."
                                : "; giving up."),
                        err,
                    );
                    // The worker may be wedged (a hung round-trip leaves its
                    // serialization queue — and its own terminate() — stuck), so
                    // force-kill it natively and drop the refs; the next attempt
                    // starts from a brand-new Worker. On a demonstrably
                    // contended page the wedge suspicion is withheld — see
                    // `timeoutLooksLikeContention` for what a false one costs.
                    await teardownCurrentCoreWorker({
                        graceful: false,
                        suspectWedge: !contended,
                    });
                    coreCreated.current = false;
                    coreCreationInProgress.current = false;
                    if (attempt + 1 < maxAttempts) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, retryDelayMs(attempt)),
                        );
                    }
                }
            }
        } finally {
            censusHandle
                ?.then((seat) => seat.release())
                .catch(() => {
                    // `joinHandshakeCensus` swallows its own failures and
                    // resolves to a no-op seat, so there is nothing to handle
                    // here; the handler only satisfies "no fire-and-forget
                    // promises".
                });
        }

        if (bootAbandoned()) {
            // The ladder is done, but for a document that has since been
            // rebuilt or a viewer that has gone away. Neither outcome is
            // still this ladder's to deliver: evaluating a won handshake
            // would render the superseded document over the new one's boot
            // (and fire `initializedCallback` for it), and reporting a lost
            // one would put the give-up screen over a document that is
            // booting fine.
            await standDown();
            return;
        }

        if (!handshakeSucceeded || thisCoreWorker === null) {
            // Every handshake attempt failed.
            failCoreStart({ contended: lastFailureWasContended });
            return;
        }

        // --- Phase 2: generate the DAST — NOT watchdogged ---
        // The worker proved it is alive by completing the handshake, so a long
        // generateDast is real, in-progress work, not a hang. Watchdogging
        // here is what made complex documents unloadable (they time out before
        // core finishes), so we let it run to completion however long it takes.
        onActionCallbacks.current.clear();
        coreCreationInProgress.current = true;

        // The worker keeps the proxies below for the life of its core and
        // calls them mid-evaluation, before the RPC resolves — and a
        // superseded worker stays alive through a bounded graceful teardown,
        // so its deliveries can arrive after `coreId` has moved on. Ownership
        // is therefore checked at delivery: `updateRenderers` and friends
        // stamp `coreId.current`, which by then is the successor's id, so an
        // unguarded delivery would write the superseded document's renderer
        // state, score, clipboard text, or host events under the document
        // that replaced it. The animation-frame proxies stay unguarded: a
        // rebuild already stops animations via `preventMoreAnimations` and
        // cancels everything in `animationInfo`.
        const speakingFor = <Args extends unknown[], Result>(
            callback: (...args: Args) => Result,
        ) => {
            return (...args: Args): Result | undefined =>
                stillSpeaksForDocument(coreIdWhenCalled)
                    ? callback(...args)
                    : undefined;
        };
        // `requestSolutionView`'s answer is awaited in the worker, so its
        // suppressed form refuses instead of resolving to nothing the worker
        // would then read `allowView` off of.
        const requestSolutionViewIfCurrent = (componentIdx: number) =>
            stillSpeaksForDocument(coreIdWhenCalled)
                ? requestSolutionView(componentIdx)
                : Promise.resolve({ allowView: false });

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
                    styleOverrides,
                    requestedVariant: initialCoreData.current?.requestedVariant,
                    stateVariableChanges: initialCoreData.current?.coreState
                        ? JSON.stringify(
                              initialCoreData.current.coreState,
                              serializedComponentsReplacer,
                          )
                        : undefined,
                    initializeCounters: initializeCounters.current,
                },
                Comlink.proxy(speakingFor(updateRenderers)),
                Comlink.proxy(speakingFor(reportScoreAndStateCallback)),
                Comlink.proxy(requestAnimationFrame),
                Comlink.proxy(cancelAnimationFrame),
                Comlink.proxy(speakingFor(copyToClipboard)),
                Comlink.proxy(speakingFor(sendEvent)),
                Comlink.proxy(requestSolutionViewIfCurrent),
            );
        } catch (err) {
            if (bootAbandoned()) {
                // Not a failure of this document: a rebuild's
                // `reinitializeCoreAndTerminateAnimations` disposed the worker
                // this ladder was driving, so the rejection is the teardown
                // being observed from the losing side (#1714). Reporting it
                // would put the give-up screen — and a
                // `coreStartFailedCallback`, which frees a host's boot slot —
                // over a document the successor is booting fine.
                await standDown();
                return;
            }
            // generateDast normally reports core problems via
            // `{ success: false }` (handled below); a *rejection* here is an
            // unexpected failure (e.g. the worker died mid-evaluation). Surface
            // it rather than stalling.
            console.warn("DocViewer: generateJavascriptDast failed", err);
            failCoreStart();
            return;
        }

        if (bootAbandoned()) {
            // Superseded while evaluating (#1714). Everything below commits a
            // result to the viewer — renderers, diagnostics, the stage, the
            // initialized callback — and this ladder's result belongs to a
            // document that is no longer on screen. The evaluation itself is
            // finished either way; only its delivery is withheld.
            await standDown();
            return;
        }

        if (dastResult.success) {
            clearFailureMessage();
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
                initializeRenderers(
                    { coreInfo: dastResult.coreInfo },
                    coreIdWhenCalled,
                );
                if (errorInsideRenderers.current) {
                    setIgnoreRendererError(true);
                    setIsInErrorState?.(false);
                }
            }

            if (dastResult.diagnostics) {
                publishDiagnostics(dastResult.diagnostics);
                if (
                    diagnostics.current.some(
                        (diagnostic) => diagnostic.type === "error",
                    )
                ) {
                    setHasInitialError(true);
                }
            }
        } else {
            showFailureMessage(dastResult.errMsg);
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
    //
    // Also the single-flight gate: at most one ladder per document may be in
    // flight, since two of them would fight over the shared `coreWorker` ref.
    // See `bootLadderCoreId`.
    function startCoreSafely() {
        const launchedFor = coreId.current;
        if (bootLadderCoreId.current === launchedFor) {
            return;
        }
        bootLadderCoreId.current = launchedFor;
        runBootLadder(launchedFor).catch((e) => {
            console.warn("DocViewer: startCore failed unexpectedly", e);
            // Only a ladder that still owns the document and has not already
            // delivered it may raise the give-up screen (and with it a
            // `coreStartFailedCallback`, which frees a host's boot slot).
            // A superseded ladder's throw is no more its to report than its
            // ordinary outcome is — the same rule `standDown` follows — and
            // the ladder's very last step is `initializedCallback`, a host
            // handler running after the document is already on screen.
            if (!stillSpeaksForDocument(launchedFor) || coreCreated.current) {
                return;
            }
            failCoreStart();
        });
    }

    /**
     * Run one boot ladder, releasing the single-flight latch when it ends —
     * however it ends, including the abandonment exits inside `startCore`.
     * The latch is only dropped if it is still this ladder's: a rebuild that
     * re-rolled `coreId` mid-ladder has already claimed it for its successor,
     * and clearing it there would let a re-render launch a third ladder
     * alongside that one.
     */
    async function runBootLadder(launchedFor: string) {
        try {
            await startCore(launchedFor);
        } finally {
            if (bootLadderCoreId.current === launchedFor) {
                bootLadderCoreId.current = null;
            }
        }
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
        // Nothing below this point runs, so `lastDoenetML` is never recorded
        // and this branch repeats on every re-render until `render` turns
        // true. Reuse the worker already attached rather than attaching a
        // second one: `attachNewCoreWorker` overwrites the refs, which would
        // leave its predecessor running with nothing pointing at it — never
        // terminated, and still reporting document structure over the callback
        // its replacement is also using. A catalog finishing loading is one of
        // the things that re-renders a viewer sitting in this window.
        const remote = coreWorker.current ?? attachNewCoreWorker();
        // Initializing parses the source, expands its external references and
        // makes a round trip, so repeat it only when one of its inputs has
        // changed. The inputs are the ones a rebuild is gated on further down,
        // this being the same initialization the core is later built from —
        // compared for any change rather than for an arrival, since there is
        // no core here yet whose work a needless rebuild would throw away.
        const noRenderInit: unknown[] = [
            doenetML,
            docId,
            activityId,
            attemptNumber,
            requestedVariantIndex,
            documentLocale ?? null,
            contentCatalogsOnHand.join(","),
        ];
        const previous = lastNoRenderInit.current;
        if (
            previous === null ||
            noRenderInit.some((value, index) => value !== previous[index])
        ) {
            lastNoRenderInit.current = noRenderInit;
            // Fire-and-forget: this only primes the worker so it can report the
            // document structure; core itself isn't started until `render` flips
            // true. Surface failures rather than swallowing the promise.
            initializeCoreWorkerForDoc(remote).catch((e) => {
                console.warn(
                    "DocViewer: core worker initialization (no-render path) failed",
                    e,
                );
            });
        }
        return null;
    }

    let retriedByReader = false;
    if (lastRetryGeneration.current !== retryGeneration) {
        lastRetryGeneration.current = retryGeneration;
        retriedByReader = true;
        changedState = true;
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

    // The content locale and its catalogs are fixed for a core's lifetime —
    // they feed every string the core computes — so changing either rebuilds
    // the core rather than updating in place, the way a changed `doenetML`
    // does. (`uiLocale` is main-thread only and needs no rebuild.)
    if (lastDocumentLocale.current !== (documentLocale ?? null)) {
        lastDocumentLocale.current = documentLocale ?? null;
        changedState = true;
    }

    // Compared by *which locales* the core can reach — see
    // `contentCatalogsOnHand` — rather than by what the catalogs say, since the
    // catalogs are handed to the core at creation.
    //
    // Only an *arrival* is a reason to rebuild. What is reachable can also
    // shrink: `effectiveDocumentLocale` names the previous language until the
    // core reports back, so a changed `documentLocale` puts the old language's
    // catalog out of reach a moment after the rebuild just above — and
    // rebuilding again there would build the core twice for one switch.
    for (const locale of contentCatalogsOnHand) {
        if (!contentCatalogsBuilt.current.has(locale)) {
            contentCatalogsBuilt.current.add(locale);
            changedState = true;
        }
    }

    if (changedState) {
        // Reset error messages, core.
        // Then load state and initialize

        if (errMsg !== null) {
            setErrMsg(null);
            setIsInErrorState?.(false);
        }
        // A different document — or the same one started over — has not yet
        // asked any host for state, so nothing is known to be missing from
        // it. Cleared unconditionally: the setter is idempotent, and the
        // notice is retired here for the retry rebuild too, whose fresh
        // `SPLICE.getState` request raises it again if the host answers the
        // same way.
        setStateLoadNotice(null);
        // One retry per document: the reader spends theirs on the rebuild
        // they asked for, and gets a fresh one with a document they didn't.
        retrySpent.current = retriedByReader;
        // And only the rebuild they asked for shows that it is working; every
        // other one goes back to rendering nothing while it runs. Set here
        // rather than in the click handler so the flag describes the rebuild
        // actually in flight, retiring a "running" that a later rebuild
        // superseded.
        setCoreStartRetry(retriedByReader ? "running" : "none");

        coreId.current = nanoid();
        // A request the previous document made is not this one's to have
        // answered. Nothing else retires it: `requestStateViaSplice` replaces
        // the id only after the load's awaits, and a successor restoring from
        // local state or handed `initialState` never asks at all, so the old
        // id would stay current indefinitely — long enough for a late reply
        // to it to be read as an answer to this document, putting an error
        // over a document it never described, or state that was saved for
        // another attempt at the same source into this one.
        messageIdFromGetState.current = null;
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

        const loadingFor = coreId.current;
        loadStateAndInitialize(loadingFor).catch((e) => {
            console.warn("DocViewer: loadStateAndInitialize failed", e);
            // The load reports its own expected failures; an unexpected throw
            // (an unreadable saved record, a `cidFromText` that rejects) still
            // has to become a visible error rather than an unhandled
            // rejection. Only while the load still speaks for the document,
            // though: it waits on a cid and on IndexedDB, so a rebuild can
            // supersede it, and a stale give-up screen would both cover what
            // the successor is showing and spend its single
            // `reportCoreStartFailed` — see `stillSpeaksForDocument`.
            if (stillSpeaksForDocument(loadingFor)) {
                failCoreStart();
            }
        });

        return null;
    }

    // The lead-in of the "started without your saved work" notice, in the
    // reader's language, with the host's own words following it. Written
    // once for the two places that notice can appear — beneath a failure
    // pane's message, and beside a working document — and as a literal
    // `translate` call, the only form `lint:i18n` can see.
    const savedStateUnavailableLeadIn = translate(
        "saved-state-unavailable",
        undefined,
        SAVED_STATE_UNAVAILABLE_MESSAGE,
    );

    if (errMsg !== null) {
        return (
            <div
                // The failure of a document is worth interrupting for, the
                // same way `RendererLoadFailed` is: this pane replaces the
                // document (or, after a retry, the pane that said the retry
                // was working), and nothing else says so to a reader who
                // cannot see it.
                role="alert"
                style={{
                    backgroundColor: "var(--lightRed)",
                    color: "var(--canvasText)",
                    borderWidth: 3,
                    borderStyle: "solid",
                    borderColor: "var(--mainRed)",
                    fontSize: "1.3em",
                    marginInlineStart: "20px",
                    marginTop: "20px",
                    padding: "0.5em",
                }}
            >
                {/* Decorative: the message beside it says the same
                    thing, and the alert above carries it. */}
                <MdError aria-hidden="true" color="red" fontSize={"24pt"} />{" "}
                {errMsg}
                {/* What the host said about the saved state it could not
                    produce, beneath the pane's own message rather than
                    instead of it (#1741). Both are true and neither implies
                    the other — a state error does not stop a core from
                    starting, it only starts it without the reader's saved
                    work — where they used to share this pane and erase each
                    other in arrival order; see `showFailureMessage` for the
                    rule that separated them.

                    Inside the pane it is part of the pane's `role="alert"`,
                    so one landing on a pane already up is announced with it.
                    That is the right weight here and only here: the reader is
                    looking at a document that failed, not working in one. The
                    same message beside a working document gets the
                    `role="status"` region built below. */}
                {stateLoadNotice !== null ? (
                    <div style={{ marginTop: "0.5em", fontSize: "0.8em" }}>
                        {savedStateUnavailableLeadIn} {stateLoadNotice}
                    </div>
                ) : null}
                {/* The failure pane is shown whether or not this viewer is
                    rendering its document — a host that has set `render`
                    false still wants to hear that the document failed — but
                    the button is offered only to one that is: a viewer at
                    `render={false}` never starts a core (see the launch site
                    below), so a retry there would trade the message for a
                    rebuild that boots nothing. Gated here rather than where
                    the offer is made, so the button appears if the host later
                    asks for the document. */}
                {coreStartRetry === "offered" && render ? (
                    <div style={{ marginTop: "0.5em" }}>
                        <UiButton onClick={retryCoreStart}>
                            {translate(
                                "core-start-retry",
                                undefined,
                                CORE_START_RETRY_MESSAGE,
                            )}
                        </UiButton>
                    </div>
                ) : null}
            </div>
        );
    }

    if (stage === "wait") {
        // A rebuild is under way and there is nothing to show for it yet.
        // Blank is right for one the reader did not ask for — an editor
        // recompile, a locale switch — but a retry they clicked has to show
        // that it is working, or the failure pane just vanishes (#1712).
        // Gated on `render` for the same reason the button above is.
        return coreStartRetry === "running" && render
            ? initializingPane()
            : null;
    }

    if (stage === "readyToCreateCore" && render) {
        // A document prepared while it was not being rendered — the stage
        // `loadStateAndInitialize` and the `SPLICE.getState` handler leave
        // behind when `render` is false — is now wanted, so boot it. The
        // ladder does not move `stage` off `"readyToCreateCore"` until it
        // finishes, so this runs again on every re-render in between;
        // `startCoreSafely` is what keeps that from launching a second ladder.
        //
        // A ladder that *failed* leaves the stage here too, and drops the
        // single-flight latch on its way out. What keeps that from relaunching
        // one failing ladder after another is the `errMsg` return above: a
        // give-up screen is rendered instead of ever reaching this line. A
        // future failure state rendered in place rather than returning early
        // has to gate this launch site itself.
        startCoreSafely();
    } else if (stage === "waitingOnCore" && !render && !coreCreated.current) {
        // XXX: `"waitingOnCore"` is never set, so this branch never runs.
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
        paddingInline: "20px",
        backgroundColor: "var(--canvas)",
        containerType: "inline-size",
    };
    if (!coreCreated.current) {
        if (!documentRenderer) {
            noCoreWarning = initializingPane();
        }
    }

    function handleViewerClick(event: MouseEvent) {
        // Navigation only happens on the explicit Cmd/Ctrl+click gesture,
        // so plain clicks interact with the document without moving the
        // editor. Checked before the skip flag below: an unmodified click
        // ending a drag returns here with that flag still set, but every
        // pointerdown clears it, so it can't latch across interactions.
        if (!hasNavigationModifier(event)) {
            return;
        }
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

    // The notice for a document that is on screen and working, started
    // without the saved work the host could not produce — beside the
    // document, never in place of it (#1741). This answer keeps its own
    // schedule and can land on a reader who has been working for minutes
    // (see the `SPLICE.getState` error branch above for why the request is
    // still open then), so putting it on the failure pane, which is what
    // used to happen, took the reader's activity away over a fact that costs
    // them a state restore they have already worked past.
    //
    // Its live region is a component of its own so that the text is always
    // added to a region already on the page — see `StateLoadNoticeRegion`.
    const stateNoticeBanner = (
        <StateLoadNoticeRegion
            message={stateLoadNotice}
            leadIn={savedStateUnavailableLeadIn}
            uiLocale={effectiveUiLocale}
            documentDirection={documentDirection}
        />
    );

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
            // This banner is addressed to whoever is looking at the screen, so
            // it is in `uiLocale` while the box around it is declared to be the
            // content's language. Re-declared only where the two directions
            // disagree, so the common case adds no attributes: otherwise an
            // English "This document contains errors!" inside an Arabic
            // document would put its exclamation mark on the wrong end. Through
            // the pure helper rather than `useChromeLangDir` because this is
            // built above the provider that hook reads.
            <div
                style={errorStyle}
                {...chromeLangDir(effectiveUiLocale, documentDirection)}
            >
                <b>
                    {translate(
                        "document-contains-errors",
                        undefined,
                        "This document contains errors!",
                    )}
                </b>
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
            translate={translate}
        >
            {noCoreWarning}
            <div
                style={viewerStyle}
                className="doenet-viewer"
                // Always the language the content is actually rendered in, so
                // a screen reader pronounces it the way the core wrote it.
                lang={effectiveDocumentLocale}
                // And the direction that language is written in. A browser will
                // not infer one from the other, so without this an Arabic
                // document lays out right-to-left text in a left-to-right box:
                // the punctuation lands on the wrong end and a mixed
                // Latin/Arabic run comes out in the wrong visual order.
                dir={documentDirection}
                ref={viewerContainerRef}
            >
                {stateNoticeBanner}
                {errorOverview}
                <DocContext.Provider value={contextForRenderers}>
                    {/* Nested inside the provider `doenetml.tsx` mounts from
                        the props alone: only here is the authored
                        `<document lang>` known, so only here can the chrome
                        follow the language the content was written in. */}
                    <I18nProvider
                        translate={translate}
                        locale={effectiveUiLocale}
                    >
                        {/* Tells the chrome below what it is drawn inside, so
                            a piece of it can re-declare itself where the two
                            directions disagree — see `useChromeLangDir`. */}
                        <DocumentDirectionProvider
                            direction={documentDirection}
                        >
                            <ContentI18nProvider translate={translateContent}>
                                {documentRenderer}
                            </ContentI18nProvider>
                        </DocumentDirectionProvider>
                    </I18nProvider>
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
    /**
     * Chrome translator. A class component cannot use `useT()`, and this one
     * sits above the provider besides, so it is handed the same translator
     * `DocViewer` built.
     */
    translate: Translator;
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
                // Destructured rather than called as `this.props.translate(…)`
                // because `lint:i18n` finds keys only through a bare `t` or
                // `translate` call.
                const { translate } = this.props;
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
                        <b>{translate("error-heading", undefined, "Error")}</b>:{" "}
                        {translate(
                            "something-went-wrong",
                            undefined,
                            "Something went wrong.",
                        )}
                    </div>
                );
            }
        }
        return this.props.children;
    }
}
