import React from "react";
import { createRoot, Root } from "react-dom/client";
import { OnClick } from "./keyboard";
import { KeyboardTray } from "./keyboard-tray";
import { MathJaxContext } from "better-react-mathjax";
import { mathjaxConfig } from "@doenet/utils";

type VirtualKeyboardState = {
    count: number;
    keyboardDomNode: HTMLElement | null;
    keyboardReactRoot: Root | null;
    registrations: {
        id: number;
        onClick: OnClick;
        theme?: "dark" | "light";
        ownerRef: React.RefObject<HTMLElement | null>;
    }[];
    lastActiveRegistrationId: number | null;
    nextRegistrationId: number;
    handleFocusChange?: () => void;
};

const globalThis = Function("return this")() || {};

const virtualKeyboardState: VirtualKeyboardState =
    globalThis?.virtualKeyboardState || {
        count: 0,
        keyboardDomNode: null,
        keyboardReactRoot: null,
        registrations: [],
        lastActiveRegistrationId: null,
        nextRegistrationId: 0,
    };
globalThis.virtualKeyboardState = virtualKeyboardState;

function getRegistrationById(id: number | null) {
    if (id === null) {
        return null;
    }
    return (
        virtualKeyboardState.registrations.find(
            (registration) => registration.id === id,
        ) ?? null
    );
}

function getTrayElement() {
    return document.getElementById("virtual-keyboard-tray");
}

function getActiveRegistration() {
    const activeElement = document.activeElement;

    for (
        let i = virtualKeyboardState.registrations.length - 1;
        i >= 0;
        i -= 1
    ) {
        const registration = virtualKeyboardState.registrations[i];
        const ownerElement = registration.ownerRef?.current;
        if (
            ownerElement &&
            activeElement instanceof Node &&
            (ownerElement === activeElement ||
                ownerElement.contains(activeElement))
        ) {
            virtualKeyboardState.lastActiveRegistrationId = registration.id;
            return registration;
        }
    }

    if (
        activeElement instanceof Node &&
        getTrayElement()?.contains(activeElement)
    ) {
        return getRegistrationById(
            virtualKeyboardState.lastActiveRegistrationId,
        );
    }

    return null;
}

function getTrayTheme() {
    const activeRegistration = getActiveRegistration();
    if (activeRegistration) {
        return activeRegistration.theme;
    }
    const lastActiveRegistration = getRegistrationById(
        virtualKeyboardState.lastActiveRegistrationId,
    );
    if (lastActiveRegistration) {
        return lastActiveRegistration.theme;
    }
    // No owner is currently focused — use the last registration's theme so
    // the tray reflects the correct dark/light setting even before any
    // interaction (e.g. on initial page load).
    const registrations = virtualKeyboardState.registrations;
    return registrations[registrations.length - 1]?.theme;
}

function rerenderTray() {
    virtualKeyboardState.keyboardReactRoot?.render(renderTray(getTrayTheme()));
}

function renderTray(theme: "dark" | "light" | undefined) {
    return (
        <MathJaxContext config={mathjaxConfig} version={4}>
            <KeyboardTray
                theme={theme}
                onClick={(e) => {
                    // Route key events only to the active (focused) owner.
                    getActiveRegistration()?.onClick(e);
                }}
            />
        </MathJaxContext>
    );
}

/**
 * An expandable keyboard tray that is unique among the document. If multiple instances of `UniqueKeyboardTray` are used,
 * only one will be inserted into the document.
 */
export function UniqueKeyboardTray({
    onClick,
    theme,
    ownerRef,
}: {
    onClick: OnClick;
    theme?: "dark" | "light";
    ownerRef: React.RefObject<HTMLElement | null>;
}) {
    // Allocate a stable registration ID for this instance using a lazy useState
    // initializer. React may invoke the initializer more than once in
    // StrictMode development builds, which can leave gaps in
    // nextRegistrationId, but the first returned value remains this mounted
    // instance's stable ID.
    const [id] = React.useState<number>(() => {
        const next = virtualKeyboardState.nextRegistrationId;
        virtualKeyboardState.nextRegistrationId += 1;
        return next;
    });

    React.useEffect(() => {
        // If the count is zero, we need to create the tray.
        if (virtualKeyboardState.count === 0) {
            const keyboardDomNode = document.createElement("footer");
            keyboardDomNode.id = "virtual-keyboard-dummy";
            document.body.appendChild(keyboardDomNode);
            virtualKeyboardState.keyboardDomNode = keyboardDomNode;

            const root = createRoot(keyboardDomNode);
            virtualKeyboardState.keyboardReactRoot = root;
            virtualKeyboardState.handleFocusChange = () => {
                rerenderTray();
            };
            document.addEventListener(
                "focusin",
                virtualKeyboardState.handleFocusChange,
            );
        }

        virtualKeyboardState.count += 1;
        virtualKeyboardState.registrations.push({
            id,
            onClick,
            theme,
            ownerRef,
        });
        rerenderTray();

        return () => {
            virtualKeyboardState.registrations =
                virtualKeyboardState.registrations.filter(
                    (registration) => registration.id !== id,
                );
            if (virtualKeyboardState.lastActiveRegistrationId === id) {
                // Fall back to the last remaining registration so the tray
                // continues to route events if focus is in the tray or no
                // owner is focused when the active registration unmounts.
                const remaining = virtualKeyboardState.registrations;
                virtualKeyboardState.lastActiveRegistrationId =
                    remaining[remaining.length - 1]?.id ?? null;
            }
            virtualKeyboardState.count -= 1;

            // If the count is zero, we need to remove the tray.
            if (virtualKeyboardState.count === 0) {
                if (virtualKeyboardState.handleFocusChange) {
                    document.removeEventListener(
                        "focusin",
                        virtualKeyboardState.handleFocusChange,
                    );
                    virtualKeyboardState.handleFocusChange = undefined;
                }
                if (virtualKeyboardState.keyboardReactRoot) {
                    // React insists we asynchronously unmount.
                    const root = virtualKeyboardState.keyboardReactRoot;
                    setTimeout(() => {
                        root.unmount();
                    }, 0);
                    virtualKeyboardState.keyboardReactRoot = null;
                }
                if (virtualKeyboardState.keyboardDomNode) {
                    document.body.removeChild(
                        virtualKeyboardState.keyboardDomNode,
                    );
                    virtualKeyboardState.keyboardDomNode = null;
                }
            } else {
                rerenderTray();
            }
        };
    }, []);

    React.useEffect(() => {
        const registration = getRegistrationById(id);
        if (registration) {
            registration.onClick = onClick;
            registration.theme = theme;
            registration.ownerRef = ownerRef;
            rerenderTray();
        }
    }, [onClick, ownerRef, theme]);

    // This component doesn't render anything directly. Instead it relies on a common instance of the keyboard tray already existing.
    return null;
}
