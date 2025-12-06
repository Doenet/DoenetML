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
};

const globalThis = Function("return this")() || {};

const virtualKeyboardState: VirtualKeyboardState =
    globalThis?.virtualKeyboardState || {
        count: 0,
        keyboardDomNode: null,
        keyboardReactRoot: null,
        callbacks: [],
    };
globalThis.virtualKeyboardState = virtualKeyboardState;

/**
 * An expandable keyboard tray that is unique among the document. If multiple instances of `UniqueKeyboardTray` are used,
 * only one will be inserted into the document.
 */
export function UniqueKeyboardTray({ onClick }: { onClick: OnClick }) {
    React.useEffect(() => {
        // If the count is zero, we need to create the tray.
        if (virtualKeyboardState.count === 0) {
            const keyboardDomNode = document.createElement("footer");
            keyboardDomNode.id = "virtual-keyboard-dummy";
            document.body.appendChild(keyboardDomNode);
            virtualKeyboardState.keyboardDomNode = keyboardDomNode;

            const root = createRoot(keyboardDomNode);
            virtualKeyboardState.keyboardReactRoot = root;
            root.render(
                <MathJaxContext config={mathjaxConfig} version={4}>
                    <KeyboardTray
                        onClick={(e) => {
                            virtualKeyboardState.callbacks.forEach((cb) =>
                                cb(e),
                            );
                        }}
                    />
                </MathJaxContext>,
            );
        }
        // Add ourselves to the keyboard count and the list of callbacks.
        virtualKeyboardState.count += 1;
        virtualKeyboardState.callbacks.push(onClick);

        return () => {
            // Remove ourselves from the list of callbacks and decrement the count.
            const callbackIndex =
                virtualKeyboardState.callbacks.indexOf(onClick);
            virtualKeyboardState.callbacks.splice(callbackIndex, 1);
            virtualKeyboardState.count -= 1;

            // If the count is zero, we need to remove the tray.
            if (virtualKeyboardState.count === 0) {
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
            }
        };
    }, []);

    // This component doesn't render anything directly. Instead it relies on a common instance of the keyboard tray already existing.
    return null;
}
