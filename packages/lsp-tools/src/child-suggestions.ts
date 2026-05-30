import type { AutoCompleter } from "./auto-completer";

/**
 * Shared per-container ranking shared by the autocomplete dropdown
 * (`get-completion-items.ts`) and the context-help suggestions panel
 * (`computeContextHelp.ts`).
 *
 * Two inputs drive the ordering:
 *  - **Hand-picked overrides** — per-container curated lists keyed by parent
 *    element name; entries can name an element or a snippet. Surfaced first,
 *    in the order they appear in the list, and bypass the adapter filter.
 *  - **Auto-rank (`childBuckets`)** — for everything else, sort by how
 *    directly the child is allowed in this container (0 direct, 1 inherited,
 *    2 adapter; see `ElementSchema.childBuckets`). Adapter-only children are
 *    dropped unless handpicked.
 *
 * Snippets always cluster with the element they're linked to (`snippet.element`
 * in the schema) — a snippet sits next to its element wherever that element
 * lands in the order. Handpicking a snippet only changes the snippet's
 * position within its cluster, not the cluster's position overall.
 *
 * Both surfaces consume the sorted list: the panel takes the first N entries
 * unfiltered, the autocomplete dropdown sets each item's `sortText` so the
 * editor's lexicographic sort reproduces this order while user-typed prefixes
 * filter the visible items.
 */

/**
 * Entry in a `CONTAINER_SUGGESTION_OVERRIDES_RAW` list. A bare string names an
 * element (matched case-insensitively against canonical element names); the
 * object form names a snippet by its key (e.g. `"multiple-choice-answer"`).
 */
export type OverrideEntry = string | { snippet: string };

/**
 * Per-container hand-picked suggestions. Keyed by parent element name
 * (lower-cased at lookup); values are entries that bubble to the top of the
 * suggestions for that container, in the listed order. Use sparingly — the
 * auto-rank covers the common case; reach for an override when a niche but
 * relevant child won't surface on its own (e.g. `<moduleAttributes>` inside
 * `<module>`) or when you want a specific snippet to lead its cluster.
 */
const CONTAINER_SUGGESTION_OVERRIDES_RAW: Record<
    string,
    readonly OverrideEntry[]
> = {
    module: ["moduleAttributes", "section", "graph", "p", "function"],
    moduleAttributes: [
        "number",
        "math",
        "text",
        "boolean",
        "point",
        "function",
    ],
    setup: [
        // <select*> and <repeat*> are the natural construction primitives for
        // initializing state inside `<setup>`.
        "select",
        "selectFromSequence",
        "selectPrimeNumbers",
        "selectRandomNumbers",
        "repeat",
        "repeatForSequence",
        // …then the basic value-producing components.
        "number",
        "math",
        "text",
        "boolean",
        "point",
        "function",
    ],
    document: ["title", "setup"],
    _sectioningComponent: ["title", "setup"],
    answer: [
        "label",
        "award",
        "choice",
        "shortDescription",
        "description",
        "considerAsResponses",
    ],
    award: ["when", "math", "number", "text", "boolean", "point"],
    boolean: ["math", "number", "text", "boolean", "point", "function"],
    when: ["math", "number", "text", "boolean", "point", "function"],
    _input: ["label", "shortDescription", "description"],
    choiceInput: ["choice", "label", "shortDescription", "description"],
    graph: [
        "shortDescription",
        "point",
        "function",
        "xLabel",
        "yLabel",
        "_graphical",
        "description",
    ],
    conditionalContent: ["case", "else"],
    math: [
        "math",
        "number",
        "m",
        "round",
        "mean",
        "mod",
        "ceil",
        "floor",
        "abs",
        "median",
        "standardDeviation",
        "variance",
    ],
    sort: [
        "math",
        "number",
        "text",
        "point",
        "vector",
        "mathList",
        "numberList",
        "textList",
        "pointList",
        "vectorList",
    ],
    shuffle: [
        "math",
        "number",
        "text",
        "point",
        "vector",
        "mathList",
        "numberList",
        "textList",
        "pointList",
        "vectorList",
    ],
    sideBySide: ["stack"],
};

/**
 * Global authoring-frequency favorites — a single ordered list of components
 * that should be lifted past the alphabetical-within-bucket ordering wherever
 * they're allowed. Position is the weight (entry 0 lifts the most).
 *
 * Sits between the per-container handpicks and the auto-rank: handpicked
 * overrides still win, the adapter filter still applies (a favorite that's
 * bucket 2 in a given container is still dropped unless handpicked), but
 * favorites beat the inheritance signal — so e.g. `<p>` (bucket 1 inside
 * `<section>`) outranks niche bucket-0 children like `<feedbackDefinition>`.
 *
 * Snippets inherit favorite status from the element they cluster with: an
 * `<answer>` snippet rides at whatever favorite position `<answer>` has.
 *
 * One global list rather than per-container picks keeps maintenance bounded:
 * adding a newly-common component lifts it everywhere it's allowed.
 */
const FAVORITE_COMPONENTS: readonly string[] = [
    // Ordered as a round-robin across categories so the top of the list
    // (what the help panel shows) spans many categories rather than clumping
    // similar components together.
    //
    // The first round (positions 0–5) is one pick per category, so the
    // 6-chip panel hits text, math, graphics, assessment, pedagogical, and
    // media in one screen:
    "p", // text
    "math", // math
    "graph", // graphics
    "answer", // interactive / assessment
    "example", // pedagogical
    "image", // media / lists
    // Second round adds the scaffolding category and the next pick per
    // earlier category, keeping diversity high as the list grows:
    "section", // text 2
    "m", // math 2
    "point", // graphics 2
    "mathInput", // interactive 2
    "hint", // pedagogical 2
    "ol", // media 2
    "sequence", // scaffolding 1
    // Subsequent rounds continue the same cycle to the tail:
    "me", // math 3
    "line", // graphics 3
    "choice", // interactive 3
    "problem", // pedagogical 3
    "video", // media 3
    "repeat", // scaffolding 2
    "number", // math 4
    "vector", // graphics 4
    "choiceInput", // interactive 4
    "ul", // media 4
    "repeatForSequence", // scaffolding 3
    "function", // math 5
    "circle", // graphics 5
    "feedback", // interactive 5
    "label", // graphics 6
];

const FAVORITE_INDEX = new Map<string, number>(
    FAVORITE_COMPONENTS.map((name, i) => [name.toLowerCase(), i]),
);

const CONTAINER_SUGGESTION_OVERRIDES = new Map<
    string,
    readonly OverrideEntry[]
>(
    Object.entries(CONTAINER_SUGGESTION_OVERRIDES_RAW).map(([k, v]) => [
        k.toLowerCase(),
        v,
    ]),
);

/**
 * `childBuckets` bucket at which a child is allowed here only because it
 * adapts to an allowed type (e.g. `<point>` inside `<number>`). Such children
 * are dropped from the ranker output unless they (or one of their snippets)
 * are handpicked. The autocomplete's full menu still surfaces them — this
 * filter applies to the ranker's surface, not the underlying allowed-children
 * set.
 */
export const ADAPTER_CHILD_RANK = 2;

/** Sentinel "not handpicked" index — sorts after every real handpicked entry. */
const NO_HANDPICK = 999;

export type RankedSuggestion =
    | {
          kind: "element";
          name: string;
          bucket: number;
          sortText: string;
      }
    | {
          kind: "snippet";
          snippetKey: string;
          element: string;
          description: string;
          /**
           * Inherited from the snippet's element — snippets carry no
           * independent bucket. Used so a snippet of an adapter-only element
           * is dropped alongside the element unless handpicked.
           */
          bucket: number;
          sortText: string;
      };

/**
 * Resolve the override list for a parent element, honoring inheritance:
 * - If the parent itself has an entry in `CONTAINER_SUGGESTION_OVERRIDES`,
 *   that wins (no merging with any inherited override).
 * - Otherwise, walk the parent's abstract (`_`-prefixed) ancestors nearest
 *   first and return the first one with an override entry. This is how an
 *   override keyed by, say, `_sectioningComponent` flows down to `section`,
 *   `problem`, `example`, etc. without having to repeat the list per
 *   concrete component.
 * - Returns `[]` when nothing matches.
 *
 * The nearest-wins policy avoids merging multiple ancestor overrides; if a
 * future curation wants to split a list across abstract levels, override the
 * more specific ancestor (or the concrete element) explicitly.
 */
function lookupOverrides(
    completer: AutoCompleter,
    parentElementName: string,
): readonly OverrideEntry[] {
    const direct = CONTAINER_SUGGESTION_OVERRIDES.get(
        parentElementName.toLowerCase(),
    );
    if (direct) return direct;
    const ancestors =
        completer.findSchemaElement(parentElementName)?.abstractAncestors ?? [];
    for (const ancestor of ancestors) {
        const inherited = CONTAINER_SUGGESTION_OVERRIDES.get(
            ancestor.toLowerCase(),
        );
        if (inherited) return inherited;
    }
    return [];
}

/**
 * Build per-container handpick indices. Returns three lookups keyed
 * lower-case:
 *   - `elementIndex` — concrete element entry → its position in the list.
 *   - `abstractIndex` — abstract (`_`-prefixed) entry → its position. At
 *     ranker time, every allowed element whose `abstractAncestors` contains
 *     this name picks up the same index (one slot, many siblings sorted
 *     alphabetically among themselves).
 *   - `snippetIndex` — snippet entry → its position.
 *
 * A name's effective handpicked index is the SMALLEST across the explicit
 * entry (if any) and every matching abstract entry — so listing `point`
 * explicitly before `_graphical` keeps `point` at the explicit slot while
 * the rest of `_graphical`'s inheritors land in the abstract's later slot.
 */
function indexOverrides(entries: readonly OverrideEntry[]): {
    elementIndex: Map<string, number>;
    abstractIndex: Map<string, number>;
    snippetIndex: Map<string, number>;
} {
    const elementIndex = new Map<string, number>();
    const abstractIndex = new Map<string, number>();
    const snippetIndex = new Map<string, number>();
    entries.forEach((entry, i) => {
        if (typeof entry === "string") {
            const lc = entry.toLowerCase();
            if (entry.startsWith("_")) {
                abstractIndex.set(lc, i);
            } else {
                elementIndex.set(lc, i);
            }
        } else {
            snippetIndex.set(entry.snippet.toLowerCase(), i);
        }
    });
    return { elementIndex, abstractIndex, snippetIndex };
}

/**
 * Effective handpicked index for `elementName` given the per-container
 * override indices: the smaller of (its explicit entry, if any) and (any
 * abstract entry whose name appears in `elementName`'s `abstractAncestors`).
 * `NO_HANDPICK` when nothing matches.
 */
function elementHandpickIndex(
    elementName: string,
    elementIndex: Map<string, number>,
    abstractIndex: Map<string, number>,
    completer: AutoCompleter,
): number {
    let best = elementIndex.get(elementName.toLowerCase()) ?? NO_HANDPICK;
    if (abstractIndex.size > 0) {
        const ancestors =
            completer.findSchemaElement(elementName)?.abstractAncestors ?? [];
        for (const ancestor of ancestors) {
            const ai = abstractIndex.get(ancestor.toLowerCase());
            if (ai !== undefined && ai < best) best = ai;
        }
    }
    return best;
}

/**
 * Encode the ordering tuple as a fixed-width string so callers can sort with a
 * single lexicographic comparison (the same encoding feeds the LSP
 * `CompletionItem.sortText`). Smaller is earlier.
 *
 * Layout (fields separated by `-`):
 *   1. `handpickedFlag`     `0` if any handpicked index applies, else `1`
 *   2. `handpickedIndex`    3 digits (000–998), `999` when not handpicked
 *   3. `favoriteFlag`       `0` if the cluster element is in `FAVORITE_COMPONENTS`,
 *                           else `1`. Favorites beat the inheritance signal but
 *                           not the adapter filter (adapter entries are
 *                           dropped earlier, before encoding).
 *   4. `favoriteIndex`      3 digits, position in `FAVORITE_COMPONENTS` (000–998)
 *                           or `999` if not in the list.
 *   5. `bucket`             1 digit child-relation bucket (0 direct, 1 inherited)
 *   6. `clusterElementName` lower-cased element name (the cluster key —
 *                           snippets share their element's value here)
 *   7. `kindPriority`       `0` element, `1` snippet (element first in cluster)
 *   8. `intraIndex`         3 digits, snippet's own handpicked index else 999
 *                           (only affects ordering inside a cluster)
 *   9. `label`              lower-cased element name / snippet key — final
 *                           alphabetical tiebreak for snippets of the same
 *                           element that share an `intraIndex`
 */
function buildSortText(parts: {
    handpickedIndex: number;
    favoriteIndex: number;
    bucket: number;
    clusterElementName: string;
    kindPriority: 0 | 1;
    intraIndex: number;
    label: string;
}): string {
    const handpickedFlag = parts.handpickedIndex < NO_HANDPICK ? "0" : "1";
    const idx3 = String(parts.handpickedIndex).padStart(3, "0");
    const favoriteFlag = parts.favoriteIndex < NO_HANDPICK ? "0" : "1";
    const fav3 = String(parts.favoriteIndex).padStart(3, "0");
    const intra3 = String(parts.intraIndex).padStart(3, "0");
    return [
        handpickedFlag,
        idx3,
        favoriteFlag,
        fav3,
        String(parts.bucket),
        parts.clusterElementName.toLowerCase(),
        String(parts.kindPriority),
        intra3,
        parts.label.toLowerCase(),
    ].join("-");
}

/**
 * Compute the ranked list of element + snippet suggestions for a cursor whose
 * container is `parentElementName` (e.g. `"module"` for the body of `<module>`,
 * or `"document"` for the top level). `grandparentElementName` mirrors the
 * argument `_getAllowedChildren`/`_getChildRanks` take for alias resolution
 * (e.g. `<row>` inside `<matrix>` → `matrixRow` children).
 *
 * The returned list is sorted by the encoded `sortText` — callers either take
 * the top N (panel) or build a lookup from this list to feed CodeMirror's
 * `sortText` (autocomplete dropdown). Adapter-bucket entries that are not
 * handpicked are filtered out.
 */
export function rankedChildSuggestions(
    completer: AutoCompleter,
    parentElementName: string,
    grandparentElementName?: string,
): RankedSuggestion[] {
    const allowedNames = completer._getAllowedChildren(
        parentElementName,
        grandparentElementName,
    );
    const childRanks = completer._getChildRanks(
        parentElementName,
        grandparentElementName,
    );
    const overrides = lookupOverrides(completer, parentElementName);
    const { elementIndex, abstractIndex, snippetIndex } =
        indexOverrides(overrides);

    // Canonical-name map and lower-case set, since `_getChildRanks` keys use
    // canonical casing but allowed-children compares case-insensitively.
    const rankByLower = new Map<string, number>();
    for (const [name, rank] of Object.entries(childRanks)) {
        rankByLower.set(name.toLowerCase(), rank);
    }
    const bucketOf = (name: string) => rankByLower.get(name.toLowerCase()) ?? 0;

    // Snippets keyed by allowed-element set; the completer already filters
    // here against actual allowed children, so a snippet whose element isn't
    // allowed in this container is naturally excluded.
    const allowedSet = new Set(allowedNames);
    const snippets = completer._getSnippetsForElements(allowedSet);

    const items: RankedSuggestion[] = [];

    // Snippets inherit favorite status from the element they cluster with —
    // a snippet for `<answer>` rides at `<answer>`'s favorite position.
    const favoriteOf = (elementName: string) =>
        FAVORITE_INDEX.get(elementName.toLowerCase()) ?? NO_HANDPICK;

    for (const name of allowedNames) {
        const bucket = bucketOf(name);
        const ownIndex = elementHandpickIndex(
            name,
            elementIndex,
            abstractIndex,
            completer,
        );
        const isHandpicked = ownIndex < NO_HANDPICK;
        // Adapter-only children are dropped from suggestions; an explicit
        // handpick is the override. Favorites do NOT override the adapter
        // filter (per the design — a `<p>` adapter situation, if it ever
        // existed, still wouldn't be a literal suggestion).
        if (bucket >= ADAPTER_CHILD_RANK && !isHandpicked) continue;
        const sortText = buildSortText({
            handpickedIndex: ownIndex,
            favoriteIndex: favoriteOf(name),
            bucket,
            clusterElementName: name,
            kindPriority: 0,
            intraIndex: NO_HANDPICK,
            label: name,
        });
        items.push({ kind: "element", name, bucket, sortText });
    }

    for (const snippet of snippets) {
        const element = snippet.element;
        const bucket = bucketOf(element);
        const ownIndex =
            snippetIndex.get(snippet.key.toLowerCase()) ?? NO_HANDPICK;
        // The snippet's cluster rides with its element; the element's
        // handpicked slot includes any abstract-ancestor expansion.
        const elementOwnIndex = elementHandpickIndex(
            element,
            elementIndex,
            abstractIndex,
            completer,
        );
        // Cluster ordering follows the element; a snippet's own handpick
        // only affects intra-cluster placement. If neither the snippet nor
        // its element is handpicked and the element is adapter-bucket, drop
        // the snippet too — the whole cluster is filtered.
        const clusterIndex = elementOwnIndex;
        const isHandpicked = ownIndex < NO_HANDPICK;
        if (
            bucket >= ADAPTER_CHILD_RANK &&
            clusterIndex >= NO_HANDPICK &&
            !isHandpicked
        ) {
            continue;
        }
        const sortText = buildSortText({
            handpickedIndex: clusterIndex,
            favoriteIndex: favoriteOf(element),
            bucket,
            clusterElementName: element,
            kindPriority: 1,
            intraIndex: ownIndex,
            label: snippet.key,
        });
        items.push({
            kind: "snippet",
            snippetKey: snippet.key,
            element,
            description: snippet.description,
            bucket,
            sortText,
        });
    }

    items.sort((a, b) =>
        a.sortText < b.sortText ? -1 : a.sortText > b.sortText ? 1 : 0,
    );
    return items;
}

/**
 * Convenience: build a lower-cased lookup map from a ranked list — used by
 * the autocomplete pathway to assign `sortText` to each emitted
 * `CompletionItem` (filtered or not) without re-running the ranker per item.
 *
 * Keys are namespaced (`"elem:<name>"` / `"snippet:<key>"`) so element and
 * snippet labels with the same string don't collide.
 */
export function sortTextLookup(
    ranked: readonly RankedSuggestion[],
): Map<string, string> {
    const m = new Map<string, string>();
    for (const item of ranked) {
        const key =
            item.kind === "element"
                ? `elem:${item.name.toLowerCase()}`
                : `snippet:${item.snippetKey.toLowerCase()}`;
        m.set(key, item.sortText);
    }
    return m;
}
