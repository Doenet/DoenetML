import React from "react";
import { BasicComponentWithPassthroughChildren } from "../types";
import { useAppSelector } from "../../state/hooks";

/**
 * A _PassThroughWithLogging component is a special component *used only for debugging*.
 * It logs the node and the children given.
 */
export const _PassThroughWithLogging: BasicComponentWithPassthroughChildren<{}> =
    ({ node, children }) => {
        const dast = useAppSelector((state) => state.dast);
        console.log(
            `Logging <${node.name}> node`,
            node,
            "children",
            children,
            "dast",
            dast,
        );
        return <React.Fragment>{children}</React.Fragment>;
    };
