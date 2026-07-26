/**
 * Guards the built DoenetML language server against the two ways it has grown
 * without anyone noticing.
 *
 * The server is not only the VS Code extension's: `@doenet/codemirror` embeds
 * the built IIFE verbatim (`@doenet/lsp/language-server.js?raw`) to start it as
 * a blob worker, so every byte rides into the editor and sits on the critical
 * path before the first cursor-help request can be answered. Boot lag here has
 * surfaced before as a flaky "no help on first cursor change" in CI.
 *
 * Two checks, doing different jobs:
 *
 *  - **The message catalogs must not be here at all.** The server renders no
 *    messages — it has no locale, and #1549 is the issue for giving it one.
 *    Nothing it does needs a translation, so a catalog in this bundle is
 *    always a leak rather than a judgement call, and needs no threshold.
 *
 *    It leaked once already. `@doenet/utils` took a runtime dependency on
 *    `@doenet/i18n` so its style-contrast checks could raise coded diagnostics
 *    (#1518), and the server imports `@doenet/utils/style` for something else
 *    entirely. Tree-shaking removed the *code* — `formatEnglishDiagnostic` was
 *    nowhere in the output — and left 20 KB gzipped of FTL text behind,
 *    because `@doenet/i18n` had not declared itself side-effect-free and a
 *    bundler must therefore keep every module-level statement in any module it
 *    reaches. Declaring `"sideEffects": false` there took the bundle back to
 *    the byte. Nothing about that is obvious from either package, and the next
 *    dependency to reach the server will not announce itself either.
 *
 *  - **A size budget**, in `server-budget.json`. The catalog check only knows
 *    about one payload; the budget catches the general case, including a
 *    subpath that grows heavy on its own. #1553 cut this bundle roughly in
 *    half — 2.3 MB to 1.1 MB minified — by routing one import through a
 *    subpath, and left a note that a size assertion would catch more than its
 *    import scan could but would have to build the server to do it. CI builds
 *    everything before this runs, so it can.
 *
 * Run via `npm run check:size -w packages/lsp`. Exits non-zero, printing every
 * problem rather than just the first.
 *
 * The exported helpers exist so `check-server-bundle.test.mjs` can exercise the
 * decision logic without a build; only `main()` reads the real `dist/`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ROOT = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
);
const BUDGET_FILE = path.join(PACKAGE_ROOT, "server-budget.json");
const BUNDLE_FILE = path.join(PACKAGE_ROOT, "dist", "index.js");

/**
 * Fingerprints of a message catalog or the runtime that reads one.
 *
 * Deliberately a mix of the library's identifiers and the catalogs' own text.
 * An identifier alone would miss exactly the leak that happened, where the
 * code was shaken out and only the strings survived; catalog text alone would
 * miss a bundle that carries the Fluent runtime for some other reason. Each
 * needle names what it proves so the failure says which of the two occurred.
 */
export const CATALOG_NEEDLES = [
    { needle: "FluentBundle", what: "the Fluent runtime" },
    { needle: "FluentResource", what: "the Fluent runtime" },
    { needle: "@fluent/bundle", what: "the Fluent runtime" },
    // A Fluent select expression's default variant: no other content in this
    // bundle is written in a syntax that looks like this, and it appears
    // thirteen times in the English diagnostics catalog alone.
    { needle: "*[other]", what: "FTL catalog source" },
    // The first line of `locales/en/diagnostics.ftl`, which `?raw` imports
    // whole — so a bundle carrying that file carries this comment.
    { needle: "Errors and warnings surfaced", what: "FTL catalog source" },
    { needle: "formatEnglishDiagnostic", what: "the diagnostic formatter" },
];

/**
 * Report every catalog fingerprint present in `contents`, grouped by what it
 * proves, so one leak produces one line per payload rather than one per
 * needle.
 */
export function catalogLeaksIn(contents) {
    const byWhat = new Map();
    for (const { needle, what } of CATALOG_NEEDLES) {
        if (!contents.includes(needle)) {
            continue;
        }
        if (!byWhat.has(what)) {
            byWhat.set(what, []);
        }
        byWhat.get(what).push(needle);
    }
    return [...byWhat].map(
        ([what, needles]) =>
            `${what} is in the bundle (found ${needles.map((n) => JSON.stringify(n)).join(", ")})`,
    );
}

/**
 * Read `server-budget.json`, rejecting a shape the check cannot enforce.
 *
 * A missing or non-numeric `maxBytes` would compare `size > undefined`, which
 * is `false`: the bundle would be reported as within a `NaN` budget and the
 * check would pass. A budget that silently stops guarding is worse than none,
 * because the passing check is what everyone reads.
 */
export function readBudget(text) {
    let parsed;
    try {
        parsed = JSON.parse(text);
    } catch (error) {
        return { problems: [`server-budget.json is not valid JSON: ${error}`] };
    }
    const maxBytes = parsed?.maxBytes;
    if (typeof maxBytes !== "number" || !Number.isFinite(maxBytes)) {
        return {
            problems: [
                "server-budget.json needs a numeric `maxBytes`; found " +
                    JSON.stringify(maxBytes),
            ],
        };
    }
    return { maxBytes, problems: [] };
}

function kib(bytes) {
    return `${(bytes / 1024).toFixed(0)} KiB`;
}

/** Every problem with `contents` against `maxBytes`, as printable lines. */
export function checkBundle({ contents, size, maxBytes }) {
    const problems = catalogLeaksIn(contents).map(
        (leak) =>
            `${leak}. The language server renders no messages; see the header` +
            ` of this script for how the catalogs got in last time.`,
    );
    if (size > maxBytes) {
        problems.push(
            `dist/index.js is ${kib(size)}, over its ${kib(maxBytes)} budget.` +
                ` Raising the budget is fine when the growth is intended —` +
                ` the point is that it lands in the diff.`,
        );
    }
    return problems;
}

function main() {
    const problems = [];

    if (!fs.existsSync(BUNDLE_FILE)) {
        console.error(
            `No dist/index.js. Build the language server first:` +
                ` npm run build -w @doenet/lsp`,
        );
        process.exit(1);
    }

    const budgetText = fs.existsSync(BUDGET_FILE)
        ? fs.readFileSync(BUDGET_FILE, "utf-8")
        : "";
    const budget = readBudget(budgetText);
    problems.push(...budget.problems);

    const buffer = fs.readFileSync(BUNDLE_FILE);
    if (budget.maxBytes !== undefined) {
        problems.push(
            ...checkBundle({
                contents: buffer.toString("utf-8"),
                size: buffer.length,
                maxBytes: budget.maxBytes,
            }),
        );
    }

    if (problems.length > 0) {
        console.error(
            `\nLanguage server bundle check found ${problems.length} problem(s):`,
        );
        for (const problem of problems) {
            console.error(`  - ${problem}`);
        }
        process.exit(1);
    }

    console.log(
        `Language server bundle OK: ${kib(buffer.length)} of` +
            ` ${kib(budget.maxBytes)}, no message catalogs.`,
    );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
}
