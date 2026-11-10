import { describe, expect, it } from "vitest";
import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";

// The published package's own `dist/`, imported from a plain Node process with
// no bundler, no vitest and no hint where the resolver WASM is: the WASM must
// be found beside the code, and the process must exit by itself afterwards
// (nothing left running, such as a save-throttle timer).
const DIST = path.resolve(import.meta.dirname, "../dist");

describe("the built package", () => {
    it("ships the WASM as a file, not inlined, and a manifest without the private flag", () => {
        expect(
            fs.statSync(path.join(DIST, "lib_doenetml_worker_bg.wasm")).size,
        ).toBeGreaterThan(1_000_000);
        for (const file of fs.readdirSync(DIST)) {
            if (file.endsWith(".js")) {
                const code = fs.readFileSync(path.join(DIST, file), "utf8");
                expect(code, file).not.toContain("data:application/wasm");
            }
        }
        const manifest = JSON.parse(
            fs.readFileSync(path.join(DIST, "package.json"), "utf8"),
        );
        expect(manifest.private).toBeUndefined();
        expect(manifest.bin).toEqual({ "doenet-headless": "./cli.js" });
        expect(manifest.peerDependencies).toEqual({
            "math-expressions": "^3.0.0-alpha.1",
        });
    });

    it("loads the WASM and grades in plain Node", async () => {
        const script = `
            const { createHeadlessCore, gradeState, setInput, submit } = await import(${JSON.stringify(path.join(DIST, "index.js"))});
            const doenetML = '<answer name="a">x</answer>';
            const core = await createHeadlessCore({ doenetML });
            await setInput(core, { answer: "a", position: 1 }, "x");
            await submit(core, "a");
            const state = await core.serializeState();
            await core.terminate();
            const result = await gradeState(doenetML, 1, state);
            console.log(JSON.stringify(result.answers.map((a) => a.credit)));
        `;
        const env = { ...process.env };
        delete env.DOENET_HEADLESS_RESOLVER_WASM;
        const { stdout } = await promisify(execFile)(
            process.execPath,
            ["--input-type=module", "-e", script],
            { env, timeout: 60000 },
        );
        expect(stdout.trim().split("\n").at(-1)).toBe("[1]");
    });
});
