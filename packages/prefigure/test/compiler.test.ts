import { beforeEach, describe, expect, it, vi } from "vitest";
import { PREFIG_WHEEL_FILENAME } from "../src/worker/compiler-metadata";

const mocks = vi.hoisted(() => {
    return {
        loadPyodideSpy: vi.fn(),
        registerJsModuleSpy: vi.fn(),
        loadPackageSpy: vi.fn(),
        runPythonAsyncSpy: vi.fn(),
        runPythonSpy: vi.fn(),
    };
});

vi.mock("pyodide", () => {
    return {
        loadPyodide: mocks.loadPyodideSpy,
    };
});

vi.mock("../src/worker/compat-api", () => ({
    prefigBrowserApi: {
        initFinished: Promise.resolve(),
    },
}));

describe("PreFigureCompiler", () => {
    beforeEach(() => {
        vi.resetModules();
        mocks.loadPyodideSpy.mockReset();
        mocks.registerJsModuleSpy.mockReset();
        mocks.loadPackageSpy.mockReset();
        mocks.runPythonAsyncSpy.mockReset();
        mocks.runPythonSpy.mockReset();
    });

    function createPyodideMock(indexURL: string) {
        return {
            _api: { config: { indexURL } },
            registerJsModule: mocks.registerJsModuleSpy,
            loadPackage: mocks.loadPackageSpy,
            runPythonAsync: mocks.runPythonAsyncSpy,
            runPython: mocks.runPythonSpy,
        };
    }

    it("loads prefig wheel from normalized indexURL", async () => {
        const pyodide = createPyodideMock("https://cdn.example.com/assets");
        mocks.loadPyodideSpy.mockResolvedValue(pyodide);
        mocks.loadPackageSpy.mockResolvedValue(undefined);
        mocks.runPythonAsyncSpy.mockResolvedValue(undefined);

        const { PreFigureCompiler } = await import("../src/worker/compiler");
        const compiler = new PreFigureCompiler();

        await compiler.init({ indexURL: "https://cdn.example.com/assets" });

        expect(mocks.loadPackageSpy).toHaveBeenCalledTimes(1);
        const packageList = mocks.loadPackageSpy.mock.calls[0][0] as string[];
        expect(packageList).toContain(
            `https://cdn.example.com/assets/${PREFIG_WHEEL_FILENAME}`,
        );
        expect(mocks.registerJsModuleSpy).toHaveBeenCalledWith(
            "prefigBrowserApi",
            expect.any(Object),
        );
    });

    it("wraps wheel load failures with actionable error", async () => {
        const pyodide = createPyodideMock("https://cdn.example.com/assets");
        mocks.loadPyodideSpy.mockResolvedValue(pyodide);
        mocks.loadPackageSpy.mockRejectedValue(new Error("network down"));

        const { PreFigureCompiler } = await import("../src/worker/compiler");
        const compiler = new PreFigureCompiler();

        await expect(compiler.init()).rejects.toThrow(
            new RegExp(
                `Failed to load PreFigure wheel \\(${PREFIG_WHEEL_FILENAME.replace(/[.*+?^${}()|[\\]\\]/g, "\\\\$&")}\\) from https://cdn\\.example\\.com/assets/`,
            ),
        );

        try {
            await compiler.init();
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect((error as Error & { cause?: unknown }).cause).toBeTruthy();
        }
    });

    it("throws if compile is called before init", async () => {
        const { PreFigureCompiler } = await import("../src/worker/compiler");
        const compiler = new PreFigureCompiler();

        await expect(compiler.compile("svg", "<diagram/>")).rejects.toThrow(
            /Compiler not initialized/,
        );
    });

    it("returns svg and annotations from python result", async () => {
        const pyodide = createPyodideMock("https://cdn.example.com/assets/");
        mocks.loadPyodideSpy.mockResolvedValue(pyodide);
        mocks.loadPackageSpy.mockResolvedValue(undefined);
        mocks.runPythonAsyncSpy.mockResolvedValue(undefined);
        mocks.runPythonSpy.mockResolvedValue([
            "<svg id='ok' />",
            "<annotations></annotations>",
        ]);

        const { PreFigureCompiler } = await import("../src/worker/compiler");
        const compiler = new PreFigureCompiler();

        await compiler.init();
        const result = await compiler.compile("svg", "<diagram/> ");

        expect(result).toEqual({
            svg: "<svg id='ok' />",
            annotations: "<annotations></annotations>",
        });
    });

    it("coalesces concurrent init calls into one initialization", async () => {
        const pyodide = createPyodideMock("https://cdn.example.com/assets/");
        mocks.loadPyodideSpy.mockResolvedValue(pyodide);

        let resolveLoadPackage: (() => void) | undefined;
        const loadPackagePromise = new Promise<void>((resolve) => {
            resolveLoadPackage = resolve;
        });

        mocks.loadPackageSpy.mockReturnValue(loadPackagePromise);
        mocks.runPythonAsyncSpy.mockResolvedValue(undefined);

        const { PreFigureCompiler } = await import("../src/worker/compiler");
        const compiler = new PreFigureCompiler();

        const init1 = compiler.init();
        const init2 = compiler.init();

        resolveLoadPackage?.();
        await Promise.all([init1, init2]);

        expect(mocks.loadPyodideSpy).toHaveBeenCalledTimes(1);
        expect(mocks.loadPackageSpy).toHaveBeenCalledTimes(1);
        expect(mocks.runPythonAsyncSpy).toHaveBeenCalledTimes(1);
    });
});
