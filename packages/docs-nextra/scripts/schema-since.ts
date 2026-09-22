/*
 * Turn the schema history index into the one value each documented item needs:
 * the release it arrived in, or nothing at all when saying so would be noise.
 *
 * `schema-history.ts` answers "when did this key appear". This module answers
 * "what should the page say about it", which is a smaller question, because
 * most of the schema's 19,697 keys should say nothing:
 *
 *   - An item that arrived with its element carries no badge of its own. The
 *     element's badge already covers it. `<chart>` arrived in 0.7.27 with 70
 *     keys and should read as one new component, not as a badge on each of its
 *     30 attributes and 39 properties as well; this rule removes most of the
 *     markers.
 *   - An element present in the oldest release the index covers carries none
 *     either. The index cannot tell "arrived in 0.7.0" from "arrived earlier",
 *     and there is no version below it for a reader to select, so that badge
 *     could never be shown.
 *
 * The first rule applies one level further down as well: the values an
 * enumerated attribute accepts are suppressed against the attribute, so a new
 * attribute does not repeat itself once per keyword in its value table.
 *
 * The remainder is what `compute-optimized-schema.ts` threads through to the
 * page, and what `components/since-badge.tsx` renders.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import {
    attributeHistoryKey,
    attributeValueHistoryKey,
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
 * looks unreleased, so a silent fallback would badge all 19,000-odd of them as in
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
    value(
        element: string,
        attribute: string,
        value: string,
    ): string | undefined;
};

/** Apply the badge rules above to one history index. */
export function schemaSince(history: SchemaHistory): SchemaSince {
    // A key the index has never seen is in the working-tree schema only. So is
    // one the index saw leave: `removedIn` holds exactly the keys absent from
    // the newest release, so a key listed there that the docs are still asking
    // about came back after that release. Its old `since` names a run that has
    // already ended, and taking it at face value would date the item to a
    // release that does not have it.
    const arrivedIn = (key: SchemaHistoryKey) =>
        key in history.removedIn
            ? UNRELEASED
            : (history.since[key] ?? UNRELEASED);

    // Recorded as the oldest covered release, which reads "then or earlier".
    const oldestCovered = history.versions[0];

    /**
     * Say nothing when the enclosing item's own badge already says it.
     *
     * `owner` is compared before suppression, not after: an attribute of a new
     * element is itself suppressed, and comparing against that `undefined`
     * would put every one of its values back on the page.
     */
    const partOf = (owner: SchemaHistoryKey, key: SchemaHistoryKey) => {
        const since = arrivedIn(key);
        return since === arrivedIn(owner) ? undefined : since;
    };

    return {
        element(element) {
            const since = arrivedIn(elementHistoryKey(element));
            return since === oldestCovered ? undefined : since;
        },
        attribute(element, attribute) {
            return partOf(
                elementHistoryKey(element),
                attributeHistoryKey(element, attribute),
            );
        },
        property(element, property) {
            return partOf(
                elementHistoryKey(element),
                propertyHistoryKey(element, property),
            );
        },
        value(element, attribute, value) {
            return partOf(
                attributeHistoryKey(element, attribute),
                attributeValueHistoryKey(element, attribute, value),
            );
        },
    };
}
