import React, { useState } from "react";
import { MathJax } from "better-react-mathjax";
import { Button as AriakitButton } from "@ariakit/react";
import classNames from "classnames";

export function Button(
    props: React.PropsWithChildren<{
        id?: string;
        fillColor?: string;
        alert?: boolean;
        label?: string;
        value?: string;
        icon?: React.ReactNode;
        vertical?: boolean;
        valueHasLatex?: boolean;
        disabled?: boolean;
        onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
        className?: string;
        ariaLabel?: string;
    }>,
) {
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

    const button = (
        <AriakitButton
            id={props.id}
            disabled={props.disabled}
            onClick={props.onClick}
            className={classNames(
                "doenet-button",
                {
                    vertical: props.vertical,
                    alert: props.alert,
                },
                props.className,
            )}
            style={
                props.fillColor
                    ? ({
                          "--button-color": props.fillColor,
                      } as React.CSSProperties)
                    : undefined
            }
            aria-label={props.ariaLabel}
        >
            {icon}
            {value}
        </AriakitButton>
    );

    if (props.label) {
        return (
            <div
                className={classNames("doenet-labelled-button", {
                    vertical: props.vertical,
                })}
            >
                <span className="label">{props.label}</span>
                {button}
            </div>
        );
    }

    return button;
}
