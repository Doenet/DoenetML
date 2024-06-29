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
            <h4>DoenetML {DOENET_LEGACY_VERSION}:</h4>

            <DoenetViewer
                doenetML={`<p>Use this to test DoenetML</p>
                <graph showNavigation="false">

                  <line through="(-8,8) (9,6)" />
                  <line through="(0,4)" slope="1/2" styleNumber="2" />

                  <line equation="y=2x-8" styleNumber="3" />
                  <line equation="x=-6" styleNumber="4" />

                </graph>`}
                doenetmlVersion={DOENET_LEGACY_VERSION}
            />
            <h4>DoenetML {STANDALONE_VERSION} (locally-built copy):</h4>
            <DoenetViewer
                doenetML={`<p>Use this to test DoenetML</p>
                <graph showNavigation="false">

                  <line through="(-8,8) (9,6)" />
                  <line through="(0,4)" slope="1/2" styleNumber="2" />

                  <line equation="y=2x-8" styleNumber="3" />
                  <line equation="x=-6" styleNumber="4" />

                </graph>`}
                generatedVariantCallback={(variant: any) =>
                    console.log("found variant", variant)
                }
                flags={{ readOnly: true }}
                standaloneUrl={STANDALONE_BLOB_URL}
                cssUrl={STANDALONE_CSS_BLOB_URL}
            />
            <h4>DoenetML 0.7 editor:</h4>
            <DoenetEditor
                doenetML={`<p>Use this to test DoenetML</p>
                <graph showNavigation="false">

                  <line through="(-8,8) (9,6)" />
                  <line through="(0,4)" slope="1/2" styleNumber="2" />

                  <line equation="y=2x-8" styleNumber="3" />
                  <line equation="x=-6" styleNumber="4" />

                </graph>`}
                doenetmlVersion="0.7.0-alpha10"
                doenetmlChangeCallback={(doenetml: any) =>
                    console.log("new doenetml", doenetml)
                }
            />
        </React.Fragment>
    );
}
