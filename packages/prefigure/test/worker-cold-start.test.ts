import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
    return {
        exposeSpy: vi.fn(),
        compilerCtorSpy: vi.fn(),
        initSpy: vi.fn(
            async (_options: { indexURL?: string } = {}) => undefined,
        ),
        compileSpy: vi.fn(
            async (_mode: "svg" | "tactile", _source: string) => ({
                svg: "<svg />",
                annotations: "<annotations />",
            }),
        ),
    };
});

vi.mock("comlink", () => ({
    expose: mocks.exposeSpy,
}));

vi.mock("../src/worker/compiler", async () => {
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

describe("Dedicated worker cold-start bootstrap", () => {
    beforeEach(() => {
        vi.resetModules();
        mocks.exposeSpy.mockClear();
        mocks.compilerCtorSpy.mockClear();
        mocks.initSpy.mockClear();
        mocks.compileSpy.mockClear();
    });

    it("wires compiler methods through worker API", async () => {
        const mod = await import("../src/worker/index");

        expect(mocks.exposeSpy).toHaveBeenCalledTimes(1);
        expect(mocks.compilerCtorSpy).toHaveBeenCalledTimes(1);

        await mod.api.init({ indexURL: "https://cdn.example.com/assets/" });
        expect(mocks.initSpy).toHaveBeenCalledTimes(1);

        const result = await mod.api.compile("svg", "<diagram />");
        expect(result).toEqual({
            svg: "<svg />",
            annotations: "<annotations />",
        });
        expect(mocks.compileSpy).toHaveBeenCalledWith("svg", "<diagram />");
    });
});
