/**
 * Covers `scripts/write-redirects.mjs`, which the deploy runs on the assembled
 * docs site: the redirect pages that send root (and alias) URLs to a
 * versioned path, and the site-wide 404 page.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
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

    it("refuses a redirect that would take a reserved path", () => {
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

    it("refuses a redirect that would take a version's path", () => {
        const versionPath = site([
            "0.7/index.html",
            "0.7/0.8/index.html",
            "0.8/index.html",
        ]);
        expect(() =>
            writeRedirects({
                site: versionPath,
                versions: VERSIONS,
                root: "/0.7",
                aliases: {},
                reserved: [],
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

    /**
     * Run the page's two inline scripts against a stub `location`, DOM and
     * `fetch`, where `existing` lists the URLs a `HEAD` request finds.
     */
    async function visit(url: string, existing: string[] = []) {
        const html = notFoundPage({
            versions: VERSIONS,
            root: "/0.7",
            aliases: { "/dev": "/0.8" },
            reserved: ["/demos"],
        });
        const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
        expect(scripts).toHaveLength(2);

        const u = new URL(url, "https://docs.example");
        const replaced: string[] = [];
        const elements: Record<string, any> = {
            what: { textContent: "" },
            elsewhere: { children: [] as any[] },
        };
        elements.elsewhere.appendChild = (li: any) =>
            elements.elsewhere.children.push(li);
        const context: Record<string, any> = {
            location: {
                pathname: u.pathname,
                search: u.search,
                hash: u.hash,
                replace: (to: string) => replaced.push(to),
            },
            document: {
                getElementById: (id: string) => elements[id],
                createElement: () => {
                    const element: Record<string, any> = {};
                    element.appendChild = (child: any) =>
                        (element.child = child);
                    return element;
                },
            },
            fetch: async (to: string, init: { method: string }) => {
                expect(init.method).toBe("HEAD");
                return { ok: existing.includes(to) };
            },
        };
        context.window = context;
        vm.createContext(context);
        for (const [, code] of scripts) vm.runInContext(code, context);
        await new Promise((resolve) => setTimeout(resolve, 0));

        return {
            replaced,
            message: elements.what.textContent as string,
            links: elements.elsewhere.children.map((li: any) => ({
                href: li.child.href,
                text: li.child.textContent,
            })),
        };
    }

    it("forwards an alias to its version, keeping the query and hash", async () => {
        const { replaced } = await visit("/dev/reference/col?q=1#h");
        expect(replaced).toEqual(["/0.8/reference/col?q=1#h"]);
    });

    it("forwards a path under no version to the current release", async () => {
        const { replaced } = await visit("/reference/col?q=1#h");
        expect(replaced).toEqual(["/0.7/reference/col?q=1#h"]);
    });

    it("leaves a reserved path alone", async () => {
        const { replaced, message } = await visit("/demos/x");
        expect(replaced).toEqual([]);
        expect(message).toBe("");
    });

    it("says which version lacks the page and links to the others' copy", async () => {
        const { replaced, message, links } = await visit(
            "/0.7/reference/col?q=1#h",
            ["/0.8/reference/col"],
        );
        expect(replaced).toEqual([]);
        expect(message).toBe(
            "The docs for DoenetML 0.7 have no page at this address.",
        );
        expect(links).toEqual([
            {
                href: "/0.8/reference/col?q=1#h",
                text: "This page in the docs for DoenetML 0.8 (in development)",
            },
        ]);
    });

    it("goes to the page without its trailing slash when that exists", async () => {
        const { replaced } = await visit("/0.7/reference/math/?q=1#h", [
            "/0.7/reference/math",
        ]);
        expect(replaced).toEqual(["/0.7/reference/math?q=1#h"]);
    });

    it("links nothing when no version has the page", async () => {
        const { replaced, links } = await visit("/0.8/nosuch/");
        expect(replaced).toEqual([]);
        expect(links).toEqual([]);
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
