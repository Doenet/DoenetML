import {
    groupCompositeRanges,
    isBlankGroup,
    joinListText,
    type CompositeGroup,
    type CompositeRange,
} from "@doenet/utils";

export function textFromComponent(component: any): string {
    if (typeof component !== "object") {
        return component.toString();
    } else if (component.stateValues.hidden) {
        return "";
    } else if (typeof component.stateValues.text === "string") {
        return component.stateValues.text;
    } else {
        return " ";
    }
}

function isBlankString(child: any) {
    return typeof child === "string" && child.trim() === "";
}

/**
 * Concatenate the text from `children` into one string, putting commas between
 * the replacements of a composite that asks to be shown as a list.
 *
 * The grouping — which children came from which composite, which of those
 * composites are lists, and where the commas go — is shared with the renderers
 * through `@doenet/utils`, so that what a reader sees and what `text` says
 * cannot drift apart.
 */
export function textFromChildren(
    children: any,
    textFromComponentConverter = textFromComponent,
) {
    const groups = groupCompositeRanges<any>({
        children,
        ranges: children.compositeReplacementRange as
            CompositeRange[] | undefined,
        isBlank: isBlankString,
        // A hidden composite contributes nothing, not even its children's text.
        skipRange: (range) => Boolean(range.hidden),
    });

    return groups
        .map((group) => textFromGroup(group, textFromComponentConverter))
        .join("");
}

/** The text of one child, or of everything one composite produced. */
function textFromGroup(
    group: CompositeGroup<any>,
    convert: (value: any) => string,
): string {
    if (group.kind === "child") {
        return convert(group.value);
    }
    const parts = group.items.map((item) => textFromGroup(item, convert));
    if (!group.asList) {
        return parts.join("");
    }
    // A part that came out empty — a hidden child, say — is no more an item of
    // the list than whitespace is.
    return joinListText(
        parts,
        group.items.map(
            (item, ind) =>
                parts[ind] === "" || isBlankGroup(item, isBlankString),
        ),
    );
}

export function returnTextPieceStateVariableDefinitions() {
    let stateVariableDefinitions: any = {};

    stateVariableDefinitions.numWords = {
        description: "The number of words in the text value.",
        public: true,
        shadowingInstructions: {
            createComponentOfType: "integer",
        },
        returnDependencies: () => ({
            value: {
                dependencyType: "stateVariable",
                variableName: "value",
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: { value: string };
        }) {
            return {
                setValue: {
                    numWords: dependencyValues.value.trim().split(/\s+/).length,
                },
            };
        },
    };

    stateVariableDefinitions.words = {
        description: "The text value split into words.",
        public: true,
        shadowingInstructions: {
            createComponentOfType: "text",
        },
        isArray: true,
        entryPrefixes: ["word"],
        returnArraySizeDependencies: () => ({
            numWords: {
                dependencyType: "stateVariable",
                variableName: "numWords",
            },
        }),
        returnArraySize({
            dependencyValues,
        }: {
            dependencyValues: { numWords: number };
        }) {
            return [dependencyValues.numWords];
        },
        returnArrayDependenciesByKey() {
            let globalDependencies = {
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            };

            return { globalDependencies };
        },
        arrayDefinitionByKey({
            globalDependencyValues,
        }: {
            globalDependencyValues: { value: string };
        }) {
            return {
                setValue: {
                    words: globalDependencyValues.value.trim().split(/\s+/),
                },
            };
        },
    };

    stateVariableDefinitions.numCharacters = {
        description: "The number of characters (graphemes) in the text value.",
        public: true,
        shadowingInstructions: {
            createComponentOfType: "integer",
        },
        returnDependencies: () => ({
            value: {
                dependencyType: "stateVariable",
                variableName: "value",
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: { value: string };
        }) {
            // @ts-ignore
            const itr = new Intl.Segmenter("en", {
                granularity: "grapheme",
            }).segment(dependencyValues.value);
            return {
                setValue: { numCharacters: [...itr].length },
            };
        },
    };

    stateVariableDefinitions.characters = {
        description: "The text value split into characters (graphemes).",
        public: true,
        shadowingInstructions: {
            createComponentOfType: "text",
        },
        isArray: true,
        entryPrefixes: ["character"],
        returnArraySizeDependencies: () => ({
            numCharacters: {
                dependencyType: "stateVariable",
                variableName: "numCharacters",
            },
        }),
        returnArraySize({
            dependencyValues,
        }: {
            dependencyValues: { numCharacters: number };
        }) {
            return [dependencyValues.numCharacters];
        },
        returnArrayDependenciesByKey() {
            let globalDependencies = {
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            };

            return { globalDependencies };
        },
        arrayDefinitionByKey({
            globalDependencyValues,
        }: {
            globalDependencyValues: { value: string };
        }) {
            // @ts-ignore
            const itr = new Intl.Segmenter("en", {
                granularity: "grapheme",
            }).segment(globalDependencyValues.value);

            return {
                setValue: {
                    characters: Array.from(itr, ({ segment }) => segment),
                },
            };
        },
    };

    stateVariableDefinitions.numListItems = {
        description:
            "The number of comma-separated items when the text is interpreted as a list.",
        public: true,
        shadowingInstructions: {
            createComponentOfType: "integer",
        },
        returnDependencies: () => ({
            value: {
                dependencyType: "stateVariable",
                variableName: "value",
            },
        }),
        definition({
            dependencyValues,
        }: {
            dependencyValues: { value: string };
        }) {
            return {
                setValue: {
                    numListItems: dependencyValues.value.trim().split(",")
                        .length,
                },
            };
        },
    };

    stateVariableDefinitions.list = {
        description: "The text value split into items at commas.",
        public: true,
        shadowingInstructions: {
            createComponentOfType: "text",
        },
        isArray: true,
        entryPrefixes: ["listItem"],
        returnArraySizeDependencies: () => ({
            numListItems: {
                dependencyType: "stateVariable",
                variableName: "numListItems",
            },
        }),
        returnArraySize({
            dependencyValues,
        }: {
            dependencyValues: { numListItems: number };
        }) {
            return [dependencyValues.numListItems];
        },
        returnArrayDependenciesByKey() {
            let globalDependencies = {
                value: {
                    dependencyType: "stateVariable",
                    variableName: "value",
                },
            };

            return { globalDependencies };
        },
        arrayDefinitionByKey({
            globalDependencyValues,
        }: {
            globalDependencyValues: { value: string };
        }) {
            return {
                setValue: {
                    list: globalDependencyValues.value
                        .trim()
                        .split(",")
                        .map((s) => s.trim()),
                },
            };
        },
    };

    return stateVariableDefinitions;
}
