/**
 * Covers how a docs build learns which deployed version it is
 * (`docs-versions.mjs`, read from `DOCS_VERSIONS` and `DOCS_BASE_PATH`), and
 * how the version switcher maps a page to the same page in another version.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { pageUrlOn } from "../components/version-switcher";

const VERSIONS = JSON.stringify([
    { label: "0.7", path: "" },
    { label: "0.8 (in development)", path: "/dev/", prerelease: true },
]);

/** Import `docs-versions.mjs` afresh with the given environment. */
async function load(env: { DOCS_VERSIONS?: string; DOCS_BASE_PATH?: string }) {
    vi.resetModules();
    vi.stubEnv("DOCS_VERSIONS", env.DOCS_VERSIONS ?? "");
    vi.stubEnv("DOCS_BASE_PATH", env.DOCS_BASE_PATH ?? "");
    return await import("../docs-versions.mjs");
}

afterEach(() => {
    vi.unstubAllEnvs();
});

describe("docs-versions", () => {
    it("builds an unversioned site at the root when nothing is set", async () => {
        const m = await load({});
        expect(m.basePath).toBe("");
        expect(m.docsVersions).toEqual([]);
        expect(m.currentVersion).toBeUndefined();
    });

    it("normalizes base paths to a leading slash and no trailing one", async () => {
        const { normalizeBasePath } = await load({});
        expect(normalizeBasePath(undefined)).toBe("");
        expect(normalizeBasePath("")).toBe("");
        expect(normalizeBasePath("/")).toBe("");
        expect(normalizeBasePath("dev")).toBe("/dev");
        expect(normalizeBasePath("/dev/")).toBe("/dev");
        expect(normalizeBasePath("/a/b/")).toBe("/a/b");
    });

    it("finds this build's entry by its base path", async () => {
        const dev = await load({
            DOCS_VERSIONS: VERSIONS,
            DOCS_BASE_PATH: "/dev",
        });
        expect(dev.basePath).toBe("/dev");
        expect(dev.docsVersions.map((v) => v.path)).toEqual(["", "/dev"]);
        expect(dev.currentVersion).toEqual({
            label: "0.8 (in development)",
            path: "/dev",
            prerelease: true,
        });

        const release = await load({ DOCS_VERSIONS: VERSIONS });
        expect(release.currentVersion).toEqual({
            label: "0.7",
            path: "",
            prerelease: false,
        });
    });

    it("fails the build when the base path is not a listed version", async () => {
        await expect(
            load({ DOCS_VERSIONS: VERSIONS, DOCS_BASE_PATH: "/0.6" }),
        ).rejects.toThrow(/not the path of any entry/);
    });

    it("fails the build on a malformed DOCS_VERSIONS", async () => {
        await expect(load({ DOCS_VERSIONS: "{" })).rejects.toThrow(
            /not valid JSON/,
        );
        await expect(load({ DOCS_VERSIONS: "{}" })).rejects.toThrow(
            /must be a JSON array/,
        );
        await expect(
            load({ DOCS_VERSIONS: JSON.stringify([{ label: "0.7" }]) }),
        ).rejects.toThrow(/DOCS_VERSIONS\[0\]/);
    });
});

describe("pageUrlOn", () => {
    it("puts the page under the other version's base path", () => {
        expect(pageUrlOn("/dev", "/reference/math")).toBe(
            "/dev/reference/math",
        );
        expect(pageUrlOn("", "/reference/math")).toBe("/reference/math");
    });

    it("maps the home page to each version's home", () => {
        expect(pageUrlOn("/dev", "/")).toBe("/dev/");
        expect(pageUrlOn("", "/")).toBe("/");
    });

    it("drops a trailing slash from a page path", () => {
        expect(pageUrlOn("/dev", "/reference/")).toBe("/dev/reference");
    });
});
