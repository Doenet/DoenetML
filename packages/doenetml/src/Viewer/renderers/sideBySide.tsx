import React, { useRef } from "react";

import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { getBlockMarginWithOptionalTopSuppression } from "./utils/nonInlineMediaLayout";

function isRenderablePanelChild(child: unknown): child is React.ReactElement {
    if (!child) {
        return false;
    }
    // Renderer output can include whitespace text nodes; panel layout should
    // only count actual panel elements.
    if (typeof child === "string") {
        return false;
    }
    return typeof child === "object" && "key" in child;
}

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

    const panelChildren = children.filter(isRenderablePanelChild);
    const numColumns = SVs.numPanels ?? panelChildren.length;

    for (let [i, child] of panelChildren.entries()) {
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
                margin: getBlockMarginWithOptionalTopSuppression({
                    suppressTopMargin: Boolean(listItemInlineAlignment),
                }),
            }}
            ref={ref}
        >
            {styledChildren}
        </div>
    );
});
