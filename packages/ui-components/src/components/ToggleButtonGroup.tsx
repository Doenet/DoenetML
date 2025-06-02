import classNames from "classnames";
import React, { useState } from "react";
import { ToggleButton } from "./ToggleButton";
import { RadioGroup, RadioProvider } from "@ariakit/react";

type ToggleButtonNode = React.ReactElement<typeof ToggleButton>;

function isToggleButton(node: React.ReactNode): node is ToggleButtonNode {
    return React.isValidElement(node) && node.type === ToggleButton;
}

export const ToggleButtonGroup = (props: {
    onClick?: (index: number) => void;
    vertical?: boolean;
    children: React.ReactElement<typeof ToggleButton>[];
}) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const onClick = React.useCallback(
        (e: React.MouseEvent | React.KeyboardEvent) => {
            if ("key" in e && e.key !== "Enter") {
                return; // Only handle Enter key for keyboard events
            }
            const target = e.target as HTMLElement;
            const button =
                target.querySelector(".doenet-toggle-button") ||
                target.closest(".doenet-toggle-button");
            if (!button || !containerRef.current) {
                return;
            }
            const allToggleButtons = Array.from(
                containerRef.current?.querySelectorAll(
                    ".doenet-toggle-button",
                ) || [],
            );
            const index = allToggleButtons.indexOf(button);
            if (index === -1) {
                return;
            }
            setSelectedIndex(index);
            if (props.onClick) {
                props.onClick(index);
            }
        },
        [props.onClick],
    );

    const handleClick = (index: number) => {};

    // We override the `props` on our children so that they become controlled components.
    const children = React.Children.map(props.children, (child, index) => {
        if (!isToggleButton(child)) {
            console.warn(
                "ToggleButtonGroup was passed a child that is not a ToggleButton.",
            );
            return child; // If not a valid element, return as is
        }
        return React.cloneElement(child, {
            isSelected: index === selectedIndex,
            index,
            inputType: "radio", // Always use radio for ToggleButtonGroup
        } as React.ComponentProps<typeof ToggleButton>);
    });

    return (
        <RadioProvider>
            <RadioGroup
                className={classNames("doenet-button-group", {
                    vertical: props.vertical,
                })}
                ref={containerRef}
                onClick={onClick}
                onKeyDown={onClick}
            >
                {children}
            </RadioGroup>
        </RadioProvider>
    );
};
