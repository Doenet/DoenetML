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
import { doenetSchema } from "@doenet/static-assets/schema";
import { TextDocument } from "vscode-languageserver-textdocument";
import { getRustCore } from "../rust-core";

const TAKES_INDEX_COMPONENT_TYPES: ReadonlySet<string> = new Set(
    doenetSchema.elements
        .filter((schemaElement) => schemaElement?.takesIndex)
        .map((schemaElement) => schemaElement.name),
);

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

            validateTextDocument(textDocument).catch(() => undefined);
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

        // Forward the latest source to the rust adapter as soon as it
        // exists.  The adapter chains updateSource calls internally and
        // query methods await the chain, so this is safe to fire-and-forget.
        if (info.rustAdapter) {
            info.rustAdapter
                .updateSource(info.autoCompleter.sourceObj)
                .catch(() => undefined);
        }

        if (info.rustState === "uninitialized") {
            // Fire-and-forget rust-core sub-worker bootstrap.  Diagnostics
            // should not wait for the worker to spin up.
            info.rustState = "initializing";
            const capturedInfo = info;
            (async () => {
                let spawned: Awaited<ReturnType<typeof getRustCore>> = null;
                try {
                    spawned = await getRustCore(config.doenetWorkerUrl);
                    const currentInfo = documentInfo.get(uri);
                    // Document was closed (or replaced) while we were spawning
                    // the worker — release it and bail.
                    if (!currentInfo || currentInfo !== capturedInfo) {
                        spawned?.terminate();
                        return;
                    }
                    if (!spawned) {
                        capturedInfo.rustState = "unavailable";
                        return;
                    }
                    // One adapter per document keeps rust-side state aligned
                    // with this document's AutoCompleter mappings.
                    const adapter = new RustResolverAdapter(
                        capturedInfo.autoCompleter.sourceObj,
                        {
                            core: spawned.core,
                            takesIndexComponentTypes:
                                TAKES_INDEX_COMPONENT_TYPES,
                        },
                    );
                    await adapter.init();
                    capturedInfo.rustCore = spawned.core;
                    capturedInfo.rustAdapter = adapter;
                    capturedInfo.rustCoreTerminate = spawned.terminate;
                    capturedInfo.autoCompleter.setRustResolverAdapter(adapter);
                    capturedInfo.rustState = "ready";
                    const latestDocument = documents.get(uri);
                    if (latestDocument) {
                        validateTextDocument(latestDocument).catch(
                            () => undefined,
                        );
                    }
                } catch (error) {
                    spawned?.terminate();
                    console.warn(
                        "Rust autocomplete unavailable; completions disabled for this document.",
                        error,
                    );
                    const currentInfo = documentInfo.get(uri);
                    if (currentInfo === capturedInfo) {
                        capturedInfo.rustState = "unavailable";
                    }
                }
            })().catch(() => undefined);
        }

        validateTextDocument(change.document).catch(() => undefined);
    });

    // Release per-document validation/autocomplete state when a document closes.
    documents.onDidClose((event) => {
        const info = documentInfo.get(event.document.uri);
        info?.rustCoreTerminate?.();
        documentInfo.delete(event.document.uri);
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
