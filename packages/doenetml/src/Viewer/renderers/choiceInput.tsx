import React, { useContext, useRef, useState } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faLevelDownAlt,
    faTimes,
    faCloud,
} from "@fortawesome/free-solid-svg-icons";
import { MathJax } from "better-react-mathjax";
import styled from "styled-components";
import "./choiceInput.css";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

// Moved most of checkWorkStyle styling into Button
const Button = styled.button`
    position: relative;
    /* width: 24px; */
    height: 24px;
    color: #ffffff;
    background-color: var(--mainBlue);
    display: inline-block;
    text-align: center;
    padding: 2px;
    z-index: 0;
    /* border: var(--mainBorder); */
    border: none;
    border-radius: var(--mainBorderRadius);
    margin: 0px 4px 4px 0px;

    &:hover {
        background-color: var(--lightBlue);
        color: black;
    }
`;

export default React.memo(function ChoiceInput(props: UseDoenetRendererProps) {
    let { id, SVs, actions, children, ignoreUpdate, callAction } =
        useDoenetRenderer(props);

    // @ts-ignore
    ChoiceInput.baseStateVariable = "selectedIndices";

    const [rendererSelectedIndices, setRendererSelectedIndices] = useState<
        number[]
    >(SVs.selectedIndices);

    let selectedIndicesWhenSetState = useRef(null);

    if (
        !ignoreUpdate &&
        selectedIndicesWhenSetState.current !== SVs.selectedIndices
    ) {
        // console.log(`setting value to ${SVs.immediateValue}`)
        setRendererSelectedIndices(SVs.selectedIndices);
        selectedIndicesWhenSetState.current = SVs.selectedIndices;
    } else {
        selectedIndicesWhenSetState.current = null;
    }

    let validationState = "unvalidated";
    if (SVs.valueHasBeenValidated || SVs.numAttemptsLeft < 1) {
        if (SVs.creditAchieved === 1) {
            validationState = "correct";
        } else if (SVs.creditAchieved === 0) {
            validationState = "incorrect";
        } else {
            validationState = "partialcorrect";
        }
    }

    function onChangeHandler(
        e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
    ) {
        let newSelectedIndices: number[] = [];

        if (SVs.inline) {
            if (e.target.value) {
                newSelectedIndices = Array.from(
                    (e as React.ChangeEvent<HTMLSelectElement>).target
                        .selectedOptions,
                    (option) => Number(option.value),
                );
            }
        } else {
            if (SVs.selectMultiple) {
                newSelectedIndices = [...rendererSelectedIndices];
                let index = Number(e.target.value);
                if ((e as React.ChangeEvent<HTMLInputElement>).target.checked) {
                    if (!newSelectedIndices.includes(index)) {
                        newSelectedIndices.push(index);
                        newSelectedIndices.sort((a, b) => a - b);
                    }
                } else {
                    let i = newSelectedIndices.indexOf(index);
                    if (i !== -1) {
                        newSelectedIndices.splice(i, 1);
                    }
                }
            } else {
                newSelectedIndices = [Number(e.target.value)];
            }
        }

        if (
            rendererSelectedIndices.length !== newSelectedIndices.length ||
            rendererSelectedIndices.some((v, i) => v != newSelectedIndices[i])
        ) {
            setRendererSelectedIndices(newSelectedIndices);
            selectedIndicesWhenSetState.current = SVs.selectedIndices;

            callAction({
                action: actions.updateSelectedIndices,
                args: {
                    selectedIndices: newSelectedIndices,
                },
                baseVariableValue: newSelectedIndices,
            });
        }
    }

    if (SVs.hidden) {
        return null;
    }

    let disabled = SVs.disabled;

    let label = SVs.label;
    if (SVs.labelHasLatex) {
        label = (
            <MathJax hideUntilTypeset={"first"} inline dynamic>
                {label}
            </MathJax>
        );
    }

    if (SVs.inline) {
        let checkWorkStyle: React.CSSProperties = {
            cursor: "pointer",
            padding: "1px 6px 1px 6px",
            width: "24px",
        };
        let checkWorkTabIndex = "0";

        let selectStyle: React.CSSProperties = {};

        if (disabled) {
            // Disable the checkWorkButton
            checkWorkStyle.backgroundColor = getComputedStyle(
                document.documentElement,
            ).getPropertyValue("--mainGray");
            checkWorkStyle.color = "black";
            checkWorkStyle.cursor = "not-allowed";
            checkWorkTabIndex = "-1";
            selectStyle.cursor = "not-allowed";
            selectStyle.borderColor = getComputedStyle(
                document.documentElement,
            ).getPropertyValue("--mainGray");
        }

        //Assume we don't have a check work button
        let checkWorkButton = null;
        if (SVs.includeCheckWork && !SVs.suppressCheckwork) {
            if (validationState === "unvalidated") {
                if (disabled) {
                    checkWorkStyle.backgroundColor = getComputedStyle(
                        document.documentElement,
                    ).getPropertyValue("--mainGray");
                }
                checkWorkButton = (
                    <Button
                        id={id + "_submit"}
                        disabled={disabled}
                        tabIndex={+checkWorkTabIndex}
                        // ref={c => { this.target = c && ReactDOM.findDOMNode(c); }}
                        style={checkWorkStyle}
                        onClick={() =>
                            callAction({
                                action: actions.submitAnswer,
                            })
                        }
                    >
                        <FontAwesomeIcon
                            style={
                                {
                                    /*marginRight: "4px", paddingLeft: "2px"*/
                                }
                            }
                            icon={faLevelDownAlt as IconProp}
                            transform={{ rotate: 90 }}
                        />
                    </Button>
                );
            } else {
                if (SVs.showCorrectness) {
                    if (validationState === "correct") {
                        checkWorkStyle.backgroundColor = getComputedStyle(
                            document.documentElement,
                        ).getPropertyValue("--mainGreen");
                        checkWorkButton = (
                            <Button
                                id={id + "_correct"}
                                style={checkWorkStyle}
                                tabIndex={+checkWorkTabIndex}
                            >
                                <FontAwesomeIcon icon={faCheck as IconProp} />
                            </Button>
                        );
                    } else if (validationState === "partialcorrect") {
                        //partial credit

                        let percent = Math.round(SVs.creditAchieved * 100);
                        let partialCreditContents = `${percent} %`;
                        checkWorkStyle.width = "44px";

                        checkWorkStyle.backgroundColor = "#efab34";
                        checkWorkButton = (
                            <Button
                                id={id + "_partial"}
                                style={checkWorkStyle}
                                tabIndex={+checkWorkTabIndex}
                            >
                                {partialCreditContents}
                            </Button>
                        );
                    } else {
                        //incorrect
                        checkWorkStyle.backgroundColor = getComputedStyle(
                            document.documentElement,
                        ).getPropertyValue("--mainRed");
                        checkWorkButton = (
                            <Button
                                id={id + "_incorrect"}
                                style={checkWorkStyle}
                                tabIndex={+checkWorkTabIndex}
                            >
                                <FontAwesomeIcon icon={faTimes as IconProp} />
                            </Button>
                        );
                    }
                } else {
                    // showCorrectness is false
                    checkWorkStyle.backgroundColor = "rgb(74, 3, 217)";
                    checkWorkStyle.padding = "1px 8px 1px 4px"; // To center the faCloud icon
                    checkWorkButton = (
                        <Button
                            id={id + "_saved"}
                            style={checkWorkStyle}
                            tabIndex={+checkWorkTabIndex}
                        >
                            <FontAwesomeIcon icon={faCloud as IconProp} />
                        </Button>
                    );
                }
            }

            if (SVs.numAttemptsLeft < 0) {
                checkWorkButton = (
                    <>
                        {checkWorkButton}
                        <span>(no attempts remaining)</span>
                    </>
                );
            } else if (SVs.numAttemptsLeft == 1) {
                checkWorkButton = (
                    <>
                        {checkWorkButton}
                        <span>(1 attempt remaining)</span>
                    </>
                );
            } else if (Number.isFinite(SVs.numAttemptsLeft)) {
                checkWorkButton = (
                    <>
                        {checkWorkButton}
                        <span>({SVs.numAttemptsLeft} attempts remaining)</span>
                    </>
                );
            }
        }

        let svData = SVs;
        let optionsList = SVs.choiceTexts.map(function (s: number, i: number) {
            if (svData.choicesHidden[i]) {
                return null;
            }
            return (
                <option
                    key={i + 1}
                    value={i + 1}
                    disabled={svData.choicesDisabled[i]}
                >
                    {s}
                </option>
            );
        });

        let selectValue =
            rendererSelectedIndices === undefined
                ? ""
                : !SVs.selectMultiple
                  ? (rendererSelectedIndices[0] ?? "")
                  : rendererSelectedIndices;

        // inline="true"
        return (
            <React.Fragment>
                <label
                    style={{ display: "inline-flex", maxWidth: "100%" }}
                    id={id + "-label"}
                >
                    {label}
                    <select
                        className="custom-select"
                        id={id}
                        onChange={onChangeHandler}
                        value={"" + selectValue}
                        disabled={disabled}
                        multiple={SVs.selectMultiple}
                        style={selectStyle}
                    >
                        <option hidden={true} value="">
                            {SVs.placeHolder}
                        </option>
                        {optionsList}
                    </select>
                </label>
                {checkWorkButton}
            </React.Fragment>
        );
    } else {
        let checkWorkStyle: React.CSSProperties = {
            height: "24px",
            display: "inline-block",
            padding: "1px 6px 1px 6px",
            cursor: "pointer",
            // fontWeight: "bold",
        };
        let checkWorkTabIndex = "0";

        if (disabled) {
            // Disable the checkWorkButton
            checkWorkStyle.backgroundColor = getComputedStyle(
                document.documentElement,
            ).getPropertyValue("--mainGray");
            checkWorkStyle.color = "black";
            checkWorkStyle.cursor = "not-allowed";
            checkWorkTabIndex = "-1";
        }

        let checkworkComponent = null;

        if (SVs.includeCheckWork && !SVs.suppressCheckwork) {
            if (validationState === "unvalidated") {
                let checkWorkText = SVs.submitLabel;
                if (!SVs.showCorrectness) {
                    checkWorkText = SVs.submitLabelNoCorrectness;
                }
                if (disabled) {
                    checkWorkStyle.backgroundColor = getComputedStyle(
                        document.documentElement,
                    ).getPropertyValue("--mainGray");
                }
                checkworkComponent = (
                    <Button
                        id={id + "_submit"}
                        tabIndex={+checkWorkTabIndex}
                        disabled={disabled}
                        style={checkWorkStyle}
                        onClick={() =>
                            callAction({
                                action: actions.submitAnswer,
                            })
                        }
                    >
                        <FontAwesomeIcon
                            style={
                                {
                                    /*marginRight: "4px", paddingLeft: "2px"*/
                                }
                            }
                            icon={faLevelDownAlt as IconProp}
                            transform={{ rotate: 90 }}
                        />
                        &nbsp;
                        {checkWorkText}
                    </Button>
                );
            } else {
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

        let inputKey = id;
        let listStyle = {
            listStyleType: "none",
        };

        let keyBeginning = inputKey + "_choice";
        let inputType = "radio";
        if (SVs.selectMultiple) {
            inputType = "checkbox";
        }

        let svData = SVs;

        let choiceDoenetTags = (SVs.choiceOrder as number[])
            .map((v) => children[v - 1])
            .map(function (child, i) {
                if (svData.choicesHidden[i]) {
                    return null;
                }
                if (inputType == "radio") {
                    // selectMultiple="false"
                    let radioDisabled = disabled || svData.choicesDisabled[i];
                    let containerClassName = "radio-container";
                    let radioClassName = "radio-checkmark";
                    if (radioDisabled) {
                        containerClassName += " radio-container-disabled";
                        radioClassName += " radio-checkmark-disabled";
                    }
                    return (
                        <label
                            className={containerClassName}
                            key={inputKey + "_choice" + (i + 1)}
                        >
                            <input
                                type="radio"
                                id={keyBeginning + (i + 1) + "_input"}
                                name={inputKey}
                                value={i + 1}
                                checked={rendererSelectedIndices.includes(
                                    i + 1,
                                )}
                                onChange={onChangeHandler}
                                disabled={radioDisabled}
                            />
                            <span className={radioClassName} />
                            <label
                                htmlFor={keyBeginning + (i + 1) + "_input"}
                                style={{ marginLeft: "2px" }}
                            >
                                {child}
                            </label>
                        </label>
                    );
                } else if (inputType == "checkbox") {
                    // selectMultiple="true"
                    let checkboxDisabled =
                        disabled || svData.choicesDisabled[i];
                    let containerClassName = "checkbox-container";
                    let checkboxClassName = "checkbox-checkmark";
                    if (checkboxDisabled) {
                        containerClassName += " checkbox-container-disabled";
                        checkboxClassName += " checkbox-checkmark-disabled";
                    }
                    return (
                        <label
                            className={containerClassName}
                            key={inputKey + "_choice" + (i + 1)}
                        >
                            <input
                                type="checkbox"
                                id={keyBeginning + (i + 1) + "_input"}
                                name={inputKey}
                                value={i + 1}
                                checked={rendererSelectedIndices.includes(
                                    i + 1,
                                )}
                                onChange={onChangeHandler}
                                disabled={disabled || svData.choicesDisabled[i]}
                            />
                            <span className={checkboxClassName} />
                            <label
                                htmlFor={keyBeginning + (i + 1) + "_input"}
                                style={{ marginLeft: "2px" }}
                            >
                                {child}
                            </label>
                        </label>
                    );
                }
            });

        return (
            <div id={inputKey + "-label"}>
                {label}
                <ol id={inputKey} style={listStyle}>
                    {choiceDoenetTags}
                </ol>
                {checkworkComponent}
            </div>
        );
    }
});
