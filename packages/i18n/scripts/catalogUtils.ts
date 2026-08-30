import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { FluentBundle, FluentResource } from "@fluent/bundle";
import {
    parse as parseFtl,
    Visitor,
    type FunctionReference,
    type TextElement,
    type Variant,
} from "@fluent/syntax";
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
 * The committed roster of locales with a catalog directory, with each one's
 * name in English and in itself.
 *
 * Derived from `locales/` rather than from `BUNDLED_LOCALES`, which answers a
 * different question — see "The roster is not the bundle" in the package
 * README.
 */
export const SUPPORTED_LOCALES_FILE = path.join(
    PACKAGE_ROOT,
    "src",
    "generated",
    "supportedLocales.ts",
);

/** The module whose glob decides which catalogs are code-split. */
export const LOAD_MODULE_FILE = path.join(PACKAGE_ROOT, "src", "load.ts");

/** `!../locales/<locale>/*.ftl` inside the lazy-catalog glob. */
const GLOB_EXCLUSION_PATTERN = /"!\.\.\/locales\/([^/"]+)\/\*\.ftl"/g;

/**
 * The locales `load.ts` excludes from its lazy-catalog glob.
 *
 * Read out of the source text because a glob pattern is resolved at build time
 * and cannot be derived from a runtime list. That is the whole reason this
 * needs checking: the exclusions have to be spelled out, and spelled-out lists
 * drift. They are meant to be exactly the locales already inlined, so
 * `lint:i18n` compares them against `BUNDLED_LOCALES`.
 */
export function lazyGlobExclusions(): string[] {
    const source = fs.readFileSync(LOAD_MODULE_FILE, "utf8");
    return [...source.matchAll(GLOB_EXCLUSION_PATTERN)]
        .map((match) => match[1])
        .sort();
}

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

/**
 * Every place a catalog names a numbering system on a Fluent builtin, each
 * reported with the entry it sits in.
 *
 * `NUMBER($ratio, numberingSystem: "beng")` opts one message out of the digit
 * policy `intlLocale` pins, and nothing at runtime says so — the number simply
 * comes back in another script, in one message, in one language. That is the
 * rule catalog authors would have to remember, which is why it is checked
 * instead: the policy is a product-wide answer (`src/intl.ts`), and a catalog
 * is not where it gets reopened.
 *
 * Read off the AST rather than by searching the text, so that the group
 * comments explaining the policy can say the word.
 */
export function numberingSystemOverrides(source: string): string[] {
    const found: string[] = [];
    for (const entry of parseFtl(source, {}).body) {
        if (entry.type !== "Message" && entry.type !== "Term") {
            continue;
        }
        const visitor = new NumberingSystemVisitor();
        visitor.visit(entry);
        found.push(
            ...visitor.found.map(
                (builtin) =>
                    `${builtin}() sets numberingSystem in "${entry.id.name}"`,
            ),
        );
    }
    return found;
}

/** The builtins under one entry that name a numbering system. */
class NumberingSystemVisitor extends Visitor {
    found: string[] = [];

    visitFunctionReference(node: FunctionReference) {
        if (
            node.arguments.named.some(
                (argument) => argument.name.name === "numberingSystem",
            )
        ) {
            this.found.push(node.id.name);
        }
        this.genericVisit(node);
    }
}

/**
 * Every entry whose rendered value would carry a newline, by id.
 *
 * A Fluent pattern that continues onto a further line keeps the `\n` in what it
 * renders, and none of these messages wants one: they are button labels,
 * sentences and phrases an author interpolates. Nothing else catches it — the
 * catalog parses, the lint's key extraction sees the id it expects, and the
 * newline only shows up in the browser.
 *
 * The failure that motivates it is not a wrapped sentence but a misplaced
 * comment. A `#` line indented under a message is not a comment at all; Fluent
 * reads it as more of the pattern above it, so the note explaining a wording
 * choice becomes part of the words. That is how English prose ends up rendered
 * inside a translated document, which is exactly the outcome the catalogs
 * exist to prevent.
 *
 * A select nested inside a pattern is fine and is how a message sub-divides
 * one of its variants — what matters is that each variant's own content stays
 * on one line. See "Composition, not substitution" in the package README.
 */
export function multilinePatterns(source: string): string[] {
    const found: string[] = [];
    for (const entry of parseFtl(source, {}).body) {
        if (entry.type !== "Message" && entry.type !== "Term") {
            continue;
        }
        const visitor = new MultilineTextVisitor();
        visitor.visit(entry);
        if (visitor.found.length > 0) {
            found.push(
                `"${entry.id.name}" renders a newline (${visitor.found[0]})`,
            );
        }
    }
    return found;
}

/** The text runs under one entry that span more than one line. */
class MultilineTextVisitor extends Visitor {
    found: string[] = [];

    visitTextElement(node: TextElement) {
        if (node.value.includes("\n")) {
            // The line after the break is what a reader would see appended,
            // and is the most recognizable half of a swallowed comment.
            const continuation = node.value.split("\n")[1]?.trim() ?? "";
            this.found.push(
                continuation.startsWith("#")
                    ? `an indented comment line is part of the pattern: ${JSON.stringify(continuation.slice(0, 40))}`
                    : `continues with ${JSON.stringify(continuation.slice(0, 40))}`,
            );
        }
        this.genericVisit(node);
    }
}

/**
 * The plural categories, plus the numeric literals a `{ $count -> … }` may
 * name. These are the variant keys a translation is *supposed* to change:
 * CLDR gives each language its own set, and a catalog that resolves `one` and
 * `other` where English resolves `one`, `two` and `other` is correct rather
 * than broken. Every other variant key is a symbol the core passes in, and
 * must survive translation letter for letter.
 */
const PLURAL_VARIANT_KEYS = new Set([
    "zero",
    "one",
    "two",
    "few",
    "many",
    "other",
]);

/**
 * The symbolic variant keys each entry selects on, keyed as Fluent addresses
 * the entry — a message by its id, a term by its id with the leading `-`.
 *
 * A Fluent selector is matched against the value the caller passes — `$parts`,
 * `$context`, `$status` — so its keys are part of the interface and not part
 * of the prose. Translating one silently unreaches that branch: the message
 * still parses, still lints, and quietly renders its default for every input
 * that should have chosen the translated key. `locales/fit` did exactly that,
 * applying Meänkieli's `on` → `oon` spelling rule to
 * `[text-on-background]`, and nothing caught it until a reader would have.
 *
 * Numeric and plural-category keys are left out, because those are the ones a
 * language is entitled to differ on. What comes back is comparable across
 * locales: the same message should list the same symbols in English and in
 * every translation of it.
 */
export function symbolicVariantKeys(source: string): Map<string, string[]> {
    const keys = new Map<string, string[]>();
    for (const entry of parseFtl(source, {}).body) {
        if (entry.type !== "Message" && entry.type !== "Term") {
            continue;
        }
        const visitor = new VariantKeyVisitor();
        visitor.visit(entry);
        if (visitor.found.size > 0) {
            // Sorted and deduplicated: a message with two selects — the
            // `$parts` fork with a `$gender` one nested inside it — names a
            // key once per branch it appears on, and what the caller compares
            // is the set, not how often each one occurs.
            const id =
                entry.type === "Term" ? `-${entry.id.name}` : entry.id.name;
            keys.set(id, [...visitor.found].sort());
        }
    }
    return keys;
}

/** Every symbolic (non-numeric, non-plural) variant key under one entry. */
class VariantKeyVisitor extends Visitor {
    found = new Set<string>();

    visitVariant(node: Variant) {
        if (
            node.key.type === "Identifier" &&
            !PLURAL_VARIANT_KEYS.has(node.key.name)
        ) {
            this.found.add(node.key.name);
        }
        this.genericVisit(node);
    }
}

/**
 * The plural-category variant keys a catalog writes.
 *
 * The mirror of {@link symbolicVariantKeys}, and read for the opposite
 * reason. A symbolic key is part of the interface and must match English; a
 * plural key is part of the *language*, and what matters about it is whether
 * the reader's locale can ever select it.
 *
 * `other` is left out because it is always reachable: Fluent's default variant
 * answers every input no rule claims, so writing it can never be dead. Numeric
 * literals — `[0]`, `[1]` — are left out too, and for a sharper reason: they
 * are matched against the *number* rather than against a category, so they
 * stay selectable in a language whose only category is `other`. That
 * distinction is what keeps `locales/km`'s `[0]` branch legal while its `[one]`
 * branch was not.
 */
export function pluralVariantKeys(source: string): string[] {
    const visitor = new PluralVariantKeyVisitor();
    visitor.visit(parseFtl(source, {}));
    return [...visitor.found].sort();
}

/** Every plural-category variant key in a catalog, `other` excepted. */
class PluralVariantKeyVisitor extends Visitor {
    found = new Set<string>();

    visitVariant(node: Variant) {
        if (
            node.key.type === "Identifier" &&
            PLURAL_VARIANT_KEYS.has(node.key.name) &&
            node.key.name !== "other"
        ) {
            this.found.add(node.key.name);
        }
        this.genericVisit(node);
    }
}

/**
 * The plural categories a locale is entitled to write, and why the answer is
 * not simply "the ones CLDR lists".
 *
 * A category branch is selected by `Intl.PluralRules`, which resolves the tag
 * against the *runtime's* data. Two things can go wrong, and this repository
 * has had both:
 *
 *   * a locale CLDR knows can still be given a category it does not have.
 *     Khmer has only `other`, and `locales/km` carried a `[one]` branch that
 *     nothing could ever reach — text that looked translated, lint that
 *     passed, and a variant that never rendered;
 *   * a locale CLDR does *not* know resolves to the runtime's default locale,
 *     so every category branch in it is selected by some other language's
 *     rules. That is why no seeded catalog for such a tag writes `zero`, `two`,
 *     `few` or `many`, and why several of their headers say so in as many
 *     words.
 *
 * `one` is the deliberate exception in the second case. Around a hundred
 * catalogs are for tags CLDR has no data for, and they keep English's
 * `one`/`other` split because it is the split the fallback makes and it reads
 * correctly for them. Forbidding it would be a change to a hundred catalogs
 * rather than a lint rule, and each of those headers already records the
 * trade.
 *
 * The tag is canonicalized before it is asked about, because ICU folds three
 * of this repository's directory names onto a macrolanguage — `kmr` to `ku`,
 * `kpv` to `kv`, `mhr` to `chm` — and `kmr` genuinely inherits `ku`'s rules.
 */
export function allowedPluralCategories(locale: string): Set<string> {
    let canonicalLanguage: string;
    try {
        canonicalLanguage = new Intl.Locale(locale).toString().split("-")[0];
    } catch {
        // A tag `Intl` cannot parse reaches English at runtime, so it is the
        // no-data case — see `createTranslator` in the package README.
        return new Set(["one", "other"]);
    }
    const resolved = new Intl.PluralRules(locale).resolvedOptions();
    const hasOwnData = resolved.locale.split("-")[0] === canonicalLanguage;
    return hasOwnData
        ? new Set(resolved.pluralCategories)
        : new Set(["one", "other"]);
}

/**
 * The plural categories a catalog writes that its own locale cannot select.
 *
 * Empty for a healthy catalog. Anything in it is text that parses, lints and
 * never renders.
 */
export function unselectablePluralCategories(
    locale: string,
    source: string,
): string[] {
    const allowed = allowedPluralCategories(locale);
    return pluralVariantKeys(source).filter((key) => !allowed.has(key));
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
 * Lay `source` out the way the committed copy of `file` is laid out.
 *
 * Every generated module goes through here, so `lint:i18n` can compare what it
 * renders against the committed file byte for byte without `prettier:check`
 * and this script disagreeing about the result.
 */
async function formatGeneratedModule(
    file: string,
    source: string,
): Promise<string> {
    const prettierConfig = await prettier.resolveConfig(file);
    return prettier.format(source, {
        ...prettierConfig,
        filepath: file,
        parser: "typescript",
    });
}

/** The contents `src/generated/messageKeys.ts` should have for these keys. */
export async function renderMessageKeysModule(keys: string[]): Promise<string> {
    return formatGeneratedModule(
        GENERATED_KEYS_FILE,
        renderMessageKeysModuleRaw(keys),
    );
}

/**
 * The contents `src/generated/supportedLocales.ts` should have for these
 * locales.
 */
export async function renderSupportedLocalesModule(
    locales: string[],
): Promise<string> {
    return formatGeneratedModule(
        SUPPORTED_LOCALES_FILE,
        renderSupportedLocalesModuleRaw(locales),
    );
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

/**
 * The body of a string-literal union — one member per line, or `never` when
 * there is nothing to union. Shared by the two generated modules; Prettier
 * reflows it, so only the members themselves matter.
 */
function renderUnionMembers(values: string[]): string {
    return values.length === 0
        ? "never"
        : values.map((value) => `\n    | ${JSON.stringify(value)}`).join("");
}

/**
 * Names for the locales CLDR has no language data for at all.
 *
 * Without it `dag` would be labelled "dag" — which tells a reader choosing a
 * `<document lang>` nothing about what language it is, and is what this table
 * exists to prevent. It is consulted **only** where ICU had no name at all, so
 * it can fill a gap and can never override CLDR: the roster still names a
 * language whatever CLDR names it, and an entry here quietly stops being read
 * the day ICU learns a name of its own.
 *
 * These names are **unreviewed and machine-generated**, the same status as the
 * seed catalogs they accompany; they are the best available answer, not a
 * speaker's. `endonym` is therefore optional: an entry whose endonym turns out
 * to be wrong should have the field deleted rather than guessed at again, and
 * the endonym then falls back to the tag, so the label reads "Baoulé (bci)" —
 * an admitted gap rather than a guess, and legible either way. `englishName` is
 * required because an English name is what identifies a language to someone
 * choosing one and costs nothing to be sure of.
 *
 * Keep this table as small as it can be. Two tests hold it to that: one fails
 * if any locale's label is still just its code, so a future batch cannot
 * silently reintroduce the gap, and one fails on an entry ICU no longer needs,
 * so entries are deleted rather than left to rot.
 */
export const LOCALE_NAME_FALLBACKS: Record<
    string,
    { englishName: string; endonym?: string }
> = {
    // Nahuatl predates the West and Central African batch and had the same
    // gap; it is fixed here because the same table covers it at no extra cost.
    // The catalog is Central Nahuatl — see `MACROLANGUAGE_MEMBERS` in
    // `negotiate.ts` — and "Nahuatl" is what names the group it stands for.
    nah: { englishName: "Nahuatl", endonym: "Nāhuatl" },
    dag: { englishName: "Dagbani", endonym: "Dagbanli" },
    ktu: { englishName: "Kituba", endonym: "Kikongo ya leta" },
    mnk: { englishName: "Mandinka", endonym: "Mandinkakaŋo" },
    // ISO 639-3's reference name, which is also what `locales/kbp`'s header
    // and the README call it; the grave is part of the spelling rather than a
    // French borrowing of it.
    kbp: { englishName: "Kabiyè", endonym: "Kabɩyɛ" },
    // `Intl.DisplayNames` has no entry for any of these three, from the West
    // and Central African batch continued (`locales/bci`, `locales/lom`,
    // `locales/urh`). None gets an endonym here: `locales/bci`'s header does
    // not commit to one, `locales/lom`'s header explicitly declines to choose
    // between "Löömàgòòi" (the Liberian name) and "Toma" (the Guinean one),
    // and no confidently-attested endonym for `locales/urh` turned up in this
    // seed's own research — a wrong endonym is worse than none.
    bci: { englishName: "Baoulé" },
    lom: { englishName: "Loma" },
    urh: { englishName: "Urhobo" },
    // The two locales of the Caucasus and Kurdish batch CLDR has no data for.
    // Both are Dagestanian languages written in Cyrillic, and they part company
    // over the endonym for the reason `locales/bci` and `locales/lom` did:
    // `locales/lbe`'s own header names the language «лакку маз» and three of its
    // four files repeat it, while no `locales/tab` header commits to a
    // self-name in any script. So Lak gets an endonym and Tabasaran does not,
    // and Tabasaran's label reads "Tabasaran (tab)" — `locales/bci`'s shape,
    // an admitted gap rather than a guess.
    lbe: { englishName: "Lak", endonym: "лакку маз" },
    tab: { englishName: "Tabasaran" },
    // The four locales of the Uralic north batch CLDR has no data for. Three
    // are written in Cyrillic, and they part company over the endonym the way
    // `locales/lbe` and `locales/tab` do: `locales/sjd`, `locales/kca` and
    // `locales/mns` each name their language in their own headers, and those
    // spellings — breves, macrons and all — are copied here letter for letter,
    // while no `locales/olo` header commits to a self-name, so its label reads
    // "Livvi-Karelian (olo)" rather than guessing between the Livvi and the
    // Finnish spelling of it.
    sjd: { englishName: "Kildin Sami", endonym: "кӣллт са̄мь кӣлл" },
    olo: { englishName: "Livvi-Karelian" },
    kca: { englishName: "Khanty", endonym: "хӑнты ясӑӈ" },
    mns: { englishName: "Mansi", endonym: "мāньси лāтыӈ" },
    // The one locale of the Oceania batch CLDR has no data for, and the batch
    // is otherwise the best-named this roster has had: ICU knows ten of the
    // eleven tags, down to `tkl` and `niu`. `wls` it knows in no language
    // at all, not even its own, so without this entry a Wallisian reader would
    // be offered "wls" in `<document lang>`'s autocomplete. The endonym is
    // copied letter for letter from `locales/wls`'s own headers, `locales/sjd`
    // fashion rather than `locales/olo` fashion, because those headers do
    // commit to a self-name: the ʻokina is U+02BB, the same character the
    // catalog writes throughout, and there is no macron in it.
    wls: { englishName: "Wallisian", endonym: "Fakaʻuvea" },
};

/**
 * A locale's name in English and in itself, e.g.
 * `{ englishName: "Spanish", endonym: "español" }`.
 *
 * Derived rather than hand-written, which is the point: a hand-maintained
 * description per locale is exactly the per-language work that would stop this
 * from scaling, and the schema generator hard-fails on an empty description.
 * Computing the names here rather than at runtime also keeps `Intl` off the
 * worker's path, where a tag it cannot parse is a live hazard (see the note on
 * unparseable tags in the package README). The names therefore come from the
 * ICU data of whatever Node ran `codegen`; if `lint:i18n` reports drift no
 * catalog change explains, that is where to look.
 *
 * No tag can fail the build. A structurally invalid one makes
 * `Intl.DisplayNames` throw; a well-formed one ICU has no data for is asked
 * with `fallback: "none"`, so it comes back `undefined` rather than as ICU's
 * own rendering of the tag's subtags (`"zz-QQ"` would otherwise be `"zz (QQ)"`,
 * which reads like a name and is not one). Both cases land in the same place:
 * {@link LOCALE_NAME_FALLBACKS} if it has an entry, and otherwise the tag —
 * usable, never blank, and detectably a code.
 *
 * Asking for `undefined` rather than comparing the answer against the tag is
 * what makes the gap detectable whatever shape the tag has: `dag-Latn` renders
 * as `"dag (Latin)"`, which no `=== locale` test would ever catch.
 */
function localeNames(locale: string): { englishName: string; endonym: string } {
    function nameIn(displayLocale: string): string | undefined {
        try {
            return new Intl.DisplayNames([displayLocale], {
                type: "language",
                fallback: "none",
            }).of(locale);
        } catch {
            return undefined;
        }
    }
    const fallback = LOCALE_NAME_FALLBACKS[locale];

    // The table fills a gap and never overrides ICU: it is read only where ICU
    // had nothing. So the rule stays "the roster names a language whatever
    // CLDR names it", and the day CLDR learns one of these the table stops
    // being consulted for it without anyone having to notice.
    return {
        englishName: nameIn(DEFAULT_LOCALE) ?? fallback?.englishName ?? locale,
        endonym: nameIn(locale) ?? fallback?.endonym ?? locale,
    };
}

function renderSupportedLocalesModuleRaw(locales: string[]): string {
    const entries = locales.map((locale) => {
        const { englishName, endonym } = localeNames(locale);
        // English and the endonym coincide for English itself, and for any
        // locale `Intl` doesn't know (both fall back to the tag). Repeating
        // the same word in parentheses would read as a mistake.
        //
        // The parenthesis is always the endonym, never a region, however much
        // one of them looks like it: ICU's endonym for `id` is "Indonesia", so
        // Indonesian labels itself "Indonesian (Indonesia)".
        const label =
            englishName === endonym
                ? englishName
                : `${englishName} (${endonym})`;
        return { locale, englishName, endonym, label };
    });
    // Emitted as JSON and handed to Prettier, which quotes only the values and
    // lays the objects out exactly as this file's style demands.
    const list = JSON.stringify(entries);

    return `// AUTO-GENERATED by \`npm run codegen -w @doenet/i18n\`. Do not edit by hand.
//
// Every locale with a catalog directory under locales/, with its name in
// English and in itself. \`lint:i18n\` fails if this file drifts from the
// directory.

/** A locale this repository ships a catalog for. */
export type SupportedLocale = ${renderUnionMembers(locales)};

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
 * The *roster*, not the delivery mechanism: it is generated from the
 * \`locales/\` directory, so it lists every language this repository ships a
 * translation for, whether or not the bundle carries it. Read
 * \`BUNDLED_LOCALES\` for "which catalogs are in this JS bundle" instead — today
 * that is English alone.
 *
 * A deployment can always supply a catalog of its own that is not listed here.
 * That is why the surfaces built on this list suggest rather than enforce: an
 * unlisted tag is not an error.
 */
export const SUPPORTED_LOCALES: readonly SupportedLocaleInfo[] = ${list};
`;
}

function renderMessageKeysModuleRaw(keys: string[]): string {
    const union = renderUnionMembers(keys);
    // As with the locale roster: emitted as JSON, laid out by Prettier.
    const list = JSON.stringify(keys);
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
