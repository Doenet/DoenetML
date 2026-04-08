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
import {
    AutoCompleter,
    RustResolverAdapter,
    type RustResolverCore,
} from "@doenet/lsp-tools";
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
            info = {
                autoCompleter,
                additionalDiagnostics: [],
                rustState: "uninitialized",
            };
            documentInfo.set(uri, info);
        }
        info.autoCompleter.setSource(change.document.getText());
        // Additional diagnostics may no longer be relevant after the contents of the file changes
        info.additionalDiagnostics.length = 0;

        if (info.rustState === "ready" && info.rustAdapter) {
            // Adapter already wired — just resync source.
            info.rustAdapter.updateSource(info.autoCompleter.sourceObj);
        } else if (info.rustState === "uninitialized") {
            // Fire-and-forget initialization. Completions remain disabled
            // until Rust is ready.
            info.rustState = "initializing";
            const capturedInfo = info;
            getRustCore()
                .then((core) => {
                    const currentInfo = documentInfo.get(uri);
                    if (!currentInfo || currentInfo !== capturedInfo) return;
                    if (capturedInfo.rustAdapter) return;
                    const sourceObj = capturedInfo.autoCompleter.sourceObj;
                    // Intentionally create a dedicated core/adapter for this
                    // document. This avoids cross-document source switching
                    // complexity and keeps Rust state aligned with this
                    // document's AutoCompleter mappings.
                    const adapter = new RustResolverAdapter(sourceObj, {
                        core: core as RustResolverCore,
                        takesIndex: (componentType: string) => {
                            const s =
                                capturedInfo.autoCompleter.schemaElementsByName[
                                    componentType
                                ];
                            return s?.takesIndex ?? false;
                        },
                    });
                    capturedInfo.rustAdapter = adapter;
                    capturedInfo.autoCompleter = new AutoCompleter(
                        undefined,
                        undefined,
                        {
                            sourceObj,
                            rustResolverAdapter: adapter,
                            getAdditionalRefNames: (offset: number) =>
                                adapter.getRepeatSyntheticNames(offset),
                        },
                    );
                    capturedInfo.rustState = "ready";
                })
                .catch((error) => {
                    console.warn(
                        "Rust autocomplete unavailable; completions disabled for this document.",
                        error,
                    );
                    const currentInfo = documentInfo.get(uri);
                    if (currentInfo === capturedInfo) {
                        capturedInfo.rustState = "unavailable";
                    }
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
