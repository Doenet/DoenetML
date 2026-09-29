import React from "react";
import { createRoot } from "react-dom/client";
import { CodeMirror } from "@doenet/codemirror";
import { ResizablePanelPair, UiButton } from "@doenet/ui-components";
// @ts-ignore
import "@doenet/ui-components/style.css";
// @ts-ignore
import doenetMLstring from "./testCode.doenet?raw";

// @ts-ignore
import "./main.css";
import { DoenetMLToPretext } from "@doenet/doenetml-to-pretext";
import { PtxCompiler } from "../src/index";

const FRAGMENT_MODE_STORAGE_KEY = "doenetml-print-fragment-mode";
const SOURCE_STORAGE_KEY = "doenetml-print-source";
const VARIANT_STORAGE_KEY = "doenetml-print-variant";

function getInitialVariantIndex(): number {
    try {
        const stored = Number(localStorage.getItem(VARIANT_STORAGE_KEY));
        return Number.isInteger(stored) && stored >= 1 ? stored : 1;
    } catch {
        return 1;
    }
}

function getInitialFragmentMode(): boolean {
    try {
        return localStorage.getItem(FRAGMENT_MODE_STORAGE_KEY) === "true";
    } catch {
        return false;
    }
}

function getInitialSource(): string {
    try {
        return localStorage.getItem(SOURCE_STORAGE_KEY) ?? doenetMLstring;
    } catch {
        return doenetMLstring;
    }
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

function App() {
    const [source, setSource] = React.useState<string>(getInitialSource);
    const [pretextOutput, setPretextOutput] = React.useState<string>("");
    const [outputMode, setOutputMode] = React.useState<"pretext" | "html">(
        "pretext",
    );
    const [isConverting, setIsConverting] = React.useState<boolean>(false);
    const [fragment, setFragment] = React.useState<boolean>(
        getInitialFragmentMode,
    );
    const [variantIndex, setVariantIndex] = React.useState<number>(
        getInitialVariantIndex,
    );
    const doenetMLToPretextInstance = React.useRef(
        new DoenetMLToPretext(),
    ).current;

    const [pretexCompiler, _setPtxCompiler] = React.useState<PtxCompiler>(
        new PtxCompiler(),
    );

    React.useEffect(() => {
        try {
            localStorage.setItem(FRAGMENT_MODE_STORAGE_KEY, String(fragment));
        } catch {
            // Ignore localStorage failures in constrained environments.
        }
    }, [fragment]);

    React.useEffect(() => {
        try {
            localStorage.setItem(VARIANT_STORAGE_KEY, String(variantIndex));
        } catch {
            // Ignore localStorage failures in constrained environments.
        }
    }, [variantIndex]);

    React.useEffect(() => {
        try {
            localStorage.setItem(SOURCE_STORAGE_KEY, source);
        } catch {
            // Ignore localStorage failures in constrained environments.
        }
    }, [source]);

    function resetSavedState() {
        try {
            localStorage.removeItem(FRAGMENT_MODE_STORAGE_KEY);
            localStorage.removeItem(SOURCE_STORAGE_KEY);
            localStorage.removeItem(VARIANT_STORAGE_KEY);
        } catch {
            // Ignore localStorage failures in constrained environments.
        }

        setFragment(false);
        setVariantIndex(1);
        setSource(doenetMLstring);
        setPretextOutput("");
    }

    return (
        <div className="container">
            <div className="banner">
                <div className="banner-controls">
                    <UiButton
                        onClick={async () => {
                            if (isConverting) {
                                return;
                            }
                            setIsConverting(true);
                            try {
                                const ret =
                                    await doenetMLToPretextInstance.convert(
                                        source,
                                        {
                                            fragment,
                                            throwOnError: false,
                                            variantIndex,
                                        },
                                    );
                                setPretextOutput(ret);
                                setOutputMode("pretext");
                            } finally {
                                setIsConverting(false);
                            }
                        }}
                        disabled={isConverting}
                    >
                        {isConverting
                            ? "Converting to PreTeXt..."
                            : "Convert to PreTeXt"}
                    </UiButton>
                    <UiButton
                        onClick={async () => {
                            setIsConverting(true);
                            try {
                                // @ts-ignore
                                window.pretextCompiler = pretexCompiler;

                                const pretextOutput =
                                    await doenetMLToPretextInstance.convert(
                                        source,
                                        {
                                            fragment: false,
                                            throwOnError: false,
                                            variantIndex,
                                        },
                                    );
                                await pretexCompiler.init();
                                pretexCompiler.setMainPtx(pretextOutput);
                                const renderedHTML =
                                    await pretexCompiler.full_compile();
                                setPretextOutput(renderedHTML);
                                setOutputMode("html");
                            } finally {
                                setIsConverting(false);
                            }
                        }}
                        disabled={isConverting}
                    >
                        Compile with PtxCompiler
                    </UiButton>
                    <label
                        className="fragment-toggle"
                        title="Which variant of the document to convert. A document that selects or samples at random differs from one variant to the next."
                    >
                        Variant
                        <input
                            type="number"
                            min={1}
                            step={1}
                            value={variantIndex}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                if (Number.isInteger(value) && value >= 1) {
                                    setVariantIndex(value);
                                }
                            }}
                            style={{ width: "4em" }}
                        />
                    </label>
                    <label
                        className="fragment-toggle"
                        title="Render a PreTeXt fragment (without a root <pretext> tag)."
                    >
                        <input
                            type="checkbox"
                            checked={fragment}
                            onChange={(e) => setFragment(e.target.checked)}
                        />
                        Fragment mode
                    </label>
                    <UiButton
                        className="reset-button"
                        title="Clear saved Doenet code and fragment mode from local storage, and reset them to defaults."
                        disabled={isConverting}
                        onClick={resetSavedState}
                    >
                        Reset
                    </UiButton>
                </div>
            </div>
            <ResizablePanelPair
                panelA={<CodeMirror value={source} onChange={setSource} />}
                panelB={
                    <div className="pretext-output-container">
                        <h1>
                            PreTeXt Output{" "}
                            {outputMode === "html" && (
                                <UiButton
                                    onClick={() => {
                                        const newWindow = window.open();
                                        if (newWindow) {
                                            newWindow.document.write(
                                                pretextOutput,
                                            );
                                            newWindow.document.close();
                                        }
                                    }}
                                >
                                    Show Printable Version in New Window
                                </UiButton>
                            )}
                        </h1>
                        {isConverting ? (
                            <div className="loading-state">
                                <div
                                    className="spinner"
                                    aria-label="Converting to PreTeXt"
                                />
                                <p>Converting to PreTeXt...</p>
                            </div>
                        ) : pretextOutput ? (
                            <textarea
                                className="pretext-output"
                                readOnly
                                value={pretextOutput}
                            ></textarea>
                        ) : (
                            <p>
                                Your converted PreTeXt content will appear here.
                            </p>
                        )}
                    </div>
                }
            />
        </div>
    );
}
