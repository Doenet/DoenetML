import React from "react";
import { BasicComponent } from "../types";

type ExtractMathOperatorData = { props: { value: string } };

export const ExtractMathOperator: BasicComponent<ExtractMathOperatorData> = ({
    node,
}) => {
    return <React.Fragment>{node.data.props.value}</React.Fragment>;
};
