import React, { useRef, useState } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { MathJax } from "better-react-mathjax";
import Select, { components } from "react-select";
import "./choiceInput.css";
import {
    calculateValidationState,
    createCheckWorkComponent,
} from "./utils/checkWork";
import { DescriptionPopover } from "./utils/Description";

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

    const shortDescription = SVs.shortDescription || undefined;

    const descriptionChild =
        SVs.descriptionChildInd !== -1 && children[SVs.descriptionChildInd];

    let descriptionId: string | undefined = undefined;
    let description: React.ReactNode | null = null;

    if (descriptionChild) {
        descriptionId = `${id}-description-content`;
        description = (
            <DescriptionPopover>
                <div id={descriptionId}>{descriptionChild}</div>
            </DescriptionPopover>
        );
    }

    if (SVs.inline) {
        let svData = SVs;
        // XXX: newInline attribute and always use new format
        // once we get it working
        // Issues remaining to be solved before we merge in this code:
        // 1. The styling for a focused input needs to be clearer.
        //    Should it have the outline border like the others?
        // 2. When a choice has math, the keyboard navigation is broken.
        // 3. When a choice has math and is selected, the text is still black in the menu
        //    and the contrast between the text and blue background is too low.
        if (SVs.newInline) {
            const customOption = (props: any) => {
                return (
                    <components.Option {...props}>
                        <div style={{ pointerEvents: "none" }}>
                            {props.label}
                        </div>
                    </components.Option>
                );
            };

            const choiceChildren = SVs.choiceChildIndices.map(
                (ind: number) => children[ind],
            );

            let choiceOptions = (SVs.choiceOrder as number[])
                .map((v) => choiceChildren[v - 1])
                .map(function (child, i) {
                    if (svData.choicesHidden[i]) {
                        return null;
                    }
                    return { value: i + 1, label: child };
                });

            const valuePadding = "2px 0px 2px 6px";

            const customStyles = {
                control: (provided: any, state: any) => ({
                    ...provided,
                    background: "#fff",
                    borderColor: "#9e9e9e",
                    minHeight: "0.8lh",
                    boxShadow: state.isFocused ? null : null,
                }),

                valueContainer: (provided: any, state: any) => ({
                    ...provided,
                    padding: valuePadding,
                }),

                input: (provided: any, state: any) => ({
                    ...provided,
                    margin: "0px",
                }),
                indicatorSeparator: (state: any) => ({
                    display: "none",
                }),
                indicatorsContainer: (provided: any, state: any) => ({
                    ...provided,
                    height: "0.8lh",
                }),
                dropdownIndicator: (provided: any, state: any) => ({
                    ...provided,
                    padding: "2px",
                }),
            };

            return (
                // 1. Grid wrapper: 'inline-grid' makes it shrink, '1fr' aligns the stack
                <div
                    style={{
                        display: "inline-grid",
                        gridTemplateColumns: "1fr",
                        alignItems: "center",
                        verticalAlign: "0.6ex",
                        fontSize: "80%",
                    }}
                >
                    {/* 2. Ghost Element: Invisible, but dictates the width */}
                    <div
                        style={{
                            gridArea: "1 / 1 / 2 / 2", // row 1, col 1
                            visibility: "hidden", // Hide it
                            height: 0, // Take up no vertical space
                            padding: valuePadding,
                            border: "1px solid transparent", // Add border width if your Select has borders
                            whiteSpace: "nowrap", // Prevent wrapping
                            overflow: "hidden",
                        }}
                    >
                        {/* Render all of the labels here so the browser calculates the width */}

                        {choiceOptions
                            .filter((opt) => opt !== null)
                            .map((opt) => (
                                <div
                                    key={opt.value}
                                    style={{
                                        whiteSpace: "nowrap", // Force single line
                                        padding: valuePadding,
                                    }}
                                >
                                    {opt.label}

                                    {/* Add buffer space for the Dropdown Arrow. */}
                                    <span
                                        style={{
                                            display: "inline-block",
                                            width: "22px",
                                        }}
                                    >
                                        hi
                                    </span>
                                </div>
                            ))}
                    </div>

                    {/* 3. The Actual Select */}
                    <div
                        style={{
                            gridArea: "1 / 1 / 2 / 2", // also row 1, col 1, so on top of ghost
                            width: "100%",
                        }}
                    >
                        <Select
                            styles={customStyles}
                            options={choiceOptions}
                            components={{ Option: customOption }}
                            menuPlacement="auto"
                        />
                    </div>
                </div>
            );
        } else {
            // inline="true", not newInline
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

            let optionsList = SVs.choiceTexts.map(function (
                s: number,
                i: number,
            ) {
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

            return (
                <span
                    style={{ display: "inline-flex", alignItems: "start" }}
                    id={id + "-container"}
                >
                    <span
                        style={{ display: "inline-flex", alignItems: "center" }}
                    >
                        <label
                            style={{
                                display: "inline-flex",
                                maxWidth: "100%",
                            }}
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
                                aria-label={shortDescription}
                                aria-details={descriptionId}
                            >
                                <option hidden={true} value="">
                                    {SVs.placeHolder}
                                </option>
                                {optionsList}
                            </select>
                        </label>
                        {checkWorkComponent}
                    </span>
                    {description}
                </span>
            );
        }
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
            marginTop: label ? "10px" : "0px",
            marginBottom: checkWorkComponent ? "10px" : "0px",
        };

        let keyBeginning = inputKey + "_choice";
        let inputType = "radio";
        if (SVs.selectMultiple) {
            inputType = "checkbox";
        }

        let svData = SVs;

        const choiceChildren = SVs.choiceChildIndices.map(
            (ind: number) => children[ind],
        );

        let choiceDoenetTags = (SVs.choiceOrder as number[])
            .map((v) => choiceChildren[v - 1])
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
                        <li key={i}>
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
                        <li key={i}>
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
            <div id={inputKey + "-label"} style={{ margin: "16px 0" }}>
                {label}
                <ul
                    id={inputKey}
                    style={listStyle}
                    aria-label={shortDescription}
                    aria-details={descriptionId}
                >
                    {choiceDoenetTags}
                </ul>
                <span style={{ display: "inline-flex", alignItems: "start" }}>
                    {checkWorkComponent}
                    {description}
                </span>
            </div>
        );
    }
});
