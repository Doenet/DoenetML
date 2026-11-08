import {
    splitListItems,
    splitListText,
    type ListSplitting,
} from "@doenet/parser/list-separation";
import { ComponentInfoObjects } from "../../utils/componentInfoObjects";
import { SerializedComponent } from "../../utils/dast/types";
import { codedDiagnostic } from "../../utils/diagnostics";

/**
 * Sugar that breaks the children of a list written as text, references and
 * components into its entries by the one rule for lists (`splitListItems`
 * of `@doenet/parser`, Doenet/DoenetML#2492): commas if the text has a
 * comma outside brackets, spaces otherwise, with what is inside balanced
 * brackets kept together. Each entry is wrapped in a component of
 * `componentType` unless it is
 * - a single non-string component (when `forceComponentType` is false), or
 * - a single component of type `componentType` (when `forceComponentType`
 *   is true).
 *
 * Unless `includeNonMacros`, a component that is not a reference is always
 * an entry of its own; with `componentsAreEntries`, so is a reference, as
 * an operand of an operator is (`<sum>$a$b 1, 2</sum>` has four).
 *
 * An empty entry (`a,,b`) is an empty component of `componentType`. Text
 * whose brackets don't balance is split with them ignored, and explained
 * (`list-brackets-unmatched`, naming `componentNameForDiagnostics` or the
 * parent).
 */
export function returnGroupIntoListEntriesOfComponentType({
    componentType,
    forceComponentType = false,
    includeNonMacros = false,
    componentsAreEntries = false,
    keepTextGroup,
    componentNameForDiagnostics,
    componentTypeOfText,
}: {
    componentType: string;
    forceComponentType?: boolean;
    includeNonMacros?: boolean;
    componentsAreEntries?: boolean;
    /**
     * Whether an entry made only of text stays text, for a list that reads
     * its text itself (`AuthoredValueList`), instead of being wrapped in
     * `componentType`. Consecutive entries that stay text are kept in one
     * string, separated by the separator the list was split by, which the
     * list splits again the same way (`listSplitting` of the result).
     */
    keepTextGroup?: (text: string) => boolean;
    /** The component type the unmatched-brackets info names. */
    componentNameForDiagnostics?: string;
    /**
     * The type to wrap an entry made only of text in, when not
     * `componentType` (a `<number>` for text that is a number).
     */
    componentTypeOfText?: (text: string) => string;
}) {
    return function ({
        matchedChildren,
        componentInfoObjects,
        nComponents,
        stateIdInfo,
        parentComponentType,
        splitting: givenSplitting,
    }: {
        matchedChildren: (string | SerializedComponent)[];
        componentInfoObjects: ComponentInfoObjects;
        nComponents: number;
        stateIdInfo?: { prefix: string; num: number };
        parentComponentType?: string;
        /**
         * How to split, when the component says so itself
         * (`_listSplitting`), instead of by the rule.
         */
        splitting?: ListSplitting;
    }) {
        function isReference(child: SerializedComponent) {
            return Boolean(child.extending && "Ref" in child.extending);
        }

        const { entries, splitting, unmatchedBrackets } = splitListItems(
            matchedChildren,
            {
                isBoundary: (child: SerializedComponent) =>
                    componentsAreEntries ||
                    (!includeNonMacros && !isReference(child)),
                splitting: givenSplitting,
            },
        );

        const newChildren: (SerializedComponent | string)[] = [];
        // The entries that stay text since the last component, kept in one
        // string.
        let textRun: string[] = [];
        let keptText = false;

        function wrap(children: (SerializedComponent | string)[]) {
            return {
                type: "serialized" as const,
                componentType:
                    componentTypeOfText &&
                    children.every((child) => typeof child === "string")
                        ? componentTypeOfText(children.join(""))
                        : componentType,
                children,
                componentIdx: nComponents++,
                stateId: stateIdInfo
                    ? `${stateIdInfo.prefix}${stateIdInfo.num++}`
                    : undefined,
                attributes: {},
                state: {},
                doenetAttributes: {},
            };
        }

        function endTextRun() {
            if (textRun.length === 1 && textRun[0] === "") {
                // A string of nothing is no child, so an empty entry on its
                // own is an empty component.
                newChildren.push(wrap([]));
            } else if (textRun.length > 0) {
                newChildren.push(
                    textRun.join(splitting.separator === "comma" ? ", " : " "),
                );
                keptText = true;
            }
            textRun = [];
        }

        for (const parts of entries) {
            const pieces = parts.map((part) => {
                const child = matchedChildren[part.item];
                return part.start === undefined
                    ? child
                    : (child as string).slice(part.start, part.end);
            });

            if (pieces.length === 1 && typeof pieces[0] !== "string") {
                const comp = pieces[0];
                if (
                    !forceComponentType ||
                    componentInfoObjects.componentIsSpecifiedType(
                        comp,
                        componentType,
                    )
                ) {
                    endTextRun();
                    newChildren.push(comp);
                    continue;
                }
            }

            if (
                keepTextGroup &&
                pieces.every((piece) => typeof piece === "string")
            ) {
                const text = (pieces as string[]).join("");
                if (keepTextGroup(text)) {
                    textRun.push(text);
                    continue;
                }
            }

            endTextRun();
            newChildren.push(wrap(pieces));
        }
        endTextRun();

        const diagnostics = unmatchedBrackets
            ? [
                  // an info: the DoenetML is valid, and often meant
                  // (`a) apple, b) banana`), so it only explains the reading
                  codedDiagnostic({
                      type: "info",
                      code: "doenet-i0058",
                      args: {
                          componentType:
                              componentNameForDiagnostics ??
                              parentComponentType ??
                              componentType,
                      },
                  }),
              ]
            : [];

        return {
            success: true,
            newChildren,
            nComponents,
            diagnostics,
            // How the text kept as strings is split again, when there is
            // any.
            listSplitting: keptText ? splitting : undefined,
        };
    };
}

/**
 * The text of each entry of `text`, a list written as text, by the one rule
 * for lists (`splitListText` of `@doenet/parser`), or, when given, by
 * `splitting`, how the sugar that kept this text split the list it is part
 * of: `"x (a, b) y+1"` is `["x", "(a, b)", "y+1"]`, and `"x + 1, y"` is
 * `["x + 1", "y"]`.
 */
export function splitListEntries(
    text: string,
    splitting?: ListSplitting,
): string[] {
    return splitListText(text, splitting).entries;
}

/**
 * The value of the hidden attribute `_listSplitting` that records
 * `splitting`, how sugar split a list whose text it kept as strings, so the
 * list splits them the same way (`listSplittingFromAttribute`).
 */
export function listSplittingAttributeValue(splitting: ListSplitting) {
    return `${splitting.separator}${splitting.bracketsGroup ? "" : " ignoreBrackets"}`;
}

/** The splitting `value`, of a `_listSplitting` attribute, records. */
export function listSplittingFromAttribute(
    value: string | null | undefined,
): ListSplitting | undefined {
    if (!value) {
        return undefined;
    }
    const [separator, brackets] = value.split(" ");
    return {
        separator: separator === "comma" ? "comma" : "space",
        bracketsGroup: brackets !== "ignoreBrackets",
    };
}

/**
 * Break `componentList`, a list of tuples written as text and components
 * (`<tupleList>`, `<extrema>`, a list of number lists), into its entries by
 * the one rule for lists (`splitListItems`): `(1, 2) (3, 4)` and
 * `(1, 2), (3, 4)` are the same two tuples. Each entry made of text must be
 * one group in brackets, `(`, `[` or `{` to its closer, perhaps holding
 * components (`(1, $a)`); a component on its own is an entry. With
 * `removeBrackets`, an entry's outer brackets are removed, leaving its
 * coordinates.
 *
 * Fails, so the sugar does nothing, when the text is not such a list,
 * including when its brackets don't balance (`unmatchedBrackets`).
 */
export function breakIntoBracketedListEntries({
    componentList,
    removeBrackets = false,
}: {
    componentList: (string | SerializedComponent)[];
    removeBrackets?: boolean;
}):
    | { success: false; unmatchedBrackets?: boolean }
    | { success: true; pieces: (string | SerializedComponent)[][] } {
    const { entries, unmatchedBrackets } = splitListItems(componentList);
    if (unmatchedBrackets) {
        return { success: false, unmatchedBrackets };
    }

    const pieces: (string | SerializedComponent)[][] = [];
    for (const parts of entries) {
        const piece = parts.map((part) =>
            part.start === undefined
                ? componentList[part.item]
                : (componentList[part.item] as string).slice(
                      part.start,
                      part.end,
                  ),
        );
        if (piece.length === 1 && typeof piece[0] !== "string") {
            pieces.push(piece);
            continue;
        }
        const first = piece[0];
        const last = piece[piece.length - 1];
        if (
            typeof first !== "string" ||
            typeof last !== "string" ||
            !"([{".includes(first[0]) ||
            !")]}".includes(last[last.length - 1]) ||
            !isOneBracketedGroup(piece)
        ) {
            return { success: false };
        }
        if (removeBrackets) {
            const inside = [...piece];
            inside[0] = first.slice(1);
            const lastInd = inside.length - 1;
            inside[lastInd] = (inside[lastInd] as string).slice(0, -1);
            pieces.push(
                inside.filter((x) => typeof x !== "string" || x.length > 0),
            );
        } else {
            pieces.push(piece);
        }
    }

    return { success: true, pieces };
}

/**
 * Whether `piece`, which starts with an opener and ends with a closer, is
 * one group: the opener isn't closed before the end.
 */
function isOneBracketedGroup(piece: (string | SerializedComponent)[]) {
    let depth = 0;
    const lastInd = piece.length - 1;
    for (const [ind, item] of piece.entries()) {
        if (typeof item !== "string") {
            continue;
        }
        // by UTF-16 index, as `item.length` counts
        for (let charInd = 0; charInd < item.length; charInd++) {
            const char = item[charInd];
            if ("([{".includes(char)) {
                depth++;
            } else if (")]}".includes(char)) {
                depth--;
                if (
                    depth === 0 &&
                    !(ind === lastInd && charInd === item.length - 1)
                ) {
                    return false;
                }
            }
        }
    }
    return depth === 0;
}

/**
 * Whether `text` is one group in brackets: it starts with an opener, `(`,
 * `[` or `{`, that only the closer it ends with closes (`(1, 2]`).
 */
export function isOneBracketedText(text: string) {
    return (
        text.length > 1 &&
        "([{".includes(text[0]) &&
        ")]}".includes(text[text.length - 1]) &&
        isOneBracketedGroup([text])
    );
}
