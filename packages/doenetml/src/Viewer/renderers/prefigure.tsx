import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import me from "math-expressions";
import { roundForDisplay } from "@doenet/utils";
import {
    PREFIGURE_BUILD_ENDPOINT,
    PREFIGURE_DIAGCESS_SCRIPT_URL,
    PREFIGURE_INDEX_URL,
    PREFIGURE_MODULE_URL,
} from "./utils/prefigureConfig";
import SliderUI from "./utils/SliderUI";
import {
    accessibleLabelText,
    renderLabelWithLatex,
} from "./utils/labelWithLatex";

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

type ControlsPosition = "bottom" | "left" | "right" | "top";
type GraphControlsMode = "all" | "slidersonly" | "inputsonly" | "none";
type PointControlsMode = "both" | "xonly" | "yonly" | "none";

const MIN_GRAPH_WIDTH_FOR_SIDE_LAYOUT_PX = 280;
const SIDE_SLIDER_COLUMN_WIDTH_PX = 220;
const SIDE_LAYOUT_GAP_PX = 12;
// Side layout needs enough room for graph + slider column + gap.
// Current breakpoint: 280 + 220 + 12 = 512px.
const MIN_SIDE_LAYOUT_WIDTH_PX =
    MIN_GRAPH_WIDTH_FOR_SIDE_LAYOUT_PX +
    SIDE_SLIDER_COLUMN_WIDTH_PX +
    SIDE_LAYOUT_GAP_PX;

function normalizeControlsPosition(value: unknown): ControlsPosition {
    if (
        value === "bottom" ||
        value === "left" ||
        value === "right" ||
        value === "top"
    ) {
        return value;
    }

    return "left";
}

function normalizeGraphControlsMode(value: unknown): GraphControlsMode {
    if (typeof value !== "string") {
        return "none";
    }

    const normalized = value.toLowerCase();
    if (
        normalized === "all" ||
        normalized === "slidersonly" ||
        normalized === "inputsonly" ||
        normalized === "none"
    ) {
        return normalized;
    }

    return "none";
}

function normalizePointControlsMode(value: unknown): PointControlsMode {
    if (typeof value !== "string") {
        return "both";
    }

    const normalized = value.toLowerCase();
    if (
        normalized === "both" ||
        normalized === "xonly" ||
        normalized === "yonly" ||
        normalized === "none"
    ) {
        return normalized;
    }

    return "both";
}

function parseSingleMathNumber(input: string): number | null {
    try {
        const expression = me.fromText(input);
        const value = expression?.evaluate_to_constant?.();
        return Number.isFinite(value) ? value : null;
    } catch (_error) {
        return null;
    }
}

function parseOrderedPair(input: string): { x: number; y: number } | null {
    try {
        const expression = me.fromText(input);
        const tree = expression?.tree;
        if (!Array.isArray(tree) || tree.length !== 3) {
            return null;
        }

        const operator = tree[0];
        if (operator !== "tuple" && operator !== "vector") {
            return null;
        }

        const x = me.fromAst(tree[1])?.evaluate_to_constant?.();
        const y = me.fromAst(tree[2])?.evaluate_to_constant?.();

        if (x === null || y === null) {
            return null;
        }

        if (!Number.isFinite(x) || !Number.isFinite(y)) {
            return null;
        }

        return { x, y };
    } catch (_error) {
        return null;
    }
}

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

    const data = await response.json();

    return data;
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
 * single throwable value.  Prefers the first non-AbortError so that a real
 * failure surfaces even when one of the two backends was intentionally
 * cancelled.
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
        width: { size: string; isAbsolute: boolean };
        aspectRatio: number;
        addControls: string;
        controlsPosition: ControlsPosition;
        xMin: number;
        xMax: number;
        yMin: number;
        yMax: number;
        draggablePointsForControls: Array<{
            componentIdx: number;
            pointNumber: number;
            x: number;
            y: number;
            addControls: string;
            label: string;
            labelHasLatex: boolean;
            displayDigits: number;
            displayDecimals: number;
            displaySmallAsZero: number;
            padZeros: boolean;
        }>;
    };
    surfaceStyle: React.CSSProperties;
    callAction: (argObj: Record<string, any>) => Promise<any> | void;
};

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
    const normalized = value.trim();
    return normalized.startsWith("#");
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

function pruneRecordByActiveKeys(
    previousRecord: Record<string, string>,
    activeKeys: Set<string>,
): Record<string, string> {
    const nextRecord: Record<string, string> = {};
    let changed = false;

    for (const key in previousRecord) {
        if (!Object.prototype.hasOwnProperty.call(previousRecord, key)) {
            continue;
        }

        const value = previousRecord[key];
        if (activeKeys.has(key)) {
            nextRecord[key] = value;
        } else {
            changed = true;
        }
    }

    return changed ? nextRecord : previousRecord;
}

export default React.memo(function Prefigure({
    id,
    SVs,
    surfaceStyle,
    callAction,
}: PrefigureRendererProps) {
    const diagramXML = SVs.prefigureXML;
    const hasAuthorAnnotations = SVs.hasAuthorAnnotations;
    const coreControlPoints = SVs.draggablePointsForControls;
    const graphControlsMode = normalizeGraphControlsMode(SVs.addControls);
    const includeSliders =
        graphControlsMode === "all" || graphControlsMode === "slidersonly";
    const includeInputs =
        graphControlsMode === "all" || graphControlsMode === "inputsonly";
    const [svgMarkup, setSvgMarkup] = useState("");
    const [svgMessage, setSvgMessage] = useState("Building...");
    const [annotationsXml, setAnnotationsXml] = useState("");
    const [diagcessReady, setDiagcessReady] = useState(Boolean(diagcessApi()));
    const [rendererSliderCoordinates, setRendererSliderCoordinates] = useState<
        Record<number, { x: number; y: number }>
    >({});
    const [inputDraftByKey, setInputDraftByKey] = useState<
        Record<string, string>
    >({});
    const [inputErrorByKey, setInputErrorByKey] = useState<
        Record<string, string>
    >({});
    const latestSliderCoordinatesRef = useRef<
        Record<number, { x: number; y: number }>
    >({});
    const committingInputKeysRef = useRef<Set<string>>(new Set());
    const [transientSliderSet, setTransientSliderSet] = useState<Set<string>>(
        new Set(),
    );
    const [availableWidth, setAvailableWidth] = useState<number | null>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fetchAbortControllerRef = useRef<AbortController | null>(null);
    const diagcessTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prefigureContainerRef = useRef<HTMLDivElement | null>(null);
    const requestSequenceRef = useRef(0);
    const hasStartedBuildRef = useRef(false);

    function sliderAxisTransientKey(
        componentIdx: number,
        axis: "x" | "y",
    ): string {
        return `${componentIdx}|${axis}`;
    }

    function pointAxisInputKey(componentIdx: number, axis: "x" | "y"): string {
        return `${componentIdx}|${axis}`;
    }

    function pointPairInputKey(componentIdx: number): string {
        return `${componentIdx}|pair`;
    }

    function setInputDraftValue(key: string, value: string) {
        setInputDraftByKey((previousDraftByKey) => ({
            ...previousDraftByKey,
            [key]: value,
        }));
        setInputError(key, null);
    }

    useEffect(() => {
        // Merge new state values into ref without overwriting values that
        // updatePointCoordinateFromSlider may have just set. This prevents
        // rapid sequential slider updates from losing the latest coordinates
        // when state updates complete out of order.
        latestSliderCoordinatesRef.current = {
            ...latestSliderCoordinatesRef.current,
            ...rendererSliderCoordinates,
        };
    }, [rendererSliderCoordinates]);

    /**
     * Synchronize slider coordinates state with core state and transient drag state.
     * This effect runs whenever coreControlPoints, includeSliders, or transientSliderSet changes.
     *
     * Performs two key operations:
     * 1. Sync rendererSliderCoordinates: Updates x/y values from coreControlPoints for
     *    non-actively-dragging slider axes.
     *    Removes entries for points no longer in coreControlPoints (cleanup).
     * 2. Filter transientSliderSet: Removes inactive slider-axis keys from the dragging set,
     *    maintaining consistency when points or rendered slider axes are removed.
     *
     * This design allows the UI to display transient (mid-drag) values while respecting
     * snap-back behavior from constraints when the user releases the mouse.
     */
    useEffect(() => {
        // Compute active point and slider-axis keys once from coreControlPoints,
        // outside any state updater.
        // Both setRendererSliderCoordinates and setTransientSliderSet will read this
        // immutable set without mutation.
        const activePointIndices = new Set<number>(
            coreControlPoints.map((p) => p.componentIdx),
        );
        const activeSliderAxisKeys = new Set<string>();

        for (const { componentIdx, addControls } of coreControlPoints) {
            if (!includeSliders) {
                continue;
            }

            const normalizedAddControls =
                normalizePointControlsMode(addControls);
            if (
                normalizedAddControls !== "yonly" &&
                normalizedAddControls !== "none"
            ) {
                activeSliderAxisKeys.add(
                    sliderAxisTransientKey(componentIdx, "x"),
                );
            }

            if (
                normalizedAddControls !== "xonly" &&
                normalizedAddControls !== "none"
            ) {
                activeSliderAxisKeys.add(
                    sliderAxisTransientKey(componentIdx, "y"),
                );
            }
        }

        // This update keeps renderer coordinates aligned with core values for
        // non-transient axes and removes coordinates for inactive points.
        setRendererSliderCoordinates((previousCoordinates) => {
            const nextCoordinates = { ...previousCoordinates };
            let changed = false;

            for (const {
                componentIdx,
                x: coreX,
                y: coreY,
            } of coreControlPoints) {
                const previousPointCoordinates =
                    previousCoordinates[componentIdx];
                const latestPointCoordinates =
                    latestSliderCoordinatesRef.current[componentIdx];
                const xIsTransient = transientSliderSet.has(
                    sliderAxisTransientKey(componentIdx, "x"),
                );
                const yIsTransient = transientSliderSet.has(
                    sliderAxisTransientKey(componentIdx, "y"),
                );
                const nextPointCoordinates = {
                    x: xIsTransient
                        ? (previousPointCoordinates?.x ??
                          latestPointCoordinates?.x ??
                          coreX)
                        : coreX,
                    y: yIsTransient
                        ? (previousPointCoordinates?.y ??
                          latestPointCoordinates?.y ??
                          coreY)
                        : coreY,
                };

                if (
                    previousPointCoordinates?.x !== nextPointCoordinates.x ||
                    previousPointCoordinates?.y !== nextPointCoordinates.y
                ) {
                    nextCoordinates[componentIdx] = nextPointCoordinates;
                    changed = true;
                }
            }

            // Clean up coordinates for points that no longer exist in coreControlPoints.
            for (const componentIdxString of Object.keys(nextCoordinates)) {
                const componentIdx = Number(componentIdxString);
                if (!activePointIndices.has(componentIdx)) {
                    delete nextCoordinates[componentIdx];
                    changed = true;
                }
            }

            return changed ? nextCoordinates : previousCoordinates;
        });

        // This update is only for pruning transient entries that no longer
        // correspond to active slider-axis keys.
        setTransientSliderSet((previousTransientSliderSet) => {
            const nextTransientSliderSet = new Set<string>();

            // Keep only transient slider-axis keys that are still active.
            for (const sliderAxisKey of previousTransientSliderSet) {
                if (activeSliderAxisKeys.has(sliderAxisKey)) {
                    nextTransientSliderSet.add(sliderAxisKey);
                }
            }

            // Optimize: only update state if set contents actually changed.
            if (
                nextTransientSliderSet.size === previousTransientSliderSet.size
            ) {
                let changed = false;

                for (const sliderAxisKey of nextTransientSliderSet) {
                    if (!previousTransientSliderSet.has(sliderAxisKey)) {
                        changed = true;
                        break;
                    }
                }

                if (!changed) {
                    return previousTransientSliderSet;
                }
            }

            return nextTransientSliderSet;
        });
    }, [coreControlPoints, includeSliders, transientSliderSet]);

    /**
     * Keeps input draft/error state aligned with the currently rendered controls.
     *
     * As graph mode, point mode, or eligible points change, some inputs may no
     * longer exist (for example switching from `all` to `slidersOnly`, or a point
     * changing from `both` to `xOnly`). This effect computes the active input-key
     * set for the current render configuration, then prunes stale entries from:
     * - inputDraftByKey: temporary user-edited values not yet committed
     * - inputErrorByKey: validation errors associated with input controls
     *
     * It intentionally preserves keys that are still active so in-progress edits
     * are not lost during unrelated updates.
     */
    useEffect(() => {
        const activeInputKeys = new Set<string>();

        if (includeInputs) {
            for (const point of coreControlPoints) {
                const pointControlsMode = normalizePointControlsMode(
                    point.addControls,
                );

                if (pointControlsMode === "none") {
                    continue;
                }

                if (graphControlsMode === "all") {
                    if (pointControlsMode !== "yonly") {
                        activeInputKeys.add(
                            pointAxisInputKey(point.componentIdx, "x"),
                        );
                    }
                    if (pointControlsMode !== "xonly") {
                        activeInputKeys.add(
                            pointAxisInputKey(point.componentIdx, "y"),
                        );
                    }
                } else if (graphControlsMode === "inputsonly") {
                    if (pointControlsMode === "both") {
                        activeInputKeys.add(
                            pointPairInputKey(point.componentIdx),
                        );
                    } else if (pointControlsMode === "xonly") {
                        activeInputKeys.add(
                            pointAxisInputKey(point.componentIdx, "x"),
                        );
                    } else if (pointControlsMode === "yonly") {
                        activeInputKeys.add(
                            pointAxisInputKey(point.componentIdx, "y"),
                        );
                    }
                }
            }
        }

        // Remove drafts and validation errors for inputs that are no longer rendered.
        setInputDraftByKey((previousDraftByKey) =>
            pruneRecordByActiveKeys(previousDraftByKey, activeInputKeys),
        );
        setInputErrorByKey((previousErrorByKey) =>
            pruneRecordByActiveKeys(previousErrorByKey, activeInputKeys),
        );
    }, [coreControlPoints, graphControlsMode, includeInputs]);

    /**
     * Update coordinates for a point based on slider input.
     *
     * For pointer/touch drags, onChange is only called with transient=true (during drag).
     * Drag release is handled by onDragEnd (in renderAxisSlider), which clears the
     * transient axis key and lets the sync effect snap the slider to the core value
     * without dispatching a duplicate movePoint action.
     *
     * This means a pointer drag can complete without any transient=false movePoint call.
     * Since transient updates are marked skippable, the last drag sample may also be
     * skipped if superseded by another action before execution. We accept this tradeoff:
     * users already saw the immediate drag response, and on release the slider handle
     * is synchronized to the latest core value.
     *
     * For keyboard input, SliderUI treats each arrow-key press as a transient (skippable)
     * action, allowing the user to accumulate multiple steps past a constraint boundary.
     * When the slider loses focus (blur), the transient state is cleared without sending
     * another movePoint action. The sync effect then re-syncs the slider to core's latest
     * constrained value, just as it does for pointer-up.
     */
    async function updatePointCoordinateFromSlider({
        componentIdx,
        axis,
        value,
        transient,
        defaultX,
        defaultY,
    }: {
        componentIdx: number;
        axis: "x" | "y";
        value: number;
        transient: boolean;
        defaultX: number;
        defaultY: number;
    }) {
        const currentCoordinates = latestSliderCoordinatesRef.current[
            componentIdx
        ] ?? {
            x: defaultX,
            y: defaultY,
        };
        const nextCoordinates = {
            x: axis === "x" ? value : currentCoordinates.x,
            y: axis === "y" ? value : currentCoordinates.y,
        };

        latestSliderCoordinatesRef.current = {
            ...latestSliderCoordinatesRef.current,
            [componentIdx]: nextCoordinates,
        };

        setRendererSliderCoordinates((previousCoordinates) => ({
            ...previousCoordinates,
            // Always use the just-committed slider value here.
            // If the point is constrained, the core state will publish the snapped
            // coordinate shortly after and the synchronization effect will update
            // this value once the point leaves the transient set.
            [componentIdx]: nextCoordinates,
        }));

        function clearTransientForAxis() {
            const transientKey = sliderAxisTransientKey(componentIdx, axis);

            setTransientSliderSet((previousTransientSliderSet) => {
                if (!previousTransientSliderSet.has(transientKey)) {
                    return previousTransientSliderSet;
                }

                const nextTransientSliderSet = new Set(
                    previousTransientSliderSet,
                );
                nextTransientSliderSet.delete(transientKey);
                return nextTransientSliderSet;
            });
        }

        if (transient) {
            const transientKey = sliderAxisTransientKey(componentIdx, axis);

            setTransientSliderSet((previousTransientSliderSet) => {
                if (previousTransientSliderSet.has(transientKey)) {
                    return previousTransientSliderSet;
                }

                const nextTransientSliderSet = new Set(
                    previousTransientSliderSet,
                );
                nextTransientSliderSet.add(transientKey);
                return nextTransientSliderSet;
            });
        }

        try {
            await callAction({
                action: { actionName: "movePoint", componentIdx },
                args: {
                    x: nextCoordinates.x,
                    y: nextCoordinates.y,
                    transient,
                    skippable: transient,
                },
            });
        } catch (error) {
            console.error(
                `[prefigure] movePoint failed for component ${componentIdx}`,
                error,
            );
        } finally {
            if (!transient) {
                // Keep this after await callAction: resolving the action means
                // DocViewer has already dispatched the updated core state values.
                // Clearing transient first would allow the sync effect to pull
                // stale pre-action core coordinates and cause a snap-back flicker.
                clearTransientForAxis();
            }
        }
    }

    /**
     * Normalize slider bounds so reversed graph axes still produce valid
     * range inputs (min <= max).
     */
    function normalizedSliderBounds(rawMin: number, rawMax: number) {
        const min = Math.min(rawMin, rawMax);
        const max = Math.max(rawMin, rawMax);
        return { min, max };
    }

    /**
     * Format a coordinate value for display in slider label.
     *
     * Applies display rounding rules (displayDigits, displayDecimals, displaySmallAsZero)
     * just like number display in DoenetML. If padZeros is true, pads to match
     * displayDecimals or displayDigits precision, e.g., "1.00".
     */
    function formatCoordinateForSlider(
        value: number,
        point: (typeof coreControlPoints)[number],
    ): string {
        const rounded = roundForDisplay({
            value,
            dependencyValues: {
                displayDigits: point.displayDigits,
                displayDecimals: point.displayDecimals,
                displaySmallAsZero: point.displaySmallAsZero,
            },
        });

        // Apply padding zeros if requested: pad to decimal places or significant figures
        const params: any = {};
        if (point.padZeros) {
            if (Number.isFinite(point.displayDecimals)) {
                params.padToDecimals = point.displayDecimals;
            }
            if (point.displayDigits >= 1) {
                params.padToDigits = point.displayDigits;
            }
        }

        return rounded.toString(params);
    }

    const { xMin, xMax, yMin, yMax } = SVs;

    async function updatePointCoordinatesFromControls({
        componentIdx,
        x,
        y,
    }: {
        componentIdx: number;
        x: number;
        y: number;
    }) {
        const nextCoordinates = { x, y };

        latestSliderCoordinatesRef.current = {
            ...latestSliderCoordinatesRef.current,
            [componentIdx]: nextCoordinates,
        };

        setRendererSliderCoordinates((previousCoordinates) => ({
            ...previousCoordinates,
            [componentIdx]: nextCoordinates,
        }));

        try {
            await callAction({
                action: { actionName: "movePoint", componentIdx },
                args: {
                    x,
                    y,
                    transient: false,
                    skippable: false,
                },
            });
        } catch (error) {
            console.error(
                `[prefigure] movePoint failed for component ${componentIdx}`,
                error,
            );
        }
    }

    function setInputError(key: string, error: string | null) {
        setInputErrorByKey((previousErrorByKey) => {
            if (error) {
                if (previousErrorByKey[key] === error) {
                    return previousErrorByKey;
                }
                return { ...previousErrorByKey, [key]: error };
            }

            if (!(key in previousErrorByKey)) {
                return previousErrorByKey;
            }

            const nextErrorByKey = { ...previousErrorByKey };
            delete nextErrorByKey[key];
            return nextErrorByKey;
        });
    }

    function clearInputDraft(key: string) {
        setInputDraftByKey((previousDraftByKey) => {
            if (!(key in previousDraftByKey)) {
                return previousDraftByKey;
            }

            const nextDraftByKey = { ...previousDraftByKey };
            delete nextDraftByKey[key];
            return nextDraftByKey;
        });
    }

    async function submitAxisInput({
        componentIdx,
        axis,
        rawValue,
        currentCoordinates,
        inputKey,
    }: {
        componentIdx: number;
        axis: "x" | "y";
        rawValue: string;
        currentCoordinates: { x: number; y: number };
        inputKey: string;
    }) {
        const hasDraft = Object.prototype.hasOwnProperty.call(
            inputDraftByKey,
            inputKey,
        );
        if (!hasDraft) {
            return;
        }

        if (committingInputKeysRef.current.has(inputKey)) {
            return;
        }
        committingInputKeysRef.current.add(inputKey);

        try {
            const parsedValue = parseSingleMathNumber(rawValue);
            if (parsedValue === null) {
                setInputError(
                    inputKey,
                    "Enter a valid number or numeric expression.",
                );
                return;
            }

            const nextCoordinates = {
                x: axis === "x" ? parsedValue : currentCoordinates.x,
                y: axis === "y" ? parsedValue : currentCoordinates.y,
            };

            const axisValueUnchanged =
                (axis === "x" && parsedValue === currentCoordinates.x) ||
                (axis === "y" && parsedValue === currentCoordinates.y);

            if (axisValueUnchanged) {
                setInputError(inputKey, null);
                clearInputDraft(inputKey);
                return;
            }

            setInputError(inputKey, null);
            clearInputDraft(inputKey);
            await updatePointCoordinatesFromControls({
                componentIdx,
                x: nextCoordinates.x,
                y: nextCoordinates.y,
            });
        } finally {
            committingInputKeysRef.current.delete(inputKey);
        }
    }

    async function submitPairInput({
        componentIdx,
        rawValue,
        currentCoordinates,
        inputKey,
    }: {
        componentIdx: number;
        rawValue: string;
        currentCoordinates: { x: number; y: number };
        inputKey: string;
    }) {
        const hasDraft = Object.prototype.hasOwnProperty.call(
            inputDraftByKey,
            inputKey,
        );
        if (!hasDraft) {
            return;
        }

        if (committingInputKeysRef.current.has(inputKey)) {
            return;
        }
        committingInputKeysRef.current.add(inputKey);

        try {
            const parsedPair = parseOrderedPair(rawValue);
            if (!parsedPair) {
                setInputError(
                    inputKey,
                    "Enter an ordered pair like (x,y) with numeric values.",
                );
                return;
            }

            const pairUnchanged =
                parsedPair.x === currentCoordinates.x &&
                parsedPair.y === currentCoordinates.y;

            if (pairUnchanged) {
                setInputError(inputKey, null);
                clearInputDraft(inputKey);
                return;
            }

            setInputError(inputKey, null);
            clearInputDraft(inputKey);
            await updatePointCoordinatesFromControls({
                componentIdx,
                x: parsedPair.x,
                y: parsedPair.y,
            });
        } finally {
            committingInputKeysRef.current.delete(inputKey);
        }
    }

    /**
     * Helper to render a single axis slider (x or y).
     * Reduces duplication in the sliderSection mapping.
     */
    function renderAxisSlider(
        axis: "x" | "y",
        point: (typeof coreControlPoints)[number],
        currentCoordinates: { x: number; y: number },
        pointLabelForAria: string,
        axisInputConfig?: {
            value: string;
            error: string | undefined;
            describedBy: string;
            onChange: (value: string) => void;
            onCommit: (value: string) => Promise<void>;
        },
    ) {
        const isX = axis === "x";
        const value = isX ? currentCoordinates.x : currentCoordinates.y;
        const rawMin = isX ? xMin : yMin;
        const rawMax = isX ? xMax : yMax;
        const { min, max } = normalizedSliderBounds(rawMin, rawMax);
        const step = max !== min ? (max - min) / 100 : 1;
        const axisLabel = isX ? "x" : "y";
        const label = axisInputConfig ? (
            <span
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "6px",
                    flexWrap: "wrap",
                    width: "100%",
                }}
            >
                <span>{`${axisLabel}:`}</span>
                <input
                    type="text"
                    value={axisInputConfig.value}
                    aria-label={`${axisLabel} value input for ${pointLabelForAria}`}
                    aria-invalid={axisInputConfig.error ? true : undefined}
                    aria-describedby={
                        axisInputConfig.error
                            ? axisInputConfig.describedBy
                            : undefined
                    }
                    onChange={(event) => {
                        axisInputConfig.onChange(event.target.value);
                    }}
                    onBlur={(event) => {
                        axisInputConfig
                            .onCommit(event.target.value)
                            .catch((error) => {
                                console.error(
                                    `[prefigure] failed to commit ${axisLabel} input for component ${point.componentIdx}`,
                                    error,
                                );
                            });
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            axisInputConfig
                                .onCommit(event.currentTarget.value)
                                .catch((error) => {
                                    console.error(
                                        `[prefigure] failed to commit ${axisLabel} input for component ${point.componentIdx}`,
                                        error,
                                    );
                                });
                        }
                    }}
                    style={{ width: "84px" }}
                />
                {axisInputConfig.error ? (
                    <span
                        id={axisInputConfig.describedBy}
                        style={{
                            color: "#b00020",
                            fontSize: "0.85em",
                            flexBasis: "100%",
                            width: "100%",
                            whiteSpace: "normal",
                            overflowWrap: "anywhere",
                            wordBreak: "break-word",
                        }}
                    >
                        {axisInputConfig.error}
                    </span>
                ) : null}
            </span>
        ) : (
            `${axisLabel}: ${formatCoordinateForSlider(value, point)}`
        );

        return (
            <SliderUI
                key={axis}
                id={`${id}-point-${point.componentIdx}-${axis}`}
                label={label}
                ariaLabel={`${axis} coordinate for ${pointLabelForAria}`}
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(value, transient) =>
                    updatePointCoordinateFromSlider({
                        componentIdx: point.componentIdx,
                        axis,
                        value,
                        transient,
                        defaultX: currentCoordinates.x,
                        defaultY: currentCoordinates.y,
                    })
                }
                onDragEnd={() => {
                    // Clear only this axis's transient key on drag release. This
                    // lets the sync effect pull the core-constrained value back
                    // into the slider without sending a duplicate movePoint action.
                    const transientKey = sliderAxisTransientKey(
                        point.componentIdx,
                        axis,
                    );
                    setTransientSliderSet((prev) => {
                        if (!prev.has(transientKey)) {
                            return prev;
                        }
                        const next = new Set(prev);
                        next.delete(transientKey);
                        return next;
                    });
                }}
            />
        );
    }

    const controlsSection = coreControlPoints
        .map((point) => {
            const {
                componentIdx,
                x: defaultX,
                y: defaultY,
                pointNumber,
                label,
                labelHasLatex,
            } = point;
            const pointControlsMode = normalizePointControlsMode(
                point.addControls,
            );
            if (pointControlsMode === "none") {
                return null;
            }

            const currentCoordinates = rendererSliderCoordinates[
                componentIdx
            ] ?? {
                x: defaultX,
                y: defaultY,
            };
            const pointFallbackLabel = `Point ${pointNumber}`;
            const pointLabelForAria = accessibleLabelText({
                label,
                labelHasLatex,
                fallback: pointFallbackLabel,
            });
            const pointLabelForDisplay = label.trim()
                ? renderLabelWithLatex({ label, labelHasLatex })
                : pointFallbackLabel;

            const xInputKey = pointAxisInputKey(componentIdx, "x");
            const yInputKey = pointAxisInputKey(componentIdx, "y");
            const pairInputKey = pointPairInputKey(componentIdx);

            const formattedX = formatCoordinateForSlider(
                currentCoordinates.x,
                point,
            );
            const formattedY = formatCoordinateForSlider(
                currentCoordinates.y,
                point,
            );

            const xInputValue = inputDraftByKey[xInputKey] ?? formattedX;
            const yInputValue = inputDraftByKey[yInputKey] ?? formattedY;
            const pairInputValue =
                inputDraftByKey[pairInputKey] ??
                `(${formattedX},${formattedY})`;

            const xInputError = inputErrorByKey[xInputKey];
            const yInputError = inputErrorByKey[yInputKey];
            const pairInputError = inputErrorByKey[pairInputKey];

            const showXAxis = pointControlsMode !== "yonly";
            const showYAxis = pointControlsMode !== "xonly";
            const showAxisInputsInline = graphControlsMode === "all";
            const showSlidersForPoint = includeSliders;
            const showInputsOnlyForPoint =
                graphControlsMode === "inputsonly" && includeInputs;

            const pointHeadingId = `${id}-point-${componentIdx}-heading`;

            return (
                <div
                    key={componentIdx}
                    data-point-slider-card="true"
                    role="group"
                    aria-labelledby={pointHeadingId}
                    style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "10px",
                        border: "1px solid var(--canvasText)",
                        borderRadius: "8px",
                    }}
                >
                    <div id={pointHeadingId} style={{ fontWeight: 600 }}>
                        {pointLabelForDisplay}
                    </div>
                    {showInputsOnlyForPoint && pointControlsMode === "both" ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                                marginTop: "8px",
                            }}
                        >
                            <label htmlFor={`${id}-point-${componentIdx}-pair`}>
                                Coordinates
                            </label>
                            <input
                                id={`${id}-point-${componentIdx}-pair`}
                                type="text"
                                value={pairInputValue}
                                aria-label={`coordinates for ${pointLabelForAria}`}
                                aria-invalid={pairInputError ? true : undefined}
                                aria-describedby={
                                    pairInputError
                                        ? `${id}-error-point-${componentIdx}-pair`
                                        : undefined
                                }
                                onChange={(event) => {
                                    setInputDraftValue(
                                        pairInputKey,
                                        event.target.value,
                                    );
                                }}
                                onBlur={(event) => {
                                    submitPairInput({
                                        componentIdx,
                                        rawValue: event.target.value,
                                        currentCoordinates,
                                        inputKey: pairInputKey,
                                    }).catch((error) => {
                                        console.error(
                                            `[prefigure] failed to commit pair input for component ${componentIdx}`,
                                            error,
                                        );
                                    });
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        submitPairInput({
                                            componentIdx,
                                            rawValue: event.currentTarget.value,
                                            currentCoordinates,
                                            inputKey: pairInputKey,
                                        }).catch((error) => {
                                            console.error(
                                                `[prefigure] failed to commit pair input for component ${componentIdx}`,
                                                error,
                                            );
                                        });
                                    }
                                }}
                            />
                            {pairInputError ? (
                                <span
                                    id={`${id}-error-point-${componentIdx}-pair`}
                                    style={{
                                        color: "#b00020",
                                        fontSize: "0.85em",
                                    }}
                                >
                                    {pairInputError}
                                </span>
                            ) : null}
                        </div>
                    ) : null}

                    {showInputsOnlyForPoint && pointControlsMode === "xonly" ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                                marginTop: "8px",
                            }}
                        >
                            <label
                                htmlFor={`${id}-point-${componentIdx}-x-input`}
                            >
                                x
                            </label>
                            <input
                                id={`${id}-point-${componentIdx}-x-input`}
                                type="text"
                                value={xInputValue}
                                aria-label={`x input for ${pointLabelForAria}`}
                                aria-invalid={xInputError ? true : undefined}
                                aria-describedby={
                                    xInputError
                                        ? `${id}-error-point-${componentIdx}-x`
                                        : undefined
                                }
                                onChange={(event) => {
                                    setInputDraftValue(
                                        xInputKey,
                                        event.target.value,
                                    );
                                }}
                                onBlur={(event) => {
                                    submitAxisInput({
                                        componentIdx,
                                        axis: "x",
                                        rawValue: event.target.value,
                                        currentCoordinates,
                                        inputKey: xInputKey,
                                    }).catch((error) => {
                                        console.error(
                                            `[prefigure] failed to commit x input for component ${componentIdx}`,
                                            error,
                                        );
                                    });
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        submitAxisInput({
                                            componentIdx,
                                            axis: "x",
                                            rawValue: event.currentTarget.value,
                                            currentCoordinates,
                                            inputKey: xInputKey,
                                        }).catch((error) => {
                                            console.error(
                                                `[prefigure] failed to commit x input for component ${componentIdx}`,
                                                error,
                                            );
                                        });
                                    }
                                }}
                            />
                            {xInputError ? (
                                <span
                                    id={`${id}-error-point-${componentIdx}-x`}
                                    style={{
                                        color: "#b00020",
                                        fontSize: "0.85em",
                                    }}
                                >
                                    {xInputError}
                                </span>
                            ) : null}
                        </div>
                    ) : null}

                    {showInputsOnlyForPoint && pointControlsMode === "yonly" ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "4px",
                                marginTop: "8px",
                            }}
                        >
                            <label
                                htmlFor={`${id}-point-${componentIdx}-y-input`}
                            >
                                y
                            </label>
                            <input
                                id={`${id}-point-${componentIdx}-y-input`}
                                type="text"
                                value={yInputValue}
                                aria-label={`y input for ${pointLabelForAria}`}
                                aria-invalid={yInputError ? true : undefined}
                                aria-describedby={
                                    yInputError
                                        ? `${id}-error-point-${componentIdx}-y`
                                        : undefined
                                }
                                onChange={(event) => {
                                    setInputDraftValue(
                                        yInputKey,
                                        event.target.value,
                                    );
                                }}
                                onBlur={(event) => {
                                    submitAxisInput({
                                        componentIdx,
                                        axis: "y",
                                        rawValue: event.target.value,
                                        currentCoordinates,
                                        inputKey: yInputKey,
                                    }).catch((error) => {
                                        console.error(
                                            `[prefigure] failed to commit y input for component ${componentIdx}`,
                                            error,
                                        );
                                    });
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        event.preventDefault();
                                        submitAxisInput({
                                            componentIdx,
                                            axis: "y",
                                            rawValue: event.currentTarget.value,
                                            currentCoordinates,
                                            inputKey: yInputKey,
                                        }).catch((error) => {
                                            console.error(
                                                `[prefigure] failed to commit y input for component ${componentIdx}`,
                                                error,
                                            );
                                        });
                                    }
                                }}
                            />
                            {yInputError ? (
                                <span
                                    id={`${id}-error-point-${componentIdx}-y`}
                                    style={{
                                        color: "#b00020",
                                        fontSize: "0.85em",
                                    }}
                                >
                                    {yInputError}
                                </span>
                            ) : null}
                        </div>
                    ) : null}

                    {showSlidersForPoint && showXAxis
                        ? renderAxisSlider(
                              "x",
                              point,
                              currentCoordinates,
                              pointLabelForAria,
                              showAxisInputsInline
                                  ? {
                                        value: xInputValue,
                                        error: xInputError,
                                        describedBy: `${id}-error-point-${componentIdx}-x`,
                                        onChange: (value) => {
                                            setInputDraftValue(
                                                xInputKey,
                                                value,
                                            );
                                        },
                                        onCommit: async (value) => {
                                            await submitAxisInput({
                                                componentIdx,
                                                axis: "x",
                                                rawValue: value,
                                                currentCoordinates,
                                                inputKey: xInputKey,
                                            });
                                        },
                                    }
                                  : undefined,
                          )
                        : null}
                    {showSlidersForPoint && showYAxis
                        ? renderAxisSlider(
                              "y",
                              point,
                              currentCoordinates,
                              pointLabelForAria,
                              showAxisInputsInline
                                  ? {
                                        value: yInputValue,
                                        error: yInputError,
                                        describedBy: `${id}-error-point-${componentIdx}-y`,
                                        onChange: (value) => {
                                            setInputDraftValue(
                                                yInputKey,
                                                value,
                                            );
                                        },
                                        onCommit: async (value) => {
                                            await submitAxisInput({
                                                componentIdx,
                                                axis: "y",
                                                rawValue: value,
                                                currentCoordinates,
                                                inputKey: yInputKey,
                                            });
                                        },
                                    }
                                  : undefined,
                          )
                        : null}
                </div>
            );
        })
        .filter((section): section is React.JSX.Element => Boolean(section));
    const hasControlsSection = controlsSection.length > 0;

    useEffect(() => {
        const fallbackElement = prefigureContainerRef.current;
        if (!fallbackElement) {
            return;
        }

        const measuredElement =
            document.getElementById(`${id}-container`) ?? fallbackElement;

        function updateContainerWidth() {
            setAvailableWidth(measuredElement.clientWidth);
        }

        updateContainerWidth();

        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", updateContainerWidth);
            return () => {
                window.removeEventListener("resize", updateContainerWidth);
            };
        }

        const observer = new ResizeObserver(() => {
            updateContainerWidth();
        });
        observer.observe(measuredElement);

        return () => {
            observer.disconnect();
        };
    }, []);

    const requestedControlsPosition = normalizeControlsPosition(
        SVs.controlsPosition,
    );
    const requestedSideLayout =
        requestedControlsPosition === "left" ||
        requestedControlsPosition === "right";
    const canUseSideLayout =
        availableWidth === null || availableWidth >= MIN_SIDE_LAYOUT_WIDTH_PX;
    const effectiveControlsPosition: ControlsPosition =
        requestedControlsPosition === "left" && !canUseSideLayout
            ? "top"
            : requestedControlsPosition === "right" && !canUseSideLayout
              ? "bottom"
              : requestedControlsPosition;
    const useSideLayout =
        effectiveControlsPosition === "left" ||
        effectiveControlsPosition === "right";

    // Load diagcess script
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

    const layoutStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: useSideLayout ? "row" : "column",
        alignItems: useSideLayout ? "flex-start" : "stretch",
        gap: `${SIDE_LAYOUT_GAP_PX}px`,
        width: "100%",
        minWidth: 0,
    };

    // Keep graph first in DOM for focus/screen-reader flow, and reorder only visually.
    const graphSectionStyle: React.CSSProperties = {
        order:
            effectiveControlsPosition === "top" ||
            effectiveControlsPosition === "left"
                ? 2
                : 1,
        flex: useSideLayout ? "1 1 auto" : undefined,
        width: useSideLayout ? undefined : "100%",
        minWidth: useSideLayout ? `${MIN_GRAPH_WIDTH_FOR_SIDE_LAYOUT_PX}px` : 0,
    };

    const sliderSectionStyle: React.CSSProperties = {
        order:
            effectiveControlsPosition === "top" ||
            effectiveControlsPosition === "left"
                ? 1
                : 2,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: useSideLayout ? `${SIDE_SLIDER_COLUMN_WIDTH_PX}px` : "100%",
        maxWidth: useSideLayout
            ? `${SIDE_SLIDER_COLUMN_WIDTH_PX}px`
            : undefined,
        minWidth: 0,
        overflowX: "hidden",
    };

    return (
        <div
            id={id}
            ref={prefigureContainerRef}
            style={wrapperStyle}
            data-controls-position-requested={requestedControlsPosition}
            data-controls-position-effective={effectiveControlsPosition}
            data-controls-position-side-fallback={
                requestedSideLayout && !canUseSideLayout ? "true" : "false"
            }
        >
            {/* Announce build / error status to screen readers without cluttering
                the visual layout. Lives outside role="img" so the live region is
                not suppressed by the img role's presentational children semantics. */}
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
            <div style={layoutStyle}>
                <div style={graphSectionStyle}>
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
                {hasControlsSection ? (
                    <div
                        role="group"
                        aria-label="Point controls"
                        style={sliderSectionStyle}
                    >
                        {controlsSection}
                    </div>
                ) : null}
            </div>
        </div>
    );
});
