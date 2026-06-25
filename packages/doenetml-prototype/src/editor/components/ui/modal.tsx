import React from "react";
import {
    Dialog,
    DialogProvider,
    DialogDismiss,
    DialogHeading,
    useDialogStore,
} from "@ariakit/react";
import "./modal.css";

export type ModalSize = "sm" | "md" | "lg" | "xl";

export type ModalProps = {
    show: boolean;
    onHide: () => void;
    size?: ModalSize;
    dialogClassName?: string;
    children: React.ReactNode;
};

export function Modal({
    show,
    onHide,
    size = "md",
    dialogClassName = "",
    children,
}: ModalProps) {
    const store = useDialogStore({
        open: show,
        setOpen: (open) => !open && onHide(),
    });

    return (
        <DialogProvider store={store}>
            <Dialog
                store={store}
                backdrop={<div className="ui-modal-backdrop" />}
                className={["ui-modal", `ui-modal--${size}`, dialogClassName]
                    .filter(Boolean)
                    .join(" ")}
            >
                {children}
            </Dialog>
        </DialogProvider>
    );
}

export function ModalHeader({
    closeButton,
    children,
}: {
    closeButton?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="ui-modal-header">
            <div className="ui-modal-header-content">{children}</div>
            {closeButton && (
                <DialogDismiss className="ui-modal-close" aria-label="Close">
                    ×
                </DialogDismiss>
            )}
        </div>
    );
}

export function ModalTitle({ children }: { children: React.ReactNode }) {
    return <DialogHeading className="ui-modal-title">{children}</DialogHeading>;
}

export function ModalBody({ children }: { children: React.ReactNode }) {
    return <div className="ui-modal-body">{children}</div>;
}

export function ModalFooter({ children }: { children: React.ReactNode }) {
    return <div className="ui-modal-footer">{children}</div>;
}

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
