/**
 * Covers `scripts/write-redirects.mjs`, which the deploy runs on the assembled
 * docs site: the redirect pages that send root (and alias) URLs to a
 * versioned path, and the site-wide 404 page.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
    listPages,
    notFoundPage,
    pageUrl,
    parseArgs,
    redirectPage,
    writeRedirects,
} from "../scripts/write-redirects.mjs";

const VERSIONS = [
    { label: "0.7", path: "/0.7" },
    { label: "0.8 (in development)", path: "/0.8", prerelease: true },
];

let tmp: string | undefined;

afterEach(() => {
    if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
    tmp = undefined;
});

/** A site directory holding the given files (contents irrelevant). */
function site(files: string[]): string {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "write-redirects-"));
    for (const f of files) {
        fs.mkdirSync(path.dirname(path.join(tmp, f)), { recursive: true });
        fs.writeFileSync(path.join(tmp, f), "x");
    }
    return tmp;
}

const read = (dir: string, f: string) =>
    fs.readFileSync(path.join(dir, f), "utf8");

describe("pageUrl", () => {
    it("maps a page file to the URL it is served at", () => {
        expect(pageUrl("/0.7", "index.html")).toBe("/0.7/");
        expect(pageUrl("/0.7", "reference/math.html")).toBe(
            "/0.7/reference/math",
        );
        expect(pageUrl("/0.7", "a/index.html")).toBe("/0.7/a/");
        expect(pageUrl("", "reference/math.html")).toBe("/reference/math");
        expect(pageUrl("", "index.html")).toBe("/");
    });
});

describe("listPages", () => {
    it("lists HTML pages, leaving out 404.html and asset folders", () => {
        const dir = site([
            "index.html",
            "404.html",
            "reference/math.html",
            "reference/math.txt",
            "_next/static/x.html",
            "_pagefind/y.html",
            "nested/404.html",
        ]);
        expect(listPages(dir)).toEqual([
            "index.html",
            "nested/404.html",
            "reference/math.html",
        ]);
    });
});

describe("redirectPage", () => {
    it("redirects by script (keeping query and hash), meta refresh and link", () => {
        const html = redirectPage("/0.7/reference/math");
        expect(html).toContain(
            'location.replace("/0.7/reference/math" + location.search + location.hash)',
        );
        expect(html).toContain(
            '<meta http-equiv="refresh" content="0; url=/0.7/reference/math">',
        );
        expect(html).toContain(
            '<link rel="canonical" href="/0.7/reference/math">',
        );
    });

    it("escapes the target in HTML and in the script", () => {
        const html = redirectPage('/0.7/a"b</script>');
        expect(html).not.toContain('a"b</script>');
        expect(html).toContain("a&quot;b&lt;/script&gt;");
        expect(html).toContain('"/0.7/a\\"b\\u003c/script>"');
    });
});

describe("writeRedirects", () => {
    function assembled() {
        return site([
            "0.7/index.html",
            "0.7/404.html",
            "0.7/reference/math.html",
            "0.7/_next/static/chunk.js",
            "0.8/index.html",
            "0.8/reference/math.html",
            "0.8/reference/col.html",
            "demos/index.html",
        ]);
    }

    it("redirects the root to the release and an alias to its version", () => {
        const dir = assembled();
        const counts = writeRedirects({
            site: dir,
            versions: VERSIONS,
            root: "/0.7",
            aliases: { "/dev": "/0.8" },
            reserved: ["/demos"],
        });
        expect(counts).toEqual({ "": 2, "/dev": 3 });

        expect(read(dir, "index.html")).toContain('location.replace("/0.7/"');
        expect(read(dir, "reference/math.html")).toContain(
            'location.replace("/0.7/reference/math"',
        );
        expect(fs.existsSync(path.join(dir, "reference/col.html"))).toBe(false);
        expect(read(dir, "dev/reference/col.html")).toContain(
            'location.replace("/0.8/reference/col"',
        );

        // The versions and demos are untouched.
        expect(read(dir, "0.7/reference/math.html")).toBe("x");
        expect(read(dir, "demos/index.html")).toBe("x");

        const notFound = read(dir, "404.html");
        expect(notFound).toContain('"root":"/0.7"');
        expect(notFound).toContain('"aliases":{"/dev":"/0.8"}');
        expect(notFound).toContain('href="/0.8/">Docs for DoenetML 0.8');
    });

    it("refuses to overwrite a page", () => {
        const dir = assembled();
        fs.writeFileSync(path.join(dir, "index.html"), "x");
        expect(() =>
            writeRedirects({
                site: dir,
                versions: VERSIONS,
                root: "/0.7",
                aliases: {},
                reserved: [],
            }),
        ).toThrow(/Refusing to overwrite/);
    });

    it("refuses a redirect that would take a version's or reserved path", () => {
        const dir = site([
            "0.7/index.html",
            "0.7/demos/index.html",
            "0.8/index.html",
        ]);
        expect(() =>
            writeRedirects({
                site: dir,
                versions: VERSIONS,
                root: "/0.7",
                aliases: {},
                reserved: ["/demos"],
            }),
        ).toThrow(/would take the place of/);
    });

    it("rejects a root or alias target that is not a version", () => {
        const dir = assembled();
        expect(() =>
            writeRedirects({
                site: dir,
                versions: VERSIONS,
                root: "/0.6",
                aliases: {},
                reserved: [],
            }),
        ).toThrow(/not a version's path/);
        expect(() =>
            writeRedirects({
                site: dir,
                versions: VERSIONS,
                root: "/0.7",
                aliases: { "/dev": "/0.9" },
                reserved: [],
            }),
        ).toThrow(/not a version's path/);
    });

    it("fails when the target version has no pages", () => {
        const dir = site(["0.7/404.html", "0.8/index.html"]);
        expect(() =>
            writeRedirects({
                site: dir,
                versions: VERSIONS,
                root: "/0.7",
                aliases: {},
                reserved: [],
            }),
        ).toThrow(/No pages found/);
    });
});

describe("notFoundPage", () => {
    it("links every version's home without scripts", () => {
        const html = notFoundPage({
            versions: VERSIONS,
            root: "/0.7",
            aliases: {},
            reserved: [],
        });
        expect(html).toContain('<a href="/0.7/">Docs for DoenetML 0.7</a>');
        expect(html).toContain('<meta name="robots" content="noindex">');
    });
});

describe("parseArgs", () => {
    it("reads repeated aliases and reserved paths", () => {
        expect(
            parseArgs([
                "--site",
                "site",
                "--versions",
                JSON.stringify(VERSIONS),
                "--root",
                "/0.7",
                "--alias",
                "/dev=/0.8",
                "--reserve",
                "/demos",
            ]),
        ).toEqual({
            site: "site",
            versions: VERSIONS,
            root: "/0.7",
            aliases: { "/dev": "/0.8" },
            reserved: ["/demos"],
        });
    });

    it("rejects missing values and unknown options", () => {
        expect(() => parseArgs(["--site"])).toThrow(/Missing a value/);
        expect(() => parseArgs(["--nope", "x"])).toThrow(/Unknown option/);
        expect(() => parseArgs(["--site", "s"])).toThrow(
            /--versions is required/,
        );
        expect(() =>
            parseArgs([
                "--site",
                "s",
                "--versions",
                "[]",
                "--root",
                "/0.7",
                "--alias",
                "/dev",
            ]),
        ).toThrow(/from=to/);
    });
});
