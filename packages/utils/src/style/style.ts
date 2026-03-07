import { colorValueToWord } from "./colorWords";
import {
    getStyleValueNumber,
    getStyleValueString,
    normalizeStyleDefinitionValues,
    normalizeStyleDefinitionsValues,
    setStyleValue,
    unwrapStyleDefinition,
    type RawStyleDefinition,
    type StyleAttributes,
    type StyleDefinition,
    type StyleDefinitionKey,
    type StyleDefinitions,
} from "./styleDefinitionHelpers";
import { contrastWarningsForStyleDefinitions } from "./styleContrastWarnings";

/**
 * Style helpers and state-variable definitions shared by renderable components.
 *
 * This module maintains default style presets, merges style definitions from
 * setup children, and provides text-friendly style descriptions.
 */

type StateVariableDefinitions = Record<string, any>;

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
let defaultStyle: RawStyleDefinition = {
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

        const colorValue = getStyleValueString(styleDef, colorKey);
        if (!(colorWordKey in styleDef) && colorValue) {
            setStyleValue(styleDef, colorWordKey, colorValueToWord(colorValue));
        }

        const darkColorValue = getStyleValueString(styleDef, darkKey);
        if (!(darkWordKey in styleDef) && darkColorValue) {
            setStyleValue(
                styleDef,
                darkWordKey,
                colorValueToWord(darkColorValue),
            );
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
 * Clones the baseline default style and enriches it with any missing color words.
 */
function cloneDefaultStyleWithMissingColorWords(): StyleDefinition {
    return addMissingColorWordsToStyleDefinition(
        normalizeStyleDefinitionValues(Object.assign({}, defaultStyle)),
    );
}

/**
 * For selected color items, adds missing dark-mode color values (mirroring light mode)
 * and color-word fields without overwriting authored word overrides.
 */
function addMissingChildStyleColorFields(
    styleDef: StyleDefinition,
): StyleDefinition {
    for (const item of coloredItemsForWords) {
        const colorKey = `${item}Color` as StyleDefinitionKey;
        const colorWordKey = `${colorKey}Word` as StyleDefinitionKey;
        const darkKey = `${colorKey}DarkMode` as StyleDefinitionKey;
        const darkWordKey = `${colorWordKey}DarkMode` as StyleDefinitionKey;

        if (colorKey in styleDef && !(darkKey in styleDef)) {
            const colorValue = styleDef[colorKey]?.style;
            if (colorValue !== undefined) {
                const colorPosition = styleDef[colorKey]?.position;
                setStyleValue(styleDef, darkKey, colorValue, colorPosition);
            }

            if (colorWordKey in styleDef && !(darkWordKey in styleDef)) {
                const wordValue = styleDef[colorWordKey]?.style;
                if (typeof wordValue === "string") {
                    const wordPosition = styleDef[colorWordKey]?.position;
                    setStyleValue(
                        styleDef,
                        darkWordKey,
                        wordValue,
                        wordPosition,
                    );
                }
            }
        }
    }

    return addMissingColorWordsToStyleDefinition(styleDef);
}

/**
 * Returns built-in style presets used when no ancestor style definitions exist.
 *
 * Preset color-word fields are injected in a second pass from the corresponding
 * color values.
 */
function returnDefaultStyleDefinitions(): StyleDefinitions {
    return addMissingColorWordsToStyleDefinitions(
        normalizeStyleDefinitionsValues({
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
        }),
    );
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
        mustEvaluate: true,
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
                styleDefinitions[styleNumber] = normalizeStyleDefinitionValues(
                    Object.assign(
                        {},
                        startingStateVariableDefinitions[styleNumber],
                    ),
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

            const widthItems = ["line"] as const;
            const lineStyleItems = ["line"] as const;

            for (const child of styleDefinitionChildren) {
                const styleNumber = child.stateValues.styleNumber;
                let styleDef = styleDefinitions[styleNumber];

                if (!styleDef) {
                    styleDef = styleDefinitions[styleNumber] =
                        cloneDefaultStyleWithMissingColorWords();
                }

                const theNewDef = normalizeStyleDefinitionValues(
                    Object.assign({}, child.stateValues.styleDefinition),
                );

                if (child.position) {
                    for (const key in theNewDef) {
                        const typedKey = key as StyleDefinitionKey;
                        const value = theNewDef[typedKey];
                        if (!value) {
                            continue;
                        }

                        if (value.position === undefined) {
                            value.position = child.position;
                        }
                    }
                }

                addMissingChildStyleColorFields(theNewDef);

                for (const item of widthItems) {
                    const widthKey = `${item}Width` as StyleDefinitionKey;
                    const widthWordKey =
                        `${widthKey}Word` as StyleDefinitionKey;

                    if (widthKey in theNewDef && !(widthWordKey in theNewDef)) {
                        const widthValue = getStyleValueNumber(
                            theNewDef,
                            widthKey,
                        );
                        if (widthValue === undefined) {
                            continue;
                        }

                        const widthPosition = theNewDef[widthKey]?.position;

                        if (widthValue >= 4) {
                            setStyleValue(
                                theNewDef,
                                widthWordKey,
                                "thick",
                                widthPosition,
                            );
                        } else if (widthValue <= 1) {
                            setStyleValue(
                                theNewDef,
                                widthWordKey,
                                "thin",
                                widthPosition,
                            );
                        } else {
                            setStyleValue(
                                theNewDef,
                                widthWordKey,
                                "",
                                widthPosition,
                            );
                        }
                    }
                }

                for (const item of lineStyleItems) {
                    const styleKey = `${item}Style` as StyleDefinitionKey;
                    const styleWordKey =
                        `${styleKey}Word` as StyleDefinitionKey;

                    if (styleKey in theNewDef && !(styleWordKey in theNewDef)) {
                        const lineStyle = getStyleValueString(
                            theNewDef,
                            styleKey,
                        );
                        if (!lineStyle) {
                            continue;
                        }

                        const lineStylePosition = theNewDef[styleKey]?.position;

                        if (lineStyle === "dashed") {
                            setStyleValue(
                                theNewDef,
                                styleWordKey,
                                "dashed",
                                lineStylePosition,
                            );
                        } else if (lineStyle === "dotted") {
                            setStyleValue(
                                theNewDef,
                                styleWordKey,
                                "dotted",
                                lineStylePosition,
                            );
                        } else {
                            setStyleValue(
                                theNewDef,
                                styleWordKey,
                                "",
                                lineStylePosition,
                            );
                        }
                    }
                }

                if (
                    "markerStyle" in theNewDef &&
                    !("markerStyleWord" in theNewDef)
                ) {
                    const markerStyle = getStyleValueString(
                        theNewDef,
                        "markerStyle",
                    );
                    const markerStylePosition = theNewDef.markerStyle?.position;

                    if (markerStyle) {
                        setStyleValue(
                            theNewDef,
                            "markerStyleWord",
                            markerStyle,
                            markerStylePosition,
                        );
                    }

                    const markerStyleWord = getStyleValueString(
                        theNewDef,
                        "markerStyleWord",
                    );

                    if (markerStyleWord === "circle") {
                        setStyleValue(
                            theNewDef,
                            "markerStyleWord",
                            "point",
                            markerStylePosition,
                        );
                    } else if (
                        markerStyleWord &&
                        markerStyleWord.slice(0, 8) === "triangle"
                    ) {
                        setStyleValue(
                            theNewDef,
                            "markerStyleWord",
                            "triangle",
                            markerStylePosition,
                        );
                    }
                }

                Object.assign(styleDef, theNewDef);
            }

            const warnings =
                contrastWarningsForStyleDefinitions(styleDefinitions);

            return { setValue: { styleDefinitions }, sendWarnings: warnings };
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
                    selectedStyle = cloneDefaultStyleWithMissingColorWords();
                }

                return {
                    setValue: {
                        selectedStyle: unwrapStyleDefinition(selectedStyle),
                    },
                };
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
