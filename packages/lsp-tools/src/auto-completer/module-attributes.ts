/**
 * Per-instance attribute-name lookup for `<module copy="$x" .../>` (or
 * `extend=`) sites.  Issue #1154 (out-of-scope extension).
 *
 * The runtime accepts arbitrary author-defined attributes on a `<module>`
 * because `Module extends Group` and `Module.acceptAnyAttribute = true`, and
 * the names that count as "valid" are whatever the referenced module's
 * `<moduleAttributes>` block declares.  The LSP needs to mirror that:
 * `<module copy="$drawBalloon" center="(-5,0)" color="1" />` should NOT
 * warn on `center` / `color` when the resolved `<module name="drawBalloon">`
 * has `<moduleAttributes><point name="center"/><number name="color"/></moduleAttributes>`.
 *
 * This module hosts:
 *   - `RESERVED_MODULE_ATTRIBUTE_NAMES`: the names a runtime `<moduleAttributes>`
 *     block silently ignores (because they collide with `<module>`'s own
 *     attributes per `ModuleAttributes.js:111-114`).  The set is pinned against
 *     the canonical schema by a unit test so drift between the runtime's
 *     dynamic list and our snapshot is caught loudly.
 *   - `getModuleDeclaredAttributeNames(moduleDefn)`: walks the definition's
 *     children for `<moduleAttributes>` and extracts declared attribute names.
 *   - `mergeDeclaredIntoSchemaAttributes(...)`: synthesizes `SchemaAttribute`
 *     entries for the completion path.
 *
 * The resolver-dependent helpers that bridge a `<module copy="$x" ...>` site
 * to its definition's DAST node live alongside in a later step (using the
 * `_rustIndexToDastElement` map the rust-resolver-adapter already maintains).
 */

import type { DastElement } from "@doenet/parser";
import type { SchemaAttribute } from "./index";
import { findAttributeKey } from "./dast-attribute-utils";

/**
 * Names the runtime silently rejects inside `<moduleAttributes>` because they
 * collide with attributes the `<module>` component itself already declares.
 * Mirrors `ModuleAttributes.js:111-114`:
 *
 *   const existingModuleAttrNames = Object.keys(
 *       module.constructor.createAttributesObject(),
 *   ).map((x) => x.toLowerCase());
 *   existingModuleAttrNames.push("name");
 *
 * `Module` extends `Group` and removes `styleNumber`, so the canonical set is
 * Group's attributes minus `styleNumber`, plus `name`.  This snapshot is
 * pinned to the schema's `<module>` attribute list in `module-attributes.test.ts`
 * (the schema generator runs `createAttributesObject()` against the real class,
 * so any future addition there will fail that pin-test).
 *
 * Stored lowercased for case-insensitive comparison; runtime matches names
 * case-insensitively at `ModuleAttributes.js:108`.
 */
export const RESERVED_MODULE_ATTRIBUTE_NAMES: ReadonlySet<string> = new Set([
    "name",
    "hide",
    "disabled",
    "fixed",
    "fixlocation",
    "isresponse",
    "extend",
    "copy",
    "rendered",
    "createcomponentoftype",
    "numcomponents",
    "aslist",
]);

/**
 * Read the `name` attribute's text value off a DAST element, or `undefined`
 * when absent / non-textual.  Mirrors how `<moduleAttributes>` consumes its
 * children at runtime: `child.attributes.name?.primitive?.value` at
 * `ModuleAttributes.js:123` — only primitive (text) name values count, so
 * a name attribute like `<text name="$dyn">…</text>` is treated as nameless.
 *
 * Kept module-local rather than added to `dast-attribute-utils.ts` because
 * the runtime-equivalent contract here ("primitive text only") is narrower
 * than the general-purpose attribute-value reader.
 */
function readPrimitiveNameAttribute(el: DastElement): string | undefined {
    const key = findAttributeKey(el, "name");
    if (key === undefined) return undefined;
    const children = el.attributes[key]?.children;
    if (!children || children.length !== 1) return undefined;
    const only = children[0];
    if (only.type !== "text") return undefined;
    const trimmed = only.value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Lowercased set of attribute names declared by a `<module>` definition's
 * `<moduleAttributes>` child.
 *
 * Behavior:
 *   - Returns an empty set when `moduleDefn` is not a `<module>` element
 *     (case-insensitive name check).
 *   - Returns an empty set when `<moduleAttributes>` is absent, or present
 *     but contains no qualifying children.
 *   - For each direct child element of `<moduleAttributes>` that has a
 *     primitive `name` attribute, lowercases the name and adds it.
 *   - Skips children whose name collides with `RESERVED_MODULE_ATTRIBUTE_NAMES`
 *     — the runtime ignores those (silent warning), so synthesizing a
 *     "declared" entry for `hide` / `name` / `copy` would mislead the
 *     completion dropdown.
 *
 * Only DIRECT children of `<moduleAttributes>` are considered, matching the
 * runtime's `for (const child of children)` walk at `ModuleAttributes.js:122`.
 */
export function getModuleDeclaredAttributeNames(
    moduleDefn: DastElement,
): Set<string> {
    if (moduleDefn.name.toLowerCase() !== "module") return new Set();

    const attrsBlock = moduleDefn.children.find(
        (c): c is DastElement =>
            c.type === "element" && c.name.toLowerCase() === "moduleattributes",
    );
    if (!attrsBlock) return new Set();

    const declared = new Set<string>();
    for (const child of attrsBlock.children) {
        if (child.type !== "element") continue;
        const name = readPrimitiveNameAttribute(child);
        if (name === undefined) continue;
        const lowered = name.toLowerCase();
        if (RESERVED_MODULE_ATTRIBUTE_NAMES.has(lowered)) continue;
        declared.add(lowered);
    }
    return declared;
}

/**
 * Build a merged `SchemaAttribute[]` from the canonical `<module>` schema
 * list plus synthesized entries for each `declared` name not already present
 * (case-insensitive).  Used by the completion path so author-declared names
 * appear in the attribute-name dropdown alongside canonical ones.
 *
 * Synthesized entries carry:
 *   - `name`: the lowercased declared name (matches how the runtime stores
 *     and looks them up — see `ModuleAttributes.js:107-108`).  Validation is
 *     case-insensitive everywhere, so the lowercase form is the canonical
 *     representation for the synthesized entry.
 *   - `description`: a fixed placeholder.  The author's component type
 *     (e.g. "point" for `<point name="center">`) would be useful UX but
 *     would require the helper to take the child elements, not just names,
 *     and is intentionally left for a later UX pass per the plan's
 *     open-questions section.
 *
 * No `values` or `autocompleteValues` (names-only scope, per plan).
 */
export function mergeDeclaredIntoSchemaAttributes(
    canonical: SchemaAttribute[],
    declared: ReadonlySet<string>,
): SchemaAttribute[] {
    if (declared.size === 0) return canonical;

    const canonicalLowered = new Set(
        canonical.map((a) => a.name.toLowerCase()),
    );
    const merged = canonical.slice();
    for (const name of declared) {
        if (canonicalLowered.has(name)) continue;
        merged.push({
            name,
            description: "Author-declared module attribute",
        });
    }
    return merged;
}
