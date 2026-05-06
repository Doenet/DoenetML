import React, { useRef } from "react";

import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { getBlockMarginWithOptionalTopSuppression } from "./utils/nonInlineMediaLayout";

function isWhitespaceTextChild(child: unknown): child is string {
    return typeof child === "string" && child.trim() === "";
}

function isRenderablePanelChild(child: unknown): child is React.ReactElement {
    if (!child) {
        return false;
    }
    if (typeof child === "string") {
        return false;
    }
    return typeof child === "object" && "key" in child;
}

interface SideBySideSVs {
    [key: string]: any;
    hidden: boolean;
    gapWidth?: any;
    listItemInlineAlignment?: any;
    margins?: any;
    numPanels: number;
    widths?: any;
}

export default React.memo(function sideBySide(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } =
        useDoenetRenderer<SideBySideSVs>(props);
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

    // Preserve panel-slot indices from worker order. Null placeholders can appear
    // while lazy-loaded children are resolving; they should still consume a slot.
    let panelSlotCount = 0;
    for (const child of children) {
        if (!isWhitespaceTextChild(child)) {
            panelSlotCount += 1;
        }
    }
    const numColumns = SVs.numPanels ?? panelSlotCount;

    let panelIndex = 0;
    for (const child of children) {
        if (isWhitespaceTextChild(child)) {
            continue;
        }

        const currentPanelIndex = panelIndex;
        panelIndex += 1;

        if (!isRenderablePanelChild(child)) {
            continue;
        }

        let width = SVs.widths[currentPanelIndex];
        // console.log(">>>marginLeft",marginLeft)
        // console.log(">>>width",width)
        // console.log(">>>marginRight",marginRight)
        // console.log(">>>gap",SVs.gapWidth)

        let thisMarginLeft = marginLeft;
        let thisMarginRight = marginRight;

        if (currentPanelIndex > 0) {
            thisMarginLeft += SVs.gapWidth / 2;
        }
        if (currentPanelIndex < numColumns - 1) {
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
