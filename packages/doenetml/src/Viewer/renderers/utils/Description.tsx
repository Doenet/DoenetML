import { ReactNode, useRef } from "react";
import { MdInfoOutline } from "react-icons/md";
import * as Ariakit from "@ariakit/react";
import React from "react";

import "./Description.css";

export function DescriptionAsDetails({ children }: { children: ReactNode }) {
    return (
        <details className="description">
            <summary title="more information">
                <MdInfoOutline />
            </summary>
            <div className="details-content">{children}</div>
        </details>
    );
}

export function DescriptionPopover({ children }: { children: ReactNode }) {
    const popover = Ariakit.usePopoverStore();
    const popoverRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <Ariakit.PopoverDisclosure
                store={popover}
                className="description-popover-button"
                title="more information"
            >
                <MdInfoOutline />
            </Ariakit.PopoverDisclosure>

            <Ariakit.Popover
                store={popover}
                ref={popoverRef}
                initialFocus={popoverRef}
                gutter={2}
                className="description-popover"
            >
                <Ariakit.PopoverArrow />
                {children}
            </Ariakit.Popover>
        </>
    );
}
