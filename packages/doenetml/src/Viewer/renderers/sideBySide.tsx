import React, { useRef } from "react";

import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { useRecordVisibilityChanges } from "../../utils/visibility";

export default React.memo(function sideBySide(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } = useDoenetRenderer(props);
    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
    }

    let styledChildren = [];
    const marginLeft = SVs.margins[0];
    const marginRight = SVs.margins[1];
    const listItemInlineAlignment =
        SVs.listItemInlineAlignment === "none"
            ? null
            : SVs.listItemInlineAlignment;

    const numColumns = SVs.numPanels ?? children.length;
    let panelIndex = 0;

    for (let child of children) {
        if (!child) {
            continue;
        }

        if (typeof child === "string" && child.trim() === "") {
            continue;
        }

        if (typeof child !== "object" || !("key" in child)) {
            continue;
        }

        const i = panelIndex;
        panelIndex += 1;

        let width = SVs.widths[i];
        // console.log(">>>marginLeft",marginLeft)
        // console.log(">>>width",width)
        // console.log(">>>marginRight",marginRight)
        // console.log(">>>gap",SVs.gapWidth)

        let thisMarginLeft = marginLeft;
        let thisMarginRight = marginRight;

        if (i > 0) {
            thisMarginLeft += SVs.gapWidth / 2;
        }
        if (i < numColumns - 1) {
            thisMarginRight += SVs.gapWidth / 2;
        }

        styledChildren.push(
            <span
                style={{
                    ...(listItemInlineAlignment && {
                        display: "flex",
                        alignItems: "flex-start",
                    }),
                    marginLeft: `${thisMarginLeft}%`,
                    marginRight: `${thisMarginRight}%`,
                    width: `${width}%`,
                }}
                key={child.key}
            >
                {child}
            </span>,
        );
    }

    return (
        <div
            id={id}
            style={{
                display: "flex",
                ...(listItemInlineAlignment && {
                    alignItems: listItemInlineAlignment,
                }),
                maxWidth: "850px",
                margin: listItemInlineAlignment ? "0 0 12px 0" : "12px 0",
            }}
            ref={ref}
        >
            {styledChildren}
        </div>
    );
});
