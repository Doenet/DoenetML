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
        prefigureXML?: string | null;
        childrenSource?: string | null;
        showBorder?: boolean;
        width?: { size: string; isAbsolute: boolean };
        aspectRatio?: number | string;
    };
    surfaceStyle: React.CSSProperties;
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

    return /<annotations?\b|<annotation\b/i.test(trimmed);
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
        allowedRootNames: new Set(["annotations", "annotation", "diagram"]),
    });
}

export default React.memo(function Prefigure({
    id,
    SVs,
    surfaceStyle,
}: PrefigureRendererProps) {
    const diagramXML = SVs.prefigureXML ?? SVs.childrenSource;
    const [svgMarkup, setSvgMarkup] = useState("");
    const [svgMessage, setSvgMessage] = useState("Building...");
    const [cmlContent, setCmlContent] = useState("");
    const [diagcessReady, setDiagcessReady] = useState(Boolean(diagcessApi()));
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fetchAbortControllerRef = useRef<AbortController | null>(null);
    const prefigureContainerRef = useRef<HTMLDivElement | null>(null);
    const requestSequenceRef = useRef(0);
    const hasStartedBuildRef = useRef(false);

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

                diagcess.Base.molMap = {};
                setTimeout(() => {
                    diagcess.Base.init();
                }, 400);
            }
        }
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
        </div>
    );
});
