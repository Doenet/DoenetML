/*
 * This file is for running a dev test of the codemirror component.
 * It does not show up in the bundled package.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { CodeMirror } from "@doenet/codemirror";
import {
    lezerToDast,
    parse,
    filterPositionInfo,
    lezerToDastV6,
} from "@doenet/parser";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import { DoenetSourceObject } from "./doenet-source-object";
import { AutoCompleter } from "./auto-completer";

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

const simpleSchema = {
    elements: [
        {
            name: "a",
            children: ["b", "c", "d"],
            attributes: [{ name: "x" }, { name: "y" }, { name: "xyx" }],
            top: true,
            acceptsStringChildren: false,
        },
        {
            name: "b",
            children: ["www"],
            attributes: [{ name: "foo", values: ["true", "false"] }],
            top: false,
            acceptsStringChildren: false,
        },
        {
            name: "c",
            children: [],
            attributes: [],
            top: false,
            acceptsStringChildren: true,
        },
    ],
};

const sourceObj = new DoenetSourceObject(INITIAL_DOENET_SOURCE);
const completionObj = new AutoCompleter("", simpleSchema.elements);
completionObj.setDoenetSourceObject(sourceObj);
console.log(sourceObj, completionObj);
(window as any).sourceObj = sourceObj;
(window as any).completionObj = completionObj;

function App() {
    const [doenetSource, setDoenetSource] = React.useState(
        INITIAL_DOENET_SOURCE,
    );
    const [dast, setDast] = React.useState({});
    const [omitPosition, setOmitPosition] = React.useState(false);
    const [rawJson, setRawJson] = React.useState(false);
    const [currentPos, setCurrentPos] = React.useState(0);
    const [dastV6, setDastV6] = React.useState(true);

    React.useEffect(() => {
        let dast = dastV6
            ? lezerToDastV6(doenetSource)
            : lezerToDast(doenetSource);
        if (omitPosition) {
            dast = filterPositionInfo(dast as any) as any;
        }
        setDast(dast);
    }, [doenetSource, omitPosition, dastV6]);
    React.useEffect(() => {
        sourceObj.setSource(doenetSource);
        console.log(
            { currentPos },
            sourceObj.elementAtOffsetWithContext(currentPos),
            "elm2 left",
            sourceObj.nodeAtOffset(currentPos, { side: "left" })?.type || null,
            "elm2 right",
            sourceObj.nodeAtOffset(currentPos, { side: "right" })?.type || null,
            sourceObj.attributeAtOffset(currentPos),
            completionObj.getCompletionItems(currentPos),
        );
    }, [currentPos, doenetSource]);

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
                <input
                    type="checkbox"
                    id="dast-v6"
                    checked={dastV6}
                    onChange={(e) => {
                        setDastV6(e.target.checked);
                    }}
                />
                <label
                    htmlFor="dast-v6"
                    title="DAST v0.6 is the old version of DAST that accepts old-style macros."
                >
                    Use DAST v0.6
                </label>
            </div>
            <div
                style={{ display: "flex", overflow: "hidden", height: "100%" }}
            >
                <div style={{ flexBasis: 0, flexGrow: 1, maxWidth: "50%" }}>
                    <CodeMirror
                        onChange={(val) => {
                            setDoenetSource(val);
                        }}
                        value={INITIAL_DOENET_SOURCE}
                        onCursorChange={(selection) => {
                            const range = selection.ranges[0];
                            if (!range) {
                                return;
                            }
                            setCurrentPos(range.from);
                        }}
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
