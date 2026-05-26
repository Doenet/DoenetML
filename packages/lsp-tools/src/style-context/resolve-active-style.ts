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

import type { DastElement, DastRoot } from "@doenet/parser";
import { toXml } from "@doenet/parser";
// Pulled from `@doenet/utils/style` rather than `@doenet/utils` so the LSP
// worker bundle stays slim — the root export drags in math-expressions / AST
// helpers / URL utilities the resolver doesn't need, and the worker is loaded
// on the critical path before the editor can answer cursor-help requests
// (boot lag here surfaces as flaky "no help on first cursor change" in CI).
import {
    DEFAULT_STYLE_VALUES,
    addMissingChildStyleColorFields,
    colorValueToWord,
    coloredItemsForWords,
    deriveMissingStyleWords,
    resolveStyleDefinition,
    returnDefaultStyleDefinitions,
    setStyleValue,
    styleAttributes,
    unwrapStyleDefinition,
    type PrimitiveStyleDefinition,
    type ResolvedStyleDefinition,
    type StyleAttributes,
    type StyleDefinition,
    type StyleDefinitionKey,
    type StyleDefinitionPrimitive,
} from "@doenet/utils/style";
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
function canonicalStyleAttributeKey(
    attributeName: string,
): StyleDefinitionKey | undefined {
    return STYLE_ATTRIBUTE_KEY_BY_LOWER.get(attributeName.toLowerCase());
}

/**
 * Set of hex-bearing color attribute keys derived from the runtime's
 * canonical `coloredItemsForWords` list — `lineColor`, `lineColorDarkMode`,
 * `fillColor`, `fillColorDarkMode`, etc. Excludes the `*Word` companions
 * (those carry the human-readable name directly, no derivation needed).
 *
 * Built from the runtime list rather than a name-shape regex so a future
 * color-bearing item (e.g. a hypothetical `gridColor`) only needs adding
 * to `coloredItemsForWords` to be recognized by the active-default surface.
 */
const COLOR_ATTRIBUTE_KEYS: ReadonlySet<StyleDefinitionKey> = new Set(
    coloredItemsForWords.flatMap((item) => [
        `${item}Color` as StyleDefinitionKey,
        `${item}ColorDarkMode` as StyleDefinitionKey,
    ]),
);

/**
 * True when `key` names a hex-bearing color attribute (not a `*Word`
 * companion). Used by the active-default surface to decide whether to
 * compute a parenthesized color word alongside the raw hex value.
 *
 * Match is on the canonical (camel-case) key, since callers route through
 * `canonicalStyleAttributeKey` before checking — that already case-folds.
 */
function isColorAttributeKey(key: StyleDefinitionKey): boolean {
    return COLOR_ATTRIBUTE_KEYS.has(key);
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
 * Build a single `<styleDefinition>` block's contribution as a wrapped
 * `StyleDefinition`, ready to be normalized with the worker's runtime
 * helpers. Unknown keys (not in `styleAttributes`) are ignored — they
 * aren't part of the contract and the LSP shouldn't invent meaning the
 * runtime won't honor.
 *
 * `excludeAttributeName`, when set, drops the named attribute from the
 * block — used by the active-default hint inside a `<styleDefinition>` to
 * answer "what would the value be if I removed *just this attribute*"
 * (the rest of the block still participates in derivation, so authoring
 * `markerColor` and querying `markerColorWord` sees the derived word
 * instead of the inherited one).
 */
function buildStyleDefinitionBlock(
    styleDef: DastElement,
    excludeAttributeName: string | undefined,
): StyleDefinition {
    const block: StyleDefinition = {};
    const excludeLower = excludeAttributeName?.toLowerCase();
    for (const attrName of Object.keys(styleDef.attributes)) {
        if (
            excludeLower !== undefined &&
            attrName.toLowerCase() === excludeLower
        ) {
            continue;
        }
        const key = canonicalStyleAttributeKey(attrName);
        if (key === undefined) continue;
        const raw = readAttributeText(styleDef, attrName);
        if (raw === undefined) continue;
        const parsed = parseStyleAttributeText(key, raw, styleAttributes);
        if (parsed === undefined) continue;
        setStyleValue(block, key, parsed);
    }
    // Mirror the worker's per-block normalization in
    // `returnStyleDefinitionStateVariables`: dark-mode fallback +
    // `*ColorWord` derivation, then `lineWidthWord` / `lineStyleWord` /
    // `markerStyleWord` derivation from underlying values. Run on the
    // block (with `excludeAttribute` already dropped) so the cumulative
    // map below sees the right values for cross-attribute relationships
    // — e.g. setting `markerColor="#123456"` re-derives `markerColorWord`
    // to the new hex's word, replacing whatever the preset shipped.
    addMissingChildStyleColorFields(block);
    deriveMissingStyleWords(block);
    return block;
}

/**
 * Merge one normalized `<styleDefinition>` block into the running primitive
 * style map. Authored values win; only keys present on the block move into
 * the target. (Other keys keep whatever the cumulative map already had —
 * inherited from the preset seed or an earlier merge in the chain.)
 *
 * Defers to `unwrapStyleDefinition` so the wrapper shape stays a detail of
 * `@doenet/utils/style` rather than something this layer reaches into.
 */
function mergeBlockInto(
    target: PrimitiveStyleDefinition,
    block: StyleDefinition,
): void {
    Object.assign(target, unwrapStyleDefinition(block));
}

/**
 * Lazy-initialized primitive view of the runtime's 6 built-in styleDefinitions
 * (lazy so the module-load cost is paid only when the help panel actually
 * resolves an active style). `returnDefaultStyleDefinitions` returns the
 * position-wrapped runtime shape; we unwrap to primitives because the LSP
 * doesn't need source positions for the active-default hint.
 */
let _builtInPresetsCache:
    | ReadonlyMap<number, Readonly<PrimitiveStyleDefinition>>
    | undefined;
function builtInPresets(): ReadonlyMap<
    number,
    Readonly<PrimitiveStyleDefinition>
> {
    if (_builtInPresetsCache) return _builtInPresetsCache;
    const wrapped = returnDefaultStyleDefinitions();
    const out = new Map<number, Readonly<PrimitiveStyleDefinition>>();
    for (const [k, def] of Object.entries(wrapped)) {
        // Freeze the cached value so a caller that forgets to clone (via
        // `seedStyleDefinition`'s spread) gets a crash on write rather than
        // silently mutating the shared preset for every subsequent lookup.
        out.set(Number(k), Object.freeze(unwrapStyleDefinition(def)));
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
 * Identifies a single attribute on a single `<styleDefinition>` node to drop
 * from the merge — the active-default hint excludes the attribute the cursor
 * is currently editing so the displayed value is "what would this resolve to
 * if I removed *just this attribute*". Per-attribute (not per-node) so that
 * inter-attribute derivations within the same block still take effect: an
 * author editing `markerColorWord` inside
 * `<styleDefinition markerColor="#123456" markerColorWord="custom">` sees the
 * word derived from `#123456`, not the inherited preset.
 */
export interface ExcludeAttribute {
    node: DastElement;
    attributeName: string;
}

/**
 * Resolve the active style at `element`'s scope. The walk:
 *   1. Determine the styleNumber active at `element`.
 *   2. Seed a primitive style map from the built-in preset for that number
 *      (or the global default if the number is unknown).
 *   3. Walk ancestors root-to-leaf; for each, build a normalized
 *      `<styleDefinition>` block (per-block dark-mode + word derivation,
 *      mirroring the worker's `returnStyleDefinitionStateVariables`) for
 *      every block whose `styleNumber` matches, skipping
 *      `options.excludeAttribute.attributeName` on the matching node so the
 *      hint reflects "what if I removed just this attribute". Merge in
 *      source order so later wins.
 *   4. Pass through `resolveStyleDefinition` so every key in the
 *      `ResolvedStyleDefinition` shape is populated — the same fallback
 *      pass the runtime uses for `selectedStyle`.
 *
 * Always returns a resolution: an orphan element (one not parented in the
 * DAST) gets an empty ancestor chain, so the result is the bare built-in
 * preset for the resolved styleNumber.
 */
export function resolveActiveStyle(
    sourceObj: DoenetSourceObject,
    element: DastElement,
    options: { excludeAttribute?: ExcludeAttribute } = {},
): ActiveStyleResolution {
    const styleNumber = resolveActiveStyleNumber(sourceObj, element);

    const merged = seedStyleDefinition(styleNumber);

    for (const ancestor of ancestorChainRootToLeaf(sourceObj, element)) {
        for (const styleDef of findOwnedStyleDefinitions(ancestor)) {
            const sdNumber = parseStyleNumberAttribute(styleDef) ?? 1;
            if (sdNumber !== styleNumber) continue;
            const excludeAttrName =
                options.excludeAttribute &&
                styleDef === options.excludeAttribute.node
                    ? options.excludeAttribute.attributeName
                    : undefined;
            const block = buildStyleDefinitionBlock(styleDef, excludeAttrName);
            mergeBlockInto(merged, block);
        }
    }

    return {
        styleNumber,
        style: resolveStyleDefinition(merged),
    };
}

/**
 * Resolved value plus styleNumber for the active-default surface. For color
 * attributes (`lineColor`, `fillColorDarkMode`, etc.), also carries the
 * human-readable `colorWord` derived via `colorValueToWord` — the help
 * panel renders it in parens next to the hex so authors don't have to
 * eyeball "#648FFF" to remember it's the cornflower-ish default.
 *
 * `colorWord` is suppressed when the resolved value is itself a CSS named
 * color (e.g. `lineColor="red"`) since `red (red)` would just be noise.
 * Detected by string equality after lowercasing both sides, mirroring the
 * worker's `<styleDefinition>` lowercase-on-read normalization.
 */
export interface ActiveStyleAttributeValue {
    value: StyleDefinitionPrimitive;
    styleNumber: number;
    /** Present only for non-word color attributes whose word differs from
     *  the raw value. The help panel pairs it with `value` in the
     *  "Active default" row and applies the value's hex as the text color
     *  so the word and hex render in the color they describe. */
    colorWord?: string;
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
    options: { excludeAttribute?: ExcludeAttribute } = {},
): ActiveStyleAttributeValue | undefined {
    const key = canonicalStyleAttributeKey(attributeName);
    if (key === undefined) return undefined;
    const resolved = resolveActiveStyle(sourceObj, element, options);
    const value = resolved.style[key];
    if (value === undefined) return undefined;
    const result: ActiveStyleAttributeValue = {
        value,
        styleNumber: resolved.styleNumber,
    };
    if (isColorAttributeKey(key) && typeof value === "string") {
        const word = colorValueToWord(value);
        // Skip when the value already IS the word (CSS named color) — no
        // point rendering "red (red)" — or when the word came back empty
        // (invalid color values; the resolver returns "" rather than a
        // misleading guess).
        if (word && word.toLowerCase() !== value.toLowerCase()) {
            result.colorWord = word;
        }
    }
    return result;
}
