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
    callbacks: OnClick[];
    registrations: {
        id: number;
        onClick: OnClick;
        theme?: "dark" | "light";
        ownerRef?: React.RefObject<HTMLElement | null>;
    }[];
    lastActiveRegistrationId: number | null;
    nextRegistrationId: number;
    handleFocusChange?: () => void;
};

const globalThis = Function("return this")() || {};
const LEGACY_VIRTUAL_KEYBOARD_STATE_KEY = "virtualKeyboardState";
const VIRTUAL_KEYBOARD_STATE_KEY = "__doenetVirtualKeyboardState_v2";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function createVirtualKeyboardState(
    existingState?: Record<string, unknown>,
): VirtualKeyboardState {
    const registrations = Array.isArray(existingState?.registrations)
        ? (existingState.registrations as VirtualKeyboardState["registrations"])
        : [];
    const state = (existingState ?? {}) as VirtualKeyboardState;

    const nextRegistrationIdFromRegistrations = registrations.reduce(
        (maxId, registration) => Math.max(maxId, registration.id + 1),
        0,
    );

    state.count =
        typeof existingState?.count === "number" ? existingState.count : 0;
    state.keyboardDomNode =
        existingState?.keyboardDomNode instanceof HTMLElement
            ? existingState.keyboardDomNode
            : null;
    state.keyboardReactRoot =
        existingState?.keyboardReactRoot &&
        typeof existingState.keyboardReactRoot === "object"
            ? (existingState.keyboardReactRoot as Root)
            : null;
    state.callbacks = Array.isArray(existingState?.callbacks)
        ? (existingState.callbacks as OnClick[])
        : [];
    state.registrations = registrations;
    state.lastActiveRegistrationId =
        typeof existingState?.lastActiveRegistrationId === "number"
            ? existingState.lastActiveRegistrationId
            : null;
    state.nextRegistrationId =
        typeof existingState?.nextRegistrationId === "number"
            ? Math.max(
                  existingState.nextRegistrationId,
                  nextRegistrationIdFromRegistrations,
              )
            : nextRegistrationIdFromRegistrations;
    state.handleFocusChange =
        typeof existingState?.handleFocusChange === "function"
            ? (existingState.handleFocusChange as () => void)
            : undefined;

    return state;
}

const legacyVirtualKeyboardState = isRecord(
    globalThis?.[LEGACY_VIRTUAL_KEYBOARD_STATE_KEY],
)
    ? globalThis[LEGACY_VIRTUAL_KEYBOARD_STATE_KEY]
    : undefined;
const versionedVirtualKeyboardState = isRecord(
    globalThis?.[VIRTUAL_KEYBOARD_STATE_KEY],
)
    ? globalThis[VIRTUAL_KEYBOARD_STATE_KEY]
    : undefined;

const virtualKeyboardState: VirtualKeyboardState = createVirtualKeyboardState(
    legacyVirtualKeyboardState ?? versionedVirtualKeyboardState,
);
globalThis[LEGACY_VIRTUAL_KEYBOARD_STATE_KEY] = virtualKeyboardState;
globalThis[VIRTUAL_KEYBOARD_STATE_KEY] = virtualKeyboardState;

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
        virtualKeyboardState.keyboardDomNode?.contains(activeElement)
    ) {
        return getRegistrationById(
            virtualKeyboardState.lastActiveRegistrationId,
        );
    }

    return null;
}

function getFallbackRegistrations() {
    return virtualKeyboardState.registrations.filter(
        (registration) => !registration.ownerRef?.current,
    );
}

function rerenderTray() {
    virtualKeyboardState.keyboardReactRoot?.render(
        renderTray(getActiveRegistration()?.theme),
    );
}

function renderTray(theme: "dark" | "light" | undefined) {
    return (
        <MathJaxContext config={mathjaxConfig} version={4}>
            <KeyboardTray
                theme={theme}
                onClick={(e) => {
                    const activeRegistration = getActiveRegistration();
                    if (activeRegistration) {
                        // Route key events only to the active registration so
                        // that multiple mounted viewers/iframes do not all
                        // receive the same keyboard commands.
                        activeRegistration.onClick(e);
                        return;
                    }

                    const fallbackRegistrations = getFallbackRegistrations();
                    if (fallbackRegistrations.length > 0) {
                        fallbackRegistrations.forEach((registration) =>
                            registration.onClick(e),
                        );
                        return;
                    }

                    // Older bundles still broadcast through `callbacks`. Keep
                    // honoring them so mixed old/new pages continue to share a
                    // single tray instead of mounting duplicates.
                    virtualKeyboardState.callbacks.forEach((callback) =>
                        callback(e),
                    );
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
    ownerRef?: React.RefObject<HTMLElement | null>;
}) {
    // Allocate a stable registration ID for this instance using a lazy useState
    // initializer. This runs exactly once per mounted instance (at commit time
    // for the initial render), so it does not mutate global state during render
    // or in React's StrictMode double-invocation / concurrent-mode retries.
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
                virtualKeyboardState.lastActiveRegistrationId = null;
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
