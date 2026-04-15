import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import {
    PREFIGURE_BUILD_ENDPOINT,
    PREFIGURE_DIAGCESS_SCRIPT_URL,
    PREFIGURE_INDEX_URL,
    PREFIGURE_MODULE_URL,
} from "./utils/prefigureConfig";

const PREFIGURE_BUILD_DEBOUNCE_COLD_MS = 1000;
const PREFIGURE_BUILD_DEBOUNCE_WARM_MS = 40;
const DIAGCESS_REINIT_DELAY_MS = 400;

type PrefigureModule = typeof import("@doenet/prefigure");

let prefigureModulePromise: Promise<PrefigureModule> | null = null;
let prefigureWarmupPromise: Promise<PrefigureModule> | null = null;
let prefigureReadyModule: PrefigureModule | null = null;

type PrefigureBuildResult = {
    svg: string;
    annotationsXml: string;
};

type PrefigureBuildWinner =
    | { backend: "service"; data: PrefigureBuildResult }
    | { backend: "local"; module: PrefigureModule };

type DiagcessApi = {
    Base: {
        init: () => void;
        molMap: Record<string, unknown>;
    };
};

type PrefigureRendererProps = {
    id: string;
    SVs: {
        prefigureXML: string | null;
        hasAuthorAnnotations: boolean;
        shortDescription?: string;
        decorative: boolean;
        showBorder: boolean;
    };
    surfaceStyle: React.CSSProperties;
};

async function importPrefigureFromUrl(url: string): Promise<PrefigureModule> {
    return import(/* @vite-ignore */ url);
}

async function getPrefigureModule() {
    if (!prefigureModulePromise) {
        prefigureModulePromise = importPrefigureFromUrl(PREFIGURE_MODULE_URL);
    }

    return prefigureModulePromise;
}

async function startPrefigureWarmup() {
    if (!prefigureWarmupPromise) {
        prefigureWarmupPromise = (async () => {
            const module = await getPrefigureModule();
            await module.initPrefigure(PREFIGURE_INDEX_URL || undefined);
            prefigureReadyModule = module;
            console.log("[prefigure] WASM runtime ready");
            return module;
        })().catch((error) => {
            // Keep fallback-to-service behavior and allow future retries.
            prefigureWarmupPromise = null;
            throw error;
        });
    }

    return prefigureWarmupPromise;
}

function logWarmupFailure(error: unknown) {
    console.error("[prefigure] warmup failed", error);
}

function warmupPrefigureInBackground() {
    startPrefigureWarmup().catch(logWarmupFailure);
}

function currentPrefigureDebounceMs() {
    return prefigureReadyModule
        ? PREFIGURE_BUILD_DEBOUNCE_WARM_MS
        : PREFIGURE_BUILD_DEBOUNCE_COLD_MS;
}

async function buildWithPrefigureService(
    diagramXML: string,
    signal: AbortSignal,
): Promise<PrefigureBuildResult> {
    const response = await fetch(PREFIGURE_BUILD_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/xml",
        },
        body: diagramXML,
        signal,
    });

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    return await response.json();
}

/**
 * Creates a DOMException-compatible AbortError for programmatic cancellation.
 * Falls back to a plain Error with `name === "AbortError"` in environments
 * where DOMException is not constructible (e.g. older WebViews).
 */
function createAbortError(): Error {
    try {
        return new DOMException("The operation was aborted.", "AbortError");
    } catch (_error) {
        const error = new Error("The operation was aborted.");
        error.name = "AbortError";
        return error;
    }
}

/**
 * Returns true if `error` is an AbortError regardless of whether it came from
 * a DOMException, from the plain-Error fallback in {@link createAbortError},
 * or from environment-specific abort object shapes.
 */
function isAbortError(error: unknown): boolean {
    if (
        error === null ||
        (typeof error !== "object" && typeof error !== "function")
    ) {
        return false;
    }

    if (!("name" in error)) {
        return false;
    }

    return error.name === "AbortError";
}

/**
 * Unwraps a multi-error array produced by {@link firstSuccessful} into a
 * single throwable value. Prefers the first non-AbortError so that a real
 * failure surfaces even when one backend was intentionally cancelled.
 */
function resolveBuildRaceError(error: unknown): unknown {
    if (!Array.isArray(error)) {
        return error;
    }

    const nonAbortError = error.find((candidate) => !isAbortError(candidate));
    return nonAbortError ?? error[0];
}

/**
 * Resolves with the value of the first promise that fulfills.
 * Rejects with an array of all errors only when every promise has rejected.
 *
 * Semantically equivalent to `Promise.any()`, but compatible with the
 * `ES2021.String` lib subset used in this package (which lacks `ES2021.Promise`
 * and therefore lacks the `AggregateError` type).
 */
function firstSuccessful<T>(promises: Array<Promise<T>>): Promise<T> {
    return new Promise((resolve, reject) => {
        let remaining = promises.length;
        const errors: unknown[] = [];

        if (remaining === 0) {
            reject(new Error("No promises were provided."));
            return;
        }

        for (const promise of promises) {
            promise.then(resolve, (error: unknown) => {
                errors.push(error);
                remaining -= 1;
                if (remaining === 0) {
                    reject(errors);
                }
            });
        }
    });
}

/**
 * Build diagram content via whichever backend is currently available.
 * Prefers local WASM when warm; otherwise uses the build service.
 */
async function buildPrefigureDiagram(
    diagramXML: string,
    signal: AbortSignal,
): Promise<PrefigureBuildResult> {
    if (prefigureReadyModule) {
        return prefigureReadyModule.compilePrefigure(diagramXML, {
            mode: "svg",
            indexURL: PREFIGURE_INDEX_URL || undefined,
        });
    }

    if (signal.aborted) {
        throw createAbortError();
    }

    const serviceAbortController = new AbortController();
    const abortServiceRequest = () => {
        serviceAbortController.abort();
    };

    signal.addEventListener("abort", abortServiceRequest, { once: true });

    // Close the check/listen race: the outer signal may have aborted after the
    // earlier guard but before this listener was attached.
    if (signal.aborted) {
        serviceAbortController.abort();
    }

    // cleanupOuterAbort removes the abort listener added inside the promise
    // constructor below so it does not linger on the signal after the race
    // settles normally.
    let cleanupOuterAbort: () => void = () => {};

    const outerAbortPromise = new Promise<never>((_resolve, reject) => {
        const rejectForAbort = () => {
            reject(createAbortError());
        };

        if (signal.aborted) {
            rejectForAbort();
            return;
        }

        signal.addEventListener("abort", rejectForAbort, { once: true });
        cleanupOuterAbort = () => {
            signal.removeEventListener("abort", rejectForAbort);
        };
    });

    try {
        async function buildServicePromise(): Promise<PrefigureBuildWinner> {
            const data = await buildWithPrefigureService(
                diagramXML,
                serviceAbortController.signal,
            );
            return { backend: "service", data };
        }

        async function buildLocalPromise(): Promise<PrefigureBuildWinner> {
            try {
                const module = await startPrefigureWarmup();
                return { backend: "local" as const, module };
            } catch (error) {
                logWarmupFailure(error);
                throw error;
            }
        }

        const serviceBuildPromise = buildServicePromise();
        const localReadyPromise = buildLocalPromise();

        const winner = await Promise.race([
            firstSuccessful([serviceBuildPromise, localReadyPromise]),
            outerAbortPromise,
        ]);

        if (winner.backend === "service") {
            return winner.data;
        }

        // WASM became ready before the service response, so stop waiting on the
        // slower network fallback and compile locally.
        serviceAbortController.abort();

        return await Promise.race([
            winner.module.compilePrefigure(diagramXML, {
                mode: "svg",
                indexURL: PREFIGURE_INDEX_URL || undefined,
            }),
            outerAbortPromise,
        ]);
    } catch (error) {
        throw resolveBuildRaceError(error);
    } finally {
        signal.removeEventListener("abort", abortServiceRequest);
        cleanupOuterAbort();
    }
}

function diagcessApi(): DiagcessApi | undefined {
    return (window as Window & { diagcess?: DiagcessApi }).diagcess;
}

const DIAGCESS_SCRIPT_MARKER_ATTR = "data-doenet-diagcess-script";
const DIAGCESS_SCRIPT_LOADED_ATTR = "data-doenet-diagcess-loaded";
let diagcessScriptLoadPromise: Promise<void> | null = null;

function resolveScriptUrl(url: string): string {
    return new URL(url, window.location.href).href;
}

function findDiagcessScript(): HTMLScriptElement | null {
    const expectedUrl = resolveScriptUrl(PREFIGURE_DIAGCESS_SCRIPT_URL);
    const scripts = Array.from(document.getElementsByTagName("script"));

    for (const script of scripts) {
        const matchesMarker =
            script.getAttribute(DIAGCESS_SCRIPT_MARKER_ATTR) === "true";
        const matchesUrl = script.src === expectedUrl;

        if (matchesMarker || matchesUrl) {
            return script;
        }
    }

    return null;
}

function ensureDiagcessScriptLoaded(): Promise<void> {
    if (diagcessApi()) {
        return Promise.resolve();
    }

    if (diagcessScriptLoadPromise) {
        return diagcessScriptLoadPromise;
    }

    diagcessScriptLoadPromise = new Promise<void>((resolve, reject) => {
        const resolveLoaded = () => {
            resolve();
        };

        const rejectLoad = () => {
            diagcessScriptLoadPromise = null;
            reject(new Error("Failed to load diagcess script."));
        };

        const existingScript = findDiagcessScript();
        if (existingScript) {
            if (
                diagcessApi() ||
                existingScript.getAttribute(DIAGCESS_SCRIPT_LOADED_ATTR) ===
                    "true"
            ) {
                resolveLoaded();
                return;
            }

            existingScript.addEventListener("load", resolveLoaded, {
                once: true,
            });
            existingScript.addEventListener("error", rejectLoad, {
                once: true,
            });
            return;
        }

        const script = document.createElement("script");
        script.src = PREFIGURE_DIAGCESS_SCRIPT_URL;
        script.type = "text/javascript";
        script.async = true;
        script.setAttribute(DIAGCESS_SCRIPT_MARKER_ATTR, "true");

        script.addEventListener(
            "load",
            () => {
                script.setAttribute(DIAGCESS_SCRIPT_LOADED_ATTR, "true");
                resolveLoaded();
            },
            { once: true },
        );

        script.addEventListener("error", rejectLoad, { once: true });
        document.head.appendChild(script);
    });

    return diagcessScriptLoadPromise;
}

function normalizeSerializedMarkup(value: unknown): string {
    if (typeof value !== "string") {
        return "";
    }

    let text = value;

    for (let ind = 0; ind < 2; ind++) {
        const trimmed = text.trim();

        if (!(trimmed.startsWith('"') && trimmed.endsWith('"'))) {
            break;
        }

        try {
            const parsed = JSON.parse(trimmed);
            if (typeof parsed === "string") {
                text = parsed;
            } else {
                break;
            }
        } catch (_e) {
            break;
        }
    }

    return text;
}

function hasAnnotationsXml(value: string): boolean {
    const trimmed = value.trim();
    if (!trimmed) {
        return false;
    }

    // The annotations payload uses <diagram> as its root element.
    return /<diagram\b/i.test(trimmed);
}

function removeDiagcessMessages(container: HTMLElement | null): void {
    if (!container) {
        return;
    }

    for (const child of Array.from(container.children)) {
        if (
            child instanceof HTMLParagraphElement &&
            child.classList.contains("cacc-message")
        ) {
            child.remove();
        }
    }
}

const FORBIDDEN_MARKUP_TAGS = new Set([
    "script",
    "foreignobject",
    "iframe",
    "object",
    "embed",
    "link",
    "meta",
    "base",
]);

const URL_ATTRIBUTE_NAMES = new Set([
    "href",
    "xlink:href",
    "src",
    "data",
    "action",
    "formaction",
    "poster",
]);

function isUnsafeUrl(value: string): boolean {
    const normalized = value.trim().replace(/\s+/g, "").toLowerCase();
    return (
        normalized.startsWith("javascript:") ||
        normalized.startsWith("vbscript:") ||
        normalized.startsWith("data:") ||
        normalized.startsWith("file:") ||
        normalized.startsWith("//")
    );
}

function isLocalSvgFragmentReference(value: string): boolean {
    return value.trim().startsWith("#");
}

function sanitizeXmlMarkup({
    markup,
    mimeType,
    allowedRootNames,
}: {
    markup: string;
    mimeType: DOMParserSupportedType;
    allowedRootNames: Set<string>;
}): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(markup, mimeType);

    if (doc.getElementsByTagName("parsererror").length > 0) {
        return "";
    }

    const root = doc.documentElement;
    const rootName = root?.tagName?.toLowerCase?.();
    if (!rootName || !allowedRootNames.has(rootName)) {
        return "";
    }

    const elements = [root, ...Array.from(root.getElementsByTagName("*"))];
    for (const element of elements) {
        const tagName = (element.localName || element.tagName).toLowerCase();

        if (FORBIDDEN_MARKUP_TAGS.has(tagName)) {
            element.remove();
            continue;
        }

        const attributes = Array.from(element.attributes);
        for (const attribute of attributes) {
            const name = attribute.name.toLowerCase();
            const localName = (
                attribute.localName || attribute.name
            ).toLowerCase();
            const value = attribute.value.trim();
            const isEventHandler = name.startsWith("on");
            const isUseHrefAttr = tagName === "use" && localName === "href";
            const hasUnsafeUseHref =
                isUseHrefAttr && !isLocalSvgFragmentReference(value);
            const isScriptUrl = isUnsafeUrl(value);
            const hasUnsafeUrl =
                (URL_ATTRIBUTE_NAMES.has(name) ||
                    URL_ATTRIBUTE_NAMES.has(localName)) &&
                isScriptUrl;
            const hasStyleAttr = name === "style";
            if (
                isEventHandler ||
                hasUnsafeUseHref ||
                hasUnsafeUrl ||
                hasStyleAttr
            ) {
                element.removeAttribute(attribute.name);
            }
        }
    }

    return new XMLSerializer().serializeToString(root);
}

/**
 * Apply a successful build result to component state after sanitization.
 */
function applyBuildResultToState({
    data,
    setSvgMarkup,
    setSvgMessage,
    setAnnotationsXml,
}: {
    data: PrefigureBuildResult;
    setSvgMarkup: React.Dispatch<React.SetStateAction<string>>;
    setSvgMessage: React.Dispatch<React.SetStateAction<string>>;
    setAnnotationsXml: React.Dispatch<React.SetStateAction<string>>;
}) {
    const svg = normalizeSerializedMarkup(data.svg);
    if (svg) {
        const sanitizedSvg = sanitizeSvgMarkup(svg);
        const responsiveSvg = sanitizedSvg
            ? normalizeSvgViewport(sanitizedSvg)
            : "";

        if (responsiveSvg) {
            setSvgMarkup(responsiveSvg);
            setSvgMessage("");
        } else {
            setSvgMarkup("");
            setSvgMessage("Error: Invalid or unsafe SVG in build response.");
        }
    } else {
        setSvgMarkup("");
        setSvgMessage("Error: No SVG found in response.");
    }

    const annotationsMarkup = normalizeSerializedMarkup(data.annotationsXml);
    if (annotationsMarkup) {
        setAnnotationsXml(sanitizeAnnotationsMarkup(annotationsMarkup));
    } else {
        setAnnotationsXml("");
    }
}

function setBuildErrorMessage(
    error: unknown,
    setSvgMarkup: React.Dispatch<React.SetStateAction<string>>,
    setSvgMessage: React.Dispatch<React.SetStateAction<string>>,
) {
    console.error(error);
    const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
    setSvgMarkup("");
    setSvgMessage(
        `Error: ${errorMessage}. Check the Console (F12) for CORS details if this failed immediately.`,
    );
}

function sanitizeSvgMarkup(markup: string): string {
    const purified = DOMPurify.sanitize(markup, {
        USE_PROFILES: { svg: true, svgFilters: true },
        ADD_TAGS: ["use"],
        FORBID_TAGS: ["foreignObject", "iframe", "object", "embed"],
        FORBID_ATTR: ["style"],
        ALLOW_UNKNOWN_PROTOCOLS: false,
        RETURN_TRUSTED_TYPE: false,
    });

    if (typeof purified !== "string") {
        return "";
    }

    return sanitizeXmlMarkup({
        markup: purified,
        mimeType: "image/svg+xml",
        allowedRootNames: new Set(["svg"]),
    });
}

function parseSvgLength(value: string | null): number | null {
    if (!value) {
        return null;
    }

    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/**
 * Convert a built PreFigure SVG into a container-responsive SVG.
 *
 * PreFigure output can arrive with fixed width/height attributes, which makes
 * the browser lay it out at a rigid pixel size. In narrower graph containers
 * that can truncate the visible drawing even though the underlying SVG content
 * is complete. By ensuring a viewBox exists and then switching the root SVG to
 * width/height 100%, the browser scales the existing viewport to fit the graph
 * frame instead of clipping it. If no usable viewBox exists and one cannot be
 * derived from numeric width/height attributes, preserve the original sizing
 * so this normalization step does not change SVG layout semantics.
 */
function normalizeSvgViewport(markup: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(markup, "image/svg+xml");
    if (doc.getElementsByTagName("parsererror").length > 0) {
        return "";
    }

    const root = doc.documentElement;
    if (!root || root.tagName.toLowerCase() !== "svg") {
        return "";
    }

    let hasUsableViewBox = Boolean(root.getAttribute("viewBox"));

    if (!hasUsableViewBox) {
        const width = parseSvgLength(root.getAttribute("width"));
        const height = parseSvgLength(root.getAttribute("height"));

        if (width !== null && height !== null) {
            // Preserve the original drawing coordinates before replacing the
            // fixed outer size with responsive sizing.
            root.setAttribute("viewBox", `0 0 ${width} ${height}`);
            hasUsableViewBox = true;
        }
    }

    if (hasUsableViewBox) {
        root.setAttribute("width", "100%");
        root.setAttribute("height", "100%");
        if (!root.getAttribute("preserveAspectRatio")) {
            // Keep the full diagram visible when the container aspect ratio differs
            // from the original SVG dimensions.
            root.setAttribute("preserveAspectRatio", "xMidYMid meet");
        }
    }

    return new XMLSerializer().serializeToString(root);
}

function sanitizeAnnotationsMarkup(markup: string): string {
    return sanitizeXmlMarkup({
        markup,
        mimeType: "application/xml",
        allowedRootNames: new Set(["diagram"]),
    });
}

export default React.memo(function Prefigure({
    id,
    SVs,
    surfaceStyle,
}: PrefigureRendererProps) {
    const diagramXML = SVs.prefigureXML;
    const hasAuthorAnnotations = SVs.hasAuthorAnnotations;

    const [svgMarkup, setSvgMarkup] = useState("");
    const [svgMessage, setSvgMessage] = useState("Building...");
    const [annotationsXml, setAnnotationsXml] = useState("");
    const [diagcessReady, setDiagcessReady] = useState(Boolean(diagcessApi()));

    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fetchAbortControllerRef = useRef<AbortController | null>(null);
    const diagcessTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prefigureContainerRef = useRef<HTMLDivElement | null>(null);
    const requestSequenceRef = useRef(0);
    const hasStartedBuildRef = useRef(false);

    useEffect(() => {
        let active = true;

        async function loadDiagcessScript() {
            try {
                await ensureDiagcessScriptLoaded();
                if (active) {
                    setDiagcessReady(true);
                }
            } catch (error) {
                console.error(error);
            }
        }

        loadDiagcessScript();

        return () => {
            active = false;
        };
    }, []);

    // Start warming up WASM immediately, but do not block first render.
    useEffect(() => {
        // If warmup fails (e.g. CDN unreachable), keep server fallback active.
        warmupPrefigureInBackground();
    }, []);

    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }

        if (fetchAbortControllerRef.current) {
            fetchAbortControllerRef.current.abort();
            fetchAbortControllerRef.current = null;
        }

        if (!diagramXML) {
            // Treat the next non-empty XML payload as a fresh build so it renders immediately.
            hasStartedBuildRef.current = false;
            setSvgMarkup("");
            setSvgMessage("");
            setAnnotationsXml("");
            return;
        }

        /**
         * Resets renderer-visible build state before a cold-path compile request.
         */
        const resetBuildState = () => {
            setSvgMarkup("");
            setSvgMessage("Building...");
            setAnnotationsXml("");
        };

        /**
         * Executes a build task and centralizes top-level error logging.
         * The inner build function already handles user-facing error state.
         */
        const runBuildWithLogging = (startBuild: () => Promise<void>) => {
            startBuild().catch((error) => {
                console.error("[prefigure] build failed", error);
            });
        };

        /**
         * Performs one concrete build attempt for the current XML snapshot.
         *
         * It creates a new abort controller, races service/local backends, and only
         * applies results if this request is still the newest sequence.
         */
        const startBuild = async () => {
            const requestSequence = ++requestSequenceRef.current;
            const abortController = new AbortController();
            fetchAbortControllerRef.current = abortController;
            const isWarmMode = Boolean(prefigureReadyModule);

            // In warm mode, keep the previous render on screen to avoid flash while
            // the fast local compile is in progress.
            if (!isWarmMode) {
                resetBuildState();
            }

            try {
                const data = await buildPrefigureDiagram(
                    diagramXML,
                    abortController.signal,
                );

                if (requestSequence !== requestSequenceRef.current) {
                    return;
                }

                applyBuildResultToState({
                    data,
                    setSvgMarkup,
                    setSvgMessage,
                    setAnnotationsXml,
                });
            } catch (error) {
                if (isAbortError(error)) {
                    return;
                }

                if (requestSequence !== requestSequenceRef.current) {
                    return;
                }

                setBuildErrorMessage(error, setSvgMarkup, setSvgMessage);
            } finally {
                if (fetchAbortControllerRef.current === abortController) {
                    fetchAbortControllerRef.current = null;
                }
            }
        };

        if (!hasStartedBuildRef.current) {
            hasStartedBuildRef.current = true;
            runBuildWithLogging(startBuild);
        } else {
            const debounceMs = currentPrefigureDebounceMs();
            debounceTimerRef.current = setTimeout(() => {
                runBuildWithLogging(startBuild);
            }, debounceMs);
        }

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
                debounceTimerRef.current = null;
            }

            if (fetchAbortControllerRef.current) {
                fetchAbortControllerRef.current.abort();
                fetchAbortControllerRef.current = null;
            }
        };
    }, [diagramXML]);

    useEffect(() => {
        // Run diagcess only when annotations were explicitly authored.
        // When no authored <annotations> exists, we still render a generated
        // empty <annotations></annotations> container to suppress implicit
        // PreFigure auto-annotations, but skip diagcess init.
        const diagcess = diagcessApi();
        const prefigureContainer = prefigureContainerRef.current;

        if (!hasAuthorAnnotations) {
            // Remove stale accessibility messages from previous renders.
            removeDiagcessMessages(prefigureContainer);
        }

        if (
            diagcessReady &&
            svgMarkup &&
            hasAuthorAnnotations &&
            hasAnnotationsXml(annotationsXml) &&
            diagcess &&
            prefigureContainer
        ) {
            removeDiagcessMessages(prefigureContainer);

            // diagcess mutates molMap during init, so clear any stale
            // entries before re-running it against newly inserted markup.
            diagcess.Base.molMap = {};
            if (diagcessTimerRef.current) {
                clearTimeout(diagcessTimerRef.current);
            }
            // Wait briefly for the sanitized SVG/annotations XML markup to be present
            // in the live DOM before diagcess scans and annotates it.
            diagcessTimerRef.current = setTimeout(() => {
                diagcessTimerRef.current = null;
                diagcess.Base.init();
            }, DIAGCESS_REINIT_DELAY_MS);
        }

        return () => {
            if (diagcessTimerRef.current) {
                clearTimeout(diagcessTimerRef.current);
                diagcessTimerRef.current = null;
            }
        };
    }, [svgMarkup, annotationsXml, diagcessReady, hasAuthorAnnotations]);

    const { marginTop, marginBottom, ...frameSurfaceStyle } = surfaceStyle;

    const wrapperStyle: React.CSSProperties = {
        marginTop,
        marginBottom,
        position: "relative",
    };

    // Accessible live region text: announce build progress and errors to screen
    // readers. Empty string when the SVG is visible (success is self-evident by
    // the diagram appearing in the accessibility tree).
    const statusLiveText = svgMarkup ? "" : svgMessage;

    const frameStyle: React.CSSProperties = {
        ...frameSurfaceStyle,
        overflow: "hidden",
        backgroundColor: "var(--canvas)",
        color: "var(--canvasText)",
        boxSizing: "border-box",
        border: SVs.showBorder ? "2px solid var(--canvasText)" : "none",
        borderRadius: SVs.showBorder ? "10px" : undefined,
    };

    const svgContainerStyle: React.CSSProperties = {
        width: "100%",
        height: "100%",
    };

    const svgMessageStyle: React.CSSProperties = {
        ...svgContainerStyle,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

    return (
        <div id={id} ref={prefigureContainerRef} style={wrapperStyle}>
            <span
                aria-live="polite"
                aria-atomic="true"
                style={{
                    position: "absolute",
                    width: "1px",
                    height: "1px",
                    overflow: "hidden",
                    clip: "rect(0, 0, 0, 0)",
                    whiteSpace: "nowrap",
                    border: 0,
                }}
            >
                {statusLiveText}
            </span>
            <div
                className="ChemAccess-element"
                style={frameStyle}
                tabIndex={SVs.decorative ? undefined : 0}
                role={SVs.decorative ? undefined : "img"}
                aria-label={
                    SVs.decorative
                        ? undefined
                        : SVs.shortDescription?.trim() || "Diagram"
                }
            >
                {svgMarkup ? (
                    <div
                        className="svg"
                        style={svgContainerStyle}
                        dangerouslySetInnerHTML={{ __html: svgMarkup }}
                    />
                ) : (
                    <div className="svg" style={svgMessageStyle}>
                        {svgMessage}
                    </div>
                )}
                <div
                    className="cml"
                    dangerouslySetInnerHTML={{ __html: annotationsXml }}
                />
            </div>
        </div>
    );
});
