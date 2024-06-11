/*
 * This file is for running a dev test.
 * It does not show up in the bundled package.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { DoenetMLIframe } from "./index";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
    <React.Fragment>
        <h4>DoenetML 0.6:</h4>
        <DoenetMLIframe
            doenetML={`<p>Use this to test DoenetML</p>
                <graph showNavigation="false">

                  <line through="(-8,8) (9,6)" />
                  <line through="(0,4)" slope="1/2" styleNumber="2" />

                  <line equation="y=2x-8" styleNumber="3" />
                  <line equation="x=-6" styleNumber="4" />

                </graph>`}
            doenetMLProps={{} as any}
            standaloneUrl="https://cdn.jsdelivr.net/npm/@doenet/standalone@0.6.4/doenet-standalone.js"
            cssUrl="https://cdn.jsdelivr.net/npm/@doenet/standalone@0.6.4/style.css"
            onMessage={(message) => {
                console.log("Got message (0.6): ", message);
            }}
        />
        <h4>DoenetML 0.7:</h4>
        <DoenetMLIframe
            doenetML={`<p>Use this to test DoenetML</p>
                <graph showNavigation="false">

                  <line through="(-8,8) (9,6)" />
                  <line through="(0,4)" slope="1/2" styleNumber="2" />

                  <line equation="y=2x-8" styleNumber="3" />
                  <line equation="x=-6" styleNumber="4" />

                </graph>`}
            doenetMLProps={{} as any}
            standaloneUrl="https://cdn.jsdelivr.net/npm/@doenet/standalone@0.7.0-alpha7/doenet-standalone.js"
            cssUrl="https://cdn.jsdelivr.net/npm/@doenet/standalone@0.7.0-alpha7/style.css"
            onMessage={(message) => {
                console.log("Got message (0.7): ", message);
            }}
        />
    </React.Fragment>,
);
