import React from "react";
import { CodeMirror } from "@doenet/codemirror";
import { ResizablePanelPair } from "./components/resizable-panel-pair";
import { DoenetML } from "../DoenetML";

export type EditorViewerProps = {
    doenetML: string;
};

/**
 * A component that renders A source editor and rendered doenetml side-by-side.
 */
export function EditorViewer({ doenetML = "" }: EditorViewerProps) {
    return (
        <ResizablePanelPair
            panelA={<CodeMirror value={doenetML} />}
            panelB={<DoenetML doenetML={doenetML} />}
        />
    );
}
