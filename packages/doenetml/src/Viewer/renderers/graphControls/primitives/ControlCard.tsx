import React from "react";
import {
    GRAPH_CONTROL_CARD_STYLE,
    GRAPH_CONTROL_HEADING_STYLE,
} from "./styles";

type ControlCardProps = {
    id?: string;
    headingId: string;
    heading: React.ReactNode;
    children: React.ReactNode;
};

export default function ControlCard({
    id,
    headingId,
    heading,
    children,
}: ControlCardProps) {
    return (
        <div
            id={id}
            role="group"
            aria-labelledby={headingId}
            style={GRAPH_CONTROL_CARD_STYLE}
        >
            <h3 id={headingId} style={GRAPH_CONTROL_HEADING_STYLE}>
                {heading}
            </h3>
            {children}
        </div>
    );
}
