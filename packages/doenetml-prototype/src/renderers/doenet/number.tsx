import React from "react";
import { BasicComponent } from "../types";
import type { NumberProps } from "@doenet/doenetml-worker-rust";

type NumberData = { props: NumberProps };

export const Number: BasicComponent<NumberData> = ({ node }) => {
    return <span>{node.data.props.text}</span>;
};
