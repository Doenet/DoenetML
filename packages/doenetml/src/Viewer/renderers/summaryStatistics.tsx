import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { sizeToCSS } from "./utils/css";
import { useRecordVisibilityChanges } from "../../utils/visibility";

export default React.memo(function Tabular(props: UseDoenetRendererProps) {
    let { name, id, SVs, children, actions, callAction } =
        useDoenetRenderer(props);

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
    }

    const tableStyle: React.CSSProperties = {
        width: sizeToCSS(SVs.width),
        height: sizeToCSS(SVs.height),
        borderCollapse: "collapse",
        borderColor: "black",
        borderRadius: "var(--mainBorderRadius)",
    };

    let options = [
        "mean",
        "stdev",
        "variance",
        "stderr",
        "count",
        "minimum",
        "quartile1",
        "median",
        "quartile3",
        "maximum",
        "range",
        "sum",
    ];

    let columns = options.filter((x) => x in SVs.summaryStatistics);

    let heading = (
        <tr>
            {columns.map((x, i) => (
                <th key={i}>{x}</th>
            ))}
        </tr>
    );
    let data = (
        <tr>
            {columns.map((x, i) => (
                <td key={i}>{SVs.summaryStatistics[x]}</td>
            ))}
        </tr>
    );

    return (
        <div style={{ margin: "12px 0" }} ref={ref}>
            <p>Summary statistics of {SVs.columnName}</p>
            <table id={id} style={tableStyle}>
                <tbody>
                    {heading}
                    {data}
                </tbody>
            </table>
        </div>
    );
});
