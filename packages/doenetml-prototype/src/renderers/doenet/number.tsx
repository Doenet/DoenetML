import React from "react";
import { BasicComponent } from "../types";
import type { NumberPropsInText } from "@doenet/doenetml-worker";

type NumberData = { props: NumberPropsInText };

export const Number: BasicComponent<NumberData> = ({ node }) => {
    return <span>{node.data.props.text}</span>;
};
