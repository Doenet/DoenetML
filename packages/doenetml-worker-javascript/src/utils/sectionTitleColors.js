/**
 * Utilities for resolving and validating section heading-bar background colors.
 *
 * Boxed and collapsible sections render a colored heading bar. The background
 * color depends on the section's completion state (notStarted / inProgress /
 * completed), the author-supplied `*Color` / `*ColorDarkMode` attributes, and
 * the nearest ancestor that supplies an inherited color.
 *
 * Each resolved color is paired with a *source descriptor* that carries enough
 * metadata for the diagnostic system to decide whether this component is the
 * right place to surface a contrast warning (vs. suppressing a duplicate that
 * was already shown on a parent heading bar).
 */

import {
    CANVAS_DARK_MODE_COLOR,
    CANVAS_LIGHT_MODE_COLOR,
    compositedContrastRatio,
    invertLightness,
    suggestAccessibleDarkModeColorAgainst,
    TEXT_CONTRAST_THRESHOLD,
} from "@doenet/utils/style";
import { codedDiagnostic } from "./diagnostics";

/**
 * The three heading-bar completion states, in their canonical string form.
 * Used to index per-state color maps.
 */
export const sectionTitleStateKeys = ["completed", "inProgress", "notStarted"];

/**
 * Maps a numeric `creditAchieved` value to a heading-bar state key.
 *
 * @param {number} creditAchieved
 * @returns {"completed" | "inProgress" | "notStarted"}
 */
export function titleStateKeyFromCredit(creditAchieved) {
    if (creditAchieved === 1) {
        return "completed";
    }

    if (creditAchieved > 0) {
        return "inProgress";
    }

    return "notStarted";
}

/**
 * Resolves the light-mode heading color and its source descriptor for one
 * completion-state slot.
 *
 * Resolution order:
 *  1. Author-supplied own attribute (e.g. `completedColor="blue"`).
 *  2. Inherited value from the nearest ancestor section that has resolved a
 *     color for the same state key.
 *  3. The component's own default (a CSS variable like `var(--mainGray)`).
 *
 * The returned source descriptor records whether the value was authored,
 * inherited, and whether a boxed/collapsible ancestor has already "consumed"
 * the inherited color for contrast-diagnostic purposes (so we don't emit
 * duplicate warnings on deeper headings).
 *
 * @param {object} params
 * @param {object} params.dependencyValues
 * @param {object} params.usedDefault
 * @param {string} params.ownColorName - e.g. "completedColor"
 * @param {object|null} params.parentColors - parent's resolved per-state color map
 * @param {object|null} params.parentSources - parent's per-state source descriptors
 * @param {boolean} params.parentIsBoxedOrCollapsible
 * @param {string} params.stateKey - "completed" | "inProgress" | "notStarted"
 * @returns {{ value: string, source: object }}
 */
export function resolveSectionTitleLightColorSpec({
    dependencyValues,
    usedDefault,
    ownColorName,
    parentColors,
    parentSources,
    parentIsBoxedOrCollapsible,
    stateKey,
}) {
    if (!usedDefault[ownColorName]) {
        return {
            value: dependencyValues[ownColorName],
            source: {
                authored: true,
                colorName: ownColorName,
                inherited: false,
                priorBoxedOrCollapsibleAncestor: false,
            },
        };
    }

    const inheritedValue = parentColors?.[stateKey];
    if (typeof inheritedValue === "string") {
        return {
            value: inheritedValue,
            source: parentSources?.[stateKey]
                ? {
                      ...parentSources[stateKey],
                      inherited: true,
                      priorBoxedOrCollapsibleAncestor:
                          parentSources[stateKey]
                              .priorBoxedOrCollapsibleAncestor ||
                          parentIsBoxedOrCollapsible,
                  }
                : {
                      authored: false,
                      colorName: ownColorName,
                      inherited: true,
                      priorBoxedOrCollapsibleAncestor:
                          parentIsBoxedOrCollapsible,
                  },
        };
    }

    return {
        value: dependencyValues[ownColorName],
        source: {
            authored: false,
            colorName: ownColorName,
            inherited: false,
            priorBoxedOrCollapsibleAncestor: false,
        },
    };
}

/**
 * Derives an accessible dark-mode heading background color from a light-mode
 * color by inverting its lightness and then nudging the result until white text
 * clears TEXT_CONTRAST_THRESHOLD against it.
 *
 * We use `suggestAccessibleDarkModeColorAgainst` (which searches outward from
 * the inverted lightness) rather than `deriveAccessibleDarkModeColor` (which
 * only walks lightness upward) so that colors that invert to a mid-range value
 * are adjusted toward whichever pole is closer — producing a result that stays
 * as visually close to the intended hue as possible.
 *
 * @param {string} lightColor - Parseable CSS color string.
 * @returns {string|null} Accessible dark-mode hex color, or null if `lightColor`
 *   cannot be parsed (e.g. CSS variable references).
 */
export function deriveSectionTitleDarkModeColor(lightColor) {
    return suggestAccessibleDarkModeColorAgainst({
        startColor: invertLightness(lightColor),
        partnerColor: "#ffffff",
        channelRole: "background",
        threshold: TEXT_CONTRAST_THRESHOLD,
    });
}

/**
 * Resolves the dark-mode heading color and its source descriptor for one
 * completion-state slot.
 *
 * Resolution order:
 *  1. Author-supplied own `*DarkMode` attribute (e.g. `completedColorDarkMode`).
 *  2. Dark color derived from the author-supplied light-mode attribute via
 *     {@link deriveSectionTitleDarkModeColor}. Falls back to the component's
 *     own hex default when the light color is an unparseable CSS variable.
 *  3. Inherited dark-mode value from the nearest ancestor section.
 *  4. The component's own hex default (e.g. `#3a3a3a`).
 *
 * @param {object} params
 * @param {object} params.dependencyValues
 * @param {object} params.usedDefault
 * @param {string} params.ownDarkColorName - e.g. "completedColorDarkMode"
 * @param {string} params.ownLightColorName - e.g. "completedColor"
 * @param {object|null} params.parentColorsDarkMode
 * @param {object|null} params.parentSourcesDarkMode
 * @param {boolean} params.parentIsBoxedOrCollapsible
 * @param {string} params.stateKey - "completed" | "inProgress" | "notStarted"
 * @returns {{ value: string, source: object }}
 */
export function resolveSectionTitleDarkColorSpec({
    dependencyValues,
    usedDefault,
    ownDarkColorName,
    ownLightColorName,
    parentColorsDarkMode,
    parentSourcesDarkMode,
    parentIsBoxedOrCollapsible,
    stateKey,
}) {
    if (!usedDefault[ownDarkColorName]) {
        return {
            value: dependencyValues[ownDarkColorName],
            source: {
                authored: true,
                colorName: ownDarkColorName,
                inherited: false,
                priorBoxedOrCollapsibleAncestor: false,
            },
        };
    }

    if (!usedDefault[ownLightColorName]) {
        const derivedDarkColor = deriveSectionTitleDarkModeColor(
            dependencyValues[ownLightColorName],
        );
        if (derivedDarkColor !== null) {
            return {
                value: derivedDarkColor,
                source: {
                    authored: true,
                    colorName: ownLightColorName,
                    inherited: false,
                    priorBoxedOrCollapsibleAncestor: false,
                },
            };
        }

        // CSS variables and other unparseable light-mode colors cannot be
        // adapted safely in the worker, so fall back to the accessible default
        // dark-mode color unless the author pins an explicit *DarkMode value.
        return {
            value: dependencyValues[ownDarkColorName],
            source: {
                authored: false,
                colorName: ownDarkColorName,
                inherited: false,
                priorBoxedOrCollapsibleAncestor: false,
            },
        };
    }

    const inheritedValue = parentColorsDarkMode?.[stateKey];
    if (typeof inheritedValue === "string") {
        return {
            value: inheritedValue,
            source: parentSourcesDarkMode?.[stateKey]
                ? {
                      ...parentSourcesDarkMode[stateKey],
                      inherited: true,
                      priorBoxedOrCollapsibleAncestor:
                          parentSourcesDarkMode[stateKey]
                              .priorBoxedOrCollapsibleAncestor ||
                          parentIsBoxedOrCollapsible,
                  }
                : {
                      authored: false,
                      colorName: ownDarkColorName,
                      inherited: true,
                      priorBoxedOrCollapsibleAncestor:
                          parentIsBoxedOrCollapsible,
                  },
        };
    }

    return {
        value: dependencyValues[ownDarkColorName],
        source: {
            authored: false,
            colorName: ownDarkColorName,
            inherited: false,
            priorBoxedOrCollapsibleAncestor: false,
        },
    };
}

/**
 * Returns true when a heading-bar contrast diagnostic should be emitted for
 * the given source descriptor.
 *
 * A diagnostic is emitted only when:
 *  - The color was explicitly authored (not a default), AND
 *  - Either the color is local to this component (not inherited), OR the color
 *    is inherited but no boxed/collapsible ancestor has already shown the
 *    warning. This prevents the same color from producing duplicate diagnostics
 *    on every nested heading bar that inherits it.
 *
 * @param {{ source: object }} params
 * @returns {boolean}
 */
export function shouldEmitSectionTitleColorDiagnostic({ source }) {
    if (!source?.authored) {
        return false;
    }

    if (!source.inherited) {
        return true;
    }

    return !source.priorBoxedOrCollapsibleAncestor;
}

/**
 * Appends a contrast accessibility diagnostic when an explicitly authored
 * heading background color fails WCAG AA (4.5:1) against the heading text.
 *
 * Only fires when `authorSet` is true (i.e. the author overrode the default)
 * and the color is a parseable concrete value (CSS variable references like
 * `var(--mainGray)` return `null` from `compositedContrastRatio` and are
 * silently skipped).
 *
 * @param {object} params
 * @param {object[]} params.diagnostics - Accumulator array.
 * @param {boolean} params.authorSet - Whether the author explicitly set the attribute.
 * @param {string} params.colorValue - The resolved color string.
 * @param {string} params.colorName - Attribute name for the diagnostic message.
 * @param {string} params.textColor - Heading text color (#000000 or #ffffff).
 * @param {string} params.canvasColor - Viewer canvas color for the current theme.
 * @param {"light"|"dark"} [params.mode] - Theme the shortfall was measured in.
 *   Selects a variant of the message rather than appending a suffix to it:
 *   "(dark mode)" is prose, and prose concatenated onto a message in the
 *   caller is prose no translator ever sees.
 */
export function addSectionTitleColorContrastDiagnostic({
    diagnostics,
    authorSet,
    colorValue,
    colorName,
    textColor,
    canvasColor,
    mode = "light",
}) {
    if (!authorSet || !colorValue) {
        return;
    }

    const ratio = compositedContrastRatio({
        foreground: textColor,
        canvas: canvasColor,
        background: colorValue,
    });
    if (ratio !== null && ratio < TEXT_CONTRAST_THRESHOLD) {
        diagnostics.push(
            codedDiagnostic({
                type: "accessibility",
                level: 1,
                code: "doenet-a0006",
                args: {
                    colorName,
                    // Numbers, not the strings they used to be formatted
                    // into: a locale that writes 4,50 rather than 4.50 can
                    // only do so if the value arrives as a number.
                    ratio,
                    threshold: TEXT_CONTRAST_THRESHOLD,
                    mode,
                },
            }),
        );
    }
}

/**
 * The attributes that set the colors of a section's heading bar in each of its
 * completion states, and whether the completed color waits for a grade.
 *
 * Shared by every sectioning component and by `<cascade>`, which is not one but
 * sets these for the steps it reveals: a section reads its colors off its
 * immediate parent when it sets none of its own (see
 * {@link returnSectionTitleStateColorStateVariableDefinitions}).
 *
 * @returns {object} attribute definitions keyed by attribute name
 */
export function returnSectionTitleStateColorAttributes() {
    const attributes = {};

    attributes.completedColor = {
        createComponentOfType: "text",
        createStateVariable: "completedColor",
        defaultValue: "var(--lightGreen)",
        description: "Color used to indicate this section has been completed.",
    };

    // Whether the heading bar waits for a grade. The completion states are
    // driven by `creditAchievedForProgress`, which counts a `handGraded`
    // answer as correct once the reader has responded — a bar that stayed
    // gray until an instructor got to it would withhold the reward for work
    // the reader has finished, and they have no way to tell the two apart.
    // An instructor who wants the bar to mean "graded and correct" sets
    // this, and the real `creditAchieved` drives the states instead.
    attributes.completedColorRequiresCredit = {
        createComponentOfType: "boolean",
        createStateVariable: "completedColorRequiresCreditPreliminary",
        // See the note on `showCorrectness` in
        // `returnScoredSectionAttributes`: this default is shown to authors
        // but is not what resolves the value, which falls back to the
        // enclosing section before reaching it.
        defaultValue: false,
        description:
            "Whether the completed color requires full `creditAchieved`, so that a section holding a hand-graded answer is not colored as completed until an instructor grades it. By default a hand-graded answer counts as completed once a non-blank response has been submitted. Affects only the color, not when a `<cascade>` advances.",
    };

    attributes.inProgressColor = {
        createComponentOfType: "text",
        createStateVariable: "inProgressColor",
        defaultValue: "var(--mainGray)",
        description: "Color used to indicate this section is in progress.",
    };

    attributes.notStartedColor = {
        createComponentOfType: "text",
        createStateVariable: "notStartedColor",
        defaultValue: "var(--mainGray)",
        description:
            "Color used to indicate this section has not been started.",
    };

    attributes.completedColorDarkMode = {
        createComponentOfType: "text",
        createStateVariable: "completedColorDarkMode",
        // Dark green; white text contrast ≈ 7.9:1 (passes WCAG AA and AAA).
        defaultValue: "#1a5e20",
        description:
            "Color used to indicate this section has been completed (dark mode). " +
            "If omitted, the dark-mode color is derived from `completedColor` when " +
            "that attribute is explicitly set; otherwise falls back to a dark green " +
            "that meets WCAG AA contrast for white text.",
    };

    attributes.inProgressColorDarkMode = {
        createComponentOfType: "text",
        createStateVariable: "inProgressColorDarkMode",
        // Dark gray; white text contrast ≈ 11.4:1 (passes WCAG AA and AAA).
        defaultValue: "#3a3a3a",
        description:
            "Color used to indicate this section is in progress (dark mode). " +
            "If omitted, the dark-mode color is derived from `inProgressColor` when " +
            "that attribute is explicitly set; otherwise falls back to a dark gray " +
            "that meets WCAG AA contrast for white text.",
    };

    attributes.notStartedColorDarkMode = {
        createComponentOfType: "text",
        createStateVariable: "notStartedColorDarkMode",
        // Dark gray; white text contrast ≈ 11.4:1 (passes WCAG AA and AAA).
        defaultValue: "#3a3a3a",
        description:
            "Color used to indicate this section has not been started (dark mode). " +
            "If omitted, the dark-mode color is derived from `notStartedColor` when " +
            "that attribute is explicitly set; otherwise falls back to a dark gray " +
            "that meets WCAG AA contrast for white text.",
    };

    return attributes;
}

/**
 * The state variables that resolve a section's heading-bar colors from its own
 * attributes and its parent's: `completedColorRequiresCredit`, falling back to
 * the nearest ancestor carrying it, and `sectionTitleStateColors` with its dark
 * mode and source companions, falling back to the immediate parent.
 *
 * Shared by every sectioning component and by `<cascade>`, so that a cascade
 * passes the colors of the section around it on to its steps, or its own
 * colors when it sets them, exactly as a section between them would. Pairs
 * with {@link returnSectionTitleStateColorAttributes}.
 *
 * @returns {object} state variable definitions keyed by name
 */
export function returnSectionTitleStateColorStateVariableDefinitions() {
    const stateVariableDefinitions = {};

    stateVariableDefinitions.completedColorRequiresCredit = {
        description:
            "Whether the heading bar's completion state is driven by the real `creditAchieved` rather than by progress, so that a hand-graded answer keeps the section from being colored as completed until an instructor grades it.",
        public: true,
        shadowingInstructions: {
            createComponentOfType: "boolean",
        },
        returnDependencies: () => ({
            completedColorRequiresCreditPreliminary: {
                dependencyType: "stateVariable",
                variableName: "completedColorRequiresCreditPreliminary",
            },
            completedColorRequiresCreditAncestor: {
                dependencyType: "ancestor",
                variableNames: ["completedColorRequiresCredit"],
            },
        }),
        definition({ dependencyValues, usedDefault }) {
            // Set once on an enclosing section and every section within it
            // follows: an instructor who wants graded coloring wants it for
            // the whole activity, not one section at a time. The fallback
            // is to the nearest *ancestor* carrying the variable, the way
            // `showCorrectness` resolves — unlike the colors themselves,
            // which read only their immediate parent section.
            //
            // Start from the attribute's own value rather than restating
            // its default here, so the default lives in exactly one place:
            // the attribute's `defaultValue`. Written the other way the two
            // could drift apart unnoticed, which is a real risk on a base
            // class this many components extend and override attributes on.
            let completedColorRequiresCredit =
                dependencyValues.completedColorRequiresCreditPreliminary;

            if (
                usedDefault.completedColorRequiresCreditPreliminary &&
                dependencyValues.completedColorRequiresCreditAncestor
            ) {
                completedColorRequiresCredit =
                    dependencyValues.completedColorRequiresCreditAncestor
                        .stateValues.completedColorRequiresCredit;
            }

            return { setValue: { completedColorRequiresCredit } };
        },
    };

    stateVariableDefinitions.sectionTitleStateColors = {
        additionalStateVariablesDefined: [
            "sectionTitleStateColorsDarkMode",
            "sectionTitleStateColorSources",
            "sectionTitleStateColorSourcesDarkMode",
        ],
        returnDependencies: () => ({
            completedColor: {
                dependencyType: "stateVariable",
                variableName: "completedColor",
            },
            inProgressColor: {
                dependencyType: "stateVariable",
                variableName: "inProgressColor",
            },
            notStartedColor: {
                dependencyType: "stateVariable",
                variableName: "notStartedColor",
            },
            completedColorDarkMode: {
                dependencyType: "stateVariable",
                variableName: "completedColorDarkMode",
            },
            inProgressColorDarkMode: {
                dependencyType: "stateVariable",
                variableName: "inProgressColorDarkMode",
            },
            notStartedColorDarkMode: {
                dependencyType: "stateVariable",
                variableName: "notStartedColorDarkMode",
            },
            parentSectionTitleStateColors: {
                dependencyType: "parentStateVariable",
                variableName: "sectionTitleStateColors",
            },
            parentSectionTitleStateColorsDarkMode: {
                dependencyType: "parentStateVariable",
                variableName: "sectionTitleStateColorsDarkMode",
            },
            parentSectionTitleStateColorSources: {
                dependencyType: "parentStateVariable",
                variableName: "sectionTitleStateColorSources",
            },
            parentSectionTitleStateColorSourcesDarkMode: {
                dependencyType: "parentStateVariable",
                variableName: "sectionTitleStateColorSourcesDarkMode",
            },
            parentBoxed: {
                dependencyType: "parentStateVariable",
                variableName: "boxed",
            },
            parentCollapsible: {
                dependencyType: "parentStateVariable",
                variableName: "collapsible",
            },
        }),
        definition({ dependencyValues, usedDefault }) {
            const sectionTitleStateColors = {};
            const sectionTitleStateColorsDarkMode = {};
            const sectionTitleStateColorSources = {};
            const sectionTitleStateColorSourcesDarkMode = {};
            const parentIsBoxedOrCollapsible = Boolean(
                dependencyValues.parentBoxed ||
                dependencyValues.parentCollapsible,
            );

            const colorNamesByState = {
                completed: {
                    light: "completedColor",
                    dark: "completedColorDarkMode",
                },
                inProgress: {
                    light: "inProgressColor",
                    dark: "inProgressColorDarkMode",
                },
                notStarted: {
                    light: "notStartedColor",
                    dark: "notStartedColorDarkMode",
                },
            };

            for (const stateKey of sectionTitleStateKeys) {
                const colorNames = colorNamesByState[stateKey];
                const lightSpec = resolveSectionTitleLightColorSpec({
                    dependencyValues,
                    usedDefault,
                    ownColorName: colorNames.light,
                    parentColors:
                        dependencyValues.parentSectionTitleStateColors,
                    parentSources:
                        dependencyValues.parentSectionTitleStateColorSources,
                    parentIsBoxedOrCollapsible,
                    stateKey,
                });
                sectionTitleStateColors[stateKey] = lightSpec.value;
                sectionTitleStateColorSources[stateKey] = lightSpec.source;

                const darkSpec = resolveSectionTitleDarkColorSpec({
                    dependencyValues,
                    usedDefault,
                    ownDarkColorName: colorNames.dark,
                    ownLightColorName: colorNames.light,
                    parentColorsDarkMode:
                        dependencyValues.parentSectionTitleStateColorsDarkMode,
                    parentSourcesDarkMode:
                        dependencyValues.parentSectionTitleStateColorSourcesDarkMode,
                    parentIsBoxedOrCollapsible,
                    stateKey,
                });
                sectionTitleStateColorsDarkMode[stateKey] = darkSpec.value;
                sectionTitleStateColorSourcesDarkMode[stateKey] =
                    darkSpec.source;
            }

            return {
                setValue: {
                    sectionTitleStateColors,
                    sectionTitleStateColorsDarkMode,
                    sectionTitleStateColorSources,
                    sectionTitleStateColorSourcesDarkMode,
                },
            };
        },
    };

    return stateVariableDefinitions;
}

export { CANVAS_DARK_MODE_COLOR, CANVAS_LIGHT_MODE_COLOR };
