import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, describe, expect, it } from "vitest";
import { verifyWheelSync } from "../scripts/verify-wheel-sync.ts";

const tempDirs: string[] = [];

function makeTempDir() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "prefigure-wheel-sync-"));
    tempDirs.push(dir);
    return dir;
}

function writeCompilerWithWheel(compilerPath: string, wheelFilename: string) {
    const versionMatch = wheelFilename.match(/^prefig-([^-]+)-/);
    if (!versionMatch) {
        throw new Error(`Invalid wheel filename: ${wheelFilename}`);
    }
    const version = versionMatch[1];

    fs.mkdirSync(path.dirname(compilerPath), { recursive: true });
    fs.writeFileSync(
        compilerPath,
        `export const PREFIG_VERSION = "${version}";\n` +
            `export const PREFIG_WHEEL_FILENAME = "${wheelFilename}";\n`,
    );
}

afterEach(() => {
    for (const dir of tempDirs.splice(0, tempDirs.length)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});

describe("verifyWheelSync", () => {
    it("passes when compiler and packaged wheel match", () => {
        const root = makeTempDir();
        const compilerPath = path.join(root, "compiler.ts");
        const pyodidePackagesDir = path.join(root, "pyodide_packages");

        writeCompilerWithWheel(compilerPath, "prefig-0.5.11-py3-none-any.whl");
        fs.mkdirSync(pyodidePackagesDir, { recursive: true });
        fs.writeFileSync(
            path.join(pyodidePackagesDir, "prefig-0.5.11-py3-none-any.whl"),
            "",
        );

        expect(verifyWheelSync({ compilerPath, pyodidePackagesDir })).toBe(
            "prefig-0.5.11-py3-none-any.whl",
        );
    });

    it("fails when wheel versions differ", () => {
        const root = makeTempDir();
        const compilerPath = path.join(root, "compiler.ts");
        const pyodidePackagesDir = path.join(root, "pyodide_packages");

        writeCompilerWithWheel(compilerPath, "prefig-0.5.11-py3-none-any.whl");
        fs.mkdirSync(pyodidePackagesDir, { recursive: true });
        fs.writeFileSync(
            path.join(pyodidePackagesDir, "prefig-0.5.10-py3-none-any.whl"),
            "",
        );

        expect(() =>
            verifyWheelSync({ compilerPath, pyodidePackagesDir }),
        ).toThrow(/Wheel mismatch:/);
    });

    it("fails when multiple prefig wheels are present", () => {
        const root = makeTempDir();
        const compilerPath = path.join(root, "compiler.ts");
        const pyodidePackagesDir = path.join(root, "pyodide_packages");

        writeCompilerWithWheel(compilerPath, "prefig-0.5.11-py3-none-any.whl");
        fs.mkdirSync(pyodidePackagesDir, { recursive: true });
        fs.writeFileSync(
            path.join(pyodidePackagesDir, "prefig-0.5.11-py3-none-any.whl"),
            "",
        );
        fs.writeFileSync(
            path.join(pyodidePackagesDir, "prefig-0.5.10-py3-none-any.whl"),
            "",
        );

        expect(() =>
            verifyWheelSync({ compilerPath, pyodidePackagesDir }),
        ).toThrow(/Multiple prefig wheels/);
    });
});
