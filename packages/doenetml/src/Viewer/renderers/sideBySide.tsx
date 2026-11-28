import React, { useRef } from "react";

import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { getBlockMarginWithOptionalTopSuppression } from "./utils/nonInlineMediaLayout";
import "./sideBySide.css";

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
    // The two entries of `margins` are applied to every panel: the first on the
    // panel's leading side and the second on its trailing side. They are read in
    // the direction the panels are laid out, so they mirror with the writing
    // direction along with the panels.
    const marginStart = SVs.margins[0];
    const marginEnd = SVs.margins[1];
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

        let thisMarginStart = marginStart;
        let thisMarginEnd = marginEnd;

        if (currentPanelIndex > 0) {
            thisMarginStart += SVs.gapWidth / 2;
        }
        if (currentPanelIndex < numColumns - 1) {
            thisMarginEnd += SVs.gapWidth / 2;
        }

        // The width and margins go through custom properties rather than
        // straight onto `style`, so that `sideBySide.css` can replace them when
        // the document is too narrow for panels side by side. Each resolves to
        // exactly the value it did as an inline declaration.
        const panelStyle = {
            ...(listItemInlineAlignment && {
                display: "flex",
                alignItems: "flex-start",
            }),
            "--doenet-sbs-panel-margin-start": `${thisMarginStart}%`,
            "--doenet-sbs-panel-margin-end": `${thisMarginEnd}%`,
            "--doenet-sbs-panel-width": `${width}%`,
        } as React.CSSProperties;

        styledChildren.push(
            <span
                className="doenet-side-by-side-panel"
                style={panelStyle}
                key={child.key}
            >
                {child}
            </span>,
        );
    }

    return (
        <div
            id={id}
            // Only a row of two or more panels stacks on a narrow screen: a
            // single panel has nothing to stack beside, and its widths and
            // margins (often used to center or indent it) stay as written.
            className={
                numColumns > 1 ? "doenet-side-by-side-stackable" : undefined
            }
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
