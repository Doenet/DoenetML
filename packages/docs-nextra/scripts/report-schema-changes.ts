/*
 * Print what a release added to and removed from the schema.
 *
 * The history index is derived at build time rather than committed, so there is
 * no diff in a pull request to read after a release. This is the replacement,
 * and a better one: it reports any release, not just the most recent, and it
 * says what changed in words rather than as 600 KB of reordered JSON.
 *
 *   npm run report:schema-changes -w packages/docs-nextra             # newest release
 *   npm run report:schema-changes -w packages/docs-nextra -- 0.7.21   # a specific one
 *   npm run report:schema-changes -w packages/docs-nextra -- --all    # every release
 *
 * The `--` is not optional for a flag: without it npm swallows `--all` as one
 * of its own options and the script reports the newest release instead.
 */

import { buildSchemaHistory, releaseSnapshots } from "./schema-history";

const history = buildSchemaHistory(releaseSnapshots());

const args = process.argv.slice(2).filter((a) => a !== "--");
const all = args.includes("--all");
const requested = args.find((a) => !a.startsWith("-"));

if (requested !== undefined && !history.versions.includes(requested)) {
    console.error(
        `Unknown release "${requested}". Known releases: ` +
            history.versions.join(", "),
    );
    process.exit(1);
}

const versions = all
    ? history.versions
    : [requested ?? history.latestReleasedVersion];

/**
 * The kinds of key, reported separately, and between them covering every key
 * the index holds — so the per-kind lines add up to the `+n added` total above
 * them. An attribute and a property can share a name on the same element —
 * `document.documentWideCheckWork` is both — so a single merged list would
 * print it twice with nothing to tell the two apart.
 */
const KINDS = [
    { prefix: "el:", label: "elements" },
    { prefix: "at:", label: "attributes" },
    { prefix: "pr:", label: "properties" },
    { prefix: "va:", label: "attribute values" },
] as const;

/**
 * `el:chart` -> `<chart>`; `at:point.x` -> `point.x`;
 * `va:selectRandomNumbers.type.poisson` -> `selectRandomNumbers.type.poisson`.
 */
function display(key: string): string {
    const name = key.slice(3);
    return key.startsWith("el:") ? `<${name}>` : name;
}

function keysAt(version: string, table: Record<string, string>): string[] {
    return Object.keys(table)
        .filter((key) => table[key] === version)
        .sort();
}

/** At most this many names before a list is summarized instead of enumerated. */
const MAX_NAMES = 40;

function joinCapped(names: string[]): string {
    if (names.length <= MAX_NAMES) {
        return names.join(", ");
    }
    return `${names.slice(0, MAX_NAMES).join(", ")}, … and ${
        names.length - MAX_NAMES
    } more`;
}

for (const version of versions) {
    const added = keysAt(version, history.since);
    const removed = keysAt(version, history.removedIn);

    // The oldest release covered is the baseline, not a release that "added"
    // 10,957 keys: everything already present shows up against it. Enumerating
    // that is 245 element names of pure noise, so it gets counts only.
    if (version === history.versions[0]) {
        console.log(
            `\n${version} (baseline — everything present at or before ` +
                `this release)\n  ${added.length} keys, ` +
                `${added.filter((k) => k.startsWith("el:")).length} of them ` +
                `elements`,
        );
        continue;
    }

    console.log(`\n${version}`);
    console.log(`  +${added.length} added, -${removed.length} removed`);

    for (const [label, keys] of [
        ["added", added],
        ["removed", removed],
    ] as const) {
        for (const kind of KINDS) {
            const inKind = keys.filter((key) => key.startsWith(kind.prefix));
            if (inKind.length === 0) continue;

            // Naming every one of several hundred added attributes buries the
            // elements, which are what someone scanning a release wants first.
            // But removals are usually few and their names are the whole point
            // — a rename reads as `statement.forceIndividualAnswerColoring`
            // going away — so enumerate while the list is short enough to read.
            if (kind.prefix === "el:" || inKind.length <= MAX_NAMES) {
                console.log(
                    `  ${label} ${kind.label} (${inKind.length}): ` +
                        joinCapped(inKind.map(display)),
                );
                continue;
            }

            const owners = [
                ...new Set(inKind.map((key) => key.slice(3).split(".")[0])),
            ].sort();
            console.log(
                `  ${label} ${kind.label} (${inKind.length}) across ` +
                    `${owners.length} elements: ${joinCapped(owners)}`,
            );
        }
    }
}

if (!all) {
    console.log(
        `\n(${history.versions.length} releases indexed, ` +
            `${history.versions[0]}–${history.latestReleasedVersion}. ` +
            `Pass a version, or --all — as \`-- --all\` through npm, which ` +
            `otherwise swallows the flag itself.)`,
    );
}
