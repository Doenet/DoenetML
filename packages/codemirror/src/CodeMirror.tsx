import React from "react";
import { EditorSelection, EditorState, Extension } from "@codemirror/state";
import { selectedCompletion, type Completion } from "@codemirror/autocomplete";
import ReactCodeMirror, { EditorView } from "@uiw/react-codemirror";
import { syntaxHighlightingExtension } from "./extensions/syntax-highlighting";
import { tabExtension } from "./extensions/tab";
import { autoCloseTagExtension } from "./extensions/auto-close-tag";
import {
    lspPlugin,
    redrawDiagnostics,
    uniqueLanguageServerInstance,
    type DiagnosticPresentation,
} from "./extensions/lsp/plugin";
import {
    colorTheme,
    readOnlyColorTheme,
    completionIconTheme,
    type ThemeMode,
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
    editorViewRef,
    ariaLabel = "DoenetML code editor",
    doenetWorkerUrl,
    darkMode = "light",
    diagnosticPresentation,
    extraExtensions,
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
     * Optional ref populated with the underlying CodeMirror `EditorView` once
     * it mounts. Lets a controlling component drive the editor imperatively —
     * e.g. moving the cursor/selection and scrolling to a position in
     * response to something outside the editor (a click in a linked preview).
     */
    editorViewRef?: React.RefObject<EditorView | null>;
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
    /**
     * Resolved theme mode for the editor.  Defaults to `"light"`.  When set
     * to `"dark"` the CodeMirror color theme, syntax-highlight palette, and
     * autocomplete icon colors all switch to dark-mode-verified variants.
     */
    darkMode?: ThemeMode;
    /**
     * How the reader wants a diagnostic said: a message formatter and a
     * source of severity headings, both answering in their language.
     *
     * This package renders the squiggles and their tooltips but has no
     * catalogs to render them *from* — see {@link DiagnosticPresentation} for
     * why it deliberately doesn't. Omit it and the tooltip shows the English
     * the producer wrote, exactly as before.
     *
     * Replace it whenever its answers change — when the reader's language
     * does. A new one leaves the extension set alone, so the document stays
     * open on the language server; the diagnostics already on screen are
     * simply drawn again through the new answers.
     */
    diagnosticPresentation?: DiagnosticPresentation;
    /**
     * Extra CodeMirror extensions, appended after this component's own.
     * Being appended, they sit at *lower* default precedence than the
     * built-ins — wrap in `Prec.high(...)` (`@codemirror/state`) to
     * override a facet value or keybinding this component already sets.
     *
     * Must be referentially stable — a fresh array on every render defeats
     * this component's `React.memo` and reconfigures the editor each time.
     * Hoist it to a module constant or memoize it.
     */
    extraExtensions?: Extension[];
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

    // The editor view, kept here as well as mirrored into the caller's
    // `editorViewRef`, so the redraw below has something to aim at whether or
    // not the caller asked for one.
    const viewRef = React.useRef<EditorView | null>(null);

    // The presentation the host most recently supplied, read through a ref so
    // the extension set never sees it. A new extension set builds a new LSP
    // plugin, which closes the document on the language server and reopens it
    // — far too much to pay for the reader changing language. This
    // indirection is what lets that be a plain prop.
    const presentationRef = React.useRef(diagnosticPresentation);
    presentationRef.current = diagnosticPresentation;
    const stablePresentation = React.useMemo<DiagnosticPresentation>(
        () => ({
            formatMessage: (diagnostic) =>
                presentationRef.current?.formatMessage?.(diagnostic) ??
                diagnostic.message,
            severityHeading: (severity) =>
                presentationRef.current?.severityHeading?.(severity),
        }),
        [],
    );

    // Messages and headings are built when their batch of diagnostics
    // arrives, so a host that starts answering differently has to say so for
    // what is already drawn to follow.
    React.useEffect(() => {
        if (viewRef.current) {
            redrawDiagnostics(viewRef.current);
        }
    }, [diagnosticPresentation]);

    const extensions: Extension[] = React.useMemo(() => {
        const extensions: Extension[] = [
            syntaxHighlightingExtension(darkMode),
            readOnly ? readOnlyColorTheme(darkMode) : colorTheme(darkMode),
            EditorView.lineWrapping,
            // Add aria-label to the contenteditable element for accessibility
            EditorView.contentAttributes.of({ "aria-label": ariaLabel }),
        ];
        if (!readOnly) {
            extensions.push(tabExtension);
            extensions.push(autoCloseTagExtension);
            extensions.push(
                lspPlugin(documentId, doenetWorkerUrl, stablePresentation),
            );
            extensions.push(completionIconTheme(darkMode));
        } else {
            extensions.push(EditorState.readOnly.of(true));
        }
        if (extraExtensions) {
            extensions.push(...extraExtensions);
        }
        return extensions;
    }, [
        documentId,
        readOnly,
        ariaLabel,
        doenetWorkerUrl,
        darkMode,
        stablePresentation,
        extraExtensions,
    ]);

    return (
        <div
            className="mathjax_ignore"
            data-theme={darkMode}
            style={{ height: "100%" }}
        >
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
                onBlur={onBlur}
                onFocus={onFocus}
                onCreateEditor={(view) => {
                    viewRef.current = view;
                    if (editorViewRef) {
                        editorViewRef.current = view;
                    }
                }}
                height="100%"
                extensions={extensions}
            />
        </div>
    );
});

export { CodeMirror };
