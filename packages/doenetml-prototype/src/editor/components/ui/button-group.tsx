import React from "react";
import "./button-group.css";

export type ButtonGroupProps = React.HTMLAttributes<HTMLDivElement>;

export function ButtonGroup({ className = "", ...props }: ButtonGroupProps) {
    return (
        <div
            className={`ui-button-group ${className}`}
            role="group"
            {...props}
        />
    );
}
