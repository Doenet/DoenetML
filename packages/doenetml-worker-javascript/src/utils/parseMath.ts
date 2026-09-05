import {
    groupCompositeRanges,
    joinListText,
    type CompositeGroup,
    type CompositeRange,
} from "@doenet/utils";

/** What every step of the walk below needs but never changes. */
type StringFromGroupsContext = {
    children: any[];
    nonStringIndByChild: (null | number)[];
    format: "latex" | "text";
    codePre: string;
    createInternalLists: boolean;
    /** Advanced as internal lists are created, so each gets its own code. */
    nextInternalListInd: number;
    internalLists: Record<string, any>;
    parser?: (arg0: string) => any;
    createDisplayedMathString: boolean;
    displayedMathSlotForChild?: (child: any) => string | null;
};

// concatenate strings with a numbered code for each non-string child
// (that will be parsed to form expression with codes)
// Add commas between the components that are all from one composite,
// if that composite has asList set to true.
// Put parens around that list in some cases, as described below.
export function createInputStringFromChildren({
    children,
    codePre,
    format,
    createInternalLists = false,
    parser,
    createDisplayedMathString = false,
    displayedMathSlotForChild,
}: {
    children: any;
    codePre: string;
    format: "latex" | "text";
    createInternalLists?: boolean;
    parser?: (arg0: string) => any;
    createDisplayedMathString?: boolean;
    /**
     * Returns the marker to stand in for `child` instead of its content, or
     * `null` to render the child as usual. Keyed on the child object rather
     * than its index so that it survives the composite regrouping below, which
     * reorders and regroups children but never changes their identity.
     */
    displayedMathSlotForChild?: (child: any) => string | null;
}) {
    let nonStringInd = 0;
    let nonStringIndByChild: (null | number)[] = [];
    for (let child of children) {
        if (typeof child === "string") {
            nonStringIndByChild.push(null);
        } else {
            nonStringIndByChild.push(nonStringInd);
            nonStringInd++;
        }
    }

    // Which children came from which composite, and which of those composites
    // are lists, is `groupCompositeRanges`, shared with the renderers and with
    // the `text` state variable.
    const groups = groupCompositeRanges<any>({
        children,
        ranges: children.compositeReplacementRange as
            CompositeRange[] | undefined,
        isBlank: (child) => typeof child === "string" && child.trim() === "",
    });

    const context: StringFromGroupsContext = {
        children,
        nonStringIndByChild,
        format,
        codePre,
        createInternalLists,
        nextInternalListInd: nonStringInd,
        internalLists: {},
        parser,
        createDisplayedMathString,
        displayedMathSlotForChild,
    };

    let joinString = createDisplayedMathString ? " " : "";
    return {
        string: stringFromGroups(groups, context).join(joinString),
        internalLists: context.internalLists,
    };
}

function stringFromGroups(
    groups: CompositeGroup<any>[],
    context: StringFromGroupsContext,
): string[] {
    const strings: string[] = [];

    for (const group of groups) {
        if (group.kind === "child") {
            // Not grouped with anything, so just turn this one child into a
            // string (a non-string child becoming a code based on `codePre`).
            strings.push(
                baseStringFromChildren({
                    ...context,
                    startInd: group.index,
                    endInd: group.index,
                }),
            );
            continue;
        }

        const parts = stringFromGroups(group.items, context);

        if (!group.asList) {
            // Not a list, so just concatenate what the composite produced.
            strings.push(
                parts.join(context.createDisplayedMathString ? " " : ""),
            );
            continue;
        }

        // The commas go where `text` puts them. Every part is a string here,
        // so a whitespace-only one is blank whatever produced it.
        const listString = joinListText(
            parts,
            parts.map((part) => part.trim() === ""),
        );

        strings.push(wrapListIfNeeded(listString, group.range, context));
    }

    return strings;
}

/**
 * Wrap a comma-separated list in parens if it is surrounded by a non-delimiter
 * on either side. The parens will generally turn the list into a tuple (or into
 * the arguments of a function) when it is parsed into a math-expression.
 */
function wrapListIfNeeded(
    listString: string,
    range: CompositeRange,
    context: StringFromGroupsContext,
): string {
    const { children, format, codePre, createInternalLists, parser } = context;
    const leftDelimiters = ["{", "[", "(", "|", ","];
    const rightDelimiters = ["}", "]", ")", "|", ","];

    let wrap = false;

    // First check if there is a non-delimiter to the left,
    // looking past any whitespace-only strings.
    for (let prevInd = range.firstInd - 1; prevInd >= 0; prevInd--) {
        let prevChild = children[prevInd];
        if (typeof prevChild !== "string") {
            // There is a non-string child to the left, so we must wrap the list
            wrap = true;
            break;
        }
        prevChild = prevChild.trim();
        if (prevChild.length === 0) {
            continue;
        }
        if (!leftDelimiters.includes(prevChild[prevChild.length - 1])) {
            // The string to the left did not end with one of the delimiters,
            // so we must wrap the list.
            wrap = true;
        }
        break;
    }

    if (!wrap) {
        // Since we didn't have a non-delimiter to the left,
        // check if there is a non-delimiter to the right,
        // again looking past any whitespace-only strings.
        for (
            let nextInd = range.lastInd + 1;
            nextInd < children.length;
            nextInd++
        ) {
            let nextChild = children[nextInd];
            if (typeof nextChild !== "string") {
                // There is a non-string child to the right,
                // so we must wrap the list
                wrap = true;
                break;
            }
            nextChild = nextChild.trim();
            if (nextChild.length === 0) {
                continue;
            }
            let nextChar = nextChild[0];
            // If the format is latex, the delimiter could be escaped by a \\
            if (
                format === "latex" &&
                nextChar === "\\" &&
                nextChild.length > 1
            ) {
                nextChar = nextChild[1];
            }
            if (!rightDelimiters.includes(nextChar)) {
                // The string to the right did not start with one of the
                // delimiters, so we must wrap the list.
                wrap = true;
            }
            break;
        }
    }

    if (!wrap) {
        return listString;
    }

    if (createInternalLists) {
        // if `createInternalLists` is set, rather than wrapping in parens,
        // we will put a list into the ast at this point
        // (even though one wouldn't be able to get that by parsing a string into math)
        const code = codePre + context.nextInternalListInd;
        context.internalLists[code] = parser?.(listString) ?? "";
        context.nextInternalListInd++;
        return returnStringForCode(format, code);
    }

    if (context.createDisplayedMathString) {
        return listString;
    }

    return "(" + listString + ")";
}

// concatenate string children and codes from non-string children
// into a single string to be parsed into a math expression
function baseStringFromChildren({
    children,
    startInd,
    endInd,
    nonStringIndByChild,
    format,
    codePre,
    createDisplayedMathString,
    displayedMathSlotForChild,
}: {
    children: any[];
    startInd: number;
    endInd: number;
    nonStringIndByChild: (null | number)[];
    format: "latex" | "text";
    codePre: string;
    createDisplayedMathString: boolean;
    displayedMathSlotForChild?: (child: any) => string | null;
}) {
    if (createDisplayedMathString) {
        return displayedMathStringFromChildren({
            children,
            startInd,
            endInd,
            displayedMathSlotForChild,
        });
    }
    let str = "";

    for (let ind = startInd; ind <= endInd; ind++) {
        const child = children[ind];
        if (typeof child === "string") {
            // unless child is adjacent to another string child, pad with spaces
            const leadingSpace =
                typeof children[ind - 1] === "string" ? "" : " ";
            const trailingSpace =
                typeof children[ind + 1] === "string" ? "" : " ";
            str += leadingSpace + child + trailingSpace;
        } else {
            // a non-string
            const code = codePre + nonStringIndByChild[ind];

            const nextString = returnStringForCode(format, code);

            str += nextString;
        }
    }

    return str;
}

function returnStringForCode(format: string, code: string) {
    let nextString;
    if (format === "latex") {
        // for latex, must explicitly denote that code
        // is a multicharacter variable
        nextString = "\\operatorname{" + code + "}";
    } else {
        // for text, just make sure code is surrounded by spaces
        // (the presence of numbers inside code will ensure that
        // it is parsed as a multicharacter variable)
        nextString = " " + code + " ";
    }
    return nextString;
}

function displayedMathStringFromChildren({
    children,
    startInd,
    endInd,
    displayedMathSlotForChild,
}: {
    children: any[];
    startInd: number;
    endInd: number;
    displayedMathSlotForChild?: (child: any) => string | null;
}) {
    let pieces = [];
    for (let ind = startInd; ind <= endInd; ind++) {
        let child = children[ind];

        if (typeof child !== "object") {
            let childTrim = String(child).trim();
            if (childTrim) {
                pieces.push(childTrim);
            }
            continue;
        }

        // An embedded input contributes a marker rather than its content: it is
        // rendered in place, so its value must not also be typeset.
        const slot = displayedMathSlotForChild?.(child);
        if (slot) {
            pieces.push(slot);
        } else if (typeof child.stateValues.latex === "string") {
            let latex = child.stateValues.latex.trim();
            if (latex) {
                pieces.push(latex);
            }
        } else if (typeof child.stateValues.text === "string") {
            let text = child.stateValues.text.trim();
            if (text) {
                pieces.push(text);
            }
        }
    }
    return pieces.join(" ");
}
