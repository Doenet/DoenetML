import React from "react";
import { Button } from "./Button";

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
    }>,
) {
    return <Button {...props} className="action-button">{props.children}</Button>;
}
