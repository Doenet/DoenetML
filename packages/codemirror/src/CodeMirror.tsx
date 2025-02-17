import React from "react";
import { EditorSelection, Extension } from "@codemirror/state";
import ReactCodeMirror, { EditorView } from "@uiw/react-codemirror";
import { syntaxHighlightingExtension } from "./extensions/syntax-highlighting";
import { tabExtension } from "./extensions/tab";
import {
    lspPlugin,
    uniqueLanguageServerInstance,
} from "./extensions/lsp/plugin";
import { colorTheme, readOnlyColorTheme } from "./extensions/theme";

export function CodeMirror({
    value,
    onChange,
    onCursorChange,
    readOnly,
    onBlur,
    onFocus,
}: {
    value: string;
    onChange?: (str: string) => void;
    onCursorChange?: (selection: EditorSelection) => any;
    readOnly?: boolean;
    onBlur?: () => void;
    onFocus?: () => void;
}) {
    // Only one language server runs for all documents, so we specify a document id to keep different instances different.
    const [documentId, _] = React.useState(() =>
        Math.floor(Math.random() * 100000).toString(),
    );

    React.useEffect(() => {
        return () => {
            // We need to clean up the document on the language server. If the document
            // was read-only, the language server wasn't loaded so there is nothing to do.
            if (readOnly) {
                return;
            }
            const uri = `file:///${documentId}.doenet`;
            uniqueLanguageServerInstance.closeDocument(uri);
        };
    }, [documentId, readOnly]);

    const extensions: Extension[] = [
        syntaxHighlightingExtension,
        readOnly ? readOnlyColorTheme : colorTheme,
        EditorView.lineWrapping,
    ];
    if (!readOnly) {
        extensions.push(tabExtension);
        extensions.push(lspPlugin(documentId));
    }

    return (
        <ReactCodeMirror
            style={{ height: "100%" }}
            value={value}
            readOnly={readOnly}
            editable={!readOnly}
            basicSetup={{
                indentOnInput: true,
                highlightActiveLine: !readOnly,
                highlightActiveLineGutter: !readOnly,
            }}
            onChange={(editor, update) => {
                if (onChange) {
                    onChange(update.state.doc.toString());
                }
            }}
            onUpdate={(viewUpdate) => {
                for (const tr of viewUpdate.transactions) {
                    if (tr.selection && onCursorChange) {
                        onCursorChange(tr.selection);
                    }
                }
            }}
            onBlur={() => onBlur && onBlur()}
            onFocus={() => onFocus && onFocus()}
            height="100%"
            extensions={extensions}
        />
    );
}
