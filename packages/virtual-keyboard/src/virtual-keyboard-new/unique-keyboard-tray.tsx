import React from "react";
import ReactDOM from "react-dom";
import { OnClick } from "./keyboard";

const virtualKeyboardState = {
    count: 0
}

/**
 * An expandable keyboard tray that is unique among the document. If multiple instances of `UniqueKeyboardTray` are used,
 * only one will be inserted into the document.
 */
export function UniqueKeyboardTray({ onClick }: { onClick: OnClick }) {
    return ReactDOM.createPortal(<div id="virtual-keyboard-tray">My unique content</div>, document.body);
}
