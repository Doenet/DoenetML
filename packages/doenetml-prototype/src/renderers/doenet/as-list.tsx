import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

type AsListData = { props: unknown };

export const AsList: BasicComponentWithPassthroughChildren<AsListData> = ({
    node,
    children,
    htmlId,
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
