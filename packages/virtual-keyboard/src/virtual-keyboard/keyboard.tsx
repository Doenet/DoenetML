import React from "react";
import "./keyboard.css";
import {
    FUNCTION_KEYS,
    KEYS,
    KeyCommand,
    KeyDescription,
    OPERATOR_KEYS,
    OTHER_SYMBOLS,
    SPECIAL_KEYS,
    SYMBOL_KEYS,
    TRIG_KEYS,
    VAR_KEYS,
} from "./keys";
import { MathJax } from "better-react-mathjax";

export type Style =
    | "numeric"
    | "function"
    | "alpha_lower"
    | "alpha_upper"
    | "symbol"
    | "greek_lower"
    | "greek_upper";

export type OnClick = (commands: KeyCommand[]) => void;

const BackspaceIcon = (
    <svg
        aria-hidden="true"
        focusable="false"
        data-prefix="fas"
        data-icon="delete-left"
        className="svg-inline--fa fa-delete-left "
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
    >
        <path
            fill="currentColor"
            d="M576 128c0-35.3-28.7-64-64-64H205.3c-17 0-33.3 6.7-45.3 18.7L9.4 233.4c-6 6-9.4 14.1-9.4 22.6s3.4 16.6 9.4 22.6L160 429.3c12 12 28.3 18.7 45.3 18.7H512c35.3 0 64-28.7 64-64V128zM271 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"
        ></path>
    </svg>
);

/**
 * On-screen keyboard
 */
export function Keyboard({
    style,
    onClick,
}: {
    style: Style;
    onClick: OnClick;
}) {
    switch (style) {
        case "alpha_lower":
            return (
                <div className="virtual-keyboard alpha">
                    <Qwerty type="lower" onClick={onClick} />
                </div>
            );
        case "alpha_upper":
            return (
                <div className="virtual-keyboard alpha">
                    <Qwerty type="upper" onClick={onClick} />
                </div>
            );
        case "numeric":
            return (
                <div className="virtual-keyboard numeric">
                    <Numeric onClick={onClick} />
                </div>
            );
        case "greek_lower":
            return (
                <div className="virtual-keyboard greek">
                    <Greek type="lower" onClick={onClick} />
                </div>
            );
        case "greek_upper":
            return (
                <div className="virtual-keyboard greek">
                    <Greek type="upper" onClick={onClick} />
                </div>
            );
        case "symbol":
            return (
                <div className="virtual-keyboard symbol">
                    <Symbol onClick={onClick} />
                </div>
            );
        case "function":
            return (
                <div className="virtual-keyboard composite">
                    <Composite onClick={onClick} />
                </div>
            );
    }
}

function Key({
    keyInfo,
    onClick,
}: {
    keyInfo: KeyDescription;
    onClick: OnClick;
}) {
    let content: React.ReactNode = keyInfo.displayName;
    if (keyInfo.isMath) {
        // Note: set `pointerEvents` to "none" so that clicks press the key
        // rather than select the MathJax.
        content = (
            <div style={{ pointerEvents: "none" }}>
                <MathJax>{"\\(" + content + "\\)"}</MathJax>
            </div>
        );
    }
    if (keyInfo.name === "backspace") {
        content = BackspaceIcon;
    }

    return (
        <button
            className={`key key-${keyInfo.name} ${keyInfo.isMath ? "math" : ""}`}
            onClick={(e) => {
                // Prevent the click event on the keyboard itself from triggering
                // so that its "accessed" event doesn't cancel the propagation
                // of the key click event.
                e.stopPropagation();
                onClick(keyInfo.commands);
            }}
            title={`Type ${keyInfo.name}`}
        >
            {content}
        </button>
    );
}

/**
 * Makes a QWERTY keyboard layout with a space bar/etc.
 */
function Qwerty({
    type,
    onClick,
}: {
    type: "upper" | "lower";
    onClick: OnClick;
}) {
    const keys = type === "upper" ? KEYS.alpha_upper : KEYS.alpha_lower;

    const row1 = keys.slice(0, 10);
    const row2 = keys.slice(10, 19);
    const row3 = [
        SPECIAL_KEYS.shift,
        ...keys.slice(19, 26),
        SPECIAL_KEYS.backspace,
    ];
    const row4 = [
        ...keys.slice(26, 29),
        SPECIAL_KEYS.space,
        SPECIAL_KEYS.left,
        SPECIAL_KEYS.right,
        SPECIAL_KEYS.enter,
    ];

    return (
        <React.Fragment>
            {[row1, row2, row3, row4].map((row, i) => (
                <div key={i} className="row">
                    {row.map((key) => (
                        <Key keyInfo={key} onClick={onClick} key={key.name} />
                    ))}
                </div>
            ))}
        </React.Fragment>
    );
}

/**
 * Make a Numeric keyboard with special keys for variables/exponents/inequalities
 */
function Numeric({ onClick }: { onClick: OnClick }) {
    const row1 = [
        ...KEYS.numeric.slice(0, 3),
        OPERATOR_KEYS.times,
        OPERATOR_KEYS.divide,
    ];
    const row2 = [
        ...KEYS.numeric.slice(3, 6),
        OPERATOR_KEYS.plus,
        OPERATOR_KEYS.minus,
    ];
    const row3 = [
        ...KEYS.numeric.slice(6, 9),
        OPERATOR_KEYS.equals,
        SPECIAL_KEYS.backspace,
    ];
    const row4 = [
        ...KEYS.numeric.slice(9),
        SPECIAL_KEYS.left,
        SPECIAL_KEYS.right,
        SPECIAL_KEYS.enter,
    ];

    return (
        <React.Fragment>
            <div className="keyboard-region">
                {Object.values(VAR_KEYS).map((key) => (
                    <Key keyInfo={key} onClick={onClick} key={key.name} />
                ))}
            </div>
            <div className="sub-keyboard">
                {[row1, row2, row3, row4].map((row, i) => (
                    <div key={i} className="row">
                        {row.map((key) => (
                            <Key
                                keyInfo={key}
                                onClick={onClick}
                                key={key.name}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </React.Fragment>
    );
}

function Symbol({ onClick }: { onClick: OnClick }) {
    return (
        <React.Fragment>
            <div className="keyboard-region">
                {Object.values(SYMBOL_KEYS).map((key) => (
                    <Key keyInfo={key} onClick={onClick} key={key.name} />
                ))}
            </div>
            <div className="keyboard-region">
                {Object.values(OTHER_SYMBOLS).map((key) => (
                    <Key keyInfo={key} onClick={onClick} key={key.name} />
                ))}
                {[
                    SPECIAL_KEYS.left,
                    SPECIAL_KEYS.right,
                    SPECIAL_KEYS.backspace,
                    SPECIAL_KEYS.enter,
                ].map((key) => (
                    <Key keyInfo={key} onClick={onClick} key={key.name} />
                ))}
            </div>
        </React.Fragment>
    );
}

/**
 * Makes a Greek keyboard layout with a space bar/etc.
 */
function Greek({
    type,
    onClick,
}: {
    type: "upper" | "lower";
    onClick: OnClick;
}) {
    const keys = type === "upper" ? KEYS.greek_upper : KEYS.greek_lower;

    const row1 = keys.slice(0, 10);
    const row2 = keys.slice(10, 19);
    const row3 = [
        SPECIAL_KEYS.shift,
        ...keys.slice(19, 26),
        SPECIAL_KEYS.backspace,
    ];
    const row4 = [
        ...keys.slice(26, 29),
        SPECIAL_KEYS.space,
        SPECIAL_KEYS.left,
        SPECIAL_KEYS.right,
        SPECIAL_KEYS.enter,
    ];

    return (
        <React.Fragment>
            {[row1, row2, row3, row4].map((row, i) => (
                <div key={i} className="row">
                    {row.map((key) => (
                        <Key keyInfo={key} onClick={onClick} key={key.name} />
                    ))}
                </div>
            ))}
        </React.Fragment>
    );
}

function Composite({ onClick }: { onClick: OnClick }) {
    return (
        <React.Fragment>
            <div className="keyboard-region">
                {Object.values(TRIG_KEYS).map((key) => (
                    <Key keyInfo={key} onClick={onClick} key={key.name} />
                ))}
            </div>
            <div className="keyboard-region">
                {Object.values(FUNCTION_KEYS).map((key) => (
                    <Key keyInfo={key} onClick={onClick} key={key.name} />
                ))}
                {[
                    SPECIAL_KEYS.backspace,
                    SPECIAL_KEYS.left,
                    SPECIAL_KEYS.right,
                    SPECIAL_KEYS.enter,
                ].map((key) => (
                    <Key keyInfo={key} onClick={onClick} key={key.name} />
                ))}
            </div>
        </React.Fragment>
    );
}
