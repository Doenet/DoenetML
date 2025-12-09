import React, { useState, useEffect } from "react";
import { Checkbox, Radio } from "@ariakit/react";
import { MathJax } from "better-react-mathjax";
import classNames from "classnames";

export function ToggleButton(
    props: React.PropsWithChildren<{
        onClick?: (index?: number | null) => void;
        id?: string;
        /**
         * If `ToggleButton` is used inside a `ToggleButtonGroup`, `index` is its position in the group.
         */
        index?: number;
        value?: string;
        valueHasLatex?: boolean;
        icon?: React.ReactNode;
        isSelected?: boolean;
        vertical?: boolean;
        alert?: boolean;
        disabled?: boolean;
        inputType?: "checkbox" | "radio";
        ariaLabel?: string;
    }>,
) {
    const inputType = props.inputType ?? "checkbox";
    const [isSelected, setSelected] = useState(!!props.isSelected);

    // XXX: This is a weird way to allow the button to change its own state but
    // also accept state changes from parents. I believe it violates the React principle that you
    // should be able to re-render at any time.
    useEffect(() => {
        setSelected(!!props.isSelected);
    }, [props.isSelected]);

    // We use `value` or `children` to display the button content.
    if (props.value != null && props.children != null) {
        console.warn(
            "Button: Both `value` and `children` props are provided. Using `value`.",
        );
    }
    let value = props.value ?? props.children;
    if (value && props.valueHasLatex) {
        value = (
            <MathJax hideUntilTypeset={"first"} inline dynamic>
                {value}
            </MathJax>
        );
    }

    let icon = props.icon && <div className="button-icon">{props.icon}</div>;

    const Input = inputType === "radio" ? Radio : Checkbox;

    return (
        <label
            className={classNames(
                "doenet-toggle-button-label",
                "doenet-button",
                "action-button",
            )}
        >
            <Input
                value=""
                id={props.id}
                checked={isSelected}
                onChange={() => {
                    setSelected(!isSelected);
                    if (props.onClick) {
                        props.onClick(props.index != null ? props.index : null);
                    }
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        // Trigger a change event when Enter is pressed
                        e.target.dispatchEvent(
                            new MouseEvent("click", {
                                bubbles: true,
                                cancelable: true,
                            }),
                        );
                    }
                }}
                className="doenet-toggle-button"
                aria-label={props.ariaLabel}
            />
            {icon}
            {value}
        </label>
    );
}
