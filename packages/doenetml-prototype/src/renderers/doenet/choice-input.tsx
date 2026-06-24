import React from "react";
import type { Action } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { useAppDispatch, useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";
import { coreActions } from "../../state/redux-slices/core";
import { Element } from "../element";
import { processLabelWithMath } from "./text-input";
import "./choice-input.css";

type ChoiceInputData = {
    props: {
        shortDescription: string;
        label: string;
        labelHasLatex: boolean;
        /**
         * 1-based indices into the choiceOrder array indicating which choices
         * are currently selected.
         */
        selectedIndices: number[];
        selectMultiple: boolean;
        /**
         * 1-based indices into node.children giving the display order of choices.
         */
        choiceOrder: number[];
        /** Parallel to choiceOrder: whether each choice (in display order) is disabled. */
        choicesDisabled: boolean[];
        /** Parallel to choiceOrder: whether each choice (in display order) is hidden. */
        choicesHidden: boolean[];
    };
};

type OrderedChoice = {
    id: number;
    displayIdx: number;
    isDisabled: boolean;
    isSelected: boolean;
};

export const ChoiceInput: BasicComponent<ChoiceInputData> = ({
    node,
    htmlId,
    ancestors,
}) => {
    const onServer = useAppSelector(renderingOnServerSelector);
    const dispatch = useAppDispatch();
    const componentId = node.data.id;
    const props = node.data.props;

    // choiceOrder[i] is a 1-based index into node.children (original order).
    // Build the visible, ordered list of choices.
    const orderedChoices: OrderedChoice[] = [];
    for (
        let displayIdx = 0;
        displayIdx < props.choiceOrder.length;
        displayIdx++
    ) {
        if (props.choicesHidden[displayIdx]) {
            continue;
        }
        const child = node.children[props.choiceOrder[displayIdx] - 1];
        if (!child || typeof child === "string") {
            continue;
        }
        orderedChoices.push({
            id: child.id,
            displayIdx,
            isDisabled: !!props.choicesDisabled[displayIdx],
            // selectedIndices contains 1-based display positions
            isSelected: props.selectedIndices.includes(displayIdx + 1),
        });
    }

    function handleChange(displayIdx: number, checked: boolean) {
        const oneBasedIdx = displayIdx + 1;
        let newSelectedIndices: number[];

        if (props.selectMultiple) {
            const current = [...props.selectedIndices];
            if (checked) {
                if (!current.includes(oneBasedIdx)) {
                    current.push(oneBasedIdx);
                    current.sort((a, b) => a - b);
                }
                newSelectedIndices = current;
            } else {
                newSelectedIndices = current.filter((i) => i !== oneBasedIdx);
            }
        } else {
            newSelectedIndices = [oneBasedIdx];
        }

        const action: Action = {
            component: "choiceInput",
            componentIdx: componentId,
            actionName: "updateSelectedIndices",
            args: { selectedIndices: newSelectedIndices },
        };
        dispatch(coreActions.dispatchAction(action));
    }

    const inputType = props.selectMultiple ? "checkbox" : "radio";
    const displayLabel = processLabelWithMath(props.label, props.labelHasLatex);

    if (onServer) {
        const selectedIds = orderedChoices
            .filter((c) => c.isSelected)
            .map((c) => c.id);
        return (
            <span className="choice-input" id={htmlId}>
                {selectedIds.map((id) => (
                    <Element key={id} id={id} ancestors={ancestors} />
                ))}
            </span>
        );
    }

    return (
        <div
            className="choice-input"
            id={htmlId}
            role={inputType === "radio" ? "radiogroup" : "group"}
            aria-label={displayLabel ? undefined : props.shortDescription}
            aria-describedby={displayLabel ? props.shortDescription : undefined}
        >
            {displayLabel && (
                <div className="choice-input-label">{displayLabel}</div>
            )}
            {orderedChoices.map((choice) => (
                <label
                    key={choice.id}
                    className={choice.isDisabled ? "disabled" : undefined}
                >
                    <input
                        type={inputType}
                        name={
                            inputType === "radio"
                                ? `choice-input-${componentId}`
                                : undefined
                        }
                        value={choice.displayIdx + 1}
                        checked={choice.isSelected}
                        disabled={choice.isDisabled}
                        onChange={(e) =>
                            handleChange(choice.displayIdx, e.target.checked)
                        }
                    />
                    <Element id={choice.id} ancestors={ancestors} />
                </label>
            ))}
        </div>
    );
};
