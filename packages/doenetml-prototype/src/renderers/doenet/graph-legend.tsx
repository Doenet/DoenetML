import React from "react";
import { BasicComponent } from "../types";

type LegendData = {
    props: {
        /** One entry per curve of the graph, in order. */
        legendElements: {
            swatchType: string;
            lineColor?: string;
            label?: { value: string; hasLatex: boolean };
        }[];
    };
};

/**
 * A legend: its labels, in the board's upper right, each beside a swatch of
 * its curve's color.
 */
export const LegendInGraph: BasicComponent<LegendData> = ({ node }) => {
    const legendElements = node.data.props.legendElements;
    if (!Array.isArray(legendElements)) {
        return null;
    }

    return (
        <div className="graph-legend">
            {legendElements.map((element, i) => (
                <div key={i} className="graph-legend-entry">
                    <svg width="24" height="10" aria-hidden>
                        <line
                            x1="0"
                            y1="5"
                            x2="24"
                            y2="5"
                            stroke={element.lineColor ?? "var(--mainGreen)"}
                            strokeWidth={2}
                        />
                    </svg>
                    {element.label?.value}
                </div>
            ))}
        </div>
    );
};
