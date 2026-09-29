/**
 * A `<page>` marks what a printout puts on one sheet of paper. PreTeXt spells that the same
 * way, but only for a `<page>` that is a child of a printout (`worksheet/page` and
 * `handout/page` in `pretext-html.xsl`), so a document with pages becomes a `<worksheet>`
 * with its pages directly inside it.
 *
 * An author writes a page where it reads naturally — around each problem of a `<problems>`,
 * say — so the containers between the document and its pages are dissolved to bring the
 * pages up to the worksheet: a `<problems>` or `<exercises>` list, and the `<div>`s and
 * `<cascade>`s that show nothing of their own. A page that cannot be brought up, because it
 * sits inside a section or a block, is left to export as its children.
 *
 * A worksheet rather than a handout, because a problem that was an item of a list keeps the
 * look of one: it is written out as an `<exercise>`, which PreTeXt heads with its number
 * alone ("1.") only inside a worksheet (`worksheet//exercise` in `pretext-html.xsl`; inside
 * a handout the same exercise is headed like an inline exercise). The numbers run on from
 * page to page, since a page is not a division and so restarts no count.
 */
import type { FlatDastElement, FlatDastRoot } from "@doenet/doenetml-worker";
import {
    buildParentMap,
    documentElement,
    elementOf,
    makeDocumentPrintout,
    propsOf,
} from "./writing-space";

/** The lists whose items are problems. */
const LISTS = new Set(["problems", "exercises"]);

/** Containers that are dissolved to bring the pages inside them up to the worksheet. */
const DISSOLVABLE = new Set([...LISTS, "div", "cascade", "_fragment"]);

/** The list items that print as a worksheet `<exercise>`. */
const LIST_ITEM_PROBLEMS = new Set(["problem", "exercise"]);

/**
 * Turn a document written with `<page>`s into a PreTeXt `<worksheet>` whose children are
 * those pages. `flatDast` is mutated in place. A document with no page is left as it was.
 */
export function arrangePrintoutPages(flatDast: FlatDastRoot) {
    const pages = flatDast.elements.filter(
        (element): element is FlatDastElement => element?.name === "page",
    );
    if (pages.length === 0) {
        return;
    }

    const container = documentElement(flatDast) ?? flatDast;

    // Dissolve, from the top down, every container that stands between the document and a
    // page, until none is left.
    let dissolved = true;
    while (dissolved) {
        dissolved = false;
        const children: typeof container.children = [];
        for (const child of container.children) {
            const element = elementOf(child, flatDast);
            if (
                element &&
                DISSOLVABLE.has(element.name) &&
                containsPage(element, flatDast)
            ) {
                // A list's title heads the list, which is gone; its items stand on their
                // own pages.
                children.push(
                    ...element.children.filter(
                        (c) => elementOf(c, flatDast)?.name !== "title",
                    ),
                );
                // The container stays in `flatDast.elements`, so it must no longer claim
                // the children it gave up, or it would still be found as their parent.
                element.children = [];
                dissolved = true;
            } else {
                children.push(child);
            }
        }
        container.children = children;
    }

    // A page left inside something else cannot be a page in PreTeXt; it exports as what it
    // holds.
    const topLevel = new Set(
        container.children.map((child) => elementOf(child, flatDast)),
    );
    for (const page of pages) {
        if (!topLevel.has(page)) {
            page.name = "div";
        }
    }
    // With no page left to print, there is no worksheet to make.
    if (!pages.some((page) => page.name === "page")) {
        return;
    }

    // A problem that was an item of a list that is now dissolved prints headed by its
    // number alone, as the item it was. One still inside its list is left to the list.
    const parents = buildParentMap(flatDast);
    for (const element of flatDast.elements) {
        if (
            element &&
            LIST_ITEM_PROBLEMS.has(element.name) &&
            propsOf(element).isListItem === true &&
            !hasListAncestor(element, parents)
        ) {
            element.name = "exercise";
        }
    }

    makeDocumentPrintout(container, flatDast, "worksheet");
}

/** Whether `element` has a page somewhere inside it. */
function containsPage(
    element: FlatDastElement,
    flatDast: FlatDastRoot,
): boolean {
    return element.children.some((child) => {
        const inner = elementOf(child, flatDast);
        return (
            inner !== undefined &&
            (inner.name === "page" || containsPage(inner, flatDast))
        );
    });
}

function hasListAncestor(
    element: FlatDastElement,
    parents: Map<number, FlatDastElement>,
) {
    for (
        let current = parents.get(element.data.id);
        current;
        current = parents.get(current.data.id)
    ) {
        if (LISTS.has(current.name)) {
            return true;
        }
    }
    return false;
}
