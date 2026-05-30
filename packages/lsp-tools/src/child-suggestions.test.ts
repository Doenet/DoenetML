import { describe, expect, it } from "vitest";
import { AutoCompleter } from "./auto-completer";
import { rankedChildSuggestions, sortTextLookup } from "./child-suggestions";

describe("rankedChildSuggestions", () => {
    it("ranks all suggestions with monotonically non-decreasing sortText", () => {
        const completer = new AutoCompleter("");
        const ranked = rankedChildSuggestions(completer, "module");
        for (let i = 1; i < ranked.length; i++) {
            expect(ranked[i - 1].sortText <= ranked[i].sortText).toBe(true);
        }
    });

    it("places handpicked overrides ahead of every non-handpicked entry", () => {
        const completer = new AutoCompleter("");
        const ranked = rankedChildSuggestions(completer, "module");
        // <module>'s overrides (see CONTAINER_SUGGESTION_OVERRIDES_RAW):
        // [moduleAttributes, section, graph, p, function]. Each handpicked
        // entry's sortText starts with "0" (handpicked flag); everything else
        // starts with "1".
        const handpicked = ranked.filter((r) => r.sortText.startsWith("0-"));
        const nonHandpicked = ranked.filter((r) => r.sortText.startsWith("1-"));
        expect(
            handpicked.map((r) =>
                r.kind === "element" ? r.name : r.snippetKey,
            ),
        ).toEqual(["moduleAttributes", "section", "graph", "p", "function"]);
        // All non-handpicked sortText values are lexicographically greater
        // than every handpicked value.
        const maxHand = handpicked.at(-1)?.sortText ?? "";
        const minNon = nonHandpicked[0]?.sortText ?? "";
        expect(maxHand < minNon).toBe(true);
    });

    it("clusters snippets next to the element they're linked to", () => {
        const completer = new AutoCompleter("");
        // <module> allows <answer>, which carries 8 snippets. Their cluster
        // sits at <answer>'s alphabetical position in the non-handpicked
        // region, with the element first and the snippets immediately after.
        const ranked = rankedChildSuggestions(completer, "module");
        const answerIdx = ranked.findIndex(
            (r) => r.kind === "element" && r.name === "answer",
        );
        expect(answerIdx).toBeGreaterThanOrEqual(0);
        // The snippets for <answer> follow immediately after the element.
        const answerSnippets = ranked.filter(
            (r) => r.kind === "snippet" && r.element === "answer",
        );
        expect(answerSnippets.length).toBeGreaterThan(0);
        for (const snip of answerSnippets) {
            const snipIdx = ranked.indexOf(snip);
            // Some entry between the <answer> element and its snippets must
            // also belong to the same cluster (no foreign element in between).
            for (let i = answerIdx + 1; i < snipIdx; i++) {
                const between = ranked[i];
                const betweenElement =
                    between.kind === "element" ? between.name : between.element;
                expect(betweenElement).toBe("answer");
            }
        }
    });

    it("drops adapter-bucket children unless handpicked", () => {
        const completer = new AutoCompleter("");
        // <number> children include <point>/<function>/<mathInput> as
        // adapters (bucket 2). None are handpicked, so none should appear.
        const ranked = rankedChildSuggestions(completer, "number");
        const names = ranked
            .filter((r) => r.kind === "element")
            .map((r) => (r as { name: string }).name);
        expect(names).not.toContain("point");
        expect(names).not.toContain("function");
        expect(names).not.toContain("mathInput");
        expect(names).toContain("math");
    });

    it("keeps every handpicked entry regardless of its child-relation bucket", () => {
        const completer = new AutoCompleter("");
        // <moduleAttributes>'s overrides may sit at different `childRanks`
        // buckets (e.g. inherited vs adapter). The override system must
        // surface every handpicked entry — the bucket only matters when
        // nothing handpicks the child.
        const ranked = rankedChildSuggestions(completer, "moduleAttributes");
        const handpicked = ranked
            .filter((r) => r.sortText.startsWith("0-"))
            .map((r) => (r.kind === "element" ? r.name : r.snippetKey));
        expect(handpicked).toEqual([
            "number",
            "math",
            "text",
            "boolean",
            "point",
            "function",
        ]);
    });

    it("lifts global favorites above non-favorites within the same container", () => {
        const completer = new AutoCompleter("");
        // <section>'s non-handpicked region: favorites first (lower
        // favoriteFlag), then non-favorites. <p> is a favorite;
        // <variantControl> is a direct bucket-0 child but not a favorite.
        const ranked = rankedChildSuggestions(completer, "section");
        const pIdx = ranked.findIndex(
            (r) => r.kind === "element" && r.name === "p",
        );
        const vcIdx = ranked.findIndex(
            (r) => r.kind === "element" && r.name === "variantControl",
        );
        expect(pIdx).toBeGreaterThanOrEqual(0);
        expect(vcIdx).toBeGreaterThanOrEqual(0);
        expect(pIdx).toBeLessThan(vcIdx);
    });

    it("inherits a container override from an abstract ancestor", () => {
        const completer = new AutoCompleter("");
        // `<section>` has no direct override; it inherits the
        // `_sectioningComponent` override (which surfaces `<title>` and
        // `<setup>`).
        const ranked = rankedChildSuggestions(completer, "section");
        const handpicked = ranked
            .filter((r) => r.sortText.startsWith("0-"))
            .map((r) => (r.kind === "element" ? r.name : r.snippetKey));
        expect(handpicked).toEqual(["title", "setup"]);
    });

    it("uses the concrete element's own override when one is defined", () => {
        const completer = new AutoCompleter("");
        // `<module>` defines its own override; it must NOT pick up any
        // ancestor's. The module list is exactly the explicit one.
        const ranked = rankedChildSuggestions(completer, "module");
        const handpicked = ranked
            .filter((r) => r.sortText.startsWith("0-"))
            .map((r) => (r.kind === "element" ? r.name : r.snippetKey));
        expect(handpicked).toEqual([
            "moduleAttributes",
            "section",
            "graph",
            "p",
            "function",
        ]);
    });

    it("does not lift <title> in containers outside the sectioning chain", () => {
        const completer = new AutoCompleter("");
        // `<math>` allows `<title>` (likely as an inherited child), but it's
        // not a sectioning component and `<title>` is no longer a global
        // favorite, so it must not appear near the top.
        const ranked = rankedChildSuggestions(completer, "math");
        const top10 = ranked
            .slice(0, 10)
            .map((r) => (r.kind === "element" ? r.name : r.snippetKey));
        expect(top10).not.toContain("title");
    });

    it("expands an abstract entry to its concrete inheritors", () => {
        const completer = new AutoCompleter("");
        // <graph>'s override lists `point` explicitly before `_graphical`.
        // The abstract expands to every allowed child whose
        // `abstractAncestors` contains `_graphical`. `point` itself has
        // both a direct entry (smaller index) and an abstract match — the
        // smaller wins, so point keeps its explicit slot ahead of the
        // expanded cluster.
        const ranked = rankedChildSuggestions(completer, "graph");
        const handpicked = ranked
            .filter((r) => r.sortText.startsWith("0-"))
            .map((r) => (r.kind === "element" ? r.name : r.snippetKey));
        // <point> sits at its explicit slot, ahead of every
        // abstract-expanded entry.
        expect(handpicked.indexOf("point")).toBeLessThan(
            handpicked.indexOf("circle"),
        );
        expect(handpicked.indexOf("point")).toBeLessThan(
            handpicked.indexOf("angle"),
        );
        // Non-favorite abstract-expanded entries share an index AND no
        // favorite-tier boost, so the sort-key tail (alphabetical by element
        // name) breaks the tie — `angle` precedes `pegboard`.
        expect(handpicked.indexOf("angle")).toBeLessThan(
            handpicked.indexOf("pegboard"),
        );
    });

    it("does NOT let favorites override the adapter filter", () => {
        const completer = new AutoCompleter("");
        // <p> is a global favorite; if it were an adapter-only child of some
        // container it'd still be dropped. <point> inside <number> is the
        // concrete case — `<point>` IS a favorite, but bucket 2 in <number>,
        // so it must still be filtered out.
        const ranked = rankedChildSuggestions(completer, "number");
        const names = ranked
            .filter((r) => r.kind === "element")
            .map((r) => (r as { name: string }).name);
        expect(names).not.toContain("point");
    });
});

describe("sortTextLookup", () => {
    it("namespaces element vs snippet keys so labels can't collide", () => {
        const completer = new AutoCompleter("");
        const ranked = rankedChildSuggestions(completer, "module");
        const lookup = sortTextLookup(ranked);
        for (const item of ranked) {
            const key =
                item.kind === "element"
                    ? `elem:${item.name.toLowerCase()}`
                    : `snippet:${item.snippetKey.toLowerCase()}`;
            expect(lookup.get(key)).toBe(item.sortText);
        }
    });
});
