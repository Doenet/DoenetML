import React, { useEffect, useState, useRef, createContext } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

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
    let { id, SVs, children, ignoreUpdate, actions, callAction } =
        useDoenetRenderer(props);

    const diagramXML = SVs.prefigureXML ?? SVs.childrenSource;
    const [svgContent, setSvgContent] = useState("Building...");
    const [cmlContent, setCmlContent] = useState("");
    const svgRef = useRef<HTMLDivElement>(null);
    const cmlRef = useRef<HTMLDivElement>(null);

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
        async function buildDiagram() {
            if (!diagramXML) return;

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
                    },
                );

                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }

                const data = await response.json();

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
                console.error(error);
                const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                setSvgContent(
                    `<span style="color:red">Error: ${errorMessage}</span><br><br>Check the Console (F12) for CORS details if this failed immediately.`,
                );
            }
        }

        buildDiagram();
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

    return (
        <div>
            <div id={id} className="ChemAccess-element">
                <div
                    className="svg"
                    ref={svgRef}
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                />
                <div
                    className="cml"
                    ref={cmlRef}
                    dangerouslySetInnerHTML={{ __html: cmlContent }}
                />
            </div>
        </div>
    );
});
