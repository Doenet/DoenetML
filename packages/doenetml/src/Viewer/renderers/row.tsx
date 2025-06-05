import React from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";

export default React.memo(function Row(props: UseDoenetRendererProps) {
    let { name, id, SVs, children } = useDoenetRenderer(props);

    if (SVs.hidden) {
        return null;
    }

    let style: React.CSSProperties = {};

    if (SVs.valign !== null) {
        style.verticalAlign = SVs.valign;
    }
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
