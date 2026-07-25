import {
    describeBorder,
    describeClosedShape,
    describeColor,
    describeFill,
    describeMarker,
    describeRegion,
    describeStrokedShape,
    describeText,
    noBackgroundWord,
    type NounKey,
    type NounSpec,
} from "./styleDescriptions";

/**
 * The `styleDescription` family of state variables, shared by every component
 * that has one.
 *
 * Before this, each of the fifteen-odd graphical components assembled its own
 * description by concatenation and then appended its noun, and the shapes that
 * subclass another (`triangle`, `rectangle`, `regularPolygon`) fixed up the
 * result by string replacement — `styleDescriptionWithNoun.replaceAll("polygon",
 * "triangle")`. None of that survives translation, and the duplication meant a
 * fix to one composition reached only the components that happened to share it.
 * A subclass now passes a different noun rather than rewriting the sentence.
 *
 * The descriptions are content, so they answer to the document's locale rather
 * than the reader's, and they stay *computed* — never essential — so that a
 * locale change recomputes them and no English is written into saved state.
 */
type StateVariableDefinitions = Record<string, any>;

/**
 * What a component's style description is built out of.
 *
 * - `stroke` — a line, ray, curve, vector: width, dash pattern, color.
 * - `marker` — a point, described by its color and drawn as its marker shape.
 * - `closedShape` — a circle or polygon, which may be filled and has a border.
 * - `region` — an area described by its fill color alone.
 */
export type StyleDescriptionKind =
    "stroke" | "marker" | "closedShape" | "region";

/** The noun a component's description names. */
export type StyleDescriptionNoun = NounKey | "regular-polygon";

/** The English word for a noun key, for the author-facing `description`s. */
function englishNoun(noun: StyleDescriptionNoun): string {
    return noun.split("-").join(" ");
}

/**
 * The dependencies every style description shares.
 *
 * `locale` rides along with `theme` on the document ancestor for the same
 * reason `theme` does: both change which words come out, and a nested
 * `<document lang>` has to be able to differ from the one around it. The
 * translator arrives as a factory rather than a translator so that it can be
 * built for whichever locale that ancestor resolved.
 */
function commonDependencies(): Record<string, any> {
    return {
        selectedStyle: {
            dependencyType: "stateVariable",
            variableName: "selectedStyle",
        },
        document: {
            dependencyType: "ancestor",
            componentType: "document",
            variableNames: ["theme", "locale"],
        },
        getTranslator: {
            dependencyType: "translator",
        },
    };
}

function translatorFor(dependencyValues: any) {
    return dependencyValues.getTranslator(
        dependencyValues.document?.stateValues.locale,
    );
}

/** The color word for one style item, in the theme currently in effect. */
function colorWord(
    dependencyValues: any,
    item: "line" | "marker" | "fill" | "text" | "background",
): string {
    const selectedStyle = dependencyValues.selectedStyle;
    return dependencyValues.document?.stateValues.theme === "dark"
        ? selectedStyle[`${item}ColorWordDarkMode`]
        : selectedStyle[`${item}ColorWord`];
}

function strokeWords(dependencyValues: any) {
    return {
        colorWord: colorWord(dependencyValues, "line"),
        lineWidthWord: dependencyValues.selectedStyle.lineWidthWord,
        lineStyleWord: dependencyValues.selectedStyle.lineStyleWord,
    };
}

function closedShapeWords(dependencyValues: any) {
    return {
        ...strokeWords(dependencyValues),
        fillColorWord: colorWord(dependencyValues, "fill"),
        fillStyleWord: dependencyValues.selectedStyle.fillStyleWord,
    };
}

function nounSpec(noun: StyleDescriptionNoun, dependencyValues: any): NounSpec {
    return noun === "regular-polygon"
        ? { key: noun, numSides: dependencyValues.numSides }
        : { key: noun };
}

/**
 * `styleDescription` and `styleDescriptionWithNoun` for a graphical component,
 * plus `borderStyleDescription` and `fillStyleDescription` for the shapes that
 * have an interior.
 *
 * @param kind How the description is composed.
 * @param noun The noun the description names. `"regular-polygon"` names the
 *   shape by its side count, so it also brings in a `numSides` dependency.
 */
export function returnGraphicalStyleDescriptionDefinitions({
    kind,
    noun,
}: {
    kind: StyleDescriptionKind;
    noun: StyleDescriptionNoun;
}): StateVariableDefinitions {
    const label = englishNoun(noun);

    function dependencies(): Record<string, any> {
        const deps = commonDependencies();
        if (kind === "closedShape") {
            deps.filled = {
                dependencyType: "stateVariable",
                variableName: "filled",
            };
        }
        if (noun === "regular-polygon") {
            deps.numSides = {
                dependencyType: "stateVariable",
                variableName: "numSides",
            };
        }
        return deps;
    }

    function describe(dependencyValues: any, withNoun: boolean): string {
        const t = translatorFor(dependencyValues);
        const spec = nounSpec(noun, dependencyValues);

        switch (kind) {
            case "marker":
                return describeMarker(
                    t,
                    {
                        markerColorWord: colorWord(dependencyValues, "marker"),
                        markerStyleWord:
                            dependencyValues.selectedStyle.markerStyleWord,
                    },
                    { withNoun },
                );
            case "closedShape":
                return describeClosedShape(
                    t,
                    closedShapeWords(dependencyValues),
                    {
                        filled: dependencyValues.filled,
                        noun: spec,
                        withNoun,
                    },
                );
            case "region":
                return describeRegion(
                    t,
                    { fillColorWord: colorWord(dependencyValues, "fill") },
                    { noun: spec, withNoun },
                );
            default:
                return describeStrokedShape(t, strokeWords(dependencyValues), {
                    noun: spec,
                    withNoun,
                });
        }
    }

    const definitions: StateVariableDefinitions = {
        styleDescription: {
            description: `A textual description of the ${label}'s style.`,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: dependencies,
            definition({ dependencyValues }: { dependencyValues: any }) {
                return {
                    setValue: {
                        styleDescription: describe(dependencyValues, false),
                    },
                };
            },
        },

        styleDescriptionWithNoun: {
            description: `Style description including the noun "${label}".`,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: dependencies,
            definition({ dependencyValues }: { dependencyValues: any }) {
                return {
                    setValue: {
                        styleDescriptionWithNoun: describe(
                            dependencyValues,
                            true,
                        ),
                    },
                };
            },
        },
    };

    if (kind === "closedShape") {
        definitions.borderStyleDescription = {
            description: `A textual description of the ${label}'s border style.`,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: dependencies,
            definition({ dependencyValues }: { dependencyValues: any }) {
                return {
                    setValue: {
                        borderStyleDescription: describeBorder(
                            translatorFor(dependencyValues),
                            strokeWords(dependencyValues),
                        ),
                    },
                };
            },
        };

        definitions.fillStyleDescription = {
            description: `A textual description of the ${label}'s fill style.`,
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: dependencies,
            definition({ dependencyValues }: { dependencyValues: any }) {
                return {
                    setValue: {
                        fillStyleDescription: describeFill(
                            translatorFor(dependencyValues),
                            {
                                fillColorWord: colorWord(
                                    dependencyValues,
                                    "fill",
                                ),
                                fillStyleWord:
                                    dependencyValues.selectedStyle
                                        .fillStyleWord,
                            },
                            { filled: dependencyValues.filled },
                        ),
                    },
                };
            },
        };
    }

    return definitions;
}

/**
 * State-variable definitions describing how a piece of text is styled: its
 * color, and the background drawn behind it.
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
            returnDependencies: commonDependencies,
            definition({ dependencyValues }: { dependencyValues: any }) {
                return {
                    setValue: {
                        textColor: describeColor(
                            translatorFor(dependencyValues),
                            colorWord(dependencyValues, "text"),
                            "text",
                        ),
                    },
                };
            },
        },

        backgroundColor: {
            description:
                "Human-readable name for this component's background color, derived from the active style and theme.",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            returnDependencies: commonDependencies,
            definition({ dependencyValues }: { dependencyValues: any }) {
                const t = translatorFor(dependencyValues);
                const word = colorWord(dependencyValues, "background");
                return {
                    setValue: {
                        backgroundColor: word
                            ? describeColor(t, word, "background")
                            : noBackgroundWord(t),
                    },
                };
            },
        },

        textStyleDescription: {
            description:
                "Human-readable description of this component's text styling (color and any background color).",
            public: true,
            shadowingInstructions: {
                createComponentOfType: "text",
            },
            // Reads the raw style rather than the two state variables above.
            // Whether a background exists has to be decided from the authored
            // word: `backgroundColor` answers "none" when there is none, and
            // that sentinel is itself translated.
            returnDependencies: commonDependencies,
            definition({ dependencyValues }: { dependencyValues: any }) {
                const t = translatorFor(dependencyValues);
                const backgroundWord = colorWord(
                    dependencyValues,
                    "background",
                );
                return {
                    setValue: {
                        textStyleDescription: describeText(t, {
                            color: describeColor(
                                t,
                                colorWord(dependencyValues, "text"),
                                "text",
                            ),
                            background: backgroundWord
                                ? describeColor(t, backgroundWord, "background")
                                : undefined,
                        }),
                    },
                };
            },
        },
    };
}
