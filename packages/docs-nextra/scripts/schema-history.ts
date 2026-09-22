/*
 * Derive, from git alone, the release in which each schema key first appeared.
 *
 * `@doenet/static-assets`' `src/generated/doenet-schema.json` is committed, so
 * every release tag carries a full snapshot of the schema as it stood at that
 * release. Diffing the snapshots gives an exact, retroactive answer to "which
 * version did this attribute first appear in" — no builds at old tags, no hand
 * annotation, and nothing for a contributor to remember.
 *
 * This module holds the derivation and the `git` reading. The run rule is
 * unit-tested in `test/schema-history.test.ts`; `generate-schema-history.ts`
 * writes the index during the docs build and `report-schema-changes.ts` prints
 * what a release changed.
 *
 * The key space and the index's shape live in `schema-history-keys.ts` instead,
 * because reading git means importing `node:child_process` and the components
 * that will render the index are client components. Everything there is
 * re-exported here, so the derivation side needs only this module.
 */

import { execFileSync } from "node:child_process";
import {
    attributeHistoryKey,
    attributeValueHistoryKey,
    elementHistoryKey,
    propertyHistoryKey,
    type SchemaHistory,
    type SchemaHistoryKey,
} from "./schema-history-keys";

export * from "./schema-history-keys";

/**
 * The parts of the schema JSON this derivation reads. Deliberately loose: it
 * has to parse snapshots going back to v0.7.0, which carry neither
 * `aliasedElements` nor half the per-element fields today's schema has.
 */
type SchemaSnapshotJson = {
    elements?: {
        name: string;
        attributes?: {
            name: string;
            values?: string[];
            /**
             * `string[]` from 0.7.14, the release that introduced it, through
             * 0.7.16, and `{ value, description }[]` from 0.7.17 on. A reader
             * that assumes the object form throws on those three tags.
             */
            autocompleteValues?: (string | { value: string })[];
        }[];
        properties?: { name: string }[];
    }[];
};

/**
 * The values one attribute accepts, from whichever field carries them.
 *
 * Both are read and unioned, not one in preference to the other. The docs
 * render `autocompleteValues` where it exists, but 68 attributes list
 * `true`/`false` under `values` alone, so keying on the preferred field would
 * read the 0.7.14 arrival of `autocompleteValues` as those values being
 * removed.
 */
function attributeValues(attribute: {
    values?: string[];
    autocompleteValues?: (string | { value: string })[];
}): Set<string> {
    const values = new Set(attribute.values ?? []);
    for (const entry of attribute.autocompleteValues ?? []) {
        values.add(typeof entry === "string" ? entry : entry.value);
    }
    return values;
}

/** One release's worth of schema keys, in release order. */
export type VersionSnapshot = {
    /** Release version without the `v` prefix, e.g. `"0.7.21"`. */
    version: string;
    keys: Set<SchemaHistoryKey>;
};

/**
 * The schema keys present in one snapshot.
 *
 * `aliasedElements` is deliberately not indexed. Those entries (`matrixRow`,
 * `matrixColumn`) first appear in the JSON at 0.7.17, but the components
 * themselves are in the worker source at v0.7.0 — 0.7.17 only started
 * *emitting* them — so a run start derived from the snapshots would report them
 * as seven releases newer than they are.
 */
export function schemaKeys(schema: SchemaSnapshotJson): Set<SchemaHistoryKey> {
    const keys = new Set<SchemaHistoryKey>();
    for (const element of schema.elements ?? []) {
        keys.add(elementHistoryKey(element.name));
        for (const attribute of element.attributes ?? []) {
            keys.add(attributeHistoryKey(element.name, attribute.name));
            for (const value of attributeValues(attribute)) {
                keys.add(
                    attributeValueHistoryKey(
                        element.name,
                        attribute.name,
                        value,
                    ),
                );
            }
        }
        for (const property of element.properties ?? []) {
            keys.add(propertyHistoryKey(element.name, property.name));
        }
    }
    return keys;
}

/**
 * Fold release snapshots into the history index.
 *
 * `since` is the start of a key's *latest contiguous run of presence*, not its
 * first-ever appearance. Keys get removed and names get reused — 0.7.17 dropped
 * 501 keys and 0.7.18 another 261 — so first-ever-seen would report a stale
 * version for anything that came back. A rename shows up as a removal plus an
 * addition, which is the right rendering: the old spelling carries `removedIn`
 * and the new one carries its own `since`.
 */
export function buildSchemaHistory(
    snapshots: VersionSnapshot[],
): SchemaHistory {
    if (snapshots.length === 0) {
        throw new Error(
            "No release snapshots to build a schema history from. " +
                "This usually means the clone has no release tags: a shallow " +
                "or tagless checkout (CI defaults to one) cannot derive the index.",
        );
    }

    const since = new Map<SchemaHistoryKey, string>();
    const removedIn = new Map<SchemaHistoryKey, string>();

    let previous = new Set<SchemaHistoryKey>();
    for (const { version, keys } of snapshots) {
        for (const key of keys) {
            if (!previous.has(key)) {
                // Either brand new or back after an absence; both start a run.
                since.set(key, version);
                removedIn.delete(key);
            }
        }
        for (const key of previous) {
            if (!keys.has(key)) {
                removedIn.set(key, version);
            }
        }
        previous = keys;
    }

    return {
        latestReleasedVersion: snapshots[snapshots.length - 1].version,
        versions: snapshots.map((s) => s.version),
        since: sortedRecord(since),
        removedIn: sortedRecord(removedIn),
    };
}

/** Key-sorted, so a regenerated index compares cleanly against an older one. */
function sortedRecord(map: Map<string, string>): Record<string, string> {
    return Object.fromEntries(
        [...map.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
    );
}

/** Path of the committed schema *within the repo*, as `git show` wants it. */
const SCHEMA_PATH_IN_REPO =
    "packages/static-assets/src/generated/doenet-schema.json";

/**
 * Oldest release the index covers. The docs describe the 0.7 line onwards, and
 * 0.6 predates enough of the schema's shape that including it would spend the
 * "since" field on history nobody is asking about. Keys already present in this
 * release are recorded as having appeared in it, which reads as "0.7.0 or
 * earlier".
 */
const OLDEST_INDEXED_RELEASE = [0, 7, 0];

/**
 * Prereleases are skipped: `v0.7.0-rc-8` and `v0.7.0` carry the same schema
 * blob, and an index that named an rc as a key's origin would put a version in
 * the docs that no user ever installed.
 */
const RELEASE_TAG = /^v(\d+)\.(\d+)\.(\d+)$/;

/** Numeric, component by component, so `0.7.10` sorts after `0.7.9`. */
function compareVersions(a: number[], b: number[]): number {
    return a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
}

function git(args: string[]): string {
    return execFileSync("git", args, {
        encoding: "utf8",
        // The schema is ~5 MB of JSON; the default 1 MB buffer truncates it.
        maxBuffer: 256 * 1024 * 1024,
    });
}

/**
 * The release tags in one `git tag --list` listing, one per line: those at or
 * after `OLDEST_INDEXED_RELEASE`, in version order. Prereleases and anything
 * that is not `vX.Y.Z` are dropped.
 *
 * Split out from the git call so the selection and the ordering are testable
 * without a repository. That is the only coverage CI can have for them —
 * `test-main` checks out shallow, so the tests that read real tags skip there,
 * and a mis-ordering would otherwise reach `build-docs` as a wrong `since`
 * rather than as a failure.
 *
 * Version order, not tag date: the snapshots are diffed as a single line of
 * development, which is what the repo is today. Once the two release lines of
 * #1962 exist, a maintenance release can be *cut* after a newer minor — a
 * `v0.7.28` tagged the week after `v0.8.0`. Version order still gives the right
 * `since` for anything the backport and the newer line share, because the key
 * really was available from 0.7.28 on. What it gets wrong is a key that exists
 * on the maintenance line only: sorting 0.7.28 before 0.8.0 makes 0.8.0 look
 * like the release that dropped it, so it gains a spurious `removedIn`. Handle
 * that when the second line starts, by walking each line separately.
 */
export function parseReleaseTags(
    listed: string,
): { tag: string; version: string }[] {
    return listed
        .split("\n")
        .map((line) => line.trim())
        .flatMap((tag) => {
            const match = RELEASE_TAG.exec(tag);
            if (!match) {
                return [];
            }
            const parts = match.slice(1, 4).map(Number);
            if (compareVersions(parts, OLDEST_INDEXED_RELEASE) < 0) {
                return [];
            }
            return [{ tag, version: parts.join("."), parts }];
        })
        .sort((a, b) => compareVersions(a.parts, b.parts))
        .map(({ tag, version }) => ({ tag, version }));
}

/** `parseReleaseTags` over this repository's own tags. */
function releaseTags(): { tag: string; version: string }[] {
    let listed: string;
    try {
        listed = git(["tag", "--list", "v*"]);
    } catch (e) {
        // Not "no tags" but "no answer": a source download with no `.git`, or
        // no `git` on PATH. Without this the docs build stops on a raw
        // `Command failed: git tag --list v*` dump that never says why it
        // wanted git in the first place.
        throw new Error(
            `Could not list git tags. The docs build derives the schema ` +
                `history from the committed schema at each release tag, so it ` +
                `has to run inside a clone of this repository with git ` +
                `available; an unpacked source archive has no tags to read.`,
            { cause: e },
        );
    }
    return parseReleaseTags(listed);
}

/**
 * Read one snapshot per release tag, oldest first.
 *
 * Throws rather than returning what it can: a clone without the tags would
 * otherwise yield an index claiming every key in the schema is unreleased, and
 * the docs would badge all 19,000-odd of them as in development.
 */
export function releaseSnapshots(): VersionSnapshot[] {
    const tags = releaseTags();
    if (tags.length === 0) {
        throw new Error(
            `No release tags matching ${RELEASE_TAG} found at or after ` +
                `${OLDEST_INDEXED_RELEASE.join(".")}. A shallow or tagless ` +
                `clone cannot derive the schema history; fetch tags first ` +
                `(git fetch --tags, or actions/checkout with fetch-depth: 0).`,
        );
    }

    return tags.map(({ tag, version }) => {
        let raw: string;
        try {
            raw = git(["show", `${tag}:${SCHEMA_PATH_IN_REPO}`]);
        } catch (e) {
            throw new Error(
                `Release ${tag} has no ${SCHEMA_PATH_IN_REPO}. Every release ` +
                    `from ${OLDEST_INDEXED_RELEASE.join(".")} on is expected ` +
                    `to carry the committed schema; if that is no longer ` +
                    `true, raise OLDEST_INDEXED_RELEASE rather than skipping ` +
                    `releases silently.`,
                { cause: e },
            );
        }
        let parsed: SchemaSnapshotJson;
        try {
            parsed = JSON.parse(raw);
        } catch (e) {
            throw new Error(
                `Could not parse ${SCHEMA_PATH_IN_REPO} at ${tag} as JSON. ` +
                    `A partial clone fetches this blob on demand, so a ` +
                    `truncated or filtered blob shows up here rather than as ` +
                    `a git error.`,
                { cause: e },
            );
        }
        return { version, keys: schemaKeys(parsed) };
    });
}
