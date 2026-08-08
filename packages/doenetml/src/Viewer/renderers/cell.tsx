import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { addCommasForCompositeRanges } from "./utils/composites";

interface CellSVs {
    [key: string]: any;
    hidden: boolean;
    _compositeReplacementActiveRange?: any;
    bottomBorder?: any;
    colSpan: number;
    halign?: any;
    inHeader: boolean;
    endBorder?: any;
    text: string;
}

export default React.memo(function Cell(props: UseDoenetRendererProps) {
    let { id, SVs, children } = useDoenetRenderer<CellSVs>(props);

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
    if (SVs.bottomBorder !== "none") {
        properties.style!.borderBottomStyle = "solid";
        if (SVs.bottomBorder === "minor") {
            properties.style!.borderBottomWidth = "thin";
        } else if (SVs.bottomBorder === "medium") {
            properties.style!.borderBottomWidth = "medium";
        } else {
            properties.style!.borderBottomWidth = "thick";
        }
    }
    if (SVs.endBorder !== "none") {
        properties.style!.borderInlineEndStyle = "solid";
        if (SVs.endBorder === "minor") {
            properties.style!.borderInlineEndWidth = "thin";
        } else if (SVs.endBorder === "medium") {
            properties.style!.borderInlineEndWidth = "medium";
        } else {
            properties.style!.borderInlineEndWidth = "thick";
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

    let content: React.ReactNode[] | string = children;

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
