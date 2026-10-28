import React from "react";
import { BasicComponent } from "../types";
import { LINE_COLOR } from "./jsxgraph/look";

type LegendData = {
    props: {
        legendElements: {
            swatchType: string;
            lineColor?: string;
            label?: { value: string; hasLatex: boolean };
        }[];
    };
};

/** A legend: its labels, in the board's upper right, each beside a swatch
 * of its curve's color. */
export const LegendInGraph: BasicComponent<LegendData> = ({ node }) => {
    return (
        <div className="graph-legend">
            {(node.data.props.legendElements ?? []).map((element, i) => (
                <div key={i} className="graph-legend-entry">
                    <svg width="24" height="10" aria-hidden>
                        <line
                            x1="0"
                            y1="5"
                            x2="24"
                            y2="5"
                            stroke={element.lineColor ?? LINE_COLOR}
                            strokeWidth={2}
                        />
                    </svg>
                    {element.label?.value}
                </div>
            ))}
        </div>
    );
};
