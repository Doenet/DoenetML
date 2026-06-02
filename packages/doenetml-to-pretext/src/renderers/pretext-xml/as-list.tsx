import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

type asListData = { props: unknown };

export const asList: BasicComponentWithPassthroughChildren<asListData> = ({
    node,
    children,
}) => {
    // If `children` is an array, display its contents with a `", "` inserted between each item.
    if (Array.isArray(children)) {
        return children.map((child, index) => (
            <React.Fragment key={index}>
                {child}
                {index < children.length - 1 && ", "}
            </React.Fragment>
        ));
    }
    return children;
};
