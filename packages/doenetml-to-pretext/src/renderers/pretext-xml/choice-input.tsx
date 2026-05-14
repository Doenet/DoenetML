import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

type ChoiceInputData = {
    props: {
        choicesHidden: number[];
        choicesOrder: number[];
        selectedIndices: number[];
        selectMultiple: boolean;
        label: string;
        inline: boolean;
    };
};

export const ChoiceInput: BasicComponentWithPassthroughChildren<
    ChoiceInputData
> = ({ node, children }) => {
    // The children are the <choice> elements. We render using checkboxes if selectMultiple is true, otherwise radios.
    const {
        selectMultiple,
        choicesOrder,
        choicesHidden,
        selectedIndices,
        label,
        inline,
    } = node.data.props;
    const childrenArray: React.ReactNode[] = Array.isArray(children)
        ? children
        : [children];

    // If the choiceInput is inline, then the selected choice is shown without any icon.
    // If there is no selected choice, a fillin is shown instead.
    if (inline) {
        const selectedChoice = childrenArray[selectedIndices[0] - 1];
        return (
            <React.Fragment>
                {label}{" "}
                {selectedChoice ? (
                    <em>{selectedChoice}</em>
                ) : (
                    <fillin characters={5} />
                )}
            </React.Fragment>
        );
    }

    const selectedIcon = selectMultiple ? "☑" : "⦿";
    const unselectedIcon = selectMultiple ? "☐" : "◯";
    const sortedChoices = ensureOneIndexedArrayOfLen(
        childrenArray.length,
        choicesOrder,
    )
        .map((index) => {
            if (choicesHidden.includes(index)) {
                return null; // Skip hidden choices
            }
            const isSelected = selectedIndices.includes(index);
            // choicesOrder is 1-indexed.
            return (
                <React.Fragment>
                    {!inline &&
                        (isSelected
                            ? selectedIcon + " "
                            : unselectedIcon + " ")}
                    {childrenArray[index - 1]}
                </React.Fragment>
            );
        })
        .filter((child) => child != null);

    return (
        <ol>
            {sortedChoices.map((child, i) => (
                <li key={i}>{child}</li>
            ))}
        </ol>
    );
};

function ensureOneIndexedArrayOfLen(
    len: number,
    baseArray: number[] | undefined,
): number[] {
    if (!Array.isArray(baseArray) || baseArray.length !== len) {
        return Array.from({ length: len }, (_, i) => i + 1);
    }
    return baseArray;
}
