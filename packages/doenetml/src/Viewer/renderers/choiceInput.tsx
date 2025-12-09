import React, { useRef, useState } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { MathJax } from "better-react-mathjax";
import "./choiceInput.css";
import {
    calculateValidationState,
    createCheckWorkComponent,
} from "./utils/checkWork";

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

    const validationState = calculateValidationState(SVs);
    const submitAnswer = () =>
        callAction({
            action: actions.submitAnswer,
        });

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

    const description = SVs.description || undefined;

    if (SVs.inline) {
        let selectStyle: React.CSSProperties = {};

        if (disabled) {
            selectStyle.cursor = "not-allowed";
            selectStyle.borderColor = getComputedStyle(
                document.documentElement,
            ).getPropertyValue("--mainGray");
        }

        const checkWorkComponent = createCheckWorkComponent(
            SVs,
            id,
            validationState,
            submitAnswer,
            false,
        );

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
                        aria-label={description}
                    >
                        <option hidden={true} value="">
                            {SVs.placeHolder}
                        </option>
                        {optionsList}
                    </select>
                </label>
                {checkWorkComponent}
            </React.Fragment>
        );
    } else {
        let checkWorkComponent = createCheckWorkComponent(
            SVs,
            id,
            validationState,
            submitAnswer,
            true,
        );

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

        children = children.filter((child) => child !== null);

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
                        <li>
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
                        </li>
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
                        <li>
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
                                    disabled={
                                        disabled || svData.choicesDisabled[i]
                                    }
                                />
                                <span className={checkboxClassName} />
                                <label
                                    htmlFor={keyBeginning + (i + 1) + "_input"}
                                    style={{ marginLeft: "2px" }}
                                >
                                    {child}
                                </label>
                            </label>
                        </li>
                    );
                }
            });

        return (
            <div id={inputKey + "-label"}>
                {label}
                <ul id={inputKey} style={listStyle}>
                    {choiceDoenetTags}
                </ul>
                {checkWorkComponent}
            </div>
        );
    }
});
