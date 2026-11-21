import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { BorderStyle } from "./tabular";
import classNames from "classnames";

type RowData = {
    props: {
        startBorder: BorderStyle;
        vAlign: "top" | "center" | "bottom";
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
                [`border-inline-start-${node.data.props.startBorder}`]:
                    node.data.props.startBorder,
                [`vertical-align-${node.data.props.vAlign}`]:
                    node.data.props.vAlign,
            })}
        >
            {children}
        </tr>
    );
};
