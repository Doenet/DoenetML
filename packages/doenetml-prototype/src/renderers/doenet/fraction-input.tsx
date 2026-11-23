import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { InputLabelProps, processLabelWithMath } from "./_labeled-input";
import "./fraction-input.css";

type FractionInputData = { props: InputLabelProps };

/**
 * FractionInput: its two math inputs, the numerator's over the
 * denominator's, beside its label. Each box is a math input of its own,
 * which sends what is typed in it.
 */
export const FractionInput: BasicComponentWithPassthroughChildren<
    FractionInputData
> = ({ node, children, htmlId }) => {
    const { label, labelHasLatex, labelPosition, shortDescription } =
        node.data.props;
    const boxes = React.Children.toArray(children);
    const labelId = htmlId ? `${htmlId}-label` : undefined;
    const hasLabel = !!label?.trim();
    const labelElement = hasLabel ? (
        <span className="input-label" id={labelId}>
            {processLabelWithMath(label, labelHasLatex)}
        </span>
    ) : null;
    const fraction = (
        <table
            className="fraction"
            aria-labelledby={hasLabel ? labelId : undefined}
            aria-label={hasLabel ? undefined : shortDescription}
            aria-description={hasLabel ? shortDescription : undefined}
        >
            <tbody>
                <tr>
                    <td className="fraction-numerator">{boxes[0]}</td>
                </tr>
                <tr>
                    <td className="fraction-vinculum"></td>
                </tr>
                <tr>
                    <td className="fraction-denominator">{boxes[1]}</td>
                </tr>
            </tbody>
        </table>
    );
    return (
        <span className="fraction-input" id={htmlId}>
            {labelPosition === "end" ? (
                <>
                    {fraction}
                    {labelElement}
                </>
            ) : (
                <>
                    {labelElement}
                    {fraction}
                </>
            )}
        </span>
    );
};
