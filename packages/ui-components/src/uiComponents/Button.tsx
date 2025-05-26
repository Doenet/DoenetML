import React, { useState } from "react";
import styled from "styled-components";
import { MathJax } from "better-react-mathjax";

const ButtonStyling = styled.button<{
    width?: string;
    alert?: boolean;
    fillColor?: string;
}>`
    margin: ${(props) => props.theme.margin};
    height: 24px;
    width: ${(props) => props.width};
    border-style: hidden;
    // border-color: var(--canvastext);
    // border-width: 2px;
    color: white;
    background-color: ${(props) =>
        props.alert
            ? "var(--mainRed)"
            : (props.fillColor ?? "var(--mainBlue)")};
    border-radius: ${(props) => props.theme.borderRadius};
    padding: ${(props) => props.theme.padding};
    cursor: pointer;
    font-size: 12px;
    border-radius: 20px;

    &:hover {
        background-color: ${(props) =>
            props.alert
                ? "var(--lightRed)"
                : props.fillColor
                  ? `oklch(from ${props.fillColor} calc(l * 1.5) c h)`
                  : "var(--lightBlue)"};
        color: black;
    }

    &:focus {
        outline: 2px solid
            ${(props) =>
                props.alert
                    ? "var(--mainRed)"
                    : props.disabled
                      ? "var(--canvastext)"
                      : "var(--mainBlue)"};
        outline-offset: 2px;
    }
`;

ButtonStyling.defaultProps = {
    theme: {
        margin: 0,
        borderRadius: "var(--mainBorderRadius)",
        padding: "0 10px",
    },
};

const Label = styled.p<{ labelVisible: string; align: string }>`
    font-size: 14px;
    display: ${(props) => props.labelVisible};
    margin-right: 5px;
    margin-bottom: ${(props) => (props.align == "flex" ? "none" : "2px")};
`;

const Container = styled.div<{ align?: string }>`
    display: ${(props) => (props.align ? props.align : "inline-block")};
    width: auto;
    align-items: center;
`;

export function Button(props: {
    width?: string;
    label?: string;
    value?: string;
    icon?: React.ReactNode;
    vertical?: boolean;
    valueHasLatex?: boolean;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    dataTest?: string;
}) {
    //Assume small
    var container: React.CSSProperties = {};
    var align = "flex";
    var button: React.CSSProperties & { value: React.ReactNode } = {
        value: "Button",
    };
    if (props.width) {
        if (props.width === "menu") {
            button.width = "var(--menuWidth)";
            if (props.label) {
                container.width = "var(--menuWidth)";
                button.width = "100%";
            }
        }
    }

    const labelVisible = props.label ? "static" : "none";
    var label = "";
    if (props.label) {
        label = props.label;
        if (props.vertical) {
            align = "static";
        }
    }

    var icon: React.ReactNode = "";
    if (props.value || props.icon) {
        if (props.value && props.icon) {
            icon = props.icon;
            button.value = props.value;
        } else if (props.value) {
            button.value = props.value;
        } else if (props.icon) {
            icon = props.icon;
            button.value = "";
        }
        if (props.value && props.valueHasLatex) {
            button.value = (
                <MathJax hideUntilTypeset={"first"} inline dynamic>
                    {button.value}
                </MathJax>
            );
        }
    }

    if (props.disabled) {
        button.backgroundColor = "var(--mainGray)";
        button.color = "var(--canvastext)";
        button.cursor = "not-allowed";
    }

    return (
        <Container style={container} align={align}>
            <Label labelVisible={labelVisible} align={align}>
                {label}
            </Label>
            <ButtonStyling
                disabled={props.disabled}
                aria-disabled={props.disabled}
                aria-labelledby={label}
                aria-label={String(button.value)}
                data-test={props.dataTest}
                style={button}
                {...props}
                onClick={(e) => {
                    if (props.onClick) {
                        props.onClick(e);
                    }
                }}
            >
                {icon} {button.value}
            </ButtonStyling>
        </Container>
    );
}
