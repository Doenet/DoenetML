/*
 * Turn the schema history index into the one value each documented item needs:
 * the release it arrived in, or nothing at all when saying so would be noise.
 *
 * `schema-history.ts` answers "when did this key appear". This module answers
 * "what should the page say about it", which is a smaller question, because
 * most of the 12,191 keys should say nothing:
 *
 *   - An item that arrived with its element carries no badge of its own. The
 *     element's badge already covers it. `<chart>` arrived in 0.7.27 with 70
 *     keys and should read as one new component, not 70 new attributes; this
 *     rule is what removes most of the markers.
 *   - An element present in the oldest release the index covers carries none
 *     either. The index cannot tell "arrived in 0.7.0" from "arrived earlier",
 *     and there is no version below it for a reader to select, so that badge
 *     could never be shown.
 *
 * The remainder is what `compute-optimized-schema.ts` threads through to the
 * page, and what `components/since-badge.tsx` renders.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import {
    attributeHistoryKey,
    elementHistoryKey,
    propertyHistoryKey,
    UNRELEASED,
    type SchemaHistory,
    type SchemaHistoryKey,
} from "./schema-history-keys";

/**
 * Where `generate-schema-history.ts` writes the index, resolved relative to
 * this module rather than the working directory. `scripts/` (under vite-node)
 * and `dist/` (after the lib build the remark plugins are loaded from) both sit
 * one level under the package root, so the same relative path serves both.
 *
 * Joined rather than written as `new URL("…", import.meta.url)`: Vite treats
 * that form as an asset reference and the lib build would inline the whole
 * 600 KB index into `dist/index.js` as a `data:` URL, which `fileURLToPath`
 * then refuses.
 */
const INDEX_PATH = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../generated/schema-history.json",
);

/**
 * Read the generated index.
 *
 * Throws rather than falling back to an empty index: with no history every key
 * looks unreleased, so a silent fallback would badge all 12,000 of them as in
 * development. `build:pre` runs the generator before anything that calls this.
 */
export function loadSchemaHistory(): SchemaHistory {
    let raw: string;
    try {
        raw = fs.readFileSync(INDEX_PATH, "utf8");
    } catch (e) {
        throw new Error(
            `No schema history at ${INDEX_PATH}. It is derived from the ` +
                `release tags rather than committed, so it has to be built ` +
                `before the docs are: run \`npm run build:pre\` (or ` +
                `\`npm run build:pre-schema-history\` alone).`,
            { cause: e },
        );
    }
    return JSON.parse(raw);
}

/** The release each documented item arrived in, or `undefined` for no badge. */
export type SchemaSince = {
    element(element: string): string | undefined;
    attribute(element: string, attribute: string): string | undefined;
    property(element: string, property: string): string | undefined;
};

/** Apply the badge rules above to one history index. */
export function schemaSince(history: SchemaHistory): SchemaSince {
    // A key the index has never seen is in the working-tree schema only.
    const arrivedIn = (key: SchemaHistoryKey) =>
        history.since[key] ?? UNRELEASED;

    // Recorded as the oldest covered release, which reads "then or earlier".
    const oldestCovered = history.versions[0];

    /** Say nothing when the element's own badge already says it. */
    const memberOf = (element: string, key: SchemaHistoryKey) => {
        const since = arrivedIn(key);
        return since === arrivedIn(elementHistoryKey(element))
            ? undefined
            : since;
    };

    return {
        element(element) {
            const since = arrivedIn(elementHistoryKey(element));
            return since === oldestCovered ? undefined : since;
        },
        attribute(element, attribute) {
            return memberOf(element, attributeHistoryKey(element, attribute));
        },
        property(element, property) {
            return memberOf(element, propertyHistoryKey(element, property));
        },
    };
}
