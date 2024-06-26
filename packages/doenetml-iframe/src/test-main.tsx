/*
 * This file is for running a dev test.
 * It does not show up in the bundled package.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { DoenetViewerIframe, DoenetEditorIframe } from "./index";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <React.Fragment>
        <h4>DoenetML 0.6:</h4>
        <DoenetViewerIframe
            doenetML={`<p>Use this to test DoenetML</p>
                <graph showNavigation="false">

                  <line through="(-8,8) (9,6)" />
                  <line through="(0,4)" slope="1/2" styleNumber="2" />

                  <line equation="y=2x-8" styleNumber="3" />
                  <line equation="x=-6" styleNumber="4" />

                </graph>`}
            standaloneUrl="https://cdn.jsdelivr.net/npm/@doenet/standalone@0.6.4/doenet-standalone.js"
            cssUrl="https://cdn.jsdelivr.net/npm/@doenet/standalone@0.6.4/style.css"
        />
        <h4>DoenetML 0.7:</h4>
        <DoenetViewerIframe
            doenetML={`<p>Use this to test DoenetML</p>
                <graph showNavigation="false">

                  <line through="(-8,8) (9,6)" />
                  <line through="(0,4)" slope="1/2" styleNumber="2" />

                  <line equation="y=2x-8" styleNumber="3" />
                  <line equation="x=-6" styleNumber="4" />

                </graph>`}
            standaloneUrl="https://cdn.jsdelivr.net/npm/@doenet/standalone@0.7.0-alpha9/doenet-standalone.js"
            cssUrl="https://cdn.jsdelivr.net/npm/@doenet/standalone@0.7.0-alpha9/style.css"
            generatedVariantCallback={(variant: any) =>
                console.log("found variant", variant)
            }
        />
        <h4>DoenetML 0.7 editor:</h4>
        <DoenetEditorIframe
            doenetML={`<p>Use this to test DoenetML</p>
                <graph showNavigation="false">

                  <line through="(-8,8) (9,6)" />
                  <line through="(0,4)" slope="1/2" styleNumber="2" />

                  <line equation="y=2x-8" styleNumber="3" />
                  <line equation="x=-6" styleNumber="4" />

                </graph>`}
            standaloneUrl="https://cdn.jsdelivr.net/npm/@doenet/standalone@0.7.0-alpha9/doenet-standalone.js"
            cssUrl="https://cdn.jsdelivr.net/npm/@doenet/standalone@0.7.0-alpha9/style.css"
            doenetmlChangeCallback={(doenetml: any) =>
                console.log("new doenetml", doenetml)
            }
        />
    </React.Fragment>,
);
