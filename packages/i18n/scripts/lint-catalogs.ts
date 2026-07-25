/**
 * CI guard for the message catalogs. Run with `npm run lint:i18n`.
 *
 * Checks, in order:
 *  1. every catalog parses as Fluent;
 *  2. no key is defined twice within a locale (namespaces share one bundle);
 *  3. no translated locale defines a key English doesn't have (a typo'd key in
 *     a translation is invisible at runtime — it just never resolves);
 *  4. `src/generated/messageKeys.ts` matches the English catalogs;
 *  5. every key referenced from source exists in English;
 *  6. every English key is referenced from source (no orphans).
 *
 * Missing keys in a *translated* locale are reported as coverage, not failure:
 * a partial translation is legitimate and falls back to English.
 */
import fs from "node:fs";

import { CATALOG_NAMESPACES } from "../src/namespaces";
import { DEFAULT_LOCALE } from "../src/catalogs";
import {
    GENERATED_KEYS_FILE,
    catalogParseErrors,
    collectCallSites,
    collectLocaleKeys,
    listLocales,
    readCatalog,
    renderMessageKeysModule,
} from "./catalogUtils";

const problems: string[] = [];
const notes: string[] = [];

const locales = listLocales();
if (!locales.includes(DEFAULT_LOCALE)) {
    problems.push(
        `No locales/${DEFAULT_LOCALE} directory — English terminates every fallback chain and must exist`,
    );
}

// 1 & 2: per-locale parse and uniqueness.
for (const locale of locales) {
    for (const namespace of CATALOG_NAMESPACES) {
        const source = readCatalog(locale, namespace);
        if (source === null) {
            if (locale === DEFAULT_LOCALE) {
                problems.push(
                    `locales/${locale}/${namespace}.ftl is missing (every namespace must exist in ${DEFAULT_LOCALE})`,
                );
            }
            continue;
        }
        for (const error of catalogParseErrors(source)) {
            problems.push(`locales/${locale}/${namespace}.ftl: ${error}`);
        }
    }

    const seen = new Map<string, string>();
    for (const { key, namespace } of collectLocaleKeys(locale)) {
        const previous = seen.get(key);
        if (previous !== undefined) {
            problems.push(
                `locales/${locale}: "${key}" is defined in both ${previous}.ftl and ${namespace}.ftl`,
            );
        } else {
            seen.set(key, namespace);
        }
    }
}

const englishKeys = collectLocaleKeys(DEFAULT_LOCALE).map((entry) => entry.key);
const englishKeySet = new Set(englishKeys);

// 3: translations may lag English, but may not invent keys.
for (const locale of locales) {
    if (locale === DEFAULT_LOCALE) {
        continue;
    }
    const localeKeys = collectLocaleKeys(locale);
    for (const { key, namespace } of localeKeys) {
        if (!englishKeySet.has(key)) {
            problems.push(
                `locales/${locale}/${namespace}.ftl: "${key}" has no ${DEFAULT_LOCALE} counterpart`,
            );
        }
    }
    const translated = new Set(localeKeys.map((entry) => entry.key));
    const missing = englishKeys.filter((key) => !translated.has(key));
    if (missing.length > 0) {
        notes.push(
            `locales/${locale}: ${translated.size}/${englishKeys.length} keys translated (${missing.length} fall back to ${DEFAULT_LOCALE})`,
        );
    }
}

// 4: the generated key union is committed, so it has to stay in sync.
const expectedGenerated = await renderMessageKeysModule(englishKeys);
const actualGenerated = fs.existsSync(GENERATED_KEYS_FILE)
    ? fs.readFileSync(GENERATED_KEYS_FILE, "utf-8")
    : "";
if (actualGenerated !== expectedGenerated) {
    problems.push(
        "src/generated/messageKeys.ts is out of date — run `npm run codegen -w @doenet/i18n`",
    );
}

// 5 & 6: source and catalogs agree in both directions.
const callSites = collectCallSites();
const referenced = new Set(callSites.map((site) => site.key));

for (const site of callSites) {
    if (!englishKeySet.has(site.key)) {
        problems.push(
            `${site.file}: "${site.key}" is not defined in locales/${DEFAULT_LOCALE}`,
        );
    }
}

for (const key of englishKeys) {
    if (!referenced.has(key)) {
        problems.push(
            `locales/${DEFAULT_LOCALE}: "${key}" is not referenced from any source file`,
        );
    }
}

for (const note of notes) {
    console.log(note);
}

if (problems.length > 0) {
    console.error(`\ni18n catalog lint found ${problems.length} problem(s):`);
    for (const problem of problems) {
        console.error(`  - ${problem}`);
    }
    process.exit(1);
}

console.log(
    `i18n catalog lint passed: ${englishKeys.length} key(s) across ${locales.length} locale(s), ${callSites.length} call site(s).`,
);
