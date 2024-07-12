import React from "react";
import { BsGripHorizontal, BsGripVertical } from "react-icons/bs";
import classNames from "classnames";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import "./resizable-panel-pair.css";

type ResizablePanelPairProps = {
    direction?: "vertical" | "horizontal";
    panelA: React.ReactNode;
    panelB: React.ReactNode;
};

/**
 * A pair of panels stacked left-right or top-bottom, with a draggable divider between them.
 */
export function ResizablePanelPair({
    panelA,
    panelB,
    direction = "horizontal",
}: ResizablePanelPairProps) {
    const grip =
        direction === "horizontal" ? <BsGripVertical /> : <BsGripHorizontal />;
    return (
        <PanelGroup
            direction={direction}
            className={classNames("resizable-panel-pair", direction)}
        >
            <Panel>
                <div className="panel-inner">{panelA}</div>
            </Panel>
            <PanelResizeHandle className="divider">{grip}</PanelResizeHandle>
            <Panel>
                <div className="panel-inner">{panelB}</div>
            </Panel>
        </PanelGroup>
    );
}
