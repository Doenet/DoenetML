import React from "react";
import { createRoot } from "react-dom/client";
import { CodeMirror } from "@doenet/codemirror";
import { ResizablePanelPair, Button, UiButton } from "@doenet/ui-components";
import "@doenet/ui-components/style.css";
// @ts-ignore
import doenetMLstring from "./testCode.doenet?raw";

import "./main.css";
import { getStaticDast } from "../src";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

function App() {
    const [source, setSource] = React.useState<string>(doenetMLstring);

    return (
        <div className="container">
            <div className="banner">
                <UiButton
                    onClick={async () => {
                        console.log("Converting to PreTeXt", source);
                        const ret = await getStaticDast(source);
                        console.log("Conversion result:", ret);
                    }}
                >
                    Convert to PreTeXt
                </UiButton>
            </div>
            <ResizablePanelPair
                panelA={
                    <CodeMirror value={doenetMLstring} onChange={setSource} />
                }
                panelB={
                    <div style={{ padding: "1em" }}>
                        <h1>PreTeXt Output</h1>
                        <p>Your converted PreTeXt content will appear here.</p>
                    </div>
                }
            />
        </div>
    );
}
