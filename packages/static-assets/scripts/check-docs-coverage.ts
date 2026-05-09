/*
 * Verify that every schema component either:
 *   1. Has a corresponding `pages/reference/<docsSlug>.mdx` file, OR
 *   2. Is on the undocumented allow-list (warns), OR
 *   3. Has `componentDocs.docsSlug = null` (intentionally undocumented, silent).
 *
 * Exits non-zero when:
 *   - A component is missing docs and is NOT on the allow-list (net-new gap), OR
 *   - A component declares a `docsSlug` string that doesn't resolve to a page, OR
 *   - The allow-list contains an entry that's now redundant (component has docs
 *     or no longer exists).
 *
 * Run via `npm run check:docs-coverage -w packages/static-assets`.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { createComponentInfoObjects } from "../../doenetml-worker-javascript/src/utils/componentInfoObjects";
import { getDeclaredDocsSlug, getExistingDocSlugs } from "./get-schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ALLOWLIST_PATH = path.join(
    __dirname,
    "undocumented-components-allowlist.txt",
);

function loadAllowlist(): Set<string> {
    const raw = fs.readFileSync(ALLOWLIST_PATH, "utf8");
    return new Set(
        raw
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length > 0 && !l.startsWith("#")),
    );
}

function main() {
    const componentInfoObjects = createComponentInfoObjects();
    const allComponentClasses =
        componentInfoObjects.allComponentClasses as Record<
            string,
            {
                componentType: string;
                excludeFromSchema?: boolean;
                componentDocs?: { docsSlug?: string | null };
            }
        >;

    const docsPages = getExistingDocSlugs();
    const allowlist = loadAllowlist();

    /** Net-new: no docs, not on allow-list. */
    const failures: string[] = [];
    /** Allow-listed: still missing docs — warn so the list shrinks over time. */
    const warnings: string[] = [];
    /** Class declared a slug string that doesn't resolve to a real .mdx file. */
    const brokenSlugs: { name: string; slug: string }[] = [];
    /** Allow-list entries no longer needed. */
    const obsoleteAllowlistEntries: string[] = [];

    const componentNames = new Set<string>();
    /** Targets referenced via `componentDocs.childAliases`. Their docsSlugs
     * appear in editor help (via parent context) so they must also resolve. */
    const aliasTargets = new Set<string>();

    for (const type in allComponentClasses) {
        const cClass = allComponentClasses[type];
        if (type[0] === "_") continue;

        const childAliases = cClass.componentDocs?.childAliases;
        if (childAliases) {
            for (const target of Object.values(childAliases)) {
                aliasTargets.add(target);
            }
        }

        // Mirror get-schema.ts filtering for the main schema check.
        if (cClass.excludeFromSchema) continue;
        componentNames.add(type);

        const declared = getDeclaredDocsSlug(cClass.componentDocs, type);

        // Intentionally undocumented — silent.
        if (declared === null) continue;

        if (docsPages.has(declared)) continue;

        const declaredAsOverride =
            cClass.componentDocs &&
            "docsSlug" in cClass.componentDocs &&
            typeof cClass.componentDocs.docsSlug === "string";

        // An explicit override that doesn't resolve is always a hard error,
        // regardless of allow-list (a typo in the slug should never be hidden).
        if (declaredAsOverride) {
            brokenSlugs.push({ name: type, slug: declared });
            continue;
        }

        if (allowlist.has(type)) {
            warnings.push(type);
        } else {
            failures.push(type);
        }
    }

    // Alias targets (e.g. `<matrixRow>` reached only via `<matrix>`'s
    // `childAliases`) must resolve to a real docs page or be explicitly null.
    for (const target of aliasTargets) {
        const cClass = allComponentClasses[target];
        if (!cClass) {
            brokenSlugs.push({ name: `(alias target) ${target}`, slug: "" });
            continue;
        }
        const declared = getDeclaredDocsSlug(cClass.componentDocs, target);
        if (declared === null) continue;
        if (docsPages.has(declared)) continue;
        brokenSlugs.push({
            name: `(alias target) ${target}`,
            slug: declared,
        });
    }

    for (const name of allowlist) {
        if (!componentNames.has(name)) {
            obsoleteAllowlistEntries.push(name);
            continue;
        }
        const cClass = allComponentClasses[name];
        const declared = getDeclaredDocsSlug(cClass.componentDocs, name);
        // If declared is null (intentional) or the page now exists, the
        // allow-list entry is redundant.
        if (declared === null || docsPages.has(declared)) {
            obsoleteAllowlistEntries.push(name);
        }
    }

    console.log(
        `Docs coverage: ${componentNames.size} schema components; ` +
            `${docsPages.size} reference pages; ` +
            `${warnings.length} on allow-list; ` +
            `${
                failures.length +
                brokenSlugs.length +
                obsoleteAllowlistEntries.length
            } unresolved.`,
    );

    if (warnings.length > 0) {
        console.warn(
            `\n[warn] ${warnings.length} components have no docs page (allow-listed). ` +
                `Add docs and remove from undocumented-components-allowlist.txt:`,
        );
        for (const n of warnings) console.warn(`  - ${n}`);
    }

    if (obsoleteAllowlistEntries.length > 0) {
        console.error(
            `\n[error] ${obsoleteAllowlistEntries.length} allow-list entries are obsolete. ` +
                `Remove them from undocumented-components-allowlist.txt:`,
        );
        for (const n of obsoleteAllowlistEntries) console.error(`  - ${n}`);
    }

    if (brokenSlugs.length > 0) {
        console.error(
            `\n[error] ${brokenSlugs.length} components declare a docsSlug that doesn't ` +
                `match any .mdx file in pages/reference/:`,
        );
        for (const { name, slug } of brokenSlugs) {
            console.error(`  - ${name} → ${slug}.mdx (missing)`);
        }
    }

    if (failures.length > 0) {
        console.error(
            `\n[error] ${failures.length} components have no docs page and are not on the allow-list. ` +
                `Either add a docs page at packages/docs-nextra/pages/reference/<name>.mdx, ` +
                `set componentDocs.docsSlug to point to an existing page, or set ` +
                `componentDocs.docsSlug = null to mark as intentionally undocumented:`,
        );
        for (const n of failures) console.error(`  - ${n}`);
    }

    const hardFailures =
        failures.length + brokenSlugs.length + obsoleteAllowlistEntries.length;
    if (hardFailures > 0) {
        process.exit(1);
    }
}

main();
