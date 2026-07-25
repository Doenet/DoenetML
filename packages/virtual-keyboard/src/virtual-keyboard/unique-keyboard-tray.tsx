import React from "react";
import { createRoot, Root } from "react-dom/client";
import { OnClick } from "./keyboard";
import { KeyboardTray } from "./keyboard-tray";
import { MathJaxContext } from "@doenet/utils/mathjax";
import { mathjaxConfig } from "@doenet/utils";
import type { Translator } from "@doenet/i18n";

type VirtualKeyboardState = {
    count: number;
    keyboardDomNode: HTMLElement | null;
    keyboardReactRoot: Root | null;
    registrations: {
        id: number;
        onClick: OnClick;
        theme?: "dark" | "light";
        translate?: Translator;
        ownerRef: React.RefObject<HTMLElement | null>;
    }[];
    lastRenderedTranslate?: Translator;
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

/**
 * Read a setting off the registration whose owner is focused, falling back to
 * the last one that was, then to the most recent registration.
 *
 * The tray is shared by every viewer on the page, so which viewer's settings
 * it should reflect is a question about focus. `theme` and `translate` answer
 * it the same way; only the field read differs.
 */
function getTraySetting<T>(
    read: (registration: VirtualKeyboardState["registrations"][number]) => T,
): T | undefined {
    const activeRegistration = getActiveRegistration();
    if (activeRegistration) {
        return read(activeRegistration);
    }
    const lastActiveRegistration = getRegistrationById(
        virtualKeyboardState.lastActiveRegistrationId,
    );
    if (lastActiveRegistration) {
        return read(lastActiveRegistration);
    }
    // No owner is currently focused — use the last registration so the tray
    // reflects the correct setting even before any interaction (e.g. on
    // initial page load).
    const registrations = virtualKeyboardState.registrations;
    const lastRegistration = registrations[registrations.length - 1];
    return lastRegistration ? read(lastRegistration) : undefined;
}

function rerenderTray() {
    const theme = getTraySetting((registration) => registration.theme);
    const translate = getTraySetting((registration) => registration.translate);
    // The focusin listener fires on every focus change anywhere in the
    // document. Skip the React re-render when what the tray already shows is
    // correct — reconciling the MathJaxContext + tray subtree on every focus
    // event would be wasteful.
    // getAttribute returns null when the attribute is absent; theme is
    // undefined when no owner has an explicit theme (renders as light).
    // Both cases mean "no data-theme attribute", so normalize null→undefined
    // before comparing so they compare equal. The translator has no DOM
    // counterpart to read back, so the last one rendered is recorded instead;
    // it is memoized per locale, making identity a sound comparison.
    const trayEl = getTrayElement();
    if (trayEl) {
        const currentTheme =
            (trayEl.getAttribute("data-theme") as
                "dark" | "light" | null | undefined) ?? undefined;
        if (
            currentTheme === theme &&
            virtualKeyboardState.lastRenderedTranslate === translate
        ) {
            return;
        }
    }
    virtualKeyboardState.lastRenderedTranslate = translate;
    virtualKeyboardState.keyboardReactRoot?.render(
        renderTray(theme, translate),
    );
}

function renderTray(
    theme: "dark" | "light" | undefined,
    translate: Translator | undefined,
) {
    return (
        <MathJaxContext config={mathjaxConfig} version={4}>
            <KeyboardTray
                theme={theme}
                translate={translate}
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
    translate,
    ownerRef,
}: {
    onClick: OnClick;
    theme?: "dark" | "light";
    translate?: Translator;
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
            translate,
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
            registration.translate = translate;
            registration.ownerRef = ownerRef;
            rerenderTray();
        }
    }, [onClick, ownerRef, theme, translate]);

    // This component doesn't render anything directly. Instead it relies on a common instance of the keyboard tray already existing.
    return null;
}
