/**
 * Refuse any changeset on the 0.7 maintenance line that is not a `patch`.
 *
 * This branch exists only for backports, and its version sequence has to stay
 * inside 0.7.x. A `minor` changeset here would make `changeset version` compute
 * 0.8.0 and open a line that already belongs to `main` — two branches would
 * then claim the same version. npm never lets the second one replace the first
 * one's tarball, and our release path does not even report that refusal as an
 * error: `npm-publish-with-retry.mjs` matches `EPUBLISHCONFLICT` / "cannot
 * publish over" as already-published, calls the publish a success, and then
 * points the dist-tag it was given at whatever tree got there first. So the
 * second line's release would quietly leave `0.7-stable` serving `main`'s
 * build.
 *
 * It is worth a CI job rather than a convention because the mistake arrives by
 * cherry-pick: a fix that was `minor` on `main` carries its changeset file
 * along, and the bump type is the one part of it that stops being true on the
 * way across.
 *
 * This script exists only on the 0.7 branch. `main` has no equivalent, because
 * there a `minor` is how a new line is deliberately opened.
 */

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const CHANGESET_DIR = ".changeset";
const ALLOWED_BUMP = "patch";

/**
 * The YAML front matter of a changeset: the block between the first pair of
 * `---` fences. Returns null when the file has no front matter, which is how
 * `README.md` and any stray note in the directory are skipped rather than
 * reported as malformed.
 *
 * The pattern is `mdRegex` from `@changesets/parse`, copied rather than
 * imported because this runs before `npm ci` and must stay dependency-free.
 * The part that decides what matches is copied character for character; the
 * only edit is to the trailing group, from `(\s*(?:\n|$)[^]*)` — which captures
 * the summary — to a non-capturing `(?:\s*(?:\n|$))`, because nothing here
 * reads the summary and the pattern is unanchored at its end either way.
 * Matching no less than changesets does is the point: anything stricter skips a
 * file that `changeset version` still acts on, and skipping is the one failure
 * this script cannot afford. A leading blank line, a byte-order mark, a stray note
 * above the fence or an indented closing fence all defeat an anchored
 * `/^---\n...\n---/` while `changeset version` reads the front matter
 * underneath them and bumps exactly as it says.
 */
const FRONT_MATTER = /\s*---([^]*?)\n\s*---(?:\s*(?:\n|$))/;

function frontMatter(text) {
    const match = text.match(FRONT_MATTER);
    return match ? match[1] : null;
}

const problems = [];

let entries;
try {
    entries = readdirSync(CHANGESET_DIR);
} catch (error) {
    // No `.changeset/` at all is not this script's business to complain about.
    if (error.code === "ENOENT") {
        console.log(`No ${CHANGESET_DIR}/ directory; nothing to check.`);
        process.exit(0);
    }
    throw error;
}

const files = entries.filter(
    (name) => name.endsWith(".md") && name.toLowerCase() !== "readme.md",
);

for (const name of files) {
    const path = join(CHANGESET_DIR, name);
    const block = frontMatter(readFileSync(path, "utf8"));
    if (block === null) {
        continue;
    }

    for (const rawLine of block.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith("#")) {
            continue;
        }
        // `"@doenet/doenetml": patch`, or unquoted for an unscoped name.
        const entry = line.match(
            /^(?:"([^"]+)"|'([^']+)'|([^:]+))\s*:\s*(\S+)$/,
        );
        if (!entry) {
            problems.push(
                `${path}: could not parse front matter line: ${line}`,
            );
            continue;
        }
        const pkg = entry[1] ?? entry[2] ?? entry[3].trim();
        const bump = entry[4];
        if (bump !== ALLOWED_BUMP) {
            problems.push(
                `${path}: "${pkg}" is ${bump}, must be ${ALLOWED_BUMP}`,
            );
        }
    }
}

if (problems.length > 0) {
    console.error(
        `The 0.7 branch takes ${ALLOWED_BUMP} bumps only, but found:\n`,
    );
    for (const problem of problems) {
        console.error(`  ${problem}`);
    }
    console.error(
        `\nA non-${ALLOWED_BUMP} bump here would version this branch out of 0.7.x and` +
            `\ncollide with the line \`main\` is on. If the change really is breaking,` +
            `\nit belongs on \`main\`, not in a backport. Otherwise edit the bump type` +
            `\nto ${ALLOWED_BUMP} — a cherry-picked changeset keeps whatever it had on \`main\`.`,
    );
    process.exit(1);
}

console.log(
    `Checked ${files.length} changeset file(s); every bump is ${ALLOWED_BUMP}.`,
);
