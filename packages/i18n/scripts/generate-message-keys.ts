/**
 * Emit the two committed files derived from the catalogs and the diagnostic
 * registry:
 *
 *  - `src/generated/messageKeys.ts`, a union of every key a translator can
 *    resolve, so a mistyped key is a type error;
 *  - `diagnostic-codes.lock.json`, the append-only record of every diagnostic
 *    code ever issued.
 *
 * Run with `npm run codegen -w @doenet/i18n`. `lint:i18n` fails when either
 * committed file has drifted.
 */
import fs from "node:fs";
import path from "node:path";

import { DEFAULT_LOCALE } from "../src/catalogs";
import { DIAGNOSTIC_CODES } from "../src/diagnostics";
import {
    DIAGNOSTIC_CODES_LOCK_FILE,
    GENERATED_KEYS_FILE,
    collectLocaleKeys,
    mergeDiagnosticCodesLock,
    readDiagnosticCodesLock,
    renderDiagnosticCodesLock,
    renderMessageKeysModule,
} from "./catalogUtils";

const keys = collectLocaleKeys(DEFAULT_LOCALE).map((entry) => entry.key);
const contents = await renderMessageKeysModule(keys);

fs.mkdirSync(path.dirname(GENERATED_KEYS_FILE), { recursive: true });
fs.writeFileSync(GENERATED_KEYS_FILE, contents);

console.log(
    `Wrote ${path.relative(process.cwd(), GENERATED_KEYS_FILE)} with ${keys.length} key(s).`,
);

// Only ever grows: an existing entry is left as it was locked, so a code the
// registry has renumbered survives here and `lint:i18n` reports the conflict
// rather than codegen quietly blessing it.
const lock = mergeDiagnosticCodesLock(
    readDiagnosticCodesLock(),
    DIAGNOSTIC_CODES,
);
fs.writeFileSync(
    DIAGNOSTIC_CODES_LOCK_FILE,
    await renderDiagnosticCodesLock(lock),
);

console.log(
    `Wrote ${path.relative(process.cwd(), DIAGNOSTIC_CODES_LOCK_FILE)} with ${Object.keys(lock).length} code(s).`,
);
