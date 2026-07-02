import React from "react";
import "./button.css";

export type ButtonVariant = "primary" | "secondary" | "light" | "danger";
export type ButtonSize = "sm" | "md";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ variant = "secondary", size = "md", className = "", ...props }, ref) => {
        const classes = [
            "ui-button",
            `ui-button--${variant}`,
            size === "sm" ? "ui-button--sm" : "",
            className,
        ]
            .filter(Boolean)
            .join(" ");
        return <button ref={ref} className={classes} {...props} />;
    },
);
Button.displayName = "Button";
