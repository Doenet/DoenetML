import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { MathJax } from "better-react-mathjax";

const Button = styled.button<{
    alert?: boolean;
    disabled?: boolean;
}>`
    margin: ${(props) => props.theme.margin};
    height: 24px;
    border: ${(props) =>
        props.alert
            ? "2px solid var(--mainRed)"
            : props.disabled
              ? "2px solid var(--mainGray)"
              : "2px solid var(--mainBlue)"};
    border-width: 2px;
    color: ${(props) =>
        props.alert
            ? "var(--mainRed)"
            : props.disabled
              ? "var(--mainGray)"
              : "var(--mainBlue)"};
    background-color: var(--canvas);
    border-radius: ${(props) => props.theme.borderRadius};
    padding: ${(props) => props.theme.padding};
    cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
    font-size: 12px;
    text-align: center;

    &:hover {
        // Button color lightens on hover
        color: ${(props) => (props.disabled ? "var(--mainGray)" : "black")};
        background-color: ${(props) =>
            props.alert
                ? "var(--lightRed)"
                : props.disabled
                  ? "none"
                  : "var(--lightBlue)"};
    }

    &:focus {
        outline: 2px solid
            ${(props) =>
                props.disabled
                    ? "var(--mainGray)"
                    : props.alert
                      ? "var(--mainRed)"
                      : "var(--mainBlue)"};
        outline-offset: 2px;
    }
`;

Button.defaultProps = {
    theme: {
        margin: "0px",
        borderRadius: "var(--mainBorderRadius)",
        padding: "0px 10px 0px 10px",
    },
};

export function ToggleButton(props: {
    onClick?: (index?: number | null) => void;
    id?: string;
    index?: number;
    value?: string;
    valueHasLatex?: boolean;
    icon?: React.ReactNode;
    label?: string;
    switch_value?: string;
    isSelected?: boolean;
    vertical?: boolean;
    alert?: boolean;
    disabled?: boolean;
    num?: "first" | "last" | "first_vert" | "last_vert";
    width?: "menu" | string;
}) {
    const [isSelected, setSelected] = useState(!!props.isSelected);
    const labelVisible = props.label ? "static" : "none";
    const align = props.vertical ? "static" : "flex";
    const alert = !!props.alert;
    const disabled = !!props.disabled;

    useEffect(() => {
        setSelected(!!props.isSelected);
    }, [props.isSelected]);
    //Assume small
    var toggleButton: React.CSSProperties & { value: string } = {
        value: "Toggle Button",
    };

    var icon: React.ReactNode = "";
    var label = {
        value: "Label:",
        fontSize: "14px",
        display: `${labelVisible}`,
        marginRight: "5px",
        marginBottom: `${align == "flex" ? "none" : "2px"}`,
    };

    var container: React.CSSProperties = {
        display: `${align}`,
        // width: 'auto',
        alignItems: "center",
    };

    if (props.value || props.icon) {
        if (props.value && props.icon) {
            icon = props.icon;
            toggleButton.value = props.value;
        } else if (props.value) {
            toggleButton.value = props.value;
        } else if (props.icon) {
            icon = props.icon;
            toggleButton.value = "";
        }
        if (props.value && props.valueHasLatex) {
            toggleButton.value = (
                <MathJax hideUntilTypeset={"first"} inline dynamic>
                    {toggleButton.value}
                </MathJax>
            ) as any as string;
        }
    }

    if (isSelected === true) {
        if (!props.disabled) {
            if (!props.alert) {
                toggleButton.backgroundColor = "var(--mainBlue)";
            } else {
                toggleButton.backgroundColor = "var(--mainRed)";
            }
            toggleButton.color = "var(--canvas)";
            if (props.switch_value) toggleButton.value = props.switch_value;
        }
    }

    function handleClick() {
        if (props.onClick)
            props.onClick(
                props.index !== null && props.index !== undefined
                    ? props.index
                    : null,
            );
    }

    if (props.label) {
        label.value = props.label;
    }

    if (props.width) {
        if (props.width === "menu") {
            toggleButton.width = "var(--menuWidth)";
            if (props.label) {
                container.width = "var(--menuWidth)";
                toggleButton.width = "100%";
            }
        }
    }

    if (props.num === "first") {
        toggleButton.borderRadius = "5px 0px 0px 5px";
    }

    if (props.num === "last") {
        toggleButton.borderRadius = "0px 5px 5px 0px";
    }

    if (props.num === "first_vert") {
        toggleButton.borderRadius = "5px 5px 0px 0px";
    }

    if (props.num === "last_vert") {
        toggleButton.borderRadius = "0px 0px 5px 5px";
    }

    return (
        <>
            <div style={container}>
                <p id="toggle-button-label" style={label}>
                    {label.value}
                </p>
                <Button
                    aria-labelledby="toggle-button-label"
                    aria-pressed={props.isSelected}
                    aria-disabled={props.disabled ? true : false}
                    id={props.id}
                    style={toggleButton}
                    disabled={disabled}
                    alert={alert}
                    onClick={() => {
                        handleClick();
                    }}
                >
                    {icon} {toggleButton.value}
                </Button>
            </div>
        </>
    );
}
