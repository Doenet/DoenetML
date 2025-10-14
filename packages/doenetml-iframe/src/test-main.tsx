/*
 * This file is for running a dev test.
 * It does not show up in the bundled package.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { DoenetViewer, DoenetEditor } from "./index";

// @ts-ignore
import STANDALONE_SOURCE from "@doenet/standalone/doenet-standalone.js?raw";
// @ts-ignore
import STANDALONE_CSS from "@doenet/standalone/style.css?raw";
// @ts-ignore
import { version as STANDALONE_VERSION } from "@doenet/standalone/package.json";
declare const STANDALONE_SOURCE: string;
declare const STANDALONE_CSS: string;
// Make blob URLs for the currently-compiled (local) version of standalone
const STANDALONE_BLOB_URL = URL.createObjectURL(
    new Blob([STANDALONE_SOURCE], { type: "application/javascript" }),
);
const STANDALONE_CSS_BLOB_URL = URL.createObjectURL(
    new Blob([STANDALONE_CSS], { type: "text/css" }),
);

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);

function App() {
    const DOENET_LEGACY_VERSION = "0.6.5";

    return (
        <React.Fragment>
            <h4>DoenetML {STANDALONE_VERSION} (locally-built copy):</h4>
            <DoenetViewer
                doenetML={`<mathInput /><p><mathInput />Use this to test DoenetML<mathInput /></p>
                <graph />
                <graph />
                <graph />
               <mathInput />`}
                generatedVariantCallback={(variant: any) =>
                    console.log("found variant", variant)
                }
                standaloneUrl={STANDALONE_BLOB_URL}
                cssUrl={STANDALONE_CSS_BLOB_URL}
                activityId={"a"}
                docId={"1"}
            />
            <button
                onClick={() => {
                    window.postMessage({
                        subject: "SPLICE.submitAllAnswers",
                    });
                }}
            >
                Submit all
            </button>

            <h4>DoenetML {STANDALONE_VERSION} (locally-built copy):</h4>
            <DoenetEditor
                doenetML={`<mathInput /><p><mathInput />Use this to test DoenetML<mathInput /></p>
                <graph />
                <graph />
                <graph />
               <mathInput />`}
                standaloneUrl={STANDALONE_BLOB_URL}
                cssUrl={STANDALONE_CSS_BLOB_URL}
                activityId={"a"}
            />
        </React.Fragment>
    );
}
