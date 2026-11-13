import { afterEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { readResolverWasm, RESOLVER_WASM_ENV } from "../src/resolverWasm";

// The built package reading its own copy with no override is in
// `built-package.test.ts`; these are the override.
describe("readResolverWasm", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("reads the file the environment variable names", async () => {
        const dir = fs.mkdtempSync(path.join(os.tmpdir(), "doenet-wasm-"));
        try {
            const file = path.join(dir, "resolver.wasm");
            fs.writeFileSync(file, Uint8Array.from([0, 97, 115, 109]));
            vi.stubEnv(RESOLVER_WASM_ENV, file);
            expect([...(await readResolverWasm())]).toEqual([0, 97, 115, 109]);
        } finally {
            fs.rmSync(dir, { recursive: true, force: true });
        }
    });

    it("says where it looked, and why, when it cannot read it", async () => {
        const missing = path.join(os.tmpdir(), "no-such-dir", "resolver.wasm");
        vi.stubEnv(RESOLVER_WASM_ENV, missing);
        await expect(readResolverWasm()).rejects.toThrow(
            `Could not read the DoenetML resolver WASM at ${missing} (from ${RESOLVER_WASM_ENV})`,
        );
    });
});
