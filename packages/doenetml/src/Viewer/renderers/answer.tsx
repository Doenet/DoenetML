import React, { useContext } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faLevelDownAlt,
    faTimes,
    faCloud,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { DocContext } from "../DocViewer";
import { AnswerResponseMenu } from "./utils/AnswerResponseMenu";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

// Moved most of checkWorkStyle styling into Button
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

export default React.memo(function Answer(props) {
    let { name, id, SVs, docId, activityId, actions, children, callAction } =
        useDoenetRenderer(props);

    const { showAnswerResponseMenu, answerResponseCounts } =
        useContext(DocContext) || {};

    if (SVs.hidden) {
        return null;
    }

    let disabled = SVs.disabled;

    let submitAnswer = () =>
        callAction({
            action: actions.submitAnswer,
        });
    if (SVs.submitAllAnswersAtAncestor) {
        submitAnswer = () =>
            callAction({
                action: actions.submitAllAnswers,
            });
    }

    // BADBADBAD: need to redo how getting the input child
    // without using the internal guts of componentInstructions
    // is just asking for trouble

    let inputChildrenToRender = null;
    if (SVs.inputChildren.length > 0) {
        let inputChildNames = SVs.inputChildren.map((x) => x.componentIdx);
        inputChildrenToRender = children.filter(
            //child might be null or a string
            (child) =>
                child &&
                typeof child !== "string" &&
                inputChildNames.includes(
                    // @ts-ignore
                    child.props.componentInstructions.componentIdx,
                ),
        );
    }

    let answerResponseMenu = null;
    if (showAnswerResponseMenu) {
        answerResponseMenu = (
            <AnswerResponseMenu
                answerId={name}
                docId={docId}
                activityId={activityId}
                numResponses={answerResponseCounts?.[name]}
            />
        );
    }

    if (!SVs.delegateCheckWork && !SVs.suppressCheckwork) {
        let validationState = "unvalidated";
        if (SVs.justSubmitted || SVs.numAttemptsLeft < 1) {
            if (SVs.creditAchieved === 1) {
                validationState = "correct";
            } else if (SVs.creditAchieved === 0) {
                validationState = "incorrect";
            } else {
                validationState = "partialcorrect";
            }
        }

        let checkWorkStyle: React.CSSProperties = {
            cursor: "pointer",
            padding: "1px 6px 1px 6px",
        };

        let checkWorkTabIndex = "0";
        if (disabled) {
            checkWorkStyle.backgroundColor = getComputedStyle(
                document.documentElement,
            ).getPropertyValue("--mainGray");
            checkWorkStyle.color = "black";
            checkWorkStyle.cursor = "not-allowed";
            checkWorkTabIndex = "-1";
        }

        let checkWorkText = SVs.submitLabel;
        if (!SVs.showCorrectness) {
            checkWorkText = SVs.submitLabelNoCorrectness;
        }
        let checkworkComponent = (
            <Button
                id={id + "_submit"}
                tabIndex={+checkWorkTabIndex}
                disabled={disabled}
                style={checkWorkStyle}
                onClick={submitAnswer}
            >
                <FontAwesomeIcon
                    icon={faLevelDownAlt as IconProp}
                    transform={{ rotate: 90 }}
                />
                &nbsp;
                {checkWorkText}
            </Button>
        );

        if (SVs.showCorrectness) {
            if (validationState === "correct") {
                checkWorkStyle.backgroundColor = getComputedStyle(
                    document.documentElement,
                ).getPropertyValue("--mainGreen");
                checkworkComponent = (
                    <Button
                        id={id + "_correct"}
                        style={checkWorkStyle}
                        tabIndex={+checkWorkTabIndex}
                    >
                        <FontAwesomeIcon icon={faCheck as IconProp} />
                        &nbsp; Correct
                    </Button>
                );
            } else if (validationState === "incorrect") {
                checkWorkStyle.backgroundColor = getComputedStyle(
                    document.documentElement,
                ).getPropertyValue("--mainRed");
                checkworkComponent = (
                    <Button
                        id={id + "_incorrect"}
                        style={checkWorkStyle}
                        tabIndex={+checkWorkTabIndex}
                    >
                        <FontAwesomeIcon icon={faTimes as IconProp} />
                        &nbsp; Incorrect
                    </Button>
                );
            } else if (validationState === "partialcorrect") {
                checkWorkStyle.backgroundColor = "#efab34";
                let percent = Math.round(SVs.creditAchieved * 100);
                let partialCreditContents = `${percent}% Correct`;

                checkworkComponent = (
                    <Button
                        id={id + "_partial"}
                        style={checkWorkStyle}
                        tabIndex={+checkWorkTabIndex}
                    >
                        {partialCreditContents}
                    </Button>
                );
            }
        } else {
            // showCorrectness is false
            if (validationState !== "unvalidated") {
                checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
                checkworkComponent = (
                    <Button
                        id={id + "_saved"}
                        style={checkWorkStyle}
                        tabIndex={+checkWorkTabIndex}
                    >
                        <FontAwesomeIcon icon={faCloud as IconProp} />
                        &nbsp; Response Saved
                    </Button>
                );
            }
        }

        if (SVs.numAttemptsLeft < 0) {
            checkworkComponent = (
                <>
                    {checkworkComponent}
                    <span>(no attempts remaining)</span>
                </>
            );
        } else if (SVs.numAttemptsLeft == 1) {
            checkworkComponent = (
                <>
                    {checkworkComponent}
                    <span>(1 attempt remaining)</span>
                </>
            );
        } else if (Number.isFinite(SVs.numAttemptsLeft)) {
            checkworkComponent = (
                <>
                    {checkworkComponent}
                    <span>({SVs.numAttemptsLeft} attempts remaining)</span>
                </>
            );
        }

        return (
            <span id={id} style={{ marginBottom: "4px" }}>
                {inputChildrenToRender}
                {checkworkComponent}
                {answerResponseMenu}
            </span>
        );
    } else {
        return (
            <span id={id} style={{ marginBottom: "4px" }}>
                {inputChildrenToRender}
                {answerResponseMenu}
            </span>
        );
    }
});
