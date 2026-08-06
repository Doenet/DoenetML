// Code based off of https://github.com/FurqanSoftware/codemirror-languageserver
// BSD 3-Clause License
// Copyright (c) 2021, Mahmud Ridwan
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// * Redistributions of source code must retain the above copyright notice, this
//   list of conditions and the following disclaimer.
//
// * Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.
//
// * Neither the name of the library nor the names of its
//   contributors may be used to endorse or promote products derived from
//   this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
// FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
// OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

import {
    EditorView,
    PluginValue,
    ViewPlugin,
    ViewUpdate,
    hoverTooltip,
} from "@codemirror/view";
import { LSP } from "./worker";
import {
    Diagnostic as LSPDiagnostic,
    DiagnosticSeverity as LSPDiagnosticSeverity,
    CompletionTriggerKind as LSPCompletionTriggerKind,
} from "vscode-languageserver-protocol/browser";
import { Text, Transaction } from "@codemirror/state";
import {
    linter,
    setDiagnostics,
    Diagnostic as CodeMirrorDiagnostic,
} from "@codemirror/lint";
import {
    autocompletion,
    CompletionContext,
    Completion,
    CompletionResult,
    completionStatus,
    closeCompletion,
    startCompletion,
} from "@codemirror/autocomplete";
import {
    getLivePreviewQuoteWrap,
    getSnippetCursorFromCompletionItemData,
    type CompletionSnippetCursor,
} from "@doenet/static-assets/completion-snippet-protocol";
import {
    createReopenLatchFromCloseTransition,
    evaluateReopenLatchTransition,
    type ReopenLatch,
    type WordToken,
} from "./reopen-latch";
import { renderDiagnosticMarkdownHtml } from "@doenet/utils/diagnostics/renderDiagnosticMarkdownHtml";
import { parseInlineMarkdown } from "@doenet/utils/markdown/parseInlineMarkdown";
import type {
    CompletionItem as LSPCompletionItem,
    MarkupContent,
    MarkedString,
} from "vscode-languageserver-protocol";
import { deriveCompletionType, COMPLETION_TYPES } from "@doenet/lsp-tools";

// LSP's `CompletionItem` doesn't declare `displayLabel`, but
// @codemirror/autocomplete supports it as a "show this, filter on label"
// override. Our in-process LSP transport preserves unknown fields, so
// `get-completion-items.ts` attaches it as an optional extension and we
// destructure it here through a single seam-level cast rather than per item.
type LSPCompletionItemWithDisplayLabel = LSPCompletionItem & {
    displayLabel?: string;
};
import "./tooltip.css";

// Keep identifier policy aligned with macro parsing/completion rules.
const MACRO_IDENTIFIER_CHAR_REGEX = /[A-Za-z0-9_-]/;
const MACRO_IDENTIFIER_SEGMENT_REGEX = /[A-Za-z0-9_-]+$/;
// Matches a non-empty run of bare-value characters only (no whitespace, no
// `"`, no `>`). Used by the live-preview wrap-in-quotes hint to decide
// whether the user is still inside an unquoted attribute value.
const MACRO_IDENTIFIER_BARE_VALUE_REGEX = /^[A-Za-z0-9_-]+$/;
// What a reference path is made of once past its `$`: identifier characters,
// the `.` joining segments, and `[…]` index brackets.
const MACRO_PATH_CHAR_REGEX = /[A-Za-z0-9_.[\]-]/;

/**
 * Whether `text` ends inside an unfinished reference path — the state in which
 * the next character either continues the path or ends the reference.
 *
 * The two rootings are the two macro forms the grammar has (see
 * `packages/parser/src/macros/macros.peggy`): a bare `$name`, whose path runs
 * to the first character that can't be part of it, and a parenthesized
 * `$(name`, whose path runs to the closing `)`. So `$P`, `$P.coords` and
 * `$(P.` are unfinished paths, while `$(P)` is a finished macro and `the end`
 * is prose.
 */
function endsWithReferencePath(text: string): boolean {
    // Walk back over the path characters; the character in front of that run
    // says what, if anything, the path is rooted in.
    let pathStart = text.length;
    while (pathStart > 0 && MACRO_PATH_CHAR_REGEX.test(text[pathStart - 1])) {
        pathStart--;
    }
    if (pathStart === text.length) {
        // Nothing in front — there is no path here to continue.
        return false;
    }
    const beforePath = text[pathStart - 1];
    return (
        // `$name`, `$name.prop`, `$name[1]`
        beforePath === "$" ||
        // `$(name`, `$(name.prop` — still inside the parenthesized form
        (beforePath === "(" && text[pathStart - 2] === "$")
    );
}

/**
 * Whether the text up to `column` in `lineText` ends in a reference property
 * accessor — the `.` of `$name.`, as opposed to a period ending a sentence.
 *
 * A path already ending in `.` takes no second one: no reference has an empty
 * segment, so the `.` of `$P..` opens no member list.
 */
function endsWithReferencePropertyDot(lineText: string, column: number) {
    const beforeDot = lineText.slice(0, column - 1);
    return (
        lineText[column - 1] === "." &&
        !beforeDot.endsWith(".") &&
        endsWithReferencePath(beforeDot)
    );
}

/**
 * Whether the character just typed at `column` moved the cursor out of the
 * name the open suggestion list is a list of names for.
 *
 * Most such characters end the reference outright — `$P.(`, `$P."`, `$P. ` —
 * as does the second `.` of `$P..`, which no segment can follow. A `[` and its
 * `]` do not: they open and close an index, which is part of the path. But an
 * index holds no name to complete — only a macro of its own, whose `$` opens a
 * fresh list — and closing one lands the cursor on a position where nothing
 * but a `.` can follow. So the list has to come down for those too.
 *
 * `(` right after the `$` opens the parenthesized form rather than ending
 * anything, and is excluded by the `endsWithReferencePath` check below.
 */
function typedCharacterEndsReferenceName(lineText: string, column: number) {
    const typedChar = lineText[column - 1];
    if (typedChar === undefined) {
        return false;
    }
    const beforeChar = lineText.slice(0, column - 1);
    if (!endsWithReferencePath(beforeChar)) {
        return false;
    }
    return (
        !MACRO_PATH_CHAR_REGEX.test(typedChar) ||
        typedChar === "[" ||
        typedChar === "]" ||
        (typedChar === "." && beforeChar.endsWith("."))
    );
}

/** Escape a string for safe interpolation into an HTML context. */
function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/**
 * How the host wants a diagnostic said, for the tooltip this plugin draws.
 *
 * Everything the reader sees in that tooltip arrives already in their
 * language, or not at all: this package renders it and does not translate it.
 * That is deliberate. `@doenet/codemirror` embeds the built language server as
 * a string and starts it as a blob worker, and pulling a message catalog and
 * the Fluent runtime in here to answer a question the viewer has already
 * answered would put both on the editor's critical path — the growth
 * `packages/lsp/scripts/check-server-bundle.mjs` exists to catch. So the seam
 * is two questions the host answers, and `@doenet/doenetml` answers them from
 * the same translator its Diagnostics panel renders with.
 *
 * Both are optional, and omitting them leaves the tooltip exactly as it was:
 * the English the producer wrote, under an English severity heading.
 *
 * A host whose reader's language changes hands over a new one. `CodeMirror`
 * keeps this out of the extension set and reads it through a ref, so a
 * replacement leaves the language server's copy of the document open and
 * redraws the diagnostics already on screen through the new answers
 * ({@link redrawDiagnostics}).
 */
export type DiagnosticPresentation = {
    /**
     * Render a diagnostic's message.
     *
     * A diagnostic that has migrated to the catalogs carries a stable `code`
     * and the arguments filling its message in; `message` is the producer's
     * English, which is the fallback and what an unmigrated diagnostic has
     * instead. Returning `message` unchanged is always valid.
     */
    formatMessage?: (diagnostic: {
        message: string;
        code?: string | number;
        args?: unknown;
    }) => string;
    /**
     * The tooltip heading for a diagnostic that names no `source` of its own,
     * or `undefined` to keep the English one.
     *
     * Asked by LSP severity rather than by the CodeMirror severity the tooltip
     * is styled with, because those are not the same set — `Hint` and
     * `Information` both style as `info` and are two different words.
     */
    severityHeading?: (severity: SeverityHeadingKey) => string | undefined;
};

/** The heading a diagnostic is filed under when it names no `source`. */
export type SeverityHeadingKey = "error" | "warning" | "information" | "hint";

/** The {@link SeverityHeadingKey} an LSP severity is asked for under. */
const lspSeverityToHeadingKey = {
    [LSPDiagnosticSeverity.Error]: "error",
    [LSPDiagnosticSeverity.Warning]: "warning",
    [LSPDiagnosticSeverity.Information]: "information",
    [LSPDiagnosticSeverity.Hint]: "hint",
} as const satisfies Record<LSPDiagnosticSeverity, SeverityHeadingKey>;

/** Shown when the host offers no translation of a heading. */
const EN_SEVERITY_HEADINGS: Record<SeverityHeadingKey, string> = {
    error: "Error",
    warning: "Warning",
    information: "Info",
    hint: "Hint",
};

const lspSeverityToCmSeverity = {
    [LSPDiagnosticSeverity.Error]: "error",
    [LSPDiagnosticSeverity.Warning]: "warning",
    [LSPDiagnosticSeverity.Information]: "info",
    [LSPDiagnosticSeverity.Hint]: "info",
} as const;

/**
 * Which style the tooltip heading takes: an accessibility level, or the
 * diagnostic's severity.
 *
 * `code` and `markClass` are what actually classify a diagnostic, and
 * `toAdditionalDiagnosticsForLsp` in `@doenet/doenetml` sets both at the call
 * site that sets `source`. Matching the English `source` as well is what
 * classifies a diagnostic from a host that sets only that; a translated
 * heading no longer matches there and does not need to.
 */
function getDiagnosticHeadingClass({
    code,
    source,
    markClass,
    cmSeverity,
}: {
    code: LSPDiagnostic["code"];
    source: string | undefined;
    markClass: string | undefined;
    cmSeverity: (typeof lspSeverityToCmSeverity)[keyof typeof lspSeverityToCmSeverity];
}) {
    if (
        code === "accessibility-level-1" ||
        markClass?.includes("cm-doenet-accessibility-diagnostic-level-1") ||
        source === "WCAG AA Accessibility Violation"
    ) {
        return "accessibility-level-1";
    }

    if (
        code === "accessibility-level-2" ||
        markClass?.includes("cm-doenet-accessibility-diagnostic-level-2") ||
        source === "Accessibility alert"
    ) {
        return "accessibility-level-2";
    }

    return cmSeverity;
}

type PositionLike =
    { line: number; character: number } | { line: number; column: number };

type RangeLike = {
    start: PositionLike;
    end: PositionLike;
};

type ExtendedCompletion = Completion & {
    sortText?: string;
    _lspTextEditRange?: {
        start: { line: number; character: number };
        end: { line: number; character: number };
    };
    _snippetCursor?: CompletionSnippetCursor;
};

// One language server is shared across all plugin instances
export const uniqueLanguageServerInstance = new LSP();

/**
 * The plugin drawing diagnostics in a given editor, so
 * {@link redrawDiagnostics} can reach it. An editor with no language server
 * (a read-only one) has no entry, and an entry drops with its view.
 */
const lspPluginsByView = new WeakMap<EditorView, LSPPlugin>();

/**
 * Render the diagnostics already on screen again, through whatever the
 * editor's {@link DiagnosticPresentation} now answers.
 *
 * Nothing is re-fetched: the last batch the language server published is
 * still held, and only the words are built from it again. This is what makes
 * a language change reach messages and headings that were drawn in the
 * previous one — they were rendered when their batch arrived, so without it
 * they would keep reading in that language until the next edit.
 */
export function redrawDiagnostics(view: EditorView) {
    lspPluginsByView.get(view)?.redrawDiagnostics();
}

export class LSPPlugin implements PluginValue {
    documentId: string;
    uri: string = "";
    value: string = "";
    diagnostics: LSPDiagnostic[] = [];
    docVersion = 0;
    reopenLatch: ReopenLatch | null = null;
    view?: EditorView;
    unsubscribeDiagnostics?: () => void;
    presentation: DiagnosticPresentation;

    constructor(documentId: string, presentation: DiagnosticPresentation = {}) {
        this.documentId = documentId;
        this.uri = `file:///${documentId}.doenet`;
        this.presentation = presentation;
    }

    update(update: ViewUpdate): void {
        const prevCompletionStatus = completionStatus(update.startState);
        const nextCompletionStatus = completionStatus(update.state);

        if (
            shouldInvalidateLatchDueToCursorNavigation(
                update,
                prevCompletionStatus,
            )
        ) {
            this.reopenLatch = null;
        }

        const value = update.state.doc.toString();
        if (update.docChanged) {
            this.setValue(value);

            const reopenState = getAutocompleteReopenState({
                update,
                reopenLatch: this.reopenLatch,
                docVersion: this.docVersion,
                prevCompletionStatus,
                nextCompletionStatus,
            });

            this.reopenLatch = reopenState.reopenLatch;

            if (
                reopenState.shouldRestartCompletion ||
                reopenState.shouldCloseCompletion
            ) {
                const close = reopenState.shouldCloseCompletion;
                setTimeout(() => {
                    if (!this.view || this.view !== update.view) {
                        return;
                    }
                    if (close) {
                        closeCompletion(update.view);
                    } else {
                        startCompletion(update.view);
                    }
                }, 0);
            }

            // Latch is single-use and must be immediate.
            if (!reopenState.keepReopenLatchForNextChange) {
                // Any non-related interaction invalidates the reopen opportunity.
                this.reopenLatch = null;
            }
            this.docVersion += 1;
        }
    }

    async setValue(value: string) {
        if (value === this.value) {
            return;
        }
        await uniqueLanguageServerInstance.updateDocument(this.uri, value);
        this.value = value;
    }

    destroy() {
        // Only if this plugin is still the one registered, so that a
        // replacement which has already claimed the view keeps its
        // registration.
        if (this.view && lspPluginsByView.get(this.view) === this) {
            lspPluginsByView.delete(this.view);
        }
        this.unsubscribeDiagnostics?.();
        uniqueLanguageServerInstance.closeDocument(this.uri).catch(() => {});
    }

    /**
     * Say the last published batch again. A no-op before one has arrived,
     * so a host that hands over its presentation at mount doesn't clear the
     * (empty) diagnostic set for nothing.
     */
    redrawDiagnostics() {
        if (this.diagnostics.length === 0) {
            return;
        }
        this.processDiagnostics();
    }

    processDiagnostics() {
        if (!this.view) {
            return;
        }
        const diagnostics: CodeMirrorDiagnostic[] = [];
        for (const diagnostic of this.diagnostics as Array<
            LSPDiagnostic & { markClass?: string }
        >) {
            const { range, message, severity, source, markClass, code, data } =
                diagnostic;
            const cmSeverity = lspSeverityToCmSeverity[severity!] ?? "info";
            const offsets = getValidDiagnosticOffsets(
                this.view.state.doc,
                range as RangeLike,
            );
            if (!offsets) {
                continue;
            }
            const { from, to } = offsets;

            // Rendered once here rather than inside `renderMessage`, because
            // the same text is also the `message` CodeMirror puts in the lint
            // panel and reads out to a screen reader. The tooltip and the
            // panel showing one diagnostic in two languages would be the same
            // bug in a smaller place.
            const shownMessage =
                this.presentation.formatMessage?.({
                    message,
                    code,
                    args: (data as { args?: unknown } | undefined)?.args,
                }) ?? message;

            diagnostics.push({
                from,
                to,
                severity: cmSeverity,
                message: shownMessage,
                ...(markClass ? { markClass } : {}),
                renderMessage: () => {
                    const div = document.createElement("div");
                    // A `source` is the producer's own label for the kind of
                    // diagnostic — the accessibility levels use it — and wins
                    // over the severity word, as it always has. It arrives
                    // already translated, because the host that set it is the
                    // one that knows the reader's language.
                    const headingKey =
                        lspSeverityToHeadingKey[severity!] ?? "information";
                    const heading =
                        source ??
                        this.presentation.severityHeading?.(headingKey) ??
                        EN_SEVERITY_HEADINGS[headingKey];
                    const headingClass = getDiagnosticHeadingClass({
                        code,
                        source,
                        markClass,
                        cmSeverity,
                    });
                    // We use renderToString so that we don't have to clean up any
                    // react listeners, etc. when the dom element is deleted by codemirror.
                    div.innerHTML = `<div class="cm-lint-tooltip"><h4 class="${
                        "heading " + headingClass
                    }">${escapeHtml(
                        heading,
                    )}</h4><div class="cm-lint-body">${renderDiagnosticMarkdownHtml(shownMessage)}</div>
                            </div>`;
                    return div.firstChild as HTMLElement;
                },
            });
        }

        diagnostics.sort((a, b) => {
            if (a.from < b.from) {
                return -1;
            } else if (a.from > b.from) {
                return 1;
            } else {
                return 0;
            }
        });

        const diagnosticTransaction = setDiagnostics(
            this.view.state,
            diagnostics,
        );
        this.view.dispatch(diagnosticTransaction);
    }
    async getCompletions(context: CompletionContext) {
        let { state, pos, explicit } = context;
        const line = state.doc.lineAt(pos);
        let triggerKind: LSPCompletionTriggerKind =
            LSPCompletionTriggerKind.Invoked;
        let triggerCharacter: string | undefined;
        const charBeforeCursor = line.text[pos - line.from - 1];
        const charBeforeParen =
            charBeforeCursor === "(" ? line.text[pos - line.from - 2] : "";
        // A `"` or `'` is a server trigger because typing the *opening*
        // quote of a value should open a value popup (e.g. `<math name="`).
        // The *closing* quote of a value (e.g. `<math name="hello"`) is the
        // same character but shouldn't pop attribute completions — that
        // would be inconsistent with `<math `, which waits for a letter
        // before suggesting. In a well-formed open tag, quotes of the same
        // kind pair up after each `=`, so the parity of prior occurrences
        // of the typed quote (between the last `<` and the typed quote)
        // tells us whether we just typed an opener or a closer:
        //   - even (0, 2, …) → opener → fire the trigger
        //   - odd  (1, 3, …) → closer → suppress
        // Counting (rather than scanning to a single matching quote) is
        // what makes `<math name="hello" simplify="` correctly treat the
        // second `"` as the opener of `simplify`'s value: two prior `"`
        // chars from `name="hello"` make the count even. Stopping at `=`
        // would seem simpler but breaks `<math foo="x=y"`, where the
        // closing `"` of `foo` has a literal `=` inside its value.
        let isClosingQuoteTrigger = false;
        if (charBeforeCursor === '"' || charBeforeCursor === "'") {
            const quote = charBeforeCursor;
            const cursorCol = pos - line.from;
            let quoteCount = 0;
            for (let k = cursorCol - 2; k >= 0; k--) {
                const c = line.text[k];
                if (c === "<") break;
                if (c === quote) quoteCount++;
            }
            isClosingQuoteTrigger = quoteCount % 2 === 1;
        }
        // A `.` is only a trigger when it continues a reference path
        // (`$name.`, `$name.prop.`); a `.` in prose ends a sentence and must
        // not open the popup.
        const isReferencePropertyDot = endsWithReferencePropertyDot(
            line.text,
            pos - line.from,
        );
        const isProseDot = charBeforeCursor === "." && !isReferencePropertyDot;
        const precedingServerTriggerCharacter =
            !isClosingQuoteTrigger &&
            !isProseDot &&
            uniqueLanguageServerInstance.completionTriggers.includes(
                charBeforeCursor,
            );
        const precedingLocalRefTriggerCharacter =
            charBeforeCursor === "$" ||
            (charBeforeCursor === "(" && charBeforeParen === "$") ||
            isReferencePropertyDot;

        // `<math simplify= ` and similar: when the cursor sits on whitespace
        // that immediately follows `=`, we still want the LSP to suggest
        // completions. Without this, the popup that opened on `=` flickers
        // closed the moment the user types a space and only reopens on the
        // next non-whitespace keystroke. Scoped to `=` only — other server
        // triggers (`<`, `/`, `"`, `'`, `$`, `.`) shouldn't reopen the popup
        // across whitespace: e.g. `<math name="hello" ` should not keep the
        // popup that briefly opened on the closing `"`, matching the
        // behaviour of `<math ` (where space after the tag name does not
        // pop completions until a letter is typed).
        let postWhitespaceTrigger = false;
        if (charBeforeCursor && /\s/.test(charBeforeCursor)) {
            const cursorCol = pos - line.from;
            let i = cursorCol - 1;
            while (i >= 0 && /\s/.test(line.text[i])) i--;
            if (i >= 0 && line.text[i] === "=") {
                postWhitespaceTrigger = true;
            }
        }

        if (!explicit && precedingServerTriggerCharacter) {
            triggerKind = LSPCompletionTriggerKind.TriggerCharacter;
            triggerCharacter = charBeforeCursor;
        }
        if (
            triggerKind === LSPCompletionTriggerKind.Invoked &&
            !context.matchBefore(MACRO_IDENTIFIER_SEGMENT_REGEX) &&
            !precedingServerTriggerCharacter &&
            !precedingLocalRefTriggerCharacter &&
            !postWhitespaceTrigger &&
            !explicit
        ) {
            return null;
        }
        const position = offsetToPos(state.doc, pos);
        const result = await uniqueLanguageServerInstance.getCompletionItems(
            this.uri,
            { line: position.line, character: position.character },
            {
                triggerKind,
                triggerCharacter,
                // Forward the explicit (Ctrl+Space) signal so the server can
                // open the element menu even with no preceding `<` (e.g.
                // between tags). `triggerKind` alone can't carry this: typing
                // an identifier also reports `Invoked`.
                explicit,
            },
        );

        // Don't bail by returning `null` if the user typed more characters
        // while we were awaiting — @codemirror/autocomplete reads `null`
        // as "this source has no completions" and closes the active list,
        // producing a flicker mid-type. The autocomplete subsystem already
        // tracks query staleness via `RunningQuery.context.aborted` and
        // replays subsequent transactions through `ActiveResult.updateFor`
        // to map result positions forward, so returning the (slightly
        // older) result is safe and keeps the menu stable.
        if (!this.view) {
            return null;
        }

        if (!result) {
            return null;
        }

        const items = (
            "items" in result ? result.items : result
        ) as LSPCompletionItemWithDisplayLabel[];

        // An item's `filterText` is deliberately dropped: CodeMirror matches an
        // option by its `label` (and renders `displayLabel`), so a filter text
        // is only meaningful to clients that read it, and one may be spelled
        // for a wider edit range than the label covers.
        let options = items.map((rawItem) => {
            const {
                detail,
                label,
                kind,
                textEdit,
                documentation,
                sortText,
                data,
                displayLabel,
            } = rawItem;
            const completion: ExtendedCompletion = {
                label,
                detail,
                apply: textEdit?.newText ?? label,
                type: deriveCompletionType(rawItem),
                sortText: sortText ?? label,
            };
            if (displayLabel) {
                completion.displayLabel = displayLabel;
            }
            if (documentation) {
                completion.info = renderDocumentation(documentation);
            }
            // Store range info if present for custom apply logic later
            if (textEdit && "range" in textEdit) {
                completion._lspTextEditRange = textEdit.range;
            }
            const snippetCursor = getSnippetCursorFromCompletionItemData(data);
            if (snippetCursor) {
                completion._snippetCursor = snippetCursor;
            }
            return completion;
        });

        // Element/tag-name completions match the typed text as a *substring*
        // (e.g. `<num` offers `isNumber`), while every other completion type
        // keeps prefix matching. Prefix-first ordering is left to CodeMirror's
        // matcher/default `sortText` comparison; the client-side pass only
        // applies the stricter element-vs-other filtering policy.
        const isElementNameMenu =
            options.length > 0 &&
            options.every(
                (option) =>
                    option.type === COMPLETION_TYPES.component ||
                    option.type === COMPLETION_TYPES.snippet ||
                    option.type === COMPLETION_TYPES.closeTag,
            );

        const token = context.matchBefore(
            prefixMatch(
                options.map((option) => option.label),
                // An element menu is anchored on the tag being typed, so its
                // token has to reach across the `<` (and the `/` and `>` of
                // neighbouring tags) that the block below trims back off. No
                // label carries them.
                isElementNameMenu ? "</>" : "",
            ),
        );

        function filterOptionsForWord(wordLower: string) {
            options = options.filter(({ label }) => {
                const labelLower = label.toLowerCase();
                return isElementNameMenu
                    ? labelLower.includes(wordLower)
                    : labelLower.startsWith(wordLower);
            });
        }

        if (token) {
            let word = token.text;
            let fromOffset = 0;
            // Find where the completion word starts within the matched token
            // (the run of text immediately before the cursor). When the token's
            // last `<` comes after its last `>`, the cursor is inside an
            // unterminated tag whose name is being typed, so start just after
            // that `<`: e.g. `<nu|`, or `</doc><|` right after a freshly typed
            // `<`. Otherwise the cursor sits just past a complete tag's `>`
            // (e.g. `<math>|`), so start after that `>`.
            const lastLt = word.lastIndexOf("<");
            const lastGt = word.lastIndexOf(">");
            if (lastLt > lastGt) {
                fromOffset = lastLt + 1;
            } else if (lastGt >= 0) {
                fromOffset = lastGt + 1;
            }
            word = word.slice(fromOffset);
            pos = token.from + fromOffset;
            const wordLower = word.toLowerCase();
            if (wordLower && MACRO_IDENTIFIER_SEGMENT_REGEX.test(wordLower)) {
                filterOptionsForWord(wordLower);
            }
        } else if (isElementNameMenu) {
            const bareElementToken = context.matchBefore(
                MACRO_IDENTIFIER_SEGMENT_REGEX,
            );
            if (bareElementToken) {
                // Explicit Ctrl+Space can open an element menu before any `<`
                // has been typed. `prefixMatch` anchors on the characters the
                // labels are made of, so it finds no token when none of them
                // starts with the first letter of a bare word like `num`.
                // Anchor and filter it here so accepting `<number>` replaces
                // `num` instead of appending after it.
                pos = bareElementToken.from;
                filterOptionsForWord(bareElementToken.text.toLowerCase());
            }
        }

        if (options.length === 0) {
            return null;
        }

        const finalOptions = options.map((opt) => {
            if (opt._lspTextEditRange) {
                const startPos = normalizePos(opt._lspTextEditRange.start);
                const endPos = normalizePos(opt._lspTextEditRange.end);
                if (startPos && endPos) {
                    const insertText =
                        typeof opt.apply === "string" ? opt.apply : "";
                    opt.apply = (
                        view: EditorView,
                        _completion: Completion,
                        from: number,
                        to: number,
                    ) => {
                        const rangeStart = posToOffset(
                            view.state.doc,
                            startPos,
                        );
                        const rangeEnd = posToOffset(view.state.doc, endPos);
                        // Merge LSP textEdit bounds with live completion bounds.
                        // This avoids stale-range duplication when the completion
                        // session stays open as the user types additional prefix chars.
                        const replaceFrom =
                            rangeStart == null
                                ? from
                                : Math.min(rangeStart, from);
                        const replaceTo =
                            rangeEnd == null ? to : Math.max(rangeEnd, to);
                        const selection = getSelectionFromSnippetCursor(
                            opt._snippetCursor,
                            replaceFrom,
                            insertText.length,
                        ) || {
                            anchor: replaceFrom + insertText.length,
                            head: replaceFrom + insertText.length,
                        };
                        view.dispatch({
                            changes: {
                                from: replaceFrom,
                                to: replaceTo,
                                insert: insertText,
                            },
                            selection,
                        });
                    };
                }
            }
            return opt;
        });

        // "Live preview" options (e.g. the free-text wrap-in-quotes hint)
        // carry a sentinel via `data.livePreviewQuoteWrap`. For those we have
        // to skip CodeMirror's fuzzy filter (the cached `label` is the typed
        // prefix at query time and would be rejected the moment the user
        // types one more character, closing the menu) and instead regenerate
        // the option synchronously on every transaction via `update`.
        //
        // We also override `from` with the bare-value start offset supplied
        // by the LSP, which knows where the value began -- back at the `=`,
        // across any whitespace the edit swallows. The token `prefixMatch`
        // finds stops at the first character a word cannot contain, so it
        // cannot see that far back on its own.
        //
        // The mixed case -- a result that contains both a live-preview
        // option and ordinary options -- doesn't occur today; the LSP
        // returns the wrap-in-quotes hint by itself.
        const livePreviewMarker = items
            .map((item) => getLivePreviewQuoteWrap(item.data))
            .find((m) => m !== undefined);
        if (livePreviewMarker) {
            return {
                from: livePreviewMarker.bareValueStartOffset,
                options: finalOptions,
                filter: false,
                update: this._refreshLivePreview,
            };
        }

        const elementMenuHasTypedLt =
            isElementNameMenu &&
            pos > 0 &&
            state.sliceDoc(pos - 1, pos) === "<";

        // Element/tag-name completions anchored after an actual `<` omit
        // `validFor`. With `validFor`, CodeMirror keeps the originally returned
        // options and re-filters them locally instead of re-querying, so the
        // suggestions would depend on what was cached when the menu first
        // opened. Omitting it makes CodeMirror re-query on every edit, so the
        // suggestions are the same however the menu was reached (#1328).
        //
        // Bare explicit element menus (Ctrl+Space before typing `<`) keep
        // `validFor`: the server deliberately returned the broad element set,
        // and local filtering is what lets a subsequently typed bare word
        // replace cleanly with `<tag`.
        //
        // Reference, attribute-name, and attribute-value completions keep
        // `validFor`: their stability (e.g. the ref reopen latch) depends on the
        // result staying open across edits. `isElementNameMenu` (computed above)
        // distinguishes them via the `deriveCompletionType` classification.
        return {
            from: pos,
            options: finalOptions,
            ...(elementMenuHasTypedLt
                ? {}
                : {
                      validFor: new RegExp(
                          `^${MACRO_IDENTIFIER_CHAR_REGEX.source}*$`,
                      ),
                  }),
        };
    }

    // Synchronously regenerates the wrap-in-quotes option from the live
    // document text. CodeMirror calls this on every transaction when
    // `result.validFor` is absent, so the option's `displayLabel` (and
    // `apply` text) tracks what the user has typed without bouncing off
    // the LSP. We re-attach the same callback on the new result so
    // subsequent keystrokes keep refreshing -- the autocomplete subsystem
    // only consults `update` on the active result, not the original one.
    _refreshLivePreview = (
        _current: CompletionResult,
        from: number,
        to: number,
        context: CompletionContext,
    ): CompletionResult | null => {
        const text = context.state.sliceDoc(from, to);
        if (
            text.length === 0 ||
            !MACRO_IDENTIFIER_BARE_VALUE_REGEX.test(text)
        ) {
            // User stepped outside a bare value (typed `"`, whitespace,
            // `>`, etc.). Returning an empty-options result closes the
            // menu cleanly without bouncing through Pending state.
            return { from, to, options: [], filter: false };
        }
        const wrapped = `"${text}"`;
        return {
            from,
            to,
            options: [
                {
                    label: text,
                    displayLabel: wrapped,
                    apply: (view, _completion, applyFrom, applyTo) => {
                        // Walk back over whitespace to find the anchoring
                        // `=` so the apply swallows `   foo` into `="foo"`
                        // (matching the LSP-side textEdit range used by
                        // the initial query).
                        const doc = view.state.doc;
                        let walk = applyFrom - 1;
                        while (
                            walk >= 0 &&
                            /\s/.test(doc.sliceString(walk, walk + 1))
                        ) {
                            walk -= 1;
                        }
                        const replaceFrom =
                            walk >= 0 && doc.sliceString(walk, walk + 1) === "="
                                ? walk + 1
                                : applyFrom;
                        view.dispatch({
                            changes: {
                                from: replaceFrom,
                                to: applyTo,
                                insert: wrapped,
                            },
                            selection: {
                                anchor: replaceFrom + wrapped.length,
                            },
                        });
                    },
                    // Attribute-value live-preview row; tag it with the shared
                    // attribute-value type so its dropdown icon matches the
                    // LSP-driven value rows instead of hardcoding the string.
                    type: COMPLETION_TYPES.attributeValue,
                },
            ],
            filter: false,
            update: this._refreshLivePreview,
        };
    };
}

export const lspPlugin = (
    documentId: string,
    doenetWorkerUrl?: string,
    presentation?: DiagnosticPresentation,
) => {
    // The LSP is a process-wide singleton.  The first plugin instance to fire
    // the worker locks in `doenetWorkerUrl`; later instances pass theirs but
    // the singleton ignores subsequent values.  In practice every editor on a
    // page reads the URL from the same `doenetGlobalConfig`, so this is fine.
    uniqueLanguageServerInstance.setDoenetWorkerUrl(doenetWorkerUrl);
    const plugin = new LSPPlugin(documentId, presentation);
    return [
        // Hold the lint state — the squiggles, the panel and the tooltip over
        // them — in the editor's own configuration. `setDiagnostics` will
        // otherwise append it the first time it is called, and appended
        // configuration is discarded by the next `StateEffect.reconfigure`,
        // which `@uiw/react-codemirror` dispatches whenever `<CodeMirror>`
        // re-renders. Every diagnostic on screen would vanish there, with
        // nothing to bring it back until the language server next published.
        //
        // `null` as the source is how `@codemirror/lint` spells "configure
        // linting, but I supply the diagnostics myself" — which the LSP
        // plugin below does, out of what the server publishes.
        linter(null),
        ViewPlugin.define((view) => {
            plugin.view = view;
            lspPluginsByView.set(view, plugin);
            plugin.unsubscribeDiagnostics =
                uniqueLanguageServerInstance.onDiagnostics(
                    plugin.uri,
                    (params) => {
                        plugin.diagnostics = params.diagnostics;
                        plugin.processDiagnostics();
                    },
                );
            plugin.setValue(view.state.doc.toString());
            return plugin;
        }),
        hoverTooltip((view, pos) => {
            // XXX: To be implemented. Currently the LSP doesn't provide hover tooltips.
            return null;
        }),
        autocompletion({
            override: [plugin.getCompletions.bind(plugin)],
        }),
    ];
};

function posToOffset(doc: Text, pos: { line: number; character: number }) {
    if (pos.line >= doc.lines) {
        return;
    }
    const offset = doc.line(pos.line + 1).from + pos.character;
    if (offset > doc.length) {
        return;
    }
    return offset;
}

function offsetToPos(doc: Text, offset: number) {
    const line = doc.lineAt(offset);
    return {
        line: line.number - 1,
        character: offset - line.from,
    };
}

/**
 * Return the contiguous word token immediately to the left of the cursor.
 *
 * The reopen-latch logic only tracks simple word tokens inside ref paths,
 * so this intentionally ignores punctuation and earlier path segments.
 */
function getCurrentWordToken(doc: Text, head: number): WordToken | null {
    const safeHead = Math.max(0, Math.min(head, doc.length));
    const line = doc.lineAt(safeHead);
    const beforeCursor = line.text.slice(0, safeHead - line.from);
    const match = beforeCursor.match(MACRO_IDENTIFIER_SEGMENT_REGEX);
    if (!match) {
        return null;
    }

    return {
        text: match[0],
        from: safeHead - match[0].length,
    };
}

type TransactionChangeSummary = {
    isDeleteEvent: boolean;
    deletedCount: number;
    insertedCount: number;
};

type AutocompleteReopenState = {
    reopenLatch: ReopenLatch | null;
    keepReopenLatchForNextChange: boolean;
    shouldRestartCompletion: boolean;
    shouldCloseCompletion: boolean;
};

/**
 * Clear a stale reopen latch after pure cursor navigation.
 *
 * This only applies when the document did not change, the selection actually
 * moved, and completion was already closed in the previous state.
 */
function shouldInvalidateLatchDueToCursorNavigation(
    update: ViewUpdate,
    prevCompletionStatus: string | null,
): boolean {
    const startSel = update.startState.selection.main;
    const nextSel = update.state.selection.main;
    const selectionMoved =
        startSel.head !== nextSel.head || startSel.anchor !== nextSel.anchor;
    return (
        update.selectionSet &&
        selectionMoved &&
        !update.docChanged &&
        !prevCompletionStatus
    );
}

function getTransactionChangeSummary(
    update: ViewUpdate,
): TransactionChangeSummary {
    const isDeleteEvent = update.transactions.every((tr) => {
        const userEvent = tr.annotation(Transaction.userEvent);
        return typeof userEvent === "string" && userEvent.startsWith("delete");
    });

    let deletedCount = 0;
    let insertedCount = 0;
    for (const tr of update.transactions) {
        tr.changes.iterChanges((fromA, toA, fromB, toB) => {
            if (toA > fromA) {
                deletedCount += toA - fromA;
            }
            if (toB > fromB) {
                insertedCount += toB - fromB;
            }
        });
    }

    return {
        isDeleteEvent,
        deletedCount,
        insertedCount,
    };
}

/**
 * Decide whether a document change should immediately restart autocomplete and
 * whether the one-step reopen latch should be preserved, replaced, or cleared.
 *
 * This is the bridge between CodeMirror update semantics and the smaller,
 * token-level rules in reopen-latch.ts.
 */
function getAutocompleteReopenState({
    update,
    reopenLatch,
    docVersion,
    prevCompletionStatus,
    nextCompletionStatus,
}: {
    update: ViewUpdate;
    reopenLatch: ReopenLatch | null;
    docVersion: number;
    prevCompletionStatus: string | null;
    nextCompletionStatus: string | null;
}): AutocompleteReopenState {
    const head = update.state.selection.main.head;
    const line = update.state.doc.lineAt(head);
    const charBefore = line.text.charAt(head - line.from - 1);
    const charBeforeParen =
        charBefore === "(" ? line.text.charAt(head - line.from - 2) : "";
    // Same rule as in `getCompletions`: only a `.` continuing a reference
    // path restarts completion; a sentence-ending `.` does not.
    const isReferencePropertyDot = endsWithReferencePropertyDot(
        line.text,
        head - line.from,
    );
    const { isDeleteEvent, deletedCount, insertedCount } =
        getTransactionChangeSummary(update);
    // A popup opened on a reference is started explicitly (below), and an
    // explicit completion keeps re-querying whatever the author types next —
    // the trigger rules in `getCompletions` no longer gate it. So the
    // character that leaves the name being completed is where the list has to
    // go: none of `$P.(`, `$P."`, `$P. ` or `$rep[` is a name the suggestions
    // could still apply to.
    //
    // Unless that character opens a menu of its own. `<` starts an element,
    // and the running query for it is what closing here would cancel; `$` and
    // `$(` start another reference — `$a$b`, or the index of `$rep[$i]` — and
    // are handled by giving the restart rules below priority over the close.
    const leftReferenceName =
        !isDeleteEvent &&
        charBefore !== "<" &&
        typedCharacterEndsReferenceName(line.text, head - line.from);
    const currentToken = getCurrentWordToken(update.state.doc, head);
    const tokenPrefixChar = currentToken
        ? (() => {
              const immediatePrefix = update.state.doc.sliceString(
                  Math.max(0, currentToken.from - 1),
                  currentToken.from,
              );
              if (immediatePrefix !== "(") {
                  return immediatePrefix;
              }
              // The name inside `$(name` is a ref token like any other, so
              // read the `$` in front of the paren as its prefix.
              return update.state.doc.sliceString(
                  Math.max(0, currentToken.from - 2),
                  Math.max(0, currentToken.from - 1),
              );
          })()
        : "";
    const previousHead = update.startState.selection.main.head;
    const previousToken = getCurrentWordToken(
        update.startState.doc,
        previousHead,
    );

    let nextReopenLatch = reopenLatch;
    let keepReopenLatchForNextChange = false;

    const latchEvaluation = evaluateReopenLatchTransition({
        reopenLatch,
        docVersion,
        previousToken,
        currentToken,
        tokenPrefixChar,
        isDeleteEvent,
        deletedCount,
        insertedCount,
    });

    if (latchEvaluation.keepReopenLatchForNextChange && nextReopenLatch) {
        // Keep the latch alive for the next related tail edit. Consecutive
        // related tail edits can continue to refresh this latch.
        keepReopenLatchForNextChange = true;
        nextReopenLatch = {
            ...nextReopenLatch,
            docVersion: docVersion + 1,
        };
    }

    // If completion closes due to a single-character extension of the same token,
    // arm a latch keyed to the previous matched token text.
    const reopenedFromCloseTransition = createReopenLatchFromCloseTransition({
        prevCompletionStatus,
        nextCompletionStatus,
        insertedCount,
        deletedCount,
        currentToken,
        previousToken,
        tokenPrefixChar,
        docVersion,
    });

    if (reopenedFromCloseTransition) {
        // Transition from "has options" to "no options" on a one-char tail
        // extension arms a reopen latch. Subsequent related tail edits may
        // keep this latch active until the typed text returns to a match.
        nextReopenLatch = reopenedFromCloseTransition;
        keepReopenLatchForNextChange = true;
    }

    const shouldRestartCompletion =
        charBefore === "$" ||
        (charBefore === "(" && charBeforeParen === "$") ||
        isReferencePropertyDot ||
        latchEvaluation.shouldReopenFromLatch;

    return {
        reopenLatch: nextReopenLatch,
        keepReopenLatchForNextChange,
        shouldRestartCompletion,
        // Ending one reference and starting another is a single keystroke:
        // the `$` that ends the path it sits in opens a name list for the new
        // reference, and that list is the one to keep.
        shouldCloseCompletion: leftReferenceName && !shouldRestartCompletion,
    };
}

/** Normalize position input to LSP { line, character } coordinates. */
function normalizePos(rangePos: PositionLike | null | undefined) {
    if (!rangePos) {
        return null;
    }
    if ("character" in rangePos) {
        return rangePos;
    }
    if ("column" in rangePos) {
        return {
            line: rangePos.line - 1,
            character: rangePos.column - 1,
        };
    }
    return null;
}

/**
 * Normalize a diagnostic range and return a valid CodeMirror offset range,
 * or `null` when the positions cannot be resolved in the current document.
 */
function getValidDiagnosticOffsets(doc: Text, range: RangeLike) {
    const startPos = normalizePos(range?.start);
    const endPos = normalizePos(range?.end);
    if (!startPos || !endPos) {
        return null;
    }

    const startOffset = posToOffset(doc, startPos);
    const endOffset = posToOffset(doc, endPos);
    if (
        startOffset == null ||
        endOffset == null ||
        !Number.isFinite(startOffset) ||
        !Number.isFinite(endOffset)
    ) {
        return null;
    }

    return {
        from: Math.min(startOffset, endOffset),
        to: Math.max(startOffset, endOffset),
    };
}

/**
 * Takes `chars`, a set of characters, and creates a regular expression string that captures anything in the set.
 */
function setToRegex(chars: Set<string>) {
    let preamble = "";
    let flat = Array.from(chars).join("");
    const words = /\w/.test(flat);
    if (words) {
        preamble += "\\w";
        flat = flat.replace(/\w/g, "");
    }
    return `[${preamble}${flat.replace(/[^\w\s]/g, "\\$&")}]`;
}

/**
 * Build the regex that locates the token the completion list is anchored to —
 * the run of text before the cursor that the options are matched against.
 *
 * The strings to pass are the options' *labels*, which is what CodeMirror
 * matches an option by. Neither of the other two texts an option carries will
 * do:
 * - its insert text may be something other than a continuation of what was
 *   typed, since accepting a hyphenated member rewrites the whole macro
 *   (`$base.my` → `$(base.my-p)`);
 * - its `filterText` is an LSP field CodeMirror never reads, and a rewriting
 *   item spells it from the start of its edit (`$base.my-p`) so that clients
 *   which do read it keep the item in the menu.
 *
 * Either would widen the token to cover `$`, `(` and `.`, dragging the anchor
 * back over `$base.` — and every option would then be matched against text
 * none of them start with.
 *
 * `extraChars` are characters the token may span that no label contains.
 */
function prefixMatch(matchTexts: string[], extraChars = "") {
    const first: string[] = [...extraChars];
    const rest: string[] = [...extraChars];

    for (const matchText of matchTexts) {
        if (matchText.length === 0) {
            continue;
        }
        first.push(matchText.charAt(0));
        rest.push(...matchText.slice(1).split(""));
    }

    return new RegExp(
        setToRegex(new Set(first)) + setToRegex(new Set(rest)) + "*$",
    );
}

/**
 * Build an editor selection from snippet cursor metadata and insertion bounds.
 */
function getSelectionFromSnippetCursor(
    snippetCursor: CompletionSnippetCursor | undefined,
    insertStart: number,
    insertTextLength: number,
) {
    if (!snippetCursor) {
        return null;
    }

    if ("caretOffset" in snippetCursor) {
        if (snippetCursor.caretOffset > insertTextLength) {
            return null;
        }
        const position = insertStart + snippetCursor.caretOffset;
        return {
            anchor: position,
            head: position,
        };
    }

    if (
        snippetCursor.selectionStartOffset > insertTextLength ||
        snippetCursor.selectionEndOffset > insertTextLength ||
        snippetCursor.selectionStartOffset > snippetCursor.selectionEndOffset
    ) {
        return null;
    }

    return {
        anchor: insertStart + snippetCursor.selectionStartOffset,
        head: insertStart + snippetCursor.selectionEndOffset,
    };
}

function formatContents(
    contents: MarkupContent | MarkedString | MarkedString[],
): string {
    if (Array.isArray(contents)) {
        return contents.map((c) => formatContents(c) + "\n\n").join("");
    } else if (typeof contents === "string") {
        return contents;
    } else {
        return contents.value;
    }
}

/**
 * Build the `info` payload for an autocomplete entry. When the LSP supplied
 * markdown content, run it through the shared inline-markdown tokenizer
 * (`` `code` ``, `**strong**`, `*em*`) and emit the matching DOM nodes.
 * Plaintext content is returned as-is so CodeMirror renders it via its
 * default text path.
 */
function renderDocumentation(
    contents: MarkupContent | MarkedString | MarkedString[],
): string | (() => Node) {
    const text = formatContents(contents);
    if (!isMarkdown(contents)) {
        return text;
    }
    return () => {
        const div = document.createElement("div");
        appendInlineMarkdown(div, text);
        return div;
    };
}

function isMarkdown(
    contents: MarkupContent | MarkedString | MarkedString[],
): boolean {
    if (Array.isArray(contents)) {
        return contents.some((c) => isMarkdown(c));
    }
    if (typeof contents === "string") {
        return false;
    }
    // `MarkupContent` always has `kind`; `MarkedString`'s object form has
    // `language`, not `kind`. So this discriminates correctly.
    return "kind" in contents && contents.kind === "markdown";
}

/**
 * Append `text` to `parent`, mapping the shared inline-markdown tokens
 * (`` `code` ``, `**strong**`, `*em*`) to their HTML element equivalents.
 * Anything else is emitted as a literal text node.
 *
 * The tokenizer is intentionally non-recursive — leftmost match wins and
 * its content is emitted verbatim into a single element. Don't add a
 * recursive walker thinking nested constructs are missing; the schema
 * doesn't use them.
 */
function appendInlineMarkdown(parent: HTMLElement, text: string) {
    for (const token of parseInlineMarkdown(text)) {
        if (token.kind === "text") {
            parent.appendChild(document.createTextNode(token.text));
        } else {
            const el = document.createElement(token.kind);
            el.textContent = token.text;
            parent.appendChild(el);
        }
    }
}
