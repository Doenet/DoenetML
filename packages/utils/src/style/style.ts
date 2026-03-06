import { colorValueToWord } from "./colorWords";

/**
 * Style helpers and state-variable definitions shared by renderable components.
 *
 * This module maintains default style presets, merges style definitions from
 * setup children, and provides text-friendly style descriptions.
 */

type StyleAttributes = Record<string, { componentType: string }>;

type StyleDefinitionValue = string | number;

type StyleDefinitionKey =
    | "lineColor"
    | "lineColorWord"
    | "lineColorDarkMode"
    | "lineColorWordDarkMode"
    | "lineOpacity"
    | "lineWidth"
    | "lineWidthWord"
    | "lineStyle"
    | "lineStyleWord"
    | "markerColor"
    | "markerColorWord"
    | "markerColorDarkMode"
    | "markerColorWordDarkMode"
    | "markerOpacity"
    | "markerStyle"
    | "markerStyleWord"
    | "markerSize"
    | "fillColor"
    | "fillColorWord"
    | "fillColorDarkMode"
    | "fillColorWordDarkMode"
    | "fillOpacity"
    | "textColor"
    | "textColorWord"
    | "textColorDarkMode"
    | "textColorWordDarkMode"
    | "highContrastColor"
    | "highContrastColorWord"
    | "highContrastColorDarkMode"
    | "highContrastColorWordDarkMode"
    | "backgroundColor"
    | "backgroundColorWord"
    | "backgroundColorDarkMode"
    | "backgroundColorWordDarkMode";

type StyleDefinition = Partial<
    Record<StyleDefinitionKey, StyleDefinitionValue>
>;

type StateVariableDefinitions = Record<string, any>;

type StyleDefinitions = Record<string, StyleDefinition>;

/** Public style attributes that can be applied to components. */
export let styleAttributes: StyleAttributes = {
    lineColor: { componentType: "text" },
    lineColorWord: { componentType: "text" },
    lineColorDarkMode: { componentType: "text" },
    lineColorWordDarkMode: { componentType: "text" },
    lineOpacity: { componentType: "number" },
    lineWidth: { componentType: "number" },
    lineWidthWord: { componentType: "text" },
    lineStyle: { componentType: "text" }, // solid, dashed, dotted
    lineStyleWord: { componentType: "text" },
    markerColor: { componentType: "text" },
    markerColorWord: { componentType: "text" },
    markerColorDarkMode: { componentType: "text" },
    markerColorWordDarkMode: { componentType: "text" },
    markerOpacity: { componentType: "number" },
    // marker styles: cross, circle, square, plus, diamond,
    // triangle (alias for triangleUp), triangleUp, triangleDown, triangleLeft, triangleRight
    markerStyle: { componentType: "text" },
    markerStyleWord: { componentType: "text" },
    markerSize: { componentType: "number" },
    fillColor: { componentType: "text" },
    fillColorWord: { componentType: "text" },
    fillColorDarkMode: { componentType: "text" },
    fillColorWordDarkMode: { componentType: "text" },
    fillOpacity: { componentType: "number" },
    textColor: { componentType: "text" },
    textColorWord: { componentType: "text" },
    textColorDarkMode: { componentType: "text" },
    textColorWordDarkMode: { componentType: "text" },
    highContrastColor: { componentType: "text" },
    highContrastColorWord: { componentType: "text" },
    highContrastColorDarkMode: { componentType: "text" },
    highContrastColorWordDarkMode: { componentType: "text" },
    backgroundColor: { componentType: "text" },
    backgroundColorWord: { componentType: "text" },
    backgroundColorDarkMode: { componentType: "text" },
    backgroundColorWordDarkMode: { componentType: "text" },
};

/**
 * Baseline style used when a style number references no explicit definition.
 *
 * Color words are intentionally omitted here and injected on demand so there is
 * one source of truth for color values.
 */
let defaultStyle: StyleDefinition = {
    lineColor: "#648FFF",
    lineColorDarkMode: "#648FFF",
    lineOpacity: 0.7,
    lineWidth: 4,
    lineWidthWord: "thick",
    lineStyle: "solid",
    lineStyleWord: "",
    markerColor: "#648FFF",
    markerColorDarkMode: "#648FFF",
    markerOpacity: 0.7,
    markerStyle: "circle",
    markerStyleWord: "point",
    markerSize: 5,
    fillColor: "#648FFF",
    fillColorDarkMode: "#648FFF",
    fillOpacity: 0.3,
    textColor: "black",
    textColorDarkMode: "white",
    highContrastColor: "#2963FF",
    highContrastColorDarkMode: "#2963FF",
};

const coloredItemsForWords = [
    "line",
    "marker",
    "fill",
    "text",
    "highContrast",
    "background",
] as const;

/**
 * Adds missing color-word fields (light and dark mode) derived from color values.
 * Existing word values are preserved.
 */
function addMissingColorWordsToStyleDefinition(
    styleDef: StyleDefinition,
): StyleDefinition {
    for (const item of coloredItemsForWords) {
        const colorKey = `${item}Color` as StyleDefinitionKey;
        const colorWordKey = `${colorKey}Word` as StyleDefinitionKey;
        const darkKey = `${colorKey}DarkMode` as StyleDefinitionKey;
        const darkWordKey = `${colorWordKey}DarkMode` as StyleDefinitionKey;

        const colorValue = styleDef[colorKey];
        if (!(colorWordKey in styleDef) && typeof colorValue === "string") {
            styleDef[colorWordKey] = colorValueToWord(colorValue);
        }

        const darkColorValue = styleDef[darkKey];
        if (!(darkWordKey in styleDef) && typeof darkColorValue === "string") {
            styleDef[darkWordKey] = colorValueToWord(darkColorValue);
        }
    }

    return styleDef;
}

/** Applies missing color-word enrichment to an entire style-definition map. */
function addMissingColorWordsToStyleDefinitions(
    styleDefinitions: StyleDefinitions,
): StyleDefinitions {
    for (const styleDef of Object.values(styleDefinitions)) {
        addMissingColorWordsToStyleDefinition(styleDef);
    }

    return styleDefinitions;
}

/**
 * Returns built-in style presets used when no ancestor style definitions exist.
 *
 * Preset color-word fields are injected in a second pass from the corresponding
 * color values.
 */
function returnDefaultStyleDefinitions(): StyleDefinitions {
    return addMissingColorWordsToStyleDefinitions({
        1: {
            lineColor: "#648FFF",
            lineColorDarkMode: "#648FFF",
            lineOpacity: 0.7,
            lineWidth: 4,
            lineWidthWord: "thick",
            lineStyle: "solid",
            lineStyleWord: "",
            markerColor: "#648FFF",
            markerColorDarkMode: "#648FFF",
            markerOpacity: 0.7,
            markerStyle: "circle",
            markerStyleWord: "point",
            markerSize: 5,
            fillColor: "#648FFF",
            fillColorDarkMode: "#648FFF",
            fillOpacity: 0.3,
            textColor: "black",
            textColorDarkMode: "white",
            highContrastColor: "#2963FF",
            highContrastColorDarkMode: "#2963FF",
        },
        2: {
            lineColor: "#D4042D",
            lineColorDarkMode: "#D4042D",
            lineOpacity: 0.7,
            lineWidth: 2,
            lineWidthWord: "",
            lineStyle: "solid",
            lineStyleWord: "",
            markerColor: "#D4042D",
            markerColorDarkMode: "#D4042D",
            markerOpacity: 0.7,
            markerStyle: "square",
            markerStyleWord: "square",
            markerSize: 5,
            fillColor: "#D4042D",
            fillColorDarkMode: "#D4042D",
            fillOpacity: 0.3,
            textColor: "#D4042D",
            textColorDarkMode: "#D4042D",
            highContrastColor: "#D4042D",
            highContrastColorDarkMode: "#D4042D",
        },
        3: {
            lineColor: "#F19143",
            lineColorDarkMode: "#F19143",
            lineOpacity: 0.7,
            lineWidth: 3,
            lineWidthWord: "",
            lineStyle: "solid",
            lineStyleWord: "",
            markerColor: "#F19143",
            markerColorDarkMode: "#F19143",
            markerOpacity: 0.7,
            markerStyle: "triangle",
            markerStyleWord: "triangle",
            markerSize: 5,
            fillColor: "#F19143",
            fillColorDarkMode: "#F19143",
            fillOpacity: 0.3,
            textColor: "#BE5A0E",
            textColorDarkMode: "#BE5A0E",
            highContrastColor: "#BE5A0E",
            highContrastColorDarkMode: "#BE5A0E",
        },
        4: {
            lineColor: "#644CD6",
            lineColorDarkMode: "#644CD6",
            lineOpacity: 0.7,
            lineWidth: 2,
            lineWidthWord: "",
            lineStyle: "solid",
            lineStyleWord: "",
            markerColor: "#644CD6",
            markerColorDarkMode: "#644CD6",
            markerOpacity: 0.7,
            markerStyle: "diamond",
            markerStyleWord: "diamond",
            markerSize: 5,
            fillColor: "#644CD6",
            fillColorDarkMode: "#644CD6",
            fillOpacity: 0.3,
            textColor: "#644CD6",
            textColorDarkMode: "#644CD6",
            highContrastColor: "#644CD6",
            highContrastColorDarkMode: "#644CD6",
        },
        5: {
            lineColor: "black",
            lineColorDarkMode: "white",
            lineOpacity: 1,
            lineWidth: 1,
            lineWidthWord: "thin",
            lineStyle: "solid",
            lineStyleWord: "",
            markerColor: "black",
            markerColorDarkMode: "white",
            markerOpacity: 1,
            markerStyle: "circle",
            markerStyleWord: "point",
            markerSize: 5,
            fillColor: "black",
            fillColorDarkMode: "white",
            fillOpacity: 0.7,
            textColor: "black",
            textColorDarkMode: "white",
            highContrastColor: "black",
            highContrastColorDarkMode: "black",
        },
        6: {
            lineColor: "gray",
            lineColorDarkMode: "gray",
            lineOpacity: 0.7,
            lineWidth: 1,
            lineWidthWord: "thin",
            lineStyle: "dotted",
            lineStyleWord: "dotted",
            markerColor: "gray",
            markerColorDarkMode: "gray",
            markerOpacity: 0.7,
            markerStyle: "circle",
            markerStyleWord: "point",
            markerSize: 5,
            fillColor: "gray",
            fillColorDarkMode: "gray",
            fillOpacity: 0.3,
            textColor: "#757575",
            textColorDarkMode: "#757575",
            highContrastColor: "#757575",
            highContrastColorDarkMode: "#757575",
        },
    });
}

/**
 * State-variable definitions that construct merged `styleDefinitions` from:
 * - ancestor defaults,
 * - local styleDefinition children,
 * - setup descendants.
 */
export function returnStyleDefinitionStateVariables(): StateVariableDefinitions {
    let stateVariableDefinitions: StateVariableDefinitions = {};

    stateVariableDefinitions.setupChildren = {
        returnDependencies: () => ({
            setupChildren: {
                dependencyType: "child",
                childGroups: ["setups"],
                proceedIfAllChildrenNotMatched: true,
            },
        }),
        definition({ dependencyValues }: { dependencyValues: any }) {
            return {
                setValue: { setupChildren: dependencyValues.setupChildren },
            };
        },
    };

    stateVariableDefinitions.styleDefinitions = {
        stateVariablesDeterminingDependencies: ["setupChildren"],
        returnDependencies({ stateValues }: { stateValues: any }) {
            let dependencies: Record<string, any> = {
                ancestorWithStyle: {
                    dependencyType: "ancestor",
                    variableNames: ["styleDefinitions"],
                },
                styleDefinitionSetupChildren: {
                    dependencyType: "child",
                    childGroups: ["styleDefinitions", "setups"],
                    variableNames: ["styleNumber", "styleDefinition"],
                    variablesOptional: true,
                    proceedIfAllChildrenNotMatched: true,
                },
            };

            for (let setupChild of stateValues.setupChildren) {
                dependencies[`styleDefinitionsOf${setupChild.componentIdx}`] = {
                    dependencyType: "child",
                    parentIdx: setupChild.componentIdx,
                    childGroups: ["styleDefinitions"],
                    variableNames: ["styleNumber", "styleDefinition"],
                };
            }

            return dependencies;
        },
        definition({ dependencyValues }: { dependencyValues: any }) {
            const styleDefinitions: StyleDefinitions = {};

            let startingStateVariableDefinitions: StyleDefinitions | undefined;

            if (dependencyValues.ancestorWithStyle) {
                startingStateVariableDefinitions =
                    dependencyValues.ancestorWithStyle.stateValues
                        .styleDefinitions;
            }

            if (!startingStateVariableDefinitions) {
                startingStateVariableDefinitions =
                    returnDefaultStyleDefinitions();
            }

            for (const styleNumber in startingStateVariableDefinitions) {
                styleDefinitions[styleNumber] = Object.assign(
                    {},
                    startingStateVariableDefinitions[styleNumber],
                );
            }

            const styleDefinitionChildren = [] as any[];
            for (let child of dependencyValues.styleDefinitionSetupChildren) {
                if (child.componentType === "setup") {
                    styleDefinitionChildren.push(
                        ...dependencyValues[
                            `styleDefinitionsOf${child.componentIdx}`
                        ],
                    );
                } else {
                    styleDefinitionChildren.push(child);
                }
            }

            const coloredItems = [
                "marker",
                "line",
                "fill",
                "text",
                "background",
            ] as const;
            const widthItems = ["line"] as const;
            const lineStyleItems = ["line"] as const;

            for (const child of styleDefinitionChildren) {
                const styleNumber = child.stateValues.styleNumber;
                let styleDef = styleDefinitions[styleNumber];

                if (!styleDef) {
                    styleDef = styleDefinitions[styleNumber] =
                        addMissingColorWordsToStyleDefinition(
                            Object.assign({}, defaultStyle),
                        );
                }

                const theNewDef = Object.assign(
                    {},
                    child.stateValues.styleDefinition,
                );

                for (const item of coloredItems) {
                    const colorKey = `${item}Color` as StyleDefinitionKey;
                    const colorWordKey =
                        `${colorKey}Word` as StyleDefinitionKey;
                    const darkKey = `${colorKey}DarkMode` as StyleDefinitionKey;
                    const darkWordKey =
                        `${colorWordKey}DarkMode` as StyleDefinitionKey;

                    if (colorKey in theNewDef && !(colorWordKey in theNewDef)) {
                        const colorValue = theNewDef[colorKey];
                        if (typeof colorValue === "string") {
                            theNewDef[colorWordKey] =
                                colorValueToWord(colorValue);
                        }
                    }
                    if (darkKey in theNewDef && !(darkWordKey in theNewDef)) {
                        const darkValue = theNewDef[darkKey];
                        if (typeof darkValue === "string") {
                            theNewDef[darkWordKey] =
                                colorValueToWord(darkValue);
                        }
                    }
                    if (colorKey in theNewDef && !(darkKey in theNewDef)) {
                        theNewDef[darkKey] = theNewDef[colorKey];
                        theNewDef[darkWordKey] = theNewDef[colorWordKey];
                    }
                }

                for (const item of widthItems) {
                    const widthKey = `${item}Width` as StyleDefinitionKey;
                    const widthWordKey =
                        `${widthKey}Word` as StyleDefinitionKey;

                    if (widthKey in theNewDef && !(widthWordKey in theNewDef)) {
                        const widthValue = theNewDef[widthKey];
                        if (typeof widthValue !== "number") {
                            continue;
                        }

                        if (widthValue >= 4) {
                            theNewDef[widthWordKey] = "thick";
                        } else if (widthValue <= 1) {
                            theNewDef[widthWordKey] = "thin";
                        } else {
                            theNewDef[widthWordKey] = "";
                        }
                    }
                }

                for (const item of lineStyleItems) {
                    const styleKey = `${item}Style` as StyleDefinitionKey;
                    const styleWordKey =
                        `${styleKey}Word` as StyleDefinitionKey;

                    if (styleKey in theNewDef && !(styleWordKey in theNewDef)) {
                        const lineStyle = theNewDef[styleKey];

                        if (lineStyle === "dashed") {
                            theNewDef[styleWordKey] = "dashed";
                        } else if (lineStyle === "dotted") {
                            theNewDef[styleWordKey] = "dotted";
                        } else {
                            theNewDef[styleWordKey] = "";
                        }
                    }
                }

                if (
                    "markerStyle" in theNewDef &&
                    !("markerStyleWord" in theNewDef)
                ) {
                    if (typeof theNewDef.markerStyle === "string") {
                        theNewDef.markerStyleWord = theNewDef.markerStyle;
                    }

                    if (theNewDef.markerStyleWord === "circle") {
                        theNewDef.markerStyleWord = "point";
                    } else if (
                        typeof theNewDef.markerStyleWord === "string" &&
                        theNewDef.markerStyleWord.slice(0, 8) === "triangle"
                    ) {
                        theNewDef.markerStyleWord = "triangle";
                    }
                }

                Object.assign(styleDef, theNewDef);
            }

            return { setValue: { styleDefinitions } };
        },
    };

    return stateVariableDefinitions;
}

/**
 * State-variable definition that resolves the currently selected style object.
 */
export function returnSelectedStyleStateVariableDefinition(): StateVariableDefinitions {
    return {
        selectedStyle: {
            forRenderer: true,
            willNeverBeEssential: true,
            returnDependencies: () => ({
                styleNumber: {
                    dependencyType: "stateVariable",
                    variableName: "styleNumber",
                },
                ancestorWithStyle: {
                    dependencyType: "ancestor",
                    variableNames: ["styleDefinitions"],
                },
            }),
            definition: function ({
                dependencyValues,
            }: {
                dependencyValues: any;
            }) {
                let styleDefinitions =
                    dependencyValues.ancestorWithStyle.stateValues
                        .styleDefinitions;
                if (!styleDefinitions) {
                    styleDefinitions = returnDefaultStyleDefinitions();
                }

                let selectedStyle =
                    styleDefinitions[dependencyValues.styleNumber];

                if (selectedStyle === undefined) {
                    selectedStyle = addMissingColorWordsToStyleDefinition(
                        Object.assign({}, defaultStyle),
                    );
                }
                return { setValue: { selectedStyle } };
            },
        },
    };
}

/**
 * State-variable definitions used to produce human-readable text style strings
 * (e.g. text color and optional background color description).
 */
export function returnTextStyleDescriptionDefinitions(): StateVariableDefinitions {
    return {
        textColor: {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                selectedStyle: {
                    dependencyType: "stateVariable",
                    variableName: "selectedStyle",
                },
                document: {
                    dependencyType: "ancestor",
                    componentType: "document",
                    variableNames: ["theme"],
                },
            }),
            definition: function ({
                dependencyValues,
            }: {
                dependencyValues: any;
            }) {
                let selectedStyle = dependencyValues.selectedStyle;

                let textColorWord;
                if (dependencyValues.document?.stateValues.theme === "dark") {
                    textColorWord = selectedStyle.textColorWordDarkMode;
                } else {
                    textColorWord = selectedStyle.textColorWord;
                }

                return { setValue: { textColor: textColorWord } };
            },
        },

        backgroundColor: {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                selectedStyle: {
                    dependencyType: "stateVariable",
                    variableName: "selectedStyle",
                },
                document: {
                    dependencyType: "ancestor",
                    componentType: "document",
                    variableNames: ["theme"],
                },
            }),
            definition: function ({
                dependencyValues,
            }: {
                dependencyValues: any;
            }) {
                let selectedStyle = dependencyValues.selectedStyle;

                let backgroundColorWord;
                if (dependencyValues.document?.stateValues.theme === "dark") {
                    backgroundColorWord =
                        selectedStyle.backgroundColorWordDarkMode;
                } else {
                    backgroundColorWord = selectedStyle.backgroundColorWord;
                }

                if (!backgroundColorWord) {
                    backgroundColorWord = "none";
                }

                return { setValue: { backgroundColor: backgroundColorWord } };
            },
        },

        textStyleDescription: {
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: () => ({
                textColor: {
                    dependencyType: "stateVariable",
                    variableName: "textColor",
                },
                backgroundColor: {
                    dependencyType: "stateVariable",
                    variableName: "backgroundColor",
                },
            }),
            definition: function ({
                dependencyValues,
            }: {
                dependencyValues: any;
            }) {
                let textStyleDescription = dependencyValues.textColor;

                if (dependencyValues.backgroundColor !== "none") {
                    textStyleDescription += ` with a ${dependencyValues.backgroundColor} background`;
                }

                return { setValue: { textStyleDescription } };
            },
        },
    };
}

/**
 * Produces renderer-ready text style CSS properties based on active theme mode.
 */
export function textRendererStyle(
    darkMode: "dark" | "light",
    selectedStyle: any,
): { color: string; backgroundColor?: string } {
    let textColor =
        darkMode === "dark"
            ? selectedStyle.textColorDarkMode
            : selectedStyle.textColor;
    let backgroundColor =
        darkMode === "dark"
            ? selectedStyle.backgroundColorDarkMode
            : selectedStyle.backgroundColor;
    let style: { color: string; backgroundColor?: string } = {
        color: textColor,
    };
    if (backgroundColor) {
        style.backgroundColor = backgroundColor;
    }
    return style;
}
