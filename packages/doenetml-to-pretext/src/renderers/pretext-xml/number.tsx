import React from "react";
import { BasicComponent } from "../types";

type NumberData = { props: { text: string; renderAsMath: boolean } };

export const Number: BasicComponent<NumberData> = ({ node }) => {
    if (node.data.props.renderAsMath) {
        return <m>{node.data.props.text}</m>;
    }
    return node.data.props.text;
};
