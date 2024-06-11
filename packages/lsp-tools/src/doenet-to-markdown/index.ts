import { DastNodes, DastNodesV6, DastRoot, toXml } from "@doenet/parser";
import type {
    Root as MdastRoot,
    Nodes as MdastNodes,
    RootContent as MdastRootContent,
    PhrasingContent as MdastPhrasingContent,
    BlockContent as MdastBlockContent,
    ListItem as MdastListItem,
} from "mdast";
import { toMarkdown } from "mdast-util-to-markdown";
import { DoenetSourceObject } from "../doenet-source-object";
import { condenseBlankPars, trimLeadingWhitespace } from "./trim";
import { sum } from "./utils";

const DIVISIONS = [
    "part",
    "chapter",
    "section",
    "subsection",
    "subsubsection",
    "paragraphs",
    // Not officially divisions, but we treat them as divisions
    // to get more reliable headers
    "example",
    "aside",
];

export function doenetToMarkdown(source: DoenetSourceObject | string) {
    const sourceObj =
        typeof source === "string" ? new DoenetSourceObject(source) : source;
    const dast = sourceObj.dast as DastRoot;
    let mdast = condenseBlankPars(doenetToMdast(dast, sourceObj));

    // Make sure there are paragraphs between consecutive headers.
    // Otherwise blank lines will not be rendered between consecutive headers.
    mdast = mdast.flatMap((node, i) => {
        const nextNode = mdast[i + 1];
        if (node.type === "heading" && nextNode?.type === "heading") {
            return [
                node,
                {
                    type: "paragraph",
                    children: [{ type: "text", value: "\n\n" }],
                },
            ];
        }
        if (node.type === "heading" && nextNode?.type !== "paragraph") {
            return [
                node,
                {
                    type: "paragraph",
                    children: [{ type: "text", value: "\n\n" }],
                },
            ];
        }
        return [node];
    });

    let text = toMarkdown({ type: "root", children: mdast });
    // Occurrences of `&#x20;` at the start of a line are probably a mistake, so trim them.
    text = text.replace(/^&#x20;/gm, "");
    // We always end with exactly one newline.
    text = text.trim() + "\n";

    return text;
}

export function textContent(node: DastNodes): string {
    switch (node.type) {
        case "cdata":
            return node.value;
        case "comment":
        case "doctype":
        case "instruction":
        case "error":
            return "";
        case "function":
        case "macro":
            return toXml(node);
        case "root":
        case "element":
            return node.children.map(textContent).join("");
        case "text":
            return node.value;
        default:
            const _unreachable: void = node;
    }

    return "";
}

function doenetToMdast(
    node: DastNodes,
    sourceObj: DoenetSourceObject,
): MdastRootContent[] {
    function mapChildren(children: DastNodes[]): MdastRootContent[] {
        return children.flatMap((n) => doenetToMdast(n, sourceObj));
    }
    switch (node.type) {
        case "cdata":
            return [{ type: "text", value: node.value }];
        case "comment":
        case "doctype":
        case "instruction":
        case "error":
            return [];
        case "function":
        case "macro":
            return [
                {
                    type: "inlineCode",
                    value: toXml(node),
                },
            ];
        case "root":
            return node.children.flatMap((n) => doenetToMdast(n, sourceObj));
        case "element":
            // Most elements have their tags omitted and their contents printed.
            // Some we handle specially.
            switch (node.name) {
                // A <graph> has no textual form, so we pass it through as a code block.
                case "graph":
                    return [
                        {
                            type: "code",
                            lang: "doenet",
                            value: trimLeadingWhitespace(toXml(node), {
                                tabWidth: 2,
                                omitFirstLine: true,
                            }),
                        },
                    ];
                // Whatever is in a code editor should show up as a code block
                case "codeEditor":
                    return [
                        {
                            type: "code",
                            lang: "doenet",
                            value: trimLeadingWhitespace(
                                toXml(node.children).trim(),
                                {
                                    tabWidth: 2,
                                    omitFirstLine: true,
                                },
                            ),
                        },
                    ];
                case "tag":
                    return [
                        {
                            type: "inlineCode",
                            value: `<${textContent(node)}>`,
                        },
                    ];
                case "c":
                    return [
                        {
                            type: "inlineCode",
                            value: textContent(node),
                        },
                    ];
                case "ol":
                    return [
                        {
                            type: "list",
                            ordered: true,
                            children: mapChildren(node.children).filter(
                                (n) => n.type === "listItem",
                            ) as MdastListItem[],
                        },
                    ];
                case "li":
                    return [
                        {
                            type: "listItem",
                            children: mapChildren(
                                node.children,
                            ) as MdastBlockContent[],
                        },
                    ];
                case "m":
                case "math":
                    return [
                        {
                            type: "text",
                            value: `$${textContent(node)}$`,
                        },
                    ];
                case "p":
                    return [
                        {
                            type: "paragraph",
                            children: mapChildren(
                                node.children,
                            ) as MdastPhrasingContent[],
                        },
                    ];
                case "title": {
                    const depth = sum(
                        sourceObj
                            .getParents(node as DastNodesV6)
                            .map((n) =>
                                n.type === "element" &&
                                DIVISIONS.includes(n.name)
                                    ? 1
                                    : 0,
                            ),
                    );
                    return [
                        {
                            type: "heading",
                            depth: clampToHeadingNumber(depth),
                            children: mapChildren(
                                node.children,
                            ) as MdastPhrasingContent[],
                        },
                    ];
                }
            }
            return mapChildren(node.children);
        case "text": {
            if (node.value.trim() === "") {
                return [];
            }
            const hasPAncestor = sourceObj
                .getParents(node)
                .some((n) => n.type === "element" && n.name === "p");
            if (hasPAncestor) {
                return [{ type: "text", value: node.value }];
            }
            return [
                {
                    type: "paragraph",
                    children: [{ type: "text", value: node.value }],
                },
            ];
        }
        default:
            const _unreachable: void = node;
    }
    return [];
}

/**
 * Clamps a number to the range 1-6, suitable for an Mdast heading depth.
 */
function clampToHeadingNumber(n: number): 1 | 2 | 3 | 4 | 5 | 6 {
    return Math.min(6, Math.max(1, Math.round(n))) as 1 | 2 | 3 | 4 | 5 | 6;
}
