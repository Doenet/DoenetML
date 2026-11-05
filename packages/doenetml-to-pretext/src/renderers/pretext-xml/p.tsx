import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import type { PPropsInText } from "@doenet/doenetml-worker";
import { InParagraphContext } from "./paragraph-context";

export const P: BasicComponentWithPassthroughChildren<{
    props: PPropsInText;
}> = ({ children, node }) => {
    return (
        <p {...node.attributes}>
            <InParagraphContext.Provider value={true}>
                {children}
            </InParagraphContext.Provider>
        </p>
    );
};
