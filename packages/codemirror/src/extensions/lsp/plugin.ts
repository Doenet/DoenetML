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
    setDiagnostics,
    Diagnostic as CodeMirrorDiagnostic,
} from "@codemirror/lint";
import {
    autocompletion,
    CompletionContext,
    Completion,
    completionStatus,
    startCompletion,
} from "@codemirror/autocomplete";
import {
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
import type {
    MarkupContent,
    MarkedString,
} from "vscode-languageserver-protocol";
import { CompletionItemKind } from "vscode-languageserver-protocol/browser";
import "./tooltip.css";

/** Escape a string for safe interpolation into an HTML context. */
function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

const completionItemKindMap = Object.fromEntries(
    Object.entries(CompletionItemKind).map(([key, value]) => [value, key]),
) as Record<CompletionItemKind, string>;

const lspDiagnosticToName = {
    [LSPDiagnosticSeverity.Error]: "Error",
    [LSPDiagnosticSeverity.Warning]: "Warning",
    [LSPDiagnosticSeverity.Information]: "Info",
    [LSPDiagnosticSeverity.Hint]: "Hint",
};
const lspSeverityToCmSeverity = {
    [LSPDiagnosticSeverity.Error]: "error",
    [LSPDiagnosticSeverity.Warning]: "warning",
    [LSPDiagnosticSeverity.Information]: "info",
    [LSPDiagnosticSeverity.Hint]: "info",
} as const;

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
    | { line: number; character: number }
    | { line: number; column: number };

type RangeLike = {
    start: PositionLike;
    end: PositionLike;
};

type ExtendedCompletion = Completion & {
    filterText: string;
    sortText?: string;
    _lspTextEditRange?: {
        start: { line: number; character: number };
        end: { line: number; character: number };
    };
    _snippetCursor?: CompletionSnippetCursor;
};

// One language server is shared across all plugin instances
export const uniqueLanguageServerInstance = new LSP();

export class LSPPlugin implements PluginValue {
    documentId: string;
    uri: string = "";
    value: string = "";
    diagnostics: LSPDiagnostic[] = [];
    completionRequestToken = 0;
    docVersion = 0;
    reopenLatch: ReopenLatch | null = null;
    view?: EditorView;
    unsubscribeDiagnostics?: () => void;

    constructor(documentId: string) {
        this.documentId = documentId;
        this.uri = `file:///${documentId}.doenet`;
    }

    update(update: ViewUpdate): void {
        const prevCompletionStatus = completionStatus(update.startState);
        const nextCompletionStatus = completionStatus(update.state);
        const startSel = update.startState.selection.main;
        const nextSel = update.state.selection.main;
        const selectionMoved =
            startSel.head !== nextSel.head ||
            startSel.anchor !== nextSel.anchor;

        if (
            update.selectionSet &&
            selectionMoved &&
            !update.docChanged &&
            !prevCompletionStatus
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

            if (reopenState.shouldRestartCompletion) {
                setTimeout(() => {
                    if (!this.view || this.view !== update.view) {
                        return;
                    }
                    startCompletion(update.view);
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
        this.unsubscribeDiagnostics?.();
    }

    processDiagnostics() {
        if (!this.view) {
            return;
        }
        const diagnostics: CodeMirrorDiagnostic[] = [];
        for (const diagnostic of this.diagnostics as Array<
            LSPDiagnostic & { markClass?: string }
        >) {
            const { range, message, severity, source, markClass, code } =
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

            diagnostics.push({
                from,
                to,
                severity: cmSeverity,
                message,
                ...(markClass ? { markClass } : {}),
                renderMessage: () => {
                    const div = document.createElement("div");
                    const heading =
                        source ?? lspDiagnosticToName[severity!] ?? "Info";
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
                    )}</h4><div class="cm-lint-body">${renderDiagnosticMarkdownHtml(message)}</div>
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
        const requestToken = ++this.completionRequestToken;
        const requestDocVersion = this.docVersion;
        const line = state.doc.lineAt(pos);
        let triggerKind: LSPCompletionTriggerKind =
            LSPCompletionTriggerKind.Invoked;
        let triggerCharacter: string | undefined;
        const charBeforeCursor = line.text[pos - line.from - 1];
        const charBeforeParen =
            charBeforeCursor === "(" ? line.text[pos - line.from - 2] : "";
        const precedingServerTriggerCharacter =
            uniqueLanguageServerInstance.completionTriggers.includes(
                charBeforeCursor,
            );
        const precedingLocalRefTriggerCharacter =
            charBeforeCursor === "$" ||
            charBeforeCursor === "." ||
            (charBeforeCursor === "(" && charBeforeParen === "$");

        if (!explicit && precedingServerTriggerCharacter) {
            triggerKind = LSPCompletionTriggerKind.TriggerCharacter;
            triggerCharacter = charBeforeCursor;
        }
        if (
            triggerKind === LSPCompletionTriggerKind.Invoked &&
            !context.matchBefore(/\w+$/) &&
            !precedingServerTriggerCharacter &&
            !precedingLocalRefTriggerCharacter &&
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
            },
        );

        // Guard against out-of-order async responses from older completion requests.
        if (
            !this.view ||
            requestToken !== this.completionRequestToken ||
            this.docVersion !== requestDocVersion
        ) {
            return null;
        }

        if (!result) {
            return null;
        }

        const items = "items" in result ? result.items : result;

        let options = items.map(
            ({
                detail,
                label,
                kind,
                textEdit,
                documentation,
                sortText,
                filterText,
                data,
            }) => {
                const completion: ExtendedCompletion = {
                    label,
                    detail,
                    apply: textEdit?.newText ?? label,
                    type: kind && completionItemKindMap[kind].toLowerCase(),
                    sortText: sortText ?? label,
                    filterText: filterText ?? label,
                };
                if (documentation) {
                    completion.info = formatContents(documentation);
                }
                // Store range info if present for custom apply logic later
                if (textEdit && "range" in textEdit) {
                    completion._lspTextEditRange = textEdit.range;
                }
                const snippetCursor =
                    getSnippetCursorFromCompletionItemData(data);
                if (snippetCursor) {
                    completion._snippetCursor = snippetCursor;
                }
                return completion;
            },
        );

        const [span, match] = prefixMatch(options);
        const token = context.matchBefore(match);

        if (token) {
            let word = token.text;
            let fromOffset = 0;
            // Find the last '<' to handle cases where user types after a closing tag (e.g., "></doc>|<")
            const lastLt = word.lastIndexOf("<");
            if (lastLt >= 0) {
                fromOffset = lastLt + 1;
                word = word.slice(fromOffset);
            }
            pos = token.from + fromOffset;
            const wordLower = word.toLowerCase();
            if (wordLower && /^\w+$/.test(wordLower)) {
                options = options
                    .filter(({ filterText }) =>
                        filterText.toLowerCase().startsWith(wordLower),
                    )
                    .sort((optionA, optionB) => {
                        // Use original apply text for comparison (important for snippets with custom apply functions)
                        const aStr =
                            typeof optionA.apply === "string"
                                ? optionA.apply
                                : "";
                        const bStr =
                            typeof optionB.apply === "string"
                                ? optionB.apply
                                : "";
                        switch (true) {
                            case aStr.startsWith(word) &&
                                !bStr.startsWith(word):
                                return -1;
                            case !aStr.startsWith(word) &&
                                bStr.startsWith(word):
                                return 1;
                        }
                        return 0;
                    });
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

        return {
            from: pos,
            options: finalOptions,
            validFor: /^[A-Za-z0-9_-]*$/,
        };
    }
}

export const lspPlugin = (documentId: string) => {
    const plugin = new LSPPlugin(documentId);
    return [
        ViewPlugin.define((view) => {
            plugin.view = view;
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
    const match = beforeCursor.match(/[A-Za-z0-9_-]+$/);
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
};

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
    const { isDeleteEvent, deletedCount, insertedCount } =
        getTransactionChangeSummary(update);
    const currentToken = getCurrentWordToken(update.state.doc, head);
    const tokenPrefixChar = currentToken
        ? update.state.doc.sliceString(
              Math.max(0, currentToken.from - 1),
              currentToken.from,
          )
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

    return {
        reopenLatch: nextReopenLatch,
        keepReopenLatchForNextChange,
        shouldRestartCompletion:
            charBefore === "$" ||
            charBefore === "." ||
            (charBefore === "(" && charBeforeParen === "$") ||
            latchEvaluation.shouldReopenFromLatch,
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

function prefixMatch(options: Completion[]) {
    const first: string[] = [];
    const rest: string[] = [];

    for (const completion of options) {
        const textToAnalyze = completion.apply;
        if (typeof textToAnalyze !== "string" || textToAnalyze.length === 0) {
            continue;
        }
        first.push(textToAnalyze.charAt(0));
        rest.push(...textToAnalyze.slice(1).split(""));
    }

    const source =
        setToRegex(new Set(first)) + setToRegex(new Set(rest)) + "*$";
    return [new RegExp("^" + source), new RegExp(source)];
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
