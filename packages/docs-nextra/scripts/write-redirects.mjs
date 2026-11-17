/**
 * Write the redirect pages and the site-wide 404 page of docs.doenet.org.
 *
 * The deploy (`.github/workflows/gh-pages-docs.yml`) serves each line's docs
 * at a path named for the line: `/0.7/`, `/0.8/`, …. The versioned URLs are
 * the canonical ones, and are what DoenetML itself links to. This script, run
 * on the assembled site just before it is published, adds what GitHub Pages
 * cannot do on its own, since it has no server-side redirects:
 *
 *   - **The root redirects to the current release.** For every page of the
 *     release build it writes a small page at the same path under the root
 *     that sends the reader on: `/reference/math` → `/0.7/reference/math`,
 *     keeping the query and hash. Old links, and DoenetML releases that link
 *     to the root, keep working, and change target when the release does.
 *   - **Aliases**, such as `/dev` → `/0.8`, get the same treatment.
 *   - **A 404 page at the root.** GitHub Pages answers a missing path with the
 *     site's root `404.html`, under every version's path as well. This one
 *     forwards a path that is under no version to the current release (so a
 *     root URL the release has no page for still lands in the docs), and
 *     otherwise says which version lacks the page and links to the same page
 *     in the versions that have it.
 *
 * Usage (from the deploy job):
 *
 *   node write-redirects.mjs --site site --versions "$DOCS_VERSIONS" \
 *       --root /0.7 --alias /dev=/0.8 --reserve /demos
 *
 * Plain Node with no dependencies, so the deploy job can run it from a sparse
 * checkout. Tested in `test/write-redirects.test.ts`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * @typedef {object} Options
 * @property {string} site The assembled site's directory.
 * @property {{ label: string, path: string }[]} versions `DOCS_VERSIONS`.
 * @property {string} root The version path the root redirects to.
 * @property {Record<string, string>} aliases Path → version path to redirect.
 * @property {string[]} reserved Top-level paths that are neither (`/demos`).
 */

/**
 * Every `.html` page in `dir`, as paths relative to it with `/` separators,
 * leaving out its own `404.html` and Next's and Pagefind's asset folders.
 *
 * @param {string} dir
 * @returns {string[]}
 */
export function listPages(dir) {
    const pages = [];
    const walk = (rel) => {
        for (const entry of fs.readdirSync(path.join(dir, rel), {
            withFileTypes: true,
        })) {
            const relPath = rel ? `${rel}/${entry.name}` : entry.name;
            if (entry.isDirectory()) {
                if (relPath === "_next" || relPath === "_pagefind") {
                    continue;
                }
                walk(relPath);
            } else if (entry.name.endsWith(".html") && relPath !== "404.html") {
                pages.push(relPath);
            }
        }
    };
    walk("");
    return pages.sort();
}

/**
 * The URL a page file is served at under `base`: `reference/math.html` →
 * `/0.7/reference/math`, `index.html` → `/0.7/`, `a/index.html` → `/0.7/a/`.
 *
 * @param {string} base `""` or `/0.7`, …
 * @param {string} page a path from `listPages`
 * @returns {string}
 */
export function pageUrl(base, page) {
    let rest = page.replace(/\.html$/, "");
    if (rest === "index") {
        rest = "";
    } else if (rest.endsWith("/index")) {
        rest = rest.slice(0, -"index".length);
    }
    return `${base}/${rest}`;
}

/** @param {string} s */
function escapeHtml(s) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/** JSON that is safe inside a `<script>` element. @param {unknown} value */
function scriptJson(value) {
    return JSON.stringify(value).replace(/</g, "\\u003c");
}

/**
 * A page that immediately sends the reader to `target`, keeping the query
 * and hash when scripts run, and falling back to a meta refresh and a link.
 *
 * @param {string} target a root-relative URL, e.g. `/0.7/reference/math`
 * @returns {string}
 */
export function redirectPage(target) {
    const href = escapeHtml(target);
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting to ${href}</title>
<link rel="canonical" href="${href}">
<script>location.replace(${scriptJson(target)} + location.search + location.hash);</script>
<meta http-equiv="refresh" content="0; url=${href}">
</head>
<body>
<p>This page has moved to <a href="${href}">${href}</a>.</p>
</body>
</html>
`;
}

/**
 * The site-wide 404 page. See the file comment for what it does.
 *
 * @param {{
 *   versions: { label: string, path: string }[],
 *   root: string,
 *   aliases: Record<string, string>,
 *   reserved: string[],
 * }} config
 * @returns {string}
 */
export function notFoundPage({ versions, root, aliases, reserved }) {
    const homes = versions
        .map(
            (v) =>
                `<li><a href="${escapeHtml(v.path)}/">Docs for DoenetML ${escapeHtml(v.label)}</a></li>`,
        )
        .join("\n");
    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Page not found – Doenet Documentation</title>
<style>
:root { color-scheme: light dark; --bg: #fafafa; --fg: #111; --muted: #555; --link: #0058c4; }
@media (prefers-color-scheme: dark) { :root { --bg: #111; --fg: #eee; --muted: #aaa; --link: #6cb2ff; } }
body { margin: 0; background: var(--bg); color: var(--fg); font: 16px/1.5 system-ui, sans-serif; }
main { max-width: 40rem; margin: 0 auto; padding: 3rem 16px; }
h1 { font-size: 1.75rem; margin: 0 0 1rem; }
p { color: var(--muted); }
a { color: var(--link); }
</style>
<script>
(function () {
    var config = ${scriptJson({ versions, root, aliases, reserved })};
    var pathname = location.pathname, rest = location.search + location.hash;
    function under(base) {
        return pathname === base || pathname.indexOf(base + "/") === 0;
    }
    for (var from in config.aliases) {
        if (under(from)) {
            location.replace(config.aliases[from] + pathname.slice(from.length) + rest);
            return;
        }
    }
    var current = null;
    for (var i = 0; i < config.versions.length; i++) {
        if (under(config.versions[i].path)) current = config.versions[i];
    }
    if (!current) {
        if (!config.reserved.some(under)) {
            // A path under no version: look for it in the current release.
            location.replace(config.root + pathname + rest);
        }
        return;
    }
    window.__docsNotFound = { current: current, versions: config.versions, page: pathname.slice(current.path.length) || "/" };
})();
</script>
</head>
<body>
<main>
<h1>Page not found</h1>
<p id="what">There is no page at this address.</p>
<ul id="elsewhere"></ul>
<p>Go to the home page of:</p>
<ul>
${homes}
</ul>
</main>
<script>
(function () {
    var info = window.__docsNotFound;
    if (!info) return;
    var page = info.page.replace(/\\/+$/, "") || "/";
    document.getElementById("what").textContent =
        "The docs for DoenetML " + info.current.label + " have no page at this address.";
    var list = document.getElementById("elsewhere");
    function exists(url) {
        return fetch(url, { method: "HEAD" }).then(function (r) { return r.ok; }, function () { return false; });
    }
    // The same page without a trailing slash, in this version: go there.
    if (page !== info.page && page !== "/") {
        exists(info.current.path + page).then(function (ok) {
            if (ok) location.replace(info.current.path + page + location.search + location.hash);
        });
    }
    if (page === "/") return;
    info.versions.forEach(function (v) {
        if (v.path === info.current.path) return;
        var url = v.path + page;
        exists(url).then(function (ok) {
            if (!ok) return;
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = url + location.search + location.hash;
            a.textContent = "This page in the docs for DoenetML " + v.label;
            li.appendChild(a);
            list.appendChild(li);
        });
    });
})();
</script>
</body>
</html>
`;
}

/**
 * Write a redirect page under `fromBase` in `siteDir` for every page under
 * `toBase`. Refuses to overwrite anything.
 *
 * @param {string} siteDir
 * @param {string} fromBase `""` for the root, or `/dev`, …
 * @param {string} toBase `/0.7`, …
 * @param {string[]} reserved top-level paths no redirect may take
 * @returns {number} how many pages were written
 */
export function writeRedirectPages(siteDir, fromBase, toBase, reserved) {
    const pages = listPages(path.join(siteDir, toBase));
    if (pages.length === 0) {
        throw new Error(`No pages found under ${toBase} in ${siteDir}.`);
    }
    for (const page of pages) {
        const served = pageUrl(fromBase, page);
        if (reserved.some((r) => served === r || served.startsWith(`${r}/`))) {
            throw new Error(
                `A redirect at ${served} would take the place of ${reserved.join(", ")}.`,
            );
        }
        const dest = path.join(siteDir, fromBase, page);
        if (fs.existsSync(dest)) {
            throw new Error(`Refusing to overwrite ${dest}.`);
        }
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, redirectPage(pageUrl(toBase, page)));
    }
    return pages.length;
}

/**
 * Parse `--name value` pairs; `--alias` and `--reserve` may repeat.
 *
 * @param {string[]} argv
 * @returns {Options}
 */
export function parseArgs(argv) {
    /** @type {Partial<Options> & Pick<Options, "aliases" | "reserved">} */
    const args = { aliases: {}, reserved: [] };
    for (let i = 0; i < argv.length; i += 2) {
        const [name, value] = [argv[i], argv[i + 1]];
        if (value === undefined) {
            throw new Error(`Missing a value after ${name}.`);
        }
        if (name === "--site") args.site = value;
        else if (name === "--versions") args.versions = JSON.parse(value);
        else if (name === "--root") args.root = value;
        else if (name === "--reserve") args.reserved.push(value);
        else if (name === "--alias") {
            const [from, to] = value.split("=");
            if (!from || !to) {
                throw new Error(`--alias takes from=to, not ${value}.`);
            }
            args.aliases[from] = to;
        } else {
            throw new Error(`Unknown option ${name}.`);
        }
    }
    for (const required of ["site", "versions", "root"]) {
        if (args[required] === undefined) {
            throw new Error(`--${required} is required.`);
        }
    }
    return /** @type {Options} */ (args);
}

/**
 * Write everything into the assembled site at `site`.
 *
 * @param {Options} options
 * @returns {Record<string, number>} redirect pages written, by path
 */
export function writeRedirects({ site, versions, root, aliases, reserved }) {
    const paths = versions.map((v) => v.path);
    if (!paths.includes(root)) {
        throw new Error(`--root ${root} is not a version's path.`);
    }
    for (const [from, to] of Object.entries(aliases)) {
        if (!paths.includes(to)) {
            throw new Error(
                `--alias ${from}=${to}: ${to} is not a version's path.`,
            );
        }
    }
    const taken = [...paths, ...Object.keys(aliases), ...reserved];
    const counts = { "": writeRedirectPages(site, "", root, taken) };
    for (const [from, to] of Object.entries(aliases)) {
        counts[from] = writeRedirectPages(
            site,
            from,
            to,
            taken.filter((t) => t !== from),
        );
    }
    const notFound = path.join(site, "404.html");
    if (fs.existsSync(notFound)) {
        throw new Error(`Refusing to overwrite ${notFound}.`);
    }
    fs.writeFileSync(
        notFound,
        notFoundPage({ versions, root, aliases, reserved }),
    );
    return counts;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const counts = writeRedirects(parseArgs(process.argv.slice(2)));
    for (const [from, n] of Object.entries(counts)) {
        console.log(`Wrote ${n} redirect pages under ${from || "/"}.`);
    }
    console.log("Wrote 404.html.");
}
