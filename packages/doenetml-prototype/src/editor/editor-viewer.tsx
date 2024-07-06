import React from "react";
import { CodeMirror } from "@doenet/codemirror";
import { ResizablePanelPair } from "./components/resizable-panel-pair";
import { DoenetML } from "../DoenetML";
import Button from "react-bootstrap/Button";

import "bootstrap/dist/css/bootstrap.min.css";
import "./editor-viewer.css";

// Injected by vite
declare const DOENETML_VERSION: string;

export type EditorViewerProps = {
    doenetML: string;
};

/**
 * A component that renders A source editor and rendered doenetml side-by-side.
 */
export function EditorViewer({ doenetML = "" }: EditorViewerProps) {
    const [sourceForRender, setSourceForRender] = React.useState(doenetML);
    const [sourceInEditor, setSourceInEditor] = React.useState(doenetML);

    const canRefresh = sourceInEditor !== sourceForRender;

    return (
        <div className="editor-viewer">
            <div className="editor-viewer-header">
                <Button
                    size="sm"
                    disabled={!canRefresh}
                    title={
                        canRefresh
                            ? "Refresh the rendered code"
                            : "The code has not changes since the last render"
                    }
                    onClick={() => {
                        setSourceForRender(sourceInEditor);
                    }}
                >
                    Refresh
                </Button>
                <div>Version: {DOENETML_VERSION}</div>
            </div>
            <div className="editor-viewer-panels">
                <ResizablePanelPair
                    panelA={
                        <CodeMirror
                            value={sourceInEditor}
                            onChange={(source) => {
                                if (source !== sourceInEditor) {
                                    setSourceInEditor(source);
                                }
                            }}
                        />
                    }
                    panelB={<DoenetML doenetML={sourceForRender} />}
                />
            </div>
        </div>
    );
}
