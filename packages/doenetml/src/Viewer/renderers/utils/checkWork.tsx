import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
    faCheck,
    faCloud,
    faLevelDownAlt,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "./checkWork.css";

/**
 * Calculate if the current response of an answer blank has already been validated,
 * and, if so, the correctness of the response.
 *
 * Calculation is based on the state variables `SVs`.
 */
export function calculateValidationState(SVs: Record<string, any>) {
    let validationState:
        | "unvalidated"
        | "correct"
        | "incorrect"
        | "partialcorrect" = "unvalidated";
    if (SVs.justSubmitted || SVs.numAttemptsLeft < 1) {
        if (SVs.creditAchieved === 1) {
            validationState = "correct";
        } else if (SVs.creditAchieved === 0) {
            validationState = "incorrect";
        } else {
            validationState = "partialcorrect";
        }
    }
    return validationState;
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
 */
export function createCheckWorkComponent(
    SVs: Record<string, any>,
    id: string,
    validationState: string,
    submitAnswer: () => void,
    showText: boolean,
) {
    if (!SVs.showCheckWork) {
        return null;
    }

    const buttonStyle: React.CSSProperties = {};

    const tabIndex = SVs.disabled ? -1 : 0;

    let buttonContent: React.ReactElement | string | null = null;

    // A message that is meant to be read by a screen reader when it is added
    let liveLabel: string | undefined = undefined;
    // A message that should not be read by a screen reader when it is added,
    // though it will be read by the screen reader as part of the document as normal.
    let otherLabel: string | undefined = undefined;

    if (validationState === "unvalidated") {
        buttonStyle.cursor = "pointer";
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

        if (SVs.disabled) {
            buttonStyle.backgroundColor = getComputedStyle(
                document.documentElement,
            ).getPropertyValue("--mainGray");
            buttonStyle.color = "black";
            buttonStyle.cursor = "not-allowed";
        }
    } else if (SVs.showCorrectness) {
        if (validationState === "correct") {
            buttonStyle.backgroundColor = "#2C6236";

            // When the button changes to "Correct", it should be read by the screen reader
            liveLabel = "Correct";
            buttonContent = showText ? <>&nbsp; Correct</> : null;
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
            buttonStyle.backgroundColor = "#A92328";

            // When the button changes to "Incorrect", it should be read by the screen reader
            liveLabel = "Incorrect";
            buttonContent = showText ? <>&nbsp; Incorrect</> : null;
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
            // partial correct
            buttonStyle.backgroundColor = "#7A4D00";
            const percent = Math.round(SVs.creditAchieved * 100);
            const partialText = SVs.creditIsReducedByAttempt
                ? `${percent}% Credit`
                : `${percent}% Correct`;
            buttonContent = (
                <span aria-hidden={true}>
                    {showText ? partialText : `${percent} %`}
                </span>
            );

            // When the button changes to "50% Correct", etc., it should be read by the screen reader
            liveLabel = partialText;
        }
    } else {
        // showCorrectness is false
        buttonStyle.backgroundColor = "rgb(74, 3, 217)";

        // When the button changes to "Response Saved", it should be read by the screen reader
        liveLabel = "Response Saved";
        buttonContent = showText ? <>&nbsp; Response Saved</> : null;
        buttonContent = (
            <span aria-hidden={true}>
                <FontAwesomeIcon icon={faCloud as IconProp} title={liveLabel} />
                {buttonContent}
            </span>
        );
    }

    let button = (
        <button
            className="check-work"
            id={id + "_button"}
            tabIndex={tabIndex}
            disabled={SVs.disabled}
            style={buttonStyle}
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
        if (SVs.numIncorrectSubmissions === 0) {
            messages.push("Max credit available: 100%");
        } else if (SVs.creditAchieved > 0) {
            messages.push(
                `Max credit available: ${Math.round(100 * SVs.creditFactorUsed)}%`,
            );
        } else {
            messages.push(
                `Max credit available: ${Math.round(100 * SVs.nextCreditFactor)}%`,
            );
        }
    }

    if (SVs.numAttemptsLeft < 1) {
        messages.push("no attempts remaining");
    } else if (SVs.numAttemptsLeft === 1) {
        messages.push("1 attempt remaining");
    } else if (Number.isFinite(SVs.numAttemptsLeft)) {
        messages.push(`${SVs.numAttemptsLeft} attempts remaining`);
    }

    if (messages.length > 0) {
        const message = messages.join("; ");
        button = (
            <>
                {button}
                <span>({message})</span>
            </>
        );
    }

    return button;
}
