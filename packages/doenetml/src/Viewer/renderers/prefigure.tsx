import React, { useEffect, useRef, useState } from "react";
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

    if (doc.querySelector("parsererror")) {
        return "";
    }

    const rootName = doc.documentElement?.tagName?.toLowerCase?.();
    if (!rootName || !allowedRootNames.has(rootName)) {
        return "";
    }

    const elements = Array.from(doc.getElementsByTagName("*"));
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
            const isScriptUrl = /^\s*javascript:/i.test(value);
            if (isEventHandler || isScriptUrl) {
                element.removeAttribute(attribute.name);
            }
        }
    }

    return new XMLSerializer().serializeToString(doc);
}

function sanitizeSvgMarkup(markup: string): string {
    return sanitizeXmlMarkup({
        markup,
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
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fetchAbortControllerRef = useRef<AbortController | null>(null);
    const requestSequenceRef = useRef(0);
    const hasStartedBuildRef = useRef(false);

    // Load diagcess script
    useEffect(() => {
        // Check if script is already loaded
        if (diagcessApi()) {
            return;
        }

        const script = document.createElement("script");
        script.src = PREFIGURE_DIAGCESS_SCRIPT_URL;
        script.type = "text/javascript";
        script.async = true;

        document.head.appendChild(script);

        return () => {
            // Cleanup: remove script on unmount
            document.head.removeChild(script);
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
            svgContent &&
            svgContent !== "Building..." &&
            hasAnnotationsXml(cmlContent) &&
            diagcessApi()
        ) {
            diagcessApi()?.Base?.init?.();
        }
    }, [svgContent, cmlContent]);

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
