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
    DOENET_LSP_METHODS,
    RustResolverAdapter,
} from "@doenet/lsp-tools";
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
        DOENET_LSP_METHODS.setAdditionalDiagnostics,
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
    documents.onDidChangeContent(async (change) => {
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

        // Queue the rust-adapter source sync *now*, before this async handler
        // yields.  `updateSource` synchronously appends to the adapter's sync
        // chain, so a completion request processed during the yield below
        // already sees this change in the chain it awaits — without this, a
        // `$ref.` member completion can resolve against stale rust state.
        const rustSync = info.rustAdapter?.updateSource(
            info.autoCompleter.sourceObj,
        );

        if (info.rustState === "uninitialized") {
            // Fire-and-forget rust-core sub-worker bootstrap.  Diagnostics
            // should not wait for the worker to spin up.  The bootstrap is
            // also exposed as `rustReady` so a completion request that races
            // the boot can await it instead of being answered too early.
            info.rustState = "initializing";
            const capturedInfo = info;
            capturedInfo.rustReady = (async () => {
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
                        await validateTextDocument(latestDocument);
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
            })();
        }

        // Diagnostics are derived from the JS-side DAST and must not wait on
        // the rust worker, so compute them before the rust sync settles.
        await validateTextDocument(change.document);

        // `updateSource` (queued above) resolves without rejecting — the
        // adapter logs and disables itself on a sync failure — so awaiting it
        // here just keeps the handler ordered.
        await rustSync;
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
            // Honor the DAST node's `error_type`: the parser emits
            // `error_type: "warning"` for soft diagnostics (the unified
            // unquoted-attribute warning from #1197 is the canonical
            // case).  Without this mapping, every DAST error rendered as
            // a red error squiggle even when the producing layer chose
            // `warning`/`info`.  Default to `Error` for legacy nodes
            // that omit the field.
            let severity: DiagnosticSeverity;
            switch (error.error_type) {
                case "warning":
                    severity = DiagnosticSeverity.Warning;
                    break;
                case "info":
                    severity = DiagnosticSeverity.Information;
                    break;
                default:
                    severity = DiagnosticSeverity.Error;
            }
            const diagnostic: Diagnostic = {
                message: error.message,
                severity,
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

        const schemaErrors = await info.autoCompleter.getSchemaViolations();
        diagnostics.push(...schemaErrors);

        diagnostics.push(...info.additionalDiagnostics);

        // Send the computed diagnostics to VSCode.
        connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
    }
}
