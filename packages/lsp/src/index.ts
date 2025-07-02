/* --------------------------------------------------------------------------------------------
 * Modified from Microsoft's vscode examples. Original copyright notice:
 * --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
    createConnection,
    InitializeParams,
    DidChangeConfigurationNotification,
    TextDocumentSyncKind,
    InitializeResult,
    BrowserMessageWriter,
    BrowserMessageReader,
} from "vscode-languageserver/browser";

import { addFoldingRangeSupport } from "./features/folding-ranges";
import { addDocumentSymbolsSupport } from "./features/document-symbols";
import { config, documentInfo, documentSettings, documents } from "./globals";
import { addDocumentFormattingSupport } from "./features/formatting";
import { addValidationSupport } from "./features/validate";
import { addDocumentCompletionSupport } from "./features/completions";
import { addDocumentHoverSupport } from "./features/hover";

try {
    // @ts-ignore
    globalThis.LSP_GLOBALS = {
        config,
        documentInfo,
        documentSettings,
        documents,
    };
} catch (e) {
    console.log(e);
}

/* browser specific setup code */
const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);
const connection = createConnection(messageReader, messageWriter);

//
// Initialize the Language Server
//
connection.onInitialize((params: InitializeParams) => {
    const capabilities = params.capabilities;

    // Does the client support the `workspace/configuration` request?
    // If not, we fall back using global settings.
    config.hasConfigurationCapability =
        capabilities.workspace?.configuration || false;
    config.hasWorkspaceFolderCapability =
        capabilities.workspace?.workspaceFolders || false;
    config.hasDiagnosticRelatedInformationCapability =
        capabilities.textDocument?.publishDiagnostics?.relatedInformation ||
        false;

    const result: InitializeResult = {
        capabilities: {
            textDocumentSync: {
                openClose: true,
                change: TextDocumentSyncKind.Incremental,
            },
            // Tell the client that this server supports code completion.
            completionProvider: {
                triggerCharacters: ["<", ".", "$", "/", '"', "'"],
                resolveProvider: true,
            },
            documentFormattingProvider: true,
            foldingRangeProvider: true,
            documentSymbolProvider: true,
            hoverProvider: true,
        },
    };
    if (config.hasWorkspaceFolderCapability) {
        result.capabilities.workspace = {
            workspaceFolders: {
                supported: true,
            },
        };
    }
    return result;
});

connection.onInitialized(() => {
    if (config.hasConfigurationCapability) {
        // Register for all configuration changes.
        connection.client.register(
            DidChangeConfigurationNotification.type,
            undefined,
        );
    }
    if (config.hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders((_event) => {
            connection.console.log("Workspace folder change event received.");
        });
    }
});

// Only keep settings for open documents
documents.onDidClose((e) => {
    documentSettings.delete(e.document.uri);
});

connection.onDidChangeWatchedFiles((_change) => {
    // Monitored files have change in VSCode
    connection.console.log("We received an file change event");
});

//
// Add language features
//
addValidationSupport(connection, documentInfo);
addFoldingRangeSupport(connection, documentInfo);
addDocumentSymbolsSupport(connection, documentInfo);
addDocumentFormattingSupport(connection, documentInfo);
addDocumentCompletionSupport(connection, documentInfo);
addDocumentHoverSupport(connection, documentInfo);

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
