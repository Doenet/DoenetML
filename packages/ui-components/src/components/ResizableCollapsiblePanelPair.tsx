import classNames from "classnames";
import React from "react";
import { BsGripHorizontal } from "react-icons/bs";
import {
    Panel,
    PanelGroup,
    PanelResizeHandle,
    ImperativePanelHandle,
} from "react-resizable-panels";

export function ResizableCollapsiblePanelPair({
    mainPanel,
    subPanel,
    alwaysVisiblePanel,
    collapsedSize = 15,
    defaultSize,
    isOpen,
    setIsOpen,
}: {
    mainPanel: React.ReactNode;
    subPanel: React.ReactNode;
    alwaysVisiblePanel?: React.ReactNode;
    isOpen: boolean;
    setIsOpen: (arg: boolean) => void;
    /**
     * Snap-closed threshold for the sub-panel, as a percentage of the
     * container. Drag below this and the panel collapses to `collapsedSize=0`.
     * Despite the name, this is forwarded as the inner Panel's `minSize`.
     */
    collapsedSize?: number;
    /**
     * Initial size of the sub-panel (percentage of the container) at mount.
     * Forwarded to `react-resizable-panels`' `defaultSize`, which is applied
     * once at mount only — later open/close cycles via `isOpen` use the
     * panel's last-resized size, not this value. If omitted,
     * `react-resizable-panels` allocates the remaining space (~50% with a
     * single sibling).
     */
    defaultSize?: number;
}) {
    const collapsablePanelRef = React.useRef<ImperativePanelHandle>(null);

    React.useEffect(() => {
        if (collapsablePanelRef.current) {
            if (isOpen) {
                collapsablePanelRef.current.expand();
            } else {
                collapsablePanelRef.current.collapse();
            }
        }
    }, [isOpen]);

    return (
        <div style={{ height: "100%", width: "100%", boxSizing: "border-box" }}>
            <PanelGroup direction="vertical">
                <Panel>{mainPanel}</Panel>
                <PanelResizeHandle
                    className={classNames(
                        "doenet-resizable-panel-handle",
                        "vertical",
                        "collapsible",
                        { isOpen },
                    )}
                    // For Cypress tests
                    data-test="contentPanelDragHandle"
                >
                    {isOpen && <BsGripHorizontal />}
                </PanelResizeHandle>
                {alwaysVisiblePanel}
                <Panel
                    ref={collapsablePanelRef}
                    collapsible={true}
                    collapsedSize={0}
                    minSize={collapsedSize}
                    defaultSize={defaultSize}
                    onCollapse={() => {
                        setIsOpen(false);
                    }}
                    onExpand={() => {
                        setIsOpen(true);
                    }}
                >
                    {subPanel}
                </Panel>
            </PanelGroup>
        </div>
    );
}
