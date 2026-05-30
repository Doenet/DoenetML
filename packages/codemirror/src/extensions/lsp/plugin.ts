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
    CompletionResult,
    completionStatus,
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
import { CompletionItemKind } from "vscode-languageserver-protocol/browser";

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

/**
 * Map a raw LSP completion item to the CodeMirror `type` string that selects
 * its left-column icon (`.cm-completionIcon-<type>`, styled in
 * `completionIconTheme`). The default mapping is just the lowercased LSP kind
 * name, but components, reference-properties, and closing tags all share LSP
 * kind `Property`, so they're split here — for icon purposes only — using
 * signal the items already carry. No LSP `kind` is changed.
 *
 * NOTE: these `type` strings are also the dispatch key for the context-help
 * panel — `computeContextHelpForCompletion` in `@doenet/lsp-tools` branches on
 * them. Keep the two in sync: renaming a type here without updating that
 * dispatch silently drops help for the affected category.
 */
function deriveCompletionType(rawItem: {
    kind?: CompletionItemKind;
    detail?: string;
    label: string;
}): string | undefined {
    const { kind, detail, label } = rawItem;
    if (kind == null) {
        return undefined;
    }
    if (kind === CompletionItemKind.Property) {
        if (label.startsWith("/")) {
            return "closetag";
        }
        // Discriminate on `detail` only: reference-properties set
        // detail="Property on X"; components set only `documentation`. Don't
        // test `textEdit` — components also carry one in the Ctrl+Space-
        // between-tags path (the `insertLeadingBracket` case).
        if (detail) {
            return "refproperty";
        }
        return "component";
    }
    // snippet | enum (attribute name) | value (attribute value) | reference
    return completionItemKindMap[kind].toLowerCase();
}

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
        uniqueLanguageServerInstance.closeDocument(this.uri).catch(() => {});
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
        const precedingServerTriggerCharacter =
            !isClosingQuoteTrigger &&
            uniqueLanguageServerInstance.completionTriggers.includes(
                charBeforeCursor,
            );
        const precedingLocalRefTriggerCharacter =
            charBeforeCursor === "$" ||
            charBeforeCursor === "." ||
            (charBeforeCursor === "(" &&
                (charBeforeParen === "$" || charBeforeParen === "."));

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

        let options = items.map((rawItem) => {
            const {
                detail,
                label,
                kind,
                textEdit,
                documentation,
                sortText,
                filterText,
                data,
                displayLabel,
            } = rawItem;
            const completion: ExtendedCompletion = {
                label,
                detail,
                apply: textEdit?.newText ?? label,
                type: deriveCompletionType(rawItem),
                sortText: sortText ?? label,
                filterText: filterText ?? label,
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
            if (wordLower && MACRO_IDENTIFIER_SEGMENT_REGEX.test(wordLower)) {
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

        // "Live preview" options (e.g. the free-text wrap-in-quotes hint)
        // carry a sentinel via `data.livePreviewQuoteWrap`. For those we have
        // to skip CodeMirror's fuzzy filter (the cached `label` is the typed
        // prefix at query time and would be rejected the moment the user
        // types one more character, closing the menu) and instead regenerate
        // the option synchronously on every transaction via `update`.
        //
        // We also override `from` with the bare-value start offset supplied
        // by the LSP. The plugin's default `pos` comes from `prefixMatch`,
        // which builds its regex from `option.apply`. Since our apply text
        // starts with a literal `"` and the user has not typed one, the
        // regex match fails and `pos` defaults to `context.pos` -- which
        // sits one past the first typed character. Anchoring `from` there
        // would shift the result's view of the bare value by one slot, so
        // subsequent typing reads "ello" instead of "hello".
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

        return {
            from: pos,
            options: finalOptions,
            validFor: new RegExp(`^${MACRO_IDENTIFIER_CHAR_REGEX.source}*$`),
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
                    type: "value",
                },
            ],
            filter: false,
            update: this._refreshLivePreview,
        };
    };
}

export const lspPlugin = (documentId: string, doenetWorkerUrl?: string) => {
    // The LSP is a process-wide singleton.  The first plugin instance to fire
    // the worker locks in `doenetWorkerUrl`; later instances pass theirs but
    // the singleton ignores subsequent values.  In practice every editor on a
    // page reads the URL from the same `doenetGlobalConfig`, so this is fine.
    uniqueLanguageServerInstance.setDoenetWorkerUrl(doenetWorkerUrl);
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
    const { isDeleteEvent, deletedCount, insertedCount } =
        getTransactionChangeSummary(update);
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
              // Treat `$(name` and `.(` member forms as ref-prefix contexts.
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

    return {
        reopenLatch: nextReopenLatch,
        keepReopenLatchForNextChange,
        shouldRestartCompletion:
            charBefore === "$" ||
            charBefore === "." ||
            (charBefore === "(" &&
                (charBeforeParen === "$" || charBeforeParen === ".")) ||
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
