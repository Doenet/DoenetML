import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";

import {
    SINGLE_INSTANCE_CHUNKS_PREFIX,
    SINGLE_INSTANCE_INLINE_SCRIPT,
    SINGLE_INSTANCE_SCRIPT,
    collectDistScripts,
    countInstances,
    instanceProblems,
    loaderRegistryMarker,
    type ScannedScript,
} from "../scripts/bundleInstances";

const MARKER = "/\\/locales\\/([^/]+)\\/([^/]+)\\.ftl$/";

const tempDirs: string[] = [];

/**
 * A throwaway `packages/` tree: `{ "<pkg>/dist/<file>": contents }`.
 *
 * Written to disk rather than mocked because what `collectDistScripts` has to
 * get right is a directory walk — which files it descends into and which
 * extensions it counts.
 */
function packagesTree(files: Record<string, string>): string {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), "i18n-instances-"));
    tempDirs.push(root);
    for (const [relative, contents] of Object.entries(files)) {
        const file = path.join(root, relative);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, contents);
    }
    return root;
}

/** Scripts in the shape `collectDistScripts` returns. */
function scanned(counts: Record<string, number>): ScannedScript[] {
    return Object.entries(counts).map(([file, instances]) => ({
        file,
        instances,
    }));
}

afterAll(() => {
    for (const dir of tempDirs) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
});

describe("loaderRegistryMarker", () => {
    it("finds the pattern in the committed load.ts", () => {
        // The whole check rests on this being findable in the real module: a
        // marker that stopped matching would leave every script counted as
        // zero and the check passing on anything.
        expect(loaderRegistryMarker()).toBe(MARKER);
    });

    it("reports no marker when load.ts is not where it should be", () => {
        expect(loaderRegistryMarker("/no/such/load.ts")).toBe(null);
    });

    it("reports no marker when the declaration is not a literal", () => {
        const file = path.join(
            packagesTree({
                "load.ts": "const CATALOG_PATH_PATTERN = other;\n",
            }),
            "load.ts",
        );
        expect(loaderRegistryMarker(file)).toBe(null);
    });
});

describe("countInstances", () => {
    it("counts non-overlapping occurrences", () => {
        expect(countInstances(`a${MARKER}b${MARKER}c`, MARKER)).toBe(2);
        expect(countInstances("nothing here", MARKER)).toBe(0);
    });
});

describe("collectDistScripts", () => {
    it("counts every emitted script under each package's dist", () => {
        const root = packagesTree({
            "standalone/dist/doenet-standalone.js": `x=${MARKER};`,
            "standalone/dist/doenetml-worker/index.js": `y=${MARKER};`,
            "doenetml/dist/index.js": "nothing",
        });
        expect(collectDistScripts(MARKER, root)).toEqual(
            expect.arrayContaining([
                {
                    file: "packages/standalone/dist/doenet-standalone.js",
                    instances: 1,
                },
                {
                    file: "packages/standalone/dist/doenetml-worker/index.js",
                    instances: 1,
                },
                { file: "packages/doenetml/dist/index.js", instances: 0 },
            ]),
        );
    });

    it("skips source maps, which embed the sources they map", () => {
        // A map holds the very module it maps, so counting it would report a
        // second copy for a perfectly correct build.
        const root = packagesTree({
            "standalone/dist/bundle.js": `x=${MARKER};`,
            "standalone/dist/bundle.js.map": `{"sourcesContent":["${MARKER}"]}`,
        });
        expect(collectDistScripts(MARKER, root).map((s) => s.file)).toEqual([
            "packages/standalone/dist/bundle.js",
        ]);
    });

    it("looks at dist only, not a dev or test build beside it", () => {
        const root = packagesTree({
            "doenetml-print/dist-dev/index.js": `x=${MARKER}${MARKER};`,
            "doenetml-prototype/test/utils/dist/run/run.js": `x=${MARKER}${MARKER};`,
        });
        expect(collectDistScripts(MARKER, root)).toEqual([]);
    });

    it("reports nothing when nothing has been built", () => {
        expect(collectDistScripts(MARKER, packagesTree({}))).toEqual([]);
        expect(collectDistScripts(MARKER, "/no/such/packages")).toEqual([]);
    });
});

describe("instanceProblems", () => {
    it("accepts one copy per script", () => {
        expect(
            instanceProblems(
                scanned({
                    [SINGLE_INSTANCE_SCRIPT]: 1,
                    "packages/doenetml/dist/index.js": 1,
                }),
            ),
        ).toEqual([]);
    });

    it("accepts a script that carries none at all", () => {
        // Most emitted scripts have nothing to do with i18n, so holding none
        // is their normal case.
        expect(
            instanceProblems(
                scanned({
                    [SINGLE_INSTANCE_SCRIPT]: 1,
                    "packages/parser/dist/index.js": 0,
                }),
            ),
        ).toEqual([]);
    });

    it("reports the 0.7.22 failure: two copies in the standalone bundle", () => {
        const problems = instanceProblems(
            scanned({ [SINGLE_INSTANCE_SCRIPT]: 2 }),
        );
        expect(problems).toHaveLength(1);
        expect(problems[0]).toContain(SINGLE_INSTANCE_SCRIPT);
        expect(problems[0]).toContain("2 copies");
    });

    it("reports the same failure in any other package's bundle", () => {
        // The point of scanning every package rather than the one that has
        // been bitten: a bundle combining a prebuilt @doenet/doenetml with a
        // source build of this package can hit it the same way.
        const problems = instanceProblems(
            scanned({
                [SINGLE_INSTANCE_SCRIPT]: 1,
                "packages/doenetml-prototype/dist/index.js": 2,
                "packages/doenetml-print/dist/index.js": 3,
            }),
        );
        expect(problems).toHaveLength(2);
    });

    it("reports a standalone bundle that carries none at all", () => {
        // Zero in the bundle that installs the loaders means either they were
        // tree-shaken out or the marker stopped surviving minification, and a
        // check counting nothing passes anything.
        const problems = instanceProblems(
            scanned({ [SINGLE_INSTANCE_SCRIPT]: 0 }),
        );
        expect(problems).toHaveLength(1);
        expect(problems[0]).toContain("no copy of @doenet/i18n at all");
    });

    it("says nothing about a standalone bundle nobody built", () => {
        // Absence is not zero: plenty of builds legitimately do not produce
        // it, and the runner notes the skip rather than inventing a verdict.
        expect(
            instanceProblems(scanned({ "packages/doenetml/dist/index.js": 1 })),
        ).toEqual([]);
    });

    it("accepts the copy living in a chunk of the code-split bundle", () => {
        // The entry is a re-export facade; the module bodies — the loader
        // registry among them — live in the eagerly imported chunk beside it.
        expect(
            instanceProblems(
                scanned({
                    [SINGLE_INSTANCE_SCRIPT]: 0,
                    [`${SINGLE_INSTANCE_CHUNKS_PREFIX}index-DEADBEEF.js`]: 1,
                    [`${SINGLE_INSTANCE_CHUNKS_PREFIX}EditorViewer-abc.js`]: 0,
                }),
            ),
        ).toEqual([]);
    });

    it("reports a copy split across two chunks of one bundle", () => {
        // One copy per file, so the per-file rule sees nothing — but a realm
        // that loads both chunks ends up with two registries all the same.
        const problems = instanceProblems(
            scanned({
                [SINGLE_INSTANCE_SCRIPT]: 0,
                [`${SINGLE_INSTANCE_CHUNKS_PREFIX}index-DEADBEEF.js`]: 1,
                [`${SINGLE_INSTANCE_CHUNKS_PREFIX}EditorViewer-abc.js`]: 1,
            }),
        );
        expect(problems).toHaveLength(1);
        expect(problems[0]).toContain("together hold 2 copies");
    });

    it("reports a bundle whose entry and chunks together hold none", () => {
        const problems = instanceProblems(
            scanned({
                [SINGLE_INSTANCE_SCRIPT]: 0,
                [`${SINGLE_INSTANCE_CHUNKS_PREFIX}index-DEADBEEF.js`]: 0,
            }),
        );
        expect(problems).toHaveLength(1);
        expect(problems[0]).toContain("no copy of @doenet/i18n at all");
    });

    it("holds the single-file inline variant to exactly one on its own", () => {
        expect(
            instanceProblems(
                scanned({
                    [SINGLE_INSTANCE_SCRIPT]: 0,
                    [`${SINGLE_INSTANCE_CHUNKS_PREFIX}index-DEADBEEF.js`]: 1,
                    [SINGLE_INSTANCE_INLINE_SCRIPT]: 1,
                }),
            ),
        ).toEqual([]);
        const problems = instanceProblems(
            scanned({ [SINGLE_INSTANCE_INLINE_SCRIPT]: 0 }),
        );
        expect(problems).toHaveLength(1);
        expect(problems[0]).toContain(SINGLE_INSTANCE_INLINE_SCRIPT);
    });
});
