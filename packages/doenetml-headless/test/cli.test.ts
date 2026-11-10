import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { execFile } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { data_format_version } from "@doenet/utils";
import { setInput, submit } from "../src";
import { stateAfter } from "./helpers";

// These run the built CLI (`npm run test` builds the package first) in a
// separate plain Node process, with no hint of where the WASM is: what a host
// that installed the package gets.
const CLI = path.resolve(import.meta.dirname, "../dist/cli.js");

function childEnv() {
    const env = { ...process.env };
    delete env.DOENET_HEADLESS_RESOLVER_WASM;
    return env;
}

async function runCli(args: string[]) {
    try {
        const { stdout, stderr } = await promisify(execFile)(
            process.execPath,
            [CLI, ...args],
            { env: childEnv(), timeout: 60000 },
        );
        return { code: 0, stdout, stderr };
    } catch (e: any) {
        if (e.killed) {
            throw Error("The CLI did not exit by itself");
        }
        return { code: e.code as number, stdout: e.stdout, stderr: e.stderr };
    }
}

const doenetML = `<selectFromSequence name="n" from="1" to="3" /><number name="m">$n</number>
<answer name="a">$n</answer>
<p><answer>x</answer></p>
`;

let dir: string;
let docFile: string;
let stateFile: string;

beforeAll(async () => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "doenet-headless-cli-"));
    docFile = path.join(dir, "doc.doenet");
    fs.writeFileSync(docFile, doenetML);
    const state = await stateAfter(
        doenetML,
        async (core) => {
            const n = await core.resolvePath("m");
            if (n.status !== "resolved") throw Error("n");
            const { value } = await core.readProperties(
                n.component.componentIdx,
                ["value"],
            );
            await setInput(core, { answer: "a", position: 1 }, String(value));
            await submit(core, "a");
        },
        { variantIndex: 2 },
    );
    stateFile = path.join(dir, "state.json");
    fs.writeFileSync(stateFile, JSON.stringify(state));
});

afterAll(() => {
    fs.rmSync(dir, { recursive: true, force: true });
});

describe("doenet-headless CLI", () => {
    it("checks a file, as text", async () => {
        const { code, stdout } = await runCli(["check", docFile]);
        expect(code).toBe(0);
        expect(stdout).toContain(
            "variant 1 of 3, 2 answers, 1 without a stable key",
        );
        expect(stdout).toContain("  a: mathInput");
        expect(stdout).toContain("(no stable key, line 3, column 4)");
        expect(stdout).toMatch(
            /Diagnostics: 0 errors, 0 warnings, 0 infos, \d+ accessibility/,
        );
    });

    it("checks a file, as JSON, and exits 1 on an error", async () => {
        const badFile = path.join(dir, "bad.doenet");
        fs.writeFileSync(badFile, "<bogus/>");
        const { code, stdout } = await runCli(["check", badFile, "--json"]);
        expect(code).toBe(1);
        const result = JSON.parse(stdout);
        expect(result.diagnostics.some((d: any) => d.type === "error")).toBe(
            true,
        );
        expect(result.numVariants).toBe(1);
    });

    it("grades a saved state, as text and as JSON", async () => {
        const text = await runCli([
            "grade",
            docFile,
            "--variant",
            "2",
            "--state",
            stateFile,
        ]);
        expect(text.code).toBe(0);
        expect(text.stdout).toContain(
            "variant 2 of 3, state saved at a submission",
        );
        expect(text.stdout).toContain(
            "  a: credit 1 (stored: 1, 1 submission)",
        );

        const json = await runCli([
            "grade",
            docFile,
            "--variant",
            "2",
            "--state",
            stateFile,
            "--json",
        ]);
        expect(json.code).toBe(0);
        const result = JSON.parse(json.stdout);
        expect(result.answers[0]).toMatchObject({
            stableKey: "a",
            credit: 1,
            stored: { creditAchieved: 1, numSubmissions: 1 },
        });
        expect(result.savedState.dataFormatVersion).toBe(data_format_version);
    });

    it("exits 3 when it refuses the state", async () => {
        const { code, stderr } = await runCli([
            "grade",
            docFile,
            "--variant",
            "3",
            "--state",
            stateFile,
        ]);
        expect(code).toBe(3);
        expect(stderr).toContain("Refused (variantMismatch)");

        const oldFile = path.join(dir, "old.json");
        fs.writeFileSync(
            oldFile,
            JSON.stringify({
                ...JSON.parse(fs.readFileSync(stateFile, "utf8")),
                data_format_version: "0.7.0",
            }),
        );
        const json = await runCli([
            "grade",
            docFile,
            "--variant",
            "2",
            "--state",
            oldFile,
            "--json",
        ]);
        expect(json.code).toBe(3);
        expect(JSON.parse(json.stderr).refused).toBe("dataFormatVersion");
    });

    it("exits 2 on a usage or file problem", async () => {
        expect((await runCli([])).code).toBe(2);
        expect((await runCli(["grade", docFile])).code).toBe(2);
        expect((await runCli(["check", docFile, "--variant", "0"])).code).toBe(
            2,
        );
        expect((await runCli(["check", path.join(dir, "missing")])).code).toBe(
            2,
        );
        const help = await runCli(["--help"]);
        expect(help.code).toBe(0);
        expect(help.stdout).toContain("Usage:");
    });
});
