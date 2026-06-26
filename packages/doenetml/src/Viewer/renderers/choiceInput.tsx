import React, {
    createContext,
    useContext,
    useMemo,
    useRef,
    useState,
} from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { MathJax } from "better-react-mathjax";
import Select, { components, MultiValue, OnChangeValue } from "react-select";
import { CANVAS_DARK_MODE_COLOR } from "@doenet/utils/style";
import { DocContext } from "../DocViewer";
import "./choiceInput.css";
import {
    calculateValidationState,
    createCheckWorkComponent,
} from "./utils/checkWork";
import { DescriptionPopover } from "./utils/Description";
import { addValidationStateToShortDescription } from "./utils/validationState";
import { getBlockMarginWithOptionalTopSuppression } from "./utils/nonInlineMediaLayout";
import { useSubmitActionWithDelay } from "./utils/useSubmitActionWithDelay";

// type guard
const isMultiValue = <T,>(
    val: OnChangeValue<T, boolean>,
): val is MultiValue<T> => {
    return Array.isArray(val);
};

type Option = { value: number; label: any; isDisabled: boolean };

/**
 * The ChoiceInputInlineContext provides information about two modifications needed in descendants
 * 1. isHidden: indicates that the content is being rendered invisibly to size the select input.
 *    It is used by the math renderer to turn off hideUntilTypeset, which would cause it to
 *    overwrite the invisible rendering and add tab stops to the invisible content.
 * 2. inOption: indicates that the content is being rendered inside a selected
 *    (highlighted) select option. Because a selected option uses a dark
 *    background, it is used to turn off color specifications so that the font
 *    color can be set to white for contrast. (With selectMultiple, more than
 *    one option can be selected at once.) Unselected options and the displayed
 *    value render with their own style colors.
 */
export const ChoiceInputInlineContext = createContext<{
    isHidden: boolean;
    inOption: boolean;
}>({ isHidden: false, inOption: false });

interface ChoiceInputSVs {
    [key: string]: any;
    hidden: boolean;
    disabled: boolean;
    inline: boolean;
    label: string;
    labelHasLatex: boolean;
    labelPosition: string;
    justSubmitted: boolean;
    forceFullCheckWorkButton: boolean;
    forceSmallCheckWorkButton: boolean;
    colorCorrectness: boolean;
    choiceChildIndices: any;
    choiceOrder: any;
    choicesDisabled: any;
    choicesHidden: any;
    descriptionChildInd: any;
    externalLabelRendererIds: any;
    immediateValue: any;
    placeHolder: any;
    renderInlineForListItem: boolean;
    selectedIndices: any;
}

export default React.memo(function ChoiceInput(props: UseDoenetRendererProps) {
    let { id, SVs, actions, children, ignoreUpdate, callAction } =
        useDoenetRenderer<ChoiceInputSVs>(props);

    const { darkMode } = useContext(DocContext) || {};

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
    const { isPending, submitActionWithPending } = useSubmitActionWithDelay({
        actionKey: "submitAnswer",
        actions,
        callAction,
        validationState,
        justSubmitted: SVs.justSubmitted,
    });

    function onFocusChanged(focused: boolean) {
        callAction({
            action: actions.focusChanged,
            args: { focused },
        });
    }

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

    let label: React.ReactNode = SVs.label;
    const hasLabel =
        typeof SVs.label === "string" ? SVs.label.trim() !== "" : !!SVs.label;
    const labelId = `${id}-label`;
    const inlineInputId = `${id}_input`;
    if (SVs.labelHasLatex) {
        label = (
            <MathJax hideUntilTypeset={"first"} inline dynamic>
                {label}
            </MathJax>
        );
    }

    let shortDescription = SVs.shortDescription || undefined;
    const externalLabelRendererIds = SVs.externalLabelRendererIds ?? [];
    const inlineLabelledByIds = [
        hasLabel ? labelId : null,
        ...externalLabelRendererIds,
    ]
        .filter(Boolean)
        .join(" ");

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

    // For inline, the default is a small check work button,
    // for non-inline, the default is a full check work button
    const fullCheckWork = SVs.inline
        ? SVs.forceFullCheckWorkButton
        : SVs.forceFullCheckWorkButton || !SVs.forceSmallCheckWorkButton;

    const checkWorkComponent = createCheckWorkComponent(
        SVs,
        id,
        validationState,
        submitActionWithPending,
        fullCheckWork,
        isPending,
    );

    const inlineSelectComponents = useMemo(
        () => ({
            // Disable pointer events on option content to keep MathJax from
            // interfering with option selection.
            Option: (props: any) => (
                <components.Option {...props}>
                    {/*
                     * Render the option content with its style colors, except
                     * for selected options, which are highlighted with a dark
                     * background. There, the text color is left to react-select
                     * (white) for contrast.
                     */}
                    <ChoiceInputInlineContext.Provider
                        value={{
                            isHidden: false,
                            inOption: !!props.isSelected,
                        }}
                    >
                        <div style={{ pointerEvents: "none" }}>
                            {props.label}
                        </div>
                    </ChoiceInputInlineContext.Provider>
                </components.Option>
            ),
            // Add aria-details to the internal input used by react-select.
            Input: (props: any) => (
                <components.Input {...props} aria-details={descriptionId} />
            ),
        }),
        [descriptionId],
    );

    if (SVs.inline) {
        // since we color correctness for inline choiceInput,
        // modify shortDescription to include correctness state
        if (SVs.colorCorrectness) {
            shortDescription = addValidationStateToShortDescription(
                validationState,
                shortDescription,
            );
        }

        const choiceChildren = SVs.choiceChildIndices.map(
            (ind: number) => children[ind],
        );

        let choiceOptions = (SVs.choiceOrder as number[])
            .map((v) => choiceChildren[v - 1])
            .map(function (child, i) {
                if (SVs.choicesHidden[i]) {
                    return null;
                }
                return {
                    value: i + 1,
                    label: child,
                    isDisabled: !!SVs.choicesDisabled[i],
                };
            })
            .filter((opt) => opt !== null) as Option[];

        const getOptionFromIndex = (index: number) => {
            return choiceOptions[index - 1];
        };

        const valuePadding = "2px 0px 2px 6px";

        let inputClasses = "custom-select";

        if (disabled) {
            inputClasses += " custom-select-disabled";
        }

        if (SVs.colorCorrectness) {
            inputClasses += ` custom-select-${validationState}`;
        }

        const menuPortalTarget =
            typeof document === "undefined" ? undefined : document.body;

        // The dropdown menu is portaled to document.body, which sits outside
        // the `data-theme` wrapper, so its CSS custom properties don't resolve
        // to the dark-mode values. Drive the colors from the doc-level dark mode
        // instead. (These mirror the `--canvas` / `--canvasText` palette.)
        const isDark = darkMode === "dark";
        const surfaceColor = isDark ? CANVAS_DARK_MODE_COLOR : "#fff";
        const onSurfaceColor = isDark ? "#fff" : "#000";
        // The dropdown is a floating surface: in dark mode it must read as
        // *elevated* above the canvas, so use a lighter surface plus a border
        // rather than the same color as the canvas (which would be invisible).
        const menuSurfaceColor = isDark ? "#2a2a2a" : "#fff";
        const focusedOptionColor = isDark ? "#3d3d3d" : "#e9ecef";
        const menuBorder = isDark ? "1px solid #555" : undefined;

        const customStyles = {
            control: (provided: any) => ({
                ...provided,
                background: surfaceColor,
                color: onSurfaceColor,
                minHeight: "0.8lh",
                pointerEvents: disabled ? "auto" : undefined,
                boxShadow: "none",
                border: "none",
            }),

            singleValue: (provided: any) => ({
                ...provided,
                color: onSurfaceColor,
            }),

            valueContainer: (provided: any) => ({
                ...provided,
                padding: valuePadding,
            }),

            input: (provided: any) => ({
                ...provided,
                margin: "0px",
                color: onSurfaceColor,
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
            menu: (provided: any) => ({
                ...provided,
                backgroundColor: menuSurfaceColor,
                border: menuBorder,
            }),
            option: (provided: any, state: any) => ({
                ...provided,
                cursor: state.isDisabled ? "not-allowed" : "pointer",
                backgroundColor: state.isSelected
                    ? "#0056b3" // Darker blue for better contrast
                    : state.isFocused
                      ? focusedOptionColor
                      : menuSurfaceColor,
                color: state.isSelected ? "#fff" : onSurfaceColor,
            }),
            menuPortal: (provided: any) => ({
                ...provided,
                fontSize: "80%",
                zIndex: 9999,
            }),
        };

        // The select is wrapped in a grid with an invisible ghost element
        // that has all options rendered. This allows the select to
        // dynamically size to fit the widest option.
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
                        visibility: "hidden",
                        height: 0,
                        padding: valuePadding,
                        border: "1px solid transparent",
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
                        value={{ isHidden: false, inOption: false }}
                    >
                        <Select
                            id={id}
                            inputId={inlineInputId}
                            isMulti={SVs.selectMultiple}
                            styles={customStyles}
                            options={choiceOptions}
                            components={inlineSelectComponents}
                            menuPortalTarget={menuPortalTarget}
                            menuPlacement="auto"
                            className={inputClasses}
                            onChange={onChangeHandlerInline}
                            value={rendererSelectedIndices.map((ind) =>
                                getOptionFromIndex(ind),
                            )}
                            placeholder={SVs.placeHolder}
                            isDisabled={disabled}
                            isOptionDisabled={(opt) => !!opt.isDisabled}
                            aria-labelledby={inlineLabelledByIds || undefined}
                            aria-label={
                                !inlineLabelledByIds
                                    ? shortDescription
                                    : undefined
                            }
                            aria-description={
                                inlineLabelledByIds
                                    ? shortDescription
                                    : undefined
                            }
                            // Note: aria-details added in CustomInput
                        />
                    </ChoiceInputInlineContext.Provider>
                </div>
            </div>
        );

        const labelComponent = hasLabel ? (
            <label
                id={labelId}
                htmlFor={inlineInputId}
                style={{
                    marginRight:
                        SVs.labelPosition === "right" ? undefined : "4px",
                    marginLeft:
                        SVs.labelPosition === "right" ? "4px" : undefined,
                }}
            >
                {label}
            </label>
        ) : null;

        const inputRow = (
            <span
                style={{
                    display: "inline-flex",
                    alignItems: "flex-start",
                    // The input row flows as inline content (see the container
                    // comment). `vertical-align: baseline` aligns it with the
                    // text baseline of its line.
                    verticalAlign: "baseline",
                }}
            >
                {selectWithDynamicWidth}
                {checkWorkComponent}
                {description}
            </span>
        );

        return (
            <span
                // `display: inline` so the label and select flow with the
                // surrounding paragraph text and a wrapping label keeps the
                // select after its end rather than beside its first line
                // (#1245). See mathInput.tsx for the full rationale.
                style={{
                    display: "inline",
                }}
                id={id + "-container"}
                onFocus={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        onFocusChanged(true);
                    }
                }}
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        onFocusChanged(false);
                    }
                }}
            >
                {SVs.labelPosition === "right" ? (
                    <>
                        {inputRow}
                        {labelComponent}
                    </>
                ) : (
                    <>
                        {labelComponent}
                        {inputRow}
                    </>
                )}
            </span>
        );
    } else {
        // Non-inline choice input

        let inputKey = id;
        let listStyle = {
            listStyleType: "none",
            marginTop: hasLabel ? "10px" : "0px",
            marginBottom: checkWorkComponent ? "10px" : "0px",
        };

        const groupLabelledByIds = [
            hasLabel ? labelId : null,
            ...externalLabelRendererIds,
        ]
            .filter(Boolean)
            .join(" ");

        let keyBeginning = inputKey + "_choice";
        let inputType = "radio";
        if (SVs.selectMultiple) {
            inputType = "checkbox";
        }

        const choiceChildren = SVs.choiceChildIndices.map(
            (ind: number) => children[ind],
        );

        let choiceDoenetTags = (SVs.choiceOrder as number[])
            .map((v) => choiceChildren[v - 1])
            .map(function (child, i) {
                if (SVs.choicesHidden[i]) {
                    return null;
                }
                if (inputType == "radio") {
                    // selectMultiple="false"
                    let radioDisabled = disabled || SVs.choicesDisabled[i];
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
                                <span style={{ marginLeft: "2px" }}>
                                    {child}
                                </span>
                            </label>
                        </li>
                    );
                } else if (inputType == "checkbox") {
                    // selectMultiple="true"
                    let checkboxDisabled = disabled || SVs.choicesDisabled[i];
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
                                        disabled || SVs.choicesDisabled[i]
                                    }
                                />
                                <span className={checkboxClassName} />
                                <span style={{ marginLeft: "2px" }}>
                                    {child}
                                </span>
                            </label>
                        </li>
                    );
                }
            });

        const nonInlineLabelComponent = hasLabel ? (
            <legend id={labelId}>{label}</legend>
        ) : null;

        return (
            <fieldset
                id={inputKey}
                style={{
                    margin: getBlockMarginWithOptionalTopSuppression({
                        suppressTopMargin:
                            SVs.renderInlineForListItem && !SVs.inline,
                        top: 16,
                        bottom: 16,
                    }),
                    padding: 0,
                    border: "none",
                    minInlineSize: 0,
                }}
                aria-labelledby={groupLabelledByIds || undefined}
                aria-label={!groupLabelledByIds ? shortDescription : undefined}
                aria-description={
                    groupLabelledByIds ? shortDescription : undefined
                }
                aria-details={descriptionId}
                onFocus={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        onFocusChanged(true);
                    }
                }}
                onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        onFocusChanged(false);
                    }
                }}
            >
                {nonInlineLabelComponent}
                <ul style={listStyle}>{choiceDoenetTags}</ul>
                <span style={{ display: "inline-flex", alignItems: "start" }}>
                    {checkWorkComponent}
                    {description}
                </span>
            </fieldset>
        );
    }
});
