/**
 * Covers the two rules that make the schema history index trustworthy, against
 * synthetic snapshots rather than the real tags: the derivation has to stay
 * pinned even as new releases change every real number.
 *
 * The rule that matters is the *contiguous run*. Keys really do vanish and come
 * back — 0.7.17 dropped 501 of them and 0.7.18 another 376 — so "first ever
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
    HISTORY_KEY_KINDS,
    parseReleaseTags,
    releaseSnapshots,
    schemaKeys,
    type SchemaHistory,
    type VersionSnapshot,
} from "../scripts/schema-history";

/**
 * `snapshot("0.7.3", "el:a", "at:a.b")` — a release holding just those keys.
 * Any `va:` key among them is owned by the `at:` key it is written under, so a
 * release that lists a value is also one that declares its attribute's list.
 */
function snapshot(version: string, ...keys: string[]): VersionSnapshot {
    const valueOwners = new Map<string, string>();
    for (const key of keys) {
        if (key.startsWith("va:")) {
            valueOwners.set(key, ownerInTest(key));
        }
    }
    return { version, keys: new Set(keys), valueOwners };
}

/**
 * The attribute a test's `va:` key belongs to. Test values never contain a
 * `.`, so splitting the last segment off is safe here; the production code
 * carries ownership rather than parsing it, because real values do.
 */
function ownerInTest(valueKey: string): string {
    return `at:${valueKey.slice("va:".length, valueKey.lastIndexOf("."))}`;
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

    it("keys the values an enumerated attribute accepts", () => {
        expect(
            [
                ...schemaKeys({
                    elements: [
                        {
                            name: "selectRandomNumbers",
                            attributes: [
                                {
                                    name: "type",
                                    values: ["uniform", "gaussian"],
                                },
                            ],
                        },
                    ],
                }),
            ].sort(),
        ).toEqual([
            "at:selectRandomNumbers.type",
            "el:selectRandomNumbers",
            "va:selectRandomNumbers.type.gaussian",
            "va:selectRandomNumbers.type.uniform",
        ]);
    });

    it("unions both value fields, in either shape they have had", () => {
        // `autocompleteValues` arrived at 0.7.14 as `string[]` and became
        // `{ value, description }[]` at 0.7.17, so the walk meets both. It
        // carries only the author-facing subset — 68 attributes list
        // `true`/`false` under `values` alone — so keying on the field the
        // docs prefer would read 0.7.14 as those values being removed.
        const fromStrings = schemaKeys({
            elements: [
                {
                    name: "and",
                    attributes: [
                        {
                            name: "simplify",
                            values: ["none", "true", "false"],
                            autocompleteValues: ["none"],
                        },
                    ],
                },
            ],
        });
        const fromObjects = schemaKeys({
            elements: [
                {
                    name: "and",
                    attributes: [
                        {
                            name: "simplify",
                            values: ["none", "true", "false"],
                            autocompleteValues: [{ value: "none" }],
                        },
                    ],
                },
            ],
        });
        const expected = [
            "at:and.simplify",
            "el:and",
            "va:and.simplify.false",
            "va:and.simplify.none",
            "va:and.simplify.true",
        ];
        expect([...fromStrings].sort()).toEqual(expected);
        expect([...fromObjects].sort()).toEqual(expected);
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
    it("dates the values in a newly written list to their attribute", () => {
        // `renderMode` set "inline" and "display" at 0.7.0 and only declared
        // them at 0.7.25. The declaration is someone writing the list down, not
        // the values arriving, so an author on 0.7.20 must not be told that
        // "display" is newer than their version.
        const history = buildSchemaHistory([
            snapshot("0.7.0", "el:m", "at:m.renderMode"),
            snapshot("0.7.10", "el:m", "at:m.renderMode"),
            snapshot(
                "0.7.25",
                "el:m",
                "at:m.renderMode",
                "va:m.renderMode.inline",
                "va:m.renderMode.display",
            ),
        ]);
        expect(history.since["at:m.renderMode"]).toBe("0.7.0");
        expect(history.since["va:m.renderMode.inline"]).toBe("0.7.0");
        expect(history.since["va:m.renderMode.display"]).toBe("0.7.0");
    });

    it("keeps its own date for a value added to a list that already existed", () => {
        // The case the snapshots really do record: the list was there, and a
        // release extended it.
        const history = buildSchemaHistory([
            snapshot("0.7.0", "el:s", "at:s.type", "va:s.type.uniform"),
            snapshot(
                "0.7.10",
                "el:s",
                "at:s.type",
                "va:s.type.uniform",
                "va:s.type.poisson",
            ),
        ]);
        expect(history.since["va:s.type.uniform"]).toBe("0.7.0");
        expect(history.since["va:s.type.poisson"]).toBe("0.7.10");
    });

    it("dates a list written with its attribute to that release", () => {
        // The degenerate case of the same rule: attribute and list arrive
        // together, so the values take the attribute's date and the badge
        // rules drop them against it.
        const history = buildSchemaHistory([
            snapshot("0.7.0", "el:c"),
            snapshot("0.7.27", "el:c", "at:c.type", "va:c.type.bar"),
        ]);
        expect(history.since["at:c.type"]).toBe("0.7.27");
        expect(history.since["va:c.type.bar"]).toBe("0.7.27");
    });

    it("re-dates a list that went away and came back", () => {
        // A list that disappears and returns starts a new run, and the values
        // in it are dated to the attribute again rather than to the return.
        const history = buildSchemaHistory([
            snapshot("0.7.0", "el:m", "at:m.mode", "va:m.mode.inline"),
            snapshot("0.7.10", "el:m", "at:m.mode"),
            snapshot("0.7.20", "el:m", "at:m.mode", "va:m.mode.inline"),
        ]);
        expect(history.since["at:m.mode"]).toBe("0.7.0");
        expect(history.since["va:m.mode.inline"]).toBe("0.7.0");
    });

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
            // Both branches of the list-dating rule, on the real tags rather
            // than on synthetic snapshots. `math`'s `renderMode` list was
            // written down at 0.7.25 for values MMeMen.js has set since v0.7.0;
            // `selectRandomNumbers`' `type` list has been there since 0.7.0, so
            // `poisson` joining it at 0.7.27 is an arrival and keeps its date.
            expect(history.since["va:math.renderMode.display"]).toBe("0.7.0");
            expect(history.since["va:selectRandomNumbers.type.poisson"]).toBe(
                "0.7.27",
            );
        });

        it("names a kind for every key the index holds", () => {
            // What `report:schema-changes` needs to add up: it prints one line
            // per kind in `HISTORY_KEY_KINDS` under a total counted over all
            // keys, so a kind added to `schemaKeys` and not to that list would
            // go unreported. Checked against the real tags rather than a
            // synthetic schema, which would only ever hold the kinds this test
            // thought to write.
            const history = realHistory();
            const prefixes = HISTORY_KEY_KINDS.map((kind) => kind.prefix);
            const unnamed = [
                ...Object.keys(history.since),
                ...Object.keys(history.removedIn),
            ].filter((key) => !prefixes.some((p) => key.startsWith(p)));
            expect(unnamed).toEqual([]);
        });

        it("reproduces the counts, as a floor that only grows", () => {
            // Exact as of 0.7.27: 19,661 live keys — 265 elements, 5,668
            // attributes, 6,258 properties and 7,470 attribute values — of
            // which 15,490 were present at or before 0.7.0, 4,171 arrived
            // during 0.7.x, and 25 of those are elements. Asserted as lower
            // bounds so a new release does not fail the suite. The 0.7.0 figure
            // is exact instead, and deliberately a tripwire. Two things move
            // it, both worth a look rather than a silent slide: a release that
            // removes — or removes and re-adds — a key that had been in the
            // schema since 0.7.0, and a release that writes down a value list
            // for an attribute dating to 0.7.0, which back-dates every value in
            // it into this bucket. Update the number when either happens.
            const live = liveKeys(realHistory());
            const history = realHistory();
            expect(live.length).toBeGreaterThanOrEqual(19661);
            expect(
                live.filter((k) => history.since[k] === "0.7.0"),
            ).toHaveLength(15490);
            expect(
                live.filter(
                    (k) => k.startsWith("el:") && history.since[k] !== "0.7.0",
                ).length,
            ).toBeGreaterThanOrEqual(25);
        });
    },
);
