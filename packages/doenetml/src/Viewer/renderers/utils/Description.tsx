import { ReactNode, useContext, useRef } from "react";
import { MdInfoOutline } from "react-icons/md";
import * as Ariakit from "@ariakit/react";
import React from "react";

import { DocContext } from "../../DocViewer";
import { useT } from "../../../utils/i18n";
import "./Description.css";

export function DescriptionAsDetails({ children }: { children: ReactNode }) {
    const t = useT();

    return (
        <details className="description" data-test="Description">
            <summary
                title={t(
                    "description-more-information",
                    undefined,
                    "more information",
                )}
                data-test="Description Summary"
            >
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
    const t = useT();

    return (
        <>
            <Ariakit.PopoverDisclosure
                store={popover}
                className="description-popover-button"
                title={t(
                    "description-more-information",
                    undefined,
                    "more information",
                )}
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
