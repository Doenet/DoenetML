import React from "react";
import { EditorSelection, EditorState, Extension } from "@codemirror/state";
import ReactCodeMirror, { EditorView } from "@uiw/react-codemirror";
import { syntaxHighlightingExtension } from "./extensions/syntax-highlighting";
import { tabExtension } from "./extensions/tab";
import {
    lspPlugin,
    uniqueLanguageServerInstance,
} from "./extensions/lsp/plugin";
import { colorTheme, readOnlyColorTheme } from "./extensions/theme";

/**
 * A CodeMirror instance set up with a language server to provide completions/etc. for DoenetML.
 */
const CodeMirror = React.memo(function CodeMirror({
    value,
    onChange,
    onCursorChange,
    readOnly,
    onBlur,
    onFocus,
    languageServerRef,
    ariaLabel = "DoenetML code editor",
}: {
    value: string;
    onChange?: (str: string) => void;
    onCursorChange?: (selection: EditorSelection) => any;
    readOnly?: boolean;
    onBlur?: () => void;
    onFocus?: () => void;
    /**
     * Optional ref to store the a reference to the language server. This allows
     * controlling components to send messages to the language server.
     */
    languageServerRef?: React.RefObject<{
        lsp: typeof uniqueLanguageServerInstance;
        documentUri: string;
    } | null>;
    /**
     * Accessible label for the editor. Defaults to "DoenetML code editor".
     */
    ariaLabel?: string;
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

    React.useEffect(() => {
        if (!languageServerRef) {
            return;
        }
        languageServerRef.current = {
            lsp: uniqueLanguageServerInstance,
            documentUri: `file:///${documentId}.doenet`,
        };
    }, [languageServerRef]);

    const extensions: Extension[] = React.useMemo(() => {
        const extensions: Extension[] = [
            syntaxHighlightingExtension,
            readOnly ? readOnlyColorTheme : colorTheme,
            EditorView.lineWrapping,
            // Add aria-label to the contenteditable element for accessibility
            EditorView.contentAttributes.of({ "aria-label": ariaLabel }),
        ];
        if (!readOnly) {
            extensions.push(tabExtension);
            extensions.push(lspPlugin(documentId));
        } else {
            extensions.push(EditorState.readOnly.of(true));
        }
        return extensions;
    }, [documentId, readOnly, ariaLabel]);

    return (
        <div className="mathjax_ignore" style={{ height: "100%" }}>
            <ReactCodeMirror
                style={{ height: "100%" }}
                value={value}
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
        </div>
    );
});

export { CodeMirror };
