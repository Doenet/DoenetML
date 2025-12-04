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
    let additionalLabel: string | undefined = undefined;

    if (validationState === "unvalidated") {
        buttonStyle.cursor = "pointer";
        const checkWorkText = SVs.showCorrectness
            ? SVs.submitLabel
            : SVs.submitLabelNoCorrectness;
        additionalLabel = checkWorkText;
        buttonContent = showText ? <>&nbsp; {checkWorkText}</> : null;
        buttonContent = (
            <>
                <FontAwesomeIcon
                    icon={faLevelDownAlt as IconProp}
                    transform={{ rotate: 90 }}
                    aria-hidden={true}
                    title={additionalLabel}
                />
                {buttonContent}
            </>
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
            buttonStyle.backgroundColor = getComputedStyle(
                document.documentElement,
            ).getPropertyValue("--mainGreen");

            additionalLabel = "Correct";
            buttonContent = showText ? <>&nbsp; Correct</> : null;
            buttonContent = (
                <>
                    <FontAwesomeIcon
                        icon={faCheck as IconProp}
                        aria-hidden={true}
                        title={additionalLabel}
                    />
                    {buttonContent}
                </>
            );
        } else if (validationState === "incorrect") {
            buttonStyle.backgroundColor = getComputedStyle(
                document.documentElement,
            ).getPropertyValue("--mainRed");
            additionalLabel = "Incorrect";
            buttonContent = showText ? <>&nbsp; Incorrect</> : null;
            buttonContent = (
                <>
                    <FontAwesomeIcon
                        icon={faTimes as IconProp}
                        aria-hidden={true}
                        title={additionalLabel}
                    />
                    {buttonContent}
                </>
            );
        } else {
            // partial correct
            buttonStyle.backgroundColor = "#efab34";
            const percent = Math.round(SVs.creditAchieved * 100);
            const partialText = SVs.creditIsReducedByAttempt
                ? `${percent}% Credit`
                : `${percent}% Correct`;
            buttonContent = showText ? partialText : `${percent} %`;
            additionalLabel = partialText;
        }
    } else {
        // showCorrectness is false
        buttonStyle.backgroundColor = "rgb(74, 3, 217)";
        additionalLabel = "Response Saved";
        buttonContent = showText ? <>&nbsp; Response Saved</> : null;
        buttonContent = (
            <>
                <FontAwesomeIcon
                    icon={faCloud as IconProp}
                    aria-hidden={true}
                    title={additionalLabel}
                />
                {buttonContent}
            </>
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
            aria-label={additionalLabel}
            role={validationState === "unvalidated" ? "button" : "status"}
            aria-live="polite"
        >
            {buttonContent}
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
