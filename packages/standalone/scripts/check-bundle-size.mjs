/**
 * Guards the built standalone bundles against silent growth, and against the
 * specific way they have grown before: the Rust core sitting somewhere it does
 * not belong.
 *
 * The core ships as a single base64 `data:application/wasm` URI inlined into
 * the worker bundle — 8.3 MiB of the worker's 14.2 MiB. Until #1465 the whole
 * worker, that blob included, was inlined into `doenet-standalone.js` instead,
 * which is why that bundle was ~28 MB rather than today's ~14 MB — and nothing
 * in the build noticed either its size or where the core had landed. A change
 * that puts the blob back into `doenet-standalone.js`, or emits it twice, would
 * be just as quiet.
 *
 * Three checks, doing different jobs:
 *
 *  - The placement check needs no threshold and never needs adjusting. The
 *    core is meant to sit in {@link WASM_CORE_SCRIPT} and nowhere else, and any
 *    other arrangement is a bug rather than a judgement call. It scans *every*
 *    emitted script under `dist/`, not just the budgeted ones, so a copy that
 *    lands in a newly emitted chunk is still caught.
 *  - The catalog check covers the same kind of mistake for `@doenet/i18n`'s
 *    message catalogs, which this bundle serves from `dist/locales/` rather
 *    than carrying. Both halves are silent failures: a catalog inlined back
 *    into a script costs everyone the bytes (see {@link collectCatalogProbes}),
 *    and a catalog nobody copied leaves that language falling back to English
 *    (see {@link servedCatalogProblems}). Both halves are live: English is the
 *    only inlined locale, so every other catalog this repository ships is one
 *    the first half probes for and the second half insists on finding.
 *  - The size budgets in `bundle-budgets.json` catch the general case the
 *    checks above cannot see — a heavy dependency, a duplicated copy of
 *    something that is not wasm. They are expected to be raised as the project
 *    grows; the point is that raising one lands in the diff.
 *
 * Run via `npm run check:size -w packages/standalone`. Exits non-zero, and
 * prints every problem it found rather than just the first, when a bundle is
 * over budget, when a budgeted file is missing, when `bundle-budgets.json` is
 * unusable, when the core is not inlined exactly once in the right script, or
 * when a served catalog is in the wrong place or missing.
 *
 * A third way the catalogs can fail to arrive — served, and nothing reading
 * them, because a bundle holds two copies of the module that decides what is
 * loadable — is checked for every package rather than this one, by
 * `packages/i18n/scripts/check-bundle-instances.ts`.
 *
 * The exported helpers exist so `check-bundle-size.test.mjs` can exercise the
 * decision logic without a build, against synthetic bundles and throwaway
 * budgets files; only `main()` reads the real `dist/`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGE_ROOT = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
);
const BUDGETS_FILE = path.join(PACKAGE_ROOT, "bundle-budgets.json");
const DIST_DIR = path.join(PACKAGE_ROOT, "dist");

/**
 * The one emitted script that is supposed to carry the inlined core. It is
 * copied here from `@doenet/doenetml-worker` by `viteStaticCopy` in
 * `vite.config.ts`; if that destination changes, change this key and the
 * matching one in `bundle-budgets.json` together.
 */
export const WASM_CORE_SCRIPT = "dist/doenetml-worker/index.js";

/** `@doenet/i18n`'s catalogs, which this bundle serves rather than carries. */
const I18N_ROOT = path.resolve(PACKAGE_ROOT, "..", "i18n");
const LOCALES_DIR = path.join(I18N_ROOT, "locales");
const LOAD_MODULE_FILE = path.join(I18N_ROOT, "src", "load.ts");
/**
 * `!../locales/<locale>/*.ftl` — the locales that are inlined, not served.
 *
 * The same pattern is read for the same reason by `lazyGlobExclusions` in
 * `packages/i18n/scripts/catalogUtils.ts`, which `lint:i18n` uses to hold the
 * exclusions to `BUNDLED_LOCALES`. It is spelled out twice rather than shared
 * because this is a plain-node script and that one is TypeScript — but drift
 * is loud rather than silent: a change to the glob's spelling makes this find
 * no inlined locales, probe English, and fail on the very next build.
 */
const GLOB_EXCLUSION_PATTERN = /"!\.\.\/locales\/([^/"]+)\/\*\.ftl"/g;
/**
 * `key = value` at the top level of an FTL catalog.
 *
 * The value stops at the line ending rather than running to `$`, which on a
 * CRLF checkout would put a carriage return on the end of every probe. That
 * probe matches nothing in an emitted script, so the leak check would pass
 * whatever it was shown.
 */
const FTL_MESSAGE_PATTERN = /^([a-z0-9-]+) = ([^\r\n]+)/gm;
/**
 * `\xNN`, `\uNNNN` or `\u{N…}` — how a minifier spells a character it will not
 * write literally.
 */
const ESCAPED_CODE_POINT =
    /\\(?:x([0-9A-Fa-f]{2})|u\{([0-9A-Fa-f]{1,6})\}|u([0-9A-Fa-f]{4}))/g;
/**
 * Namespaces to look through for a probe, in the order they are tried. Any
 * one distinctive string identifies the catalog, so the order only decides
 * which is found first.
 */
const PROBE_NAMESPACES = ["diagnostics", "chrome", "editor", "content"];
/**
 * How long a translated string has to be before it is trusted to identify its
 * catalog. Short ones ("Total", "OK") are shared across languages often enough
 * to raise a false alarm.
 */
const PROBE_MIN_LENGTH = 16;

/** A base64 run long enough that nothing but an embedded binary explains it. */
const BIG_BLOB_MIN = 1_000_000;
const WASM_URI = /data:application\/wasm;base64/g;
/** Emitted JavaScript, in any extension a bundler might choose. */
const SCRIPT_EXTENSION = /\.[cm]?js$/;

/**
 * Count maximal base64 runs of at least {@link BIG_BLOB_MIN} characters.
 *
 * Scanned by hand rather than with `/[A-Za-z0-9+/]{1000000,}/`, which throws
 * `RangeError: Maximum call stack size exceeded` on a string this size — the
 * bundles are ~15 MB and the engine backtracks itself to death. A single pass
 * costs nothing and cannot blow up.
 */
export function countBigBlobs(text) {
    let count = 0;
    let run = 0;
    for (let i = 0; i < text.length; i++) {
        const c = text.charCodeAt(i);
        const isBase64 =
            (c >= 48 && c <= 57) || // 0-9
            (c >= 65 && c <= 90) || // A-Z
            (c >= 97 && c <= 122) || // a-z
            c === 43 || // +
            c === 47; // /
        if (isBase64) {
            run++;
        } else {
            if (run >= BIG_BLOB_MIN) {
                count++;
            }
            run = 0;
        }
    }
    return run >= BIG_BLOB_MIN ? count + 1 : count;
}

function mib(bytes) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

function readMessages(file) {
    if (!fs.existsSync(file)) {
        return new Map();
    }
    const source = fs.readFileSync(file, "utf-8");
    return new Map(
        [...source.matchAll(FTL_MESSAGE_PATTERN)].map((m) => [m[1], m[2]]),
    );
}

/**
 * A distinctive string from each *served* locale's catalogs.
 *
 * The served locales are every catalog directory `@doenet/i18n` does not
 * inline, read from the exclusion list in its lazy-catalog glob — the same
 * list `lint:i18n` holds to the inlined set, so this cannot drift from it
 * independently.
 *
 * A probe has to be long enough, and has to differ from what *every inlined*
 * locale says for the same key. Matching an inlined catalog is what makes a
 * probe useless: those strings are legitimately in the bundle, so a translation
 * that happens to reuse one would report a leak on every build. English is the
 * culprit today, being the only inlined locale — a term left untranslated reads
 * identically in both. The rule is written for the general case because
 * inlining a second locale would add another, and neighbouring languages share
 * plenty of wording.
 *
 * A locale that yields no such string simply gets no probe. That is the right
 * failure mode for a catalog too close to an inlined one to fingerprint —
 * better than a check that cries wolf, since the size budget still covers the
 * general case.
 *
 * @returns `[locale, probe]` pairs.
 */
export function collectCatalogProbes(
    localesDir = LOCALES_DIR,
    loadModuleFile = LOAD_MODULE_FILE,
) {
    if (!fs.existsSync(localesDir) || !fs.existsSync(loadModuleFile)) {
        return [];
    }
    const inlined = [
        ...new Set(
            [
                ...fs
                    .readFileSync(loadModuleFile, "utf-8")
                    .matchAll(GLOB_EXCLUSION_PATTERN),
            ].map((match) => match[1]),
        ),
    ];
    /** `namespace → key → every string an inlined catalog gives that key`. */
    const inlinedMessages = new Map(
        PROBE_NAMESPACES.map((namespace) => {
            const byKey = new Map();
            for (const locale of inlined) {
                const messages = readMessages(
                    path.join(localesDir, locale, `${namespace}.ftl`),
                );
                for (const [key, value] of messages) {
                    byKey.set(key, [...(byKey.get(key) ?? []), value]);
                }
            }
            return [namespace, byKey];
        }),
    );
    const probes = [];
    for (const entry of fs.readdirSync(localesDir, { withFileTypes: true })) {
        if (!entry.isDirectory() || inlined.includes(entry.name)) {
            continue;
        }
        for (const namespace of PROBE_NAMESPACES) {
            const translated = readMessages(
                path.join(localesDir, entry.name, `${namespace}.ftl`),
            );
            const alsoInlined = inlinedMessages.get(namespace);
            const probe = [...translated].find(
                ([key, value]) =>
                    value.length >= PROBE_MIN_LENGTH &&
                    !(alsoInlined.get(key) ?? []).includes(value),
            );
            if (probe) {
                probes.push([entry.name, probe[1]]);
                break;
            }
        }
    }
    return probes;
}

/**
 * The served locales whose catalog text is inside one emitted script.
 *
 * The comparison is made against the script with its character escapes
 * decoded. `forceEsbuildMinifyPlugin` calls esbuild's `transform` without a
 * `charset`, and esbuild then defaults to ASCII: every accented character in
 * an inlined catalog is written back out as `\xNN` or `\uNNNN`, so
 * `contribución` never appears literally in `doenet-standalone.js`. Matching
 * the raw text would miss a leak for exactly the languages most likely to leak
 * — outside English an accent is the rule rather than the exception.
 *
 * @param contents an emitted script's source.
 * @param probes `[locale, probe]` pairs, from {@link collectCatalogProbes}.
 * @returns the locales whose probe the script carries.
 */
export function catalogsInScript(contents, probes) {
    if (probes.length === 0) {
        return [];
    }
    const decoded = contents.replace(
        ESCAPED_CODE_POINT,
        (_whole, hex2, braced, hex4) =>
            String.fromCodePoint(parseInt(hex2 ?? braced ?? hex4, 16)),
    );
    return probes
        .filter(([, probe]) => decoded.includes(probe))
        .map(([locale]) => locale);
}

/**
 * The locale directories the build emitted, or `null` if there is no
 * `dist/locales/` at all.
 *
 * `null` and `[]` mean different things: nothing copied is a broken build
 * (`copyLocaleCatalogsPlugin` runs unconditionally), while an empty directory
 * would be a `locales/` with nothing in it.
 */
function collectEmittedLocales(distDir = DIST_DIR) {
    const localesDir = path.join(distDir, "locales");
    if (!fs.existsSync(localesDir)) {
        return null;
    }
    return fs
        .readdirSync(localesDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
}

/** The locale directories `@doenet/i18n` has, which the build copies whole. */
function collectSourceLocales(localesDir = LOCALES_DIR) {
    if (!fs.existsSync(localesDir)) {
        return [];
    }
    return fs
        .readdirSync(localesDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name);
}

/**
 * Problems with the catalogs the bundle is supposed to serve beside itself.
 *
 * The counterpart to the leak check in {@link findProblems}: that one catches a
 * catalog that ended up inside a script, this one catches a catalog that ended
 * up nowhere. A language that is neither inlined nor served silently renders in
 * English, which no size budget would ever notice.
 *
 * Held against every locale directory in `@doenet/i18n` rather than against the
 * served ones alone, because `copyLocaleCatalogsPlugin` copies all of them —
 * so a locale that starts or stops being inlined needs nothing changed here,
 * and the check keeps its meaning whatever that decision turns out to be.
 *
 * @param sourceLocales locale directories under `packages/i18n/locales/`, from
 *   {@link collectSourceLocales}.
 * @param emittedLocales locale directories under `dist/locales/`, or `null` if
 *   the directory is missing, as {@link collectEmittedLocales} reports it.
 */
export function servedCatalogProblems(sourceLocales, emittedLocales) {
    if (emittedLocales === null) {
        return [
            `dist/locales/ was not emitted, so no language beyond the inlined ones could\n` +
                `    be fetched. It is copied there by copyLocaleCatalogsPlugin in\n` +
                `    packages/standalone/vite.config.ts.`,
        ];
    }
    return sourceLocales
        .filter((locale) => !emittedLocales.includes(locale))
        .map(
            (locale) =>
                `dist/locales/${locale}/ was not emitted, so a language served rather than\n` +
                `    inlined cannot be fetched and would fall back to English. It is copied\n` +
                `    there by copyLocaleCatalogsPlugin in\n` +
                `    packages/standalone/vite.config.ts.`,
        );
}

/**
 * Every emitted script under `dist/`, keyed by its path relative to the
 * package root (matching the keys in `bundle-budgets.json`).
 *
 * Deliberately limited to scripts. Source maps (`*.js.map`) embed the very
 * blob they map, so counting them would report the core twice for a correct
 * build, and `dist/style.css` legitimately carries a ~1 MB base64 run of its
 * own (an inlined SVG webfont) that the blob heuristic cannot tell apart from
 * wasm. Only a script can actually execute a duplicated Rust core.
 *
 * @param probes `[locale, probe]` pairs, from {@link collectCatalogProbes}.
 */
function collectEmittedScripts(probes) {
    const scripts = new Map();
    if (!fs.existsSync(DIST_DIR)) {
        return scripts;
    }
    for (const entry of fs.readdirSync(DIST_DIR, {
        withFileTypes: true,
        recursive: true,
    })) {
        if (!entry.isFile() || !SCRIPT_EXTENSION.test(entry.name)) {
            continue;
        }
        const file = path.join(entry.parentPath, entry.name);
        const buffer = fs.readFileSync(file);
        const contents = buffer.toString("utf-8");
        // Keyed with forward slashes on every platform, so the keys in
        // `bundle-budgets.json` match on Windows too.
        const relative = path
            .relative(PACKAGE_ROOT, file)
            .split(path.sep)
            .join("/");
        scripts.set(relative, {
            size: buffer.length,
            wasmUris: contents.match(WASM_URI)?.length ?? 0,
            bigBlobs: countBigBlobs(contents),
            inlinedCatalogs: catalogsInScript(contents, probes),
        });
    }
    return scripts;
}

/**
 * Read `bundle-budgets.json`, rejecting a shape the checks cannot enforce.
 *
 * Without this a typo'd or missing `maxBytes` would compare `size > undefined`,
 * which is `false` — the file would be reported as within a `NaN MiB` budget
 * and the check would pass. A budget that silently stops guarding is worse
 * than no budget at all.
 *
 * @returns the `files` entries, as `[relativePath, budget]` pairs.
 */
export function loadBudgets(budgetsFile = BUDGETS_FILE) {
    let parsed;
    try {
        parsed = JSON.parse(fs.readFileSync(budgetsFile, "utf-8"));
    } catch (e) {
        throw new Error(
            `Could not read ${path.relative(PACKAGE_ROOT, budgetsFile)}: ${e.message}`,
        );
    }
    const files = parsed?.files;
    if (typeof files !== "object" || files === null || Array.isArray(files)) {
        throw new Error(
            `bundle-budgets.json must have a "files" object mapping each bundle path ` +
                `to a budget.`,
        );
    }
    const entries = Object.entries(files);
    if (entries.length === 0) {
        throw new Error(
            `bundle-budgets.json lists no files, so nothing would be checked.`,
        );
    }
    for (const [relative, budget] of entries) {
        if (!Number.isFinite(budget?.maxBytes) || budget.maxBytes <= 0) {
            throw new Error(
                `bundle-budgets.json entry "${relative}" needs a positive numeric ` +
                    `"maxBytes"; got ${JSON.stringify(budget?.maxBytes)}.`,
            );
        }
    }
    return entries;
}

/**
 * Describe a script whose inlined-blob count is not what it should be.
 *
 * `expected` is 1 for {@link WASM_CORE_SCRIPT} and 0 for everything else, so
 * the two wordings cover every script.
 */
function blobPlacementProblem(relative, emitted, expected) {
    const observed =
        `${emitted.wasmUris} wasm data-URI(s) and ` +
        `${emitted.bigBlobs} large inlined blob(s)`;
    if (expected === 1) {
        return (
            `${relative} should carry the Rust core exactly once, but has ${observed}.\n` +
            `    Zero means the core stopped being inlined, and vite.config.ts copies only\n` +
            `    index.js (+ its map) into dist/ — there is no sibling .wasm left for the\n` +
            `    worker to fetch. More than one means it was bundled twice, which adds\n` +
            `    megabytes.`
        );
    }
    return (
        `${relative} should carry no inlined binary — the Rust core belongs to\n` +
        `    ${WASM_CORE_SCRIPT} alone — but has ${observed}.\n` +
        `    A wasm URI here means the core leaked out of the worker or was bundled\n` +
        `    twice. A large blob without one means some other multi-megabyte asset is\n` +
        `    now inlined into JavaScript. Either way it should be a deliberate change.`
    );
}

/**
 * Compare the emitted scripts against the budgets, without touching the disk
 * or the process.
 *
 * @param budgets `[relativePath, budget]` pairs, as returned by
 *   {@link loadBudgets}.
 * @param scripts the emitted scripts, as returned by
 *   {@link collectEmittedScripts}.
 * @returns `report` lines describing every emitted script, and `problems`
 *   describing everything that should fail the build.
 */
export function findProblems(budgets, scripts) {
    const problems = [];
    const report = [];

    for (const [relative, budget] of budgets) {
        const emitted = scripts.get(relative);
        if (!emitted) {
            // "Build the package" is the right advice only when there is no
            // build. If other scripts were emitted and the core-carrying one
            // was not, the build ran and the file moved — say that once, in
            // the more specific message below, instead of twice and wrongly.
            if (relative !== WASM_CORE_SCRIPT || scripts.size === 0) {
                problems.push(
                    `${relative} does not exist — build the package before checking its size ` +
                        `(\`npm run build -w packages/standalone\`).`,
                );
            }
            continue;
        }

        report.push(
            `  ${relative}\n` +
                `      ${mib(emitted.size)} of ${mib(budget.maxBytes)} budget` +
                `  (${((emitted.size / budget.maxBytes) * 100).toFixed(1)}%)` +
                `, ${emitted.wasmUris} wasm URI(s), ${emitted.bigBlobs} inlined blob(s)`,
        );

        if (emitted.size > budget.maxBytes) {
            problems.push(
                `${relative} is ${mib(emitted.size)} (${emitted.size} bytes), over its ` +
                    `${mib(budget.maxBytes)} budget by ${mib(emitted.size - budget.maxBytes)}.\n` +
                    `    If the growth is intended, raise "maxBytes" for this file in\n` +
                    `    packages/standalone/bundle-budgets.json in the same commit, so the\n` +
                    `    increase is visible in review. If it is not intended, something was\n` +
                    `    pulled in twice — compare against the previous build before raising it.`,
            );
        }
    }

    // Emitted scripts nobody has put a ceiling on. Not a failure — a new chunk
    // is a normal thing for the bundler to do — but it is listed so that a
    // chunk quietly growing into a second multi-megabyte payload is visible,
    // and so somebody can decide whether it deserves a budget.
    const budgeted = new Set(budgets.map(([relative]) => relative));
    for (const [relative, emitted] of scripts) {
        if (!budgeted.has(relative)) {
            report.push(
                `  ${relative}\n` +
                    `      ${mib(emitted.size)}, no budget` +
                    `, ${emitted.wasmUris} wasm URI(s), ${emitted.bigBlobs} inlined blob(s)`,
            );
        }
    }

    // Where the core sits, not just how many copies exist: a single copy in
    // the wrong script is as much a bug as two copies, and a total-only count
    // cannot tell them apart.
    for (const [relative, emitted] of scripts) {
        const expected = relative === WASM_CORE_SCRIPT ? 1 : 0;
        if (emitted.wasmUris !== expected || emitted.bigBlobs !== expected) {
            problems.push(blobPlacementProblem(relative, emitted, expected));
        }
    }
    // Catalogs this bundle is supposed to serve, not carry. Being one file, it
    // cannot code-split them the way the library build does, so it switches
    // `__DOENET_CODE_SPLIT_CATALOGS__` off and fetches `dist/locales/` at
    // runtime instead. Anything that makes the glob reachable again — a define
    // that stops being applied, a new eager import of a catalog — puts every
    // translation back in here, and the size budget alone would absorb it for
    // a long time.
    for (const [relative, emitted] of scripts) {
        const leaked = emitted.inlinedCatalogs;
        if (leaked.length > 0) {
            problems.push(
                `${relative} carries the message catalogs for [${leaked.join(", ")}], which\n` +
                    `    this bundle is supposed to serve from dist/locales/ rather than inline.\n` +
                    `    Check that __DOENET_CODE_SPLIT_CATALOGS__ is still defined false in\n` +
                    `    packages/standalone/vite.config.ts, and that nothing imports a catalog\n` +
                    `    statically.`,
            );
        }
    }

    // An unbuilt `dist/` has no scripts to check, and the budget loop above has
    // already said to build; only complain about the core going missing once
    // there is a build to complain about.
    if (scripts.size > 0 && !scripts.has(WASM_CORE_SCRIPT)) {
        problems.push(
            `${WASM_CORE_SCRIPT} was not emitted, so nothing carries the Rust core.\n` +
                `    The worker bundle is copied into \`dist/\` by vite.config.ts; if it moved,\n` +
                `    update WASM_CORE_SCRIPT in this script and the key in bundle-budgets.json.`,
        );
    }

    return { report, problems };
}

function main() {
    const budgets = loadBudgets();
    const probes = collectCatalogProbes();
    const scripts = collectEmittedScripts(probes);
    const { report, problems } = findProblems(budgets, scripts);

    // An unbuilt `dist/` has already been reported as such; only ask where the
    // served catalogs went once there is a build to ask about.
    if (scripts.size > 0) {
        problems.push(
            ...servedCatalogProblems(
                collectSourceLocales(),
                collectEmittedLocales(),
            ),
        );
    }

    console.log("standalone bundle sizes:");
    console.log(report.join("\n"));

    if (problems.length > 0) {
        console.error(`\n${problems.length} problem(s):\n`);
        for (const problem of problems) {
            console.error(`  - ${problem}\n`);
        }
        process.exit(1);
    }

    console.log(
        "\nwithin budget, the core is inlined exactly once, and the message catalogs\n" +
            "are served rather than carried.",
    );
}

// Only when run as a command; importing this module (from its test) must not
// check the real `dist/` or exit the process.
if (
    process.argv[1] &&
    path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
    try {
        main();
    } catch (e) {
        // A configuration error is a failure of the check, not a stack trace to
        // decipher in a CI log.
        console.error(
            `\nbundle size check could not run:\n\n  - ${e.message}\n`,
        );
        process.exit(1);
    }
}
