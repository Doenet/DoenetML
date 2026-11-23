import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

interface RowSVs {
    [key: string]: any;
    hidden: boolean;
    startBorder?: any;
    vAlign?: any;
}

export default React.memo(function Row(props: UseDoenetRendererProps) {
    let { id, SVs, children } = useDoenetRenderer<RowSVs>(props);

    if (SVs.hidden) {
        return null;
    }

    let style: React.CSSProperties = {};

    if (SVs.vAlign !== null) {
        style.verticalAlign = SVs.vAlign;
    }
    if (SVs.startBorder !== "none") {
        style.borderInlineStartStyle = "solid";
        if (SVs.startBorder === "minor") {
            style.borderInlineStartWidth = "thin";
        } else if (SVs.startBorder === "medium") {
            style.borderInlineStartWidth = "medium";
        } else {
            style.borderInlineStartWidth = "thick";
        }
    }
    return (
        <tr id={id} style={style}>
            {children}
        </tr>
    );
});
