import React from "react";
import { BasicComponent } from "../types";

type SummaryStatisticsData = {
    props: {
        /** The statistics shown, in order, each by its name, as text. */
        summaryStatistics: Record<string, string>;
    };
};

/**
 * SummaryStatistics: a table of the statistics it shows, a heading row of
 * their names over a row of their values, as the current core draws it.
 */
export const SummaryStatistics: BasicComponent<SummaryStatisticsData> = ({
    node,
    htmlId,
}) => {
    const statistics = Object.entries(node.data.props.summaryStatistics ?? {});
    return (
        <div className="summary-statistics">
            <table id={htmlId}>
                <caption>Summary statistics</caption>
                <thead>
                    <tr>
                        {statistics.map(([name]) => (
                            <th key={name} scope="col">
                                {name}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {statistics.map(([name, value]) => (
                            <td key={name}>{value}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
