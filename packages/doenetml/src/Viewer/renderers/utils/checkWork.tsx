import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
    faCheck,
    faCloud,
    faLevelDownAlt,
    faSpinner,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import type { Translator } from "@doenet/i18n";
import "./checkWork.css";

/** Validation state for answer submissions */
export type ValidationState =
    "unvalidated" | "correct" | "incorrect" | "partialcorrect";

/**
 * The credit this button reports, which is not always the credit the component
 * is worth: a section-wide check work over a region carrying no weight is worth
 * full marks, because nothing in it can lose any, while the button is being
 * asked whether the answers are right.
 *
 * The core hands such a section a separate `creditAchievedForCheckWork` and
 * hands `null` to every other section (see `scoredSection.js` in the worker), so
 * the fallback here is the usual path rather than the exception. An `<answer>`
 * or an input does not carry the variable at all, and falls back the same way.
 */
function checkWorkCredit(SVs: Record<string, any>): number {
    return SVs.creditAchievedForCheckWork ?? SVs.creditAchieved;
}

/**
 * Calculate if the current response of an answer blank has already been validated,
 * and, if so, the correctness of the response.
 *
 * Calculation is based on the state variables `SVs`.
 */
export function calculateValidationState(
    SVs: Record<string, any>,
): ValidationState {
    let validationState: ValidationState = "unvalidated";
    if (SVs.justSubmitted || SVs.numAttemptsLeft < 1) {
        const creditAchieved = checkWorkCredit(SVs);
        if (creditAchieved === 1) {
            validationState = "correct";
        } else if (creditAchieved === 0) {
            validationState = "incorrect";
        } else {
            validationState = "partialcorrect";
        }
    }
    return validationState;
}

/**
 * Whether the check-work button should carry its label, rather than being the
 * compact icon-only one — the `showText` argument of
 * `createCheckWorkComponent`.
 *
 * Which size is the default depends on the shape of what the button sits with,
 * so the caller passes that in as `fullByDefault`. An input that takes a block
 * of its own — an expanded `<textInput>`, a `<choiceInput>` that is not
 * `inline`, an `<answer>` with no input field at all — has a line beneath it to
 * put a labelled button on, so the full button is its default. A word-sized
 * input flows in a sentence, where a labelled button beside it would crowd the
 * line, so the compact one is the default there.
 *
 * `forceFullCheckWorkButton` overrides either default. `forceSmallCheckWorkButton`
 * overrides only the full one — an input whose default is already the small
 * button has nothing to ask for — and loses to `forceFullCheckWorkButton` when
 * both are given, which is the precedence the `<answer>` reference documents.
 */
export function wantsFullCheckWorkButton(
    SVs: Record<string, any>,
    fullByDefault: boolean,
): boolean {
    return fullByDefault
        ? Boolean(SVs.forceFullCheckWorkButton) ||
              !SVs.forceSmallCheckWorkButton
        : Boolean(SVs.forceFullCheckWorkButton);
}

/**
 * Create the check work button and state text of an answers.
 *
 * Inputs:
 * - SVs: the state variables of an answer or input
 * - id: the component's id
 * - validationState: the validation state calculated from `calculateValidationState`
 * - submitAnswer: function to call to submit answer
 * - showText: if true, then the button includes text like "Submit" or "Correct"
 *   in addition to the symbols
 * - isPending: if true, shows pending/checking state with spinner
 * - t: translator for the *document's* language, from `useContentT()` — not
 *   the reader's. The resting label is `SVs.submitLabel`, which the core
 *   computed against `documentLocale` because authored prose can name it
 *   ("Pulsa el botón $ans.submitLabel"), so everything else written here has
 *   to answer to the same tag: the verdict, the status only a screen reader
 *   hears, and the message line beside the button, which sits next to
 *   `submitLabel` in one hidden span or one joined sentence. See `useContentT`
 *   for the whole argument. Passed in rather than read from context here
 *   because this is a plain function that several renderers call
 *   conditionally, so it cannot itself use a hook.
 */
export function createCheckWorkComponent(
    SVs: Record<string, any>,
    id: string,
    validationState: ValidationState,
    submitAnswer: () => void,
    showText: boolean,
    isPending: boolean,
    t: Translator,
) {
    if (!SVs.showCheckWork) {
        return null;
    }

    const buttonClassNames = ["check-work"];

    // Disable the button when the component is disabled or when the (section-wide
    // or per-answer) attempts have been exhausted.
    const buttonDisabled = Boolean(SVs.disabled) || SVs.numAttemptsLeft < 1;

    const tabIndex = buttonDisabled ? -1 : 0;

    let buttonContent: React.ReactElement | string | null = null;

    // A message that is meant to be read by a screen reader when it is added
    let liveLabel: string | undefined = undefined;
    // A message that should not be read by a screen reader when it is added,
    // though it will be read by the screen reader as part of the document as normal.
    let otherLabel: string | undefined = undefined;

    if (isPending) {
        buttonClassNames.push("check-work-pending");
        const pendingText = SVs.showCorrectness
            ? t("answer-checking", undefined, "Checking...")
            : t("answer-submitting", undefined, "Submitting...");
        liveLabel = SVs.showCorrectness
            ? t("answer-checking-status", undefined, "Checking answer")
            : t("answer-submitting-status", undefined, "Submitting answer");
        buttonContent = showText ? <>&nbsp; {pendingText}</> : null;
        buttonContent = (
            <span aria-hidden={true}>
                <FontAwesomeIcon icon={faSpinner as IconProp} spin={true} />
                {buttonContent}
            </span>
        );
    } else if (validationState === "unvalidated") {
        buttonClassNames.push("check-work-unvalidated");
        const checkWorkText = SVs.showCorrectness
            ? SVs.submitLabel
            : SVs.submitLabelNoCorrectness;
        // When the button changes back to Check Work,
        // it should not be read by the screen reader
        otherLabel = checkWorkText;
        buttonContent = showText ? <>&nbsp; {checkWorkText}</> : null;
        buttonContent = (
            <span aria-hidden={true}>
                <FontAwesomeIcon
                    icon={faLevelDownAlt as IconProp}
                    transform={{ rotate: 90 }}
                    title={otherLabel}
                />
                {buttonContent}
            </span>
        );
    } else if (SVs.showCorrectness) {
        buttonClassNames.push(`check-work-${validationState}`);
        if (validationState === "correct") {
            // When the button changes to "Correct", it should be read by the screen reader
            liveLabel = t("answer-correct", undefined, "Correct");
            buttonContent = showText ? <>&nbsp; {liveLabel}</> : null;
            buttonContent = (
                <span aria-hidden={true}>
                    <FontAwesomeIcon
                        icon={faCheck as IconProp}
                        title={liveLabel}
                    />
                    {buttonContent}
                </span>
            );
        } else if (validationState === "incorrect") {
            // When the button changes to "Incorrect", it should be read by the screen reader
            liveLabel = t("answer-incorrect", undefined, "Incorrect");
            buttonContent = showText ? <>&nbsp; {liveLabel}</> : null;
            buttonContent = (
                <span aria-hidden={true}>
                    <FontAwesomeIcon
                        icon={faTimes as IconProp}
                        title={liveLabel}
                    />
                    {buttonContent}
                </span>
            );
        } else {
            // partially correct
            const percent = Math.round(checkWorkCredit(SVs) * 100);
            const partialText = SVs.creditIsReducedByAttempt
                ? t("answer-percent-credit", { percent }, `${percent}% Credit`)
                : t(
                      "answer-percent-correct",
                      { percent },
                      `${percent}% Correct`,
                  );
            buttonContent = (
                <span aria-hidden={true}>
                    {showText
                        ? partialText
                        : t(
                              "answer-percent-short",
                              { percent },
                              `${percent} %`,
                          )}
                </span>
            );

            // When the button changes to "50% Correct", etc., it should be read by the screen reader
            liveLabel = partialText;
        }
    } else {
        // showCorrectness is false
        buttonClassNames.push("check-work-response-saved");

        // When the button changes to "Response Saved", it should be read by the screen reader
        liveLabel = t("answer-response-saved", undefined, "Response Saved");
        buttonContent = showText ? <>&nbsp; {liveLabel}</> : null;
        buttonContent = (
            <span aria-hidden={true}>
                <FontAwesomeIcon icon={faCloud as IconProp} title={liveLabel} />
                {buttonContent}
            </span>
        );
    }

    let button = (
        <button
            className={buttonClassNames.join(" ")}
            id={id + "_button"}
            tabIndex={tabIndex}
            disabled={buttonDisabled}
            aria-disabled={isPending ? true : undefined}
            onClick={submitAnswer}
        >
            {buttonContent}
            <span className="visually-hidden">
                <span aria-live="polite" aria-atomic={true}>
                    {liveLabel}
                </span>
                <span>{otherLabel}</span>
            </span>
        </button>
    );

    let messages = [];

    if (SVs.creditIsReducedByAttempt) {
        let maxCreditPercent: number;
        if (SVs.numIncorrectSubmissions === 0) {
            maxCreditPercent = 100;
        } else if (SVs.creditAchieved > 0) {
            maxCreditPercent = Math.round(100 * SVs.creditFactorUsed);
        } else {
            maxCreditPercent = Math.round(100 * SVs.nextCreditFactor);
        }
        messages.push(
            t(
                "max-credit-available",
                { percent: maxCreditPercent },
                `Max credit available: ${maxCreditPercent}%`,
            ),
        );
    }

    // One message with a plural selector rather than three branches: how many
    // forms a count needs is a property of the language, not of this code.
    // English has two plus a special case for zero; other languages differ.
    if (SVs.numAttemptsLeft < 1) {
        messages.push(
            t("attempts-remaining", { count: 0 }, "no attempts remaining"),
        );
    } else if (Number.isFinite(SVs.numAttemptsLeft)) {
        const count: number = SVs.numAttemptsLeft;
        messages.push(
            t(
                "attempts-remaining",
                { count },
                count === 1
                    ? "1 attempt remaining"
                    : `${count} attempts remaining`,
            ),
        );
    }

    if (messages.length > 0) {
        const message = messages.join("; ");
        button = (
            <>
                {button}
                <span data-test="attempts-remaining">({message})</span>
            </>
        );
    }

    return button;
}
