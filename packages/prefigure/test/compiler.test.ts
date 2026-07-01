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

    it("injects one shared hatch pattern into an existing defs block", async () => {
        const pyodide = createPyodideMock("https://cdn.example.com/assets/");
        mocks.loadPyodideSpy.mockResolvedValue(pyodide);
        mocks.loadPackageSpy.mockResolvedValue(undefined);
        mocks.runPythonAsyncSpy.mockResolvedValue(undefined);
        mocks.runPythonSpy.mockResolvedValue([
            '<svg><defs><marker id="m"/></defs><path fill="url(#doenet-hatch-horizontal-23316635646666)"/><path fill="url(#doenet-hatch-horizontal-23316635646666)"/></svg>',
            "",
        ]);

        const { PreFigureCompiler } = await import("../src/worker/compiler");
        const compiler = new PreFigureCompiler();

        await compiler.init();
        const result = await compiler.compile("svg", "<diagram/>");

        expect(result.svg).toContain(
            '<pattern id="doenet-hatch-horizontal-23316635646666"',
        );
        expect(
            result.svg.match(/id="doenet-hatch-horizontal-23316635646666"/g),
        ).toHaveLength(1);
        expect(result.svg).toContain('<marker id="m"/>');
        expect(result.svg).toContain('stroke="#1f5dff"');
    });

    it("injects hatch patterns even when the svg has no defs block", async () => {
        const pyodide = createPyodideMock("https://cdn.example.com/assets/");
        mocks.loadPyodideSpy.mockResolvedValue(pyodide);
        mocks.loadPackageSpy.mockResolvedValue(undefined);
        mocks.runPythonAsyncSpy.mockResolvedValue(undefined);
        mocks.runPythonSpy.mockResolvedValue([
            '<svg><path fill="url(#doenet-hatch-diagonalcrosshatch-23666630303030)"/></svg>',
            "",
        ]);

        const { PreFigureCompiler } = await import("../src/worker/compiler");
        const compiler = new PreFigureCompiler();

        await compiler.init();
        const result = await compiler.compile("svg", "<diagram/>");

        expect(result.svg).toContain(
            '<defs><pattern id="doenet-hatch-diagonalcrosshatch-23666630303030"',
        );
        expect(result.svg).toContain(
            'd="M0,12 L12,0 M0,0 L12,12" stroke="#ff0000"',
        );
    });

    it("injects hatch patterns for 4- and 8-digit hex colors", async () => {
        const pyodide = createPyodideMock("https://cdn.example.com/assets/");
        mocks.loadPyodideSpy.mockResolvedValue(pyodide);
        mocks.loadPackageSpy.mockResolvedValue(undefined);
        mocks.runPythonAsyncSpy.mockResolvedValue(undefined);
        mocks.runPythonSpy.mockResolvedValue([
            '<svg><path fill="url(#doenet-hatch-horizontal-2361626364)"/><path fill="url(#doenet-hatch-vertical-233131323233333434)"/></svg>',
            "",
        ]);

        const { PreFigureCompiler } = await import("../src/worker/compiler");
        const compiler = new PreFigureCompiler();

        await compiler.init();
        const result = await compiler.compile("svg", "<diagram/>");

        expect(result.svg).toContain(
            '<pattern id="doenet-hatch-horizontal-2361626364"',
        );
        expect(result.svg).toContain('stroke="#abcd"');
        expect(result.svg).toContain(
            '<pattern id="doenet-hatch-vertical-233131323233333434"',
        );
        expect(result.svg).toContain('stroke="#11223344"');
    });

    it("injects hatch patterns for named fill colors", async () => {
        const pyodide = createPyodideMock("https://cdn.example.com/assets/");
        mocks.loadPyodideSpy.mockResolvedValue(pyodide);
        mocks.loadPackageSpy.mockResolvedValue(undefined);
        mocks.runPythonAsyncSpy.mockResolvedValue(undefined);
        mocks.runPythonSpy.mockResolvedValue([
            '<svg><path fill="url(#doenet-hatch-crosshatch-626c61636b)"/></svg>',
            "",
        ]);

        const { PreFigureCompiler } = await import("../src/worker/compiler");
        const compiler = new PreFigureCompiler();

        await compiler.init();
        const result = await compiler.compile("svg", "<diagram/>");

        expect(result.svg).toContain(
            '<pattern id="doenet-hatch-crosshatch-626c61636b"',
        );
        expect(result.svg).toContain('stroke="black"');
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
