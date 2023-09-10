/*
 * This file is for running a dev test of the codemirror component.
 * It does not show up in the bundled package.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { CodeMirror } from "@doenet/codemirror";
import { lezerToDast, parse } from "./parser";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import { filterPositionInfo } from "./dast-to-xml/utils";

const INITIAL_DOENET_SOURCE = `
<p>Use this to test DoenetML</p>
<graph showNavigation="false">

  <line through="(-8,8) (9,6)" />
  <line through="(0,4)" slope="1/2" styleNumber="2" />

  <line equation="y=2x-8" styleNumber="3" />
  <line equation="x=-6" styleNumber="4" />
  
</graph>
`;

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);

function App() {
    const [doenetSource, setDoenetSource] = React.useState(
        INITIAL_DOENET_SOURCE,
    );
    const [dast, setDast] = React.useState({});
    const [omitPosition, setOmitPosition] = React.useState(false);
    const [rawJson, setRawJson] = React.useState(false);

    React.useEffect(() => {
        let dast = lezerToDast(doenetSource);
        if (omitPosition) {
            dast = filterPositionInfo(dast) as any;
        }
        setDast(dast);
    }, [doenetSource, omitPosition]);

    return (
        <div
            style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
            <div>
                <input
                    type="checkbox"
                    id="include-position"
                    checked={omitPosition}
                    onChange={(e) => {
                        setOmitPosition(e.target.checked);
                    }}
                />
                <label htmlFor="include-position">Omit position</label>
                <input
                    type="checkbox"
                    id="raw-json"
                    checked={rawJson}
                    onChange={(e) => {
                        setRawJson(e.target.checked);
                    }}
                />
                <label htmlFor="raw-json">Show raw JSON</label>
            </div>
            <div
                style={{ display: "flex", overflow: "hidden", height: "100%" }}
            >
                <div style={{ flexBasis: 0, flexGrow: 1, maxWidth: "50%" }}>
                    <CodeMirror
                        onBeforeChange={(val) => {
                            setDoenetSource(val);
                        }}
                        setInternalValueTo={INITIAL_DOENET_SOURCE}
                    />
                </div>
                <div
                    style={{
                        flexBasis: 0,
                        flexGrow: 1,
                        maxWidth: "50%",
                        overflow: "scroll",
                    }}
                >
                    {rawJson ? (
                        <pre>{JSON.stringify(dast, null, 2)}</pre>
                    ) : (
                        <JsonView
                            src={dast}
                            enableClipboard={false}
                            collapsed={(node) => {
                                if (node.indexOrName === "position") {
                                    return true;
                                }
                                return false;
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
