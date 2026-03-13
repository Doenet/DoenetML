import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
    return {
        initSpy: vi.fn(async () => {}),
        compileSpy: vi.fn(async () => ({
            svg: "<svg/>",
            annotations: "<annotations/>",
        })),
        wrapSpy: vi.fn(),
    };
});

vi.mock("comlink", () => {
    mocks.wrapSpy.mockImplementation(() => ({
        init: mocks.initSpy,
        compile: mocks.compileSpy,
    }));

    return {
        wrap: mocks.wrapSpy,
    };
});

vi.mock("../src/worker?worker&inline", () => ({
    default: class MockWorker {
        // Mock constructor intentionally empty; Comlink.wrap is mocked.
    },
}));

vi.mock("../src/worker/compiler", () => ({
    PREFIG_WHEEL_FILENAME: "prefig-test.whl",
}));

describe("@doenet/prefigure API", () => {
    beforeEach(() => {
        vi.resetModules();
        mocks.initSpy.mockClear();
        mocks.compileSpy.mockClear();
        mocks.wrapSpy.mockClear();
    });

    it("returns an assets URL for default index path", async () => {
        const mod = await import("../src/index");
        const url = mod.defaultPrefigureIndexUrl();

        expect(url.endsWith("/assets/")).toBe(true);
    });

    it("initializes at most once for repeated same URL", async () => {
        const mod = await import("../src/index");

        await mod.initPrefigure("https://cdn.example.com/prefigure-assets/");
        await mod.initPrefigure("https://cdn.example.com/prefigure-assets/");

        expect(mocks.wrapSpy).toHaveBeenCalledTimes(1);
        expect(mocks.initSpy).toHaveBeenCalledTimes(1);
    });

    it("throws when reinitialized with a different indexURL", async () => {
        const mod = await import("../src/index");

        await mod.initPrefigure("https://cdn.example.com/assets-a/");

        await expect(
            mod.initPrefigure("https://cdn.example.com/assets-b/"),
        ).rejects.toThrow(/already initialized with a different indexURL/i);
    });

    it("compilePrefigure delegates to worker compile", async () => {
        const mod = await import("../src/index");

        const result = await mod.compilePrefigure("<diagram />");

        expect(mocks.compileSpy).toHaveBeenCalledWith("svg", "<diagram />");
        expect(result).toEqual({
            svg: "<svg/>",
            annotationsXml: "<annotations/>",
        });
    });
});
