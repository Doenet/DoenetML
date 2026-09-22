/**
 * Covers the two rules that make the schema history index trustworthy, against
 * synthetic snapshots rather than the real tags: the derivation has to stay
 * pinned even as new releases change every real number.
 *
 * The rule that matters is the *contiguous run*. Keys really do vanish and come
 * back — 0.7.17 dropped 501 of them and 0.7.18 another 261 — so "first ever
 * seen" would print a version the key was not actually available in for the
 * whole span the reader assumes.
 *
 * Which tags the walk selects, and in what order, is checked the same way —
 * against a literal `git tag --list` listing rather than a repository — because
 * that is the only way CI can check it at all.
 *
 * The last block checks the derivation end to end against the repo's real tags.
 * It skips itself where they are absent, which includes CI: `test-main` uses a
 * default shallow checkout, and making it fetch the tags would charge the whole
 * test job for one assertion. What CI does cover is the case that matters — the
 * `build-docs` job runs the generator for real, and it throws rather than
 * emitting an empty index if the tags are missing.
 */
import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import {
    buildSchemaHistory,
    parseReleaseTags,
    releaseSnapshots,
    schemaKeys,
    type SchemaHistory,
    type VersionSnapshot,
} from "../scripts/schema-history";

/** `snapshot("0.7.3", "el:a", "at:a.b")` — a release holding just those keys. */
function snapshot(version: string, ...keys: string[]): VersionSnapshot {
    return { version, keys: new Set(keys) };
}

describe("schemaKeys", () => {
    it("keys elements, attributes and properties separately", () => {
        expect(
            [
                ...schemaKeys({
                    elements: [
                        {
                            name: "point",
                            attributes: [{ name: "labelIsName" }],
                            properties: [{ name: "labelIsName" }],
                        },
                    ],
                }),
            ].sort(),
        ).toEqual(["at:point.labelIsName", "el:point", "pr:point.labelIsName"]);
    });

    it("reads a snapshot that predates the fields today's schema has", () => {
        // v0.7.0's elements carry no `aliasedElements`, `docsSlug`, `summary`
        // or `childBuckets`; an element with neither attributes nor properties
        // still has to yield its own key.
        expect([...schemaKeys({ elements: [{ name: "point" }] })]).toEqual([
            "el:point",
        ]);
        expect([...schemaKeys({})]).toEqual([]);
    });

    it("ignores aliasedElements", () => {
        // `matrixRow` and `matrixColumn` entered the JSON at 0.7.17 but the
        // components date to 0.7.0 or earlier, so indexing them would report a
        // run start seven releases after authors could first write them.
        const keys = schemaKeys({
            elements: [{ name: "matrix" }],
            aliasedElements: { matrixRow: { name: "matrixRow" } },
        } as Parameters<typeof schemaKeys>[0]);
        expect([...keys]).toEqual(["el:matrix"]);
    });
});

describe("parseReleaseTags", () => {
    // `git tag --list` prints in lexical order, so the walk's own ordering is
    // what puts 0.7.10 after 0.7.9 rather than between 0.7.1 and 0.7.2. Nothing
    // else checks it in CI: the tests that read the repository's real tags skip
    // on a shallow checkout, and a mis-ordering reaches `build-docs` as a wrong
    // `since` in a file nothing reads yet, not as a failure.
    it("orders numerically, not lexically", () => {
        expect(
            parseReleaseTags(
                ["v0.7.1", "v0.7.10", "v0.7.2", "v0.7.9", "v0.8.0"].join("\n"),
            ),
        ).toEqual([
            { tag: "v0.7.1", version: "0.7.1" },
            { tag: "v0.7.2", version: "0.7.2" },
            { tag: "v0.7.9", version: "0.7.9" },
            { tag: "v0.7.10", version: "0.7.10" },
            { tag: "v0.8.0", version: "0.8.0" },
        ]);
        // Minor and major compare numerically too, so a second release line
        // does not sort under 0.7.
        expect(
            parseReleaseTags(["v0.10.0", "v0.9.0", "v1.0.0"].join("\n")).map(
                (t) => t.version,
            ),
        ).toEqual(["0.9.0", "0.10.0", "1.0.0"]);
    });

    it("keeps only stable releases at or after the oldest indexed one", () => {
        expect(
            parseReleaseTags(
                [
                    "v0.6.9", // an older line, below OLDEST_INDEXED_RELEASE
                    "v0.7.0-rc-8", // a prerelease: same blob as v0.7.0
                    "v0.7.0",
                    "  v0.7.1  ", // git's own output has no padding; be safe
                    "v0.7", // not a release tag
                    "vscode-extension-v1.2.3",
                    "", // the trailing newline
                ].join("\n"),
            ).map((t) => t.tag),
        ).toEqual(["v0.7.0", "v0.7.1"]);
    });

    it("returns nothing for a listing with no release tags", () => {
        // What a shallow clone produces; `releaseSnapshots` turns it into the
        // "fetch tags first" throw rather than an empty index.
        expect(parseReleaseTags("")).toEqual([]);
        expect(parseReleaseTags("\n\n")).toEqual([]);
    });
});

describe("buildSchemaHistory", () => {
    it("records the start of the latest contiguous run, not the first sighting", () => {
        // present -> removed -> re-added: the acceptance case from the issue.
        const history = buildSchemaHistory([
            snapshot("0.7.0", "at:a.stable", "at:a.comesBack"),
            snapshot("0.7.1", "at:a.stable"),
            snapshot("0.7.2", "at:a.stable"),
            snapshot("0.7.3", "at:a.stable", "at:a.comesBack"),
            snapshot("0.7.4", "at:a.stable", "at:a.comesBack"),
        ]);

        expect(history.since["at:a.comesBack"]).toBe("0.7.3");
        expect(history.since["at:a.stable"]).toBe("0.7.0");
        // Back in the schema, so no longer removed.
        expect(history.removedIn).toEqual({});
    });

    it("keeps the run start of a key that never left", () => {
        const history = buildSchemaHistory([
            snapshot("0.7.0", "el:a"),
            snapshot("0.7.1", "el:a", "el:b"),
            snapshot("0.7.2", "el:a", "el:b"),
        ]);
        expect(history.since).toEqual({ "el:a": "0.7.0", "el:b": "0.7.1" });
    });

    it("records removedIn as the release the key disappeared in", () => {
        const history = buildSchemaHistory([
            snapshot("0.7.0", "el:a", "el:gone"),
            snapshot("0.7.1", "el:a", "el:gone"),
            snapshot("0.7.2", "el:a"),
            snapshot("0.7.3", "el:a"),
        ]);
        // 0.7.2 is the first release without it, so 0.7.1 was its last.
        expect(history.removedIn).toEqual({ "el:gone": "0.7.2" });
        // Its run start is still reported, so a docs page for the old spelling
        // can say when it existed as well as when it went away.
        expect(history.since["el:gone"]).toBe("0.7.0");
    });

    it("renders a rename as a removal plus an addition", () => {
        const history = buildSchemaHistory([
            snapshot("0.7.20", "at:statement.forceIndividualAnswerColoring"),
            snapshot("0.7.21", "at:statement.colorAnswersSeparately"),
        ]);
        expect(
            history.removedIn["at:statement.forceIndividualAnswerColoring"],
        ).toBe("0.7.21");
        expect(history.since["at:statement.colorAnswersSeparately"]).toBe(
            "0.7.21",
        );
    });

    it("reports a key removed after a re-addition against its latest run", () => {
        // Both fields have to move together: a key that came back and then left
        // again should not keep the run start from before its first removal.
        const history = buildSchemaHistory([
            snapshot("0.7.0", "el:a"),
            snapshot("0.7.1"),
            snapshot("0.7.2", "el:a"),
            snapshot("0.7.3"),
        ]);
        expect(history.since["el:a"]).toBe("0.7.2");
        expect(history.removedIn["el:a"]).toBe("0.7.3");
    });

    it("names the newest release and lists the releases in order", () => {
        const history = buildSchemaHistory([
            snapshot("0.7.26", "el:a"),
            snapshot("0.7.27", "el:a"),
            snapshot("0.8.0", "el:a"),
        ]);
        expect(history.latestReleasedVersion).toBe("0.8.0");
        expect(history.versions).toEqual(["0.7.26", "0.7.27", "0.8.0"]);
    });

    it("sorts keys so the committed file's diffs stay readable", () => {
        const history = buildSchemaHistory([snapshot("0.7.0", "el:z", "el:a")]);
        expect(Object.keys(history.since)).toEqual(["el:a", "el:z"]);
    });

    it("refuses to build an index from no releases", () => {
        // A tagless clone would otherwise write an empty index and make every
        // existing key look unreleased.
        expect(() => buildSchemaHistory([])).toThrow(/no release tags/i);
    });
});

/**
 * Against the repo's real tags. These are #2002's acceptance criteria. They
 * change only when a release is cut: the lower bounds then only grow, and the
 * one exact count moves only if a release drops a key that dates to 0.7.0.
 */
const tags = (() => {
    try {
        return execFileSync("git", ["tag", "--list", "v0.7.*"], {
            encoding: "utf8",
            // Outside a repository git writes "fatal: not a git repository"
            // to stderr; the throw is the answer, so don't also print it.
            stdio: ["ignore", "pipe", "ignore"],
        });
    } catch {
        return "";
    }
})();
const hasReleaseTags = /^v0\.7\.\d+$/m.test(tags);

// Built on first use rather than in the describe body: vitest runs describe
// callbacks during collection even for a suite it is going to skip, so reading
// git there would throw in exactly the tagless checkout the skip exists for.
let cached: SchemaHistory | undefined;
function realHistory(): SchemaHistory {
    return (cached ??= buildSchemaHistory(releaseSnapshots()));
}

function liveKeys(history: SchemaHistory): string[] {
    return Object.keys(history.since).filter(
        (key) => !(key in history.removedIn),
    );
}

describe.skipIf(!hasReleaseTags)(
    "against the repository's release tags",
    () => {
        it("covers every release from 0.7.0 to the newest tag", () => {
            const history = realHistory();
            expect(history.versions[0]).toBe("0.7.0");
            expect(history.latestReleasedVersion).toBe(
                history.versions[history.versions.length - 1],
            );
        });

        it("dates the known cases correctly", () => {
            const history = realHistory();
            expect(history.since["el:chart"]).toBe("0.7.27");
            expect(history.since["at:statement.colorAnswersSeparately"]).toBe(
                "0.7.21",
            );
            expect(
                history.removedIn["at:statement.forceIndividualAnswerColoring"],
            ).toBe("0.7.21");
            // The 501-key drop the contiguous-run rule exists for.
            expect(history.removedIn["pr:abs.modifyIndirectly"]).toBe("0.7.17");
        });

        it("reproduces the counts, as a floor that only grows", () => {
            // Exact as of 0.7.27: 12,191 live keys, 10,228 of them present at or
            // before 0.7.0, 1,963 introduced during 0.7.x, 25 of those elements.
            // Asserted as lower bounds so a new release does not fail the suite.
            // The 0.7.0 figure is exact instead, and deliberately a tripwire: it
            // moves only when a release removes — or removes and re-adds — a key
            // that had been in the schema since 0.7.0, which is worth a look
            // rather than a silent slide. Update the number when that happens.
            const live = liveKeys(realHistory());
            const history = realHistory();
            expect(live.length).toBeGreaterThanOrEqual(12191);
            expect(
                live.filter((k) => history.since[k] === "0.7.0"),
            ).toHaveLength(10228);
            expect(
                live.filter(
                    (k) => k.startsWith("el:") && history.since[k] !== "0.7.0",
                ).length,
            ).toBeGreaterThanOrEqual(25);
        });
    },
);
