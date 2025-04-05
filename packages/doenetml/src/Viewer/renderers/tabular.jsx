import React, { useRef } from "react";
import useDoenetRenderer from "../useDoenetRenderer";
import { sizeToCSS } from "./utils/css";
import { useRecordVisibilityChanges } from "../../utils/visibility";

export default React.memo(function Tabular(props) {
    let { name, id, SVs, children, actions, callAction } =
        useDoenetRenderer(props);

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
    }

    const tableStyle = {
        width: sizeToCSS(SVs.width),
        height: sizeToCSS(SVs.height),
        borderCollapse: "collapse",
        borderColor: "var(--canvastext)",
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
            <a name={id} />
            <table id={id} style={tableStyle}>
                <tbody>{children}</tbody>
            </table>
        </div>
    );
});
