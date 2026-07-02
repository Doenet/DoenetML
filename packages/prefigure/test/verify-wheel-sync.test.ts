import fs from "fs";
import os from "os";
import path from "path";
import { afterEach, describe, expect, it } from "vitest";
import { verifyWheelSync } from "../scripts/verify-wheel-sync.ts";
import { PREFIG_WHEEL_FILENAME } from "../src/worker/compiler-metadata";

const tempDirs: string[] = [];

function makeTempDir() {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "prefigure-wheel-sync-"));
    tempDirs.push(dir);
    return dir;
}

afterEach(() => {
    for (const dir of tempDirs.splice(0, tempDirs.length)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});

describe("verifyWheelSync", () => {
    it("passes when configured and packaged wheel match", () => {
        const root = makeTempDir();
        const pyodidePackagesDir = path.join(root, "pyodide_packages");

        fs.mkdirSync(pyodidePackagesDir, { recursive: true });
        fs.writeFileSync(
            path.join(pyodidePackagesDir, PREFIG_WHEEL_FILENAME),
            "",
        );

        expect(verifyWheelSync({ pyodidePackagesDir })).toBe(
            PREFIG_WHEEL_FILENAME,
        );
    });

    it("fails when wheel versions differ", () => {
        const root = makeTempDir();
        const pyodidePackagesDir = path.join(root, "pyodide_packages");

        fs.mkdirSync(pyodidePackagesDir, { recursive: true });
        fs.writeFileSync(
            path.join(pyodidePackagesDir, "prefig-0.5.10-py3-none-any.whl"),
            "",
        );

        expect(() => verifyWheelSync({ pyodidePackagesDir })).toThrow(
            /Wheel mismatch:/,
        );
    });

    it("fails when multiple prefig wheels are present", () => {
        const root = makeTempDir();
        const pyodidePackagesDir = path.join(root, "pyodide_packages");

        fs.mkdirSync(pyodidePackagesDir, { recursive: true });
        fs.writeFileSync(
            path.join(pyodidePackagesDir, PREFIG_WHEEL_FILENAME),
            "",
        );
        fs.writeFileSync(
            path.join(pyodidePackagesDir, "prefig-0.5.10-py3-none-any.whl"),
            "",
        );

        expect(() => verifyWheelSync({ pyodidePackagesDir })).toThrow(
            /Multiple prefig wheels/,
        );
    });
});
