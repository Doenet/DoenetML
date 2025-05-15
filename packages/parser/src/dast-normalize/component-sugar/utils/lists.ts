import { DastElementContent } from "../../../types";

/**
 * Break all `children` into groups separated by any spaces inside text nodes
 * that are not inside parentheses and wrap them with a new component of type `componentType`.
 *
 * Do nothing if any `children` are not a text node or a reference (macro or function) node.
 * Also do nothing if there are mismatched parentheses.
 *
 * For example, if `children` is parsed from `"a $b $$f(x) (c - $d) e$g"`,
 * then the `children` array will have seven components:\
 * `["a ", $b, " ", $$f(x), " (c - ", $d, ") e", $g]`.\
 * The children will then be grouped into five groups `[[$a], [$b], [$$f(x)], ["(c - ", $d, ")"], ["e", "$g"]]`
 * and each of those groups will become the children of a new child of type `componentType`.
 *
 * Returns:
 * - `success`: `true` if the `children` were successfully broken into groups.
 *   `success` will be `false` if there is a child that is not a text node or a reference node
 *   or if there are mismatched parentheses.
 * - `newChildren`: if `success`, then `newChildren` is the array of new children.
 */
export function groupTextAndReferencesBySpacesOutsideParens({
    children,
    componentType,
}: {
    children: DastElementContent[];
    componentType: string;
}) {
    // Open apply transformation if all children are text or references
    for (const child of children) {
        if (!["text", "macro", "function"].includes(child.type)) {
            return { success: false as const };
        }
    }

    const newChildren: DastElementContent[] = [];
    let currentGroup: DastElementContent[] = [];

    let nParens = 0;

    for (let child of children) {
        if (child.type !== "text") {
            // If child is a reference, add it to the current group.
            currentGroup.push(child);
        } else {
            let s = child.value;

            let beginInd = 0;

            for (let ind = 0; ind < s.length; ind++) {
                let char = s[ind];

                if (char === "(") {
                    nParens++;
                } else if (char === ")") {
                    if (nParens === 0) {
                        // We have an unmatched closing parenthesis, so give up.
                        // TODO: issue a warning?
                        return { success: false as const };
                    } else {
                        nParens--;
                    }
                } else if (nParens === 0 && char.match(/\s/)) {
                    // We found a space outside parens, so we will create a new child from
                    // the current group and any extra text before the space.

                    if (ind > beginInd) {
                        // Add any text before the space.
                        // TODO: calculate the actual position of the substring
                        currentGroup.push({
                            type: "text",
                            value: s.substring(beginInd, ind),
                            position: child.position,
                        });
                    }

                    // Create the new child from all new components found up to the space.
                    if (currentGroup.length > 0) {
                        newChildren.push({
                            type: "element",
                            name: componentType,
                            children: currentGroup,
                            attributes: {},
                        });
                        currentGroup = [];
                    }

                    beginInd = ind + 1;
                }
            }

            // We've reached the end of the string.
            // Add any remaining substring to the current group.
            if (s.length > beginInd) {
                // TODO: calculate the actual position of the substring
                currentGroup.push({
                    type: "text",
                    value: s.substring(beginInd, s.length),
                    position: child.position,
                });
            }
        }
    }

    if (nParens > 0) {
        // We have an unmatched opening parenthesis, so give up.
        // TODO: issue a warning?
        return { success: false as const };
    }

    // Any remaining components become the last child.
    if (currentGroup.length > 0) {
        newChildren.push({
            type: "element",
            name: componentType,
            children: currentGroup,
            attributes: {},
        });
    }

    return { success: true as const, newChildren };
}
