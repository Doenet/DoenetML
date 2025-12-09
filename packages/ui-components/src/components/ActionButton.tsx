import React from "react";
import { Button } from "./Button";
import classNames from "classnames";

export function ActionButton(
    props: React.PropsWithChildren<{
        id?: string;
        label?: string;
        value?: string;
        icon?: React.ReactNode;
        vertical?: boolean;
        disabled?: boolean;
        onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
        alert?: boolean;
        className?: string;
        fillColor?: string;
        ariaLabel?: string;
    }>,
) {
    return (
        <Button
            {...props}
            className={classNames("action-button", props.className)}
        >
            {props.children}
        </Button>
    );
}
