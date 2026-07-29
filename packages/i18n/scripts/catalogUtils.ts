import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { FluentBundle, FluentResource } from "@fluent/bundle";
import { parse as parseFtl } from "@fluent/syntax";
import * as prettier from "prettier";

import { CATALOG_NAMESPACES } from "../src/namespaces";
import { DEFAULT_LOCALE } from "../src/catalogs";

export const PACKAGE_ROOT = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
);
export const LOCALES_DIR = path.join(PACKAGE_ROOT, "locales");
export const REPO_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");
export const GENERATED_KEYS_FILE = path.join(
    PACKAGE_ROOT,
    "src",
    "generated",
    "messageKeys.ts",
);
/**
 * Every diagnostic code ever issued.
 *
 * Committed, and only ever appended to. The registry in `src/diagnostics.ts`
 * is what the code reads; this file is what makes the registry's promise
 * checkable — a renumbered or reused code shows up as a lock entry the
 * registry no longer agrees with, and `lint:i18n` fails on it.
 */
export const DIAGNOSTIC_CODES_LOCK_FILE = path.join(
    PACKAGE_ROOT,
    "diagnostic-codes.lock.json",
);
/**
 * The roster of locales this repository ships a catalog for.
 *
 * Deliberately derived from `locales/` rather than from `BUNDLED_TRANSLATIONS`
 * in `src/bundled.ts`: those answer different questions. Which locales *exist*
 * is a fact about this repository; which are *inlined into the JS bundle* is a
 * delivery decision that is expected to change once there are more than a
 * couple of them (see the note on `BUNDLED_TRANSLATIONS`). Only the first is
 * stable enough to drive author-facing surfaces like the editor's autocomplete
 * for `<document lang>`, so that they keep working when Spanish stops being
 * inlined.
 */
export const SUPPORTED_LOCALES_FILE = path.join(
    PACKAGE_ROOT,
    "src",
    "generated",
    "supportedLocales.ts",
);

export type CatalogKey = {
    key: string;
    namespace: string;
    locale: string;
};

/** Locales with a catalog directory, `en` first. */
export function listLocales(): string[] {
    const locales = fs
        .readdirSync(LOCALES_DIR, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort();
    return [
        ...locales.filter((locale) => locale === DEFAULT_LOCALE),
        ...locales.filter((locale) => locale !== DEFAULT_LOCALE),
    ];
}

function catalogPath(locale: string, namespace: string): string {
    return path.join(LOCALES_DIR, locale, `${namespace}.ftl`);
}

export function readCatalog(locale: string, namespace: string): string | null {
    const file = catalogPath(locale, namespace);
    return fs.existsSync(file) ? fs.readFileSync(file, "utf-8") : null;
}

/**
 * Every addressable key in one catalog, in source order.
 *
 * Keys are read out of Fluent's own parse rather than matched with a regex, so
 * the lint can never disagree with what the runtime will actually resolve.
 * Terms (`-brand`) are not addressable and are skipped.
 */
export function extractKeys(source: string): string[] {
    const resource = new FluentResource(source);
    const keys: string[] = [];
    for (const entry of resource.body) {
        if (entry.id.startsWith("-")) {
            continue;
        }
        if (entry.value !== null) {
            keys.push(entry.id);
        }
        for (const attribute of Object.keys(entry.attributes)) {
            keys.push(`${entry.id}.${attribute}`);
        }
    }
    return keys;
}

/**
 * Everything wrong with a catalog, as human-readable strings.
 *
 * Two parsers, because they catch different things. The runtime parser in
 * `@fluent/bundle` silently discards malformed entries as junk — a typo'd
 * message just stops existing, with no error anywhere — so `@fluent/syntax`
 * (a dev-only dependency, never bundled) supplies the syntax diagnostics.
 * `addResource` then reports what only the runtime knows: ids defined twice.
 */
export function catalogParseErrors(source: string): string[] {
    const errors: string[] = [];

    const resource = parseFtl(source, {});
    for (const entry of resource.body) {
        if (entry.type !== "Junk") {
            continue;
        }
        for (const annotation of entry.annotations) {
            // `span` is optional in the AST (it is dropped when parsing
            // `withSpans: false`); report without a line number rather than
            // losing the diagnostic.
            const where =
                annotation.span === undefined
                    ? ""
                    : `line ${source.slice(0, annotation.span.start).split("\n").length}: `;
            errors.push(`${where}${annotation.code} ${annotation.message}`);
        }
    }

    const bundle = new FluentBundle("en");
    for (const error of bundle.addResource(new FluentResource(source))) {
        errors.push(error.message);
    }

    return errors;
}

/** Every key in every namespace of a locale. */
export function collectLocaleKeys(locale: string): CatalogKey[] {
    const keys: CatalogKey[] = [];
    for (const namespace of CATALOG_NAMESPACES) {
        const source = readCatalog(locale, namespace);
        if (source === null) {
            continue;
        }
        for (const key of extractKeys(source)) {
            keys.push({ key, namespace, locale });
        }
    }
    return keys;
}

/**
 * Translator call sites: `t("key")` or `translate("key")`, and nothing else.
 *
 * A convention, not inference — the translator must be bound to one of those
 * two names and the key must be a string literal, so that the catalogs can be
 * checked statically. A computed key (`t(makeKey(x))`), a differently-named
 * translator, or a key with more than one dot (which can never resolve
 * anyway) is invisible here and will silently miss at runtime.
 */
const CALL_SITE_PATTERN =
    /(?<![\w$.])(?:t|translate)\(\s*["'`]([a-zA-Z][\w-]*(?:\.[a-zA-Z][\w-]*)?)["'`]/g;

const SCANNED_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx"]);
/**
 * Tests are not call sites: a key used only by a test is still an orphan, and
 * a fixture key that deliberately doesn't exist must not fail the lint.
 */
const SKIPPED_FILE_PATTERN = /\.(test|spec|stub|cy)\.[jt]sx?$/;
const SKIPPED_DIRECTORIES = new Set([
    "node_modules",
    "dist",
    "build",
    ".wireit",
    ".next",
    "out",
    "pkg",
    "target",
    "cypress",
    "test",
]);

function* walkSourceFiles(directory: string): Generator<string> {
    let entries: fs.Dirent[];
    try {
        entries = fs.readdirSync(directory, { withFileTypes: true });
    } catch {
        return;
    }
    for (const entry of entries) {
        const full = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            if (!SKIPPED_DIRECTORIES.has(entry.name)) {
                yield* walkSourceFiles(full);
            }
        } else if (
            SCANNED_EXTENSIONS.has(path.extname(entry.name)) &&
            !SKIPPED_FILE_PATTERN.test(entry.name)
        ) {
            yield full;
        }
    }
}

export type CallSite = { key: string; file: string };

/**
 * Every scanned source file under `packages/<name>/src`, with its contents and
 * its repo-relative path — the corpus both the call-site scan and the
 * diagnostic-code scan run over.
 */
function* scannedSources(): Generator<{ file: string; contents: string }> {
    const packagesDir = path.join(REPO_ROOT, "packages");
    for (const entry of fs.readdirSync(packagesDir, { withFileTypes: true })) {
        if (!entry.isDirectory()) {
            continue;
        }
        const srcDir = path.join(packagesDir, entry.name, "src");
        for (const file of walkSourceFiles(srcDir)) {
            yield {
                file: path.relative(REPO_ROOT, file),
                contents: fs.readFileSync(file, "utf-8"),
            };
        }
    }
}

/** Every translator call site under `packages/<name>/src`. */
export function collectCallSites(): CallSite[] {
    const sites: CallSite[] = [];
    for (const { file, contents } of scannedSources()) {
        for (const match of contents.matchAll(CALL_SITE_PATTERN)) {
            sites.push({ key: match[1], file });
        }
    }
    return sites;
}

/**
 * The contents `src/generated/messageKeys.ts` should have for these keys.
 *
 * Formatted with the repo's Prettier config, so `lint:i18n` can compare the
 * generated text against the committed file byte for byte without
 * `prettier:check` and this script disagreeing about the result.
 */
export async function renderMessageKeysModule(keys: string[]): Promise<string> {
    const prettierConfig = await prettier.resolveConfig(GENERATED_KEYS_FILE);
    return prettier.format(renderMessageKeysModuleRaw(keys), {
        ...prettierConfig,
        filepath: GENERATED_KEYS_FILE,
        parser: "typescript",
    });
}

/**
 * A locale's name in English and in itself, e.g. `["Spanish", "español"]`.
 *
 * Derived rather than hand-written, which is the point: a hand-maintained
 * description per locale is exactly the per-language work that would stop this
 * from scaling, and the schema generator hard-fails on an empty description.
 * Computing the names here rather than at runtime also keeps `Intl` off the
 * worker's path, where a tag it cannot parse is a live hazard (see the note on
 * unparseable tags in the package README).
 *
 * `Intl.DisplayNames` throws on a structurally invalid tag and echoes the tag
 * back for one it simply doesn't know; both degrade to the tag itself, so a
 * newly added locale can never fail the build over its name.
 */
function localeNames(locale: string): { englishName: string; endonym: string } {
    const nameIn = (displayLocale: string): string => {
        try {
            return (
                new Intl.DisplayNames([displayLocale], {
                    type: "language",
                }).of(locale) ?? locale
            );
        } catch {
            return locale;
        }
    };
    return { englishName: nameIn(DEFAULT_LOCALE), endonym: nameIn(locale) };
}

/**
 * The contents `src/generated/supportedLocales.ts` should have for these
 * locales.
 *
 * Formatted with the repo's Prettier config for the same reason
 * {@link renderMessageKeysModule} is: `lint:i18n` compares the rendered text
 * against the committed file byte for byte.
 */
export async function renderSupportedLocalesModule(
    locales: string[],
): Promise<string> {
    const prettierConfig = await prettier.resolveConfig(SUPPORTED_LOCALES_FILE);
    return prettier.format(renderSupportedLocalesModuleRaw(locales), {
        ...prettierConfig,
        filepath: SUPPORTED_LOCALES_FILE,
        parser: "typescript",
    });
}

/** The lock as committed, or an empty lock if it doesn't exist yet. */
export function readDiagnosticCodesLock(): Record<string, string> {
    if (!fs.existsSync(DIAGNOSTIC_CODES_LOCK_FILE)) {
        return {};
    }
    return JSON.parse(fs.readFileSync(DIAGNOSTIC_CODES_LOCK_FILE, "utf-8"));
}

/**
 * The lock these codes imply: every entry already locked, plus every code the
 * registry has added since.
 *
 * Locked entries are never rewritten from the registry — that is the whole
 * point. A registry that disagrees with the lock is reported, not absorbed.
 */
export function mergeDiagnosticCodesLock(
    lock: Record<string, string>,
    registry: Record<string, string>,
): Record<string, string> {
    const merged: Record<string, string> = { ...lock };
    for (const [code, key] of Object.entries(registry)) {
        merged[code] ??= key;
    }
    return Object.fromEntries(
        Object.entries(merged).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
    );
}

export async function renderDiagnosticCodesLock(
    lock: Record<string, string>,
): Promise<string> {
    const prettierConfig = await prettier.resolveConfig(
        DIAGNOSTIC_CODES_LOCK_FILE,
    );
    return prettier.format(JSON.stringify(lock, null, 4), {
        ...prettierConfig,
        filepath: DIAGNOSTIC_CODES_LOCK_FILE,
        parser: "json",
    });
}

/**
 * Diagnostic codes named in source: `code: "doenet-w0001"` and nothing else.
 *
 * The worker's components are JavaScript, so the registry's types cannot catch
 * a typo'd code there. This is the check that does — a code no registry entry
 * defines would otherwise emit a diagnostic that silently never translates.
 */
const DIAGNOSTIC_CODE_USE_PATTERN = /code:\s*["'`](doenet-[a-z]\d+)["'`]/g;

/**
 * A diagnostic *construction*: an object literal with a severity on it.
 *
 * This is the denominator. Every diagnostic in the codebase is ultimately one
 * of these, whether the message beside it is a literal English string or comes
 * from the catalog via `codedDiagnostic`.
 *
 * Counted, not validated — a regex over source text can only approximate the
 * real number. The two guards keep it from over-reporting in the ways that
 * actually occur here: the lookbehind rules out a longer property name ending
 * in `type` (`error_type: "warning"`, in the parser and the LSP), and the
 * lookahead rules out a *type declaration* rather than an object literal
 * (`type: "error";` in the `DiagnosticRecord` union), neither of which is a
 * message anyone has to translate.
 */
const DIAGNOSTIC_CONSTRUCTION_PATTERN =
    /(?<![\w$])type:\s*["'`](?:warning|error|info|accessibility)["'`](?!\s*;)/g;

/**
 * A construction whose message comes from the catalog.
 *
 * Subtracted from the constructions rather than counting `code:` uses,
 * because those are not the same number and the difference is the whole
 * point. A *helper* that raises diagnostics on its callers' behalf is one
 * construction with many call sites — `pushVariantInfo` alone stands in front
 * of about forty — and each of those sites names a code. Counting codes would
 * credit forty migrations against one construction and drive the burn-down
 * below zero; counting `codedDiagnostic` calls credits exactly the
 * constructions that no longer hold English.
 *
 * That the helper's own sites are invisible here is not a gap: the English
 * they used to hold has genuinely moved to the catalog, and the construction
 * they share is counted once on each side.
 *
 * The lookbehind skips the *declaration* in `@doenet/utils`. A call carries a
 * `type: "…"` of its own for the denominator to count, so the two cancel; the
 * declaration has only a shorthand `type,` and would be pure credit, taking
 * the remainder one below the truth.
 */
const CODED_CONSTRUCTION_PATTERN = /(?<!function\s)codedDiagnostic\(/g;

/**
 * The parser's coded-error builder, counted at its *declaration* — the exact
 * opposite of the rule above, for the exact same reason.
 *
 * `@doenet/parser` builds DAST error nodes rather than diagnostic records, so
 * it has a builder of its own (`codedDastError`, in
 * `packages/parser/src/coded-dast-error.ts`). What differs is where the
 * construction sits. A `codedDiagnostic` call passes the severity in, so every
 * call carries a `type: "…"` the denominator counts and the two cancel there. A
 * DAST error's `type` is always `"error"` — the node kind, not a severity — so
 * the builder writes it and its callers write nothing. Counting the calls would
 * credit twenty migrations against one construction and take the burn-down
 * below zero, which is the failure this whole scheme is arranged to avoid.
 *
 * One construction, in the declaration; one credit, in the same place.
 */
const CODED_DAST_ERROR_PATTERN = /function codedDastError\(/g;

/**
 * A construction that *forwards* whatever code its source carried.
 *
 * The `catch` blocks that turn a caught error into a record hold no English
 * of their own — the message came from the thrower — so there is no literal
 * for them to migrate and no code for them to name. They are as migrated as
 * they can be: spreading `diagnosticCodeFrom` is precisely what makes the
 * record coded whenever the thing it forwards is. Without counting them the
 * burn-down could never reach zero, because these sites would sit in the
 * remainder forever with nothing left to do to them.
 */
const FORWARDED_DIAGNOSTIC_PATTERN = /\.\.\.diagnosticCodeFrom\(/g;

export type DiagnosticUsage = {
    /**
     * Sites naming a code literally, including the ones that hand it to a
     * helper. The key is validated against the registry, so these are the only
     * ones that can answer "is every registered code actually raised?" — which
     * is why they are collected even though the burn-down does not use them.
     */
    codes: CallSite[];
    /** Diagnostic constructions, migrated or not. */
    constructionCount: number;
    /** Constructions taking their message from the catalog. */
    codedConstructionCount: number;
    /** Constructions passing a code through from their source. */
    forwardedCount: number;
};

/**
 * How much of #1518 is left, in constructions.
 *
 * A construction is migrated when its message comes from the catalog, either
 * because it names a code or because it forwards one. Everything else still
 * holds an English string that no translation can reach.
 */
export function remainingLiteralDiagnostics(usage: DiagnosticUsage): number {
    return (
        usage.constructionCount -
        usage.codedConstructionCount -
        usage.forwardedCount
    );
}

/**
 * The three counts one file's source text contributes to the burn-down.
 *
 * Split out from {@link collectDiagnosticUsage} so the patterns can be tested
 * against source text directly — the counts are the number the migration is
 * tracked by, and each pattern has an edge it has to get right (a declaration
 * that is not a call, a type declaration that is not an object literal, a
 * property whose name merely ends in `type`).
 */
export function countDiagnosticConstructions(contents: string): {
    constructionCount: number;
    codedConstructionCount: number;
    forwardedCount: number;
} {
    return {
        constructionCount: [
            ...contents.matchAll(DIAGNOSTIC_CONSTRUCTION_PATTERN),
        ].length,
        codedConstructionCount:
            [...contents.matchAll(CODED_CONSTRUCTION_PATTERN)].length +
            [...contents.matchAll(CODED_DAST_ERROR_PATTERN)].length,
        forwardedCount: [...contents.matchAll(FORWARDED_DIAGNOSTIC_PATTERN)]
            .length,
    };
}

/** Diagnostic call sites under `packages/<name>/src`. */
export function collectDiagnosticUsage(): DiagnosticUsage {
    const codes: CallSite[] = [];
    let constructionCount = 0;
    let codedConstructionCount = 0;
    let forwardedCount = 0;
    for (const { file, contents } of scannedSources()) {
        for (const match of contents.matchAll(DIAGNOSTIC_CODE_USE_PATTERN)) {
            codes.push({ key: match[1], file });
        }
        const counts = countDiagnosticConstructions(contents);
        constructionCount += counts.constructionCount;
        codedConstructionCount += counts.codedConstructionCount;
        forwardedCount += counts.forwardedCount;
    }
    return {
        codes,
        constructionCount,
        codedConstructionCount,
        forwardedCount,
    };
}

function renderSupportedLocalesModuleRaw(locales: string[]): string {
    const entries = locales.map((locale) => {
        const { englishName, endonym } = localeNames(locale);
        // English and the endonym coincide for English itself, and for any
        // locale `Intl` doesn't know (both fall back to the tag). Repeating
        // the same word in parentheses would read as a mistake.
        const label =
            englishName === endonym
                ? englishName
                : `${englishName} (${endonym})`;
        return { locale, englishName, endonym, label };
    });
    const union =
        entries.length === 0
            ? "never"
            : entries
                  .map((entry) => `\n    | ${JSON.stringify(entry.locale)}`)
                  .join("");
    const list =
        entries.length === 0
            ? "[]"
            : `[\n${entries
                  .map(
                      (entry) =>
                          `    {\n` +
                          `        locale: ${JSON.stringify(entry.locale)},\n` +
                          `        englishName: ${JSON.stringify(entry.englishName)},\n` +
                          `        endonym: ${JSON.stringify(entry.endonym)},\n` +
                          `        label: ${JSON.stringify(entry.label)},\n` +
                          `    },`,
                  )
                  .join("\n")}\n]`;

    return `// AUTO-GENERATED by \`npm run codegen -w @doenet/i18n\`. Do not edit by hand.
//
// Every locale with a catalog directory under locales/, with its name in
// English and in itself. \`lint:i18n\` fails if this file drifts from the
// directory.

/** A locale this repository ships a catalog for. */
export type SupportedLocale = ${union};

/** A supported locale and the names to show an author. */
export type SupportedLocaleInfo = {
    /** The BCP-47 tag, matching the directory name under \`locales/\`. */
    locale: SupportedLocale;
    /** The language's name in English, e.g. \`"Spanish"\`. */
    englishName: string;
    /** The language's name in itself, e.g. \`"español"\`. */
    endonym: string;
    /**
     * Both names in one string, e.g. \`"Spanish (español)"\` — collapsed to a
     * single name when the two coincide. This is what author-facing surfaces
     * (the editor's autocomplete and context help for \`<document lang>\`, the
     * reference docs) show beside the tag.
     */
    label: string;
};

/**
 * Every locale with a catalog in this repository, \`en\` first.
 *
 * This is the *roster*, not the delivery mechanism. It is generated from the
 * \`locales/\` directory, so it stays correct when a locale stops being inlined
 * into the bundle and starts arriving as a lazily-loaded module or as
 * host-supplied \`localeResources\` — which is expected once there are more
 * than a handful. Read it for "which languages does DoenetML have"; read
 * \`bundledResources\` for "which catalogs are in this JS bundle".
 *
 * A deployment can always supply a catalog of its own that is not listed here.
 * That is why the surfaces built on this list suggest rather than enforce: an
 * unlisted tag is not an error.
 */
export const SUPPORTED_LOCALES: readonly SupportedLocaleInfo[] = ${list};
`;
}

function renderMessageKeysModuleRaw(keys: string[]): string {
    const union =
        keys.length === 0
            ? "never"
            : keys.map((key) => `\n    | ${JSON.stringify(key)}`).join("");
    const list =
        keys.length === 0
            ? "[]"
            : `[\n${keys.map((key) => `    ${JSON.stringify(key)},`).join("\n")}\n]`;
    const emptyNote =
        keys.length === 0
            ? `\n * \`never\` while the Phase 0 catalogs are empty (#1515) — no strings have moved\n * yet. It becomes a real union as soon as the first message lands, at which\n * point call sites can be typed \`MessageKey\` instead of \`string\`.`
            : "";

    return `// AUTO-GENERATED by \`npm run codegen -w @doenet/i18n\`. Do not edit by hand.
//
// Every message id (and \`id.attribute\`) in locales/en/*.ftl, as a union.
// \`lint:i18n\` fails if this file drifts from the catalogs.

/**
 * A key \`createTranslator\`'s translator can resolve.${emptyNote}
 */
export type MessageKey = ${union};

/** Every key in the English catalogs, in catalog order. */
export const MESSAGE_KEYS: readonly MessageKey[] = ${list};
`;
}
