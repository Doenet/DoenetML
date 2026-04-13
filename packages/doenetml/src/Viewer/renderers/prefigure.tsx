import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
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

    const data = await buildWithPrefigureService(diagramXML, signal);

    // Keep warmup alive for future renders.
    warmupPrefigureInBackground();

    return data;
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
        showBorder: boolean;
        width: { size: string; isAbsolute: boolean };
        aspectRatio: number;
        addSliders: boolean;
        xMin: number;
        xMax: number;
        yMin: number;
        yMax: number;
        draggablePointsForSliders: Array<{
            componentIdx: number;
            pointNumber: number;
            x: number;
            y: number;
            addSliders: string;
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

    return /<diagram\b/i.test(trimmed);
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
    setCmlContent,
}: {
    data: PrefigureBuildResult;
    setSvgMarkup: React.Dispatch<React.SetStateAction<string>>;
    setSvgMessage: React.Dispatch<React.SetStateAction<string>>;
    setCmlContent: React.Dispatch<React.SetStateAction<string>>;
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

    const cml = normalizeSerializedMarkup(data.annotationsXml);
    if (cml) {
        setCmlContent(sanitizeAnnotationsMarkup(cml));
    } else {
        setCmlContent("");
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
    callAction,
}: PrefigureRendererProps) {
    const diagramXML = SVs.prefigureXML;
    const coreSliderPoints = SVs.draggablePointsForSliders;
    const [svgMarkup, setSvgMarkup] = useState("");
    const [svgMessage, setSvgMessage] = useState("Building...");
    const [cmlContent, setCmlContent] = useState("");
    const [diagcessReady, setDiagcessReady] = useState(Boolean(diagcessApi()));
    const [rendererSliderCoordinates, setRendererSliderCoordinates] = useState<
        Record<number, { x: number; y: number }>
    >({});
    const [transientSliderSet, setTransientSliderSet] = useState<Set<number>>(
        new Set(),
    );
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fetchAbortControllerRef = useRef<AbortController | null>(null);
    const diagcessTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const prefigureContainerRef = useRef<HTMLDivElement | null>(null);
    const requestSequenceRef = useRef(0);
    const hasStartedBuildRef = useRef(false);

    /**
     * Synchronize slider coordinates state with core state and transient drag state.
     * This effect runs whenever coreSliderPoints or transientSliderSet changes.
     *
     * Performs two key operations:
     * 1. Sync rendererSliderCoordinates: Updates x/y values from coreSliderPoints for non-actively-dragging points.
     *    Removes entries for points no longer in coreSliderPoints (cleanup).
     * 2. Filter transientSliderSet: Removes inactive points from the dragging set,
     *    maintaining consistency when points are added or removed.
     *
     * This design allows the UI to display transient (mid-drag) values while respecting
     * snap-back behavior from constraints when the user releases the mouse.
     */
    useEffect(() => {
        const activePointIndices = new Set<number>();

        // This update keeps renderer coordinates aligned with core values for
        // non-transient points and removes coordinates for inactive points.
        setRendererSliderCoordinates((previousCoordinates) => {
            const nextCoordinates = { ...previousCoordinates };
            let changed = false;

            for (const {
                componentIdx,
                x: coreX,
                y: coreY,
            } of coreSliderPoints) {
                activePointIndices.add(componentIdx);

                // Only update from coreSliderPoints if this point is not currently being dragged.
                // Active drags use transient local values until release.
                if (!transientSliderSet.has(componentIdx)) {
                    const previousPointCoordinates =
                        previousCoordinates[componentIdx];

                    if (
                        previousPointCoordinates?.x !== coreX ||
                        previousPointCoordinates?.y !== coreY
                    ) {
                        nextCoordinates[componentIdx] = { x: coreX, y: coreY };
                        changed = true;
                    }
                }
            }

            // Clean up coordinates for points that no longer exist in coreSliderPoints.
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
        // correspond to active points in coreSliderPoints.
        setTransientSliderSet((previousTransientSliderSet) => {
            const nextTransientSliderSet = new Set<number>();

            // Keep only transient points that are still active.
            for (const componentIdx of previousTransientSliderSet) {
                if (activePointIndices.has(componentIdx)) {
                    nextTransientSliderSet.add(componentIdx);
                }
            }

            // Optimize: only update state if set contents actually changed.
            if (
                nextTransientSliderSet.size === previousTransientSliderSet.size
            ) {
                let changed = false;

                for (const componentIdx of nextTransientSliderSet) {
                    if (!previousTransientSliderSet.has(componentIdx)) {
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
    }, [coreSliderPoints, transientSliderSet]);

    /**
     * Update coordinates for a point based on slider input.
     *
     * Manages transient (mid-drag) vs. final (on release) state:
     * - During drag (transient=true): Updates UI locally, sends soft action (skippable=true)
     * - On release (transient=false): Snapshots core coordinates, sends final action
     *
     * For constrained points (e.g., on grid), the core state may snap to valid values.
     * On final commit we keep the just-selected value locally; the synchronization
     * effect then applies any snapped core coordinates when they arrive.
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
        const currentCoordinates = rendererSliderCoordinates[componentIdx] ?? {
            x: defaultX,
            y: defaultY,
        };
        const nextCoordinates = {
            x: axis === "x" ? value : currentCoordinates.x,
            y: axis === "y" ? value : currentCoordinates.y,
        };

        setRendererSliderCoordinates((previousCoordinates) => ({
            ...previousCoordinates,
            // Always use the just-committed slider value here.
            // If the point is constrained, the core state will publish the snapped
            // coordinate shortly after and the synchronization effect will update
            // this value once the point leaves the transient set.
            [componentIdx]: nextCoordinates,
        }));

        function clearTransientForPoint() {
            setTransientSliderSet((previousTransientSliderSet) => {
                if (!previousTransientSliderSet.has(componentIdx)) {
                    return previousTransientSliderSet;
                }

                const nextTransientSliderSet = new Set(
                    previousTransientSliderSet,
                );
                nextTransientSliderSet.delete(componentIdx);
                return nextTransientSliderSet;
            });
        }

        if (transient) {
            setTransientSliderSet((previousTransientSliderSet) => {
                if (previousTransientSliderSet.has(componentIdx)) {
                    return previousTransientSliderSet;
                }

                const nextTransientSliderSet = new Set(
                    previousTransientSliderSet,
                );
                nextTransientSliderSet.add(componentIdx);
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
                clearTransientForPoint();
            }
        }
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
        point: (typeof coreSliderPoints)[number],
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
    // Step size is range / 100 to give fine-grained control with typical slider.
    // Falls back to 1 if range is zero (single point or invalid bounds).
    const xStep = xMax !== xMin ? Math.abs(xMax - xMin) / 100 : 1;
    const yStep = yMax !== yMin ? Math.abs(yMax - yMin) / 100 : 1;

    /**
     * Helper to render a single axis slider (x or y).
     * Reduces duplication in the sliderSection mapping.
     */
    function renderAxisSlider(
        axis: "x" | "y",
        point: (typeof coreSliderPoints)[number],
        currentCoordinates: { x: number; y: number },
        pointLabelForAria: string,
    ) {
        const isX = axis === "x";
        const value = isX ? currentCoordinates.x : currentCoordinates.y;
        const min = isX ? xMin : yMin;
        const max = isX ? xMax : yMax;
        const step = isX ? xStep : yStep;
        const axisLabel = isX ? "x" : "y";

        return (
            <SliderUI
                key={axis}
                id={`${id}-point-${point.componentIdx}-${axis}`}
                label={`${axisLabel}: ${formatCoordinateForSlider(value, point)}`}
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
            />
        );
    }

    const sliderSection = SVs.addSliders
        ? coreSliderPoints.map((point) => {
              const {
                  componentIdx,
                  x: defaultX,
                  y: defaultY,
                  pointNumber,
                  label,
                  labelHasLatex,
              } = point;
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

              return (
                  <div
                      key={componentIdx}
                      style={{
                          marginTop: "12px",
                          padding: "10px",
                          border: "1px solid var(--canvasText)",
                          borderRadius: "8px",
                      }}
                  >
                      <div style={{ fontWeight: 600 }}>
                          {pointLabelForDisplay}
                      </div>
                      {point.addSliders !== "yonly" &&
                          renderAxisSlider(
                              "x",
                              point,
                              currentCoordinates,
                              pointLabelForAria,
                          )}
                      {point.addSliders !== "xonly" &&
                          renderAxisSlider(
                              "y",
                              point,
                              currentCoordinates,
                              pointLabelForAria,
                          )}
                  </div>
              );
          })
        : null;

    // Load diagcess script
    useEffect(() => {
        let active = true;

        ensureDiagcessScriptLoaded()
            .then(() => {
                if (active) {
                    setDiagcessReady(true);
                }
            })
            .catch((error) => {
                console.error(error);
            });

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
            setCmlContent("");
            return;
        }

        const resetBuildState = () => {
            setSvgMarkup("");
            setSvgMessage("Building...");
            setCmlContent("");
        };

        const runBuildWithLogging = (startBuild: () => Promise<void>) => {
            startBuild().catch((error) => {
                console.error("[prefigure] build failed", error);
            });
        };

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
                    setCmlContent,
                });
            } catch (error) {
                if (
                    error instanceof DOMException &&
                    error.name === "AbortError"
                ) {
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
        // Call diagcess.Base.init() after content is set
        const diagcess = diagcessApi();
        if (
            diagcessReady &&
            svgMarkup &&
            hasAnnotationsXml(cmlContent) &&
            diagcess
        ) {
            const prefigureContainer = prefigureContainerRef.current;
            if (prefigureContainer) {
                for (const child of Array.from(prefigureContainer.children)) {
                    if (
                        child instanceof HTMLParagraphElement &&
                        child.classList.contains("cacc-message")
                    ) {
                        child.remove();
                    }
                }

                // diagcess mutates molMap during init, so clear any stale
                // entries before re-running it against newly inserted markup.
                diagcess.Base.molMap = {};
                if (diagcessTimerRef.current) {
                    clearTimeout(diagcessTimerRef.current);
                }
                // Wait briefly for the sanitized SVG/CML markup to be present
                // in the live DOM before diagcess scans and annotates it.
                diagcessTimerRef.current = setTimeout(() => {
                    diagcessTimerRef.current = null;
                    diagcess.Base.init();
                }, DIAGCESS_REINIT_DELAY_MS);
            }
        }

        return () => {
            if (diagcessTimerRef.current) {
                clearTimeout(diagcessTimerRef.current);
                diagcessTimerRef.current = null;
            }
        };
    }, [svgMarkup, cmlContent, diagcessReady]);

    const frameStyle: React.CSSProperties = {
        ...surfaceStyle,
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
        <div id={id} ref={prefigureContainerRef}>
            <div className="ChemAccess-element" style={frameStyle}>
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
                    dangerouslySetInnerHTML={{ __html: cmlContent }}
                />
            </div>
            {sliderSection}
        </div>
    );
});
