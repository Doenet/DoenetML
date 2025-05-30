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
            showAnswerResponseMenu
            height="100%"
        />
    );
}
