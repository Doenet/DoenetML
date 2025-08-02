import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
    faCheck,
    faCloud,
    faLevelDownAlt,
    faTimes,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const Button = styled.button`
    position: relative;
    height: 24px;
    display: inline-block;
    color: white;
    background-color: var(--mainBlue);
    padding: 2px;
    /* border: var(--mainBorder); */
    border: none;
    border-radius: var(--mainBorderRadius);
    margin: 0px 4px 4px 0px;

    &:hover {
        background-color: var(--lightBlue);
        color: black;
    }
`;

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

    let checkWorkStyle: React.CSSProperties = {
        cursor: "pointer",
        padding: "1px 6px 1px 6px",
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
        const checkWorkText = showText ? (
            <>
                &nbsp;{" "}
                {SVs.showCorrectness
                    ? SVs.submitLabel
                    : SVs.submitLabelNoCorrectness}
            </>
        ) : (
            ""
        );

        checkWorkComponent = (
            <Button
                id={id + "_submit"}
                tabIndex={checkWorkTabIndex}
                disabled={disabled}
                style={checkWorkStyle}
                onClick={submitAnswer}
            >
                <FontAwesomeIcon
                    icon={faLevelDownAlt as IconProp}
                    transform={{ rotate: 90 }}
                />
                {checkWorkText}
            </Button>
        );
    } else if (SVs.showCorrectness) {
        if (validationState === "correct") {
            checkWorkStyle.backgroundColor = getComputedStyle(
                document.documentElement,
            ).getPropertyValue("--mainGreen");

            const checkWorkText = showText ? <>&nbsp; Correct</> : "";

            checkWorkComponent = (
                <Button
                    id={id + "_correct"}
                    style={checkWorkStyle}
                    tabIndex={checkWorkTabIndex}
                >
                    <FontAwesomeIcon icon={faCheck as IconProp} />
                    {checkWorkText}
                </Button>
            );
        } else if (validationState === "incorrect") {
            checkWorkStyle.backgroundColor = getComputedStyle(
                document.documentElement,
            ).getPropertyValue("--mainRed");
            const checkWorkText = showText ? <>&nbsp; Incorrect</> : "";
            checkWorkComponent = (
                <Button
                    id={id + "_incorrect"}
                    style={checkWorkStyle}
                    tabIndex={checkWorkTabIndex}
                >
                    <FontAwesomeIcon icon={faTimes as IconProp} />
                    {checkWorkText}
                </Button>
            );
        } else {
            // partialcorrect
            checkWorkStyle.backgroundColor = "#efab34";
            const percent = Math.round(SVs.creditAchieved * 100);
            const checkWorkText = showText
                ? SVs.creditIsReducedByAttempt
                    ? `${percent}% Credit`
                    : `${percent}% Correct`
                : `${percent} %`;

            checkWorkComponent = (
                <Button
                    id={id + "_partial"}
                    style={checkWorkStyle}
                    tabIndex={checkWorkTabIndex}
                >
                    {checkWorkText}
                </Button>
            );
        }
    } else {
        // showCorrectness is false
        checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
        const checkWorkText = showText ? <>&nbsp; Response Saved</> : "";

        if (!showText) {
            checkWorkStyle.padding = "1px 8px 1px 4px"; // To center the faCloud icon
        }
        checkWorkComponent = (
            <Button
                id={id + "_saved"}
                style={checkWorkStyle}
                tabIndex={checkWorkTabIndex}
            >
                <FontAwesomeIcon icon={faCloud as IconProp} />
                &nbsp; Response Saved
            </Button>
        );
    }

    if (SVs.numAttemptsLeft < 1) {
        checkWorkComponent = (
            <>
                {checkWorkComponent}
                <span>(no attempts remaining)</span>
            </>
        );
    } else if (SVs.numAttemptsLeft === 1) {
        checkWorkComponent = (
            <>
                {checkWorkComponent}
                <span>(1 attempt remaining)</span>
            </>
        );
    } else if (Number.isFinite(SVs.numAttemptsLeft)) {
        checkWorkComponent = (
            <>
                {checkWorkComponent}
                <span>({SVs.numAttemptsLeft} attempts remaining)</span>
            </>
        );
    }

    if (SVs.creditIsReducedByAttempt) {
        checkWorkComponent = (
            <>
                {checkWorkComponent}
                <span>(wrong answers reduce credit)</span>
            </>
        );
    }

    return checkWorkComponent;
}
