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
    }>,
) {
    console.log(
        { cn: props.className },
        classNames("action-button", props.className),
    );
    return (
        <Button
            {...props}
            className={classNames("action-button", props.className)}
        >
            {props.children}
        </Button>
    );
}
