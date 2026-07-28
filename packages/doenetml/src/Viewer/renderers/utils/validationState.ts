import type { Translator } from "@doenet/i18n";

/**
 * Append validation state to short description if answer is validated.
 *
 * @param validationState - one of "correct", "incorrect", "partialcorrect", or "unvalidated"
 * @param shortDescription - the existing short description
 * @param t - translator for the *document's* language, from `useContentT()`.
 *   This suffix and the check-work button beside it announce the same verdict
 *   about the same response, so they are one control and answer to one tag
 *   (see `useContentT`). Being addressed to a screen reader does not put it on
 *   `uiLocale`: the button's own `aria-live` region is addressed there too and
 *   follows the document. Splitting them would land only on screen-reader
 *   users, who are the only ones who hear both.
 * @returns updated short description with validation state appended if applicable
 */
export function addValidationStateToShortDescription(
    validationState: string,
    shortDescription: string | undefined,
    t: Translator,
) {
    let suffix: string | null = null;
    if (validationState === "correct") {
        suffix = t("validation-correct", undefined, "(Correct)");
    } else if (validationState === "incorrect") {
        suffix = t("validation-incorrect", undefined, "(Incorrect)");
    } else if (validationState === "partialcorrect") {
        suffix = t(
            "validation-partially-correct",
            undefined,
            "(Partially correct)",
        );
    }
    if (suffix === null) {
        return shortDescription;
    }
    return (shortDescription ? shortDescription + " " : "") + suffix;
}
