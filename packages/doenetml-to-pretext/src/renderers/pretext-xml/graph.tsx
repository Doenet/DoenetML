import React from "react";
import { BasicComponent } from "../types";
import { generateHtmlId } from "../utils";

export const Graph: BasicComponent<{
    props: { prefigureXML: string | null };
}> = ({ node, annotation, ancestors }) => {
    const prefigureXML = node.data.props.prefigureXML;
    if (!prefigureXML) {
        console.warn(
            "Graph component missing prefigureXML prop, rendering nothing",
        );
        return null;
    }

    const id = generateHtmlId(node, annotation, ancestors);

    return (
        <image>
            <prefigure
                // Without a label attribute, the pretext compiler may fail to find the generated image file
                label={`prefigure-${id}`}
                xmlns="https://prefigure.org"
                dangerouslySetInnerHTML={{ __html: prefigureXML }}
            />
        </image>
    );
};
