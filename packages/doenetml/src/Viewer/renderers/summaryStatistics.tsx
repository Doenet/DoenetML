import React, { useRef } from "react";
import useDoenetRenderer, {
    UseDoenetRendererProps,
} from "../useDoenetRenderer";
import { useRecordVisibilityChanges } from "../../utils/visibility";
import { useChromeLangDir, useT } from "../../utils/i18n";

interface SummaryStatisticsSVs {
    [key: string]: any;
    hidden: boolean;
    /**
     * The statistics to display, keyed by statistic and already in the order
     * the component declares them in. Each is a rounded string, except
     * `count`, which is an exact tally and stays a number; a statistic with no
     * value — every one but `count` when no values were given — is `null` and
     * leaves its cell empty.
     */
    summaryStatistics: Record<string, string | number | null>;
}

export default React.memo(function SummaryStatistics(
    props: UseDoenetRendererProps,
) {
    // No `children`: the component's `<number>` and `<math>` children are the
    // data it summarizes, and the table is what it draws in their place.
    let { id, SVs, actions, callAction } =
        useDoenetRenderer<SummaryStatisticsSVs>(props);

    const t = useT();

    // The caption is chrome — the reader's language inside the document's box,
    // so it is re-declared here. Empty unless the two directions disagree.
    const chromeLangDir = useChromeLangDir();

    const ref = useRef(null);

    useRecordVisibilityChanges(ref, callAction, actions);

    if (SVs.hidden) {
        return null;
    }

    // The table is sized by its contents; the component declares no width or
    // height for an author to set. Borders are collapsed, as `<tabular>`
    // collapses its own, so the rule under the headings runs unbroken across
    // the table rather than in per-column dashes with `border-spacing`
    // between them.
    const tableStyle: React.CSSProperties = {
        borderCollapse: "collapse",
    };

    // Matches the padding `<cell>` gives the cells of a `<tabular>`, so a
    // statistics table is spaced like the other tables in a document.
    const cellStyle: React.CSSProperties = { padding: "3px 10px" };

    // That rule is the only border the table draws, and it carries its own
    // color: `border-color` is not inherited, so a color declared on the
    // `<table>` — as `<tabular>` declares one — never reaches a cell, and the
    // table has no border of its own for such a color to paint.
    const headingStyle: React.CSSProperties = {
        ...cellStyle,
        borderBottomStyle: "solid",
        borderBottomWidth: "thin",
        borderBottomColor: "var(--canvasText)",
    };
    const captionStyle: React.CSSProperties = {
        textAlign: "start",
        paddingBottom: "3px",
    };

    // The component puts only the statistics being displayed into
    // `summaryStatistics`, already in its own canonical order, so the columns
    // are its keys — there is no second list of statistics to keep in step
    // with it here.
    let columns = Object.keys(SVs.summaryStatistics);

    let heading = (
        <tr>
            {columns.map((statistic) => (
                // One row of data under one row of headings, so each heading
                // labels its column and says so.
                <th key={statistic} scope="col" style={headingStyle}>
                    {statistic}
                </th>
            ))}
        </tr>
    );
    let data = (
        <tr>
            {columns.map((statistic) => (
                <td key={statistic} style={cellStyle}>
                    {SVs.summaryStatistics[statistic]}
                </td>
            ))}
        </tr>
    );

    return (
        <div style={{ margin: "12px 0" }} ref={ref}>
            <table id={id} style={tableStyle}>
                {/*
                 * A `<caption>` rather than a paragraph above the table: it is
                 * the table's accessible name, so a reader who lands on the
                 * table is told what it is a table of. `text-align` is set
                 * because a caption is centered by default, which would leave
                 * it hanging over columns it does not belong to.
                 */}
                <caption style={captionStyle} {...chromeLangDir}>
                    {t("summary-statistics-caption", {}, "Summary statistics")}
                </caption>
                <tbody>
                    {heading}
                    {data}
                </tbody>
            </table>
        </div>
    );
});
