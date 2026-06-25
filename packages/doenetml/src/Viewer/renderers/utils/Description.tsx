import { ReactNode, useContext, useRef } from "react";
import { MdInfoOutline } from "react-icons/md";
import * as Ariakit from "@ariakit/react";
import React from "react";

import { DocContext } from "../../DocViewer";
import "./Description.css";

export function DescriptionAsDetails({ children }: { children: ReactNode }) {
    return (
        <details className="description" data-test="Description">
            <summary title="more information" data-test="Description Summary">
                <MdInfoOutline />
            </summary>
            <div className="details-content">{children}</div>
        </details>
    );
}

export function DescriptionPopover({ children }: { children: ReactNode }) {
    const popover = Ariakit.usePopoverStore();
    const popoverRef = useRef<HTMLDivElement>(null);
    const { darkMode } = useContext(DocContext) || {};

    return (
        <>
            <Ariakit.PopoverDisclosure
                store={popover}
                className="description-popover-button"
                title="more information"
                data-test="Description Button"
            >
                <MdInfoOutline />
            </Ariakit.PopoverDisclosure>

            <Ariakit.Popover
                store={popover}
                ref={popoverRef}
                initialFocus={popoverRef}
                gutter={2}
                data-theme={darkMode ?? "light"}
                className="description-popover"
                data-test="Description"
            >
                <Ariakit.PopoverArrow />
                {children}
            </Ariakit.Popover>
        </>
    );
}
