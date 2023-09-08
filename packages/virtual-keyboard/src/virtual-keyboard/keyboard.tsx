import { Box, Button } from "@chakra-ui/react";
import React from "react";
import "./index.css";

export type Style =
    | "numeric"
    | "function"
    | "alpha_lower"
    | "alpha_upper"
    | "symbol"
    | "greek_lower"
    | "greek_upper";
export type KeyCommand = {
    type: "keystroke" | "type" | "write" | "cmd";
    command: string;
};

const KEYS = {
    alpha_lower: "qwertyuiopasdfghjklzxcvbnm,'".split("").map((c) => ({
        displayName: c,
        name: c,
        commands: [{ type: "write", command: c }],
    })),
    alpha_upper: "QWERTYUIOPASDFGHJKLZXCVBNM,'".split("").map((c) => ({
        displayName: c,
        name: c,
        commands: [{ type: "type", command: c }],
    })),
    numeric: "1234567890".split("").map((c) => ({ type: "write", command: c })),
    greek_lower: "αβγδεζηθικλμνξοπρστυφχψω",
};

const SPECIAL_KEYS = {
    shift: {
        displayName: "⇧",
        name: "shift",
        commands: [{ type: "cmd", command: "Shift" }],
    },
    backspace: {
        displayName: "⌫",
        name: "backspace",
        commands: [{ type: "keystroke", command: "Backspace" }],
    },
    space: {
        displayName: "␣",
        name: "space",
        commands: [{ type: "write", command: "\\ " }],
    },
    left: {
        displayName: "←",
        name: "left",
        commands: [{ type: "keystroke", command: "Left" }],
    },
    right: {
        displayName: "→",
        name: "right",
        commands: [{ type: "keystroke", command: "Right" }],
    },
};

export function Keyboard({
    style,
    onClick,
}: {
    style: Style;
    onClick: (command: KeyCommand) => void;
}) {
    switch (style) {
        case "alpha_lower":
            return (
                <div className="virtual-keyboard">
                    <Qwerty type="lower" />
                </div>
            );
        case "alpha_upper":
            return <Qwerty type="upper" />;
        //     case "numeric":
        //         return <Numeric />;
        //     case "symbol":
        //         return <Symbol />;
        //     case "greek_lower":
        //         return <Greek type="lower" />;
        //     case "greek_upper":
        //         return <Greek type="upper" />;
    }
}

/**
 * Makes a QWERTY keyboard layout with a space bar/etc.
 */
function Qwerty({ type }: { type: "upper" | "lower" }) {
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
    ];

    return (
        <React.Fragment>
            {[row1, row2, row3, row4].map((row, i) => (
                <div key={i} className="row">
                    {row.map((key) => (
                        <button
                            key={key.displayName}
                            className={`key key-${key.name}`}
                        >
                            {key.displayName}
                        </button>
                    ))}
                </div>
            ))}
        </React.Fragment>
    );
}
