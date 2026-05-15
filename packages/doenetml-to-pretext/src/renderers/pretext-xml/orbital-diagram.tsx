import React from "react";
import { BasicComponent } from "../types";

type Box = "U" | "D" | "UD" | "DU";

type OrbitalDiagramData = {
    props: {
        value: { orbitalText: string; boxes: Box[] }[];
    };
};

function boxToSymbol(box: Box) {
    return [...box]
        .map((char) => {
            if (char === "U") {
                return "↑";
            } else if (char === "D") {
                return "↓";
            } else {
                throw new Error(`Invalid box character: ${char}`);
            }
        })
        .join("");
}

export const OrbitalDiagram: BasicComponent<OrbitalDiagramData> = ({
    node,
}) => {
    // We make a tabular in reverse order.
    const rowData = [...node.data.props.value];
    rowData.reverse();
    return (
        <tabular>
            {rowData.map(({ orbitalText, boxes }) => (
                <row>
                    <cell>{orbitalText}</cell>
                    {boxes.map((box, index) => (
                        <cell key={index}>{boxToSymbol(box)}</cell>
                    ))}
                </row>
            ))}
        </tabular>
    );
};
