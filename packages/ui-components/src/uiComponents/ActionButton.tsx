import React from "react";
import styled from "styled-components";

const Button = styled.button<{
    width?: string;
    alert?: boolean;
}>`
    margin: ${(props) => props.theme.margin};
    height: 24px;
    width: ${(props) => props.width};
    border: ${(props) => props.theme.border};
    color: white;
    background-color: ${(props) =>
        props.alert ? "var(--mainRed)" : "var(--mainBlue)"};
    border-radius: ${(props) => props.theme.borderRadius};
    padding: ${(props) => props.theme.padding};
    cursor: pointer;
    font-size: 12px;

    &:hover {
        // Button color lightens on hover
        color: black;
        background-color: ${(props) =>
            props.alert ? "var(--lightRed)" : "var(--lightBlue)"};
    }

    &:focus {
        outline: 2px solid white;
        outline-offset: ${(props) => props.theme.outlineOffset};
    }
`;

Button.defaultProps = {
    theme: {
        margin: "0px 4px 0px 4px",
        borderRadius: "var(--mainBorderRadius)",
        padding: "0px 10px 0px 10px",
        border: "none",
        outlineOffset: "-4px",
    },
};

const Label = styled.p<{
    labelVisible: string;
    align?: string;
}>`
    font-size: 14px;
    display: ${(props) => props.labelVisible};
    margin-right: 5px;
    margin-left: 4px;
    margin-bottom: ${(props) => (props.align == "flex" ? "none" : "2px")};
`;

const Container = styled.div<{
    align?: string;
}>`
    display: ${(props) => props.align};
    /* width: 100%; */
    min-width: 0;
    align-items: center;
`;

export function ActionButton(props: {
    id?: string;
    dataTest?: string;
    width?: string;
    label?: string;
    value?: string;
    icon?: React.ReactNode;
    vertical?: boolean;
    num?: "first" | "last" | "first_vert" | "last_vert";
    disabled?: boolean;
    overflow?: "no_overflow";
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    alert?: boolean;
}) {
    const alert = props.alert ? props.alert : false;
    //Assume small

    var container: React.CSSProperties = {};
    var align = "flex";
    var actionButton: React.CSSProperties & {
        value: string;
        whitespace?: string;
    } = {
        value: "Action Button",
    };

    if (props.width) {
        if (props.width === "menu") {
            // Makes the action button group the correct width in the menu panel
            // Does not work when 235px due to the LabelContainer div in ActionButtonGroup
            actionButton.width = "var(--menuWidth)";
            if (props.label) {
                container.width = "var(--menuWidth)";
                actionButton.width = "100%";
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
            actionButton.value = props.value;
        } else if (props.value) {
            actionButton.value = props.value;
        } else if (props.icon) {
            icon = props.icon;
            actionButton.value = "";
        }
    }

    if (props.num === "first") {
        actionButton.borderRadius = "5px 0px 0px 5px";
    }

    if (props.num === "last") {
        actionButton.borderRadius = "0px 5px 5px 0px";
    }

    if (props.num === "first_vert") {
        actionButton.borderRadius = "5px 5px 0px 0px";
    }

    if (props.num === "last_vert") {
        actionButton.borderRadius = "0px 0px 5px 5px";
    }

    if (props.disabled) {
        actionButton.backgroundColor = "var(--mainGray)";
        actionButton.color = "black";
        actionButton.cursor = "not-allowed";
    }

    if (props.overflow === "no_overflow") {
        actionButton.overflow = "hidden";
        actionButton.textOverflow = "ellipsis";
        actionButton.whitespace = "nowrap";
    }

    return (
        <Container style={container} align={align}>
            <Label labelVisible={labelVisible} align={align}>
                {label}
            </Label>
            <Button
                aria-labelledby={label}
                aria-label={actionButton.value}
                aria-disabled={props.disabled}
                id={props.id}
                data-test={props.dataTest}
                style={actionButton}
                alert={alert}
                disabled={props.disabled}
                onClick={(e) => {
                    if (props.disabled !== true) {
                        if (props.onClick) {
                            props.onClick(e);
                        }
                    }
                }}
            >
                {icon} {actionButton.value}
            </Button>
        </Container>
    );
}
