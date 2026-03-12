import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import {
    PREFIGURE_BUILD_ENDPOINT,
    PREFIGURE_DIAGCESS_SCRIPT_URL,
} from "./utils/prefigureConfig";

const PREFIGURE_BUILD_DEBOUNCE_MS = 1000;

type DiagcessApi = {
    Base?: {
        init?: () => void;
    };
};

type PrefigureBuildResponse = {
    svg?: unknown;
    xml?: unknown;
};

type PrefigureRendererProps = {
    id: string;
    SVs: {
        prefigureXML?: string | null;
        childrenSource?: string | null;
        showBorder?: boolean;
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
        const tagName = element.tagName.toLowerCase();

        if (FORBIDDEN_MARKUP_TAGS.has(tagName)) {
            element.remove();
            continue;
        }

        const attributes = Array.from(element.attributes);
        for (const attribute of attributes) {
            const name = attribute.name.toLowerCase();
            const value = attribute.value.trim();
            const isEventHandler = name.startsWith("on");
            const isScriptUrl = isUnsafeUrl(value);
            const hasUnsafeUrl = URL_ATTRIBUTE_NAMES.has(name) && isScriptUrl;
            const hasStyleAttr = name === "style";
            if (isEventHandler || hasUnsafeUrl || hasStyleAttr) {
                element.removeAttribute(attribute.name);
            }
        }
    }

    return new XMLSerializer().serializeToString(root);
}

function sanitizeSvgMarkup(markup: string): string {
    const purified = DOMPurify.sanitize(markup, {
        USE_PROFILES: { svg: true, svgFilters: true },
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

function sanitizeAnnotationsMarkup(markup: string): string {
    return sanitizeXmlMarkup({
        markup,
        mimeType: "application/xml",
        allowedRootNames: new Set(["annotations", "annotation"]),
    });
}

export default React.memo(function Prefigure({
    id,
    SVs,
    surfaceStyle,
}: PrefigureRendererProps) {
    const diagramXML = SVs.prefigureXML ?? SVs.childrenSource;
    const [svgContent, setSvgContent] = useState("Building...");
    const [cmlContent, setCmlContent] = useState("");
    const [diagcessReady, setDiagcessReady] = useState(Boolean(diagcessApi()));
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fetchAbortControllerRef = useRef<AbortController | null>(null);
    const requestSequenceRef = useRef(0);
    const hasStartedBuildRef = useRef(false);

    // Load diagcess script
    useEffect(() => {
        let active = true;

        void ensureDiagcessScriptLoaded()
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
            setSvgContent("");
            setCmlContent("");
            return;
        }

        const startBuild = async () => {
            const requestSequence = ++requestSequenceRef.current;
            const abortController = new AbortController();
            fetchAbortControllerRef.current = abortController;

            setSvgContent("Building...");
            setCmlContent("");

            try {
                const response = await fetch(PREFIGURE_BUILD_ENDPOINT, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/xml",
                    },
                    body: diagramXML,
                    signal: abortController.signal,
                });

                if (requestSequence !== requestSequenceRef.current) {
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }

                const data = (await response.json()) as PrefigureBuildResponse;

                if (requestSequence !== requestSequenceRef.current) {
                    return;
                }

                const svg = normalizeSerializedMarkup(data.svg);
                if (svg) {
                    const sanitizedSvg = sanitizeSvgMarkup(svg);
                    if (sanitizedSvg) {
                        setSvgContent(sanitizedSvg);
                    } else {
                        setSvgContent(
                            "Error: Invalid or unsafe SVG in build response.",
                        );
                    }
                } else {
                    setSvgContent(
                        "Error: No SVG found in response: " +
                            JSON.stringify(data),
                    );
                }

                const cml = normalizeSerializedMarkup(data.xml);
                if (cml) {
                    setCmlContent(sanitizeAnnotationsMarkup(cml));
                } else {
                    setCmlContent("");
                }
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

                console.error(error);
                const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                setSvgContent(
                    `Error: ${errorMessage}. Check the Console (F12) for CORS details if this failed immediately.`,
                );
            } finally {
                if (fetchAbortControllerRef.current === abortController) {
                    fetchAbortControllerRef.current = null;
                }
            }
        };

        if (!hasStartedBuildRef.current) {
            hasStartedBuildRef.current = true;
            void startBuild();
        } else {
            debounceTimerRef.current = setTimeout(
                () => void startBuild(),
                PREFIGURE_BUILD_DEBOUNCE_MS,
            );
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
        if (
            diagcessReady &&
            svgContent &&
            svgContent !== "Building..." &&
            hasAnnotationsXml(cmlContent) &&
            diagcessApi()
        ) {
            diagcessApi()?.Base?.init?.();
        }
    }, [svgContent, cmlContent, diagcessReady]);

    const contentStyle: React.CSSProperties = SVs.showBorder
        ? {
              ...surfaceStyle,
              borderRadius: "10px",
              overflow: "hidden",
          }
        : { ...surfaceStyle, overflow: "hidden" };

    return (
        <div id={id} className="ChemAccess-element" style={contentStyle}>
            <div
                className="svg"
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />
            <div
                className="cml"
                dangerouslySetInnerHTML={{ __html: cmlContent }}
            />
        </div>
    );
});
