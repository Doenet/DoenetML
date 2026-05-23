import React from "react";
import { PtxCompiler, mainPtxDefault } from "./ptx-compiler";

const Compiler = new PtxCompiler();
(window as any).comp = Compiler;

/**
 * A UI for rendering a file using PreTeXt in the browser.
 */
export function RenderingUi() {
    const [mainPtx, _setMainPtx] = React.useState(mainPtxDefault);
    const [isInitializing, setIsInitializing] = React.useState(true);
    const [compiledOutput, setCompiledOutput] = React.useState("");
    const [isCompiling, setIsCompiling] = React.useState(false);
    const [savedSinceChange, setSavedSinceChange] = React.useState(true);
    const [viewMode, setViewMode] = React.useState<"source" | "compiled">(
        "source",
    );

    function setMainPtx(value: string) {
        _setMainPtx(value);
        setSavedSinceChange(false);
    }

    React.useEffect(() => {
        Compiler.init().then(() => setIsInitializing(false));
    }, []);

    return (
        <div className="container">
            <div className="left">
                <h4>
                    <code>main.ptx</code>
                </h4>
                <div className="toolbar">
                    Status: {isInitializing ? "Initializing..." : "✅ Ready"}
                    <button
                        disabled={isCompiling}
                        onClick={async () => {
                            setIsCompiling(true);
                            try {
                                Compiler.setMainPtx(mainPtx);
                                setSavedSinceChange(true);
                                await Compiler.compile();
                                setCompiledOutput(Compiler.getHtmlWithLocalReferences());
                            } finally {
                                setIsCompiling(false);
                            }
                        }}
                    >
                        {isCompiling ? "Compiling..." : "Compile"}
                        {!savedSinceChange && "*"}
                    </button>
                </div>
                <textarea
                    value={mainPtx}
                    onChange={(e) => setMainPtx(e.target.value)}
                />
            </div>
            <div className="right">
                <h4>Compiled Output</h4>
                <div className="toolbar">
                    Viewing: {viewMode === "source" ? "Source" : "Webpage"}
                    <button
                        onClick={() => {
                            setViewMode((current) =>
                                current === "source" ? "compiled" : "source",
                            );
                        }}
                    >
                        {viewMode === "source" ? "View Webpage" : "View Source"}
                    </button>
                </div>
                {viewMode === "source" ? (
                    <textarea value={compiledOutput} readOnly />
                ) : (
                    <iframe
                        title="Compiled Output"
                        srcDoc={compiledOutput}
                        style={{ width: "100%", height: "100%" }}
                    />
                )}
            </div>
        </div>
    );
}
