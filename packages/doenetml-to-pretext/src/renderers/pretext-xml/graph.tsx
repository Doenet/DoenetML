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

    const svgElm = document.getElementById(boardId)?.querySelector("svg");
    let svgSource = svgElm?.outerHTML;
    if (svgElm) {
        const svgDom = new DOMParser().parseFromString(
            svgElm.outerHTML,
            "image/svg+xml",
        );
        const svg = svgDom.documentElement;
        if (!svg) {
            throw new Error("Could not parse SVG");
        }

        // For some reason, xmlns won't serialize, so we mangle the name and replace it later
        svg.setAttribute("XXxmlnsXX", "http://www.w3.org/2000/svg");
        svg.setAttribute("xmlns:svg", "http://www.w3.org/2000/svg");
        svg.setAttribute("version", "1.1");

        // These shouldn't be needed because we are replacing all `var(--foo)` with their values,
        // but we keep them as a backup
        const style = svgDom.createElement("style");
        style.textContent = `
            :root {
              --canvasText: black;
              --lightBlue: hsl(209, 54%, 82%);
              --solidLightBlue: #8fb8de;
              --mainGray: #e3e3e3;
              --donutBody: #eea177;
              --donutTopping: #6d4445;
              --mainRed: #c1292e;
              --lightRed: hsl(0, 54%, 82%);
              --mainGreen: #3e844a;
              --lightGreen: #a6f19f;
              --lightYellow: #f5ed85;
              --whiteBlankLink: #6d4445;
              --mainYellow: #94610a;
              --lightOrange: #efab34;
              --mainOrange: #a36600;
              --mainPurple: #4a03d9;
            }
        `;
        // Prepend the style element
        svg.insertBefore(style, svg.firstChild);

        svgSource =
            `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n` +
            new XMLSerializer().serializeToString(svgDom);
        svgSource = svgSource.replace(/XXxmlnsXX/g, "xmlns");

        // Replace CSS variables with actual values
        // Doing raw string manipulation isn't ideal.
        // Replace when a better method is found.
        const css = window.getComputedStyle(svgElm);
        svgSource = replaceCssVars(svgSource, css);
    }

    return React.createElement("graph", { svgSource });
};

/**
 * Replace instances of `var(--name)` with the actual value of the CSS variable `--name`
 * if found. Otherwise leave the variable as is.
 */
function replaceCssVars(str: string, css: CSSStyleDeclaration): string {
    return str.replace(/var\((--[^)]+)\)/g, (wholeMatch, name) => {
        return css.getPropertyValue(name).trim() || wholeMatch;
    });
}
