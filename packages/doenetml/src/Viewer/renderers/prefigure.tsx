import React, { useEffect, useRef, useState } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

const PREFIGURE_BUILD_DEBOUNCE_MS = 1000;

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

export default React.memo(function Prefigure(props: UseDoenetRendererProps) {
    const { id, SVs } = useDoenetRenderer(props);

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
        if ((window as any).diagcess) {
            return;
        }

        const script = document.createElement("script");
        script.src =
            "https://cdn.jsdelivr.net/npm/diagcess@1.4.0/dist/diagcess.js";
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
                const response = await fetch(
                    "https://prefigure.doenet.org/build",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/xml",
                        },
                        body: diagramXML,
                        signal: abortController.signal,
                    },
                );

                if (requestSequence !== requestSequenceRef.current) {
                    return;
                }

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }

                const data = await response.json();

                if (requestSequence !== requestSequenceRef.current) {
                    return;
                }

                const svg = normalizeSerializedMarkup(data.svg);
                if (svg) {
                    setSvgContent(svg);
                } else {
                    setSvgContent(
                        "Error: No SVG found in response: " +
                            JSON.stringify(data),
                    );
                }

                const cml = normalizeSerializedMarkup(data.xml);
                if (cml) {
                    setCmlContent(cml);
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
                    `<span style="color:red">Error: ${errorMessage}</span><br><br>Check the Console (F12) for CORS details if this failed immediately.`,
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
            (window as any).diagcess
        ) {
            (window as any).diagcess.Base.init();
        }
    }, [svgContent, cmlContent]);

    let outerStyle: React.CSSProperties = {};
    let innerStyle: React.CSSProperties = {};

    if (SVs.displayMode === "inline") {
        outerStyle = { display: "inline-block", verticalAlign: "middle" };
        innerStyle = {
            display: "inline-flex",
            alignItems: "start",
            width: "100%",
        };
    } else {
        outerStyle = { display: "flex", justifyContent: SVs.horizontalAlign };
        innerStyle = { maxWidth: "100%" };
    }

    const hasRenderedSvg = /<svg[\s>]/i.test(svgContent);

    const contentStyle: React.CSSProperties =
        SVs.showBorder && hasRenderedSvg
            ? {
                  border: "2px solid var(--canvasText)",
                  borderRadius: "10px",
                  overflow: "hidden",
              }
            : { overflow: "hidden" };

    return (
        <div style={outerStyle}>
            <div style={innerStyle}>
                <div
                    id={id}
                    className="ChemAccess-element"
                    style={contentStyle}
                >
                    <div
                        className="svg"
                        dangerouslySetInnerHTML={{ __html: svgContent }}
                    />
                    <div
                        className="cml"
                        dangerouslySetInnerHTML={{ __html: cmlContent }}
                    />
                </div>
            </div>
        </div>
    );
});
