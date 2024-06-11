import {
    Root as MdastRoot,
    Nodes as MdastNodes,
    RootContent as MdastRootContent,
    PhrasingContent as MdastPhrasingContent,
} from "mdast";
import { toString } from "mdast-util-to-string";

/**
 * If two paragraphs in a row are detected with no content, collapse them down to a single paragraph.
 */
export function condenseBlankPars(
    nodes: MdastRootContent[],
): MdastRootContent[] {
    let lastNode: MdastRootContent | null = null;
    return nodes.flatMap((node, i) => {
        if (node.type === "paragraph" && lastNode?.type === "paragraph") {
            if (
                toString(node.children).trim() === "" &&
                toString(lastNode.children).trim() === ""
            ) {
                return [];
            }
        }
        lastNode = node;
        return [node];
    });
}

/**
 * Trim a uniform amount of leading whitespace from each line. Tabs count as `tabWidth` spaces.
 * This can be used do de-indent code blocks.
 */
export function trimLeadingWhitespace(
    text: string,
    options?: { tabWidth?: number; omitFirstLine?: boolean },
) {
    const { tabWidth = 4, omitFirstLine = false } = options ?? {};

    const lines = text.split("\n");
    // Find the number of whitespace characters at the start of each line, with `\t` counting as `tabWidth` spaces.
    const leadingWhitespace = lines.flatMap((line) =>
        // Blank lines count as having infinite amounts of whitespace, so they are skipped over.
        line.length === 0 ? [] : line.match(/^(\s*)/)?.[0] ?? "",
    );
    const whitespaceCount = leadingWhitespace.map((sp) =>
        sp.split("").reduce((acc, c) => acc + (c === "\t" ? tabWidth : 1), 0),
    );
    const minWhitespace = omitFirstLine
        ? Math.min(...whitespaceCount.slice(1))
        : Math.min(...whitespaceCount);

    return lines
        .map((line) => trimLine(line, minWhitespace, tabWidth))
        .join("\n");
}

/**
 * Trim up to `trimLen` characters from the start of `text`.
 */
function trimLine(text: string, trimLen: number, tabWidth: number) {
    let [_, ws, rest] = text.match(/^(\s*)(.*)/) ?? ["", "", ""];
    ws = ws.replace(/\t/g, " ".repeat(tabWidth));
    return ws.slice(trimLen) + rest;
}
