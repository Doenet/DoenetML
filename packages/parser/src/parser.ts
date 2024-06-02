import type { SyntaxNode, TreeCursor } from "@lezer/common";
import { parser } from "./generated-assets/lezer-doenet";

// Re-export parser for CodeMirror instances
export { parser };

type AttrRange = Record<
    string,
    { attrBegin: number; attrEnd: number; begin: number; end: number }
>;
export type Element = {
    componentType: string;
    props: Record<string, string | boolean>;
    children: Node[];
    attributeRanges?: AttrRange;
    state?: { message: string };
    doenetMLrange?: {
        begin?: number;
        end?: number;
        openBegin?: number;
        openEnd?: number;
        closeBegin?: number;
        closeEnd?: number;
        selfCloseBegin?: number;
        selfCloseEnd?: number;
    };
    doenetAttributes?: {
        createNameFromComponentType: string;
    };
};

type DummyElement = {
    componentType: string;
    state: { text: string };
    doenetMLrange: { begin: number; end: number };
};

export type Node = Element | DummyElement | string;

export type ParseError = {
    message: string;
    doenetMLrange: { begin: number; end: number };
};

/**
 *  takes in a string an outputs a TreeCursor
 * @param {string} inText
 * @returns {TreeCursor}
 */
export function parse(inText: string) {
    return parser.parse(inText).cursor();
}
/**
 * parse string and output a convenient to use object.
 * ignores macros.
 * @param {string} inText
 */
export function parseAndCompile(inText: string) {
    let errors: ParseError[] = [];

    function compileElement(cursor: TreeCursor) {
        if (cursor.name !== "Element") {
            throw Error("compileElement() called on a non-Element");
        }
        cursor.firstChild();
        // @ts-ignore
        if (cursor.name === "OpenTag") {
            //skip the start tag node
            cursor.firstChild();
            cursor.nextSibling();
            let tagName = inText.substring(cursor.from, cursor.to);
            let adjustedTagName = tagName;
            let adjustedRange = null;

            let tagOpenBegin = cursor.from;

            let message;

            if (tagName[0] === "_") {
                message = `Invalid component type: <${tagName}>.`;
                errors.push({
                    message,
                    doenetMLrange: { begin: tagOpenBegin, end: cursor.to },
                });
                adjustedTagName = "_error";
            }

            let attrs: Element["props"] = {};
            let attrRanges: AttrRange = {};
            while (cursor.nextSibling()) {
                if (cursor.name === "EndTag") {
                    continue;
                }
                //All of the siblings must b.name Attributes, but we're checking just in case the grammar changes
                if (cursor.name !== "Attribute") {
                    // let errorBegin = cursor.from;
                    let errorEnd = cursor.to;
                    // console.error(cursor);
                    // console.error(showCursor(cursor));
                    // console.error(cursor.name);
                    // eslint-disable-next-line no-empty
                    // while (cursor.parent()) {}

                    let textOfError = inText
                        .slice(tagOpenBegin - 1, errorEnd)
                        .trimEnd();

                    errorEnd = tagOpenBegin + textOfError.length - 1;

                    message = `Invalid DoenetML. Error in opening <${tagName}> tag.  Found ${textOfError}`;

                    errors.push({
                        message,
                        doenetMLrange: { begin: tagOpenBegin, end: errorEnd },
                    });
                    adjustedTagName = "_error";
                    adjustedRange = { begin: tagOpenBegin, end: errorEnd };

                    break;
                }

                //Attributes always have exactly two children, an AttributeName and an Attribute Value
                //We scrape the content of both from the in string and add them to the attribute array here
                cursor.firstChild();
                let attrName = inText.substring(cursor.from, cursor.to);
                let beginAttributeInd = cursor.from + 1;
                //skip the name and equals sign
                if (cursor.nextSibling() === false) {
                    if (attrName in attrs) {
                        message = `Duplicate attribute ${attrName}.`;
                        errors.push({
                            message,
                            doenetMLrange: {
                                begin: beginAttributeInd,
                                end: cursor.to,
                            },
                        });
                        adjustedTagName = "_error";
                    } else {
                        attrs[attrName] = true;
                        attrRanges[attrName] = {
                            attrBegin: beginAttributeInd,
                            attrEnd: cursor.to,
                            begin: beginAttributeInd,
                            end: cursor.to,
                        };
                    }
                } else {
                    cursor.nextSibling();
                    //boundry fuddling to ignore the quotes
                    let attrValue = inText.substring(
                        cursor.from + 1,
                        cursor.to - 1,
                    );

                    if (attrName in attrs) {
                        message = `Duplicate attribute ${attrName}.`;
                        errors.push({
                            message,
                            doenetMLrange: {
                                begin: beginAttributeInd,
                                end: cursor.to,
                            },
                        });
                        adjustedTagName = "_error";
                    } else {
                        attrs[attrName] = attrValue;
                        attrRanges[attrName] = {
                            attrBegin: beginAttributeInd,
                            attrEnd: cursor.to,
                            begin: cursor.from + 2,
                            end: cursor.to - 1,
                        };
                    }
                }
                //move out of Attribute to maintain loop invariant
                cursor.parent();
            }

            //get back to the level of OpenTag in order to parse tag body
            cursor.parent();

            let tagOpenEnd = cursor.to;

            let element: Element = {
                componentType: adjustedTagName,
                props: {},
                children: [],
            };

            if (adjustedTagName === "_error") {
                element.state = { message: message || "" };
                element.doenetAttributes = {
                    createNameFromComponentType: tagName,
                };
                if (attrs.name) {
                    element.props = { name: attrs.name };
                }
            } else {
                element.props = { ...attrs };
                element.attributeRanges = { ...attrRanges };
            }

            // now we go through all of the other non-terminals in this row until we get to the closing tag,
            // adding the compiled version of each non-terminal to the children section of the object we're going to return
            // for the time being we're just going to handle 2 cases:
            // the text case, in which case we'll just push a string into the children,
            // and the element case, in which case we recurse

            // Corresponds to the entity non-terminal in the grammar
            while (cursor.nextSibling()) {
                if (
                    cursor.name === "Text" ||
                    cursor.name === "Ampersand" ||
                    cursor.name === "EntityReference" ||
                    cursor.name === "CharacterReference"
                ) {
                    let txt = inText.substring(cursor.from, cursor.to);
                    if (txt !== "") {
                        element.children.push(txt);
                    }
                } else if (cursor.name === "Element") {
                    element.children.push(compileElement(cursor.node.cursor()));
                } else if (cursor.name === "CloseTag") {
                    // Will always be the matching tag (and the last tag in the list)
                    break;
                } else if (cursor.name === "Comment") {
                    // return a comment that will be ignored,
                    // but need it to calculate doenetMLrange
                    // from any strings that follow it (needed in particular for macros)
                    element.children.push({
                        componentType: "_comment",
                        state: {
                            text: inText.substring(cursor.from, cursor.to),
                        },
                        doenetMLrange: {
                            begin: cursor.from,
                            end: cursor.to,
                        },
                    });
                    //ignore comments
                    continue;
                } else if (cursor.name === "MismatchedCloseTag") {
                    let message = `Invalid DoenetML. Mismatched closing tag.  Expected </${tagName}>.  Found ${inText.slice(
                        cursor.from,
                        cursor.to,
                    )}.`;
                    errors.push({
                        message,
                        doenetMLrange: {
                            begin: cursor.from + 1,
                            end: cursor.to,
                        },
                    });

                    if (adjustedRange) {
                        element.doenetMLrange = { ...adjustedRange };
                    } else {
                        element.doenetMLrange = {
                            openBegin: tagOpenBegin,
                            openEnd: tagOpenEnd,
                            closeBegin: cursor.from + 1,
                            closeEnd: cursor.to,
                        };
                    }
                    element = {
                        componentType: "_error",
                        props: {},
                        children: [element],
                        state: { message },
                    };
                    break;
                } else if (cursor.name === "MissingCloseTag") {
                    let message = `Invalid DoenetML.  Missing closing tag.  Expected </${tagName}>.`;
                    errors.push({
                        message,
                        doenetMLrange: { begin: cursor.from, end: cursor.to },
                    });

                    if (adjustedRange) {
                        element.doenetMLrange = { ...adjustedRange };
                    } else {
                        element.doenetMLrange = {
                            begin: tagOpenBegin,
                            end: cursor.to,
                        };
                    }
                    element = {
                        componentType: "_error",
                        props: {},
                        children: [element],
                        state: { message },
                    };
                    break;
                } else {
                    // console.log(`error is at position ${cursor.from}, ${cursor.to}`)
                    // console.log(`error part: ${inText.slice(cursor.from, cursor.to)}`)
                    // console.log(`Here is cursor: ${showCursor(cursor)}`)
                    // There are a couple of other things in the entity non-terminal, but nothing of immediate importance
                    if (adjustedTagName !== "_error") {
                        let message = `Invalid DoenetML.  Missing closing tag.  Expected </${tagName}>.`;
                        errors.push({
                            message,
                            doenetMLrange: {
                                begin: cursor.from,
                                end: cursor.to,
                            },
                        });

                        if (adjustedRange) {
                            element.doenetMLrange = { ...adjustedRange };
                        } else {
                            element.doenetMLrange = {
                                begin: tagOpenBegin,
                                end: cursor.to,
                            };
                        }
                        element = {
                            componentType: "_error",
                            props: {},
                            children: [element],
                            state: { message },
                        };
                        break;
                    }
                }
            }
            element.children = mergeConsecutiveStrings(element.children);

            if (adjustedRange) {
                element.doenetMLrange = adjustedRange;
            } else {
                element.doenetMLrange = {
                    openBegin: tagOpenBegin,
                    openEnd: tagOpenEnd,
                    closeBegin: cursor.from + 1,
                    closeEnd: cursor.to,
                };
            }
            return element;
            // @ts-ignore
        } else if (cursor.name === "SelfClosingTag") {
            cursor.firstChild();
            cursor.nextSibling();

            let tagName = inText.substring(cursor.from, cursor.to);
            let adjustedTagName = tagName;

            let tagBegin = cursor.from;

            let message;

            if (tagName[0] === "_") {
                message = `Invalid component type: <${tagName}>.`;
                errors.push({
                    message,
                    doenetMLrange: { begin: tagBegin, end: cursor.to },
                });
                adjustedTagName = "_error";
            }

            let attrs: Element["props"] = {};
            let attrRanges: AttrRange = {};
            while (cursor.nextSibling()) {
                if (cursor.name === "SelfCloseEndTag") {
                    continue;
                }
                //All of the siblings must be Attributes, but we're checking just in case the grammar changes
                if (cursor.name !== "Attribute") {
                    // Note: not sure if can get to this condition.  Errors in self-closing tag
                    // seem to prevent parser from recognizing that it is self-closing.
                    let errorEnd = cursor.to;

                    message = `Invalid DoenetML. Error in self-closing <${tagName}> tag.  Found ${inText.slice(
                        tagBegin - 1,
                        errorEnd,
                    )}`;

                    errors.push({
                        message,
                        doenetMLrange: { begin: tagBegin - 1, end: errorEnd },
                    });
                    adjustedTagName = "_error";

                    break;
                }
                //Attributes always have exactly two children, an AttributeName and an Attribute Value
                //We scrape the content of both from the in string and add them to the attribute array here
                cursor.firstChild();
                let attrName = inText.substring(cursor.from, cursor.to);
                let beginAttributeInd = cursor.from + 1;

                if (cursor.nextSibling() === false) {
                    if (attrName in attrs) {
                        message = `Duplicate attribute ${attrName}.`;
                        errors.push({
                            message,
                            doenetMLrange: {
                                begin: beginAttributeInd,
                                end: cursor.to,
                            },
                        });
                        adjustedTagName = "_error";
                    } else {
                        attrs[attrName] = true;
                    }
                } else {
                    cursor.nextSibling();
                    if (attrName in attrs) {
                        message = `Duplicate attribute ${attrName}.`;
                        errors.push({
                            message,
                            doenetMLrange: {
                                begin: beginAttributeInd,
                                end: cursor.to,
                            },
                        });
                        adjustedTagName = "_error";
                    } else {
                        //fuddling to ignore the quotes
                        let attrValue = inText.substring(
                            cursor.from + 1,
                            cursor.to - 1,
                        );
                        attrs[attrName] = attrValue;
                        attrRanges[attrName] = {
                            attrBegin: beginAttributeInd,
                            attrEnd: cursor.to,
                            begin: cursor.from + 2,
                            end: cursor.to - 1,
                        };
                    }
                }
                //move out of Attribute to maintain loop invariant
                cursor.parent();
            }

            let selfCloseEnd = cursor.to;

            let doenetMLrange = {
                selfCloseBegin: tagBegin,
                selfCloseEnd,
            };

            // console.log(">>>toReturn", {componentType :  tagName, props : attrs, children : []});

            //I have no idea why attrs needs to be destructured
            // but if it isn't, it doesn't work ~50% of the time
            let element: Element = {
                componentType: adjustedTagName,
                props: {},
                children: [],
                doenetMLrange,
            };
            if (adjustedTagName === "_error") {
                element.state = { message: message || "" };
                element.doenetAttributes = {
                    createNameFromComponentType: tagName,
                };
                if (attrs.name) {
                    element.props = { name: attrs.name };
                }
            } else {
                element.props = { ...attrs };
                element.attributeRanges = { ...attrRanges };
            }
            return element;
        } else {
            //Unreachable case, see the grammar for why
            throw Error(
                "Non SelfClosingTag/OpenTag in Element. How did you do that?",
            );
        }
    }
    function compileTopLevel(tc: TreeCursor): Node | undefined {
        if (tc.node.name === "Element") {
            return compileElement(tc.node.cursor());
        } else if (tc.node.name === "Comment") {
            // return a comment that will be ignored,
            // but need it to calculate doenetMLrange
            // from any strings that follow it (needed in particular for macros)
            return {
                componentType: "_comment",
                state: { text: inText.substring(tc.from, tc.to) },
                doenetMLrange: {
                    begin: tc.from,
                    end: tc.to,
                },
            };
        } else if (
            tc.node.name === "Text" ||
            tc.node.name === "Ampersand" ||
            tc.node.name === "EntityReference" ||
            tc.node.name === "CharacterReference"
        ) {
            let txt = inText.substring(tc.node.from, tc.node.to);
            if (txt !== "") {
                return txt;
            }
        } else {
            let message = `Invalid DoenetML.  Found ${inText.substring(
                tc.node.from,
                tc.node.to,
            )}`;
            errors.push({
                message,
                doenetMLrange: { begin: tc.node.from + 1, end: tc.node.to },
            });
            return {
                componentType: "_error",
                props: {},
                children: [],
                state: { message },
                doenetMLrange: { begin: tc.node.from + 1, end: tc.node.to },
            };
        }
    }
    if (!inText) {
        return { components: [], errors };
    }
    let tc = parse(inText);
    let out: Node[] = [];
    if (!tc.firstChild()) {
        return { components: out, errors };
    }
    // console.log("intext",inText)
    // console.log("showCursor",showCursor(tc));

    let first = compileTopLevel(tc);
    if (first !== null && first !== undefined) {
        out.push(first);
    }
    while (tc.nextSibling()) {
        let next = compileTopLevel(tc);
        if (next !== null && next !== undefined) {
            out.push(next);
        }
    }

    out = mergeConsecutiveStrings(out);

    return { components: out, errors };
}

/**
 * pretty-print the tree pointed to by a tree-cursor.
 * Intended for demonstration/debugging
 * @param {TreeCursor} cursor
 * @returns {string}
 */
export function showCursor(cursor: TreeCursor) {
    return showNode(cursor.node);
}

export function showNode(node: SyntaxNode) {
    let str = node.name;
    if (node.firstChild !== null) {
        str += "(" + showNode(node.firstChild) + ")";
    }
    if (node.nextSibling !== null) {
        str += "," + showNode(node.nextSibling);
    }
    return str;
}

// merge consecutive string nodes into one string node
function mergeConsecutiveStrings(nodes: Node[]) {
    let mergedNodes: Node[] = [];
    let prevNode: Node | undefined;
    for (let node of nodes) {
        if (typeof node === "string" && typeof prevNode === "string") {
            prevNode = prevNode + node;
            mergedNodes[mergedNodes.length - 1] = prevNode;
        } else {
            prevNode = node;
            mergedNodes.push(node);
        }
    }

    return mergedNodes;
}
