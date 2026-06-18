import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { BorderStyle } from "./tabular";
import classNames from "classnames";

type RowData = {
    props: {
        left: BorderStyle;
        valign: "top" | "center" | "bottom";
    };
};

export const Row: BasicComponentWithPassthroughChildren<RowData> = ({
    node,
    children,
    htmlId,
}) => {
    return (
        <tr
            id={htmlId}
            className={classNames({
                [`border-left-${node.data.props.left}`]: node.data.props.left,
                [`vertical-align-${node.data.props.valign}`]:
                    node.data.props.valign,
            })}
        >
            {children}
        </tr>
    );
};
