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
 *  6. every English key is referenced from source (no orphans);
 *  7. diagnostic codes are well-formed, resolvable, and append-only.
 *
 * Missing keys in a *translated* locale are reported as coverage, not failure:
 * a partial translation is legitimate and falls back to English.
 */
import fs from "node:fs";

import { CATALOG_NAMESPACES } from "../src/namespaces";
import { DEFAULT_LOCALE } from "../src/catalogs";
import {
    DIAGNOSTIC_CODES,
    DIAGNOSTIC_CODE_PATTERN,
    RETIRED_DIAGNOSTIC_CODES,
    isDiagnosticCode,
    type DiagnosticCode,
} from "../src/diagnostics";
import {
    DIAGNOSTIC_CODES_LOCK_FILE,
    GENERATED_KEYS_FILE,
    catalogParseErrors,
    collectCallSites,
    collectDiagnosticUsage,
    collectLocaleKeys,
    listLocales,
    mergeDiagnosticCodesLock,
    readCatalog,
    readDiagnosticCodesLock,
    renderDiagnosticCodesLock,
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
//
// The diagnostic registry counts as a call site. Its keys are reached by code
// rather than by a literal `t("key")`, which the call-site scan cannot see, so
// without this every diagnostic message would read as an orphan.
const callSites = collectCallSites();
const registryKeys = Object.values(DIAGNOSTIC_CODES);
const referenced = new Set([
    ...callSites.map((site) => site.key),
    ...registryKeys,
]);

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

// 7: diagnostic codes. Well-formed, resolvable, used only where defined, and
// never renumbered.
const lockedCodes = readDiagnosticCodesLock();
const diagnosticUsage = collectDiagnosticUsage();

for (const [code, key] of Object.entries(DIAGNOSTIC_CODES)) {
    if (!DIAGNOSTIC_CODE_PATTERN.test(code)) {
        problems.push(
            `src/diagnostics.ts: "${code}" is not a well-formed diagnostic code (doenet-[weia]NNNN)`,
        );
    }
    if (!englishKeySet.has(key)) {
        problems.push(
            `src/diagnostics.ts: "${code}" maps to "${key}", which is not defined in locales/${DEFAULT_LOCALE}`,
        );
    }
}

for (const [code, key] of Object.entries(lockedCodes)) {
    const current = DIAGNOSTIC_CODES[code as keyof typeof DIAGNOSTIC_CODES];
    if (current === undefined) {
        problems.push(
            `diagnostic-codes.lock.json: "${code}" was issued but src/diagnostics.ts no longer defines it — codes are append-only, so retire it in place rather than removing it`,
        );
    } else if (current !== key) {
        problems.push(
            `diagnostic-codes.lock.json: "${code}" was issued for "${key}" but src/diagnostics.ts now maps it to "${current}" — a code names one situation forever`,
        );
    }
}

const expectedLock = await renderDiagnosticCodesLock(
    mergeDiagnosticCodesLock(lockedCodes, DIAGNOSTIC_CODES),
);
const actualLock = fs.existsSync(DIAGNOSTIC_CODES_LOCK_FILE)
    ? fs.readFileSync(DIAGNOSTIC_CODES_LOCK_FILE, "utf-8")
    : "";
if (actualLock !== expectedLock) {
    problems.push(
        "diagnostic-codes.lock.json is out of date — run `npm run codegen -w @doenet/i18n`",
    );
}

for (const use of diagnosticUsage.codes) {
    // The same own-property test the runtime lookup uses, so "is this a
    // registered code?" has one answer everywhere: `in` would accept a code
    // that happens to name something on `Object.prototype`.
    if (!isDiagnosticCode(use.key)) {
        problems.push(
            `${use.file}: "${use.key}" is not defined in src/diagnostics.ts`,
        );
    }
}

const codedCallSites = new Set(diagnosticUsage.codes.map((use) => use.key));

// 8: every registered code is actually raised, unless it says it is retired.
//
// A code with no call site is a name nothing can produce. That happens by
// accident when codes are consolidated or renumbered: the last site using a
// number moves to another one and the registry entry is left behind. The lint
// used to report coverage as a note, so a stranded code shipped quietly;
// making it fatal is what keeps the next renumbering honest.
for (const code of Object.keys(DIAGNOSTIC_CODES) as DiagnosticCode[]) {
    const raised = codedCallSites.has(code);
    const retired = RETIRED_DIAGNOSTIC_CODES.has(code);
    if (!raised && !retired) {
        problems.push(
            `src/diagnostics.ts: "${code}" is registered but never raised — retire it in RETIRED_DIAGNOSTIC_CODES if that is deliberate`,
        );
    }
    // Keeps the retirement list from rotting: a situation that starts arising
    // again takes its code back, and the list has to say so.
    if (raised && retired) {
        problems.push(
            `src/diagnostics.ts: "${code}" is listed as retired but is raised again — drop it from RETIRED_DIAGNOSTIC_CODES`,
        );
    }
}

notes.push(
    `diagnostics: ${diagnosticUsage.codes.length} coded call site(s) covering ${codedCallSites.size}/${Object.keys(DIAGNOSTIC_CODES).length} code(s)${RETIRED_DIAGNOSTIC_CODES.size > 0 ? `, ${RETIRED_DIAGNOSTIC_CODES.size} retired` : ""}; ${diagnosticUsage.literalCount - diagnosticUsage.codes.length} raw diagnostic literal(s) still to migrate (#1518)`,
);

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
