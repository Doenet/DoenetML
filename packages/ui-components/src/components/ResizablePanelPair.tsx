import classNames from "classnames";
import React from "react";
import { BsGripHorizontal, BsGripVertical } from "react-icons/bs";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export function ResizablePanelPair({
    panelA,
    panelB,
    preferredDirection = "horizontal",
    width = "100%",
    height = "100%",
    border = "1px solid",
}: {
    panelA: React.ReactNode;
    panelB: React.ReactNode;
    preferredDirection?: "horizontal" | "vertical";
    width?: string;
    height?: string;
    border?: string;
}) {
    const panelContainerRef = React.useRef(null);
    const [direction, setDirection] = React.useState(preferredDirection);
    const grip =
        direction === "horizontal" ? <BsGripVertical /> : <BsGripHorizontal />;

    // Set up a watcher on panelContainerRef to change the direction
    // when the container test too narrow.
    React.useEffect(() => {
        if (!panelContainerRef.current) {
            return;
        }
        // Set up a ResizeObserver to watch the container size
        const resizeObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const width = entry.contentRect.width;
                const desiredDirection =
                    width < 430 ? "vertical" : preferredDirection;
                if (desiredDirection !== direction) {
                    setDirection(desiredDirection);
                }
            }
        });
        resizeObserver.observe(panelContainerRef.current);
        // Cleanup the observer on unmount
        return () => {
            resizeObserver.disconnect();
        };
    }, [direction, preferredDirection]);

    return (
        <div
            ref={panelContainerRef}
            style={{
                width: width,
                height: height,
                border: border,
                boxSizing: "border-box",
            }}
        >
            <PanelGroup direction={direction}>
                <Panel>{panelA}</Panel>
                <PanelResizeHandle
                    className={classNames("doenet-resizable-panel-handle", {
                        vertical: direction === "vertical",
                    })}
                    // For Cypress tests
                    data-test="contentPanelDragHandle"
                >
                    {grip}
                </PanelResizeHandle>
                <Panel>{panelB}</Panel>
            </PanelGroup>
        </div>
    );
}
