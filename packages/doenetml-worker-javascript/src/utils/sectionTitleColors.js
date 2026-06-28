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
 * @param {string} [params.modeSuffix] - Optional mode suffix for the message.
 */
export function addSectionTitleColorContrastDiagnostic({
    diagnostics,
    authorSet,
    colorValue,
    colorName,
    textColor,
    canvasColor,
    modeSuffix = "",
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
        diagnostics.push({
            type: "accessibility",
            level: 1,
            message: `${colorName} has insufficient contrast for the section heading text${modeSuffix} (${ratio.toFixed(2)}:1; requires at least ${TEXT_CONTRAST_THRESHOLD}:1).`,
        });
    }
}

export { CANVAS_DARK_MODE_COLOR, CANVAS_LIGHT_MODE_COLOR };
