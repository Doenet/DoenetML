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
 *   - A reference-valued `styleNumber` or `palette` (`<point
 *     styleNumber="$n"/>`, `<stylePalette palette="$p"/>`). Both attributes
 *     are component-typed (`integer` and `text`), so the runtime resolves
 *     the reference and styles accordingly; we read attribute text only and
 *     cannot. The fallbacks then differ in shape but not in cause: the
 *     literal `"$n"` is not an integer, so the active default comes from the
 *     built-in preset for styleNumber=1, and the literal `"$p"` is not a
 *     registered palette name, so we report the default palette.
 *   - `<styleDefinition>` blocks (and `<stylePalette>` selections) parented
 *     by an element that doesn't host a `styleDefinitions` state variable
 *     (e.g. someone tucks one inside `<graph>`) — the runtime ignores them;
 *     we include them. Best-effort hint that matches what an author would
 *     expect to influence the view.
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
    DEFAULT_PALETTE_NAME,
    DEFAULT_STYLE_VALUES,
    STYLE_PALETTES,
    addMissingChildStyleColorFields,
    colorValueToWord,
    coloredItemsForWords,
    cycleStyleNumberForPalette,
    deriveMissingStyleWords,
    resolveStyleDefinition,
    returnPaletteStyleDefinitions,
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

/**
 * Style attribute prefixes recognized by {@link relevantStyleKeysForPrefixes}.
 * Tracks `coloredItemsForWords` from `@doenet/utils/style` — the canonical list
 * the runtime uses to derive `*Color`/`*ColorWord` companions.
 */
const STYLE_KEY_PREFIXES = coloredItemsForWords;
type StyleKeyPrefix = (typeof STYLE_KEY_PREFIXES)[number];

/** Lowercased prefixes paired with their canonical form, precomputed so
 *  `stylePrefixOfKey` doesn't re-lowercase the prefix list on every call. */
const STYLE_KEY_PREFIXES_LOWER: ReadonlyArray<
    readonly [string, StyleKeyPrefix]
> = STYLE_KEY_PREFIXES.map((p) => [p.toLowerCase(), p] as const);

/**
 * Map a canonical `styleAttributes` key to its prefix bucket (e.g.
 * `markerStyle` → `marker`, `fillColorDarkMode` → `fill`).  Returns undefined
 * for any key that doesn't start with one of the canonical prefixes — none
 * exist today, but the guard makes the function safe to call with a hand-
 * built key that drifts from the canonical set.
 */
function stylePrefixOfKey(key: StyleDefinitionKey): StyleKeyPrefix | undefined {
    const lower = key.toLowerCase();
    for (const [prefixLower, prefix] of STYLE_KEY_PREFIXES_LOWER) {
        if (lower.startsWith(prefixLower)) return prefix;
    }
    return undefined;
}

/**
 * Detect which style prefixes a component is "about" by inspecting the names
 * of style attributes declared on its schema (the per-component override
 * surface — `<point markerStyle>`, `<line lineWidth>`, etc.).  Used by the
 * #1204 breakdown surface to limit the help panel listing to the categories
 * a component actually uses, instead of showing every prefix for every
 * graphical element.
 *
 * Source of truth: the schema attribute list, not a hand-maintained per-
 * componentType map.  The runtime declares `static styleOverrideCategories`
 * in JS-worker classes, which already drives the schema generator — so any
 * detection here that walks the resulting schema attributes stays in
 * lockstep with the runtime declaration automatically.
 *
 * `*Color` keys never appear in the override schema (colors are
 * `<styleDefinition>`-only by design) so the schema-walk alone would miss
 * the color category for a component whose only style attribute is e.g.
 * `markerStyle`.  We treat every prefix detected via the override schema as
 * "include the full prefix family in the breakdown" — that's what the issue
 * asks for ("style attributes that are relevant for the component"),
 * surfacing colors alongside the override-only attributes.
 */
export function detectStylePrefixesFromAttributes(
    attributeNames: Iterable<string>,
): Set<StyleKeyPrefix> {
    const detected = new Set<StyleKeyPrefix>();
    for (const name of attributeNames) {
        const canonical = canonicalStyleAttributeKey(name);
        if (canonical === undefined) continue;
        const prefix = stylePrefixOfKey(canonical);
        if (prefix !== undefined) detected.add(prefix);
    }
    return detected;
}

/**
 * Expand a set of style prefixes to the full list of canonical
 * `styleAttributes` keys with those prefixes — every color, opacity, style,
 * size, etc. variant for each prefix.  Order matches the declaration order
 * in `styleAttributes`, which the help panel relies on for stable rendering.
 */
export function relevantStyleKeysForPrefixes(
    prefixes: ReadonlySet<StyleKeyPrefix>,
): StyleDefinitionKey[] {
    if (prefixes.size === 0) return [];
    const out: StyleDefinitionKey[] = [];
    for (const key of Object.keys(styleAttributes) as StyleDefinitionKey[]) {
        const prefix = stylePrefixOfKey(key);
        if (prefix !== undefined && prefixes.has(prefix)) out.push(key);
    }
    return out;
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
 * The legacy `<styleDefinitions>` (plural) wrapper is a `<setup>`-sugar
 * construct — the worker's `Setup` sugar flattens it before resolving — so
 * we only walk into it when it sits inside `<setup>`. A top-level
 * `<styleDefinitions>` would be ignored by the runtime too, so we don't
 * surface those blocks here.
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
 * Lazy per-palette cache of primitive views of the runtime's built-in style
 * presets (lazy so the expansion cost is paid only for palettes the help
 * panel actually resolves against). `returnPaletteStyleDefinitions` returns
 * the position-wrapped runtime shape; we unwrap to primitives because the
 * LSP doesn't need source positions for the active-default hint.
 */
const _palettePresetsCache = new Map<
    string,
    ReadonlyMap<number, Readonly<PrimitiveStyleDefinition>>
>();
function palettePresets(
    paletteName: string,
): ReadonlyMap<number, Readonly<PrimitiveStyleDefinition>> {
    const cached = _palettePresetsCache.get(paletteName);
    if (cached) return cached;
    const wrapped = returnPaletteStyleDefinitions(paletteName);
    const out = new Map<number, Readonly<PrimitiveStyleDefinition>>();
    for (const [k, def] of Object.entries(wrapped)) {
        // Freeze the cached value so a caller that forgets to clone (via
        // `seedStyleDefinition`'s spread) gets a crash on write rather than
        // silently mutating the shared preset for every subsequent lookup.
        out.set(Number(k), Object.freeze(unwrapStyleDefinition(def)));
    }
    _palettePresetsCache.set(paletteName, out);
    return out;
}

/**
 * Return a fresh primitive-only style map for `styleNumber`, seeded from the
 * active palette's preset for that number or (for unknown numbers) from
 * `DEFAULT_STYLE_VALUES`. Cloned so the caller can mutate freely.
 */
function seedStyleDefinition(
    styleNumber: number,
    paletteName: string,
): PrimitiveStyleDefinition {
    const preset = palettePresets(paletteName).get(styleNumber);
    if (preset) return { ...preset };
    return { ...DEFAULT_STYLE_VALUES };
}

/**
 * Find the `<stylePalette>` owned by `ancestor` (direct child or child of a
 * `<setup>` child — the same two routes `<styleDefinition>` uses) and return
 * its validated palette name. Mirrors the runtime: with several palettes the
 * last one wins, and an unknown (or absent) `palette` attribute falls back to
 * the default palette, matching the runtime's `validValues` coercion.
 * Returns undefined when the ancestor owns no `<stylePalette>` at all.
 */
function findOwnedStylePaletteName(
    ancestor: DastElement | DastRoot,
): string | undefined {
    let found: DastElement | undefined;
    for (const child of ancestor.children) {
        if (child.type !== "element") continue;
        if (child.name === "stylePalette") {
            found = child;
            continue;
        }
        if (child.name === "setup") {
            for (const grand of child.children) {
                if (grand.type === "element" && grand.name === "stylePalette") {
                    found = grand;
                }
            }
        }
    }
    if (!found) return undefined;
    // Case-insensitive to match the runtime's `toLowerCase: true` on the
    // `palette` attribute: palette names are canonical camelCase, but the
    // registry keys by their lower-cased form, so we lower-case here to land on
    // the key. The value returned is that lower-cased registry key — what
    // `returnPaletteStyleDefinitions` / `cycleStyleNumberForPalette` expect.
    const raw = readAttributeText(found, "palette")?.toLowerCase();
    if (raw !== undefined && raw in STYLE_PALETTES) return raw;
    return DEFAULT_PALETTE_NAME;
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
 *   2. Determine the active palette: the deepest ancestor owning a
 *      `<stylePalette>` wins, resets the walk at that ancestor (blocks above
 *      it are discarded), and cycles out-of-range style numbers onto the
 *      palette — see the inline comments in the body.
 *   3. Seed a primitive style map from the active palette's preset for that
 *      number (or the global default if the number is unknown).
 *   4. Walk the (possibly reset) ancestor chain; for each, build a normalized
 *      `<styleDefinition>` block (per-block dark-mode + word derivation,
 *      mirroring the worker's `returnStyleDefinitionStateVariables`) for
 *      every block whose `styleNumber` matches, skipping
 *      `options.excludeAttribute.attributeName` on the matching node so the
 *      hint reflects "what if I removed just this attribute". Merge in
 *      source order so later wins.
 *   5. Pass through `resolveStyleDefinition` so every key in the
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

    const chain = ancestorChainRootToLeaf(sourceObj, element);

    // The deepest ancestor owning a <stylePalette> resets the walk: the
    // palette replaces the base presets for its subtree, and
    // <styleDefinition> blocks above it are discarded (mirroring the
    // runtime's palette-reset semantics). Blocks owned by the palette's own
    // section still apply on top of the palette.
    let paletteName: string | undefined;
    let mergeStartIndex = 0;
    for (let i = 0; i < chain.length; i++) {
        const ancestor = chain[i];
        // A <setup> is not a styles-hosting scope of its own — the runtime
        // attributes its <stylePalette> children to the setup's *parent*
        // (the setup route of `findOwnedStylePaletteName` covers that when
        // the parent is scanned). Skip it here so a cursor *inside* the
        // setup doesn't reset the walk one level too deep and drop sibling
        // blocks owned by the parent scope.
        if (ancestor.type === "element" && ancestor.name === "setup") {
            continue;
        }
        const owned = findOwnedStylePaletteName(ancestor);
        if (owned !== undefined) {
            paletteName = owned;
            mergeStartIndex = i;
        }
    }
    const activePalette = paletteName !== undefined;
    const basePaletteName = paletteName ?? DEFAULT_PALETTE_NAME;
    const mergeChain = activePalette ? chain.slice(mergeStartIndex) : chain;

    // With a palette active, style numbers beyond the palette size cycle
    // onto the palette (mirroring the runtime). When an authored block also
    // defines the out-of-range number, the runtime seeds it from the cycled
    // entry as of the block's own scope; we approximate by merging
    // cycled-number blocks first, then the out-of-range number's blocks —
    // a cycled-number block *below* the first out-of-range block can
    // diverge, an accepted best-effort edge for editor hints.
    let seedNumber = styleNumber;
    let matchNumbers: number[] = [styleNumber];
    if (activePalette) {
        const cycled = cycleStyleNumberForPalette(styleNumber, basePaletteName);
        if (cycled !== styleNumber) {
            seedNumber = cycled;
            const hasBlockForNumber = mergeChain.some((ancestor) =>
                findOwnedStyleDefinitions(ancestor).some(
                    (styleDef) =>
                        (parseStyleNumberAttribute(styleDef) ?? 1) ===
                        styleNumber,
                ),
            );
            matchNumbers = hasBlockForNumber ? [cycled, styleNumber] : [cycled];
        }
    }

    const merged = seedStyleDefinition(seedNumber, basePaletteName);

    for (const matchNumber of matchNumbers) {
        for (const ancestor of mergeChain) {
            for (const styleDef of findOwnedStyleDefinitions(ancestor)) {
                const sdNumber = parseStyleNumberAttribute(styleDef) ?? 1;
                if (sdNumber !== matchNumber) continue;
                const excludeAttrName =
                    options.excludeAttribute &&
                    styleDef === options.excludeAttribute.node
                        ? options.excludeAttribute.attributeName
                        : undefined;
                const block = buildStyleDefinitionBlock(
                    styleDef,
                    excludeAttrName,
                );
                mergeBlockInto(merged, block);
            }
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
 * eyeball "#1f5dff" to remember it's the default blue preset.
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
    return materializeAttributeValue(key, resolved);
}

/**
 * Wrap a single key's resolved value with its derived `colorWord` companion
 * (for hex color attributes whose word differs from the raw value). Returns
 * undefined when the key has no value in `resolved` so callers can skip the
 * entry entirely. Used by both the single-key surface
 * (`resolveActiveStyleAttributeValue`) and the breakdown surface
 * (`resolveActiveStyleBreakdown`) so the two can't drift on colorWord rules.
 */
function materializeAttributeValue(
    key: StyleDefinitionKey,
    resolved: ActiveStyleResolution,
): ActiveStyleAttributeValue | undefined {
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

/**
 * One row in the active-style breakdown surface (issue #1204).  Same payload
 * shape `resolveActiveStyleAttributeValue` produces, with `key` added so the
 * caller can render the attribute name alongside its resolved value without
 * re-walking the map.
 */
export interface ActiveStyleBreakdownEntry {
    key: StyleDefinitionKey;
    value: StyleDefinitionPrimitive;
    /** Hex color attributes only; see `ActiveStyleAttributeValue.colorWord`. */
    colorWord?: string;
}

/**
 * Breakdown of every relevant style attribute at `element`'s scope, in the
 * order keys appear in the runtime's `styleAttributes` map (so the help panel
 * renders them in a stable, semantically-grouped order: line* together,
 * marker* together, …).  `styleNumber` is the integer they resolve under,
 * carried so the caller can label the row "styleNumber N" without re-asking
 * `resolveActiveStyleNumber`.
 *
 * `entries` is filtered to {@link ActiveStyleBreakdownOptions.includeKeys}
 * when supplied — for per-component dispatch the caller passes only the
 * keys the component actually uses (e.g. marker* for `<point>`), so the
 * breakdown doesn't drown the help panel in irrelevant rows.  When the
 * filter is absent every populated key is included (used inside
 * `<styleDefinition>`, where the full styleNumber listing is the point).
 */
export interface ActiveStyleBreakdown {
    styleNumber: number;
    entries: ActiveStyleBreakdownEntry[];
}

/**
 * Options for {@link resolveActiveStyleBreakdown}.
 *
 * `includeKeys` filters the breakdown to the canonical style keys named here
 * (case-sensitive — pass the camel-case `StyleDefinitionKey` form).  Unknown
 * names are silently dropped so a caller that hand-builds the list from a
 * partial schema view can't crash the resolver.
 */
export interface ActiveStyleBreakdownOptions {
    includeKeys?: Iterable<StyleDefinitionKey>;
}

/**
 * Resolve every relevant style attribute at `element`'s scope and return the
 * breakdown the help panel renders for "styleNumber" / inside-`<styleDefinition>`
 * cursors (issue #1204).  Iteration order follows `styleAttributes` so callers
 * never have to re-sort.
 *
 * Entries with `undefined` resolved values are skipped — the runtime's
 * `resolveStyleDefinition` populates every slot for a known styleNumber, but
 * for the unknown-styleNumber fallback path some slots can come back
 * undefined and we'd rather omit the row than render "undefined" in the UI.
 */
export function resolveActiveStyleBreakdown(
    sourceObj: DoenetSourceObject,
    element: DastElement,
    options: ActiveStyleBreakdownOptions = {},
): ActiveStyleBreakdown {
    const resolved = resolveActiveStyle(sourceObj, element);
    const includeFilter = options.includeKeys
        ? new Set(options.includeKeys)
        : undefined;
    const entries: ActiveStyleBreakdownEntry[] = [];
    for (const key of Object.keys(styleAttributes) as StyleDefinitionKey[]) {
        if (includeFilter && !includeFilter.has(key)) continue;
        const entry = materializeAttributeValue(key, resolved);
        if (!entry) continue;
        const breakdownEntry: ActiveStyleBreakdownEntry = {
            key,
            value: entry.value,
        };
        if (entry.colorWord !== undefined) {
            breakdownEntry.colorWord = entry.colorWord;
        }
        entries.push(breakdownEntry);
    }
    return { styleNumber: resolved.styleNumber, entries };
}
