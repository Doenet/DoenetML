import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

interface RowSVs {
    [key: string]: any;
    hidden: boolean;
    left?: any;
    valign?: any;
}

export default React.memo(function Row(props: UseDoenetRendererProps) {
    let { id, SVs, children } = useDoenetRenderer<RowSVs>(props);

    if (SVs.hidden) {
        return null;
    }

    let style: React.CSSProperties = {};

    if (SVs.valign !== null) {
        style.verticalAlign = SVs.valign;
    }
    // Physical, because the attribute is: an author writes `<row left="…">` and
    // means the left-hand edge. Adding a logical `start`/`end` vocabulary to
    // the table attributes is tracked in #1627.
    if (SVs.left !== "none") {
        style.borderLeftStyle = "solid";
        if (SVs.left === "minor") {
            style.borderLeftWidth = "thin";
        } else if (SVs.left === "medium") {
            style.borderLeftWidth = "medium";
        } else {
            style.borderLeftWidth = "thick";
        }
    }
    return (
        <tr id={id} style={style}>
            {children}
        </tr>
    );
});
