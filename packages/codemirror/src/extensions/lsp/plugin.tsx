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

import { renderToString } from "react-dom/server";
import React from "react";
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
import { Text } from "@codemirror/state";
import {
    setDiagnostics,
    Diagnostic as CodeMirrorDiagnostic,
} from "@codemirror/lint";
import {
    autocompletion,
    CompletionContext,
    Completion,
} from "@codemirror/autocomplete";
import Markdown from "react-markdown";
import type {
    MarkupContent,
    MarkedString,
} from "vscode-languageserver-protocol";
import { CompletionItemKind } from "vscode-languageserver-protocol";
import "./tooltip.css";

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

// One language server is shared across all plugin instances
export const uniqueLanguageServerInstance = new LSP();

export class LSPPlugin implements PluginValue {
    documentId: string;
    uri: string = "";
    value: string = "";
    diagnostics: LSPDiagnostic[] = [];
    diagnosticsPromise?: Promise<LSPDiagnostic[]>;
    view?: EditorView;

    constructor(documentId: string) {
        this.documentId = documentId;
        this.uri = `file:///${documentId}.doenet`;
    }

    update(update: ViewUpdate): void {
        const value = update.state.doc.toString();
        if (update.docChanged) {
            this.setValue(value);
        }
    }

    async setValue(value: string) {
        if (value === this.value) {
            return;
        }
        await uniqueLanguageServerInstance.updateDocument(this.uri, value);
        this.pollForDiagnostics();
        this.value = value;
    }

    async pollForDiagnostics() {
        this.diagnosticsPromise = uniqueLanguageServerInstance.getDiagnostics(
            this.uri,
        );
        this.diagnostics = await this.diagnosticsPromise;
        this.processDiagnostics();
    }

    processDiagnostics() {
        if (!this.view) {
            return;
        }
        const diagnostics: CodeMirrorDiagnostic[] = this.diagnostics
            .map(({ range, message, severity }) => {
                const cmSeverity = lspSeverityToCmSeverity[severity!];
                return {
                    from: posToOffset(this.view!.state.doc, range.start)!,
                    to: posToOffset(this.view!.state.doc, range.end)!,
                    severity: cmSeverity,
                    message,
                    renderMessage: () => {
                        const div = document.createElement("div");
                        // We use renderToString so that we don't have to clean up any
                        // react listeners, etc. when the dom element is deleted by codemirror.
                        div.innerHTML = renderToString(
                            <div className="cm-lint-tooltip">
                                <h4 className={"heading " + cmSeverity}>
                                    {lspDiagnosticToName[severity!]}
                                </h4>
                                <div className="cm-lint-body">
                                    <Markdown>{message}</Markdown>
                                </div>
                            </div>,
                        );
                        return div.firstChild as HTMLElement;
                    },
                };
            })
            .filter(({ from, to }) => from != null && to != null)
            .sort((a, b) => {
                switch (true) {
                    case a.from < b.from:
                        return -1;
                    case a.from > b.from:
                        return 1;
                }
                return 0;
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
        const precedingTriggerCharacter =
            uniqueLanguageServerInstance.completionTriggers.includes(
                line.text[pos - line.from - 1],
            );
        if (!explicit && precedingTriggerCharacter) {
            triggerKind = LSPCompletionTriggerKind.TriggerCharacter;
            triggerCharacter = line.text[pos - line.from - 1];
        }
        if (
            triggerKind === LSPCompletionTriggerKind.Invoked &&
            !context.matchBefore(/\w+$/) &&
            !precedingTriggerCharacter &&
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
            }) => {
                const completion: Completion & {
                    filterText: string;
                    sortText?: string;
                    apply: string;
                } = {
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
                return completion;
            },
        );

        const [span, match] = prefixMatch(options);
        const token = context.matchBefore(match);

        if (token) {
            pos = token.from;
            const word = token.text.toLowerCase();
            if (/^\w+$/.test(word)) {
                options = options
                    .filter(({ filterText }) =>
                        filterText.toLowerCase().startsWith(word),
                    )
                    .sort(({ apply: a }, { apply: b }) => {
                        switch (true) {
                            case a.startsWith(token.text) &&
                                !b.startsWith(token.text):
                                return -1;
                            case !a.startsWith(token.text) &&
                                b.startsWith(token.text):
                                return 1;
                        }
                        return 0;
                    });
            }
        }
        return {
            from: pos,
            options,
        };
    }
}

export const lspPlugin = (documentId: string) => {
    const plugin = new LSPPlugin(documentId);
    return [
        ViewPlugin.define((view) => {
            plugin.view = view;
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

function toSet(chars: Set<string>) {
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
    const first = new Set<string>();
    const rest = new Set<string>();

    for (const { apply } of options) {
        const [initial, ...restStr] = apply as string;
        first.add(initial);
        for (const char of restStr) {
            rest.add(char);
        }
    }

    const source = toSet(first) + toSet(rest) + "*$";
    return [new RegExp("^" + source), new RegExp(source)];
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
