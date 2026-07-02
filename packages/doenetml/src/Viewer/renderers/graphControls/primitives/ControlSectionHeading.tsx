import React from "react";
import {
    GRAPH_CONTROL_SECTION_HEADING_STYLE,
    GRAPH_CONTROL_SECTION_HEADING_WITH_DIVIDER_STYLE,
} from "./styles";

type ControlSectionHeadingProps = {
    heading?: React.ReactNode;
    withDivider?: boolean;
};

export default function ControlSectionHeading({
    heading,
    withDivider = true,
}: ControlSectionHeadingProps) {
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
