/**
 * Focused unit tests for `features/validate.ts` async timing behavior.
 *
 * The primary goal is to guarantee that diagnostics are emitted immediately on
 * document change and are not blocked by Rust core initialization. Once Rust
 * becomes ready, validation should run again with updated state.
 *
 * This file uses lightweight mocks instead of full LSP worker integration so
 * the event-ordering contract is explicit and stable.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TextDocument } from "vscode-languageserver-textdocument";

type ChangeHandler = (change: { document: TextDocument }) => void;
type CloseHandler = (event: { document: TextDocument }) => void;

let onDidChangeContentHandler: ChangeHandler | undefined;
let onDidCloseHandler: CloseHandler | undefined;
let activeDocument: TextDocument | undefined;

const documentsMock = {
    onDidChangeContent: vi.fn((handler: ChangeHandler) => {
        onDidChangeContentHandler = handler;
    }),
    onDidClose: vi.fn((handler: CloseHandler) => {
        onDidCloseHandler = handler;
    }),
    all: vi.fn(() => []),
    get: vi.fn((uri: string) =>
        activeDocument?.uri === uri ? activeDocument : undefined,
    ),
};

const configMock = {
    hasConfigurationCapability: false,
    hasWorkspaceFolderCapability: false,
    hasDiagnosticRelatedInformationCapability: false,
    globalSettings: { formatMode: "doenet" as const },
};

const documentSettingsMock = new Map();

type Deferred<T> = {
    promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (error: unknown) => void;
};

function createDeferred<T>(): Deferred<T> {
    let resolve!: (value: T) => void;
    let reject!: (error: unknown) => void;
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}

let rustCoreDeferred = createDeferred<unknown>();
const getRustCoreMock = vi.fn(() => rustCoreDeferred.promise);

vi.mock("../src/globals", () => ({
    config: configMock,
    defaultSettings: { formatMode: "doenet" },
    documentSettings: documentSettingsMock,
    documents: documentsMock,
}));

vi.mock("../src/rust-core", () => ({
    getRustCore: () => getRustCoreMock(),
}));

vi.mock("@doenet/parser", () => ({
    extractDastErrors: () => [],
}));

vi.mock("@doenet/static-assets/schema", () => ({
    doenetSchema: {
        elements: [],
    },
}));

vi.mock("@doenet/lsp-tools", () => {
    class AutoCompleter {
        sourceObj: any;

        constructor(_source?: unknown, _schema?: unknown, options?: any) {
            this.sourceObj = options?.sourceObj ?? { dast: {} };
        }

        setSource(_source: string) {}

        setRustResolverAdapter(_adapter: unknown) {}

        getSchemaViolations() {
            return [];
        }
    }

    class RustResolverAdapter {
        constructor(_sourceObj: unknown, _options?: unknown) {}

        init() {}

        updateSource(_sourceObj: unknown) {}

        getDerivedRepeatNames(_offset: number) {
            return [];
        }
    }

    return {
        AutoCompleter,
        RustResolverAdapter,
    };
});

async function flushMicrotasks() {
    await Promise.resolve();
    await Promise.resolve();
}

/** Yield to a macrotask so every pending microtask chain has settled. */
function settle() {
    return new Promise((resolve) => setTimeout(resolve, 0));
}

describe("addValidationSupport", () => {
    beforeEach(() => {
        onDidChangeContentHandler = undefined;
        onDidCloseHandler = undefined;
        activeDocument = undefined;
        documentsMock.onDidChangeContent.mockClear();
        documentsMock.onDidClose.mockClear();
        documentsMock.all.mockClear();
        documentsMock.get.mockClear();
        getRustCoreMock.mockClear();
        rustCoreDeferred = createDeferred<unknown>();
        getRustCoreMock.mockImplementation(() => rustCoreDeferred.promise);
    });

    it("sends diagnostics immediately before Rust init resolves, then revalidates when ready", async () => {
        const { addValidationSupport } =
            await import("../src/features/validate");

        const uri = "file:///diag-timing.doenet";
        const autoCompleter = {
            sourceObj: { dast: {} },
            setSource: vi.fn(),
            setRustResolverAdapter: vi.fn(),
            getSchemaViolations: vi.fn(() => []),
        };
        const documentInfo = new Map([
            [
                uri,
                {
                    autoCompleter,
                    additionalDiagnostics: [],
                    rustState: "uninitialized" as const,
                    rustAdapter: undefined,
                },
            ],
        ]);

        const sendDiagnostics = vi.fn();
        const connection = {
            onDidChangeConfiguration: vi.fn(),
            onRequest: vi.fn(),
            sendDiagnostics,
        };

        addValidationSupport(connection as any, documentInfo as any);

        activeDocument = TextDocument.create(
            uri,
            "doenet",
            1,
            "<graph></graph>",
        );

        onDidChangeContentHandler!({ document: activeDocument });

        // Validation should run immediately, without waiting for Rust init.
        expect(sendDiagnostics).toHaveBeenCalledTimes(1);
        expect(getRustCoreMock).toHaveBeenCalledTimes(1);
        expect(documentInfo.get(uri)?.rustState).toBe("initializing");

        rustCoreDeferred.resolve({});
        await flushMicrotasks();

        // Once Rust is ready, validate is run again on the latest document.
        expect(documentInfo.get(uri)?.rustState).toBe("ready");
        expect(sendDiagnostics).toHaveBeenCalledTimes(2);
    });

    it("terminates the rust core if the document closes during init", async () => {
        const { addValidationSupport } =
            await import("../src/features/validate");

        const uri = "file:///close-during-init.doenet";
        const autoCompleter = {
            sourceObj: { dast: {} },
            setSource: vi.fn(),
            setRustResolverAdapter: vi.fn(),
            getSchemaViolations: vi.fn(() => []),
        };
        const documentInfo = new Map([
            [
                uri,
                {
                    autoCompleter,
                    additionalDiagnostics: [],
                    rustState: "uninitialized" as const,
                    rustAdapter: undefined,
                },
            ],
        ]);

        const connection = {
            onDidChangeConfiguration: vi.fn(),
            onRequest: vi.fn(),
            sendDiagnostics: vi.fn(),
        };

        addValidationSupport(connection as any, documentInfo as any);

        activeDocument = TextDocument.create(uri, "doenet", 1, "<graph />");

        // Kick off rust init, then close the document before `getRustCore`
        // resolves.
        onDidChangeContentHandler!({ document: activeDocument });
        expect(documentInfo.get(uri)?.rustState).toBe("initializing");

        onDidCloseHandler!({ document: activeDocument });
        expect(documentInfo.has(uri)).toBe(false);

        // The spawned worker finally comes up — the bootstrap must release it
        // rather than wire it onto the removed document.
        const terminate = vi.fn();
        rustCoreDeferred.resolve({ core: {}, terminate });
        await settle();

        expect(terminate).toHaveBeenCalledTimes(1);
        expect(documentInfo.has(uri)).toBe(false);
    });

    it("spawns an independent rust core per document", async () => {
        const { addValidationSupport } =
            await import("../src/features/validate");

        // Each spawn resolves to a distinct core instance.
        getRustCoreMock.mockImplementation(() =>
            Promise.resolve({ core: { id: Symbol() }, terminate: vi.fn() }),
        );

        const makeEntry = () => ({
            autoCompleter: {
                sourceObj: { dast: {} },
                setSource: vi.fn(),
                setRustResolverAdapter: vi.fn(),
                getSchemaViolations: vi.fn(() => []),
            },
            additionalDiagnostics: [],
            rustState: "uninitialized" as const,
            rustAdapter: undefined,
        });

        const uriA = "file:///doc-a.doenet";
        const uriB = "file:///doc-b.doenet";
        const documentInfo = new Map([
            [uriA, makeEntry()],
            [uriB, makeEntry()],
        ]);

        const connection = {
            onDidChangeConfiguration: vi.fn(),
            onRequest: vi.fn(),
            sendDiagnostics: vi.fn(),
        };

        addValidationSupport(connection as any, documentInfo as any);

        const docA = TextDocument.create(uriA, "doenet", 1, "<graph />");
        const docB = TextDocument.create(uriB, "doenet", 1, "<graph />");

        activeDocument = docA;
        onDidChangeContentHandler!({ document: docA });
        activeDocument = docB;
        onDidChangeContentHandler!({ document: docB });

        await settle();

        expect(getRustCoreMock).toHaveBeenCalledTimes(2);
        const coreA = documentInfo.get(uriA)?.rustCore;
        const coreB = documentInfo.get(uriB)?.rustCore;
        expect(coreA).toBeDefined();
        expect(coreB).toBeDefined();
        // Per-document cores are how the LSP keeps rust resolver state from
        // bleeding between open documents.
        expect(coreA).not.toBe(coreB);
    });
});
