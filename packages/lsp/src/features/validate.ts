import {
    Connection,
    Diagnostic,
    DiagnosticSeverity,
} from "vscode-languageserver/browser";
import { extractDastErrors } from "@doenet/parser";
import {
    DocumentInfo,
    DoenetDocumentSettings,
    config,
    defaultSettings,
    documentSettings,
    documents,
} from "../globals";
import { AutoCompleter, RustResolverAdapter } from "@doenet/lsp-tools";
import { TextDocument } from "vscode-languageserver-textdocument";
import { getRustCore } from "../rust-core";

export function addValidationSupport(
    connection: Connection,
    documentInfo: DocumentInfo,
) {
    connection.onDidChangeConfiguration((change) => {
        if (config.hasConfigurationCapability) {
            // Reset all cached document settings
            documentSettings.clear();
        } else {
            config.globalSettings = <DoenetDocumentSettings>(
                (change.settings.doenet || defaultSettings)
            );
        }

        // Revalidate all open text documents
        documents.all().forEach(validateTextDocument);
    });

    connection.onRequest(
        "doenet/setAdditionalDiagnostics",
        (params: { uri: string; additionalDiagnostics: Diagnostic[] }) => {
            const { uri, additionalDiagnostics } = params;
            const info = documentInfo.get(uri);
            if (!info) {
                return;
            }
            info.additionalDiagnostics = additionalDiagnostics;

            const textDocument = documents.get(uri);
            if (!textDocument) {
                connection.sendDiagnostics({
                    uri,
                    diagnostics: info.additionalDiagnostics,
                });
                return;
            }

            void validateTextDocument(textDocument);
        },
    );

    // The content of a text document has changed. This event is emitted
    // when the text document first opened or when its content has changed.
    documents.onDidChangeContent((change) => {
        const uri = change.document.uri;
        let info = documentInfo.get(uri);
        if (!info) {
            const autoCompleter = new AutoCompleter();
            info = { autoCompleter, additionalDiagnostics: [] };
            documentInfo.set(uri, info);
        }
        info.autoCompleter.setSource(change.document.getText());
        // Additional diagnostics may no longer be relevant after the contents of the file changes
        info.additionalDiagnostics.length = 0;

        if (info.rustAdapter) {
            // Adapter already wired — just resync source.
            info.rustAdapter.updateSource(info.autoCompleter.sourceObj);
        } else {
            // Fire-and-forget: first completions use the JS fallback until
            // the WASM module finishes loading, then the Rust resolver
            // activates for subsequent requests.
            const capturedInfo = info;
            getRustCore()
                .then((core) => {
                    const currentInfo = documentInfo.get(uri);
                    if (!currentInfo || currentInfo !== capturedInfo) return;
                    if (capturedInfo.rustAdapter) return;
                    const adapter = new RustResolverAdapter(
                        capturedInfo.autoCompleter.sourceObj,
                        { core: core as any },
                    );
                    capturedInfo.rustAdapter = adapter;
                    capturedInfo.autoCompleter.setResolveRefMemberContainerAtOffset(
                        adapter.createResolver(),
                    );
                    capturedInfo.autoCompleter.setIsNameAddressable(
                        (offset, name) =>
                            adapter.isNameAddressableFromOffset(offset, name),
                    );
                })
                .catch(() => {
                    // WASM unavailable — JS fallback is fine.
                });
        }

        validateTextDocument(change.document);
    });

    async function validateTextDocument(
        textDocument: TextDocument,
    ): Promise<void> {
        // In this simple example we get the settings for every validate run.
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
                    end: textDocument.positionAt(
                        error.position?.end?.offset || 0,
                    ),
                },
            };
            if (config.hasDiagnosticRelatedInformationCapability) {
                diagnostic.relatedInformation = [];
            }
            return diagnostic;
        });

        const schemaErrors = info.autoCompleter.getSchemaViolations();
        diagnostics.push(...schemaErrors);

        diagnostics.push(...info.additionalDiagnostics);

        // Send the computed diagnostics to VSCode.
        connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
    }
}
