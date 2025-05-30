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
    collapsedSize = 15,
    isOpen,
    setIsOpen,
}: {
    mainPanel: React.JSX.Element;
    subPanel: React.JSX.Element;
    isOpen: boolean;
    setIsOpen: (arg: boolean) => void;
    collapsedSize?: number;
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
                <Panel
                    ref={collapsablePanelRef}
                    collapsible={true}
                    collapsedSize={5}
                    minSize={collapsedSize}
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
