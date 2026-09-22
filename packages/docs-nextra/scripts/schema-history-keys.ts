/*
 * The schema history's key space and index shape — everything a *reader* of
 * `generated/schema-history.json` needs, and nothing that derives it.
 *
 * Kept apart from `schema-history.ts` because that module imports
 * `node:child_process` to read git, and the docs' attribute and property tables
 * (`components/props-display.tsx`) are client components. Importing the
 * derivation from one of those fails the build outright — webpack reports
 * `UnhandledSchemeError: Reading from "node:child_process"` — so the half that
 * renders a badge has to be importable without it.
 *
 * `schema-history.ts` re-exports all of this, so the derivation side can keep
 * importing from there alone.
 */

/**
 * Stands in for a version wherever an item is in the working-tree schema but
 * in no release yet. The index covers *released* versions only, so "absent
 * from `since`" is exactly "unreleased" — which is what lets the docs mark a
 * feature as in development with no annotation for anyone to maintain.
 */
export const UNRELEASED = "unreleased";

/**
 * Key space: `el:<element>`, `at:<element>.<attr>`, `pr:<element>.<prop>`,
 * `va:<element>.<attr>.<value>`.
 */
export type SchemaHistoryKey = string;

/**
 * Every kind of key the index holds, each with a plural label for a report.
 *
 * Lives here rather than in the one script that groups keys this way, because
 * it is a claim about the key space: a reader that covers this list covers the
 * whole index. `test/schema-history.test.ts` holds it to that against the real
 * tags, so a fifth kind added to `schemaKeys` cannot quietly go unreported.
 */
export const HISTORY_KEY_KINDS = [
    { prefix: "el:", label: "elements" },
    { prefix: "at:", label: "attributes" },
    { prefix: "pr:", label: "properties" },
    { prefix: "va:", label: "attribute values" },
] as const;

/** The history key for an element. */
export function elementHistoryKey(element: string): SchemaHistoryKey {
    return `el:${element}`;
}

/** The history key for one of an element's attributes. */
export function attributeHistoryKey(
    element: string,
    attribute: string,
): SchemaHistoryKey {
    return `at:${element}.${attribute}`;
}

/**
 * The history key for one of the values an enumerated attribute accepts.
 *
 * A value is keyed under the attribute that accepts it rather than on its own,
 * because the same spelling means different things on different attributes:
 * `gaussian` on `selectRandomNumbers.type` and on a styling attribute are
 * unrelated, and each arrived when its own attribute learned it.
 */
export function attributeValueHistoryKey(
    element: string,
    attribute: string,
    value: string,
): SchemaHistoryKey {
    return `va:${element}.${attribute}.${value}`;
}

/** The history key for one of an element's properties. */
export function propertyHistoryKey(
    element: string,
    property: string,
): SchemaHistoryKey {
    return `pr:${element}.${property}`;
}

/** The shape of `generated/schema-history.json`. */
export type SchemaHistory = {
    /** The newest release the index was built from, e.g. `"0.7.27"`. */
    latestReleasedVersion: string;
    /** Every release the index covers, oldest first. */
    versions: string[];
    /**
     * Key -> the release its *latest contiguous run of presence* began in.
     * A key whose value is the oldest release covered appeared then or earlier.
     *
     * The index covers *released* versions only, so a key in the working-tree
     * schema with no entry here is by definition unreleased — which is what
     * lets the docs mark it as in development with no annotation to maintain.
     */
    since: Record<SchemaHistoryKey, string>;
    /**
     * Key -> the release it disappeared in, for keys absent from
     * `latestReleasedVersion`. Only those keys appear here.
     */
    removedIn: Record<SchemaHistoryKey, string>;
};
