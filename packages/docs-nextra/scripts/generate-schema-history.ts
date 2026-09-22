/*
 * Write `generated/schema-history.json`: the release each schema element,
 * attribute and property first appeared in, derived from the committed schema
 * at every release tag. See `schema-history.ts` for the derivation and why the
 * run rule is what it is.
 *
 * This runs as part of `build:pre`, and its output is generated rather than
 * committed. The index is a pure function of the release tags, so a committed
 * copy could only ever be *stale* — after a release, until someone remembered
 * to regenerate it — and never more correct. Deriving it at build time means
 * there is no freshness check to run, no step in the release flow to forget,
 * and no window in which the docs describe the wrong newest release.
 *
 * The cost is that the docs build needs a clone with the release tags, which a
 * default CI checkout does not have; `.github/workflows/ci.yml` and
 * `gh-pages-docs.yml` ask for one. Run `npm run report:schema-changes` to see
 * what a given release added and removed.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSchemaHistory, releaseSnapshots } from "./schema-history";

// `fileURLToPath`, not `.pathname`: the latter is still percent-encoded, so a
// checkout under a directory with a space in it would have the mkdir and the
// write disagree about where the file goes.
const dest = fileURLToPath(
    new URL("../generated/schema-history.json", import.meta.url),
);

const history = buildSchemaHistory(releaseSnapshots());
const out = JSON.stringify(history, null, 4) + "\n";

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, out);

const live = Object.keys(history.since).filter(
    (key) => !(key in history.removedIn),
);
console.log(
    `Schema history: ${history.versions.length} releases, ` +
        `${history.latestReleasedVersion} newest; ${live.length} live keys, ` +
        `${Object.keys(history.removedIn).length} removed. ` +
        `Wrote ${Math.round(out.length / 1024)} KB to ${dest}`,
);
