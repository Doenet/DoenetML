import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { labelContent } from "./use-input-label";

type LabelData = { props: { value?: string } };

/**
 * A `<label>`: its children, so that their markup (`<em>`, `<delete>`, …) is kept, with
 * the whitespace at either end trimmed, as the label's value is. A label without children
 * (one copied from another component's `label`, say) has only its value to print.
 */
export const Label: BasicComponentWithPassthroughChildren<LabelData> = ({
    node,
    children,
}) => {
    const childArray = React.Children.toArray(children);
    if (node.children.length === 0 || childArray.length === 0) {
        return (
            <React.Fragment>
                {labelContent(node.data.props.value)}
            </React.Fragment>
        );
    }
    const first = childArray[0];
    if (typeof first === "string") {
        childArray[0] = first.trimStart();
    }
    const last = childArray[childArray.length - 1];
    if (typeof last === "string") {
        childArray[childArray.length - 1] = last.trimEnd();
    }
    return <React.Fragment>{childArray}</React.Fragment>;
};
