/**
 * Static LSP-side resolver for the active `<styleDefinition>` context at a
 * given DAST element. Issue #1198: the editor's autocomplete / hover panel
 * for a per-component style attribute (e.g. `<point markerStyle="…">`) or
 * a `<styleDefinition>` attribute should surface whatever value is currently
 * in effect at that scope, not just the schema's static fallback.
 *
 * This mirrors the worker's two-step resolution (walk ancestor
 * `<styleDefinition>` blocks, then look up by `styleNumber`) without
 * any worker round-trip — the LSP works off the parsed DAST and the same
 * built-in presets that ship from `@doenet/utils/style`.
 *
 * Divergence from the runtime is accepted in three known cases, all called
 * out by the issue's edge-case list:
 *   - Dynamically-computed `styleNumber` (`<point styleNumber="$n"/>`) — we
 *     read the attribute text only, so a macro yields `undefined` and the
 *     active default falls back to the built-in preset for styleNumber=1.
 *   - `<styleDefinition>` blocks parented by an element that doesn't host a
 *     `styleDefinitions` state variable (e.g. someone tucks one inside
 *     `<graph>`) — the runtime ignores them; we include them. Best-effort
 *     hint that matches what an author would expect to influence the view.
 *   - Resolution while the DAST is still mid-edit — we return whatever the
 *     current parse contains, including incomplete styleDefinitions.
 */

import type { DastElement, DastNodes, DastRoot } from "@doenet/parser";
import { toXml } from "@doenet/parser";
import {
    DEFAULT_STYLE_VALUES,
    returnDefaultStyleDefinitions,
    styleAttributes,
    type StyleAttributes,
    type StyleDefinitionKey,
    type StyleDefinitionPrimitive,
    type PrimitiveStyleDefinition,
    type ResolvedStyleDefinition,
    unwrapStyleDefinition,
    resolveStyleDefinition,
} from "@doenet/utils";
import type { DoenetSourceObject } from "../doenet-source-object";

/**
 * Result of resolving the active style at a particular element. `styleNumber`
 * is the integer the element is rendered under (1 by default, falling back
 * up the parent chain like the runtime's `fallBackToParentStateVariable`).
 * `style` is the fully-populated style values for that styleNumber after
 * built-in presets and ancestor `<styleDefinition>` blocks are merged.
 */
export interface ActiveStyleResolution {
    styleNumber: number;
    style: ResolvedStyleDefinition;
}

/**
 * Lowercased view of `styleAttributes` so callers can quickly test whether an
 * attribute name (as it appears in DAST, which preserves authored casing) is
 * a known style attribute without re-walking the map each time.
 */
const STYLE_ATTRIBUTE_KEY_BY_LOWER: ReadonlyMap<string, StyleDefinitionKey> =
    new Map(
        (Object.keys(styleAttributes) as StyleDefinitionKey[]).map((k) => [
            k.toLowerCase(),
            k,
        ]),
    );

/** True when `attributeName` is a `styleAttributes` key (case-insensitive). */
export function isStyleAttributeName(attributeName: string): boolean {
    return STYLE_ATTRIBUTE_KEY_BY_LOWER.has(attributeName.toLowerCase());
}

/** Canonical (camel-case) `styleAttributes` key for a case-insensitive name. */
export function canonicalStyleAttributeKey(
    attributeName: string,
): StyleDefinitionKey | undefined {
    return STYLE_ATTRIBUTE_KEY_BY_LOWER.get(attributeName.toLowerCase());
}

/** Look up an attribute on `element` case-insensitively and return its
 * trimmed text content, or undefined if absent or empty. Mirrors the helper
 * in `dast-attribute-utils` but inlined to avoid a public-API dep on that
 * module from the style-context layer. */
function readAttributeText(
    element: DastElement,
    attributeName: string,
): string | undefined {
    const target = attributeName.toLowerCase();
    const key = Object.keys(element.attributes).find(
        (k) => k.toLowerCase() === target,
    );
    if (key === undefined) return undefined;
    const attr = element.attributes[key];
    if (!attr) return undefined;
    const value = toXml(attr.children).trim();
    return value.length > 0 ? value : undefined;
}

/**
 * Parse a `styleNumber` attribute. Returns the integer when the text parses
 * cleanly to a positive integer; returns undefined otherwise so the caller
 * can fall back to its own rule (typically: inherit, then default to 1).
 *
 * Dynamic values like `$n` parse to NaN and are intentionally treated as
 * "unknown" — the LSP doesn't evaluate macros, and we prefer a clean fallback
 * to the built-in styleNumber=1 over a misleading guess.
 */
function parseStyleNumberAttribute(element: DastElement): number | undefined {
    const raw = readAttributeText(element, "styleNumber");
    if (raw === undefined) return undefined;
    const n = Number(raw);
    if (!Number.isFinite(n)) return undefined;
    const asInt = Math.trunc(n);
    return asInt >= 1 ? asInt : undefined;
}

/**
 * Resolve the styleNumber active at `element`. For a `<styleDefinition>` we
 * read its own `styleNumber` attribute (it's the styleNumber being defined).
 * For every other element we follow the runtime's
 * `fallBackToParentStateVariable: "styleNumber"` rule: walk parents until we
 * see an explicit `styleNumber` attribute, then default to 1.
 */
export function resolveActiveStyleNumber(
    sourceObj: DoenetSourceObject,
    element: DastElement,
): number {
    if (element.name === "styleDefinition") {
        return parseStyleNumberAttribute(element) ?? 1;
    }
    let current: DastElement | DastRoot | null = element;
    while (current && current.type === "element") {
        const parsed = parseStyleNumberAttribute(current);
        if (parsed !== undefined) return parsed;
        current = sourceObj.getParent(current);
    }
    return 1;
}

/**
 * Collect ancestors of `leaf` from root toward the leaf's parent, inclusive
 * of the root and exclusive of the leaf itself. The order matches the
 * runtime's inheritance: deeper ancestors merge their `<styleDefinition>`
 * blocks last so they win the same way the worker's ancestor-chain
 * computation does.
 */
function ancestorChainRootToLeaf(
    sourceObj: DoenetSourceObject,
    leaf: DastElement,
): (DastElement | DastRoot)[] {
    return sourceObj.getParents(leaf).slice().reverse();
}

/**
 * Find `<styleDefinition>` blocks owned by `ancestor`. The runtime accepts
 * them via two routes (see `Setup.js` / `SectioningComponent.js`):
 *   - direct child of the ancestor, or
 *   - direct child of a `<setup>` child of the ancestor.
 *
 * The legacy `<styleDefinitions>` (plural) wrapper is sugar-flattened by the
 * worker's `Setup` sugar; we walk into it explicitly so the LSP picks up the
 * same blocks even on documents that haven't been sugar-rewritten yet.
 *
 * Returned in source order so callers that need last-wins semantics (e.g.
 * two siblings with the same styleNumber) get the same answer the runtime
 * computes.
 */
function findOwnedStyleDefinitions(
    ancestor: DastElement | DastRoot,
): DastElement[] {
    const out: DastElement[] = [];
    for (const child of ancestor.children) {
        if (child.type !== "element") continue;
        if (child.name === "styleDefinition") {
            out.push(child);
            continue;
        }
        if (child.name === "setup") {
            for (const grand of child.children) {
                if (grand.type !== "element") continue;
                if (grand.name === "styleDefinition") {
                    out.push(grand);
                } else if (grand.name === "styleDefinitions") {
                    for (const greatGrand of grand.children) {
                        if (
                            greatGrand.type === "element" &&
                            greatGrand.name === "styleDefinition"
                        ) {
                            out.push(greatGrand);
                        }
                    }
                }
            }
        }
    }
    return out;
}

/**
 * Coerce the raw attribute text of a `<styleDefinition>` attribute to the
 * primitive shape the runtime would produce. Number and boolean attributes
 * follow the same parsing rules `createComponentOfType` applies on the
 * runtime side (`Number(...)` for numerics, `"true"`/`"false"` for booleans).
 * Text attributes are lowercased unconditionally to match
 * `StyleDefinitions.js`'s historical normalization of every string value.
 *
 * Returns undefined for malformed inputs so the caller can leave the slot
 * unmerged — better to fall back to the inherited / preset value than
 * fabricate one.
 */
function parseStyleAttributeText(
    key: StyleDefinitionKey,
    raw: string,
    attrs: StyleAttributes,
): StyleDefinitionPrimitive | undefined {
    const spec = attrs[key];
    if (!spec) return undefined;
    switch (spec.componentType) {
        case "number":
        case "integer": {
            const n = Number(raw);
            return Number.isFinite(n) ? n : undefined;
        }
        case "boolean": {
            const v = raw.trim().toLowerCase();
            if (v === "true") return true;
            if (v === "false") return false;
            return undefined;
        }
        default:
            // Match `<styleDefinition>` runtime normalization in
            // `StyleDefinitions.js`: every string value is lowercased. The
            // per-component override path is more selective (only enum-typed
            // keys opt in to lowercasing) but the resolver's job is to model
            // the inherited *styleDefinition* values, which always come
            // through the styleDefinition path.
            return raw.toLowerCase();
    }
}

/**
 * Merge the parsed attribute values of one `<styleDefinition>` element into
 * the running primitive style map. Unknown keys (not in `styleAttributes`)
 * are ignored — they aren't part of the contract and the LSP shouldn't
 * invent meaning the runtime won't honor.
 */
function mergeStyleDefinitionInto(
    target: PrimitiveStyleDefinition,
    styleDef: DastElement,
): void {
    for (const attrName of Object.keys(styleDef.attributes)) {
        const key = canonicalStyleAttributeKey(attrName);
        if (key === undefined) continue;
        const raw = readAttributeText(styleDef, attrName);
        if (raw === undefined) continue;
        const parsed = parseStyleAttributeText(key, raw, styleAttributes);
        if (parsed === undefined) continue;
        target[key] = parsed;
    }
}

/**
 * Lazy-initialized primitive view of the runtime's 6 built-in styleDefinitions
 * (lazy so the module-load cost is paid only when the help panel actually
 * resolves an active style). `returnDefaultStyleDefinitions` returns the
 * position-wrapped runtime shape; we unwrap to primitives because the LSP
 * doesn't need source positions for the active-default hint.
 */
let _builtInPresetsCache: Map<number, PrimitiveStyleDefinition> | undefined;
function builtInPresets(): Map<number, PrimitiveStyleDefinition> {
    if (_builtInPresetsCache) return _builtInPresetsCache;
    const wrapped = returnDefaultStyleDefinitions();
    const out = new Map<number, PrimitiveStyleDefinition>();
    for (const [k, def] of Object.entries(wrapped)) {
        out.set(Number(k), unwrapStyleDefinition(def));
    }
    _builtInPresetsCache = out;
    return out;
}

/**
 * Return a fresh primitive-only style map for `styleNumber`, seeded from the
 * built-in preset for that number or (for unknown numbers) from
 * `DEFAULT_STYLE_VALUES`. Cloned so the caller can mutate freely.
 */
function seedStyleDefinition(styleNumber: number): PrimitiveStyleDefinition {
    const preset = builtInPresets().get(styleNumber);
    if (preset) return { ...preset };
    return { ...DEFAULT_STYLE_VALUES };
}

/**
 * Resolve the active style at `element`'s scope. The walk:
 *   1. Determine the styleNumber active at `element`.
 *   2. Seed a primitive style map from the built-in preset for that number
 *      (or the global default if the number is unknown).
 *   3. Walk ancestors root-to-leaf; for each, merge `<styleDefinition>`
 *      blocks whose `styleNumber` matches, in source order so later wins.
 *      Skip `options.excludeNode` so callers inside a `<styleDefinition>`
 *      see what their *peers* contribute, not what they themselves do.
 *   4. Pass through `resolveStyleDefinition` so every key in the
 *      `ResolvedStyleDefinition` shape is populated — the same fallback
 *      pass the runtime uses for `selectedStyle`.
 *
 * Returns null only when `element` isn't part of a parsed DAST chain (no
 * parent map entry), in which case there's nothing useful to show.
 */
export function resolveActiveStyle(
    sourceObj: DoenetSourceObject,
    element: DastElement,
    options: { excludeNode?: DastElement } = {},
): ActiveStyleResolution | null {
    const styleNumber = resolveActiveStyleNumber(sourceObj, element);

    const merged = seedStyleDefinition(styleNumber);

    for (const ancestor of ancestorChainRootToLeaf(sourceObj, element)) {
        for (const styleDef of findOwnedStyleDefinitions(ancestor)) {
            if (styleDef === options.excludeNode) continue;
            const sdNumber = parseStyleNumberAttribute(styleDef) ?? 1;
            if (sdNumber !== styleNumber) continue;
            mergeStyleDefinitionInto(merged, styleDef);
        }
    }

    return {
        styleNumber,
        style: resolveStyleDefinition(merged),
    };
}

/**
 * Convenience: return the resolved value for `attributeName` at `element`'s
 * scope, or undefined if the name isn't a styleAttribute. Used by the
 * context-help layer to populate `activeDefault` only for style attributes.
 */
export function resolveActiveStyleAttributeValue(
    sourceObj: DoenetSourceObject,
    element: DastElement,
    attributeName: string,
    options: { excludeNode?: DastElement } = {},
): { value: StyleDefinitionPrimitive; styleNumber: number } | undefined {
    const key = canonicalStyleAttributeKey(attributeName);
    if (key === undefined) return undefined;
    const resolved = resolveActiveStyle(sourceObj, element, options);
    if (!resolved) return undefined;
    const value = resolved.style[key];
    if (value === undefined) return undefined;
    return { value, styleNumber: resolved.styleNumber };
}

// Re-exports for tests / consumers that don't import @doenet/utils directly.
export type { DastNodes };
