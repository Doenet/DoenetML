import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const hoisted = vi.hoisted(() => ({
    readFile: vi.fn(),
    joinPath: vi.fn(),
    registerCommand: vi.fn(() => ({ dispose: vi.fn() })),
    onDidChangeTextDocument: vi.fn(() => ({ dispose: vi.fn() })),
    onDidSaveTextDocument: vi.fn(() => ({ dispose: vi.fn() })),
    onDidChangeActiveTextEditor: vi.fn(() => ({ dispose: vi.fn() })),
    start: vi.fn(async () => {}),
    stop: vi.fn(async () => {}),
    sendRequest: vi.fn(),
    languageClientCalls: [] as {
        options: unknown;
        worker: unknown;
    }[],
}));

vi.mock("vscode", () => ({
    workspace: {
        fs: {
            readFile: hoisted.readFile,
        },
        onDidChangeTextDocument: hoisted.onDidChangeTextDocument,
        onDidSaveTextDocument: hoisted.onDidSaveTextDocument,
    },
    commands: {
        registerCommand: hoisted.registerCommand,
    },
    Uri: {
        joinPath: hoisted.joinPath,
    },
    window: {
        activeTextEditor: undefined,
        onDidChangeActiveTextEditor: hoisted.onDidChangeActiveTextEditor,
    },
}));

vi.mock("vscode-languageclient/browser", () => {
    class MockLanguageClient {
        constructor(
            _id: string,
            _name: string,
            options: unknown,
            worker: unknown,
        ) {
            hoisted.languageClientCalls.push({ options, worker });
        }

        start = hoisted.start;
        stop = hoisted.stop;
        sendRequest = hoisted.sendRequest;
    }

    return { LanguageClient: MockLanguageClient };
});

class FakeWorker {
    static instances: FakeWorker[] = [];

    constructor(public url: string) {
        FakeWorker.instances.push(this);
    }
}

function makeUri(path: string) {
    return {
        path,
        toString(_skipEncoding?: boolean) {
            return `vscode-file://${path}`;
        },
    };
}

function createContext() {
    return {
        extensionUri: makeUri("/extension"),
        subscriptions: [] as unknown[],
    };
}

function makeSubarrayBytes(text: string) {
    const full = new Uint8Array(text.length + 4);
    full.fill(33);
    full.set(new TextEncoder().encode(text), 2);
    return full.subarray(2, 2 + text.length);
}

function stubUrlStatics(
    createObjectURL: (blob: Blob) => string,
    revokeObjectURL: (url: string) => void,
) {
    const UrlWithBlobStatics = class extends URL {};
    UrlWithBlobStatics.createObjectURL = createObjectURL;
    UrlWithBlobStatics.revokeObjectURL = revokeObjectURL;
    vi.stubGlobal("URL", UrlWithBlobStatics);
}

describe("Doenet vscode extension", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
        vi.resetModules();
        FakeWorker.instances = [];
        hoisted.readFile.mockReset();
        hoisted.joinPath.mockReset();
        hoisted.registerCommand.mockClear();
        hoisted.onDidChangeTextDocument.mockClear();
        hoisted.onDidSaveTextDocument.mockClear();
        hoisted.onDidChangeActiveTextEditor.mockClear();
        hoisted.start.mockReset();
        hoisted.stop.mockClear();
        hoisted.sendRequest.mockClear();
        hoisted.languageClientCalls.length = 0;
        hoisted.joinPath.mockImplementation(
            (...parts: Array<{ path?: string } | string>) =>
                makeUri(
                    parts
                        .map((part) =>
                            typeof part === "string"
                                ? part
                                : (part.path ?? String(part)),
                        )
                        .join("/"),
                ),
        );
        vi.stubGlobal("Worker", FakeWorker);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it("passes the bundled worker to the language server and revokes the blob URL on deactivate", async () => {
        const expectedSource = 'console.log("worker");';
        hoisted.readFile.mockResolvedValue(makeSubarrayBytes(expectedSource));

        const createObjectURL = vi.fn((blob: Blob) => {
            expect(blob.type).toBe("application/javascript");
            return "blob:doenet-worker";
        });
        const revokeObjectURL = vi.fn();
        stubUrlStatics(createObjectURL, revokeObjectURL);

        const { activate, deactivate } = await import("../src/extension/index");
        const context = createContext();
        await activate(context as any);

        expect(hoisted.readFile).toHaveBeenCalledWith(
            expect.objectContaining({
                path: expect.stringContaining("build/doenetml-worker/index.js"),
            }),
        );
        expect(await createObjectURL.mock.calls[0][0].text()).toBe(
            expectedSource,
        );
        expect(hoisted.languageClientCalls).toHaveLength(1);
        expect(hoisted.languageClientCalls[0]?.options).toMatchObject({
            initializationOptions: {
                doenetWorkerUrl: "blob:doenet-worker",
            },
        });
        expect(FakeWorker.instances[0]?.url).toContain(
            "build/language-server/index.js",
        );

        await deactivate();
        expect(hoisted.stop).toHaveBeenCalledTimes(1);
        expect(revokeObjectURL).toHaveBeenCalledWith("blob:doenet-worker");
    });

    it("waits for the language client to finish starting before activate resolves", async () => {
        hoisted.readFile.mockResolvedValue(
            makeSubarrayBytes('console.log("worker");'),
        );
        stubUrlStatics(() => "blob:doenet-worker", vi.fn());

        let resolveStart: (() => void) | undefined;
        hoisted.start.mockImplementation(
            () =>
                new Promise<void>((resolve) => {
                    resolveStart = resolve;
                }),
        );

        const { activate } = await import("../src/extension/index");
        let activateResolved = false;
        const activatePromise = activate(createContext() as any).then(() => {
            activateResolved = true;
        });

        await vi.waitFor(() => {
            expect(hoisted.start).toHaveBeenCalledTimes(1);
        });
        expect(activateResolved).toBe(false);

        resolveStart?.();
        await activatePromise;
        expect(activateResolved).toBe(true);
    });

    it("starts the client without initializationOptions when the bundled worker cannot be read", async () => {
        hoisted.readFile.mockRejectedValue(new Error("missing worker"));
        const createObjectURL = vi.fn();
        const revokeObjectURL = vi.fn();
        stubUrlStatics(createObjectURL, revokeObjectURL);
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

        const { activate, deactivate } = await import("../src/extension/index");
        await activate(createContext() as any);

        expect(createObjectURL).not.toHaveBeenCalled();
        expect(hoisted.languageClientCalls[0]?.options).toMatchObject({
            initializationOptions: undefined,
        });
        expect(warn).toHaveBeenCalledWith(
            "[DoenetML] Could not load doenetml-worker for LSP rust resolver:",
            expect.any(Error),
        );

        await deactivate();
        expect(revokeObjectURL).not.toHaveBeenCalled();
    });
});
