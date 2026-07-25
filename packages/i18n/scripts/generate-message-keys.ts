/**
 * Emit `src/generated/messageKeys.ts` from the English catalogs, giving
 * TypeScript a union of every key a translator can resolve.
 *
 * Run with `npm run codegen -w @doenet/i18n`. `lint:i18n` fails when the
 * committed file has drifted from the catalogs.
 */
import fs from "node:fs";
import path from "node:path";

import { DEFAULT_LOCALE } from "../src/catalogs";
import {
    GENERATED_KEYS_FILE,
    collectLocaleKeys,
    renderMessageKeysModule,
} from "./catalogUtils";

const keys = collectLocaleKeys(DEFAULT_LOCALE).map((entry) => entry.key);
const contents = await renderMessageKeysModule(keys);

fs.mkdirSync(path.dirname(GENERATED_KEYS_FILE), { recursive: true });
fs.writeFileSync(GENERATED_KEYS_FILE, contents);

console.log(
    `Wrote ${path.relative(process.cwd(), GENERATED_KEYS_FILE)} with ${keys.length} key(s).`,
);
