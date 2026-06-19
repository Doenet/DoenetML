import React from "react";
import { EditorSelection, EditorState, Extension } from "@codemirror/state";
import { selectedCompletion, type Completion } from "@codemirror/autocomplete";
import ReactCodeMirror, { EditorView } from "@uiw/react-codemirror";
import { syntaxHighlightingExtension } from "./extensions/syntax-highlighting";
import { tabExtension } from "./extensions/tab";
import { autoCloseTagExtension } from "./extensions/auto-close-tag";
import {
    lspPlugin,
    uniqueLanguageServerInstance,
} from "./extensions/lsp/plugin";
import {
    colorTheme,
    readOnlyColorTheme,
    completionIconTheme,
} from "./extensions/theme";

/**
 * A CodeMirror instance set up with a language server to provide completions/etc. for DoenetML.
 */
const CodeMirror = React.memo(function CodeMirror({
    value,
    onChange,
    onCursorChange,
    onSelectedCompletionChange,
    readOnly,
    onBlur,
    onFocus,
    languageServerRef,
    ariaLabel = "DoenetML code editor",
    doenetWorkerUrl,
}: {
    value: string;
    onChange?: (str: string) => void;
    onCursorChange?: (selection: EditorSelection) => any;
    /**
     * Fires when the currently-highlighted autocomplete option changes,
     * including transitions to/from `null` (popup opens/closes). Used to
     * drive the context-sensitive help panel.
     */
    onSelectedCompletionChange?: (completion: Completion | null) => void;
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
    /**
     * Optional URL of the inlined core webworker JS bundle.  When provided,
     * the LSP spawns this worker behind the scenes to power name/member
     * resolution.  When omitted, ref/member completions are silently disabled
     * but the rest of the editor works normally.
     *
     * The LSP is a process-wide singleton; the first `<CodeMirror>` instance
     * to mount locks in the URL.  Later instances passing a different URL
     * will see a console warning and have their value ignored.  In practice
     * every editor on a page reads from the same `doenetGlobalConfig`, so
     * this is rarely an issue.
     */
    doenetWorkerUrl?: string;
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
            extensions.push(autoCloseTagExtension);
            extensions.push(lspPlugin(documentId, doenetWorkerUrl));
            extensions.push(completionIconTheme);
        } else {
            extensions.push(EditorState.readOnly.of(true));
        }
        return extensions;
    }, [documentId, readOnly, ariaLabel, doenetWorkerUrl]);

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
                    if (onSelectedCompletionChange) {
                        const prev = selectedCompletion(viewUpdate.startState);
                        const next = selectedCompletion(viewUpdate.state);
                        // Identity compare: CodeMirror returns the same
                        // Completion instance across renders of the same
                        // active option. When the filter rebuilds (typing),
                        // a new object may surface — the downstream handler
                        // is idempotent, so re-firing is cheap.
                        if (prev !== next) {
                            onSelectedCompletionChange(next);
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
