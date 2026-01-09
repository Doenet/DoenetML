import React, { createContext, useRef, useState } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { MathJax } from "better-react-mathjax";
import Select, { components, MultiValue, OnChangeValue } from "react-select";
import "./choiceInput.css";
import {
    calculateValidationState,
    createCheckWorkComponent,
} from "./utils/checkWork";
import { DescriptionPopover } from "./utils/Description";

// type guard
const isMultiValue = <T,>(
    val: OnChangeValue<T, boolean>,
): val is MultiValue<T> => {
    return Array.isArray(val);
};

type Option = { value: number; label: any; isDisabled: boolean };

export const ChoiceInputInlineContext = createContext<{
    isHidden: boolean;
    inOption: boolean;
}>({ isHidden: false, inOption: false });

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

    function onChangeHandlerInline(newValue: OnChangeValue<Option, boolean>) {
        let newSelectedIndices: number[] = [];

        if (isMultiValue(newValue)) {
            newSelectedIndices = newValue.map((v) => Number(v.value));
        } else if (newValue) {
            newSelectedIndices = [Number(newValue.value)];
        }

        finishChangeHandler(newSelectedIndices);
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

        finishChangeHandler(newSelectedIndices);
    }

    function finishChangeHandler(newSelectedIndices: number[]) {
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

    const checkWorkComponent = createCheckWorkComponent(
        SVs,
        id,
        validationState,
        submitAnswer,
        !SVs.inline,
    );

    if (SVs.inline) {
        let svData = SVs;
        const CustomOption = (props: any) => {
            return (
                <components.Option {...props}>
                    <div style={{ pointerEvents: "none" }}>{props.label}</div>
                </components.Option>
            );
        };

        const CustomInput = (props: any) => {
            return <components.Input {...props} aria-details={descriptionId} />;
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
                return {
                    value: i + 1,
                    label: child,
                    isDisabled: !!svData.choicesDisabled[i],
                };
            })
            .filter((opt) => opt !== null) as Option[];

        const getOptionFromIndex = (index: number) => {
            return choiceOptions[index - 1];
        };

        const valuePadding = "2px 0px 2px 6px";

        let selectStyle: React.CSSProperties = {};

        if (disabled) {
            selectStyle.cursor = "not-allowed";
            selectStyle.borderColor = getComputedStyle(
                document.documentElement,
            ).getPropertyValue("--mainGray");
        } else {
            selectStyle.cursor = "pointer";
            selectStyle.border = getComputedStyle(
                document.documentElement,
            ).getPropertyValue("--mainBorder");
        }

        const customStyles = {
            control: (provided: any) => ({
                ...provided,
                ...selectStyle,
                background: "#fff",
                minHeight: "0.8lh",
                pointerEvents: disabled ? "auto" : undefined,
                boxShadow: "none",
            }),

            valueContainer: (provided: any) => ({
                ...provided,
                padding: valuePadding,
            }),

            input: (provided: any) => ({
                ...provided,
                margin: "0px",
            }),
            indicatorSeparator: () => ({
                display: "none",
            }),
            indicatorsContainer: (provided: any) => ({
                ...provided,
                height: "0.8lh",
            }),
            dropdownIndicator: (provided: any) => ({
                ...provided,
                padding: "2px",
            }),
            option: (provided: any, state: any) => ({
                ...provided,
                cursor: state.isDisabled ? "not-allowed" : "pointer",
                backgroundColor: state.isSelected
                    ? "#0056b3" // Darker blue for better contrast
                    : state.isFocused
                      ? "#e9ecef"
                      : "#fff",
                color: state.isSelected ? "#fff" : "#000",
            }),
        };

        const selectWithDynamicWidth = (
            // 1. Grid wrapper: 'inline-grid' makes it shrink, '1fr' aligns the stack
            <div
                style={{
                    display: "inline-grid",
                    gridTemplateColumns: "1fr",
                    alignItems: "center",
                    verticalAlign: "middle",
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
                    <ChoiceInputInlineContext.Provider
                        value={{ isHidden: true, inOption: false }}
                    >
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
                                            width: "30px",
                                        }}
                                    ></span>
                                </div>
                            ))}
                    </ChoiceInputInlineContext.Provider>
                </div>

                {/* 3. The Actual Select */}
                <div
                    style={{
                        gridArea: "1 / 1 / 2 / 2", // also row 1, col 1, so on top of ghost
                        width: "100%",
                    }}
                >
                    <ChoiceInputInlineContext.Provider
                        value={{ isHidden: false, inOption: true }}
                    >
                        <Select
                            id={id}
                            isMulti={SVs.selectMultiple}
                            styles={customStyles}
                            options={choiceOptions}
                            components={{
                                Option: CustomOption,
                                Input: CustomInput,
                            }}
                            menuPlacement="auto"
                            className="custom-select"
                            onChange={onChangeHandlerInline}
                            value={rendererSelectedIndices.map((ind) =>
                                getOptionFromIndex(ind),
                            )}
                            placeholder={SVs.placeHolder}
                            isDisabled={disabled}
                            isOptionDisabled={(opt) => !!opt.isDisabled}
                            aria-label={shortDescription}
                            aria-details={descriptionId}
                        />
                    </ChoiceInputInlineContext.Provider>
                </div>
            </div>
        );

        return (
            <span
                style={{ display: "inline-flex", alignItems: "start" }}
                id={id + "-container"}
            >
                <span style={{ display: "inline-flex", alignItems: "center" }}>
                    <label
                        style={{
                            display: "inline-flex",
                            maxWidth: "100%",
                        }}
                        id={id + "-label"}
                    >
                        {label}
                        {selectWithDynamicWidth}
                    </label>
                    {checkWorkComponent}
                </span>
                {description}
            </span>
        );
    } else {
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
