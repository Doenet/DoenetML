import React from "react";
import { createRoot } from "react-dom/client";
import { DoenetViewer, DoenetEditor } from "../src/index";
// @ts-ignore
import PREFIGURE_LOCAL_MODULE_URL from "@doenet/prefigure/prefigure.js?url";

// @ts-ignore
import doenetMLstring from "./testCode.doenet?raw";

// Toggle this to switch prefigure source in dev.
// `true`: load local prefigure build served by this dev server.
// `false`: use runtime defaults (CDN module URL from prefigureConfig).
const USE_LOCAL_PREFIGURE = true;

if (USE_LOCAL_PREFIGURE) {
    (globalThis as any).__DOENET_PREFIGURE_MODULE_URL__ = new URL(
        PREFIGURE_LOCAL_MODULE_URL,
        window.location.href,
    ).toString();
    (globalThis as any).__DOENET_PREFIGURE_INDEX_URL__ = new URL(
        "./assets/",
        (globalThis as any).__DOENET_PREFIGURE_MODULE_URL__,
    ).toString();
} else {
    delete (globalThis as any).__DOENET_PREFIGURE_MODULE_URL__;
    delete (globalThis as any).__DOENET_PREFIGURE_INDEX_URL__;
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

function App() {
    return (
        <DoenetEditor
            doenetML={doenetMLstring}
            height="100%"
            fetchExternalDoenetML={fetchExternalDoenetML}
        />
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
