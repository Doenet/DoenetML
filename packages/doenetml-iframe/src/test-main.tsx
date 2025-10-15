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
                <problem copy="doenet:abcdef" />
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
                fetchExternalDoenetML={fetchExternalDoenetML}
            />

            <h4>DoenetML {STANDALONE_VERSION} (locally-built copy):</h4>
            <DoenetEditor
                doenetML={`<mathInput /><p><mathInput />Use this to test DoenetML<mathInput /></p>
                <problem copy="doenet:abcdef" />
                <graph />
                <graph />
                <graph />
               <mathInput />`}
                standaloneUrl={STANDALONE_BLOB_URL}
                cssUrl={STANDALONE_CSS_BLOB_URL}
                activityId={"a"}
                showErrorsWarnings={false}
                showResponses={false}
                fetchExternalDoenetML={fetchExternalDoenetML}
            />
        </React.Fragment>
    );
}

const doenetMLs: Record<string, string> = {
    abcdef: `<problem name="p"><title>A problem</title><p>What is 1+1? <answer name="ans">2</answer></p><p>Credit achieved: $p.creditAchieved</p></problem>`,
    defghi: `<problem name="loop" copy="doenet:defghi" />`,
    abc: `<section name="s1" copy="doenet:def"><p name="p1">Hello</p></section>`,
    def: `<section name="s2" copy="doenet:ghi"><p name="p2">Bye</p></section>`,
    ghi: `<section name="s3"><p name="p3">How</p></section>`,
};

function fetchExternalDoenetML(sourceUri: string) {
    return new Promise<string>((resolve, reject) => {
        setTimeout(() => {
            const match = sourceUri.match(/^doenet:(\w+)/);

            if (match) {
                const doenetML = doenetMLs[match[1]];

                if (doenetML) {
                    return resolve(doenetML);
                }
            }
            reject(`DoenetML for "${sourceUri}" not found.`);
        });
    });
}
