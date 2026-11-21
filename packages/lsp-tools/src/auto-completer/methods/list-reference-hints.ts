import type { Diagnostic, Range } from "vscode-languageserver/browser";
import { DiagnosticSeverity } from "vscode-languageserver/browser";
import {
    splitListItems,
    visit,
    type DastElement,
    type DastNodes,
    type DastRoot,
} from "@doenet/parser";
import { codedLspDiagnostic } from "../../coded-lsp-diagnostic";

/**
 * The list tags whose children are split into entries by the one rule for
 * lists (`returnGroupIntoListEntriesOfComponentType` in the worker's
 * `commonsugar/lists.ts`, through `AuthoredValueList`), where a reference
 * joins the entry it is written in rather than being an entry of its own.
 */
const LIST_TAGS = new Set([
    "mathList",
    "numberList",
    "textList",
    "booleanList",
    "tupleList",
    "intervalList",
    "pointList",
    "vectorList",
]);

const OPENERS = "([{";
const CLOSERS = ")]}";

/**
 * Editor hints for a reference that a list joins to the text beside it
 * (Doenet/DoenetML#2168, D40): in a list separated by spaces, `2$a` is one
 * entry and `2 $a` two, and nothing in the rendered list shows which. Each
 * hint points at such an entry.
 *
 * Only lists separated by spaces get one: with commas, an entry runs from
 * comma to comma and a reference in it (`2$a + 1, 3`) is where an author
 * expects it. A reference joined inside brackets (`(2$a)`) is not hinted
 * either, since the brackets already say it is one entry.
 *
 * This mirrors the worker's sugar on the DoenetML as written, and
 * conservatively: a list holding anything whose effect on the split is not
 * read here (a comment, a processing instruction) gets no hint. A
 * function call (`2$$f(1)`) joins the text beside it as a reference does,
 * and a child component is an entry of its own, as the worker's sugar has
 * them.
 */
export function listReferenceHints(
    root: DastRoot,
    source: string,
    offsetRange: (start: number, end: number) => Range,
    normalizeElementName: (name: string) => string,
): Diagnostic[] {
    const diagnostics: Diagnostic[] = [];
    visit(root, (node) => {
        if (node.type !== "element") {
            return;
        }
        const componentType = normalizeElementName(node.name);
        if (!LIST_TAGS.has(componentType)) {
            return;
        }
        for (const { start, end } of joinedEntries(node, source)) {
            const entry = source.slice(start, end);
            diagnostics.push(
                codedLspDiagnostic({
                    code: "doenet-i0059",
                    message: `\`${entry}\` is one entry of the \`<${componentType}>\`: a reference written with no space beside the text around it is part of the same entry. To make them separate entries, put a space between them.`,
                    args: { entry, componentType },
                    range: offsetRange(start, end),
                    severity: DiagnosticSeverity.Hint,
                }),
            );
        }
    });
    return diagnostics;
}

/**
 * The source offsets of each entry of `list` in which a reference meets
 * the text or reference beside it outside brackets, when the list is
 * separated by spaces.
 */
function joinedEntries(
    list: DastElement,
    source: string,
): { start: number; end: number }[] {
    const children = list.children as DastNodes[];
    // The offset in the source of each child, and, for a text, whether its
    // value is the source as written (no entity), so offsets into it are
    // offsets into the source.
    const starts: number[] = [];
    for (const child of children) {
        if (
            child.type !== "text" &&
            child.type !== "macro" &&
            child.type !== "function" &&
            child.type !== "element"
        ) {
            return [];
        }
        const start = child.position?.start.offset;
        const end = child.position?.end.offset;
        if (start == null || end == null) {
            return [];
        }
        if (child.type === "text" && source.slice(start, end) !== child.value) {
            return [];
        }
        starts.push(start);
    }
    const items: (string | DastNodes)[] = children.map((child) =>
        child.type === "text" ? child.value : child,
    );
    const { entries, splitting } = splitListItems(items, {
        isBoundary: (child) => child.type === "element",
    });
    if (splitting.separator !== "space") {
        return [];
    }

    const result: { start: number; end: number }[] = [];
    for (const parts of entries) {
        if (parts.length < 2) {
            continue;
        }
        let depth = 0;
        let joined = false;
        for (const part of parts) {
            if (part.start === undefined) {
                // A reference or function call: it meets the parts beside it at the depth
                // the text before it leaves.
                if (depth === 0) {
                    joined = true;
                }
                continue;
            }
            if (!splitting.bracketsGroup) {
                continue;
            }
            for (const char of (items[part.item] as string).slice(
                part.start,
                part.end,
            )) {
                if (OPENERS.includes(char)) {
                    depth++;
                } else if (CLOSERS.includes(char)) {
                    depth = Math.max(0, depth - 1);
                }
            }
        }
        if (!joined) {
            continue;
        }
        const first = parts[0];
        const last = parts[parts.length - 1];
        const firstChild = children[first.item];
        const lastChild = children[last.item];
        result.push({
            start:
                first.start === undefined
                    ? firstChild.position!.start.offset!
                    : starts[first.item] + first.start,
            end:
                last.end === undefined
                    ? lastChild.position!.end.offset!
                    : starts[last.item] + last.end,
        });
    }
    return result;
}
