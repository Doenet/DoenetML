import type { Translator } from "@doenet/i18n";

/**
 * Append validation state to short description if answer is validated.
 *
 * @param validationState - one of "correct", "incorrect", "partialcorrect", or "unvalidated"
 * @param shortDescription - the existing short description
 * @param t - chrome translator from `useT()`
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
