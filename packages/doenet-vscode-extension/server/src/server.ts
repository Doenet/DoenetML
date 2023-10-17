/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
    createConnection,
    TextDocuments,
    Diagnostic,
    DiagnosticSeverity,
    ProposedFeatures,
    InitializeParams,
    DidChangeConfigurationNotification,
    CompletionItem,
    CompletionItemKind,
    TextDocumentPositionParams,
    TextDocumentSyncKind,
    InitializeResult,
    DiagnosticTag,
} from "vscode-languageserver/node";

import { TextDocument } from "vscode-languageserver-textdocument";
import { AutoCompleter } from "@doenet/lsp-tools";
import { extractDastErrors } from "@doenet/parser";

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

connection.onInitialize((params: InitializeParams) => {
    const capabilities = params.capabilities;

    // Does the client support the `workspace/configuration` request?
    // If not, we fall back using global settings.
    hasConfigurationCapability = !!(
        capabilities.workspace && !!capabilities.workspace.configuration
    );
    hasWorkspaceFolderCapability = !!(
        capabilities.workspace && !!capabilities.workspace.workspaceFolders
    );
    hasDiagnosticRelatedInformationCapability = !!(
        capabilities.textDocument &&
        capabilities.textDocument.publishDiagnostics &&
        capabilities.textDocument.publishDiagnostics.relatedInformation
    );

    const result: InitializeResult = {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Incremental,
            // Tell the client that this server supports code completion.
            completionProvider: {
                resolveProvider: true,
            },
        },
    };
    if (hasWorkspaceFolderCapability) {
        result.capabilities.workspace = {
            workspaceFolders: {
                supported: true,
            },
        };
    }
    return result;
});

connection.onInitialized(() => {
    if (hasConfigurationCapability) {
        // Register for all configuration changes.
        connection.client.register(
            DidChangeConfigurationNotification.type,
            undefined,
        );
    }
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders((_event) => {
            connection.console.log("Workspace folder change event received.");
        });
    }
});

// The example settings
interface DoenetDocumentSettings {}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.
const defaultSettings: DoenetDocumentSettings = {};
let globalSettings: DoenetDocumentSettings = defaultSettings;

// Cache the settings of all open documents
const documentSettings: Map<
    string,
    Thenable<DoenetDocumentSettings>
> = new Map();
const documentInfo: Map<string, { autoCompleter: AutoCompleter }> = new Map();

connection.onDidChangeConfiguration((change) => {
    if (hasConfigurationCapability) {
        // Reset all cached document settings
        documentSettings.clear();
    } else {
        globalSettings = <DoenetDocumentSettings>(
            (change.settings.doenetLanguageServer || defaultSettings)
        );
    }

    // Revalidate all open text documents
    documents.all().forEach(validateTextDocument);
});

async function getDocumentSettings(
    resource: string,
): Promise<DoenetDocumentSettings> {
    if (!hasConfigurationCapability) {
        return Promise.resolve(globalSettings);
    }
    let result: Thenable<DoenetDocumentSettings> | undefined =
        documentSettings.get(resource);
    if (!result) {
        result = connection.workspace.getConfiguration({
            scopeUri: resource,
            section: "doenetLanguageServer",
        });
        documentSettings.set(resource, result);
    }
    return result;
}

// Only keep settings for open documents
documents.onDidClose((e) => {
    documentSettings.delete(e.document.uri);
});

// The content of a text document has changed. This event is emitted
// when the text document first opened or when its content has changed.
documents.onDidChangeContent((change) => {
    let info = documentInfo.get(change.document.uri);
    if (!info) {
        const autoCompleter = new AutoCompleter();
        info = { autoCompleter };
        documentInfo.set(change.document.uri, info);
    }
    info.autoCompleter.setSource(change.document.getText());
    validateTextDocument(change.document);
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
    // In this simple example we get the settings for every validate run.
    const settings = await getDocumentSettings(textDocument.uri);
    const info = documentInfo.get(textDocument.uri);
    if (!info) {
        return;
    }
    const errors = extractDastErrors(info.autoCompleter.sourceObj.dast);
    const diagnostics: Diagnostic[] = errors.map((error) => {
        const diagnostic: Diagnostic = {
            message: error.message,
            severity: DiagnosticSeverity.Error,
            range: {
                start: textDocument.positionAt(
                    error.position?.start?.offset || 0,
                ),
                end: textDocument.positionAt(error.position?.end?.offset || 0),
            },
        };
        if (hasDiagnosticRelatedInformationCapability) {
            diagnostic.relatedInformation = [];
        }
        return diagnostic;
    });
    console.log(errors);

    // The validator creates diagnostics for all uppercase words length 2 and more
    const text = textDocument.getText();
    const pattern = /\b[A-Z]{2,}\b/g;
    let m: RegExpExecArray | null;

    let problems = 0;
    while ((m = pattern.exec(text))) {
        problems++;
        const diagnostic: Diagnostic = {
            severity: DiagnosticSeverity.Error,
            range: {
                start: textDocument.positionAt(m.index),
                end: textDocument.positionAt(m.index + m[0].length),
            },
            message: `${m[0]} is all uppercase.`,
            source: "doenet",
        };
        if (hasDiagnosticRelatedInformationCapability) {
            diagnostic.relatedInformation = [
                {
                    location: {
                        uri: textDocument.uri,
                        range: Object.assign({}, diagnostic.range),
                    },
                    message: "Spelling matters",
                },
                {
                    location: {
                        uri: textDocument.uri,
                        range: Object.assign({}, diagnostic.range),
                    },
                    message: "Particularly for names",
                },
            ];
        }
        diagnostics.push(diagnostic);
    }

    // Send the computed diagnostics to VSCode.
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

connection.onDidChangeWatchedFiles((_change) => {
    // Monitored files have change in VSCode
    connection.console.log("We received an file change event");
});

// This handler provides the initial list of the completion items.
connection.onCompletion(
    (textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
        const info = documentInfo.get(textDocumentPosition.textDocument.uri);
        if (!info) {
            return [];
        }
        const offset = info.autoCompleter.sourceObj.rowColToOffset(
            textDocumentPosition.position,
        );
        console.log(
            "offset",
            offset,
            textDocumentPosition.position,
            info.autoCompleter.source.slice(offset, offset + 10),
        );
        const completions = info.autoCompleter.getCompletionItems(
            textDocumentPosition.position,
        );

        return completions;
    },
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
    if (item.data === 1) {
        item.detail = "TypeScript details";
        item.documentation = "TypeScript documentation";
    } else if (item.data === 2) {
        item.detail = "JavaScript details";
        item.documentation = "JavaScript documentation";
    }
    return item;
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
