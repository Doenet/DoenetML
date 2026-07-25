import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { sizeToCSS } from "./utils/css";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { useT } from "../../utils/i18n";

interface SummaryStatisticsSVs {
    [key: string]: any;
    hidden: boolean;
    /** `null` when the author named no column, or named one that isn't there. */
    columnName: string | null;
    height?: any;
    summaryStatistics?: any;
    width?: any;
}

export default React.memo(function SummaryStatistics(
    props: UseDoenetRendererProps,
) {
    let { id, SVs, children, actions, callAction } =
        useDoenetRenderer<SummaryStatisticsSVs>(props);

    const t = useT();

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
            <p>
                {t(
                    "summary-statistics-caption",
                    // Fluent renders `{ $column }` literally if handed a
                    // `null`, so an unnamed column becomes an empty string —
                    // which is what interpolating it into JSX used to do.
                    { column: SVs.columnName ?? "" },
                    `Summary statistics of ${SVs.columnName ?? ""}`,
                )}
            </p>
            <table id={id} style={tableStyle}>
                <tbody>
                    {heading}
                    {data}
                </tbody>
            </table>
        </div>
    );
});
