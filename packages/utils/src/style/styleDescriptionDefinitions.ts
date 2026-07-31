import type { Translator } from "@doenet/i18n";

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
    type PhraseRole,
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
 *
 * The composition itself lives in `./styleDescriptions`; this module only wires
 * it to the core's dependency system.
 */

/** The shape of a component's state-variable definition table. */
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

/**
 * The English word for a noun key, for the author-facing `description`s.
 *
 * `split`/`join` rather than `replaceAll`, which this package's `lib` target
 * does not declare.
 */
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
 * The already-translated background color, or `undefined` when nothing is
 * drawn behind the text.
 *
 * Presence is decided from the authored word rather than by comparing against
 * what `backgroundColor` reports, because that "none" is itself translated.
 */
function backgroundDescription(
    t: Translator,
    dependencyValues: any,
    role: PhraseRole = "standalone",
): string | undefined {
    const word = colorWord(dependencyValues, "background");
    return word ? describeColor(t, word, "background", role) : undefined;
}

/**
 * One state variable of the `styleDescription` family.
 *
 * All seven of them are public `text` variables computed from the same
 * dependencies, differing only in the words they assemble, so the shape is
 * written once here rather than seven times.
 *
 * @param name The variable's name, which is also the key its definition sets.
 * @param description The author-facing description. Published in the schema,
 *   so it names the component's own noun.
 * @param returnDependencies Shared across a component's whole table, so that
 *   the component collects one set of dependencies rather than near-copies.
 * @param compute The words themselves.
 */
function textStateVariable(
    name: string,
    description: string,
    returnDependencies: () => Record<string, any>,
    compute: (dependencyValues: any) => string,
): Record<string, any> {
    return {
        description,
        public: true,
        shadowingInstructions: {
            createComponentOfType: "text",
        },
        returnDependencies,
        definition({ dependencyValues }: { dependencyValues: any }) {
            return { setValue: { [name]: compute(dependencyValues) } };
        },
    };
}

/**
 * `styleDescription` and `styleDescriptionWithNoun` for a graphical component,
 * plus `borderStyleDescription` and `fillStyleDescription` for the shapes that
 * have an interior.
 *
 * @param kind How the description is composed.
 * @param noun The noun the description names. `"regular-polygon"` names the
 *   shape by its side count, so it also brings in a `numSides` dependency.
 *   A `"marker"` description names its marker shape instead, so there `noun`
 *   only supplies the wording of the author-facing `description` fields.
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
            // `default` as well as the case it names: the components asking
            // for these definitions are `.js`, so nothing type-checks their
            // `kind`, and a stroke is the safe thing to fall back to.
            case "stroke":
            default:
                return describeStrokedShape(t, strokeWords(dependencyValues), {
                    noun: spec,
                    withNoun,
                });
        }
    }

    const definitions: StateVariableDefinitions = {
        styleDescription: textStateVariable(
            "styleDescription",
            `A textual description of the ${label}'s style.`,
            dependencies,
            (dependencyValues) => describe(dependencyValues, false),
        ),

        styleDescriptionWithNoun: textStateVariable(
            "styleDescriptionWithNoun",
            `Style description including the noun "${label}".`,
            dependencies,
            (dependencyValues) => describe(dependencyValues, true),
        ),
    };

    if (kind === "closedShape") {
        definitions.borderStyleDescription = textStateVariable(
            "borderStyleDescription",
            `A textual description of the ${label}'s border style.`,
            dependencies,
            (dependencyValues) =>
                describeBorder(
                    translatorFor(dependencyValues),
                    strokeWords(dependencyValues),
                ),
        );

        definitions.fillStyleDescription = textStateVariable(
            "fillStyleDescription",
            `A textual description of the ${label}'s fill style.`,
            dependencies,
            (dependencyValues) =>
                describeFill(
                    translatorFor(dependencyValues),
                    {
                        fillColorWord: colorWord(dependencyValues, "fill"),
                        fillStyleWord:
                            dependencyValues.selectedStyle.fillStyleWord,
                    },
                    { filled: dependencyValues.filled },
                ),
        );
    }

    return definitions;
}

/**
 * State-variable definitions describing how a piece of text is styled: its
 * color, and the background drawn behind it.
 */
export function returnTextStyleDescriptionDefinitions(): StateVariableDefinitions {
    return {
        textColor: textStateVariable(
            "textColor",
            "Human-readable name for this component's text color, derived from the active style and theme.",
            commonDependencies,
            (dependencyValues) =>
                describeColor(
                    translatorFor(dependencyValues),
                    colorWord(dependencyValues, "text"),
                    "text",
                ),
        ),

        backgroundColor: textStateVariable(
            "backgroundColor",
            "Human-readable name for this component's background color, derived from the active style and theme.",
            commonDependencies,
            (dependencyValues) => {
                const t = translatorFor(dependencyValues);
                return (
                    backgroundDescription(t, dependencyValues) ??
                    noBackgroundWord(t)
                );
            },
        ),

        // Reads the raw style rather than the two variables above, since
        // `backgroundColor` reports a translated "none" that this cannot
        // usefully compare against.
        textStyleDescription: textStateVariable(
            "textStyleDescription",
            "Human-readable description of this component's text styling (color and any background color).",
            commonDependencies,
            (dependencyValues) => {
                const t = translatorFor(dependencyValues);
                return describeText(t, {
                    color: describeColor(
                        t,
                        colorWord(dependencyValues, "text"),
                        "text",
                    ),
                    // Looked up again rather than reusing what
                    // `backgroundColor` reports: there the word stands alone,
                    // here it sits behind `style-text`'s preposition, and a
                    // language that inflects for case needs the two forms to
                    // differ (#1606).
                    background: backgroundDescription(
                        t,
                        dependencyValues,
                        "background-clause",
                    ),
                });
            },
        ),
    };
}
