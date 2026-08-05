import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { BorderStyle } from "./tabular";
import classNames from "classnames";

type CellData = {
    props: {
        bottomBorder: BorderStyle;
        endBorder: BorderStyle;
        colspan: number;
        halign: "start" | "center" | "end" | "justify";
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
                [`border-bottom-${node.data.props.bottomBorder}`]:
                    node.data.props.bottomBorder,
                [`border-inline-end-${node.data.props.endBorder}`]:
                    node.data.props.endBorder,
                [`text-align-${node.data.props.halign}`]:
                    node.data.props.halign,
            })}
            colSpan={node.data.props.colspan}
        >
            {children}
        </ContainerElement>
    );
};
