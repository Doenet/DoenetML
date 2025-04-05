import React from "react";
import { createRoot } from "react-dom/client";
import { DoenetML, EditorViewer } from "../src/index";

// @ts-ignore
import doenetMLstring from "./testCode.doenet?raw";
import { ResizablePanelPair } from "../src/editor/components/resizable-panel-pair";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

function App() {
    return <EditorViewer doenetML={doenetMLstring} />;
}
