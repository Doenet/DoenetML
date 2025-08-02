import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { sizeToCSS } from "./utils/css";
import { useRecordVisibilityChanges } from "../../utils/visibility";

export default React.memo(function Tabular(props: UseDoenetRendererProps) {
    let { id, SVs, children, actions, callAction } = useDoenetRenderer(props);

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
    }

    const tableStyle: React.CSSProperties = {
        width: sizeToCSS(SVs.width),
        height: sizeToCSS(SVs.height),
        borderCollapse: "collapse",
        borderColor: "var(--canvasText)",
        borderRadius: "var(--mainBorderRadius)",
        tableLayout: "fixed",
    };
    if (SVs.top !== "none") {
        tableStyle.borderTopStyle = "solid";
        if (SVs.top === "minor") {
            tableStyle.borderTopWidth = "thin";
        } else if (SVs.top === "medium") {
            tableStyle.borderTopWidth = "medium";
        } else {
            tableStyle.borderTopWidth = "thick";
        }
    }

    return (
        <div style={{ margin: "12px 0" }} ref={ref}>
            <table id={id} style={tableStyle}>
                <tbody>{children}</tbody>
            </table>
        </div>
    );
});
