import React from "react";
import { CodeMirror } from "@doenet/codemirror";
import { ResizablePanelPair } from "./components/resizable-panel-pair";
import { DoenetML } from "../DoenetML";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import { VscRefresh, VscWarning, VscCloudDownload } from "react-icons/vsc";

import "bootstrap/dist/css/bootstrap.min.css";
import "./editor-viewer.css";
import { prettyPrint } from "@doenet/parser";
import { DownloadMarkdownDropdownItem } from "./components/download-markdown";
import { Provider } from "react-redux";
import { store } from "../state/store";
import { DownloadPretextDropdownItem } from "./components/download-pretext";
import { DownloadInspector } from "./components/download-inspector";

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
    const [formatMode, setFormatMode] = React.useState<"doenetml" | "xml">(
        "doenetml",
    );
    const [showDownloadInspector, setShowDownloadInspector] =
        React.useState(false);
    const [fileList, setFileList] = React.useState<Record<string, string>>({});

    const setFiles = (files: Record<string, string>) => {
        setFileList(files);
        setShowDownloadInspector(true);
    };

    const canRefresh = sourceInEditor !== sourceForRender;
    const doPrettyPrint = React.useCallback(() => {
        prettyPrint(sourceInEditor, {
            doenetSyntax: formatMode === "doenetml",
            tabWidth: 2,
        }).then((prettySource) => {
            setSourceInEditor(prettySource);
        });
    }, [formatMode, sourceInEditor]);

    return (
        <Provider store={store}>
            <DownloadInspector
                fileList={fileList}
                show={showDownloadInspector}
                setShow={setShowDownloadInspector}
            />
            <div className="editor-viewer">
                <div className="editor-viewer-header">
                    <Button
                        size="sm"
                        className="icon-button"
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
                        <VscRefresh /> Refresh
                    </Button>
                    <div>Version: {DOENETML_VERSION}</div>
                </div>
                <div className="editor-viewer-panels">
                    <ResizablePanelPair
                        panelA={
                            <div className="editor-panel">
                                <div className="editor-panel-codemirror">
                                    <CodeMirror
                                        value={sourceInEditor}
                                        onChange={(source) => {
                                            if (source !== sourceInEditor) {
                                                setSourceInEditor(source);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="editor-panel-footer">
                                    <Dropdown as={ButtonGroup} size="sm">
                                        <Button onClick={doPrettyPrint}>
                                            {" "}
                                            Pretty Print
                                        </Button>
                                        <Dropdown.Toggle split>
                                            <Dropdown.Menu>
                                                <Dropdown.Item
                                                    active={
                                                        formatMode ===
                                                        "doenetml"
                                                    }
                                                    onClick={() =>
                                                        setFormatMode(
                                                            "doenetml",
                                                        )
                                                    }
                                                >
                                                    as DoenetML
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                    active={
                                                        formatMode === "xml"
                                                    }
                                                    onClick={() =>
                                                        setFormatMode("xml")
                                                    }
                                                >
                                                    as XML
                                                </Dropdown.Item>{" "}
                                            </Dropdown.Menu>
                                        </Dropdown.Toggle>
                                    </Dropdown>
                                    <Dropdown>
                                        <Dropdown.Toggle
                                            size="sm"
                                            className="icon-button"
                                            title={
                                                canRefresh
                                                    ? 'Warning: The exported code and the code in the editor are out of sync. Press "Refresh" before you download to synchronize them.'
                                                    : "Export in various formats"
                                            }
                                        >
                                            {canRefresh ? (
                                                <VscWarning />
                                            ) : (
                                                <VscCloudDownload />
                                            )}{" "}
                                            Export
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <DownloadMarkdownDropdownItem
                                                setFiles={setFiles}
                                            />
                                            <DownloadPretextDropdownItem
                                                setFiles={setFiles}
                                            />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        }
                        panelB={<DoenetML doenetML={sourceForRender} />}
                    />
                </div>
            </div>
        </Provider>
    );
}
