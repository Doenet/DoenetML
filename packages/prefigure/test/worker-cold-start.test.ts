import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
    let resolveCompilerImport: (() => void) | null = null;

    return {
        compilerImportGate: new Promise<void>((resolve) => {
            resolveCompilerImport = resolve;
        }),
        resolveCompilerImport: () => {
            if (!resolveCompilerImport) {
                throw new Error("compiler import gate resolver is unavailable");
            }
            resolveCompilerImport();
        },
        exposeSpy: vi.fn(),
        compilerCtorSpy: vi.fn(),
        initSpy: vi.fn(
            async (_options: { indexURL?: string } = {}) => undefined,
        ),
        compileSpy: vi.fn(async (_mode: "svg" | "tactile", _source: string) => ({
            svg: "<svg />",
            annotations: "<annotations />",
        })),
    };
});

vi.mock("comlink", () => ({
    expose: mocks.exposeSpy,
}));

vi.mock("../src/worker/compiler", async () => {
    await mocks.compilerImportGate;

    class MockPreFigureCompiler {
        constructor() {
            mocks.compilerCtorSpy();
        }

        init(options: { indexURL?: string } = {}) {
            return mocks.initSpy(options);
        }

        compile(mode: "svg" | "tactile", source: string) {
            return mocks.compileSpy(mode, source);
        }
    }

    return {
        PreFigureCompiler: MockPreFigureCompiler,
    };
});

async function delay(ms: number) {
    await new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Dedicated worker cold-start bootstrap", () => {
    beforeEach(() => {
        vi.resetModules();
        mocks.exposeSpy.mockClear();
        mocks.compilerCtorSpy.mockClear();
        mocks.initSpy.mockClear();
        mocks.compileSpy.mockClear();
    });

    it("keeps worker startup responsive by deferring compiler import until first init", async () => {
        const mod = await import("../src/worker/index");

        // This is the cold-start harness: worker entry import should complete
        // without waiting for heavy compiler module import.
        expect(mocks.exposeSpy).toHaveBeenCalledTimes(1);
        expect(mocks.compilerCtorSpy).toHaveBeenCalledTimes(0);

        const initPromise = mod.api.init({ indexURL: "https://cdn.example.com/assets/" });
        await delay(25);

        expect(mocks.compilerCtorSpy).toHaveBeenCalledTimes(0);
        expect(mocks.initSpy).toHaveBeenCalledTimes(0);

        mocks.resolveCompilerImport();
        await initPromise;

        expect(mocks.compilerCtorSpy).toHaveBeenCalledTimes(1);
        expect(mocks.initSpy).toHaveBeenCalledTimes(1);

        const result = await mod.api.compile("svg", "<diagram />");
        expect(result).toEqual({
            svg: "<svg />",
            annotations: "<annotations />",
        });
        expect(mocks.compileSpy).toHaveBeenCalledWith("svg", "<diagram />");
    });
});
