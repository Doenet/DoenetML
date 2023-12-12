import { Connection, TextDocuments } from "vscode-languageserver/browser";
import { TextDocument } from "vscode-languageserver-textdocument";
import { AutoCompleter } from "@doenet/lsp-tools";

export interface DoenetDocumentSettings {
    formatMode: "doenet" | "xml";
}
export const defaultSettings: DoenetDocumentSettings = { formatMode: "doenet" };

/**
 * LSP Capabilities configuration
 */
export const config = {
    hasConfigurationCapability: false,
    hasWorkspaceFolderCapability: false,
    hasDiagnosticRelatedInformationCapability: false,
    /**
     * These are the settings that are used when document-specific settings are not provided.
     */
    globalSettings: defaultSettings,
};

// The global settings, used when the `workspace/configuration` request is not supported by the client.
// Please note that this is not the case when using this server with the client provided in this example
// but could happen with other clients.

// Cache the settings of all open documents
export const documentSettings: Map<
    string,
    Thenable<DoenetDocumentSettings>
> = new Map();

export const documentInfo: Map<string, { autoCompleter: AutoCompleter }> =
    new Map();
export type DocumentInfo = typeof documentInfo;

/**
 * Retrieve the settings for a document from the global document store.
 */
export async function getDocumentSettings(
    connection: Connection,
    resource: string,
): Promise<DoenetDocumentSettings> {
    if (!config.hasConfigurationCapability) {
        return Promise.resolve(config.globalSettings);
    }
    let result: Thenable<DoenetDocumentSettings> | undefined =
        documentSettings.get(resource);
    if (!result) {
        result = connection.workspace.getConfiguration({
            scopeUri: resource,
            section: "doenet",
        });
        documentSettings.set(resource, result);
    }
    return result;
}

// Create a simple text document manager.
export const documents: TextDocuments<TextDocument> = new TextDocuments(
    TextDocument,
);
