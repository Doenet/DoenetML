import React, { useEffect, useRef, useState } from "react";
import {
    buildPrefigureDiagram,
    currentPrefigureDebounceMs,
    isAbortError,
    warmupPrefigureInBackground,
} from "./utils/prefigureRuntime";
import {
    hasAnnotationsXml,
    sanitizeBuildResult,
} from "./utils/prefigureSanitize";
import {
    diagcessApi,
    ensureDiagcessScriptLoaded,
    queueDiagcessReinit,
    removeDiagcessMessages,
} from "./utils/prefigureDiagcess";

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
            // currentPrefigureDebounceMs() is sourced from runtime readiness;
            // this keeps warm/cold UI behavior aligned with runtime selection.
            const isWarmMode = currentPrefigureDebounceMs() < 1000;

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

                const sanitized = sanitizeBuildResult(data);
                setSvgMarkup(sanitized.svgMarkup);
                setSvgMessage(sanitized.svgMessage);
                setAnnotationsXml(sanitized.annotationsXml);
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
            diagcessTimerRef.current = queueDiagcessReinit({
                diagcess,
                priorTimer: diagcessTimerRef.current,
            });
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
