import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { useAppSelector } from "../../state/hooks";
import { elementsArraySelector } from "../../state/redux-slices/dast";
import { Element } from "../element";

export const Section: BasicComponentWithPassthroughChildren<{
    titleElmId?: number;
}> = ({ children, node }) => {
    const titleElmId = node.data.titleElmId;

    const title = titleElmId != null ? <Element id={titleElmId} /> : "Section";

    return (
        <div className="section">
            <h3>{title}</h3>
            {children}
        </div>
    );
};
