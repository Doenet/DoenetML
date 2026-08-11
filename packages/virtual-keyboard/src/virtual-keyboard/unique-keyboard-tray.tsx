import React from "react";
import { createRoot, Root } from "react-dom/client";
import { OnClick } from "./keyboard";
import {
    getVirtualKeyboardTrayElement,
    isInVirtualKeyboardTray,
    KeyboardTray,
} from "./keyboard-tray";
import { KeyCommand } from "./keys";
import { MathJaxContext } from "@doenet/utils/mathjax";
import { hasCoarsePrimaryPointer, mathjaxConfig } from "@doenet/utils";
import type { Direction, Translator } from "@doenet/i18n";

type VirtualKeyboardState = {
    count: number;
    /**
     * Whether the tray is expanded. Held here rather than in the tray
     * component because focus moving into a math input opens it, and that
     * happens outside the tray's own React tree — in another window entirely
     * when the viewer is embedded in an iframe.
     */
    open: boolean;
    /**
     * Whether the reader closed the tray themselves. Their choice outlasts the
     * input they made it in: the tray then stays shut as they move between
     * math inputs, rather than springing back open at each one.
     */
    userClosedTray: boolean;
    /** Subscribers to `open`, so a change re-renders only the tray itself. */
    openListeners: Set<() => void>;
    /**
     * The viewers that currently have a math input focused, each identified by
     * the `ownerRef` it registered with.
     *
     * A page can hold several viewers, and each watches focus on its own and
     * reports only about its own inputs. The tray belongs open while *any* of
     * them has a math input focused, so their reports are collected rather
     * than allowed to overwrite one another: otherwise a viewer announcing
     * "none of mine is focused" — which every other viewer on the page does
     * the moment the reader taps into one of them — would shut the tray that
     * the tapped viewer just opened.
     */
    focusedMathInputSources: Set<object>;
    keyboardDomNode: HTMLElement | null;
    keyboardReactRoot: Root | null;
    registrations: {
        id: number;
        onClick: OnClick;
        theme?: "dark" | "light";
        translate?: Translator;
        /**
         * The reader's writing direction, for the tray's own chrome. Prop-drilled
         * for the same reason `translate` is: the tray lives in its own React
         * root on `document.body` and inherits nothing from any viewer.
         */
        direction?: Direction;
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
        open: false,
        userClosedTray: false,
        openListeners: new Set(),
        focusedMathInputSources: new Set(),
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

    if (isInVirtualKeyboardTray(activeElement)) {
        return getRegistrationById(
            virtualKeyboardState.lastActiveRegistrationId,
        );
    }

    return null;
}

/**
 * The registration whose settings the tray should reflect: the one whose owner
 * is focused, else the last one that was, else the most recent registration.
 *
 * The tray is shared by every viewer on the page, so which viewer's `theme`,
 * `translate` and `direction` it shows is a question about focus.
 */
function getTrayRegistration():
    VirtualKeyboardState["registrations"][number] | undefined {
    const activeRegistration = getActiveRegistration();
    if (activeRegistration) {
        return activeRegistration;
    }
    const lastActiveRegistration = getRegistrationById(
        virtualKeyboardState.lastActiveRegistrationId,
    );
    if (lastActiveRegistration) {
        return lastActiveRegistration;
    }
    // No owner is currently focused — use the last registration so the tray
    // reflects the correct settings even before any interaction (e.g. on
    // initial page load).
    const registrations = virtualKeyboardState.registrations;
    return registrations[registrations.length - 1];
}

/**
 * Tells every viewer on the page which keyboard the reader has just asked for.
 *
 * Broadcast rather than sent to the focused viewer alone, because a viewer
 * needs this to decide whether to keep the device's own on-screen keyboard
 * down, and that has to be settled before the reader focuses one of its
 * inputs — reaching for the Doenet keyboard before touching any input is the
 * ordinary way to start on a phone.
 */
function broadcastKeyboardChoice(open: boolean) {
    const choice: KeyCommand[] = [
        {
            type: "keyboardChoice",
            command: open ? "virtual" : "system",
            timestamp: +new Date(),
        },
    ];
    for (const registration of virtualKeyboardState.registrations) {
        registration.onClick(choice);
    }
}

function getTrayOpen() {
    return virtualKeyboardState.open;
}

function subscribeToTrayOpen(listener: () => void) {
    virtualKeyboardState.openListeners.add(listener);
    return () => {
        virtualKeyboardState.openListeners.delete(listener);
    };
}

function setTrayOpen(open: boolean, { byUser }: { byUser: boolean }) {
    if (byUser) {
        virtualKeyboardState.userClosedTray = !open;
        // Only the reader's own choice decides which keyboard they get. The
        // tray following focus around the page is not them asking for the
        // device's keyboard back.
        broadcastKeyboardChoice(open);
    }
    if (virtualKeyboardState.open === open) {
        return;
    }
    virtualKeyboardState.open = open;
    // Notify the tray rather than re-rendering the whole tray root: the root
    // holds the `MathJaxContext` that typesets the keys, and tearing that down
    // and rebuilding it on every open and close both wastes the work and can
    // interrupt a typeset already in flight.
    for (const listener of virtualKeyboardState.openListeners) {
        listener();
    }
}

/**
 * Reports that focus has entered or left one of `source`'s math inputs, so the
 * tray can follow it on devices that have no physical keyboard.
 *
 * `source` identifies the reporting viewer — any object stable for that
 * viewer's lifetime; callers pass the `ownerRef` they registered with. Reports
 * are about that viewer's own inputs only, and are collected across viewers:
 * see `focusedMathInputSources`.
 *
 * Only touch devices get this treatment. On a desktop the tray stays under the
 * reader's manual control, as it always has: it occupies a fixed strip along
 * the bottom of the window, and springing that open at every math input would
 * be an imposition on a reader who has a keyboard in front of them.
 */
export function reportMathInputFocus(
    source: object,
    mathInputFocused: boolean,
) {
    if (!hasCoarsePrimaryPointer()) {
        return;
    }

    const focusedSources = virtualKeyboardState.focusedMathInputSources;

    if (mathInputFocused) {
        focusedSources.add(source);
        if (!virtualKeyboardState.userClosedTray) {
            setTrayOpen(true, { byUser: false });
        }
        return;
    }

    if (isInVirtualKeyboardTray(document.activeElement)) {
        // The reader moved into the keyboard itself to operate it. They are
        // still editing the input they left, so this viewer keeps its claim on
        // the tray and the tray must not fold away underneath them.
        return;
    }

    focusedSources.delete(source);
    if (focusedSources.size > 0) {
        // Another viewer on the page still has a math input focused; this
        // report is only about focus leaving this one's.
        return;
    }

    // Focus has gone somewhere that is not a math input — a text input, say,
    // whose editing wants the device's own keyboard and all the screen the
    // tray is occupying. Closing is not the reader's own choice, so it does
    // not count against reopening at the next math input.
    setTrayOpen(false, { byUser: false });
}

function rerenderTray() {
    const registration = getTrayRegistration();
    const theme = registration?.theme;
    const translate = registration?.translate;
    const direction = registration?.direction;
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
    // `dir` is read back off the DOM the same way `data-theme` is. It has to be
    // part of this comparison: moving focus between two viewers whose readers
    // differ only in direction would otherwise leave the tray facing the way
    // the previous one did.
    const trayEl = getVirtualKeyboardTrayElement();
    if (trayEl) {
        const currentTheme =
            (trayEl.getAttribute("data-theme") as
                "dark" | "light" | null | undefined) ?? undefined;
        const currentDirection =
            (trayEl.getAttribute("dir") as Direction | null | undefined) ??
            undefined;
        // Whether the tray is open is deliberately not part of this
        // comparison: it does not come from a registration, and it reaches the
        // tray by subscription rather than by re-rendering this root.
        if (
            currentTheme === theme &&
            currentDirection === direction &&
            virtualKeyboardState.lastRenderedTranslate === translate
        ) {
            return;
        }
    }
    virtualKeyboardState.lastRenderedTranslate = translate;
    virtualKeyboardState.keyboardReactRoot?.render(
        renderTray(theme, translate, direction),
    );
}

/**
 * Subscribes the tray to the shared open state, so that opening and closing it
 * — including when focus moving into a math input opens it — re-renders the
 * tray alone and leaves the `MathJaxContext` above it untouched.
 */
function TrayWithSharedOpenState({
    theme,
    translate,
    direction,
}: {
    theme: "dark" | "light" | undefined;
    translate: Translator | undefined;
    direction: Direction | undefined;
}) {
    const open = React.useSyncExternalStore(
        subscribeToTrayOpen,
        getTrayOpen,
        getTrayOpen,
    );

    return (
        <KeyboardTray
            theme={theme}
            translate={translate}
            direction={direction}
            open={open}
            onOpenChange={(nextOpen) => setTrayOpen(nextOpen, { byUser: true })}
            onClick={(e) => {
                // Route key events only to the active (focused) owner.
                getActiveRegistration()?.onClick(e);
            }}
        />
    );
}

function renderTray(
    theme: "dark" | "light" | undefined,
    translate: Translator | undefined,
    direction: Direction | undefined,
) {
    return (
        <MathJaxContext config={mathjaxConfig} version={4}>
            <TrayWithSharedOpenState
                theme={theme}
                translate={translate}
                direction={direction}
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
    direction,
    translate,
    ownerRef,
}: {
    onClick: OnClick;
    theme?: "dark" | "light";
    translate?: Translator;
    /** The reader's writing direction, for the tray's own chrome. */
    direction?: Direction;
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
            direction,
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
                // The tray itself is gone, so neither is there a tray that is
                // open nor a reader who has closed one, and no viewer is left
                // to claim one. Leaving these set would have the next tray
                // built on the page inherit the disposition of a tray its
                // reader never saw.
                virtualKeyboardState.open = false;
                virtualKeyboardState.userClosedTray = false;
                virtualKeyboardState.focusedMathInputSources.clear();
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
            registration.direction = direction;
            registration.ownerRef = ownerRef;
            rerenderTray();
        }
    }, [onClick, ownerRef, theme, translate, direction]);

    // This component doesn't render anything directly. Instead it relies on a common instance of the keyboard tray already existing.
    return null;
}
