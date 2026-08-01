import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";

type DivData = { props: unknown };

export const Div: BasicComponentWithPassthroughChildren<DivData> = ({
    children,
    visibilityRef,
    htmlId,
}) => {
    return (
        <div id={htmlId} ref={visibilityRef}>
            {children}
        </div>
    );
};
