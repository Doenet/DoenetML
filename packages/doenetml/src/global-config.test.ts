import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Unit coverage for the host-config adoption in global-config.ts: the module
// adopts a `window.doenetGlobalConfig` a host created before it evaluated
// (same identity, defaults filled in only where a key is absent), and
// `hostProvidedWorkerUrl` records whether the host chose the worker URL
// itself — which is what makes the worker resolution in
// `doenetml-external-worker.ts` and the version-pinning re-point in
// `@doenet/standalone` leave that choice in force.
//
// The module works through window/globalThis at evaluation time, so each test
// resets the module registry and evaluates it fresh against a controlled
// global.

/** Evaluate global-config.ts fresh, with `existing` pre-set (or absent). */
async function importGlobalConfig(existing?: object) {
    vi.resetModules();
    delete (globalThis as any).doenetGlobalConfig;
    if (existing !== undefined) {
        (globalThis as any).doenetGlobalConfig = existing;
    }
    return await import("./global-config");
}

describe("global-config adoption", () => {
    beforeEach(() => {
        // global-config.ts aliases `window` to `globalThis` when absent (the
        // node test environment); make the alias explicit so the assertions
        // below can read the same object the module writes.
        (globalThis as any).window = globalThis;
    });
    afterEach(() => {
        delete (globalThis as any).doenetGlobalConfig;
    });

    it("creates a fresh config with a default worker URL when none exists", async () => {
        const { doenetGlobalConfig, hostProvidedWorkerUrl } =
            await importGlobalConfig();
        expect(hostProvidedWorkerUrl).toBe(false);
        expect(typeof doenetGlobalConfig.doenetWorkerUrl).toBe("string");
        expect((globalThis as any).doenetGlobalConfig).toBe(doenetGlobalConfig);
    });

    it("adopts a host-created object: same identity, host keys intact, defaults filled", async () => {
        const hook = () => {};
        const existing: Record<string, unknown> = {
            coreBootMaxAttempts: 1,
            __doenetTestCoreInitHook: hook,
        };
        const { doenetGlobalConfig, hostProvidedWorkerUrl } =
            await importGlobalConfig(existing);
        expect(doenetGlobalConfig).toBe(existing);
        // Host-set keys survive the defaults-filling untouched...
        expect(doenetGlobalConfig.coreBootMaxAttempts).toBe(1);
        expect(doenetGlobalConfig.__doenetTestCoreInitHook).toBe(hook);
        // ...and the one default is only filled because it was absent.
        expect(hostProvidedWorkerUrl).toBe(false);
        expect(typeof doenetGlobalConfig.doenetWorkerUrl).toBe("string");
    });

    it("keeps a host-chosen worker URL and reports it as host-provided", async () => {
        const { doenetGlobalConfig, hostProvidedWorkerUrl } =
            await importGlobalConfig({
                doenetWorkerUrl: "https://host.example/my-worker/index.js",
            });
        expect(hostProvidedWorkerUrl).toBe(true);
        expect(doenetGlobalConfig.doenetWorkerUrl).toBe(
            "https://host.example/my-worker/index.js",
        );
    });
});
