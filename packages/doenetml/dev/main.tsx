import React from "react";
import { createRoot } from "react-dom/client";
import { DoenetViewer, DoenetEditor } from "../src/index";

// @ts-ignore
import doenetMLstring from "./testCode.doenet?raw";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

function App() {
    return (
        <DoenetEditor
            doenetML={doenetMLstring}
            height="100%"
            retrieveDoenetML={retrieveDoenetML}
        />
    );
}

const doenetMLs: Record<string, string> = {
    abcdef: `<problem name="p"><title>A problem</title><p>What is 1+1? <answer name="ans">2</answer></p><p>Credit achieved: $p.creditAchieved</p></problem>`,
    defghi: `<problem name="loop" copy="doenet:defghi" />`,
};

function retrieveDoenetML(sourceUri: string) {
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
