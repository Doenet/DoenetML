import React from "react";
import { CodeMirror } from "@doenet/codemirror";
import { ResizablePanelPair } from "./components/resizable-panel-pair";
import { DoenetML } from "../DoenetML";
import { VscRefresh, VscWarning, VscCloudDownload } from "react-icons/vsc";

import "./editor-viewer.css";
import { prettyPrint } from "@doenet/parser/pretty-printer";
import { DownloadMarkdownDropdownItem } from "./components/download-markdown";
import { Provider } from "react-redux";
import { store } from "../state/store";
import { DownloadPretextDropdownItem } from "./components/download-pretext";
import { DownloadInspector } from "./components/download-inspector";
import { Alert } from "./components/ui/alert";
import { Button } from "./components/ui/button";
import { ButtonGroup } from "./components/ui/button-group";
import { Dropdown } from "./components/ui/dropdown";
import type { CoreType } from "../state/redux-slices/core/slice";

// Injected by vite
declare const DOENETML_VERSION: string;

export type EditorViewerProps = {
    doenetML: string;
    /**
     * Which core backs the rendered viewer panel. The editor-only features
     * (PreTeXt/Markdown export) operate on the FlatDast in the store and are not
     * intended to work with the JavaScript core.
     */
    coreType?: CoreType;
    /** Called whenever the source in the editor changes. */
    onChange?: (source: string) => void;
};

/**
 * A component that renders a source editor and rendered doenetml side-by-side.
 */
export function EditorViewer({
    doenetML = "",
    coreType = "rust",
    onChange,
}: EditorViewerProps) {
    const [sourceForRender, setSourceForRender] = React.useState(doenetML);
    const [sourceInEditor, setSourceInEditor] = React.useState(doenetML);
    const [formatMode, setFormatMode] = React.useState<"doenetml" | "xml">(
        "doenetml",
    );
    const [showDownloadInspector, setShowDownloadInspector] =
        React.useState(false);
    const [fileList, setFileList] = React.useState<Record<string, string>>({});
    const [errors, setErrors] = React.useState<string[]>([]);
    const [_errorsVisible, setErrorsVisible] = React.useState(false);
    const errorsVisible = !(errors.length === 0) && _errorsVisible;
    const addError = (error: string) => {
        setErrors((errors) => [...errors, error]);
        setErrorsVisible(true);
    };

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
                        variant="secondary"
                        className="icon-button"
                        disabled={!canRefresh}
                        title={
                            canRefresh
                                ? "Refresh the rendered code"
                                : "The code has not changed since the last render"
                        }
                        onClick={() => {
                            setErrors([]);
                            setSourceForRender(sourceInEditor);
                        }}
                    >
                        <VscRefresh /> Refresh
                    </Button>
                    <div>Version: {DOENETML_VERSION}</div>
                </div>
                {errorsVisible && (
                    <Alert
                        variant="danger"
                        onClose={() => {
                            setErrorsVisible(false);
                            setErrors([]);
                        }}
                        dismissible
                    >
                        <Alert.Heading>Errors</Alert.Heading>
                        {errors.map((error, i) => (
                            <p key={i}>{error}</p>
                        ))}
                    </Alert>
                )}
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
                                                onChange?.(source);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="editor-panel-footer">
                                    <Dropdown>
                                        <ButtonGroup>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={doPrettyPrint}
                                            >
                                                Pretty Print
                                            </Button>
                                            <Dropdown.Toggle size="sm" split />
                                        </ButtonGroup>
                                        <Dropdown.Menu>
                                            <Dropdown.Item
                                                active={
                                                    formatMode === "doenetml"
                                                }
                                                onClick={() =>
                                                    setFormatMode("doenetml")
                                                }
                                            >
                                                as DoenetML
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                active={formatMode === "xml"}
                                                onClick={() =>
                                                    setFormatMode("xml")
                                                }
                                            >
                                                as XML
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
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
                                                setError={addError}
                                            />
                                            <DownloadPretextDropdownItem
                                                setFiles={setFiles}
                                                setError={addError}
                                            />
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        }
                        panelB={
                            <DoenetML
                                doenetML={sourceForRender}
                                coreType={coreType}
                            />
                        }
                    />
                </div>
            </div>
        </Provider>
    );
}
