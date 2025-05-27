import React from "react";
import classNames from "classnames";

export const ActionButtonGroup = (
    props: React.PropsWithChildren<{
        vertical?: boolean;
        style?: React.CSSProperties;
    }>,
) => {
    return (
        <div
            className={classNames("doenet-button-group", {
                vertical: props.vertical,
            })}
            style={props.style}
        >
            {props.children}
        </div>
    );
};
