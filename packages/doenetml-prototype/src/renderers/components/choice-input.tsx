import React from "react";
import { BasicComponent } from "../types";
import { useAppSelector } from "../../state/hooks";
import { renderingOnServerSelector } from "../../state/redux-slices/global";
import "./choice-input.css";
import { elementsArraySelector } from "../../state/redux-slices/dast";
import { Radio, RadioGroup, RadioProvider } from "@ariakit/react";
import { flatDastChildrenToReactChildren } from "../element";

export const ChoiceInput: BasicComponent = ({ node }) => {
    const childrenIds = React.useMemo(
        () => node.children.filter((n) => typeof n === "number") as number[],
        [node.children],
    );
    const elements = useAppSelector(elementsArraySelector);

    const choiceChildren = childrenIds.flatMap((id) => {
        const choice = elements[id];
        return choice.type === "element" && choice.name === "choice"
            ? choice
            : [];
    });

    return (
        <RadioProvider>
            <RadioGroup className="choice-input">
                {choiceChildren.map((child, i) => (
                    <label key={child.data.id}>
                        <Radio value={child.data.id} />
                        {flatDastChildrenToReactChildren(child.children)}
                    </label>
                ))}
            </RadioGroup>
        </RadioProvider>
    );
};
