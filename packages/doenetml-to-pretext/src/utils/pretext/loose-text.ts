/**
 * Text an author writes straight into a problem, a section or a solution, rather than
 * inside a paragraph, is shown on screen as written. PreTeXt holds text
 * only in a paragraph (or a title, a list item and the like), and drops it where a block
 * is expected, so such a run of text is given a paragraph of its own.
 *
 * Displayed mathematics goes in with the text around it: PreTeXt writes an `<md>` inside a
 * paragraph, so "For the system `<md>…</md>` calculate the equilibria" is one paragraph
 * with the display in the middle of it, as it reads.
 */
import type {
    FlatDastElement,
    FlatDastElementContent,
    FlatDastRoot,
} from "@doenet/doenetml-worker";
import { addElement, elementOf, isBlockContent, refTo } from "./writing-space";

/**
 * Elements that hold blocks, and in which a run of text therefore needs a paragraph. The
 * document itself is not among them: what is written straight into it is left as it was.
 */
const HOLDS_BLOCKS = new Set([
    "division",
    "worksheet",
    "handout",
    "page",
    "li",
    // The statements, which export under their own names.
    "problem",
    "exercise",
    "example",
    "definition",
    "theorem",
    "question",
    "activity",
    "remark",
    "aside",
    "note",
    "proof",
    // The parts of a statement, and the openings and closings of a division.
    "statement",
    "solution",
    "givenAnswer",
    "hint",
    "feedback",
    "introduction",
    "conclusion",
]);

/** Displayed mathematics. */
const DISPLAY_MATH = new Set(["me", "md", "men", "mdn"]);

/**
 * Wrap each run of text in an element that holds blocks in a paragraph of its own.
 * `flatDast` is mutated in place. A list item holding only text is left as it is, since
 * PreTeXt reads that text as the item's.
 */
export function wrapLooseText(flatDast: FlatDastRoot) {
    // Only the elements present before any paragraph is added.
    const elements = flatDast.elements.slice();
    for (const element of elements) {
        if (element && HOLDS_BLOCKS.has(element.name)) {
            wrapRuns(element, flatDast);
        }
    }
}

/**
 * Wrap each run of text in `element`, which holds blocks, in a paragraph of its own. For an
 * element made after {@link wrapLooseText} has run, as the worksheet of a paged document is.
 */
export function wrapRuns(element: FlatDastElement, flatDast: FlatDastRoot) {
    // Displayed mathematics stands apart on the page but is written inside a paragraph.
    const isBlock = (child: FlatDastElementContent) =>
        !DISPLAY_MATH.has(elementOf(child, flatDast)?.name ?? "") &&
        isBlockContent(child, flatDast);

    // A list item may hold a run of text on its own, as long as it holds no block and no
    // display, which PreTeXt allows only inside a paragraph. Everything else here holds
    // blocks alone, so its text always needs one.
    if (
        element.name === "li" &&
        !element.children.some(
            (child) =>
                isBlock(child) ||
                DISPLAY_MATH.has(elementOf(child, flatDast)?.name ?? ""),
        )
    ) {
        return;
    }

    const children: FlatDastElementContent[] = [];
    let run: FlatDastElementContent[] = [];
    const endRun = () => {
        if (run.some((child) => !isBlank(child))) {
            children.push(refTo(addElement(flatDast, "p", trimRun(run))));
        } else {
            children.push(...run);
        }
        run = [];
    };
    for (const child of element.children) {
        if (isBlock(child)) {
            endRun();
            children.push(child);
        } else {
            run.push(child);
        }
    }
    endRun();
    element.children = children;
}

function isBlank(child: FlatDastElementContent) {
    return typeof child === "string" && child.trim() === "";
}

/** A run without the blank lines it was written between. */
function trimRun(run: FlatDastElementContent[]) {
    const trimmed = run.slice();
    while (trimmed.length && isBlank(trimmed[0])) {
        trimmed.shift();
    }
    while (trimmed.length && isBlank(trimmed[trimmed.length - 1])) {
        trimmed.pop();
    }
    if (typeof trimmed[0] === "string") {
        trimmed[0] = trimmed[0].trimStart();
    }
    const last = trimmed.length - 1;
    if (typeof trimmed[last] === "string") {
        trimmed[last] = (trimmed[last] as string).trimEnd();
    }
    return trimmed;
}
