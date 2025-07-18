import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { addCommasForCompositeRanges } from "./utils/composites";

export default React.memo(function Cell(props: UseDoenetRendererProps) {
    let { id, SVs, children } = useDoenetRenderer(props);

    if (SVs.hidden) {
        return null;
    }

    let properties: React.TdHTMLAttributes<unknown> = {
        style: { padding: "3px 10px" },
    };

    if (SVs.colSpan !== 1) {
        properties.colSpan = SVs.colSpan;
    }
    if (SVs.halign !== null) {
        properties.style!.textAlign = SVs.halign;
    }
    if (SVs.bottom !== "none") {
        properties.style!.borderBottomStyle = "solid";
        if (SVs.bottom === "minor") {
            properties.style!.borderBottomWidth = "thin";
        } else if (SVs.bottom === "medium") {
            properties.style!.borderBottomWidth = "medium";
        } else {
            properties.style!.borderBottomWidth = "thick";
        }
    }
    if (SVs.right !== "none") {
        properties.style!.borderRightStyle = "solid";
        if (SVs.right === "minor") {
            properties.style!.borderRightWidth = "thin";
        } else if (SVs.right === "medium") {
            properties.style!.borderRightWidth = "medium";
        } else {
            properties.style!.borderRightWidth = "thick";
        }
    }

    if (SVs._compositeReplacementActiveRange) {
        children = addCommasForCompositeRanges({
            children,
            compositeReplacementActiveRange:
                SVs._compositeReplacementActiveRange,
            startInd: 0,
            endInd: children.length - 1,
        });
    }

    let content = children;

    if (content.length === 0) {
        content = SVs.text;
    }

    if (SVs.inHeader) {
        return (
            <th id={id} {...properties}>
                {content}
            </th>
        );
    } else {
        return (
            <td id={id} {...properties}>
                {content}
            </td>
        );
    }
});
