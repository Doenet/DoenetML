import { visit } from "unist-util-visit";
import type { Element as HastElement, Root as HastRoot } from "hast";

/**
 * A printout written in `<page>`s: PreTeXt renders each page as a `section.onepage` inside
 * a `section.worksheet` (or `section.handout`), and leaves both the breaks between the
 * sheets and the height of the writing space to the javascript of its print preview
 * (`pretext-printouts.js`), which this page does not load. This module does that part of
 * its work: each page is printed on a sheet of its own, and the writing space on it is
 * stretched or shrunk, in the proportions the author gave it, so that the page fills the
 * sheet exactly.
 *
 * The paper is US Letter, and the margins are the printout's own (`data-margins`, which
 * PreTeXt sets from the publisher's `worksheet/@margin`, 0.75in by default).
 */

/** US Letter, in CSS pixels (96 to the inch). */
const PAPER = { width: 816, height: 1056 };

const DEFAULT_MARGIN = "0.75in";

/**
 * Classes of the page chrome around the printout — the masthead, the table of contents,
 * the footers — which would otherwise take the top of the first sheet.
 */
const CHROME_CLASSES = [
    "ptx-masthead",
    "ptx-sidebar",
    "ptx-navbar",
    "ptx-page-footer",
    "ptx-content-footer",
];

/**
 * Prepare `tree`, the HTML PreTeXt made of a document, to print one page per sheet. A
 * document with no page is left as it was. `tree` is mutated in place.
 */
export function preparePrintoutPages(tree: HastRoot) {
    let printout: HastElement | undefined;
    let hasPage = false;
    visit(tree, "element", (node: HastElement) => {
        if (hasClass(node, "onepage")) {
            hasPage = true;
        }
        if (
            !printout &&
            node.tagName === "section" &&
            (hasClass(node, "worksheet") || hasClass(node, "handout"))
        ) {
            printout = node;
        }
    });
    if (!hasPage || !printout) {
        return;
    }

    dropEmptyHeading(printout);

    const margins = parseMargins(printout.properties?.dataMargins);

    visit(tree, "element", (node: HastElement) => {
        if (node.tagName === "head") {
            node.children.push(
                {
                    type: "element",
                    tagName: "style",
                    properties: {},
                    children: [{ type: "text", value: pageStyle(margins) }],
                },
                {
                    type: "element",
                    tagName: "script",
                    properties: {},
                    children: [
                        {
                            type: "text",
                            value: `(${fitPrintoutPages.toString()})(${JSON.stringify(
                                {
                                    paperHeight: PAPER.height,
                                    marginTop: toPixels(margins[0]),
                                    marginBottom: toPixels(margins[2]),
                                },
                            )});`,
                        },
                    ],
                },
            );
        }
    });
}

/**
 * Drop the heading of a printout that has no title. PreTeXt heads an untitled worksheet
 * with its number alone, and one given an empty title with an empty heading, a blank rule
 * across the top of the first sheet.
 */
function dropEmptyHeading(printout: HastElement) {
    printout.children = printout.children.filter((child) => {
        if (
            child.type !== "element" ||
            !/^h\d$/.test(child.tagName) ||
            !hasClass(child, "heading")
        ) {
            return true;
        }
        let title = "";
        visit(child, "element", (node: HastElement) => {
            if (hasClass(node, "title")) {
                visit(node, "text", (text) => {
                    title += text.value;
                });
            }
        });
        return title.trim() !== "";
    });
}

/** The four margins, top, right, bottom and left, from a CSS-style shorthand. */
function parseMargins(value: unknown): [string, string, string, string] {
    const parts =
        typeof value === "string"
            ? value
                  .trim()
                  .split(/\s+/)
                  .filter((part) => LENGTH.test(part))
            : [];
    const [top = DEFAULT_MARGIN, right = top, bottom = top, left = right] =
        parts;
    return [top, right, bottom, left];
}

/** A length a margin may be given in, and nothing else, as it is written into CSS. */
const LENGTH = /^(\d+(\.\d+)?|\.\d+)(in|cm|mm|pt|px)$/;

const PIXELS_PER_UNIT: Record<string, number> = {
    in: 96,
    cm: 96 / 2.54,
    mm: 96 / 25.4,
    pt: 96 / 72,
    px: 1,
};

function toPixels(length: string) {
    const match = LENGTH.exec(length);
    return match ? parseFloat(length) * PIXELS_PER_UNIT[match[3]] : 72;
}

/**
 * The stylesheet that lays each page out as a sheet: the width of the paper inside its
 * margins, a break after it, and on screen the look of a sheet of paper, so that what is
 * seen is what prints.
 */
function pageStyle([top, right, bottom, left]: [
    string,
    string,
    string,
    string,
]) {
    const width = `calc(${PAPER.width}px - ${left} - ${right})`;
    const height = `calc(${PAPER.height}px - ${top} - ${bottom})`;
    return `
@page { size: letter; margin: ${top} ${right} ${bottom} ${left}; }
${CHROME_CLASSES.map((c) => `.${c}`).join(", ")} { display: none !important; }
body.pretext, .ptx-page, .ptx-main, .ptx-content, section.article,
section.worksheet, section.handout {
    margin: 0 !important; padding: 0 !important; border: none !important;
    max-width: none !important; width: auto !important; min-height: 0 !important;
}
section.onepage {
    /* flow-root keeps the margins of what is on the page inside it, so that the height
       measured for it is the height it prints. */
    display: flow-root;
    box-sizing: border-box; width: ${width}; margin: 0; padding: 0;
    break-after: page; break-inside: avoid;
}
section.onepage:last-of-type { break-after: auto; }
section.onepage > :first-child { margin-top: 0; }
.workspace { display: block; }
@media screen {
    body.pretext { background: #e8e8e8; }
    section.onepage {
        min-height: ${height}; margin: 24px auto; background: white;
        outline: 1px solid #bbb; outline-offset: ${top};
        box-shadow: 0 0 0 ${top} white;
    }
    section.onepage[data-overflow]::after {
        content: "This page's content is taller than one sheet, and part of it will print on the next.";
        display: block; margin-top: 1em; padding: 0.5em; color: #a00;
        border: 2px solid #a00;
    }
}
`;
}

/**
 * Stretch or shrink the writing space on each page so that the page fills its sheet.
 *
 * Runs in the printed page, so it is serialized into it and must use nothing from outside
 * its own body. The space on a page grows in the proportions the author gave it: the page
 * is measured with the space at those heights and again with none at all, and the
 * difference is how much of the page the space takes up — which also covers space written
 * side by side, where only the tallest column counts — and so what it has to be scaled by.
 *
 * A page whose content is taller than a sheet without any space is left at the heights the
 * author gave, and is marked, so that the screen shows it will run onto a second sheet.
 */
function fitPrintoutPages(options: {
    paperHeight: number;
    marginTop: number;
    marginBottom: number;
}) {
    /** Kept free at the foot of each sheet, against rounding in the printed layout. */
    const SAFETY = 6;
    const available =
        options.paperHeight - options.marginTop - options.marginBottom - SAFETY;

    function workspacesOf(page: Element) {
        return Array.from(page.querySelectorAll<HTMLElement>(".workspace"));
    }

    /** The height the author asked for, which the compiler wrote into the style. */
    function authoredHeight(workspace: HTMLElement) {
        if (workspace.dataset.authoredHeight === undefined) {
            workspace.dataset.authoredHeight = String(
                workspace.getBoundingClientRect().height,
            );
        }
        return parseFloat(workspace.dataset.authoredHeight);
    }

    function pageHeight(page: Element) {
        return page.getBoundingClientRect().height;
    }

    /**
     * Content written in the printout before its first page, or after its last, prints
     * with that page, as in PreTeXt's own print preview.
     */
    function gatherStrayContent(pages: Element[]) {
        const printout = pages[0].parentElement;
        if (!printout) {
            return;
        }
        const first = pages[0];
        const last = pages[pages.length - 1];
        const before: Node[] = [];
        for (let node = printout.firstChild; node && node !== first;) {
            const next = node.nextSibling;
            before.push(node);
            node = next;
        }
        first.prepend(...before);
        for (let node = last.nextSibling; node;) {
            const next = node.nextSibling;
            last.append(node);
            node = next;
        }
    }

    function fit() {
        const pages = Array.from(document.querySelectorAll("section.onepage"));
        if (pages.length === 0) {
            return;
        }
        gatherStrayContent(pages);

        for (const page of pages) {
            const workspaces = workspacesOf(page);
            const heights = workspaces.map(authoredHeight);
            // Measured without the minimum height a sheet is given on screen.
            (page as HTMLElement).style.minHeight = "0";

            workspaces.forEach((w, i) => (w.style.height = `${heights[i]}px`));
            const withSpace = pageHeight(page);
            workspaces.forEach((w) => (w.style.height = "0px"));
            const withoutSpace = pageHeight(page);
            const space = withSpace - withoutSpace;

            let factor = 1;
            if (withoutSpace > available) {
                page.setAttribute("data-overflow", "");
            } else {
                page.removeAttribute("data-overflow");
                if (space > 0) {
                    factor = (available - withoutSpace) / space;
                } else if (withSpace > available) {
                    page.setAttribute("data-overflow", "");
                }
            }
            workspaces.forEach(
                (w, i) => (w.style.height = `${heights[i] * factor}px`),
            );
            (page as HTMLElement).style.minHeight = "";
        }
    }

    async function run() {
        try {
            await (document as any).fonts?.ready;
        } catch {}
        try {
            await (window as any).MathJax?.startup?.promise;
        } catch {}
        fit();
    }

    if (document.readyState === "complete") {
        run();
    } else {
        window.addEventListener("load", run);
    }
    // Math typeset after the page loaded, or a font arriving late, changes the heights.
    window.addEventListener("beforeprint", fit);
}

function hasClass(node: HastElement, className: string) {
    const classNames = node.properties?.className;
    if (Array.isArray(classNames)) {
        return classNames.includes(className);
    }
    if (typeof classNames === "string") {
        return classNames.split(" ").includes(className);
    }
    return false;
}
