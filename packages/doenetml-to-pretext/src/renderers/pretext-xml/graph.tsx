import React from "react";
import { BasicComponent } from "../types";
import { generateHtmlId } from "../utils";

/**
 * Which layer each type of element is to be drawn on. These layers determine what shows up on top of what.
 *
 *  NOTE: there can be at most 10 different layer offsets,
 *  given that the DoenetML layer is multiplied by 10 and added to these offsets
 */
export const LAYER_OFFSETS = {
    base: 0,
    image: 1,
    line: 2,
    vertex: 3,
    controlPoint: 4,
    point: 5,
    text: 6,
};

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
