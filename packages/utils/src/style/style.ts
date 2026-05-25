import { colorValueToWord } from "./colorWords";
import {
    DEFAULT_STYLE_VALUES,
    getStyleValueNumber,
    getStyleValueString,
    normalizeStyleDefinitionValues,
    normalizeStyleDefinitionsValues,
    resolveStyleDefinition,
    setStyleValue,
    unwrapStyleDefinition,
    type RawStyleDefinition,
    type StyleAttributes,
    type StyleDefinition,
    type StyleDefinitionKey,
    type StyleDefinitions,
} from "./styleDefinitionHelpers";
import { contrastAccessibilityDiagnosticsForStyleDefinitions } from "./styleContrastAccessibility";

/**
 * Style helpers and state-variable definitions shared by renderable components.
 *
 * This module maintains default style presets, merges style definitions from
 * setup children, and provides text-friendly style descriptions.
 */

type StateVariableDefinitions = Record<string, any>;

/** Public style attributes that can be applied to components. */
export let styleAttributes: StyleAttributes = {
    lineColor: {
        componentType: "text",
        description: "Color used for line strokes (light mode).",
    },
    lineColorWord: {
        componentType: "text",
        description: "Human-readable name of the line color (light mode).",
    },
    lineColorDarkMode: {
        componentType: "text",
        description: "Color used for line strokes (dark mode).",
    },
    lineColorWordDarkMode: {
        componentType: "text",
        description: "Human-readable name of the line color (dark mode).",
    },
    lineOpacity: {
        componentType: "number",
        description: "Opacity of line strokes, 0 to 1.",
    },
    lineWidth: {
        componentType: "number",
        description: "Stroke width for lines, in pixels.",
    },
    lineWidthWord: {
        componentType: "text",
        description: "Human-readable name of the line width.",
    },
    lineStyle: {
        componentType: "text",
        description: "Stroke style for lines (e.g. solid, dashed, dotted).",
    },
    lineStyleWord: {
        componentType: "text",
        description: "Human-readable name of the line style.",
    },
    markerColor: {
        componentType: "text",
        description: "Color used for markers/points (light mode).",
    },
    markerColorWord: {
        componentType: "text",
        description: "Human-readable name of the marker color (light mode).",
    },
    markerColorDarkMode: {
        componentType: "text",
        description: "Color used for markers/points (dark mode).",
    },
    markerColorWordDarkMode: {
        componentType: "text",
        description: "Human-readable name of the marker color (dark mode).",
    },
    markerOpacity: {
        componentType: "number",
        description: "Opacity of markers/points, 0 to 1.",
    },
    markerStyle: {
        componentType: "text",
        description:
            "Marker shape (e.g. cross, circle, square, plus, diamond, triangle).",
    },
    markerStyleWord: {
        componentType: "text",
        description: "Human-readable name of the marker style.",
    },
    markerSize: {
        componentType: "number",
        description: "Marker size in pixels.",
    },
    fillColor: {
        componentType: "text",
        description: "Fill color used inside closed shapes (light mode).",
    },
    fillColorWord: {
        componentType: "text",
        description: "Human-readable name of the fill color (light mode).",
    },
    fillColorDarkMode: {
        componentType: "text",
        description: "Fill color used inside closed shapes (dark mode).",
    },
    fillColorWordDarkMode: {
        componentType: "text",
        description: "Human-readable name of the fill color (dark mode).",
    },
    fillOpacity: {
        componentType: "number",
        description: "Opacity of fills, 0 to 1.",
    },
    textColor: {
        componentType: "text",
        description: "Text color (light mode).",
    },
    textColorWord: {
        componentType: "text",
        description: "Human-readable name of the text color (light mode).",
    },
    textColorDarkMode: {
        componentType: "text",
        description: "Text color (dark mode).",
    },
    textColorWordDarkMode: {
        componentType: "text",
        description: "Human-readable name of the text color (dark mode).",
    },
    highContrastColor: {
        componentType: "text",
        description: "High-contrast accent color (light mode).",
    },
    highContrastColorWord: {
        componentType: "text",
        description:
            "Human-readable name of the high-contrast accent color (light mode).",
    },
    highContrastColorDarkMode: {
        componentType: "text",
        description: "High-contrast accent color (dark mode).",
    },
    highContrastColorWordDarkMode: {
        componentType: "text",
        description:
            "Human-readable name of the high-contrast accent color (dark mode).",
    },
    backgroundColor: {
        componentType: "text",
        description: "Background color (light mode).",
    },
    backgroundColorWord: {
        componentType: "text",
        description:
            "Human-readable name of the background color (light mode).",
    },
    backgroundColorDarkMode: {
        componentType: "text",
        description: "Background color (dark mode).",
    },
    backgroundColorWordDarkMode: {
        componentType: "text",
        description: "Human-readable name of the background color (dark mode).",
    },
};

/**
 * Style-attribute keys that may be overridden directly on a component (e.g.
 * `<point markerStyle="square">`). Color and color-word keys are intentionally
 * excluded — color authoring stays exclusive to `<styleDefinition>` so the
 * per-styleNumber WCAG contrast diagnostics remain authoritative.
 */
const STYLE_OVERRIDE_KEYS = [
    "lineOpacity",
    "lineWidth",
    "lineWidthWord",
    "lineStyle",
    "lineStyleWord",
    "markerOpacity",
    "markerStyle",
    "markerStyleWord",
    "markerSize",
    "fillOpacity",
] as const satisfies readonly StyleDefinitionKey[];

/**
 * Subset of {@link styleAttributes} exposed as per-component override attributes
 * on graphical components. Single source of truth so the GraphicalComponent
 * attribute list stays in lockstep with the dependencies wired into
 * {@link returnSelectedStyleStateVariableDefinition}.
 */
export const styleOverrideAttributes: StyleAttributes = Object.fromEntries(
    STYLE_OVERRIDE_KEYS.map((key) => [key, styleAttributes[key]]),
);

/**
 * Baseline style used when a style number references no explicit definition.
 *
 * Color words are intentionally omitted here and injected on demand so there is
 * one source of truth for color values.
 */
let defaultStyle: RawStyleDefinition = { ...DEFAULT_STYLE_VALUES };

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
 * Fills any missing `*Word` descriptor fields derivable from the corresponding
 * underlying values on `styleDef`. Authored words are preserved.
 *
 * Derivations:
 * - `lineWidth` (number) → `lineWidthWord`: `"thick"` (>=4), `"thin"` (<=1),
 *   else `""`.
 * - `lineStyle` (text) → `lineStyleWord`: `"dashed"`, `"dotted"`, else `""`.
 * - `markerStyle` (text) → `markerStyleWord`: copies the value, then normalizes
 *   `"circle"` → `"point"` and any `"triangle*"` → `"triangle"`.
 *
 * Used both by the styleDefinitions-merge path and by the per-component
 * override path so the two share identical word-derivation rules.
 */
function deriveMissingStyleWords(styleDef: StyleDefinition): void {
    const widthItems = ["line"] as const;
    for (const item of widthItems) {
        const widthKey = `${item}Width` as StyleDefinitionKey;
        const widthWordKey = `${widthKey}Word` as StyleDefinitionKey;

        if (widthKey in styleDef && !(widthWordKey in styleDef)) {
            const widthValue = getStyleValueNumber(styleDef, widthKey);
            if (widthValue === undefined) {
                continue;
            }

            const widthPosition = styleDef[widthKey]?.position;
            const word =
                widthValue >= 4 ? "thick" : widthValue <= 1 ? "thin" : "";
            setStyleValue(styleDef, widthWordKey, word, widthPosition);
        }
    }

    const lineStyleItems = ["line"] as const;
    for (const item of lineStyleItems) {
        const styleKey = `${item}Style` as StyleDefinitionKey;
        const styleWordKey = `${styleKey}Word` as StyleDefinitionKey;

        if (styleKey in styleDef && !(styleWordKey in styleDef)) {
            const lineStyle = getStyleValueString(styleDef, styleKey);
            if (!lineStyle) {
                continue;
            }

            const lineStylePosition = styleDef[styleKey]?.position;
            const word =
                lineStyle === "dashed"
                    ? "dashed"
                    : lineStyle === "dotted"
                      ? "dotted"
                      : "";
            setStyleValue(styleDef, styleWordKey, word, lineStylePosition);
        }
    }

    if ("markerStyle" in styleDef && !("markerStyleWord" in styleDef)) {
        const markerStyle = getStyleValueString(styleDef, "markerStyle");
        const markerStylePosition = styleDef.markerStyle?.position;

        if (markerStyle) {
            setStyleValue(
                styleDef,
                "markerStyleWord",
                markerStyle,
                markerStylePosition,
            );
        }

        const markerStyleWord = getStyleValueString(
            styleDef,
            "markerStyleWord",
        );

        if (markerStyleWord === "circle") {
            setStyleValue(
                styleDef,
                "markerStyleWord",
                "point",
                markerStylePosition,
            );
        } else if (
            markerStyleWord &&
            markerStyleWord.slice(0, 8) === "triangle"
        ) {
            setStyleValue(
                styleDef,
                "markerStyleWord",
                "triangle",
                markerStylePosition,
            );
        }
    }
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
            1: { ...DEFAULT_STYLE_VALUES },
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
                deriveMissingStyleWords(theNewDef);

                Object.assign(styleDef, theNewDef);
            }

            const diagnostics =
                contrastAccessibilityDiagnosticsForStyleDefinitions(
                    styleDefinitions,
                );

            return {
                setValue: { styleDefinitions },
                sendDiagnostics: diagnostics,
            };
        },
    };

    return stateVariableDefinitions;
}

/**
 * State-variable definition that resolves the currently selected style object.
 *
 * When `overrideAttributeNames` is supplied, the returned `selectedStyle` also
 * depends on those attribute components on the host component and merges any
 * authored values on top of the styleNumber-based definition. The override
 * layer mirrors how `<styleDefinition>` attributes are read in
 * `StyleDefinitions.js`: string values are lowercased, source positions are
 * preserved, and missing `*Word` descriptors get re-derived from the underlying
 * value via {@link deriveMissingStyleWords}.
 *
 * Callers that don't opt in (the default) preserve today's behavior exactly —
 * `selectedStyle` is the unwrapped/resolved styleNumber lookup.
 */
export function returnSelectedStyleStateVariableDefinition(
    options: { overrideAttributeNames?: readonly string[] } = {},
): StateVariableDefinitions {
    const overrideAttributeNames = options.overrideAttributeNames ?? [];

    return {
        selectedStyle: {
            forRenderer: true,
            willNeverBeEssential: true,
            returnDependencies: () => {
                const dependencies: Record<string, any> = {
                    styleNumber: {
                        dependencyType: "stateVariable",
                        variableName: "styleNumber",
                    },
                    ancestorWithStyle: {
                        dependencyType: "ancestor",
                        variableNames: ["styleDefinitions"],
                    },
                };

                for (const name of overrideAttributeNames) {
                    dependencies[name] = {
                        dependencyType: "attributeComponent",
                        attributeName: name,
                        variableNames: ["value"],
                    };
                }

                return dependencies;
            },
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

                if (overrideAttributeNames.length > 0) {
                    const overrideStyleDef: StyleDefinition = {};
                    for (const name of overrideAttributeNames) {
                        const dep = dependencyValues[name];
                        if (dep == null) {
                            continue;
                        }

                        let value = dep.stateValues.value;
                        if (value === undefined || value === null) {
                            continue;
                        }
                        if (typeof value === "string") {
                            value = value.toLowerCase();
                        }

                        setStyleValue(
                            overrideStyleDef,
                            name as StyleDefinitionKey,
                            value,
                            dep.position,
                        );
                    }

                    if (Object.keys(overrideStyleDef).length > 0) {
                        // Derive `*Word` descriptors from override values
                        // before merging, so e.g. authored `lineWidth=2`
                        // produces `lineWidthWord="thin"` even when the
                        // inherited styleDefinition shipped a different word.
                        deriveMissingStyleWords(overrideStyleDef);
                        // Clone so we don't mutate the ancestor's styleDefinitions map.
                        selectedStyle = Object.assign(
                            {},
                            selectedStyle,
                            overrideStyleDef,
                        );
                    }
                }

                return {
                    setValue: {
                        selectedStyle: resolveStyleDefinition(
                            unwrapStyleDefinition(selectedStyle),
                        ),
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
            description:
                "Human-readable name for this component's text color, derived from the active style and theme.",
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
            description:
                "Human-readable name for this component's background color, derived from the active style and theme.",
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
            description:
                "Human-readable description of this component's text styling (color and any background color).",
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
