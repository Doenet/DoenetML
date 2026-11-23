import React from "react";
import { createPortal } from "react-dom";
import { BasicComponent } from "../types";
import { GraphControlsContext } from "./graph";

/**
 * An input placed in a graph, drawn as it is in text among the graph's
 * controls, over the board's corner. A core draws it at an anchor in the
 * graph, which none sends yet. Not drawn on the server, which has no board.
 */
export function inGraphControl<Data>(
    Component: BasicComponent<Data>,
): BasicComponent<Data> {
    function InGraphControl(props: React.ComponentProps<BasicComponent<Data>>) {
        const controls = React.useContext(GraphControlsContext);
        if (!controls) {
            return null;
        }
        return createPortal(
            <div className="graph-control">
                <Component {...props} />
            </div>,
            controls,
        );
    }
    InGraphControl.displayName = `InGraph(${Component.displayName ?? Component.name})`;
    return InGraphControl;
}
