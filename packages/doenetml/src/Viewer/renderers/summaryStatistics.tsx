import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { useChromeLangDir, useT } from "../../utils/i18n";

interface SummaryStatisticsSVs {
    [key: string]: any;
    hidden: boolean;
    summaryStatistics?: any;
}

export default React.memo(function SummaryStatistics(
    props: UseDoenetRendererProps,
) {
    let { id, SVs, children, actions, callAction } =
        useDoenetRenderer<SummaryStatisticsSVs>(props);

    const t = useT();

    // The caption is chrome — the reader's language inside the document's box.
    // The column name interpolated into it is the author's, which is what the
    // translator's bidi isolation is for. Empty unless the two directions
    // disagree.
    const chromeLangDir = useChromeLangDir();

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
    }

    // Sized by its contents. There used to be `width`/`height` here, read from
    // state variables the component does not define, so they were always
    // `undefined`.
    const tableStyle: React.CSSProperties = {
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
            <p {...chromeLangDir}>
                {t("summary-statistics-caption", {}, "Summary statistics")}
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
