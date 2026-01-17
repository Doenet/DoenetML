/**
 * Append validation state to short description if answer is validated.
 *
 * @param validationState - one of "correct", "incorrect", "partialcorrect", or "unvalidated"
 * @param shortDescription - the existing short description
 * @returns updated short description with validation state appended if applicable
 */
export function addValidationStateToShortDescription(
    validationState: string,
    shortDescription: string | undefined,
) {
    if (validationState === "correct") {
        shortDescription =
            (shortDescription ? shortDescription + " " : "") + "(Correct)";
    } else if (validationState === "incorrect") {
        shortDescription =
            (shortDescription ? shortDescription + " " : "") + "(Incorrect)";
    } else if (validationState === "partialcorrect") {
        shortDescription =
            (shortDescription ? shortDescription + " " : "") +
            "(Partially correct)";
    }
    return shortDescription;
}
