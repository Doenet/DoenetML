import React from "react";
import * as JSG from "jsxgraph";
import { JSXGraph } from "jsxgraph";
import { BasicComponent } from "../types";
import { Element } from "../element";

export const GraphContext = React.createContext<JSG.Board | null>(null);

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

export const Graph: BasicComponent = ({ node }) => {
    const boardId = "jsxgraph-board-" + node.data.id;
    // TODO: this isn't a very good way to do this and may lead to different
    // exports on different computers and will be affected by dark mode, etc.
    // It also probably won't handle export math labels on graphs.
    // BUT for now, we grab the SVG source of the graph with the same id on the page.
    // We export that as data to be turned into an included file later.

    const svgSource = document
        .getElementById(boardId)
        ?.querySelector("svg")?.outerHTML;

    return React.createElement("graph", { svgSource });
};
