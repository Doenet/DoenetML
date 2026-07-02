import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { BorderStyle } from "./tabular";
import classNames from "classnames";

type CellData = {
    props: {
        bottom: BorderStyle;
        right: BorderStyle;
        colspan: number;
        halign: "left" | "center" | "right" | "justify";
        header: boolean;
    };
};

export const Cell: BasicComponentWithPassthroughChildren<CellData> = ({
    node,
    children,
    htmlId,
}) => {
    const ContainerElement: React.FC<
        React.TdHTMLAttributes<HTMLTableCellElement>
    > = React.useCallback(
        (props) => {
            if (node.data.props.header) {
                return <th {...props} />;
            } else {
                return <td {...props} />;
            }
        },
        [node.data.props.header],
    );
    return (
        <ContainerElement
            id={htmlId}
            className={classNames({
                [`border-bottom-${node.data.props.bottom}`]:
                    node.data.props.bottom,
                [`border-right-${node.data.props.right}`]:
                    node.data.props.right,
                [`text-align-${node.data.props.halign}`]:
                    node.data.props.halign,
            })}
            colSpan={node.data.props.colspan}
        >
            {children}
        </ContainerElement>
    );
};
