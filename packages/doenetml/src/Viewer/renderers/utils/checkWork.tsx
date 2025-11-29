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

    const disabled = SVs.disabled;

    const checkWorkStyle: React.CSSProperties = {
        cursor: "pointer",
    };

    const statusStyle: React.CSSProperties = {
        padding: "1px 4px 1px 4px",
        marginRight: "4px",
        borderRadius: "5px",
        height: "22px",
        display: "inline-block",
        verticalAlign: "middle",
    };

    let checkWorkTabIndex = 0;
    if (disabled) {
        checkWorkStyle.backgroundColor = getComputedStyle(
            document.documentElement,
        ).getPropertyValue("--mainGray");
        checkWorkStyle.color = "black";
        checkWorkStyle.cursor = "not-allowed";
        checkWorkTabIndex = -1;
    }

    let checkWorkComponent;

    if (validationState === "unvalidated") {
        const checkWorkText = SVs.showCorrectness
            ? SVs.submitLabel
            : SVs.submitLabelNoCorrectness;
        const checkWorkLabel = showText ? <>&nbsp; {checkWorkText}</> : "";
        const additionalLabel = showText ? undefined : checkWorkText;

        checkWorkComponent = (
            <button
                className="check-work"
                id={id + "_submit"}
                tabIndex={checkWorkTabIndex}
                disabled={disabled}
                style={checkWorkStyle}
                onClick={submitAnswer}
                aria-label={additionalLabel}
            >
                <FontAwesomeIcon
                    icon={faLevelDownAlt as IconProp}
                    transform={{ rotate: 90 }}
                    aria-hidden={true}
                    title={additionalLabel}
                />
                {checkWorkLabel}
            </button>
        );
    } else if (SVs.showCorrectness) {
        if (validationState === "correct") {
            statusStyle.backgroundColor = getComputedStyle(
                document.documentElement,
            ).getPropertyValue("--mainGreen");

            const correctLabel = showText ? <>&nbsp; Correct</> : "";
            const additionalLabel = showText ? undefined : "Correct";

            checkWorkComponent = (
                <span
                    id={id + "_correct"}
                    style={statusStyle}
                    aria-label={additionalLabel}
                >
                    <FontAwesomeIcon
                        icon={faCheck as IconProp}
                        aria-hidden={true}
                        title={additionalLabel}
                    />
                    {correctLabel}
                </span>
            );
        } else if (validationState === "incorrect") {
            statusStyle.backgroundColor = getComputedStyle(
                document.documentElement,
            ).getPropertyValue("--mainRed");
            const incorrectLabel = showText ? <>&nbsp; Incorrect</> : "";
            const additionalLabel = showText ? undefined : "Incorrect";
            checkWorkComponent = (
                <span
                    id={id + "_incorrect"}
                    style={statusStyle}
                    aria-label={additionalLabel}
                >
                    <FontAwesomeIcon
                        icon={faTimes as IconProp}
                        aria-hidden={true}
                        title={additionalLabel}
                    />
                    {incorrectLabel}
                </span>
            );
        } else {
            // partial correct
            statusStyle.backgroundColor = "#efab34";
            const percent = Math.round(SVs.creditAchieved * 100);
            const partialText = SVs.creditIsReducedByAttempt
                ? `${percent}% Credit`
                : `${percent}% Correct`;
            const partialLabel = showText ? partialText : `${percent} %`;
            const additionalLabel = showText ? undefined : partialText;

            checkWorkComponent = (
                <span
                    id={id + "_partial"}
                    style={statusStyle}
                    aria-label={additionalLabel}
                >
                    {partialLabel}
                </span>
            );
        }
    } else {
        // showCorrectness is false
        statusStyle.backgroundColor = "rgb(74, 3, 217)";
        const responseSavedText = showText ? <>&nbsp; Response Saved</> : "";
        const additionalLabel = showText ? undefined : "Response Saved";

        if (!showText) {
            statusStyle.padding = "1px 8px 1px 4px"; // To center the faCloud icon
        }
        checkWorkComponent = (
            <span
                id={id + "_saved"}
                style={statusStyle}
                aria-label={additionalLabel}
            >
                <FontAwesomeIcon
                    icon={faCloud as IconProp}
                    aria-hidden={true}
                    title={additionalLabel}
                />
                {responseSavedText}
            </span>
        );
    }

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
        checkWorkComponent = (
            <>
                {checkWorkComponent}
                <span>({message})</span>
            </>
        );
    }

    return checkWorkComponent;
}
