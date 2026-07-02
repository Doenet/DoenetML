import React from "react";
import "./alert.css";

export type AlertVariant = "danger" | "warning" | "info" | "success";

export type AlertProps = {
    variant?: AlertVariant;
    onClose?: () => void;
    dismissible?: boolean;
    children: React.ReactNode;
    className?: string;
};

export function Alert({
    variant = "info",
    onClose,
    dismissible,
    children,
    className = "",
}: AlertProps) {
    return (
        <div
            role="alert"
            className={`ui-alert ui-alert--${variant} ${className}`}
        >
            <div className="ui-alert-body">{children}</div>
            {dismissible && onClose && (
                <button
                    className="ui-alert-close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
            )}
        </div>
    );
}

export function AlertHeading({ children }: { children: React.ReactNode }) {
    return <h5 className="ui-alert-heading">{children}</h5>;
}

Alert.Heading = AlertHeading;
