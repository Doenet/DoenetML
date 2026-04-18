import React from "react";
import {
    GRAPH_CONTROL_SECTION_HEADING_STYLE,
    GRAPH_CONTROL_SECTION_HEADING_WITH_DIVIDER_STYLE,
} from "./graphControlStyles";

type GraphControlSectionHeadingProps = {
    heading?: React.ReactNode;
    withDivider?: boolean;
};

export default function GraphControlSectionHeading({
    heading,
    withDivider = true,
}: GraphControlSectionHeadingProps) {
    if (!heading) {
        return null;
    }

    return (
        <h4
            style={
                withDivider
                    ? GRAPH_CONTROL_SECTION_HEADING_WITH_DIVIDER_STYLE
                    : GRAPH_CONTROL_SECTION_HEADING_STYLE
            }
        >
            {heading}
        </h4>
    );
}
