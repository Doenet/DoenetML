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
 *   - `getModuleDeclaredAttributes(moduleDefn)`: walks the definition's
 *     children for `<moduleAttributes>` and extracts each declared attribute
 *     name along with the child element's component type (e.g. `"point"` for
 *     `<point name="center">`).
 *   - `mergeDeclaredIntoSchemaAttributes(...)`: synthesizes `SchemaAttribute`
 *     entries for the completion path, threading the component type through
 *     the description so the dropdown and help panel show e.g.
 *     "Author-declared module attribute (`<point>`)".
 *
 * The resolver-dependent helpers that bridge a `<module copy="$x" ...>` site
 * to its definition's DAST node live alongside in a later step (using the
 * `_rustIndexToDastElement` map the rust-resolver-adapter already maintains).
 */

import type { DastElement, DastNodes, DastRoot } from "@doenet/parser";
import type { SchemaAttribute } from "./index";
import type { RustResolverAdapter } from "./rust-resolver-adapter";
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
 * Metadata captured for one author-declared attribute on a `<module>`.
 *
 * `componentType` is the lowercased tag name of the child element that
 * carried the `name=` attribute inside `<moduleAttributes>` — e.g. `"point"`
 * for `<point name="center">`.  Surfaced verbatim in the completion and
 * help-panel descriptions so authors see what type of value the original
 * module declared (#1189).
 */
export type DeclaredModuleAttribute = {
    componentType: string;
};

/**
 * Lowercased map from attribute name to declared-attribute metadata for a
 * `<module>` definition's `<moduleAttributes>` child.
 *
 * Behavior:
 *   - Returns an empty map when `moduleDefn` is not a `<module>` element
 *     (case-insensitive name check).
 *   - Returns an empty map when `<moduleAttributes>` is absent, or present
 *     but contains no qualifying children.
 *   - For each direct child element of `<moduleAttributes>` that has a
 *     primitive `name` attribute, lowercases the name and records the
 *     child's lowercased tag name as `componentType`.
 *   - Skips children whose name collides with `RESERVED_MODULE_ATTRIBUTE_NAMES`
 *     — the runtime ignores those (silent warning), so synthesizing a
 *     "declared" entry for `hide` / `name` / `copy` would mislead the
 *     completion dropdown.
 *
 * Only DIRECT children of `<moduleAttributes>` are considered, matching the
 * runtime's `for (const child of children)` walk at `ModuleAttributes.js:122`.
 */
export function getModuleDeclaredAttributes(
    moduleDefn: DastElement,
): Map<string, DeclaredModuleAttribute> {
    if (moduleDefn.name.toLowerCase() !== "module") return new Map();

    const attrsBlock = moduleDefn.children.find(
        (c): c is DastElement =>
            c.type === "element" && c.name.toLowerCase() === "moduleattributes",
    );
    if (!attrsBlock) return new Map();

    const declared = new Map<string, DeclaredModuleAttribute>();
    for (const child of attrsBlock.children) {
        if (child.type !== "element") continue;
        const name = readPrimitiveNameAttribute(child);
        if (name === undefined) continue;
        const lowered = name.toLowerCase();
        if (RESERVED_MODULE_ATTRIBUTE_NAMES.has(lowered)) continue;
        // First-wins on duplicate names — the runtime's name lookup against
        // `module.attributes` keys by lowercased name and only sees one
        // entry per key, so we mirror that and keep the source-order first.
        if (declared.has(lowered)) continue;
        declared.set(lowered, { componentType: child.name.toLowerCase() });
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
 *   - `description`: the declared child's component type wrapped in backticks
 *     so the markdown-rendered help panel and autocomplete dropdown surface
 *     it as inline code — e.g. "Author-declared module attribute
 *     (\`<point>\`)" for `<point name="center">` (#1189).
 *
 * No `values` or `autocompleteValues` (names-only scope, per plan).
 */
export function mergeDeclaredIntoSchemaAttributes(
    canonical: SchemaAttribute[],
    declared: ReadonlyMap<string, DeclaredModuleAttribute>,
): SchemaAttribute[] {
    if (declared.size === 0) return canonical;

    const canonicalLowered = new Set(
        canonical.map((a) => a.name.toLowerCase()),
    );
    const merged = canonical.slice();
    for (const [name, meta] of declared) {
        if (canonicalLowered.has(name)) continue;
        merged.push({
            name,
            description: describeDeclaredModuleAttribute(meta),
        });
    }
    return merged;
}

/**
 * Build the description string for a synthesized author-declared module
 * attribute.  Exported so other surfaces (e.g. the schema-violations layer's
 * follow-up diagnostics, or future help-panel enrichments) can render the
 * same text without re-deriving it from the child element.  The component
 * type is wrapped in backticks so LSP markdown rendering surfaces it as
 * inline code (matches how canonical schema descriptions reference element
 * names — `asMarkdown` in get-completion-items.ts already declares the text
 * as markdown).
 */
export function describeDeclaredModuleAttribute(
    meta: DeclaredModuleAttribute,
): string {
    return `Author-declared module attribute (\`<${meta.componentType}>\`)`;
}

/**
 * Read a bare-name reference path (e.g. `$drawBalloon` or `$s.m`) from an
 * attribute's children, returning the segment names as an array (one
 * element for `$drawBalloon`, two for `$s.m`, …).  Returns `undefined` when
 * the attribute is anything more complex than a bare-name macro path:
 * multiple children, text, any segment carrying a bracket index (`$arr[0]`),
 * or a missing segment name.
 *
 * The runtime resolver handles arbitrarily complex reference values, but the
 * per-instance attribute augmentation only fires for bare-name paths —
 * bracket-bearing segments are conservatively skipped per the plan's
 * scope-lock, so the LSP never silently augments a site whose runtime
 * resolution we can't follow exactly (the takesIndex semantics under a
 * sectioning parent are subtle enough that bracket support is its own
 * follow-up rather than a freebie of multi-segment lookup).
 */
function readBareReferencePath(
    moduleElement: DastElement,
    attributeName: string,
): string[] | undefined {
    const key = findAttributeKey(moduleElement, attributeName);
    if (key === undefined) return undefined;
    const children = moduleElement.attributes[key]?.children;
    if (!children || children.length !== 1) return undefined;
    const only = children[0];
    // Only bare-name macros (`$x`, `$s.m`).  Function-macro values
    // (`copy="$$f(x)"`) and plain-text values are intentional fallthroughs:
    // the caller treats `undefined` as "no augmentation applies".
    if (only.type !== "macro") return undefined;
    if (only.path.length === 0) return undefined;
    const names: string[] = [];
    for (const part of only.path) {
        if (part.index.length !== 0) return undefined;
        if (!part.name) return undefined;
        names.push(part.name);
    }
    return names;
}

/**
 * Resolve a `<module copy="$x" .../>` (or `extend=`) instance to the
 * `<module name="x">` declaration's DAST node via the rust resolver bridge.
 *
 * Multi-segment paths (`copy="$s.m"`) are supported: the resolver walks
 * the path the same way the runtime does, including descending into named
 * descendants of a `<section>`/`<group>`/etc. parent.
 *
 * Returns `null` when:
 *   - `moduleElement` is not a `<module>` element,
 *   - neither `copy=` nor `extend=` is present,
 *   - the attribute value is not a bare-name path (any segment with a
 *     bracket index, text content, or empty path returns undefined),
 *   - the resolver returns nothing or partially resolves the path,
 *   - the resolved target is not a `<module>` element,
 *   - the resolved target IS `moduleElement` itself (self-copy guard).
 *
 * `copy=` is consulted first; `extend=` is consulted only when `copy=` is
 * absent / non-bare.  Both have equivalent effect on `<moduleAttributes>`
 * consumption at runtime, so reading either is sufficient — the precedence
 * here matches what the runtime would resolve given both.
 *
 * Intentionally non-recursive: this function follows exactly one
 * `copy`/`extend` edge.  Cycles (`a` copies `b` copies `a`) are out of
 * scope; the runtime collapses chains through a different mechanism the
 * LSP doesn't reproduce.
 */
export async function resolveCopyExtendReference(
    moduleElement: DastElement,
    adapter: RustResolverAdapter,
): Promise<DastElement | null> {
    if (moduleElement.name.toLowerCase() !== "module") return null;

    const referencePath =
        readBareReferencePath(moduleElement, "copy") ??
        readBareReferencePath(moduleElement, "extend");
    if (!referencePath) return null;

    const target = await adapter.resolveBarePathAtOrigin(
        moduleElement,
        referencePath,
    );
    if (!target) return null;
    if (target === moduleElement) return null;
    if (target.name.toLowerCase() !== "module") return null;

    return target;
}

/**
 * For a `<module copy="$x" .../>` instance, return a lowercased map from
 * each attribute name declared by `$x`'s `<moduleAttributes>` block to its
 * declared metadata (currently just the child element's component type).
 *
 * Returns `null` (NOT an empty map) when no augmentation applies — the
 * caller distinguishes "fall back to canonical" from "augmentation
 * succeeded but the declared set was empty", and only the former is
 * meaningful here (an empty declared set means the target had no
 * additional attributes, so the canonical list is already complete and
 * augmentation would be a no-op).
 *
 * Per scope-lock: no wildcard fallback.  When this returns `null`, the
 * canonical `<module>` attribute list applies as-is and any unknown
 * attribute remains a (correct) warning.
 */
export async function getEffectiveModuleAttributes(
    moduleInstance: DastElement,
    adapter: RustResolverAdapter,
): Promise<Map<string, DeclaredModuleAttribute> | null> {
    const target = await resolveCopyExtendReference(moduleInstance, adapter);
    if (!target) return null;
    const declared = getModuleDeclaredAttributes(target);
    if (declared.size === 0) return null;
    return declared;
}

/**
 * Walk a DAST tree and return every `<module>` element that authored a
 * `copy=` or `extend=` attribute (case-insensitive on the element name AND
 * the attribute key — `findAttributeKey` already does the latter).  Used
 * by the precompute pass on `AutoCompleter` so we only fire per-instance
 * resolution for sites that could be augmented, not every `<module>` in
 * the document.
 *
 * Definition sites (`<module name="m">...</module>` without a copy/extend
 * reference) are intentionally skipped: there's no target to resolve, and
 * the `<moduleAttributes>` block inside them is consumed by other
 * validation paths (it lives as a child, not a reference target).
 */
export function collectModuleInstancesWithCopyOrExtend(
    root: DastRoot | DastElement,
): DastElement[] {
    const out: DastElement[] = [];
    const walk = (node: DastNodes) => {
        if (node.type !== "element") return;
        if (
            node.name.toLowerCase() === "module" &&
            (findAttributeKey(node, "copy") !== undefined ||
                findAttributeKey(node, "extend") !== undefined)
        ) {
            out.push(node);
        }
        for (const child of node.children) {
            walk(child as DastNodes);
        }
    };
    for (const child of root.children) {
        walk(child as DastNodes);
    }
    return out;
}
